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

  const id = req.query.id
  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ message: 'ID tidak valid' })
  }

  if (req.method === 'PUT') {
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

      const duplicateNip = await prisma.employee.findFirst({
        where: {
          nip,
          NOT: { id },
        },
      })

      if (duplicateNip) {
        return res.status(409).json({ message: 'NIP sudah dipakai karyawan lain' })
      }

      const employee = await prisma.employee.update({
        where: { id },
        data: {
          nip,
          name,
          position,
          division,
          status,
        },
      })

      return res.status(200).json({ message: 'Karyawan berhasil diupdate', employee })
    } catch (error) {
      return res.status(500).json({ message: 'Gagal update karyawan', error: String(error) })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.employee.delete({ where: { id } })
      return res.status(200).json({ message: 'Karyawan berhasil dihapus' })
    } catch (error) {
      return res.status(500).json({ message: 'Gagal menghapus karyawan', error: String(error) })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
