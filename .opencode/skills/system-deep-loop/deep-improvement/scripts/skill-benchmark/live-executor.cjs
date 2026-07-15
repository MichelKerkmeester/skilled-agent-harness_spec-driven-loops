#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ live-executor — Mode B live executor (cli-opencode)                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
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

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_MODEL = process.env.SKILL_BENCH_OPENCODE_MODEL || 'deepseek/deepseek-v4-pro';
const DEFAULT_VARIANT = process.env.SKILL_BENCH_OPENCODE_VARIANT || 'high';
const OPENCODE_BIN = process.env.OPENCODE_BIN || 'opencode';
const DISPATCH_TIMEOUT_MS = Number(process.env.SKILL_BENCH_DISPATCH_TIMEOUT_MS || 360000);
const GRADED_RESPONSE_MAX_CHARS = 8000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrap the scenario prompt as a routing-ANALYSIS task with a strict output
 * contract. CS-* scenarios are already analysis-shaped; SD/LS/RD/SA get the
 * reframe. Route-gold cases add a declaration line before the fenced json block
 * the parser can read.
 *
 * @param {Object} scenario - Scenario being dispatched.
 * @returns {string} The routing-analysis dispatch prompt.
 */
function buildLiveDispatchPrompt(scenario, skillId) {
  const base = scenario.prompt || '';
  const skill = skillId || 'the target skill';
  const prompt = [
    'You are analyzing skill routing only - do NOT edit files.',
    `Task: ${base}`,
    '',
    `Within the \`${skill}\` skill ONLY (do not route to or read any other skill), `
      + "consulting that skill's SKILL.md router, determine: (1) the detected SURFACE "
      + 'if the skill defines one (e.g. WEBFLOW / OPENCODE), else "UNKNOWN", (2) the '
      + 'sub-language if any, else "none", (3) the exact reference/asset file paths you '
      + 'would load (relative to the skill root, e.g. references/... and assets/...), '
      + '(4) the agent you would dispatch, or "none".',
  ];

  if (hasRouteGold(scenario && scenario.expected)) {
    prompt.push(
      'As the FIRST line of your answer, emit this exact declaration shape:',
      'ROUTED: {"workflowMode": "<mode>", "intents": ["<mode>", "..."]}',
      'Then emit ONLY a fenced ```json code block, nothing after it:',
    );
  } else {
    prompt.push('Then emit ONLY a fenced ```json code block, nothing after it:');
  }

  prompt.push(
    '{"surface": "...", "subLanguage": "...", "resources": ["references/..."], '
      + '"assets": ["assets/..."], "agent": "none", "disambiguation": false}',
  );

  return prompt.join('\n');
}

function dispatchArgs(model, dir, variant) {
  const args = ['run', '--model', model];
  // No explicit --agent: on this opencode build `general` is classified as a
  // subagent (warns + falls back), and MiniMax rejects --agent outright. The
  // default primary agent loads skills fine for a routing-analysis dispatch.
  // Reasoning effort (provider-specific, e.g. high/max). Forwarded for all
  // models, including MiniMax-M3 which accepts --variant and would otherwise
  // silently lose its reasoning-effort setting.
  if (variant) args.push('--variant', variant);
  args.push('--format', 'json', '--dir', dir);
  return args;
}

/**
 * Run one `opencode run` dispatch via spawnSync and capture its streams.
 *
 * @param {Object} args - Dispatch inputs.
 * @param {string} args.prompt - Prompt to send to the model.
 * @param {string} args.dir - Working directory / project dir for the run.
 * @param {string} args.model - Model id to dispatch.
 * @param {string} args.variant - Reasoning-effort variant.
 * @param {Object} [args.extraEnv] - Extra environment variables to inject.
 * @returns {{ status:number, stdout:string, stderr:string, timedOut:boolean }}
 */
function runDispatch({ prompt, dir, model, variant, extraEnv }) {
  model = model || DEFAULT_MODEL;
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

/**
 * Collect brace-balanced object candidates from prose.
 *
 * @param {string} text - Text to scan for JSON-looking objects.
 * @returns {Array<string>} Complete object substrings in encounter order.
 */
function collectBraceBalancedObjects(text) {
  const candidates = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{') {
      if (depth === 0) start = i;
      depth += 1;
    } else if (ch === '}' && depth > 0) {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        candidates.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return candidates;
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

/**
 * Cross-model robust extraction of the stated-routing JSON. Models vary: some
 * emit ```json fences (MiniMax), some plain ``` fences or none (gpt-5.5). Try,
 * in order: any-tag fenced block, then a bare brace-balanced object mentioning
 * "surface". Returns the LAST valid routing object (models often restate).
 *
 * @param {string} text - The model's response text to scan.
 * @returns {Object|null} The recovered routing object, or null if none found.
 */
function extractRoutingJson(text) {
  const s = String(text);
  const isRouting = (j) => j && typeof j === 'object' && ('surface' in j || 'resources' in j);
  const fences = [...s.matchAll(/```[a-z]*\s*([\s\S]*?)```/gi)];
  for (let i = fences.length - 1; i >= 0; i -= 1) {
    try { const j = JSON.parse(fences[i][1].trim()); if (isRouting(j)) return j; } catch { /* next */ }
  }
  // Bare object: collect balanced candidates so nested routing payloads parse.
  const objs = collectBraceBalancedObjects(s);
  for (let i = objs.length - 1; i >= 0; i -= 1) {
    if (!/surface/i.test(objs[i])) continue;
    try { const j = JSON.parse(objs[i]); if (isRouting(j)) return j; } catch { /* next */ }
  }
  return null;
}

function normalizeStringList(value) {
  const list = Array.isArray(value) ? value : [value];
  return [...new Set(list
    .filter((entry) => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter(Boolean))];
}

/**
 * Extract the live route declaration emitted before the routing-analysis block.
 * Returns the last valid declaration because models sometimes restate answers.
 *
 * @param {string} text - The model's response text to scan.
 * @returns {Object} Parsed declaration metadata.
 */
function parseRoutedDeclaration(text) {
  const s = String(text);
  const matches = [...s.matchAll(/(^|\n)\s*ROUTED:\s*/gi)];
  let last = null;

  for (const match of matches) {
    const afterPrefix = match.index + match[0].length;
    const rest = s.slice(afterPrefix);
    const firstNonSpace = /\S/.exec(rest);
    if (!firstNonSpace || rest[firstNonSpace.index] !== '{') continue;

    const objs = collectBraceBalancedObjects(rest.slice(firstNonSpace.index));
    if (objs.length === 0) continue;

    try {
      const declaration = JSON.parse(objs[0]);
      if (!declaration || typeof declaration !== 'object') continue;

      const workflowMode = normalizeStringList(declaration.workflowMode);
      let intents = normalizeStringList(declaration.intents);
      if (intents.length === 0 && workflowMode.length > 0) intents = workflowMode;
      if (workflowMode.length === 0 && intents.length === 0) continue;

      last = {
        present: true,
        workflowMode: workflowMode.length > 0 ? workflowMode : intents,
        intents,
      };
    } catch (_) {
      // Malformed declarations are treated as absent.
    }
  }

  return last || { present: false };
}

/**
 * Last-resort prose fallback: when the model answered in prose with no JSON,
 * recover the surface keyword and any referenced skill paths so the run still
 * yields a (lower-confidence) signal instead of a null.
 *
 * @param {string} text - The model's prose response text.
 * @returns {Object|null} Recovered routing-like object, or null if nothing found.
 */
function proseRoutingFallback(text) {
  const s = String(text);
  const surfM = /\b(WEBFLOW|OPENCODE|UNKNOWN|MOTION_DEV)\b/.exec(s.toUpperCase());
  const resources = [...new Set((s.match(/(?:code-[a-z]+|references|assets)\/[A-Za-z0-9_./-]+\.[a-z]{1,4}/g) || []))];
  if (!surfM && resources.length === 0) return null;
  return { surface: surfM ? surfM[1] : null, resources, assets: [], _recovered: 'prose' };
}

/**
 * Parse the live NDJSON event stream into the normalized observed result.
 *
 * @param {string} stdout - Raw NDJSON stdout from the dispatch.
 * @param {Object} [opts] - Parse options.
 * @param {string} [opts.skillId] - Skill id used to detect activation/reads.
 * @param {boolean} [opts.requireRouteDeclaration] - Mark route-gold misses.
 * @returns observed-result consumed by score-skill-benchmark.scoreScenario
 */
function parseLiveResult(stdout, { skillId, requireRouteDeclaration = false } = {}) {
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
          const m = blob.match(/(?:code-[a-z]+|references|assets)\/[A-Za-z0-9_./*-]+/g);
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
  const routed = parseRoutedDeclaration(responseText);

  const result = {
    mode: 'live',
    parseable: events.length > 0,
    observedIntents: routed.present ? routed.intents : [],
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
    raw: { eventCount: events.length, toolCalls, observedReads: [...new Set(observedReads)], stated, responseText: responseText.slice(0, GRADED_RESPONSE_MAX_CHARS) },
  };

  if (routed.present) {
    result.observedWorkflowMode = routed.workflowMode.length === 1 ? routed.workflowMode[0] : routed.workflowMode;
    result.routeDeclaration = { present: true };
    result.raw.routeTelemetry = {
      observed: true,
      source: 'live-declaration',
      workflowMode: routed.workflowMode,
    };
  } else if (requireRouteDeclaration) {
    result.routeDeclaration = { present: false, reason: 'route-declaration-missing' };
    result.raw.routeTelemetry = { observed: false, reason: 'route-declaration-missing' };
  }

  return result;
}

function hasRouteGold(expected) {
  return !!(expected && (expected.routeOutcome != null || expected.workflowMode != null));
}

/**
 * Executor entrypoint called by executor-dispatch.cjs (live branch).
 *
 * @param {Object} [args] - Scenario inputs.
 * @param {Object} args.scenario - Scenario to run live.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @param {string} [args.model] - Optional model override (defaults to DEFAULT_MODEL).
 * @returns {Object} Normalized observed-result for the scorer.
 */
function runLiveScenario({ scenario, skillRoot, model } = {}) {
  const skillId = path.basename(skillRoot || '');
  const prompt = buildLiveDispatchPrompt(scenario, skillId);
  const chosenModel = model || DEFAULT_MODEL;
  const requireRouteDeclaration = hasRouteGold(scenario && scenario.expected);
  const disp = runDispatch({ prompt, dir: skillRoot ? path.resolve(skillRoot, '..', '..', '..') : process.cwd(), model: chosenModel, variant: DEFAULT_VARIANT });
  if (disp.status !== 0) {
    const result = {
      mode: 'live', parseable: false, observedIntents: [], observedResources: [],
      observedSurface: null, statedRoutingCorrect: null, activation: { activated: false, topSkill: null },
      missingResources: [],
      error: disp.timedOut ? 'dispatch timed out' : `dispatch exit ${disp.status}`,
      raw: { stderr: (disp.stderr || '').slice(0, 500), model: chosenModel },
    };
    if (requireRouteDeclaration) {
      result.routeDeclaration = { present: false, reason: 'dispatch-failed' };
      result.raw.routeTelemetry = { observed: false, reason: 'dispatch-failed' };
    }
    return result;
  }
  const result = parseLiveResult(disp.stdout, { skillId, requireRouteDeclaration });
  result.raw.model = chosenModel;
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { runLiveScenario, parseLiveResult, buildLiveDispatchPrompt, runDispatch, extractRoutingJson, proseRoutingFallback, parseRoutedDeclaration, collectBraceBalancedObjects, hasRouteGold, DEFAULT_MODEL, DEFAULT_VARIANT };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (args['parse-file']) {
    const out = parseLiveResult(fs.readFileSync(args['parse-file'], 'utf8'), { skillId: args.skill || 'sk-code', requireRouteDeclaration: args['require-route'] === true });
    process.stdout.write(JSON.stringify(out, null, 2) + '\n');
    process.exit(0);
  }
  process.stderr.write('usage: live-executor.cjs --parse-file <ndjson> [--skill <id>] [--require-route]\n');
  process.exit(2);
}
