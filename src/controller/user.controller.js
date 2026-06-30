import { prisma } from "../config/db.js";
import bcrypt from 'bcrypt';
import { authSchema, registerSchema } from "../middleware/joi.js";
import { UserRegisterService, UserLoginService, updatePasswordService, logoutService } from "../model/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../middleware/token.js";
import { responseHandler } from "../middleware/responseHandler.js";
import { storeToken } from "../model/token.model.js";
import crypto from 'crypto';
import { sendPasswordResetEmail } from "../utils/email.js";

export const UserRegister = async (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { username, email, password } = req.body;
    if (!username || !email || !password) res.status(404).json('Credentials needed for signup incomplete');

    const checkEmail = await UserLoginService(email);
    if (checkEmail) return res.status(400).json({ message: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const register = await UserRegisterService(username, email, hashedPassword);

        responseHandler(res, 200, `${username} has registered...`, register);

    } catch (err) {
        next(err)
    }

}

export const UserLogin = async (req, res, next) => {
    const { error } = authSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password } = req.body;
    if (!email || !password) res.status(404).json('Credentials needed for login incomplete');

    try {
        const user = await UserLoginService(email);

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.json({ message: 'Invalid credentials' });

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        }

        const accesstoken = await generateAccessToken(payload);
        const refreshtoken = await generateRefreshToken(payload);

        const storingToken = await storeToken(payload.userId, refreshtoken);

        const objToken = {
            message: `${user.username} has logged.`,
            tokens: { accessToken: accesstoken, refreshtoken: refreshtoken },
            fromTokenDB: { storingToken }
        };

        responseHandler(res, 200, `${user.username} has logged in...`, objToken);

    } catch (err) {
        next(err);
    }
}


export const changePassword = async (req, res, next) => {

    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) res.status(404).json('Credentials needed for login incomplete');

    try {
        const user = await UserLoginService(email);

        const validPassword = await bcrypt.compare(oldPassword, user.password);
        if (!validPassword) return res.json({ message: 'Invalid credentials' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatePassword = await updatePasswordService(user.id, hashedPassword);

        responseHandler(res, 200, `${user.username} has changed password successfully...`, updatePassword);

    } catch (err) {
        next(err);
    }
}

export const logout = async (req, res, next) => {
    const { userId } = req.body;
    if (!userId) res.status(404).json('Credentials needed for logout incomplete');

    try {
        const logout = await logoutService(userId);


        responseHandler(res, 200, `${logout.username} has logged out successfully...`, logout);

    } catch (err) {
        next(err);
    }
}

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    if (!email) return res.status(400).json('Email is required');

    try {
        // user login service returns user if exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json('User not found');

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry }
        });

        await sendPasswordResetEmail(email, resetToken);

        responseHandler(res, 200, 'Password reset email sent');
    } catch (err) {
        next(err);
    }
}

export const resetPassword = async (req, res, next) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json('Token and new password are required');

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() }
            }
        });

        if (!user) return res.status(400).json('Invalid or expired token');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        responseHandler(res, 200, 'Password has been reset successfully');
    } catch (err) {
        next(err);
    }
}

