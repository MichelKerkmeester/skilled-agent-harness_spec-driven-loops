// ───────────────────────────────────────────────────────────────────
// MODULE: Classifier Score Model Variant
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

// The cascade grader reuses the agreement run's question, rerun count and state
// builder, so a benchmark D4 score is measured with the exact prompt that run
// measured, and the transport wrapper so both routes share one CLI call shape.
const { spawnClassifierCall } = require('../../../../../cli-classifier/shared/scripts/jev-transport.mjs');
const { QUESTION, JEV_RERUNS, buildState } = require('./score-d4-agreement.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function jevUnmeasured(error) {
  return {
    score: null,
    confidence: null,
    parse_status: 'unmeasured',
    measured: false,
    dim_id: 'D4',
    error,
    evidence: [],
  };
}

function noulFromCliCall(call) {
  if (!call || call.timedOut || call.code !== 0) return null;
  let parsed;
  try {
    parsed = JSON.parse(call.stdout);
  } catch {
    return null;
  }
  const value = parsed?.answers?.answer?.noul;
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. JEV GRADER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The cascade D4 grader. A row the deterministic hallucination check already
 * clears costs no call; every other row is voted by rerunning the agreement
 * run's noul question JEV_RERUNS times through the same transport wrapper the
 * agreement arm uses. A call that exits 4 is the CLI's retryable failure, so it
 * is retried once after the agreement arm's backoff. One missing, malformed or
 * out-of-range answer leaves the row unmeasured instead of guessing, and the
 * vote mirrors the agreement column: two or more yes answers flag, any other
 * split clears.
 *
 * @param {{ jev?: { path?: string, provider?: string }, env?: Record<string, string | undefined>, backoffMs?: number }} graderOptions Jev client/provider resolved by the caller plus the environment the calls read and the retry wait
 * @returns {Function} Async grader function (virtualFixture, outputText, opts)
 */
function buildJevGrader(graderOptions) {
  const jev = graderOptions.jev || {};
  const env = graderOptions.env || process.env;
  // Matches the agreement arm's default so a retry waits the same time on both routes.
  const backoffMs = graderOptions.backoffMs ?? 2000;
  const args = ['noul', '--provider', jev.provider || 'official', '-q', QUESTION];
  return async (virtualFixture, outputText, opts = {}) => {
    const check = opts.hallucinationCheck;
    if (check && Number.isFinite(check.score) && check.score >= 1) {
      return {
        score: 1.0,
        confidence: 1.0,
        parse_status: 'cascade-clear',
        dim_id: 'D4',
        rationale: 'deterministic check flagged nothing',
        evidence: [],
      };
    }
    if (typeof jev.path !== 'string' || jev.path.length === 0) return jevUnmeasured('jev grader has no client path');

    const stdin = buildState(virtualFixture, outputText);
    const callOptions = {
      file: jev.path,
      args,
      stdin,
      env,
      // A transport notice goes to stderr so it never mixes into the runner's JSON on stdout.
      report: (line) => process.stderr.write(`${line}\n`),
    };
    const answers = [];
    for (let rerun = 1; rerun <= JEV_RERUNS; rerun += 1) {
      let call;
      try {
        call = await spawnClassifierCall(callOptions);
      } catch (error) {
        return jevUnmeasured(`jev noul call ${rerun} failed: ${error.message}`);
      }
      // Exit 4 is a retryable CLI failure; a timed-out call already spent its
      // budget, so only the untimed exit is retried.
      if (!call.timedOut && call.code === 4) {
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        try {
          call = await spawnClassifierCall(callOptions);
        } catch (error) {
          return jevUnmeasured(`jev noul call ${rerun} failed: ${error.message}`);
        }
      }
      const value = noulFromCliCall(call);
      if (value === null) return jevUnmeasured(`jev noul call ${rerun} returned no usable answer`);
      answers.push(value);
    }

    const yesVotes = answers.filter((value) => value >= 0.5).length;
    const flagged = yesVotes >= 2;
    const agreeing = flagged ? yesVotes : JEV_RERUNS - yesVotes;
    return {
      score: flagged ? 0.0 : 1.0,
      confidence: agreeing / JEV_RERUNS,
      parse_status: 'jev',
      dim_id: 'D4',
      evidence: answers,
    };
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  jevUnmeasured,
  buildJevGrader,
};
