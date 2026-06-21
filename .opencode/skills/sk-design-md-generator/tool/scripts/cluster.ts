// @ts-expect-error culori has no bundled declarations in this setup
import * as culori from 'culori';
import type {
  CSSVariable,
  ColorToken,
  ComponentGroup,
  ComponentVariant,
  DesignTokens,
  DOMCollection,
  ElementStyle,
  GradientInfo,
  CSSAnalysis,
  InteractionData,
  InteractionCapture,
  MediaBreakpoint,
  RadiusToken,
  ShadowToken,
  StabilityClassification,
  TypographyLevel,
} from './types';

// ─── Input Interface ─────────────────────────────────────────────────────────

interface PageExtraction {
  url: string;
  dom: DOMCollection;
  css?: CSSAnalysis;
  interactions?: InteractionData;
}

// ─── Named Color Map ─────────────────────────────────────────────────────────

const NAMED_COLORS: Record<string, [number, number, number, number]> = {
  white:       [255, 255, 255, 1],
  black:       [0,   0,   0,   1],
  red:         [255, 0,   0,   1],
  blue:        [0,   0,   255, 1],
  green:       [0,   128, 0,   1],
  yellow:      [255, 255, 0,   1],
  orange:      [255, 165, 0,   1],
  purple:      [128, 0,   128, 1],
  gray:        [128, 128, 128, 1],
  grey:        [128, 128, 128, 1],
  transparent: [0,   0,   0,   0],
};

// ─── Color Parsing Helpers ───────────────────────────────────────────────────

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function parseColor(value: string): RGBA | null {
  if (!value || value === 'none' || value === 'currentcolor' || value === 'currentColor' || value === 'inherit') {
    return null;
  }

  const trimmed = value.trim().toLowerCase();

  if (trimmed === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  if (NAMED_COLORS[trimmed]) {
    const [r, g, b, a] = NAMED_COLORS[trimmed];
    return { r, g, b, a };
  }

  // #hex: 3, 4, 6, or 8 digits
  const hexMatch = trimmed.match(/^#([0-9a-f]{3,8})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 4) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: parseInt(hex[3] + hex[3], 16) / 255,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: parseInt(hex.slice(6, 8), 16) / 255,
      };
    }
  }

  // rgb()/rgba()
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*(?:[,/]\s*(\d+(?:\.\d+)?%?))?\s*\)$/,
  );
  if (rgbMatch) {
    let alpha = 1;
    if (rgbMatch[4] !== undefined) {
      alpha = rgbMatch[4].endsWith('%')
        ? parseFloat(rgbMatch[4]) / 100
        : parseFloat(rgbMatch[4]);
    }
    return {
      r: Math.round(clampByte(parseFloat(rgbMatch[1]))),
      g: Math.round(clampByte(parseFloat(rgbMatch[2]))),
      b: Math.round(clampByte(parseFloat(rgbMatch[3]))),
      a: clamp01(alpha),
    };
  }

  // hsl()/hsla()
  const hslMatch = trimmed.match(
    /^hsla?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)%\s*[,\s]\s*(\d+(?:\.\d+)?)%\s*(?:[,/]\s*(\d+(?:\.\d+)?%?))?\s*\)$/,
  );
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]) / 100;
    const l = parseFloat(hslMatch[3]) / 100;
    let alpha = 1;
    if (hslMatch[4] !== undefined) {
      alpha = hslMatch[4].endsWith('%')
        ? parseFloat(hslMatch[4]) / 100
        : parseFloat(hslMatch[4]);
    }
    const rgb = hslToRgb(h, s, l);
    return { r: rgb.r, g: rgb.g, b: rgb.b, a: clamp01(alpha) };
  }

  // Fallback: try culori
  try {
    const parsed = culori.parse(trimmed);
    if (parsed) {
      const rgb = culori.converter('rgb')(parsed);
      return {
        r: Math.round(clampByte((rgb.r ?? 0) * 255)),
        g: Math.round(clampByte((rgb.g ?? 0) * 255)),
        b: Math.round(clampByte((rgb.b ?? 0) * 255)),
        a: clamp01(rgb.alpha ?? 1),
      };
    }
  } catch {
    // ignore parse failures
  }

  return null;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function clampByte(v: number): number {
  return Math.max(0, Math.min(255, v));
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

export function rgbaToHex(r: number, g: number, b: number, _a?: number): string {
  const toHex = (n: number) => Math.round(clampByte(n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbaKey(c: RGBA): string {
  return `${c.r},${c.g},${c.b},${Math.round(c.a * 1000)}`;
}

// ─── Shadow & Gradient Parsers ───────────────────────────────────────────────

function extractShadowColors(boxShadow: string): string[] {
  if (!boxShadow || boxShadow === 'none') return [];
  const colors: string[] = [];
  // Match rgb/rgba/hsl/hsla/hex colors within the shadow value
  const colorPatterns = [
    /rgba?\([^)]+\)/g,
    /hsla?\([^)]+\)/g,
    /#[0-9a-fA-F]{3,8}\b/g,
  ];
  for (const pattern of colorPatterns) {
    const matches = boxShadow.match(pattern);
    if (matches) colors.push(...matches);
  }
  return colors;
}

function extractGradientColors(gradient: string): string[] {
  if (!gradient) return [];
  const colors: string[] = [];
  const colorPatterns = [
    /rgba?\([^)]+\)/g,
    /hsla?\([^)]+\)/g,
    /#[0-9a-fA-F]{3,8}\b/g,
  ];
  for (const pattern of colorPatterns) {
    const matches = gradient.match(pattern);
    if (matches) colors.push(...matches);
  }
  // Also check for named colors in gradient stops
  const namedPattern = /\b(white|black|red|blue|green|yellow|orange|purple|gray|grey|transparent)\b/gi;
  const namedMatches = gradient.match(namedPattern);
  if (namedMatches) colors.push(...namedMatches);
  return colors;
}

// ─── WCAG Contrast ───────────────────────────────────────────────────────────

function relativeLuminance(r: number, g: number, b: number): number {
  const srgb = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function wcagContrast(hex1: string, hex2: string): number {
  const c1 = parseColor(hex1);
  const c2 = parseColor(hex2);
  if (!c1 || !c2) return 1;
  const l1 = relativeLuminance(c1.r, c1.g, c1.b);
  const l2 = relativeLuminance(c2.r, c2.g, c2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Math Helpers ────────────────────────────────────────────────────────────

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function mode<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  const freq = new Map<string, { value: T; count: number }>();
  for (const v of arr) {
    const key = String(v);
    const entry = freq.get(key);
    if (entry) {
      entry.count++;
    } else {
      freq.set(key, { value: v, count: 1 });
    }
  }
  let best: { value: T; count: number } | undefined;
  for (const entry of freq.values()) {
    if (!best || entry.count > best.count) best = entry;
  }
  return best?.value;
}

export function parsePxValue(val: string): number | null {
  if (!val || val === 'auto' || val === 'none' || val === 'normal') return null;
  const num = parseFloat(val);
  if (isNaN(num)) return null;
  if (val.endsWith('rem')) return num * 16;
  if (val.endsWith('em')) return num * 16;
  // px or unitless
  return num;
}

// ─── Usage Context Type ──────────────────────────────────────────────────────

type UsageContext = 'textColor' | 'bgColor' | 'borderColor' | 'shadowColor' | 'gradientColor' | 'iconColor';

interface ColorEntry {
  rgba: RGBA;
  hex: string;
  frequency: number;
  usedAs: Record<UsageContext, number>;
  pages: Set<string>;
  cssVariableNames: Set<string>;
}

// ─── Exported Utilities (for testing) ────────────────────────────────────────

export interface OKLCH {
  l: number;
  c: number;
  h: number;
}

/** Euclidean distance in OKLCH space, scaled ×100 */
export function deltaE(a: OKLCH, b: OKLCH): number {
  const dl = (a.l - b.l) * 100;
  const dc = (a.c - b.c) * 100;
  const dhRad = ((a.h - b.h) * Math.PI) / 180;
  const dh = 2 * Math.sqrt(a.c * b.c) * Math.sin(dhRad / 2) * 100;
  return Math.sqrt(dl * dl + dc * dc + dh * dh);
}

/** Split box-shadow into layers, respecting commas inside rgba()/hsla() */
export function splitShadowLayers(value: string): string[] {
  const layers: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '(') depth++;
    else if (value[i] === ')') depth--;
    else if (value[i] === ',' && depth === 0) {
      layers.push(value.slice(start, i).trim());
      start = i + 1;
    }
  }
  layers.push(value.slice(start).trim());
  return layers.filter((l) => l.length > 0);
}

/** Classify a CSS box-shadow string by type */
export function classifyShadow(value: string): 'border-shadow' | 'ring' | 'elevation' | 'inset' | 'complex-stack' {
  const parts = splitShadowLayers(value);
  if (parts.length > 1) return 'complex-stack';
  if (value.includes('inset')) return 'inset';

  const cleaned = value
    .replace(/rgba?\([^)]+\)/g, '')
    .replace(/hsla?\([^)]+\)/g, '')
    .replace(/#[0-9a-fA-F]{3,8}/g, '')
    .trim();

  const nums = cleaned.match(/-?\d+(\.\d+)?(px)?/g)?.map((n) => parseFloat(n)) ?? [];
  const offsetX = nums[0] ?? 0;
  const offsetY = nums[1] ?? 0;
  const blur = nums[2] ?? 0;
  const spread = nums[3] ?? 0;

  if (offsetX === 0 && offsetY === 0 && blur === 0 && spread > 0) return 'border-shadow';
  if (offsetX === 0 && offsetY === 0 && blur === 0 && spread !== 0) return 'ring';
  if (offsetY > 0 && blur > 0) return 'elevation';

  return 'elevation';
}

// ─── Stability Classification ───────────────────────────────────────────────

function classifyColorStability(color: ColorToken, _totalPages: number): StabilityClassification {
  const signals: string[] = [];
  let score = 0;

  // Signal 1: Page coverage
  if (color.pagesCoverage >= 0.8) { score += 30; signals.push(`pages: ${(color.pagesCoverage * 100).toFixed(0)}%`); }
  else if (color.pagesCoverage >= 0.5) { score += 20; signals.push(`pages: ${(color.pagesCoverage * 100).toFixed(0)}%`); }
  else if (color.pagesCoverage < 0.2) { score -= 20; signals.push('single-page'); }

  // Signal 2: Usage dimensions
  const usedDimensions = Object.entries(color.usedAs).filter(([, v]) => v > 0).length;
  if (color.usedAs.textColor > 0 || color.usedAs.borderColor > 0) { score += 25; signals.push('text/border usage'); }
  if (usedDimensions >= 3) { score += 15; signals.push(`${usedDimensions} usage dimensions`); }
  if (usedDimensions === 1 && (color.usedAs.bgColor > 0 || color.usedAs.gradientColor > 0)) { score -= 15; signals.push('bg/gradient only'); }

  // Signal 3: CSS variable presence
  if (color.cssVariableNames.length > 0) { score += 20; signals.push(`css-var: ${color.cssVariableNames[0]}`); }

  // Signal 4: Frequency
  if (color.frequency >= 500) { score += 20; signals.push(`freq: ${color.frequency}`); }
  else if (color.frequency >= 50) { score += 10; signals.push(`freq: ${color.frequency}`); }
  else if (color.frequency <= 5) { score -= 20; signals.push(`freq: ${color.frequency} (rare)`); }

  // Signal 5: Chromaticity — achromatic colors are almost always system-level
  const [r, g, b] = color.rgba;
  const isAchromatic = Math.max(r, g, b) - Math.min(r, g, b) <= 25;
  if (isAchromatic) { score += 10; signals.push('achromatic'); }

  let layer: StabilityClassification['layer'];
  if (score >= 60) layer = 'infrastructure';
  else if (score >= 30) layer = 'system';
  else if (score >= 0) layer = 'campaign';
  else layer = 'content';

  return { layer, confidence: Math.min(1, Math.max(0, (score + 40) / 100)), signals };
}

function classifyTypographyStability(typo: TypographyLevel): StabilityClassification {
  const signals: string[] = [];
  let score = 0;

  // Frequency
  if (typo.frequency >= 100) { score += 30; signals.push(`freq: ${typo.frequency}`); }
  else if (typo.frequency >= 20) { score += 15; signals.push(`freq: ${typo.frequency}`); }
  else if (typo.frequency <= 3) { score -= 20; signals.push(`freq: ${typo.frequency} (rare)`); }

  // Structural tags (nav, header, footer → infrastructure)
  const infraTags = ['nav', 'header', 'footer'];
  const hasInfraTag = typo.typicalTags.some((t) => infraTags.includes(t));
  if (hasInfraTag) { score += 25; signals.push(`tag: ${typo.typicalTags.filter((t) => infraTags.includes(t)).join(',')}`); }

  // Heading tags → system
  const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const hasHeadingTag = typo.typicalTags.some((t) => headingTags.includes(t));
  if (hasHeadingTag) { score += 15; signals.push('heading tag'); }

  // Body text tag
  if (typo.typicalTags.includes('p') || typo.typicalTags.includes('span')) {
    score += 10; signals.push('body text');
  }

  let layer: StabilityClassification['layer'];
  if (score >= 50) layer = 'infrastructure';
  else if (score >= 25) layer = 'system';
  else if (score >= 0) layer = 'campaign';
  else layer = 'content';

  return { layer, confidence: Math.min(1, Math.max(0, (score + 40) / 100)), signals };
}

function classifyShadowStability(shadow: ShadowToken): StabilityClassification {
  const signals: string[] = [];
  let score = 0;

  if (shadow.frequency >= 50) { score += 30; signals.push(`freq: ${shadow.frequency}`); }
  else if (shadow.frequency >= 10) { score += 15; signals.push(`freq: ${shadow.frequency}`); }
  else if (shadow.frequency <= 3) { score -= 15; signals.push(`freq: ${shadow.frequency} (rare)`); }

  // System shadow types
  if (shadow.type === 'elevation') { score += 10; signals.push('elevation type'); }
  if (shadow.type === 'ring') { score += 10; signals.push('ring type'); }

  let layer: StabilityClassification['layer'];
  if (score >= 40) layer = 'infrastructure';
  else if (score >= 20) layer = 'system';
  else if (score >= 0) layer = 'campaign';
  else layer = 'content';

  return { layer, confidence: Math.min(1, Math.max(0, (score + 40) / 100)), signals };
}

function classifyRadiusStability(radius: RadiusToken, maxFrequency: number): StabilityClassification {
  const signals: string[] = [];
  let score = 0;

  // Dominant radius
  if (maxFrequency > 0 && radius.frequency >= maxFrequency * 0.5) {
    score += 30; signals.push('dominant radius');
  }

  if (radius.frequency >= 50) { score += 20; signals.push(`freq: ${radius.frequency}`); }
  else if (radius.frequency >= 10) { score += 10; signals.push(`freq: ${radius.frequency}`); }
  else if (radius.frequency <= 3) { score -= 15; signals.push(`freq: ${radius.frequency} (rare)`); }

  let layer: StabilityClassification['layer'];
  if (score >= 40) layer = 'infrastructure';
  else if (score >= 20) layer = 'system';
  else if (score >= 0) layer = 'campaign';
  else layer = 'content';

  return { layer, confidence: Math.min(1, Math.max(0, (score + 40) / 100)), signals };
}

function classifyComponentStability(component: ComponentGroup): StabilityClassification {
  const signals: string[] = [];
  let score = 0;
  const totalCount = component.variants.reduce((sum, v) => sum + v.count, 0);

  if (totalCount >= 50) { score += 25; signals.push(`count: ${totalCount}`); }
  else if (totalCount >= 10) { score += 10; signals.push(`count: ${totalCount}`); }
  else if (totalCount <= 3) { score -= 15; signals.push(`count: ${totalCount} (rare)`); }

  // Structural components → infrastructure
  const infraTypes = ['Navigation', 'Footer'];
  if (infraTypes.includes(component.type)) { score += 30; signals.push(`structural: ${component.type}`); }

  // Common UI components → system
  const systemTypes = ['Button', 'Input', 'Card', 'Badge', 'Link'];
  if (systemTypes.includes(component.type)) { score += 15; signals.push(`ui primitive: ${component.type}`); }

  let layer: StabilityClassification['layer'];
  if (score >= 40) layer = 'infrastructure';
  else if (score >= 20) layer = 'system';
  else if (score >= 0) layer = 'campaign';
  else layer = 'content';

  return { layer, confidence: Math.min(1, Math.max(0, (score + 40) / 100)), signals };
}

/** Classify all tokens in a DesignTokens object by temporal stability layer. Can be called independently. */
export function classifyTokenStability(tokens: DesignTokens): void {
  const totalPages = tokens.meta.totalPages;

  for (const color of tokens.colorTokens) {
    color.stability = classifyColorStability(color, totalPages);
  }

  for (const typo of tokens.typographyLevels) {
    typo.stability = classifyTypographyStability(typo);
  }

  for (const shadow of tokens.shadowTokens) {
    shadow.stability = classifyShadowStability(shadow);
  }

  const maxRadiusFreq = tokens.radiusTokens.length > 0
    ? Math.max(...tokens.radiusTokens.map((r) => r.frequency))
    : 0;
  for (const radius of tokens.radiusTokens) {
    radius.stability = classifyRadiusStability(radius, maxRadiusFreq);
  }

  for (const component of tokens.components) {
    component.stability = classifyComponentStability(component);
  }
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function clusterTokens(pages: PageExtraction[], cssVariables: CSSVariable[]): DesignTokens {
  const totalPages = pages.length;

  // ── 1. Color Clustering ──────────────────────────────────────────────────

  const colorMap = new Map<string, ColorEntry>();

  function addColor(colorStr: string, context: UsageContext, pageUrl: string): void {
    const parsed = parseColor(colorStr);
    if (!parsed) return;
    // Skip fully transparent
    if (parsed.a === 0) return;

    const hex = rgbaToHex(parsed.r, parsed.g, parsed.b);
    const key = rgbaKey(parsed);
    const existing = colorMap.get(key);
    if (existing) {
      existing.frequency++;
      existing.usedAs[context]++;
      existing.pages.add(pageUrl);
    } else {
      colorMap.set(key, {
        rgba: parsed,
        hex,
        frequency: 1,
        usedAs: {
          textColor: 0,
          bgColor: 0,
          borderColor: 0,
          shadowColor: 0,
          gradientColor: 0,
          iconColor: 0,
        },
        pages: new Set([pageUrl]),
        cssVariableNames: new Set(),
      });
      colorMap.get(key)!.usedAs[context] = 1;
    }
  }

  for (const page of pages) {
    const { dom, url } = page;

    // Element colors
    for (const el of dom.elements) {
      addColor(el.color, 'textColor', url);
      addColor(el.backgroundColor, 'bgColor', url);
      addColor(el.borderTopColor, 'borderColor', url);
      addColor(el.borderRightColor, 'borderColor', url);
      addColor(el.borderBottomColor, 'borderColor', url);
      addColor(el.borderLeftColor, 'borderColor', url);
      addColor(el.outlineColor, 'borderColor', url);
      addColor(el.textDecorationColor, 'textColor', url);

      // Box shadow colors
      const shadowColors = extractShadowColors(el.boxShadow);
      for (const sc of shadowColors) {
        addColor(sc, 'shadowColor', url);
      }
    }

    // SVG colors → icon context
    for (const svgColor of dom.svgColors) {
      addColor(svgColor, 'iconColor', url);
    }

    // Pseudo-element colors
    for (const pseudo of dom.pseudoElements) {
      addColor(pseudo.color, 'textColor', url);
      addColor(pseudo.backgroundColor, 'bgColor', url);
      // Gradient colors from pseudo backgroundImage
      const gradColors = extractGradientColors(pseudo.backgroundImage);
      for (const gc of gradColors) {
        addColor(gc, 'gradientColor', url);
      }
    }

    // Gradient colors
    for (const gradient of dom.gradients) {
      const gradColors = extractGradientColors(gradient.value);
      for (const gc of gradColors) {
        addColor(gc, 'gradientColor', url);
      }
    }

    // Logo colors
    if (dom.logoColors) {
      for (const lc of dom.logoColors) {
        addColor(lc, 'bgColor', url);
      }
    }
  }

  // Cross-reference with CSS variables
  const cssVarHexMap = new Map<string, string[]>();
  for (const v of cssVariables) {
    const parsed = parseColor(v.value);
    if (parsed) {
      const key = rgbaKey(parsed);
      const entry = colorMap.get(key);
      if (entry) {
        entry.cssVariableNames.add(v.name);
      }
      if (!cssVarHexMap.has(key)) cssVarHexMap.set(key, []);
      cssVarHexMap.get(key)!.push(v.name);
    }
  }

  // Cluster colors using deltaE in OKLCH space
  const toOklch = culori.converter('oklch');
  const entries = Array.from(colorMap.values());

  interface ClusteredColor extends ColorEntry {
    oklch: { l: number; c: number; h: number } | null;
  }

  const withOklch: ClusteredColor[] = entries.map((e) => {
    try {
      const rgb = { mode: 'rgb' as const, r: e.rgba.r / 255, g: e.rgba.g / 255, b: e.rgba.b / 255 };
      const oklch = toOklch(rgb);
      return {
        ...e,
        oklch: oklch ? { l: oklch.l ?? 0, c: oklch.c ?? 0, h: oklch.h ?? 0 } : null,
      };
    } catch {
      return { ...e, oklch: null };
    }
  });

  // Cluster within each usage group context, deltaE < 3
  // Simple greedy clustering: sort by frequency desc, assign to first cluster within threshold
  const clustered: ClusteredColor[] = [];
  const sortedByFreq = [...withOklch].sort((a, b) => b.frequency - a.frequency);

  for (const color of sortedByFreq) {
    let merged = false;
    if (color.oklch) {
      for (const existing of clustered) {
        if (!existing.oklch) continue;
        if (deltaE(color.oklch, existing.oklch) < 3) {
          // Merge into existing cluster representative
          existing.frequency += color.frequency;
          for (const [ctx, count] of Object.entries(color.usedAs) as [UsageContext, number][]) {
            existing.usedAs[ctx] += count;
          }
          for (const p of color.pages) existing.pages.add(p);
          for (const v of color.cssVariableNames) existing.cssVariableNames.add(v);
          merged = true;
          break;
        }
      }
    }
    if (!merged) {
      clustered.push({ ...color });
    }
  }

  // Sort by total frequency descending
  clustered.sort((a, b) => b.frequency - a.frequency);

  // Build per-page frequency
  const pageColorFrequency = new Map<string, Map<string, number>>();
  for (const page of pages) {
    pageColorFrequency.set(page.url, new Map());
  }

  // Rebuild source pages info from original entries (pre-cluster)
  // For simplicity, use the pages set on each clustered entry
  const colorTokens: ColorToken[] = clustered.map((c) => {
    const pagesCoverage = c.pages.size / Math.max(totalPages, 1);
    const sourcePages = Array.from(c.pages).map((url) => ({ url, frequency: 0 }));
    // We don't track per-page frequency during clustering, so set as distributed
    const perPageFreq = Math.max(1, Math.round(c.frequency / Math.max(c.pages.size, 1)));
    for (const sp of sourcePages) sp.frequency = perPageFreq;

    return {
      hex: c.hex,
      rgba: [c.rgba.r, c.rgba.g, c.rgba.b, c.rgba.a] as [number, number, number, number],
      frequency: c.frequency,
      usedAs: { ...c.usedAs },
      cssVariableNames: Array.from(c.cssVariableNames),
      pagesCoverage,
      sourcePages,
      confidence: c.frequency <= 2 ? 'low' as const : (pagesCoverage >= 0.5 ? 'high' as const : 'medium' as const),
    };
  });

  // ── Color Relationships ────────────────────────────────────────────────

  // Lightness scales: group by hue (H ± 10°), different lightness
  const oklchColors = clustered
    .filter((c) => c.oklch && c.frequency >= 3)
    .map((c) => ({
      hex: c.hex,
      h: c.oklch!.h,
      l: c.oklch!.l,
      c: c.oklch!.c,
      frequency: c.frequency,
    }));

  const scales: { baseHue: number; steps: { hex: string; lightness: number; frequency: number }[] }[] = [];
  const usedInScale = new Set<string>();

  for (const color of oklchColors) {
    if (usedInScale.has(color.hex)) continue;
    if (color.c < 0.01) continue; // skip near-achromatic

    const group = oklchColors.filter(
      (other) =>
        !usedInScale.has(other.hex) &&
        Math.abs(((color.h - other.h + 180) % 360) - 180) <= 10 &&
        other.c >= 0.01,
    );

    if (group.length >= 3) {
      const sorted = [...group].sort((a, b) => a.l - b.l);
      const steps = sorted.map((s) => ({
        hex: s.hex,
        lightness: Math.round(s.l * 100) / 100,
        frequency: s.frequency,
      }));
      scales.push({ baseHue: Math.round(color.h), steps });
      for (const s of group) usedInScale.add(s.hex);
    }
  }

  // WCAG contrast pairs for high-frequency colors
  const highFreqColors = colorTokens.filter((c) => c.frequency >= 5).slice(0, 20);
  const contrastPairs: {
    foreground: string;
    background: string;
    contrastRatio: number;
    meetsAA: boolean;
    meetsAAA: boolean;
    usageCount: number;
  }[] = [];

  for (let i = 0; i < highFreqColors.length; i++) {
    for (let j = i + 1; j < highFreqColors.length; j++) {
      const fg = highFreqColors[i];
      const bg = highFreqColors[j];
      const ratio = wcagContrast(fg.hex, bg.hex);
      if (ratio >= 3) {
        // Determine which is foreground vs background by usage
        const fgIsText = fg.usedAs.textColor > fg.usedAs.bgColor;
        const foreground = fgIsText ? fg.hex : bg.hex;
        const background = fgIsText ? bg.hex : fg.hex;
        contrastPairs.push({
          foreground,
          background,
          contrastRatio: Math.round(ratio * 100) / 100,
          meetsAA: ratio >= 4.5,
          meetsAAA: ratio >= 7,
          usageCount: fg.frequency + bg.frequency,
        });
      }
    }
  }

  contrastPairs.sort((a, b) => b.usageCount - a.usageCount);

  // ── 2. Typography Levels ───────────────────────────────────────────────

  interface TypoGroup {
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    lineHeights: string[];
    letterSpacings: string[];
    textTransforms: string[];
    fontFeatureSettings: string[];
    tags: string[];
    sampleTexts: string[];
    frequency: number;
  }

  const typoGroups = new Map<string, TypoGroup>();

  for (const page of pages) {
    for (const el of page.dom.elements) {
      if (!el.textContent || el.textContent.trim().length === 0) continue;

      const rawSize = parsePxValue(el.fontSize);
      if (!rawSize || rawSize <= 0) continue;

      const fontFamily = (el.fontFamily || '').split(',')[0].trim().replace(/["']/g, '');
      const roundedSize = Math.round(rawSize);
      const weight = el.fontWeight || '400';
      const key = `${fontFamily}|${roundedSize}|${weight}`;

      const existing = typoGroups.get(key);
      if (existing) {
        existing.frequency++;
        existing.lineHeights.push(el.lineHeight);
        existing.letterSpacings.push(el.letterSpacing);
        if (el.textTransform && el.textTransform !== 'none') {
          existing.textTransforms.push(el.textTransform);
        }
        if (el.fontFeatureSettings && el.fontFeatureSettings !== 'normal') {
          existing.fontFeatureSettings.push(el.fontFeatureSettings);
        }
        if (!existing.tags.includes(el.tag)) existing.tags.push(el.tag);
        if (existing.sampleTexts.length < 3) {
          const sample = el.textContent.trim().slice(0, 80);
          if (!existing.sampleTexts.includes(sample)) {
            existing.sampleTexts.push(sample);
          }
        }
      } else {
        typoGroups.set(key, {
          fontFamily,
          fontSize: roundedSize,
          fontWeight: weight,
          lineHeights: [el.lineHeight],
          letterSpacings: [el.letterSpacing],
          textTransforms: el.textTransform && el.textTransform !== 'none' ? [el.textTransform] : [],
          fontFeatureSettings: el.fontFeatureSettings && el.fontFeatureSettings !== 'normal'
            ? [el.fontFeatureSettings] : [],
          tags: [el.tag],
          sampleTexts: [el.textContent.trim().slice(0, 80)],
          frequency: 1,
        });
      }
    }
  }

  const typographyLevels: TypographyLevel[] = Array.from(typoGroups.values())
    .sort((a, b) => b.fontSize - a.fontSize)
    .map((g) => ({
      fontFamily: g.fontFamily,
      fontSize: `${g.fontSize}px`,
      fontWeight: g.fontWeight,
      lineHeight: mode(g.lineHeights) ?? 'normal',
      letterSpacing: mode(g.letterSpacings) ?? 'normal',
      textTransform: g.textTransforms.length > 0 ? mode(g.textTransforms) ?? null : null,
      fontFeatureSettings: g.fontFeatureSettings.length > 0 ? mode(g.fontFeatureSettings) ?? null : null,
      frequency: g.frequency,
      typicalTags: g.tags.slice(0, 5),
      sampleTexts: g.sampleTexts.slice(0, 3),
      confidence: g.frequency === 1 ? 'low' as const : (g.frequency >= 5 ? 'high' as const : 'medium' as const),
    }));

  // ── 3. Font Info ───────────────────────────────────────────────────────

  const fontFaces: { family: string; weight: string; style: string; src: string }[] = [];
  const loadedFonts: { family: string; weight: string; style: string }[] = [];
  const googleFontsLinks: string[] = [];
  const seenFontFaces = new Set<string>();
  const seenLoadedFonts = new Set<string>();
  const seenGoogleLinks = new Set<string>();

  for (const page of pages) {
    for (const ff of page.dom.fontInfo.fontFaces) {
      const key = `${ff.family}|${ff.weight}|${ff.style}`;
      if (!seenFontFaces.has(key)) {
        seenFontFaces.add(key);
        fontFaces.push(ff);
      }
    }
    for (const lf of page.dom.fontInfo.loadedFonts) {
      const key = `${lf.family}|${lf.weight}|${lf.style}`;
      if (!seenLoadedFonts.has(key)) {
        seenLoadedFonts.add(key);
        loadedFonts.push({ family: lf.family, weight: lf.weight, style: lf.style });
      }
    }
    for (const link of page.dom.fontInfo.googleFontsLinks) {
      if (!seenGoogleLinks.has(link)) {
        seenGoogleLinks.add(link);
        googleFontsLinks.push(link);
      }
    }
  }

  // ── 4. Spacing System ─────────────────────────────────────────────────

  const spacingValues: number[] = [];
  const maxWidthValues: string[] = [];

  for (const page of pages) {
    for (const el of page.dom.elements) {
      const spacingProps = [
        el.paddingTop, el.paddingRight, el.paddingBottom, el.paddingLeft,
        el.marginTop, el.marginRight, el.marginBottom, el.marginLeft,
        el.gap,
      ];
      for (const prop of spacingProps) {
        const px = parsePxValue(prop);
        if (px !== null && px > 0) {
          spacingValues.push(Math.round(px));
        }
      }
      if (el.maxWidth && el.maxWidth !== 'none') {
        maxWidthValues.push(el.maxWidth);
      }
    }
  }

  // Frequency histogram
  const spacingFreq = new Map<number, number>();
  for (const v of spacingValues) {
    spacingFreq.set(v, (spacingFreq.get(v) ?? 0) + 1);
  }

  // Top 20 values by frequency
  const topSpacings = Array.from(spacingFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([val]) => val);

  // Base unit via GCD of top values
  let baseUnit = 4;
  if (topSpacings.length >= 2) {
    let g = topSpacings[0];
    for (let i = 1; i < topSpacings.length; i++) {
      g = gcd(g, topSpacings[i]);
      if (g <= 1) break;
    }
    baseUnit = g >= 2 ? g : 4;
  }

  // Build scale as multiples of base unit present in the data
  const scaleSet = new Set<number>();
  for (const val of spacingFreq.keys()) {
    if (val % baseUnit === 0 && val <= baseUnit * 32) {
      scaleSet.add(val);
    }
  }
  const spacingScale = Array.from(scaleSet).sort((a, b) => a - b);

  // Max content width
  let maxContentWidth: string | null = null;
  const mwFreq = new Map<string, number>();
  for (const mw of maxWidthValues) {
    mwFreq.set(mw, (mwFreq.get(mw) ?? 0) + 1);
  }
  if (mwFreq.size > 0) {
    maxContentWidth = Array.from(mwFreq.entries()).sort((a, b) => b[1] - a[1])[0][0];
  }

  // Section spacing: large gap values (>= 48px)
  const sectionSpacingSet = new Set<number>();
  for (const [val, freq] of spacingFreq.entries()) {
    if (val >= 48 && freq >= 2) {
      sectionSpacingSet.add(val);
    }
  }
  const sectionSpacing = Array.from(sectionSpacingSet).sort((a, b) => a - b);

  const frequencyMap: Record<number, number> = {};
  for (const [val, freq] of spacingFreq.entries()) {
    frequencyMap[val] = freq;
  }

  // ── 5. Shadow System ──────────────────────────────────────────────────

  const shadowFreq = new Map<string, { value: string; frequency: number; elements: string[] }>();

  for (const page of pages) {
    for (const el of page.dom.elements) {
      const shadow = el.boxShadow;
      if (!shadow || shadow === 'none') continue;

      const existing = shadowFreq.get(shadow);
      if (existing) {
        existing.frequency++;
        if (existing.elements.length < 5 && !existing.elements.includes(el.tag)) {
          existing.elements.push(el.tag);
        }
      } else {
        shadowFreq.set(shadow, { value: shadow, frequency: 1, elements: [el.tag] });
      }
    }
  }

  function classifyShadow(value: string): ShadowToken['type'] {
    // Split on commas OUTSIDE parentheses to handle rgba(r,g,b,a) correctly
    const parts = splitShadowLayers(value);
    if (parts.length > 1) return 'complex-stack';
    if (value.includes('inset')) return 'inset';

    // Remove color portions for analysis
    const cleaned = value
      .replace(/rgba?\([^)]+\)/g, '')
      .replace(/hsla?\([^)]+\)/g, '')
      .replace(/#[0-9a-fA-F]{3,8}/g, '')
      .trim();

    const nums = cleaned.match(/-?\d+(\.\d+)?(px)?/g)?.map((n) => parseFloat(n)) ?? [];
    // box-shadow: offsetX offsetY blur spread
    const offsetX = nums[0] ?? 0;
    const offsetY = nums[1] ?? 0;
    const blur = nums[2] ?? 0;
    const spread = nums[3] ?? 0;

    if (offsetX === 0 && offsetY === 0 && blur === 0 && spread > 0) return 'border-shadow';
    if (offsetX === 0 && offsetY === 0 && blur === 0 && spread !== 0) return 'ring';
    if (offsetY > 0 && blur > 0) return 'elevation';

    return 'elevation';
  }

  function shadowIntensity(value: string): number {
    const cleaned = value
      .replace(/rgba?\([^)]+\)/g, '')
      .replace(/hsla?\([^)]+\)/g, '')
      .replace(/#[0-9a-fA-F]{3,8}/g, '')
      .trim();
    const nums = cleaned.match(/-?\d+(\.\d+)?(px)?/g)?.map((n) => parseFloat(n)) ?? [];
    const blur = Math.abs(nums[2] ?? 0);
    return blur;
  }

  const shadowTokens: ShadowToken[] = Array.from(shadowFreq.values())
    .sort((a, b) => shadowIntensity(b.value) - shadowIntensity(a.value))
    .map((s) => ({
      value: s.value,
      frequency: s.frequency,
      type: classifyShadow(s.value),
      typicalElements: s.elements,
    }));

  // ── 6. Radius System ──────────────────────────────────────────────────

  const radiusFreq = new Map<string, { value: string; frequency: number; elements: string[] }>();

  for (const page of pages) {
    for (const el of page.dom.elements) {
      const radius = el.borderRadius;
      if (!radius || radius === '0px' || radius === '0') continue;

      const existing = radiusFreq.get(radius);
      if (existing) {
        existing.frequency++;
        if (existing.elements.length < 5 && !existing.elements.includes(el.tag)) {
          existing.elements.push(el.tag);
        }
      } else {
        radiusFreq.set(radius, { value: radius, frequency: 1, elements: [el.tag] });
      }
    }
  }

  const radiusTokens: RadiusToken[] = Array.from(radiusFreq.values())
    .sort((a, b) => b.frequency - a.frequency)
    .map((r) => {
      // Annotate special values
      let value = r.value;
      const px = parsePxValue(value);
      if (px !== null && px >= 9999) {
        value = `${value} /* pill */`;
      }
      if (value === '50%') {
        value = `${value} /* circle */`;
      }
      return {
        value: r.value,
        frequency: r.frequency,
        typicalElements: r.elements,
      };
    });

  // ── 7. Component Identification ───────────────────────────────────────

  interface IdentifiedComponent {
    type: string;
    element: ElementStyle;
    pageUrl: string;
  }

  const identified: IdentifiedComponent[] = [];

  for (const page of pages) {
    const pageHeight = Math.max(
      ...page.dom.elements.map((el) => el.rect.y + el.rect.height),
      1000,
    );

    for (const el of page.dom.elements) {
      const bg = parseColor(el.backgroundColor);
      const hasBg = bg !== null && bg.a > 0.05;
      const padding = Math.min(
        parsePxValue(el.paddingTop) ?? 0,
        parsePxValue(el.paddingRight) ?? 0,
        parsePxValue(el.paddingBottom) ?? 0,
        parsePxValue(el.paddingLeft) ?? 0,
      );
      const hasShadowOrBorder =
        (el.boxShadow && el.boxShadow !== 'none') ||
        (parseFloat(el.borderTopWidth) > 0 && el.borderStyle !== 'none');
      const radiusPx = parsePxValue(el.borderRadius) ?? 0;

      // Button
      if (
        el.tag === 'button' ||
        el.role === 'button' ||
        (el.tag === 'a' && hasBg && radiusPx > 0 && padding >= 4)
      ) {
        identified.push({ type: 'Button', element: el, pageUrl: page.url });
        continue;
      }

      // Input
      if (el.tag === 'input' || el.tag === 'textarea' || el.tag === 'select') {
        identified.push({ type: 'Input', element: el, pageUrl: page.url });
        continue;
      }

      // Navigation
      if (
        el.tag === 'nav' ||
        (el.position === 'sticky' || el.position === 'fixed') &&
          (el.tag === 'header' || el.rect.y < 10)
      ) {
        identified.push({ type: 'Navigation', element: el, pageUrl: page.url });
        continue;
      }

      // Badge
      if (radiusPx >= 100 && el.rect.height < 30 && hasBg) {
        identified.push({ type: 'Badge', element: el, pageUrl: page.url });
        continue;
      }

      // Hero
      const fontSize = parsePxValue(el.fontSize) ?? 0;
      if (el.rect.y < 100 && fontSize >= 32 && el.rect.height > 300) {
        identified.push({ type: 'Hero', element: el, pageUrl: page.url });
        continue;
      }

      // Card
      if (
        (hasShadowOrBorder || hasBg) &&
        radiusPx > 0 &&
        padding >= 12 &&
        el.childrenCount >= 2 &&
        el.rect.width >= 200 &&
        el.rect.width <= 800
      ) {
        identified.push({ type: 'Card', element: el, pageUrl: page.url });
        continue;
      }

      // Link
      if (el.tag === 'a' && !hasBg) {
        identified.push({ type: 'Link', element: el, pageUrl: page.url });
        continue;
      }

      // Footer
      if (
        el.tag === 'footer' ||
        (el.rect.y > pageHeight * 0.8 && el.childrenCount >= 3 && el.tag === 'div')
      ) {
        identified.push({ type: 'Footer', element: el, pageUrl: page.url });
      }
    }
  }

  // ── Variant Detection ─────────────────────────────────────────────────

  function classifyVariant(el: ElementStyle): string {
    const bg = parseColor(el.backgroundColor);
    const text = parseColor(el.color);

    // Transparent bg → Ghost
    if (!bg || bg.a < 0.05) return 'Ghost';

    const bgLum = bg ? relativeLuminance(bg.r, bg.g, bg.b) : 1;
    const textLum = text ? relativeLuminance(text.r, text.g, text.b) : 0;

    // Red-ish bg → Destructive
    if (bg && bg.r > 180 && bg.g < 100 && bg.b < 100) return 'Destructive';

    // Dark bg + light text → Primary
    if (bgLum < 0.3 && textLum > 0.5) return 'Primary';

    // Light/white bg + dark text + border/shadow → Secondary
    const hasShadowOrBorder =
      (el.boxShadow && el.boxShadow !== 'none') ||
      parseFloat(el.borderTopWidth) > 0;
    if (bgLum > 0.7 && textLum < 0.4 && hasShadowOrBorder) return 'Secondary';

    return 'Primary';
  }

  // Group by component type, then by variant
  const componentTypeGroups = new Map<string, Map<string, { count: number; elements: ElementStyle[]; pageUrls: string[] }>>();

  for (const comp of identified) {
    if (!componentTypeGroups.has(comp.type)) {
      componentTypeGroups.set(comp.type, new Map());
    }
    const variants = componentTypeGroups.get(comp.type)!;
    const variantName = classifyVariant(comp.element);

    const existing = variants.get(variantName);
    if (existing) {
      existing.count++;
      if (existing.elements.length < 3) existing.elements.push(comp.element);
      if (!existing.pageUrls.includes(comp.pageUrl)) existing.pageUrls.push(comp.pageUrl);
    } else {
      variants.set(variantName, {
        count: 1,
        elements: [comp.element],
        pageUrls: [comp.pageUrl],
      });
    }
  }

  // Build interaction lookup
  const interactionLookup = new Map<string, InteractionCapture>();
  for (const page of pages) {
    if (!page.interactions) continue;
    for (const capture of page.interactions.captures) {
      const key = `${capture.element.tag}|${capture.element.classes}|${capture.componentType}`;
      interactionLookup.set(key, capture);
    }
  }

  function findInteraction(el: ElementStyle): InteractionCapture | undefined {
    const key1 = `${el.tag}|${el.className}|${el.tag}`;
    if (interactionLookup.has(key1)) return interactionLookup.get(key1);
    // Try matching by tag and partial class
    for (const [, cap] of interactionLookup) {
      if (cap.element.tag === el.tag && el.className.includes(cap.element.classes)) {
        return cap;
      }
    }
    return undefined;
  }

  const components: ComponentGroup[] = [];

  for (const [type, variants] of componentTypeGroups) {
    const variantList: ComponentVariant[] = [];

    // Deduplicate variant names with counter for non-standard names
    let variantCounter = 1;

    for (const [name, data] of variants) {
      const representative = data.elements[0];
      const interaction = findInteraction(representative);

      const style: Record<string, string> = {
        backgroundColor: representative.backgroundColor,
        color: representative.color,
        fontSize: representative.fontSize,
        fontWeight: representative.fontWeight,
        borderRadius: representative.borderRadius,
        padding: `${representative.paddingTop} ${representative.paddingRight} ${representative.paddingBottom} ${representative.paddingLeft}`,
      };
      if (representative.boxShadow !== 'none') {
        style.boxShadow = representative.boxShadow;
      }
      if (parseFloat(representative.borderTopWidth) > 0) {
        style.borderWidth = representative.borderTopWidth;
        style.borderColor = representative.borderTopColor;
        style.borderStyle = representative.borderStyle;
      }

      const sampleTexts = data.elements
        .map((e) => e.textContent.trim().slice(0, 40))
        .filter((t) => t.length > 0)
        .slice(0, 3);

      const displayName = name === 'Primary' || name === 'Secondary' || name === 'Ghost' || name === 'Destructive'
        ? name
        : `Variant-${variantCounter++}`;

      variantList.push({
        name: displayName,
        count: data.count,
        style,
        hoverChanges: interaction?.hoverDiff ?? null,
        focusVisibleChanges: interaction?.focusVisibleDiff ?? null,
        focusChanges: interaction?.focusDiff ?? null,
        activeChanges: interaction?.activeDiff ?? null,
        disabledStyle: interaction?.disabledStyle ?? null,
        transition: interaction?.transition ?? (representative.transition || null),
        sampleTexts,
      });
    }

    variantList.sort((a, b) => b.count - a.count);
    components.push({ type, variants: variantList });
  }

  components.sort((a, b) => {
    const totalA = a.variants.reduce((sum, v) => sum + v.count, 0);
    const totalB = b.variants.reduce((sum, v) => sum + v.count, 0);
    return totalB - totalA;
  });

  // ── 8. Layout Patterns ────────────────────────────────────────────────

  const columnCounts = new Set<number>();
  for (const page of pages) {
    for (const el of page.dom.elements) {
      if (el.gridTemplateColumns && el.gridTemplateColumns !== 'none') {
        const cols = el.gridTemplateColumns.split(/\s+/).filter((s) => s.length > 0).length;
        if (cols > 0) columnCounts.add(cols);
      }
    }
  }

  // Content alignment detection
  let centeredCount = 0;
  let fullWidthCount = 0;
  for (const page of pages) {
    for (const el of page.dom.elements) {
      const mwVal = parsePxValue(el.maxWidth);
      const hasAutoMargin =
        el.marginLeft === 'auto' || el.marginRight === 'auto' ||
        el.marginLeft === '0px auto' || el.marginRight === '0px auto';
      if (mwVal && mwVal > 0 && mwVal < 2000 && hasAutoMargin) {
        centeredCount++;
      } else if (el.display === 'block' && (!mwVal || mwVal >= 2000)) {
        fullWidthCount++;
      }
    }
  }

  let contentAlignment: 'centered' | 'full-width' | 'mixed' = 'mixed';
  if (centeredCount > fullWidthCount * 3) contentAlignment = 'centered';
  else if (fullWidthCount > centeredCount * 3) contentAlignment = 'full-width';

  const layoutPatterns = {
    maxContentWidth,
    commonColumnCounts: Array.from(columnCounts).sort((a, b) => a - b),
    sectionSpacing,
    contentAlignment,
  };

  // ── 9. Cross-page Consistency ─────────────────────────────────────────

  const varByPage = new Map<string, Map<string, string>>();
  for (const page of pages) {
    const pageVars = new Map<string, string>();
    for (const v of page.dom.cssVariables) {
      pageVars.set(v.name, v.value);
    }
    varByPage.set(page.url, pageVars);
  }

  const allVarNames = new Set<string>();
  for (const [, vars] of varByPage) {
    for (const name of vars.keys()) allVarNames.add(name);
  }

  const consistent: { token: string; value: string; pages: string[] }[] = [];
  const inconsistent: { token: string; values: { value: string; pages: string[] }[] }[] = [];

  for (const name of allVarNames) {
    const valuePages = new Map<string, string[]>();
    for (const [url, vars] of varByPage) {
      const val = vars.get(name);
      if (val !== undefined) {
        if (!valuePages.has(val)) valuePages.set(val, []);
        valuePages.get(val)!.push(url);
      }
    }

    if (valuePages.size === 1) {
      const [value, pgs] = Array.from(valuePages.entries())[0];
      consistent.push({ token: name, value, pages: pgs });
    } else if (valuePages.size > 1) {
      inconsistent.push({
        token: name,
        values: Array.from(valuePages.entries()).map(([value, pgs]) => ({ value, pages: pgs })),
      });
    }
  }

  // ── 10. Gradient Aggregation ──────────────────────────────────────────

  const gradients: { type: string; value: string; elementTag: string; location: string }[] = [];
  const seenGradients = new Set<string>();

  for (const page of pages) {
    const pageHeight = Math.max(
      ...page.dom.elements.map((el) => el.rect.y + el.rect.height),
      1000,
    );

    for (const g of page.dom.gradients) {
      const key = `${g.type}|${g.value}`;
      if (seenGradients.has(key)) continue;
      seenGradients.add(key);

      let location = 'decorative';
      if (g.rect.y < 100 && g.rect.height > 200) {
        location = 'hero';
      } else if (g.elementTag === 'button' || g.elementTag === 'a') {
        location = 'button';
      } else if (
        g.rect.width >= 200 &&
        g.rect.width <= 800 &&
        g.rect.height >= 100
      ) {
        location = 'card';
      }

      gradients.push({
        type: g.type,
        value: g.value,
        elementTag: g.elementTag,
        location,
      });
    }
  }

  // ── Breakpoints ───────────────────────────────────────────────────────

  const breakpointMap = new Map<string, MediaBreakpoint>();
  for (const page of pages) {
    if (!page.css) continue;
    for (const bp of page.css.mediaBreakpoints) {
      const key = `${bp.type}|${bp.value}`;
      const existing = breakpointMap.get(key);
      if (existing) {
        existing.ruleCount += bp.ruleCount;
      } else {
        breakpointMap.set(key, { ...bp });
      }
    }
  }
  const breakpoints = Array.from(breakpointMap.values()).sort((a, b) => {
    const aVal = parseFloat(a.value) || 0;
    const bVal = parseFloat(b.value) || 0;
    return aVal - bVal;
  });

  // ── A11y Tokens (basic) ───────────────────────────────────────────────

  // Focus indicator: check pseudo-class rules for :focus-visible
  let focusStyle: Record<string, string> = {};
  let focusConsistent = true;
  const focusStyles: string[] = [];

  for (const page of pages) {
    if (!page.css) continue;
    for (const rule of page.css.pseudoClassRules) {
      if (rule.pseudoClass === ':focus-visible' || rule.pseudoClass === ':focus') {
        const outline = rule.properties['outline'] || rule.properties['box-shadow'] || '';
        if (outline) focusStyles.push(outline);
        if (Object.keys(focusStyle).length === 0) {
          focusStyle = { ...rule.properties };
        }
      }
    }
  }

  if (focusStyles.length > 1) {
    const unique = new Set(focusStyles);
    focusConsistent = unique.size <= 2;
  }

  // Min touch target and font size
  let minTouchWidth = Infinity;
  let minTouchHeight = Infinity;
  let minFontSize = Infinity;

  for (const page of pages) {
    for (const el of page.dom.elements) {
      if (el.tag === 'button' || el.tag === 'a' || el.tag === 'input' || el.role === 'button') {
        if (el.rect.width > 0 && el.rect.width < minTouchWidth) minTouchWidth = el.rect.width;
        if (el.rect.height > 0 && el.rect.height < minTouchHeight) minTouchHeight = el.rect.height;
      }
      const fs = parsePxValue(el.fontSize);
      if (fs && fs > 0 && fs < minFontSize) minFontSize = fs;
    }
  }

  // A11y contrast pairs from the color tokens
  const a11yContrastPairs = contrastPairs.slice(0, 20).map((cp) => ({
    foreground: cp.foreground,
    background: cp.background,
    ratio: cp.contrastRatio,
    meetsAA: cp.meetsAA,
    meetsAAA: cp.meetsAAA,
    usageCount: cp.usageCount,
  }));

  const a11yTokens = {
    focusIndicator: {
      style: focusStyle,
      consistent: focusConsistent,
    },
    contrastPairs: a11yContrastPairs,
    minTouchTarget: {
      width: minTouchWidth === Infinity ? 44 : Math.round(minTouchWidth),
      height: minTouchHeight === Infinity ? 44 : Math.round(minTouchHeight),
    },
    minFontSize: minFontSize === Infinity ? '16px' : `${Math.round(minFontSize)}px`,
  };

  // ── Total Elements ────────────────────────────────────────────────────

  const totalElements = pages.reduce((sum, p) => sum + p.dom.elements.length, 0);

  // ── Assemble Final Tokens ─────────────────────────────────────────────

  const result: DesignTokens = {
    meta: {
      sourceUrls: pages.map((p) => p.url),
      totalPages,
      extractionDate: new Date().toISOString(),
      framework: { tailwind: null, uiFramework: null, designSystemUrl: null },
      totalElements,
      extractionTime: 0,
    },

    colorTokens,

    colorRelationships: {
      scales,
      contrastPairs,
    },

    typographyLevels,

    fontInfo: {
      fontFaces,
      loadedFonts,
      googleFontsLinks,
    },

    spacingSystem: {
      baseUnit,
      scale: spacingScale,
      frequencyMap,
      maxContentWidth,
      sectionSpacing,
    },

    shadowTokens,
    radiusTokens,
    components,
    layoutPatterns,

    iconSystem: null,
    motionSystem: null,
    a11yTokens,

    darkMode: {
      supported: false,
      detectionMethod: 'none',
      lightVariables: [],
      darkVariables: [],
      variableDiff: [],
      darkScreenshots: null,
    },

    breakpoints,

    gradients,

    consistency: {
      consistent,
      inconsistent,
    },

    cssVariables,
  };

  // ── Stability Classification Pass ───────────────────────────────────
  classifyTokenStability(result);

  return result;
}

// ─── Incremental Merge ──────────────────────────────────────────────────────

/** Merge incoming tokens into an existing set, deduplicating by perceptual similarity */
export function mergeTokenSets(existing: DesignTokens, incoming: DesignTokens): DesignTokens {
  // @ts-expect-error culori has no bundled declarations in this setup
  const toOklch = (culori as typeof import('culori')).converter('oklch');

  // ── Color merge: delta-E < 3 → combine frequencies ────────────────────
  const mergedColors = [...existing.colorTokens];

  for (const ic of incoming.colorTokens) {
    const icRgb = { mode: 'rgb' as const, r: ic.rgba[0] / 255, g: ic.rgba[1] / 255, b: ic.rgba[2] / 255 };
    const icOklch = toOklch(icRgb);
    let matched = false;

    if (icOklch) {
      for (const ec of mergedColors) {
        const ecRgb = { mode: 'rgb' as const, r: ec.rgba[0] / 255, g: ec.rgba[1] / 255, b: ec.rgba[2] / 255 };
        const ecOklch = toOklch(ecRgb);
        if (ecOklch && deltaE(
          { l: icOklch.l ?? 0, c: icOklch.c ?? 0, h: icOklch.h ?? 0 },
          { l: ecOklch.l ?? 0, c: ecOklch.c ?? 0, h: ecOklch.h ?? 0 },
        ) < 3) {
          // Merge into existing
          ec.frequency += ic.frequency;
          for (const [ctx, count] of Object.entries(ic.usedAs)) {
            (ec.usedAs as Record<string, number>)[ctx] = ((ec.usedAs as Record<string, number>)[ctx] ?? 0) + count;
          }
          for (const v of ic.cssVariableNames) {
            if (!ec.cssVariableNames.includes(v)) ec.cssVariableNames.push(v);
          }
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      mergedColors.push({ ...ic });
    }
  }
  mergedColors.sort((a, b) => b.frequency - a.frequency);

  // ── Typography merge: key = family|size|weight ────────────────────────
  const typoMap = new Map<string, TypographyLevel>();
  for (const t of existing.typographyLevels) {
    typoMap.set(`${t.fontFamily}|${t.fontSize}|${t.fontWeight}`, t);
  }
  for (const t of incoming.typographyLevels) {
    const key = `${t.fontFamily}|${t.fontSize}|${t.fontWeight}`;
    const ex = typoMap.get(key);
    if (ex) {
      ex.frequency += t.frequency;
    } else {
      typoMap.set(key, { ...t });
    }
  }
  const mergedTypo = Array.from(typoMap.values()).sort((a, b) => {
    const sizeA = parseFloat(a.fontSize);
    const sizeB = parseFloat(b.fontSize);
    return sizeB - sizeA;
  });

  // ── Shadow merge: exact value match ───────────────────────────────────
  const shadowMap = new Map<string, ShadowToken>();
  for (const s of existing.shadowTokens) shadowMap.set(s.value, s);
  for (const s of incoming.shadowTokens) {
    const ex = shadowMap.get(s.value);
    if (ex) {
      ex.frequency += s.frequency;
    } else {
      shadowMap.set(s.value, { ...s });
    }
  }
  const mergedShadows = Array.from(shadowMap.values()).sort((a, b) => b.frequency - a.frequency);

  // ── Radius merge: exact value match ───────────────────────────────────
  const radiusMap = new Map<string, RadiusToken>();
  for (const r of existing.radiusTokens) radiusMap.set(r.value, r);
  for (const r of incoming.radiusTokens) {
    const ex = radiusMap.get(r.value);
    if (ex) {
      ex.frequency += r.frequency;
    } else {
      radiusMap.set(r.value, { ...r });
    }
  }
  const mergedRadius = Array.from(radiusMap.values()).sort((a, b) => b.frequency - a.frequency);

  return {
    ...incoming,
    colorTokens: mergedColors,
    typographyLevels: mergedTypo,
    shadowTokens: mergedShadows,
    radiusTokens: mergedRadius,
    // Keep incoming's other fields (components, layout, etc.)
    // as they represent the latest extraction
  };
}
