import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = magicLinkSchema.parse(body)
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No account found with this email address' },
        { status: 404 }
      )
    }

    // Generate magic link token (valid for 15 minutes)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')
    
    // Create magic link
    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/magic-login?token=${token}`
    
    // Log magic link generation
    await prisma.systemLogs.create({
      data: {
        action: 'MAGIC_LINK_GENERATED',
        details: `Magic link generated for ${validatedData.email}`,
        userId: user.id,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })
    
    // Here you would send an email with the magic link
    // For demo purposes, we'll return the link in the response
    return NextResponse.json({
      success: true,
      message: 'Magic link generated successfully',
      magicLink,
      // In production, you would send this via email:
      emailSent: process.env.NODE_ENV === 'production'
    })
  } catch (error: any) {
    console.error('Magic link error:', error)
    
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
