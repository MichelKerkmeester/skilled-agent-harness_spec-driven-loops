'use strict';

// An id is a document-wide name: two elements answering to one makes every url(#...) reference, label
// target and anchor ambiguous, and which of the two wins is whichever the parser reached first.
// HTML comments are stripped before this runs, so a commented-out block cannot register as a
// duplicate here.

const NAME = 'unique-ids';

module.exports = {
  name: NAME,
  scope: 'file',
  run(ctx) {
    const { regions, flattenTags, tally, record, label } = ctx;
    const counts = new Map();
    for (const match of flattenTags(regions.markup).matchAll(/\bid\s*=\s*"([^"]*)"/gi)) {
      counts.set(match[1], (counts.get(match[1]) || 0) + 1);
    }
    for (const [id, n] of counts) {
      tally(NAME, 1);
      if (n > 1) {
        record(NAME, 'error', label, `id "${id}" is defined ${n} times; a fragment, label or marker reference that names it addresses one element, and which one is parser order`);
      }
    }
  },
};
