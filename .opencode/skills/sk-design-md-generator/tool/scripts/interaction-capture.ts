import type { Page } from 'playwright';
import type {
  InteractionData,
  InteractionCapture,
  LoadingStateInfo,
  EmptyStateInfo,
  ErrorStateInfo,
} from './types';

// ─── Constants ───────────────────────────────────────────────────────────────

const INTERACTIVE_SELECTOR = [
  'button', 'a', 'input', 'select', 'textarea',
  '[role="button"]', '[role="link"]', '[role="tab"]',
  '[role="menuitem"]', '[role="checkbox"]', '[role="radio"]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const CAPTURED_PROPERTIES = [
  'backgroundColor', 'color', 'borderColor', 'boxShadow',
  'transform', 'opacity', 'outline', 'outlineOffset',
  'textDecoration', 'cursor',
] as const;

type CapturedProperty = (typeof CAPTURED_PROPERTIES)[number];

const PER_ELEMENT_TIMEOUT = 2_000;
const PAGE_TIMEOUT = 15_000;
const MAX_ELEMENTS = 50;
const MAX_TAB_PRESSES = 20;

// ─── Element Discovery ──────────────────────────────────────────────────────

interface DiscoveredElement {
  index: number;
  tag: string;
  classes: string;
  textContent: string;
  role: string;
  rect: { x: number; y: number; width: number; height: number };
}

async function discoverElements(page: Page): Promise<DiscoveredElement[]> {
  return page.evaluate(
    ({ selector, max }) => {
      const nodes = Array.from(document.querySelectorAll(selector));
      const seen = new Map<string, boolean>();
      const results: DiscoveredElement[] = [];

      for (let i = 0; i < nodes.length && results.length < max; i++) {
        const el = nodes[i] as HTMLElement;
        const rect = el.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) continue;

        const classes = el.className && typeof el.className === 'string'
          ? el.className
          : '';

        const prefix = classes.split(/\s+/).find((c) => c.length > 0) ?? el.tagName.toLowerCase();
        if (seen.has(prefix)) continue;
        seen.set(prefix, true);

        results.push({
          index: i,
          tag: el.tagName.toLowerCase(),
          classes,
          textContent: (el.textContent ?? '').trim().slice(0, 50),
          role: el.getAttribute('role') ?? '',
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
        });
      }

      return results;
    },
    { selector: INTERACTIVE_SELECTOR, max: MAX_ELEMENTS },
  );
}

// ─── Component Classification ────────────────────────────────────────────────

function classifyComponent(tag: string, role: string): string {
  if (tag === 'button' || role === 'button') return 'button';
  if (tag === 'a') return 'link';
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return 'input';
  if (role === 'tab') return 'tab';
  if (role === 'menuitem') return 'menuitem';
  if (role === 'checkbox' || role === 'radio') return 'toggle';
  return 'interactive';
}

// ─── Style Reading ───────────────────────────────────────────────────────────

function buildSelector(el: DiscoveredElement): string {
  const base = el.tag;
  const cls = el.classes
    .split(/\s+/)
    .filter((c) => c.length > 0)
    .map((c) => `.${CSS.escape(c)}`)
    .join('');
  return cls ? `${base}${cls}` : `${base}:nth-of-type(${el.index + 1})`;
}

async function readProperties(
  page: Page,
  selectorOrIndex: string | number,
): Promise<Record<CapturedProperty, string>> {
  return page.evaluate(
    ({ sel, props }) => {
      let el: Element | null = null;
      if (typeof sel === 'number') {
        const all = document.querySelectorAll(
          'button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="radio"], [tabindex]:not([tabindex="-1"])',
        );
        el = all[sel] ?? null;
      } else {
        el = document.querySelector(sel);
      }

      if (!el) return {} as Record<string, string>;

      const computed = window.getComputedStyle(el);
      const result: Record<string, string> = {};
      for (const prop of props) {
        result[prop] = computed.getPropertyValue(
          prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
        );
      }
      return result;
    },
    { sel: selectorOrIndex, props: [...CAPTURED_PROPERTIES] },
  ) as Promise<Record<CapturedProperty, string>>;
}

// ─── Diff Computation ────────────────────────────────────────────────────────

function computeDiff(
  defaultStyle: Record<string, string>,
  stateStyle: Record<string, string>,
): Record<string, string> | null {
  const diff: Record<string, string> = {};
  let hasDiff = false;

  for (const key of Object.keys(defaultStyle)) {
    if (stateStyle[key] !== undefined && stateStyle[key] !== defaultStyle[key]) {
      diff[key] = stateStyle[key];
      hasDiff = true;
    }
  }

  return hasDiff ? diff : null;
}

// ─── Transition Reading ──────────────────────────────────────────────────────

async function readTransition(
  page: Page,
  elementIndex: number,
): Promise<string | null> {
  return page.evaluate(
    ({ idx }) => {
      const all = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="radio"], [tabindex]:not([tabindex="-1"])',
      );
      const el = all[idx];
      if (!el) return null;
      const val = window.getComputedStyle(el).transition;
      return val && val !== 'all 0s ease 0s' && val !== 'none' ? val : null;
    },
    { idx: elementIndex },
  );
}

// ─── Disabled Elements ───────────────────────────────────────────────────────

async function captureDisabledStyle(
  page: Page,
  elementIndex: number,
): Promise<Record<string, string> | null> {
  const isDisabled = await page.evaluate(
    ({ idx }) => {
      const all = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="radio"], [tabindex]:not([tabindex="-1"])',
      );
      const el = all[idx] as HTMLElement | undefined;
      if (!el) return false;
      return (
        (el as HTMLButtonElement).disabled === true ||
        el.getAttribute('aria-disabled') === 'true'
      );
    },
    { idx: elementIndex },
  );

  if (!isDisabled) return null;
  return readProperties(page, elementIndex);
}

// ─── Restore State ───────────────────────────────────────────────────────────

async function restoreState(page: Page): Promise<void> {
  await page.mouse.move(0, 0);
  await page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    active?.blur?.();
  });
  await page.waitForTimeout(200);
}

// ─── Per-Element Capture ─────────────────────────────────────────────────────

async function captureElement(
  page: Page,
  el: DiscoveredElement,
): Promise<InteractionCapture | null> {
  const componentType = classifyComponent(el.tag, el.role);

  // Default state
  const defaultStyle = await readProperties(page, el.index);
  if (Object.keys(defaultStyle).length === 0) return null;

  // Hover
  let hoverDiff: Record<string, string> | null = null;
  try {
    const cx = el.rect.x + el.rect.width / 2;
    const cy = el.rect.y + el.rect.height / 2;
    await page.mouse.move(cx, cy);
    await page.waitForTimeout(300);
    const hoverStyle = await readProperties(page, el.index);
    hoverDiff = computeDiff(defaultStyle, hoverStyle);
  } catch {
    // hover failed, continue
  }

  await restoreState(page);

  // Focus-visible (Tab navigation)
  let focusVisibleDiff: Record<string, string> | null = null;
  try {
    for (let t = 0; t < MAX_TAB_PRESSES; t++) {
      await page.keyboard.press('Tab');
      const isFocused = await page.evaluate(
        ({ idx }) => {
          const all = document.querySelectorAll(
            'button, a, input, select, textarea, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="checkbox"], [role="radio"], [tabindex]:not([tabindex="-1"])',
          );
          return document.activeElement === all[idx];
        },
        { idx: el.index },
      );

      if (isFocused) {
        await page.waitForTimeout(100);
        const focusVisibleStyle = await readProperties(page, el.index);
        focusVisibleDiff = computeDiff(defaultStyle, focusVisibleStyle);
        break;
      }
    }
  } catch {
    // focus-visible failed, continue
  }

  await restoreState(page);

  // Focus (click-based)
  let focusDiff: Record<string, string> | null = null;
  try {
    const cx = el.rect.x + el.rect.width / 2;
    const cy = el.rect.y + el.rect.height / 2;
    await page.mouse.click(cx, cy);
    await page.waitForTimeout(100);
    const focusStyle = await readProperties(page, el.index);
    focusDiff = computeDiff(defaultStyle, focusStyle);
  } catch {
    // focus failed, continue
  }

  await restoreState(page);

  // Active (mouse down)
  let activeDiff: Record<string, string> | null = null;
  try {
    const cx = el.rect.x + el.rect.width / 2;
    const cy = el.rect.y + el.rect.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.waitForTimeout(100);
    const activeStyle = await readProperties(page, el.index);
    activeDiff = computeDiff(defaultStyle, activeStyle);
    await page.mouse.up();
  } catch {
    try { await page.mouse.up(); } catch { /* ensure mouse is released */ }
  }

  await restoreState(page);

  // Disabled
  const disabledStyle = await captureDisabledStyle(page, el.index);

  // Transition
  const transition = await readTransition(page, el.index);

  return {
    element: {
      tag: el.tag,
      classes: el.classes,
      textContent: el.textContent,
      role: el.role,
    },
    componentType,
    defaultStyle,
    hoverDiff,
    focusVisibleDiff,
    focusDiff,
    activeDiff,
    disabledStyle,
    transition,
  };
}

// ─── Timeout Race Helper ─────────────────────────────────────────────────────

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => {
        console.warn(`[interaction-capture] Timeout: ${label} after ${ms}ms`);
        resolve(null);
      }, ms);
    }),
  ]);
}

// ─── Loading State Detection ────────────────────────────────────────────────

const LOADING_CLASS_PATTERNS = ['loading', 'spinner', 'skeleton', 'shimmer', 'placeholder'];
const LOADING_STYLE_PROPS = [
  'backgroundColor', 'opacity', 'animation', 'animationName',
  'backgroundImage', 'borderRadius', 'width', 'height',
] as const;

async function detectLoadingStates(page: Page): Promise<LoadingStateInfo[]> {
  return page.evaluate(
    ({ classPatterns, styleProps }) => {
      const results: LoadingStateInfo[] = [];
      const seen = new Set<string>();

      // Class-based detection
      for (const pattern of classPatterns) {
        const els = document.querySelectorAll(`[class*="${pattern}"]`);
        for (const el of els) {
          const classes = (el as HTMLElement).className;
          if (typeof classes !== 'string') continue;
          const key = `class:${classes}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const computed = window.getComputedStyle(el);
          const treatment: Record<string, string> = {};
          for (const prop of styleProps) {
            const cssName = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
            const val = computed.getPropertyValue(cssName);
            if (val && val !== 'none' && val !== 'normal' && val !== '0s') {
              treatment[prop] = val;
            }
          }

          results.push({
            selector: el.tagName.toLowerCase(),
            classes,
            detectionMethod: 'class',
            visualTreatment: treatment,
          });
        }
      }

      // aria-busy detection
      const busyEls = document.querySelectorAll('[aria-busy="true"]');
      for (const el of busyEls) {
        const classes = typeof (el as HTMLElement).className === 'string'
          ? (el as HTMLElement).className : '';
        const key = `busy:${classes}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const computed = window.getComputedStyle(el);
        const treatment: Record<string, string> = {};
        for (const prop of styleProps) {
          const cssName = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
          const val = computed.getPropertyValue(cssName);
          if (val && val !== 'none' && val !== 'normal') {
            treatment[prop] = val;
          }
        }

        results.push({
          selector: el.tagName.toLowerCase(),
          classes,
          detectionMethod: 'aria-busy',
          visualTreatment: treatment,
        });
      }

      // role="progressbar" detection
      const progressEls = document.querySelectorAll('[role="progressbar"]');
      for (const el of progressEls) {
        const classes = typeof (el as HTMLElement).className === 'string'
          ? (el as HTMLElement).className : '';
        const key = `progress:${classes}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const computed = window.getComputedStyle(el);
        const treatment: Record<string, string> = {};
        for (const prop of styleProps) {
          const cssName = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
          const val = computed.getPropertyValue(cssName);
          if (val && val !== 'none' && val !== 'normal') {
            treatment[prop] = val;
          }
        }

        results.push({
          selector: el.tagName.toLowerCase(),
          classes,
          detectionMethod: 'role-progressbar',
          visualTreatment: treatment,
        });
      }

      return results;
    },
    { classPatterns: LOADING_CLASS_PATTERNS, styleProps: [...LOADING_STYLE_PROPS] },
  );
}

// ─── Empty State Detection ──────────────────────────────────────────────────

const EMPTY_CLASS_PATTERNS = ['empty', 'no-data', 'no-results', 'zero-state', 'empty-state'];
const EMPTY_TEXT_PATTERNS = ['no results', 'nothing here', 'get started', 'no items', 'no data'];

async function detectEmptyStates(page: Page): Promise<EmptyStateInfo[]> {
  return page.evaluate(
    ({ classPatterns, textPatterns }) => {
      const results: EmptyStateInfo[] = [];
      const seen = new Set<string>();

      // Class-based detection
      for (const pattern of classPatterns) {
        const els = document.querySelectorAll(`[class*="${pattern}"]`);
        for (const el of els) {
          const classes = (el as HTMLElement).className;
          if (typeof classes !== 'string') continue;
          const key = `class:${classes}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const textContent = (el.textContent ?? '').trim().slice(0, 200);
          const hasIcon = el.querySelector('svg, img, [class*="icon"]') !== null;
          const hasHeading = el.querySelector('h1, h2, h3, h4, h5, h6') !== null;
          const bodyEls = el.querySelectorAll('p, span');
          const hasBody = Array.from(bodyEls).some((b) => (b.textContent ?? '').trim().length > 10);
          const hasCta = el.querySelector('button, a[href], [role="button"]') !== null;

          results.push({
            selector: el.tagName.toLowerCase(),
            classes,
            textContent,
            hasIcon,
            hasHeading,
            hasBody,
            hasCta,
          });
        }
      }

      // Text-based detection (look for containers with empty-state text)
      if (results.length === 0) {
        const allElements = document.querySelectorAll('div, section, main, article');
        for (const el of allElements) {
          const text = (el.textContent ?? '').trim().toLowerCase();
          const isMatch = textPatterns.some((p: string) => text.includes(p));
          if (!isMatch) continue;

          // Only consider relatively small containers (not the whole page)
          const children = el.children.length;
          if (children > 10) continue;

          const classes = typeof (el as HTMLElement).className === 'string'
            ? (el as HTMLElement).className : '';
          const key = `text:${text.slice(0, 50)}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const hasIcon = el.querySelector('svg, img, [class*="icon"]') !== null;
          const hasHeading = el.querySelector('h1, h2, h3, h4, h5, h6') !== null;
          const bodyEls = el.querySelectorAll('p, span');
          const hasBody = Array.from(bodyEls).some((b) => (b.textContent ?? '').trim().length > 10);
          const hasCta = el.querySelector('button, a[href], [role="button"]') !== null;

          results.push({
            selector: el.tagName.toLowerCase(),
            classes,
            textContent: text.slice(0, 200),
            hasIcon,
            hasHeading,
            hasBody,
            hasCta,
          });

          if (results.length >= 5) break;
        }
      }

      return results;
    },
    { classPatterns: EMPTY_CLASS_PATTERNS, textPatterns: EMPTY_TEXT_PATTERNS },
  );
}

// ─── Error State Detection ──────────────────────────────────────────────────

const ERROR_CLASS_PATTERNS = ['error', 'invalid', 'danger', 'alert'];
const ERROR_STYLE_PROPS = [
  'color', 'backgroundColor', 'borderColor', 'borderWidth',
  'outline', 'boxShadow', 'backgroundImage',
] as const;

async function detectErrorStates(page: Page): Promise<ErrorStateInfo[]> {
  return page.evaluate(
    ({ classPatterns, styleProps }) => {
      const results: ErrorStateInfo[] = [];
      const seen = new Set<string>();

      // Class-based detection
      for (const pattern of classPatterns) {
        const els = document.querySelectorAll(`[class*="${pattern}"]`);
        for (const el of els) {
          const classes = (el as HTMLElement).className;
          if (typeof classes !== 'string') continue;
          const key = `class:${classes}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const computed = window.getComputedStyle(el);
          const treatment: Record<string, string> = {};
          for (const prop of styleProps) {
            const cssName = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
            const val = computed.getPropertyValue(cssName);
            if (val && val !== 'none' && val !== 'normal') {
              treatment[prop] = val;
            }
          }

          results.push({
            selector: el.tagName.toLowerCase(),
            classes,
            detectionMethod: 'class',
            visualTreatment: treatment,
          });
        }
      }

      // aria-invalid detection
      const invalidEls = document.querySelectorAll('[aria-invalid="true"]');
      for (const el of invalidEls) {
        const classes = typeof (el as HTMLElement).className === 'string'
          ? (el as HTMLElement).className : '';
        const key = `invalid:${classes}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const computed = window.getComputedStyle(el);
        const treatment: Record<string, string> = {};
        for (const prop of styleProps) {
          const cssName = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
          const val = computed.getPropertyValue(cssName);
          if (val && val !== 'none' && val !== 'normal') {
            treatment[prop] = val;
          }
        }

        results.push({
          selector: el.tagName.toLowerCase(),
          classes,
          detectionMethod: 'aria-invalid',
          visualTreatment: treatment,
        });
      }

      // role="alert" detection
      const alertEls = document.querySelectorAll('[role="alert"]');
      for (const el of alertEls) {
        const classes = typeof (el as HTMLElement).className === 'string'
          ? (el as HTMLElement).className : '';
        const key = `alert:${classes}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const computed = window.getComputedStyle(el);
        const treatment: Record<string, string> = {};
        for (const prop of styleProps) {
          const cssName = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
          const val = computed.getPropertyValue(cssName);
          if (val && val !== 'none' && val !== 'normal') {
            treatment[prop] = val;
          }
        }

        results.push({
          selector: el.tagName.toLowerCase(),
          classes,
          detectionMethod: 'role-alert',
          visualTreatment: treatment,
        });
      }

      return results;
    },
    { classPatterns: ERROR_CLASS_PATTERNS, styleProps: [...ERROR_STYLE_PROPS] },
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export async function captureInteractions(page: Page): Promise<InteractionData> {
  const captures: InteractionCapture[] = [];
  const pageStart = Date.now();

  let elements: DiscoveredElement[];
  try {
    elements = await discoverElements(page);
  } catch (err) {
    console.error('[interaction-capture] Failed to discover elements:', err);
    return { captures };
  }

  for (const el of elements) {
    if (Date.now() - pageStart > PAGE_TIMEOUT) {
      console.warn(
        `[interaction-capture] Page timeout reached after ${elements.indexOf(el)} elements`,
      );
      break;
    }

    try {
      const result = await withTimeout(
        captureElement(page, el),
        PER_ELEMENT_TIMEOUT,
        `element ${el.index} (${el.tag}.${el.classes.split(' ')[0] ?? ''})`,
      );

      if (result) {
        captures.push(result);
      }
    } catch (err) {
      console.warn(
        `[interaction-capture] Failed on element ${el.index} (${el.tag}):`,
        err,
      );
    }
  }

  // Final restore to leave page in clean state
  try {
    await restoreState(page);
  } catch {
    // best effort
  }

  // Detect loading, empty, and error states
  let loadingStates: LoadingStateInfo[] | undefined;
  let emptyStates: EmptyStateInfo[] | undefined;
  let errorStates: ErrorStateInfo[] | undefined;

  try {
    loadingStates = await detectLoadingStates(page);
    if (loadingStates.length === 0) loadingStates = undefined;
  } catch {
    // loading state detection failed, continue
  }

  try {
    emptyStates = await detectEmptyStates(page);
    if (emptyStates.length === 0) emptyStates = undefined;
  } catch {
    // empty state detection failed, continue
  }

  try {
    errorStates = await detectErrorStates(page);
    if (errorStates.length === 0) errorStates = undefined;
  } catch {
    // error state detection failed, continue
  }

  return { captures, loadingStates, emptyStates, errorStates };
}
