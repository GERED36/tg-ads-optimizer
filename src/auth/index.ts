import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '../db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'

export interface AuthPayload {
  userId: string
  email: string
  role: string
}

export async function register(email: string, password: string, name?: string): Promise<string> {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Пользователь с таким email уже существует')

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, passwordHash, name, role: 'user' },
  })

  return jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}

export async function login(email: string, password: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return null

  return jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}

export function verify(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  } catch {
    return null
  }
}
