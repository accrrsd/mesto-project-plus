import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../utils/errors'

import { JWT_SECRET } from '../configuration/config'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let verifyRes
  try {
    const token = req.headers.authorization!.split(' ')[1]
    if (!token) {
      next(new UnauthorizedError('Ошибка авторизации'))
      return
    }
    verifyRes = jwt.verify(token, JWT_SECRET)
  } catch (e) {
    next(new UnauthorizedError('Ошибка авторизации'))
    return
  }
  // @ts-ignore:next-line
  req.user = verifyRes
  next()
}

export default authMiddleware
