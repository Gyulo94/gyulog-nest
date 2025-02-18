/*
  Warnings:

  - You are about to drop the `BlogTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlogTag" DROP CONSTRAINT "BlogTag_blogId_fkey";

-- DropForeignKey
ALTER TABLE "BlogTag" DROP CONSTRAINT "BlogTag_tagId_fkey";

-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "isPublished" SET DEFAULT true;

-- DropTable
DROP TABLE "BlogTag";

-- CreateTable
CREATE TABLE "_BlogToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BlogToTag_B_index" ON "_BlogToTag"("B");

-- AddForeignKey
ALTER TABLE "_BlogToTag" ADD CONSTRAINT "_BlogToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToTag" ADD CONSTRAINT "_BlogToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
