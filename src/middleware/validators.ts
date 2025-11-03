import { body, validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

// Validation middleware for loan request
export const validateLoanRequest = [
  body("applicantName")
    .notEmpty()
    .withMessage("applicantName is required")
    .isString()
    .withMessage("applicantName must be a string"),
  body("propertyAddress")
    .notEmpty()
    .withMessage("propertyAddress is required")
    .isString()
    .withMessage("propertyAddress must be a string"),
  body("creditScore")
    .notEmpty()
    .withMessage("creditScore is required")
    .isInt({ min: 0 })
    .withMessage("creditScore must be an integer"),
  body("monthlyIncome")
    .notEmpty()
    .withMessage("monthlyIncome is required")
    .isFloat({ min: 0 })
    .withMessage("monthlyIncome must be a positive number"),
  body("requestedAmount")
    .notEmpty()
    .withMessage("requestedAmount is required")
    .isFloat({ min: 0 })
    .withMessage("requestedAmount must be a positive number"),
  body("loanTermMonths")
    .notEmpty()
    .withMessage("loanTermMonths is required")
    .isInt({ min: 1 })
    .withMessage("loanTermMonths must be a positive integer"),
];

// Middleware to check the result of the validation chains and return a 400
// with details if any validation errors occurred.
export const handleValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
