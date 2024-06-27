-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "github_username" TEXT,
    "profile_picture" TEXT,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Mutant" (
    "mutant_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "tool" TEXT,
    "project" TEXT,
    "label_count" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "User_Mutant" (
    "user_id" INTEGER NOT NULL,
    "mutant_id" INTEGER NOT NULL,
    "time_taken" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "decision" TEXT,
    "explanation" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,

    PRIMARY KEY ("user_id", "mutant_id"),
    CONSTRAINT "User_Mutant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_Mutant_mutant_id_fkey" FOREIGN KEY ("mutant_id") REFERENCES "Mutant" ("mutant_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_github_username_key" ON "User"("github_username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mutant_name_key" ON "Mutant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Mutant_address_key" ON "Mutant"("address");

-- CreateIndex
CREATE INDEX "Mutant_name_idx" ON "Mutant"("name");

-- CreateIndex
CREATE INDEX "Mutant_label_count_idx" ON "Mutant"("label_count");

-- CreateIndex
CREATE INDEX "User_Mutant_status_idx" ON "User_Mutant"("status");

-- CreateIndex
CREATE INDEX "User_Mutant_created_at_idx" ON "User_Mutant"("created_at");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_createdAt_idx" ON "RefreshToken"("createdAt");
