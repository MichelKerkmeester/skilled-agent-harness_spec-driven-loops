#!/usr/bin/env node
'use strict';

// Rewrites skill changelogs one file per dispatch. Every result must pass the
// shape checker, the HVR scan and a separate fidelity review before it stays on
// disk; anything else is restored and its draft kept for a human to read.
// Luna runs through the GPT plan on both CLIs and falls back to the metered
// gateway only while that plan reports a usage limit.

const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const ROOT = process.cwd();
const HERE = __dirname;
const CHECKER = path.relative(ROOT, path.join(HERE, 'check_changelog_shape.py'));
const HVR = '.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py';
const EXEMPLAR = '.skilled/skills/system-spec-kit/changelog/v4.0.0.0.md';
const ORIG_DIR = path.join(HERE, 'orig');
const FAIL_DIR = path.join(HERE, 'failed');
const RUN_DIR = path.join(HERE, 'runs');
const STOP_FILE = path.join(HERE, 'STOP');
const STATUS_FILE = path.join(HERE, 'driver-status.json');
const REWRITE_BRIEF = fs.readFileSync(path.join(HERE, 'brief-rewrite.md'), 'utf8');
const VERIFY_BRIEF = fs.readFileSync(path.join(HERE, 'brief-verify.md'), 'utf8');

const REWRITE_TIMEOUT_MS = 30 * 60 * 1000;
const VERIFY_TIMEOUT_MS = 15 * 60 * 1000;
const GPT_COOLDOWN_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const LIMIT_RE = /usage limit|rate[ _-]?limit|too many requests|\b429\b|insufficient_quota|quota exceeded|hit your (usage )?limit|limit reached|exceeded your/i;
// system-spec-kit groups its older changelogs one level down, in v1+/, v2+/ and v3+/.
// A release entry is named for its version; a design-style bundle that happens to be
// called "changelog" also lives in a changelog folder and must never be rewritten.
const SKILL_CHANGELOG_RE = /^\.skilled\/skills\/.+\/changelogs?\/(?:v\d+\+\/)?v\d+(?:\.\d+)+[^/]*\.md$/;

const CHILD_ENV = {
  ...process.env,
  SYSTEM_SPEC_GATE_ENFORCE: '0',
  AI_SESSION_CHILD: '1',
  PI_BLACKHOLE_PASSIVE: 'true',
};

function parseArgs(argv) {
  const out = { lanes: ['pi', 'codex'], retryFailed: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--list') out.list = argv[++i];
    else if (a === '--state') out.state = argv[++i];
    else if (a === '--lanes') out.lanes = argv[++i].split(',');
    else if (a === '--retry-failed') out.retryFailed = true;
    else throw new Error(`unknown argument ${a}`);
  }
  if (!out.list || !out.state) throw new Error('usage: rewrite-driver.cjs --list <file> --state <jsonl> [--lanes pi,codex] [--retry-failed]');
  return out;
}

const safeName = (file) => file.replace(/[^A-Za-z0-9._-]+/g, '__');
const read = (p) => fs.readFileSync(p, 'utf8');
const now = () => new Date().toISOString();

let gptLimitedUntil = 0;
const counts = { pass: 0, fail: 0, requeued: 0, gatewayDispatches: 0, gptDispatches: 0 };

function writeStatus(extra) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify({ at: now(), gptLimitedUntil: gptLimitedUntil ? new Date(gptLimitedUntil).toISOString() : null, ...counts, ...extra }, null, 2));
}

function buildCommand(lane, route, kind, prompt, lastMessageFile) {
  const effort = kind === 'verify' ? 'high' : 'xhigh';
  const noTools = kind === 'verify' ? ['--no-tools'] : [];
  if (route === 'gateway') {
    return ['pi', ['-p', '--offline', '--mode', 'text', '--model', 'llmgateway/gpt-6-luna', '--thinking', effort, ...noTools, prompt]];
  }
  if (lane === 'pi') {
    return ['pi', ['-p', '--offline', '--mode', 'text', '--model', 'openai-codex/gpt-6-luna', '--thinking', effort, ...noTools, prompt]];
  }
  return ['codex', [
    'exec', '--model', 'gpt-6-luna',
    '-c', `model_reasoning_effort="${effort}"`,
    '-c', 'service_tier="fast"',
    '-c', 'approval_policy=never',
    '--sandbox', kind === 'verify' ? 'read-only' : 'workspace-write',
    '-o', lastMessageFile,
    prompt,
  ]];
}

function runProcess(cmd, args, logFile, timeoutMs) {
  return new Promise((resolve) => {
    const log = fs.openSync(logFile, 'w');
    // stdin is closed: both CLIs wait forever on an open stdin in print mode.
    const child = spawn(cmd, args, { cwd: ROOT, env: CHILD_ENV, stdio: ['ignore', log, log] });
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

async function dispatch(lane, kind, prompt, tag) {
  const route = Date.now() < gptLimitedUntil ? 'gateway' : 'gpt';
  const base = path.join(RUN_DIR, `${tag}.${kind}.${lane}.${route}`);
  const lastMessageFile = `${base}.last.txt`;
  fs.rmSync(lastMessageFile, { force: true });
  const [cmd, args] = buildCommand(lane, route, kind, prompt, lastMessageFile);
  if (route === 'gateway') counts.gatewayDispatches += 1; else counts.gptDispatches += 1;
  const res = await runProcess(cmd, args, `${base}.log`, kind === 'verify' ? VERIFY_TIMEOUT_MS : REWRITE_TIMEOUT_MS);
  const reply = fs.existsSync(lastMessageFile) ? read(lastMessageFile) : res.output;
  return { ...res, route, reply };
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

function fillRewrite(file, orig, feedback) {
  let prompt = REWRITE_BRIEF
    .replaceAll('{{FILE}}', file)
    .replaceAll('{{OLD}}', path.relative(ROOT, orig))
    .replaceAll('{{CHECKER}}', CHECKER);
  if (feedback) {
    prompt += `\nPREVIOUS ATTEMPT\nThe file on disk is your previous attempt. It failed these checks. Fix every item, keeping the fact rules:\n${feedback}\n`;
  }
  return prompt;
}

function fillVerify(orig, file) {
  return VERIFY_BRIEF.replace('{{ORIGINAL}}', () => read(orig)).replace('{{REWRITE}}', () => read(path.join(ROOT, file)));
}

async function processFile(file, lane, prior) {
  const abs = path.join(ROOT, file);
  const orig = path.join(ORIG_DIR, `${safeName(file)}`);
  if (!fs.existsSync(orig)) fs.copyFileSync(abs, orig);
  else fs.copyFileSync(orig, abs);
  const tag = safeName(file);
  let feedback = '';
  let findings = '';
  const history = [];

  // A retry resumes from the kept draft and its last findings: a fresh start on a
  // long file tends to trade the old findings for new ones instead of converging.
  const draft = path.join(FAIL_DIR, safeName(file));
  if (prior && prior.status === 'fail' && fs.existsSync(draft) && read(draft) !== read(orig)) {
    const last = [...(prior.history || [])].reverse().find((h) => h.items && h.items.length);
    if (last) {
      fs.copyFileSync(draft, abs);
      findings = last.items.map((x) => `- ${x}`).join('\n');
      feedback = findings;
    }
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const before = read(abs);
    const rw = await dispatch(lane, 'rewrite', fillRewrite(file, orig, feedback), `${tag}.a${attempt}`);
    const changed = read(abs) !== before;
    if (!changed && (rw.route === 'gpt') && LIMIT_RE.test(rw.output)) {
      gptLimitedUntil = Date.now() + GPT_COOLDOWN_MS;
      return { requeue: true, reason: 'gpt usage limit' };
    }
    if (!changed) {
      history.push({ attempt, route: rw.route, problem: rw.timedOut ? 'timed out' : 'file unchanged' });
      feedback = `You did not change the file. Write the complete rewritten file in one whole-file write, not a line-range edit.${findings ? `\n${findings}` : ''}`;
      continue;
    }
    const shape = runChecker(file, orig);
    const hvr = runHvr(file);
    if (shape.exit !== 0 || hvr.hard !== 0) {
      const items = [...(shape.report.errors || []), ...(hvr.hard > 0 ? hvr.lines.map((l) => `HVR hard blocker: ${l}`) : []), ...(hvr.hard < 0 ? ['HVR scan output unreadable'] : [])];
      history.push({ attempt, route: rw.route, problem: 'gates', items });
      findings = items.map((x) => `- ${x}`).join('\n');
      feedback = findings;
      continue;
    }
    let verdict = null;
    let vr = null;
    for (let v = 1; v <= 2 && !verdict; v += 1) {
      vr = await dispatch(lane, 'verify', fillVerify(orig, file), `${tag}.a${attempt}.v${v}`);
      verdict = extractVerdict(vr.reply) || extractVerdict(vr.output);
      if (!verdict && vr.route === 'gpt' && LIMIT_RE.test(vr.output)) {
        gptLimitedUntil = Date.now() + GPT_COOLDOWN_MS;
      }
    }
    if (!verdict) {
      history.push({ attempt, route: vr && vr.route, problem: 'verifier gave no verdict' });
      continue;
    }
    if (verdict.verdict === 'PASS') {
      return { status: 'pass', format: shape.report.format, warnings: shape.report.warnings, attempts: attempt, history, route: rw.route };
    }
    const items = [
      ...(verdict.unsupported || []).map((x) => `unsupported (remove it): ${typeof x === 'string' ? x : JSON.stringify(x)}`),
      ...(verdict.dropped || []).map((x) => `dropped (restore it): ${typeof x === 'string' ? x : JSON.stringify(x)}`),
      ...(verdict.distorted || []).map((x) => `distorted (correct it): ${typeof x === 'string' ? x : JSON.stringify(x)}`),
      ...(verdict.padding || []).map((x) => `padding (cut it or replace it with a fact from the original): ${typeof x === 'string' ? x : JSON.stringify(x)}`),
    ];
    if (!items.length) {
      return { status: 'pass', format: shape.report.format, warnings: shape.report.warnings, attempts: attempt, history, route: rw.route, note: 'verifier said FAIL with empty lists' };
    }
    history.push({ attempt, route: rw.route, problem: 'fidelity', items });
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
  if (fs.existsSync(opts.state)) {
    for (const line of read(opts.state).split('\n').filter(Boolean)) {
      const rec = JSON.parse(line);
      done.set(rec.file, rec.status);
      lastRec.set(rec.file, rec);
    }
  }
  const queue = read(opts.list).split('\n').map((l) => l.trim()).filter(Boolean).filter((f) => {
    if (f === EXEMPLAR || !SKILL_CHANGELOG_RE.test(f)) {
      console.error(`refusing ${f}: not a rewritable skill changelog`);
      return false;
    }
    const s = done.get(f);
    return !(s === 'pass' || (s === 'fail' && !opts.retryFailed));
  });
  const total = queue.length;
  console.log(`${now()} queue=${total} lanes=${opts.lanes.join(',')}`);
  writeStatus({ total, remaining: queue.length, inFlight: [] });
  const inFlight = new Set();

  async function worker(lane) {
    while (queue.length && !fs.existsSync(STOP_FILE)) {
      const file = queue.shift();
      inFlight.add(file);
      writeStatus({ total, remaining: queue.length, inFlight: [...inFlight] });
      const started = Date.now();
      const res = await processFile(file, lane, opts.retryFailed ? lastRec.get(file) : null);
      inFlight.delete(file);
      if (res.requeue) {
        counts.requeued += 1;
        queue.unshift(file);
        console.log(`${now()} ${lane} requeue ${file}: ${res.reason}`);
        continue;
      }
      counts[res.status] += 1;
      const rec = { file, lane, ...res, started: new Date(started).toISOString(), secs: Math.round((Date.now() - started) / 1000) };
      fs.appendFileSync(opts.state, `${JSON.stringify(rec)}\n`);
      console.log(`${now()} ${lane} ${res.status} ${file} attempts=${res.attempts} secs=${rec.secs}`);
      writeStatus({ total, remaining: queue.length, inFlight: [...inFlight] });
    }
  }

  await Promise.all(opts.lanes.map((lane) => worker(lane)));
  writeStatus({ total, remaining: queue.length, inFlight: [], finished: true, stopped: fs.existsSync(STOP_FILE) });
  console.log(`${now()} finished pass=${counts.pass} fail=${counts.fail} requeued=${counts.requeued}`);
}

main().catch((err) => {
  console.error(err.stack || String(err));
  process.exit(1);
});
