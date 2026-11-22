#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Playbook Run Recorder Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const recorderPath = path.resolve(__dirname, '..', 'record-playbook-run.cjs');
const fixtureSource = path.join(__dirname, 'fixtures', 'clean-package');

/**
 * Copy the clean fixture into a throwaway skill, so the recorder writes beside it.
 *
 * @param {string} label - Temporary folder label.
 * @returns {{skillRoot: string, playbookRoot: string, reportsDir: string}} Paths in the copy.
 */
function makeSkill(label) {
  const skillRoot = path.join(fs.mkdtempSync(path.join(os.tmpdir(), `recorder-${label}-`)), 'skill');
  const playbookRoot = path.join(skillRoot, 'manual-testing-playbook');
  fs.cpSync(fixtureSource, playbookRoot, { recursive: true });
  return { skillRoot, playbookRoot, reportsDir: path.join(skillRoot, 'benchmark', 'reports') };
}

function writeCsv(dir, body, name = 'verdicts.csv') {
  const file = path.join(dir, name);
  fs.writeFileSync(file, body);
  return file;
}

function record(args) {
  return spawnSync(process.execPath, [recorderPath, '--date', '2026-11-22', '--base', 'abc1234', ...args], { encoding: 'utf8' });
}

function runHappyPath() {
  const { skillRoot, playbookRoot, reportsDir } = makeSkill('happy');
  const csv = writeCsv(skillRoot, 'scenario_id,verdict,reason,evidence\nFX-001,PASS,,"screens, logs"\n');
  const first = record(['--playbook', playbookRoot, '--results', csv, '--label', 'manual-testing-playbook--first', '--executor', 'fixture host']);
  assert.strictEqual(first.status, 0, `first record should exit 0\n${first.stdout}\n${first.stderr}`);
  const runDir = path.join(reportsDir, '2026-11-22--manual-testing-playbook--first');
  for (const name of ['results.csv', 'README.md', 'source.md']) assert(fs.existsSync(path.join(runDir, name)), `${name} is written`);
  const results = fs.readFileSync(path.join(runDir, 'results.csv'), 'utf8').split('\n');
  assert(results[0].startsWith('# recorded by record-playbook-run.cjs'), 'results.csv says where it came from');
  assert.strictEqual(results[2], 'FX-001,,PASS,,"screens, logs"', 'a field holding a comma stays one field');
  const readme = fs.readFileSync(path.join(runDir, 'README.md'), 'utf8');
  assert(readme.includes('| FX-001 | `scenarios/clean-scenario.md` | not recorded | PASS |'), 'the README row names the scenario file');

  const second = record(['--playbook', playbookRoot, '--results', csv, '--label', 'manual-testing-playbook--second']);
  assert.strictEqual(second.status, 0, `second record should exit 0\n${second.stderr}`);
  const index = fs.readFileSync(path.join(reportsDir, 'README.md'), 'utf8');
  const secondAt = index.indexOf('2026-11-22--manual-testing-playbook--second');
  const firstAt = index.indexOf('2026-11-22--manual-testing-playbook--first');
  assert(secondAt > -1 && firstAt > secondAt, 'the index lists the newest run first');
  console.log('recorder happy path: PASS (8 assertions)');
}

function runRefusals() {
  const { skillRoot, playbookRoot, reportsDir } = makeSkill('refuse');
  const unknown = record(['--playbook', playbookRoot, '--results', writeCsv(skillRoot, 'scenario_id,verdict,reason,evidence\nFX-999,PASS,,\n'), '--label', 'manual-testing-playbook--unknown']);
  assert.strictEqual(unknown.status, 1, 'an id the playbook does not define is refused');
  assert(unknown.stderr.includes('FX-999 is not a scenario in this playbook'), 'the refusal names the id');
  assert(!fs.existsSync(reportsDir), 'a refused record writes nothing');

  const noReason = record(['--playbook', playbookRoot, '--results', writeCsv(skillRoot, 'scenario_id,verdict,reason,evidence\nFX-001,FAIL,,\n'), '--label', 'manual-testing-playbook--no-reason']);
  assert.strictEqual(noReason.status, 1, 'a FAIL without a reason is refused');

  const good = writeCsv(skillRoot, 'scenario_id,verdict,reason,evidence\nFX-001,PASS,,\n');
  assert.strictEqual(record(['--playbook', playbookRoot, '--results', good, '--label', 'manual-testing-playbook--again']).status, 0);
  const indexBefore = fs.readFileSync(path.join(reportsDir, 'README.md'), 'utf8');
  const again = record(['--playbook', playbookRoot, '--results', good, '--label', 'manual-testing-playbook--again']);
  assert.strictEqual(again.status, 1, 'an existing run folder is never overwritten');
  assert.strictEqual(fs.readFileSync(path.join(reportsDir, 'README.md'), 'utf8'), indexBefore, 'a refused record leaves the index alone');

  const usage = record(['--playbook', playbookRoot, '--results', good]);
  assert.strictEqual(usage.status, 2, 'a missing label is a usage error');
  console.log('recorder refusals: PASS (8 assertions)');
}

function runEdgeCases() {
  const { skillRoot, playbookRoot, reportsDir } = makeSkill('edge');
  const good = writeCsv(skillRoot, 'scenario_id,verdict,reason,evidence\nFX-001,PASS,,/speckit:save printed the folder\n');
  const deletedPath = path.join(os.tmpdir(), 'recorder-deleted-evidence', 'turn-1.txt');
  const deleted = writeCsv(skillRoot, `scenario_id,verdict,reason,evidence\nFX-001,PASS,,${deletedPath}\n`, 'deleted.csv');

  const dry = record(['--playbook', playbookRoot, '--results', good, '--label', 'manual-testing-playbook--create-goal--rerun', '--dry-run']);
  assert.strictEqual(dry.status, 0, `a label with a second variant part is accepted\n${dry.stderr}`);
  assert(!fs.existsSync(reportsDir), 'a dry run writes nothing');
  assert.strictEqual(record(['--playbook', playbookRoot, '--results', good, '--label', 'manual-testing-playbook--x', '--date', '2026-02-31']).status, 2, 'an impossible date is a usage error');

  // A quote inside a comment must not open a field and swallow the rows after it.
  const commented = writeCsv(skillRoot, '# a "quoted note\nscenario_id,verdict,reason,evidence\nFX-999,PASS,,\n', 'commented.csv');
  const unknown = record(['--playbook', playbookRoot, '--results', commented, '--label', 'manual-testing-playbook--commented']);
  assert(unknown.stderr.includes('record 3') && unknown.stderr.includes('FX-999'), `the problem names the file line; got ${unknown.stderr}`);

  fs.mkdirSync(reportsDir, { recursive: true });
  const indexFile = path.join(reportsDir, 'README.md');
  fs.writeFileSync(indexFile, '# Reports\n\n| Folder | Description |\n|---|---|\n');
  const noTable = record(['--playbook', playbookRoot, '--results', good, '--label', 'manual-testing-playbook--no-table']);
  assert.strictEqual(noTable.status, 1, 'an index without a run table is refused');
  assert.deepStrictEqual(fs.readdirSync(reportsDir), ['README.md'], 'the refusal writes no run folder');

  fs.writeFileSync(indexFile, '# Reports\n\n| Executed | Folder | Runtime | Result | Verdict | Source |\n|---|---|---|---|---|---|\n');
  fs.chmodSync(indexFile, 0o444);
  const readOnly = record(['--playbook', playbookRoot, '--results', good, '--label', 'manual-testing-playbook--read-only']);
  fs.chmodSync(indexFile, 0o644);
  assert.strictEqual(readOnly.status, 1, `a failed write is a refusal\n${readOnly.stderr}`);
  assert.deepStrictEqual(fs.readdirSync(reportsDir), ['README.md'], 'a failed write leaves no half-saved run folder');

  const freeText = record(['--playbook', playbookRoot, '--results', good, '--label', 'manual-testing-playbook--free-text']);
  assert.strictEqual(freeText.status, 0, `free text records\n${freeText.stderr}`);
  const row = fs.readFileSync(path.join(reportsDir, '2026-11-22--manual-testing-playbook--free-text', 'results.csv'), 'utf8').split('\n')[2];
  assert(row.endsWith(',/speckit:save printed the folder'), `free-text evidence is kept as written; got ${row}`);

  // A temp file deleted before the record is still a machine path, so it must not reach the committed CSV.
  assert.strictEqual(record(['--playbook', playbookRoot, '--results', deleted, '--label', 'manual-testing-playbook--deleted']).status, 0);
  const deletedRow = fs.readFileSync(path.join(reportsDir, '2026-11-22--manual-testing-playbook--deleted', 'results.csv'), 'utf8').split('\n')[2];
  assert(deletedRow.endsWith('outside the repository and not kept (turn-1.txt)'), `a deleted absolute path is not committed; got ${deletedRow}`);
  console.log('recorder edge cases: PASS (11 assertions)');
}

function runRunnerHandOff() {
  const { skillRoot, playbookRoot, reportsDir } = makeSkill('runner');
  // Real runner output always sits outside the repository, so the test keeps it outside the skill.
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'recorder-runner-out-')), 'runner-out');
  fs.mkdirSync(path.join(out, 'fake'), { recursive: true });
  fs.writeFileSync(path.join(out, 'scenario.json'), JSON.stringify({
    scenario_id: 'FX-001',
    scenario_path: path.join(playbookRoot, 'scenarios', 'clean-scenario.md'),
  }));
  fs.writeFileSync(path.join(out, 'fake', 'result.json'), JSON.stringify({
    runtime: 'fake',
    verdict: 'FAIL',
    blocker: null,
    turns: [{ id: '1', status: 'PASS' }, { id: '2', status: 'FAIL', reason: 'CHECK_FAILED' }],
  }));
  // A folder an earlier run left in the same --out is not one this run played.
  fs.mkdirSync(path.join(out, 'stale'));
  fs.writeFileSync(path.join(out, 'stale', 'result.json'), JSON.stringify({ runtime: 'stale', verdict: 'PASS', turns: [] }));
  const scenarioRecord = JSON.parse(fs.readFileSync(path.join(out, 'scenario.json'), 'utf8'));
  fs.writeFileSync(path.join(out, 'scenario.json'), JSON.stringify({ ...scenarioRecord, runtimes: ['fake'] }));
  const result = record(['--runner-out', out, '--label', 'manual-testing-playbook--conversation']);
  assert.strictEqual(result.status, 0, `the runner folder records without --playbook\n${result.stderr}`);
  const rows = fs.readFileSync(path.join(reportsDir, '2026-11-22--manual-testing-playbook--conversation', 'results.csv'), 'utf8').split('\n');
  assert(rows[2].startsWith('FX-001,fake,FAIL,turn 2: CHECK_FAILED,'), `the failed turn becomes the reason; got ${rows[2]}`);
  // Runner output lives outside the repository and is deleted, so a committed record must not name it.
  const runDir = path.join(reportsDir, '2026-11-22--manual-testing-playbook--conversation');
  for (const name of ['results.csv', 'README.md', 'source.md']) {
    const text = fs.readFileSync(path.join(runDir, name), 'utf8');
    assert(!text.includes(out), `${name} must not carry the runner's absolute path`);
  }
  assert(rows[2].endsWith('outside the repository and not kept (fake)'), `evidence names the runtime folder only; got ${rows[2]}`);
  assert.strictEqual(rows.filter((line) => line && !line.startsWith('#')).length, 2, 'only the played runtime is saved');

  fs.writeFileSync(path.join(out, 'fake', 'result.json'), '{bad');
  const broken = record(['--runner-out', out, '--label', 'manual-testing-playbook--broken']);
  assert.strictEqual(broken.status, 1, 'unreadable runner output is a refusal, not a crash');
  assert(broken.stderr.includes(path.join('fake', 'result.json')), `the refusal names the file; got ${broken.stderr}`);
  console.log('recorder runner hand-off: PASS (9 assertions)');
}

function runHubReports() {
  // A mode packet has no benchmark folder, so --reports names its hub's reports folder instead.
  const { skillRoot, playbookRoot, reportsDir: modeReports } = makeSkill('hub');
  const hubRoot = path.dirname(skillRoot);
  const hubReports = path.join(hubRoot, 'benchmark', 'reports');
  const csv = writeCsv(skillRoot, 'scenario_id,verdict,reason,evidence\nFX-001,PASS,,\n');
  const saved = record(['--playbook', playbookRoot, '--results', csv, '--reports', hubReports, '--label', 'manual-testing-playbook--hub']);
  assert.strictEqual(saved.status, 0, `a hub destination that contains the playbook is accepted\n${saved.stderr}`);
  assert(fs.existsSync(path.join(hubReports, '2026-11-22--manual-testing-playbook--hub', 'results.csv')), 'the run lands in the hub');
  assert(!fs.existsSync(modeReports), 'the mode gets no benchmark folder of its own');
  const index = fs.readFileSync(path.join(hubReports, 'README.md'), 'utf8');
  assert(index.includes(`# ${path.basename(hubRoot)} Benchmark Reports`), 'a new hub index carries the hub name, not the mode name');

  const notReports = record(['--playbook', playbookRoot, '--results', csv, '--reports', path.join(hubRoot, 'reports'), '--label', 'manual-testing-playbook--typo']);
  assert.strictEqual(notReports.status, 1, 'a destination that is not a benchmark/reports folder is refused');
  assert(notReports.stderr.includes('must end in benchmark/reports'), `the refusal says why; got ${notReports.stderr}`);

  const elsewhere = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'recorder-elsewhere-')), 'benchmark', 'reports');
  const outside = record(['--playbook', playbookRoot, '--results', csv, '--reports', elsewhere, '--label', 'manual-testing-playbook--outside']);
  assert.strictEqual(outside.status, 1, 'a reports folder whose skill does not contain the playbook is refused');
  assert(!fs.existsSync(elsewhere), 'the refused destination is not created');
  console.log('recorder hub reports: PASS (8 assertions)');
}

runHappyPath();
runRefusals();
runHubReports();
runRunnerHandOff();
runEdgeCases();
