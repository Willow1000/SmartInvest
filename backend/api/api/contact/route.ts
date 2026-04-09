import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = contactSchema.parse(body)
    
    // Create contact form entry
    const contactForm = await prisma.contactForm.create({
      data: validatedData
    })
    
    // Log the contact submission
    await prisma.systemLogs.create({
      data: {
        action: 'CONTACT_FORM_SUBMISSION',
        details: `Contact form submitted by ${validatedData.email}: ${validatedData.subject}`,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      contactForm
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    
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
    
    // This would be for admin to view contact submissions
    const contactForms = await prisma.contactForm.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to 50 most recent
    })
    
    return NextResponse.json({
      success: true,
      contactForms
    })
  } catch (error: any) {
    console.error('Contact form fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
