#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ leaf-route-replay.test — replay, recount and verdict coverage            ║
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

const S = require('../leaf-route-replay.cjs');
const leafContract = require('../lib/leaf-resource-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function routerText(state, body) {
  return [
    '---',
    `router_state: ${state}`,
    'skill_pointer: SKILL.md',
    '---',
    '',
    '# Synthetic Router',
    '',
    '```python',
    body,
    '```',
    ''
  ].join('\n');
}

const ACTIVE_BODY = [
  'INTENT_SIGNALS = {',
  '    "ALPHA": {"weight": 4, "keywords": ["alpha task", "alpha"]},',
  '    "BETA": {"weight": 2, "keywords": ["beta task", "beta"]}',
  '}',
  '',
  'RESOURCE_MAP = {',
  '    "ALPHA": ["pkt-a/references/a.md", "shared/assets/a.md"],',
  '    "BETA": ["pkt-b/references/b.md"]',
  '}'
].join('\n');

const ACTIVE_ROUTER = routerText('active', ACTIVE_BODY);

const TRANSCRIPT_PATH = '/repo/.skilled/skills/sk-doc/ROUTER.md';
const TRANSCRIPT_TEXT = 'secret transcript text';
const GOLD_KEY = leafContract.compositeKey({ workflowMode: 'mode-a', leafResourceId: 'a.md' });

function transcriptDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-route-replay-'));
  fs.writeFileSync(path.join(dir, 'a.jsonl'), [
    JSON.stringify({
      type: 'assistant',
      message: {
        role: 'assistant',
        content: [{ type: 'tool_use', id: 'toolu_01', name: 'Read', input: { file_path: TRANSCRIPT_PATH } }]
      },
      timestamp: '2026-09-29T10:00:00.000Z'
    }),
    JSON.stringify({
      type: 'user',
      message: {
        role: 'user',
        content: [{ tool_use_id: 'toolu_01', type: 'tool_result', content: TRANSCRIPT_TEXT }]
      },
      timestamp: '2026-09-29T10:00:01.000Z'
    })
  ].join('\n') + '\n');
  return dir;
}

function verdictRows(f1) {
  return Array.from({ length: 10 }, (_, index) => ({ id: `S-${index + 1}`, f1, goldKeys: [GOLD_KEY] }));
}

function proseOf(exactIds, emptyIds) {
  const byId = new Map();
  for (const id of exactIds) byId.set(id, new Set([GOLD_KEY]));
  for (const id of emptyIds) byId.set(id, new Set());
  return { byId, unparsed: 0 };
}

function captureSinks() {
  const stdout = [];
  const stderr = [];
  return {
    out: (line) => stdout.push(line),
    err: (line) => stderr.push(line),
    stdout,
    stderr
  };
}

function syntheticRepoRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-route-replay-'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('parseRouter reads an active block', () => {
  const router = S.parseRouter(ACTIVE_ROUTER);

  assert.equal(router.state, 'active');
  assert.deepEqual(Object.keys(router.intents), ['ALPHA', 'BETA']);
  assert.deepEqual(router.intents.ALPHA, { weight: 4, keywords: ['alpha task', 'alpha'] });
  assert.deepEqual(router.resourceMap, {
    ALPHA: ['pkt-a/references/a.md', 'shared/assets/a.md'],
    BETA: ['pkt-b/references/b.md']
  });
  assert.deepEqual(router.intentOrder, ['ALPHA', 'BETA']);
});

test('parseRouter reports a stage1-only block', () => {
  const router = S.parseRouter(routerText('stage1-only', 'INTENT_SIGNALS = {}\n\nRESOURCE_MAP = {}'));

  assert.equal(router.state, 'stage1-only');
  assert.deepEqual(router.intents, {});
  assert.deepEqual(router.resourceMap, {});
  assert.deepEqual(router.intentOrder, []);
});

test('keywordHits guards the four keywords', () => {
  assert.equal(S.keywordHits('preview', 'review'), false);
  assert.equal(S.keywordHits('input', 'inp'), false);
  assert.equal(S.keywordHits('2_javascript', 'javascript'), true);
});

test('scoreIntents weights and sorts', () => {
  const signals = {
    A: { weight: 4, keywords: ['alpha'] },
    B: { weight: 2, keywords: ['beta one', 'beta two'] }
  };

  assert.deepEqual(S.scoreIntents('alpha beta one beta two', signals), [
    { intent: 'A', score: 4 },
    { intent: 'B', score: 4 }
  ]);
});

test('selectIntents keeps one point apart', () => {
  assert.deepEqual(S.selectIntents([{ intent: 'A', score: 4 }, { intent: 'B', score: 3 }]), ['A', 'B']);
  assert.deepEqual(S.selectIntents([{ intent: 'A', score: 4 }, { intent: 'B', score: 2 }]), ['A']);
});

test('selectIntents returns UNKNOWN', () => {
  const router = S.parseRouter(ACTIVE_ROUTER);
  const keys = S.selectIntents(S.scoreIntents('unrelated request', router.intents));

  assert.deepEqual(keys, []);
  // An empty selection is the UNKNOWN row: no kept intent, so no leaf paths.
  assert.deepEqual(keys.flatMap((key) => router.resourceMap[key] ?? []), []);
});

test('toPairs resolves packet-qualified and alias paths', () => {
  const modes = [{ workflowMode: 'mode-a', packet: 'pkt-a' }];
  const aliases = [{ workflowMode: 'mode-b', leafResourceId: 'assets/shared.md', diskPath: 'shared/assets/shared.md' }];
  const { pairs, unresolvable } = S.toPairs(['pkt-a/references/a.md', 'shared/assets/shared.md'], modes, aliases);

  assert.deepEqual(pairs, [
    { workflowMode: 'mode-a', leafResourceId: 'references/a.md' },
    { workflowMode: 'mode-b', leafResourceId: 'assets/shared.md' }
  ]);
  assert.deepEqual(pairs.map((pair) => leafContract.compositeKey(pair)), [
    '["mode-a","references/a.md"]',
    '["mode-b","assets/shared.md"]'
  ]);
  assert.deepEqual(unresolvable, []);
});

test('toPairs counts an unresolvable path', () => {
  const { pairs, unresolvable } = S.toPairs(['other/references/x.md'], [], []);

  assert.deepEqual(pairs, []);
  assert.deepEqual(unresolvable, ['other/references/x.md']);
});

test('scoreRow partial set', () => {
  const score = S.scoreRow(['k1', 'k2'], ['k1', 'k2', 'k3']);

  assert.equal(score.precision, 1);
  assert.equal(score.recall.toPrecision(4), '0.6667');
  assert.equal(score.f1, 0.8);
  assert.equal(score.exact, false);
});

test('scoreRow empty prediction', () => {
  const score = S.scoreRow([], ['k1', 'k2']);

  assert.equal(score.precision, 0);
  assert.equal(score.recall, 0);
  assert.equal(score.f1, 0);
  assert.equal(score.exact, false);
});

test('scoreRow exact match', () => {
  const score = S.scoreRow(['k1', 'k2'], ['k2', 'k1']);

  assert.equal(score.f1, 1);
  assert.equal(score.exact, true);
});

test('countRouterReads finds one read', () => {
  const dir = transcriptDir();
  try {
    const count = S.countRouterReads(dir);

    assert.equal(count.files, 1);
    assert.equal(count.reads, 1);
    assert.equal(count.bytes, TRANSCRIPT_TEXT.length);
    assert.deepEqual(count.byHubWeek, {
      'sk-doc': { '2026-W40': { reads: 1, bytes: TRANSCRIPT_TEXT.length } }
    });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('countRouterReads prints no text', () => {
  const dir = transcriptDir();
  try {
    const lines = S.routerReadLines(S.countRouterReads(dir));

    assert.deepEqual(lines, [
      `router reads: files=1 reads=1 bytes=${TRANSCRIPT_TEXT.length}`,
      `router read hub=sk-doc week=2026-W40 reads=1 bytes=${TRANSCRIPT_TEXT.length}`
    ]);
    assert.ok(!lines.join('\n').includes(TRANSCRIPT_TEXT));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('replayVerdict keeps', () => {
  const rows = verdictRows(0.5);
  const ids = rows.map((row) => row.id);
  const verdict = S.replayVerdict(rows, proseOf(ids.slice(0, 5), ids.slice(5)));

  assert.equal(verdict.outcome, 'keep');
  assert.equal(verdict.line, 'replay verdict: keep N=10 P=10 keyword_f1=0.5000 prose_f1=0.5000');
});

test('replayVerdict drops', () => {
  const rows = verdictRows(0.4);
  const ids = rows.map((row) => row.id);
  const verdict = S.replayVerdict(rows, proseOf(ids.slice(0, 9), ids.slice(9)));

  assert.equal(verdict.outcome, 'drop');
  assert.equal(verdict.line, 'replay verdict: drop N=10 P=10 keyword_f1=0.4000 prose_f1=0.9000');
});

test('replayVerdict stops on coverage', () => {
  const rows = verdictRows(0.5);
  const ids = rows.map((row) => row.id);

  assert.equal(
    S.replayVerdict(rows, null).line,
    'replay verdict: stop (prose arm covers 0 of 10 rows) N=10 P=0 keyword_f1=n/a prose_f1=n/a'
  );
  assert.equal(
    S.replayVerdict(rows, proseOf(ids.slice(0, 8), [])).line,
    'replay verdict: stop (prose arm covers 8 of 10 rows) N=10 P=8 keyword_f1=0.5000 prose_f1=1.000'
  );
});

test('an unknown argument exits 2', async () => {
  const sinks = captureSinks();
  const unknownFlag = '--bogus';
  const code = await S.main([unknownFlag], { out: sinks.out, err: sinks.err });

  assert.equal(code, 2);
  assert.deepEqual(sinks.stdout, []);
  assert.equal(sinks.stderr[0], 'error: unknown argument ' + unknownFlag);
});

test('without the flag the reads line prints not measured', async () => {
  const repoRoot = syntheticRepoRoot();
  const sinks = captureSinks();
  try {
    const code = await S.main([], { out: sinks.out, err: sinks.err, repoRoot });

    assert.equal(code, 0);
    assert.ok(sinks.stdout.includes('router reads: not measured'));
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
  }
});

test('--transcripts on a missing path exits 2', async () => {
  const dir = syntheticRepoRoot();
  const sinks = captureSinks();
  try {
    const code = await S.main(['--transcripts', path.join(dir, 'missing')], { out: sinks.out, err: sinks.err });

    assert.equal(code, 2);
    assert.deepEqual(sinks.stdout, []);
    assert.match(sinks.stderr.join('\n'), /^error: /);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('--prose on a missing file exits 2', async () => {
  const dir = syntheticRepoRoot();
  const sinks = captureSinks();
  try {
    const code = await S.main(['--prose', path.join(dir, 'missing.txt')], { out: sinks.out, err: sinks.err });

    assert.equal(code, 2);
    assert.deepEqual(sinks.stdout, []);
    assert.match(sinks.stderr.join('\n'), /^error: /);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('readProse parses pairs and counts unparsed lines', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-route-replay-'));
  const file = path.join(dir, 'prose.txt');
  try {
    fs.writeFileSync(file, [
      'S-1 modeA:leafA modeB:leafB',
      'S-2 modeA:leafC',
      '',
      'S-3 notapair',
      'lonely',
      ''
    ].join('\n'));
    const { byId, unparsed } = S.readProse(file);

    assert.equal(byId.size, 2);
    assert.deepEqual(byId.get('S-1'), new Set([
      leafContract.compositeKey({ workflowMode: 'modeA', leafResourceId: 'leafA' }),
      leafContract.compositeKey({ workflowMode: 'modeB', leafResourceId: 'leafB' })
    ]));
    assert.deepEqual(byId.get('S-2'), new Set([
      leafContract.compositeKey({ workflowMode: 'modeA', leafResourceId: 'leafC' })
    ]));
    assert.equal(unparsed, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('chooseBaseline prints the better arm', () => {
  const row = (id, goldKeys) => ({
    id,
    intents: ['ALPHA', 'BETA'],
    perIntentKeys: { ALPHA: ['k1'], BETA: ['k2'] },
    predKeys: ['k1', 'k2'],
    goldKeys
  });
  const unionWins = S.chooseBaseline([row('S-1', ['k1', 'k2'])]);
  const tie = S.chooseBaseline([row('S-1', ['k1', 'k2']), row('S-2', ['k1'])]);

  assert.equal(unionWins.choice, 'union');
  assert.equal(tie.choice, 'union');
});

