import UserService from './user.service'
import { Request, Response } from 'express'

export default class UserController {
  constructor(private userService: UserService) {
  }

  async getUserInfo(req: Request, res: Response) {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const id = req.user.id

    try {
      const user = await this.userService.getUserInfo(id)
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return
      }
      res.status(200).json(user)
    } catch (err) {
      console.error('getUserInfo UserController error:', err)
      res.status(500).json({ error: (err as Error).message })
    }
  }
}