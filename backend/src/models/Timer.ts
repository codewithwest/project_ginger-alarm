import mongoose from 'mongoose';

const timerSchema = new mongoose.Schema({
   localId: { type: Number, required: true },
   duration: { type: Number, required: true },
   label: { type: String, default: '' },
   syncId: { type: String, required: true } // Unique ID to link user
});

export const Timer = mongoose.model('Timer', timerSchema);
