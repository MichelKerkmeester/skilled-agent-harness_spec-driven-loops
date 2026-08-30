#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Process Sweep
// ---------------------------------------------------------------
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { isMainModule } from '../lib/esm-entry.js';
import {
  collectInventory,
  getProcessAncestry,
  hasKnownProjectOwnerMarker,
  redactSensitiveCommand,
  syntheticFixtureSnapshot,
  type ClassifiedProcess,
  type Inventory,
  type PidLockState,
} from './process-memory-harness.js';

export interface SweepPlanRow {
  pid: number;
  ppid: number;
  command: string;
  classification: ClassifiedProcess['classification'];
  eligibleForTermination: boolean;
  rationale: string;
}

export interface SweepPlan {
  inventoryStatus: Inventory['status'];
  inventoryError?: string;
  rows: SweepPlanRow[];
  summary: Record<string, number>;
}

interface PlanSweepOptions {
  selfPid: number;
}

export interface SweepOwnershipEvidence {
  pid: number;
  ownerPid: number;
  launcherPath: string;
  ownerLeasePath: string;
  canonicalDbDir: string;
  ownerLeaseStartedAtMs: number;
  processStartedAtMs: number;
  socketPeerConnected: boolean;
}

export interface ApplySweepOptions {
  selfPid: number;
  enabled?: boolean;
  nowMs?: number;
  startupGraceMs?: number;
  evidenceByPid?: ReadonlyMap<number, SweepOwnershipEvidence>;
  getParentPid?: (pid: number) => number | null;
  getProcessStartTimeMs?: (pid: number) => number | null;
  getSocketPeerConnected?: (pid: number, evidence: SweepOwnershipEvidence) => boolean | null;
  signal?: (pid: number, signal: 'SIGTERM') => boolean;
}

export interface SweepApplyResult extends SweepPlan {
  mode: 'apply';
  dryRun: false;
  appliedPids: number[];
  signals: Array<{ pid: number; signal: 'SIGTERM' }>;
  skipped: Array<{ pid: number; reason: string }>;
  reason?: string;
}

type CliPayload = (SweepPlan & {
  mode: 'plan' | 'fixture';
  dryRun: true;
  note: string;
}) | SweepApplyResult;

const ORPHAN_SWEEP_KILL_SWITCH = 'SPECKIT_SESSION_START_ORPHAN_SWEEP';
const DEFAULT_STARTUP_GRACE_MS = 300000;
const OWNER_LEASE_FILE_NAME = '.spec-memory-owner.json';
const LAUNCHER_PATH_SUFFIX = '.opencode/bin/system-spec-memory-launcher.cjs';

function isSweepEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const value = env[ORPHAN_SWEEP_KILL_SWITCH];
  if (value === undefined) return true;
  return !['0', 'false', 'no', 'off'].includes(value.trim().toLowerCase());
}

function readProcessParentPid(pid: number): number | null {
  try {
    const output = execFileSync('ps', ['-o', 'ppid=', '-p', String(pid)], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    const parentPid = Number.parseInt(output, 10);
    return Number.isInteger(parentPid) && parentPid > 0 ? parentPid : null;
  } catch {
    return null;
  }
}

function readProcessStartTimeMs(pid: number): number | null {
  try {
    const output = execFileSync('ps', ['-o', 'lstart=', '-p', String(pid)], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    const startedAtMs = Date.parse(output);
    return Number.isFinite(startedAtMs) ? startedAtMs : null;
  } catch {
    return null;
  }
}

function readSocketPeerConnected(pid: number, socketPath: string): boolean | null {
  try {
    const isTcp = socketPath.startsWith('tcp://');
    const output = execFileSync('lsof', ['-nP', '-a', '-p', String(pid), isTcp ? '-i' : '-U'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const lines = output.split(/\r?\n/).filter((line) => line && !line.startsWith('COMMAND'));
    const tcpPort = isTcp ? /:(\d+)(?:\/|$)/.exec(socketPath)?.[1] : null;
    const socketLines = socketPath
      ? lines.filter((line) => (isTcp && tcpPort ? line.includes(`:${tcpPort}`) : line.includes(socketPath)))
      : lines;
    return socketLines.some((line) => /->|\(CONNECTED\)|ESTABLISHED/i.test(line));
  } catch {
    return null;
  }
}

function launcherPathFromCommand(command: string): string | null {
  const token = command.split(/\s+/).find((candidate) => candidate.endsWith(LAUNCHER_PATH_SUFFIX));
  return token ? resolve(token) : null;
}

function readOwnershipEvidence(row: SweepPlanRow): SweepOwnershipEvidence | null {
  const launcherPath = launcherPathFromCommand(row.command);
  if (!launcherPath) return null;
  const canonicalDbDir = resolve(join(dirname(launcherPath), '../skills/system-spec-kit/mcp-server/database'));
  const ownerLeasePath = join(canonicalDbDir, OWNER_LEASE_FILE_NAME);
  let lease: { ownerPid?: unknown; canonicalDbDir?: unknown; startedAtIso?: unknown; socketPath?: unknown };
  try {
    lease = JSON.parse(readFileSync(ownerLeasePath, 'utf8'));
  } catch {
    return null;
  }
  if (lease.ownerPid !== row.pid || resolve(String(lease.canonicalDbDir)) !== canonicalDbDir) return null;
  const ownerLeaseStartedAtMs = Date.parse(String(lease.startedAtIso));
  const processStartedAtMs = readProcessStartTimeMs(row.pid);
  const socketPeerConnected = readSocketPeerConnected(row.pid, typeof lease.socketPath === 'string' ? lease.socketPath : '');
  if (!Number.isFinite(ownerLeaseStartedAtMs) || processStartedAtMs === null || socketPeerConnected === null) return null;
  return {
    pid: row.pid,
    ownerPid: row.pid,
    launcherPath,
    ownerLeasePath,
    canonicalDbDir,
    ownerLeaseStartedAtMs,
    processStartedAtMs,
    socketPeerConnected,
  };
}

function validateOwnershipEvidence(row: SweepPlanRow, evidence: SweepOwnershipEvidence | null): string | null {
  if (!evidence) return 'ownership-evidence-unavailable';
  if (evidence.pid !== row.pid || evidence.ownerPid !== row.pid) return 'owner-pid-mismatch';
  if (!row.command.includes(evidence.launcherPath) || !evidence.launcherPath.endsWith(LAUNCHER_PATH_SUFFIX)) {
    return 'launcher-identity-mismatch';
  }
  if (resolve(evidence.ownerLeasePath) !== join(resolve(evidence.canonicalDbDir), OWNER_LEASE_FILE_NAME)
    || !existsSync(evidence.ownerLeasePath)) return 'owner-lease-mismatch';
  try {
    const lease = JSON.parse(readFileSync(evidence.ownerLeasePath, 'utf8')) as {
      ownerPid?: unknown;
      canonicalDbDir?: unknown;
      startedAtIso?: unknown;
    };
    if (lease.ownerPid !== row.pid
      || resolve(String(lease.canonicalDbDir)) !== resolve(evidence.canonicalDbDir)
      || Date.parse(String(lease.startedAtIso)) !== evidence.ownerLeaseStartedAtMs) {
      return 'owner-lease-mismatch';
    }
  } catch {
    return 'owner-lease-mismatch';
  }
  if (!Number.isFinite(evidence.ownerLeaseStartedAtMs) || !Number.isFinite(evidence.processStartedAtMs)) {
    return 'start-time-evidence-unavailable';
  }
  if (evidence.socketPeerConnected !== false) return 'connected-socket-peer';
  return null;
}

function applyCandidate(
  row: SweepPlanRow,
  opts: ApplySweepOptions,
  nowMs: number,
  startupGraceMs: number,
): { applied: boolean; reason?: string } {
  if (row.classification !== 'orphaned-project-daemon') return { applied: false, reason: 'classification-not-reapable' };
  if (!hasKnownProjectIdentity(row)) return { applied: false, reason: 'unknown-owner-refused' };
  if (row.ppid !== 1) return { applied: false, reason: 'live-parent-preserved' };
  const evidence = opts.evidenceByPid?.get(row.pid) ?? readOwnershipEvidence(row);
  const evidenceError = validateOwnershipEvidence(row, evidence);
  if (!evidence || evidenceError) return { applied: false, reason: evidenceError ?? 'ownership-evidence-unavailable' };
  if (opts.getProcessStartTimeMs) {
    const currentStartTimeMs = opts.getProcessStartTimeMs(row.pid);
    if (currentStartTimeMs === null || currentStartTimeMs !== evidence.processStartedAtMs) {
      return { applied: false, reason: 'process-start-time-mismatch' };
    }
  }
  const ageMs = nowMs - Math.max(evidence.ownerLeaseStartedAtMs, evidence.processStartedAtMs);
  if (ageMs <= startupGraceMs) return { applied: false, reason: 'startup-grace-active' };
  const parentPid = opts.getParentPid ? opts.getParentPid(row.pid) : readProcessParentPid(row.pid);
  if (parentPid !== 1) return { applied: false, reason: parentPid === null ? 'parent-evidence-unavailable' : 'live-parent-preserved' };
  const socketPeerConnected = opts.getSocketPeerConnected
    ? opts.getSocketPeerConnected(row.pid, evidence)
    : readSocketPeerConnected(row.pid, '');
  if (socketPeerConnected !== false) return { applied: false, reason: socketPeerConnected === null ? 'socket-evidence-unavailable' : 'connected-socket-peer' };
  const signal = opts.signal ?? ((pid: number, signalName: 'SIGTERM') => {
    try {
      process.kill(pid, signalName);
      return true;
    } catch {
      return false;
    }
  });
  return signal(row.pid, 'SIGTERM') ? { applied: true } : { applied: false, reason: 'signal-failed' };
}

export function applySweep(inventory: Inventory, opts: ApplySweepOptions): SweepApplyResult {
  const plan = planSweep(inventory, { selfPid: opts.selfPid });
  const result: SweepApplyResult = {
    ...plan,
    mode: 'apply',
    dryRun: false,
    appliedPids: [],
    signals: [],
    skipped: [],
  };
  if (inventory.status !== 'ok') {
    result.reason = 'inventory-unavailable';
    return result;
  }
  if (opts.enabled === false) {
    result.reason = 'kill-switch-disabled';
    for (const row of plan.rows.filter((candidate) => candidate.classification === 'orphaned-project-daemon')) {
      result.skipped.push({ pid: row.pid, reason: 'kill-switch-disabled' });
    }
    return result;
  }

  const nowMs = typeof opts.nowMs === 'number' ? opts.nowMs : Date.now();
  const startupGraceMs = typeof opts.startupGraceMs === 'number' ? opts.startupGraceMs : DEFAULT_STARTUP_GRACE_MS;
  for (const row of plan.rows) {
    if (row.classification !== 'orphaned-project-daemon') continue;
    const outcome = applyCandidate(row, opts, nowMs, startupGraceMs);
    if (outcome.applied) {
      result.appliedPids.push(row.pid);
      result.signals.push({ pid: row.pid, signal: 'SIGTERM' });
    } else {
      result.skipped.push({ pid: row.pid, reason: outcome.reason ?? 'preserved' });
    }
  }
  result.reason = result.appliedPids.length > 0 ? 'orphan-reaped' : 'no-safe-orphans';
  return result;
}

function hasKnownProjectIdentity(row: Pick<SweepPlanRow, 'command'>): boolean {
  return hasKnownProjectOwnerMarker(row.command);
}

function stalePidLockRows(pidLocks: PidLockState[]): SweepPlanRow[] {
  return pidLocks
    .filter((lock): lock is PidLockState & { pid: number } => lock.state === 'stale' && lock.pid !== null)
    .map((lock) => ({
      pid: lock.pid,
      ppid: 0,
      command: lock.path,
      classification: 'stale-pid-lock',
      eligibleForTermination: false,
      rationale: 'pending-sweep-evaluation',
    }));
}

function summarize(rows: SweepPlanRow[]): Record<string, number> {
  const summary: Record<string, number> = {
    totalRows: rows.length,
    eligibleForTermination: rows.filter((row) => row.eligibleForTermination).length,
    preserved: rows.filter((row) => !row.eligibleForTermination).length,
  };

  for (const row of rows) {
    summary[`classification:${row.classification}`] = (summary[`classification:${row.classification}`] ?? 0) + 1;
    summary[`rationale:${row.rationale}`] = (summary[`rationale:${row.rationale}`] ?? 0) + 1;
  }

  return summary;
}

function evaluateEligibility(
  row: SweepPlanRow,
  opts: PlanSweepOptions,
  ancestorPids: ReadonlySet<number>,
): Pick<SweepPlanRow, 'eligibleForTermination' | 'rationale'> {
  if (row.pid === opts.selfPid) {
    return { eligibleForTermination: false, rationale: 'self-pid-refused' };
  }

  if (ancestorPids.has(row.pid)) {
    return { eligibleForTermination: false, rationale: 'ancestor-refused' };
  }

  if (row.classification === 'expected-warm-daemon') {
    return { eligibleForTermination: false, rationale: 'expected-warm-preserved' };
  }

  if (row.classification === 'unknown-owner' || row.classification === 'eperm-alive-unowned') {
    return { eligibleForTermination: false, rationale: 'unknown-owner-refused' };
  }

  if (row.classification === 'stale-pid-lock' || row.classification === 'orphaned-project-daemon') {
    if (!hasKnownProjectIdentity(row)) {
      return { eligibleForTermination: false, rationale: 'unknown-owner-refused' };
    }
    return { eligibleForTermination: true, rationale: 'stale-or-orphan' };
  }

  return { eligibleForTermination: false, rationale: 'default-preserve' };
}

export function planSweep(inventory: Inventory, opts: PlanSweepOptions): SweepPlan {
  if (inventory.status !== 'ok') {
    return {
      inventoryStatus: inventory.status,
      ...(inventory.error ? { inventoryError: inventory.error } : {}),
      rows: [],
      summary: {
        totalRows: 0,
        eligibleForTermination: 0,
        preserved: 0,
        inventoryUnavailable: 1,
      },
    };
  }

  const ancestorPids = new Set(getProcessAncestry(opts.selfPid, inventory.processes));
  const processRows: SweepPlanRow[] = inventory.processes.map((processRow) => ({
    pid: processRow.pid,
    ppid: processRow.ppid,
    command: redactSensitiveCommand(processRow.command),
    classification: processRow.classification,
    eligibleForTermination: false,
    rationale: 'pending-sweep-evaluation',
  }));

  const rows = [...processRows, ...stalePidLockRows(inventory.pidLocks)].map((row) => ({
    ...row,
    ...evaluateEligibility(row, opts, ancestorPids),
  }));

  return {
    inventoryStatus: inventory.status,
    ...(inventory.error ? { inventoryError: inventory.error } : {}),
    rows,
    summary: summarize(rows),
  };
}

function showHelp(): void {
  console.log(`process-sweep - ownership-checked orphan daemon sweep

USAGE:
  node scripts/dist/ops/process-sweep.js plan [--pretty]
  node scripts/dist/ops/process-sweep.js fixture [--pretty]
  node scripts/dist/ops/process-sweep.js apply [--pretty]

COMMANDS:
  plan      Capture live inventory and emit a dry-run sweep plan. This is the default.
  fixture   Emit a deterministic dry-run sweep plan from synthetic process evidence.
  apply     Recheck ownership, parent, socket, and age evidence before sending SIGTERM.

NOTES:
  The apply command is autonomous and enabled by default. Set ${ORPHAN_SWEEP_KILL_SWITCH}=off to preserve candidates and report the disabled reason.
`);
}

function buildCliPayload(command: 'plan' | 'fixture' | 'apply', env: NodeJS.ProcessEnv = process.env): CliPayload {
  const inventory = command === 'fixture' ? syntheticFixtureSnapshot() : collectInventory();
  if (command === 'apply') {
    return applySweep(inventory, {
      selfPid: inventory.currentPid,
      enabled: isSweepEnabled(env),
    });
  }
  const plan = planSweep(inventory, { selfPid: inventory.currentPid });

  return {
    ...plan,
    mode: command,
    dryRun: true,
    note: 'Dry-run inventory only; no termination attempted.',
  };
}

function main(argv: string[]): void {
  const command = argv[0] ?? 'plan';
  const pretty = argv.includes('--pretty');

  if (command === '--help' || command === '-h' || command === 'help') {
    showHelp();
    return;
  }

  if (command !== 'plan' && command !== 'fixture' && command !== 'apply') {
    console.error(`ERROR: unknown command: ${command}`);
    showHelp();
    process.exitCode = 2;
    return;
  }

  console.log(JSON.stringify(buildCliPayload(command), null, pretty ? 2 : 0));
}

if (isMainModule(import.meta.url)) {
  main(process.argv.slice(2));
}
