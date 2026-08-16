#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ create-journey-proof — scaffold-to-doctor contract coverage             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const INIT_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'init_skill.py');
const GATE_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'ci-skill-root-metadata.cjs');
const VALIDATE_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'validate_skill_package.py');
const CHECKER_PATH = path.join(REPO_ROOT, '.opencode', 'commands', 'doctor', 'scripts', 'parent-skill-check.cjs');
const GENERATOR_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'generate-leaf-manifest.cjs');
const LEAF_CONTRACT_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs');
const ROOT_CONTRACT_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'lib', 'skill-root-metadata-contract.cjs');
const ROOT_ROUTER_CONTRACT_PATH = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'lib', 'root-router-contract.cjs');
const ASSETS_DIR = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'sk-create-skill', 'assets', 'skill');
const GRAPH_TEMPLATE_PATH = path.join(ASSETS_DIR, 'skill-graph-metadata-template.json');
const CONFIG_TEMPLATE_PATH = path.join(ASSETS_DIR, 'skill-leaf-manifest-config-template.json');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PROCESS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  assert.equal(result.error, undefined, `${command} ${args.join(' ')} failed to start: ${output}`);
  return { status: result.status, output };
}

function assertSuccess(result, description) {
  assert.equal(result.status, 0, `${description} failed:\n${result.output}`);
}

// The standalone scaffolder emits graph-metadata.json and
// leaf-manifest.config.json from inline literals, while the create-skill
// templates document the same shapes for hand-authors. They are only "kept
// equivalent by hand" — so assert the key structure matches, or the two drift
// silently the next time either side changes. `_template` is the note the
// scaffold omits; placeholder values differ and are ignored (keys only).
function deepKeyPaths(value, prefix, out) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  for (const key of Object.keys(value)) {
    if (key === '_template') continue;
    const pathKey = prefix ? `${prefix}.${key}` : key;
    out.add(pathKey);
    deepKeyPaths(value[key], pathKey, out);
  }
  return out;
}

function assertShapeMatches(scaffoldPath, templatePath, label) {
  const scaffold = JSON.parse(fs.readFileSync(scaffoldPath, 'utf8'));
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  const scaffoldKeys = [...deepKeyPaths(scaffold, '', new Set())].sort();
  const templateKeys = [...deepKeyPaths(template, '', new Set())].sort();
  assert.deepEqual(scaffoldKeys, templateKeys,
    `${label}: scaffolder output and template have drifted\n  scaffold: ${scaffoldKeys.join(', ')}\n  template: ${templateKeys.join(', ')}`);
}

function stageDoctorSupport(tempRoot) {
  const scriptsDir = path.join(tempRoot, 'sk-doc', 'sk-create-skill', 'scripts');
  const libDir = path.join(scriptsDir, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  fs.copyFileSync(GENERATOR_PATH, path.join(scriptsDir, 'generate-leaf-manifest.cjs'));
  fs.copyFileSync(LEAF_CONTRACT_PATH, path.join(libDir, 'leaf-resource-contract.cjs'));
  fs.copyFileSync(ROOT_CONTRACT_PATH, path.join(libDir, 'skill-root-metadata-contract.cjs'));
  fs.copyFileSync(ROOT_ROUTER_CONTRACT_PATH, path.join(libDir, 'root-router-contract.cjs'));
  // generate-leaf-manifest.cjs now reads the shared S-class config defaults, so
  // the doctor's staged copy needs it too or its require fails at runtime.
  fs.copyFileSync(
    path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'lib', 's-class-config-defaults.json'),
    path.join(libDir, 's-class-config-defaults.json'),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. JOURNEY
// ─────────────────────────────────────────────────────────────────────────────

let tempRoot = null;
try {
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'create-journey-proof-'));

  const solo = run('python3', [INIT_PATH, 'proof-solo', '--path', tempRoot]);
  assertSuccess(solo, 'standalone scaffold');

  const hub = run('python3', [INIT_PATH, 'proof-hub', '--path', tempRoot, '--kind', 'parent']);
  assertSuccess(hub, 'parent-hub scaffold');

  // The parent initializer must always emit one valid root stage1-only
  // ROUTER.md: empty stage-two collections, a root SKILL.md pointer, and a
  // four-part version — never placeholder paths or fabricated leaf intents.
  const routerPath = path.join(tempRoot, 'proof-hub', 'ROUTER.md');
  assert.ok(fs.existsSync(routerPath), 'fresh parent scaffold must ship a root ROUTER.md');
  const routerSource = fs.readFileSync(routerPath, 'utf8');
  assert.match(routerSource, /router_state: stage1-only/);
  assert.match(routerSource, /skill_pointer: SKILL.md/);
  assert.match(routerSource, /^version: 1\.0\.0\.0$/m);
  assert.match(routerSource, /DEFAULT_RESOURCE = \[\]/);
  assert.match(routerSource, /INTENT_SIGNALS = \{\}/);
  assert.match(routerSource, /RESOURCE_MAP = \{\}/);
  assert.match(routerSource, /SHARED_CONTROL_RESOURCES = \[\]/);
  assert.doesNotMatch(routerSource, /\[packet[^]]*\]|\[INTENT_[A-Z]+\]/, 'scaffold must not synthesize placeholder paths');

  // Guard the "kept equivalent by hand" seam between the scaffolder's inline
  // literals and the standalone templates before the gate ever runs.
  assertShapeMatches(
    path.join(tempRoot, 'proof-solo', 'graph-metadata.json'), GRAPH_TEMPLATE_PATH,
    'standalone graph-metadata scaffold vs template');
  assertShapeMatches(
    path.join(tempRoot, 'proof-solo', 'leaf-manifest.config.json'), CONFIG_TEMPLATE_PATH,
    'standalone leaf-manifest.config scaffold vs template');

  stageDoctorSupport(tempRoot);

  // init_skill now runs the class gate --fix as part of scaffolding, so both
  // roots are born gate-fresh — a --fix here finds nothing left to fix (fixed=0),
  // which is the proof that the scaffold-to-gate leg is closed at scaffold time.
  const fixed = run(process.execPath, [GATE_PATH, '--skills-dir', tempRoot, '--fix']);
  assertSuccess(fixed, 'root-metadata gate with --fix');
  assert.match(fixed.output, /checked=2 passed=2 failed=0 fixed=0/);

  const clean = run(process.execPath, [GATE_PATH, '--skills-dir', tempRoot]);
  assertSuccess(clean, 'plain root-metadata gate');
  assert.match(clean.output, /checked=2 passed=2 failed=0 fixed=0/);

  const doctor = run(process.execPath, [CHECKER_PATH, path.join(tempRoot, 'proof-hub')]);
  const doctorFailures = doctor.output.split('\n').filter((line) => line.includes('FAIL:'));
  assert.equal(doctor.status, 0, `fresh scaffold doctor failures:\n${doctorFailures.join('\n')}`);
  assert.match(doctor.output, /12a-router-contract: root ROUTER\.md conforms to the two-state contract \(stage1-only\)/);

  // The package gate runs the same parent doctor plus the leaf-manifest and
  // compiled-routing readiness checks; the stage1-only scaffold must pass all.
  const pkg = run('python3', [VALIDATE_PATH, path.join(tempRoot, 'proof-hub')]);
  const pkgFailures = pkg.output.split('\n').filter((line) => line.includes('FAIL'));
  assert.equal(pkg.status, 0, `fresh scaffold package gate failures:\n${pkgFailures.join('\n')}`);
} finally {
  if (tempRoot) fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log('[sk-doc] create journey proof passed');
