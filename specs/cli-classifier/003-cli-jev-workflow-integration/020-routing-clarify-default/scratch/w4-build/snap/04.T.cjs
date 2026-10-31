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
