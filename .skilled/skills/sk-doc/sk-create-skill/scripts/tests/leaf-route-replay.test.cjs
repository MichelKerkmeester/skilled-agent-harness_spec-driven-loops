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

// Two intents one point apart, so every prompt below ties; BETA declares
// first, so the first tied intent is the one whose leaves the gold rows drop.
const TIED_ROUTER_BODY = [
  'INTENT_SIGNALS = {',
  '    "BETA": {"weight": 3, "keywords": ["beta"]},',
  '    "ALPHA": {"weight": 4, "keywords": ["alpha"]}',
  '}',
  '',
  'RESOURCE_MAP = {',
  '    "BETA": ["pkt-b/references/b.md"],',
  '    "ALPHA": ["pkt-a/references/a.md"]',
  '}'
].join('\n');

// A repository whose first hub replays to five tied rows, of which the last
// `exactRows` rows are already exactly right (baseline F1 1, no headroom) and
// the rest are improvable (baseline F1 2/3).
function tiedRepoRoot(opts = {}) {
  const repoRoot = syntheticRepoRoot();
  const hubRoot = path.join(repoRoot, '.skilled', 'skills', 'sk-doc');
  const playbookRoot = path.join(hubRoot, 'manual-testing-playbook', 'compiled-routing');
  fs.mkdirSync(playbookRoot, { recursive: true });
  fs.writeFileSync(path.join(hubRoot, 'ROUTER.md'), routerText('active', TIED_ROUTER_BODY));
  fs.writeFileSync(path.join(hubRoot, 'mode-registry.json'), JSON.stringify({
    modes: [
      { workflowMode: 'mode-a', packet: 'pkt-a' },
      { workflowMode: 'mode-b', packet: 'pkt-b' }
    ]
  }));
  const exactRows = opts.exactRows || 0;
  for (let i = 0; i < 5; i += 1) {
    const pairs = ['  - workflow_mode: mode-a', '    leaf_resource_id: references/a.md'];
    if (i >= 5 - exactRows) pairs.push('  - workflow_mode: mode-b', '    leaf_resource_id: references/b.md');
    fs.writeFileSync(path.join(playbookRoot, `s${i + 1}.md`), [
      '---',
      `id: S-${i + 1}`,
      'expected_leaf_resources:',
      ...pairs,
      '---',
      '',
      `# S-${i + 1}`,
      '',
      '**Exact prompt**:',
      '',
      '```',
      'alpha beta',
      '```',
      ''
    ].join('\n'));
  }
  return repoRoot;
}

function makeStubs(opts = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'leaf-route-replay-stubs-'));
  const log = path.join(dir, 'calls.log');

  const choice = [
    '  choice)',
    '    text=$(cat)',
    '    if [ -n "$STUB_CHOICE_EXIT" ]; then exit "$STUB_CHOICE_EXIT"; fi',
    '    key="${STUB_CHOICE:-none_of_these}"',
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

test('a jev without a credential skips', () => {
  const stubs = makeStubs();
  const sinks = captureSinks();
  try {
    const result = S.jevGate({
      out: sinks.out,
      env: { PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log, STUB_AUTH_EXIT: '3' }
    });

    assert.equal(result.passed, false);
    assert.equal(result.path, path.join(stubs.dir, 'jev'));
    assert.deepEqual(sinks.stdout, [
      `jev: path=${path.join(stubs.dir, 'jev')} provider=official`,
      'jev arm skipped: no credential'
    ]);
  } finally {
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('jev off PATH and wrong version skip', () => {
  const missing = makeStubs({ jev: false });
  const missingSinks = captureSinks();
  try {
    const result = S.jevGate({ out: missingSinks.out, env: { PATH: missing.dir + ':/usr/bin:/bin', STUB_LOG: missing.log } });

    assert.equal(result.passed, false);
    assert.equal(result.path, null);
    assert.deepEqual(missingSinks.stdout, [
      'jev: path=none provider=official',
      'jev arm skipped: jev not on PATH'
    ]);
  } finally {
    fs.rmSync(missing.dir, { recursive: true, force: true });
  }

  const stubs = makeStubs();
  const sinks = captureSinks();
  try {
    const result = S.jevGate({
      out: sinks.out,
      env: { PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log, STUB_JEV_VERSION: 'jev 0.5.0' }
    });

    assert.equal(result.passed, false);
    assert.equal(result.path, path.join(stubs.dir, 'jev'));
    assert.deepEqual(sinks.stdout, [
      `jev: path=${path.join(stubs.dir, 'jev')} provider=official`,
      'jev arm skipped: version',
      `jev: found="jev 0.5.0" path=${path.join(stubs.dir, 'jev')}`
    ]);
  } finally {
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a switch without --out exits 2', async () => {
  const sinks = captureSinks();
  const code = await S.main(['--jev'], { out: sinks.out, err: sinks.err });

  assert.equal(code, 2);
  assert.deepEqual(sinks.stdout, []);
  assert.equal(sinks.stderr[0], 'error: --jev needs --out <dir>');
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

test('decideVerdict order', () => {
  const cases = [
    [{ K: 30, M: 26, SA: 26, SB: 0, W: 26, L: 0, F: 0 }, 'stop (coverage)'],
    [{ K: 30, M: 30, SA: 0, SB: 20, W: 0, L: 20, F: 0 }, 'kill'],
    [{ K: 30, M: 30, SA: 0, SB: 0, W: 0, L: 0, F: 0 }, 'stop (margin)'],
    [{ K: 30, M: 30, SA: 5, SB: 2, W: 5, L: 2, F: 0 }, 'stop (sign test)'],
    [{ K: 30, M: 30, SA: 30, SB: 0, W: 30, L: 0, F: 10 }, 'stop (flips)'],
    [{ K: 30, M: 30, SA: 30, SB: 0, W: 30, L: 0, F: 0 }, 'keep']
  ];

  for (const [counts, label] of cases) {
    const decision = S.decideVerdict(counts);
    assert.equal(decision.outcome === 'stop' ? `stop (${decision.reason})` : decision.outcome, label, JSON.stringify(counts));
  }
});

test('tailP(7, 5) equals 29/128', () => {
  const tail = S.tailP(7, 5);

  assert.equal(tail.num, 29n);
  assert.equal(tail.den, 128n);
  assert.equal(tail.p, 29 / 128);
});

test('tailP(30, 30) equals 2 ** -30', () => {
  const tail = S.tailP(30, 30);

  assert.equal(tail.num, 1n);
  assert.equal(tail.den, 2n ** 30n);
  assert.equal(tail.p, 2 ** -30);
});

test('no headroom at 4 improvable rows', { timeout: 120000 }, async () => {
  const repoRoot = tiedRepoRoot({ exactRows: 1 });
  const stubs = makeStubs();
  const sinks = captureSinks();
  try {
    const code = await S.main(['--jev', '--out', path.join(repoRoot, 'out')], {
      out: sinks.out,
      err: sinks.err,
      repoRoot,
      env: { PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log }
    });

    assert.equal(code, 0);
    assert.ok(sinks.stdout.includes('tied: K=5'));
    assert.ok(sinks.stdout.includes('no headroom'));
    assert.ok(!sinks.stdout.some((line) => line.startsWith('jev arm skipped')));
    assert.ok(!fs.existsSync(stubs.log) || fs.readFileSync(stubs.log, 'utf8') === '');
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('headroom at 5 improvable rows', { timeout: 120000 }, async () => {
  const repoRoot = tiedRepoRoot();
  const stubs = makeStubs();
  const sinks = captureSinks();
  try {
    const code = await S.main(['--jev', '--out', path.join(repoRoot, 'out')], {
      out: sinks.out,
      err: sinks.err,
      repoRoot,
      env: { PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log, STUB_AUTH_EXIT: '3' }
    });

    assert.equal(code, 0);
    assert.ok(sinks.stdout.includes('tied: K=5'));
    assert.ok(!sinks.stdout.includes('no headroom'));
    assert.ok(sinks.stdout.includes('jev arm skipped: no credential'));
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});

test('a stopped jev arm prints partial', { timeout: 120000 }, async () => {
  const repoRoot = tiedRepoRoot();
  const stubs = makeStubs();
  const sinks = captureSinks();
  try {
    const code = await S.main(['--jev', '--out', path.join(repoRoot, 'out')], {
      out: sinks.out,
      err: sinks.err,
      repoRoot,
      env: { PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log, STUB_CHOICE_EXIT: '3' }
    });

    assert.equal(code, 0);
    assert.ok(sinks.stdout.includes('jev arm stopped: key rejected'));
    assert.ok(sinks.stdout.includes('jev: partial_rows=0'));
    assert.ok(!sinks.stdout.some((line) => line.startsWith('verdict jev:')));
  } finally {
    fs.rmSync(repoRoot, { recursive: true, force: true });
    fs.rmSync(stubs.dir, { recursive: true, force: true });
  }
});
