import { describe, expect, it } from 'vitest';

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const {
  appendRoundStateRecord,
  readRoundStateRecords,
  repairRoundStateJsonl,
} = require('../../lib/council/round-state-jsonl.cjs') as {
  appendRoundStateRecord: (path: string, record: Record<string, unknown>) => { appended: boolean; repair: { repaired: boolean; droppedBytes: number } };
  readRoundStateRecords: (path: string, options?: { repair?: boolean }) => Record<string, unknown>[];
  repairRoundStateJsonl: (path: string) => { repaired: boolean; droppedBytes: number };
};

/**
 * Creates a temporary directory with a JSONL file path and cleans up afterward.
 */
function withTempJsonl(run: (statePath: string) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-round-jsonl-'));
  try {
    run(join(tempDir, 'round-state.jsonl'));
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('council round-state JSONL', () => {
  it('atomically appends records and releases the write lock', () => {
    withTempJsonl((statePath) => {
      expect(appendRoundStateRecord(statePath, { type: 'round_started', topic_id: 'topic-001', round_id: 'round-001' })).toMatchObject({
        appended: true,
        repair: { repaired: false, droppedBytes: 0 },
      });
      appendRoundStateRecord(statePath, { type: 'seat_finished', topic_id: 'topic-001', round_id: 'round-001', seat_id: 'seat-001' });

      const records = readRoundStateRecords(statePath);
      expect(records).toHaveLength(2);
      expect(records.map((record) => record.type)).toEqual(['round_started', 'seat_finished']);
      expect(records.every((record) => record.schema_version === '1.0')).toBe(true);
      expect(existsSync(`${statePath}.lock`)).toBe(false);
    });
  });

  it('repairs a partial trailing write before the next append', () => {
    withTempJsonl((statePath) => {
      writeFileSync(statePath, '{"type":"round_started","round_id":"round-001"}\n{"type":', 'utf8');

      const repair = repairRoundStateJsonl(statePath);

      expect(repair.repaired).toBe(true);
      expect(repair.droppedBytes).toBeGreaterThan(0);
      expect(readFileSync(statePath, 'utf8')).toBe('{"type":"round_started","round_id":"round-001"}\n');

      const append = appendRoundStateRecord(statePath, { type: 'round_resumed', topic_id: 'topic-001', round_id: 'round-001' });
      expect(append.repair).toEqual({ repaired: false, droppedBytes: 0 });
      expect(readRoundStateRecords(statePath).map((record) => record.type)).toEqual(['round_started', 'round_resumed']);
    });
  });

  it('separates an append from an existing final line without a trailing newline', () => {
    withTempJsonl((statePath) => {
      writeFileSync(statePath, '{"type":"round_started","round_id":"round-001"}', 'utf8');

      appendRoundStateRecord(statePath, { type: 'round_resumed', topic_id: 'topic-001', round_id: 'round-001' });

      const lines = readFileSync(statePath, 'utf8').trimEnd().split(/\r?\n/);
      expect(lines).toHaveLength(2);
      expect(lines.map((line) => JSON.parse(line).type)).toEqual(['round_started', 'round_resumed']);
    });
  });

  it('repairs corrupt read tails in memory without rewriting the state file', () => {
    withTempJsonl((statePath) => {
      const content = '{"type":"round_started","round_id":"round-001"}\n{"type":';
      writeFileSync(statePath, content, 'utf8');

      const records = readRoundStateRecords(statePath);

      expect(records.map((record) => record.type)).toEqual(['round_started']);
      expect(readFileSync(statePath, 'utf8')).toBe(content);
    });
  });

  it('readRoundStateRecords returns empty array for non-existent path', () => {
    const records = readRoundStateRecords('/tmp/does-not-exist-' + Math.random() + '.jsonl');
    expect(Array.isArray(records)).toBe(true);
    expect(records).toEqual([]);
  });

  it('repairRoundStateJsonl on clean file returns no repair needed', () => {
    withTempJsonl((statePath) => {
      writeFileSync(statePath, '{"type":"round_started","round_id":"r1"}\n', 'utf8');
      const repair = repairRoundStateJsonl(statePath);
      expect(repair.repaired).toBe(false);
      expect(repair.droppedBytes).toBe(0);
    });
  });

  it('appendRoundStateRecord preserves record order across multiple writes', () => {
    withTempJsonl((statePath) => {
      for (let i = 0; i < 5; i++) {
        appendRoundStateRecord(statePath, { type: 'seat_event', round_id: 'round-001', seat_id: `seat-${i}` });
      }
      const records = readRoundStateRecords(statePath);
      expect(records).toHaveLength(5);
      expect(records.map((r) => r.seat_id)).toEqual(['seat-0', 'seat-1', 'seat-2', 'seat-3', 'seat-4']);
    });
  });

  it('appendRoundStateRecord stamps schema_version on each record', () => {
    withTempJsonl((statePath) => {
      appendRoundStateRecord(statePath, { type: 'topic_started', topic_id: 'topic-001' });
      appendRoundStateRecord(statePath, { type: 'round_started', round_id: 'round-001' });
      const records = readRoundStateRecords(statePath);
      expect(records.every((r) => r.schema_version === '1.0')).toBe(true);
    });
  });
});
