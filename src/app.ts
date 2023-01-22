import express, { Request, Response, NextFunction } from 'express'

import mongoose from 'mongoose'

import usersRouter from './routes/users'
import cardsRouter from './routes/cards'

const { PORT = 3000, DBURL = 'mongodb://localhost:27017/mestodb' } = process.env

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(DBURL)

app.use((req, res, next) => {
  // @ts-ignore:next-line
  req.user = {
    _id: '63cb092f292ddccc3bda2928',
  }

  next()
})

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' })
})

app.listen(PORT)
