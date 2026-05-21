// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ persist-artifacts (CLI wrapper)                                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Thin CLI entry that delegates to lib/persist-artifacts.js                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const councilArtifacts = require('./lib/persist-artifacts.js');

module.exports = councilArtifacts;

if (require.main === module) {
  process.exitCode = councilArtifacts.main();
}
