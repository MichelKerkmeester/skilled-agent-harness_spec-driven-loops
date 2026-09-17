#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ skill-derived-regenerator.test — regenerator + freshness-gate coverage   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const regen = require('../regenerate-skill-derived.cjs');
const gate = require('../ci-skill-derived-freshness.cjs');

// A real, currently-valid root is the fixture for preservation/idempotency: the
// regenerator must be a no-op on content that already matches disk.
const SK_GIT_DIR = path.join(regen.SKILLS_DIR, 'sk-git');
const SK_GIT_DERIVED = JSON.parse(fs.readFileSync(path.join(SK_GIT_DIR, 'graph-metadata.json'), 'utf8')).derived;

function clone(v) { return JSON.parse(JSON.stringify(v)); }

// A valid root round-trips unchanged (idempotent, zero routing change).
function testValidRootIsNoOp() {
  const { changes, errors, derived } = regen.repairDerived(SK_GIT_DIR, clone(SK_GIT_DERIVED));
  assert.deepEqual(errors, [], 'a valid root must produce no errors');
  assert.deepEqual(changes, [], 'a valid root must need no repairs');
  assert.equal(regen.derivedChanged(SK_GIT_DERIVED, derived), false, 'repair of a valid block must not change it');
}

// Authored fields survive a repair byte-identical, even when a structural repair
// happens alongside them — the exact "do not silently overwrite an authored
// lifecycle decision on a routine pass" guarantee.
function testAuthoredFieldsPreservedThroughRepair() {
  const input = clone(SK_GIT_DERIVED);
  input.lifecycle_status = 'deprecated';
  input.redirect_to = 'sk-code';
  input.key_files = [...input.key_files, '.opencode/skills/sk-git/DOES-NOT-EXIST.md']; // forces a repair
  const { derived, changes } = regen.repairDerived(SK_GIT_DIR, input);
  assert.ok(changes.some((c) => c.startsWith('key_files:')), 'the dead key_file should be pruned');
  assert.equal(derived.lifecycle_status, 'deprecated', 'lifecycle_status must survive the repair');
  assert.equal(derived.redirect_to, 'sk-code', 'redirect_to must survive the repair');
  assert.equal(derived.causal_summary, SK_GIT_DERIVED.causal_summary, 'causal_summary must be byte-identical');
}

// A dead structural reference is detected as drift (the freshness signal).
function testDeadKeyFilePrunedAndFlaggedStale() {
  const input = clone(SK_GIT_DERIVED);
  input.key_files = [...input.key_files, '.opencode/skills/sk-git/GHOST.md'];
  const { derived, changes } = regen.repairDerived(SK_GIT_DIR, input);
  assert.ok(!derived.key_files.includes('.opencode/skills/sk-git/GHOST.md'), 'ghost path pruned');
  assert.equal(regen.derivedChanged(input, derived), true, 'a pruned dead reference is a real change');
  assert.ok(changes.length > 0);
}

// The regenerator refuses to fabricate: if pruning would empty a required array
// (the authored content is genuinely gone from disk), it errors rather than
// writing a compiler-invalid block.
function testEmptiedRequiredArrayErrors() {
  const input = clone(SK_GIT_DERIVED);
  input.source_docs = ['references/THIS-IS-GONE.md'];
  const { errors } = regen.repairDerived(SK_GIT_DIR, input);
  assert.ok(errors.some((e) => e.includes('source_docs')), 'an emptied required array must error, not silently pass');
}

// The fleet gate passes on the real, clean skills tree (exit 0).
function testGatePassesCleanFleet() {
  const original = process.stdout.write.bind(process.stdout);
  process.stdout.write = () => true;
  let code;
  try { code = gate.run([]); } finally { process.stdout.write = original; }
  assert.equal(code, 0, 'the freshness gate must pass on the clean fleet');
}

// The gate fails (exit 1) when a root carries a dead reference.
function testGateFailsOnStaleRoot() {
  const tmpSkills = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'derived-gate-'));
  const demo = path.join(tmpSkills, 'demo');
  fs.mkdirSync(path.join(demo, 'references'), { recursive: true });
  // Make source_docs resolvable so we isolate the dead-key_file (stale) path.
  fs.writeFileSync(path.join(demo, 'references', 'a.md'), '# a\n');
  const derived = clone(SK_GIT_DERIVED);
  derived.source_docs = ['references/a.md'];
  derived.key_files = ['.opencode/skills/sk-git/SKILL.md', '.opencode/skills/sk-git/GHOST.md'];
  fs.writeFileSync(path.join(demo, 'graph-metadata.json'), JSON.stringify({ schema_version: 2, derived }, null, 2));
  const original = process.stdout.write.bind(process.stdout);
  process.stdout.write = () => true;
  let code;
  try { code = gate.run(['--skills-dir', tmpSkills]); } finally { process.stdout.write = original; fs.rmSync(tmpSkills, { recursive: true, force: true }); }
  assert.equal(code, 1, 'the gate must fail on a root with a dead key_file');
}

// The gate exits 2 when the skills dir is not a directory (cannot run).
function testGateExitsTwoOnBadInput() {
  const f = require('node:os').tmpdir() + '/not-a-dir-' + process.pid;
  fs.writeFileSync(f, 'x');
  const originalErr = process.stderr.write.bind(process.stderr);
  process.stderr.write = () => true;
  let code;
  try { code = gate.run(['--skills-dir', f]); } finally { process.stderr.write = originalErr; fs.rmSync(f, { force: true }); }
  assert.equal(code, 2);
}

testValidRootIsNoOp();
testAuthoredFieldsPreservedThroughRepair();
testDeadKeyFilePrunedAndFlaggedStale();
testEmptiedRequiredArrayErrors();
testGatePassesCleanFleet();
testGateFailsOnStaleRoot();
testGateExitsTwoOnBadInput();

console.log('[sk-doc] skill-derived regenerator + freshness gate coverage passed');
