// ───────────────────────────────────────────────────────────────────
// MODULE: Code Graph Config Defaults
// ───────────────────────────────────────────────────────────────────
// Single source of truth for hardcoded config values.
// All scalar defaults derive from env-var overrides; object defaults
// accept JSON overrides via env var, merging partial overrides the way
// the skill-advisor env-override path does.

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function parseJsonOverride<T extends Record<string, unknown>>(
  value: string | undefined,
  fallback: T,
): T {
  if (value === undefined) return fallback;
  try {
    const parsed = JSON.parse(value) as Partial<T>;
    return { ...fallback, ...parsed };
  } catch (err) {
    console.warn(
      `[config-defaults] Failed to parse JSON env var, using default: ${err instanceof Error ? err.message : String(err)}`,
    );
    return fallback;
  }
}

export const CODE_GRAPH_DEFAULTS = {
  ttlMs: parsePositiveInt(process.env.SPECKIT_CODE_GRAPH_TTL_MS, 60_000),
  findFilesMaxDepth: parsePositiveInt(process.env.SPECKIT_CODE_GRAPH_FIND_FILES_MAX_DEPTH, 20),
  quarantineAgeDays: parsePositiveInt(process.env.SPECKIT_CODE_GRAPH_QUARANTINE_AGE_DAYS, 14),
  floors: parseJsonOverride(
    process.env.SPECKIT_CODE_GRAPH_FLOORS_JSON,
    {
      constitutional: 700,
      codeGraph: 1200,
      triggered: 400,
      overflow: 800,
    },
  ),
  edgeWeights: parseJsonOverride(
    process.env.SPECKIT_CODE_GRAPH_EDGE_WEIGHTS_JSON,
    {
      CONTAINS: 1.0,
      IMPORTS: 1.0,
      EXPORTS: 1.0,
      EXTENDS: 0.95,
      IMPLEMENTS: 0.95,
      DECORATES: 0.9,
      OVERRIDES: 0.9,
      TYPE_OF: 0.85,
      CALLS: 0.8,
      TESTED_BY: 0.6,
    },
  ),
} as const;
