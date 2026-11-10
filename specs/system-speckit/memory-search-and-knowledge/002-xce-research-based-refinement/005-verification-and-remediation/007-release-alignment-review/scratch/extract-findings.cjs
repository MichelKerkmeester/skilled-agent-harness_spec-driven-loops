#!/usr/bin/env node
// Extract the final fenced ```json findings block from an opencode `run --format json`
// event stream. Usage: node extract-findings.js <seat.json>  -> prints normalized JSON or {error}.
const fs = require('fs');
const path = process.argv[2];
if (!path) { console.log(JSON.stringify({ error: 'no path' })); process.exit(0); }
let raw;
try { raw = fs.readFileSync(path, 'utf8'); } catch (e) { console.log(JSON.stringify({ error: 'unreadable: ' + e.message })); process.exit(0); }

// Concatenate all assistant text parts from the NDJSON event stream.
let text = '';
for (const line of raw.split('\n')) {
  const t = line.trim();
  if (!t) continue;
  let ev;
  try { ev = JSON.parse(t); } catch { continue; }
  const part = ev && ev.part;
  if (part && (part.type === 'text' || part.type === 'text-delta')) {
    if (typeof part.text === 'string') text += part.text;
    else if (typeof part.delta === 'string') text += part.delta;
  } else if (ev && ev.type === 'text' && typeof ev.text === 'string') {
    text += ev.text;
  }
}

// Prefer the LAST ```json fence; fall back to the last bare {...} object.
function lastJsonBlock(s) {
  const re = /```json\s*([\s\S]*?)```/g;
  let m, last = null;
  while ((m = re.exec(s)) !== null) last = m[1];
  return last;
}
let block = lastJsonBlock(text);
if (!block) {
  const i = text.lastIndexOf('{"seat"');
  if (i >= 0) block = text.slice(i);
}
if (!block) { console.log(JSON.stringify({ error: 'no json block', textLen: text.length })); process.exit(0); }
try {
  const obj = JSON.parse(block.trim());
  console.log(JSON.stringify(obj));
} catch (e) {
  console.log(JSON.stringify({ error: 'parse failed: ' + e.message, sample: block.trim().slice(0, 300) }));
}
