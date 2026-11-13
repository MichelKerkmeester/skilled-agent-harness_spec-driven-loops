#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Typed command ambiguity probe
// ───────────────────────────────────────────────────────────────────
// Prints the ambiguity verdict and the leading rows for one typed command
// prompt, with the confidence floor flag and the cluster size on each row, so
// the cause of an ambiguous top stays attributable to the floor or to a score
// margin.
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
const PROMPT = '/create:agent dependency-auditor for release checks';
const ROW_LIMIT = 4;
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

console.log(`prompt ${PROMPT}`);
console.log(`ambiguous ${result.ambiguous}`);

for (const [index, recommendation] of result.recommendations.slice(0, ROW_LIMIT).entries()) {
  const confidence = recommendation.confidence.toFixed(2);
  const score = recommendation.score.toFixed(DECIMALS);
  const floored = recommendation.confidenceFloored === true;
  const clusterSize = recommendation.ambiguousWith?.length ?? 0;
  console.log(`${index + 1}. ${recommendation.skill} confidence=${confidence} score=${score} confidenceFloored=${floored} ambiguousWith=${clusterSize}`);
}

const top = result.recommendations[0];
if (top !== undefined && top.ambiguousWith !== undefined) {
  const members = new Set(top.ambiguousWith);
  const flooredMembers = result.recommendations.filter((entry) => (
    members.has(entry.skill) && entry.confidenceFloored === true
  ));
  console.log(`cluster size=${members.size} flooredMembers=${flooredMembers.length}`);
}
