// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ CANONICAL_SAVE_LINEAGE_REQUIRED                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Graph writes on or after the cutoff must record save_lineage.

'use strict';

const fs = require('fs');
const { CANONICAL_SAVE_CUTOFF, CANONICAL_SAVE_FRESHNESS_SLACK_MS, normalizePacketId, readContinuityPacketPointer, runRule } = require('./check-canonical-save-shared.cjs');

runRule('CANONICAL_SAVE_LINEAGE_REQUIRED', (context, emit) => {
  if (!context.graph?.derived?.last_save_at) {
    emit('pass', 'Canonical-save lineage check not applicable to this folder');
    return;
  }
  const saveLineage = context.graph?.derived?.save_lineage;
  if (['description_only', 'graph_only', 'same_pass'].includes(saveLineage)) {
    emit('pass', 'save_lineage is present for the refreshed graph metadata');
    return;
  }
  if (context.graph.derived.last_save_at < CANONICAL_SAVE_CUTOFF) {
    emit(
      'pass',
      `save_lineage is grandfathered for graph writes before ${CANONICAL_SAVE_CUTOFF}`,
      [`last_save_at=${context.graph.derived.last_save_at}`],
    );
    return;
  }
  emit(
    'fail',
    `save_lineage is required for graph writes on or after ${CANONICAL_SAVE_CUTOFF}`,
    [`last_save_at=${context.graph.derived.last_save_at}`],
    'Re-run the canonical save path or graph refresh with a valid saveLineage value so graph-metadata.json records the write lineage.',
  );
});
