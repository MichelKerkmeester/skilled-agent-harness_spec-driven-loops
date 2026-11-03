#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ generate-router-intent-signals-orphans.test — provenance + prune coverage ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers the reverse of a missing phrase: a phrase an earlier `--write` recorded
 * in `intent_signals_generated` that its router no longer declares. The script
 * resolves its skills root from its own location, so every case copies it into a
 * throwaway repo and runs it there.
 *
 * What must hold: an orphan is reported by `--check` and pruned by `--write` from
 * both lists; a keep-listed phrase and a hand-curated phrase are neither reported
 * nor removed; a newly declared phrase joins both lists; and a hub with no
 * provenance arrays has no orphans.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SCRIPT_SOURCE = path.join(__dirname, '..', 'generate-router-intent-signals.cjs');

function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'router-signals-orphans-'));
  const scriptDir = path.join(dir, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts');
  fs.mkdirSync(scriptDir, { recursive: true });
  const script = path.join(scriptDir, 'generate-router-intent-signals.cjs');
  fs.copyFileSync(SCRIPT_SOURCE, script);
  return {
    dir,
    script,
    skills: path.join(dir, '.skilled', 'skills'),
    remove() { fs.rmSync(dir, { recursive: true, force: true }); },
  };
}

function addHub(repo, name, spec) {
  const hubDir = path.join(repo.skills, name);
  fs.mkdirSync(hubDir, { recursive: true });
  const lines = ['INTENT_SIGNALS = {'];
  for (const [index, phrase] of (spec.declared || []).entries()) {
    lines.push(`  "${phrase}": ${index + 1},`);
  }
  lines.push('}', '');
  fs.writeFileSync(path.join(hubDir, 'ROUTER.md'), lines.join('\n'));
  fs.writeFileSync(path.join(hubDir, 'hub-router.json'), '{}\n');
  fs.writeFileSync(path.join(hubDir, 'graph-metadata.json'), `${JSON.stringify(spec.metadata, null, 2)}\n`);
}

function run(repo, ...args) {
  return spawnSync(process.execPath, [repo.script, ...args], { encoding: 'utf8' });
}

function metadataOf(repo, hub) {
  return JSON.parse(fs.readFileSync(path.join(repo.skills, hub, 'graph-metadata.json'), 'utf8'));
}

test('--check reports a generated phrase no router declares as an orphan', () => {
  const repo = makeRepo();
  try {
    addHub(repo, 'alpha-hub', {
      declared: ['declared phrase here'],
      metadata: {
        skill_id: 'alpha-hub',
        intent_signals: ['declared phrase here', 'old generated phrase'],
        intent_signals_generated: ['declared phrase here', 'old generated phrase'],
      },
    });
    const result = run(repo, '--check');
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /^ {7}- old generated phrase$/m);
    assert.match(result.stdout, /orphans= {2}1/);
    assert.match(result.stdout, /RESULT: FAILED/);

    const json = run(repo, '--check', '--json');
    assert.equal(json.status, 1, json.stdout + json.stderr);
    const [row] = JSON.parse(json.stdout);
    assert.deepEqual(row.orphans, ['old generated phrase']);
    assert.equal(row.removed, 1);
    assert.equal(row.added, 0);
    assert.equal(row.before, 2);
    assert.equal(row.after, 1);
    assert.deepEqual(row.phrases, []);
  } finally {
    repo.remove();
  }
});

test('--write removes the orphan from both lists and keeps the surviving order', () => {
  const repo = makeRepo();
  try {
    addHub(repo, 'alpha-hub', {
      declared: ['zeta stays', 'alpha stays'],
      metadata: {
        skill_id: 'alpha-hub',
        intent_signals: ['zeta stays', 'renamed away', 'alpha stays'],
        intent_signals_generated: ['zeta stays', 'renamed away', 'alpha stays'],
      },
    });
    const result = run(repo, '--write');
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const meta = metadataOf(repo, 'alpha-hub');
    assert.deepEqual(meta.intent_signals, ['zeta stays', 'alpha stays']);
    assert.deepEqual(meta.intent_signals_generated, ['zeta stays', 'alpha stays']);
    assert.equal(meta.skill_id, 'alpha-hub');
  } finally {
    repo.remove();
  }
});

test('a keep-listed generated phrase is neither reported nor removed', () => {
  const repo = makeRepo();
  try {
    addHub(repo, 'alpha-hub', {
      declared: [],
      metadata: {
        skill_id: 'alpha-hub',
        intent_signals: ['kept generated phrase'],
        intent_signals_generated: ['kept generated phrase'],
        intent_signals_keep: ['kept generated phrase'],
      },
    });
    const check = run(repo, '--check');
    assert.equal(check.status, 0, check.stdout + check.stderr);
    assert.ok(!check.stdout.includes('kept generated phrase'), check.stdout);
    assert.match(check.stdout, /orphans= {2}0/);
    assert.match(check.stdout, /RESULT: PASSED/);

    const write = run(repo, '--write');
    assert.equal(write.status, 0, write.stdout + write.stderr);
    const meta = metadataOf(repo, 'alpha-hub');
    assert.deepEqual(meta.intent_signals, ['kept generated phrase']);
    assert.deepEqual(meta.intent_signals_generated, ['kept generated phrase']);
  } finally {
    repo.remove();
  }
});

test('a hand-curated undeclared phrase is neither reported nor removed', () => {
  const repo = makeRepo();
  try {
    addHub(repo, 'alpha-hub', {
      declared: [],
      metadata: {
        skill_id: 'alpha-hub',
        intent_signals: ['hand curated phrase'],
      },
    });
    const check = run(repo, '--check');
    assert.equal(check.status, 0, check.stdout + check.stderr);
    assert.ok(!check.stdout.includes('hand curated phrase'), check.stdout);
    assert.match(check.stdout, /RESULT: PASSED/);

    const write = run(repo, '--write');
    assert.equal(write.status, 0, write.stdout + write.stderr);
    const meta = metadataOf(repo, 'alpha-hub');
    assert.deepEqual(meta.intent_signals, ['hand curated phrase']);
    assert.equal(meta.intent_signals_generated, undefined);
  } finally {
    repo.remove();
  }
});

test('--write records a newly declared phrase in both lists', () => {
  const repo = makeRepo();
  try {
    addHub(repo, 'alpha-hub', {
      declared: ['new declared phrase'],
      metadata: { skill_id: 'alpha-hub', intent_signals: [] },
    });
    const result = run(repo, '--write');
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const meta = metadataOf(repo, 'alpha-hub');
    assert.deepEqual(meta.intent_signals, ['new declared phrase']);
    assert.deepEqual(meta.intent_signals_generated, ['new declared phrase']);
  } finally {
    repo.remove();
  }
});

test('an empty intent_signals with no provenance arrays reports nothing', () => {
  const repo = makeRepo();
  try {
    addHub(repo, 'alpha-hub', {
      declared: [],
      metadata: { skill_id: 'alpha-hub', intent_signals: [] },
    });
    const result = run(repo, '--check');
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.doesNotMatch(result.stdout, /^ {7}[+-] /m);
    assert.match(result.stdout, /missing= {2}0/);
    assert.match(result.stdout, /orphans= {2}0/);
    assert.match(result.stdout, /RESULT: PASSED/);
  } finally {
    repo.remove();
  }
});
