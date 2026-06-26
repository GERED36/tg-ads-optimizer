import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const APP_PASSWORD = process.env.APP_PASSWORD || 'admin'

export interface AuthPayload {
  role: 'admin'
}

export function login(password: string): string | null {
  if (password !== APP_PASSWORD) return null
  const payload: AuthPayload = { role: 'admin' }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verify(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  } catch {
    return null
  }
}
