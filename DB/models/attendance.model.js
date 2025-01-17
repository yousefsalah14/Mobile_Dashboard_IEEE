import { model, Schema, Types } from 'mongoose';

const attendaceSchema = new Schema({
userID:{
    type:Types.ObjectId,
    ref : "User",
    required: true
 },
sessionID: {
    type: Types.ObjectId,
    ref: "Session",
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Excused"],
    default: "Absent",
  },
},{ timestamps: true });

export const Attendance = model('Attendance', attendaceSchema);
