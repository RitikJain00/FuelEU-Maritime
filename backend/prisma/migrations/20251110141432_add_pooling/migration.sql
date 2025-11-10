/*
  Warnings:

  - You are about to drop the column `created_at` on the `Pool` table. All the data in the column will be lost.
  - Added the required column `total_cb_gco2eq` to the `Pool` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pool" DROP COLUMN "created_at",
ADD COLUMN     "total_cb_gco2eq" DOUBLE PRECISION NOT NULL;
