'use strict';

const { canonicalBytes } = require('../../../000-contract-schemas/lib/canonical.cjs');
const { compile } = require('../../../001-compiler-n1-shadow/compiler/index.cjs');
const { loadAuthoredSources, sha256Bytes } = require('./support.cjs');

const policy = compile(loadAuthoredSources());
process.stdout.write(`${JSON.stringify({
  bodySha256: sha256Bytes(canonicalBytes(policy)),
  effectivePolicyHash: policy.effectivePolicyHash,
})}\n`);
