const clothingItem = require("../models/clothingItems");
const {
  NOT_FOUND_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server" });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find()
    .then((items) => res.status(200).send(items))
    .catch(() =>
      res.status(500).send({ message: "An error occurred on the server" })
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndDelete(itemId)
    .then((item) =>
      !item
        ? res.status(NOT_FOUND_ERROR_CODE).send({ message: "Item not found" })
        : res.status(200).send({ message: "Item deleted successfully" })
    )
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server" });
    });
};

const likeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid data provided" });
      }
      if (error.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }
      return res.status(200).send(item);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid data provided" });
      }
      if (error.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(500)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
