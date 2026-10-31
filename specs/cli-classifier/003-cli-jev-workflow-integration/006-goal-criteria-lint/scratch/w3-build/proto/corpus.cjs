'use strict';
// Orchestrator planning prototype only: measures the prototype rules on the tree.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../../../../../../..');
const { extractDurableSlice } = require(path.join(ROOT, '.skilled/hooks/goal/lib/goal-slice.cjs'));
const { rule4DanglingRefs, rule5ExternalFile, classifyCriterion } = require('./rules.cjs');

function getAnchorBody(content, anchorName) {
  const open = '<!-- ANCHOR:' + anchorName + ' -->';
  const close = '<!-- /ANCHOR:' + anchorName + ' -->';
  const openIndex = content.indexOf(open);
  const closeIndex = content.indexOf(close);
  if (openIndex < 0 || closeIndex < 0 || closeIndex < openIndex) return null;
  if (content.indexOf(open, openIndex + open.length) >= 0) return null;
  if (content.indexOf(close, closeIndex + close.length) >= 0) return null;
  return content.slice(openIndex + open.length, closeIndex);
}
function criteriaLines(slice) {
  const lines = slice.split(/\r\n|\r|\n/u);
  const body = getAnchorBody(slice, 'completion');
  let section;
  if (body !== null) section = body.split(/\r\n|\r|\n/u);
  else {
    const start = lines.findIndex((l) => /^#{1,6}\s+(?:\d+(?:\.\d+)*\.\s*)?Completion Criteria\b/iu.test(l));
    section = [];
    if (start >= 0) {
      const depth = lines[start].match(/^(#{1,6})\s+/u)[1].length;
      for (let i = start + 1; i < lines.length; i += 1) {
        const h = lines[i].match(/^(#{1,6})\s+/u);
        if (h && h[1].length <= depth) break;
        section.push(lines[i]);
      }
    }
  }
  return section.map((l) => l.match(/^[-*+]\s+(?:\[[ xX]\]\s*)?(.*)$/u)).filter(Boolean).map((m) => m[1]);
}
const files = [];
let scratch = 0;
(function visit(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isFile() && e.name === 'goal.md') {
      if (path.relative(ROOT, p).split(path.sep).includes('scratch')) scratch += 1; else files.push(p);
    } else if (e.isDirectory() && e.name !== 'z_archive') visit(p);
  }
})(path.join(ROOT, 'specs'));
const counts = { files: files.length, scratch, criteria: 0, scored: 0, placeholder: 0, lexical_unscored: 0, no_input: 0, r4: 0, r5: 0, both: 0 };
const samples4 = [];
const samples5 = [];
const unscored = [];
for (const f of files) {
  const items = criteriaLines(extractDurableSlice(fs.readFileSync(f, 'utf8')));
  if (items.length === 0) counts.no_input += 1;
  for (const t of items) {
    counts.criteria += 1;
    const c = classifyCriterion(t);
    counts[c] += 1;
    if (c !== 'scored') { if (c === 'lexical_unscored') unscored.push(t); continue; }
    const a = rule4DanglingRefs(t);
    const b = rule5ExternalFile(t);
    if (a.length) { counts.r4 += 1; samples4.push(a.join(' | ')); }
    if (b.length) { counts.r5 += 1; samples5.push(b.join(' | ') + '  <<  ' + t.slice(0, 120)); }
    if (a.length && b.length) counts.both += 1;
  }
}
console.log(JSON.stringify(counts));
const freq = {};
for (const s of samples4) for (const x of s.split(' | ')) { const k = x.toLowerCase(); freq[k] = (freq[k] || 0) + 1; }
console.log('top rule4 spans:', Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, v]) => k + '=' + v).join(', '));
console.log('rule5 samples:\n' + samples5.slice(0, 25).join('\n'));
console.log('unscored:\n' + unscored.slice(0, 15).join('\n'));
