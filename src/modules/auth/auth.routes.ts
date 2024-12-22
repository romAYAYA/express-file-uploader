import { Router } from 'express'
import AuthController from './auth.controller'
import AuthService from './auth.service'
import UserRepository from '../user/user.repository'
import { authenticate } from '../../middlewares/auth'

const router = Router()

const userRepository = new UserRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

router.post('/signup', authController.signup.bind(authController))
router.post('/signin', authController.signin.bind(authController))

router.use(authenticate)

router.get('/logout', authController.logout.bind(authController))
router.post('/signin/new_token', authController.refreshTokens.bind(authController))

export default router
