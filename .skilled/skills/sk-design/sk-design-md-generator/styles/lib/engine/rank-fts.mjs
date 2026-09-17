// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Disposable Lexical Ranking                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

import { compareRawStrings } from './ordering.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const MAX_SOURCE_SCAN_RECORDS = 1_290;
export const MAX_SOURCE_SCAN_BYTES = 24 * 1024 * 1024;

const MAX_DOCUMENT_BYTES = 64 * 1024;
const MAX_QUERY_TERMS = 12;
const MAX_QUERY_LENGTH = 1_000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. SHARED SCORING
// ─────────────────────────────────────────────────────────────────────────────

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

function queryTerms(text) {
  if (typeof text !== 'string' || text.length > MAX_QUERY_LENGTH) {
    const error = new Error(
      `Query text must be a string of at most ${MAX_QUERY_LENGTH} characters.`,
    );
    error.code = 'invalid-query';
    throw error;
  }
  return [...new Set(text.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? [])]
    .slice(0, MAX_QUERY_TERMS)
    .map((term) => term.slice(0, 64));
}

function deterministicScore(style, request) {
  const requiredCount = style.eligibility?.matchedRequiredFacets?.length ?? 0;
  const axes = new Set((style.tokenAxes ?? []).map((entry) => normalize(entry.axis)));
  const capabilities = new Set((style.capabilities ?? []).map(normalize));
  const axisMatches = (request.axes ?? []).filter((axis) => axes.has(normalize(axis))).length;
  const needMatches = (request.needs ?? [])
    .filter((need) => capabilities.has(normalize(need))).length;
  return requiredCount * 10 + axisMatches * 2 + needMatches;
}

function applyScores(styles, lexicalScores, request) {
  return styles.map((style) => {
    const deterministic = deterministicScore(style, request);
    const lexical = Number((lexicalScores.get(style.id) ?? 0).toFixed(6));
    return {
      style,
      score: {
        deterministic,
        lexical,
        total: Number((deterministic + lexical).toFixed(6)),
      },
    };
  }).sort((left, right) => (
    right.score.total - left.score.total
    || right.score.deterministic - left.score.deterministic
    || right.score.lexical - left.score.lexical
    || compareRawStrings(left.style.id, right.style.id)
  ));
}

function isContained(rootPath, candidatePath) {
  const relative = path.relative(rootPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function readDesignDocument(corpusRoot, corpusRealPath, style) {
  const designPath = path.join(corpusRoot, style.slug, 'DESIGN.md');
  try {
    const designRealPath = await realpath(designPath);
    if (!isContained(corpusRealPath, designRealPath)) {
      const error = new Error(`DESIGN.md escapes the corpus root for ${style.id}.`);
      error.code = 'path-escape';
      throw error;
    }
    const buffer = await readFile(designRealPath);
    return buffer.subarray(0, MAX_DOCUMENT_BYTES);
  } catch (error) {
    if (error.code === 'ENOENT') return Buffer.alloc(0);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DISPOSABLE FTS
// ─────────────────────────────────────────────────────────────────────────────

async function rankWithFts(styles, request, corpusRoot) {
  const terms = queryTerms(request.text ?? '');
  if (terms.length === 0) return new Map();
  const { DatabaseSync } = await import('node:sqlite');
  const database = new DatabaseSync(':memory:');
  const corpusRealPath = await realpath(corpusRoot);
  try {
    database.exec(
      'CREATE VIRTUAL TABLE styles_fts USING fts5(id UNINDEXED, title, thesis, body);',
    );
    const insert = database.prepare(
      'INSERT INTO styles_fts(id, title, thesis, body) VALUES (?, ?, ?, ?);',
    );
    for (const style of styles) {
      const body = await readDesignDocument(corpusRoot, corpusRealPath, style);
      insert.run(style.id, style.title, style.thesis, body.toString('utf8'));
    }
    const matchExpression = terms.map((term) => `"${term.replaceAll('"', '""')}"`).join(' OR ');
    const rows = database.prepare(
      'SELECT id, bm25(styles_fts, 5.0, 3.0, 1.0) AS rank '
      + 'FROM styles_fts WHERE styles_fts MATCH ? ORDER BY rank ASC, id ASC;',
    ).all(matchExpression);
    return new Map(rows.map((row) => [row.id, Math.max(0, -Number(row.rank))]));
  } finally {
    database.close();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. BOUNDED SOURCE SCAN
// ─────────────────────────────────────────────────────────────────────────────

function countTerm(text, term) {
  let count = 0;
  let offset = 0;
  while (count < 20) {
    const index = text.indexOf(term, offset);
    if (index === -1) break;
    count += 1;
    offset = index + term.length;
  }
  return count;
}

/**
 * Rank eligible styles using a bounded live scan of DESIGN.md sources.
 *
 * @param {Object[]} styles - Already eligible manifest records.
 * @param {Object} request - Generic retrieval request.
 * @param {string} corpusRoot - Styles corpus root.
 * @param {Object} [limits] - Scan limits.
 * @returns {Promise<{scores:Map,scannedRecords:number,scannedBytes:number}>} Scan result.
 */
export async function rankWithSourceScan(styles, request, corpusRoot, limits = {}) {
  const maxRecords = limits.maxRecords ?? MAX_SOURCE_SCAN_RECORDS;
  const maxBytes = limits.maxBytes ?? MAX_SOURCE_SCAN_BYTES;
  const terms = queryTerms(request.text ?? '');
  const scores = new Map();
  const corpusRealPath = await realpath(corpusRoot);
  let scannedRecords = 0;
  let scannedBytes = 0;
  const orderedStyles = styles.slice().sort(
    (left, right) => compareRawStrings(left.id, right.id),
  );
  for (const style of orderedStyles) {
    if (scannedRecords >= maxRecords || scannedBytes >= maxBytes) break;
    const remainingBytes = maxBytes - scannedBytes;
    const body = (await readDesignDocument(corpusRoot, corpusRealPath, style))
      .subarray(0, remainingBytes);
    scannedRecords += 1;
    scannedBytes += body.byteLength;
    const title = normalize(style.title);
    const thesis = normalize(style.thesis);
    const source = body.toString('utf8').toLowerCase();
    let score = 0;
    for (const term of terms) {
      score += countTerm(title, term) * 5;
      score += countTerm(thesis, term) * 3;
      score += countTerm(source, term);
    }
    scores.set(style.id, score);
  }
  return { scores, scannedRecords, scannedBytes };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PUBLIC RANKING API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Order an already eligible set with disposable FTS or a bounded live fallback.
 *
 * @param {Object[]} eligibleStyles - Records that passed deterministic gates.
 * @param {Object} request - Generic retrieval request.
 * @param {Object} options - Ranking paths and accelerator controls.
 * @param {string} options.corpusRoot - Styles corpus root.
 * @param {string} options.generationHash - Current manifest generation.
 * @param {boolean} [options.useFts=true] - Allow the disposable accelerator.
 * @param {string} [options.acceleratorGenerationHash] - Cached generation identity.
 * @returns {Promise<Object>} Ranked eligible records and degradation metadata.
 */
export async function rankEligibleStyles(eligibleStyles, request, options) {
  if (!Array.isArray(eligibleStyles)) {
    const error = new TypeError('eligibleStyles must be an array.');
    error.code = 'invalid-input';
    throw error;
  }
  const isStale = options.acceleratorGenerationHash
    && options.acceleratorGenerationHash !== options.generationHash;
  if ((options.useFts ?? true) && !isStale) {
    try {
      const lexicalScores = await rankWithFts(eligibleStyles, request, options.corpusRoot);
      return {
        ranked: applyScores(eligibleStyles, lexicalScores, request),
        degraded: false,
        rankingMode: 'fts5-bm25',
        scannedRecords: eligibleStyles.length,
      };
    } catch (error) {
      if (error.code === 'path-escape' || error.code === 'invalid-query') throw error;
    }
  }

  const fallback = await rankWithSourceScan(
    eligibleStyles,
    request,
    options.corpusRoot,
    options.scanLimits,
  );
  return {
    ranked: applyScores(eligibleStyles, fallback.scores, request),
    degraded: true,
    rankingMode: 'source-scan',
    scannedRecords: fallback.scannedRecords,
    scannedBytes: fallback.scannedBytes,
  };
}
