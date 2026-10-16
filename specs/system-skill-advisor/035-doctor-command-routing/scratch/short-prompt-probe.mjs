// Scores each short prompt twice under the pinned force-local regime: with the
// full projection and with every command-doctor-* entry removed. The second run
// stands in for routing before doctor bridges existed. Applies the three-result
// cut the handler and hooks use. Writes JSON and prints a table.
//
// Usage: node short-prompt-probe.mjs <prompts.json> <out.json>
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const REPO = resolve(new URL('.', import.meta.url).pathname, '../../../..');
const DIST = join(REPO, '.skilled/skills/system-skill-advisor/runtime/dist/runtime');
const [promptsPath, out] = process.argv.slice(2);
process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-short-'));
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
process.env.VITEST = 'true';
const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
const { loadAdvisorProjection } = await import(join(DIST, 'lib/scorer/projection.js'));
const full = loadAdvisorProjection(REPO);
const bare = { ...full, skills: full.skills.filter((s) => !s.id.startsWith('command-doctor-')) };
const groups = JSON.parse(readFileSync(promptsPath, 'utf8'));
const top3 = (projection, prompt) => scoreAdvisorPrompt(prompt, { workspaceRoot: REPO, projection })
  .recommendations.slice(0, 3)
  .map((r) => ({ id: r.skill, c: Number(r.confidence.toFixed(4)), u: Number(r.uncertainty.toFixed(4)) }));
const rows = [];
let lost = 0, changed = 0;
for (const [group, prompts] of Object.entries(groups)) {
  for (const prompt of prompts) {
    const withBridges = top3(full, prompt);
    const withoutBridges = top3(bare, prompt);
    const nonDoctor = withBridges.filter((r) => !r.id.startsWith('command-doctor-'));
    const baseTop = withoutBridges[0] ?? null;
    const sameTop = baseTop === null
      || (withBridges[0]?.id === baseTop.id && withBridges[0].c === baseTop.c && withBridges[0].u === baseTop.u);
    const doctorPos = withBridges.findIndex((r) => r.id.startsWith('command-doctor-'));
    const status = baseTop && !withBridges.length ? 'LOST' : sameTop ? 'same' : 'CHANGED';
    if (status === 'LOST') lost += 1;
    if (status === 'CHANGED') changed += 1;
    rows.push({ group, prompt, status, withoutBridges, withBridges, doctorPos });
  }
}
writeFileSync(out, JSON.stringify({ lost, changed, rows }, null, 1) + '\n');
const fmt = (list) => list.map((r) => `${r.id} ${r.c}/${r.u}`).join(', ') || '(none)';
for (const r of rows) console.log(`${r.status.padEnd(7)} ${r.group.padEnd(20)} ${JSON.stringify(r.prompt).padEnd(26)} | without: ${fmt(r.withoutBridges)} | with: ${fmt(r.withBridges)}`);
console.log(`TOTAL=${rows.length} LOST=${lost} CHANGED=${changed}`);
