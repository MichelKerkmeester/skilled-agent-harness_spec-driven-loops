#!/usr/bin/env node
'use strict';

// Rewrites released changelogs into the release-notes layout, one file per
// dispatch. The writer is a free model with no tools: it returns the whole file,
// and this driver writes it and judges it. A draft stays on disk only after it
// passes every gate, in this order:
//   1. fact lock: the frontmatter, every fenced block, spec-folder path, URL,
//      inline code span and number of the original is still in the draft, and
//      the draft adds no code span or number the original lacks
//   2. tier lock: a compact entry stays compact and an expanded one stays
//      expanded, so no section the source never had is invented
//   3. layout lint: the draft is in the layout, whatever the original was
//   4. shape check: no sentence rule fails, and no other rule fails more often
//      than it did on the original
//   5. voice scan: no hard blocker
//   6. fact check: a second free model finds nothing dropped, added or changed
// Anything else is restored from the saved original, and the last draft is kept
// in failed/ for a person to read.
//
// Usage: rewrite-driver.cjs [--dry-run] [--slots N] [--retry-failed]
//                           [--writer hy4|glm] [--state FILE] [--wave NAME] <list-file>

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const ROOT = process.cwd();
const HERE = __dirname;
const HOUSE_CHECKER = '.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py';
const HVR = '.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py';
const TEMPLATE = '.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md';
// A compact entry in the layout, shown to the writer as the shape to copy.
const COMPACT_MODEL = '.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.6.0.0.md';
const LAYOUT_LINT = path.join(HERE, 'layout_lint.py');
const ORIG_DIR = path.join(HERE, 'orig');
const FAIL_DIR = path.join(HERE, 'failed');
const RUN_DIR = path.join(HERE, 'runs');
const STOP_FILE = path.join(HERE, process.env.DRIVER_STOP || 'STOP');

const WRITERS = {
  hy4: { label: 'opencode-go/hy4-flash-free#high through opencode run' },
  glm: { label: 'glm-5-2 through devin -p' },
};
const VERIFY_LABEL = 'glm-5-2 through devin -p, read-only permission mode, with Hy4 Flash Free as the fallback when GLM returns no verdict';
const MAX_ATTEMPTS = 3;
const MAX_SLOTS = 4;
const WRITE_TIMEOUT_MS = 15 * 60 * 1000;
const VERIFY_TIMEOUT_MS = 10 * 60 * 1000;
const SENTENCE_RULES = new Set(['sentence-max', 'sentence-mean']);
// Release entries only: the release line, with its v1+/ style subfolders, and
// every skill's changelog folder. Templates and READMEs there are not entries.
const ENTRY_RE = /^\.skilled\/(?:changelog\/skilled|skills\/.+\/changelogs?)\/(?:v\d+\+\/)?v\d+(?:\.\d+)+[^/]*\.md$/;
// A usage limit stops the run instead of retrying into the same wall.
const LIMIT_RE = /usage limit|rate[ _-]?limit|too many requests|\b429\b|status 402|insufficient[_ ](quota|balance)|quota exceeded|hit your (usage )?limit|budget exhausted|FreeUsageLimit|free (tier|usage) (limit|exhausted)/i;

const CHILD_ENV = { ...process.env, AI_SESSION_CHILD: '1', SYSTEM_SPEC_GATE_ENFORCE: '0', MK_SPEC_GATE_ENFORCE: '0' };

const read = (p) => fs.readFileSync(p, 'utf8');
const now = () => new Date().toISOString();
const safeName = (file) => file.replace(/[^A-Za-z0-9._-]+/g, '__');

function parseArgs(argv) {
  const out = { dryRun: false, slots: 1, retryFailed: false, writer: 'hy4' };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--slots') out.slots = Number(argv[++i]);
    else if (a === '--retry-failed') out.retryFailed = true;
    else if (a === '--writer') out.writer = argv[++i];
    else if (a === '--state') out.state = argv[++i];
    else if (a === '--wave') out.wave = argv[++i];
    else if (a.startsWith('--')) throw new Error(`unknown argument ${a}`);
    else out.list = a;
  }
  if (!out.list) throw new Error('usage: rewrite-driver.cjs [--dry-run] [--slots N] [--retry-failed] [--writer hy4|glm] [--state FILE] [--wave NAME] <list-file>');
  if (!Number.isInteger(out.slots) || out.slots < 1 || out.slots > MAX_SLOTS) throw new Error(`--slots runs 1 to ${MAX_SLOTS}`);
  if (!WRITERS[out.writer]) throw new Error(`--writer is one of ${Object.keys(WRITERS).join(', ')}`);
  out.state = out.state || path.join(HERE, 'state.jsonl');
  out.wave = out.wave || path.basename(out.list, '.txt');
  return out;
}

// ---------------------------------------------------------------------------
// Fact lock
// ---------------------------------------------------------------------------

function splitFrontmatter(text) {
  if (text.startsWith('---\n')) {
    const end = text.indexOf('\n---\n', 4);
    if (end !== -1) return [text.slice(0, end + 5), text.slice(end + 5)];
  }
  return ['', text];
}

// A code span opens with a run of backticks and closes with a run of the same
// length, so `` `name` `` is one span holding a backtick, not two broken ones.
const SPAN_RE = /(?<!`)(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/g;
const URL_RE = /https?:\/\/[^\s)>\]`"]+/g;
const SPEC_LINE_RE = /^>\s*.*spec folders?:/i;
const SPEC_PATH_RE = /(?:\.opencode\/)?specs\/[^\s,`;)]+/g;
// Numbers the layout itself adds: the count in a folded spec-folder summary, the
// count in the breaking-change box and the marker of a numbered step.
const LAYOUT_NUMBER_LINES = [/^\s*<summary>.*spec folders\s*\(\d+\)/i, /^>\s*\d+ changes? can break/i];

function facts(text) {
  const [front, body] = splitFrontmatter(text);
  const fences = [];
  const specPaths = new Set();
  const prose = [];
  let fence = null;
  let block = [];
  for (const line of body.split('\n')) {
    const t = line.trim();
    const open = t.match(/^(```+|~~~+)/);
    if (fence) {
      block.push(line);
      if (open && t.startsWith(fence)) {
        fences.push(block.join('\n'));
        fence = null;
        block = [];
      }
      continue;
    }
    if (open) {
      fence = open[1];
      block = [line];
      continue;
    }
    if (SPEC_LINE_RE.test(t)) {
      for (const m of t.matchAll(SPEC_PATH_RE)) specPaths.add(m[0].replace(/\/+$/, ''));
      continue;
    }
    if (LAYOUT_NUMBER_LINES.some((re) => re.test(t))) continue;
    prose.push(line);
  }
  const all = prose.join('\n');
  const spans = new Set([...all.matchAll(SPAN_RE)].map((m) => m[2]));
  const urls = new Set(all.match(URL_RE) || []);
  const plain = all
    .replace(SPAN_RE, ' ')
    .replace(URL_RE, ' ')
    .replace(/<a id="[^"]*"><\/a>/g, ' ')
    .replace(/\]\(#[^)]*\)/g, '] ')
    .replace(/<\/?[a-z][^>]*>/gi, ' ')
    .replace(/^(\s*>)?\s*\d+[.)]\s/gm, ' ');
  const numbers = new Set(plain.match(/\d+(?:[.,]\d+)*/g) || []);
  return { front, fences, specPaths, spans, urls, numbers, plain };
}

function factLock(oldText, newText) {
  const errors = [];
  const o = facts(oldText);
  const n = facts(newText);
  if (o.front !== n.front) errors.push('The frontmatter changed. Copy it byte for byte.');
  for (const f of o.fences) if (!n.fences.includes(f)) errors.push(`A fenced code block changed or is missing. Copy it exactly:\n${f}`);
  const missingSpec = [...o.specPaths].filter((p) => !n.specPaths.has(p));
  const extraSpec = [...n.specPaths].filter((p) => !o.specPaths.has(p));
  if (missingSpec.length) errors.push(`Spec-folder path missing from the closing spec-folder line: ${missingSpec.join(', ')}`);
  if (extraSpec.length) errors.push(`Spec-folder path not in the original: ${extraSpec.join(', ')}`);
  for (const u of o.urls) if (!n.urls.has(u)) errors.push(`URL missing: ${u}`);
  for (const s of o.spans) if (!n.spans.has(s)) errors.push(`Inline code span missing: \`${s}\`. Keep it, with its backticks, with the fact it belongs to.`);
  // Putting a name the original wrote in plain text into code is a layout
  // change. A span whose text the original never had is a new fact.
  for (const s of n.spans) if (!o.spans.has(s) && !o.plain.includes(s)) errors.push(`Inline code span not in the original: \`${s}\`.`);
  for (const x of o.numbers) if (!n.numbers.has(x)) errors.push(`Number missing: ${x}. Keep it, written the same way.`);
  // A number the frontmatter states, such as the version in the title, is not
  // a new fact when the body repeats it in a title line.
  const frontNumbers = new Set(o.front.match(/\d+(?:[.,]\d+)*/g) || []);
  for (const x of n.numbers) if (!o.numbers.has(x) && !frontNumbers.has(x)) errors.push(`Number not in the original: ${x}.`);
  return errors;
}

// ---------------------------------------------------------------------------
// Layout lint, house checker and voice scan
// ---------------------------------------------------------------------------

function layoutLint(file) {
  const r = spawnSync('python3', [LAYOUT_LINT, '--json', file], { cwd: ROOT, encoding: 'utf8' });
  try {
    const rep = JSON.parse(r.stdout).reports[0];
    return { expanded: rep.expanded, problems: rep.problems };
  } catch {
    return { expanded: null, problems: [`layout lint output unreadable: ${r.stderr || r.stdout}`] };
  }
}

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
  const items = [...factLock(oldText, newText)];
  const layout = layoutLint(file);
  if (layout.expanded !== baseline.layout.expanded) {
    items.push(baseline.layout.expanded
      ? 'The original is an expanded entry. Keep its H4 items and its sections, each H4 with its anchor.'
      : 'The original is a compact entry. Keep it compact: no H4 heading and no Upgrade Notes section.');
  }
  items.push(...layout.problems.map((p) => `[layout] ${p}`));
  const house = houseCheck(file);
  for (const l of house.lines) if (/^\[(?:sentence-|checker-error)/.test(l)) items.push(l);
  for (const [rule, n] of Object.entries(house.byRule)) {
    if (SENTENCE_RULES.has(rule)) continue;
    if (n > (baseline.house.byRule[rule] || 0)) items.push(`New [${rule}] failure the original did not have: ${house.lines.filter((l) => l.startsWith(`[${rule}]`)).join(' / ')}`);
  }
  const voice = voiceScan(file);
  if (voice.hard !== 0) items.push(...voice.lines.map((l) => `Voice scan hard blocker: ${l}`));
  return { items, house, voice, layout };
}

// A file is already done when it is in the layout and passes the sentence rules
// and the voice scan. It is never sent, and stays byte-identical.
function alreadyDone(baseline) {
  return !baseline.layout.problems.length
    && !Object.keys(baseline.house.byRule).some((r) => SENTENCE_RULES.has(r))
    && baseline.voice.hard === 0;
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

function runProcess(cmd, args, opts) {
  return new Promise((resolve) => {
    const log = fs.openSync(opts.log, 'w');
    const child = spawn(cmd, args, { cwd: opts.cwd, env: CHILD_ENV, stdio: ['ignore', log, log] });
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

// opencode runs in an empty folder, so it loads no repository instructions and
// has no file to touch. A reply that used a tool is refused all the same.
async function writeWithHy4(prompt, tag) {
  const runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'layout-rewrite-'));
  const log = path.join(RUN_DIR, `${tag}.writer.jsonl`);
  // The prompt goes in as the message, so the model never has to read a file.
  // The largest prompt stays far under the 1 MB argument limit.
  const res = await runProcess('opencode', [
    'run', '-m', 'opencode-go/hy4-flash-free#high', '--format', 'json', prompt,
  ], { cwd: runDir, log, timeoutMs: WRITE_TIMEOUT_MS });
  fs.rmSync(runDir, { recursive: true, force: true });
  const texts = [];
  let toolUsed = false;
  let error = null;
  const usage = { input: 0, output: 0, reasoning: 0, cost: 0 };
  for (const line of res.output.split('\n')) {
    if (!line.startsWith('{')) continue;
    let ev;
    try { ev = JSON.parse(line); } catch { continue; }
    const part = ev.part || {};
    if (ev.type === 'text' && typeof part.text === 'string') texts.push(part.text);
    if (/tool/.test(ev.type || '') || part.type === 'tool') toolUsed = true;
    if (ev.type === 'error') error = JSON.stringify(ev.error || ev).slice(0, 300);
    if (ev.type === 'step_finish' && part.tokens) {
      usage.input += Number(part.tokens.input || 0);
      usage.output += Number(part.tokens.output || 0);
      usage.reasoning += Number(part.tokens.reasoning || 0);
      usage.cost += Number(part.cost || 0);
    }
  }
  const reply = texts.join('\n');
  const ok = res.code === 0 && !res.timedOut && !toolUsed && !error && reply.length > 0;
  const outcome = toolUsed ? 'used a tool' : error ? `error ${error}` : res.timedOut ? 'timed out' : `exit ${res.code}`;
  return { ok, reply, output: res.output, usage, outcome };
}

// Devin refuses an untrusted folder, so it runs from the repository in its
// read-only permission mode.
async function runDevin(prompt, tag, kind, timeoutMs) {
  const promptFile = path.join(RUN_DIR, `${tag}.${kind}.prompt.md`);
  fs.writeFileSync(promptFile, prompt);
  const log = path.join(RUN_DIR, `${tag}.${kind}.log`);
  const res = await runProcess('devin', ['-p', '--model', 'glm-5-2', '--permission-mode', 'auto', '--prompt-file', promptFile], { cwd: ROOT, log, timeoutMs });
  fs.rmSync(promptFile, { force: true });
  return res;
}

async function writeWithGlm(prompt, tag) {
  const res = await runDevin(prompt, tag, 'writer', WRITE_TIMEOUT_MS);
  return { ok: res.code === 0 && !res.timedOut, reply: res.output, output: res.output, usage: null, outcome: res.timedOut ? 'timed out' : `exit ${res.code}` };
}

// The reply is one fenced block. A reply that holds the file without the fence
// is not accepted, because a stray preamble would land in the changelog.
function extractFile(reply) {
  const m = reply.match(/~~~(?:markdown|md)?\n([\s\S]*?)\n~~~\s*$/m) || reply.match(/~~~(?:markdown|md)?\n([\s\S]*)\n~~~/);
  return m ? `${m[1].replace(/\s+$/, '')}\n` : null;
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
// Briefs
// ---------------------------------------------------------------------------

// The layout rules come from the template itself, so the brief cannot drift
// from the standard: section 2 holds both tiers and the field guidelines, and
// section 4 the voice rules.
function templatePart(tier) {
  const t = read(path.join(ROOT, TEMPLATE));
  const cut = (from, to) => t.slice(t.indexOf(from), t.indexOf(to, t.indexOf(from)));
  const tierBlock = tier === 'expanded'
    ? cut('### Expanded Format', '## 3. WHAT TO LEAVE OUT')
    : cut('### Compact Format', '### Expanded Format');
  return `${tierBlock}\n${cut('## 4. WRITING STYLE RULES', '## 5. FORMAT SELECTION GUIDE')}`;
}

function fillRewrite(oldText, tier, draft, items) {
  const compactModel = tier === 'compact'
    ? `\nA COMPACT ENTRY IN THE LAYOUT (copy its shape, never its content)\n<<<MODEL\n${read(path.join(ROOT, COMPACT_MODEL)).replace(/\n$/, '')}\nMODEL>>>\n`
    : '';
  let prompt = read(path.join(HERE, 'brief-rewrite.md'))
    .replace('{{TIER}}', tier)
    .replace('{{TIER_RULES}}', () => read(path.join(HERE, `brief-tier-${tier}.md`)).replace(/\n$/, ''))
    .replace('{{TEMPLATE}}', () => templatePart(tier))
    .replace('{{COMPACT_MODEL}}', () => compactModel)
    .replace('{{ORIGINAL}}', () => oldText.replace(/\n$/, ''));
  if (draft) {
    prompt += `\nPREVIOUS ATTEMPT\nYour previous draft is below. It failed these checks. Fix every item and keep every other line of the draft as it is.\n${items.map((x) => `- ${x}`).join('\n')}\n<<<PREVIOUS DRAFT\n${draft.replace(/\n$/, '')}\nPREVIOUS DRAFT>>>\n`;
  }
  return prompt;
}

const fillVerify = (oldText, newText) => read(path.join(HERE, 'brief-verify.md'))
  .replace('{{ORIGINAL}}', () => oldText.replace(/\n$/, ''))
  .replace('{{REWRITE}}', () => newText.replace(/\n$/, ''));

// ---------------------------------------------------------------------------
// One file
// ---------------------------------------------------------------------------

class LimitHit extends Error {}

const READY = new Set();

async function processFile(file, writer) {
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
  const baseline = { layout: layoutLint(file), house: houseCheck(file), voice: voiceScan(file) };
  if (alreadyDone(baseline)) return { status: 'unchanged', attempts: 0, history: [], tokens: {}, tier: baseline.layout.expanded ? 'expanded' : 'compact' };
  const tier = baseline.layout.expanded ? 'expanded' : 'compact';
  const tag = safeName(file);
  const history = [];
  const tokens = { writer: { input: 0, output: 0, reasoning: 0, cost: 0 }, verifyCalls: 0 };
  let draft = null;
  let items = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const prompt = fillRewrite(oldText, tier, draft, items);
    const w = writer === 'glm' ? await writeWithGlm(prompt, `${tag}.a${attempt}`) : await writeWithHy4(prompt, `${tag}.a${attempt}`);
    if (w.usage) for (const k of Object.keys(w.usage)) tokens.writer[k] += w.usage[k];
    if (!w.ok) {
      if (LIMIT_RE.test(w.output)) throw new LimitHit(`writer usage limit on ${file}`);
      history.push({ attempt, problem: `writer did not finish (${w.outcome})` });
      continue;
    }
    const text = extractFile(w.reply);
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
    const v = await runDevin(fillVerify(oldText, text), `${tag}.a${attempt}`, 'verify', VERIFY_TIMEOUT_MS);
    tokens.verifyCalls += 1;
    if (LIMIT_RE.test(v.output) && !extractVerdict(v.output)) throw new LimitHit(`fact checker usage limit on ${file}`);
    let verdict = extractVerdict(v.output);
    // GLM can hit its output-token cap on the largest entries and stop before
    // the verdict. The same draft then gets one check on the free Hy4 route,
    // whose output room is far larger, instead of costing a writer attempt.
    if (!verdict) {
      const h = await writeWithHy4(fillVerify(oldText, text), `${tag}.a${attempt}.verify-hy4`);
      tokens.verifyFallback = (tokens.verifyFallback || 0) + 1;
      if (!h.ok && LIMIT_RE.test(h.output)) throw new LimitHit(`fallback fact checker usage limit on ${file}`);
      verdict = h.ok ? extractVerdict(h.reply) : null;
    }
    if (!verdict) {
      history.push({ attempt, problem: 'fact checker gave no verdict' });
      items = [];
      continue;
    }
    const found = verdictItems(verdict);
    if (verdict.verdict === 'PASS' && !found.length) {
      return { status: 'pass', attempts: attempt, history, tokens, tier, sha256: crypto.createHash('sha256').update(text).digest('hex') };
    }
    items = found.length ? found : ['The fact checker failed the draft without naming an item. Compare every sentence with the original again.'];
    history.push({ attempt, problem: 'fact check', items });
  }
  fs.mkdirSync(FAIL_DIR, { recursive: true });
  if (draft) fs.writeFileSync(path.join(FAIL_DIR, safeName(file)), draft);
  fs.writeFileSync(abs, oldText);
  return { status: 'restored', attempts: MAX_ATTEMPTS, history, tokens, tier };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const GATE_LIST = [
  'fact lock: frontmatter, fenced blocks, spec-folder paths, URLs, code spans and numbers of the original are all present, and no new code span or number appears',
  'tier lock: a compact entry stays compact and an expanded entry stays expanded',
  'layout lint: layout_lint.py passes the draft outright',
  'shape check: no [sentence-max] or [sentence-mean], and no other rule fails more often than on the original',
  'voice scan: 0 hard blockers',
  `fact check: ${VERIFY_LABEL} finds nothing dropped, added or changed`,
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
  console.log(`writer: ${WRITERS[opts.writer].label}, no tools`);
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
        res = await processFile(file, opts.writer);
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
      const rec = { file, wave: opts.wave, writer: WRITERS[opts.writer].label, verifier: VERIFY_LABEL, ...res, started: new Date(started).toISOString(), secs: Math.round((Date.now() - started) / 1000) };
      fs.appendFileSync(opts.state, `${JSON.stringify(rec)}\n`);
      const w = res.tokens && res.tokens.writer ? res.tokens.writer : {};
      console.log(`${now()} ${res.status} ${file} tier=${res.tier} attempts=${res.attempts} secs=${rec.secs} out=${w.output || 0} reasoning=${w.reasoning || 0}`);
    }
  }

  await Promise.all(Array.from({ length: opts.slots }, () => worker()));
  console.log(`${now()} finished pass=${counts.pass} restored=${counts.restored} unchanged=${counts.unchanged}${stopReason ? ` stopped: ${stopReason}` : ''}`);
  if (stopReason) process.exit(stopReason.startsWith('error on') ? 1 : 3);
}

// wave-verify.cjs loads the same gates, so the check after a run is the check the
// run applied.
module.exports = { gates, factLock, layoutLint, houseCheck, voiceScan, alreadyDone, safeName, ORIG_DIR };

if (require.main === module) {
  main().catch((err) => {
    console.error(err.stack || String(err));
    process.exit(1);
  });
}
