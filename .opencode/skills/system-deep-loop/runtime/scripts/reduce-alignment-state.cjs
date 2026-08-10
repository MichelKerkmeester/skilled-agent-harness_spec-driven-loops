// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Alignment State Reducer                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { resolveArtifactRoot } = require('../lib/deep-loop/artifact-root.cjs');
const { resolveLanesFromConfig } = require('../../deep-alignment/scripts/scoping.cjs');
const {
  artifactIdentity,
  canonicalLaneObject,
  laneKey,
  normalizeArtifactEvidence,
  normalizeLaneId,
  normalizeScope,
} = require('../lib/deep-loop/alignment-identity.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Mirrors reduce-state.cjs's SEVERITY_KEYS/SEVERITY_WEIGHTS pattern exactly
// (same keys, same weights) so the two reducers share one severity vocabulary
// even though they aggregate by different keys (lane here, review dimension
// there). There is no REQUIRED_DIMENSIONS analog: deep-review's four
// dimensions are a fixed constant, but deep-alignment's lanes are resolved
// per-run by scoping.cjs from operator input, so the required-lane list is
// read from the bound run's own config (see resolveRequiredLanes()) rather
// than hardcoded here.
const SEVERITY_KEYS = ['P0', 'P1', 'P2'];
const SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 };
const DELTA_ITERATION_STATUS = Symbol('deltaIterationStatus');
const DELTA_ITERATION_NUMBER = Symbol('deltaIterationNumber');

// Mirrors the deep-review dashboard verdict table (renderDashboard() in the
// sibling reduce-state.cjs: P0>0 -> FAIL, P1>0 -> CONDITIONAL, else PASS),
// with one addition: NOT_APPLICABLE for a lane whose discovery returned zero
// artifacts -- a lane with nothing to check must not be silently folded into
// an aggregate PASS.
const VERDICTS = Object.freeze(['PASS', 'CONDITIONAL', 'FAIL', 'NOT_APPLICABLE']);

// Rollup precedence when combining N per-lane verdicts into one overall
// verdict: a single FAIL lane must never be averaged away by converged
// lanes. NOT_APPLICABLE never raises the overall verdict; an
// all-NOT_APPLICABLE run (zero coverage everywhere) still reports PASS
// trivially but callers should treat that as a "nothing to converge" signal,
// not a real audit pass.
const VERDICT_SEVERITY_RANK = Object.freeze({ FAIL: 3, CONDITIONAL: 2, PASS: 1, NOT_APPLICABLE: 0 });

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeUtf8(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readUtf8(filePath));
}

function normalizeText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') {
    try { return String(value).replace(/\s+/g, ' ').trim(); } catch { return ''; }
  }
  return value.replace(/\s+/g, ' ').trim();
}

function zeroSeverityMap() {
  return { P0: 0, P1: 0, P2: 0 };
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isSuccessfulIterationRecord(record) {
  return Boolean(record && record.status === 'complete');
}

function normalizeSeverity(value) {
  return SEVERITY_KEYS.includes(value) ? value : null;
}

function artifactIdentities(value) {
  const entries = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && Array.isArray(value.artifacts)
      ? value.artifacts
      : [];
  return new Set(entries.map((entry) => artifactIdentity(entry)).filter(Boolean));
}

// Same shape as scripts/scoping.cjs's own summarizeScope() (deep-alignment/
// scripts/scoping.cjs) so a lane's human-readable scope summary is identical
// whether printed by the scoping CLI or by this reducer.
function summarizeScope(scope) {
  const canonicalScope = normalizeScope(scope);
  if (canonicalScope.type === 'branchRange') return `${canonicalScope.from}..${canonicalScope.to}`;
  if (Array.isArray(canonicalScope.values)) return canonicalScope.values.join(', ');
  return 'unknown-scope';
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PARSERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse JSONL content into records, reporting malformed lines rather than
 * silently dropping them (fail-closed pathway) -- same contract as the
 * sibling reduce-state.cjs's parseJsonlDetailed(), reimplemented here (not
 * required from that file) so this reducer stays self-contained and does not
 * create a cross-mode dependency between the two sibling reducers.
 *
 * @param {string} jsonlContent
 * @returns {{records: Array<Object>, corruptionWarnings: Array<{line:number, raw:string, error:string}>}}
 */
function parseJsonlDetailed(jsonlContent) {
  const records = [];
  const corruptionWarnings = [];
  let lineNumber = 0;

  for (const rawLine of jsonlContent.split('\n')) {
    lineNumber += 1;
    const line = rawLine.trim();
    if (!line) continue;
    try {
      records.push(JSON.parse(line));
    } catch (error) {
      corruptionWarnings.push({
        line: lineNumber,
        raw: rawLine.length > 200 ? `${rawLine.slice(0, 200)}...` : rawLine,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { records, corruptionWarnings };
}

function parseJsonl(jsonlContent) {
  return parseJsonlDetailed(jsonlContent).records;
}

function loadDeltaPayloads(deltaDir) {
  if (!fs.existsSync(deltaDir)) return [];
  return fs.readdirSync(deltaDir)
    .filter((fileName) => /^iter-\d+\.jsonl$/.test(fileName))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .flatMap((fileName) => {
      const records = parseJsonl(readUtf8(path.join(deltaDir, fileName)));
      const iteration = records.find((record) => record && record.type === 'iteration');
      const iterationNumber = Number(/^iter-(\d+)\.jsonl$/.exec(fileName)[1]);
      const status = iteration && typeof iteration.status === 'string'
        ? iteration.status
        : undefined;
      return records.map((record) => {
        if (record && record.type === 'finding' && status !== undefined) {
          Object.defineProperty(record, DELTA_ITERATION_STATUS, {
            value: status,
            enumerable: false,
          });
        }
        if (record && record.type === 'finding') {
          Object.defineProperty(record, DELTA_ITERATION_NUMBER, {
            value: iterationNumber,
            enumerable: false,
          });
        }
        return record;
      });
    });
}

function isCreditableDeltaFinding(record, owningIterations = []) {
  const linkedStatus = record && typeof record === 'object'
    ? record[DELTA_ITERATION_STATUS] ?? record.iterationStatus ?? record.status
    : undefined;
  if (linkedStatus !== undefined) {
    return isSuccessfulIterationRecord({ status: linkedStatus });
  }
  const linkedIteration = record && typeof record === 'object'
    ? record[DELTA_ITERATION_NUMBER] ?? record.iteration
    : undefined;
  if (linkedIteration === undefined) return true;
  const owner = owningIterations.find(
    (iteration) => Number(iteration.iteration) === Number(linkedIteration),
  ) ?? owningIterations[Number(linkedIteration) - 1];
  return owner ? isSuccessfulIterationRecord(owner) : true;
}

// Read discovered artifact counts and canonical identities per lane so partial
// coverage cannot be hidden by activity in another lane.
function readCorpusCoverage(corpusPath, expectedLaneIds = null) {
  const empty = {
    corpusPresent: false,
    corpusState: 'absent',
    totalDiscovered: 0,
    discoveredByLane: new Map(),
    corpusArtifactIdsByLane: new Map(),
    unidentifiableByLane: new Map(),
    unidentifiableArtifactCount: 0,
    corpusIntegrityFault: null,
  };
  if (!fs.existsSync(corpusPath)) return empty;
  let parsed;
  try {
    parsed = JSON.parse(readUtf8(corpusPath));
  } catch (error) {
    return {
      ...empty,
      corpusPresent: true,
      corpusState: 'present-malformed',
      corpusIntegrityFault: {
        code: 'CORPUS_JSON_PARSE_ERROR',
        path: corpusPath,
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.lanes)
    || parsed.lanes.some((lane) => (
      !lane
      || typeof lane !== 'object'
      || typeof lane.laneId !== 'string'
      || !normalizeLaneId(lane.laneId)
      || !Array.isArray(lane.artifacts)
    ))) {
    return {
      ...empty,
      corpusPresent: true,
      corpusState: 'present-malformed',
      corpusIntegrityFault: {
        code: 'CORPUS_SCHEMA_INVALID',
        path: corpusPath,
        message: 'corpus must contain a lanes array',
      },
    };
  }
  const lanes = parsed.lanes;
  const configuredLaneIds = expectedLaneIds instanceof Set ? expectedLaneIds : null;
  const seenLaneIds = new Set();
  let laneIntegrityFault = null;
  for (const lane of lanes) {
    const id = normalizeLaneId(lane.laneId);
    if (seenLaneIds.has(id)) {
      laneIntegrityFault = {
        code: 'CORPUS_DUPLICATE_LANE_ID',
        path: corpusPath,
        laneId: id,
        message: `corpus contains duplicate laneId: ${id}`,
      };
      break;
    }
    seenLaneIds.add(id);
    if (configuredLaneIds && !configuredLaneIds.has(id)) {
      laneIntegrityFault = {
        code: 'CORPUS_ORPHAN_LANE_ID',
        path: corpusPath,
        laneId: id,
        message: `corpus laneId is not configured: ${id}`,
      };
      break;
    }
  }
  if (!laneIntegrityFault && configuredLaneIds) {
    const missingLaneId = [...configuredLaneIds].find((id) => !seenLaneIds.has(id));
    if (missingLaneId) {
      laneIntegrityFault = {
        code: 'CORPUS_CONFIG_LANE_MISSING',
        path: corpusPath,
        laneId: missingLaneId,
        message: `configured laneId is missing from corpus: ${missingLaneId}`,
      };
    }
  }
  if (laneIntegrityFault) {
    return {
      ...empty,
      corpusPresent: true,
      corpusState: laneIntegrityFault.code === 'CORPUS_CONFIG_LANE_MISSING'
        ? 'configured-lane-missing'
        : 'present-malformed',
      corpusIntegrityFault: laneIntegrityFault,
    };
  }
  const discoveredByLane = new Map();
  const corpusArtifactIdsByLane = new Map();
  const unidentifiableByLane = new Map();
  let totalDiscovered = 0;
  let unidentifiableArtifactCount = 0;
  let artifactIntegrityFault = null;
  for (const lane of lanes) {
    const artifacts = lane.artifacts;
    const discovered = artifacts.length;
    const id = normalizeLaneId(lane.laneId);
    const artifactIds = new Set();
    let unidentifiableCount = 0;
    for (let index = 0; index < artifacts.length; index += 1) {
      const artifact = artifacts[index];
      const identity = artifactIdentity(artifact);
      if (identity === null) {
        artifactIntegrityFault = {
          code: 'CORPUS_ARTIFACT_ID_INVALID',
          path: corpusPath,
          laneId: id,
          artifactIndex: index,
          message: 'every corpus artifact must expose a path, ref, or target identity',
        };
        break;
      }
      if (artifactIds.has(identity)) {
        artifactIntegrityFault = {
          code: 'CORPUS_DUPLICATE_ARTIFACT_ID',
          path: corpusPath,
          laneId: id,
          artifactIndex: index,
          message: 'corpus contains duplicate artifact identity within a lane',
        };
        break;
      }
      artifactIds.add(identity);
    }
    if (artifactIntegrityFault) break;
    discoveredByLane.set(id, discovered);
    corpusArtifactIdsByLane.set(id, artifactIds);
    unidentifiableByLane.set(id, unidentifiableCount);
    totalDiscovered += discovered;
    unidentifiableArtifactCount += unidentifiableCount;
  }
  if (artifactIntegrityFault) {
    return {
      ...empty,
      corpusPresent: true,
      corpusState: 'present-malformed',
      corpusIntegrityFault: artifactIntegrityFault,
    };
  }
  return {
    corpusPresent: true,
    corpusState: totalDiscovered === 0 ? 'present-valid-zero-artifacts' : 'present-valid',
    totalDiscovered,
    discoveredByLane,
    corpusArtifactIdsByLane,
    unidentifiableByLane,
    unidentifiableArtifactCount,
    corpusIntegrityFault: null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the run's required lanes from config.lanes (frozen at SCOPE-state,
 * mirroring how deep-review-config.json freezes reviewDimensions at INIT).
 * Each entry gains a laneId so downstream aggregation never re-derives it.
 *
 * @param {Object} config - Parsed deep-alignment-config.json
 * @returns {Array<{laneId:string, authority:string, artifactClass:string, scope:Object}>}
 */
function resolveRequiredLanes(config) {
  const rawLanes = Array.isArray(config && config.lanes) ? config.lanes : [];
  const validLanes = rawLanes.flatMap((lane) => {
    try {
      return resolveLanesFromConfig([lane]);
    } catch (_) {
      return [];
    }
  });
  return validLanes.map((lane) => ({
    laneId: laneKey(lane),
    authority: lane.authority,
    adapter: lane.adapter,
    artifactClass: lane.artifactClass,
    scope: lane.scope,
    canonicalScope: canonicalLaneObject(lane).scope,
  }));
}

function resolveConfigLanesIntegrityFault(config, configPath) {
  if (!config || !Array.isArray(config.lanes)) {
    return {
      code: 'CONFIG_LANES_INVALID',
      path: configPath,
      message: 'config.lanes must be present as an array',
    };
  }
  try {
    resolveLanesFromConfig(config.lanes);
    return null;
  } catch (error) {
    return {
      code: 'CONFIG_LANE_INVALID',
      path: configPath,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * A finding's dedup key: content_hash when the adapter/loop supplied one,
 * else a fallback over the fields every adapter's finding shape carries in
 * common (severity + type + message) -- adapter shapes are heterogeneous
 * beyond that (for example artifactRef, artifactPath, or artifactTarget), so
 * the fallback deliberately does not reach for an adapter-specific field.
 * @param {Object} finding
 * @returns {string}
 */
function findingDedupKey(finding) {
  if (finding && typeof finding.contentHash === 'string' && finding.contentHash) {
    return `ch:${finding.contentHash}`;
  }
  const severity = normalizeText(finding && finding.severity);
  const type = normalizeText(finding && finding.type);
  const message = normalizeText(finding && (finding.message || finding.summary)).slice(0, 120);
  const artifact = normalizeText(
    (finding && (finding.artifactPath || finding.artifactTarget || finding.artifactRef || finding.artifactId)) || '',
  );
  return `fl:${severity}|${type}|${artifact}|${message}`;
}

/**
 * Aggregate one lane's iteration + delta records into its registry entry.
 * Findings are the RAW adapter check() output (severity/type/message plus
 * whatever adapter-specific fields that authority's finding carries) --
 * never reshaped into a false-uniform schema, since the three-method adapter
 * contract makes adapters authority-agnostic to the loop but does not make
 * their finding shapes byte-identical to each other (confirmed by reading
 * the registered adapters' makeFinding() helpers and their authority-specific
 * artifact identity and evidence fields). Only severity is read structurally
 * here; every other field passes through.
 *
 * @param {{laneId:string, authority:string, artifactClass:string, scope:Object}} requiredLane
 * @param {Array<Object>} deltaRecords - Parsed deltas/iter-*.jsonl records (all lanes).
 * @param {Array<Object>} iterationRecords - Parsed main state-log {type:'iteration'} records (all lanes).
 * @param {number|null} discoveredArtifactCount - Corpus size for this lane.
 * @param {Set<string>|null} corpusArtifactIds - Canonical corpus identities.
 * @param {number} unidentifiableArtifactCount - Corpus entries without identity.
 * @param {Object|null} corpusIntegrityFault - Corpus fault that invalidates the run.
 * @returns {Object} Per-lane registry entry.
 */
function buildLaneEntry(
  requiredLane,
  deltaRecords,
  iterationRecords,
  discoveredArtifactCount = null,
  corpusArtifactIds = null,
  unidentifiableArtifactCount = 0,
  corpusIntegrityFault = null,
) {
  const { laneId } = requiredLane;

  const laneIterations = iterationRecords.filter(
    (record) => record && record.type === 'iteration' && record.laneId === laneId,
  );
  const successfulLaneIterations = laneIterations.filter(isSuccessfulIterationRecord);
  const laneDeltaFindings = deltaRecords
    .filter((record) => record && record.type === 'finding' && record.laneId === laneId)
    .filter((record) => isCreditableDeltaFinding(record, laneIterations))
    .map((record) => record.finding)
    .filter((finding) => finding && typeof finding === 'object');
  const laneEmbeddedFindings = successfulLaneIterations.flatMap((record) => (
    Array.isArray(record.findingDetails)
      ? record.findingDetails.filter((finding) => finding && typeof finding === 'object')
      : []
  ));

  // An iteration's artifactsChecked may arrive as an array of the artifact paths
  // audited that iteration (the richer form a live agent naturally reports) or as
  // a bare numeric count (simpler emitters and unit fixtures). Union the paths
  // across iterations so a re-audited artifact counts once -- coverage is the
  // number of UNIQUE artifacts checked, not the sum of per-iteration passes; a
  // loop that keeps re-checking the same slice must not inflate coverage past the
  // lane's discovered total. Count-only records remain usable for progress, but
  // their credit stays below the canonical identity set because no artifact can
  // be proven checked from a number alone.
  const checkedPaths = new Set();
  const checkedValues = new Map();
  const creditedEvidenceIds = new Set();
  let checkedCountSum = 0;
  let sawPathArray = false;
  let sawCount = false;
  let sawEvidence = false;
  let invalidEvidenceCount = 0;
  for (const record of successfulLaneIterations) {
    const recordCheckedIds = new Set();
    const value = record.artifactsChecked;
    if (Array.isArray(value)) {
      sawPathArray = true;
      for (const entry of value) {
        const identity = artifactIdentity(entry);
        if (identity) {
          recordCheckedIds.add(identity);
          checkedPaths.add(identity);
          if (!checkedValues.has(identity)) checkedValues.set(identity, entry);
        }
      }
    } else if (isFiniteNumber(value)) {
      sawCount = true;
      checkedCountSum += Math.max(0, value);
    }

    const dispatchedIds = artifactIdentities(record.dispatchedSlice ?? record.artifactsSlice);
    const evidenceEntries = Array.isArray(record.artifactEvidence)
      ? record.artifactEvidence
      : Array.isArray(record.evidence)
        ? record.evidence
        : [];
    for (const evidence of evidenceEntries) {
      const normalized = normalizeArtifactEvidence(evidence);
      if (!normalized) {
        invalidEvidenceCount += 1;
        continue;
      }
      sawEvidence = true;
      if (dispatchedIds.has(normalized.identity) && recordCheckedIds.has(normalized.identity)) {
        creditedEvidenceIds.add(normalized.identity);
      }
    }
  }
  const reportedCheckedIds = sawPathArray ? [...checkedPaths] : null;
  const hasCanonicalCorpusIds = corpusArtifactIds instanceof Set;
  const coverageBasis = sawPathArray && sawCount
    ? 'mixed'
    : sawPathArray
      ? sawEvidence
        ? 'identity-verified'
        : 'unverified'
      : sawCount
        ? 'count-based'
        : 'unverified';
  const creditedCorpusIds = sawPathArray && hasCanonicalCorpusIds
    ? [...creditedEvidenceIds].filter((id) => corpusArtifactIds.has(id))
    : sawPathArray
      ? [...creditedEvidenceIds]
      : null;
  const checkedArtifactIds = sawPathArray
    ? creditedCorpusIds.map((id) => checkedValues.get(id) ?? id)
    : null;
  const unknownCheckedIds = sawPathArray && hasCanonicalCorpusIds
    ? reportedCheckedIds
      .filter((id) => !corpusArtifactIds.has(id))
      .map((id) => checkedValues.get(id) ?? id)
    : [];
  // Dedup across iterations (a re-checked artifact that still fails re-emits
  // the same finding; only the first occurrence counts as "open").
  const byKey = new Map();
  let invalidSeverityCount = 0;
  for (const finding of [...laneDeltaFindings, ...laneEmbeddedFindings]) {
    const severity = normalizeSeverity(finding.severity);
    if (!severity) {
      // A finding whose severity is not a recognized P0/P1/P2 is a data-integrity
      // fault, not a droppable non-finding. Silently skipping it lets a truncated
      // or schema-broken blocker vanish from the gate, so count it and let the
      // rollup fail closed rather than emit a clean verdict over corrupted input.
      invalidSeverityCount += 1;
      continue;
    }
    const key = findingDedupKey(finding);
    if (!byKey.has(key)) {
      byKey.set(key, { ...finding, severity });
    }
  }
  const openFindings = [...byKey.values()];

  const findingsBySeverity = zeroSeverityMap();
  let compositeScore = 0;
  for (const finding of openFindings) {
    findingsBySeverity[finding.severity] += 1;
    compositeScore += SEVERITY_WEIGHTS[finding.severity] || 0;
  }

  const hasKnownDiscovery = Number.isFinite(discoveredArtifactCount);
  const artifactsDiscovered = hasKnownDiscovery ? Math.max(0, discoveredArtifactCount) : null;
  const reportedCheckedCount = checkedCountSum + (sawPathArray ? checkedPaths.size : 0);
  const artifactsChecked = hasKnownDiscovery
    ? Math.min(reportedCheckedCount, artifactsDiscovered)
    : reportedCheckedCount;
  const creditedArtifactsChecked = sawPathArray && hasCanonicalCorpusIds
    ? checkedArtifactIds.length
    : 0;
  const identityVerified = hasKnownDiscovery
    && sawPathArray
    && Array.isArray(checkedArtifactIds)
    && artifactsDiscovered > 0
    && unidentifiableArtifactCount === 0
    && corpusArtifactIds.size === artifactsDiscovered
    && [...corpusArtifactIds].every((id) => creditedCorpusIds.includes(id));
  const coverageChecked = hasKnownDiscovery
    ? Math.min(creditedArtifactsChecked, artifactsDiscovered)
    : creditedArtifactsChecked;
  const zeroArtifacts = hasKnownDiscovery
    ? artifactsDiscovered === 0
    : laneIterations.length > 0 && artifactsChecked === 0 && openFindings.length === 0;
  const incompleteCoverage = hasKnownDiscovery && (
    artifactsDiscovered > coverageChecked
    || (laneIterations.length > 0 && !identityVerified)
  );

  // Only a lane whose discovery result is empty is not applicable. A configured
  // non-empty lane that was untouched or only partially checked fails closed.
  let verdict;
  if (corpusIntegrityFault) {
    verdict = 'FAIL';
  } else if (zeroArtifacts || (!hasKnownDiscovery && laneIterations.length === 0)) {
    verdict = 'NOT_APPLICABLE';
  } else if (incompleteCoverage) {
    verdict = 'FAIL';
  } else if (findingsBySeverity.P0 > 0) {
    verdict = 'FAIL';
  } else if (findingsBySeverity.P1 > 0) {
    verdict = 'CONDITIONAL';
  } else {
    verdict = 'PASS';
  }

  return {
    laneId,
    authority: requiredLane.authority,
    adapter: requiredLane.adapter || requiredLane.authority,
    artifactClass: requiredLane.artifactClass,
    scope: requiredLane.scope,
    canonicalScope: requiredLane.canonicalScope,
    iterationsRun: laneIterations.length,
    artifactsDiscovered,
    artifactsChecked,
    creditedArtifactsChecked,
    coverageChecked,
    incompleteCoverage,
    coverageBasis,
    identityVerified,
    // The identity set behind creditedArtifactsChecked, when iterations reported
    // artifact paths (not bare counts). Progress consumers use this to advance by
    // credited identity — a set difference against the corpus — instead of trusting
    // artifactsChecked as a prefix cursor, which a duplicate or out-of-order re-check
    // would desync. Null when only bare counts were reported.
    checkedArtifactIds: sawPathArray ? checkedArtifactIds : null,
    unknownCheckedIds,
    unidentifiableArtifactCount,
    evidenceCount: sawEvidence ? successfulLaneIterations.reduce((sum, record) => (
      sum + (Array.isArray(record.artifactEvidence)
        ? record.artifactEvidence.length
        : Array.isArray(record.evidence) ? record.evidence.length : 0)
    ), 0) : 0,
    invalidEvidenceCount,
    openFindings,
    findingsBySeverity,
    invalidSeverityCount,
    compositeScore: Math.round(compositeScore * 100) / 100,
    verdict,
  };
}

/**
 * Roll N per-lane entries into one overall verdict. The overall verdict is
 * the WORST per-lane verdict present (VERDICT_SEVERITY_RANK), never an
 * average -- a single FAIL lane fails the run regardless of how many other
 * lanes are clean, preserving the configured lane registry's worst-case gate.
 *
 * @param {Array<Object>} laneEntries
 * @returns {Object}
 */
function buildOverallRollup(laneEntries, integrity = {}) {
  const findingsBySeverity = zeroSeverityMap();
  let compositeScore = 0;
  let worstRank = VERDICT_SEVERITY_RANK.NOT_APPLICABLE;
  let worstVerdict = 'NOT_APPLICABLE';
  const applicableLanes = laneEntries.filter((entry) => entry.verdict !== 'NOT_APPLICABLE');

  for (const entry of laneEntries) {
    for (const severity of SEVERITY_KEYS) {
      findingsBySeverity[severity] += entry.findingsBySeverity[severity] || 0;
    }
    compositeScore += entry.compositeScore;
    const rank = VERDICT_SEVERITY_RANK[entry.verdict] ?? 0;
    if (rank > worstRank) {
      worstRank = rank;
      worstVerdict = entry.verdict;
    }
  }

  const invalidSeverityCount = laneEntries.reduce(
    (sum, entry) => sum + (entry.invalidSeverityCount || 0), 0,
  );
  const invalidEvidenceCount = laneEntries.reduce(
    (sum, entry) => sum + (entry.invalidEvidenceCount || 0), 0,
  );
  const unknownCheckedIds = [...new Set(laneEntries.flatMap((entry) => entry.unknownCheckedIds || []))];
  const unknownCheckedIdCount = unknownCheckedIds.length;
  const unidentifiableArtifactCount = laneEntries.reduce(
    (sum, entry) => sum + (entry.unidentifiableArtifactCount || 0), 0,
  );
  const corpusIntegrityFault = integrity.corpusIntegrityFault || null;
  const configLanesIntegrityFault = integrity.configLanesIntegrityFault || null;
  const corpusPresent = integrity.corpusPresent === true;
  const corpusState = integrity.corpusState || (corpusPresent ? 'present-valid' : 'absent');
  const corpusStateValid = corpusState === 'present-valid'
    || corpusState === 'present-valid-zero-artifacts';
  const discoveryIncomplete = integrity.discoveryIncomplete === true;
  // A corrupted state log or an unrecognized finding severity means the gate is
  // reasoning over incomplete data; an audit tool must fail closed there rather
  // than emit a clean verdict it cannot stand behind.
  const integrityFault = Boolean(integrity.hasCorruption)
    || Boolean(corpusIntegrityFault)
    || Boolean(configLanesIntegrityFault)
    || invalidSeverityCount > 0
    || invalidEvidenceCount > 0
    || (corpusPresent && !corpusStateValid);

  // "Nothing to converge" is a claim about the DISCOVERED corpus, not about
  // whether iterations happened to check anything. A run that discovered a
  // non-empty corpus but audited none of it (a failed or empty first pass) is
  // incomplete, not trivially clean -- gating on the discovered total is what
  // keeps that state from being reported as a pass.
  const totalDiscovered = Number.isFinite(integrity.totalDiscovered) ? integrity.totalDiscovered : 0;
  const emptyCorpus = totalDiscovered === 0;
  const nothingToConverge = !discoveryIncomplete
    && !integrityFault
    && emptyCorpus
    && (laneEntries.length === 0 || applicableLanes.length === 0);
  const totalChecked = laneEntries.reduce(
    (sum, entry) => sum + (Number.isFinite(entry.coverageChecked) ? entry.coverageChecked : 0),
    0,
  );
  const incompleteCoverage = !emptyCorpus && (
    laneEntries.some((entry) => entry.incompleteCoverage === true)
    || totalChecked < totalDiscovered
  );
  const coverageEntries = laneEntries.filter((entry) => entry.verdict !== 'NOT_APPLICABLE');
  const coverageBasis = coverageEntries.some((entry) => entry.coverageBasis === 'mixed')
    ? 'mixed'
    : coverageEntries.some((entry) => entry.coverageBasis === 'count-based')
      ? 'count-based'
      : coverageEntries.some((entry) => entry.coverageBasis === 'unverified')
        ? 'unverified'
        : coverageEntries.length > 0 ? 'identity-verified' : 'unverified';
  const identityVerified = coverageEntries.length > 0
    && coverageEntries.every((entry) => entry.identityVerified === true);

  let verdict;
  if (integrityFault || discoveryIncomplete || incompleteCoverage) {
    verdict = 'FAIL';
  } else if (nothingToConverge) {
    verdict = 'PASS';
  } else {
    verdict = worstVerdict;
  }

  // `sealed` marks whether this rollup is the terminal, authoritative reduce
  // (the loop reached synthesis and sealed the verdict) or a non-authoritative
  // pre-synthesis view: the pre-dispatch seed, or a per-iteration refresh
  // written while the loop was still running. A seed or refresh over a
  // non-empty-but-unaudited corpus is FAIL-closed by design; without this flag a
  // consumer cannot tell that intentional placeholder FAIL apart from a
  // completed audit that genuinely failed. Only a sealed rollup is authoritative.
  const sealed = integrity.sealed === true
    && corpusPresent
    && corpusStateValid
    && !integrityFault
    && !discoveryIncomplete;
  const totalReportedChecked = laneEntries.reduce(
    (sum, entry) => sum + (Number.isFinite(entry.artifactsChecked) ? entry.artifactsChecked : 0),
    0,
  );
  const totalCreditedChecked = laneEntries.reduce(
    (sum, entry) => sum + (Number.isFinite(entry.creditedArtifactsChecked) ? entry.creditedArtifactsChecked : 0),
    0,
  );
  const reportedChecked = corpusPresent
    ? Math.min(totalReportedChecked, totalDiscovered)
    : totalReportedChecked;
  const creditedChecked = corpusPresent
    ? Math.min(totalCreditedChecked, totalDiscovered)
    : totalCreditedChecked;

  return {
    laneCount: laneEntries.length,
    applicableLaneCount: applicableLanes.length,
    findingsBySeverity,
    compositeScore: Math.round(compositeScore * 100) / 100,
    verdict,
    sealed,
    nothingToConverge,
    incompleteCoverage,
    artifactsDiscovered: totalDiscovered,
    artifactsChecked: reportedChecked,
    creditedArtifactsChecked: creditedChecked,
    coverageBasis,
    identityVerified,
    integrityFault,
    corpusPresent,
    corpusState,
    corpusIntegrityFault,
    configLanesIntegrityFault,
    discoveryIncomplete,
    discoveryState: discoveryIncomplete ? 'PRE_DISCOVERY' : 'DISCOVERED',
    invalidSeverityCount,
    invalidEvidenceCount,
    unknownCheckedIds,
    unknownCheckedIdCount,
    unidentifiableArtifactCount,
  };
}

/**
 * Render the single alignment-report.md, one section per lane plus an
 * overall summary -- the SKILL.md contract ("Emit one report per
 * lane, not one blended report across authorities") is honored by keeping
 * each lane's findings under its own heading rather than interleaving them.
 *
 * @param {Object} config
 * @param {Array<Object>} laneEntries
 * @param {Object} overall
 * @returns {string}
 */
function renderAlignmentReport(config, laneEntries, overall) {
  const lines = [
    '---',
    'title: Deep Alignment Report',
    'description: Auto-generated reducer view over the alignment packet. Never manually edited.',
    '---',
    '',
    '# Deep Alignment Report',
    '',
    `- Target: ${normalizeText(config.alignmentTarget) || '[Unknown target]'}`,
    `- Lanes: ${overall.laneCount} (${overall.applicableLaneCount} applicable)`,
    `- Overall verdict: ${overall.verdict}${overall.nothingToConverge ? ' (nothing to converge -- zero applicable lanes)' : ''}`,
    `- Result state: ${overall.sealed ? 'SEALED (authoritative -- the loop reached synthesis)' : 'PRELIMINARY (not sealed -- seed or interrupted run; the verdict above is NOT authoritative)'}`,
    `- Coverage: ${overall.creditedArtifactsChecked} / ${overall.artifactsDiscovered} artifacts${overall.incompleteCoverage ? ' (incomplete)' : ''}`,
    `- Reported activity: ${overall.artifactsChecked} / ${overall.artifactsDiscovered} artifacts`,
    `- Coverage basis: ${overall.coverageBasis}`,
    `- Integrity: ${overall.integrityFault ? 'FAULT' : 'OK'}${overall.unknownCheckedIdCount > 0 ? `; ${overall.unknownCheckedIdCount} unknown checked identifier(s)` : ''}${overall.unidentifiableArtifactCount > 0 ? `; ${overall.unidentifiableArtifactCount} unidentifiable corpus artifact(s)` : ''}`,
    `- Findings: P0 ${overall.findingsBySeverity.P0} / P1 ${overall.findingsBySeverity.P1} / P2 ${overall.findingsBySeverity.P2}`,
    `- Composite score: ${overall.compositeScore}`,
    '',
  ];

  for (const entry of laneEntries) {
    lines.push(`## Lane: ${entry.authority} / ${entry.artifactClass} / ${summarizeScope(entry.scope)}`, '');
    lines.push(`- Verdict: ${entry.verdict}`);
    lines.push(`- Iterations run: ${entry.iterationsRun}`);
    lines.push(`- Artifacts checked: ${entry.coverageChecked}${entry.artifactsDiscovered === null ? '' : ` / ${entry.artifactsDiscovered}`}`);
    lines.push(`- Coverage basis: ${entry.coverageBasis}`);
    lines.push(`- Unknown checked identifiers: ${entry.unknownCheckedIds.length}`);
    lines.push(`- Unidentifiable corpus artifacts: ${entry.unidentifiableArtifactCount}`);
    lines.push(`- Findings: P0 ${entry.findingsBySeverity.P0} / P1 ${entry.findingsBySeverity.P1} / P2 ${entry.findingsBySeverity.P2}`);
    lines.push(`- Composite score: ${entry.compositeScore}`, '');

    if (entry.openFindings.length === 0) {
      lines.push('No open findings.', '');
      continue;
    }
    for (const severity of SEVERITY_KEYS) {
      const bucket = entry.openFindings.filter((finding) => finding.severity === severity);
      if (bucket.length === 0) continue;
      lines.push(`### ${severity}`, '');
      for (const finding of bucket) {
        const artifact = finding.artifactPath || finding.artifactTarget || finding.artifactRef || finding.artifactId || 'unknown-artifact';
        const layer = finding.layer || finding.producedBy || 'unlabeled';
        lines.push(`- **${finding.type || 'finding'}** (${layer}) — \`${artifact}\` — ${normalizeText(finding.message || finding.summary)}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

/**
 * Reduce the alignment/ JSONL state log + deltas into a synchronized
 * findings-registry.json and alignment-report.md, mirroring
 * reduceReviewState()'s contract shape (specFolder in, {registry, report,
 * paths} out) so a future loop-wiring pass can call this the same way it
 * calls the sibling reducer. Idempotent: repeated calls with unchanged input
 * produce identical output.
 *
 * @param {string} specFolder - Path to the bound spec folder.
 * @param {Object} [options]
 * @param {boolean} [options.write=true]
 * @param {boolean} [options.seal=false] - Stamp the rollup authoritative
 *   (overall.sealed=true). Only the terminal synthesis reduce seals; the
 *   pre-dispatch seed and per-iteration refreshes leave it false.
 * @returns {Object}
 */
function reduceAlignmentState(specFolder, options = {}) {
  const write = options.write !== false;
  const resolvedSpecFolder = path.resolve(specFolder);
  const { artifactDir: alignmentDir } = resolveArtifactRoot(resolvedSpecFolder, 'alignment');

  const configPath = path.join(alignmentDir, 'deep-alignment-config.json');
  const stateLogPath = path.join(alignmentDir, 'deep-alignment-state.jsonl');
  const registryPath = path.join(alignmentDir, 'deep-alignment-findings-registry.json');
  const reportPath = path.join(alignmentDir, 'alignment-report.md');
  const deltaDir = path.join(alignmentDir, 'deltas');

  const parsedConfig = fs.existsSync(configPath) ? readJson(configPath) : null;
  const config = parsedConfig && typeof parsedConfig === 'object' && !Array.isArray(parsedConfig)
    ? parsedConfig
    : {};
  const stateLogContent = fs.existsSync(stateLogPath) ? readUtf8(stateLogPath) : '';
  const { records: iterationRecords, corruptionWarnings } = parseJsonlDetailed(stateLogContent);
  const deltaRecords = loadDeltaPayloads(deltaDir);

  const configLanesIntegrityFault = resolveConfigLanesIntegrityFault(config, configPath);
  const requiredLanes = resolveRequiredLanes(config);
  const configuredLaneIds = new Set(requiredLanes.map((lane) => lane.laneId));
  const {
    corpusPresent,
    corpusState,
    totalDiscovered,
    discoveredByLane,
    corpusArtifactIdsByLane,
    unidentifiableByLane,
    unidentifiableArtifactCount,
    corpusIntegrityFault,
  } = readCorpusCoverage(
    path.join(alignmentDir, 'deep-alignment-corpus.json'),
    configuredLaneIds,
  );
  const laneEntries = requiredLanes.map((lane) => buildLaneEntry(
    lane,
    deltaRecords,
    iterationRecords,
    discoveredByLane.has(lane.laneId) ? discoveredByLane.get(lane.laneId) : null,
    corpusArtifactIdsByLane.has(lane.laneId) ? corpusArtifactIdsByLane.get(lane.laneId) : null,
    unidentifiableByLane.get(lane.laneId) || 0,
    corpusIntegrityFault,
  ));
  const unknownCheckedIds = [...new Set(laneEntries.flatMap((entry) => entry.unknownCheckedIds || []))];
  const invalidEvidenceCount = laneEntries.reduce(
    (sum, entry) => sum + (entry.invalidEvidenceCount || 0), 0,
  );
  const hasCorruption = corruptionWarnings.length > 0
    || Boolean(corpusIntegrityFault)
    || Boolean(configLanesIntegrityFault)
    || invalidEvidenceCount > 0;
  const integrity = {
    corpusIntegrityFault,
    configLanesIntegrityFault,
    corpusPresent,
    corpusState,
    discoveryIncomplete: !corpusPresent,
    invalidEvidenceCount,
    unknownCheckedIds,
    unknownCheckedIdCount: unknownCheckedIds.length,
    unidentifiableArtifactCount,
  };
  const overall = buildOverallRollup(laneEntries, {
    corpusPresent,
    corpusState,
    discoveryIncomplete: !corpusPresent,
    totalDiscovered,
    hasCorruption,
    corpusIntegrityFault,
    configLanesIntegrityFault,
    // Only a terminal synthesis reduce passes seal:true; the pre-dispatch seed
    // and every per-iteration refresh leave the registry unsealed so an
    // interrupted run is never mistaken for an authoritative verdict.
    sealed: options.seal === true,
  });

  const registry = {
    alignmentTarget: config.alignmentTarget || null,
    lanes: laneEntries,
    overall,
    corruptionWarnings,
    hasCorruption,
    integrity: { ...integrity, integrityFault: overall.integrityFault },
  };
  const report = renderAlignmentReport(config, laneEntries, overall);

  if (write) {
    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
    writeUtf8(reportPath, report.endsWith('\n') ? report : `${report}\n`);
  }

  return {
    configPath, stateLogPath, registryPath, reportPath,
    registry, report, corruptionWarnings, hasCorruption,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const positional = args.filter((arg) => !arg.startsWith('--'));
  const specFolder = positional[0];
  // Terminal synthesis passes --seal to stamp the verdict authoritative; the
  // pre-dispatch seed and per-iteration refreshes omit it and stay preliminary.
  const seal = args.includes('--seal');

  if (!specFolder) {
    process.stderr.write(
      'Usage: node .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs <spec-folder> [--seal]\n',
    );
    process.exit(1);
  }

  try {
    const result = reduceAlignmentState(specFolder, { write: true, seal });
    process.stdout.write(
      `${JSON.stringify({
        registryPath: result.registryPath,
        reportPath: result.reportPath,
        overallVerdict: result.registry.overall.verdict,
        sealed: result.registry.overall.sealed,
        laneCount: result.registry.overall.laneCount,
        findingsBySeverity: result.registry.overall.findingsBySeverity,
        corruptionCount: result.corruptionWarnings.length,
      }, null, 2)}\n`,
    );
  } catch (error) {
    process.stderr.write(`[deep-alignment] reducer failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(3);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  SEVERITY_KEYS,
  SEVERITY_WEIGHTS,
  VERDICTS,
  VERDICT_SEVERITY_RANK,
  laneKey,
  normalizeLaneId,
  isSuccessfulIterationRecord,
  summarizeScope,
  findingDedupKey,
  resolveRequiredLanes,
  resolveConfigLanesIntegrityFault,
  buildLaneEntry,
  buildOverallRollup,
  renderAlignmentReport,
  reduceAlignmentState,
  parseJsonl,
  parseJsonlDetailed,
  readCorpusCoverage,
};
