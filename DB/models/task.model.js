import mongoose from "mongoose";

const { Schema, model } = mongoose;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Overdue"],
      default: "Pending",
    },
    assigned_to: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [
      {
        type: String,
        default: []
      },
    ],
  },
  { timestamps: true }
);

export const Task = model("Task", taskSchema);
