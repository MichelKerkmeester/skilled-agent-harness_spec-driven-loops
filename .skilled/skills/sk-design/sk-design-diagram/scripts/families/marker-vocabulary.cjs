'use strict';

// A marker exists to be drawn. A definition nothing points at is dead weight in a defs block, and a
// url(#...) with no marker behind it paints no arrowhead at all - the connector simply ends. Both
// halves are invisible in a browser, which is why the pair is held here rather than caught in review.

const NAME = 'marker-vocabulary';
const PROPERTY = /\bmarker-(?:start|mid|end)\s*:\s*([^;}"']*)/gi;

function urlTargets(value) {
  return [...value.matchAll(/url\(\s*["']?#([^)"'\s]+)["']?\s*\)/gi)].map((match) => match[1]);
}

module.exports = {
  name: NAME,
  scope: 'file',
  run(ctx) {
    const { regions, flattenTags, tally, record, label } = ctx;
    const markup = flattenTags(regions.markup);
    const css = regions.styles.join('\n');

    const defined = new Set();
    for (const match of markup.matchAll(/<marker\b[^>]*>/gi)) {
      const id = /\bid\s*=\s*"([^"]*)"/.exec(match[0]);
      if (id && id[1]) defined.add(id[1]);
    }

    const drawn = new Set();
    // The attribute form, which is how every connector in the corpus reaches its marker.
    for (const match of markup.matchAll(/\bmarker-(?:start|mid|end)\s*=\s*"([^"]*)"/gi)) {
      for (const id of urlTargets(match[1])) drawn.add(id);
    }
    // The property form, covering a stylesheet rule and the same property written inline on an
    // element; a clip-path or pattern url(#...) is deliberately not read, since it draws no marker.
    for (const match of `${css}\n${markup}`.matchAll(PROPERTY)) {
      for (const id of urlTargets(match[1])) drawn.add(id);
    }

    // A starter is a skeleton: it defines the marker trio so a copy can draw with it, and draws
    // nothing itself. Only a worked form owes the rule that every definition is used.
    for (const id of defined) {
      if (ctx.kind === 'starter') break;
      tally(NAME, 1);
      if (!drawn.has(id)) {
        record(NAME, 'error', label, `<marker id="${id}"> is defined and no marker-start, marker-mid or marker-end draws it; a marker nothing references is dead weight in the defs block`);
      }
    }
    for (const id of drawn) {
      tally(NAME, 1);
      if (!defined.has(id)) {
        record(NAME, 'error', label, `url(#${id}) is drawn as a marker and no <marker id="${id}"> is defined in this file, so the connector ends in no arrowhead at all`);
      }
    }
  },
};
