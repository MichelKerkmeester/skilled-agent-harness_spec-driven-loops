const KNOWN_CONCEPTS = new Set([
  'goedkeuringssysteem',
  'oci',
  'accountbeheer',
  'een-factuur',
  'aangepast-assortiment',
  'favorieten',
  'orders-facturen',
  'prijzen-condities',
  'kwartaalcijfers',
]);

const GEOMETRY_CHECKS = [
  'visualPanelOverflow',
  'bboxOverlap',
  'titleBandIntrusion',
];

export const TWO_D_TILES = new Set([
  'accountbeheer-4', // 2d-positioned: permissions matrix
  'oci-2', // 2d-positioned: punch-out round-trip flow
  'oci-4', // 2d-positioned: SAP-Anobel node diagram
  'goedkeuringssysteem-4', // 2d-positioned: threshold decision diagram
  'aangepast-assortiment-3', // 2d-positioned: ship x category matrix
  'aangepast-assortiment-5', // 2d-positioned: catalog funnel
  'favorieten-4', // 2d-positioned: popover/list-picker
  'een-factuur-4', // 2d-positioned: many-to-one funnel
  'prijzen-condities-3', // 2d-positioned: staffel ladder
  'kwartaalcijfers-4', // 2d-positioned: category donut/ranked labels
]);

export function slugFromOut(outPath) {
  const base = String(outPath ?? '')
    .split(/[\\/]/)
    .pop()
    .replace(/\.html$/i, '');

  return base.replace(/-glm(?=-\d+$|$)/i, '');
}

function conceptFromTileId(tileId) {
  const clean = slugFromOut(tileId);
  const match = clean.match(/^(.*)-\d+$/);
  return match ? match[1] : clean;
}

export function primitiveFor(tileIdOrOut) {
  const tileId = slugFromOut(tileIdOrOut);
  return TWO_D_TILES.has(tileId) ? '2d-positioned' : 'linear-flow';
}

export function routeFor(tileIdOrOut) {
  const tileId = slugFromOut(tileIdOrOut);
  const primitive = primitiveFor(tileId);
  const triage = !KNOWN_CONCEPTS.has(conceptFromTileId(tileId));

  if (primitive === '2d-positioned') {
    return {
      tileId,
      primitive,
      route: '2d',
      repair: 'mandatory-round-2',
      skeletonFirst: true,
      triage,
    };
  }

  return {
    tileId,
    primitive,
    route: 'linear',
    repair: 'failure-only',
    skeletonFirst: false,
    triage,
  };
}

export function reclassifyFromRender(routeObj, gateJson) {
  const defectClass = GEOMETRY_CHECKS.filter((check) => gateJson?.checks?.[check]?.pass === false);
  if (!defectClass.length) return routeObj;

  return {
    ...(routeObj ?? {}),
    primitive: '2d-positioned',
    route: '2d',
    repair: 'mandatory-round-2',
    skeletonFirst: true,
    defectClass,
  };
}
