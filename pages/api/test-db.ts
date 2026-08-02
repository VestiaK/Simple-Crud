import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const count = await prisma.employee.count()

    return res.status(200).json({
      status: 'success',
      message: 'Koneksi database Neon berhasil! 🚀',
      employeeCount: count,
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Gagal terhubung ke database Neon.',
      error: String(error),
    })
  }
}