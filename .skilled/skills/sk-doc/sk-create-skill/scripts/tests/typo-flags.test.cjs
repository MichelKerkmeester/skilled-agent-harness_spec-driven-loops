#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ typo-flags.test: unknown-option rejection across sk-doc CLI scripts      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Proves every sk-doc CLI entry point rejects an unknown or misspelled flag
 * with its usage exit status and an error that names the offending token.
 * A typo that stays silent would let the script fall back to a default run,
 * so these cases pin the loud failure. Each script runs with the repository
 * root as cwd, because several resolve repository-relative paths.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Six levels up from scripts/tests/ lands on the repository root, which is
// where the skill tree below .skilled lives.
const REPO = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const SKDOC = path.join(REPO, '.skilled', 'skills', 'sk-doc');
const SPAWN_TIMEOUT_MS = 120000;

assert.ok(fs.existsSync(path.join(REPO, '.skilled')), `REPO does not hold .skilled: ${REPO}`);

const BUILD_RULE_CARDS = path.join(SKDOC, 'sk-create-repo-rule', 'scripts', 'build-rule-cards.cjs');
const CHECK_REPO_RULES = path.join(SKDOC, 'sk-create-repo-rule', 'scripts', 'check-repo-rules.cjs');
const VALIDATE_COMPILED_ROUTING = path.join(SKDOC, 'sk-create-skill', 'scripts', 'validate-compiled-routing-scenarios.cjs');
const VALIDATE_DOC_MODEL_REFS = path.join(SKDOC, 'scripts', 'validate-doc-model-refs.js');
const FRONTMATTER_VERSION = path.join(SKDOC, 'shared', 'scripts', 'frontmatter-version.mjs');
const LINT_GOAL_CRITERIA = path.join(SKDOC, 'sk-create-goal', 'scripts', 'lint-goal-criteria.cjs');
const CI_LEAF_MANIFEST_FRESHNESS = path.join(SKDOC, 'sk-create-skill', 'scripts', 'ci-leaf-manifest-freshness.cjs');
const CI_SKILL_DERIVED_FRESHNESS = path.join(SKDOC, 'sk-create-skill', 'scripts', 'ci-skill-derived-freshness.cjs');
const CI_SKILL_ROOT_METADATA = path.join(SKDOC, 'sk-create-skill', 'scripts', 'ci-skill-root-metadata.cjs');
const CI_ROUTER_VOCABULARY_REACH = path.join(SKDOC, 'sk-create-skill', 'scripts', 'ci-router-vocabulary-reach.cjs');
const VALIDATE_PLAYBOOK_TOPOLOGY = path.join(SKDOC, 'sk-create-skill', 'scripts', 'validate-playbook-topology.cjs');
const GENERATE_ROUTER_INTENT_SIGNALS = path.join(SKDOC, 'sk-create-skill', 'scripts', 'generate-router-intent-signals.cjs');
const GENERATE_LEAF_MANIFEST = path.join(SKDOC, 'sk-create-skill', 'scripts', 'generate-leaf-manifest.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function runScript(scriptPath, args) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: REPO,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
  });
}

// stdout first, separated by a newline, so a token cannot be assembled across
// the two streams.
function combinedOutput(result) {
  return `${result.stdout || ''}\n${result.stderr || ''}`;
}

// An unknown or misspelled flag must fail loudly: the usage exit status plus
// the exact offending token, so a typo can never read as a clean run.
function assertUsageFailure(result, expectedStatus, token) {
  const output = combinedOutput(result);
  const detail = `status=${result.status} signal=${result.signal} error=${result.error ? result.error.message : 'none'}`;
  assert.equal(result.status, expectedStatus, `expected exit status ${expectedStatus}, got ${detail}\n${output}`);
  assert.ok(output.includes(token), `expected output to name ${token}, got ${detail}\n${output}`);
}

// Cases that need an input directory get a fresh one outside the repository,
// removed once the case finishes.
function withTempDir(callback) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'typo-flags-'));
  try {
    return callback(tmpDir);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('build-rule-cards.cjs rejects the misspelled --chekc flag', () => {
  const result = runScript(BUILD_RULE_CARDS, ['--chekc', '--root', '/nonexistent-typo-root']);
  assertUsageFailure(result, 2, '--chekc');
});

test('check-repo-rules.cjs rejects the unknown --bogus-xyz flag', () => {
  const result = runScript(CHECK_REPO_RULES, ['--bogus-xyz', '--root', '/nonexistent-typo-root']);
  assertUsageFailure(result, 2, '--bogus-xyz');
});

test('validate-compiled-routing-scenarios.cjs rejects the misspelled --strct flag', () => {
  withTempDir((tmpDir) => {
    const result = runScript(VALIDATE_COMPILED_ROUTING, ['--dir', tmpDir, '--strct']);
    assertUsageFailure(result, 2, '--strct');
  });
});

test('validate-doc-model-refs.js rejects the unknown --bogus-xyz flag', () => {
  const result = runScript(VALIDATE_DOC_MODEL_REFS, ['--bogus-xyz']);
  assertUsageFailure(result, 2, '--bogus-xyz');
});

test('frontmatter-version.mjs rejects the unknown --bogus-xyz flag with its usage status 64', () => {
  const result = runScript(FRONTMATTER_VERSION, ['gate', '--bogus-xyz']);
  assertUsageFailure(result, 64, '--bogus-xyz');
});

test('lint-goal-criteria.cjs rejects the misspelled --alu flag', () => {
  const result = runScript(LINT_GOAL_CRITERIA, ['--alu']);
  assertUsageFailure(result, 2, '--alu');
});

test('ci-leaf-manifest-freshness.cjs rejects the unknown --bogus-xyz flag', () => {
  const result = runScript(CI_LEAF_MANIFEST_FRESHNESS, ['--bogus-xyz']);
  assertUsageFailure(result, 2, '--bogus-xyz');
});

test('ci-skill-derived-freshness.cjs rejects the unknown --bogus-xyz flag', () => {
  const result = runScript(CI_SKILL_DERIVED_FRESHNESS, ['--bogus-xyz']);
  assertUsageFailure(result, 2, '--bogus-xyz');
});

test('ci-skill-root-metadata.cjs rejects the unknown --bogus-xyz flag', () => {
  const result = runScript(CI_SKILL_ROOT_METADATA, ['--bogus-xyz']);
  assertUsageFailure(result, 2, '--bogus-xyz');
});

test('ci-skill-root-metadata.cjs rejects --format yaml and names the bad value', () => {
  const result = runScript(CI_SKILL_ROOT_METADATA, ['--format', 'yaml']);
  assertUsageFailure(result, 2, 'yaml');
});

test('ci-router-vocabulary-reach.cjs rejects the unknown --bogus-xyz flag', () => {
  const result = runScript(CI_ROUTER_VOCABULARY_REACH, ['--bogus-xyz', '--limit', '1']);
  assertUsageFailure(result, 2, '--bogus-xyz');
});

test('validate-playbook-topology.cjs rejects the misspelled --strct flag', () => {
  const result = runScript(VALIDATE_PLAYBOOK_TOPOLOGY, ['--skill-dir', '.skilled/skills/sk-doc', '--strct']);
  assertUsageFailure(result, 2, '--strct');
});

test('generate-router-intent-signals.cjs rejects the unknown --bogus-xyz flag in check mode', () => {
  const result = runScript(GENERATE_ROUTER_INTENT_SIGNALS, ['--check', '--bogus-xyz']);
  assertUsageFailure(result, 2, '--bogus-xyz');
});

test('generate-router-intent-signals.cjs rejects --hub with no value and names --hub', () => {
  const result = runScript(GENERATE_ROUTER_INTENT_SIGNALS, ['--check', '--hub']);
  assertUsageFailure(result, 2, '--hub');
});

test('generate-leaf-manifest.cjs rejects the unknown --bogus-xyz flag after --check', () => {
  const result = runScript(GENERATE_LEAF_MANIFEST, ['--check', '.skilled/skills/sk-doc', '--bogus-xyz']);
  assertUsageFailure(result, 2, '--bogus-xyz');
});

// A flag that is present but carries no value must still be named; printing
// the raw interpolated value would surface the literal string "undefined".
test('ci-leaf-manifest-freshness.cjs names a missing --format value', () => {
  const result = runScript(CI_LEAF_MANIFEST_FRESHNESS, ['--format']);
  assertUsageFailure(result, 2, '--format');
  assert.ok(!combinedOutput(result).includes('undefined'), `expected the usage line to name --format and not "undefined"\n${combinedOutput(result)}`);
});

test('ci-skill-root-metadata.cjs names a missing --format value', () => {
  const result = runScript(CI_SKILL_ROOT_METADATA, ['--format']);
  assertUsageFailure(result, 2, '--format');
  assert.ok(!combinedOutput(result).includes('undefined'), `expected the usage line to name --format and not "undefined"\n${combinedOutput(result)}`);
});
