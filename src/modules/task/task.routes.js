import express from 'express'
import taskController from './task.controller.js'
import { getUploader } from '../../utils/upload.js'
import { isAuthorized } from '../../middlewares/authorization.middleware.js'
import { isAuthenticated } from '../../middlewares/authentication.middleware.js'

const router = express.Router()

router.get('/tasks', taskController.fetchTasks)

router.get('/task/:taskID', taskController.fetchTask)

router.use(isAuthenticated)
router.use(isAuthorized('Chair', 'Director'))

router.post('/upload-material/pdfs', getUploader('pdf', 'local').array('pdfs') ,taskController.uploadSessionPdfs)

router.post('/upload-material/videos', getUploader('video', 'cloud').array('videos') ,taskController.uploadSessionVideos)

router.post('/upload-material/images', getUploader('image', 'local').array('images') ,taskController.uploadSessionImages)

router.patch('/task/:taskID', taskController.updateTask)

router.post('/task', taskController.addTask)

router.get('/task/:taskID/assigned-to', taskController.fetchAssignedUsers)

router.delete('/task/:taskID', taskController.deleteTask)

export default router