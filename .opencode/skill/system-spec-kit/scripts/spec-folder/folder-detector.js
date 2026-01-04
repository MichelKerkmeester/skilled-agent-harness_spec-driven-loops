/* ─────────────────────────────────────────────────────────────────
   SPEC-FOLDER: FOLDER DETECTOR
──────────────────────────────────────────────────────────────────── */
'use strict';

/* ─────────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────────── */

const fs = require('fs/promises');
const path = require('path');
const { promptUser, promptUserChoice } = require('../utils/prompt-utils');
const { CONFIG, findActiveSpecsDir, getAllExistingSpecsDirs } = require('../core');
const {
  ALIGNMENT_CONFIG,
  extractConversationTopics,
  calculateAlignmentScore,
  validateContentAlignment,
  validateFolderAlignment
} = require('./alignment-validator');

/* ─────────────────────────────────────────────────────────────────
   2. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────────── */

function filterArchiveFolders(folders) {
  return folders.filter(folder => {
    const lowerFolder = folder.toLowerCase();
    return !ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.some(pattern =>
      lowerFolder.includes(pattern)
    );
  });
}

/* ─────────────────────────────────────────────────────────────────
   3. FOLDER DETECTION
──────────────────────────────────────────────────────────────────── */

async function detectSpecFolder(collectedData = null) {
  const cwd = process.cwd();
  
  // Check for dual specs directory locations
  const existingSpecsDirs = getAllExistingSpecsDirs();
  if (existingSpecsDirs.length > 1) {
    console.warn('⚠️  Multiple specs directories found. Using: ' + existingSpecsDirs[0]);
    console.warn('   Other locations ignored: ' + existingSpecsDirs.slice(1).join(', '));
  }

  const specsDir = findActiveSpecsDir();
  const defaultSpecsDir = path.join(CONFIG.PROJECT_ROOT, 'specs');

  // Priority 1: CLI argument
  if (CONFIG.SPEC_FOLDER_ARG) {
    const specArg = CONFIG.SPEC_FOLDER_ARG;
    const specFolderPath = specArg.startsWith('specs/')
      ? path.join(CONFIG.PROJECT_ROOT, specArg)
      : specArg.startsWith('.opencode/specs/')
        ? path.join(CONFIG.PROJECT_ROOT, specArg)
        : path.join(specsDir || defaultSpecsDir, specArg);

    try {
      await fs.access(specFolderPath);
      console.log(`   Using spec folder from CLI argument: ${path.basename(specFolderPath)}`);
      
      if (collectedData) {
        const folderName = path.basename(specFolderPath);
        const alignmentResult = await validateContentAlignment(collectedData, folderName, specsDir || defaultSpecsDir);
        
        if (alignmentResult.useAlternative && alignmentResult.selectedFolder) {
          return path.join(specsDir || defaultSpecsDir, alignmentResult.selectedFolder);
        }
      }
      
      return specFolderPath;
    } catch {
      console.error(`\n Specified spec folder not found: ${CONFIG.SPEC_FOLDER_ARG}\n`);
      console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');
      
      try {
        const searchDir = specsDir || defaultSpecsDir;
        const entries = await fs.readdir(searchDir);
        const available = entries
          .filter(name => /^\d{3}-/.test(name))
          .filter(name => !name.match(/^(z_|.*archive.*|.*old.*|.*\.archived.*)/i))
          .sort()
          .reverse();

        if (available.length > 0) {
          console.error('Available spec folders:');
          available.slice(0, 10).forEach(folder => {
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
  if (collectedData && collectedData.SPEC_FOLDER) {
    const specFolderFromData = collectedData.SPEC_FOLDER;
    const activeDir = specsDir || defaultSpecsDir;
    const specFolderPath = path.join(activeDir, specFolderFromData);

    try {
      await fs.access(specFolderPath);
      console.log(`   Using spec folder from data: ${specFolderFromData}`);
      const alignmentResult = await validateFolderAlignment(collectedData, specFolderFromData, activeDir);
      if (alignmentResult.proceed) {
        return alignmentResult.useAlternative ? path.join(activeDir, alignmentResult.selectedFolder) : specFolderPath;
      }
    } catch {
      console.warn(`   Spec folder from data not found: ${specFolderFromData}`);
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
    console.error('\n Cannot save context: No spec folder found\n');
    console.error('memory requires a spec folder to save memory documentation.');
    console.error('Every conversation with file changes must have a spec folder per conversation-documentation rules.\n');
    console.error('Please create a spec folder first:');
    console.error('  mkdir -p specs/###-feature-name/');
    console.error('  OR: mkdir -p .opencode/specs/###-feature-name/\n');
    console.error('Then re-run memory.\n');
    throw new Error('No specs/ directory found');
  }

  try {
    const entries = await fs.readdir(specsDir);
    let specFolders = entries
      .filter(name => /^\d{3}-/.test(name))
      .sort()
      .reverse();

    specFolders = filterArchiveFolders(specFolders);

    if (specFolders.length === 0) {
      console.error('\n Cannot save context: No spec folder found\n');
      console.error('memory requires a spec folder to save memory documentation.');
      console.error('Every conversation with file changes must have a spec folder per conversation-documentation rules.\n');
      console.error('Please create a spec folder first:');
      console.error('  mkdir -p specs/###-feature-name/');
      console.error('  OR: mkdir -p .opencode/specs/###-feature-name/\n');
      console.error('Then re-run memory.\n');
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

    console.log(`\n   Conversation topic may not align with most recent spec folder`);
    console.log(`   Most recent: ${mostRecent} (${alignmentScore}% match)\n`);

    const alternatives = specFolders.slice(0, Math.min(5, specFolders.length)).map(folder => ({
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

  } catch (error) {
    if (error.message.includes('retry attempts') || 
        error.message.includes('Spec folder not found') ||
        error.message.includes('No spec folders found') ||
        error.message.includes('No specs/ directory found')) {
      throw error;
    }
    console.error('\n Cannot save context: No spec folder found\n');
    console.error('save-context requires a spec folder to save memory documentation.');
    console.error('Every conversation with file changes must have a spec folder per conversation-documentation rules.\n');
    console.error('Please create a spec folder first:');
    console.error('  mkdir -p specs/###-feature-name/');
    console.error('  OR: mkdir -p .opencode/specs/###-feature-name/\n');
    console.error('Then re-run save-context.\n');
    throw new Error('specs/ directory not found');
  }
}

/* ─────────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────────── */

module.exports = {
  detectSpecFolder,
  filterArchiveFolders,
  ALIGNMENT_CONFIG
};
