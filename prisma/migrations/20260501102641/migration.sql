/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `RSVP` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RSVP_eventId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "RSVP_userId_eventId_key" ON "RSVP"("userId", "eventId");
