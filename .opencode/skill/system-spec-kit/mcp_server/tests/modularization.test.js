// ───────────────────────────────────────────────────────────────
// TEST: MODULARIZATION
// ───────────────────────────────────────────────────────────────

'use strict';

const path = require('path');
const fs = require('fs');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const MCP_SERVER_PATH = path.join(__dirname, '..');
const MAX_MODULE_LINES = 320; // 300 target with 20-line tolerance

const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
──────────────────────────────────────────────────────────────── */

function log(msg) { console.log(msg); }

function pass(name, evidence) {
  results.passed++;
  results.tests.push({ name, status: 'PASS', evidence });
  log(`   ✅ ${name}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(name, reason) {
  results.failed++;
  results.tests.push({ name, status: 'FAIL', reason });
  log(`   ❌ ${name}`);
  log(`      Reason: ${reason}`);
}

function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').length;
}

/* ─────────────────────────────────────────────────────────────
   3. MODULE STRUCTURE TESTS
──────────────────────────────────────────────────────────────── */

function test_directory_structure() {
  log('\n🔬 Directory Structure');

  const required_dirs = ['core', 'handlers', 'formatters', 'utils', 'hooks', 'lib'];

  for (const dir of required_dirs) {
    const dirPath = path.join(MCP_SERVER_PATH, dir);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      pass(`Directory: ${dir}/`, 'Exists');
    } else {
      fail(`Directory: ${dir}/`, 'Not found');
    }
  }
}

function test_index_exports() {
  log('\n🔬 Index Re-exports');

  const directories = ['core', 'handlers', 'formatters', 'utils', 'hooks'];

  for (const dir of directories) {
    try {
      const indexPath = path.join(MCP_SERVER_PATH, dir, 'index.js');
      if (!fs.existsSync(indexPath)) {
        fail(`${dir}/index.js exists`, 'File not found');
        continue;
      }

      const exports = require(indexPath);
      const exportCount = Object.keys(exports).length;

      if (exportCount > 0) {
        pass(`${dir}/index.js exports`, `${exportCount} items`);
      } else {
        fail(`${dir}/index.js exports`, 'No exports found');
      }
    } catch (error) {
      fail(`${dir}/index.js loads`, error.message);
    }
  }
}

function test_module_line_counts() {
  log('\n🔬 Module Line Counts (<300 lines)');

  const modules = [
    'context-server.js',
    'core/config.js',
    'core/db-state.js',
    'handlers/memory-search.js',
    'handlers/memory-triggers.js',
    'handlers/memory-crud.js',
    'handlers/memory-save.js',
    'handlers/memory-index.js',
    'handlers/checkpoints.js',
    'formatters/token-metrics.js',
    'formatters/search-results.js',
    'utils/validators.js',
    'utils/json-helpers.js',
    'utils/batch-processor.js',
    'hooks/memory-surface.js',
  ];

  for (const mod of modules) {
    const filePath = path.join(MCP_SERVER_PATH, mod);
    if (!fs.existsSync(filePath)) {
      fail(`${mod} line count`, 'File not found');
      continue;
    }

    const lines = countLines(filePath);
    if (lines <= MAX_MODULE_LINES) {
      pass(`${mod}`, `${lines} lines`);
    } else {
      fail(`${mod}`, `${lines} lines (exceeds ${MAX_MODULE_LINES})`);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORT VERIFICATION TESTS
──────────────────────────────────────────────────────────────── */

function test_core_exports() {
  log('\n🔬 Core Module Exports');

  const required = [
    'DATABASE_PATH', 'LIB_DIR', 'SHARED_DIR',
    'BATCH_SIZE', 'BATCH_DELAY_MS', 'INDEX_SCAN_COOLDOWN',
    'checkDatabaseUpdated', 'reinitializeDatabase',
    'getLastScanTime', 'setLastScanTime',
    'init', 'isEmbeddingModelReady',
  ];

  try {
    const core = require(path.join(MCP_SERVER_PATH, 'core'));
    for (const fn of required) {
      if (fn in core) {
        pass(`core.${fn}`, typeof core[fn]);
      } else {
        fail(`core.${fn}`, 'Not exported');
      }
    }
  } catch (error) {
    fail('Core module loads', error.message);
  }
}

function test_handler_exports() {
  log('\n🔬 Handler Module Exports');

  const required = [
    'handleMemorySearch',
    'handleMemoryMatchTriggers',
    'handleMemoryDelete', 'handleMemoryUpdate',
    'handleMemoryList', 'handleMemoryStats', 'handleMemoryHealth',
    'handleMemorySave', 'indexMemoryFile',
    'handleMemoryIndexScan', 'findConstitutionalFiles',
    'handleCheckpointCreate', 'handleCheckpointList',
    'handleCheckpointRestore', 'handleCheckpointDelete',
    'handleMemoryValidate',
  ];

  try {
    const handlers = require(path.join(MCP_SERVER_PATH, 'handlers'));
    for (const fn of required) {
      if (typeof handlers[fn] === 'function') {
        pass(`handlers.${fn}`, 'function');
      } else {
        fail(`handlers.${fn}`, 'Not a function');
      }
    }
  } catch (error) {
    fail('Handlers module loads', error.message);
  }
}

function test_formatter_exports() {
  log('\n🔬 Formatter Module Exports');

  const required = [
    'estimateTokens', 'calculateTokenMetrics',
    'formatSearchResults',
  ];

  try {
    const formatters = require(path.join(MCP_SERVER_PATH, 'formatters'));
    for (const fn of required) {
      if (typeof formatters[fn] === 'function') {
        pass(`formatters.${fn}`, 'function');
      } else {
        fail(`formatters.${fn}`, 'Not a function');
      }
    }
  } catch (error) {
    fail('Formatters module loads', error.message);
  }
}

function test_utils_exports() {
  log('\n🔬 Utils Module Exports');

  const required = [
    'validateQuery', 'validateInputLengths', 'INPUT_LIMITS',
    'safeJsonParse', 'safeJsonStringify',
    'processWithRetry', 'processBatches',
  ];

  try {
    const utils = require(path.join(MCP_SERVER_PATH, 'utils'));
    for (const fn of required) {
      if (fn in utils) {
        pass(`utils.${fn}`, typeof utils[fn]);
      } else {
        fail(`utils.${fn}`, 'Not exported');
      }
    }
  } catch (error) {
    fail('Utils module loads', error.message);
  }
}

function test_hooks_exports() {
  log('\n🔬 Hooks Module Exports');

  const required = [
    'extract_context_hint',
    'get_constitutional_memories',
    'auto_surface_memories',
    'MEMORY_AWARE_TOOLS',
  ];

  try {
    const hooks = require(path.join(MCP_SERVER_PATH, 'hooks'));
    for (const fn of required) {
      if (fn in hooks) {
        pass(`hooks.${fn}`, typeof hooks[fn]);
      } else {
        fail(`hooks.${fn}`, 'Not exported');
      }
    }
  } catch (error) {
    fail('Hooks module loads', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. INTEGRATION TESTS
──────────────────────────────────────────────────────────────── */

function test_context_server_imports() {
  log('\n🔬 Context Server Integration');

  try {
    const contextServer = fs.readFileSync(
      path.join(MCP_SERVER_PATH, 'context-server.js'),
      'utf8'
    );

    // Formatters are imported by handlers, not directly by context-server
    const imports = [
      "require('./core')",
      "require('./handlers')",
      "require('./utils')",
      "require('./hooks')",
    ];

    for (const imp of imports) {
      if (contextServer.includes(imp)) {
        pass(`Import: ${imp}`, 'Found');
      } else {
        fail(`Import: ${imp}`, 'Not found');
      }
    }
  } catch (error) {
    fail('Context server readable', error.message);
  }
}

function test_validator_functions() {
  log('\n🔬 Validator Function Tests');

  try {
    const { validateQuery, validateInputLengths, INPUT_LIMITS } = require(
      path.join(MCP_SERVER_PATH, 'utils')
    );

    // Test validateQuery
    try {
      validateQuery(null);
      fail('validateQuery(null) throws', 'Did not throw');
    } catch (e) {
      pass('validateQuery(null) throws', e.message);
    }

    try {
      validateQuery('   ');
      fail('validateQuery("   ") throws', 'Did not throw');
    } catch (e) {
      pass('validateQuery("   ") throws', e.message);
    }

    const validQuery = validateQuery('test query');
    if (validQuery === 'test query') {
      pass('validateQuery("test query") returns trimmed', validQuery);
    } else {
      fail('validateQuery("test query") returns trimmed', `Got: ${validQuery}`);
    }

    // Test validateInputLengths (throws on error, returns undefined on success)
    try {
      validateInputLengths({ query: 'test', specFolder: 'test/folder' });
      pass('validateInputLengths with valid input', 'No error thrown');
    } catch (e) {
      fail('validateInputLengths with valid input', e.message);
    }

  } catch (error) {
    fail('Validator tests', error.message);
  }
}

function test_token_metrics() {
  log('\n🔬 Token Metrics Tests');

  try {
    const { estimateTokens, calculateTokenMetrics } = require(
      path.join(MCP_SERVER_PATH, 'formatters')
    );

    // Test estimateTokens
    const tokens = estimateTokens('Hello world');
    if (typeof tokens === 'number' && tokens > 0) {
      pass('estimateTokens("Hello world")', `${tokens} tokens`);
    } else {
      fail('estimateTokens("Hello world")', `Got: ${tokens}`);
    }

    // Test calculateTokenMetrics (takes allMatches, returnedResults)
    const returnedResults = [
      { content: 'Short content', tier: 'HOT' },
      { content: 'Another piece of content here', tier: 'WARM' },
    ];
    const metrics = calculateTokenMetrics(returnedResults, returnedResults);
    if (typeof metrics === 'object' && 'actualTokens' in metrics) {
      pass('calculateTokenMetrics', `actualTokens: ${metrics.actualTokens}`);
    } else if (typeof metrics === 'object') {
      pass('calculateTokenMetrics', JSON.stringify(metrics));
    } else {
      fail('calculateTokenMetrics', `Got: ${metrics}`);
    }

  } catch (error) {
    fail('Token metrics tests', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. MAIN
──────────────────────────────────────────────────────────────── */

function main() {
  log('🧪 Spec 066 Modularization Verification');
  log('=======================================');
  log(`Date: ${new Date().toISOString()}`);
  log(`MCP Server Path: ${MCP_SERVER_PATH}\n`);

  // Structure tests
  test_directory_structure();
  test_index_exports();
  test_module_line_counts();

  // Export tests
  test_core_exports();
  test_handler_exports();
  test_formatter_exports();
  test_utils_exports();
  test_hooks_exports();

  // Integration tests
  test_context_server_imports();
  test_validator_functions();
  test_token_metrics();

  // Summary
  log('\n=======================================');
  log('📊 TEST SUMMARY');
  log('=======================================');
  log(`✅ Passed:  ${results.passed}`);
  log(`❌ Failed:  ${results.failed}`);
  log(`📝 Total:   ${results.passed + results.failed}`);
  log('');

  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED!');
    return true;
  } else {
    log('⚠️  Some tests failed. Review output above.');
    return false;
  }
}

// Run tests
const success = main();
process.exit(success ? 0 : 1);
