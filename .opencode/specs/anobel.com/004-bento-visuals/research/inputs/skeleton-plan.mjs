import fs from 'node:fs';
import path from 'node:path';

const EP = 'https://api.z.ai/api/coding/paas/v4/chat/completions';
const COORD_KEYS = new Set(['x', 'y', 'x1', 'x2', 'y1', 'y2', 'top', 'left', 'right', 'bottom', 'width', 'height', 'w', 'h', 'cx', 'cy']);
const RENDER_MODES = new Set(['matrix', 'node', 'routing', 'funnel', 'popover']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function authKey() {
  const auth = JSON.parse(fs.readFileSync(`${process.env.HOME}/.local/share/opencode/auth.json`, 'utf8'));
  const key = auth['zai-coding-plan']?.key;
  if (!key) throw new Error('missing auth key: zai-coding-plan');
  return key;
}

function cleanMode(v) {
  const s = String(v || '').trim().toLowerCase();
  if (!s) throw new Error('layout_mode is required');
  return s;
}

function loadSpec(specInput) {
  if (typeof specInput === 'string') {
    const abs = path.resolve(specInput);
    return { spec: JSON.parse(fs.readFileSync(abs, 'utf8')), baseDir: path.dirname(abs) };
  }
  return { spec: specInput, baseDir: process.cwd() };
}

function treatmentOf(spec, n) {
  const treatment = spec?.treatments?.find((t) => Number(t.n) === Number(n));
  if (!treatment) throw new Error(`missing treatment ${n}`);
  return treatment;
}

function imageFor(spec, baseDir) {
  if (!spec?.refImage) return null;
  const ref = path.isAbsolute(spec.refImage) ? spec.refImage : path.resolve(baseDir, spec.refImage);
  if (!fs.existsSync(ref)) return null;
  return fs.readFileSync(ref).toString('base64');
}

function extractJson(raw) {
  let s = String(raw || '').trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  try { return JSON.parse(s); } catch {}
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  if (a < 0 || b <= a) throw new Error('no JSON object in model response');
  return JSON.parse(s.slice(a, b + 1));
}

function assertNoCoords(v, p = 'plan') {
  if (Array.isArray(v)) {
    v.forEach((x, i) => assertNoCoords(x, `${p}[${i}]`));
    return;
  }
  if (!v || typeof v !== 'object') return;
  for (const [k, val] of Object.entries(v)) {
    const key = k.toLowerCase();
    if (COORD_KEYS.has(key)) throw new Error(`coordinate key not allowed: ${p}.${k}`);
    if (key === 'html') throw new Error(`HTML key not allowed: ${p}.${k}`);
    assertNoCoords(val, `${p}.${k}`);
  }
}

function basePlan(spec, layoutMode) {
  return {
    layout_mode: layoutMode,
    title: String(spec.title || ''),
    desc: String(spec.desc || ''),
    eyebrow: 'Vloot-functie',
  };
}

function normEdge(e) {
  if (Array.isArray(e)) return e.slice(0, 3).map(String).filter(Boolean);
  return [e?.fromId || e?.from || e?.source, e?.toId || e?.to || e?.target, e?.label || e?.edgeLabel].map((x) => String(x || '')).filter(Boolean);
}

function normRows(raw) {
  return raw.map((r, i) => {
    if (typeof r === 'string') return { label: r };
    if (Array.isArray(r)) return { label: String(r[0] || `Rij ${i + 1}`), meta: r.slice(1).map(String).join(' · ') };
    return {
      label: String(r?.label || r?.title || r?.name || r?.id || `Rij ${i + 1}`),
      meta: String(r?.meta || r?.value || r?.status || r?.role || r?.count || ''),
    };
  });
}

function normalizeMatrix(raw, spec, layoutMode) {
  const m = raw.matrix && typeof raw.matrix === 'object' ? raw.matrix : raw;
  const columns = Array.isArray(m.columns) ? m.columns.map(String).filter(Boolean) : [];
  const rows = Array.isArray(m.rows) ? m.rows.map((r, i) => ({
    label: String(r?.label || `Rij ${i + 1}`),
    cells: Array.isArray(r?.cells) ? r.cells.map((c) => typeof c === 'boolean' ? c : String(c)) : [],
  })) : [];
  if (!columns.length || !rows.length) throw new Error('invalid matrix plan');
  return { ...basePlan(spec, layoutMode), matrix: { columns, rows } };
}

function normalizeNode(raw, spec, layoutMode) {
  const n = raw.node && typeof raw.node === 'object' ? raw.node : raw;
  const nodes = Array.isArray(n.nodes) ? n.nodes.map((x, i) => ({
    id: String(x?.id || `node-${i + 1}`),
    label: String(x?.label || x?.id || `Knooppunt ${i + 1}`),
    role: String(x?.role || 'koppeling'),
  })).filter((x) => x.id && x.label) : [];
  const edges = Array.isArray(n.edges) ? n.edges.map(normEdge).filter((e) => e.length >= 2) : [];
  if (!nodes.length) throw new Error('invalid node plan');
  return { ...basePlan(spec, layoutMode), node: { nodes, edges } };
}

function normalizeRouting(raw, spec, layoutMode) {
  const r = raw.routing && typeof raw.routing === 'object' ? raw.routing : raw;
  const stages = Array.isArray(r.stages || r.nodes || r.steps) ? (r.stages || r.nodes || r.steps).map((x, i) => ({
    id: String(x?.id || `stage-${i + 1}`),
    label: String(x?.label || x?.title || x?.name || `Stap ${i + 1}`),
    meta: String(x?.meta || x?.role || x?.status || x?.value || ''),
  })) : [];
  const branches = Array.isArray(r.branches) ? r.branches.map((x, i) => ({
    id: String(x?.id || `branch-${i + 1}`),
    label: String(x?.label || x?.condition || `Pad ${i + 1}`),
    target: String(x?.target || x?.targetLabel || x?.result || x?.outcome || ''),
    targetLabel: String(x?.targetLabel || x?.target || x?.result || x?.outcome || ''),
    meta: String(x?.meta || x?.status || x?.owner || ''),
    edgeLabel: String(x?.edgeLabel || x?.condition || x?.label || ''),
  })) : [];
  const edges = Array.isArray(r.edges) ? r.edges.map(normEdge).filter((e) => e.length >= 2) : [];
  if (!stages.length && !branches.length) throw new Error('invalid routing plan');
  return { ...basePlan(spec, layoutMode), routing: { kind: String(r.kind || r.type || ''), stages, branches, edges } };
}

function normalizeFunnel(raw, spec, layoutMode) {
  const f = raw.funnel && typeof raw.funnel === 'object' ? raw.funnel : raw;
  const stages = Array.isArray(f.stages) ? f.stages.map((x, i) => ({
    label: String(x?.label || x?.title || x?.name || `Fase ${i + 1}`),
    value: String(x?.value || x?.count || x?.meta || x?.status || ''),
  })) : [];
  if (!stages.length) throw new Error('invalid funnel plan');
  const result = typeof f.result === 'object' ? String(f.result?.label || '') : String(f.result || '');
  return { ...basePlan(spec, layoutMode), funnel: { stages, result } };
}

function normalizePopover(raw, spec, layoutMode) {
  const p = raw.popover && typeof raw.popover === 'object' ? raw.popover : raw;
  const items = Array.isArray(p.items || p.rows || p.base) ? normRows(p.items || p.rows || p.base) : [];
  const card = p.card || p.detail || p.overlay || {};
  const rows = Array.isArray(card.rows || card.items) ? normRows(card.rows || card.items) : [];
  if (!items.length) throw new Error('invalid popover plan');
  return {
    ...basePlan(spec, layoutMode),
    popover: {
      items,
      card: {
        title: String(card.title || p.title || 'Voeg toe aan lijst'),
        action: String(card.action || p.action || 'Bevestig'),
        rows,
      },
    },
  };
}

function normalizeLinear(raw, spec, layoutMode) {
  const rows = Array.isArray(raw.linear?.rows) ? raw.linear.rows
    : Array.isArray(raw.rows) ? raw.rows
      : Array.isArray(raw.items) ? raw.items
        : Array.isArray(raw.stages) ? raw.stages
          : [];
  return {
    ...basePlan(spec, layoutMode),
    linear: {
      heading: String(raw.linear?.heading || raw.heading || 'Overzicht'),
      rows: normRows(rows.length ? rows : [
        { label: 'MS Aldebaran', meta: 'gereed' },
        { label: 'MS Castor', meta: 'controle' },
        { label: 'MS Pollux', meta: 'volgende stap' },
      ]),
    },
  };
}

function normalizePlan(raw, spec, layoutMode) {
  assertNoCoords(raw);
  if (layoutMode === 'matrix') return normalizeMatrix(raw, spec, layoutMode);
  if (layoutMode === 'node') return normalizeNode(raw, spec, layoutMode);
  if (layoutMode === 'routing') return normalizeRouting(raw, spec, layoutMode);
  if (layoutMode === 'funnel') return normalizeFunnel(raw, spec, layoutMode);
  if (layoutMode === 'popover') return normalizePopover(raw, spec, layoutMode);
  return normalizeLinear(raw, spec, layoutMode);
}

function schemaFor(layoutMode) {
  const base = { layout_mode: layoutMode, title: '...', desc: '...', eyebrow: 'Vloot-functie' };
  if (layoutMode === 'matrix') return JSON.stringify({ ...base, matrix: { columns: ['...'], rows: [{ label: '...', cells: ['...'] }] } });
  if (layoutMode === 'node') return JSON.stringify({ ...base, node: { nodes: [{ id: '...', label: '...', role: '...' }], edges: [['fromId', 'toId', 'optional label']] } });
  if (layoutMode === 'routing') return JSON.stringify({ ...base, routing: { kind: 'flow or decision', stages: [{ id: '...', label: '...', meta: '...' }], branches: [{ label: 'condition', targetLabel: 'outcome', meta: '...' }], edges: [['fromId', 'toId', 'label']] } });
  if (layoutMode === 'funnel') return JSON.stringify({ ...base, funnel: { stages: [{ label: '...', value: '...' }], result: '...' } });
  if (layoutMode === 'popover') return JSON.stringify({ ...base, popover: { items: [{ label: '...', meta: '...' }], card: { title: '...', rows: [{ label: '...', meta: '...' }], action: '...' } } });
  return JSON.stringify({ ...base, linear: { heading: 'Overzicht', rows: [{ label: '...', meta: '...' }] } });
}

function promptFor(spec, treatment, layoutMode, hasImage) {
  const modeHint = RENDER_MODES.has(layoutMode)
    ? `Use the ${layoutMode} schema exactly.`
    : `Use a compact linear semantic plan for fallback mode "${layoutMode}".`;

  return `You are GLM-5.2. ${hasImage ? 'A reference image is attached.' : 'No reference image is attached; the semantic content is enough.'}

Return ONLY one valid JSON semantic plan. No markdown, no prose, no HTML.
Do NOT include coordinates or coordinate-like keys: x, y, left, top, width, height, cx, cy, w, h.
The deterministic Node renderer owns every pixel.

Tile:
title: ${spec.title}
desc: ${spec.desc}
eyebrow: Vloot-functie
layout_mode: ${layoutMode}
treatment: ${treatment.brief}

${modeHint}

Required JSON shape:
${schemaFor(layoutMode)}

Content rules:
- Keep labels concise and Dutch.
- Use realistic maritime fleet procurement data.
- Matrix rows/columns, node ids, routing stages/branches, funnel stages, popover items, or fallback rows are semantic only.
- Include more than three semantic items only when useful; the renderer will cap visible items.`;
}

async function requestPlan({ key, spec, treatment, layoutMode, img }) {
  const content = [{ type: 'text', text: promptFor(spec, treatment, layoutMode, Boolean(img)) }];
  if (img) content.push({ type: 'image_url', image_url: { url: `data:image/png;base64,${img}` } });

  const body = {
    model: 'glm-5.2',
    max_tokens: 4000,
    temperature: 0.2,
    thinking: { type: 'disabled' },
    messages: [{ role: 'user', content }],
  };

  let last;
  for (let a = 1; a <= 5; a++) {
    const ac = new AbortController();
    const to = setTimeout(() => ac.abort(), 150000);
    try {
      const r = await fetch(EP, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: ac.signal,
      });
      const raw = await r.text();
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${raw.slice(0, 240)}`);
      const j = JSON.parse(raw);
      const planText = j.choices?.[0]?.message?.content || '';
      return normalizePlan(extractJson(planText), spec, layoutMode);
    } catch (e) {
      last = e;
    } finally {
      clearTimeout(to);
    }
    await sleep(5000 * a);
  }
  throw last || new Error('plan request failed');
}

export async function emitPlan(specInput, n, layoutModeInput) {
  const layoutMode = cleanMode(layoutModeInput);
  const { spec, baseDir } = loadSpec(specInput);
  const treatment = treatmentOf(spec, n);
  const img = imageFor(spec, baseDir);
  return requestPlan({ key: authKey(), spec, treatment, layoutMode, img });
}

if (process.argv[1]?.endsWith('skeleton-plan.mjs')) {
  const [specJsonPath, treatmentN, layoutMode] = process.argv.slice(2);
  if (!specJsonPath || !treatmentN || !layoutMode) {
    console.error('usage: node skeleton-plan.mjs <specJson> <treatmentN> <layout_mode>');
    process.exit(2);
  }
  emitPlan(specJsonPath, treatmentN, layoutMode)
    .then((p) => console.log(JSON.stringify(p, null, 2)))
    .catch((e) => {
      console.error(e?.stack || e?.message || String(e));
      process.exitCode = 1;
    });
}
