#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Style Library CLI                                                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  buildManifest,
  diffManifests,
  loadManifest,
  serializeManifest,
  writeManifestAtomic,
} from './manifest.mjs';
import { applyEligibility } from './eligibility.mjs';
import { rankEligibleStyles } from './rank-fts.mjs';
import { assembleCandidateCards } from './cards.mjs';
import { bindHydrationManifest, hydrateBoundStyle } from './hydrate.mjs';
import {
  dispatchStyleHydrate,
  dispatchStyleQuery,
} from './persistent-adapter.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ENGINE_ROOT = path.dirname(fileURLToPath(import.meta.url));
export const CORPUS_ROOT = path.resolve(ENGINE_ROOT, '..');
export const MANIFEST_PATH = path.join(CORPUS_ROOT, '_retrieval-manifest.json');

// ─────────────────────────────────────────────────────────────────────────────
// 3. INPUT AND OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function writeJson(value, stream = process.stdout) {
  stream.write(`${JSON.stringify(value, null, 2)}\n`);
}

function optionValue(argumentsList, name) {
  const index = argumentsList.indexOf(name);
  return index === -1 ? null : argumentsList[index + 1] ?? null;
}

async function readStandardInput() {
  if (process.stdin.isTTY) return '';
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) input += chunk;
  return input;
}

async function readRequest(argumentsList) {
  const inline = optionValue(argumentsList, '--request');
  if (inline) return JSON.parse(inline);
  const requestFile = optionValue(argumentsList, '--file');
  if (requestFile) return JSON.parse(await readFile(requestFile, 'utf8'));
  const standardInput = await readStandardInput();
  if (standardInput.trim()) return JSON.parse(standardInput);
  return {};
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. BUILD COMMAND
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build or check the canonical retrieval manifest.
 *
 * @param {string[]} argumentsList - Build flags.
 * @param {Object} [options] - Overridable paths for isolated fixtures.
 * @returns {Promise<{ok:boolean,mode:string,recordCount:number,diff:Object}>} Result summary.
 */
export async function runBuild(argumentsList, options = {}) {
  const corpusRoot = options.corpusRoot ?? CORPUS_ROOT;
  const manifestPath = options.manifestPath
    ?? path.join(corpusRoot, '_retrieval-manifest.json');
  const isWrite = argumentsList.includes('--write');
  const isCheck = argumentsList.includes('--check');
  if (isWrite === isCheck) {
    const error = new Error('Build requires exactly one of --write or --check.');
    error.code = 'invalid-arguments';
    throw error;
  }

  const committed = await loadManifest(manifestPath, { corpusRoot });
  const generated = await buildManifest(corpusRoot, {
    previousManifest: isWrite ? committed : null,
  });
  const diff = diffManifests(committed, generated);
  if (isWrite) {
    await writeManifestAtomic(manifestPath, generated);
    return { ok: true, mode: 'write', recordCount: generated.recordCount, diff };
  }

  let committedBytes = null;
  try {
    committedBytes = await readFile(manifestPath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const ok = committedBytes === serializeManifest(generated);
  return { ok, mode: 'check', recordCount: generated.recordCount, diff };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. QUERY AND HYDRATE COMMANDS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Apply deterministic membership before ranking and return compact cards.
 *
 * @param {Object} request - Generic retrieval request.
 * @param {Object} [options] - Overridable paths for isolated fixtures.
 * @returns {Promise<Object>} Query result with at most five eligible cards.
 */
async function runLegacyQuery(request, options = {}) {
  const corpusRoot = options.corpusRoot ?? CORPUS_ROOT;
  const manifestPath = options.manifestPath
    ?? path.join(corpusRoot, '_retrieval-manifest.json');
  const manifest = await loadManifest(manifestPath, { corpusRoot });
  if (!manifest) {
    const error = new Error('Retrieval manifest is missing. Run build --write first.');
    error.code = 'manifest-missing';
    throw error;
  }
  const liveManifest = await buildManifest(corpusRoot);
  if (serializeManifest(liveManifest) !== serializeManifest(manifest)) {
    const error = new Error('Retrieval manifest does not match the current corpus.');
    error.code = 'manifest-stale';
    throw error;
  }

  const eligibility = applyEligibility(manifest.styles, request);
  const ranking = await rankEligibleStyles(eligibility.eligible, request, {
    corpusRoot,
    generationHash: manifest.generationHash,
    useFts: request.useFts,
    acceleratorGenerationHash: request.acceleratorGenerationHash,
    scanLimits: options.scanLimits,
  });
  const cards = assembleCandidateCards(ranking.ranked, manifest.generationHash, request);
  return {
    ok: true,
    generationHash: manifest.generationHash,
    degraded: ranking.degraded,
    rankingMode: ranking.rankingMode,
    eligibility: {
      eligibleCount: eligibility.eligible.length,
      rejectedCount: eligibility.rejected.length,
    },
    cards,
  };
}

/**
 * Hydrate a selected card under the checked manifest and live generation guard.
 *
 * @param {Object} request - Hydration request.
 * @param {Object} [options] - Overridable paths for isolated fixtures.
 * @returns {Promise<Object>} Hydration result or refusal.
 */
async function runLegacyHydrate(request, options = {}) {
  const corpusRoot = options.corpusRoot ?? CORPUS_ROOT;
  const manifestPath = options.manifestPath
    ?? path.join(corpusRoot, '_retrieval-manifest.json');
  const manifest = await loadManifest(manifestPath, { corpusRoot });
  if (!manifest) return { ok: false, error: 'manifest-missing' };
  const bound = await bindHydrationManifest(manifest, request, { corpusRoot });
  if (!bound.ok) return bound;
  return hydrateBoundStyle(bound.binding, { corpusRoot });
}

/**
 * Query through the legacy-default database migration adapter.
 *
 * @param {Object} request - Generic retrieval request.
 * @param {Object} [options] - Paths and explicit adapter mode.
 * @returns {Promise<Object>} Query result preserving the legacy card contract.
 */
export function runQuery(request, options = {}) {
  return dispatchStyleQuery(
    request,
    { corpusRoot: options.corpusRoot ?? CORPUS_ROOT, ...options },
    runLegacyQuery,
  );
}

/**
 * Hydrate through the legacy-default database migration adapter.
 *
 * @param {Object} request - Existing hydration request.
 * @param {Object} [options] - Paths and explicit adapter mode.
 * @returns {Promise<Object>} Existing hydration result or refusal.
 */
export function runHydrate(request, options = {}) {
  return dispatchStyleHydrate(
    request,
    { corpusRoot: options.corpusRoot ?? CORPUS_ROOT, ...options },
    runLegacyHydrate,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI DISPATCH
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dispatch the style-library command line interface.
 *
 * @param {string[]} argumentsList - CLI arguments after the executable path.
 * @returns {Promise<number>} Process exit code.
 */
export async function runCli(argumentsList = process.argv.slice(2)) {
  const [command, ...commandArguments] = argumentsList;
  if (command === 'build') {
    const result = await runBuild(commandArguments);
    writeJson(result);
    return result.ok ? 0 : 1;
  }
  if (command === 'query') {
    const result = await runQuery(await readRequest(commandArguments), {
      styleDatabaseMode: optionValue(commandArguments, '--backend') ?? undefined,
      databasePath: optionValue(commandArguments, '--database') ?? undefined,
    });
    writeJson(result);
    return 0;
  }
  if (command === 'hydrate') {
    const result = await runHydrate(await readRequest(commandArguments), {
      styleDatabaseMode: optionValue(commandArguments, '--backend') ?? undefined,
      databasePath: optionValue(commandArguments, '--database') ?? undefined,
    });
    writeJson(result);
    return result.ok ? 0 : 1;
  }
  const error = new Error('Usage: style-library.mjs <build|query|hydrate> [options]');
  error.code = 'invalid-arguments';
  throw error;
}

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectExecution) {
  try {
    process.exitCode = await runCli();
  } catch (error) {
    writeJson({
      ok: false,
      error: error.code ?? 'internal-error',
      message: error.message,
    }, process.stderr);
    process.exitCode = 1;
  }
}
