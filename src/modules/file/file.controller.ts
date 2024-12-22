import FileService from './file.service'
import multer from 'multer'
import { Request, Response } from 'express'

const upload = multer({ dest: 'uploads/' })

export default class FileController {
  constructor(private fileService: FileService) {
  }

  uploadFile = upload.single('file')

  async createFile(req: Request, res: Response) {
    try {
      const file = req.file
      if (!file) {
        res.status(400).send('No file uploaded')
        return
      }

      await this.fileService.createFile(file)
      res.status(201).json({ message: 'File created' })
    } catch (err) {
      console.error('createFile FileController error:', err)
      res.status(500).json({ error: (err as Error).message })
    }
  }

  async getFileList(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1
      const listSize = parseInt(req.query.list_size as string, 10) || 10

      if (page <= 0 || listSize <= 0) {
        res.status(400).json({ error: 'Invalid page or list_size parameters' })
        return
      }

      const { files, total } = await this.fileService.getFileList(page, listSize)

      res.status(200).json({
        total,
        page,
        listSize,
        files
      })
    } catch (err) {
      console.error('getFileList FileController error:', err)
      res.status(500).json({ error: (err as Error).message })
    }
  }

  async downloadFile(req: Request, res: Response) {
    try {
      const fileId = +req.params.id
      if (isNaN(fileId)) {
        res.status(400).json({ error: 'Invalid file ID' })
        return
      }

      const filePath = await this.fileService.getFilePathById(fileId)
      if (!filePath) {
        res.status(404).json({ error: 'File not found' })
        return
      }

      res.download(filePath, err => {
        if (err) {
          console.error('downloadFile error:', err)
          res.status(500).json({ error: 'Failed to download file' })
        }
      })
    } catch (err) {
      console.error('downloadFile FileController error:', err)
      res.status(500).json({ error: (err as Error).message })
    }
  }

  async getFileById(req: Request, res: Response) {
    try {
      const fileId = +req.params.id
      if (isNaN(fileId)) {
        res.status(400).json({ error: 'Invalid file ID' })
        return
      }

      const fileInfo = await this.fileService.getFileById(fileId)
      if (!fileInfo) {
        res.status(404).json({ error: 'File not found' })
        return
      }

      res.status(200).json(fileInfo)
    } catch (err) {
      console.error('getFileInfo FileController error:', err)
      res.status(500).json({ error: (err as Error).message })
    }
  }

  async updateFile(req: Request, res: Response) {
    try {
      const fileId = +req.params.id
      if (isNaN(fileId)) {
        res.status(400).json({ error: 'Invalid file ID' })
        return
      }

      const newFile = req.file
      if (!newFile) {
        res.status(400).send('No file uploaded')
        return
      }

      await this.fileService.updateFile(fileId, newFile)

      res.status(200).json({ message: 'File updated successfully' })
    } catch (err) {
      console.error('updateFile FileController error:', err)
      res.status(500).json({ error: (err as Error).message })
    }
  }

  async deleteFile(req: Request, res: Response) {
    try {
      const fileId = parseInt(req.params.id, 10)
      if (isNaN(fileId)) {
        res.status(400).json({ error: 'Invalid file ID' })
        return
      }

      const isDeleted = await this.fileService.deleteFile(fileId)
      if (!isDeleted) {
        res.status(404).json({ error: 'File not found' })
        return
      }

      res.status(200).json({ message: 'File deleted successfully' })
    } catch (err) {
      console.error('deleteFile FileController error:', err)
      res.status(500).json({ error: (err as Error).message })
    }
  }
}