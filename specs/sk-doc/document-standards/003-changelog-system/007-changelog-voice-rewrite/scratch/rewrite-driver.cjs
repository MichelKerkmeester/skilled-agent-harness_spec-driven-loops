#!/usr/bin/env node
'use strict';

// Rewrites released changelogs for sentence length and plain voice, one file per
// dispatch. The worker (DeepSeek Flash through Mistral Vibe) gets no tools: it
// returns the whole file, and this driver writes it and judges it. A draft stays
// on disk only after it passes every gate, in this order:
//   1. structure lock: every non-prose line, inline code span, number and bullet
//      of the original is still there, so no fact can leave through a cut line
//   2. sentence rules: no sentence over 22 words and a mean of 10 or fewer
//   3. no new shape failure: every other house-checker rule fails no more often
//      than it did on the original
//   4. voice scan: no hard blocker, or no more than a recorded self-reference has
//   5. fact check: gpt-6-luna through cli-codex finds nothing dropped, added or
//      changed
// Anything else is restored from the saved original, and the last draft is kept
// in failed/ for a person to read.
//
// Usage: rewrite-driver.cjs [--dry-run] [--slots N] [--retry-failed]
//                           [--state FILE] [--wave NAME] <list-file>

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const ROOT = process.cwd();
const HERE = __dirname;
const HOUSE_CHECKER = '.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py';
const HVR = '.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py';
// The house voice the worker copies. It passes the sentence rules, which the
// template's older exemplar does not.
const HOUSE_STYLE_FILE = '.skilled/skills/system-spec-kit/changelog/v2.13.2.0.md';
const VIBE_CONFIG = '.vibe/config.toml';
const RENDER_HOOKS = '.vibe/plugins/repo-guards/render-home-hooks.cjs';
const ORIG_DIR = path.join(HERE, 'orig');
const FAIL_DIR = path.join(HERE, 'failed');
const RUN_DIR = path.join(HERE, 'runs');
const STOP_FILE = path.join(HERE, process.env.DRIVER_STOP || 'STOP');
const HARD_BLOCKERS = path.join(HERE, 'hard-blockers.md');

const WORKER_ALIAS = 'deepseek-flash';
// The operator lowered the worker's effort for this job only. The repository
// config keeps max, so the change lives in each dispatch's throwaway home.
const WORKER_THINKING = 'high';
const VERIFY_MODEL = 'gpt-6-luna';
const VERIFY_EFFORT = process.env.DRIVER_VERIFY_EFFORT || 'xhigh';
const MAX_ATTEMPTS = 3;
const MAX_SLOTS = 4;
const REWRITE_TIMEOUT_S = 15 * 60;
const VERIFY_TIMEOUT_MS = 15 * 60 * 1000;
const SENTENCE_RULES = new Set(['sentence-max', 'sentence-mean']);
// Release entries only: the release line, with its v1+/ style subfolders, and
// every skill's changelog folder. Templates and READMEs in those folders are not
// entries.
const ENTRY_RE = /^\.skilled\/(?:changelog\/skilled|skills\/.+\/changelogs?)\/(?:v\d+\+\/)?v\d+(?:\.\d+)+[^/]*\.md$/;
// A usage limit stops the run instead of moving work to another provider.
const LIMIT_RE = /usage limit|rate[ _-]?limit|too many requests|\b429\b|insufficient_quota|quota exceeded|hit your (usage )?limit/i;

const CHILD_ENV = { ...process.env, AI_SESSION_CHILD: '1', SYSTEM_SPEC_GATE_ENFORCE: '0', MK_SPEC_GATE_ENFORCE: '0' };

const read = (p) => fs.readFileSync(p, 'utf8');
const now = () => new Date().toISOString();
const safeName = (file) => file.replace(/[^A-Za-z0-9._-]+/g, '__');

function parseArgs(argv) {
  const out = { dryRun: false, slots: 2, retryFailed: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--slots') out.slots = Number(argv[++i]);
    else if (a === '--retry-failed') out.retryFailed = true;
    else if (a === '--state') out.state = argv[++i];
    else if (a === '--wave') out.wave = argv[++i];
    else if (a.startsWith('--')) throw new Error(`unknown argument ${a}`);
    else out.list = a;
  }
  if (!out.list) throw new Error('usage: rewrite-driver.cjs [--dry-run] [--slots N] [--retry-failed] [--state FILE] [--wave NAME] <list-file>');
  if (!Number.isInteger(out.slots) || out.slots < 1 || out.slots > MAX_SLOTS) throw new Error(`--slots runs 1 to ${MAX_SLOTS}`);
  out.state = out.state || path.join(HERE, 'state.jsonl');
  out.wave = out.wave || path.basename(out.list, '.txt');
  return out;
}

// ---------------------------------------------------------------------------
// Self-references: files whose blocker word is a name the rewrite must keep.
// ---------------------------------------------------------------------------

function loadHardBlockers() {
  const rows = new Map();
  if (!fs.existsSync(HARD_BLOCKERS)) return rows;
  for (const line of read(HARD_BLOCKERS).split('\n')) {
    const m = line.match(/^\| `([^`]+)` \| ([^|]+) \| ([^|]+) \| (fix|self-reference) \| ([^|]+) \|$/);
    if (m) rows.set(m[1], { klass: m[4], action: m[5].trim() });
  }
  return rows;
}
const BLOCKERS = loadHardBlockers();

// A file that joins two spec folders with a semicolon gets one sanctioned change
// to a locked line.
const isSpecSemicolonFix = (file) => /spec folders joined by a semicolon/i.test((BLOCKERS.get(file) || {}).action || '');

function extraLock(file) {
  const row = BLOCKERS.get(file);
  if (!row) return '';
  if (row.klass === 'self-reference') return `- This file names \`harness-diagram\`, an origin's own name. Keep the word harness-diagram exactly where the original has it.`;
  if (isSpecSemicolonFix(file)) return '- One locked line changes: on the line that starts with > Spec folder:, replace the semicolon between the two folders with the word and. Change nothing else on that line.';
  return '';
}

// ---------------------------------------------------------------------------
// Structure lock
// ---------------------------------------------------------------------------

function splitFrontmatter(text) {
  if (text.startsWith('---\n')) {
    const end = text.indexOf('\n---\n', 4);
    if (end !== -1) return [text.slice(0, end + 5), text.slice(end + 5)];
  }
  return ['', text];
}

const BULLET_RE = /^\s*(?:[-*+]|\d+\.)\s+/;

// Locked lines are kept in order. Prose is the paragraph and bullet text.
function anatomy(text) {
  const [front, body] = splitFrontmatter(text);
  const locked = [];
  const prose = [];
  let bullets = 0;
  let fence = null;
  for (const line of body.split('\n')) {
    const t = line.trim();
    const open = t.match(/^(```+|~~~+)/);
    if (fence) {
      locked.push(line);
      if (open && t.startsWith(fence)) fence = null;
      continue;
    }
    if (open) {
      fence = open[1];
      locked.push(line);
      continue;
    }
    if (!t) continue;
    if (/^#{1,6}\s/.test(t) || t.startsWith('|') || t.startsWith('>') || t === '&nbsp;' || /^-{3,}$/.test(t) || /^<!--.*-->$/.test(t)) {
      locked.push(line.trimEnd());
      continue;
    }
    if (BULLET_RE.test(line)) bullets += 1;
    // A trailing tag such as <!-- section: Saves --> on a bullet is locked too.
    for (const m of line.matchAll(/<!--.*?-->/g)) locked.push(m[0]);
    prose.push(line.replace(/<!--.*?-->/g, ''));
  }
  const proseText = prose.join('\n');
  // A code span opens with a run of backticks and closes with a run of the same
  // length, so `` `name` `` is one span holding a backtick, not two broken ones.
  const SPAN_RE = /(?<!`)(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/g;
  const spans = [...proseText.matchAll(SPAN_RE)].map((m) => m[2]);
  const plain = proseText.replace(SPAN_RE, ' ');
  const numbers = [...plain.matchAll(/\d+(?:[.,]\d+)*/g)].map((m) => m[0]);
  return { front, locked, bullets, spans, numbers };
}

function multisetDiff(a, b) {
  const count = new Map();
  for (const x of a) count.set(x, (count.get(x) || 0) + 1);
  for (const x of b) count.set(x, (count.get(x) || 0) - 1);
  const missing = [];
  const extra = [];
  for (const [x, n] of count) {
    if (n > 0) missing.push(x);
    if (n < 0) extra.push(x);
  }
  return { missing, extra };
}

function structureLock(file, oldText, newText) {
  const errors = [];
  const o = anatomy(oldText);
  const n = anatomy(newText);
  if (o.front !== n.front) errors.push('The frontmatter changed. Copy it exactly.');
  const norm = (l) => (isSpecSemicolonFix(file) && l.startsWith('> Spec folder:') ? l.replace(/;\s*/g, ' and ') : l);
  const ol = o.locked.map(norm);
  const nl = n.locked.map(norm);
  if (ol.length !== nl.length) errors.push(`The file has ${nl.length} locked lines (headings, tables, fences, > lines, &nbsp;, ---, comments) where the original has ${ol.length}. Copy every one exactly.`);
  for (let i = 0; i < Math.min(ol.length, nl.length); i += 1) {
    if (ol[i] !== nl[i]) {
      errors.push(`Locked line changed. Original: ${ol[i]} | Draft: ${nl[i]}`);
      break;
    }
  }
  if (o.bullets !== n.bullets) errors.push(`The draft has ${n.bullets} bullets where the original has ${o.bullets}. A bullet stays one bullet.`);
  // Each token must appear at least as often as in the original, so a dropped
  // repeat fails. A split sentence may name a token again, so more is allowed,
  // but a token the original never had is not.
  const spans = multisetDiff(o.spans, n.spans);
  for (const s of spans.missing) errors.push(`Inline code span missing or used fewer times: \`${s}\`. Keep every use with the fact it belongs to.`);
  for (const s of spans.extra) if (!o.spans.includes(s)) errors.push(`Inline code span not in the original: \`${s}\`.`);
  const nums = multisetDiff(o.numbers, n.numbers);
  for (const s of nums.missing) errors.push(`Number missing or used fewer times in the prose: ${s}. Keep every use, written the same way.`);
  for (const s of nums.extra) if (!o.numbers.includes(s)) errors.push(`Number not in the original's prose: ${s}.`);
  return errors;
}

// ---------------------------------------------------------------------------
// House checker and voice scan
// ---------------------------------------------------------------------------

function houseCheck(file) {
  const r = spawnSync('python3', [HOUSE_CHECKER, file], { cwd: ROOT, encoding: 'utf8' });
  const byRule = {};
  const lines = [];
  for (const line of `${r.stdout}`.split('\n')) {
    const m = line.match(/^\s+\[([a-z-]+)\]\s+(.*)$/);
    if (!m) continue;
    byRule[m[1]] = (byRule[m[1]] || 0) + 1;
    lines.push(`[${m[1]}] ${m[2]}`);
  }
  if (r.status !== 0 && r.status !== 1) lines.push(`[checker-error] the house checker exited ${r.status}: ${String(r.stderr || r.stdout || r.error || '').trim().slice(0, 200)}`);
  return { exit: r.status, byRule, lines };
}

function voiceScan(file) {
  const r = spawnSync('python3', [HVR, '--json', file], { cwd: ROOT, encoding: 'utf8' });
  try {
    const rep = JSON.parse(r.stdout).reports[0];
    const hard = rep.findings.filter((f) => f.severity === 'hard').map((f) => `line ${f.line}: ${f.term} in "${f.text.trim().slice(0, 100)}"`);
    return { hard: rep.hardBlockers, lines: hard };
  } catch {
    return { hard: -1, lines: [`voice scan output unreadable: ${r.stderr || r.stdout}`] };
  }
}

function gates(file, oldText, baseline) {
  const newText = read(path.join(ROOT, file));
  const items = [...structureLock(file, oldText, newText)];
  const house = houseCheck(file);
  for (const l of house.lines) if (/^\[(?:sentence-|checker-error)/.test(l)) items.push(l);
  for (const [rule, n] of Object.entries(house.byRule)) {
    if (SENTENCE_RULES.has(rule)) continue;
    if (n > (baseline.house.byRule[rule] || 0)) items.push(`New [${rule}] failure the original did not have: ${house.lines.filter((l) => l.startsWith(`[${rule}]`)).join(' / ')}`);
  }
  const voice = voiceScan(file);
  const selfRef = (BLOCKERS.get(file) || {}).klass === 'self-reference';
  const allowed = selfRef ? baseline.voice.hard : 0;
  if (voice.hard < 0 || voice.hard > allowed) items.push(...voice.lines.map((l) => `Voice scan hard blocker: ${l}`));
  return { items, house, voice };
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

function runProcess(cmd, args, opts) {
  return new Promise((resolve) => {
    const log = fs.openSync(opts.log, 'w');
    const child = spawn(cmd, args, { cwd: opts.cwd, env: { ...CHILD_ENV, ...(opts.env || {}) }, stdio: ['ignore', log, log] });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      setTimeout(() => child.kill('SIGKILL'), 10000);
    }, opts.timeoutMs);
    const done = (code, extra = '') => {
      clearTimeout(timer);
      fs.closeSync(log);
      resolve({ code, timedOut, output: read(opts.log) + extra });
    };
    child.on('close', (code) => done(code));
    child.on('error', (err) => done(-1, `\nspawn error: ${err.message}`));
  });
}

// The home holds a copy of the repository config with only the worker row's
// thinking level changed, and the rendered repository hooks.
function makeVibeHome(home) {
  fs.mkdirSync(home, { recursive: true });
  const config = read(path.join(ROOT, VIBE_CONFIG));
  const row = new RegExp(`(alias = "${WORKER_ALIAS}"\\s*\\nthinking = )"max"`);
  if (!row.test(config)) throw new Error(`cannot find the ${WORKER_ALIAS} thinking row in ${VIBE_CONFIG}`);
  fs.writeFileSync(path.join(home, 'config.toml'), config.replace(row, `$1"${WORKER_THINKING}"`));
  const r = spawnSync('node', [path.join(ROOT, RENDER_HOOKS), home], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`render-home-hooks failed: ${r.stderr || r.stdout}`);
}

function findThinking(config) {
  const stack = [config];
  while (stack.length) {
    const x = stack.pop();
    if (!x || typeof x !== 'object') continue;
    if (x.alias === WORKER_ALIAS && x.thinking) return x.thinking;
    stack.push(...Object.values(x));
  }
  return null;
}

async function dispatchWorker(prompt, tag) {
  const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'voice-rewrite-'));
  const home = path.join(runDir, '.vibe-home');
  makeVibeHome(home);
  const promptFile = path.join(runDir, 'prompt.md');
  fs.writeFileSync(promptFile, prompt);
  const out = path.join(runDir, 'out');
  const log = path.join(RUN_DIR, `${tag}.worker.log`);
  const res = await runProcess('vibe', ['--prompt-file', promptFile, '--model', WORKER_ALIAS, '--output', 'text', '--output-dir', out, '--time-limit', String(REWRITE_TIMEOUT_S)], {
    cwd: runDir, log, timeoutMs: (REWRITE_TIMEOUT_S + 120) * 1000, env: { VIBE_HOME: home },
  });
  let exp = null;
  const expFile = path.join(out, 'export.json');
  if (fs.existsSync(expFile)) {
    exp = JSON.parse(read(expFile));
    fs.copyFileSync(expFile, path.join(RUN_DIR, `${tag}.worker.export.json`));
  }
  // A Vibe helper can still be flushing its journal when the main process exits,
  // so a failed cleanup leaves a temp folder behind rather than stopping the run.
  // Vibe also unpacks its bundled plugins read-only, so they are made writable
  // before the delete.
  spawnSync('chmod', ['-R', 'u+w', runDir]);
  try {
    fs.rmSync(runDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
  } catch (err) {
    console.log(`${now()} left temp folder ${runDir}: ${err.code}`);
  }
  const ok = Boolean(exp && exp.exit_code === 0 && exp.outcome === 'finished');
  const usage = exp && exp.usage ? { input: exp.usage.input_tokens, cached: exp.usage.cached_input_tokens, output: exp.usage.output_tokens, cost_usd: exp.cost_usd } : null;
  return { ok, output: res.output, timedOut: res.timedOut, usage, thinking: exp ? findThinking(exp.config) : null, outcome: exp ? `${exp.exit_code}/${exp.outcome}` : 'no export.json' };
}

// The reply is one fenced block. A reply that holds the file without the fence
// is not accepted, because a stray preamble would land in the changelog.
function extractFile(reply) {
  const m = reply.match(/~~~(?:markdown|md)?\n([\s\S]*?)\n~~~\s*$/m) || reply.match(/~~~(?:markdown|md)?\n([\s\S]*)\n~~~/);
  return m ? `${m[1].replace(/\s+$/, '')}\n` : null;
}

async function dispatchVerify(prompt, tag) {
  const last = path.join(RUN_DIR, `${tag}.verify.last.txt`);
  fs.rmSync(last, { force: true });
  const log = path.join(RUN_DIR, `${tag}.verify.log`);
  const res = await runProcess('codex', [
    'exec', '--model', VERIFY_MODEL,
    '-c', `model_reasoning_effort="${VERIFY_EFFORT}"`,
    '-c', 'service_tier="fast"',
    '-c', 'approval_policy=never',
    '-c', 'project_doc_max_bytes=0',
    '--sandbox', 'read-only',
    '--json', '-o', last, prompt,
  ], { cwd: ROOT, log, timeoutMs: VERIFY_TIMEOUT_MS });
  let usage = null;
  for (const line of res.output.split('\n')) {
    if (!line.startsWith('{')) continue;
    try {
      const ev = JSON.parse(line);
      if (ev.usage) usage = { input: ev.usage.input_tokens, cached: ev.usage.cached_input_tokens, output: ev.usage.output_tokens, reasoning: ev.usage.reasoning_output_tokens };
    } catch { /* not an event line */ }
  }
  const reply = fs.existsSync(last) ? read(last) : '';
  return { reply, output: res.output, usage, limited: LIMIT_RE.test(res.output) && !reply };
}

function extractVerdict(text) {
  const from = text.lastIndexOf('{"verdict"') !== -1 ? text.lastIndexOf('{"verdict"') : text.indexOf('{');
  if (from === -1) return null;
  let depth = 0;
  for (let i = from; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1;
    else if (text[i] === '}' && (depth -= 1) === 0) {
      try {
        const obj = JSON.parse(text.slice(from, i + 1));
        // A verdict without its three lists is not one: a bare PASS cannot pass a
        // file, and a string where a list belongs cannot crash the run.
        const lists = ['dropped', 'added', 'changed'].every((k) => Array.isArray(obj[k]));
        return typeof obj.verdict === 'string' && lists ? obj : null;
      } catch { return null; }
    }
  }
  return null;
}

const asText = (x) => (typeof x === 'string' ? x : JSON.stringify(x));
const verdictItems = (v) => [
  ...(v.dropped || []).map((x) => `dropped (restore it): ${asText(x)}`),
  ...(v.added || []).map((x) => `added (remove it): ${asText(x)}`),
  ...(v.changed || []).map((x) => `changed (correct it): ${asText(x)}`),
];

// ---------------------------------------------------------------------------
// One file
// ---------------------------------------------------------------------------

const HOUSE_STYLE = () => read(path.join(ROOT, HOUSE_STYLE_FILE));

function fillRewrite(file, oldText, draft, items) {
  let prompt = read(path.join(HERE, 'brief-rewrite.md'))
    .replace('{{EXTRA_LOCK}}', () => extraLock(file))
    .replace('{{HOUSE_STYLE}}', HOUSE_STYLE)
    .replace('{{ORIGINAL}}', () => oldText.replace(/\n$/, ''));
  if (draft) {
    prompt += `\nPREVIOUS ATTEMPT\nYour previous draft is below. It failed these checks. Fix every item and keep every other line of the draft as it is.\n${items.map((x) => `- ${x}`).join('\n')}\n<<<PREVIOUS DRAFT\n${draft.replace(/\n$/, '')}\nPREVIOUS DRAFT>>>\n`;
  }
  return prompt;
}

const fillVerify = (oldText, newText) => read(path.join(HERE, 'brief-verify.md'))
  .replace('{{ORIGINAL}}', () => oldText.replace(/\n$/, ''))
  .replace('{{REWRITE}}', () => newText.replace(/\n$/, ''));

class LimitHit extends Error {}

const READY = new Set();

async function processFile(file) {
  const abs = path.join(ROOT, file);
  const orig = path.join(ORIG_DIR, safeName(file));
  const head = spawnSync('git', ['-c', 'core.fsmonitor=false', 'show', `HEAD:${file}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 });
  if (head.status !== 0) throw new Error(`cannot read ${file} at HEAD`);
  // The original is always the committed text. A saved copy from before HEAD
  // moved would overwrite newer content, so it is replaced.
  if (!fs.existsSync(orig) || read(orig) !== head.stdout) fs.writeFileSync(orig, head.stdout);
  const oldText = head.stdout;
  // Uncommitted text in the working copy is kept aside before the original
  // replaces it, so a manual edit is never lost.
  const working = read(abs);
  if (working !== oldText) {
    fs.mkdirSync(FAIL_DIR, { recursive: true });
    fs.writeFileSync(path.join(FAIL_DIR, `${safeName(file)}.working`), working);
    console.log(`${now()} ${file} differed from HEAD; its working text is saved in failed/`);
  }
  // Only from here is the saved original known to be HEAD, so only from here may
  // an error path restore it.
  READY.add(file);
  fs.writeFileSync(abs, oldText);
  const baseline = { house: houseCheck(file), voice: voiceScan(file) };
  // A file that already meets the sentence rules and has no hard blocker has
  // nothing for this pass to fix, so it is never sent and stays byte-identical.
  if (!Object.keys(baseline.house.byRule).some((r) => SENTENCE_RULES.has(r)) && baseline.voice.hard === 0) {
    return { status: 'unchanged', attempts: 0, history: [], tokens: { worker: {}, verify: {} }, thinking: null };
  }
  const tag = safeName(file);
  const history = [];
  const tokens = { worker: { input: 0, cached: 0, output: 0, cost_usd: 0 }, verify: { input: 0, cached: 0, output: 0, reasoning: 0 } };
  const add = (into, u) => { if (u) for (const k of Object.keys(into)) into[k] += Number(u[k] || 0); };
  let thinking = null;
  let draft = null;
  let items = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const w = await dispatchWorker(fillRewrite(file, oldText, draft, items), `${tag}.a${attempt}`);
    add(tokens.worker, w.usage);
    thinking = w.thinking || thinking;
    if (!w.ok) {
      if (LIMIT_RE.test(w.output)) throw new LimitHit(`worker usage limit on ${file}`);
      history.push({ attempt, problem: `worker did not finish (${w.outcome}${w.timedOut ? ', timed out' : ''})` });
      continue;
    }
    const text = extractFile(w.output);
    if (!text) {
      history.push({ attempt, problem: 'reply held no fenced file' });
      items = ['Your reply held no file. Reply with the whole file inside one ~~~markdown fenced block and nothing else.'];
      continue;
    }
    fs.writeFileSync(abs, text);
    draft = text;
    const g = gates(file, oldText, baseline);
    if (g.items.length) {
      items = g.items;
      history.push({ attempt, problem: 'gates', items });
      continue;
    }
    const v = await dispatchVerify(fillVerify(oldText, text), `${tag}.a${attempt}`);
    add(tokens.verify, v.usage);
    if (v.limited) throw new LimitHit(`fact checker usage limit on ${file}`);
    const verdict = extractVerdict(v.reply);
    if (!verdict) {
      history.push({ attempt, problem: 'fact checker gave no verdict' });
      items = [];
      continue;
    }
    const found = verdictItems(verdict);
    if (verdict.verdict === 'PASS' && !found.length) {
      return { status: 'pass', attempts: attempt, history, tokens, thinking, sha256: crypto.createHash('sha256').update(text).digest('hex') };
    }
    items = found.length ? found : ['The fact checker failed the draft without naming an item. Compare every sentence with the original again.'];
    history.push({ attempt, problem: 'fact check', items });
  }
  if (draft) fs.writeFileSync(path.join(FAIL_DIR, safeName(file)), draft);
  fs.writeFileSync(abs, oldText);
  return { status: 'restored', attempts: MAX_ATTEMPTS, history, tokens, thinking };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const GATE_LIST = [
  'structure lock: frontmatter, headings, tables, fences, > lines, &nbsp;, ---, comments, bullets, inline code spans and numbers match the original',
  'sentence rules: no [sentence-max] and no [sentence-mean] from the house checker',
  'no new shape failure: every other house-checker rule fails no more often than on the original',
  'voice scan: 0 hard blockers, or no more than the original for a recorded self-reference',
  `fact check: ${VERIFY_MODEL} at ${VERIFY_EFFORT} on the fast tier through codex exec, read-only, finds nothing dropped, added or changed`,
];

function loadState(stateFile) {
  const last = new Map();
  if (fs.existsSync(stateFile)) {
    for (const line of read(stateFile).split('\n').filter(Boolean)) {
      const rec = JSON.parse(line);
      last.set(rec.file, rec.status);
    }
  }
  return last;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const listed = read(opts.list).split('\n').map((l) => l.trim()).filter(Boolean);
  const refused = listed.filter((f) => !ENTRY_RE.test(f) || !fs.existsSync(path.join(ROOT, f)));
  const state = loadState(opts.state);
  const queue = listed.filter((f) => !refused.includes(f)).filter((f) => {
    const s = state.get(f);
    return !(s === 'pass' || s === 'unchanged' || (s === 'restored' && !opts.retryFailed));
  });

  console.log(`${now()} wave=${opts.wave} listed=${listed.length} queued=${queue.length} refused=${refused.length} slots=${opts.slots}`);
  for (const f of refused) console.log(`refused (not a release entry on disk): ${f}`);
  console.log(`worker: vibe --model ${WORKER_ALIAS} at thinking ${WORKER_THINKING}, no tools, scratch cwd and throwaway VIBE_HOME`);
  console.log('gates, in order:');
  GATE_LIST.forEach((g, i) => console.log(`  ${i + 1}. ${g}`));
  if (opts.dryRun) {
    for (const f of queue) console.log(`would rewrite: ${f}`);
    console.log('dry run: nothing dispatched');
    return;
  }
  if (refused.length) throw new Error('the list names files that are not release entries; fix the list first');

  for (const d of [ORIG_DIR, FAIL_DIR, RUN_DIR]) fs.mkdirSync(d, { recursive: true });
  const counts = { pass: 0, restored: 0, unchanged: 0 };
  let stopReason = null;
  const inFlight = new Set();
  const restore = (file) => {
    const orig = path.join(ORIG_DIR, safeName(file));
    if (READY.has(file) && fs.existsSync(orig)) fs.writeFileSync(path.join(ROOT, file), read(orig));
  };
  // An interrupted run puts every file it was working on back before it exits.
  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, () => {
      for (const f of inFlight) restore(f);
      console.log(`${now()} ${sig}: restored ${inFlight.size} in-flight file(s)`);
      process.exit(sig === 'SIGINT' ? 130 : 143);
    });
  }

  async function worker() {
    while (!stopReason && !fs.existsSync(STOP_FILE) && queue.length) {
      const file = queue.shift();
      const started = Date.now();
      let res;
      inFlight.add(file);
      try {
        res = await processFile(file);
      } catch (err) {
        restore(file);
        inFlight.delete(file);
        // Any error stops new work, and the other slots finish their files, so
        // no draft is left on disk without a record.
        stopReason = err instanceof LimitHit ? err.message : `error on ${file}: ${err.stack || err}`;
        console.log(`${now()} stopping: ${stopReason}. The file is restored and stays queued.`);
        return;
      }
      inFlight.delete(file);
      counts[res.status] += 1;
      const rec = { file, wave: opts.wave, ...res, verifier: { model: VERIFY_MODEL, effort: VERIFY_EFFORT, tier: 'fast', sandbox: 'read-only' }, started: new Date(started).toISOString(), secs: Math.round((Date.now() - started) / 1000) };
      fs.appendFileSync(opts.state, `${JSON.stringify(rec)}\n`);
      console.log(`${now()} ${res.status} ${file} attempts=${res.attempts} secs=${rec.secs} worker_in=${res.tokens.worker.input} verify_in=${res.tokens.verify.input}`);
    }
  }

  await Promise.all(Array.from({ length: opts.slots }, () => worker()));
  console.log(`${now()} finished pass=${counts.pass} restored=${counts.restored} unchanged=${counts.unchanged}${stopReason ? ` stopped: ${stopReason}` : ''}`);
  if (stopReason) process.exit(stopReason.startsWith('error on') ? 1 : 3);
}

// wave-verify.cjs loads the same gates, so the check after a run is the check the
// run applied.
module.exports = { gates, houseCheck, voiceScan, safeName, ORIG_DIR };

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack || String(err));
    process.exit(1);
  });
}
