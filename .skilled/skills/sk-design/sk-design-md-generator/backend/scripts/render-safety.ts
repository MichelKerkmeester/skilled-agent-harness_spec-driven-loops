// ────────────────────────────────────────────────────────────────
// MODULE: Render Safety (CSS-value sanitizers for generated HTML)
// ────────────────────────────────────────────────────────────────
//
// report-gen.ts and preview-gen.ts interpolate CSS values extracted from a
// (possibly untrusted) live site directly into inline style="..." attributes.
// HTML-escaping alone (&<>") stops attribute/tag breakout but does NOT stop
// same-attribute CSS-declaration injection via `;`/`{`/`}` — a crafted value
// like `red; } * { display:none } /*` stays dangerous even fully
// HTML-escaped, because those characters are meaningful CSS syntax, not HTML
// syntax. Each helper here validates the value SHAPE for its CSS property
// (allowlist, not blocklist) and falls back to an inert default when the
// value doesn't match, rather than ever interpolating an unvalidated string
// into a style context.

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;
const FUNCTIONAL_COLOR = /^(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\([^()]*\)$/i;
const NAMED_COLOR = /^[a-zA-Z]+$/;
const LENGTH = /^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|ch|ex|cm|mm|in|pt|pc|q)?$/;
const LINE_HEIGHT = /^(normal|-?\d+(\.\d+)?(px|rem|em|%)?)$/;
const FONT_WEIGHT = /^(normal|bold|bolder|lighter|[1-9]00)$/;
const SAFE_FONT_FAMILY = /^[a-zA-Z0-9 ,'"-]+$/;

function isSafeColor(value: string): boolean {
  const v = value.trim();
  return HEX_COLOR.test(v) || FUNCTIONAL_COLOR.test(v) || NAMED_COLOR.test(v);
}

export function safeColor(value: string | undefined | null, fallback = 'transparent'): string {
  if (!value) return fallback;
  return isSafeColor(value) ? value.trim() : fallback;
}

export function safeLength(value: string | undefined | null, fallback = '0'): string {
  if (!value) return fallback;
  const v = value.trim();
  return LENGTH.test(v) ? v : fallback;
}

export function safeLineHeight(value: string | undefined | null, fallback = 'normal'): string {
  if (!value) return fallback;
  const v = value.trim();
  return LINE_HEIGHT.test(v) ? v : fallback;
}

export function safeFontWeight(value: string | undefined | null, fallback = '400'): string {
  if (!value) return fallback;
  const v = value.trim();
  return FONT_WEIGHT.test(v) ? v : fallback;
}

export function safeFontFamily(value: string | undefined | null, fallback = 'system-ui'): string {
  if (!value) return fallback;
  const v = value.trim();
  return v.length > 0 && v.length <= 200 && SAFE_FONT_FAMILY.test(v) ? v : fallback;
}

// Splits a CSS value list on top-level commas only, treating commas inside
// parentheses (e.g. the ones inside `rgba(0,0,0,0.08)`) as part of the
// enclosing function call rather than a group separator. A naive
// `value.split(',')` here would shatter `rgba(0,0,0,0.08)` into four bogus
// fragments — the same bug class this module exists to close in css-analyzer.
function splitTopLevel(value: string): string[] {
  const groups: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of value) {
    if (char === '(') depth++;
    else if (char === ')') depth = Math.max(0, depth - 1);
    if (char === ',' && depth === 0) {
      groups.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  groups.push(current);
  return groups;
}

// box-shadow / text-shadow values are a comma-separated list of
// "<length> <length> <length>? <length>? <color>?" groups with an optional
// "inset" keyword. Validate every space-separated token individually rather
// than the whole string, since one malformed token is enough to break out.
function shadowTokenOk(token: string): boolean {
  return token === 'inset' || LENGTH.test(token) || isSafeColor(token);
}

export function safeShadow(value: string | undefined | null, fallback = 'none'): string {
  if (!value) return fallback;
  const groups = splitTopLevel(value).map((g) => g.trim());
  const allOk = groups.length > 0 && groups.every((group) => {
    const tokens = group.split(/\s+/).filter(Boolean);
    return tokens.length > 0 && tokens.every(shadowTokenOk);
  });
  return allOk ? value.trim() : fallback;
}
