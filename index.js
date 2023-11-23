import 'dotenv/config'
import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
const app = express();

app.use(express.json())
app.use(express.urlencoded ({ extended: false }))
app.set('view engine', 'ejs')

// Se definen las credenciales del dominio desde el cual se va a enviar el correo electrónico.
// Estas credenciales deben estar en un documento .env.

const CLIENT_ID = '571089471111-jldn6ivl6ue7hadgk6s1pdbg2qkfvt0p.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//042vA_rtRDRk3CgYIARAAGAQSNwF-L9Ir0ZN6QD_GMy3DA48gJxtTOjuBZ-ZygnPtwySx_vULq_NBI5pkWtwb7MwqotmpvKhf9MQ';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

// Aquí se define un objeto con un usuario. Nótese que aquí debería estar conectada la base de datos.
let user = {
    id: "yellow",
    email: "cischass@gmail.com",
    password: "adsdasdfasdfasdfasdf"
}

// El mensaje que define la constante JWT_SECRET puede ser cualquier cadena de texto, ej.: "tucolorfavorito".
// Esta constante reemplaza el uso de la librería bcrypt, aunque es más recomendable usar esta última. Por esto mismo,
// la cadena de texto debe ir en un archivo .env. 

const JWT_SECRET = 'some super secret...' //(se debe agregar un archivo .env para resguardar las claves)

// Se definen las rutas

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/forgot-password', (req, res, next) =>{
    res.render('forgot-password')
})

app.post('/forgot-password', (req, res, next) =>{
    const { email } = (req.body)
    
    //Hay que comprobar que el usuario existe
    if(email !== user.email){
        res.send('Usuario no registrado')
        return;
    }

    //Si el usuario existe, 
    //se le envía un link de 15 minutos de duración
    //para reestablecer contraseña
    // El objeto payload permite diseñar los campos necesarios para definir el email y el id
    // de usuario

    const secret = JWT_SECRET + user.password
    const payload = {
        email: user.email,
        id: user.id
    }
    const token = jwt.sign(payload, secret, {expiresIn: '15m'}); //expiresIn es un método de la librería JWT.
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`;
    const correo = "https://mail.google.com/mail/u/1/#inbox"
    res.send(`La contraseña ha sido reestablecida. El link ha sido enviado a su <a href=${correo}>correo</a>`);
  
    // función asíncrona en la que se agregan los datos de acceso y credenciales del
    // dominio desde el cual se envía el correo. En este caso, lo hice desde google mientras se crea 
    // un dominio. 
async function sendMail() {
    try {
      const accessToken = await oAuth2Client.getAccessToken()
      
      const transport = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            type: 'OAuth2',
            user: 'checerovitch@gmail.com',
            clientId: '571089471111-jldn6ivl6ue7hadgk6s1pdbg2qkfvt0p.apps.googleusercontent.com',
            clientSecret: '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',
            refreshToken: 'https://developers.google.com/oauthplayground',
            accessToken: 'ya29.a0AfB_byDU_0gy3OMtXeGoNPdZqm6mIyXwb95q68XtoCjGCZ87QOUGapcDXurPkk55zRKP-tH7Cdho4USjuqctNSCQXu8aU83bE14EXspUqkIM-nxTi2TZRX1xnA9H9cnTVPhw7K2wfxXUPVmlJTKXjA_Wd7TYjsqIX9RVaCgYKAVcSARMSFQHGX2MilRI277OwaOwYy2Cb_IzxWA0171'
        },
          tls: {
            rejectUnauthorized: false
      }
      })

    // En mailOptions se diseña el esquema del correo electrónico.
    // Nótese que en el campo del destinatario (to) se agrega el método
    // user.mail para que este recupere de la base de datos el correo electrónico 
    // que haya sido tipeado por el usuario.

      const mailOptions = {
        from: 'Checerovitch <checerovitch@gmail.com>',
        to: user.email,
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
// se llama la función asíncrona sendMail() junto a un .catch, al que se 
// le pasa un mensaje de error.
sendMail().then(result=> console.log('Correo enviado', result))
.catch(error => console.log(error.message));
   });

app.get('/reset-password/:id/:token', (req, res, next) =>{
    const {id, token} = req.params;
    
    //verificar si el usuario existe en la base de datos
    if(id!==user.id){
        res.send("Usuario inválido");
        return
    }
    //De tener un usuario válido, se llama a la cosntante secret
    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret);
        res.render('reset-password', {email: user.email})
    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
})

app.post('/reset-password/:id/:token', (req, res, next) =>{
    const {id, token} = req.params;
    const {password, password2} = req.body;
   
    // Se verifica si ambas claves coinciden
    if(password !== password2){
        res.send("Las contraseñas no coinciden");
        return
    }
    
    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret);
        //Verificar si ambas claves escritas por el usuario coinciden
        //Para encontrar al usuario con payload, se usa el email y el id del usuario y luego se actualiza la clave
        //Siempre hacer un hash de la contraseña antes de enviarla
        user.password = password;
        res.send("La contraseña ha sido reestablecida");

    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
})

app.listen(3000, () => {console.log(`Listening on port http://localhost:3000`)});
