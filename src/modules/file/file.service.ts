import FileRepository from './file.repository'
import { File } from './file.types'
import { fileSchema } from '../../schemas/file'
import fs from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

export default class FileService {
  private readonly APP_HOST: string

  constructor(private fileRepository: FileRepository) {
    this.APP_HOST = process.env.APP_HOST || ''
  }

  async createFile(file: Express.Multer.File) {
    const { originalname, size, mimetype, filename } = file
    const [name, extension] = originalname.split('.')

    const fileData: File = {
      name,
      extension,
      mimeType: mimetype,
      size,
      filename
    }

    fileSchema.parse(fileData)

    await this.fileRepository.createFile(fileData)
  }

  async getFileList(page: number = 1, listSize: number = 10) {
    const { files, total } = await this.fileRepository.getFileList(page, listSize)

    const filesWithUrls = files.map(file => ({
      ...file,
      url: `http://${ this.APP_HOST }:3000/uploads/${ file.filename }`
    }))

    return { files: filesWithUrls, total }
  }

  async getFilePathById(id: number): Promise<string | null> {
    const fileName = await this.fileRepository.getFileNameById(id)
    if (!fileName) return null

    return path.resolve('uploads', fileName)
  }

  async getFileById(id: number) {
    return await this.fileRepository.getFileById(id)
  }

  async updateFile(id: number, newFile: Express.Multer.File): Promise<boolean> {
    const { originalname, size, mimetype, filename } = newFile
    const [name, extension] = originalname.split('.')

    const fileData: File = {
      name,
      extension,
      mimeType: mimetype,
      size,
      filename
    }

    fileSchema.parse(fileData)

    const oldFileName = await this.fileRepository.getFileNameById(id)
    if (!oldFileName) {
      throw new Error('File not found')
    }

    const oldFilePath = path.resolve('uploads', oldFileName)
    try {
      await fs.unlink(oldFilePath)
    } catch (err) {
      console.warn(`Failed to delete old file: ${ oldFilePath }`, err)
    }

    await this.fileRepository.updateFile(id, fileData)

    return true
  }

  async deleteFile(id: number): Promise<boolean> {
    const fileName = await this.fileRepository.getFileNameById(id)
    if (!fileName) return false

    const filePath = path.resolve('uploads', fileName)
    try {
      await fs.unlink(filePath)
    } catch (err) {
      console.warn(`File not found on disk: ${ filePath }`)
    }

    await this.fileRepository.deleteFileById(id)

    return true
  }
}