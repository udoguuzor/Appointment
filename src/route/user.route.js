import express from 'express';
import { UserRegister, UserLogin, changePassword, logout, forgotPassword, resetPassword } from '../controller/user.controller.js';
import { authenticationToken } from '../middleware/authMiddleware.js';

export const userRouter = express.Router();

const AT = authenticationToken;

userRouter.post('/signup', UserRegister);
userRouter.post('/login', UserLogin);
userRouter.post('/changePassword', AT, changePassword);
userRouter.post('/logout', AT, logout);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
