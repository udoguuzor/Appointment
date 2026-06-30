import express from 'express';
import { createService, getServiceInfo, closeService } from '../controller/service.controller.js';
import { authenticationToken, roleMiddleware } from '../middleware/authMiddleware.js';

export const serviceRouter = express.Router();

const AT = authenticationToken;
const role = roleMiddleware;

serviceRouter.post('/createService', AT, role('SERVICE_PROVIDER'), createService);
serviceRouter.get('/getServiceInfo/:id', AT, getServiceInfo);
serviceRouter.delete('/closeService/:id', AT, role('SERVICE_PROVIDER'), closeService);