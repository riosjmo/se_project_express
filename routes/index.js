const router = require("express").Router();
const clothingItem = require("./clothingItems");
const { BAD_REQUEST_ERROR_CODE } = require("../utils/errors");

const userRouter = require("./users");

router.use("/items", clothingItem);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Router Not Found" });
});

module.exports = router;
