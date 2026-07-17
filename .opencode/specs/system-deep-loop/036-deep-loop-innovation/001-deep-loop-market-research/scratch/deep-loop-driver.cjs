#!/usr/bin/env node
'use strict';
/**
 * Manual deep-research loop driver (Shape B, hand-rolled) for packet
 * 065-deep-loop-innovation / 001-deep-loop-market-research.
 *
 * WHY manual instead of the /deep:research fan-out loop: the fan-out codex
 * executor builds its command without codex's top-level `--search` flag, so its
 * leaves have no live web access and cannot mine real GitHub repos — the core
 * requirement of this phase. Patching that executor is out of scope (research
 * only; zero writes outside this spec folder). The operator authorized a manual
 * cli-codex / cli-opencode loop. This driver IS that loop: it dispatches one
 * iteration at a time, accumulates a deduped findings registry so each iteration
 * broadens (divergent) instead of repeating, and emits the same state artifacts
 * the loop would (config, state JSONL, registry, per-iteration files, dashboard)
 * so the phase's acceptance criteria still validate.
 *
 * Transport rules honored: GPT (luna/sol) ONLY via cli-codex `codex --search
 * exec`; GLM via cli-opencode `opencode run`. Codex `--search` is top-level and
 * MUST precede `exec`. opencode run gets closed stdin, AI_SESSION_CHILD=1 and
 * MK_SPEC_GATE_ENFORCE=0, and is never blanket-killed.
 *
 * Usage:
 *   node deep-loop-driver.cjs --count <N>          run the next N scheduled iterations
 *   node deep-loop-driver.cjs --count 1 --dry-run  print the next prompt, dispatch nothing
 * Resumes from the last successful iteration in the state JSONL.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const SPEC = path.join(ROOT, '.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research');
const RESEARCH = path.join(SPEC, 'research');
const ITERDIR = path.join(RESEARCH, 'iterations');
const SCRATCH = path.join(SPEC, 'scratch');
const STATE = path.join(RESEARCH, 'deep-research-state.jsonl');
const REGISTRY = path.join(RESEARCH, 'findings-registry.json');
const CONFIG = path.join(RESEARCH, 'deep-research-config.json');
const DASH = path.join(RESEARCH, 'deep-research-dashboard.md');
const ERRLOG = path.join(RESEARCH, 'driver-errors.log');
const SCHEDULE = path.join(SCRATCH, 'angle-schedule.json');

const TOTAL = 45;
const TIMEOUT_MS = 480 * 1000;          // 8 min per iteration
const INTER_ITER_SLEEP_MS = 6 * 1000;   // gentle on the shared OAuth
const MAX_RETRIES = 2;                   // transient (rate-limit/timeout) only
const BACKOFF_MS = [20000, 60000];       // retry backoff

const MODELS = {
  luna: { kind: 'codex', model: 'gpt-5.6-luna', reasoning: 'max' },
  sol:  { kind: 'codex', model: 'gpt-5.6-sol', reasoning: 'ultra' },
  glm:  { kind: 'opencode', model: 'zai-coding-plan/glm-5.2', variant: 'max' },
};

const SUBSYSTEMS = [
  'deep-research', 'deep-review', 'deep-ai-council', 'deep-improvement', 'deep-alignment',
  'runtime/convergence', 'runtime/fan-out-fan-in', 'runtime/dedup-novelty',
  'runtime/gauges-observability', 'runtime/state-jsonl-checkpointing',
  'runtime/budget-cost', 'runtime/locks-recovery', 'runtime/continuity-threading',
];

// ---------- small utils ----------
function sleep(ms) { spawnSync('sleep', [String(Math.max(0, ms) / 1000)]); } // blocking; serial driver
function ensureDirs() { for (const d of [RESEARCH, ITERDIR]) fs.mkdirSync(d, { recursive: true }); }
function loadJSON(p, fallback) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; } }
function saveJSON(p, o) { fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n'); }
function nowStamp() { return new Date().toISOString(); }

function loadState() {
  if (!fs.existsSync(STATE)) return [];
  return fs.readFileSync(STATE, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}
function appendState(obj) { fs.appendFileSync(STATE, JSON.stringify(obj) + '\n'); }
function logErr(msg) { fs.appendFileSync(ERRLOG, `[${nowStamp()}] ${msg}\n`); }

function emptyRegistry() { return { repos: {}, insights: [], contradictions: [], anglesCovered: [], nextAngleSuggestions: [] }; }
function loadRegistry() { return loadJSON(REGISTRY, emptyRegistry()); }
function normKey(s) { return String(s || '').trim().toLowerCase().replace(/\/+$/, '').replace(/^https?:\/\/(www\.)?/, ''); }

// ---------- config init (born at execution — never pre-scaffolded) ----------
function initConfigIfNeeded() {
  if (fs.existsSync(CONFIG)) return;
  saveJSON(CONFIG, {
    run: 'manual-shape-b',
    note: 'Hand-rolled realization of the plan.md Shape B (sequential generations, findings-seeded). Runs because the fan-out codex executor cannot pass codex top-level --search; patching it is out of scope. See decision-record ADR-002.',
    max_iterations: TOTAL,
    stop_policy: 'max-iterations',
    convergence_mode: 'divergent',
    generations: [
      { label: 'luna', kind: 'cli-codex', model: 'gpt-5.6-luna', reasoningEffort: 'max', serviceTier: 'fast', iterations: 25 },
      { label: 'sol', kind: 'cli-codex', model: 'gpt-5.6-sol', reasoningEffort: 'ultra', serviceTier: 'fast', iterations: 10 },
      { label: 'glm', kind: 'cli-opencode', model: 'zai-coding-plan/glm-5.2', variant: 'max', iterations: 10 },
    ],
    web_search: 'codex top-level --search (live GitHub/web mining); opencode native browsing',
    transport_mandate: 'GPT via cli-codex only; GLM via cli-opencode',
    created_at: nowStamp(),
  });
}

// ---------- prompt ----------
function buildDigest(reg) {
  const repos = Object.values(reg.repos);
  return [
    `Repos already catalogued (${repos.length}) — do NOT re-list these, find NEW ones or go deeper/adjacent:`,
    `  ${repos.map((r) => r.name).join(', ') || '(none yet)'}`,
    `Angles already covered: ${reg.anglesCovered.join(' | ') || '(none yet)'}`,
    `Insights so far: ${reg.insights.length}; contradictions logged: ${reg.contradictions.length}.`,
    reg.nextAngleSuggestions.length ? `Open threads prior iterations flagged: ${reg.nextAngleSuggestions.slice(-8).join(' | ')}` : '',
  ].filter(Boolean).join('\n');
}

function buildPrompt(slot, iter, digest) {
  return [
    `You are iteration ${iter}/${TOTAL} of a NON-CONVERGING (deliberately BROADENING) research loop mapping the state of the art in LOOP ENGINEERING for agentic / iterative AI systems.`,
    `The goal is to improve "system-deep-loop": a parent skill that runs iterative deep-research, deep-review, multi-agent deliberation, self-improvement, and alignment loops on top of an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty scoring, budget control, and observability gauges.`,
    ``,
    `THIS ITERATION'S ANGLE: ${slot.angle_label}`,
    `DIRECTIVE: ${slot.directive}`,
    ``,
    `You have live web search ENABLED. Use it to find REAL, currently-existing GitHub repositories, papers, and authoritative docs. For every repo you MUST give its real URL and, where findable, approximate GitHub star count and a recency signal (last release / commit year). Do NOT invent repos, URLs, or numbers — if unsure, mark confidence "low" and say what you could not verify.`,
    ``,
    `BROADEN — do not repeat prior coverage. Here is what has already been gathered:`,
    digest,
    ``,
    `Map every finding to at least one concrete system-deep-loop target from this list: ${SUBSYSTEMS.join(', ')}.`,
    ``,
    `Write a concise analysis (what you found + why it transfers), THEN end your message with a SINGLE fenced json block that is valid JSON and the LAST thing in your message, matching exactly:`,
    '```json',
    '{',
    '  "new_repos": [{"name":"owner/repo","url":"https://...","stars":"~N or unknown","what":"one line","lesson":"transferable lesson for system-deep-loop","maps_to":["subsystem"],"confidence":"high|med|low"}],',
    '  "insights": [{"insight":"one specific transferable idea","evidence":"repo/paper/url","maps_to":["subsystem"],"confidence":"high|med|low"}],',
    '  "contradictions": [{"claim":"","counter":"","evidence":""}],',
    '  "next_angles": ["a specific divergent angle worth exploring next"],',
    '  "notes": "coverage gaps you noticed"',
    '}',
    '```',
    `Target 2-5 NEW repos and 2-5 insights. Novelty and verifiable specifics over volume. If this angle is genuinely exhausted, return few/no new_repos but propose sharp next_angles (that is the divergent pivot, not a failure).`,
  ].join('\n');
}

// ---------- output parsing ----------
function extractJsonBlock(text) {
  // last ```json ... ``` fence wins; fall back to last {...} span
  const fences = [...text.matchAll(/```json\s*([\s\S]*?)```/gi)];
  const candidates = fences.map((m) => m[1]);
  if (!candidates.length) {
    const last = text.lastIndexOf('{');
    if (last >= 0) candidates.push(text.slice(last));
  }
  for (let i = candidates.length - 1; i >= 0; i--) {
    try { return JSON.parse(candidates[i].trim()); } catch { /* try previous */ }
  }
  return null;
}

function mergeFindings(reg, parsed, slot, iter) {
  let newRepos = 0;
  const p = parsed || {};
  for (const r of (p.new_repos || [])) {
    const key = normKey(r.url) || normKey(r.name);
    if (!key) continue;
    if (!reg.repos[key]) { reg.repos[key] = { ...r, first_seen_iter: iter, first_seen_model: slot.model }; newRepos++; }
  }
  const seenInsights = new Set(reg.insights.map((x) => normKey(x.insight)));
  for (const ins of (p.insights || [])) {
    const k = normKey(ins.insight);
    if (k && !seenInsights.has(k)) { reg.insights.push({ ...ins, iter, model: slot.model }); seenInsights.add(k); }
  }
  for (const c of (p.contradictions || [])) { if (c && (c.claim || c.counter)) reg.contradictions.push({ ...c, iter, model: slot.model }); }
  for (const a of (p.next_angles || [])) { if (a) reg.nextAngleSuggestions.push(a); }
  if (!reg.anglesCovered.includes(slot.angle_label)) reg.anglesCovered.push(slot.angle_label);
  return newRepos;
}

// ---------- dispatch ----------
function dispatch(slot, prompt) {
  const m = MODELS[slot.model];
  let cmd, args;
  const env = { ...process.env };
  if (m.kind === 'codex') {
    cmd = 'codex';
    args = ['--search', 'exec', '-m', m.model,
      '-c', 'model_reasoning_effort=' + m.reasoning,
      '-c', 'service_tier=fast',
      '-c', 'approval_policy=never',
      '--sandbox', 'read-only',
      prompt];
  } else {
    cmd = 'opencode';
    args = ['run', '--model', m.model, '--variant', m.variant, '--dir', ROOT, prompt];
    env.AI_SESSION_CHILD = '1';
    env.MK_SPEC_GATE_ENFORCE = '0';
  }
  const res = spawnSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'], // closed stdin == </dev/null
    timeout: TIMEOUT_MS,
    maxBuffer: 96 * 1024 * 1024,
    env,
  });
  const stderr = res.stderr || '';
  const out = (res.stdout || '') + (stderr ? `\n\n----- stderr -----\n${stderr}` : '');
  const timedOut = res.error && /ETIMEDOUT/i.test(String(res.error.code || res.error.message || ''));
  const ok = !res.error && res.status === 0;
  return { ok, out, status: res.status, timedOut, err: res.error ? String(res.error.message || res.error.code) : '', stderr };
}

function looksTransient(r) {
  if (r.timedOut) return true;
  const s = (r.stderr || '') + ' ' + (r.err || '');
  return /rate limit|429|timeout|temporarily|unavailable|ECONNRESET|network|overloaded|stream error/i.test(s);
}

// ---------- dashboard ----------
function updateDashboard(state, reg) {
  const byModel = { luna: 0, sol: 0, glm: 0 };
  for (const s of state) if (byModel[s.model] != null) byModel[s.model]++;
  const repos = Object.values(reg.repos);
  const lines = [
    '# Deep-Loop Market Research — Dashboard (manual Shape B)',
    '',
    `Updated: ${nowStamp()}`,
    '',
    `- Iterations complete: **${state.length}/${TOTAL}**  (luna ${byModel.luna}/25, sol ${byModel.sol}/10, glm ${byModel.glm}/10)`,
    `- Repos catalogued (deduped): **${repos.length}**  (target 10+)`,
    `- Insights: **${reg.insights.length}**  ·  contradictions: **${reg.contradictions.length}**`,
    `- Distinct subsystems mapped: **${new Set(repos.flatMap((r) => r.maps_to || []).concat(reg.insights.flatMap((i) => i.maps_to || []))).size}**  (target 6+)`,
    '',
    '## Iterations',
    '',
    '| # | model | angle | new repos | ok |',
    '|---|-------|-------|-----------|----|',
    ...state.map((s) => `| ${s.iteration} | ${s.model} | ${(s.angle || '').slice(0, 60)} | ${s.new_repos} | ${s.ok ? '✓' : (s.parse_ok === false ? '⚠parse' : '✗')} |`),
    '',
    '## Repos so far',
    '',
    ...repos.map((r) => `- [${r.name}](${r.url}) — ${r.what || ''} _(→ ${(r.maps_to || []).join(', ')})_`),
    '',
  ];
  fs.writeFileSync(DASH, lines.join('\n'));
}

// ---------- main ----------
function main() {
  const argv = process.argv.slice(2);
  const count = parseInt((argv[argv.indexOf('--count') + 1] || '1'), 10);
  const dryRun = argv.includes('--dry-run');

  const schedule = loadJSON(SCHEDULE, null);
  if (!schedule || !Array.isArray(schedule.slots)) { console.error('FATAL: missing/invalid angle-schedule.json at ' + SCHEDULE); process.exit(2); }

  ensureDirs();
  initConfigIfNeeded();

  let state = loadState();
  let reg = loadRegistry();
  let done = state.length;

  if (done >= TOTAL) { console.log(`All ${TOTAL} iterations already complete.`); updateDashboard(state, reg); return; }

  const runEnd = Math.min(done + count, TOTAL);
  console.log(`Driver: resuming at iteration ${done + 1}, running through ${runEnd} (of ${TOTAL}).`);

  for (let iter = done + 1; iter <= runEnd; iter++) {
    const slot = schedule.slots[iter - 1];
    if (!slot) { console.error(`No schedule slot for iteration ${iter}`); break; }
    const digest = buildDigest(reg);
    const prompt = buildPrompt(slot, iter, digest);
    const outFile = path.join(ITERDIR, `iteration-${String(iter).padStart(3, '0')}.md`);

    if (dryRun) {
      console.log(`\n===== DRY RUN: iteration ${iter} (${slot.model} / ${slot.angle_label}) =====\n`);
      console.log(prompt);
      console.log(`\n===== end prompt (${prompt.length} chars); model=${JSON.stringify(MODELS[slot.model])} =====`);
      return;
    }

    let attempt = 0, result = null;
    while (attempt <= MAX_RETRIES) {
      console.log(`[iter ${iter}/${TOTAL}] ${slot.model} :: ${slot.angle_label} (attempt ${attempt + 1})`);
      result = dispatch(slot, prompt);
      if (result.ok) break;
      if (attempt < MAX_RETRIES && looksTransient(result)) {
        const wait = BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)];
        logErr(`iter ${iter} transient failure (status=${result.status} err=${result.err}); backoff ${wait}ms`);
        console.log(`  transient failure; backing off ${wait / 1000}s`);
        sleep(wait);
        attempt++;
        continue;
      }
      break;
    }

    // Persist raw output regardless (nothing is ever lost)
    const header = `<!-- iteration ${iter} | model ${slot.model} (${MODELS[slot.model].model}) | angle: ${slot.angle_label} | ${nowStamp()} -->\n\n`;
    fs.writeFileSync(outFile, header + (result ? result.out : '(no output)'));

    if (!result || !result.ok) {
      logErr(`iter ${iter} HARD FAILURE after ${attempt + 1} attempts (status=${result && result.status}, err=${result && result.err}). Halting batch for intervention; re-run to resume.`);
      console.error(`HALT at iteration ${iter}: dispatch failed (status=${result && result.status}). See ${ERRLOG}. Re-run to resume.`);
      updateDashboard(state, reg);
      process.exit(1);
    }

    const parsed = extractJsonBlock(result.out);
    const newRepos = parsed ? mergeFindings(reg, parsed, slot, iter) : 0;
    saveJSON(REGISTRY, reg);

    const stateLine = {
      iteration: iter,
      model: slot.model,
      model_id: MODELS[slot.model].model,
      reasoning: MODELS[slot.model].reasoning || MODELS[slot.model].variant,
      angle: slot.angle_label,
      new_repos: newRepos,
      total_repos: Object.keys(reg.repos).length,
      insights_total: reg.insights.length,
      parse_ok: !!parsed,
      ok: true,
      ts: nowStamp(),
    };
    appendState(stateLine);
    state.push(stateLine);
    updateDashboard(state, reg);
    console.log(`  ✓ iter ${iter}: +${newRepos} repos (total ${stateLine.total_repos}), insights ${stateLine.insights_total}, parse_ok=${!!parsed}`);

    if (iter < runEnd) sleep(INTER_ITER_SLEEP_MS);
  }

  console.log(`\nBatch done. ${state.length}/${TOTAL} complete. Dashboard: ${DASH}`);
}

main();
