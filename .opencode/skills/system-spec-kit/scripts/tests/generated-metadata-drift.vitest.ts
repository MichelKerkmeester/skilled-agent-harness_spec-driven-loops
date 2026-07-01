// ───────────────────────────────────────────────────────────────
// MODULE: Generated Metadata Drift Gate and Shared Synopsis Extractor
// ───────────────────────────────────────────────────────────────
// Proves the two synopsis-and-freshness fixes. The shared extractor derives both the
// description and the causal_summary from one precedence over the same spec.md, each honoring
// its own length limit, so flipping the source doc moves both fields together. The drift gate
// re-derives one folder and reports drift on a changed folder, no drift on an in-sync folder,
// and never writes the folder. source_doc_hashes is the cheap freshness key. The resolver maps
// drift to a non-blocking info under grandfather report mode and to a blocking error when the
// drift-gate flag enforces.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import {
  checkGeneratedMetadataDrift,
  computeSourceDocHashes,
  deriveGraphMetadata,
  derivePacketSynopsis,
  resolveGeneratedMetadataDrift,
  serializeGraphMetadata,
  SYNOPSIS_FIELD_LIMITS,
} from '../../mcp_server/api';

const DRIFT_GATE_FLAG = 'SPECKIT_GENERATED_METADATA_DRIFT_GATE';

// An Overview paragraph longer than the description ceiling so the two fields capture
// different amounts of the same source, which is what proves the per-field limit.
const LONG_OVERVIEW =
  'This packet adds a generated metadata drift gate and a shared synopsis extractor so the '
  + 'description and the causal summary stop diverging from the same source doc and a stale '
  + 'synopsis is provable rather than silently carried forward across many sessions.';

function specWithOverview(overview: string): string {
  return [
    '---',
    'title: "Fixture spec"',
    'description: "Frontmatter description fallback"',
    '---',
    '# Fixture Spec',
    '',
    '## 1. SUMMARY',
    '',
    '### Overview',
    overview,
    '',
    '## 2. PROBLEM',
    '',
    'Some problem text.',
    '',
  ].join('\n');
}

let tmpDir: string;

function writeFolder(files: Record<string, string>): string {
  const folder = fs.mkdtempSync(path.join(tmpDir, 'packet-'));
  for (const [relativePath, content] of Object.entries(files)) {
    const target = path.join(folder, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf-8');
  }
  return folder;
}

function snapshotFolder(folder: string): Record<string, string> {
  const snapshot: Record<string, string> = {};
  for (const entry of fs.readdirSync(folder, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const dir = (entry as unknown as { parentPath?: string; path?: string }).parentPath
      ?? (entry as unknown as { path?: string }).path
      ?? folder;
    const abs = path.join(dir, entry.name);
    const rel = path.relative(folder, abs);
    snapshot[rel] = crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
  }
  return snapshot;
}

function writeDerivedGraph(folder: string): void {
  // Build a graph-metadata.json from the current docs with the drift-gate flag on, so the
  // stored causal_summary comes from the shared extractor and source_doc_hashes are persisted.
  const previous = process.env[DRIFT_GATE_FLAG];
  process.env[DRIFT_GATE_FLAG] = 'true';
  try {
    const metadata = deriveGraphMetadata(folder);
    fs.writeFileSync(path.join(folder, 'graph-metadata.json'), serializeGraphMetadata(metadata), 'utf-8');
  } finally {
    if (previous === undefined) {
      delete process.env[DRIFT_GATE_FLAG];
    } else {
      process.env[DRIFT_GATE_FLAG] = previous;
    }
  }
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'drift-gate-'));
  delete process.env[DRIFT_GATE_FLAG];
});

afterEach(() => {
  delete process.env[DRIFT_GATE_FLAG];
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('shared synopsis extractor (REQ-004, SC-003)', () => {
  it('derives both fields from one precedence over the same source doc with field-specific limits', () => {
    const content = specWithOverview(LONG_OVERVIEW);
    const description = derivePacketSynopsis(content, 'description');
    const causalSummary = derivePacketSynopsis(content, 'causal_summary');

    expect(description.length).toBeLessThanOrEqual(SYNOPSIS_FIELD_LIMITS.description);
    expect(causalSummary.length).toBeLessThanOrEqual(SYNOPSIS_FIELD_LIMITS.causal_summary);
    // The longer ceiling captures more of the same Overview, the shorter is its prefix.
    expect(causalSummary.length).toBeGreaterThan(description.length);
    expect(causalSummary.startsWith(description)).toBe(true);
    expect(causalSummary).toContain('shared synopsis extractor');
  });

  it('moves both fields together when the source doc flips', () => {
    const before = specWithOverview(LONG_OVERVIEW);
    const after = specWithOverview('A completely different overview paragraph that replaces the prior summary text entirely for this packet.');

    const descBefore = derivePacketSynopsis(before, 'description');
    const causalBefore = derivePacketSynopsis(before, 'causal_summary');
    const descAfter = derivePacketSynopsis(after, 'description');
    const causalAfter = derivePacketSynopsis(after, 'causal_summary');

    expect(descAfter).not.toBe(descBefore);
    expect(causalAfter).not.toBe(causalBefore);
    expect(descAfter.startsWith('A completely different overview')).toBe(true);
    expect(causalAfter.startsWith('A completely different overview')).toBe(true);
  });

  it('falls back through the precedence to the title heading when there is no Overview or Problem body', () => {
    const content = ['---', 'title: "t"', '---', '# Only A Title Here', ''].join('\n');
    expect(derivePacketSynopsis(content, 'description')).toBe('Only A Title Here');
  });

  it('does not cut an over-limit synopsis mid-word', () => {
    const prefix = 'word '.repeat(29);
    const content = specWithOverview(`${prefix}resilience`);

    expect(derivePacketSynopsis(content, 'description')).toBe(prefix.trim());
  });

  it('preserves an over-limit synopsis when the cut lands on a word boundary', () => {
    const boundaryWord = 'a'.repeat(SYNOPSIS_FIELD_LIMITS.description);
    const content = specWithOverview(`${boundaryWord} trailing words`);

    expect(derivePacketSynopsis(content, 'description')).toBe(boundaryWord);
  });

  it('passes shorter synopsis strings through unchanged', () => {
    const overview = 'Short synopsis under the limit';

    expect(derivePacketSynopsis(specWithOverview(overview), 'description')).toBe(overview);
  });
});

describe('source_doc_hashes freshness key (REQ-003, SC-004)', () => {
  it('computes a hash per present source doc and a doc edit changes it', () => {
    const folder = writeFolder({ 'spec.md': specWithOverview(LONG_OVERVIEW) });
    const before = computeSourceDocHashes(folder);
    expect(before['spec.md']).toMatch(/^[0-9a-f]{64}$/);

    fs.writeFileSync(path.join(folder, 'spec.md'), specWithOverview('Edited overview text for the freshness key.'), 'utf-8');
    const after = computeSourceDocHashes(folder);
    expect(after['spec.md']).not.toBe(before['spec.md']);
  });

  it('persists source_doc_hashes on the derived metadata only when the flag is on', () => {
    const folder = writeFolder({ 'spec.md': specWithOverview(LONG_OVERVIEW) });

    process.env[DRIFT_GATE_FLAG] = 'false';
    const flagOff = deriveGraphMetadata(folder);
    expect(flagOff.derived.source_doc_hashes).toBeUndefined();

    process.env[DRIFT_GATE_FLAG] = 'true';
    const flagOn = deriveGraphMetadata(folder);
    expect(flagOn.derived.source_doc_hashes?.['spec.md']).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('drift detection (REQ-002, SC-002)', () => {
  it('reports drift when a doc changed after the stored synopsis', () => {
    const folder = writeFolder({ 'spec.md': specWithOverview(LONG_OVERVIEW) });
    writeDerivedGraph(folder);
    fs.writeFileSync(
      path.join(folder, 'description.json'),
      `${JSON.stringify({ specFolder: path.basename(folder), description: derivePacketSynopsis(specWithOverview(LONG_OVERVIEW), 'description') }, null, 2)}\n`,
      'utf-8',
    );

    // The doc changes after both the stored graph metadata and description were derived.
    fs.writeFileSync(path.join(folder, 'spec.md'), specWithOverview('A drastically rewritten overview that no longer matches the stored synopsis fields at all.'), 'utf-8');

    const report = checkGeneratedMetadataDrift(folder);
    expect(report.checked).toBe(true);
    expect(report.hashDrift).toBe(true);
    const driftedFields = report.driftedFields.map((field) => field.field).sort();
    expect(driftedFields).toEqual(['causal_summary', 'description']);
  });

  it('reports no drift for an in-sync folder', () => {
    const folder = writeFolder({ 'spec.md': specWithOverview(LONG_OVERVIEW) });
    writeDerivedGraph(folder);
    fs.writeFileSync(
      path.join(folder, 'description.json'),
      `${JSON.stringify({ specFolder: path.basename(folder), description: derivePacketSynopsis(specWithOverview(LONG_OVERVIEW), 'description') }, null, 2)}\n`,
      'utf-8',
    );

    const report = checkGeneratedMetadataDrift(folder);
    expect(report.checked).toBe(true);
    expect(report.hashDrift).toBe(false);
    expect(report.driftedFields).toEqual([]);
  });

  it('reports an empty derivation rather than drift when there is no source doc', () => {
    const folder = writeFolder({
      'description.json': `${JSON.stringify({ specFolder: 'x', description: 'orphan' })}\n`,
    });
    const report = checkGeneratedMetadataDrift(folder);
    expect(report.checked).toBe(false);
    expect(report.driftedFields).toEqual([]);
  });
});

describe('no-write guarantee (REQ-005)', () => {
  it('leaves the folder bytes unchanged across a drift check', () => {
    const folder = writeFolder({ 'spec.md': specWithOverview(LONG_OVERVIEW) });
    writeDerivedGraph(folder);
    fs.writeFileSync(path.join(folder, 'spec.md'), specWithOverview('Changed overview to force drift before the no-write snapshot.'), 'utf-8');

    const before = snapshotFolder(folder);
    checkGeneratedMetadataDrift(folder);
    const after = snapshotFolder(folder);
    expect(after).toEqual(before);
  });
});

describe('grandfather report mode vs enforced verdict (REQ-001, SC-001)', () => {
  it('maps drift to a non-blocking info under grandfather mode and a blocking error when enforced', () => {
    const folder = writeFolder({ 'spec.md': specWithOverview(LONG_OVERVIEW) });
    writeDerivedGraph(folder);
    fs.writeFileSync(path.join(folder, 'spec.md'), specWithOverview('Rewritten overview so the stored causal summary is now drifted from the current doc.'), 'utf-8');

    const report = checkGeneratedMetadataDrift(folder);
    expect(report.driftedFields.length).toBeGreaterThan(0);

    const grandfathered = resolveGeneratedMetadataDrift(report, { grandfather: true });
    expect(grandfathered.status).toBe('info');

    const enforced = resolveGeneratedMetadataDrift(report, { grandfather: false });
    expect(enforced.status).toBe('error');
    expect(enforced.details.length).toBeGreaterThan(0);
  });

  it('passes a clean folder in both modes', () => {
    const folder = writeFolder({ 'spec.md': specWithOverview(LONG_OVERVIEW) });
    writeDerivedGraph(folder);
    const report = checkGeneratedMetadataDrift(folder);
    expect(resolveGeneratedMetadataDrift(report, { grandfather: true }).status).toBe('pass');
    expect(resolveGeneratedMetadataDrift(report, { grandfather: false }).status).toBe('pass');
  });
});
