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

  it('updates descendant completion_pct fields when the descendant is complete', () => {
    const parentPath = copyFixture('mixed-parent');

    const summary = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(summary.completionPctFieldsCorrected).toBe(2);
    expect(readFixtureFile(parentPath, '001-complete-stale/spec.md')).toContain('completion_pct: 100');
    expect(readFixtureFile(parentPath, '001-complete-stale/001-grandchild/spec.md')).toContain('completion_pct: 100');
  });

  it('is idempotent after the first write run', () => {
    const parentPath = copyFixture('mixed-parent');

    runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });
    const secondRun = runSyncPhaseMapStatus({ phaseParentPath: parentPath, dryRun: false });

    expect(secondRun.phaseMapRowsCorrected).toBe(0);
    expect(secondRun.completionPctFieldsCorrected).toBe(0);
    expect(secondRun.phaseMapChanges).toEqual([]);
    expect(secondRun.completionPctChanges).toEqual([]);
  });
});
