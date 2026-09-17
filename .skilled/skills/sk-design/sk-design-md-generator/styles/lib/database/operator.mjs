#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Persistent Style Database Operator                                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { existsSync } from 'node:fs';
import { readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  buildStyleDatabase,
  rollbackStyleDatabase,
} from './indexer.mjs';
import {
  manifestArtifactFiles,
  readManifest,
} from './generation-manifest.mjs';
import {
  DEFAULT_STYLE_DATABASE_PATH,
  STYLE_DATABASE_POINTER_SUFFIX,
  openPublishedStyleDatabase,
  resolvePublishedDatabasePath,
} from './schema.mjs';
import { rebuildVectorProjection } from './vectors.mjs';

/**
 * Read the published manifest's artifact roles and absolute file paths.
 *
 * @param {string} databasePath - Logical database path.
 * @returns {Promise<{roles:string[], paths:string[]}>} Current-manifest artifacts.
 */
async function currentManifestArtifacts(databasePath) {
  const pointerPath = `${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`;
  if (!existsSync(pointerPath)) return { roles: [], paths: [] };
  try {
    const manifest = await readManifest(pointerPath);
    const directory = path.dirname(databasePath);
    return {
      roles: Object.keys(manifest.artifacts).sort(),
      paths: manifestArtifactFiles({ artifacts: manifest.artifacts })
        .map((file) => path.resolve(path.join(directory, file))),
    };
  } catch {
    return { roles: [], paths: [] };
  }
}

function optionValue(argumentsList, name) {
  const index = argumentsList.indexOf(name);
  return index === -1 ? null : argumentsList[index + 1] ?? null;
}

function writeJson(value, stream = process.stdout) {
  stream.write(`${JSON.stringify(value, null, 2)}\n`);
}

async function listGenerationPaths(databasePath) {
  const directory = path.dirname(databasePath);
  const prefix = `${path.basename(databasePath)}.sha256-`;
  const entries = await readdir(directory, { withFileTypes: true });
  const generations = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.startsWith(prefix) || !entry.name.endsWith('.sqlite')) {
      continue;
    }
    const generationPath = path.join(directory, entry.name);
    const info = await stat(generationPath);
    generations.push({ path: generationPath, modifiedAt: info.mtimeMs });
  }
  return generations.sort((left, right) => right.modifiedAt - left.modifiedAt
    || left.path.localeCompare(right.path));
}

/**
 * Report the published generation, rollback candidate, queues, and retained files.
 *
 * @param {Object} [options] - Logical database path.
 * @returns {Promise<Object>} Persistent database status.
 */
export async function getStyleDatabaseStatus(options = {}) {
  const databasePath = options.databasePath ?? DEFAULT_STYLE_DATABASE_PATH;
  const pointerPath = `${databasePath}${STYLE_DATABASE_POINTER_SUFFIX}`;
  const generations = await listGenerationPaths(databasePath);
  if (!existsSync(pointerPath)) {
    return {
      ok: true,
      databasePath,
      published: false,
      currentGenerationPath: null,
      rollbackGenerationPath: generations[0]?.path ?? null,
      retainedGenerationPaths: generations.map((entry) => entry.path),
      vectorJobs: {},
    };
  }
  const currentGenerationPath = resolvePublishedDatabasePath(databasePath);
  const manifestArtifacts = await currentManifestArtifacts(databasePath);
  const database = openPublishedStyleDatabase(databasePath);
  try {
    const generationHash = database.prepare(`
      SELECT generation_hash FROM current_corpus_generation WHERE singleton = 1
    `).get()?.generation_hash ?? null;
    const vectorJobs = Object.fromEntries(database.prepare(`
      SELECT status, COUNT(*) AS count FROM style_vector_jobs GROUP BY status ORDER BY status
    `).all().map((row) => [row.status, Number(row.count)]));
    return {
      ok: true,
      databasePath,
      published: true,
      generationHash,
      currentGenerationPath,
      manifestArtifacts: manifestArtifacts.roles,
      rollbackGenerationPath: generations
        .find((entry) => entry.path !== currentGenerationPath)?.path ?? null,
      retainedGenerationPaths: generations.map((entry) => entry.path),
      vectorJobs,
    };
  } finally {
    database.close();
  }
}

/**
 * Remove generation files except the published file and one rollback target.
 *
 * @param {Object} options - Logical path and explicit retention set.
 * @returns {Promise<Object>} Kept and removed generation paths.
 */
export async function pruneStyleDatabaseGenerations(options) {
  const databasePath = options?.databasePath ?? DEFAULT_STYLE_DATABASE_PATH;
  const currentGenerationPath = options?.currentGenerationPath
    ?? resolvePublishedDatabasePath(databasePath);
  const rollbackGenerationPath = options?.rollbackGenerationPath ?? null;
  const keep = new Set([currentGenerationPath, rollbackGenerationPath]
    .filter(Boolean).map((value) => path.resolve(value)));
  // Protect every artifact the published manifest references, so a generation is
  // retained as a whole unit once it spans more than the SQLite file.
  for (const artifactPath of (await currentManifestArtifacts(databasePath)).paths) {
    keep.add(artifactPath);
  }
  const generations = await listGenerationPaths(databasePath);
  const removed = [];
  for (const generation of generations) {
    if (keep.has(path.resolve(generation.path))) continue;
    await Promise.all(['', '-wal', '-shm'].map((suffix) => (
      rm(`${generation.path}${suffix}`, { force: true })
    )));
    removed.push(generation.path);
  }
  return {
    kept: generations.map((entry) => entry.path)
      .filter((generationPath) => keep.has(path.resolve(generationPath))),
    removed,
  };
}

async function buildAndRetain(options) {
  const databasePath = options.databasePath ?? DEFAULT_STYLE_DATABASE_PATH;
  const before = await getStyleDatabaseStatus({ databasePath });
  const result = await buildStyleDatabase({ ...options, databasePath });
  const retention = await pruneStyleDatabaseGenerations({
    databasePath,
    currentGenerationPath: result.generationDatabasePath,
    rollbackGenerationPath: before.currentGenerationPath,
  });
  return { ...result, action: 'build', retention };
}

async function switchGeneration(action, options) {
  const databasePath = options.databasePath ?? DEFAULT_STYLE_DATABASE_PATH;
  const before = await getStyleDatabaseStatus({ databasePath });
  const generationDatabasePath = options.generationDatabasePath
    ?? before.rollbackGenerationPath;
  if (!generationDatabasePath) {
    const error = new Error('No retained rollback generation is available.');
    error.code = 'rollback-generation-unavailable';
    throw error;
  }
  const result = await rollbackStyleDatabase({ databasePath, generationDatabasePath });
  const retention = await pruneStyleDatabaseGenerations({
    databasePath,
    currentGenerationPath: generationDatabasePath,
    rollbackGenerationPath: before.currentGenerationPath,
  });
  return { ...result, action, retention };
}

async function repairVectors(options) {
  if (!options.profileId) {
    const error = new Error('Vector repair requires an embedding profile.');
    error.code = 'invalid-arguments';
    throw error;
  }
  const databasePath = options.databasePath ?? DEFAULT_STYLE_DATABASE_PATH;
  const database = openPublishedStyleDatabase(databasePath);
  try {
    return {
      ok: true,
      action: 'repair',
      ...rebuildVectorProjection(database, options.profileId),
    };
  } finally {
    database.close();
  }
}

/**
 * Dispatch the persistent style database operator command surface.
 *
 * @param {string[]} argumentsList - Command and flags.
 * @returns {Promise<Object>} Structured operator result.
 */
export async function runStyleDatabaseOperator(argumentsList = process.argv.slice(2)) {
  const [command, ...commandArguments] = argumentsList;
  const databasePath = optionValue(commandArguments, '--database')
    ?? DEFAULT_STYLE_DATABASE_PATH;
  if (command === 'status') return getStyleDatabaseStatus({ databasePath });
  if (command === 'build') {
    const corpusRoot = optionValue(commandArguments, '--corpus');
    if (!corpusRoot) {
      const error = new Error('Build requires --corpus.');
      error.code = 'invalid-arguments';
      throw error;
    }
    return buildAndRetain({ corpusRoot, databasePath, corpusWalkMode: 'migration' });
  }
  if (command === 'cutover') {
    const generationDatabasePath = optionValue(commandArguments, '--generation');
    if (!generationDatabasePath) {
      const error = new Error('Cutover requires --generation.');
      error.code = 'invalid-arguments';
      throw error;
    }
    return switchGeneration('cutover', { databasePath, generationDatabasePath });
  }
  if (command === 'rollback') {
    return switchGeneration('rollback', {
      databasePath,
      generationDatabasePath: optionValue(commandArguments, '--generation'),
    });
  }
  if (command === 'repair') {
    return repairVectors({
      databasePath,
      profileId: optionValue(commandArguments, '--profile'),
    });
  }
  const error = new Error(
    'Usage: operator.mjs <status|build|cutover|rollback|repair> [options]',
  );
  error.code = 'invalid-arguments';
  throw error;
}

const isDirectExecution = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectExecution) {
  try {
    writeJson(await runStyleDatabaseOperator());
  } catch (error) {
    writeJson({
      ok: false,
      error: error.code ?? 'internal-error',
      message: error.message,
    }, process.stderr);
    process.exitCode = 1;
  }
}
