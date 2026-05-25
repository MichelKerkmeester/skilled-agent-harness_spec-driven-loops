// ───────────────────────────────────────────────────────────────
// MODULE: Local Reranker Compatibility Shim
// ───────────────────────────────────────────────────────────────
// Runtime reranking now lives in the sentence-transformers cross-encoder path.
// This module preserves the old import surface as a no-op so shutdown hooks and
// tests keep a stable API while the in-process model loader surface is gone.

type LocalRerankRow = Record<string, unknown> & {
  id: number | string;
  content?: string;
  file_path?: string;
  score?: number;
  rerankerScore?: number;
};

function resolveRowText(row: LocalRerankRow): string {
  if (typeof row.content === 'string' && row.content.trim().length > 0) {
    return row.content.trim();
  }
  if (typeof row.file_path === 'string' && row.file_path.trim().length > 0) {
    return row.file_path.trim();
  }
  return '';
}

function normalizeScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return (Math.tanh(value) + 1) / 2;
}

function extractNumericScore(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const directKeys = ['score', 'relevance', 'relevanceScore', 'similarity', 'logit'];
    for (const key of directKeys) {
      const extracted = extractNumericScore(record[key]);
      if (extracted !== null) return extracted;
    }
  }
  return null;
}

async function scorePrompt(context: unknown, prompt: string): Promise<number> {
  if (!context || typeof context !== 'object') {
    throw new Error('Invalid scoring context');
  }

  const directFns = ['score', 'getScore', 'evaluate', 'eval'] as const;
  for (const fnName of directFns) {
    const fn = (context as Record<string, unknown>)[fnName];
    if (typeof fn === 'function') {
      const raw = await (fn as (input: string) => Promise<unknown>).call(context, prompt);
      const score = extractNumericScore(raw);
      if (score !== null) return normalizeScore(score);
    }
  }

  throw new Error('Unable to resolve a scoring method from context');
}

export async function canUseLocalReranker(): Promise<boolean> {
  return false;
}

export async function rerankLocal<T extends LocalRerankRow>(
  _query: string,
  candidates: T[],
  _topK: number,
): Promise<T[]> {
  return candidates;
}

export async function disposeLocalReranker(): Promise<void> {
  return undefined;
}

export const __testables = {
  resolveRowText,
  extractNumericScore,
  normalizeScore,
  scorePrompt,
};
