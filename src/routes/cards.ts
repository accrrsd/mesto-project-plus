import { Router } from 'express'
import {
  getCards, postCard, deleteCard, likeCard, removeLikeFromCard
} from '../controllers/cards'
import { checkCard, checkCardId } from '../validators/cardValidators'

const router = Router()

router.get('/', getCards)
router.post('/', checkCard, postCard)
router.delete('/:cardId', checkCardId, deleteCard)
router.put('/:cardId/likes', checkCardId, likeCard)
router.delete('/:cardId/likes', checkCardId, removeLikeFromCard)

export default router
