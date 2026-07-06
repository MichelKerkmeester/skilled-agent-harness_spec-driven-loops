// ────────────────────────────────────────────────────────────────
// MODULE: CSS Analyzer
// ────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ────────────────────────────────────────────────────────────────

import type { Page } from 'playwright';
import * as csstree from 'css-tree';
import type {
  CSSAnalysis,
  PseudoClassRule,
  MediaBreakpoint,
  TransitionInfo,
  AnimationInfo,
} from './types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ────────────────────────────────────────────────────────────────

const TRACKED_PSEUDO_CLASSES = new Set([
  'hover',
  'focus',
  'active',
  'disabled',
  'focus-visible',
  'focus-within',
]);

// ────────────────────────────────────────────────────────────────
// 3. TYPE DEFINITIONS
// ────────────────────────────────────────────────────────────────

interface CSSSource {
  inlineStyles: string[];
  externalUrls: string[];
}

// ────────────────────────────────────────────────────────────────
// 4. HELPERS
// ────────────────────────────────────────────────────────────────

async function collectCSSSources(page: Page): Promise<CSSSource> {
  return page.evaluate(() => {
    const inlineStyles: string[] = [];
    const externalUrls: string[] = [];

    document.querySelectorAll('style').forEach((el) => {
      const text = el.textContent?.trim();
      if (text) inlineStyles.push(text);
    });

    document.querySelectorAll('link[rel="stylesheet"]').forEach((el) => {
      const href = (el as HTMLLinkElement).href;
      if (href) externalUrls.push(href);
    });

    return { inlineStyles, externalUrls };
  });
}

async function fetchExternalSheet(
  page: Page,
  url: string,
): Promise<{ css: string | null; error: string | null }> {
  // Try in-page fetch first (same-origin or CORS-allowed)
  const inPageResult = await page.evaluate(async (sheetUrl: string) => {
    try {
      const res = await fetch(sheetUrl);
      if (!res.ok) return { css: null, error: `HTTP ${res.status}` };
      return { css: await res.text(), error: null };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { css: null, error: msg };
    }
  }, url);

  if (inPageResult.css !== null) return inPageResult;

  // Fallback: fetch via Playwright's request context (bypasses CORS)
  try {
    const response = await page.context().request.get(url);
    if (response.ok()) {
      return { css: await response.text(), error: null };
    }
    return { css: null, error: `HTTP ${response.status()}` };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { css: null, error: msg };
  }
}

function generateSelectorString(selectorList: csstree.CssNode): string {
  return csstree.generate(selectorList);
}

function extractDeclarations(block: csstree.CssNode): Record<string, string> {
  const props: Record<string, string> = {};
  if (!block.children) return props;
  block.children.forEach((node) => {
    if (node.type === 'Declaration' && node.property) {
      props[node.property] = node.value ? csstree.generate(node.value as csstree.CssNode) : '';
    }
  });
  return props;
}

// ─── Pseudo-class extraction ─────────────────────────────────────────────────

function extractPseudoClassRules(ast: csstree.CssNode): PseudoClassRule[] {
  const rules: PseudoClassRule[] = [];

  csstree.walk(ast, {
    visit: 'Rule',
    enter(node) {
      if (!node.prelude || node.prelude.type !== 'SelectorList' || !node.block) return;

      const fullSelector = generateSelectorString(node.prelude);

      if (!node.prelude.children) return;
      node.prelude.children.forEach((selector) => {
        if (selector.type !== 'Selector') return;

        let matchedPseudo: string | null = null;

        if (!selector.children) return;
        selector.children.forEach((part) => {
          if (
            part.type === 'PseudoClassSelector' &&
            part.name &&
            TRACKED_PSEUDO_CLASSES.has(part.name)
          ) {
            matchedPseudo = part.name!;
          }
        });

        if (matchedPseudo === null) return;

        // Build base selector by removing the pseudo-class portion
        const baseParts: string[] = [];
        selector.children.forEach((part) => {
          if (
            part.type === 'PseudoClassSelector' &&
            part.name &&
            TRACKED_PSEUDO_CLASSES.has(part.name)
          ) {
            return;
          }
          baseParts.push(csstree.generate(part));
        });

        rules.push({
          selector: fullSelector,
          baseSelector: baseParts.join('').trim() || fullSelector,
          pseudoClass: `:${matchedPseudo}`,
          properties: extractDeclarations(node.block!),
        });
      });
    },
  });

  return rules;
}

// ─── Media breakpoint extraction ─────────────────────────────────────────────

function classifyMediaQuery(queryStr: string): {
  type: MediaBreakpoint['type'];
  value: string;
} {
  const minWidth = queryStr.match(/min-width\s*:\s*([^)]+)/);
  if (minWidth) return { type: 'min-width', value: minWidth[1].trim() };

  const maxWidth = queryStr.match(/max-width\s*:\s*([^)]+)/);
  if (maxWidth) return { type: 'max-width', value: maxWidth[1].trim() };

  const colorScheme = queryStr.match(/prefers-color-scheme\s*:\s*([^)]+)/);
  if (colorScheme) return { type: 'prefers-color-scheme', value: colorScheme[1].trim() };

  const motion = queryStr.match(/prefers-reduced-motion\s*:\s*([^)]+)/);
  if (motion) return { type: 'prefers-reduced-motion', value: motion[1].trim() };

  return { type: 'other', value: queryStr };
}

function countRulesInBlock(block: csstree.Block): number {
  let count = 0;
  csstree.walk(block, {
    visit: 'Rule',
    enter() {
      count++;
    },
  });
  return count;
}

function extractMediaBreakpoints(ast: csstree.CssNode): MediaBreakpoint[] {
  const breakpoints: MediaBreakpoint[] = [];

  csstree.walk(ast, {
    visit: 'Atrule',
    enter(node) {
      if (node.name !== 'media' || !node.prelude || !node.block) return;

      const query = csstree.generate(node.prelude);
      const { type, value } = classifyMediaQuery(query);
      const ruleCount = countRulesInBlock(node.block);

      breakpoints.push({ query, type, value, ruleCount });
    },
  });

  return breakpoints;
}

// ─── Transition extraction ───────────────────────────────────────────────────

// Splits a CSS value list on top-level commas only, treating commas inside
// parentheses as part of the enclosing function call rather than a group
// separator. A naive `value.split(',')` shatters `cubic-bezier(0.4, 0, 0.2, 1)`
// into four bogus fragments, corrupting every transition after it in the list.
function splitTopLevelCommas(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of value) {
    if (char === '(') depth++;
    else if (char === ')') depth = Math.max(0, depth - 1);
    if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts;
}

// Splits a single transition entry on whitespace, but never inside
// parentheses — `cubic-bezier(0.4, 0, 0.2, 1)` must survive as ONE token, not
// be shattered by the spaces csstree emits after each internal comma.
function splitWhitespaceRespectingParens(value: string): string[] {
  const tokens: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of value) {
    if (char === '(') depth++;
    else if (char === ')') depth = Math.max(0, depth - 1);
    if (depth === 0 && /\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export function parseTransitionShorthand(value: string): Partial<TransitionInfo>[] {
  // A transition shorthand can contain comma-separated transitions
  const parts = splitTopLevelCommas(value).map((s) => s.trim()).filter(Boolean);

  const isTime = (t: string): boolean => /^[\d.]+m?s$/.test(t);
  const isTimingFunction = (t: string): boolean =>
    /^(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end|steps|cubic-bezier)/.test(t);

  return parts.map((part) => {
    const tokens = splitWhitespaceRespectingParens(part);
    // The transition shorthand order is flexible and the property is optional
    // (defaults to `all`), so classify tokens by shape instead of trusting
    // positions: the first time value is the duration, the second is the delay.
    let property = 'all';
    let timingFunction = 'ease';
    const times: string[] = [];
    for (const token of tokens) {
      if (isTime(token)) times.push(token);
      else if (isTimingFunction(token)) timingFunction = token;
      else property = token;
    }
    return {
      property,
      duration: times[0] ?? '0s',
      timingFunction,
      delay: times[1] ?? '0s',
    };
  });
}

function extractTransitions(ast: csstree.CssNode): TransitionInfo[] {
  const transitions: TransitionInfo[] = [];

  csstree.walk(ast, {
    visit: 'Rule',
    enter(node) {
      if (!node.prelude || node.prelude.type !== 'SelectorList' || !node.block) return;

      const selector = generateSelectorString(node.prelude!);
      const decls = extractDeclarations(node.block);

      if (decls['transition']) {
        const parsed = parseTransitionShorthand(decls['transition']);
        for (const t of parsed) {
          transitions.push({
            selector,
            property: t.property ?? 'all',
            duration: t.duration ?? '0s',
            timingFunction: t.timingFunction ?? 'ease',
            delay: t.delay ?? '0s',
          });
        }
        return;
      }

      // Individual transition-* properties
      const prop = decls['transition-property'];
      if (prop) {
        transitions.push({
          selector,
          property: prop,
          duration: decls['transition-duration'] ?? '0s',
          timingFunction: decls['transition-timing-function'] ?? 'ease',
          delay: decls['transition-delay'] ?? '0s',
        });
      }
    },
  });

  return transitions;
}

// ─── Animation extraction ────────────────────────────────────────────────────

interface KeyframeData {
  name: string;
  keyframes: { offset: string; properties: Record<string, string> }[];
}

function extractKeyframes(ast: csstree.CssNode): KeyframeData[] {
  const results: KeyframeData[] = [];

  csstree.walk(ast, {
    visit: 'Atrule',
    enter(node) {
      if (node.name !== 'keyframes' || !node.prelude || !node.block) return;

      const name = csstree.generate(node.prelude).trim();
      const keyframes: KeyframeData['keyframes'] = [];

      if (!node.block.children) return;
      node.block.children.forEach((child) => {
        if (child.type !== 'Rule' || !child.block) return;

        const offset = child.prelude ? csstree.generate(child.prelude) : '';
        const properties = extractDeclarations(child.block);
        keyframes.push({ offset, properties });
      });

      results.push({ name, keyframes });
    },
  });

  return results;
}

function parseAnimationName(value: string): string {
  // animation shorthand: name duration timing delay count direction fill mode
  // The name is the first token that is not a time value, keyword, or number
  const tokens = value.split(/\s+/);
  const timeOrKeyword =
    /^(\d+\.?\d*(s|ms)|ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end|infinite|none|normal|reverse|alternate|alternate-reverse|forwards|backwards|both|running|paused|\d+)$/;

  for (const token of tokens) {
    if (!timeOrKeyword.test(token)) return token;
  }
  return tokens[0] ?? '';
}

function parseAnimationDuration(value: string): string {
  const tokens = value.split(/\s+/);
  const timePattern = /^\d+\.?\d*(s|ms)$/;
  for (const token of tokens) {
    if (timePattern.test(token)) return token;
  }
  return '0s';
}

function extractAnimations(ast: csstree.CssNode): AnimationInfo[] {
  const keyframeMap = new Map<string, KeyframeData>();
  for (const kf of extractKeyframes(ast)) {
    keyframeMap.set(kf.name, kf);
  }

  // Collect usage: which selectors reference each animation
  const usageMap = new Map<string, { selectors: string[]; duration: string }>();

  csstree.walk(ast, {
    visit: 'Rule',
    enter(node) {
      if (!node.prelude || node.prelude.type !== 'SelectorList' || !node.block) return;

      const selector = generateSelectorString(node.prelude!);
      const decls = extractDeclarations(node.block);

      let animName: string | null = null;
      let animDuration = '0s';

      if (decls['animation']) {
        animName = parseAnimationName(decls['animation']);
        animDuration = parseAnimationDuration(decls['animation']);
      } else if (decls['animation-name']) {
        animName = decls['animation-name'];
        animDuration = decls['animation-duration'] ?? '0s';
      }

      if (!animName || animName === 'none') return;

      const existing = usageMap.get(animName);
      if (existing) {
        existing.selectors.push(selector);
      } else {
        usageMap.set(animName, { selectors: [selector], duration: animDuration });
      }
    },
  });

  const animations: AnimationInfo[] = [];

  // Merge keyframe definitions with usage data
  for (const [name, kf] of keyframeMap) {
    const usage = usageMap.get(name);
    animations.push({
      name,
      keyframes: kf.keyframes,
      usedBy: usage?.selectors ?? [],
      duration: usage?.duration ?? '0s',
    });
  }

  // Include animations referenced but without a local @keyframes definition
  for (const [name, usage] of usageMap) {
    if (!keyframeMap.has(name)) {
      animations.push({
        name,
        keyframes: [],
        usedBy: usage.selectors,
        duration: usage.duration,
      });
    }
  }

  return animations;
}

// ─── @supports and @container ────────────────────────────────────────────────

function extractAtRuleQueries(
  ast: csstree.CssNode,
  ruleName: string,
): string[] {
  const queries: string[] = [];

  csstree.walk(ast, {
    visit: 'Atrule',
    enter(node) {
      if (node.name !== ruleName || !node.prelude) return;
      queries.push(csstree.generate(node.prelude));
    },
  });

  return queries;
}

// ─── Main analyzer ──────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ────────────────────────────────────────────────────────────────

function countTotalRules(ast: csstree.CssNode): number {
  let count = 0;
  csstree.walk(ast, {
    visit: 'Rule',
    enter() {
      count++;
    },
  });
  return count;
}

export async function analyzeCSS(page: Page): Promise<CSSAnalysis> {
  const sources = await collectCSSSources(page);
  const failedSheets: CSSAnalysis['failedSheets'] = [];
  const allCSS: string[] = [...sources.inlineStyles];

  // Fetch external stylesheets
  const fetchResults = await Promise.all(
    sources.externalUrls.map(async (url) => {
      const result = await fetchExternalSheet(page, url);
      if (result.css !== null) {
        return { url, css: result.css };
      }
      failedSheets.push({ url, reason: result.error ?? 'Unknown error' });
      return null;
    }),
  );

  for (const result of fetchResults) {
    if (result !== null) allCSS.push(result.css);
  }

  const analyzedSheetCount = allCSS.length;

  // Parse and analyze each stylesheet independently, then merge results
  const allPseudoClassRules: PseudoClassRule[] = [];
  const allMediaBreakpoints: MediaBreakpoint[] = [];
  const allTransitions: TransitionInfo[] = [];
  const allAnimations: AnimationInfo[] = [];
  const allSupportsQueries: string[] = [];
  const allContainerQueries: string[] = [];
  let totalRuleCount = 0;

  for (const css of allCSS) {
    try {
      const ast = csstree.parse(css, {
        parseAtrulePrelude: true,
        parseRulePrelude: true,
        parseValue: true,
        parseCustomProperty: false,
      });

      totalRuleCount += countTotalRules(ast);
      allPseudoClassRules.push(...extractPseudoClassRules(ast));
      allMediaBreakpoints.push(...extractMediaBreakpoints(ast));
      allTransitions.push(...extractTransitions(ast));
      allAnimations.push(...extractAnimations(ast));
      allSupportsQueries.push(...extractAtRuleQueries(ast, 'supports'));
      allContainerQueries.push(...extractAtRuleQueries(ast, 'container'));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[css-analyzer] Failed to parse CSS chunk: ${msg}`);
    }
  }

  return {
    pseudoClassRules: allPseudoClassRules,
    mediaBreakpoints: allMediaBreakpoints,
    transitions: allTransitions,
    animations: allAnimations,
    supportsQueries: [...new Set(allSupportsQueries)],
    containerQueries: [...new Set(allContainerQueries)],
    totalRuleCount,
    analyzedSheetCount,
    failedSheets,
  };
}
