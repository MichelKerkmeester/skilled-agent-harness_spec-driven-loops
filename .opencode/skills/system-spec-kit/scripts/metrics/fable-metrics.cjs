#!/usr/bin/env node
'use strict';

// Runtime-agnostic behavioral metric reader for fable-5 efficiency.
//
// WHY this exists: the only prior behavioral metric (leak_test.py) reads
// ~/.claude/projects/, so it only sees Claude Code runs. The framework's own
// signal lives in deep-loop state: the per-lineage opencode JSON event stream
// (logs/fanout-lineage.out) carries text + tool parts, and the iteration
// markdown carries the agent's prose. This reads those by path, so it works
// across Claude, Codex, and OpenCode runs. It NEVER writes unless --baseline is
// given, and even then only to the named snapshot file — a /doctor run is read-only.

const fs = require('node:fs');
const path = require('node:path');

// ───── text heuristics (drift detectors, not moral scores) ─────
const OPENER_RE = /^\s*(?:#+\s*)?(?:I'?ll\b|I will\b|Let me\b|Let's\b|I'?m going to\b|I am going to\b|I'?m now\b|Now I\b|First,?\s+I\b|I need to\b|I'?ll now\b)/i;
const CAVEAT_RE = /\b(?:however|that said|it'?s worth noting|worth noting|keep in mind|bear in mind|note that|one thing to note|on the other hand|to be fair|caveat(?:s)?)\b/i;
const COMPLETION_RE = /\b(?:done|completed?|finished|verified|passes|passing|works|working|confirmed|shipped|all green)\b/i;
// A completion claim is "backed" when its sentence cites evidence: a file path,
// file:line, a [SOURCE:] tag, a backtick code span, or a verification command.
const EVIDENCE_RE = /(?:\[SOURCE:|`[^`]+`|\b[\w./-]+\.(?:ts|tsx|js|cjs|mjs|py|sh|md|json|yaml)\b|:\d+\b|\bvalidate\.sh\b|\bvitest\b|\bnpm\b|\bexit 0\b|\bPASS(?:ED)?\b)/;

const MIN_MESSAGES = 8; // below this a per-metric result is INSUFFICIENT (cf. leak_test's 30-prose-msg guard)

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}
function wordCount(t) { return (t.trim().match(/\S+/g) || []).length; }
function pct(n, d) { return d ? Math.round((n / d) * 1000) / 10 : null; }

// Pull assistant text messages + tool-action count from an opencode JSON event stream.
function parseStream(file) {
  const texts = [];
  let toolUse = 0;
  let raw;
  try { raw = fs.readFileSync(file, 'utf8'); } catch { return { texts, toolUse, present: false }; }
  for (const line of raw.split('\n')) {
    const s = line.trim();
    if (!s || s[0] !== '{') continue;
    let obj;
    try { obj = JSON.parse(s); } catch { continue; } // corrupt lines are skipped, not fatal
    if (obj.type === 'tool_use') { toolUse += 1; continue; }
    if (obj.type === 'text' && obj.part && typeof obj.part.text === 'string' && obj.part.text.trim()) {
      texts.push(obj.part.text.trim());
    }
  }
  return { texts, toolUse, present: raw.length > 64 };
}

// Iteration markdown is long-form prose; split into paragraph "units" for prose metrics.
function parseIterationMarkdown(dir) {
  const units = [];
  let idir = path.join(dir, 'iterations');
  if (!fs.existsSync(idir)) return units;
  for (const f of fs.readdirSync(idir).filter((x) => /iteration-\d+\.md$/.test(x)).sort()) {
    let body;
    try { body = fs.readFileSync(path.join(idir, f), 'utf8'); } catch { continue; }
    for (const para of body.split(/\n\s*\n/)) {
      const p = para.trim();
      if (p.length >= 40 && p[0] !== '#') units.push(p);
    }
  }
  return units;
}

function proseMetrics(messages) {
  if (!messages.length) {
    return { sampleSize: 0, medianWordsPerMsg: null, selfOpenerPct: null, unsolicitedCaveatPct: null, evidenceBackedCompletionRatio: null, sufficient: false };
  }
  const words = messages.map(wordCount);
  const openers = messages.filter((m) => OPENER_RE.test(m)).length;
  const caveats = messages.filter((m) => CAVEAT_RE.test(m)).length;
  let claims = 0;
  let backed = 0;
  for (const m of messages) {
    for (const sentence of m.split(/(?<=[.!?])\s+/)) {
      if (COMPLETION_RE.test(sentence)) {
        claims += 1;
        if (EVIDENCE_RE.test(sentence)) backed += 1;
      }
    }
  }
  return {
    sampleSize: messages.length,
    medianWordsPerMsg: median(words),
    selfOpenerPct: pct(openers, messages.length),
    unsolicitedCaveatPct: pct(caveats, messages.length),
    evidenceBackedCompletionRatio: claims ? Math.round((backed / claims) * 100) / 100 : null,
    completionClaims: claims,
    sufficient: messages.length >= MIN_MESSAGES,
  };
}

function measureLineage(dir, label) {
  const stream = parseStream(path.join(dir, 'logs', 'fanout-lineage.out'));
  // Prefer the stream's text parts (true per-turn messages); fall back to iteration
  // paragraphs when the lineage ran in-seat and emitted no rich stream.
  const usingStream = stream.texts.length >= MIN_MESSAGES;
  const messages = usingStream ? stream.texts : parseIterationMarkdown(dir);
  const prose = proseMetrics(messages);
  const toolText = stream.texts.length
    ? Math.round((stream.toolUse / stream.texts.length) * 100) / 100
    : null;
  return {
    label,
    source: usingStream ? 'json-stream' : (messages.length ? 'iteration-markdown' : 'none'),
    toolTextRatio: toolText,
    toolActions: stream.toolUse,
    streamTextMessages: stream.texts.length,
    ...prose,
  };
}

function discoverLineages(target) {
  const lineagesDir = path.join(target, 'lineages');
  if (fs.existsSync(lineagesDir) && fs.statSync(lineagesDir).isDirectory()) {
    return fs.readdirSync(lineagesDir)
      .map((name) => ({ name, dir: path.join(lineagesDir, name) }))
      .filter((e) => fs.statSync(e.dir).isDirectory());
  }
  // target IS a single lineage dir
  return [{ name: path.basename(target), dir: target }];
}

function aggregate(lineages) {
  const tt = lineages.map((l) => l.toolTextRatio).filter((v) => v != null);
  const wm = lineages.map((l) => l.medianWordsPerMsg).filter((v) => v != null);
  const so = lineages.map((l) => l.selfOpenerPct).filter((v) => v != null);
  const cv = lineages.map((l) => l.unsolicitedCaveatPct).filter((v) => v != null);
  const ev = lineages.map((l) => l.evidenceBackedCompletionRatio).filter((v) => v != null);
  const mean = (a) => (a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 100) / 100 : null);
  return {
    lineagesMeasured: lineages.length,
    lineagesWithStream: lineages.filter((l) => l.source === 'json-stream').length,
    toolTextRatio_mean: mean(tt),
    medianWordsPerMsg_median: median(wm),
    selfOpenerPct_mean: mean(so),
    unsolicitedCaveatPct_mean: mean(cv),
    evidenceBackedCompletionRatio_mean: mean(ev),
    note: 'Metrics are drift detectors, not quality scores. Higher tool:text and evidence ratio, lower words/opener/caveat = closer to the fable-5 signature.',
  };
}

function main(argv) {
  const args = argv.slice(2);
  const jsonOnly = args.includes('--json');
  const baselineIdx = args.indexOf('--baseline');
  const baselineOut = baselineIdx !== -1 ? args[baselineIdx + 1] : null;
  const positional = args.filter((a, i) => a[0] !== '-' && args[i - 1] !== '--baseline');
  const target = path.resolve(positional[0] || '.');

  if (!fs.existsSync(target)) {
    console.error(`fable-metrics: path not found: ${target}`);
    process.exit(2);
  }

  const lineages = discoverLineages(target).map((e) => measureLineage(e.dir, e.name));
  const report = { target, generatedFrom: 'deep-loop state (json stream + iteration markdown)', lineages, aggregate: aggregate(lineages) };

  if (baselineOut) {
    fs.writeFileSync(path.resolve(baselineOut), JSON.stringify(report, null, 2));
  }

  if (jsonOnly) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    return;
  }

  const a = report.aggregate;
  console.log(`\nfable-metrics — ${target}`);
  console.log(`lineages: ${a.lineagesMeasured} (${a.lineagesWithStream} with a rich JSON stream)\n`);
  const col = (v, suffix = '') => (v == null ? 'INSUFFICIENT' : `${v}${suffix}`);
  for (const l of report.lineages) {
    console.log(`  ${l.label.padEnd(20)} src=${l.source.padEnd(17)} tool:text=${col(l.toolTextRatio)}  words/msg=${col(l.medianWordsPerMsg)}  opener%=${col(l.selfOpenerPct)}  caveat%=${col(l.unsolicitedCaveatPct)}  evidence=${col(l.evidenceBackedCompletionRatio)}  n=${l.sampleSize}`);
  }
  console.log(`\n  AGGREGATE          tool:text=${col(a.toolTextRatio_mean)}  words/msg=${col(a.medianWordsPerMsg_median)}  opener%=${col(a.selfOpenerPct_mean)}  caveat%=${col(a.unsolicitedCaveatPct_mean)}  evidence=${col(a.evidenceBackedCompletionRatio_mean)}`);
  if (baselineOut) console.log(`\n  baseline snapshot written: ${baselineOut}`);
  console.log('');
}

if (require.main === module) main(process.argv);
module.exports = { measureLineage, proseMetrics, parseStream, median, aggregate, discoverLineages };
