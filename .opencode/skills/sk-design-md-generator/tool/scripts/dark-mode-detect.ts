import type { Page } from 'playwright';
import type { CSSAnalysis, CSSVariable, DarkModeData } from './types';

const VIEWPORTS = [1920, 1440, 768, 375, 320] as const;

type DetectionMethod = DarkModeData['detectionMethod'];

interface DetectionResult {
  method: DetectionMethod;
  switchAction: 'media-query' | 'class-toggle' | 'data-attr' | 'toggle-button';
}

async function collectCSSVariables(page: Page): Promise<CSSVariable[]> {
  return page.evaluate(() => {
    const variables: { name: string; value: string; source: string; context?: string }[] = [];
    const themePattern = /dark|theme|mode/i;

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
  });
}

async function detectMethod(
  page: Page,
  cssAnalysis: CSSAnalysis,
): Promise<DetectionResult | null> {
  // 1. CSS media query
  const hasMediaQuery = cssAnalysis.mediaBreakpoints.some(
    (bp) => bp.type === 'prefers-color-scheme' || bp.query.includes('prefers-color-scheme: dark'),
  );
  if (hasMediaQuery) {
    return { method: 'media-query', switchAction: 'media-query' };
  }

  // 2. HTML attributes
  const attrResult = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;

    for (const el of [html, body]) {
      const dataTheme = el.getAttribute('data-theme');
      const dataMode = el.getAttribute('data-mode');

      if (dataTheme !== null) {
        return { method: 'data-attr' as const, attr: 'data-theme', current: dataTheme };
      }
      if (dataMode !== null) {
        return { method: 'data-attr' as const, attr: 'data-mode', current: dataMode };
      }

      const classList = Array.from(el.classList);
      const hasLightClass = classList.some((c) => /\blight\b/i.test(c));
      const hasDarkClass = classList.some((c) => /\bdark\b/i.test(c));

      if (hasLightClass || hasDarkClass) {
        return { method: 'class-toggle' as const, attr: null, current: hasDarkClass ? 'dark' : 'light' };
      }
    }

    return null;
  });

  if (attrResult) {
    const switchAction = attrResult.method === 'class-toggle' ? 'class-toggle' : 'data-attr';
    return { method: attrResult.method, switchAction };
  }

  // 3. Toggle button
  const toggleFound = await page.evaluate(() => {
    const pattern = /dark|theme|mode|light/i;
    const candidates = document.querySelectorAll('button, [role="switch"], [role="button"], input[type="checkbox"]');

    for (let i = 0; i < candidates.length; i++) {
      const el = candidates[i];
      const text = el.textContent?.trim() ?? '';
      const ariaLabel = el.getAttribute('aria-label') ?? '';
      const title = el.getAttribute('title') ?? '';

      if (pattern.test(text) || pattern.test(ariaLabel) || pattern.test(title)) {
        return true;
      }
    }

    return false;
  });

  if (toggleFound) {
    return { method: 'toggle-button', switchAction: 'toggle-button' };
  }

  return null;
}

async function switchToDarkMode(page: Page, action: DetectionResult['switchAction']): Promise<void> {
  switch (action) {
    case 'media-query':
      await page.emulateMedia({ colorScheme: 'dark' });
      break;

    case 'class-toggle':
      await page.evaluate(() => {
        const html = document.documentElement;
        html.classList.remove('light');
        html.classList.add('dark');
      });
      break;

    case 'data-attr':
      await page.evaluate(() => {
        const html = document.documentElement;
        if (html.hasAttribute('data-theme')) {
          html.setAttribute('data-theme', 'dark');
        } else if (html.hasAttribute('data-mode')) {
          html.setAttribute('data-mode', 'dark');
        } else {
          html.setAttribute('data-theme', 'dark');
        }
      });
      break;

    case 'toggle-button': {
      const pattern = /dark|theme|mode|light/i;
      const toggle = page.locator(
        'button, [role="switch"], [role="button"], input[type="checkbox"]',
      ).filter({
        has: page.locator(':scope'),
        hasText: pattern,
      }).first();

      const ariaToggle = page.locator(
        '[aria-label*="dark" i], [aria-label*="theme" i], [aria-label*="mode" i], [aria-label*="light" i]',
      ).first();

      const target = (await toggle.count()) > 0 ? toggle : ariaToggle;
      if ((await target.count()) > 0) {
        await target.click();
      }
      break;
    }
  }

  await page.waitForTimeout(500);
}

function buildVariableDiff(
  lightVars: CSSVariable[],
  darkVars: CSSVariable[],
): { name: string; lightValue: string; darkValue: string }[] {
  const lightMap = new Map<string, string>();
  for (const v of lightVars) {
    lightMap.set(v.name, v.value);
  }

  const diff: { name: string; lightValue: string; darkValue: string }[] = [];

  for (const darkVar of darkVars) {
    const lightValue = lightMap.get(darkVar.name);
    if (lightValue !== undefined && lightValue !== darkVar.value) {
      diff.push({ name: darkVar.name, lightValue, darkValue: darkVar.value });
    }
  }

  return diff;
}

async function captureDarkScreenshots(page: Page): Promise<Record<string, Buffer>> {
  const screenshots: Record<string, Buffer> = {};

  for (const width of VIEWPORTS) {
    await page.setViewportSize({ width, height: 900 });
    screenshots[String(width)] = await page.screenshot({ fullPage: true });
  }

  return screenshots;
}

export async function detectDarkMode(
  page: Page,
  cssAnalysis: CSSAnalysis,
): Promise<DarkModeData> {
  const detection = await detectMethod(page, cssAnalysis);

  if (!detection) {
    return {
      supported: false,
      detectionMethod: 'none',
      lightVariables: [],
      darkVariables: [],
      variableDiff: [],
      darkScreenshots: null,
    };
  }

  const lightVariables = await collectCSSVariables(page);

  await switchToDarkMode(page, detection.switchAction);

  const darkVariables = await collectCSSVariables(page);
  const variableDiff = buildVariableDiff(lightVariables, darkVariables);
  const darkScreenshots = await captureDarkScreenshots(page);

  return {
    supported: true,
    detectionMethod: detection.method,
    lightVariables,
    darkVariables,
    variableDiff,
    darkScreenshots,
  };
}
