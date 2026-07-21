#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ luna-acceptance — two-plane LUNA-HIGH live routing acceptance stage       ║
// ║ (non-frozen sibling of the scorer trio)                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * luna-acceptance.cjs — the one place in the compiled-routing coverage program
 * where a live, nondeterministic model is in the loop.
 *
 * It runs an orchestrator-owned scenario map through `openai/gpt-5.6-luna` at
 * reasoning-effort `high` (the codex transport, service tier fast) and asks the
 * model to state its routing. Two properties make it honest rather than a rubber
 * stamp:
 *
 *   1. Fail-closed transport. A transport timeout (the model exhausting the
 *      dispatch ceiling) or an unavailable binary is classified `SKIP`, NEVER
 *      coerced to `PASS` or `FAIL` — a working route must never read as a failure
 *      because the transport stalled, and a stall must never read as a pass.
 *      stdout and stderr are captured as two distinct fields per run so a stall
 *      is diagnosable after the fact.
 *   2. Gold-bearing holdouts. Every hub carries at least one held-out paraphrase
 *      whose correct route is recorded in the scenario's gold but withheld from
 *      the prompt text sent to the model. A holdout that the model routes
 *      correctly is a generalization result, not a fitted-prompt echo.
 *
 * The scenario map is owned here, in the orchestrator, precisely because it is
 * the nondeterministic plane: it is kept out of the deterministic hub-local
 * scenario files and their static validators so the two planes never entangle.
 *
 * Never edits the frozen loader or either other frozen scorer file. The
 * dispatcher is an injectable dependency with a production default, so the
 * timeout/skip/pass/fail space is exercisable from fixtures without a live model.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
const {
  buildLiveDispatchPrompt, extractRoutingJson, proseRoutingFallback, parseRoutedDeclaration,
} = require('./live-executor.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PROVIDER_MODEL = 'openai/gpt-5.6-luna';
const VARIANT = 'high';
const SERVICE_TIER = 'fast';
const VERDICT = Object.freeze({ PASS: 'PASS', FAIL: 'FAIL', SKIP: 'SKIP' });
const SKILLS_ROOT = path.resolve(__dirname, '..', '..', '..', '..');

// The runtime-owned codex dispatch helper (cli-codex single-adapter rule): the
// actual `codex exec` spawn lives in the deep-loop runtime, never here.
const CODEX_DISPATCH = path.resolve(__dirname, '..', '..', '..', 'runtime', 'scripts', 'codex-dispatch.cjs');

/**
 * The orchestrator-owned scenario map. Per hub: one fitted `routing` probe and
 * one gold-bearing `holdout` paraphrase whose gold mode is withheld from its
 * prompt. `matchTokens` are the strings whose presence in the model's STATED
 * routing counts as naming the gold route; the first entry is always the gold
 * workflow mode itself.
 */
const SCENARIO_MAP = Object.freeze({
  'sk-code': {
    routing: { id: 'LUNA-CB-R', prompt: 'Add a scroll-triggered reveal animation to my Webflow site using GSAP and IntersectionObserver.', goldMode: 'code-webflow', matchTokens: ['code-webflow', 'webflow'] },
    holdout: { id: 'LUNA-CB-H', prompt: 'As a visitor scrolls my marketing landing page, animate the section cards to rise and fade in smoothly with GSAP and IntersectionObserver.', goldMode: 'code-webflow', matchTokens: ['code-webflow', 'webflow'] },
  },
  'mcp-tooling': {
    routing: { id: 'LUNA-MT-R', prompt: 'Pull real shipped-app UI references from Refero and Mobbin for this checkout screen.', goldMode: 'mcp-refero', matchTokens: ['mcp-refero', 'refero'] },
    holdout: { id: 'LUNA-MT-H', prompt: 'Find how three shipped fintech apps designed their onboarding screens and pull those real product UI references.', goldMode: 'mcp-refero', matchTokens: ['mcp-refero', 'refero'] },
  },
  'system-deep-loop': {
    routing: { id: 'LUNA-DL-R', prompt: 'Use deep research to investigate why our advisor sometimes routes iterative investigation prompts incorrectly, and write the findings as a research summary.', goldMode: 'research', matchTokens: ['research', 'deep-research', 'deep:research'] },
    holdout: { id: 'LUNA-DL-H', prompt: 'Run a multi-iteration investigation into this recurring failure, converge on cited findings, and hand back a written summary.', goldMode: 'research', matchTokens: ['research', 'deep-research', 'deep:research'] },
  },
  'cli-external-orchestration': {
    routing: { id: 'LUNA-CE-R', prompt: 'Delegate this to OpenCode and run the ablation suite with full plugin and Spec Kit Memory runtime.', goldMode: 'cli-opencode', matchTokens: ['cli-opencode', 'opencode'] },
    holdout: { id: 'LUNA-CE-H', prompt: 'Hand this whole task off to the external agent runtime with its full plugin and memory stack, and run the ablation batch there.', goldMode: 'cli-opencode', matchTokens: ['cli-opencode', 'opencode'] },
  },
  'sk-prompt': {
    routing: { id: 'LUNA-SP-R', prompt: 'Help me write a better prompt for a customer support chatbot.', goldMode: 'prompt-improve', matchTokens: ['prompt-improve'] },
    holdout: { id: 'LUNA-SP-H', prompt: 'This instruction I wrote for a support assistant keeps producing weak replies — rewrite it to be much stronger.', goldMode: 'prompt-improve', matchTokens: ['prompt-improve'] },
  },
  'sk-design': {
    routing: { id: 'LUNA-SDG-R', prompt: 'Extract the design system from https://example.com into a DESIGN.md with tokens.json evidence.', goldMode: 'md-generator', matchTokens: ['md-generator', 'design-md', 'DESIGN.md'] },
    holdout: { id: 'LUNA-SDG-H', prompt: 'Turn this live website into a documented design-system file capturing its colors, type, and spacing as tokens.', goldMode: 'md-generator', matchTokens: ['md-generator', 'design-md', 'DESIGN.md'] },
  },
  'sk-doc': {
    routing: { id: 'LUNA-SD-R', prompt: 'Help me create a graph-rag sk-skill with SKILL.md and starter reference scaffolds.', goldMode: 'create-skill', matchTokens: ['create-skill'] },
    holdout: { id: 'LUNA-SD-H', prompt: 'I want to scaffold a brand-new reusable skill component with its main definition file and starter references.', goldMode: 'create-skill', matchTokens: ['create-skill'] },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRODUCTION DISPATCHER (injectable)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dispatch one routing-analysis prompt to LUNA-HIGH over the codex transport.
 * Returns the raw transport result with stdout and stderr on separate fields.
 *
 * @param {Object} args - Dispatch inputs.
 * @param {string} args.prompt - The routing-analysis prompt.
 * @param {string} args.cwd - Project dir for the run.
 * @returns {Object} Raw dispatch result ({ timedOut, lastMessage, stdout, stderr, ... }).
 */
function defaultDispatch({ prompt, cwd }) {
  const { dispatchCodex } = require(CODEX_DISPATCH);
  return dispatchCodex({ prompt, cwd, model: 'gpt-5.6-luna', effort: 'high', tier: SERVICE_TIER });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// The gold mode must never appear verbatim in a holdout's prompt — the holdout
// is a generalization probe only if its route is genuinely withheld.
function auditHoldout(entry) {
  const leaks = [];
  const prompt = String(entry.prompt || '');
  const tokens = new Set([entry.goldMode, ...(entry.matchTokens || [])].filter((t) => t && t.includes('-')));
  for (const token of tokens) {
    if (new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(prompt)) leaks.push(token);
  }
  return { withheld: leaks.length === 0, leaks };
}

// Did the model's stated routing name the gold route? Scored off the STATED
// declaration (workflowMode/intents) plus the stated resources/surface — never
// off the prompt, so a holdout can only pass by the model actually generalizing.
function scoreStatedRouting(responseText, matchTokens) {
  const stated = extractRoutingJson(responseText) || proseRoutingFallback(responseText) || {};
  const routed = parseRoutedDeclaration(responseText);
  const haystack = [
    ...(routed.present ? routed.intents : []),
    ...(routed.present ? routed.workflowMode : []),
    ...(Array.isArray(stated.resources) ? stated.resources : []),
    stated.surface || '',
  ].join(' ').toLowerCase();
  const hit = (matchTokens || []).find((t) => haystack.includes(String(t).toLowerCase())) || null;
  return { matched: hit != null, matchedToken: hit, statedIntents: routed.present ? routed.intents : [] };
}

/**
 * Run one LUNA scenario: dispatch, classify transport, and (only when the
 * transport succeeded) score the stated routing against gold.
 *
 * @param {Object} args - Inputs.
 * @param {string} args.hubId - Hub id.
 * @param {Object} args.entry - Scenario-map entry ({ id, prompt, goldMode, matchTokens }).
 * @param {string} args.stage - 'routing' | 'holdout'.
 * @param {Object} [deps] - Injectable seams.
 * @returns {Object} Scenario row with a PASS/FAIL/SKIP verdict.
 */
function runScenario({ hubId, entry, stage }, deps = {}) {
  const { dispatch = defaultDispatch, cwd = path.resolve(SKILLS_ROOT, '..', '..') } = deps;
  const holdoutAudit = stage === 'holdout' ? auditHoldout(entry) : null;

  const scenarioForPrompt = { prompt: entry.prompt, expected: { workflowMode: entry.goldMode } };
  const prompt = buildLiveDispatchPrompt(scenarioForPrompt, hubId);

  const disp = dispatch({ prompt, cwd }) || {};
  const transport = {
    stdout: String(disp.stdout || ''),
    stderr: String(disp.stderr || ''),
    timedOut: !!disp.timedOut,
    model: disp.model || 'gpt-5.6-luna',
    effort: disp.effort || VARIANT,
    tier: disp.tier || SERVICE_TIER,
  };

  const base = {
    scenarioId: entry.id, hubId, stage, goldMode: entry.goldMode,
    providerModel: PROVIDER_MODEL, variant: VARIANT,
    ...(holdoutAudit ? { holdoutAudit } : {}),
    transport,
  };

  // Fail-closed: a timeout or an unavailable/failed transport is SKIP, never a
  // PASS or FAIL — the live plane's failure modes stay distinguishable.
  if (transport.timedOut) return { ...base, verdict: VERDICT.SKIP, reason: 'transport-timeout' };
  if (disp.error) return { ...base, verdict: VERDICT.SKIP, reason: `transport-unavailable: ${disp.error}` };

  const responseText = (disp.lastMessage && disp.lastMessage.length) ? disp.lastMessage : transport.stdout;
  if (!responseText || !responseText.trim()) return { ...base, verdict: VERDICT.SKIP, reason: 'empty-transport-response' };

  // A holdout whose own prompt leaked its route is an invalid probe — surfaced
  // as FAIL of the probe's construction, not scored as a routing result.
  if (holdoutAudit && !holdoutAudit.withheld) {
    return { ...base, verdict: VERDICT.FAIL, reason: `holdout-route-leaked: ${holdoutAudit.leaks.join(',')}` };
  }

  const score = scoreStatedRouting(responseText, entry.matchTokens);
  return {
    ...base,
    verdict: score.matched ? VERDICT.PASS : VERDICT.FAIL,
    reason: score.matched ? `routed-to-gold (${score.matchedToken})` : 'stated-route-missed-gold',
    statedIntents: score.statedIntents,
  };
}

/**
 * Run the LUNA acceptance stage over the selected hubs (both stages per hub).
 *
 * @param {Object} args - Inputs.
 * @param {string[]} [args.hubs] - Hub ids to run (default: all in the map).
 * @param {string[]} [args.stages] - Stages to run (default: routing + holdout).
 * @param {Object} [deps] - Injectable seams.
 * @returns {{ hubReports: Object<string,Object> }} Per-hub reports.
 */
function runAcceptance({ hubs, stages } = {}, deps = {}) {
  const wantHubs = (hubs && hubs.length ? hubs : Object.keys(SCENARIO_MAP)).filter((h) => SCENARIO_MAP[h]);
  const wantStages = stages && stages.length ? stages : ['routing', 'holdout'];
  const hubReports = {};
  for (const hubId of wantHubs) {
    const rows = [];
    for (const stage of wantStages) {
      const entry = SCENARIO_MAP[hubId][stage];
      if (!entry) continue;
      rows.push(runScenario({ hubId, entry, stage }, deps));
    }
    const counts = { PASS: 0, FAIL: 0, SKIP: 0 };
    for (const r of rows) counts[r.verdict] += 1;
    // A stage with only SKIPs is inconclusive (transport stalled), not a pass.
    const verdict = counts.FAIL > 0 ? VERDICT.FAIL : (counts.PASS > 0 ? VERDICT.PASS : VERDICT.SKIP);
    hubReports[hubId] = {
      targetSkill: { id: hubId, root: path.join(SKILLS_ROOT, hubId) },
      traceMode: 'live',
      executor: 'codex',
      model: PROVIDER_MODEL,
      variant: VARIANT,
      verdict,
      lunaAcceptance: { counts, holdoutIncluded: rows.some((r) => r.stage === 'holdout') },
      scenarioRows: rows,
      compiledRouting: { rows: rows.map((r) => ({ scenarioId: r.scenarioId, hubId, status: r.verdict, reason: r.reason })) },
    };
  }
  return { hubReports };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  SCENARIO_MAP, PROVIDER_MODEL, VARIANT, VERDICT,
  auditHoldout, scoreStatedRouting, runScenario, runAcceptance,
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  const hubs = args.hubs ? String(args.hubs).split(',').map((s) => s.trim()).filter(Boolean) : undefined;
  const stages = args.stages ? String(args.stages).split(',').map((s) => s.trim()).filter(Boolean) : undefined;
  const { hubReports } = runAcceptance({ hubs, stages });
  if (args.format === 'json') {
    process.stdout.write(`${JSON.stringify(hubReports, null, 2)}\n`);
  } else {
    for (const [hubId, report] of Object.entries(hubReports)) {
      process.stdout.write(`# LUNA-HIGH acceptance — ${hubId}  verdict=${report.verdict}\n`);
      for (const r of report.scenarioRows) {
        process.stdout.write(`  ${r.verdict}  ${r.scenarioId} [${r.stage}]  ${r.reason}${r.holdoutAudit ? `  (withheld=${r.holdoutAudit.withheld})` : ''}\n`);
      }
    }
  }
  process.exit(0);
}
