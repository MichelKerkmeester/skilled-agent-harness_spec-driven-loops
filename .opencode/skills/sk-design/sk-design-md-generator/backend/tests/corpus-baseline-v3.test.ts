// ────────────────────────────────────────────────────────────────
// MODULE: Corpus Baseline and Fixture Tests
// ────────────────────────────────────────────────────────────────

import * as fs from 'fs';
import * as path from 'path';

import { describe, expect, it } from 'vitest';

import {
  assertDeliteralizedCorpusArtifacts,
  buildCorpusBaseline,
  CORPUS_BASELINE_V3,
  generateDeliteralizedFixtures,
} from '../scripts/corpus-baseline-v3';

import type { RetrievalManifest } from '../scripts/corpus-baseline-v3';

const MANIFEST_PATH = path.resolve(__dirname, '../../../styles/library/manifests/retrieval-manifest.json');

function retrievalManifest(): RetrievalManifest {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) as RetrievalManifest;
}

describe('corpus baseline through the retrieval manifest', () => {
  it('rebuilds the compact checked baseline from all retrieval records', () => {
    const manifest = retrievalManifest();
    expect(manifest.recordCount).toBe(1_290);
    expect(buildCorpusBaseline(manifest)).toEqual(CORPUS_BASELINE_V3);
  });

  it('generates structural fixtures without source identities, literals, or assets', () => {
    const fixtures = generateDeliteralizedFixtures(retrievalManifest());
    const serialized = JSON.stringify(fixtures);
    expect(fixtures.length).toBeGreaterThan(3);
    expect(serialized).not.toMatch(/https?:\/\//);
    expect(serialized).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(serialized).not.toMatch(/\.(?:png|jpe?g|svg|webp)\b/i);
    expect(() => assertDeliteralizedCorpusArtifacts(fixtures)).not.toThrow();
  });

  it('normalizes raw manifest vocabulary into closed structural buckets', () => {
    const manifest = retrievalManifest();
    const sourceLabel = 'Acme Launch Theme';
    const adversarial: RetrievalManifest = {
      ...manifest,
      styles: [
        {
          ...manifest.styles[0],
          theme: sourceLabel,
          capabilities: [...manifest.styles[0].capabilities, sourceLabel],
          tokenAxes: [
            ...manifest.styles[0].tokenAxes,
            { axis: sourceLabel, count: 1 },
          ],
        },
        ...manifest.styles.slice(1),
      ],
    };
    const baseline = buildCorpusBaseline(adversarial);
    const fixtures = generateDeliteralizedFixtures(adversarial, baseline);

    expect(JSON.stringify({ baseline, fixtures })).not.toContain(sourceLabel);
    expect(baseline.themeCounts.unknown).toBe(1);
    expect(baseline.capabilityCounts.other).toBe(1);
    expect(baseline.tokenAxes.other.presence).toBe(1);
    expect(() => assertDeliteralizedCorpusArtifacts(fixtures)).not.toThrow();
  });

  it('rejects fixture vocabulary outside the structural allowlist', () => {
    expect(() => assertDeliteralizedCorpusArtifacts([{
      fixtureKey: 'theme-source-label',
      stratum: 'vocabulary',
      observation: { theme: 'source-label', count: 1 },
    }])).toThrow(/structural allowlist/);
  });
});
