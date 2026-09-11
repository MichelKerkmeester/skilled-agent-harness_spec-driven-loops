'use strict';

// A diagram with no name is invisible in a browser and total in a screen reader, which announces
// the file instead of the subject. The slug prefix on the ids is not decoration: two diagrams
// inlined on one page share a document, so bare title/desc ids make the second one answer to the first.

const NAME = 'accessible-svg';
const SPECIMEN_SHEET = 'assets/style-reference/harness-diagram/icons.html';
const BARE_IDS = new Set(['title', 'desc']);

function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Elements of one tag indexed by their id, so a label can be resolved to the text it names.
function textById(markup, tag) {
  const found = new Map();
  const re = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}\\s*>`, 'gi');
  let match;
  while ((match = re.exec(markup)) !== null) {
    const id = /\bid\s*=\s*"([^"]*)"/.exec(match[1]);
    if (id && id[1]) found.set(id[1], match[2].trim());
  }
  return found;
}

module.exports = {
  name: NAME,
  scope: 'file',
  run(ctx) {
    const { file, label, kind, regions, flattenTags, tally, record } = ctx;
    if (file.endsWith(SPECIMEN_SHEET)) return; // specimen glyphs, decorative and aria-hidden on purpose
    const markup = flattenTags(regions.markup);
    // Only the outermost diagram carries the role; nested <svg> glyphs inside it are its children.
    const open = /<svg\b[^>]*\brole\s*=\s*"img"[^>]*>/i.exec(markup);
    tally(NAME, 1);
    if (!open) {
      if (kind === 'starter' || kind === 'form') {
        record(NAME, 'error', label, 'no <svg role="img"> in the delivery; without the image role a diagram is read as raw markup rather than announced as one thing');
      }
      return;
    }
    const labelled = /aria-labelledby\s*=\s*"([^"]*)"/i.exec(open[0]);
    tally(NAME, 1);
    if (!labelled || !labelled[1].trim()) {
      record(NAME, 'error', label, 'the <svg role="img"> names no aria-labelledby, so assistive tech announces an unlabelled graphic');
      return;
    }

    const ids = labelled[1].trim().split(/\s+/);
    const descs = textById(markup, 'desc');
    const rest = markup.slice(open.index + open[0].length);
    for (const id of ids) {
      tally(NAME, 1);
      if (!new RegExp(`\\bid\\s*=\\s*"${escapeRe(id)}"`).test(markup)) {
        record(NAME, 'error', label, `aria-labelledby names "${id}" and no element in the file carries that id, so the label points at nothing`);
      }
      if (BARE_IDS.has(id)) {
        record(NAME, 'error', label, `"${id}" is a bare title/desc id; the next diagram inlined on the same page would collide with it`);
      }
    }
    const child = /^\s*<([a-zA-Z][\w:.-]*)\b/.exec(rest), title = /^\s*<title\b[^>]*>([\s\S]*?)<\/title\s*>/i.exec(rest);
    const named = Boolean(child) && child[1].toLowerCase() === 'title';
    tally(NAME, 2);
    if (!named) {
      record(NAME, 'error', label, `the first child of the labelled <svg> is <${child ? child[1] : 'nothing'}> rather than <title>; the accessible name comes from the first title element, so a title below <defs> is not read`);
    }
    if (named && (!title || !title[1].trim())) {
      record(NAME, 'error', label, 'the <title> at the top of the <svg> is empty or never closed, so the diagram is announced with no name');
    }
    tally(NAME, 1);
    const desc = ids.map((id) => descs.get(id)).find((text) => text !== undefined);
    tally(NAME, 1);
    if (!desc) {
      record(NAME, 'error', label, `aria-labelledby points at no non-empty <desc> (named ids: ${ids.join(', ')}); the long description is then absent or blank, and a blank one reads as a diagram with nothing in it`);
    }
  },
};
