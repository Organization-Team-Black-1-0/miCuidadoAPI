import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './app/routes/userRoutes.js';

const app = express();
const port = 3002;

app.use(bodyParser.json());

// Ruta de inicio
app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi API!');
});

// Rutas de usuarios
app.use('/users', userRoutes);

// Manejador de errores para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});