const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.get("/", getItems);

router.post(
  "/",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      weather: Joi.string().valid("hot", "warm", "cold").required(),
      imageUrl: Joi.string().uri().required(),
    }),
  }),
  createItem
);

router.delete(
  "/:itemId",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteItem
);

router.put(
  "/:itemId/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    }),
  }),
  likeItem
);

router.delete(
  "/:itemId/likes",
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeItem
);

module.exports = router;
