'use strict';
// Emit the workflow's recovery_started event for one stuck recovery.
// Usage: node recovery-start.cjs <iteration> <targetDimension>
const fs = require('node:fs');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const dir = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12';
const sid = 'fanout-merged-12-1794856957949-n58dw7';
const iteration = Number(process.argv[2]);
const targetDimension = process.argv[3];
const priorTailDigest = crypto.createHash('sha256').update(fs.readFileSync(`${dir}/deep-review-state.jsonl`)).digest('hex');
const event = {
  stem: 'deep_review.recovery_started',
  scope: {
    runId: sid,
    sessionId: sid,
    generation: 1,
    iterationId: `iteration-${iteration}`,
    dimensionId: targetDimension,
  },
  data: {
    normalizedStopReason: 'stuckRecovery',
    recoveryCause: 'repeated-no-progress',
    fromIterationId: `iteration-${iteration}`,
    strategy: 'change-granularity-and-escalate-severity',
    targetDimensionId: targetDimension,
    outcome: 'recovery-started',
    lineageRef: sid,
    priorTailDigest,
    originatingPauseEventId: 'none',
  },
};
const eventPath = `${dir}/.executor-state/recovery-${String(iteration).padStart(3, '0')}.json`;
fs.writeFileSync(eventPath, JSON.stringify(event));
const result = spawnSync(process.execPath, [
  '.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs',
  '--mode', 'review',
  '--run-directory', dir,
  '--event-json', eventPath,
], { encoding: 'utf8' });
process.stdout.write(`${JSON.stringify({ ok: result.status === 0, out: result.status === 0 ? 'ok' : (result.stdout || result.stderr || '').slice(0, 400) })}\n`);
if (result.status !== 0) process.exit(result.status ?? 1);
