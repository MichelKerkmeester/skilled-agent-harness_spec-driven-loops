// ---------------------------------------------------------------
// MODULE: Generate Context
// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
// ---------------------------------------------------------------

// Node stdlib
import * as path from 'path';
import * as fsSync from 'fs';

// Internal modules
import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from '../core';
import { runWorkflow } from '../core/workflow';
import { loadCollectedData } from '../loaders';
import { collectSessionData } from '../extractors/collect-session-data';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

export interface SpecFolderValidation {
  valid: boolean;
  reason?: string;
  warning?: string;
}

/* -----------------------------------------------------------------
   2. HELP TEXT
------------------------------------------------------------------*/

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
      "knowledgeScore": 40,
      "uncertaintyScore": 60,
      "contextScore": 50,
      "timestamp": "ISO-8601",
      "gaps": ["gap1", "gap2"],
      "confidence": 45,
      "readiness": "Needs research"
    },
    "postflight": {
      "knowledgeScore": 75,
      "uncertaintyScore": 25,
      "contextScore": 80,
      "gapsClosed": ["gap1"],
      "newGaps": ["new-gap"]
    }
  }

  Learning Delta Calculation:
  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
  - Context Delta = postflight.contextScore - preflight.contextScore
  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
`;

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(HELP_TEXT);
  process.exit(0);
}

/* -----------------------------------------------------------------
   2.1 SIGNAL HANDLERS
------------------------------------------------------------------*/

process.on('SIGTERM', () => {
  console.log('\nWarning: Received SIGTERM signal, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nWarning: Received SIGINT signal, shutting down gracefully...');
  process.exit(0);
});

/* -----------------------------------------------------------------
   3. SPEC FOLDER VALIDATION
------------------------------------------------------------------*/

const SPEC_FOLDER_PATTERN: RegExp = /^\d{3}-[a-z][a-z0-9-]*$/;
const SPEC_FOLDER_BASIC_PATTERN: RegExp = /^\d{3}-[a-zA-Z]/;

function isValidSpecFolder(folderPath: string): SpecFolderValidation {
  const folderName = path.basename(folderPath);

  if (!SPEC_FOLDER_PATTERN.test(folderName)) {
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

/* -----------------------------------------------------------------
   4. CLI ARGUMENT PARSING
------------------------------------------------------------------*/

function parseArguments(): void {
  const arg1: string | undefined = process.argv[2];
  const arg2: string | undefined = process.argv[3];
  if (!arg1) return;

  const folderName = path.basename(arg1);
  const isSpecFolderPath: boolean = (
    arg1.startsWith('specs/') ||
    arg1.startsWith('.opencode/specs/') ||
    SPEC_FOLDER_BASIC_PATTERN.test(folderName)
  ) && !arg1.endsWith('.json');

  if (isSpecFolderPath) {
    CONFIG.SPEC_FOLDER_ARG = arg1;
    CONFIG.DATA_FILE = null;
    console.log('   Stateless mode: Spec folder provided directly');
  } else {
    CONFIG.DATA_FILE = arg1;
    CONFIG.SPEC_FOLDER_ARG = arg2 || null;
  }
}

function validateArguments(): void {
  if (!CONFIG.SPEC_FOLDER_ARG) return;

  const validation = isValidSpecFolder(CONFIG.SPEC_FOLDER_ARG);

  if (validation.warning) {
    console.warn(`   Warning: ${validation.warning}`);
  }

  if (validation.valid) return;

  console.error(`\nError: Invalid spec folder format: ${CONFIG.SPEC_FOLDER_ARG}`);
  console.error(`   Reason: ${validation.reason}`);
  console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');

  const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
  if (fsSync.existsSync(specsDir)) {
    try {
      const available = fsSync.readdirSync(specsDir);
      const matches = available.filter((n) => n.includes(path.basename(CONFIG.SPEC_FOLDER_ARG!)) && SPEC_FOLDER_PATTERN.test(n));

      if (matches.length > 0) {
        console.error('Did you mean:');
        matches.forEach((m) => console.error(`  - ${m}`));
      } else {
        const allSpecs = available.filter((n) => SPEC_FOLDER_PATTERN.test(n) && !n.match(/^z_|archive/i))
                                  .sort().reverse().slice(0, 5);
        if (allSpecs.length) {
          console.error('Available spec folders:');
          allSpecs.forEach((f) => console.error(`  - ${f}`));
        }
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      console.error('[generate-context] Failed to list spec folders:', errMsg);
    }
  }
  console.error('\nUsage: node generate-context.js <data-file> [spec-folder-name]\n');
  process.exit(1);
}

/* -----------------------------------------------------------------
   5. MAIN ENTRY POINT
------------------------------------------------------------------*/

async function main(): Promise<void> {
  console.log('Starting memory skill...\n');

  try {
    parseArguments();
    validateArguments();

    await runWorkflow({
      loadDataFn: loadCollectedData,
      collectSessionDataFn: collectSessionData
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected/.test(errMsg);

    if (isExpected) {
      console.error(`\nError: ${errMsg}`);
    } else {
      console.error('Unexpected Error:', errMsg);
      if (error instanceof Error) {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

/* -----------------------------------------------------------------
   6. EXPORTS
------------------------------------------------------------------*/

if (require.main === module) {
  main().catch((error: unknown) => {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`Fatal error: ${errMsg}`);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  });
}

export {
  main,
  parseArguments,
  validateArguments,
  isValidSpecFolder,
  SPEC_FOLDER_PATTERN,
  SPEC_FOLDER_BASIC_PATTERN,
};
