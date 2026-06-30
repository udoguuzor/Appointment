import { prisma } from "../config/db.js";

export async function verifyRefreshToken(refreshToken) {
    return await prisma.token.findUnique({
        where: { token: refreshToken }
    });
}

export async function deleteRefreshToken(refreshToken) {
    return await prisma.token.delete({
        where: { token: refreshToken }
    });
}
