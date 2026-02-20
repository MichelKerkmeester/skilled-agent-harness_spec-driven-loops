// ---------------------------------------------------------------
// MODULE: SGQS Error Classes
// Error taxonomy matching the grammar specification (Section 9)
// ---------------------------------------------------------------

import { SGQSErrorInfo } from './types';

// ---------------------------------------------------------------
// 1. BASE ERROR
// ---------------------------------------------------------------

/**
 * Base error class for all SGQS errors.
 * Carries structured error info (code, position, line, column).
 */
export class SGQSError extends Error {
  public readonly code: string;
  public readonly position: number;
  public readonly line: number;
  public readonly column: number;

  constructor(code: string, message: string, position: number = 0, line: number = 1, column: number = 1) {
    super(`[${code}] ${message} (line ${line}, column ${column})`);
    this.name = 'SGQSError';
    this.code = code;
    this.position = position;
    this.line = line;
    this.column = column;
  }

  /** Convert to the structured error info format */
  toErrorInfo(): SGQSErrorInfo {
    return {
      code: this.code,
      message: this.message,
      position: this.position,
      line: this.line,
      column: this.column,
    };
  }
}

// ---------------------------------------------------------------
// 2. PARSE ERRORS (E001-E006)
// ---------------------------------------------------------------

/**
 * E001: Malformed token or unexpected token in grammar position.
 */
export class SyntaxError extends SGQSError {
  constructor(message: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E001', message, position, line, column);
    this.name = 'SyntaxError';
  }
}

/**
 * E002: Token found where a different token was expected.
 */
export class UnexpectedTokenError extends SGQSError {
  constructor(expected: string, found: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E002', `Expected ${expected}, found ${found}`, position, line, column);
    this.name = 'UnexpectedTokenError';
  }
}

/**
 * E003: String literal opened but never closed.
 */
export class UnterminatedStringError extends SGQSError {
  constructor(position: number = 0, line: number = 1, column: number = 1) {
    super('E003', 'Unterminated string literal', position, line, column);
    this.name = 'UnterminatedStringError';
  }
}

/**
 * E004: Range expression has min > max or non-integer bounds.
 */
export class InvalidRangeError extends SGQSError {
  constructor(message: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E004', message, position, line, column);
    this.name = 'InvalidRangeError';
  }
}

/**
 * E005: Required clause (MATCH or RETURN) is absent.
 */
export class MissingClauseError extends SGQSError {
  constructor(clause: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E005', `Missing required clause: ${clause}`, position, line, column);
    this.name = 'MissingClauseError';
  }
}

/**
 * E006: Value in property map is not a valid literal.
 */
export class InvalidPropertyValueError extends SGQSError {
  constructor(message: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E006', message, position, line, column);
    this.name = 'InvalidPropertyValueError';
  }
}

// ---------------------------------------------------------------
// 3. SEMANTIC ERRORS (E010-E014)
// ---------------------------------------------------------------

/**
 * E010: Variable used in WHERE or RETURN but not declared in MATCH.
 */
export class UnboundVariableError extends SGQSError {
  constructor(variable: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E010', `Unbound variable: "${variable}" is not declared in MATCH`, position, line, column);
    this.name = 'UnboundVariableError';
  }
}

/**
 * E011: Label in node pattern does not match any registered label.
 */
export class UnknownLabelError extends SGQSError {
  constructor(label: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E011', `Unknown label: "${label}"`, position, line, column);
    this.name = 'UnknownLabelError';
  }
}

/**
 * E012: Relationship type does not match any registered type.
 */
export class UnknownRelTypeError extends SGQSError {
  constructor(relType: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E012', `Unknown relationship type: "${relType}"`, position, line, column);
    this.name = 'UnknownRelTypeError';
  }
}

/**
 * E013: Pattern cannot be resolved to a deterministic traversal plan.
 */
export class AmbiguousPatternError extends SGQSError {
  constructor(message: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E013', message, position, line, column);
    this.name = 'AmbiguousPatternError';
  }
}

/**
 * E014: Same variable name bound to different pattern elements.
 */
export class DuplicateBindingError extends SGQSError {
  constructor(variable: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E014', `Duplicate binding: "${variable}" is already bound`, position, line, column);
    this.name = 'DuplicateBindingError';
  }
}

// ---------------------------------------------------------------
// 4. RUNTIME ERRORS (E020-E022)
// ---------------------------------------------------------------

/**
 * E020: Unbounded * path exceeds engine max depth.
 */
export class TraversalDepthExceededError extends SGQSError {
  constructor(depth: number, position: number = 0, line: number = 1, column: number = 1) {
    super('E020', `Traversal depth exceeded: reached ${depth} hops`, position, line, column);
    this.name = 'TraversalDepthExceededError';
  }
}

/**
 * E021: Attempt to access a property on a NULL or non-existent node.
 */
export class PropertyAccessError extends SGQSError {
  constructor(message: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E021', message, position, line, column);
    this.name = 'PropertyAccessError';
  }
}

/**
 * E022: Comparison operator applied to incompatible types.
 */
export class TypeMismatchError extends SGQSError {
  constructor(message: string, position: number = 0, line: number = 1, column: number = 1) {
    super('E022', message, position, line, column);
    this.name = 'TypeMismatchError';
  }
}
