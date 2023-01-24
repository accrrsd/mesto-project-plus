import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_COOKIE_EXPIRES, JWT_SECRET } from '../configuration/config'
import User from '../models/user'
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors'

/* eslint no-param-reassign: "off" */

export const getUsers = (req: Request, res: Response, next: NextFunction) =>
  User.find({})
    .then((users) => res.json(users))
    .catch(next)

export const getUserById = (req: Request, res: Response, next: NextFunction) =>
  User.findById(req.params.id)
    .orFail()
    .catch(() => {
      throw new NotFoundError(`Не существует пользователя с id: ${req.params.id}`)
    })
    .then((user) => res.json(user))
    .catch(next)

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, password, email } = req.body
  bcrypt.hash(password, 10).then((hashedPassword) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Email уже занят'))
        } else if (err.name === 'ValidationError') {
          next(new BadRequestError('Переданы некорректные данные'))
        } else {
          next(err)
        }
      })
      .then(() => {
        res.json({
          name,
          about,
          avatar,
          email,
        })
      })
      .catch(next)
  })
}

export const patchUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body

  // @ts-ignore:next-line
  User.findOneAndUpdate(req.user._id, { name, about })
    .orFail(() => {
      throw new NotFoundError(`Не существует пользователя с id: ${req.params.id}`)
    })
    .catch((err) => {
      if (err instanceof NotFoundError) throw err
      throw new BadRequestError(`Некорректные данные обновления пользователя${err.message}`)
    })
    .then((user) => res.json(user))
    .catch(next)
}

export const patchUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body
  // @ts-ignore:next-line
  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail(() => {
      throw new NotFoundError(`Не существует пользователя с id: ${req.params.id}`)
    })
    .catch((err) => {
      if (err instanceof NotFoundError) throw err
      throw new BadRequestError(`Некорректные данные обновления аватара${err.message}`)
    })
    .then((newAva) => res.json(newAva))
    .catch(next)
}

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore:next-line
  User.findOne({ _id: req.user._id })
    .orFail(() => {
      throw new NotFoundError('Ошибка получения текущего пользователя')
    })
    .then((user) => res.json(user))
    .catch(next)
}

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильный логин или пароль'))
        return
      }

      bcrypt.compare(password, user.password).then((correct) => {
        if (!correct) {
          next(new UnauthorizedError('Неправильный логин или пароль'))
          return
        }
        // token
        const userId = user._id
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_COOKIE_EXPIRES })
        // cookie
        const cookieSettings = {
          maxAge: 1000 * 60 * 60 * 24 * JWT_COOKIE_EXPIRES,
          httpOnly: true,
        }
        // sending
        user.password = ''
        res.cookie('jwt', token, cookieSettings)
        res.status(200).send(user)
      })
    })
    .catch(next)
}
