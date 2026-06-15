// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Resource-Map Synthesis Primitive (workflows-shared)                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Shared synthesis helper for the deep-loop workflow modes. emitResourceMap ║
// ║ is workflow output rendering, NOT runtime backend plumbing, so it lives   ║
// ║ here (a non-discoverable shared location) rather than in deep-loop-       ║
// ║ runtime. The single implementation continues to live in system-spec-kit;  ║
// ║ this re-export is the seam research/review reducers consume so the        ║
// ║ rendered markdown stays byte-identical to the original renderer.          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const path = require('node:path');

// emitResourceMap (and any sibling exports of the extractor).
module.exports = require(
  path.join(__dirname, '..', '..', '..', 'system-spec-kit', 'scripts', 'resource-map', 'extract-from-evidence.cjs'),
);
