import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: String,
    answer: Boolean
});

const checklistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [questionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const check = mongoose.model('Checklist', checklistSchema);

export default check;