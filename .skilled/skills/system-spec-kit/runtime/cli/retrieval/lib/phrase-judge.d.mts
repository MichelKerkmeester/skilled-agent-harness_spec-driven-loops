// ───────────────────────────────────────────────────────────────────
// MODULE: Trigger Phrase Judge (type surface)
// ───────────────────────────────────────────────────────────────────
// Declarations for the build-free ESM judge so TypeScript consumers can share
// the one phrase-admissibility rule instead of carrying a private copy.

export function judgeTriggerPhrase(
  phrase: string,
  context?: { folderTokens?: ReadonlyArray<string> },
): { negativeClass: string; reason: string } | null;
