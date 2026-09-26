// Pure helpers with no I/O. Question design follows the TypeSafe cookbooks
// (citation_check, llm_guardrails, semantic_find).

/** Max candidates in one `find` call. TypeSafe Choice supports up to 255 options. */
export const MAX_CANDIDATES = 250;

/** Per-candidate text cap (characters) to keep request size bounded. */
export const MAX_CANDIDATE_CHARS = 2000;

/** Sanitize a caller-supplied id into a safe Choice option key. */
export function sanitizeId(id: string): string {
  const cleaned = id.replace(/[^A-Za-z0-9_.-]+/g, "_").replace(/^_+|_+$/g, "");
  return cleaned.length > 0 ? cleaned.slice(0, 64) : "";
}

export type Identifiable = { id?: string; text?: string };

export type WithIds<T> = T & { id: string; originalId: string };

/**
 * Ensure ids exist, are safe, and are unique. `id` is the sanitized key sent to
 * the model; `originalId` is what the caller passed (or the generated id).
 */
export function ensureUniqueIds<T extends Identifiable>(
  items: T[],
  fallbackPrefix: string,
): Array<WithIds<T>> {
  const used = new Set<string>();
  return items.map((item, i) => {
    const raw = item.id ?? "";
    const base = sanitizeId(raw) || `${fallbackPrefix}${i}`;
    let id = base;
    let n = 1;
    while (used.has(id)) id = `${base}_${n++}`;
    used.add(id);
    return { ...item, id, originalId: raw || id };
  });
}

/** Reverse lookup from sanitized id to the caller's original id. */
export function originalIds(items: ReadonlyArray<{ id: string; originalId: string }>): Map<string, string> {
  return new Map(items.map((i) => [i.id, i.originalId]));
}

/** Truncate long text with an explicit marker so the model knows it is partial. */
export function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)} […truncated]`;
}

export type Verdict = "verified" | "contradicted" | "unsupported" | "unknown";

/** Map a verify relation answer to a verdict label (citation-check cookbook). */
export const RELATION_TO_VERDICT: Record<string, Verdict> = {
  supports: "verified",
  contradicts: "contradicted",
  says_nothing: "unsupported",
};

export type VerifyAction = "auto" | "review";

/** Does this verdict stand on its own, or should a human confirm it? */
export function verifyAction(confidence: number | null, autoAccept: number): VerifyAction {
  if (confidence === null) return "review";
  return confidence >= autoAccept ? "auto" : "review";
}

export type ScreenAction = "pass" | "review" | "block" | "skip";

/**
 * Screen recommendation from probabilities.
 * injection: probability the text contains instructions aimed at an AI agent.
 * substance: probability the text has substantive readable content (optional).
 * relevance: probability the text is useful for the stated purpose (optional).
 */
export function screenRecommendation(input: {
  injection: number;
  substance?: number;
  relevance?: number;
  blockAt: number;
  reviewAt: number;
  skipBelow?: number;
}): { action: ScreenAction; reason: string } {
  const { injection, relevance, substance, blockAt, reviewAt } = input;
  const skipBelow = input.skipBelow ?? 0.3;
  if (injection >= blockAt) {
    return {
      action: "block",
      reason: `injection probability ${injection.toFixed(2)} >= block threshold ${blockAt}`,
    };
  }
  if (injection >= reviewAt) {
    return {
      action: "review",
      reason: `injection probability ${injection.toFixed(2)} >= review threshold ${reviewAt}`,
    };
  }
  if (substance !== undefined && substance < skipBelow) {
    return { action: "skip", reason: `little substantive content (substance ${substance.toFixed(2)})` };
  }
  if (relevance !== undefined && relevance < skipBelow) {
    return {
      action: "skip",
      reason: `not relevant to the stated purpose (relevance ${relevance.toFixed(2)})`,
    };
  }
  return { action: "pass", reason: "no signals above thresholds" };
}

export type ExistsVerdict = "answered" | "partial" | "absent";

/** Turn the exists Noul into a document-level verdict (semantic-find cookbook thresholds). */
export function existsVerdict(exists: number, found = 0.7, absent = 0.35): ExistsVerdict {
  if (exists >= found) return "answered";
  return exists < absent ? "absent" : "partial";
}

/** Rank candidate ids by Choice probability, descending. Ties keep caller order. */
export function rankCandidates<T extends { id: string }>(
  candidates: T[],
  probabilities: Record<string, number>,
): Array<T & { probability: number }> {
  return candidates
    .map((candidate, index) => ({
      candidate: { ...candidate, probability: probabilities[candidate.id] ?? 0 },
      index,
    }))
    .sort((a, b) => b.candidate.probability - a.candidate.probability || a.index - b.index)
    .map(({ candidate }) => candidate);
}

/** Parse a comma-separated `--fail-on` list against the allowed values. */
export function parseFailOn<T extends string>(
  raw: string | undefined,
  allowed: readonly T[],
  fallback: T[],
): T[] {
  if (raw === undefined) return fallback;
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "none") return [];
  const values = trimmed.split(",").map((v) => v.trim()) as T[];
  for (const v of values) {
    if (!allowed.includes(v)) {
      throw new Error(`Invalid --fail-on value "${v}". Allowed: ${allowed.join(", ")}, none.`);
    }
  }
  return values;
}

/** Parse a probability-like flag (0..1). */
export function parseProbability(name: string, raw: string | number | undefined, fallback: number): number {
  if (raw === undefined) return fallback;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > 1) throw new Error(`${name} must be a number between 0 and 1.`);
  return n;
}

/** Split an array into consecutive groups of at most `size`. */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (size < 1) throw new Error("chunk size must be at least 1");
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Wrap an async function so at most `limit` calls are in flight; the rest wait
 * in call order. A slot is taken synchronously when it is handed over, so a
 * caller arriving between a release and its waiter resuming cannot overshoot.
 */
export function limitConcurrency<A extends unknown[], R>(
  limit: number,
  fn: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  if (!Number.isInteger(limit) || limit < 1) throw new Error("concurrency limit must be at least 1");
  let active = 0;
  const waiting: Array<() => void> = [];
  const acquire = (): Promise<void> => {
    if (active < limit) {
      active += 1;
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      waiting.push(() => {
        active += 1;
        resolve();
      });
    });
  };
  return async (...args: A) => {
    await acquire();
    try {
      return await fn(...args);
    } finally {
      active -= 1;
      waiting.shift()?.();
    }
  };
}
