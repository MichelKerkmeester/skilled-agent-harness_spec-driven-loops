'use strict';

// A delivery is opened from disk, from a mail client, or inside a sandbox with no network. Anything
// fetched from a third party is a diagram that renders in a substituted typeface, hands the reader's
// referrer to someone else, or fails outright. Exactly one host pair is allowed, because the type
// stack is loaded from it by design and the skill's own templates say so.

const NAME = 'no-external';
const ALLOWED = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);

// Script bodies are blanked before the tag scan: a URL written inside JS is a string, not a fetch,
// while the <script src> the scan is looking for is the fetch itself.
const SCRIPT_BODIES = /(<script\b[^>]*>)[\s\S]*?(<\/script\s*>)/gi;
const SCRIPT_SRC = /<script\b[^>]*\bsrc\s*=\s*"([^"]*)"/gi;

function remoteRefs(value) {
  return [...value.matchAll(/(?:https?:)?\/\/[^\s"'<>()\\]+/gi)].map((match) => match[0]);
}

function hostOf(ref) {
  try {
    return new URL(ref.startsWith('//') ? `https:${ref}` : ref).host;
  } catch {
    return null;
  }
}

module.exports = {
  name: NAME,
  scope: 'file',
  run(ctx) {
    const { clean, regions, tally, record, label } = ctx;
    const css = regions.styles.join('\n');
    const values = [];
    for (const match of regions.markup.matchAll(/\b(?:src|href)\s*=\s*"([^"]*)"/gi)) values.push(match[1]);
    for (const match of `${regions.markup}\n${css}`.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) values.push(match[1]);
    for (const match of css.matchAll(/@import\s+(?:url\(\s*)?["']?([^"')\s;]+)/gi)) values.push(match[1]);
    for (const match of clean.replace(SCRIPT_BODIES, '$1$2').matchAll(SCRIPT_SRC)) values.push(match[1]);

    const refs = new Set();
    for (const value of values) for (const ref of remoteRefs(value)) refs.add(ref);
    for (const ref of refs) {
      tally(NAME, 1);
      const host = hostOf(ref);
      if (!ALLOWED.has(host)) {
        record(NAME, 'error', label, `the delivery fetches ${ref}; it has to render from its own file alone, and ${host ? `${host} is` : 'that reference is'} outside the two allowed font hosts (fonts.googleapis.com, fonts.gstatic.com)`);
      }
    }
  },
};
