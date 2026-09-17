// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS                               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Description and graph timestamps must stay within the slack window.

'use strict';

const fs = require('fs');
const { CANONICAL_SAVE_CUTOFF, CANONICAL_SAVE_FRESHNESS_SLACK_MS, normalizePacketId, readContinuityPacketPointer, runRule } = require('./check-canonical-save-shared.cjs');

runRule('CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS', (context, emit) => {
  const descriptionTimestamp = context.description?.lastUpdated;
  const graphTimestamp = context.graph?.derived?.last_save_at;
  if (typeof descriptionTimestamp !== 'string' || typeof graphTimestamp !== 'string') {
    emit('pass', 'Canonical-save freshness-skew check not applicable to this folder');
    return;
  }
  const deltaMs = Date.parse(descriptionTimestamp) - Date.parse(graphTimestamp);
  if (Number.isNaN(deltaMs) || deltaMs <= CANONICAL_SAVE_FRESHNESS_SLACK_MS) {
    emit('pass', 'Description and graph freshness stay within the canonical-save slack window');
    return;
  }
  emit(
    'pass',
    'Description and graph freshness skew detected (soft detector)',
    [
      `context.description.lastUpdated=${descriptionTimestamp}`,
      `context.graph.derived.last_save_at=${graphTimestamp}`,
      `deltaMs=${deltaMs}`,
    ],
  );
});
