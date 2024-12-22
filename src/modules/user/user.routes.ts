import { Router } from 'express'
import { authenticate } from '../../middlewares/auth'
import UserRepository from './user.repository'
import UserService from './user.service'
import UserController from './user.controller'

const router = Router()

const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

router.use(authenticate)
router.get('/info', userController.getUserInfo.bind(userController))

export default router
