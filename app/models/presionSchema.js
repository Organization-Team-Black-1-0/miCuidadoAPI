import mongoose from 'mongoose';

const presionSchema = new mongoose.Schema({
    sistolica: {
        type: Number,
        required: true,
    },
    diastolica: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
const Presion = mongoose.model('Presion', presionSchema);

export default mongoose.model('Presion', presionSchema);