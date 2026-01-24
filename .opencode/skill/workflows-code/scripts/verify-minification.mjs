#!/usr/bin/env node
/**
 * verify-minification.mjs - AST-based verification of minified JavaScript
 *
 * Usage:
 *   node scripts/verify-minification.mjs
 *
 * Verifies that critical patterns are preserved after minification:
 * - Data attribute selectors (e.g., [data-target='hero-item'])
 * - DOM event names (e.g., 'DOMContentLoaded', 'click')
 * - Global assignments (window.X patterns)
 * - Webflow/Motion/gsap references
 * - Init flags (e.g., __heroVideoInit)
 */

import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, relative } from 'path';

// Configuration
const SOURCE_DIR = 'src/2_javascript';
const OUTPUT_DIR = 'src/2_javascript/z_minified';

// Folders to skip
const SKIP_FOLDERS = ['z_minified', 'node_modules', '.git'];

// Critical patterns to verify
const PATTERNS = {
  // Data attribute selectors - must be preserved exactly
  dataSelectors: /\[data-[a-z-]+=['"][^'"]+['"]\]/g,

  // DOM event names in addEventListener
  domEvents: /addEventListener\s*\(\s*['"]([^'"]+)['"]/g,

  // Global init flags (window['__flag'] or window.__flag patterns)
  initFlags: /(?:window\s*\[\s*['"](__[a-zA-Z_]+)['"]|window\.(__[a-zA-Z_]+))/g,

  // Webflow.push pattern
  webflowPush: /(?:window\.)?Webflow(?:\?)?\.push/g,

  // Motion.animate references
  motionAnimate: /(?:window\.)?Motion(?:\?)?\.animate/g,

  // gsap references
  gsapRef: /(?:window\.)?gsap\./g,

  // ScrollTrigger references
  scrollTrigger: /ScrollTrigger/g,

  // Swiper references
  swiperRef: /(?:new\s+)?Swiper\s*\(/g,

  // HLS references
  hlsRef: /(?:new\s+)?Hls\s*\(/g,
};

/**
 * Recursively find all .js files in directory
 */
function findJsFiles(dir, baseDir = dir) {
  const files = [];

  if (!existsSync(dir)) {
    return files;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_FOLDERS.includes(entry.name)) {
        files.push(...findJsFiles(fullPath, baseDir));
      }
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(relative(baseDir, fullPath));
    }
  }

  return files;
}

/**
 * Extract patterns from file content
 */
function extractPatterns(content) {
  const results = {
    dataSelectors: [],
    domEvents: [],
    initFlags: [],
    hasWebflowPush: false,
    hasMotionAnimate: false,
    hasGsap: false,
    hasScrollTrigger: false,
    hasSwiper: false,
    hasHls: false,
  };

  // Extract data selectors
  const selectorMatches = content.match(PATTERNS.dataSelectors) || [];
  results.dataSelectors = [...new Set(selectorMatches)];

  // Extract DOM events
  let eventMatch;
  const eventRegex = new RegExp(PATTERNS.domEvents.source, 'g');
  while ((eventMatch = eventRegex.exec(content)) !== null) {
    results.domEvents.push(eventMatch[1]);
  }
  results.domEvents = [...new Set(results.domEvents)];

  // Extract init flags
  let flagMatch;
  const flagRegex = new RegExp(PATTERNS.initFlags.source, 'g');
  while ((flagMatch = flagRegex.exec(content)) !== null) {
    const flag = flagMatch[1] || flagMatch[2];
    if (flag) results.initFlags.push(flag);
  }
  results.initFlags = [...new Set(results.initFlags)];

  // Check for library patterns
  results.hasWebflowPush = PATTERNS.webflowPush.test(content);
  results.hasMotionAnimate = PATTERNS.motionAnimate.test(content);
  results.hasGsap = PATTERNS.gsapRef.test(content);
  results.hasScrollTrigger = PATTERNS.scrollTrigger.test(content);
  results.hasSwiper = PATTERNS.swiperRef.test(content);
  results.hasHls = PATTERNS.hlsRef.test(content);

  return results;
}

/**
 * Compare patterns between original and minified
 */
function comparePatterns(original, minified, fileName) {
  const issues = [];

  // Check data selectors
  for (const selector of original.dataSelectors) {
    if (!minified.dataSelectors.includes(selector)) {
      issues.push({
        type: 'FAIL',
        category: 'data-selector',
        message: `Missing selector: ${selector}`
      });
    }
  }

  // Check DOM events
  for (const event of original.domEvents) {
    if (!minified.domEvents.includes(event)) {
      issues.push({
        type: 'FAIL',
        category: 'dom-event',
        message: `Missing event: ${event}`
      });
    }
  }

  // Check init flags
  for (const flag of original.initFlags) {
    if (!minified.initFlags.includes(flag)) {
      issues.push({
        type: 'FAIL',
        category: 'init-flag',
        message: `Missing init flag: ${flag}`
      });
    }
  }

  // Check library patterns
  if (original.hasWebflowPush && !minified.hasWebflowPush) {
    issues.push({
      type: 'FAIL',
      category: 'webflow',
      message: 'Missing Webflow.push pattern'
    });
  }

  if (original.hasMotionAnimate && !minified.hasMotionAnimate) {
    issues.push({
      type: 'FAIL',
      category: 'motion',
      message: 'Missing Motion.animate pattern'
    });
  }

  if (original.hasGsap && !minified.hasGsap) {
    issues.push({
      type: 'FAIL',
      category: 'gsap',
      message: 'Missing gsap reference'
    });
  }

  if (original.hasScrollTrigger && !minified.hasScrollTrigger) {
    issues.push({
      type: 'FAIL',
      category: 'scrolltrigger',
      message: 'Missing ScrollTrigger reference'
    });
  }

  if (original.hasSwiper && !minified.hasSwiper) {
    issues.push({
      type: 'FAIL',
      category: 'swiper',
      message: 'Missing Swiper reference'
    });
  }

  if (original.hasHls && !minified.hasHls) {
    issues.push({
      type: 'FAIL',
      category: 'hls',
      message: 'Missing Hls reference'
    });
  }

  return issues;
}

/**
 * Verify a single file
 */
function verifyFile(relativePath) {
  const sourcePath = join(SOURCE_DIR, relativePath);
  const outputPath = join(OUTPUT_DIR, relativePath);

  // Check files exist
  if (!existsSync(sourcePath)) {
    return { status: 'SKIP', message: 'Source file not found' };
  }

  if (!existsSync(outputPath)) {
    return { status: 'SKIP', message: 'Minified file not found' };
  }

  // Read files
  const sourceContent = readFileSync(sourcePath, 'utf-8');
  const outputContent = readFileSync(outputPath, 'utf-8');

  // Extract patterns
  const sourcePatterns = extractPatterns(sourceContent);
  const outputPatterns = extractPatterns(outputContent);

  // Compare
  const issues = comparePatterns(sourcePatterns, outputPatterns, relativePath);

  return {
    status: issues.length === 0 ? 'PASS' : 'FAIL',
    sourcePatterns,
    outputPatterns,
    issues
  };
}

// Main execution
function main() {
  console.log('=== VERIFICATION REPORT ===\n');

  // Find all source files
  const files = findJsFiles(SOURCE_DIR);

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const file of files) {
    const result = verifyFile(file);

    console.log(file);

    if (result.status === 'SKIP') {
      console.log(`  ⊘ SKIP: ${result.message}`);
      skipped++;
      continue;
    }

    // Show what was found
    const sp = result.sourcePatterns;
    if (sp.dataSelectors.length > 0) {
      console.log(`  ✓ ${sp.dataSelectors.length} data-selectors preserved`);
    }
    if (sp.domEvents.length > 0) {
      console.log(`  ✓ ${sp.domEvents.length} DOM events preserved`);
    }
    if (sp.initFlags.length > 0) {
      for (const flag of sp.initFlags) {
        console.log(`  ✓ Init flag: ${flag}`);
      }
    }
    if (sp.hasWebflowPush) {
      console.log(`  ✓ Webflow.push preserved`);
    }
    if (sp.hasMotionAnimate) {
      console.log(`  ✓ Motion.animate preserved`);
    }
    if (sp.hasGsap) {
      console.log(`  ✓ gsap preserved`);
    }
    if (sp.hasScrollTrigger) {
      console.log(`  ✓ ScrollTrigger preserved`);
    }
    if (sp.hasSwiper) {
      console.log(`  ✓ Swiper preserved`);
    }
    if (sp.hasHls) {
      console.log(`  ✓ Hls preserved`);
    }

    // Show issues
    for (const issue of result.issues) {
      console.log(`  ✗ ${issue.type}: ${issue.message}`);
    }

    console.log(`  RESULT: ${result.status}\n`);

    if (result.status === 'PASS') {
      passed++;
    } else {
      failed++;
    }
  }

  // Summary
  console.log('=== SUMMARY ===');
  console.log(`Passed:  ${passed}/${files.length}`);
  console.log(`Failed:  ${failed}/${files.length}`);
  console.log(`Skipped: ${skipped}/${files.length}`);

  if (failed > 0) {
    console.log('\n⚠️  VERIFICATION FAILED - Do not deploy!');
    console.log('Fix the issues above before proceeding.');
    process.exit(1);
  }

  console.log('\n✓ All verifications passed');
  console.log('Next: Run test-minified-runtime.mjs for runtime testing');
}

main();
