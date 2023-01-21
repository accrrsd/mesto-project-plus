import express from 'express'
import mongoose from 'mongoose'
import usersRouter from './routes/users'
import cardsRouter from './routes/cards'

const { PORT = 3000 } = process.env

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/mestodb')

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.use((req, res, next) => {
  //@ts-ignore:next-line
  req.user = {
    _id: '63cb092f292ddccc3bda2928',
  }

  next()
})

app.listen(PORT)
