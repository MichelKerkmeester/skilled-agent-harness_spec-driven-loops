// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: build-verifier-fixture test suite (node --test)               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Covers the fixture builder end to end: one Pi nudge becomes     ║
// ║          one row with its objective and turn evidence, category quotas   ║
// ║          are dealt round-robin, and the CLI refuses to overwrite its     ║
// ║          output. Fixtures are written to temp directories, then removed. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');

const core = require('./goal-core.cjs');
const { buildRows, main, selectRows } = require('./build-verifier-fixture.cjs');

const BLOCKING_REASON = 'Evidence includes blocking or incomplete-work language';
const TOO_SHORT_REASON = 'Evidence is too short to prove completion';
const TRUNCATED_REASON = 'Evidence appears truncated before it proves completion';

function sessionRecords() {
  return [
    { type: 'session', version: 3, id: 's1', timestamp: '2026-08-01T09:59:00.000Z', cwd: '/tmp' },
    {
      type: 'message',
      id: 'm1',
      parentId: null,
      timestamp: '2026-08-01T10:00:00.000Z',
      message: {
        role: 'user',
        content: [{
          type: 'text',
          text: 'Please continue.\n\n[active_goal:g1]\nstatus: active\nobjective: Ship the widget exporter\ngoal_prompt:\nx\n[/active_goal]',
        }],
      },
    },
    {
      type: 'message',
      id: 'm2',
      parentId: null,
      timestamp: '2026-08-01T10:00:10.000Z',
      message: {
        role: 'assistant',
        content: [{ type: 'text', text: 'The widget exporter work is still pending review.' }],
      },
    },
    {
      type: 'message',
      id: 'm3',
      parentId: null,
      timestamp: '2026-08-01T10:00:20.000Z',
      message: { role: 'toolResult', content: [{ type: 'text', text: 'ok' }] },
    },
    {
      type: 'custom_message',
      customType: 'goal-verify-nudge',
      content: `[goal_verify] verdict=not-met; reason=${BLOCKING_REASON}`,
      display: false,
      id: 'n1',
      parentId: null,
      timestamp: '2026-08-01T10:01:00.000Z',
    },
    {
      type: 'custom_message',
      customType: 'goal-verify-nudge',
      content: `[goal_verify] verdict=unclear; reason=${TOO_SHORT_REASON}`,
      display: false,
      id: 'n2',
      parentId: null,
      timestamp: '2026-08-01T10:02:00.000Z',
    },
  ];
}

function makeFixtureDir() {
  const dir = mkdtempSync(join(tmpdir(), 'verifier-fixture-'));
  mkdirSync(join(dir, 'proj'));
  const text = `${sessionRecords().map((record) => JSON.stringify(record)).join('\n')}\n`;
  writeFileSync(join(dir, 'proj', 's1.jsonl'), text);
  return dir;
}

test('buildRows turns one Pi nudge into one fixture row', () => {
  const dir = makeFixtureDir();
  try {
    const { rows, stats } = buildRows({ piDir: dir, limit: 50 });
    assert.equal(rows.length, 1);
    const row = rows[0];
    assert.match(row.id, /^pi-[0-9a-f]{12}$/);
    assert.equal(row.objective, 'Ship the widget exporter');
    assert.equal(row.raw_text, 'The widget exporter work is still pending review.\nok');
    assert.equal(row.ingested_text, core.redactEvidence(row.raw_text));
    assert.equal(row.raw_length, row.raw_text.length);
    assert.equal(row.heuristic_recorded, 'not-met');
    assert.equal(row.prelabel, '');
    assert.equal(row.label, '');
    assert.equal(stats.skippedPiNoTurn, 1);
    assert.equal(stats.reproducedPi, 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('selectRows deals the quota round-robin across reason categories', () => {
  const plain = (reason, index) => ({ key: `${reason}:${index}`, recordedReason: reason });
  const candidates = [
    ...[0, 1, 2].map((index) => plain(BLOCKING_REASON, index)),
    ...[0, 1, 2].map((index) => plain(TRUNCATED_REASON, index)),
  ];
  const picks = selectRows(candidates, 4);
  assert.equal(picks.length, 4);
  assert.equal(picks.filter((pick) => pick.recordedReason === BLOCKING_REASON).length, 2);
  assert.equal(picks.filter((pick) => pick.recordedReason === TRUNCATED_REASON).length, 2);
});

test('main refuses to overwrite and writes a fresh 0600 fixture', () => {
  const dir = makeFixtureDir();
  try {
    const existing = join(dir, 'existing.jsonl');
    writeFileSync(existing, 'keep me\n');
    assert.equal(main(['--pi', dir, '--out', existing]), 2);
    assert.equal(readFileSync(existing, 'utf8'), 'keep me\n');

    const fresh = join(dir, 'fresh.jsonl');
    assert.equal(main(['--pi', dir, '--out', fresh]), 0);
    assert.equal(statSync(fresh).mode & 0o777, 0o600);
    const lines = readFileSync(fresh, 'utf8').split('\n').filter(Boolean);
    assert.equal(lines.length, 1);
    assert.equal(JSON.parse(lines[0]).label, '');

    assert.equal(main(['--jev']), 2);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

function makeClaudeFixtureDir() {
  const dir = mkdtempSync(join(tmpdir(), 'verifier-claude-'));
  mkdirSync(join(dir, 'p'));
  const records = [
    {
      type: 'assistant',
      message: {
        role: 'assistant',
        content: [{ type: 'text', text: 'All done: the importer shipped and tests passed.' }],
      },
    },
    { type: 'attachment', attachment: { type: 'goal_status', condition: 'Ship the importer', met: true } },
    { type: 'attachment', attachment: { type: 'goal_status', condition: 'Ship the importer', met: false } },
  ];
  writeFileSync(join(dir, 'p', 't1.jsonl'), `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
  return dir;
}

function makeClaudeSampleDir() {
  const dir = mkdtempSync(join(tmpdir(), 'verifier-claude-'));
  mkdirSync(join(dir, 'p'));
  for (const name of ['a', 'b', 'c']) {
    const records = [
      {
        type: 'assistant',
        message: { role: 'assistant', content: [{ type: 'text', text: `Report ${name}: every step finished.` }] },
      },
      { type: 'attachment', attachment: { type: 'goal_status', condition: `Ship ${name}`, met: true } },
    ];
    writeFileSync(join(dir, 'p', `${name}.jsonl`), `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
  }
  return dir;
}

test('buildRows turns one Claude goal_status record into one fixture row', () => {
  const cdir = makeClaudeFixtureDir();
  try {
    const { rows, stats } = buildRows({ claudeDir: cdir, limit: 50 });
    assert.equal(rows.length, 1);
    const row = rows[0];
    assert.match(row.id, /^claude-[0-9a-f]{12}$/);
    assert.equal(row.source, 'claude');
    assert.equal(row.objective, 'Ship the importer');
    assert.equal(row.raw_text, 'All done: the importer shipped and tests passed.');
    assert.equal(row.prelabel, 'met');
    assert.equal(row.label, '');
    assert.equal(row.heuristic_recorded, '');
    assert.equal(stats.skippedClaude, 1);
  } finally {
    rmSync(cdir, { recursive: true, force: true });
  }
});

test('buildRows mixes Claude rows first and spends leftover room on Pi rows', () => {
  const piDir = makeFixtureDir();
  const claudeDir = makeClaudeSampleDir();
  try {
    const tight = buildRows({ piDir, claudeDir, limit: 2 });
    assert.deepEqual(tight.rows.map((row) => row.source), ['claude', 'pi']);
    const wide = buildRows({ piDir, claudeDir, limit: 4 });
    assert.deepEqual(wide.rows.map((row) => row.source), ['claude', 'claude', 'claude', 'pi']);
  } finally {
    rmSync(piDir, { recursive: true, force: true });
    rmSync(claudeDir, { recursive: true, force: true });
  }
});
