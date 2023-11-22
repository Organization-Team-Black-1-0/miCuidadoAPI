import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//import { authenticateToken } from './app/middleware/authenticateToken.js'; Asiul
import User from '../models/userSchema.js'; // Importa el modelo de usuario
import { connectDB } from '../../config/database.js'; // Importa connectDB desde database.js

dotenv.config();

/*const readData = () => {
    try {
        const data = fs.readFileSync('./db.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};*/

/*const generateAccessToken = (user) => {
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    return token;
}

const loginUser = (req, res) => {
    const db = readData();
    const { username, password } = req.body;
    const user = User.findByUsername(username);// Usa el modelo de usuario para buscar el usuario
    if (user && user.password === password) {// Compara la contraseña proporcionada con la contraseña encriptada
        const token = generateAccessToken({ username: user.username });
        res.status(200).json({ message:'Sesión Iniciada' });// Envía el token al cliente o navegador
    } else {
        res.status(401).json({ error: 'Username o Password incorrecto' });
    }
}*/

//Asiul:
const generateAccessToken = (user) => {
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    return token;
}
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); // Usa el modelo de usuario para buscar el usuario
    if (user && await user.comparePassword(password)) { // Compara la contraseña proporcionada con la contraseña encriptada
        const token = generateAccessToken({ username: user.username });
        res.status(200).json({ message:'Sesión Iniciada', token }); // Envía el token al cliente
    } else {
        res.status(401).json({ error: 'Username o Password incorrecto' });
    }
}

export {
    loginUser
};