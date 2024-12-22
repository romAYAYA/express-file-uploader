import dotenv from 'dotenv'
import { App } from './app'
import { initializeDatabase } from './config/database'

dotenv.config()

const PORT = process.env.APP_PORT || 3000;

(async () => {
  await initializeDatabase()
  const app = new App(PORT)
  app.listen()
})()
