// ---------------------------------------------------------------
// MODULE: Folder Detector
// Detects, lists, and resolves spec folders with interactive selection and alignment scoring
// ---------------------------------------------------------------

// Node stdlib
import * as fs from 'fs/promises';
import * as path from 'path';

// Internal modules
import { promptUser, promptUserChoice } from '../utils/prompt-utils';
import { CONFIG, findActiveSpecsDir, getAllExistingSpecsDirs, SPEC_FOLDER_PATTERN, findChildFolderAsync } from '../core';
import {
  ALIGNMENT_CONFIG,
  isArchiveFolder,
  extractConversationTopics,
  calculateAlignmentScore,
  validateContentAlignment,
  validateFolderAlignment,
} from './alignment-validator';
import type { CollectedDataForAlignment } from './alignment-validator';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

interface SpecFolderInfo {
  path: string;
  name: string;
  score?: number;
}

function getSpecFolderFromCollectedData(collectedData: CollectedDataForAlignment | null): string | null {
  if (!collectedData || typeof collectedData !== 'object') {
    return null;
  }

  const specFolder = (collectedData as { SPEC_FOLDER?: unknown }).SPEC_FOLDER;
  return typeof specFolder === 'string' && specFolder.trim().length > 0
    ? specFolder
    : null;
}

function getSpecFolderFromSessionRow(row: unknown): string | null {
  if (!row || typeof row !== 'object') {
    return null;
  }

  const specFolder = (row as { spec_folder?: unknown }).spec_folder;
  return typeof specFolder === 'string' && specFolder.trim().length > 0
    ? specFolder
    : null;
}

/* -----------------------------------------------------------------
   2. HELPER FUNCTIONS
------------------------------------------------------------------*/

function filterArchiveFolders(folders: string[]): string[] {
  return folders.filter((folder) => !isArchiveFolder(folder));
}

/** Print the standard "no spec folder found" error message. */
function printNoSpecFolderError(commandName: string = 'memory'): void {
  console.error('\n Cannot save context: No spec folder found\n');
  console.error(`${commandName} requires a spec folder to save memory documentation.`);
  console.error('Every conversation with file changes must have a spec folder per conversation-documentation rules.\n');
  console.error('Please create a spec folder first:');
  console.error('  mkdir -p specs/###-feature-name/');
  console.error('  OR: mkdir -p .opencode/specs/###-feature-name/\n');
  console.error(`Then re-run ${commandName}.\n`);
}

/* -----------------------------------------------------------------
   3. FOLDER DETECTION
------------------------------------------------------------------*/

async function detectSpecFolder(collectedData: CollectedDataForAlignment | null = null): Promise<string> {
  const cwd = process.cwd();

  const existingSpecsDirs = getAllExistingSpecsDirs();
  if (existingSpecsDirs.length > 1) {
    console.warn('Warning: Multiple specs directories found. Using: ' + existingSpecsDirs[0]);
    console.warn('   Other locations ignored: ' + existingSpecsDirs.slice(1).join(', '));
  }

  const specsDir = findActiveSpecsDir();
  const defaultSpecsDir = path.join(CONFIG.PROJECT_ROOT, 'specs');

  // Priority 1: CLI argument
  if (CONFIG.SPEC_FOLDER_ARG) {
    const specArg: string = CONFIG.SPEC_FOLDER_ARG;
    const specFolderPath: string = path.isAbsolute(specArg)
      ? specArg
      : specArg.startsWith('specs/')
        ? path.join(CONFIG.PROJECT_ROOT, specArg)
        : specArg.startsWith('.opencode/specs/')
          ? path.join(CONFIG.PROJECT_ROOT, specArg)
          : path.join(specsDir || defaultSpecsDir, specArg);

    try {
      await fs.access(specFolderPath);
      console.log(`   Using spec folder from CLI argument: ${path.basename(specFolderPath)}`);

      if (collectedData) {
        const folderName = path.basename(specFolderPath);
        const alignmentResult = await validateContentAlignment(
          collectedData, folderName, specsDir || defaultSpecsDir
        );

        if (alignmentResult.useAlternative && alignmentResult.selectedFolder) {
          console.log(`   Note: "${alignmentResult.selectedFolder}" may be a better match, but respecting explicit CLI argument`);
        }
      }

      return specFolderPath;
    } catch {
      // NEW: Try nested parent/child resolution (e.g., "005-memory/002-upgrade")
      const argParts = specArg.split('/');
      if (argParts.length === 2 && SPEC_FOLDER_PATTERN.test(argParts[0]) && SPEC_FOLDER_PATTERN.test(argParts[1])) {
        for (const dir of existingSpecsDirs) {
          const nestedPath = path.join(dir, argParts[0], argParts[1]);
          try {
            await fs.access(nestedPath);
            console.log(`   Using spec folder from CLI argument (nested): ${argParts[0]}/${argParts[1]}`);
            return nestedPath;
          } catch {
            // Not found in this specs dir, continue searching
          }
        }
      }

      // Bare child search across all parents
      const childResult = await findChildFolderAsync(specArg);
      if (childResult) {
        return childResult;
      }

      console.error(`\n Specified spec folder not found: ${CONFIG.SPEC_FOLDER_ARG}\n`);
      console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');

      try {
        const searchDir = specsDir || defaultSpecsDir;
        const entries = await fs.readdir(searchDir);
        const available = entries
          .filter((name) => /^\d{3}-/.test(name))
          .filter((name) => !isArchiveFolder(name))
          .sort()
          .reverse();

        if (available.length > 0) {
          console.error('Available spec folders:');
          available.slice(0, 10).forEach((folder) => {
            console.error(`  - ${folder}`);
          });
        }
      } catch {
        // Silently ignore if we can't read specs directory
      }

      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
      throw new Error(`Spec folder not found: ${CONFIG.SPEC_FOLDER_ARG}`);
    }
  }

  // Priority 2: JSON data field
  const specFolderFromData = getSpecFolderFromCollectedData(collectedData);
  if (specFolderFromData && collectedData) {
    const activeDir = specsDir || defaultSpecsDir;
    const specFolderPath = path.join(activeDir, specFolderFromData);

    try {
      await fs.access(specFolderPath);
      console.log(`   Using spec folder from data: ${specFolderFromData}`);
      const alignmentResult = await validateFolderAlignment(collectedData, specFolderFromData, activeDir);
      if (alignmentResult.proceed) {
        if (alignmentResult.useAlternative) {
          if (!alignmentResult.selectedFolder) {
            throw new Error('Expected selectedFolder to be set when useAlternative is true');
          }
          return path.join(activeDir, alignmentResult.selectedFolder);
        }
        return specFolderPath;
      }
    } catch {
      // NEW: Try nested parent/child resolution for JSON data value
      const dataParts = specFolderFromData.split('/');
      if (dataParts.length === 2 && SPEC_FOLDER_PATTERN.test(dataParts[0]) && SPEC_FOLDER_PATTERN.test(dataParts[1])) {
        for (const dir of existingSpecsDirs) {
          const nestedPath = path.join(dir, dataParts[0], dataParts[1]);
          try {
            await fs.access(nestedPath);
            console.log(`   Using spec folder from data (nested): ${dataParts[0]}/${dataParts[1]}`);

            if (collectedData) {
              const alignmentResult = await validateFolderAlignment(collectedData, dataParts[1], path.join(dir, dataParts[0]));
              if (alignmentResult.proceed && alignmentResult.useAlternative && alignmentResult.selectedFolder) {
                const altPath = path.join(dir, dataParts[0], alignmentResult.selectedFolder);
                try {
                  await fs.access(altPath);
                  return altPath;
                } catch {
                  // Alternative not found as nested, use original
                }
              }
            }

            return nestedPath;
          } catch {
            // Not found in this specs dir, continue searching
          }
        }
      }

      // Bare child search across all parents
      const childResult = await findChildFolderAsync(specFolderFromData);
      if (childResult) {
        return childResult;
      }

      console.warn(`   Spec folder from data not found: ${specFolderFromData}`);
    }
  }

  // Priority 2.5: Session learning DB lookup (most recent preflight spec folder)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Database = require(
      path.join(CONFIG.PROJECT_ROOT, '.opencode/skill/system-spec-kit/mcp_server/node_modules/better-sqlite3')
    );
    const dbPath = path.join(
      CONFIG.PROJECT_ROOT,
      '.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite'
    );
    const db = new Database(dbPath, { readonly: true });
    try {
      const row = db.prepare(
        `SELECT spec_folder FROM session_learning WHERE created_at > datetime('now', '-24 hours') ORDER BY created_at DESC LIMIT 1`
      ).get() as unknown;

      const sessionSpecFolder = getSpecFolderFromSessionRow(row);

      if (sessionSpecFolder) {
        const activeDir = specsDir || defaultSpecsDir;
        const resolvedPath = path.join(activeDir, sessionSpecFolder);
        await fs.access(resolvedPath);
        console.log(`   Using spec folder from session learning: ${sessionSpecFolder}`);
        return resolvedPath;
      }
    } finally {
      db.close();
    }
  } catch (err: unknown) {
    // DB not available, table missing, or folder doesn't exist — fall through to next priority
    if (process.env.DEBUG) {
      console.debug(`   [Priority 2.5] Session learning lookup skipped: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Priority 3: Current working directory
  if (cwd.includes('/specs/') || cwd.includes('\\specs\\')) {
    const match = cwd.match(/(.*[\/\\](?:\.opencode[\/\\])?specs[\/\\][^\/\\]+)/);
    if (match) {
      return path.normalize(match[1]);
    }
  }

  // Priority 4: Auto-detect from specs directory
  if (!specsDir) {
    printNoSpecFolderError();
    throw new Error('No specs/ directory found');
  }

  try {
    const entries = await fs.readdir(specsDir);
    let specFolders = entries
      .filter((name) => /^\d{3}-/.test(name))
      .sort()
      .reverse();

    specFolders = filterArchiveFolders(specFolders);

    // NEW: 2-level deep scanning — prefer nested child over parent
    {
      interface FolderCandidate {
        folderPath: string;
        mtime: number;
        isNested: boolean;
      }
      const candidates: FolderCandidate[] = [];

      for (const topFolder of specFolders) {
        const topPath = path.join(specsDir, topFolder);
        try {
          // Scan children of this top-level folder
          const children = await fs.readdir(topPath);
          for (const child of children) {
            if (!SPEC_FOLDER_PATTERN.test(child)) continue;
            const childPath = path.join(topPath, child);
            try {
              const childStat = await fs.stat(childPath);
              if (childStat.isDirectory()) {
                candidates.push({ folderPath: childPath, mtime: childStat.mtimeMs, isNested: true });
              }
            } catch {
              // Can't stat child, skip
            }
          }

          // Also include the parent as a fallback candidate
          const topStat = await fs.stat(topPath);
          candidates.push({ folderPath: topPath, mtime: topStat.mtimeMs, isNested: false });
        } catch {
          // Can't read/stat top-level folder, skip
        }
      }

      // If nested children were found, prefer the most recent child by mtime
      const nestedCandidates = candidates.filter((c) => c.isNested);
      if (nestedCandidates.length > 0) {
        nestedCandidates.sort((a, b) => b.mtime - a.mtime);
        const best = nestedCandidates[0];
        const parentName = path.basename(path.dirname(best.folderPath));
        const childName = path.basename(best.folderPath);
        console.log(`   Auto-detected nested spec folder: ${parentName}/${childName}`);
        return best.folderPath;
      }
    }

    if (specFolders.length === 0) {
      printNoSpecFolderError();
      throw new Error('No spec folders found in specs/ directory');
    }

    if (!collectedData || specFolders.length === 1) {
      return path.join(specsDir, specFolders[0]);
    }

    if (process.env.AUTO_SAVE_MODE === 'true') {
      return path.join(specsDir, specFolders[0]);
    }

    const conversationTopics = extractConversationTopics(collectedData);
    const mostRecent = specFolders[0];
    const alignmentScore = calculateAlignmentScore(conversationTopics, mostRecent);

    if (alignmentScore >= ALIGNMENT_CONFIG.THRESHOLD) {
      return path.join(specsDir, mostRecent);
    }

    console.log('\n   Conversation topic may not align with most recent spec folder');
    console.log(`   Most recent: ${mostRecent} (${alignmentScore}% match)\n`);

    const alternatives = specFolders.slice(0, Math.min(5, specFolders.length)).map((folder) => ({
      folder,
      score: calculateAlignmentScore(conversationTopics, folder)
    }));

    alternatives.sort((a, b) => b.score - a.score);

    console.log('   Alternative spec folders:');
    alternatives.forEach((alt, index) => {
      console.log(`   ${index + 1}. ${alt.folder} (${alt.score}% match)`);
    });
    console.log(`   ${alternatives.length + 1}. Specify custom folder path\n`);

    const choice = await promptUserChoice(
      `   Select target folder (1-${alternatives.length + 1}): `,
      alternatives.length + 1
    );

    if (choice <= alternatives.length) {
      return path.join(specsDir, alternatives[choice - 1].folder);
    } else {
      const customPath = await promptUser('   Enter spec folder name: ');
      return path.join(specsDir, customPath);
    }

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.includes('retry attempts') ||
        errMsg.includes('Spec folder not found') ||
        errMsg.includes('No spec folders found') ||
        errMsg.includes('No specs/ directory found')) {
      throw error;
    }
    printNoSpecFolderError('save-context');
    throw new Error('specs/ directory not found');
  }
}

/* -----------------------------------------------------------------
   4. EXPORTS
------------------------------------------------------------------*/

export {
  ALIGNMENT_CONFIG,
  detectSpecFolder,
  filterArchiveFolders,
  // Backwards compatibility aliases
  detectSpecFolder as detect_spec_folder,
  filterArchiveFolders as filter_archive_folders,
};
