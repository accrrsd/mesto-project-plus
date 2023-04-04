import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

import { createUser, login } from './controllers/users'
import authMiddleware from './middlewares/auth'
import errorHandler from './middlewares/errorHandler'
import { errorLogger, requestLogger } from './middlewares/logger'
import cardsRouter from './routes/cards'
import usersRouter from './routes/users'
import { checkCreateUser, checkLogin } from './validators/userValidators'

dotenv.config()

const { PORT = 3000, DBURL = 'mongodb://localhost:27017/mestodb' } = process.env

const app = express()

app.use(express.json())
app.use(requestLogger)
app.use(express.urlencoded({ extended: true }))

mongoose.connect(DBURL)

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт')
  }, 0)
})

app.post('/signin', checkLogin, login)
app.post('/signup', checkCreateUser, createUser)
app.use(authMiddleware)
app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.use(errorLogger)
app.use(errorHandler)

app.listen(PORT)
