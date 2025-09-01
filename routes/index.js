const router = require("express").Router();
const clothingItem = require("./clothingItems");

const userRouter = require("./users");

router.use("/items", clothingItem);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(400).send({ message: "Router Not Found" });
});

module.exports = router;
