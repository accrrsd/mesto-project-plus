import { celebrate, Joi } from 'celebrate'

export const checkCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(3).max(30),
    password: Joi.string().required(),
    about: Joi.string().min(3).max(30),
    email: Joi.string().required().email(),
    avatar: Joi.string().uri(),
  }),
})

export const checkLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
})

export const checkPatchUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(3).max(30),
    about: Joi.string().min(3).max(30),
  }),
})

export const checkPatchUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
})

export const checkUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
})
