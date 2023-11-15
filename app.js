import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './app/routes/userRoutes.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
const port = 3002;


app.use(bodyParser.json());

dotenv.config();

const secretKey = process.env.SECRET_KEY;

app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi API!');
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Token de acceso faltante' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token de acceso inválido' });
        }
        req.user = decoded;
        next();
    });
}

app.use('/users', userRoutes);

app.use('/users', authenticateToken);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});