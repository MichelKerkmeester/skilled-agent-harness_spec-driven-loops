// ───────────────────────────────────────────────────────────────
// MODULE: PARSING INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const memoryParser = require('./memory-parser.js');
const triggerMatcher = require('./trigger-matcher.js');
const triggerExtractor = require('./trigger-extractor.js');
const entityScope = require('./entity-scope.js');

module.exports = {
  ...memoryParser,
  ...triggerMatcher,
  ...triggerExtractor,
  ...entityScope,
};
