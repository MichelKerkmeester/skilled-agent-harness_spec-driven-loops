// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Honestly-Labeled Relevance Judgments                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// Retrieval-quality ground truth without inventing a single label. Two real
// signals are the only sources: `authored-similar` rows trace to a style's own
// designSystem.similar[] authorship (a human wrote "these are alike") resolved
// against the corpus, and `silver-heuristic` rows are retrieval-derived weak
// positives where a candidate independently agrees across lanes. Every row
// carries its source and provenance; none is presented as human gold, and the
// seed header states that human relevance labeling is still required.

import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { compareRawStrings } from '../../lib/database/canonical.mjs';
import { indexStyleCorpus } from '../../lib/database/indexer.mjs';
import { queryPersistentStyles } from '../../lib/database/retrieval.mjs';
import { openStyleDatabase } from '../../lib/database/schema.mjs';

export const JUDGMENT_LABEL_SOURCES = Object.freeze(['authored-similar', 'silver-heuristic']);
export const JUDGMENT_SEED_VERSION = 1;

// A small deterministic corpus whose styles cite each other in designSystem
// .similar[], giving authored-similar derivation real resolved relationships.
const JUDGMENT_STYLES = Object.freeze([
  {
    id: 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa',
    slug: 'alpha-editorial',
    title: 'Alpha Editorial',
    theme: 'light',
    industry: 'Editorial',
    text: 'Warm cream serif typography with measured spacing and quiet components.',
    similar: [{ business: 'Beta Product', why: 'Shared editorial restraint.' }],
  },
  {
    id: 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb',
    slug: 'beta-product',
    title: 'Beta Product',
    theme: 'dark',
    industry: 'SaaS',
    text: 'Dark sans-serif product interface with animation and motion transitions.',
    similar: [{ business: 'Alpha Editorial', why: 'Shared structural rigor.' }],
  },
  {
    id: 'cccccccc-3333-4333-8333-cccccccccccc',
    slug: 'gamma-editorial',
    title: 'Gamma Editorial',
    theme: 'light',
    industry: 'Editorial',
    text: 'Warm cream serif typography with a deliberate serif role.',
    similar: [{ business: 'Alpha Editorial', why: 'Editorial kinship.' }],
  },
  {
    id: 'dddddddd-4444-4444-8444-dddddddddddd',
    slug: 'delta-product',
    title: 'Delta Product',
    theme: 'dark',
    industry: 'SaaS',
    text: 'Dark sans-serif motion product interface with animation.',
    similar: [{ business: 'Beta Product', why: 'Product-system kinship.' }],
  },
]);

// Fixed probes that force independent lane agreement: an exact required-facet
// match (structured) that also matches lexically (FTS).
const SILVER_PROBE_QUERIES = Object.freeze([
  { text: 'warm cream serif typography', requiredFacets: ['warm-surface'] },
  { text: 'motion animation product interface', requiredFacets: ['motion'] },
]);

function judgmentCanonical(style) {
  return {
    source: `https://styles.example.test/${style.id}`,
    uuid: style.id,
    name: style.title,
    northStar: style.text,
    capturedAt: '2026-01-01T00:00:00.000Z',
    meta: { url: `https://${style.slug}.example.test` },
    screenshot: { url: `https://images.example.test/${style.slug}.jpg` },
    designSystem: {
      theme: style.theme,
      industry: style.industry,
      description: style.text,
      colors: [{ name: 'Canvas', hex: '#ffffff' }],
      typography: [{ family: style.text.includes('serif') ? 'Source Serif' : 'Inter' }],
      spacing: { sectionGap: '64px' },
      components: [{ name: 'Button' }],
      dos: ['Keep one coherent anchor.'],
      donts: ['Do not average token values.'],
      layout: 'Centered grid',
      imagery: 'Editorial photography',
      similar: style.similar,
    },
  };
}

function judgmentDesignMarkdown(style) {
  return `# ${style.title} — Style Reference\n> ${style.text}\n\n`
    + `## Tokens — Colors\n${style.text}\n\n`
    + '## Tokens — Typography\nSource Serif and Inter\n\n'
    + '## Components\nButton\n';
}

async function writeJudgmentStyle(root, style) {
  const { writeFile } = await import('node:fs/promises');
  const styleRoot = path.join(root, style.slug);
  await mkdir(styleRoot, { recursive: true });
  await writeFile(
    path.join(styleRoot, `${style.slug}-canonical.json`),
    `${JSON.stringify(judgmentCanonical(style), null, 2)}\n`,
  );
  await writeFile(path.join(styleRoot, 'DESIGN.md'), judgmentDesignMarkdown(style));
  await writeFile(
    path.join(styleRoot, 'source.md'),
    `# ${style.title} — source\n\n- **Style UUID:** \`${style.id}\`\n`,
  );
}

async function writeJudgmentCrawlManifest(root, styles) {
  const { writeFile } = await import('node:fs/promises');
  const records = styles.map((style) => ({
    uuid: style.id,
    url: `https://styles.example.test/${style.id}`,
    slug: style.slug,
    status: 'captured',
    capturedAt: '2026-01-01T00:00:00.000Z',
    error: null,
  }));
  await writeFile(path.join(root, '_manifest.json'), `${JSON.stringify(records, null, 2)}\n`);
}

/**
 * Build an in-memory database over the deterministic judgment corpus.
 *
 * @returns {Promise<{database:Object, styles:Object[], cleanup:Function}>} Judgment database handle.
 */
export async function buildJudgmentDatabase() {
  const base = await mkdtemp(path.join(os.tmpdir(), 'style-judgment-fixture-'));
  const root = path.join(base, 'styles');
  await mkdir(root);
  await writeJudgmentCrawlManifest(root, JUDGMENT_STYLES);
  for (const style of JUDGMENT_STYLES) await writeJudgmentStyle(root, style);
  const database = openStyleDatabase();
  await indexStyleCorpus({ corpusRoot: root, database, corpusWalkMode: 'migration' });
  await rm(base, { recursive: true, force: true });
  return { database, styles: JUDGMENT_STYLES, cleanup: () => database.close() };
}

/**
 * Derive positive judgments from resolved authored similarity relationships.
 *
 * @param {Object} database - Indexed style database.
 * @returns {Object[]} Authored-similar judgment rows.
 */
export function deriveAuthoredSimilarJudgments(database) {
  const rows = database.prepare(`
    SELECT source.style_id AS source_id, target.style_id AS target_id,
      relationship.raw_target_label AS raw_target_label
    FROM style_relationships relationship
    JOIN styles source ON source.style_rowid = relationship.source_style_rowid
    JOIN styles target ON target.style_rowid = relationship.target_style_rowid
    WHERE relationship.resolution_state = 'resolved'
    ORDER BY source.style_id ASC, target.style_id ASC
  `).all();
  return rows.map((row) => ({
    query: { styleId: row.source_id },
    relevant: [row.target_id],
    label_source: 'authored-similar',
    confidence: 1,
    provenance: {
      table: 'style_relationships',
      resolutionState: 'resolved',
      rawTargetLabel: row.raw_target_label,
    },
  }));
}

/**
 * Derive weak positives where a candidate independently agrees across lanes.
 *
 * @param {Object} database - Indexed style database.
 * @param {Object} [options] - Overrides.
 * @param {Object[]} [options.queries=SILVER_PROBE_QUERIES] - Probe requests.
 * @returns {Object[]} Silver-heuristic judgment rows.
 */
export function deriveSilverHeuristicJudgments(database, { queries = SILVER_PROBE_QUERIES } = {}) {
  const judgments = [];
  for (const query of queries) {
    const result = queryPersistentStyles(query, { database });
    for (const card of result.cards) {
      const attribution = result.attributions[card.id];
      const agreeingChannels = Object.keys(attribution?.sourceRanks ?? {}).sort(compareRawStrings);
      if (agreeingChannels.length < 2) continue;
      judgments.push({
        query: { text: query.text, requiredFacets: query.requiredFacets ?? [] },
        relevant: [card.id],
        label_source: 'silver-heuristic',
        confidence: 0.4,
        provenance: {
          method: 'cross-lane-agreement',
          agreeingChannels,
          requiredFacets: query.requiredFacets ?? [],
        },
      });
    }
  }
  return judgments.sort((left, right) => (
    compareRawStrings(stableProbeKey(left), stableProbeKey(right))
    || compareRawStrings(left.relevant[0], right.relevant[0])
  ));
}

function stableProbeKey(judgment) {
  return `${judgment.query.text} ${(judgment.query.requiredFacets ?? []).join(',')}`;
}

/**
 * Assemble the full, honestly-labeled judgment seed document.
 *
 * @param {Object} database - Indexed judgment database.
 * @returns {Object} Versioned seed with a human-labeling-required header.
 */
export function buildJudgmentSeed(database) {
  const authored = deriveAuthoredSimilarJudgments(database);
  const silver = deriveSilverHeuristicJudgments(database);
  return {
    seedVersion: JUDGMENT_SEED_VERSION,
    humanLabelingRequired: true,
    warning: 'No row here is human-authored gold. authored-similar rows trace to '
      + 'designSystem.similar[] authorship resolved against the corpus; silver-heuristic '
      + 'rows are retrieval-derived pseudo-labels from cross-lane agreement. A true judged '
      + 'qrels set still requires human relevance labeling.',
    labelSources: [...JUDGMENT_LABEL_SOURCES],
    method: {
      'authored-similar': 'Resolved style_relationships parsed from each style\'s '
        + 'designSystem.similar[] similarity claims.',
      'silver-heuristic': 'Candidates appearing in two or more independent retrieval lanes '
        + 'for a fixed exact-facet probe query; weak positive at confidence 0.4.',
    },
    judgments: [...authored, ...silver],
  };
}

/**
 * Validate one judgment row's provenance and label honesty.
 *
 * @param {Object} row - Judgment row.
 * @returns {string[]} Problem descriptions; empty when the row is valid.
 */
export function validateJudgmentRow(row) {
  const problems = [];
  if (!row || typeof row !== 'object') return ['row is not an object'];
  if (!JUDGMENT_LABEL_SOURCES.includes(row.label_source)) {
    problems.push(`label_source must be one of ${JUDGMENT_LABEL_SOURCES.join(', ')}`);
  }
  if (!row.provenance || typeof row.provenance !== 'object' || Object.keys(row.provenance).length === 0) {
    problems.push('provenance is required on every row');
  }
  if (!Array.isArray(row.relevant) || row.relevant.length === 0) {
    problems.push('relevant must be a non-empty array');
  }
  if (typeof row.confidence !== 'number' || row.confidence < 0 || row.confidence > 1) {
    problems.push('confidence must be a number in [0, 1]');
  }
  if (!row.query || typeof row.query !== 'object') {
    problems.push('query context is required');
  }
  return problems;
}

/**
 * Load and validate a judgment seed from a path or a parsed object.
 *
 * @param {string|Object} source - Seed file path or parsed seed object.
 * @returns {Promise<Object>} The validated seed document.
 */
export async function loadJudgmentSeed(source) {
  const seed = typeof source === 'string'
    ? JSON.parse(await readFile(source, 'utf8'))
    : source;
  if (seed.humanLabelingRequired !== true) {
    throw new Error('Judgment seed must flag that human labeling is still required.');
  }
  if (!Array.isArray(seed.judgments) || seed.judgments.length === 0) {
    throw new Error('Judgment seed must contain at least one judgment row.');
  }
  for (const [index, row] of seed.judgments.entries()) {
    const problems = validateJudgmentRow(row);
    if (problems.length > 0) {
      throw new Error(`Judgment row ${index} is invalid: ${problems.join('; ')}`);
    }
  }
  return seed;
}
