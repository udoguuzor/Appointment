import { prisma } from "../config/db.js";


export async function createServiceModel(name, userId, description, duration, avaliability) {
    return await prisma.service.create({
        data: {
            name,
            description,
            userId,
            duration,
            avaliability: {
                create: avaliability.map(item => ({
                    dayOfWeek: item.dayOfWeek,
                    startTime: item.startTime,
                    endTime: item.endTime
                }))
            }
        },
        include: { avaliability: true }   // Return the schedule in the response
    })
}


export async function getServiceInfoModel(id) {
    return await prisma.service.findUnique({
        where: { id },
        include: { avaliability: true }
    });
}

export async function closeServiceModel(id) {
    return await prisma.service.delete({
        where: { id }
    });
}