import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type LegacyRealRecord = Record<string, unknown>;

export type CompatibilityLike = {
  readonly status: string;
  readonly reasonCode: string;
  readonly targetStem: string | null;
};

const OPEN_CODE_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../../../',
);

export const REAL_LEGACY_LOGS = Object.freeze({
  research: 'specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/003-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-state.jsonl',
  // The count below tracks a real captured review log; re-measure it if the log is ever replaced.
  review: 'specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/review/deep-review-state.jsonl',
  council: 'specs/system-deep-loop/z_archive/025-deep-loop-gpt-reliability/004-benchmarks-and-verification/001-gpt-verification-smoke/ai-council/session-state.jsonl',
  councilArchive: 'specs/system-deep-loop/z_archive/024-deep-loop-improved/012-deep-loop-divergent-mode/ai-council/ai-council-state.jsonl',
  common: 'specs/system-deep-loop/z_archive/013-agent-deep-review-optimization/improvement/improvement-journal.jsonl',
} as const);

export function readRealJsonl(relativePath: string): LegacyRealRecord[] {
  const absolutePath = resolve(OPEN_CODE_ROOT, relativePath);
  return readFileSync(absolutePath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as LegacyRealRecord);
}

export function unknownLegacyRecords(
  records: readonly LegacyRealRecord[],
  decide: (record: LegacyRealRecord) => CompatibilityLike,
): Array<{ readonly index: number; readonly type: unknown; readonly event: unknown; readonly reasonCode: string }> {
  return records.flatMap((record, index) => {
    const result = decide(record);
    return result.status === 'blocked' && result.reasonCode === 'unknown-legacy-record'
      ? [{ index, type: record.type, event: record.event ?? record.eventType, reasonCode: result.reasonCode }]
      : [];
  });
}
