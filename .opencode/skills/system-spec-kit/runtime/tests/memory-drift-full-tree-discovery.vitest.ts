// ───────────────────────────────────────────────────────────────
// TEST: Memory drift full-tree discovery determinism
// ───────────────────────────────────────────────────────────────
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  findGraphMetadataFiles,
  findSpecDocuments,
} from '../handlers/memory-index-discovery';

const tempRoots: string[] = [];

function createFixtureRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-full-tree-'));
  tempRoots.push(root);
  return root;
}

function discoverRelativePaths(root: string): string {
  const paths = [
    ...findSpecDocuments(root),
    ...findGraphMetadataFiles(root),
  ].map((filePath) => path.relative(root, filePath).split(path.sep).join('/')).sort();
  return JSON.stringify(paths);
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('memory drift full-tree discovery', () => {
  it('returns the exact same discovered path bytes across repeated real-tree scans', () => {
    const root = createFixtureRoot();
    const firstLeaf = path.join(root, '.opencode', 'specs', 'track', '001-first');
    const secondLeaf = path.join(root, '.opencode', 'specs', 'track', '002-second');
    fs.mkdirSync(firstLeaf, { recursive: true });
    fs.mkdirSync(secondLeaf, { recursive: true });
    fs.writeFileSync(path.join(firstLeaf, 'spec.md'), '# First');
    fs.writeFileSync(path.join(firstLeaf, 'plan.md'), '# Plan');
    fs.writeFileSync(path.join(firstLeaf, 'graph-metadata.json'), '{"packet_id":"001-first"}');
    fs.writeFileSync(path.join(firstLeaf, 'notes.txt'), 'ignored');
    fs.writeFileSync(path.join(secondLeaf, 'implementation-summary.md'), '# Summary');
    fs.writeFileSync(path.join(secondLeaf, 'graph-metadata.json'), '{"packet_id":"002-second"}');

    const firstRun = discoverRelativePaths(root);
    const secondRun = discoverRelativePaths(root);

    expect(firstRun).toBe(secondRun);
    expect(firstRun).toBe(JSON.stringify([
      '.opencode/specs/track/001-first/graph-metadata.json',
      '.opencode/specs/track/001-first/plan.md',
      '.opencode/specs/track/001-first/spec.md',
      '.opencode/specs/track/002-second/graph-metadata.json',
      '.opencode/specs/track/002-second/implementation-summary.md',
    ]));
  });
});
