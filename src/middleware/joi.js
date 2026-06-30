import Joi from 'joi';

export const authSchema = Joi.object({
    email: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required()
})