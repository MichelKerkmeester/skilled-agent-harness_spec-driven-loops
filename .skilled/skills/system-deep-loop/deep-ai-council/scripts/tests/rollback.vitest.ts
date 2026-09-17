import { describe, expect, it } from 'vitest';

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync as fsWriteFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const {
  moveRoundToFailed,
  markSuperseded,
} = require('../lib/rollback.cjs') as {
  moveRoundToFailed: (packetSpecFolder: string, roundId: string | number, options?: Record<string, unknown>) => { round_id: string; failedRoot: string; moved: string[] };
  markSuperseded: (stateJsonlPath: string, options?: Record<string, unknown>) => { round_id: string; rollback_event_id: string; superseded: string[] };
};

/**
 * Creates a temporary directory and runs the callback within it, cleaning up afterwards.
 */
async function withTempPacket(run: (packetSpecFolder: string) => void | Promise<void>): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-rollback-'));
  try {
    await run(tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * writeFileSync wrapper that creates parent directories first, so fixtures can
 * seed nested `ai-council/**` paths without a manual mkdirSync per call.
 */
function writeFileSync(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  fsWriteFileSync(filePath, content);
}

describe('deep-ai-council rollback', () => {
  it('moveRoundToFailed moves round artifacts to failed archive folder', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      const roundDir = join(councilRoot, 'round-001');
      const seatsDir = join(councilRoot, 'seats', 'round-001');
      const deliberationPath = join(councilRoot, 'deliberations', 'round-001.md');

      writeFileSync(join(roundDir, 'state.json'), '{}');
      writeFileSync(join(seatsDir, 'seat-001.md'), '# Seat 1');
      writeFileSync(deliberationPath, '# Deliberation');

      const result = moveRoundToFailed(packetSpecFolder, 'round-001', { timestamp: '2026-05-24T12:00:00.000Z' });

      expect(result.round_id).toBe('round-001');
      expect(result.failedRoot).toContain('failed/round-001-2026-05-24T12-00-00-000Z');
      expect(result.moved).toHaveLength(3);
      expect(existsSync(roundDir)).toBe(false);
      expect(existsSync(join(result.failedRoot, 'round-001', 'state.json'))).toBe(true);
      expect(existsSync(join(result.failedRoot, 'seats', 'round-001', 'seat-001.md'))).toBe(true);
      expect(existsSync(join(result.failedRoot, 'deliberations', 'round-001.md'))).toBe(true);
    });
  });

  it('moveRoundToFailed handles missing artifacts gracefully', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      const roundDir = join(councilRoot, 'round-001');

      writeFileSync(join(roundDir, 'state.json'), '{}');

      const result = moveRoundToFailed(packetSpecFolder, 'round-001');

      expect(result.moved).toHaveLength(1);
      expect(existsSync(roundDir)).toBe(false);
    });
  });

  it('moveRoundToFailed normalizes round numbers to round-NNN format', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const councilRoot = join(packetSpecFolder, 'ai-council');
      const roundDir = join(councilRoot, 'round-002');

      writeFileSync(join(roundDir, 'state.json'), '{}');

      const result = moveRoundToFailed(packetSpecFolder, 2);

      expect(result.round_id).toBe('round-002');
      expect(result.failedRoot).toContain('round-002');
    });
  });

  it('markSuperseded appends rollback and artifact_superseded events to state JSONL', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const statePath = join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl');
      writeFileSync(statePath, JSON.stringify({
        event: 'artifact_written',
        path: 'seats/round-001/seat-001.md',
        bytes: 100,
        checksum: 'sha256:abc123',
        round_id: 'round-001',
        timestamp: '2026-05-24T12:00:00.000Z',
      }) + '\n');

      const result = markSuperseded(statePath, {
        round_id: 'round-001',
        reason: 'seat timeout',
        timestamp: '2026-05-24T12:01:00.000Z',
        rollback_event_id: 'rollback-round-001-20260524T120100Z',
      });

      expect(result.round_id).toBe('round-001');
      expect(result.rollback_event_id).toBe('rollback-round-001-20260524T120100Z');
      expect(result.superseded).toEqual(['seats/round-001/seat-001.md']);

      const lines = readFileSync(statePath, 'utf8').split('\n').filter(Boolean);
      expect(lines).toHaveLength(3);
      const rollbackEvent = JSON.parse(lines[1]);
      expect(rollbackEvent.event).toBe('rollback');
      const supersededEvent = JSON.parse(lines[2]);
      expect(supersededEvent.event).toBe('artifact_superseded');
    });
  });

  it('markSuperseded filters out already-superseded artifacts', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const statePath = join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl');
      writeFileSync(statePath, [
        JSON.stringify({
          event: 'artifact_written',
          path: 'seats/round-001/seat-001.md',
          bytes: 100,
          checksum: 'sha256:abc123',
          round_id: 'round-001',
          timestamp: '2026-05-24T12:00:00.000Z',
        }),
        JSON.stringify({
          event: 'artifact_superseded',
          original_path: 'seats/round-001/seat-001.md',
          round_id: 'round-001',
          rollback_event_id: 'rollback-1',
          superseded_by: 'rollback',
          timestamp: '2026-05-24T12:01:00.000Z',
        }),
        JSON.stringify({
          event: 'artifact_written',
          path: 'seats/round-001/seat-002.md',
          bytes: 100,
          checksum: 'sha256:def456',
          round_id: 'round-001',
          timestamp: '2026-05-24T12:02:00.000Z',
        }),
      ].join('\n') + '\n');

      const result = markSuperseded(statePath, { round_id: 'round-001' });

      expect(result.superseded).toEqual(['seats/round-001/seat-002.md']);
    });
  });

  it('markSuperseded handles empty state file', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const statePath = join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl');

      const result = markSuperseded(statePath, { round_id: 'round-001' });

      expect(result.superseded).toEqual([]);
      // Empty state -> markSuperseded appends only the `rollback` marker event
      // (no artifact_written rows to supersede), so exactly one line is written.
      const lines = readFileSync(statePath, 'utf8').split('\n').filter(Boolean);
      expect(lines).toHaveLength(1);
    });
  });

  it('markSuperseded accepts camel-case roundId alias', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const statePath = join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl');

      const result = markSuperseded(statePath, { roundId: 'round-002' });

      expect(result.round_id).toBe('round-002');
    });
  });
});
