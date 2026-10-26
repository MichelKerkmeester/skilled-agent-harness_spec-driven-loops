#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// TEST RUNNER - Spec 072 Test Infrastructure hygiene-ok
// Discovers and runs all *.test.js files in the tests directory
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const TESTS_DIR = __dirname;
const TEST_FILE_PATTERN = /\.test\.js$/;

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
──────────────────────────────────────────────────────────────── */

function log(msg, color = '') {
  if (color) {
    console.log(`${color}${msg}${colors.reset}`);
  } else {
    console.log(msg);
  }
}

function printBanner() {
  log('');
  log('═══════════════════════════════════════════════════════════════');
  log('  🧪 SPEC 072 TEST RUNNER', colors.bold);
  log('═══════════════════════════════════════════════════════════════');
  log(`  Date: ${new Date().toISOString()}`);
  log(`  Directory: ${TESTS_DIR}`);
  log('═══════════════════════════════════════════════════════════════');
}

/**
 * Recursively discover all test files in a directory
 * @param {string} dir - Directory to search
 * @param {string[]} [files=[]] - Accumulator for found files
 * @returns {string[]} Array of test file paths
 */
function discoverTestFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and other non-test directories
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        discoverTestFiles(fullPath, files);
      }
    } else if (entry.isFile() && TEST_FILE_PATTERN.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Run a single test file and capture results
 * @param {string} filePath - Path to test file
 * @returns {Promise<Object>} Test result
 */
function runTestFile(filePath) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const relativePath = path.relative(TESTS_DIR, filePath);

    log(`\n────────────────────────────────────────────────────────────────`);
    log(`📄 Running: ${relativePath}`, colors.cyan);
    log(`────────────────────────────────────────────────────────────────`);

    const child = spawn('node', [filePath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '1' },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      process.stdout.write(output);
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      process.stderr.write(output);
    });

    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      resolve({
        file: relativePath,
        fullPath: filePath,
        exitCode: code,
        duration,
        stdout,
        stderr,
        passed: code === 0,
      });
    });

    child.on('error', (err) => {
      resolve({
        file: relativePath,
        fullPath: filePath,
        exitCode: 1,
        duration: Date.now() - startTime,
        stdout: '',
        stderr: err.message,
        passed: false,
        error: err.message,
      });
    });
  });
}

/**
 * Parse test counts from stdout if available
 * @param {string} stdout - Test output
 * @returns {Object} Parsed counts or null
 */
function parseTestCounts(stdout) {
  // Try to find summary lines like "✅ Passed:  5"
  const passedMatch = stdout.match(/(?:Passed|PASSED)[:\s]+(\d+)/i);
  const failedMatch = stdout.match(/(?:Failed|FAILED)[:\s]+(\d+)/i);
  const skippedMatch = stdout.match(/(?:Skipped|SKIP)[:\s]+(\d+)/i);

  if (passedMatch || failedMatch) {
    return {
      passed: passedMatch ? parseInt(passedMatch[1], 10) : 0,
      failed: failedMatch ? parseInt(failedMatch[1], 10) : 0,
      skipped: skippedMatch ? parseInt(skippedMatch[1], 10) : 0,
    };
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────
   3. MAIN RUNNER
──────────────────────────────────────────────────────────────── */

async function main() {
  printBanner();

  // Discover test files
  const testFiles = discoverTestFiles(TESTS_DIR);

  if (testFiles.length === 0) {
    log('\n⚠️  No test files found (*.test.js)', colors.yellow);
    log(`   Searched in: ${TESTS_DIR}`, colors.gray);
    process.exit(0);
  }

  log(`\n📋 Found ${testFiles.length} test file(s):`, colors.blue);
  testFiles.forEach((f) => {
    log(`   • ${path.relative(TESTS_DIR, f)}`, colors.gray);
  });

  // Run tests sequentially
  const results = [];
  const totalStartTime = Date.now();

  for (const testFile of testFiles) {
    const result = await runTestFile(testFile);
    results.push(result);
  }

  const totalDuration = Date.now() - totalStartTime;

  // Aggregate results
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  let filesWithCounts = 0;

  const fileResults = results.map((r) => {
    const counts = parseTestCounts(r.stdout);
    if (counts) {
      filesWithCounts++;
      totalPassed += counts.passed;
      totalFailed += counts.failed;
      totalSkipped += counts.skipped;
    }
    return { ...r, counts };
  });

  // If no individual test counts found, count files
  if (filesWithCounts === 0) {
    totalPassed = results.filter((r) => r.passed).length;
    totalFailed = results.filter((r) => !r.passed).length;
  }

  // Print summary
  log('\n');
  log('═══════════════════════════════════════════════════════════════');
  log('  📊 FINAL TEST SUMMARY', colors.bold);
  log('═══════════════════════════════════════════════════════════════');
  log('');

  // File-level results
  log('  File Results:', colors.bold);
  fileResults.forEach((r) => {
    const status = r.passed ? '✅ PASS' : '❌ FAIL';
    const statusColor = r.passed ? colors.green : colors.red;
    const duration = `(${r.duration}ms)`;
    log(`    ${status} ${r.file} ${duration}`, statusColor);
    if (r.counts) {
      log(
        `         Tests: ${r.counts.passed} passed, ${r.counts.failed} failed, ${r.counts.skipped} skipped`,
        colors.gray
      );
    }
  });

  log('');
  log('───────────────────────────────────────────────────────────────');

  // Aggregated stats
  if (filesWithCounts > 0) {
    log(`  ✅ Tests Passed:  ${totalPassed}`, colors.green);
    log(`  ❌ Tests Failed:  ${totalFailed}`, totalFailed > 0 ? colors.red : '');
    log(`  ⏭️  Tests Skipped: ${totalSkipped}`, totalSkipped > 0 ? colors.yellow : '');
    log(`  📝 Total Tests:   ${totalPassed + totalFailed + totalSkipped}`);
  }

  log(`  📁 Files Run:     ${results.length}`);
  log(`  ⏱️  Total Time:    ${(totalDuration / 1000).toFixed(2)}s`);

  log('');

  // Final verdict
  const allFilesPassed = results.every((r) => r.passed);
  if (allFilesPassed && totalFailed === 0) {
    log('  🎉 ALL TESTS PASSED!', colors.green);
    log('═══════════════════════════════════════════════════════════════');
    log('');
    process.exit(0);
  } else {
    log('  ⚠️  SOME TESTS FAILED', colors.red);

    // List failed files
    const failedFiles = results.filter((r) => !r.passed);
    if (failedFiles.length > 0) {
      log('');
      log('  Failed files:', colors.red);
      failedFiles.forEach((r) => {
        log(`    • ${r.file}`, colors.red);
        if (r.error) {
          log(`      Error: ${r.error}`, colors.gray);
        }
      });
    }

    log('═══════════════════════════════════════════════════════════════');
    log('');
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (err) => {
  log(`\n❌ Unhandled error: ${err.message}`, colors.red);
  process.exit(1);
});

// Run
main();
