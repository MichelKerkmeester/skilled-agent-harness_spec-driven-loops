'use strict';

const councilArtifacts = require('./lib/persist-artifacts.js');

module.exports = councilArtifacts;

if (require.main === module) {
  process.exitCode = councilArtifacts.main();
}
