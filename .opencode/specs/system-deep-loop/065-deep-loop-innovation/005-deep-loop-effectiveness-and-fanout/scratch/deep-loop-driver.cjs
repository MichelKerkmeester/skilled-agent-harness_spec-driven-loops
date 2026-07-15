#!/usr/bin/env node
'use strict';
/**
 * Targeted deep-research loop driver (single-lineage SOL) for packet
 * 065-deep-loop-innovation / 005-deep-loop-effectiveness-and-fanout.
 *
 * This is a follow-on to 001-deep-loop-market-research. Where 001 was a broad
 * 45-iteration survey, this run is a 20-iteration TARGETED deepening across
 * three threads:
 *   - fan-out automation (can the automated scripts reproduce a manual
 *     multi-model live-search run) — iters 1-5,
 *   - deeper investigation of the 001 recommendations worth pursuing — 6-15,
 *   - general "make current deep loops more effective" + AI-council depth — 16-20.
 *
 * It reuses 001's proven Shape-B harness (sequential, findings-seeded, resume
 * from the state JSONL line count) but runs a single lineage: GPT-5.6 SOL at
 * xhigh reasoning on the fast tier, via cli-codex `codex --search exec`. codex
 * `--search` is a top-level flag and MUST precede `exec`. The loop is seeded
 * with 001's 216 already-catalogued repos so SOL goes deeper / adjacent / newer
 * instead of re-listing what 001 already found.
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
const SPEC = path.join(ROOT, '.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout');
const RESEARCH = path.join(SPEC, 'research');
const ITERDIR = path.join(RESEARCH, 'iterations');
const SCRATCH = path.join(SPEC, 'scratch');
const STATE = path.join(RESEARCH, 'deep-research-state.jsonl');
const REGISTRY = path.join(RESEARCH, 'findings-registry.json');
const CONFIG = path.join(RESEARCH, 'deep-research-config.json');
const DASH = path.join(RESEARCH, 'deep-research-dashboard.md');
const ERRLOG = path.join(RESEARCH, 'driver-errors.log');
const SCHEDULE = path.join(SCRATCH, 'angle-schedule.json');
// Prior-run knowledge: 001's deduped registry (repos we must NOT re-list).
const PRIOR_REGISTRY = path.join(ROOT, '.opencode/specs/system-deep-loop/065-deep-loop-innovation/001-deep-loop-market-research/research/findings-registry.json');

const TOTAL = 20;
const TIMEOUT_MS = 600 * 1000;          // 10 min per iteration (xhigh is slower)
const INTER_ITER_SLEEP_MS = 6 * 1000;   // gentle on the shared OAuth
const MAX_RETRIES = 2;                   // transient (rate-limit/timeout) only
const BACKOFF_MS = [20000, 60000];       // retry backoff

const MODELS = {
  sol: { kind: 'codex', model: 'gpt-5.6-sol', reasoning: 'xhigh' },
};

// system-deep-loop targets. Adds fan-out-automation for thread 1.
const SUBSYSTEMS = [
  'deep-research', 'deep-review', 'deep-ai-council', 'deep-improvement', 'deep-alignment',
  'runtime/convergence', 'runtime/fan-out-fan-in', 'runtime/dedup-novelty',
  'runtime/gauges-observability', 'runtime/state-jsonl-checkpointing',
  'runtime/budget-cost', 'runtime/locks-recovery', 'runtime/continuity-threading',
  'runtime/fan-out-automation',
];

// The 8 ranked recommendations from 001 research.md §17 — carried as context so
// SOL deepens THESE rather than rediscovering the headline.
const PRIOR_RECS = [
  'R1 Multi-signal, path-covering termination (fuse novelty with a quality/critic/execution gate; bound must span retries/handoffs/tool re-entry)',
  'R2 Side-effect-receipt resume contract (per-event replay semantics reuse/re-execute/compensate + versioned replay-compatibility fingerprint on the JSONL projection)',
  'R3 Effective-independence for deep-ai-council + 5-role evaluator separation (generator/detector/orchestrator/scorer/target)',
  'R4 Conditional, budget-aware fan-in + logical-branch-ID determinism + explicit partial-failure policy (strict/quorum/deadline/progressive)',
  'R5 Cheap-checks-before-judges + regression-gated self-repair for deep-review; keep raw pre-reduction scores',
  'R6 Semantic-community novelty + contradiction-as-versioned-event for dedup/continuity',
  'R7 Incremental stream-fold gauges + immutable-record/attach-judgment-later observability',
  'R8 Hierarchical typed budgets enforced centrally, exhaustion as an explicit state transition',
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

function emptyRegistry() { return { repos: {}, insights: [], contradictions: [], recommendations: [], anglesCovered: [], nextAngleSuggestions: [] }; }
function loadRegistry() { return loadJSON(REGISTRY, emptyRegistry()); }
function normKey(s) { return String(s || '').trim().toLowerCase().replace(/\/+$/, '').replace(/^https?:\/\/(www\.)?/, ''); }

// Prior-run repo names (compact) so SOL does not re-list 001's catalogue.
let PRIOR_REPO_NAMES = null;
function priorRepoNames() {
  if (PRIOR_REPO_NAMES) return PRIOR_REPO_NAMES;
  const prior = loadJSON(PRIOR_REGISTRY, { repos: {} });
  PRIOR_REPO_NAMES = Object.values(prior.repos || {}).map((r) => r.name).filter(Boolean);
  return PRIOR_REPO_NAMES;
}

// ---------- config init (born at execution — never pre-scaffolded) ----------
function initConfigIfNeeded() {
  if (fs.existsSync(CONFIG)) return;
  saveJSON(CONFIG, {
    run: 'targeted-deepening-sol',
    note: 'Follow-on to 001. Single-lineage SOL xhigh, findings-seeded from 001 registry. Three threads: fan-out automation, recommendation deep-dive, general effectiveness + AI-council. Non-converging (divergent within each thread).',
    max_iterations: TOTAL,
    stop_policy: 'max-iterations',
    convergence_mode: 'divergent',
    generations: [
      { label: 'sol', kind: 'cli-codex', model: 'gpt-5.6-sol', reasoningEffort: 'xhigh', serviceTier: 'fast', iterations: TOTAL },
    ],
    threads: {
      'fan-out-automation': 'iters 1-5',
      'recommendation-deep-dive': 'iters 6-15',
      'general-effectiveness-and-council': 'iters 16-20',
    },
    seeded_from: '001-deep-loop-market-research/research/findings-registry.json (216 repos, 222 insights, 134 contradictions)',
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
    `PRIOR RUN (phase 001) already catalogued ${prior.length} repos — do NOT re-list any of these; go DEEPER, adjacent, or newer:`,
    `  ${prior.join(', ')}`,
    ``,
    `THIS run's new repos so far (${repos.length}) — also do not repeat:`,
    `  ${repos.map((r) => r.name).join(', ') || '(none yet)'}`,
    `Angles already covered this run: ${reg.anglesCovered.join(' | ') || '(none yet)'}`,
    `New insights so far: ${reg.insights.length}; new contradictions: ${reg.contradictions.length}; recommendations: ${reg.recommendations.length}.`,
    reg.nextAngleSuggestions.length ? `Open threads flagged: ${reg.nextAngleSuggestions.slice(-8).join(' | ')}` : '',
  ].filter(Boolean).join('\n');
}

function buildPrompt(slot, iter, digest) {
  return [
    `You are iteration ${iter}/${TOTAL} of a TARGETED, NON-CONVERGING (deliberately broadening WITHIN its thread) research loop to make "system-deep-loop" MORE EFFECTIVE.`,
    `system-deep-loop is a parent skill running iterative deep-research, deep-review, multi-agent deliberation (deep-ai-council), self-improvement, and alignment loops on an externalized-state (JSONL) runtime with convergence math, fan-out/fan-in, dedup/novelty, budget control, and observability gauges. Its fan-out executors live at runtime/scripts/fanout-{run,pool,salvage,merge}.cjs.`,
    ``,
    `This is a FOLLOW-ON to a prior 45-iteration survey. That survey produced 216 repos and these 8 ranked recommendations (deepen THESE, don't just restate them):`,
    ...PRIOR_RECS.map((r) => `  - ${r}`),
    ``,
    `THIS ITERATION'S THREAD: ${slot.thread}`,
    `ANGLE: ${slot.angle_label}`,
    `DIRECTIVE: ${slot.directive}`,
    ``,
    `You have live web search ENABLED. Find REAL, currently-existing GitHub repos, papers, and authoritative docs. For every repo give its real URL and, where findable, approximate stars + a recency signal. Do NOT invent repos, URLs, or numbers — if unsure mark confidence "low" and say what you could not verify.`,
    ``,
    `GO DEEPER than a survey: prefer concrete mechanisms, reference implementations (file/module level where possible), algorithms, API shapes, and adoption tradeoffs for system-deep-loop — not just "repo X exists." Where you can, propose a SPECIFIC, actionable recommendation for a named subsystem.`,
    ``,
    `BROADEN within the thread — do not repeat prior coverage:`,
    digest,
    ``,
    `Map every finding to at least one concrete system-deep-loop target from: ${SUBSYSTEMS.join(', ')}.`,
    ``,
    `Write a concise deep analysis, THEN end your message with a SINGLE fenced json block that is valid JSON and the LAST thing in your message, matching exactly:`,
    '```json',
    '{',
    '  "new_repos": [{"name":"owner/repo","url":"https://...","stars":"~N or unknown","what":"one line","lesson":"transferable mechanism for system-deep-loop","maps_to":["subsystem"],"confidence":"high|med|low"}],',
    '  "insights": [{"insight":"one specific transferable mechanism","evidence":"repo/paper/url","maps_to":["subsystem"],"confidence":"high|med|low"}],',
    '  "recommendations": [{"rec":"specific actionable change","target":"subsystem/mode","rationale":"why","effort":"S|M|L","impact":"low|med|high","evidence":"url/repo"}],',
    '  "contradictions": [{"claim":"","counter":"","evidence":""}],',
    '  "next_angles": ["a specific divergent angle worth exploring next in this thread"],',
    '  "notes": "coverage gaps you noticed"',
    '}',
    '```',
    `Target 2-5 NEW repos, 2-5 insights, and 1-3 concrete recommendations. Novelty and verifiable specifics over volume. If the angle is exhausted, return few/no new_repos but propose sharp next_angles + recommendations (that is the divergent pivot, not a failure).`,
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
    // skip if already in 001's catalogue or this run's
    if (priorSet.has(normKey(r.name)) || priorSet.has(key)) continue;
    if (!reg.repos[key]) { reg.repos[key] = { ...r, first_seen_iter: iter, thread: slot.thread }; newRepos++; }
  }
  const seenInsights = new Set(reg.insights.map((x) => normKey(x.insight)));
  for (const ins of (p.insights || [])) {
    const k = normKey(ins.insight);
    if (k && !seenInsights.has(k)) { reg.insights.push({ ...ins, iter, thread: slot.thread }); seenInsights.add(k); }
  }
  for (const rec of (p.recommendations || [])) { if (rec && rec.rec) reg.recommendations.push({ ...rec, iter, thread: slot.thread }); }
  for (const c of (p.contradictions || [])) { if (c && (c.claim || c.counter)) reg.contradictions.push({ ...c, iter, thread: slot.thread }); }
  for (const a of (p.next_angles || [])) { if (a) reg.nextAngleSuggestions.push(a); }
  if (!reg.anglesCovered.includes(slot.angle_label)) reg.anglesCovered.push(slot.angle_label);
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
  const byThread = {};
  for (const s of state) byThread[s.thread] = (byThread[s.thread] || 0) + 1;
  const lines = [
    '# Deep-Loop Effectiveness & Fan-out — Dashboard (SOL xhigh, targeted)',
    '',
    `Updated: ${nowStamp()}`,
    '',
    `- Iterations complete: **${state.length}/${TOTAL}**`,
    `- Threads: ${Object.entries(byThread).map(([t, n]) => `${t} ${n}`).join(' · ') || '(none yet)'}`,
    `- NEW repos (beyond 001's 216): **${repos.length}**`,
    `- New insights: **${reg.insights.length}**  ·  recommendations: **${reg.recommendations.length}**  ·  contradictions: **${reg.contradictions.length}**`,
    `- Distinct subsystems mapped: **${new Set(repos.flatMap((r) => r.maps_to || []).concat(reg.insights.flatMap((i) => i.maps_to || []))).size}**`,
    '',
    '## Iterations',
    '',
    '| # | thread | angle | new repos | recs | ok |',
    '|---|--------|-------|-----------|------|----|',
    ...state.map((s) => `| ${s.iteration} | ${(s.thread || '').slice(0, 18)} | ${(s.angle || '').slice(0, 48)} | ${s.new_repos} | ${s.recs || 0} | ${s.ok ? '✓' : (s.parse_ok === false ? '⚠parse' : '✗')} |`),
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
      console.log(`\n===== DRY RUN: iteration ${iter} (${slot.thread} / ${slot.angle_label}) =====\n`);
      console.log(prompt);
      console.log(`\n===== end prompt (${prompt.length} chars); model=${JSON.stringify(MODELS[slot.model])} =====`);
      return;
    }

    let attempt = 0, result = null;
    while (attempt <= MAX_RETRIES) {
      console.log(`[iter ${iter}/${TOTAL}] ${slot.thread} :: ${slot.angle_label} (attempt ${attempt + 1})`);
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

    const header = `<!-- iteration ${iter} | SOL xhigh | thread: ${slot.thread} | angle: ${slot.angle_label} | ${nowStamp()} -->\n\n`;
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
      thread: slot.thread,
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
