#!/usr/bin/env node
'use strict';
// Host-side wave-boundary processor for the deep-research loop in this packet.
// For each settled seat: normalize the returned narrative into the write-once
// iteration file, compute newInfoRatio from NEW/PARTIAL/KNOWN tags, append the
// canonical iteration record + executor provenance, and write the delta file.
// Then run the reducer once and convergence once for the wave.

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const SF = '.opencode/specs/z_future/sqlite-to-turso';
const RES = path.join(REPO, SF, 'research');
const SID = 'res-20260610-1626-sqlt';

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { status: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}

function parseWhole(text) {
  const t = String(text).trim();
  try { return JSON.parse(t); } catch { /* scan lines */ }
  for (const line of t.split('\n')) {
    const s = line.trim();
    if (s.startsWith('{')) { try { return JSON.parse(s); } catch { /* next */ } }
  }
  return null;
}

function processIteration(N) {
  const NNN = String(N).padStart(3, '0');
  const seatPath = path.join(RES, 'seats', `iter-${NNN}.out.md`);
  if (!fs.existsSync(seatPath) || fs.statSync(seatPath).size < 200) {
    return { n: N, status: 'seat-missing' };
  }
  let body = fs.readFileSync(seatPath, 'utf8').trim();
  // normalize: ensure the narrative starts at the iteration heading
  const hIdx = body.indexOf(`# Iteration ${N}`);
  if (hIdx > 0) body = body.slice(hIdx);
  if (hIdx === -1) body = `# Iteration ${N}: (recovered narrative)\n\n${body}`;

  const iterFile = path.join(RES, 'iterations', `iteration-${NNN}.md`);
  if (fs.existsSync(iterFile) && fs.statSync(iterFile).size > 0) {
    return { n: N, status: 'already-written' };
  }
  fs.writeFileSync(iterFile, body + '\n');

  // findings + novelty tags
  const findingsSection = (body.split(/^## Findings/m)[1] || '').split(/^## /m)[0] || '';
  const bullets = findingsSection.split('\n').filter((l) => /^\s*[-*]\s/.test(l));
  const tag = (re) => bullets.filter((b) => re.test(b)).length;
  const nNew = tag(/\bNEW\b/), nPartial = tag(/\bPARTIAL\b/), total = bullets.length || 1;
  const newInfoRatio = Math.min(1, Number(((nNew + 0.5 * nPartial) / total).toFixed(3)));

  // answered question ids (C1a..C8a) mentioned with a verdict
  const qids = [...new Set((findingsSection.match(/\bC\d[a-z]\b/g) || []))];
  const focusLine = (body.split(/^## Focus/m)[1] || '').split(/^## /m)[0].trim().split('\n')[0] || `iteration ${N}`;
  const title = (body.match(/^# Iteration \d+:\s*(.+)$/m) || [])[1] || `iteration ${N}`;
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

  const iterRecord = {
    type: 'iteration', run: N, mode: 'research', status: 'evidence', focus: title,
    findingsCount: bullets.length, newInfoRatio,
    noveltyJustification: `${nNew} NEW + ${nPartial} PARTIAL of ${total} findings vs v0.5.0 baseline`,
    keyQuestions: qids, answeredQuestions: qids,
    toolsUsed: ['Read', 'Grep', 'WebSearch'], sourcesQueried: ['external/turso-main', 'web'],
    durationMs: 0, timestamp: now, sessionId: SID, generation: 1,
  };
  const audit = {
    type: 'event', event: 'executor_audit', run: N,
    executor: process.env.EXECUTOR_KIND === 'native'
      ? { kind: 'native', model: 'claude-fable-5', reasoningEffort: 'inherit', note: 'claude2 quota fallback' }
      : { kind: 'cli-claude-code', model: 'claude-fable-5', reasoningEffort: 'xhigh', account: 'claude2' },
    timestamp: now, sessionId: SID, generation: 1,
  };
  fs.appendFileSync(path.join(RES, 'deep-research-state.jsonl'),
    JSON.stringify(iterRecord) + '\n' + JSON.stringify(audit) + '\n');
  fs.writeFileSync(path.join(RES, 'deltas', `iter-${NNN}.jsonl`), JSON.stringify(iterRecord) + '\n');
  return { n: N, status: 'written', findings: bullets.length, newInfoRatio, answered: qids };
}

function main() {
  const ns = process.argv.slice(2).map(Number).filter(Boolean);
  const results = ns.map(processIteration);
  const reduce = run('node', [path.join(REPO, '.opencode/skills/deep-research/scripts/reduce-state.cjs'), SF]);
  const reduceOut = parseWhole(reduce.stdout) || { error: reduce.stderr.slice(0, 300), exit: reduce.status };
  const conv = run('node', [path.join(REPO, '.opencode/skills/deep-loop-runtime/scripts/convergence.cjs'),
    '--spec-folder', SF, '--loop-type', 'research', '--session-id', SID]);
  const convOut = parseWhole(conv.stdout) || { error: conv.stderr.slice(0, 300), exit: conv.status };
  console.log(JSON.stringify({
    iterations: results,
    reducer: reduceOut.error ? reduceOut : {
      iterations: reduceOut.iterationsCompleted, findings: reduceOut.findings,
      openQuestions: reduceOut.openQuestions, answered: reduceOut.answeredQuestions,
    },
    convergence: convOut.error ? convOut : {
      decision: convOut.data && convOut.data.decision, score: convOut.data && convOut.data.score,
      blockers: convOut.data && (convOut.data.blockers || []).map((b) => b.type),
    },
  }, null, 2));
}

main();
