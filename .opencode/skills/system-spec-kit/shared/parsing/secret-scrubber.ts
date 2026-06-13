// ───────────────────────────────────────────────────────────────
// MODULE: Secret Scrubber
// ───────────────────────────────────────────────────────────────
// Pre-index secret redaction for the memory write path. Runs at the
// head of memory content parsing, BEFORE content-hash, embedding,
// FTS, and any persisted field derivation, so credentials never
// reach durable storage. Once a secret is hashed, embedded, or
// indexed the leak is permanent — scrubbing must happen first.
//
// Contract:
// - Ordered regex patterns; the most specific kinds run first.
// - Matches are replaced with typed markers `[REDACTED:<kind>]` so
//   operators can diagnose what was removed without seeing values.
// - Fail-closed: an internal scrubber error throws SecretScrubberError
//   and the caller must refuse THAT write instead of persisting raw
//   text. Clean input never errors — it passes through unchanged.

/** Raised when the scrubber itself fails; callers must refuse the write. */
export class SecretScrubberError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'SecretScrubberError';
    // Restore the prototype chain so `instanceof SecretScrubberError` holds
    // even when the class is transpiled to a target that breaks Error
    // subclassing — a failed instanceof would let the fail-closed write be
    // caught as a generic Error and the raw text persisted.
    Object.setPrototypeOf(this, SecretScrubberError.prototype);
  }
}

export interface SecretPattern {
  /** Marker kind used in the `[REDACTED:<kind>]` replacement. */
  kind: string;
  /** Global regex matching the secret. */
  regex: RegExp;
  /**
   * Replacement template. Defaults to the bare marker; patterns that match
   * surrounding context (e.g. `key=value` assignments) keep the context via
   * capture groups so only the secret value is removed.
   */
  replacement?: string;
}

/**
 * Ordered scrub patterns — most specific first so narrower kinds win
 * (e.g. Anthropic keys before the generic OpenAI `sk-` family, JWTs
 * before generic bearer values). Patterns are deliberately conservative:
 * each requires a vendor prefix, fixed shape, or assignment context plus
 * digit content so prose and identifiers (skill names, slugs) never match.
 */
const SECRET_PATTERNS: SecretPattern[] = [
  {
    kind: 'private-key',
    regex: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY( BLOCK)?-----[\s\S]*?-----END [A-Z0-9 ]*PRIVATE KEY( BLOCK)?-----/g,
  },
  {
    kind: 'private-key',
    regex: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY( BLOCK)?-----/g,
  },
  {
    kind: 'aws-secret-access-key',
    // The fixed-length value ends in the base64 alphabet (/, +, =), which is
    // non-word — a trailing \b cannot fire when the key's last char is one of
    // those and the terminator (JSON quote, newline, space) is also non-word,
    // and the fixed {40} leaves no room to backtrack onto a word char. Assert
    // "no value-class continuation" instead so a 40-char key ending in any
    // char is still bounded and redacted.
    regex: /\b(aws[_-]?secret[_-]?(?:access[_-]?)?key)((?:["']?\s*[:=]\s*|\s+)["']?)([A-Za-z0-9/+=]{40})(?![A-Za-z0-9/+=])/gi,
    replacement: '$1$2[REDACTED:aws-secret-access-key]',
  },
  {
    kind: 'aws-access-key-id',
    regex: /\b(?:AKIA|ASIA|ABIA|ACCA|AGPA|AIDA|AIPA|ANPA|ANVA|AROA)[A-Z0-9]{16}\b/g,
  },
  {
    kind: 'github-token',
    regex: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,255}\b/g,
  },
  {
    kind: 'github-token',
    regex: /\bgithub_pat_[A-Za-z0-9_]{22,255}\b/g,
  },
  {
    // The value class includes '-' (non-word). A trailing \b cannot fire when
    // the key ends in '-' before a non-word terminator; at the {24} minimum
    // there is no backtrack room so the whole key leaks, and beyond it the
    // backtrack leaves a trailing '-'. Assert no value-class continuation.
    kind: 'anthropic-api-key',
    regex: /\bsk-ant-[A-Za-z0-9_-]{24,}(?![A-Za-z0-9_-])/g,
  },
  {
    // Requires the unbroken base62 tail plus at least one digit so
    // hyphenated identifiers (skill slugs, package names) never match.
    kind: 'openai-api-key',
    regex: /\bsk-(?:proj-|svcacct-|admin-)?(?=[A-Za-z0-9]*\d)[A-Za-z0-9]{32,}\b/g,
  },
  {
    // Fixed-length value can end in '-' (non-word); a trailing \b cannot fire
    // before a non-word terminator and {35} can't backtrack — assert no
    // value-class continuation instead so a key ending in '-' still redacts.
    kind: 'google-api-key',
    regex: /\bAIza[0-9A-Za-z_-]{35}(?![0-9A-Za-z_-])/g,
  },
  {
    // Value class includes '-'; same trailing-\b leak as the anthropic key.
    kind: 'slack-token',
    regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}(?![A-Za-z0-9-])/g,
  },
  {
    kind: 'jwt',
    // Both header and payload segments must decode-start as '{"' (eyJ...)
    // for high confidence; bare base64 triplets are left alone.
    // The signature segment's value class includes '-'; the final trailing \b
    // leaks a signature ending in '-' (fully at the {8} minimum). The two
    // earlier segments end in a literal '.', so only the final \b needs the
    // no-value-class-continuation guard.
    regex: /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}(?![A-Za-z0-9_-])/g,
  },
  {
    kind: 'bearer-token',
    regex: /\b([Bb]earer\s+)(?=[A-Za-z0-9_\-.=+/]*\d)[A-Za-z0-9_\-.=+/]{20,}/g,
    replacement: '$1[REDACTED:bearer-token]',
  },
  {
    // Assignment context + length floor + required digit AND letter content
    // keeps placeholders ('your-api-key-here', 'xxxx...') untouched.
    kind: 'credential-assignment',
    regex: /\b((?:api|access|auth|client|secret)[_-]?(?:key|token|secret)|password|passwd|credentials?)(["']?\s*[:=]\s*["']?)(?=[A-Za-z0-9_\-+/=]*\d)(?=[A-Za-z0-9_\-+/=]*[A-Za-z])([A-Za-z0-9_\-+/=]{20,})/gi,
    replacement: '$1$2[REDACTED:credential-assignment]',
  },
];

export interface ScrubResult {
  /** The scrubbed text with secrets replaced by typed markers. */
  text: string;
  /** Total number of replacements applied. */
  redactions: number;
  /** Kinds that produced at least one replacement, in pattern order. */
  kinds: string[];
}

export interface RedactionStats {
  totalRedactions: number;
  byKind: Record<string, number>;
  lastRedactionAt: string | null;
}

/* ───────────────────────────────────────────────────────────────
   MODULE STATE — process-lifetime redaction telemetry
----------------------------------------------------------------*/

let totalRedactions = 0;
let byKind: Record<string, number> = {};
let lastRedactionAt: string | null = null;

/** In-process redaction counters surfaced through memory_health. */
export function getRedactionStats(): RedactionStats {
  return {
    totalRedactions,
    byKind: { ...byKind },
    lastRedactionAt,
  };
}

/** Reset counters (test isolation only). */
export function resetRedactionStats(): void {
  totalRedactions = 0;
  byKind = {};
  lastRedactionAt = null;
}

/* ───────────────────────────────────────────────────────────────
   SCRUBBING
----------------------------------------------------------------*/

let activePatterns: SecretPattern[] = SECRET_PATTERNS;

/**
 * Scrub secrets from a text field and report what was redacted.
 *
 * @throws {SecretScrubberError} when the scrubber itself fails — the caller
 * must refuse the write rather than persist unscrubbed text (fail-closed).
 */
export function scrubSecretsDetailed(text: string): ScrubResult {
  if (typeof text !== 'string' || text.length === 0) {
    return { text: typeof text === 'string' ? text : '', redactions: 0, kinds: [] };
  }

  try {
    let scrubbed = text;
    let redactions = 0;
    const kinds: string[] = [];

    for (const pattern of activePatterns) {
      pattern.regex.lastIndex = 0;
      let patternHits = 0;
      scrubbed = scrubbed.replace(pattern.regex, (...args: unknown[]) => {
        patternHits += 1;
        if (pattern.replacement) {
          return applyReplacementTemplate(pattern, String(args[0]));
        }
        return `[REDACTED:${pattern.kind}]`;
      });

      if (patternHits > 0) {
        redactions += patternHits;
        if (!kinds.includes(pattern.kind)) {
          kinds.push(pattern.kind);
        }
        byKind[pattern.kind] = (byKind[pattern.kind] ?? 0) + patternHits;
      }
    }

    if (redactions > 0) {
      totalRedactions += redactions;
      lastRedactionAt = new Date().toISOString();
    }

    return { text: scrubbed, redactions, kinds };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new SecretScrubberError(
      `Secret scrubbing failed (${message}); refusing to persist unscrubbed content`,
      { cause: error },
    );
  }
}

/** Convenience wrapper returning only the scrubbed text. */
export function scrubSecrets(text: string): string {
  return scrubSecretsDetailed(text).text;
}

function applyReplacementTemplate(pattern: SecretPattern, match: string): string {
  // Re-run the pattern against the isolated match so the capture-group
  // template ($1, $2, ...) resolves with replace() semantics.
  const single = new RegExp(pattern.regex.source, pattern.regex.flags.replace('g', ''));
  return match.replace(single, pattern.replacement ?? `[REDACTED:${pattern.kind}]`);
}

/* ───────────────────────────────────────────────────────────────
   TEST SURFACE
----------------------------------------------------------------*/

/** Test-only hooks for fail-closed verification and pattern inspection. */
export const __secretScrubberTestables = {
  defaultPatterns: SECRET_PATTERNS,
  setPatternsForTest(patterns: SecretPattern[] | null): void {
    activePatterns = patterns ?? SECRET_PATTERNS;
  },
};
