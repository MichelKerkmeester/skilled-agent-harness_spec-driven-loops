// Read-only baseline for chat question detection. It mirrors the pairing in
// sweep-transcript.mjs (a text-only assistant message followed by a typed
// prompt) and never calls sweepTranscript, so no queue file is written.
//
// Usage: node measure-chat-questions.mjs <transcript.jsonl>...
// Columns: replies = typed replies after a text-only message, closing = the
// current rule's candidates (closing paragraph holds `?`, process filter
// passed), earlier = replies whose message asks only in an earlier paragraph,
// units = draft-rule question units after the process filter and a cap of 3,
// max = most question units in one message before the cap.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const { isProcessQuestion } = await import(
  join(ROOT, '.skilled/hooks/decision-capture/lib/capture-core.mjs')
);

const CAP = 3;
const PARAGRAPH_BREAK = /(?:\r?\n[ \t]*){2,}/;
const OPTION_LINE = /^\s*(?:[-*]\s+)?(?:\*\*)?[A-D]\)/;
const OPTION_MARKER = /^\s*(?:[-*]\s+)?(?:\*\*)?/;

const blocksOf = (entry) => (Array.isArray(entry?.message?.content) ? entry.message.content : []);
const paragraphsOf = (text) => text.split(PARAGRAPH_BREAK).filter((p) => p.trim() !== '');
const optionsOf = (p) => p.split('\n').filter((l) => OPTION_LINE.test(l)).map((l) => l.replace(OPTION_MARKER, ''));
// Code, quoted spans, blockquotes, table rows and headings are not the
// assistant asking the operator anything, so they are removed before the scan.
const prose = (p) => p.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
  .replace(/"[^"\n]*"/g, '').replace(/“[^”\n]*”/g, '')
  .split('\n').filter((l) => !/^\s*(>|\||#)/.test(l)).join('\n');
const asks = (p) => /[^.!?\n]{4,}\?/.test(prose(p));
const isOptionsOnly = (p) => p.split('\n').filter((l) => l.trim()).every((l) => OPTION_LINE.test(l));
const kept = (p) => !isProcessQuestion({ question: p, header: '', options: optionsOf(p) });

function typedPrompt(entry) {
  if (entry?.type !== 'user' || entry.isMeta === true || entry.isCompactSummary === true) return null;
  const content = entry?.message?.content;
  let text = null;
  if (typeof content === 'string') text = content;
  else if (Array.isArray(content)) {
    const parts = content.filter((b) => b?.type === 'text' && typeof b.text === 'string');
    if (parts.length) text = parts.map((b) => b.text).join('\n');
  }
  return !text || text.startsWith('<') ? null : text;
}

// Draft rule: every earlier paragraph that asks, with an options-only paragraph after
// it kept as part of the same unit. The closing paragraph keeps the current
// test, any `?` at all, so the existing candidate is unchanged.
function unitsOf(text) {
  const paragraphs = paragraphsOf(text);
  const units = [];
  for (let i = 0; i < paragraphs.length; i += 1) {
    const closing = i === paragraphs.length - 1;
    if (closing ? !paragraphs[i].includes('?') : !asks(paragraphs[i])) continue;
    const next = paragraphs[i + 1];
    units.push(next && isOptionsOnly(next) ? `${paragraphs[i]}\n\n${next}` : paragraphs[i]);
  }
  return units;
}

const total = { replies: 0, closing: 0, earlier: 0, units: 0, max: 0 };
console.log('file\treplies\tclosing\tearlier\tunits\tmax');
for (const path of process.argv.slice(2)) {
  const row = { replies: 0, closing: 0, earlier: 0, units: 0, max: 0 };
  let last = null;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    if (entry.isSidechain === true) continue;
    const blocks = blocksOf(entry);
    if (entry.type === 'assistant') {
      if (blocks.some((b) => b.type === 'tool_use')) { last = null; continue; }
      const parts = blocks.filter((b) => b.type === 'text' && typeof b.text === 'string');
      if (parts.length) last = parts.map((b) => b.text).join('\n');
      continue;
    }
    if (typedPrompt(entry) === null) continue;
    if (last) {
      row.replies += 1;
      const paragraphs = paragraphsOf(last);
      const closingParagraph = paragraphs.at(-1) ?? '';
      if (closingParagraph.includes('?') && kept(closingParagraph)) row.closing += 1;
      if (!closingParagraph.includes('?') && paragraphs.slice(0, -1).some(asks)) row.earlier += 1;
      const units = unitsOf(last);
      row.max = Math.max(row.max, units.length);
      row.units += Math.min(CAP, units.filter(kept).length);
    }
    last = null;
  }
  console.log([path.split('/').at(-1).slice(0, 8), row.replies, row.closing, row.earlier, row.units, row.max].join('\t'));
  for (const k of ['replies', 'closing', 'earlier', 'units']) total[k] += row[k];
  total.max = Math.max(total.max, row.max);
}
console.log(['TOTAL', total.replies, total.closing, total.earlier, total.units, total.max].join('\t'));
