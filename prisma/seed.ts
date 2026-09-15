import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
const prisma = new PrismaClient({ adapter });

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Senthil@123", salt);

  const user = await prisma.user.upsert({
    where: { email: "ssenthil8760650010@gmail.com" },
    update: {},
    create: {
      name: "Senthil",
      email: "ssenthil8760650010@gmail.com",
      password: hashedPassword,
    },
  });

  console.log("Seeded user:", { id: user.id, name: user.name, email: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
