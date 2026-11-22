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

function writeCsv(dir, body) {
  const file = path.join(dir, 'verdicts.csv');
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
  const again = record(['--playbook', playbookRoot, '--results', good, '--label', 'manual-testing-playbook--again']);
  assert.strictEqual(again.status, 1, 'an existing run folder is never overwritten');

  const usage = record(['--playbook', playbookRoot, '--results', good]);
  assert.strictEqual(usage.status, 2, 'a missing label is a usage error');
  console.log('recorder refusals: PASS (7 assertions)');
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
  console.log('recorder runner hand-off: PASS (6 assertions)');
}

runHappyPath();
runRefusals();
runRunnerHandOff();
