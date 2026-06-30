import express from 'express';
import { userRouter } from './user.route.js';
import { serviceRouter } from './service.route.js';
import { bookingRoute } from './booking.route.js';
import { authRoute } from './auth.route.js';
import { dashboardRouter } from './dashboard.route.js';


const router = express.Router();
router.use(userRouter);
router.use(serviceRouter);
router.use(bookingRoute);
router.use(authRoute);
router.use('/dashboard', dashboardRouter);


export default router;