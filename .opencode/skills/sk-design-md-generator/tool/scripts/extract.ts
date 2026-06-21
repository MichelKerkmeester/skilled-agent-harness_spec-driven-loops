import * as path from 'path';
import * as fs from 'fs';
import { crawlPages, type WaitStrategy } from './crawl';
import { collectDOM } from './dom-collector';
import { analyzeCSS } from './css-analyzer';
import { captureInteractions } from './interaction-capture';
import { detectDarkMode } from './dark-mode-detect';
import { detectFramework } from './framework-detect';
import { detectIcons } from './icon-detect';
import { extractMotion } from './motion-extract';
import { extractA11y } from './a11y-extract';
import { clusterTokens, mergeTokenSets } from './cluster';
import { detectBoundaries } from './design-boundary-detect';
import type {
  DOMCollection,
  CSSAnalysis,
  InteractionData,
  DarkModeData,
  FrameworkDetection,
  IconSystemInfo,
  MotionSystem,
  A11yTokens,
  DesignTokens,
  DesignBoundary,
  ExtractionReport,
  CSSVariable,
} from './types';

// ─── CLI Argument Parsing ─────────────────────────────────────────────────────

interface ExtractOptions {
  urls: string[];
  output: string;
  concurrency: number;
  maxPages: number;
  extraUrls: string[];
  noDarkMode: boolean;
  noInteraction: boolean;
  verbose: boolean;
  waitFor?: WaitStrategy;
  mergeWith?: string;
}

function parseArgs(argv: string[]): ExtractOptions {
  const args = argv.slice(2);
  const urls: string[] = [];
  let output = '';
  let concurrency = 5;
  let maxPages = 8;
  const extraUrls: string[] = [];
  let noDarkMode = false;
  let noInteraction = true;
  let verbose = false;
  let waitFor: WaitStrategy | undefined;
  let mergeWith: string | undefined;

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else if (arg === '--output') {
      output = args[++i];
    } else if (arg === '--concurrency') {
      concurrency = parseInt(args[++i], 10);
    } else if (arg === '--max-pages') {
      maxPages = parseInt(args[++i], 10);
    } else if (arg === '--extra-urls') {
      const file = args[++i];
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        extraUrls.push(...content.split('\n').map(l => l.trim()).filter(Boolean));
      }
    } else if (arg === '--wait-for') {
      const val = args[++i] as WaitStrategy;
      waitFor = val;
    } else if (arg === '--merge-with') {
      mergeWith = args[++i];
    } else if (arg === '--no-dark-mode') {
      noDarkMode = true;
    } else if (arg === '--no-interaction') {
      // Already the default; kept for backward compatibility
      noInteraction = true;
    } else if (arg === '--with-interaction') {
      noInteraction = false;
    } else if (arg === '--fast') {
      maxPages = 5;
      noInteraction = true;
      concurrency = 8;
    } else if (arg === '--verbose') {
      verbose = true;
    } else if (!arg.startsWith('--')) {
      urls.push(arg);
    }
    i++;
  }

  if (urls.length === 0) {
    printUsage();
    process.exit(1);
  }

  // Normalize URLs
  const normalizedUrls = urls.map(u => {
    if (!u.startsWith('http://') && !u.startsWith('https://')) {
      return `https://${u}`;
    }
    return u;
  });

  // Auto-add root URL if input isn't root
  for (const url of [...normalizedUrls]) {
    const parsed = new URL(url);
    if (parsed.pathname !== '/' && parsed.pathname !== '') {
      const root = `${parsed.protocol}//${parsed.host}`;
      if (!normalizedUrls.includes(root) && !normalizedUrls.includes(root + '/')) {
        normalizedUrls.unshift(root);
      }
    }
  }

  // Default output directory
  if (!output) {
    const domain = new URL(normalizedUrls[0]).hostname;
    output = path.join('output', domain);
  }

  return {
    urls: normalizedUrls,
    output,
    concurrency,
    maxPages,
    extraUrls,
    noDarkMode,
    noInteraction,
    verbose,
    waitFor,
    mergeWith,
  };
}

function printUsage(): void {
  console.log(`
Usage: npx ts-node scripts/extract.ts <url1> [url2] [url3] ...

Options:
  --output <dir>         Output directory (default: output/<domain>/)
  --concurrency <n>      Playwright concurrency (default: 5)
  --max-pages <n>        Max pages to crawl (default: 8)
  --extra-urls <file>    File with additional URLs (one per line)
  --wait-for <strategy>  Wait strategy: networkidle (default), css, selector:<css>
  --merge-with <path>    Merge with existing tokens.json (incremental extraction)
  --no-dark-mode         Skip dark mode detection
  --no-interaction       Skip interaction state capture (default: skipped)
  --with-interaction     Enable interaction state capture (hover/focus/active)
  --fast                 Fast mode: maxPages=5, noInteraction, concurrency=8
  --verbose              Detailed logging
  --help, -h             Show this help
`);
}

function log(verbose: boolean, ...args: unknown[]): void {
  if (verbose) {
    console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...args);
  }
}

// ─── Main Extraction Pipeline ─────────────────────────────────────────────────

interface PageExtraction {
  url: string;
  dom: DOMCollection;
  css?: CSSAnalysis;
  interactions?: InteractionData;
}

async function extract(options: ExtractOptions): Promise<void> {
  const startTime = Date.now();
  console.log(`\n  Design MD Generator — Extracting design tokens\n`);
  console.log(`  URLs: ${options.urls.join(', ')}`);
  console.log(`  Output: ${options.output}`);
  console.log(`  Max pages: ${options.maxPages}`);
  console.log('');

  // Ensure output directory exists
  fs.mkdirSync(options.output, { recursive: true });
  fs.mkdirSync(path.join(options.output, 'screenshots'), { recursive: true });
  fs.mkdirSync(path.join(options.output, 'screenshots', 'dark'), { recursive: true });

  // ── Step 1-3: Crawl pages ────────────────────────────────────────────────

  log(options.verbose, 'Starting page crawl...');
  const crawlResult = await crawlPages(options.urls, {
    maxPages: options.maxPages,
    concurrency: options.concurrency,
    extraUrls: options.extraUrls,
    verbose: options.verbose,
    waitFor: options.waitFor,
  });

  console.log(`  Crawled ${crawlResult.pages.length} pages in ${(crawlResult.totalTime / 1000).toFixed(1)}s`);
  if (crawlResult.failedUrls.length > 0) {
    console.log(`  Failed: ${crawlResult.failedUrls.length} URLs`);
    for (const f of crawlResult.failedUrls) {
      console.log(`    - ${f.url}: ${f.reason}`);
    }
  }

  if (crawlResult.pages.length === 0) {
    console.error('\n  ERROR: No pages successfully crawled. Exiting.');
    process.exit(1);
  }

  // Save screenshots
  for (const page of crawlResult.pages) {
    const slug = urlToSlug(page.url);
    for (const [viewport, buffer] of Object.entries(page.screenshots)) {
      const filename = `${slug}-${viewport}.png`;
      fs.writeFileSync(path.join(options.output, 'screenshots', filename), buffer);
    }
  }
  log(options.verbose, 'Screenshots saved.');

  // ── Step 4-5: DOM collection + CSS analysis (per page) ───────────────────

  log(options.verbose, 'Starting DOM collection and CSS analysis...');

  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });

  const pageExtractions: PageExtraction[] = [];
  let totalElements = 0;

  for (const pageData of crawlResult.pages) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();

    try {
      log(options.verbose, `  Extracting: ${pageData.url}`);
      await page.goto(pageData.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000);

      // DOM collection
      const dom = await collectDOM(page);
      totalElements += dom.elements.length;

      // CSS analysis
      let css: CSSAnalysis | undefined;
      try {
        css = await analyzeCSS(page);
      } catch (err) {
        log(options.verbose, `    CSS analysis failed: ${err}`);
      }

      // Interaction capture
      let interactions: InteractionData | undefined;
      if (!options.noInteraction) {
        try {
          interactions = await captureInteractions(page);
        } catch (err) {
          log(options.verbose, `    Interaction capture failed: ${err}`);
        }
      }

      pageExtractions.push({ url: pageData.url, dom, css, interactions });
    } catch (err) {
      console.log(`    WARN: Extraction failed for ${pageData.url}: ${err}`);
    } finally {
      await context.close();
    }
  }

  console.log(`  Extracted ${totalElements} elements from ${pageExtractions.length} pages`);

  // ── Step 7: Dark mode detection (multi-page fallback) ─────────────────────

  let darkModeData: DarkModeData = {
    supported: false,
    detectionMethod: 'none',
    lightVariables: [],
    darkVariables: [],
    variableDiff: [],
    darkScreenshots: null,
  };

  if (!options.noDarkMode && pageExtractions.length > 0) {
    log(options.verbose, 'Detecting dark mode...');

    // Try pages in order: homepage first, then others until dark mode is found
    const pagesToTry = pageExtractions
      .map((pe, i) => ({ url: pe.url, css: pe.css, index: i }))
      .filter((p) => p.css);

    for (const candidate of pagesToTry) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      });
      const page = await context.newPage();
      try {
        await page.goto(candidate.url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1000);
        darkModeData = await detectDarkMode(page, candidate.css!);

        if (darkModeData.supported) {
          (darkModeData as DarkModeData & { detectionSource?: string }).detectionSource = candidate.url;
          console.log(`  Dark mode: detected (${darkModeData.detectionMethod}) on ${candidate.url}`);

          // Save dark mode screenshots
          if (darkModeData.darkScreenshots) {
            for (const [viewport, buffer] of Object.entries(darkModeData.darkScreenshots)) {
              const slug = candidate.index === 0 ? 'homepage' : `page-${candidate.index}`;
              const filename = `${slug}-dark-${viewport}.png`;
              fs.writeFileSync(path.join(options.output, 'screenshots', 'dark', filename), buffer);
            }
          }
          break; // Found dark mode, stop searching
        } else {
          log(options.verbose, `  No dark mode on ${candidate.url}, trying next page...`);
        }
      } catch (err) {
        log(options.verbose, `  Dark mode detection failed on ${candidate.url}: ${err}`);
      } finally {
        await context.close();
      }
    }

    if (!darkModeData.supported) {
      console.log('  Dark mode: not detected on any page');
    }
  }

  // ── Step 8: Framework detection (first page only) ────────────────────────

  let frameworkData: FrameworkDetection = { tailwind: null, uiFramework: null, designSystemUrl: null };

  if (pageExtractions.length > 0) {
    log(options.verbose, 'Detecting frameworks...');
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    try {
      await page.goto(options.urls[0], { waitUntil: 'networkidle', timeout: 30000 });
      frameworkData = await detectFramework(page);
      const parts: string[] = [];
      if (frameworkData.tailwind?.detected) parts.push('Tailwind CSS');
      if (frameworkData.uiFramework) parts.push(frameworkData.uiFramework);
      console.log(`  Framework: ${parts.length > 0 ? parts.join(' + ') : 'none detected'}`);
    } catch (err) {
      log(options.verbose, `  Framework detection failed: ${err}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();

  // ── Step 9-11: Aggregate analysis ────────────────────────────────────────

  log(options.verbose, 'Aggregating analysis...');

  const domCollections = pageExtractions.map(p => p.dom);
  const cssAnalyses = pageExtractions.map(p => p.css).filter((c): c is CSSAnalysis => !!c);
  const interactionSets = pageExtractions.map(p => p.interactions).filter((i): i is InteractionData => !!i);

  // Icon system
  const iconSystem = detectIcons(domCollections);
  if (iconSystem) {
    console.log(`  Icons: ${iconSystem.library ?? 'custom'} (${iconSystem.totalCount} SVGs)`);
  }

  // Motion system
  const motionSystem = cssAnalyses.length > 0 ? extractMotion(cssAnalyses[0], domCollections) : null;
  if (motionSystem) {
    console.log(`  Motion: ${motionSystem.durationScale.length} duration tiers, ${motionSystem.keyframeAnimations.length} animations`);
  }

  // Accessibility
  const a11yTokens = extractA11y(domCollections, interactionSets);

  // ── Step 12: Cluster tokens ──────────────────────────────────────────────

  log(options.verbose, 'Clustering tokens...');

  const allCssVariables: CSSVariable[] = [];
  for (const dom of domCollections) {
    allCssVariables.push(...dom.cssVariables);
  }

  const tokens = clusterTokens(pageExtractions, allCssVariables);

  // Merge in additional data
  tokens.meta = {
    sourceUrls: options.urls,
    totalPages: pageExtractions.length,
    extractionDate: new Date().toISOString(),
    framework: frameworkData,
    totalElements: totalElements,
    extractionTime: Date.now() - startTime,
  };
  tokens.iconSystem = iconSystem;
  tokens.motionSystem = motionSystem;
  tokens.a11yTokens = a11yTokens;
  tokens.darkMode = darkModeData;
  tokens.breakpoints = cssAnalyses.flatMap(c => c.mediaBreakpoints);

  // Deduplicate breakpoints
  const bpMap = new Map<string, typeof tokens.breakpoints[0]>();
  for (const bp of tokens.breakpoints) {
    const key = `${bp.type}:${bp.value}`;
    const existing = bpMap.get(key);
    if (existing) {
      existing.ruleCount += bp.ruleCount;
    } else {
      bpMap.set(key, { ...bp });
    }
  }
  tokens.breakpoints = Array.from(bpMap.values());

  console.log(`  Colors: ${tokens.colorTokens.length} tokens`);
  console.log(`  Typography: ${tokens.typographyLevels.length} levels`);
  console.log(`  Components: ${tokens.components.length} types`);
  console.log(`  Shadows: ${tokens.shadowTokens.length} tokens`);
  console.log(`  Radii: ${tokens.radiusTokens.length} tokens`);

  // ── Step 13: Design boundary detection ───────────────────────────────────

  log(options.verbose, 'Detecting design boundaries...');

  const domainGroups = new Map<string, string[]>();
  for (const pe of pageExtractions) {
    const host = new URL(pe.url).hostname;
    const existing = domainGroups.get(host);
    if (existing) {
      existing.push(pe.url);
    } else {
      domainGroups.set(host, [pe.url]);
    }
  }

  const pageGroups = Array.from(domainGroups.entries()).map(([domain, urls]) => ({
    label: domain,
    urls,
    colorTokens: tokens.colorTokens,
    typographyLevels: tokens.typographyLevels,
    components: tokens.components,
    spacingSystem: tokens.spacingSystem,
    radiusTokens: tokens.radiusTokens,
    shadowTokens: tokens.shadowTokens,
    fontFamilies: [...new Set(tokens.typographyLevels.map(t => t.fontFamily))],
  }));

  const boundary = detectBoundaries(pageGroups);
  console.log(`  Design boundary: ${boundary.relationship} (similarity: ${boundary.overallSimilarity.toFixed(0)}%)`);

  // ── Step 14: Write output files ──────────────────────────────────────────

  log(options.verbose, 'Writing output files...');

  // tokens.json (main output for Claude Code)
  let finalTokens = tokens;
  if (options.mergeWith && fs.existsSync(options.mergeWith)) {
    log(options.verbose, `Merging with existing tokens from ${options.mergeWith}...`);
    const existingTokens: DesignTokens = JSON.parse(fs.readFileSync(options.mergeWith, 'utf-8'));
    finalTokens = mergeTokenSets(existingTokens, tokens);
    console.log(`  Merged: ${existingTokens.colorTokens.length} existing + ${tokens.colorTokens.length} new → ${finalTokens.colorTokens.length} colors`);
  }
  fs.writeFileSync(
    path.join(options.output, 'tokens.json'),
    JSON.stringify(finalTokens, null, 2),
  );

  // raw-data.json (full raw data for debugging)
  const rawData = {
    pages: pageExtractions.map(pe => ({
      url: pe.url,
      elementCount: pe.dom.elements.length,
      cssVariableCount: pe.dom.cssVariables.length,
      gradientCount: pe.dom.gradients.length,
      svgCount: pe.dom.svgSizes.length,
      cssRuleCount: pe.css?.totalRuleCount ?? 0,
      interactionCount: pe.interactions?.captures.length ?? 0,
    })),
  };
  fs.writeFileSync(
    path.join(options.output, 'raw-data.json'),
    JSON.stringify(rawData, null, 2),
  );

  // extraction-report.json
  const report: ExtractionReport = {
    startTime: new Date(startTime).toISOString(),
    endTime: new Date().toISOString(),
    totalDuration: Date.now() - startTime,
    sourceUrls: options.urls,
    pagesDiscovered: crawlResult.pages.length + crawlResult.failedUrls.length,
    pagesCrawled: crawlResult.pages.length,
    failedPages: crawlResult.failedUrls,
    totalElements,
    framework: frameworkData,
    darkModeSupported: darkModeData.supported,
    screenshotCount: crawlResult.pages.length * 5 + (darkModeData.darkScreenshots ? 5 : 0),
    designBoundary: boundary,
    warnings: [],
  };

  if (tokens.colorTokens.length < 10) {
    report.warnings.push('Low color token count — consider adding more pages');
  }
  if (tokens.typographyLevels.length < 3) {
    report.warnings.push('Low typography level count — may need more diverse pages');
  }

  fs.writeFileSync(
    path.join(options.output, 'extraction-report.json'),
    JSON.stringify(report, null, 2),
  );

  // ── Summary ──────────────────────────────────────────────────────────────

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n  Extraction complete in ${elapsed}s`);
  console.log(`  Output: ${path.resolve(options.output)}`);
  console.log(`  Files: tokens.json, extraction-report.json, ${crawlResult.pages.length * 5} screenshots`);
  console.log('');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function urlToSlug(url: string): string {
  const parsed = new URL(url);
  const p = parsed.pathname === '/' ? 'homepage' : parsed.pathname.replace(/^\//, '').replace(/\//g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  return p || 'homepage';
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const options = parseArgs(process.argv);
  extract(options).catch(err => {
    console.error('\n  FATAL ERROR:', err.message || err);
    if (options.verbose) {
      console.error(err.stack);
    }
    process.exit(1);
  });
}

export { extract, parseArgs, type ExtractOptions, type PageExtraction };
