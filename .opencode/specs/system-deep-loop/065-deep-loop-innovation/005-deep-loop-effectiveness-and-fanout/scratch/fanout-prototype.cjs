#!/usr/bin/env node
'use strict';
/**
 * Fan-out automation PROTOTYPE (throwaway; scratch only).
 *
 * Demonstrates the one capability the shipped fanout executor lacks and which
 * forced the manual 001 run: an automated fan-out that spawns a HETEROGENEOUS
 * multi-model fleet where each leaf carries its OWN model, reasoning effort, and
 * LIVE web search, then reduces the leaves with provenance-preserving dedup.
 *
 * This is NOT wired into the shipped runtime. It exists to prove feasibility and
 * to serve as a design reference for a future, gated change to
 * runtime/scripts/fanout-run.cjs. The three mechanisms it shows (surfaced by
 * this packet's own thread-1 research) are:
 *   1. per-leaf executor ADAPTERS that build argv from a leaf config, so codex
 *      live search compiles to the TOP-LEVEL form ['--search','exec',...] — the
 *      exact placement the current buildLineageCommand omits;
 *   2. a CAPABILITY MATRIX that rejects unsupported (kind x live-search) combos
 *      before spawn instead of silently answering from training data;
 *   3. an INVOCATION FINGERPRINT per leaf (kind+model+effort+search+CLI version)
 *      so retries reuse one canonical resolved command.
 *
 * Usage:
 *   node fanout-prototype.cjs --dry-run           resolve + print every leaf command; spawn nothing
 *   node fanout-prototype.cjs --run [--concurrency N]  actually dispatch (default N=1, serial)
 *
 * Default concurrency is 1 (serial) to respect the single-dispatch discipline and
 * the OAuth shared with the concurrent packet-138 session. The harness is
 * parallel-capable: --concurrency N runs N leaves at once. Running >1 real codex
 * at once is a parallel dispatch and needs explicit operator authorization.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const HERE = __dirname;
const OUT = path.join(HERE, 'fanout-prototype-result.json');

// Which executor kinds can serve live web search, and HOW the flag is placed.
// This is the guard the shipped buildLineageCommand lacks.
const CAPABILITY_MATRIX = {
  'cli-codex':    { liveSearch: true, searchPlacement: 'top-level', note: "codex --search must PRECEDE exec" },
  'cli-opencode': { liveSearch: true, searchPlacement: 'native-webfetch', note: 'opencode browses via its own WebFetch tool' },
};

function codexVersion() {
  try {
    const r = spawnSync('codex', ['--version'], { encoding: 'utf8', timeout: 10000 });
    return (r.stdout || '').trim() || 'unknown';
  } catch { return 'unknown'; }
}
const CODEX_VERSION = codexVersion();

function promptHash(s) { return crypto.createHash('sha256').update(String(s)).digest('hex').slice(0, 12); }

/**
 * Executor adapter: resolve a leaf config into a concrete, spawnable command.
 * The RETURN SHAPE is the contract a real fanout-run.cjs adapter would expose:
 * { cmd, argv, env, effectiveConfig, invocationFingerprint }.
 */
function buildLeafCommand(leaf) {
  const cap = CAPABILITY_MATRIX[leaf.kind];
  if (!cap) throw new Error(`unknown executor kind: ${leaf.kind}`);
  if (leaf.search && !cap.liveSearch) throw new Error(`kind ${leaf.kind} cannot serve live search (capability matrix)`);

  let cmd, argv, env = { ...process.env };
  const effectiveConfig = { kind: leaf.kind, model: leaf.model, effort: leaf.effort || null, search: !!leaf.search };

  if (leaf.kind === 'cli-codex') {
    // THE FIX: --search is a TOP-LEVEL flag; it must come before `exec`.
    argv = [];
    if (leaf.search) argv.push('--search');           // top-level, pre-subcommand
    argv.push('exec', '-m', leaf.model);
    if (leaf.effort) argv.push('-c', `model_reasoning_effort=${leaf.effort}`);
    argv.push('-c', 'service_tier=fast', '-c', 'approval_policy=never', '--sandbox', 'read-only', leaf.prompt);
    cmd = 'codex';
  } else { // cli-opencode
    cmd = 'opencode';
    argv = ['run', '--model', leaf.model];
    if (leaf.variant) argv.push('--variant', leaf.variant);
    argv.push('--dir', ROOT, leaf.prompt);
    env.AI_SESSION_CHILD = '1';
    env.MK_SPEC_GATE_ENFORCE = '0';
    effectiveConfig.variant = leaf.variant || null;
  }

  const invocationFingerprint = 'inv:' + crypto.createHash('sha256')
    .update(JSON.stringify({ ...effectiveConfig, cliVersion: CODEX_VERSION, prompt: promptHash(leaf.prompt) }))
    .digest('hex').slice(0, 16);

  return { id: leaf.id, cmd, argv, env, effectiveConfig, invocationFingerprint };
}

function spawnLeaf(resolved, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn(resolved.cmd, resolved.argv, { stdio: ['ignore', 'pipe', 'pipe'], env: resolved.env });
    let out = '', err = '';
    const timer = setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, timeoutMs);
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ id: resolved.id, code, out, err, fingerprint: resolved.invocationFingerprint });
    });
    child.on('error', (e) => { clearTimeout(timer); resolve({ id: resolved.id, code: -1, out, err: String(e), fingerprint: resolved.invocationFingerprint }); });
  });
}

// Concurrency-limited runner: N leaves in flight at once (N=1 => serial).
async function runFleet(resolvedLeaves, concurrency, timeoutMs) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < resolvedLeaves.length) {
      const idx = i++;
      results[idx] = await spawnLeaf(resolvedLeaves[idx], timeoutMs);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
  return results;
}

function extractJsonBlock(text) {
  const fences = [...String(text).matchAll(/```json\s*([\s\S]*?)```/gi)];
  const cands = fences.map((m) => m[1]);
  if (!cands.length) { const last = String(text).lastIndexOf('{'); if (last >= 0) cands.push(String(text).slice(last)); }
  for (let k = cands.length - 1; k >= 0; k--) { try { return JSON.parse(cands[k].trim()); } catch {} }
  return null;
}
function normKey(s) { return String(s || '').trim().toLowerCase().replace(/\/+$/, '').replace(/^https?:\/\/(www\.)?/, ''); }

/**
 * Provenance-preserving, bias-free reduce: round-robin across leaves so no single
 * model's ordering dominates, dedup by normalized url/name, and record which
 * leaf/model first contributed each repo.
 */
function reduceLeaves(results) {
  const parsed = results.map((r) => ({ id: r.id, json: extractJsonBlock(r.out) }));
  const perLeafRepos = parsed.map((p) => (p.json && Array.isArray(p.json.new_repos)) ? p.json.new_repos.map((x) => ({ ...x, _leaf: p.id })) : []);
  const merged = {}; const order = [];
  let added = true, round = 0;
  while (added) {
    added = false;
    for (const repos of perLeafRepos) {
      if (round < repos.length) {
        const r = repos[round];
        const key = normKey(r.url) || normKey(r.name);
        if (key && !merged[key]) { merged[key] = { name: r.name, url: r.url, contributed_by: r._leaf }; order.push(key); added = true; }
      }
    }
    round++;
  }
  return { parsedOk: parsed.filter((p) => p.json).length, totalLeaves: results.length, mergedRepos: order.map((k) => merged[k]) };
}

// ---- demo fleet: heterogeneous models, each with its own live-search config ----
const DEMO_PROMPT = 'Name ONE real, currently-existing GitHub repository relevant to durable-execution / workflow resumption for agent loops. Give its real URL. End your message with a single fenced json block: {"new_repos":[{"name":"owner/repo","url":"https://..."}]}';
const FLEET = [
  { id: 'sol-xhigh',  kind: 'cli-codex',    model: 'gpt-5.6-sol',  effort: 'xhigh', search: true, prompt: DEMO_PROMPT },
  { id: 'luna-max',   kind: 'cli-codex',    model: 'gpt-5.6-luna', effort: 'max',   search: true, prompt: DEMO_PROMPT },
  { id: 'glm-max',    kind: 'cli-opencode', model: 'zai-coding-plan/glm-5.2', variant: 'max', search: true, prompt: DEMO_PROMPT },
];

async function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes('--dry-run') || !argv.includes('--run');
  const concIdx = argv.indexOf('--concurrency');
  const concurrency = concIdx >= 0 ? parseInt(argv[concIdx + 1], 10) || 1 : 1;
  const timeoutMs = 300 * 1000;

  const resolved = FLEET.map(buildLeafCommand);

  console.log(`Fan-out prototype — codex ${CODEX_VERSION} — fleet of ${FLEET.length} heterogeneous leaves`);
  console.log(`Capability matrix: ${JSON.stringify(CAPABILITY_MATRIX)}`);
  console.log('');
  for (const r of resolved) {
    const shown = r.cmd === 'codex' ? r.argv.slice(0, -1).join(' ') + ' "<prompt>"' : r.argv.slice(0, -1).join(' ') + ' "<prompt>"';
    console.log(`  [${r.id}] ${r.effectiveConfig.model}  fp=${r.invocationFingerprint}`);
    console.log(`      ${r.cmd} ${shown}`);
    if (r.cmd === 'codex') console.log(`      live-search top-level flag present: ${r.argv[0] === '--search' ? 'YES (--search precedes exec)' : 'NO'}`);
  }

  if (dryRun) {
    console.log('\n[DRY RUN] resolved all leaf commands; dispatched nothing.');
    return;
  }

  console.log(`\n[RUN] dispatching ${FLEET.length} leaves at concurrency=${concurrency} ...`);
  const results = await runFleet(resolved, concurrency, timeoutMs);
  const reduced = reduceLeaves(results);
  const summary = {
    codexVersion: CODEX_VERSION,
    fleet: FLEET.map((f) => ({ id: f.id, kind: f.kind, model: f.model, effort: f.effort || f.variant, search: !!f.search })),
    concurrency,
    leaves: results.map((r) => ({ id: r.id, exit: r.code, bytes: (r.out || '').length, fingerprint: r.fingerprint })),
    reduce: reduced,
  };
  fs.writeFileSync(OUT, JSON.stringify(summary, null, 2) + '\n');
  console.log(`\n[RUN] done. parsed_ok ${reduced.parsedOk}/${reduced.totalLeaves}; merged ${reduced.mergedRepos.length} repos (provenance-tagged). Wrote ${path.relative(ROOT, OUT)}`);
  for (const m of reduced.mergedRepos) console.log(`   - ${m.name} (${m.url}) via ${m.contributed_by}`);
}

main();
