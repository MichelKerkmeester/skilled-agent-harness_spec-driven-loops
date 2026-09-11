'use strict';

// A label mask is a paper rect painted under a label so the connector that label names reads
// through the gap. On a long run the gap is a breath the eye forgives; on a short one the mask is
// the connector — the stroke the reader was meant to follow is broken by the very thing that names
// it, and one line reads as a stub and a tail. So under about 60px of drawn length the label
// belongs beside the connector, with no mask across the stroke.
//
// Signals. The corpus marks a label mask with a class token carrying both words (class
// "label-mask"); node-mask and zone-mask carry the same paper fill over a box or a zone, so the
// class is the only marker that says "this rect hides the run of stroke a label sits on" rather
// than "this rect hides grid behind a shape" — the fill alone cannot tell them apart, and a rule
// keyed on the fill flags page backgrounds and node borders. A connector is read the way the elbow
// rule reads one: it ends in an arrowhead or names itself connector, arrow, edge, link or flow,
// and radial decoration is exempt, because a rule, a tick or a trend line carries no arrow label
// to mask. Length is the shape's own drawn geometry, a line's span or a path's segments added end
// to end, never its bounding box: a mask inside the bounding box of an elbow that turns away from
// it erases nothing. The corpus's long masked runs measure well over 100px and the defects this
// rule is drawn from measured 32 to 52px, so the boundary sits at 60.

const NAME = 'label-mask-clearance';
// A label mask may never touch its connector: the gap is what lets a reader trace the line past its
// own label, and a mask on the stroke erases the thing the label names.
//
// The floor is four, not the six the prose asks for, and the difference is units. The prose is
// written in rendered pixels; a drawing is written in user units, which these forms scale up by
// about a quarter on the way to the screen. Four units is therefore around five pixels on screen,
// and a whole family of forms has used it deliberately and reads correctly. Six to ten stays the
// band to aim for; four is the point below which the gap stops being visible at all.
const CLEARANCE = 4;
const ARITY = { M: 2, L: 2, H: 1, V: 1, A: 7, Q: 4, Z: 0 };
const LEAF = new Set(['rect', 'circle', 'ellipse', 'line', 'path', 'use', 'image', 'polygon', 'polyline', 'text', 'tspan']);
const CONNECTOR = /(connector|arrow|edge|link|flow)/;
const DECORATION = /(spoke|axis|radar)/;
const GROUND_FILL = /^(#f5f5f5|#ececec|#141414|#2d3142|var\(--(?:color-)?paper(?:-2)?\))$/i;
const attr = (attrs, name) => (new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`).exec(attrs) || [])[1];

// Radial layers, icons and decoration groups draw their angles on purpose and may carry that
// mark themselves, as the radial diagrams' spokes do.
function decorated(ancestors, attrs) {
  const carrier = (markup) => /aria-hidden\s*=\s*"true"/.test(markup) || /data-diagram-decoration\s*=\s*"true"/.test(markup)
    || DECORATION.test(`${attr(markup, 'class') || ''} ${attr(markup, 'id') || ''}`);
  return carrier(attrs) || ancestors.some((ancestor) => carrier(ancestor));
}

// A connector's own geometry as its segments, so a length and an overlap can be read off the
// stroke rather than a box around it. A quadratic corner is read as its control polygon and an
// arc as its chord — close enough for a rule that asks whether a label can sit on the run.
function segmentsOf(d) {
  const tokens = String(d).match(/[a-zA-Z]|-?\d*\.?\d+/g) || [];
  const segments = [];
  let x = 0, y = 0, command = null, i = 0;
  while (i < tokens.length) {
    if (/^[a-zA-Z]$/.test(tokens[i])) {
      command = tokens[i];
      i += 1;
      if (command.toUpperCase() === 'Z') { command = null; continue; }
      if (!(command.toUpperCase() in ARITY)) return null;
    }
    if (!command) return null;
    const key = command.toUpperCase();
    const args = tokens.slice(i, i + ARITY[key]).map(Number);
    if (args.length < ARITY[key] || args.some((value) => !Number.isFinite(value))) return null;
    i += ARITY[key];
    const relative = command !== key;
    const point = (ax, ay) => ({ x: relative ? x + ax : ax, y: relative ? y + ay : ay });
    if (key === 'M') {
      const to = point(args[0], args[1]);
      x = to.x; y = to.y;
      command = relative ? 'l' : 'L';
      continue;
    }
    if (key === 'L') {
      const to = point(args[0], args[1]);
      segments.push({ x1: x, y1: y, x2: to.x, y2: to.y });
      x = to.x; y = to.y;
      continue;
    }
    if (key === 'H') { const nx = relative ? x + args[0] : args[0]; segments.push({ x1: x, y1: y, x2: nx, y2: y }); x = nx; continue; }
    if (key === 'V') { const ny = relative ? y + args[0] : args[0]; segments.push({ x1: x, y1: y, x2: x, y2: ny }); y = ny; continue; }
    const to = point(args[ARITY[key] - 2], args[ARITY[key] - 1]);
    if (key === 'Q') {
      const control = point(args[0], args[1]);
      segments.push({ x1: x, y1: y, x2: control.x, y2: control.y });
      segments.push({ x1: control.x, y1: control.y, x2: to.x, y2: to.y });
    } else {
      segments.push({ x1: x, y1: y, x2: to.x, y2: to.y });
    }
    x = to.x; y = to.y;
  }
  return segments;
}

// Liang-Barsky: does the segment cross the rect at all, not whether their boxes touch.
function crosses(segment, rect) {
  const dx = segment.x2 - segment.x1, dy = segment.y2 - segment.y1;
  const outer = [segment.x1 - rect.x, rect.x + rect.width - segment.x1, segment.y1 - rect.y, rect.y + rect.height - segment.y1];
  const along = [-dx, dx, -dy, dy];
  let enter = 0, leave = 1;
  for (let i = 0; i < 4; i += 1) {
    if (along[i] === 0) { if (outer[i] < 0) return false; continue; }
    const t = outer[i] / along[i];
    if (along[i] < 0) { if (t > leave) return false; if (t > enter) enter = t; }
    else { if (t < enter) return false; if (t < leave) leave = t; }
  }
  return true;
}

function gapTo(segment, rect) {
  const x0 = rect.x, x1 = rect.x + rect.width, y0 = rect.y, y1 = rect.y + rect.height;
  let best = Infinity;
  const steps = 64;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const px = segment.x1 + (segment.x2 - segment.x1) * t;
    const py = segment.y1 + (segment.y2 - segment.y1) * t;
    const dx = px < x0 ? x0 - px : px > x1 ? px - x1 : 0;
    const dy = py < y0 ? y0 - py : py > y1 ? py - y1 : 0;
    best = Math.min(best, Math.hypot(dx, dy));
  }
  return best;
}

module.exports = {
  name: NAME,
  scope: 'file',
  run(ctx) {
    const { file, path, regions, flattenTags, tally, record, label } = ctx;
    const radialFile = path.basename(file) === 'radar.html', open = [];
    const masks = [], short = [];
    let pending = null;
    const tagRe = /<(\/?)([a-zA-Z][\w-]*)\b([^>]*?)(\/?)>/g;
    let match;
    while ((match = tagRe.exec(flattenTags(regions.markup))) !== null) {
      const closing = match[1] === '/', tag = match[2], attrs = match[3];
      if (closing) { open.pop(); continue; }
      if (tag === 'rect') {
        const classes = (attr(attrs, 'class') || '').split(/\s+/).filter(Boolean);
        const rect = { x: Number(attr(attrs, 'x')), y: Number(attr(attrs, 'y')), width: Number(attr(attrs, 'width')), height: Number(attr(attrs, 'height')) };
        const named = classes.some((name) => /label/.test(name) && /mask/.test(name));
        // Two files name the class; the rest draw the same thing as a ground-filled rect with its
        // label immediately after it, and a rule that only sees the named form is blind to almost
        // the whole corpus. A ground fill alone is not enough — page and zone grounds share it — so
        // the label that follows is what makes it a mask, and the size cap keeps a band out.
        const shaped = GROUND_FILL.test(attr(attrs, 'fill') || '') && rect.height <= 24 && rect.width <= 240;
        if (Object.values(rect).every(Number.isFinite)) {
          if (named) masks.push(rect);
          else if (shaped) pending = rect;
        }
        if (!named && !shaped) pending = null;
      } else if (tag === 'text') {
        if (pending) { masks.push(pending); pending = null; }
      } else if (tag !== 'tspan') {
        pending = null;
      }
      const isConnector = /\bmarker-\w+\s*=/.test(attrs) || CONNECTOR.test(attr(attrs, 'class') || '');
      if ((tag === 'line' || tag === 'path') && isConnector && !radialFile && !decorated(open, attrs)) {
        const segments = tag === 'line'
          ? [{ x1: Number(attr(attrs, 'x1')), y1: Number(attr(attrs, 'y1')), x2: Number(attr(attrs, 'x2')), y2: Number(attr(attrs, 'y2')) }]
          : segmentsOf(attr(attrs, 'd') || '');
        const where = tag === 'line'
          ? `line ${attr(attrs, 'x1')},${attr(attrs, 'y1')} to ${attr(attrs, 'x2')},${attr(attrs, 'y2')}`
          : `path "${String(attr(attrs, 'd') || '').slice(0, 40)}"`;
        if (segments && segments.length && segments.every((s) => [s.x1, s.y1, s.x2, s.y2].every(Number.isFinite))) short.push({ where, segments });
      }
      if (match[4] !== '/' && !LEAF.has(tag)) open.push(attrs);
    }

    for (const connector of short) {
      const drawn = connector.segments.reduce((sum, s) => sum + Math.hypot(s.x2 - s.x1, s.y2 - s.y1), 0);
      for (const mask of masks) {
        tally(NAME, 1);
        const over = connector.segments.some((segment) => crosses(segment, mask));
        const gap = over ? 0 : Math.min(...connector.segments.map((segment) => gapTo(segment, mask)));
        if (gap >= CLEARANCE) continue;
        record(NAME, 'error', label, over
          ? `${connector.where} draws ${Number(drawn.toFixed(1))}px and the label mask [${mask.x},${mask.y},${mask.width}x${mask.height}] is painted across it; a mask over the stroke erases the line the label names`
          : `${connector.where} clears the label mask [${mask.x},${mask.y},${mask.width}x${mask.height}] by ${Number(gap.toFixed(1))}px and the minimum is ${CLEARANCE}px; the gap is what lets a reader trace the line past its own label`);
      }
    }
  },
};
