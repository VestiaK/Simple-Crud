import jwt from 'jsonwebtoken'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET belum diset di environment')
  }
  return secret
}

export type JwtPayload = {
  id: string
  email: string
  role: string
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  const decoded = jwt.verify(token, getJwtSecret())

  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    typeof (decoded as { id?: unknown }).id !== 'string' ||
    typeof (decoded as { email?: unknown }).email !== 'string' ||
    typeof (decoded as { role?: unknown }).role !== 'string'
  ) {
    throw new Error('Token payload tidak valid')
  }

  return decoded as JwtPayload & jwt.JwtPayload
}