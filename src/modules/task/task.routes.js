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

router.post('/upload-material/pdfs/:taskID', getUploader('pdf', 'local').array('pdfs') ,taskController.uploadTaskPdfs)

router.post('/upload-material/videos/:taskID', getUploader('video', 'cloud').array('videos') ,taskController.uploadTaskVideos)

router.post('/upload-material/images/:taskID', getUploader('image', 'local').array('images') ,taskController.uploadTaskImages)

router.patch('/task/:taskID', taskController.updateTask)

router.post('/task', taskController.addTask)

router.get('/task/:taskID/assigned-to', taskController.fetchAssignedUsers)

router.delete('/task/:taskID', taskController.deleteTask)

export default router