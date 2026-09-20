// Metadata parentage assertions for a packet-nesting merge.
//
// Why it exists: the move changes every packet's disk path, and the two generated JSON files plus the
// markdown continuity pointer are all path-derived. A green validator run does not prove the parent
// links agree, so this asserts each derived id against the path it actually sits at.
//
// Usage: node metadata-assert.mjs   (prints one line per check, exits 1 on any mismatch)

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const REPO = path.resolve(HERE, '..', '..', '..', '..', '..');
const PHASE_PARENT = path.join(REPO, 'specs/system-deep-loop/036-deep-loop-innovation');

const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
const numberedChildren = (dir) =>
  readdirSync(dir)
    .filter((name) => /^\d{3}-/.test(name) && statSync(path.join(dir, name)).isDirectory())
    .sort();

const MOVED = [
  '007-executor-and-cli-hardening/008-cli-pi-devpass-glm-route',
  '006-runtime-docs-and-integrity-hardening/012-deep-loop-test-debt',
  '008-review-and-rollback-followup/005-review-leaf-protocol',
  '007-executor-and-cli-hardening/009-cli-pi-devpass-deepseek-route',
  '007-executor-and-cli-hardening/010-fanout-write-containment-hardening',
  '003-mode-contracts-migration-and-cutover/005-synthesis-chat-presentation',
  '003-mode-contracts-migration-and-cutover/006-deprecate-skill-benchmark',
  '002-substrate-and-orchestration/008-fanout-convergence-mode-flag',
  '006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review',
  '002-substrate-and-orchestration/009-spec-protocol-ledger-events',
];
const DESCENDANT_PARENTS = [
  '007-executor-and-cli-hardening/010-fanout-write-containment-hardening',
  '006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review',
];
const RECEIVING_PARENTS = [
  '002-substrate-and-orchestration',
  '003-mode-contracts-migration-and-cutover',
  '006-runtime-docs-and-integrity-hardening',
  '007-executor-and-cli-hardening',
  '008-review-and-rollback-followup',
];
const EXPECTED_CHILD_COUNTS = { '002-substrate-and-orchestration': 9, '003-mode-contracts-migration-and-cutover': 6, '006-runtime-docs-and-integrity-hardening': 13, '007-executor-and-cli-hardening': 10, '008-review-and-rollback-followup': 5 };

const failures = [];
const check = (label, ok, detail) => {
  if (!ok) failures.push(`${label}: ${detail}`);
};

const packetIdOf = (relToParent) => `system-deep-loop/036-deep-loop-innovation/${relToParent}`;

function assertSelfConsistent(relToParent) {
  const folder = path.join(PHASE_PARENT, relToParent);
  const expected = packetIdOf(relToParent);
  const desc = read(path.join(folder, 'description.json'));
  const graph = read(path.join(folder, 'graph-metadata.json'));
  const parentOfRel = relToParent.includes('/')
    ? `system-deep-loop/036-deep-loop-innovation/${relToParent.split('/').slice(0, -1).join('/')}`
    : 'system-deep-loop/036-deep-loop-innovation';

  check(`${expected} description.specFolder`, desc.specFolder === expected, `got ${desc.specFolder}`);
  check(`${expected} graph.packet_id`, graph.packet_id === expected, `got ${graph.packet_id}`);
  check(`${expected} graph.spec_folder`, graph.spec_folder === expected, `got ${graph.spec_folder}`);
  check(`${expected} graph.parent_id`, graph.parent_id === parentOfRel, `got ${graph.parent_id}, expected ${parentOfRel}`);
  return graph;
}

for (const rel of MOVED) assertSelfConsistent(rel);
let descendantCount = 0;
for (const parentRel of DESCENDANT_PARENTS) {
  for (const child of numberedChildren(path.join(PHASE_PARENT, parentRel))) {
    assertSelfConsistent(`${parentRel}/${child}`);
    descendantCount += 1;
  }
}

for (const parentRel of RECEIVING_PARENTS) {
  const graph = assertSelfConsistent(parentRel);
  const onDisk = numberedChildren(path.join(PHASE_PARENT, parentRel));
  const declared = graph.children_ids.map((id) => id.split('/').pop()).sort();
  check(
    `${parentRel} children_ids`,
    JSON.stringify(declared) === JSON.stringify(onDisk),
    `declared ${declared.length} vs on-disk ${onDisk.length}` +
      (JSON.stringify(declared) === JSON.stringify(onDisk) ? '' : ` | declared=${declared.join(',')} | disk=${onDisk.join(',')}`),
  );
  check(`${parentRel} child count`, onDisk.length === EXPECTED_CHILD_COUNTS[parentRel], `got ${onDisk.length}, expected ${EXPECTED_CHILD_COUNTS[parentRel]}`);
}

const rootGraph = read(path.join(PHASE_PARENT, 'graph-metadata.json'));
const rootChildren = numberedChildren(PHASE_PARENT);
const rootDeclared = rootGraph.children_ids.map((id) => id.split('/').pop()).sort();
check('036 root children_ids', JSON.stringify(rootDeclared) === JSON.stringify(rootChildren), `declared ${rootGraph.children_ids.length} vs on-disk ${rootChildren.length}`);
check('036 root direct children', rootChildren.length === 28, `got ${rootChildren.length}`);
check('036 root parent_id', rootGraph.packet_id === 'system-deep-loop/036-deep-loop-innovation' && rootGraph.parent_id === null, `packet_id=${rootGraph.packet_id} parent_id=${rootGraph.parent_id}`);

if (failures.length === 0) {
  console.log(`RESULT: PASSED - all metadata parentage assertions hold (${MOVED.length} moved roots, ${descendantCount} descendants checked, ${RECEIVING_PARENTS.length} parents, root ${rootChildren.length} children)`);
} else {
  console.log(`RESULT: FAILED - ${failures.length} mismatch(es)`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exitCode = 1;
}
