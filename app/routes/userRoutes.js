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
//import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Rutas que no requieren autenticación
router.post("/", createUser); // para registro de usuario
router.post("/login", loginUser); //  inicio de sesión

// Middleware de autenticación
//router.use(authenticateToken);

// Rutas que requieren autenticación
router.get("/", getUsers); //sObtener usuarios
router.get("/:username", getUserByUsername); // Obtener usuario por nombre de usuario
router.post("/", createUser); //solicitudes POST a la raíz (“/”) del enrutador
router.put("/:username", updateUser); // Actulizar usuario
router.delete("/:username", deleteUser); // Eliminar usuario
router.post("/login", loginUser); // las solicitudes POST a “/login”.

router.post("/presion", presionController.recordPresion); //ruta a registro de presion arterial 

export default router;
