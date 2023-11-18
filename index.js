import 'dotenv/config'
import express from 'express';
import jwt from 'jsonwebtoken';
import email from '../reset-password/email/email.js';
const app = express();

app.use(express.json())
app.use(express.urlencoded ({ extended: false }))
app.set('view engine', 'ejs')

let user = {
    id: "yellow",
    email: "somebody@gmail.com",
    password: "adsdasdfasdfasdfasdf"
}

const JWT_SECRET = 'some super secret...' //(se debe agregar un archivo .env para resguardar las claves)


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

    const secret = JWT_SECRET + user.password
    const payload = {
        email: user.email,
        id: user.id
    }
    const token = jwt.sign(payload, secret, {expiresIn: '15m'}); //expiresIn es un método de la librería JWT.
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`;
    console.log(link)
    res.send("La contraseña ha sido reestablecida. El link ha sido enviado a su correo");
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
   
    //verificar si el usuario existe en la base de datos
     if(id!==user.id){
        res.send("Usuario inválido");
        return;
    }
    
    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret);
        //Verificar si ambas claves escritas por el usuario coinciden
        //Para encontrar al usuario con payload, se usa el email y el id del usuario y luego se actualiza la clave
        //Siempre hacer un hash de la contraseña antes de enviarla
        user.password = password;
        res.send(user);

    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
})

app.listen(3000, () => {console.log(`Listening on port http://localhost:3000`)});