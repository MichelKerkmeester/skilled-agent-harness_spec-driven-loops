import type { Page } from 'playwright';
import type { FrameworkDetection } from './types';

const TAILWIND_PATTERN =
  /^(?:sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|disabled:|dark:|group-hover:|peer-|first:|last:)*(?:bg|text|border|ring|shadow|rounded|p|m|w|h|flex|grid|gap|space|divide|font|leading|tracking|z|opacity|transition|duration|ease|scale|rotate|translate|skew)-/;

const JIT_PATTERN = /\[.+\]/;

interface TailwindResult {
  detected: boolean;
  matchCount: number;
  sampleClasses: string[];
  jitDetected: boolean;
}

async function detectTailwind(page: Page): Promise<TailwindResult | null> {
  const result = await page.evaluate(
    ({ patternSource, jitSource }) => {
      const twPattern = new RegExp(patternSource);
      const jitPattern = new RegExp(jitSource);

      const classSet = new Set<string>();
      const allEls = document.querySelectorAll('*');

      for (let i = 0; i < allEls.length; i++) {
        const el = allEls[i];
        const classList = el.getAttribute('class');
        if (!classList) continue;

        const classes = classList.split(/\s+/);
        for (const cls of classes) {
          if (cls) classSet.add(cls);
        }
      }

      const matches: string[] = [];
      let jitDetected = false;

      for (const cls of classSet) {
        if (twPattern.test(cls)) {
          matches.push(cls);
        }
        if (jitPattern.test(cls)) {
          jitDetected = true;
        }
      }

      return {
        matchCount: matches.length,
        sampleClasses: matches.slice(0, 50),
        jitDetected,
      };
    },
    { patternSource: TAILWIND_PATTERN.source, jitSource: JIT_PATTERN.source },
  );

  if (result.matchCount <= 20) {
    return null;
  }

  return {
    detected: true,
    matchCount: result.matchCount,
    sampleClasses: result.sampleClasses,
    jitDetected: result.jitDetected,
  };
}

interface UIFrameworkCheck {
  name: string;
  selector: string;
}

const UI_FRAMEWORK_CHECKS: readonly UIFrameworkCheck[] = [
  { name: 'Material UI', selector: '[class*="MuiButton"], [class*="MuiPaper"]' },
  { name: 'Chakra UI', selector: '[class*="chakra-"]' },
  { name: 'Ant Design', selector: '[class*="ant-btn"], [class*="ant-card"]' },
  { name: 'Bootstrap', selector: '[class*="btn-primary"], [class*="container-fluid"]' },
  { name: 'Radix UI', selector: '[data-radix-popper-content-wrapper], [data-radix-collection-item]' },
  { name: 'shadcn/ui', selector: '[data-slot]' },
  { name: 'Headless UI', selector: '[data-headlessui-state]' },
] as const;

async function detectUIFramework(page: Page): Promise<string | null> {
  for (const check of UI_FRAMEWORK_CHECKS) {
    const count = await page.locator(check.selector).count();
    if (count > 0) {
      return check.name;
    }
  }

  return null;
}

const DESIGN_SYSTEM_PATHS = [
  '/design-system',
  '/design',
  '/brand',
  '/style-guide',
  '/design-tokens',
] as const;

async function detectDesignSystemUrl(page: Page): Promise<string | null> {
  const baseUrl = new URL(page.url()).origin;
  const request = page.context().request;

  for (const path of DESIGN_SYSTEM_PATHS) {
    const url = `${baseUrl}${path}`;
    try {
      const response = await request.head(url, { timeout: 3000 });
      if (response.status() === 200) {
        return url;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function detectFramework(page: Page): Promise<FrameworkDetection> {
  const [tailwind, uiFramework, designSystemUrl] = await Promise.all([
    detectTailwind(page),
    detectUIFramework(page),
    detectDesignSystemUrl(page),
  ]);

  return {
    tailwind,
    uiFramework,
    designSystemUrl,
  };
}
