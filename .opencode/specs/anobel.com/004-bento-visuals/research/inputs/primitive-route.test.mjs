import assert from 'node:assert/strict';
import {
  TWO_D_TILES,
  primitiveFor,
  reclassifyFromRender,
  routeFor,
  slugFromOut,
} from './primitive-map.mjs';

const CONCEPTS = [
  'goedkeuringssysteem',
  'oci',
  'accountbeheer',
  'een-factuur',
  'aangepast-assortiment',
  'favorieten',
  'orders-facturen',
  'prijzen-condities',
  'kwartaalcijfers',
];

const EXPECTED_TWO_D = new Set([
  'accountbeheer-4',
  'oci-2',
  'oci-4',
  'goedkeuringssysteem-4',
  'aangepast-assortiment-3',
  'aangepast-assortiment-5',
  'favorieten-4',
  'een-factuur-4',
  'prijzen-condities-3',
  'kwartaalcijfers-4',
]);

assert.equal(TWO_D_TILES.size, 10);
for (const tileId of EXPECTED_TWO_D) {
  assert.equal(TWO_D_TILES.has(tileId), true, `missing 2d tile: ${tileId}`);
}

const allTileIds = CONCEPTS.flatMap((concept) => [1, 2, 3, 4, 5].map((n) => `${concept}-${n}`));
const mismatches = [];
let twoDCount = 0;
let linearCount = 0;

for (const tileId of allTileIds) {
  const expected = EXPECTED_TWO_D.has(tileId) ? '2d-positioned' : 'linear-flow';
  const actual = primitiveFor(tileId);

  if (actual !== expected) mismatches.push({ tileId, expected, actual });
  if (actual === '2d-positioned') twoDCount += 1;
  if (actual === 'linear-flow') linearCount += 1;
}

assert.deepEqual(mismatches, []);
assert.equal(twoDCount, 10);
assert.equal(linearCount, 35);

assert.equal(primitiveFor('aangepast-assortiment-4'), 'linear-flow');
assert.equal(primitiveFor('aangepast-assortiment-3'), '2d-positioned');
assert.equal(primitiveFor('aangepast-assortiment-5'), '2d-positioned');

let unknownRoute;
assert.doesNotThrow(() => {
  unknownRoute = routeFor('some-unknown-concept-2');
});
assert.deepEqual(unknownRoute, {
  tileId: 'some-unknown-concept-2',
  primitive: 'linear-flow',
  route: 'linear',
  repair: 'failure-only',
  skeletonFirst: false,
  triage: true,
});

const escalated = reclassifyFromRender(
  {
    tileId: 'orders-facturen-2',
    primitive: 'linear-flow',
    route: 'linear',
    repair: 'failure-only',
    skeletonFirst: false,
    triage: false,
  },
  {
    checks: {
      visualPanelOverflow: { pass: false, offenders: [{ role: 'visual', bottom: 420 }] },
      bboxOverlap: { pass: true, offenders: [] },
      titleBandIntrusion: { pass: true, offenders: [] },
    },
  },
);

assert.equal(escalated.route, '2d');
assert.equal(escalated.repair, 'mandatory-round-2');
assert.equal(escalated.skeletonFirst, true);
assert.ok(Array.isArray(escalated.defectClass));
assert.ok(escalated.defectClass.length > 0);

assert.equal(slugFromOut('.../dist/kwartaalcijfers-glm-4.html'), 'kwartaalcijfers-4');

console.log('ROUTING OK');
