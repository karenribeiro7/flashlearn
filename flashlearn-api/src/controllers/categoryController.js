const prisma = require("../database/prismaClient");

async function listCategories(req, res) {
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { userId: null },
        { userId: req.userId },
      ],
    },
    orderBy: { name: "asc" },
  });
  res.json(categories);
}

async function createCategory(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome e obrigatorio" });
  }

  const categoryAlreadyExists = await prisma.category.findFirst({
    where: {
      name,
      OR: [
        { userId: null },
        { userId: req.userId },
      ],
    },
  });

  if (categoryAlreadyExists) {
    return res.status(409).json({ error: "Categoria ja existe" });
  }

  const category = await prisma.category.create({
    data: {
      name,
      userId: req.userId,
    },
  });

  res.status(201).json(category);
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  const category = await prisma.category.findFirst({
    where: {
      id: Number(id),
      OR: [
        { userId: null },
        { userId: req.userId },
      ],
    },
  });

  if (!category) {
    return res.status(404).json({ error: "Categoria nao encontrada" });
  }

  if (category.userId === null && req.userRole !== "admin") {
    return res.status(403).json({ error: "Apenas administradores podem deletar categorias padrao" });
  }

  if (category.userId !== null && category.userId !== req.userId) {
    return res.status(403).json({ error: "Voce nao tem permissao para deletar esta categoria" });
  }

  const categoryHasDecks = await prisma.deck.findFirst({
    where: { categoryId: Number(id) },
  });

  if (categoryHasDecks) {
    return res.status(400).json({ error: "Categoria possui baralhos vinculados e nao pode ser deletada" });
  }

  await prisma.category.delete({
    where: { id: Number(id) },
  });

  res.status(204).send();
}

module.exports = { listCategories, createCategory, deleteCategory };