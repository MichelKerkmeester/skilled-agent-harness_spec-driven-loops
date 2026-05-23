// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Candidate Lineage — Track Candidate Derivation for Parallel Waves       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
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

function normalizeText(value) {
  return String(value).replace(/\s+/g, ' ').trim().toLowerCase();
}

function stripRubricMetadata(content) {
  return String(content)
    .replace(/^---[\s\S]*?\n---\s*/m, '')
    .replace(/<!--\s*DAI_RUBRIC[\s\S]*?-->/gi, '')
    .replace(/<!--\s*scoring-rubric[\s\S]*?-->/gi, '');
}

function computeCandidateContentHash(content) {
  return crypto
    .createHash('sha256')
    .update(normalizeText(stripRubricMetadata(content)))
    .digest('hex');
}

function resolveCandidateContent(candidate) {
  if (typeof candidate.candidateContent === 'string') {
    return candidate.candidateContent;
  }
  if (typeof candidate.content === 'string') {
    return candidate.content;
  }
  const candidatePath = candidate.candidatePath || candidate.path;
  if (typeof candidatePath === 'string' && candidatePath.trim() && fs.existsSync(candidatePath)) {
    return fs.readFileSync(candidatePath, 'utf8');
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LINEAGE GRAPH
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create an empty lineage graph.
 * @returns {object} Empty lineage graph structure
 */
function createLineageGraph() {
  return {
    nodes: [],
    duplicates: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Record a candidate in the lineage graph (REQ-AI-011).
 * Each node stores session-id, wave-index, spawning mutation type, and parent reference.
 *
 * @param {string} lineagePath - Path to the lineage graph JSON file
 * @param {object} candidate - { candidateId, sessionId, waveIndex, mutationType, parentCandidateId?, iteration?, scores? }
 */
function recordCandidate(lineagePath, candidate) {
  let graph = readJsonSafe(lineagePath);
  if (!graph) {
    graph = createLineageGraph();
  }
  if (!Array.isArray(graph.duplicates)) {
    graph.duplicates = [];
  }

  const candidateContent = resolveCandidateContent(candidate);
  const contentHash = candidate.contentHash || (
    typeof candidateContent === 'string' ? computeCandidateContentHash(candidateContent) : null
  );
  const duplicate = contentHash
    ? (graph.nodes || []).find((node) => node.contentHash === contentHash)
    : null;

  if (duplicate) {
    graph.duplicates.push({
      candidateId: candidate.candidateId,
      duplicateOf: duplicate.candidateId,
      contentHash,
      recordedAt: new Date().toISOString(),
    });
    graph.updatedAt = new Date().toISOString();
    writeJson(lineagePath, graph);
    return {
      recorded: false,
      duplicate: true,
      contentHash,
      existingCandidateId: duplicate.candidateId,
    };
  }

  graph.nodes.push({
    ...candidate,
    parentCandidateId: candidate.parentCandidateId || null,
    contentHash,
    recordedAt: new Date().toISOString(),
  });
  graph.updatedAt = new Date().toISOString();

  writeJson(lineagePath, graph);
  return { recorded: true, duplicate: false, contentHash };
}

/**
 * Get the full lineage chain for a given candidate (REQ-AI-011).
 * Traces derivation from the candidate back to the root.
 *
 * @param {string} lineagePath - Path to the lineage graph JSON file
 * @param {string} candidateId - ID of the candidate to trace
 * @returns {object[]} Array of candidate nodes from root to the target, or empty if not found
 */
function getLineage(lineagePath, candidateId) {
  const graph = readJsonSafe(lineagePath);
  if (!graph || !graph.nodes) {
    return [];
  }

  const nodeMap = new Map();
  for (const node of graph.nodes) {
    nodeMap.set(node.candidateId, node);
  }

  // Trace from target to root
  const chain = [];
  let current = nodeMap.get(candidateId);

  // Guard against circular references
  const visited = new Set();

  while (current) {
    if (visited.has(current.candidateId)) {
      break;
    }
    visited.add(current.candidateId);
    chain.unshift(current);

    if (!current.parentCandidateId) {
      break;
    }
    current = nodeMap.get(current.parentCandidateId);
  }

  return chain;
}

/**
 * Get all candidates for a specific wave in a session.
 *
 * @param {string} lineagePath - Path to the lineage graph JSON file
 * @param {string} sessionId - Session ID to filter by
 * @param {number} [waveIndex] - Optional wave index to filter by
 * @returns {object[]} Array of matching candidate nodes
 */
function getCandidatesByWave(lineagePath, sessionId, waveIndex) {
  const graph = readJsonSafe(lineagePath);
  if (!graph || !graph.nodes) {
    return [];
  }

  return graph.nodes.filter((node) => {
    if (node.sessionId !== sessionId) {
      return false;
    }
    if (typeof waveIndex === 'number' && node.waveIndex !== waveIndex) {
      return false;
    }
    return true;
  });
}

/**
 * Get all root candidates (candidates with no parent).
 *
 * @param {string} lineagePath - Path to the lineage graph JSON file
 * @returns {object[]} Array of root candidate nodes
 */
function getRootCandidates(lineagePath) {
  const graph = readJsonSafe(lineagePath);
  if (!graph || !graph.nodes) {
    return [];
  }

  return graph.nodes.filter((node) => !node.parentCandidateId);
}

/**
 * Get direct children of a candidate.
 *
 * @param {string} lineagePath - Path to the lineage graph JSON file
 * @param {string} parentCandidateId - Parent candidate ID
 * @returns {object[]} Array of child candidate nodes
 */
function getChildren(lineagePath, parentCandidateId) {
  const graph = readJsonSafe(lineagePath);
  if (!graph || !graph.nodes) {
    return [];
  }

  return graph.nodes.filter(
    (node) => node.parentCandidateId === parentCandidateId
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  createLineageGraph,
  computeCandidateContentHash,
  recordCandidate,
  getLineage,
  getCandidatesByWave,
  getRootCandidates,
  getChildren,
};
