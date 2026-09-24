// ───────────────────────────────────────────────────────────────────
// MODULE: Sync Phase Map Status
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as path from 'node:path';

import { isMainModule } from '../lib/esm-entry.js';

const PHASE_CHILD_RE = /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/;
const EXCLUDED_DESCENDANT_DIRS = new Set(['.git', 'node_modules', 'research']);

type StatusSource = 'spec' | 'implementation-summary' | 'missing';

/** Resolved options for one {@link runSyncPhaseMapStatus} invocation. */
export interface SyncOptions {
  readonly phaseParentPath: string;
  readonly dryRun: boolean;
}

/** One phase-map row status correction, tracing which child folder and source drove it. */
export interface PhaseMapChange {
  readonly filePath: string;
  readonly childFolder: string;
  readonly from: string;
  readonly to: string;
  readonly source: StatusSource;
}

/** One reported completion-percentage mismatch in a descendant spec file. */
export interface CompletionPctChange {
  readonly filePath: string;
  readonly from: number;
  readonly to: number;
  readonly reason: string;
}

/** Full result of a sync run: row changes, completion mismatches, and warnings. */
export interface SyncSummary {
  readonly dryRun: boolean;
  readonly phaseParentPath: string;
  readonly directChildren: number;
  readonly descendantSpecFiles: number;
  readonly phaseMapRowsCorrected: number;
  readonly completionPctMismatchesFound: number;
  readonly phaseMapChanges: PhaseMapChange[];
  readonly completionPctMismatches: CompletionPctChange[];
  readonly warnings: string[];
}

/** Result of parsing CLI arguments: either resolved {@link SyncOptions} or a usage error. */
export type SyncPlan =
  | { readonly ok: true; readonly options: SyncOptions }
  | { readonly ok: false; readonly error: string };

interface ChildStatus {
  readonly childFolder: string;
  readonly status: string;
  readonly source: StatusSource;
}

interface SplitContent {
  readonly lines: string[];
  readonly newline: string;
  readonly trailingNewline: boolean;
}

function splitContent(content: string): SplitContent {
  const newline = content.includes('\r\n') ? '\r\n' : '\n';
  const trailingNewline = content.endsWith(newline);
  const lines = content.split(newline);
  if (trailingNewline) {
    lines.pop();
  }
  return { lines, newline, trailingNewline };
}

function joinContent({ lines, newline, trailingNewline }: SplitContent): string {
  return `${lines.join(newline)}${trailingNewline ? newline : ''}`;
}

function stripMarkdown(value: string): string {
  return value
    .replace(/[`*_]/gu, '')
    .replace(/<[^>]+>/gu, '')
    .replace(/\s+/gu, ' ')
    .trim();
}

function normalizeStatus(value: string): string {
  return stripMarkdown(value).toLowerCase();
}

function leadingStatus(value: string): string {
  return (value.split(/[(;:,.]| - | – | — /u, 1)[0] ?? '').trim();
}

function statusesAgree(mapStatus: string, childStatus: string): boolean {
  const leadingMapStatus = leadingStatus(mapStatus);
  return normalizeStatus(leadingMapStatus) === normalizeStatus(childStatus)
    || (isCompleteStatus(leadingMapStatus) && isCompleteStatus(childStatus));
}

function isAmbiguousStatus(status: string | null): boolean {
  if (status === null) {
    return true;
  }
  return ['', 'draft', 'tbd', 'todo', 'unknown', 'n/a', 'not set'].includes(normalizeStatus(status));
}

function isCompleteStatus(status: string | null): boolean {
  if (status === null) {
    return false;
  }
  return ['complete', 'completed', 'done'].includes(normalizeStatus(status));
}

function parseMetadataRow(content: string, fieldName: string): string | null {
  const escapedField = fieldName.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const rowRe = new RegExp(`^\\|\\s*\\*\\*${escapedField}\\*\\*\\s*\\|\\s*([^|]+?)\\s*\\|`, 'imu');
  const match = content.match(rowRe);
  if (!match) {
    return null;
  }
  return stripMarkdown(match[1] ?? '');
}

function parseSpecStatus(specContent: string): string | null {
  const status = parseMetadataRow(specContent, 'Status');
  return status === null ? null : leadingStatus(status);
}

function implementationSummaryClaimsCompletion(folderPath: string): boolean {
  const summaryPath = path.join(folderPath, 'implementation-summary.md');
  if (!fs.existsSync(summaryPath)) {
    return false;
  }
  const content = fs.readFileSync(summaryPath, 'utf8');
  if (/^\s*completion_pct:\s*100\s*$/imu.test(content)) {
    return true;
  }
  const status = parseMetadataRow(content, 'Status');
  if (isCompleteStatus(status)) {
    return true;
  }
  const completed = parseMetadataRow(content, 'Completed');
  return completed !== null && !/(^$|n\/a|not\s+complete|pending|todo|unknown)/iu.test(completed);
}

function resolveChildStatus(childFolderPath: string): ChildStatus {
  const childFolder = path.basename(childFolderPath);
  const specPath = path.join(childFolderPath, 'spec.md');
  if (!fs.existsSync(specPath)) {
    return { childFolder, status: 'Unknown', source: 'missing' };
  }

  const specStatus = parseSpecStatus(fs.readFileSync(specPath, 'utf8'));
  if (!isAmbiguousStatus(specStatus)) {
    return { childFolder, status: specStatus ?? 'Unknown', source: 'spec' };
  }

  if (implementationSummaryClaimsCompletion(childFolderPath)) {
    return { childFolder, status: 'Complete', source: 'implementation-summary' };
  }

  return { childFolder, status: specStatus ?? 'Unknown', source: specStatus ? 'spec' : 'missing' };
}

function collectDirectChildren(phaseParentPath: string): string[] {
  return fs
    .readdirSync(phaseParentPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && PHASE_CHILD_RE.test(entry.name))
    .map((entry) => path.join(phaseParentPath, entry.name))
    .sort();
}

function collectDescendantSpecFiles(phaseParentPath: string): string[] {
  const specFiles: string[] = [];

  function walk(currentPath: string): void {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || EXCLUDED_DESCENDANT_DIRS.has(entry.name)) {
        continue;
      }
      if (entry.name.startsWith('.')) {
        continue;
      }
      const childPath = path.join(currentPath, entry.name);
      const specPath = path.join(childPath, 'spec.md');
      if (fs.existsSync(specPath)) {
        specFiles.push(specPath);
      }
      walk(childPath);
    }
  }

  walk(phaseParentPath);
  return specFiles.sort();
}

function splitTableCells(line: string): string[] {
  return line.split('|');
}

function normalizeFolderCell(cell: string): string {
  return stripMarkdown(cell)
    .replace(/\[[^\]]*\]\(([^)]+)\)/u, '$1')
    .replace(/\/$/u, '')
    .trim();
}

function findPhaseMapHeaderLine(lines: string[]): number {
  const headingIndex = lines.findIndex((line) => /^##\s+PHASE DOCUMENTATION MAP\s*$/iu.test(line.trim()));
  const searchStart = headingIndex >= 0 ? headingIndex : 0;
  for (let index = searchStart; index < lines.length; index += 1) {
    const cells = splitTableCells(lines[index]).map((cell) => stripMarkdown(cell).toLowerCase());
    if (cells.includes('folder') && cells.includes('status')) {
      return index;
    }
  }
  return -1;
}

function rewritePhaseMap(
  parentSpecPath: string,
  content: string,
  childStatuses: ChildStatus[],
  warnings: string[],
): { readonly content: string; readonly changes: PhaseMapChange[] } {
  const split = splitContent(content);
  const headerLineIndex = findPhaseMapHeaderLine(split.lines);
  if (headerLineIndex < 0) {
    warnings.push(`missing Phase Documentation Map table: ${parentSpecPath}`);
    return { content, changes: [] };
  }

  const headerCells = splitTableCells(split.lines[headerLineIndex]).map((cell) => stripMarkdown(cell).toLowerCase());
  const folderColumn = headerCells.findIndex((cell) => cell === 'folder');
  const statusColumn = headerCells.findIndex((cell) => cell === 'status');
  if (folderColumn < 0 || statusColumn < 0) {
    warnings.push(`Phase Documentation Map table is missing Folder or Status column: ${parentSpecPath}`);
    return { content, changes: [] };
  }

  const childrenByFolder = new Map(childStatuses.map((child) => [child.childFolder, child]));
  const matchedChildFolders = new Set<string>();
  const changes: PhaseMapChange[] = [];
  for (let index = headerLineIndex + 2; index < split.lines.length; index += 1) {
    const line = split.lines[index];
    if (!line.trim().startsWith('|')) {
      if (line.trim() === '' && split.lines[index + 1]?.trim().startsWith('|')) {
        warnings.push(
          `blank line at ${parentSpecPath}:${index + 1} ends the Phase Documentation Map table; rows after it are not read`,
        );
      }
      break;
    }
    const cells = splitTableCells(line);
    const folderCell = cells[folderColumn] ?? '';
    const child = childrenByFolder.get(normalizeFolderCell(folderCell));
    if (!child) {
      continue;
    }
    matchedChildFolders.add(child.childFolder);

    const statusCell = cells[statusColumn] ?? '';
    const currentStatus = stripMarkdown(statusCell);
    if (statusesAgree(currentStatus, child.status)) {
      continue;
    }

    const leading = statusCell.match(/^\s*/u)?.[0] ?? '';
    const trailing = statusCell.match(/\s*$/u)?.[0] ?? '';
    cells[statusColumn] = `${leading}${child.status}${trailing}`;
    split.lines[index] = cells.join('|');
    changes.push({
      filePath: parentSpecPath,
      childFolder: child.childFolder,
      from: currentStatus,
      to: child.status,
      source: child.source,
    });
  }

  for (const child of childStatuses) {
    if (!matchedChildFolders.has(child.childFolder)) {
      warnings.push(`no Phase Documentation Map row for ${child.childFolder}: ${parentSpecPath}`);
    }
  }

  return { content: joinContent(split), changes };
}

function replaceFrontmatterCompletionPct(specContent: string): string | null {
  const split = splitContent(specContent);
  if (split.lines[0] !== '---') {
    return null;
  }
  const closingIndex = split.lines.findIndex((line, index) => index > 0 && line === '---');
  if (closingIndex < 0) {
    return null;
  }
  for (let index = 1; index < closingIndex; index += 1) {
    const match = split.lines[index].match(/^(\s*completion_pct:\s*)0(\s*(?:#.*)?)$/u);
    if (!match) {
      continue;
    }
    split.lines[index] = `${match[1]}100${match[2]}`;
    return joinContent(split);
  }
  return null;
}

function syncCompletionPct(specPath: string): CompletionPctChange | null {
  const content = fs.readFileSync(specPath, 'utf8');
  const status = parseSpecStatus(content);
  const folderPath = path.dirname(specPath);
  if (status !== null && !isAmbiguousStatus(status) && !isCompleteStatus(status)) {
    return null;
  }
  if (!isCompleteStatus(status) && !implementationSummaryClaimsCompletion(folderPath)) {
    return null;
  }
  const updated = replaceFrontmatterCompletionPct(content);
  if (updated === null || updated === content) {
    return null;
  }
  return {
    filePath: specPath,
    from: 0,
    to: 100,
    reason: isCompleteStatus(status) ? 'spec-status-complete' : 'implementation-summary-complete',
  };
}

function writeIfChanged(filePath: string, previous: string, next: string, dryRun: boolean): void {
  if (dryRun || previous === next) {
    return;
  }
  fs.writeFileSync(filePath, next, 'utf8');
}

/** Synchronize one phase parent's map table and descendant continuity percentages. */
export function runSyncPhaseMapStatus(options: SyncOptions): SyncSummary {
  const phaseParentPath = path.resolve(options.phaseParentPath);
  const parentSpecPath = path.join(phaseParentPath, 'spec.md');
  if (!fs.existsSync(parentSpecPath)) {
    throw new Error(`phase parent is missing spec.md: ${phaseParentPath}`);
  }

  const warnings: string[] = [];
  const childFolders = collectDirectChildren(phaseParentPath);
  const childStatuses = childFolders.map((childPath) => resolveChildStatus(childPath));

  const parentSpec = fs.readFileSync(parentSpecPath, 'utf8');
  const phaseMapResult = rewritePhaseMap(parentSpecPath, parentSpec, childStatuses, warnings);
  writeIfChanged(parentSpecPath, parentSpec, phaseMapResult.content, options.dryRun);

  const descendantSpecFiles = collectDescendantSpecFiles(phaseParentPath);
  const completionPctMismatches: CompletionPctChange[] = [];
  // Readers take completion from implementation summaries, so rewriting spec.md
  // would only change fingerprints.
  for (const specPath of descendantSpecFiles) {
    const change = syncCompletionPct(specPath);
    if (change === null) {
      continue;
    }
    completionPctMismatches.push(change);
  }

  return {
    dryRun: options.dryRun,
    phaseParentPath,
    directChildren: childFolders.length,
    descendantSpecFiles: descendantSpecFiles.length,
    phaseMapRowsCorrected: phaseMapResult.changes.length,
    completionPctMismatchesFound: completionPctMismatches.length,
    phaseMapChanges: phaseMapResult.changes,
    completionPctMismatches,
    warnings,
  };
}

/** Parse CLI arguments for the scoped sync script. */
export function planSyncPhaseMapStatus(argv: string[]): SyncPlan {
  let dryRun = false;
  let phaseParentPath: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (arg === '--phase-parent') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) {
        return { ok: false, error: '--phase-parent requires a folder path' };
      }
      phaseParentPath = value;
      index += 1;
      continue;
    }
    if (arg.startsWith('-')) {
      return { ok: false, error: `unknown argument: ${arg}` };
    }
    if (phaseParentPath !== null) {
      return { ok: false, error: `unexpected extra argument: ${arg}` };
    }
    phaseParentPath = arg;
  }

  if (phaseParentPath === null) {
    return { ok: false, error: 'phase parent folder path is required' };
  }
  const resolved = path.resolve(phaseParentPath);
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    return { ok: false, error: `phase parent folder does not exist: ${resolved}` };
  }
  if (!fs.existsSync(path.join(resolved, 'spec.md'))) {
    return { ok: false, error: `phase parent is missing spec.md: ${resolved}` };
  }
  return { ok: true, options: { phaseParentPath: resolved, dryRun } };
}

function formatSummary(summary: SyncSummary): string {
  const lines = [
    `sync-phase-map-status ${summary.dryRun ? '(dry-run)' : '(write)'}`,
    `phaseParentPath: ${summary.phaseParentPath}`,
    `directChildren: ${summary.directChildren}`,
    `descendantSpecFiles: ${summary.descendantSpecFiles}`,
    `phaseMapRowsCorrected: ${summary.phaseMapRowsCorrected}`,
    `completionPctMismatchesFound: ${summary.completionPctMismatchesFound}`,
  ];

  if (summary.phaseMapChanges.length > 0) {
    lines.push('phaseMapChanges:');
    for (const change of summary.phaseMapChanges) {
      lines.push(`- ${path.relative(process.cwd(), change.filePath)} :: ${change.childFolder}: ${change.from} -> ${change.to} (${change.source})`);
    }
  }
  if (summary.completionPctMismatches.length > 0) {
    lines.push('completionPctMismatches (reported, not written):');
    for (const change of summary.completionPctMismatches) {
      lines.push(`- ${path.relative(process.cwd(), change.filePath)}: ${change.from} -> ${change.to} (${change.reason})`);
    }
  }
  if (summary.warnings.length > 0) {
    lines.push('warnings:');
    for (const warning of summary.warnings) {
      lines.push(`- ${warning}`);
    }
  }
  return `${lines.join('\n')}\n`;
}

function runCli(): void {
  const plan = planSyncPhaseMapStatus(process.argv.slice(2));
  if (!plan.ok) {
    process.stderr.write(`sync-phase-map-status: ${plan.error}\n`);
    process.exitCode = 1;
    return;
  }
  const summary = runSyncPhaseMapStatus(plan.options);
  process.stdout.write(formatSummary(summary));
}

if (isMainModule(import.meta.url)) {
  runCli();
}
