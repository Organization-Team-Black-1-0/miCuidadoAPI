import mongoose from 'mongoose';
import User from './userSchema.js';

const bloodPressureSchema = new mongoose.Schema({
    systolic: {
        type: Number,
        required: true,
    },
    diastolic: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    /*user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },*/
    user: {
        type: String,
        required: true
    },
});

bloodPressureSchema.index({
    sistolica: 1,
    diastolica: 1,
    date: 1,
});


bloodPressureSchema.methods.validateBloodPressure = async function(sistolica, diastolica) {
    if (sistolica < 90 || diastolica > 60) {
        return false;
    }

    return true;
};


const Blood = mongoose.model('bloodPressure', bloodPressureSchema);

export default Blood;
