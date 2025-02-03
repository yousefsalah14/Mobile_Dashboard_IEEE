import { Task } from "../../../DB/models/task.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { handleFileUpload } from "../../utils/handleFileUpload.js";

const taskController = {
    uploadSessionPdfs: asyncHandler(async (req, res) => {
        const { isCloud } = req.query || false;
        const result = await handleFileUpload(req.files, "application/pdf", isCloud);
        return res.status(result.success ? 200 : 400).json(result);
    }),

    uploadSessionVideos: asyncHandler(async (req, res) => {
        const { isCloud } = req.query || false;
        const result = await handleFileUpload(req.files, "video", isCloud);
        return res.status(result.success ? 200 : 400).json(result);
    }),

    uploadSessionImages: asyncHandler(async (req, res) => {
        const { isCloud } = req.query || false;
        const result = await handleFileUpload(req.files, "image", isCloud);
        return res.status(result.success ? 200 : 400).json(result);
    }),

    fetchTasks: asyncHandler(async (req, res) => {
        const tasks = await Task.find();
        return res.status(200).json({
            success: true,
            message: tasks.length === 0 ? "No tasks found" : "",
            tasks,
        });
    }),

    fetchTask: asyncHandler(async (req, res) => {
        const { taskID } = req.params;
        const task = await Task.findById(taskID);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        return res.status(200).json({ success: true, task });
    }),

    updateTask: asyncHandler(async (req, res) => {
        const { taskID } = req.params;
        const taskData = req.body;
        
        const task = await Task.findById(taskID);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        Object.keys(taskData).forEach((key) => {
            if (taskData[key] !== undefined) {
                task[key] = taskData[key];
            }
        });

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task,
        });
    }),

    addTask: asyncHandler(async (req, res) => {
        const taskData = req.body;
        const newTask = new Task(taskData);
        await newTask.save();

        return res.status(201).json({
            success: true,
            message: "Task added successfully",
            data: newTask,
        });
    }),

    deleteTask: asyncHandler(async (req, res) => {
        const { taskID } = req.params;
        const task = await Task.findByIdAndDelete(taskID);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        return res.status(200).json({ success: true, message: "Task deleted successfully" });
    }),

    fetchAssignedUsers: asyncHandler(async (req, res) => {
        const { taskID } = req.params;
        const task = await Task.findById(taskID).populate('assigned_to');

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        return res.status(200).json({
            success: true,
            assignedUsers: task.assigned_to,
        });
    }),
};

export default taskController;
