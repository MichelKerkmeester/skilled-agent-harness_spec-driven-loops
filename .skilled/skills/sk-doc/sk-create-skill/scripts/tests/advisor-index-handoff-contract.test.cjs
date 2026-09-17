#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ advisor-index-handoff-contract — pin the shared vocabulary across        ║
// ║ standalone create, parent create, and doctor adapters                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const HANDOFF_DOC = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc', 'sk-create-skill', 'references', 'shared', 'advisor-index-handoff.md');

const STANDALONE_AUTO = path.join(REPO_ROOT, '.opencode', 'commands', 'create', 'assets', 'create-skill-auto.yaml');
const STANDALONE_CONFIRM = path.join(REPO_ROOT, '.opencode', 'commands', 'create', 'assets', 'create-skill-confirm.yaml');
const STANDALONE_PRESENTATION = path.join(REPO_ROOT, '.opencode', 'commands', 'create', 'assets', 'create-skill-presentation.txt');

const PARENT_AUTO = path.join(REPO_ROOT, '.opencode', 'commands', 'create', 'assets', 'create-skill-parent-auto.yaml');
const PARENT_CONFIRM = path.join(REPO_ROOT, '.opencode', 'commands', 'create', 'assets', 'create-skill-parent-confirm.yaml');
const PARENT_PRESENTATION = path.join(REPO_ROOT, '.opencode', 'commands', 'create', 'assets', 'create-skill-parent-presentation.txt');

const DOCTOR_SKILL_ADVISOR = path.join(REPO_ROOT, '.opencode', 'commands', 'doctor', 'assets', 'doctor-skill-advisor.yaml');

const FULL_HANDOFF_SURFACES = [STANDALONE_AUTO, STANDALONE_CONFIRM, STANDALONE_PRESENTATION, PARENT_AUTO, PARENT_CONFIRM, PARENT_PRESENTATION];

// Fields that only apply to hub (class-H) roots — never legal in the
// standalone (class-S) Advisor/Index Handoff rendering per the guardrail
// in advisor-index-handoff.md § Class Applicability (A7).
const H_ONLY_FIELD_NAMES = ['mode-registry.json', 'hub-router.json', 'command-metadata.json'];

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function read(absolutePath) {
  return fs.readFileSync(absolutePath, 'utf8');
}

function extractStandaloneHandoffBlocks(text) {
  const fullHandoff = /Advisor\/Index Handoff[\s\S]*?(?=\n\s*\n(?:Context:|Leaf-manifest freshness:)|$)/u.exec(text);
  const narrowSignal = /Leaf-manifest freshness:[^\n]*/u.exec(text);
  return { fullHandoff: fullHandoff ? fullHandoff[0] : null, narrowSignal: narrowSignal ? narrowSignal[0] : null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS — the shared vocabulary contract itself
// ─────────────────────────────────────────────────────────────────────────────

test('advisor-index-handoff.md exists and defines the verification-state enum', () => {
  const text = read(HANDOFF_DOC);
  for (const state of ['NOT RUN', 'PASSED', 'FAILED', 'UNAVAILABLE (retryable)']) {
    assert.ok(text.includes(state), `advisor-index-handoff.md must define verification state "${state}"`);
  }
  for (const state of ['fresh', 'stale', 'missing']) {
    assert.ok(new RegExp(`\\b${state}\\b`, 'u').test(text), `advisor-index-handoff.md must define leaf-manifest state "${state}"`);
  }
});

test('advisor-index-handoff.md states the description.json / graph-vocabulary guardrail (A7)', () => {
  const text = read(HANDOFF_DOC);
  assert.match(text, /description\.json[\s\S]*never validated against graph vocabulary/iu);
  assert.match(text, /standalone[\s\S]*never asserts parent-hub metadata files/iu);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS — every full-handoff surface points at the one canonical doc
// ─────────────────────────────────────────────────────────────────────────────

test('every full-handoff create surface references advisor-index-handoff.md by path', () => {
  for (const absolutePath of FULL_HANDOFF_SURFACES) {
    const text = read(absolutePath);
    assert.ok(
      text.includes('advisor-index-handoff.md'),
      `${path.relative(REPO_ROOT, absolutePath)} must reference advisor-index-handoff.md, not restate the vocabulary inline`,
    );
  }
});

test('every full-handoff create surface reports refresh status as NOT RUN, never auto-refreshing', () => {
  // Presentation .txt files carry the literal rendered template; workflow
  // .yaml files describe the same outcome in prose within step_6_completion
  // ("refresh status is always NOT RUN") — both forms are acceptable, since
  // the YAML never claims to actually run the refresh.
  const NOT_RUN_PATTERN = /Refresh status:\s*NOT RUN|refresh status is always NOT RUN/iu;
  for (const absolutePath of FULL_HANDOFF_SURFACES) {
    const text = read(absolutePath);
    assert.match(
      text,
      NOT_RUN_PATTERN,
      `${path.relative(REPO_ROOT, absolutePath)} must report refresh status as NOT RUN — create never calls skill_graph_scan/advisor_rebuild itself`,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. TESTS — class applicability: standalone renders no H-only fields
// ─────────────────────────────────────────────────────────────────────────────

test('standalone create surfaces never render H-only metadata fields in the handoff', () => {
  for (const absolutePath of [STANDALONE_AUTO, STANDALONE_CONFIRM, STANDALONE_PRESENTATION]) {
    const text = read(absolutePath);
    const { fullHandoff, narrowSignal } = extractStandaloneHandoffBlocks(text);
    assert.ok(fullHandoff, `${path.relative(REPO_ROOT, absolutePath)} must have a full Advisor/Index Handoff block`);
    assert.ok(narrowSignal, `${path.relative(REPO_ROOT, absolutePath)} must have a narrow Leaf-manifest freshness line for reference-only/asset-only`);
    for (const fieldName of H_ONLY_FIELD_NAMES) {
      assert.equal(
        fullHandoff.includes(fieldName),
        false,
        `${path.relative(REPO_ROOT, absolutePath)}'s standalone handoff must not mention H-only field "${fieldName}"`,
      );
      assert.equal(
        narrowSignal.includes(fieldName),
        false,
        `${path.relative(REPO_ROOT, absolutePath)}'s narrow leaf-freshness line must not mention H-only field "${fieldName}"`,
      );
    }
  }
});

test('parent create surfaces render the H-specific fields (description.json, leaf-manifest.json, command-metadata.json)', () => {
  for (const absolutePath of [PARENT_AUTO, PARENT_CONFIRM, PARENT_PRESENTATION]) {
    const text = read(absolutePath);
    for (const fieldName of ['description.json', 'leaf-manifest.json', 'command-metadata.json']) {
      assert.ok(
        text.includes(fieldName),
        `${path.relative(REPO_ROOT, absolutePath)} must mention H-specific field "${fieldName}" in its handoff`,
      );
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. TESTS — parent leaf-manifest generation uses the scoped generator only
// ─────────────────────────────────────────────────────────────────────────────

test('parent create workflows use the scoped generate-leaf-manifest.cjs --write, never invoke the fleet --fix gate', () => {
  // "never invoke ... ci-skill-root-metadata.cjs --fix from this workflow" is
  // legal explanatory prose (why the scoped generator was chosen); an actual
  // invocation line (node ... ci-skill-root-metadata.cjs ... --fix) is not.
  const FLEET_FIX_INVOCATION = /ci-skill-root-metadata\.cjs[^\n]*--fix/u;
  for (const absolutePath of [PARENT_AUTO, PARENT_CONFIRM]) {
    const text = read(absolutePath);
    assert.ok(
      text.includes('generate-leaf-manifest.cjs --write'),
      `${path.relative(REPO_ROOT, absolutePath)} must generate leaf-manifest.json via the scoped generator`,
    );
    const fleetFixMentions = text.match(new RegExp(FLEET_FIX_INVOCATION, 'gu')) || [];
    for (const mention of fleetFixMentions) {
      const context = text.slice(Math.max(0, text.indexOf(mention) - 60), text.indexOf(mention));
      assert.match(
        context,
        /never invoke|not invoke/iu,
        `${path.relative(REPO_ROOT, absolutePath)}: "${mention}" must be explanatory prose (never/not invoke), not a real invocation`,
      );
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. TESTS — doctor adapter uses the same verification-state vocabulary
// ─────────────────────────────────────────────────────────────────────────────

test('doctor-skill-advisor.yaml derives skill_graph_validate severity using the shared vocabulary, not a top-level flag', () => {
  const text = read(DOCTOR_SKILL_ADVISOR);
  assert.match(text, /'fail' when is_valid = false/u);
  assert.match(text, /'warn' when is_valid = true and warning_count > 0/u);
  assert.match(text, /'pass' when is_valid = true and warning_count = 0/u);
  assert.match(text, /UNAVAILABLE \(retryable\), not FAILED/u);
});

test('doctor-skill-advisor.yaml terminal verification_status uses the fail/partial/pass/skipped_unverified vocabulary', () => {
  const text = read(DOCTOR_SKILL_ADVISOR);
  assert.match(text, /verification_status:\s*"pass \| fail \| partial \| skipped_unverified"/u);
});
