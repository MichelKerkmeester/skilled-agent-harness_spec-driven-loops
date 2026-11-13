// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Runtime List Parity
// ───────────────────────────────────────────────────────────────
// The advisor runtime label set is spelled by hand in three places that
// no compiler ties together: the hooks-tree index directories, the bold
// runtime names in the hook reference's adapter table, and
// ADVISOR_RUNTIME_VALUES. A label added to one and missed in another
// silently drops a runtime from the brief or from the hook wiring, so the
// comparison is pure and tested directly, not only through the real files.

import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ADVISOR_RUNTIME_VALUES } from '../../lib/advisor-runtime-values.js';
import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';

// ───────────────────────────────────────────────────────────────
// 1. COMPARISON
// ───────────────────────────────────────────────────────────────

export interface RuntimeListGaps {
  readonly missingFromIndex: string[];
  readonly missingFromTable: string[];
  readonly missingFromEnum: string[];
}

// Only a single-word bold name counts as a table row. A second table that
// shares the document writes plain-text runtime names, so it stays invisible
// here and cannot mask a missing adapter row.
const TABLE_ROW_PATTERN = /^\| \*\*([A-Za-z]+)\*\* \|/;

function normalize(names: readonly string[]): string[] {
  const seen = new Set<string>();
  for (const name of names) {
    const normalized = name.trim().toLowerCase();
    if (normalized.length > 0) seen.add(normalized);
  }
  return [...seen].sort();
}

/** A list is missing every name its union carries but the list itself does not. */
function gapsAgainst(union: readonly string[], names: readonly string[]): string[] {
  const present = new Set(normalize(names));
  return union.filter((name) => !present.has(name));
}

/**
 * Report the runtime names missing from each list, treating the union of all
 * three as the reference set. A name an extra list carries is therefore
 * reported against the lists that lack it, which is what makes a one-sided
 * addition visible. The caller decides what a gap means: the suite below
 * requires none across the real files.
 */
export function compareRuntimeLists(
  index: readonly string[],
  table: readonly string[],
  enumValues: readonly string[],
): RuntimeListGaps {
  const union = [...new Set([
    ...normalize(index),
    ...normalize(table),
    ...normalize(enumValues),
  ])].sort();
  return {
    missingFromIndex: gapsAgainst(union, index),
    missingFromTable: gapsAgainst(union, table),
    missingFromEnum: gapsAgainst(union, enumValues),
  };
}

// ───────────────────────────────────────────────────────────────
// 2. REAL LISTS
// ───────────────────────────────────────────────────────────────

const REPO_ROOT = findAdvisorWorkspaceRoot(import.meta.dirname);
const INDEX_DIR = resolve(REPO_ROOT, '.skilled/hooks/skill-advisor');
const HOOK_DOC_PATH = resolve(
  REPO_ROOT,
  '.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md',
);

function readIndexNames(): string[] {
  return readdirSync(INDEX_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function readTableNames(): string[] {
  const names: string[] = [];
  for (const line of readFileSync(HOOK_DOC_PATH, 'utf8').split('\n')) {
    const match = TABLE_ROW_PATTERN.exec(line);
    if (match) names.push(match[1].toLowerCase());
  }
  return names;
}

// ───────────────────────────────────────────────────────────────
// 3. SUITE
// ───────────────────────────────────────────────────────────────

describe('advisor runtime list parity', () => {
  it('reports no gaps across the hooks index, the adapter table and the canonical enum', () => {
    const indexNames = readIndexNames();
    const tableNames = readTableNames();
    // Empty lists would agree with each other and with an empty enum. Three
    // non-empty reads keep the agreement assertion from passing on nothing.
    expect(indexNames.length).toBeGreaterThan(0);
    expect(tableNames.length).toBeGreaterThan(0);
    expect(ADVISOR_RUNTIME_VALUES.length).toBeGreaterThan(0);
    const gaps = compareRuntimeLists(indexNames, tableNames, ADVISOR_RUNTIME_VALUES);
    expect(gaps).toEqual({
      missingFromIndex: [],
      missingFromTable: [],
      missingFromEnum: [],
    });
  });

  it('reports a name that only one list carries', () => {
    const gaps = compareRuntimeLists(
      [...readIndexNames(), 'aider'],
      readTableNames(),
      ADVISOR_RUNTIME_VALUES,
    );
    expect(gaps.missingFromIndex).toEqual([]);
    expect(gaps.missingFromTable).toContain('aider');
    expect(gaps.missingFromEnum).toContain('aider');
  });
});
