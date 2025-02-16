import { Task } from "../../../DB/models/task.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../../DB/models/user.model.js";
import { handleFileUpload } from "../../utils/handleFileUpload.js";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

const taskController = {
    uploadTaskPdfs: asyncHandler(async (req, res) => {
        const isCloud = req.query.isCloud === "true"; 
        const { taskID } = req.params;
      
        if (!taskID) {
          return res.status(400).json({ success: false, message: "Task ID is required" });
        }
      
        if (!mongoose.Types.ObjectId.isValid(taskID)) {
          return res.status(400).json({ 
            success: false, 
            message: "Invalid Task ID" 
          });
        }
      
        const result = await handleFileUpload(req.files, "application/pdf", isCloud);
      
        if (!result.success) {
          return res.status(400).json(result);
        }
      
        if (!result.files || !Array.isArray(result.files)) {
          return res.status(400).json({
            success: false,
            message: "No valid files uploaded"
          });
        }
      
        const taskIdObj = new mongoose.Types.ObjectId(taskID);
      
        const urls = result.files.map(file => file.url);
      
        const task = await Task.findOneAndUpdate(
          { _id: taskIdObj }, 
          { $push: { attachments: { $each: urls } } }, 
          { new: true }
        );
      
        if (!task) {
          return res.status(404).json({ success: false, message: "Task not found" });
        }
      
        return res.status(200).json({ success: true, message: "PDFs uploaded", task });
    }),

    uploadTaskVideos: asyncHandler(async (req, res) => {
        const { isCloud } = req.query
        const { taskID } = req.params;
      
        if (!taskID) {
          return res.status(400).json({ success: false, message: "Task ID is required" });
        }
      
        if (!mongoose.Types.ObjectId.isValid(taskID)) {
          return res.status(400).json({ 
            success: false, 
            message: "Invalid Task ID" 
          });
        }
      
        const result = await handleFileUpload(req.files, "video", isCloud);
      
        if (!result.success) {
          return res.status(400).json(result);
        }
      
        if (!result.files || !Array.isArray(result.files)) {
          return res.status(400).json({
            success: false,
            message: "No valid files uploaded"
          });
        }
      
        const urls = result.files.map(file => file.secure_url || file.url); // Cloud
      
        const taskIdObj = new mongoose.Types.ObjectId(taskID);
      
        const task = await Task.findOneAndUpdate(
          { _id: taskIdObj },
          { $push: { attachments: { $each: urls } } },
          { new: true }
        );
      
        if (!task) {
          return res.status(404).json({ success: false, message: "Task not found" });
        }
      
        return res.status(200).json({ 
          success: true, 
          message: "Videos uploaded", 
          task 
        });
    }),

    uploadTaskImages: asyncHandler(async (req, res) => {
        const isCloud = req.query.isCloud === "true";
        let { taskID } = req.params;
      
        if (!taskID) {
          return res.status(400).json({ 
            success: false, 
            message: "Task ID is required" 
          });
        }
      
        const result = await handleFileUpload(req.files, "image", isCloud);
      
        if (!result.success) {
          return res.status(400).json(result);
        }
      
        if (!result.files || !Array.isArray(result.files)) {
          return res.status(400).json({
            success: false,
            message: "No valid files uploaded"
          });
        }

        taskID = new ObjectId(taskID)
      
        const urls = result.files.map(file => file.url);
      
        const task = await Task.findOneAndUpdate(
          { _id: taskID },
          { $push: { attachments: { $each: urls } } },  
          { new: true }
        );
      
        if (!task) {
          return res.status(404).json({ 
            success: false, 
            message: "Task not found" 
          });
        }
      
        return res.status(200).json({ 
          success: true, 
          message: "Images uploaded", 
          task 
        });
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
        const user = req.user;
    
        if (!taskData.title || !taskData.description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required!"
            });
        }
    
        const newTask = new Task({
            ...taskData,
            created_by: user._id,
        });
    
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
