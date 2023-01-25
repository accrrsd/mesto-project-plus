import mongoose from 'mongoose'
import validator from 'validator'
import { invalidUrl } from '../utils/validationErrors'

interface IUser {
  name: string
  about: string
  avatar: string
  email: string
  password: string
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: [validator.isURL, invalidUrl],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: [validator.isEmail, 'Некорректный Email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
})

export default mongoose.model('user', userSchema)
