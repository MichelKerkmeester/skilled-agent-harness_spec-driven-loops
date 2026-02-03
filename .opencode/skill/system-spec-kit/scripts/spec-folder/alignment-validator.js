// ───────────────────────────────────────────────────────────────
// SPEC-FOLDER: ALIGNMENT VALIDATOR
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────────
   1. IMPORTS
────────────────────────────────────────────────────────────────────*/

const fs = require('fs/promises');
const path = require('path');
const { promptUserChoice } = require('../utils/prompt-utils');

/* ─────────────────────────────────────────────────────────────────
   2. CONFIGURATION
────────────────────────────────────────────────────────────────────*/

const ALIGNMENT_CONFIG = {
  THRESHOLD: 70,
  WARNING_THRESHOLD: 50,
  ARCHIVE_PATTERNS: ['z_', 'archive', 'old', '.archived'],
  STOPWORDS: ['the', 'this', 'that', 'with', 'for', 'and', 'from', 'fix', 'update', 'add', 'remove'],

  // Infrastructure detection: maps .opencode/ subpaths to folder name patterns
  INFRASTRUCTURE_PATTERNS: {
    'skill/system-spec-kit': ['memory', 'spec-kit', 'speckit', 'spec', 'opencode'],
    'skill/': ['skill', 'opencode'],
    'command/memory': ['memory', 'spec-kit', 'speckit', 'opencode'],
    'command/': ['command', 'opencode'],
    'agent/': ['agent', 'opencode'],
    'scripts/': ['script', 'opencode']
  },

  // Bonus points for infrastructure folder matches
  INFRASTRUCTURE_BONUS: 40,

  // Threshold for considering work as infrastructure (% of files in .opencode/)
  INFRASTRUCTURE_THRESHOLD: 0.5
};

/* ─────────────────────────────────────────────────────────────────
   3. TOPIC EXTRACTION
────────────────────────────────────────────────────────────────────*/

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
   3.5 WORK DOMAIN DETECTION
────────────────────────────────────────────────────────────────────*/

/**
 * Detects if work is on shared infrastructure (.opencode/) vs project-specific code.
 * This is the key signal that was previously being ignored, causing memories to be
 * saved to incorrect spec folders.
 *
 * @param {Object} collectedData - The collected session data
 * @returns {{ domain: 'opencode'|'project', subpath: string|null, confidence: number, patterns: string[] }}
 */
function detect_work_domain(collectedData) {
  const files = [];

  // Extract all file paths from observations
  if (collectedData?.observations) {
    for (const obs of collectedData.observations) {
      if (obs.files) {
        files.push(...obs.files);
      }
    }
  }

  // Also check recent_context for file references
  if (collectedData?.recent_context) {
    for (const ctx of collectedData.recent_context) {
      if (ctx.files) {
        files.push(...ctx.files);
      }
    }
  }

  if (files.length === 0) {
    return { domain: 'project', subpath: null, confidence: 0, patterns: [] };
  }

  // Normalize paths and count .opencode/ files
  const normalizedFiles = files.map(f => f.replace(/\\/g, '/'));
  const opencodeFiles = normalizedFiles.filter(f =>
    f.includes('.opencode/') || f.includes('/.opencode/')
  );

  const opencodeRatio = opencodeFiles.length / normalizedFiles.length;

  if (opencodeRatio < ALIGNMENT_CONFIG.INFRASTRUCTURE_THRESHOLD) {
    return { domain: 'project', subpath: null, confidence: 1 - opencodeRatio, patterns: [] };
  }

  // Detect the most specific subpath
  let detectedSubpath = null;
  let matchedPatterns = [];

  for (const [subpath, patterns] of Object.entries(ALIGNMENT_CONFIG.INFRASTRUCTURE_PATTERNS)) {
    const matchingFiles = opencodeFiles.filter(f => f.includes(`.opencode/${subpath}`));
    if (matchingFiles.length > 0) {
      // Prefer more specific paths (longer subpath = more specific)
      if (!detectedSubpath || subpath.length > detectedSubpath.length) {
        detectedSubpath = subpath;
        matchedPatterns = patterns;
      }
    }
  }

  return {
    domain: 'opencode',
    subpath: detectedSubpath,
    confidence: opencodeRatio,
    patterns: matchedPatterns
  };
}

/**
 * Calculates infrastructure-aware alignment score.
 * When infrastructure work is detected, folders matching infrastructure patterns
 * receive a bonus to their alignment score.
 *
 * @param {string[]} conversationTopics - Topics extracted from conversation
 * @param {string} specFolderName - Name of the spec folder to score
 * @param {Object|null} workDomain - Result from detect_work_domain()
 * @returns {number} Alignment score (0-100+, can exceed 100 with infrastructure bonus)
 */
function calculate_alignment_score_with_domain(conversationTopics, specFolderName, workDomain = null) {
  // Base score from topic matching
  const baseScore = calculate_alignment_score(conversationTopics, specFolderName);

  // If no work domain info or project domain, return base score
  if (!workDomain || workDomain.domain !== 'opencode') {
    return baseScore;
  }

  // Check if folder name matches infrastructure patterns
  const folderLower = specFolderName.toLowerCase();
  const patterns = workDomain.patterns || [];

  let infrastructureBonus = 0;
  for (const pattern of patterns) {
    if (folderLower.includes(pattern)) {
      infrastructureBonus = ALIGNMENT_CONFIG.INFRASTRUCTURE_BONUS;
      break;
    }
  }

  return baseScore + infrastructureBonus;
}

/* ─────────────────────────────────────────────────────────────────
   4. SCORE CALCULATION
────────────────────────────────────────────────────────────────────*/

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
────────────────────────────────────────────────────────────────────*/

async function validate_content_alignment(collectedData, specFolderName, specsDir) {
  const conversationTopics = extract_conversation_topics(collectedData);
  const observationKeywords = extract_observation_keywords(collectedData);
  const combinedTopics = [...new Set([...conversationTopics, ...observationKeywords])];

  // Detect work domain from file paths (key fix for infrastructure work)
  const workDomain = detect_work_domain(collectedData);

  // Calculate scores with and without infrastructure awareness
  const baseScore = calculate_alignment_score(combinedTopics, specFolderName);
  const domainAwareScore = calculate_alignment_score_with_domain(combinedTopics, specFolderName, workDomain);
  const finalScore = Math.max(baseScore, domainAwareScore);

  console.log(`   📊 Phase 1B Alignment: ${specFolderName} (${baseScore}% match)`);

  // Check if infrastructure work but no infrastructure bonus applied
  const isInfrastructureMismatch = workDomain.domain === 'opencode' && domainAwareScore === baseScore;

  // Early warning for infrastructure mismatch
  if (isInfrastructureMismatch) {
    console.log(`   ⚠️  INFRASTRUCTURE MISMATCH: Work is on .opencode/${workDomain.subpath || ''}`);
    console.log(`      But target folder "${specFolderName}" doesn't match infrastructure patterns`);
    console.log(`      Suggested patterns: ${workDomain.patterns.join(', ')}`);
  }

  if (finalScore >= ALIGNMENT_CONFIG.THRESHOLD && !isInfrastructureMismatch) {
    console.log(`   ✓ Content aligns with target folder`);
    return { proceed: true, useAlternative: false };
  }

  if (finalScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD && !isInfrastructureMismatch) {
    console.log(`   ⚠️  Moderate alignment (${finalScore}%) - proceeding with caution`);
    return { proceed: true, useAlternative: false };
  }

  if (isInfrastructureMismatch) {
    console.log(`\n   ⚠️  INFRASTRUCTURE ALIGNMENT WARNING`);
    console.log(`   Work domain: .opencode/${workDomain.subpath || '*'} (${Math.round(workDomain.confidence * 100)}% of files)`);
  } else {
    console.log(`\n   ⚠️  ALIGNMENT WARNING: Content may not match target folder`);
  }
  console.log(`   Conversation topics: ${combinedTopics.slice(0, 5).join(', ')}`);
  console.log(`   Target folder: ${specFolderName} (${baseScore}% match)\n`);

  try {
    const entries = await fs.readdir(specsDir);
    const specFolders = entries
      .filter(name => /^\d{3}-/.test(name))
      .filter(name => !name.match(/^(z_|.*archive.*|.*old.*|.*\.archived.*)/i))
      .sort()
      .reverse();

    // Use domain-aware scoring for alternatives
    const alternatives = specFolders
      .map(folder => ({
        folder,
        score: calculate_alignment_score_with_domain(combinedTopics, folder, workDomain)
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

  // Detect work domain from file paths
  const workDomain = detect_work_domain(collectedData);

  // Calculate scores with domain awareness
  const baseScore = calculate_alignment_score(conversationTopics, specFolderName);
  const domainAwareScore = calculate_alignment_score_with_domain(conversationTopics, specFolderName, workDomain);
  const alignmentScore = Math.max(baseScore, domainAwareScore);

  console.log(`   📊 Alignment check: ${specFolderName} (${baseScore}% match)`);

  // Check for infrastructure mismatch
  const isInfrastructureMismatch = workDomain.domain === 'opencode' && domainAwareScore === baseScore;

  if (isInfrastructureMismatch) {
    console.log(`   ⚠️  Infrastructure work detected: .opencode/${workDomain.subpath || '*'}`);
  }

  if (alignmentScore >= ALIGNMENT_CONFIG.THRESHOLD && !isInfrastructureMismatch) {
    console.log(`   ✓ Good alignment with selected folder`);
    return { proceed: true, useAlternative: false };
  }

  if (alignmentScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD && !isInfrastructureMismatch) {
    console.log(`   ⚠️  Moderate alignment - proceeding with caution`);
    return { proceed: true, useAlternative: false };
  }

  if (isInfrastructureMismatch) {
    console.log(`\n   ⚠️  INFRASTRUCTURE MISMATCH (${Math.round(workDomain.confidence * 100)}% of files in .opencode/)`);
    console.log(`   Suggested folder patterns: ${workDomain.patterns.join(', ')}`);
  } else {
    console.log(`\n   ⚠️  LOW ALIGNMENT WARNING (${baseScore}% match)`);
  }
  console.log(`   The selected folder "${specFolderName}" may not match conversation content.\n`);

  try {
    const entries = await fs.readdir(specsDir);
    const specFolders = entries
      .filter(name => /^\d{3}-/.test(name))
      .filter(name => !name.match(/^(z_|.*archive.*|.*old.*|.*\.archived.*)/i))
      .sort()
      .reverse();

    // Use domain-aware scoring for alternatives
    const alternatives = specFolders
      .map(folder => ({
        folder,
        score: calculate_alignment_score_with_domain(conversationTopics, folder, workDomain)
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
────────────────────────────────────────────────────────────────────*/

module.exports = {
  ALIGNMENT_CONFIG,
  // Primary exports (snake_case)
  extract_conversation_topics,
  extract_observation_keywords,
  detect_work_domain,
  parse_spec_folder_topic,
  calculate_alignment_score,
  calculate_alignment_score_with_domain,
  validate_content_alignment,
  validate_folder_alignment,
  // Backwards compatibility aliases (camelCase)
  extractConversationTopics: extract_conversation_topics,
  extractObservationKeywords: extract_observation_keywords,
  detectWorkDomain: detect_work_domain,
  parseSpecFolderTopic: parse_spec_folder_topic,
  calculateAlignmentScore: calculate_alignment_score,
  calculateAlignmentScoreWithDomain: calculate_alignment_score_with_domain,
  validateContentAlignment: validate_content_alignment,
  validateFolderAlignment: validate_folder_alignment
};
