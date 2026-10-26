#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: sk-code Benchmark Report Renderer Tests
// ───────────────────────────────────────────────────────────────
'use strict';

// A renderer that drifts from the reports it published is worse than no renderer, because a
// reader cannot tell a new result from a changed template. These cases hold it to the committed
// artifacts: every report the current format covers must re-render byte for byte, a changed
// record value must reach the files that carry it, and the check command must name the file it
// finds stale.
// Run: node --test .skilled/skills/sk-code/benchmark/scripts/tests/render-report.test.cjs

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { FILE_ORDER, RECORD_FILE, renderFolder, renderMarkdownReport } = require('../render-report.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RENDERER = path.resolve(__dirname, '..', 'render-report.cjs');
const HUB_REPORTS = path.resolve(__dirname, '..', '..', 'reports');
const QUALITY_REPORTS = path.resolve(__dirname, '..', '..', '..', 'sk-code-quality', 'benchmark', 'reports');
const TEMP_PREFIX = 'render-report-test-';
// The reports this renderer's template reproduces exactly. They are the golden set, so a
// template change that breaks a published folder fails here instead of rewriting it silently.
const GOLDEN_FOLDERS = [
  [HUB_REPORTS, '2026-06-01--live--live'],
  [HUB_REPORTS, '2026-06-01--live-final--live'],
  [HUB_REPORTS, '2026-06-01--live-remediated--live'],
  [HUB_REPORTS, '2026-06-01--router-final--router'],
  [HUB_REPORTS, '2026-07-10--live-mode-b--live'],
  [HUB_REPORTS, '2026-07-10--router-baseline--router'],
  [QUALITY_REPORTS, '2026-07-10--live-mode-b--live'],
  [QUALITY_REPORTS, '2026-07-10--router-mode-a--router'],
];
// The scoring report and the tally files are the ones a changed result has to reach.
const VALUE_BEARING_FILES = ['skill-benchmark-report.md', 'results.csv', 'failed-runs.md', 'findings-and-recommendations.md'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function tempRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), TEMP_PREFIX));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function readRecord(folder) {
  const raw = fs.readFileSync(path.join(folder, RECORD_FILE));
  return { raw, record: JSON.parse(raw.toString('utf8')) };
}

function renderCommitted(folder) {
  const { raw, record } = readRecord(folder);
  return renderFolder(record, raw, path.basename(folder));
}

function runRenderer(args) {
  return spawnSync(process.execPath, [RENDERER, ...args], { encoding: 'utf8' });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('re-renders every committed report of the current format byte for byte', () => {
  let checked = 0;
  for (const [parent, name] of GOLDEN_FOLDERS) {
    const folder = path.join(parent, name);
    const rendered = renderCommitted(folder);
    for (const file of FILE_ORDER) {
      assert.deepEqual(
        rendered.get(file),
        fs.readFileSync(path.join(folder, file)),
        `${name}/${file} does not match the committed file`,
      );
    }
    checked += 1;
  }
  assert.equal(checked, GOLDEN_FOLDERS.length, 'every golden folder was compared');
});

test('produces the same bytes on a second render of the same record', () => {
  const folder = path.join(HUB_REPORTS, '2026-07-10--router-baseline--router');
  const { raw, record } = readRecord(folder);
  const first = renderFolder(record, raw, path.basename(folder));
  const second = renderFolder(JSON.parse(raw.toString('utf8')), raw, path.basename(folder));
  for (const file of FILE_ORDER) {
    assert.deepEqual(second.get(file), first.get(file), `${file} changed between two renders`);
  }
});

test('a changed record value changes every file that carries it', () => {
  const folder = path.join(QUALITY_REPORTS, '2026-07-10--router-mode-a--router');
  const { raw } = readRecord(folder);

  const changed = JSON.parse(raw.toString('utf8'));
  changed.aggregateScore = 42;
  changed.verdict = 'FAIL';
  changed.scenarioRows[0].modeAScore = 41;
  changed.scenarioRows[0].firstFailingStage = 'discovered';

  const rendered = renderFolder(changed, raw, path.basename(folder));

  const report = rendered.get('skill-benchmark-report.md').toString();
  assert.match(report, /\*\*Verdict: FAIL\*\* · aggregate 42\/100/);
  assert.match(report, /\| CQ-001 \| routing \| 41\/100 \| discovered \|/, 'the scenario row carries the new score');
  for (const file of VALUE_BEARING_FILES) {
    assert.notDeepEqual(
      rendered.get(file),
      fs.readFileSync(path.join(folder, file)),
      `${file} did not change when the record did`,
    );
  }
  assert.match(rendered.get('results.csv').toString(), /CQ-001,code-quality,playbook,,routing,,,,41,FAIL,first failing stage: discovered/);
  assert.match(rendered.get('failed-runs.md').toString(), /1 of 1 scenario\(s\) recorded a FAIL verdict\./);
});

test('renders a RESULTS table only when the record carries measures', () => {
  const folder = path.join(QUALITY_REPORTS, '2026-07-10--router-mode-a--router');
  const { raw, record } = readRecord(folder);
  const name = path.basename(folder);

  const withoutMeasures = renderFolder(record, raw, name).get('README.md').toString();
  assert.doesNotMatch(withoutMeasures, /RESULTS/, 'a record without measures renders no results section');
  assert.match(withoutMeasures, /\n## 3\. FILES\n/, 'the file index keeps its number');

  const measured = JSON.parse(raw.toString('utf8'));
  measured.measures = [
    { name: 'Catch rate', result: '7 of 7 seeded labels matched', target: 'all seeded labels' },
    { name: 'Wall time', result: '1661 ms max on the 50-file set', target: 'under 2000 ms' },
  ];
  const rendered = renderFolder(measured, raw, name).get('README.md').toString();

  const resultsBlock = rendered.split('\n## ').find((block) => block.startsWith('3. RESULTS'));
  assert.ok(resultsBlock, 'the results section is present');
  assert.deepEqual(
    resultsBlock.split('\n').filter((line) => line.startsWith('| ')),
    [
      '| Measure | Result | Target |',
      '| Catch rate | 7 of 7 seeded labels matched | all seeded labels |',
      '| Wall time | 1661 ms max on the 50-file set | under 2000 ms |',
    ],
    'one row per measure, in the order the record holds them',
  );
  assert.match(rendered, /\n## 4\. FILES\n/, 'the file index moves along by one');

  const empty = JSON.parse(raw.toString('utf8'));
  empty.measures = [];
  assert.deepEqual(
    renderFolder(empty, raw, name).get('README.md'),
    renderFolder(record, raw, name).get('README.md'),
    'an empty measures list renders the same bytes as no list at all',
  );
});

test('the check command passes on a fresh render and names the stale file on a mismatch', (t) => {
  const root = tempRoot(t);
  const folder = path.join(QUALITY_REPORTS, '2026-07-10--live-mode-b--live');
  const outFolder = path.join(root, path.basename(folder));

  const write = runRenderer([path.join(folder, RECORD_FILE), outFolder]);
  assert.equal(write.status, 0, write.stderr);

  const clean = runRenderer(['--check', outFolder]);
  assert.equal(clean.status, 0, clean.stdout + clean.stderr);
  assert.match(clean.stdout, /matches a render of its record in all 7 files/);

  const staleFile = 'failed-runs.md';
  fs.writeFileSync(path.join(outFolder, staleFile), 'hand edited\n');
  const stale = runRenderer(['--check', outFolder]);
  assert.equal(stale.status, 1, stale.stdout + stale.stderr);
  assert.match(stale.stdout, /DIFF failed-runs\.md/, 'the stale file is named');
  assert.match(stale.stdout, /differs from a render of its record in 1 of 7 file\(s\)/);
});

test('refuses an unreadable record with a usage exit code', (t) => {
  const root = tempRoot(t);
  const result = runRenderer([path.join(root, 'no-such-report.json'), path.join(root, 'out')]);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /cannot read the machine record/);
});

test('a row measured against no target reads RECORDED and is never counted as a pass', () => {
  const folder = path.join(QUALITY_REPORTS, '2026-07-10--router-mode-a--router');
  const { raw, record } = readRecord(folder);
  const name = path.basename(folder);

  const untargeted = JSON.parse(raw.toString('utf8'));
  untargeted.scenarioRows[0].met = null;
  const rendered = renderFolder(untargeted, raw, name);

  assert.match(rendered.get('results.csv').toString(), /,,89,RECORDED,$/m, 'the csv verdict reads RECORDED');
  assert.match(
    rendered.get('failed-runs.md').toString(),
    /No scenario recorded a FAIL verdict across 1 scenario\(s\): 1 RECORDED\./,
    'the failed-run tally reads the same verdict as the csv',
  );
  assert.match(rendered.get('README.md').toString(), /\| Outcome tally \| 1 RECORDED \|/, 'the run tally reads the same verdict');
  assert.match(rendered.get('skill-benchmark-report.md').toString(), /\| CQ-001 \| routing \| 89\/100 \| recorded \|/, 'the scenario row records the outcome instead of passing it');
  for (const file of ['README.md', 'failed-runs.md', 'results.csv']) {
    assert.doesNotMatch(rendered.get(file).toString(), /1 PASS/, `${file} counted the row as a pass`);
  }
  assert.deepEqual(
    renderFolder(record, raw, name).get('results.csv'),
    fs.readFileSync(path.join(folder, 'results.csv')),
    'a row that carries no measured target at all keeps the verdict it had',
  );
  assert.match(renderFolder(record, raw, name).get('skill-benchmark-report.md').toString(), /\| CQ-001 \| routing \| 89\/100 \| passed \|/, 'a measured row keeps reading passed');
});

test('a word in the aggregate slot renders as that word, never as a score', () => {
  const folder = path.join(QUALITY_REPORTS, '2026-07-10--router-mode-a--router');
  const { raw, record } = readRecord(folder);
  const name = path.basename(folder);

  const stated = JSON.parse(raw.toString('utf8'));
  stated.aggregateScore = 'not recorded';
  const rendered = renderFolder(stated, raw, name);

  assert.match(rendered.get('skill-benchmark-report.md').toString(), /\*\*Verdict: PASS\*\* · aggregate not recorded$/m);
  assert.match(rendered.get('README.md').toString(), /\*\*Verdict: PASS\*\* · aggregate not recorded$/m);
  for (const file of ['skill-benchmark-report.md', 'README.md']) {
    assert.doesNotMatch(rendered.get(file).toString(), /aggregate not recorded\/100/, `${file} put a scale on a word`);
  }
  assert.match(renderFolder(record, raw, name).get('README.md').toString(), /· aggregate 89\/100/, 'a number keeps its scale');
});

test('a pipe in a measure cell is escaped so the row keeps its three columns', () => {
  const folder = path.join(QUALITY_REPORTS, '2026-07-10--router-mode-a--router');
  const { raw } = readRecord(folder);
  const name = path.basename(folder);

  const measured = JSON.parse(raw.toString('utf8'));
  measured.measures = [{ name: 'catch | rate', result: 'a | b', target: 'c | d' }];
  const rendered = renderFolder(measured, raw, name).get('README.md').toString();

  const row = rendered.split('\n').find((line) => line.startsWith('| catch '));
  assert.equal(row, '| catch \\| rate | a \\| b | c \\| d |', 'every cell escapes its pipe');
});

test('a pipe in a bottleneck or scenario cell is escaped so the row keeps its columns', () => {
  const folder = path.join(QUALITY_REPORTS, '2026-07-10--router-mode-a--router');
  const { raw } = readRecord(folder);

  const piped = JSON.parse(raw.toString('utf8'));
  piped.bottlenecks = [{ severity: 'P2', class: 'drift', locus: 'a | b', detail: 'c | d' }];
  piped.scenarioRows = [{ scenarioId: 'S | 1', classKind: 'route', routedOut: true, reason: 'out | of scope' }];
  const report = renderMarkdownReport(piped).split('\n');

  assert.ok(report.includes('| P2 | drift | a \\| b | c \\| d |'), 'the bottleneck row escapes its pipes');
  assert.ok(report.includes('| S \\| 1 | route | _routed-out_ | out \\| of scope |'), 'the scenario row escapes its pipes');
});

test('the check fails on a folder holding a file outside the seven', (t) => {
  const root = tempRoot(t);
  const folder = path.join(QUALITY_REPORTS, '2026-07-10--live-mode-b--live');
  const outFolder = path.join(root, path.basename(folder));

  const write = runRenderer([path.join(folder, RECORD_FILE), outFolder]);
  assert.equal(write.status, 0, write.stderr);

  fs.writeFileSync(path.join(outFolder, 'd4-ablation.json'), '{"summary":{"D4_aggregate":49}}\n');
  const companion = runRenderer(['--check', outFolder]);
  assert.equal(companion.status, 0, companion.stdout + companion.stderr);

  fs.writeFileSync(path.join(outFolder, 'extra.md'), 'hand added\n');
  const extra = runRenderer(['--check', outFolder]);
  assert.equal(extra.status, 1, extra.stdout + extra.stderr);
  assert.match(extra.stdout, /EXTRA extra\.md/, 'the extra file is named');
  assert.match(extra.stdout, /holds 1 file\(s\) outside the 7 it renders/);
});
