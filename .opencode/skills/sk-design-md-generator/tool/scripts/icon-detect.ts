import type { Page } from 'playwright';
import type { DOMCollection, IconSystemInfo } from './types';

interface SvgClassData {
  className: string;
  attributes: Record<string, string>;
}

function buildFrequencyMap(values: number[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const v of values) {
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return map;
}

function topN(freqMap: Map<number, number>, n: number): number[] {
  return [...freqMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

function mode(values: number[]): number | null {
  if (values.length === 0) return null;
  const freqMap = buildFrequencyMap(values);
  let best: number | null = null;
  let bestCount = 0;
  for (const [value, count] of freqMap) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

function detectLibrary(svgClassData: SvgClassData[]): string | null {
  const checks: { name: string; test: (d: SvgClassData) => boolean }[] = [
    { name: 'lucide', test: (d) => d.className.includes('lucide') || d.attributes['data-lucide'] !== undefined },
    { name: 'heroicons', test: (d) => d.className.includes('heroicon') },
    { name: 'phosphor', test: (d) => d.className.split(/\s+/).some((c) => c.startsWith('ph-')) },
    { name: 'feather', test: (d) => d.className.includes('feather') || d.attributes['data-feather'] !== undefined },
    { name: 'material-icons', test: (d) => d.className.includes('material-icons') },
    {
      name: 'font-awesome',
      test: (d) => {
        const classes = d.className.split(/\s+/);
        return classes.some((c) => c.startsWith('fa-') || ['fas', 'far', 'fab', 'fal', 'fad'].includes(c));
      },
    },
  ];

  for (const { name, test } of checks) {
    if (svgClassData.some(test)) return name;
  }
  return null;
}

function determineColorMode(svgColors: string[]): 'currentColor' | 'fixed' | 'mixed' {
  if (svgColors.length === 0) return 'mixed';
  const currentColorCount = svgColors.filter((c) => c === 'currentColor').length;
  const ratio = currentColorCount / svgColors.length;
  if (ratio > 0.8) return 'currentColor';
  if (ratio < 0.2) return 'fixed';
  return 'mixed';
}

// ─── Size Distribution ──────────────────────────────────────────────────────

function buildSizeDistribution(sizes: { width: number; height: number }[]): { size: number; count: number }[] {
  const sizeFreq = buildFrequencyMap(sizes.map((s) => Math.round(Math.max(s.width, s.height))));
  return [...sizeFreq.entries()]
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => a.size - b.size);
}

// ─── Stroke Width Distribution ──────────────────────────────────────────────

function buildStrokeWidthDistribution(strokeWidths: number[]): { value: number; count: number }[] {
  const freqMap = buildFrequencyMap(strokeWidths);
  return [...freqMap.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

// ─── Color Usage Breakdown ──────────────────────────────────────────────────

function buildColorUsage(svgColors: string[]): { currentColor: number; fixedFill: number; strokeOnly: number } {
  let currentColor = 0;
  let fixedFill = 0;
  let strokeOnly = 0;

  for (const color of svgColors) {
    if (color === 'currentColor') {
      currentColor++;
    } else if (color === 'none' || color === '') {
      strokeOnly++;
    } else {
      fixedFill++;
    }
  }

  return { currentColor, fixedFill, strokeOnly };
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function detectIcons(domCollections: DOMCollection[]): IconSystemInfo | null {
  const allSizes: { width: number; height: number }[] = [];
  const allColors: string[] = [];
  const allClassData: SvgClassData[] = [];

  for (const collection of domCollections) {
    allSizes.push(...collection.svgSizes);
    allColors.push(...collection.svgColors);

    for (const el of collection.elements) {
      if (el.tag === 'svg') {
        allClassData.push({ className: el.className, attributes: {} });
      }
    }
  }

  const totalCount = allSizes.length;
  if (totalCount < 3) return null;

  const widthFreq = buildFrequencyMap(allSizes.map((s) => s.width));
  const sizeScale = topN(widthFreq, 3);

  const strokeWidths: number[] = [];
  for (const collection of domCollections) {
    for (const el of collection.elements) {
      if (el.tag === 'svg' || el.tag === 'path' || el.tag === 'line' || el.tag === 'circle') {
        const bw = parseFloat(el.borderTopWidth);
        if (!isNaN(bw) && bw > 0) strokeWidths.push(bw);
      }
    }
  }
  const strokeWidth = mode(strokeWidths);

  const colorMode = determineColorMode(allColors);
  const library = detectLibrary(allClassData);

  // New: stroke width distribution
  const strokeWidthDistribution = strokeWidths.length > 0
    ? buildStrokeWidthDistribution(strokeWidths)
    : undefined;

  // New: size distribution
  const sizeDistribution = allSizes.length > 0
    ? buildSizeDistribution(allSizes)
    : undefined;

  // New: color usage breakdown
  const colorUsage = allColors.length > 0
    ? buildColorUsage(allColors)
    : undefined;

  return {
    library,
    sizeScale,
    strokeWidth,
    colorMode,
    totalCount,
    strokeWidthDistribution,
    sizeDistribution,
    colorUsage,
  };
}

// ─── Async Icon Detection (Page-dependent) ──────────────────────────────────

export async function detectIconLabels(page: Page): Promise<number | undefined> {
  try {
    return page.evaluate(() => {
      const svgs = document.querySelectorAll('svg');
      if (svgs.length === 0) return undefined;

      let labeledCount = 0;

      for (const svg of svgs) {
        const parent = svg.parentElement;
        if (!parent) continue;

        // Check for aria-label on svg itself
        if (svg.getAttribute('aria-label')) {
          labeledCount++;
          continue;
        }

        // Check for <title> element inside svg
        if (svg.querySelector('title')) {
          labeledCount++;
          continue;
        }

        // Check for adjacent text in parent
        const parentText = Array.from(parent.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => (n.textContent ?? '').trim())
          .filter((t) => t.length > 0);

        if (parentText.length > 0) {
          labeledCount++;
          continue;
        }

        // Check for sibling text elements
        const siblings = Array.from(parent.children).filter((c) => c !== svg);
        const hasTextSibling = siblings.some((s) => {
          const text = (s.textContent ?? '').trim();
          return text.length > 0 && s.tagName.toLowerCase() !== 'svg';
        });

        if (hasTextSibling) {
          labeledCount++;
          continue;
        }
      }

      return Math.round((labeledCount / svgs.length) * 100);
    }) as Promise<number | undefined>;
  } catch {
    return undefined;
  }
}
