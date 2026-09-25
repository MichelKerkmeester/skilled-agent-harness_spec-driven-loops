// ───────────────────────────────────────────────────────────────────
// TEST: Upgrade Baseline Recorded Findings
// ───────────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { __testables } from '../lib/validation/orchestrator.js';
import type { ValidationEntry } from '../lib/validation/orchestrator.js';

const { applyRecordedFindings } = __testables;

const createdRoots = new Set<string>();

// Builds the packet shape the baseline hook resolves against: an active
// packet filed under a normal track, or a frozen snapshot under the archive.
function makePacket(archived: boolean): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-baseline-'));
  createdRoots.add(root);
  const track = archived ? 'z_archive' : 'system-spec-kit';
  const folder = path.join(root, 'specs', track, '001-fixture');
  fs.mkdirSync(folder, { recursive: true });
  return folder;
}

// A raw string body, so malformed JSON can be written verbatim.
function writeBaseline(folder: string, body: string): void {
  fs.writeFileSync(path.join(folder, 'upgrade-baseline.json'), body, 'utf8');
}

function baselineJson(
  findings: Array<{ rule: string; detail?: string }>,
  schema = 1,
): string {
  return JSON.stringify({
    schema,
    recordedBy: 'upgrade-legacy',
    recordedAt: '2026-06-22T00:00:00.000Z',
    findings,
  });
}

function errorEntry(
  rule: string,
  details: string[],
  message = 'm',
): ValidationEntry {
  return { rule, status: 'error', message, details };
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('applyRecordedFindings', () => {
  it('downgrades an error entry when every detail is recorded', () => {
    const folder = makePacket(false);
    writeBaseline(folder, baselineJson([
      { rule: 'SPEC_DOC_SUFFICIENCY', detail: 'plan.md:12: broken link' },
      { rule: 'SPEC_DOC_SUFFICIENCY', detail: 'tasks.md:3: open checkbox' },
    ]));
    const entries = [errorEntry('SPEC_DOC_SUFFICIENCY', [
      'plan.md:12: broken link',
      'tasks.md:3: open checkbox',
    ])];
    applyRecordedFindings(folder, entries);
    expect(entries[0].status).toBe('warn');
    expect(entries[0].recorded).toBe(true);
  });

  it('keeps an error entry when one detail is not recorded', () => {
    const folder = makePacket(false);
    writeBaseline(folder, baselineJson([
      { rule: 'SPEC_DOC_SUFFICIENCY', detail: 'plan.md:12: broken link' },
    ]));
    const entries = [errorEntry('SPEC_DOC_SUFFICIENCY', [
      'plan.md:12: broken link',
      'tasks.md:3: open checkbox',
    ])];
    applyRecordedFindings(folder, entries);
    expect(entries[0].status).toBe('error');
    expect(entries[0].recorded).toBeUndefined();
  });

  it('matches a recorded detail across shifted line numbers', () => {
    const folder = makePacket(false);
    writeBaseline(folder, baselineJson([
      { rule: 'SPEC_DOC_SUFFICIENCY', detail: 'plan.md:12: broken link' },
      { rule: 'ANCHOR_INTEGRITY', detail: 'line=9 x' },
    ]));
    const entries = [
      errorEntry('SPEC_DOC_SUFFICIENCY', ['plan.md:17: broken link']),
      errorEntry('ANCHOR_INTEGRITY', ['line=40 x']),
    ];
    applyRecordedFindings(folder, entries);
    expect(entries[0].status).toBe('warn');
    expect(entries[0].recorded).toBe(true);
    expect(entries[1].status).toBe('warn');
    expect(entries[1].recorded).toBe(true);
  });

  it('never downgrades a re-derive rule in an active packet, but does in an archive', () => {
    const finding = { rule: 'GENERATED_METADATA_DRIFT', detail: 'graph-metadata.json: stale' };
    const activeFolder = makePacket(false);
    writeBaseline(activeFolder, baselineJson([finding]));
    const activeEntries = [errorEntry('GENERATED_METADATA_DRIFT', ['graph-metadata.json: stale'])];
    applyRecordedFindings(activeFolder, activeEntries);
    expect(activeEntries[0].status).toBe('error');
    expect(activeEntries[0].recorded).toBeUndefined();

    const archivedFolder = makePacket(true);
    writeBaseline(archivedFolder, baselineJson([finding]));
    const archivedEntries = [errorEntry('GENERATED_METADATA_DRIFT', ['graph-metadata.json: stale'])];
    applyRecordedFindings(archivedFolder, archivedEntries);
    expect(archivedEntries[0].status).toBe('warn');
    expect(archivedEntries[0].recorded).toBe(true);
  });

  it('leaves entries alone for a malformed baseline in any variant', () => {
    const folder = makePacket(false);
    const variants = [
      '{ not json',
      baselineJson([{ rule: 'SPEC_DOC_SUFFICIENCY', detail: 'plan.md:12: broken link' }], 2),
      baselineJson([{ rule: 'SPEC_DOC_SUFFICIENCY' }]),
    ];
    for (const body of variants) {
      writeBaseline(folder, body);
      const entries = [errorEntry('SPEC_DOC_SUFFICIENCY', ['plan.md:12: broken link'])];
      applyRecordedFindings(folder, entries);
      expect(entries[0].status).toBe('error');
      expect(entries[0].recorded).toBeUndefined();
    }
  });

  it('leaves entries deeply unchanged when no baseline file exists', () => {
    const folder = makePacket(false);
    const entries: ValidationEntry[] = [
      errorEntry('SPEC_DOC_SUFFICIENCY', ['plan.md:12: broken link']),
      { rule: 'ANCHOR_INTEGRITY', status: 'warn', message: 'w', details: [] },
      { rule: 'LEVEL_DECLARED', status: 'pass', message: 'p', details: [] },
    ];
    const before = structuredClone(entries);
    applyRecordedFindings(folder, entries);
    expect(entries).toEqual(before);
  });

  it('matches an entry without details on its message', () => {
    const folder = makePacket(false);
    writeBaseline(folder, baselineJson([
      { rule: 'SPEC_DOC_SUFFICIENCY', detail: 'plan.md:12: stale link' },
    ]));
    const entries = [errorEntry('SPEC_DOC_SUFFICIENCY', [], 'plan.md:12: stale link')];
    applyRecordedFindings(folder, entries);
    expect(entries[0].status).toBe('warn');
    expect(entries[0].recorded).toBe(true);
  });

  it('never changes a warn or pass entry even when its details are recorded', () => {
    const folder = makePacket(false);
    writeBaseline(folder, baselineJson([
      { rule: 'SPEC_DOC_SUFFICIENCY', detail: 'plan.md:12: broken link' },
      { rule: 'ANCHOR_INTEGRITY', detail: 'plan.md:12: broken link' },
    ]));
    const entries: ValidationEntry[] = [
      { rule: 'SPEC_DOC_SUFFICIENCY', status: 'warn', message: 'm', details: ['plan.md:12: broken link'] },
      { rule: 'ANCHOR_INTEGRITY', status: 'pass', message: 'm', details: ['plan.md:12: broken link'] },
    ];
    const before = structuredClone(entries);
    applyRecordedFindings(folder, entries);
    expect(entries).toEqual(before);
  });

  it('keeps an error entry when a recorded detail appears again at a new line', () => {
    const folder = makePacket(false);
    writeBaseline(folder, baselineJson([
      { rule: 'SPEC_DOC_SUFFICIENCY', detail: 'plan.md:12: broken link' },
    ]));
    const entries = [errorEntry('SPEC_DOC_SUFFICIENCY', [
      'plan.md:17: broken link',
      'plan.md:90: broken link',
    ])];
    applyRecordedFindings(folder, entries);
    expect(entries[0].status).toBe('error');
    expect(entries[0].recorded).toBeUndefined();
  });

  it('treats a packet as active when only a folder above specs is named z_archive', () => {
    const outer = fs.mkdtempSync(path.join(os.tmpdir(), 'upgrade-baseline-'));
    createdRoots.add(outer);
    const folder = path.join(outer, 'z_archive', 'checkout', 'specs', 'system-spec-kit', '001-fixture');
    fs.mkdirSync(folder, { recursive: true });
    writeBaseline(folder, baselineJson([
      { rule: 'GENERATED_METADATA_DRIFT', detail: 'graph-metadata.json: stale' },
    ]));
    const entries = [errorEntry('GENERATED_METADATA_DRIFT', ['graph-metadata.json: stale'])];
    applyRecordedFindings(folder, entries);
    expect(entries[0].status).toBe('error');
    expect(entries[0].recorded).toBeUndefined();
  });
});
