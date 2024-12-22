import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const initializeDatabase = async (): Promise<void> => {
  let retries = 5
  while (retries) {
    try {
      const connection = await db.getConnection()
      console.log('😇 Database successfully connected')
      connection.release()
      break
    } catch (err) {
      console.error('🤡 Failed to connect to the database. Retrying...', err)
      retries -= 1
      await new Promise(res => setTimeout(res, 5000))
    }
  }
  if (!retries) process.exit(1)
}
