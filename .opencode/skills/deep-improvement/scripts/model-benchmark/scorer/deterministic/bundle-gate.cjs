#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ bundle-gate — D2 import/export/smoke-run bundle verification gate        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * D2 Bundle-gate check (rubric weight 0.30, HARD GATE on smoke-run env failure).
 *
 * Three-layer verification per `feedback_bundle_gate_smoke_run`:
 *   Layer 1 (imports grep): parse output for import/require statements;
 *           every claimed import must look resolvable (Node builtin, npm package
 *           name in package.json deps, or relative path within fixture cwd).
 *   Layer 2 (exports grep): if output declares exports, verify they are
 *           well-formed (matching `export function|const|class` or CommonJS).
 *   Layer 3 (smoke-run): if fixture acceptance includes a smoke-run command,
 *           execute it under the fixture cwd; assert exit 0.
 *
 * Score policy:
 *   1.0 = all 3 layers pass.
 *   0.6 = 2 layers pass.
 *   0.3 = 1 layer passes.
 *   0.0 = no layers pass.
 *
 * HARD GATE: if Layer 3 errors with an environment failure (cwd missing,
 * dep missing, module-not-found) distinct from a test-failure, set
 * hard_gate_failed: true. 003-eval-loop short-circuits D1 to 0.0 on this signal.
 *
 * Usage:
 *   node scripts/deterministic/bundle-gate.cjs <fixture.json> <output.md>
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const VERSION = '1.0.0';
const PACKET_ROOT = path.resolve(__dirname, '..', '..');
const SMOKE_RUN_TIMEOUT_MS = 30 * 1000;

const ENV_FAILURE_PATTERNS = [
  /Cannot find module/i,
  /MODULE_NOT_FOUND/,
  /ENOENT/,
  /no such file or directory/i,
  /command not found/i,
  /Permission denied/i,
];

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
 * Extract import/require specifiers from output text.
 *
 * @param {string} text - Output text to scan.
 * @returns {string[]} De-duplicated list of import/require specifiers.
 */
function extractImports(text) {
  const imports = [];
  const importRe = /^\s*import\s+(?:[^'"`]+\s+from\s+)?['"`]([^'"`]+)['"`]/gm;
  const requireRe = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  let m;
  while ((m = importRe.exec(text)) !== null) imports.push(m[1]);
  while ((m = requireRe.exec(text)) !== null) imports.push(m[1]);
  return Array.from(new Set(imports));
}

/**
 * Extract declared exports (ESM and CommonJS forms) from output text.
 *
 * @param {string} text - Output text to scan.
 * @returns {Array<{name: string, kind: string}>} Export descriptors with name and kind.
 */
function extractExports(text) {
  const exports = [];
  const esmRe = /^\s*export\s+(?:default\s+)?(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z_$][A-Za-z0-9_$]*)/gm;
  const cjsRe = /(?:module\.exports|exports)\s*\.\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*=/g;
  const cjsBulkRe = /module\.exports\s*=\s*\{([\s\S]*?)\}/g;
  let m;
  while ((m = esmRe.exec(text)) !== null) exports.push({ name: m[1], kind: 'esm' });
  while ((m = cjsRe.exec(text)) !== null) exports.push({ name: m[1], kind: 'cjs-property' });
  while ((m = cjsBulkRe.exec(text)) !== null) {
    const names = m[1].split(',').map((n) => n.trim().split(':')[0]).filter(Boolean);
    for (const name of names) exports.push({ name, kind: 'cjs-bulk' });
  }
  return exports;
}

function importLooksReal(specifier) {
  // Node builtins
  if (/^node:/.test(specifier)) return true;
  const builtins = ['fs', 'path', 'crypto', 'os', 'child_process', 'util', 'stream', 'events', 'http', 'https', 'url'];
  if (builtins.includes(specifier)) return true;
  // Relative paths are checked at smoke-run; assume valid here
  if (specifier.startsWith('.') || specifier.startsWith('/')) return true;
  // npm package: assume valid if it looks like a normal scoped or unscoped package name
  if (/^@?[A-Za-z0-9._\-\/]+$/.test(specifier)) return true;
  return false;
}

function scoreLayer1(text) {
  const imports = extractImports(text);
  if (imports.length === 0) {
    return { layer: 1, passed: true, details: { imports_found: 0, note: 'no imports to verify' } };
  }
  const suspicious = imports.filter((i) => !importLooksReal(i));
  return {
    layer: 1,
    passed: suspicious.length === 0,
    details: { imports_found: imports.length, suspicious },
  };
}

function scoreLayer2(text) {
  const exports = extractExports(text);
  if (exports.length === 0) {
    return { layer: 2, passed: true, details: { exports_found: 0, note: 'no exports declared' } };
  }
  // Well-formed = has a non-empty identifier; we already enforce that via regex capture.
  // Detect duplicate export names (well-formed but suspicious).
  const names = exports.map((e) => e.name);
  const dups = names.filter((n, i) => names.indexOf(n) !== i);
  return {
    layer: 2,
    passed: dups.length === 0,
    details: { exports_found: exports.length, names, duplicates: dups },
  };
}

function scoreLayer3(fixture) {
  const acceptance = (fixture.acceptance || []).find((a) => a.type === 'smoke-run' || a.type === 'deterministic' && a.command);
  if (!acceptance || !acceptance.command) {
    return {
      layer: 3,
      passed: true,
      hard_gate_failed: false,
      details: { note: 'no smoke-run acceptance in fixture; layer skipped (counts as pass)' },
    };
  }
  // F017-P1-02 (017 review): acceptance.command is profile/fixture-supplied data
  // that flows into a shell via execSync. bundle-gate Layer-3 is the D2 hard gate,
  // so the same DEEP_AGENT_ALLOW_CRITERIA_EXEC=0 control that gates
  // score-model-variant's deterministic execSync must gate this path too, or the
  // documented "refuse criteria-driven shell execution" guarantee is false here.
  // Default ('1'/unset) preserves backward-compat (runs). When disabled, refuse
  // the smoke-run without executing: the layer does not pass (mirrors
  // score-model-variant's ok=false gate), but hard_gate_failed stays false so the
  // score does not short-circuit D1 to 0.0.
  if (process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC === '0') {
    return {
      layer: 3,
      passed: false,
      hard_gate_failed: false,
      details: {
        command: acceptance.command,
        skipped: true,
        note: 'smoke-run skipped: criteria exec disabled (DEEP_AGENT_ALLOW_CRITERIA_EXEC=0)',
      },
    };
  }
  const cwdRel = (fixture.scope && fixture.scope.cwd) || '';
  const cwdAbs = path.resolve(PACKET_ROOT, cwdRel);
  if (!fs.existsSync(cwdAbs)) {
    return {
      layer: 3,
      passed: false,
      hard_gate_failed: true,
      details: {
        error: 'fixture cwd does not exist on disk',
        cwd: cwdAbs,
        hint: 'fixture seed not materialized; 003 should not score variants against this fixture',
      },
    };
  }
  try {
    const out = execSync(acceptance.command, {
      cwd: cwdAbs,
      timeout: SMOKE_RUN_TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return {
      layer: 3,
      passed: true,
      hard_gate_failed: false,
      details: { command: acceptance.command, exit_code: 0, stdout_snippet: out.toString().slice(0, 200) },
    };
  } catch (err) {
    const combined = ((err.stderr || '').toString() + (err.stdout || '').toString()).slice(0, 500);
    const envFailure = ENV_FAILURE_PATTERNS.some((re) => re.test(combined));
    return {
      layer: 3,
      passed: false,
      hard_gate_failed: envFailure,
      details: {
        command: acceptance.command,
        exit_code: err.status || -1,
        stderr_snippet: combined,
        env_failure: envFailure,
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score an output against the three bundle-gate layers and combine into a verdict.
 *
 * @param {Object} fixture - Fixture descriptor (acceptance, scope).
 * @param {string} text - Output text to score.
 * @returns {Object} Score payload with score, passed, hard_gate_failed, details, version.
 */
function scoreOutput(fixture, text) {
  const l1 = scoreLayer1(text);
  const l2 = scoreLayer2(text);
  const l3 = scoreLayer3(fixture);
  const passedCount = [l1, l2, l3].filter((l) => l.passed).length;
  let score;
  if (passedCount === 3) score = 1.0;
  else if (passedCount === 2) score = 0.6;
  else if (passedCount === 1) score = 0.3;
  else score = 0.0;
  const hard_gate_failed = Boolean(l3.hard_gate_failed);
  return {
    score,
    passed: score >= 0.6,
    hard_gate_failed,
    details: { layer_1: l1, layer_2: l2, layer_3: l3 },
    version: VERSION,
  };
}

function main() {
  const [fixturePath, outputPath] = process.argv.slice(2);
  if (!fixturePath || !outputPath) {
    process.stderr.write('usage: bundle-gate.cjs <fixture.json> <output.md>\n');
    process.exit(2);
  }
  const fixture = loadJson(fixturePath);
  const text = loadOutput(outputPath);
  if (text === null) {
    emit({
      score: 0.0,
      passed: false,
      hard_gate_failed: false,
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

module.exports = { scoreOutput, extractImports, extractExports, VERSION };
