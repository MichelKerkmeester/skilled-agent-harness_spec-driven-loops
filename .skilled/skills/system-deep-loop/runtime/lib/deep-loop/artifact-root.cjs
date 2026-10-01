// ───────────────────────────────────────────────────────────────────
// MODULE: Artifact-Root Resolver
// ───────────────────────────────────────────────────────────────────

'use strict';

const path = require('node:path');

// resolveArtifactRoot, allocateShortSubfolder, normalizeSpecFolderReference.
module.exports = require(
  path.join(__dirname, '..', '..', '..', '..', 'system-spec-kit', 'shared', 'review-research-paths.cjs'),
);
