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
const vm = require('vm');
const { execFileSync } = require('child_process');

const PACKAGE_ROOT = path.resolve(__dirname, '..');
const PALETTE_SOURCE = path.join(PACKAGE_ROOT, 'assets', 'color', 'palettes.json');
const CATALOG = path.join(PACKAGE_ROOT, 'references', 'catalog.md');
const TEMPLATE_DIR = path.join(PACKAGE_ROOT, 'assets', 'templates');
const ASSET_ROOT = path.join(PACKAGE_ROOT, 'assets');

const PALETTE_BEGIN = /\/\*\s*CHART_PALETTE:BEGIN\s+system=([a-z0-9-]+)\s*\*\//;
const PALETTE_END = '/* CHART_PALETTE:END */';
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
  system.series.forEach((value, i) => {
    props.set(`${palette.customPropertyPrefix}series-${i + 1}`, value);
  });
  props.set(`${palette.customPropertyPrefix}emphasis`, system.emphasis);
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

function checkPaletteSource(palette) {
  const surface = palette.chrome.surface;
  const g = palette.gates;
  let checked = 0;

  for (const role of ['surface', 'ink', 'muted', 'rule']) {
    if (!palette.chrome[role]) {
      record('palette-source', 'error', rel(PALETTE_SOURCE), `chrome role "${role}" is missing`);
    }
  }
  for (const role of ['ink', 'muted']) {
    const ratio = contrast(palette.chrome[role], surface);
    checked += 1;
    if (ratio < g.textOnSurface) {
      record('palette-source', 'error', rel(PALETTE_SOURCE),
        `chrome.${role} reads ${round2(ratio)}:1 on surface, below the ${g.textOnSurface}:1 text gate`);
    }
  }

  for (const [id, system] of Object.entries(palette.systems)) {
    if (system.series.length !== system.capacity) {
      record('palette-source', 'error', rel(PALETTE_SOURCE),
        `system "${id}" declares capacity ${system.capacity} and defines ${system.series.length} series values`);
    }
    const emphasisRatio = contrast(system.emphasis, surface);
    checked += 1;
    if (emphasisRatio < g.markOnSurface) {
      record('palette-source', 'error', rel(PALETTE_SOURCE),
        `system "${id}" emphasis reads ${round2(emphasisRatio)}:1 on surface, below the ${g.markOnSurface}:1 mark gate`);
    }
    const againstFirst = contrast(system.emphasis, system.series[0]);
    checked += 1;
    if (againstFirst < g.emphasisAgainstFirstSeries) {
      record('palette-source', 'error', rel(PALETTE_SOURCE),
        `system "${id}" emphasis reads ${round2(againstFirst)}:1 against series[0], below the ${g.emphasisAgainstFirstSeries}:1 separation floor. An emphasised mark that matches the base mark in lightness disappears in greyscale`);
    }

    if (system.encodes === 'magnitude') {
      // A ramp is read as a group against its legend, so only the dark end has to clear
      // the mark gate. Requiring it of every step would delete the light end of every
      // sequential scale, which is the half that encodes "low".
      const darkest = contrast(system.series[0], surface);
      checked += 1;
      if (darkest < g.rampDarkestOnSurface) {
        record('palette-source', 'error', rel(PALETTE_SOURCE),
          `system "${id}" darkest ramp step reads ${round2(darkest)}:1 on surface, below ${g.rampDarkestOnSurface}:1`);
      }
      const lightest = contrast(system.series[system.series.length - 1], surface);
      checked += 1;
      if (lightest < g.rampLightestOnSurface) {
        record('palette-source', 'error', rel(PALETTE_SOURCE),
          `system "${id}" lightest ramp step reads ${round2(lightest)}:1 on surface, below ${g.rampLightestOnSurface}:1. A low cell has to be distinguishable from an empty one`);
      }
      for (let i = 0; i < system.series.length - 1; i += 1) {
        const step = contrast(system.series[i], system.series[i + 1]);
        checked += 1;
        if (step < g.rampStepSeparation) {
          record('palette-source', 'error', rel(PALETTE_SOURCE),
            `system "${id}" steps ${i + 1} and ${i + 2} differ by ${round2(step)}:1, below the ${g.rampStepSeparation}:1 rank-readability floor`);
        }
        if (luminance(system.series[i]) < luminance(system.series[i + 1])) continue;
        record('palette-source', 'error', rel(PALETTE_SOURCE),
          `system "${id}" is not monotonic in lightness at steps ${i + 1} and ${i + 2}. An ordered scale that reverses encodes nothing`);
      }
    } else {
      // Marks a reader identifies one at a time each have to clear the gate alone.
      system.series.forEach((value, i) => {
        const ratio = contrast(value, surface);
        checked += 1;
        if (ratio < g.markOnSurface) {
          record('palette-source', 'error', rel(PALETTE_SOURCE),
            `system "${id}" series[${i}] reads ${round2(ratio)}:1 on surface, below the ${g.markOnSurface}:1 mark gate`);
        }
      });
    }
  }
  tally('palette-source', checked);
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

function paletteBlockOf(src) {
  const begin = PALETTE_BEGIN.exec(src);
  if (!begin) return null;
  const start = begin.index;
  const end = src.indexOf(PALETTE_END, start);
  if (end === -1) return null;
  return { systemId: begin[1], start, end: end + PALETTE_END.length, text: src.slice(start, end + PALETTE_END.length) };
}

function checkPaletteBlock(file, src, palette, declaredSystem) {
  tally('palette-block', 1);
  const block = paletteBlockOf(src);
  if (!block) {
    record('palette-block', 'error', file,
      `no CHART_PALETTE sentinel pair. Expected block:\n${canonicalBlock(palette, declaredSystem || 'neutral')}`);
    return null;
  }
  if (declaredSystem && block.systemId !== declaredSystem) {
    record('palette-block', 'error', file,
      `palette block declares system "${block.systemId}" and the meta tag declares "${declaredSystem}"`);
    return block;
  }
  if (!palette.systems[block.systemId]) return block;

  const expected = customProperties(palette, block.systemId);
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
      `palette block drifted from the source: ${problems.join('; ')}.\nExpected block:\n${canonicalBlock(palette, block.systemId)}`);
  }
  return block;
}

function checkColourLiterals(file, src, block) {
  const withoutBlock = block ? src.slice(0, block.start) + src.slice(block.end) : src;
  const cleaned = stripHtmlComments(withoutBlock)
    .replace(/x?link:href\s*=\s*"#[^"]*"/gi, ' ')
    .replace(/href\s*=\s*"#[^"]*"/gi, ' ')
    .replace(/url\(\s*#[^)]*\)/gi, ' ');
  const { styles, scripts, attrs } = regionsOf(cleaned);
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
    for (const name of NAMED_COLOURS) {
      const re = new RegExp(`(?:^|[:\\s,])${name}(?:$|[;\\s,)])`, 'i');
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

function checkMotion(file, src) {
  const { styles } = regionsOf(src);
  const joined = styles.join('\n');
  tally('motion', 1);
  const animates = /@keyframes\b/.test(joined) || /\banimation\s*:/.test(joined) || /\btransition\s*:/.test(joined);
  if (!animates) return;
  if (/prefers-reduced-motion/.test(joined)) return;
  record('motion', 'error', file,
    'the file animates and carries no prefers-reduced-motion fallback');
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
    rows.push({ id: c[idCol], file: c[fileCol] });
  }
  return { rows, headers };
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

function checkRenders(files) {
  const browser = findBrowser();
  if (!browser) {
    record('render', 'error', '-',
      'render was requested and no browser was found. Set CHROME_PATH, or drop --render and say plainly that rendering was not checked');
    tally('render', 1);
    return;
  }
  tally('render', files.length);
  for (const file of files) {
    let dom;
    try {
      dom = execFileSync(browser, [
        '--headless=new', '--disable-gpu', '--no-sandbox',
        '--virtual-time-budget=3000', '--dump-dom', `file://${file}`,
      ], { encoding: 'utf8', timeout: 45000, stdio: ['ignore', 'pipe', 'ignore'] });
    } catch (err) {
      record('render', 'error', rel(file), `the browser did not return a document: ${err.message}`);
      continue;
    }
    const figure = /<[^>]*data-chart-part\s*=\s*"figure"[^>]*>([\s\S]*?)<\/(?:div|figure|section)>/i.exec(dom);
    if (!figure) {
      record('render', 'error', rel(file), 'the rendered document has no figure region');
      continue;
    }
    const elements = (figure[1].match(/<[a-zA-Z]/g) || []).length;
    if (elements >= 4) continue;
    record('render', 'error', rel(file),
      `the figure region holds ${elements} elements after the script ran. A chart that opens as an empty box passes every static check`);
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
  checkPaletteSource(palette);

  const files = htmlFilesUnder(ASSET_ROOT);
  const templateIdentities = new Map();

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const name = rel(file);
    checkDocumentShape(name, src);
    const { id, systemId } = checkIdentity(name, src, palette);
    const block = checkPaletteBlock(name, src, palette, systemId);
    checkColourLiterals(name, src, block);
    checkNoExternalResources(name, src);
    checkScriptParses(name, src);
    checkDataBlock(name, src);
    const ids = checkUniqueIds(name, src);
    checkAccessibility(name, src, ids);
    checkCardParts(name, src);
    checkDeterminism(name, src);
    checkMotion(name, src);
    if (id && file.startsWith(TEMPLATE_DIR + path.sep)) templateIdentities.set(id, file);
  }

  checkCatalogResolves(parseCatalog(), templateIdentities);
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
