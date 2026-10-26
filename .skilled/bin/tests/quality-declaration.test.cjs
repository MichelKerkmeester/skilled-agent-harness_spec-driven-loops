#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Quality Declaration Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * The registry compiler is the only gate between an authored quality row and the
 * runner that loads the checklist it names. A row it accepts but cannot resolve
 * loads nothing, or the wrong file, while the run still reports clean, so the
 * negative cases here are the contract: whatever the compiler accepts, the runner
 * will act on without a second check.
 *
 * The fixture is the live hub registry and router, copied per case. A synthetic
 * registry would have to re-declare every destination, detector and tie-break the
 * compiler needs, and a mistake there would fail a case for a reason unrelated to
 * the quality row under test.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const SK_CODE_LIB = path.join(__dirname, '..', 'lib', 'compiled-routing', '009-parent-hub-rollout', '001-sk-code', 'lib');
const SK_CODE_ROOT = path.join(__dirname, '..', '..', 'skills', 'sk-code');
const { compileRegistry } = require(path.join(SK_CODE_LIB, 'registry-compiler.cjs'));

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

function hubFixture() {
  return {
    registry: JSON.parse(fs.readFileSync(path.join(SK_CODE_ROOT, 'mode-registry.json'), 'utf8')),
    hubRouter: JSON.parse(fs.readFileSync(path.join(SK_CODE_ROOT, 'hub-router.json'), 'utf8')),
  };
}

/** Compile the fixture hub, hashing the authored bytes it actually receives. */
function compileHub({ registry, hubRouter }) {
  const skillMarkdown = fs.readFileSync(path.join(SK_CODE_ROOT, 'SKILL.md'), 'utf8');
  return compileRegistry({
    activationGeneration: 1,
    hubRouter,
    registry,
    skillMarkdown,
    sourceBytes: {
      'SKILL.md': Buffer.from(skillMarkdown, 'utf8'),
      'hub-router.json': Buffer.from(JSON.stringify(hubRouter), 'utf8'),
      'mode-registry.json': Buffer.from(JSON.stringify(registry), 'utf8'),
    },
  });
}

/** The first mode whose quality block carries a checklist row to mutate. */
function firstDeclaredQuality(registry) {
  const mode = registry.modes.find((entry) => entry
    && entry.quality
    && Array.isArray(entry.quality.checklists)
    && entry.quality.checklists.length > 0);
  assert.ok(mode, 'the fixture hub must declare at least one quality checklist row');
  return mode.quality;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('quality: the declared hub compiles', () => {
  const snapshot = compileHub(hubFixture());
  assert.ok(snapshot.policy);
});

// Every key below would let a skill name a command, and a command may only ever
// come from the repository's quality config. The rest describe a row the runner
// could not resolve, so each is refused at compile time rather than at load.
const MALFORMED = [
  ['block carries commands', (block) => { block.commands = [['make', 'lint']]; }],
  ['row carries argv', (block) => { block.checklists[0].argv = ['make', 'lint']; }],
  ['row carries command', (block) => { block.checklists[0].command = 'make lint'; }],
  ['row carries run', (block) => { block.checklists[0].run = 'make lint'; }],
  ['row names no selector', (block) => {
    for (const key of ['paths', 'extensions', 'contentMarkers']) delete block.checklists[0][key];
  }],
  ['row file is not a markdown path', (block) => { block.checklists[0].file = 'sk-code-skilled/run.sh'; }],
  ['checklists is empty', (block) => { block.checklists = []; }],
];

for (const [name, mutate] of MALFORMED) {
  test(`quality: a row the runner cannot load fails the compiler, ${name}`, () => {
    const fixture = hubFixture();
    mutate(firstDeclaredQuality(fixture.registry));
    assert.throws(
      () => compileHub(fixture),
      (error) => error.code === 'QUALITY_DECLARATION_INVALID',
      `${name} must fail with QUALITY_DECLARATION_INVALID`,
    );
  });
}
