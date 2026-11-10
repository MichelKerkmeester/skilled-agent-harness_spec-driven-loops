'use strict';
// Parses every real iteration narrative under specs/ with the live parser and with the
// planned parser (the live file with the planned replacement applied in memory), and,
// for research iterations whose state record claims findingsCount with no structured
// findings array, counts which parser matches the claim. Reads only. Before the build
// it prints mode=before, after the build mode=after with changed=0.
const fs = require('node:fs');
const path = require('node:path');
const { loadFromSource } = require('./load-source.cjs');

const livePath = path.resolve('.skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs');
const liveSource = fs.readFileSync(livePath, 'utf8');
const oldText = fs.readFileSync(path.join(__dirname, '../units/T012.old.txt'), 'utf8');
const newText = fs.readFileSync(path.join(__dirname, '../units/T012.new.txt'), 'utf8');
let mode = 'unknown';
let plannedSource = liveSource;
if (liveSource.split(oldText).length === 2) {
  mode = 'before';
  plannedSource = liveSource.replace(oldText, () => newText);
} else if (liveSource.split(newText).length === 2) {
  mode = 'after';
}
const live = loadFromSource(liveSource, livePath);
const planned = loadFromSource(plannedSource, livePath);

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isSymbolicLink()) continue;
    if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); continue; }
    if (/^iteration-\d+\.md$/.test(e.name) && path.basename(dir) === 'iterations') files.push(p);
  }
})('specs');
const stateCache = new Map();
function claimFor(loopDir, run) {
  if (!stateCache.has(loopDir)) {
    const p = path.join(loopDir, 'deep-research-state.jsonl');
    const records = fs.existsSync(p)
      ? fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean)
      : [];
    stateCache.set(loopDir, records);
  }
  const rec = stateCache.get(loopDir).filter((r) => r.type === 'iteration' && Number(r.run ?? r.iteration) === run).pop();
  if (!rec) return null;
  const structured = [rec.keyFindings, rec.findings, rec.findingDetails].find((v) => Array.isArray(v) && v.length > 0);
  if (structured) return null;
  const claim = Math.floor(Number(rec.findingsCount));
  return Number.isFinite(claim) && claim > 0 ? claim : null;
}
let same = 0, changed = 0, claims = 0, liveMatch = 0, plannedMatch = 0;
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const run = Number(path.basename(f).match(/\d+/)[0]);
  const a = live.parseIterationMarkdownFindings(text, run, f).length;
  const b = planned.parseIterationMarkdownFindings(text, run, f).length;
  if (a === b) same += 1; else changed += 1;
  const claim = claimFor(path.dirname(path.dirname(f)), run);
  if (claim === null) continue;
  claims += 1;
  if (a === claim) liveMatch += 1;
  if (b === claim) plannedMatch += 1;
}
console.log(`mode=${mode} files=${files.length} same=${same} changed=${changed} claims=${claims} liveMatch=${liveMatch} plannedMatch=${plannedMatch}`);
