// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Pinned Differential Oracle                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// Freeze the current retrieval/index output as canonical golden bytes, then
// replay it byte-for-byte after any later change. Snapshots run through the same
// shared canonicalizer production uses, so a golden file can never encode a
// serialization the live code would not emit. Freezing happens before any
// downstream phase touches retrieval, giving every subsequent change a stable,
// pre-change reference to diff against.

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { digest, stableJson } from '../../lib/database/canonical.mjs';
import { indexStyleCorpus } from '../../lib/database/indexer.mjs';
import { queryPersistentStyles } from '../../lib/database/retrieval.mjs';
import { openStyleDatabase } from '../../lib/database/schema.mjs';
import { drainVectorQueue } from '../../lib/database/vectors.mjs';
import { ORACLE_QUERY_SET, ORACLE_VECTOR_PROFILE, oracleEmbedder } from './query-set.mjs';

export const DEFAULT_GOLDEN_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'golden');

const VECTOR_DRAIN_BATCH = 100;

/**
 * Index a corpus and drain deterministic vectors into a query-ready database.
 *
 * The queue drains in bounded batches until it is empty so every active style
 * is embedded, not just the first batch — a small fixture and a large scaled
 * corpus both reach full vector coverage before the vector lane is queried.
 *
 * @param {Object} options - Build inputs.
 * @param {string} options.corpusRoot - Authoritative corpus root.
 * @param {import('node:sqlite').DatabaseSync} [options.database] - Existing connection.
 * @param {boolean} [options.embed=true] - Drain deterministic vectors.
 * @param {Function} [options.embedder=oracleEmbedder] - Deterministic text-to-vector callback.
 * @returns {Promise<import('node:sqlite').DatabaseSync>} Ready database.
 */
export async function buildOracleDatabase({
  corpusRoot,
  database,
  embed = true,
  embedder = oracleEmbedder,
}) {
  const connection = database ?? openStyleDatabase();
  await indexStyleCorpus({
    corpusRoot,
    database: connection,
    corpusWalkMode: 'migration',
    embeddingProfile: ORACLE_VECTOR_PROFILE,
  });
  if (embed) {
    let drained;
    do {
      drained = await drainVectorQueue(connection, {
        profileId: ORACLE_VECTOR_PROFILE.id,
        embedder: async (text) => embedder(text),
        limit: VECTOR_DRAIN_BATCH,
      });
    } while (drained.attempted > 0);
  }
  return connection;
}

/**
 * Run one scenario, including its optional cursor follow-up.
 *
 * @param {import('node:sqlite').DatabaseSync} database - Query database.
 * @param {Object} scenario - Query-set scenario.
 * @returns {Object} Ordered snapshot of the scenario's outputs.
 */
export function snapshotScenario(database, scenario) {
  const result = queryPersistentStyles(scenario.request, { database });
  const snapshot = { name: scenario.name, request: scenario.request, result };
  if (typeof scenario.follow === 'function' && result.nextCursor) {
    snapshot.follow = queryPersistentStyles(scenario.follow(result), { database });
  }
  return snapshot;
}

/**
 * Canonicalize a scenario snapshot into golden bytes and a digest.
 *
 * @param {Object} snapshot - Scenario snapshot.
 * @returns {{name:string, canonical:string, sha256:string}} Canonical capture.
 */
export function canonicalizeSnapshot(snapshot) {
  const canonical = stableJson(snapshot);
  return { name: snapshot.name, canonical, sha256: digest(canonical) };
}

/**
 * Capture the whole query matrix as canonical captures.
 *
 * @param {import('node:sqlite').DatabaseSync} database - Query database.
 * @param {Object[]} [querySet=ORACLE_QUERY_SET] - Scenarios to capture.
 * @returns {Array<{name:string, canonical:string, sha256:string}>} Captures.
 */
export function captureOracle(database, querySet = ORACLE_QUERY_SET) {
  return querySet.map((scenario) => canonicalizeSnapshot(snapshotScenario(database, scenario)));
}

function goldenPathFor(goldenDir, name) {
  return path.join(goldenDir, `${name}.canonical.json`);
}

/**
 * Freeze the query matrix as canonical golden bytes on disk.
 *
 * @param {Object} options - Freeze inputs.
 * @param {import('node:sqlite').DatabaseSync} options.database - Query database.
 * @param {string} [options.goldenDir=DEFAULT_GOLDEN_DIR] - Golden output directory.
 * @param {Object[]} [options.querySet=ORACLE_QUERY_SET] - Scenarios to freeze.
 * @returns {Promise<Array>} The captures written.
 */
export async function freezeOracle({ database, goldenDir = DEFAULT_GOLDEN_DIR, querySet = ORACLE_QUERY_SET }) {
  const captures = captureOracle(database, querySet);
  await mkdir(goldenDir, { recursive: true });
  const index = { version: 1, scenarios: captures.map(({ name, sha256 }) => ({ name, sha256 })) };
  await writeFile(path.join(goldenDir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
  for (const capture of captures) {
    await writeFile(goldenPathFor(goldenDir, capture.name), `${capture.canonical}\n`);
  }
  return captures;
}

/**
 * Replay the query matrix and assert byte-for-byte parity with the golden set.
 *
 * @param {Object} options - Replay inputs.
 * @param {import('node:sqlite').DatabaseSync} options.database - Query database.
 * @param {string} [options.goldenDir=DEFAULT_GOLDEN_DIR] - Golden directory.
 * @param {Object[]} [options.querySet=ORACLE_QUERY_SET] - Scenarios to replay.
 * @returns {Promise<{ok:boolean, mismatches:Object[], captures:Array}>} Replay outcome.
 */
export async function replayOracle({ database, goldenDir = DEFAULT_GOLDEN_DIR, querySet = ORACLE_QUERY_SET }) {
  const captures = captureOracle(database, querySet);
  const mismatches = [];
  for (const capture of captures) {
    let golden;
    try {
      golden = await readFile(goldenPathFor(goldenDir, capture.name), 'utf8');
    } catch {
      mismatches.push({ name: capture.name, reason: 'missing-golden' });
      continue;
    }
    if (golden !== `${capture.canonical}\n`) {
      mismatches.push({ name: capture.name, reason: 'byte-mismatch', sha256: capture.sha256 });
    }
  }
  return { ok: mismatches.length === 0, mismatches, captures };
}

/**
 * List the scenario names a golden directory currently pins.
 *
 * @param {string} [goldenDir=DEFAULT_GOLDEN_DIR] - Golden directory.
 * @returns {Promise<string[]>} Sorted scenario names.
 */
export async function listGoldenScenarios(goldenDir = DEFAULT_GOLDEN_DIR) {
  const entries = await readdir(goldenDir).catch(() => []);
  return entries.filter((name) => name.endsWith('.canonical.json'))
    .map((name) => name.replace('.canonical.json', ''))
    .sort();
}
