// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: count-pi-goal-nudges test suite (node:test)                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Fixture-driven checks for the nudge census CLI. Covers the      ║
// ║          session and total tallies, empty stdout on an unknown record,   ║
// ║          and that no message or nudge content reaches the output.        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const CENSUS = join(dirname(fileURLToPath(import.meta.url)), 'count-pi-goal-nudges.mjs');

const REASONS = [
  'Evidence is too short to prove completion',
  'Evidence includes blocking or incomplete-work language',
  'Evidence appears truncated before it proves completion',
  'Evidence lacks an explicit completion signal',
  'Evidence does not reference the goal objective specifically enough',
];

function makeTempDir() {
  return mkdtempSync(join(tmpdir(), 'pi-census-'));
}

function writeJsonl(filePath, records) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`, 'utf8');
}

function nudgeRecord(id, date, verdict, reason) {
  return {
    type: 'custom_message',
    customType: 'goal-verify-nudge',
    content: `[goal_verify] verdict=${verdict}; reason=${reason}`,
    display: false,
    id,
    parentId: null,
    timestamp: `${date}T10:00:00.000Z`,
  };
}

function writeFixtureA(dir) {
  writeJsonl(join(dir, 'proj', 's1.jsonl'), [
    { type: 'session', version: 3, id: 's1', timestamp: '2026-08-01T09:00:00.000Z', cwd: '/tmp' },
    {
      type: 'message',
      id: 'm1',
      parentId: null,
      timestamp: '2026-08-02T10:00:00.000Z',
      message: { role: 'assistant', content: [{ type: 'text', text: 'PLANTED-MESSAGE-TEXT-7f3a' }] },
    },
    {
      type: 'custom',
      customType: 'other',
      id: 'c1',
      parentId: null,
      timestamp: '2026-08-02T11:00:00.000Z',
      data: {},
    },
    nudgeRecord('n1', '2026-08-01', 'unclear', REASONS[0]),
    nudgeRecord('n2', '2026-08-02', 'not-met', REASONS[1]),
    nudgeRecord('n3', '2026-08-03', 'unclear', REASONS[2]),
    nudgeRecord('n4', '2026-08-04', 'unclear', REASONS[3]),
    nudgeRecord('n5', '2026-08-05', 'unclear', REASONS[4]),
  ]);
  writeJsonl(join(dir, 'proj', 'sub', 's2.jsonl'), [nudgeRecord('n6', '2026-08-06', 'unclear', REASONS[2])]);
}

function runCensus(dir) {
  return spawnSync(process.execPath, [CENSUS, '--dir', dir], { encoding: 'utf8' });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('fixture A reports per-session and total nudge tallies', () => {
  const dir = makeTempDir();
  try {
    writeFixtureA(dir);
    const result = runCensus(dir);
    assert.equal(result.status, 0);
    const lines = result.stdout.split('\n');
    assert.ok(lines[0].startsWith('method: unit=one custom_message record with customType goal-verify-nudge,'));
    assert.ok(lines[0].includes('files_scanned=2'));
    assert.ok(lines[0].endsWith('window=2026-08-01..2026-08-06 from the record timestamp field'));
    assert.ok(
      lines.includes(
        'session: file=proj/s1.jsonl nudges=5 not-met=1 unclear=4 other_verdict=0 met=not_recorded too_short=1 blocking=1 truncated=1 no_completion=1 weak_link=1 other=0 first=2026-08-01 last=2026-08-05',
      ),
    );
    assert.ok(
      lines.includes(
        'totals: sessions_with_nudges=2 nudges=6 not-met=1 unclear=5 other_verdict=0 met=not_recorded too_short=1 blocking=1 truncated=2 no_completion=1 weak_link=1 other=0 first=2026-08-01 last=2026-08-06',
      ),
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('unknown record type exits non-zero with empty stdout', () => {
  const dir = makeTempDir();
  try {
    writeJsonl(join(dir, 'bad.jsonl'), [
      { type: 'mystery', id: 'x', parentId: null, timestamp: '2026-08-01T00:00:00.000Z' },
    ]);
    const result = runCensus(dir);
    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes('UNKNOWN_RECORD_TYPE'));
    assert.equal(result.stdout, '');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('census output never echoes record content', () => {
  const dir = makeTempDir();
  try {
    writeFixtureA(dir);
    const result = runCensus(dir);
    const combined = result.stdout + result.stderr;
    assert.ok(!combined.includes('PLANTED-MESSAGE-TEXT-7f3a'));
    assert.ok(!combined.includes('[goal_verify]'));
    assert.ok(!combined.includes('Evidence'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
