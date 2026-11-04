#!/usr/bin/env node
'use strict';
// Structural defect scanner for the sk-code reference/asset audit.
// Read-only over the repository; writes only under the lineage .executor-state dir.
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const SK = '.skilled/skills/sk-code';

function walk(dir, out = []) {
  for (const name of fs.readdirSync(path.join(ROOT, dir))) {
    const rel = path.join(dir, name);
    const st = fs.statSync(path.join(ROOT, rel));
    if (st.isDirectory()) walk(rel, out);
    else if (name.endsWith('.md')) out.push(rel);
  }
  return out;
}

const scoped = [];
for (const top of ['SKILL.md', 'ROUTER.md']) scoped.push(path.join(SK, top));
for (const dir of fs.readdirSync(path.join(ROOT, SK))) {
  const abs = path.join(ROOT, SK, dir);
  if (!fs.statSync(abs).isDirectory()) continue;
  if (dir === 'shared') {
    for (const f of walk(path.join(SK, dir))) scoped.push(f);
    continue;
  }
  if (!dir.startsWith('sk-code-')) continue;
  for (const f of ['SKILL.md', 'ROUTER.md']) {
    if (fs.existsSync(path.join(ROOT, SK, dir, f))) scoped.push(path.join(SK, dir, f));
  }
  for (const sub of ['references', 'assets']) {
    if (fs.existsSync(path.join(ROOT, SK, dir, sub))) {
      for (const f of walk(path.join(SK, dir, sub))) scoped.push(f);
    }
  }
}

const BOLD = /^\*\*[^*]{2,90}\*\*[.:]?(\s|$)/;
const ATX = /^(#{1,6})\s+(.*?)\s*$/;
const HR = /^(-{3,}|\*{3,}|_{3,})$/;

function analyze(rel) {
  const text = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const lines = text.split('\n');
  const inFence = new Array(lines.length).fill(false);
  let fence = null;
  let fm = 0;
  if (lines[0] === '---') { fm = 1; while (fm < lines.length && lines[fm] !== '---') fm++; }
  let f = null;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (i <= fm) { inFence[i] = true; continue; }
    if (/^```/.test(t) || /^~~~/.test(t)) {
      if (!f) f = t.slice(0, 3); else if (t.startsWith(f)) f = null;
      inFence[i] = true; continue;
    }
    inFence[i] = !!f;
  }
  const content = (i) => !inFence[i];
  const headings = [];
  for (let i = 0; i < lines.length; i++) {
    if (!content(i)) continue;
    const m = lines[i].match(ATX);
    if (m) headings.push({ line: i + 1, level: m[1].length, text: m[2].replace(/\s*#+\s*$/, '') });
  }
  const res = { file: rel, lines: lines.length, frontmatter: fm > 0, headings: headings.length, defects: {} };
  const d = res.defects;

  // 1. consecutive bold-label lines
  const boldPairs = [];
  for (let i = 0; i < lines.length - 1; i++) {
    if (!content(i) || !content(i + 1)) continue;
    if (lines[i].trim() === '' || lines[i + 1].trim() === '') continue;
    if (/^\s*([-*+]|\d+\.)\s/.test(lines[i])) continue;
    if (BOLD.test(lines[i].trim()) && BOLD.test(lines[i + 1].trim())) boldPairs.push({ line: i + 1, a: lines[i].trim(), b: lines[i + 1].trim() });
  }
  if (boldPairs.length) d.boldLabelJoins = boldPairs;

  // 2. text directly above --- (setext heading rendering)
  const setext = [];
  for (let i = 1; i < lines.length; i++) {
    if (!content(i) || !content(i - 1)) continue;
    if (!HR.test(lines[i].trim())) continue;
    const prev = lines[i - 1];
    if (prev.trim() === '') continue;
    if (/^(#{1,6})\s/.test(prev.trim())) continue;
    if (/^\s*([-*+]|\d+\.)\s/.test(prev)) continue;
    if (/^\|/.test(prev.trim())) continue;
    if (/^>/.test(prev.trim())) continue;
    setext.push({ line: i + 1, text: prev.slice(0, 120) });
  }
  if (setext.length) d.setText = setext;

  // 3. OVERVIEW AND <topic> headings without an overview
  const overviewAnd = [];
  for (let h = 0; h < headings.length; h++) {
    const hd = headings[h];
    if (!/OVERVIEW\s+(AND|&)\b/i.test(hd.text)) continue;
    const nextSame = headings.slice(h + 1).find((x) => x.level <= hd.level);
    const end = nextSame ? nextSame.line - 1 : lines.length;
    const body = [];
    for (let i = hd.line; i < end; i++) {
      const t = lines[i].trim();
      if (t && !ATX.test(t)) body.push(t);
    }
    const firstProse = body.find((t) => !t.startsWith('-') && !t.startsWith('*') && !t.startsWith('|') && !t.startsWith('```') && !t.startsWith('>'));
    overviewAnd.push({
      line: hd.line,
      heading: hd.text,
      bodyLines: body.length,
      firstProse: firstProse ? firstProse.slice(0, 100) : null,
      proseChars: firstProse ? firstProse.length : 0,
      flag: !firstProse || firstProse.length < 40,
    });
  }
  if (overviewAnd.length) d.overviewAnd = overviewAnd;

  // 4. duplicate heading text
  const seen = new Map();
  const dupes = [];
  for (const hd of headings) {
    const key = hd.text.toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key) && key.length > 3) dupes.push({ line: hd.line, text: hd.text, firstLine: seen.get(key) });
    else seen.set(key, hd.line);
  }
  if (dupes.length) d.duplicateHeadings = dupes;

  // 5. empty sections
  const empty = [];
  for (let h = 0; h < headings.length - 1; h++) {
    const a = headings[h], b = headings[h + 1];
    if (b.level <= a.level) {
      const between = lines.slice(a.line, b.line - 1).map((s) => s.trim()).filter(Boolean);
      if (between.length === 0) empty.push({ line: a.line, heading: a.text, nextLine: b.line });
    }
  }
  if (empty.length) d.emptySections = empty;

  // 6. bare URLs (outside fences, not inside a markdown link or code span)
  const bare = [];
  for (let i = 0; i < lines.length; i++) {
    if (!content(i)) continue;
    const re = /https?:\/\/[^\s)>\]`]+/g;
    let m;
    while ((m = re.exec(lines[i])) !== null) {
      const before = lines[i].slice(0, m.index);
      const after = lines[i].slice(m.index + m[0].length);
      const inLink = /\]\([^)]*$/.test(before) || /^[^[]*\]\(/.test(after) || before.endsWith('<');
      const inCode = (before.match(/`/g) || []).length % 2 === 1;
      if (!inLink && !inCode) bare.push({ line: i + 1, url: m[0] });
    }
  }
  if (bare.length) d.bareUrls = bare;

  // 7. numbered H2 order anomalies
  const num = headings.filter((h) => h.level === 2 && /^(\d+)[A-Z]?\./.test(h.text))
    .map((h) => ({ line: h.line, n: Number(h.text.match(/^(\d+)/)[1]), text: h.text }));
  const anomalies = [];
  for (let i = 1; i < num.length; i++) {
    if (num[i].n === num[i - 1].n) anomalies.push({ line: num[i].line, issue: 'duplicate-number', n: num[i].n });
    else if (num[i].n < num[i - 1].n) anomalies.push({ line: num[i].line, issue: 'out-of-order', from: num[i - 1].n, to: num[i].n });
    else if (num[i].n > num[i - 1].n + 1) anomalies.push({ line: num[i].line, issue: 'gap', from: num[i - 1].n, to: num[i].n });
  }
  if (anomalies.length) d.headingNumberAnomalies = anomalies;

  // 8. Related/References not last
  const last = headings[headings.length - 1];
  const related = headings.filter((h) => /RELATED|REFERENCES AND RELATED/i.test(h.text));
  if (related.length) {
    const rel = related[0];
    const after = headings.filter((h) => h.line > rel.line && h.level <= rel.level);
    if (after.length) {
      d.relatedNotLast = { line: rel.line, heading: rel.text, lastLine: after[after.length - 1].line, lastHeading: after[after.length - 1].text };
    }
  }

  // 9. heading level jumps
  const jumps = [];
  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level - headings[i - 1].level > 1) jumps.push({ line: headings[i].line, from: headings[i - 1].level, to: headings[i].level, heading: headings[i].text });
  }
  if (jumps.length) d.headingJumps = jumps;

  // 10. first H2 not OVERVIEW
  const firstH2 = headings.find((h) => h.level === 2);
  if (firstH2 && !/OVERVIEW/i.test(firstH2.text)) d.firstH2NotOverview = { line: firstH2.line, heading: firstH2.text };

  // 12. every OVERVIEW section: prose present before first subheading?
  const overviews = [];
  for (let h = 0; h < headings.length; h++) {
    const hd = headings[h];
    if (hd.level !== 2 || !/^(\d+[A-Z]?\.\s*)?OVERVIEW\b/i.test(hd.text)) continue;
    const nextSame = headings.slice(h + 1).find((x) => x.level <= hd.level);
    const end = nextSame ? nextSame.line - 1 : lines.length;
    const seg = lines.slice(hd.line, end);
    let prose = null;
    for (const raw of seg) {
      const t = raw.trim();
      if (!t) continue;
      if (t.startsWith('#')) break;
      if (t.startsWith('```') || t.startsWith('|') || t.startsWith('- ') || t.startsWith('* ') || /^\d+\.\s/.test(t)) break;
      if (t.length >= 40) { prose = t; break; }
      prose = prose || t;
    }
    const h3 = headings.filter((x) => x.line > hd.line && x.line <= end && x.level === 3).map((x) => x.text);
    overviews.push({
      line: hd.line,
      heading: hd.text,
      proseChars: prose ? prose.length : 0,
      hasPurpose: h3.some((t) => /^purpose/i.test(t)),
      hasWhen: h3.some((t) => /^when to use/i.test(t) || /^when to create/i.test(t)),
      h3,
      flag: (!prose || prose.length < 40) && h3.length === 0,
    });
  }
  if (overviews.length) d.overviews = overviews;

  // 13. frontmatter completeness
  if (fm > 0) {
    const head = lines.slice(0, fm + 1).join('\n');
    const missing = ['title', 'description', 'trigger_phrases', 'importance_tier', 'contextType', 'version']
      .filter((f) => !new RegExp(`^${f}:`, 'm').test(head));
    if (missing.length) d.frontmatterMissing = missing;
  } else d.noFrontmatter = true;

  // 14. intro after H1 before first horizontal rule
  const h1 = headings.find((x) => x.level === 1);
  if (h1) {
    let end = lines.length;
    for (let i = h1.line; i < lines.length; i++) if (HR.test(lines[i].trim())) { end = i; break; }
    const intro = lines.slice(h1.line, end).map((s) => s.trim()).filter(Boolean);
    const words = intro.join(' ').split(/\s+/).filter(Boolean).length;
    const hasH3 = intro.some((t) => /^#{2,4}\s/.test(t));
    if (words > 60 || hasH3 || intro.length > 3) d.introTooLong = { line: h1.line, words, lines: intro.length, hasH3 };
  }

  // 15. rule-id heading order (e.g. CS1, TS12) within a file
  const ids = [];
  for (const hd of headings) {
    const m = hd.text.match(/^([A-Z]{1,4})(\d{1,3})\.\s/);
    if (m) ids.push({ line: hd.line, prefix: m[1], n: Number(m[2]), text: hd.text });
  }
  const idGroups = {};
  for (const it of ids) (idGroups[it.prefix] = idGroups[it.prefix] || []).push(it);
  const idAnoms = [];
  for (const [prefix, arr] of Object.entries(idGroups)) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].n <= arr[i - 1].n) idAnoms.push({ line: arr[i].line, prefix, from: arr[i - 1].n, to: arr[i].n, issue: arr[i].n === arr[i - 1].n ? 'duplicate' : 'out-of-order' });
    }
  }
  if (idAnoms.length) d.ruleIdOrder = idAnoms;

  // 16. repeated bold labels inside one section
  const labelDupes = [];
  let sectionStart = 0;
  for (let h = 0; h <= headings.length; h++) {
    const start = h === 0 ? 1 : headings[h - 1].line;
    const end = h < headings.length ? headings[h].line - 1 : lines.length;
    const seenLabels = new Map();
    for (let i = start; i <= end; i++) {
      if (!content(i - 1)) continue;
      const m = lines[i - 1].trim().match(/^\*\*([^*]{2,60}?)[.:]?\*\*/);
      if (!m) continue;
      const key = m[1].toLowerCase().trim();
      if (seenLabels.has(key)) labelDupes.push({ line: i, label: m[1], firstLine: seenLabels.get(key) });
      else seenLabels.set(key, i);
    }
  }
  if (labelDupes.length) d.repeatedBoldLabels = labelDupes;

  // 17. long prose lines and tabs
  const longLines = [];
  for (let i = 0; i < lines.length; i++) {
    if (!content(i)) continue;
    if (lines[i].length > 400) longLines.push({ line: i + 1, chars: lines[i].length });
  }
  if (longLines.length) d.longLines = longLines;

  // 11. repeated duplicated paragraph blocks
  const blocks = [];
  let cur = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!content(i) || t === '' || ATX.test(t) || t === '---') {
      if (cur.length) { blocks.push(cur.join(' ')); cur = []; }
    } else cur.push(t);
  }
  if (cur.length) blocks.push(cur.join(' '));
  const bseen = new Map();
  const bdup = [];
  for (const b of blocks) {
    if (b.length < 60) continue;
    if (bseen.has(b)) bdup.push({ first: bseen.get(b), text: b.slice(0, 100) });
    else bseen.set(b, bdup.length + 1);
  }
  if (bdup.length) d.duplicateParagraphs = bdup;

  return res;
}

const results = scoped.sort().map(analyze);
const summary = results.map((r) => ({
  file: r.file,
  lines: r.lines,
  defects: Object.fromEntries(Object.entries(r.defects).map(([k, v]) => [k, Array.isArray(v) ? v.length : 1])),
}));
fs.writeFileSync(path.join(ROOT, 'specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/research/lineages/deepseek/.executor-state/scan.json'), JSON.stringify({ generatedAt: new Date().toISOString(), fileCount: results.length, results }, null, 2));
const totals = {};
for (const r of results) for (const [k, v] of Object.entries(r.defects)) totals[k] = (totals[k] || 0) + (Array.isArray(v) ? v.length : 1);
console.log(JSON.stringify({ fileCount: results.length, totals }, null, 2));
console.log('--- files with most defect hits ---');
summary.sort((a, b) => Object.values(b.defects).reduce((x, y) => x + y, 0) - Object.values(a.defects).reduce((x, y) => x + y, 0));
for (const s of summary.slice(0, 40)) console.log(String(Object.values(s.defects).reduce((x, y) => x + y, 0)).padStart(3), s.file, JSON.stringify(s.defects));
