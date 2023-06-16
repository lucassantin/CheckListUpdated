import { PrismaClient } from "@prisma/client"
//criando uma instancia do prisma (conectando com o banco de dados)
export const prisma = new PrismaClient({ 
  log: ["query"]
})