import { db } from '../../config/database'
import { File } from './file.types'

export default class FileRepository {
  async createFile(file: File) {
    try {
      await db.query(`
          INSERT INTO files (name, extension, mime_type, size, filename, upload_date)
          VALUES (?, ?, ?, ?, ?, NOW())
      `, [file.name, file.extension, file.mimeType, file.size, file.filename])
    } catch (err) {
      console.error('createFile FileRepository error:', err)
    }
  }

  async getFileList(page: number, listSize: number): Promise<{ files: File[]; total: number }> {
    const offset = (page - 1) * listSize;

    try {
      const [files] = await db.query(`
        SELECT id, name, extension, mime_type AS mimeType, size, upload_date AS uploadDate
        FROM files
        LIMIT ? OFFSET ?
    `, [listSize, offset])

      const [countResult] = await db.query(`SELECT COUNT(*) AS total FROM files`)
      const total = (countResult as { total: number }[])[0].total

      return { files: files as File[], total }
    } catch (err) {
      console.error('getFileList FileRepository error:', err)
      return { files: [], total: 0 }
    }
  }

  async getFileById(id: number): Promise<File | null> {
    try {
      const [rows] = await db.query(`SELECT id, name, extension, mime_type AS mimeType, size, upload_date AS uploadDate FROM files WHERE id = ?`, [id])

      const file: File[] = rows as File[]

      return file[0] || null
    } catch (err) {
      console.error('getFileById FileRepository error:', err)
      return null
    }
  }

  async getFileNameById(id: number): Promise<string | null> {
    try {
      const [rows] = await db.query(`SELECT filename FROM files WHERE id = ?`, [id])

      const file: { filename: string }[] = rows as { filename: string }[]

      return file.length > 0 ? file[0].filename : null
    } catch (err) {
      console.error('getFileNameById FileRepository error:', err)
      return null
    }
  }

  async updateFile(id: number, file: File) {
    try {
      await db.query(`
        UPDATE files
        SET name = ?, extension = ?, mime_type = ?, size = ?, filename = ?
        WHERE id = ?
      `, [file.name, file.extension, file.mimeType, file.size, file.filename, id])
    } catch (err) {
      console.error('updateFile FileRepository error:', err)
    }
  }

  async deleteFileById(id: number) {
    await db.query('DELETE FROM files WHERE id = ?', [id])
  }
}