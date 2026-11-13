#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Setup Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { parse: parseYaml } = require('yaml');

const DOCTOR = path.resolve(__dirname, '..', '..');
const ASSETS = path.join(DOCTOR, 'assets');
const read = (file) => fs.readFileSync(file, 'utf8');

const SETUP_WORKFLOW = parseYaml(read(path.join(ASSETS, 'doctor-setup.yaml')));
const SETUP_ROUTER = read(path.join(DOCTOR, 'setup.md'));
const SETUP_PRESENTATION = read(path.join(ASSETS, 'doctor-setup-presentation.txt'));
const SYMLINK_CHECK = parseYaml(read(path.join(ASSETS, 'doctor-symlink-check.yaml')));

const stepNamed = (workflow, prefix) => {
  const step = workflow.execution.steps.find((entry) => entry.startsWith(prefix));
  assert.ok(step, 'no workflow step starts with ' + prefix);
  return step;
};

const deliveryStep = stepNamed(SETUP_WORKFLOW, 'Leg delivery:');
const advisorStep = stepNamed(SETUP_WORKFLOW, 'Leg advisor:');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTRACT TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('the delivery step hands the absent Codex entry to the repair line the check printed', () => {
  assert.match(
    deliveryStep,
    /WARN codex-advisor-hook-absent is DEGRADED, with the repair line the check printed\./,
  );
  assert.doesNotMatch(
    deliveryStep,
    /codex-advisor-hook-absent[^.]*\/doctor:runtime-mirrors/,
  );

  const deliveryRow = SETUP_PRESENTATION
    .split('\n')
    .find((line) => line.startsWith('| delivery |'));
  assert.ok(deliveryRow, 'the presentation has no delivery repair row');
  assert.match(deliveryRow, /Absent Codex advisor entry: the repair line the check prints/);
});

test('the symlink output block maps the hook-wiring check exits to WARN and FAIL', () => {
  assert.match(
    SYMLINK_CHECK.output,
    /STATUS=WARN when the engine exits 0 and the hook-wiring check exits 1\./,
  );
  assert.match(
    SYMLINK_CHECK.output,
    /STATUS=FAIL when the hook-wiring check exits 2\./,
  );
  assert.match(
    SYMLINK_CHECK.output,
    /When the engine and the hook-wiring check end on different statuses, the worse one wins: FAIL over WARN over OK\./,
  );
});

test('the setup mutation boundary names the socket directory outside the repository', () => {
  assert.match(
    SETUP_WORKFLOW.mutation_boundaries.invariant,
    /\/tmp\/system-skill-advisor/,
  );
});

test('the setup workflow and router both name the unrecorded hook health state', () => {
  assert.match(advisorStep, /hook health not recorded/);
  assert.match(
    advisorStep,
    /When data\.hookHealth is absent, show hook health not recorded under the leg, because no prompt hook has written a record for this checkout yet: OpenCode has no prompt hook that writes one and an unapproved Codex hook never runs\./,
  );
  assert.match(SETUP_ROUTER, /hook health not recorded/);
});
