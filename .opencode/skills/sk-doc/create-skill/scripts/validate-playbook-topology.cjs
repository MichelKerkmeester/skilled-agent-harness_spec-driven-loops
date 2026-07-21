#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ validate-playbook-topology — pre-dispatch typed-gold gate for a hub      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * validate-playbook-topology.cjs — pre-dispatch gate over a hub's manual
 * testing playbook. Every scenario carries typed gold in its frontmatter:
 * `expected_workflow_mode` plus an `expected_leaf_resources` list of
 * `{ workflow_mode, leaf_resource_id }` pairs. This gate runs three checks,
 * in order, before any scenario is allowed to dispatch:
 *
 *   (a) schema     - the frontmatter carries well-formed typed gold
 *   (b) manifest   - every typed pair resolves against the hub's committed
 *                    leaf-manifest.json (the single source of truth)
 *   (c) selected-map join - every pair's workflowMode belongs to the
 *                    scenario's own declared `expected_workflow_mode` set,
 *                    and a non-full-inventory scenario stays within the
 *                    selected-map union cap (maxWorkflowModes: 2)
 *
 * A scenario that fails any stage is an invalid oracle: it is blocked from
 * dispatch and reported as excluded, never silently scored as zero recall.
 * That is a stale-fixture or missing-alias signal, not a routing failure,
 * so it must never be folded into a routing-accuracy denominator.
 *
 * This module owns pre-dispatch classification only. It does not touch the
 * manifest, the alias table, or any emitter; it reads them read-only.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const contract = require('./lib/leaf-resource-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A scenario may span at most this many simultaneous workflow modes unless
// it opts into `full_inventory_intent: true` (an explicit, named bypass, not
// an inferred condition).
const MAX_SIMULTANEOUS_WORKFLOW_MODES = 2;

// A scenario with zero positive resource gold (e.g. an UNKNOWN-fallback
// fixture) never needs a manifest-registered workflowMode; this is the one
// declared exception to "every workflowMode must be a real hub mode".
const EMPTY_GOLD_WORKFLOW_MODE = 'UNKNOWN';

const CLASS_SCHEMA = 'fixture_schema_error';
const CLASS_TOPOLOGY = 'fixture_topology_error';
const CLASS_SELECTION = 'fixture_selection_error';

// The single unified verdict enum shared across the compiled-routing coverage
// surface (this topology gate, the scenario-content validator, the cutover
// executor, and the LUNA acceptance stage). The manual-testing-playbook
// template's older PARTIAL/READY vocabulary collapses into this set: a valid
// oracle is PASS, a blocked oracle is FAIL, and a scenario intentionally outside
// the typed-gold contract is SKIP. The internal valid/blocked status is retained
// alongside it so existing consumers stay byte-compatible.
const VERDICT = Object.freeze({ PASS: 'PASS', FAIL: 'FAIL', SKIP: 'SKIP' });

// Map the internal per-fixture status onto the unified verdict enum. A blocked
// fixture is a FAIL; a valid one is a PASS. SKIP is reserved for a caller that
// marks a fixture non-applicable; this gate never invents a SKIP on its own.
function statusToVerdict(status) {
  if (status === 'valid') return VERDICT.PASS;
  return VERDICT.FAIL;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FRONTMATTER PARSING (typed gold only; legacy fields are read elsewhere)
// ─────────────────────────────────────────────────────────────────────────────

// Quote-tolerant: every scalar/pair regex below accepts an optional matching
// `'` or `"` around the value and strips it from the captured group, so
// `workflow_mode: quality` and `workflow_mode: "quality"` parse to the
// identical string. The canonical serialization new fixtures should use is
// the unquoted form (matching `load-playbook-scenarios.cjs`'s Lane C loader,
// the proven parser for this same corpus shape); quoted values remain valid
// input, they are simply not what tooling emits by default.

function readFileSafe(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return null; }
}

function extractFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---/.exec(text || '');
  return m ? m[1] : null;
}

// Splits a scenario's declared route on its two legal separators:
// "+" for a simultaneous multi-mode bundle, "→" for a sequential multi-turn
// scenario (each turn is an independent dispatch, so the union cap does not
// apply the same way). A single mode or the literal UNKNOWN sentinel yields
// one entry.
function splitDeclaredModes(expectedWorkflowMode) {
  if (!expectedWorkflowMode) return { modes: [], sequential: false };
  if (expectedWorkflowMode.includes('→')) {
    return { modes: expectedWorkflowMode.split('→').map((s) => s.trim()).filter(Boolean), sequential: true };
  }
  return { modes: expectedWorkflowMode.split('+').map((s) => s.trim()).filter(Boolean), sequential: false };
}

// Parses the fixed two-line-per-entry shape this migration writes:
//   expected_leaf_resources:
//     - workflow_mode: <mode>
//       leaf_resource_id: <id>
// or the empty-list shape `expected_leaf_resources: []`.
function parseExpectedLeafResources(block) {
  if (/(?:^|\n)[ \t]*expected_leaf_resources:[ \t]*\[\][ \t]*(?:\n|$)/.test(block)) {
    return { ok: true, pairs: [] };
  }
  const m = /(?:^|\n)[ \t]*expected_leaf_resources:[ \t]*\n((?:[ \t]*-[ \t]*workflow_mode:.*\n[ \t]*leaf_resource_id:.*\n?)+)/.exec(block);
  if (!m) return { ok: false, pairs: null };
  const pairs = [];
  const entryRe = /-[ \t]*workflow_mode:[ \t]*["']?([^"'\n]+?)["']?[ \t]*\n[ \t]*leaf_resource_id:[ \t]*["']?([^"'\n]+?)["']?[ \t]*(?:\n|$)/g;
  let entry;
  while ((entry = entryRe.exec(m[1])) !== null) {
    pairs.push({ workflowMode: entry[1].trim(), leafResourceId: entry[2].trim() });
  }
  return { ok: true, pairs };
}

function parseFixture(absPath, playbookDir) {
  const text = readFileSafe(absPath);
  if (!text) return { ok: false, path: absPath, error: 'UNREADABLE_FILE' };
  const block = extractFrontmatter(text);
  if (!block) return { ok: false, path: absPath, error: 'NO_FRONTMATTER' };

  const idM = /(?:^|\n)[ \t]*id:[ \t]*["']?([A-Za-z0-9-]+)/.exec(block);
  const modeM = /(?:^|\n)[ \t]*expected_workflow_mode:[ \t]*["']?([^"'\n]+?)["']?[ \t]*(?:\n|$)/.exec(block);
  const fullInventoryM = /(?:^|\n)[ \t]*full_inventory_intent:[ \t]*["']?(true|false)["']?/.exec(block);
  const leafResult = parseExpectedLeafResources(block);

  return {
    ok: true,
    id: idM ? idM[1].trim() : null,
    relPath: path.relative(playbookDir, absPath),
    expectedWorkflowMode: modeM ? modeM[1].trim() : null,
    fullInventoryIntent: fullInventoryM ? fullInventoryM[1] === 'true' : false,
    leafResourcesParsed: leafResult.ok,
    pairs: leafResult.pairs || [],
  };
}

// Recurse into every nested per-feature directory, not just the playbook root:
// a hub whose scenarios live under per-feature subfolders (or a nested
// compiled-routing/ subtree) must have every leaf inspected, so a defect in a
// deep per-feature file is never missed because the root directory looked clean.
function walkFixtureFiles(playbookDir) {
  const out = [];
  const stack = [playbookDir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try { entries = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const entry of entries) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) { stack.push(full); continue; }
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      if (entry.name === 'manual-testing-playbook.md' || entry.name === 'feature-catalog.md') continue;
      out.push(full);
    }
  }
  return out.sort();
}

function assertPlaybookBoundary(playbookDir) {
  const basename = path.basename(playbookDir);
  const normalized = basename.toLowerCase().replace(/-/g, '_');
  if (normalized.startsWith('manual_testing_playbook')
      && contract.canonicalPackageRoot(basename) !== 'manual-testing-playbook') {
    throw new contract.ContractError('UNSUPPORTED_PLAYBOOK_ROOT', `unsupported playbook root: ${playbookDir}`);
  }
}

function resolvePlaybookBoundary(skillDir, explicitDir) {
  if (explicitDir) {
    const resolved = path.resolve(explicitDir);
    assertPlaybookBoundary(resolved);
    return resolved;
  }
  // Fail closed: a legacy underscore playbook dir must be migrated, never silently ignored in
  // favor of a canonical sibling. Mirrors assertPlaybookBoundary's near-match detection.
  const unsupported = fs.existsSync(skillDir)
    ? fs.readdirSync(skillDir, { withFileTypes: true }).find((entry) => entry.isDirectory()
        && entry.name.toLowerCase().replace(/-/g, '_').startsWith('manual_testing_playbook')
        && contract.canonicalPackageRoot(entry.name) !== 'manual-testing-playbook')
    : null;
  if (unsupported) {
    throw new contract.ContractError('UNSUPPORTED_PLAYBOOK_ROOT', `unsupported playbook root: ${path.join(skillDir, unsupported.name)}`);
  }
  const roots = ['manual-testing-playbook']
    .map((name) => path.join(skillDir, name))
    .filter((candidate) => fs.existsSync(candidate));
  if (roots.length === 1) return roots[0];
  throw new contract.ContractError('MISSING_PLAYBOOK_ROOT', `no supported playbook root under ${skillDir}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MANIFEST + ALIAS LOADING (read-only)
// ─────────────────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadManifestLeaves(skillDir) {
  const manifestPath = path.join(skillDir, 'leaf-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new contract.ContractError('MISSING_MANIFEST', `leaf-manifest.json not found under ${skillDir}`);
  }
  const manifest = readJson(manifestPath);
  const leavesByMode = new Map();
  for (const mode of manifest.modes || []) {
    leavesByMode.set(mode.workflowMode, new Set(mode.leaves || []));
  }
  return leavesByMode;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. THREE-STAGE VALIDATION (schema -> manifest -> selected-map join)
// ─────────────────────────────────────────────────────────────────────────────

function validateSchema(fixture) {
  const problems = [];
  if (!fixture.id) problems.push('missing id');
  if (!fixture.expectedWorkflowMode) problems.push('missing expected_workflow_mode');
  if (!fixture.leafResourcesParsed) problems.push('missing or malformed expected_leaf_resources');
  for (const pair of fixture.pairs) {
    if (!pair.workflowMode) problems.push(`typed pair missing workflow_mode (leaf_resource_id=${pair.leafResourceId || '?'})`);
    if (!pair.leafResourceId) problems.push(`typed pair missing leaf_resource_id (workflow_mode=${pair.workflowMode || '?'})`);
    if (pair.leafResourceId) {
      try {
        contract.assertContainment(pair.leafResourceId);
      } catch (err) {
        problems.push(`leaf_resource_id fails containment: ${pair.leafResourceId} (${err.code})`);
      }
    }
  }
  return problems;
}

function validateManifestResolution(fixture, leavesByMode) {
  const problems = [];
  for (const pair of fixture.pairs) {
    if (pair.workflowMode === EMPTY_GOLD_WORKFLOW_MODE) continue;
    const leaves = leavesByMode.get(pair.workflowMode);
    if (!leaves) {
      problems.push(`unregistered workflowMode: ${pair.workflowMode}`);
      continue;
    }
    if (!leaves.has(pair.leafResourceId)) {
      problems.push(`no manifest leaf for (${pair.workflowMode}, ${pair.leafResourceId}) - missing alias/target`);
    }
  }
  return problems;
}

function validateSelectedMapJoin(fixture) {
  const problems = [];
  const { modes: declaredModes, sequential } = splitDeclaredModes(fixture.expectedWorkflowMode);
  const declaredSet = new Set(declaredModes);

  for (const pair of fixture.pairs) {
    if (!declaredSet.has(pair.workflowMode)) {
      problems.push(`typed pair workflowMode "${pair.workflowMode}" is not part of declared expected_workflow_mode "${fixture.expectedWorkflowMode}"`);
    }
  }

  if (!sequential && !fixture.fullInventoryIntent && declaredModes.length > MAX_SIMULTANEOUS_WORKFLOW_MODES) {
    problems.push(
      `declares ${declaredModes.length} simultaneous workflow modes, exceeding the selected-map union cap `
      + `(${MAX_SIMULTANEOUS_WORKFLOW_MODES}) without full_inventory_intent: true`,
    );
  }

  return problems;
}

function classifyFixture(fixture, leavesByMode) {
  const schemaProblems = validateSchema(fixture);
  if (schemaProblems.length) {
    return { status: 'blocked', errorClass: CLASS_SCHEMA, problems: schemaProblems };
  }

  const manifestProblems = validateManifestResolution(fixture, leavesByMode);
  const selectionProblems = validateSelectedMapJoin(fixture);

  if (manifestProblems.length) {
    return { status: 'blocked', errorClass: CLASS_TOPOLOGY, problems: manifestProblems.concat(selectionProblems) };
  }
  if (selectionProblems.length) {
    return { status: 'blocked', errorClass: CLASS_SELECTION, problems: selectionProblems };
  }
  return { status: 'valid', errorClass: null, problems: [] };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the pre-dispatch topology gate over every scenario file under a
 * playbook directory. Read-only: never mutates the manifest, aliases, or
 * fixture files.
 *
 * @param {Object} args - Run inputs.
 * @param {string} args.playbookDir - Directory holding scenario `.md` files.
 * @param {string} args.skillDir - Hub root holding `leaf-manifest.json`.
 * @returns {{results: Array, validCount: number, blockedCount: number}} Report.
 */
function runValidation({ playbookDir, skillDir }) {
  assertPlaybookBoundary(playbookDir);
  const leavesByMode = loadManifestLeaves(skillDir);
  const files = walkFixtureFiles(playbookDir);
  const results = [];

  for (const absPath of files) {
    const fixture = parseFixture(absPath, playbookDir);
    if (!fixture.ok) {
      results.push({
        id: null,
        relPath: path.relative(playbookDir, absPath),
        status: 'blocked',
        verdict: statusToVerdict('blocked'),
        errorClass: CLASS_SCHEMA,
        problems: [fixture.error],
      });
      continue;
    }
    const verdict = classifyFixture(fixture, leavesByMode);
    results.push({
      id: fixture.id,
      relPath: fixture.relPath,
      expectedWorkflowMode: fixture.expectedWorkflowMode,
      pairCount: fixture.pairs.length,
      status: verdict.status,
      verdict: statusToVerdict(verdict.status),
      errorClass: verdict.errorClass,
      problems: verdict.problems,
    });
  }

  const validCount = results.filter((r) => r.status === 'valid').length;
  const blockedCount = results.length - validCount;
  // Unified run-level verdict over every recursively-walked leaf: any blocked
  // leaf fails the whole surface, so a per-feature-file defect can never pass
  // because the root looked clean. An empty tree is SKIP, not a false PASS.
  const runVerdict = results.length === 0
    ? VERDICT.SKIP
    : (blockedCount > 0 ? VERDICT.FAIL : VERDICT.PASS);
  return { results, validCount, blockedCount, verdict: runVerdict };
}

function formatReport(report) {
  const lines = [];
  for (const r of report.results) {
    const label = r.id || '(unknown id)';
    if (r.status === 'valid') {
      lines.push(`PASS  ${label}  ${r.relPath}  pairs=${r.pairCount}  mode=${r.expectedWorkflowMode}`);
    } else {
      lines.push(`BLOCK ${label}  ${r.relPath}  class=${r.errorClass}  excluded_from_denominators=true`);
      for (const p of r.problems) lines.push(`        - ${p}`);
    }
  }
  lines.push('');
  lines.push(`verdict=${report.verdict} valid=${report.validCount} blocked=${report.blockedCount} total=${report.results.length}`);
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CLI
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { dir: null, skillDir: null, strict: false, format: 'text' };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dir') { args.dir = argv[i + 1]; i += 1; }
    else if (a === '--skill-dir') { args.skillDir = argv[i + 1]; i += 1; }
    else if (a === '--strict') { args.strict = true; }
    else if (a === '--format') { args.format = argv[i + 1]; i += 1; }
  }
  return args;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  MAX_SIMULTANEOUS_WORKFLOW_MODES,
  EMPTY_GOLD_WORKFLOW_MODE,
  CLASS_SCHEMA,
  CLASS_TOPOLOGY,
  CLASS_SELECTION,
  VERDICT,
  statusToVerdict,
  parseFixture,
  walkFixtureFiles,
  loadManifestLeaves,
  assertPlaybookBoundary,
  resolvePlaybookBoundary,
  classifyFixture,
  runValidation,
  formatReport,
};

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  const skillDir = path.resolve(args.skillDir || path.resolve(__dirname, '..', '..'));

  try {
    const playbookDir = resolvePlaybookBoundary(skillDir, args.dir);
    const report = runValidation({ playbookDir, skillDir });
    if (args.format === 'json') {
      process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    } else {
      process.stdout.write(`${formatReport(report)}\n`);
    }
    if (args.strict && report.blockedCount > 0) {
      process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    process.stderr.write(`validate-playbook-topology: ${err.message}\n`);
    process.exit(2);
  }
}
