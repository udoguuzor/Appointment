import { prisma } from "../config/db.js"

export const UserRegisterService = async (username, email, password) => {
    return await prisma.user.create({
        data: {
            username,
            email,
            password
        }
    });
}

export const UserRoleService = async (id) => {
    return await prisma.user.update({
        where: {
            id
        },
        data: {
            role: "SERVICE_PROVIDER"
        }
    });
};

export const UserLoginService = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
};


export const updatePasswordService = async (id, hashedPassword) => {
    return await prisma.user.update({
        where: { id },
        data: { password: hashedPassword }
    });
};

export const logoutService = async (userId) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { token: null }
    });
};
