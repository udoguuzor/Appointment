import { prisma } from "../config/db.js";
import { responseHandler } from "../middleware/responseHandler.js";
import { generateAccessToken } from "../middleware/token.js";
import { verifyRefreshToken, deleteRefreshToken } from "../model/auth.model.js";


export async function newAccessToken(req, res, next) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.json('Refresh token is required');

    try {
        const token = await verifyRefreshToken(refreshToken);


        if (!token) return res.json('Invalid refresh token');

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.json('Invalid refresh token');

            const payload = {
                id: user.id,
                email: user.email,
            };
            const accessToken = generateAccessToken(payload);
            responseHandler(res, 200, 'Access token generated successfully', { accessToken });

        });


    } catch (err) {
        next(err);
    }
}


export async function logout(req, res, next) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.json('Refresh token is required');

    try {
        const token = await deleteRefreshToken(refreshToken);


        if (!token) return res.json('Invalid refresh token');

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.json('Invalid refresh token');

            const payload = {
                id: user.id,
                email: user.email,
            };
            const accessToken = generateAccessToken(payload);
            responseHandler(res, 200, 'Access token generated successfully', { accessToken });
        });

    } catch (err) {
        next(err);
    }
}
