import { prisma } from "../config/db.js";
import { responseHandler } from "../middleware/responseHandler.js";

// Returns available and booked slots for a specific service (for calendar view)
export async function getCalendar(req, res, next) {
    try {
        const { serviceId } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) return res.status(400).json('startDate and endDate is required');

        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            include: { avaliability: true }
        });

        if (!service) return res.status(404).json('Service not found');

        const bookings = await prisma.booking.findMany({
            where: {
                serviceId,
                status: { not: "CANCELLED" },
                startTime: { gte: new Date(startDate) },
                endTime: { lte: new Date(endDate) }
            }
        });

        responseHandler(res, 200, "Calendar fetched successfully", {
            serviceName: service.name,
            duration: service.duration,
            avaliability: service.avaliability,
            bookings: bookings
        });
    } catch (err) {
        next(err);
    }
}

// Returns summary statistics and upcoming schedule for a Service Provider
export async function getProviderDashboard(req, res, next) {
    try {
        const providerId = req.user.id;

        const services = await prisma.service.findMany({
            where: { userId: providerId },
            include: { booking: true }
        });

        const totalBookings = services.reduce((sum, service) => sum + service.booking.length, 0);
        const upcomingBookings = services.flatMap(s => s.booking.filter(b => b.startTime >= new Date() && b.status === 'CONFIRMED'));
        const pendingBookings = services.flatMap(s => s.booking.filter(b => b.status === 'PENDING'));

        responseHandler(res, 200, "Provider dashboard fetched", {
            totalBookings,
            upcomingBookings,
            pendingBookings,
            servicesCount: services.length
        });
    } catch (err) {
        next(err);
    }
}

// Returns upcoming and past bookings for a Student/User
export async function getUserDashboard(req, res, next) {
    try {
        const userId = req.user.id;

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: { service: true },
            orderBy: { startTime: 'asc' }
        });

        const upcoming = bookings.filter(b => b.startTime >= new Date() && b.status !== 'CANCELLED');
        const past = bookings.filter(b => b.startTime < new Date() || b.status === 'CANCELLED');

        responseHandler(res, 200, "User dashboard fetched", {
            upcoming,
            past
        });
    } catch (err) {
        next(err);
    }
}
