#!/usr/bin/env node
/**
 * test-minified-runtime.mjs - Runtime testing for minified JavaScript
 *
 * Usage:
 *   node scripts/test-minified-runtime.mjs
 *
 * Executes each minified script in a mock browser environment to catch:
 * - Syntax errors
 * - ReferenceError for undefined variables
 * - Runtime exceptions
 * - Missing dependencies
 */

import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, relative } from 'path';
import vm from 'vm';

// Configuration
const OUTPUT_DIR = 'src/2_javascript/z_minified';

// Folders to skip
const SKIP_FOLDERS = ['node_modules', '.git'];

/**
 * Create mock browser environment
 */
function createMockEnvironment() {
  // Mock element
  const mockElement = {
    style: {},
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false,
    },
    dataset: {},
    getAttribute: () => null,
    setAttribute: () => {},
    removeAttribute: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: () => mockElement,
    removeChild: () => mockElement,
    insertBefore: () => mockElement,
    querySelector: () => null,
    querySelectorAll: () => [],
    closest: () => null,
    matches: () => false,
    getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    offsetWidth: 0,
    offsetHeight: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
    focus: () => {},
    blur: () => {},
    click: () => {},
    dispatchEvent: () => true,
  };

  // Mock document
  const mockDocument = {
    getElementById: () => null,
    getElementsByClassName: () => [],
    getElementsByTagName: () => [],
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ ...mockElement }),
    createTextNode: () => ({}),
    body: { ...mockElement },
    head: { ...mockElement },
    documentElement: { ...mockElement },
    addEventListener: () => {},
    removeEventListener: () => {},
    readyState: 'complete',
    fonts: {
      ready: Promise.resolve(),
      check: () => true,
    },
  };

  // Mock window
  const mockWindow = {
    document: mockDocument,
    addEventListener: () => {},
    removeEventListener: () => {},
    setTimeout: (fn) => { try { fn(); } catch (e) {} return 1; },
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    requestAnimationFrame: (fn) => { try { fn(0); } catch (e) {} return 1; },
    cancelAnimationFrame: () => {},
    getComputedStyle: () => ({}),
    matchMedia: () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
    innerWidth: 1920,
    innerHeight: 1080,
    scrollX: 0,
    scrollY: 0,
    scrollTo: () => {},
    location: {
      href: 'https://example.com',
      pathname: '/',
      search: '',
      hash: '',
      origin: 'https://example.com',
    },
    history: {
      pushState: () => {},
      replaceState: () => {},
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    navigator: {
      userAgent: 'Mozilla/5.0 (Mock)',
      language: 'en-US',
    },
    performance: {
      now: () => Date.now(),
    },
    console: {
      log: () => {},
      warn: () => {},
      error: () => {},
      info: () => {},
      debug: () => {},
    },

    // Library mocks
    Webflow: {
      push: (fn) => { try { fn(); } catch (e) {} },
    },
    Motion: {
      animate: () => ({ finished: Promise.resolve() }),
      timeline: () => ({}),
      stagger: () => 0,
      spring: () => ({}),
    },
    gsap: {
      to: () => ({}),
      from: () => ({}),
      fromTo: () => ({}),
      set: () => ({}),
      timeline: () => ({
        to: () => ({}),
        from: () => ({}),
        add: () => ({}),
      }),
      registerPlugin: () => {},
      utils: {
        toArray: () => [],
      },
    },
    ScrollTrigger: {
      create: () => ({}),
      refresh: () => {},
      update: () => {},
      getAll: () => [],
      kill: () => {},
    },
    Swiper: class MockSwiper {
      constructor() {
        this.slides = [];
        this.activeIndex = 0;
      }
      slideTo() {}
      update() {}
      destroy() {}
    },
    Hls: class MockHls {
      static isSupported() { return true; }
      constructor() {}
      loadSource() {}
      attachMedia() {}
      destroy() {}
      on() {}
      off() {}
    },

    // Observer mocks
    IntersectionObserver: class MockIntersectionObserver {
      constructor(callback) { this.callback = callback; }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    ResizeObserver: class MockResizeObserver {
      constructor(callback) { this.callback = callback; }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    MutationObserver: class MockMutationObserver {
      constructor(callback) { this.callback = callback; }
      observe() {}
      disconnect() {}
      takeRecords() { return []; }
    },

    // Fetch mock
    fetch: () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    }),
  };

  // Add self-reference
  mockWindow.window = mockWindow;
  mockWindow.self = mockWindow;
  mockWindow.globalThis = mockWindow;

  return mockWindow;
}

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
 * Test a single minified file
 */
function testFile(relativePath) {
  const filePath = join(OUTPUT_DIR, relativePath);

  if (!existsSync(filePath)) {
    return { status: 'SKIP', message: 'File not found' };
  }

  const code = readFileSync(filePath, 'utf-8');

  // Create fresh mock environment
  const mockEnv = createMockEnvironment();

  try {
    // Create VM context
    const context = vm.createContext(mockEnv);

    // Execute the script
    vm.runInContext(code, context, {
      filename: relativePath,
      timeout: 5000, // 5 second timeout
    });

    // Check for init flags that should be set
    const initFlagPattern = /__[a-zA-Z_]+Init/g;
    const expectedFlags = code.match(initFlagPattern) || [];
    const setFlags = [];

    for (const flag of expectedFlags) {
      if (context[flag] || context.window?.[flag]) {
        setFlags.push(flag);
      }
    }

    return {
      status: 'PASS',
      setFlags,
    };
  } catch (error) {
    return {
      status: 'FAIL',
      error: error.message,
      stack: error.stack,
    };
  }
}

// Main execution
function main() {
  console.log('=== RUNTIME TEST REPORT ===\n');

  // Find all minified files
  const files = findJsFiles(OUTPUT_DIR);

  if (files.length === 0) {
    console.log('No minified files found in', OUTPUT_DIR);
    console.log('Run minify-webflow.mjs first.');
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const file of files) {
    const result = testFile(file);

    console.log(file);

    if (result.status === 'SKIP') {
      console.log(`  ⊘ SKIP: ${result.message}`);
      skipped++;
      continue;
    }

    if (result.status === 'PASS') {
      console.log('  ✓ Script executed without errors');

      if (result.setFlags.length > 0) {
        for (const flag of result.setFlags) {
          console.log(`  ✓ Init flag set: ${flag}`);
        }
      }

      console.log('  RESULT: PASS\n');
      passed++;
    } else {
      console.log(`  ✗ FAIL: ${result.error}`);
      if (result.stack) {
        const stackLines = result.stack.split('\n').slice(1, 4);
        for (const line of stackLines) {
          console.log(`    ${line.trim()}`);
        }
      }
      console.log('  RESULT: FAIL\n');
      failed++;
    }
  }

  // Summary
  console.log('=== SUMMARY ===');
  console.log(`Passed:  ${passed}/${files.length}`);
  console.log(`Failed:  ${failed}/${files.length}`);
  console.log(`Skipped: ${skipped}/${files.length}`);

  if (failed > 0) {
    console.log('\n⚠️  RUNTIME TESTS FAILED - Do not deploy!');
    console.log('Fix the errors above before proceeding.');
    process.exit(1);
  }

  console.log('\n✓ All runtime tests passed');
  console.log('Next: Test in browser with bdg or manual testing');
}

main();
