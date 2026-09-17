// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ rollback-candidate — restore accepted candidate target                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { readVerifiedReceipt } = require('./promotion-receipts.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_BRANCH_PRESERVATION_POLICY = 'preserve-on-failure';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (const entry of argv) {
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonc(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ''));
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function appendJsonl(filePath, data) {
  ensureParent(filePath);
  fs.appendFileSync(filePath, `${JSON.stringify(data)}\n`, 'utf8');
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function currentGitBranch() {
  try {
    const branch = execFileSync('git', ['branch', '--show-current'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return branch || null;
  } catch (error) {
    return null;
  }
}

function resolveAllowedCanonicalTarget(manifestPath) {
  const manifest = readJsonc(manifestPath);
  const canonicalTargets = (manifest.targets || [])
    .filter((target) => target.classification === 'canonical')
    .map((target) => target.path);
  if (canonicalTargets.length !== 1) {
    throw new Error(`Cannot roll back: expected exactly one canonical target in manifest, found ${canonicalTargets.length}`);
  }
  return canonicalTargets[0];
}

// Defense-in-depth on top of the target===config.target / target===manifest
// canonical-target equality gates: even if config/manifest are generated or
// pointed at the wrong path, the copyFileSync restore below must not be able
// to land outside the repo's real agent/skill target roots.

const DEFAULT_ALLOWED_TARGET_ROOTS = Object.freeze([
  '.opencode/agents',
  '.claude/agents',
  '.opencode/skills',
]);

// Resolve symlinks for whatever prefix of candidatePath already exists on
// disk, then re-append the not-yet-created tail verbatim (a path segment
// that doesn't exist yet cannot itself be a symlink escape).
function realpathOrPlanned(candidatePath) {
  const absolute = path.resolve(candidatePath);
  if (fs.existsSync(absolute)) {
    return fs.realpathSync(absolute);
  }
  const tail = [];
  let current = absolute;
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) {
      return absolute;
    }
    tail.unshift(path.basename(current));
    current = parent;
  }
  return path.join(fs.realpathSync(current), ...tail);
}

// Throws (fail closed) when targetPath does not resolve under one of the
// default allowed roots or an explicit `config.promotion.allowedTargetRoots`
// allowlist entry.
function assertWithinAllowedRoots(targetPath, config) {
  const configuredRoots = Array.isArray(config?.promotion?.allowedTargetRoots)
    ? config.promotion.allowedTargetRoots
    : [];
  const roots = [...DEFAULT_ALLOWED_TARGET_ROOTS, ...configuredRoots].map((root) => {
    const absoluteRoot = path.resolve(root);
    try {
      return fs.realpathSync(absoluteRoot);
    } catch (error) {
      return absoluteRoot;
    }
  });
  const resolvedTarget = realpathOrPlanned(targetPath);
  const contained = roots.some(
    (root) => resolvedTarget === root || resolvedTarget.startsWith(`${root}${path.sep}`),
  );
  if (!contained) {
    throw new Error(
      `Cannot roll back: target ${targetPath} resolves outside the allowed target roots (${roots.join(', ')})`,
    );
  }
}

function resolveEventLogPath(args, config) {
  return args['event-log']
    || args['state-file']
    || config?.promotion?.eventLog
    || config?.journal?.path
    || null;
}

function resolvePreservedBranch(args, config, acceptedState) {
  const explicitBranch = args['preserved-branch']
    || args.branch
    || acceptedState?.preservedBranch
    || config?.promotion?.preservedBranch;
  if (explicitBranch && explicitBranch !== true) {
    return explicitBranch;
  }
  return currentGitBranch();
}

function appendRollbackEvent(eventLogPath, details) {
  if (!eventLogPath) {
    return;
  }
  appendJsonl(eventLogPath, {
    type: 'rollback_result',
    eventType: 'rollback_result',
    timestamp: new Date().toISOString(),
    ...details,
  });
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

// The acceptance file rollback reads is a bare mutable JSON with no
// authenticity check of its own, so a forged or stale copy could carry
// fabricated hash fields the guard below would otherwise trust outright.
// promote-candidate.cjs writes a sidecar receipt at accept time
// (createAcceptanceReceipt) binding the acceptance file's content hash and
// its candidate/target identity; this mirrors the same check promotion's
// ship phase already runs (assertShipPreconditions) so rollback trusts the
// acceptance file's fields only when they still match what was recorded at
// accept time.
function assertAcceptanceReceipt(acceptanceFilePath, acceptedState) {
  const receiptPath = `${acceptanceFilePath}.receipt.json`;
  if (!fs.existsSync(receiptPath)) {
    fail('Cannot roll back: acceptance receipt not found; the acceptance file may have been forged');
  }
  let receipt;
  try {
    receipt = readVerifiedReceipt(receiptPath, 'promotion-acceptance');
  } catch (error) {
    fail(`Cannot roll back: acceptance receipt is not authentic: ${error.message}`);
    return;
  }
  if (receipt.acceptance?.state?.path !== acceptanceFilePath
    || receipt.acceptance?.state?.hash !== sha256File(acceptanceFilePath)) {
    fail('Cannot roll back: acceptance file has been modified since the receipt was issued');
  }
  if (receipt.binding?.target?.path !== acceptedState.target
    || receipt.binding?.candidate?.path !== acceptedState.candidate) {
    fail('Cannot roll back: acceptance receipt does not match the acceptance file target/candidate');
  }
  if (receipt.acceptance?.preAcceptBackup?.path !== acceptedState.preAcceptBackupPath
    || receipt.acceptance?.preAcceptBackup?.hash !== acceptedState.preAcceptTargetHash
    || receipt.acceptance?.candidateSnapshot?.path !== acceptedState.candidateSnapshotPath
    || receipt.acceptance?.candidateSnapshot?.hash !== acceptedState.candidateHash) {
    fail('Cannot roll back: acceptance receipt does not match the recorded snapshots');
  }
  return receipt;
}

function assertRollbackHashGuard(receipt, target, backup) {
  if (sha256File(backup) !== receipt.acceptance.preAcceptBackup.hash) {
    fail('Cannot roll back: backup file hash does not match the accepted pre-acceptance target hash');
  }

  if (!fs.existsSync(target)) {
    fail(`Cannot roll back: target file not found for hash verification: ${target}`);
  }

  const currentTargetHash = sha256File(target);
  // Rollback must target the promoted candidate so a stale pre-acceptance target
  // cannot authorize restoration over the wrong canonical state.
  if (currentTargetHash !== receipt.acceptance.candidateSnapshot.hash) {
    fail('Cannot roll back: unexpected canonical target state; expected accepted candidate');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const acceptanceFilePath = args['acceptance-file'];
  if (!acceptanceFilePath) {
    process.stderr.write('Usage: node rollback-candidate.cjs --acceptance-file=... [--event-log=...]\n');
    process.exit(2);
  }
  const acceptedState = readJson(acceptanceFilePath);
  const acceptanceReceipt = assertAcceptanceReceipt(acceptanceFilePath, acceptedState);
  const target = args.target || acceptedState?.target;
  const backup = args.backup || acceptedState?.preAcceptBackupPath;
  const configPath = args.config || acceptedState?.configPath;
  const manifestPath = args.manifest || acceptedState?.manifestPath;

  if (!target || !backup || !configPath || !manifestPath) {
    process.stderr.write('Usage: node rollback-candidate.cjs --acceptance-file=... [--event-log=...]\n');
    process.exit(2);
  }

  const config = readJson(configPath);
  const eventLogPath = resolveEventLogPath(args, config);
  const preservedBranch = resolvePreservedBranch(args, config, acceptedState);
  const branchPreservationPolicy = acceptedState?.branchPreservationPolicy
    || config?.branchPreservationPolicy
    || DEFAULT_BRANCH_PRESERVATION_POLICY;

  let allowedCanonicalTarget;
  try {
    allowedCanonicalTarget = resolveAllowedCanonicalTarget(manifestPath);
  } catch (error) {
    fail(error.message);
  }

  if (config?.target && target !== config.target) {
    fail(`Cannot roll back: target ${target} does not match runtime config target ${config.target}`);
  }

  if (target !== allowedCanonicalTarget) {
    fail(`Cannot roll back: target ${target} is not the single allowed canonical target ${allowedCanonicalTarget}`);
  }

  try {
    assertWithinAllowedRoots(target, config);
    assertWithinAllowedRoots(backup, config);
    assertWithinAllowedRoots(acceptanceFilePath, config);
    if (eventLogPath) assertWithinAllowedRoots(eventLogPath, config);
  } catch (error) {
    fail(error.message);
  }

  if (!fs.existsSync(backup)) {
    fail(`Cannot roll back: backup file not found: ${backup}`);
  }

  assertRollbackHashGuard(acceptanceReceipt, target, backup);

  ensureParent(target);
  fs.copyFileSync(backup, target);

  const result = {
    status: 'rolled_back',
    target,
    backup,
    acceptanceFile: args['acceptance-file'] || null,
    preservedBranch: preservedBranch || null,
    branchPreservationPolicy,
  };
  appendRollbackEvent(eventLogPath, result);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
