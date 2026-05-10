'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { appendJsonlEvent, normalizeRoundId } = require('./audit-trail.js');

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

module.exports = {
  moveRoundToFailed,
  markSuperseded,
};
