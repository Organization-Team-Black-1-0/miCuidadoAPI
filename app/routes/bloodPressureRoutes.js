import express from 'express';
import { 
    getBloodPressure,
    getBloodPressureByUsername,
    createBloodPressure,
    updateBloodPressure,
    deleteBlood
} from '../controllers/bloodPressureController.js';

const bloodPressureRouter = express.Router();

bloodPressureRouter.get("/", getBloodPressure);
bloodPressureRouter.get("/:username", getBloodPressureByUsername);
bloodPressureRouter.post("/", createBloodPressure);
bloodPressureRouter.put("/:username", updateBloodPressure);
bloodPressureRouter.delete("/:username", deleteBlood);

export default bloodPressureRouter;
