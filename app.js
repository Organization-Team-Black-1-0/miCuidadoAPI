import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './app/routes/userRoutes.js';
import authRoutes from './app/routes/authRoutes.js';
import dotenv from 'dotenv';

const app = express();
const port = 3002;


app.use(bodyParser.json());

dotenv.config();

const secretKey = process.env.SECRET_KEY;

app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi API!');
});

app.use('/users', userRoutes);

app.use('/users', authRoutes);

//Manejo de errores
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Servidor
app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});