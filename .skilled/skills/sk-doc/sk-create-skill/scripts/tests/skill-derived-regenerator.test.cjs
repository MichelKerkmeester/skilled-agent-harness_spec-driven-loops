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
  input.key_files = [...input.key_files, '.skilled/skills/sk-git/DOES-NOT-EXIST.md']; // forces a repair
  const { derived, changes } = regen.repairDerived(SK_GIT_DIR, input);
  assert.ok(changes.some((c) => c.startsWith('key_files:')), 'the dead key_file should be pruned');
  assert.equal(derived.lifecycle_status, 'deprecated', 'lifecycle_status must survive the repair');
  assert.equal(derived.redirect_to, 'sk-code', 'redirect_to must survive the repair');
  assert.equal(derived.causal_summary, SK_GIT_DERIVED.causal_summary, 'causal_summary must be byte-identical');
}

// A dead structural reference is detected as drift (the freshness signal).
function testDeadKeyFilePrunedAndFlaggedStale() {
  const input = clone(SK_GIT_DERIVED);
  input.key_files = [...input.key_files, '.skilled/skills/sk-git/GHOST.md'];
  const { derived, changes } = regen.repairDerived(SK_GIT_DIR, input);
  assert.ok(!derived.key_files.includes('.skilled/skills/sk-git/GHOST.md'), 'ghost path pruned');
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
  derived.key_files = ['.skilled/skills/sk-git/SKILL.md', '.skilled/skills/sk-git/GHOST.md'];
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

// A private skill belongs to one checkout, so the all-roots listing never names it.
function testListSkillRootsSkipsPrivateSkills() {
  const tmpSkills = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'derived-roots-'));
  try {
    for (const name of ['alpha', 'local-private']) {
      fs.mkdirSync(path.join(tmpSkills, name));
      fs.writeFileSync(path.join(tmpSkills, name, 'graph-metadata.json'), '{}\n');
    }
    const roots = regen.listSkillRoots(tmpSkills).map((dir) => path.basename(dir));
    assert.deepEqual(roots, ['alpha'], 'a local-* skill must never be listed for regeneration');
  } finally {
    fs.rmSync(tmpSkills, { recursive: true, force: true });
  }
}

// An explicit --root must not reopen a private skill that --all skips: the run exits non-zero and writes nothing.
function testExplicitRootRefusesPrivateSkill() {
  const { spawnSync } = require('node:child_process');
  const tmpSkills = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'derived-root-'));
  try {
    const privateDir = path.join(tmpSkills, 'local-private');
    fs.mkdirSync(privateDir);
    const metaPath = path.join(privateDir, 'graph-metadata.json');
    fs.writeFileSync(metaPath, '{"derived":{}}\n');
    const linkDir = path.join(tmpSkills, 'neutral-name');
    fs.symlinkSync(privateDir, linkDir);
    const script = path.join(__dirname, '..', 'regenerate-skill-derived.cjs');
    for (const target of [privateDir, linkDir]) {
      const result = spawnSync(process.execPath, [script, '--root', target, '--write'], { encoding: 'utf8' });
      assert.equal(result.status, 2, 'a private root must exit non-zero');
      assert.match(result.stderr, /private skill root/);
      assert.equal(fs.readFileSync(metaPath, 'utf8'), '{"derived":{}}\n', 'a refused root must not be written');
    }
    assert.equal(regen.isPrivateSkillPath(SK_GIT_DIR), false, 'a tracked skill is not private');

    // A case-insensitive disk resolves a differently cased name to the same private directory.
    const shoutedDir = path.join(tmpSkills, 'LOCAL-Shouted');
    fs.mkdirSync(shoutedDir);
    const shoutedMeta = path.join(shoutedDir, 'graph-metadata.json');
    fs.writeFileSync(shoutedMeta, '{"derived":{}}\n');
    assert.equal(regen.isPrivateSkillPath(shoutedDir), true, 'the local- prefix must match in any case');
    const shoutedResult = spawnSync(process.execPath, [script, '--root', shoutedDir, '--write'], { encoding: 'utf8' });
    assert.equal(shoutedResult.status, 2, 'a differently cased private root must exit non-zero');
    assert.match(shoutedResult.stderr, /private skill root/);
    assert.equal(fs.readFileSync(shoutedMeta, 'utf8'), '{"derived":{}}\n', 'a refused root must not be written');
  } finally {
    fs.rmSync(tmpSkills, { recursive: true, force: true });
  }
}

// The router-vocabulary writer rewrites hub metadata, so it must not open a private hub.
// The script resolves the skills root from its own location, so it runs from a copy inside a temp tree.
function testRouterIntentSignalsSkipsPrivateHubs() {
  const { spawnSync } = require('node:child_process');
  const tmpRepo = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'router-signals-'));
  try {
    const scriptDir = path.join(tmpRepo, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts');
    fs.mkdirSync(scriptDir, { recursive: true });
    const script = path.join(scriptDir, 'generate-router-intent-signals.cjs');
    fs.copyFileSync(path.join(__dirname, '..', 'generate-router-intent-signals.cjs'), script);
    for (const name of ['alpha-hub', 'local-hub']) {
      const hubDir = path.join(tmpRepo, '.skilled', 'skills', name);
      fs.mkdirSync(hubDir, { recursive: true });
      fs.writeFileSync(path.join(hubDir, 'ROUTER.md'), 'INTENT_SIGNALS = {\n  "declared phrase here": 1\n}\n');
      fs.writeFileSync(path.join(hubDir, 'hub-router.json'), '{}\n');
      fs.writeFileSync(path.join(hubDir, 'graph-metadata.json'), JSON.stringify({ intent_signals: [] }));
    }
    const result = spawnSync(process.execPath, [script, '--check', '--json'], { encoding: 'utf8' });
    const hubs = JSON.parse(result.stdout).map((entry) => entry.hub);
    assert.deepEqual(hubs, ['alpha-hub'], 'a local-* hub must never be checked or written');
  } finally {
    fs.rmSync(tmpRepo, { recursive: true, force: true });
  }
}

testValidRootIsNoOp();
testAuthoredFieldsPreservedThroughRepair();
testDeadKeyFilePrunedAndFlaggedStale();
testEmptiedRequiredArrayErrors();
testGatePassesCleanFleet();
testGateFailsOnStaleRoot();
testGateExitsTwoOnBadInput();
testListSkillRootsSkipsPrivateSkills();
testExplicitRootRefusesPrivateSkill();
testRouterIntentSignalsSkipsPrivateHubs();

console.log('[sk-doc] skill-derived regenerator + freshness gate coverage passed');
