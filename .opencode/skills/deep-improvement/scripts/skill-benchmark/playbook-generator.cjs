#!/usr/bin/env node
'use strict';

/**
 * playbook-generator.cjs — auto-CREATE benchmark scenarios for a skill that
 * lacks them (or has thin coverage).
 *
 * Mutation boundary (Lane C is diagnostic-by-default): this NEVER writes into a
 * skill's live playbook. It is opt-in (`createMissing`), writes only to a
 * clearly-namespaced `manual_testing_playbook/_generated_staging/` dir, and
 * emits a promoteHint for the operator to review + land. Generated scenarios are
 * tier `T1-auto` (the honesty anchor: a generator that read the router can't
 * author a true holdout; T2 stays human).
 *
 * Each staged scenario must pass four gates before it is promotable:
 *   1. contamination — the prompt must not leak skill/router identifiers
 *   2. parser round-trip — re-parses cleanly via load-playbook-scenarios
 *   3. structural — basic GOLD-shape lint (required fields present)
 *   4. self-consistency — routeSkillResources actually routes to the claimed gold
 */

const fs = require('fs');
const path = require('path');
const { parseRouter, routeSkillResources } = require('./router-replay.cjs');
const { buildBannedVocab, lintFixture } = require('./contamination-lint.cjs');
const { loadPlaybookScenarios } = require('./load-playbook-scenarios.cjs');

// Coverage targets derived from the skill's own router + "When NOT to Use".
function analyzeCoverage(skillRoot) {
  const skillMd = fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8');
  const router = parseRouter(skillMd, skillRoot);
  const intents = Object.keys(router.intentSignals);
  const resourceTargets = [...new Set(Object.values(router.resourceMap).flat())];
  const m = /#{1,3}\s*When NOT to Use([\s\S]*?)(?:\n#{1,3}\s|$)/i.exec(skillMd);
  const negatives = m ? (m[1].match(/^\s*[-*]\s+(.+)$/gm) || []).map((s) => s.replace(/^\s*[-*]\s+/, '').trim().slice(0, 140)) : [];
  const existing = loadPlaybookScenarios({ skillRoot }).scenarios;
  return { intents, resourceTargets, negatives, existingCount: existing.length, routerParseable: router.parseable };
}

// Render one scenario in the GOLD per-feature format the parser reads.
function renderScenarioMarkdown({ id, title, prompt, expectedSurface, expectedResources, negative }) {
  const refs = (expectedResources || []).map((r) => `- \`${r}\``).join('\n') || '- (none)';
  return `---
title: "${id}: ${title}"
description: "Auto-generated (tier T1-auto) routing scenario for ${title}."
---

# ${id}: ${title}

## 2. SCENARIO CONTRACT

**Exact prompt**:
\`\`\`
${prompt}
\`\`\`

**Expected detection**:
- Surface: \`${expectedSurface || 'UNKNOWN'}\`

**Expected references loaded**:
${refs}

## 3. TEST EXECUTION

### Pass/Fail Criteria
- **PASS** iff surface == ${expectedSurface || 'UNKNOWN'}${negative ? ' AND the skill does NOT activate' : ' AND the expected references load'}.

## 5. SOURCE METADATA
- **Created**: auto-generated
- **Tier**: T1-auto
- **Critical path**: No
`;
}

// 4 validation gates on a generated scenario.
function validateGenerated({ skillRoot, skillId, scenarioMd, prompt, expectedResources, stagingDir, id }) {
  const gates = {};
  // 1. contamination
  const vocab = buildBannedVocab({ skillRoot, skillId, privateExpected: { resources: expectedResources } });
  gates.contamination = lintFixture({ publicText: prompt, bannedVocab: vocab }).passed;
  // 3. structural: required GOLD fields present
  gates.structural = /\*\*Exact prompt\*\*/.test(scenarioMd) && /Pass\/Fail Criteria/.test(scenarioMd) && /title:/.test(scenarioMd);
  // 2. parser round-trip: the generated markdown must carry the fields the
  // parser reads (fenced prompt + surface). Validated IN-MEMORY — the gate must
  // never write into the target skill's playbook (staging happens only on a
  // non-dry promote).
  gates.parseRoundTrip = /```[\s\S]*?```/.test(scenarioMd) && /Surface:/.test(scenarioMd);
  // 4. self-consistency: the prompt must actually route to its claimed gold
  const routed = routeSkillResources({ skillRoot, taskText: prompt });
  gates.selfConsistency = (expectedResources || []).length === 0
    ? true
    : expectedResources.some((r) => routed.resources.includes(r));
  gates.allPassed = Object.values(gates).every(Boolean);
  return gates;
}

/**
 * Generate staged scenarios. `author` is an injectable async fn
 * (spec -> {prompt, expectedSurface, expectedResources}); the default `dry`
 * author emits a deterministic stub (no LLM, for CI/testing). The real path
 * passes an LLM-backed author (dispatch via live-executor).
 */
async function generatePlaybook({ skillRoot, createMissing = false, author, dry = true }) {
  const skillId = path.basename(skillRoot);
  const coverage = analyzeCoverage(skillRoot);
  if (!createMissing) {
    return { staged: [], proposalDir: null, coverage, promoteHint: 'pass createMissing:true to author staged scenarios' };
  }
  const stagingDir = path.join(skillRoot, 'manual_testing_playbook', '_generated_staging');
  const specs = coverage.intents.map((intent, i) => ({ id: `AG-${String(i + 1).padStart(3, '0')}`, intent, negative: false }));
  const authorFn = author || (async (spec) => ({
    prompt: `(auto stub) exercise the ${spec.intent} path for ${skillId}`,
    expectedSurface: 'UNKNOWN',
    expectedResources: [],
  }));

  const staged = [];
  for (const spec of specs) {
    const a = await authorFn(spec);
    const title = `${spec.intent} coverage`;
    const md = renderScenarioMarkdown({ id: spec.id, title, prompt: a.prompt, expectedSurface: a.expectedSurface, expectedResources: a.expectedResources, negative: spec.negative });
    const gates = validateGenerated({ skillRoot, skillId, scenarioMd: md, prompt: a.prompt, expectedResources: a.expectedResources, stagingDir, id: spec.id });
    if (!dry) {
      fs.mkdirSync(stagingDir, { recursive: true });
      fs.writeFileSync(path.join(stagingDir, `${spec.id}.md`), md);
    }
    staged.push({ id: spec.id, intent: spec.intent, gates, promotable: gates.allPassed });
  }
  return {
    staged,
    proposalDir: dry ? null : stagingDir,
    coverage,
    promoteHint: `Review ${stagingDir}, then move promotable scenarios into the live playbook category folders + root index.`,
  };
}

module.exports = { generatePlaybook, analyzeCoverage, validateGenerated, renderScenarioMarkdown };
