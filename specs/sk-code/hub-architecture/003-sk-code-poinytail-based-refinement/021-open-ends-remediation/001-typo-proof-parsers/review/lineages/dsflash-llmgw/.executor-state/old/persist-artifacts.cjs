// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ persist-artifacts (CLI wrapper)                                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Thin CLI entry that delegates to lib/persist-artifacts.cjs               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const councilArtifacts = require('./lib/persist-artifacts.cjs');

module.exports = councilArtifacts;

if (require.main === module) {
  process.exitCode = councilArtifacts.main();
}
