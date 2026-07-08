import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);
const rollback = require(join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/rollback.cjs',
)) as {
  moveRoundToFailed: (packet: string, round: string, options?: Record<string, unknown>) => { moved: string[] };
  markSuperseded: (statePath: string, options?: Record<string, unknown>) => { superseded: string[] };
};
const audit = require(join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/audit-trail.cjs',
)) as {
  appendArtifactWrittenEvent: (statePath: string, event: Record<string, unknown>) => string;
  computeChecksum: (content: string) => string;
};

const tempDirs: string[] = [];

function makePacket(): string {
  const dir = mkdtempSync(join(tmpdir(), 'council-rollback-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length) rmSync(tempDirs.pop()!, { recursive: true, force: true });
});

describe('ai-council round rollback', () => {
  it('moves round artifacts to failed/ and appends rollback supersede markers', () => {
    const packet = makePacket();
    const seatDir = join(packet, 'ai-council/seats/round-001');
    const deliberationDir = join(packet, 'ai-council/deliberations');
    const statePath = join(packet, 'ai-council/ai-council-state.jsonl');
    mkdirSync(seatDir, { recursive: true });
    mkdirSync(deliberationDir, { recursive: true });
    writeFileSync(join(seatDir, 'seat-001-cli-opencode.md'), '# Seat\n');
    writeFileSync(join(deliberationDir, 'round-001.md'), '# Deliberation\n');
    audit.appendArtifactWrittenEvent(statePath, {
      path: 'seats/round-001/seat-001-cli-opencode.md',
      bytes: 7,
      checksum: audit.computeChecksum('# Seat\n'),
      round_id: 'round-001',
    });

    const moved = rollback.moveRoundToFailed(packet, 'round-001', {
      timestamp: '2026-05-08T22:31:00.000Z',
    });
    const marked = rollback.markSuperseded(statePath, {
      round_id: 'round-001',
      rollback_event_id: 'rollback-round-001-test',
      reason: 'seat-error injection',
      timestamp: '2026-05-08T22:31:00.000Z',
    });

    expect(moved.moved.length).toBeGreaterThanOrEqual(2);
    expect(existsSync(seatDir)).toBe(false);
    expect(existsSync(join(packet, 'ai-council/failed/round-001-2026-05-08T22-31-00-000Z/seats/round-001/seat-001-cli-opencode.md'))).toBe(true);
    expect(marked.superseded).toEqual(['seats/round-001/seat-001-cli-opencode.md']);
    const state = readFileSync(statePath, 'utf8');
    expect(state).toContain('"event":"rollback"');
    expect(state).toContain('"event":"artifact_superseded"');
    expect(state).toContain('"superseded_by":"rollback"');
  });
});
