#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ CLI Adapter Stress Matrix-Bijection Validator                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME_DIR = path.resolve(__dirname, '../../..');
const REPOSITORY_ROOT = path.resolve(RUNTIME_DIR, '../../../..');
const SKILLS_ROOT = path.join(REPOSITORY_ROOT, '.opencode', 'skills');
const MANIFEST_PATH = path.join(__dirname, 'matrix-manifest.ts');
const TEST_DIRECTORY = 'tests/stress/cli-adapter/';
const FORBIDDEN_OVERCLAIM = /classif(?:y|ies|ication)|reaps? every descendant|full[- ]tree reap/iu;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function matrixKey(cell) {
  return `${cell.subject}:${cell.edgeCaseId}`;
}

function expectedTestFile(subject) {
  return subject === 'fanout-run'
    ? `${TEST_DIRECTORY}fanout.vitest.ts`
    : `${TEST_DIRECTORY}${subject}.vitest.ts`;
}

function safePlaybookPath(relativePath) {
  const resolved = path.resolve(SKILLS_ROOT, relativePath);
  const relative = path.relative(SKILLS_ROOT, resolved);
  if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`playbook path escapes the skills root: ${relativePath}`);
  }
  return resolved;
}

function walkMarkdown(rootPath) {
  if (!fs.existsSync(rootPath)) return [];
  const files = [];
  const entries = fs.readdirSync(rootPath, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    const entryPath = path.join(rootPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdown(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(entryPath);
    }
  }
  return files;
}

function frontmatterValue(content, key) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u);
  if (!frontmatter) return null;
  const line = frontmatter[1].split(/\r?\n/u)
    .find((candidate) => candidate.startsWith(`${key}:`));
  if (!line) return null;
  const raw = line.slice(key.length + 1).trim();
  if (raw.startsWith('"')) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

async function loadManifest() {
  const manifestUrl = `${pathToFileURL(MANIFEST_PATH).href}?matrix-bijection-validator`;
  return import(manifestUrl);
}

function listRegisteredTests() {
  const result = spawnSync('npx', [
    '--no-install',
    'vitest',
    'list',
    TEST_DIRECTORY,
    '--configLoader',
    'runner',
  ], {
    cwd: RUNTIME_DIR,
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    const detail = [result.error?.message, result.stdout, result.stderr]
      .filter(Boolean)
      .join('\n')
      .trim();
    throw new Error(`Vitest test discovery failed${detail ? `:\n${detail}` : ''}`);
  }
  return result.stdout.split(/\r?\n/u).flatMap((line) => {
    if (!line.startsWith(TEST_DIRECTORY)) return [];
    const parts = line.split(' > ');
    if (parts.length < 2) return [];
    return [{ file: parts[0], testName: parts.at(-1), fullName: line }];
  });
}

function validateSnippet(cell, absolutePath, failures) {
  const key = matrixKey(cell);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`[missing-playbook] ${key}: ${cell.playbookPath}`);
    return;
  }
  if (!fs.statSync(absolutePath).isFile()) {
    failures.push(`[invalid-playbook] ${key}: declared path is not a file: ${cell.playbookPath}`);
    return;
  }
  const content = fs.readFileSync(absolutePath, 'utf8');
  const expectedMetadata = {
    matrix_cell: key,
    test_file: expectedTestFile(cell.subject),
    test_name: cell.testName,
    playbook_path: cell.playbookPath,
  };
  for (const [field, expected] of Object.entries(expectedMetadata)) {
    const observed = frontmatterValue(content, field);
    if (observed !== expected) {
      failures.push(
        `[playbook-metadata] ${key}: ${field} expected ${JSON.stringify(expected)}, `
        + `observed ${JSON.stringify(observed)} in ${cell.playbookPath}`,
      );
    }
  }
  for (const heading of ['## Command', '## Evidence', '## Verdict', '## Triage']) {
    if (!content.includes(heading)) {
      failures.push(`[playbook-section] ${key}: missing ${heading} in ${cell.playbookPath}`);
    }
  }
  for (const term of ['stdout', 'stderr', 'ledger', 'artifacts', 'PASS', 'FAIL', 'SKIP']) {
    if (!content.includes(term)) {
      failures.push(`[playbook-contract] ${key}: missing ${term} in ${cell.playbookPath}`);
    }
  }
  for (const triage of ['Harness failure', 'Dependency SKIP']) {
    if (!content.includes(triage)) {
      failures.push(`[playbook-triage] ${key}: missing ${triage} in ${cell.playbookPath}`);
    }
  }
  if (!/Adapter(?:\/fan-out)? defect/u.test(content)) {
    failures.push(
      `[playbook-triage] ${key}: missing adapter defect triage in ${cell.playbookPath}`,
    );
  }
  if (!content.includes(expectedTestFile(cell.subject)) || !content.includes(cell.testName)) {
    failures.push(
      `[playbook-command] ${key}: command does not name its exact test file and test name`,
    );
  }
  if (FORBIDDEN_OVERCLAIM.test(content)) {
    failures.push(`[playbook-overclaim] ${key}: forbidden behavior claim in ${cell.playbookPath}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

async function validate() {
  const manifest = await loadManifest();
  const cells = [...manifest.CLI_ADAPTER_CURRENT_MATRIX];
  const failures = [];
  const expectedCellCount = manifest.CLI_ADAPTER_SUBJECTS.length * manifest.EDGE_CASE_ROWS.length;

  if (cells.length !== expectedCellCount) {
    failures.push(`[manifest-count] expected ${expectedCellCount} cells, observed ${cells.length}`);
  }
  if (!manifest.CLI_ADAPTER_MATRIX_AUDIT.allAdapterBound) {
    failures.push('[manifest-audit] allAdapterBound is false');
  }
  if (!manifest.CLI_ADAPTER_MATRIX_AUDIT.allSubjectBound) {
    failures.push('[manifest-audit] allSubjectBound is false');
  }
  if (manifest.CLI_ADAPTER_MATRIX_AUDIT.forbiddenOverclaims.length !== 0) {
    const overclaims = manifest.CLI_ADAPTER_MATRIX_AUDIT.forbiddenOverclaims.join(', ');
    failures.push(
      `[manifest-audit] forbiddenOverclaims: ${overclaims}`,
    );
  }

  const cellCounts = countValues(cells.map(matrixKey));
  for (const [key, count] of cellCounts) {
    if (count !== 1) failures.push(`[duplicate-cell] ${key}: ${count} manifest entries`);
  }
  const playbookPathCounts = countValues(cells.map((cell) => cell.playbookPath));
  for (const [playbookPath, count] of playbookPathCounts) {
    if (count !== 1) {
      failures.push(`[duplicate-playbook-path] ${playbookPath}: ${count} manifest cells`);
    }
  }
  for (const cell of cells) {
    const isImplemented = cell.testStatus === 'implemented'
      && typeof cell.testName === 'string'
      && cell.testName !== '';
    if (!isImplemented) {
      failures.push(`[unindexed-test] ${matrixKey(cell)}: test is not implemented with a name`);
    }
  }

  const discoveredTests = listRegisteredTests();
  const expectedTestKeys = new Set(cells.map(
    (cell) => `${expectedTestFile(cell.subject)}\u0000${cell.testName}`,
  ));
  const manifestTestNames = new Set(cells.map((cell) => cell.testName));
  const indexedTests = discoveredTests.filter((test) => manifestTestNames.has(test.testName));
  const indexedTestCounts = countValues(indexedTests.map(
    (test) => `${test.file}\u0000${test.testName}`,
  ));
  const matchedTestKeys = new Set();
  for (const cell of cells) {
    const file = expectedTestFile(cell.subject);
    const key = `${file}\u0000${cell.testName}`;
    const count = indexedTestCounts.get(key) ?? 0;
    if (count === 0) {
      failures.push(`[missing-test] ${matrixKey(cell)}: ${file} > ${cell.testName}`);
    } else if (count > 1) {
      failures.push(
        `[duplicate-test] ${matrixKey(cell)}: ${count} registrations for ${file} > ${cell.testName}`,
      );
    } else {
      matchedTestKeys.add(key);
    }
  }
  const orphanTests = indexedTests.filter(
    (test) => !expectedTestKeys.has(`${test.file}\u0000${test.testName}`),
  );
  for (const test of orphanTests) failures.push(`[orphan-test] ${test.fullName}`);

  const declaredPlaybooks = new Set(cells.map((cell) => cell.playbookPath));
  for (const cell of cells) {
    validateSnippet(cell, safePlaybookPath(cell.playbookPath), failures);
  }
  const adapterStressRoots = manifest.CLI_ADAPTER_SUBJECTS
    .filter((subject) => subject !== 'fanout-run')
    .map((subject) => path.join(
      SKILLS_ROOT,
      'cli-external-orchestration',
      subject,
      'manual-testing-playbook',
      'stress',
    ));
  const playbookRoots = [
    ...adapterStressRoots,
    path.join(
      SKILLS_ROOT,
      'cli-external-orchestration',
      'manual-testing-playbook',
      'fanout-stress',
    ),
  ];
  const discoveredPlaybookFiles = playbookRoots.flatMap(walkMarkdown);
  const discoveredPlaybooks = discoveredPlaybookFiles.map(
    (filePath) => toPosix(path.relative(SKILLS_ROOT, filePath)),
  );
  const orphanPlaybooks = discoveredPlaybooks.filter(
    (playbookPath) => !declaredPlaybooks.has(playbookPath),
  );
  for (const playbookPath of orphanPlaybooks) failures.push(`[orphan-playbook] ${playbookPath}`);

  const playbookCellCounts = countValues(discoveredPlaybookFiles.map((filePath) => (
    frontmatterValue(fs.readFileSync(filePath, 'utf8'), 'matrix_cell')
  )).filter(Boolean));
  for (const [key, count] of playbookCellCounts) {
    if (count !== 1) failures.push(`[duplicate-playbook-cell] ${key}: ${count} snippets`);
  }

  const missingPlaybooks = cells.filter(
    (cell) => !discoveredPlaybooks.includes(cell.playbookPath),
  ).length;
  const duplicateTests = [...indexedTestCounts.values()].filter((count) => count > 1).length;
  const duplicatePlaybooks = [...playbookCellCounts.values()].filter((count) => count > 1).length;
  const supportTests = discoveredTests.length - indexedTests.length;

  const resultLabel = failures.length === 0 ? 'PASS' : 'FAIL';
  process.stdout.write(`${resultLabel}: CLI adapter stress matrix bijection\n`);
  process.stdout.write(`  cells: ${cells.length}\n`);
  process.stdout.write(
    `  tests: ${matchedTestKeys.size} indexed / ${discoveredTests.length} discovered `
    + `(${supportTests} support)\n`,
  );
  process.stdout.write(
    `  playbooks: ${declaredPlaybooks.size - missingPlaybooks} indexed / `
    + `${discoveredPlaybooks.length} discovered\n`,
  );
  process.stdout.write(`  missing tests: ${cells.length - matchedTestKeys.size}\n`);
  process.stdout.write(`  missing playbooks: ${missingPlaybooks}\n`);
  process.stdout.write(`  duplicate tests: ${duplicateTests}\n`);
  process.stdout.write(`  duplicate playbooks: ${duplicatePlaybooks}\n`);
  process.stdout.write(`  orphan tests: ${orphanTests.length}\n`);
  process.stdout.write(`  orphan playbooks: ${orphanPlaybooks.length}\n`);
  if (failures.length > 0) {
    process.stdout.write('\nGaps:\n');
    for (const failure of failures) process.stdout.write(`  - ${failure}\n`);
    process.exitCode = 1;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

validate().catch((error) => {
  process.stderr.write(`[validate-playbook-package] ${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
