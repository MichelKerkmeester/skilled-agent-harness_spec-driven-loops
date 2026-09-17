// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: ROUTER COMPILE ERRORS                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. ERROR TYPE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represent a fail-closed authored-policy compilation failure.
 */
class CompileError extends Error {
  /**
   * Create a typed compile error with a stable offending-element reference.
   *
   * @param {string} code - Stable machine-readable failure class.
   * @param {string} element - Authored element that caused the failure.
   * @param {string} message - Human-readable failure detail.
   * @param {Error} [cause] - Lower-level failure retained for diagnostics.
   */
  constructor(code, element, message, cause) {
    super(message, cause ? { cause } : undefined);
    this.name = 'CompileError';
    this.code = code;
    this.element = element;
    Object.setPrototypeOf(this, CompileError.prototype);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  CompileError,
};
