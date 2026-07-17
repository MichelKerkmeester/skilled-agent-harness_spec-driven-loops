// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Fallback Telemetry
// ───────────────────────────────────────────────────────────────────

let legacyFallbackHits = 0;
let legacyWriteAttempts = 0;
const contexts: string[] = [];

// ───────────────────────────────────────────────────────────────────
// 1. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Record a resolver selecting the legacy root as a read fallback. */
export function recordLegacyFallbackHit(context: string): void {
  legacyFallbackHits += 1;
  contexts.push(context);
}

/** Record an attempted write targeting the legacy root. */
export function recordLegacyWriteAttempt(context: string): void {
  legacyWriteAttempts += 1;
  contexts.push(context);
}

/** Return a snapshot of the in-process compatibility telemetry. */
export function getFallbackTelemetry(): {
  legacyFallbackHits: number;
  legacyWriteAttempts: number;
  contexts: string[];
} {
  return {
    legacyFallbackHits,
    legacyWriteAttempts,
    contexts: [...contexts],
  };
}

/** Report whether the current compatibility window has recorded no legacy activity. */
export function isCompatibilityWindowClean(): boolean {
  return legacyFallbackHits === 0 && legacyWriteAttempts === 0;
}

/** Clear all in-process compatibility telemetry. */
export function resetFallbackTelemetry(): void {
  legacyFallbackHits = 0;
  legacyWriteAttempts = 0;
  contexts.length = 0;
}
