'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(
  '.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-verify/lineages/xhigh-b',
);

function read(relativePath) {
  const filePath = path.join(root, relativePath);
  assert.equal(fs.existsSync(filePath), true, `missing ${relativePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert.notEqual(content.trim(), '', `empty ${relativePath}`);
  return content;
}

const config = JSON.parse(read('deep-review-config.json'));
const registry = JSON.parse(read('deep-review-findings-registry.json'));
const state = read('deep-review-state.jsonl')
  .trim()
  .split('\n')
  .map((line) => JSON.parse(line));
const strategy = read('deep-review-strategy.md');
const dashboard = read('deep-review-dashboard.md');
const report = read('review-report.md');
read('resource-map.md');

assert.equal(config.sessionId, 'fanout-xhigh-b-1783915428096-y929h9');
assert.equal(config.status, 'complete');
assert.equal(config.stopReason, 'maxIterationsReached');
assert.equal(config.maxIterations, 4);
assert.equal(config.stopPolicy, 'max-iterations');

const iterations = state.filter((record) => record.type === 'iteration');
assert.equal(iterations.length, 4);
assert.deepEqual(iterations.map((record) => record.iteration), [1, 2, 3, 4]);
assert.equal(state.filter((record) => record.event === 'claim_adjudication').length, 4);
assert.equal(state.filter((record) => record.event === 'synthesis_complete').length, 1);
assert.equal(state.at(-1).event, 'synthesis_complete');
assert.equal(state.at(-1).verdict, 'FAIL');

for (let iteration = 1; iteration <= 4; iteration += 1) {
  const padded = String(iteration).padStart(3, '0');
  read(`prompts/iteration-${padded}.md`);
  const narrative = read(`iterations/iteration-${padded}.md`);
  const verdictLines = narrative.match(/^Review verdict: (PASS|CONDITIONAL|FAIL)$/gm) || [];
  assert.equal(verdictLines.length, 1, `iteration ${iteration} verdict count`);
  assert.match(narrative.trimEnd().split('\n').at(-1), /^Review verdict: (PASS|CONDITIONAL|FAIL)$/);

  const delta = read(`deltas/iter-${padded}.jsonl`)
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line));
  const deltaIteration = delta.find((record) => record.type === 'iteration');
  assert.ok(deltaIteration, `iteration ${iteration} missing delta iteration record`);
  assert.deepEqual(deltaIteration, iterations[iteration - 1]);
}

assert.equal(registry.openFindingsCount, 5);
assert.deepEqual(registry.findingsBySeverity, { P0: 0, P1: 4, P2: 1 });
assert.deepEqual(registry.dimensionCoverage, {
  correctness: true,
  security: true,
  traceability: true,
  maintainability: true,
});
assert.deepEqual(registry.searchDebt, []);
assert.deepEqual(registry.corruptionWarnings, []);

for (const section of [
  'Executive Summary',
  'Planning Trigger',
  'Active Finding Registry',
  'Remediation Workstreams',
  'Spec Seed',
  'Plan Seed',
  'Traceability Status',
  'Deferred Items',
  'Audit Appendix',
]) {
  assert.match(report, new RegExp(`^## ${section}$`, 'm'), `missing report section ${section}`);
}
assert.doesNotMatch(report, /^## Resource Map Coverage Gate$/m);
assert.match(report, /^verdict: FAIL$/m);
assert.match(strategy, /- \[x\] correctness/);
assert.match(strategy, /- \[x\] security/);
assert.match(strategy, /- \[x\] traceability/);
assert.match(strategy, /- \[x\] maintainability/);
assert.match(strategy, /\| `spec_code` \| core \| fail \|/);
assert.match(strategy, /\| `checklist_evidence` \| core \| fail \|/);
assert.match(strategy, /Synthesis complete at `maxIterationsReached`/);
assert.match(dashboard, /- Status: COMPLETE/);
assert.match(dashboard, /- Provisional Verdict: CONDITIONAL/);

const targetStatus = execFileSync('git', [
  'status',
  '--short',
  '--',
  '.opencode/skills/sk-code/code-opencode',
  '.opencode/skills/sk-code/code-webflow',
  '.opencode/skills/sk-code/code-quality',
  '.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md',
  '.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md',
  '.opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md',
  '.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md',
  '.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md',
], { encoding: 'utf8' }).trim();
assert.equal(targetStatus, '', 'review target paths changed');

process.stdout.write(`${JSON.stringify({
  ok: true,
  sessionId: config.sessionId,
  iterations: iterations.length,
  findings: registry.findingsBySeverity,
  verdict: state.at(-1).verdict,
  stopReason: state.at(-1).stopReason,
  reportSections: 9,
  resourceMap: true,
  targetStatus: 'clean',
}, null, 2)}\n`);
