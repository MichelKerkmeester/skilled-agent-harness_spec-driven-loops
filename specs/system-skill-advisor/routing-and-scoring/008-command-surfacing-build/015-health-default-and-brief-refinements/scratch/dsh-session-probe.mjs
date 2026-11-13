// Run from the repository root: node <this file>
// Throwaway probe: replays the DSH session choice for one stored final-arm row. Reads only.
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { dshProjectKey, dshStoreRoot } from '../../../../../../.skilled/hooks/shared/session-readers/dsh.mjs';
import { loadSession } from '../../../../../../.skilled/hooks/shared/session-readers/index.mjs';
import { promptSessionId } from '../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs';

const ROOT = process.cwd();
const FINAL = resolve(ROOT, 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl');
const CORPUS = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl');
const ROW = 'cmd-deep-research-plain-tune-01';

const dshLines = readFileSync(FINAL, 'utf8').split('\n').filter(Boolean)
  .map((l) => JSON.parse(l)).filter((l) => l.runtime === 'dsh');
const before = dshLines.map((l) => l.locator?.sessionId).filter((id) => typeof id === 'string');
const homes = [...new Set(dshLines.map((l) => l.locator?.dshHome))];
const dirs = [...new Set(dshLines.map((l) => l.locator?.projectDir))];
if (homes.length !== 1 || dirs.length !== 1) throw new Error(`expected one dshHome and projectDir, got ${homes.length}/${dirs.length}`);
const [dshHome] = homes;
const [projectDir] = dirs;

// Only the one tune row is parsed for its prompt; any other row is skipped unread.
let prompt = null;
for (const line of readFileSync(CORPUS, 'utf8').split('\n')) {
  if (!line.includes(`"${ROW}"`)) continue;
  const row = JSON.parse(line);
  if (row.id !== ROW) continue;
  if (row.split !== 'tune') throw new Error('row is not tune');
  prompt = row.prompt;
}
if (typeof prompt !== 'string') throw new Error('row not found');

const store = join(dshStoreRoot({ env: { DSH_HOME: dshHome } }), dshProjectKey(projectDir));
const after = readdirSync(store, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);

const loaded = new Map();
async function load(id) {
  if (!loaded.has(id)) {
    let r = null;
    try { r = await loadSession({ runtime: 'dsh', sessionId: id, dshHome, projectDir }); } catch { r = null; }
    loaded.set(id, r);
  }
  return loaded.get(id);
}

// Same reading as the runner: the first user record's text blocks, joined.
async function firstUserText(id) {
  const r = await load(id);
  if (!r?.ok || !Array.isArray(r.records)) return null;
  const rec = r.records.find((e) => e?.role === 'user');
  if (rec === undefined) return null;
  return (Array.isArray(rec.content) ? rec.content : [])
    .filter((b) => b?.type === 'text' && typeof b.text === 'string').map((b) => b.text).join('\n');
}

const chosen = await promptSessionId({ before, after, prompt, firstUserText });
const known = new Set(before);
const candidates = [...new Set(after)].filter((id) => !known.has(id));
console.log(`chosen: ${chosen}`);
for (const id of candidates) {
  const r = await load(id);
  const n = r?.ok && Array.isArray(r.records) ? r.records.length : 'unreadable';
  console.log(`candidate: ${id} records=${n}`);
}
