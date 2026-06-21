import type {
  ColorToken,
  ComponentGroup,
  DesignBoundary,
  RadiusToken,
  ShadowToken,
  TypographyLevel,
} from './types';

// ─── PageGroup Input ─────────────────────────────────────────────────────────

export interface PageGroup {
  label: string;
  urls: string[];
  colorTokens: ColorToken[];
  typographyLevels: TypographyLevel[];
  components: ComponentGroup[];
  spacingSystem: { baseUnit: number; scale: number[] };
  radiusTokens: RadiusToken[];
  shadowTokens: ShadowToken[];
  fontFamilies: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const n = parseInt(clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
  );
}

function setOverlap(a: Set<string>, b: Set<string>): { intersection: number; union: number } {
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return { intersection, union };
}

function arrayOverlap(a: number[], b: number[]): number {
  if (a.length === 0 && b.length === 0) return 100;
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  const setB = new Set(b);
  const { intersection, union } = setOverlap(
    new Set([...setA].map(String)),
    new Set([...setB].map(String))
  );
  return union === 0 ? 100 : (intersection / union) * 100;
}

// ─── Dimension Scorers ───────────────────────────────────────────────────────

function scoreFontOverlap(a: PageGroup, b: PageGroup): number {
  const setA = new Set(a.fontFamilies.map(f => f.toLowerCase().trim()));
  const setB = new Set(b.fontFamilies.map(f => f.toLowerCase().trim()));
  if (setA.size === 0 && setB.size === 0) return 100;
  if (setA.size === 0 || setB.size === 0) return 0;
  const { intersection, union } = setOverlap(setA, setB);
  if (union === 0) return 100;
  if (intersection === union) return 100;
  return 50 * (intersection / union);
}

function scoreColorOverlap(a: PageGroup, b: PageGroup): number {
  const colorsA = a.colorTokens.map(t => t.hex);
  const colorsB = b.colorTokens.map(t => t.hex);
  if (colorsA.length === 0 && colorsB.length === 0) return 100;
  if (colorsA.length === 0 || colorsB.length === 0) return 0;

  const rgbsB = colorsB.map(hexToRgb);
  let matched = 0;
  for (const hexA of colorsA) {
    const rgbA = hexToRgb(hexA);
    const closest = Math.min(...rgbsB.map(rgbB => rgbDistance(rgbA, rgbB)));
    if (closest < 15) matched++;
  }
  const total = new Set([...colorsA, ...colorsB]).size;
  return total === 0 ? 100 : (matched / total) * 100;
}

function scoreSpacing(a: PageGroup, b: PageGroup): number {
  const baseMatch = a.spacingSystem.baseUnit === b.spacingSystem.baseUnit ? 100 : 0;
  const scaleMatch = arrayOverlap(a.spacingSystem.scale, b.spacingSystem.scale);
  return baseMatch * 0.6 + scaleMatch * 0.4;
}

function scoreRadius(a: PageGroup, b: PageGroup): number {
  const valsA = a.radiusTokens.map(r => parseFloat(r.value) || 0);
  const valsB = b.radiusTokens.map(r => parseFloat(r.value) || 0);
  return arrayOverlap(valsA, valsB);
}

function scoreComponentShape(a: PageGroup, b: PageGroup): number {
  const extractButtonStyle = (g: PageGroup): Record<string, string> | null => {
    const btn = g.components.find(c => c.type === 'button');
    if (!btn || btn.variants.length === 0) return null;
    return btn.variants[0].style;
  };
  const styleA = extractButtonStyle(a);
  const styleB = extractButtonStyle(b);
  if (!styleA && !styleB) return 100;
  if (!styleA || !styleB) return 0;

  let matches = 0;
  let total = 0;
  const keys = ['borderRadius', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
  for (const key of keys) {
    if (styleA[key] != null || styleB[key] != null) {
      total++;
      if (styleA[key] === styleB[key]) matches++;
    }
  }
  return total === 0 ? 100 : (matches / total) * 100;
}

function scoreShadow(a: PageGroup, b: PageGroup): number {
  const typesA = new Set(a.shadowTokens.map(s => s.type));
  const typesB = new Set(b.shadowTokens.map(s => s.type));
  if (typesA.size === 0 && typesB.size === 0) return 100;
  if (typesA.size === 0 || typesB.size === 0) return 0;
  const { intersection, union } = setOverlap(typesA, typesB);
  return union === 0 ? 100 : (intersection / union) * 100;
}

// ─── Anomaly Detection ───────────────────────────────────────────────────────

function detectAnomalies(group: PageGroup): { url: string; description: string }[] {
  const anomalies: { url: string; description: string }[] = [];
  const allUrls = group.urls;
  if (allUrls.length < 2) return anomalies;

  const colorsByPage = new Map<string, Set<string>>();
  for (const token of group.colorTokens) {
    for (const sp of token.sourcePages) {
      const existing = colorsByPage.get(sp.url) ?? new Set();
      existing.add(token.hex);
      colorsByPage.set(sp.url, existing);
    }
  }

  const globalColors = new Set<string>();
  for (const [url, colors] of colorsByPage) {
    const otherPages = [...colorsByPage.entries()].filter(([u]) => u !== url);
    const otherColors = new Set<string>();
    for (const [, c] of otherPages) {
      for (const hex of c) otherColors.add(hex);
    }
    for (const hex of colors) globalColors.add(hex);

    let unique = 0;
    for (const hex of colors) {
      if (!otherColors.has(hex)) unique++;
    }
    const ratio = colors.size === 0 ? 0 : unique / colors.size;
    if (ratio > 0.4) {
      anomalies.push({
        url,
        description: `${Math.round(ratio * 100)}% of colors on this page are unique to it (${unique}/${colors.size})`,
      });
    }
  }

  return anomalies;
}

// ─── Shared Token Summary ────────────────────────────────────────────────────

function buildSharedSummary(scores: DesignBoundary['dimensionScores']): string {
  const shared: string[] = [];
  const diverged: string[] = [];

  const thresholds: { key: keyof typeof scores; label: string }[] = [
    { key: 'font', label: 'font families' },
    { key: 'color', label: 'color palettes' },
    { key: 'spacing', label: 'spacing system' },
    { key: 'radius', label: 'border radii' },
    { key: 'component', label: 'component styles' },
    { key: 'shadow', label: 'shadow system' },
  ];

  for (const { key, label } of thresholds) {
    if (scores[key] >= 50) {
      shared.push(label);
    } else {
      diverged.push(label);
    }
  }

  if (shared.length === 0) return 'No significant shared tokens detected';
  if (diverged.length === 0) return `Share ${shared.join(', ')}`;
  return `Share ${shared.join(' and ')}, diverge on ${diverged.join(' and ')}`;
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function detectBoundaries(pageGroups: PageGroup[]): DesignBoundary {
  const groups = pageGroups.map(g => ({
    label: g.label,
    urls: g.urls,
    tokenCount: {
      colors: g.colorTokens.length,
      typography: g.typographyLevels.length,
      components: g.components.length,
    },
  }));

  const allAnomalies: DesignBoundary['anomalies'] = [];
  for (const pg of pageGroups) {
    allAnomalies.push(...detectAnomalies(pg));
  }

  if (pageGroups.length === 1) {
    return {
      groups,
      relationship: 'unified',
      overallSimilarity: 100,
      dimensionScores: { font: 100, color: 100, spacing: 100, radius: 100, component: 100, shadow: 100 },
      sharedTokenSummary: null,
      anomalies: allAnomalies,
    };
  }

  const weights = { font: 0.30, color: 0.25, spacing: 0.15, radius: 0.10, component: 0.10, shadow: 0.10 };
  const pairScores: DesignBoundary['dimensionScores'][] = [];

  for (let i = 0; i < pageGroups.length; i++) {
    for (let j = i + 1; j < pageGroups.length; j++) {
      const a = pageGroups[i];
      const b = pageGroups[j];
      pairScores.push({
        font: scoreFontOverlap(a, b),
        color: scoreColorOverlap(a, b),
        spacing: scoreSpacing(a, b),
        radius: scoreRadius(a, b),
        component: scoreComponentShape(a, b),
        shadow: scoreShadow(a, b),
      });
    }
  }

  const avgScores: DesignBoundary['dimensionScores'] = {
    font: 0, color: 0, spacing: 0, radius: 0, component: 0, shadow: 0,
  };
  for (const ps of pairScores) {
    for (const key of Object.keys(avgScores) as (keyof typeof avgScores)[]) {
      avgScores[key] += ps[key];
    }
  }
  for (const key of Object.keys(avgScores) as (keyof typeof avgScores)[]) {
    avgScores[key] = Math.round((avgScores[key] / pairScores.length) * 100) / 100;
  }

  const overallSimilarity = Math.round(
    (avgScores.font * weights.font +
     avgScores.color * weights.color +
     avgScores.spacing * weights.spacing +
     avgScores.radius * weights.radius +
     avgScores.component * weights.component +
     avgScores.shadow * weights.shadow) * 100
  ) / 100;

  const relationship: DesignBoundary['relationship'] =
    overallSimilarity > 80 ? 'unified' :
    overallSimilarity >= 30 ? 'shared-foundation' :
    'independent';

  const sharedTokenSummary = relationship === 'shared-foundation'
    ? buildSharedSummary(avgScores)
    : null;

  return {
    groups,
    relationship,
    overallSimilarity,
    dimensionScores: avgScores,
    sharedTokenSummary,
    anomalies: allAnomalies,
  };
}
