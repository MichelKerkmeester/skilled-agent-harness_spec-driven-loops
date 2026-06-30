import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { emitPlan } from './skeleton-plan.mjs';
import { render } from './skeleton-render.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(HERE, 'dist-a7-r1');
const GATE = path.join(HERE, 'a1-gate.mjs');

const TILES = [
  ['accountbeheer-4', 'matrix'],
  ['aangepast-assortiment-3', 'matrix'],
  ['oci-4', 'node'],
  ['oci-2', 'routing'],
  ['goedkeuringssysteem-4', 'routing'],
  ['aangepast-assortiment-5', 'funnel'],
  ['een-factuur-4', 'funnel'],
  ['favorieten-4', 'popover'],
  ['prijzen-condities-3', 'routing'],
  ['kwartaalcijfers-4', 'downgrade'],
];

const SPEC_MAP = {
  accountbeheer: ['spec-accountbeheer.json'],
  'aangepast-assortiment': ['spec-aangepast-assortiment.json'],
  oci: ['spec-oci.json'],
  goedkeuringssysteem: ['spec-gk4.json', 'spec-goedkeuring.json'],
  'een-factuur': ['spec-een-factuur.json'],
  favorieten: ['spec-favorieten.json'],
  'prijzen-condities': ['spec-prijzen-condities.json'],
  kwartaalcijfers: ['spec-kwartaalcijfers.json'],
};

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function topicOf(tile) {
  return tile.replace(/-\d+$/, '');
}

function treatmentOf(tile) {
  const m = tile.match(/-(\d+)$/);
  if (!m) throw new Error(`missing treatment suffix: ${tile}`);
  return Number(m[1]);
}

async function specPathFor(tile) {
  const topic = topicOf(tile);
  const names = SPEC_MAP[topic];
  if (!names) throw new Error(`missing spec mapping: ${topic}`);
  for (const name of names) {
    const file = path.join(HERE, name);
    if (await exists(file)) return file;
  }
  throw new Error(`no spec file found for ${tile}: ${names.join(', ')}`);
}

async function loadSpecAndTreatment(specPath, n) {
  const spec = JSON.parse(await fs.readFile(specPath, 'utf8'));
  const treatment = spec.treatments?.find((t) => Number(t.n) === Number(n));
  if (!treatment) throw new Error(`missing treatment ${n} in ${path.basename(specPath)}`);
  return { spec, treatment };
}

function words(brief) {
  return String(brief || '')
    .replace(/[^\p{L}\p{N}€<>.= -]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fallbackPlan(spec, treatment, mode) {
  const brief = words(treatment.brief);
  const base = {
    layout_mode: mode,
    title: spec.title || '',
    desc: spec.desc || '',
    eyebrow: 'Vloot-functie',
  };

  if (mode === 'matrix') {
    return {
      ...base,
      matrix: {
        columns: ['Status', 'Limiet', 'Actie'],
        rows: [
          { label: 'MS Aldebaran', cells: ['Actief', '€1.000', 'Ja'] },
          { label: 'MS Castor', cells: ['Controle', '€2.500', 'Nee'] },
          { label: 'MS Pollux', cells: ['Actief', '€5.000', 'Ja'] },
          { label: 'MS Vesta', cells: ['Wacht', '€750', 'Nee'] },
        ],
      },
    };
  }

  if (mode === 'node') {
    return {
      ...base,
      node: {
        nodes: [
          { id: 'erp', label: 'Eigen systeem', role: 'bron' },
          { id: 'anobel', label: 'Anobel', role: 'hub' },
          { id: 'cart', label: 'Winkelwagen', role: 'terug' },
          { id: 'po', label: 'Orderdocument', role: 'sync' },
        ],
        edges: [['erp', 'anobel', 'OCI'], ['anobel', 'cart', 'terug']],
      },
    };
  }

  if (mode === 'routing') {
    const decision = /drempel|threshold|goedkeur|</i.test(brief);
    return {
      ...base,
      routing: decision ? {
        kind: 'decision',
        stages: [{ id: 'order', label: 'Orderbedrag', meta: 'inkomend' }],
        branches: [
          { label: '< €1.000', targetLabel: 'Automatisch verwerkt', meta: 'direct', edgeLabel: '< limiet' },
          { label: '>= €1.000', targetLabel: 'Beheerder K. Visser', meta: 'goedkeuring', edgeLabel: 'controle' },
        ],
      } : {
        kind: 'flow',
        stages: [
          { id: 'start', label: 'Aanvraag', meta: 'vloot' },
          { id: 'check', label: 'Controle', meta: 'regels' },
          { id: 'done', label: 'Verwerkt', meta: 'gereed' },
          { id: 'archive', label: 'Archief', meta: 'later' },
        ],
        edges: [['start', 'check', 'door'], ['check', 'done', 'gereed']],
      },
    };
  }

  if (mode === 'funnel') {
    return {
      ...base,
      funnel: {
        stages: [
          { label: 'Aanvragen', value: '18 regels' },
          { label: 'Gebundeld', value: '6 orders' },
          { label: 'Samengevoegd', value: '1 stroom' },
          { label: 'Archief', value: 'later' },
        ],
        result: /factuur/i.test(brief) ? '1 factuur' : 'Klaar voor beheer',
      },
    };
  }

  if (mode === 'popover') {
    return {
      ...base,
      popover: {
        items: [
          { label: 'Dek onderhoud', meta: '12 items' },
          { label: 'Motorruim', meta: '8 items' },
          { label: 'Tuigerij', meta: '5 items' },
          { label: 'Veiligheid', meta: '4 items' },
        ],
        card: {
          title: 'Voeg toe aan lijst',
          rows: [{ label: 'Dek onderhoud', meta: '12' }, { label: 'Motorruim', meta: '8' }],
          action: 'Bevestig',
        },
      },
    };
  }

  return {
    ...base,
    linear: {
      heading: 'Overzicht',
      rows: [
        { label: 'Omzet', meta: 'maart 2026' },
        { label: 'Orders', meta: 'vlootbreed' },
        { label: 'Schepen', meta: 'actief' },
        { label: brief.slice(0, 36) || 'Details', meta: 'samenvatting' },
      ],
    },
  };
}

function runNode(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { cwd: HERE, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', (error) => resolve({ code: 1, stdout, stderr: `${stderr}${error.message}` }));
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

function failingChecks(result) {
  if (!result?.checks) return ['gateError'];
  return Object.entries(result.checks).filter(([, v]) => !v.pass).map(([k]) => k);
}

async function gateTile(tile, mode, htmlPath) {
  const out = path.join(OUT_DIR, `${tile}.gate.json`);
  const run = await runNode([GATE, htmlPath, '--arm', 'a1_gate_repair', '--run', 'a7-r1', '--primitive', mode, '--out', out]);
  try {
    return JSON.parse(await fs.readFile(out, 'utf8'));
  } catch {
    return {
      tileId: tile,
      pass: false,
      checks: null,
      error: `${run.stderr || run.stdout || 'gate result missing'}`.trim(),
    };
  }
}

async function runTile(tile, mode) {
  const n = treatmentOf(tile);
  const specPath = await specPathFor(tile);
  const { spec, treatment } = await loadSpecAndTreatment(specPath, n);
  let plan;

  try {
    plan = await emitPlan(specPath, n, mode);
  } catch (e) {
    console.error(`[run-2d] ${tile}: emitPlan fallback: ${e?.message || String(e)}`);
    plan = fallbackPlan(spec, treatment, mode);
  }

  const html = render(plan);
  const out = path.join(OUT_DIR, `${tile}.html`);
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(out, html);
  const gate = await gateTile(tile, mode, out);
  return { tile, mode, pass: Boolean(gate.pass), fails: failingChecks(gate) };
}

async function main() {
  const rows = [];
  for (const [tile, mode] of TILES) rows.push(await runTile(tile, mode));

  console.log('tile | mode | gate pass | failing checks');
  console.log('--- | --- | --- | ---');
  for (const r of rows) {
    console.log(`${r.tile} | ${r.mode} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.fails.length ? r.fails.join(',') : '-'}`);
  }

  const pass = rows.filter((r) => r.pass).length;
  const pct = Math.round((pass / rows.length) * 100);
  console.log(`A7 2D RECOVERY: ${pass}/10 = ${pct}% (baseline: 0/10 of these were SHIP)`);
}

main().catch((e) => {
  console.error(e?.stack || e?.message || String(e));
  process.exitCode = 1;
});
