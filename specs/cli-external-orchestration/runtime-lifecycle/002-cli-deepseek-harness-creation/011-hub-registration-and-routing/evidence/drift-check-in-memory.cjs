// Read-only drift check: recomputes the build-artifacts outputs in memory and compares
// them byte for byte with the files on disk. It never calls writeBytes.
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/michelkerkmeester/MEGA/Development/Skilled';
const P = path.join(ROOT, '.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration');
const mod = require(path.join(P, 'harness/build-artifacts.cjs'));
const { fixture, snapshot } = mod.loadSnapshot();
const compiled = mod.compiledArtifacts(snapshot, fixture);
const activation = mod.activationArtifacts(snapshot, compiled);
console.log('effectivePolicyHash=' + snapshot.policy.effectivePolicyHash);
console.log('graphHash=' + snapshot.destinationGraph.graphHash);
let mismatches = 0;
for (const [dir, arts] of [['compiled', compiled], ['activation', activation]]) {
  for (const [name, bytes] of Object.entries(arts)) {
    const file = path.join(P, dir, name);
    let status;
    try {
      status = Buffer.compare(fs.readFileSync(file), Buffer.from(bytes)) === 0 ? 'MATCH' : 'DIFF';
    } catch (e) { status = 'MISSING'; }
    if (status !== 'MATCH') mismatches += 1;
    console.log(`${status} ${dir}/${name}`);
  }
}
const promoted = path.join(ROOT, '.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json');
const act = activation['manifest.json'];
if (act !== undefined) {
  const same = Buffer.compare(fs.readFileSync(promoted), Buffer.from(act)) === 0;
  console.log(`${same ? 'MATCH' : 'DIFF'} promoted 013 manifest vs activation/manifest.json`);
  if (!same) mismatches += 1;
} else {
  console.log('NOTE no activation/manifest.json key; names=' + Object.keys(activation).join(','));
}
console.log('mismatches=' + mismatches);
