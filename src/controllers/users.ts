import { Request, Response, NextFunction } from 'express'
import { BadRequestError, NotFoundError } from '../utils/errors'
import User from '../models/user'

export const getUsers = (req: Request, res: Response, next: NextFunction) =>
  User.find({})
    .then((users) => res.json(users))
    .catch(next)

export const getUserById = (req: Request, res: Response, next: NextFunction) =>
  User.findById(req.params.id)
    .orFail()
    .catch(() => {
      throw new NotFoundError('Не существует пользователя с id: ' + req.params.id)
    })
    .then((user) => res.json(user))
    .catch(next)

export const postUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body
  User.create({ name, about, avatar })
    .then(() => {
      res.json({ name, about, avatar })
    })
    .catch(next)
}

export const patchUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body

  //@ts-ignore:next-line
  User.findOneAndUpdate(req.user._id, { name, about })
    .orFail(() => {
      throw new NotFoundError('Не существует пользователя с id: ' + req.params.id)
    })
    .catch((err) => {
      if (err instanceof NotFoundError) throw err
      throw new BadRequestError('Некорректные данные обновления пользователя' + err.message)
    })
    .then((user) => res.json(user))
    .catch(next)
}

export const patchUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body
  //@ts-ignore:next-line
  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail(() => {
      throw new NotFoundError('Не существует пользователя с id: ' + req.params.id)
    })
    .catch((err) => {
      if (err instanceof NotFoundError) throw err
      throw new BadRequestError('Некорректные данные обновления аватара' + err.message)
    })
    .then((newAva) => res.json(newAva))
    .catch(next)
}
