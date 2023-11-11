import { signUpController, resetPasswordRequestController, resetPasswordController } from "../Controllers/auth.controller.mjs";
  
  const router = require("express").Router();
  
  router.post("/auth/signup", signUpController);
  router.post("/auth/requestResetPassword", resetPasswordRequestController);
  router.post("/auth/resetPassword", resetPasswordController);
  
  export default router;