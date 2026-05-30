#!/usr/bin/env node
'use strict';

/**
 * advisor-probe.cjs — D1-inter signal: does the skill-advisor route a domain
 * prompt to the target skill?
 *
 * Captured OUT-OF-BAND (the advisor never sees that it is being benchmarked):
 * we run the in-repo Python advisor CLI (`skill_advisor.py`) over the PUBLIC
 * prompt and read its ranked recommendations. This is DETERMINISTIC — the Python
 * scorer reads the compiled SQLite skill graph, not an LLM — so it belongs in the
 * Mode A deterministic core, not live mode. (The TS `scoreAdvisorPrompt` is the
 * other entry point; the Python CLI is chosen here because it is process-isolated
 * and needs no cross-language bridge from CJS.)
 *
 * Probing is opt-in (the orchestrator calls it only when --advisor-mode=python)
 * so the pure-router Mode A default stays dependency-free and fast.
 */

const path = require('path');
const { spawnSync } = require('child_process');

const SKILLS_DIR = path.resolve(__dirname, '..', '..', '..'); // .opencode/skills
const DEFAULT_ADVISOR_PY = path.join(
  SKILLS_DIR, 'system-skill-advisor', 'mcp_server', 'scripts', 'skill_advisor.py',
);

/**
 * Run the advisor over a prompt and return its ranked recommendations.
 * @returns {{ ok: boolean, recommendations: Array<{skill:string,confidence:number}>,
 *   topSkill: string|null, error?: string }}
 */
function probeAdvisor({ prompt, advisorPy, timeoutMs }) {
  const py = advisorPy || DEFAULT_ADVISOR_PY;
  const res = spawnSync('python3', [py, String(prompt || '')], {
    encoding: 'utf8',
    timeout: timeoutMs || 60000,
    maxBuffer: 8 * 1024 * 1024,
  });
  if (res.status !== 0 || !res.stdout) {
    return { ok: false, recommendations: [], topSkill: null, error: (res.stderr || `exit ${res.status}`).slice(0, 200) };
  }
  let parsed;
  try {
    parsed = JSON.parse(res.stdout);
  } catch (err) {
    return { ok: false, recommendations: [], topSkill: null, error: `unparseable advisor output: ${err.message}` };
  }
  const recs = (Array.isArray(parsed) ? parsed : []).map((r) => ({
    skill: r.skill, confidence: typeof r.confidence === 'number' ? r.confidence : null,
  }));
  return { ok: true, recommendations: recs, topSkill: recs.length ? recs[0].skill : null };
}

/**
 * Score the D1-inter dimension for one scenario from an advisor probe result.
 * Rank-weighted: top-1 = 1.0, top-3 = 0.75, top-5 = 0.5, else 0. Negative
 * scenarios invert: the target must NOT appear in the recommendations.
 * @returns {{ score: number|null, rank: number|null, topSkill: string|null, ok: boolean }}
 */
function scoreD1Inter({ advisorResult, expectedSkillId, negative }) {
  if (!advisorResult || !advisorResult.ok) return { score: null, rank: null, topSkill: null, ok: false };
  const recs = advisorResult.recommendations;
  const rankIdx = expectedSkillId ? recs.findIndex((r) => r.skill === expectedSkillId) : -1;
  const rank = rankIdx === -1 ? null : rankIdx + 1;
  if (negative) {
    // should NOT activate: success = target absent from (or low in) the list.
    return { score: rank === null || rank > 5 ? 1 : 0, rank, topSkill: advisorResult.topSkill, ok: true };
  }
  let score = 0;
  if (rank === 1) score = 1;
  else if (rank !== null && rank <= 3) score = 0.75;
  else if (rank !== null && rank <= 5) score = 0.5;
  return { score, rank, topSkill: advisorResult.topSkill, ok: true };
}

module.exports = { probeAdvisor, scoreD1Inter, DEFAULT_ADVISOR_PY };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (!args.prompt) {
    process.stderr.write('usage: advisor-probe.cjs --prompt "<text>" [--advisor-py <path>]\n');
    process.exit(2);
  }
  const out = probeAdvisor({ prompt: args.prompt, advisorPy: args['advisor-py'] });
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
  process.exit(out.ok ? 0 : 1);
}
