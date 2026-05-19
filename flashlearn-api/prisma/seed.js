const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const defaultCategories = [
  "Idiomas",
  "Ciências",
  "História",
  "Matemática",
  "Geral",
];

async function main() {
  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
