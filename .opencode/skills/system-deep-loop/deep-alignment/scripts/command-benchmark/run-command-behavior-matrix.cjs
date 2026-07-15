#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Command Behavior Matrix Scheduler                            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify frozen fixtures, run declared cells, and reconcile them ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '../../../../../..');
const RECONCILIATION_FILE = 'command-behavior-matrix.reconciliation.json';
const RETRY_EXIT = 75;
const OUTPUT_DIRS = ['context', 'review', 'research'];

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token !== '--matrix' && token !== '--out-dir') {
      throw new Error(`Unknown argument: ${token}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${token}`);
    }
    args[token === '--matrix' ? 'matrix' : 'outDir'] = value;
    index += 1;
  }
  if (!args.matrix || !args.outDir) {
    throw new Error('Usage: --matrix <manifest> --out-dir <dir>');
  }
  return args;
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`${label} is not readable JSON: ${error.message}`);
  }
}

function parseScenario(filePath) {
  const markdown = fs.readFileSync(filePath, 'utf8');
  const fenced = markdown.match(/```json\s*([\s\S]*?)```/);
  if (!fenced) throw new Error(`Scenario has no JSON contract: ${filePath}`);
  return JSON.parse(fenced[1]);
}

function resolvePath(base, value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty path`);
  }
  return path.isAbsolute(value) ? path.resolve(value) : path.resolve(base, value);
}

function resolveResultPath(outDir, pointer) {
  const root = path.resolve(outDir);
  const resolved = resolvePath(root, pointer, 'resultPointer');
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`resultPointer escapes the output directory: ${pointer}`);
  }
  return resolved;
}

function snapshotFixtureContentHashes(fixturePath) {
  const hashes = {};

  function visit(currentPath, relativePath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const itemPath = relativePath
        ? `${relativePath}/${entry.name}`
        : entry.name;
      if (entry.isDirectory()) {
        visit(fullPath, itemPath);
      } else if (entry.isFile()) {
        hashes[itemPath] = crypto.createHash('sha256')
          .update(fs.readFileSync(fullPath))
          .digest('hex');
      }
    }
  }

  visit(fixturePath, '');
  return hashes;
}

function compareHashes(expected, actual) {
  const expectedKeys = Object.keys(expected || {}).sort();
  const actualKeys = Object.keys(actual || {}).sort();
  const missing = expectedKeys.filter((key) => !Object.hasOwn(actual, key));
  const unexpected = actualKeys.filter((key) => !Object.hasOwn(expected, key));
  const changed = expectedKeys.filter(
    (key) => Object.hasOwn(actual, key) && expected[key] !== actual[key],
  );
  return { ok: missing.length === 0 && unexpected.length === 0 && changed.length === 0,
    missing, unexpected, changed };
}

function runGit(args) {
  const child = spawnSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
  });
  if (child.error || child.status !== 0) {
    const detail = child.error?.message || child.stderr.trim() || `exit ${child.status}`;
    throw new Error(`git ${args[0]} failed: ${detail}`);
  }
  return child.stdout;
}

function purgeRunOutput(fixturePath) {
  for (const directory of OUTPUT_DIRS) {
    fs.rmSync(path.join(fixturePath, directory), { recursive: true, force: true });
  }
}

function restoreFixture(fixturePath, policy) {
  if (policy === 'verify-only') return;
  if (policy !== 'git') throw new Error(`Unsupported fixture restore policy: ${policy}`);

  const relative = path.relative(REPO_ROOT, fixturePath);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Git fixture is outside the repository: ${fixturePath}`);
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    purgeRunOutput(fixturePath);
    runGit(['reset', '-q', 'HEAD', '--', relative]);
    runGit(['checkout', '-q', '--', relative]);
    runGit(['clean', '-fdq', '--', relative]);
    purgeRunOutput(fixturePath);
    const dirty = runGit(['status', '--porcelain', '--untracked-files=all', '--', relative]).trim();
    if (!dirty) return;
  }
  throw new Error(`Fixture did not return to a clean state: ${relative}`);
}

function validateManifest(manifest) {
  if (manifest?.schemaVersion !== 1) throw new Error('Unsupported manifest schemaVersion');
  if (!manifest.matrixId || typeof manifest.matrixId !== 'string') {
    throw new Error('Manifest matrixId is required');
  }
  if (!manifest.fixtures || typeof manifest.fixtures !== 'object') {
    throw new Error('Manifest fixtures are required');
  }
  if (!Array.isArray(manifest.requiredCells) || manifest.requiredCells.length === 0) {
    throw new Error('Manifest requiredCells must be a non-empty array');
  }

  const ids = new Set();
  for (const cell of manifest.requiredCells) {
    if (!cell.id || ids.has(cell.id)) throw new Error(`Duplicate or missing cell id: ${cell.id}`);
    ids.add(cell.id);
    if (!cell.scenarioId || !cell.scenarioPath || !cell.legName) {
      throw new Error(`Cell ${cell.id} is missing scenario or leg data`);
    }
    if (!Number.isInteger(cell.samples) || cell.samples < 1) {
      throw new Error(`Cell ${cell.id} has an invalid sample count`);
    }
    if (!cell.fixtureRef || !manifest.fixtures[cell.fixtureRef]) {
      throw new Error(`Cell ${cell.id} has an unknown fixtureRef`);
    }
    const hasSkip = cell.skip && typeof cell.skip.reason === 'string';
    const hasResult = typeof cell.resultPointer === 'string';
    if (hasSkip === hasResult) {
      throw new Error(`Cell ${cell.id} must declare exactly one skip or resultPointer`);
    }
  }
}

function verifyFixture(cell, fixtureRecord) {
  const scenarioPath = resolvePath(REPO_ROOT, cell.scenarioPath, 'scenarioPath');
  const fixturePath = resolvePath(REPO_ROOT, fixtureRecord.path, 'fixture path');
  const contract = parseScenario(scenarioPath);
  if (contract.id !== cell.scenarioId) {
    throw new Error(`Scenario id mismatch for ${cell.id}`);
  }
  if (resolvePath(REPO_ROOT, contract.fixture, 'scenario fixture') !== fixturePath) {
    throw new Error(`Scenario fixture mismatch for ${cell.id}`);
  }
  const comparison = compareHashes(
    fixtureRecord.hashes,
    snapshotFixtureContentHashes(fixturePath),
  );
  return { scenarioPath, fixturePath, comparison };
}

function childText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function invokeRunner({ manifest, cell, scenarioPath, outDir }) {
  const runnerPath = resolvePath(REPO_ROOT, manifest.runnerPath, 'runnerPath');
  const resultPath = resolveResultPath(outDir, cell.resultPointer);
  const runnerOutDir = path.dirname(resultPath);
  fs.mkdirSync(runnerOutDir, { recursive: true });

  const expectedName = `${cell.scenarioId}-${cell.legName}.result.json`;
  if (path.basename(resultPath) !== expectedName) {
    throw new Error(`Cell ${cell.id} resultPointer must end with ${expectedName}`);
  }

  const args = [runnerPath, '--scenario', scenarioPath, '--leg', cell.legName,
    '--out-dir', runnerOutDir];
  if (cell.samples > 1) args.push('--samples', String(cell.samples));

  const child = spawnSync(process.execPath, args, {
    cwd: REPO_ROOT,
    env: process.env,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  return {
    child,
    resultPath,
    invocation: [process.execPath, ...args],
  };
}

function writeReconciliation(outDir, reconciliation) {
  fs.mkdirSync(outDir, { recursive: true });
  const finalPath = path.join(outDir, RECONCILIATION_FILE);
  const temporaryPath = `${finalPath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(reconciliation, null, 2)}\n`);
  fs.renameSync(temporaryPath, finalPath);
  return finalPath;
}

function runMatrix({ matrix, outDir }) {
  const matrixPath = resolvePath(process.cwd(), matrix, 'matrix');
  const outputPath = resolvePath(process.cwd(), outDir, 'outDir');
  const manifest = readJson(matrixPath, 'Manifest');
  validateManifest(manifest);

  const records = [];
  for (const cell of manifest.requiredCells) {
    const base = {
      id: cell.id,
      scenarioId: cell.scenarioId,
      legName: cell.legName,
      samples: cell.samples,
    };
    try {
      const fixtureRecord = manifest.fixtures[cell.fixtureRef];
      const verified = verifyFixture(cell, fixtureRecord);
      if (!verified.comparison.ok) {
        records.push({ ...base, state: 'fixture_hash_mismatch',
          fixturePath: fixtureRecord.path, mismatch: verified.comparison });
        console.error(`[matrix] ${cell.id}: fixture hash mismatch`);
        continue;
      }

      if (cell.skip) {
        records.push({ ...base, state: 'skip', skip: cell.skip });
        console.log(`[matrix] ${cell.id}: skip (${cell.skip.code})`);
        continue;
      }

      restoreFixture(verified.fixturePath, fixtureRecord.restorePolicy || 'git');
      const restored = compareHashes(
        fixtureRecord.hashes,
        snapshotFixtureContentHashes(verified.fixturePath),
      );
      if (!restored.ok) {
        records.push({ ...base, state: 'fixture_hash_mismatch',
          fixturePath: fixtureRecord.path, mismatch: restored });
        console.error(`[matrix] ${cell.id}: fixture hash mismatch after restore`);
        continue;
      }

      const run = invokeRunner({ manifest, cell, scenarioPath: verified.scenarioPath,
        outDir: outputPath });
      const stdout = childText(run.child.stdout);
      const stderr = childText(run.child.stderr);
      if (stdout) process.stdout.write(`${stdout}\n`);
      if (stderr) process.stderr.write(`${stderr}\n`);

      if (run.child.status === RETRY_EXIT) {
        records.push({ ...base, state: 'retryable', exitCode: RETRY_EXIT,
          resultPointer: cell.resultPointer, stdout, stderr });
        continue;
      }
      if (run.child.error || run.child.status !== 0) {
        records.push({ ...base, state: 'runner_failure', exitCode: run.child.status,
          error: run.child.error?.message || null, stdout, stderr });
        continue;
      }
      if (!fs.existsSync(run.resultPath)) {
        records.push({ ...base, state: 'missing_result', resultPointer: cell.resultPointer,
          stdout, stderr });
        continue;
      }

      const result = readJson(run.resultPath, `Result for ${cell.id}`);
      if (result.scenarioId !== cell.scenarioId || result.leg !== cell.legName) {
        records.push({ ...base, state: 'result_identity_mismatch',
          resultPointer: cell.resultPointer });
        continue;
      }
      if (cell.samples > 1 && (result.samplesRequested !== cell.samples
          || result.samplesCompleted !== cell.samples)) {
        records.push({ ...base, state: 'sample_count_mismatch',
          resultPointer: cell.resultPointer });
        continue;
      }
      records.push({ ...base, state: 'result', resultPointer: cell.resultPointer });
      console.log(`[matrix] ${cell.id}: result`);
    } catch (error) {
      records.push({ ...base, state: 'scheduler_failure', error: error.message });
      console.error(`[matrix] ${cell.id}: ${error.message}`);
    }
  }

  const resultCount = records.filter(({ state }) => state === 'result').length;
  const skipCount = records.filter(({ state }) => state === 'skip').length;
  const retryableCount = records.filter(({ state }) => state === 'retryable').length;
  const accountedCellCount = resultCount + skipCount;
  const failureCount = records.length - accountedCellCount - retryableCount;
  const requiredCellCount = manifest.requiredCells.length;
  const status = failureCount > 0 || records.length !== requiredCellCount
    ? 'failed'
    : retryableCount > 0
      ? 'retryable'
      : accountedCellCount === requiredCellCount
        ? 'reconciled'
        : 'failed';
  const reconciliation = {
    schemaVersion: 1,
    matrixId: manifest.matrixId,
    manifestPath: matrixPath,
    requiredCellCount,
    accountedCellCount,
    resultCount,
    skipCount,
    retryableCount,
    failureCount,
    status,
    cells: records,
  };
  const reconciliationPath = writeReconciliation(outputPath, reconciliation);
  console.log(`[matrix] ${status}: required=${requiredCellCount} results=${resultCount} `
    + `skips=${skipCount} retryable=${retryableCount} failures=${failureCount}`);
  console.log(`[matrix] reconciliation=${reconciliationPath}`);

  return { exitCode: status === 'reconciled' ? 0 : status === 'retryable' ? RETRY_EXIT : 2,
    reconciliation, reconciliationPath };
}

function main() {
  try {
    const result = runMatrix(parseArgs());
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(`[matrix] ${error.message}`);
    process.exitCode = 2;
  }
}

if (require.main === module) main();

module.exports = {
  RECONCILIATION_FILE,
  compareHashes,
  parseArgs,
  runMatrix,
  snapshotFixtureContentHashes,
  validateManifest,
};
