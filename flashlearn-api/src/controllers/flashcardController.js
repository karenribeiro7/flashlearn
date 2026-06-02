const prisma = require("../database/prismaClient");

function parseCardIdParam(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

function parseQuestionAnswer(body) {
  const { question, answer } = body;

  if (!question || typeof question !== "string" || !question.trim()) {
    return { error: "Informe uma questão" };
  }

  if (!answer || typeof answer !== "string" || !answer.trim()) {
    return { error: "Informe a resposta" };
  }

  return {
    question: question.trim(),
    answer: answer.trim(),
  };
}

async function findUserFlashcard(deckId, flashcardId, userId) {
  return prisma.flashcard.findFirst({
    where: {
      id: flashcardId,
      deckId,
      deck: { userId },
    },
  });
}

async function listFlashcards(req, res) {
  const deckId = parseCardIdParam(req.params.deckId);
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
  const deckId = parseCardIdParam(req.params.deckId);
  if (!deckId) {
    return res.status(400).json({ error: "deckId inválido" });
  }

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId: req.userId },
  });

  if (!deck) {
    return res.status(404).json({ error: "Deck não encontrado" });
  }

  const parsed = parseQuestionAnswer(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  const flashcard = await prisma.flashcard.create({
    data: {
      question: parsed.question,
      answer: parsed.answer,
      deckId,
    },
  });

  return res.status(201).json(flashcard);
}

async function updateFlashcard(req, res) {
  const deckId = parseCardIdParam(req.params.deckId);
  const flashcardId = parseCardIdParam(req.params.id);

  if (!deckId) {
    return res.status(400).json({ error: "deckId inválido" });
  }
  if (!flashcardId) {
    return res.status(400).json({ error: "id inválido" });
  }

  const existing = await findUserFlashcard(deckId, flashcardId, req.userId);
  if (!existing) {
    return res.status(404).json({ error: "Flashcard não encontrado" });
  }

  const parsed = parseQuestionAnswer(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  const flashcard = await prisma.flashcard.update({
    where: { id: flashcardId },
    data: {
      question: parsed.question,
      answer: parsed.answer,
    },
  });

  return res.status(200).json(flashcard);
}

async function deleteFlashcard(req, res) {
  const deckId = parseCardIdParam(req.params.deckId);
  const flashcardId = parseCardIdParam(req.params.id);

  if (!deckId) {
    return res.status(400).json({ error: "deckId inválido" });
  }
  if (!flashcardId) {
    return res.status(400).json({ error: "id inválido" });
  }

  const existing = await findUserFlashcard(deckId, flashcardId, req.userId);
  if (!existing) {
    return res.status(404).json({ error: "Flashcard não encontrado" });
  }

  await prisma.flashcard.delete({ where: { id: flashcardId } });

  return res.status(204).send();
}

module.exports = {
  listFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
};
