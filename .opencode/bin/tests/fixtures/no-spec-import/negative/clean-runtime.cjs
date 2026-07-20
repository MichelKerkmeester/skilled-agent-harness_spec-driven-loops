'use strict';

// POSITIVE FIXTURE (must PASS the no-spec-import guard).
// Represents clean runtime code: it only requires stdlib and a sibling runtime
// module, never anything under `.opencode/specs`.

const path = require('path');
const sibling = require('./sibling-runtime.cjs');

function resolveFront(hubId) {
  return path.join(sibling.root(), hubId);
}

module.exports = { resolveFront };
