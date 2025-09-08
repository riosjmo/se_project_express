const router = require("express").Router();
const { login } = require("../controllers/users");
const { getCurrentUser } = require("../controllers/users");

router.post("/login", login);
router.get("/me", getCurrentUser);

module.exports = router;
