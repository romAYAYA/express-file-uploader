import { db } from "../../config/database"
import type { User } from "./user.types"

export default class UserRepository {
  async createUser(id: string, password: string): Promise<{ id: string }> {
    try {
      await db.query(`INSERT INTO users (id, password) VALUES (?, ?)`, [id, password])
      return { id }
    } catch (err) {
      console.error('createUser UserRepository error:', err)
      return { id: '' }
    }
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const [rows] = await db.query(`SELECT id, password FROM users WHERE id = ?`, [id])
      const users: User[] = rows as User[]
      return users[0] || null
    } catch (err) {
      console.error('getUser UserRepository error:', err)
      return null
    }
  }

  async getUserInfo(id: string): Promise<User | null> {
    try {
      const [rows] = await db.query(`SELECT id FROM users WHERE id = ?`, [id])
      const users: User[] = rows as User[]
      return users[0] || null
    } catch (err) {
      console.error('getUserInfo UserRepository error:', err)
      return null
    }
  }
}
