import assert from 'node:assert/strict';

const BANNED = new Set([
  '#4e4e4e',
  '#666666',
  '#777777',
  '#787878',
  '#8591b3',
  '#acb3c9',
  '#cbd0dc',
]);

const clamp = (n, lo = 0, hi = 255) => Math.min(hi, Math.max(lo, n));
const channel = (n) => Math.round(clamp(Number(n)));
const hex = (n) => channel(n).toString(16).padStart(2, '0');
const toHex = ({ r, g, b }) => `#${hex(r)}${hex(g)}${hex(b)}`;

function parsePart(s, scale = 255) {
  const v = String(s).trim();
  if (v.endsWith('%')) return clamp((Number.parseFloat(v) / 100) * scale, 0, scale);
  return clamp(Number.parseFloat(v), 0, scale);
}

function parseAlpha(s) {
  if (s == null || s === '') return 1;
  const v = String(s).trim();
  if (v.endsWith('%')) return clamp(Number.parseFloat(v) / 100, 0, 1);
  return clamp(Number.parseFloat(v), 0, 1);
}

function rawColor(str) {
  if (str && typeof str === 'object') {
    return { r: channel(str.r), g: channel(str.g), b: channel(str.b), a: parseAlpha(str.a ?? 1) };
  }

  const s = String(str ?? '').trim().toLowerCase();
  if (!s) throw new TypeError('empty color');
  if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

  let m = s.match(/^#([0-9a-f]{3})$/i);
  if (m) {
    const [r, g, b] = [...m[1]].map((c) => Number.parseInt(c + c, 16));
    return { r, g, b, a: 1 };
  }

  m = s.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = Number.parseInt(m[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }

  m = s.match(/^rgba?\((.*)\)$/i);
  if (m) {
    const body = m[1].trim();
    const parts = body.includes(',')
      ? body.split(',').map((p) => p.trim())
      : body.replace('/', ' / ').split(/\s+/).filter(Boolean);
    const slash = parts.indexOf('/');
    const alpha = slash >= 0 ? parts[slash + 1] : parts[3];
    const rgb = slash >= 0 ? parts.slice(0, slash) : parts.slice(0, 3);
    if (rgb.length < 3) throw new TypeError(`invalid color: ${str}`);
    return { r: parsePart(rgb[0]), g: parsePart(rgb[1]), b: parsePart(rgb[2]), a: parseAlpha(alpha) };
  }

  throw new TypeError(`unsupported color: ${str}`);
}

function composite(fg, bg) {
  const a = parseAlpha(fg.a);
  return {
    r: channel(fg.r * a + bg.r * (1 - a)),
    g: channel(fg.g * a + bg.g * (1 - a)),
    b: channel(fg.b * a + bg.b * (1 - a)),
  };
}

function numericFontWeight(fontWeight) {
  const raw = String(fontWeight ?? '').trim().toLowerCase();
  if (raw === 'bold') return 700;
  if (raw === 'normal') return 400;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

function isLargeText({ fontSize = 0, fontWeight = 400 }) {
  const size = Number.parseFloat(fontSize) || 0;
  const weight = numericFontWeight(fontWeight);
  return size >= 18 || (size >= 14 && weight >= 700);
}

export function normalizeColor(str, bg = '#ffffff') {
  const c = rawColor(str);
  if (c.a >= 1) return { r: channel(c.r), g: channel(c.g), b: channel(c.b) };
  return composite(c, normalizeColor(bg));
}

export function relLuminance(rgb) {
  const c = typeof rgb === 'string' ? normalizeColor(rgb) : normalizeColor(rgb);
  const linear = [c.r, c.g, c.b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function contrastRatio(hexOrRgbA, hexOrRgbB) {
  const bg = normalizeColor(hexOrRgbB);
  const fg = normalizeColor(hexOrRgbA, bg);
  const a = relLuminance(fg);
  const b = relLuminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function isBannedGray(colorStr) {
  try {
    return BANNED.has(toHex(normalizeColor(colorStr)).toLowerCase());
  } catch {
    return false;
  }
}

export function judgeText({ color, bg, usage = 'text', fontSize = 0, fontWeight = 400 }) {
  let token = String(color ?? '');
  let on = String(bg ?? '');
  let ratio = 0;

  try {
    token = toHex(normalizeColor(color, bg)).toLowerCase();
    on = toHex(normalizeColor(bg)).toLowerCase();
    ratio = Number(contrastRatio(color, bg).toFixed(2));
  } catch {
    return { pass: usage !== 'text', ratio, token, on, usage };
  }

  if (usage !== 'text') return { pass: true, ratio, token, on, usage };

  const threshold = isLargeText({ fontSize, fontWeight }) ? 3 : 4.5;
  return { pass: ratio >= threshold, ratio, token, on, usage };
}

if (process.argv[1] && process.argv[1].endsWith('contrast.mjs') && process.argv[2] === '--selftest') {
  const fail = judgeText({ color: '#4e4e4e', bg: '#043367', usage: 'text' });
  assert.equal(fail.pass, false);
  assert.ok(fail.ratio > 1.4 && fail.ratio < 1.7);

  const stroke = judgeText({ color: '#8591b3', bg: '#043367', usage: 'stroke' });
  assert.equal(stroke.pass, true);

  const grayOnWhite = judgeText({ color: '#4e4e4e', bg: '#ffffff', usage: 'text' });
  assert.equal(grayOnWhite.pass, true);

  const largeMid = judgeText({ color: '#ffffff', bg: '#8591b3', usage: 'text', fontSize: 18, fontWeight: 400 });
  assert.equal(largeMid.pass, true);
  assert.ok(largeMid.ratio >= 3 && largeMid.ratio < 3.3);

  const smallMid = judgeText({ color: '#ffffff', bg: '#8591b3', usage: 'text', fontSize: 16, fontWeight: 400 });
  assert.equal(smallMid.pass, false);
  assert.equal(smallMid.ratio, largeMid.ratio);

  const pass = judgeText({ color: '#0a1a2f', bg: '#ffffff', usage: 'text' });
  assert.equal(pass.pass, true);

  console.log('OK');
}
