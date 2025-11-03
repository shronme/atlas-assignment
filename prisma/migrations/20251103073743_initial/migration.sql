-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Loan_uuid_key" ON "Loan"("uuid");
