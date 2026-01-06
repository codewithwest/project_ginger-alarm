import mongoose from 'mongoose';

const alarmSchema = new mongoose.Schema({
   localId: { type: Number, required: true },
   time: { type: String, required: true },
   label: { type: String, default: '' },
   active: { type: Boolean, default: true },
   syncId: { type: String, required: true } // Unique ID to link user
});

export const Alarm = mongoose.model('Alarm', alarmSchema);
