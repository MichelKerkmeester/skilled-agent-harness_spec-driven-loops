#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Process Sweep
// ───────────────────────────────────────────────────────────────────
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

/** One process (or stale PID lock) row in a sweep plan, with its termination verdict. */
export interface SweepPlanRow {
  pid: number;
  ppid: number;
  command: string;
  classification: ClassifiedProcess['classification'];
  eligibleForTermination: boolean;
  rationale: string;
}

/** A full sweep plan: every evaluated row plus a classification/rationale summary. */
export interface SweepPlan {
  inventoryStatus: Inventory['status'];
  inventoryError?: string;
  rows: SweepPlanRow[];
  summary: Record<string, number>;
}

interface PlanSweepOptions {
  selfPid: number;
}

/** Options for {@link applySweep}. */
export interface ApplySweepOptions {
  selfPid: number;
}

/** Result of an apply-mode sweep; always dry-run today (see {@link applySweep}). */
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

/**
 * Report the sweep plan in apply shape without signalling any process.
 *
 * @remarks
 * A process is signalled only through a registered terminable class, and a class carries the
 * ownership evidence — owner file, start time, socket peer — that proves the process is this
 * repository's to kill. No such class is registered, so apply reports the plan and signals
 * nothing. Restoring termination means registering a class together with its evidence probe,
 * never re-enabling a kill path that decides on classification alone.
 *
 * @param inventory - Live or fixture process inventory to evaluate
 * @param opts - Apply options, currently just the caller's own PID
 * @returns An apply-shaped result; `appliedPids`/`signals` are always empty today
 */
export function applySweep(inventory: Inventory, opts: ApplySweepOptions): SweepApplyResult {
  const plan = planSweep(inventory, { selfPid: opts.selfPid });
  return {
    ...plan,
    mode: 'apply',
    dryRun: false,
    appliedPids: [],
    signals: [],
    skipped: [],
    reason: inventory.status === 'ok' ? 'no-terminable-class-registered' : 'inventory-unavailable',
  };
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

/**
 * Build a dry-run sweep plan: classify every process and stale PID lock and
 * decide whether each would be eligible for termination.
 *
 * @param inventory - Live or fixture process inventory to evaluate
 * @param opts - Plan options, currently just the caller's own PID
 * @returns The sweep plan, or an empty plan when the inventory is unavailable
 */
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
  console.log(`process-sweep - process inventory sweep

USAGE:
  node scripts/dist/ops/process-sweep.js plan [--pretty]
  node scripts/dist/ops/process-sweep.js fixture [--pretty]
  node scripts/dist/ops/process-sweep.js apply [--pretty]

COMMANDS:
  plan      Capture live inventory and emit a dry-run sweep plan. This is the default.
  fixture   Emit a deterministic dry-run sweep plan from synthetic process evidence.
  apply     Report the same plan as an apply result.

NOTES:
  No terminable process class is registered, so no command signals a process. apply reports
  reason=no-terminable-class-registered until a class and its ownership evidence are added.
`);
}

function buildCliPayload(command: 'plan' | 'fixture' | 'apply'): CliPayload {
  const inventory = command === 'fixture' ? syntheticFixtureSnapshot() : collectInventory();
  if (command === 'apply') {
    return applySweep(inventory, { selfPid: inventory.currentPid });
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
