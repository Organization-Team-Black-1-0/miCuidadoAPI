import dotenv from 'dotenv';

dotenv.config();
export default {
    uri: process.env.DB_URI,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};
