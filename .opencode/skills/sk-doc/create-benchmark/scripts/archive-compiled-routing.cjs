#!/usr/bin/env node
'use strict';

// Durable, fail-closed archiver for a compiled-routing Lane C report pair.
//
// A Lane C compiled-parity run otherwise writes only to a caller-supplied
// outputs directory: a real-model run either pollutes the parity directory or
// vanishes once its temporary output is discarded, and a shipped report carries
// an absolute checkout path that is stale the moment the file is read from a
// different worktree. This archiver gives compiled-routing evidence a durable
// home — `<hub>/benchmark/compiled-routing/<run-label>/` — that:
//
//   - fails closed on an existing run-label (never a silent overwrite),
//   - is gated on the ACTIVE serving manifest and aborts if that manifest
//     changes mid-archive (never attributes a shifted decision),
//   - refuses a `006-parent-hub-rollout` shadow-candidate manifest source,
//   - rewrites the absolute checkout path into repo-relative provenance so the
//     archived pair stays valid when copied off the machine that produced it,
//   - and stamps a full execution-context block so a reader can tell which
//     subject and which serving generation produced it.
//
// It never edits the frozen scorer trio and never writes the frozen `baseline`
// label: new evidence is always an additive sibling run-label.
//
// Usage:
//   archive-compiled-routing.cjs --hub <hubId> --run-label <label> --report <report.json>
//     [--skills-root <path>] [--activation-root <path>] [--execution-context <json>]

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const snap = require('./render-serving-snapshot.cjs');
const { renderReport } = require(path.join(
  snap.REPO_ROOT,
  '.opencode', 'skills', 'system-deep-loop', 'deep-improvement', 'scripts', 'skill-benchmark', 'build-report.cjs',
));
const { classifyFlagState } = require(path.join(
  snap.REPO_ROOT,
  '.opencode', 'skills', 'system-deep-loop', 'deep-improvement', 'scripts', 'skill-benchmark', 'compiled-routing-parity.cjs',
));

const ENGINE_RESOLVER_PATH = path.join(snap.RUNTIME_ROOT, '011-runtime-engine', 'lib', 'resolve.cjs');
const SERVING_CLOSURE_PATH = path.join(snap.RUNTIME_ROOT, 'serving-closure.manifest.json');

const RUN_LABEL_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

function bestEffortGitRevision() {
  try {
    return execFileSync('git', ['-C', snap.REPO_ROOT, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim() || null;
  } catch { return null; }
}

function collectScenarioIds(report) {
  const ids = new Set();
  const compiledRows = (report.compiledRouting && Array.isArray(report.compiledRouting.rows)) ? report.compiledRouting.rows : [];
  for (const row of compiledRows) { if (row && row.scenarioId) ids.add(row.scenarioId); }
  if (!ids.size) {
    for (const row of (Array.isArray(report.scenarioRows) ? report.scenarioRows : [])) {
      if (row && row.scenarioId) ids.add(row.scenarioId);
    }
  }
  return [...ids];
}

/**
 * Build the execution-context block persisted on every archived artifact,
 * merging any caller-supplied context over the derived defaults. Enough to
 * prove which subject, model, flag, and serving generation produced the run.
 *
 * @param {Object} report - The source report being archived.
 * @param {string|null} manifestDigest - Digest of the active manifest.
 * @param {Object} supplied - Caller-supplied execution-context overrides.
 * @returns {Object} The execution-context block.
 */
function buildExecutionContext(report, manifestDigest, supplied) {
  let runtimeDigest = null;
  try { runtimeDigest = snap.sha256(fs.readFileSync(SERVING_CLOSURE_PATH)); } catch { runtimeDigest = null; }
  return {
    executor: supplied.executor ?? report.executor ?? null,
    model: supplied.model ?? process.env.SKILL_BENCH_OPENCODE_MODEL ?? null,
    variant: supplied.variant ?? process.env.SKILL_BENCH_OPENCODE_VARIANT ?? null,
    cliVersion: supplied.cliVersion ?? process.version,
    traceMode: report.traceMode ?? null,
    flagState: classifyFlagState(process.env.SPECKIT_COMPILED_ROUTING).state,
    runtimeDigest,
    manifestDigest,
    scenarioIds: supplied.scenarioIds ?? collectScenarioIds(report),
    runRevision: supplied.runRevision ?? bestEffortGitRevision(),
  };
}

/**
 * Rewrite a report's provenance from an absolute checkout path to a
 * repo-relative form, dropping the absolute `targetSkill.root` entirely so the
 * archived copy carries no path that is valid only on the machine that produced
 * it. Mutates and returns the passed clone.
 *
 * @param {Object} report - A CLONE of the source report (mutated in place).
 * @param {Object} ctx - Provenance inputs (digests, manifest path, capturedAt).
 * @returns {Object} The rewritten report.
 */
function rewriteProvenance(report, ctx) {
  const absRoot = report.targetSkill && report.targetSkill.root;
  const rootRel = absRoot ? path.relative(snap.REPO_ROOT, absRoot).split(path.sep).join('/') : null;
  if (report.targetSkill) {
    report.targetSkill = { id: report.targetSkill.id, rootRel };
  }
  report.provenance = {
    rootRel,
    capturedAt: ctx.capturedAt,
    manifestDigest: ctx.manifestDigest,
    activationManifestRel: ctx.activationManifestRel,
    engineResolverPath: snap.toRepoRel(ENGINE_RESOLVER_PATH),
    sourceReportDigest: ctx.sourceReportDigest,
  };
  return report;
}

/**
 * Archive a compiled-routing report pair under the durable convention.
 *
 * @param {Object} params - Archive inputs.
 * @param {string} params.hubId - Hub the run measured.
 * @param {string} params.runLabel - Immutable sibling run-label (never `baseline`).
 * @param {Object} [params.report] - Report object (or pass reportPath).
 * @param {string} [params.reportPath] - Path to the source report.json.
 * @param {string} [params.skillsRoot] - Skills tree root (defaults to the repo skills dir).
 * @param {string} [params.activationRoot] - Active-manifest root (defaults to live 010).
 * @param {Object} [params.executionContext] - Caller-supplied context overrides.
 * @param {Function} [params.onBeforeCommit] - Test seam invoked after content is
 *   prepared and before the pre-commit manifest re-read (models a mid-run change).
 * @returns {{archivedDir:string, jsonPath:string, mdPath:string, manifestDigest:string}}
 * @throws {Error} With `err.code` in
 *   {BAD_LABEL, MANIFEST_SOURCE, MANIFEST_MISSING, COLLISION, DRIFT, BAD_REPORT}.
 */
function archiveCompiledRouting(params) {
  const { hubId, runLabel } = params;
  if (!hubId) throw fail('BAD_LABEL', 'hubId is required');
  if (!runLabel || !RUN_LABEL_RE.test(runLabel)) throw fail('BAD_LABEL', `run-label must match ${RUN_LABEL_RE} (got "${runLabel}")`);
  // The frozen before-anchor is never repurposed; new evidence is a sibling.
  if (runLabel === 'baseline') throw fail('BAD_LABEL', 'the frozen `baseline` label is never written by this convention');

  const activationRoot = params.activationRoot || snap.ACTIVE_ACTIVATION_ROOT;
  snap.assertActiveManifestSource(activationRoot);
  const skillsRoot = params.skillsRoot || snap.DEFAULT_SKILLS_ROOT;

  const manifestPath = snap.activeManifestPath(hubId, activationRoot);
  const digestBefore = snap.readManifestDigest(manifestPath);
  if (digestBefore === null) throw fail('MANIFEST_MISSING', `no active serving manifest for ${hubId} at ${manifestPath}`);

  const targetDir = path.join(skillsRoot, hubId, 'benchmark', 'compiled-routing', runLabel);
  const jsonPath = path.join(targetDir, 'skill-benchmark-report.json');
  const mdPath = path.join(targetDir, 'skill-benchmark-report.md');
  // Fail closed: an existing run-label directory OR either half of a prior
  // (possibly partial) pair is treated as occupied. No bytes are written on
  // this path, so a rejected archive never leaves a partial directory behind.
  if (fs.existsSync(targetDir) || fs.existsSync(jsonPath) || fs.existsSync(mdPath)) {
    throw fail('COLLISION', `run-label already exists, refusing to overwrite: ${targetDir}`);
  }

  let sourceBytes;
  let report;
  if (params.report) {
    report = JSON.parse(JSON.stringify(params.report));
    sourceBytes = Buffer.from(JSON.stringify(params.report));
  } else if (params.reportPath) {
    sourceBytes = fs.readFileSync(params.reportPath);
    try { report = JSON.parse(sourceBytes.toString('utf8')); } catch { throw fail('BAD_REPORT', `report is not valid JSON: ${params.reportPath}`); }
  } else {
    throw fail('BAD_REPORT', 'either report or reportPath is required');
  }

  const capturedAt = new Date().toISOString();
  rewriteProvenance(report, {
    capturedAt,
    manifestDigest: digestBefore,
    activationManifestRel: snap.toRepoRel(manifestPath),
    sourceReportDigest: snap.sha256(sourceBytes),
  });
  report.executionContext = buildExecutionContext(report, digestBefore, params.executionContext || {});

  // Prepare both artifacts fully in memory before any write, so a render throw
  // aborts with nothing on disk rather than a half-written pair.
  const jsonOut = `${JSON.stringify(report, null, 2)}\n`;
  const mdOut = renderReport(report);

  if (typeof params.onBeforeCommit === 'function') params.onBeforeCommit();

  // Re-read the active manifest immediately before committing. A digest change
  // means the serving decision moved under us; abort rather than archive a
  // snapshot that no longer matches what serves.
  const digestAfter = snap.readManifestDigest(manifestPath);
  if (digestAfter !== digestBefore) {
    throw fail('DRIFT', `active manifest changed during archive for ${hubId} (before=${digestBefore} after=${digestAfter}); aborted`);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(jsonPath, jsonOut);
  fs.writeFileSync(mdPath, mdOut);
  return { archivedDir: targetDir, jsonPath, mdPath, manifestDigest: digestBefore };
}

const EXIT_BY_CODE = {
  BAD_LABEL: 2,
  BAD_REPORT: 2,
  MANIFEST_SOURCE: 5,
  MANIFEST_MISSING: 6,
  COLLISION: 3,
  DRIFT: 4,
};

function main() {
  const args = require(path.join(
    snap.REPO_ROOT, '.opencode', 'skills', 'system-deep-loop', 'deep-improvement', 'scripts', 'skill-benchmark', '_args.cjs',
  )).parse(process.argv.slice(2));

  if (!args.hub || !args['run-label'] || !args.report) {
    process.stderr.write('usage: archive-compiled-routing.cjs --hub <hubId> --run-label <label> --report <report.json> [--skills-root <path>] [--activation-root <path>] [--execution-context <json>]\n');
    process.exit(2);
  }

  let executionContext = {};
  if (args['execution-context']) {
    try { executionContext = JSON.parse(fs.readFileSync(path.resolve(String(args['execution-context'])), 'utf8')); }
    catch (e) { process.stderr.write(`archive-compiled-routing: bad --execution-context file: ${e.message}\n`); process.exit(2); }
  }

  try {
    const result = archiveCompiledRouting({
      hubId: String(args.hub),
      runLabel: String(args['run-label']),
      reportPath: path.resolve(String(args.report)),
      skillsRoot: args['skills-root'] ? path.resolve(String(args['skills-root'])) : undefined,
      activationRoot: args['activation-root'] ? path.resolve(String(args['activation-root'])) : undefined,
      executionContext,
    });
    process.stdout.write(`archived ${args.hub}/${args['run-label']} -> ${snap.toRepoRel(result.archivedDir)}\n`);
    process.stdout.write(`  report.json -> ${result.jsonPath}\n  report.md   -> ${result.mdPath}\n`);
    process.exit(0);
  } catch (e) {
    process.stderr.write(`archive-compiled-routing: ${e.code || 'ERROR'} — ${e.message}\n`);
    process.exit(EXIT_BY_CODE[e.code] || 1);
  }
}

if (require.main === module) main();

module.exports = { archiveCompiledRouting, rewriteProvenance, buildExecutionContext };
