import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { CORPUS_ROOTS, walkCorpus } from '../retrieval/lib/corpus.mjs';
import { DEFAULT_REPO_ROOT, findRepoRoot } from '../retrieval/generate-trigger-index.mjs';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));

/**
 * Derives the repository root independently of the generator: walks up from
 * this test until a git checkout appears. The generator may not share this
 * anchor, or the two would agree by construction instead of by correctness.
 */
function gitRootFrom(start: string): string {
  let directory = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(directory, '.git'))) return directory;
    const parent = path.dirname(directory);
    if (parent === directory) throw new Error(`no git checkout above ${start}`);
    directory = parent;
  }
}

describe('DEFAULT_REPO_ROOT', () => {
  it('resolves to the repository root, not the .opencode directory', () => {
    expect(path.basename(DEFAULT_REPO_ROOT)).not.toBe('.opencode');
    expect(DEFAULT_REPO_ROOT).toBe(gitRootFrom(TEST_DIR));
    expect(fs.existsSync(path.join(DEFAULT_REPO_ROOT, 'specs'))).toBe(true);
    expect(fs.existsSync(path.join(DEFAULT_REPO_ROOT, '.opencode', 'skills'))).toBe(true);
  });

  it('walks up from any directory inside the skill tree to the same root', () => {
    expect(findRepoRoot(TEST_DIR)).toBe(DEFAULT_REPO_ROOT);
    expect(findRepoRoot(path.join(DEFAULT_REPO_ROOT, '.opencode', 'skills', 'system-spec-kit', 'runtime'))).toBe(DEFAULT_REPO_ROOT);
  });
});

describe('walkCorpus over the real repository', () => {
  it('yields documents under every corpus root', () => {
    const { files } = walkCorpus(DEFAULT_REPO_ROOT);
    for (const root of CORPUS_ROOTS) {
      const count = files.filter((file) => file === root || file.startsWith(`${root}/`)).length;
      expect(count, `corpus root "${root}" contributed no documents`).toBeGreaterThan(0);
    }
  });
});
