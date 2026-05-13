const { Router } = require("express");
const { register, login } = require("../controllers/userController");

const router = Router();

router.post("/users/register", register);
router.post("/users/login", login);

module.exports = router;