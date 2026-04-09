import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (token) {
      const user = verifyToken(token)
      if (user) {
        // Log the logout
        await prisma.systemLogs.create({
          data: {
            action: 'USER_LOGOUT',
            details: `User logged out: ${user.email}`,
            userId: user.id,
            ipAddress: request.ip || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown'
          }
        })
      }
    }
    
    // Clear the cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    })
    
    response.cookies.delete('auth-token')
    
    return response
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
