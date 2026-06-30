import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
}

export async function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
}
