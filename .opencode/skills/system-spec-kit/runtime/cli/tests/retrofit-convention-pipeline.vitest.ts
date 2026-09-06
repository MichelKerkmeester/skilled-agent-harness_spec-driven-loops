import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { bodyPreimage } from '../retrieval/lib/grep-convention.mjs';
import {
  EXIT_CLEAN,
  EXIT_RESIDUE,
  checkGates,
  dryRun,
  enumerate,
  parseArgs,
  processCorpus,
  rescan,
  trackOf,
  verifyPreimage,
  walkScope,
  writeAtomic,
} from '../ops/retrofit-convention.mjs';

const tempRoots = new Set<string>();

afterEach(() => {
  for (const dir of tempRoots) fs.rmSync(dir, { force: true, recursive: true });
  tempRoots.clear();
});

function makeRepo(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'retrofit-'));
  tempRoots.add(dir);
  fs.mkdirSync(path.join(dir, '.opencode'), { recursive: true });
  return dir;
}

function write(root: string, relativePath: string, lines: string[]): string {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${lines.join('\n')}\n`, 'utf8');
  return absolute;
}

function conforming(title: string): string[] {
  return ['---', `title: "${title}"`, 'trigger_phrases:', '  - "retrofit pipeline stage"', '---', '', `# ${title}`, ''];
}

function seedCorpus(root: string): void {
  write(root, 'specs/track/001-packet/spec.md', conforming('Packet'));
  // A canonical basename with no block: refused, because a partial block is a
  // worse validation state than none. Its non-canonical sibling below is the
  // one the insert handler still acts on.
  write(root, 'specs/track/001-packet/plan.md', ['# Plan With No Frontmatter', '', 'Prose that must not move.', '']);
  write(root, 'specs/track/001-packet/research/notes.md', ['# Notes With No Frontmatter', '', 'Prose that must not move.', '']);
  write(root, 'specs/track/001-packet/tasks.md', [
    '---', 'title: "Tasks"', 'triggerPhrases:', '  - "task breakdown"', '---', '', '# Tasks', '',
  ]);
  write(root, 'specs/track/001-packet/z_archive/old.md', ['# Archived', '']);
  write(root, 'specs/track/001-packet/node_modules/vendor.md', ['# Vendored', '']);
  write(root, 'specs/track/001-packet/.backup-20260101/spec.md', ['# Backup', '']);
}

function options(root: string, extra: Record<string, unknown> = {}) {
  return {
    manifestPath: path.join(root, 'out', 'manifest.json'),
    outDir: path.join(root, 'out'),
    repoRoot: root,
    ...extra,
  };
}

// ───────────────────────────────────────────────────────────────────
// Scope
// ───────────────────────────────────────────────────────────────────

describe('scope walk', () => {
  it('excludes archived, vendored and hidden trees', () => {
    const root = makeRepo();
    seedCorpus(root);
    const walked = walkScope(root);

    expect(walked.files).toEqual([
      'specs/track/001-packet/plan.md',
      'specs/track/001-packet/research/notes.md',
      'specs/track/001-packet/spec.md',
      'specs/track/001-packet/tasks.md',
    ]);
    const reasons = Object.fromEntries(walked.skipped.map((entry: { path: string; reason: string }) => [entry.path, entry.reason]));
    expect(reasons['specs/track/001-packet/z_archive']).toBe('excluded directory');
    expect(reasons['specs/track/001-packet/node_modules']).toBe('excluded directory');
    expect(reasons['specs/track/001-packet/.backup-20260101']).toMatch(/hidden path/);
  });

  it('walks hidden trees only when asked', () => {
    const root = makeRepo();
    seedCorpus(root);
    expect(walkScope(root, { includeHidden: true }).files).toContain('specs/track/001-packet/.backup-20260101/spec.md');
  });

  it('enumerates a document reachable through a symlink exactly once, under its own path', () => {
    const root = makeRepo();
    write(root, 'specs/track/001-packet/changelog/entry.md', conforming('Entry'));
    fs.symlinkSync('changelog/entry.md', path.join(root, 'specs/track/001-packet/changelog.md'));

    const walked = walkScope(root);
    expect(walked.files).toEqual(['specs/track/001-packet/changelog/entry.md']);
    expect(walked.skipped.some((entry: { reason: string }) => entry.reason.includes('duplicate'))).toBe(true);
  });

  it('reads the track off a repo-relative path', () => {
    expect(trackOf('specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/spec.md')).toBe('specs/system-speckit');
  });
});

// ───────────────────────────────────────────────────────────────────
// Enumerate
// ───────────────────────────────────────────────────────────────────

describe('enumerate', () => {
  it('freezes a manifest whose eight variant counts sum to the document total', () => {
    const root = makeRepo();
    seedCorpus(root);
    const { report } = enumerate(options(root));

    expect(report.manifestCount).toBe(4);
    expect(report.inventory.sum).toBe(4);
    expect(report.inventory.sumMatchesManifest).toBe(true);
    expect(report.inventory.unclassified).toEqual([]);
    expect(report.inventory.counts.missing).toBe(2);
    expect(report.inventory.counts['valid-empty']).toBe(2);
  });

  it('records a body preimage for every enumerated document', () => {
    const root = makeRepo();
    seedCorpus(root);
    const { artifacts } = enumerate(options(root));
    const captured = JSON.parse(fs.readFileSync(artifacts.preimageManifest, 'utf8'));

    expect(Object.keys(captured.digests)).toHaveLength(4);
    const spec = fs.readFileSync(path.join(root, 'specs/track/001-packet/spec.md'), 'utf8');
    expect(captured.digests['specs/track/001-packet/spec.md']).toBe(bodyPreimage(spec).digest);
  });

  it('inventories the alias hit without counting it as a variant', () => {
    const root = makeRepo();
    seedCorpus(root);
    const { report } = enumerate(options(root));
    expect(report.exceptionCounts['alias-hit']).toBe(1);
  });

  it('records both phrase measures and names the primary one', () => {
    const root = makeRepo();
    seedCorpus(root);
    const { report } = enumerate(options(root));

    expect(report.baseline.primaryMeasure).toBe('uniqueNormalizedPhrases');
    expect(report.baseline.measures.uniqueNormalizedPhrases.value).toBe(2);
    expect(report.baseline.measures.declaredMembers.value).toBe(2);
    expect(report.baseline.measures.documentsDeclaringTriggerPhrases.value).toBe(2);
    for (const measure of Object.values(report.baseline.measures) as Array<{ definition: string }>) {
      expect(measure.definition.length).toBeGreaterThan(0);
    }
  });

  it('executes each of the three recipes once and reads the exit status', () => {
    const root = makeRepo();
    seedCorpus(root);
    const { report } = enumerate(options(root));

    expect(report.baseline.recipeRuns.map((run: { recipe: string }) => run.recipe))
      .toEqual(['structured', 'path', 'count']);
    for (const run of report.baseline.recipeRuns) {
      expect(typeof run.exitCode).toBe('number');
      expect(['match', 'no-match', 'error']).toContain(run.outcome);
    }
  });

  it('refuses a track that selects no document rather than freezing an empty manifest', () => {
    const root = makeRepo();
    seedCorpus(root);
    expect(() => enumerate(options(root, { track: 'specs/absent' }))).toThrow(/selects no in-scope document/);
  });
});

// ───────────────────────────────────────────────────────────────────
// Write discipline
// ───────────────────────────────────────────────────────────────────

describe('atomic processor', () => {
  it('leaves the original untouched and removes its temporary file when the check fails', () => {
    const root = makeRepo();
    const absolute = write(root, 'specs/track/001-packet/spec.md', conforming('Packet'));
    const before = fs.readFileSync(absolute, 'utf8');
    const damaged = before.replace('# Packet', '# Packet Rewritten');

    expect(() => writeAtomic(absolute, before, damaged)).toThrow(/preimage/);
    expect(fs.readFileSync(absolute, 'utf8')).toBe(before);
    expect(fs.readdirSync(path.dirname(absolute)).filter((name) => name.startsWith('.'))).toEqual([]);
  });

  it('renames into place when the candidate passes', () => {
    const root = makeRepo();
    const absolute = write(root, 'specs/track/001-packet/tasks.md', [
      '---', 'triggerPhrases:', '  - "task breakdown"', '---', '', '# Tasks', '',
    ]);
    const before = fs.readFileSync(absolute, 'utf8');
    const after = before.replace('triggerPhrases:', 'trigger_phrases:');

    writeAtomic(absolute, before, after);
    expect(fs.readFileSync(absolute, 'utf8')).toBe(after);
  });
});

describe('gates', () => {
  it('rejects a candidate whose body region changed', () => {
    const before = `${conforming('Packet').join('\n')}\n`;
    const gate = checkGates('specs/a.md', before, before.replace('# Packet', '# Moved'));
    expect(gate.ok).toBe(false);
    expect(gate.reason).toMatch(/preimage/);
  });

  it('rejects a candidate carrying a changed line outside frontmatter and markers', () => {
    const before = `${['---', 'trigger_phrases: []', '---', '', 'Prose.', ''].join('\n')}\n`;
    const after = `${['---', 'trigger_phrases: []', '---', '', 'Prose.', '', '<!-- ANCHOR:x -->extra', ''].join('\n')}\n`;
    expect(checkGates('specs/a.md', before, after).ok).toBe(false);
  });

  it('accepts a frontmatter-only candidate', () => {
    const before = `${['---', 'triggerPhrases:', '  - "alpha beta"', '---', '', 'Prose.', ''].join('\n')}\n`;
    const gate = checkGates('specs/a.md', before, before.replace('triggerPhrases:', 'trigger_phrases:'));
    expect(gate.ok).toBe(true);
    expect(gate.counts.other).toBe(0);
  });
});

// ───────────────────────────────────────────────────────────────────
// Pipeline
// ───────────────────────────────────────────────────────────────────

describe('pipeline', () => {
  it('plans a diff without writing a document', () => {
    const root = makeRepo();
    seedCorpus(root);
    enumerate(options(root));

    const before = fs.readFileSync(path.join(root, 'specs/track/001-packet/plan.md'), 'utf8');
    const { report } = dryRun(options(root));

    expect(report.plannedDocuments).toBe(2);
    expect(report.blockers).toEqual([]);
    expect(fs.readFileSync(path.join(root, 'specs/track/001-packet/plan.md'), 'utf8')).toBe(before);
    expect(fs.readFileSync(report.diffPath, 'utf8')).toContain('trigger_phrases: []');
  });

  it('processes, then rescans clean, then writes nothing on a second run', () => {
    const root = makeRepo();
    seedCorpus(root);
    enumerate(options(root));

    const first = processCorpus(options(root));
    expect(first.report.failures).toEqual([]);
    expect(first.report.written).toBe(2);

    const residue = rescan(options(root));
    expect(residue.report.residueCount).toBe(0);

    // The frozen manifest still holds the pre-write bytes, so a second pass is
    // expected to refuse rather than rewrite. Re-freezing is what a real second
    // run does, and it is the run that must produce no write at all.
    enumerate(options(root));
    const second = processCorpus(options(root));
    expect(second.report.written).toBe(0);
    expect(second.report.failures).toEqual([]);
  });

  it('holds the body preimage across the whole corpus after processing', () => {
    const root = makeRepo();
    seedCorpus(root);
    enumerate(options(root));
    processCorpus(options(root));

    const verified = verifyPreimage(options(root));
    expect(verified.report.mismatchCount).toBe(0);
    expect(verified.report.missing).toEqual([]);
    expect(verified.report.verified).toBe(4);
  });

  it('refuses a document that moved since the manifest was frozen', () => {
    const root = makeRepo();
    seedCorpus(root);
    enumerate(options(root));

    write(root, 'specs/track/001-packet/plan.md', ['# Plan Rewritten By Someone Else', '']);
    const { report } = processCorpus(options(root));
    expect(report.failures).toHaveLength(1);
    expect(report.failures[0].kind).toBe('stale-manifest');
    expect(report.failures[0].reason).toMatch(/re-run enumerate before process/);
    expect(report.failuresByKind['stale-manifest']).toBe(1);
  });

  it('names a stale manifest as staleness rather than as body damage', () => {
    const root = makeRepo();
    seedCorpus(root);
    enumerate(options(root));
    processCorpus(options(root));

    // Second process against the manifest the first pass consumed. Every
    // document it wrote now fails staleness, which is the guard working; the
    // reason has to say so, because the category alone reads as body damage.
    const second = processCorpus(options(root));
    expect(second.report.failuresByKind['stale-manifest']).toBe(2);
    expect(second.report.failuresByKind.gate).toBe(0);
    for (const failure of second.report.failures) {
      expect(failure.reason).toMatch(/re-run enumerate before process/);
    }

    const rows = JSON.parse(fs.readFileSync(second.artifacts.diagnostics, 'utf8')).rows
      .filter((row: { category: string }) => row.category === 'preimage-mismatch');
    expect(rows.every((row: { rawKey: string }) => row.rawKey === 'stale-manifest')).toBe(true);
  });

  it('writes one diagnostics file per track so a per-track run keeps every track', () => {
    const root = makeRepo();
    seedCorpus(root);
    write(root, 'specs/other/001-packet/spec.md', conforming('Other'));
    enumerate(options(root));

    const first = processCorpus(options(root, { track: 'specs/track' }));
    const second = processCorpus(options(root, { track: 'specs/other' }));

    expect(path.basename(first.artifacts.diagnostics)).toBe('diagnostics-specs-track.json');
    expect(path.basename(second.artifacts.diagnostics)).toBe('diagnostics-specs-other.json');
    expect(fs.existsSync(first.artifacts.diagnostics)).toBe(true);
    expect(JSON.parse(fs.readFileSync(first.artifacts.diagnostics, 'utf8')).track).toBe('specs/track');
  });

  it('reports a skip-and-report variant as handled rather than as residue', () => {
    const root = makeRepo();
    write(root, 'specs/track/001-packet/spec.md', ['---', 'title: "Unclosed"', 'trigger_phrases:', '  - "a phrase"', '']);
    enumerate(options(root));
    processCorpus(options(root));

    const { report } = rescan(options(root));
    expect(report.residueCount).toBe(0);
    expect(report.skippedByDesign['malformed-or-unclosed'].count).toBe(1);
    expect(report.skippedByDesign['malformed-or-unclosed'].paths).toEqual(['specs/track/001-packet/spec.md']);
  });

  it('counts a refused unsafe edit as skipped by design, not as residue', () => {
    const root = makeRepo();
    // A block holding a single-line flow mapping: it parses, declares no
    // trigger key, and stops parsing the moment one is appended, so the
    // processor refuses it. The refusal is a decision, not unfinished work.
    write(root, 'specs/track/001-packet/policy-card.md', [
      '---', '{"hubId":"sk-code","schemaVersion":"V1"}', '---', '', '# Policy Card', '',
    ]);
    enumerate(options(root));

    const processed = processCorpus(options(root));
    expect(processed.report.written).toBe(0);
    expect(processed.report.failures).toEqual([]);

    const { report } = rescan(options(root));
    expect(report.residueCount).toBe(0);
    expect(report.residue).toEqual([]);
    expect(report.skippedByDesign['refused-unsafe-edit'].count).toBe(1);
    expect(report.skippedByDesign['refused-unsafe-edit'].paths)
      .toEqual(['specs/track/001-packet/policy-card.md']);
  });

  it('reports an unprocessed missing variant as residue', () => {
    const root = makeRepo();
    seedCorpus(root);
    enumerate(options(root));

    const { report } = rescan(options(root));
    expect(report.residueCount).toBeGreaterThan(0);
    expect(report.residue.some((entry: { variant: string }) => entry.variant === 'missing')).toBe(true);
  });
});

// ───────────────────────────────────────────────────────────────────
// CLI parsing
// ───────────────────────────────────────────────────────────────────

describe('argument parsing', () => {
  it('requires a known stage', () => {
    expect(() => parseArgs(['sweep'])).toThrow(/must be one of/);
    expect(() => parseArgs(['enumerate', '--track'])).toThrow(/requires a value/);
    expect(() => parseArgs(['enumerate', '--force'])).toThrow(/unknown argument/);
  });

  it('defaults the manifest into the artifact directory and trims a trailing slash off the track', () => {
    const parsed = parseArgs(['dry-run', '--root', '/tmp/repo', '--out', '/tmp/out', '--track', 'specs/track/']);
    expect(parsed.manifestPath).toBe(path.resolve('/tmp/out/manifest.json'));
    expect(parsed.track).toBe('specs/track');
    expect(parsed.stage).toBe('dry-run');
  });

  it('exposes the documented exit codes', () => {
    expect(EXIT_CLEAN).toBe(0);
    expect(EXIT_RESIDUE).toBe(1);
  });
});
