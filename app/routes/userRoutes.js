import express from 'express';

//CRUD (Crear, Leer, Actualizar, Eliminar)
import { 
    getUsers, 
    getUserByUsername, 
    createUser, 
    updateUser, 
    deleteUser, 
    loginUser 
} from '../controllers/userController.js';

import presionController from '../controllers/presionController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.get("/", getUsers); //solicitudes GET a la raíz (“/”) del enrutador
router.get("/:username", getUserByUsername); // parámetro de ruta que Express.js puede capturar y pasar a la función
router.post("/", createUser); //solicitudes POST a la raíz (“/”) del enrutador
router.put("/:username", updateUser); //solicitudes PUT a “/:username”
router.delete("/:username", deleteUser); // las solicitudes DELETE a “/:username”.
router.post("/login", loginUser); // las solicitudes POST a “/login”.

router.post("/presion", authenticateToken, presionController.recordPresion); //ruta a la toma de presion arterial 

export default router;
