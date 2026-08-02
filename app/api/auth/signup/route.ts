import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Nama, email, dan password wajib diisi' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    })

    return NextResponse.json({
      message: 'Signup berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }, { status: 201 })
    
  } catch (error) {
    return NextResponse.json({
      message: 'Gagal signup',
      error: String(error),
    }, { status: 500 })
  }
}