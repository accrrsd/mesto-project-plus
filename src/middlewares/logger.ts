import winston from 'winston'
import expressWinston from 'express-winston'

export const requestLogger = expressWinston.logger({
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'request.log' })],
})

export const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
})
