import { prisma } from "../config/db.js";


export const storeToken = async (user, token) => {
    return await prisma.token.create({
        data: {
            tokenId: user,
            token
        }
    });
};


