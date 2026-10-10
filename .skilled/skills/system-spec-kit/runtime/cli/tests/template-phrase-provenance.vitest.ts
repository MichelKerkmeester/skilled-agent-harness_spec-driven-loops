// ───────────────────────────────────────────────────────────────────
// MODULE: Template Phrase Provenance Tests
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, '../../..');
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../../..');
const CLEANUP_SCRIPT = path.join(PACKAGE_ROOT, 'runtime/cli/spec/template-phrase-cleanup.mjs');
const SEEDED_DESCRIPTION = 'This packet demonstrates a custom description seed with enough words to show truncation.';
const SEEDED_CUT_OFF = '  - "this packet demonstrates a custom description seed with"';
const SEEDED_TRIMMED = '  - "this packet demonstrates a custom description seed"';
const AUTHORED_PHRASE = 'two of the four rules that fire on';
const TEMP_ROOTS = new Set<string>();

function createSpecsRoot(): string {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'template-phrase-provenance-'));
  TEMP_ROOTS.add(temporaryDirectory);
  const specsRoot = path.join(temporaryDirectory, 'specs');
  fs.mkdirSync(specsRoot, { recursive: true });
  return specsRoot;
}

function writeSpec(specsRoot: string, packetPath: string, rows: string[], description: string): string {
  const packetDirectory = path.join(specsRoot, packetPath);
  fs.mkdirSync(packetDirectory, { recursive: true });
  const file = path.join(packetDirectory, 'spec.md');
  fs.writeFileSync(file, [
    '---',
    'title: "Temporary fixture"',
    `description: ${JSON.stringify(description)}`,
    'trigger_phrases:',
    ...rows,
    'importance_tier: "normal"',
    '---',
    '',
    '# Temporary fixture',
    '',
  ].join('\n'), 'utf8');
  return file;
}

function runCleanup(specsRoot: string, extraArgs: string[]): { status: number | null; stdout: string } {
  const result = spawnSync(process.execPath, [CLEANUP_SCRIPT, '--root', specsRoot, ...extraArgs], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout };
}

function readTriggerPhrases(file: string): string[] {
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => /^\s+- (".*")\s*$/.exec(line)?.[1])
    .filter((value): value is string => value !== undefined)
    .map((value) => JSON.parse(value) as string);
}

afterEach(() => {
  for (const root of TEMP_ROOTS) fs.rmSync(root, { recursive: true, force: true });
  TEMP_ROOTS.clear();
});

describe('template phrase provenance', () => {
  it('trims only the seeded phrase and leaves an authored eight-word phrase with the same shape', () => {
    const specsRoot = createSpecsRoot();
    const specFile = writeSpec(specsRoot, 'track-a/001-sample-packet', [
      '  - "sample packet"',
      `  - "${AUTHORED_PHRASE}"`,
      SEEDED_CUT_OFF,
    ], SEEDED_DESCRIPTION);
    const before = fs.readFileSync(specFile, 'utf8');

    const dryRun = runCleanup(specsRoot, ['--json']);
    expect(dryRun.status).toBe(1);
    const report = JSON.parse(dryRun.stdout) as { changes: Array<{ oldBlocks: string[] }> };
    expect(report.changes).toHaveLength(1);
    expect(report.changes[0].oldBlocks.join('\n')).not.toContain(AUTHORED_PHRASE);

    const applied = runCleanup(specsRoot, ['--apply']);
    expect(applied.status).toBe(1);
    expect(fs.readFileSync(specFile, 'utf8')).toBe(before.replace(SEEDED_CUT_OFF, SEEDED_TRIMMED));
    expect(readTriggerPhrases(specFile)).toEqual([
      'sample packet',
      AUTHORED_PHRASE,
      'this packet demonstrates a custom description seed',
    ]);
  });

  it('trims a seeded phrase whose source is the description.json identity rather than the frontmatter', () => {
    const specsRoot = createSpecsRoot();
    const specFile = writeSpec(specsRoot, 'track-a/001-sample-packet', [
      '  - "sample packet"',
      SEEDED_CUT_OFF,
    ], 'A short fixture description for the packet.');
    fs.writeFileSync(
      path.join(path.dirname(specFile), 'description.json'),
      JSON.stringify({ description: SEEDED_DESCRIPTION }),
      'utf8',
    );

    const applied = runCleanup(specsRoot, ['--apply']);
    expect(applied.status).toBe(1);
    expect(readTriggerPhrases(specFile)).toEqual([
      'sample packet',
      'this packet demonstrates a custom description seed',
    ]);
  });
});
