'use strict';

// The replay driver resolves the repository root by marker and reads its
// protected-digest registry from disk, so it loads correctly from the primary
// checkout and from git worktrees alike — no source surgery is needed here
// anymore. This wrapper survives only as the stable import point the child
// canaries share.
const path = require('node:path');

function loadReplayDriver() {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(path.resolve(__dirname, '..', '..', '005-decision-evaluator', 'replay-driver.cjs'));
}

module.exports = { loadReplayDriver };
