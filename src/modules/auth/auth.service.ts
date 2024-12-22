import TokenService from '../token/token.service'
import UserRepository from '../user/user.repository'
import bcrypt from 'bcrypt'

export default class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signup(id: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.getUser(id)
    if (user) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const createdUser = await this.userRepository.createUser(id, hashedPassword)

    return await TokenService.generateTokens({ id: createdUser.id })
  }

  async signin(id: string, password: string) {
    const user = await this.userRepository.getUser(id)
    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }

    return await TokenService.generateTokens({ id })
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    return TokenService.refresh(refreshToken)
  }
}
