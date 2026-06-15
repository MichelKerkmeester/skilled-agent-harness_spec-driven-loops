// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ profile-resolve — shared benchmark profile/fixture path resolution      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Single source of truth for the two provably-identical resolution pieces that
 * the benchmark-fixture materializer and the benchmark runner both depend on:
 * the default profiles-dir literal and fixturePathFor(). Both steps previously
 * hardcoded these identically, relying on the copies staying byte-aligned by
 * hand. Centralizing them makes the "a profile-by-id resolves identically in
 * both steps" invariant structural rather than a hand-maintained contract.
 *
 * Scope note: only the two identical pieces live here. The per-script
 * loadProfile/resolveInput helpers differ in body and stay in their own files,
 * so this module does NOT change any resolution behavior.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The default benchmark-profiles directory both Lane B steps fall back to when
// --profiles-dir is not supplied. Kept identical to the prior in-file literals.
const DEFAULT_PROFILES_DIR =
  '.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map a fixture reference (id or *.json filename) to its on-disk path under the
 * fixture dir. Behavior-identical to the prior copies in both Lane B steps.
 *
 * @param {string} fixtureRef - Fixture id or *.json filename.
 * @param {string} fixtureDir - Directory containing fixture files.
 * @returns {string} Resolved path to the fixture file.
 */
function fixturePathFor(fixtureRef, fixtureDir) {
  const fileName = fixtureRef.endsWith('.json') ? fixtureRef : `${fixtureRef}.json`;
  return path.join(fixtureDir, fileName);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { DEFAULT_PROFILES_DIR, fixturePathFor };
