-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "provider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommend" (
    "id" TEXT NOT NULL,
    "qiitaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Recommend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Recommend_userId_qiitaId_key" ON "Recommend"("userId", "qiitaId");

-- AddForeignKey
ALTER TABLE "Recommend" ADD CONSTRAINT "Recommend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
