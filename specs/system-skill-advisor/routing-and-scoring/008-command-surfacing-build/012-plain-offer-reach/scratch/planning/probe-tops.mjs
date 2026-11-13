import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const [root, dist, ...ids] = process.argv.slice(2);
const dir = mkdtempSync(join(tmpdir(), 'probe-'));
process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = dir; process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1'; process.env.VITEST = 'true'; process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1'; delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;
const { scoreAdvisorPrompt } = await import(pathToFileURL(join(dist, 'lib/scorer/fusion.js')).href);
const rows = readFileSync(join(root, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
const want = process.env.PROBE_PROMPT ? [{id:"adhoc",split:"none",prompt:process.env.PROBE_PROMPT}] : ids[0] === 'ALLNONHOLDOUT' ? rows.filter((r) => r.split !== 'holdout') : rows.filter((r) => ids.includes(r.id));
for (const r of want) {
  if (r.split === 'holdout') continue;
  const res = scoreAdvisorPrompt(r.prompt, { workspaceRoot: root });
  const top = res.recommendations.filter((x) => x.passes_threshold).slice(0, 3).map((x) => x.skill + ':' + Math.round(x.confidence * 100) / 100);
  console.log(r.id + '\t' + top.join(' '));
}
rmSync(dir, { recursive: true, force: true });
