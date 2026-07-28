// ────────────────────────────────────────────────────────────────
// MODULE: Corpus Baseline and De-Literalized Fixtures
// ────────────────────────────────────────────────────────────────

import { V3_SCHEMA } from './schema-v3';

import type { AdvisoryStratum, StyleReferenceSchema } from './schema-v3';

export const STRUCTURAL_THEME_BUCKETS = ['light', 'dark', 'mixed', 'unknown'] as const;
export const STRUCTURAL_AXIS_BUCKETS = [
  'color', 'font', 'radius', 'shadow', 'spacing', 'surface', 'typography', 'other',
] as const;
export const STRUCTURAL_CAPABILITY_BUCKETS = [
  'components', 'constraints', 'imagery', 'layout', 'motion', 'provenance', 'spacing',
  'tokens', 'other',
] as const;

type StructuralTheme = typeof STRUCTURAL_THEME_BUCKETS[number];
type StructuralAxis = typeof STRUCTURAL_AXIS_BUCKETS[number];
type StructuralCapability = typeof STRUCTURAL_CAPABILITY_BUCKETS[number];

export interface RetrievalManifestStyle {
  readonly id?: string;
  readonly slug?: string;
  readonly title?: string;
  readonly thesis?: string;
  readonly theme?: string | null;
  readonly tokenAxes: readonly { axis: string; count: number }[];
  readonly capabilities: readonly string[];
  readonly availableSections: readonly string[];
  readonly provenance?: { sourceUrl?: string | null; originalUrl?: string | null };
  readonly artifacts?: readonly { path: string }[];
}

export interface RetrievalManifest {
  readonly schemaVersion: number;
  readonly generationHash: string;
  readonly recordCount: number;
  readonly styles: readonly RetrievalManifestStyle[];
}

export interface PercentileBand {
  readonly p10: number;
  readonly median: number;
  readonly p90: number;
}

export interface CorpusBaselineV3 {
  readonly baselineVersion: 1;
  readonly schemaVersion: StyleReferenceSchema['version'];
  readonly retrievalGenerationHash: string;
  readonly bundleCount: number;
  readonly sectionCount: PercentileBand;
  readonly tokenAxes: Readonly<Record<string, PercentileBand & { presence: number }>>;
  readonly capabilityCounts: Readonly<Record<string, number>>;
  readonly themeCounts: Readonly<Record<string, number>>;
}

export interface DeliteralizedCorpusFixture {
  readonly fixtureKey: string;
  readonly stratum: AdvisoryStratum;
  readonly observation: Readonly<Record<string, string | number | boolean>>;
}

export const CORPUS_BASELINE_V3: CorpusBaselineV3 = {
  baselineVersion: 1,
  schemaVersion: V3_SCHEMA.version,
  retrievalGenerationHash: 'sha256:864034fd7a9436c29904389087d950c8535bd747803d4bd197f5203a9760a6a1',
  bundleCount: 1_290,
  sectionCount: { p10: 12, median: 13, p90: 14 },
  tokenAxes: {
    color: { presence: 1_290, p10: 4, median: 9, p90: 16 },
    font: { presence: 1_290, p10: 1, median: 2, p90: 5 },
    radius: { presence: 1_124, p10: 1, median: 4, p90: 8 },
    shadow: { presence: 522, p10: 1, median: 2, p90: 6 },
    spacing: { presence: 1_290, p10: 7, median: 12, p90: 16 },
    surface: { presence: 1_266, p10: 2, median: 4, p90: 5 },
    typography: { presence: 1_290, p10: 8, median: 18, p90: 36 },
  },
  capabilityCounts: {
    components: 1_290,
    constraints: 1_287,
    imagery: 1_284,
    layout: 1_236,
    motion: 36,
    provenance: 1_290,
    spacing: 1_290,
    tokens: 1_290,
  },
  themeCounts: { light: 876, dark: 282, mixed: 132 },
};

const THEME_BUCKETS: Readonly<Record<string, StructuralTheme>> = {
  light: 'light', day: 'light', 'light-mode': 'light',
  dark: 'dark', night: 'dark', 'dark-mode': 'dark',
  mixed: 'mixed', hybrid: 'mixed', adaptive: 'mixed',
};

const AXIS_BUCKETS: Readonly<Record<string, StructuralAxis>> = {
  color: 'color', colors: 'color', palette: 'color',
  font: 'font', fonts: 'font',
  radius: 'radius', radii: 'radius',
  shadow: 'shadow', shadows: 'shadow',
  spacing: 'spacing', space: 'spacing',
  surface: 'surface', surfaces: 'surface',
  typography: 'typography', type: 'typography',
};

const CAPABILITY_BUCKETS: Readonly<Record<string, StructuralCapability>> = {
  component: 'components', components: 'components',
  constraint: 'constraints', constraints: 'constraints',
  image: 'imagery', imagery: 'imagery',
  layout: 'layout', motion: 'motion', provenance: 'provenance', spacing: 'spacing',
  token: 'tokens', tokens: 'tokens',
};

function normalizedVocabulary(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

function structuralTheme(value: unknown): StructuralTheme {
  return THEME_BUCKETS[normalizedVocabulary(value)] ?? 'unknown';
}

function structuralAxis(value: unknown): StructuralAxis {
  return AXIS_BUCKETS[normalizedVocabulary(value)] ?? 'other';
}

function structuralCapability(value: unknown): StructuralCapability {
  return CAPABILITY_BUCKETS[normalizedVocabulary(value)] ?? 'other';
}

function percentile(values: readonly number[], fraction: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor((sorted.length - 1) * fraction)];
}

function band(values: readonly number[]): PercentileBand {
  return { p10: percentile(values, 0.1), median: percentile(values, 0.5), p90: percentile(values, 0.9) };
}

function assertRetrievalManifest(manifest: RetrievalManifest): void {
  if (!Number.isInteger(manifest.schemaVersion) || typeof manifest.generationHash !== 'string') {
    throw new TypeError('Retrieval manifest is missing its checked schema version or generation hash.');
  }
  if (!Array.isArray(manifest.styles) || manifest.recordCount !== manifest.styles.length) {
    throw new TypeError('Retrieval manifest recordCount must match its styles array.');
  }
  for (const [index, style] of manifest.styles.entries()) {
    if (!Array.isArray(style.tokenAxes)
      || !Array.isArray(style.capabilities)
      || !Array.isArray(style.availableSections)) {
      throw new TypeError(`Retrieval manifest style ${index} is missing structural summary fields.`);
    }
  }
}

/** Build a compact structural baseline from checked retrieval-manifest summaries. */
export function buildCorpusBaseline(manifest: RetrievalManifest): CorpusBaselineV3 {
  assertRetrievalManifest(manifest);
  const axisCounts = new Map<string, number[]>();
  const capabilityCounts: Record<string, number> = {};
  const themeCounts: Record<string, number> = {};
  for (const style of manifest.styles) {
    for (const axis of style.tokenAxes) {
      const bucket = structuralAxis(axis.axis);
      const values = axisCounts.get(bucket) ?? [];
      values.push(axis.count);
      axisCounts.set(bucket, values);
    }
    for (const capability of style.capabilities) {
      const bucket = structuralCapability(capability);
      capabilityCounts[bucket] = (capabilityCounts[bucket] ?? 0) + 1;
    }
    const theme = structuralTheme(style.theme);
    themeCounts[theme] = (themeCounts[theme] ?? 0) + 1;
  }
  const tokenAxes = Object.fromEntries(
    [...axisCounts.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([axis, counts]) => [axis, { presence: counts.length, ...band(counts) }]),
  );
  const baseline: CorpusBaselineV3 = {
    baselineVersion: 1,
    schemaVersion: V3_SCHEMA.version,
    retrievalGenerationHash: manifest.generationHash,
    bundleCount: manifest.recordCount,
    sectionCount: band(manifest.styles.map((style) => style.availableSections.length)),
    tokenAxes,
    capabilityCounts: Object.fromEntries(Object.entries(capabilityCounts).sort()),
    themeCounts: Object.fromEntries(Object.entries(themeCounts).sort()),
  };
  assertStructuralCorpusBaseline(baseline);
  return baseline;
}

/** Produce aggregate fixtures that contain structure and vocabulary but no source literals. */
export function generateDeliteralizedFixtures(
  manifest: RetrievalManifest,
  baseline = buildCorpusBaseline(manifest),
): readonly DeliteralizedCorpusFixture[] {
  const fixtures: DeliteralizedCorpusFixture[] = [
    {
      fixtureKey: 'section-shape-band',
      stratum: 'shape',
      observation: { minimum: baseline.sectionCount.p10, typical: baseline.sectionCount.median, maximum: baseline.sectionCount.p90 },
    },
  ];
  for (const [theme, count] of Object.entries(baseline.themeCounts)) {
    fixtures.push({ fixtureKey: `theme-${theme}`, stratum: 'vocabulary', observation: { theme, count } });
  }
  for (const [capability, count] of Object.entries(baseline.capabilityCounts)) {
    if (count < Math.ceil(baseline.bundleCount * 0.1)) {
      fixtures.push({ fixtureKey: `rare-capability-${capability}`, stratum: 'rarity', observation: { capability, count } });
    }
  }
  assertDeliteralizedCorpusArtifacts(fixtures);
  return fixtures;
}

/** Reject baseline vocabulary outside the closed structural buckets. */
export function assertStructuralCorpusBaseline(baseline: CorpusBaselineV3): void {
  const assertKeys = (keys: readonly string[], allowed: readonly string[], field: string): void => {
    const unknown = keys.find((key) => !allowed.includes(key));
    if (unknown) throw new Error(`Corpus baseline ${field} contains non-structural vocabulary.`);
  };
  assertKeys(Object.keys(baseline.themeCounts), STRUCTURAL_THEME_BUCKETS, 'themeCounts');
  assertKeys(Object.keys(baseline.tokenAxes), STRUCTURAL_AXIS_BUCKETS, 'tokenAxes');
  assertKeys(
    Object.keys(baseline.capabilityCounts),
    STRUCTURAL_CAPABILITY_BUCKETS,
    'capabilityCounts',
  );
  if (!/^sha256:[0-9a-f]{64}$/.test(baseline.retrievalGenerationHash)) {
    throw new Error('Corpus baseline generation hash is outside the structural allowlist.');
  }
}

/** Accept only closed aggregate fixture shapes and structural vocabulary. */
export function assertDeliteralizedCorpusArtifacts(value: unknown): void {
  if (!Array.isArray(value)) throw new TypeError('Corpus fixtures must be an aggregate fixture array.');
  const allowedTopLevel = ['fixtureKey', 'stratum', 'observation'];
  for (const fixture of value) {
    if (!fixture || typeof fixture !== 'object' || Array.isArray(fixture)) {
      throw new TypeError('Corpus fixture must be an aggregate object.');
    }
    const candidate = fixture as Record<string, unknown>;
    if (Object.keys(candidate).some((key) => !allowedTopLevel.includes(key))) {
      throw new Error('Corpus fixture contains a field outside the structural allowlist.');
    }
    const fixtureKey = candidate.fixtureKey;
    const observation = candidate.observation;
    if (typeof fixtureKey !== 'string' || !observation || typeof observation !== 'object') {
      throw new TypeError('Corpus fixture is missing its structural key or observation.');
    }
    const record = observation as Record<string, unknown>;
    const numeric = (key: string): boolean => (
      typeof record[key] === 'number' && Number.isFinite(record[key]) && record[key] >= 0
    );
    if (fixtureKey === 'section-shape-band') {
      if (candidate.stratum !== 'shape'
        || Object.keys(record).some((key) => !['minimum', 'typical', 'maximum'].includes(key))
        || !['minimum', 'typical', 'maximum'].every(numeric)) {
        throw new Error('Corpus shape fixture is outside the structural allowlist.');
      }
      continue;
    }
    if (fixtureKey.startsWith('theme-')) {
      if (candidate.stratum !== 'vocabulary'
        || Object.keys(record).some((key) => !['theme', 'count'].includes(key))
        || !STRUCTURAL_THEME_BUCKETS.includes(record.theme as StructuralTheme)
        || !numeric('count')
        || fixtureKey !== `theme-${record.theme}`) {
        throw new Error('Corpus theme fixture is outside the structural allowlist.');
      }
      continue;
    }
    if (fixtureKey.startsWith('rare-capability-')) {
      if (candidate.stratum !== 'rarity'
        || Object.keys(record).some((key) => !['capability', 'count'].includes(key))
        || !STRUCTURAL_CAPABILITY_BUCKETS.includes(record.capability as StructuralCapability)
        || !numeric('count')
        || fixtureKey !== `rare-capability-${record.capability}`) {
        throw new Error('Corpus capability fixture is outside the structural allowlist.');
      }
      continue;
    }
    throw new Error('Corpus fixture key is outside the structural allowlist.');
  }
}

assertStructuralCorpusBaseline(CORPUS_BASELINE_V3);
