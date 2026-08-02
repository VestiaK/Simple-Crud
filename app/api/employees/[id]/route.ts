import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { verifyToken } from '../../../../lib/jwt'

type AuthUser = {
  id: string
  email: string
  role: string
}

function getAuthUser(req: NextRequest): AuthUser | null {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return null
  }

  try {
    const payload = verifyToken(token) as AuthUser
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const user = getAuthUser(request)
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  if (!canManageEmployee(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const resolvedParams = await context.params;
  const id = resolvedParams.id;

  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { nip, name, position, division, status } = body

    if (!nip || !name || !position || !division || !status) {
      return NextResponse.json({ message: 'nip, name, position, division, status wajib diisi' }, { status: 400 })
    }

    const duplicateNip = await prisma.employee.findFirst({
      where: {
        nip,
        NOT: { id },
      },
    })

    if (duplicateNip) {
      return NextResponse.json({ message: 'NIP sudah dipakai karyawan lain' }, { status: 409 })
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: { nip, name, position, division, status },
    })

    return NextResponse.json({ message: 'Karyawan berhasil diupdate', employee }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal update karyawan', error: String(error) }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const user = getAuthUser(request)
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  if (!canManageEmployee(user.role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const resolvedParams = await context.params;
  const id = resolvedParams.id;

  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ message: 'ID tidak valid' }, { status: 400 })
  }

  try {
    await prisma.employee.delete({ where: { id } })
    return NextResponse.json({ message: 'Karyawan berhasil dihapus' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Gagal menghapus karyawan', error: String(error) }, { status: 500 })
  }
}