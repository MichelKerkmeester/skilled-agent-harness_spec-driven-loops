'use strict';

const { evaluatePolicy } = require('../../../004-compiler-n1-shadow/compiler/index.cjs');
const { runShadowParity } = require('../../../004-compiler-n1-shadow/parity/shadow-parity.cjs');

function runTargetShadowParity(input) {
  let legacyIndex = 0;
  return runShadowParity({
    activationManifest: input.activationManifest,
    evaluateCompiled: evaluatePolicy,
    evaluateLegacy: () => input.legacyObservations[legacyIndex++],
    policy: input.policy,
    scenarios: input.scenarios,
  });
}

module.exports = {
  runTargetShadowParity,
};
