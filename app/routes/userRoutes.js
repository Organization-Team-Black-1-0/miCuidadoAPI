import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:username", userController.getUserByUsername);
router.post("/", userController.createUser);
router.put("/:username", userController.updateUser);
router.delete("/:username", userController.deleteUser);

export default router;
