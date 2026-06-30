// Direct-orchestration deep-research driver for the 028 drift audit.
// Conductor (this script) owns ALL writes; executors are read-only and only
// return findings JSON on stdout. Guarantees non-convergence: it runs exactly
// MAX_ITERS iterations with no convergence short-circuit. Resumable: it resumes
// from the highest existing deltas/iter-NNN.jsonl.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO = process.cwd();
const ART = path.join(REPO, '.opencode/specs/system-spec-kit/028-memory-search-intelligence/research/drift-audit-2026-06-27');
const DELTAS = path.join(ART, 'deltas');
const ITERS_DIR = path.join(ART, 'iterations');
const STATE_LOG = path.join(ART, 'deep-research-state.jsonl');
const FINDINGS = path.join(ART, 'findings.jsonl');
const RESEARCH_MD = path.join(ART, 'research.md');
const ANGLES_JSON = path.join(ART, 'angles.json');
const RUN_LOG = path.join(ART, 'orchestrator.log');

const MAX_ITERS = parseInt(process.env.MAX_ITERS || '80', 10);
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '3', 10);
const PER_ITER_TIMEOUT_MS = parseInt(process.env.PER_ITER_TIMEOUT_MS || '1200000', 10); // 20 min safety net
const FORCE_MODEL = process.env.FORCE_MODEL || null; // validation override only

// Model allocation (interleaved). counts sum to 80.
// DECISION: from the mid-run switch onward, only kimi + gpt-5.5-fast (variant
// high, down from xhigh) — mimo over-explored into timeouts/parse-fails and
// deepseek was dropped to narrow the executor set. Counts 40/40 span the 80-slot
// schedule; the gap-filling resume only runs slots without a delta.
const MODELS = [
  { label: 'kimi', slug: 'kimi-for-coding/k2p7', variant: 'high', count: 40 },
  { label: 'gpt55', slug: 'openai/gpt-5.5-fast', variant: 'high', count: 40 },
];

const SCOPE = `Packet 028 (memory-search-intelligence) and everything it touches in THIS repo:
- commands: .opencode/commands/{memory,doctor,speckit,deep,create}/** (markdown routers + assets/*.yaml)
- agents: .claude/agents/**, .opencode/agents/**, .codex/agents/**
- skills: .opencode/skills/{system-spec-kit,deep-loop-workflows,deep-loop-runtime,cli-opencode,system-skill-advisor,system-code-graph,sk-*}/** (SKILL.md, references/, assets/, scripts/, dist/)
- the 028 spec tree: .opencode/specs/system-spec-kit/028-memory-search-intelligence/** (spec.md, children, changelog/, description.json, graph-metadata.json)
- MCP tool surfaces: mk_spec_memory (39 tools), mk_code_index (8), mk_skill_advisor (9); daemon CLI front doors .opencode/bin/{spec-memory,code-index,skill-advisor}.cjs
- changelogs, READMEs, ENV_REFERENCE.md, templates.`;

const INITIAL_ANGLES = [
  'Command<->impl drift: each command doc (.opencode/commands/**/*.md) vs its asset YAML/script/handler — flags, routes, documented behavior vs actual.',
  'Skill-doc<->code drift: SKILL.md claims (versions, flags, tool surfaces, counts) vs scripts/dist actual behavior.',
  'Undocumented features: code paths, env vars (ENV_REFERENCE.md), MCP tools, CLI flags present in code but absent from any doc.',
  'Documented-but-removed: doc/changelog claims for features no longer in code (dead refs, legacy names, opencode-go remnants).',
  'Agent drift: .claude/.opencode/.codex agent defs — cross-runtime agreement + match to the skills/commands that dispatch them (tools, model, routing).',
  'Changelog<->reality: 028 changelog tracks (incl 007-dark-flag-graduation, v3.7.0.0) vs shipped code — versions, dates, claims.',
  'Reference/asset consistency: references/*.md and templates vs the real schema/DB layout/contracts (e.g. embedder + vector-shard docs vs actual DB).',
  'MCP tool-surface drift: documented tool counts (39/8/9) and schemas vs registered tools + the daemon-CLI fallbacks.',
  'Spec metadata/graph integrity: description.json/graph-metadata.json across 028 children; phase-parent invariants; coverage gaps.',
  'Naming/routing consistency: gate-3 classifier, advisor maps, mode-registry.json vs actual packets; deprecated aliases (/ultrareview) and renames (ai-council->deep-ai-council).',
];

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(RUN_LOG, line);
}

function buildSchedule(models, total) {
  const st = models.map((m) => ({ ...m, acc: 0, placed: 0, rate: m.count / total }));
  const picks = [];
  for (let i = 0; i < total; i++) {
    st.forEach((s) => { s.acc += s.rate; });
    let best = null;
    for (const s of st) if (s.placed < s.count && (!best || s.acc > best.acc)) best = s;
    if (!best) for (const s of st) if (!best || s.acc > best.acc) best = s;
    best.acc -= 1; best.placed += 1; picks.push(best.label);
  }
  return picks;
}

function loadAngles() {
  if (fs.existsSync(ANGLES_JSON)) return JSON.parse(fs.readFileSync(ANGLES_JSON, 'utf8'));
  const a = { queue: [...INITIAL_ANGLES], all: [...INITIAL_ANGLES] };
  fs.writeFileSync(ANGLES_JSON, JSON.stringify(a, null, 2));
  return a;
}
function saveAngles(a) { fs.writeFileSync(ANGLES_JSON, JSON.stringify(a, null, 2)); }

function nextAngle(a) {
  if (a.queue.length === 0) {
    // refill: revisit all known angles, deeper, so the loop never idles
    a.queue = a.all.map((x) => `GO DEEPER / adjacent sweep: ${x}`);
  }
  return a.queue.shift();
}

function findingsDigest() {
  if (!fs.existsSync(FINDINGS)) return { total: 0, recent: [] };
  const lines = fs.readFileSync(FINDINGS, 'utf8').split('\n').filter(Boolean);
  const recent = lines.slice(-60).map((l) => {
    try { const f = JSON.parse(l); return `${f.type} @ ${f.location}`; } catch { return null; }
  }).filter(Boolean);
  return { total: lines.length, recent };
}

function lastIterDone() {
  if (!fs.existsSync(DELTAS)) return 0;
  const nums = fs.readdirSync(DELTAS)
    .map((f) => (f.match(/^iter-(\d+)\.jsonl$/) || [])[1])
    .filter(Boolean).map(Number);
  return nums.length ? Math.max(...nums) : 0;
}

function buildPrompt(angle, digest) {
  const seen = digest.recent.length
    ? digest.recent.map((s) => `  - ${s}`).join('\n')
    : '  (none yet)';
  return `You are a READ-ONLY drift auditor for packet 028 in this repository. Investigate with reads/grep only and report concrete, verifiable issues.

WHERE 028 LIVES (context, NOT a checklist to sweep)
${SCOPE}

YOUR ANGLE THIS ITERATION (focus narrowly on THIS only)
${angle}

ALREADY-FOUND (${digest.total} so far — do NOT repeat these; find NEW, distinct issues):
${seen}

TIME BUDGET (critical — read carefully)
- You have a STRICT budget. Do a FOCUSED investigation of YOUR ANGLE only. Do NOT sweep the whole scope.
- Cap yourself to roughly 15-25 targeted reads/greps. The moment you have 3-6 evidence-backed findings, STOP investigating and emit the JSON.
- A timeout returns NOTHING and wastes the iteration. Returning 3 solid findings quickly beats exploring exhaustively. Emit the JSON well before you run out of budget.

HARD RULES
- READ-ONLY. Do NOT write, edit, create, move, or delete ANY file. Do NOT run mutating commands, git writes, or any /doctor or memory_save. Investigate only by reading files and grepping.
- Every finding MUST cite a real file path with a line number and a short verbatim quote as evidence. No speculation, no "might". If you cannot verify it in a file, do not report it.
- Stay on YOUR ANGLE. Be specific to 028 and what it touches. Prefer issues nobody has found yet.

OUTPUT
Keep any reasoning brief. Your VERY LAST line MUST be a single-line JSON object, nothing after it:
{"findings":[{"location":"path:line","type":"drift|undocumented|dead|contradiction|misalignment","severity":"P0|P1|P2","title":"short","evidence":"verbatim quote or precise description","fix":"concrete suggested fix"}],"new_angles":[{"angle":"a sharper or adjacent angle to pursue next","trigger":"which finding/observation prompted it"}]}`;
}

function dispatch(model, prompt) {
  return new Promise((resolve) => {
    const child = spawn('opencode', ['run', '--model', model.slug, '--variant', model.variant, prompt], {
      cwd: REPO,
      env: { ...process.env, AI_SESSION_CHILD: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '', err = '', done = false;
    const cap = 600000;
    const timer = setTimeout(() => { if (!done) { done = true; try { child.kill('SIGTERM'); } catch {} resolve({ out, err, timedOut: true, code: null }); } }, PER_ITER_TIMEOUT_MS);
    child.stdout.on('data', (d) => { out += d; if (out.length > cap) out = out.slice(-cap); });
    child.stderr.on('data', (d) => { err += d; if (err.length > 20000) err = err.slice(-20000); });
    child.on('close', (code) => { if (!done) { done = true; clearTimeout(timer); resolve({ out, err, timedOut: false, code }); } });
    child.on('error', (e) => { if (!done) { done = true; clearTimeout(timer); resolve({ out, err: String(e), timedOut: false, code: -1 }); } });
  });
}

function parseResult(out) {
  const lines = out.split('\n').map((l) => l.trim()).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i];
    if (l.startsWith('{') && l.endsWith('}')) {
      try { const o = JSON.parse(l); if (o && Array.isArray(o.findings)) return { ok: true, ...o }; } catch {}
    }
  }
  // lenient: last {...} block anywhere
  const m = out.match(/\{[\s\S]*\}\s*$/);
  if (m) { try { const o = JSON.parse(m[0]); if (o && Array.isArray(o.findings)) return { ok: true, ...o }; } catch {} }
  return { ok: false, findings: [], new_angles: [] };
}

function pad(n) { return String(n).padStart(3, '0'); }

async function runIteration(iter, label, angles) {
  if (FORCE_MODEL) label = FORCE_MODEL;
  const model = MODELS.find((m) => m.label === label);
  const angle = nextAngle(angles);
  saveAngles(angles);
  const digest = findingsDigest();
  const ts0 = new Date().toISOString();
  log(`iter ${iter} START model=${label} angle="${angle.slice(0, 80)}"`);
  fs.appendFileSync(STATE_LOG, JSON.stringify({ event: 'iteration_start', iter, model: label, angle, at: ts0 }) + '\n');

  const res = await dispatch(model, buildPrompt(angle, digest));
  const parsed = parseResult(res.out);
  const ts1 = new Date().toISOString();

  const findings = (parsed.findings || []).map((f) => ({ ...f, iter, model: label, angle, at: ts1 }));
  // persist findings
  for (const f of findings) fs.appendFileSync(FINDINGS, JSON.stringify(f) + '\n');
  // delta file (canonical iteration record + finding records)
  const deltaLines = [JSON.stringify({ type: 'iteration', iter, model: label, angle, at: ts1, findings_count: findings.length, parse_ok: parsed.ok, timed_out: res.timedOut, code: res.code })];
  for (const f of findings) deltaLines.push(JSON.stringify({ type: 'finding', ...f }));
  fs.writeFileSync(path.join(DELTAS, `iter-${pad(iter)}.jsonl`), deltaLines.join('\n') + '\n');
  // per-iteration md
  const mdParts = [`# Iteration ${iter} — ${label}`, ``, `**Angle:** ${angle}`, ``, `**Findings:** ${findings.length}${parsed.ok ? '' : ' (PARSE FAILED — raw output captured)'}`, ``];
  for (const f of findings) mdParts.push(`- **[${f.severity || '?'}] ${f.type}** \`${f.location}\` — ${f.title || ''}\n  - evidence: ${f.evidence || ''}\n  - fix: ${f.fix || ''}`);
  if (!parsed.ok) mdParts.push('```\n' + res.out.slice(-3000) + '\n```');
  fs.writeFileSync(path.join(ITERS_DIR, `iteration-${pad(iter)}.md`), mdParts.join('\n') + '\n');
  // append to running research.md registry
  const rParts = [`\n## Iteration ${iter} — ${label} — ${ts1}`, `Angle: ${angle}`, ``];
  if (findings.length === 0) rParts.push(`_(no findings${parsed.ok ? '' : '; parse failed'})_`);
  for (const f of findings) rParts.push(`- [${f.severity || '?'}] **${f.type}** \`${f.location}\` — ${f.title || ''}; evidence: ${f.evidence || ''}; fix: ${f.fix || ''}`);
  fs.appendFileSync(RESEARCH_MD, rParts.join('\n') + '\n');
  // grow angle backlog from executor suggestions
  for (const na of parsed.new_angles || []) {
    const text = typeof na === 'string' ? na : na.angle;
    if (text && !angles.all.includes(text)) { angles.all.push(text); angles.queue.push(text); }
  }
  saveAngles(angles);
  fs.appendFileSync(STATE_LOG, JSON.stringify({ event: 'iteration_complete', iter, model: label, angle, findings: findings.length, parse_ok: parsed.ok, timed_out: res.timedOut, at: ts1 }) + '\n');
  log(`iter ${iter} DONE model=${label} findings=${findings.length} parse_ok=${parsed.ok} timed_out=${res.timedOut} code=${res.code}`);
  return findings.length;
}

async function main() {
  if (!fs.existsSync(RESEARCH_MD)) {
    fs.writeFileSync(RESEARCH_MD, `# 028 Drift Audit — direct-orchestration deep research\n\nNon-converging sweep, ${MAX_ITERS} iterations, 4 executors (kimi 30 / mimo 20 / gpt 20 / deepseek 10), read-only.\nStarted ${new Date().toISOString()}.\n\nRunning, expanding findings registry below (no convergence summary).\n`);
  }
  const schedule = buildSchedule(MODELS, 80); // fixed 80-slot allocation; MAX_ITERS may cap for validation
  const angles = loadAngles();
  // Gap-filling resume: run every slot in 1..MAX_ITERS that has no delta yet, so
  // a mid-run kill that left holes (e.g. iters 31,32) is repaired rather than skipped.
  const haveDelta = new Set(fs.existsSync(DELTAS)
    ? fs.readdirSync(DELTAS).map((f) => (f.match(/iter-(\d+)\.jsonl$/) || [])[1]).filter(Boolean).map(Number)
    : []);
  const pending = [];
  for (let i = 1; i <= MAX_ITERS; i++) if (!haveDelta.has(i)) pending.push(i);
  log(`RUN resume: ${pending.length} pending iters (first: ${pending.slice(0, 6).join(',')}) max=${MAX_ITERS} concurrency=${CONCURRENCY}`);
  for (let k = 0; k < pending.length; k += CONCURRENCY) {
    const wave = pending.slice(k, k + CONCURRENCY).map((j) => runIteration(j, schedule[j - 1], angles));
    await Promise.all(wave);
  }
  const total = fs.existsSync(FINDINGS) ? fs.readFileSync(FINDINGS, 'utf8').split('\n').filter(Boolean).length : 0;
  fs.appendFileSync(RESEARCH_MD, `\n---\nRun reached iteration ${MAX_ITERS}. Total findings recorded: ${total}. Angle backlog size: ${angles.all.length}.\n`);
  log(`RUN complete through iter=${MAX_ITERS} total_findings=${total}`);
}

main().catch((e) => { log(`FATAL ${e && e.stack || e}`); process.exit(1); });
