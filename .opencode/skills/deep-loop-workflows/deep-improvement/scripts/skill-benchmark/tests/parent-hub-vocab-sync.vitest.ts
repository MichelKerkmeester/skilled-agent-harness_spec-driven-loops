import { describe, it, expect, afterAll } from 'vitest';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const BENCHMARK_ROOT = resolve(__dirname, '..');
const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const SKDESIGN = join(REPO_SKILLS, 'sk-design');
const { checkVocabSync } = require(join(BENCHMARK_ROOT, 'parent-hub-vocab-sync.cjs'));

const tempRoots: string[] = [];

function syntheticFamily(): string {
  const tempRoot = mkdtempSync(join(tmpdir(), 'parent-hub-vocab-sync-'));
  tempRoots.push(tempRoot);
  cpSync(SKDESIGN, tempRoot, { recursive: true });
  return tempRoot;
}

function readJson(filePath: string): any {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

describe('parent-hub vocab sync — classified projection vs family copies', () => {
  afterAll(() => {
    for (const root of tempRoots) rmSync(root, { recursive: true, force: true });
  });

  it('keeps the live design family clean on hard vocabulary drift', () => {
    const result = checkVocabSync({ skillRoot: SKDESIGN });

    expect(result.familyPresent).toBe(true);
    expect(result.projectionParsed).toBe(true);
    expect(result.typedKeywordCount).toBeGreaterThan(50);
    expect(result.orphanAliases).toEqual([]);
    expect(result.aliasCollisions).toEqual([]);
    expect(result.ownershipDrift).toEqual([]);
    expect(result.driftDetected).toBe(false);
    expect(result.verdict).toBeNull();
    expect(typeof result.untypedKeywordRate).toBe('number');
    expect(result.triggerPhraseCoverage).toBeGreaterThan(0);
  });

  it('detects a registry alias that is missing from the typed hub vocabulary', () => {
    const root = syntheticFamily();
    const registryPath = join(root, 'mode-registry.json');
    const registry = readJson(registryPath);
    registry.modes[0].aliases.push('orphan interface alias');
    writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');

    const result = checkVocabSync({ skillRoot: root });

    expect(result.driftDetected).toBe(true);
    expect(result.verdict).toBe('VOCAB-DRIFT');
    expect(result.orphanAliases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mode: 'interface',
          phrase: 'orphan interface alias',
          normalized: 'orphan interface alias',
        }),
      ]),
    );
  });

  it('passes benignly for a non-registry skill root', () => {
    const root = mkdtempSync(join(tmpdir(), 'parent-hub-vocab-empty-'));
    tempRoots.push(root);

    const result = checkVocabSync({ skillRoot: root });

    expect(result.familyPresent).toBe(false);
    expect(result.driftDetected).toBe(false);
    expect(result.verdict).toBeNull();
  });
});
