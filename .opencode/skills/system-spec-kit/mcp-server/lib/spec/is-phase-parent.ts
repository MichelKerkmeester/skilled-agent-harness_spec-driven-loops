// ───────────────────────────────────────────────────────────────
// MODULE: Is Phase Parent
// ───────────────────────────────────────────────────────────────
// Single-source-of-truth detection rule for phase-parent folders.
// Contract: a folder is a phase parent when:
//   1. It has ≥1 direct child matching ^[0-9]{3}-[a-z0-9-]+$
//   2. ≥1 such child has spec.md OR description.json

import * as fs from 'fs';
import * as path from 'path';

import { isSpecLeafSegment } from '../config/spec-doc-paths.js';
import { isGeneratorHardeningEnabled } from '../config/capability-flags.js';

const PHASE_CHILD_REGEX = /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/;

/** One direct phase-child of a spec folder and whether it carries a spec doc. */
export interface PhaseChildEntry {
  /** The child directory name (a spec-leaf segment). */
  name: string;
  /** Whether the child carries spec.md or description.json (the phase-parent qualifier). */
  qualifies: boolean;
}

/**
 * Enumerate the direct phase-child directories of a spec folder, one contract for both
 * the phase-parent classification and the derived children list.
 *
 * A child is any direct subdirectory whose name is a spec-leaf segment; `qualifies` marks
 * the ones carrying spec.md or description.json. `isPhaseParent` reads `qualifies` while the
 * graph children list maps every entry, so the parent classification can never count a
 * child the children list omits. Returns an empty list when the folder cannot be read.
 *
 * @param specFolderAbsPath - Absolute path to the candidate phase-parent folder
 * @returns The sorted phase-child entries with their qualification flag
 */
export function listPhaseChildren(specFolderAbsPath: string): PhaseChildEntry[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(specFolderAbsPath, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .filter((entry) => entry.isDirectory() && isSpecLeafSegment(entry.name))
    .map((entry) => {
      const childPath = path.join(specFolderAbsPath, entry.name);
      const qualifies = fs.existsSync(path.join(childPath, 'spec.md'))
        || fs.existsSync(path.join(childPath, 'description.json'));
      return { name: entry.name, qualifies };
    })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

// Thresholds for phase-parent health classification. Buckets are
// chosen to surface manifest sprawl early without breaking validation flow.
// `warning` = manifest readability degrading; `error` = manifest unmanageable
// in a single review pass. Buckets are advisory; callers decide whether to
// fail validation or merely report.
export const PHASE_PARENT_WARNING_THRESHOLD = 20;
export const PHASE_PARENT_ERROR_THRESHOLD = 40;

export type PhaseParentHealthStatus = 'ok' | 'warning' | 'error' | 'not_phase_parent';

export interface PhaseParentHealth {
  childCount: number;
  status: PhaseParentHealthStatus;
  recommendation: string;
}

export function isPhaseParent(specFolderAbsPath: string): boolean {
  // With the hardening flag on, the classification reads the same listPhaseChildren
  // enumeration the derived children list maps, so the two can never disagree. With the
  // flag off this keeps the legacy direct-readdir detection byte-identical.
  if (isGeneratorHardeningEnabled()) {
    return listPhaseChildren(specFolderAbsPath).some((child) => child.qualifies);
  }

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

// Counts direct phase children regardless of whether each child
// has spec.md/description.json. Counting all NNN-named direct children
// reflects manifest size (what an author actually scrolls past), not the
// strict phase-parent qualifier. Returns 0 when the folder is not a phase
// parent or cannot be read.
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

// Lightweight health assessment for phase-parent folders. Returns
// a non-mutating advisory record consumable by validation rules and tooling.
// `ok` => under warning threshold; `warning` => 20-40 children (consider
// summarized manifest); `error` => >40 children (manifest unreadable, split
// recommended); `not_phase_parent` => folder is not a phase parent.
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
