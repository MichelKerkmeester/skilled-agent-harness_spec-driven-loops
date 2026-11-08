// ───────────────────────────────────────────────────────────────────
// MODULE: Side-Effect Proof
// ───────────────────────────────────────────────────────────────────
// Every reader runs against a real fixture store. The proof is a before-and-
// after hash, size and mtime of all seven store artifacts plus a full listing,
// so a write, a queue file or a stray WAL file shows up as a diff.

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { readSession } from '../../session-readers/index.mjs';
import { DECOY, presentStores, SESSION } from './fixtures.mjs';
import { withTempAsync } from './helpers.mjs';

function snapshotStore(filePath) {
  const stats = statSync(filePath);
  return {
    digest: createHash('sha256').update(readFileSync(filePath)).digest('hex'),
    size: stats.size,
    mtimeMs: stats.mtimeMs,
  };
}

function listTree(directory) {
  const paths = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);
    paths.push(entryPath);
    if (entry.isDirectory()) paths.push(...listTree(entryPath));
  }
  return paths.sort();
}

test('all seven stores keep their bytes, sizes and mtimes after every reader runs', async () => {
  await withTempAsync('side-effects', async (root) => {
    const projectDir = join(root, 'project');
    const { mkdirSync } = await import('node:fs');
    mkdirSync(projectDir, { recursive: true });

    const world = presentStores({ root, projectDir });
    const before = world.storePaths.map(snapshotStore);
    const treeBefore = listTree(root);

    const results = await Promise.all([
      readSession({ runtime: 'claude', sessionId: SESSION, ...world.claude.options }),
      readSession({ runtime: 'codex', sessionId: SESSION, ...world.codex.options }),
      readSession({ runtime: 'pi', sessionId: SESSION, ...world.pi.options }),
      readSession({ runtime: 'opencode', sessionId: SESSION, ...world.opencode.options }),
      readSession({ runtime: 'devin', sessionId: SESSION, ...world.devin.options }),
      readSession({ runtime: 'dsh', sessionId: SESSION, ...world.dsh.options }),
      readSession({ runtime: 'cursor', sessionId: DECOY, env: {}, config: {} }),
    ]);

    for (const result of results.slice(0, 6)) {
      assert.equal(result.ok, true, `reader failed: ${result.code}`);
    }
    assert.equal(results[6].ok, false);
    assert.equal(results[6].code, 'capability_gated');

    const after = world.storePaths.map(snapshotStore);
    assert.deepEqual(after, before);
    assert.deepEqual(listTree(root), treeBefore);

    console.log(`stores unchanged: ${before.length}`);
    assert.equal(before.length, 7);
  });
});
