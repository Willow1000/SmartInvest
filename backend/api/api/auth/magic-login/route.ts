import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateToken, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url).searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 400 }
      )
    }

    // Decode and verify magic link token
    let decodedToken: string
    try {
      decodedToken = Buffer.from(token, 'base64').toString()
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid magic link' },
        { status: 400 }
      )
    }

    const [userId, timestamp] = decodedToken.split(':')
    
    // Check if token is expired (15 minutes = 900000 ms)
    if (Date.now() - parseInt(timestamp) > 900000) {
      return NextResponse.json(
        { success: false, message: 'Magic link has expired' },
        { status: 400 }
      )
    }

    // Get user and verify they exist
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid user' },
        { status: 400 }
      )
    }

    // Generate JWT token for the user
    const jwtToken = generateToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    })

    // Log successful magic link login
    await prisma.systemLogs.create({
      data: {
        action: 'MAGIC_LINK_LOGIN',
        details: `User logged in via magic link: ${user.email}`,
        userId: user.id,
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    // Create response with JWT token
    const response = NextResponse.json({
      success: true,
      message: 'Login successful via magic link',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token: jwtToken
    })

    // Set HTTP-only cookie with JWT token
    response.cookies.set('auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Magic login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
