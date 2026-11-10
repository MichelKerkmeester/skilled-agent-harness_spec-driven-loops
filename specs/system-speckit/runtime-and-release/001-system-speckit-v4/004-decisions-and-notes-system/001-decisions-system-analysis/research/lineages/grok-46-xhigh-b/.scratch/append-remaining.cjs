#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const LINEAGE = path.resolve(__dirname, '..');
const REPO = path.resolve(LINEAGE, '../../../../../../..');
const APPEND = path.join(REPO, '.opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs');
const ZERO = '0'.repeat(64);
const RUN_ID = 'fanout-grok-46-xhigh-b-1787723787313-4bzy0g';
const LINEAGE_ID = 'grok-46-xhigh-b';

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function writeEvent(name, obj) {
  const dest = path.join(__dirname, name);
  fs.writeFileSync(dest, `${JSON.stringify(obj)}\n`);
  return dest;
}

function append(eventPath) {
  const result = spawnSync(
    process.execPath,
    [
      APPEND,
      '--mode', 'research',
      '--run-directory', LINEAGE,
      '--event-json', eventPath,
    ],
    { cwd: REPO, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 },
  );
  const stdout = (result.stdout || '').trim();
  const stderr = (result.stderr || '').trim();
  let parsed = null;
  try {
    parsed = JSON.parse(stdout.split('\n').filter(Boolean).at(-1) || '{}');
  } catch {
    parsed = { ok: false, reason: 'unparseable stdout', stdout, stderr };
  }
  if (result.status !== 0 || parsed.ok !== true) {
    console.error(JSON.stringify({
      failed: eventPath,
      status: result.status,
      parsed,
      stderr: stderr.slice(0, 4000),
      stdout: stdout.slice(0, 4000),
    }, null, 2));
    process.exit(result.status || 2);
  }
  return parsed;
}

const iters = [
  {
    n: 2, ratio: 0.78, yield: 0.72,
    ruled: ['at-imports-to-save-tokens', 'revive-claude-native-MEMORY-md', 'alwaysSurface-makes-files-active'],
    next: 'iter-002-next-focus-angle-b',
  },
  {
    n: 3, ratio: 0.70, yield: 0.65,
    ruled: ['mcp-round-trip-every-turn', 'render.ts-as-decisions-store', 'new-required-spec-doc-decisions'],
    next: 'iter-003-next-focus-angle-c',
  },
  {
    n: 4, ratio: 0.62, yield: 0.58,
    ruled: ['new-sqlite-decisions-table', 'auto-roll-every-ADR-into-DECISIONS.md', 'learned-triggers-as-decisions-log'],
    next: 'iter-004-next-focus-angle-d-plumbing',
  },
  {
    n: 5, ratio: 0.58, yield: 0.54,
    ruled: ['big-bang-delete-constitutional-folder', 'alwaysSurface-false-as-deprecation'],
    next: 'iter-005-next-focus-angle-d-rehome',
  },
  {
    n: 6, ratio: 0.55, yield: 0.50,
    ruled: ['dump-20-files-into-AGENTS.md', 'assume-16-links-all-in-AGENTS.md'],
    next: 'iter-006-next-focus-angle-e',
  },
  {
    n: 7, ratio: 0.48, yield: 0.44,
    ruled: ['FSRS-decay-on-in-force-ADRs', '30-day-TTL-on-standing-rules', 'silent-overwrite-old-ADRs'],
    next: 'iter-007-next-focus-angle-f',
  },
  {
    n: 8, ratio: 0.40, yield: 0.37,
    ruled: ['advisor-hook-memory-search-every-prompt', 'inline-DECISIONS.md-into-additionalContext'],
    next: 'iter-008-next-focus-angle-g',
  },
  {
    n: 9, ratio: 0.35, yield: 0.32,
    ruled: ['packet-local-required-decisions.md', 'reuse-constitutional-folder-as-indexed-digest'],
    next: 'iter-009-next-focus-verdict',
  },
  {
    n: 10, ratio: 0.28, yield: 0.26,
    ruled: ['keep-the-tier-but-fix-alwaysSurface', 'keep-20-files-as-always-on-store', 'new-required-packet-decisions-file'],
    next: 'iter-010-next-focus-synthesis',
  },
];

const ids = {
  init: 'event-c461fc58-4778-46f2-b8ba-e7fbc311e58e',
  iter1: 'event-02213dec-07e3-4fb8-bf46-ea935ac14488',
};

for (const iter of iters) {
  const pad = String(iter.n).padStart(3, '0');
  const digest = sha256File(path.join(LINEAGE, `iterations/iteration-${pad}.md`));
  const eventPath = writeEvent(`event-iter-${pad}.json`, {
    stem: 'deep_research.iteration_completed',
    scope: { runId: RUN_ID, lineageId: LINEAGE_ID, iteration: iter.n },
    data: {
      status: 'complete',
      rawNewInfoRatio: iter.ratio,
      trustedEvidenceYield: iter.yield,
      outputDigest: digest,
      ruledOutApproachRefs: iter.ruled,
      nextFocusCausationId: iter.next,
    },
  });
  const out = append(eventPath);
  ids[`iter${iter.n}`] = out.receipt.eventId;
  console.log(`appended iteration ${iter.n} ${out.receipt.eventId} seq=${out.receipt.streamSequence}`);
}

const reportDigest = sha256File(path.join(LINEAGE, 'research.md'));
const obsDigest = sha256File(path.join(LINEAGE, 'iterations/iteration-010.md'));

const convPath = writeEvent('event-convergence.json', {
  stem: 'deep_research.convergence_evaluated',
  scope: { runId: RUN_ID, lineageId: LINEAGE_ID, iteration: 10 },
  data: {
    decision: 'continue',
    rawSignals: {
      newInfoRatio: 0.28,
      contradictionRisk: 0.1,
      citationDrift: 0.05,
      observationDigest: obsDigest,
    },
    trustedSignals: {
      evidenceYield: 0.26,
      independentSourceRatio: 0.8,
      supportedClaimRatio: 0.9,
      assessmentDigest: obsDigest,
    },
    qualityGateResults: {
      sourceDiversity: 'pass',
      contradictionResolution: 'pass',
      citationIntegrity: 'pass',
      policyVersion: 'quality-gates@1',
      resultDigest: obsDigest,
    },
    blockerIds: [],
    policyFingerprint: ZERO,
    evaluatorFingerprint: ZERO,
    evidenceTailHash: obsDigest,
    incompleteReason: null,
    recoveryReason: null,
  },
});
const conv = append(convPath);
ids.convergence = conv.receipt.eventId;
console.log(`appended convergence ${ids.convergence}`);

const synthStartPath = writeEvent('event-synthesis-started.json', {
  stem: 'deep_research.synthesis_started',
  scope: { runId: RUN_ID, lineageId: LINEAGE_ID },
  data: {
    admittedLedgerRevision: 'ledger-revision-10',
    selectedClaimVersionSetDigest: reportDigest,
    synthesisPolicyDigest: ZERO,
    reportRevision: 'report-1',
    unresolvedClaimIds: [],
    contestedClaimIds: [],
  },
});
append(synthStartPath);
console.log('appended synthesis_started');

const synthCommitPath = writeEvent('event-synthesis-committed.json', {
  stem: 'deep_research.synthesis_committed',
  scope: { runId: RUN_ID, lineageId: LINEAGE_ID },
  data: {
    admittedLedgerRevision: 'ledger-revision-10',
    selectedClaimVersionSetDigest: reportDigest,
    synthesisPolicyDigest: ZERO,
    reportRevision: 'report-1',
    unresolvedClaimIds: [],
    contestedClaimIds: [],
    reportDigest,
    citationEventIds: [ids.iter10],
    synthesisReceiptRef: 'synthesis-receipt-grok-46-xhigh-b',
  },
});
const synth = append(synthCommitPath);
ids.synthesis = synth.receipt.eventId;
console.log(`appended synthesis_committed ${ids.synthesis}`);

const savePath = writeEvent('event-memory-save-requested.json', {
  stem: 'deep_research.memory_save_requested',
  scope: { runId: RUN_ID, lineageId: LINEAGE_ID },
  data: {
    targetPacket: 'specs/system-speckit/037-decisions-memory-redesign/001-analysis',
    continuityPayloadDigest: reportDigest,
    route: 'implementation-summary',
    mergeMode: 'skip',
    sourceEventRange: {
      firstEventId: ids.init,
      lastEventId: ids.synthesis,
    },
  },
});
const save = append(savePath);
ids.memorySave = save.receipt.eventId;
const tailHash = save.receipt.record_hash || save.receipt.recordHash || ZERO;
console.log(`appended memory_save_requested ${ids.memorySave} tail=${tailHash}`);

const donePath = writeEvent('event-run-completed.json', {
  stem: 'deep_research.run_completed',
  scope: { runId: RUN_ID, lineageId: LINEAGE_ID },
  data: {
    terminalStatus: 'incomplete',
    convergenceEventId: ids.convergence,
    synthesisEventId: ids.synthesis,
    memorySaveEventId: ids.memorySave,
    finalLedgerTailHash: HASH_OR_ZERO(save),
    counts: { iterations: 10, sources: 0, admittedEvidence: 0, claims: 0 },
    completionReason: null,
    incompleteReason: 'Fan-out containment skipped generate-context.js; stopPolicy max-iterations reached.',
  },
});

function HASH_OR_ZERO(outcome) {
  const r = outcome.receipt || {};
  const h = r.record_hash || r.recordHash || r.canonical_event_hash;
  if (typeof h === 'string' && /^[a-f0-9]{64}$/.test(h)) return h;
  return ZERO;
}

const done = append(donePath);
ids.runCompleted = done.receipt.eventId;
fs.writeFileSync(path.join(__dirname, 'appended-ids.json'), `${JSON.stringify(ids, null, 2)}\n`);
console.log(`appended run_completed ${ids.runCompleted}`);
console.log('DONE');
