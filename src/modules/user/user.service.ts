import UserRepository from './user.repository'

export default class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserInfo(id: string) {
    return await this.userRepository.getUserInfo(id)
  }
}