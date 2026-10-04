#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ score-clarify-default.test — census, gate and verdict coverage           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const S = require('../score-clarify-default.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function engineFrom(map) {
  return () => ({
    snapshot: {},
    evaluate: (snap, input) => {
      if (input.prompt === 'boom') throw new Error('engine failed');
      return map[input.prompt];
    }
  });
}

const clarify = (alternatives) => ({ decision: { action: 'clarify', clarify: { alternatives } } });
const route = () => ({ decision: { action: 'route' } });
const modes = () => new Set(['mode-a', 'mode-b']);

const SCRIPT = path.join(__dirname, '..', 'score-clarify-default.cjs');
const TEST_REPO_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-router-repo-'));
const TEST_ROUTER_FILE = path.join(
  TEST_REPO_ROOT,
  '.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs'
);
fs.mkdirSync(path.dirname(TEST_ROUTER_FILE), { recursive: true });
fs.writeFileSync(TEST_ROUTER_FILE, 'module.exports = {};\n');
const TEST_CHILD_ROOT = path.join(
  TEST_REPO_ROOT,
  '.skilled/bin/lib/compiled-routing/test-router-child'
);
fs.mkdirSync(path.join(TEST_CHILD_ROOT, 'lib'), { recursive: true });
fs.mkdirSync(path.join(TEST_CHILD_ROOT, 'harness'), { recursive: true });
fs.writeFileSync(path.join(TEST_CHILD_ROOT, 'lib/canary-router.cjs'), 'module.exports = {};\n');
fs.writeFileSync(
  path.join(TEST_CHILD_ROOT, 'harness/build-artifacts.cjs'),
  'module.exports = {};\n'
);

const skillsRoot = path.join(TEST_REPO_ROOT, '.skilled/skills/hub-x');
fs.mkdirSync(skillsRoot, { recursive: true });
fs.writeFileSync(path.join(skillsRoot, 'mode-registry.json'), JSON.stringify({ modes: [
  { workflowMode: 'mode-a', packet: 'mode-a-packet' },
  { workflowMode: 'mode-b', packet: 'mode-b-packet' }
] }));
for (const [packet, description] of [['mode-a-packet', 'Mode A'], ['mode-b-packet', 'Mode B']]) {
  const packetRoot = path.join(skillsRoot, packet);
  fs.mkdirSync(packetRoot, { recursive: true });
  fs.writeFileSync(
    path.join(packetRoot, 'SKILL.md'),
    '---\ndescription: ' + description + '\n---\n'
  );
}

const testRouter = {
  HUB_CHILD: { 'hub-x': 'test-router-child' },
  loadHubEngine(hub) {
    if (hub !== 'hub-x') throw new Error('unknown hub: ' + hub);
    return {
      snapshot: { policy: { effectivePolicyHash: 'policy-test', activationGeneration: 7 } },
      evaluate: (_snapshot, input) => {
        if (input.prompt.startsWith('route ')) return route();
        if (input.prompt.startsWith('changed ')) {
          return clarify(['mode-b', 'mode-a', 'none_of_these']);
        }
        return clarify(['mode-a', 'mode-b', 'none_of_these']);
      }
    };
  }
};

test.after(() => fs.rmSync(TEST_REPO_ROOT, { recursive: true, force: true }));

function writeRowsFile(dir, labels, promptForRow = null) {
  const lines = labels.map((label, i) => JSON.stringify({
    id: 'r' + i,
    hub: 'hub-x',
    source: 'canary',
    prompt: promptForRow
      ? promptForRow(i, label)
      : 'row ' + i + ' pick=' + (label === 'first' ? 'mode-a' : 'mode-b') + ' first=mode-a',
    alternatives: ['mode-a', 'mode-b'],
    gold: null,
    label: label === 'second' ? 'mode-b'
      : label === 'first' ? 'mode-a'
        : label === 'none' ? 'none_of_these' : '',
    label_approver: '',
    decision_reference: ''
  }));
  const file = path.join(dir, 'rows.jsonl');
  fs.writeFileSync(file, lines.join('\n') + '\n');
  return file;
}

async function runScript(args, options = {}) {
  const stdout = [];
  const stderr = [];
  const status = await S.main(args, {
    out: (line) => stdout.push(line),
    err: (line) => stderr.push('[score-clarify-default] ' + line),
    repoRoot: TEST_REPO_ROOT,
    compiledRouter: testRouter,
    env: options.env || process.env
  });
  return {
    status,
    stdout: stdout.length ? stdout.join('\n') + '\n' : '',
    stderr: stderr.length ? stderr.join('\n') + '\n' : ''
  };
}

function makeStubs(opts = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-stubs-'));
  const log = path.join(dir, 'calls.log');

  const choice = [
    '  choice)',
    '    text=$(cat)',
    '    case "$text" in *fail*) exit 1 ;; esac',
    '    if [ -n "$STUB_CHOICE_EXIT" ]; then exit "$STUB_CHOICE_EXIT"; fi',
    '    if [ "$STUB_PICK" = "disagree" ]; then',
    '      count=$(cat "$STUB_LOG.choice-count" 2>/dev/null || echo 0)',
    '      if [ $((count % 3)) -eq 1 ]; then',
    "        key=$(printf '%s' \"$text\" | sed -n 's/.*pick=\\([^ ]*\\).*/\\1/p')",
    '      else',
    "        key=$(printf '%s' \"$text\" | sed -n 's/.*first=\\([^ ]*\\).*/\\1/p')",
    '      fi',
    '      printf "%s\\n" "$((count + 1))" > "$STUB_LOG.choice-count"',
    '    elif [ "$STUB_PICK" = "first" ]; then',
    "      key=$(printf '%s' \"$text\" | sed -n 's/.*first=\\([^ ]*\\).*/\\1/p')",
    '    else',
    "      key=$(printf '%s' \"$text\" | sed -n 's/.*pick=\\([^ ]*\\).*/\\1/p')",
    '    fi',
    '    printf \'{"answers":{"answer":{"choice":"%s","probabilities":{"%s":0.9}}},"model":"stub-jev-model"}\\n\' "$key" "$key"',
    '    ;;'
  ];

  const scripts = {
    jev: [
      '#!/bin/sh',
      `printf '%s %s\\n' "jev" "$*" >> "$STUB_LOG"`,
      'case "$1" in',
      '  --version) echo "${STUB_JEV_VERSION:-jev 0.6.2}" ;;',
      '  auth)',
      '    case "$2" in',
      '      status) exit "${STUB_AUTH_EXIT:-0}" ;;',
      '      test) echo \'{"model":"stub-jev-model"}\' ;;',
      '      *) exit 2 ;;',
      '    esac ;;',
      ...choice,
      '  *) exit 2 ;;',
      'esac'
    ].join('\n') + '\n'
  };

  const write = (name) => {
    const file = path.join(dir, name);
    fs.writeFileSync(file, scripts[name]);
    fs.chmodSync(file, 0o755);
  };

  if (opts.jev !== false) write('jev');

  return { dir, log };
}

function runWithStubs(stubs, args, extraEnv = {}) {
  return runScript(args, {
    env: { JEV_TRANSPORT: 'jev', PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log, ...extraEnv }
  });
}

function withoutLines(text, drop) {
  return text.split('\n').filter((line) => !drop.includes(line)).join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('census counts a mode clarify and keeps only gold among its alternatives', () => {
  const prompts = [
    { id: 'c1', hub: 'hub-x', source: 'playbook', prompt: 'tie', gold: 'mode-b' },
    { id: 'c2', hub: 'hub-x', source: 'playbook', prompt: 'tie2', gold: 'mode-z' },
    { id: 'r1', hub: 'hub-x', source: 'playbook', prompt: 'go', gold: null }
  ];
  const engineFor = engineFrom({
    tie: clarify(['mode-a', 'mode-b', 'none_of_these']),
    tie2: clarify(['mode-a', 'mode-b', 'none_of_these']),
    go: route()
  });

  const { cells, rows } = S.runCensus(prompts, engineFor, modes);

  assert.deepEqual(cells['hub-x'].playbook, {
    prompts: 3,
    unparsed: 0,
    route: 1,
    clarify: 2,
    defer: 0,
    reject: 0,
    clarifyMode: 2,
    clarifyChecklist: 0,
    goldInAlternatives: 1
  });
  assert.deepEqual(rows, [
    { id: 'c1', hub: 'hub-x', source: 'playbook', prompt: 'tie', alternatives: ['mode-a', 'mode-b'], gold: 'mode-b' },
    { id: 'c2', hub: 'hub-x', source: 'playbook', prompt: 'tie2', alternatives: ['mode-a', 'mode-b'], gold: null }
  ]);
});

test('census counts a missing prompt, an engine throw and an unknown hub as unparsed', () => {
  const prompts = [
    { id: 'u1', hub: 'hub-x', source: 'canary', prompt: null, gold: null },
    { id: 'u2', hub: 'hub-x', source: 'canary', prompt: 'boom', gold: null },
    { id: 'u3', hub: 'hub-gone', source: 'canary', prompt: 'go', gold: null }
  ];
  const engineFor = (hub) => {
    if (hub === 'hub-gone') throw new Error('unknown hub');
    return engineFrom({ go: route() })();
  };

  const { cells, rows } = S.runCensus(prompts, engineFor, modes);

  assert.equal(cells['hub-x'].canary.prompts, 2);
  assert.equal(cells['hub-x'].canary.unparsed, 2);
  assert.equal(cells['hub-gone'].canary.prompts, 1);
  assert.equal(cells['hub-gone'].canary.unparsed, 1);
  assert.equal(rows.length, 0);
});

test('census keeps checklist alternatives apart and writes no row for them', () => {
  const prompts = [
    { id: 'q1', hub: 'hub-x', source: 'canary', prompt: 'ask', gold: null }
  ];
  const engineFor = engineFrom({
    ask: clarify(['Name the matching command.', 'Confirm the target.', 'none_of_these'])
  });

  const { cells, rows } = S.runCensus(prompts, engineFor, modes);

  assert.equal(cells['hub-x'].canary.clarify, 1);
  assert.equal(cells['hub-x'].canary.clarifyChecklist, 1);
  assert.equal(cells['hub-x'].canary.clarifyMode, 0);
  assert.deepEqual(rows, []);
});

test('rowLines writes empty label provenance fields', () => {
  const row = { id: 'a', hub: 'h', source: 'canary', prompt: 'p', alternatives: ['m1', 'm2'], gold: 'm2' };
  const parsed = JSON.parse(S.rowLines([row])[0]);

  assert.deepEqual(parsed, { ...row, label: '', label_approver: '', decision_reference: '' });
  assert.deepEqual(Object.keys(parsed), [
    'id', 'hub', 'source', 'prompt', 'alternatives', 'gold', 'label',
    'label_approver', 'decision_reference'
  ]);
});

test('labelRows preserves approver and decision reference fields', () => {
  const row = {
    id: 'a', hub: 'hub-x', source: 'canary', prompt: 'p', alternatives: ['mode-a', 'mode-b'],
    gold: null,
    label: 'mode-b',
    label_approver: 'reviewer@example.test',
    decision_reference: 'decision-42'
  };

  const { labeled } = S.labelRows([row]);
  assert.equal(labeled[0].label_approver, 'reviewer@example.test');
  assert.equal(labeled[0].decision_reference, 'decision-42');
});

test('parseArgs reads both census flags and refuses an unknown flag or a missing value', () => {
  const args = S.parseArgs(['--report', 'r', '--rows-out', 'f']);
  assert.equal(args.report, 'r');
  assert.equal(args.rowsOut, 'f');
  assert.equal(args.error, null);

  assert.equal(S.parseArgs(['--bogus']).error, 'unknown argument --bogus');
  assert.equal(S.parseArgs(['--rows-out']).error, 'missing value for --rows-out');
});

test('the Jev arm refuses to run without an output directory', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const result = await runWithStubs(stubs, ['--score', file, '--jev']);

    assert.equal(result.status, 2);
    assert.equal(result.stdout, '');
    assert.ok(result.stderr.includes('error: --jev needs --out <dir>'));
    assert.equal(fs.existsSync(stubs.log), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('hubForSkill maps a hub id and a mode packet and nothing else', () => {
  const registries = { 'hub-a': { modes: new Set(['m1']), packets: new Map([['m1', 'pkt-1']]) } };

  assert.equal(S.hubForSkill('hub-a', registries), 'hub-a');
  assert.equal(S.hubForSkill('pkt-1', registries), 'hub-a');
  assert.equal(S.hubForSkill('m1', registries), 'hub-a');
  assert.equal(S.hubForSkill('sk-git', registries), null);
});

test('countTranscripts counts each front-door line once, escaped or plain', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-tx-'));
  try {
    fs.writeFileSync(path.join(dir, 'a.jsonl'), [
      '{"hubId":"sk-doc","action":"clarify","selectionKind":null,"targets":[]}',
      JSON.stringify({ content: '{"hubId":"sk-code","action":"route"}', copy: '{"hubId":"sk-code","action":"route"}' }),
      '{"note":"secret-prompt-text"}'
    ].join('\n') + '\n');

    const result = S.countTranscripts(dir);

    assert.equal(result.files, 1);
    assert.equal(result.linesMatched, 2);
    assert.equal(result.byHub['sk-doc'].clarify, 1);
    assert.equal(result.byHub['sk-code'].route, 1);
    assert.deepEqual(result.perFile, [{ file: 'a.jsonl', lines: 2 }]);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the transcript count prints counts and no transcript text', { timeout: 120000 }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-tx-'));
  try {
    fs.writeFileSync(path.join(dir, 'a.jsonl'), [
      '{"hubId":"sk-doc","action":"clarify","selectionKind":null,"targets":[]}',
      JSON.stringify({ content: '{"hubId":"sk-code","action":"route"}', copy: '{"hubId":"sk-code","action":"route"}' }),
      '{"note":"secret-prompt-text"}'
    ].join('\n') + '\n');

    const result = spawnSync(process.execPath, [path.join(__dirname, '..', 'score-clarify-default.cjs'), '--transcripts', dir], { encoding: 'utf8' });

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('transcripts: files=1 lines_matched=2'));
    assert.ok(result.stdout.includes('real clarify rate: 1/2'));
    assert.ok(!result.stdout.includes('secret-prompt-text'));
    assert.ok(!result.stdout.includes('real clarify rate: not measured'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the gate stops at 29 labeled rows', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const file = writeRowsFile(dir, [...Array(29).fill('second'), '', '', '']);
    const result = await runScript(['--score', file]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('rows: 32 labeled=29 operator=29 committed_gold=0'));
    assert.ok(result.stdout.includes('stop: fewer than 30 labeled rows (29 labeled)'));
    assert.ok(!result.stdout.includes('margin:'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the Jev arm stops at the label gate without invoking the stub', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(29).fill('second'));
    const result = await runWithStubs(stubs, [
      '--score', file, '--jev', '--out', path.join(dir, 'out')
    ]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('stop: fewer than 30 labeled rows (29 labeled)'));
    assert.ok(!fs.existsSync(stubs.log) || fs.readFileSync(stubs.log, 'utf8') === '');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('30 labeled rows print baselines and class-by-hub results', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const result = await runScript(['--score', file]);

    assert.equal(result.status, 0);
    assert.ok(!result.stdout.includes('stop: fewer'));
    assert.ok(result.stdout.includes('baseline: first alternative right on 0/30'));
    assert.ok(result.stdout.includes('baseline: second alternative right on 30/30'));
    assert.ok(result.stdout.includes('baseline: always none right on 0/30'));
    assert.ok(result.stdout.includes(
      'result: hub=hub-x class=mode rows=30 first=0/30 second=30/30 always_none=0/30'
    ));
    assert.ok(result.stdout.includes('margin: 0.10'));
    assert.ok(result.stdout.includes('keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M'));
    assert.ok(result.stdout.includes('headroom: a 10-point gain fits above 0/30'));
    assert.match(result.stdout, /^options: 3 sha256=[0-9a-f]{64} none="None of these modes"$/m);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('class and hub results separate named-mode labels from none labels', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const file = writeRowsFile(dir, [...Array(15).fill('none'), ...Array(15).fill('second')]);
    const result = await runScript(['--score', file]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('baseline: always none right on 15/30'));
    assert.ok(result.stdout.includes('result: hub=hub-x class=mode rows=15'));
    assert.ok(result.stdout.includes('result: hub=hub-x class=none rows=15'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a row that no longer clarifies is refused while the rest are scored', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const promptForRow = (i) => i === 0
      ? 'route this request'
      : 'row ' + i + ' pick=mode-b first=mode-a';
    const file = writeRowsFile(dir, Array(31).fill('second'), promptForRow);
    const result = await runScript(['--score', file]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('replay refused: r0 (route)'));
    assert.ok(result.stdout.includes('rows: 31 labeled=30 operator=30 committed_gold=0'));
    assert.ok(result.stdout.includes('baseline: second alternative right on 30/30'));
    assert.ok(result.stdout.includes('result: hub=hub-x class=mode rows=30'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a row that no longer clarifies is dropped before the Jev arm calls on it', { timeout: 120000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const promptForRow = (i) => i === 0
      ? 'route this request'
      : 'row ' + i + ' pick=mode-b first=mode-a';
    const file = writeRowsFile(dir, Array(31).fill('second'), promptForRow);
    const out = path.join(dir, 'out');
    const result = await runWithStubs(stubs, ['--score', file, '--jev', '--out', out]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('replay refused: r0 (route)'));
    assert.ok(result.stdout.includes('jev: calls=61 choice_calls=60 early_stops=30'));

    const calls = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8')
      .trim().split('\n').map((line) => JSON.parse(line));
    assert.ok(!calls.some((call) => call.row_id === 'r0'));
    assert.ok(calls.some((call) => call.row_id === 'r1'));

    const choiceCalls = fs.readFileSync(stubs.log, 'utf8')
      .split('\n')
      .filter((line) => line.startsWith('jev choice '));
    assert.equal(choiceCalls.length, 60);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a replay with changed alternatives is refused', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const promptForRow = (i) => i === 0
      ? 'changed alternatives'
      : 'row ' + i + ' pick=mode-b first=mode-a';
    const file = writeRowsFile(dir, Array(30).fill('second'), promptForRow);
    const result = await runScript(['--score', file]);

    assert.equal(result.status, 2);
    assert.equal(result.stdout, '');
    assert.ok(result.stderr.includes('row r0 replay alternatives changed'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('score report records replay identity and four digests', { timeout: 120000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, [...Array(15).fill('none'), ...Array(15).fill('second')]);
    const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    rows[0].label_approver = 'reviewer@example.test';
    rows[0].decision_reference = 'decision-42';
    fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
    const out = path.join(dir, 'out');
    const result = await runWithStubs(
      stubs,
      ['--score', file, '--jev', '--out', out],
      { STUB_AUTH_EXIT: '3' }
    );

    assert.equal(result.status, 0);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    for (const name of ['rows', 'labels', 'options', 'scorer']) {
      assert.match(report.digests[name].sha256, /^[a-f0-9]{64}$/);
    }
    assert.equal(report.digests.rows.count, 30);
    assert.equal(report.digests.labels.count, 30);
    assert.equal(report.digests.options.count, 3);
    assert.equal(report.rows[0].replay.action, 'clarify');
    assert.equal(report.rows[0].replay.policyHash, 'policy-test');
    assert.equal(report.rows[0].replay.generation, 7);
    assert.equal(report.labels[0].label_approver, 'reviewer@example.test');
    assert.equal(report.labels[0].decision_reference, 'decision-42');
    assert.match(report.buildIdentity['hub-x'].buildId, /^[a-f0-9]{64}$/);
    assert.equal(report.buildIdentity['hub-x'].policyHash, 'policy-test');
    assert.equal(report.buildIdentity['hub-x'].generation, 7);
    assert.deepEqual(report.resultsByClassAndHub.map((result) => result.class), ['mode', 'none']);
    assert.equal(report.resultsByClassAndHub[0].hub, 'hub-x');
    assert.deepEqual(report.baselines.secondAlternative, { correct: 15, total: 30 });
    assert.deepEqual(report.baselines.alwaysNone, { correct: 15, total: 30 });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test("a label outside the row's alternatives exits 2 and names the row", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    rows[4].label = 'cli-bogus';
    fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');

    const result = await runScript(['--score', file]);

    assert.equal(result.status, 2);
    assert.equal(result.stdout, '');
    assert.ok(result.stderr.includes('row r4 label "cli-bogus"'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a baseline above nine tenths prints no headroom', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const file = writeRowsFile(dir, [...Array(28).fill('first'), 'second', 'second']);
    const result = await runScript(['--score', file]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('no headroom: the first alternative is right on 28/30, above 0.90'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('tailP is exact', () => {
  assert.equal(S.tailP(0, 0).p, 1);
  assert.equal(S.tailP(20, 20).p, 2 ** -20);
  assert.equal(S.tailP(10, 5).num, 638n);
  assert.equal(S.tailP(10, 5).den, 1024n);
});

test('decideVerdict checks coverage, kill, margin, sign test and flips in order', () => {
  const cases = [
    [{ K: 30, M: 26, A: 26, B: 0, W: 26, L: 0, F: 0 }, 'stop', 'coverage'],
    [{ K: 30, M: 30, A: 0, B: 20, W: 0, L: 20, F: 0 }, 'kill', null],
    [{ K: 30, M: 30, A: 0, B: 0, W: 0, L: 0, F: 0 }, 'stop', 'margin'],
    [{ K: 30, M: 30, A: 5, B: 2, W: 5, L: 2, F: 0 }, 'stop', 'sign test'],
    [{ K: 30, M: 30, A: 30, B: 0, W: 30, L: 0, F: 10 }, 'stop', 'flips'],
    [{ K: 30, M: 30, A: 30, B: 0, W: 30, L: 0, F: 0 }, 'keep', null]
  ];

  for (const [counts, outcome, reason] of cases) {
    const decision = S.decideVerdict(counts);
    assert.equal(decision.outcome, outcome, JSON.stringify(counts));
    assert.equal(decision.reason, reason, JSON.stringify(counts));
  }
});

test('scoreColumn counts measured, unstable and flips', () => {
  const labeled = [
    { id: 'a', alternatives: ['m1', 'm2'], value: 'm2' },
    { id: 'b', alternatives: ['m1', 'm2'], value: 'm1' },
    { id: 'c', alternatives: ['m1', 'm2'], value: 'm2' }
  ];
  const answers = new Map([
    ['a', ['m2', 'm2', 'm2']],
    ['b', ['m1', 'm2', 'none_of_these']],
    ['c', ['m2', 'm2', null]]
  ]);

  const counts = S.scoreColumn(labeled, answers);

  assert.deepEqual(counts, { K: 3, M: 2, A: 1, B: 1, W: 1, L: 1, F: 3, unstable: 1, abstained: 0 });
  assert.equal(
    S.verdictLine('jev', counts, { outcome: 'stop', reason: 'coverage', p: 0.5 }, 'model=x'),
    'verdict jev: stop (coverage) K=3 M=2 A=1 B=1 W=1 L=1 F=3 p=0.5000 model=x'
  );
});

test('a jev without a credential prints its identity and one skip line', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const identity = 'jev: path=' + path.join(stubs.dir, 'jev') + ' provider=official';
    const base = await runWithStubs(stubs, ['--score', file]);
    const result = await runWithStubs(
      stubs,
      ['--score', file, '--jev', '--out', path.join(dir, 'out')],
      { STUB_AUTH_EXIT: '3' }
    );

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes(identity));
    assert.ok(result.stdout.includes('jev arm skipped: no credential'));
    assert.equal(withoutLines(result.stdout, [identity, 'jev arm skipped: no credential']), base.stdout);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('jev off PATH and a wrong jev version each skip', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const absent = makeStubs({ jev: false });
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));

    const missing = await runWithStubs(absent, [
      '--score', file, '--jev', '--out', path.join(dir, 'out')
    ]);
    assert.equal(missing.status, 0);
    assert.ok(missing.stdout.includes('jev: path=none provider=official'));
    assert.ok(missing.stdout.includes('jev arm skipped: jev not on PATH'));

    const wrong = await runWithStubs(
      stubs,
      ['--score', file, '--jev', '--out', path.join(dir, 'out')],
      { STUB_JEV_VERSION: 'jev 0.5.0' }
    );
    assert.equal(wrong.status, 0);
    assert.ok(wrong.stdout.includes('jev arm skipped: version'));
    assert.ok(wrong.stdout.includes('jev: found="jev 0.5.0" path=' + path.join(stubs.dir, 'jev')));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(absent.dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('two agreeing orders keep only the two measured votes', { timeout: 120000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const out = path.join(dir, 'out');
    const result = await runWithStubs(stubs, ['--score', file, '--jev', '--out', out]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('planned_calls=61 max_calls=91'));
    assert.ok(result.stdout.includes('jev: auth_test provider=official model=stub-jev-model'));
    assert.ok(result.stdout.includes('verdict jev: keep K=30 M=30 A=30 B=0 W=30 L=0 F=0 p=9.313e-10 jev_version=0.6.2 provider=official model=stub-jev-model'));
    assert.ok(result.stdout.includes('jev: calls=61 choice_calls=60 early_stops=30'));
    const callLines = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n');
    assert.equal(callLines.length, 61);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    assert.deepEqual(report.columns.jev.picks.r0, ['mode-b', 'mode-b']);
    assert.ok(report.columns.jev.inferredThirdOrderIds.includes('r0'));
    const inputRows = fs.readFileSync(file, 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    const labeled = S.labelRows(inputRows).labeled;
    const inferredPicks = new Map(Object.entries(report.columns.jev.picks));
    const referenceCounts = S.scoreColumn(labeled, inferredPicks);
    for (const key of ['K', 'M', 'A', 'B', 'W', 'L', 'F']) {
      assert.equal(report.columns.jev[key], referenceCounts[key]);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('an early stop keeps two measured votes and adds no flip', { timeout: 120000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const out = path.join(dir, 'out');
    const result = await runWithStubs(stubs, ['--score', file, '--jev', '--out', out]);

    assert.equal(result.status, 0);
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    // The stub answers both measured orders with the row's pick, so the row
    // stops before the third order and keeps only those two measured votes.
    assert.deepEqual(report.columns.jev.picks.r0, ['mode-b', 'mode-b']);
    // Every row early stops on two agreeing votes, so the class and hub Jev
    // totals must count those rows instead of dropping them as unmeasured.
    assert.ok(result.stdout.includes(
      'result: hub=hub-x class=mode rows=30 first=0/30 second=30/30 always_none=0/30 jev=30/30 accuracy=1.0000'
    ));

    const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    const labeled = S.labelRows(rows).labeled;
    const earlyCounts = S.scoreColumn(labeled, new Map([['r0', ['mode-b', 'mode-b']]]));
    const forcedCounts = S.scoreColumn(labeled, new Map([['r0', ['mode-b', 'mode-b', 'mode-a']]]));

    // A forced third call that differs shares the modal pick of the two
    // agreeing votes, so the early stop agrees on the pick and adds no flip
    // for the vote it never measured.
    assert.equal(earlyCounts.A, 1);
    assert.equal(earlyCounts.A, forcedCounts.A);
    assert.equal(earlyCounts.F, 0);
    assert.equal(forcedCounts.F, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('two disagreeing orders trigger the third call', { timeout: 120000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const out = path.join(dir, 'out');
    const result = await runWithStubs(
      stubs,
      ['--score', file, '--jev', '--out', out],
      { STUB_PICK: 'disagree' }
    );

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('planned_calls=61 max_calls=91'));
    assert.ok(result.stdout.includes('jev: calls=91 choice_calls=90 early_stops=0'));
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    assert.deepEqual(report.columns.jev.picks.r0, ['mode-a', 'mode-b', 'mode-a']);
    assert.deepEqual(report.columns.jev.inferredThirdOrderIds, []);
    const inputRows = fs.readFileSync(file, 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    const labeled = S.labelRows(inputRows).labeled;
    const recordedPicks = new Map(Object.entries(report.columns.jev.picks));
    const referenceCounts = S.scoreColumn(labeled, recordedPicks);
    for (const key of ['K', 'M', 'A', 'B', 'W', 'L', 'F']) {
      assert.equal(report.columns.jev[key], referenceCounts[key]);
    }
    const callLines = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n');
    assert.equal(callLines.length, 91);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('four failing Jev rows in thirty stop on coverage', { timeout: 120000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    for (let i = 0; i < 4; i += 1) rows[i].prompt += ' fail';
    fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');

    const result = await runWithStubs(stubs, [
      '--score', file, '--jev', '--out', path.join(dir, 'out')
    ]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('verdict jev: stop (coverage) K=30 M=26'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a rejected key stops the jev arm with no verdict', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const result = await runWithStubs(
      stubs,
      ['--score', file, '--jev', '--out', path.join(dir, 'out')],
      { STUB_CHOICE_EXIT: '3' }
    );

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('jev arm stopped: key rejected'));
    assert.ok(result.stdout.includes('jev: partial_rows=0'));
    assert.ok(!result.stdout.includes('verdict jev:'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a replay of the recorded three-order run matches every full modal pick within 118 calls', () => {
  const fixture = path.join(__dirname, 'fixtures', '047-020-recorded-picks.jsonl');
  const records = fs.readFileSync(fixture, 'utf8').trim().split('\n').map((line) => JSON.parse(line));

  const byRow = new Map();
  for (const record of records) {
    if (!byRow.has(record.row_id)) byRow.set(record.row_id, []);
    byRow.get(record.row_id).push(record);
  }

  let choiceCalls = 0;
  let matched = 0;
  for (const orders of byRow.values()) {
    orders.sort((a, b) => a.order - b.order);
    const full = orders.map((record) => record.pick);

    // The arm measures orders in turn and stops once two measured orders agree,
    // so only the votes it actually measured decide the row's pick.
    const replay = [];
    for (let i = 0; i < orders.length; i += 1) {
      if (i >= 2 && S.modalPick(replay).pick !== null) break;
      replay.push(orders[i].pick);
      choiceCalls += 1;
    }

    assert.equal(
      S.modalPick(replay).pick,
      S.modalPick(full).pick,
      'modal pick of row ' + orders[0].row_id
    );
    if (S.modalPick(replay).pick === S.modalPick(full).pick) matched += 1;
  }

  assert.equal(byRow.size, 54);
  assert.equal(matched, 54);
  // Every measured order is one choice call; the one auth test adds the final call.
  assert.ok(choiceCalls + 1 <= 118, 'choice calls ' + choiceCalls + ' plus the auth call must total 118 or fewer');
});
