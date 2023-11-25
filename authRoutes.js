import express from 'express';
import { 
    loginUser,
    logoutUser,
    forgotPassword,
    getResetPasswordByIdToken,
    resetPassword
} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/forgot", forgotPassword);
authRouter.get("/forgot", forgotPassword);
authRouter.post("/reset", resetPassword);
authRouter.get("/forgot/:id/:token", getResetPasswordByIdToken);


export default authRouter;
