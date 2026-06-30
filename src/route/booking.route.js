import express from 'express';
import { booking, acceptBooking, cancelBooking, completedBooking, reschedule, rejectBooking, missedBooking } from '../controller/booking.controller.js';
import { authenticationToken, roleMiddleware } from '../middleware/authMiddleware.js';

const AT = authenticationToken;
const role = roleMiddleware;
export const bookingRoute = express.Router();

bookingRoute.post('/booking', AT, booking);
bookingRoute.put('/booking/:id/accept', AT, role('SERVICE_PROVIDER'), acceptBooking);
bookingRoute.put('/booking/:id/cancel', AT, role('USER', "SERVICE_PROVIDER"), cancelBooking);
bookingRoute.put('/booking/:id/completed', AT, role('SERVICE_PROVIDER'), completedBooking);
bookingRoute.put('/booking/:id/reschedule', AT, role('USER', "SERVICE_PROVIDER"), reschedule);
bookingRoute.put('/booking/:id/reject', AT, role('SERVICE_PROVIDER'), rejectBooking);
bookingRoute.put('/booking/:id/missed', AT, role('SERVICE_PROVIDER'), missedBooking);
