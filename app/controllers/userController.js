import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validateUsername, validatePassword, validateEmail } from '../../validations.js';

dotenv.config();

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

const getUsers = (req, res) => {
    const data = readData();
    res.json(data.users);
};

const getUserByUsername = (req, res) => {
    const data = readData();
    const username = req.params.username;
    const user = data.users.find((user) => user.username === username);
    res.json(user);
};

const createUser = (req, res) => {
    const data = readData();
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: "Faltan campos obligatorios del usuario." });
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        return res.status(400).json({ error: usernameValidation.error });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return res.status(400).json({ error: passwordValidation.error });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        return res.status(400).json({ error: emailValidation.error });
    }

    const newUser = {
        id: data.users.length + 1,
        username,
        password,
        email
    };

    data.users.push(newUser);
    writeData(data);
    res.json({ message: "Registro cargado con éxito", user: newUser });
};

const updateUser = (req, res) => {
    const data = readData();
    const username = req.params.username;
    const { password, email } = req.body;

    const user = data.users.find((user) => user.username === username);
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
    }

    if (!password && !email) {
        return res.status(400).json({ error: "Se debe proporcionar al menos un campo para actualizar." });
    } 

    if (password) {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ error: passwordValidation.error });
        }
        user.password = password;
    }

    if (email) {
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ error: emailValidation.error });
        }
        user.email = email;
    }

    writeData(data);
    res.json({ message: "Usuario actualizado con éxito", user });
};

const deleteUser = (req, res) => {
    const data = readData();
    const username = req.params.username;

    const index = data.users.findIndex((user) => user.username === username);
    if (index === -1) {
        return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const deletedUser = data.users.splice(index, 1)[0];
    writeData(data);
    res.json({ message: "Usuario eliminado con éxito", user: deletedUser });
};

const generateAccessToken = (user) => {
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    return token;
}

const loginUser = (req, res) => {
    const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    const { username, password } = req.body;
    const user = db.users.find((u) => u.username === username && u.password === password);
    if (user) {
        const token = generateAccessToken({ username: user.username });
        res.status(200).json({ message:'Sesión Iniciada' });
    } else {
        res.status(401).json({ error: 'Username o Password incorrecto' });
    }
}

export {
    getUsers,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};

