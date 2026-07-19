#!/usr/bin/env node
'use strict';
// Consolidated host cycle for one settled deep-context iteration:
// merge -> write iteration state -> graph upsert -> reducer -> convergence ->
// state-log convergence event -> render next iteration's seat prompts.
// Host is the single writer throughout; seats and reducer ownership unchanged.

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const RUNTIME = path.join(REPO, '.opencode/skills/deep-loop-runtime/scripts');
const REDUCER = path.join(REPO, '.opencode/skills/deep-context/scripts/reduce-state.cjs');

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 && !r.stdout) throw new Error(`${cmd} ${args[0]} failed: ${r.stderr?.slice(0, 400)}`);
  return r.stdout;
}

function firstJson(text) {
  const whole = String(text).trim();
  // reduce-state pretty-prints across lines; convergence/upsert emit one line
  try { return JSON.parse(whole); } catch { /* fall through to per-line scan */ }
  for (const line of whole.split('\n')) {
    const t = line.trim();
    if (!t.startsWith('{')) continue;
    try { return JSON.parse(t); } catch { /* keep looking */ }
  }
  throw new Error('no JSON in output');
}

function main() {
  const [, , specJsonPath] = process.argv;
  const job = JSON.parse(fs.readFileSync(specJsonPath, 'utf8'));
  // job: { sf, sid, n, focus, sliceCsv, durationMs, next: {n, sliceFiles, focusNote, focus} | null }
  const ctxDir = path.join(REPO, job.sf, 'context');
  const NNN = String(job.n).padStart(3, '0');

  const mergePath = `/tmp/ctx-iter-${NNN}-merge.json`;
  fs.writeFileSync(mergePath, run('node', [path.join(ctxDir, 'host-merge.cjs'), ctxDir, `iter-${NNN}`, job.sliceCsv]));
  const merge = JSON.parse(fs.readFileSync(mergePath, 'utf8'));

  const writeOut = firstJson(run('node', [path.join(ctxDir, 'host-write-iteration.cjs'), ctxDir, String(job.n), job.focus, mergePath, String(job.durationMs || 420000), job.sid, job.sliceCsv]));

  const upsert = firstJson(run('node', [path.join(RUNTIME, 'upsert.cjs'),
    '--spec-folder', job.sf, '--loop-type', 'context', '--session-id', job.sid,
    '--nodes', fs.readFileSync(`/tmp/ctx-iter-${NNN}-nodes.json`, 'utf8'),
    '--edges', fs.readFileSync(`/tmp/ctx-iter-${NNN}-edges.json`, 'utf8')]));

  const reduce = firstJson(run('node', [REDUCER, path.join(REPO, job.sf)]));

  const conv = firstJson(run('node', [path.join(RUNTIME, 'convergence.cjs'),
    '--spec-folder', job.sf, '--loop-type', 'context', '--session-id', job.sid, '--iteration', String(job.n)]));
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  const evt = {
    type: 'event', event: 'graph_convergence', mode: 'context', run: job.n,
    decision: conv.data.decision, signals: conv.data.signals,
    blockers: (conv.data.blockers || []).map((b) => b.type),
    timestamp: now, sessionId: job.sid, generation: 1,
  };
  fs.appendFileSync(path.join(ctxDir, 'deep-context-state.jsonl'), JSON.stringify(evt) + '\n');

  let rendered = null;
  if (job.next) {
    const reg = JSON.parse(fs.readFileSync(path.join(ctxDir, 'findings-registry.json'), 'utf8'));
    const agreed = [];
    for (const cat of ['reuseCandidates', 'integrationPoints', 'conventions', 'dependencies', 'gaps'])
      for (const u of reg[cat] || []) if (u.agreementEligible) agreed.push(`${u.path.split('/').pop()}::${u.symbol}`);
    const nextSpec = {
      sliceFiles: job.next.sliceFiles,
      knownContext: `Confirmed agreement-eligible units so far (do NOT re-find): ${agreed.join('; ')}.`,
      focusNote: job.next.focusNote,
    };
    const nextNNN = String(job.next.n).padStart(3, '0');
    const nextSpecPath = `/tmp/ctx-iter-${nextNNN}-spec.json`;
    fs.writeFileSync(nextSpecPath, JSON.stringify(nextSpec));
    rendered = firstJson(run('node', [path.join(ctxDir, 'host-render-prompts.cjs'), ctxDir, `iter-${nextNNN}`, nextSpecPath]));
  }

  console.log(JSON.stringify({
    iteration: job.n,
    merge: { seats: merge.seatsSucceeded, failed: merge.seatsFailed, kept: merge.mergedFindingsCount, newAgreementEligible: merge.newAgreementEligible, sliceCoverage: merge.sliceCoverage },
    cumulativeAgreementEligible: writeOut.cumulativeAgreementEligible,
    upsert: { nodes: upsert.data.insertedNodes, edges: upsert.data.insertedEdges, rejected: upsert.data.rejectedEdges },
    registry: { iterations: reduce.iterationsCompleted, findings: reduce.findings, agreementEligible: reduce.agreementEligible, contradictions: reduce.contradictions },
    convergence: { decision: conv.data.decision, score: conv.data.score, blockers: evt.blockers },
    newRatio: merge.mergedFindingsCount ? Number((merge.newAgreementEligible / merge.mergedFindingsCount).toFixed(3)) : 0,
    renderedNext: rendered ? rendered.outDir : null,
  }, null, 2));
}

main();
