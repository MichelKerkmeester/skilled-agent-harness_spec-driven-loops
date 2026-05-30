import { createRequire } from 'node:module';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { uniqueNamespace, cleanupNamespace } from '../helpers/spawn-cjs';

const require = createRequire(import.meta.url);
const { runSalvageSweep, extractTextFromOpencodeJson } = require('../../scripts/fanout-salvage.cjs') as {
  runSalvageSweep: (lineageDir: string, loopType: 'research' | 'review', savedStdout: string) => { salvaged: number; failed: number };
  extractTextFromOpencodeJson: (stdout: string | null) => string | null;
};

const tempDirs: string[] = [];

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

/**
 * Creates a minimal lineage dir with a state log containing N iteration records.
 * Optionally creates the iteration .md files.
 */
function makeLineageDir(
  base: string,
  loopType: 'research' | 'review',
  iterationsInLog: number[],
  writtenIterations: number[] = [],
): string {
  const stateLogName = loopType === 'review' ? 'deep-review-state.jsonl' : 'deep-research-state.jsonl';
  const stateLogPath = join(base, stateLogName);
  const iterDir = join(base, 'iterations');
  mkdirSync(iterDir, { recursive: true });

  const lines = iterationsInLog.map((n) =>
    JSON.stringify({ type: 'iteration', iteration: n, newInfoRatio: 0.5, status: 'ok', focus: 'test' }),
  );
  writeFileSync(stateLogPath, lines.join('\n') + '\n', 'utf8');

  for (const n of writtenIterations) {
    writeFileSync(join(iterDir, `iteration-${n}.md`), `# Iteration ${n}\n\nContent here.`, 'utf8');
  }

  return base;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('extractTextFromOpencodeJson', () => {
  it('returns null for empty or null input', () => {
    expect(extractTextFromOpencodeJson(null)).toBeNull();
    expect(extractTextFromOpencodeJson('')).toBeNull();
    expect(extractTextFromOpencodeJson('   ')).toBeNull();
  });

  it('concatenates opencode --format json text parts', () => {
    const lines = [
      JSON.stringify({ type: 'text', part: { text: 'Hello ' } }),
      JSON.stringify({ type: 'text', part: { text: 'World' } }),
    ].join('\n');
    expect(extractTextFromOpencodeJson(lines)).toBe('Hello World');
  });

  it('falls back to raw stdout when no JSON text parts are found', () => {
    const raw = 'This is a long enough raw output string to be recoverable';
    expect(extractTextFromOpencodeJson(raw)).toBe(raw);
  });

  it('returns null for raw stdout under 50 characters', () => {
    expect(extractTextFromOpencodeJson('short')).toBeNull();
  });

  it('skips non-text JSON lines', () => {
    const lines = [
      JSON.stringify({ type: 'tool_use', name: 'bash' }),
      JSON.stringify({ type: 'text', part: { text: 'recovered content here' } }),
    ].join('\n');
    expect(extractTextFromOpencodeJson(lines)).toBe('recovered content here');
  });
});

describe('runSalvageSweep — unit', () => {
  it('returns zero counts when there is no state log', () => {
    const dir = makeTempDir('salvage-no-log-');
    const result = runSalvageSweep(dir, 'research', 'some stdout');
    expect(result).toEqual({ salvaged: 0, failed: 0 });
  });

  it('returns zero counts when all iteration files are already present', () => {
    const dir = makeTempDir('salvage-all-present-');
    makeLineageDir(dir, 'research', [1, 2, 3], [1, 2, 3]);
    const result = runSalvageSweep(dir, 'research', 'some stdout');
    expect(result).toEqual({ salvaged: 0, failed: 0 });
  });

  it('salvages a missing iteration file from recoverable opencode stdout', () => {
    const dir = makeTempDir('salvage-opencode-');
    makeLineageDir(dir, 'research', [1, 2], [1]); // iteration-2 is missing

    const stdout = [
      JSON.stringify({ type: 'text', part: { text: '# Iteration 2 research findings\n\n- Finding A\n- Finding B' } }),
    ].join('\n');

    const result = runSalvageSweep(dir, 'research', stdout);
    expect(result.salvaged).toBe(1);
    expect(result.failed).toBe(0);

    // Iteration file should now exist and contain the recovered text
    const iterFile = join(dir, 'iterations', 'iteration-2.md');
    expect(existsSync(iterFile)).toBe(true);
    expect(readFileSync(iterFile, 'utf8')).toContain('Finding A');

    // State log should have salvaged_from_stdout event
    const stateLog = readFileSync(join(dir, 'deep-research-state.jsonl'), 'utf8');
    expect(stateLog).toContain('salvaged_from_stdout');
    expect(stateLog).toContain('"iteration":2');
  });

  it('writes a failed marker when stdout has no recoverable content', () => {
    const dir = makeTempDir('salvage-no-recover-');
    makeLineageDir(dir, 'review', [1], []); // iteration-1 is missing, no recoverable stdout

    const result = runSalvageSweep(dir, 'review', 'hi'); // too short to recover
    expect(result.salvaged).toBe(0);
    expect(result.failed).toBe(1);

    const iterFile = join(dir, 'iterations', 'iteration-1.md');
    expect(existsSync(iterFile)).toBe(true);
    expect(readFileSync(iterFile, 'utf8')).toContain('fanout_salvage_failed');
  });

  it('salvages missing iteration and leaves present ones untouched (mixed case)', () => {
    const dir = makeTempDir('salvage-mixed-');
    makeLineageDir(dir, 'research', [1, 2, 3], [1, 3]); // iteration-2 missing

    const stdout = Array.from({ length: 60 }).map(() => 'x').join(''); // raw fallback, > 50 chars
    const result = runSalvageSweep(dir, 'research', stdout);

    expect(result.salvaged).toBe(1);
    expect(result.failed).toBe(0);

    // iteration-1 and iteration-3 are unchanged
    expect(readFileSync(join(dir, 'iterations', 'iteration-1.md'), 'utf8')).toContain('Content here');
    expect(readFileSync(join(dir, 'iterations', 'iteration-3.md'), 'utf8')).toContain('Content here');

    // iteration-2 now exists
    expect(existsSync(join(dir, 'iterations', 'iteration-2.md'))).toBe(true);
  });
});

describe('coverage-graph per-sessionId isolation', () => {
  it('two lineages with distinct session_ids do not collide in the shared sqlite', async () => {
    const nsA = uniqueNamespace('upsert', 'research');
    const nsB = { ...uniqueNamespace('upsert', 'research'), specFolder: nsA.specFolder }; // same spec, different session

    try {
      const db = await import('../../lib/coverage-graph/coverage-graph-db.js');

      // Insert a node for lineage A
      db.upsertNode({
        specFolder: nsA.specFolder,
        loopType: nsA.loopType,
        sessionId: nsA.sessionId,
        id: 'node-a',
        kind: 'CLAIM',
        name: 'lineage A finding',
      });

      // Insert a node for lineage B (same spec folder, different session)
      db.upsertNode({
        specFolder: nsB.specFolder,
        loopType: nsB.loopType,
        sessionId: nsB.sessionId,
        id: 'node-b',
        kind: 'CLAIM',
        name: 'lineage B finding',
      });

      // Each session sees only its own nodes — this is the per-lineage isolation guarantee
      const nodesA = db.getNodes({ specFolder: nsA.specFolder, loopType: nsA.loopType, sessionId: nsA.sessionId });
      const nodesB = db.getNodes({ specFolder: nsB.specFolder, loopType: nsB.loopType, sessionId: nsB.sessionId });

      expect(nodesA.map((n: { id: string }) => n.id)).toEqual(['node-a']);
      expect(nodesB.map((n: { id: string }) => n.id)).toEqual(['node-b']);

      db.closeDb();
    } finally {
      await cleanupNamespace(nsA);
      await cleanupNamespace(nsB);
    }
  });
});
