import type { Page } from 'playwright';
import type {
  DOMCollection,
  CSSVariable,
  ElementStyle,
  PseudoElementInfo,
  GradientInfo,
} from './types';

interface BrowserCollectionResult {
  cssVariables: CSSVariable[];
  elements: ElementStyle[];
  pseudoElements: PseudoElementInfo[];
  gradients: GradientInfo[];
  svgColors: string[];
  svgSizes: { width: number; height: number }[];
  fontInfo: {
    fontFaces: { family: string; weight: string; style: string; src: string }[];
    loadedFonts: { family: string; weight: string; style: string; status: string }[];
    googleFontsLinks: string[];
  };
  logoColors: string[] | null;
}

export async function collectDOM(page: Page): Promise<DOMCollection> {
  const result = await page.evaluate((): BrowserCollectionResult => {
    // ── Helpers ────────────────────────────────────────────────────────────

    function rgbToHex(r: number, g: number, b: number): string {
      return (
        '#' +
        [r, g, b]
          .map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0'))
          .join('')
      );
    }

    function truncate(str: string, max: number): string {
      if (!str) return '';
      const trimmed = str.trim().replace(/\s+/g, ' ');
      return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
    }

    function getStructuralRegion(
      el: Element,
    ): 'nav' | 'header' | 'main' | 'footer' | 'aside' | 'unknown' {
      let current: Element | null = el;
      while (current && current !== document.body) {
        const tag = current.tagName.toLowerCase();
        if (tag === 'nav') return 'nav';
        if (tag === 'footer') return 'footer';
        if (tag === 'header') return 'header';
        if (tag === 'aside') return 'aside';
        if (tag === 'main') return 'main';
        current = current.parentElement;
      }
      return 'unknown';
    }

    function getNearestLandmark(el: Element): string {
      let current: Element | null = el;
      const landmarkTags = new Set(['nav', 'header', 'main', 'footer', 'aside', 'section']);
      while (current && current !== document.body) {
        const tag = current.tagName.toLowerCase();
        if (landmarkTags.has(tag)) {
          if (tag === 'section' && !current.getAttribute('aria-label')) {
            current = current.parentElement;
            continue;
          }
          return tag;
        }
        current = current.parentElement;
      }
      return '';
    }

    function isInsideMedia(el: Element): boolean {
      const mediaTags = new Set(['img', 'picture', 'video', 'canvas', 'svg']);
      let current: Element | null = el.parentElement;
      while (current && current !== document.body) {
        if (mediaTags.has(current.tagName.toLowerCase())) return true;
        current = current.parentElement;
      }
      return false;
    }

    // ── 1. CSS Custom Properties ──────────────────────────────────────────

    function extractCSSVariables(): CSSVariable[] {
      const variables: CSSVariable[] = [];
      const themePattern = /dark|theme|mode/i;

      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue; // cross-origin SecurityError
        }

        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (!(rule instanceof CSSStyleRule)) continue;

          const selector = rule.selectorText;
          const isRoot = /^(:root|html|body)$/i.test(selector.trim());
          const isTheme = themePattern.test(selector);

          if (!isRoot && !isTheme) continue;

          const style = rule.style;
          for (let k = 0; k < style.length; k++) {
            const prop = style[k];
            if (!prop.startsWith('--')) continue;
            variables.push({
              name: prop,
              value: style.getPropertyValue(prop).trim(),
              source: selector,
              ...(isTheme && !isRoot ? { context: selector } : {}),
            });
          }
        }
      }

      return variables;
    }

    // ── 2. Element Computed Style Census ──────────────────────────────────

    function extractElements(): ElementStyle[] {
      const allEls = document.querySelectorAll('*');
      const candidates: { el: Element; zIndex: number; area: number; inViewport: boolean }[] = [];

      for (let i = 0; i < allEls.length; i++) {
        const el = allEls[i];
        const rect = el.getBoundingClientRect();

        // Visibility filter
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.top > 15000) continue;

        const cs = getComputedStyle(el);
        if (cs.display === 'none') continue;
        if (cs.visibility === 'hidden') continue;
        if (cs.opacity === '0') continue;

        const z = parseInt(cs.zIndex, 10) || 0;
        const area = rect.width * rect.height;
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

        candidates.push({ el, zIndex: z, area, inViewport });
      }

      // If over cap, prioritize
      const CAP = 5000;
      let selected = candidates;

      if (candidates.length > CAP) {
        selected = candidates.sort((a, b) => {
          // viewport elements first
          if (a.inViewport !== b.inViewport) return a.inViewport ? -1 : 1;
          // then high z-index
          if (a.zIndex !== b.zIndex) return b.zIndex - a.zIndex;
          // then large area
          return b.area - a.area;
        }).slice(0, CAP);
      }

      return selected.map(({ el }) => {
        const rect = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const htmlEl = el as HTMLElement;

        return {
          tag: el.tagName.toLowerCase(),
          className: (el.getAttribute('class') || '').trim(),
          role: el.getAttribute('role') || '',
          ariaLabel: el.getAttribute('aria-label') || '',
          textContent: truncate(el.textContent || '', 100),
          href: (el as HTMLAnchorElement).href || '',
          type: (el as HTMLInputElement).type || '',
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          // Colors
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          borderTopColor: cs.borderTopColor,
          borderRightColor: cs.borderRightColor,
          borderBottomColor: cs.borderBottomColor,
          borderLeftColor: cs.borderLeftColor,
          outlineColor: cs.outlineColor,
          textDecorationColor: cs.textDecorationColor,
          // Typography
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          textTransform: cs.textTransform,
          fontFeatureSettings: cs.fontFeatureSettings,
          // Spacing
          paddingTop: cs.paddingTop,
          paddingRight: cs.paddingRight,
          paddingBottom: cs.paddingBottom,
          paddingLeft: cs.paddingLeft,
          marginTop: cs.marginTop,
          marginRight: cs.marginRight,
          marginBottom: cs.marginBottom,
          marginLeft: cs.marginLeft,
          gap: cs.gap,
          // Shape
          borderRadius: cs.borderRadius,
          borderTopWidth: cs.borderTopWidth,
          borderRightWidth: cs.borderRightWidth,
          borderBottomWidth: cs.borderBottomWidth,
          borderLeftWidth: cs.borderLeftWidth,
          borderStyle: cs.borderStyle,
          // Depth
          boxShadow: cs.boxShadow,
          opacity: cs.opacity,
          zIndex: cs.zIndex,
          // Layout
          display: cs.display,
          position: cs.position,
          flexDirection: cs.flexDirection,
          justifyContent: cs.justifyContent,
          alignItems: cs.alignItems,
          gridTemplateColumns: cs.gridTemplateColumns,
          maxWidth: cs.maxWidth,
          overflow: cs.overflow,
          // Motion
          transition: cs.transition,
          // Context
          childrenCount: el.children.length,
          hasImage:
            !!el.querySelector('img') ||
            cs.backgroundImage !== 'none',
          // Structural region
          structuralRegion: getStructuralRegion(el),
          nearestLandmark: getNearestLandmark(el),
          isInsideMedia: isInsideMedia(el),
        };
      });
    }

    // ── 3. Pseudo-element Extraction ─────────────────────────────────────

    function extractPseudoElements(): PseudoElementInfo[] {
      const results: PseudoElementInfo[] = [];
      const allEls = document.querySelectorAll('*');

      for (let i = 0; i < allEls.length; i++) {
        const el = allEls[i];
        for (const pseudo of ['::before', '::after'] as const) {
          const ps = getComputedStyle(el, pseudo);
          const content = ps.content;

          if (!content || content === 'none' || content === '""' || content === "''") {
            continue;
          }

          results.push({
            elementTag: el.tagName.toLowerCase(),
            elementClasses: (el.getAttribute('class') || '').trim(),
            pseudo,
            content,
            backgroundColor: ps.backgroundColor,
            color: ps.color,
            width: ps.width,
            height: ps.height,
            borderRadius: ps.borderRadius,
            position: ps.position,
            backgroundImage: ps.backgroundImage,
          });
        }
      }

      return results;
    }

    // ── 4. Gradient Extraction ───────────────────────────────────────────

    function extractGradients(): GradientInfo[] {
      const gradients: GradientInfo[] = [];
      const gradientPattern = /(linear|radial|conic)-gradient/;
      const allEls = document.querySelectorAll('*');

      for (let i = 0; i < allEls.length; i++) {
        const el = allEls[i];
        const cs = getComputedStyle(el);
        const bg = cs.backgroundImage;

        if (!bg || bg === 'none') continue;

        const match = gradientPattern.exec(bg);
        if (!match) continue;

        const rect = el.getBoundingClientRect();
        gradients.push({
          type: match[1] as 'linear' | 'radial' | 'conic',
          value: bg,
          elementTag: el.tagName.toLowerCase(),
          elementClasses: (el.getAttribute('class') || '').trim(),
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
        });
      }

      return gradients;
    }

    // ── 5. SVG Icon Extraction ───────────────────────────────────────────

    function extractSVGInfo(): { colors: string[]; sizes: { width: number; height: number }[] } {
      const colors = new Set<string>();
      const sizes: { width: number; height: number }[] = [];
      const svgs = document.querySelectorAll('svg');
      const childSelectors = ['path', 'circle', 'rect', 'line', 'polyline', 'polygon'];
      const skip = new Set(['none', 'transparent', '']);

      for (let i = 0; i < svgs.length; i++) {
        const svg = svgs[i];
        const rect = svg.getBoundingClientRect();
        sizes.push({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });

        // Extract colors from the SVG element itself
        const svgFill = svg.getAttribute('fill');
        const svgStroke = svg.getAttribute('stroke');
        if (svgFill && !skip.has(svgFill)) colors.add(svgFill);
        if (svgStroke && !skip.has(svgStroke)) colors.add(svgStroke);

        // Extract from child shape elements
        for (const sel of childSelectors) {
          const children = svg.querySelectorAll(sel);
          for (let j = 0; j < children.length; j++) {
            const child = children[j];
            const fill = child.getAttribute('fill');
            const stroke = child.getAttribute('stroke');
            if (fill && !skip.has(fill)) colors.add(fill);
            if (stroke && !skip.has(stroke)) colors.add(stroke);
          }
        }
      }

      return { colors: Array.from(colors), sizes };
    }

    // ── 6. Font Info Extraction ──────────────────────────────────────────

    function extractFontInfo(): BrowserCollectionResult['fontInfo'] {
      const fontFaces: { family: string; weight: string; style: string; src: string }[] = [];
      const loadedFonts: { family: string; weight: string; style: string; status: string }[] = [];
      const googleFontsLinks: string[] = [];

      // @font-face rules from stylesheets
      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }

        for (let j = 0; j < rules.length; j++) {
          const rule = rules[j];
          if (!(rule instanceof CSSFontFaceRule)) continue;

          const style = rule.style;
          fontFaces.push({
            family: style.getPropertyValue('font-family').replace(/['"]/g, '').trim(),
            weight: style.getPropertyValue('font-weight') || 'normal',
            style: style.getPropertyValue('font-style') || 'normal',
            src: style.getPropertyValue('src') || '',
          });
        }
      }

      // document.fonts API
      try {
        document.fonts.forEach((font) => {
          loadedFonts.push({
            family: font.family.replace(/['"]/g, '').trim(),
            weight: font.weight,
            style: font.style,
            status: font.status,
          });
        });
      } catch {
        // fonts API not available
      }

      // Google Fonts links
      const links = document.querySelectorAll(
        'link[href*="fonts.googleapis.com"]'
      );
      for (let i = 0; i < links.length; i++) {
        const href = (links[i] as HTMLLinkElement).href;
        if (href) googleFontsLinks.push(href);
      }

      return { fontFaces, loadedFonts, googleFontsLinks };
    }

    // ── 7. Logo Color Extraction ─────────────────────────────────────────

    function extractLogoColors(): string[] | null {
      // Try to find a logo image
      const logoSelectors = [
        'header img',
        'nav img',
        '[class*="logo"] img',
        'a[class*="logo"] img',
        'img[class*="logo"]',
        'img[alt*="logo" i]',
      ];

      let logoImg: HTMLImageElement | null = null;
      for (const sel of logoSelectors) {
        logoImg = document.querySelector<HTMLImageElement>(sel);
        if (logoImg) break;
      }

      // Try inline SVG logo if no image found
      if (!logoImg) {
        const svgSelectors = [
          'header svg',
          'nav svg',
          '[class*="logo"] svg',
          'a[class*="logo"] svg',
          'svg[class*="logo"]',
        ];

        for (const sel of svgSelectors) {
          const svg = document.querySelector<SVGSVGElement>(sel);
          if (!svg) continue;

          const svgColors = new Set<string>();
          const skip = new Set(['none', 'transparent', '', 'currentColor']);
          const shapes = svg.querySelectorAll('path, circle, rect, polygon, ellipse');

          const svgFill = svg.getAttribute('fill');
          const svgStroke = svg.getAttribute('stroke');
          if (svgFill && !skip.has(svgFill)) svgColors.add(svgFill);
          if (svgStroke && !skip.has(svgStroke)) svgColors.add(svgStroke);

          for (let i = 0; i < shapes.length; i++) {
            const fill = shapes[i].getAttribute('fill');
            const stroke = shapes[i].getAttribute('stroke');
            if (fill && !skip.has(fill)) svgColors.add(fill);
            if (stroke && !skip.has(stroke)) svgColors.add(stroke);
          }

          if (svgColors.size > 0) {
            return Array.from(svgColors).slice(0, 3);
          }
        }

        return null;
      }

      // Canvas-based pixel analysis for img elements
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const w = logoImg.naturalWidth || logoImg.width;
        const h = logoImg.naturalHeight || logoImg.height;
        if (w === 0 || h === 0) return null;

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(logoImg, 0, 0, w, h);

        let imageData: ImageData;
        try {
          imageData = ctx.getImageData(0, 0, w, h);
        } catch {
          return null; // tainted canvas from cross-origin
        }

        const colorCounts = new Map<string, number>();
        const data = imageData.data;
        const step = Math.max(1, Math.floor(data.length / 4 / 1000)); // sample ~1000 pixels

        for (let i = 0; i < data.length; i += 4 * step) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip transparent
          if (a < 128) continue;
          // Skip near-white (r>240, g>240, b>240)
          if (r > 240 && g > 240 && b > 240) continue;
          // Skip near-black (r<15, g<15, b<15)
          if (r < 15 && g < 15 && b < 15) continue;

          // Quantize to reduce noise
          const qr = Math.round(r / 16) * 16;
          const qg = Math.round(g / 16) * 16;
          const qb = Math.round(b / 16) * 16;
          const hex = rgbToHex(qr, qg, qb);

          colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
        }

        if (colorCounts.size === 0) return null;

        const sorted = Array.from(colorCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([hex]) => hex);

        return sorted;
      } catch {
        return null;
      }
    }

    // ── Run all extractors ───────────────────────────────────────────────

    const cssVariables = extractCSSVariables();
    const elements = extractElements();
    const pseudoElements = extractPseudoElements();
    const gradients = extractGradients();
    const svgInfo = extractSVGInfo();
    const fontInfo = extractFontInfo();
    const logoColors = extractLogoColors();

    return {
      cssVariables,
      elements,
      pseudoElements,
      gradients,
      svgColors: svgInfo.colors,
      svgSizes: svgInfo.sizes,
      fontInfo,
      logoColors,
    };
  });

  return result;
}
