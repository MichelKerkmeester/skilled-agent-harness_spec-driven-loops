#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Process Memory Harness
// ---------------------------------------------------------------
import { execFileSync } from 'node:child_process';
import { isMainModule } from '../lib/esm-entry.js';

export type ProcessRole = 'current-session' | 'project-daemon' | 'expected-daemon' | 'external-tool' | 'zombie' | 'unknown';

export type ProcessClassification =
  | 'current-session'
  | 'project-daemon'
  | 'orphaned-project-daemon'
  | 'expected-warm-daemon'
  | 'external-mcp-stdio'
  | 'browser-session'
  | 'ccc-daemon'
  | 'zombie'
  | 'stale-pid-lock'
  | 'eperm-alive-unowned'
  | 'unknown-owner';

export interface ProcessRow {
  pid: number;
  ppid: number;
  stat: string;
  rssKb: number;
  command: string;
  eperm?: boolean;
}

export interface ProcessRule {
  id: string;
  pattern: RegExp;
  role: Exclude<ProcessRole, 'current-session' | 'zombie' | 'unknown'>;
  classification?: ProcessClassification;
  reason: string;
}

export interface ClassifiedProcess extends ProcessRow {
  role: ProcessRole;
  classification: ProcessClassification;
  ruleId: string | null;
  rssMb: number;
  isAncestorOfCurrent: boolean;
  isDescendantOfCurrent: boolean;
  isOrphanedProjectDaemon: boolean;
  terminationCandidate: boolean;
  reason: string;
}

export interface PidLockState {
  path: string;
  raw: string;
  pid: number | null;
  state: 'empty' | 'invalid' | 'live' | 'stale' | 'zombie';
  reason: string;
}

export interface HostMemorySnapshot {
  pageSizeBytes: number | null;
  totalMemoryBytes: number | null;
  pages: Record<string, number>;
  approx: Record<string, number>;
  warnings: string[];
}

export type ProcessInventoryStatus = 'ok' | 'ps-error' | 'empty';

export interface HarnessSnapshot {
  status: ProcessInventoryStatus;
  error?: string;
  timestamp: string;
  currentPid: number;
  currentAncestors: number[];
  hostMemory: HostMemorySnapshot;
  processCount: number;
  projectDaemonCount: number;
  expectedDaemonCount: number;
  zombieCount: number;
  orphanedProjectDaemonCount: number;
  terminationCandidateCount: number;
  processes: ClassifiedProcess[];
  pidLocks: PidLockState[];
}

export type Inventory = HarnessSnapshot;

export const DEFAULT_PROCESS_RULES: ProcessRule[] = [
  {
    id: 'cocoindex-daemon',
    pattern: /(?:^|[\s/])ccc\s+run-daemon(?:\s|$)/,
    role: 'project-daemon',
    reason: 'CocoIndex daemon process',
  },
  {
    id: 'cocoindex-mcp',
    pattern: /(?:^|[\s/])ccc\s+mcp(?:\s|$)/,
    role: 'project-daemon',
    reason: 'CocoIndex MCP process',
  },
  {
    id: 'code-graph-launcher',
    pattern: /mk-code-index-launcher\.cjs/,
    role: 'project-daemon',
    reason: 'Code Graph launcher process',
  },
  {
    id: 'code-graph-server',
    pattern: /system-code-graph\/mcp_server\/dist\/index\.js/,
    role: 'project-daemon',
    reason: 'Code Graph MCP server process',
  },
  {
    id: 'spec-memory-launcher',
    pattern: /mk-spec-memory-launcher\.cjs/,
    role: 'project-daemon',
    reason: 'Spec Kit Memory launcher process',
  },
  {
    id: 'spec-memory-server',
    pattern: /system-spec-kit\/mcp_server\/dist\/context-server\.js/,
    role: 'project-daemon',
    reason: 'Spec Kit Memory MCP server process',
  },
  {
    id: 'rerank-sidecar',
    pattern: /(?:rerank_sidecar|system-rerank-sidecar.*uvicorn|uvicorn.*rerank)/,
    role: 'expected-daemon',
    reason: 'Shared rerank sidecar; termination requires owner and port-ledger proof',
  },
  {
    id: 'ollama-serve',
    pattern: /\/ollama\s+serve(?:\s|$)/,
    role: 'expected-daemon',
    reason: 'Operator-managed Ollama daemon',
  },
];

const KNOWN_PROJECT_OWNER_MARKERS = [
  '.opencode/skills/system-spec-kit',
  '.opencode/skills/mcp-coco-index',
  '.opencode/skills/system-code-graph',
  '.opencode/skills/system-rerank-sidecar',
  'mk-spec-memory-launcher.cjs',
  'mk-code-index-launcher.cjs',
  'SPECKIT_OWNER_TOKEN=',
  'SPECKIT_PROCESS_OWNER=',
  'SPECKIT_PROJECT_ROOT=',
  '--owner-token',
  '--ownerToken',
  'owner_token=',
  'ownerToken=',
];

function hasOwnerToken(command: string): boolean {
  return /(?:^|\s)(?:--owner-token|--ownerToken|owner_token=|ownerToken=|SPECKIT_OWNER_TOKEN=)/.test(command);
}

export function redactSensitiveCommand(command: string): string {
  return command
    .replace(
      /\b([A-Za-z_][A-Za-z0-9_]*(?:API_KEY|TOKEN|SECRET)|SPECKIT_OWNER_TOKEN|RERANK_SIDECAR_OWNER_TOKEN|owner_token|ownerToken)=([^\s]+)/g,
      '$1=<redacted>',
    )
    .replace(/(^|\s)(--owner-token|--ownerToken)=([^\s]+)/g, '$1$2=<redacted>')
    .replace(/(^|\s)(--owner-token|--ownerToken)\s+([^\s]+)/g, '$1$2 <redacted>');
}

export function hasKnownProjectOwnerMarker(command: string): boolean {
  return KNOWN_PROJECT_OWNER_MARKERS.some((marker) => command.includes(marker));
}

function isCccProcess(command: string): boolean {
  return /(?:^|[\s/])ccc(?:\s|$)/.test(command);
}

function isExternalMcpProcess(command: string): boolean {
  return /(?:^|[\s/])mcp-[^\s/]+/.test(command) || /(?:^|\s)--mcp-server(?:\s|=|$)/.test(command);
}

function isBrowserProcess(command: string): boolean {
  return /(?:Chrome|Firefox|Safari|WebKit)/.test(command) && !hasKnownProjectOwnerMarker(command);
}

function toMb(kb: number): number {
  return Math.round((kb / 1024) * 100) / 100;
}

function bytesForPages(pageCount: number, pageSizeBytes: number | null): number {
  if (!pageSizeBytes) return 0;
  return pageCount * pageSizeBytes;
}

export function parsePsOutput(output: string): ProcessRow[] {
  const rows: ProcessRow[] = [];
  for (const line of output.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || /^PID\s+PPID\s+STAT\s+RSS\s+COMMAND\b/.test(trimmed)) continue;

    const match = /^\s*(\d+)\s+(\d+)\s+(\S+)\s+(\d+)\s+(.*)$/.exec(line);
    if (!match) continue;

    rows.push({
      pid: Number(match[1]),
      ppid: Number(match[2]),
      stat: match[3],
      rssKb: Number(match[4]),
      command: redactSensitiveCommand(match[5] ?? ''),
    });
  }
  return rows;
}

function extractCommandFailure(output: string): string | null {
  const failureLine = output.split(/\r?\n/).find((line) => line.startsWith('# command_failed:'));
  return failureLine ? failureLine.replace(/^# command_failed:\s*/, '').trim() : null;
}

function resolveInventoryStatus(input: {
  psOutput: string;
  psError?: string;
  rows: ProcessRow[];
}): { status: ProcessInventoryStatus; error?: string } {
  const commandFailure = input.psError ?? extractCommandFailure(input.psOutput) ?? undefined;
  if (commandFailure) {
    return { status: 'ps-error', error: commandFailure };
  }

  if (input.rows.length === 0) {
    return { status: 'empty' };
  }

  return { status: 'ok' };
}

export function parseVmStat(output: string, sysctlOutput = ''): HostMemorySnapshot {
  const warnings: string[] = [];
  const pageSizeMatch = /page size of\s+(\d+)\s+bytes/.exec(output);
  const pageSizeBytes = pageSizeMatch ? Number(pageSizeMatch[1]) : null;
  const totalMemoryMatch = /hw\.memsize:\s*(\d+)/.exec(sysctlOutput);
  const totalMemoryBytes = totalMemoryMatch ? Number(totalMemoryMatch[1]) : null;
  const pages: Record<string, number> = {};

  for (const line of output.split(/\r?\n/)) {
    const match = /^(.+?):\s+([0-9]+)\.?$/.exec(line.trim());
    if (!match) continue;
    const key = match[1]
      .toLowerCase()
      .replace(/^"|"$/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    pages[key] = Number(match[2]);
  }

  if (!pageSizeBytes) warnings.push('vm_stat_page_size_missing');
  if (!totalMemoryBytes) warnings.push('sysctl_hw_memsize_missing');

  return {
    pageSizeBytes,
    totalMemoryBytes,
    pages,
    approx: {
      freeBytes: bytesForPages((pages.pages_free ?? 0) + (pages.pages_speculative ?? 0), pageSizeBytes),
      wiredBytes: bytesForPages(pages.pages_wired_down ?? 0, pageSizeBytes),
      activeBytes: bytesForPages(pages.pages_active ?? 0, pageSizeBytes),
      inactiveBytes: bytesForPages(pages.pages_inactive ?? 0, pageSizeBytes),
      compressorBytes: bytesForPages(pages.pages_occupied_by_compressor ?? 0, pageSizeBytes),
    },
    warnings,
  };
}

function processMap(rows: ProcessRow[]): Map<number, ProcessRow> {
  return new Map(rows.map((row) => [row.pid, row]));
}

export function getAncestorPids(pid: number, rows: ProcessRow[]): number[] {
  const byPid = processMap(rows);
  const ancestors: number[] = [];
  const seen = new Set<number>();
  let current = byPid.get(pid);

  while (current && current.ppid > 0 && !seen.has(current.ppid)) {
    seen.add(current.ppid);
    ancestors.push(current.ppid);
    current = byPid.get(current.ppid);
  }

  return ancestors;
}

export function getProcessAncestry(pid: number, rows: ProcessRow[]): number[] {
  return getAncestorPids(pid, rows);
}

export function getDescendantPids(pid: number, rows: ProcessRow[]): number[] {
  const children = new Map<number, number[]>();
  for (const row of rows) {
    const existing = children.get(row.ppid) ?? [];
    existing.push(row.pid);
    children.set(row.ppid, existing);
  }

  const descendants: number[] = [];
  const queue = [...(children.get(pid) ?? [])];
  const seen = new Set<number>();
  while (queue.length > 0) {
    const child = queue.shift();
    if (child === undefined || seen.has(child)) continue;
    seen.add(child);
    descendants.push(child);
    queue.push(...(children.get(child) ?? []));
  }
  return descendants;
}

export function classifyPidLock(path: string, raw: string, rows: ProcessRow[]): PidLockState {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { path, raw, pid: null, state: 'empty', reason: 'PID lock is empty' };
  }
  if (!/^\d+$/.test(trimmed)) {
    return { path, raw, pid: null, state: 'invalid', reason: 'PID lock does not contain a numeric PID' };
  }

  const pid = Number(trimmed);
  const owner = rows.find((row) => row.pid === pid);
  if (!owner) {
    return { path, raw, pid, state: 'stale', reason: 'PID lock points to a process that is not running' };
  }
  if (owner.stat.includes('Z')) {
    return { path, raw, pid, state: 'zombie', reason: 'PID lock points to a zombie process' };
  }
  return { path, raw, pid, state: 'live', reason: 'PID lock points to a live process' };
}

export function classifyProcesses(
  rows: ProcessRow[],
  options: {
    currentPid?: number;
    rules?: ProcessRule[];
  } = {},
): ClassifiedProcess[] {
  const currentPid = options.currentPid ?? process.pid;
  const rules = options.rules ?? DEFAULT_PROCESS_RULES;
  const currentAncestors = new Set(getAncestorPids(currentPid, rows));
  const currentDescendants = new Set(getDescendantPids(currentPid, rows));

  return rows.map((row): ClassifiedProcess => {
    const isAncestorOfCurrent = currentAncestors.has(row.pid);
    const isDescendantOfCurrent = currentDescendants.has(row.pid);
    const isCurrentSession = row.pid === currentPid || isAncestorOfCurrent || isDescendantOfCurrent;
    const zombie = row.stat.includes('Z');

    if (zombie) {
      return {
        ...row,
        role: 'zombie',
        classification: 'zombie',
        ruleId: null,
        rssMb: toMb(row.rssKb),
        isAncestorOfCurrent,
        isDescendantOfCurrent,
        isOrphanedProjectDaemon: false,
        terminationCandidate: false,
        reason: 'Zombie process has no RSS and must be reaped by its parent',
      };
    }

    if (isCurrentSession) {
      return {
        ...row,
        role: 'current-session',
        classification: 'current-session',
        ruleId: null,
        rssMb: toMb(row.rssKb),
        isAncestorOfCurrent,
        isDescendantOfCurrent,
        isOrphanedProjectDaemon: false,
        terminationCandidate: false,
        reason: 'Current process, ancestor, or child; never auto-terminate from this harness',
      };
    }

    if (row.eperm) {
      return {
        ...row,
        role: 'unknown',
        classification: 'eperm-alive-unowned',
        ruleId: null,
        rssMb: toMb(row.rssKb),
        isAncestorOfCurrent,
        isDescendantOfCurrent,
        isOrphanedProjectDaemon: false,
        terminationCandidate: false,
        reason: 'Process is alive but ownership cannot be inspected due to EPERM',
      };
    }

    if (isCccProcess(row.command) && !hasOwnerToken(row.command)) {
      return {
        ...row,
        role: 'external-tool',
        classification: 'ccc-daemon',
        ruleId: 'ccc-daemon',
        rssMb: toMb(row.rssKb),
        isAncestorOfCurrent,
        isDescendantOfCurrent,
        isOrphanedProjectDaemon: false,
        terminationCandidate: false,
        reason: 'CocoIndex CLI process without an owner token; preserve until exact owner policy exists',
      };
    }

    if (isExternalMcpProcess(row.command)) {
      return {
        ...row,
        role: 'external-tool',
        classification: 'external-mcp-stdio',
        ruleId: 'external-mcp-stdio',
        rssMb: toMb(row.rssKb),
        isAncestorOfCurrent,
        isDescendantOfCurrent,
        isOrphanedProjectDaemon: false,
        terminationCandidate: false,
        reason: 'External MCP stdio process; preserve until explicit close/stop ownership is proven',
      };
    }

    if (isBrowserProcess(row.command)) {
      return {
        ...row,
        role: 'external-tool',
        classification: 'browser-session',
        ruleId: 'browser-session',
        rssMb: toMb(row.rssKb),
        isAncestorOfCurrent,
        isDescendantOfCurrent,
        isOrphanedProjectDaemon: false,
        terminationCandidate: false,
        reason: 'Browser session without known project marker; preserve',
      };
    }

    const rule = rules.find((candidate) => candidate.pattern.test(row.command));
    const role = rule?.role ?? 'unknown';
    const isOrphanedProjectDaemon = role === 'project-daemon' && row.ppid === 1;
    const classification =
      rule?.classification ??
      (isOrphanedProjectDaemon
        ? 'orphaned-project-daemon'
        : role === 'expected-daemon'
          ? 'expected-warm-daemon'
          : role === 'project-daemon'
            ? 'project-daemon'
            : 'unknown-owner');
    const terminationCandidate = classification === 'orphaned-project-daemon';

    return {
      ...row,
      role,
      classification,
      ruleId: rule?.id ?? null,
      rssMb: toMb(row.rssKb),
      isAncestorOfCurrent,
      isDescendantOfCurrent,
      isOrphanedProjectDaemon,
      terminationCandidate,
      reason: rule?.reason ?? 'No project daemon rule matched',
    };
  });
}

export function classifyProcess(
  row: ProcessRow,
  rows: ProcessRow[],
  options: {
    currentPid?: number;
    rules?: ProcessRule[];
  } = {},
): ClassifiedProcess {
  return classifyProcesses(rows, options).find((candidate) => candidate.pid === row.pid) ?? classifyProcesses([row], options)[0];
}

export function buildHarnessSnapshot(input: {
  psOutput: string;
  psError?: string;
  vmStatOutput: string;
  sysctlOutput?: string;
  currentPid?: number;
  lockContents?: Record<string, string>;
  timestamp?: string;
}): HarnessSnapshot {
  const rows = parsePsOutput(input.psOutput);
  const inventoryStatus = resolveInventoryStatus({
    psOutput: input.psOutput,
    psError: input.psError,
    rows,
  });
  const currentPid = input.currentPid ?? process.pid;
  const processes = classifyProcesses(rows, { currentPid });
  const pidLocks = Object.entries(input.lockContents ?? {}).map(([path, raw]) =>
    classifyPidLock(path, raw, rows),
  );

  return {
    ...inventoryStatus,
    timestamp: input.timestamp ?? new Date().toISOString(),
    currentPid,
    currentAncestors: getAncestorPids(currentPid, rows),
    hostMemory: parseVmStat(input.vmStatOutput, input.sysctlOutput ?? ''),
    processCount: processes.length,
    projectDaemonCount: processes.filter((row) => row.role === 'project-daemon').length,
    expectedDaemonCount: processes.filter((row) => row.role === 'expected-daemon').length,
    zombieCount: processes.filter((row) => row.role === 'zombie').length,
    orphanedProjectDaemonCount: processes.filter((row) => row.isOrphanedProjectDaemon).length,
    terminationCandidateCount: processes.filter((row) => row.terminationCandidate).length,
    processes,
    pidLocks: inventoryStatus.status === 'ok' ? pidLocks : [],
  };
}

export function syntheticFixtureSnapshot(): HarnessSnapshot {
  const psOutput = `  PID  PPID STAT    RSS COMMAND
 1000     1 S     5000 opencode
 1001  1000 S     4000 node synthetic-child.js
 1002  1001 S     3000 node synthetic-grandchild.js
 2000     1 S    96000 /opt/homebrew/bin/python .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc run-daemon
 2001     1 S    44000 /opt/homebrew/bin/python .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp
 2002     1 S    32000 /opt/homebrew/bin/node /repo/.opencode/skills/system-code-graph/mcp_server/dist/index.js
 2003     1 S    12000 /opt/homebrew/bin/node .opencode/bin/mk-spec-memory-launcher.cjs
 3000     1 S   120000 uvicorn rerank_sidecar:app --host 127.0.0.1
 4000     1 S    24000 /opt/homebrew/opt/ollama/bin/ollama serve
 5000   918 Z        0 <defunct>
`;
  const vmStatOutput = `Mach Virtual Memory Statistics: (page size of 16384 bytes)
Pages free: 10.
Pages active: 20.
Pages inactive: 30.
Pages speculative: 2.
Pages wired down: 40.
Pages occupied by compressor: 50.
`;
  return buildHarnessSnapshot({
    psOutput,
    vmStatOutput,
    sysctlOutput: 'hw.memsize: 68719476736',
    currentPid: 1000,
    lockContents: {
      '.opencode/skills/system-spec-kit/run/live.pid': '2000',
      '.opencode/skills/system-spec-kit/run/stale.pid': '9999',
      '.opencode/skills/system-spec-kit/run/invalid.pid': 'not-a-pid',
      '.opencode/skills/system-spec-kit/run/zombie.pid': '5000',
    },
    timestamp: '2026-05-22T00:00:00.000Z',
  });
}

function readCommand(command: string, args: string[]): { output: string; error?: string } {
  try {
    return { output: execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      output: `# command_failed: ${command} ${args.join(' ')} :: ${message}\n`,
      error: `${command} ${args.join(' ')} :: ${message}`,
    };
  }
}

function runSnapshot(): HarnessSnapshot {
  const ps = readCommand('ps', ['-axo', 'pid,ppid,stat,rss,command']);
  const vmStat = readCommand('vm_stat', []);
  const sysctl = readCommand('sysctl', ['hw.memsize']);

  return buildHarnessSnapshot({
    psOutput: ps.output,
    psError: ps.error,
    vmStatOutput: vmStat.output,
    sysctlOutput: sysctl.output,
    currentPid: process.pid,
  });
}

export function collectInventory(): Inventory {
  return runSnapshot();
}

function showHelp(): void {
  console.log(`process-memory-harness - dry-run process and host-memory evidence collector

USAGE:
  node scripts/dist/ops/process-memory-harness.js snapshot [--pretty]
  node scripts/dist/ops/process-memory-harness.js fixture [--pretty]

COMMANDS:
  snapshot   Capture ps/vm_stat/sysctl evidence and classify project daemons.
  fixture    Emit deterministic synthetic child/grandchild, stale lock, sidecar, and vm_stat fixture evidence.

NOTES:
  This harness never sends signals and never kills processes. terminationCandidate means exact-match inventory only.
`);
}

function main(argv: string[]): void {
  const command = argv[0] ?? 'snapshot';
  const pretty = argv.includes('--pretty');
  if (command === '--help' || command === '-h' || command === 'help') {
    showHelp();
    return;
  }

  if (command !== 'snapshot' && command !== 'fixture') {
    console.error(`ERROR: unknown command: ${command}`);
    showHelp();
    process.exitCode = 2;
    return;
  }

  const snapshot = command === 'fixture' ? syntheticFixtureSnapshot() : runSnapshot();
  console.log(JSON.stringify(snapshot, null, pretty ? 2 : 0));
}

if (isMainModule(import.meta.url)) {
  main(process.argv.slice(2));
}
