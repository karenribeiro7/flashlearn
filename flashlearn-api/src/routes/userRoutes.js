const { Router } = require("express");
const { register } = require("../controllers/userController");

const router = Router();

router.post("/users/register", register);

module.exports = router;