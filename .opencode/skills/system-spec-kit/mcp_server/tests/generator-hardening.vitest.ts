// ───────────────────────────────────────────────────────────────────
// MODULE: Generator Hardening tests
// ───────────────────────────────────────────────────────────────────
// Covers the three generator-hardening behaviors behind SPECKIT_GENERATOR_HARDENING and
// the grandfather report mode: the source_fingerprint write and strict read, the unified
// phase-child contract, and the access/freshness telemetry split.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  GENERATOR_HARDENING_ENV,
  GENERATED_METADATA_GRANDFATHER_ENV,
} from '../lib/config/capability-flags.js';
import {
  computeSourceFingerprintForFolder,
  deriveGraphMetadata,
  refreshGraphMetadataForSpecFolder,
  resolveChildrenIds,
  serializeGraphMetadata,
} from '../lib/graph/graph-metadata-parser.js';
import { graphMetadataSchema } from '../lib/graph/graph-metadata-schema.js';
import { isPhaseParent, listPhaseChildren } from '../lib/spec/is-phase-parent.js';
import {
  readAccessRecord,
  recordAccessEvent,
  recordFreshnessPointer,
  resolveLastActiveChildFromStore,
} from '../lib/graph/access-telemetry.js';
import { followPhaseParentRedirect } from '../lib/resume/resume-ladder.js';
import {
  checkGeneratedMetadataIntegrity,
  resolveGeneratedMetadataIntegrity,
} from '../lib/validation/generated-metadata-integrity.js';

const createdRoots = new Set<string>();
const HARDENING = GENERATOR_HARDENING_ENV;
const GRANDFATHER = GENERATED_METADATA_GRANDFATHER_ENV;
const NOW = '2026-06-22T00:00:00Z';

function makeTrackRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'generator-hardening-'));
  createdRoots.add(root);
  return path.join(root, '.opencode', 'specs', 'system-spec-kit');
}

function writeSpecFolder(absFolder: string, body = '# Fixture\n'): void {
  fs.mkdirSync(absFolder, { recursive: true });
  fs.writeFileSync(path.join(absFolder, 'spec.md'), [
    '---',
    'title: "Generator Hardening Fixture"',
    'description: "Fixture for the generator hardening coverage suite."',
    'trigger_phrases: ["generator hardening"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    body,
  ].join('\n'), 'utf-8');
}

function tempStorePath(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'access-telemetry-'));
  createdRoots.add(root);
  return path.join(root, 'access-telemetry.json');
}

beforeEach(() => {
  delete process.env[HARDENING];
  delete process.env[GRANDFATHER];
});

afterEach(() => {
  delete process.env[HARDENING];
  delete process.env[GRANDFATHER];
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('source_fingerprint (REQ-001)', () => {
  it('omits the field when the flag is off so a flag-off derive stays byte-identical', () => {
    const folder = path.join(makeTrackRoot(), '038-fp-off');
    writeSpecFolder(folder);

    const graph = deriveGraphMetadata(folder, null, { now: NOW });

    expect(graph.derived.source_fingerprint).toBeUndefined();
  });

  it('writes a fingerprint when the flag is on and re-derives identically on unchanged docs', () => {
    process.env[HARDENING] = 'true';
    const folder = path.join(makeTrackRoot(), '038-fp-on');
    writeSpecFolder(folder);

    const first = deriveGraphMetadata(folder, null, { now: NOW });
    const second = deriveGraphMetadata(folder, first, { now: '2026-07-01T00:00:00Z' });

    expect(first.derived.source_fingerprint).toMatch(/^sha256:[0-9a-f]{64}$/);
    // A later timestamp must not move the fingerprint: it is drift-detection, not churn.
    expect(second.derived.source_fingerprint).toBe(first.derived.source_fingerprint);
  });

  it('changes the fingerprint when a source doc body changes', () => {
    process.env[HARDENING] = 'true';
    const folder = path.join(makeTrackRoot(), '038-fp-change');
    writeSpecFolder(folder, '# Fixture\n');
    const before = computeSourceFingerprintForFolder(folder);

    writeSpecFolder(folder, '# Fixture\n\nAn added requirement line.\n');
    const after = computeSourceFingerprintForFolder(folder);

    expect(after).not.toBe(before);
  });

  it('does not dirty the file on a no-op re-derive with the flag on', () => {
    process.env[HARDENING] = 'true';
    const folder = path.join(makeTrackRoot(), '038-fp-idempotent');
    writeSpecFolder(folder);

    const created = refreshGraphMetadataForSpecFolder(folder, { now: NOW });
    expect(created.created).toBe(true);
    const bytesAfterCreate = fs.readFileSync(created.filePath, 'utf-8');

    const rerun = refreshGraphMetadataForSpecFolder(folder, { now: '2026-08-01T00:00:00Z' });
    expect(rerun.created).toBe(false);
    expect(fs.readFileSync(rerun.filePath, 'utf-8')).toBe(bytesAfterCreate);
  });
});

describe('unified phase-child contract (REQ-002)', () => {
  it('makes isPhaseParent, listPhaseChildren and resolveChildrenIds agree on a fixture tree', () => {
    process.env[HARDENING] = 'true';
    const track = makeTrackRoot();
    const parent = path.join(track, '038-parent');
    writeSpecFolder(path.join(parent, '001-qualifying'));
    // A leaf-segment directory with no spec doc: counted as a child id, not a qualifier.
    fs.mkdirSync(path.join(parent, '002-bare'), { recursive: true });

    const children = listPhaseChildren(parent);
    const childIds = resolveChildrenIds(parent, 'system-spec-kit/038-parent');

    expect(isPhaseParent(parent)).toBe(true);
    expect(children.map((c) => c.name)).toEqual(['001-qualifying', '002-bare']);
    expect(children.find((c) => c.name === '001-qualifying')?.qualifies).toBe(true);
    expect(children.find((c) => c.name === '002-bare')?.qualifies).toBe(false);

    // Every child the parent classification counts is present in the derived children list.
    const qualifying = children.filter((c) => c.qualifies).map((c) => `system-spec-kit/038-parent/${c.name}`);
    for (const id of qualifying) {
      expect(childIds).toContain(id);
    }
  });

  it('classifies a folder with only a bare leaf child as not a phase parent', () => {
    process.env[HARDENING] = 'true';
    const parent = path.join(makeTrackRoot(), '038-bare-only');
    fs.mkdirSync(path.join(parent, '001-bare'), { recursive: true });

    expect(isPhaseParent(parent)).toBe(false);
    expect(listPhaseChildren(parent).every((c) => !c.qualifies)).toBe(true);
  });
});

describe('access and freshness telemetry split (REQ-003, REQ-006)', () => {
  it('records a read event in the index-layer store and leaves the generated JSON byte-identical', () => {
    process.env[HARDENING] = 'true';
    const folder = path.join(makeTrackRoot(), '038-access');
    writeSpecFolder(folder);
    const { filePath } = refreshGraphMetadataForSpecFolder(folder, { now: NOW });
    const before = fs.readFileSync(filePath, 'utf-8');

    const storePath = tempStorePath();
    const ok = recordAccessEvent('system-spec-kit/038-access', { now: NOW, storePath });

    expect(ok).toBe(true);
    expect(readAccessRecord('system-spec-kit/038-access', { storePath })?.last_accessed_at).toBe(NOW);
    // The read event never touches the generated file.
    expect(fs.readFileSync(filePath, 'utf-8')).toBe(before);
  });

  it('resolves the last active child from the store after the split', () => {
    const storePath = tempStorePath();
    recordFreshnessPointer('system-spec-kit/038-parent', {
      childId: '001-qualifying',
      at: NOW,
      storePath,
    });

    expect(resolveLastActiveChildFromStore('system-spec-kit/038-parent', { storePath })).toBe('001-qualifying');
  });

  it('makes a resume prefer the store pointer over the generated JSON pointer', () => {
    process.env[HARDENING] = 'true';
    const track = makeTrackRoot();
    const parent = path.join(track, '038-parent');
    const specFolder = 'system-spec-kit/038-parent';
    writeSpecFolder(path.join(parent, '001-store-child'));
    writeSpecFolder(path.join(parent, '002-json-child'));

    // The generated JSON names the json-child; the store names the store-child. The split
    // makes the store authoritative so the resume selects the store-child.
    fs.writeFileSync(
      path.join(parent, 'graph-metadata.json'),
      JSON.stringify({ derived: { last_active_child_id: '002-json-child' } }),
      'utf-8',
    );
    const storePath = tempStorePath();
    recordFreshnessPointer(specFolder, { childId: '001-store-child', at: NOW, storePath });

    const hints: string[] = [];
    const resolved = followPhaseParentRedirect(parent, specFolder, hints, storePath);

    expect(resolved.specFolder).toBe(`${specFolder}/001-store-child`);
  });

  it('falls back to the generated JSON pointer when the store has no entry', () => {
    process.env[HARDENING] = 'true';
    const track = makeTrackRoot();
    const parent = path.join(track, '038-parent');
    const specFolder = 'system-spec-kit/038-parent';
    writeSpecFolder(path.join(parent, '002-json-child'));
    fs.writeFileSync(
      path.join(parent, 'graph-metadata.json'),
      JSON.stringify({ derived: { last_active_child_id: '002-json-child' } }),
      'utf-8',
    );

    const hints: string[] = [];
    const resolved = followPhaseParentRedirect(parent, specFolder, hints, tempStorePath());

    expect(resolved.specFolder).toBe(`${specFolder}/002-json-child`);
  });
});

describe('schema tolerance and strict read under grandfather (REQ-004, REQ-005)', () => {
  it('parses a graph payload with and without source_fingerprint', () => {
    const base = deriveGraphMetadata(
      (() => { const f = path.join(makeTrackRoot(), '038-schema'); writeSpecFolder(f); return f; })(),
      null,
      { now: NOW },
    );

    expect(graphMetadataSchema.safeParse(base).success).toBe(true);
    const withFingerprint = { ...base, derived: { ...base.derived, source_fingerprint: 'sha256:abc' } };
    expect(graphMetadataSchema.safeParse(withFingerprint).success).toBe(true);
  });

  it('reports no fingerprint violation for an un-migrated folder with the flag off', () => {
    const folder = path.join(makeTrackRoot(), '038-unmigrated');
    writeSpecFolder(folder);
    refreshGraphMetadataForSpecFolder(folder, { now: NOW });

    const report = checkGeneratedMetadataIntegrity(folder);

    expect(report.violations.some((v) => v.code.startsWith('SOURCE_FINGERPRINT'))).toBe(false);
  });

  it('reports a missing fingerprint as a non-blocking grandfather note when the rollout is active', () => {
    const folder = path.join(makeTrackRoot(), '038-missing');
    writeSpecFolder(folder);
    // Generate with the flag off so the file carries no fingerprint, then validate under the rollout.
    refreshGraphMetadataForSpecFolder(folder, { now: NOW });

    process.env[HARDENING] = 'true';
    const report = checkGeneratedMetadataIntegrity(folder);
    expect(report.violations.some((v) => v.code === 'SOURCE_FINGERPRINT_MISSING')).toBe(true);

    const reported = resolveGeneratedMetadataIntegrity(report, { grandfather: true });
    expect(reported.status).toBe('info');

    const enforced = resolveGeneratedMetadataIntegrity(report, { grandfather: false });
    expect(enforced.status).toBe('error');
  });

  it('passes the fingerprint read when the file was generated with the flag on', () => {
    process.env[HARDENING] = 'true';
    const folder = path.join(makeTrackRoot(), '038-fresh');
    writeSpecFolder(folder);
    refreshGraphMetadataForSpecFolder(folder, { now: NOW });

    const report = checkGeneratedMetadataIntegrity(folder);

    expect(report.violations.some((v) => v.code.startsWith('SOURCE_FINGERPRINT'))).toBe(false);
  });

  it('detects a stale fingerprint when a source doc changes without a re-derive', () => {
    process.env[HARDENING] = 'true';
    const folder = path.join(makeTrackRoot(), '038-stale');
    writeSpecFolder(folder);
    refreshGraphMetadataForSpecFolder(folder, { now: NOW });

    // Mutate a source doc without re-deriving the metadata: the stored fingerprint no
    // longer matches a re-derive over the current docs.
    writeSpecFolder(folder, '# Fixture\n\nA later edit that was never re-derived.\n');

    const report = checkGeneratedMetadataIntegrity(folder);
    expect(report.violations.some((v) => v.code === 'SOURCE_FINGERPRINT_MISMATCH')).toBe(true);
  });
});
