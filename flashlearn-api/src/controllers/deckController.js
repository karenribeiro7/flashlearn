const prisma = require("../database/prismaClient");

function parseDeckIdParam(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

async function listDecks(req, res) {
  const decks = await prisma.deck.findMany({
    where: { userId: req.userId },
    orderBy: { id: "desc" },
    include: {
      category: { select: { id: true, name: true } },
      _count: { select: { flashcards: true } },
    },
  });
  return res.status(200).json(decks);
}

async function listCategories(_req, res) {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return res.status(200).json(categories);
}

async function createDeck(req, res) {
  const { title, description, categoryId } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title é obrigatório" });
  }

  if (categoryId === undefined || categoryId === null || categoryId === "") {
    return res.status(400).json({ error: "categoryId é obrigatório" });
  }

  const parsedCategoryId = Number(categoryId);
  if (!Number.isInteger(parsedCategoryId) || parsedCategoryId < 1) {
    return res.status(400).json({ error: "categoryId inválido" });
  }

  const category = await prisma.category.findUnique({
    where: { id: parsedCategoryId },
  });

  if (!category) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  const deck = await prisma.deck.create({
    data: {
      title: title.trim(),
      description: description?.trim() ? description.trim() : null,
      userId: req.userId,
      categoryId: parsedCategoryId,
    },
    include: {
      category: { select: { id: true, name: true } },
    },
  });

  return res.status(201).json(deck);
}

async function updateDeck(req, res) {
  const deckId = parseDeckIdParam(req.params.id);
  if (!deckId) {
    return res.status(400).json({ error: "id inválido" });
  }

  const existing = await prisma.deck.findFirst({
    where: { id: deckId, userId: req.userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Deck não encontrado" });
  }

  const { title, description, categoryId } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title é obrigatório" });
  }

  if (categoryId === undefined || categoryId === null || categoryId === "") {
    return res.status(400).json({ error: "categoryId é obrigatório" });
  }

  const parsedCategoryId = Number(categoryId);
  if (!Number.isInteger(parsedCategoryId) || parsedCategoryId < 1) {
    return res.status(400).json({ error: "categoryId inválido" });
  }

  const category = await prisma.category.findUnique({
    where: { id: parsedCategoryId },
  });

  if (!category) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  const deck = await prisma.deck.update({
    where: { id: deckId },
    data: {
      title: title.trim(),
      description: description?.trim() ? description.trim() : null,
      categoryId: parsedCategoryId,
    },
    include: {
      category: { select: { id: true, name: true } },
      _count: { select: { flashcards: true } },
    },
  });

  return res.status(200).json(deck);
}

async function deleteDeck(req, res) {
  const deckId = parseDeckIdParam(req.params.id);
  if (!deckId) {
    return res.status(400).json({ error: "id inválido" });
  }

  const existing = await prisma.deck.findFirst({
    where: { id: deckId, userId: req.userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Deck não encontrado" });
  }

  await prisma.$transaction([
    prisma.flashcard.deleteMany({ where: { deckId } }),
    prisma.studySession.deleteMany({ where: { deckId } }),
    prisma.deck.delete({ where: { id: deckId } }),
  ]);

  return res.status(204).send();
}

module.exports = {
  listCategories,
  listDecks,
  createDeck,
  updateDeck,
  deleteDeck,
};
