#!/usr/bin/env node
'use strict';

// Rewrites skill changelogs one file per dispatch. Every result must pass the
// shape checker, the HVR scan and a separate fidelity review before it stays on
// disk; anything else is restored and its draft kept for a human to read.
// Luna runs through the GPT plan on cli-pi, cli-codex and cli-opencode and falls
// back to the metered gateway only while that plan reports a usage limit. The
// cli-devin lane runs the same model on the Devin account. Each CLI runs at most
// two dispatches at a time.
//
// Speed comes from doing less per dispatch, not from a lower effort. The cli-pi and
// cli-codex workers start without the repository's AGENTS.md, because the brief
// already carries every rule one changelog rewrite needs and the governance load
// cost more turns than the rewrite. A retry continues the same executor session,
// so a fix reads only its findings instead of the whole contract again.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn, spawnSync } = require('child_process');

const ROOT = process.cwd();
const HERE = __dirname;
const CHECKER = path.relative(ROOT, path.join(HERE, 'check_changelog_shape.py'));
const COVERAGE = path.relative(ROOT, path.join(HERE, 'coverage-scan.py'));
const HVR = '.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py';
const EXEMPLAR = '.skilled/skills/system-spec-kit/changelog/v4.0.0.0.md';
const TEMPLATE = '.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md';
const ORIG_DIR = path.join(HERE, 'orig');
const FAIL_DIR = path.join(HERE, 'failed');
const RUN_DIR = path.join(HERE, 'runs');
// Each run can name its own stop file, so stopping one run never halts another.
const STOP_FILE = path.join(HERE, process.env.DRIVER_STOP || 'STOP');
const STATUS_FILE = path.join(HERE, process.env.DRIVER_STATUS || 'driver-status.json');
// Files a review sends back while a run is going join the front of its queue, so a
// skill's retries run while that skill is current instead of after every other one.
const REQUEUE_FILE = path.join(HERE, process.env.DRIVER_REQUEUE || 'requeue.txt');
// The review brief is read at each use, like the rewrite brief, so an amendment
// reaches the next check without restarting a run.
const verifyBrief = () => fs.readFileSync(path.join(HERE, 'brief-verify.md'), 'utf8');
const briefHash = (text) => crypto.createHash('sha256').update(text).digest('hex').slice(0, 12);
// Each record names the review brief it passed under, so a --reverify pass can
// find the kept files an older, weaker review let through and resume after a stop.
const VERIFY_HASH = briefHash(verifyBrief());

// The rewrite brief carries the contract and the house-style opening inline, so a
// worker spends its turns on the changelog rather than on reading the references.
const CONTRACT = (() => {
  const lines = fs.readFileSync(path.join(process.cwd(), TEMPLATE), 'utf8').split('\n');
  const from = lines.findIndex((l) => /^## 2\. /.test(l));
  const to = lines.findIndex((l) => /^## 6\. /.test(l));
  if (from === -1 || to === -1) throw new Error(`cannot find sections 2 to 5 in ${TEMPLATE}`);
  return lines.slice(from, to).join('\n').trim();
})();
const HOUSE_STYLE = fs.readFileSync(path.join(process.cwd(), EXEMPLAR), 'utf8').split('\n').slice(0, 60).join('\n');

const LANES = ['pi', 'codex', 'devin', 'opencode'];
const MAX_SLOTS_PER_CLI = 2;

const REWRITE_TIMEOUT_MS = 30 * 60 * 1000;
const VERIFY_TIMEOUT_MS = 15 * 60 * 1000;
const GPT_COOLDOWN_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 3;
// Enough earlier findings to stop a fix loop, few enough that the latest ones lead.
const MAX_EARLIER_FINDINGS = 12;
// The brief's handback reports format=unknown only when the executor never got
// far enough to read the file, which means its tool runner failed, not the rewrite.
const TOOLS_DOWN_RE = /RETURN:\s*FAIL\s*\|\s*format=unknown/i;
// A governed executor halts when its reads fail, and reports a file the driver has
// just written as missing. When cli-devin's file tool fails it fails for the whole
// session, even on the repository's own rule files. That run says nothing about
// the rewrite.
const MISSING_CLAIM_RE = /\b(?:file|target|path)\b[^.\n]{0,40}\b(?:is missing|was not found|not found|does not exist|doesn't exist)|returned:?\s*[`'"]?not found/i;
const MAX_TOOL_RETRIES = 3;
const TOOL_RETRY_PAUSE_MS = 60000;
const MISSING_RETRY_PAUSE_MS = 5000;
const LIMIT_RE = /usage limit|rate[ _-]?limit|too many requests|\b429\b|insufficient_quota|quota exceeded|hit your (usage )?limit|limit reached|exceeded your/i;
// system-spec-kit groups its older changelogs one level down, in v1+/, v2+/ and v3+/.
// A release entry is named for its version; a design-style bundle that happens to be
// called "changelog" also lives in a changelog folder and must never be rewritten.
const SKILL_CHANGELOG_RE = /^\.skilled\/skills\/.+\/changelogs?\/(?:v\d+\+\/)?v\d+(?:\.\d+)+[^/]*\.md$/;

const CHILD_ENV = {
  ...process.env,
  SYSTEM_SPEC_GATE_ENFORCE: '0',
  MK_SPEC_GATE_ENFORCE: '0',
  AI_SESSION_CHILD: '1',
  PI_BLACKHOLE_PASSIVE: 'true',
};

// opencode snapshots the whole working tree into its own git store on every run,
// which on this repository stalls a first run for minutes with no output. Recovery
// never needs it: git and the saved originals already hold every prior state.
const OPENCODE_ENV = { OPENCODE_CONFIG_CONTENT: '{"snapshot":false}' };

// A lane is a CLI name with an optional slot count, as in codex:2. The slot count
// is how many dispatches that CLI runs at once. The operator limits each CLI's
// account to two concurrent sessions, so a larger count is refused.
function parseLanes(spec) {
  return spec.split(',').map((item) => {
    const [name, n] = item.split(':');
    const slots = n === undefined ? 1 : Number(n);
    if (!LANES.includes(name)) throw new Error(`unknown lane ${name}`);
    if (!Number.isInteger(slots) || slots < 1 || slots > MAX_SLOTS_PER_CLI) {
      throw new Error(`lane ${name} asks for ${n} slots; each CLI runs 1 to ${MAX_SLOTS_PER_CLI}`);
    }
    return { name, slots };
  });
}

function parseArgs(argv) {
  const out = { lanes: parseLanes('pi,codex'), retryFailed: false, reverify: false, longestFirst: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--list') out.list = argv[++i];
    else if (a === '--state') out.state = argv[++i];
    else if (a === '--lanes') out.lanes = parseLanes(argv[++i]);
    else if (a === '--retry-failed') out.retryFailed = true;
    else if (a === '--reverify') out.reverify = true;
    else if (a === '--longest-first') out.longestFirst = true;
    else throw new Error(`unknown argument ${a}`);
  }
  if (!out.list || !out.state) throw new Error('usage: rewrite-driver.cjs --list <file> --state <jsonl> [--lanes pi:2,codex:2,devin:2,opencode:2] [--retry-failed | --reverify] [--longest-first]');
  if (out.retryFailed && out.reverify) throw new Error('--retry-failed and --reverify are separate passes');
  return out;
}

const safeName = (file) => file.replace(/[^A-Za-z0-9._-]+/g, '__');
const read = (p) => fs.readFileSync(p, 'utf8');
const now = () => new Date().toISOString();

let gptLimitedUntil = 0;
const counts = { pass: 0, fail: 0, requeued: 0, gatewayDispatches: 0, gptDispatches: 0, devinDispatches: 0 };

function writeStatus(extra) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify({ at: now(), gptLimitedUntil: gptLimitedUntil ? new Date(gptLimitedUntil).toISOString() : null, ...counts, ...extra }, null, 2));
}

// session is null for a one-shot dispatch, or { id, resume } for a rewrite whose
// retries continue the same executor session. cli-pi takes an id the driver picks;
// cli-codex and cli-opencode report the id of the session they created.
function buildCommand(lane, route, kind, prompt, lastMessageFile, session) {
  // The review runs at the rewrite's effort: at a lower one it passed compact
  // rewrites that had silently dropped contract facts.
  const effort = 'xhigh';
  const noTools = kind === 'verify' ? ['--no-tools'] : [];
  const resume = Boolean(session && session.resume);
  if (lane === 'devin') {
    // Devin bills its own account, not the GPT plan, so it never takes the gateway
    // route. A rewrite runs its own checks, which only the dangerous mode allows.
    // The -priority suffix is Devin's Fast tier of the same model and effort.
    return ['devin', [
      '-p', '--model', `gpt-6-luna-${effort}-priority`,
      '--permission-mode', kind === 'verify' ? 'auto' : 'dangerous',
      '--respect-workspace-trust', 'false',
      '--', prompt,
    ], {}];
  }
  if (route === 'gateway') {
    return ['pi', ['-p', '--offline', '--mode', 'text', '--model', 'llmgateway/gpt-6-luna', '--thinking', effort, '--no-context-files', ...noTools, prompt], {}];
  }
  if (lane === 'pi') {
    const sessionArgs = session ? ['--session-id', session.id] : [];
    return ['pi', ['-p', '--offline', '--mode', 'text', '--model', 'openai-codex/gpt-6-luna', '--thinking', effort, '--no-context-files', ...noTools, ...sessionArgs, prompt], {}];
  }
  if (lane === 'opencode') {
    // opencode takes no sandbox flag. The review brief forbids tools, and the
    // driver's own gates judge every rewrite whatever the worker claims.
    const sessionArgs = resume ? ['-s', session.id] : [];
    return ['opencode', ['run', '-m', 'openai/gpt-6-luna', '--variant', effort, '--format', 'json', '--dir', ROOT, ...sessionArgs, prompt], OPENCODE_ENV];
  }
  const shared = [
    '-c', `model_reasoning_effort="${effort}"`,
    '-c', 'service_tier="fast"',
    '-c', 'approval_policy=never',
    '-c', 'project_doc_max_bytes=0',
  ];
  if (resume) {
    // exec resume takes no --sandbox flag, so the policy travels as config.
    return ['codex', ['exec', 'resume', session.id, ...shared, '-c', 'sandbox_mode="workspace-write"', '-o', lastMessageFile, prompt], {}];
  }
  return ['codex', [
    'exec', '--model', 'gpt-6-luna', ...shared,
    '--sandbox', kind === 'verify' ? 'read-only' : 'workspace-write',
    '-o', lastMessageFile,
    prompt,
  ], {}];
}

// opencode prints JSON events rather than a final message. The reply is the text
// of its parts, and the session id is on every event.
function opencodeReply(output) {
  const texts = [];
  let sessionId = null;
  for (const line of output.split('\n')) {
    if (!line.startsWith('{')) continue;
    let event;
    try { event = JSON.parse(line); } catch { continue; }
    if (!sessionId && event.sessionID) sessionId = event.sessionID;
    const part = event.part || {};
    if (part.type === 'text' && part.text) texts.push(part.text);
  }
  return { text: texts.join('\n'), sessionId };
}

function runProcess(cmd, args, logFile, timeoutMs, extraEnv) {
  return new Promise((resolve) => {
    const log = fs.openSync(logFile, 'w');
    // stdin is closed: the CLIs wait forever on an open stdin in print mode.
    const child = spawn(cmd, args, { cwd: ROOT, env: { ...CHILD_ENV, ...extraEnv }, stdio: ['ignore', log, log] });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      setTimeout(() => child.kill('SIGKILL'), 10000);
    }, timeoutMs);
    child.on('close', (code) => {
      clearTimeout(timer);
      fs.closeSync(log);
      resolve({ code, timedOut, output: read(logFile) });
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      fs.closeSync(log);
      resolve({ code: -1, timedOut, output: `${read(logFile)}\nspawn error: ${err.message}` });
    });
  });
}

const routeFor = (lane) => (lane === 'devin' ? 'devin' : Date.now() < gptLimitedUntil ? 'gateway' : 'gpt');

async function dispatch(lane, kind, prompt, tag, session = null, route = routeFor(lane)) {
  const base = path.join(RUN_DIR, `${tag}.${kind}.${lane}.${route}`);
  const lastMessageFile = `${base}.last.txt`;
  fs.rmSync(lastMessageFile, { force: true });
  const [cmd, args, extraEnv] = buildCommand(lane, route, kind, prompt, lastMessageFile, session);
  if (route === 'gateway') counts.gatewayDispatches += 1;
  else if (route === 'devin') counts.devinDispatches += 1;
  else counts.gptDispatches += 1;
  const res = await runProcess(cmd, args, `${base}.log`, kind === 'verify' ? VERIFY_TIMEOUT_MS : REWRITE_TIMEOUT_MS, extraEnv);
  let reply = fs.existsSync(lastMessageFile) ? read(lastMessageFile) : res.output;
  let sessionId = null;
  if (route === 'gpt' && lane === 'opencode') {
    ({ text: reply, sessionId } = opencodeReply(res.output));
  } else if (route === 'gpt' && lane === 'codex') {
    const m = res.output.match(/session id:\s*([0-9a-f-]{8,})/i);
    sessionId = m ? m[1] : null;
  } else if (route === 'gpt' && lane === 'pi' && session) {
    sessionId = session.id;
  }
  return { ...res, route, reply, sessionId };
}

function runChecker(file, orig) {
  const r = spawnSync('python3', [CHECKER, file, '--old', orig], { cwd: ROOT, encoding: 'utf8' });
  let report = null;
  try { report = JSON.parse(r.stdout); } catch { report = { errors: [`checker output unreadable: ${r.stderr || r.stdout}`], warnings: [] }; }
  return { exit: r.status, report };
}

function runHvr(file) {
  const r = spawnSync('python3', [HVR, file], { cwd: ROOT, encoding: 'utf8' });
  const text = `${r.stdout}\n${r.stderr}`;
  const m = text.match(/hard blockers:\s+(\d+)/);
  const hard = m ? Number(m[1]) : -1;
  const lines = text.split('\n').filter((l) => /\bhard\b/.test(l) && !/hard blockers:/.test(l)).map((l) => l.trim());
  return { hard, lines };
}

function extractVerdict(text) {
  const start = text.lastIndexOf('{"verdict"');
  const alt = text.lastIndexOf('{\n');
  const from = start !== -1 ? start : alt;
  if (from === -1) return null;
  let depth = 0;
  for (let i = from; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1;
    else if (text[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        try {
          const obj = JSON.parse(text.slice(from, i + 1));
          return typeof obj.verdict === 'string' ? obj : null;
        } catch { return null; }
      }
    }
  }
  return null;
}

// The rewrite brief is read on every dispatch, so a fix to it reaches the next file
// without restarting the run. The review brief stays fixed for the whole run,
// because each record names the review it passed under.
// A dense file most often fails all its attempts by undoing one review's fix to
// satisfy the next, so a retry also sees what earlier reviews sent back.
function earlierBlock(earlier) {
  if (!earlier || !earlier.length) return '';
  return `\nEARLIER FINDINGS\nEarlier reviews of this file also sent it back for these items. Keep each one fixed while you fix the items above, and never undo one fix to make another. If two items pull against each other, the fact rules win: keep the fact and cut only the repeated wording.\n${earlier.map((x) => `- ${x}`).join('\n')}\n`;
}

function fillRewrite(file, orig, feedback, earlier) {
  let prompt = read(path.join(HERE, 'brief-rewrite.md'))
    .replaceAll('{{ROOT}}', ROOT)
    .replaceAll('{{FILE}}', file)
    .replaceAll('{{OLD}}', path.relative(ROOT, orig))
    .replaceAll('{{CHECKER}}', CHECKER)
    .replaceAll('{{COVERAGE}}', COVERAGE)
    .replace('{{CONTRACT}}', () => CONTRACT)
    .replace('{{HOUSE_STYLE}}', () => HOUSE_STYLE)
    .replace('{{ORIGINAL}}', () => read(orig));
  // A retry shows the draft it fixes, so the executor need not read the file first.
  // An attempt that wrote nothing left the original in place, and says so instead.
  if (feedback) {
    const current = read(path.join(ROOT, file));
    if (current === read(orig)) {
      prompt += `\nPREVIOUS ATTEMPT\nYour previous attempt left the file unchanged, so it still holds the ORIGINAL above. Fix every item, keeping the fact rules:\n${feedback}\n`;
    } else {
      prompt += `\nPREVIOUS ATTEMPT\nThe file on disk is your previous attempt, shown here. It failed these checks. Fix every item, keeping the fact rules:\n${feedback}\n<<<PREVIOUS DRAFT\n${current}\nPREVIOUS DRAFT>>>\n`;
    }
    prompt += earlierBlock(earlier);
  }
  return prompt;
}

// A resumed session already holds the brief, the contract and its own draft, so a
// retry sends only what failed, plus earlier findings the session may not have seen.
function fillContinue(file, feedback, earlier) {
  return [
    `Your rewrite of ${file} failed these checks. Fix every item in the file, keeping the fact rules and every other part of your draft, as one whole-file write.`,
    feedback,
    earlierBlock(earlier).trim(),
    'Then run the three checks from step 5 again and end with the RETURN line.',
  ].filter(Boolean).join('\n');
}

// The prose an original's facts live in: no frontmatter, no table rows, no Files
// Changed section and no Verification section, because the contract drops those.
// A heading that only mentions verification, such as a model being list-verified,
// states a support claim and stays.
const DROPPED_SECTION_RE = /^#{1,6}\s+(?:files changed|verification|verified)\b/i;

function prose(text) {
  let body = text;
  if (body.startsWith('---\n')) {
    const end = body.indexOf('\n---\n', 4);
    if (end !== -1) body = body.slice(end + 5);
  }
  const out = [];
  let skipping = false;
  for (const line of body.split('\n')) {
    if (/^#{1,6}\s/.test(line)) {
      skipping = DROPPED_SECTION_RE.test(line);
      if (skipping) continue;
    }
    if (skipping || line.trimStart().startsWith('|')) continue;
    out.push(line);
  }
  return out.join('\n');
}

// Code identifiers the original's prose names and the rewrite never does. A model
// reviewer reliably catches a wrong claim but can miss a quiet omission, so the
// review is handed the concrete list to account for.
function missingIdentifiers(orig, file) {
  const spans = new Set([...prose(read(orig)).matchAll(/`([^`\n]+)`/g)].map((m) => m[1]));
  const flat = (s) => s.split(/\s+/).filter(Boolean).join(' ');
  const rewrite = flat(read(path.join(ROOT, file)));
  return [...spans].filter((s) => !rewrite.includes(flat(s))).sort();
}

function fillVerify(orig, file) {
  const missing = missingIdentifiers(orig, file);
  const list = missing.length ? missing.map((s) => `- \`${s}\``).join('\n') : '(none)';
  return verifyBrief()
    .replace('{{MISSING}}', () => list)
    .replace('{{ORIGINAL}}', () => read(orig))
    .replace('{{REWRITE}}', () => read(path.join(ROOT, file)));
}

function verdictItems(verdict) {
  const text = (x) => (typeof x === 'string' ? x : JSON.stringify(x));
  return [
    ...(verdict.unsupported || []).map((x) => `unsupported (remove it): ${text(x)}`),
    ...(verdict.dropped || []).map((x) => `dropped (restore it): ${text(x)}`),
    ...(verdict.distorted || []).map((x) => `distorted (correct it): ${text(x)}`),
    ...(verdict.padding || []).map((x) => `padding (cut it or replace it with a fact from the original): ${text(x)}`),
  ];
}

async function getVerdict(lane, orig, file, tag) {
  let verdict = null;
  let vr = null;
  for (let v = 1; v <= 2 && !verdict; v += 1) {
    vr = await dispatch(lane, 'verify', fillVerify(orig, file), `${tag}.v${v}`);
    verdict = extractVerdict(vr.reply) || extractVerdict(vr.output);
    if (!verdict && vr.route === 'gpt' && LIMIT_RE.test(vr.output)) {
      gptLimitedUntil = Date.now() + GPT_COOLDOWN_MS;
    }
  }
  return { verdict, route: vr && vr.route };
}

// Puts an already-kept rewrite through the current review. A failure keeps the
// rewrite as the draft a --retry-failed pass resumes from, with the findings.
// A draft an older review failed is reviewed again from failed/, so a retry works
// from the current review's findings rather than a weaker or stricter one's.
async function reverifyFile(file, lane, prior) {
  const abs = path.join(ROOT, file);
  const orig = path.join(ORIG_DIR, safeName(file));
  if (!fs.existsSync(orig)) return { skip: 'no saved original' };
  if (prior && prior.status === 'fail') {
    const draft = path.join(FAIL_DIR, safeName(file));
    if (!fs.existsSync(draft)) return { skip: 'no saved draft' };
    fs.copyFileSync(draft, abs);
  }
  const { verdict, route } = await getVerdict(lane, orig, file, `${safeName(file)}.re`);
  if (!verdict) return { skip: 'reviewer gave no verdict' };
  const items = verdict.verdict === 'PASS' ? [] : verdictItems(verdict);
  if (!items.length) {
    return { status: 'pass', format: prior && prior.format, attempts: 0, history: [], route, note: 'reverified' };
  }
  fs.copyFileSync(abs, path.join(FAIL_DIR, safeName(file)));
  fs.copyFileSync(orig, abs);
  return { status: 'fail', attempts: 0, history: [{ attempt: 1, route, problem: 'fidelity', items }], note: 'reverify failed a kept pass' };
}

async function processFile(file, lane, prior) {
  const abs = path.join(ROOT, file);
  const orig = path.join(ORIG_DIR, `${safeName(file)}`);
  if (!fs.existsSync(orig)) fs.copyFileSync(abs, orig);
  else fs.copyFileSync(orig, abs);
  const tag = safeName(file);
  let feedback = '';
  let findings = '';
  let toolRetries = 0;
  const history = [];

  // Every fidelity finding this file has drawn, oldest first, across its earlier
  // records and this run. Each prompt lists the ones its own findings leave out.
  const seen = [];
  const noteFindings = (items) => {
    for (const x of items) if (!seen.includes(x)) seen.push(x);
  };
  let current = [];
  const earlier = () => seen.filter((x) => !current.includes(x)).slice(-MAX_EARLIER_FINDINGS);
  for (const h of (prior && prior.history) || []) {
    if (h.problem === 'fidelity' && h.items) noteFindings(h.items);
  }

  // A retry resumes from the kept draft and its last findings: a fresh start on a
  // long file tends to trade the old findings for new ones instead of converging.
  const draft = path.join(FAIL_DIR, safeName(file));
  if (prior && prior.status === 'fail' && fs.existsSync(draft) && read(draft) !== read(orig)) {
    const last = [...(prior.history || [])].reverse().find((h) => h.items && h.items.length);
    if (last) {
      fs.copyFileSync(draft, abs);
      current = last.items;
      findings = last.items.map((x) => `- ${x}`).join('\n');
      feedback = findings;
    }
  }

  // The rewrite session a retry can continue, on the route that created it. cli-devin
  // reports no session id a driver can read safely while two of its dispatches run,
  // so its retries start fresh.
  let session = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const before = read(abs);
    const route = routeFor(lane);
    const resume = Boolean(session && feedback && session.route === route && lane !== 'devin');
    let sessionArg = null;
    if (resume) sessionArg = { id: session.id, resume: true };
    else if (lane === 'pi' && route === 'gpt') sessionArg = { id: crypto.randomUUID(), resume: false };
    const prompt = resume ? fillContinue(file, feedback, earlier()) : fillRewrite(file, orig, feedback, earlier());
    // A retried attempt gets its own log, so the run that failed stays readable.
    const rw = await dispatch(lane, 'rewrite', prompt, `${tag}.a${attempt}${toolRetries ? `r${toolRetries}` : ''}`, sessionArg, route);
    session = rw.sessionId ? { id: rw.sessionId, route } : null;
    const changed = read(abs) !== before;
    if (!changed && (rw.route === 'gpt') && LIMIT_RE.test(rw.output)) {
      gptLimitedUntil = Date.now() + GPT_COOLDOWN_MS;
      return { requeue: true, reason: 'gpt usage limit' };
    }
    // An executor whose own tools failed never read the file, so the run says
    // nothing about the rewrite. Retry the same attempt after a pause instead of
    // spending one, and cap the retries so a lasting outage still ends the file.
    // The retry starts a fresh session, because the failed one holds the false
    // belief that stopped it.
    const toolsDown = TOOLS_DOWN_RE.test(rw.reply);
    const missingClaim = !toolsDown && MISSING_CLAIM_RE.test(rw.reply) && fs.existsSync(abs);
    if (!changed && !rw.timedOut && (toolsDown || missingClaim) && toolRetries < MAX_TOOL_RETRIES) {
      toolRetries += 1;
      session = null;
      const pause = toolsDown ? TOOL_RETRY_PAUSE_MS : MISSING_RETRY_PAUSE_MS;
      console.log(`${now()} ${lane} ${toolsDown ? 'tools unavailable' : 'reported the file missing'} on ${file}; retrying attempt ${attempt} in ${pause / 1000}s`);
      await new Promise((r) => setTimeout(r, pause));
      attempt -= 1;
      continue;
    }
    if (!changed) {
      history.push({ attempt, route: rw.route, problem: rw.timedOut ? 'timed out' : resume ? 'file unchanged in the continued session' : 'file unchanged' });
      // A continued session that wrote nothing may have lost its state, so the
      // next attempt starts a fresh one with the whole brief.
      if (resume) session = null;
      feedback = `You did not change the file. Write the complete rewritten file in one whole-file write, not a line-range edit.${findings ? `\n${findings}` : ''}`;
      continue;
    }
    const shape = runChecker(file, orig);
    const hvr = runHvr(file);
    if (shape.exit !== 0 || hvr.hard !== 0) {
      const items = [...(shape.report.errors || []), ...(hvr.hard > 0 ? hvr.lines.map((l) => `HVR hard blocker: ${l}`) : []), ...(hvr.hard < 0 ? ['HVR scan output unreadable'] : [])];
      history.push({ attempt, route: rw.route, problem: 'gates', items });
      current = items;
      findings = items.map((x) => `- ${x}`).join('\n');
      feedback = findings;
      continue;
    }
    const { verdict, route: verifyRoute } = await getVerdict(lane, orig, file, `${tag}.a${attempt}`);
    if (!verdict) {
      history.push({ attempt, route: verifyRoute, problem: 'verifier gave no verdict' });
      continue;
    }
    if (verdict.verdict === 'PASS') {
      return { status: 'pass', format: shape.report.format, warnings: shape.report.warnings, attempts: attempt, history, route: rw.route };
    }
    const items = verdictItems(verdict);
    if (!items.length) {
      return { status: 'pass', format: shape.report.format, warnings: shape.report.warnings, attempts: attempt, history, route: rw.route, note: 'verifier said FAIL with empty lists' };
    }
    history.push({ attempt, route: rw.route, problem: 'fidelity', items });
    noteFindings(items);
    current = items;
    findings = items.map((x) => `- ${x}`).join('\n');
    feedback = findings;
  }

  fs.copyFileSync(abs, path.join(FAIL_DIR, safeName(file)));
  fs.copyFileSync(orig, abs);
  return { status: 'fail', attempts: MAX_ATTEMPTS, history };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  for (const d of [ORIG_DIR, FAIL_DIR, RUN_DIR]) fs.mkdirSync(d, { recursive: true });
  const done = new Map();
  const lastRec = new Map();
  const loadState = () => {
    done.clear();
    lastRec.clear();
    if (!fs.existsSync(opts.state)) return;
    // A record's history carries the findings a retry resumes from. The latest
    // record can lack them, as when every attempt failed without touching the
    // file, so each file's history spans all of its records.
    for (const line of read(opts.state).split('\n').filter(Boolean)) {
      const rec = JSON.parse(line);
      const earlier = lastRec.get(rec.file);
      done.set(rec.file, rec.status);
      lastRec.set(rec.file, { ...rec, history: [...((earlier && earlier.history) || []), ...(rec.history || [])] });
    }
  };
  loadState();
  const rewritable = (f) => {
    if (f === EXEMPLAR || !SKILL_CHANGELOG_RE.test(f)) {
      console.error(`refusing ${f}: not a rewritable skill changelog`);
      return false;
    }
    return true;
  };
  const queue = read(opts.list).split('\n').map((l) => l.trim()).filter(Boolean).filter((f) => {
    if (!rewritable(f)) return false;
    const s = done.get(f);
    if (opts.reverify) {
      const rec = lastRec.get(f);
      const staleReview = rec && rec.verifyBrief !== VERIFY_HASH;
      return staleReview && (s === 'pass' || (s === 'fail' && rec.note === 'reverify failed a kept pass'));
    }
    return !(s === 'pass' || (s === 'fail' && !opts.retryFailed));
  });
  if (opts.longestFirst) {
    // The longest files take the longest, so starting them first keeps the last
    // lane from running on alone while the others sit idle.
    const size = (f) => {
      const o = path.join(ORIG_DIR, safeName(f));
      return fs.statSync(fs.existsSync(o) ? o : path.join(ROOT, f)).size;
    };
    queue.sort((a, b) => size(b) - size(a));
  }
  let total = queue.length;
  console.log(`${now()} queue=${total} lanes=${opts.lanes.map((l) => `${l.name}:${l.slots}`).join(',')}`);
  writeStatus({ total, remaining: queue.length, inFlight: [] });
  const inFlight = new Set();

  // The rename claims the file, so two workers never take the same list, and an
  // append that lands after the claim waits in a new file for the next pickup.
  // The state is reloaded first, because an overturn written after this run
  // started carries the findings the retry resumes from.
  function takeRequeued() {
    if (opts.reverify || !fs.existsSync(REQUEUE_FILE)) return;
    const claimed = `${REQUEUE_FILE}.${process.pid}`;
    try {
      fs.renameSync(REQUEUE_FILE, claimed);
    } catch {
      return;
    }
    const wanted = [...new Set(read(claimed).split('\n').map((l) => l.trim()).filter(Boolean))];
    fs.unlinkSync(claimed);
    loadState();
    let added = 0;
    let moved = 0;
    for (const f of wanted.reverse()) {
      if (!rewritable(f) || inFlight.has(f)) continue;
      if (done.get(f) === 'pass') {
        console.log(`${now()} requeue ignored ${f}: its latest record is a pass`);
        continue;
      }
      const at = queue.indexOf(f);
      if (at === -1) {
        added += 1;
      } else {
        queue.splice(at, 1);
        moved += 1;
      }
      queue.unshift(f);
    }
    total += added;
    console.log(`${now()} requeued ${added} new and ${moved} moved to the front, of ${wanted.length} listed in ${path.basename(REQUEUE_FILE)}`);
  }

  async function worker(lane) {
    while (!fs.existsSync(STOP_FILE)) {
      takeRequeued();
      if (!queue.length) break;
      const file = queue.shift();
      inFlight.add(file);
      writeStatus({ total, remaining: queue.length, inFlight: [...inFlight] });
      const started = Date.now();
      const res = opts.reverify
        ? await reverifyFile(file, lane, lastRec.get(file))
        : await processFile(file, lane, opts.retryFailed ? lastRec.get(file) : null);
      inFlight.delete(file);
      if (res.skip) {
        console.log(`${now()} ${lane} skip ${file}: ${res.skip}`);
        continue;
      }
      if (res.requeue) {
        counts.requeued += 1;
        queue.unshift(file);
        console.log(`${now()} ${lane} requeue ${file}: ${res.reason}`);
        continue;
      }
      counts[res.status] += 1;
      const rec = { file, lane, ...res, verifyBrief: briefHash(verifyBrief()), started: new Date(started).toISOString(), secs: Math.round((Date.now() - started) / 1000) };
      fs.appendFileSync(opts.state, `${JSON.stringify(rec)}\n`);
      console.log(`${now()} ${lane} ${res.status} ${file} attempts=${res.attempts} secs=${rec.secs}`);
      writeStatus({ total, remaining: queue.length, inFlight: [...inFlight] });
    }
  }

  await Promise.all(opts.lanes.flatMap(({ name, slots }) => Array.from({ length: slots }, () => worker(name))));
  writeStatus({ total, remaining: queue.length, inFlight: [], finished: true, stopped: fs.existsSync(STOP_FILE) });
  console.log(`${now()} finished pass=${counts.pass} fail=${counts.fail} requeued=${counts.requeued}`);
}

main().catch((err) => {
  console.error(err.stack || String(err));
  process.exit(1);
});
