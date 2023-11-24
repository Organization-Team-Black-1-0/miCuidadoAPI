import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import userRoutes from './app/routes/userRoutes.js';
import authRoutes from './app/routes/authRoutes.js';
import bloodPressureRouter from './app/routes/bloodPressureRoutes.js';
import dotenv from 'dotenv';
import cors from "cors";//Asiul
//import { authenticateToken } from './app/middleware/authenticateToken.js'; //Asiul
import { connectDB } from './config/database.js'; // Importa connectDB desde database.js


const app = express();
const port = process.env.PORT || 3002;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.urlencoded({ extended: true })); - Asiul
//app.use(express.urlencoded ({ extended: false })) - Eliecer
app.set('view engine', 'ejs');

connectDB(); // Conecta a la base de datos

dotenv.config();

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, "./public/pages/home.html");
    res.sendFile(filePath);
});

app.use('/users', userRoutes);

app.use('/users', authRoutes);

app.use('/bloodPressure', bloodPressureRouter);

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


/*
// Aquí se define un objeto con un usuario. Nótese que aquí debería estar conectada la base de datos.
let user = {
    id: "yellow",
    email: "cischass@gmail.com",
    password: "adsdasdfasdfasdfasdf"
}
// El mensaje que define la constante JWT_SECRET puede ser cualquier cadena de texto, ej.: "tucolorfavorito".
// Esta constante reemplaza el uso de la librería bcrypt, aunque es más recomendable usar esta última. Por esto mismo,
*/