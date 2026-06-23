import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const FILES = [
  'aangepast-assortiment.html','aangepast-assortiment-2.html',
  'standaardlijsten.html','standaardlijsten-2.html',
  'vrije-artikelinvoer.html','vrije-artikelinvoer-2.html',
  'bestellimieten.html','bestellimieten-2.html',
  'eigen-assortiment.html','eigen-assortiment-2.html',
  'meerdere-winkelwagens.html','meerdere-winkelwagens-2.html',
  'marad-v4.html',
  'budgetteren.html','budgetteren-2.html',
];

// allowed brand tokens (lowercased, no #)
const ALLOWED = new Set([
  '1b1b1b','ffffff','fff','ececec','0a0a0a','000','000000',
  '9a9a9a','6f6f6f',
  'e7e9ee','cbd0dc','acb3c9','8591b3','06458c','053b77','043367','031d3c',
  'fd4f19','dbab00','367e39','d31510',
  'e6f4e5', // established pale-green badge wash (from oci-v4 reference set)
]);

let anyFail = false;
for (const f of FILES) {
  const p = join(DIST, f);
  let html;
  try { html = readFileSync(p, 'utf8'); } catch { console.log(`MISSING ${f}`); anyFail = true; continue; }

  // off-palette hexes
  const hexes = [...html.matchAll(/#([0-9a-fA-F]{3,8})\b/g)].map(m => m[1].toLowerCase());
  const off = [...new Set(hexes.filter(h => !ALLOWED.has(h)))];

  // flat check
  const gradient = /linearGradient|radialGradient|gradient\(/i.test(html);
  const shadow = /box-shadow|drop-shadow|<filter|filter:\s*(?!none)/i.test(html);

  // card count + per-card orange
  const cards = html.split(/width:480px;height:440px/).slice(1); // segments after each card marker
  const cardCount = cards.length;
  let orangeCards = 0;
  for (const seg of cards) {
    // cut the segment at the next card marker already done by split; check this card body
    if (/#fd4f19/i.test(seg.split('width:480px;height:440px')[0] ?? seg)) orangeCards++;
  }
  // simpler: count cards whose text contains orange, bounded by next card via split above
  orangeCards = cards.filter(seg => /#fd4f19/i.test(seg)).length;
  // the above over-counts because each seg runs to EOF; recompute with boundaries:
  const markers = [...html.matchAll(/width:480px;height:440px/g)].map(m => m.index);
  orangeCards = 0;
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i];
    const end = i + 1 < markers.length ? markers[i+1] : html.length;
    if (/#fd4f19/i.test(html.slice(start, end))) orangeCards++;
  }

  // svg balance
  const svgOpen = (html.match(/<svg/g) || []).length;
  const svgClose = (html.match(/<\/svg>/g) || []).length;

  const fail = off.length || gradient || shadow || orangeCards > 1 || svgOpen !== svgClose || cardCount < 4;
  if (fail) anyFail = true;
  console.log(
    `${fail ? 'FAIL' : 'ok  '} ${f.padEnd(34)} cards=${cardCount} svg=${svgOpen}/${svgClose} orange=${orangeCards} ` +
    `grad=${gradient?'Y':'n'} shadow=${shadow?'Y':'n'}` + (off.length ? `  OFF=[${off.join(',')}]` : '')
  );
}
console.log(anyFail ? '\nRESULT: issues found' : '\nRESULT: all clean');
