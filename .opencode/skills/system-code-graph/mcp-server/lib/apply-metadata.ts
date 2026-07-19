// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Apply Metadata
// ───────────────────────────────────────────────────────────────

import * as graphDb from './code-graph-db.js';

export type ApplyResultStatus = 'committed' | 'rolled-back' | 'rollback-failed' | 'aborted' | 'dry-run' | 'noop';

export const APPLY_METADATA_KEY = 'last_apply';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function persistApplyMetadata(result: {
  status: ApplyResultStatus;
  batteryPassRate: number | null;
  now: () => Date;
}): void {
  graphDb.setCodeGraphMetadata(APPLY_METADATA_KEY, JSON.stringify({
    lastRunAt: result.now().toISOString(),
    lastResult: result.status,
    batteryPassRate: result.batteryPassRate,
  }));
}

export function getLastApplyMetadata(): {
  lastRunAt: string | null;
  lastResult: ApplyResultStatus | null;
  batteryPassRate: number | null;
} {
  const raw = graphDb.getCodeGraphMetadata(APPLY_METADATA_KEY);
  if (!raw) {
    return { lastRunAt: null, lastResult: null, batteryPassRate: null };
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) {
      return { lastRunAt: null, lastResult: null, batteryPassRate: null };
    }
    return {
      lastRunAt: typeof parsed.lastRunAt === 'string' ? parsed.lastRunAt : null,
      lastResult: typeof parsed.lastResult === 'string' ? parsed.lastResult as ApplyResultStatus : null,
      batteryPassRate: typeof parsed.batteryPassRate === 'number' ? parsed.batteryPassRate : null,
    };
  } catch {
    return { lastRunAt: null, lastResult: null, batteryPassRate: null };
  }
}
