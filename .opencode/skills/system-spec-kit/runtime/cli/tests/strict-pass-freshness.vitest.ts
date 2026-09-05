// ---------------------------------------------------------------
// MODULE: Strict Pass Freshness Sweep Tests
// ---------------------------------------------------------------
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptsRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(scriptsRoot, '..', '..', '..', '..');
const sweepScript = path.join(scriptsRoot, 'sweep', 'strict-pass-freshness.ts');
const tsxLoader = path.join(scriptsRoot, 'node_modules', 'tsx', 'dist', 'loader.mjs');
const createdRoots = new Set<string>();

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function makeWorkspace(): string {
  const scratchRoot = path.join(repoRoot, 'scratch');
  fs.mkdirSync(scratchRoot, { recursive: true });
  const workspace = fs.mkdtempSync(path.join(scratchRoot, 'strict-pass-freshness-'));
  createdRoots.add(workspace);
  return workspace;
}

function createCompletionFolder(workspace: string, name: string): string {
  const folder = path.join(workspace, '.opencode', 'specs', name);
  writeFile(path.join(folder, 'implementation-summary.md'), [
    '# Implementation Summary',
    '| Field | Value |',
    '|-------|-------|',
    '| **Status** | Complete |',
  ].join('\n'));
  return folder;
}

function createValidator(workspace: string, failingFolderName: string): string {
  const validator = path.join(workspace, 'validate-fixture.sh');
  writeFile(validator, [
    '#!/usr/bin/env bash',
    'if [[ "$1" == *"/' + failingFolderName + '" ]]; then',
    '  printf \'{"passed":false,"summary":{"errors":1,"warnings":0}}\\n\'',
    '  exit 2',
    'fi',
    'printf \'{"passed":true,"summary":{"errors":0,"warnings":0}}\\n\'',
  ].join('\n'));
  fs.chmodSync(validator, 0o755);
  return validator;
}

function runSweep(specsRoot: string, baselinePath: string, validator: string) {
  return spawnSync('node', [
    '--import',
    tsxLoader,
    sweepScript,
    '--roots',
    specsRoot,
    '--baseline',
    baselinePath,
    '--format',
    'json',
  ], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, SPECKIT_VALIDATE_SCRIPT: validator },
  });
}

afterEach(() => {
  for (const root of createdRoots) fs.rmSync(root, { recursive: true, force: true });
  createdRoots.clear();
});

describe('strict-pass freshness baseline handling', () => {
  it('rejects a repository-local root symlink that resolves outside the repository', () => {
    const workspace = makeWorkspace();
    const outsideWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), 'strict-pass-external-'));
    createdRoots.add(outsideWorkspace);
    const outsideSpecsRoot = path.join(outsideWorkspace, '.opencode', 'specs');
    createCompletionFolder(outsideWorkspace, 'external-complete');
    const symlinkRoot = path.join(workspace, 'linked-specs');
    fs.symlinkSync(outsideSpecsRoot, symlinkRoot, 'dir');
    const baselinePath = path.join(workspace, 'baseline.json');
    writeFile(baselinePath, JSON.stringify({ results: [] }));

    const result = runSweep(symlinkRoot, baselinePath, createValidator(workspace, 'never-fails'));

    expect(result.status).toBe(2);
    expect(result.stderr).toContain('Root escapes repository');
  });

  it('fails a current failure omitted from a partial baseline', () => {
    const workspace = makeWorkspace();
    const specsRoot = path.join(workspace, '.opencode', 'specs');
    const passingFolder = createCompletionFolder(workspace, 'prior-pass');
    const failingFolder = createCompletionFolder(workspace, 'current-failure');
    const baselinePath = path.join(workspace, 'baseline.json');
    writeFile(baselinePath, JSON.stringify({
      results: [{ folder: path.relative(repoRoot, passingFolder), status: 'pass' }],
    }));

    const result = runSweep(specsRoot, baselinePath, createValidator(workspace, 'current-failure'));
    const payload = JSON.parse(result.stdout);
    const failure = payload.results.find((entry: { folder: string }) => (
      entry.folder === path.relative(repoRoot, failingFolder)
    ));

    expect(result.status).toBe(1);
    expect(payload.newFailures).toBe(1);
    expect(payload.regressions).toBe(0);
    expect(failure.status).toBe('new-failure');
  });

  it('treats an empty loaded baseline as real baseline content', () => {
    const workspace = makeWorkspace();
    const specsRoot = path.join(workspace, '.opencode', 'specs');
    const failingFolder = createCompletionFolder(workspace, 'current-failure');
    const baselinePath = path.join(workspace, 'baseline.json');
    writeFile(baselinePath, JSON.stringify({ results: [] }));

    const result = runSweep(specsRoot, baselinePath, createValidator(workspace, 'current-failure'));
    const payload = JSON.parse(result.stdout);
    const failure = payload.results.find((entry: { folder: string }) => (
      entry.folder === path.relative(repoRoot, failingFolder)
    ));

    expect(result.status).toBe(1);
    expect(payload.newFailures).toBe(1);
    expect(payload.firstRun).toBe(0);
    expect(failure.status).toBe('new-failure');
  });
});
