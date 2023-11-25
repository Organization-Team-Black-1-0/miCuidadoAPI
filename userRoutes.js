import express from 'express';
import {
    getUsers,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername);
usersRouter.post("/", createUser);
usersRouter.put("/:username", updateUser);
usersRouter.delete("/:username", deleteUser);


export default usersRouter;
