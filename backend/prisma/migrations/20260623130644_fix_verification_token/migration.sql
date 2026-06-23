/*
  Warnings:

  - You are about to drop the column `verrificationToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "verrificationToken",
ADD COLUMN     "verificationToken" TEXT;
