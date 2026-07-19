// ───────────────────────────────────────────────────────────────
// MODULE: Exhaustiveness Assertion Helper
// ───────────────────────────────────────────────────────────────

export function assertNever(unexpectedValue: never, context?: string): never {
  throw new Error(
    `Exhaustiveness violation: unexpected value ${JSON.stringify(unexpectedValue)}${context ? ` (${context})` : ''}`,
  );
}
