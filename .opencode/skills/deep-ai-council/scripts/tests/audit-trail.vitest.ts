import { describe, expect, it } from 'vitest';

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const {
  SCHEMA_VERSION,
  PROTOCOL,
  PRODUCER_VERSION,
  DEFAULT_MAX_BYTES,
  appendJsonlEvent,
  appendArtifactWrittenEvent,
  computeChecksum,
  normalizeEvent,
  normalizeRoundId,
} = require('../lib/audit-trail.cjs') as {
  SCHEMA_VERSION: string;
  PROTOCOL: string;
  PRODUCER_VERSION: string;
  DEFAULT_MAX_BYTES: number;
  appendJsonlEvent: (stateJsonlPath: string, event: Record<string, unknown>, options?: Record<string, unknown>) => string;
  appendArtifactWrittenEvent: (stateJsonlPath: string, event: Record<string, unknown>) => string;
  computeChecksum: (content: Buffer | string) => string;
  normalizeEvent: (event: Record<string, unknown>) => Record<string, unknown>;
  normalizeRoundId: (roundId: string | number) => string;
};

/**
 * Creates a temporary directory and runs the callback within it, cleaning up afterwards.
 */
async function withTempPacket(run: (packetSpecFolder: string) => void | Promise<void>): Promise<void> {
  const tempDir = mkdtempSync(join(tmpdir(), 'council-audit-trail-'));
  try {
    await run(tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('deep-ai-council audit-trail', () => {
  it('constants define schema version, protocol, and producer version', () => {
    expect(SCHEMA_VERSION).toBe('1.2');
    expect(PROTOCOL).toBe('ai-council');
    expect(PRODUCER_VERSION).toBe('persist-artifacts@1.2.0');
    expect(DEFAULT_MAX_BYTES).toBe(10 * 1024 * 1024);
  });

  it('computeChecksum returns sha256-prefixed hex digest', () => {
    const checksum = computeChecksum('test content');
    expect(checksum).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(checksum).toBe('sha256:ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac70f82498452e0e2a7b5e3f3e7a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1');
  });

  it('computeChecksum handles Buffer input', () => {
    const buffer = Buffer.from('test content');
    const checksum = computeChecksum(buffer);
    expect(checksum).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it('normalizeRoundId converts integers to round-NNN format', () => {
    expect(normalizeRoundId(1)).toBe('round-001');
    expect(normalizeRoundId(2)).toBe('round-002');
    expect(normalizeRoundId(10)).toBe('round-010');
  });

  it('normalizeRoundId accepts round-NNN strings', () => {
    expect(normalizeRoundId('round-001')).toBe('round-001');
    expect(normalizeRoundId('round-010')).toBe('round-010');
  });

  it('normalizeRoundId throws for invalid round IDs', () => {
    expect(() => normalizeRoundId(0)).toThrow('[ai-council] round_id must be round-NNN or an integer from 1 to 99');
    expect(() => normalizeRoundId(100)).toThrow('[ai-council] round_id must be round-NNN or an integer from 1 to 99');
    expect(() => normalizeRoundId('invalid')).toThrow('[ai-council] round_id must be round-NNN or an integer from 1 to 99');
  });

  it('normalizeEvent adds schema metadata to event payload', () => {
    const event = normalizeEvent({ event: 'test', data: 'value' });
    expect(event).toMatchObject({
      schema_version: '1.2',
      protocol: 'ai-council',
      producer: 'persist-artifacts@1.2.0',
      event: 'test',
      data: 'value',
    });
  });

  it('appendJsonlEvent writes normalized event to state JSONL', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const statePath = join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl');
      const result = appendJsonlEvent(statePath, { event: 'test', round: 1 });

      expect(result).toBe(statePath);
      expect(existsSync(statePath)).toBe(true);

      const content = readFileSync(statePath, 'utf8');
      const lines = content.split('\n').filter(Boolean);
      expect(lines).toHaveLength(1);

      const event = JSON.parse(lines[0]);
      expect(event.schema_version).toBe('1.2');
      expect(event.event).toBe('test');
    });
  });

  it('appendJsonlEvent rotates state file when maxBytes is exceeded', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const statePath = join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl');
      writeFileSync(statePath, 'x'.repeat(100));

      const result = appendJsonlEvent(statePath, { event: 'test' }, { maxBytes: 50 });

      expect(result).toBe(statePath);
      expect(existsSync(statePath)).toBe(true);
      expect(existsSync(`${statePath}.1`)).toBe(true);

      const content = readFileSync(statePath, 'utf8');
      expect(content).toContain('"event":"test"');
    });
  });

  it('appendArtifactWrittenEvent writes artifact_written event with metadata', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const statePath = join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl');
      const result = appendArtifactWrittenEvent(statePath, {
        path: 'seats/round-001/seat-001.md',
        bytes: 1024,
        checksum: 'sha256:abc123',
        timestamp: '2026-05-24T12:00:00.000Z',
        seat_id: 'seat-001',
        round_id: 1,
      });

      expect(result).toBe(statePath);

      const content = readFileSync(statePath, 'utf8');
      const event = JSON.parse(content.trim());
      expect(event.event).toBe('artifact_written');
      expect(event.path).toBe('seats/round-001/seat-001.md');
      expect(event.bytes).toBe(1024);
      expect(event.checksum).toBe('sha256:abc123');
      expect(event.seat_id).toBe('seat-001');
      expect(event.round_id).toBe('round-001');
    });
  });

  it('appendArtifactWrittenEvent normalizes round_id to round-NNN', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const statePath = join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl');
      appendArtifactWrittenEvent(statePath, {
        path: 'test.md',
        bytes: 100,
        checksum: 'sha256:abc',
        round_id: 5,
      });

      const event = JSON.parse(readFileSync(statePath, 'utf8').trim());
      expect(event.round_id).toBe('round-005');
    });
  });

  it('appendArtifactWrittenEvent accepts camel-case aliases', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const statePath = join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl');
      appendArtifactWrittenEvent(statePath, {
        path: 'test.md',
        bytes: 100,
        checksum: 'sha256:abc',
        seatId: 'seat-002',
        roundId: 3,
      });

      const event = JSON.parse(readFileSync(statePath, 'utf8').trim());
      expect(event.seat_id).toBe('seat-002');
      expect(event.round_id).toBe('round-003');
    });
  });

  it('appendArtifactWrittenEvent includes optional event_id when provided', async () => {
    await withTempPacket(async (packetSpecFolder) => {
      const statePath = join(packetSpecFolder, 'ai-council', 'ai-council-state.jsonl');
      appendArtifactWrittenEvent(statePath, {
        path: 'test.md',
        bytes: 100,
        checksum: 'sha256:abc',
        event_id: 'evt-123',
      });

      const event = JSON.parse(readFileSync(statePath, 'utf8').trim());
      expect(event.event_id).toBe('evt-123');
    });
  });
});
