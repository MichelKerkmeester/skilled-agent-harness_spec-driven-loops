#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Near-miss skill scoring probe
// ───────────────────────────────────────────────────────────────────
// Prints the positive lane contributions for the four skills named in the
// near-miss investigation, so a token that lands on the wrong skill stays
// traceable to the lane and the evidence that carried it.
//
// The semantic-shadow lane substitutes deterministic fixture vectors under the
// test-harness flag, so VITEST is set before the scorer module loads and the
// output reflects the same regime the routing baselines are captured under.
// ───────────────────────────────────────────────────────────────────

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(HERE, '../../../../../../.skilled/skills/system-skill-advisor/runtime/dist/runtime');
const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const PROMPT = 'fix the typo in the heading of the setup guide';
const NAMED_SKILLS = ['sk-doc', 'system-skilled-doctor', 'sk-code', 'sk-design'];
const DECIMALS = 4;

// ───────────────────────────────────────────────────────────────────
// 2. ENVIRONMENT
// ───────────────────────────────────────────────────────────────────

// The fixture vector regime is selected when the scorer initializes, so the
// flag has to be in place before the import below.
process.env.VITEST = 'true';

// ───────────────────────────────────────────────────────────────────
// 3. PROBE
// ───────────────────────────────────────────────────────────────────

const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
const { findAdvisorWorkspaceRoot } = await import(join(DIST, 'lib/utils/workspace-root.js'));

const workspaceRoot = findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });
const result = scoreAdvisorPrompt(PROMPT, { workspaceRoot });

for (const skill of NAMED_SKILLS) {
  const recommendation = result.recommendations.find((entry) => entry.skill === skill);
  if (recommendation === undefined) continue;
  const contributions = recommendation.laneContributions
    .filter((contribution) => contribution.weightedScore > 0)
    .map((contribution) => [
      contribution.lane,
      Number(contribution.weightedScore.toFixed(DECIMALS)),
      contribution.evidence,
    ]);
  const confidence = recommendation.confidence.toFixed(2);
  const score = recommendation.score.toFixed(DECIMALS);
  console.log(`${skill} ${confidence} ${score} ${JSON.stringify(contributions)}`);
}

const skdocIndex = result.recommendations.findIndex((entry) => entry.skill === 'sk-doc');
console.log(`count ${result.recommendations.length} skdoc index ${skdocIndex}`);
