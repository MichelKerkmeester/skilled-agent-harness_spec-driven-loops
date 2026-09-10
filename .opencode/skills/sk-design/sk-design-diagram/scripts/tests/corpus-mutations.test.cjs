#!/usr/bin/env node
/**
 * Standing proof that every family in the diagram corpus check fails when the thing it describes
 * is broken.
 *
 * A checker that is only ever run on a green corpus proves nothing about its own assertions: a
 * guard that can never be true, a regex satisfied by prose, a family reading a comment as code
 * all pass quietly. So every case here breaks one thing and expects one named family to say one
 * specific thing about it, and the harness refuses a case whose patch did not apply, whose base
 * was not already clean, or whose failure came from another family, because each of those would
 * be a test that asserts nothing.
 */

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const CHECKER = path.join(ROOT, 'scripts', 'check-diagram-corpus.cjs');
const FAMILY_DIR = path.join(ROOT, 'scripts', 'families');

function runChecker(extra) {
  const args = extra ? [CHECKER, '--extra', extra] : [CHECKER];
  try {
    return execFileSync(process.execPath, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    return `${error.stdout || ''}${error.stderr || ''}`;
  }
}

function failuresFor(output, family) {
  return output.split('\n').filter((line) => line.includes(`FAIL [${family}]`));
}

// A case mutates one shipped file and reads it back through the real checker as an extra. The
// corpus itself is never touched, so a crashed run cannot leave the packet dirty.
function runFileCase(spec) {
  const source = path.join(ROOT, spec.file);
  const original = fs.readFileSync(source, 'utf8');
  assert.ok(original.includes(spec.from),
    `the patch anchor is not in ${spec.file}; a case whose patch does not apply proves nothing`);
  const mutated = original.replace(spec.from, spec.to);
  assert.notEqual(mutated, original, 'the patch changed nothing');

  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'diagram-mutation-'));
  try {
    fs.writeFileSync(path.join(directory, 'mutant.html'), original, 'utf8');
    const before = failuresFor(runChecker(directory), spec.family);
    assert.equal(before.length, 0,
      `${spec.file} already fails ${spec.family} unmutated, so this case would prove nothing:\n${before.join('\n')}`);

    fs.writeFileSync(path.join(directory, 'mutant.html'), mutated, 'utf8');
    const after = failuresFor(runChecker(directory), spec.family);
    assert.ok(after.length > 0, `${spec.family} did not fire on: ${spec.name}`);
    assert.ok(after.some((line) => spec.expect.test(line)),
      `${spec.family} fired on something else:\n${after.join('\n')}`);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

// Corpus-scoped families read a reference document or the token source, so those cases mutate a
// package copy: the checker, its families, the assets it reads and the documents it indexes.
const PACKAGE_PARTS = [['scripts'], ['references'], ['assets'], ['SKILL.md']];

function copyPackage() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'diagram-package-'));
  for (const part of PACKAGE_PARTS) {
    fs.cpSync(path.join(ROOT, ...part), path.join(directory, ...part), { recursive: true });
  }
  return directory;
}

function runPackageCase(spec) {
  const directory = copyPackage();
  try {
    const checker = path.join(directory, 'scripts', 'check-diagram-corpus.cjs');
    const run = () => {
      try {
        return execFileSync(process.execPath, [checker], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      } catch (error) {
        return `${error.stdout || ''}${error.stderr || ''}`;
      }
    };
    const before = failuresFor(run(), spec.family);
    assert.equal(before.length, 0,
      `the package copy already fails ${spec.family} unmutated:\n${before.join('\n')}`);
    spec.mutate(directory);
    const after = failuresFor(run(), spec.family);
    assert.ok(after.length > 0, `${spec.family} did not fire on: ${spec.name}`);
    assert.ok(after.some((line) => spec.expect.test(line)),
      `${spec.family} fired on something else:\n${after.join('\n')}`);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

module.exports = { runFileCase, runPackageCase, ROOT, CHECKER };

test('the corpus is clean before anything is mutated', () => {
  assert.match(runChecker(), /RESULT: PASSED/, 'every case below assumes a green starting point');
});

// ── one case per family ─────────────────────────────────────────────────────────────────────────
const FILE_CASES = require('./mutation-cases.cjs').FILE_CASES;
for (const spec of FILE_CASES) {
  test(`${spec.family} refuses ${spec.name}`, () => runFileCase(spec));
}

const PACKAGE_CASES = require('./mutation-cases.cjs').PACKAGE_CASES;
for (const spec of PACKAGE_CASES) {
  test(`${spec.family} refuses ${spec.name}`, () => runPackageCase(spec));
}

// ── the guard that keeps this file honest ───────────────────────────────────────────────────────
// Coverage written once follows the work that prompted it and then rots. So the suite asserts its
// own completeness: every family the checker registers has a case, nothing here names a family
// the checker does not register, and a family may sit outside only by being named with a reason
// that is still true.
const NEEDS_AN_EYE = {};

function registeredFamilies() {
  return new Set(fs.readdirSync(FAMILY_DIR).filter((n) => n.endsWith('.cjs')).map((n) => require(path.join(FAMILY_DIR, n)).name));
}

function coveredFamilies() {
  return new Set([...FILE_CASES, ...PACKAGE_CASES].map((c) => c.family));
}

test('every family the checker registers has a case here, or a stated reason it cannot', () => {
  const uncovered = [...registeredFamilies()].filter((f) => !coveredFamilies().has(f) && !NEEDS_AN_EYE[f]).sort();
  assert.deepEqual(uncovered, [], `these families are enforced by nothing:\n  ${uncovered.join('\n  ')}`);
});

test('nothing here names a family the checker does not register', () => {
  const registered = registeredFamilies();
  const invented = [...coveredFamilies()].filter((f) => !registered.has(f)).sort();
  assert.deepEqual(invented, [], `these cases name families the checker never runs, so they assert nothing:\n  ${invented.join('\n  ')}`);
});

test('no exemption outlives the family it excuses', () => {
  const registered = registeredFamilies();
  const stale = Object.keys(NEEDS_AN_EYE).filter((f) => !registered.has(f)).sort();
  assert.deepEqual(stale, [], `these exemptions name families that no longer exist:\n  ${stale.join('\n  ')}`);
});
