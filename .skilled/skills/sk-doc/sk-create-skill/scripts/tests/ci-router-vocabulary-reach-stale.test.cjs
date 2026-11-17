#!/usr/bin/env node
'use strict';

/**
 * Proves the router reach check never reads a stale advisor as an answer, and
 * reads a stage-one-only hub's phrases from hub-router.json. A stand-in advisor
 * answers "stale" for its first answers, the way a reindexing daemon does, then
 * "live". A wait that outlasts the reindex judges every phrase; a reindex that
 * outlasts the wait reports each phrase as stale and fails the run.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const CHECK = path.resolve(__dirname, '..', 'ci-router-vocabulary-reach.cjs');

// Counts its own calls in a file and answers stale until the count passes the
// scenario's threshold.
const FAKE_ADVISOR = `'use strict';
const fs = require('fs');
const counter = process.env.REACH_TEST_COUNTER;
const calls = (fs.existsSync(counter) ? Number(fs.readFileSync(counter, 'utf8')) : 0) + 1;
fs.writeFileSync(counter, String(calls));
const stale = calls <= Number(process.env.REACH_TEST_STALE_CALLS);
process.stdout.write(JSON.stringify({
  data: {
    trustState: { state: stale ? 'stale' : 'live', generation: 9 },
    effectiveThresholds: { confidenceThreshold: 0.8 },
    recommendations: [{ skillId: process.env.REACH_TEST_SKILL, confidence: 0.9 }],
  },
}));
`;

function makeSkill(t, routerBlock, hubRouter) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reach-stale-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const skill = path.join(dir, 'fixture-hub');
  fs.mkdirSync(skill);
  fs.writeFileSync(path.join(skill, 'ROUTER.md'), `# Router\n\n\`\`\`python\nINTENT_SIGNALS = {${routerBlock}}\n\`\`\`\n`);
  if (hubRouter) fs.writeFileSync(path.join(skill, 'hub-router.json'), JSON.stringify(hubRouter));
  fs.writeFileSync(path.join(dir, 'advisor.cjs'), FAKE_ADVISOR);
  return { dir, skill };
}

function run({ dir, skill }, staleCalls, waitMs, extra = []) {
  const env = {
    ...process.env,
    ROUTER_REACH_ADVISOR: path.join(dir, 'advisor.cjs'),
    REACH_TEST_COUNTER: path.join(dir, 'calls'),
    REACH_TEST_STALE_CALLS: String(staleCalls),
    REACH_TEST_SKILL: 'fixture-hub',
    ROUTER_REACH_STALE_WAIT_MS: String(waitMs),
    ROUTER_REACH_STALE_POLL_MS: '50',
  };
  delete env.CI;
  return spawnSync(process.execPath, [CHECK, '--skill', skill, '--concurrency', '1', ...extra],
    { encoding: 'utf8', env, timeout: 60000 });
}

const TWO_PHRASES = '\n    "ALPHA": {"weight": 4, "keywords": ["alpha phrase", "beta phrase"]},\n';

test('a probe that meets a reindexing advisor waits and is judged once it is live', (t) => {
  const result = run(makeSkill(t, TWO_PHRASES), 3, 10000);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /stale=0,/);
  assert.match(result.stdout, /^RESULT: PASSED$/m);
});

test('an advisor still stale at the deadline fails the run and is never a pass', (t) => {
  const result = run(makeSkill(t, TWO_PHRASES), 1000, 300);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /stale=2,/);
  assert.match(result.stdout, /^ {7}stale {6}alpha phrase/m);
  assert.match(result.stdout, /^advisor stale: 2 phrase\(s\) were not judged/m);
  assert.match(result.stdout, /^RESULT: FAILED$/m);

  const json = run(makeSkill(t, TWO_PHRASES), 1000, 300, ['--json']);
  assert.equal(json.status, 1);
  assert.deepEqual(JSON.parse(json.stdout)[0].unreachable.map((u) => u.kind), ['stale', 'stale']);
});

test('a stage-one-only hub is probed with the phrases of its hub-router.json', (t) => {
  const fixture = makeSkill(t, '', {
    vocabularyClasses: { aliases: { keywords: ['gamma phrase', 'solo'] } },
  });
  const result = run(fixture, 0, 1000, ['--json']);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(JSON.parse(result.stdout)[0].declared, 1);
});
