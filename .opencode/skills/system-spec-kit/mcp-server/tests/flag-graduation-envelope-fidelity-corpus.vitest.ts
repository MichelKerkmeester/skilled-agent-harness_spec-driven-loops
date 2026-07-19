// ───────────────────────────────────────────────────────────────
// TEST: Flag Graduation: Envelope Fidelity Render Corpus
// ───────────────────────────────────────────────────────────────
// SPECKIT_ENVELOPE_FIDELITY graduates only on a clean grandfather report over
// a captured render corpus, which the benchmark never had. This replays the small
// corpus checked into the phase folder through the fidelity checker: the faithful
// renders must pass fail-mode, the renders that dropped or altered the verdict
// pair must be flagged with the right finding kind and grandfather mode must
// list the non-conforming renders without failing.

import path from 'node:path';
import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

// @ts-expect-error -- plain ESM eval script, no type declarations
import { checkEnvelopeFidelity } from '../scripts/evals/check-envelope-fidelity.mjs';

const CORPUS_DIR = path.resolve(
  import.meta.dirname,
  '..',
  '..',
  '..',
  '..',
  'specs',
  'system-spec-kit',
  '028-memory-search-intelligence',
  '005-spec-data-quality',
  '040-flag-graduation-benchmark',
  'scripts',
  'fixtures',
  'render-corpus',
);

interface RenderEntry {
  name: string;
  file: string;
  verdict: { label: string; policy: string };
  expect: 'conforming' | 'non_conforming';
  findingField?: string;
  findingKind?: 'dropped' | 'altered';
}

const manifest = JSON.parse(
  fs.readFileSync(path.join(CORPUS_DIR, 'manifest.json'), 'utf8'),
) as { renders: RenderEntry[] };

function renderOf(entry: RenderEntry): string {
  return fs.readFileSync(path.join(CORPUS_DIR, entry.file), 'utf8');
}

function verdictOf(entry: RenderEntry): { requestQuality: { label: string }; citationPolicy: string } {
  return { requestQuality: { label: entry.verdict.label }, citationPolicy: entry.verdict.policy };
}

describe('flag graduation: envelope-fidelity render corpus', () => {
  it('checks in a corpus that holds both faithful and non-conforming renders', () => {
    expect(manifest.renders.length).toBeGreaterThanOrEqual(4);
    expect(manifest.renders.some((r) => r.expect === 'conforming')).toBe(true);
    expect(manifest.renders.some((r) => r.expect === 'non_conforming')).toBe(true);
  });

  for (const entry of manifest.renders.filter((r) => r.expect === 'conforming')) {
    it(`passes the faithful render ${entry.name} in fail mode`, () => {
      const report = checkEnvelopeFidelity(verdictOf(entry), renderOf(entry), { mode: 'fail' });
      expect(report.ok).toBe(true);
      expect(report.conforming).toBe(true);
      expect(report.findings).toEqual([]);
    });
  }

  for (const entry of manifest.renders.filter((r) => r.expect === 'non_conforming')) {
    it(`flags the non-conforming render ${entry.name} in fail mode`, () => {
      const report = checkEnvelopeFidelity(verdictOf(entry), renderOf(entry), { mode: 'fail' });
      expect(report.ok).toBe(false);
      expect(report.conforming).toBe(false);
      expect(report.findings).toContainEqual(
        expect.objectContaining({ field: entry.findingField, kind: entry.findingKind }),
      );
    });

    it(`lists ${entry.name} without failing in grandfather mode`, () => {
      const report = checkEnvelopeFidelity(verdictOf(entry), renderOf(entry), { mode: 'grandfather' });
      expect(report.ok).toBe(true);
      expect(report.conforming).toBe(false);
      expect(report.status).toBe('non_conforming');
    });
  }
});
