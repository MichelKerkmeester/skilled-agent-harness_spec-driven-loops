#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: generate-leaf-manifest-ignores.test
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Covers the git-ignore filter on the leaf walk: a leaf that git ignores is
 * dropped from the manifest, and a walk outside any work tree falls back to
 * name rules that drop generated noise without dropping source files.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const generator = require('../generate-leaf-manifest.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

let tmpRoot = null;

function makeTmpDir(label) {
  if (!tmpRoot) tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-ignores-'));
  return fs.mkdtempSync(path.join(tmpRoot, `${label}-`));
}

function writeFile(root, relativePath, content) {
  const full = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

// A standalone skill has no mode registry, so its single mode walks the packet
// root named by the config. The packet is the skill directory itself.
function writeStandaloneSkill(skillDir) {
  writeFile(skillDir, 'leaf-manifest.config.json', `${JSON.stringify({
    workflowMode: 'ignores-probe',
    packet: '.',
    leafRoots: ['references', 'assets'],
  }, null, 2)}\n`);
}

function readLeaves(skillDir) {
  const manifest = JSON.parse(generator.buildManifestBytes(skillDir).toString('utf8'));
  return manifest.modes[0].leaves.slice().sort();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CASES
// ─────────────────────────────────────────────────────────────────────────────

// Only git can drop references/generated/out.md, because no name rule matches
// that directory. The skill sits below the repository root, so the walk must map
// packet-relative paths onto the repository's own paths before asking git.
// Each leaf root is its own walk, so the assets root asks git about one file that
// nothing ignores, and git exits 1 for it.
function testGitIgnoredLeafIsDropped() {
  const repoRoot = makeTmpDir('git-ignored');
  const init = spawnSync('git', ['init', '-q'], { cwd: repoRoot, encoding: 'utf8' });
  assert.equal(init.status, 0, init.stderr);
  writeFile(repoRoot, '.gitignore', 'generated/\n');

  const skillDir = path.join(repoRoot, 'skill');
  writeStandaloneSkill(skillDir);
  writeFile(skillDir, 'references/keep.md', '# keep\n');
  writeFile(skillDir, 'references/generated/out.md', '# out\n');
  writeFile(skillDir, 'assets/logo.txt', 'logo\n');

  assert.deepEqual(readLeaves(skillDir), ['assets/logo.txt', 'references/keep.md']);
}

// The name rules are the whole answer when git cannot give one, so this case
// first proves that its fixture sits outside every work tree.
function testFallbackDropsGeneratedNoise() {
  const skillDir = makeTmpDir('fallback');
  const probe = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd: skillDir, encoding: 'utf8' });
  assert.notEqual(probe.status, 0, 'fixture must sit outside every work tree');

  writeStandaloneSkill(skillDir);
  writeFile(skillDir, 'references/keep.md', '# keep\n');
  writeFile(skillDir, 'references/__pycache__/probe.cpython-39.pyc', '');
  writeFile(skillDir, 'references/stale.pyc', '');
  writeFile(skillDir, 'references/.DS_Store', '');
  writeFile(skillDir, 'references/node_modules/pkg/index.js', 'module.exports = {};\n');

  assert.deepEqual(readLeaves(skillDir), ['references/keep.md']);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RUN
// ─────────────────────────────────────────────────────────────────────────────

try {
  testGitIgnoredLeafIsDropped();
  console.log('ok - git-ignored leaf is dropped');
  testFallbackDropsGeneratedNoise();
  console.log('ok - fallback drops generated noise outside a work tree');
} finally {
  if (tmpRoot) fs.rmSync(tmpRoot, { recursive: true, force: true });
}

console.log('[sk-doc] leaf-manifest ignore filtering coverage passed');
