// ───────────────────────────────────────────────────────────────
// MODULE: SCORING INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const scoring = require('./scoring.js');
const compositeScoring = require('./composite-scoring.js');
const folderScoring = require('./folder-scoring.js');
const importanceTiers = require('./importance-tiers.js');
const confidenceTracker = require('./confidence-tracker.js');

module.exports = {
  ...scoring,
  ...compositeScoring,
  ...folderScoring,
  ...importanceTiers,
  ...confidenceTracker,
};
