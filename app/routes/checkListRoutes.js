import express from 'express';
import { otherController,
    createChecklist, 
    getChecklist } from '../controllers/checkListController';

const checkRouter = express.Router();

checkRouter.post('/', createChecklist);
checkRouter.get("/other", otherController);
checkRouter.get('/:username', getChecklist);

export default checkRouter;