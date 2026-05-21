const prisma = require("../database/prismaClient");

async function listCategories(req, res) {
  const categories = await prisma.category.findMany();
  res.json(categories);
}

async function createCategory(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nome e obrigatorio" });
  }

  const categoryAlreadyExists = await prisma.category.findUnique({
    where: { name },
  });

  if (categoryAlreadyExists) {
    return res.status(409).json({ error: "Categoria ja cadastrada" });
  }

  const category = await prisma.category.create({
    data: { name },
  });

  res.status(201).json(category);
}

async function deleteCategory(req, res) {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
  });

  if (!category) {
    return res.status(404).json({ error: "Categoria nao encontrada" });
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