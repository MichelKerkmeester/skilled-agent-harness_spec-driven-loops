#!/usr/bin/env node
/**
 * Theme diagram forms from a local v3 DESIGN.md Style Reference.
 *
 * The reference is read, never fetched: a URL argument is refused by name and there is no force
 * option. Every selected form's palette is derived and gated in memory before anything is
 * written, so a single failing role aborts the run with no output file.
 *
 * A reference may name a diagram role directly in its Token column; those rows fill the role
 * verbatim, which is what lets a reference carrying the corpus's own palette reproduce the
 * corpus byte for byte. A role no Token cell names falls back to the selection rules documented
 * in references/design-md-theming.md.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { contrast, round2 } = require('./color-gates.cjs');

const VERSION = '1.0.0.0';
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const FORM_DIR = path.join(PACKAGE_ROOT, 'assets', 'diagrams');
const PALETTE_SOURCE = path.join(PACKAGE_ROOT, 'assets', 'color', 'diagram-palette.json');
// The default Style Reference, and the copy beside the forms for the same reason the chart
// sibling keeps its own: a corpus cannot be derived from a file that may change under it. This
// reference writes down the corpus's own palette, so theming from it is an identity.
const DEFAULT_DESIGN_PATH = path.join(PACKAGE_ROOT, 'assets', 'style-reference', 'harness-diagram', 'DESIGN.md');
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '..', '..', '..', '..');

const SKINS = ['light', 'dark', 'terminal'];
const BEGIN = /\/\*\s*DIAGRAM_PALETTE:BEGIN\s+skin=([a-z0-9-]+)(\s+system=[a-z0-9-]+)?\s*\*\//;
const END = /\/\*\s*DIAGRAM_PALETTE:END\s*\*\//;
const DECL = /^(\s*--color-([a-z0-9-]+)\s*:\s*)(.*?)(\s*;.*)$/;
const HEX = /^#[0-9a-f]{6}$/i;
const COLOR_VALUE = /^(#[0-9a-f]{6}|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\))$/i;
// A hex token is matched whole: six digits that are not part of a longer run.
const HEX_LITERAL = /(?<![0-9a-f])#[0-9a-f]{6}(?![0-9a-f])/gi;
// Tier one: a Token cell that names a diagram role directly, optionally for one skin.
const TOKEN_ROLE = /^--color-([a-z0-9-]+)(?:\s+\((dark|terminal)\))?$/;

const TEXT_ROLES = new Set(['ink', 'muted', 'soft']);
// Surfaces and chrome are structure rather than marks: a second paper tone sits beside its own
// ground by design, and the terminal skin's soft is its inactive-dot tone, not a text tone.
const STRUCTURE_ROLE = /^(paper|page)/;
const STRUCTURE_BY_SKIN = { light: [], dark: [], terminal: ['soft'] };
// The alphas the token source records for the three mechanically composed roles.
const RULE_ALPHA = 0.12;
const RULE_SOLID_ALPHA = 0.25;
const ACCENT_TINT_ALPHA = { light: 0.08, dark: 0.1, terminal: 0.12 };
// The soft tone's fallback step is a fixed fraction: soft carries structure only and gates
// against nothing, so its value is stated rather than measured.
const SOFT_STEP = 0.5;
const SERIES_SLOTS = 5;

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

// ─────────────────────────────────────────────────────────────────────────────
// 1. REFERENCE PARSING
// ─────────────────────────────────────────────────────────────────────────────

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

// The six-digit rows are the selection pool for every rule that has to measure a colour.
function parseColors(text) {
  const rows = tableRows(section(text, 'Tokens — Colors'), ['Name', 'Value', 'Token', 'Role'], 'Tokens — Colors');
  return rows.map(([name, value, token, role], order) => ({
    name,
    value: value.toLowerCase(),
    token,
    role,
    order,
  })).filter((row) => HEX.test(row.value));
}

// Tier one reads the same table without the six-digit filter, because the alpha-composed roles
// are colour values too and a reference that declares one has said what it wants.
function parseColorDeclarations(text, palette) {
  const rows = tableRows(section(text, 'Tokens — Colors'), ['Name', 'Value', 'Token', 'Role'], 'Tokens — Colors');
  const declared = {};
  for (const [name, value, token] of rows) {
    const match = TOKEN_ROLE.exec(token.trim());
    if (!match) continue;
    const skin = match[2] === 'dark' ? 'dark' : match[2] === 'terminal' ? 'terminal' : 'light';
    const role = match[1];
    if (!palette.skins[skin] || !palette.skins[skin].roles[role]) continue;
    const literal = value.toLowerCase();
    if (!COLOR_VALUE.test(literal)) continue;
    const key = `${skin}:${role}`;
    if (!declared[key]) declared[key] = { value: literal, name, token };
  }
  return declared;
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

// The typeface and radius sections are read for shape rather than applied: a diagram carries its
// corners and font stacks as inline attributes and CSS variables a colour table cannot improve on,
// but a reference missing either section is not a complete v3 reference and is refused by name.
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

function readTokensBeside(designPath) {
  const sibling = path.join(path.dirname(designPath), 'tokens.json');
  if (!fs.existsSync(sibling)) return null;
  try {
    return JSON.parse(readText(sibling, 'tokens.json'));
  } catch (error) {
    if (error.code === 'INPUT_ERROR') throw error;
    fail(`tokens.json is not valid JSON: ${error.message}`);
  }
}

// A terminal skin is never fabricated from a light-only table: the reference has to name a dark
// environment before its dark rows can be trusted to mean one.
function themeIsDeclaredDark(design, tokens) {
  const theme = /\*\*Theme:\*\*\s*([^\n]+)/i.exec(design);
  const darkMode = tokens && tokens.darkMode;
  return Boolean(theme && /dark/i.test(theme[1]))
    || Boolean(darkMode && (darkMode.supported || (Array.isArray(darkMode.darkVariables) && darkMode.darkVariables.length)));
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ROW PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

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

// Text roles come from the table's neutral tones. A chromatic colour with a text role is an
// accent for a link or a tag, and a diagram that sets its captions in it reads as an error.
function neutralText(rows) {
  const neutral = rows.filter((row) => isText(row) && !isChromatic(row));
  return neutral.length ? neutral : rows.filter(isText);
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

function rgbaValue(hex, alpha) {
  const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
  return `rgba(${channels.join(',')},${alpha})`;
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

function hueOf(value) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (!delta) return 0;
  const h = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return ((h * 60) + 360) % 360;
}

function hueGap(first, second) {
  const delta = Math.abs(first - second) % 360;
  return delta > 180 ? 360 - delta : delta;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SELECTION RULES — the fallback tier
// ─────────────────────────────────────────────────────────────────────────────

function chooseGround(rows, light) {
  const candidates = rows.filter(isBackground);
  const usable = candidates.length ? candidates : rows;
  return luminanceOrder(usable, light).at(0);
}

function chooseInk(rows, light) {
  const candidates = neutralText(rows);
  const usable = candidates.length ? candidates : rows;
  return luminanceOrder(usable, !light).at(0);
}

// Muted is the neutral text tone nearest the text gate, taken from the tones other than the ink
// so the caption keeps a step below the headline. A tone that sits just under the gate is
// darkened toward the ink by the least amount that clears it, and the mapping line says so: a
// diagram with no second text tone has no hierarchy at all.
function chooseMuted(rows, surface, gateTarget, ink, labels) {
  const all = luminanceOrder(neutralText(rows), false);
  const others = all.filter((row) => row.value.toLowerCase() !== ink.toLowerCase()
    && contrast(row.value, surface) >= 2);
  if (others.length) {
    const source = others.reduce((best, row) => {
      const ratio = contrast(row.value, surface);
      const distance = ratio >= gateTarget ? ratio - gateTarget : (gateTarget - ratio) * 2;
      return !best || distance < best.distance || (distance === best.distance && row.order < best.row.order)
        ? { row, distance } : best;
    }, null).row;
    const value = ensureContrast(source.value, surface, gateTarget, ink);
    return {
      row: source,
      value,
      adjusted: value.toLowerCase() !== source.value.toLowerCase(),
      note: null,
    };
  }
  // With no second neutral tone in the table, the caption tone is the ink let out toward the
  // surface as far as the text gate allows, so the hierarchy exists without inventing a hue.
  const inkRow = rowFor(ink, rows, labels.stockInk);
  let low = 0;
  let high = 1;
  let answer = ink;
  for (let i = 0; i < 28; i += 1) {
    const amount = (low + high) / 2;
    const candidate = mix(ink, surface, amount);
    if (contrast(candidate, surface) >= gateTarget) {
      answer = candidate;
      low = amount;
    } else {
      high = amount;
    }
  }
  return {
    row: inkRow,
    value: answer,
    adjusted: true,
    note: `${labels.skin} muted is the ink let out toward the ground: the table carries no second neutral tone`,
  };
}

// One accent, not a ladder: a diagram carries a single focal mark, so the pick is the most
// saturated clearing row and a table that holds none fails the run rather than darkening one. A
// themed accent is never excused by the stock accent's recorded departure.
function chooseAccent(rows, surface, gates, skin) {
  const chromatic = rows.filter(isChromatic).sort((a, b) => saturation(b) - saturation(a) || a.order - b.order);
  const clearing = chromatic.filter((row) => contrast(row.value, surface) >= gates.markOnPaper);
  if (!clearing.length) {
    const nearest = chromatic.map((row) => ({ row, ratio: contrast(row.value, surface) }))
      .sort((a, b) => b.ratio - a.ratio)[0];
    const error = new Error(`${skin} accent has no chromatic row that clears the mark gate`);
    error.failure = {
      role: 'accent',
      ratio: nearest ? nearest.ratio : 0,
      gate: 'markOnPaper',
      threshold: gates.markOnPaper,
      against: surface,
      nearest: nearest ? `${nearest.row.name} (${nearest.row.value})` : 'none',
    };
    throw error;
  }
  return clearing[0];
}

function choosePaper2(rows, ground) {
  const candidates = rows.filter(isBackground);
  const usable = candidates.length ? candidates : rows;
  return luminanceOrder(usable, true).find((row) => row.value.toLowerCase() !== ground.toLowerCase()) || null;
}

function chooseSoft(rows, muted, surface, dark) {
  const ordered = luminanceOrder(neutralText(rows), false);
  const index = ordered.findIndex((row) => row.value.toLowerCase() === muted.toLowerCase());
  // One step along the table's own neutral ladder, in the direction the ground leaves free; when
  // the ladder has no further step the tone is a fixed mix, because soft carries structure only
  // and gates against nothing.
  const candidate = index === -1 ? null : (dark ? ordered[index - 1] : ordered[index + 1]);
  if (candidate) return { row: candidate, value: candidate.value, adjusted: false, note: null };
  return { row: rowFor(muted, rows, 'muted'), value: mix(muted, surface, SOFT_STEP), adjusted: true, note: null };
}

function chooseLink(rows, ground, accentValue, gates) {
  const tagged = rows.find((row) => /link|anchor|interactive|hyperlink/.test(roleText(row)));
  if (tagged) return { row: tagged, value: tagged.value, note: null };
  const chromatic = rows.filter(isChromatic).sort((a, b) => saturation(b) - saturation(a) || a.order - b.order);
  const second = chromatic.find((row) => row.value.toLowerCase() !== accentValue.toLowerCase()
    && contrast(row.value, ground) >= gates.markOnPaper
    && hueGap(hueOf(row.value), hueOf(accentValue)) >= 30);
  if (second) return { row: second, value: second.value, note: null };
  return { row: null, value: null, note: 'link keeps its stock value: the table tags no link role and holds no second clearing hue' };
}

function chooseBackendFill(rows, ground) {
  const groundLuminance = contrast(ground, '#000000');
  return luminanceOrder(rows.filter((row) => isBackground(row)
    && row.value.toLowerCase() !== ground.toLowerCase()
    && contrast(row.value, '#000000') > groundLuminance), true).at(0) || null;
}

// Series are measured values or nothing, widened to five slots. A chromatic colour that misses
// the mark gate is skipped rather than darkened, and when the table has fewer than five clearing
// hues the remaining slots take its own neutral text tones, darkest first, with the ink held
// back until last so it stays free for a focal mark.
function chooseSeries(rows, surface, ink, gates) {
  const chromatic = rows.filter(isChromatic).sort((a, b) => a.order - b.order);
  const neutral = luminanceOrder(rows.filter((row) => isText(row) && !isChromatic(row)), false)
    .filter((row) => row.value.toLowerCase() !== surface.toLowerCase())
    .sort((a, b) => (a.value.toLowerCase() === ink.toLowerCase()) - (b.value.toLowerCase() === ink.toLowerCase()));
  const selected = [];
  const admit = (row) => {
    const value = row.value;
    if (contrast(value, surface) < gates.markOnPaper) return;
    if (selected.some((entry) => entry.value.toLowerCase() === value.toLowerCase())) return;
    // Two series a reader cannot tell apart, close in luminance and close in hue, are one colour
    // wearing two names, so the mapper never makes such a pair.
    if (selected.some((entry) => contrast(entry.value, value) < gates.markOnPaper
      && hueGap(hueOf(value), hueOf(entry.row.value)) < 30)) return;
    selected.push({ row, value });
  };
  const pool = [...chromatic.filter((row) => contrast(row.value, surface) >= gates.markOnPaper)];
  while (selected.length < SERIES_SLOTS && pool.length) {
    let best = null;
    for (const row of pool) {
      const score = selected.length
        ? Math.min(...selected.map((entry) => hueGap(hueOf(row.value), hueOf(entry.row.value))))
        : 360 - row.order;
      if (!best || score > best.score) best = { row, score };
    }
    pool.splice(pool.indexOf(best.row), 1);
    admit(best.row);
  }
  for (const row of neutral) {
    if (selected.length < SERIES_SLOTS) admit(row);
  }
  return selected;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SKIN DERIVATION — tier one first, the rules above for what it leaves
// ─────────────────────────────────────────────────────────────────────────────

function tierOne(declared, skin, role) {
  const hit = declared[`${skin}:${role}`];
  return hit ? { value: hit.value, name: hit.name, token: hit.token, tier: 'declared' } : null;
}

// The four terminal layers are the darkest four rows a dark environment can be built from,
// ordered by luminance ascending: page darkest, then bar, then paper, then border.
function terminalLayers(rows, lightPaper) {
  const paperLuminance = contrast(lightPaper, '#000000');
  const usable = rows.filter((row) => (isBackground(row) || !isChromatic(row))
    && row.value.toLowerCase() !== lightPaper.toLowerCase()
    && contrast(row.value, '#000000') < paperLuminance);
  const distinct = [];
  for (const row of luminanceOrder(usable, false)) {
    if (!distinct.some((entry) => entry.value.toLowerCase() === row.value.toLowerCase())) distinct.push(row);
  }
  if (distinct.length < 4) return null;
  const [page, bar, paper, border] = distinct;
  return { page, bar, paper, border };
}

function deriveSkin(palette, skin, ctx) {
  const stock = palette.skins[skin].roles;
  const gates = ctx.gates;
  const rows = ctx.rows;
  const light = skin === 'light';
  const groundRole = palette.grounds[skin];
  const roles = {};
  const stockEntry = (role, note) => ({
    value: stock[role].value,
    name: `stock ${role}`,
    token: `token source ${skin}`,
    tier: 'stock',
    note: note || null,
  });
  const fillStock = () => {
    for (const role of Object.keys(stock)) roles[role] = roles[role] || stockEntry(role);
    return { skin, roles, seriesCapacity: 0 };
  };
  // A reference that does not qualify a terminal skin leaves every one of its roles stock: four
  // dark layers cannot be invented from a light-only table.
  if (skin === 'terminal' && !ctx.terminal) return fillStock();

  const declaredGround = tierOne(ctx.declared, skin, groundRole);
  let groundEntry;
  if (declaredGround) groundEntry = declaredGround;
  else if (skin === 'terminal') groundEntry = { ...ctx.terminal.paper, tier: 'ordered' };
  else {
    const row = chooseGround(rows, light);
    groundEntry = { value: row.value, name: row.name, token: row.token, tier: 'selected' };
  }
  const ground = groundEntry.value;
  roles[groundRole] = { role: groundRole, ...groundEntry, ratio: null };
  const put = (role, entry) => {
    roles[role] = { role, ...entry, ratio: HEX.test(entry.value) ? round2(contrast(entry.value, ground)) : null };
  };

  const declaredInk = tierOne(ctx.declared, skin, 'ink');
  if (declaredInk) put('ink', declaredInk);
  else {
    const row = chooseInk(rows, light);
    put('ink', { value: row.value, name: row.name, token: row.token, tier: 'selected' });
  }

  const optional = (role, derive) => {
    if (!Object.prototype.hasOwnProperty.call(stock, role)) return;
    const declared = tierOne(ctx.declared, skin, role);
    if (declared) put(role, declared);
    else derive();
  };

  optional('muted', () => {
    const picked = chooseMuted(rows, ground, gates.textOnPaper, roles.ink.value, { skin, stockInk: `stock ${skin} ink` });
    put('muted', { value: picked.value, name: picked.row.name, token: picked.row.token, tier: 'selected', adjusted: picked.adjusted, note: picked.note });
  });

  optional('accent', () => {
    const row = chooseAccent(rows, ground, gates, skin);
    put('accent', { value: row.value, name: row.name, token: row.token, tier: 'selected' });
  });

  optional('paper-2', () => {
    const row = choosePaper2(rows, ground);
    if (row) put('paper-2', { value: row.value, name: row.name, token: row.token, tier: 'selected' });
    else put('paper-2', { value: ground, name: `collapsed to ${groundRole}`, token: 'no second background row', tier: 'collapsed' });
  });

  optional('soft', () => {
    const picked = chooseSoft(rows, roles.muted.value, ground, !light);
    put('soft', { value: picked.value, name: picked.row.name, token: picked.row.token, tier: 'selected', adjusted: picked.adjusted, note: picked.note });
  });

  optional('rule', () => put('rule', {
    value: rgbaValue(roles.ink.value, RULE_ALPHA),
    name: `derived from ink at ${RULE_ALPHA}`,
    token: 'composed, not selected',
    tier: 'derived',
  }));
  optional('rule-solid', () => put('rule-solid', {
    value: rgbaValue(roles.muted.value, RULE_SOLID_ALPHA),
    name: `derived from muted at ${RULE_SOLID_ALPHA}`,
    token: 'composed, not selected',
    tier: 'derived',
  }));
  optional('accent-tint', () => put('accent-tint', {
    value: rgbaValue(roles.accent.value, ACCENT_TINT_ALPHA[skin]),
    name: `derived from accent at ${ACCENT_TINT_ALPHA[skin]}`,
    token: 'composed, not selected',
    tier: 'derived',
  }));

  optional('link', () => {
    const picked = chooseLink(rows, ground, roles.accent.value, gates);
    if (picked.value) put('link', { value: picked.value, name: picked.row.name, token: picked.row.token, tier: 'selected' });
    else put('link', stockEntry('link', picked.note));
  });

  optional('backend-fill', () => {
    const row = chooseBackendFill(rows, ground);
    if (row) put('backend-fill', { value: row.value, name: row.name, token: row.token, tier: 'selected' });
    else put('backend-fill', { value: ground, name: `collapsed to ${groundRole}`, token: 'no lighter background row', tier: 'collapsed' });
  });

  optional('high-level-chevron', () => put('high-level-chevron', {
    value: roles.ink.value,
    name: 'aliased to ink',
    token: 'no gate of its own',
    tier: 'aliased',
  }));

  if (skin === 'terminal') {
    for (const role of ['page', 'bar', 'border']) {
      optional(role, () => put(role, { ...ctx.terminal[role], tier: 'ordered' }));
    }
  }

  const seriesRoles = Object.keys(stock).filter((role) => /^series-\d+$/.test(role));
  let seriesCapacity = 0;
  if (seriesRoles.length) {
    const selected = chooseSeries(rows, ground, roles.ink.value, gates);
    seriesRoles.forEach((role, index) => {
      const declared = tierOne(ctx.declared, skin, role);
      if (declared) {
        put(role, declared);
        seriesCapacity += 1;
      } else if (selected[index] && !roles[role]) {
        put(role, { value: selected[index].value, name: selected[index].row.name, token: selected[index].row.token, tier: 'selected' });
        seriesCapacity += 1;
      }
    });
  }

  for (const role of Object.keys(stock)) {
    if (!roles[role]) roles[role] = stockEntry(role);
  }
  return { skin, roles, seriesCapacity };
}

function deriveReference(input) {
  const palette = JSON.parse(readText(PALETTE_SOURCE, 'token source'));
  if (!palette.skins || !palette.grounds || !palette.gates) fail('token source is missing skins, grounds, or gates');
  const design = readText(input.designPath, 'DESIGN.md');
  const rows = parseColors(design);
  if (rows.length < 4) fail('Tokens — Colors has fewer than four usable six-digit colour rows');
  const declared = parseColorDeclarations(design, palette);
  const typography = parseTypography(design);
  const radius = parseRadius(design);
  const tokens = readTokensBeside(input.designPath);
  const declaredDark = themeIsDeclaredDark(design, tokens);
  const gates = palette.gates;

  const lightPaper = (tierOne(declared, 'light', 'paper') || { value: chooseGround(rows, true).value }).value;
  const terminal = declaredDark ? terminalLayers(rows, lightPaper) : null;
  const terminalNote = terminal ? null
    : 'the terminal skin stays stock: the reference declares '
      + (declaredDark
        ? 'dark support but supplies fewer than four distinct neutral rows darker than its light paper'
        : 'no dark environment');

  const ctx = { rows, declared, gates, terminal };
  const skins = {};
  for (const skin of SKINS) skins[skin] = deriveSkin(palette, skin, ctx);
  return { palette, rows, typography, radius, declaredDark, skins, terminal: Boolean(terminal), terminalNote };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GATES
// ─────────────────────────────────────────────────────────────────────────────

// The value that would just clear a failing gate: walk every channel together, one 1/255 step at
// a time, in whichever direction moves the colour away from the ground.
function clearingValue(value, against, threshold) {
  const base = [1, 3, 5].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
  const shade = (delta) => `#${base.map((c) => Math.max(0, Math.min(255, c + delta)).toString(16).padStart(2, '0')).join('')}`;
  const step = contrast(shade(-1), against) >= contrast(shade(1), against) ? -1 : 1;
  for (let distance = 1; distance <= 255; distance += 1) {
    if (contrast(shade(step * distance), against) >= threshold) return shade(step * distance);
  }
  return null;
}

// A token under its gate is a recorded departure or it does not ship; the departure is honoured
// only when the skin, the role and the measured ratio all agree, the same rule the corpus checker
// applies to a stock block.
function validateRoles(derived, skin, used, label) {
  const { palette } = derived;
  const gates = palette.gates;
  const skinRoles = derived.skins[skin].roles;
  const groundRole = palette.grounds[skin];
  const ground = skinRoles[groundRole].value;
  const failures = [];
  const notes = [];
  const check = (role, value, gateName, threshold, against) => {
    const ratio = round2(contrast(value, against));
    if (ratio >= threshold) return;
    const departure = (palette.departures || []).find((entry) => entry.skin === skin
      && entry.role === role && round2(Number(entry.measured)) === ratio);
    if (departure) {
      notes.push(`DEPARTURE ${skin} ${role} ${ratio}:1 below ${gateName} ${threshold}: ${departure.why}`);
      return;
    }
    failures.push({
      role,
      ratio,
      gate: gateName,
      threshold,
      clearing: clearingValue(value, against, threshold),
      against,
      message: `${label} ${skin} ${role}`,
    });
  };
  for (const role of used) {
    const entry = skinRoles[role];
    if (!entry) continue;
    const value = entry.value;
    if (!HEX.test(value) || role === groundRole || STRUCTURE_ROLE.test(role)) continue;
    if (gates.ungated.includes(role) || STRUCTURE_BY_SKIN[skin].includes(role)) continue;
    const isTextRole = TEXT_ROLES.has(role);
    check(role, value, isTextRole ? 'textOnPaper' : 'markOnPaper',
      isTextRole ? gates.textOnPaper : gates.markOnPaper, ground);
    if (role === 'accent' && skinRoles.ink) check(role, value, 'accentAgainstInk', gates.accentAgainstInk, skinRoles.ink.value);
  }
  return { failures, notes };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RENDERING
// ─────────────────────────────────────────────────────────────────────────────

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function provenancePath(given) {
  const absolute = path.resolve(given);
  const relative = path.relative(REPO_ROOT, absolute);
  return relative && !relative.startsWith('..') ? relative.split(path.sep).join('/') : given;
}

// Rewrite the values inside the one palette block, preserving every other byte of the line:
// indentation, role name, spacing before the value, and any trailing comment.
function substituteBlock(source, skin, roles) {
  const begins = source.match(new RegExp(BEGIN.source, 'g')) || [];
  const ends = source.match(new RegExp(END.source, 'g')) || [];
  if (begins.length !== 1 || ends.length !== 1) {
    fail(`palette block must appear exactly once (${begins.length} begin, ${ends.length} end markers)`);
  }
  const start = BEGIN.exec(source);
  const endIndex = source.search(END);
  if (!start || endIndex < start.index) fail('palette block markers are out of order');
  let changed = false;
  const used = [];
  const bodyStart = start.index + start[0].length;
  const lines = source.slice(bodyStart, endIndex).split('\n').map((line) => {
    const match = DECL.exec(line);
    if (!match) return line;
    const [, prefix, role, current, tail] = match;
    const entry = roles[role];
    if (!entry) fail(`the ${skin} skin has no ${role} role in the token source`);
    if (!used.includes(role)) used.push(role);
    if (entry.value !== current) changed = true;
    return prefix + entry.value + tail;
  });
  return {
    output: source.slice(0, bodyStart) + lines.join('\n') + source.slice(endIndex),
    changed,
    used,
  };
}

function literalMapFor(palette, skin, derivedRoles) {
  const map = new Map();
  for (const [role, entry] of Object.entries(palette.skins[skin].roles)) {
    if (!COLOR_VALUE.test(entry.value)) continue;
    const key = entry.value.toLowerCase();
    if (map.has(key)) continue;
    map.set(key, { role, value: derivedRoles[role] ? derivedRoles[role].value : entry.value });
  }
  return map;
}

// The corpus keeps some roles as plain literals outside the sentinel block, so a block-only
// substitution would leave those marks stock. A literal the stock skin does not carry is refused
// rather than guessed: a value with no role behind it is not one this script may repaint.
function remapLiterals(text, map, label, skin) {
  const keys = [...map.keys()].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(keys.map(escapeRegExp).join('|'), 'gi');
  const used = [];
  const output = text.replace(pattern, (literal) => {
    const hit = map.get(literal.toLowerCase());
    if (!hit || hit.value.toLowerCase() === literal.toLowerCase()) return literal;
    if (!used.includes(hit.role)) used.push(hit.role);
    return hit.value;
  });
  for (const literal of text.match(HEX_LITERAL) || []) {
    if (!map.has(literal.toLowerCase())) fail(`${label} uses ${literal}, which maps to no ${skin} role in the token source`);
  }
  return { output, used };
}

function renderForm(source, skin, derived, label, pathGiven, hash) {
  const roles = derived.skins[skin].roles;
  const map = literalMapFor(derived.palette, skin, roles);
  const marker = BEGIN.exec(source);
  // A worked form has no palette block; it keeps every colour as a bare literal, so the whole
  // file is mapped role by role. A starter carries the block a copy is drawn on, and only what
  // sits outside the block is literal-mapped, so a value the block just painted is never read
  // back as a stock literal and mapped a second time.
  if (!marker) {
    const mapped = remapLiterals(source, map, label, skin);
    return { output: mapped.output, used: mapped.used };
  }
  if (marker[2]) fail(`${label} was already themed (${marker[2].trim()}); theme the stock form instead`);
  const block = substituteBlock(source, skin, roles);
  let output = block.output;
  // A block that already carries what the reference derives has nothing to vouch for: provenance
  // says where a value came from, and those values are the file's own. The extended marker and
  // its comment are written when, and only when, the reference actually repaints the block.
  if (block.changed) {
    const start = BEGIN.exec(output);
    const lineStart = output.lastIndexOf('\n', start.index) + 1;
    const indent = output.slice(lineStart, start.index);
    const markerText = `/* DIAGRAM_PALETTE:BEGIN skin=${skin} system=design-md */`;
    const provenance = `${indent}/* DESIGN.md provenance: path=${provenancePath(pathGiven)} `
      + `sha256=${hash} generator=${VERSION} */`;
    output = `${output.slice(0, lineStart)}${indent}${markerText}\n${provenance}`
      + `${output.slice(start.index + start[0].length)}`;
  }
  const bodyStart = BEGIN.exec(output);
  const bodyEnd = output.search(END);
  const head = remapLiterals(output.slice(0, bodyStart.index + bodyStart[0].length), map, label, skin);
  const tail = remapLiterals(output.slice(bodyEnd), map, label, skin);
  const used = [...new Set([...block.used, ...head.used, ...tail.used])];
  return {
    output: head.output + output.slice(bodyStart.index + bodyStart[0].length, bodyEnd) + tail.output,
    used,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CLI
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = { forms: null, all: false, out: null };
  if (!argv.length) fail('a local DESIGN.md path or --default is required');
  if (isUrl(argv[0])) fail(`URL arguments are not allowed: ${argv[0]}`);
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

function formNames(options) {
  const names = options.all
    ? fs.readdirSync(FORM_DIR).filter((file) => file.endsWith('.html')).map((file) => file.slice(0, -5)).sort()
    : options.forms;
  if (!names.length) fail('no diagram forms were selected');
  const unique = [...new Set(names)];
  unique.forEach((form) => {
    if (!/^[a-z0-9-]+$/.test(form)) fail(`form is not lower-case kebab: ${form}`);
    readText(path.join(FORM_DIR, `${form}.html`), 'diagram form');
  });
  return unique;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAPPING OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function mappingLines(derived, skin) {
  const roles = derived.skins[skin].roles;
  return Object.keys(roles).map((role) => {
    const entry = roles[role];
    const ratio = entry.ratio === null || entry.ratio === undefined ? 'n/a' : `${entry.ratio}:1`;
    const adjusted = entry.adjusted ? ` adjusted to ${entry.value} to clear the text gate` : '';
    const note = entry.note ? ` — ${entry.note}` : '';
    return `MAPPING ${skin} ${role}: ${entry.name} (${entry.token}) ratio=${ratio}${adjusted}${note}`;
  });
}

function failureLine(failure) {
  return `FAILURE ${failure.message} ratio=${failure.ratio}:1 gate=${failure.gate} ${failure.threshold}:1 `
    + `against ${failure.against}: nearest clearing value ${failure.clearing || 'none'}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. RUN
// ─────────────────────────────────────────────────────────────────────────────

function run(argv) {
  const options = parseArgs(argv);
  let derived;
  try {
    derived = deriveReference({ designPath: options.designPath });
  } catch (error) {
    if (!error.failure) throw error;
    return {
      ok: false,
      lines: [
        `DESIGN.md: ${options.designPath}`,
        `FAILURE ${error.failure.role} ratio=${round2(error.failure.ratio)}:1 gate=${error.failure.gate} `
          + `${error.failure.threshold}:1 against ${error.failure.against}: nearest clearing value ${error.failure.nearest}`,
        'RESULT: FAILED',
      ],
    };
  }
  const hash = crypto.createHash('sha256').update(readText(options.designPath, 'DESIGN.md')).digest('hex');
  const forms = formNames(options);
  const lines = [
    `DESIGN.md: ${options.designPath}`,
    `generator: ${VERSION}`,
    `themes: light=${derived.skins.light.roles.paper.value} dark=${derived.skins.dark.roles.paper.value} `
      + `terminal=${derived.terminal ? derived.skins.terminal.roles.paper.value : 'stock'}`
      + `${derived.declaredDark ? ' (declared)' : ''}`,
    ...SKINS.flatMap((skin) => mappingLines(derived, skin)),
  ];
  if (derived.terminalNote) lines.push(`NOTE ${derived.terminalNote}`);

  const outputs = new Map();
  const failures = [];
  const notes = [];
  for (const form of forms) {
    const source = readText(path.join(FORM_DIR, `${form}.html`), 'diagram form');
    const marker = BEGIN.exec(source);
    const formsConfig = derived.palette.forms || {};
    const skin = marker
      ? marker[1]
      : (formsConfig.skinByFile || {})[`${form}.html`] || formsConfig.defaultSkin;
    if (!skin || !SKINS.includes(skin)) fail(`${form}.html has no valid skin marker and the token source names no skin for it`);
    // A form that draws a categorical set needs every slot; a table that cannot fill five is a
    // shortfall of that form alone, so a named request is refused and a corpus run skips it.
    const declaredSeries = [...source.matchAll(/--color-(series-\d+)\s*:/g)].map((match) => match[1]);
    if (declaredSeries.length && derived.skins[skin].seriesCapacity < SERIES_SLOTS) {
      const message = `${form} declares ${declaredSeries.join(', ')}, and the reference fills only `
        + `${derived.skins[skin].seriesCapacity} of ${SERIES_SLOTS} series slots`;
      if (!options.all) fail(message);
      lines.push(`NOTE ${form} skipped: ${message}`);
      continue;
    }
    if (skin === 'terminal' && !derived.terminal) {
      const message = `${form} is terminal-skinned and the reference does not qualify a terminal skin`;
      if (!options.all) fail(`${message}; theme it from a reference that declares a dark environment`);
      lines.push(`NOTE ${message}; its stock bytes are written unchanged`);
    }
    const rendered = renderForm(source, skin, derived, `${form}.html`, options.designPath, hash);
    const gated = validateRoles(derived, skin, rendered.used, form);
    notes.push(...gated.notes);
    failures.push(...gated.failures);
    outputs.set(form, rendered.output);
  }

  lines.push(...new Set(notes));
  if (failures.length) {
    failures.forEach((failure) => lines.push(failureLine(failure)));
    lines.push('RESULT: FAILED');
    return { ok: false, lines };
  }

  const outDir = path.resolve(options.out);
  if (outDir === FORM_DIR || outDir.startsWith(FORM_DIR + path.sep)) {
    fail('refusing to write inside assets/diagrams; the stock forms are immutable');
  }
  fs.mkdirSync(outDir, { recursive: true });
  for (const [form, output] of outputs) {
    fs.writeFileSync(path.join(outDir, `${form}.html`), output, 'utf8');
    lines.push(`WROTE ${path.join(options.out, `${form}.html`)}`);
  }
  // The out directory mirrors the source set, so files that are not forms travel unchanged.
  for (const name of fs.readdirSync(FORM_DIR).filter((entry) => !entry.endsWith('.html'))) {
    const extra = path.join(FORM_DIR, name);
    if (fs.statSync(extra).isFile()) {
      fs.copyFileSync(extra, path.join(outDir, name));
      lines.push(`WROTE ${path.join(options.out, name)}`);
    }
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
  parseColorDeclarations,
  parseTypography,
  parseRadius,
  chooseSeries,
  deriveReference,
  validateRoles,
  renderForm,
  run,
};
