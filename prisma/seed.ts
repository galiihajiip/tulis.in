import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@tulis.in" },
    update: {},
    create: {
      email: "demo@tulis.in",
      name: "Demo User",
    },
  });

  console.log("Created demo user:", user);

  // Create demo workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: "demo-workspace" },
    update: {},
    create: {
      id: "demo-workspace",
      name: "My Workspace",
      userId: user.id,
    },
  });

  console.log("Created demo workspace:", workspace);

  // Create demo document
  const document = await prisma.document.upsert({
    where: { id: "demo" },
    update: {},
    create: {
      id: "demo",
      title: "Demo Document",
      contentOriginal: "Ini adalah contoh dokumen untuk mencoba fitur Tulis.in.",
      userId: user.id,
      workspaceId: workspace.id,
    },
  });

  console.log("Created demo document:", document);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
