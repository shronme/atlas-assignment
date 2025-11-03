/*
  Warnings:

  - Added the required column `applicant_name` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credit_score` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loan_term_months` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthly_income` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `property_address` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requested_amount` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "applicant_name" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "credit_score" INTEGER NOT NULL,
ADD COLUMN     "crime_grade" TEXT,
ADD COLUMN     "is_eligable" BOOLEAN,
ADD COLUMN     "loan_term_months" INTEGER NOT NULL,
ADD COLUMN     "monthly_income" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "property_address" TEXT NOT NULL,
ADD COLUMN     "requested_amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
