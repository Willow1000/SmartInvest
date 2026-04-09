import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const institutionalSignupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(5, 'Phone number is required'),
  sourceOfCapital: z.string().min(1, 'Source of capital is required'),
  investmentAmount: z.string().min(1, 'Investment amount is required'),
  tradingExperience: z.string().min(1, 'Trading experience is required'),
  referralSource: z.string().min(1, 'Referral source is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = institutionalSignupSchema.parse(body)
    
    // Check if email already exists in institutional applications
    const existingApplication = await prisma.institutionalApplication.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingApplication) {
      return NextResponse.json(
        { success: false, message: 'An application with this email already exists' },
        { status: 400 }
      )
    }
    
    // Create institutional application
    const application = await prisma.institutionalApplication.create({
      data: {
        ...validatedData,
        status: 'PENDING',
        submittedAt: new Date()
      }
    })
    
    // Log the application submission
    await prisma.systemLogs.create({
      data: {
        action: 'INSTITUTIONAL_APPLICATION',
        details: `Institutional application submitted by ${validatedData.email}`,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! Our team will review and contact you within 24 hours.',
      application
    })
  } catch (error: any) {
    console.error('Institutional signup error:', error)
    
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
    
    // This would be for admin to view institutional applications
    const applications = await prisma.institutionalApplication.findMany({
      orderBy: { submittedAt: 'desc' },
      take: 50 // Limit to 50 most recent
    })
    
    return NextResponse.json({
      success: true,
      applications
    })
  } catch (error: any) {
    console.error('Institutional applications fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
