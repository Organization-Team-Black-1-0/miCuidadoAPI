import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './app/routes/userRoutes.js';
import authRoutes from './app/routes/authRoutes.js';
import bloodPressureRouter from './app/routes/bloodPressureRoutes.js';
import dotenv from 'dotenv';
import cors from "cors";//Asiul
import { authenticateToken } from './app/middleware/authenticateToken.js'; //Asiul
import { connectDB } from './config/database.js'; // Importa connectDB desde database.js

const app = express();
//const port = 3002;
const port = process.env.PORT || 3002;

//app.use(bodyParser.json());

app.use(cors());

app.use(express.json());

connectDB(); // Conecta a la base de datos */

dotenv.config();

app.get('/', (req, res) => {
    res.send('¡Bienvenidos a la Web: Mi cuidado Diario');
});

app.use('/users', userRoutes);

//app.use(authenticateToken);

app.use('/users', authRoutes);

app.use('/bloodPressure', bloodPressureRouter);

//Manejo de errores
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Servidor
/*app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});*/

//Asiul
app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});