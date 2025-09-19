const clothingItem = require("../models/clothingItems");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  clothingItem
    .find()
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  clothingItem
    .findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }
      return clothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.status(200).send({ message: "Item deleted successfully" }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
