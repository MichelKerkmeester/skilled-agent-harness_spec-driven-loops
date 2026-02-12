// ---------------------------------------------------------------
// MODULE: Alignment Validator
// Validates conversation-to-spec-folder alignment using topic and keyword matching
// ---------------------------------------------------------------

// Node stdlib
import * as fs from 'fs/promises';
import * as path from 'path';

// Internal modules
import { promptUserChoice } from '../utils/prompt-utils';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

export interface AlignmentConfig {
  THRESHOLD: number;
  WARNING_THRESHOLD: number;
  ARCHIVE_PATTERNS: string[];
  STOPWORDS: string[];
  INFRASTRUCTURE_PATTERNS: Record<string, string[]>;
  INFRASTRUCTURE_BONUS: number;
  INFRASTRUCTURE_THRESHOLD: number;
}

export interface AlignmentResult {
  proceed: boolean;
  useAlternative: boolean;
  selectedFolder?: string;
}

export interface WorkDomainResult {
  domain: 'opencode' | 'project';
  subpath: string | null;
  confidence: number;
  patterns: string[];
}

export interface CollectedDataForAlignment {
  recentContext?: Array<{ request?: string; files?: string[] }>;
  observations?: Array<{
    title?: string;
    narrative?: string;
    files?: string[];
    type?: string;
  }>;
  [key: string]: unknown;
}

/* -----------------------------------------------------------------
   2. CONFIGURATION
------------------------------------------------------------------*/

const ALIGNMENT_CONFIG: AlignmentConfig = {
  THRESHOLD: 70,
  WARNING_THRESHOLD: 50,
  ARCHIVE_PATTERNS: ['z_', 'archive', 'old', '.archived'],
  STOPWORDS: ['the', 'this', 'that', 'with', 'for', 'and', 'from', 'fix', 'update', 'add', 'remove'],

  INFRASTRUCTURE_PATTERNS: {
    'skill/system-spec-kit': ['memory', 'spec-kit', 'speckit', 'spec', 'opencode'],
    'skill/': ['skill', 'opencode'],
    'command/memory': ['memory', 'spec-kit', 'speckit', 'opencode'],
    'command/': ['command', 'opencode'],
    'agent/': ['agent', 'opencode'],
    'scripts/': ['script', 'opencode']
  },

  INFRASTRUCTURE_BONUS: 40,
  INFRASTRUCTURE_THRESHOLD: 0.5
};

/* -----------------------------------------------------------------
   2.5 ARCHIVE FILTERING
------------------------------------------------------------------*/

/** Check whether a folder name matches any archive pattern from config. */
function isArchiveFolder(name: string): boolean {
  const lowerName = name.toLowerCase();
  return ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.some((pattern) => lowerName.includes(pattern));
}

/* -----------------------------------------------------------------
   3. TOPIC EXTRACTION
------------------------------------------------------------------*/

function extractConversationTopics(collectedData: CollectedDataForAlignment | null): string[] {
  const topics = new Set<string>();

  if (collectedData?.recentContext?.[0]?.request) {
    const request = collectedData.recentContext[0].request.toLowerCase();
    const words = request.match(/\b[a-z]{3,}\b/gi) || [];
    words.forEach((w) => topics.add(w.toLowerCase()));
  }

  if (collectedData?.observations) {
    for (const obs of collectedData.observations.slice(0, 3)) {
      if (obs.title) {
        const words = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
        words.forEach((w) => topics.add(w.toLowerCase()));
      }
    }
  }

  return Array.from(topics).filter((t) =>
    !ALIGNMENT_CONFIG.STOPWORDS.includes(t) && t.length >= 3
  );
}

function extractObservationKeywords(collectedData: CollectedDataForAlignment | null): string[] {
  const keywords = new Set<string>();

  if (!collectedData?.observations) return [];

  for (const obs of collectedData.observations.slice(0, 10)) {
    if (obs.title) {
      const titleWords = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
      titleWords.forEach((w) => keywords.add(w.toLowerCase()));
    }

    if (obs.narrative) {
      const narrativeSnippet = obs.narrative.substring(0, 200);
      const narrativeWords = narrativeSnippet.match(/\b[a-z]{3,}\b/gi) || [];
      narrativeWords.forEach((w) => keywords.add(w.toLowerCase()));
    }

    if (obs.files) {
      for (const file of obs.files) {
        const filename = path.basename(file).replace(/\.[^.]+$/, '');
        const fileWords = filename.split(/[-_.]/).filter((w) => w.length >= 3);
        fileWords.forEach((w) => keywords.add(w.toLowerCase()));
      }
    }
  }

  return Array.from(keywords).filter((k) =>
    !ALIGNMENT_CONFIG.STOPWORDS.includes(k) && k.length >= 3
  );
}

/* -----------------------------------------------------------------
   3.5 WORK DOMAIN DETECTION
------------------------------------------------------------------*/

function detectWorkDomain(collectedData: CollectedDataForAlignment | null): WorkDomainResult {
  const files: string[] = [];

  if (collectedData?.observations) {
    for (const obs of collectedData.observations) {
      if (obs.files) {
        files.push(...obs.files);
      }
    }
  }

  if (collectedData?.recentContext) {
    for (const ctx of collectedData.recentContext) {
      if (ctx.files) {
        files.push(...ctx.files);
      }
    }
  }

  if (files.length === 0) {
    return { domain: 'project', subpath: null, confidence: 0, patterns: [] };
  }

  const normalizedFiles = files.map((f) => f.replace(/\\/g, '/'));
  const opencodeFiles = normalizedFiles.filter((f) =>
    f.includes('.opencode/') || f.includes('/.opencode/')
  );

  const opencodeRatio = opencodeFiles.length / normalizedFiles.length;

  if (opencodeRatio < ALIGNMENT_CONFIG.INFRASTRUCTURE_THRESHOLD) {
    return { domain: 'project', subpath: null, confidence: 1 - opencodeRatio, patterns: [] };
  }

  let detectedSubpath: string | null = null;
  let matchedPatterns: string[] = [];

  for (const [subpath, patterns] of Object.entries(ALIGNMENT_CONFIG.INFRASTRUCTURE_PATTERNS)) {
    const matchingFiles = opencodeFiles.filter((f) => f.includes(`.opencode/${subpath}`));
    if (matchingFiles.length > 0) {
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

function calculateAlignmentScoreWithDomain(
  conversationTopics: string[],
  specFolderName: string,
  workDomain: WorkDomainResult | null = null
): number {
  const baseScore = calculateAlignmentScore(conversationTopics, specFolderName);

  if (!workDomain || workDomain.domain !== 'opencode') {
    return baseScore;
  }

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

/* -----------------------------------------------------------------
   4. SCORE CALCULATION
------------------------------------------------------------------*/

function parseSpecFolderTopic(folderName: string): string[] {
  const topic = folderName.replace(/^\d+-/, '');
  return topic.split(/[-_]/).filter((w) => w.length > 0);
}

function calculateAlignmentScore(conversationTopics: string[], specFolderName: string): number {
  const specTopics = parseSpecFolderTopic(specFolderName);

  if (specTopics.length === 0) return 0;

  let matches = 0;
  for (const specTopic of specTopics) {
    if (conversationTopics.some((ct) =>
      ct.includes(specTopic) || specTopic.includes(ct)
    )) {
      matches++;
    }
  }

  return Math.round((matches / specTopics.length) * 100);
}

/* -----------------------------------------------------------------
   5. VALIDATION FUNCTIONS
------------------------------------------------------------------*/

async function validateContentAlignment(
  collectedData: CollectedDataForAlignment,
  specFolderName: string,
  specsDir: string
): Promise<AlignmentResult> {
  const conversationTopics = extractConversationTopics(collectedData);
  const observationKeywords = extractObservationKeywords(collectedData);
  const combinedTopics = [...new Set([...conversationTopics, ...observationKeywords])];

  const workDomain = detectWorkDomain(collectedData);

  const baseScore = calculateAlignmentScore(combinedTopics, specFolderName);
  const domainAwareScore = calculateAlignmentScoreWithDomain(combinedTopics, specFolderName, workDomain);
  const finalScore = Math.max(baseScore, domainAwareScore);

  console.log(`   Phase 1B Alignment: ${specFolderName} (${baseScore}% match)`);

  const isInfrastructureMismatch = workDomain.domain === 'opencode' && domainAwareScore === baseScore;

  if (isInfrastructureMismatch) {
    console.log(`   Warning: INFRASTRUCTURE MISMATCH: Work is on .opencode/${workDomain.subpath || ''}`);
    console.log(`      But target folder "${specFolderName}" doesn't match infrastructure patterns`);
    console.log(`      Suggested patterns: ${workDomain.patterns.join(', ')}`);
  }

  if (finalScore >= ALIGNMENT_CONFIG.THRESHOLD && !isInfrastructureMismatch) {
    console.log('   Content aligns with target folder');
    return { proceed: true, useAlternative: false };
  }

  if (finalScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD && !isInfrastructureMismatch) {
    console.log(`   Warning: Moderate alignment (${finalScore}%) - proceeding with caution`);
    return { proceed: true, useAlternative: false };
  }

  if (isInfrastructureMismatch) {
    console.log('\n   Warning: INFRASTRUCTURE ALIGNMENT WARNING');
    console.log(`   Work domain: .opencode/${workDomain.subpath || '*'} (${Math.round(workDomain.confidence * 100)}% of files)`);
  } else {
    console.log('\n   Warning: ALIGNMENT WARNING: Content may not match target folder');
  }
  console.log(`   Conversation topics: ${combinedTopics.slice(0, 5).join(', ')}`);
  console.log(`   Target folder: ${specFolderName} (${baseScore}% match)\n`);

  try {
    const entries = await fs.readdir(specsDir);
    const specFolders = entries
      .filter((name) => /^\d{3}-/.test(name))
      .filter((name) => !isArchiveFolder(name))
      .sort()
      .reverse();

    const alternatives = specFolders
      .map((folder) => ({
        folder,
        score: calculateAlignmentScoreWithDomain(combinedTopics, folder, workDomain)
      }))
      .filter((alt) => alt.folder !== specFolderName && alt.score > finalScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (alternatives.length > 0) {
      console.log('   Better matching folders found:');
      alternatives.forEach((alt, i) => {
        console.log(`   ${i + 1}. ${alt.folder} (${alt.score}% match)`);
      });
      console.log(`   ${alternatives.length + 1}. Continue with "${specFolderName}" anyway\n`);

      if (!process.stdout.isTTY || !process.stdin.isTTY) {
        console.log('   Warning: Non-interactive mode - proceeding with specified folder');
        return { proceed: true, useAlternative: false };
      }

      try {
        const choice = await promptUserChoice(
          `   Select option (1-${alternatives.length + 1}): `,
          alternatives.length + 1
        );

        if (choice <= alternatives.length) {
          console.log(`   Switching to: ${alternatives[choice - 1].folder}`);
          return { proceed: true, useAlternative: true, selectedFolder: alternatives[choice - 1].folder };
        }

        console.log(`   Continuing with "${specFolderName}" as requested`);
        return { proceed: true, useAlternative: false };
      } catch {
        console.log(`   Warning: Proceeding with "${specFolderName}"`);
        return { proceed: true, useAlternative: false };
      }
    }
  } catch {
    // Could not read alternatives - proceed with warning
  }

  console.log(`   Warning: No better alternatives found - proceeding with "${specFolderName}"`);
  return { proceed: true, useAlternative: false };
}

async function validateFolderAlignment(
  collectedData: CollectedDataForAlignment,
  specFolderName: string,
  specsDir: string
): Promise<AlignmentResult> {
  const conversationTopics = extractConversationTopics(collectedData);

  const workDomain = detectWorkDomain(collectedData);

  const baseScore = calculateAlignmentScore(conversationTopics, specFolderName);
  const domainAwareScore = calculateAlignmentScoreWithDomain(conversationTopics, specFolderName, workDomain);
  const alignmentScore = Math.max(baseScore, domainAwareScore);

  console.log(`   Alignment check: ${specFolderName} (${baseScore}% match)`);

  const isInfrastructureMismatch = workDomain.domain === 'opencode' && domainAwareScore === baseScore;

  if (isInfrastructureMismatch) {
    console.log(`   Warning: Infrastructure work detected: .opencode/${workDomain.subpath || '*'}`);
  }

  if (alignmentScore >= ALIGNMENT_CONFIG.THRESHOLD && !isInfrastructureMismatch) {
    console.log('   Good alignment with selected folder');
    return { proceed: true, useAlternative: false };
  }

  if (alignmentScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD && !isInfrastructureMismatch) {
    console.log('   Warning: Moderate alignment - proceeding with caution');
    return { proceed: true, useAlternative: false };
  }

  if (isInfrastructureMismatch) {
    console.log(`\n   Warning: INFRASTRUCTURE MISMATCH (${Math.round(workDomain.confidence * 100)}% of files in .opencode/)`);
    console.log(`   Suggested folder patterns: ${workDomain.patterns.join(', ')}`);
  } else {
    console.log(`\n   Warning: LOW ALIGNMENT WARNING (${baseScore}% match)`);
  }
  console.log(`   The selected folder "${specFolderName}" may not match conversation content.\n`);

  try {
    const entries = await fs.readdir(specsDir);
    const specFolders = entries
      .filter((name) => /^\d{3}-/.test(name))
      .filter((name) => !isArchiveFolder(name))
      .sort()
      .reverse();

    const alternatives = specFolders
      .map((folder) => ({
        folder,
        score: calculateAlignmentScoreWithDomain(conversationTopics, folder, workDomain)
      }))
      .filter((alt) => alt.folder !== specFolderName)
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
        console.log('   Warning: Non-interactive mode - proceeding with specified folder');
        return { proceed: true, useAlternative: false };
      }

      const choice = await promptUserChoice(
        `   Select option (1-${alternatives.length + 2}): `,
        alternatives.length + 2
      );

      if (choice <= alternatives.length) {
        return { proceed: true, useAlternative: true, selectedFolder: alternatives[choice - 1].folder };
      } else if (choice === alternatives.length + 1) {
        console.log(`   Proceeding with "${specFolderName}" as requested`);
        return { proceed: true, useAlternative: false };
      } else {
        console.log('   Aborted. Please re-run with correct folder.');
        return { proceed: false, useAlternative: false };
      }
    }
  } catch {
    // If we can't find alternatives, just proceed with warning
  }

  console.log(`   Warning: Proceeding with "${specFolderName}" (no better alternatives found)`);
  return { proceed: true, useAlternative: false };
}

/* -----------------------------------------------------------------
   6. EXPORTS
------------------------------------------------------------------*/

export {
  ALIGNMENT_CONFIG,
  isArchiveFolder,
  extractConversationTopics,
  extractObservationKeywords,
  parseSpecFolderTopic,
  calculateAlignmentScore,
  validateContentAlignment,
  validateFolderAlignment,
};
