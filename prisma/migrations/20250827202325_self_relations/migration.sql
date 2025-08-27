/*
  Warnings:

  - You are about to drop the column `parentFolder` on the `Folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Folder" DROP COLUMN "parentFolder",
ADD COLUMN     "parentId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
