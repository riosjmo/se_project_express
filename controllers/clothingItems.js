const clothingItem = require("../models/clothingItems");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
      return null;
    });
};

const getItems = (req, res) => {
  clothingItem
    .find()
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
      return null;
    });
};


const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  clothingItem
    .findByIdAndUpdate(itemId, { imageUrl }, { new: true })
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
      return null;
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send({ message: "Item deleted successfully" });
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
      return null;
    });
};


const likeItem = (req, res) => {
  clothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
      return null;
    });
};

const dislikeItem = (req, res) => {
  clothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
      return null;
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};