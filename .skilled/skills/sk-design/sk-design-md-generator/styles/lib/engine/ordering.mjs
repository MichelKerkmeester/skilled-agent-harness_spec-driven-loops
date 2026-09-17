// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Locale-Independent Ordering                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

/**
 * Compare raw strings without consulting process locale settings.
 *
 * @param {unknown} left - Left comparison value.
 * @param {unknown} right - Right comparison value.
 * @returns {number} Negative, zero, or positive ordering result.
 */
export function compareRawStrings(left, right) {
  const leftValue = String(left);
  const rightValue = String(right);
  if (leftValue < rightValue) return -1;
  if (leftValue > rightValue) return 1;
  return 0;
}
