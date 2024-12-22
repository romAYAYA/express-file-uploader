import jwt, { JwtPayload } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import redis from '../../config/redis'
import { jwtConfig } from '../../config/jwt'
import { TokenPayload } from './token.types'

export default class TokenService {
  static async generateTokens(payload: TokenPayload): Promise<{ accessToken: string; refreshToken: string; jti: string }> {
    const jti = uuidv4()

    const accessToken = jwt.sign({ ...payload, jti }, jwtConfig.secret, { expiresIn: jwtConfig.accessTokenExpire })

    const refreshToken = jwt.sign({ ...payload, jti }, jwtConfig.secret, { expiresIn: jwtConfig.refreshTokenExpire })

    await redis.set(`token:${ payload.id }:${ jti }`, refreshToken, 'EX', 7 * 24 * 60 * 60)

    return { accessToken, refreshToken, jti }
  }

  static async verifyToken(token: string): Promise<string | JwtPayload> {
    try {
      return jwt.verify(token, jwtConfig.secret)
    } catch (err) {
      throw new Error('Invalid or expired token')
    }
  }

  static async isTokenRevoked(userId: string, jti: string): Promise<boolean> {
    const status = await redis.get(`token:${ userId }:${ jti }`)
    return !status
  }

  static async revokeToken(userId: string, jti: string) {
    await redis.del(`token:${ userId }:${ jti }`)
  }

  static async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; jti: string }> {
    try {
      if (!jwtConfig.secret) {
        throw new Error('JWT secret is not defined')
      }

      const decoded = jwt.verify(refreshToken, jwtConfig.secret)

      if (typeof decoded === 'string') {
        throw new Error('Invalid token payload')
      }

      const payload = decoded as TokenPayload

      const isRevoked = await this.isTokenRevoked(payload.id, payload.jti)
      if (isRevoked) {
        throw new Error('Refresh token is revoked')
      }

      const newTokens = await this.generateTokens({ id: payload.id })

      await this.revokeToken(payload.id, payload.jti)

      return newTokens
    } catch (err) {
      throw new Error('Invalid or expired refresh token')
    }
  }
}
