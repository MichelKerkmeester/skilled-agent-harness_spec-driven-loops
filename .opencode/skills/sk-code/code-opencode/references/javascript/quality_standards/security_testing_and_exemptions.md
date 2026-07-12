---
title: Security, Testing, Async & Exemption Tiers
description: Module organization, error handling, documentation, and security patterns for JavaScript files. — Security, Testing, Async & Exemption Tiers.
trigger_phrases:
  - "javascript security patterns"
  - "javascript testing patterns"
  - "javascript async patterns"
  - "javascript exemption tiers"
importance_tier: normal
contextType: implementation
version: 1.0.0.15
---

# Security, Testing, Async & Exemption Tiers

Security, testing, async, and exemption guidance for JavaScript files in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Defines security, testing, async, and narrowly scoped exemption patterns for JavaScript files.

### When to Use

- Implementing security controls or async workflows in JavaScript
- Writing JavaScript tests and direct-execution test runners
- Determining whether plugin or test-file exemptions apply

---

## 2. SECURITY PATTERNS

### CWE-22: Path Traversal Prevention

Validate and sanitize file paths.

```javascript
const path = require('path');

/**
 * Safely resolve path within allowed directory.
 * @param {string} basePath - Allowed base directory
 * @param {string} userPath - User-provided path
 * @returns {string|null} Resolved path or null if invalid
 */
function safeResolvePath(basePath, userPath) {
  // Normalize and resolve
  const resolvedBase = path.resolve(basePath);
  const resolvedPath = path.resolve(basePath, userPath);

  // Verify path stays within base
  if (!resolvedPath.startsWith(resolvedBase + path.sep)) {
    console.error(`[security] Path traversal attempt: ${userPath}`);
    return null;
  }

  return resolvedPath;
}
```

### CWE-400: Input Limits

Prevent resource exhaustion with input validation.

```javascript
const MAX_QUERY_LENGTH = 10000;
const MAX_RESULTS = 100;

function validateSearchInput(query, options) {
  // Limit query length
  if (query && query.length > MAX_QUERY_LENGTH) {
    return { valid: false, error: `Query exceeds ${MAX_QUERY_LENGTH} characters` };
  }

  // Limit result count
  if (options.limit && options.limit > MAX_RESULTS) {
    options.limit = MAX_RESULTS;
    console.warn(`[search] Limit capped to ${MAX_RESULTS}`);
  }

  return { valid: true };
}
```

### Input Sanitization

```javascript
/**
 * Sanitize string input for safe use.
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
function sanitizeString(input) {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove null bytes
  return input.replace(/\0/g, '');
}
```

---

## 3. TESTING PATTERNS

### Using Node.js Assert

```javascript
const assert = require('assert');

// Test function
function testLoadConfig() {
  const config = loadConfig('./test-config.yaml');

  assert.ok(config, 'Config should be loaded');
  assert.strictEqual(config.version, '1.0.0', 'Version should match');
  assert.deepStrictEqual(config.features, ['a', 'b'], 'Features should match');
}

// Run tests
if (require.main === module) {
  testLoadConfig();
  console.log('[test] All tests passed');
}
```

### Test File Organization

```javascript
// tests/test_config.js
'use strict';

const assert = require('assert');
const { loadConfig, validateConfig } = require('../scripts/core/config');

describe('Config Module', () => {
  describe('loadConfig', () => {
    it('should load valid YAML config', () => {
      const config = loadConfig('./fixtures/valid.yaml');
      assert.ok(config);
    });

    it('should return null for missing file', () => {
      const config = loadConfig('./nonexistent.yaml');
      assert.strictEqual(config, null);
    });
  });
});
```

---

## 4. ASYNC PATTERNS

### Async/Await Style

Prefer async/await over callbacks and raw promises.

```javascript
// CORRECT: async/await
async function fetchAndProcess() {
  try {
    const data = await fetchData();
    const result = await processData(data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// AVOID: Promise chains
function fetchAndProcess() {
  return fetchData()
    .then(data => processData(data))
    .then(result => ({ success: true, data: result }))
    .catch(error => ({ success: false, error: error.message }));
}
```

### Parallel Operations

```javascript
// Parallel execution
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);

// Sequential execution (when order matters)
const user = await fetchUser(id);
const posts = await fetchUserPosts(user.id);
```

---

## 5. TEST FILE EXEMPTION TIER

CLI-only test runners, setup scripts, and similar utilities are exempt from certain quality standards because they are executed directly (not imported as modules) and serve a different purpose than library code.

### Scope

This exemption applies to:
- Files in `scripts/tests/`
- Files in `scripts/setup/`
- Any file with a test runner shebang (e.g., `#!/usr/bin/env node`)

### Exempted Standards

| Standard                           | Reason for Exemption                                           |
|------------------------------------|----------------------------------------------------------------|
| `module.exports` requirement       | Test runners are executed directly, not imported by other code |
| Guard clause requirement           | Scripts run once at CLI level; input validation is minimal     |
| `[module-name]` error prefix       | Test output uses its own format (e.g., pass/fail assertions)   |

### What Still Applies

All other quality standards remain in effect for test files, including:
- `'use strict'` directive
- JSDoc documentation for non-trivial functions
- Error handling with try-catch for async operations
- Security patterns (path traversal, input limits) if handling external input

### Example

```javascript
#!/usr/bin/env node
'use strict';

const assert = require('assert');
const { loadConfig } = require('../core/config');

// No module.exports needed — this file is executed directly
// No guard clauses needed — CLI-level script
// No [module-name] prefix needed — test output format

const config = loadConfig('./fixtures/valid.yaml');
assert.ok(config, 'Config should load successfully');
assert.strictEqual(config.version, '1.0.0');

console.log('PASS: All config tests passed');
```

---

## 6. OPENCODE PLUGIN EXEMPTION TIER

OpenCode plugin entrypoints and helper modules are exempt from the CommonJS export standard because the OpenCode plugin loader requires ESM default exports. This exemption is narrow and does not relax other JavaScript quality standards.

### Scope

This exemption applies to:
- `.opencode/plugins/*.{js,mjs,ts}`
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/*.{js,mjs,ts}`

### Exempted Standards

| Standard                           | Reason for Exemption                                                               |
|------------------------------------|------------------------------------------------------------------------------------|
| `module.exports` requirement       | OpenCode plugin loader requires ESM default export per `@opencode-ai/plugin/dist/index.d.ts` |

### What Still Applies

All other quality standards remain in effect for OpenCode plugin files, including:
- JSDoc on exports
- Guard clauses
- Security patterns
- Error handling
- Bracketed logging if logging exists
- Numbered ALL-CAPS section dividers
- `UPPER_SNAKE_CASE` constants
- `camelCase` functions

### Runtime Output — Never Overlay the TUI

OpenCode's TUI paints plugin `stdout`/`stderr` onto the prompt input line, where it sticks until a redraw and corrupts the interactive session. Plugins therefore MUST NOT write user- or agent-facing output to the console (`console.log`/`warn`/`error`, `process.stdout`/`stderr.write`). Surface the signal through a non-intrusive channel instead:

| Channel | Use for |
|---|---|
| `experimental.chat.system.transform` — push a **bounded** string to `output.system` | Agent-actionable notices the model should see and can act on or relay |
| Append-only log file (e.g. `.opencode/logs/*.log`, fail-open) | Durable operator/audit record |
| A plugin `tool` the agent can call | On-demand status the user explicitly requests |

`stderr` diagnostics are allowed only behind an explicit debug env flag that defaults off (matching `mk-goal`'s `MK_GOAL_DEBUG`). Reference implementations: `mk-dist-freshness-guard.js` (injection + log) and `mk-deep-loop-guard.js` (log-only).

### Brief Example

```javascript
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Example OpenCode Plugin                                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Show the allowed ESM default export with required structure.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { tool } from '@opencode-ai/plugin';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_ID = 'example-plugin';

// ─────────────────────────────────────────────────────────────────────────────
// 3. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the example OpenCode plugin hooks.
 *
 * @param {Object} ctx - OpenCode plugin context
 * @param {Object} [options] - Plugin options
 * @returns {Promise<Object>} Hooks object for the OpenCode plugin loader
 */
export default async function ExamplePlugin(ctx, options = {}) {
  return {
    tool: {
      example_status: tool({
        description: 'Show example plugin status',
        args: {},
        async execute() {
          return `plugin_id=${PLUGIN_ID}`;
        },
      }),
    },
  };
}
```

---

## 7. RELATED RESOURCES

- [style_guide.md](../style_guide.md) - Formatting and naming conventions
- [quick_reference.md](../quick_reference.md) - Copy-paste templates and cheat sheets
