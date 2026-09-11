'use strict';

// Connectors are the wiring, and wiring reads as elbows: an angle leaves the reader unable to tell a
// deliberate join from a slip, and the end stops meeting the edge it was attached to. Radial
// decoration and icon glyphs are the exception, and a path is judged only once it is marked as one.

const NAME = 'orthogonal-connectors';
const LEAF = new Set(['rect', 'circle', 'ellipse', 'line', 'path', 'use', 'image', 'polygon', 'polyline', 'text', 'tspan']);
const ARITY = { M: 2, L: 2, H: 1, V: 1, A: 7, Q: 4, Z: 0 };
const DECORATION = /(spoke|axis|radar)/;
// A connector announces itself: it ends in an arrowhead or names itself one. A line that does
// neither is a trend line, a rule or a tick, and the elbow vocabulary is not about those.
const CONNECTOR = /(connector|arrow|edge|link|flow)/;
// A hop arches over what it must not touch, and an arch is a curve by design.
const HOP = /(hop|bridge|arch)/;
const attr = (attrs, name) => (new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`).exec(attrs) || [])[1];

// Radial layers, icons and decoration groups draw their angles on purpose and may carry that mark
// themselves, as the radial diagrams' spokes do.
function decorated(ancestors, attrs) {
  const carrier = (markup) => /aria-hidden\s*=\s*"true"/.test(markup) || /data-diagram-decoration\s*=\s*"true"/.test(markup)
    || DECORATION.test(`${attr(markup, 'class') || ''} ${attr(markup, 'id') || ''}`);
  return carrier(attrs) || ancestors.some((ancestor) => carrier(ancestor));
}

function problems(d) {
  const found = [], tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+/g) || [];
  let x = 0, y = 0, command = null, i = 0;
  while (i < tokens.length) {
    if (/^[a-zA-Z]$/.test(tokens[i])) {
      command = tokens[i];
      i += 1;
      if (command.toUpperCase() === 'Z') { command = null; continue; }
      if (!(command.toUpperCase() in ARITY)) { found.push(`uses the "${command}" command`); return found; }
    }
    if (!command) { found.push('reaches a parameter with no command'); return found; }
    const key = command.toUpperCase();
    const args = tokens.slice(i, i + ARITY[key]).map(Number);
    if (args.length < ARITY[key]) { found.push('ends inside a segment'); return found; }
    i += ARITY[key];
    const relative = command !== key;
    const move = (ax, ay) => { x = relative ? x + ax : ax; y = relative ? y + ay : ay; };
    if (key === 'M') { move(args[0], args[1]); command = relative ? 'l' : 'L'; }
    else if (key === 'L') {
      const px = x, py = y;
      move(args[0], args[1]);
      if (x !== px && y !== py) found.push(`turns with a diagonal L segment to ${x},${y}`);
    } else if (key === 'H') { x = relative ? x + args[0] : args[0]; }
    else if (key === 'V') { y = relative ? y + args[0] : args[0]; }
    else move(args[ARITY[key] - 2], args[ARITY[key] - 1]);
  }
  return found;
}

module.exports = {
  name: NAME,
  scope: 'file',
  run(ctx) {
    const { file, path, regions, flattenTags, tally, record, label } = ctx;
    const radialFile = path.basename(file) === 'radar.html', open = [];
    const tagRe = /<(\/?)([a-zA-Z][\w-]*)\b([^>]*?)(\/?)>/g;
    let match;
    while ((match = tagRe.exec(flattenTags(regions.markup))) !== null) {
      const closing = match[1] === '/', tag = match[2], attrs = match[3];
      if (closing) { open.pop(); continue; }
      const skip = decorated(open, attrs);
      const isConnector = /\bmarker-\w+\s*=/.test(attrs) || CONNECTOR.test(attr(attrs, 'class') || '');
      if (tag === 'line' && !radialFile && !skip && isConnector) {
        tally(NAME, 1);
        const [x1, y1, x2, y2] = ['x1', 'y1', 'x2', 'y2'].map((name) => Number(attr(attrs, name)));
        if ([x1, y1, x2, y2].every(Number.isFinite) && x1 !== x2 && y1 !== y2) {
          record(NAME, 'error', label, `line ${x1},${y1} to ${x2},${y2} runs at an angle; a connector off the elbow vocabulary reads as a slip and its end misses the edge it was attached to`);
        }
      }
      if (tag === 'path' && isConnector && !skip && !HOP.test(attr(attrs, 'class') || '')) {
        tally(NAME, 1);
        const d = attr(attrs, 'd') || '', id = attr(attrs, 'id');
        for (const problem of problems(d)) {
          record(NAME, 'error', label, `${id ? `path#${id}` : `path "${d.slice(0, 40)}"`} ${problem}; a connector keeps to M, L, H, V, A, Q and Z, and only an A may bend, for a rounded corner`);
        }
      }
      if (match[4] !== '/' && !LEAF.has(tag)) open.push(attrs);
    }
  },
};
