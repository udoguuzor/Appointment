import express from 'express';
import { newAccessToken } from '../controller/auth.controller.js';


export const authRoute = express.Router();

authRoute.post('/new-access-token', newAccessToken);
