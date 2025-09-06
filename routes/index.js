const router = require("express").Router();
const clothingItem = require("./clothingItems");
const { BAD_REQUEST_ERROR_CODE } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

const userRouter = require("./users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", clothingItem);

router.use(auth);

router.use("/items", clothingItem);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Router Not Found" });
});

module.exports = router;
