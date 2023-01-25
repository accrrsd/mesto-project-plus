import { Request, Response, NextFunction } from 'express'

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore:next-line
  const { statusCode = 500, message } = err
  const currentMessage = statusCode === 500 ? 'На сервере произошла ошибка' : message

  res.status(statusCode).send({ message: currentMessage })
}
export default errorHandler
