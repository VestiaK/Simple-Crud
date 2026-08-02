import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/jwt'

type AuthUser = {
  id: string
  email: string
  role: string
}

function getAuthUser(req: NextApiRequest): AuthUser | null {
  const token = req.cookies.token

  if (!token) {
    return null
  }

  try {
    const payload = verifyToken(token)
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    }
  } catch {
    return null
  }
}

function canManageEmployee(role: string): boolean {
  return role === 'ADMIN' || role === 'USER'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getAuthUser(req)

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (!canManageEmployee(user.role)) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  if (req.method === 'GET') {
    try {
      const employees = await prisma.employee.findMany({
        orderBy: { createdAt: 'desc' },
      })

      return res.status(200).json({ employees })
    } catch (error) {
      return res.status(500).json({ message: 'Gagal mengambil data karyawan', error: String(error) })
    }
  }

  if (req.method === 'POST') {
    try {
      const { nip, name, position, division, status } = req.body as {
        nip?: string
        name?: string
        position?: string
        division?: string
        status?: string
      }

      if (!nip || !name || !position || !division || !status) {
        return res.status(400).json({ message: 'nip, name, position, division, status wajib diisi' })
      }

      const existing = await prisma.employee.findUnique({ where: { nip } })
      if (existing) {
        return res.status(409).json({ message: 'NIP sudah terdaftar' })
      }

      const employee = await prisma.employee.create({
        data: {
          nip,
          name,
          position,
          division,
          status,
        },
      })

      return res.status(201).json({ message: 'Karyawan berhasil dibuat', employee })
    } catch (error) {
      return res.status(500).json({ message: 'Gagal membuat karyawan', error: String(error) })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
