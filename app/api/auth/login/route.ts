import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma'
import { signToken } from '../../../../lib/jwt'

export async function POST(request: NextRequest) {
  try {
    // Membaca body request JSON
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: 'Email dan password wajib diisi' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ message: 'Email atau password salah' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json({ message: 'Email atau password salah' }, { status: 401 })
    }

    // Generate JWT Token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    // Buat response JSON terlebih dahulu
    const response = NextResponse.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 200 })

    // Set cookie langsung menggunakan API bawaan NextResponse
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 Hari
      secure: process.env.NODE_ENV === 'production',
    })

    return response
  } catch (error) {
    return NextResponse.json({
      message: 'Gagal login',
      error: String(error),
    }, { status: 500 })
  }
}