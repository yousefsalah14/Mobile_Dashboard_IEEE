import { model, Schema } from 'mongoose';

const taskSchema = new Schema({

},{ timestamps: true });

export const Task = model('Task', taskSchema);
