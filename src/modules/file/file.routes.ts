import FileRepository from './file.repository'
import FileService from './file.service'
import FileController from './file.controller'
import { Router } from 'express'
import { authenticate } from '../../middlewares/auth'

const router = Router()

const fileRepository = new FileRepository()
const fileService = new FileService(fileRepository)
const fileController = new FileController(fileService)

router.use(authenticate)

router.post('/upload', fileController.uploadFile, fileController.createFile.bind(fileController))
router.get('/list', fileController.getFileList.bind(fileController))
router.get('/:id', fileController.getFileById.bind(fileController))
router.get('/download/:id', fileController.downloadFile.bind(fileController))
router.put('/update/:id', fileController.uploadFile, fileController.updateFile.bind(fileController))
router.delete('/delete/:id', fileController.deleteFile.bind(fileController))

export default router