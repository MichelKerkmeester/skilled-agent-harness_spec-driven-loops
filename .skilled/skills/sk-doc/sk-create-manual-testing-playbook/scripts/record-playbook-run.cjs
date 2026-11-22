#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Playbook Run Recorder
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Save one playbook run into the owning skill's benchmark folder.
 *
 * A scenario run is incomplete until its verdict sits in `<skill>/benchmark/reports/`. This
 * recorder is the one writer for that record: it checks every verdict against the playbook,
 * writes a new dated run folder and adds the run's row to the folder index. It refuses rather
 * than guesses, so a record it writes is always one the playbook can account for.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  walkMarkdown,
  extractFeatureId,
  extractFrontmatter,
  parseCsv,
} = require('./validate-playbook-package.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EXIT_OK = 0;
const EXIT_REFUSED = 1;
const EXIT_USAGE = 2;
const ROOT_FILENAME = 'manual-testing-playbook.md';
const PLAYBOOK_DIRNAME = 'manual-testing-playbook';
const VERDICTS = Object.freeze(['PASS', 'FAIL', 'SKIP']);
const LABEL_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CSV_COLUMNS = Object.freeze(['scenario_id', 'runtime', 'verdict', 'reason', 'evidence']);
const RECORDED_BY = 'recorded by record-playbook-run.cjs';
const INDEX_HEADER = /^\|\s*Executed\s*\|\s*Folder\s*\|/;
const RUNNER_SCENARIO_FILE = 'scenario.json';
const RUNNER_RESULT_FILE = 'result.json';
const NOT_RECORDED = 'not recorded';

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function isCalendarDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function usage() {
  return [
    'Usage: node record-playbook-run.cjs --playbook PATH --results FILE --label SUBJECT--VARIANT [options]',
    '       node record-playbook-run.cjs --runner-out PATH --label SUBJECT--VARIANT [options]',
    '',
    'Writes <skill>/benchmark/reports/<date>--<label>/ with results.csv, README.md and',
    'source.md, then adds the run to <skill>/benchmark/reports/README.md.',
    '',
    'Options:',
    '  --playbook PATH     The manual-testing-playbook root the scenarios came from',
    '  --results FILE      CSV with the header scenario_id,verdict,reason,evidence; a runtime',
    '                      column is optional. Lines starting with # are skipped',
    '  --runner-out PATH   The --out folder of run-conversation-scenario.cjs. Its scenario.json',
    '                      names the scenario, so --playbook is derived from it',
    '  --label TEXT        <subject>--<variant>, for example manual-testing-playbook--goal-hook',
    '  --date YYYY-MM-DD   Execution date (default: today)',
    '  --executor TEXT     The model, runtime or host that ran the scenarios',
    '  --base TEXT         The git state the run used (default: the short HEAD sha)',
    '  --dry-run           Check everything and print the plan without writing',
    '  --help              Show this message',
    '',
    'Exit codes: 0 recorded, 1 refused, 2 usage error.',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { errors: [] };
  const valued = {
    '--playbook': 'playbook',
    '--results': 'results',
    '--runner-out': 'runnerOut',
    '--label': 'label',
    '--date': 'date',
    '--executor': 'executor',
    '--base': 'base',
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--dry-run') args.dryRun = true;
    else if (valued[arg]) {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) args.errors.push(`${arg} needs a value`);
      else args[valued[arg]] = value;
      index += 1;
    } else {
      args.errors.push(`unknown option: ${arg}`);
    }
  }
  if (args.help) return args;
  if (!args.label) args.errors.push('--label is required');
  if (args.results && args.runnerOut) args.errors.push('pass --results or --runner-out, not both');
  if (!args.results && !args.runnerOut) args.errors.push('pass --results or --runner-out');
  if (args.results && !args.playbook) args.errors.push('--results needs --playbook');
  if (args.label && !LABEL_PATTERN.test(args.label)) args.errors.push(`--label must look like subject--variant: ${args.label}`);
  if (args.date && !isCalendarDate(args.date)) args.errors.push(`--date must be a real YYYY-MM-DD date: ${args.date}`);
  return args;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. INPUT READERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read verdict records from a CSV file.
 *
 * @param {string} file - CSV path.
 * @returns {{records: Object[], problems: string[]}} Parsed records and what was wrong.
 */
function readCsvRecords(file) {
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  if (rows.length === 0) return { records: [], problems: [`${file} holds no header`] };
  const header = rows[0].map((name) => name.trim().toLowerCase());
  const missing = ['scenario_id', 'verdict', 'reason', 'evidence'].filter((name) => !header.includes(name));
  if (missing.length > 0) return { records: [], problems: [`${file} header lacks: ${missing.join(', ')}`] };
  const records = rows.slice(1).map((fields) => {
    const record = { line: fields.line };
    header.forEach((name, column) => { record[name] = (fields[column] || '').trim(); });
    return record;
  });
  return { records, problems: [] };
}

/**
 * Read the verdicts a conversation runner left in its --out folder.
 *
 * @param {string} outDir - The runner's --out folder.
 * @returns {{records: Object[], problems: string[], scenarioPath: string|null}} Records, problems and the scenario file.
 */
function readRunnerRecords(outDir) {
  const scenarioFile = path.join(outDir, RUNNER_SCENARIO_FILE);
  if (!fs.existsSync(scenarioFile)) {
    return { records: [], problems: [`${scenarioFile} is missing; rerun the scenario with a runner that writes it`], scenarioPath: null };
  }
  let scenario;
  try {
    scenario = JSON.parse(fs.readFileSync(scenarioFile, 'utf8'));
  } catch (error) {
    return { records: [], problems: [`${scenarioFile} is not JSON: ${error.message}`], scenarioPath: null };
  }
  const records = [];
  const problems = [];
  // A reused --out folder can still hold another scenario's runtimes, so only the ones this run played count.
  const played = Array.isArray(scenario.runtimes) ? new Set(scenario.runtimes.map(String)) : null;
  for (const entry of fs.readdirSync(outDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const resultFile = path.join(outDir, entry.name, RUNNER_RESULT_FILE);
    if (!entry.isDirectory() || !fs.existsSync(resultFile)) continue;
    if (played && !played.has(entry.name)) continue;
    let result;
    try {
      result = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
    } catch (error) {
      problems.push(`${resultFile} is not JSON: ${error.message}`);
      continue;
    }
    // A failed turn carries its reason on the turn, not on the run, so the first one stands in.
    const failedTurn = (result.turns || []).find((turn) => turn.status === 'FAIL');
    const turnReason = failedTurn ? `turn ${failedTurn.id}: ${failedTurn.reason || failedTurn.blocker || 'failed'}` : '';
    records.push({
      line: resultFile,
      scenario_id: String(scenario.scenario_id || ''),
      runtime: String(result.runtime || entry.name),
      verdict: String(result.verdict || ''),
      reason: String(result.blocker || turnReason),
      evidence: path.join(outDir, entry.name),
    });
  }
  if (records.length === 0 && problems.length === 0) problems.push(`${outDir} holds no <runtime>/${RUNNER_RESULT_FILE}`);
  return { records, problems, scenarioPath: scenario.scenario_path || null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PLAYBOOK AND RECORD CHECKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Find the playbook root that holds a scenario file.
 *
 * @param {string} scenarioPath - A scenario file inside a playbook.
 * @returns {string|null} The playbook root, or null when none encloses it.
 */
function playbookRootFor(scenarioPath) {
  let current = path.dirname(path.resolve(scenarioPath));
  while (current !== path.dirname(current)) {
    if (path.basename(current) === PLAYBOOK_DIRNAME && fs.existsSync(path.join(current, ROOT_FILENAME))) return current;
    current = path.dirname(current);
  }
  return null;
}

/**
 * Map every scenario id the playbook defines to its file.
 *
 * @param {string} playbookRoot - Playbook root.
 * @returns {Map<string, string>} Scenario id to playbook-relative path.
 */
function collectScenarioIds(playbookRoot) {
  const ids = new Map();
  const rootFile = path.join(playbookRoot, ROOT_FILENAME);
  for (const file of walkMarkdown(playbookRoot)) {
    if (file === rootFile || path.basename(file).toLowerCase() === 'readme.md') continue;
    const text = fs.readFileSync(file, 'utf8');
    const id = extractFeatureId(text, extractFrontmatter(text));
    if (id && !ids.has(id)) ids.set(id, path.relative(playbookRoot, file).split(path.sep).join('/'));
  }
  return ids;
}

/**
 * Check records against the playbook; every problem is reported, not only the first.
 *
 * @param {Object[]} records - Verdict records.
 * @param {Map<string, string>} ids - Scenario ids the playbook defines.
 * @returns {string[]} Problems; empty when every record is sound.
 */
function checkRecords(records, ids) {
  const problems = [];
  if (records.length === 0) problems.push('no verdict records to save');
  const seen = new Set();
  for (const record of records) {
    const where = `record ${record.line}`;
    if (!record.scenario_id) problems.push(`${where}: scenario_id is empty`);
    else if (!ids.has(record.scenario_id)) problems.push(`${where}: ${record.scenario_id} is not a scenario in this playbook`);
    if (!VERDICTS.includes(record.verdict)) problems.push(`${where}: verdict must be PASS, FAIL or SKIP, got "${record.verdict}"`);
    if ((record.verdict === 'FAIL' || record.verdict === 'SKIP') && !record.reason) {
      problems.push(`${where}: a ${record.verdict} needs a reason`);
    }
    const key = `${record.scenario_id}\u0000${record.runtime || ''}`;
    if (seen.has(key)) problems.push(`${where}: ${record.scenario_id}${record.runtime ? ` on ${record.runtime}` : ''} is recorded twice`);
    seen.add(key);
  }
  return problems;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RENDERING
// ─────────────────────────────────────────────────────────────────────────────

function csvField(value) {
  const text = String(value == null ? '' : value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function cell(value) {
  const text = String(value == null || value === '' ? NOT_RECORDED : value);
  return text.replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
}

function tally(records) {
  const counts = Object.fromEntries(VERDICTS.map((verdict) => [verdict, 0]));
  for (const record of records) counts[record.verdict] += 1;
  const overall = counts.FAIL > 0 ? 'FAIL' : counts.PASS > 0 ? 'PASS' : 'SKIP';
  const text = VERDICTS.filter((verdict) => counts[verdict] > 0).map((verdict) => `${counts[verdict]} ${verdict}`).join(', ');
  return { counts, overall, text };
}

function renderCsv(records, input) {
  const lines = [`# ${RECORDED_BY} from ${input}`, CSV_COLUMNS.join(',')];
  for (const record of records) lines.push(CSV_COLUMNS.map((name) => csvField(record[name])).join(','));
  return `${lines.join('\n')}\n`;
}

function renderReadme(run) {
  const rows = run.records.map((record) => `| ${cell(record.scenario_id)} | \`${run.ids.get(record.scenario_id)}\` | ${cell(record.runtime)} | ${record.verdict} | ${cell(record.reason)} | ${cell(record.evidence)} |`);
  return [
    `# ${run.folder}`,
    '',
    `> ${run.skillName} · ${run.label} · ${run.executor}`,
    '',
    '---',
    '',
    '## 1. OVERVIEW',
    '',
    `Verdict: ${run.tally.overall}.`,
    '',
    `Tally: ${run.tally.text}.`,
    '',
    `The recorder wrote this folder from \`${run.input}\`. A field the run did not capture reads "${NOT_RECORDED}".`,
    '',
    '---',
    '',
    '## 2. RESULTS',
    '',
    '| Scenario | File | Runtime | Verdict | Reason | Evidence |',
    '|---|---|---|---|---|---|',
    ...rows,
    '',
    '---',
    '',
    '## 3. CROSS-LINKS',
    '',
    '| File | Contents |',
    '|---|---|',
    '| `results.csv` | The same verdicts, one row per scenario and runtime |',
    '| `source.md` | Where the corpus and the raw evidence live |',
    '',
  ].join('\n');
}

function renderSource(run) {
  return [
    `# ${run.skillName} Benchmark Sources`,
    '',
    `> ${run.skillName} · ${run.label}`,
    '',
    '---',
    '',
    '## 1. OVERVIEW',
    '',
    'This map names where the raw evidence behind this folder lives.',
    '',
    '| Resource | Purpose |',
    '|---|---|',
    `| Target skill | \`${run.skillRel}\` |`,
    `| Scenarios | ${run.records.map((record) => `\`${record.scenario_id}\``).filter((id, index, all) => all.indexOf(id) === index).join(', ')} under \`${run.playbookRel}/\` |`,
    `| Recorded from | \`${run.input}\` |`,
    `| Executor | ${cell(run.executor)} |`,
    `| Base | ${cell(run.base)} |`,
    '',
    '---',
    '',
    '## 2. BOUNDARY',
    '',
    'The scenarios are inputs and are never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than overwriting this one.',
    '',
  ].join('\n');
}

function indexRow(run) {
  return `| ${run.date} | [\`${run.folder}/\`](./${run.folder}/README.md) | ${cell(run.executor)} | ${run.tally.text} | **${run.tally.overall}** | \`source.md\` in the run folder |`;
}

function renderNewIndex(run) {
  return [
    '---',
    `title: "${run.skillName} Benchmark Reports"`,
    `description: "Index of recorded run reports for ${run.skillName}, one row per run folder."`,
    'trigger_phrases:',
    `  - "${run.skillName} benchmark reports"`,
    'importance_tier: "normal"',
    'contextType: "general"',
    '---',
    '',
    `# ${run.skillName} Benchmark Reports`,
    '',
    `> Recorded runs of the ${run.skillName} playbook, newest first. Raw execution evidence is named in each run's \`source.md\`.`,
    '',
    '---',
    '',
    '## 1. OVERVIEW',
    '',
    'Each row below is one run folder. A run whose result changes gets a new folder. A prior run is never overwritten.',
    '',
    '---',
    '',
    '## 2. RUN INDEX',
    '',
    '| Executed | Folder | Runtime | Result | Verdict | Source |',
    '|---|---|---|---|---|---|',
    indexRow(run),
    '',
  ].join('\n');
}

/**
 * Put the run's row first in the index's run table, newest first.
 *
 * @param {string} text - Current index text.
 * @param {string} row - The row to add.
 * @returns {string|null} The new text, or null when the index has no run table.
 */
function insertIndexRow(text, row) {
  const lines = text.split('\n');
  const header = lines.findIndex((line) => INDEX_HEADER.test(line));
  if (header === -1 || !/^\|[\s|:-]+\|\s*$/.test(lines[header + 1] || '')) return null;
  lines.splice(header + 2, 0, row);
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. RECORDING
// ─────────────────────────────────────────────────────────────────────────────

function today() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function gitRoot(dir) {
  const result = spawnSync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

/**
 * Turn a path into text that stays true once the run folder is committed.
 *
 * Runner output always sits outside the repository and is removed after the run, so an absolute
 * path to it would be dead and would name one machine. Inside the repository a relative path
 * still resolves.
 *
 * @param {string} value - A path, or free text that is left alone.
 * @param {string} repoRoot - Repository root.
 * @returns {string} A repository-relative path, a fixed outside note, or the text unchanged.
 */
function portablePath(value, repoRoot) {
  // Free text such as "/speckit:save printed the folder" starts with a slash too. A real path keeps a first
  // segment that exists on disk even after the file is deleted, so that segment tells the two apart.
  if (!value || !path.isAbsolute(value)) return value;
  const firstSegment = value.split(/[\\/]+/).filter(Boolean)[0];
  if (!firstSegment || !fs.existsSync(path.join(path.parse(value).root, firstSegment))) return value;
  const relative = path.relative(repoRoot, value);
  if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) return relative.split(path.sep).join('/') || '.';
  return `outside the repository and not kept (${path.basename(value)})`;
}

function headSha(dir) {
  const result = spawnSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

/**
 * Check the inputs and work out everything the record needs, writing nothing.
 *
 * @param {Object} args - Parsed arguments.
 * @returns {{ok: boolean, problems: string[], run: Object|null}} The plan, or why there is none.
 */
function planRun(args) {
  const source = args.runnerOut
    ? readRunnerRecords(path.resolve(args.runnerOut))
    : readCsvRecords(path.resolve(args.results));
  if (source.problems.length > 0) return { ok: false, problems: source.problems, run: null };
  const playbookRoot = args.playbook
    ? path.resolve(args.playbook)
    : source.scenarioPath && playbookRootFor(source.scenarioPath);
  if (!playbookRoot || !fs.existsSync(path.join(playbookRoot, ROOT_FILENAME))) {
    return { ok: false, problems: [`no playbook root with ${ROOT_FILENAME}: ${playbookRoot || source.scenarioPath}`], run: null };
  }
  const ids = collectScenarioIds(playbookRoot);
  const problems = checkRecords(source.records, ids);
  const skillRoot = path.dirname(playbookRoot);
  const reportsDir = path.join(skillRoot, 'benchmark', 'reports');
  const date = args.date || today();
  const folder = `${date}--${args.label}`;
  const runDir = path.join(reportsDir, folder);
  if (fs.existsSync(runDir)) problems.push(`${runDir} already exists; a prior run is never overwritten, so pick another label`);
  const indexFile = path.join(reportsDir, 'README.md');
  const indexText = fs.existsSync(indexFile) ? fs.readFileSync(indexFile, 'utf8') : null;
  const repoRoot = gitRoot(skillRoot) || skillRoot;
  const records = source.records.map((record) => ({ ...record, evidence: portablePath(record.evidence, repoRoot) }));
  const run = {
    ids,
    records,
    tally: problems.length === 0 ? tally(records) : null,
    input: portablePath(path.resolve(args.runnerOut || args.results), repoRoot),
    label: args.label,
    date,
    folder,
    runDir,
    reportsDir,
    indexFile,
    indexText,
    repoRoot,
    skillName: path.basename(skillRoot),
    skillRel: path.relative(repoRoot, skillRoot).split(path.sep).join('/'),
    playbookRel: path.relative(repoRoot, playbookRoot).split(path.sep).join('/'),
    executor: args.executor || NOT_RECORDED,
    base: args.base || headSha(skillRoot) || NOT_RECORDED,
  };
  if (problems.length === 0 && indexText !== null && insertIndexRow(indexText, indexRow(run)) === null) {
    problems.push(`${indexFile} has no run table headed "| Executed | Folder |"; add one, then record again`);
  }
  return { ok: problems.length === 0, problems, run };
}

/**
 * Write the run folder and its index row.
 *
 * @param {Object} run - A plan from planRun with no problems.
 * @returns {string[]} The files written.
 */
function writeRun(run) {
  const files = [
    ['results.csv', renderCsv(run.records, run.input)],
    ['README.md', renderReadme(run)],
    ['source.md', renderSource(run)],
  ];
  const indexBody = run.indexText === null ? renderNewIndex(run) : insertIndexRow(run.indexText, indexRow(run));
  // The folder is built under a staging name and renamed last, so a failed write never leaves a
  // half-saved run whose folder name would then block the retry.
  const staging = `${run.runDir}.partial-${process.pid}`;
  fs.mkdirSync(staging, { recursive: true });
  try {
    for (const [name, body] of files) fs.writeFileSync(path.join(staging, name), body);
    fs.writeFileSync(run.indexFile, indexBody);
  } catch (error) {
    fs.rmSync(staging, { recursive: true, force: true });
    throw error;
  }
  try {
    fs.renameSync(staging, run.runDir);
  } catch (error) {
    if (run.indexText === null) fs.rmSync(run.indexFile, { force: true });
    else fs.writeFileSync(run.indexFile, run.indexText);
    fs.rmSync(staging, { recursive: true, force: true });
    throw error;
  }
  return [...files.map(([name]) => path.join(run.runDir, name)), run.indexFile];
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. COMMAND LINE ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write(`${usage()}\n`);
    return EXIT_OK;
  }
  if (args.errors.length > 0) {
    for (const error of args.errors) process.stderr.write(`[record-playbook-run] ${error}\n`);
    process.stderr.write(`${usage()}\n`);
    return EXIT_USAGE;
  }
  const plan = planRun(args);
  if (!plan.ok) {
    for (const problem of plan.problems) process.stderr.write(`[record-playbook-run] refused: ${problem}\n`);
    return EXIT_REFUSED;
  }
  const { run } = plan;
  if (args.dryRun) {
    process.stdout.write(`[record-playbook-run] dry run: would write ${run.runDir} (${run.tally.text}) and update ${run.indexFile}\n`);
    return EXIT_OK;
  }
  let written;
  try {
    written = writeRun(run);
  } catch (error) {
    process.stderr.write(`[record-playbook-run] refused: could not write the run (${error.message}); nothing was saved\n`);
    return EXIT_REFUSED;
  }
  for (const file of written) process.stdout.write(`[record-playbook-run] wrote ${path.relative(run.repoRoot, file)}\n`);
  process.stdout.write(`[record-playbook-run] ${run.folder}: ${run.tally.text}, verdict ${run.tally.overall}\n`);
  // The README audit freezes the repository's durable directories, so every new run folder
  // must be added to that list in the same commit or the audit test fails.
  const manifestTest = path.join(run.repoRoot, '.skilled', 'skills', 'sk-doc', 'scripts', 'tests', 'test_readme_manifest.py');
  if (fs.existsSync(manifestTest)) {
    process.stdout.write(`[record-playbook-run] next: python3 ${path.relative(run.repoRoot, manifestTest)} --write\n`);
  }
  return EXIT_OK;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`[record-playbook-run] ${error.message}\n`);
    process.exitCode = EXIT_USAGE;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  EXIT_OK,
  EXIT_REFUSED,
  EXIT_USAGE,
  CSV_COLUMNS,
  RECORDED_BY,
  parseArgs,
  parseCsv,
  readCsvRecords,
  readRunnerRecords,
  collectScenarioIds,
  checkRecords,
  insertIndexRow,
  planRun,
  writeRun,
  main,
};
