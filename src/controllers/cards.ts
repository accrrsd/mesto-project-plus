import { Request, Response, NextFunction } from 'express'
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors'
import Card from '../models/card'

export const getCards = (req: Request, res: Response, next: NextFunction) =>
  Card.find({})
    .then((cards) => res.json(cards))
    .catch(next)

export const postCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body
  // @ts-ignore:next-line
  Card.create({ name, link, owner: req.user._id })
    .catch((err) => {
      throw new BadRequestError(`Указаны некорректные данные карточки${err.message}`)
    })
    .then((card) => res.json(card))
    .catch(next)
}

export const deleteCard = (req: Request, res: Response, next: NextFunction) =>
  Card.findById(req.params.id)
    .orFail()
    .catch(() => {
      throw new NotFoundError(`Не существует карточки по id: ${req.params.id}`)
    })
    .then((currentCard) => {
      // @ts-ignore:next-line
      if (currentCard.owner.toString() !== req.user._id) throw new ForbiddenError('Недостаточно прав для удаления карточки')
      Card.findByIdAndDelete(req.params.id)
        .then((deletedCardData) => res.json(deletedCardData))
        .catch(next)
    })
    .catch(next)

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-ignore:next-line
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .catch(() => {
      throw new NotFoundError(`Не существует карточки по id: ${req.params.id}`)
    })
    .then((like) => res.json(like))
    .catch(next)
}

export const removeLikeFromCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-ignore:next-line
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .catch(() => {
      throw new NotFoundError(`Не существует карточки по id: ${req.params.id}`)
    })
    .then((like) => res.json(like))
    .catch(next)
}
