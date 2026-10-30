#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Doctor Helper Match Tests
// ───────────────────────────────────────────────────────────────────

'use strict';

// Holds the doctor helper matcher to the two promises that make it worth having.
//
// The first is that it ranks doctor commands the way an operator describes a
// problem. That promise is measured against a held-out set authored before any
// scoring constant existed and pinned by sha256 here, so a later tuning pass
// cannot quietly move the bar it is judged by. Only `tune.jsonl` may be read
// while the constants change.
//
// The second is that it stays a read-only derivation of the route manifest. The
// ids and runnables it derives are checked against the manifest shape the bridge
// deriver reads, private `local-*` names never leave the loader, and the source
// is inspected for the process and write APIs a read-only diagnostic must not
// carry.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'doctor-helper-match.cjs');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const FIXTURES = path.join(__dirname, 'fixtures', 'doctor-helper');
const HELDOUT = path.join(FIXTURES, 'heldout.jsonl');
const TUNE = path.join(FIXTURES, 'tune.jsonl');

// Pinned when the held-out set was authored, before the matcher existed. A
// changed hash means the bar moved, so the suite fails rather than re-baselines.
const HELDOUT_SHA256 = 'd95d629cfdd8ffa5f18fd0bd81c887f5289b91352ab3ef383493c18057eb1e02';

const BAR = { top1: 0.8, top3: 0.9, negatives: 0.9 };

const matcher = require(SCRIPT);

const tempRoots = [];

function makeRoot(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-helper-match-'));
  tempRoots.push(root);
  for (const [relative, body] of Object.entries(files)) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, body);
  }
  return root;
}

test.after(() => {
  for (const root of tempRoots) fs.rmSync(root, { recursive: true, force: true });
});

function run(args, options = {}) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', ...options });
}

function runJson(args) {
  const result = run(args);
  return { ...result, json: result.stdout.trim() ? JSON.parse(result.stdout) : null };
}

function readJsonl(file) {
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
}

/**
 * A small manifest that carries one instance of every entry shape the loader has
 * to derive: a multi-target command, a single-target command, a standalone with
 * its own runnable and a nested action, an mcp sub-action, and two private names
 * that must never surface.
 */
const FIXTURE_MANIFEST = `schema_version: 1
routes:
  - command: /doctor:fixture-multi
    target: hooks
    yaml: doctor-fixture-hooks.yaml
    setup_vars: [execution_mode]
    allowed_flags: []
    mutating: mutates
    gate3_location: "the git config key the switch writes"
    mcp_tools: []
    script_invocations: ['node .skilled/commands/doctor/scripts/fixture.cjs']
    trigger_phrases:
      - "hook blocks my commit"
      - "switch the gate off"
  - command: /doctor:fixture-multi
    target: setup
    default_target: true
    yaml: doctor-fixture-setup.yaml
    setup_vars: [execution_mode]
    allowed_flags: []
    mutating: read-only
    gate3_location: "n/a (read-only fixture battery)"
    mcp_tools: []
    script_invocations: ['node .skilled/commands/doctor/scripts/fixture.cjs']
    trigger_phrases:
      - "is the fixture wired up"
  - command: /doctor:fixture-single
    target: report
    yaml: doctor-fixture-report.yaml
    setup_vars: [execution_mode]
    allowed_flags: []
    mutating: read-only
    gate3_location: "n/a (read-only fixture report)"
    mcp_tools: []
    script_invocations: ['node .skilled/commands/doctor/scripts/fixture.cjs']
    trigger_phrases:
      - "fixture report for the whole family"
  - command: /doctor:local-probe
    target: local-probe
    yaml: doctor-fixture-report.yaml
    setup_vars: [execution_mode]
    allowed_flags: []
    mutating: read-only
    gate3_location: "n/a (read-only fixture report)"
    mcp_tools: []
    script_invocations: ['node .skilled/commands/doctor/scripts/fixture.cjs']
    trigger_phrases:
      - "local probe phrase here"
standalone:
  - command: /doctor:fixture-standalone
    file: .skilled/commands/doctor/fixture-standalone.md
    yaml: doctor-fixture-report.yaml
    mutating: mutates
    runnable: /doctor:fixture-standalone list
    actions:
      check:
        yaml: doctor-fixture-report.yaml
        mutating: read-only
      compat:
        yaml: doctor-fixture-report.yaml
        mutating: mutates
        trigger_phrases:
          - "migrate the fixture layout"
    trigger_phrases:
      - "standalone fixture phrase"
mcp_subroutes:
  - sub_action: install
    yaml: doctor-fixture-report.yaml
    allowed_flags: []
    mutating: mutates
    gate3_location: "the fixture configuration"
    trigger_phrases:
      - "install the fixture server"
`;

const FIXTURE_FILES = {
  '.skilled/commands/doctor/_routes.yaml': FIXTURE_MANIFEST,
  '.skilled/commands/doctor/fixture-multi.md':
    '---\ndescription: "Fixture multi-target command for hook gates and setup checks."\n---\n',
  '.skilled/commands/doctor/fixture-single.md':
    '---\ndescription: "Fixture single-target command reporting on the family."\n---\n',
  '.skilled/commands/doctor/fixture-standalone.md':
    '---\ndescription: "Fixture standalone command for release and migration work."\n---\n',
  '.skilled/commands/doctor/mcp.md':
    '---\ndescription: "Fixture mcp command installing and debugging the server."\n---\n',
  '.skilled/commands/doctor/local-probe.md':
    '---\ndescription: "Local probe router that must never surface."\n---\n',
};

function fixtureRoot() {
  return makeRoot(FIXTURE_FILES);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE TOKENIZER, THROUGH THE ONE SURFACE THAT EXPOSES IT
// ─────────────────────────────────────────────────────────────────────────────

test('a query keeps each hyphenated term with its parts and drops the stopwords', () => {
  const { entries } = matcher.loadEntries(REPO_ROOT);
  const result = matcher.rankProblem(entries, 'Fix the Pre-Commit hook', {});
  assert.deepEqual(result.terms.slice(0, 4), ['fix', 'pre-commit', 'pre', 'commit']);
  assert.ok(result.terms.includes('hook'));
  for (const stopword of ['the', 'my', 'a', 'is']) {
    assert.ok(!result.terms.includes(stopword), stopword);
  }
});

test('a plural and a past tense reduce to the same stem as the manifest wording', () => {
  const { entries } = matcher.loadEntries(REPO_ROOT);
  const result = matcher.rankProblem(entries, 'commits rejected by hooks', {});
  assert.ok(result.terms.includes('commit'), result.terms.join(' '));
  assert.ok(result.terms.includes('reject'), result.terms.join(' '));
  assert.ok(result.terms.includes('hook'), result.terms.join(' '));
  assert.ok(!result.terms.includes('commits'));
  assert.ok(!result.terms.includes('rejected'));
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. DERIVATION FROM THE MANIFEST
// ─────────────────────────────────────────────────────────────────────────────

test('the loader derives the same ids, runnables and classes the bridge deriver would', () => {
  const root = fixtureRoot();
  const { entries, skippedPrivate, manifest } = matcher.loadEntries(root);
  const byId = new Map(entries.map((entry) => [entry.id, entry]));

  const hooks = byId.get('command-doctor-fixture-multi-hooks');
  assert.ok(hooks, 'a multi-target command keeps one id per target');
  assert.equal(hooks.runnable, '/doctor:fixture-multi hooks');
  assert.equal(hooks.command, '/doctor:fixture-multi');
  assert.equal(hooks.target, 'hooks');
  assert.equal(hooks.section, 'routes');
  assert.equal(hooks.mutating, 'mutates');
  assert.equal(hooks.writes, true);
  assert.equal(hooks.defaultTarget, false);

  const setup = byId.get('command-doctor-fixture-multi-setup');
  assert.equal(setup.defaultTarget, true);
  assert.equal(setup.writes, false);

  const single = byId.get('command-doctor-fixture-single');
  assert.ok(single, 'a single-target command takes the command id');
  assert.equal(single.runnable, '/doctor:fixture-single');

  const standalone = byId.get('command-doctor-fixture-standalone');
  assert.equal(standalone.runnable, '/doctor:fixture-standalone list');
  assert.equal(standalone.section, 'standalone');
  // The bare command runs the check action, so the class shown is that action's.
  assert.equal(standalone.mutating, 'read-only');

  const compat = byId.get('command-doctor-fixture-standalone-action-compat');
  assert.ok(compat, 'a standalone action becomes its own entry');
  assert.equal(compat.runnable, '/doctor:fixture-standalone compat');
  assert.equal(compat.section, 'action');
  assert.equal(compat.mutating, 'mutates');
  assert.deepEqual(compat.phrases, ['migrate the fixture layout']);

  const mcp = byId.get('command-doctor-mcp-install');
  assert.equal(mcp.runnable, '/doctor:mcp install');
  assert.equal(mcp.section, 'mcp_subroutes');

  assert.equal(skippedPrivate, 1);
  assert.equal(manifest.path, '.skilled/commands/doctor/_routes.yaml');
});

test('a private command and a private target never reach the entry list', () => {
  const root = fixtureRoot();
  const { entries } = matcher.loadEntries(root);
  assert.ok(!entries.some((entry) => entry.command.includes('local-')));
  assert.ok(!entries.some((entry) => entry.target && entry.target.startsWith('local-')));

  for (const args of [['--table', `--root=${root}`], ['--areas', `--root=${root}`]]) {
    const result = run(args);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(!(`${result.stdout}${result.stderr}`).includes('local-'), args[0]);
  }
});

test('a router description is read as secondary vocabulary and never as a phrase', () => {
  const root = fixtureRoot();
  const { entries } = matcher.loadEntries(root);
  const multi = entries.find((entry) => entry.id === 'command-doctor-fixture-multi-hooks');
  assert.match(multi.description, /hook gates/i);
  assert.ok(!multi.phrases.some((phrase) => /hook gates/i.test(phrase)));
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. RANKING, REASONS AND THE TIE-BREAK
// ─────────────────────────────────────────────────────────────────────────────

test('the reason line quotes the best-covered manifest phrase and the terms it matched', () => {
  const { entries } = matcher.loadEntries(REPO_ROOT);
  const result = matcher.rankProblem(entries, 'my pre-commit hook keeps rejecting my commit', {});
  assert.equal(result.status, 'match');
  const first = result.candidates[0];
  assert.equal(first.rank, 1);
  assert.equal(first.runnable, '/doctor:git hooks');
  assert.equal(first.mutating, 'mutates');
  assert.equal(first.matchedPhrase, 'pre-commit gate keeps blocking');
  assert.deepEqual(first.matchedTerms, ['pre-commit', 'pre', 'commit']);
  assert.match(first.reason, /^matches "pre-commit gate keeps blocking" \(/);
  assert.ok(result.candidates.length <= 3);
});

test('a tie prefers the default target, then the read-only entry, then manifest order', () => {
  const entries = [
    {
      id: 'command-doctor-tie-write',
      command: '/doctor:tie',
      target: 'write',
      runnable: '/doctor:tie write',
      section: 'routes',
      mutating: 'mutates',
      writes: true,
      phrases: ['shared tie phrase here'],
      leadPhrases: [],
      description: '',
      order: 0,
      defaultTarget: false,
    },
    {
      id: 'command-doctor-tie-read',
      command: '/doctor:tie',
      target: 'read',
      runnable: '/doctor:tie read',
      section: 'routes',
      mutating: 'read-only',
      writes: false,
      phrases: ['shared tie phrase here'],
      leadPhrases: [],
      description: '',
      order: 1,
      defaultTarget: false,
    },
    {
      id: 'command-doctor-tie-default',
      command: '/doctor:tie',
      target: 'default',
      runnable: '/doctor:tie default',
      section: 'routes',
      mutating: 'mutates',
      writes: true,
      phrases: ['shared tie phrase here'],
      leadPhrases: [],
      description: '',
      order: 2,
      defaultTarget: true,
    },
  ];
  const result = matcher.rankProblem(entries, 'shared tie phrase here', {});
  assert.deepEqual(result.candidates.map((entry) => entry.target), ['default', 'read', 'write']);
});

test('the intent answer prefers the class the operator asked for', () => {
  const entries = ['read', 'write'].map((target, order) => ({
    id: `command-doctor-intent-${target}`,
    command: '/doctor:intent',
    target,
    runnable: `/doctor:intent ${target}`,
    section: 'routes',
    mutating: target === 'read' ? 'read-only' : 'mutates',
    writes: target !== 'read',
    phrases: ['intent fixture phrase'],
    leadPhrases: [],
    description: '',
    order,
    defaultTarget: false,
  }));
  assert.equal(matcher.rankProblem(entries, 'intent fixture phrase', {}).candidates[0].target, 'read');
  assert.equal(matcher.rankProblem(entries, 'intent fixture phrase', { intent: 'check' }).candidates[0].target, 'read');
  assert.equal(matcher.rankProblem(entries, 'intent fixture phrase', { intent: 'change' }).candidates[0].target, 'write');
});

test('two runs over the same input print byte-identical JSON', () => {
  const args = ['--json', '--', 'my pre-commit hook keeps rejecting my commit'];
  const first = run(args);
  const second = run(args);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(first.stdout, second.stdout);
  assert.match(first.stdout, /"status": "match"/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE CLI SURFACE, ITS MODES AND ITS EXIT CODES
// ─────────────────────────────────────────────────────────────────────────────

test('a match prints one numbered candidate line per pick and exits 0', () => {
  const result = run(['--', 'my pre-commit hook keeps rejecting my commit']);
  assert.equal(result.status, 0, result.stderr);
  const lines = result.stdout.trim().split('\n');
  assert.match(lines[0], /^1\) \/doctor:git hooks /);
  assert.match(lines[lines.length - 1], /^STATUS=OK MATCHES=\d+$/);
});

test('no candidate above the floor exits 1 and names the read-only fallback last', () => {
  const result = run(['--', 'write me a poem about cats']);
  assert.equal(result.status, 1);
  const lines = result.stdout.trim().split('\n');
  assert.equal(lines[lines.length - 1], 'STATUS=NO_MATCH FALLBACK=/doctor:setup');
});

test('a bad argument, an unreadable manifest and a missing yaml package each exit 2', () => {
  assert.equal(run(['--top=9', '--', 'anything at all']).status, 2);
  assert.equal(run(['--nonsense', '--', 'anything at all']).status, 2);
  assert.equal(run([]).status, 2);

  const broken = makeRoot({ '.skilled/commands/doctor/_routes.yaml': 'routes: [\n' });
  const unreadable = run(['--json', `--root=${broken}`, '--', 'anything at all']);
  assert.equal(unreadable.status, 2);
  assert.match(unreadable.stderr, /_routes\.yaml/);

  // A copy outside the repository cannot resolve the YAML parser, which is a
  // setup failure rather than a verdict, so it must not read as "no match".
  const orphan = makeRoot({ 'doctor-helper-match.cjs': fs.readFileSync(SCRIPT, 'utf8') });
  const missing = spawnSync(process.execPath, [path.join(orphan, 'doctor-helper-match.cjs'), '--json', '--', 'anything at all'], {
    encoding: 'utf8',
    cwd: orphan,
  });
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /yaml/i);
});

test('the table mode lists every manifest entry but the helper itself', () => {
  const { json } = runJson(['--table', '--json']);
  assert.ok(Array.isArray(json.entries));
  assert.ok(json.entries.length >= 19);
  assert.ok(!json.entries.some((entry) => entry.runnable.startsWith('/doctor:helper')));
  assert.equal(json.table.entries, json.entries.length);
  assert.equal(json.table.skippedPrivate, 0);
  for (const entry of json.entries) {
    assert.ok(entry.phrases.length >= 1, entry.runnable);
  }
});

test('the areas mode lists the commands the helper can offer, without itself', () => {
  const { json } = runJson(['--areas', '--json']);
  assert.equal(json.status, 'areas');
  assert.ok(json.commands.length >= 11);
  assert.ok(!json.commands.some((entry) => entry.command === '/doctor:helper'));
});

test('an area with no problem text lists that command in tie-break order', () => {
  const { json } = runJson(['--json', '--area=git']);
  assert.equal(json.status, 'match');
  assert.equal(json.candidates[0].runnable, '/doctor:git setup');
  assert.ok(json.candidates.every((entry) => entry.command === '/doctor:git'));
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. SELF-RECALL OVER THE LIVE MANIFEST
// ─────────────────────────────────────────────────────────────────────────────

test('every manifest phrase ranks its own entry first', () => {
  const { entries } = matcher.loadEntries(REPO_ROOT);
  const routable = entries.filter((entry) => entry.command !== '/doctor:helper');
  const misses = [];
  let checked = 0;
  for (const entry of routable) {
    for (const phrase of entry.phrases) {
      checked += 1;
      const result = matcher.rankProblem(routable, phrase, {});
      const first = result.candidates[0];
      if (!first || first.runnable !== entry.runnable) {
        misses.push(`${entry.runnable} <- "${phrase}" (got ${first ? first.runnable : 'no match'})`);
      }
    }
  }
  assert.ok(checked >= 100, `checked ${checked} phrases`);
  assert.deepEqual(misses, []);
});

test('every standalone action phrase ranks its own action first', () => {
  const { entries } = matcher.loadEntries(REPO_ROOT);
  const actions = entries.filter((entry) => entry.section === 'action');
  assert.ok(actions.length >= 1);
  for (const entry of actions) {
    for (const phrase of entry.phrases) {
      const result = matcher.rankProblem(entries, phrase, {});
      assert.equal(result.candidates[0].runnable, entry.runnable, phrase);
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. THE HELD-OUT BAR
// ─────────────────────────────────────────────────────────────────────────────

test('the held-out fixture still hashes to the value pinned before any tuning', () => {
  const digest = crypto.createHash('sha256').update(fs.readFileSync(HELDOUT)).digest('hex');
  assert.equal(digest, HELDOUT_SHA256);
  const rows = readJsonl(HELDOUT);
  assert.ok(rows.filter((row) => row.expected).length >= 40, 'at least forty positives');
  assert.ok(rows.filter((row) => !row.expected).length >= 10, 'at least ten negatives');
});

test('the held-out set clears top-1, top-3 and the negative bar', () => {
  const { entries } = matcher.loadEntries(REPO_ROOT);
  const runnables = new Set(entries.map((entry) => entry.runnable));
  const rows = readJsonl(HELDOUT);

  let positives = 0;
  let top1 = 0;
  let top3 = 0;
  let negatives = 0;
  let refused = 0;
  const misses = [];

  for (const row of rows) {
    const result = matcher.rankProblem(entries, row.prompt, {});
    if (!row.expected) {
      negatives += 1;
      if (result.status === 'no_match') refused += 1;
      else {
        misses.push(`negative "${row.prompt}" matched ${result.candidates[0].runnable}`);
      }
      continue;
    }
    positives += 1;
    assert.ok(runnables.has(row.expected), `held-out row names an unknown runnable: ${row.expected}`);
    const ranked = result.candidates.map((candidate) => candidate.runnable);
    if (ranked[0] === row.expected) top1 += 1;
    if (ranked.slice(0, 3).includes(row.expected)) top3 += 1;
    else misses.push(`"${row.prompt}" -> ${ranked.join(' | ') || 'no match'} (want ${row.expected})`);
  }

  const rates = {
    top1: top1 / positives,
    top3: top3 / positives,
    negatives: refused / negatives,
  };
  process.stdout.write(
    `[doctor-helper] held-out top1=${rates.top1.toFixed(3)} top3=${rates.top3.toFixed(3)} `
      + `negatives=${rates.negatives.toFixed(3)} (rows=${rows.length} positive=${positives} negative=${negatives})\n`,
  );
  for (const miss of misses) process.stdout.write(`[doctor-helper] miss: ${miss}\n`);

  assert.ok(rates.top1 >= BAR.top1, `top-1 ${rates.top1.toFixed(3)} < ${BAR.top1}`);
  assert.ok(rates.top3 >= BAR.top3, `top-3 ${rates.top3.toFixed(3)} < ${BAR.top3}`);
  assert.ok(rates.negatives >= BAR.negatives, `negatives ${rates.negatives.toFixed(3)} < ${BAR.negatives}`);
});

test('the tune set stays readable, so the constants can still be re-measured', () => {
  const rows = readJsonl(TUNE);
  assert.ok(rows.length >= 40);
  assert.ok(rows.some((row) => row.expected === null));
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. READ-ONLY BY CONSTRUCTION
// ─────────────────────────────────────────────────────────────────────────────

test('the matcher starts no process and carries no write API', () => {
  const source = fs.readFileSync(SCRIPT, 'utf8');
  for (const forbidden of [
    'child_process',
    'spawnSync',
    'writeFileSync',
    'appendFileSync',
    'createWriteStream',
    'unlinkSync',
    'rmSync',
    'mkdirSync',
    'renameSync',
  ]) {
    assert.ok(!source.includes(forbidden), `${forbidden} has no place in a read-only matcher`);
  }
});

test('the helper never emits a flag on a runnable', () => {
  const { json } = runJson(['--table', '--json']);
  for (const entry of json.entries) {
    assert.doesNotMatch(entry.runnable, /--|\s-\w/, entry.runnable);
  }
  const match = runJson(['--json', '--', 'the repository quality config is missing']);
  for (const entry of match.json.candidates) {
    assert.doesNotMatch(entry.runnable, /--|\s-\w/, entry.runnable);
  }
});
