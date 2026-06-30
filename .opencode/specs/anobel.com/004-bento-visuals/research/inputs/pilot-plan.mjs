import fs from 'node:fs';
import path from 'node:path';

const EP = 'https://api.z.ai/api/coding/paas/v4/chat/completions';
const MODES = new Set(['matrix', 'node']);
const COORD_KEYS = new Set(['x', 'y', 'x1', 'x2', 'y1', 'y2', 'top', 'left', 'right', 'bottom', 'width', 'height', 'w', 'h', 'cx', 'cy']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function authKey() {
  const auth = JSON.parse(fs.readFileSync(`${process.env.HOME}/.local/share/opencode/auth.json`, 'utf8'));
  const key = auth['zai-coding-plan']?.key;
  if (!key) throw new Error('missing auth key: zai-coding-plan');
  return key;
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
    if (COORD_KEYS.has(k.toLowerCase())) throw new Error(`coordinate key not allowed: ${p}.${k}`);
    assertNoCoords(val, `${p}.${k}`);
  }
}

function normalizePlan(raw, spec, layoutMode) {
  assertNoCoords(raw);
  const plan = {
    layout_mode: layoutMode,
    title: String(spec.title || ''),
    desc: String(spec.desc || ''),
    eyebrow: 'Vloot-functie',
  };

  if (layoutMode === 'matrix') {
    const m = raw.matrix && typeof raw.matrix === 'object' ? raw.matrix : raw;
    const columns = Array.isArray(m.columns) ? m.columns.map(String).filter(Boolean) : [];
    const rows = Array.isArray(m.rows) ? m.rows.map((r, i) => ({
      label: String(r?.label || `Rij ${i + 1}`),
      cells: Array.isArray(r?.cells) ? r.cells.map((c) => typeof c === 'boolean' ? c : String(c)) : [],
    })) : [];
    if (!columns.length || !rows.length) throw new Error('invalid matrix plan');
    plan.matrix = { columns, rows };
    return plan;
  }

  const n = raw.node && typeof raw.node === 'object' ? raw.node : raw;
  const nodes = Array.isArray(n.nodes) ? n.nodes.map((x, i) => ({
    id: String(x?.id || `node-${i + 1}`),
    label: String(x?.label || x?.id || `Knooppunt ${i + 1}`),
    role: String(x?.role || 'koppeling'),
  })).filter((x) => x.id && x.label) : [];
  const edges = Array.isArray(n.edges) ? n.edges.map((e) => {
    if (Array.isArray(e)) return e.slice(0, 3).map(String);
    return [String(e?.fromId || e?.from || ''), String(e?.toId || e?.to || ''), String(e?.label || '')].filter(Boolean);
  }).filter((e) => e.length >= 2) : [];
  if (!nodes.length) throw new Error('invalid node plan');
  plan.node = { nodes, edges };
  return plan;
}

function promptFor(spec, treatment, layoutMode) {
  const matrix = `{"layout_mode":"matrix","title":"${spec.title}","desc":"${spec.desc}","eyebrow":"Vloot-functie","matrix":{"columns":["..."],"rows":[{"label":"...","cells":["..."]}]}}`;
  const node = `{"layout_mode":"node","title":"${spec.title}","desc":"${spec.desc}","eyebrow":"Vloot-functie","node":{"nodes":[{"id":"...","label":"...","role":"..."}],"edges":[["fromId","toId","optional label"]]}}`;
  return `You are GLM-5.2. A reference image is attached and visible.

Return ONLY one valid JSON semantic plan. No markdown, no prose, no HTML.
Do NOT include coordinates or coordinate-like keys: x, y, left, top, width, height, cx, cy, w, h.
The deterministic Node renderer owns every pixel.

Tile:
title: ${spec.title}
desc: ${spec.desc}
eyebrow: Vloot-functie
layout_mode: ${layoutMode}
treatment: ${treatment.brief}

Required schema:
${layoutMode === 'matrix' ? matrix : node}

For matrix: use concise Dutch column names and realistic fleet-account rows.
For node: use at most four semantic nodes if needed; the renderer will cap to three. Use stable lowercase ids.`;
}

async function requestPlan({ key, spec, treatment, layoutMode, img }) {
  const body = {
    model: 'glm-5.2',
    max_tokens: 4000,
    temperature: 0.2,
    thinking: { type: 'disabled' },
    messages: [{ role: 'user', content: [
      { type: 'text', text: promptFor(spec, treatment, layoutMode) },
      { type: 'image_url', image_url: { url: `data:image/png;base64,${img}` } },
    ] }],
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
      const content = j.choices?.[0]?.message?.content || '';
      return normalizePlan(extractJson(content), spec, layoutMode);
    } catch (e) {
      last = e;
    } finally {
      clearTimeout(to);
    }
    await sleep(5000 * a);
  }
  throw last || new Error('plan request failed');
}

export async function planFromSpec(specJsonPath, treatmentN, layoutMode) {
  if (!MODES.has(layoutMode)) throw new Error('layout_mode must be matrix or node');
  const abs = path.resolve(specJsonPath);
  const spec = JSON.parse(fs.readFileSync(abs, 'utf8'));
  const treatment = spec.treatments?.find((t) => Number(t.n) === Number(treatmentN));
  if (!treatment) throw new Error(`missing treatment ${treatmentN}`);
  const ref = path.isAbsolute(spec.refImage) ? spec.refImage : path.resolve(path.dirname(abs), spec.refImage);
  const img = fs.readFileSync(ref).toString('base64');
  return requestPlan({ key: authKey(), spec, treatment, layoutMode, img });
}

if (process.argv[1]?.endsWith('pilot-plan.mjs')) {
  const [specJsonPath, treatmentN, layoutMode] = process.argv.slice(2);
  if (!specJsonPath || !treatmentN || !layoutMode) {
    console.error('usage: node pilot-plan.mjs <specJsonPath> <treatmentN> <layout_mode>');
    process.exit(2);
  }
  planFromSpec(specJsonPath, treatmentN, layoutMode)
    .then((p) => console.log(JSON.stringify(p, null, 2)))
    .catch((e) => {
      console.error(e?.stack || e?.message || String(e));
      process.exitCode = 1;
    });
}
