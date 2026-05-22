#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Process Sweep
// ---------------------------------------------------------------
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

interface CliPayload extends SweepPlan {
  mode: 'plan' | 'fixture' | 'apply';
  dryRun: true;
  applyConfirmed: boolean;
  note: string;
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
  console.log(`process-sweep - dry-run process termination planner

USAGE:
  node scripts/dist/ops/process-sweep.js plan [--pretty]
  node scripts/dist/ops/process-sweep.js fixture [--pretty]
  node scripts/dist/ops/process-sweep.js apply --confirmed <token> [--pretty]

COMMANDS:
  plan      Capture live inventory and emit a dry-run sweep plan. This is the default.
  fixture   Emit a deterministic dry-run sweep plan from synthetic process evidence.
  apply     Non-destructive in phase 005. Requires --confirmed but still sends no signals.

NOTES:
  This phase never kills processes. eligibleForTermination means exact-identity dry-run proof only.
`);
}

function readConfirmationToken(argv: string[]): string | null {
  const index = argv.indexOf('--confirmed');
  if (index === -1) return null;
  const token = argv[index + 1];
  return token && !token.startsWith('--') ? token : null;
}

function buildCliPayload(command: 'plan' | 'fixture' | 'apply', argv: string[]): CliPayload {
  const inventory = command === 'fixture' ? syntheticFixtureSnapshot() : collectInventory();
  const plan = planSweep(inventory, { selfPid: inventory.currentPid });
  const token = readConfirmationToken(argv);

  return {
    ...plan,
    mode: command,
    dryRun: true,
    applyConfirmed: command === 'apply' && token !== null,
    note:
      command === 'apply'
        ? 'Phase 005 apply is non-destructive; live termination is deferred to phase 010 operator policy.'
        : 'Dry-run inventory only; no termination attempted.',
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

  if (command === 'apply' && !readConfirmationToken(argv)) {
    const payload = buildCliPayload(command, argv);
    console.log(JSON.stringify(payload, null, pretty ? 2 : 0));
    return;
  }

  console.log(JSON.stringify(buildCliPayload(command, argv), null, pretty ? 2 : 0));
}

if (isMainModule(import.meta.url)) {
  main(process.argv.slice(2));
}
