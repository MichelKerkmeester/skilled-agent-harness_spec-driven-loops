#!/usr/bin/env node
'use strict';

// Per-hub compiled-routing serving-snapshot: capture, render, and validate.
//
// A hub's live compiled-routing state is otherwise split across several
// single-record files (the activation manifest, the fence state, and the two
// latest-snapshot records) with no single artifact that answers "what is this
// hub serving right now." This module joins the flag, the declared manifest,
// the fence epoch, a freshness read, and the parity anchors into one
// serving-snapshot.json, and renders a human-readable view from that same JSON
// so the two never drift.
//
// The joined artifact is always captured against the ACTIVE serving manifest
// under `010-live-activation/activation/<hub>/` — never a shadow-candidate
// manifest under `006-parent-hub-rollout/`. Archiving a candidate as if it were
// the serving decision would attribute a never-live state to production, so the
// candidate tree is refused rather than read.
//
// Usage:
//   render-serving-snapshot.cjs --hub <hubId> [--out <dir>] [--validate] [--pretty]
//   render-serving-snapshot.cjs --all [--out <dir>] [--validate] [--pretty]

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// This script sits at .opencode/skills/sk-doc/create-benchmark/scripts/; the
// repository root is five directories up. Resolving from __dirname keeps the
// paths correct in a worktree or a relocated checkout without an absolute pin.
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const RUNTIME_ROOT = path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-routing');
// Derived rather than hardcoded: the promoted closure renumbers its internal
// directories when a new generation is published, and a pinned number silently
// stops matching. The layout module resolves whichever generation is serving.
const layout = require(path.join(REPO_ROOT, '.opencode', 'bin', 'lib', 'compiled-route-layout.cjs'));
const ACTIVE_ACTIVATION_ROOT = layout.activationRootFor(RUNTIME_ROOT);
const ENGINE_RESOLVER_PATH = layout.resolverPathFor(RUNTIME_ROOT);
const SERVING_CLOSURE_PATH = path.join(RUNTIME_ROOT, 'serving-closure.manifest.json');
const DEFAULT_SKILLS_ROOT = path.join(REPO_ROOT, '.opencode', 'skills');

const SCHEMA_VERSION = 'serving-snapshot/V1';

// The benchmark-facing flag classifier is single-sourced from the non-frozen
// parity harness so the snapshot can never describe a flag state the runtime
// would read differently.
const { classifyFlagState } = require(path.join(
  REPO_ROOT,
  '.opencode', 'skills', 'system-deep-loop', 'deep-improvement', 'scripts', 'skill-benchmark', 'compiled-routing-parity.cjs',
));

// The only top-level keys a V1 snapshot may carry, and the only manifest
// sub-keys. The validator treats this set as exact: a missing required key or
// an unknown extra key both fail, so the joined artifact cannot quietly grow a
// field no consumer agreed to.
const REQUIRED_TOP_KEYS = Object.freeze([
  'schemaVersion', 'hubId', 'capturedAt', 'flag', 'manifest', 'liveConfigHash',
  'freshness', 'engineResolverPath', 'parityBaseline', 'realModelLast',
]);
const REQUIRED_MANIFEST_KEYS = Object.freeze([
  'selectedPolicyHash', 'generation', 'fenceEpoch', 'servingAuthority', 'shadowOnly',
]);

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function readJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function toRepoRel(absPath) {
  return path.relative(REPO_ROOT, absPath).split(path.sep).join('/');
}

/**
 * Refuse any activation root that is not the live `010-live-activation`
 * activation tree — most importantly a `006-parent-hub-rollout` shadow
 * candidate. A snapshot is a claim about what production serves; sourcing it
 * from a candidate would make that claim a lie.
 *
 * @param {string} activationRoot - Absolute activation-root path to check.
 * @returns {string} The same path when it is the live activation tree.
 * @throws {Error} `err.code === 'MANIFEST_SOURCE'` when the path is not live.
 */
function assertActiveManifestSource(activationRoot) {
  const normalized = path.resolve(activationRoot).split(path.sep).join('/');
  // Both markers come from the resolved layout so a renumbered generation cannot
  // silently disable this guard or reject the tree that is actually serving.
  const active = layout.resolveLayoutOrLegacy(RUNTIME_ROOT);
  const rolloutMarker = active.compiler.split('/')[0];
  if (normalized.includes(rolloutMarker)) {
    const err = new Error(`refused shadow-candidate manifest source: ${activationRoot}`);
    err.code = 'MANIFEST_SOURCE';
    throw err;
  }
  if (!normalized.includes(active.activation)) {
    const err = new Error(`activation root is not the live activation tree: ${activationRoot}`);
    err.code = 'MANIFEST_SOURCE';
    throw err;
  }
  return activationRoot;
}

function activeManifestPath(hubId, activationRoot = ACTIVE_ACTIVATION_ROOT) {
  return path.join(activationRoot, hubId, 'manifest.json');
}

/**
 * The directory a hub's compiled-routing archives live in.
 *
 * Published run output lives under `benchmark/reports/`; the archive lane is a
 * family inside it rather than a sibling of it, so a reader finds every result
 * in one place. Three call sites derive from here rather than repeating the
 * segments, because a layout spelled out in several files drifts one file at a
 * time.
 *
 * @param {string} hubId - Hub whose archive root is wanted.
 * @param {string} skillsRoot - Skills tree the hub lives under.
 * @returns {string} Absolute archive root.
 */
function compiledRoutingArchiveRoot(hubId, skillsRoot) {
  return path.join(skillsRoot, hubId, 'benchmark', 'reports', 'compiled-routing');
}

/**
 * SHA-256 of the raw manifest bytes, or null when the manifest is absent. The
 * digest reads bytes rather than a re-serialized object so it is a stable
 * identity of the file exactly as it serves.
 *
 * @param {string} manifestPath - Absolute path to a manifest.json.
 * @returns {string|null} Hex digest, or null when unreadable.
 */
function readManifestDigest(manifestPath) {
  try { return sha256(fs.readFileSync(manifestPath)); } catch { return null; }
}

const LEGACY_PARITY_BASELINE_LABEL = 'router-compiled-parity-baseline';

/**
 * The parity baseline for a hub: the legacy fixed-label archive when one exists,
 * otherwise the newest dated parity archive.
 *
 * A fixed label alone cannot find anything under the dated run-folder grammar, so
 * a hub whose parity evidence was archived with a date would be reported as having
 * none. Reporting absent evidence that exists is worse than reporting nothing,
 * because it reads as a measured negative rather than a lookup miss.
 *
 * @param {string} hubId - Hub whose compiled-routing archive is scanned.
 * @param {string} skillsRoot - Skills tree the hub lives under.
 * @returns {Object} Baseline summary; `present: false` when genuinely none exists.
 */
function scanParityBaseline(hubId, skillsRoot) {
  const archiveRoot = compiledRoutingArchiveRoot(hubId, skillsRoot);

  const summarize = (label) => {
    const jsonPath = path.join(archiveRoot, label, 'skill-benchmark-report.json');
    let bytes;
    try { bytes = fs.readFileSync(jsonPath); } catch { return null; }
    const parsed = readJsonSafe(jsonPath) || {};
    return {
      label,
      present: true,
      reportDigest: sha256(bytes),
      capturedAt: (parsed.provenance && parsed.provenance.capturedAt) || null,
      verdict: parsed.verdict || null,
    };
  };

  const legacy = summarize(LEGACY_PARITY_BASELINE_LABEL);
  if (legacy) return legacy;

  // Dated archives: prefer the most recently captured parity run. Sorting by label
  // would work for the dated grammar alone, but capture time stays correct even
  // when a label carries no date.
  let labels;
  try {
    labels = fs.readdirSync(archiveRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    return { label: LEGACY_PARITY_BASELINE_LABEL, present: false, reportDigest: null, capturedAt: null, verdict: null };
  }

  let latest = null;
  for (const label of labels) {
    const parsed = readJsonSafe(path.join(archiveRoot, label, 'skill-benchmark-report.json'));
    if (!parsed || !parsed.compiledRoutingParity) continue;
    const summary = summarize(label);
    if (!summary) continue;
    if (!latest || String(summary.capturedAt) > String(latest.capturedAt)) latest = summary;
  }

  return latest
    || { label: LEGACY_PARITY_BASELINE_LABEL, present: false, reportDigest: null, capturedAt: null, verdict: null };
}

/**
 * The latest archived real-model (live-trace) parity run for a hub, or null
 * when none has been archived yet. Reported honestly as null pre-activation
 * rather than fabricated.
 *
 * @param {string} hubId - Hub whose compiled-routing archive is scanned.
 * @param {string} skillsRoot - Skills tree the hub lives under.
 * @returns {Object|null} Summary of the most recent live archive, or null.
 */
function scanRealModelLast(hubId, skillsRoot) {
  const archiveRoot = compiledRoutingArchiveRoot(hubId, skillsRoot);
  let labels;
  try {
    labels = fs.readdirSync(archiveRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch { return null; }
  let latest = null;
  for (const label of labels) {
    const parsed = readJsonSafe(path.join(archiveRoot, label, 'skill-benchmark-report.json'));
    if (!parsed) continue;
    const ctx = parsed.executionContext || {};
    const isLive = ctx.traceMode === 'live' || Boolean(ctx.model);
    if (!isLive) continue;
    const capturedAt = (parsed.provenance && parsed.provenance.capturedAt) || null;
    const candidate = {
      label,
      capturedAt,
      verdict: parsed.verdict || null,
      executor: ctx.executor || null,
      model: ctx.model || null,
      variant: ctx.variant || null,
    };
    if (!latest || String(capturedAt) > String(latest.capturedAt)) latest = candidate;
  }
  return latest;
}

/**
 * Capture one hub's joined serving snapshot from the active serving manifest.
 * Reads the manifest bytes twice around the derivation so a mid-capture change
 * surfaces as a `drifted` freshness rather than a falsely-fresh reading.
 *
 * @param {string} hubId - Hub to snapshot.
 * @param {Object} [opts] - Overrides for the activation and skills roots.
 * @returns {Object} A V1 serving-snapshot object.
 */
function captureServingSnapshot(hubId, opts = {}) {
  const activationRoot = opts.activationRoot || ACTIVE_ACTIVATION_ROOT;
  assertActiveManifestSource(activationRoot);
  const skillsRoot = opts.skillsRoot || DEFAULT_SKILLS_ROOT;

  const manifestPath = activeManifestPath(hubId, activationRoot);
  const fencePath = path.join(activationRoot, hubId, 'fence-state.json');
  const digestBefore = readManifestDigest(manifestPath);
  const manifest = readJsonSafe(manifestPath);
  const fence = readJsonSafe(fencePath);
  const digestAfter = readManifestDigest(manifestPath);

  const manifestPresent = digestAfter !== null && manifest !== null;
  const manifestStable = digestBefore === digestAfter;
  const engineResolverPresent = fs.existsSync(ENGINE_RESOLVER_PATH);
  const freshnessState = !manifestPresent
    ? 'no-manifest'
    : (manifestStable && engineResolverPresent ? 'fresh' : 'drifted');

  const selectedPolicy = (manifest && manifest.selectedPolicy) || {};
  return {
    schemaVersion: SCHEMA_VERSION,
    hubId,
    capturedAt: new Date().toISOString(),
    flag: classifyFlagState(process.env.SPECKIT_COMPILED_ROUTING),
    manifest: {
      selectedPolicyHash: selectedPolicy.effectivePolicyHash ?? null,
      generation: selectedPolicy.generation ?? null,
      fenceEpoch: (fence && typeof fence.fencingEpoch === 'number') ? fence.fencingEpoch : null,
      // The DECLARED manifest authority, not the flag-adjusted effective one —
      // the flag is captured separately so the two stay distinguishable.
      servingAuthority: (manifest && manifest.servingAuthority) || 'legacy',
      shadowOnly: (manifest && typeof manifest.shadowOnly === 'boolean') ? manifest.shadowOnly : null,
    },
    liveConfigHash: digestAfter,
    freshness: {
      state: freshnessState,
      manifestPresent,
      manifestStableDuringCapture: manifestStable,
      engineResolverPresent,
    },
    // Repo-relative so a snapshot copied to another machine or worktree still
    // names the resolver correctly; an absolute path would be stale on move.
    engineResolverPath: toRepoRel(ENGINE_RESOLVER_PATH),
    parityBaseline: scanParityBaseline(hubId, skillsRoot),
    realModelLast: scanRealModelLast(hubId, skillsRoot),
  };
}

/**
 * Validate a snapshot against the exact V1 field contract.
 *
 * @param {Object} snapshot - Candidate snapshot object.
 * @returns {string[]} Problems; empty when the snapshot conforms.
 */
function validateServingSnapshot(snapshot) {
  const problems = [];
  if (!snapshot || typeof snapshot !== 'object') return ['snapshot is not an object'];
  if (snapshot.schemaVersion !== SCHEMA_VERSION) problems.push(`schemaVersion must be "${SCHEMA_VERSION}"`);
  for (const key of REQUIRED_TOP_KEYS) {
    if (!(key in snapshot)) problems.push(`missing top-level key: ${key}`);
  }
  for (const key of Object.keys(snapshot)) {
    if (!REQUIRED_TOP_KEYS.includes(key)) problems.push(`unexpected top-level key: ${key}`);
  }
  if (snapshot.manifest && typeof snapshot.manifest === 'object') {
    for (const key of REQUIRED_MANIFEST_KEYS) {
      if (!(key in snapshot.manifest)) problems.push(`missing manifest key: ${key}`);
    }
    for (const key of Object.keys(snapshot.manifest)) {
      if (!REQUIRED_MANIFEST_KEYS.includes(key)) problems.push(`unexpected manifest key: ${key}`);
    }
  } else {
    problems.push('manifest must be an object');
  }
  if (typeof snapshot.hubId !== 'string' || !snapshot.hubId) problems.push('hubId must be a non-empty string');
  if (typeof snapshot.capturedAt !== 'string') problems.push('capturedAt must be an ISO-8601 string');
  if (typeof snapshot.engineResolverPath !== 'string' || path.isAbsolute(snapshot.engineResolverPath)) {
    problems.push('engineResolverPath must be a repo-relative string');
  }
  return problems;
}

function fmt(v) { return v === null || v === undefined ? '—' : String(v); }

/**
 * Render the human-readable snapshot view from the snapshot object.
 *
 * @param {Object} s - A serving-snapshot object.
 * @returns {string} Markdown rendered deterministically from the snapshot.
 */
function renderServingSnapshot(s) {
  const lines = [];
  lines.push(`# Serving Snapshot — ${s.hubId}`);
  lines.push('');
  lines.push(`> Rendered from serving-snapshot.json (do not hand-edit). Captured ${fmt(s.capturedAt)}.`);
  lines.push('');
  lines.push('## Live serving state');
  lines.push('');
  lines.push('| Field | Value |');
  lines.push('| ----- | ----- |');
  lines.push(`| Declared authority | ${fmt(s.manifest.servingAuthority)} |`);
  lines.push(`| shadowOnly | ${fmt(s.manifest.shadowOnly)} |`);
  lines.push(`| Selected generation | ${fmt(s.manifest.generation)} |`);
  lines.push(`| Selected policy hash | \`${fmt(s.manifest.selectedPolicyHash)}\` |`);
  lines.push(`| Fence epoch | ${fmt(s.manifest.fenceEpoch)} |`);
  lines.push(`| Flag | \`${fmt(s.flag && s.flag.state)}\` (raw: ${fmt(s.flag && s.flag.raw)}) |`);
  lines.push(`| Live config hash | \`${fmt(s.liveConfigHash)}\` |`);
  lines.push(`| Freshness | ${fmt(s.freshness && s.freshness.state)} |`);
  lines.push(`| Engine resolver | \`${fmt(s.engineResolverPath)}\` |`);
  lines.push('');
  lines.push('## Parity anchors');
  lines.push('');
  const pb = s.parityBaseline || {};
  lines.push(`- Parity baseline (\`${fmt(pb.label)}\`): ${pb.present ? `present · verdict ${fmt(pb.verdict)} · digest \`${fmt(pb.reportDigest)}\`` : 'not yet archived'}`);
  if (s.realModelLast) {
    const r = s.realModelLast;
    lines.push(`- Last real-model run (\`${fmt(r.label)}\`): verdict ${fmt(r.verdict)} · model ${fmt(r.model)} · captured ${fmt(r.capturedAt)}`);
  } else {
    lines.push('- Last real-model run: none archived yet');
  }
  lines.push('');
  return lines.join('\n');
}

function knownHubs() {
  try {
    return fs.readdirSync(ACTIVE_ACTIVATION_ROOT, { withFileTypes: true })
      .filter((d) => d.isDirectory()).map((d) => d.name).sort();
  } catch { return []; }
}

function writeSnapshot(snapshot, outDir, pretty) {
  fs.mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, 'serving-snapshot.json');
  const mdPath = path.join(outDir, 'serving-snapshot.md');
  fs.writeFileSync(jsonPath, JSON.stringify(snapshot, null, pretty ? 2 : 0));
  fs.writeFileSync(mdPath, renderServingSnapshot(snapshot));
  return { jsonPath, mdPath };
}

function main() {
  const args = require(path.join(
    REPO_ROOT, '.opencode', 'skills', 'system-deep-loop', 'deep-improvement', 'scripts', 'skill-benchmark', '_args.cjs',
  )).parse(process.argv.slice(2));

  const hubs = args.all ? knownHubs() : (args.hub ? [args.hub] : []);
  if (!hubs.length) {
    process.stderr.write('usage: render-serving-snapshot.cjs --hub <hubId> | --all [--out <dir>] [--validate] [--pretty]\n');
    process.exit(2);
  }

  let hadInvalid = false;
  const outRoot = args.out ? path.resolve(String(args.out)) : null;
  for (const hubId of hubs) {
    const snapshot = captureServingSnapshot(hubId, { skillsRoot: args['skills-root'] ? path.resolve(String(args['skills-root'])) : undefined });
    if (args.validate) {
      const problems = validateServingSnapshot(snapshot);
      if (problems.length) { hadInvalid = true; process.stderr.write(`INVALID ${hubId}: ${problems.join('; ')}\n`); }
      else process.stdout.write(`VALID ${hubId}\n`);
    }
    if (outRoot) {
      const { jsonPath } = writeSnapshot(snapshot, args.all ? path.join(outRoot, hubId) : outRoot, args.pretty);
      process.stdout.write(`wrote ${jsonPath}\n`);
    } else if (!args.validate) {
      process.stdout.write(`${JSON.stringify(snapshot, null, args.pretty ? 2 : 0)}\n`);
    }
  }
  process.exit(hadInvalid ? 1 : 0);
}

if (require.main === module) {
  try { main(); } catch (e) { process.stderr.write(`SNAPSHOT FAILED: ${e && e.message}\n`); process.exit(1); }
}

module.exports = {
  REPO_ROOT,
  compiledRoutingArchiveRoot,
  RUNTIME_ROOT,
  ACTIVE_ACTIVATION_ROOT,
  ENGINE_RESOLVER_PATH,
  DEFAULT_SKILLS_ROOT,
  SCHEMA_VERSION,
  sha256,
  toRepoRel,
  assertActiveManifestSource,
  activeManifestPath,
  readManifestDigest,
  captureServingSnapshot,
  validateServingSnapshot,
  renderServingSnapshot,
  knownHubs,
};
