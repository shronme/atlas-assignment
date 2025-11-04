import { prisma } from "../lib/prisma.js";

export type LoanInput = {
  applicantName: string;
  propertyAddress: string;
  creditScore: number;
  monthlyIncome: number | string;
  requestedAmount: number | string;
  loanTermMonths: number;
};

const isCreditScoreAcceptable = (creditScore: number) => {
  return creditScore >= 700;
};

const isDebtToIncomeAcceptable = (
  monthlyIncome: number,
  requestedAmount: number,
  loanTermMonths: number
) => {
  return monthlyIncome >= (requestedAmount / loanTermMonths) * 1.5;
};

const isCrimeGradeAcceptable = (crimeGradeData: any) => {
  const uneligableGrades = ["F"];
  if (crimeGradeData.crimeGrade === "Unknown") {
    return { eligable: false, crimeGrade: "Unknown" };
  }
  return {
    eligable: !uneligableGrades.includes(crimeGradeData.crimeGrade),
    crimeGrade: crimeGradeData.crimeGrade,
  };
};

// Process a loan request: persist to the database and return the created record.
export const loanProcessing = async (
  payload: LoanInput,
  crimeGradeData: any
) => {
  const {
    applicantName,
    propertyAddress,
    creditScore,
    monthlyIncome,
    requestedAmount,
    loanTermMonths,
  } = payload;

  const crimeGrade = isCrimeGradeAcceptable(crimeGradeData);

  let decisionReasons = "";

  const creditCheck = isCreditScoreAcceptable(creditScore);
  const debtToIncomeCheck = isDebtToIncomeAcceptable(
    monthlyIncome as number,
    requestedAmount as number,
    loanTermMonths
  );
  const crimeGradeCheck = crimeGrade.eligable;

  const isEligable = creditCheck && debtToIncomeCheck && crimeGradeCheck;

  if (isEligable) {
    decisionReasons = "All checks passed";
  } else {
    if (!creditCheck) {
      decisionReasons += "credit score too low; ";
    }
    if (!debtToIncomeCheck) {
      decisionReasons += "Debt-to-income ratio too high; ";
    }
    if (!crimeGradeCheck) {
      decisionReasons += "Area crime grade too high; ";
    }
  }

  const loanData = {
    applicantName,
    propertyAddress,
    creditScore,
    monthlyIncome:
      typeof monthlyIncome === "string" ? monthlyIncome : String(monthlyIncome),
    requestedAmount:
      typeof requestedAmount === "string"
        ? requestedAmount
        : String(requestedAmount),
    loanTermMonths,
    crimeGrade: crimeGrade.crimeGrade,
    isEligable: isEligable,
    decisionReason: decisionReasons.trim(),
  };
  const createdLoan = await prisma.loan.create({
    data: loanData,
  });

  const returnedLoanData = { ...loanData, uuid: createdLoan.uuid };

  return returnedLoanData;
};
