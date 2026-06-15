// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Artifact-Root Resolver (shared backend seam)                            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Canonical import point for the artifact-topology contract consumed by    ║
// ║ every graph-backed deep-loop reducer (research, review, context). The    ║
// ║ single implementation continues to live in system-spec-kit; the runtime  ║
// ║ owns the seam so deep-loop consumers depend on the backend rather than   ║
// ║ reaching across into another skill. Re-export keeps the resolver a       ║
// ║ single source of truth (no second copy to drift).                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const path = require('node:path');

// resolveArtifactRoot, allocateShortSubfolder, normalizeSpecFolderReference.
module.exports = require(
  path.join(__dirname, '..', '..', '..', 'system-spec-kit', 'shared', 'review-research-paths.cjs'),
);
