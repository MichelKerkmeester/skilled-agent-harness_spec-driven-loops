#!/usr/bin/env node
/**
 * Corpus check for the chart packet.
 *
 * Every rule the template contract states is enforced here. A rule nothing checks is a
 * wish, so a rule that cannot be checked is marked advisory in the contract instead of
 * being written as if it bound.
 *
 * Usage:
 *   node check-corpus.cjs            structural checks only
 *   node check-corpus.cjs --render   also open every template in a headless browser
 *
 * Exit 0 only when the run prints RESULT: PASSED. Read the marker, not the exit code:
 * a run that dies before its first check also exits without printing failures.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const vm = require('vm');
const { execFileSync } = require('child_process');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const PALETTE_SOURCE = path.join(PACKAGE_ROOT, 'assets', 'color', 'palettes.json');
const CATALOG = path.join(PACKAGE_ROOT, 'references', 'catalog.md');
const TEMPLATE_DIR = path.join(PACKAGE_ROOT, 'assets', 'templates');
const EXAMPLE_DIR = path.join(PACKAGE_ROOT, 'assets', 'examples');
const ASSET_ROOT = path.join(PACKAGE_ROOT, 'assets');

const PALETTE_BEGIN = /\/\*\s*CHART_PALETTE:BEGIN\s+system=([a-z0-9-]+)\s*\*\//;
const PALETTE_END = '/* CHART_PALETTE:END */';
const PALETTE_DARK_BEGIN = /\/\*\s*CHART_PALETTE_DARK:BEGIN\s+system=([a-z0-9-]+)\s*\*\//;
const PALETTE_DARK_END = '/* CHART_PALETTE_DARK:END */';
const DARK_QUERY = /@media[^{]*prefers-color-scheme\s*:\s*dark/i;
const DATA_BEGIN = '/* CHART_DATA:BEGIN */';
const DATA_END = '/* CHART_DATA:END */';
const CATALOG_BEGIN = '<!-- CHART_CATALOG:BEGIN -->';
const CATALOG_END = '<!-- CHART_CATALOG:END -->';

const CARD_PARTS = ['headline', 'subtitle', 'figure', 'source'];

// Values a colour-bearing property may hold. Anything else is a literal, and a literal
// outside the palette block is how a template stops following its own colour system.
const COLOUR_KEYWORDS = new Set(['none', 'currentcolor', 'transparent', 'inherit', 'initial', 'unset']);

// The named colours a person actually types. The full CSS list would add 120 words that
// have never once appeared in a chart by accident.
const NAMED_COLOURS = [
  'red', 'blue', 'green', 'black', 'white', 'grey', 'gray', 'orange', 'purple', 'yellow',
  'pink', 'brown', 'cyan', 'magenta', 'teal', 'navy', 'olive', 'maroon', 'lime', 'silver',
  'gold', 'coral', 'salmon', 'khaki', 'indigo', 'violet', 'crimson', 'tomato', 'steelblue',
  'skyblue', 'darkblue', 'lightblue', 'darkgreen', 'lightgreen', 'orangered', 'seagreen',
];

const findings = [];
const counts = new Map();

const seenFindings = new Set();

function record(check, level, file, message) {
  const key = `${check}\u0000${file}\u0000${message}`;
  if (seenFindings.has(key)) return;
  seenFindings.add(key);
  findings.push({ check, level, file, message });
}

function tally(check, n) {
  counts.set(check, (counts.get(check) || 0) + n);
}

function rel(p) {
  return path.relative(PACKAGE_ROOT, p) || path.basename(p);
}

/* ---------------------------------------------------------------- colour maths */

function channel(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

const round2 = (n) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------- palette source */

function loadPalette() {
  const raw = fs.readFileSync(PALETTE_SOURCE, 'utf8');
  return JSON.parse(raw);
}

function customProperties(palette, systemId) {
  const system = palette.systems[systemId];
  const props = new Map();
  for (const [role, value] of Object.entries(palette.chrome)) {
    props.set(`${palette.customPropertyPrefix}${role}`, value);
  }
  // The corner ladder rides in the same block as the colours because every file already
  // carries that block and compares it against the source in both directions. It lives in
  // its own object in the source rather than inside chrome, because chrome means colour:
  // a length that cannot differ between a light and a dark theme has no business in the
  // one structure whose whole purpose is to differ between them. That is also why the rungs
  // are emitted into the light block alone: a corner repeated under a second ground would be
  // a second copy of a value that cannot differ, which is a place for the two to disagree.
  for (const [role, value] of Object.entries(palette.radius || {})) {
    props.set(`${palette.customPropertyPrefix}radius-${role}`, value);
  }
  system.series.forEach((value, i) => {
    props.set(`${palette.customPropertyPrefix}series-${i + 1}`, value);
  });
  props.set(`${palette.customPropertyPrefix}emphasis`, system.emphasis);
  return props;
}

// The dark projection redeclares the colour roles and nothing else. A file paints these only
// when the reader's operating system asks for a dark scheme, which is the one signal a
// self-contained document can read: it has nowhere to keep a preference and no place for a
// control, and a browser that never resolves the query is left painting the light block.
function customPropertiesDark(palette, systemId) {
  const system = palette.systems[systemId];
  const props = new Map();
  for (const [role, value] of Object.entries(palette.chromeDark || {})) {
    props.set(`${palette.customPropertyPrefix}${role}`, value);
  }
  (system.seriesDark || []).forEach((value, i) => {
    props.set(`${palette.customPropertyPrefix}series-${i + 1}`, value);
  });
  if (system.emphasisDark) props.set(`${palette.customPropertyPrefix}emphasis`, system.emphasisDark);
  return props;
}

function canonicalBlock(palette, systemId) {
  const lines = [];
  lines.push(`/* CHART_PALETTE:BEGIN system=${systemId} */`);
  lines.push(':root {');
  for (const [prop, value] of customProperties(palette, systemId)) {
    lines.push(`  ${prop}: ${value};`);
  }
  lines.push('}');
  lines.push(PALETTE_END);
  return lines.join('\n');
}

function canonicalDarkBlock(palette, systemId) {
  const lines = [];
  lines.push(`/* CHART_PALETTE_DARK:BEGIN system=${systemId} */`);
  lines.push('@media (prefers-color-scheme: dark) {');
  lines.push('  :root {');
  for (const [prop, value] of customPropertiesDark(palette, systemId)) {
    lines.push(`    ${prop}: ${value};`);
  }
  lines.push('  }');
  lines.push('}');
  lines.push(PALETTE_DARK_END);
  return lines.join('\n');
}

// One region description per theme. Everything that differs between the light block and its
// dark twin lives here, so the two are checked by one routine rather than by two that drift.
const PALETTE_REGIONS = [
  {
    theme: 'light',
    begin: PALETTE_BEGIN,
    beginName: 'CHART_PALETTE:BEGIN',
    endMarker: PALETTE_END,
    projection: customProperties,
    canonical: canonicalBlock,
    required: true,
    mediaQuery: null,
  },
  {
    theme: 'dark',
    begin: PALETTE_DARK_BEGIN,
    beginName: 'CHART_PALETTE_DARK:BEGIN',
    endMarker: PALETTE_DARK_END,
    projection: customPropertiesDark,
    canonical: canonicalDarkBlock,
    required: true,
    mediaQuery: DARK_QUERY,
  },
];

// The corner ladder is gated once rather than per theme. A rung is a length, and a length
// cannot answer a ground.
function checkRadiusRungs(palette) {
  let checked = 0;
  for (const [role, value] of Object.entries(palette.radius || {})) {
    checked += 1;
    if (/^\d+(?:\.\d+)?px$/.test(value)) continue;
    record('palette-source', 'error', rel(PALETTE_SOURCE),
      `radius rung "${role}" is ${value}, and a rung has to be a pixel length the stylesheet can use directly`);
  }
  tally('palette-source', checked);
}

// One theme description per ground. Every gate is computed from the palette file against the
// surface named here, so a value that clears on paper still has to clear on ink and neither
// run can be read as covering the other.
const THEMES = [
  {
    check: 'palette-source',
    chrome: 'chrome',
    series: 'series',
    emphasis: 'emphasis',
    ground: 'the light ground',
    alphaRule: false,
  },
  {
    check: 'palette-source-dark',
    chrome: 'chromeDark',
    series: 'seriesDark',
    emphasis: 'emphasisDark',
    ground: 'the dark ground',
    alphaRule: true,
  },
];

function checkPaletteSource(palette, theme) {
  const chrome = palette[theme.chrome];
  const g = palette.gates;
  let checked = 0;

  if (!chrome) {
    record(theme.check, 'error', rel(PALETTE_SOURCE),
      `no "${theme.chrome}" object, so ${theme.ground} has no chrome to gate`);
    tally(theme.check, 1);
    return;
  }

  for (const role of ['surface', 'ink', 'muted', 'rule']) {
    checked += 1;
    if (chrome[role]) continue;
    record(theme.check, 'error', rel(PALETTE_SOURCE), `${theme.chrome} role "${role}" is missing`);
  }
  const surface = chrome.surface;
  if (!surface) {
    tally(theme.check, checked);
    return;
  }

  for (const role of ['ink', 'muted']) {
    if (!chrome[role]) continue;
    const ratio = contrast(chrome[role], surface);
    checked += 1;
    if (ratio < g.textOnSurface) {
      record(theme.check, 'error', rel(PALETTE_SOURCE),
        `${theme.chrome}.${role} reads ${round2(ratio)}:1 on ${theme.ground}, below the ${g.textOnSurface}:1 text gate`);
    }
  }

  // A card edge on a near-black ground is ink at an alpha rather than a solid colour. A grey
  // dark enough to sit quietly is a second line drawn over the data; an alpha lets the ground
  // show through, which is what keeps the edge readable without competing with the marks.
  if (theme.alphaRule && chrome.rule) {
    checked += 1;
    const parts = /^#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})$/.exec(chrome.rule);
    if (!parts) {
      record(theme.check, 'error', rel(PALETTE_SOURCE),
        `${theme.chrome}.rule is ${chrome.rule}, and on this ground the rule is ink at an alpha rather than a solid value`);
    } else if (chrome.ink && `#${parts[1]}`.toUpperCase() !== chrome.ink.toUpperCase()) {
      record(theme.check, 'error', rel(PALETTE_SOURCE),
        `${theme.chrome}.rule is ${chrome.rule}, whose colour is not ${theme.chrome}.ink (${chrome.ink}). The edge is this theme's ink held back by an alpha, not a third colour`);
    } else if (parseInt(parts[2], 16) === 255) {
      record(theme.check, 'error', rel(PALETTE_SOURCE),
        `${theme.chrome}.rule carries a full alpha, which makes it a solid value wearing an alpha channel`);
    }
  }

  for (const [id, system] of Object.entries(palette.systems)) {
    const series = system[theme.series];
    const emphasis = system[theme.emphasis];
    checked += 1;
    if (!Array.isArray(series) || !series.length) {
      record(theme.check, 'error', rel(PALETTE_SOURCE),
        `system "${id}" defines no ${theme.series} values, so it has nothing to paint on ${theme.ground}`);
      continue;
    }
    if (series.length !== system.capacity) {
      record(theme.check, 'error', rel(PALETTE_SOURCE),
        `system "${id}" declares capacity ${system.capacity} and defines ${series.length} ${theme.series} values`);
    }
    if (!emphasis) {
      record(theme.check, 'error', rel(PALETTE_SOURCE),
        `system "${id}" defines no ${theme.emphasis}, and emphasis is required in every system on every ground`);
    } else {
      const emphasisRatio = contrast(emphasis, surface);
      checked += 1;
      if (emphasisRatio < g.markOnSurface) {
        record(theme.check, 'error', rel(PALETTE_SOURCE),
          `system "${id}" emphasis reads ${round2(emphasisRatio)}:1 on ${theme.ground}, below the ${g.markOnSurface}:1 mark gate`);
      }
      const againstFirst = contrast(emphasis, series[0]);
      checked += 1;
      if (againstFirst < g.emphasisAgainstFirstSeries) {
        record(theme.check, 'error', rel(PALETTE_SOURCE),
          `system "${id}" emphasis reads ${round2(againstFirst)}:1 against series[0] on ${theme.ground}, below the ${g.emphasisAgainstFirstSeries}:1 separation floor. An emphasised mark that matches the base mark in lightness disappears in greyscale`);
      }
    }

    if (system.encodes === 'magnitude') {
      // A ramp is read as a group against its legend, so only the end furthest from the ground
      // has to clear the mark gate. Requiring it of every step would delete the end that encodes
      // "low", which is the half nearest the ground on either theme.
      //
      // Which end that is depends on the theme, and the array says so rather than the arithmetic:
      // index 0 is always the value furthest from that theme's ground. Asserting that ordering
      // first is what stops a reversed ramp from passing. Reversal preserves every step
      // separation, so a check that gated whichever end happened to be lighter would accept a
      // scale that had quietly started reading backwards.
      for (let i = 0; i < series.length - 1; i += 1) {
        const step = contrast(series[i], series[i + 1]);
        checked += 1;
        if (step < g.rampStepSeparation) {
          record(theme.check, 'error', rel(PALETTE_SOURCE),
            `system "${id}" steps ${i + 1} and ${i + 2} differ by ${round2(step)}:1 on ${theme.ground}, below the ${g.rampStepSeparation}:1 rank-readability floor`);
        }
        checked += 1;
        if (contrast(series[i], surface) > contrast(series[i + 1], surface)) continue;
        record(theme.check, 'error', rel(PALETTE_SOURCE),
          `system "${id}" does not move toward ${theme.ground} at steps ${i + 1} and ${i + 2}. The array runs from the value furthest from the surface to the value nearest it, and an ordered scale that reverses encodes nothing`);
      }
      const far = contrast(series[0], surface);
      checked += 1;
      if (far < g.rampDarkestOnSurface) {
        record(theme.check, 'error', rel(PALETTE_SOURCE),
          `system "${id}" step 1, the end furthest from ${theme.ground}, reads ${round2(far)}:1 on it, below ${g.rampDarkestOnSurface}:1`);
      }
      const near = contrast(series[series.length - 1], surface);
      checked += 1;
      if (near < g.rampLightestOnSurface) {
        record(theme.check, 'error', rel(PALETTE_SOURCE),
          `system "${id}" step ${series.length}, the end nearest ${theme.ground}, reads ${round2(near)}:1 on it, below ${g.rampLightestOnSurface}:1. A low cell has to be distinguishable from an empty one`);
      }
    } else {
      // Marks a reader identifies one at a time each have to clear the gate alone.
      series.forEach((value, i) => {
        const ratio = contrast(value, surface);
        checked += 1;
        if (ratio < g.markOnSurface) {
          record(theme.check, 'error', rel(PALETTE_SOURCE),
            `system "${id}" ${theme.series}[${i}] reads ${round2(ratio)}:1 on ${theme.ground}, below the ${g.markOnSurface}:1 mark gate`);
        }
      });
    }
  }
  tally(theme.check, checked);
}

/* ------------------------------------------------------------- html templates */

function stripHtmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, '');
}

function regionsOf(src) {
  const styles = [];
  const scripts = [];
  const attrs = [];
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = styleRe.exec(src)) !== null) styles.push(m[1]);
  while ((m = scriptRe.exec(src)) !== null) scripts.push(m[1]);
  const markup = src.replace(styleRe, '').replace(scriptRe, '');
  const attrRe = /[a-zA-Z-]+\s*=\s*"([^"]*)"/g;
  while ((m = attrRe.exec(markup)) !== null) attrs.push(m[1]);
  return { styles, scripts, attrs, markup };
}

function stripJsComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
}

function checkDocumentShape(file, src) {
  const checks = [
    [/<!doctype html>/i, 'a <!doctype html> declaration'],
    [/<html\b[^>]*\blang\s*=/i, 'a lang attribute on <html>'],
    [/<meta\b[^>]*charset\s*=/i, 'a charset meta tag'],
    [/<meta\b[^>]*name\s*=\s*"viewport"/i, 'a viewport meta tag'],
    [/<title>[^<]+<\/title>/i, 'a non-empty <title>'],
  ];
  for (const [re, what] of checks) {
    if (re.test(src)) continue;
    record('document-shape', 'error', file, `missing ${what}. A fragment is not a deliverable`);
  }
  tally('document-shape', checks.length);
}

function metaContent(src, name) {
  const re = new RegExp(`<meta\\b[^>]*name\\s*=\\s*"${name}"[^>]*content\\s*=\\s*"([^"]*)"`, 'i');
  const m = re.exec(src);
  return m ? m[1] : null;
}

function checkIdentity(file, src, palette) {
  const id = metaContent(src, 'chart-template');
  const systemId = metaContent(src, 'chart-color-system');
  const stem = path.basename(file, '.html');
  tally('identity', 2);
  if (!id) {
    record('identity', 'error', file, 'no <meta name="chart-template"> identity. Nothing can index a file that will not say what it is');
  } else if (!/^[a-z0-9-]+$/.test(id)) {
    record('identity', 'error', file, `identity "${id}" is not lower-case kebab`);
  } else if (id !== stem) {
    record('identity', 'error', file, `identity "${id}" does not match the filename stem "${stem}"`);
  }
  if (!systemId) {
    record('identity', 'error', file, 'no <meta name="chart-color-system"> declaration');
  } else if (!palette.systems[systemId]) {
    record('identity', 'error', file, `declares colour system "${systemId}", which the palette source does not define`);
  }
  return { id, systemId };
}

function regionOf(src, spec) {
  const begin = spec.begin.exec(src);
  if (!begin) return null;
  const start = begin.index;
  const end = src.indexOf(spec.endMarker, start);
  if (end === -1) return null;
  return {
    theme: spec.theme,
    systemId: begin[1],
    start,
    end: end + spec.endMarker.length,
    text: src.slice(start, end + spec.endMarker.length),
  };
}

const occurrences = (src, needle) => src.split(needle).length - 1;

// Rule 4: one palette block per theme, two at most, each matched against its own projection of
// the source in both directions.
//
// The ceiling is the part worth stating. One block per file used to be the rule, and it was the
// right one while there was one ground: one block is one place a colour can drift and a diff
// shows it. A file that answers a dark system needs a second set of values and a self-contained
// document has nowhere else to put them, so the ceiling moved to two and stayed a ceiling. The
// region count is asserted rather than assumed, because a widened check that stopped counting is
// how a third block, or a repeated sentinel pair, would start passing unseen.
function checkPaletteBlock(file, src, palette, declaredSystem) {
  const blocks = [];
  for (const spec of PALETTE_REGIONS) {
    tally('palette-block', 2);
    const begins = occurrences(src, spec.beginName);
    const ends = occurrences(src, spec.endMarker);
    if (begins > 1 || ends > 1) {
      record('palette-block', 'error', file,
        `the ${spec.theme} palette sentinel appears ${begins} time(s) with ${ends} closing marker(s). A file carries one block per theme, so nothing can say which region a drifted value came from once a pair is used twice`);
    }

    const block = regionOf(src, spec);
    if (!block) {
      if (!spec.required) continue;
      record('palette-block', 'error', file,
        `no ${spec.beginName} sentinel pair. Expected block:\n${spec.canonical(palette, declaredSystem || 'neutral')}`);
      continue;
    }
    blocks.push(block);

    if (declaredSystem && block.systemId !== declaredSystem) {
      record('palette-block', 'error', file,
        `the ${spec.theme} palette block declares system "${block.systemId}" and the meta tag declares "${declaredSystem}"`);
      continue;
    }
    if (!palette.systems[block.systemId]) continue;

    // A dark block outside its media query paints on every reader, which is the one way a
    // second block can be right in every value and still wrong in every file.
    if (spec.mediaQuery && !spec.mediaQuery.test(block.text)) {
      record('palette-block', 'error', file,
        `the ${spec.theme} palette block carries no prefers-color-scheme query, so its values would paint on every reader rather than on the one who asked for them.\nExpected block:\n${spec.canonical(palette, block.systemId)}`);
      continue;
    }

    const expected = spec.projection(palette, block.systemId);
    const actual = new Map();
    const propRe = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
    let m;
    while ((m = propRe.exec(block.text)) !== null) actual.set(m[1], m[2].trim());

    const problems = [];
    for (const [prop, value] of expected) {
      if (!actual.has(prop)) problems.push(`missing ${prop}`);
      else if (actual.get(prop).toUpperCase() !== value.toUpperCase()) {
        problems.push(`${prop} is ${actual.get(prop)} and the palette source says ${value}`);
      }
    }
    for (const prop of actual.keys()) {
      if (!expected.has(prop)) problems.push(`unexpected ${prop}`);
    }
    if (problems.length) {
      record('palette-block', 'error', file,
        `the ${spec.theme} palette block drifted from the source: ${problems.join('; ')}.\nExpected block:\n${spec.canonical(palette, block.systemId)}`);
    }
  }
  return blocks;
}

// A colour and a corner are both read from a palette region, so both strippers have to remove
// every region before they judge what is left. Slicing runs from the last region backwards, so
// an earlier region's offsets still describe the string when its turn comes.
function withoutBlocks(src, blocks) {
  let out = src;
  for (const block of [...blocks].sort((a, b) => b.start - a.start)) {
    out = out.slice(0, block.start) + out.slice(block.end);
  }
  return out;
}

function checkColourLiterals(file, src, blocks) {
  const cleaned = stripHtmlComments(withoutBlocks(src, blocks))
    .replace(/x?link:href\s*=\s*"#[^"]*"/gi, ' ')
    .replace(/href\s*=\s*"#[^"]*"/gi, ' ')
    .replace(/url\(\s*#[^)]*\)/gi, ' ');
  // A colour rule reads values, never prose. Every other rule that walks a script or a
  // stylesheet strips its comments first and this one did not, so a comment explaining why a
  // mark is deliberately not painted grey read to it as a mark painted grey. The strippers run
  // here for the same reason they run there: a sentence is not a declaration.
  const { styles: rawStyles, scripts: rawScripts, attrs } = regionsOf(cleaned);
  const styles = rawStyles.map(stripJsComments);
  const scripts = rawScripts.map(stripJsComments);
  const haystacks = [...styles, ...scripts, ...attrs];
  tally('colour-literals', haystacks.length);

  const hexRe = /#([0-9a-fA-F]{3,8})\b/g;
  for (const text of haystacks) {
    let m;
    while ((m = hexRe.exec(text)) !== null) {
      if (![3, 4, 6, 8].includes(m[1].length)) continue;
      record('colour-literals', 'error', file,
        `colour literal "${m[0]}" outside the palette block. Every colour comes from a var(${'--chart-'}…) reference so one palette edit reaches the whole file`);
    }
    if (/\b(rgba?|hsla?)\s*\(/i.test(text)) {
      record('colour-literals', 'error', file, 'rgb() or hsl() colour outside the palette block');
    }
    // A quote is a boundary the way a space is. Without it the rule read a declaration and
    // missed an assignment: `setAttribute('fill', 'red')` puts a named colour on a mark from
    // the drawing code, and the word sat between two quotes where neither side matched, so the
    // one route that bypasses the stylesheet entirely was the one route nothing looked at.
    for (const name of NAMED_COLOURS) {
      const re = new RegExp(`(?:^|[:\\s,'"(])${name}(?:$|[;\\s,)'"])`, 'i');
      if (!re.test(text)) continue;
      record('colour-literals', 'error', file, `named colour "${name}" outside the palette block`);
    }
  }

  const propRe = /(?:^|[;{\s])(color|background|background-color|border|border-color|outline|outline-color|fill|stroke|stop-color)\s*:\s*([^;}]+)/gi;
  for (const text of styles) {
    let m;
    while ((m = propRe.exec(text)) !== null) {
      const value = m[2].trim().toLowerCase();
      if (value.includes('var(--chart-')) continue;
      if (COLOUR_KEYWORDS.has(value)) continue;
      const bare = value.split(/\s+/).filter((t) => !/^\d|^\.|px$|^solid$|^dashed$|^dotted$|^none$/.test(t));
      if (!bare.length) continue;
      if (bare.every((t) => COLOUR_KEYWORDS.has(t))) continue;
      record('colour-literals', 'error', file,
        `"${m[1]}: ${m[2].trim()}" does not resolve through a var(--chart-…) reference`);
    }
  }
}

// A corner comes from the ladder, never from a number typed into a file.
//
// This is the same idea as the palette rule one function up. A value meant to be identical
// everywhere lives in one place and is read rather than re-typed, and twenty forms agreeing
// on ten pixels by coincidence is not a convention: it is twenty chances to disagree, and
// the twenty-first file is where it breaks. A corner declared in a stylesheet therefore has
// to resolve through a rung, and a corner set from the drawing code has to be computed from
// the mark's own geometry rather than typed. A range bar rounded to half its own width is
// geometry and passes; a 2 typed beside it is a rung in disguise and fails.
const RADIUS_DECLARATION = /(?:^|[;{\s])(border-radius|border-[a-z-]+-radius|rx|ry)\s*:\s*([^;}]+)/gi;
const RADIUS_IN_ATTRS = /(?:^|[{,\s])(rx|ry)\s*:\s*(-?\d+(?:\.\d+)?)\s*(?=[,}\n])/g;
const RADIUS_IN_SETATTR = /setAttribute\(\s*['"](rx|ry)['"]\s*,\s*['"]?(-?\d+(?:\.\d+)?)/g;

function checkRadiusTokens(file, src, blocks) {
  const { styles, scripts } = regionsOf(stripHtmlComments(withoutBlocks(src, blocks)));
  tally('radius', styles.length + scripts.length);

  for (const text of styles) {
    let m;
    RADIUS_DECLARATION.lastIndex = 0;
    while ((m = RADIUS_DECLARATION.exec(text)) !== null) {
      const value = m[2].trim();
      if (value.includes('var(--chart-radius-')) continue;
      record('radius', 'error', file,
        `"${m[1]}: ${value}" is a corner typed into the stylesheet. Every corner resolves through a var(--chart-radius-…) rung, so one edit reaches the whole corpus instead of one file`);
    }
  }

  for (const code of scripts) {
    const executable = stripJsComments(code);
    for (const re of [RADIUS_IN_ATTRS, RADIUS_IN_SETATTR]) {
      let m;
      re.lastIndex = 0;
      while ((m = re.exec(executable)) !== null) {
        record('radius', 'error', file,
          `the drawing code sets ${m[1]} to the literal ${m[2]}. A shared corner belongs on a rung and reaches the mark through its class; a corner that is genuinely per-mark is computed from that mark's geometry`);
      }
    }
  }
}

function checkNoExternalResources(file, src) {
  const patterns = [
    [/\b(?:src|href)\s*=\s*"(?:https?:)?\/\//i, 'a remote src or href'],
    [/@import\b/i, 'an @import'],
    [/\bfetch\s*\(/i, 'a fetch() call'],
    [/\bXMLHttpRequest\b/, 'an XMLHttpRequest'],
    [/\bimport\s*\(/, 'a dynamic import()'],
  ];
  tally('no-external', patterns.length);
  const cleaned = stripHtmlComments(src);
  for (const [re, what] of patterns) {
    if (!re.test(cleaned)) continue;
    record('no-external', 'error', file,
      `${what}. A delivered chart has to open on a laptop with no network, so the corpus draws its own marks and carries no remote dependency`);
  }
}

function checkScriptParses(file, src) {
  const { scripts } = regionsOf(src);
  tally('script-parses', scripts.length);
  scripts.forEach((code, i) => {
    try {
      new vm.Script(code, { filename: `${file}#script${i + 1}` });
    } catch (err) {
      record('script-parses', 'error', file, `inline script ${i + 1} does not compile: ${err.message}`);
    }
  });
}

function checkDataBlock(file, src) {
  const { scripts } = regionsOf(src);
  tally('data-block', 1);
  const joined = scripts.join('\n');
  const begins = joined.split(DATA_BEGIN).length - 1;
  const ends = joined.split(DATA_END).length - 1;
  if (begins !== 1 || ends !== 1) {
    record('data-block', 'error', file,
      `expected exactly one CHART_DATA sentinel pair inside a script and found ${begins} begin and ${ends} end. The person editing a delivered file looks for the numbers and nothing else`);
    return;
  }
  if (joined.indexOf(DATA_BEGIN) < joined.indexOf(DATA_END)) return;
  record('data-block', 'error', file, 'CHART_DATA:END appears before CHART_DATA:BEGIN');
}

function checkUniqueIds(file, src) {
  const ids = [];
  const re = /\sid\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) ids.push(m[1]);
  tally('unique-ids', ids.length);
  const seen = new Set();
  for (const id of ids) {
    if (!seen.has(id)) {
      seen.add(id);
      continue;
    }
    record('unique-ids', 'error', file,
      `element id "${id}" appears more than once. Two charts silently render into one container`);
  }
  return seen;
}

function checkAccessibility(file, src, ids) {
  const svgRe = /<svg\b([^>]*)>/gi;
  let m;
  let count = 0;
  while ((m = svgRe.exec(src)) !== null) {
    count += 1;
    const openTag = m[1];
    if (!/\brole\s*=\s*"img"/i.test(openTag)) {
      record('accessibility', 'error', file, 'an <svg> carries no role="img". A screen reader gets nothing from an unlabelled drawing');
    }
    const labelled = /\baria-labelledby\s*=\s*"([^"]+)"/i.exec(openTag);
    if (!labelled) {
      record('accessibility', 'error', file, 'an <svg> carries no aria-labelledby');
      continue;
    }
    for (const ref of labelled[1].trim().split(/\s+/)) {
      if (ids.has(ref)) continue;
      record('accessibility', 'error', file, `aria-labelledby points at "${ref}", which no element in this file defines`);
    }
  }
  tally('accessibility', count + 1);
  if (/\bdata-chart-table\b/.test(src)) return;
  record('accessibility', 'error', file,
    'no element carries data-chart-table. The numbers behind the drawing have to be readable without seeing it');
}

function checkCardParts(file, src) {
  const parts = [];
  const re = /data-chart-part\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) parts.push(m[1]);
  tally('card-parts', CARD_PARTS.length);
  if (parts.join(',') === CARD_PARTS.join(',')) return;
  record('card-parts', 'error', file,
    `card parts are [${parts.join(', ')}] and the contract is [${CARD_PARTS.join(', ')}] in that order. The fixed four are what make a chart legible with no caption`);
}

function checkDeterminism(file, src) {
  const { scripts } = regionsOf(src);
  tally('determinism', scripts.length);
  for (const code of scripts) {
    const executable = stripJsComments(code);
    if (/\bMath\s*\.\s*random\s*\(/.test(executable)) {
      record('determinism', 'error', file,
        'Math.random() in rendering code. Two renders of one file have to look the same or a screenshot review compares noise');
    }
    if (/\bDate\s*\.\s*now\s*\(/.test(executable) || /\bnew\s+Date\s*\(\s*\)/.test(executable)) {
      record('determinism', 'error', file, 'the current time reaches rendering code, so the picture changes on its own');
    }
  }
}

// Rule 14: a narrow screen pans the drawing instead of shrinking it.
//
// This is asserted from the stylesheet rather than from a rendered page, and the reason is
// worth stating. A headless browser can be given a phone-sized window, but the only thing
// it hands back is the DOM, and the DOM says nothing about whether the page overflowed:
// the numbers that would answer the question live in layout, which no --dump-dom run
// exposes. What can be checked is whether the file declares the affordance at all, which
// is the part an author forgets. So the check verifies that the figure region can scroll
// sideways and that its drawing has a floor it will not shrink below. It does not verify
// that the result is legible at that floor, and section 9 of the contract says so.
function figureClassOf(src) {
  const region = /<[^>]*data-chart-part\s*=\s*"figure"[^>]*>/i.exec(src);
  if (!region) return null;
  const cls = /\bclass\s*=\s*"([^"]+)"/i.exec(region[0]);
  return cls ? cls[1].trim().split(/\s+/)[0] : null;
}

function checkNarrowViewport(file, src) {
  tally('narrow-viewport', 3);
  const cls = figureClassOf(src);
  if (!cls) {
    record('narrow-viewport', 'error', file,
      'the figure region carries no class, so no rule can give the drawing somewhere to pan');
    return;
  }
  const css = regionsOf(src).styles.join('\n');
  const region = new RegExp('\\.' + cls + '\\s*\\{([^}]*)\\}').exec(css);
  const drawing = new RegExp('\\.' + cls + '\\s+svg\\s*\\{([^}]*)\\}').exec(css);

  if (!region || !/overflow-x\s*:\s*(auto|scroll)/.test(region[1])) {
    record('narrow-viewport', 'error', file,
      `the figure region declares no overflow-x, so a phone-width screen shrinks the drawing rather than panning it. At 340 units the axis labels sit on top of each other, and neither a static pass nor a desktop render ever sees it. Add "overflow-x: auto" to .${cls}`);
  }

  const min = drawing && /min-width\s*:\s*(\d+(?:\.\d+)?)px/.exec(drawing[1]);
  if (!min) {
    record('narrow-viewport', 'error', file,
      `the figure drawing declares no min-width, so width:100% lets it shrink to whatever the screen gives it. Add a min-width to .${cls} svg`);
    return;
  }
  const viewBox = /viewBox\s*=\s*"\s*[\d.+-]+\s+[\d.+-]+\s+([\d.]+)\s+[\d.]+\s*"/i.exec(src);
  if (!viewBox || Number(min[1]) <= Number(viewBox[1])) return;
  record('narrow-viewport', 'error', file,
    `min-width is ${min[1]}px and the drawing is ${viewBox[1]} units wide, so the floor is above the natural size and the chart is scaled up at every screen width`);
}

// Rule 13: a file that moves lets the reader turn the motion off, and it never repeats.
//
// This rule used to read the stylesheet regions and nothing else, which made it a hole rather
// than a gate. A motion driven from the drawing code matches none of the CSS patterns, so a
// file could animate with no fallback at all and the check would report a pass on it. Nothing
// in the corpus moved for as long as the hole was open, so the rule had never once fired on a
// real file, and a rule with no observed failure is a claim rather than a check.
//
// A file can move by three routes and each has its own way of asking the reader's system
// whether motion is wanted. A stylesheet animation is turned off by a media query in the same
// stylesheet. A motion driven from the drawing code has to ask through matchMedia, because no
// media query reaches it. An animation element in the markup cannot be reached by a media
// query either, so it needs the same guard in script.
//
// What this does not treat as motion: a bare setTimeout. It is a one-shot delay far more often
// than it is an animation loop, and a rule that demands a reduce-motion guard around a deferred
// measurement fires on correct code. The residual is covered from the other side. The render
// path opens each file twice after the settle time and compares both documents, so a motion
// still running when the budget expires shows up as two renders that disagree.
//
// The settle time rule 13 names is not asserted here either, and for the same reason. Reading a
// duration out of a stylesheet says what the author wrote, not when the picture stopped moving.
// Only the two-render comparison observes that.
const SCRIPT_MOTION = [
  [/\brequestAnimationFrame\s*\(/, 'requestAnimationFrame'],
  [/\.\s*animate\s*\(/, 'an animate() call'],
  [/\bsetInterval\s*\(/, 'setInterval'],
];
const MARKUP_MOTION = /<\s*(?:animate|animateTransform|animateMotion|set)\b/i;
const CSS_MOTION = /@keyframes\b|\banimation(?:-name)?\s*:|\btransition\s*:/;
const REDUCED_MOTION = /prefers-reduced-motion/;
const REPEATS_IN_CSS = /\banimation(?:-iteration-count)?\s*:[^;}]*\binfinite\b/i;
const REPEATS_IN_MARKUP = /\b(?:repeatCount|repeatDur)\s*=\s*"\s*indefinite/i;
const REPEATS_IN_SCRIPT = /\biterations\s*:\s*Infinity\b/;
// Only these three declarations belong in a reduce-motion fallback. Anything else in one is a
// motion made shorter, and a shorter animation is still an animation to somebody it makes ill.
const MOTION_DECLARATION = /(?:^|[;{\s])(animation|animation-[a-z-]+|transition|transition-[a-z-]+)\s*:\s*([^;}]+)/gi;
const REMOVES_MOTION = new Set(['animation', 'animation-name', 'transition', 'transition-property']);

// The body of every reduce-motion media query, brace-matched rather than pattern-matched: the
// block holds nested rules, and a regex that stops at the first closing brace reads half of one.
function reducedMotionBlocks(css) {
  const out = [];
  const opener = /@media[^{]*prefers-reduced-motion[^{]*\{/gi;
  let m;
  while ((m = opener.exec(css)) !== null) {
    let depth = 1;
    let i = opener.lastIndex;
    while (i < css.length && depth > 0) {
      if (css[i] === '{') depth += 1;
      else if (css[i] === '}') depth -= 1;
      i += 1;
    }
    out.push(css.slice(opener.lastIndex, i - 1));
  }
  return out;
}

function checkMotion(file, src) {
  const { styles, scripts, markup } = regionsOf(stripHtmlComments(src));
  // CSS and JavaScript share block-comment syntax, so one stripper serves both. It matters
  // here: a comment explaining an animation must not read to this rule as an animation.
  const css = stripJsComments(styles.join('\n'));
  const code = scripts.map(stripJsComments).join('\n');
  tally('motion', 4);

  if (CSS_MOTION.test(css) && !REDUCED_MOTION.test(css)) {
    record('motion', 'error', file,
      'the stylesheet animates and carries no prefers-reduced-motion fallback');
  }

  const routes = SCRIPT_MOTION.filter(([re]) => re.test(code)).map(([, what]) => what);
  if (routes.length && !REDUCED_MOTION.test(code)) {
    record('motion', 'error', file,
      `the drawing code animates through ${routes.join(', ')} and never reads the reader's reduce-motion preference. No media query reaches a motion driven from script, so this route has to ask through matchMedia('(prefers-reduced-motion: reduce)'). A stylesheet fallback does not cover it and the rule used not to look here at all`);
  }

  if (MARKUP_MOTION.test(markup) && !REDUCED_MOTION.test(code)) {
    record('motion', 'error', file,
      'the markup carries an animation element and the drawing code never reads the reduce-motion preference. A media query cannot switch off an animation element, so the guard belongs in script');
  }

  for (const body of reducedMotionBlocks(css)) {
    let m;
    MOTION_DECLARATION.lastIndex = 0;
    while ((m = MOTION_DECLARATION.exec(body)) !== null) {
      const prop = m[1].toLowerCase();
      const value = m[2].trim().toLowerCase();
      if (REMOVES_MOTION.has(prop) && value === 'none') continue;
      record('motion', 'error', file,
        `the reduce-motion fallback declares "${prop}: ${value}". A reader who asked their system for no motion gets a shorter animation rather than no animation, which is not what they asked for. A fallback removes the motion, so the declarations it carries are "animation: none" and "transition: none"`);
    }
  }

  if (REPEATS_IN_CSS.test(css) || REPEATS_IN_MARKUP.test(markup) || REPEATS_IN_SCRIPT.test(code)) {
    record('motion', 'error', file,
      'an animation repeats without end. A picture that never stops changing has no settled state, so two renders of the file disagree by construction and rule 12 cannot hold');
  }
}

/* -------------------------------------------- interaction, format, notice */

// A stylesheet walked as blocks rather than matched as a pattern. A rule nested inside an
// at-rule is still a rule, and a regex that stops at the first closing brace reads the
// wrapper and swallows the first rule inside it, which is exactly where a suppression would
// sit if somebody wanted one out of sight.
function styleRules(css) {
  const out = [];
  const stack = [];
  let selectorStart = 0;
  for (let i = 0; i < css.length; i += 1) {
    if (css[i] === '{') {
      stack.push({ selector: css.slice(selectorStart, i).trim(), bodyStart: i + 1 });
      selectorStart = i + 1;
    } else if (css[i] === '}') {
      const open = stack.pop();
      if (open) out.push({ selector: open.selector, body: css.slice(open.bodyStart, i) });
      selectorStart = i + 1;
    }
  }
  return out;
}

// The three attributes a form declares when it answers a pointer. They are read out of the
// markup alone: every one of them also appears in a stylesheet selector, so a file that
// merely styles the register would otherwise read as a file that carries it.
const INTERACTION_REGISTERS = ['data-chart-tooltip', 'data-chart-legend', 'data-chart-dim'];
const HYGIENE_RULE = /:focus\s*:not\(\s*:focus-visible\s*\)/;

// A form that gains a pointer carries one line of interaction hygiene, and it is the narrowed
// form: the focus ring is dropped for a reader who clicked and kept for a reader who tabbed.
// The second half of this check is the one worth having. An unconditional `outline: none` and
// a `user-select: none` both pass every other rule in this file, and both take something away
// from a reader — a keyboard indicator, and the ability to copy a number out of a document.
function checkInteractionHygiene(file, src) {
  const { styles, markup } = regionsOf(stripHtmlComments(src));
  const css = stripJsComments(styles.join('\n'));
  tally('interaction-hygiene', 2);

  const carried = INTERACTION_REGISTERS.filter(function (attr) {
    return new RegExp('\\b' + attr + '\\b').test(markup);
  });
  if (carried.length && !HYGIENE_RULE.test(css)) {
    record('interaction-hygiene', 'error', file,
      `the markup declares ${carried.join(', ')} and the stylesheet carries no ":focus:not(:focus-visible)" rule. A form that answers a pointer drops the focus ring for the reader who clicked and keeps it for the reader who tabbed, and a form that skips the line leaves a ring on every click`);
  }

  for (const rule of styleRules(css)) {
    if (rule.selector.startsWith('@')) continue;
    if (/:focus\b/.test(rule.selector) && !/:focus-visible/.test(rule.selector) && /outline\s*:\s*none/i.test(rule.body)) {
      record('interaction-hygiene', 'error', file,
        `"${rule.selector}" removes the outline from every focus, including a reader who arrived by keyboard. The suppression is scoped through :focus:not(:focus-visible), which is the selector that tells a click from a tab`);
    }
    if (/user-select\s*:\s*none/i.test(rule.body)) {
      record('interaction-hygiene', 'error', file,
        `"${rule.selector}" locks text selection. A delivered chart is a document and the numbers in it are meant to be copied out, so the selection half of the borrowed hygiene pair is refused here`);
    }
  }
}

// What a file paints before anyone touches it has to be what it painted before it gained a
// pointer, and the two registers that ship in the markup are where that can go wrong. Neither
// failure is visible to the render path: a file that opens already dimmed, or with a card
// already showing, paints the same picture on both of its pointer-free opens and passes the
// settled comparison exactly as a correct file does.
function checkInteractionState(file, src) {
  const { markup } = regionsOf(stripHtmlComments(src));
  tally('interaction-state', 2);

  const dim = /data-chart-dim\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = dim.exec(markup)) !== null) {
    if (m[1].trim() === '') continue;
    record('interaction-state', 'error', file,
      `the drawing ships data-chart-dim="${m[1]}", so it opens with one series already held against the rest. The attribute is empty until a reader asks`);
  }

  const tooltip = /<g\b[^>]*\bdata-chart-tooltip\b[^>]*>([\s\S]*?)<\/g>/gi;
  while ((m = tooltip.exec(markup)) !== null) {
    if (!m[1].trim()) continue;
    record('interaction-state', 'error', file,
      'the tooltip group ships with content in it, so a card is on screen before a reader has pointed at anything. The group is declared empty and the drawing code fills it');
  }
}

// Every number a reader sees comes from the file's own formatter. A locale-dependent one makes
// a delivered file read differently on the machine that opens it, which is the whole failure
// the fixed-comma formatter exists to prevent, and it is invisible on the machine that authored
// the file.
const LOCALE_FORMATTERS = [
  [/\btoLocaleString\s*\(/, 'toLocaleString()'],
  [/\btoLocaleDateString\s*\(/, 'toLocaleDateString()'],
  [/\btoLocaleTimeString\s*\(/, 'toLocaleTimeString()'],
  [/\bIntl\s*\.\s*NumberFormat\b/, 'Intl.NumberFormat'],
  [/\bIntl\s*\.\s*DateTimeFormat\b/, 'Intl.DateTimeFormat'],
];

function checkNumberFormat(file, src) {
  const { scripts, markup } = regionsOf(stripHtmlComments(src));
  const code = scripts.map(stripJsComments).join('\n');
  tally('number-format', LOCALE_FORMATTERS.length + 1);

  for (const [re, what] of LOCALE_FORMATTERS) {
    if (!re.test(code)) continue;
    record('number-format', 'error', file,
      `the drawing code calls ${what}. A delivered file has to read on the machine that opens it exactly as it read on the machine that made it, and a host locale decides the grouping mark, the decimal mark and the digits`);
  }

  // A hover card prints a figure that is nowhere else in the picture, so it is the one place a
  // raw value would reach a reader with no formatter between them.
  if (!/\bdata-chart-tooltip\b/.test(markup)) return;
  if (/function\s+fmt\s*\(/.test(code)) return;
  record('number-format', 'error', file,
    'the file carries a hover card and defines no fmt() of its own, so the figures it prints have nothing formatting them');
}

// Rule: an empty data block says so, in the picture. An empty frame and a chart whose values
// are all zero look identical, and a reader shown an empty box cannot tell which one they
// hold. The guard has to sit below the data it reads and it has to be able to stop the
// drawing, so both are asserted rather than the sentinel alone: a guard that prints a notice
// and then draws anyway prints the notice over an empty frame.
const EMPTY_BEGIN = '/* CHART_EMPTY_NOTICE:BEGIN */';
const EMPTY_END = '/* CHART_EMPTY_NOTICE:END */';

function checkEmptyNotice(file, src) {
  const { scripts } = regionsOf(src);
  const joined = scripts.join('\n');
  tally('empty-notice', 3);

  const begins = occurrences(joined, EMPTY_BEGIN);
  const ends = occurrences(joined, EMPTY_END);
  if (begins !== 1 || ends !== 1) {
    record('empty-notice', 'error', file,
      `expected exactly one CHART_EMPTY_NOTICE sentinel pair inside a script and found ${begins} begin and ${ends} end. Every form says so when the data block holds nothing readable`);
    return;
  }
  const start = joined.indexOf(EMPTY_BEGIN);
  if (start < joined.indexOf(DATA_END)) {
    record('empty-notice', 'error', file,
      'the empty-data guard sits above the data block it reads, so it tests a name that is not defined yet');
  }
  const guard = joined.slice(start);
  if (/\bfigure\s*:\s*\{/.test(guard) && /\bbreak\s+figure\s*;/.test(guard)) return;
  record('empty-notice', 'error', file,
    'the empty-data guard cannot stop the drawing. It carries no labelled block and no break out of it, so a form with nothing to draw would print the notice and then draw an empty frame under it');
}

// The five measurements every form shares, written into every file rather than imported,
// because a delivered file has no runtime to import from and neither place these numbers are
// used can read a custom property. Copies are only worth having when something compares them,
// so the block is asserted byte for byte across the exact set that carries it rather than
// across at least so many files: a corpus where the block was scattered would pass a count.
const GEOMETRY_BEGIN = '/* GEOMETRY DEFAULTS';

function geometryBlockOf(src) {
  const start = src.indexOf(GEOMETRY_BEGIN);
  if (start === -1) return null;
  const end = src.indexOf('*/', start);
  if (end === -1) return null;
  return src.slice(start, end + 2);
}

function checkGeometryBlock(files) {
  tally('geometry-block', files.length);
  let reference = null;
  let referenceFile = null;
  for (const file of files) {
    const block = geometryBlockOf(fs.readFileSync(file, 'utf8'));
    const name = rel(file);
    if (!block) {
      record('geometry-block', 'error', name,
        'no GEOMETRY DEFAULTS block. Every chart form and every proof sheet records the measurements it shares with the rest of the corpus, so a file that departs from one says so beside the value it uses instead');
      continue;
    }
    if (reference === null) {
      reference = block;
      referenceFile = name;
      continue;
    }
    if (block === reference) continue;
    record('geometry-block', 'error', name,
      `the GEOMETRY DEFAULTS block differs from the one in ${referenceFile}. The block is a record of what every file shares, so two versions of it mean the corpus no longer agrees about a number it claims to hold in common`);
  }
}

// The published type scale: six named roles and three named departures, each departure a single
// number that is the point of its chart rather than a label on it. The scale exists so the size
// of the next template's axis tick is a choice out of six rungs rather than a guess, which only
// holds while something rejects a seventh rung.
function checkTypeScale(file, src, palette) {
  const scale = palette.typeScale || {};
  const allowed = new Map();
  for (const [role, value] of Object.entries(scale.roles || {})) allowed.set(parseFloat(value), role);
  for (const [role, value] of Object.entries(scale.departures || {})) allowed.set(parseFloat(value), role);

  const { styles, scripts } = regionsOf(stripHtmlComments(src));
  const sizes = [];
  const css = stripJsComments(styles.join('\n'));
  let m;
  const declared = /font-size\s*:\s*([\d.]+)px/g;
  while ((m = declared.exec(css)) !== null) sizes.push(Number(m[1]));
  // An SVG text element can also take its size as an attribute, where the number is unitless
  // user units rather than pixels. It is the same scale and the same decision, so it is held
  // to the same rungs.
  const attribute = /setAttribute\(\s*['"]font-size['"]\s*,\s*['"]?([\d.]+)/g;
  const code = scripts.map(stripJsComments).join('\n');
  while ((m = attribute.exec(code)) !== null) sizes.push(Number(m[1]));
  // The same decision wearing a third syntax, and the one the corpus actually uses. Every
  // template builds its marks through one node(name, attrs, cls) helper that walks the attribute
  // object and calls setAttribute for each key, so a size handed to that helper never appears
  // beside the word setAttribute and the rule read straight past it. Reading only the direct call
  // meant the rule covered a route no chart form takes and missed the route all of them take.
  // The scale is a decision about a number rather than about the call that carries it.
  const viaHelper = /['"]font-size['"]\s*:\s*['"]?([\d.]+)/g;
  while ((m = viaHelper.exec(code)) !== null) sizes.push(Number(m[1]));

  tally('type-scale', sizes.length);
  if (!allowed.size) {
    record('type-scale', 'error', rel(PALETTE_SOURCE),
      'the palette source publishes no type scale, so nothing says which sizes a file may set');
    return;
  }
  for (const size of sizes) {
    if (allowed.has(size)) continue;
    record('type-scale', 'error', file,
      `sets ${size}px, which is not one of the published rungs (${[...allowed.keys()].sort(function (a, b) { return a - b; }).join(', ')}). A size off the scale is a size chosen out of the air, and the scale is what stops the next form guessing`);
  }
}

// A single mark may sweep along its own ramp, and only where the system already encodes
// magnitude. A sweep restates an ordering the data has; the same sweep on an unordered or a
// merely ranked series invents one.
//
// The rule is mechanical rather than judged, which is what makes it assertable at all. A
// gradient whose stops name two different series values is a sweep. A gradient whose stops name
// one series value at two opacities is a fade, which is what the area under a line already is,
// and the rule leaves it alone.
const GRADIENT = /<(linearGradient|radialGradient)\b[^>]*>([\s\S]*?)<\/\1>/gi;
const SERIES_TOKEN = /var\(\s*(--chart-series-\d+)\s*\)/;

function checkGradientSweep(file, src, declaredSystem) {
  const { styles, markup } = regionsOf(stripHtmlComments(src));
  const css = stripJsComments(styles.join('\n'));

  // A stop reaches its colour through a class the way every other mark does, so the class has
  // to be resolved before the stops can be read.
  const stopColour = new Map();
  for (const rule of styleRules(css)) {
    const colour = /stop-color\s*:\s*([^;]+)/i.exec(rule.body);
    if (!colour) continue;
    const token = SERIES_TOKEN.exec(colour[1]);
    if (!token) continue;
    for (const selector of rule.selector.split(',')) {
      const cls = /^\.([A-Za-z0-9_-]+)$/.exec(selector.trim());
      if (cls) stopColour.set(cls[1], token[1]);
    }
  }

  let gradients = 0;
  let m;
  GRADIENT.lastIndex = 0;
  while ((m = GRADIENT.exec(markup)) !== null) {
    gradients += 1;
    const values = new Set();
    const stops = /<stop\b[^>]*>/gi;
    let s;
    while ((s = stops.exec(m[2])) !== null) {
      const cls = /\bclass\s*=\s*"([^"]*)"/i.exec(s[0]);
      if (cls) {
        for (const name of cls[1].trim().split(/\s+/)) {
          if (stopColour.has(name)) values.add(stopColour.get(name));
        }
      }
      const inline = /\bstop-color\s*=\s*"([^"]*)"/i.exec(s[0]);
      if (inline) {
        const token = SERIES_TOKEN.exec(inline[1]);
        if (token) values.add(token[1]);
      }
    }
    if (values.size < 2) continue;
    if (declaredSystem === 'ordered') continue;
    record('gradient-sweep', 'error', file,
      `a gradient runs between ${[...values].join(' and ')} in a file declaring "${declaredSystem}". A sweep between two series values restates an ordering, and only a system that encodes magnitude has one to restate. A gradient naming one series value at two opacities is a fade and is left alone`);
  }
  tally('gradient-sweep', gradients + 1);
}


// An indexed data class carries the palette token of the same index, the set of indices runs
// from one without a gap, and it stops at the declared system's capacity.
//
// This is the one mapping nothing else in this file looked at, and it is the mapping that
// decides what the picture means. Every other colour rule asks where a value came from: the
// palette block is matched against the source in both directions, the literals rule refuses a
// colour typed outside it, and the source itself is gated for contrast and for the direction its
// ramp runs. A file whose classes hand those tokens out in the wrong order satisfies all of them.
//
// Reverse the five mappings in a matrix form and the encoding inverts: the step the drawing code
// picks for the highest reading now paints the palest colour. The legend inverts with it, because
// the legend is drawn from the same classes, so the picture agrees with itself and disagrees with
// the data, and a reviewer comparing the key against the grid sees nothing wrong. What survives
// the permutation is arithmetic rather than appearance: the number in the class name and the
// number in the token it resolves to are the same number, or the encoding has been renamed.
//
// The gap and the ceiling ride here because they are the same fact from the other side. A ladder
// missing a rung, or reaching past the colours the system defines, is a class the stylesheet
// cannot paint, and an unpainted fill is black rather than absent.
const INDEXED_CLASS = /^\.([a-z]+)-(\d+)$/;
const SERIES_TOKEN_VALUE = /var\(\s*--chart-series-(\d+)\s*\)/;
const COLOUR_PROPS = ['fill', 'stroke', 'stop-color', 'color', 'background', 'background-color'];
const DECLARED_CAPACITY = /\bconst\s+CAPACITY\s*=\s*(\d+)\s*;/;

function checkSeriesMapping(file, src, palette, declaredSystem) {
  const { styles, scripts } = regionsOf(stripHtmlComments(src));
  const css = stripJsComments(styles.join('\n'));
  const families = new Map();

  for (const rule of styleRules(css)) {
    if (rule.selector.startsWith('@')) continue;
    let token = null;
    for (const prop of COLOUR_PROPS) {
      const decl = new RegExp(`(?:^|[;{\\s])${prop}\\s*:\\s*([^;}]+)`, 'i').exec(rule.body);
      if (!decl) continue;
      const found = SERIES_TOKEN_VALUE.exec(decl[1]);
      if (found) { token = Number(found[1]); break; }
    }
    if (token === null) continue;
    for (const selector of rule.selector.split(',')) {
      const cls = INDEXED_CLASS.exec(selector.trim());
      if (!cls) continue;
      if (!families.has(cls[1])) families.set(cls[1], new Map());
      families.get(cls[1]).set(Number(cls[2]), token);
    }
  }

  const capacity = declaredSystem && palette.systems[declaredSystem]
    ? palette.systems[declaredSystem].capacity : null;
  const declared = DECLARED_CAPACITY.exec(stripJsComments(scripts.join('\n')));

  tally('series-mapping', families.size || 1);
  for (const [prefix, map] of families) {
    const indices = [...map.keys()].sort((a, b) => a - b);
    tally('series-mapping', indices.length + 2);

    for (const i of indices) {
      if (map.get(i) === i) continue;
      record('series-mapping', 'error', file,
        `".${prefix}-${i}" paints --chart-series-${map.get(i)}. An indexed class carries the token of its own index, because the drawing code chooses the index and the palette source decides what that index means. A class handing out somebody else's token reverses or shuffles the encoding while the legend, drawn from the same classes, shuffles with it, so the picture stays consistent with itself and stops being consistent with the data`);
    }

    const expected = indices.map((_, n) => n + 1);
    if (indices.join(',') !== expected.join(',')) {
      record('series-mapping', 'error', file,
        `the ".${prefix}-*" ladder is [${indices.join(', ')}] and a ladder runs from 1 without a gap. The drawing code counts from zero and adds one, so a missing rung is a class the stylesheet never defines, and an undefined fill paints black rather than nothing`);
    }

    if (capacity !== null && indices.length > capacity) {
      record('series-mapping', 'error', file,
        `".${prefix}-*" defines ${indices.length} steps and the "${declaredSystem}" system carries ${capacity}. The ceiling lives in the palette source, so a file cannot reach past it by defining a class for a colour nobody chose`);
    }

    if (declared && Number(declared[1]) !== indices.length) {
      record('series-mapping', 'error', file,
        `the drawing code declares CAPACITY ${declared[1]} and the stylesheet defines ${indices.length} ".${prefix}-*" steps. The constant is what stops a mark past the ceiling reaching a class with no fill, so a constant that outruns the classes reopens exactly the hole it was added to close`);
    }
  }
}

/* ------------------------------------------------------------------- catalog */

function parseCatalog() {
  tally('catalog', 1);
  if (!fs.existsSync(CATALOG)) {
    record('catalog', 'error', rel(CATALOG), 'the catalog is missing, so nothing indexes the corpus');
    return null;
  }
  const src = fs.readFileSync(CATALOG, 'utf8');
  const start = src.indexOf(CATALOG_BEGIN);
  const end = src.indexOf(CATALOG_END);
  if (start === -1 || end === -1 || end < start) {
    record('catalog', 'error', rel(CATALOG), 'no CHART_CATALOG sentinel pair around the index table');
    return null;
  }
  const body = src.slice(start + CATALOG_BEGIN.length, end);
  const lines = body.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('|'));
  if (lines.length < 2) return { rows: [], headers: [] };

  const cells = (line) => line.split('|').slice(1, -1).map((c) => c.trim().replace(/[`*]/g, '').toLowerCase());
  const headers = cells(lines[0]);
  const idCol = headers.indexOf('id');
  const fileCol = headers.indexOf('file');
  // The system cell is read as well as the id and the file. It is a mirror of what a template
  // declares rather than a second opinion, which is precisely why it can drift: nothing about a
  // cell copied by hand keeps it agreeing with the file it describes.
  const systemCol = headers.indexOf('system');
  if (idCol === -1 || fileCol === -1) {
    record('catalog', 'error', rel(CATALOG),
      `the index table needs an "id" column and a "file" column and has [${headers.join(', ')}]`);
    return null;
  }
  const rows = [];
  for (const line of lines.slice(1)) {
    if (/^\|[\s:|-]+\|$/.test(line)) continue;
    const c = cells(line);
    if (!c[idCol]) continue;
    rows.push({ id: c[idCol], file: c[fileCol], system: systemCol === -1 ? null : c[systemCol] });
  }
  return { rows, headers, systemCol };
}

function checkCatalogResolves(catalog, templateIdentities) {
  if (!catalog) return;
  tally('catalog', catalog.rows.length + templateIdentities.size);
  const seen = new Set();
  for (const row of catalog.rows) {
    if (seen.has(row.id)) {
      record('catalog', 'error', rel(CATALOG), `id "${row.id}" is listed twice`);
    }
    seen.add(row.id);
    if (!row.file) {
      record('catalog', 'error', rel(CATALOG), `row "${row.id}" names no file`);
      continue;
    }
    const target = path.join(PACKAGE_ROOT, row.file);
    if (!fs.existsSync(target)) {
      record('catalog', 'error', rel(CATALOG),
        `row "${row.id}" points at ${row.file}, which does not exist. An index that names a chart it cannot reach is worse than no index`);
      continue;
    }
    const declared = metaContent(fs.readFileSync(target, 'utf8'), 'chart-template');
    if (declared === row.id) continue;
    record('catalog', 'error', rel(CATALOG),
      `row "${row.id}" points at ${row.file}, which identifies itself as "${declared}"`);
  }
  for (const [id, file] of templateIdentities) {
    if (seen.has(id)) continue;
    record('catalog', 'error', rel(CATALOG),
      `${rel(file)} identifies as "${id}" and no catalog row lists it. A chart nothing indexes is a chart nobody finds`);
  }
}

// Every row's system cell has to agree with the file it points at and has to name a system the
// palette source defines. The cell is a hand-kept copy of a template's own declaration, so the
// two can disagree with nothing catching it, which is the state this corpus was in until both
// documents were read against each other by hand. A check is what stops the next one.
function checkCatalogSystem(catalog, palette) {
  if (!catalog) return;
  tally('catalog-system', catalog.rows.length + 1);
  if (catalog.systemCol === -1) {
    record('catalog-system', 'error', rel(CATALOG),
      'the index table carries no "system" column, so no row says which colour system its form declares');
    return;
  }
  for (const row of catalog.rows) {
    if (!row.file) continue;
    const target = path.join(PACKAGE_ROOT, row.file);
    if (!fs.existsSync(target)) continue;
    if (!row.system) {
      record('catalog-system', 'error', rel(CATALOG), `row "${row.id}" names no colour system`);
      continue;
    }
    if (!palette.systems[row.system]) {
      record('catalog-system', 'error', rel(CATALOG),
        `row "${row.id}" names colour system "${row.system}", which the palette source does not define`);
      continue;
    }
    const declared = metaContent(fs.readFileSync(target, 'utf8'), 'chart-color-system');
    if (declared === row.system) continue;
    record('catalog-system', 'error', rel(CATALOG),
      `row "${row.id}" says the system is "${row.system}" and ${row.file} declares "${declared}". The cell mirrors the file, so the file is the side that decides and the row is the side that drifted`);
  }
}

/* -------------------------------------------------------------------- render */

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  return candidates.find((p) => fs.existsSync(p)) || null;
}

// The render budget is three seconds, and the contract puts the settle time at one. Three
// times over is deliberate: a budget that only just clears the settle time turns every slow
// machine into a failure nobody can reproduce.
const RENDER_BUDGET_MS = 3000;
// Tall enough that the whole card and the table under it sit inside one frame. A short window
// crops the page, and a comparison that only sees the top of a document is not a comparison of
// the document.
const RENDER_WINDOW = '900,6000';

// The colour scheme a headless run inherits is the one the operator's machine happens to be
// set to, which would make the picture two people compare depend on their system settings. Both
// schemes are pinned instead, so a run means the same thing on any machine.
const SCHEME_LIGHT = '--blink-settings=preferredColorScheme=1';
const SCHEME_DARK = '--blink-settings=preferredColorScheme=0';

// One open of one file: the document the browser built, and the picture it painted.
function openOnce(browser, file, shot, scheme) {
  // Clear the target first. A browser that dies without writing leaves the previous file's
  // picture sitting at this path, and comparing a stale artifact is how a check reports a pass
  // on something it never looked at.
  fs.rmSync(shot, { force: true });
  try {
    const dom = execFileSync(browser, [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', scheme,
      `--window-size=${RENDER_WINDOW}`, `--virtual-time-budget=${RENDER_BUDGET_MS}`,
      '--dump-dom', `--screenshot=${shot}`, `file://${file}`,
    ], { encoding: 'utf8', timeout: 45000, stdio: ['ignore', 'pipe', 'ignore'] });
    return { dom, pixels: fs.existsSync(shot) ? fs.readFileSync(shot) : null };
  } catch (err) {
    return { error: err.message };
  }
}

function checkRenders(files) {
  const browser = findBrowser();
  if (!browser) {
    record('render', 'error', '-',
      'render was requested and no browser was found. Set CHROME_PATH, or drop --render and say plainly that rendering was not checked');
    tally('render', 1);
    return;
  }
  tally('render', files.length);
  // Rule 12's rendered half. The static determinism rule reads the drawing code for a clock or
  // a random source, which catches the two ways a picture used to be able to change on its own.
  // It cannot catch a third: an animation still running when the review takes its screenshot.
  // So each file is opened twice and both halves of what came back are compared. The document
  // catches a drawing that is still building itself, and the picture catches motion that has
  // not settled, which no document dump can see because a CSS animation never touches the DOM.
  tally('settled-render', files.length * 2);
  // Rule 4's rendered half. Every file carries a second palette block that only paints when the
  // reader's system asks for a dark scheme, and no reading of the file can prove that block
  // reaches the paint: a block nested wrong, or pasted outside its media query, matches the
  // source in both directions and still changes nothing on screen. Opening each file a third
  // time with the scheme pinned dark, and requiring a different picture, is what observes it.
  tally('dark-render', files.length);
  const shots = fs.mkdtempSync(path.join(os.tmpdir(), 'chart-corpus-render-'));
  try {
    for (const file of files) {
      const first = openOnce(browser, file, path.join(shots, 'first.png'), SCHEME_LIGHT);
      if (first.error) {
        record('render', 'error', rel(file), `the browser did not return a document: ${first.error}`);
        continue;
      }
      const figure = /<[^>]*data-chart-part\s*=\s*"figure"[^>]*>([\s\S]*?)<\/(?:div|figure|section)>/i.exec(first.dom);
      if (!figure) {
        record('render', 'error', rel(file), 'the rendered document has no figure region');
      } else {
        const elements = (figure[1].match(/<[a-zA-Z]/g) || []).length;
        if (elements < 4) {
          record('render', 'error', rel(file),
            `the figure region holds ${elements} elements after the script ran. A chart that opens as an empty box passes every static check`);
        }
      }

      const second = openOnce(browser, file, path.join(shots, 'second.png'), SCHEME_LIGHT);
      if (second.error) {
        record('settled-render', 'error', rel(file),
          `the second open did not return a document, so nothing could be compared: ${second.error}`);
        continue;
      }
      if (first.dom !== second.dom) {
        record('settled-render', 'error', rel(file),
          `two opens of this file built different documents after ${RENDER_BUDGET_MS}ms. Something in the drawing code is still changing the page when the budget expires, so a screenshot review compares the chart against noise rather than against itself`);
      }
      if (!first.pixels || !second.pixels) {
        record('settled-render', 'error', rel(file),
          'the browser returned no picture, so the settled state could not be compared. The document alone cannot see an animation, because a stylesheet animation never touches the DOM');
        continue;
      }
      if (!first.pixels.equals(second.pixels)) {
        record('settled-render', 'error', rel(file),
          `two opens of this file painted different pictures after ${RENDER_BUDGET_MS}ms. Either something moves without settling or the motion outruns the budget, and either way two screenshots of one chart disagree`);
      }

      const dark = openOnce(browser, file, path.join(shots, 'dark.png'), SCHEME_DARK);
      if (dark.error) {
        record('dark-render', 'error', rel(file),
          `the open under a dark colour scheme did not return a document: ${dark.error}`);
        continue;
      }
      if (!dark.pixels) {
        record('dark-render', 'error', rel(file),
          'the dark open returned no picture, so nothing could be compared against the light one');
        continue;
      }
      if (!dark.pixels.equals(first.pixels)) continue;
      record('dark-render', 'error', rel(file),
        'this file paints the same picture under a dark colour scheme as under a light one, so its second palette block never reached the paint. Either the block sits outside its media query, or the browser did not honour the pinned scheme');
    }
  } finally {
    fs.rmSync(shots, { recursive: true, force: true });
  }
}

/* ---------------------------------------------------------------------- main */

function htmlFilesUnder(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFilesUnder(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out.sort();
}

function main() {
  const wantRender = process.argv.includes('--render');
  const palette = loadPalette();
  checkRadiusRungs(palette);
  for (const theme of THEMES) checkPaletteSource(palette, theme);

  const files = htmlFilesUnder(ASSET_ROOT);
  const templateIdentities = new Map();

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const name = rel(file);
    checkDocumentShape(name, src);
    const { id, systemId } = checkIdentity(name, src, palette);
    const blocks = checkPaletteBlock(name, src, palette, systemId);
    checkColourLiterals(name, src, blocks);
    checkRadiusTokens(name, src, blocks);
    checkNoExternalResources(name, src);
    checkScriptParses(name, src);
    checkDataBlock(name, src);
    const ids = checkUniqueIds(name, src);
    checkAccessibility(name, src, ids);
    checkCardParts(name, src);
    checkDeterminism(name, src);
    checkNarrowViewport(name, src);
    checkMotion(name, src);
    checkInteractionHygiene(name, src);
    checkInteractionState(name, src);
    checkNumberFormat(name, src);
    checkTypeScale(name, src, palette);
    checkGradientSweep(name, src, systemId);
    checkSeriesMapping(name, src, palette, systemId);
    // The empty-data notice is an obligation of every file that draws a reading, which is every
    // chart form and every delivery. It used to be asked of the forms alone, on the stated ground
    // that a delivery carries the notice of the form it was built from. That ground was checked
    // and none of the six did: the exemption was a sentence describing what nobody had verified.
    // A delivery is also the copy somebody edits, so it is the copy most likely to be handed an
    // empty block. The one file this does not reach is a proof sheet, whose data block is the
    // palette it draws rather than a reading it displays.
    if (file.startsWith(TEMPLATE_DIR + path.sep) || file.startsWith(EXAMPLE_DIR + path.sep)) {
      checkEmptyNotice(name, src);
    }
    if (id && file.startsWith(TEMPLATE_DIR + path.sep)) templateIdentities.set(id, file);
  }

  // The block belongs to the files that draw in the shared frame: every chart form and every
  // proof sheet. The set is derived from the two directories rather than listed, so a new form
  // joins it by existing.
  checkGeometryBlock([...htmlFilesUnder(TEMPLATE_DIR), ...htmlFilesUnder(path.join(ASSET_ROOT, 'color'))]);

  const catalog = parseCatalog();
  checkCatalogResolves(catalog, templateIdentities);
  checkCatalogSystem(catalog, palette);
  if (wantRender) checkRenders(files);

  const errors = findings.filter((f) => f.level === 'error');
  const chartForms = fs.existsSync(TEMPLATE_DIR) ? htmlFilesUnder(TEMPLATE_DIR).length : 0;

  console.log('Chart corpus check');
  console.log(`  package: ${PACKAGE_ROOT}`);
  console.log(`  files scanned: ${files.length} (chart forms under assets/templates: ${chartForms})`);
  console.log(`  colour systems: ${Object.keys(palette.systems).length}`);
  console.log(`  render checks: ${wantRender ? 'requested' : 'not run (pass --render)'}`);
  console.log('');
  for (const [check, n] of [...counts.entries()].sort()) {
    const failed = errors.filter((e) => e.check === check).length;
    console.log(`  ${failed ? 'x' : '+'} ${check}: ${n} assertion(s), ${failed} failure(s)`);
  }
  if (errors.length) {
    console.log('');
    for (const e of errors) console.log(`  FAIL [${e.check}] ${e.file}: ${e.message}`);
  }
  console.log('');
  console.log(`Summary: errors: ${errors.length}`);
  console.log('');
  console.log(errors.length ? 'RESULT: FAILED' : 'RESULT: PASSED');
  process.exit(errors.length ? 1 : 0);
}

main();
