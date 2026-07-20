// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deterministic Replay Fixtures                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// Materialize representative corpora at three scales so every later phase can
// replay parity and measure cost against a stable, reproducible input. Every
// byte of a generated corpus is a pure function of an index-derived seed — no
// wall-clock, no randomness — so regenerating a scale yields identical bytes and
// the oracle reproduces identical query output. The 100x scale approximates the
// real ~1,290-bundle corpus; the base multiplier is tunable per environment.

import { mkdir, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  writeFixtureCrawlManifest,
  writeFixtureStyle,
} from '../../_engine/__tests__/fixtures.mjs';
import { HASH_PREFIX, compareRawStrings, digest, stableJson } from '../canonical.mjs';
import { buildOracleDatabase, captureOracle } from './differential-oracle.mjs';
import { ORACLE_QUERY_SET } from './query-set.mjs';

export const REPLAY_SCALES = Object.freeze({ '1x': 13, '10x': 130, '100x': 1_300 });

// Per-class vocabulary pools. Cycling each field through a differently sized
// pool keyed on the ordinal gives every style its own content while staying a
// pure function of position: a 100x corpus is genuinely varied documents, not
// a handful of duplicated templates, so ranking and fusion are exercised for
// real at scale.
const EDITORIAL_SURFACES = Object.freeze([
  'warm cream', 'soft ivory', 'pale linen', 'sunlit sand', 'muted bone', 'gentle beige',
]);
const EDITORIAL_VOICES = Object.freeze([
  'a deliberate serif voice', 'an old-style serif rhythm',
  'a transitional serif pairing', 'a humanist serif column',
]);
const EDITORIAL_INDUSTRIES = Object.freeze(['Editorial', 'Publishing', 'Journalism', 'Longform']);
const PRODUCT_SURFACES = Object.freeze([
  'deep charcoal', 'cool slate', 'ink black', 'graphite steel', 'midnight navy', 'dim carbon',
]);
const PRODUCT_MOTIONS = Object.freeze([
  'kinetic motion', 'scroll-driven animation', 'springy transitions', 'animated overlays',
]);
const PRODUCT_INDUSTRIES = Object.freeze(['SaaS', 'Fintech', 'Commerce', 'Gaming', 'Travel', 'Healthcare']);

function toHex(value, length) {
  return value.toString(16).padStart(length, '0');
}

function seededUuid(ordinal) {
  return `${toHex(ordinal, 8)}-0000-4000-8000-${toHex(ordinal, 12)}`;
}

function pick(pool, ordinal) {
  return pool[ordinal % pool.length];
}

/**
 * Project document text onto the two-dimensional oracle vector space.
 *
 * The vector is a pure function of the document bytes, so a scaled corpus draws
 * a stable spread of cosine similarities against the fixed query basis without
 * a real embedding model — the vector, hybrid, and fusion lanes get honestly
 * varied inputs that still reproduce byte-for-byte on every replay.
 *
 * @param {string} text - Document text passed by the vector drain.
 * @returns {number[]} A stable, positive two-dimensional vector.
 */
export function scaledOracleEmbedder(text) {
  const hex = digest(text).slice(HASH_PREFIX.length);
  const first = (parseInt(hex.slice(0, 8), 16) % 997) + 1;
  const second = (parseInt(hex.slice(8, 16), 16) % 997) + 1;
  return [first, second];
}

/**
 * Produce a deterministic list of scaled style definitions.
 *
 * @param {number} count - Number of styles to generate.
 * @returns {Object[]} Ordered, reproducible style definitions.
 */
export function generateScaledStyles(count) {
  return Array.from({ length: count }, (_, index) => {
    const ordinal = index + 1;
    const common = {
      id: seededUuid(ordinal),
      slug: `replay-${String(ordinal).padStart(5, '0')}`,
    };
    if (ordinal % 2 === 1) {
      const surface = pick(EDITORIAL_SURFACES, ordinal);
      const voice = pick(EDITORIAL_VOICES, ordinal);
      const industry = pick(EDITORIAL_INDUSTRIES, ordinal);
      return {
        ...common,
        title: `Replay Editorial ${ordinal}`,
        thesis: `Warm ${surface} editorial system with ${voice}.`,
        theme: 'light',
        industry,
        text: `${surface} serif typography with measured spacing, `
          + `quiet ${industry.toLowerCase()} components, and ${voice}.`,
      };
    }
    const surface = pick(PRODUCT_SURFACES, ordinal);
    const motion = pick(PRODUCT_MOTIONS, ordinal);
    const industry = pick(PRODUCT_INDUSTRIES, ordinal);
    return {
      ...common,
      title: `Replay Product ${ordinal}`,
      thesis: `${surface} product system with ${motion} and compact controls.`,
      theme: 'dark',
      industry,
      text: `${surface} sans-serif ${industry.toLowerCase()} interface `
        + `with ${motion} and animation transitions.`,
    };
  });
}

/**
 * Materialize a deterministic corpus of the requested size to a temp directory.
 *
 * @param {number} count - Number of style bundles to write.
 * @param {Object} [options] - Overrides.
 * @param {Object[]} [options.styles] - Explicit style definitions.
 * @returns {Promise<{root:string, base:string, styles:Object[], cleanup:Function}>} Fixture handle.
 */
export async function materializeReplayCorpus(count, { styles } = {}) {
  const resolved = styles ?? generateScaledStyles(count);
  const base = await mkdtemp(path.join(os.tmpdir(), 'style-replay-fixture-'));
  const root = path.join(base, 'styles');
  await mkdir(root);
  await writeFixtureCrawlManifest(root, resolved);
  for (const style of resolved) await writeFixtureStyle(root, style);
  return {
    root,
    base,
    styles: resolved,
    cleanup: () => rm(base, { recursive: true, force: true }),
  };
}

async function collectRelativeFiles(root, prefix = '') {
  const entries = (await readdir(path.join(root, prefix), { withFileTypes: true }))
    .sort((left, right) => compareRawStrings(left.name, right.name));
  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await collectRelativeFiles(root, relative));
    else files.push(relative);
  }
  return files;
}

/**
 * Content-address every byte of a materialized corpus for determinism checks.
 *
 * @param {string} root - Materialized corpus root.
 * @returns {Promise<string>} Stable digest over all bundle bytes.
 */
export async function replayCorpusContentHash(root) {
  const files = await collectRelativeFiles(root);
  const entries = [];
  for (const relative of files) {
    entries.push({ path: relative, sha256: digest([await readFile(path.join(root, relative))]) });
  }
  return digest(stableJson(entries));
}

/**
 * Build a scaled corpus into a query-ready oracle database with vectors drained.
 *
 * @param {string} root - Materialized corpus root.
 * @returns {Promise<import('node:sqlite').DatabaseSync>} Ready database.
 */
export async function buildScaledOracleDatabase(root) {
  return buildOracleDatabase({ corpusRoot: root, embedder: scaledOracleEmbedder });
}

/**
 * Index a materialized corpus and hash the full oracle matrix outputs.
 *
 * The full query matrix — including the vector, hybrid, exact-reuse, and cursor
 * lanes — replays against the scaled corpus with vectors drained, so parity is
 * pinned across every ranking path at scale rather than only the structured and
 * lexical probes.
 *
 * @param {string} root - Materialized corpus root.
 * @returns {Promise<string>} Stable digest over the full-matrix captures.
 */
export async function captureScaleOracle(root) {
  const database = await buildScaledOracleDatabase(root);
  try {
    const captures = captureOracle(database, ORACLE_QUERY_SET);
    return digest(stableJson(captures.map(({ name, sha256 }) => ({ name, sha256 }))));
  } finally {
    database.close();
  }
}
