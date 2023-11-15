import express from 'express';
import { 
    getUsers, 
    getUserByUsername, 
    createUser, 
    updateUser, 
    deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.get("/", getUsers);
router.get("/:username", getUserByUsername);
router.post("/", createUser);
router.put("/:username", updateUser);
router.delete("/:username", deleteUser);

export default router;
