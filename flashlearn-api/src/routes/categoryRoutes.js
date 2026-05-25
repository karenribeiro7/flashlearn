const { Router } = require("express");
const { listCategories, createCategory, deleteCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = Router();

router.get("/categories", authMiddleware, listCategories);
router.post("/categories", authMiddleware, createCategory);
router.delete("/categories/:id", authMiddleware, deleteCategory);

module.exports = router;