import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModels.js';

dotenv.config();

const readData = () => {
    try {
        const data = fs.readFileSync('./db.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const generateAccessToken = (user) => {
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    return token;
}

const loginUser = (req, res) => {
    //const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    const db = readData();
    const { username, password } = req.body;
    //const user = db.users.find((u) => u.username === username && u.password === password);
    const user = User.findByUsername(username); 
    //if (user) {
    if (user && user.password === password) {
        const token = generateAccessToken({ username: user.username });
        res.status(200).json({ message:'Sesión Iniciada' });
    } else {
        res.status(401).json({ error: 'Username o Password incorrecto' });
    }
}

export {
    loginUser
};
