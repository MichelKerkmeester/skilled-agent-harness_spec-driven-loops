import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runSyncPhaseMapStatus } from '../spec/sync-phase-map-status';

const fixtureRoot = path.resolve(__dirname, 'fixtures', 'sync-phase-map-status');
const tempRoots = new Set<string>();

function copyFixture(name: string): string {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-phase-map-status-'));
  tempRoots.add(tempRoot);
  const target = path.join(tempRoot, name);
  fs.cpSync(path.join(fixtureRoot, name), target, { recursive: true });
  return target;
}

function readFixtureFile(parentPath: string, relativePath: string): string {
  return fs.readFileSync(path.join(parentPath, relativePath), 'utf8');
}

function createTempParent(
  children: Array<{ readonly folder: string; readonly status: string }>,
  mapRows: Array<{ readonly folder: string; readonly status: string }>,
  blankLineAfterRow?: number,
): string {
  const parentPath = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-phase-map-status-'));
  tempRoots.add(parentPath);

  const mapLines: string[] = [];
  for (const [index, row] of mapRows.entries()) {
    mapLines.push(
      `| ${String(index + 1).padStart(3, '0')} | \`${row.folder}/\` | Test child documentation | ${row.status} |`,
    );
    if (blankLineAfterRow === index + 1) {
      mapLines.push('');
    }
  }

  const parentSpec = [
    '---',
    'title: "Fixture Parent"',
    '_memory:',
    '  continuity:',
    '    completion_pct: 100',
    '---',
    '# Fixture Parent',
    '',
    '<!-- ANCHOR:phase-map -->',
    '## PHASE DOCUMENTATION MAP',
    '',
    '| Phase | Folder | Focus | Status |',
    '|-------|--------|-------|--------|',
    ...mapLines,
    '<!-- /ANCHOR:phase-map -->',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(parentPath, 'spec.md'), parentSpec, 'utf8');

  for (const child of children) {
    const childPath = path.join(parentPath, child.folder);
    fs.mkdirSync(childPath, { recursive: true });
    fs.writeFileSync(
      path.join(childPath, 'spec.md'),
      [
        '---',
        `title: "${child.folder}"`,
        'completion_pct: 0',
        '---',
        `# ${child.folder}`,
        '',
        '## 1. METADATA',
        '',
        '| Field | Value |',
        '|-------|-------|',
        `| **Status** | ${child.status} |`,
        '',
      ].join('\n'),
      'utf8',
    );
  }

  return parentPath;
}

function snapshotFiles(rootPath: string): Map<string, string> {
  const snapshot = new Map<string, string>();

  function walk(currentPath: string): void {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
      } else {
        snapshot.set(path.relative(rootPath, entryPath), fs.readFileSync(entryPath, 'utf8'));
      }
    }
  }

  walk(rootPath);
  return snapshot;
}

afterEach(() => {
  for (const root of tempRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  tempRoots.clear();
});

describe('sync-phase-map-status', () => {
  it('corrects a stale Draft parent-map row from the child spec status', () => {
    const parentPath = copyFixture('mixed-parent');

    const summary = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(summary.phaseMapRowsCorrected).toBe(1);
    expect(summary.phaseMapChanges).toEqual([
      expect.objectContaining({
        childFolder: '001-complete-stale',
        from: 'Draft',
        to: 'Complete',
        source: 'spec',
      }),
    ]);
    expect(readFixtureFile(parentPath, 'spec.md')).toContain(
      '| 001 | `001-complete-stale/` | Completed child with stale parent map row | Complete |',
    );
  });

  it('leaves an already-correct parent-map row unchanged', () => {
    const parentPath = copyFixture('mixed-parent');

    const summary = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(summary.phaseMapChanges.some((change) => change.childFolder === '002-complete-current')).toBe(false);
    expect(readFixtureFile(parentPath, 'spec.md')).toContain(
      '| 002 | `002-complete-current/` | Completed child with current parent map row | Complete |',
    );
  });

  it('does not force-complete explicitly in-progress or not-started children', () => {
    const parentPath = copyFixture('mixed-parent');

    const summary = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(summary.phaseMapChanges.some((change) => change.childFolder === '003-in-progress')).toBe(false);
    expect(summary.phaseMapChanges.some((change) => change.childFolder === '004-not-started')).toBe(false);
    expect(readFixtureFile(parentPath, 'spec.md')).toContain(
      '| 003 | `003-in-progress/` | Child still in progress | In Progress |',
    );
    expect(readFixtureFile(parentPath, 'spec.md')).toContain(
      '| 004 | `004-not-started/` | Child not started yet | Not Started |',
    );
    expect(readFixtureFile(parentPath, '003-in-progress/spec.md')).toContain('completion_pct: 0');
    expect(readFixtureFile(parentPath, '004-not-started/spec.md')).toContain('completion_pct: 0');
  });

  it('reports descendant completion_pct mismatches without writing them', () => {
    const parentPath = copyFixture('mixed-parent');

    const summary = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(summary.completionPctMismatchesFound).toBe(2);
    expect(readFixtureFile(parentPath, '001-complete-stale/spec.md')).toContain('completion_pct: 0');
    expect(readFixtureFile(parentPath, '001-complete-stale/001-grandchild/spec.md')).toContain('completion_pct: 0');
  });

  it('keeps rows idempotent and reports the same completion mismatches without writing files', () => {
    const parentPath = copyFixture('mixed-parent');

    const firstRun = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });
    const filesBeforeSecondRun = snapshotFiles(parentPath);
    const secondRun = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(secondRun.phaseMapRowsCorrected).toBe(0);
    expect(firstRun.completionPctMismatchesFound).toBe(2);
    expect(secondRun.completionPctMismatchesFound).toBe(2);
    expect(secondRun.phaseMapChanges).toEqual([]);
    expect(secondRun.completionPctMismatches).toEqual(firstRun.completionPctMismatches);
    expect(snapshotFiles(parentPath)).toEqual(filesBeforeSecondRun);
  });

  it('leaves a lowercase complete map row unchanged when the child status is Complete', () => {
    const parentPath = createTempParent(
      [{ folder: '001-lowercase-complete', status: 'Complete' }],
      [{ folder: '001-lowercase-complete', status: 'complete' }],
    );
    const originalRow = '| 001 | `001-lowercase-complete/` | Test child documentation | complete |';

    const summary = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(summary.phaseMapRowsCorrected).toBe(0);
    expect(readFixtureFile(parentPath, 'spec.md')).toContain(originalRow);
  });

  it('leaves a Done map row unchanged when the child status is Complete', () => {
    const parentPath = createTempParent(
      [{ folder: '001-done', status: 'Complete' }],
      [{ folder: '001-done', status: 'Done' }],
    );
    const originalRow = '| 001 | `001-done/` | Test child documentation | Done |';

    const summary = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(summary.phaseMapRowsCorrected).toBe(0);
    expect(readFixtureFile(parentPath, 'spec.md')).toContain(originalRow);
  });

  it('uses only the leading child status when updating a map row', () => {
    const parentPath = createTempParent(
      [{ folder: '001-release-note', status: 'Complete (shipped in the v4 release)' }],
      [{ folder: '001-release-note', status: 'Draft' }],
    );

    const summary = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(summary.phaseMapChanges).toEqual([
      expect.objectContaining({ from: 'Draft', to: 'Complete' }),
    ]);
    expect(readFixtureFile(parentPath, 'spec.md')).toContain(
      '| 001 | `001-release-note/` | Test child documentation | Complete |',
    );
    expect(readFixtureFile(parentPath, 'spec.md')).not.toContain('shipped in the v4 release');
  });

  it('warns when a blank line ends the table and reports later children without rows', () => {
    const parentPath = createTempParent(
      [
        { folder: '001-first', status: 'In Progress' },
        { folder: '002-second', status: 'In Progress' },
        { folder: '003-third', status: 'In Progress' },
      ],
      [
        { folder: '001-first', status: 'In Progress' },
        { folder: '002-second', status: 'In Progress' },
        { folder: '003-third', status: 'In Progress' },
      ],
      2,
    );
    const parentSpecPath = path.join(parentPath, 'spec.md');

    const summary = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(summary.warnings).toContain(
      `blank line at ${parentSpecPath}:16 ends the Phase Documentation Map table; rows after it are not read`,
    );
    expect(summary.warnings).toContain(
      `no Phase Documentation Map row for 003-third: ${parentSpecPath}`,
    );
  });

  it('warns when a child has no Phase Documentation Map row', () => {
    const parentPath = createTempParent(
      [{ folder: '001-unlisted', status: 'In Progress' }],
      [],
    );
    const parentSpecPath = path.join(parentPath, 'spec.md');

    const summary = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(summary.warnings).toContain(
      `no Phase Documentation Map row for 001-unlisted: ${parentSpecPath}`,
    );
  });
});
