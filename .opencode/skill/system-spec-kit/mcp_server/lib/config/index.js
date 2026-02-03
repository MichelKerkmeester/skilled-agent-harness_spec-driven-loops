// ───────────────────────────────────────────────────────────────
// CONFIG: INDEX
// ───────────────────────────────────────────────────────────────
'use strict';

const memoryTypes = require('./memory-types');
const typeInference = require('./type-inference');

module.exports = {
  // Memory Types Configuration (T005)
  ...memoryTypes,

  // Type Inference (T007)
  ...typeInference,

  // Module references for targeted imports
  memoryTypes,
  typeInference,
};
