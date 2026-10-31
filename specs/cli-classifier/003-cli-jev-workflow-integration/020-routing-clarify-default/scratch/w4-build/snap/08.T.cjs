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

function writeRowsFile(dir, labels) {
  const lines = labels.map((label, i) => JSON.stringify({
    id: 'r' + i,
    hub: 'cli-external-orchestration',
    source: 'canary',
    prompt: 'row ' + i + ' pick=' + (label === 'first' ? 'cli-claude-code' : 'cli-codex') + ' first=cli-claude-code',
    alternatives: ['cli-claude-code', 'cli-codex'],
    gold: null,
    label: label === 'second' ? 'cli-codex' : label === 'first' ? 'cli-claude-code' : ''
  }));
  const file = path.join(dir, 'rows.jsonl');
  fs.writeFileSync(file, lines.join('\n') + '\n');
  return file;
}

function runScript(args) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
}

function makeStubs(opts = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-stubs-'));
  const log = path.join(dir, 'calls.log');

  const choice = [
    '  choice)',
    '    text=$(cat)',
    '    case "$text" in *fail*) exit 1 ;; esac',
    '    if [ -n "$STUB_CHOICE_EXIT" ]; then exit "$STUB_CHOICE_EXIT"; fi',
    '    if [ "$STUB_PICK" = "first" ]; then',
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
    ].join('\n') + '\n',
    'cli-deem': [
      '#!/bin/sh',
      `printf '%s %s\\n' "cli-deem" "$*" >> "$STUB_LOG"`,
      'case "$1" in',
      '  health)',
      '    case "${STUB_HEALTH:-ok}" in',
      '      ok) echo \'{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"mc1","source_commit":"sc1"}\' ;;',
      '      stub) echo \'{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"mc1","source_commit":"sc1"}\' ;;',
      '      down) echo \'{"error":"unreachable"}\' >&2; exit 4 ;;',
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
  write('cli-deem');
  if (opts.jev !== false) write('jev');

  return { dir, log };
}

function runWithStubs(stubs, args, extraEnv = {}) {
  return spawnSync(process.execPath, [SCRIPT, ...args], {
    encoding: 'utf8',
    env: { PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log, ...extraEnv }
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

test('rowLines writes every label empty', () => {
  const row = { id: 'a', hub: 'h', source: 'canary', prompt: 'p', alternatives: ['m1', 'm2'], gold: 'm2' };
  const parsed = JSON.parse(S.rowLines([row])[0]);

  assert.deepEqual(parsed, { ...row, label: '' });
  assert.deepEqual(Object.keys(parsed), ['id', 'hub', 'source', 'prompt', 'alternatives', 'gold', 'label']);
});

test('parseArgs reads both census flags and refuses an unknown flag or a missing value', () => {
  const args = S.parseArgs(['--report', 'r', '--rows-out', 'f']);
  assert.equal(args.report, 'r');
  assert.equal(args.rowsOut, 'f');
  assert.equal(args.error, null);

  assert.equal(S.parseArgs(['--bogus']).error, 'unknown argument --bogus');
  assert.equal(S.parseArgs(['--rows-out']).error, 'missing value for --rows-out');
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

test('the gate stops at 29 labeled rows', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const file = writeRowsFile(dir, [...Array(29).fill('second'), '', '', '']);
    const result = runScript(['--score', file]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('rows: 32 labeled=29 operator=29 committed_gold=0'));
    assert.ok(result.stdout.includes('stop: fewer than 30 labeled rows (29 labeled)'));
    assert.ok(!result.stdout.includes('margin:'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('30 labeled rows pass the gate and print the fixed rule lines', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const result = runScript(['--score', file]);

    assert.equal(result.status, 0);
    assert.ok(!result.stdout.includes('stop: fewer'));
    assert.ok(result.stdout.includes('baseline: first alternative right on 0/30'));
    assert.ok(result.stdout.includes('margin: 0.10'));
    assert.ok(result.stdout.includes('keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M'));
    assert.ok(result.stdout.includes('headroom: a 10-point gain fits above 0/30'));
    assert.match(result.stdout, /^options: 3 sha256=[0-9a-f]{64} none="None of these modes"$/m);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("a label outside the row's alternatives exits 2 and names the row", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    rows[4].label = 'cli-bogus';
    fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');

    const result = runScript(['--score', file]);

    assert.equal(result.status, 2);
    assert.equal(result.stdout, '');
    assert.ok(result.stderr.includes('row r4 label "cli-bogus"'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a baseline above nine tenths prints no headroom', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const file = writeRowsFile(dir, [...Array(28).fill('first'), 'second', 'second']);
    const result = runScript(['--score', file]);

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
    S.verdictLine('deem', counts, { outcome: 'stop', reason: 'coverage', p: 0.5 }, 'model=x'),
    'verdict deem: stop (coverage) K=3 M=2 A=1 B=1 W=1 L=1 F=3 p=0.5000 model=x'
  );
});

test('--deem without --out exits 2 before any output', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const result = runScript(['--score', file, '--deem']);

    assert.equal(result.status, 2);
    assert.equal(result.stdout, '');
    assert.ok(result.stderr.includes('error: --jev and --deem need --out <dir>'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a stub or unreachable deem backend skips the arm and leaves the rest byte-identical', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const out = path.join(dir, 'out');
    const base = runWithStubs(stubs, ['--score', file]);
    assert.equal(base.status, 0);

    const stub = runWithStubs(stubs, ['--score', file, '--deem', '--out', out], { STUB_HEALTH: 'stub' });
    assert.equal(stub.status, 0);
    assert.ok(stub.stdout.includes('deem arm skipped: stub backend'));
    assert.equal(withoutLines(stub.stdout, ['deem arm skipped: stub backend']), base.stdout);

    const down = runWithStubs(stubs, ['--score', file, '--deem', '--out', out], { STUB_HEALTH: 'down' });
    assert.equal(down.status, 0);
    assert.ok(down.stdout.includes('deem arm skipped: not reachable'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a jev without a credential prints its identity and one skip line', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const identity = 'jev: path=' + path.join(stubs.dir, 'jev') + ' provider=official';
    const base = runWithStubs(stubs, ['--score', file]);
    const result = runWithStubs(stubs, ['--score', file, '--jev', '--out', path.join(dir, 'out')], { STUB_AUTH_EXIT: '3' });

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes(identity));
    assert.ok(result.stdout.includes('jev arm skipped: no credential'));
    assert.equal(withoutLines(result.stdout, [identity, 'jev arm skipped: no credential']), base.stdout);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('jev off PATH and a wrong jev version each skip', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const absent = makeStubs({ jev: false });
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));

    const missing = runWithStubs(absent, ['--score', file, '--jev', '--out', path.join(dir, 'out')]);
    assert.equal(missing.status, 0);
    assert.ok(missing.stdout.includes('jev: path=none provider=official'));
    assert.ok(missing.stdout.includes('jev arm skipped: jev not on PATH'));

    const wrong = runWithStubs(stubs, ['--score', file, '--jev', '--out', path.join(dir, 'out')], { STUB_JEV_VERSION: 'jev 0.5.0' });
    assert.equal(wrong.status, 0);
    assert.ok(wrong.stdout.includes('jev arm skipped: version'));
    assert.ok(wrong.stdout.includes('jev: found="jev 0.5.0" path=' + path.join(stubs.dir, 'jev')));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(absent.dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a deem stub that answers the label keeps', { timeout: 120000 }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const out = path.join(dir, 'out');
    const result = runWithStubs(stubs, ['--score', file, '--deem', '--out', out]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('deem: nothing leaves the machine planned_calls=90 est_wall_s=5.9'));
    assert.ok(result.stdout.includes('verdict deem: keep K=30 M=30 A=30 B=0 W=30 L=0 F=0 p=9.313e-10 model=deem-0.8-v1 model_commit=mc1 source_commit=sc1'));
    assert.equal(fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n').length, 90);
    assert.equal(JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8')).columns.deem.outcome, 'keep');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a deem stub that answers the first alternative stops on margin', { timeout: 120000 }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const result = runWithStubs(stubs, ['--score', file, '--deem', '--out', path.join(dir, 'out')], { STUB_PICK: 'first' });

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('verdict deem: stop (margin) K=30 M=30 A=0 B=0 W=0 L=0 F=0'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a deem stub that loses to the baseline kills', { timeout: 120000 }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const rows = [];
    for (let i = 0; i < 20; i += 1) {
      rows.push({
        id: 'r' + i,
        hub: 'cli-external-orchestration',
        source: 'canary',
        prompt: 'row ' + i + ' pick=cli-codex first=cli-claude-code',
        alternatives: ['cli-claude-code', 'cli-codex'],
        gold: null,
        label: 'cli-claude-code'
      });
    }
    for (let i = 20; i < 30; i += 1) {
      rows.push({
        id: 'r' + i,
        hub: 'cli-external-orchestration',
        source: 'canary',
        prompt: 'row ' + i + ' pick=cli-claude-code first=cli-claude-code',
        alternatives: ['cli-claude-code', 'cli-codex'],
        gold: null,
        label: 'cli-codex'
      });
    }
    const file = path.join(dir, 'rows.jsonl');
    fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');

    const result = runWithStubs(stubs, ['--score', file, '--deem', '--out', path.join(dir, 'out')]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('verdict deem: kill K=30 M=30 A=0 B=20 W=0 L=20 F=0'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('four failing deem calls in thirty rows stop on coverage', { timeout: 120000 }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    for (let i = 0; i < 4; i += 1) rows[i].prompt += ' fail';
    fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join('\n') + '\n');

    const result = runWithStubs(stubs, ['--score', file, '--deem', '--out', path.join(dir, 'out')]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('verdict deem: stop (coverage) K=30 M=26'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('the label gate blocks the deem arm before any call', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(29).fill('second'));
    const result = runWithStubs(stubs, ['--score', file, '--deem', '--out', path.join(dir, 'out')]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('stop: fewer than 30 labeled rows (29 labeled)'));
    assert.ok(!fs.existsSync(stubs.log) || fs.readFileSync(stubs.log, 'utf8') === '');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a jev stub that answers the label keeps', { timeout: 120000 }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const out = path.join(dir, 'out');
    const result = runWithStubs(stubs, ['--score', file, '--jev', '--out', out]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('planned_calls=91'));
    assert.ok(result.stdout.includes('jev: auth_test provider=official model=stub-jev-model'));
    assert.ok(result.stdout.includes('verdict jev: keep K=30 M=30 A=30 B=0 W=30 L=0 F=0 p=9.313e-10 jev_version=0.6.2 provider=official model=stub-jev-model'));
    assert.equal(fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n').length, 91);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('with both switches the jev verdict prints before the deem verdict', { timeout: 120000 }, () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const result = runWithStubs(stubs, ['--score', file, '--jev', '--deem', '--out', path.join(dir, 'out')]);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('verdict jev:'));
    assert.ok(result.stdout.includes('verdict deem:'));
    assert.ok(result.stdout.indexOf('verdict jev:') < result.stdout.indexOf('verdict deem:'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a rejected key stops the jev arm with no verdict', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'clarify-score-'));
  const stubs = makeStubs();
  try {
    const file = writeRowsFile(dir, Array(30).fill('second'));
    const result = runWithStubs(stubs, ['--score', file, '--jev', '--out', path.join(dir, 'out')], { STUB_CHOICE_EXIT: '3' });

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('jev arm stopped: key rejected'));
    assert.ok(result.stdout.includes('jev: partial_rows=0'));
    assert.ok(!result.stdout.includes('verdict jev:'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});
