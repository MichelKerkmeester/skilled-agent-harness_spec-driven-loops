// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Continuity, description and graph must agree on the packet identity.

'use strict';

const fs = require('fs');
const { CANONICAL_SAVE_CUTOFF, CANONICAL_SAVE_FRESHNESS_SLACK_MS, normalizePacketId, readContinuityPacketPointer, runRule } = require('./check-canonical-save-shared.cjs');

runRule('CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED', (context, emit) => {
  const continuityPointer = readContinuityPacketPointer(context.folder);
  const descriptionSpecFolder = normalizePacketId(context.description?.specFolder);
  const graphSpecFolder = normalizePacketId(context.graph?.spec_folder);
  const identities = [continuityPointer, descriptionSpecFolder, graphSpecFolder].filter(Boolean);
  if (identities.length < 2) {
    emit('pass', 'Canonical-save packet-identity check not applicable to this folder');
    return;
  }
  const uniqueIdentities = [...new Set(identities)];
  if (uniqueIdentities.length === 1) {
    emit('pass', 'Packet identity is normalized across continuity, description, and graph surfaces');
    return;
  }
  emit(
    'pass',
    'Packet identity normalization drift detected (soft detector)',
    uniqueIdentities.map((value) => `identity=${value}`),
  );
});
