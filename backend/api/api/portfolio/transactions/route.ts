import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const transactionSchema = z.object({
  type: z.enum(['deposit', 'withdrawal']),
  amount: z.number().positive('Amount must be positive'),
  method: z.string().min(1, 'Payment method is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = transactionSchema.parse(body)
    
    // Get user from token (simplified for demo)
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // For demo purposes, we'll use a hardcoded user ID
    // In production, you'd decode the JWT token to get the user ID
    const userId = "demo-user-id"
    
    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: validatedData.type,
        amount: validatedData.amount,
        method: validatedData.method,
        status: 'completed',
        timestamp: new Date()
      }
    })
    
    // Update user balance
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user) {
      const newBalance = validatedData.type === 'deposit' 
        ? user.balance + validatedData.amount
        : user.balance - validatedData.amount
      
      await prisma.user.update({
        where: { id: userId },
        data: { balance: newBalance }
      })
    }
    
    // Log the transaction
    await prisma.systemLogs.create({
      data: {
        action: 'TRANSACTION_COMPLETED',
        details: `${validatedData.type} of $${validatedData.amount} via ${validatedData.method}`,
        userId,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Transaction completed successfully',
      transaction
    })
  } catch (error: any) {
    console.error('Transaction error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // For demo purposes, we'll use a hardcoded user ID
    const userId = "demo-user-id"
    
    // Get user's transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50 // Limit to 50 most recent
    })
    
    return NextResponse.json({
      success: true,
      transactions
    })
  } catch (error: any) {
    console.error('Transactions fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
