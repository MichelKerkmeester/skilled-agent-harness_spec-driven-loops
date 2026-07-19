// ───────────────────────────────────────────────────────────────────
// MODULE: Is Phase Parent
// ───────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as path from 'path';

const PHASE_CHILD_REGEX = /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/;

// The graph-metadata writer enumerates a spec folder's children by directory
// name alone — every immediate subdirectory whose name is a spec-leaf segment
// (three digits, optionally followed by '-' or '_' and more) — and folds them
// into children_ids by union: it adds derived children and never prunes. This
// pattern mirrors that writer-side membership rule so a read-only check can
// predict exactly which children a refresh would add. It is deliberately looser
// than PHASE_CHILD_REGEX: manifest classification wants the strict slug shape,
// but child-drift detection must match whatever the writer would actually derive
// (including bare-number and underscore folders the strict rule excludes).
const DERIVED_CHILD_REGEX = /^[0-9]{3}(?:[-_].+)?$/;

// Thresholds for phase-parent manifest health. Mirrors the
// authoritative copy in mcp-server/lib/spec/is-phase-parent.ts so shell rules
// and TypeScript runtime callers see identical buckets.
export const PHASE_PARENT_WARNING_THRESHOLD = 20;
export const PHASE_PARENT_ERROR_THRESHOLD = 40;

/** Advisory status bucket for a phase-parent folder's direct child count. */
export type PhaseParentHealthStatus = 'ok' | 'warning' | 'error' | 'not_phase_parent';

/** Advisory health summary for a candidate phase-parent folder. */
export interface PhaseParentHealth {
  childCount: number;
  status: PhaseParentHealthStatus;
  recommendation: string;
}

/**
 * Return true when a folder has at least one direct phase child with spec metadata.
 */
export function isPhaseParent(specFolderAbsPath: string): boolean {
  let entries: string[];

  try {
    entries = fs.readdirSync(specFolderAbsPath);
  } catch {
    return false;
  }

  const phaseChildren = entries.filter((name) => PHASE_CHILD_REGEX.test(name));

  if (phaseChildren.length === 0) return false;

  for (const child of phaseChildren) {
    const childPath = path.join(specFolderAbsPath, child);
    try {
      if (!fs.statSync(childPath).isDirectory()) continue;
    } catch {
      continue;
    }
    if (
      fs.existsSync(path.join(childPath, 'spec.md')) ||
      fs.existsSync(path.join(childPath, 'description.json'))
    ) {
      return true;
    }
  }

  return false;
}

// Counts ALL direct NNN-named children regardless of whether
// each has spec.md/description.json — this reflects manifest size (visual
// scroll length), not the strict phase-parent qualifier.
function countPhaseChildren(specFolderAbsPath: string): number {
  try {
    const entries = fs.readdirSync(specFolderAbsPath);
    return entries.filter((name) => {
      if (!PHASE_CHILD_REGEX.test(name)) return false;
      try {
        return fs.statSync(path.join(specFolderAbsPath, name)).isDirectory();
      } catch {
        return false;
      }
    }).length;
  } catch {
    return 0;
  }
}

/**
 * List the direct child directory names the graph-metadata writer would derive
 * for a spec folder: every immediate subdirectory whose name is a spec-leaf
 * segment, regardless of whether it yet carries spec docs. A name returned here
 * that is absent from the folder's persisted children_ids is a child the writer
 * would add on its next refresh — the sole truthful child-drift signal, since
 * the writer unions and never prunes (a listed entry with no matching folder is
 * left untouched, so it is not drift the writer would ever reconcile).
 */
export function listDerivedChildNames(specFolderAbsPath: string): string[] {
  try {
    return fs
      .readdirSync(specFolderAbsPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && DERIVED_CHILD_REGEX.test(entry.name))
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

// Lightweight advisory health record — same logic as
// mcp-server/lib/spec/is-phase-parent.ts so shell and TS runtime agree.
/** Assess the manifest-size health of a phase-parent folder. */
export function assessPhaseParentHealth(specFolderAbsPath: string): PhaseParentHealth {
  if (!isPhaseParent(specFolderAbsPath)) {
    return {
      childCount: 0,
      status: 'not_phase_parent',
      recommendation: 'Folder is not a phase parent; health check skipped.',
    };
  }

  const childCount = countPhaseChildren(specFolderAbsPath);

  if (childCount >= PHASE_PARENT_ERROR_THRESHOLD) {
    return {
      childCount,
      status: 'error',
      recommendation: `${childCount} children exceeds error threshold (${PHASE_PARENT_ERROR_THRESHOLD}). Split into nested phase parents or move historical phases under z_archive/ to keep the manifest readable.`,
    };
  }

  if (childCount >= PHASE_PARENT_WARNING_THRESHOLD) {
    return {
      childCount,
      status: 'warning',
      recommendation: `${childCount} children meets warning threshold (>=${PHASE_PARENT_WARNING_THRESHOLD}). Consider a summarized manifest in spec.md or grouping completed phases under z_archive/.`,
    };
  }

  return {
    childCount,
    status: 'ok',
    recommendation: `${childCount} children is within healthy manifest size (<${PHASE_PARENT_WARNING_THRESHOLD}).`,
  };
}

// CLI entrypoint so shell rules can shell-out without a separate
// JS wrapper. Usage: `node scripts/dist/spec/is-phase-parent.js health <folder>`
// emits one line: `<status>\t<childCount>\t<recommendation>` (tab-separated).
// Invoking with `check <folder>` keeps the original boolean exit-code contract
// (exit 0 = is phase parent, exit 1 = not). Invoking with `children <folder>`
// emits the writer-derived child directory names, one per line, for drift checks.
function runCli(): void {
  const [, , command, folderArg] = process.argv;
  if (!command || !folderArg) {
    return;
  }
  const absFolder = path.resolve(folderArg);
  if (command === 'check') {
    process.exit(isPhaseParent(absFolder) ? 0 : 1);
  }
  if (command === 'health') {
    const health = assessPhaseParentHealth(absFolder);
    process.stdout.write(
      `${health.status}\t${health.childCount}\t${health.recommendation}\n`,
    );
    process.exit(0);
  }
  if (command === 'children') {
    const names = listDerivedChildNames(absFolder);
    process.stdout.write(names.length ? `${names.join('\n')}\n` : '');
    process.exit(0);
  }
}

// Run CLI only when executed directly, never on import.
const invokedDirectly =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  process.argv[1] &&
  /is-phase-parent\.(?:js|ts)$/.test(process.argv[1]);
if (invokedDirectly) {
  runCli();
}
