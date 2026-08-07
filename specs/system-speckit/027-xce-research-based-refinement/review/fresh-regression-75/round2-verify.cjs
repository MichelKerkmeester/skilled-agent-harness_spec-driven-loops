#!/usr/bin/env node
'use strict';
// Round-2 adversarial verification of code-defect P1s. Each finding is re-checked by the
// OPPOSITE model (refute-first). Opus-found -> Kimi verifies; gpt/Kimi-found -> Opus verifies.
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const RT = path.join(REPO, '.opencode/specs/system-spec-kit/027-xce-research-based-refinement/review/fresh-regression-75');
const CLAUDE_BIN = '/Users/michelkerkmeester/.superset/bin/claude';
const TOKEN = fs.readFileSync(path.join(process.env.HOME, '.claude-account2/.oauth-token'), 'utf8').trim();

const worklist = require(path.join(RT, 'round2-p1-worklist.json'));
const isCode = (f) => /mcp_server\/|\.opencode\/bin\/|\.ts:|\.cjs:|\.mjs:|\.sh:/.test(f.file) && !/\.opencode\/specs\//.test(f.file);
const code = worklist.filter(isCode);
fs.mkdirSync(path.join(RT, 'round2', 'logs'), { recursive: true });

function prompt(f) {
  return `You are an ADVERSARIAL verifier doing a strictly READ-ONLY check. A prior reviewer raised this P1 finding on a codebase. Your job is to REFUTE it unless the evidence is incontrovertible. Default to REFUTED when uncertain. Repo conventions, intentional default-off flags, already-handled-elsewhere, and not-actually-reachable code are REFUTATIONS.

REPO ROOT: ${REPO}
CLAIM: ${f.title}
LOCATION: ${f.file}
EVIDENCE CLAIMED: ${(f.detail && f.detail.evidence) || ''}
WHY CLAIMED A DEFECT: ${(f.detail && f.detail.why) || ''}

Open the cited file at that line, read the ACTUAL code plus its callers/guards/context. Decide if this is a REAL defect or a false positive. Cite the exact file:line you personally read.

End your ENTIRE response with EXACTLY one fenced json block and nothing after:
\`\`\`json
{"id":"${f.id}","verdict":"CONFIRMED|REFUTED|DOWNGRADED","adjusted_severity":"P1|P2|none","checked":"path:line you read","reasoning":"<=300 chars, concrete"}
\`\`\``;
}

function dispatch(f, verifier) {
  const lg = path.join(RT, 'round2', 'logs', `${f.id}.log`);
  return new Promise((res) => {
    let cmd; let args; let env = { ...process.env };
    if (verifier === 'opus') {
      const cdir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'cseat.'));
      try { fs.copyFileSync(path.join(process.env.HOME, '.claude-account2/.claude.json'), path.join(cdir, '.claude.json')); } catch {}
      env.CLAUDE_CONFIG_DIR = cdir; env.CLAUDE_CODE_OAUTH_TOKEN = TOKEN;
      cmd = 'gtimeout'; args = ['-k', '15', '700', CLAUDE_BIN, '-p', prompt(f), '--model', 'claude-opus-4-8', '--permission-mode', 'plan', '--output-format', 'text'];
      f._cdir = cdir;
    } else { // kimi via opencode
      cmd = 'gtimeout'; args = ['-k', '15', '900', 'opencode', 'run', '--model', 'kimi-for-coding/k2p7', '--variant', 'xhigh', '--format', 'json', '--dir', REPO, prompt(f)];
    }
    const p = spawn(cmd, args, { cwd: REPO, env, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => { out += d; }); p.stderr.on('data', (d) => { out += d; });
    p.on('close', () => {
      fs.writeFileSync(lg, out);
      if (f._cdir) { try { fs.rmSync(f._cdir, { recursive: true, force: true }); } catch {} }
      let text = out;
      if (verifier === 'kimi') { text = ''; for (const ln of out.split(/\r?\n/)) { try { const o = JSON.parse(ln); if (o.type === 'text' && o.part && o.part.text) text += o.part.text; } catch {} } }
      let v = null; const m = [...text.matchAll(/```json\s*([\s\S]*?)```/g)].map((x) => x[1].trim());
      if (m.length) { try { v = JSON.parse(m[m.length - 1]); } catch {} }
      res({ f, verifier, verdict: v });
    });
  });
}

async function pool(items, cap, fn) {
  let i = 0; const work = async () => { while (i < items.length) { const n = i++; await fn(items[n]); } };
  await Promise.all(Array.from({ length: Math.min(cap, items.length) }, work));
}

(async () => {
  const results = [];
  const opusFound = code.filter((f) => f.models.some((m) => m.includes('opus')));
  const otherFound = code.filter((f) => !f.models.some((m) => m.includes('opus')));
  console.log(`[round2] code-defect P1s=${code.length}: ${opusFound.length} opus-found -> Kimi verifies; ${otherFound.length} gpt/kimi-found -> Opus verifies`);
  await Promise.all([
    pool(opusFound, 3, async (f) => { const r = await dispatch(f, 'kimi'); results.push(r); console.log(`  ${f.id} [Kimi] -> ${r.verdict ? r.verdict.verdict : 'PARSE_FAIL'}`); }),
    pool(otherFound, 5, async (f) => { const r = await dispatch(f, 'opus'); results.push(r); console.log(`  ${f.id} [Opus] -> ${r.verdict ? r.verdict.verdict : 'PARSE_FAIL'}`); }),
  ]);
  const out = results.map((r) => ({ id: r.f.id, file: r.f.file, title: r.f.title, verifier: r.verifier, verdict: (r.verdict && r.verdict.verdict) || 'PARSE_FAIL', adjusted: r.verdict && r.verdict.adjusted_severity, reasoning: r.verdict && r.verdict.reasoning }));
  fs.writeFileSync(path.join(RT, 'round2', 'code-verdicts.json'), JSON.stringify(out, null, 2));
  const c = out.filter((o) => o.verdict === 'CONFIRMED').length, ref = out.filter((o) => o.verdict === 'REFUTED').length, dg = out.filter((o) => o.verdict === 'DOWNGRADED').length, pf = out.filter((o) => o.verdict === 'PARSE_FAIL').length;
  console.log(`[round2] code verdicts: CONFIRMED=${c} REFUTED=${ref} DOWNGRADED=${dg} PARSE_FAIL=${pf}`);
})();
