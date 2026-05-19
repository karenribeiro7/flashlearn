const { Router } = require("express");

const {
  listCategories,
  listDecks,
  createDeck,
  updateDeck,
  deleteDeck,
} = require("../controllers/deckController");
const {
  listFlashcards,
  createFlashcard,
} = require("../controllers/flashcardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

router.get("/categories", authMiddleware, listCategories);
router.get("/decks", authMiddleware, listDecks);
router.post("/decks", authMiddleware, createDeck);
router.get("/decks/:deckId/flashcards", authMiddleware, listFlashcards);
router.post("/decks/:deckId/flashcards", authMiddleware, createFlashcard);
router.put("/decks/:id", authMiddleware, updateDeck);
router.delete("/decks/:id", authMiddleware, deleteDeck);

module.exports = router;
