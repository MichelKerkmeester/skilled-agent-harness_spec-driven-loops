// ───────────────────────────────────────────────────────────────────
// MODULE: Observability Events Unit Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  appendObservabilityEvent,
  normalizeObservabilityEvent,
} = require('../../lib/deep-loop/observability-events.cjs') as {
  appendObservabilityEvent: (
    path: string,
    payload: Record<string, unknown>,
    meta?: Record<string, unknown>,
  ) => Record<string, unknown>;
  normalizeObservabilityEvent: (
    payload: Record<string, unknown>,
    meta?: Record<string, unknown>,
  ) => Record<string, unknown>;
};

describe('observability event envelope', () => {
  it('normalizes a fan-out native payload into the shared envelope', () => {
    const payload = {
      event: 'completed',
      label: 'codex-a',
      at: '2026-06-28T12:00:00.000Z',
      duration_ms: 1234,
      gauges: { lag: 0, pending: 0, failed: 0 },
    };

    const envelope = normalizeObservabilityEvent(payload, {
      eventId: '00000000-0000-4000-8000-000000000000',
      producer: 'fanout-run',
      stream: 'orchestration-status',
      subject: { label: 'codex-a' },
      observedAtIso: '2026-06-28T12:00:01.000Z',
    });

    expect(envelope).toEqual({
      schema_version: '1.0',
      event_id: '00000000-0000-4000-8000-000000000000',
      producer: 'fanout-run',
      stream: 'orchestration-status',
      subject: { label: 'codex-a' },
      event: 'completed',
      status: 'completed',
      observed_at_iso: '2026-06-28T12:00:01.000Z',
      payload,
    });
  });

  it('appends one normalized JSONL row', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'observability-events-'));
    try {
      const eventPath = join(tempDir, 'observability-events.jsonl');
      const envelope = appendObservabilityEvent(
        eventPath,
        { type: 'round_started', round_id: 'round-001' },
        {
          producer: 'round-state-jsonl',
          stream: 'council-round-state',
          subject: { round_id: 'round-001' },
        },
      );

      const rows = readFileSync(eventPath, 'utf8')
        .trim()
        .split('\n')
        .map((line) => JSON.parse(line)) as Array<Record<string, unknown>>;

      expect(rows).toHaveLength(1);
      expect(rows[0]).toEqual(envelope);
      expect(rows[0]).toMatchObject({
        schema_version: '1.0',
        producer: 'round-state-jsonl',
        stream: 'council-round-state',
        event: 'round_started',
        status: 'unknown',
      });
      expect(rows[0].event_id).toEqual(expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
      ));
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
