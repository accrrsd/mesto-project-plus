import { Router } from 'express'
import { checkPatchUser, checkPatchUserAvatar, checkUserId } from '../validators/userValidators'
import {
  getCurrentUser, getUserById, getUsers, patchUser, patchUserAvatar
} from '../controllers/users'

const router = Router()

router.get('/', getUsers)
router.get('/me', getCurrentUser)
router.get('/:id', checkUserId, getUserById)
router.patch('/me', checkPatchUser, patchUser)
router.patch('/me/avatar', checkPatchUserAvatar, patchUserAvatar)

export default router
