// Build the frozen old -> new name map for benchmark run folders.
//
// Date precedence, strongest first:
//   1. a date already written into the folder name (a deliberate human assertion)
//   2. an execution timestamp recorded inside the run's own JSON artifacts
//   3. the date the folder was first committed (never later than execution)
//
// Rule 2 is deliberately below rule 1: a comparison run copies its baseline's
// artifacts in, so the earliest timestamp in the folder can belong to the
// baseline rather than to the run.

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const SP = __dirname;
const runs = JSON.parse(fs.readFileSync(path.join(SP, 'runs.json'), 'utf8'));
const DATE_KEYS = /^(capturedAt|captured_at|generatedAt|generated_at|dispatchedAt|dispatched_at)$/;

function deepDates(o, acc) {
  if (!o || typeof o !== 'object') return acc;
  for (const [k, v] of Object.entries(o)) {
    if (DATE_KEYS.test(k) && typeof v === 'string') { const d = Date.parse(v); if (!isNaN(d)) acc.push(d); }
    else if (v && typeof v === 'object') deepDates(v, acc);
  }
  return acc;
}

function jsonDate(abs) {
  const acc = []; const st = [abs];
  while (st.length) {
    const c = st.pop(); let e;
    try { e = fs.readdirSync(c, { withFileTypes: true }); } catch { continue; }
    for (const x of e) {
      const f = path.join(c, x.name);
      if (x.isDirectory()) st.push(f);
      else if (x.name.endsWith('.json')) { try { deepDates(JSON.parse(fs.readFileSync(f, 'utf8')), acc); } catch { /* unreadable */ } }
    }
  }
  return acc.length ? new Date(Math.min(...acc)).toISOString().slice(0, 10) : null;
}

function nameDate(base) {
  let m = /(\d{4})(\d{2})(\d{2})-\d{6}/.exec(base);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /(\d{4}-\d{2}-\d{2})/.exec(base);
  if (m) return m[1];
  return null;
}

function gitDate(p) {
  try {
    return cp.execSync(`git log --diff-filter=A --format=%ad --date=short --reverse -- "${p}" | head -1`, { encoding: 'utf8' }).trim() || null;
  } catch { return null; }
}

function slug(v) {
  return String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Strip the trailing timestamp / epoch token a name used instead of a date field.
function stripStamp(base) {
  return base
    .replace(/-\d{8}-\d{6}$/, '')
    .replace(/-\d{13}$/, '')
    .replace(/^benchmark-\d{4}-\d{2}-\d{2}-?/, '')
    .replace(/^benchmark-\d{4}-\d{2}-\d{2}$/, '');
}

/**
 * Read executor identity out of the run's own report, for folders whose name
 * carries none. `report.json` and `skill-benchmark-report.json` both occur.
 */
function recordedVariant(abs) {
  for (const name of ['skill-benchmark-report.json', 'report.json']) {
    const f = path.join(abs, name);
    if (!fs.existsSync(f)) continue;
    let r;
    try { r = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { continue; }
    const model = r.model || (r.targetModel && r.targetModel.id);
    const parts = [model, r.variant].filter(Boolean);
    if (parts.length) return parts.join('-');
    if (r.executor) return r.executor;
    if (r.traceMode) return r.traceMode;
  }
  return null;
}

// Model tokens that belong in the variant field rather than the subject.
const MODEL_TOKENS = [
  'luna-high', 'sonnet', 'glm-5-2-high', 'glm-5-2', 'kimi-2-7', 'swe-1-6', 'minimax', 'mimo', 'kimi-k2-7', 'r3',
];

function splitSubjectVariant(base, root) {
  const stem = slug(stripStamp(base));
  if (!stem) return { subject: 'run', variant: null };

  // A leading ordinal is workspace numbering, not part of the name.
  const noOrdinal = stem.replace(/^\d{3}-/, '');

  for (const token of MODEL_TOKENS) {
    if (noOrdinal === token) return { subject: 'model-eval', variant: token };
    if (noOrdinal.startsWith(`${token}-`)) return { subject: noOrdinal.slice(token.length + 1), variant: token };
    if (noOrdinal.endsWith(`-${token}`)) return { subject: noOrdinal.slice(0, -token.length - 1), variant: token };
  }

  // No model in the name: the whole stem is the subject and the variant names
  // the corpus family the folder sits in, which is always known.
  const family = path.basename(path.dirname(path.join(root, base))) === 'compiled-routing' ? 'compiled-routing' : null;
  return { subject: noOrdinal, variant: family ? 'unlabelled' : null };
}

const rows = [];
for (const r of runs) {
  const abs = path.join(r.root, r.rel);
  const base = path.basename(r.rel);
  const parent = path.dirname(r.rel) === '.' ? null : path.dirname(r.rel);

  // The frozen anchor keeps its name: code refuses it as a run label and dating
  // it would destroy the meaning the storage guide gives it.
  if (base === 'baseline') {
    rows.push({ root: r.root, oldRel: r.rel, newRel: r.rel, carveOut: 'frozen-anchor', date: null, dateSource: null });
    continue;
  }

  const n = nameDate(base);
  const j = n ? null : jsonDate(abs);
  const g = (n || j) ? null : gitDate(abs);
  const date = n || j || g;
  const dateSource = n ? 'name' : (j ? 'json' : 'git');

  const split = splitSubjectVariant(base, r.root);
  // A name with no model token still has a recorded executor identity in the
  // report it wrote. Falling back to that keeps the third field truthful rather
  // than dropping it or inventing one.
  const variant = split.variant && split.variant !== 'unlabelled'
    ? split.variant
    : (recordedVariant(abs) || split.variant || 'unspecified');
  const newBase = [date, slug(split.subject), slug(variant)].filter(Boolean).join('--');
  rows.push({
    root: r.root,
    oldRel: r.rel,
    newRel: parent ? `${parent}/${newBase}` : newBase,
    carveOut: null,
    date,
    dateSource,
  });
}

// Collisions are the one failure mode a rename cannot recover from.
const seen = new Map();
const collisions = [];
for (const row of rows) {
  const key = `${row.root}/${row.newRel}`;
  if (seen.has(key)) collisions.push({ key, a: seen.get(key), b: row.oldRel });
  seen.set(key, row.oldRel);
}

fs.writeFileSync(path.join(SP, 'rename-map.json'), JSON.stringify({ rows, collisions }, null, 1));
console.log(`rows: ${rows.length} | collisions: ${collisions.length}`);
for (const c of collisions) console.log(`  COLLISION ${c.key}  <=  ${c.a} AND ${c.b}`);
console.log('---');
for (const row of rows) {
  const mark = row.carveOut ? '  [carve-out]' : ` [${row.dateSource}]`;
  console.log(`  ${row.root.replace('.opencode/skills/', '')}`);
  console.log(`      ${row.oldRel}\n   -> ${row.newRel}${mark}`);
}
