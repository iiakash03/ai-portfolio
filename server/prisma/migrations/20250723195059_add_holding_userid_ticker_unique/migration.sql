/*
  Warnings:

  - A unique constraint covering the columns `[userId,ticker]` on the table `Holding` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Holding_userId_ticker_key" ON "Holding"("userId", "ticker");
