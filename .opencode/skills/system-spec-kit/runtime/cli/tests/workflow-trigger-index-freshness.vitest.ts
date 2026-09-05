// ───────────────────────────────────────────────────────────────────
// MODULE: Save-Time Trigger-Index Freshness Tests
// ───────────────────────────────────────────────────────────────────
// A completed canonical save must report whether the committed trigger
// index reflects the packet's current trigger_phrases instead of only
// logging a manual-regeneration reminder. These tests exercise the
// comparison directly (checkTriggerIndexFreshness) against a disposable
// fixture index rather than the real committed one, so the assertions
// never drift as the real corpus and index are regenerated elsewhere.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { checkTriggerIndexFreshness } from '../core/workflow';

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
// scripts/tests -> scripts -> system-spec-kit -> skills -> .opencode -> repo root.
// Mirrors checkTriggerIndexFreshness's own repoRoot derivation so a fixture
// spec.md written under scripts/tests/fixtures resolves to the same
// repo-relative path the function computes internally.
const REPO_ROOT = path.resolve(THIS_DIR, '..', '..', '..', '..', '..');
// Already excluded from the real trigger-index corpus walk (any directory
// named "fixtures" outside specs/ is pruned), so a fixture left behind by a
// failed cleanup can never leak into the committed index.
const FIXTURES_ROOT = path.join(THIS_DIR, 'fixtures');

const fixtureDirs: string[] = [];

function makeFixtureSpecFolder(): string {
  const dir = fs.mkdtempSync(path.join(FIXTURES_ROOT, 'trigger-freshness-'));
  fixtureDirs.push(dir);
  return dir;
}

function toRepoRelativePath(absolutePath: string): string {
  return path.relative(REPO_ROOT, absolutePath).split(path.sep).join('/');
}

function writeSpecDoc(specFolderPath: string, triggerPhrases: string[]): void {
  const lines = ['---', 'title: "Trigger-index freshness fixture"'];
  if (triggerPhrases.length > 0) {
    lines.push('trigger_phrases:', ...triggerPhrases.map((phrase) => `  - "${phrase}"`));
  } else {
    lines.push('trigger_phrases: []');
  }
  lines.push('---', '# Fixture', '');
  fs.writeFileSync(path.join(specFolderPath, 'spec.md'), lines.join('\n'), 'utf8');
}

/** Writes a minimal, schema-valid trigger-index fixture recording `indexedPhrases` against spec.md's own path. */
function writeFixtureIndex(specFolderPath: string, indexedPhrases: string[]): string {
  const documentPath = toRepoRelativePath(path.join(specFolderPath, 'spec.md'));
  const indexPath = path.join(specFolderPath, 'trigger-index.fixture.json');
  fs.writeFileSync(indexPath, JSON.stringify({
    schemaVersion: 2,
    normalization: { case: 'lower' },
    manifestHash: 'fixture',
    paths: [documentPath],
    phrases: Object.fromEntries(indexedPhrases.map((phrase) => [phrase, [0]])),
  }), 'utf8');
  return indexPath;
}

afterEach(() => {
  while (fixtureDirs.length > 0) {
    const dir = fixtureDirs.pop();
    if (dir) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('checkTriggerIndexFreshness', () => {
  it('reports fresh when spec.md declares exactly what the committed index records for it', async () => {
    const specFolderPath = makeFixtureSpecFolder();
    writeSpecDoc(specFolderPath, ['alpha phrase', 'beta phrase']);
    const indexPath = writeFixtureIndex(specFolderPath, ['alpha phrase', 'beta phrase']);

    const result = await checkTriggerIndexFreshness(specFolderPath, { indexPath });

    expect(result.status).toBe('fresh');
  });

  it('reports stale when a trigger phrase was added since the index was last generated', async () => {
    const specFolderPath = makeFixtureSpecFolder();
    writeSpecDoc(specFolderPath, ['alpha phrase', 'gamma phrase']);
    const indexPath = writeFixtureIndex(specFolderPath, ['alpha phrase']);

    const result = await checkTriggerIndexFreshness(specFolderPath, { indexPath });

    expect(result.status).toBe('stale');
    expect(result.added).toEqual(['gamma phrase']);
    expect(result.removed).toEqual([]);
  });

  it('reports stale when a trigger phrase was removed since the index was last generated', async () => {
    const specFolderPath = makeFixtureSpecFolder();
    writeSpecDoc(specFolderPath, ['alpha phrase']);
    const indexPath = writeFixtureIndex(specFolderPath, ['alpha phrase', 'beta phrase']);

    const result = await checkTriggerIndexFreshness(specFolderPath, { indexPath });

    expect(result.status).toBe('stale');
    expect(result.added).toEqual([]);
    expect(result.removed).toEqual(['beta phrase']);
  });

  it('reports stale on a one-word change even when the phrase count is unchanged (set-equality, not a fuzzy diff)', async () => {
    const specFolderPath = makeFixtureSpecFolder();
    writeSpecDoc(specFolderPath, ['alpha phrase changed']);
    const indexPath = writeFixtureIndex(specFolderPath, ['alpha phrase']);

    const result = await checkTriggerIndexFreshness(specFolderPath, { indexPath });

    expect(result.status).toBe('stale');
  });

  it('reports no-phrases when spec.md declares an empty trigger_phrases list', async () => {
    const specFolderPath = makeFixtureSpecFolder();
    writeSpecDoc(specFolderPath, []);

    // No fixture index needed: an empty declaration returns before the index is read.
    const result = await checkTriggerIndexFreshness(specFolderPath);

    expect(result.status).toBe('no-phrases');
  });

  it('degrades to unavailable instead of throwing when spec.md is missing', async () => {
    const specFolderPath = makeFixtureSpecFolder();

    const result = await checkTriggerIndexFreshness(specFolderPath);

    expect(result.status).toBe('unavailable');
  });

  it('degrades to unavailable instead of throwing when the index fails to parse', async () => {
    const specFolderPath = makeFixtureSpecFolder();
    writeSpecDoc(specFolderPath, ['alpha phrase']);
    const indexPath = path.join(specFolderPath, 'trigger-index.fixture.json');
    fs.writeFileSync(indexPath, '{ not valid json', 'utf8');

    const result = await checkTriggerIndexFreshness(specFolderPath, { indexPath });

    expect(result.status).toBe('unavailable');
  });
});
