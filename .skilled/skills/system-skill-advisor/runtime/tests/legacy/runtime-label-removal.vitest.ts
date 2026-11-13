// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Runtime Label Removal Tests
// ───────────────────────────────────────────────────────────────
// A stored record or a tool input that still carries a retired runtime label is
// dropped by the readers and rejected by the writers, so the label can never be
// surfaced as a live runtime again.

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  advisorHookDiagnosticsPath,
  advisorHookOutcomesPath,
  readAdvisorHookDiagnosticRecords,
  readAdvisorHookOutcomeRecords,
  serializeAdvisorHookDiagnosticRecord,
  validateSkillExecutionOutcomeRecord,
} from '../../lib/metrics.js';
import type { AdvisorHookDiagnosticRecord } from '../../lib/metrics.js';
import { AdvisorValidateInputSchema } from '../../schemas/advisor-tool-schemas.js';

function writeJsonl(path: string, records: readonly unknown[]): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`, 'utf8');
}

function removeMetricsFiles(workspaceRoot: string): void {
  rmSync(advisorHookDiagnosticsPath(workspaceRoot), { force: true });
  rmSync(advisorHookOutcomesPath(workspaceRoot), { force: true });
  rmSync(workspaceRoot, { recursive: true, force: true });
}

describe('advisor runtime label removal', () => {
  it('drops a stored diagnostic record carrying a retired runtime label', () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), 'advisor-runtime-label-'));

    try {
      writeJsonl(advisorHookDiagnosticsPath(workspaceRoot), [
        {
          timestamp: '2026-04-19T10:00:00.000Z',
          runtime: 'claude',
          status: 'ok',
          freshness: 'live',
          durationMs: 12,
          cacheHit: true,
        },
        {
          timestamp: '2026-04-19T10:00:01.000Z',
          runtime: 'copilot',
          status: 'ok',
          freshness: 'live',
          durationMs: 13,
          cacheHit: false,
        },
      ]);

      const records = readAdvisorHookDiagnosticRecords(workspaceRoot);

      expect(records).toHaveLength(1);
      expect(records[0]?.runtime).toBe('claude');
    } finally {
      removeMetricsFiles(workspaceRoot);
    }
  });

  it('drops a stored outcome record carrying a retired runtime label', () => {
    const workspaceRoot = mkdtempSync(join(tmpdir(), 'advisor-runtime-label-'));

    try {
      writeJsonl(advisorHookOutcomesPath(workspaceRoot), [
        {
          timestamp: '2026-04-19T10:00:00.000Z',
          runtime: 'claude',
          outcome: 'accepted',
          skillLabel: 'sk-code',
        },
        {
          timestamp: '2026-04-19T10:00:01.000Z',
          runtime: 'copilot',
          outcome: 'accepted',
          skillLabel: 'sk-code',
        },
      ]);

      const records = readAdvisorHookOutcomeRecords(workspaceRoot);

      expect(records).toHaveLength(1);
      expect(records[0]?.runtime).toBe('claude');
    } finally {
      removeMetricsFiles(workspaceRoot);
    }
  });

  it('refuses to serialize a diagnostic record carrying a retired runtime label', () => {
    const record = {
      timestamp: '2026-04-19T10:00:00.000Z',
      runtime: 'copilot',
      status: 'ok',
      freshness: 'live',
      durationMs: 12,
      cacheHit: true,
    } as unknown as AdvisorHookDiagnosticRecord;

    expect(() => serializeAdvisorHookDiagnosticRecord(record)).toThrow(/closed-schema/);
  });

  it('rejects an execution outcome record carrying a retired runtime label', () => {
    const record = {
      timestamp: '2026-04-19T10:00:00.000Z',
      runtime: 'copilot',
      skillId: 'sk-code',
      success: true,
      eventId: 'event-1',
    };

    expect(validateSkillExecutionOutcomeRecord(record)).toBe(false);
  });

  it('rejects a validate input outcome event carrying a retired runtime label', () => {
    const result = AdvisorValidateInputSchema.safeParse({
      confirmHeavyRun: true,
      outcomeEvents: [
        {
          runtime: 'copilot',
          outcome: 'accepted',
          skillId: 'sk-code',
        },
      ],
    });

    expect(result.success).toBe(false);
    if (result.success) {
      throw new Error('expected the retired runtime label to be rejected');
    }
    expect(result.error.issues.map((issue) => issue.path.join('.'))).toContain('outcomeEvents.0.runtime');
  });
});
