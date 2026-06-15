const { Router } = require("express");
const express = require("express");
const {
  listFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} = require("../controllers/flashcardController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = Router();

const parseBody = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    upload.single("image")(req, res, next);
  } else {
    express.json()(req, res, next);
  }
};

router.get("/decks/:deckId/flashcards", authMiddleware, listFlashcards);
router.post("/decks/:deckId/flashcards", parseBody, authMiddleware, createFlashcard);
router.put("/decks/:deckId/flashcards/:id", parseBody, authMiddleware, updateFlashcard);
router.delete("/decks/:deckId/flashcards/:id", authMiddleware, deleteFlashcard);

module.exports = router;