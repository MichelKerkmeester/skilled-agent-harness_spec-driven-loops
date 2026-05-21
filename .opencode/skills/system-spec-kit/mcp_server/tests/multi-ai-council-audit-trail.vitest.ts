import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);
const audit = require(join(
  WORKSPACE_ROOT,
  '.opencode/skills/sk-ai-council/scripts/lib/audit-trail.js',
)) as {
  computeChecksum: (content: string) => string;
  appendArtifactWrittenEvent: (statePath: string, event: Record<string, unknown>) => string;
};
const helper = require(join(
  WORKSPACE_ROOT,
  '.opencode/skills/sk-ai-council/scripts/persist-artifacts.cjs',
)) as {
  parseStateLog: (jsonl: string) => Array<Record<string, unknown>>;
};

const tempDirs: string[] = [];

function makeDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'council-audit-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length) rmSync(tempDirs.pop()!, { recursive: true, force: true });
});

describe('ai-council audit trail v1.2', () => {
  it('writes artifact_written events with checksum and v1 reader tolerance', () => {
    const root = makeDir();
    const statePath = join(root, 'ai-council-state.jsonl');
    const content = '# Council report\n';

    audit.appendArtifactWrittenEvent(statePath, {
      path: 'council-report.md',
      bytes: Buffer.byteLength(content),
      checksum: audit.computeChecksum(content),
      timestamp: '2026-05-08T22:30:00.000Z',
      seat_id: null,
      round_id: 'round-001',
    });

    expect(existsSync(statePath)).toBe(true);
    const events = helper.parseStateLog(readFileSync(statePath, 'utf8'));
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      schema_version: '1.2',
      protocol: 'ai-council',
      event: 'artifact_written',
      path: 'council-report.md',
      bytes: Buffer.byteLength(content),
      checksum: audit.computeChecksum(content),
      round_id: 'round-001',
    });
  });

  it('rotates ai-council-state.jsonl when the audit file crosses the size cap', () => {
    const root = makeDir();
    const statePath = join(root, 'ai-council-state.jsonl');

    audit.appendArtifactWrittenEvent(statePath, {
      path: 'first.md',
      bytes: 1,
      checksum: audit.computeChecksum('a'),
      round_id: 'round-001',
      maxBytes: 10,
    });
    audit.appendArtifactWrittenEvent(statePath, {
      path: 'second.md',
      bytes: 1,
      checksum: audit.computeChecksum('b'),
      round_id: 'round-001',
      maxBytes: 10,
    });

    expect(existsSync(`${statePath}.1`)).toBe(true);
  });
});
