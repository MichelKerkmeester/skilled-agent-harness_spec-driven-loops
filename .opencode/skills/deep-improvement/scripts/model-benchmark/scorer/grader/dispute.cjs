#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ dispute.cjs — D4 grader confidence-threshold dual-grader escalation       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
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

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const harness = require('./harness.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONFIDENCE_THRESHOLD = parseFloat(process.env.GRADER_CONFIDENCE_THRESHOLD || '0.7');
const DISPUTE_RATE_THRESHOLD = parseFloat(process.env.GRADER_DISPUTE_RATE_THRESHOLD || '0.15');
const DISPUTE_DELTA_THRESHOLD = parseFloat(process.env.GRADER_DISPUTE_DELTA || '0.15');
const RECENT_ITERS_WINDOW = parseInt(process.env.GRADER_RECENT_ITERS || '3', 10);

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decide whether to escalate D4 grading to a dual-grader adversarial second call.
 *
 * @param {Object} opts - Escalation inputs.
 * @param {Object} [opts.last_grader_result] - Most recent grader result (checked for low confidence).
 * @param {string} [opts.state_jsonl_path] - Path to the loop state JSONL (checked for recent dispute rate).
 * @returns {{escalate: boolean, reason?: string, confidence?: number, rate?: number, disputes?: number, total?: number}} Escalation decision.
 */
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

/**
 * Dispatch the adversarial grader (skeptic system prompt) for a second D4 call.
 *
 * @param {Object} opts - Grader options forwarded to harness.gradeD4.
 * @returns {Promise<Object>} Adversarial grader result.
 */
async function adversarialSecondCall(opts) {
  // Dispatches the adversarial grader (system-skeptic.md as system prompt).
  // Pass the skeptic prompt path via harness DI (`system_prompt_path`) instead
  // of globally monkey-patching fs.readFileSync — the old swap was not
  // concurrency-safe and broke testability.
  const skepticPromptPath = path.join(__dirname, 'prompts', 'system-skeptic.md');
  return harness.gradeD4({
    ...opts,
    system_prompt_path: skepticPromptPath,
    // Cache key bump to differentiate adversarial call from primary
    rubric_version: (opts.rubric_version || 'v1.0.0') + '-adversarial',
  });
}

/**
 * Run the primary D4 grader and, when escalation triggers, the adversarial second call.
 *
 * @param {Object} opts - Grader options forwarded to harness.gradeD4.
 * @returns {Promise<Object>} Single- or dual-mode result with median + dispute flag when escalated.
 */
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

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  shouldEscalateToDualGrader,
  adversarialSecondCall,
  dualGraderInvocation,
  CONFIDENCE_THRESHOLD,
  DISPUTE_RATE_THRESHOLD,
  DISPUTE_DELTA_THRESHOLD,
};
