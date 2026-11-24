// ───────────────────────────────────────────────────────────────────
// MODULE: Review Reducer Refinement Location Tests
// ───────────────────────────────────────────────────────────────────

// A refinement folds into the finding it names only when it sharpens the same
// place. One raised at another file or under another dimension must survive as
// its own registry entry, keeping its own title and file, with its refines
// value left as a link, while the target stays untouched, and it stores the
// dimension it declared. File identity uses normalized repository-relative paths
// so a short filename cannot alias a same-named file elsewhere.

import { createRequire } from 'node:module';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

type RegistryFinding = {
  findingId: string;
  severity: string;
  title: string;
  description?: string;
  file: string | null;
  line?: number | null;
  dimension?: string;
  refines?: string | null;
  transitions: Array<{ from: string | null; to: string; reason: string }>;
};

type LineageFixture = { label: string; registry: Record<string, unknown> | null };

const nodeRequire = createRequire(import.meta.url);
const reducerPath = nodeRequire.resolve('../../scripts/reduce-state.cjs');
const repositoryRoot = resolve(dirname(reducerPath), '../../../../..');
const { reduceReviewState } = nodeRequire('../../scripts/reduce-state.cjs') as {
  reduceReviewState: (
    specFolder: string,
    options?: Record<string, unknown>,
  ) => { registry: { openFindingsCount: number; openFindings: RegistryFinding[] } };
};
const { mergeReviewRegistries } = nodeRequire('../../scripts/fanout-merge.cjs') as {
  mergeReviewRegistries: (lineageData: LineageFixture[]) => Record<string, unknown>;
};

const scratchDirs: string[] = [];
afterEach(() => {
  while (scratchDirs.length > 0) {
    const dir = scratchDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// One delta file per iteration, reduced without writing so the registry is read
// straight from the return value.
function reduceDeltas(iterations: Array<Array<Record<string, unknown>>>): RegistryFinding[] {
  const specFolder = mkdtempSync(join(tmpdir(), 'review-refinement-location-'));
  scratchDirs.push(specFolder);
  const reviewDir = join(specFolder, 'review');
  const deltasDir = join(reviewDir, 'deltas');
  mkdirSync(deltasDir, { recursive: true });
  writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'refinement-location' }));
  writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), '');
  iterations.forEach((rows, index) => {
    const body = rows
      .map((row) => JSON.stringify({ type: 'finding', iteration: index + 1, ...row }))
      .join('\n');
    writeFileSync(join(deltasDir, `iter-${String(index + 1).padStart(3, '0')}.jsonl`), `${body}\n`);
  });
  return reduceReviewState(specFolder, { write: false, artifactDir: reviewDir }).registry.openFindings;
}

const target = {
  id: 'R1-P1-001',
  severity: 'P1',
  title: 'Stuck-run complaint drops the offered command from the served head',
  file: '.skilled/skills/system-skill-advisor/runtime/lib/advisor-recommend.ts:120',
  dimension: 'correctness',
  claim: 'The gate returns before the offer is attached.',
};

describe('review reducer — refinement location', () => {
  it('keeps a refinement at another file as its own entry linked to its target', () => {
    const otherFile = {
      id: 'R3-P2-001',
      severity: 'P2',
      refines: 'R1-P1-001',
      title: 'Acceptance criteria still state parity the hook output contradicts',
      file: 'specs/acceptance-criteria.md:84',
      dimension: 'traceability',
      claim: 'The criteria row was not updated for the accepted exception.',
    };

    const findings = reduceDeltas([[target], [otherFile]]);

    expect(findings).toHaveLength(2);
    const original = findings.find((finding) => finding.findingId === 'R1-P1-001');
    const refinement = findings.find((finding) => finding.findingId === 'R3-P2-001');
    expect(original).toMatchObject({
      title: target.title,
      description: target.claim,
      file: '.skilled/skills/system-skill-advisor/runtime/lib/advisor-recommend.ts',
      line: 120,
      severity: 'P1',
    });
    expect(original?.transitions.map((transition) => transition.reason)).not.toContain('Refinement of an earlier finding');
    expect(refinement).toMatchObject({
      title: otherFile.title,
      file: 'specs/acceptance-criteria.md',
      line: 84,
      severity: 'P2',
      refines: 'R1-P1-001',
      dimension: 'traceability',
    });
  });

  it('keeps a different-file refinement when findingsNew is empty', () => {
    const refinement = {
      id: 'R3-P2-001',
      severity: 'P2',
      refines: 'R1-P1-001',
      title: 'Typed-on-stuck exception is accepted in prose but the criteria still state parity',
      file: 'specs/acceptance-criteria.md:1',
      dimension: 'traceability',
    };

    const findings = reduceDeltas([
      [{ type: 'iteration', mode: 'review', findingsNew: ['R1-P1-001'] }, target],
      [{ type: 'iteration', mode: 'review', findingsCount: 1, findingsNew: [] }, refinement],
    ]);

    expect(findings).toHaveLength(2);
    expect(findings.find((finding) => finding.findingId === 'R1-P1-001')).toMatchObject({
      findingId: 'R1-P1-001',
      severity: 'P1',
      title: target.title,
      file: '.skilled/skills/system-skill-advisor/runtime/lib/advisor-recommend.ts',
    });
    expect(findings.find((finding) => finding.findingId === 'R3-P2-001')).toMatchObject({
      findingId: 'R3-P2-001',
      severity: 'P2',
      title: refinement.title,
      file: 'specs/acceptance-criteria.md',
      refines: 'R1-P1-001',
    });
  });

  it('keeps a refinement at another file that its iteration counted as new', () => {
    const counted = {
      id: 'R3-P1-001',
      severity: 'P1',
      refines: 'R1-P1-001',
      title: 'Criteria row marked Met on evidence that misses the served output',
      file: 'specs/acceptance-criteria.md:77',
      dimension: 'traceability',
    };

    const findings = reduceDeltas([
      [{ type: 'iteration', mode: 'review', findingsNew: ['R1-P1-001'] }, target],
      [{ type: 'iteration', mode: 'review', findingsNew: ['R3-P1-001'] }, counted],
    ]);

    expect(findings.map((finding) => finding.findingId).sort()).toEqual(['R1-P1-001', 'R3-P1-001']);
    expect(findings.find((finding) => finding.findingId === 'R1-P1-001')).toMatchObject({
      severity: 'P1',
      title: target.title,
    });
  });

  it.each([
    ['an absolute path', `${join(repositoryRoot, '.skilled/skills/system-skill-advisor/runtime/lib/advisor-recommend.ts')}:121`],
    ['a path with dot segments', './.skilled/skills/system-skill-advisor/runtime/lib/advisor-recommend.ts:121'],
  ])('folds a refinement that spells the target file as %s', (_label, file) => {
    const respelled = {
      id: 'R2-P1-003',
      severity: 'P1',
      refines: 'R1-P1-001',
      title: 'Stuck-run complaint drops the offered command after the typed head',
      file,
      dimension: 'correctness',
    };

    const findings = reduceDeltas([[target], [respelled]]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ findingId: 'R1-P1-001', title: respelled.title });
  });

  it('does not let a bare filename fold into a same-named file in another directory', () => {
    const sameName = {
      id: 'R2-P2-005',
      severity: 'P2',
      refines: 'R1-P1-001',
      title: 'Hook copy of the recommend handler repeats the early return',
      file: 'hooks/lib/advisor-recommend.ts:30',
      dimension: 'correctness',
    };

    const findings = reduceDeltas([[{ ...target, file: 'advisor-recommend.ts:120' }], [sameName]]);

    expect(findings.map((finding) => finding.findingId).sort()).toEqual(['R1-P1-001', 'R2-P2-005']);
  });

  it('keeps a same-file refinement that declares another dimension as its own entry', () => {
    const otherDimension = {
      id: 'R2-P2-004',
      severity: 'P2',
      refines: 'R1-P1-001',
      title: 'Offer attach path has no test for the stuck-run branch',
      file: '.skilled/skills/system-skill-advisor/runtime/lib/advisor-recommend.ts:140',
      dimension: 'maintainability',
    };

    const findings = reduceDeltas([[target], [otherDimension]]);

    expect(findings.map((finding) => finding.findingId).sort()).toEqual(['R1-P1-001', 'R2-P2-004']);
    expect(findings.find((finding) => finding.findingId === 'R1-P1-001')?.title).toBe(target.title);
  });

  it('still folds a refinement at the same file into its target', () => {
    const sameFile = {
      id: 'R2-P1-002',
      severity: 'P0',
      refines: 'R1-P1-001',
      title: 'Stuck-run complaint drops the offered command on every typed head',
      file: './.skilled/skills/system-skill-advisor/runtime/lib/advisor-recommend.ts:122',
      dimension: 'correctness',
      claim: 'Every typed head loses the offer, not only the first.',
    };

    const findings = reduceDeltas([[target], [sameFile]]);

    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      findingId: 'R1-P1-001',
      title: sameFile.title,
      description: sameFile.claim,
      severity: 'P0',
    });
    expect(findings[0].transitions.at(-1)).toMatchObject({
      from: 'P1',
      to: 'P0',
      reason: 'Refinement of an earlier finding',
    });
  });

  it('lets the lineage merge suffix a kept refinement whose id another lineage reused', () => {
    const refinement = {
      id: 'R3-P2-001',
      severity: 'P2',
      refines: 'R1-P1-001',
      title: 'Acceptance criteria still state parity the hook output contradicts',
      file: 'specs/acceptance-criteria.md:84',
      dimension: 'traceability',
    };
    const lineageOne = reduceDeltas([[target], [refinement]]);
    const lineageTwo = reduceDeltas([[{
      id: 'R3-P2-001',
      severity: 'P2',
      title: 'Changelog names the wrong hook file',
      file: 'changelog/v4.2.0.0.md:212',
      dimension: 'traceability',
    }]]);

    const merged = mergeReviewRegistries([
      { label: 'lineage-one', registry: { openFindings: lineageOne, resolvedFindings: [] } },
      { label: 'lineage-two', registry: { openFindings: lineageTwo, resolvedFindings: [] } },
    ]);

    const open = merged.openFindings as Array<{ findingId: string; title: string; _conflictOf?: string }>;
    const collided = open.filter((finding) => finding._conflictOf === 'R3-P2-001');
    expect(collided.map((finding) => finding.title).sort()).toEqual([
      'Acceptance criteria still state parity the hook output contradicts',
      'Changelog names the wrong hook file',
    ]);
    for (const finding of collided) {
      expect(finding.findingId).toMatch(/^R3-P2-001--/);
    }
    expect(open.some((finding) => finding.findingId === 'R1-P1-001')).toBe(true);
  });
});
