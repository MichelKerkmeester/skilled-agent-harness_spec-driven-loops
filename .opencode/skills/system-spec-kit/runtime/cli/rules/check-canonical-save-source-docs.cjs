// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ CANONICAL_SAVE_SOURCE_DOCS_REQUIRED                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// A live packet root graph must carry derived.source_docs.

'use strict';

const fs = require('fs');
const { CANONICAL_SAVE_CUTOFF, CANONICAL_SAVE_FRESHNESS_SLACK_MS, normalizePacketId, readContinuityPacketPointer, runRule } = require('./check-canonical-save-shared.cjs');

runRule('CANONICAL_SAVE_SOURCE_DOCS_REQUIRED', (context, emit) => {
  if (!context.isLivePacketRoot || !context.graph) {
    emit('pass', 'Canonical-save source-doc check not applicable to this folder');
    return;
  }
  const sourceDocs = Array.isArray(context.graph?.derived?.source_docs) ? context.graph.derived.source_docs : [];
  if (sourceDocs.length > 0) {
    emit('pass', 'Live packet root graph metadata has non-empty derived.source_docs');
    return;
  }
  emit(
    'fail',
    'Live packet root graph metadata has empty derived.source_docs',
    [`Packet: ${context.packetId}`],
    'Refresh graph-metadata.json after restoring a canonical root spec.md so derived.source_docs can include the root packet docs.',
  );
});
