'use strict';

// The layout grid is a contract between files: a value two pixels off cannot be aligned to its
// neighbours, and a drawing built on two grids cannot be split, rescaled or reflowed mechanically
// later without measuring every element again. The exemptions are the signed rule rather than a
// convenience: text is placed by the type scale, the dot tile is a texture, a rect's corner radius
// is a shape value, and a stroke weight is a paint choice.

const NAME = 'grid-4px';
const path = require('path');
const fs = require('fs');

// The corpus was drawn before the grid was held, and 34 of its 38 files sit off it. Repainting
// hand-drawn geometry to satisfy a rule is a redesign, not a check, so the rule binds new work
// outright and ratchets the rest: a legacy file may not carry more off-grid values than the
// baseline records for it, and the baseline is only ever regenerated downward.
const BASELINE = path.join(__dirname, 'grid-baseline.json');
function baseline() {
  return fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : {};
}

// Tags whose whole subtree sits off the layout grid by design.
const EXEMPT_SUBTREE = new Set(['text', 'tspan', 'pattern']);
const GEOMETRY = {
  rect: ['x', 'y', 'width', 'height'],
  circle: ['cx', 'cy'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  line: ['x1', 'y1', 'x2', 'y2'],
};
const LEAF = new Set(['rect', 'circle', 'ellipse', 'line', 'path', 'use', 'image', 'polygon', 'polyline', 'text', 'tspan']);

function offGrid(value) {
  // A percentage is an extent, not a position: a backdrop that fills its viewport sits on every grid.
  if (/^-?\d+(\.\d+)?%$/.test(value)) return false;
  return !/^-?\d+$/.test(value) || Number(value) % 4 !== 0;
}

function countOffGrid(ctx) {
  const { regions, flattenTags } = ctx;
  const open = [];
  const offenders = [];
  const tagRe = /<(\/?)([a-zA-Z][\w-]*)\b([^>]*?)(\/?)>/g;
  let match;
  while ((match = tagRe.exec(flattenTags(regions.markup))) !== null) {
    const closing = match[1] === '/';
    const tag = match[2];
    const attrs = match[3];
    // Pop only what was pushed. A leaf never entered the stack, so treating its closing tag as
    // an exit discards the group above it and silently strips that group's exemption.
    if (closing) { if (!LEAF.has(tag)) open.pop(); continue; }
    const exempt = EXEMPT_SUBTREE.has(tag) || open.some((ancestor) => EXEMPT_SUBTREE.has(ancestor));
    if (!exempt) {
      const found = [];
      for (const attr of GEOMETRY[tag] || []) {
        const hit = new RegExp(`\\b${attr}\\s*=\\s*"([^"]*)"`).exec(attrs);
        if (!hit) continue;
        const value = hit[1].trim();
        if (offGrid(value)) found.push(`${attr}=${value}`);
      }
      const shifted = tag === 'g' && /\btransform\s*=\s*"translate\(\s*([^)]*)\)"/.exec(attrs);
      for (const part of shifted ? shifted[1].split(',') : []) {
        if (offGrid(part.trim())) found.push(`translate(${shifted[1].trim()})`);
      }
      if (found.length) offenders.push(`${tag} carries ${found.join(', ')}`);
    }
    if (match[4] !== '/' && !LEAF.has(tag)) open.push(tag);
  }
  return offenders;
}

module.exports = {
  name: NAME,
  scope: 'file',
  countOffGrid,
  run(ctx) {
    const { tally, record, label, originLabel } = ctx;
    const offenders = countOffGrid(ctx);
    // A delivery inherits its source's recorded allowance; it did not write those values.
    const allowed = baseline()[label] ?? baseline()[originLabel];
    tally(NAME, 1);
    if (allowed === undefined) {
      // A file the baseline does not know is new work, and new work lands on the grid.
      for (const offender of offenders) {
        record(NAME, 'error', label, `${offender} off the 4px grid; layout values must land on it or every later pass has to measure the drawing instead of moving it`);
      }
    } else if (offenders.length > allowed) {
      record(NAME, 'error', label, `${offenders.length} off-grid values against a recorded baseline of ${allowed}; a legacy file may improve and may not regress, and the baseline is regenerated only downward`);
    }
  },
};
