const prisma = require("../database/prismaClient");

function parseCardIdParam(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

function parseQuestionAnswer(body) {
  if (!body) {
    return { error: "Corpo da requisicao invalido" };
  }

  const { question, answer } = body;

  if (!question || typeof question !== "string" || !question.trim()) {
    return { error: "Informe uma questao" };
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
    return res.status(400).json({ error: "deckId invalido" });
  }

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId: req.userId },
  });

  if (!deck) {
    return res.status(404).json({ error: "Deck nao encontrado" });
  }

  const flashcards = await prisma.flashcard.findMany({
    where: { deckId },
    orderBy: { id: "asc" },
    select: {
      id: true,
      question: true,
      answer: true,
      imageUrl: true,
      deckId: true,
    },
  });

  return res.status(200).json(flashcards);
}

async function createFlashcard(req, res) {
  console.log("body", req.body);
  console.log("file", req.file);
  console.log("header", req.headers);

  const deckId = parseCardIdParam(req.params.deckId);
  if (!deckId) {
    return res.status(400).json({ error: "deckId invalido" });
  }

  const deck = await prisma.deck.findFirst({
    where: { id: deckId, userId: req.userId },
  });

  if (!deck) {
    return res.status(404).json({ error: "Deck nao encontrado" });
  }

  const parsed = parseQuestionAnswer(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const flashcard = await prisma.flashcard.create({
    data: {
      question: parsed.question,
      answer: parsed.answer,
      imageUrl,
      deckId,
    },
  });

  return res.status(201).json(flashcard);
}

async function updateFlashcard(req, res) {
  const deckId = parseCardIdParam(req.params.deckId);
  const flashcardId = parseCardIdParam(req.params.id);

  if (!deckId) {
    return res.status(400).json({ error: "deckId invalido" });
  }
  if (!flashcardId) {
    return res.status(400).json({ error: "id invalido" });
  }

  const existing = await findUserFlashcard(deckId, flashcardId, req.userId);
  if (!existing) {
    return res.status(404).json({ error: "Flashcard nao encontrado" });
  }

  const parsed = parseQuestionAnswer(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
    : existing.imageUrl;

  const flashcard = await prisma.flashcard.update({
    where: { id: flashcardId },
    data: {
      question: parsed.question,
      answer: parsed.answer,
      imageUrl,
    },
  });

  return res.status(200).json(flashcard);
}

async function deleteFlashcard(req, res) {
  const deckId = parseCardIdParam(req.params.deckId);
  const flashcardId = parseCardIdParam(req.params.id);

  if (!deckId) {
    return res.status(400).json({ error: "deckId invalido" });
  }
  if (!flashcardId) {
    return res.status(400).json({ error: "id invalido" });
  }

  const existing = await findUserFlashcard(deckId, flashcardId, req.userId);
  if (!existing) {
    return res.status(404).json({ error: "Flashcard nao encontrado" });
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