// Read-only probe of the degraded path, with no daemon involved.
//
// The degraded answer is produced by two steps the CLI already owns:
//   1. runLocalScorer -> python3 .../skill_advisor.py --threshold 0.8 --uncertainty 0.35 --stdin
//   2. degradedRecommendations(rows, prompt) -> the shaped answer the hook receives
// This script runs exactly those two steps and renders the result through the same
// renderer the hook uses, beside the live answer for the same prompt.
//
// Run from the repository root: node <this file>

import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const SCORER = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py');
const CLI_DIST = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/skill-advisor-cli.js');
const RENDERER = resolve(ROOT, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/render.js');
const ADVISOR_CLI = resolve(ROOT, '.skilled/bin/skill-advisor.cjs');

const PROMPTS = [
  ['typed', '/create:readme for the utils folder'],
  ['plain-readme', 'write a readme for the utils folder'],
  ['system-deep-loop-skill', 'use the system-deep-loop skill'],
  ['system-deep-loop-long', 'please use the system-deep-loop skill for this work'],
  ['doctor-setup', 'run doctor setup for my install'],
  ['deep-research-plain', 'Go find out everything you can about incremental indexing approaches and report back'],
  ['no-match', 'what is the weather today'],
];

const cli = await import(pathToFileURL(CLI_DIST).href);
const renderer = await import(pathToFileURL(RENDERER).href);

function localRows(prompt) {
  const stdout = execFileSync('python3', [SCORER, '--threshold', '0.8', '--uncertainty', '0.35', '--stdin'], {
    cwd: ROOT,
    input: prompt,
    encoding: 'utf8',
    timeout: 60_000,
  });
  const parsed = JSON.parse(stdout);
  const rows = Array.isArray(parsed) ? parsed : (parsed.recommendations ?? parsed.data?.recommendations ?? []);
  return rows;
}

const rows = [];
for (const [label, prompt] of PROMPTS) {
  const live = JSON.parse(execFileSync('node', [ADVISOR_CLI, 'advisor_recommend', '--json', JSON.stringify({ prompt }), '--format', 'json'], {
    cwd: ROOT, encoding: 'utf8', timeout: 60_000,
  }));
  const raw = localRows(prompt);
  const shaped = cli.degradedRecommendations(raw, prompt);
  const degradedResult = {
    status: 'ok',
    freshness: 'stale',
    recommendations: shaped.map((entry) => ({
      skill: entry.skillId,
      kind: entry.kind === 'command' ? 'command' : 'skill',
      confidence: entry.confidence,
      uncertainty: entry.uncertainty,
      passes_threshold: true,
      ...(typeof entry.command === 'string' ? { command: entry.command } : {}),
      ...(typeof entry.policy === 'string' ? { policy: entry.policy } : {}),
      ...(typeof entry.ownerSkillId === 'string' ? { ownerSkillId: entry.ownerSkillId } : {}),
      ...(entry.needsMode === true ? { needsMode: true } : {}),
    })),
  };
  const degraded = renderer.renderAdvisorBrief(degradedResult, {});
  const liveTop = live?.data?.recommendations?.[0] ?? {};
  rows.push({
    label,
    prompt,
    live_top: { skill: liveTop.skillId ?? null, command: liveTop.command ?? null, policy: liveTop.policy ?? null, needsMode: liveTop.needsMode === true },
    local_raw_top: raw.slice(0, 2).map((r) => ({ skill: r.skill ?? r.skillId ?? null, command: r.command ?? null, policy: r.policy ?? null, confidence: r.confidence ?? null, uncertainty: r.uncertainty ?? null })),
    degraded_shaped_top: shaped.slice(0, 2).map((r) => ({ skill: r.skillId ?? null, kind: r.kind ?? null, command: r.command ?? null, policy: r.policy ?? null, needsMode: r.needsMode === true })),
    degraded_head: degraded === null ? null : degraded.split('\n')[0],
  });
}

console.log(JSON.stringify({ rows }, null, 2));
