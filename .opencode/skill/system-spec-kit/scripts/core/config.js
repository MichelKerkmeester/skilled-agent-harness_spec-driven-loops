// ───────────────────────────────────────────────────────────────
// CORE: CONFIGURATION
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

const path = require('path');
const fsSync = require('fs');

const CORE_DIR = __dirname;
const SCRIPTS_DIR = path.resolve(CORE_DIR, '..');

/* ─────────────────────────────────────────────────────────────
   2. CONFIG LOADER
──────────────────────────────────────────────────────────────── */

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

  const configPath = path.join(SCRIPTS_DIR, '..', 'config', 'config.jsonc');

  try {
    if (fsSync.existsSync(configPath)) {
      const configContent = fsSync.readFileSync(configPath, 'utf-8');

      const lines = configContent.split('\n');
      const jsonLines = [];
      let inJsonBlock = false;
      let braceDepth = 0;

      for (const line of lines) {
        let cleanLine = line;
        
        function isEscapedQuote(str, index) {
          if (index === 0) return false;
          let backslashCount = 0;
          let i = index - 1;
          while (i >= 0 && str[i] === '\\') {
            backslashCount++;
            i--;
          }
          return backslashCount % 2 === 1;
        }
        
        let inString = false;
        let commentStart = -1;
        for (let i = 0; i < line.length - 1; i++) {
          const char = line[i];
          if (char === '"' && !isEscapedQuote(line, i)) {
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
        
        for (const char of cleanLine) {
          if (char === '{') {
            if (!inJsonBlock) inJsonBlock = true;
            braceDepth++;
          } else if (char === '}') {
            braceDepth--;
          }
        }
        
        if (inJsonBlock) {
          jsonLines.push(cleanLine);
        }
        
        if (inJsonBlock && braceDepth === 0) {
          break;
        }
      }

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

/* ─────────────────────────────────────────────────────────────
   3. CONFIG OBJECT
──────────────────────────────────────────────────────────────── */

const userConfig = loadConfig();

const CONFIG = {
  SKILL_VERSION: '12.5.0',
  MESSAGE_COUNT_TRIGGER: 20,
  MAX_RESULT_PREVIEW: userConfig.maxResultPreview,
  MAX_CONVERSATION_MESSAGES: userConfig.maxConversationMessages,
  MAX_TOOL_OUTPUT_LINES: userConfig.maxToolOutputLines,
  TRUNCATE_FIRST_LINES: userConfig.contextPreviewHeadLines,
  TRUNCATE_LAST_LINES: userConfig.contextPreviewTailLines,
  MESSAGE_TIME_WINDOW: userConfig.messageTimeWindow,
  TIMEZONE_OFFSET_HOURS: userConfig.timezoneOffsetHours,
  TOOL_PREVIEW_LINES: 10,
  
  TEMPLATE_DIR: path.join(SCRIPTS_DIR, '..', 'templates'),
  PROJECT_ROOT: path.resolve(SCRIPTS_DIR, '..', '..', '..', '..'),
  
  // Runtime values - set by parseArguments()
  DATA_FILE: null,
  SPEC_FOLDER_ARG: null,
  
  MAX_FILES_IN_MEMORY: 10,
  MAX_OBSERVATIONS: 3,
  MIN_PROMPT_LENGTH: 60,
  MAX_CONTENT_PREVIEW: 500
};

/* ─────────────────────────────────────────────────────────────
   4. SPECS DIRECTORY UTILITIES
──────────────────────────────────────────────────────────────── */

function getSpecsDirectories() {
  return [
    path.join(CONFIG.PROJECT_ROOT, 'specs'),
    path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs')
  ];
}

function findActiveSpecsDir() {
  const possibleDirs = getSpecsDirectories();
  for (const dir of possibleDirs) {
    if (fsSync.existsSync(dir)) {
      return dir;
    }
  }
  return null;
}

function getAllExistingSpecsDirs() {
  return getSpecsDirectories().filter(dir => fsSync.existsSync(dir));
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  CONFIG,
  loadConfig,
  getSpecsDirectories,
  findActiveSpecsDir,
  getAllExistingSpecsDirs
};
