#!/usr/bin/env node
// Surfaces recorded failures — governance-scenario FAILs, loop-flagged contradictions,
// validator drift notes — that were WRITTEN DOWN but never routed to a remediation.
// A recorded failure with no nearby remediation link is the deceptive "detector fired,
// nobody acted" class: the record itself signals diligence while the defect persists.
// Over-flagging is the intended bias (a false positive costs a glance; a miss costs a
// silent unfixed defect), so a failure marker is cleared only by an explicit route.
import { readFileSync } from 'node:fs';

const FAILURE_MARKERS = [
  /\bfail(?:ed|ure)?\b/i,
  /\bcontradiction\b/i,
  /\bunactioned\b/i,
  /\bdrift\b/i,
  /\bflags?\s+missing\b/i,
  /\bmissing\s+from\b/i,
  /\bnot\s+remediated\b/i,
  /\bfollow[- ]?up\b/i,
];

const REMEDIATION_MARKERS = [
  /\bremediat/i,
  /\bresolved\b/i,
  /\btracked\s+(?:in|as|by)\b/i,
  /\bfixed\s+(?:in|by)\b/i,
  /\bfollow[- ]?up:\s*\S/i, // "follow-up: <target>" is a route; bare "follow-up" is not
  /\baccepted[- ]risk\b/i,
  /\bdecision[- ]record\b/i,
  /\bsupersed/i,
  /\bclosed\s+by\b/i,
  /\bsee\s+\d{3}-[a-z0-9-]+/i,
  /\b\d{3}-[a-z0-9-]+\//, // a spec-folder path reference nearby counts as a route
];

export function findUnactionedFailures(text, { window = 3 } = {}) {
  const lines = String(text).split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!FAILURE_MARKERS.some((re) => re.test(lines[i]))) continue;
    const lo = Math.max(0, i - window);
    const hi = Math.min(lines.length - 1, i + window);
    let routed = false;
    for (let j = lo; j <= hi && !routed; j += 1) {
      if (REMEDIATION_MARKERS.some((re) => re.test(lines[j]))) routed = true;
    }
    if (!routed) out.push({ line: i + 1, snippet: lines[i].trim().slice(0, 160) });
  }
  return out;
}

function main(argv) {
  const files = argv.filter((a) => !a.startsWith('-'));
  if (files.length === 0) {
    console.error('usage: unactioned-recorded-failure-audit.mjs <file> [file...]');
    process.exit(2);
  }
  let total = 0;
  for (const f of files) {
    let text = '';
    try {
      text = readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    for (const h of findUnactionedFailures(text)) {
      console.log(`${f}:${h.line}: unactioned recorded failure -> ${h.snippet}`);
      total += 1;
    }
  }
  console.log(`\n${total} unactioned recorded failure(s).`);
  process.exit(total > 0 ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv.slice(2));
}
