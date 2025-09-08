const router = require("express").Router();
const { login, getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/login", login);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
