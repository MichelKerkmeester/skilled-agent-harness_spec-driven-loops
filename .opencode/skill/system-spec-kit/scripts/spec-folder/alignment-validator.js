// ───────────────────────────────────────────────────────────────
// SPEC-FOLDER: ALIGNMENT VALIDATOR
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────────── */

const fs = require('fs/promises');
const path = require('path');
const { promptUserChoice } = require('../utils/prompt-utils');

/* ─────────────────────────────────────────────────────────────────
   2. CONFIGURATION
──────────────────────────────────────────────────────────────────── */

const ALIGNMENT_CONFIG = {
  THRESHOLD: 70,
  WARNING_THRESHOLD: 50,
  ARCHIVE_PATTERNS: ['z_', 'archive', 'old', '.archived'],
  STOPWORDS: ['the', 'this', 'that', 'with', 'for', 'and', 'from', 'fix', 'update', 'add', 'remove']
};

/* ─────────────────────────────────────────────────────────────────
   3. TOPIC EXTRACTION
──────────────────────────────────────────────────────────────────── */

function extract_conversation_topics(collectedData) {
  const topics = new Set();

  if (collectedData?.recent_context?.[0]?.request) {
    const request = collectedData.recent_context[0].request.toLowerCase();
    const words = request.match(/\b[a-z]{3,}\b/gi) || [];
    words.forEach(w => topics.add(w.toLowerCase()));
  }

  if (collectedData?.observations) {
    for (const obs of collectedData.observations.slice(0, 3)) {
      if (obs.title) {
        const words = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
        words.forEach(w => topics.add(w.toLowerCase()));
      }
    }
  }

  return Array.from(topics).filter(t =>
    !ALIGNMENT_CONFIG.STOPWORDS.includes(t) && t.length >= 3
  );
}

function extract_observation_keywords(collectedData) {
  const keywords = new Set();

  if (!collectedData?.observations) return [];

  for (const obs of collectedData.observations.slice(0, 10)) {
    if (obs.title) {
      const titleWords = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
      titleWords.forEach(w => keywords.add(w.toLowerCase()));
    }

    if (obs.narrative) {
      const narrativeSnippet = obs.narrative.substring(0, 200);
      const narrativeWords = narrativeSnippet.match(/\b[a-z]{3,}\b/gi) || [];
      narrativeWords.forEach(w => keywords.add(w.toLowerCase()));
    }

    if (obs.files) {
      for (const file of obs.files) {
        const filename = path.basename(file).replace(/\.[^.]+$/, '');
        const fileWords = filename.split(/[-_.]/).filter(w => w.length >= 3);
        fileWords.forEach(w => keywords.add(w.toLowerCase()));
      }
    }
  }

  return Array.from(keywords).filter(k =>
    !ALIGNMENT_CONFIG.STOPWORDS.includes(k) && k.length >= 3
  );
}

/* ─────────────────────────────────────────────────────────────────
   4. SCORE CALCULATION
──────────────────────────────────────────────────────────────────── */

function parse_spec_folder_topic(folderName) {
  const topic = folderName.replace(/^\d+-/, '');
  return topic.split(/[-_]/).filter(w => w.length > 0);
}

function calculate_alignment_score(conversationTopics, specFolderName) {
  const specTopics = parse_spec_folder_topic(specFolderName);

  if (specTopics.length === 0) return 0;

  let matches = 0;
  for (const specTopic of specTopics) {
    if (conversationTopics.some(ct =>
      ct.includes(specTopic) || specTopic.includes(ct)
    )) {
      matches++;
    }
  }

  return Math.round((matches / specTopics.length) * 100);
}

/* ─────────────────────────────────────────────────────────────────
   5. VALIDATION FUNCTIONS
──────────────────────────────────────────────────────────────────── */

async function validate_content_alignment(collectedData, specFolderName, specsDir) {
  const conversationTopics = extract_conversation_topics(collectedData);
  const alignmentScore = calculate_alignment_score(conversationTopics, specFolderName);

  const observationKeywords = extract_observation_keywords(collectedData);
  const combinedTopics = [...new Set([...conversationTopics, ...observationKeywords])];
  const enrichedScore = calculate_alignment_score(combinedTopics, specFolderName);

  const finalScore = Math.max(alignmentScore, enrichedScore);

  console.log(`   📊 Phase 1B Alignment: ${specFolderName} (${finalScore}% match)`);

  if (finalScore >= ALIGNMENT_CONFIG.THRESHOLD) {
    console.log(`   ✓ Content aligns with target folder`);
    return { proceed: true, useAlternative: false };
  }

  if (finalScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD) {
    console.log(`   ⚠️  Moderate alignment (${finalScore}%) - proceeding with caution`);
    return { proceed: true, useAlternative: false };
  }

  console.log(`\n   ⚠️  ALIGNMENT WARNING: Content may not match target folder`);
  console.log(`   Conversation topics: ${combinedTopics.slice(0, 5).join(', ')}`);
  console.log(`   Target folder: ${specFolderName} (${finalScore}% match)\n`);

  try {
    const entries = await fs.readdir(specsDir);
    const specFolders = entries
      .filter(name => /^\d{3}-/.test(name))
      .filter(name => !name.match(/^(z_|.*archive.*|.*old.*|.*\.archived.*)/i))
      .sort()
      .reverse();

    const alternatives = specFolders
      .map(folder => ({
        folder,
        score: calculate_alignment_score(combinedTopics, folder)
      }))
      .filter(alt => alt.folder !== specFolderName && alt.score > finalScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (alternatives.length > 0) {
      console.log('   Better matching folders found:');
      alternatives.forEach((alt, i) => {
        console.log(`   ${i + 1}. ${alt.folder} (${alt.score}% match)`);
      });
      console.log(`   ${alternatives.length + 1}. Continue with "${specFolderName}" anyway\n`);

      if (!process.stdout.isTTY || !process.stdin.isTTY) {
        console.log(`   ⚠️  Non-interactive mode - proceeding with specified folder`);
        return { proceed: true, useAlternative: false };
      }

      try {
        const choice = await promptUserChoice(
          `   Select option (1-${alternatives.length + 1}): `,
          alternatives.length + 1
        );

        if (choice <= alternatives.length) {
          console.log(`   ✓ Switching to: ${alternatives[choice - 1].folder}`);
          return { proceed: true, useAlternative: true, selectedFolder: alternatives[choice - 1].folder };
        }

        console.log(`   ✓ Continuing with "${specFolderName}" as requested`);
        return { proceed: true, useAlternative: false };
      } catch (promptError) {
        console.log(`   ⚠️  Proceeding with "${specFolderName}"`);
        return { proceed: true, useAlternative: false };
      }
    }
  } catch {
    // Could not read alternatives - proceed with warning
  }

  console.log(`   ⚠️  No better alternatives found - proceeding with "${specFolderName}"`);
  return { proceed: true, useAlternative: false };
}

async function validate_folder_alignment(collectedData, specFolderName, specsDir) {
  const conversationTopics = extract_conversation_topics(collectedData);
  const alignmentScore = calculate_alignment_score(conversationTopics, specFolderName);

  console.log(`   📊 Alignment check: ${specFolderName} (${alignmentScore}% match)`);

  if (alignmentScore >= ALIGNMENT_CONFIG.THRESHOLD) {
    console.log(`   ✓ Good alignment with selected folder`);
    return { proceed: true, useAlternative: false };
  }

  if (alignmentScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD) {
    console.log(`   ⚠️  Moderate alignment - proceeding with caution`);
    return { proceed: true, useAlternative: false };
  }

  console.log(`\n   ⚠️  LOW ALIGNMENT WARNING (${alignmentScore}% match)`);
  console.log(`   The selected folder "${specFolderName}" may not match conversation content.\n`);

  try {
    const entries = await fs.readdir(specsDir);
    const specFolders = entries
      .filter(name => /^\d{3}-/.test(name))
      .filter(name => !name.match(/^(z_|.*archive.*|.*old.*|.*\.archived.*)/i))
      .sort()
      .reverse();

    const alternatives = specFolders
      .map(folder => ({
        folder,
        score: calculate_alignment_score(conversationTopics, folder)
      }))
      .filter(alt => alt.folder !== specFolderName)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (alternatives.length > 0 && alternatives[0].score > alignmentScore) {
      console.log('   Better matching alternatives:');
      alternatives.forEach((alt, i) => {
        console.log(`   ${i + 1}. ${alt.folder} (${alt.score}% match)`);
      });
      console.log(`   ${alternatives.length + 1}. Continue with "${specFolderName}" anyway`);
      console.log(`   ${alternatives.length + 2}. Abort and specify different folder\n`);

      if (!process.stdout.isTTY || !process.stdin.isTTY) {
        console.log(`   ⚠️  Non-interactive mode - proceeding with specified folder`);
        return { proceed: true, useAlternative: false };
      }

      const choice = await promptUserChoice(
        `   Select option (1-${alternatives.length + 2}): `,
        alternatives.length + 2
      );

      if (choice <= alternatives.length) {
        return { proceed: true, useAlternative: true, selectedFolder: alternatives[choice - 1].folder };
      } else if (choice === alternatives.length + 1) {
        console.log(`   ✓ Proceeding with "${specFolderName}" as requested`);
        return { proceed: true, useAlternative: false };
      } else {
        console.log(`   ❌ Aborted. Please re-run with correct folder.`);
        return { proceed: false, useAlternative: false };
      }
    }
  } catch {
    // If we can't find alternatives, just proceed with warning
  }

  console.log(`   ⚠️  Proceeding with "${specFolderName}" (no better alternatives found)`);
  return { proceed: true, useAlternative: false };
}

/* ─────────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────────── */

module.exports = {
  ALIGNMENT_CONFIG,
  // Primary exports (snake_case)
  extract_conversation_topics,
  extract_observation_keywords,
  parse_spec_folder_topic,
  calculate_alignment_score,
  validate_content_alignment,
  validate_folder_alignment,
  // Backwards compatibility aliases (camelCase)
  extractConversationTopics: extract_conversation_topics,
  extractObservationKeywords: extract_observation_keywords,
  parseSpecFolderTopic: parse_spec_folder_topic,
  calculateAlignmentScore: calculate_alignment_score,
  validateContentAlignment: validate_content_alignment,
  validateFolderAlignment: validate_folder_alignment
};
