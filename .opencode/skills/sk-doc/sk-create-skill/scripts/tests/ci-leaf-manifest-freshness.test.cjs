#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ ci-leaf-manifest-freshness.test — traversal failure gate coverage       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers fail-closed manifest discovery, stable traversal-failure reporting,
 * intentional exclusions, and the readable happy path.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const gate = require('../ci-leaf-manifest-freshness.cjs');
const { buildManifestBytes } = require('../generate-leaf-manifest.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

let tmpRoot = null;

function makeTmpSkillsDir() {
  if (!tmpRoot) tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-manifest-freshness-'));
  return fs.mkdtempSync(path.join(tmpRoot, 'skills-'));
}

function makeFreshSkill(skillsDir, skillId) {
  const skillDir = path.join(skillsDir, skillId);
  fs.mkdirSync(path.join(skillDir, 'references'), { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'references', 'example.md'), '# Example\n');
  fs.writeFileSync(path.join(skillDir, 'leaf-manifest.config.json'), `${JSON.stringify({
    workflowMode: skillId,
    packet: '.',
    leafRoots: ['references'],
  }, null, 2)}\n`);
  fs.writeFileSync(path.join(skillDir, 'leaf-manifest.json'), buildManifestBytes(skillDir));
  return skillDir;
}

function makeNestedDir(skillsDir, relativePath) {
  const dir = path.join(skillsDir, relativePath);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function captureRun(args) {
  const originalWrite = process.stdout.write;
  let output = '';
  process.stdout.write = (chunk) => {
    output += String(chunk);
    return true;
  };
  try {
    return { code: gate.run(args), output };
  } finally {
    process.stdout.write = originalWrite;
  }
}

function withReaddirFailures(failedPaths, callback) {
  const originalReaddirSync = fs.readdirSync;
  const failures = new Set(failedPaths.map((failedPath) => path.resolve(failedPath)));
  fs.readdirSync = function readdirSyncWithFailures(targetPath, options) {
    if (failures.has(path.resolve(targetPath))) {
      const error = new Error('Permission denied while reading directory');
      error.code = 'EACCES';
      throw error;
    }
    return originalReaddirSync.call(fs, targetPath, options);
  };
  try {
    return callback();
  } finally {
    fs.readdirSync = originalReaddirSync;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TRAVERSAL FAILURE BEHAVIOUR
// ─────────────────────────────────────────────────────────────────────────────

function testNestedReadFailureIsReportedAndFailsTextRun() {
  const skillsDir = makeTmpSkillsDir();
  makeFreshSkill(skillsDir, 'fresh-skill');
  const blockedDir = makeNestedDir(skillsDir, 'nested/blocked');

  const result = withReaddirFailures([blockedDir], () => (
    captureRun({ skillsDir, format: 'text' })
  ));

  assert.equal(result.code, 1);
  assert.match(result.output, /ERROR nested[/\\]blocked  traversal EACCES:/);
  assert.match(result.output, /checked=1 fresh=1 failed=1/);
}

function testMultipleFailuresAreStructuredAndStable() {
  const skillsDir = makeTmpSkillsDir();
  const secondDir = makeNestedDir(skillsDir, 'zeta/blocked');
  const firstDir = makeNestedDir(skillsDir, 'alpha/blocked');

  const result = withReaddirFailures([secondDir, firstDir], () => (
    captureRun({ skillsDir, format: 'json' })
  ));
  const report = JSON.parse(result.output);

  assert.equal(result.code, 1);
  assert.equal(report.failed, 2);
  assert.deepEqual(
    report.traversalFailures.map((failure) => failure.path),
    [path.join('alpha', 'blocked'), path.join('zeta', 'blocked')],
  );
  assert.ok(report.traversalFailures.every((failure) => failure.code === 'EACCES'));
}

function testExcludedDirectoriesAreNotTraversalFailures() {
  const skillsDir = makeTmpSkillsDir();
  makeFreshSkill(skillsDir, 'fresh-skill');
  const nodeModulesDir = makeNestedDir(skillsDir, 'node_modules');
  const gitDir = makeNestedDir(skillsDir, '.git');

  const result = withReaddirFailures([nodeModulesDir, gitDir], () => (
    captureRun({ skillsDir, format: 'json' })
  ));
  const report = JSON.parse(result.output);

  assert.equal(result.code, 0);
  assert.deepEqual(report.traversalFailures, []);
  assert.equal(report.failed, 0);
}

function testCleanHappyPathStaysGreenAfterMocksRestore() {
  const skillsDir = makeTmpSkillsDir();
  makeFreshSkill(skillsDir, 'fresh-skill');

  const discovery = gate.findManifestDirs(skillsDir);
  const result = captureRun({ skillsDir, format: 'json' });
  const report = JSON.parse(result.output);

  assert.deepEqual(discovery.failures, []);
  assert.deepEqual(discovery.roots, [path.join(skillsDir, 'fresh-skill')]);
  assert.equal(result.code, 0);
  assert.equal(report.checked, 1);
  assert.equal(report.fresh, 1);
  assert.equal(report.failed, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. RUN
// ─────────────────────────────────────────────────────────────────────────────

try {
  testNestedReadFailureIsReportedAndFailsTextRun();
  testMultipleFailuresAreStructuredAndStable();
  testExcludedDirectoriesAreNotTraversalFailures();
  testCleanHappyPathStaysGreenAfterMocksRestore();
} finally {
  if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
}

console.log('[sk-doc] leaf-manifest freshness traversal coverage passed');
