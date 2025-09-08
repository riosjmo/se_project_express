const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", clothingItemRouter);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: "Router Not Found" });
});

module.exports = router;
