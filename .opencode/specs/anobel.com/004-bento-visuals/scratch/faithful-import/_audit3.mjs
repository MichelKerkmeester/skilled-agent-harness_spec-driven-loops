import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const DIST = join(process.cwd(), 'dist');
const FILES = [
  'goedkeuringssysteem-3.html','budgetteren-3.html','bestellimieten-3.html',
  'aangepast-assortiment-3.html','accountbeheer-3.html','eigen-assortiment-3.html',
  'standaardlijsten-3.html','meerdere-winkelwagens-3.html','vrije-artikelinvoer-3.html',
];
const ALLOWED = new Set([
  '1b1b1b','ffffff','fff','ececec','0a0a0a','000','000000',
  '9a9a9a','6f6f6f',
  'e7e9ee','cbd0dc','acb3c9','8591b3','06458c','053b77','043367','031d3c',
  'fd4f19','dbab00','367e39','d31510','e6f4e5',
]);
let anyFail = false;
for (const f of FILES) {
  const p = join(DIST, f);
  let html; try { html = readFileSync(p, 'utf8'); } catch { console.log(`MISSING ${f}`); anyFail = true; continue; }
  const hexes = [...html.matchAll(/#([0-9a-fA-F]{3,8})\b/g)].map(m => m[1].toLowerCase());
  const off = [...new Set(hexes.filter(h => !ALLOWED.has(h)))];
  const gradient = /linearGradient|radialGradient|gradient\(/i.test(html);
  const shadow = /box-shadow|drop-shadow|<filter|filter:\s*(?!none)/i.test(html);
  const markers = [...html.matchAll(/width:480px;height:440px/g)].map(m => m.index);
  const cardCount = markers.length;
  let orangeCards = 0;
  for (let i = 0; i < markers.length; i++) {
    const end = i + 1 < markers.length ? markers[i+1] : html.length;
    if (/#fd4f19/i.test(html.slice(markers[i], end))) orangeCards++;
  }
  const svgOpen = (html.match(/<svg/g) || []).length;
  const svgClose = (html.match(/<\/svg>/g) || []).length;
  const fail = off.length || gradient || shadow || orangeCards > 1 || svgOpen !== svgClose || cardCount !== 6;
  if (fail) anyFail = true;
  console.log(`${fail?'FAIL':'ok  '} ${f.padEnd(30)} cards=${cardCount} svg=${svgOpen}/${svgClose} orange=${orangeCards} grad=${gradient?'Y':'n'} shadow=${shadow?'Y':'n'}` + (off.length?`  OFF=[${off.join(',')}]`:''));
}
console.log(anyFail ? '\nRESULT: issues found' : '\nRESULT: all clean');
