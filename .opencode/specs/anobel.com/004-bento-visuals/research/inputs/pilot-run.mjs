import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { render } from './skeleton-render.mjs';
import { planFromSpec } from './pilot-plan.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const INPUT_DIRS = [
  HERE,
  path.join(process.cwd(), '.opencode/specs/anobel.com/004-bento-visuals/research/inputs'),
];
const COORD_KEYS = new Set(['x', 'y', 'x1', 'x2', 'y1', 'y2', 'top', 'left', 'right', 'bottom', 'width', 'height', 'w', 'h', 'cx', 'cy']);

async function inputPath(name) {
  for (const dir of INPUT_DIRS) {
    const p = path.join(dir, name);
    try {
      await fs.access(p);
      return p;
    } catch {}
  }
  throw new Error(`input not found: ${name}`);
}

function noCoords(v, p = 'plan') {
  if (Array.isArray(v)) return v.forEach((x, i) => noCoords(x, `${p}[${i}]`));
  if (!v || typeof v !== 'object') return;
  for (const [k, val] of Object.entries(v)) {
    if (COORD_KEYS.has(k.toLowerCase())) throw new Error(`coordinate key not allowed: ${p}.${k}`);
    noCoords(val, `${p}.${k}`);
  }
}

function validatePlan(plan, mode) {
  try {
    if (!plan || typeof plan !== 'object') throw new Error('not an object');
    if (plan.layout_mode !== mode) throw new Error(`layout_mode is not ${mode}`);
    if (plan.eyebrow !== 'Vloot-functie') throw new Error('missing eyebrow');
    if (!plan.title || !plan.desc) throw new Error('missing title/desc');
    noCoords(plan);
    if (mode === 'matrix') {
      if (!Array.isArray(plan.matrix?.columns) || !Array.isArray(plan.matrix?.rows)) throw new Error('bad matrix shape');
    } else if (!Array.isArray(plan.node?.nodes)) {
      throw new Error('bad node shape');
    }
    return { ok: true, error: null };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
}

function short(e) {
  return String(e?.message || e || '').replace(/\s+/g, ' ').slice(0, 180);
}

function gateResultPath(htmlPath) {
  return path.join(path.dirname(htmlPath), `${path.basename(htmlPath, '.html')}.gate.json`);
}

function runGate(gatePath, htmlPath, primitive) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [gatePath, htmlPath, '--run', 'a7-pilot', '--primitive', primitive], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let done = false;

    const finish = async (extra = {}) => {
      if (done) return;
      done = true;
      try {
        const raw = await fs.readFile(gateResultPath(htmlPath), 'utf8');
        const j = JSON.parse(raw);
        const failing = Object.entries(j.checks || {}).filter(([, v]) => !v.pass).map(([k]) => k);
        resolve({ pass: Boolean(j.pass), failing, stdout, stderr, ...extra });
      } catch (e) {
        resolve({ pass: false, failing: ['gate-error'], stdout, stderr, error: short(e), ...extra });
      }
    };

    p.stdout.on('data', (d) => { stdout += d; });
    p.stderr.on('data', (d) => { stderr += d; });
    p.on('error', (e) => finish({ error: short(e) }));
    p.on('close', (code) => finish({ code }));
  });
}

async function runOne(s, gatePath, outDir) {
  const htmlPath = path.join(outDir, `${s.tile}.html`);
  let planStatus = { ok: false, error: 'not requested' };
  let gate = { pass: false, failing: ['not-run'] };
  let err = null;

  try {
    const specPath = await inputPath(s.spec);
    const plan = await planFromSpec(specPath, 4, s.mode);
    planStatus = validatePlan(plan, s.mode);
    if (!planStatus.ok) throw new Error(planStatus.error);
    await fs.writeFile(htmlPath, render(plan), 'utf8');
    gate = await runGate(gatePath, htmlPath, s.mode);
  } catch (e) {
    err = short(e);
  }

  return {
    tile: s.tile,
    planOk: planStatus.ok,
    planError: planStatus.error,
    gatePass: Boolean(gate.pass),
    failing: gate.failing || [],
    error: err || gate.error || null,
  };
}

export async function runPilot() {
  const gatePath = await inputPath('a1-gate.mjs');
  const outDir = path.resolve('dist-a7-pilot');
  await fs.mkdir(outDir, { recursive: true });

  const sentinels = [
    { tile: 'accountbeheer-4', spec: 'spec-accountbeheer.json', mode: 'matrix' },
    { tile: 'oci-4', spec: 'spec-oci.json', mode: 'node' },
  ];

  const results = [];
  for (const s of sentinels) results.push(await runOne(s, gatePath, outDir));

  const passCount = results.filter((r) => r.gatePass).length;
  const pct = Math.round((passCount / results.length) * 100);

  console.log('OBEDIENCE REPORT');
  for (const r of results) {
    const failing = r.failing.length ? r.failing.join(',') : 'none';
    const extra = r.error ? `; error: ${r.error}` : '';
    console.log(`${r.tile}: plan parsed ok? ${r.planOk ? 'yes' : 'no'}; rendered tile ${r.gatePass ? 'PASSES' : 'FAILS'}; failing checks: ${failing}${extra}`);
  }
  console.log(`A7 PILOT: ${passCount}/${results.length} rendered tiles pass the gate = ${pct}%`);
  process.exitCode = passCount === results.length ? 0 : 1;
}

if (process.argv[1]?.endsWith('pilot-run.mjs')) {
  runPilot().catch((e) => {
    console.error(e?.stack || e?.message || String(e));
    process.exitCode = 1;
  });
}
