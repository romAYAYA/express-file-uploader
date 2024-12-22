import { Request, Response, NextFunction } from 'express'
import TokenService from '../modules/token/token.service'

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  try {
    const payload: any = await TokenService.verifyToken(token)
    const isRevoked = await TokenService.isTokenRevoked(payload.id, payload.jti)
    if (isRevoked) {
      res.status(401).json({ error: 'Token is revoked' })
      return
    }

    req.user = payload
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
