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
 * Resolve the next lane + slice to check, given each lane's discovered
 * corpus and its already-checked count from the reducer's registry. Lanes
 * are visited in corpus-declaration order, wrapping; a lane whose entire
 * corpus is already checked is skipped without ending the search.
 *
 * @param {Array<Object>} corpusLanes - readCorpus() output
 * @param {Array<Object>} laneEntries - registry.lanes from reduceAlignmentState()
 * @param {number} batchSize
 * @returns {{done:true}|{done:false, laneId:string, authority:string, artifactClass:string, scope:Object, artifactsSlice:Array<Object>, remainingAfterThisSlice:number}}
 */
function resolveNextSlice(corpusLanes, laneEntries, batchSize) {
  const checkedByLane = new Map(laneEntries.map((entry) => [entry.laneId, entry.artifactsChecked]));

  for (const lane of corpusLanes) {
    const totalArtifacts = Array.isArray(lane.artifacts) ? lane.artifacts.length : 0;
    if (totalArtifacts === 0) continue; // NOT_APPLICABLE lane, nothing to slice

    const alreadyChecked = checkedByLane.get(lane.laneId) || 0;
    if (alreadyChecked >= totalArtifacts) continue; // this lane's corpus is exhausted

    const slice = lane.artifacts.slice(alreadyChecked, alreadyChecked + batchSize);
    return {
      done: false,
      laneId: lane.laneId,
      authority: lane.authority,
      artifactClass: lane.artifactClass,
      scope: lane.scope,
      artifactsSlice: slice,
      remainingAfterThisSlice: Math.max(0, totalArtifacts - alreadyChecked - slice.length),
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
  readCorpus,
  resolveNextSlice,
  partitionCorpus,
  main,
};
