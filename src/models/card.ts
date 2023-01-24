import mongoose, { Schema } from 'mongoose'
import validator from 'validator'
import { invalidUrl } from '../utils/validationErrors'

interface ICard {
  name: string
  link: string
  owner: Schema.Types.ObjectId
  likes: Schema.Types.ObjectId[]
  createdAt: Date
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: [validator.isURL, invalidUrl],
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})
export default mongoose.model('card', cardSchema)
