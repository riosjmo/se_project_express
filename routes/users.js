const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch(
  "/me",
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

module.exports = router;
