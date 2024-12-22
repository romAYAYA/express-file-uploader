import AuthService from './auth.service'
import TokenService from '../token/token.service'
import { SigninSchema, SignupSchema, RefreshTokenSchema } from '../../schemas/auth'
import type { Request, Response } from 'express'

export default class AuthController {
  constructor(private authService: AuthService) {
  }

  async signup(req: Request, res: Response) {
    try {
      const { id, password } = SignupSchema.parse(req.body)
      const tokens = await this.authService.signup(id, password)
      res.status(201).json(tokens)
    } catch (err) {
      res.status(400).json({ error: (err as Error).message })
    }
  }

  async signin(req: Request, res: Response) {
    try {
      const { id, password } = SigninSchema.parse(req.body)
      const tokens = await this.authService.signin(id, password)
      res.status(200).json(tokens)
    } catch (err: any) {
      res.status(401).json({ error: (err as Error).message })
    }
  }

  async refreshTokens(req: Request, res: Response) {
    try {
      const { refreshToken } = RefreshTokenSchema.parse(req.body)
      const tokens = await this.authService.refreshTokens(refreshToken)
      res.status(200).json(tokens)
    } catch (err) {
      res.status(401).json({ error: (err as Error).message })
    }
  }

  async logout(req: Request, res: Response) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    try {
      const payload: any = await TokenService.verifyToken(token)
      await TokenService.revokeToken(payload.id, payload.jti)
      res.status(200).json({ message: 'Logged out successfully' })
    } catch (err) {
      res.status(401).json({ error: (err as Error).message })
    }
  }
}
