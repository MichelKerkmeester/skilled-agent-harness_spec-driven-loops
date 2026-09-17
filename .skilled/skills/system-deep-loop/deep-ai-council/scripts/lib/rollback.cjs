// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ lib/rollback                                                             ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Round rollback: move failed round artifacts and append supersede events  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { appendJsonlEvent, normalizeRoundId } = require('./audit-trail.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function safeTimestamp(timestamp) {
  return String(timestamp || new Date().toISOString()).replace(/[:.]/g, '-');
}

function moveIfExists(source, target) {
  if (!fs.existsSync(source)) return null;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.rmSync(target, { recursive: true, force: true });
  fs.renameSync(source, target);
  return target;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Move the selected round artifacts into a failed-round archive folder.
 *
 * @param {string} packetSpecFolder - Packet spec folder containing ai-council
 * @param {string|number} roundId - Round id or integer round number
 * @param {Object} [options={}] - Rollback options
 * @param {string} [options.timestamp] - Timestamp used in the failed folder
 * @returns {Object} Failed archive root and moved artifact paths
 */
function moveRoundToFailed(packetSpecFolder, roundId, options = {}) {
  const round = normalizeRoundId(roundId);
  const councilRoot = path.resolve(packetSpecFolder, 'ai-council');
  const failedRoot = path.join(councilRoot, 'failed', `${round}-${safeTimestamp(options.timestamp)}`);
  const moved = [];

  const candidates = [
    [path.join(councilRoot, round), path.join(failedRoot, round)],
    [path.join(councilRoot, 'seats', round), path.join(failedRoot, 'seats', round)],
    [path.join(councilRoot, 'deliberations', `${round}.md`), path.join(failedRoot, 'deliberations', `${round}.md`)],
    [path.join(councilRoot, 'critiques', `${round}-critique.md`), path.join(failedRoot, 'critiques', `${round}-critique.md`)],
  ];

  for (const [source, target] of candidates) {
    const movedPath = moveIfExists(source, target);
    if (movedPath) moved.push(movedPath);
  }

  return { round_id: round, failedRoot, moved };
}

function readEvents(stateJsonlPath) {
  if (!fs.existsSync(stateJsonlPath)) return [];
  return fs.readFileSync(stateJsonlPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

/**
 * Append rollback and artifact_superseded markers for a round.
 *
 * @param {string} stateJsonlPath - Path to the state JSONL file
 * @param {Object} [options={}] - Supersede options
 * @param {string|number} [options.round_id] - Round id to mark superseded
 * @param {string|number} [options.roundId] - Camel-case round id alias
 * @param {string} [options.timestamp] - Event timestamp
 * @param {string} [options.rollback_event_id] - Rollback event id
 * @param {string} [options.rollbackEventId] - Camel-case rollback id alias
 * @param {string} [options.reason] - Rollback reason
 * @returns {Object} Superseded artifact summary
 */
function markSuperseded(stateJsonlPath, options = {}) {
  const round = normalizeRoundId(options.round_id || options.roundId || 1);
  const timestamp = options.timestamp || new Date().toISOString();
  const rollbackEventId = options.rollback_event_id || options.rollbackEventId || `rollback-${round}-${Date.now()}`;
  const reason = options.reason || 'round rollback';
  const events = readEvents(stateJsonlPath);
  const priorMarkers = new Set(
    events
      .filter((event) => event.event === 'artifact_superseded' && event.round_id === round)
      .map((event) => event.original_path),
  );
  const artifactEvents = events.filter(
    (event) => event.event === 'artifact_written' && event.round_id === round && !priorMarkers.has(event.path),
  );

  appendJsonlEvent(stateJsonlPath, {
    event: 'rollback',
    round_id: round,
    reason,
    timestamp,
    rollback_event_id: rollbackEventId,
    supersedes: artifactEvents.map((event) => event.event_id || event.path),
  });

  const appended = [];
  for (const artifact of artifactEvents) {
    appendJsonlEvent(stateJsonlPath, {
      event: 'artifact_superseded',
      original_path: artifact.path,
      round_id: round,
      rollback_event_id: rollbackEventId,
      superseded_by: 'rollback',
      timestamp,
    });
    appended.push(artifact.path);
  }

  return { round_id: round, rollback_event_id: rollbackEventId, superseded: appended };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  moveRoundToFailed,
  markSuperseded,
};
