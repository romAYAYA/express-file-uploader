export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'secret',
  accessTokenExpire: '10m',
  refreshTokenExpire: '7d'
}
