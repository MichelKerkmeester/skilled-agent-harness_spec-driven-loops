// ───────────────────────────────────────────────────────────────
// EXTRACTORS: INDEX (RE-EXPORTS)
// ───────────────────────────────────────────────────────────────
//
// Central entry point for all extractor modules. Import from here
// for cleaner imports:
//
//   const { extractFilesFromData, extractDiagrams } = require('./extractors');
//
// ───────────────────────────────────────────────────────────────

'use strict';

module.exports = {
  ...require('./file-extractor'),
  ...require('./diagram-extractor'),
  ...require('./conversation-extractor'),
  ...require('./decision-extractor'),
  ...require('./session-extractor'),
  ...require('./implementation-guide-extractor'),
  ...require('./collect-session-data'),
  ...require('./opencode-capture')
};
