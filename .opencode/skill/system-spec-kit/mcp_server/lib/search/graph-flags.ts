// ---------------------------------------------------------------
// MODULE: Graph Search Compatibility Flag
// Legacy compatibility shim retained for test/runtime imports.
// ---------------------------------------------------------------

/**
 * Legacy graph channel is permanently disabled.
 * Keep this function as a stable no-op compatibility surface.
 */
export function isGraphUnifiedEnabled(): boolean {
  return false;
}
