'use strict';
// Scratch-only: derive the classifier hub's activation manifest bytes exactly as
// the manifest library's refresh does (shadow-child policy, runtime compiler's
// canonical artifactBytes), validate them, and write them to the given path.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = process.cwd();
const layout = require(path.join(ROOT, '.skilled/bin/lib/compiled-route-layout.cjs'));
const binding = layout.resolveRuntimePaths(path.join(ROOT, '.skilled/bin/lib/compiled-routing'), {});
const compiler = require(binding.compilerPath);
const engine = require(binding.enginePath);
const lib = require(path.join(ROOT, '.skilled/bin/lib/compiled-route-manifest.cjs'));
const hubId = 'cli-classifier';
const policy = engine.loadHubEngine(hubId).snapshot.policy;
const manifest = {
  schemaVersion: 'V1',
  selectedPolicy: {
    effectivePolicyHash: policy.effectivePolicyHash,
    generation: policy.activationGeneration ?? policy.generation,
  },
  servingAuthority: 'compiled',
  shadowOnly: false,
};
const bytes = compiler.artifactBytes(manifest);
const check = lib.validateCanonicalManifestBytes({ hubId, manifestBytes: bytes });
console.log(JSON.stringify({ manifestValid: check.manifestValid, manifestFingerprint: check.manifestFingerprint, selectedPolicy: manifest.selectedPolicy }));
if (!check.manifestValid) process.exit(2);
fs.writeFileSync(process.argv[2], bytes);
