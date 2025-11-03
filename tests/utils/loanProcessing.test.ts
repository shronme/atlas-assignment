import { test, expect, vi } from "vitest";
import { loanProcessing } from "../../src/utils/loanProcessing";
import { prisma } from "../../src/lib/prisma";
import { Decimal } from "decimal.js";

vi.mock("../../src/lib/prisma", () => {
  return {
    prisma: {
      loan: {
        create: vi.fn(),
      },
    },
  };
});

test("loanProcessing eligable loan", async () => {
  const payload = {
    applicantName: "John Doe",
    propertyAddress: "123 Main St 90210",
    creditScore: 720,
    monthlyIncome: 6000,
    requestedAmount: 20000,
    loanTermMonths: 24,
  };
  const monthlyIncomeDecimal = new Decimal(payload.monthlyIncome);
  const requestedAmountDecimal = new Decimal(payload.requestedAmount);
  (prisma.loan.create as Mock).mockResolvedValue({
    id: 1,
    uuid: "some-uuid",
    applicantName: "John Doe",
    propertyAddress: "123 Main St 90210",
    creditScore: 720,
    monthlyIncome: monthlyIncomeDecimal,
    requestedAmount: requestedAmountDecimal,
    loanTermMonths: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
    isEligable: null,
    crimeGrade: null,
  }) as any;

  const result = await loanProcessing(payload);

  expect(result).toHaveProperty("isEligable", true);
});

test("loanProcessing credit score too low", async () => {
  const payload = {
    applicantName: "John Doe",
    propertyAddress: "123 Main St 90210",
    creditScore: 500,
    monthlyIncome: 6000,
    requestedAmount: 20000,
    loanTermMonths: 24,
  };
  const monthlyIncomeDecimal = new Decimal(payload.monthlyIncome);
  const requestedAmountDecimal = new Decimal(payload.requestedAmount);
  (prisma.loan.create as Mock).mockResolvedValue({
    id: 1,
    uuid: "some-uuid",
    applicantName: "John Doe",
    propertyAddress: "123 Main St 90210",
    creditScore: 720,
    monthlyIncome: monthlyIncomeDecimal,
    requestedAmount: requestedAmountDecimal,
    loanTermMonths: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
    isEligable: null,
    crimeGrade: null,
  }) as any;
  const result = await loanProcessing(payload);

  expect(result).toHaveProperty("isEligable", false);
});

test("loanProcessing credit LTV too low", async () => {
  const payload = {
    applicantName: "John Doe",
    propertyAddress: "123 Main St 90210",
    creditScore: 720,
    monthlyIncome: 6500,
    requestedAmount: 150000,
    loanTermMonths: 24,
  };
  const monthlyIncomeDecimal = new Decimal(payload.monthlyIncome);
  const requestedAmountDecimal = new Decimal(payload.requestedAmount);
  (prisma.loan.create as Mock).mockResolvedValue({
    id: 1,
    uuid: "some-uuid",
    applicantName: "John Doe",
    propertyAddress: "123 Main St 90210",
    creditScore: 720,
    monthlyIncome: monthlyIncomeDecimal,
    requestedAmount: requestedAmountDecimal,
    loanTermMonths: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
    isEligable: null,
    crimeGrade: null,
  }) as any;
  const result = await loanProcessing(payload);

  expect(result).toHaveProperty("isEligable", false);
});
