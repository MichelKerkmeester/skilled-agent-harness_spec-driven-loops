#!/usr/bin/env node
'use strict';
/**
 * Per-mode deep-research loop driver (single-lineage SOL) for packet
 * 065-deep-loop-innovation / 005 — EXTENSION run-2.
 *
 * Where run-1 (deep-loop-driver.cjs) was 20 iters of runtime-centric deepening,
 * this run is 45 iters organized as 9 deep-loop MODES x 5 angles each. Every
 * iteration asks a dual question about ONE mode: (1) how to improve that mode
 * specifically, (2) what makes it uniquely valuable versus the other deep modes
 * and versus a generic alternative, and how to sharpen that moat.
 *
 * It reuses run-1's Shape-B harness (sequential, findings-seeded, resume from
 * the state JSONL line count), single lineage GPT-5.6 SOL at xhigh on the fast
 * tier via cli-codex `codex --search exec` (--search is top-level, before exec).
 * Seeded with BOTH 001's 216 repos and 005 run-1's 74 repos as do-not-re-list,
 * so SOL goes mode-specific/deeper/newer instead of re-surveying.
 *
 * All artifacts are namespaced `-modes` so run-1's completed set is untouched.
 *
 * Usage:
 *   node deep-loop-driver-modes.cjs --count <N>          run next N scheduled iters
 *   node deep-loop-driver-modes.cjs --count 1 --dry-run  print next prompt only
 * Resumes from the last successful iteration in the state JSONL.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const SPEC = path.join(ROOT, '.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout');
const RESEARCH = path.join(SPEC, 'research');
const ITERDIR = path.join(RESEARCH, 'iterations-modes');
const SCRATCH = path.join(SPEC, 'scratch');
const STATE = path.join(RESEARCH, 'deep-research-state-modes.jsonl');
const REGISTRY = path.join(RESEARCH, 'findings-registry-modes.json');
const CONFIG = path.join(RESEARCH, 'deep-research-config-modes.json');
const DASH = path.join(RESEARCH, 'deep-research-dashboard-modes.md');
const ERRLOG = path.join(RESEARCH, 'driver-errors-modes.log');
const SCHEDULE = path.join(SCRATCH, 'angle-schedule-modes.json');
// Prior-run knowledge: repos we must NOT re-list (001 survey + 005 run-1).
const PRIOR_REGISTRIES = [
  path.join(ROOT, '.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research/research/findings-registry.json'),
  path.join(RESEARCH, 'findings-registry.json'), // 005 run-1
];

const TOTAL = 40;
const TIMEOUT_MS = 600 * 1000;          // 10 min per iteration (xhigh is slower)
const INTER_ITER_SLEEP_MS = 6 * 1000;   // gentle on the shared OAuth
const MAX_RETRIES = 2;                   // transient (rate-limit/timeout) only
const BACKOFF_MS = [20000, 60000];       // retry backoff

const MODELS = {
  sol: { kind: 'codex', model: 'gpt-5.6-sol', reasoning: 'xhigh' },
};

// Runtime subsystems available as SECONDARY mapping targets; the primary target
// is always the iteration's mode.
const RUNTIME_SUBSYSTEMS = [
  'runtime/convergence', 'runtime/fan-out-fan-in', 'runtime/dedup-novelty',
  'runtime/gauges-observability', 'runtime/state-jsonl-checkpointing',
  'runtime/budget-cost', 'runtime/locks-recovery', 'runtime/continuity-threading',
];

// The 8 ranked recommendations from 001 research.md §17 — carried so SOL builds
// ON these rather than rediscovering the headline.
const PRIOR_RECS = [
  'R1 Multi-signal, path-covering termination',
  'R2 Side-effect-receipt resume contract',
  'R3 Effective-independence for deep-ai-council + 5-role evaluator separation',
  'R4 Conditional, budget-aware fan-in + logical-branch-ID determinism',
  'R5 Cheap-checks-before-judges + regression-gated self-repair',
  'R6 Semantic-community novelty + contradiction-as-versioned-event',
  'R7 Incremental stream-fold gauges + immutable observability',
  'R8 Hierarchical typed budgets, exhaustion-as-state',
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

function emptyRegistry() { return { repos: {}, insights: [], contradictions: [], recommendations: [], anglesCovered: [], modesCovered: [], nextAngleSuggestions: [] }; }
function loadRegistry() { return loadJSON(REGISTRY, emptyRegistry()); }
function normKey(s) { return String(s || '').trim().toLowerCase().replace(/\/+$/, '').replace(/^https?:\/\/(www\.)?/, ''); }

// Prior-run repo names (union of 001 + 005 run-1) so SOL does not re-list them.
let PRIOR_REPO_NAMES = null;
function priorRepoNames() {
  if (PRIOR_REPO_NAMES) return PRIOR_REPO_NAMES;
  const set = new Set();
  for (const p of PRIOR_REGISTRIES) {
    const prior = loadJSON(p, { repos: {} });
    for (const r of Object.values(prior.repos || {})) if (r && r.name) set.add(r.name);
  }
  PRIOR_REPO_NAMES = [...set];
  return PRIOR_REPO_NAMES;
}

// ---------- config init (born at execution — never pre-scaffolded) ----------
function initConfigIfNeeded() {
  if (fs.existsSync(CONFIG)) return;
  saveJSON(CONFIG, {
    run: 'per-mode-deepening-sol (005 run-2)',
    note: 'Extension of 005. Single-lineage SOL xhigh, findings-seeded from 001 + 005 run-1. 9 deep-loop modes x 5 angles. Non-converging (divergent within each mode). Dual question per iter: improve the mode + sharpen its unique value.',
    max_iterations: TOTAL,
    stop_policy: 'max-iterations',
    convergence_mode: 'divergent',
    generations: [
      { label: 'sol', kind: 'cli-codex', model: 'gpt-5.6-sol', reasoningEffort: 'xhigh', serviceTier: 'fast', iterations: TOTAL },
    ],
    modes: ['deep-research', 'deep-review', 'deep-ai-council', 'deep-improvement', 'deep-alignment', 'agent-improvement', 'model-benchmark', 'skill-benchmark'],
    angles_per_mode: ['A1-sota', 'A2-moat', 'A3-mech', 'A4-fail', 'A5-synth'],
    seeded_from: '001 (216 repos) + 005 run-1 (74 repos) do-not-re-list; run-1 recs were runtime-centric so this run is mode-centric',
    web_search: 'codex top-level --search (live GitHub/web mining)',
    transport_mandate: 'GPT via cli-codex only',
    created_at: nowStamp(),
  });
}

// ---------- prompt ----------
function buildDigest(reg) {
  const repos = Object.values(reg.repos);
  const prior = priorRepoNames();
  return [
    `PRIOR RUNS (001 survey + 005 run-1) already catalogued ${prior.length} repos — do NOT re-list any; go DEEPER, adjacent, or newer:`,
    `  ${prior.join(', ')}`,
    ``,
    `THIS run's new repos so far (${repos.length}) — also do not repeat:`,
    `  ${repos.map((r) => r.name).join(', ') || '(none yet)'}`,
    `Modes covered so far this run: ${reg.modesCovered.join(' | ') || '(none yet)'}`,
    `New insights so far: ${reg.insights.length}; recommendations: ${reg.recommendations.length}.`,
    reg.nextAngleSuggestions.length ? `Open threads flagged: ${reg.nextAngleSuggestions.slice(-6).join(' | ')}` : '',
  ].filter(Boolean).join('\n');
}

function buildPrompt(slot, iter, digest, modeMeta) {
  const identity = (modeMeta && modeMeta.identity) || slot.mode_slug;
  const genericAlt = (modeMeta && modeMeta.generic_alt) || 'a generic single-shot alternative';
  const targets = [slot.mode_slug, ...RUNTIME_SUBSYSTEMS];
  return [
    `You are iteration ${iter}/${TOTAL} of a per-MODE, NON-CONVERGING (deliberately broadening within the mode) research loop to make ONE mode of "system-deep-loop" both MORE EFFECTIVE and MORE UNIQUELY VALUABLE.`,
    `system-deep-loop is a parent skill running iterative deep-research/review/council/improvement/alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges.`,
    ``,
    `TARGET MODE: ${slot.mode_slug}`,
    `MODE IDENTITY (what it does today): ${identity}`,
    `GENERIC ALTERNATIVE it must out-value: ${genericAlt}`,
    ``,
    `THIS ITERATION'S ANGLE (${slot.angle_key}): ${slot.angle_label}`,
    `DIRECTIVE: ${slot.directive}`,
    ``,
    `Prior work you build ON (do not merely restate): a 45-iter survey (001) + a 20-iter runtime-deepening run (005 run-1, 59 recs that were mostly about the shared RUNTIME, not the modes). Also the 8 ranked recommendations from 001:`,
    ...PRIOR_RECS.map((r) => `  - ${r}`),
    `Your job is MODE-SPECIFIC value that those runtime recs did not cover.`,
    ``,
    `ALWAYS answer BOTH: (1) concrete improvements to make ${slot.mode_slug} more effective; (2) the UNIQUE-VALUE / moat thesis — what ${slot.mode_slug} can do that ${genericAlt} and the OTHER deep modes cannot, and how to sharpen it. Prefer at least one recommendation tagged as uniqueness-sharpening.`,
    ``,
    `You have live web search ENABLED. Find REAL, currently-existing GitHub repos, papers, and authoritative docs. Give real URLs and, where findable, approximate stars + a recency signal. Do NOT invent repos, URLs, or numbers — if unsure mark confidence "low" and say what you could not verify.`,
    ``,
    `GO DEEPER than a survey: concrete mechanisms, reference implementations (file/module level where possible), algorithms, API shapes, adoption tradeoffs — not just "repo X exists."`,
    ``,
    `BROADEN within this mode — do not repeat prior coverage:`,
    digest,
    ``,
    `Map every finding to at least one concrete system-deep-loop target (primary should be the mode "${slot.mode_slug}"): ${targets.join(', ')}.`,
    ``,
    `Write a concise deep analysis, THEN end your message with a SINGLE fenced json block that is valid JSON and the LAST thing in your message, matching exactly:`,
    '```json',
    '{',
    '  "new_repos": [{"name":"owner/repo","url":"https://...","stars":"~N or unknown","what":"one line","lesson":"transferable mechanism for this mode","maps_to":["mode-or-subsystem"],"confidence":"high|med|low"}],',
    '  "insights": [{"insight":"one specific transferable mechanism","evidence":"repo/paper/url","maps_to":["mode-or-subsystem"],"confidence":"high|med|low"}],',
    '  "recommendations": [{"rec":"specific actionable change","target":"mode/subsystem","rationale":"why","uniqueness":"how this sharpens the mode\'s unique value (or empty)","effort":"S|M|L","impact":"low|med|high","evidence":"url/repo"}],',
    '  "contradictions": [{"claim":"","counter":"","evidence":""}],',
    '  "next_angles": ["a specific divergent angle worth exploring next for this mode"],',
    '  "notes": "coverage gaps you noticed"',
    '}',
    '```',
    `Target 2-5 NEW repos, 2-5 insights, and 1-3 concrete recommendations (at least one uniqueness-sharpening). Novelty and verifiable specifics over volume. If the angle is exhausted, return few/no new_repos but propose sharp next_angles + recommendations (that is the divergent pivot, not a failure).`,
  ].join('\n');
}

// ---------- output parsing ----------
function extractJsonBlock(text) {
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
  const priorSet = new Set(priorRepoNames().map((n) => normKey(n)));
  for (const r of (p.new_repos || [])) {
    const key = normKey(r.url) || normKey(r.name);
    if (!key) continue;
    if (priorSet.has(normKey(r.name)) || priorSet.has(key)) continue;
    if (!reg.repos[key]) { reg.repos[key] = { ...r, first_seen_iter: iter, mode: slot.mode_slug }; newRepos++; }
  }
  const seenInsights = new Set(reg.insights.map((x) => normKey(x.insight)));
  for (const ins of (p.insights || [])) {
    const k = normKey(ins.insight);
    if (k && !seenInsights.has(k)) { reg.insights.push({ ...ins, iter, mode: slot.mode_slug }); seenInsights.add(k); }
  }
  for (const rec of (p.recommendations || [])) { if (rec && rec.rec) reg.recommendations.push({ ...rec, iter, mode: slot.mode_slug, angle: slot.angle_key }); }
  for (const c of (p.contradictions || [])) { if (c && (c.claim || c.counter)) reg.contradictions.push({ ...c, iter, mode: slot.mode_slug }); }
  for (const a of (p.next_angles || [])) { if (a) reg.nextAngleSuggestions.push(a); }
  if (!reg.anglesCovered.includes(slot.angle_label)) reg.anglesCovered.push(slot.angle_label);
  if (!reg.modesCovered.includes(slot.mode_slug)) reg.modesCovered.push(slot.mode_slug);
  return newRepos;
}

// ---------- dispatch ----------
function dispatch(slot, prompt) {
  const m = MODELS[slot.model];
  const env = { ...process.env };
  const cmd = 'codex';
  const args = ['--search', 'exec', '-m', m.model,
    '-c', 'model_reasoning_effort=' + m.reasoning,
    '-c', 'service_tier=fast',
    '-c', 'approval_policy=never',
    '--sandbox', 'read-only',
    prompt];
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
  const repos = Object.values(reg.repos);
  const byMode = {};
  for (const s of state) byMode[s.mode] = (byMode[s.mode] || 0) + 1;
  const recsByMode = {};
  for (const r of reg.recommendations) recsByMode[r.mode] = (recsByMode[r.mode] || 0) + 1;
  const lines = [
    '# Deep-Loop Per-Mode Deepening — Dashboard (SOL xhigh, 005 run-2)',
    '',
    `Updated: ${nowStamp()}`,
    '',
    `- Iterations complete: **${state.length}/${TOTAL}**`,
    `- Modes covered: ${Object.entries(byMode).map(([t, n]) => `${t} ${n}/5`).join(' · ') || '(none yet)'}`,
    `- NEW repos (beyond 001+run-1): **${repos.length}**`,
    `- New insights: **${reg.insights.length}**  ·  recommendations: **${reg.recommendations.length}**  ·  contradictions: **${reg.contradictions.length}**`,
    `- Recs per mode: ${Object.entries(recsByMode).map(([t, n]) => `${t} ${n}`).join(' · ') || '(none yet)'}`,
    '',
    '## Iterations',
    '',
    '| # | mode | angle | new repos | recs | ok |',
    '|---|------|-------|-----------|------|----|',
    ...state.map((s) => `| ${s.iteration} | ${(s.mode || '').slice(0, 20)} | ${(s.angle_key || '')} | ${s.new_repos} | ${s.recs || 0} | ${s.ok ? '✓' : (s.parse_ok === false ? '⚠parse' : '✗')} |`),
    '',
    '## New repos so far',
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
  if (!schedule || !Array.isArray(schedule.slots)) { console.error('FATAL: missing/invalid angle-schedule-modes.json at ' + SCHEDULE); process.exit(2); }
  const modeMap = schedule.modes || {};

  ensureDirs();
  initConfigIfNeeded();

  let state = loadState();
  let reg = loadRegistry();
  let done = state.length;

  if (done >= TOTAL) { console.log(`All ${TOTAL} iterations already complete.`); updateDashboard(state, reg); return; }

  const runEnd = Math.min(done + count, TOTAL);
  console.log(`Driver(modes): resuming at iteration ${done + 1}, running through ${runEnd} (of ${TOTAL}).`);

  for (let iter = done + 1; iter <= runEnd; iter++) {
    const slot = schedule.slots[iter - 1];
    if (!slot) { console.error(`No schedule slot for iteration ${iter}`); break; }
    const modeMeta = modeMap[slot.mode_slug];
    const digest = buildDigest(reg);
    const prompt = buildPrompt(slot, iter, digest, modeMeta);
    const outFile = path.join(ITERDIR, `iteration-${String(iter).padStart(3, '0')}.md`);

    if (dryRun) {
      console.log(`\n===== DRY RUN: iteration ${iter} (${slot.mode_slug} / ${slot.angle_key}) =====\n`);
      console.log(prompt);
      console.log(`\n===== end prompt (${prompt.length} chars); model=${JSON.stringify(MODELS[slot.model])} =====`);
      return;
    }

    let attempt = 0, result = null;
    while (attempt <= MAX_RETRIES) {
      console.log(`[iter ${iter}/${TOTAL}] ${slot.mode_slug} :: ${slot.angle_key} (attempt ${attempt + 1})`);
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

    const header = `<!-- iteration ${iter} | SOL xhigh | mode: ${slot.mode_slug} | angle: ${slot.angle_key} ${slot.angle_label} | ${nowStamp()} -->\n\n`;
    fs.writeFileSync(outFile, header + (result ? result.out : '(no output)'));

    if (!result || !result.ok) {
      logErr(`iter ${iter} HARD FAILURE after ${attempt + 1} attempts (status=${result && result.status}, err=${result && result.err}). Halting batch; re-run to resume.`);
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
      reasoning: MODELS[slot.model].reasoning,
      mode: slot.mode_slug,
      iter_in_mode: slot.iter_in_mode,
      angle_key: slot.angle_key,
      angle: slot.angle_label,
      new_repos: newRepos,
      recs: parsed && Array.isArray(parsed.recommendations) ? parsed.recommendations.length : 0,
      total_new_repos: Object.keys(reg.repos).length,
      insights_total: reg.insights.length,
      recs_total: reg.recommendations.length,
      parse_ok: !!parsed,
      ok: true,
      ts: nowStamp(),
    };
    appendState(stateLine);
    state.push(stateLine);
    updateDashboard(state, reg);
    console.log(`  ✓ iter ${iter}: +${newRepos} repos (new total ${stateLine.total_new_repos}), +${stateLine.recs} recs (total ${stateLine.recs_total}), parse_ok=${!!parsed}`);

    if (iter < runEnd) sleep(INTER_ITER_SLEEP_MS);
  }

  console.log(`\nBatch done. ${state.length}/${TOTAL} complete. Dashboard: ${DASH}`);
}

main();
