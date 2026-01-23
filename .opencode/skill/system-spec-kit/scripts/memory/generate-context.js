// ───────────────────────────────────────────────────────────────
// CLI: GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

const path = require('path');
const fsSync = require('fs');
const os = require('os');
const { CONFIG, findActiveSpecsDir, getSpecsDirectories } = require('../core');
const { runWorkflow } = require('../core/workflow');
const { loadCollectedData } = require('../loaders');
const { collectSessionData } = require('../extractors/collect-session-data');

/* ─────────────────────────────────────────────────────────────
   2. HELP TEXT
──────────────────────────────────────────────────────────────── */

const HELP_TEXT = `
Usage: node generate-context.js [options] <input>

Arguments:
  <input>           Either a JSON data file path OR a spec folder path
                    - JSON mode: node generate-context.js data.json [spec-folder]
                    - Direct mode: node generate-context.js specs/001-feature/
                    - Direct mode: node generate-context.js .opencode/specs/001-feature/

Options:
  --help, -h        Show this help message

Examples:
  node generate-context.js /tmp/context-data.json
  node generate-context.js /tmp/context-data.json specs/001-feature/
  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
  node generate-context.js specs/001-feature/
  node generate-context.js .opencode/specs/001-feature/

Output:
  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
  for indexing by the Spec Kit Memory system.

JSON Data Format (with preflight/postflight support):
  {
    "user_prompts": [...],
    "observations": [...],
    "recent_context": [...],
    "preflight": {
      "knowledgeScore": 40,           // 0-100: Initial knowledge level
      "uncertaintyScore": 60,         // 0-100: Initial uncertainty level
      "contextScore": 50,             // 0-100: Initial context quality
      "timestamp": "ISO-8601",        // Session start timestamp
      "gaps": ["gap1", "gap2"],       // Initial knowledge gaps
      "confidence": 45,               // Overall confidence %
      "readiness": "Needs research"   // Readiness assessment
    },
    "postflight": {
      "knowledgeScore": 75,           // Final knowledge level
      "uncertaintyScore": 25,         // Final uncertainty level
      "contextScore": 80,             // Final context quality
      "gapsClosed": ["gap1"],         // Gaps resolved during session
      "newGaps": ["new-gap"]          // New gaps discovered
    }
  }

  Learning Delta Calculation:
  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
  - Context Delta = postflight.contextScore - preflight.contextScore
  - Learning Index = (Know × 0.4) + (Uncert × 0.35) + (Context × 0.25)
`;

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(HELP_TEXT);
  process.exit(0);
}

/* ─────────────────────────────────────────────────────────────
   2.1 SIGNAL HANDLERS
──────────────────────────────────────────────────────────────── */

process.on('SIGTERM', () => {
  console.log('\n⚠️  Received SIGTERM signal, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  Received SIGINT signal, shutting down gracefully...');
  process.exit(0);
});

/* ─────────────────────────────────────────────────────────────
   3. SPEC FOLDER VALIDATION
──────────────────────────────────────────────────────────────── */

/**
 * Strict regex for spec folder names.
 * Format: NNN-short-name where:
 * - NNN is exactly 3 digits (001-999)
 * - Followed by a hyphen
 * - Then lowercase letters, digits, or hyphens
 * - Must start with a letter after the prefix
 * 
 * Valid: 001-feature, 064-bug-analysis-and-fix, 003-memory-and-spec-kit
 * Invalid: 1-short, 0001-too-long, 001_underscore, 001-UPPERCASE
 */
const SPEC_FOLDER_PATTERN = /^\d{3}-[a-z][a-z0-9-]*$/;

/**
 * Basic pattern for initial detection (slightly more permissive).
 * Used for quick checks before full validation.
 */
const SPEC_FOLDER_BASIC_PATTERN = /^\d{3}-[a-zA-Z]/;

/**
 * Validates if a folder path is a valid spec folder.
 * @param {string} folderPath - Path to validate
 * @returns {{ valid: boolean, reason?: string, warning?: string }}
 */
function isValidSpecFolder(folderPath) {
  const folderName = path.basename(folderPath);
  
  // Check strict folder name pattern
  if (!SPEC_FOLDER_PATTERN.test(folderName)) {
    // Check if it's close but has issues
    if (/^\d{3}-/.test(folderName)) {
      if (/[A-Z]/.test(folderName)) {
        return { valid: false, reason: 'Spec folder name should be lowercase' };
      }
      if (/_/.test(folderName)) {
        return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
      }
      if (!/^[a-z]/.test(folderName.slice(4))) {
        return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
      }
    }
    return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
  }
  
  // Check parent path contains 'specs' (warning only, not blocking)
  const normalizedPath = folderPath.replace(/\\/g, '/');
  const hasSpecsParent = normalizedPath.includes('/specs/') || 
                         normalizedPath.startsWith('specs/') ||
                         normalizedPath.includes('/.opencode/specs/') ||
                         normalizedPath.startsWith('.opencode/specs/');
  
  if (!hasSpecsParent) {
    return { 
      valid: true, 
      warning: `Spec folder not under specs/ or .opencode/specs/ path: ${folderPath}` 
    };
  }
  
  return { valid: true };
}

/* ─────────────────────────────────────────────────────────────
   4. CLI ARGUMENT PARSING
──────────────────────────────────────────────────────────────── */

function parseArguments() {
  const arg1 = process.argv[2];
  const arg2 = process.argv[3];
  if (!arg1) return;

  const folderName = path.basename(arg1);
  const isSpecFolder = (
    arg1.startsWith('specs/') || 
    arg1.startsWith('.opencode/specs/') ||
    SPEC_FOLDER_BASIC_PATTERN.test(folderName)
  ) && !arg1.endsWith('.json');

  if (isSpecFolder) {
    CONFIG.SPEC_FOLDER_ARG = arg1;
    CONFIG.DATA_FILE = null;
    console.log(`   ℹ️  Stateless mode: Spec folder provided directly`);
  } else {
    CONFIG.DATA_FILE = arg1;
    CONFIG.SPEC_FOLDER_ARG = arg2 || null;
  }
}

function validateArguments() {
  if (!CONFIG.SPEC_FOLDER_ARG) return;
  
  const validation = isValidSpecFolder(CONFIG.SPEC_FOLDER_ARG);
  
  if (validation.warning) {
    console.warn(`   ⚠️  ${validation.warning}`);
  }
  
  if (validation.valid) return;

  console.error(`\n❌ Invalid spec folder format: ${CONFIG.SPEC_FOLDER_ARG}`);
  console.error(`   Reason: ${validation.reason}`);
  console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');

  const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
  if (fsSync.existsSync(specsDir)) {
    try {
      const available = fsSync.readdirSync(specsDir);
      const matches = available.filter(n => n.includes(path.basename(CONFIG.SPEC_FOLDER_ARG)) && SPEC_FOLDER_PATTERN.test(n));
      
      if (matches.length > 0) {
        console.error('Did you mean:');
        matches.forEach(m => console.error(`  - ${m}`));
      } else {
        const allSpecs = available.filter(n => SPEC_FOLDER_PATTERN.test(n) && !n.match(/^z_|archive/i))
                                  .sort().reverse().slice(0, 5);
        if (allSpecs.length) {
          console.error('Available spec folders:');
          allSpecs.forEach(f => console.error(`  - ${f}`));
        }
      }
    } catch (_) { /* ignore */ }
  }
  console.error('\nUsage: node generate-context.js <data-file> [spec-folder-name]\n');
  process.exit(1);
}

/* ─────────────────────────────────────────────────────────────
   5. MAIN ENTRY POINT
──────────────────────────────────────────────────────────────── */

async function main() {
  console.log('🚀 Starting memory skill...\n');
  
  try {
    parseArguments();
    validateArguments();
    
    await runWorkflow({
      loadDataFn: loadCollectedData,
      collectSessionDataFn: collectSessionData
    });
  } catch (error) {
    const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected/.test(error.message);
    
    if (isExpected) {
      console.error(`\n❌ Error: ${error.message}`);
    } else {
      console.error('❌ Unexpected Error:', error.message);
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

if (require.main === module) {
  main().catch(error => {
    console.error(`❌ Fatal error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { 
  main, 
  parseArguments, 
  validateArguments, 
  isValidSpecFolder,
  SPEC_FOLDER_PATTERN,
  SPEC_FOLDER_BASIC_PATTERN
};
