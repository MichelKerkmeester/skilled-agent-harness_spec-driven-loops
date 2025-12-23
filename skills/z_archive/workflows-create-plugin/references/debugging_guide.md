# OpenCode Plugin Debugging Guide

Systematic debugging workflows for common plugin issues with root cause analysis, validation checkpoints, and step-by-step resolution.

**Prerequisites:** Follow plugin standards before debugging:
- **Direct Export Pattern**: Plugin must export async function directly
- **Hook Return Values**: Most hooks mutate output, don't need explicit returns
- See [plugin_patterns.md](./plugin_patterns.md) for correct patterns

---

## 1. 📖 CORE PRINCIPLE

**"ALWAYS find root cause before attempting fixes. Symptom fixes are failure."**

Most plugin errors have a single root cause. Identify it before making changes.

---

## 2. 🎯 QUICK DIAGNOSIS TABLE

| Symptom | Likely Cause | Solution | Section |
|---------|--------------|----------|---------|
| "fn3 is not a function" | Factory pattern | Direct export | [Error 1](#5--error-1-fn3-is-not-a-function) |
| "BunInstallFailedError" | Dependency issues | Check deps, circular imports | [Error 2](#6--error-2-buninstallfailederror) |
| Plugin loads, hooks don't fire | Incorrect hook names | Verify exact names | [Error 3](#7--error-3-plugin-loads-but-hooks-dont-fire) |
| "Cannot find module" | Build output mismatch | Check build config | [Error 4](#8--error-4-cannot-find-module) |
| Plugin not loading | Discovery issues | Verify location, package.json | [Error 5](#9--error-5-plugin-not-loading-at-all) |
| Hook not triggering | Wrong event type | Log events to diagnose | [Error 6](#10--error-6-hook-not-triggering-for-specific-events) |

---

## 3. 🔄 THE 4 DEBUGGING PHASES

You MUST complete each phase before proceeding to the next.

### Phase 1: Verify Structure

**Purpose**: Confirm plugin files exist and are correctly configured.

**Actions**:
1. Check plugin location is correct
2. Verify package.json exists and is valid
3. Confirm build output (dist/) exists
4. Validate tsconfig.json settings

**Validation**: `structure_verified`

```bash
# Check location
ls -la .opencode/plugin/my-plugin/
# OR
ls -la ~/.config/opencode/plugin/my-plugin/

# Verify package.json
cat my-plugin/package.json | head -20

# Check build output
ls -la my-plugin/dist/
```

### Phase 2: Verify Exports

**Purpose**: Confirm plugin exports correctly (not factory pattern).

**Actions**:
1. Run verification script
2. Check exported type (object vs function)
3. Verify hooks are present

**Validation**: `exports_verified`

```bash
# Test plugin export
node -e "
import('./dist/index.js').then(async (m) => {
  const hooks = await m.default({
    directory: process.cwd(),
    project: { name: 'test' },
    worktree: process.cwd(),
    client: {},
    \$: () => {}
  });
  console.log('Type:', typeof hooks);
  console.log('Is function?:', typeof hooks === 'function');
  console.log('Hooks:', Object.keys(hooks));
}).catch(console.error);
"
```

**Expected Output**:
```
Type: object
Is function?: false
Hooks: [ 'event', 'chat.message' ]
```

❌ **If you see**:
```
Type: function
Is function?: true
```
→ **Root Cause**: Factory pattern. See [Error 1](#5--error-1-fn3-is-not-a-function).

### Phase 3: Add Diagnostic Logging

**Purpose**: Trace execution to identify where hooks fail.

**Actions**:
1. Add console.log to every hook
2. Rebuild plugin
3. Restart OpenCode
4. Watch logs

**Validation**: `logging_added`

```typescript
// Add to every hook temporarily
event: async ({ event }) => {
  console.log(`[DEBUG] Event: ${event.type}`);
  // Original code
},

"tool.execute.before": async (input, output) => {
  console.log(`[DEBUG] Tool before: ${input.tool}`);
  // Original code
},

"chat.message": async (input, output) => {
  console.log(`[DEBUG] Chat message: ${input.sessionID}`);
  // Original code
}
```

### Phase 4: Isolate and Fix

**Purpose**: Create minimal reproduction and apply fix.

**Actions**:
1. Create minimal test plugin
2. Compare with working minimal
3. Apply specific fix
4. Verify fix works

**Validation**: `issue_resolved`

---

## 4. 🛠️ VERIFICATION TEST SCRIPT

Complete script to validate plugin structure:

```javascript
#!/usr/bin/env node
/**
 * Plugin Verification Script
 * Usage: node verify-plugin.js ./path/to/plugin
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const pluginPath = process.argv[2] || '.';
const errors = [];
const warnings = [];

console.log('\n=== OpenCode Plugin Verification ===\n');
console.log(`Path: ${resolve(pluginPath)}\n`);

// Check 1: package.json exists
const pkgPath = join(pluginPath, 'package.json');
if (!existsSync(pkgPath)) {
  errors.push('package.json not found');
} else {
  console.log('✅ package.json exists');
  
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    
    // Check required fields
    if (!pkg.name) errors.push('package.json missing "name"');
    if (!pkg.main) errors.push('package.json missing "main"');
    if (pkg.type !== 'module') warnings.push('package.json should have "type": "module"');
    
    // Check exports format
    if (pkg.exports?.['.']?.import && !pkg.exports?.['.']?.default) {
      warnings.push('Use "default" instead of "import" in exports');
    }
    
    // Check optionalDependencies
    if (pkg.dependencies?.['@opencode-ai/plugin']) {
      warnings.push('@opencode-ai/plugin should be in optionalDependencies');
    }
    
    console.log(`   Name: ${pkg.name}`);
    console.log(`   Version: ${pkg.version}`);
    console.log(`   Main: ${pkg.main}`);
    
    // Check 2: Entry point exists
    const mainPath = join(pluginPath, pkg.main);
    if (!existsSync(mainPath)) {
      errors.push(`Entry point not found: ${pkg.main}`);
    } else {
      console.log('✅ Entry point exists');
      
      // Check 3: Try to import and verify export
      try {
        const fullPath = resolve(mainPath);
        const module = await import(fullPath);
        console.log('✅ Module imports successfully');
        
        // Mock context
        const mockCtx = {
          directory: process.cwd(),
          project: { name: 'test' },
          worktree: process.cwd(),
          client: {},
          $: async () => ({ stdout: '', stderr: '' })
        };
        
        // Call the plugin
        const result = await module.default(mockCtx);
        
        // THE CRITICAL CHECK
        if (typeof result === 'function') {
          errors.push('FACTORY PATTERN DETECTED: Plugin returns function instead of hooks');
          console.log('❌ Factory pattern detected');
        } else if (typeof result === 'object' && result !== null) {
          console.log('✅ Plugin returns hooks object');
          console.log(`   Hooks: ${Object.keys(result).join(', ') || '(empty)'}`);
        } else {
          errors.push(`Invalid return type: ${typeof result}`);
        }
        
      } catch (e) {
        errors.push(`Import/execution failed: ${e.message}`);
      }
    }
    
  } catch (e) {
    errors.push(`package.json parse error: ${e.message}`);
  }
}

// Summary
console.log('\n=== Summary ===\n');

if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(w => console.log(`   - ${w}`));
}

if (errors.length > 0) {
  console.log('❌ Errors:');
  errors.forEach(e => console.log(`   - ${e}`));
  console.log('\n❌ VERIFICATION FAILED\n');
  process.exit(1);
} else {
  console.log('✅ VERIFICATION PASSED\n');
  process.exit(0);
}
```

**Validation**: `verification_script_available`

---

## 5. 🐛 ERROR 1: "fn3 is not a function"

The most common and critical plugin error.

### Root Cause Analysis

```
OpenCode Plugin Loader Flow:
1. Imports plugin: import plugin from 'your-plugin'
2. Expects: async function that returns hooks
3. Calls: const hooks = await plugin(ctx)
4. Uses hooks: hooks["chat.message"](input, output)

BROKEN (Factory Pattern):
1. export default createPlugin
2. OpenCode calls: createPlugin(ctx)
3. Returns: actualPlugin function (NOT hooks!)
4. OpenCode tries: actualPlugin["chat.message"]
5. Gets: undefined (function has no properties)
6. Coerced to: 0
7. Error: "fn3 is not a function"
```

### Diagnosis

❌ **BEFORE**: Factory pattern
```typescript
// src/index.ts - BROKEN
export const myPlugin = (options = {}) => {
  return async (ctx) => {
    return { event: async () => {} };
  };
};

export default myPlugin;
// → myPlugin(ctx) returns a function, not hooks
```

### Fix

✅ **AFTER**: Direct export
```typescript
// src/index.ts - FIXED
import type { Plugin } from "@opencode-ai/plugin";

// Configuration at module scope (NOT via factory)
const config = {
  enabled: process.env.PLUGIN_ENABLED !== "false",
};

export const MyPlugin: Plugin = async (ctx) => {
  if (!config.enabled) {
    return {};
  }
  
  return {
    event: async ({ event }) => {
      console.log(event.type);
    }
  };
};

export default MyPlugin;
// → MyPlugin(ctx) returns hooks directly
```

**Why better**: Direct async function returns hooks object immediately. No intermediate function that confuses the loader.

### Verification

```bash
# Rebuild
npm run build

# Test export
node -e "
import('./dist/index.js').then(async (m) => {
  const hooks = await m.default({ directory: '.', project: {}, worktree: '.', client: {}, \$: () => {} });
  console.log('Is function?:', typeof hooks === 'function');
  if (typeof hooks === 'function') {
    console.log('❌ STILL BROKEN: Factory pattern detected');
  } else {
    console.log('✅ FIXED: Returns hooks object');
  }
}).catch(console.error);
"
```

**Validation**: `factory_pattern_fixed`

---

## 6. 🐛 ERROR 2: "BunInstallFailedError"

Dependency installation failures during plugin loading.

### Diagnosis Steps

```bash
# 1. Validate package.json syntax
cat package.json | jq .

# 2. Check for invalid dependency versions
grep -E '"(latest|master|main)"' package.json

# 3. Check for circular dependencies
npx madge --circular src/

# 4. Verify npm registry access
npm ping
```

### Common Causes

❌ **BEFORE**: Invalid dependency specification
```json
{
  "dependencies": {
    "zod": "latest",
    "lodash": "github:lodash/lodash"
  }
}
```

✅ **AFTER**: Valid specifications
```json
{
  "dependencies": {
    "zod": "^3.22.0"
  },
  "optionalDependencies": {
    "@opencode-ai/plugin": "^1.0.174"
  }
}
```

### Fix

```bash
# Clear all caches
rm -rf node_modules package-lock.json bun.lockb
rm -rf ~/.opencode/node_modules ~/.opencode/bun.lock

# Reinstall
npm install

# Rebuild
npm run build
```

**Validation**: `dependencies_fixed`

---

## 7. 🐛 ERROR 3: PLUGIN LOADS BUT HOOKS DON'T FIRE

Plugin appears in logs but hooks never execute.

### Root Cause Analysis

Most common causes:
1. Incorrect hook names
2. Missing return values
3. Hook signature mismatch

### Diagnosis

❌ **BEFORE**: Wrong hook names
```typescript
// These hook names are WRONG and won't be recognized
{
  onEvent(event) { },              // Wrong: should be "event"
  toolExecuteBefore(params) { },   // Wrong: should be "tool.execute.before"
  "tool.before"(params) { },       // Wrong: should be "tool.execute.before"
  chatMessage(input, output) { }   // Wrong: should be "chat.message"
}
```

✅ **AFTER**: Exact hook names
```typescript
{
  event: async ({ event }) => { },
  "tool.execute.before": async (input, output) => { },
  "tool.execute.after": async (input, output) => { },
  "chat.message": async (input, output) => { },
  "chat.params": async (input, output) => { },
  "permission.ask": async (input, output) => { }
}
```

### Hook Name Reference

| Wrong Name | Correct Name |
|------------|--------------|
| `onEvent` | `event` |
| `toolExecuteBefore` | `tool.execute.before` |
| `toolExecuteAfter` | `tool.execute.after` |
| `chatMessage` | `chat.message` |
| `chatParams` | `chat.params` |
| `permissionAsk` | `permission.ask` |
| `configHook` | `config` |

**Validation**: `hook_names_verified`

---

## 8. 🐛 ERROR 4: "Cannot find module"

Build output doesn't match expected import paths.

### Diagnosis

```bash
# Check what's in dist/
ls -la dist/

# Verify package.json points to correct file
cat package.json | grep -E '"(main|exports)"' -A 5

# Check tsconfig outDir
cat tsconfig.json | grep -E '"outDir"'
```

### Common Causes

❌ **BEFORE**: Mismatched paths
```json
{
  "main": "dist/index.js",
  "exports": {
    ".": {
      "import": "./dist/index.mjs"
    }
  }
}
```

✅ **AFTER**: Correct paths
```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

### Fix

```bash
# Clean and rebuild
rm -rf dist/
npm run build

# Verify output exists
ls -la dist/index.js dist/index.d.ts
```

**Validation**: `build_output_verified`

---

## 9. 🐛 ERROR 5: PLUGIN NOT LOADING AT ALL

Plugin doesn't appear in OpenCode, no errors shown.

### Diagnosis Checklist

```bash
# 1. Verify plugin location
ls -la .opencode/plugin/
ls -la ~/.config/opencode/plugin/

# 2. Check package.json exists and has required fields
cat .opencode/plugin/my-plugin/package.json | jq '{name, version, main, type}'

# 3. Verify entry point exists
ls -la .opencode/plugin/my-plugin/dist/index.js

# 4. Check file permissions
ls -la .opencode/plugin/my-plugin/
```

### Required Structure

```
.opencode/plugin/my-plugin/
├── package.json          # Required: name, version, main, type: "module"
├── dist/
│   ├── index.js         # Required: built plugin
│   └── index.d.ts       # Optional: type definitions
└── src/
    └── index.ts         # Source (not loaded directly)
```

### Required package.json Fields

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "exports": {
    ".": {
      "default": "./dist/index.js"
    }
  }
}
```

**Validation**: `plugin_discovery_verified`

---

## 10. 🐛 ERROR 6: HOOK NOT TRIGGERING FOR SPECIFIC EVENTS

Hook registered but doesn't fire for expected events.

### Diagnosis

Add comprehensive event logging:

```typescript
event: async ({ event }) => {
  // Log ALL events to discover what's actually happening
  console.log(`[DEBUG] Event type: ${event.type}`);
  console.log(`[DEBUG] Properties: ${JSON.stringify(event.properties, null, 2)}`);
}
```

### Event Type Mismatches

| Expected (Wrong) | Actual (Correct) |
|------------------|------------------|
| `session.start` | `session.created` |
| `session.end` | `session.deleted` |
| `file.changed` | `file.edited` |
| `file.saved` | `file.edited` |
| `tool.executed` | Use `tool.execute.after` |

### Complete Event Type List

```typescript
type EventType =
  // Session lifecycle
  | "session.created"
  | "session.idle"
  | "session.deleted"
  | "session.compacted"
  | "session.error"
  
  // File operations
  | "file.edited"
  | "file.watcher.updated"
  
  // Messages
  | "message.updated"
  | "message.removed"
  
  // Commands
  | "command.executed"
  
  // Permissions
  | "permission.replied"
  | "permission.updated"
  
  // Tools (use hooks, not events)
  | "tool.execute.before"
  | "tool.execute.after";
```

**Validation**: `event_types_verified`

---

## 11. 📁 LOG FILE LOCATIONS

```
~/.opencode/logs/
├── opencode.log          # Main application log
└── plugins/              # Plugin-specific logs
```

### Viewing Logs

```bash
# Tail main log
tail -f ~/.opencode/logs/opencode.log

# Grep for plugin errors
grep -i "error\|plugin" ~/.opencode/logs/opencode.log

# Search for specific plugin
grep "my-plugin" ~/.opencode/logs/*.log
```

---

## 12. 🧹 CLEAR CACHE COMMANDS

When plugins behave unexpectedly:

```bash
# Clear OpenCode cache
rm -rf ~/.opencode/node_modules
rm -rf ~/.opencode/bun.lock

# Clear bun/npm cache
bun pm cache rm
# or
npm cache clean --force

# Clear and rebuild
rm -rf node_modules dist
npm install
npm run build
```

---

## 13. 📋 STEP-BY-STEP DEBUGGING WORKFLOW

Follow these steps in order:

```
Step 1: Verify Structure
├── Check: ls -la .opencode/plugin/my-plugin/
├── Check: cat package.json | jq .
├── Check: ls -la dist/index.js
└── Validation: structure_verified

Step 2: Verify Exports
├── Run verification script
├── Check for factory pattern
└── Validation: exports_verified

Step 3: Add Diagnostic Logging
├── Add console.log to all hooks
├── Rebuild: npm run build
├── Restart OpenCode
└── Validation: logging_added

Step 4: Isolate and Fix
├── Create minimal test plugin
├── Compare with working example
├── Apply specific fix
└── Validation: issue_resolved
```

---

## 14. 📋 COMMON FIXES SUMMARY

| Problem | Fix |
|---------|-----|
| Factory function | Change to direct export |
| Missing return | Add return statement |
| Wrong hook name | Use exact names from docs |
| Build mismatch | Rebuild and verify dist/ |
| Cache issues | Clear ~/.opencode/cache/ |
| Missing entry | Update package.json main field |
| Deps not installed | Run bun/npm install |

---

## 15. 🔗 RELATED RESOURCES

- [plugin_patterns.md](./plugin_patterns.md) - Correct export patterns
- [hook_reference.md](./hook_reference.md) - Hook API documentation
- [verification_script.js](../assets/verification_script.js) - Full verification script
- [plugin_template.ts](../assets/plugin_template.ts) - Working template
