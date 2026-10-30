#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Runtime Mirrors Contract Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * The runtime-mirrors route and its workflow are two halves of one contract: the
 * manifest declares which checkers run, and the workflow has to invoke each one
 * in its check-only form. A mirror check the repository's CI runs but this pair
 * omits is the failure mode worth a test, because a local run then reports in
 * sync while the remote run fails on the same tree.
 *
 * Both Hermes checks are asserted here in the shape their neighbours use,
 * including the n/a rule: a checkout with no `.hermes/` tree is reported as n/a
 * rather than created, so a read-only diagnostic never has a write side effect.
 *
 * Both files resolve through an environment override so the removed-line case can
 * be exercised against a copy in a scratch directory instead of by deleting a
 * line from a tracked file.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { parse: parseYaml } = require('yaml');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const COMMANDS_DIR = path.join(REPO_ROOT, '.skilled', 'commands', 'doctor');
const ASSETS_DIR = path.join(COMMANDS_DIR, 'assets');
const ROUTES_PATH = process.env.DOCTOR_ROUTES_MANIFEST || path.join(COMMANDS_DIR, '_routes.yaml');
const WORKFLOW_PATH =
  process.env.DOCTOR_RUNTIME_MIRRORS_WORKFLOW || path.join(ASSETS_DIR, 'doctor-runtime-mirrors.yaml');

const ROUTE_TARGET = 'runtime-mirrors';

// Each Hermes check with the surface it mirrors and the upstream_assets key the
// workflow refers to it by. `surface` is asserted in the step text because a step
// that names the key without saying what it covers reports nothing an operator can
// act on.
const HERMES_CHECKS = [
  {
    key: 'hermes_skills',
    script: '.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs',
    surface: '.hermes/skills',
  },
  {
    key: 'hermes_prompts',
    script: '.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs',
    surface: '.hermes/prompts',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. READERS AND SMALL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function read(absolutePath) {
  return fs.readFileSync(absolutePath, 'utf8');
}

function tokens(entry) {
  return String(entry).split(/\s+/).filter(Boolean);
}

function deleteLines(source, predicate) {
  return source.split('\n').filter((line) => !predicate(line)).join('\n');
}

function runtimeMirrorsRoute(manifestText) {
  const manifest = parseYaml(manifestText);
  const routes = manifest && Array.isArray(manifest.routes) ? manifest.routes : [];
  const route = routes.find((entry) => entry && entry.target === ROUTE_TARGET);
  assert.ok(route, `no route with target '${ROUTE_TARGET}' in ${ROUTES_PATH}`);
  return route;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GAP DETECTION, PURE SO A REMOVED LINE IS OBSERVABLE
// ─────────────────────────────────────────────────────────────────────────────

/** Manifest gaps: a Hermes check missing from script_invocations, or not check-only. */
function routeGaps(manifestText) {
  const route = runtimeMirrorsRoute(manifestText);
  const invocations = Array.isArray(route.script_invocations) ? route.script_invocations : [];
  const gaps = [];
  for (const check of HERMES_CHECKS) {
    const entry = invocations.find((invocation) => tokens(invocation).includes(check.script));
    if (!entry) {
      gaps.push(`script_invocations never runs ${check.script}`);
      continue;
    }
    if (tokens(entry)[0] !== 'node') {
      gaps.push(`${check.script} is not invoked through node`);
    }
    if (!tokens(entry).includes('--check')) {
      gaps.push(`${check.script} is not in its --check form`);
    }
  }
  return gaps;
}

/** Workflow gaps: no upstream_assets entry, or no step with the surface and n/a rule. */
function workflowGaps(workflowText) {
  const document = parseYaml(workflowText);
  const assets = (document && document.upstream_assets) || {};
  const steps = document && document.execution && Array.isArray(document.execution.steps)
    ? document.execution.steps
    : [];
  const gaps = [];

  for (const check of HERMES_CHECKS) {
    if (assets[check.key] !== check.script) {
      gaps.push(`upstream_assets.${check.key} does not name ${check.script}`);
    }

    const step = steps.find((entry) => typeof entry === 'string' && entry.includes(`upstream_assets.${check.key}`));
    if (!step) {
      gaps.push(`no execution step runs upstream_assets.${check.key}`);
      continue;
    }
    if (!step.includes('--check')) {
      gaps.push(`the ${check.key} step does not run the check-only form`);
    }
    if (!step.includes(check.surface)) {
      gaps.push(`the ${check.key} step does not name the ${check.surface} surface it covers`);
    }
    if (!/\bn\/a\b/.test(step)) {
      gaps.push(`the ${check.key} step never reports n/a`);
    }
    if (!step.includes('.hermes/')) {
      gaps.push(`the ${check.key} step never names the .hermes/ tree whose absence makes it n/a`);
    }
    if (!/never creates/i.test(step)) {
      gaps.push(`the ${check.key} step does not say the run never creates .hermes/`);
    }
  }
  return gaps;
}

/** Output gaps: no repair line, a repair line that is the check form, or an unrendered one. */
function repairGaps(workflowText) {
  const document = parseYaml(workflowText);
  const outputLines = String((document && document.output) || '').split('\n');
  const gaps = [];

  for (const check of HERMES_CHECKS) {
    const line = outputLines.find((candidate) => candidate.includes(check.script));
    if (!line) {
      gaps.push(`the output block carries no repair line for ${check.script}`);
      continue;
    }
    if (line.includes('--check')) {
      gaps.push(`the repair line for ${check.script} is the check form, not the generator`);
    }
    if (!line.includes('->')) {
      gaps.push(`the repair line for ${check.script} is not rendered as "<surface> -> <command>"`);
    }
  }
  return gaps;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE MANIFEST AND WORKFLOW AS THEY SHIP
// ─────────────────────────────────────────────────────────────────────────────

test('the route declares both Hermes checks in their check-only form', () => {
  assert.deepEqual(routeGaps(read(ROUTES_PATH)), []);
});

test('the workflow names both Hermes checks and reports n/a when .hermes/ is absent', () => {
  assert.deepEqual(workflowGaps(read(WORKFLOW_PATH)), []);
});

test('the output block carries a generator repair line for each Hermes check', () => {
  assert.deepEqual(repairGaps(read(WORKFLOW_PATH)), []);
});

test('the route stays read-only and never runs a mirror generator in write mode', () => {
  const route = runtimeMirrorsRoute(read(ROUTES_PATH));
  assert.equal(route.mutating, 'read-only');

  const writers = (route.script_invocations || []).filter((entry) => {
    const parts = tokens(entry);
    const namesGenerator = parts.some((token) => /(?:^|\/)(?:sync-|install-)[\w.-]+\.(?:cjs|mjs)$/.test(token));
    return namesGenerator && !parts.includes('--check');
  });
  assert.deepEqual(writers, [], 'every generator invocation must carry --check');

  const boundaries = parseYaml(read(WORKFLOW_PATH)).mutation_boundaries || {};
  assert.equal(boundaries.read_only, true);
  assert.ok((boundaries.forbidden_targets || []).includes('**/*'));
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE CONTRACT FAILS WHEN EITHER LINE GOES MISSING
// ─────────────────────────────────────────────────────────────────────────────

test('the contract fails when a Hermes line is removed from the route', () => {
  const manifestText = read(ROUTES_PATH);
  for (const check of HERMES_CHECKS) {
    const stripped = deleteLines(manifestText, (line) => line.includes(check.script));
    const gaps = routeGaps(stripped);
    assert.ok(
      gaps.some((gap) => gap.includes(check.script)),
      `removing ${check.script} from script_invocations went unnoticed`,
    );
  }
});

test('the contract fails when a Hermes asset, step or repair line leaves the workflow', () => {
  const workflowText = read(WORKFLOW_PATH);
  for (const check of HERMES_CHECKS) {
    const withoutAsset = deleteLines(workflowText, (line) => line.includes(check.script));
    assert.ok(
      workflowGaps(withoutAsset).some((gap) => gap.includes(`upstream_assets.${check.key}`)),
      `removing upstream_assets.${check.key} went unnoticed`,
    );

    const withoutStep = deleteLines(workflowText, (line) => line.includes(`upstream_assets.${check.key}`));
    assert.ok(
      workflowGaps(withoutStep).some((gap) => gap.includes(`no execution step runs upstream_assets.${check.key}`)),
      `removing the ${check.key} step went unnoticed`,
    );

    const withoutRepair = deleteLines(
      workflowText,
      (line) => line.includes(check.script) && line.includes('->'),
    );
    assert.ok(
      repairGaps(withoutRepair).some((gap) => gap.includes(check.script)),
      `removing the ${check.script} repair line went unnoticed`,
    );
  }
});

test('the contract fails when a step loses its n/a rule or names no surface', () => {
  const workflowText = read(WORKFLOW_PATH);
  for (const check of HERMES_CHECKS) {
    const bareStep = workflowText
      .split('\n')
      .map((line) => {
        if (!line.includes(`upstream_assets.${check.key}`)) return line;
        return line.replace(/\bn\/a\b/g, 'nothing').replace(check.surface, 'the tree');
      })
      .join('\n');
    const gaps = workflowGaps(bareStep);
    assert.ok(gaps.some((gap) => gap.includes(`the ${check.key} step never reports n/a`)));
    assert.ok(gaps.some((gap) => gap.includes(`the ${check.key} step does not name the ${check.surface} surface`)));
  }
});
