import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./app/routes/userRoutes.js";
import { authenticateToken } from './app/middleware/authenticateToken.js'; 
import { connectDB } from './config/database.js'; // Importa connectDB desde database.js

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

connectDB(); // Conecta a la base de datos

app.get('/', (req, res) => {
    res.send('¡Bienvenidos a la Web: Mi cuidado Diario');
});

app.use(authenticateToken);

app.use("/users", userRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`La aplicación está funcionando en http://localhost:${port}`);
});






