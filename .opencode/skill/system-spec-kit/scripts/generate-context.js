// ───────────────────────────────────────────────────────────────
// CLI: GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

const path = require('path');
const fsSync = require('fs');
const { CONFIG, findActiveSpecsDir, getSpecsDirectories } = require('./core');
const { runWorkflow } = require('./core/workflow');
const { loadCollectedData } = require('./loaders');
const { collectSessionData } = require('./extractors/collect-session-data');

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
`;

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(HELP_TEXT);
  process.exit(0);
}

/* ─────────────────────────────────────────────────────────────
   3. CLI ARGUMENT PARSING
──────────────────────────────────────────────────────────────── */

function parseArguments() {
  const arg1 = process.argv[2];
  const arg2 = process.argv[3];
  if (!arg1) return;

  const isSpecFolder = (
    arg1.startsWith('specs/') || 
    arg1.startsWith('.opencode/specs/') ||
    /^\d{3}-/.test(path.basename(arg1))
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
  
  const folderName = path.basename(CONFIG.SPEC_FOLDER_ARG);
  if (/^\d{3}-/.test(folderName)) return;

  console.error(`\n❌ Invalid spec folder format: ${CONFIG.SPEC_FOLDER_ARG}`);
  console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');

  const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
  if (fsSync.existsSync(specsDir)) {
    try {
      const available = fsSync.readdirSync(specsDir);
      const matches = available.filter(n => n.includes(CONFIG.SPEC_FOLDER_ARG) && /^\d{3}-/.test(n));
      
      if (matches.length > 0) {
        console.error('Did you mean:');
        matches.forEach(m => console.error(`  - ${m}`));
      } else {
        const allSpecs = available.filter(n => /^\d{3}-/.test(n) && !n.match(/^z_|archive/i))
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
   4. MAIN ENTRY POINT
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
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

if (require.main === module) {
  main().catch(error => {
    console.error(`❌ Fatal error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { main, parseArguments, validateArguments };
