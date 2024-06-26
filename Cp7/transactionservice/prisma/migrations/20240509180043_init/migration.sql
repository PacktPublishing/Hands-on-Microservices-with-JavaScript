-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'SETTLED', 'FAILED');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "status" "Status" NOT NULL,
    "accountId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
