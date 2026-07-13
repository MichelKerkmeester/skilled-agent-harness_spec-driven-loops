#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Alignment — ITERATE-state Corpus Partitioning                       ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  --spec-folder P [--batch-size N] [--json]                        ║
// ║ Output: one JSON slice-assignment object on stdout.                      ║
// ║ Exit:   0=ok, 1=script error, 3=input validation error.                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Single-shot "what should the next iteration check?" resolver -- reads the
// DISCOVER-state corpus (deep-alignment-corpus.json) and the reducer's
// per-lane artifactsChecked count, then returns the next lane's next
// unaudited slice, rotating lanes round-robin. Distinct from deep-review's
// fixed four-dimension rotation: deep-alignment's lanes are N-many and
// variable in artifact count, so "next dimension" becomes "next lane with
// remaining unaudited artifacts, in lane-declaration order, wrapping".
//
// This does not dispatch or loop -- it answers one question once per call,
// mirroring check-convergence.cjs's single-shot shape and this hub's other
// runtime scripts. The invoking command workflow calls this once
// per iteration and acts on the answer; the skill's own
// "FORBIDDEN INVOCATION PATTERNS" rules out this script looping itself.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { reduceAlignmentState, laneKey } = require('../../runtime/scripts/reduce-alignment-state.cjs');
const { resolveArtifactRoot } = require('../../runtime/lib/deep-loop/artifact-root.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_BATCH_SIZE = 5;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function inputError(message) {
  const err = new Error(message);
  err.code = 'INPUT_VALIDATION';
  return err;
}

function classifyExitCode(err) {
  return err && typeof err === 'object' && err.code === 'INPUT_VALIDATION' ? 3 : 1;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Read the DISCOVER-state corpus file, keyed by laneId, preserving the
 * lane-declaration order from deep-alignment-corpus.json (round-robin walks
 * this order, not an alphabetical or rediscovered order, so the rotation is
 * stable across calls).
 *
 * @param {string} alignmentDir
 * @returns {Array<{laneId:string, authority:string, artifactClass:string, scope:Object, artifacts:Array<Object>}>}
 */
function readCorpus(alignmentDir) {
  const corpusPath = path.join(alignmentDir, 'deep-alignment-corpus.json');
  if (!fs.existsSync(corpusPath)) {
    throw inputError(`deep-alignment-corpus.json not found under ${alignmentDir} -- DISCOVER has not run yet`);
  }
  const parsed = readJson(corpusPath);
  if (!Array.isArray(parsed.lanes)) {
    throw inputError('deep-alignment-corpus.json must contain a "lanes" array');
  }
  return parsed.lanes;
}

/**
 * The stable identity of one corpus artifact, matching the path string an
 * iteration reports in its artifactsChecked array. `{path}` (paths/globs) and
 * `{path, ref}` (branchRange) both identify by path; a ref-only entry falls
 * back to its ref. An unidentifiable artifact returns null and is treated as
 * never-checked, so a malformed corpus entry is re-offered rather than skipped.
 *
 * @param {Object} artifact
 * @returns {string|null}
 */
function artifactIdentity(artifact) {
  if (artifact && typeof artifact === 'object') {
    if (typeof artifact.path === 'string' && artifact.path) return artifact.path;
    if (typeof artifact.ref === 'string' && artifact.ref) return artifact.ref;
  }
  return null;
}

/**
 * Resolve the next lane + slice to check, given each lane's discovered corpus
 * and the reducer's per-lane progress. Lanes are visited in corpus-declaration
 * order, wrapping; a lane whose entire corpus is already checked is skipped
 * without ending the search.
 *
 * Progress is identity-based when the reducer exposes checkedArtifactIds: the
 * next slice is the corpus artifacts whose identity was not already reported as
 * checked (a set difference), so a duplicate or out-of-order re-check can never
 * advance a numeric cursor past a genuinely-unchecked artifact. When only a bare
 * count is available (checkedArtifactIds null — simple emitters, fixtures), it
 * falls back to the original prefix cursor over the first `artifactsChecked`
 * entries.
 *
 * @param {Array<Object>} corpusLanes - readCorpus() output
 * @param {Array<Object>} laneEntries - registry.lanes from reduceAlignmentState()
 * @param {number} batchSize
 * @returns {{done:true}|{done:false, laneId:string, authority:string, artifactClass:string, scope:Object, artifactsSlice:Array<Object>, remainingAfterThisSlice:number}}
 */
function resolveNextSlice(corpusLanes, laneEntries, batchSize) {
  const entryByLane = new Map(laneEntries.map((entry) => [entry.laneId, entry]));

  for (const lane of corpusLanes) {
    const artifacts = Array.isArray(lane.artifacts) ? lane.artifacts : [];
    if (artifacts.length === 0) continue; // NOT_APPLICABLE lane, nothing to slice

    const entry = entryByLane.get(lane.laneId);
    const checkedIds = entry && Array.isArray(entry.checkedArtifactIds) ? entry.checkedArtifactIds : null;

    let unchecked;
    if (checkedIds) {
      const checkedSet = new Set(checkedIds);
      unchecked = artifacts.filter((artifact) => {
        const id = artifactIdentity(artifact);
        return id === null ? true : !checkedSet.has(id);
      });
    } else {
      const alreadyChecked = entry ? (entry.artifactsChecked || 0) : 0;
      unchecked = artifacts.slice(alreadyChecked);
    }

    if (unchecked.length === 0) continue; // this lane's corpus is exhausted

    const slice = unchecked.slice(0, batchSize);
    return {
      done: false,
      laneId: lane.laneId,
      authority: lane.authority,
      artifactClass: lane.artifactClass,
      // Which adapter module this lane's discover/check runs against. Defaults to
      // the authority's own module; a live-render (or other peer) lane carries an
      // explicit adapter so dispatch loads adapters/<adapter>.cjs, not just
      // adapters/<authority>.cjs.
      adapter: lane.adapter || lane.authority,
      scope: lane.scope,
      artifactsSlice: slice,
      remainingAfterThisSlice: Math.max(0, unchecked.length - slice.length),
    };
  }

  return { done: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {string} specFolder
 * @param {{batchSize?: number}} [options]
 * @returns {Object}
 */
function partitionCorpus(specFolder, options = {}) {
  const batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
  const resolvedSpecFolder = path.resolve(specFolder);
  const { artifactDir: alignmentDir } = resolveArtifactRoot(resolvedSpecFolder, 'alignment');

  const corpusLanes = readCorpus(alignmentDir);
  const { registry } = reduceAlignmentState(resolvedSpecFolder, { write: false });

  return resolveNextSlice(corpusLanes, registry.lanes, batchSize);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CLI
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--spec-folder') { args.specFolder = argv[i + 1]; i += 1; }
    else if (token === '--batch-size') { args.batchSize = Number(argv[i + 1]); i += 1; }
    else if (token === '--json') { args.json = true; }
    else if (token === '--help' || token === '-h') { args.help = true; }
    else { throw inputError(`Unexpected argument: ${token}`); }
  }
  return args;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    process.stdout.write('Usage: partition-corpus.cjs --spec-folder <path> [--batch-size N] [--json]\n');
    return 0;
  }
  if (!args.specFolder) throw inputError('--spec-folder is required');

  const result = partitionCorpus(args.specFolder, {
    batchSize: Number.isFinite(args.batchSize) ? args.batchSize : undefined,
  });

  if (args.json) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else if (result.done) {
    process.stdout.write('done: every lane\'s corpus is fully checked\n');
  } else {
    process.stdout.write(`next: ${result.laneId} (${result.artifactsSlice.length} artifact(s), ${result.remainingAfterThisSlice} remaining after)\n`);
  }
  return 0;
}

if (require.main === module) {
  try {
    process.exit(main());
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(classifyExitCode(err));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DEFAULT_BATCH_SIZE,
  artifactIdentity,
  readCorpus,
  resolveNextSlice,
  partitionCorpus,
  main,
};
