#!/usr/bin/env node
/**
 * Apply a v3 DESIGN.md style reference to chart form copies.
 *
 * The generator reads only the documented colour, typography, and radius sections. It never
 * fetches a reference, and it stages every output in memory until both theme gates pass.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {
  contrast,
  round2,
} = require('./color-gates.cjs');

const VERSION = '1.4.0.0';
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const TEMPLATE_DIR = path.join(PACKAGE_ROOT, 'assets', 'templates');
const PALETTE_SOURCE = path.join(PACKAGE_ROOT, 'assets', 'color', 'palettes.json');
const PALETTE_BEGIN = /\/\*\s*CHART_PALETTE:BEGIN\s+system=[a-z0-9-]+\s*\*\//;
const PALETTE_END = '/* CHART_PALETTE:END */';
const PALETTE_DARK_BEGIN = /\/\*\s*CHART_PALETTE_DARK:BEGIN\s+system=[a-z0-9-]+\s*\*\//;
const PALETTE_DARK_END = '/* CHART_PALETTE_DARK:END */';
const STOCK_LADDER = ['mark', 'track', 'swatch', 'pill', 'card'];
const STOCK_DARK_ALPHA = 0x17;

function fail(message) {
  const error = new Error(message);
  error.code = 'INPUT_ERROR';
  throw error;
}

function isUrl(value) {
  return /^(?:https?:)?\/\//i.test(value);
}

function readText(file, label) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) fail(`${label} does not exist: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function section(text, heading) {
  const start = text.indexOf(`## ${heading}`);
  if (start === -1) fail(`Missing section: ${heading}`);
  const after = text.slice(start + heading.length + 3);
  const next = after.search(/^## /m);
  return next === -1 ? after : after.slice(0, next);
}

function cells(line) {
  return line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((cell) => cell.trim());
}

function tableRows(text, headers, label) {
  const lines = text.split(/\r?\n/);
  const headerIndex = lines.findIndex((line) => cells(line).map((cell) => cell.replace(/[`*]/g, '')).join('|') === headers.join('|'));
  if (headerIndex === -1) fail(`Missing section: ${label} table`);
  const rows = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!/^\s*\|/.test(line)) {
      if (rows.length) break;
      continue;
    }
    const row = cells(line);
    if (row.length < headers.length) continue;
    rows.push(row.slice(0, headers.length).map((cell) => cell.replace(/^`|`$/g, '').trim()));
  }
  if (!rows.length) fail(`Missing section: ${label} table rows`);
  return rows;
}

function parseColors(text) {
  const rows = tableRows(section(text, 'Tokens — Colors'), ['Name', 'Value', 'Token', 'Role'], 'Tokens — Colors');
  return rows.map(([name, value, token, role], order) => ({
    name,
    value: value.toLowerCase(),
    token,
    role,
    order,
  })).filter((row) => /^#[0-9a-f]{6}$/i.test(row.value));
}

function headingFace(heading) {
  const withoutCode = heading.replace(/\s*·\s*`[^`]+`\s*$/, '').trim();
  return withoutCode.split(/\s+—\s+/)[0].trim();
}

function substituteFrom(block) {
  const match = /^\s*-\s*\*\*Substitute:\*\*\s*(.+?)\s*$/m.exec(block);
  if (!match) fail('Missing section: Typography Substitute');
  return match[1].trim();
}

function parseTypography(text) {
  const typography = section(text, 'Tokens — Typography');
  const headings = [...typography.matchAll(/^###\s+(.+)$/gm)]
    .filter((match) => !/^(Type Scale|Spacing Scale|Border Radius|Shadows|Layout)\b/.test(match[1]));
  if (!headings.length) fail('Missing section: primary typeface');

  const blocks = headings.map((match, index) => {
    const start = match.index;
    const end = index + 1 < headings.length ? headings[index + 1].index : typography.length;
    return { heading: match[1].trim(), block: typography.slice(start, end) };
  });
  const primary = blocks[0];
  const mono = blocks.find((candidate) => /mono|code|technical|numeric/i.test(candidate.heading)) || primary;
  return {
    body: { face: headingFace(primary.heading), substitute: substituteFrom(primary.block) },
    mono: { face: headingFace(mono.heading), substitute: substituteFrom(mono.block) },
  };
}

function parseRadius(text) {
  const shapes = section(text, 'Tokens — Spacing & Shapes');
  const radiusHeading = shapes.indexOf('### Border Radius');
  if (radiusHeading === -1) fail('Missing section: Border Radius');
  const afterHeading = shapes.slice(radiusHeading + '### Border Radius'.length);
  const nextHeading = afterHeading.search(/^### /m);
  const radiusSection = nextHeading === -1 ? afterHeading : afterHeading.slice(0, nextHeading);
  const rows = tableRows(radiusSection, ['Element', 'Value'], 'Border Radius');
  return rows.map(([, value]) => {
    const match = /^(\d+(?:\.\d+)?)px(?:\s|$)/i.exec(value);
    return match ? Number(match[1]) : null;
  }).filter((value) => value !== null && Number.isFinite(value));
}

function parseTokens(file) {
  if (!file) return null;
  if (isUrl(file)) fail(`URL arguments are not allowed: ${file}`);
  try {
    return JSON.parse(readText(file, 'tokens.json'));
  } catch (error) {
    if (error.code === 'INPUT_ERROR') throw error;
    fail(`tokens.json is not valid JSON: ${error.message}`);
  }
}

// The default Style Reference when a request names none. The cursor capture was chosen from the
// style library because its warm parchment and ink match the corpus' own chrome, it carries a
// muted ladder and a hairline rule, and its accents clear the mark gate on both grounds. The
// copy beside the forms is the one read: the library regenerates its captures, and a stock the
// corpus was derived from cannot be allowed to change under it without a diff. Any other
// reference is applied by passing its path instead.
const DEFAULT_DESIGN_PATH = path.join(PACKAGE_ROOT, 'assets', 'style-reference', 'cursor', 'DESIGN.md');
// Provenance records the reference by a path a second machine can resolve: relative to the
// repository root, never the absolute path of whoever ran the script.
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '..', '..', '..', '..');
function provenancePath(given) {
  const absolute = path.resolve(given);
  const relative = path.relative(REPO_ROOT, absolute);
  return relative && !relative.startsWith('..') ? relative.split(path.sep).join('/') : given;
}

function parseArgs(argv) {
  const options = { forms: null, all: false, tokens: null, scheme: 'both', out: null };
  if (!argv.length || isUrl(argv[0])) fail(`a local DESIGN.md path or --default is required; URL arguments are not allowed: ${argv[0] || '(missing)'}`);
  const designPath = argv[0] === '--default' ? DEFAULT_DESIGN_PATH : argv[0];
  for (let i = 1; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--all') {
      if (options.forms) fail('--all cannot be combined with --forms');
      options.all = true;
    } else if (flag === '--forms') {
      const value = argv[++i];
      if (!value || value.startsWith('--')) fail('--forms needs a comma-separated form list');
      if (options.all) fail('--forms cannot be combined with --all');
      options.forms = value.split(',').map((form) => form.trim()).filter(Boolean);
    } else if (flag === '--tokens') {
      options.tokens = argv[++i];
      if (!options.tokens || options.tokens.startsWith('--')) fail('--tokens needs a local JSON path');
    } else if (flag === '--scheme') {
      options.scheme = argv[++i];
      if (!['light', 'dark', 'both'].includes(options.scheme)) fail('--scheme must be light, dark, or both');
    } else if (flag === '--out') {
      options.out = argv[++i];
      if (!options.out || options.out.startsWith('--')) fail('--out needs a directory path');
    } else {
      fail(`unknown argument: ${flag}`);
    }
  }
  if (!options.all && !options.forms) fail('choose --forms a,b or --all');
  if (!options.out) fail('--out is required');
  return { designPath, ...options };
}

function formsFromOptions(options) {
  const forms = options.all
    ? fs.readdirSync(TEMPLATE_DIR).filter((file) => file.endsWith('.html')).map((file) => file.slice(0, -5)).sort()
    : options.forms;
  if (!forms.length) fail('no chart forms were selected');
  const unique = [...new Set(forms)];
  // An ordered form paints a single-hue magnitude ramp, which a Style Reference's colour table
  // does not supply, so such a form keeps its stock ramp: a named request is refused outright
  // and a whole-corpus request skips it with a note.
  const kept = [];
  unique.forEach((form) => {
    if (!/^[a-z0-9-]+$/.test(form)) fail(`form is not lower-case kebab: ${form}`);
    const source = readText(path.join(TEMPLATE_DIR, `${form}.html`), 'chart form');
    const system = (/<meta\s+name="chart-color-system"\s+content="([a-z-]+)"/i.exec(source) || [])[1];
    if (system === 'ordered') {
      if (!options.all) fail(`${form} is an ordered form; its magnitude ramp is not derivable from a Style Reference and it keeps the stock ordered system`);
      console.log(`NOTE ${form} skipped: an ordered form keeps its stock magnitude ramp`);
      return;
    }
    kept.push(form);
  });
  if (!kept.length) fail('no chart forms were selected');
  return kept;
}

function luminanceOrder(rows, descending) {
  return [...rows].sort((a, b) => {
    const delta = contrast(a.value, '#000000') - contrast(b.value, '#000000');
    return descending ? delta * -1 || a.order - b.order : delta || a.order - b.order;
  });
}

function roleText(row) {
  return row.role.toLowerCase();
}

function isBackground(row) {
  return /background|surface|canvas|ground|panel|fill/.test(roleText(row));
}

function isText(row) {
  return /text|ink|foreground/.test(roleText(row));
}

function saturation(row) {
  const hex = row.value.slice(1);
  const channels = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
  return Math.max(...channels) - Math.min(...channels);
}

function isChromatic(row) {
  return saturation(row) >= 24;
}

function rowFor(value, rows, fallback) {
  return rows.find((row) => row.value.toLowerCase() === value.toLowerCase()) || {
    name: fallback,
    token: fallback,
    value,
    role: 'stock chrome',
    order: Number.MAX_SAFE_INTEGER,
  };
}

function hexChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
}

function mix(first, second, amount) {
  const a = first.slice(1);
  const b = second.slice(1);
  const channels = [0, 2, 4].map((offset) => {
    const left = parseInt(a.slice(offset, offset + 2), 16);
    const right = parseInt(b.slice(offset, offset + 2), 16);
    return hexChannel(left + (right - left) * amount);
  });
  return `#${channels.join('')}`;
}

function ensureContrast(value, surface, target, toward) {
  if (contrast(value, surface) >= target) return value;
  let low = 0;
  let high = 1;
  let answer = null;
  for (let i = 0; i < 28; i += 1) {
    const amount = (low + high) / 2;
    const candidate = mix(value, toward, amount);
    if (contrast(candidate, surface) >= target) {
      answer = candidate;
      high = amount;
    } else {
      low = amount;
    }
  }
  return answer || value;
}

// Text roles come from the table's neutral tones. A chromatic colour with a text role is an
// accent for a link or a tag, and a chart that sets its ticks and captions in it reads as an
// error rather than as a theme.
function neutralText(rows) {
  const neutral = rows.filter((row) => isText(row) && !isChromatic(row));
  return neutral.length ? neutral : rows.filter(isText);
}

// Muted is the neutral text tone nearest the text gate, taken from the tones other than the ink
// so the caption keeps a step below the headline. A tone that sits just under the gate is
// darkened toward the ink by the least amount that clears it, and the mapping line says so;
// this is the one place a value may leave the table, because a chart with no second text tone
// has no hierarchy at all.
function targetTextRow(rows, surface, target, fallback, toward) {
  const all = luminanceOrder(neutralText(rows), false);
  const others = all.filter((row) => row.value.toLowerCase() !== toward.toLowerCase()
    && contrast(row.value, surface) >= 2);
  if (others.length) {
    const source = others.reduce((best, row) => {
      const ratio = contrast(row.value, surface);
      const distance = ratio >= target ? ratio - target : (target - ratio) * 2;
      return !best || distance < best.distance || (distance === best.distance && row.order < best.row.order)
        ? { row, distance } : best;
    }, null).row;
    const value = ensureContrast(source.value, surface, target, toward);
    return { row: source, value, adjusted: value.toLowerCase() !== source.value.toLowerCase() };
  }
  // With no second neutral tone in the table, the caption tone is the ink let out toward the
  // surface as far as the text gate allows, so the hierarchy exists without inventing a hue.
  const inkRow = rowFor(toward, rows, fallback);
  let low = 0;
  let high = 1;
  let answer = toward;
  for (let i = 0; i < 28; i += 1) {
    const amount = (low + high) / 2;
    const candidate = mix(toward, surface, amount);
    if (contrast(candidate, surface) >= target) { answer = candidate; low = amount; } else { high = amount; }
  }
  return { row: inkRow, value: answer, adjusted: true };
}

function chooseSurface(rows, light) {
  const candidates = rows.filter(isBackground);
  const usable = candidates.length ? candidates : rows;
  return luminanceOrder(usable, light).at(0);
}

function chooseInk(rows, light) {
  const candidates = neutralText(rows);
  const usable = candidates.length ? candidates : rows;
  return luminanceOrder(usable, !light).at(0);
}

// Series are measured values or nothing. A chromatic colour that misses the mark gate is
// skipped rather than darkened, because a darkened value is one the Style Reference never
// held and the provenance comment would then vouch for a colour nobody measured. When the
// table has fewer than four clearing hues, the remaining series take the table's own neutral
// text tones, darkest first, which is how the stock neutral system already paints a series.
function chooseSeries(rows, surface, ink, gates, label) {
  const chromatic = rows.filter(isChromatic).sort((a, b) => a.order - b.order);
  // Neutral tones fill in darkest first but the ink itself goes last, so it stays free for the
  // highlighted mark whenever the table has nothing chromatic left for it.
  const neutral = luminanceOrder(rows.filter((row) => isText(row) && !isChromatic(row)), false)
    .filter((row) => row.value.toLowerCase() !== surface.toLowerCase())
    .sort((a, b) => (a.value.toLowerCase() === ink.toLowerCase()) - (b.value.toLowerCase() === ink.toLowerCase()));
  const selected = [];
  const hueOf = (row) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(row.value.slice(i, i + 2), 16) / 255);
    const max = Math.max(r, g, b); const min = Math.min(r, g, b); const d = max - min;
    if (!d) return 0;
    const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return ((h * 60) + 360) % 360;
  };
  const gap = (a, b) => { const x = Math.abs(a - b) % 360; return x > 180 ? 360 - x : x; };
  const admit = (row) => {
    const value = row.value;
    if (contrast(value, surface) < gates.markOnSurface) return;
    if (selected.some((entry) => entry.value.toLowerCase() === value.toLowerCase())) return;
    // Two series a reader cannot tell apart, close in luminance and close in hue, are one
    // colour wearing two names; the checker refuses such a pair, so the mapper never makes one.
    if (selected.some((entry) => contrast(entry.value, value) < gates.rampStepSeparation && gap(hueOf(row), hueOf(entry.row)) < 30)) return;
    selected.push({ row, value });
  };
  // Hues are taken greedily by distance from the hues already chosen, so two greens do not sit
  // side by side while a red waits in the table; ties fall back to table order.
  const clearing = chromatic.filter((row) => contrast(row.value, surface) >= gates.markOnSurface);
  const pool = [...clearing];
  while (selected.length < 4 && pool.length) {
    let best = null;
    for (const row of pool) {
      const score = selected.length ? Math.min(...selected.map((entry) => gap(hueOf(row), hueOf(entry.row)))) : 360 - row.order;
      if (!best || score > best.score) best = { row, score };
    }
    pool.splice(pool.indexOf(best.row), 1);
    admit(best.row);
  }
  for (const row of neutral) { if (selected.length < 4) admit(row); }
  if (selected.length < 4) {
    const candidates = chromatic.length ? chromatic : rows;
    const nearest = candidates.map((row) => ({ row, ratio: contrast(row.value, surface) }))
      .sort((a, b) => Math.abs(a.ratio - gates.markOnSurface) - Math.abs(b.ratio - gates.markOnSurface))[0];
    const clearing = rows.map((row) => ({ row, ratio: contrast(row.value, surface) }))
      .filter((candidate) => candidate.ratio >= gates.markOnSurface)
      .sort((a, b) => Math.abs(a.ratio - gates.markOnSurface) - Math.abs(b.ratio - gates.markOnSurface))[0];
    const detail = clearing
      ? `${clearing.row.name} (${clearing.row.value}) at ${round2(clearing.ratio)}:1`
      : 'none';
    const error = new Error(`${label} series capacity needs 4 measured colours that clear the mark gate and found ${selected.length}`);
    error.failure = {
      message: `${label} series capacity`,
      ratio: nearest ? nearest.ratio : 0,
      gate: gates.markOnSurface,
      nearest: detail,
      against: surface,
    };
    throw error;
  }
  return selected;
}

function chooseEmphasis(rows, surface, ink, firstSeries, gates, series) {
  const candidates = rows.filter(isChromatic).sort((a, b) => saturation(b) - saturation(a) || a.order - b.order);
  for (const row of candidates) {
    const value = row.value;
    if (contrast(value, surface) < gates.markOnSurface) continue;
    if (contrast(value, firstSeries) < gates.emphasisAgainstFirstSeries) continue;
    if (series.some((entry) => entry.row.name === row.name)) continue;
    return { row, value };
  }
  // With every clearing hue already spent on series, the highlighted mark takes the ink, which
  // is how the stock categorical system marks its one emphasised value.
  const inkRow = rowFor(ink, rows, 'ink');
  if (contrast(ink, surface) >= gates.markOnSurface && contrast(ink, firstSeries) >= gates.emphasisAgainstFirstSeries) {
    return { row: inkRow, value: ink };
  }
  fail(`emphasis has no measured colour that clears ${gates.markOnSurface}:1 on the ground and ${gates.emphasisAgainstFirstSeries}:1 against series 1; nearest table colour that clears: none`);
}

function ruleValue(ink) {
  return `${ink}${STOCK_DARK_ALPHA.toString(16).padStart(2, '0')}`;
}

function themeIsDeclaredDark(design, tokens) {
  const theme = /\*\*Theme:\*\*\s*([^\n]+)/i.exec(design);
  const darkMode = tokens && tokens.darkMode;
  return Boolean(theme && /dark/i.test(theme[1]))
    || Boolean(darkMode && (darkMode.supported || (Array.isArray(darkMode.darkVariables) && darkMode.darkVariables.length)));
}

function deriveTheme(rows, stock, light, useDesignValues, gates, label) {
  const surfaceRow = useDesignValues ? chooseSurface(rows, light) : rowFor(stock.surface, rows, `stock ${light ? 'light' : 'dark'} surface`);
  const surface = useDesignValues ? surfaceRow.value : stock.surface;
  const inkRow = useDesignValues ? chooseInk(rows, light) : rowFor(stock.ink, rows, `stock ${light ? 'light' : 'dark'} ink`);
  const ink = useDesignValues ? inkRow.value : stock.ink;
  const mutedResult = useDesignValues
    ? targetTextRow(rows, surface, gates.textOnSurface, stock.muted, ink)
    : { row: rowFor(stock.muted, rows, `stock ${light ? 'light' : 'dark'} muted`), value: stock.muted };
  const chrome = {
    surface,
    ink,
    muted: mutedResult.value,
    rule: ruleValue(ink),
  };
  const series = chooseSeries(rows, surface, ink, gates, label);
  const emphasis = chooseEmphasis(rows, surface, ink, series[0].value, gates, series);
  const mappings = [
    { role: 'surface', row: surfaceRow, value: surface },
    { role: 'ink', row: inkRow, value: ink },
    { role: 'muted', row: mutedResult.row, value: mutedResult.value, adjusted: mutedResult.adjusted },
    { role: 'rule', row: rowFor(chrome.rule, rows, `ink at ${STOCK_DARK_ALPHA} alpha`), value: chrome.rule },
    ...series.map((entry, index) => ({ role: `series-${index + 1}`, row: entry.row, value: entry.value })),
    { role: 'emphasis', row: emphasis.row, value: emphasis.value },
  ];
  return { chrome, series: series.map((entry) => entry.value), emphasis: emphasis.value, mappings };
}

function validateTheme(theme, gates, label, rows) {
  const failures = [];
  const check = (role, value, gate, against) => {
    const ratio = contrast(value, against);
    if (ratio < gate) failures.push({ role, ratio, gate, rows, against, message: `${label} ${role}` });
  };
  check('ink', theme.chrome.ink, gates.textOnSurface, theme.chrome.surface);
  check('muted', theme.chrome.muted, gates.textOnSurface, theme.chrome.surface);
  theme.series.forEach((value, index) => {
    check(`series-${index + 1}`, value, gates.markOnSurface, theme.chrome.surface);
  });
  check('emphasis', theme.emphasis, gates.markOnSurface, theme.chrome.surface);
  check('emphasis against series-1', theme.emphasis, gates.emphasisAgainstFirstSeries, theme.series[0]);
  if (label === 'dark' && !/^#[0-9a-f]{8}$/i.test(theme.chrome.rule)) {
    failures.push({ role: 'rule', ratio: 0, gate: 'ink alpha', rows, against: theme.chrome.surface, message: `${label} rule` });
  }
  return failures;
}

function nearestClearing(failure, rows) {
  if (!Number.isFinite(Number(failure.gate))) return 'none';
  const source = (failure.rows || rows).filter((row) => /^#[0-9a-f]{6}$/i.test(row.value));
  const against = failure.against || (failure.message.startsWith('dark') ? '#161513' : '#ffffff');
  const candidates = source.map((row) => ({ row, ratio: contrast(row.value, against) }));
  const passing = candidates.filter((candidate) => candidate.ratio >= failure.gate);
  if (!passing.length) return 'none';
  const nearest = passing.sort((a, b) => Math.abs(a.ratio - failure.gate) - Math.abs(b.ratio - failure.gate))[0];
  return `${nearest.row.name} (${nearest.row.value}) at ${round2(nearest.ratio)}:1`;
}

function mappingLines(theme, label) {
  return theme.mappings.map((mapping) => {
    let ratio = 'n/a';
    if (/^#[0-9a-f]{6}/i.test(mapping.value)) ratio = `${round2(contrast(mapping.value, theme.chrome.surface))}:1`;
    return `MAPPING ${label} ${mapping.role}: ${mapping.row.name} (${mapping.row.token}) ratio=${ratio}${mapping.adjusted ? ` darkened to ${mapping.value} to clear the text gate` : ''}`;
  });
}

// Each rung takes the largest corner the reference publishes that still fits it. A reference with
// nothing that small has said nothing about that rung, and the corpus value stands: collapsing to
// zero squared every data mark, legend swatch and progress capsule in a themed set, and did it
// without a word. This is a floor, so a reference whose corners are all larger than the corpus
// rungs contributes none of them; what that costs is written down beside the mapping.
function radiusLadder(measured, stockRadius) {
  return STOCK_LADDER.map((role) => {
    const stockValue = Number.parseFloat(stockRadius[role]);
    const candidates = measured.filter((value) => value <= stockValue);
    const value = candidates.length ? Math.max(...candidates) : stockValue;
    return [role, `${value}px`];
  });
}

function fontName(name) {
  const value = name.trim();
  return /\s/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value;
}

function fontStack(face, substitute) {
  const parts = [face, ...substitute.split(',').map((item) => item.trim()).filter(Boolean)];
  const expanded = [];
  parts.forEach((part) => {
    if (part === 'system sans-serif') expanded.push('system', 'sans-serif');
    else expanded.push(part);
  });
  return [...new Set(expanded)].map(fontName).join(', ');
}

function provenance(pathGiven, hash) {
  return `/* DESIGN.md provenance: path=${provenancePath(pathGiven)} sha256=${hash} generator=${VERSION} */`;
}

function paletteBlock(theme, light, pathGiven, hash, radius) {
  const lines = [];
  lines.push(`/* CHART_PALETTE${light ? '' : '_DARK'}:BEGIN system=design-md */`);
  lines.push(provenance(pathGiven, hash));
  if (light) {
    lines.push(':root {');
    for (const [role, value] of Object.entries(theme.chrome)) lines.push(`  --chart-${role}: ${value.toUpperCase()};`);
    radius.forEach(([role, value]) => lines.push(`  --chart-radius-${role}: ${value};`));
    theme.series.forEach((value, index) => lines.push(`  --chart-series-${index + 1}: ${value.toUpperCase()};`));
    lines.push(`  --chart-emphasis: ${theme.emphasis.toUpperCase()};`);
    lines.push('}');
  } else {
    lines.push('@media (prefers-color-scheme: dark) {');
    lines.push('  :root:not([data-scheme="light"]) {');
    for (const [role, value] of Object.entries(theme.chrome)) lines.push(`    --chart-${role}: ${value.toUpperCase()};`);
    theme.series.forEach((value, index) => lines.push(`    --chart-series-${index + 1}: ${value.toUpperCase()};`));
    lines.push(`    --chart-emphasis: ${theme.emphasis.toUpperCase()};`);
    lines.push('  }');
    lines.push('}');
    lines.push(':root[data-scheme="dark"] {');
    for (const [role, value] of Object.entries(theme.chrome)) lines.push(`  --chart-${role}: ${value.toUpperCase()};`);
    theme.series.forEach((value, index) => lines.push(`  --chart-series-${index + 1}: ${value.toUpperCase()};`));
    lines.push(`  --chart-emphasis: ${theme.emphasis.toUpperCase()};`);
    lines.push('}');
  }
  lines.push(light ? PALETTE_END : PALETTE_DARK_END);
  return lines.join('\n');
}

function replaceRegion(source, begin, end, replacement, label) {
  const match = begin.exec(source);
  if (!match) fail(`chart form has no ${label} begin marker`);
  const endIndex = source.indexOf(end, match.index);
  if (endIndex === -1) fail(`chart form has no ${label} end marker`);
  const finish = endIndex + end.length;
  return source.slice(0, match.index) + replacement + source.slice(finish);
}

function replaceFonts(source, typography) {
  const body = fontStack(typography.body.face, typography.body.substitute);
  const mono = fontStack(typography.mono.face, typography.mono.substitute);
  // A declaration is replaced by what it already is: a stack that names a monospace face gets
  // the reference's mono stack, any other gets the body stack. Position in the sheet is not a
  // signal, and a template with two body stacks or none stays correct.
  return source.replace(/(<style\b[^>]*>[\s\S]*?<\/style>)/gi, (styleBlock) => styleBlock.replace(/font-family\s*:\s*[^;]+;/gi, (declaration) => {
    const stack = /monospace/i.test(declaration) ? mono : body;
    return `font-family: ${stack};`;
  }));
}

function renderForm(source, themes, typography, radius, pathGiven, hash) {
  let output = replaceRegion(source, PALETTE_BEGIN, PALETTE_END, paletteBlock(themes.light, true, pathGiven, hash, radius), 'light palette');
  output = replaceRegion(output, PALETTE_DARK_BEGIN, PALETTE_DARK_END, paletteBlock(themes.dark, false, pathGiven, hash, radius), 'dark palette');
  output = replaceFonts(output, typography);
  // The meta tag names the system the blocks carry, so a themed copy says design-md there too
  // and the checker can still hold the tag and the blocks to one another.
  output = output.replace(/(<meta\s+name="chart-color-system"\s+content=")[a-z-]+(")/i, '$1design-md$2');
  return output;
}

function derive(input) {
  const palette = JSON.parse(readText(PALETTE_SOURCE, 'palette source'));
  const design = readText(input.designPath, 'DESIGN.md');
  const tokensPath = input.tokens || (fs.existsSync(path.join(path.dirname(input.designPath), 'tokens.json'))
    ? path.join(path.dirname(input.designPath), 'tokens.json') : null);
  const tokens = parseTokens(tokensPath);
  const rows = parseColors(design);
  if (rows.length < 4) fail('Tokens — Colors has fewer than four usable six-digit colour rows');
  const typography = parseTypography(design);
  const measuredRadius = parseRadius(design);
  const gates = palette.gates;
  const declaredDark = themeIsDeclaredDark(design, tokens);
  const useLightDesign = input.scheme !== 'dark';
  const useDarkDesign = input.scheme !== 'light' && (declaredDark || input.scheme === 'dark');
  const light = deriveTheme(rows, palette.chrome, true, useLightDesign, gates, 'light');
  const dark = deriveTheme(rows, palette.chromeDark, false, useDarkDesign, gates, 'dark');
  const failures = [
    ...validateTheme(light, gates, 'light', rows),
    ...validateTheme(dark, gates, 'dark', rows),
  ];
  const radius = radiusLadder(measuredRadius, palette.radius);
  return { palette, rows, typography, light, dark, radius, failures, declaredDark };
}

function run(argv) {
  const options = parseArgs(argv);
  const input = { ...options, designPath: options.designPath };
  let design;
  try {
    design = derive(input);
  } catch (error) {
    if (!error.failure) throw error;
    return {
      ok: false,
      lines: [
        `DESIGN.md: ${options.designPath}`,
        `FAILURE ${error.failure.message} ratio=${round2(error.failure.ratio)}:1 gate=${error.failure.gate}: nearest table colour that clears: ${error.failure.nearest}`,
        'RESULT: FAILED',
      ],
    };
  }
  const hash = crypto.createHash('sha256').update(readText(options.designPath, 'DESIGN.md')).digest('hex');
  const forms = formsFromOptions(options);
  const lines = [
    `DESIGN.md: ${options.designPath}`,
    `generator: ${VERSION}`,
    `themes: light=${design.light.chrome.surface} dark=${design.dark.chrome.surface}${design.declaredDark ? ' (declared)' : ' (stock dark chrome)'}`,
    ...mappingLines(design.light, 'light'),
    ...mappingLines(design.dark, 'dark'),
  ];
  if (design.failures.length) {
    design.failures.forEach((failure) => {
      lines.push(`FAILURE ${failure.message} ratio=${round2(failure.ratio)}:1 gate=${failure.gate}: nearest table colour that clears: ${nearestClearing(failure, design.rows)}`);
    });
    lines.push('RESULT: FAILED');
    return { ok: false, lines };
  }

  const outputs = new Map();
  for (const form of forms) {
    const sourcePath = path.join(TEMPLATE_DIR, `${form}.html`);
    outputs.set(form, renderForm(
      readText(sourcePath, 'chart form'),
      { light: design.light, dark: design.dark },
      design.typography,
      design.radius,
      options.designPath,
      hash,
    ));
  }
  const outDir = path.resolve(options.out);
  if (outDir === TEMPLATE_DIR || outDir.startsWith(TEMPLATE_DIR + path.sep)) {
    fail('refusing to write inside assets/templates; stock forms are immutable');
  }
  fs.mkdirSync(outDir, { recursive: true });
  for (const [form, output] of outputs) {
    fs.writeFileSync(path.join(outDir, `${form}.html`), output, 'utf8');
    lines.push(`WROTE ${path.join(options.out, `${form}.html`)}`);
  }
  lines.push('RESULT: PASSED');
  return { ok: true, lines };
}

if (require.main === module) {
  try {
    const result = run(process.argv.slice(2));
    result.lines.forEach((line) => console.log(line));
    process.exit(result.ok ? 0 : 1);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    console.error('RESULT: FAILED');
    process.exit(2);
  }
}

module.exports = {
  DEFAULT_DESIGN_PATH,
  VERSION,
  parseArgs,
  parseColors,
  parseTypography,
  parseRadius,
  derive,
  run,
  renderForm,
};
