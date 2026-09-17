// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ CANONICAL_SAVE_ROOT_SPEC_REQUIRED                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// A live packet root must expose a canonical spec.md.

'use strict';

const fs = require('fs');
const { CANONICAL_SAVE_CUTOFF, CANONICAL_SAVE_FRESHNESS_SLACK_MS, normalizePacketId, readContinuityPacketPointer, runRule } = require('./check-canonical-save-shared.cjs');

runRule('CANONICAL_SAVE_ROOT_SPEC_REQUIRED', (context, emit) => {
  if (!context.isLivePacketRoot) {
    emit('pass', 'Canonical-save root-spec check not applicable to this folder');
    return;
  }
  if (fs.existsSync(context.specPath)) {
    emit('pass', 'Live packet root exposes a canonical spec.md surface');
    return;
  }
  emit(
    'fail',
    'Live packet root has metadata but no canonical root spec.md',
    [`Packet: ${context.packetId}`, `Child packets: ${context.childPacketDirs.join(', ')}`],
    'Create a root coordination spec.md so canonical save, resume, and graph provenance all target a real packet root.',
  );
});
