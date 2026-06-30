import { prisma } from "../config/db.js";


export const bookingModel = async (serviceId, userId, startTime, endTime) => {
    return await prisma.booking.create({
        data: {
            serviceId,
            userId,
            startTime,
            endTime,
            status: "PENDING"
        }
    });
}

export const bookingUpdate = async (id, status) => {
    return await prisma.booking.update({
        where: { id },
        data: { status }
    });
}

export const bookingCompleted = async (id) => {
    return await prisma.booking.update({
        where: { id },
        data: { status: "COMPLETED" }
    });
}


