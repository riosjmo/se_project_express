const router = require("express").Router();
const { login } = require("../controllers/users");
const { getCurrentUser } = require("../controllers/users");
const { updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
auth;

router.post("/login", login);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
