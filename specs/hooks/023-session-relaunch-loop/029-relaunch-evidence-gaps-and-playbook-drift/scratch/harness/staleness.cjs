'use strict';
// For every PostToolUse the probe saw, compares the latest assistant entry the hook could read
// with the latest assistant entry whose own timestamp precedes the hook, taken from the
// finished transcript. A mismatch means the transcript file had not caught up when the hook ran.
const fs = require('node:fs');
const path = require('node:path');
const root = process.argv[2];
let total = 0; let stale = 0;
const rows = [];
for (const name of fs.readdirSync(root).filter((n) => /^trial-\d+$/.test(n)).sort()) {
  const probe = fs.readFileSync(path.join(root, name, 'probe.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const transcript = probe.find((r) => r.transcript)?.transcript;
  const entries = fs.readFileSync(transcript, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const assistants = entries.filter((e) => e.type === 'assistant' && e.isSidechain !== true && e.timestamp);
  for (const r of probe.filter((p) => p.ev === 'PostToolUse')) {
    const hookMs = Date.parse(r.ts);
    const truth = assistants.filter((e) => Date.parse(e.timestamp) <= hookMs).pop();
    const seen = r.lastAssistant?.ts;
    const isStale = Boolean(truth) && truth.timestamp !== seen;
    total += 1; if (isStale) stale += 1;
    rows.push({ trial: name, tool: r.tool, hook: r.ts, newestEntryBeforeHook: truth?.timestamp, entryAgeMs: truth ? hookMs - Date.parse(truth.timestamp) : null, seenByHook: seen, stale: isStale });
  }
}
console.log(rows.map((r) => [r.trial, r.tool, r.stale ? 'STALE' : 'fresh', `age=${r.entryAgeMs}ms`].join('\t')).join('\n'));
console.log(`PostToolUse hooks: ${total}, stale reads: ${stale}`);
const stales = rows.filter((r) => r.stale).map((r) => r.entryAgeMs); const fresh = rows.filter((r) => !r.stale).map((r) => r.entryAgeMs);
const stat = (a) => (a.length ? `min=${Math.min(...a)} max=${Math.max(...a)}` : 'none');
console.log(`stale entry age (hook ts minus newest entry ts): ${stat(stales)}`);
console.log(`fresh entry age: ${stat(fresh)}`);
