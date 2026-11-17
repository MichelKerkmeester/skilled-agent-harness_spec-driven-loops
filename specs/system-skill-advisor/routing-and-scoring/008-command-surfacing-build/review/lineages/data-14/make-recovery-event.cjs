#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const base = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-14';
const sessionId = 'fanout-data-14-1794868189353-tsxtos';
const stateBytes = fs.readFileSync(path.join(base, 'deep-review-state.jsonl'));
const event = {
  stem: 'deep_review.recovery_started',
  scope: { runId: sessionId, sessionId, generation: 1, iterationId: 'iteration-4', dimensionId: 'correctness' },
  data: {
    normalizedStopReason: 'stuckRecovery',
    recoveryCause: 'stuckThresholdReached',
    fromIterationId: 'iteration-4',
    strategy: 'changed-granularity:per-signal-ordinary-sense-sweep',
    targetDimensionId: 'correctness',
    outcome: 'recovery-started',
    lineageRef: 'lineage:data-14-recovery-1',
    priorTailDigest: crypto.createHash('sha256').update(stateBytes).digest('hex'),
    originatingPauseEventId: 'stuck-decision-i004',
  },
};
fs.writeFileSync(path.join(base, 'iter-004.recovery-event.json'), JSON.stringify(event) + '\n');
console.log('recovery event written');
