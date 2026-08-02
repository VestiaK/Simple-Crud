import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    await prisma.$connect()
    return NextResponse.json({ message: 'Database terhubung dengan sukses!' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Koneksi database gagal', error: String(error) }, { status: 500 })
  }
}