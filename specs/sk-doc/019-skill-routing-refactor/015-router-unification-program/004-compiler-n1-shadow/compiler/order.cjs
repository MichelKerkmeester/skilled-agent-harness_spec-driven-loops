// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: DETERMINISTIC UTF-16 ORDERING                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. COMPARATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compare strings by UTF-16 code units so ordering never depends on host locale.
 *
 * @param {*} left - Left value coerced to a string.
 * @param {*} right - Right value coerced to a string.
 * @returns {number} Negative, zero, or positive ordering result.
 */
function compareUtf16(left, right) {
  const leftString = String(left);
  const rightString = String(right);
  if (leftString < rightString) return -1;
  if (leftString > rightString) return 1;
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  compareUtf16,
};
