import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { CORPUS_ROOTS, corpusRootsFor, walkCorpus } from '../retrieval/lib/corpus.mjs';
import { DEFAULT_REPO_ROOT, buildIndex, findRepoRoot } from '../retrieval/generate-trigger-index.mjs';

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
  it('resolves to the repository root, not the .skilled directory', () => {
    expect(path.basename(DEFAULT_REPO_ROOT)).not.toBe('.skilled');
    expect(DEFAULT_REPO_ROOT).toBe(gitRootFrom(TEST_DIR));
    expect(fs.existsSync(path.join(DEFAULT_REPO_ROOT, 'specs'))).toBe(true);
    expect(fs.existsSync(path.join(DEFAULT_REPO_ROOT, '.skilled', 'skills'))).toBe(true);
  });

  it('walks up from any directory inside the skill tree to the same root', () => {
    expect(findRepoRoot(TEST_DIR)).toBe(DEFAULT_REPO_ROOT);
    expect(findRepoRoot(path.join(DEFAULT_REPO_ROOT, '.skilled', 'skills', 'system-spec-kit', 'runtime'))).toBe(DEFAULT_REPO_ROOT);
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

describe('corpus roots follow the source root a checkout carries', () => {
  function checkout(sourceName: string | null): string {
    const repo = fs.mkdtempSync(path.join(fs.realpathSync(tmpdir()), 'retrieval-corpus-roots-'));
    fs.mkdirSync(path.join(repo, 'specs', 'demo'), { recursive: true });
    fs.writeFileSync(path.join(repo, 'specs', 'demo', 'spec.md'), '---\ntrigger_phrases:\n  - "demo spec"\n---\n# Demo\n');
    if (sourceName) {
      const skill = path.join(repo, sourceName, 'skills', 'system-spec-kit');
      fs.mkdirSync(skill, { recursive: true });
      fs.writeFileSync(path.join(skill, 'SKILL.md'), '---\ntrigger_phrases:\n  - "demo skill"\n---\n# Skill\n');
    }
    return repo;
  }

  it('spells the roots under .opencode when that is the only source root', () => {
    const repo = checkout('.opencode');
    try {
      expect(corpusRootsFor(repo)).toEqual(['specs', '.opencode/skills', '.opencode/hooks']);
      expect(walkCorpus(repo).files).toContain('.opencode/skills/system-spec-kit/SKILL.md');
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  it('keeps the canonical spelling where .skilled carries the tree', () => {
    const repo = checkout('.skilled');
    try {
      expect(corpusRootsFor(repo)).toEqual([...CORPUS_ROOTS]);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  it('refuses to build an index when no source root carries the sentinel', () => {
    const repo = checkout(null);
    try {
      expect(() => buildIndex({ repoRoot: repo })).toThrow(/no source tree/u);
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });
});
