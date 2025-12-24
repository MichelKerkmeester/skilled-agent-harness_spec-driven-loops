#!/usr/bin/env node

/**
 * Memory - Generate Expanded Conversation Documentation
 *
 * This script generates comprehensive conversation context documentation
 * from conversation session data provided via JSON input file.
 */

const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Content filtering stats (filtering happens in transform-transcript.js)
const { getFilterStats } = require('./lib/content-filter');

// Semantic summarization for meaningful implementation summaries
const {
  generateImplementationSummary,
  formatSummaryAsMarkdown,
  extractFileChanges
} = require('./lib/semantic-summarizer');

// Anchor generation for searchable context retrieval
const {
  generateAnchorId,
  categorizeSection,
  validateAnchorUniqueness,
  extractSpecNumber
} = require('./lib/anchor-generator');

// Semantic memory v10.0 - embedding generation and vector indexing
const { generateEmbedding, EMBEDDING_DIM, MODEL_NAME } = require('./lib/embeddings');
const vectorIndex = require('./lib/vector-index');
const retryManager = require('./lib/retry-manager');
const { extractTriggerPhrases } = require('./lib/trigger-extractor');

// Simulation data factory for fallback mode
const simFactory = require('./lib/simulation-factory');
const opencodeCapture = require('./lib/opencode-capture');

// ASCII box formatting utilities for decision trees
const {
  padText,
  formatDecisionHeader,
  formatOptionBox,
  formatChosenBox,
  formatCaveatsBox,
  formatFollowUpBox
} = require('./lib/ascii-boxes');

// Flowchart generation utilities
const flowchartGen = require('./lib/flowchart-generator');

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

// Load configuration from config.jsonc with fallback to defaults
// Supports JSONC format: strips // comments from all lines before parsing
function loadConfig() {
  const defaultConfig = {
    maxResultPreview: 500,
    maxConversationMessages: 100,
    maxToolOutputLines: 100,
    messageTimeWindow: 300000,
    contextPreviewHeadLines: 50,
    contextPreviewTailLines: 20,
    timezoneOffsetHours: 0
  };

  const configPath = path.join(__dirname, '..', 'config.jsonc');

  try {
    if (fsSync.existsSync(configPath)) {
      const configContent = fsSync.readFileSync(configPath, 'utf-8');

      // JSONC parser: Strip // comments from all lines, then extract JSON block
      const lines = configContent.split('\n');
      const jsonLines = [];
      let inJsonBlock = false;
      let braceDepth = 0;

      for (const line of lines) {
        // Strip // comments (but preserve strings containing //)
        // Simple approach: remove // and everything after if not inside a string
        let cleanLine = line;
        
        // Find // that's not inside a string
        let inString = false;
        let commentStart = -1;
        for (let i = 0; i < line.length - 1; i++) {
          const char = line[i];
          if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
            inString = !inString;
          }
          if (!inString && char === '/' && line[i+1] === '/') {
            commentStart = i;
            break;
          }
        }
        
        if (commentStart !== -1) {
          cleanLine = line.substring(0, commentStart);
        }
        
        // Track brace depth to find JSON block boundaries
        for (const char of cleanLine) {
          if (char === '{') {
            if (!inJsonBlock) inJsonBlock = true;
            braceDepth++;
          } else if (char === '}') {
            braceDepth--;
          }
        }
        
        // Only include lines while inside JSON block
        if (inJsonBlock) {
          jsonLines.push(cleanLine);
        }
        
        // Stop when JSON block closes
        if (inJsonBlock && braceDepth === 0) {
          break;
        }
      }

      // P1-026: Handle empty file and only-comments file
      if (!jsonLines.length || !jsonLines.join('').trim()) {
        console.warn('⚠️  Config file is empty or contains only comments. Using defaults.');
        return defaultConfig;
      }

      const jsonContent = jsonLines.join('\n').trim();
      const userConfig = JSON.parse(jsonContent);
      return { ...defaultConfig, ...userConfig };
    }
  } catch (error) {
    console.warn(`⚠️  Failed to load config.jsonc: ${error.message}`);
    console.warn('   Using default configuration values');
  }

  return defaultConfig;
}

const userConfig = loadConfig();

const CONFIG = {
  SKILL_VERSION: '12.5.0',
  MESSAGE_COUNT_TRIGGER: 20, // Auto-save every 20 messages
  MAX_RESULT_PREVIEW: userConfig.maxResultPreview,
  MAX_CONVERSATION_MESSAGES: userConfig.maxConversationMessages,
  MAX_TOOL_OUTPUT_LINES: userConfig.maxToolOutputLines,
  TRUNCATE_FIRST_LINES: userConfig.contextPreviewHeadLines,
  TRUNCATE_LAST_LINES: userConfig.contextPreviewTailLines,
  MESSAGE_TIME_WINDOW: userConfig.messageTimeWindow,
  TIMEZONE_OFFSET_HOURS: userConfig.timezoneOffsetHours,
  TOOL_PREVIEW_LINES: 10, // lines to show in tool result preview
  TEMPLATE_DIR: path.join(__dirname, '..', 'templates'),  // .opencode/skill/system-memory/templates/
  // Fix: Derive PROJECT_ROOT from script location, not cwd()
  // __dirname = .opencode/skill/system-memory/scripts
  // PROJECT_ROOT = 4 levels up from __dirname (since we're in skills/system-memory/scripts/)
  PROJECT_ROOT: path.resolve(__dirname, '..', '..', '..', '..'),
  DATA_FILE: null,       // Will be set by parseArguments
  SPEC_FOLDER_ARG: null, // Will be set by parseArguments
  // P2-024: Magic numbers extracted to CONFIG
  MAX_FILES_IN_MEMORY: 10,
  MAX_OBSERVATIONS: 3,
  MIN_PROMPT_LENGTH: 60,
  MAX_CONTENT_PREVIEW: 500
};

// ───────────────────────────────────────────────────────────────
// SMART ARGUMENT PARSING (V13.0)
// ───────────────────────────────────────────────────────────────

/**
 * Parse command line arguments to detect data file vs spec folder
 * Supports two modes:
 * 1. Legacy/Manual: node script.js <data-file> [spec-folder]
 * 2. Stateless/Agent: node script.js <spec-folder> (auto-capture)
 */
function parseArguments() {
  const arg1 = process.argv[2];
  const arg2 = process.argv[3];

  if (!arg1) return; // No arguments

  // Check if first argument looks like a spec folder
  // - Starts with "specs/" (full path)
  // - Starts with ###- (folder name)
  // - Is NOT a .json file
  const isSpecFolder = (
    arg1.startsWith('specs/') || 
    /^\d{3}-/.test(path.basename(arg1))
  ) && !arg1.endsWith('.json');

  if (isSpecFolder) {
    // Mode 2: Stateless/Agent (Arg1 is spec folder)
    CONFIG.SPEC_FOLDER_ARG = arg1;
    CONFIG.DATA_FILE = null; // Will trigger OpenCode capture
    console.log(`   ℹ️  Stateless mode detected: Spec folder provided directly`);
  } else {
    // Mode 1: Legacy/Manual (Arg1 is data file)
    CONFIG.DATA_FILE = arg1;
    CONFIG.SPEC_FOLDER_ARG = arg2 || null;
  }
}

// Run argument parsing immediately
parseArguments();

// ───────────────────────────────────────────────────────────────
// V11.0: SESSION METADATA HELPERS
// ───────────────────────────────────────────────────────────────

/**
 * V11.2: Detect and link related documentation files in spec folder
 * Scans for standard documentation files with meaningful descriptions
 * Also includes parent folder docs if in a sub-folder (e.g., 005-memory/010-feature)
 * 
 * @param {string} specFolderPath - Absolute path to the spec folder
 * @returns {Promise<Array<{FILE_NAME: string, FILE_PATH: string, DESCRIPTION: string}>>} Array of found docs
 */
async function detectRelatedDocs(specFolderPath) {
  // Standard documentation files with their roles
  const docFiles = [
    { name: 'spec.md', role: 'Requirements specification' },
    { name: 'plan.md', role: 'Implementation plan' },
    { name: 'tasks.md', role: 'Task breakdown' },
    { name: 'checklist.md', role: 'QA checklist' },
    { name: 'decision-record.md', role: 'Architecture decisions' },
    { name: 'research.md', role: 'Research findings' },
    { name: 'handover.md', role: 'Session handover notes' },
    { name: 'debug-delegation.md', role: 'Debug task delegation' }
  ];
  
  const found = [];
  
  // Helper to check if file exists
  const fileExists = async (filePath) => {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  };
  
  // Scan current spec folder
  for (const doc of docFiles) {
    const fullPath = path.join(specFolderPath, doc.name);
    if (await fileExists(fullPath)) {
      found.push({
        FILE_NAME: doc.name,
        FILE_PATH: `./${doc.name}`,
        DESCRIPTION: doc.role
      });
    }
  }
  
  // Check if we're in a sub-folder (e.g., specs/005-memory/010-feature/)
  // by looking for a parent folder that also matches spec folder pattern
  const parentPath = path.dirname(specFolderPath);
  const parentName = path.basename(parentPath);
  
  // Parent is a spec folder if it matches ###-name pattern and isn't 'specs'
  if (/^\d{3}-/.test(parentName) && path.basename(path.dirname(parentPath)) === 'specs') {
    // Scan parent folder for docs
    for (const doc of docFiles) {
      const parentDocPath = path.join(parentPath, doc.name);
      if (await fileExists(parentDocPath)) {
        found.push({
          FILE_NAME: doc.name,
          FILE_PATH: `../${doc.name}`,
          DESCRIPTION: `[Parent] ${doc.role}`
        });
      }
    }
  }
  
  return found;
}

/**
 * Extract key topics from session summary and decisions
 * Uses simple keyword extraction with stopword filtering
 * @param {string} summary - Session summary text
 * @param {Array} decisions - Array of decision objects
 * @returns {Array<string>} Array of key topic strings (max 10)
 */
function extractKeyTopics(summary, decisions = []) {
  const topics = new Set();
  
  // Stopwords to filter out - expanded to include common placeholders and generic terms
  const stopwords = new Set([
    // Common English stopwords
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
    'very', 'just', 'also', 'now', 'here', 'there', 'then', 'once',
    // Generic development terms
    'file', 'files', 'code', 'update', 'updated', 'add', 'added', 'remove', 'removed',
    'change', 'changed', 'fix', 'fixed', 'new', 'session', 'using', 'used',
    // Placeholder and fallback terms (these indicate poor quality data)
    'response', 'request', 'message', 'user', 'assistant', 'processed',
    'initiated', 'conversation', 'unknown', 'placeholder', 'simulation',
    'simulated', 'fallback', 'default', 'undefined', 'null', 'empty',
    // Generic action words
    'get', 'set', 'run', 'make', 'made', 'create', 'created', 'delete', 'deleted',
    'start', 'started', 'stop', 'stopped', 'done', 'complete', 'completed'
  ]);
  
  // Skip extraction if summary looks like placeholder/fallback data
  const isPlaceholderSummary = !summary || 
    summary.includes('SIMULATION MODE') ||
    summary.includes('[response]') ||
    summary.includes('placeholder') ||
    summary.length < 20;
  
  // Extract words from summary (3+ chars, alphanumeric)
  if (summary && !isPlaceholderSummary) {
    const words = summary.toLowerCase().match(/\b[a-z][a-z0-9]{2,}\b/g) || [];
    words.forEach(word => {
      if (!stopwords.has(word) && word.length >= 3) {
        topics.add(word);
      }
    });
  }
  
  // Extract from decision titles and rationales
  if (Array.isArray(decisions)) {
    for (const dec of decisions) {
      const decText = `${dec.TITLE || ''} ${dec.RATIONALE || ''} ${dec.CHOSEN || ''}`.toLowerCase();
      const words = decText.match(/\b[a-z][a-z0-9]{2,}\b/g) || [];
      words.forEach(word => {
        if (!stopwords.has(word) && word.length >= 3) {
          topics.add(word);
        }
      });
    }
  }
  
  // Convert to array, sort by length (longer = more specific), limit to 10
  return Array.from(topics)
    .sort((a, b) => b.length - a.length)
    .slice(0, 10);
}

/**
 * Generate a unique session ID for tracking
 * Format: session-{timestamp}-{random}
 * @returns {string} Unique session identifier
 */
function generateSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Detect the current git branch/channel
 * Returns branch name, or detached:hash if in detached HEAD state
 * @returns {string} Channel identifier
 */
function getChannel() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8',
      cwd: CONFIG.PROJECT_ROOT,
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    return branch === 'HEAD'
      ? `detached:${execSync('git rev-parse --short HEAD', { encoding: 'utf8', cwd: CONFIG.PROJECT_ROOT, stdio: ['pipe', 'pipe', 'pipe'] }).trim()}`
      : branch;
  } catch {
    return 'default';
  }
}

/**
 * Auto-detect context type based on tool usage patterns
 * @param {Object} toolCounts - Map of tool names to usage counts
 * @param {number} decisionCount - Number of decisions in the session
 * @returns {string} Context type: general|decision|discovery|research|implementation
 */
function detectContextType(toolCounts, decisionCount) {
  const total = Object.values(toolCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return 'general';

  const readTools = (toolCounts.Read || 0) + (toolCounts.Grep || 0) + (toolCounts.Glob || 0);
  const writeTools = (toolCounts.Write || 0) + (toolCounts.Edit || 0);
  const webTools = (toolCounts.WebSearch || 0) + (toolCounts.WebFetch || 0);

  if (decisionCount > 0) return 'decision';
  if (webTools / total > 0.3) return 'discovery';
  if (readTools / total > 0.5 && writeTools / total < 0.1) return 'research';
  if (writeTools / total > 0.3) return 'implementation';
  return 'general';
}

/**
 * Detect importance tier based on files modified and context type
 * @param {Array<string>} filesModified - List of modified file paths
 * @param {string} contextType - The detected context type
 * @returns {string} Importance tier: critical|important|normal
 */
function detectImportanceTier(filesModified, contextType) {
  // Check for architecture/core paths
  const criticalPaths = ['/architecture/', '/core/', '/schema/', '/security/', '/config/'];
  if (filesModified.some(f => criticalPaths.some(p => f.includes(p)))) {
    return 'critical';
  }
  if (contextType === 'decision') return 'important';
  return 'normal'; // Default
}

// ───────────────────────────────────────────────────────────────
// PROJECT STATE SNAPSHOT HELPERS (V13.0 - Replaces STATE.md)
// ───────────────────────────────────────────────────────────────

/**
 * Detect project phase from tool usage and observations
 * @param {Object} toolCounts - Tool usage counts
 * @param {Array} observations - Session observations
 * @param {number} messageCount - Total message count
 * @returns {string} Phase: RESEARCH|PLANNING|IMPLEMENTATION|REVIEW|COMPLETE
 */
function detectProjectPhase(toolCounts, observations, messageCount) {
  const total = Object.values(toolCounts).reduce((a, b) => a + b, 0);
  if (total === 0 && messageCount < 3) return 'RESEARCH';

  const readTools = (toolCounts.Read || 0) + (toolCounts.Grep || 0) + (toolCounts.Glob || 0);
  const writeTools = (toolCounts.Write || 0) + (toolCounts.Edit || 0);
  
  // Check observation types for phase hints
  const obsTypes = observations.map(o => o.type || 'observation');
  const hasDecisions = obsTypes.includes('decision');
  const hasFeatures = obsTypes.some(t => ['feature', 'implementation'].includes(t));
  
  if (writeTools / total > 0.4) return 'IMPLEMENTATION';
  if (hasDecisions && writeTools < readTools) return 'PLANNING';
  if (hasFeatures && writeTools > 0) return 'REVIEW';
  if (readTools / total > 0.6) return 'RESEARCH';
  
  return 'IMPLEMENTATION'; // Default for active sessions
}

/**
 * Extract the most recently active file from observations
 * @param {Array} observations - Session observations
 * @param {Array} files - Files array with FILE_PATH
 * @returns {string} Active file path or 'N/A'
 */
function extractActiveFile(observations, files) {
  // Check most recent observations for file references
  for (let i = observations.length - 1; i >= 0; i--) {
    const obs = observations[i];
    if (obs.files && obs.files.length > 0) {
      return obs.files[0];
    }
  }
  
  // Fall back to first file in FILES array
  if (files && files.length > 0) {
    return files[0].FILE_PATH || 'N/A';
  }
  
  return 'N/A';
}

/**
 * Extract next action from context or observations
 * @param {Array} observations - Session observations
 * @param {Array} recentContext - Recent context from conversation
 * @returns {string} Next action description
 */
function extractNextAction(observations, recentContext) {
  // Check for explicit follow-up in observations
  for (const obs of observations) {
    if (obs.facts) {
      for (const fact of obs.facts) {
        if (typeof fact === 'string') {
          const nextMatch = fact.match(/\b(?:next|todo|follow-?up):\s*(.+)/i);
          if (nextMatch) return nextMatch[1].trim();
        }
      }
    }
  }
  
  // Check recent context for next steps
  if (recentContext && recentContext[0]?.learning) {
    const learning = recentContext[0].learning;
    const nextMatch = learning.match(/\b(?:next|then|afterwards?):\s*(.+)/i);
    if (nextMatch) return nextMatch[1].trim().substring(0, 100);
  }
  
  return 'Continue implementation';
}

/**
 * Extract any blockers mentioned in observations
 * @param {Array} observations - Session observations
 * @returns {string} Blockers description or 'None'
 */
function extractBlockers(observations) {
  const blockerKeywords = /\b(?:block(?:ed|er|ing)?|stuck|issue|problem|error|fail(?:ed|ing)?|cannot|can't)\b/i;
  
  for (const obs of observations) {
    const narrative = obs.narrative || '';
    if (blockerKeywords.test(narrative)) {
      // Extract first sentence mentioning blocker
      const sentences = narrative.match(/[^.!?]+[.!?]+/g) || [narrative];
      for (const sentence of sentences) {
        if (blockerKeywords.test(sentence)) {
          return sentence.trim().substring(0, 100);
        }
      }
    }
  }
  
  return 'None';
}

/**
 * Build file progress from spec files
 * @param {Array} specFiles - Array of spec file objects
 * @param {string} specFolderPath - Path to spec folder
 * @returns {Array} Array of {FILE_NAME, FILE_STATUS}
 */
function buildFileProgress(specFiles, specFolderPath) {
  if (!specFiles || specFiles.length === 0) return [];
  
  return specFiles.map(file => ({
    FILE_NAME: file.FILE_NAME,
    FILE_STATUS: 'EXISTS'
  }));
}

/**
 * Auto-detect observation type based on content
 * @param {Object} obs - Observation object with title, narrative, facts
 * @returns {string} Type: feature|bugfix|refactor|discovery|decision|research|observation
 */
function detectObservationType(obs) {
  // Return existing type if already set (and not generic 'observation')
  if (obs.type && obs.type !== 'observation') return obs.type;

  const text = ((obs.title || '') + ' ' + (obs.narrative || '')).toLowerCase();
  const facts = (obs.facts || []).join(' ').toLowerCase();
  const combined = text + ' ' + facts;

  // Check for specific patterns
  if (/\b(fix(?:ed|es|ing)?|bug|error|issue|broken|patch)\b/.test(combined)) return 'bugfix';
  if (/\b(implement(?:ed|s|ing)?|add(?:ed|s|ing)?|creat(?:ed|es|ing)?|new feature|feature)\b/.test(combined)) return 'feature';
  if (/\b(refactor(?:ed|s|ing)?|clean(?:ed|s|ing)?|restructur(?:ed|es|ing)?|reorganiz(?:ed|es|ing)?)\b/.test(combined)) return 'refactor';
  if (/\b(decid(?:ed|es|ing)?|chose|select(?:ed|s|ing)?|option|alternative)\b/.test(combined)) return 'decision';
  if (/\b(research(?:ed|ing)?|investigat(?:ed|es|ing)?|explor(?:ed|es|ing)?|analyz(?:ed|es|ing)?)\b/.test(combined)) return 'research';
  if (/\b(discover(?:ed|s|ing)?|found|learn(?:ed|s|ing)?|realiz(?:ed|es|ing)?)\b/.test(combined)) return 'discovery';

  return 'observation'; // Default fallback
}

// ───────────────────────────────────────────────────────────────
// IMPLEMENTATION GUIDE EXTRACTION (V12.0)
// ───────────────────────────────────────────────────────────────

/**
 * Check if session contains implementation work worth documenting
 * @param {Array} observations - Session observations
 * @param {Array} files - Files modified during session
 * @returns {boolean} True if implementation guide should be generated
 */
function hasImplementationWork(observations, files) {
  // Check observation types
  const implTypes = ['implementation', 'feature', 'bugfix', 'refactor'];
  const hasImplType = observations.some(o => implTypes.includes(o.type));
  
  // Check narratives for implementation keywords
  const implKeywords = /\b(implemented|built|created|added|fixed|refactored|developed|constructed|established)\b/i;
  const hasImplKeywords = observations.some(o => 
    o.narrative && implKeywords.test(o.narrative)
  );
  
  // Check for actual file modifications (not just reads)
  const hasFileChanges = files && files.length > 0;
  
  // Require at least 2 of: impl type, impl keywords, file changes
  const score = (hasImplType ? 1 : 0) + (hasImplKeywords ? 1 : 0) + (hasFileChanges ? 1 : 0);
  return score >= 2;
}

/**
 * Extract main topic from observations for Implementation Guide anchor
 * @param {Array} observations - Session observations
 * @param {string} specFolder - Spec folder name
 * @returns {string} Main topic slug (e.g., "oauth-callback", "content-filter")
 */
function extractMainTopic(observations, specFolder) {
  // Try to get topic from spec folder name first
  if (specFolder) {
    const folderTopic = specFolder.replace(/^\d+-/, '').replace(/-/g, '-');
    if (folderTopic.length > 3) return folderTopic;
  }
  
  // Extract from first implementation/feature observation
  const implObs = observations.find(o => 
    o.type === 'implementation' || o.type === 'feature'
  );
  
  if (implObs && implObs.title) {
    // Convert title to slug: "Implemented OAuth callback" → "oauth-callback"
    return implObs.title
      .toLowerCase()
      .replace(/^(implemented|created|added|built|fixed)\s+/i, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 40);
  }
  
  return 'implementation';
}

/**
 * Extract what was built from implementation observations
 * @param {Array} observations - Session observations
 * @returns {Array} Array of {FEATURE_NAME, DESCRIPTION}
 */
function extractWhatBuilt(observations) {
  const implementations = [];
  const seen = new Set();
  
  for (const obs of observations) {
    const type = detectObservationType(obs);
    if (!['feature', 'implementation', 'bugfix', 'refactor'].includes(type)) continue;
    
    // Extract feature name from title
    let featureName = obs.title || 'Implementation';
    
    // Clean up common prefixes
    featureName = featureName
      .replace(/^(implemented|created|added|built|fixed|refactored)\s+/i, '')
      .trim();
    
    // Skip duplicates
    const key = featureName.toLowerCase().substring(0, 30);
    if (seen.has(key)) continue;
    seen.add(key);
    
    // Extract description from narrative (first sentence or 100 chars)
    let description = obs.narrative || '';
    const firstSentence = description.match(/^[^.!?]+[.!?]/);
    description = firstSentence 
      ? firstSentence[0].trim()
      : description.substring(0, 100).trim();
    
    // Clean markdown formatting
    description = description
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^[-*]\s+/, '');
    
    if (featureName.length > 3) {
      implementations.push({
        FEATURE_NAME: featureName.charAt(0).toUpperCase() + featureName.slice(1),
        DESCRIPTION: description || 'Implemented during session'
      });
    }
  }
  
  return implementations.slice(0, 5); // Limit to 5 features
}

/**
 * Extract key files with their roles from file changes
 * @param {Array} files - Files modified during session (with FILE_PATH, DESCRIPTION)
 * @param {Array} observations - Session observations for additional context
 * @returns {Array} Array of {FILE_PATH, ROLE}
 */
function extractKeyFilesWithRoles(files, observations) {
  const keyFiles = [];
  
  // Build context map from observations
  const fileContextMap = new Map();
  for (const obs of observations) {
    if (obs.files && Array.isArray(obs.files)) {
      for (const file of obs.files) {
        const narrative = obs.narrative || '';
        if (!fileContextMap.has(file) && narrative.length > 10) {
          fileContextMap.set(file, narrative);
        }
      }
    }
  }
  
  // Common file role patterns
  const rolePatterns = [
    { pattern: /\.test\.|\.spec\.|__tests__/, role: 'Test file' },
    { pattern: /config\.|\.config\./, role: 'Configuration' },
    { pattern: /index\.(js|ts|jsx|tsx)$/, role: 'Entry point / exports' },
    { pattern: /types?\.(ts|d\.ts)$/, role: 'Type definitions' },
    { pattern: /utils?\./, role: 'Utility functions' },
    { pattern: /hooks?\./, role: 'React hook' },
    { pattern: /context\./, role: 'React context provider' },
    { pattern: /store\./, role: 'State management' },
    { pattern: /service\./, role: 'Service layer' },
    { pattern: /api\./, role: 'API layer' },
    { pattern: /model\./, role: 'Data model' },
    { pattern: /schema\./, role: 'Schema definition' },
    { pattern: /migration/, role: 'Database migration' },
    { pattern: /template/, role: 'Template file' },
    { pattern: /\.css$/, role: 'Styles' },
    { pattern: /\.md$/, role: 'Documentation' },
    { pattern: /\.sh$/, role: 'Script' }
  ];
  
  for (const file of files) {
    const filePath = file.FILE_PATH || file.path || file;
    const existingDesc = file.DESCRIPTION || '';
    
    // Try to determine role
    let role = '';
    
    // 1. Check pattern matches
    for (const { pattern, role: patternRole } of rolePatterns) {
      if (pattern.test(filePath)) {
        role = patternRole;
        break;
      }
    }
    
    // 2. Use file description if no pattern match and description is meaningful
    if (!role && existingDesc && existingDesc.length > 10 && 
        !existingDesc.toLowerCase().includes('modified during session')) {
      role = existingDesc;
    }
    
    // 3. Try observation context
    if (!role && fileContextMap.has(filePath)) {
      const context = fileContextMap.get(filePath);
      // Extract first meaningful phrase
      const phrase = context.match(/\b(?:for|handles?|provides?|implements?|contains?)\s+([^.]+)/i);
      if (phrase) {
        role = phrase[1].trim().substring(0, 60);
      }
    }
    
    // 4. Fallback: derive from filename
    if (!role) {
      const filename = filePath.split('/').pop().replace(/\.[^.]+$/, '');
      role = filename
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase();
      role = 'Core ' + role;
    }
    
    keyFiles.push({
      FILE_PATH: filePath,
      ROLE: role.charAt(0).toUpperCase() + role.slice(1)
    });
  }
  
  return keyFiles.slice(0, 8); // Limit to 8 key files
}

/**
 * Generate extension guide based on patterns observed
 * @param {Array} observations - Session observations
 * @param {Array} files - Files modified
 * @returns {Array} Array of {GUIDE_TEXT}
 */
function generateExtensionGuide(observations, files) {
  const guides = [];
  const seenPatterns = new Set();
  
  // Extract patterns from file types
  const fileTypes = new Map();
  for (const file of files) {
    const filePath = file.FILE_PATH || file.path || file;
    const ext = filePath.split('.').pop();
    fileTypes.set(ext, (fileTypes.get(ext) || 0) + 1);
  }
  
  // Generate guides based on common patterns
  if (fileTypes.get('js') > 0 || fileTypes.get('ts') > 0) {
    guides.push({ GUIDE_TEXT: 'Add new modules following the existing file structure patterns' });
    seenPatterns.add('modules');
  }
  
  if (fileTypes.get('test.js') > 0 || fileTypes.get('spec.js') > 0 || 
      files.some(f => (f.FILE_PATH || f).includes('test'))) {
    guides.push({ GUIDE_TEXT: 'Create corresponding test files for new implementations' });
    seenPatterns.add('tests');
  }
  
  // Check for patterns in observations
  for (const obs of observations) {
    const narrative = (obs.narrative || '').toLowerCase();
    
    if (narrative.includes('api') && !seenPatterns.has('api')) {
      guides.push({ GUIDE_TEXT: 'Follow the established API pattern for new endpoints' });
      seenPatterns.add('api');
    }
    
    if (narrative.includes('validation') && !seenPatterns.has('validation')) {
      guides.push({ GUIDE_TEXT: 'Apply validation patterns to new input handling' });
      seenPatterns.add('validation');
    }
    
    if (narrative.includes('error') && !seenPatterns.has('error')) {
      guides.push({ GUIDE_TEXT: 'Maintain consistent error handling approach' });
      seenPatterns.add('error');
    }
    
    if ((narrative.includes('template') || narrative.includes('mustache')) && !seenPatterns.has('template')) {
      guides.push({ GUIDE_TEXT: 'Use established template patterns for new outputs' });
      seenPatterns.add('template');
    }
  }
  
  // Default guide if none generated
  if (guides.length === 0) {
    guides.push({ GUIDE_TEXT: 'Reference existing implementations as patterns for new features' });
  }
  
  return guides.slice(0, 4); // Limit to 4 guides
}

/**
 * Extract code patterns used in the session
 * @param {Array} observations - Session observations
 * @param {Array} files - Files modified
 * @returns {Array} Array of {PATTERN_NAME, USAGE}
 */
function extractCodePatterns(observations, files) {
  const patterns = [];
  const seen = new Set();
  
  // Common pattern detection
  const patternMatchers = [
    { 
      keywords: ['helper', 'util', 'utility'],
      name: 'Helper Functions',
      usage: 'Encapsulate reusable logic in dedicated utility functions'
    },
    {
      keywords: ['validation', 'validate', 'validator'],
      name: 'Validation',
      usage: 'Input validation before processing'
    },
    {
      keywords: ['template', 'mustache', 'handlebars', 'placeholder'],
      name: 'Template Pattern',
      usage: 'Use templates with placeholder substitution'
    },
    {
      keywords: ['filter', 'filtering', 'pipeline'],
      name: 'Filter Pipeline',
      usage: 'Chain filters for data transformation'
    },
    {
      keywords: ['fallback', 'default', 'graceful'],
      name: 'Graceful Fallback',
      usage: 'Provide sensible defaults when primary method fails'
    },
    {
      keywords: ['normalize', 'normalization', 'clean'],
      name: 'Data Normalization',
      usage: 'Clean and standardize data before use'
    },
    {
      keywords: ['cache', 'caching', 'memoize'],
      name: 'Caching',
      usage: 'Cache expensive computations or fetches'
    },
    {
      keywords: ['async', 'await', 'promise'],
      name: 'Async/Await',
      usage: 'Handle asynchronous operations cleanly'
    },
    {
      keywords: ['map', 'reduce', 'filter', 'transform'],
      name: 'Functional Transforms',
      usage: 'Use functional methods for data transformation'
    },
    {
      keywords: ['export', 'module', 'import'],
      name: 'Module Pattern',
      usage: 'Organize code into importable modules'
    }
  ];
  
  // Combine all text for analysis
  const allText = observations
    .map(o => `${o.title || ''} ${o.narrative || ''}`)
    .join(' ')
    .toLowerCase();
  
  // Also check file names
  const fileNames = files
    .map(f => (f.FILE_PATH || f.path || f).toLowerCase())
    .join(' ');
  
  const combinedText = allText + ' ' + fileNames;
  
  // Detect patterns
  for (const matcher of patternMatchers) {
    if (seen.has(matcher.name)) continue;
    
    const hasKeyword = matcher.keywords.some(kw => combinedText.includes(kw));
    if (hasKeyword) {
      patterns.push({
        PATTERN_NAME: matcher.name,
        USAGE: matcher.usage
      });
      seen.add(matcher.name);
    }
  }
  
  return patterns.slice(0, 5); // Limit to 5 patterns
}

/**
 * Build complete implementation guide data for template
 * @param {Array} observations - Session observations
 * @param {Array} files - Files modified (with FILE_PATH, DESCRIPTION)
 * @param {string} specFolder - Spec folder name
 * @returns {Object} Implementation guide data for template
 */
function buildImplementationGuideData(observations, files, specFolder) {
  // Check if we have enough implementation work
  const hasImpl = hasImplementationWork(observations, files);
  
  if (!hasImpl) {
    return {
      HAS_IMPLEMENTATION_GUIDE: false,
      TOPIC: '',
      IMPLEMENTATIONS: [],
      IMPL_KEY_FILES: [],
      EXTENSION_GUIDES: [],
      PATTERNS: []
    };
  }
  
  return {
    HAS_IMPLEMENTATION_GUIDE: true,
    TOPIC: extractMainTopic(observations, specFolder),
    IMPLEMENTATIONS: extractWhatBuilt(observations),
    IMPL_KEY_FILES: extractKeyFilesWithRoles(files, observations),
    EXTENSION_GUIDES: generateExtensionGuide(observations, files),
    PATTERNS: extractCodePatterns(observations, files)
  };
}

/**
 * Count tool usage by type from observations and user prompts
 * @param {Array} observations - Session observations
 * @param {Array} userPrompts - User prompt history
 * @returns {Object} Tool counts by name
 */
function countToolsByType(observations, userPrompts) {
  const counts = {};
  const toolNames = ['Read', 'Edit', 'Write', 'Bash', 'Grep', 'Glob', 'Task', 'WebFetch', 'WebSearch', 'Skill'];

  // Initialize counts
  toolNames.forEach(tool => counts[tool] = 0);

  // Count from observations
  for (const obs of observations) {
    if (obs.facts) {
      for (const fact of obs.facts) {
        const factText = typeof fact === 'string' ? fact : fact.text || '';
        for (const tool of toolNames) {
          if (factText.includes(`Tool: ${tool}`) || factText.includes(`${tool}(`)) {
            counts[tool]++;
          }
        }
      }
    }
  }

  // Count from user prompts
  for (const prompt of userPrompts) {
    const promptText = prompt.prompt || '';
    for (const tool of toolNames) {
      // Match tool call patterns
      const regex = new RegExp(`\\b${tool}\\s*\\(`, 'g');
      const matches = promptText.match(regex);
      if (matches) {
        counts[tool] += matches.length;
      }
    }
  }

  return counts;
}

// ───────────────────────────────────────────────────────────────
// ARGUMENT VALIDATION
// ───────────────────────────────────────────────────────────────

/**
 * Validate command-line arguments early to provide helpful error messages
 */
function validateArguments() {
  // Validate SPEC_FOLDER_ARG format if provided
  if (CONFIG.SPEC_FOLDER_ARG) {
    // Check format: must be ###-name
    // Allow full paths (specs/xxx) by checking basename
    const folderName = path.basename(CONFIG.SPEC_FOLDER_ARG);
    if (!/^\d{3}-/.test(folderName)) {
      console.error(`\n❌ Invalid spec folder format: ${CONFIG.SPEC_FOLDER_ARG}`);
      console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');

      // Try to find similar folders
      const specsDir = path.join(CONFIG.PROJECT_ROOT, 'specs');
      if (fsSync.existsSync(specsDir)) {
        try {
          const available = fsSync.readdirSync(specsDir);
          const matches = available.filter(name =>
            name.includes(CONFIG.SPEC_FOLDER_ARG) && /^\d{3}-/.test(name)
          );

          if (matches.length > 0) {
            console.error('Did you mean one of these?');
            matches.forEach(match => console.error(`  - ${match}`));
            console.error('');
          } else {
            // Show all available spec folders
            const allSpecs = available
              .filter(name => /^\d{3}-/.test(name))
              .filter(name => !name.match(/^(z_|.*archive.*|.*old.*|.*\.archived.*)/i))
              .sort()
              .reverse();

            if (allSpecs.length > 0) {
              console.error('Available spec folders:');
              allSpecs.slice(0, 5).forEach(folder => {
                console.error(`  - ${folder}`);
              });
              if (allSpecs.length > 5) {
                console.error(`  ... and ${allSpecs.length - 5} more\n`);
              } else {
                console.error('');
              }
            }
          }
        } catch {
          // Silently ignore read errors
        }
      }

      console.error('Usage: node generate-context.js <data-file> [spec-folder-name]\n');
      process.exit(1);
    }
  }
}

// Run validation immediately
validateArguments();

// ───────────────────────────────────────────────────────────────
// CONTEXT BUDGET MANAGEMENT
// ───────────────────────────────────────────────────────────────

/**
 * Check if auto-save should trigger based on message count
 * @param {number} messageCount - Total number of messages in conversation
 * @returns {boolean} - True if should auto-save
 */
function shouldAutoSave(messageCount) {
  // Auto-save every MESSAGE_COUNT_TRIGGER messages
  if (messageCount > 0 && messageCount % CONFIG.MESSAGE_COUNT_TRIGGER === 0) {
    return true;
  }
  return false;
}

// ───────────────────────────────────────────────────────────────
// DATA LOADING
// ───────────────────────────────────────────────────────────────

/**
 * Transform simplified manual input format to MCP-compatible format
 * Allows users to provide a simple JSON structure that gets normalized
 * 
 * Manual format accepts:
 * - specFolder (string) → SPEC_FOLDER
 * - sessionSummary (string) → observations[0].narrative
 * - keyDecisions (array of strings) → observations with type='decision'
 * - filesModified (array of strings) → FILES array
 * - triggerPhrases (array of strings) → passes through
 * - technicalContext (object) → merged into summary
 * 
 * @param {Object} data - Raw input data (manual or MCP format)
 * @returns {Object} - Normalized data in MCP-compatible format
 */
function normalizeInputData(data) {
  // If already has MCP format indicators, return as-is
  if (data.user_prompts || data.observations || data.recent_context) {
    return data;
  }
  
  // Transform simplified manual format to MCP-compatible format
  const normalized = {};
  
  // Transform specFolder → SPEC_FOLDER
  if (data.specFolder) {
    normalized.SPEC_FOLDER = data.specFolder;
  }
  
  // Transform filesModified → FILES array
  if (data.filesModified && Array.isArray(data.filesModified)) {
    normalized.FILES = data.filesModified.map(filePath => ({
      FILE_PATH: filePath,
      DESCRIPTION: 'Modified during session'
    }));
  }
  
  // Build observations from sessionSummary and keyDecisions
  const observations = [];
  
  // Session summary as main observation
  if (data.sessionSummary) {
    // Use full summary for narrative, truncate title at sentence boundary
    const summaryTitle = data.sessionSummary.length > 100 
      ? data.sessionSummary.substring(0, 100).replace(/\s+\S*$/, '') + '...'
      : data.sessionSummary;
    
    observations.push({
      type: 'feature',
      title: summaryTitle,
      narrative: data.sessionSummary,  // Full text for OUTCOME
      facts: data.triggerPhrases || []
    });
  }
  
  // Key decisions as decision observations
  // Supports both string format and object format:
  // - String: "Decided to use X because Y"
  // - Object: { decision: "...", rationale: "...", alternatives: [...], chosenOption: "..." }
  if (data.keyDecisions && Array.isArray(data.keyDecisions)) {
    for (const decisionItem of data.keyDecisions) {
      let decisionText, chosenApproach, rationale, alternatives;
      
      // Handle both string and object formats
      if (typeof decisionItem === 'string') {
        // String format - parse from text
        decisionText = decisionItem;
        const choiceMatch = decisionText.match(/(?:chose|selected|decided on|using|went with|opted for|implemented)\s+([^.,]+)/i);
        chosenApproach = choiceMatch ? choiceMatch[1].trim() : null;
        rationale = decisionText;
        alternatives = [];
      } else if (typeof decisionItem === 'object' && decisionItem !== null) {
        // Object format - extract structured fields
        decisionText = decisionItem.decision || decisionItem.title || 'Unknown decision';
        chosenApproach = decisionItem.chosenOption || decisionItem.chosen || decisionItem.decision;
        rationale = decisionItem.rationale || decisionItem.reason || decisionText;
        alternatives = decisionItem.alternatives || [];
        
        // Build full text from object fields for narrative
        if (decisionItem.rationale) {
          decisionText = `${decisionText} - ${decisionItem.rationale}`;
        }
        if (alternatives.length > 0) {
          decisionText += ` Alternatives considered: ${alternatives.join(', ')}.`;
        }
      } else {
        // Skip invalid entries
        continue;
      }
      
      // Generate a clean title from the decision text (first sentence or 80 chars)
      const titleMatch = decisionText.match(/^([^.!?]+[.!?]?)/);
      const title = titleMatch 
        ? titleMatch[1].substring(0, 80).trim()
        : decisionText.substring(0, 80).trim();
      
      // Use extracted or parsed chosen approach, fallback to title
      const finalChosenApproach = chosenApproach || title;
      
      // Build structured facts array for better extraction downstream
      const facts = [
        `Option 1: ${finalChosenApproach}`,
        `Chose: ${finalChosenApproach}`,
        `Rationale: ${rationale}`
      ];
      
      // Add alternatives as facts if available
      if (alternatives.length > 0) {
        alternatives.forEach((alt, i) => {
          facts.push(`Alternative ${i + 2}: ${alt}`);
        });
      }
      
      observations.push({
        type: 'decision',
        title: title,
        narrative: decisionText,
        facts: facts,
        // Add structured metadata for extractDecisions to use
        _manualDecision: {
          fullText: decisionText,
          chosenApproach: finalChosenApproach,
          confidence: 75
        }
      });
    }
  }
  
  // Technical context as additional observation
  if (data.technicalContext && typeof data.technicalContext === 'object') {
    const techDetails = Object.entries(data.technicalContext)
      .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
      .join('; ');
    
    observations.push({
      type: 'implementation',
      title: 'Technical Implementation Details',
      narrative: techDetails,
      facts: []
    });
  }
  
  normalized.observations = observations;
  
  // Create synthetic user_prompts for conversation extraction
  normalized.user_prompts = [{
    prompt: data.sessionSummary || 'Manual context save',
    timestamp: new Date().toISOString()
  }];
  
  // Create synthetic recent_context
  normalized.recent_context = [{
    request: data.sessionSummary || 'Manual context save',
    learning: data.sessionSummary || ''
  }];
  
  // Pass through trigger phrases for extraction
  if (data.triggerPhrases) {
    normalized._manualTriggerPhrases = data.triggerPhrases;
  }
  
  // V10.1: Pass through key decisions for extractDecisions() to process
  // This enables better decision extraction with options/rationale/tradeoffs
  if (data.keyDecisions && Array.isArray(data.keyDecisions)) {
    normalized._manualDecisions = data.keyDecisions;
  }
  
  console.log('   ✓ Transformed manual format to MCP-compatible structure');
  return normalized;
}

async function loadCollectedData() {
  // Priority 1: Data file provided via command line
  if (CONFIG.DATA_FILE) {
    try {
      const dataContent = await fs.readFile(CONFIG.DATA_FILE, 'utf-8');
      const rawData = JSON.parse(dataContent);
      console.log('   ✓ Loaded conversation data from file');
      
      // Normalize input format (handles both MCP and manual formats)
      const data = normalizeInputData(rawData);
      console.log(`   ✓ Loaded data from data file`);
      return data;
    } catch (error) {
      console.log(`   ⚠️  Failed to load data file: ${error.message}`);
      // Fall through to try OpenCode capture
    }
  }

  // Priority 2: Try to capture from OpenCode storage
  console.log('   🔍 Attempting OpenCode session capture...');
  try {
    const conversation = await opencodeCapture.captureConversation(20, CONFIG.PROJECT_ROOT);
    
    if (conversation && conversation.exchanges && conversation.exchanges.length > 0) {
      console.log(`   ✓ Captured ${conversation.exchanges.length} exchanges from OpenCode`);
      console.log(`   ✓ Session: ${conversation.sessionTitle || 'Unnamed'}`);
      
      // Transform OpenCode capture format to expected MCP format
      const data = transformOpenCodeCapture(conversation);
      return data;
    } else {
      console.log('   ⚠️  OpenCode capture returned empty data');
    }
  } catch (captureError) {
    console.log(`   ⚠️  OpenCode capture unavailable: ${captureError.message}`);
  }

  // Priority 3: Simulation fallback
  console.log('   ⚠️  Using fallback simulation mode');
  console.log('   ⚠️  OUTPUT WILL CONTAIN PLACEHOLDER DATA - NOT REAL SESSION CONTENT');
  console.log('   ℹ️  To save real context, AI must construct JSON and pass as argument:');
  console.log('      node generate-context.js /tmp/save-context-data.json');
  return null;
}

/**
 * Transform OpenCode capture format to MCP-compatible format
 * @param {Object} capture - Data from opencodeCapture.captureConversation()
 * @returns {Object} MCP-compatible format for generate-context.js
 */
function transformOpenCodeCapture(capture) {
  const { exchanges, toolCalls, metadata, sessionTitle } = capture;

  // Build user_prompts from exchanges
  const user_prompts = exchanges.map(ex => ({
    prompt: ex.userInput || '',
    timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString()
  }));

  // Build observations from exchanges and tool calls
  const observations = [];
  
  // Create observations from assistant responses
  // Filter out placeholder responses that don't contain meaningful content
  const placeholderPatterns = [
    '[response]',
    'Assistant processed request',
    'placeholder',
    'simulation mode'
  ];
  
  for (const ex of exchanges) {
    if (ex.assistantResponse) {
      const lowerResponse = ex.assistantResponse.toLowerCase();
      const isPlaceholder = placeholderPatterns.some(p => lowerResponse.includes(p.toLowerCase()));
      
      if (!isPlaceholder && ex.assistantResponse.length > 20) {
        observations.push({
          type: 'feature',
          title: ex.assistantResponse.substring(0, 80),
          narrative: ex.assistantResponse,
          timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString(),
          facts: [],
          files: []
        });
      }
    }
  }

  // Create observations from tool calls
  for (const tool of toolCalls || []) {
    const toolObs = {
      type: tool.tool === 'edit' || tool.tool === 'write' ? 'implementation' : 'observation',
      title: `Tool: ${tool.tool}`,
      narrative: tool.title || `Executed ${tool.tool}`,
      timestamp: tool.timestamp ? new Date(tool.timestamp).toISOString() : new Date().toISOString(),
      facts: [`Tool: ${tool.tool}`, `Status: ${tool.status}`],
      files: []
    };

    // Extract file path from tool input if available
    if (tool.input) {
      if (tool.input.filePath) {
        toolObs.files.push(tool.input.filePath);
      } else if (tool.input.file_path) {
        toolObs.files.push(tool.input.file_path);
      } else if (tool.input.path) {
        toolObs.files.push(tool.input.path);
      }
    }

    observations.push(toolObs);
  }

  // Build recent_context from first exchange
  const recent_context = exchanges.length > 0 ? [{
    request: exchanges[0].userInput || sessionTitle || 'OpenCode session',
    learning: exchanges[exchanges.length - 1]?.assistantResponse || ''
  }] : [];

  // Extract files modified from tool calls
  const FILES = [];
  const seenPaths = new Set();
  
  for (const tool of toolCalls || []) {
    if ((tool.tool === 'edit' || tool.tool === 'write') && tool.input) {
      const filePath = tool.input.filePath || tool.input.file_path || tool.input.path;
      if (filePath && !seenPaths.has(filePath)) {
        seenPaths.add(filePath);
        FILES.push({
          FILE_PATH: filePath,
          DESCRIPTION: tool.title || `${tool.tool === 'write' ? 'Created' : 'Modified'} during session`
        });
      }
    }
  }

  return {
    user_prompts,
    observations,
    recent_context,
    FILES,
    _source: 'opencode-capture',
    _sessionId: capture.sessionId,
    _capturedAt: capture.capturedAt
  };
}

// ───────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────

/**
 * Format timestamp with multiple output formats
 * @param {Date|string} date - Date to format (defaults to current time)
 * @param {string} format - Output format: 'iso' | 'readable' | 'date' | 'time' | 'filename' | 'date-dutch' | 'time-short'
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(date = new Date(), format = 'iso') {
  const d = date instanceof Date ? date : new Date(date);

  // Validate date
  if (isNaN(d.getTime())) {
    console.warn(`⚠️  Invalid date: ${date}, using current time`);
    return formatTimestamp(new Date(), format);
  }

  // Apply timezone offset (convert hours to milliseconds)
  const offsetMs = CONFIG.TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;
  const adjustedDate = new Date(d.getTime() + offsetMs);

  const isoString = adjustedDate.toISOString();
  const [datePart, timePart] = isoString.split('T');
  const timeWithoutMs = timePart.split('.')[0];

  switch (format) {
    case 'iso':
      return isoString.split('.')[0] + 'Z'; // 2025-11-08T14:30:00Z

    case 'readable':
      return `${datePart} @ ${timeWithoutMs}`; // 2025-11-08 @ 14:30:00

    case 'date':
      return datePart; // 2025-11-08

    case 'date-dutch': {
      // Dutch format: DD-MM-YY
      const [year, month, day] = datePart.split('-');
      const shortYear = year.slice(-2); // Last 2 digits of year
      return `${day}-${month}-${shortYear}`; // 09-11-25
    }

    case 'time':
      return timeWithoutMs; // 14:30:00

    case 'time-short': {
      // Short time format: HH-MM (no seconds)
      const [hours, minutes] = timeWithoutMs.split(':');
      return `${hours}-${minutes}`; // 14-30
    }

    case 'filename':
      return `${datePart}_${timeWithoutMs.replace(/:/g, '-')}`; // 2025-11-08_14-30-00

    default:
      console.warn(`⚠️  Unknown format "${format}", using ISO`);
      return isoString;
  }
}

function truncateToolOutput(output, maxLines = CONFIG.MAX_TOOL_OUTPUT_LINES) {
  if (!output) return '';

  const lines = output.split('\n');

  if (lines.length <= maxLines) {
    return output;
  }

  const firstLines = lines.slice(0, CONFIG.TRUNCATE_FIRST_LINES);
  const lastLines = lines.slice(-CONFIG.TRUNCATE_LAST_LINES);
  const truncatedCount = lines.length - CONFIG.TRUNCATE_FIRST_LINES - CONFIG.TRUNCATE_LAST_LINES;

  return [
    ...firstLines,
    '',
    `... [Truncated: ${truncatedCount} lines] ...`,
    '',
    ...lastLines
  ].join('\n');
}

/**
 * V8.2: Normalize file paths to clean relative format
 * @param {string} filePath - Raw file path (absolute or relative)
 * @param {string} projectRoot - Project root directory
 * @returns {string} Clean relative path
 */
function toRelativePath(filePath, projectRoot = CONFIG.PROJECT_ROOT) {
  if (!filePath) return '';
  let cleaned = filePath;

  // Strip project root if absolute
  if (cleaned.startsWith(projectRoot)) {
    cleaned = cleaned.slice(projectRoot.length);
    // Remove leading slash
    if (cleaned.startsWith('/')) cleaned = cleaned.slice(1);
  }

  // Strip any leading ./
  cleaned = cleaned.replace(/^\.\//, '');

  // For very long paths (>60 chars), abbreviate middle
  if (cleaned.length > 60) {
    const parts = cleaned.split('/');
    if (parts.length > 3) {
      return `${parts[0]}/.../${parts.slice(-2).join('/')}`;
    }
  }

  return cleaned;
}

/**
 * V8.3: Validate if a description is meaningful (not garbage)
 * @param {string} description - File description to validate
 * @returns {boolean} True if description is valid and meaningful
 */
function isDescriptionValid(description) {
  if (!description || description.length < 8) return false;

  const garbagePatterns = [
    /^#+\s/,                            // Markdown headers: ## Foo
    /^[-*]\s/,                          // List bullets: - foo, * bar
    /\s(?:and|or|to|the)\s*$/i,         // Incomplete: "Fixed the"
    /^(?:modified?|updated?)\s+\w+$/i,  // Generic: "Modified file"
    /^filtering\s+(?:pipeline|system)$/i, // Generic fallback
    /^And\s+[`'"]?/i,                   // Fragment: "And `foo"
    /^Modified during session$/i,       // Default fallback
    /\[PLACEHOLDER\]/i,                 // Unfilled template
  ];

  return !garbagePatterns.some(p => p.test(description));
}

/**
 * V8.3: Clean description text for display
 * @param {string} desc - Raw description
 * @returns {string} Cleaned description
 */
function cleanDescription(desc) {
  if (!desc) return '';
  let cleaned = desc.trim();

  // Remove markdown formatting
  cleaned = cleaned.replace(/^#+\s+/, '');        // ## headers
  cleaned = cleaned.replace(/^[-*]\s+/, '');      // - bullets
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');  // `backticks`
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1'); // **bold**

  // Remove trailing punctuation
  cleaned = cleaned.replace(/[.,;:]+$/, '');

  // Truncate to max 60 chars
  if (cleaned.length > 60) {
    cleaned = cleaned.substring(0, 57) + '...';
  }

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Detect tool calls from conversation facts with strict pattern matching
 * Avoids false positives from prose text like "Read more about..."
 * @param {string} text - Text to analyze for tool calls
 * @returns {Object|null} { tool: string, confidence: string } or null
 */
function detectToolCall(text) {
  if (!text || typeof text !== 'string') return null;

  // Pattern 1: Explicit tool marker "Tool: Read"
  const explicitMatch = text.match(/\bTool:\s*(\w+)/i);
  if (explicitMatch) {
    return { tool: explicitMatch[1], confidence: 'high' };
  }

  // Pattern 2: Tool call syntax "Read(" at start or after whitespace
  const callSyntaxMatch = text.match(/^\s*(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch|Skill)\s*\(/);
  if (callSyntaxMatch) {
    return { tool: callSyntaxMatch[1], confidence: 'high' };
  }

  // Pattern 3: Using tool phrase "using Read tool"
  const usingToolMatch = text.match(/\busing\s+(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch)\s+tool\b/i);
  if (usingToolMatch) {
    return { tool: usingToolMatch[1], confidence: 'medium' };
  }

  // Pattern 4: Called tool phrase "called Read(...)"
  const calledMatch = text.match(/\bcalled?\s+(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch)\s*\(/i);
  if (calledMatch) {
    return { tool: calledMatch[1], confidence: 'medium' };
  }

  return null;
}

/**
 * Check if detected tool match is actually prose context (not a real tool call)
 * @param {string} text - Full text being analyzed
 * @param {number} matchStartIndex - Index where match was found
 * @returns {boolean} True if this is prose context, false if legitimate tool call
 */
function isProseContext(text, matchStartIndex) {
  if (matchStartIndex < 0) return false;

  const before = text.substring(Math.max(0, matchStartIndex - 20), matchStartIndex);
  const after = text.substring(matchStartIndex, Math.min(text.length, matchStartIndex + 50));

  // Check for sentence boundaries around match
  const sentenceBefore = /[.!?]\s*$/;
  const lowercaseAfter = /^[a-z]/; // Tool names should be capitalized

  if (sentenceBefore.test(before) && lowercaseAfter.test(after)) {
    return true;
  }

  // Check for common prose patterns: "read more", "read about", "to read"
  const contextWindow = before.substring(Math.max(0, before.length - 10)) + after.substring(0, 30);
  const prosePatterns = [
    /\bread\s+more\b/i,
    /\bread\s+about\b/i,
    /\bread\s+the\b/i,
    /\bto\s+read\b/i,
    /\byou\s+should\s+read\b/i
  ];

  for (const pattern of prosePatterns) {
    if (pattern.test(contextWindow)) {
      return true;
    }
  }

  return false;
}

function summarizeExchange(userMessage, assistantResponse, toolCalls = []) {
  // V6.4: Create intelligent 2-3 sentence summary with better truncation
  // Extract first complete sentence if possible, otherwise use 200 chars
  let userIntent;
  if (userMessage.length <= 200) {
    userIntent = userMessage;
  } else {
    // Try to find a sentence boundary
    const sentenceEnd = userMessage.substring(0, 200).match(/^(.+?[.!?])\s/);
    userIntent = sentenceEnd ? sentenceEnd[1] : userMessage.substring(0, 200) + '...';
  }

  const mainTools = toolCalls.slice(0, 3).map(t => t.tool).join(', ');
  const toolSummary = toolCalls.length > 0
    ? ` Used tools: ${mainTools}${toolCalls.length > 3 ? ` and ${toolCalls.length - 3} more` : ''}.`
    : '';

  // V6.4: Extract key outcome from assistant response (first 2 sentences or 300 chars)
  const sentences = assistantResponse.match(/[^.!?]+[.!?]+/g) || [];
  const outcome = sentences.length > 0
    ? sentences.slice(0, 2).join(' ').trim()
    : assistantResponse.substring(0, 300);

  return {
    userIntent,
    outcome: outcome + (outcome.length < assistantResponse.length ? '...' : ''),
    toolSummary,
    fullSummary: `${userIntent} → ${outcome}${toolSummary}`
  };
}

function classifyConversationPhase(toolCalls, messageContent) {
  // Detect phase based on tools used and content
  const tools = toolCalls.map(t => t.tool?.toLowerCase() || '');
  const content = messageContent.toLowerCase();

  // Research phase: mostly reads, greps, globs
  if (tools.some(t => ['read', 'grep', 'glob', 'webfetch', 'websearch'].includes(t))) {
    return 'Research';
  }

  // Planning phase: asking questions, discussing approaches
  if (content.includes('plan') || content.includes('approach') || content.includes('should we')) {
    return 'Planning';
  }

  // Implementation phase: edits, writes
  if (tools.some(t => ['edit', 'write', 'bash'].includes(t))) {
    return 'Implementation';
  }

  // Debugging phase: error keywords
  if (content.includes('error') || content.includes('fix') || content.includes('debug')) {
    return 'Debugging';
  }

  // Verification phase: testing keywords
  if (content.includes('test') || content.includes('verify') || content.includes('check')) {
    return 'Verification';
  }

  return 'Discussion';
}

function extractKeyArtifacts(messages) {
  const artifacts = {
    filesCreated: [],
    filesModified: [],
    commandsExecuted: [],
    errorsEncountered: []
  };

  for (const msg of messages) {
    if (!msg.tool_calls) continue;

    for (const tool of msg.tool_calls) {
      const toolName = tool.tool?.toLowerCase() || '';

      if (toolName === 'write') {
        artifacts.filesCreated.push({
          path: tool.file_path || 'unknown',
          timestamp: msg.timestamp
        });
      } else if (toolName === 'edit') {
        artifacts.filesModified.push({
          path: tool.file_path || 'unknown',
          timestamp: msg.timestamp
        });
      } else if (toolName === 'bash') {
        artifacts.commandsExecuted.push({
          command: tool.command || 'unknown',
          timestamp: msg.timestamp
        });
      }

      // Check for errors in tool results
      if (tool.result && typeof tool.result === 'string') {
        if (tool.result.includes('Error:') || tool.result.includes('error:')) {
          artifacts.errorsEncountered.push({
            error: tool.result.substring(0, 200),
            timestamp: msg.timestamp
          });
        }
      }
    }
  }

  return artifacts;
}

function validateDataStructure(data) {
  // Ensure all required boolean flags are set
  const validated = { ...data };

  // Set boolean flags based on data presence
  if (validated.CODE_BLOCKS) {
    validated.HAS_CODE_BLOCKS = Array.isArray(validated.CODE_BLOCKS) && validated.CODE_BLOCKS.length > 0;
  }

  if (validated.PROS) {
    // Ensure PROS is array of objects
    if (!Array.isArray(validated.PROS)) {
      validated.PROS = validated.PROS ? [{ PRO: String(validated.PROS) }] : [];
    } else if (validated.PROS.length > 0 && typeof validated.PROS[0] === 'string') {
      validated.PROS = validated.PROS.map(p => ({ PRO: p }));
    }
  }

  if (validated.CONS) {
    // Ensure CONS is array of objects
    if (!Array.isArray(validated.CONS)) {
      validated.CONS = validated.CONS ? [{ CON: String(validated.CONS) }] : [];
    } else if (validated.CONS.length > 0 && typeof validated.CONS[0] === 'string') {
      validated.CONS = validated.CONS.map(c => ({ CON: c }));
    }
  }

  // Only set HAS_PROS_CONS if arrays have content
  if (validated.PROS && Array.isArray(validated.PROS) && validated.PROS.length > 0) {
    validated.HAS_PROS_CONS = true;
  } else if (validated.CONS && Array.isArray(validated.CONS) && validated.CONS.length > 0) {
    validated.HAS_PROS_CONS = true;
  } else {
    validated.HAS_PROS_CONS = false;
  }

  if (validated.DESCRIPTION) {
    validated.HAS_DESCRIPTION = true;
  }

  if (validated.NOTES) {
    validated.HAS_NOTES = Array.isArray(validated.NOTES) && validated.NOTES.length > 0;
  }

  if (validated.RELATED_FILES) {
    validated.HAS_RELATED_FILES = Array.isArray(validated.RELATED_FILES) && validated.RELATED_FILES.length > 0;
  }

  if (validated.RESULT_PREVIEW) {
    validated.HAS_RESULT = true;
  }

  if (validated.DECISION_TREE) {
    validated.HAS_DECISION_TREE = true;
  }

  if (validated.CAVEATS) {
    validated.HAS_CAVEATS = Array.isArray(validated.CAVEATS) && validated.CAVEATS.length > 0;
  }

  if (validated.FOLLOWUP) {
    validated.HAS_FOLLOWUP = Array.isArray(validated.FOLLOWUP) && validated.FOLLOWUP.length > 0;
  }

  // Add missing boolean flags
  if (validated.OPTIONS) {
    validated.HAS_OPTIONS = Array.isArray(validated.OPTIONS) && validated.OPTIONS.length > 0;
  }

  if (validated.EVIDENCE) {
    validated.HAS_EVIDENCE = Array.isArray(validated.EVIDENCE) && validated.EVIDENCE.length > 0;
  }

  if (validated.PHASES) {
    validated.HAS_PHASES = Array.isArray(validated.PHASES) && validated.PHASES.length > 0;
  }

  if (validated.MESSAGES) {
    validated.HAS_MESSAGES = Array.isArray(validated.MESSAGES) && validated.MESSAGES.length > 0;
  }

  // Recursively validate nested arrays
  for (const key in validated) {
    if (Array.isArray(validated[key])) {
      validated[key] = validated[key].map(item => {
        if (typeof item === 'object' && item !== null) {
          return validateDataStructure(item);
        }
        return item;
      });
    }
  }

  return validated;
}

// ───────────────────────────────────────────────────────────────
// MAIN WORKFLOW
// ───────────────────────────────────────────────────────────────

async function main() {
  try {
    console.log('🚀 Starting memory skill...\n');

    // Step 1: Load collected data
    console.log('📥 Step 1: Loading collected data...');
    const collectedData = await loadCollectedData();
    console.log(`   ✓ Loaded data from ${collectedData ? 'data file' : 'simulation'}\n`);

    // Step 2: Detect spec folder with context alignment
    console.log('📁 Step 2: Detecting spec folder...');
    const specFolder = await detectSpecFolder(collectedData);
    // Use relative path from specs/ to preserve nested structure (e.g., "005-memory/008-anchor-enforcement")
    const specsDir = path.join(CONFIG.PROJECT_ROOT, 'specs');
    const specFolderName = path.relative(specsDir, specFolder);
    console.log(`   ✓ Using: ${specFolder}\n`);

    // Step 3: Setup context directory
    console.log('📂 Step 3: Setting up context directory...');
    const contextDir = await setupContextDirectory(specFolder);
    console.log(`   ✓ Created: ${contextDir}\n`);

    // Steps 4-7: Parallel data extraction (optimized for 50-60% faster execution)
    console.log('🔄 Steps 4-7: Extracting data (parallel execution)...\n');

    const [sessionData, conversations, decisions, diagrams, workflowData] = await Promise.all([
      (async () => {
        console.log('   📋 Collecting session data...');
        const result = await collectSessionData(collectedData, specFolderName);
        console.log('   ✓ Session data collected');
        return result;
      })(),
      (async () => {
        console.log('   💬 Extracting conversations...');
        const result = await extractConversations(collectedData);
        console.log(`   ✓ Found ${result.MESSAGES.length} messages`);
        return result;
      })(),
      (async () => {
        console.log('   🧠 Extracting decisions...');
        const result = await extractDecisions(collectedData);
        console.log(`   ✓ Found ${result.DECISIONS.length} decisions`);
        return result;
      })(),
      (async () => {
        console.log('   📊 Extracting diagrams...');
        const result = await extractDiagrams(collectedData);
        console.log(`   ✓ Found ${result.DIAGRAMS.length} diagrams`);
        return result;
      })(),
      (async () => {
        console.log('   🔀 Generating workflow flowchart...');
        const phases = extractPhasesFromData(collectedData);
        const flowchart = flowchartGen.generateWorkflowFlowchart(phases);
        const patternType = flowchartGen.detectWorkflowPattern(phases);
        const phaseDetails = flowchartGen.buildPhaseDetails(phases);

        // Extract features and use cases
        const features = flowchartGen.extractFlowchartFeatures(phases, patternType);
        const useCases = flowchartGen.getPatternUseCases(patternType);

        // Generate use case title from cached spec folder name
        const useCaseTitle = specFolderName.replace(/^\d+-/, '').replace(/-/g, ' ');

        console.log(`   ✓ Workflow data generated (${patternType}) - flowchart disabled for cleaner output`);
        return {
          WORKFLOW_FLOWCHART: flowchart,
          HAS_WORKFLOW_DIAGRAM: false, // Disabled: bullets-only mode per user preference
          PATTERN_TYPE: patternType.charAt(0).toUpperCase() + patternType.slice(1),
          PATTERN_LINEAR: patternType === 'linear',
          PATTERN_PARALLEL: patternType === 'parallel',
          PHASES: phaseDetails,
          HAS_PHASES: phaseDetails.length > 0,
          USE_CASE_TITLE: useCaseTitle,
          FEATURES: features,
          USE_CASES: useCases
        };
      })()
    ]);

    console.log('\n   ✅ All extraction complete (parallel execution)\n');

    // Step 7.5: Generate semantic implementation summary
    console.log('🧠 Step 7.5: Generating semantic summary...');

    // Get RAW user prompts BEFORE any filtering for semantic analysis
    // Using unfiltered data preserves context for better classification
    const rawUserPrompts = collectedData?.user_prompts || [];
    const allMessages = rawUserPrompts.map(m => ({
      prompt: m.prompt || '',
      content: m.prompt || '',
      timestamp: m.timestamp
    }));

    // Generate implementation summary with semantic understanding
    const implementationSummary = generateImplementationSummary(
      allMessages,
      collectedData?.observations || []
    );

    // Enhance FILES with semantic descriptions from the summarizer
    const semanticFileChanges = extractFileChanges(allMessages, collectedData?.observations || []);

    // V5.2: Helper with null safety - Extract basename from path for exact matching
    const getBasename = (p) => {
      if (!p || typeof p !== 'string') return '';
      return p.split('/').pop() || '';
    };

    // Merge semantic file descriptions into sessionData.FILES
    // FIX v4: Use UNIQUE basename matching to prevent collision with same-named files
    const enhancedFiles = sessionData.FILES.map(file => {
      const filePath = file.FILE_PATH;
      const fileBasename = getBasename(filePath);

      // Priority 1: Try EXACT full path match first
      if (semanticFileChanges.has(filePath)) {
        const info = semanticFileChanges.get(filePath);
        return {
          FILE_PATH: file.FILE_PATH,
          DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
          ACTION: info.action === 'created' ? 'Created' : 'Modified'
        };
      }

      // Priority 2: Try basename match ONLY if unique
      let matchCount = 0;
      let basenameMatch = null;

      for (const [path, info] of semanticFileChanges) {
        const pathBasename = getBasename(path);
        if (pathBasename === fileBasename) {
          matchCount++;
          basenameMatch = { path, info };
        }
      }

      // P3.1: Log collision detection for debugging
      if (matchCount > 1) {
        console.warn(`   ⚠️  Multiple files with basename '${fileBasename}' - using default description`);
      }

      // Only apply basename match if it's UNIQUE (no collision)
      if (matchCount === 1 && basenameMatch) {
        const info = basenameMatch.info;
        return {
          FILE_PATH: file.FILE_PATH,
          DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
          ACTION: info.action === 'created' ? 'Created' : 'Modified'
        };
      }

      return file;
    });

    // Build implementation summary markdown
    const IMPLEMENTATION_SUMMARY = formatSummaryAsMarkdown(implementationSummary);
    const HAS_IMPLEMENTATION_SUMMARY = implementationSummary.filesCreated.length > 0 ||
                                       implementationSummary.filesModified.length > 0 ||
                                       implementationSummary.decisions.length > 0;

    console.log(`   ✓ Generated summary: ${implementationSummary.filesCreated.length} created, ${implementationSummary.filesModified.length} modified, ${implementationSummary.decisions.length} decisions\n`);

    // Step 8: Populate templates
    console.log('📝 Step 8: Populating template...');

    // Build filename: {date}_{time}__{folder-name}.md
    // Dutch format: DD-MM-YY_HH-MM (2-digit year, no seconds)
    // Example: 09-11-25_07-52__skill-refinement.md
    // V10.1: Use basename only for filename (handle nested paths like 005-memory/008-anchor)
    const specFolderBasename = path.basename(sessionData.SPEC_FOLDER);
    const folderName = specFolderBasename.replace(/^\d+-/, '');
    const contextFilename = `${sessionData.DATE}_${sessionData.TIME}__${folderName}.md`;

    // Extract key topics from summary and decisions for YAML metadata
    const keyTopics = extractKeyTopics(sessionData.SUMMARY, decisions.DECISIONS);
    
    // Map FILES to KEY_FILES format for YAML metadata
    const keyFiles = enhancedFiles.map(f => ({ FILE_PATH: f.FILE_PATH }));

    const files = {
      [contextFilename]: await populateTemplate('context', {
        ...sessionData,
        ...conversations,
        ...workflowData,
        // Override FILES with enhanced semantic descriptions
        FILES: enhancedFiles,
        MESSAGE_COUNT: conversations.MESSAGES.length,
        DECISION_COUNT: decisions.DECISIONS.length,
        DIAGRAM_COUNT: diagrams.DIAGRAMS.length,
        PHASE_COUNT: conversations.PHASE_COUNT,
        DECISIONS: decisions.DECISIONS,
        HIGH_CONFIDENCE_COUNT: decisions.HIGH_CONFIDENCE_COUNT,
        MEDIUM_CONFIDENCE_COUNT: decisions.MEDIUM_CONFIDENCE_COUNT,
        LOW_CONFIDENCE_COUNT: decisions.LOW_CONFIDENCE_COUNT,
        FOLLOWUP_COUNT: decisions.FOLLOWUP_COUNT,
        HAS_AUTO_GENERATED: diagrams.HAS_AUTO_GENERATED,
        FLOW_TYPE: diagrams.FLOW_TYPE,
        AUTO_CONVERSATION_FLOWCHART: diagrams.AUTO_CONVERSATION_FLOWCHART,
        AUTO_DECISION_TREES: diagrams.AUTO_DECISION_TREES,
        DIAGRAMS: diagrams.DIAGRAMS,
        // Semantic implementation summary
        IMPLEMENTATION_SUMMARY: IMPLEMENTATION_SUMMARY,
        HAS_IMPLEMENTATION_SUMMARY: HAS_IMPLEMENTATION_SUMMARY,
        IMPL_TASK: implementationSummary.task,
        IMPL_SOLUTION: implementationSummary.solution,
        IMPL_FILES_CREATED: implementationSummary.filesCreated,
        IMPL_FILES_MODIFIED: implementationSummary.filesModified,
        IMPL_DECISIONS: implementationSummary.decisions,
        IMPL_OUTCOMES: implementationSummary.outcomes,
        HAS_IMPL_FILES_CREATED: implementationSummary.filesCreated.length > 0,
        HAS_IMPL_FILES_MODIFIED: implementationSummary.filesModified.length > 0,
        HAS_IMPL_DECISIONS: implementationSummary.decisions.length > 0,
        HAS_IMPL_OUTCOMES: implementationSummary.outcomes.length > 0 && implementationSummary.outcomes[0] !== 'Session completed',
        // YAML Metadata fields (v11.2)
        TOPICS: keyTopics,
        HAS_KEY_TOPICS: keyTopics.length > 0,
        KEY_FILES: keyFiles,
        RELATED_SESSIONS: [],  // Empty by default, populated by cross-session analysis
        PARENT_SPEC: sessionData.SPEC_FOLDER || '',
        CHILD_SESSIONS: [],
        EMBEDDING_MODEL: MODEL_NAME || 'text-embedding-3-small',
        EMBEDDING_VERSION: '1.0',
        CHUNK_COUNT: 1  // Single document, no chunking
      }),
      'metadata.json': JSON.stringify({
        timestamp: `${sessionData.DATE} ${sessionData.TIME}`,
        messageCount: sessionData.MESSAGE_COUNT,
        decisionCount: decisions.DECISIONS.length,
        diagramCount: diagrams.DIAGRAMS.length,
        skillVersion: CONFIG.SKILL_VERSION,
        autoTriggered: shouldAutoSave(sessionData.MESSAGE_COUNT),
        // Content filtering stats
        filtering: getFilterStats(),
        // Semantic summary stats
        semanticSummary: {
          task: implementationSummary.task.substring(0, 100),
          filesCreated: implementationSummary.filesCreated.length,
          filesModified: implementationSummary.filesModified.length,
          decisions: implementationSummary.decisions.length,
          messageStats: implementationSummary.messageStats
        },
        // Semantic memory v10.0 - embedding metadata (CHK016)
        embedding: {
          status: 'pending', // Updated after Step 11 completes
          model: MODEL_NAME,
          dimensions: EMBEDDING_DIM
        }
      }, null, 2)
    };

    // Add low-quality warning header if quality score is below threshold
    const filterStats = getFilterStats();
    if (filterStats.qualityScore < 20) {
      const warningHeader = `> **Note:** This session had limited actionable content (quality score: ${filterStats.qualityScore}/100). ${filterStats.noiseFiltered} noise entries and ${filterStats.duplicatesRemoved} duplicates were filtered.\n\n`;
      files[contextFilename] = warningHeader + files[contextFilename];
      console.log(`   ⚠️  Low quality session (${filterStats.qualityScore}/100) - warning header added`);
    }

    console.log(`   ✓ Template populated (quality: ${filterStats.qualityScore}/100)\n`);

    // Step 9: Write files with atomic writes and rollback on failure
    console.log('💾 Step 9: Writing files...');

    // Validate files for leaked placeholders before writing
    function detectLeakedPlaceholders(content, filename) {
      // Check for complete placeholders
      const leaked = content.match(/\{\{[A-Z_]+\}\}/g);
      if (leaked) {
        console.warn(`⚠️  Leaked placeholders detected in ${filename}: ${leaked.join(', ')}`);
        console.warn(`   Context around leak: ${content.substring(content.indexOf(leaked[0]) - 100, content.indexOf(leaked[0]) + 100)}`);
        throw new Error(`❌ Leaked placeholders in ${filename}: ${leaked.join(', ')}`);
      }

      // Check for partial/malformed placeholders
      const partialLeaked = content.match(/\{\{[^}]*$/g);
      if (partialLeaked) {
        console.warn(`⚠️  Partial placeholder detected in ${filename}: ${partialLeaked.join(', ')}`);
        throw new Error(`❌ Malformed placeholder in ${filename}`);
      }

      // P2-027: Re-enable template placeholder validation with warning (not error)
      // Check for unclosed conditional blocks (both {{#...}} and {{^...}} need {{/...}})
      const openBlocks = (content.match(/\{\{[#^][A-Z_]+\}\}/g) || []);
      const closeBlocks = (content.match(/\{\{\/[A-Z_]+\}\}/g) || []);
      if (openBlocks.length !== closeBlocks.length) {
        console.warn(`⚠️  Template has ${openBlocks.length} open blocks but ${closeBlocks.length} close blocks`);
      }
    }

    const writtenFiles = [];
    let writeError = null;

    try {
      for (const [filename, content] of Object.entries(files)) {
        // Validate content before writing
        detectLeakedPlaceholders(content, filename);

        const filePath = path.join(contextDir, filename);

        try {
          // Write to temp file first (atomic write pattern)
          const tempPath = filePath + '.tmp';
          await fs.writeFile(tempPath, content, 'utf-8');

          // Verify write succeeded by checking file size
          const stat = await fs.stat(tempPath);
          const expectedSize = Buffer.byteLength(content, 'utf-8');
          if (stat.size !== expectedSize) {
            throw new Error(`Write verification failed: size mismatch (${stat.size} vs ${expectedSize} bytes)`);
          }

          // Atomic rename (replaces existing file if present)
          await fs.rename(tempPath, filePath);

          writtenFiles.push(filename);
          const lines = content.split('\n').length;
          console.log(`   ✓ ${filename} (${lines} lines)`);

        } catch (fileError) {
          writeError = new Error(`Failed to write ${filename}: ${fileError.message}`);
          console.error(`   ✗ ${filename}: ${fileError.message}`);
          throw writeError;
        }
      }
    } catch (error) {
      // Rollback all written files on any failure
      if (writtenFiles.length > 0) {
        console.log('\n⚠️  Error occurred during file writing. Rolling back...');

        for (const filename of writtenFiles) {
          try {
            const filePath = path.join(contextDir, filename);
            await fs.unlink(filePath);
            console.log(`   ✓ Rolled back ${filename}`);
          } catch (unlinkError) {
            console.warn(`   ⚠️  Could not remove ${filename}: ${unlinkError.message}`);
          }
        }

        console.log('\n❌ All changes rolled back due to write failure.\n');
      }

      throw error;
    }

    console.log();

    // Step 9.5: REMOVED in V13.0 - State is now embedded in memory files
    // (STATE.md was separate file, now Project State Snapshot is in memory file header)
    // Previously: await updateStateFile(specFolder, sessionData.QUICK_SUMMARY || 'Context saved');
    console.log('📋 Step 9.5: State embedded in memory file (V13.0)');

    // Step 10: Success confirmation
    console.log('✅ Context saved successfully!\n');
    console.log(`Location: ${contextDir}\n`);
    console.log('Files created:');
    for (const [filename, content] of Object.entries(files)) {
      const lines = content.split('\n').length;
      console.log(`  • ${filename} (${lines} lines)`);
    }
    console.log();
    console.log('Summary:');
    console.log(`  • ${conversations.MESSAGES.length} messages captured`);
    console.log(`  • ${decisions.DECISIONS.length} key decisions documented`);
    console.log(`  • ${diagrams.DIAGRAMS.length} diagrams preserved`);
    console.log(`  • Session duration: ${sessionData.DURATION}\n`);

    // ─────────────────────────────────────────────────────────────
    // Step 11: Semantic Memory Indexing (v10.0)
    // ─────────────────────────────────────────────────────────────
    console.log('🧠 Step 11: Indexing semantic memory...');

    try {
      const embeddingStart = Date.now();

      // Get the context content for embedding
      const contextContent = files[contextFilename];
      const filePath = path.join(contextDir, contextFilename);

      // Generate embedding from the context content
      const embedding = await generateEmbedding(contextContent);

      if (embedding) {
        const embeddingTime = Date.now() - embeddingStart;

        // Extract title from the first heading or use filename
        const titleMatch = contextContent.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : contextFilename.replace('.md', '');

        // Extract trigger phrases using TF-IDF + N-gram algorithm (FR-012)
        let triggerPhrases = [];
        try {
          triggerPhrases = extractTriggerPhrases(contextContent);
          
          // Merge manual trigger phrases if provided (from normalizeInputData)
          if (collectedData && collectedData._manualTriggerPhrases) {
            const manualPhrases = collectedData._manualTriggerPhrases;
            // Deduplicate: add manual phrases that aren't already extracted
            const existingLower = new Set(triggerPhrases.map(p => p.toLowerCase()));
            for (const phrase of manualPhrases) {
              if (!existingLower.has(phrase.toLowerCase())) {
                triggerPhrases.push(phrase);
              }
            }
            console.log(`   ✓ Extracted ${triggerPhrases.length} trigger phrases (${manualPhrases.length} manual)`);
          } else {
            console.log(`   ✓ Extracted ${triggerPhrases.length} trigger phrases`);
          }
        } catch (triggerError) {
          console.warn(`   ⚠️  Trigger extraction failed: ${triggerError.message}`);
          // Fall back to manual phrases if extraction fails
          if (collectedData && collectedData._manualTriggerPhrases) {
            triggerPhrases = collectedData._manualTriggerPhrases;
            console.log(`   ✓ Using ${triggerPhrases.length} manual trigger phrases`);
          }
        }

        // Calculate importance weight based on content characteristics (FR-013)
        const contentLength = contextContent.length;
        const anchorCount = (contextContent.match(/<!-- (?:ANCHOR|anchor):/gi) || []).length;
        const lengthFactor = Math.min(contentLength / 10000, 1) * 0.3; // Max 0.3
        const anchorFactor = Math.min(anchorCount / 10, 1) * 0.3; // Max 0.3
        const recencyFactor = 0.2; // New memory = max recency
        const importanceWeight = Math.round((lengthFactor + anchorFactor + recencyFactor + 0.2) * 100) / 100;

        // Index the memory
        const memoryId = vectorIndex.indexMemory({
          specFolder: specFolderName,
          filePath: filePath,
          anchorId: null, // Full document, no specific anchor
          title: title,
          triggerPhrases: triggerPhrases,
          importanceWeight: importanceWeight,
          embedding: embedding
        });

        console.log(`   ✓ Embedding generated in ${embeddingTime}ms`);
        console.log(`   ✓ Indexed as memory #${memoryId} (${EMBEDDING_DIM} dimensions)`);

        // Update metadata.json with successful embedding info (CHK016)
        try {
          const metadataPath = path.join(contextDir, 'metadata.json');
          const metadataContent = await fs.readFile(metadataPath, 'utf-8');
          const metadata = JSON.parse(metadataContent);
          metadata.embedding = {
            status: 'indexed',
            model: MODEL_NAME,
            dimensions: EMBEDDING_DIM,
            memoryId: memoryId,
            generatedAt: new Date().toISOString(),
            triggerPhrases: triggerPhrases.slice(0, 5), // Top 5 for reference
            importanceWeight: importanceWeight
          };
          await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
          console.log(`   ✓ Updated metadata.json with embedding info`);
        } catch (metaError) {
          console.warn(`   ⚠️  Could not update metadata.json: ${metaError.message}`);
        }

        // Performance warning if slow
        if (embeddingTime > 500) {
          console.warn(`   ⚠️  Embedding took ${embeddingTime}ms (target <500ms)`);
        }
      } else {
        console.warn('   ⚠️  Embedding generation returned null - skipping indexing');
      }
    } catch (embeddingError) {
      // Graceful degradation - save succeeded, embedding failed (T028)
      console.warn(`   ⚠️  Embedding failed: ${embeddingError.message}`);
      console.warn('   ℹ️  Context saved successfully without semantic indexing');
      console.warn('   ℹ️  Run "npm run rebuild" to retry indexing later');
    }

    // ─────────────────────────────────────────────────────────────
    // Step 12: Opportunistic Retry (v10.0 - T037)
    // ─────────────────────────────────────────────────────────────
    // Process up to 3 pending/retry embeddings opportunistically
    try {
      const retryStats = retryManager.getRetryStats();
      if (retryStats.queueSize > 0) {
        console.log('🔄 Step 12: Processing retry queue...');

        const results = await retryManager.processRetryQueue(3);

        if (results.processed > 0) {
          console.log(`   ✓ Processed ${results.processed} pending embeddings`);
          console.log(`   ✓ Succeeded: ${results.succeeded}, Failed: ${results.failed}`);
        }
      }
    } catch (retryError) {
      // Don't fail the save if retry processing fails
      console.warn(`   ⚠️  Retry processing error: ${retryError.message}`);
    }

    console.log();

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// ───────────────────────────────────────────────────────────────
// STATE.MD UPDATE (Phase 2 - SpecKit Integration)
// ───────────────────────────────────────────────────────────────

/**
 * Update STATE.md in the spec folder when saving context
 * Lightweight integration that updates:
 * - Last Action timestamp
 * - File Progress (scans which spec files exist)
 * - Session History (appends new entry)
 * 
 * @param {string} specFolderPath - Absolute path to the spec folder
 * @param {string} sessionSummary - Brief description of what was done
 * @returns {Promise<boolean>} True if update succeeded, false otherwise
 */
async function updateStateFile(specFolderPath, sessionSummary) {
  const stateFilePath = path.join(specFolderPath, 'STATE.md');
  
  // Check if STATE.md exists
  if (!fsSync.existsSync(stateFilePath)) {
    console.log('   ℹ️  STATE.md not found - skipping state update');
    return false;
  }
  
  try {
    // Read current STATE.md content
    let content = await fs.readFile(stateFilePath, 'utf-8');
    const now = new Date();
    const timestamp = formatTimestamp(now, 'readable');
    const dateOnly = formatTimestamp(now, 'date');
    
    // 1. Update "Last Action" in Current Position table
    // Pattern: | **Last Action** | [anything] |
    content = content.replace(
      /(\| \*\*Last Action\*\* \|)[^|]+\|/,
      `$1 ${timestamp} - ${sessionSummary.substring(0, 50)} |`
    );
    
    // 2. Scan and update File Progress table
    const specFiles = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md'];
    for (const fileName of specFiles) {
      const filePath = path.join(specFolderPath, fileName);
      const exists = fsSync.existsSync(filePath);
      const status = exists ? 'COMPLETE' : 'PENDING';
      const note = exists ? 'File exists' : 'Not created';
      
      // Pattern: | spec.md | [STATUS] | [note] |
      const filePattern = new RegExp(`(\\| ${fileName} \\|)[^|]+\\|[^|]+\\|`);
      if (filePattern.test(content)) {
        content = content.replace(filePattern, `$1 ${status} | ${note} |`);
      }
    }
    
    // 3. Append to Session History table
    // Find the Session History section and append a new row
    const historyPattern = /(\| Date \| Action \| Outcome \|\n\|[-|]+\|[-|]+\|[-|]+\|)/;
    const historyMatch = content.match(historyPattern);
    if (historyMatch) {
      // Find existing history entries to append after them
      const historySection = content.indexOf(historyMatch[0]);
      const afterHeader = historySection + historyMatch[0].length;
      
      // Find where history entries end (next --- or ## section)
      let endOfHistory = content.indexOf('\n---', afterHeader);
      if (endOfHistory === -1) endOfHistory = content.indexOf('\n##', afterHeader);
      if (endOfHistory === -1) endOfHistory = content.length;
      
      // Create new history entry
      const newEntry = `\n| ${dateOnly} | Context saved | ${sessionSummary.substring(0, 40)} |`;
      
      // Insert new entry before the end marker
      content = content.slice(0, endOfHistory) + newEntry + content.slice(endOfHistory);
    }
    
    // 4. Update "Last updated" timestamp at the bottom
    content = content.replace(
      /\*Last updated: [^*]+\*/,
      `*Last updated: ${timestamp}*`
    );
    
    // Write back to STATE.md
    await fs.writeFile(stateFilePath, content, 'utf-8');
    console.log('   ✓ STATE.md updated');
    return true;
    
  } catch (error) {
    // Graceful failure - don't break the whole save
    console.warn(`   ⚠️  STATE.md update failed: ${error.message}`);
    return false;
  }
}

// ───────────────────────────────────────────────────────────────
// SPEC FOLDER DETECTION
// ───────────────────────────────────────────────────────────────

async function detectSpecFolder(collectedData = null) {
  const cwd = process.cwd();
  const specsDir = path.join(CONFIG.PROJECT_ROOT, 'specs');

  // V13: Check command line argument FIRST (Stateless priority)
  if (CONFIG.SPEC_FOLDER_ARG) {
    // Handle both relative paths (specs/xxx) and folder names (xxx)
    const specArg = CONFIG.SPEC_FOLDER_ARG;
    const specFolderPath = specArg.startsWith('specs/')
      ? path.join(CONFIG.PROJECT_ROOT, specArg)
      : path.join(specsDir, specArg);

    // Verify the folder exists
    try {
      await fs.access(specFolderPath);
      console.log(`   ✓ Using spec folder from CLI argument: ${path.basename(specFolderPath)}`);
      
      // V14.0: Phase 1B Content Alignment Check (MANDATORY per save.md)
      // Run alignment validation when spec folder is provided via CLI
      // This ensures conversation content matches the target folder
      if (collectedData) {
        const folderName = path.basename(specFolderPath);
        const alignmentResult = await validateContentAlignment(collectedData, folderName, specsDir);
        
        if (alignmentResult.useAlternative && alignmentResult.selectedFolder) {
          // User selected an alternative folder
          return path.join(specsDir, alignmentResult.selectedFolder);
        }
        // If alignmentResult.proceed is false, we still continue (alignment is warn-only, not blocking)
      }
      
      return specFolderPath;
    } catch {
      // Provide detailed error with available options
      console.error(`\n❌ Specified spec folder not found: ${CONFIG.SPEC_FOLDER_ARG}\n`);
      console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');
      
      // Show available spec folders
      try {
        const entries = await fs.readdir(specsDir);
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
      process.exit(1);
    }
  }

  // V6.1: Check if spec folder was provided in JSON data
  // P0-013: Only runs if CONFIG.SPEC_FOLDER_ARG was NOT already handled above
  if (collectedData && collectedData.SPEC_FOLDER) {
    const specFolderFromData = collectedData.SPEC_FOLDER;
    const specFolderPath = path.join(specsDir, specFolderFromData);

    // Verify the folder exists
    try {
      await fs.access(specFolderPath);
      console.log(`   ✓ Using spec folder from data: ${specFolderFromData}`);
      // V6.2: ALWAYS run alignment check, even when folder explicitly provided
      const alignmentResult = await validateFolderAlignment(collectedData, specFolderFromData, specsDir);
      if (alignmentResult.proceed) {
        return alignmentResult.useAlternative ? path.join(specsDir, alignmentResult.selectedFolder) : specFolderPath;
      }
      // User chose to abort - will fall through to prompt
    } catch {
      console.warn(`   ⚠️  Spec folder from data not found: ${specFolderFromData}`);
      // Fall through to auto-detection
    }
  }

  // P0-013: REMOVED duplicate CONFIG.SPEC_FOLDER_ARG check that was here
  // The first check (lines 2437-2491) already handles CLI arguments comprehensively
  // This duplicate was causing validation to run twice

  // Check if we're in a spec folder (cross-platform path handling)
  // Handle both Unix (/) and Windows (\) path separators
  if (cwd.includes('/specs/') || cwd.includes('\\specs\\')) {
    const match = cwd.match(/(.*[\/\\]specs[\/\\][^\/\\]+)/);
    if (match) {
      return path.normalize(match[1]);
    }
  }

  // Find spec folders (specsDir already declared at function start)
  try {
    const entries = await fs.readdir(specsDir);
    let specFolders = entries
      .filter(name => /^\d{3}-/.test(name))
      .sort()
      .reverse();

    // Filter out archive folders
    specFolders = filterArchiveFolders(specFolders);

    if (specFolders.length === 0) {
      // No spec folders found - error and exit
      console.error('\n❌ Cannot save context: No spec folder found\n');
      console.error('memory requires a spec folder to save memory documentation.');
      console.error('Every conversation with file changes must have a spec folder per conversation-documentation rules.\n');
      console.error('Please create a spec folder first:');
      console.error('  mkdir -p specs/###-feature-name/\n');
      console.error('Then re-run memory.\n');
    process.exit(1);
  }

    // If no conversation data, use most recent (backward compatible)
    if (!collectedData || specFolders.length === 1) {
      return path.join(specsDir, specFolders[0]);
    }

    // Skip alignment check in auto-save mode (hooks use this)
    if (process.env.AUTO_SAVE_MODE === 'true') {
      return path.join(specsDir, specFolders[0]);
    }

    // Context alignment check
    const conversationTopics = extractConversationTopics(collectedData);
    const mostRecent = specFolders[0];
    const alignmentScore = calculateAlignmentScore(conversationTopics, mostRecent);

    // If alignment is strong enough, auto-select most recent
    if (alignmentScore >= ALIGNMENT_CONFIG.THRESHOLD) {
      return path.join(specsDir, mostRecent);
    }

    // Low alignment - prompt user to choose
    console.log(`\n   ⚠️  Conversation topic may not align with most recent spec folder`);
    console.log(`   Most recent: ${mostRecent} (${alignmentScore}% match)\n`);

    // Calculate scores for top alternatives
    const alternatives = specFolders.slice(0, Math.min(5, specFolders.length)).map(folder => ({
      folder,
      score: calculateAlignmentScore(conversationTopics, folder)
    }));

    // Sort by score descending
    alternatives.sort((a, b) => b.score - a.score);

    // Display options
    console.log('   Alternative spec folders:');
    alternatives.forEach((alt, index) => {
      console.log(`   ${index + 1}. ${alt.folder} (${alt.score}% match)`);
    });
    console.log(`   ${alternatives.length + 1}. Specify custom folder path\n`);

    // Prompt user
    const choice = await promptUserChoice(
      `   Select target folder (1-${alternatives.length + 1}): `,
      alternatives.length + 1
    );

    // Handle choice
    if (choice <= alternatives.length) {
      return path.join(specsDir, alternatives[choice - 1].folder);
    } else {
      // Custom folder path
      const customPath = await promptUser('   Enter spec folder name: ');
      return path.join(specsDir, customPath);
    }

  } catch (error) {
    // If error is from promptUser, re-throw
    if (error.message.includes('retry attempts')) {
      throw error;
    }
    // specs directory doesn't exist - error and exit
    console.error('\n❌ Cannot save context: No spec folder found\n');
    console.error('save-context requires a spec folder to save memory documentation.');
    console.error('Every conversation with file changes must have a spec folder per conversation-documentation rules.\n');
    console.error('Please create a spec folder first:');
    console.error('  mkdir -p specs/###-feature-name/\n');
    console.error('Then re-run save-context.\n');
    process.exit(1);
  }
}

// ───────────────────────────────────────────────────────────────
// TOPIC EXTRACTION & ALIGNMENT
// ───────────────────────────────────────────────────────────────

/**
 * Configuration for alignment checking
 */
const ALIGNMENT_CONFIG = {
  THRESHOLD: 70, // Require 70% match before auto-selecting
  WARNING_THRESHOLD: 50, // Show warning and prompt when alignment below this
  ARCHIVE_PATTERNS: ['z_', 'archive', 'old', '.archived'],
  STOPWORDS: ['the', 'this', 'that', 'with', 'for', 'and', 'from', 'fix', 'update', 'add', 'remove']
};

/**
 * V14.0: Phase 1B Content Alignment Check (per save.md specification)
 * 
 * Validates that conversation content matches the target spec folder.
 * This is a LIGHTWEIGHT heuristic check that:
 * - Extracts conversation topic/keywords from session data
 * - Compares against spec folder name
 * - Warns if mismatch detected (does NOT block save)
 * - Suggests alternatives if better matches exist
 * 
 * @param {Object} collectedData - Conversation data with observations, prompts, etc.
 * @param {string} specFolderName - Target folder name (e.g., "015-auth-system")
 * @param {string} specsDir - Base specs directory path
 * @returns {Promise<{proceed: boolean, useAlternative: boolean, selectedFolder?: string}>}
 */
async function validateContentAlignment(collectedData, specFolderName, specsDir) {
  // Extract conversation topics from session data
  const conversationTopics = extractConversationTopics(collectedData);
  const alignmentScore = calculateAlignmentScore(conversationTopics, specFolderName);
  
  // Also extract keywords from observations for richer context
  const observationKeywords = extractObservationKeywords(collectedData);
  const combinedTopics = [...new Set([...conversationTopics, ...observationKeywords])];
  const enrichedScore = calculateAlignmentScore(combinedTopics, specFolderName);
  
  // Use the better of the two scores
  const finalScore = Math.max(alignmentScore, enrichedScore);
  
  console.log(`   📊 Phase 1B Alignment: ${specFolderName} (${finalScore}% match)`);
  
  // HIGH alignment (≥70%) - proceed silently
  if (finalScore >= ALIGNMENT_CONFIG.THRESHOLD) {
    console.log(`   ✓ Content aligns with target folder`);
    return { proceed: true, useAlternative: false };
  }
  
  // MEDIUM alignment (50-69%) - warn but proceed
  if (finalScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD) {
    console.log(`   ⚠️  Moderate alignment (${finalScore}%) - proceeding with caution`);
    return { proceed: true, useAlternative: false };
  }
  
  // LOW alignment (<50%) - warn and suggest alternatives
  console.log(`\n   ⚠️  ALIGNMENT WARNING: Content may not match target folder`);
  console.log(`   Conversation topics: ${combinedTopics.slice(0, 5).join(', ')}`);
  console.log(`   Target folder: ${specFolderName} (${finalScore}% match)\n`);
  
  // Find better alternatives
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
        score: calculateAlignmentScore(combinedTopics, folder)
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
      
      // Check for interactive mode
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
        // User cancelled or error - proceed with original
        console.log(`   ⚠️  Proceeding with "${specFolderName}"`);
        return { proceed: true, useAlternative: false };
      }
    }
  } catch {
    // Could not read alternatives - proceed with warning
  }
  
  // No better alternatives or couldn't check - proceed with warning
  console.log(`   ⚠️  No better alternatives found - proceeding with "${specFolderName}"`);
  return { proceed: true, useAlternative: false };
}

/**
 * Extract keywords from observation titles and narratives
 * Provides richer context beyond just user prompts
 * @param {Object} collectedData - Conversation data
 * @returns {Array<string>} Array of extracted keywords
 */
function extractObservationKeywords(collectedData) {
  const keywords = new Set();
  
  if (!collectedData?.observations) return [];
  
  for (const obs of collectedData.observations.slice(0, 10)) {
    // Extract from title
    if (obs.title) {
      const titleWords = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
      titleWords.forEach(w => keywords.add(w.toLowerCase()));
    }
    
    // Extract from narrative (first 200 chars to avoid noise)
    if (obs.narrative) {
      const narrativeSnippet = obs.narrative.substring(0, 200);
      const narrativeWords = narrativeSnippet.match(/\b[a-z]{3,}\b/gi) || [];
      narrativeWords.forEach(w => keywords.add(w.toLowerCase()));
    }
    
    // Extract from files modified (filename parts)
    if (obs.files) {
      for (const file of obs.files) {
        const filename = path.basename(file).replace(/\.[^.]+$/, '');
        const fileWords = filename.split(/[-_.]/).filter(w => w.length >= 3);
        fileWords.forEach(w => keywords.add(w.toLowerCase()));
      }
    }
  }
  
  // Filter stopwords
  return Array.from(keywords).filter(k => 
    !ALIGNMENT_CONFIG.STOPWORDS.includes(k) && k.length >= 3
  );
}

/**
 * V6.2: Validate alignment between conversation content and selected spec folder
 * ALWAYS runs, even when folder is explicitly provided
 * @param {Object} collectedData - Conversation data
 * @param {string} specFolderName - Selected folder name (e.g., "015-auth-system")
 * @param {string} specsDir - Base specs directory path
 * @returns {Promise<{proceed: boolean, useAlternative: boolean, selectedFolder?: string}>}
 */
async function validateFolderAlignment(collectedData, specFolderName, specsDir) {
  const conversationTopics = extractConversationTopics(collectedData);
  const alignmentScore = calculateAlignmentScore(conversationTopics, specFolderName);
  
  console.log(`   📊 Alignment check: ${specFolderName} (${alignmentScore}% match)`);
  
  // High alignment - proceed without warning
  if (alignmentScore >= ALIGNMENT_CONFIG.THRESHOLD) {
    console.log(`   ✓ Good alignment with selected folder`);
    return { proceed: true, useAlternative: false };
  }
  
  // Medium alignment - log warning but proceed
  if (alignmentScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD) {
    console.log(`   ⚠️  Moderate alignment - proceeding with caution`);
    return { proceed: true, useAlternative: false };
  }
  
  // Low alignment (< 50%) - prompt user for confirmation
  console.log(`\n   ⚠️  LOW ALIGNMENT WARNING (${alignmentScore}% match)`);
  console.log(`   The selected folder "${specFolderName}" may not match conversation content.\n`);
  
  // Find and display top alternatives
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
        score: calculateAlignmentScore(conversationTopics, folder)
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
      
      // Check for TTY before prompting
      if (!process.stdout.isTTY || !process.stdin.isTTY) {
        console.log(`   ⚠️  Non-interactive mode - proceeding with specified folder`);
        return { proceed: true, useAlternative: false };
      }
      
      const choice = await promptUserChoice(
        `   Select option (1-${alternatives.length + 2}): `,
        alternatives.length + 2
      );
      
      if (choice <= alternatives.length) {
        // User selected an alternative
        return { proceed: true, useAlternative: true, selectedFolder: alternatives[choice - 1].folder };
      } else if (choice === alternatives.length + 1) {
        // Continue with original
        console.log(`   ✓ Proceeding with "${specFolderName}" as requested`);
        return { proceed: true, useAlternative: false };
      } else {
        // Abort
        console.log(`   ❌ Aborted. Please re-run with correct folder.`);
        return { proceed: false, useAlternative: false };
      }
    }
  } catch {
    // If we can't find alternatives, just proceed with warning
  }
  
  // No better alternatives found, proceed with warning
  console.log(`   ⚠️  Proceeding with "${specFolderName}" (no better alternatives found)`);
  return { proceed: true, useAlternative: false };
}

/**
 * Extract conversation topics from collected data
 * @param {Object} collectedData - Conversation data structure
 * @returns {Array<string>} Array of topic keywords
 */
function extractConversationTopics(collectedData) {
  const topics = new Set();

  // Extract from recent_context.request (primary signal)
  if (collectedData.recent_context?.[0]?.request) {
    const request = collectedData.recent_context[0].request.toLowerCase();
    const words = request.match(/\b[a-z]{3,}\b/gi) || [];
    words.forEach(w => topics.add(w.toLowerCase()));
  }

  // Extract from observation titles (secondary signal)
  if (collectedData.observations) {
    for (const obs of collectedData.observations.slice(0, 3)) {
      if (obs.title) {
        const words = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
        words.forEach(w => topics.add(w.toLowerCase()));
      }
    }
  }

  // Filter stopwords and short words
  return Array.from(topics).filter(t =>
    !ALIGNMENT_CONFIG.STOPWORDS.includes(t) && t.length >= 3
  );
}

/**
 * Parse spec folder name to extract topic keywords
 * @param {string} folderName - e.g., "015-auth-system"
 * @returns {Array<string>} Topic keywords ["auth", "system"]
 */
function parseSpecFolderTopic(folderName) {
  // Remove numeric prefix: "015-auth-system" → "auth-system"
  const topic = folderName.replace(/^\d+-/, '');
  // Split on hyphens and underscores: "auth-system" → ["auth", "system"]
  return topic.split(/[-_]/).filter(w => w.length > 0);
}

/**
 * Calculate alignment score between conversation and spec folder
 * @param {Array<string>} conversationTopics - From extractConversationTopics()
 * @param {string} specFolderName - e.g., "015-auth-system"
 * @returns {number} Score 0-100 (percentage match)
 */
function calculateAlignmentScore(conversationTopics, specFolderName) {
  const specTopics = parseSpecFolderTopic(specFolderName);

  if (specTopics.length === 0) return 0;

  // Count how many spec topics appear in conversation topics
  let matches = 0;
  for (const specTopic of specTopics) {
    // Check for exact match or substring match
    if (conversationTopics.some(ct =>
      ct.includes(specTopic) || specTopic.includes(ct)
    )) {
      matches++;
    }
  }

  // Calculate percentage
  return Math.round((matches / specTopics.length) * 100);
}

/**
 * Filter out archive folders from spec folder list
 * @param {Array<string>} folders - List of folder names
 * @returns {Array<string>} Filtered list without archives
 */
function filterArchiveFolders(folders) {
  return folders.filter(folder => {
    const lowerFolder = folder.toLowerCase();
    return !ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.some(pattern =>
      lowerFolder.includes(pattern)
    );
  });
}

/**
 * Prompt user with numbered choices and validate input
 * @param {string} question - Prompt text
 * @param {number} maxChoice - Maximum valid choice number
 * @param {number} maxAttempts - Maximum retry attempts (default 3)
 * @returns {Promise<number>} Selected choice number (1-indexed)
 */
async function promptUserChoice(question, maxChoice, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const answer = await promptUser(question);
    const choice = parseInt(answer);

    if (!isNaN(choice) && choice >= 1 && choice <= maxChoice) {
      return choice;
    }

    if (attempt < maxAttempts) {
      console.log(`   ❌ Invalid choice. Please enter a number between 1 and ${maxChoice}.\n`);
    }
  }

  throw new Error('Maximum retry attempts exceeded. Please run the command again.');
}

// ───────────────────────────────────────────────────────────────
// CONTEXT DIRECTORY SETUP
// ───────────────────────────────────────────────────────────────

/**
 * Prompt user for input in terminal
 * Ensures readline interface is always closed, even on errors
 */
function promptUser(question) {
  // Safety check: don't create readline interface if no TTY available
  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    throw new Error('Cannot prompt user: No TTY available (running in non-interactive mode)');
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
    
    // Handle readline errors and ensure cleanup
    rl.on('error', (err) => {
      rl.close();
      reject(err);
    });
    
    // Handle SIGINT (Ctrl+C) gracefully
    rl.on('SIGINT', () => {
      rl.close();
      reject(new Error('User interrupted input'));
    });
  });
}

/**
 * Ensure memory directory exists within spec folder
 * Uses single memory/ folder with timestamped markdown files
 */
async function setupContextDirectory(specFolder) {
  // Always create memory/ subfolder within spec folder
  const contextDir = path.join(specFolder, 'memory');

  // Ensure directory exists (create if needed)
  // No prompts - files are timestamped so no conflicts
  await fs.mkdir(contextDir, { recursive: true });

  return contextDir;
}

// ───────────────────────────────────────────────────────────────
// DATA COLLECTION FROM MCP
// ───────────────────────────────────────────────────────────────

async function collectSessionData(collectedData, specFolderName = null) {
  const now = new Date();
  // Use provided specFolderName (cached) or detect as fallback with full relative path
  let folderName = specFolderName;
  if (!folderName) {
    const detectedFolder = await detectSpecFolder();
    const specsDir = path.join(CONFIG.PROJECT_ROOT, 'specs');
    folderName = path.relative(specsDir, detectedFolder);
  }
  const dateOnly = formatTimestamp(now, 'date-dutch');  // DD-MM-YY format
  const timeOnly = formatTimestamp(now, 'time-short');  // HH-MM format

  // Fallback to simulation if no data
  if (!collectedData) {
    console.log('   ⚠️  Using simulation data');
    return simFactory.createSessionData({
      specFolder: folderName,
      channel: getChannel(),
      skillVersion: CONFIG.SKILL_VERSION
    });
  }

  // Process real MCP data
  const sessionInfo = collectedData.recent_context?.[0] || {};
  const observations = collectedData.observations || [];
  const userPrompts = collectedData.user_prompts || [];
  const messageCount = userPrompts.length || 0;

  // Check if auto-save triggered
  if (shouldAutoSave(messageCount)) {
    console.log(`\n   📊 Context Budget: ${messageCount} messages reached. Auto-saving context...\n`);
  }

  // P2-026: Safe date parsing with validation
  function safeParseDate(dateStr, fallback) {
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? fallback : parsed;
  }

  // Calculate duration
  let duration = 'N/A';
  if (userPrompts.length > 0) {
    const firstTimestamp = safeParseDate(userPrompts[0]?.timestamp, now);
    const lastTimestamp = safeParseDate(userPrompts[userPrompts.length - 1]?.timestamp, now);
    const durationMs = lastTimestamp - firstTimestamp;
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    duration = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  }

  // V8: Extract files with normalized paths and deduplication
  const filesMap = new Map();

  // V8.4: Helper to add files with normalized path deduplication
  // Prefers shorter valid descriptions (concise > verbose)
  const addFile = (rawPath, description) => {
    const normalized = toRelativePath(rawPath);
    if (!normalized) return;

    const existing = filesMap.get(normalized);
    const cleaned = cleanDescription(description);

    // Keep existing if new description is invalid or longer
    if (existing) {
      if (isDescriptionValid(cleaned) && cleaned.length < existing.length) {
        filesMap.set(normalized, cleaned);
      }
    } else {
      filesMap.set(normalized, cleaned || 'Modified during session');
    }
  };

  // V7.1: FIRST, check for FILES array (primary input format with full descriptions)
  if (collectedData.FILES && Array.isArray(collectedData.FILES)) {
    for (const fileInfo of collectedData.FILES) {
      const filePath = fileInfo.FILE_PATH || fileInfo.path;
      const description = fileInfo.DESCRIPTION || fileInfo.description || 'Modified during session';
      if (filePath) addFile(filePath, description);
    }
  }

  // Also check for files_modified array (legacy format)
  if (collectedData.files_modified && Array.isArray(collectedData.files_modified)) {
    for (const fileInfo of collectedData.files_modified) {
      addFile(fileInfo.path, fileInfo.changes_summary || 'Modified during session');
    }
  }

  // Also extract from observations
  for (const obs of observations) {
    if (obs.files) {
      for (const file of obs.files) {
        addFile(file, 'Modified during session');
      }
    }
    // Also check facts for files
    if (obs.facts) {
      for (const fact of obs.facts) {
        if (fact.files && Array.isArray(fact.files)) {
          for (const file of fact.files) {
            addFile(file, 'Modified during session');
          }
        }
      }
    }
  }

  // V8.1: Limit to 10 key files, prioritizing those with valid descriptions
  const filesEntries = Array.from(filesMap.entries());
  const withValidDesc = filesEntries.filter(([_, desc]) => isDescriptionValid(desc));
  const withFallback = filesEntries.filter(([_, desc]) => !isDescriptionValid(desc));

  // P1-025: Add truncation warning when files are limited
  const allFiles = [...withValidDesc, ...withFallback];
  if (allFiles.length > CONFIG.MAX_FILES_IN_MEMORY) {
    console.warn(`⚠️  Truncating files list from ${allFiles.length} to ${CONFIG.MAX_FILES_IN_MEMORY}. Some files will not be included in memory.`);
  }
  const FILES = allFiles
    .slice(0, CONFIG.MAX_FILES_IN_MEMORY)
    .map(([filePath, description]) => ({
      FILE_PATH: filePath,
      DESCRIPTION: description
    }));

  // V7.2: Extract outcomes from ALL observation types (not just change/feature)
  // V11.1: Use auto-detection for type classification
  // Include: bugfix, feature, change, discovery, decision, refactor
  const OUTCOMES = observations
    .slice(0, 10)
    .map(obs => ({
      OUTCOME: obs.title || obs.narrative?.substring(0, 300),
      TYPE: detectObservationType(obs)
    }));

  // Create session summary from recent context or observations
  const SUMMARY = sessionInfo.learning
    || observations.slice(0, 3).map(o => o.narrative).join(' ')
    || 'Session focused on implementing and testing features.';

  // Get detailed tool counts first (needed for TOOL_COUNT calculation)
  const toolCounts = countToolsByType(observations, userPrompts);

  // Count tools used - sum of all tool counts from toolCounts object
  const TOOL_COUNT = Object.values(toolCounts).reduce((sum, count) => sum + count, 0);

  // Extract task from FIRST user prompt if no observations available
  // This prevents falling back to generic "Development session"
  const firstPrompt = userPrompts[0]?.prompt || '';
  const taskFromPrompt = firstPrompt.match(/^(.{20,100}?)(?:[.!?\n]|$)/)?.[1];

  // V7.3: Build detailed OBSERVATIONS array for template
  // V9.0: Add anchor IDs for searchable context retrieval (Phase 1 - Anchor Infrastructure)
  //
  // Purpose: Enable task-oriented memory retrieval via grep search patterns
  // Format: category-keywords-spec# (e.g., implementation-oauth-callback-049)
  //
  // Why anchor IDs:
  // - Token efficiency: Load relevant sections (500-1500 tokens) vs full files (10k-15k tokens)
  // - Task-oriented: Search by what was done, not when it happened
  // - Grep-friendly: Simple command-line extraction without parsing
  //
  // Example usage:
  //   grep -l "ANCHOR:implementation-oauth" specs/*/memory/*.md
  //   sed -n '/ANCHOR:implementation-oauth-049/,/\/ANCHOR:implementation-oauth-049/p' file.md
  //
  const usedAnchorIds = []; // Track anchors to ensure uniqueness across observations
  const specNumber = extractSpecNumber(collectedData.SPEC_FOLDER || folderName);

  // P2-025: Add null check in observation processing
  const OBSERVATIONS_DETAILED = (observations || [])
    .filter(obs => obs != null)
    .map(obs => {
    // Step 1: Auto-categorize observation based on title and content
    // Categories: implementation, decision, guide, architecture, files, discovery, integration
    const category = categorizeSection(
      obs.title || 'Observation',
      obs.narrative || ''
    );

    // Step 2: Generate anchor ID from title keywords
    // Example: "Implemented OAuth callback handler" → "implementation-oauth-callback-handler-049"
    let anchorId = generateAnchorId(
      obs.title || 'Observation',
      category,
      specNumber
    );

    // Step 3: Ensure uniqueness within this memory file
    // If collision detected, appends -2, -3, etc.
    anchorId = validateAnchorUniqueness(anchorId, usedAnchorIds);
    usedAnchorIds.push(anchorId);

    // Detect observation type once for reuse
    const obsType = detectObservationType(obs);
    
    return {
      TYPE: obsType.toUpperCase(),
      TITLE: obs.title || 'Observation',
      NARRATIVE: obs.narrative || '',
      HAS_FILES: obs.files && obs.files.length > 0,
      FILES_LIST: obs.files ? obs.files.join(', ') : '',
      HAS_FACTS: obs.facts && obs.facts.length > 0,
      FACTS_LIST: obs.facts ? obs.facts.join(' | ') : '',
      ANCHOR_ID: anchorId, // V9.0: Searchable anchor ID for grep-based retrieval
      IS_DECISION: obsType === 'decision' // V12.1: Flag for template filtering ({{^IS_DECISION}})
    };
  });

  // V11.0: Generate session metadata for enhanced retrieval
  const sessionId = generateSessionId();
  const channel = getChannel();
  const createdAtEpoch = Math.floor(Date.now() / 1000);

  // Count decisions from observations
  const decisionCount = observations.filter(obs =>
    obs.type === 'decision' || (obs.title && obs.title.toLowerCase().includes('decision'))
  ).length;

  // Auto-detect context type based on tool usage patterns (toolCounts already calculated above)
  const contextType = detectContextType(toolCounts, decisionCount);

  // Extract file paths for importance detection
  const filePathsModified = FILES.map(f => f.FILE_PATH);

  // Detect importance tier based on files and context type
  const importanceTier = detectImportanceTier(filePathsModified, contextType);

  // V11.2: Detect related spec/plan files in the spec folder (enhanced)
  // Uses detectRelatedDocs() for comprehensive file detection with meaningful descriptions
  // Also includes parent folder docs if in a sub-folder
  let SPEC_FILES = [];
  const specFolderPath = collectedData.SPEC_FOLDER
    ? path.join(CONFIG.PROJECT_ROOT, 'specs', collectedData.SPEC_FOLDER)
    : null;

  if (specFolderPath) {
    try {
      SPEC_FILES = await detectRelatedDocs(specFolderPath);
    } catch (docError) {
      console.warn(`   ⚠️  Could not detect related docs: ${docError.message}`);
      SPEC_FILES = [];
    }
  }

  // V12.0: Build implementation guide data
  const implementationGuide = buildImplementationGuideData(observations, FILES, folderName);

  // V13.0: Build project state snapshot (replaces separate STATE.md)
  // Detects phase from tool usage and observations
  const projectPhase = detectProjectPhase(toolCounts, observations, messageCount);
  
  // Extract active file from most recent observation
  const activeFile = extractActiveFile(observations, FILES);
  
  // Build quick summary for last/next action
  const lastAction = observations.slice(-1)[0]?.title || 'Context save initiated';
  const nextAction = extractNextAction(observations, collectedData.recent_context);
  
  // Check for blockers in observations
  const blockers = extractBlockers(observations);
  
  // Build file progress from spec files
  const fileProgress = buildFileProgress(SPEC_FILES, specFolderPath);

  return {
    TITLE: folderName.replace(/^\d{3}-/, '').replace(/-/g, ' '),
    DATE: dateOnly,
    TIME: timeOnly,
    SPEC_FOLDER: folderName,
    DURATION: duration,
    SUMMARY: SUMMARY,
    // V8.5: Add HAS_FILES flag for conditional template rendering
    FILES: FILES.length > 0 ? FILES : [],
    HAS_FILES: FILES.length > 0,
    FILE_COUNT: FILES.length,
    OUTCOMES: OUTCOMES.length > 0 ? OUTCOMES : [{ OUTCOME: 'Session in progress' }],
    TOOL_COUNT,
    MESSAGE_COUNT: messageCount,
    QUICK_SUMMARY: observations[0]?.title || sessionInfo.request || taskFromPrompt?.trim() || 'Development session',
    SKILL_VERSION: CONFIG.SKILL_VERSION,
    // V7.3: Add detailed observations for template
    OBSERVATIONS: OBSERVATIONS_DETAILED,
    HAS_OBSERVATIONS: OBSERVATIONS_DETAILED.length > 0,
    // V7.4: Add spec/plan file references
    SPEC_FILES: SPEC_FILES,
    HAS_SPEC_FILES: SPEC_FILES.length > 0,
    // V12.0: Implementation guide data
    ...implementationGuide,
    // V11.0: Enhanced session metadata for retrieval
    SESSION_ID: sessionId,
    CHANNEL: channel,
    IMPORTANCE_TIER: importanceTier,
    CONTEXT_TYPE: contextType,
    CREATED_AT_EPOCH: createdAtEpoch,
    LAST_ACCESSED_EPOCH: createdAtEpoch, // Same as created initially
    // V11.1: Calculate expiry based on importance tier (0 = never expires)
    EXPIRES_AT_EPOCH: ['constitutional', 'critical', 'important'].includes(importanceTier)
      ? 0 // Never expires
      : importanceTier === 'temporary'
        ? createdAtEpoch + (7 * 24 * 60 * 60) // 7 days
        : importanceTier === 'deprecated'
          ? createdAtEpoch // Already expired
          : createdAtEpoch + (90 * 24 * 60 * 60), // 90 days (normal)
    TOOL_COUNTS: toolCounts, // Detailed tool usage breakdown
    DECISION_COUNT: decisionCount,
    // V11.1: Access analytics (new memories start at 1)
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1.0,
    // V13.0: Project state snapshot (embedded in memory, replaces STATE.md)
    PROJECT_PHASE: projectPhase,
    ACTIVE_FILE: activeFile,
    LAST_ACTION: lastAction,
    NEXT_ACTION: nextAction,
    BLOCKERS: blockers,
    FILE_PROGRESS: fileProgress,
    HAS_FILE_PROGRESS: fileProgress.length > 0
  };
}

async function extractConversations(collectedData) {
  // Validate and warn about data quality
  if (!collectedData) {
    console.log('   ⚠️  Using simulation data for conversations');
    return simFactory.createConversationData();
  }

  // Process real MCP data with quality warnings
  const userPrompts = collectedData.user_prompts || [];
  const observations = collectedData.observations || [];

  // Warn if data is suspiciously empty
  if (userPrompts.length === 0 && observations.length === 0) {
    console.warn('   ⚠️  Warning: No conversation data found');
    console.warn('   ⚠️  Generated output may be minimal or empty');
  }

  if (userPrompts.length === 0) {
    console.warn(`   ⚠️  No user prompts found (empty conversation)`);
  }

  if (observations.length === 0) {
    console.warn(`   ⚠️  No observations found (no events documented)`);
  }

  // Build conversation messages by interleaving user prompts and assistant observations
  const MESSAGES = [];
  const phaseTimestamps = new Map(); // Track phase durations

  // V6.3: Trust pre-filtered data from transform-transcript.js
  // FIXED: Removed redundant filter that was causing count divergence
  const validPrompts = userPrompts;  // Already filtered by transform-transcript.js

  for (let i = 0; i < validPrompts.length; i++) {
    const userPrompt = validPrompts[i];

    // Add user message
    const rawTimestamp = userPrompt.timestamp || new Date().toISOString();
    const userMessage = {
      TIMESTAMP: formatTimestamp(rawTimestamp, 'readable'),
      ROLE: 'User',
      CONTENT: userPrompt.prompt.trim(),
      TOOL_CALLS: []
    };
    MESSAGES.push(userMessage);

    // Find corresponding assistant observations (within reasonable time window)
    const userTime = new Date(rawTimestamp);
    const relatedObs = observations.filter(obs => {
      const obsTime = new Date(obs.timestamp);
      const timeDiff = Math.abs(obsTime - userTime);
      return timeDiff < CONFIG.MESSAGE_TIME_WINDOW;
    });

    // Create assistant response with intelligent summarization
    if (relatedObs.length > 0) {
      // Extract tool calls from observations using improved detection
      const TOOL_CALLS = relatedObs.flatMap(obs => {
        if (!obs.facts) return [];

        return obs.facts.map(fact => {
          // Validate fact is a string
          if (!fact || typeof fact !== 'string') return null;

          // Use new strict tool detection
          const detection = detectToolCall(fact);
          if (!detection) return null;

          // Verify not prose context - find where the tool name appears
          const toolIndex = fact.search(new RegExp(`\\b${detection.tool}\\b`, 'i'));
          if (toolIndex >= 0 && isProseContext(fact, toolIndex)) {
            return null; // Skip prose matches like "Read more about..."
          }

          // Only include high/medium confidence detections
          if (detection.confidence === 'low') return null;

          const fileMatch = fact.match(/File:\s*([^\n]+)/i) || fact.match(/(?:file_path|path):\s*([^\n]+)/i);
          const resultMatch = fact.match(/Result:\s*([^\n]+)/i);

          return {
            TOOL_NAME: detection.tool,
            DESCRIPTION: fileMatch?.[1] || fact.substring(0, 100),
            HAS_RESULT: !!resultMatch,
            RESULT_PREVIEW: resultMatch?.[1] ? truncateToolOutput(resultMatch[1], CONFIG.TOOL_PREVIEW_LINES) : '',
            HAS_MORE: resultMatch?.[1]?.split('\n').length > CONFIG.TOOL_PREVIEW_LINES
          };
        }).filter(Boolean);
      });

      // Create intelligent summary of assistant response
      const narratives = relatedObs.map(o => o.narrative).filter(Boolean);
      const summary = summarizeExchange(
        userMessage.CONTENT,
        narratives.join(' '),
        TOOL_CALLS
      );

      const assistantMessage = {
        TIMESTAMP: formatTimestamp(relatedObs[0].timestamp || rawTimestamp, 'readable'),
        ROLE: 'Assistant',
        CONTENT: summary.fullSummary,
        TOOL_CALLS: TOOL_CALLS.slice(0, 10) // Limit to 10 tools per message
      };

      MESSAGES.push(assistantMessage);

      // Track phase for this exchange
      const phase = classifyConversationPhase(TOOL_CALLS, userMessage.CONTENT);
      if (!phaseTimestamps.has(phase)) {
        phaseTimestamps.set(phase, []);
      }
      phaseTimestamps.get(phase).push(new Date(userMessage.TIMESTAMP));
    }
  }

  // Sort all messages by timestamp to ensure chronological order
  // User and assistant timestamps from different sources can appear out of order
  MESSAGES.sort((a, b) => {
    const timeA = new Date(a.TIMESTAMP.replace(' @ ', 'T')).getTime();
    const timeB = new Date(b.TIMESTAMP.replace(' @ ', 'T')).getTime();
    return timeA - timeB;
  });

  // Ensure user messages come before their assistant responses when timestamps are equal
  for (let i = 0; i < MESSAGES.length - 1; i++) {
    const curr = MESSAGES[i];
    const next = MESSAGES[i + 1];
    const currTime = new Date(curr.TIMESTAMP.replace(' @ ', 'T')).getTime();
    const nextTime = new Date(next.TIMESTAMP.replace(' @ ', 'T')).getTime();

    // If same timestamp but user follows assistant, swap them
    if (currTime === nextTime && curr.ROLE === 'Assistant' && next.ROLE === 'User') {
      [MESSAGES[i], MESSAGES[i + 1]] = [MESSAGES[i + 1], MESSAGES[i]];
    }
  }

  // Calculate phases and durations
  const PHASES = Array.from(phaseTimestamps.entries()).map(([PHASE_NAME, timestamps]) => {
    if (timestamps.length === 0) {
      return { PHASE_NAME, DURATION: 'N/A' };
    }

    const firstTime = timestamps[0];
    const lastTime = timestamps[timestamps.length - 1];
    const durationMs = lastTime - firstTime;
    const minutes = Math.floor(durationMs / 60000);

    return {
      PHASE_NAME,
      DURATION: minutes > 0 ? `${minutes} min` : '< 1 min'
    };
  });

  // Calculate total duration
  let duration = 'N/A';
  if (MESSAGES.length > 0) {
    const firstTime = new Date(MESSAGES[0].TIMESTAMP);
    const lastTime = new Date(MESSAGES[MESSAGES.length - 1].TIMESTAMP);
    const durationMs = lastTime - firstTime;
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    duration = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  }

  // Determine flow pattern
  const hasDecisions = MESSAGES.some(m => m.CONTENT.toLowerCase().includes('option') || m.CONTENT.toLowerCase().includes('decide'));
  const hasParallel = PHASES.length > 3;
  const FLOW_PATTERN = hasDecisions
    ? 'Sequential with Decision Points'
    : hasParallel
    ? 'Multi-Phase Workflow'
    : 'Linear Sequential';

  // Count tools
  const TOOL_COUNT = MESSAGES.reduce((count, msg) => count + msg.TOOL_CALLS.length, 0);

  // Generate flowchart from actual conversation data
  const AUTO_GENERATED_FLOW = flowchartGen.generateConversationFlowchart(PHASES, userPrompts[0]?.prompt);

  return {
    MESSAGES,
    MESSAGE_COUNT: MESSAGES.length,
    DURATION: duration,
    FLOW_PATTERN,
    PHASE_COUNT: PHASES.length,
    PHASES,
    AUTO_GENERATED_FLOW,
    TOOL_COUNT,
    DATE: new Date().toISOString().split('T')[0]
  };
}

async function extractDecisions(collectedData) {
  // Check for manual decision metadata from normalizeInputData()
  // This handles simplified JSON input with _manualDecision markers
  const manualDecisions = collectedData?._manualDecisions || [];
  
  // Fallback to simulation if no data
  if (!collectedData) {
    console.log('   ⚠️  Using simulation data for decisions');
    return simFactory.createDecisionData();
  }

  // V10.1: Process manual decisions from normalized input (from keyDecisions array)
  // These come from simplified JSON input that was normalized by normalizeInputData()
  if (manualDecisions.length > 0) {
    console.log(`   📋 Processing ${manualDecisions.length} manual decision(s)`);
    
    const specNumber = extractSpecNumber(collectedData.SPEC_FOLDER || '000-unknown');
    const usedAnchorIds = [];
    
    const processedDecisions = manualDecisions.map((manualDec, index) => {
      // V10.3: Handle both string and object formats for manual decisions
      let decisionText;
      if (typeof manualDec === 'string') {
        decisionText = manualDec;
      } else if (typeof manualDec === 'object' && manualDec !== null) {
        // Extract decision field from object, fallback to title or stringify
        decisionText = manualDec.decision || manualDec.title || JSON.stringify(manualDec);
      } else {
        decisionText = `Decision ${index + 1}`;
      }
      
      // Parse manual decision string: "Decision N: Title - rationale text"
      const titleMatch = decisionText.match(/^(?:Decision\s*\d+:\s*)?(.+?)(?:\s*[-–—]\s*(.+))?$/i);
      const title = titleMatch?.[1]?.trim() || `Decision ${index + 1}`;
      const rationale = titleMatch?.[2]?.trim() || decisionText;
      
      // Generate at least one option based on the decision
      const OPTIONS = [{
        OPTION_NUMBER: 1,
        LABEL: 'Chosen Approach',
        DESCRIPTION: title,
        HAS_PROS_CONS: false,
        PROS: [],
        CONS: []
      }];
      
      // Generate anchor ID
      let anchorId = generateAnchorId(title, 'decision', specNumber);
      anchorId = validateAnchorUniqueness(anchorId, usedAnchorIds);
      usedAnchorIds.push(anchorId);
      
      return {
        INDEX: index + 1,
        TITLE: title,
        CONTEXT: rationale,
        TIMESTAMP: formatTimestamp(),
        OPTIONS,
        CHOSEN: 'Chosen Approach',
        RATIONALE: rationale,
        HAS_PROS: false,
        PROS: [],
        HAS_CONS: false,
        CONS: [],
        CONFIDENCE: 80,
        HAS_EVIDENCE: false,
        EVIDENCE: [],
        HAS_CAVEATS: false,
        CAVEATS: [],
        HAS_FOLLOWUP: false,
        FOLLOWUP: [],
        DECISION_TREE: '',
        HAS_DECISION_TREE: false,
        DECISION_ANCHOR_ID: anchorId,
        DECISION_IMPORTANCE: 'medium' // Default importance for manual decisions
      };
    });
    
    return {
      DECISIONS: processedDecisions.map(validateDataStructure),
      DECISION_COUNT: processedDecisions.length,
      HIGH_CONFIDENCE_COUNT: processedDecisions.filter(d => d.CONFIDENCE >= 80).length,
      MEDIUM_CONFIDENCE_COUNT: processedDecisions.filter(d => d.CONFIDENCE >= 50 && d.CONFIDENCE < 80).length,
      LOW_CONFIDENCE_COUNT: processedDecisions.filter(d => d.CONFIDENCE < 50).length,
      FOLLOWUP_COUNT: 0
    };
  }

  // Process real MCP data - extract decision observations
  const decisionObservations = (collectedData.observations || [])
    .filter(obs => obs.type === 'decision');

  const decisions = decisionObservations.map((obs, index) => {
    // Parse decision details from observation narrative and facts
    const narrative = obs.narrative || '';
    const facts = obs.facts || [];

    // Extract options from facts with robust parsing
    const optionMatches = facts.filter(f => f.includes('Option') || f.includes('Alternative'));
    const OPTIONS = optionMatches.map((opt, i) => {
      // More robust label extraction
      const labelMatch = opt.match(/Option\s+([A-Za-z0-9]+):?/)
        || opt.match(/Alternative\s+([A-Za-z0-9]+):?/)
        || opt.match(/^(\d+)\./);

      const label = labelMatch?.[1] || `${i + 1}`;

      // More robust description extraction
      let description = opt;
      if (opt.includes(':')) {
        const parts = opt.split(':');
        description = parts.slice(1).join(':').trim(); // Handle multiple colons
      } else if (labelMatch) {
        // Remove label prefix if present but no colon
        description = opt.replace(labelMatch[0], '').trim();
      }

      // Validate description is meaningful
      if (!description || description.length < 3) {
        description = opt; // Fall back to full text
      }

      return {
        OPTION_NUMBER: i + 1,
        LABEL: `Option ${label}`,
        DESCRIPTION: description,
        HAS_PROS_CONS: false,
        PROS: [],
        CONS: []
      };
    });

    // V10.1: Ensure at least one option exists for better template rendering
    // If no explicit options found, create an implied option from the narrative
    if (OPTIONS.length === 0 && narrative.trim()) {
      const impliedDescription = narrative.substring(0, 100) + (narrative.length > 100 ? '...' : '');
      OPTIONS.push({
        OPTION_NUMBER: 1,
        LABEL: 'Chosen Approach',
        DESCRIPTION: impliedDescription,
        HAS_PROS_CONS: false,
        PROS: [],
        CONS: []
      });
    }

    // Extract chosen option
    const chosenMatch = narrative.match(/chose|selected|decided on|went with:?\s+([^\.\n]+)/i);
    const CHOSEN = chosenMatch?.[1]?.trim() || (OPTIONS.length > 0 ? OPTIONS[0].LABEL : 'N/A');

    // Extract rationale
    const rationaleMatch = narrative.match(/because|rationale|reason:?\s+([^\.\n]+)/i);
    const RATIONALE = rationaleMatch?.[1]?.trim() || narrative.substring(0, 200);

    // Extract confidence if mentioned
    const confidenceMatch = narrative.match(/confidence:?\s*(\d+)%?/i);
    const CONFIDENCE = confidenceMatch ? parseInt(confidenceMatch[1]) : 75;

    // Extract pros/cons if mentioned (use word boundaries to avoid "disadvantage" matching "advantage")
    const PROS = facts
      .filter(f => {
        const lower = f.toLowerCase();
        return lower.match(/\bpro:\s/) || lower.match(/\badvantage:\s/);
      })
      .map(p => {
        const parts = p.split(':');
        // If colon exists, take everything after first colon, otherwise use full string
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : p;
        return { PRO: text };
      });

    const CONS = facts
      .filter(f => {
        const lower = f.toLowerCase();
        return lower.match(/\bcon:\s/) || lower.match(/\bdisadvantage:\s/);
      })
      .map(c => {
        const parts = c.split(':');
        // If colon exists, take everything after first colon, otherwise use full string
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : c;
        return { CON: text };
      });

    // Extract follow-up actions
    const FOLLOWUP = facts
      .filter(f => {
        const lower = f.toLowerCase();
        return lower.match(/\bfollow-?up:\s/) || lower.match(/\btodo:\s/) || lower.match(/\bnext step:\s/);
      })
      .map(f => {
        const parts = f.split(':');
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : f;
        return { FOLLOWUP_ITEM: text };
      });

    // Extract caveats/warnings
    const CAVEATS = facts
      .filter(f => {
        const lower = f.toLowerCase();
        return lower.match(/\bcaveat:\s/) || lower.match(/\bwarning:\s/) || lower.match(/\blimitation:\s/);
      })
      .map(c => {
        const parts = c.split(':');
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : c;
        return { CAVEAT_ITEM: text };
      });

    // Extract evidence references
    const EVIDENCE = obs.files
      ? obs.files.map(f => ({ EVIDENCE_ITEM: f }))
      : facts
          .filter(f => {
            const lower = f.toLowerCase();
            return lower.match(/\bevidence:\s/) || lower.match(/\bsee:\s/) || lower.match(/\breference:\s/);
          })
          .map(e => {
            const parts = e.split(':');
            const text = parts.length > 1 ? parts.slice(1).join(':').trim() : e;
            return { EVIDENCE_ITEM: text };
          });

    // Build decision object first
    const decision = {
      INDEX: index + 1,
      TITLE: obs.title || `Decision ${index + 1}`,
      CONTEXT: narrative,
      TIMESTAMP: obs.timestamp || new Date().toISOString(),
      OPTIONS,
      CHOSEN,
      RATIONALE,
      HAS_PROS: PROS.length > 0,
      PROS,
      HAS_CONS: CONS.length > 0,
      CONS,
      CONFIDENCE,
      HAS_EVIDENCE: EVIDENCE.length > 0,
      EVIDENCE,
      HAS_CAVEATS: CAVEATS.length > 0,
      CAVEATS,
      HAS_FOLLOWUP: FOLLOWUP.length > 0,
      FOLLOWUP
    };

    // Generate decision tree with full decision object
    decision.DECISION_TREE = OPTIONS.length > 0 ? generateDecisionTree(decision) : '';
    decision.HAS_DECISION_TREE = decision.DECISION_TREE.length > 0;

    return decision;
  });

  // Calculate confidence distribution
  const highConfidence = decisions.filter(d => d.CONFIDENCE >= 80).length;
  const mediumConfidence = decisions.filter(d => d.CONFIDENCE >= 50 && d.CONFIDENCE < 80).length;
  const lowConfidence = decisions.filter(d => d.CONFIDENCE < 50).length;

  // Calculate total follow-up count across all decisions
  const followupCount = decisions.reduce((count, d) => count + d.FOLLOWUP.length, 0);

  // V9.0: Add anchor IDs for searchable decision retrieval (Phase 1 - Anchor Infrastructure)
  //
  // Purpose: Enable quick access to architectural and technical decisions via grep
  // Format: decision-keywords-spec# (e.g., decision-jwt-sessions-049)
  //
  // Why separate from observations:
  // - Decisions are high-value reference points (architecture, trade-offs, rationale)
  // - Often needed independently from implementation details
  // - Decision retrieval is a distinct use case in AI conversations
  //
  // Example usage:
  //   grep -l "ANCHOR:decision-auth" specs/*/memory/*.md
  //   sed -n '/ANCHOR:decision-jwt-049/,/\/ANCHOR:decision-jwt-049/p' file.md
  //
  const usedAnchorIds = []; // Track decision anchors to ensure uniqueness
  const specNumber = extractSpecNumber(collectedData.SPEC_FOLDER || '000-unknown');

  const decisionsWithAnchors = decisions.map(decision => {
    // Step 1: Category is always 'decision' (decisions are explicitly marked)
    const category = 'decision';

    // Step 2: Generate anchor ID from decision title
    // Example: "JWT vs Sessions for authentication" → "decision-jwt-sessions-authentication-049"
    let anchorId = generateAnchorId(
      decision.TITLE || 'Decision',
      category,
      specNumber
    );

    // Step 3: Ensure uniqueness within this memory file
    // If collision detected, appends -2, -3, etc.
    anchorId = validateAnchorUniqueness(anchorId, usedAnchorIds);
    usedAnchorIds.push(anchorId);

    // Step 4: Add anchor ID and importance to decision object for template rendering
    // Determine importance based on confidence level
    const importance = decision.CONFIDENCE >= 80 ? 'high' 
      : decision.CONFIDENCE >= 50 ? 'medium' 
      : 'low';
    
    return {
      ...decision,
      DECISION_ANCHOR_ID: anchorId, // V9.0: Searchable anchor ID for grep-based retrieval
      DECISION_IMPORTANCE: importance // V10.1: Importance tier based on confidence
    };
  });

  return {
    DECISIONS: decisionsWithAnchors.map(validateDataStructure),
    DECISION_COUNT: decisions.length,
    HIGH_CONFIDENCE_COUNT: highConfidence,
    MEDIUM_CONFIDENCE_COUNT: mediumConfidence,
    LOW_CONFIDENCE_COUNT: lowConfidence,
    FOLLOWUP_COUNT: followupCount
  };
}

async function extractDiagrams(collectedData) {
  // Fallback to simulation if no data
  if (!collectedData) {
    console.log('   ⚠️  Using simulation data for diagrams');
    return simFactory.createDiagramData();
  }

  // Process real MCP data - scan for diagrams in observations
  const observations = collectedData.observations || [];
  const decisions = collectedData.observations?.filter(o => o.type === 'decision') || [];
  const userPrompts = collectedData.user_prompts || [];

  // Box-drawing characters to detect ASCII art
  const boxChars = /[┌┐└┘├┤┬┴┼─│╭╮╰╯╱╲▼▲►◄]/;

  const DIAGRAMS = [];

  // Search for diagrams in observation narratives
  for (const obs of observations) {
    const narrative = obs.narrative || '';
    const facts = obs.facts || [];

    // Check if contains ASCII art
    if (boxChars.test(narrative) || facts.some(f => boxChars.test(f))) {
      const asciiArt = boxChars.test(narrative)
        ? narrative
        : facts.find(f => boxChars.test(f)) || '';

      const pattern = flowchartGen.classifyDiagramPattern(asciiArt);

      DIAGRAMS.push({
        TITLE: obs.title || 'Detected Diagram',
        TIMESTAMP: obs.timestamp || new Date().toISOString(),
        DIAGRAM_TYPE: obs.type === 'decision' ? 'Decision Tree' : 'Workflow',
        PATTERN_NAME: pattern.pattern,
        COMPLEXITY: pattern.complexity,
        HAS_DESCRIPTION: !!obs.title,
        DESCRIPTION: obs.title || 'Diagram found in conversation',
        ASCII_ART: asciiArt.substring(0, 1000), // Limit size
        HAS_NOTES: false,
        NOTES: [],
        HAS_RELATED_FILES: obs.files && obs.files.length > 0,
        RELATED_FILES: obs.files ? obs.files.map(f => ({ FILE_PATH: f })) : []
      });
    }
  }

  // Generate auto-flowchart from conversation phases
  const phases = extractPhasesFromData(collectedData);
  const AUTO_CONVERSATION_FLOWCHART = flowchartGen.generateConversationFlowchart(
    phases,
    userPrompts[0]?.prompt || 'User request'
  );

  // Generate decision trees for all decisions
  const AUTO_DECISION_TREES = decisions.map((dec, index) => {
    const options = dec.facts
      ?.filter(f => f.includes('Option') || f.includes('Alternative'))
      .map(f => f.split(':')[0]?.trim() || f.substring(0, 20)) || [];

    const chosen = dec.narrative?.match(/chose|selected:?\s+([^\.\n]+)/i)?.[1]?.trim() || options[0];

    return {
      INDEX: index + 1,
      DECISION_TITLE: dec.title || `Decision ${index + 1}`,
      DECISION_TREE: generateDecisionTree(dec.title || 'Decision', options, chosen)
    };
  });

  // Count diagram types
  const diagramTypeCounts = new Map();
  for (const diagram of DIAGRAMS) {
    const count = diagramTypeCounts.get(diagram.DIAGRAM_TYPE) || 0;
    diagramTypeCounts.set(diagram.DIAGRAM_TYPE, count + 1);
  }

  const DIAGRAM_TYPES = Array.from(diagramTypeCounts.entries()).map(([TYPE, COUNT]) => ({ TYPE, COUNT }));

  // Count pattern types
  const patternCounts = new Map();
  for (const diagram of DIAGRAMS) {
    const count = patternCounts.get(diagram.PATTERN_NAME) || 0;
    patternCounts.set(diagram.PATTERN_NAME, count + 1);
  }

  const PATTERN_SUMMARY = Array.from(patternCounts.entries()).map(([PATTERN_NAME, COUNT]) => ({ PATTERN_NAME, COUNT }));

  return {
    DIAGRAMS: DIAGRAMS.map(validateDataStructure),
    DIAGRAM_COUNT: DIAGRAMS.length,
    HAS_AUTO_GENERATED: true,
    FLOW_TYPE: 'Conversation Flow',
    AUTO_CONVERSATION_FLOWCHART,
    AUTO_DECISION_TREES,
    AUTO_FLOW_COUNT: 1,
    AUTO_DECISION_COUNT: AUTO_DECISION_TREES.length,
    DIAGRAM_TYPES,
    PATTERN_SUMMARY
  };
}

function extractPhasesFromData(collectedData) {
  // V10.1: Return empty array for very short sessions (≤2 messages)
  // This prevents misleading phase data for trivial conversations
  const messageCount = collectedData?.observations?.length || 0;
  if (messageCount <= 2) {
    console.log('   ℹ️  Session too short for meaningful phase detection');
    return []; // Empty phases - template will handle gracefully
  }
  
  // Fallback for simulation mode (only when explicitly no data)
  if (!collectedData || !collectedData.observations || collectedData.observations.length === 0) {
    return simFactory.createSimulationPhases();
  }

  // Extract phases from observations
  const observations = collectedData.observations;
  const phaseMap = new Map();

  for (const obs of observations) {
    // Classify each observation into a phase
    // Extract tools from string facts using improved detection
    const tools = obs.facts?.flatMap(f => {
      if (typeof f !== 'string') return [];

      // Use new strict tool detection
      const detection = detectToolCall(f);
      if (!detection) return [];

      // Verify not prose context
      const toolIndex = f.search(new RegExp(`\\b${detection.tool}\\b`, 'i'));
      if (toolIndex >= 0 && isProseContext(f, toolIndex)) {
        return []; // Skip prose matches
      }

      return [detection.tool];
    }) || [];
    const content = obs.narrative || '';

    const phase = classifyConversationPhase(
      tools.map(t => ({ tool: t })),
      content
    );

    if (!phaseMap.has(phase)) {
      phaseMap.set(phase, { count: 0, duration: 0, activities: [] });
    }

    const phaseData = phaseMap.get(phase);
    phaseData.count++;

    // Extract activities from observation narrative with quality validation
    if (content && content.trim().length > 10) { // Min length check
      // Truncate at word boundary
      let activity = content.substring(0, 50);
      const lastSpace = activity.lastIndexOf(' ');
      if (lastSpace > 30) { // Keep reasonable length
        activity = activity.substring(0, lastSpace);
      }

      // Add ellipsis if truncated
      if (activity.length < content.length) {
        activity += '...';
      }

      // Check for meaningful content (not just punctuation)
      const meaningfulContent = activity.replace(/[^a-zA-Z0-9]/g, '');
      if (meaningfulContent.length < 5) continue; // Skip if too short

      // Simple deduplication (exact match)
      if (!phaseData.activities.includes(activity)) {
        phaseData.activities.push(activity);
      }
    }
  }

  return Array.from(phaseMap.entries()).map(([name, data]) => ({
    PHASE_NAME: name,
    DURATION: `${data.count} actions`,
    ACTIVITIES: data.activities.slice(0, 3)
  }));
}

// ───────────────────────────────────────────────────────────────
// DECISION TREE GENERATION
// Note: Box formatting helpers (padText, formatDecisionHeader, etc.)
// are imported from ./lib/ascii-boxes.js
// ───────────────────────────────────────────────────────────────

/**
 * Generate enhanced decision tree with full decision context
 * Accepts full decision object with all metadata
 */
function generateDecisionTree(decisionData) {
  // Handle legacy format (simple parameters) for backwards compatibility
  if (typeof decisionData === 'string') {
    const title = decisionData;
    const options = arguments[1] || [];
    const chosen = arguments[2] || '';

    // Simple legacy tree
    const pad = (text, length) => text.substring(0, length).padEnd(length);
    return `┌──────────────────────┐
│  ${pad(title, 18)}  │
└──────────────────────┘
         │
         ▼
    ╱──────────╲
   ╱  Options?   ╲
   ╲            ╱
    ╲──────────╱
      ${chosen ? '✓' : ''}`;
  }

  // Extract decision data
  const {
    TITLE = 'Decision',
    CONTEXT = '',
    CONFIDENCE = 75,
    TIMESTAMP = new Date().toISOString(),
    OPTIONS = [],
    CHOSEN = '',
    RATIONALE = '',
    EVIDENCE = [],
    CAVEATS = [],
    FOLLOWUP = []
  } = decisionData;

  if (OPTIONS.length === 0) {
    return formatDecisionHeader(TITLE, CONTEXT, CONFIDENCE, TIMESTAMP) + '\n' +
           '         │\n' +
           '         ▼\n' +
           '   (No options provided)';
  }

  // Start with header
  let tree = formatDecisionHeader(TITLE, CONTEXT, CONFIDENCE, TIMESTAMP);
  tree += '\n                      │\n                      ▼\n';

  // Add decision diamond
  const questionText = OPTIONS.length > 2 ? `Select from ${OPTIONS.length} options?` : 'Choose option?';
  tree += `              ╱${'─'.repeat(questionText.length + 2)}╲\n`;
  tree += `             ╱  ${questionText}  ╲\n`;
  tree += `            ╱${' '.repeat(questionText.length + 4)}╲\n`;
  tree += `            ╲${' '.repeat(questionText.length + 4)}╱\n`;
  tree += `             ╲${'─'.repeat(questionText.length + 2)}╱\n`;

  // Determine which option is chosen
  const chosenOption = OPTIONS.find(opt =>
    opt.LABEL === CHOSEN ||
    CHOSEN.includes(opt.LABEL) ||
    opt.LABEL.includes(CHOSEN)
  );

  // Layout options (max 4 displayed)
  const displayedOptions = OPTIONS.slice(0, 4);
  const spacing = displayedOptions.length === 2 ? 15 : 10;

  // Create branch lines
  if (displayedOptions.length === 2) {
    tree += '               │           │\n';
    tree += `            ${padText(displayedOptions[0].LABEL, 10)}     ${padText(displayedOptions[1].LABEL, 10)}\n`;
    tree += '               │           │\n';
    tree += '               ▼           ▼\n';
  } else {
    let branchLine = '      ';
    for (let i = 0; i < displayedOptions.length; i++) {
      branchLine += '│' + ' '.repeat(spacing);
    }
    tree += branchLine.trimEnd() + '\n';

    // Option labels
    let labelLine = '   ';
    for (const opt of displayedOptions) {
      labelLine += padText(opt.LABEL, spacing + 1);
    }
    tree += labelLine.trimEnd() + '\n';
  }

  // Show option boxes for binary or three-way decisions
  if (displayedOptions.length <= 3) {
    const boxes = displayedOptions.map(opt =>
      formatOptionBox(opt, opt === chosenOption, 18).split('\n')
    );

    const maxLines = Math.max(...boxes.map(b => b.length));

    for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
      let line = '';
      for (let boxIdx = 0; boxIdx < boxes.length; boxIdx++) {
        const boxLine = boxes[boxIdx][lineIdx] || ' '.repeat(20);
        line += boxLine + '  ';
      }
      tree += line.trimEnd() + '\n';
    }
  }

  // Show chosen option box
  if (chosenOption || CHOSEN) {
    tree += '             │           │\n';
    tree += '             │           ▼\n';
    tree += '             │  ' + formatChosenBox(CHOSEN, RATIONALE, EVIDENCE).split('\n').join('\n             │  ') + '\n';
    tree += '             │           │\n';
    tree += '             └─────┬─────┘\n';
    tree += '                   │\n';
    tree += '                   ▼\n';
  }

  // Add caveats section if present
  if (CAVEATS && CAVEATS.length > 0) {
    tree += formatCaveatsBox(CAVEATS).split('\n').map(line => '     ' + line).join('\n') + '\n';
    tree += '                   │\n';
    tree += '                   ▼\n';
  }

  // Add follow-up section if present
  if (FOLLOWUP && FOLLOWUP.length > 0) {
    tree += formatFollowUpBox(FOLLOWUP).split('\n').map(line => '     ' + line).join('\n') + '\n';
    tree += '                   │\n';
    tree += '                   ▼\n';
  }

  // Terminal
  tree += '        ╭────────────────╮\n';
  tree += '        │ Decision Logged │\n';
  tree += '        ╰────────────────╯';

  return tree;
}

// ───────────────────────────────────────────────────────────────
// TEMPLATE RENDERING
// ───────────────────────────────────────────────────────────────

async function populateTemplate(templateName, data) {
  const templatePath = path.join(CONFIG.TEMPLATE_DIR, `${templateName}_template.md`);
  const template = await fs.readFile(templatePath, 'utf-8');

  // Render the template with data
  const rendered = renderTemplate(template, data);

  // Strip template configuration comments (they're for developers, not output)
  return stripTemplateConfigComments(rendered);
}

function cleanupExcessiveNewlines(text) {
  // Replace 3+ consecutive newlines with exactly 2 newlines (one blank line)
  return text.replace(/\n{3,}/g, '\n\n');
}

/**
 * Strip template configuration comments from rendered output
 * These comments are meant for template developers, not final output
 * @param {string} text - Rendered template text
 * @returns {string} Text with configuration comments removed
 */
function stripTemplateConfigComments(text) {
  // Remove the main template configuration block (multiline)
  // Matches: <!-- Template Configuration Comments (stripped during generation) -->
  // through the closing --> of the configuration section
  let result = text.replace(/<!--\s*Template Configuration Comments[\s\S]*?-->\s*\n*/g, '');

  // Remove Context Type Detection block
  result = result.replace(/<!--\s*Context Type Detection:[\s\S]*?-->\s*\n*/g, '');

  // Remove Importance Tier Guidelines block
  result = result.replace(/<!--\s*Importance Tier Guidelines:[\s\S]*?-->\s*\n*/g, '');

  // Remove Channel/Branch Association block
  result = result.replace(/<!--\s*Channel\/Branch Association:[\s\S]*?-->\s*\n*/g, '');

  // Remove SESSION CONTEXT DOCUMENTATION footer comment
  result = result.replace(/<!--\s*SESSION CONTEXT DOCUMENTATION[\s\S]*?-->\s*$/g, '');

  // Clean up any resulting excessive newlines from removed blocks
  return result.replace(/\n{3,}/g, '\n\n');
}

/**
 * Check if value should be treated as falsy in template conditionals
 * @param {*} value - Value to check
 * @returns {boolean} True if value is falsy
 */
function isFalsy(value) {
  if (value === undefined || value === null || value === false) return true;
  if (typeof value === 'string' && value.toLowerCase() === 'false') return true;
  if (typeof value === 'number' && value === 0) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function renderTemplate(template, data, parentData = {}) {
  let result = template;

  // Merge parent data with current data for nested contexts
  const mergedData = { ...parentData, ...data };

  // Array loops: {{#ARRAY}}...{{/ARRAY}} - Process these first to handle nesting
  result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
    const value = mergedData[key];

    // Handle boolean flags and falsy values consistently
    if (typeof value === 'boolean') {
      return value ? renderTemplate(content, mergedData, parentData) : '';
    }

    // Handle all falsy values consistently
    if (isFalsy(value)) {
      return '';
    }

    // Handle arrays
    if (!Array.isArray(value)) {
      // Not an array, not boolean, not undefined - treat as truthy conditional
      return renderTemplate(content, mergedData, parentData);
    }

    if (value.length === 0) {
      return '';
    }

    // Render each array item with access to parent context
    return value.map(item => {
      if (typeof item === 'object' && item !== null) {
        // Pass parent data down to nested rendering
        return renderTemplate(content, item, mergedData);
      }
      // Primitive value - create wrapper object with both ITEM and . (dot) support
      return renderTemplate(content, { ITEM: item, '.': item }, mergedData);
    }).join('');
  });

  // Inverted sections: {{^ARRAY}}...{{/ARRAY}} (render if empty/false)
  result = result.replace(/\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
    const value = mergedData[key];

    // Use consistent falsy checking
    if (isFalsy(value)) {
      return renderTemplate(content, mergedData, parentData);
    }

    return '';
  });

  // Simple variable replacement: {{VAR}} or {{.}}
  result = result.replace(/\{\{([\w.]+)\}\}/g, (match, key) => {
    const value = mergedData[key];

    if (value === undefined || value === null) {
      console.warn(`⚠️  Missing template data for: {{${key}}}`);
      return ''; // Fail-safe: return empty string instead of preserving placeholder
    }

    // Handle arrays - stringify properly instead of [object Object]
    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === 'object' && item !== null) {
          // Extract first property value or stringify
          const firstKey = Object.keys(item)[0];
          return firstKey ? item[firstKey] : JSON.stringify(item);
        }
        return String(item);
      }).join(', ');
    }

    // Handle objects - stringify properly instead of [object Object]
    if (typeof value === 'object') {
      const firstKey = Object.keys(value)[0];
      return firstKey ? value[firstKey] : JSON.stringify(value);
    }

    // Handle booleans
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return String(value);
  });

  // Clean up excessive newlines before returning
  return cleanupExcessiveNewlines(result);
}

// ───────────────────────────────────────────────────────────────
// ENTRY POINT
// ───────────────────────────────────────────────────────────────

if (require.main === module) {
  main().catch((error) => {
    console.error(`❌ Fatal error: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { main, detectSpecFolder, collectSessionData };
