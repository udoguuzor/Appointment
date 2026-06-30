import express from 'express';
import { getCalendar, getProviderDashboard, getUserDashboard } from '../controller/dashboard.controller.js';
import { authenticationToken, roleMiddleware } from '../middleware/authMiddleware.js';

const AT = authenticationToken;
const role = roleMiddleware;
export const dashboardRouter = express.Router();

dashboardRouter.get('/calendar/:serviceId', getCalendar);
dashboardRouter.get('/provider', AT, role('SERVICE_PROVIDER'), getProviderDashboard);
dashboardRouter.get('/user', AT, role('USER'), getUserDashboard);
