#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ hallucination-flag — D4 allowlist gate for claimed CLI flags & symbols   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * D4 Hallucination check (rubric weight 0.15, deterministic primary; grader adds
 * semantic check at the harness layer).
 *
 * Cheap allowlist gate: extract claimed CLI flags and named symbols from the
 * output; compare against fixture.allowlist. Anything claimed but not in the
 * allowlist is flagged as a potential hallucination.
 *
 * Score policy:
 *   1.0 = all claims allowlisted (0 unverified).
 *   0.8 = 1 unverified.
 *   0.5 = 2 unverified.
 *   0.0 = >= 3 unverified.
 *
 * Extraction:
 *   CLI flags: tokens matching /(--?[A-Za-z][A-Za-z0-9_-]+)/ in fenced code blocks
 *     or bash-style command lines (heuristic; tolerates some false positives).
 *   Symbols: identifiers used as function calls, e.g. `foo(...)` or `Foo.bar(...)`,
 *     where the identifier is at least 4 chars.
 *
 * Common-name allowlist (always-real, never flagged): standard JS builtins,
 * Node fs/path/crypto methods, common test-framework symbols.
 *
 * Usage:
 *   node scripts/deterministic/hallucination-flag.cjs <fixture.json> <output.md>
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const VERSION = '1.0.0';

const COMMON_ALLOWLIST = new Set([
  // JS builtins
  'console', 'Array', 'Object', 'Map', 'Set', 'JSON', 'Math', 'Date', 'Promise', 'Error',
  'parseInt', 'parseFloat', 'isNaN', 'String', 'Number', 'Boolean',
  // Number methods
  'toFixed', 'toString', 'toPrecision', 'valueOf',
  // Node fs
  'readFile', 'writeFile', 'readFileSync', 'writeFileSync', 'readdir', 'readdirSync',
  'existsSync', 'mkdir', 'mkdirSync', 'rm', 'rmSync', 'stat', 'statSync', 'rename', 'renameSync',
  'appendFile', 'appendFileSync', 'createReadStream', 'createWriteStream',
  // Node path
  'join', 'resolve', 'dirname', 'basename', 'extname', 'normalize', 'relative',
  // Node crypto
  'createHash', 'randomBytes', 'randomUUID', 'createCipheriv', 'createDecipheriv',
  // child_process
  'execSync', 'spawn', 'spawnSync', 'execFile', 'execFileSync',
  // test frameworks (vitest/jest/mocha matchers)
  'describe', 'test', 'it', 'expect', 'beforeAll', 'afterAll', 'beforeEach', 'afterEach',
  'toBe', 'toEqual', 'toMatch', 'toContain', 'toThrow', 'toHaveProperty', 'toBeCloseTo',
  'toBeDefined', 'toBeUndefined', 'toBeNull', 'toBeTruthy', 'toBeFalsy', 'toBeInstanceOf',
  // common verbs
  'require', 'module', 'exports', 'process',
  // typical user-defined verbs that don't warrant flagging (low-risk)
  'init', 'main', 'run', 'load', 'save', 'fetch', 'render', 'parse', 'format',
]);

// JavaScript keywords that look like calls (while(...), if(...)) but aren't symbols.
const JS_KEYWORDS = new Set([
  'while', 'if', 'for', 'switch', 'catch', 'return', 'typeof', 'instanceof',
  'function', 'class', 'new', 'delete', 'void', 'yield', 'await', 'async',
  'else', 'case', 'break', 'continue', 'throw', 'try', 'finally', 'do',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function emit(payload) {
  process.stdout.write(JSON.stringify(payload) + '\n');
}

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadOutput(p) {
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

/**
 * Extract tokens that look like CLI flags from output text.
 *
 * @param {string} text - Output text to scan.
 * @returns {string[]} De-duplicated CLI-flag tokens.
 */
function extractCliFlags(text) {
  const flags = new Set();
  // Find tokens that look like CLI flags: --flag or -f, length >= 2 to skip "-" subtraction
  const re = /(?:^|\s)(--[A-Za-z][A-Za-z0-9_-]+|-[A-Za-z]{1,3})(?=[\s=,;)\]}'"`]|$)/gm;
  let m;
  while ((m = re.exec(text)) !== null) {
    flags.add(m[1]);
  }
  return Array.from(flags);
}

/**
 * Extract identifiers used as function calls (potential symbol claims) from text.
 *
 * @param {string} text - Output text to scan.
 * @returns {string[]} De-duplicated call-site identifiers worth verifying.
 */
function extractSymbols(text) {
  const symbols = new Set();
  // Match identifiers used as function calls: foo(, Module.method(, deepNs.scope.fn(
  const re = /\b([A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*)\s*\(/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const sym = m[1];
    // Skip JS keywords (while, if, for, switch, ...) which are not symbols.
    const root = sym.split('.')[0];
    if (JS_KEYWORDS.has(root)) continue;
    // Skip if any segment of the dotted path is a common-allowlist method
    // (e.g., value.toFixed is allowed because toFixed is on the common list).
    const segments = sym.split('.');
    const anySegmentCommon = segments.some((s) => COMMON_ALLOWLIST.has(s));
    if (anySegmentCommon) continue;
    if (root.length >= 4 && !COMMON_ALLOWLIST.has(root)) {
      symbols.add(sym);
    }
  }
  return Array.from(symbols);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score an output by counting claimed flags/symbols not covered by the allowlist.
 *
 * @param {Object} fixture - Fixture descriptor (allowlist.cli_flags, allowlist.symbols).
 * @param {string} text - Output text to score.
 * @returns {Object} Score payload with score, passed, details, version.
 */
function scoreOutput(fixture, text) {
  const allowlist = fixture.allowlist || {};
  const allowedFlags = new Set(allowlist.cli_flags || []);
  const allowedSymbols = new Set(allowlist.symbols || []);

  const flags = extractCliFlags(text);
  const symbols = extractSymbols(text);

  const unverifiedFlags = flags.filter((f) => !allowedFlags.has(f));
  const unverifiedSymbols = symbols.filter((s) => {
    if (allowedSymbols.has(s)) return true === false;
    // Tolerate dotted paths if root is allowed
    const root = s.split('.')[0];
    if (allowedSymbols.has(root)) return false;
    if (COMMON_ALLOWLIST.has(root)) return false;
    return true;
  });

  const totalUnverified = unverifiedFlags.length + unverifiedSymbols.length;
  let score;
  if (totalUnverified === 0) score = 1.0;
  else if (totalUnverified === 1) score = 0.8;
  else if (totalUnverified === 2) score = 0.5;
  else score = 0.0;

  return {
    score,
    passed: score >= 0.8,
    details: {
      flags_found: flags.length,
      symbols_found: symbols.length,
      unverified_flags: unverifiedFlags,
      unverified_symbols: unverifiedSymbols,
      total_unverified: totalUnverified,
    },
    version: VERSION,
  };
}

function main() {
  const [fixturePath, outputPath] = process.argv.slice(2);
  if (!fixturePath || !outputPath) {
    process.stderr.write('usage: hallucination-flag.cjs <fixture.json> <output.md>\n');
    process.exit(2);
  }
  const fixture = loadJson(fixturePath);
  const text = loadOutput(outputPath);
  if (text === null) {
    emit({
      score: 0.0,
      passed: false,
      details: { error: 'output file missing', path: outputPath },
      version: VERSION,
    });
    process.exit(0);
  }
  emit(scoreOutput(fixture, text));
}

if (require.main === module) {
  main();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { scoreOutput, extractCliFlags, extractSymbols, VERSION };
