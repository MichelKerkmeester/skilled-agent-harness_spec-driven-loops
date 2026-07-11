#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ playbook-generator — auto-create benchmark scenarios for thin-coverage   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
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

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { parseRouter, routeSkillResources, loadSurfaceRouter } = require('./router-replay.cjs');
const { buildBannedVocab, lintFixture } = require('./contamination-lint.cjs');
const { loadPlaybookScenarios } = require('./load-playbook-scenarios.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derive coverage targets from the skill's own router + "When NOT to Use".
 *
 * @param {string} skillRoot - Skill root dir containing SKILL.md.
 * @returns {{intents:string[],resourceTargets:string[],negatives:string[],existingCount:number,routerParseable:boolean}} Coverage analysis.
 */
function analyzeCoverage(skillRoot) {
  const skillMd = fs.readFileSync(path.join(skillRoot, 'SKILL.md'), 'utf8');
  const router = parseRouter(skillMd, skillRoot);
  // A parent hub's router only carries the mode keys (implement/quality/debug/...);
  // the retained surface router (when present) carries the real per-intent signal
  // set the resource targets are actually keyed on, so merge it in for coverage.
  let intents = Object.keys(router.intentSignals);
  if (router.routerSource === 'hub-router.json') {
    const surfaceRouter = loadSurfaceRouter(skillRoot);
    if (surfaceRouter) {
      intents = [...new Set([...intents, ...Object.keys(surfaceRouter.intentSignals)])];
    }
  }
  const resourceTargets = [...new Set(Object.values(router.resourceMap).flat())];
  const m = /#{1,3}\s*When NOT to Use([\s\S]*?)(?:\n#{1,3}\s|$)/i.exec(skillMd);
  const negatives = m ? (m[1].match(/^\s*[-*]\s+(.+)$/gm) || []).map((s) => s.replace(/^\s*[-*]\s+/, '').trim().slice(0, 140)) : [];
  const existing = loadPlaybookScenarios({ skillRoot }).scenarios;
  return { intents, resourceTargets, negatives, existingCount: existing.length, routerParseable: router.parseable };
}

function slugifyScenarioTitle(title) {
  return String(title || 'scenario')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'scenario';
}

/**
 * Render one scenario in the GOLD per-feature format the parser reads.
 *
 * @param {Object} spec - Scenario fields.
 * @param {string} spec.id - Scenario id.
 * @param {string} spec.title - Scenario title.
 * @param {string} spec.prompt - Exact prompt text.
 * @param {string} spec.expectedSurface - Asserted surface (defaults to UNKNOWN).
 * @param {string[]} spec.expectedResources - Expected references.
 * @param {boolean} spec.negative - Whether the skill should NOT activate.
 * @param {string} [spec.stage=routing] - Benchmark stage.
 * @returns {string} The rendered scenario markdown.
 */
function renderScenarioMarkdown({ id, title, prompt, expectedSurface, expectedResources, negative, stage = 'routing' }) {
  const refs = (expectedResources || []).map((r) => `- \`${r}\``).join('\n') || '- (none)';
  return `---
id: "${id}"
title: "${id}: ${title}"
description: "Auto-generated (tier T1-auto) routing scenario for ${title}."
stage: ${stage}
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

/**
 * Run the 4 validation gates on a generated scenario.
 *
 * @param {Object} args - Gate inputs.
 * @param {string} args.skillRoot - Skill root dir.
 * @param {string} args.skillId - Skill id.
 * @param {string} args.scenarioMd - Rendered scenario markdown.
 * @param {string} args.prompt - Scenario prompt text.
 * @param {string[]} args.expectedResources - Claimed gold resources.
 * @param {string} args.stagingDir - Staging dir for generated scenarios.
 * @param {string} args.id - Scenario id.
 * @returns {{contamination:boolean,structural:boolean,parseRoundTrip:boolean,selfConsistency:boolean,allPassed:boolean}} Gate results.
 */
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

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate staged scenarios. `author` is an injectable async fn
 * (spec -> {prompt, expectedSurface, expectedResources}); the default `dry`
 * author emits a deterministic stub (no LLM, for CI/testing). The real path
 * passes an LLM-backed author (dispatch via live-executor).
 *
 * @param {Object} args - Generation options.
 * @param {string} args.skillRoot - Skill root dir.
 * @param {boolean} [args.createMissing=false] - Opt-in to author staged scenarios.
 * @param {Function} [args.author] - Injectable async author fn.
 * @param {boolean} [args.dry=true] - When true, do not write staged files to disk.
 * @returns {Promise<{staged:Array,proposalDir:?string,coverage:Object,promoteHint:string}>} Generation result.
 */
async function generatePlaybook({ skillRoot, createMissing = false, author, dry = true }) {
  const skillId = path.basename(skillRoot);
  const coverage = analyzeCoverage(skillRoot);
  if (!createMissing) {
    return { staged: [], proposalDir: null, coverage, promoteHint: 'pass createMissing:true to author staged scenarios' };
  }
  const stagingDir = path.join(skillRoot, 'manual_testing_playbook', '_generated_staging');
  const specs = coverage.intents.map((intent, i) => ({ id: `AG-${String(i + 1).padStart(3, '0')}`, intent, negative: false, stage: 'routing' }));
  const authorFn = author || (async (spec) => ({
    prompt: `(auto stub) exercise the ${spec.intent} path for ${skillId}`,
    expectedSurface: 'UNKNOWN',
    expectedResources: [],
  }));

  const staged = [];
  const usedFilenames = new Set();
  for (const spec of specs) {
    const a = await authorFn(spec);
    const title = `${spec.intent} coverage`;
    const baseSlug = slugifyScenarioTitle(title);
    let filename = `${baseSlug}.md`;
    let suffix = 2;
    while (usedFilenames.has(filename)) {
      filename = `${baseSlug}-${suffix}.md`;
      suffix += 1;
    }
    usedFilenames.add(filename);
    const md = renderScenarioMarkdown({ id: spec.id, title, prompt: a.prompt, expectedSurface: a.expectedSurface, expectedResources: a.expectedResources, negative: spec.negative, stage: spec.stage || (spec.negative ? 'negative' : 'routing') });
    const gates = validateGenerated({ skillRoot, skillId, scenarioMd: md, prompt: a.prompt, expectedResources: a.expectedResources, stagingDir, id: spec.id });
    if (!dry) {
      fs.mkdirSync(stagingDir, { recursive: true });
      fs.writeFileSync(path.join(stagingDir, filename), md);
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { generatePlaybook, analyzeCoverage, validateGenerated, renderScenarioMarkdown };
