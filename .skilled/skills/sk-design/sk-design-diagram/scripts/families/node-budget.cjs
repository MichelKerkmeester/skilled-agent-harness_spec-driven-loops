'use strict';

// The budget is what keeps a drawing a drawing: past nine nodes the reader is parsing a graph rather
// than recognizing a shape, and past twelve arrows the routes stop being traceable at a glance. It
// counts tagged elements, never raw <rect>s, because a label mask and a node are indistinguishable by
// geometry alone, and a corpus that predates the tag is silent rather than wrong.

const NAME = 'node-budget';
const NODE_BUDGET = 9;
const ARROW_BUDGET = 12;

module.exports = {
  name: NAME,
  scope: 'file',
  run(ctx) {
    const { regions, flattenTags, tally, record, label } = ctx;
    // A delivery checked as an extra owes the same budget as the corpus it was copied from, so no
    // kind is exempt here. The exemption that used to sit on this line named a kind the harness
    // stopped assigning, which made it a branch that could never be taken.
    const markup = flattenTags(regions.markup);
    const count = (name) => (markup.match(new RegExp(`<[^>]*\\b${name}\\b[^>]*>`, 'g')) || []).length;
    const nodes = count('data-diagram-node');
    const arrows = count('data-diagram-arrow');
    // The corpus ships no tagged elements, so there is nothing here to measure. A file that carries
    // neither tag records no comparison rather than one silent pass, and the run's invocation count
    // is what says the file was visited.
    if (nodes === 0 && arrows === 0) return;
    tally(NAME, 1);
    if (nodes > NODE_BUDGET) {
      record(NAME, 'error', label, `${nodes} tagged nodes against a budget of ${NODE_BUDGET}; past that count the drawing stops reading as one shape and starts reading as a chart`);
    }
    if (arrows > ARROW_BUDGET) {
      record(NAME, 'error', label, `${arrows} tagged arrows against a budget of ${ARROW_BUDGET}; past that count the eye can no longer follow a route from end to end`);
    }
  },
};
