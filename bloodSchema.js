import mongoose from 'mongoose';
import User from './userSchema.js';

const bloodPressureSchema = new mongoose.Schema({
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
    timestamp: {
        type: Date,
        default: Date.now,
    },
    comment: {
        type: String,
    },
    location: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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

module.exports = bloodPressureSchema;