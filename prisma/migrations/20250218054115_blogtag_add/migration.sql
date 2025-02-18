/*
  Warnings:

  - You are about to drop the `_BlogToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlogToTag" DROP CONSTRAINT "_BlogToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogToTag" DROP CONSTRAINT "_BlogToTag_B_fkey";

-- DropTable
DROP TABLE "_BlogToTag";

-- CreateTable
CREATE TABLE "BlogTag" (
    "blogId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("blogId","tagId")
);

-- AddForeignKey
ALTER TABLE "BlogTag" ADD CONSTRAINT "BlogTag_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogTag" ADD CONSTRAINT "BlogTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
