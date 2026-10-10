// ───────────────────────────────────────────────────────────────────
// MODULE: Template Phrase Cleanup Tests
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
const TEMPLATES_ROOT = path.join(PACKAGE_ROOT, 'templates');
const CENSUS_SCRIPT = path.join(PACKAGE_ROOT, 'runtime/cli/spec/template-phrase-census.mjs');
const CLEANUP_SCRIPT = path.join(PACKAGE_ROOT, 'runtime/cli/spec/template-phrase-cleanup.mjs');
const TEMP_ROOTS = new Set<string>();

function readTemplateRows(relativePath: string): string[] {
  const lines = fs.readFileSync(path.join(TEMPLATES_ROOT, relativePath), 'utf8').split(/\r?\n/);
  const openingIndex = lines.findIndex((line) => line.trim() === '---');
  const closingIndex = lines.findIndex((line, index) => index > openingIndex && line.trim() === '---');
  const keyIndex = lines.findIndex((line, index) => (
    index > openingIndex && index < closingIndex && /^trigger_phrases\s*:\s*$/.test(line)
  ));
  if (openingIndex === -1 || closingIndex === -1 || keyIndex === -1) {
    throw new Error(`Template trigger list is missing: ${relativePath}`);
  }

  const rows: string[] = [];
  for (let index = keyIndex + 1; index < closingIndex; index += 1) {
    if (!/^\s+-\s+/.test(lines[index])) break;
    rows.push(lines[index]);
  }
  if (rows.length === 0) throw new Error(`Template trigger list is empty: ${relativePath}`);
  return rows;
}

const SPEC_ROWS = readTemplateRows('core/spec.md.tmpl');
const ACCEPTANCE_ROWS = readTemplateRows('addons/acceptance-criteria.md.tmpl');
const PLAN_ROWS = readTemplateRows('core/plan.md.tmpl');
const TASK_ROWS = readTemplateRows('core/tasks.md.tmpl');
const SUMMARY_ROWS = readTemplateRows('core/implementation-summary.md.tmpl');

function createSpecsRoot(): string {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'template-phrase-cleanup-'));
  TEMP_ROOTS.add(temporaryDirectory);
  const specsRoot = path.join(temporaryDirectory, 'specs');
  fs.mkdirSync(specsRoot, { recursive: true });
  return specsRoot;
}

function markdownWithRows(
  rows: string[],
  options: { description?: string; extraRows?: string[] } = {},
): string {
  const description = options.description ?? 'A short fixture description for the packet.';
  return [
    '---',
    'title: "Temporary fixture"',
    `description: ${JSON.stringify(description)}`,
    'trigger_phrases:',
    ...rows,
    ...(options.extraRows ?? []),
    'importance_tier: "normal"',
    '---',
    '',
    '# Temporary fixture',
    '',
  ].join('\n');
}

function writeDocument(
  specsRoot: string,
  packetPath: string,
  filename: string,
  rows: string[],
  options: { description?: string; extraRows?: string[] } = {},
): string {
  const packetDirectory = path.join(specsRoot, packetPath);
  fs.mkdirSync(packetDirectory, { recursive: true });
  const file = path.join(packetDirectory, filename);
  fs.writeFileSync(file, markdownWithRows(rows, options), 'utf8');
  return file;
}

function runNode(script: string, args: string[]): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function replacementRows(phrases: string[]): string[] {
  return phrases.map((phrase) => `  - ${JSON.stringify(phrase)}`);
}

function readTriggerPhrases(file: string): string[] {
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => /^\s+- (".*")\s*$/.exec(line)?.[1])
    .filter((value): value is string => value !== undefined)
    .map((value) => JSON.parse(value) as string);
}

function normalizedPhrase(phrase: string): string {
  return phrase
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

afterEach(() => {
  for (const root of TEMP_ROOTS) fs.rmSync(root, { recursive: true, force: true });
  TEMP_ROOTS.clear();
});

describe('template phrase census and cleanup', () => {
  it('counts exact template blocks separately for live and archived packets', () => {
    const specsRoot = createSpecsRoot();
    writeDocument(specsRoot, 'track-a/001-live', 'spec.md', SPEC_ROWS);
    writeDocument(specsRoot, 'track-a/001-live', 'acceptance-criteria.md', ACCEPTANCE_ROWS);
    writeDocument(specsRoot, 'track-a/001-live', 'plan.md', PLAN_ROWS);
    writeDocument(specsRoot, 'track-a/001-live', 'tasks.md', TASK_ROWS);
    writeDocument(specsRoot, 'track-a/001-live', 'implementation-summary.md', SUMMARY_ROWS);
    writeDocument(specsRoot, 'track-a/z_archive/002-old', 'spec.md', SPEC_ROWS);
    writeDocument(specsRoot, 'track-a/z_archive/002-old', 'acceptance-criteria.md', ACCEPTANCE_ROWS);

    const result = runNode(CENSUS_SCRIPT, ['--root', specsRoot, '--json']);
    expect(result.status).toBe(0);
    const report = JSON.parse(result.stdout) as {
      tracks: Record<string, {
        live: { templateBlocks: Record<string, number> };
        archived: { templateBlocks: Record<string, number> };
      }>;
      totals: { templateBlocks: Record<string, number> };
    };

    expect(report.tracks['track-a'].live.templateBlocks).toEqual({
      spec: 1,
      acceptanceCriteria: 1,
      plan: 1,
      tasks: 1,
      implementationSummary: 1,
    });
    expect(report.tracks['track-a'].archived.templateBlocks).toEqual({
      spec: 1,
      acceptanceCriteria: 1,
      plan: 0,
      tasks: 0,
      implementationSummary: 0,
    });
    expect(report.totals.templateBlocks).toEqual({
      spec: 2,
      acceptanceCriteria: 2,
      plan: 1,
      tasks: 1,
      implementationSummary: 1,
    });
  });

  it('counts partial carriers separately from exact template blocks', () => {
    const specsRoot = createSpecsRoot();
    writeDocument(specsRoot, 'track-a/001-mixed', 'spec.md', [
      SPEC_ROWS[0],
      '  - "author phrase"',
      SPEC_ROWS[2],
    ]);
    writeDocument(specsRoot, 'track-a/001-mixed', 'plan.md', [PLAN_ROWS[0], PLAN_ROWS[1]]);
    writeDocument(specsRoot, 'track-a/002-exact', 'spec.md', SPEC_ROWS);
    writeDocument(specsRoot, 'track-a/z_archive/003-partial', 'spec.md', [SPEC_ROWS[1], SPEC_ROWS[3]]);

    const result = runNode(CENSUS_SCRIPT, ['--root', specsRoot, '--json']);
    expect(result.status).toBe(0);
    const report = JSON.parse(result.stdout) as {
      tracks: Record<string, {
        live: { templateBlocks: Record<string, number>; partialCarriers: Record<string, number> };
        archived: { templateBlocks: Record<string, number>; partialCarriers: Record<string, number> };
      }>;
      totals: { templateBlocks: Record<string, number>; partialCarriers: Record<string, number> };
    };

    expect(report.tracks['track-a'].live.templateBlocks.spec).toBe(1);
    expect(report.tracks['track-a'].live.partialCarriers).toEqual({
      spec: 1,
      acceptanceCriteria: 0,
      plan: 1,
      tasks: 0,
      implementationSummary: 0,
    });
    expect(report.tracks['track-a'].archived.partialCarriers).toEqual({
      spec: 1,
      acceptanceCriteria: 0,
      plan: 0,
      tasks: 0,
      implementationSummary: 0,
    });
    expect(report.totals.partialCarriers).toEqual({
      spec: 2,
      acceptanceCriteria: 0,
      plan: 1,
      tasks: 0,
      implementationSummary: 0,
    });
  });

  it('ignores demo and quarantine snapshots under scratch and containment directories', () => {
    const specsRoot = createSpecsRoot();
    writeDocument(specsRoot, 'track-a/001-live', 'spec.md', SPEC_ROWS);
    const scratchFile = writeDocument(specsRoot, 'track-a/scratch/002-demo', 'spec.md', SPEC_ROWS);
    const containmentFile = writeDocument(specsRoot, 'track-a/containment/003-quarantine', 'spec.md', SPEC_ROWS);
    const scratchBefore = fs.readFileSync(scratchFile);
    const containmentBefore = fs.readFileSync(containmentFile);

    const census = runNode(CENSUS_SCRIPT, ['--root', specsRoot, '--json']);
    expect(census.status).toBe(0);
    const report = JSON.parse(census.stdout) as {
      totals: { documents: Record<string, number> };
      tracks: Record<string, { live: { documents: Record<string, number> } }>;
      issues: Array<{ path: string }>;
    };
    expect(report.totals.documents.spec).toBe(1);
    expect(report.tracks['track-a'].live.documents.spec).toBe(1);
    expect(report.issues).toHaveLength(0);

    const cleanup = runNode(CLEANUP_SCRIPT, ['--root', specsRoot]);
    expect(cleanup.status).toBe(1);
    expect(cleanup.stdout).toContain('track-a/001-live/spec.md: would change');
    expect(cleanup.stdout).not.toContain('scratch');
    expect(cleanup.stdout).not.toContain('containment');
    expect(fs.readFileSync(scratchFile)).toEqual(scratchBefore);
    expect(fs.readFileSync(containmentFile)).toEqual(containmentBefore);
  });

  it('keeps dry runs byte-identical and skips archived packets by default', () => {
    const specsRoot = createSpecsRoot();
    const liveFile = writeDocument(specsRoot, 'track-a/001-sample-packet', 'spec.md', SPEC_ROWS, {
      extraRows: ['  - "author phrase"'],
    });
    const archivedFile = writeDocument(specsRoot, 'track-a/z_archive/002-old', 'spec.md', SPEC_ROWS);
    const liveBefore = fs.readFileSync(liveFile);
    const archivedBefore = fs.readFileSync(archivedFile);

    const result = runNode(CLEANUP_SCRIPT, ['--root', specsRoot]);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('track-a/001-sample-packet/spec.md: would change');
    expect(result.stdout).toContain('old block:');
    expect(result.stdout).toContain('new block:');
    expect(result.stdout).not.toContain('z_archive');
    expect(fs.readFileSync(liveFile)).toEqual(liveBefore);
    expect(fs.readFileSync(archivedFile)).toEqual(archivedBefore);

    const includeArchive = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--include-archive']);
    expect(includeArchive.status).toBe(1);
    expect(includeArchive.stdout).toContain('track-a/z_archive/002-old/spec.md: would change');
  });

  it('replaces only the template blocks, preserves author phrases and reports file hashes', () => {
    const specsRoot = createSpecsRoot();
    const description = 'This packet demonstrates a custom description seed with enough words to show truncation.';
    const specFile = writeDocument(specsRoot, 'track-a/001-sample-packet', 'spec.md', SPEC_ROWS, {
      description,
      extraRows: ['  - "author phrase"'],
    });
    const acceptanceFile = writeDocument(specsRoot, 'track-a/001-sample-packet', 'acceptance-criteria.md', ACCEPTANCE_ROWS, {
      description,
      extraRows: ['  - "author phrase"'],
    });
    const specBefore = fs.readFileSync(specFile, 'utf8');
    const acceptanceBefore = fs.readFileSync(acceptanceFile, 'utf8');

    const applied = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(applied.status).toBe(1);
    expect(applied.stdout.match(/sha256 before:/g)).toHaveLength(2);
    expect(applied.stdout.match(/sha256 after:/g)).toHaveLength(2);

    const expectedSpecBlock = replacementRows([
      'sample packet',
      'this packet demonstrates a custom description seed',
    ]).join('\n');
    const expectedAcceptanceBlock = replacementRows([
      'sample packet acceptance criteria',
    ]).join('\n');
    const specAfter = fs.readFileSync(specFile, 'utf8');
    const acceptanceAfter = fs.readFileSync(acceptanceFile, 'utf8');

    expect(specAfter).toBe(specBefore.replace(SPEC_ROWS.join('\n'), expectedSpecBlock));
    expect(acceptanceAfter).toBe(acceptanceBefore.replace(ACCEPTANCE_ROWS.join('\n'), expectedAcceptanceBlock));
    expect(specAfter).toContain('  - "author phrase"');
    expect(acceptanceAfter).toContain('  - "author phrase"');
    expect(acceptanceAfter).toContain('sample packet acceptance criteria');

    const secondApply = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(secondApply.status).toBe(0);
    expect(secondApply.stdout).toContain('nothing to change');
    expect(fs.readFileSync(specFile, 'utf8')).toBe(specAfter);
    expect(fs.readFileSync(acceptanceFile, 'utf8')).toBe(acceptanceAfter);
  });

  it('seeds acceptance criteria defaults as a single slug phrase', () => {
    const specsRoot = createSpecsRoot();
    writeDocument(specsRoot, 'track-a/001-sample-packet', 'spec.md', SPEC_ROWS, {
      description: 'This packet demonstrates a custom description seed.',
    });
    const acceptanceFile = writeDocument(specsRoot, 'track-a/001-sample-packet', 'acceptance-criteria.md', ACCEPTANCE_ROWS);

    const applied = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(applied.status).toBe(1);

    const phrases = fs.readFileSync(acceptanceFile, 'utf8')
      .split('\n')
      .map((line) => /^\s+- (".*")\s*$/.exec(line)?.[1])
      .filter((value): value is string => value !== undefined)
      .map((value) => JSON.parse(value) as string);

    expect(phrases).toHaveLength(1);
    expect(phrases[0]).toBe('sample packet acceptance criteria');
    expect(phrases[0].endsWith(' acceptance criteria')).toBe(true);
  });

  it('cleans exact and partial lists across plan, tasks, and implementation summaries', () => {
    const specsRoot = createSpecsRoot();
    const packetPath = 'track-a/001-sample-packet';
    const documents = [
      { filename: 'plan.md', rows: PLAN_ROWS, seed: 'sample packet plan' },
      { filename: 'tasks.md', rows: TASK_ROWS, seed: 'sample packet tasks' },
      {
        filename: 'implementation-summary.md',
        rows: SUMMARY_ROWS,
        seed: 'sample packet implementation summary',
      },
    ];
    const files = documents.map(({ filename, rows, seed }) => ({
      file: writeDocument(specsRoot, packetPath, filename, rows, {
        extraRows: ['  - "author phrase"'],
      }),
      seed,
    }));
    const partialPlanRows = [...PLAN_ROWS];
    partialPlanRows[1] = '  - "modified technical approach"';
    const partialPlanFile = writeDocument(
      specsRoot,
      'track-a/002-partial-plan',
      'plan.md',
      partialPlanRows,
    );

    const applied = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(applied.status).toBe(1);
    expect(applied.stdout).toContain('applied 4 file(s)');
    expect(applied.stdout).toContain(`${packetPath}/plan.md: written`);
    expect(applied.stdout).toContain(`${packetPath}/tasks.md: written`);
    expect(applied.stdout).toContain(`${packetPath}/implementation-summary.md: written`);
    expect(applied.stdout).toContain('track-a/002-partial-plan/plan.md: written');
    for (const { file, seed } of files) {
      expect(readTriggerPhrases(file)).toEqual([seed, 'author phrase']);
    }
    expect(readTriggerPhrases(partialPlanFile)).toEqual(['modified technical approach']);

    const cleanedFiles = files.map(({ file }) => fs.readFileSync(file, 'utf8'));
    const cleanedPartialPlan = fs.readFileSync(partialPlanFile, 'utf8');
    const secondApply = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(secondApply.status).toBe(0);
    expect(secondApply.stdout).toContain('nothing to change');
    expect(files.map(({ file }) => fs.readFileSync(file, 'utf8'))).toEqual(cleanedFiles);
    expect(fs.readFileSync(partialPlanFile, 'utf8')).toBe(cleanedPartialPlan);
  });

  it('removes default phrases from a mixed list, keeps author phrases in order, and adds no seed', () => {
    const specsRoot = createSpecsRoot();
    const planFile = writeDocument(specsRoot, 'track-a/001-mixed-list', 'plan.md', [
      PLAN_ROWS[0],
      '  - "author layout note"',
      PLAN_ROWS[2],
      '  - "author review note"',
      PLAN_ROWS[3],
    ]);

    const applied = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(applied.status).toBe(1);
    expect(applied.stdout).toContain('track-a/001-mixed-list/plan.md: written');
    expect(readTriggerPhrases(planFile)).toEqual(['author layout note', 'author review note']);

    const cleaned = fs.readFileSync(planFile, 'utf8');
    const secondApply = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(secondApply.status).toBe(0);
    expect(secondApply.stdout).toContain('nothing to change');
    expect(fs.readFileSync(planFile, 'utf8')).toBe(cleaned);
  });

  it('reseeds a list that carries only some of a kind defaults', () => {
    const specsRoot = createSpecsRoot();
    const specFile = writeDocument(specsRoot, 'track-a/001-sample-packet', 'spec.md', [
      SPEC_ROWS[0],
      SPEC_ROWS[2],
    ]);

    const applied = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(applied.status).toBe(1);
    expect(readTriggerPhrases(specFile)).toEqual([
      'sample packet',
      'a short fixture description for the packet',
    ]);

    const cleaned = fs.readFileSync(specFile, 'utf8');
    const secondApply = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(secondApply.status).toBe(0);
    expect(secondApply.stdout).toContain('nothing to change');
    expect(fs.readFileSync(specFile, 'utf8')).toBe(cleaned);
  });

  it('reseeds a cut-off description phrase that ends on a stop word', () => {
    const specsRoot = createSpecsRoot();
    const specFile = writeDocument(specsRoot, 'track-a/001-sample-packet', 'spec.md', [
      '  - "sample packet"',
      '  - "this packet demonstrates a custom description seed with"',
    ], {
      description: 'This packet demonstrates a custom description seed with enough words to show truncation.',
    });

    const applied = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(applied.status).toBe(1);
    expect(readTriggerPhrases(specFile)).toEqual([
      'sample packet',
      'this packet demonstrates a custom description seed',
    ]);

    const cleaned = fs.readFileSync(specFile, 'utf8');
    const secondApply = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(secondApply.status).toBe(0);
    expect(secondApply.stdout).toContain('nothing to change');
    expect(fs.readFileSync(specFile, 'utf8')).toBe(cleaned);
  });

  it('drops a cut-off phrase when the trim empties it or repeats a phrase the list carries', () => {
    const specsRoot = createSpecsRoot();
    // Each cut-off phrase is the verbatim first eight words of its own description,
    // which is the provenance the trim requires.
    const repeatFile = writeDocument(specsRoot, 'track-a/001-sample-packet', 'spec.md', [
      '  - "sample packet"',
      '  - "two of the four rules that fire"',
      '  - "two of the four rules that fire on"',
    ], {
      description: 'Two of the four rules that fire on the review gate.',
    });
    const emptyFile = writeDocument(specsRoot, 'track-a/002-stop-only-packet', 'spec.md', [
      '  - "stop only packet"',
      '  - "a an the and or but nor of"',
    ], {
      description: 'A an the and or but nor of the review gate.',
    });

    const applied = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(applied.status).toBe(1);
    expect(readTriggerPhrases(repeatFile)).toEqual([
      'sample packet',
      'two of the four rules that fire',
    ]);
    expect(readTriggerPhrases(emptyFile)).toEqual(['stop only packet']);

    const cleaned = fs.readFileSync(repeatFile, 'utf8');
    const secondApply = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(secondApply.status).toBe(0);
    expect(secondApply.stdout).toContain('nothing to change');
    expect(fs.readFileSync(repeatFile, 'utf8')).toBe(cleaned);
  });

  it('leaves cut-off phrases in other document kinds untouched', () => {
    const specsRoot = createSpecsRoot();
    const planFile = writeDocument(specsRoot, 'track-a/001-only-plan', 'plan.md', [
      '  - "close all six deep review findings on the"',
    ]);
    const before = fs.readFileSync(planFile, 'utf8');

    const dryRun = runNode(CLEANUP_SCRIPT, ['--root', specsRoot]);
    expect(dryRun.status).toBe(0);
    expect(dryRun.stdout).toContain('0 file(s) would change');
    expect(fs.readFileSync(planFile, 'utf8')).toBe(before);
  });

  it('never removes phrases outside the default set and reruns cleanly', () => {
    const specsRoot = createSpecsRoot();
    const specFile = writeDocument(specsRoot, 'track-a/001-author-only', 'spec.md', [
      '  - "custom alpha lane"',
      '  - "custom beta lane"',
    ]);
    const before = fs.readFileSync(specFile, 'utf8');

    const dryRun = runNode(CLEANUP_SCRIPT, ['--root', specsRoot]);
    expect(dryRun.status).toBe(0);
    expect(dryRun.stdout).toContain('0 file(s) would change');

    const applied = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(applied.status).toBe(0);
    expect(applied.stdout).toContain('nothing to change');
    expect(fs.readFileSync(specFile, 'utf8')).toBe(before);
  });

  it('does not reseed a slug phrase that already survives outside the template block', () => {
    const specsRoot = createSpecsRoot();
    const specFile = writeDocument(specsRoot, 'track-a/030-commit-body-always-required', 'spec.md', SPEC_ROWS, {
      extraRows: ['  - "commit body always required"'],
    });

    const applied = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(applied.status).toBe(1);

    const phrases = readTriggerPhrases(specFile);
    expect(phrases).toEqual([
      'a short fixture description for the packet',
      'commit body always required',
    ]);
    const repeats = phrases.map(normalizedPhrase).filter((phrase) => phrase === 'commit body always required');
    expect(repeats).toHaveLength(1);
  });

  it('removes the template block when every seeded phrase already survives', () => {
    const specsRoot = createSpecsRoot();
    const specFile = writeDocument(specsRoot, 'track-a/031-commit-body-always-required', 'spec.md', SPEC_ROWS, {
      description: 'Commit body always required.',
      extraRows: ['  - "commit body always required"'],
    });

    const applied = runNode(CLEANUP_SCRIPT, ['--root', specsRoot, '--apply']);
    expect(applied.status).toBe(1);

    expect(readTriggerPhrases(specFile)).toEqual(['commit body always required']);
  });

  it('reports and skips files with malformed frontmatter', () => {
    const specsRoot = createSpecsRoot();
    const packetDirectory = path.join(specsRoot, 'track-a', '001-broken-frontmatter');
    fs.mkdirSync(packetDirectory, { recursive: true });
    const file = path.join(packetDirectory, 'spec.md');
    const broken = '---\ntitle: "Broken fixture"\ntrigger_phrases: [unterminated\n---\n# Broken\n';
    fs.writeFileSync(file, broken, 'utf8');

    const result = runNode(CLEANUP_SCRIPT, ['--root', specsRoot]);
    expect(result.status).toBe(2);
    expect(result.stdout).toContain('track-a/001-broken-frontmatter/spec.md: skipped: invalid YAML');
    expect(result.stdout).toContain('1 skipped; 1 error(s)');
    expect(fs.readFileSync(file, 'utf8')).toBe(broken);
  });

  it('returns exit code 2 when the census root is missing', () => {
    const specsRoot = createSpecsRoot();
    const missingRoot = path.join(specsRoot, 'not-created');
    const result = runNode(CENSUS_SCRIPT, ['--root', missingRoot]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('root directory is missing');
  });
});
