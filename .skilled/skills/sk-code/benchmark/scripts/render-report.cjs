#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: sk-code Benchmark Report Renderer
// ───────────────────────────────────────────────────────────────
'use strict';

// A report folder is a rendered artifact: one machine record plus the six files a reader
// and a spreadsheet consume. Rendering it from the record instead of writing the prose by
// hand keeps the two in step, and it lets a check prove that a committed folder still
// matches the record it came from.
// Run: node render-report.cjs <report.json> <out-folder>
//      node render-report.cjs --check <report-folder>

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RECORD_FILE = 'skill-benchmark-report.json';
// The order is the folder's reading order and the order a check reports differences in.
const FILE_ORDER = [
  RECORD_FILE,
  'skill-benchmark-report.md',
  'results.csv',
  'failed-runs.md',
  'findings-and-recommendations.md',
  'source.md',
  'README.md',
];
// A live run also records the companion ablation evidence the reading index documents beside the
// rendered files, so the check allows that one name and calls anything else an extra file.
const COMPANION_FILES = ['d4-ablation.json'];
const NOT_RECORDED = 'not recorded';
const DERIVED_NOTE = "_Derived after the fact from this run's stored record, not written at run time._";
const TEMP_PREFIX = 'render-report-';
// The dimension table is printed in weight order, so the row order is the contract's and
// never the order the record happens to serialise its keys in.
const DIMENSIONS = [
  ['D1inter', 'D1 inter (advisor)'],
  ['D1intra', 'D1 intra (router)'],
  ['D2', 'D2 discovery'],
  ['D3', 'D3 efficiency'],
  ['D4', 'D4 usefulness'],
  ['D5', 'D5 connectivity (hard gate)'],
];
const CSV_COLUMNS = [
  'scenario_id',
  'hub_id',
  'tier',
  'stage',
  'class_kind',
  'gold_mode',
  'provider_model',
  'variant',
  'score',
  'verdict',
  'reason',
];
const USAGE = 'Usage: node render-report.cjs <report.json> <out-folder>\n       node render-report.cjs --check <report-folder>';

// ─────────────────────────────────────────────────────────────────────────────
// 3. SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fail(message) {
  throw new Error(message);
}

function isNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function dimensionCell(entry) {
  if (!entry) return '_not recorded_';
  return isNumber(entry.score) ? `${entry.score}/100` : `_${entry.status ?? NOT_RECORDED}_`;
}

function advisoryCell(signal) {
  return isNumber(signal.score) ? `${signal.score}/100` : `_${signal.status ?? NOT_RECORDED}_`;
}

// A scenario fails on the stage it first failed, and a routed-out scenario records neither a
// score nor a stage, so its reason is the only thing there is to print. A row measured against no
// target is recorded rather than passed, because nothing in it can be called a pass or a failure.
function scenarioVerdict(row) {
  if (row.firstFailingStage) return 'FAIL';
  return row.met === null ? 'RECORDED' : 'PASS';
}

// A table cell holding a pipe would split into two cells and shift the rest of the row, so a pipe
// is escaped before the value reaches the table.
function tableCell(value) {
  return String(value).replace(/\|/g, '\\|');
}

// A record may carry no aggregate, and one kind of run records the absence as a word instead of a
// number. A word is printed as it stands, so a rendered line never turns a recorded absence into a
// score nothing measured.
function aggregateText(record) {
  const score = record.aggregateScore;
  if (isNumber(score)) return `${score}/100`;
  if (typeof score === 'string') return score;
  return `${score ?? 0}/100`;
}

// A score the run did not capture reads as not recorded, never as a zero, so a missing
// measurement cannot be mistaken for a bad result.
function scoreText(row) {
  return isNumber(row.modeAScore) ? `${row.modeAScore}/100` : NOT_RECORDED;
}

function scenarioScoreCell(row) {
  return row.routedOut ? '_routed-out_' : scoreText(row);
}

// The stage column is where the table shows a scenario's outcome, so a row measured against no
// target records that here as well rather than reading as a pass it never claimed.
function scenarioStageCell(row) {
  if (row.firstFailingStage) return row.firstFailingStage;
  if (row.routedOut) return row.reason ?? NOT_RECORDED;
  return row.met === null ? 'recorded' : 'passed';
}

function scenarioReason(row) {
  if (row.firstFailingStage) return `first failing stage: ${row.firstFailingStage}`;
  return row.reason ?? '';
}

function outcomeTally(rows) {
  const counts = new Map();
  for (const row of rows) {
    const verdict = scenarioVerdict(row);
    counts.set(verdict, (counts.get(verdict) ?? 0) + 1);
  }
  const order = ['PASS', 'FAIL'];
  const labels = [...order.filter((v) => counts.has(v)), ...[...counts.keys()].filter((v) => !order.includes(v))];
  return labels.map((v) => `${counts.get(v)} ${v}`).join(', ');
}

function corpusCell(record) {
  const corpus = record.corpus;
  if (typeof corpus === 'string' && corpus) return corpus;
  if (corpus && typeof corpus.name === 'string' && corpus.name) return corpus.name;
  return NOT_RECORDED;
}

// The measures a run was built to report are not scored dimensions, so a record carries them as its
// own list, in its own order. An absent list yields no rows and therefore no section, which is what
// keeps a folder rendered before the section existed byte-identical to a render of its record.
function measureRows(record) {
  const measures = record.measures;
  if (!Array.isArray(measures)) return [];
  return measures.map((measure) => {
    const row = measure ?? {};
    return `| ${tableCell(row.name ?? NOT_RECORDED)} | ${tableCell(row.result ?? NOT_RECORDED)} | ${tableCell(row.target ?? NOT_RECORDED)} |`;
  });
}

function csvCell(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function close(lines) {
  return `${lines.join('\n')}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FILE RENDERERS
// ─────────────────────────────────────────────────────────────────────────────

// Every literal below reproduces the published report format, including its dashes and
// middot separators, so a re-render of a committed folder is byte-identical.
function renderMarkdownReport(record) {
  const skillId = record.targetSkill?.id ?? NOT_RECORDED;
  const rows = record.scenarioRows ?? [];
  const lines = [];

  lines.push(`# Skill Benchmark Report — ${skillId}`, '');
  lines.push(`> Rendered from report.json (do not hand-edit). Scoring: \`${record.scoringMethod ?? NOT_RECORDED}\` · trace mode: \`${record.traceMode ?? NOT_RECORDED}\`.`, '');
  lines.push(`**Verdict: ${record.verdict ?? NOT_RECORDED}** · aggregate ${aggregateText(record)}`, '');

  const coverage = record.coverage;
  if (coverage) {
    lines.push('## Coverage', '');
    lines.push(`- Scored (text executors): **${coverage.scored ?? 0}** · routed out to browser harness: **${coverage.routedOut ?? 0}**`);
    lines.push(`- By class — routing: ${coverage.routing ?? 0} · advisor: ${coverage.advisor ?? 0} · browser: ${coverage.browser ?? 0}`);
    if (coverage.holdout !== undefined || coverage.negative !== undefined) {
      lines.push(`- By stage — holdout: ${coverage.holdout ?? 0} · negative (suppression): ${coverage.negative ?? 0}`);
    }
    lines.push('');
  }

  const generalization = record.generalization;
  if (generalization) {
    lines.push('## Generalization (fitted vs holdout)', '');
    const holdout = isNumber(generalization.holdoutScore) ? `**${generalization.holdoutScore}/100**` : '_none declared_';
    lines.push(`- Fitted aggregate: **${generalization.fittedScore ?? 0}/100** · holdout: ${holdout} · negatives: ${generalization.negativeCount ?? 0}`);
    if (generalization.note) lines.push(`- _${generalization.note}_`);
    lines.push('');
  }

  lines.push('## Dimension scores', '');
  lines.push('| Dimension | Weight | Score |');
  lines.push('| --------- | ------ | ----- |');
  for (const [key, label] of DIMENSIONS) {
    const entry = record.dimensionScores?.[key];
    const points = entry?.points ?? 0;
    lines.push(`| ${label} | ${points}pts | ${dimensionCell(entry)} |`);
  }
  lines.push('');

  const unscored = record.unscoredDimensions ?? [];
  if (unscored.length) lines.push(`_Unscored in this run (need live mode): ${unscored.join(', ')}._`, '');

  const advisory = record.advisorySignals;
  if (advisory) {
    lines.push('### Advisory signals (NOT in the weighted aggregate)', '');
    if (advisory.D4_task_outcome) {
      lines.push(`- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: ${advisoryCell(advisory.D4_task_outcome)}`);
    }
    if (advisory.assetRecall) {
      lines.push(`- **Asset support recall** — deferred \`assets/*\` gold (router defers these on demand): ${advisoryCell(advisory.assetRecall)}`);
    }
    lines.push('');
  }

  const funnel = record.funnel ?? {};
  lines.push('## Funnel', '');
  for (const [stage, count] of Object.entries(funnel)) lines.push(`- ${stage}: ${count}`);
  lines.push('');
  if (record.headlineBottleneck) lines.push(`**Headline bottleneck: ${record.headlineBottleneck}**`, '');

  const bottlenecks = record.bottlenecks ?? [];
  lines.push('## Ranked bottlenecks', '');
  if (bottlenecks.length === 0) {
    lines.push('_None._');
  } else {
    lines.push('| Severity | Class | Locus | Finding |');
    lines.push('| -------- | ----- | ----- | ------- |');
    for (const item of bottlenecks) {
      const locus = item.locus ?? item.stage ?? NOT_RECORDED;
      const cells = [item.severity ?? NOT_RECORDED, item.class ?? NOT_RECORDED, locus, item.detail ?? ''];
      lines.push(`| ${cells.map(tableCell).join(' | ')} |`);
    }
  }
  lines.push('');

  lines.push('## Scenarios', '');
  // The earliest archived runs print a stage column, which the record carries per scenario.
  const hasStage = rows.some((row) => row.stage !== undefined);
  if (hasStage) {
    lines.push('| Scenario | Class | Stage | Score | First failing stage |');
    lines.push('| -------- | ----- | ----- | ----- | ------------------- |');
  } else {
    lines.push('| Scenario | Class | Score | First failing stage |');
    lines.push('| -------- | ----- | ----- | ------------------- |');
  }
  for (const row of rows) {
    const cells = [row.scenarioId ?? NOT_RECORDED, row.classKind ?? NOT_RECORDED];
    if (hasStage) cells.push(row.stage ?? NOT_RECORDED);
    cells.push(scenarioScoreCell(row), scenarioStageCell(row));
    lines.push(`| ${cells.map(tableCell).join(' | ')} |`);
  }
  lines.push('');

  const lintFindings = record.lintFindings ?? [];
  if (lintFindings.length) {
    lines.push('## Contamination findings (router mode — drift, not failures)', '');
    lines.push('_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._');
    for (const finding of lintFindings) {
      lines.push(`- ${finding.scenarioId ?? NOT_RECORDED}: ${(finding.leaks ?? []).join(', ')}`);
    }
    lines.push('');
  }

  lines.push('## Methodology / caveats', '');
  lines.push(`- ${record.runQuality?.note ?? NOT_RECORDED}`);
  lines.push(`- Scenario count: ${record.runQuality?.scenarioCount ?? rows.length}.`);

  return close(lines);
}

function renderResultsCsv(record) {
  const skillId = record.targetSkill?.id ?? '';
  const lines = ['# derived after the fact from this run\'s stored record', CSV_COLUMNS.join(',')];
  for (const row of record.scenarioRows ?? []) {
    lines.push(
      [
        csvCell(row.scenarioId),
        csvCell(skillId),
        csvCell(row.tier),
        csvCell(row.stage),
        csvCell(row.classKind),
        csvCell(row.goldMode ?? row.expectedWorkflowMode),
        csvCell(row.providerModel),
        csvCell(row.variant),
        csvCell(isNumber(row.modeAScore) ? row.modeAScore : ''),
        csvCell(scenarioVerdict(row)),
        csvCell(scenarioReason(row)),
      ].join(','),
    );
  }
  return close(lines);
}

function header(record, title) {
  const skillId = record.targetSkill?.id ?? NOT_RECORDED;
  return [title, '', DERIVED_NOTE, '', `> ${skillId} · ${record.traceMode ?? NOT_RECORDED}`, ''];
}

function renderFailedRuns(record) {
  const rows = record.scenarioRows ?? [];
  const failed = rows.filter((row) => scenarioVerdict(row) === 'FAIL');
  const lines = header(record, '# Failed Runs');
  if (failed.length === 0) {
    lines.push(`No scenario recorded a FAIL verdict across ${rows.length} scenario(s): ${outcomeTally(rows)}.`);
    return close(lines);
  }
  lines.push(`${failed.length} of ${rows.length} scenario(s) recorded a FAIL verdict.`, '');
  const blocks = [];
  for (const row of failed) {
    const block = [];
    block.push(`## ${row.scenarioId ?? NOT_RECORDED}`, '');
    block.push('| Field | Value |');
    block.push('|---|---|');
    block.push(`| Hub | ${record.targetSkill?.id ?? NOT_RECORDED} |`);
    block.push(`| Stage | ${row.stage ?? NOT_RECORDED} |`);
    block.push(`| Expected route | ${row.expectedWorkflowMode ?? NOT_RECORDED} |`);
    block.push(`| Score | ${scoreText(row)} |`);
    block.push(`| Model | ${row.model ?? record.model ?? NOT_RECORDED} |`);
    block.push('');
    block.push(`**Recorded reason.** ${scenarioReason(row)}`);
    blocks.push(block.join('\n'));
  }
  // One blank line between failure blocks and none after the last, so the file ends on the
  // recorded reason rather than on whitespace.
  return close([...lines, blocks.join('\n\n')]);
}

function renderFindings(record) {
  const rows = record.scenarioRows ?? [];
  const failed = rows.filter((row) => scenarioVerdict(row) === 'FAIL');
  const lines = header(record, '# Findings And Recommendations');
  if (failed.length === 0) {
    lines.push(`No FAIL verdicts were recorded across ${rows.length} scenario(s), so this run yields no remediation findings.`);
    return close(lines);
  }
  // Grouping is by recorded reason, most frequent first, so the biggest pattern is the one
  // the reader meets first. Equal counts keep the order the scenarios were recorded in.
  const groups = new Map();
  for (const row of failed) {
    const reason = scenarioReason(row) || NOT_RECORDED;
    if (!groups.has(reason)) groups.set(reason, []);
    groups.get(reason).push(row.scenarioId ?? NOT_RECORDED);
  }
  const ordered = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  lines.push(`${failed.length} failing scenario(s) grouped into ${ordered.length} recorded pattern(s).`, '');
  ordered.forEach(([reason, ids], index) => {
    lines.push(`## ${index + 1}. ${reason}`, '');
    lines.push(`Affects ${ids.length} scenario(s): ${ids.join(', ')}.`, '');
  });
  lines.push('---', '');
  lines.push('Grouping reflects only the reasons this run recorded. Scenarios whose reason was not captured are grouped together and need a re-run before they can be diagnosed.');
  return close(lines);
}

function renderSource(record) {
  const skillId = record.targetSkill?.id ?? NOT_RECORDED;
  const lines = header(record, `# ${skillId} Benchmark Sources`);
  lines.push('This map separates the canonical contracts, the private gold, and the curated outputs in this folder.', '');
  lines.push('| Resource | Purpose |');
  lines.push('|---|---|');
  lines.push(`| Target skill | \`${record.targetSkill?.root ?? NOT_RECORDED}\` |`);
  lines.push(`| Scenario corpus | ${corpusCell(record)} |`);
  lines.push(`| Scoring method | \`${record.scoringMethod ?? NOT_RECORDED}\` |`);
  lines.push(`| Topology digest | \`${record.topologyDigest ?? NOT_RECORDED}\` |`);
  lines.push(`| Machine record | [\`${RECORD_FILE}\`](./${RECORD_FILE}) |`);
  lines.push('| Curated result set | [`results.csv`](./results.csv) |');
  lines.push('');
  lines.push('## Boundary', '');
  lines.push('The corpus and its private gold are inputs and are never rewritten by a run. This folder holds outputs only. A run that needs different gold gets a new corpus revision and a new folder, so a prior run is never overwritten when its result changes.');
  return close(lines);
}

function renderReadme(record, folderName) {
  const skillId = record.targetSkill?.id ?? NOT_RECORDED;
  const rows = record.scenarioRows ?? [];
  const lines = [];
  lines.push(`# ${folderName}`, '');
  lines.push(DERIVED_NOTE, '');
  lines.push(`> ${skillId} · ${record.traceMode ?? NOT_RECORDED}`, '');
  lines.push(`**Verdict: ${record.verdict ?? NOT_RECORDED}** · aggregate ${aggregateText(record)}`, '');
  lines.push('---', '');
  lines.push('## 1. OVERVIEW', '');
  lines.push('This is a curated report. Raw execution evidence stays in the packet that produced it, named in `source.md`. Every file here is generated from the run record: a field this run did not capture reads as not recorded rather than being filled in.', '');
  lines.push('---', '');
  lines.push('## 2. RUN', '');
  lines.push('| Field | Value |');
  lines.push('|---|---|');
  lines.push(`| Target skill | ${skillId} |`);
  lines.push(`| Scoring method | ${record.scoringMethod ?? NOT_RECORDED} |`);
  lines.push(`| Trace mode | ${record.traceMode ?? NOT_RECORDED} |`);
  lines.push(`| Executor | ${record.executor ?? NOT_RECORDED} |`);
  lines.push(`| Model | ${record.model ?? NOT_RECORDED} |`);
  lines.push(`| Scenarios | ${rows.length} |`);
  lines.push(`| Outcome tally | ${outcomeTally(rows)} |`);
  lines.push('');
  // The results sit between the run fields and the file index, so a reader meets the measures before
  // the list of files. The section is numbered with the ones around it, and only a record that
  // carries measures moves the later numbers along.
  const measures = measureRows(record);
  let sectionNumber = 3;
  if (measures.length) {
    lines.push('---', '');
    lines.push(`## ${sectionNumber}. RESULTS`, '');
    lines.push('| Measure | Result | Target |');
    lines.push('|---|---|---|');
    for (const row of measures) lines.push(row);
    lines.push('');
    sectionNumber += 1;
  }
  lines.push('---', '');
  lines.push(`## ${sectionNumber}. FILES`, '');
  lines.push('| File | Contents |');
  lines.push('|---|---|');
  lines.push(`| [\`${RECORD_FILE}\`](./${RECORD_FILE}) | The machine record every other file here derives from |`);
  lines.push('| [`skill-benchmark-report.md`](./skill-benchmark-report.md) | Rendered scoring report, regenerated from the JSON and never hand-edited |');
  lines.push('| [`results.csv`](./results.csv) | One row per scenario, for spreadsheet and diff use |');
  lines.push('| [`failed-runs.md`](./failed-runs.md) | Per-scenario failure detail, or a statement that none was captured |');
  lines.push('| [`findings-and-recommendations.md`](./findings-and-recommendations.md) | Failures grouped by their recorded reason |');
  lines.push('| [`source.md`](./source.md) | Where the corpus, the gold and the raw evidence live |');
  lines.push('');
  return close(lines);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FOLDER RENDER AND WRITE
// ─────────────────────────────────────────────────────────────────────────────

function readRecord(recordPath) {
  let raw;
  try {
    raw = fs.readFileSync(recordPath);
  } catch {
    fail(`cannot read the machine record at ${recordPath}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw.toString('utf8'));
  } catch (error) {
    fail(`the machine record at ${recordPath} is not valid JSON: ${error.message}`);
  }
  return { raw, parsed };
}

// The machine record is copied as it arrived, so the folder's JSON is provably the input and
// a re-render never rewrites the evidence the other files report.
function renderFolder(record, rawRecord, folderName) {
  const rendered = new Map();
  rendered.set(RECORD_FILE, rawRecord);
  rendered.set('skill-benchmark-report.md', Buffer.from(renderMarkdownReport(record), 'utf8'));
  rendered.set('results.csv', Buffer.from(renderResultsCsv(record), 'utf8'));
  rendered.set('failed-runs.md', Buffer.from(renderFailedRuns(record), 'utf8'));
  rendered.set('findings-and-recommendations.md', Buffer.from(renderFindings(record), 'utf8'));
  rendered.set('source.md', Buffer.from(renderSource(record), 'utf8'));
  rendered.set('README.md', Buffer.from(renderReadme(record, folderName), 'utf8'));
  return rendered;
}

function writeFolder(outFolder, rendered) {
  fs.mkdirSync(outFolder, { recursive: true });
  for (const name of FILE_ORDER) fs.writeFileSync(path.join(outFolder, name), rendered.get(name));
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CHECK
// ─────────────────────────────────────────────────────────────────────────────

function differs(left, right) {
  try {
    return !fs.readFileSync(left).equals(fs.readFileSync(right));
  } catch {
    // A missing file is a difference, and it is the one a hand edit leaves behind.
    return true;
  }
}

function checkFolder(folder) {
  const resolved = path.resolve(folder);
  const { raw, parsed } = readRecord(path.join(resolved, RECORD_FILE));
  const folderName = path.basename(resolved);
  const rendered = renderFolder(parsed, raw, folderName);
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), TEMP_PREFIX));
  const tempFolder = path.join(tempRoot, folderName);
  try {
    writeFolder(tempFolder, rendered);
    const differing = FILE_ORDER.filter((name) => differs(path.join(tempFolder, name), path.join(resolved, name)));
    const extra = fs.readdirSync(resolved).filter((name) => !FILE_ORDER.includes(name) && !COMPANION_FILES.includes(name)).sort();
    for (const name of differing) console.log(`DIFF ${name}`);
    for (const name of extra) console.log(`EXTRA ${name}`);
    if (differing.length || extra.length) {
      const reasons = [];
      if (differing.length) reasons.push(`differs from a render of its record in ${differing.length} of ${FILE_ORDER.length} file(s)`);
      if (extra.length) reasons.push(`holds ${extra.length} file(s) outside the ${FILE_ORDER.length} it renders`);
      console.log(`render-report: ${resolved} ${reasons.join(' and ')}`);
      return 1;
    }
    console.log(`render-report: ${resolved} matches a render of its record in all ${FILE_ORDER.length} files`);
    return 0;
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  if (argv[0] === '--check') {
    if (argv.length !== 2) fail(USAGE);
    return checkFolder(argv[1]);
  }
  if (argv.length !== 2) fail(USAGE);
  const outFolder = path.resolve(argv[1]);
  const { raw, parsed } = readRecord(path.resolve(argv[0]));
  writeFolder(outFolder, renderFolder(parsed, raw, path.basename(outFolder)));
  console.log(`render-report: wrote ${FILE_ORDER.length} files to ${outFolder}`);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}

module.exports = {
  FILE_ORDER,
  RECORD_FILE,
  renderMarkdownReport,
  renderResultsCsv,
  renderFailedRuns,
  renderFindings,
  renderSource,
  renderReadme,
  renderFolder,
};
