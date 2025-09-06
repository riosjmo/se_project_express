const router = require("express").Router();
const { login } = require("../controllers/users");


router.post("/login", login);

module.exports = router;