import { Router } from 'express'
import {
  getCurrentUser, getUserById, getUsers, patchUser, patchUserAvatar
} from '../controllers/users'

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.get('/me', getCurrentUser)
router.patch('/me', patchUser)
router.patch('/me/avatar', patchUserAvatar)

export default router
