import { prisma } from "../config/db.js";
import { responseHandler } from "../middleware/responseHandler.js";
import { bookingModel, bookingUpdate, bookingCompleted } from "../model/booking.model.js";
import { 
    sendBookingConfirmationEmail, 
    sendBookingCancellationEmail, 
    sendBookingRejectedEmail, 
    sendBookingRescheduledEmail 
} from "../utils/email.js";

export async function booking(req, res, next) {
    const { userId: _userId, serviceId, startTime, endTime } = req.body;
    const userId = Number(_userId);
    if (!userId || !serviceId || !startTime || !endTime) return res.status(400).json("Credentials inComplete");

    try {
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: { avaliability: true }
        });
        if (!service) throw new Error('Service not found');

        const bookingDate = new Date(startTime);
        const dayOfWeek = bookingDate.getDay();

        const avaliableSlot = service.avaliability.find(slot => slot.dayOfWeek === dayOfWeek);
        if (!avaliableSlot) throw new Error("Service not avaliable on this day");

        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        const durationInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
        
        if (durationInMinutes > service.duration) {
            throw new Error(`Booking not exceed ${service.duration} minutes`);
        }

        const requestedStart = bookingDate.toTimeString().slice(0, 5);
        const requestedEnd = new Date(endTime).toTimeString().slice(0, 5);

        if (requestedStart < avaliableSlot.startTime || requestedEnd > avaliableSlot.endTime) {
            throw new Error("Outside service hours");
        }

        const overlaping = await prisma.booking.findFirst({
            where: {
                serviceId,
                status: { not: "CANCELLED" },
                OR: [
                    {
                        startTime: { lt: new Date(endTime) },
                        endTime: { gt: new Date(startTime) }
                    }
                ]
            }
        });

        if (overlaping) throw new Error("Time slot already booked");

        const book = await bookingModel(serviceId, userId, startTime, endTime);

        // Fetch user email to send notification
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user && user.email) {
            await sendBookingConfirmationEmail(user.email, { serviceName: service.name, startTime: book.startTime });
        }

        responseHandler(res, 201, `You have been booked by ${book.startTime} to ${book.endTime}`, book);
    } catch (err) {
        next(err);
    }
}

export async function acceptBooking(req, res, next) {
    try {
        const { id } = req.params;
        const booking = await bookingUpdate(id, "CONFIRMED"); // Ensure matches schema CONFIRMED
        responseHandler(res, 200, "Booking accepted", booking);
    } catch (err) {
        next(err);
    }
}

export async function cancelBooking(req, res, next) {
    try {
        const { id } = req.params;
        const booking = await bookingUpdate(id, "CANCELLED");

        const user = await prisma.user.findUnique({ where: { id: booking.userId } });
        const service = await prisma.service.findUnique({ where: { id: booking.serviceId } });
        if (user && user.email && service) {
            await sendBookingCancellationEmail(user.email, { serviceName: service.name, startTime: booking.startTime });
        }

        responseHandler(res, 200, "Booking cancelled", booking);
    } catch (err) {
        next(err);
    }
}

export async function completedBooking(req, res, next) {
    try {
        const { id } = req.params;
        const booking = await bookingCompleted(id);
        responseHandler(res, 200, "Booking marked as completed", booking);
    } catch (err) {
        next(err);
    }
}

export async function rejectBooking(req, res, next) {
    try {
        const { id } = req.params;
        const booking = await bookingUpdate(id, "REJECTED");

        const user = await prisma.user.findUnique({ where: { id: booking.userId } });
        const service = await prisma.service.findUnique({ where: { id: booking.serviceId } });
        if (user && user.email && service) {
            await sendBookingRejectedEmail(user.email, { serviceName: service.name, startTime: booking.startTime });
        }

        responseHandler(res, 200, "Booking rejected", booking);
    } catch (err) {
        next(err);
    }
}

export async function missedBooking(req, res, next) {
    try {
        const { id } = req.params;
        const booking = await bookingUpdate(id, "MISSED");
        responseHandler(res, 200, "Booking marked as missed", booking);
    } catch (err) {
        next(err);
    }
}

export async function reschedule(req, res, next) {
    try {
        const { id } = req.params;
        const { newStartTime, newEndTime } = req.body;
        if (!newStartTime || !newEndTime) return res.status(400).json("newStartTime and newEndTime required");

        // Simple validation logic (you'd normally want full availability checking here too)
        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { startTime: new Date(newStartTime), endTime: new Date(newEndTime), status: "CONFIRMED" }
        });

        const user = await prisma.user.findUnique({ where: { id: updatedBooking.userId } });
        const service = await prisma.service.findUnique({ where: { id: updatedBooking.serviceId } });
        if (user && user.email && service) {
            await sendBookingRescheduledEmail(user.email, { serviceName: service.name, startTime: updatedBooking.startTime });
        }

        responseHandler(res, 200, "Booking rescheduled", updatedBooking);
    } catch (err) {
        next(err);
    }
}
