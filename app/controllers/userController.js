import User from '../models/userSchema.js';
import { validateUsername, validatePassword, validateEmail } from '../../validations.js';

const getUsers = async (req, res) => {
    try {
        const users = await User.find(); // Usa el modelo de usuario para buscar usuarios
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username }); // Usa el modelo de usuario para buscar el usuario
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

const createUser = async (req, res) => {
    try {
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

        const newUser = new User({ username, password, email }); // Crea un nuevo usuario
        await newUser.save(); // Guarda el usuario en la base de datos
        res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
        //console.log(req.body)
    } catch (error) {
        res.status(500).json({ message: error.message });
        //console.log(error)
    }
};

const updateUser = async (req, res) => {
    try {
        const username = req.params.username;
        const { password, email } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
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

        await user.save();
        res.json({ message: "Usuario actualizado con éxito", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const username = req.params.username;

        const user = await User.findOneAndDelete({ username });
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        res.json({ message: "Usuario eliminado con éxito", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getUsers, getUserByUsername, createUser, updateUser, deleteUser };
