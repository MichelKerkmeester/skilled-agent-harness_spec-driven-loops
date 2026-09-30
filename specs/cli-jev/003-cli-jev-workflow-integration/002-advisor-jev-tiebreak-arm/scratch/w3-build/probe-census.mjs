// Planning probe only: measures the census shape before any brief is written.
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration';
const RA = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy');
const DIST = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/runtime');

process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'probe-'));
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
process.env.PYTHONDONTWRITEBYTECODE = '1';
process.env.VITEST = 'true';
delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
const { mergedSkillForAlias, skillMatchesAlias } = await import(join(DIST, 'lib/scorer/aliases.js'));

const read = (f) => readFileSync(join(RA, f), 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
const match = (a, g) => {
  if (a === null || g === null) return a === g;
  const x = mergedSkillForAlias(a); const y = mergedSkillForAlias(g);
  return x === y || skillMatchesAlias(x, y);
};
const t0 = Date.now();
const out = {};
let hold = 0;
for (const row of read('holdout-prompts.jsonl')) {
  const r = scoreAdvisorPrompt(row.prompt, { workspaceRoot: ROOT });
  if (match(r.topSkill, row.skill_top_1 === 'none' ? null : row.skill_top_1)) hold += 1;
}
for (const file of ['labeled-prompts.jsonl', 'holdout-prompts.jsonl']) {
  const c = { rows: 0, eligible: 0, movable: 0, goldFirst: 0, goldOutside: 0, top3: 0, over25: 0, invisible: 0, sizes: {} };
  for (const row of read(file)) {
    if (!row.prompt || String(row.skill_top_1 ?? 'none') === 'none') continue;
    c.rows += 1;
    const r = scoreAdvisorPrompt(row.prompt, { workspaceRoot: ROOT });
    const order = r.recommendations.map((x) => x.skill);
    const top = r.recommendations[0];
    const raw = top ? [top.skill, ...(top.ambiguousWith ?? [])] : [];
    const cluster = order.filter((s) => raw.includes(s));
    if (raw.length !== cluster.length) c.invisible += 1;
    if (order.slice(0, 3).some((s) => match(s, row.skill_top_1))) c.top3 += 1;
    if (cluster.length < 2) continue;
    c.eligible += 1;
    c.sizes[cluster.length] = (c.sizes[cluster.length] ?? 0) + 1;
    if (cluster.length > 25) c.over25 += 1;
    const gi = cluster.findIndex((s) => match(s, row.skill_top_1));
    if (gi === 0) c.goldFirst += 1; else if (gi > 0) c.movable += 1; else c.goldOutside += 1;
  }
  out[file] = c;
}
console.log(JSON.stringify({ holdoutTop1: `${hold}/70`, ms: Date.now() - t0, out }, null, 1));
