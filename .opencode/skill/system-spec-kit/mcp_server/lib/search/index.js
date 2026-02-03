// ───────────────────────────────────────────────────────────────
// MODULE: SEARCH INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const vectorIndex = require('./vector-index.js');
const hybridSearch = require('./hybrid-search.js');
const rrfFusion = require('./rrf-fusion.js');
const reranker = require('./reranker.js');
const crossEncoder = require('./cross-encoder.js');
const intentClassifier = require('./intent-classifier.js');
const fuzzyMatch = require('./fuzzy-match.js');
const bm25Index = require('./bm25-index.js');

module.exports = {
  ...vectorIndex,
  ...hybridSearch,
  ...rrfFusion,
  ...reranker,
  ...crossEncoder,
  ...intentClassifier,
  ...fuzzyMatch,
  ...bm25Index,
};
