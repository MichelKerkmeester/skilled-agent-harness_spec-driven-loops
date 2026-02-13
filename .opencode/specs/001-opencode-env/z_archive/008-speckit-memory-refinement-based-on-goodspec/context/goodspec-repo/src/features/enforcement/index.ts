/**
 * Enforcement Module
 * Phase-aware workflow enforcement for GoopSpec
 * 
 * @module features/enforcement
 */

export {
  buildPhaseEnforcement,
  buildStateContext,
  buildEnforcementContext,
  getPhaseEnforcement,
  isOperationAllowed,
  type PhaseEnforcement,
} from "./phase-context.js";

export {
  scaffoldPhaseDocuments,
  checkPhaseDocuments,
  getPhaseDir,
  type ScaffoldResult,
  type DocumentType,
} from "./scaffolder.js";

export {
  validateWriteOperation,
  validatePhaseTransition,
  isImplementationFile,
  getValidationWarning,
  type ValidationResult,
  type TransitionValidation,
} from "./validators.js";
