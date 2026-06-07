#!/usr/bin/env node
// Extract MiMo's structured findings JSON from an opencode `--format json` event
// stream and normalize to the deep-context seat_output_schema: { findings: [...] }.
// Usage: node _extract-findings.cjs <raw-event-stream> <out-seat.json>
'use strict';
const fs = require('fs');

const [, , rawPath, outPath] = process.argv;
if (!rawPath || !outPath) {
  process.stderr.write('Usage: node _extract-findings.cjs <raw> <out>\n');
  process.exit(2);
}

// 1. Collect every assistant text part in order from the JSONL event stream.
const texts = [];
for (const line of fs.readFileSync(rawPath, 'utf8').split('\n')) {
  const t = line.trim();
  if (!t) continue;
  let obj;
  try { obj = JSON.parse(t); } catch { continue; }
  const part = obj && obj.part;
  if (part && part.type === 'text' && typeof part.text === 'string') texts.push(part.text);
}
let blob = texts.join('');

// 2. Strip code fences if MiMo wrapped the JSON.
blob = blob.replace(/```(?:json)?/gi, '');

// 3. Parse to a findings[] — prefer the LARGEST balanced candidate that yields
//    findings (the outer wrapper), not the last nested object.
function asFindings(str) {
  let p;
  try { p = JSON.parse(str); } catch { return null; }
  if (Array.isArray(p)) return p;
  if (p && Array.isArray(p.findings)) return p.findings;
  return null;
}

function extractFindings(s) {
  s = s.trim();
  const direct = asFindings(s);
  if (direct) return direct;
  let best = null, bestLen = -1;
  for (let i = 0; i < s.length; i++) {
    const open = s[i];
    if (open !== '{' && open !== '[') continue;
    const close = open === '{' ? '}' : ']';
    let depth = 0, inStr = false, esc = false;
    for (let j = i; j < s.length; j++) {
      const c = s[j];
      if (inStr) {
        if (esc) esc = false;
        else if (c === '\\') esc = true;
        else if (c === '"') inStr = false;
        continue;
      }
      if (c === '"') { inStr = true; continue; }
      if (c === open) depth++;
      else if (c === close) {
        depth--;
        if (depth === 0) {
          const cand = s.slice(i, j + 1);
          const f = asFindings(cand);
          if (f && cand.length > bestLen) { best = f; bestLen = cand.length; }
          break;
        }
      }
    }
  }
  return best || [];
}

let findings = extractFindings(blob);

// 4. Light normalization; the reducer does authoritative post-dispatch validation.
findings = (Array.isArray(findings) ? findings : []).filter((f) => f && typeof f === 'object');
for (const f of findings) {
  if (typeof f.relevance !== 'number') {
    const n = Number(f.relevance);
    f.relevance = Number.isFinite(n) ? n : 0.6;
  }
}

fs.writeFileSync(outPath, JSON.stringify({ findings }, null, 2));
process.stdout.write(`extracted ${findings.length} findings -> ${outPath}\n`);
process.exit(findings.length > 0 ? 0 : 1);
