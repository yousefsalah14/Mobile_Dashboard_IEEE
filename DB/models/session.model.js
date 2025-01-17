import { model, Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    instructor: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    session_date: {
      type: Date,
      required: true,
    },
    session_materials: {
      type: [String],
    },
    qr: {
      type: String,
      required: true,
    },
    taskId: {
      type: Types.ObjectId,
      ref: "Task",
    },
  },
  { timestamps: true }
);

export const Session = model("Session", sessionSchema);
