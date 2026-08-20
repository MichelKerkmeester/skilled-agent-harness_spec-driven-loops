// ┌──────────────────────────────────────────────────────────────────────────┐
// │ MODULE: check-projection-coverage conformance                            │
// │ Each case writes a real fixture tree (manifest + contract) and asserts    │
// │ the real process exit code of the checker script, so a pass is a          │
// │ statement about the checker itself rather than about a mock of it.        │
// └──────────────────────────────────────────────────────────────────────────┘

import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'check-projection-coverage.cjs');
const RUNTIME_ROOT = resolve(here, '..', '..');
const MANIFEST_REL = join('lib', 'legacy-projections', 'legacy-projection-manifest.ts');
const CONTRACT_REL = join('lib', 'legacy-projections', 'deep-research-contract.ts');
const REAL_MANIFEST = readFileSync(join(RUNTIME_ROOT, MANIFEST_REL), 'utf8');
const REAL_CONTRACT = readFileSync(join(RUNTIME_ROOT, CONTRACT_REL), 'utf8');

const dirs: string[] = [];

afterEach(() => {
  for (const dir of dirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  dirs.length = 0;
});

// Writes a fixture tree rooted at a temp dir, mirroring the real layout the
// script resolves: <dir>/lib/legacy-projections/{manifest,contract}.ts.
function runWithFixture(files: Record<string, string>): {
  status: number | null;
  stdout: string;
  stderr: string;
  payload: any;
} {
  const dir = mkdtempSync(join(tmpdir(), 'cpcov-'));
  dirs.push(dir);
  for (const [rel, content] of Object.entries(files)) {
    const full = join(dir, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  const result = spawnSync(process.execPath, [CLI_PATH, '--dir', dir], {
    encoding: 'utf8',
  });
  let payload: any = null;
  try {
    payload = JSON.parse(result.stdout.trim());
  } catch {
    payload = null;
  }
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    payload,
  };
}

// Run against the real runtime tree (no --dir) so the baseline case is a
// statement about the tree as it stands, not a fixture approximation.
function runReal(): { status: number | null; stdout: string; payload: any } {
  const result = spawnSync(process.execPath, [CLI_PATH], { encoding: 'utf8' });
  let payload: any = null;
  try {
    payload = JSON.parse(result.stdout.trim());
  } catch {
    payload = null;
  }
  return { status: result.status, stdout: result.stdout, payload };
}

function rulesOf(payload: any): string[] {
  return (payload?.violations ?? []).map((v: any) => v.rule);
}

describe('check-projection-coverage', () => {
  it('case 1: real manifest passes today -> status 0, projectable 22, covered 1, uncovered 21', () => {
    const r = runReal();
    expect(r.status).toBe(0);
    expect(r.payload.ok).toBe(true);
    expect(r.payload.projectable).toBe(22);
    expect(r.payload.covered).toBe(1);
    expect(r.payload.uncovered).toBe(21);
    expect(r.payload.violations).toEqual([]);
  });

  it('case 2: a new projectable surface not in the uncovered list -> status 2, UNDECLARED_UNCOVERED_SURFACE', () => {
    // Insert one extra projectable entry before the closing `];`. It is
    // projectable, not covered, and absent from the declared uncovered list,
    // so it must be flagged. Adding a surface also shifts the uncovered total
    // off the declared count, so UNCOVERED_COUNT_MISMATCH co-occurs.
    const manifest = REAL_MANIFEST.replace(
      /^];\s*$/m,
      [
        '  {',
        "    surfaceId: 'brand-new-surface', format: 'jsonl',",
        "    pathTemplate: '{spec_folder}/brand/new.jsonl',",
        "    legacyWriter: 'brand-new', readers: ['brand-new reader'],",
        "    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',",
        "    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,",
        '  },',
        '];',
      ].join('\n'),
    );
    const r = runWithFixture({
      [MANIFEST_REL]: manifest,
      [CONTRACT_REL]: REAL_CONTRACT,
    });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(rulesOf(r.payload)).toContain('UNDECLARED_UNCOVERED_SURFACE');
    expect(
      r.payload.violations.find(
        (v: any) => v.rule === 'UNDECLARED_UNCOVERED_SURFACE',
      ).surfaceId,
    ).toBe('brand-new-surface');
  });

  it('case 3: declared uncovered count drifts from actual -> status 2, UNCOVERED_COUNT_MISMATCH', () => {
    // Remove one uncovered projectable surface so the derived uncovered total
    // drops to 20 while the declared count stays 21. Removing a declared
    // uncovered surface also makes its declaration stale, so
    // STALE_UNCOVERED_DECLARATION co-occurs; the count rule is the target.
    const manifest = REAL_MANIFEST.replace(
      /  \{\s*\n\s*surfaceId: 'compiled-command-manifest'[\s\S]*?  \},\s*\n/,
      '',
    );
    const r = runWithFixture({
      [MANIFEST_REL]: manifest,
      [CONTRACT_REL]: REAL_CONTRACT,
    });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(rulesOf(r.payload)).toContain('UNCOVERED_COUNT_MISMATCH');
    const mismatch = r.payload.violations.find(
      (v: any) => v.rule === 'UNCOVERED_COUNT_MISMATCH',
    );
    expect(mismatch.detail).toContain('21');
    expect(mismatch.detail).toContain('20');
  });

  it('case 4: a declared uncovered surface is reclassified to retain-legacy-input -> status 2, STALE_UNCOVERED_DECLARATION', () => {
    // Flip one uncovered projectable surface to retain-legacy-input. It is
    // still in the declared uncovered list but is no longer projectable, so
    // its declaration is stale. The uncovered total also drops, so
    // UNCOVERED_COUNT_MISMATCH co-occurs; the stale rule is the target.
    //
    // The anchor must sit INSIDE the target entry: matching a neighbouring
    // block's fields and trailing the replacement up to the target's opening
    // brace silently rewrites the wrong surface, so the test would then pass
    // or fail for the wrong reason. Anchor on this entry's own unique
    // legacyWriter line so the reclassified disposition belongs to
    // runtime-observability itself.
    const manifest = REAL_MANIFEST.replace(
      "    legacyWriter: 'runtime observability emitter', readers: ['observability projections and tests'],\n    fixture: EVENT_FIXTURE, disposition: 'project', serializerId: 'legacy-jsonl-row-v1',\n    refreshBoundary: 'event', nonProjectableReason: null, laterOwner: null,",
      "    legacyWriter: 'runtime observability emitter', readers: ['observability projections and tests'],\n    fixture: EVENT_FIXTURE, disposition: 'retain-legacy-input', serializerId: null,\n    refreshBoundary: null, nonProjectableReason: 'Reclassified for test', laterOwner: 'test',",
    );
    const r = runWithFixture({
      [MANIFEST_REL]: manifest,
      [CONTRACT_REL]: REAL_CONTRACT,
    });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(rulesOf(r.payload)).toContain('STALE_UNCOVERED_DECLARATION');
    const stale = r.payload.violations.find(
      (v: any) => v.rule === 'STALE_UNCOVERED_DECLARATION',
    );
    expect(stale.surfaceId).toBe('runtime-observability');
  });

  it('case 5: covered factory not exported by its module -> status 2, MISSING_CONTRACT_EXPORT', () => {
    // Strip the export keyword from the contract so the factory name the
    // covered map declares is no longer exported. The manifest is unchanged,
    // so only this rule fires.
    const contract = REAL_CONTRACT.replace(
      'export function createDeepResearchProjectionContract(',
      'function createDeepResearchProjectionContract(',
    );
    const r = runWithFixture({
      [MANIFEST_REL]: REAL_MANIFEST,
      [CONTRACT_REL]: contract,
    });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(r.payload.violations).toHaveLength(1);
    expect(r.payload.violations[0].rule).toBe('MISSING_CONTRACT_EXPORT');
    expect(r.payload.violations[0].surfaceId).toBe('research-state');
    expect(r.payload.violations[0].detail).toContain(
      'createDeepResearchProjectionContract',
    );
  });

  it('case 6: manifest missing the seed array declaration -> status 1, script error', () => {
    // The checker's fail() path emits a JSON error object on stdout and then
    // exits 1; assert that contract directly rather than a null payload.
    const r = runWithFixture({
      [MANIFEST_REL]: '// no array here\n',
      [CONTRACT_REL]: REAL_CONTRACT,
    });
    expect(r.status).toBe(1);
    expect(r.payload).not.toBe(null);
    expect(r.payload.error).toBeTruthy();
    expect(r.payload.error).toContain('seed array declaration');
  });

  it('case 7: the real manifest reports the ownership breakdown', () => {
    // The breakdown is additive: it splits the projectable population by
    // legacy-writer ownership without touching the top-level counts anything
    // else reads. Asserting the pre-existing keys stay put is the point — a
    // breakdown that silently shifted projectable/covered/uncovered would
    // break readers that never opted into the breakdown.
    const r = runReal();
    expect(r.status).toBe(0);
    expect(r.payload.ok).toBe(true);
    expect(r.payload.projectable).toBe(22);
    expect(r.payload.covered).toBe(1);
    expect(r.payload.uncovered).toBe(21);
    expect(r.payload.violations).toEqual([]);
    expect(r.payload.breakdown.modeOwned.total).toBe(10);
    expect(r.payload.breakdown.modeOwned.uncovered).toBe(9);
    expect(r.payload.breakdown.modeOwned.uncoveredSurfaceIds).toEqual([
      'alignment-state-deltas',
      'council-config-state',
      'improvement-ledgers',
      'research-deltas',
      'research-projections',
      'research-strategy-inbox',
      'review-deltas',
      'review-projections',
      'review-state',
    ]);
    expect(r.payload.breakdown.infrastructure.total).toBe(12);
    expect(r.payload.breakdown.infrastructure.uncovered).toBe(12);
  });

  it('case 8: reassigning a mode surface to an infrastructure writer fires MODE_OWNED_COUNT_MISMATCH', () => {
    // Rewrite one mode-owned entry's legacyWriter to an infrastructure-style
    // value so the derived mode-owned total drops from 10 to 9 while the
    // declared constant stays 10. The anchor must sit INSIDE the target
    // entry's own block: matching from its surfaceId line through to its own
    // legacyWriter line pins the replacement to research-deltas itself, so a
    // neighbouring block's fields cannot silently redirect the rewrite and
    // leave the test passing or failing for the wrong reason. The surface
    // stays projectable and uncovered, so only the ownership cross-check
    // fires — the uncovered total and declarations are unaffected.
    const manifest = REAL_MANIFEST.replace(
      "    surfaceId: 'research-deltas', format: 'jsonl',\n    pathTemplate: '{spec_folder}/research/deltas/iter-NNN.jsonl',\n    legacyWriter: 'deep-research', readers: ['deep-research reducer'],",
      "    surfaceId: 'research-deltas', format: 'jsonl',\n    pathTemplate: '{spec_folder}/research/deltas/iter-NNN.jsonl',\n    legacyWriter: 'runtime research delta emitter', readers: ['deep-research reducer'],",
    );
    const r = runWithFixture({
      [MANIFEST_REL]: manifest,
      [CONTRACT_REL]: REAL_CONTRACT,
    });
    expect(r.status).toBe(2);
    expect(r.payload.ok).toBe(false);
    expect(rulesOf(r.payload)).toContain('MODE_OWNED_COUNT_MISMATCH');
    const mismatch = r.payload.violations.find(
      (v: any) => v.rule === 'MODE_OWNED_COUNT_MISMATCH',
    );
    expect(mismatch.detail).toContain('10');
    expect(mismatch.detail).toContain('9');
    expect(r.payload.breakdown.modeOwned.total).toBe(9);
  });
});
