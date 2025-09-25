const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const auth = require("../middlewares/auth");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8).max(100),
    }),
  }),
  login
);
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8).max(100),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser
);

router.use("/items", clothingItemRouter);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new UnauthorizedError("Authorization required"));
});

module.exports = router;
