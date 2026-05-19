const prisma = require("../database/prismaClient");

function parseDeckIdParam(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

async function listFlashcards(req, res) {
  const deckId = parseDeckIdParam(req.params.deckId);
  if (!deckId) {
    return res.status(400).json({ error: "deckId inválido" });
  }

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId: req.userId },
  });

  if (!deck) {
    return res.status(404).json({ error: "Deck não encontrado" });
  }

  const flashcards = await prisma.flashcard.findMany({
    where: { deckId },
    orderBy: { id: "asc" },
    select: { id: true, question: true, answer: true, deckId: true },
  });

  return res.status(200).json(flashcards);
}

async function createFlashcard(req, res) {
  const deckId = parseDeckIdParam(req.params.deckId);
  if (!deckId) {
    return res.status(400).json({ error: "deckId inválido" });
  }

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId: req.userId },
  });

  if (!deck) {
    return res.status(404).json({ error: "Deck não encontrado" });
  }

  const { question, answer } = req.body;

  if (!question || typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "question é obrigatório" });
  }

  if (!answer || typeof answer !== "string" || !answer.trim()) {
    return res.status(400).json({ error: "answer é obrigatório" });
  }

  const flashcard = await prisma.flashcard.create({
    data: {
      question: question.trim(),
      answer: answer.trim(),
      deckId,
    },
  });

  return res.status(201).json(flashcard);
}

module.exports = { listFlashcards, createFlashcard };
