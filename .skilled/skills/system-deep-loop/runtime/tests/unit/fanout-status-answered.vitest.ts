// ───────────────────────────────────────────────────────────────────
// MODULE: Review lineage answered count in the progress row
// ───────────────────────────────────────────────────────────────────
// A review node is answered once its dimensions are covered, and the reducer
// derives that status into the registry frontier without writing it back to
// the node store, so the row must read the derived status or it shows 0 forever.

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const here = fileURLToPath(new URL('.', import.meta.url));
const fanoutRunPath = join(resolve(here, '..', '..', 'scripts'), 'fanout-run.cjs');
const { readLineageProgressFields } = createRequire(import.meta.url)(fanoutRunPath) as {
  readLineageProgressFields: (lineageDir: string) => { nodes: Record<string, number> };
};

const tempDirs: string[] = [];
afterEach(() => {
  while (tempDirs.length > 0) rmSync(tempDirs.pop() as string, { recursive: true, force: true });
});

function reviewLineage(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fanout-status-answered-'));
  tempDirs.push(dir);
  // The store only ever holds the lifecycle its writer owns: every node is still open.
  writeFileSync(join(dir, 'frontier-nodes.jsonl'), [
    { nodeId: 'F-1-001', status: 'open' },
    { nodeId: 'F-1-002', status: 'open' },
    { nodeId: 'F-1-003', status: 'open' },
  ].map((row) => JSON.stringify(row)).join('\n'));
  return dir;
}

describe('review lineage nodes answered', () => {
  it('counts a node the reducer derived as answered', () => {
    const dir = reviewLineage();
    // F-1-003 was admitted after the last reduce, so only the store knows it.
    writeFileSync(join(dir, 'deep-review-findings-registry.json'), JSON.stringify({
      frontier: { nodes: [{ nodeId: 'F-1-001', status: 'answered' }, { nodeId: 'F-1-002', status: 'open' }] },
    }));
    expect(readLineageProgressFields(dir).nodes).toEqual({ answered: 1, open: 2, total: 3 });
  });

  it('falls back to the store when no reduced frontier exists', () => {
    const dir = reviewLineage();
    expect(readLineageProgressFields(dir).nodes).toEqual({ answered: 0, open: 3, total: 3 });
    writeFileSync(join(dir, 'deep-review-findings-registry.json'), '{not json');
    expect(readLineageProgressFields(dir).nodes).toEqual({ answered: 0, open: 3, total: 3 });
  });
});
