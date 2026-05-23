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
  readRoundStateRecords: (path: string) => Record<string, unknown>[];
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
});
