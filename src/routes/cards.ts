import { Router } from 'express'
import { getCards, postCard, deleteCard, likeCard, removeLikeFromCard } from '../controllers/cards'
const router = Router()

router.get('/', getCards)
router.post('/', postCard)
router.delete('/:id', deleteCard)
router.put('/:cardId/likes', likeCard)
router.delete('/:cardId/likes', removeLikeFromCard)

export default router
