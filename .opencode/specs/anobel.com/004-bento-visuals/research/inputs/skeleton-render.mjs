import assert from 'node:assert/strict';

export const LAYOUT_MODES = Object.freeze(['matrix', 'node', 'routing', 'funnel', 'popover']);

const MODE_SET = new Set(LAYOUT_MODES);
const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, (ch) => ENT[ch]);
}

function clean(v, max = 80) {
  const s = String(v ?? '').replace(/\s+/g, ' ').trim();
  return s.length > max ? `${s.slice(0, Math.max(0, max - 3))}...` : s;
}

function text(v, max) {
  return esc(clean(v, max));
}

function list(v) {
  return Array.isArray(v) ? v : [];
}

function obj(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
}

function modeOf(plan) {
  return clean(plan?.layout_mode || 'matrix', 24).toLowerCase();
}

function cellValue(v) {
  if (typeof v === 'boolean') return v ? 'Ja' : 'Nee';
  const s = clean(v, 16);
  return s || '-';
}

function matrixVisual(plan) {
  const fallback = {
    columns: ['Bestellen', 'Goedkeuren', 'Budget zien'],
    rows: [
      { label: 'MS Aldebaran', cells: ['Ja', 'Ja', 'Ja'] },
      { label: 'MS Castor', cells: ['Ja', 'Nee', 'Ja'] },
      { label: 'MS Pollux', cells: ['Ja', 'Ja', 'Nee'] },
    ],
  };
  const m = obj(plan?.matrix);
  const cols = (list(m.columns).length ? m.columns : fallback.columns).slice(0, 3);
  const allRows = list(m.rows).length ? m.rows : fallback.rows;
  const rows = allRows.slice(0, 3);
  const more = Math.max(0, allRows.length - rows.length);
  const grid = `142px repeat(${cols.length}, minmax(0, 1fr))`;

  const head = `<div class="matrixRow matrixHead" style="grid-template-columns:${grid}">
    <div class="matrixLabel">Account</div>
    ${cols.map((c) => `<div class="matrixCell">${text(c, 18)}</div>`).join('')}
  </div>`;

  const body = rows.map((r, i) => {
    const cells = list(r?.cells);
    return `<div class="matrixRow" data-a1-role="row" style="grid-template-columns:${grid}">
      <div class="matrixLabel">${text(r?.label || `Account ${i + 1}`, 22)}</div>
      ${cols.map((_, j) => {
        const v = cellValue(cells[j]);
        const cls = /nee|false|blok|stop|fout/i.test(v) ? ' warn' : /ja|true|toe|check|actief/i.test(v) ? ' ok' : '';
        return `<div class="matrixCell${cls}">${text(v, 16)}</div>`;
      }).join('')}
    </div>`;
  }).join('');

  const chip = more ? `<div class="moreChip matrixMore" data-a1-role="label">+${more} more</div>` : '';
  return `<div class="matrixWrap">${head}${body}${chip}</div>`;
}

function hubLike(n) {
  return /hub|anobel|centraal|center|kern/i.test(`${n?.id ?? ''} ${n?.label ?? ''} ${n?.role ?? ''}`);
}

function normalizeNodes(plan) {
  const fallback = [
    { id: 'erp', label: 'Eigen systeem', role: 'bron' },
    { id: 'anobel', label: 'Anobel', role: 'hub' },
    { id: 'cart', label: 'Winkelwagen', role: 'terug' },
  ];
  const n = plan?.node;
  const raw = list(n?.nodes).length ? n.nodes : list(plan?.nodes).length ? plan.nodes : fallback;
  return {
    nodes: raw.slice(0, 3).map((x, i) => ({
      id: clean(x?.id || `node-${i + 1}`, 24),
      label: clean(x?.label || x?.id || `Knooppunt ${i + 1}`, 30),
      role: clean(x?.role || (hubLike(x) ? 'hub' : 'koppeling'), 24),
    })),
    more: Math.max(0, raw.length - 3),
  };
}

function placeNodes(nodes) {
  const h = 70;
  if (nodes.length === 1) return [{ node: nodes[0], x: 187, y: 122, w: 126, h, hub: true }];
  if (nodes.length === 2) {
    return nodes.map((node, i) => ({ node, x: i ? 276 : 96, y: 122, w: 128, h, hub: hubLike(node) }));
  }

  const found = nodes.findIndex(hubLike);
  const hubIndex = found >= 0 ? found : 1;
  const hub = nodes[hubIndex] || nodes[1];
  const rest = nodes.filter((_, i) => i !== hubIndex);
  return [
    { node: rest[0], x: 44, y: 122, w: 126, h, hub: hubLike(rest[0]) },
    { node: hub, x: 187, y: 116, w: 126, h: 82, hub: true },
    { node: rest[1], x: 330, y: 122, w: 126, h, hub: hubLike(rest[1]) },
  ];
}

function edgeTuple(e) {
  if (Array.isArray(e)) return [clean(e[0], 24), clean(e[1], 24), clean(e[2], 32)];
  return [
    clean(e?.fromId || e?.from || e?.source || '', 24),
    clean(e?.toId || e?.to || e?.target || '', 24),
    clean(e?.label || e?.edgeLabel || '', 32),
  ];
}

function edgePath(a, b) {
  const leftToRight = a.x < b.x;
  const ax = leftToRight ? a.x + a.w : a.x;
  const bx = leftToRight ? b.x : b.x + b.w;
  const ay = Math.round(a.y + a.h / 2);
  const by = Math.round(b.y + b.h / 2);
  const mid = Math.round((ax + bx) / 2);
  return `M${ax} ${ay} H${mid} V${by} H${bx}`;
}

function nodeVisual(plan) {
  const { nodes, more } = normalizeNodes(plan);
  const placed = placeNodes(nodes);
  const byId = new Map(placed.map((p) => [String(p.node.id), p]));

  let edges = list(plan?.node?.edges)
    .map(edgeTuple)
    .filter(([a, b]) => byId.has(a) && byId.has(b) && a !== b)
    .slice(0, 3);

  if (!edges.length && placed.length > 1) {
    const hub = placed.find((p) => p.hub) || placed[1] || placed[0];
    edges = placed.filter((p) => p !== hub).map((p) => [p.node.id, hub.node.id, '']);
  }

  const lines = edges.map(([a, b]) => {
    const from = byId.get(a);
    const to = byId.get(b);
    return `<path d="${edgePath(from, to)}" fill="none" stroke="#8591b3" stroke-width="2" stroke-dasharray="5 6" stroke-linecap="round"/>`;
  }).join('');

  const boxes = placed.map((p) => `<div class="nodeBox${p.hub ? ' nodeHub' : ''}" data-a1-role="node" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px">
    <div class="nodeLabel">${text(p.node.label, 28)}</div>
    <div class="nodeRole">${text(p.node.role, 22)}</div>
  </div>`).join('');

  const chip = more ? `<div class="moreChip nodeMore" data-a1-role="label">+${more} more</div>` : '';
  return `<div class="statusPill"><span></span>Verbonden</div>
    <svg class="links" viewBox="0 0 500 298" aria-hidden="true">${lines}</svg>
    ${boxes}${chip}`;
}

function normalizeStage(x, i) {
  return {
    id: clean(x?.id || x?.key || `stage-${i + 1}`, 24),
    label: clean(x?.label || x?.title || x?.name || `Stap ${i + 1}`, 34),
    meta: clean(x?.meta || x?.role || x?.status || x?.value || '', 34),
  };
}

function normalizeRouting(plan) {
  const r = obj(plan?.routing) || {};
  const rawStages = list(r.stages).length ? r.stages : list(r.nodes).length ? r.nodes : list(r.steps);
  const stages = (rawStages.length ? rawStages : [
    { id: 'start', label: 'Aanvraag', meta: 'inkoop' },
    { id: 'check', label: 'Regelcheck', meta: 'drempel' },
    { id: 'done', label: 'Verwerkt', meta: 'gereed' },
  ]).map(normalizeStage);
  const branches = list(r.branches).map((b, i) => ({
    id: clean(b?.id || b?.targetId || `branch-${i + 1}`, 24),
    label: clean(b?.targetLabel || b?.target || b?.result || b?.outcome || `Uitkomst ${i + 1}`, 34),
    meta: clean(b?.meta || b?.status || b?.owner || '', 34),
    edgeLabel: clean(b?.edgeLabel || b?.condition || b?.label || '', 34),
  })).filter((b) => b.label);
  const edges = list(r.edges).map(edgeTuple).filter((e) => e[0] && e[1]);

  return {
    stages,
    branches,
    edges,
    more: Math.max(0, Math.max(stages.length, branches.length ? branches.length + 1 : stages.length) - 3),
  };
}

function routeBox(p, dark = false) {
  return `<div class="routeBox${dark ? ' routeBoxDark' : ''}" data-a1-role="node" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px">
    <div class="routeTitle">${text(p.stage.label, 30)}</div>
    <div class="routeSub">${text(p.stage.meta || p.fallback, 28)}</div>
  </div>`;
}

function flowRoutingVisual(plan) {
  const r = normalizeRouting(plan);
  const stages = r.stages.slice(0, 3);
  const layouts = {
    1: [{ x: 186, y: 112, w: 128, h: 72 }],
    2: [{ x: 76, y: 112, w: 132, h: 70 }, { x: 292, y: 112, w: 132, h: 70 }],
    3: [{ x: 22, y: 110, w: 112, h: 68 }, { x: 194, y: 110, w: 112, h: 68 }, { x: 366, y: 110, w: 112, h: 68 }],
  };
  const placed = layouts[stages.length].map((p, i) => ({ ...p, stage: stages[i], fallback: i ? 'volgende' : 'start' }));
  const labels = r.edges.length ? r.edges.map((e) => e[2]).filter(Boolean) : ['door', 'gereed'];
  const paths = placed.slice(0, -1).map((p, i) => {
    const n = placed[i + 1];
    const y = Math.round(p.y + p.h / 2);
    return `<path d="M${p.x + p.w} ${y} H${n.x}" fill="none" stroke="#8591b3" stroke-width="2" stroke-linecap="round" marker-end="url(#arrow)"/>`;
  }).join('');
  const edgeLabels = placed.slice(0, -1).map((_, i) => {
    const x = stages.length === 2 ? 206 : i ? 292 : 120;
    return `<div class="edgeLabel" data-a1-role="label" style="left:${x}px;top:190px;width:88px">${text(labels[i] || 'door', 24)}</div>`;
  }).join('');
  const more = r.more ? `<div class="moreChip routeMore" data-a1-role="label">+${r.more} more</div>` : '';

  return `<svg class="links" viewBox="0 0 500 298" aria-hidden="true">
    <defs><marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 L7 4 L0 7" fill="none" stroke="#8591b3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    ${paths}
  </svg>${placed.map((p, i) => routeBox(p, i === 1 || stages.length === 1)).join('')}${edgeLabels}${more}`;
}

function branchRoutingVisual(plan) {
  const r = normalizeRouting(plan);
  const source = r.stages[0] || normalizeStage({ label: 'Aanvraag', meta: 'order' }, 0);
  const branches = (r.branches.length ? r.branches : [
    { label: 'Automatisch verwerkt', meta: 'onder limiet', edgeLabel: '< drempel' },
    { label: 'Ter goedkeuring', meta: 'beheerder', edgeLabel: '>= drempel' },
  ]).slice(0, 2);
  const placed = [
    { x: 34, y: 115, w: 128, h: 68, stage: source, fallback: 'besluit' },
    { x: 336, y: 62, w: 130, h: 62, stage: branches[0], fallback: 'pad 1' },
    { x: 336, y: 162, w: 130, h: 62, stage: branches[1], fallback: 'pad 2' },
  ];
  const paths = [
    'M162 149 H246 V93 H336',
    'M162 149 H246 V193 H336',
  ].map((d) => `<path d="${d}" fill="none" stroke="#8591b3" stroke-width="2" stroke-linecap="round" marker-end="url(#arrow)"/>`).join('');
  const labels = branches.map((b, i) => `<div class="edgeLabel" data-a1-role="label" style="left:198px;top:${i ? 181 : 83}px;width:92px">${text(b.edgeLabel || (i ? 'anders' : 'ja'), 24)}</div>`).join('');
  const more = r.more ? `<div class="moreChip routeMore" data-a1-role="label">+${r.more} more</div>` : '';

  return `<svg class="links" viewBox="0 0 500 298" aria-hidden="true">
    <defs><marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 L7 4 L0 7" fill="none" stroke="#8591b3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    ${paths}
  </svg>${routeBox(placed[0], true)}${routeBox(placed[1])}${routeBox(placed[2])}${labels}${more}`;
}

function routingVisual(plan) {
  const r = normalizeRouting(plan);
  if (r.branches.length >= 2 || /branch|decision|besluit|drempel/i.test(clean(plan?.routing?.kind || plan?.routing?.type || ''))) {
    return branchRoutingVisual(plan);
  }
  return flowRoutingVisual(plan);
}

function normalizeFunnel(plan) {
  const f = obj(plan?.funnel);
  const raw = list(f.stages).length ? f.stages : list(plan?.stages);
  const stages = (raw.length ? raw : [
    { label: 'Aanvragen', value: '18 schepen' },
    { label: 'Gebundeld', value: '6 orders' },
    { label: 'Gecontroleerd', value: '1 route' },
  ]).map((s, i) => ({
    label: clean(s?.label || s?.title || s?.name || `Fase ${i + 1}`, 30),
    value: clean(s?.value || s?.count || s?.meta || s?.status || '', 24),
  }));
  return {
    stages,
    result: clean(f?.result?.label || f?.result || plan?.result || 'Klaar voor verwerking', 34),
    more: Math.max(0, stages.length - 3),
  };
}

function funnelVisual(plan) {
  const f = normalizeFunnel(plan);
  const visible = f.stages.slice(0, 3);
  const dims = [
    { x: 54, y: 48, w: 392, h: 46 },
    { x: 88, y: 108, w: 324, h: 44 },
    { x: 121, y: 166, w: 258, h: 42 },
  ];
  const rows = visible.map((s, i) => `<div class="funnelStage${i === 0 ? ' funnelDark' : ''}" data-a1-role="row" style="left:${dims[i].x}px;top:${dims[i].y}px;width:${dims[i].w}px;height:${dims[i].h}px">
    <span class="funnelText">${text(s.label, 26)}</span>
    <span class="funnelValue">${text(s.value || `${i + 1}`, 20)}</span>
  </div>`).join('');
  const more = f.more ? `<div class="moreChip funnelMore" data-a1-role="label">+${f.more} more</div>` : '';
  return `${rows}<div class="funnelResult" data-a1-role="label">${text(f.result, 32)}</div>${more}`;
}

function normalizePopover(plan) {
  const p = obj(plan?.popover);
  const raw = list(p.items).length ? p.items : list(p.rows).length ? p.rows : list(p.base);
  const items = (raw.length ? raw : [
    { label: 'Dek onderhoud', meta: '12 items' },
    { label: 'Motorruim', meta: '8 items' },
    { label: 'Tuigerij', meta: '5 items' },
  ]).map((x, i) => ({
    label: clean(x?.label || x?.title || x?.name || `Lijst ${i + 1}`, 28),
    meta: clean(x?.meta || x?.value || x?.count || x?.status || '', 22),
  }));
  const card = obj(p.card || p.detail || p.overlay);
  const cardRows = (list(card.rows).length ? card.rows : list(card.items)).slice(0, 2).map((x, i) => ({
    label: clean(x?.label || x?.title || x?.name || `Keuze ${i + 1}`, 24),
    meta: clean(x?.meta || x?.value || x?.status || '', 18),
  }));
  if (!cardRows.length) cardRows.push({ label: 'Dek onderhoud', meta: 'selecteer' }, { label: 'Motorruim', meta: 'lijst' });
  return {
    items,
    card: {
      title: clean(card.title || p.title || 'Voeg toe aan lijst', 28),
      action: clean(card.action || p.action || 'Bevestig', 20),
      rows: cardRows,
    },
    more: Math.max(0, items.length - 3),
  };
}

function popoverVisual(plan) {
  const p = normalizePopover(plan);
  const rows = p.items.slice(0, 3).map((r, i) => `<div class="popItem" data-a1-role="row" style="top:${48 + i * 58}px">
    <span class="popDot"></span>
    <span class="popCopy"><span class="popTitle">${text(r.label, 26)}</span><span class="popMeta">${text(r.meta, 20)}</span></span>
  </div>`).join('');
  const cardRows = p.card.rows.slice(0, 2).map((r) => `<div class="popCardRow">
    <span>${text(r.label, 22)}</span><b>${text(r.meta, 16)}</b>
  </div>`).join('');
  const more = p.more ? `<div class="moreChip popMore" data-a1-role="label">+${p.more} more</div>` : '';
  return `${rows}<div class="popoverCard" data-a1-role="card">
    <div class="popCardTitle">${text(p.card.title, 26)}</div>
    ${cardRows}
    <div class="popAction">${text(p.card.action, 18)}</div>
  </div>${more}`;
}

function lineRow(x, i) {
  if (typeof x === 'string') return { label: clean(x, 34), meta: '' };
  if (Array.isArray(x)) return { label: clean(x[0] || `Rij ${i + 1}`, 34), meta: clean(x.slice(1).join(' · '), 28) };
  return {
    label: clean(x?.label || x?.title || x?.name || x?.id || `Rij ${i + 1}`, 34),
    meta: clean(x?.meta || x?.value || x?.status || x?.role || x?.count || '', 28),
  };
}

function linearSource(plan) {
  const sources = [
    list(plan?.linear?.rows),
    list(plan?.rows),
    list(plan?.items),
    list(plan?.matrix?.rows),
    list(plan?.node?.nodes),
    list(plan?.routing?.stages),
    list(plan?.routing?.nodes),
    list(plan?.funnel?.stages),
    list(plan?.popover?.items),
  ];
  return sources.find((s) => s.length) || [
    { label: 'MS Aldebaran', meta: 'gereed' },
    { label: 'MS Castor', meta: 'controle' },
    { label: 'MS Pollux', meta: 'volgende stap' },
  ];
}

function linearVisual(plan) {
  const all = linearSource(plan);
  const rows = all.slice(0, 3).map(lineRow);
  const more = Math.max(0, all.length - rows.length);
  return `<div class="linearWrap">
    <div class="linearHead" data-a1-role="label">${text(plan?.linear?.heading || 'Overzicht', 24)}</div>
    ${rows.map((r) => `<div class="linearRow" data-a1-role="row">
      <span class="linearName">${text(r.label, 30)}</span>
      <span class="linearMeta">${text(r.meta, 24)}</span>
    </div>`).join('')}
    ${more ? `<div class="moreChip linearMore" data-a1-role="label">+${more} more</div>` : ''}
  </div>`;
}

function anchorIcon() {
  return `<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v11M5.5 5.5h7M6 13c-2.2-.7-3.5-2.1-4-4.1M12 13c2.2-.7 3.5-2.1 4-4.1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
}

function defaultTitle(mode) {
  if (mode === 'node') return 'OCI-koppeling';
  if (mode === 'routing') return 'Goedkeuringsroute';
  if (mode === 'funnel') return 'Bundeling';
  if (mode === 'popover') return 'Favorieten';
  return 'Accountbeheer';
}

function defaultDesc(mode) {
  if (mode === 'node') return 'Koppel eenvoudig uw systeem met de webshop via een OCI';
  if (mode === 'routing') return 'Controleer bestellingen voordat ze worden verwerkt';
  if (mode === 'funnel') return 'Bundel aanvragen tot een heldere vlootstroom';
  if (mode === 'popover') return 'Maak gepersonaliseerde lijsten om producten te groeperen';
  return "Neem vloot-accounts realtime over en bekijk hun slimme winkelwagen";
}

function shell(plan, mode, visual) {
  const title = text(plan?.title || defaultTitle(mode), 58);
  const desc = text(plan?.desc || defaultDesc(mode), 124);
  const primitive = esc(mode);

  return `<!doctype html>
<html lang="nl" data-primitive="${primitive}" data-a1-rows-cap="3">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=560,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
html,body{width:100%;height:100%;margin:0;background:#eceef0}
body{display:grid;place-items:center;font-family:'Hanken Grotesk',Arial,sans-serif;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums;color:#0a1a2f}
.card{position:relative;width:560px;height:480px;overflow:hidden;padding:30px;border-radius:22px;background:#ffffff;box-shadow:0 1px 2px rgba(20,28,46,.04),0 26px 52px -22px rgba(20,28,46,.20)}
.visual{position:absolute;left:30px;top:30px;width:500px;height:298px;overflow:hidden;border:1px solid #ececec;border-radius:16px;background:#fefefe;box-shadow:0 8px 14px rgba(20,28,46,.08)}
.eyebrow{position:absolute;right:30px;top:30px;z-index:5;display:flex;align-items:center;gap:7px;height:28px;padding:0 11px;border:1px solid #e7e9ee;border-radius:999px;background:#f6f8fc;color:#06458c;font-size:12px;font-weight:700;line-height:1}
.eyebrow svg{width:15px;height:15px;flex:0 0 auto}
.title-band{position:absolute;left:30px;top:356px;width:390px;height:100px}
.title{max-width:370px;margin:0;color:#0a1a2f;font-size:21px;line-height:1.15;font-weight:700;letter-spacing:-.01em}
.desc{max-width:390px;margin:8px 0 0;color:#4e4e4e;font-size:13.5px;line-height:1.35;font-weight:500}
.cta{position:absolute;right:30px;bottom:30px;display:grid;place-items:center;width:34px;height:34px;border:1px solid #e2e2e2;border-radius:50%;background:#ffffff;color:#06458c;text-decoration:none;font-size:16px;font-weight:700;line-height:1}
.matrixWrap{position:absolute;left:18px;right:18px;top:48px;bottom:18px}
.matrixRow{display:grid;align-items:center;gap:10px;height:34px;margin-bottom:9px}
.matrixHead{height:32px}
.matrixLabel,.matrixCell,.linearName,.linearMeta,.routeTitle,.routeSub,.nodeLabel,.nodeRole,.edgeLabel,.funnelText,.funnelValue,.popTitle,.popMeta,.popCardTitle,.popCardRow span,.popCardRow b,.popAction{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.matrixLabel,.matrixCell{border-radius:10px;font-size:12px;line-height:1;font-weight:700}
.matrixLabel{padding:11px 12px;color:#0a1a2f;background:#ffffff;border:1px solid #e7e9ee}
.matrixHead .matrixLabel,.matrixHead .matrixCell{color:#4e4e4e;background:#f6f8fc;border:1px solid #e7e9ee;font-size:11px}
.matrixCell{padding:11px 10px;text-align:center;color:#0a1a2f;background:#f6f8fc;border:1px solid #e7e9ee}
.matrixCell.ok{color:#367e39;background:#ffffff}
.matrixCell.warn{color:#c9140f;background:#ffffff}
.moreChip{display:inline-flex;align-items:center;height:26px;padding:0 10px;border:1px solid #e7e9ee;border-radius:999px;background:#ffffff;color:#4e4e4e;font-size:12px;font-weight:700}
.links{position:absolute;inset:0;width:500px;height:298px;pointer-events:none}
.statusPill{position:absolute;left:18px;top:18px;z-index:2;display:flex;align-items:center;gap:7px;height:26px;padding:0 10px;border:1px solid #e7e9ee;border-radius:999px;background:#f6f8fc;color:#367e39;font-size:12px;font-weight:800}
.statusPill span{width:7px;height:7px;border-radius:50%;background:#367e39}
.nodeBox{position:absolute;z-index:2;display:flex;flex-direction:column;justify-content:center;gap:5px;overflow:hidden;padding:13px 14px;border:1px solid #e7e9ee;border-radius:15px;background:#ffffff;box-shadow:0 8px 14px rgba(20,28,46,.06)}
.nodeHub{border-color:#043367;background:#043367;color:#E7ECF7;box-shadow:0 14px 22px -14px rgba(4,51,103,.48)}
.nodeLabel,.nodeRole{max-width:100%;line-height:1.1}
.nodeLabel{font-size:14px;font-weight:800;color:inherit}
.nodeRole{font-size:11px;font-weight:700;color:#4e4e4e}
.nodeHub .nodeRole{color:#B8C2D6}
.nodeMore{position:absolute;left:18px;bottom:18px}
.routeBox{position:absolute;z-index:2;display:flex;flex-direction:column;justify-content:center;gap:6px;overflow:hidden;padding:13px 14px;border:1px solid #e7e9ee;border-radius:15px;background:#ffffff;box-shadow:0 8px 14px rgba(20,28,46,.06)}
.routeBoxDark{border-color:#043367;background:#043367;color:#E7ECF7;box-shadow:0 14px 22px -14px rgba(4,51,103,.48)}
.routeTitle{font-size:13.5px;line-height:1.1;font-weight:800;color:inherit}
.routeSub{font-size:11px;line-height:1.1;font-weight:700;color:#4e4e4e}
.routeBoxDark .routeSub{color:#B8C2D6}
.edgeLabel{position:absolute;z-index:3;display:flex;align-items:center;justify-content:center;height:22px;padding:0 8px;border:1px solid #e7e9ee;border-radius:999px;background:#ffffff;color:#4e4e4e;font-size:11px;font-weight:800}
.routeMore{position:absolute;left:18px;bottom:18px}
.funnelStage{position:absolute;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 28px;border:1px solid #e7e9ee;background:#ffffff;clip-path:polygon(8% 0,92% 0,100% 100%,0 100%)}
.funnelDark{border-color:#043367;background:#043367;color:#E7ECF7}
.funnelText{font-size:13px;line-height:1;font-weight:800;color:inherit}
.funnelValue{font-size:11px;line-height:1;font-weight:800;color:#4e4e4e}
.funnelDark .funnelValue{color:#B8C2D6}
.funnelResult{position:absolute;left:168px;top:228px;display:flex;align-items:center;justify-content:center;width:164px;height:32px;border:1px solid #e7e9ee;border-radius:999px;background:#f6f8fc;color:#06458c;font-size:12px;font-weight:800}
.funnelMore{position:absolute;left:348px;top:231px}
.popItem{position:absolute;left:24px;width:250px;height:46px;display:flex;align-items:center;gap:10px;padding:0 13px;border:1px solid #e7e9ee;border-radius:14px;background:#ffffff}
.popDot{width:9px;height:9px;flex:0 0 auto;border-radius:50%;background:#06458c}
.popCopy{display:flex;min-width:0;flex-direction:column;gap:4px}
.popTitle{max-width:180px;color:#0a1a2f;font-size:12.5px;line-height:1;font-weight:800}
.popMeta{max-width:180px;color:#4e4e4e;font-size:11px;line-height:1;font-weight:700}
.popoverCard{position:absolute;left:292px;top:70px;width:184px;height:132px;z-index:3;padding:14px;border:1px solid #043367;border-radius:16px;background:#043367;color:#E7ECF7;box-shadow:0 18px 26px -16px rgba(4,51,103,.58)}
.popCardTitle{font-size:13px;line-height:1.1;font-weight:800;color:#E7ECF7}
.popCardRow{display:flex;align-items:center;justify-content:space-between;gap:8px;height:26px;margin-top:9px;padding:0 9px;border-radius:9px;background:#053b77}
.popCardRow span{max-width:92px;color:#E7ECF7;font-size:11px;font-weight:700}
.popCardRow b{max-width:48px;color:#B8C2D6;font-size:10.5px;font-weight:800}
.popAction{display:flex;align-items:center;justify-content:center;height:24px;margin-top:10px;border-radius:999px;background:#ffffff;color:#06458c;font-size:11px;font-weight:800}
.popMore{position:absolute;left:24px;top:226px}
.linearWrap{position:absolute;left:22px;right:22px;top:22px}
.linearHead{display:inline-flex;align-items:center;height:26px;padding:0 10px;border:1px solid #e7e9ee;border-radius:999px;background:#f6f8fc;color:#06458c;font-size:12px;font-weight:800}
.linearRow{display:flex;align-items:center;justify-content:space-between;gap:12px;height:44px;margin-top:10px;padding:0 14px;border:1px solid #e7e9ee;border-radius:13px;background:#ffffff}
.linearName{max-width:260px;color:#0a1a2f;font-size:12.5px;font-weight:800}
.linearMeta{max-width:130px;color:#4e4e4e;font-size:11.5px;font-weight:700}
.linearMore{margin-top:12px}
@media (prefers-reduced-motion:no-preference){.cta{transition:transform .16s ease}.cta:hover{transform:translateY(-1px)}}
</style>
</head>
<body>
<main class="card" data-a1-role="card" data-primitive="${primitive}" data-a1-rows-cap="3">
  <section class="visual" data-a1-role="visual">${visual}</section>
  <div class="eyebrow" data-a1-role="eyebrow">${anchorIcon()}<span>Vloot-functie</span></div>
  <section class="title-band">
    <h1 class="title" data-a1-role="title">${title}</h1>
    <p class="desc" data-a1-role="description">${desc}</p>
  </section>
  <a class="cta" data-a1-role="shell-cta" href="#" aria-label="Open details">&#8599;</a>
</main>
</body>
</html>
`;
}

export function downgrade(plan = {}) {
  return shell(plan, 'downgrade', linearVisual(plan));
}

export function render(plan = {}) {
  const mode = modeOf(plan);
  if (!MODE_SET.has(mode)) return downgrade(plan);

  try {
    const visual = {
      matrix: matrixVisual,
      node: nodeVisual,
      routing: routingVisual,
      funnel: funnelVisual,
      popover: popoverVisual,
    }[mode](plan);
    return shell(plan, mode, visual);
  } catch {
    return downgrade(plan);
  }
}

if (process.argv[1]?.endsWith('skeleton-render.mjs') && process.argv[2] === '--selftest') {
  const plans = [
    {
      layout_mode: 'matrix',
      title: 'Accountbeheer',
      desc: 'Neem vloot-accounts realtime over',
      matrix: { columns: ['Bestellen', 'Goedkeuren'], rows: [{ label: 'MS Castor', cells: ['Ja', 'Nee'] }] },
    },
    {
      layout_mode: 'node',
      title: 'OCI-koppeling',
      desc: 'Koppel eenvoudig uw systeem met de webshop via een OCI',
      node: { nodes: [{ id: 'sap', label: 'SAP', role: 'bron' }, { id: 'anobel', label: 'Anobel', role: 'hub' }], edges: [['sap', 'anobel']] },
    },
    {
      layout_mode: 'routing',
      title: 'Goedkeuringssysteem',
      desc: 'Controleer bestellingen van de vloot',
      routing: { branches: [{ label: '< €1.000', target: 'Automatisch verwerkt' }, { label: '>= €1.000', target: 'Beheerder K. Visser' }] },
    },
    {
      layout_mode: 'funnel',
      title: 'Een factuur',
      desc: 'Alle bestellingen gebundeld',
      funnel: { stages: [{ label: 'Orders', value: '18' }, { label: 'Gebundeld', value: '6' }, { label: 'Factuur', value: '1' }], result: '1 factuur' },
    },
    {
      layout_mode: 'popover',
      title: 'Favorieten',
      desc: 'Maak gepersonaliseerde lijsten',
      popover: { items: [{ label: 'Dek onderhoud', meta: '12 items' }], card: { title: 'Voeg toe', rows: [{ label: 'Motorruim', meta: '8' }] } },
    },
    { layout_mode: 'donut', title: 'Kwartaalcijfers', linear: { rows: ['Omzet', 'Orders', 'Schepen', 'Meer'] } },
  ];

  for (const html of plans.map(render)) {
    assert.match(html, /^<!doctype html>/i);
    assert.match(html, /<\/html>\s*$/i);
    assert.match(html, /data-a1-role="visual"/);
    assert.match(html, /data-a1-role="title"/);
    assert.match(html, /data-a1-role="description"/);
    assert.match(html, /Vloot-functie/);
  }
  console.log('OK');
}
