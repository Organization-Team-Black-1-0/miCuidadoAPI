import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import usersRouter from './app/routes/userRoutes.js';
import authRouter from './app/routes/authRoutes.js';
import bloodPressureRouter from './app/routes/bloodPressureRoutes.js';
//import checkRouter from './app/routes/checkListRoutes.js';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { connectDB } from './config/database.js'; // Importa connectDB desde database.js


const app = express();
const port = process.env.PORT || 3002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Configura el middleware de sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

connectDB(); // Conecta a la base de datos

dotenv.config();

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, "./public/pages/home.html");
    res.sendFile(filePath);
});

app.use('/users', usersRouter);

app.get("/loginUser/getUserByUsername", (req, res) => {
    const filePath = path.join(__dirname, "./public/pages/login.html");
    res.send(req.body);
        
});

app.use('/users', authRouter);

// Save the new user to the database
// userService.createUser(createUser).then(() => {
//     // User created successfully
//     res.status(201).json({ message: "Usuario creado exitosamente" });
// }).catch(err => {
//     // Error creating the user
//     res.status(500).json({ error: err.message });
// });

app.use('/bloodPressure', bloodPressureRouter);

//app.post("/createUser", (req, res) => {
    //const filePath = path.join(__dirname, "./public/home.html");
    //const filePath = path.join(__dirname, "./public/pages/register.html");
    //res.sendFile(req.body);
//});

app.post("/createUser", (req, res) => {
    // Process the request body to create a new user
    const createUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
});

//enlace para frontend
app.post("/getUsers/loginUser", (req, res) => {
    const filePath = path.join(__dirname, "./public/pages/login.html");
    res.send(req.body);
});

//Manejo de errores
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    console.log(err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});
