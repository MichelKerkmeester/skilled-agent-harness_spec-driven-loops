import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);
const writers = require(join(
  WORKSPACE_ROOT,
  '.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs',
)) as {
  writeSeat: (packet: string, relativePath: string, content: string) => string;
};

const tempDirs: string[] = [];

function makePacket(): string {
  const dir = mkdtempSync(join(tmpdir(), 'council-scope-'));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length) rmSync(tempDirs.pop()!, { recursive: true, force: true });
});

describe('ai-council path-scoped write authority', () => {
  it('allows writes under ai-council/** through council writers', () => {
    const packet = makePacket();
    const written = writers.writeSeat(packet, 'round-001/seat-001-cli-opencode.md', '# Seat\n');

    expect(written).toBe(join(packet, 'ai-council/seats/round-001/seat-001-cli-opencode.md'));
  });

  it('rejects out-of-scope writes before touching the filesystem', () => {
    const packet = makePacket();

    expect(() => writers.writeSeat(packet, '../outside.md', '# Escape\n')).toThrow(/OUT_OF_SCOPE_WRITE/);
  });
});
