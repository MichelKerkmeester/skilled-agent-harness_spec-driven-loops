// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: behavior-bench-run marker validation and stderr prefix         ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin that a scenario with an invalid /regex/ marker is refused    ║
// ║          as a contract error before any leg runs, instead of scoring the  ║
// ║          marker as a silent miss, and that diagnostics carry the          ║
// ║          bracketed [behavior-bench-run] prefix.                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const RUNNER = path.join(__dirname, '..', 'behavior-bench-run.cjs');
const FAKE_LEG = path.join(__dirname, 'fixtures', 'fake-leg.js');
const SMOKE_SCENARIO = path.join(__dirname, 'fixtures', 'SMOKE-000-fake.md');
const EXIT_CONTRACT = 2;

function loadSmokeContract() {
  const md = fs.readFileSync(SMOKE_SCENARIO, 'utf8');
  return JSON.parse(md.match(/```json\s*([\s\S]*?)```/)[1]);
}

function setup(t, mutate) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'behavior-bench-markers-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const fixtureDir = path.join(root, 'fixture');
  fs.mkdirSync(fixtureDir, { recursive: true });
  const contract = loadSmokeContract();
  contract.fixture = fixtureDir;
  mutate(contract);
  const scenarioPath = path.join(root, contract.id + '.md');
  fs.writeFileSync(scenarioPath, '# ' + contract.id + '\n\n```json\n' + JSON.stringify(contract, null, 2) + '\n```\n');
  return { root, fixtureDir, outDir: path.join(root, 'out'), scenarioPath, contract };
}

function runBench(ctx, extraArgs = []) {
  return spawnSync(process.execPath, [
    RUNNER, '--scenario', ctx.scenarioPath, '--leg', 'smoke', '--out-dir', ctx.outDir,
    '--repo-root', ctx.root, '--watchdog-ms', '60000', ...extraArgs,
  ], {
    env: {
      ...process.env,
      BEHAVIOR_BENCH_SPAWN_JSON: JSON.stringify([process.execPath, FAKE_LEG]),
      FAKE_LEG_FIXTURE: ctx.fixtureDir,
    },
    encoding: 'utf8',
    timeout: 30000,
  });
}

test('an invalid presentation regex marker is a contract error, not a silent miss', (t) => {
  const ctx = setup(t, (contract) => {
    contract.expected_presentation_markers = ['BENCH-SMOKE-MARKER', '/BENCH-(SMOKE/'];
  });
  const result = runBench(ctx);
  assert.equal(result.status, EXIT_CONTRACT, 'stderr: ' + result.stderr);
  assert.match(result.stderr, /^\[behavior-bench-run\] invalid regex marker/m);
  assert.ok(result.stderr.includes('/BENCH-(SMOKE/'), 'the diagnostic names the bad marker');
  assert.equal(fs.existsSync(path.join(ctx.outDir, ctx.contract.id + '-smoke.result.json')), false);
});

test('an invalid regex flag in a delegation target is refused under --samples too', (t) => {
  const ctx = setup(t, (contract) => {
    contract.expected_delegation.forbidden_targets = ['/deep-review/z'];
  });
  const result = runBench(ctx, ['--samples', '2']);
  assert.equal(result.status, EXIT_CONTRACT, 'stderr: ' + result.stderr);
  assert.match(result.stderr, /invalid regex marker in expected_delegation\.forbidden_targets/);
});

test('a valid regex marker still scores the run', (t) => {
  const ctx = setup(t, (contract) => {
    contract.expected_presentation_markers = ['/bench-smoke-marker/'];
  });
  const result = runBench(ctx);
  assert.equal(result.status, 0, 'stderr: ' + result.stderr);
  const scored = JSON.parse(fs.readFileSync(path.join(ctx.outDir, ctx.contract.id + '-smoke.result.json'), 'utf8'));
  assert.equal(scored.dimensions.d2, 2, 'the regex marker matched the fake leg output');
});

test('a usage error carries the bracketed component prefix', () => {
  const result = spawnSync(process.execPath, [RUNNER, '--bogus-flag'], { encoding: 'utf8', timeout: 30000 });
  assert.equal(result.status, EXIT_CONTRACT);
  assert.match(result.stderr, /^\[behavior-bench-run\] unknown flag: --bogus-flag$/m);
});
