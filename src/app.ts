import express, { Application } from 'express'
import cors from 'cors'
import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/user/user.routes'
import fileRoutes from './modules/file/file.routes'
import path from 'path'

export class App {
  private readonly app: Application
  private readonly port: number | string

  constructor(port: number | string) {
    this.app = express()
    this.port = port

    this.initializeMiddlewares()
    this.initializeRoutes()
  }

  private initializeMiddlewares() {
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use('/uploads', express.static(path.resolve('uploads')))
  }

  private initializeRoutes() {
    this.app.use(authRoutes)
    this.app.use(userRoutes)
    this.app.use('/file', fileRoutes)
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚆🚄🚂 Server is running on port ${ this.port }`)
    })
  }
}
