import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { afterEach, describe, expect, it } from 'vitest';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const generatorPath = path.resolve(testDir, '..', 'spec-folder', 'generate-description.ts');
const tsxLoader = path.resolve(testDir, '..', 'node_modules', 'tsx', 'dist', 'loader.mjs');
const createdRoots = new Set<string>();

function runGenerator(identitySafety: string): Record<string, unknown> {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'generate-description-identity-'));
  createdRoots.add(repoRoot);
  const trackRoot = path.join(repoRoot, '.opencode', 'specs', 'system-spec-kit');
  const specFolder = path.join(trackRoot, '001-explicit-description');
  fs.mkdirSync(specFolder, { recursive: true });

  const result = spawnSync(process.execPath, [
    '--import',
    tsxLoader,
    generatorPath,
    specFolder,
    trackRoot,
    '--description',
    'Explicit CLI description',
  ], {
    encoding: 'utf-8',
    env: {
      ...process.env,
      SPECKIT_IDENTITY_MERGE_SAFETY: identitySafety,
    },
  });
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(fs.readFileSync(path.join(specFolder, 'description.json'), 'utf-8')) as Record<string, unknown>;
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('generate-description explicit identity safety', () => {
  it('restores caller-base identity when the safety flag is disabled', () => {
    const description = runGenerator('false');
    expect(description.specFolder).toBe('001-explicit-description');
    expect(description.parentChain).toEqual([]);
  });

  it('uses specs-root identity when the safety flag is enabled', () => {
    const description = runGenerator('true');
    expect(description.specFolder).toBe('system-spec-kit/001-explicit-description');
    expect(description.parentChain).toEqual(['system-spec-kit']);
  });
});
