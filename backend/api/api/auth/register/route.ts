import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Create user
    const user = await createUser(validatedData)
    
    // Log the registration
    await prisma.systemLogs.create({
      data: {
        action: 'USER_REGISTRATION',
        details: `New user registered: ${user.email}`,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
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
