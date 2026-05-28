#!/usr/bin/env node
'use strict';

/**
 * grader/dispute.cjs
 *
 * Confidence-threshold recovery hook for D4 grader. Decides when to escalate
 * to a dual-grader adversarial second call, computes dispute metrics, returns
 * median + dispute flag.
 *
 * Triggers (any of):
 *   - Last grader call had confidence < 0.7
 *   - D4 dispute rate across last 3 iterations > 0.15 (i.e., >= 15% of D4 calls flagged dispute)
 *
 * Adversarial second call uses grader/prompts/system-skeptic.md as the system prompt.
 *
 * Operator constraint: still claude-only. Dispute resolver is ANOTHER claude-sonnet
 * call with adversarial framing, NOT a different CLI/model.
 */

const fs = require('fs');
const path = require('path');

const harness = require('./harness.cjs');

const CONFIDENCE_THRESHOLD = parseFloat(process.env.GRADER_CONFIDENCE_THRESHOLD || '0.7');
const DISPUTE_RATE_THRESHOLD = parseFloat(process.env.GRADER_DISPUTE_RATE_THRESHOLD || '0.15');
const DISPUTE_DELTA_THRESHOLD = parseFloat(process.env.GRADER_DISPUTE_DELTA || '0.15');
const RECENT_ITERS_WINDOW = parseInt(process.env.GRADER_RECENT_ITERS || '3', 10);

function shouldEscalateToDualGrader(opts) {
  const { last_grader_result, state_jsonl_path } = opts;

  // Trigger 1: last call low confidence
  if (last_grader_result && typeof last_grader_result.confidence === 'number') {
    if (last_grader_result.confidence < CONFIDENCE_THRESHOLD) {
      return { escalate: true, reason: 'low_confidence', confidence: last_grader_result.confidence };
    }
  }

  // Trigger 2: dispute rate across recent iters
  if (state_jsonl_path && fs.existsSync(state_jsonl_path)) {
    const raw = fs.readFileSync(state_jsonl_path, 'utf8');
    const rows = raw.split('\n').filter((l) => l.trim()).map((l) => {
      try { return JSON.parse(l); } catch (_) { return null; }
    }).filter(Boolean);
    const recent = rows.filter((r) => r.type === 'iteration').slice(-RECENT_ITERS_WINDOW);
    const d4Total = recent.length;
    const disputes = recent.filter((r) =>
      r.fixtureResults && r.fixtureResults.some((fr) =>
        fr.grader && fr.grader.dispute === true
      )
    ).length;
    const rate = d4Total > 0 ? disputes / d4Total : 0;
    if (rate > DISPUTE_RATE_THRESHOLD) {
      return { escalate: true, reason: 'dispute_rate', rate, disputes, total: d4Total };
    }
  }

  return { escalate: false };
}

async function adversarialSecondCall(opts) {
  // Dispatches the adversarial grader (system-skeptic.md as system prompt).
  // We reuse harness.gradeD4 with a marker; the system prompt swap happens
  // here by overriding the path read.
  const skepticPromptPath = path.join(__dirname, 'prompts', 'system-skeptic.md');
  // Monkey-patch: temporarily swap the system prompt file used by harness
  // (cleaner alternative: harness should accept systemPromptPath arg; future cleanup)
  const originalReadFileSync = fs.readFileSync;
  fs.readFileSync = function patched(filePath, ...rest) {
    if (filePath.endsWith('system-grader.md')) {
      return originalReadFileSync.call(fs, skepticPromptPath, ...rest);
    }
    return originalReadFileSync.call(fs, filePath, ...rest);
  };
  try {
    const result = await harness.gradeD4({
      ...opts,
      // Cache key bump to differentiate adversarial call from primary
      rubric_version: (opts.rubric_version || 'v1.0.0') + '-adversarial',
    });
    return result;
  } finally {
    fs.readFileSync = originalReadFileSync;
  }
}

async function dualGraderInvocation(opts) {
  const primary = await harness.gradeD4(opts);
  const escalate = shouldEscalateToDualGrader({ last_grader_result: primary, ...opts });
  if (!escalate.escalate) {
    return { mode: 'single', primary, escalated: false };
  }
  const adversarial = await adversarialSecondCall(opts);
  const delta = Math.abs(primary.score - adversarial.score);
  const median = (primary.score + adversarial.score) / 2;
  const dispute = delta > DISPUTE_DELTA_THRESHOLD;
  return {
    mode: 'dual',
    escalated: true,
    escalation_reason: escalate.reason,
    primary,
    adversarial,
    score_median: median,
    score_delta: delta,
    dispute,
  };
}

module.exports = {
  shouldEscalateToDualGrader,
  adversarialSecondCall,
  dualGraderInvocation,
  CONFIDENCE_THRESHOLD,
  DISPUTE_RATE_THRESHOLD,
  DISPUTE_DELTA_THRESHOLD,
};
