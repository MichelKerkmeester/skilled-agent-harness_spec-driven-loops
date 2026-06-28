// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ rollback-candidate — restore accepted candidate target                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

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

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const acceptedState = args['acceptance-file'] ? readJson(args['acceptance-file']) : null;
  const target = args.target || acceptedState?.target;
  const backup = args.backup || acceptedState?.preAcceptBackupPath;
  const configPath = args.config || acceptedState?.configPath;
  const manifestPath = args.manifest || acceptedState?.manifestPath;

  if (!target || !backup || !configPath || !manifestPath) {
    process.stderr.write('Usage: node rollback-candidate.cjs --target=... --backup=... --config=... --manifest=... [--acceptance-file=...] [--event-log=...]\n');
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

  if (!fs.existsSync(backup)) {
    fail(`Cannot roll back: backup file not found: ${backup}`);
  }

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
