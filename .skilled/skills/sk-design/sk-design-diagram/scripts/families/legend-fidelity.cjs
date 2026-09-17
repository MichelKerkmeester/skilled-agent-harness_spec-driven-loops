'use strict';

// A legend is a promise: a swatch shows the reader what a treatment looks like, so a dash array
// keyed there must be one the drawing actually paints. A legend that keys a 4,3 dash while every
// real connector is 5,4 teaches a pattern the file does not contain, and a reader who copies the
// key draws something the author never drew.
//
// Signal: the corpus marks a legend two ways — an eyebrow text reading LEGEND and legend-* classes
// on the strip's own rows — and every file draws its legend last. So the legend is everything from
// the first of those markers onward, and the dash arrays before it are the ones it may key. A
// stylesheet may carry the dash array instead of the element, so a class-carried pattern is
// resolved too; the swatch is compared against the pattern the file actually paints rather than
// against the spelling of an attribute. A file with no legend marker or no dashed swatch asserts
// nothing, which is not a violation.

const NAME = 'legend-fidelity';
const DRAW = new Set(['rect', 'line', 'path', 'circle', 'ellipse', 'polyline', 'polygon']);
const DASH = /stroke-dasharray\s*:\s*([^;]+)/;
const TEXT_LEGEND = /<text\b[^>]*>[^<]*LEGEND/;
const attr = (attrs, name) => (new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`).exec(attrs) || [])[1];

// "4,3" and "4 3" are the same pattern drawn; compare them as the same value.
function pattern(value) {
  return (value || '').replace(/,/g, ' ').trim().replace(/\s+/g, ' ');
}

// A selector-dash rule applies to an element only when every class it names is on that element,
// so .connector.auth is resolved for a connector that is also auth and not for a bare connector.
function classPatterns(styles) {
  const rules = [];
  for (const block of styles) {
    for (const rule of block.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const found = DASH.exec(rule[2]);
      if (!found) continue;
      const classes = [...rule[1].matchAll(/\.([\w-]+)/g)].map((match) => match[1]);
      if (classes.length) rules.push({ classes, pattern: pattern(found[1]) });
    }
  }
  return rules;
}

module.exports = {
  name: NAME,
  scope: 'file',
  run(ctx) {
    const { regions, flattenTags, tally, record, label } = ctx;
    const markup = flattenTags(regions.markup);
    const rules = classPatterns(regions.styles);

    let legendAt = markup.search(TEXT_LEGEND);
    for (const tag of markup.matchAll(/<[a-zA-Z][\w-]*\b[^>]*>/g)) {
      const classes = attr(tag[0], 'class') || '';
      if (!/legend/i.test(classes)) continue;
      if (legendAt === -1 || tag.index < legendAt) legendAt = tag.index;
      break;
    }
    if (legendAt === -1) return;

    const before = new Set();
    // The same resolution on both sides: a dash array the file declares in its stylesheet is as
    // much a pattern the drawing paints as one written on the element, so the swatch is read
    // against one vocabulary rather than against the two ways of spelling it.
    const painted = (attrs) => {
      const inline = attr(attrs, 'stroke-dasharray');
      if (inline) return pattern(inline);
      const classes = (attr(attrs, 'class') || '').split(/\s+/).filter(Boolean);
      let best = null;
      for (const rule of rules) {
        if (!rule.classes.every((name) => classes.includes(name))) continue;
        if (!best || rule.classes.length >= best.classes.length) best = rule;
      }
      return best ? best.pattern : null;
    };
    const tagRe = /<(rect|line|path|circle|ellipse|polyline|polygon)\b([^>]*?)\/?>/g;
    let match;
    while ((match = tagRe.exec(markup)) !== null) {
      const carried = painted(match[2]);
      if (match.index < legendAt) {
        if (carried) before.add(carried);
        continue;
      }
      if (!carried) continue;
      tally(NAME, 1);
      if (!before.has(carried)) {
        record(NAME, 'error', label, `a legend swatch keys the dash array "${carried}" and no element of the drawing paints it; a legend may key only patterns the file contains`);
      }
    }
  },
};
