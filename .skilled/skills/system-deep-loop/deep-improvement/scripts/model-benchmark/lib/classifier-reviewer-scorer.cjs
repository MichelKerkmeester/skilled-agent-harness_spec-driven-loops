// ───────────────────────────────────────────────────────────────────
// MODULE: Classifier Reviewer Scorer
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');

const { featureReady, featureSwitch } = require('../../../../../cli-classifier/shared/scripts/jev-features.mjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const VERDICTS = new Set(['pass', 'fail', 'block', 'abstain']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function normalizeVerdict(value) {
  const verdict = String(value || '').trim().toLowerCase();
  return VERDICTS.has(verdict) ? verdict : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. JEV GRADER
// ─────────────────────────────────────────────────────────────────────────────

function classifyVerdictWithJev(output, opts) {
  let value = null;
  if (typeof opts.jevChoice === 'function') {
    value = opts.jevChoice(String(output || ''), opts);
  } else {
    // score-verdict-fallback requires this file at load, so the measured
    // question is pulled in lazily rather than at module load.
    const { QUESTION, OPTION_PAIRS } = require('./score-verdict-fallback.cjs');
    const provider = opts.provider || process.env.JEV_PROVIDER || 'official';
    const argv = ['choice', '--provider', provider, '-q', QUESTION];
    for (const [key, description] of OPTION_PAIRS) argv.push('-o', key + '=' + description);
    const result = spawnSync(opts.jevPath || 'jev', argv, {
      input: String(output || ''),
      encoding: 'utf8',
      timeout: opts.timeout_ms || 90000,
      env: opts.env || process.env,
    });
    if (!result.error && result.status === 0) {
      let parsed;
      try {
        parsed = JSON.parse(result.stdout);
      } catch {
        // A body that does not parse leaves the choice unresolved.
      }
      const choice = parsed?.answers?.answer?.choice;
      // Only an offered option key is a verdict; a case variant or near-miss
      // would otherwise be lowered into a verdict the question never asked for.
      if (typeof choice === 'string' && OPTION_PAIRS.some(([key]) => key === choice)) value = choice;
    }
  }
  return { verdict: normalizeVerdict(value), method: 'jev-grader' };
}

function resolveReviewerGrader(graderRequested, env) {
  // Auto asks Jev only when the feature gate and a stored credential allow it,
  // and otherwise keeps the no-op baseline an unconfigured machine already had.
  const gate = graderRequested === 'auto' ? featureReady('verdict-fallback', env) : null;
  // An explicit request is still a Jev path, so the off switches outrank it;
  // unlike auto it needs no credential probe, which keeps an injected choice usable.
  if (graderRequested === 'jev') {
    const switchState = featureSwitch('verdict-fallback', env);
    if (!switchState.enabled) throw new Error(`reviewer-scorer: jev grader is switched off (${switchState.reason})`);
  }
  const grader = graderRequested === 'auto' ? (gate.ready ? 'jev' : 'noop') : graderRequested;
  const graderReason = gate === null ? 'explicit' : gate.reason;
  return { grader, graderReason, gate };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  normalizeVerdict,
  classifyVerdictWithJev,
  resolveReviewerGrader,
};
