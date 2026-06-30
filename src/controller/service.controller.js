import { prisma } from "../config/db.js";
import { createServiceModel, getServiceInfoModel } from "../model/service.model.js";
import { UserRoleService } from "../model/user.model.js";
import { responseHandler } from "../middleware/responseHandler.js";
import { days } from "../middleware/fewLogic.js";



export async function createService(req, res, next) { //Open to everybody
    const { name, userId, description, duration, avaliability } = req.body;
    if (!name || !duration || !avaliability) return res.json('Description is optional but the res are needed');
    const modUserId = Number(userId); // UserId should be stored as int not as string.

    try {
        const newService = await createServiceModel(name, modUserId, description, duration, avaliability)

        const userRole = await UserRoleService(modUserId);

        responseHandler(res, 201, `A service named ${newService.name} has been created and is now a ${userRole.role} provider `, { newService, userRole });

    } catch (err) {
        next(err)
    }
}


export async function getServiceInfo(req, res, next) { //Open to everybody

    try {
        const serviceInfo = await getServiceInfoModel(req.params.id);

        const _serviceInfo = {
            ...serviceInfo,
            avaliability: serviceInfo.avaliability.map(slot => ({
                ...slot,
                dayOfWeek: days[slot.dayOfWeek] ?? "unknown"
            }))
        }

        responseHandler(res, 200, `This is the info for --> ${serviceInfo.name} `, _serviceInfo);
    } catch (err) {
        next(err)
    }
}

export async function closeService(req, res, next) { //Open to only serviceProviders
    //Here serviceProviders can close the service they are providing
    const { id } = req.params;
    try {
        const deletedService = await closeServiceModel(id);
        responseHandler(res, 200, `Service ${deletedService.name} has been deleted`, deletedService);
    } catch (err) {
        next(err);
    }

}