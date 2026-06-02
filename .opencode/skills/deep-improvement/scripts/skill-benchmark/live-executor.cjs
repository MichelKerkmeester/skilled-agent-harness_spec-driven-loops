#!/usr/bin/env node
'use strict';

/**
 * live-executor.cjs — Mode B live executor (cli-opencode).
 *
 * Runs a playbook routing/advisor scenario through a real `opencode run` and
 * reads back what actually happened, normalized into the observed-result shape
 * the scorer consumes. Validated against the live event schema (see the Phase 0
 * spike): NDJSON events of shape { type, timestamp, sessionID, part }, where
 *   - tool_use:  part.tool (e.g. "skill","read","glob","grep","bash"),
 *                part.state.input, part.state.output
 *   - text:      part.text  (the model's final answer)
 *
 * KEY observability fact: opencode emits no startup "resources loaded" manifest.
 * So we run scenarios as routing-ANALYSIS prompts — the model STATES its routing
 * in a fenced JSON block, which we grade against gold. tool_use events
 * corroborate (a `skill` call with input.name === skillId is hard activation
 * evidence; read/glob/grep on the skill's tree is observed discovery).
 *
 * Self-contained dispatch (does not reuse dispatch-model.cjs): MiniMax models
 * reject `--agent`, which that helper hardcodes, and we need `--format json`.
 * Model + binary come from env so no machine-specific id is baked in.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const DEFAULT_MODEL = process.env.SKILL_BENCH_OPENCODE_MODEL || 'opencode-go/deepseek-v4-pro';
const DEFAULT_VARIANT = process.env.SKILL_BENCH_OPENCODE_VARIANT || 'high';
const OPENCODE_BIN = process.env.OPENCODE_BIN || 'opencode';
const DISPATCH_TIMEOUT_MS = Number(process.env.SKILL_BENCH_DISPATCH_TIMEOUT_MS || 360000);

// Wrap the scenario prompt as a routing-ANALYSIS task with a strict output
// contract. CS-* scenarios are already analysis-shaped; SD/LS/RD/SA get the
// reframe. The contract forces one fenced json block the parser can read.
function buildLiveDispatchPrompt(scenario) {
  const base = scenario.prompt || '';
  return [
    'You are analyzing skill routing only - do NOT edit files.',
    `Task: ${base}`,
    '',
    'Using the project code skill, determine: (1) the detected SURFACE '
      + '(WEBFLOW / OPENCODE / UNKNOWN), (2) the OPENCODE sub-language if any, '
      + '(3) the exact reference/asset file paths you would load (relative to the '
      + 'skill root, e.g. references/... and assets/...), (4) the agent you would '
      + 'dispatch, or "none".',
    'Then emit ONLY a fenced ```json code block, nothing after it:',
    '{"surface": "...", "subLanguage": "...", "resources": ["references/..."], '
      + '"assets": ["assets/..."], "agent": "none", "disambiguation": false}',
  ].join('\n');
}

function dispatchArgs(model, dir, variant) {
  const args = ['run', '--model', model];
  // No explicit --agent: on this opencode build `general` is classified as a
  // subagent (warns + falls back), and MiniMax rejects --agent outright. The
  // default primary agent loads skills fine for a routing-analysis dispatch.
  // Reasoning effort (provider-specific, e.g. high/max). MiniMax highspeed
  // ignores variants; skip it there to avoid a rejected flag.
  if (variant && !/minimax/i.test(model)) args.push('--variant', variant);
  args.push('--format', 'json', '--dir', dir);
  return args;
}

function runDispatch({ prompt, dir, model, variant, extraEnv }) {
  const res = spawnSync(OPENCODE_BIN, [...dispatchArgs(model, dir, variant), prompt], {
    cwd: dir,
    stdio: ['ignore', 'pipe', 'pipe'], // closed stdin == the mandatory </dev/null
    encoding: 'utf8',
    timeout: DISPATCH_TIMEOUT_MS,
    maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, AI_SESSION_CHILD: '1', ...(extraEnv || {}) },
  });
  return { status: res.status, stdout: res.stdout || '', stderr: res.stderr || '', timedOut: res.signal === 'SIGTERM' };
}

function parseEvents(stdout) {
  const events = [];
  for (const line of String(stdout).split('\n')) {
    const t = line.trim();
    if (!t) continue;
    try { events.push(JSON.parse(t)); } catch { /* tolerate non-JSON log lines */ }
  }
  return events;
}

// Cross-model robust extraction of the stated-routing JSON. Models vary: some
// emit ```json fences (MiniMax), some plain ``` fences or none (gpt-5.5). Try,
// in order: any-tag fenced block, then a bare brace-balanced object mentioning
// "surface". Returns the LAST valid routing object (models often restate).
function extractRoutingJson(text) {
  const s = String(text);
  const isRouting = (j) => j && typeof j === 'object' && ('surface' in j || 'resources' in j);
  const fences = [...s.matchAll(/```[a-z]*\s*([\s\S]*?)```/gi)];
  for (let i = fences.length - 1; i >= 0; i -= 1) {
    try { const j = JSON.parse(fences[i][1].trim()); if (isRouting(j)) return j; } catch { /* next */ }
  }
  // Bare object (routing JSON has no nested objects — arrays use []), pick the
  // last one that mentions a surface key.
  const objs = [...s.matchAll(/\{[^{}]*\}/g)];
  for (let i = objs.length - 1; i >= 0; i -= 1) {
    if (!/surface/i.test(objs[i][0])) continue;
    try { const j = JSON.parse(objs[i][0]); if (isRouting(j)) return j; } catch { /* next */ }
  }
  return null;
}

// Last-resort prose fallback: when the model answered in prose with no JSON,
// recover the surface keyword and any referenced skill paths so the run still
// yields a (lower-confidence) signal instead of a null.
function proseRoutingFallback(text) {
  const s = String(text);
  const surfM = /\b(WEBFLOW|OPENCODE|UNKNOWN|MOTION_DEV)\b/.exec(s.toUpperCase());
  const resources = [...new Set((s.match(/(?:references|assets)\/[A-Za-z0-9_./-]+\.[a-z]{1,4}/g) || []))];
  if (!surfM && resources.length === 0) return null;
  return { surface: surfM ? surfM[1] : null, resources, assets: [], _recovered: 'prose' };
}

/**
 * Parse the live NDJSON event stream into the normalized observed result.
 * @returns observed-result consumed by score-skill-benchmark.scoreScenario
 */
function parseLiveResult(stdout, { skillId } = {}) {
  const events = parseEvents(stdout);
  const toolCalls = [];
  let activated = false;
  const observedReads = [];
  const textParts = [];

  for (const e of events) {
    const p = e && e.part;
    if (e && e.type === 'text' && p && typeof p.text === 'string') textParts.push(p.text);
    if (e && e.type === 'tool_use' && p && p.tool) {
      const input = (p.state && p.state.input) || {};
      toolCalls.push({ tool: p.tool, input });
      if (p.tool === 'skill' && skillId && input.name === skillId) activated = true;
      if (/^(read|glob|grep|bash)$/i.test(p.tool)) {
        const blob = JSON.stringify(input);
        if (skillId && blob.includes(skillId)) {
          const m = blob.match(/(?:references|assets)\/[A-Za-z0-9_./*-]+/g);
          if (m) observedReads.push(...m);
        }
      }
    }
  }

  const responseText = textParts.join('');
  const stated = extractRoutingJson(responseText) || proseRoutingFallback(responseText) || {};
  const statedResources = Array.isArray(stated.resources) ? stated.resources : [];
  const statedAssets = Array.isArray(stated.assets) ? stated.assets : [];
  const surfaceRaw = (stated.surface || '').toString().toUpperCase();
  const statedSurface = ['WEBFLOW', 'OPENCODE', 'UNKNOWN', 'MOTION_DEV', 'NONE'].includes(surfaceRaw) ? surfaceRaw : null;

  return {
    mode: 'live',
    parseable: events.length > 0,
    observedIntents: [],
    // The model's STATED routing is the primary discovery signal; observed file
    // reads corroborate. References and assets are kept on SEPARATE channels:
    // D2/D3 score references only, asset support is scored on its own lane. The
    // router defers assets on demand, so counting a stated, useful asset as a
    // routed reference made it read as efficiency waste — a measurement artifact.
    observedResources: [...new Set(statedResources)],
    observedAssets: [...new Set(statedAssets)],
    observedSurface: statedSurface,
    statedRoutingCorrect: null,
    activation: { activated, topSkill: activated ? skillId : null },
    missingResources: [],
    raw: { eventCount: events.length, toolCalls, observedReads: [...new Set(observedReads)], stated, responseText: responseText.slice(0, 2000) },
  };
}

/**
 * Executor entrypoint called by executor-dispatch.cjs (live branch).
 */
function runLiveScenario({ scenario, skillRoot, model } = {}) {
  const skillId = path.basename(skillRoot || '');
  const prompt = buildLiveDispatchPrompt(scenario);
  const chosenModel = model || DEFAULT_MODEL;
  const disp = runDispatch({ prompt, dir: skillRoot ? path.resolve(skillRoot, '..', '..', '..') : process.cwd(), model: chosenModel, variant: DEFAULT_VARIANT });
  if (disp.status !== 0) {
    return {
      mode: 'live', parseable: false, observedIntents: [], observedResources: [],
      observedSurface: null, statedRoutingCorrect: null, activation: { activated: false, topSkill: null },
      missingResources: [],
      error: disp.timedOut ? 'dispatch timed out' : `dispatch exit ${disp.status}`,
      raw: { stderr: (disp.stderr || '').slice(0, 500), model: chosenModel },
    };
  }
  const result = parseLiveResult(disp.stdout, { skillId });
  result.raw.model = chosenModel;
  return result;
}

module.exports = { runLiveScenario, parseLiveResult, buildLiveDispatchPrompt, runDispatch, extractRoutingJson, proseRoutingFallback, DEFAULT_MODEL, DEFAULT_VARIANT };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (args['parse-file']) {
    const out = parseLiveResult(fs.readFileSync(args['parse-file'], 'utf8'), { skillId: args.skill || 'sk-code' });
    process.stdout.write(JSON.stringify(out, null, 2) + '\n');
    process.exit(0);
  }
  process.stderr.write('usage: live-executor.cjs --parse-file <ndjson> [--skill <id>]\n');
  process.exit(2);
}
