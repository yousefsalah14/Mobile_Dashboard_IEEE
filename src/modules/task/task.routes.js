import express from 'express'
import taskController from './task.controller.js'
import { getUploader } from '../../utils/upload.js'

const router = express.Router()

router.post('/upload-material/pdfs', getUploader('pdf', 'local').array('pdfs') ,taskController.uploadSessionPdfs)

router.post('/upload-material/videos', getUploader('video', 'cloud').array('videos') ,taskController.uploadSessionVideos)

router.post('/upload-material/images', getUploader('image', 'local').array('images') ,taskController.uploadSessionImages)

router.get('/tasks', taskController.fetchTasks)

router.get('/task/:taskID', taskController.fetchTask)

router.patch('/task/:taskID', taskController.updateTask)

router.post('/task', taskController.addTask)

router.get('/task/:taskID/assigned-to', taskController.fetchAssignedUsers)

router.delete('/task/:taskID', taskController.deleteTask)

export default router