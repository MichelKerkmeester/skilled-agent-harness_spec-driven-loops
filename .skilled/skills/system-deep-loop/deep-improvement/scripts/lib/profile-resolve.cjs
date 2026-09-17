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

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The default benchmark-profiles directory both Lane B steps fall back to when
// --profiles-dir is not supplied. Kept identical to the prior in-file literals.
const DEFAULT_PROFILES_DIR =
  '.opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Scan a fixture directory for a JSON file whose parsed `id` field matches the
 * given reference. This is the fallback path fixturePathFor() uses when a
 * literal `<ref>.json` filename does not exist, mirroring sweep-benchmark.cjs's
 * byId index (a profile's fixtures[] entries are the fixture's internal `id`,
 * which is not guaranteed to match its filename).
 *
 * @param {string} fixtureRef - Fixture id to search for.
 * @param {string} fixtureDir - Directory to scan for fixture JSON files.
 * @returns {?string} Path to the matching fixture file, or null when none is found.
 */
function findFixtureById(fixtureRef, fixtureDir) {
  let entries;
  try {
    entries = fs.readdirSync(fixtureDir);
  } catch (_) {
    return null;
  }
  for (const name of entries) {
    if (!name.endsWith('.json')) continue;
    const full = path.join(fixtureDir, name);
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (_) {
      continue; // a non-fixture or malformed JSON in the dir is skipped, not fatal.
    }
    if (parsed && parsed.id === fixtureRef) return full;
  }
  return null;
}

/**
 * Map a fixture reference (id or *.json filename) to its on-disk path under the
 * fixture dir. The literal `<ref>.json` filename is the fast/primary path
 * (unchanged for profiles like default.json that already use filenames as
 * refs); when that file does not exist, fall back to scanning fixtureDir for a
 * fixture whose parsed `id` matches ref, so profiles that reference fixtures
 * by internal id (e.g. framework_bakeoff.json's "t3-lower-bound", which lives
 * in t3_bugfix_in_context.json) resolve identically to sweep-benchmark.cjs.
 * When neither resolves, the literal path is returned unchanged so callers'
 * existing "fixture not found" handling is unaffected.
 *
 * @param {string} fixtureRef - Fixture id or *.json filename.
 * @param {string} fixtureDir - Directory containing fixture files.
 * @returns {string} Resolved path to the fixture file.
 */
function fixturePathFor(fixtureRef, fixtureDir) {
  const fileName = fixtureRef.endsWith('.json') ? fixtureRef : `${fixtureRef}.json`;
  const literalPath = path.join(fixtureDir, fileName);
  if (fs.existsSync(literalPath)) return literalPath;
  return findFixtureById(fixtureRef, fixtureDir) || literalPath;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { DEFAULT_PROFILES_DIR, fixturePathFor };
