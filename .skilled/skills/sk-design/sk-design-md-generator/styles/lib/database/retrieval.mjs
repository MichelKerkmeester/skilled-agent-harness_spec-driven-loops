// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Generation-Bound Persistent Style Retrieval                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { assembleCandidateCards } from '../engine/cards.mjs';
import { compareRawStrings, digest, stableJson } from './canonical.mjs';
import { RESIDENCY } from './stage-telemetry.mjs';
import {
  STYLE_DB_SCHEMA_VERSION,
  openPublishedStyleDatabase,
} from './schema.mjs';

export const FUSION_PROFILE = Object.freeze({
  id: 'style-rrf-v1',
  k: 60,
  weights: Object.freeze({ structured: 1, fts: 1, vector: 1 }),
});

const MAX_QUERY_LENGTH = 1_000;
const MAX_QUERY_TERMS = 12;
const MAX_QUERY_VECTOR_DIMENSIONS = 16_384;
const MAX_QUERY_VECTOR_BYTES = 256 * 1_024;
const MAX_CANDIDATE_K = 200;
const DEFAULT_CANDIDATE_K = 50;
const EXACT_REUSE_LICENSES = new Set(['allowed', 'licensed', 'public-domain']);

function normalizeFacet(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function queryTerms(text) {
  if (typeof text !== 'string' || text.length > MAX_QUERY_LENGTH) {
    const error = new Error(`Query text must be a string of at most ${MAX_QUERY_LENGTH} characters.`);
    error.code = 'invalid-query';
    throw error;
  }
  return [...new Set(text.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? [])]
    .slice(0, MAX_QUERY_TERMS).map((term) => term.slice(0, 64));
}

function placeholders(count) {
  return Array.from({ length: count }, () => '?').join(', ');
}

function encodeOpaque(value) {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

function decodeOpaque(value, code) {
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
  } catch (cause) {
    const error = new Error(`Invalid ${code}.`, { cause });
    error.code = code;
    throw error;
  }
}

function retrievalError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function validateQueryVector(queryVector) {
  if (queryVector === undefined || queryVector === null) return null;
  if (!Array.isArray(queryVector)
    || queryVector.length === 0
    || queryVector.length > MAX_QUERY_VECTOR_DIMENSIONS
    || queryVector.some((value) => typeof value !== 'number' || !Number.isFinite(value))) {
    throw retrievalError(
      'invalid-query-vector',
      `queryVector must contain 1-${MAX_QUERY_VECTOR_DIMENSIONS} finite numbers.`,
    );
  }
  if (Buffer.byteLength(JSON.stringify(queryVector), 'utf8') > MAX_QUERY_VECTOR_BYTES) {
    throw retrievalError(
      'invalid-query-vector',
      `queryVector must serialize to at most ${MAX_QUERY_VECTOR_BYTES} bytes.`,
    );
  }
  return queryVector;
}

function requestFingerprint(request, candidateK, profile) {
  const fingerprintRequest = {
    text: request.text ?? '',
    requiredFacets: (request.requiredFacets ?? []).map(normalizeFacet).sort(compareRawStrings),
    exclusions: (request.exclusions ?? []).map(normalizeFacet).sort(compareRawStrings),
    axes: (request.axes ?? []).map(normalizeFacet).sort(compareRawStrings),
    needs: (request.needs ?? []).map(normalizeFacet).sort(compareRawStrings),
    usage: request.usage ?? null,
    exactReuse: request.exactReuse === true,
    generationHash: request.generationHash ?? null,
    queryVector: request.queryVector ?? null,
    vectorProfile: request.vectorProfile ?? null,
    disableFts: request.disableFts === true,
    disableVector: request.disableVector === true,
    candidateK,
    fusionProfile: profile,
  };
  if (request.requiredCompositionFacets !== undefined) {
    fingerprintRequest.requiredCompositionFacets = request.requiredCompositionFacets
      .map(normalizeFacet).sort(compareRawStrings);
  }
  if (request.compositionFacets !== undefined) {
    fingerprintRequest.compositionFacets = request.compositionFacets
      .map(normalizeFacet).sort(compareRawStrings);
  }
  return digest(stableJson(fingerprintRequest));
}

function loadEligibility(database, request, telemetry) {
  const loadSpan = telemetry?.span('eligibility.load', RESIDENCY.NATIVE);
  const rows = database.prepare(`
    SELECT s.style_rowid, s.style_id, s.slug, s.title, s.thesis, s.theme,
      s.industry, s.aggregate_hash, s.retrieval_hash, p.status AS provenance_status,
      p.source_url, p.original_url, p.screenshot_url, p.source_uuid, p.captured_at,
      p.license_status, p.rights_known, p.evidence_scope_json
    FROM styles s
    JOIN style_provenance p ON p.style_rowid = s.style_rowid
    WHERE s.lifecycle_state = 'active'
    ORDER BY s.style_id ASC
  `).all();
  loadSpan?.end(rows.length);
  if (rows.length === 0) {
    return { eligible: [], rejectedCount: 0, activeCount: 0 };
  }
  const ids = rows.map((row) => row.style_rowid);
  const bindings = placeholders(ids.length);
  const facetsLoadSpan = telemetry?.span('eligibility.facets.load', RESIDENCY.NATIVE);
  const termRows = database.prepare(`
    SELECT style_rowid, term FROM style_terms WHERE style_rowid IN (${bindings})
  `).all(...ids);
  const axisRows = database.prepare(`
    SELECT style_rowid, axis FROM style_token_axes WHERE style_rowid IN (${bindings})
  `).all(...ids);
  const sectionRows = database.prepare(`
    SELECT style_rowid, name FROM style_sections WHERE style_rowid IN (${bindings})
  `).all(...ids);
  const compositionRows = database.prepare(`
    SELECT style_rowid, facet FROM style_composition_facets
    WHERE style_rowid IN (${bindings})
  `).all(...ids);
  facetsLoadSpan?.end(
    termRows.length + axisRows.length + sectionRows.length + compositionRows.length,
  );
  const facetsAssembleSpan = telemetry?.span('eligibility.facets.assemble', RESIDENCY.JS_RESIDENT);
  const facetsById = new Map(ids.map((id) => [Number(id), new Set()]));
  const compositionFacetsById = new Map(ids.map((id) => [Number(id), new Set()]));
  for (const term of termRows) {
    facetsById.get(Number(term.style_rowid)).add(normalizeFacet(term.term));
  }
  for (const axis of axisRows) {
    facetsById.get(Number(axis.style_rowid)).add(normalizeFacet(axis.axis));
  }
  for (const section of sectionRows) {
    facetsById.get(Number(section.style_rowid)).add(normalizeFacet(section.name));
  }
  for (const composition of compositionRows) {
    compositionFacetsById.get(Number(composition.style_rowid))
      .add(normalizeFacet(composition.facet));
  }
  facetsAssembleSpan?.end(rows.length);
  const filterSpan = telemetry?.span('eligibility.filter', RESIDENCY.JS_RESIDENT);
  const required = (request.requiredFacets ?? []).map(normalizeFacet).filter(Boolean);
  const excluded = (request.exclusions ?? []).map(normalizeFacet).filter(Boolean);
  const requiredComposition = (request.requiredCompositionFacets ?? [])
    .map(normalizeFacet).filter(Boolean);
  const exactReuse = request.usage === 'exact-reuse' || request.exactReuse === true;
  const eligible = rows.filter((row) => {
    const facets = facetsById.get(Number(row.style_rowid));
    const compositionFacets = compositionFacetsById.get(Number(row.style_rowid));
    if (row.theme) facets.add(normalizeFacet(row.theme));
    if (row.license_status === 'restricted') facets.add('license-restricted');
    return required.every((facet) => facets.has(facet))
      && requiredComposition.every((facet) => compositionFacets.has(facet))
      && excluded.every((facet) => !facets.has(facet))
      && row.provenance_status === 'known'
      && (!exactReuse || (
        Number(row.rights_known) === 1 && EXACT_REUSE_LICENSES.has(row.license_status)
      ));
  }).map((row) => ({
    ...row,
    facets: facetsById.get(Number(row.style_rowid)),
    compositionFacets: compositionFacetsById.get(Number(row.style_rowid)),
    matchedRequiredFacets: required,
    matchedRequiredCompositionFacets: requiredComposition,
  }));
  filterSpan?.end(eligible.length);
  return { eligible, rejectedCount: rows.length - eligible.length, activeCount: rows.length };
}

function structuredLane(database, eligible, request, candidateK, telemetry) {
  const axes = new Set((request.axes ?? []).map(normalizeFacet));
  const needs = new Set((request.needs ?? []).map(normalizeFacet));
  const compositionFacets = new Set((request.compositionFacets ?? []).map(normalizeFacet));
  const ids = eligible.map((row) => row.style_rowid);
  if (ids.length === 0) return [];
  const loadSpan = telemetry?.span('lane.structured.load', RESIDENCY.NATIVE);
  const axisRows = database.prepare(`
    SELECT style_rowid, axis FROM style_token_axes
    WHERE style_rowid IN (${placeholders(ids.length)})
  `).all(...ids);
  const capabilities = database.prepare(`
    SELECT style_rowid, term FROM style_terms
    WHERE term_type = 'capability' AND style_rowid IN (${placeholders(ids.length)})
  `).all(...ids);
  loadSpan?.end(axisRows.length + capabilities.length);
  const rankSpan = telemetry?.span('lane.structured.rank', RESIDENCY.JS_RESIDENT);
  const axisById = new Map(ids.map((id) => [Number(id), new Set()]));
  const capabilitiesById = new Map(ids.map((id) => [Number(id), new Set()]));
  for (const row of axisRows) axisById.get(Number(row.style_rowid)).add(normalizeFacet(row.axis));
  for (const row of capabilities) {
    capabilitiesById.get(Number(row.style_rowid)).add(normalizeFacet(row.term));
  }
  const ranked = eligible.map((row) => ({
    id: row.style_id,
    rawScore: row.matchedRequiredFacets.length * 10
      + row.matchedRequiredCompositionFacets.length * 10
      + [...axes].filter((axis) => axisById.get(Number(row.style_rowid)).has(axis)).length * 2
      + [...compositionFacets]
        .filter((facet) => row.compositionFacets.has(facet)).length * 2
      + [...needs].filter((need) => capabilitiesById.get(Number(row.style_rowid)).has(need)).length,
  })).sort((left, right) => right.rawScore - left.rawScore
    || compareRawStrings(left.id, right.id)).slice(0, candidateK);
  rankSpan?.end(ranked.length);
  return ranked;
}

function ftsLane(database, eligible, request, candidateK, telemetry) {
  const terms = queryTerms(request.text ?? '');
  if (terms.length === 0) return [];
  const ids = eligible.map((row) => row.style_rowid);
  if (ids.length === 0) return [];
  const expression = terms.map((term) => `"${term.replaceAll('"', '""')}"`).join(' OR ');
  const span = telemetry?.span('lane.fts', RESIDENCY.NATIVE);
  const ranked = database.prepare(`
    SELECT s.style_id AS id, bm25(style_fts, 5.0, 3.0, 2.0, 2.0, 1.0, 1.0) AS raw_score
    FROM style_fts
    JOIN styles s ON s.style_rowid = style_fts.rowid
    WHERE style_fts MATCH ? AND s.style_rowid IN (${placeholders(ids.length)})
    ORDER BY raw_score ASC, s.style_id ASC LIMIT ?
  `).all(expression, ...ids, candidateK).map((row) => ({
    id: row.id,
    rawScore: Number(row.raw_score),
  }));
  span?.end(ranked.length);
  return ranked;
}

function cosine(left, right) {
  if (left.length !== right.length || left.length === 0) return null;
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] ** 2;
    rightNorm += right[index] ** 2;
  }
  if (leftNorm === 0 || rightNorm === 0) return null;
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

function vectorLane(database, eligible, request, candidateK, telemetry) {
  if (!Array.isArray(request.queryVector) || !request.vectorProfile) return [];
  const queryVector = request.queryVector;
  const ids = eligible.map((row) => row.style_rowid);
  if (ids.length === 0) return [];
  const fetchSpan = telemetry?.span('lane.vector.fetch', RESIDENCY.NATIVE);
  const rows = database.prepare(`
    SELECT s.style_id AS id, v.vector_json
    FROM style_vectors v
    JOIN styles s ON s.style_rowid = v.style_rowid
      AND s.retrieval_hash = v.retrieval_hash
      AND s.lifecycle_state = 'active'
    WHERE v.profile_id = ? AND v.style_rowid IN (${placeholders(ids.length)})
  `).all(request.vectorProfile, ...ids);
  fetchSpan?.end(rows.length);
  const computeSpan = telemetry?.span('lane.vector.cosine', RESIDENCY.JS_RESIDENT);
  const ranked = rows.map((row) => ({
    id: row.id,
    rawScore: cosine(queryVector, JSON.parse(row.vector_json)),
  })).filter((row) => row.rawScore !== null)
    .sort((left, right) => right.rawScore - left.rawScore
      || compareRawStrings(left.id, right.id)).slice(0, candidateK);
  computeSpan?.end(ranked.length);
  return ranked;
}

/**
 * Fuse ranked channels with a versioned weighted reciprocal-rank formula.
 *
 * @param {Object<string,Object[]>} lanes - Ordered candidate lists by channel.
 * @param {Object} [profile=FUSION_PROFILE] - RRF k and channel weights.
 * @returns {Object[]} Deterministically fused candidates with attribution.
 */
export function weightedRrf(lanes, profile = FUSION_PROFILE) {
  const fused = new Map();
  for (const [channel, results] of Object.entries(lanes)) {
    const weight = Number(profile.weights[channel] ?? 0);
    if (!Number.isFinite(weight) || weight <= 0) continue;
    for (const [index, result] of results.entries()) {
      const rank = index + 1;
      const contribution = weight / (profile.k + rank);
      const existing = fused.get(result.id) ?? {
        id: result.id,
        fusedScore: 0,
        sourceRanks: {},
        channelContributions: {},
        rawScores: {},
      };
      existing.fusedScore += contribution;
      existing.sourceRanks[channel] = rank;
      existing.channelContributions[channel] = contribution;
      existing.rawScores[channel] = result.rawScore;
      fused.set(result.id, existing);
    }
  }
  return [...fused.values()].sort((left, right) => (
    right.fusedScore - left.fusedScore || compareRawStrings(left.id, right.id)
  ));
}

function validateGeneration(database, telemetry) {
  const readSpan = telemetry?.span('generation.read', RESIDENCY.NATIVE);
  const generation = database.prepare(`
    SELECT g.* FROM current_corpus_generation p
    JOIN corpus_generations g ON g.generation_hash = p.generation_hash
    WHERE p.singleton = 1
  `).get();
  if (!generation || Number(generation.schema_version) !== STYLE_DB_SCHEMA_VERSION) {
    throw retrievalError('generation-unavailable', 'No valid published style generation exists.');
  }
  const activeRows = database.prepare(`
    SELECT style_id, aggregate_hash FROM styles
    WHERE lifecycle_state = 'active' ORDER BY style_id ASC
  `).all();
  readSpan?.end(activeRows.length);
  const verifySpan = telemetry?.span('generation.verify', RESIDENCY.JS_RESIDENT);
  const aggregateHash = digest(
    `style-corpus-aggregate-v1\0${activeRows.map((row) => (
      `${row.style_id}\0${row.aggregate_hash}\n`
    )).join('')}`,
  );
  if (activeRows.length !== Number(generation.active_style_count)
    || aggregateHash !== generation.aggregate_corpus_hash) {
    throw retrievalError('generation-invalid', 'Published generation does not match indexed style state.');
  }
  verifySpan?.end(activeRows.length);
  return generation;
}

function loadCardStyle(database, row) {
  const axes = database.prepare(`
    SELECT axis, token_count FROM style_token_axes
    WHERE style_rowid = ? ORDER BY axis ASC
  `).all(row.style_rowid).map((axis) => ({ axis: axis.axis, count: Number(axis.token_count) }));
  const capabilities = database.prepare(`
    SELECT term FROM style_terms WHERE style_rowid = ? AND term_type = 'capability'
    ORDER BY term ASC
  `).all(row.style_rowid).map((term) => term.term);
  const sections = database.prepare(`
    SELECT name FROM style_sections WHERE style_rowid = ? ORDER BY ordinal ASC
  `).all(row.style_rowid).map((section) => section.name);
  const estimatedHydrationBytes = Number(database.prepare(`
    SELECT COALESCE(SUM(byte_length), 0) AS bytes FROM style_artifacts
    WHERE style_rowid = ? AND role IN ('design', 'source', 'tokens')
  `).get(row.style_rowid).bytes);
  return {
    id: row.style_id,
    title: row.title,
    thesis: row.thesis,
    contentHash: row.aggregate_hash,
    capabilities,
    availableSections: sections,
    tokenAxes: axes,
    provenance: {
      status: row.provenance_status,
      sourceUrl: row.source_url,
      originalUrl: row.original_url,
      screenshotUrl: row.screenshot_url,
      uuid: row.source_uuid,
      capturedAt: row.captured_at,
      licenseStatus: row.license_status,
      rightsKnown: Number(row.rights_known) === 1,
      evidenceScope: JSON.parse(row.evidence_scope_json),
    },
    estimatedHydrationBytes,
  };
}

/**
 * Query one immutable generation snapshot without walking the source corpus.
 *
 * @param {Object} request - Eligibility, ranking, and paging request.
 * @param {Object} options - Database connection or path.
 * @returns {Object} Generation-stamped cards, cursor, and channel evidence.
 */
export function queryPersistentStyles(request = {}, options = {}) {
  validateQueryVector(request.queryVector);
  const database = options.database ?? openPublishedStyleDatabase(options.databasePath);
  const ownsDatabase = !options.database;
  const telemetry = options.telemetry;
  const candidateK = Math.max(1, Math.min(MAX_CANDIDATE_K, request.candidateK ?? DEFAULT_CANDIDATE_K));
  const fingerprintSpan = telemetry?.span('request.fingerprint', RESIDENCY.JS_RESIDENT);
  const fingerprint = requestFingerprint(request, candidateK, FUSION_PROFILE);
  fingerprintSpan?.end(1);
  const beginSpan = telemetry?.span('transaction.begin', RESIDENCY.NATIVE);
  database.exec('BEGIN');
  beginSpan?.end(1);
  try {
    const generation = validateGeneration(database, telemetry);
    if (request.generationHash !== undefined
      && request.generationHash !== generation.generation_hash) {
      throw retrievalError(
        'generation-mismatch',
        'Requested generation is not the published generation.',
      );
    }
    const vectorRevisionSpan = telemetry?.span('generation.vector-revision', RESIDENCY.NATIVE);
    const vectorRevision = request.vectorProfile ? Number(database.prepare(`
      SELECT revision FROM vector_projection_revisions WHERE profile_id = ?
    `).get(request.vectorProfile)?.revision ?? 0) : 0;
    vectorRevisionSpan?.end(request.vectorProfile ? 1 : 0);
    let cursor = null;
    if (request.cursor) {
      cursor = decodeOpaque(request.cursor, 'invalid-cursor');
      if (cursor.generationHash !== generation.generation_hash) {
        throw retrievalError('generation-mismatch', 'Cursor belongs to another generation.');
      }
      if (cursor.queryFingerprint !== fingerprint
        || cursor.fusionProfile !== FUSION_PROFILE.id
        || cursor.candidateK !== candidateK
        || cursor.vectorRevision !== vectorRevision) {
        throw retrievalError('invalid-cursor', 'Cursor does not match this retrieval request.');
      }
    }
    const eligibility = loadEligibility(database, request, telemetry);
    const channelHealth = {
      structured: { state: 'healthy' },
      fts: { state: request.disableFts === true ? 'disabled' : 'healthy' },
      vector: { state: request.disableVector === true ? 'disabled' : 'healthy' },
    };
    const lanes = {
      structured: structuredLane(database, eligibility.eligible, request, candidateK, telemetry),
    };
    if (!request.disableFts) {
      try {
        lanes.fts = ftsLane(database, eligibility.eligible, request, candidateK, telemetry);
      } catch (error) {
        if (error.code === 'invalid-query') throw error;
        channelHealth.fts = { state: 'failed', reason: String(error.message ?? error) };
      }
    }
    if (!request.disableVector) {
      try {
        lanes.vector = vectorLane(database, eligibility.eligible, request, candidateK, telemetry);
      } catch (error) {
        if (error.code === 'invalid-query-vector') throw error;
        channelHealth.vector = { state: 'failed', reason: String(error.message ?? error) };
      }
    }
    const hasFts = Array.isArray(lanes.fts) && lanes.fts.length > 0;
    const hasVector = Array.isArray(lanes.vector) && lanes.vector.length > 0;
    const rankingMode = hasFts && hasVector
      ? 'hybrid'
      : hasFts
        ? 'structured+fts'
        : hasVector
          ? 'structured+vector'
          : 'structured-only';
    const fusionSpan = telemetry?.span('fusion.rrf', RESIDENCY.JS_RESIDENT);
    let fused = weightedRrf(lanes);
    if (cursor) {
      fused = fused.filter((entry) => entry.fusedScore < cursor.lastScore
        || (entry.fusedScore === cursor.lastScore
          && compareRawStrings(entry.id, cursor.lastId) > 0));
    }
    fusionSpan?.end(fused.length);
    const limit = Math.max(0, Math.min(5, Number.isInteger(request.limit) ? request.limit : 5));
    const page = fused.slice(0, limit);
    const rowById = new Map(eligibility.eligible.map((row) => [row.style_id, row]));
    const hydrateSpan = telemetry?.span('cards.hydrate', RESIDENCY.NATIVE);
    const ranked = page.map((entry) => ({
      style: loadCardStyle(database, rowById.get(entry.id)),
      score: {
        deterministic: Number(entry.rawScores.structured ?? 0),
        lexical: Number(entry.channelContributions.fts ?? 0),
        total: Number(entry.fusedScore.toFixed(12)),
      },
    }));
    hydrateSpan?.end(ranked.length);
    const assembleSpan = telemetry?.span('cards.assemble', RESIDENCY.JS_RESIDENT);
    const cards = assembleCandidateCards(ranked, generation.generation_hash, request);
    assembleSpan?.end(cards.length);
    const encodeSpan = telemetry?.span('cards.attribution.encode', RESIDENCY.JS_RESIDENT);
    const attributions = Object.fromEntries(page.map((entry) => [entry.id, {
      sourceRanks: entry.sourceRanks,
      channelContributions: entry.channelContributions,
      rawScores: entry.rawScores,
      hydrationToken: encodeOpaque({
        generationHash: generation.generation_hash,
        id: entry.id,
        contentHash: rowById.get(entry.id).aggregate_hash,
      }),
    }]));
    const last = page.at(-1);
    const nextCursor = last && fused.length > page.length ? encodeOpaque({
      generationHash: generation.generation_hash,
      queryFingerprint: fingerprint,
      fusionProfile: FUSION_PROFILE.id,
      candidateK,
      vectorRevision,
      lastScore: last.fusedScore,
      lastId: last.id,
    }) : null;
    encodeSpan?.end(page.length);
    const commitSpan = telemetry?.span('transaction.commit', RESIDENCY.NATIVE);
    database.exec('COMMIT');
    commitSpan?.end(1);
    return {
      ok: true,
      generationHash: generation.generation_hash,
      degraded: rankingMode !== 'hybrid',
      rankingMode,
      queryFingerprint: fingerprint,
      fusionProfile: FUSION_PROFILE.id,
      candidateK,
      vectorRevision,
      channelHealth,
      eligibility: {
        eligibleCount: eligibility.eligible.length,
        rejectedCount: eligibility.rejectedCount,
      },
      cards,
      attributions,
      nextCursor,
    };
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  } finally {
    if (ownsDatabase) database.close();
  }
}

export const retrievalInternals = Object.freeze({
  decodeOpaque,
  requestFingerprint,
  validateQueryVector,
  validateGeneration,
});
