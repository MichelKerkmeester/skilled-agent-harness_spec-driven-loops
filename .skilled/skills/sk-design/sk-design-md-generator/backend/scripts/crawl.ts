// ────────────────────────────────────────────────────────────────
// MODULE: Page Crawler
// ────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ────────────────────────────────────────────────────────────────

import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import type { CrawlResult, PageData } from './types';

// ────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ────────────────────────────────────────────────────────────────

// ─── Options ─────────────────────────────────────────────────────────────────

export type WaitStrategy = 'networkidle' | 'css' | `selector:${string}`;

export interface CrawlOptions {
  maxPages: number;
  concurrency: number;
  extraUrls?: string[];
  verbose: boolean;
  waitFor?: WaitStrategy;
  // Opt-in TLS bypass. Default false keeps certificate validation on so a
  // crawl cannot be silently MITM'd.
  insecure?: boolean;
}

// ────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ────────────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: CrawlOptions = {
  maxPages: 8,
  concurrency: 5,
  verbose: false,
  insecure: false,
};

// ─── Constants ───────────────────────────────────────────────────────────────

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const VIEWPORTS = [
  { label: '1920' as const, width: 1920, height: 1080 },
  { label: '1440' as const, width: 1440, height: 900 },
  { label: '768' as const, width: 768, height: 1024 },
  { label: '375' as const, width: 375, height: 812 },
  { label: '320' as const, width: 320, height: 568 },
] as const;

const MAX_SCROLL_HEIGHT = 15_000;
const SCROLL_STEP_RATIO = 0.8;
const SCROLL_PAUSE_MS = 500;
const NAV_TIMEOUT = 60_000;
const SAME_DOMAIN_DELAY_MS = 300;
const MAX_MODALS = 2;

const RESOURCE_EXTENSIONS = new Set([
  '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif',
  '.ico', '.mp4', '.mp3', '.wav', '.ogg', '.webm', '.zip', '.tar',
  '.gz', '.dmg', '.exe', '.css', '.js', '.woff', '.woff2', '.ttf',
  '.eot', '.xml', '.json', '.rss', '.atom',
]);

const HIGH_PRIORITY_PATHS = new Set([
  '/pricing', '/plans', '/docs', '/login', '/signup',
  '/sign-up', '/sign-in', '/signin', '/register',
]);

const MEDIUM_PRIORITY_PATHS = new Set([
  '/blog', '/changelog', '/careers', '/contact',
  '/integrations', '/404', '/about', '/features',
  '/support', '/help', '/faq',
]);

const COOKIE_SELECTORS = [
  '#onetrust-banner-sdk',
  '#onetrust-consent-sdk',
  '.ot-sdk-container',
  '#CybotCookiebotDialog',
  '#CookiebotWidget',
  '.cc-window',
  '.cc-banner',
  '#qc-cmp2-ui',
  '.qc-cmp2-container',
  '#usercentrics-root',
  '[data-testid="uc-app-container"]',
  '[data-testid="uc-banner"]',
  '#didomi-host',
  '.didomi-popup-container',
  '.osano-cm-window',
  '.osano-cm-dialog',
  '.truste_box_overlay',
  '#truste-consent-track',
  '[id*="cookie" i]',
  '[class*="cookie" i]',
  '[id*="consent" i]',
  '[class*="consent" i]',
  '[id*="gdpr" i]',
  '[class*="gdpr" i]',
  '[aria-label*="cookie" i]',
  '[aria-label*="consent" i]',
  '[data-testid*="cookie" i]',
  '[data-testid*="consent" i]',
];

const DESIGN_REVEAL_CONTROL_SELECTOR = [
  'button',
  '[role="button"]',
  '[type="button"]',
  '[aria-haspopup]',
  '[aria-expanded]',
  '[aria-controls]',
  '[role="tab"]',
  'summary',
  '[data-toggle]',
  '[data-bs-toggle]',
].join(', ');

const DESIGN_REVEAL_PATTERNS = [
  /\b(menu|dropdown|submenu|accordion|tab|tabs|filter|filters|sort|options)\b/i,
  /\b(settings|preferences|language|region|country|more|details|expand|collapse)\b/i,
  /\b(open|show|view|watch|play|share)\b/i,
];

const DESIGN_REVEAL_ATTRIBUTE_PATTERN =
  /(menu|dropdown|submenu|accordion|tab|filter|sort|options|settings|preferences|language|region|modal|dialog|drawer|popover|toggle|expand|collapse)/i;

const STATE_CHANGING_ACTION_PATTERNS = [
  /\b(subscribe|sign\s*up|signup|join|buy|purchase|checkout|submit|delete)\b/i,
  /\b(pay|payment|register|order|donate)\b/i,
  /\b(get\s*started|start\s*(a\s*)?(free\s*)?trial|free\s*trial|try\s*(for\s*)?free)\b/i,
  /\b(request|book|schedule)\s+(a\s+)?(demo|call|consultation)\b/i,
  /\b(contact\s+(sales|us)|create\s+(an?\s+)?account)\b/i,
];

// ────────────────────────────────────────────────────────────────
// 4. HELPERS
// ────────────────────────────────────────────────────────────────

// ─── Semaphore ───────────────────────────────────────────────────────────────

class Semaphore {
  private queue: Array<() => void> = [];
  private active = 0;

  constructor(private readonly limit: number) {}

  async acquire(): Promise<void> {
    if (this.active < this.limit) {
      this.active++;
      return;
    }
    return new Promise<void>((resolve) => {
      this.queue.push(() => {
        this.active++;
        resolve();
      });
    });
  }

  release(): void {
    this.active--;
    const next = this.queue.shift();
    if (next) next();
  }
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function log(verbose: boolean, msg: string): void {
  if (verbose) {
    const ts = new Date().toISOString().slice(11, 23);
    process.stderr.write(`[crawl ${ts}] ${msg}\n`);
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

function getPathPattern(path: string): string {
  const segments = path.split('/').filter(Boolean);
  return segments
    .map((seg) => (/^[a-z0-9-]+$/i.test(seg) && seg.length > 20 ? '*' : seg))
    .join('/');
}

function isResourceUrl(href: string): boolean {
  try {
    const pathname = new URL(href).pathname.toLowerCase();
    return Array.from(RESOURCE_EXTENSIONS).some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

// ─── Cookie Dismissal ────────────────────────────────────────────────────────

async function dismissCookieBanners(page: Page): Promise<void> {
  await page.evaluate((selectors: readonly string[]) => {
    const dismissIntent = /\b(reject|decline|deny|close|dismiss|necessary only|essential only|opt out|do not sell|continue without|without accepting)\b/i;
    const acceptIntent = /\b(accept all|accept|agree|allow all|allow|ok|got it)\b/i;
    const dismissQualifier = /\b(reject|decline|deny|without|necessary|essential|opt out|do not sell)\b/i;
    const banners = new Set<HTMLElement>();

    for (const sel of selectors) {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (el instanceof HTMLElement) banners.add(el);
        });
      } catch {
        // Ignore selectors unsupported by a browser version.
      }
    }

    for (const banner of banners) {
      const controls = banner.querySelectorAll(
        'button, [role="button"], a[href], [aria-label], [title]',
      );

      for (const control of controls) {
        if (!(control instanceof HTMLElement)) continue;
        const label = [
          control.textContent ?? '',
          control.getAttribute('aria-label') ?? '',
          control.getAttribute('title') ?? '',
        ].join(' ');

        if (!dismissIntent.test(label)) continue;
        if (acceptIntent.test(label) && !dismissQualifier.test(label)) continue;

        control.click();
        break;
      }

      // Hide consent UI for screenshots without granting consent for the user.
      banner.style.setProperty('display', 'none', 'important');
      banner.style.setProperty('visibility', 'hidden', 'important');
      banner.setAttribute('aria-hidden', 'true');
    }
  }, COOKIE_SELECTORS);
}

// ─── Page Loading ────────────────────────────────────────────────────────────

/** Wait until CSS variables and stylesheets stabilize (for SPA/CSS-in-JS) */
async function waitForCSSStable(page: Page, timeoutMs = 10_000): Promise<void> {
  const pollMs = 500;
  let prevCount = -1;
  let stableCount = 0;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const count: number = await page.evaluate(() => {
      const vars = getComputedStyle(document.documentElement);
      let n = document.styleSheets.length;
      // Count CSS custom properties as a stability signal
      for (let i = 0; i < vars.length; i++) {
        if (vars[i].startsWith('--')) n++;
      }
      return n;
    }).catch(() => -1);

    if (count === prevCount && count >= 0) {
      stableCount++;
      if (stableCount >= 2) return; // Stable for 2 consecutive polls
    } else {
      stableCount = 0;
    }
    prevCount = count;
    await new Promise((r) => setTimeout(r, pollMs));
  }
  // Timeout → continue anyway
}

async function loadPage(
  page: Page,
  url: string,
  waitStrategy?: WaitStrategy,
): Promise<{ status: number | null; error: string | null }> {
  try {
    // Try networkidle first, fall back to domcontentloaded on timeout
    let response;
    try {
      response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: NAV_TIMEOUT,
      });
    } catch (navErr: unknown) {
      const msg = navErr instanceof Error ? navErr.message : String(navErr);
      if (msg.includes('Timeout') || msg.includes('timeout')) {
        // Retry with less strict wait condition
        response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: NAV_TIMEOUT,
        });
        // Give extra time for rendering
        await delay(5000);
      } else {
        throw navErr;
      }
    }

    const status = response?.status() ?? null;

    // Wait for fonts
    await page.evaluate(() => document.fonts.ready).catch(() => {});

    // Wait for CSS-in-JS hydration
    if (waitStrategy === 'css') {
      await waitForCSSStable(page);
    } else if (waitStrategy?.startsWith('selector:')) {
      const sel = waitStrategy.slice('selector:'.length);
      await page.waitForSelector(sel, { timeout: 10_000 }).catch(() => {});
    } else {
      await delay(1000);
    }

    // Dismiss cookie banners
    await dismissCookieBanners(page);

    return { status, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: null, error: message };
  }
}

// ─── CAPTCHA Detection ───────────────────────────────────────────────────────

async function isCaptchaPage(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const captchaSelectors = [
      'iframe[src*="recaptcha"], .g-recaptcha',
      'iframe[src*="hcaptcha.com"], script[src*="hcaptcha.com"], .h-captcha',
      'iframe[src*="challenges.cloudflare.com"], script[src*="challenges.cloudflare.com"], .cf-turnstile, [name*="cf-turnstile" i], [name*="cf_chl" i], [id*="cf_chl" i], [class*="cf_chl" i], .cf-challenge-running, #challenge-running',
      'iframe[src*="arkoselabs.com"], script[src*="arkoselabs.com"], iframe[src*="funcaptcha"], [id*="funcaptcha" i], [class*="funcaptcha" i]',
      'iframe[src*="captcha-delivery.com"], script[src*="captcha-delivery.com"], [src*="datadome" i], [id*="datadome" i], [class*="datadome" i]',
      '[id*="px-captcha" i], [class*="px-captcha" i], [src*="perimeterx" i], [href*="perimeterx" i], [src*="_px"], [href*="_px"]',
    ];

    return captchaSelectors.some((selector) => {
      try {
        return document.querySelector(selector) !== null;
      } catch {
        return false;
      }
    });
  });
}

// ─── Link Discovery ─────────────────────────────────────────────────────────

interface DiscoveredLink {
  href: string;
  path: string;
  isNav: boolean;
}

async function discoverLinks(page: Page, domain: string): Promise<DiscoveredLink[]> {
  const raw = await page.evaluate((targetDomain: string) => {
    const results: Array<{ href: string; isNav: boolean }> = [];
    const anchors = document.querySelectorAll('a[href]');

    for (const a of anchors) {
      const href = (a as HTMLAnchorElement).href;
      if (!href) continue;

      const isNav = a.closest('nav') !== null;
      results.push({ href, isNav });
    }

    // Also check for links specifically from nav elements
    const navAnchors = document.querySelectorAll('nav a[href]');
    const navHrefs = new Set<string>();
    for (const a of navAnchors) {
      navHrefs.add((a as HTMLAnchorElement).href);
    }

    return results.map((r) => ({
      ...r,
      isNav: r.isNav || navHrefs.has(r.href),
    }));
  }, domain);

  const seen = new Set<string>();
  const links: DiscoveredLink[] = [];

  for (const { href, isNav } of raw) {
    try {
      const parsed = new URL(href);

      // Same domain only
      if (parsed.hostname !== domain) continue;

      // Skip anchors, mailto, tel
      if (parsed.protocol === 'mailto:' || parsed.protocol === 'tel:') continue;
      if (href.includes('#') && parsed.pathname === new URL(page.url()).pathname) continue;

      // Skip resource files
      if (isResourceUrl(href)) continue;

      const normalizedPath = normalizePath(parsed.pathname);
      if (seen.has(normalizedPath)) continue;
      seen.add(normalizedPath);

      links.push({
        href: `${parsed.origin}${normalizedPath}`,
        path: normalizedPath,
        isNav,
      });
    } catch {
      // Invalid URL, skip
    }
  }

  return links;
}

function prioritizeLinks(
  links: DiscoveredLink[],
  maxPages: number,
  rootUrl: string,
): string[] {
  const rootPath = '/';
  const selected: string[] = [];
  const usedPaths = new Set<string>();
  const usedPatterns = new Set<string>();

  // Helper to add a link if its path/pattern is unique
  const tryAdd = (link: DiscoveredLink): boolean => {
    if (usedPaths.has(link.path)) return false;
    const pattern = getPathPattern(link.path);
    if (usedPatterns.has(pattern)) return false;
    usedPaths.add(link.path);
    usedPatterns.add(pattern);
    selected.push(link.href);
    return true;
  };

  // Must: homepage
  const origin = new URL(rootUrl).origin;
  const homepage = links.find((l) => l.path === rootPath);
  if (homepage) {
    tryAdd(homepage);
  } else {
    selected.push(`${origin}/`);
    usedPaths.add(rootPath);
    usedPatterns.add('/');
  }

  // High priority paths
  for (const link of links) {
    if (selected.length >= maxPages) break;
    if (HIGH_PRIORITY_PATHS.has(link.path)) {
      tryAdd(link);
    }
  }

  // Nav links
  for (const link of links) {
    if (selected.length >= maxPages) break;
    if (link.isNav) {
      tryAdd(link);
    }
  }

  // Medium priority paths
  for (const link of links) {
    if (selected.length >= maxPages) break;
    if (MEDIUM_PRIORITY_PATHS.has(link.path) || matchesMediumPath(link.path)) {
      tryAdd(link);
    }
  }

  // Fill remaining with any other links
  for (const link of links) {
    if (selected.length >= maxPages) break;
    tryAdd(link);
  }

  return selected;
}

function matchesMediumPath(path: string): boolean {
  const lower = path.toLowerCase();
  return (
    lower.startsWith('/blog/') ||
    lower.startsWith('/changelog') ||
    lower.startsWith('/careers') ||
    lower.startsWith('/contact') ||
    lower.startsWith('/integrations') ||
    lower.startsWith('/about') ||
    lower.startsWith('/features')
  );
}

// ─── Lazy-Load Scrolling ─────────────────────────────────────────────────────

async function scrollForLazyLoad(page: Page): Promise<void> {
  const viewportHeight = page.viewportSize()?.height ?? 900;
  const step = Math.floor(viewportHeight * SCROLL_STEP_RATIO);

  let currentScroll = 0;
  while (currentScroll < MAX_SCROLL_HEIGHT) {
    currentScroll += step;
    await page.evaluate((y: number) => window.scrollTo(0, y), currentScroll);
    await delay(SCROLL_PAUSE_MS);

    // Check if we've reached the bottom
    const atBottom = await page.evaluate(
      () => window.scrollY + window.innerHeight >= document.body.scrollHeight - 10,
    );
    if (atBottom) break;
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(300);
}

// ─── Popup Triggering ────────────────────────────────────────────────────────

async function triggerDropdowns(
  page: Page,
): Promise<Record<string, string>[]> {
  const dropdowns: Record<string, string>[] = [];

  const navItems = await page.locator('nav > ul > li, nav > div > a, nav > ul > li > a').all();
  const itemsToHover = navItems.slice(0, 5);

  for (const item of itemsToHover) {
    try {
      await item.hover({ timeout: 2000 });
      await delay(500);

      // Check for visible floating menus
      const floatingStyles = await page.evaluate(() => {
        const candidates = document.querySelectorAll(
          '[class*="dropdown"], [class*="menu"], [class*="submenu"], [role="menu"], [class*="popover"]',
        );
        const results: Record<string, string>[] = [];

        for (const el of candidates) {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') continue;
          if (parseFloat(style.opacity) === 0) continue;

          results.push({
            display: style.display,
            position: style.position,
            backgroundColor: style.backgroundColor,
            borderRadius: style.borderRadius,
            boxShadow: style.boxShadow,
            padding: style.padding,
            zIndex: style.zIndex,
            width: style.width,
            maxHeight: style.maxHeight,
          });
        }

        return results;
      });

      dropdowns.push(...floatingStyles);
    } catch {
      // Hover failed, continue
    }
  }

  return dropdowns;
}

async function triggerModals(
  page: Page,
): Promise<Array<{ screenshot: Buffer; style: Record<string, string> }>> {
  const modals: Array<{ screenshot: Buffer; style: Record<string, string> }> = [];
  let modalCount = 0;

  const buttons = await page.locator(DESIGN_REVEAL_CONTROL_SELECTOR).all();

  for (const button of buttons) {
    if (modalCount >= MAX_MODALS) break;

    try {
      const candidate = await button.evaluate((el) => {
        const htmlEl = el as HTMLElement;
        const tagName = htmlEl.tagName.toLowerCase();
        const type = (htmlEl.getAttribute('type') ?? '').toLowerCase();
        const href = (htmlEl.getAttribute('href') ?? '').trim().toLowerCase();
        const role = (htmlEl.getAttribute('role') ?? '').toLowerCase();
        const className = htmlEl.getAttribute('class') ?? '';
        const value = htmlEl.getAttribute('value') ?? '';
        const revealAttributes = [
          'aria-haspopup',
          'aria-expanded',
          'aria-controls',
          'data-toggle',
          'data-bs-toggle',
          'data-accordion',
          'data-target',
          'data-state',
        ];
        const hasNavigatingHref = tagName === 'a'
          && href !== ''
          && href !== '#'
          && !href.startsWith('#')
          && !href.startsWith('javascript:');
        const hasRevealAttribute = revealAttributes.some((attr) => htmlEl.hasAttribute(attr))
          || role === 'tab';
        const intentText = [
          htmlEl.textContent ?? '',
          htmlEl.getAttribute('aria-label') ?? '',
          htmlEl.getAttribute('title') ?? '',
          htmlEl.id,
          className,
          htmlEl.getAttribute('name') ?? '',
          value,
          type,
          role,
          href,
        ].join(' ');

        return {
          intentText,
          hasNavigatingHref,
          hasRevealAttribute,
          isInsideForm: htmlEl.closest('form') !== null,
          isSubmitControl: type === 'submit',
        };
      });

      const hasActionIntent = STATE_CHANGING_ACTION_PATTERNS.some((pattern) => (
        pattern.test(candidate.intentText)
      ));
      if (
        candidate.isInsideForm
        || candidate.isSubmitControl
        || candidate.hasNavigatingHref
        || hasActionIntent
      ) {
        continue;
      }

      const hasRevealIntent = candidate.hasRevealAttribute
        || DESIGN_REVEAL_ATTRIBUTE_PATTERN.test(candidate.intentText)
        || DESIGN_REVEAL_PATTERNS.some((pattern) => pattern.test(candidate.intentText));
      if (!hasRevealIntent) continue;

      // Check visibility
      const isVisible = await button.isVisible();
      if (!isVisible) continue;

      await button.click({ timeout: 3000 });
      await delay(1000);

      // Check for modal/overlay
      const modalData = await page.evaluate(() => {
        const modalSelectors = [
          '[role="dialog"]', '[class*="modal"]', '[class*="dialog"]',
          '[class*="overlay"]', '[class*="drawer"]', '[class*="popover"]',
          '[class*="offcanvas"]', '[aria-modal="true"]', '[role="menu"]',
        ];

        for (const sel of modalSelectors) {
          const el = document.querySelector(sel);
          if (!el) continue;

          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') continue;

          return {
            found: true,
            style: {
              backgroundColor: style.backgroundColor,
              borderRadius: style.borderRadius,
              boxShadow: style.boxShadow,
              padding: style.padding,
              maxWidth: style.maxWidth,
              width: style.width,
              zIndex: style.zIndex,
              position: style.position,
            },
          };
        }

        return { found: false as const, style: {} as Record<string, string> };
      });

      if (modalData.found) {
        const screenshot = await page.screenshot({ fullPage: false });
        modals.push({ screenshot, style: modalData.style as Record<string, string> });
        modalCount++;
      }

      // Close modal
      await page.keyboard.press('Escape');
      await delay(500);
    } catch {
      // Button interaction failed, try to recover
      await page.keyboard.press('Escape').catch(() => {});
      await delay(300);
    }
  }

  return modals;
}

// ─── Multi-Viewport Screenshots ──────────────────────────────────────────────

type ViewportLabel = '1920' | '1440' | '768' | '375' | '320';

async function captureScreenshots(
  page: Page,
): Promise<Record<ViewportLabel, Buffer>> {
  const screenshots = {} as Record<ViewportLabel, Buffer>;

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await delay(500);

    // Cap full-page screenshot height
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const cappedHeight = Math.min(bodyHeight, MAX_SCROLL_HEIGHT);

    const buf = await page.screenshot({
      fullPage: true,
      clip: cappedHeight < bodyHeight
        ? { x: 0, y: 0, width: vp.width, height: cappedHeight }
        : undefined,
    });

    screenshots[vp.label] = buf;
  }

  // Restore default viewport
  await page.setViewportSize({ width: 1440, height: 900 });

  return screenshots;
}

// ─── Single Page Processing ──────────────────────────────────────────────────

async function processPage(
  browser: Browser,
  url: string,
  verbose: boolean,
  waitStrategy?: WaitStrategy,
  insecure = false,
): Promise<{ page: PageData | null; discoveredLinks: DiscoveredLink[]; error: string | null }> {
  const start = Date.now();
  log(verbose, `START ${url}`);

  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: 1440, height: 900 },
    // TLS validation stays on unless the caller explicitly opts into --insecure.
    ignoreHTTPSErrors: insecure,
  });

  const page = await context.newPage();
  const errors: string[] = [];

  try {
    // Load page
    const { status, error } = await loadPage(page, url, waitStrategy);

    // Rate-limit / forbidden: retry regardless of whether a navigation error was
    // raised. A clean forbidden or rate-limited response returns error === null,
    // so it must be checked before the error branch or that error page gets
    // crawled as a normal page.
    if (status === 403 || status === 429) {
      log(verbose, `RETRY (${status}) ${url}`);
      await delay(3000);
      const retry = await loadPage(page, url, waitStrategy);
      if (retry.error || retry.status === 403 || retry.status === 429) {
        return {
          page: null,
          discoveredLinks: [],
          error: `HTTP ${status} after retry: ${url}`,
        };
      }
      // Retry succeeded: the page now holds good content; fall through.
    } else if (error) {
      if (error.includes('Timeout') || error.includes('timeout')) {
        log(verbose, `TIMEOUT ${url}`);
        return { page: null, discoveredLinks: [], error: `Timeout: ${url}` };
      }
      return { page: null, discoveredLinks: [], error: `Navigation error: ${error}` };
    } else if (status !== null && status >= 400) {
      // Other client/server HTTP errors that are not the retryable forbidden
      // or rate-limited statuses handled above.
      return { page: null, discoveredLinks: [], error: `HTTP ${status}: ${url}` };
    }

    // CAPTCHA detection
    if (await isCaptchaPage(page)) {
      return { page: null, discoveredLinks: [], error: `CAPTCHA detected: ${url}` };
    }

    // Discover links (before scrolling changes state)
    const domain = getDomain(url);
    const discoveredLinks = await discoverLinks(page, domain);

    // Lazy-load scrolling
    await scrollForLazyLoad(page);

    // Trigger dropdowns
    const triggeredDropdowns = await triggerDropdowns(page);

    // Trigger modals
    const triggeredModals = await triggerModals(page);

    // Get HTML after all interactions
    const html = await page.content();

    // Multi-viewport screenshots
    const screenshots = await captureScreenshots(page);

    const loadTime = Date.now() - start;
    log(verbose, `DONE ${url} (${loadTime}ms)`);

    return {
      page: {
        url,
        html,
        screenshots,
        loadTime,
        triggeredModals,
        triggeredDropdowns,
        errors,
      },
      discoveredLinks,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    log(verbose, `ERROR ${url}: ${message}`);
    return { page: null, discoveredLinks: [], error: message };
  } finally {
    await context.close();
  }
}

// ────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ────────────────────────────────────────────────────────────────

// ─── Main Crawl Function ────────────────────────────────────────────────────

export async function crawlPages(
  urls: string[],
  options?: Partial<CrawlOptions>,
): Promise<CrawlResult> {
  const opts: CrawlOptions = { ...DEFAULT_OPTIONS, ...options };
  const totalStart = Date.now();

  const pages: PageData[] = [];
  const failedUrls: Array<{ url: string; reason: string }> = [];

  const browser = await chromium.launch({
    headless: true,
  });

  const semaphore = new Semaphore(opts.concurrency);
  const lastRequestByDomain = new Map<string, number>();

  try {
    // Build initial URL set: input URLs + extra URLs + root URLs
    const initialUrls = new Set<string>();
    for (const url of urls) {
      initialUrls.add(url);
      // Add root URL if input isn't root
      try {
        const parsed = new URL(url);
        const root = `${parsed.origin}/`;
        if (normalizePath(parsed.pathname) !== '/') {
          initialUrls.add(root);
        }
      } catch {
        // Invalid URL, still try it
      }
    }

    if (opts.extraUrls) {
      for (const url of opts.extraUrls) {
        initialUrls.add(url);
      }
    }

    // Phase 1: Crawl initial URLs to discover links
    const discoveryResults = await Promise.all(
      Array.from(initialUrls).map(async (url) => {
        await semaphore.acquire();
        try {
          await enforceDomainDelay(url, lastRequestByDomain);
          return processPage(browser, url, opts.verbose, opts.waitFor, opts.insecure ?? false);
        } finally {
          semaphore.release();
        }
      }),
    );

    // Collect results and discovered links
    const allDiscoveredLinks: DiscoveredLink[] = [];
    const crawledPaths = new Set<string>();

    for (const result of discoveryResults) {
      if (result.page) {
        pages.push(result.page);
        crawledPaths.add(normalizePath(new URL(result.page.url).pathname));
      }
      if (result.error) {
        const url = result.page?.url ?? '';
        if (url) {
          failedUrls.push({ url, reason: result.error });
        } else {
          // Find the matching URL from discoveryResults
          failedUrls.push({ url: result.error, reason: result.error });
        }
      }
      allDiscoveredLinks.push(...result.discoveredLinks);
    }

    // Rebuild failed URLs properly
    failedUrls.length = 0;
    for (let i = 0; i < discoveryResults.length; i++) {
      const result = discoveryResults[i];
      if (result.error) {
        failedUrls.push({
          url: Array.from(initialUrls)[i],
          reason: result.error,
        });
      }
    }

    // Phase 2: Prioritize and crawl discovered pages
    const remainingSlots = opts.maxPages - pages.length;

    if (remainingSlots > 0 && allDiscoveredLinks.length > 0) {
      // Filter out already-crawled paths
      const uncrawledLinks = allDiscoveredLinks.filter(
        (link) => !crawledPaths.has(link.path),
      );

      // Deduplicate across all discovery results
      const dedupedLinks = deduplicateLinks(uncrawledLinks);

      // Prioritize
      const rootUrl = urls[0];
      const prioritized = prioritizeLinks(dedupedLinks, remainingSlots, rootUrl);

      // Crawl prioritized pages
      const crawlResults = await Promise.all(
        prioritized.map(async (url) => {
          await semaphore.acquire();
          try {
            await enforceDomainDelay(url, lastRequestByDomain);
            return { url, result: await processPage(browser, url, opts.verbose, undefined, opts.insecure ?? false) };
          } finally {
            semaphore.release();
          }
        }),
      );

      for (const { url, result } of crawlResults) {
        if (result.page) {
          pages.push(result.page);
        }
        if (result.error) {
          failedUrls.push({ url, reason: result.error });
        }
      }
    }
  } finally {
    await browser.close();
  }

  const totalTime = Date.now() - totalStart;
  log(opts.verbose, `CRAWL COMPLETE: ${pages.length} pages in ${totalTime}ms`);

  return { pages, failedUrls, totalTime };
}

function deduplicateLinks(links: DiscoveredLink[]): DiscoveredLink[] {
  const seen = new Map<string, DiscoveredLink>();
  const seenPatterns = new Map<string, DiscoveredLink>();

  for (const link of links) {
    // Exact path dedup
    if (seen.has(link.path)) {
      // Keep nav links over non-nav
      if (link.isNav && !seen.get(link.path)!.isNav) {
        seen.set(link.path, link);
      }
      continue;
    }

    // Pattern dedup (e.g., /blog/post-1 and /blog/post-2 → keep one)
    const pattern = getPathPattern(link.path);
    if (seenPatterns.has(pattern)) continue;

    seen.set(link.path, link);
    seenPatterns.set(pattern, link);
  }

  return Array.from(seen.values());
}

async function enforceDomainDelay(
  url: string,
  lastRequestByDomain: Map<string, number>,
): Promise<void> {
  const domain = getDomain(url);
  if (!domain) return;

  const lastTime = lastRequestByDomain.get(domain);
  if (lastTime !== undefined) {
    const elapsed = Date.now() - lastTime;
    if (elapsed < SAME_DOMAIN_DELAY_MS) {
      await delay(SAME_DOMAIN_DELAY_MS - elapsed);
    }
  }

  lastRequestByDomain.set(domain, Date.now());
}
