// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Mutation Coverage — Track Explored Mutations & Dimension Trajectories   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Namespace for improvement loop coverage graph (ADR-002).
 * Isolates from deep-research/review coverage graphs.
 * @type {string}
 */
const LOOP_TYPE = 'improvement';

/**
 * Minimum data points required before convergence can be claimed (REQ-AI-007).
 * Research finding: at least 3 scored evidence iterations.
 * @type {number}
 */
const MIN_TRAJECTORY_POINTS = 3;

/**
 * Default stability threshold: all dimension deltas within +/- this value.
 * Research finding: "stable" = 3+ scored iterations with deltas within +/-2.
 * @type {number}
 */
const DEFAULT_STABILITY_DELTA = 2;

/**
 * Env var to bypass mutation signature dedup (M-3).
 * Set to "1" to force re-evaluation of previously seen signatures.
 * @type {boolean}
 */
const SKIP_DEDUP = process.env.DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP === '1';

const EMPTY_FIELD_SENTINELS = Object.freeze({
  dimension: '<missing:dimension>',
  mutationType: '<missing:mutationType>',
  targetSection: '<missing:targetSection>',
  body: '<missing:body>',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJsonSafe(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (_err) {
    return null;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

/**
 * Compute mutation signature for dedup (M-3).
 * Signature: sha256(dimension + "\u001f" + mutationType + "\u001f" + targetSection + "\u001f" + normalizedBody64)
 * where normalizedBody64 = whitespace-collapsed, lowercased, first 64 chars of mutation body.
 *
 * @param {object} mutation - Mutation record with { dimension, mutationType, targetSection, body }
 * @returns {string} sha256 hex signature
 */
function normalizeSignatureField(mutation, fieldName) {
  const value = mutation[fieldName];
  if (value === null || value === undefined || String(value).trim() === '') {
    return EMPTY_FIELD_SENTINELS[fieldName];
  }
  return String(value).trim();
}

function computeMutationSignature(mutation) {
  const dimension = normalizeSignatureField(mutation, 'dimension');
  const mutationType = normalizeSignatureField(mutation, 'mutationType');
  const targetSection = normalizeSignatureField(mutation, 'targetSection');
  const rawBody = normalizeSignatureField(mutation, 'body');
  const normalizedBody64 = rawBody.replace(/\s+/g, ' ').toLowerCase().slice(0, 64);

  return crypto
    .createHash('sha256')
    .update(dimension)
    .update('\u001f')
    .update(mutationType)
    .update('\u001f')
    .update(targetSection)
    .update('\u001f')
    .update(normalizedBody64)
    .digest('hex');
}

/**
 * Create an empty coverage graph.
 * @returns {object} Empty coverage graph structure
 */
function createCoverageGraph() {
  return {
    loopType: LOOP_TYPE,
    mutations: [],
    exhausted: [],
    trajectory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MUTATION TRACKING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Record a mutation attempt in the coverage graph (REQ-AI-006).
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @param {object} mutation - Mutation record: { dimension, mutationType, candidateId, iteration, outcome? }
 */
function recordMutation(coveragePath, mutation) {
  let graph = readJsonSafe(coveragePath);
  if (!graph) {
    graph = createCoverageGraph();
  }

  const signature = computeMutationSignature(mutation);

  graph.mutations.push({
    ...mutation,
    signature,
    timestamp: new Date().toISOString(),
  });
  graph.updatedAt = new Date().toISOString();

  writeJson(coveragePath, graph);
  return signature;
}

/**
 * Get mutations already tried, to prevent redundant exploration (REQ-AI-009).
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @returns {object[]} Array of exhausted mutation records
 */
function getExhaustedMutations(coveragePath) {
  const graph = readJsonSafe(coveragePath);
  if (!graph) {
    return [];
  }
  return graph.exhausted || [];
}

/**
 * Mark a mutation type as exhausted for a given dimension (REQ-AI-009).
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @param {string} dimension - Dimension name
 * @param {string} mutationType - Mutation type that has been fully explored
 */
function markExhausted(coveragePath, dimension, mutationType, options = {}) {
  let graph = readJsonSafe(coveragePath);
  if (!graph) {
    graph = createCoverageGraph();
  }

  const alreadyExhausted = (graph.exhausted || []).some(
    (e) => e.dimension === dimension && e.mutationType === mutationType
  );

  if (!alreadyExhausted) {
    const entry = {
      dimension,
      mutationType,
      exhaustedAt: new Date().toISOString(),
    };
    if (options.signature) {
      entry.signature = options.signature;
    }
    if (options.reason) {
      entry.reason = options.reason;
    }
    graph.exhausted.push(entry);
  }

  graph.updatedAt = new Date().toISOString();
  writeJson(coveragePath, graph);
}

/**
 * Check if a mutation signature is already present in mutations[]
 * or exhausted[] arrays (M-3 dedup).
 *
 * Respects DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1 bypass.
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @param {string} signature - Computed mutation signature
 * @returns {{ seen: boolean, reason?: string }} Whether signature is seen and why
 */
function isSignatureSeen(coveragePath, signature) {
  if (SKIP_DEDUP) {
    return { seen: false };
  }

  const graph = readJsonSafe(coveragePath);
  if (!graph) {
    return { seen: false };
  }

  const inMutations = (graph.mutations || []).some(
    (m) => m.signature === signature
  );
  if (inMutations) {
    return { seen: true, reason: 'DUPLICATE_SIGNATURE_IN_MUTATIONS' };
  }

  const exhausted = (graph.exhausted || []).find(
    (e) => e.signature === signature
  );
  if (exhausted) {
    return { seen: true, reason: exhausted.reason || 'EXHAUSTED-FROM: prior' };
  }

  return { seen: false };
}

/**
 * Get coverage statistics per dimension (REQ-AI-006).
 * Get coverage statistics per dimension (REQ-AI-006).
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @returns {object} Coverage stats: { dimensions: { [dim]: { tried: string[], exhausted: string[], triedCount, exhaustedCount } } }
 */
function getMutationCoverage(coveragePath) {
  const graph = readJsonSafe(coveragePath);
  if (!graph) {
    return { dimensions: {} };
  }

  const dimensions = {};

  for (const mutation of graph.mutations || []) {
    const dim = mutation.dimension || 'unknown';
    if (!dimensions[dim]) {
      dimensions[dim] = { tried: new Set(), exhausted: new Set() };
    }
    dimensions[dim].tried.add(mutation.mutationType);
  }

  for (const exhaust of graph.exhausted || []) {
    const dim = exhaust.dimension || 'unknown';
    if (!dimensions[dim]) {
      dimensions[dim] = { tried: new Set(), exhausted: new Set() };
    }
    dimensions[dim].exhausted.add(exhaust.mutationType);
  }

  // Convert Sets to arrays for JSON serialization
  const result = {};
  for (const [dim, data] of Object.entries(dimensions)) {
    result[dim] = {
      tried: [...data.tried],
      exhausted: [...data.exhausted],
      triedCount: data.tried.size,
      exhaustedCount: data.exhausted.size,
    };
  }

  return { dimensions: result };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DIMENSION TRAJECTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Record a trajectory data point with per-dimension scores (REQ-AI-007).
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @param {object} dataPoint - { iteration, scores: { structural, ruleCoherence, integration, outputQuality, systemFitness }, weightedScore?, gateResults? }
 */
function recordTrajectory(coveragePath, dataPoint) {
  let graph = readJsonSafe(coveragePath);
  if (!graph) {
    graph = createCoverageGraph();
  }

  graph.trajectory.push({
    ...dataPoint,
    timestamp: new Date().toISOString(),
  });
  graph.updatedAt = new Date().toISOString();

  writeJson(coveragePath, graph);
}

/**
 * Get the full trajectory from the coverage graph.
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @returns {object[]} Array of trajectory data points
 */
function getTrajectory(coveragePath) {
  const graph = readJsonSafe(coveragePath);
  if (!graph) {
    return [];
  }
  return graph.trajectory || [];
}

/**
 * Check if convergence can be claimed based on trajectory data (REQ-AI-007).
 * Research finding: "stable" = 3+ scored iterations with all dimension deltas within +/-2.
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @param {object} [options] - { minDataPoints?, stabilityDelta? }
 * @returns {{ canConverge: boolean, reason: string, dataPoints: number }}
 */
function checkConvergenceEligibility(coveragePath, options) {
  const opts = {
    minDataPoints: MIN_TRAJECTORY_POINTS,
    stabilityDelta: DEFAULT_STABILITY_DELTA,
    ...options,
  };

  const trajectory = getTrajectory(coveragePath);

  if (trajectory.length < opts.minDataPoints) {
    return {
      canConverge: false,
      reason: `Insufficient data points: ${trajectory.length} < ${opts.minDataPoints}`,
      dataPoints: trajectory.length,
    };
  }

  // Check if the last minDataPoints entries are stable
  const recent = trajectory.slice(-opts.minDataPoints);
  const dimensions = ['structural', 'ruleCoherence', 'integration', 'outputQuality', 'systemFitness'];
  const unstableDimensions = [];

  for (const dim of dimensions) {
    const scores = recent.map((p) => (p.scores && p.scores[dim]) || 0);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    if (maxScore - minScore > opts.stabilityDelta) {
      unstableDimensions.push(dim);
    }
  }

  if (unstableDimensions.length > 0) {
    return {
      canConverge: false,
      reason: `Unstable dimensions: ${unstableDimensions.join(', ')}`,
      dataPoints: trajectory.length,
    };
  }

  return {
    canConverge: true,
    reason: 'All dimensions stable across last ' + opts.minDataPoints + ' data points',
    dataPoints: trajectory.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  LOOP_TYPE,
  MIN_TRAJECTORY_POINTS,
  DEFAULT_STABILITY_DELTA,
  SKIP_DEDUP,
  EMPTY_FIELD_SENTINELS,
  createCoverageGraph,
  computeMutationSignature,
  recordMutation,
  getExhaustedMutations,
  markExhausted,
  isSignatureSeen,
  getMutationCoverage,
  recordTrajectory,
  getTrajectory,
  checkConvergenceEligibility,
};
