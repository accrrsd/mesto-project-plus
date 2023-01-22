import { Router } from 'express'
import {
  postUser, getUserById, getUsers, patchUser, patchUserAvatar,
} from '../controllers/users'

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/', postUser)
router.patch('/me', patchUser)
router.patch('/me/avatar', patchUserAvatar)

export default router
