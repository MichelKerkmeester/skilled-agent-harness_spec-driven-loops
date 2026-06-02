// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ profile-validator — additive, dependency-free sweep-profile validator      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * Dependency-free, additive profile validator for the config-driven benchmark
 * framework. It validates ONLY the new sweep keys, and ONLY when they are
 * present. A legacy profile with no `mode` is reported valid and untouched, so
 * the existing Lane B benchmark path keeps working byte-for-byte. The validator
 * never throws on shape problems — it collects them into an errors array so a
 * caller can surface all issues at once.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Supported sweep modes. `mode` is a thin selector; the runner stays
// mode-agnostic, so this list is the only place a new mode is gated.
const KNOWN_MODES = new Set([
  'framework-bakeoff',
  'model-vs-model',
  'reasoning-ablation',
  'prompt-vs-prompt',
  'regression',
  'capability-profile',
]);

// Executor ids mirror the universal dispatcher's KNOWN_EXECUTORS. Kept in sync
// by hand because the validator is dependency-free and must not require the
// dispatcher (which pulls in child_process / config loading) just to validate.
const KNOWN_EXECUTORS = new Set([
  'native',
  'cli-opencode',
  'cli-claude-code',
  'cli-codex',
  'cli-gemini',
  'cli-devin',
]);

const KNOWN_SCORERS = new Set(['pattern', '5dim']);

// Weights that must sum to a probability mass are compared with a small
// tolerance so floating-point representation of clean fractions (0.3 + 0.7)
// does not spuriously fail.
const WEIGHT_SUM_TOLERANCE = 0.001;

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isPositiveInteger(v) {
  return typeof v === 'number' && Number.isInteger(v) && v > 0;
}

function isFiniteNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate a profile object. Checks are additive: an absent key is never an
 * error; a present key is validated against its contract.
 *
 * @param {Object} profile - The profile object to validate.
 * @returns {{ valid: boolean, errors: string[] }} Validity flag and a list of
 *   human-readable error strings (empty when valid).
 */
function validateProfile(profile) {
  const errors = [];

  if (!isPlainObject(profile)) {
    return { valid: false, errors: ['profile must be a JSON object'] };
  }

  // Legacy profile: no sweep semantics declared. Leave it entirely alone.
  if (profile.mode === undefined) {
    return { valid: true, errors: [] };
  }

  // mode enum
  if (typeof profile.mode !== 'string' || !KNOWN_MODES.has(profile.mode)) {
    errors.push(
      'mode "' +
        String(profile.mode) +
        '" is not one of: ' +
        [...KNOWN_MODES].join(', '),
    );
  }

  // models[].executor enum (only when models is present and an array)
  if (profile.models !== undefined) {
    if (!Array.isArray(profile.models)) {
      errors.push('models must be an array when present');
    } else {
      profile.models.forEach((m, i) => {
        if (!isPlainObject(m)) {
          errors.push('models[' + i + '] must be an object');
          return;
        }
        if (m.executor !== undefined && !KNOWN_EXECUTORS.has(m.executor)) {
          errors.push(
            'models[' +
              i +
              '].executor "' +
              String(m.executor) +
              '" is not one of: ' +
              [...KNOWN_EXECUTORS].join(', '),
          );
        }
      });
    }
  }

  // scoring block (all sub-checks additive)
  if (profile.scoring !== undefined) {
    if (!isPlainObject(profile.scoring)) {
      errors.push('scoring must be an object when present');
    } else {
      const scoring = profile.scoring;

      // scoring.scorer enum
      if (scoring.scorer !== undefined && !KNOWN_SCORERS.has(scoring.scorer)) {
        errors.push(
          'scoring.scorer "' +
            String(scoring.scorer) +
            '" is not one of: ' +
            [...KNOWN_SCORERS].join(', '),
        );
      }

      // scoring.dimensions[] weights sum to 1.0 within tolerance
      if (scoring.dimensions !== undefined) {
        if (!Array.isArray(scoring.dimensions)) {
          errors.push('scoring.dimensions must be an array when present');
        } else if (scoring.dimensions.length > 0) {
          let sum = 0;
          let badWeight = false;
          for (const d of scoring.dimensions) {
            if (!isPlainObject(d) || !isFiniteNumber(d.weight)) {
              badWeight = true;
              break;
            }
            sum += d.weight;
          }
          if (badWeight) {
            errors.push(
              'scoring.dimensions[] each require a numeric `weight`',
            );
          } else if (Math.abs(sum - 1.0) > WEIGHT_SUM_TOLERANCE) {
            errors.push(
              'scoring.dimensions[] weights must sum to 1.0 (±' +
                WEIGHT_SUM_TOLERANCE +
                '); got ' +
                sum,
            );
          }
        }
      }

      // scoring.correctnessGate.threshold ∈ [0,1]
      if (scoring.correctnessGate !== undefined) {
        if (!isPlainObject(scoring.correctnessGate)) {
          errors.push('scoring.correctnessGate must be an object when present');
        } else if (scoring.correctnessGate.threshold !== undefined) {
          const t = scoring.correctnessGate.threshold;
          if (!isFiniteNumber(t) || t < 0 || t > 1) {
            errors.push(
              'scoring.correctnessGate.threshold must be in [0,1]; got ' +
                String(t),
            );
          }
        }
      }
    }
  }

  // sampling.samplesPerCell positive integer
  if (profile.sampling !== undefined) {
    if (!isPlainObject(profile.sampling)) {
      errors.push('sampling must be an object when present');
    } else if (profile.sampling.samplesPerCell !== undefined) {
      if (!isPositiveInteger(profile.sampling.samplesPerCell)) {
        errors.push(
          'sampling.samplesPerCell must be a positive integer; got ' +
            String(profile.sampling.samplesPerCell),
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  validateProfile,
  KNOWN_MODES,
  KNOWN_EXECUTORS,
  KNOWN_SCORERS,
};
