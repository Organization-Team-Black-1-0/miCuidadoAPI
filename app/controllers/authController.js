import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
//import { authenticateToken } from './app/middleware/authenticateToken.js'; Asiul
import User from '../models/userSchema.js'; // Importa el modelo de usuario
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

dotenv.config();

const generateAccessToken = (user) => {
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
    return token;
}
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }); // Usa el modelo de usuario para buscar el usuario
        if (user){
            const result = await bcrypt.compare(password, user.password); // Compara la contraseña proporcionada con la contraseña encriptada
            console.log(result);
            if (result) {
                const token = generateAccessToken({ username: user.username });
                // Almacenar el token en una cookie
                res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

                res.status(200).json({ message:'Sesión Iniciada', username: user.username }); // Envía el token al cliente
            } else {
                res.status(401).json({ error: 'Username o Password incorrecto' });
            }
        } else{
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

const logoutUser = (req, res) => {
    // Eliminar la cookie de token
    res.clearCookie('token');

    res.status(200).json({ message: 'Sesión Cerrada' });
}; 

const sendMail = async (req, res) => {
    // función asíncrona en la que se agregan los datos de acceso y credenciales del dominio desde el cual 
    //se envía el correo. En este caso, lo hice desde google mientras se crea un dominio. 
    try {
        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
                type: 'OAuth2',
                user: 'checerovitch@gmail.com', //mail del proyecto preferiblemente gmail
                clientId: '571089471111-jldn6ivl6ue7hadgk6s1pdbg2qkfvt0p.apps.googleusercontent.com',
                clientSecret: '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',
                refreshToken: 'https://developers.google.com/oauthplayground',
                accessToken: 'ya29.a0AfB_byBzHWX8SQheNRymQYwY5_ZD0rRwpG1nDnPb-WdvXTObsYRWT0iapYJej0CjZtjaInAvI_Lw28Pc2t1AEykOSaxTRRsKdWSIOrwrUaJZce-cUESuKFsoQ3hd_HQjeshhvWaJ5mLWS_EmoeATmrxrCQreUX76iS3faCgYKAXESARMSFQHGX2Mi624idMh1vuREGWcypHhcLw0171'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        // En mailOptions se diseña el esquema del correo electrónico.
        // Nótese que en el campo del destinatario (to) se agrega el método
        // user.mail para que este recupere de la base de datos el correo electrónico 
        // que haya sido tipeado por el usuario.
        const mailOptions = {
            from: 'Checerovitch <checerovitch@gmail.com>',
            to: User.email,
            subject: "Hello from gmail using api",
            text: "Hello from gmail using api",
            html: `Click the following link to reset your password: <a href=${link}>Here!<a/>`,
        };
        const result = await transport.sendMail(mailOptions)
        return result
    }   catch (error) {
        return error
    }
}

const forgotPassword = async (req, res, next) => {
    const { email, username } = req.body;
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
    
    //Hay que comprobar que el usuario existe
    if(email !== User.email || username !== User.username){
        res.send('Usuario no registrado')
        return;
    } else {
        //Si el usuario existe, se le envía un link de 15 minutos de vigencia para reestablecer contraseña
        //El objeto payload permite diseñar los campos necesarios para definir el email y el id de usuario
        const User = await User.findOne({ username }); // Usa el modelo de usuario para buscar el usuario
        const secret = JWT_SECRET + User.password
        const payload = {
            username: User.username,
            email: User.email,
            id: User.id
        }
        const token = jwt.sign(payload, secret, {expiresIn: '15m'}); //expiresIn es un método de la librería JWT.
        const link = `http://localhost:3000/reset-password/${User.id}/${token}`;
        const correo = "https://mail.google.com/mail/u/1/#inbox"
        res.send(`La contraseña ha sido reestablecida. El link ha sido enviado a su <a href=${correo}>correo</a>`);
        // se llama la función asíncrona sendMail() junto a un .catch, al que se 
        // le pasa un mensaje de error.
        sendMail().then(result=> console.log('Correo enviado', result))
        .catch(error => console.log(error.message));
    };
};

const getResetPasswordByIdToken = async (req, res) => {

    const {id, token} = req.params;
    
    //verificar si el usuario existe en la base de datos
    if(id!==User.id){
        res.send("Usuario inválido");
        return
    } else{
        //De tener un usuario válido, se llama a la cosntante secret
        const secret = JWT_SECRET + User.password;
        try {
            const payload = jwt.verify(token, secret);
            res.render('reset-password', {email: User.email})
        } catch (error) {
            console.log(error.message);
            res.send(error.message);
        }
    }
};

const resetPassword = async (req, res) => {
    const {password, password2} = req.body;

    // Se verifica si ambas claves coinciden
    if(password !== password2){
        res.send("Las contraseñas no coinciden");
        return
    }
    
    const secret = JWT_SECRET + User.password;
    try {
        const payload = jwt.verify(token, secret);
        //Verificar si ambas claves escritas por el usuario coinciden
        //Para encontrar al usuario con payload, se usa el email y el id del usuario y luego se actualiza la clave
        //Siempre hacer un hash de la contraseña antes de enviarla
        User.password = password;
        res.send("La contraseña ha sido reestablecida");

    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
};

export {
    loginUser,
    logoutUser,
    forgotPassword,
    getResetPasswordByIdToken,
    resetPassword
};
