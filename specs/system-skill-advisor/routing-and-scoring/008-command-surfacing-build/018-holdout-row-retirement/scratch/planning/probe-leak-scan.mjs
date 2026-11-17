// Run from the repository root: node <this file> [--paths <file> ...]
// Checks every sealed holdout row and every holdout-split row of the command
// corpus against the committed files the two scorers read, and prints ids, file
// paths, locations and counts only. It never prints a prompt or a matched value.
// Text is normalised the way the holdout builder does it, then split into words.
// A row hits a value when its whole word sequence sits inside the value's word
// sequence ("full"), or, for a row of eight words or more, when any run of eight
// consecutive words does ("run8"). JSON is checked one string value at a time and
// other text one line at a time, so no match spans two values or two lines.
// The positive control checks each corpus against itself and must hit every row.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const RA = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy';
const SEALED = `${RA}/holdout-prompts.jsonl`;
const COMMAND = `${RA}/command-prompts.jsonl`;

const words = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
const jsonl = (p) => readFileSync(p, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));

const rows = [
  ...jsonl(SEALED).map((r) => ({ id: r.id, set: 'sealed', w: words(r.prompt) })),
  // The split is read before the prompt is touched, and only holdout rows are kept.
  ...jsonl(COMMAND).filter((r) => r.split === 'holdout').map((r) => ({ id: r.id, set: 'command-holdout', w: words(r.prompt) })),
];

// Keys are word sequences joined by one space. A short row is looked up by its
// full sequence, a long row by each of its eight-word runs.
const byKey = new Map();
const lengths = new Set([8]);
const add = (key, entry) => byKey.set(key, [...(byKey.get(key) ?? []), entry]);
for (const row of rows) {
  if (row.w.length === 0) continue;
  if (row.w.length < 8) {
    lengths.add(row.w.length);
    add(row.w.join(' '), { row, kind: 'full' });
  } else {
    for (let i = 0; i + 8 <= row.w.length; i += 1) add(row.w.slice(i, i + 8).join(' '), { row, kind: 'run8' });
  }
}

function hitsIn(text) {
  const w = words(text);
  const found = new Map();
  for (const n of lengths) {
    for (let i = 0; i + n <= w.length; i += 1) {
      for (const { row, kind } of byKey.get(w.slice(i, i + n).join(' ')) ?? []) {
        if (kind === 'full' && row.w.length !== n) continue;
        if (kind === 'run8' && n !== 8) continue;
        const key = `${row.set}:${row.id}`;
        found.set(key, { row, kind, runs: (found.get(key)?.runs ?? 0) + 1 });
      }
    }
  }
  return [...found.values()];
}

function scanFile(file) {
  const out = [];
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('.json')) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = undefined;
    }
    if (parsed !== undefined) {
      const walk = (v, path) => {
        if (typeof v === 'string') for (const h of hitsIn(v)) out.push({ ...h, where: path });
        else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
        else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}[${JSON.stringify(k)}]`);
      };
      walk(parsed, '');
      return out;
    }
  }
  text.split('\n').forEach((line, i) => {
    for (const h of hitsIn(line)) out.push({ ...h, where: `line ${i + 1}` });
  });
  return out;
}

const ADV = '.skilled/skills/system-skill-advisor/runtime/';
const PATHSPECS = [
  ':(glob).skilled/skills/*/graph-metadata.json',
  ':(glob).skilled/skills/*/SKILL.md',
  ':(glob).skilled/skills/**/mode-registry.json',
  ':(glob).skilled/skills/**/hub-router.json',
  ':(glob).skilled/skills/**/command-metadata.json',
  `${ADV}scripts`,
  `${ADV}lib`,
];
const tracked = execFileSync('git', ['-c', 'core.fsmonitor=false', 'ls-files', '--', ...PATHSPECS], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\n').filter(Boolean);
// Two classes. "data" is the committed metadata a scorer loads at scoring time.
// "code" is the scorer source itself, the TypeScript library and the two Python
// scorer modules, whose hand-written phrase rules a prompt can also match. The
// bench, regression and compiler scripts score or build nothing at prompt time.
const classOf = (f) => {
  if (/^\.skilled\/skills\/[^/]+\/(graph-metadata\.json|SKILL\.md)$/.test(f)) return 'data';
  if (/(^|\/)(mode-registry|hub-router|command-metadata)\.json$/.test(f)) return 'data';
  if (f === `${ADV}scripts/skill-graph.json`) return 'data';
  if (f.startsWith(`${ADV}scripts/command-bridges/`) && f.endsWith('.json')) return 'data';
  if (f === `${ADV}scripts/skill_advisor.py` || f === `${ADV}scripts/skill_advisor_runtime.py`) return 'code';
  if (f.startsWith(`${ADV}lib/`) && f.endsWith('.ts')) return 'code';
  return null;
};
const inputs = tracked
  .filter((f) => !f.includes('/node_modules/') && !f.includes('/dist/') && !f.includes('/tests/'))
  .filter((f) => classOf(f) !== null);

// With --paths, scan only the named files instead of the scorer inputs. The
// close-out uses it to prove that the files a phase wrote hold no holdout text.
const pathsAt = process.argv.indexOf('--paths');
if (pathsAt !== -1) {
  const extra = process.argv.slice(pathsAt + 1);
  const hit = new Set();
  for (const file of extra) for (const h of scanFile(file)) hit.add(`${h.row.set}:${h.row.id}`);
  console.log(`files scanned: ${extra.length}, rows with a hit: ${hit.size} ${JSON.stringify([...hit].sort())}`);
  process.exit(0);
}

const sealedCount = rows.filter((r) => r.set === 'sealed').length;
const commandCount = rows.filter((r) => r.set === 'command-holdout').length;
const control = (file, set) => new Set(scanFile(file).filter((h) => h.row.set === set).map((h) => h.row.id)).size;
console.log(`rows checked: sealed ${sealedCount}, command holdout ${commandCount}`);
console.log(`positive control: sealed rows found in their own file ${control(SEALED, 'sealed')} of ${sealedCount}, command holdout rows found in their own file ${control(COMMAND, 'command-holdout')} of ${commandCount}`);
console.log(`scorer input files scanned: data ${inputs.filter((f) => classOf(f) === 'data').length}, code ${inputs.filter((f) => classOf(f) === 'code').length}`);

const byRow = new Map();
for (const file of inputs) {
  for (const h of scanFile(file)) {
    const key = `${h.row.set}:${h.row.id}`;
    const entry = byRow.get(key) ?? { set: h.row.set, id: h.row.id, words: h.row.w.length, hits: [] };
    entry.hits.push({ file, cls: classOf(file), where: h.where, kind: h.kind, runs: h.runs });
    byRow.set(key, entry);
  }
}
const entries = [...byRow.values()].sort((a, b) => `${a.set}:${a.id}`.localeCompare(`${b.set}:${b.id}`));
const ids = (list) => JSON.stringify(list.map((e) => e.id));
const inData = (e) => e.hits.some((h) => h.cls === 'data');
console.log(`rows with a hit: ${entries.length} ${ids(entries)}`);
console.log(`rows with a hit in data, three words or more: ${ids(entries.filter((e) => inData(e) && e.words >= 3))}`);
console.log(`rows with a hit in data, under three words: ${ids(entries.filter((e) => inData(e) && e.words < 3))}`);
console.log(`rows with a hit in code only: ${ids(entries.filter((e) => !inData(e)))}`);
for (const entry of entries) {
  console.log(`${entry.set} ${entry.id} (words ${entry.words}): ${entry.hits.length} hits in ${new Set(entry.hits.map((h) => h.file)).size} files`);
  for (const h of entry.hits) console.log(`  ${h.cls} ${h.file} ${h.where} ${h.kind}${h.kind === 'run8' ? ` runs ${h.runs}` : ''}`);
}
