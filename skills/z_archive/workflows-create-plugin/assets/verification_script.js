#!/usr/bin/env node
/**
 * Plugin Structure Verification Script
 * 
 * Usage: node verification_script.js ./dist/index.js
 * 
 * This script tests that a plugin exports correctly and doesn't use
 * the factory pattern that causes "fn3 is not a function" errors.
 */

const path = require('path');

async function verifyPlugin(pluginPath) {
  console.log(`\nVerifying plugin: ${pluginPath}\n`);
  console.log('='.repeat(50));
  
  try {
    // Import the plugin
    const fullPath = path.resolve(pluginPath);
    const module = await import(fullPath);
    
    console.log('\n1. Module Import: ✅ SUCCESS');
    console.log(`   Exports: ${Object.keys(module).join(', ')}`);
    
    // Check for default export
    if (!module.default) {
      console.log('\n2. Default Export: ❌ FAILED');
      console.log('   ERROR: No default export found');
      process.exit(1);
    }
    console.log('\n2. Default Export: ✅ PRESENT');
    console.log(`   Type: ${typeof module.default}`);
    
    // Mock context
    const mockContext = {
      directory: process.cwd(),
      project: { name: 'test-project' },
      worktree: process.cwd(),
      client: {},
      $: async (strings, ...values) => ({ stdout: '', stderr: '' })
    };
    
    // Call the plugin
    console.log('\n3. Calling plugin with mock context...');
    const result = await module.default(mockContext);
    
    // Check what was returned
    console.log('\n4. Plugin Return Value:');
    console.log(`   Type: ${typeof result}`);
    console.log(`   Is Function: ${typeof result === 'function'}`);
    console.log(`   Keys: ${Object.keys(result).join(', ') || '(empty object)'}`);
    
    // THE CRITICAL CHECK
    if (typeof result === 'function') {
      console.log('\n❌ FAILED: FACTORY PATTERN DETECTED!');
      console.log('   The plugin returned a function instead of a hooks object.');
      console.log('   This causes "fn3 is not a function" errors.');
      console.log('\n   FIX: Export the plugin function directly:');
      console.log('   export default MyPlugin; // NOT: export default createPlugin()');
      process.exit(1);
    }
    
    if (typeof result !== 'object' || result === null) {
      console.log('\n❌ FAILED: Invalid return type');
      console.log(`   Expected: object, Got: ${typeof result}`);
      process.exit(1);
    }
    
    // Check for valid hooks
    const validHooks = [
      'event', 'config', 'tool', 'auth',
      'chat.message', 'chat.params', 'permission.ask',
      'tool.execute.before', 'tool.execute.after',
      'experimental.chat.messages.transform',
      'experimental.chat.system.transform',
      'experimental.session.compacting'
    ];
    
    const foundHooks = Object.keys(result).filter(k => validHooks.includes(k));
    const unknownKeys = Object.keys(result).filter(k => !validHooks.includes(k));
    
    console.log('\n5. Hooks Analysis:');
    console.log(`   Valid hooks found: ${foundHooks.length > 0 ? foundHooks.join(', ') : '(none)'}`);
    if (unknownKeys.length > 0) {
      console.log(`   Unknown keys: ${unknownKeys.join(', ')}`);
    }
    
    // Verify hook types
    let hookErrors = 0;
    for (const hook of foundHooks) {
      const hookValue = result[hook];
      if (hook === 'tool') {
        if (typeof hookValue !== 'object') {
          console.log(`   ❌ ${hook}: Expected object, got ${typeof hookValue}`);
          hookErrors++;
        } else {
          console.log(`   ✅ ${hook}: object with ${Object.keys(hookValue).length} tools`);
        }
      } else {
        if (typeof hookValue !== 'function') {
          console.log(`   ❌ ${hook}: Expected function, got ${typeof hookValue}`);
          hookErrors++;
        } else {
          console.log(`   ✅ ${hook}: function`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    if (hookErrors > 0) {
      console.log('❌ VERIFICATION FAILED: Some hooks have incorrect types');
      process.exit(1);
    } else {
      console.log('✅ VERIFICATION PASSED: Plugin structure is correct!');
      console.log('\nThe plugin should work correctly with OpenCode.');
    }
    
  } catch (error) {
    console.log('\n❌ VERIFICATION FAILED');
    console.log(`   Error: ${error.message}`);
    if (error.stack) {
      console.log(`   Stack: ${error.stack.split('\n').slice(1, 4).join('\n   ')}`);
    }
    process.exit(1);
  }
}

// Main
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node verification_script.js <path-to-plugin.js>');
  console.log('Example: node verification_script.js ./dist/index.js');
  process.exit(1);
}

verifyPlugin(args[0]);
