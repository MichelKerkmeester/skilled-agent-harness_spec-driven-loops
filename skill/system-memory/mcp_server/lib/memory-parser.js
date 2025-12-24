/**
 * Memory Parser Module - Parse memory files for indexing
 *
 * Extracts metadata from memory markdown files including:
 * - Title from first # heading
 * - Spec folder from file path
 * - Trigger phrases from ## Trigger Phrases section
 * - Context type from metadata block
 * - Content hash for change detection
 *
 * @module lib/memory-parser
 * @version 1.0.0
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const MEMORY_FILE_PATTERN = /specs\/([^/]+)(?:\/[^/]+)*\/memory\/[^/]+\.md$/;
const CONTEXT_TYPE_MAP = {
  'implementation': 'implementation',
  'research': 'research',
  'decision': 'decision',
  'discovery': 'discovery',
  'general': 'general',
  'debug': 'implementation',
  'analysis': 'research',
  'planning': 'decision',
  // Additional mappings
  'bug': 'discovery',
  'fix': 'implementation',
  'refactor': 'implementation',
  'feature': 'implementation',
  'architecture': 'decision',
  'review': 'research',
  'test': 'implementation'
};

// ───────────────────────────────────────────────────────────────
// CORE PARSING FUNCTIONS
// ───────────────────────────────────────────────────────────────

/**
 * Read file with BOM detection for UTF-16 support
 *
 * @param {string} filePath - Path to file
 * @returns {string} File content as string
 */
function readFileWithEncoding(filePath) {
  const buffer = fs.readFileSync(filePath);
  // Check for BOM
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    return buffer.toString('utf16le').slice(1); // UTF-16 LE
  }
  if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
    return buffer.toString('utf16be').slice(1); // UTF-16 BE
  }
  return buffer.toString('utf-8');
}

/**
 * Parse a memory file and extract all metadata
 *
 * @param {string} filePath - Absolute path to memory file
 * @returns {Object} Parsed memory data
 * @throws {Error} If file cannot be read or parsed
 */
function parseMemoryFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Memory file not found: ${filePath}`);
  }

  const content = readFileWithEncoding(filePath);
  const specFolder = extractSpecFolder(filePath);
  const title = extractTitle(content);
  const triggerPhrases = extractTriggerPhrases(content);
  const contextType = extractContextType(content);
  const importanceTier = extractImportanceTier(content);
  const contentHash = computeContentHash(content);

  return {
    filePath,
    specFolder,
    title,
    triggerPhrases,
    contextType,
    importanceTier,
    contentHash,
    content,
    fileSize: content.length,
    lastModified: fs.statSync(filePath).mtime.toISOString()
  };
}

/**
 * Extract spec folder name from file path
 *
 * @param {string} filePath - Path like /path/specs/005-memory/001-task/memory/file.md
 * @returns {string} Spec folder name (e.g., "005-memory/001-task")
 */
function extractSpecFolder(filePath) {
  // Handle UNC paths (\\server\share or //server/share)
  let normalizedPath = filePath;
  if (normalizedPath.startsWith('\\\\') || normalizedPath.startsWith('//')) {
    // Remove UNC prefix for pattern matching
    normalizedPath = normalizedPath.replace(/^(\\\\|\/\/)[^/\\]+[/\\][^/\\]+/, '');
  }
  // Normalize path separators
  normalizedPath = normalizedPath.replace(/\\/g, '/');

  // Match specs/XXX-name/.../memory/ pattern
  const match = normalizedPath.match(/specs\/([^/]+(?:\/[^/]+)*?)\/memory\//);

  if (match) {
    return match[1];
  }

  // Fallback: try to extract from path segments
  const segments = normalizedPath.split('/');
  const specsIndex = segments.findIndex(s => s === 'specs');

  if (specsIndex >= 0 && specsIndex < segments.length - 2) {
    const memoryIndex = segments.indexOf('memory', specsIndex);
    if (memoryIndex > specsIndex + 1) {
      return segments.slice(specsIndex + 1, memoryIndex).join('/');
    }
  }

  // Last resort: use parent directory name
  const parentDir = path.dirname(path.dirname(filePath));
  return path.basename(parentDir);
}

/**
 * Extract title from first # heading
 *
 * @param {string} content - File content
 * @returns {string|null} Title or null if not found
 */
function extractTitle(content) {
  // Check YAML frontmatter first
  const yamlMatch = content.match(/^---[\s\S]*?title:\s*["']?([^"'\n]+)["']?[\s\S]*?---/m);
  if (yamlMatch) return yamlMatch[1].trim();
  
  // Fall back to first # heading (skip frontmatter)
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, '');
  const match = withoutFrontmatter.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter
 *
 * Supports two formats:
 * 1. YAML frontmatter: trigger_phrases: ["phrase1", "phrase2"]
 * 2. Markdown section: ## Trigger Phrases with bullet points
 *
 * @param {string} content - File content
 * @returns {string[]} Array of trigger phrases
 */
function extractTriggerPhrases(content) {
  const triggers = [];

  // Method 1a: Check YAML frontmatter inline format
  // Pattern: trigger_phrases: ["phrase1", "phrase2", ...]
  const inlineMatch = content.match(/trigger_phrases:\s*\[([^\]]+)\]/i);
  if (inlineMatch) {
    // Parse the array content - handle both "phrase" and 'phrase' and unquoted
    const arrayContent = inlineMatch[1];
    const phrases = arrayContent.match(/["']([^"']+)["']/g);
    if (phrases) {
      phrases.forEach(p => {
        const cleaned = p.replace(/^["']|["']$/g, '').trim();
        if (cleaned.length > 0 && cleaned.length < 100) {
          triggers.push(cleaned);
        }
      });
    }
  }

  // Method 1b: Check YAML frontmatter multi-line format
  // Pattern:
  // trigger_phrases:
  //   - "phrase one"
  //   - "phrase two"
  if (triggers.length === 0) {
    const multiLineMatch = content.match(/trigger_phrases:\s*\n((?:\s+-\s+["']?[^"'\n]+["']?\n?)+)/i);
    if (multiLineMatch) {
      const multiLinePhrases = multiLineMatch[1]
        .split('\n')
        .map(line => line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
      multiLinePhrases.forEach(phrase => {
        if (phrase.length > 0 && phrase.length < 100 && !triggers.includes(phrase)) {
          triggers.push(phrase);
        }
      });
    }
  }

  // Method 2: Find ## Trigger Phrases section (fallback/additional)
  const sectionMatch = content.match(/##\s*Trigger\s*Phrases?\s*\n([\s\S]*?)(?=\n##|\n---|\n\n\n|$)/i);

  if (sectionMatch) {
    const sectionContent = sectionMatch[1];

    // Extract bullet points (- or *)
    const bullets = sectionContent.match(/^[\s]*[-*]\s+(.+)$/gm);

    if (bullets) {
      bullets.forEach(line => {
        const phrase = line.replace(/^[\s]*[-*]\s+/, '').trim();
        if (phrase.length > 0 && phrase.length < 100 && !triggers.includes(phrase)) {
          triggers.push(phrase);
        }
      });
    }
  }

  return triggers;
}

/**
 * Extract context type from metadata block
 *
 * @param {string} content - File content
 * @returns {string} Context type (default: 'general')
 */
function extractContextType(content) {
  // Look for > Session type: or > Context type:
  const match = content.match(/>\s*(?:Session|Context)\s*type:\s*(\w+)/i);

  if (match) {
    const type = match[1].toLowerCase();
    return CONTEXT_TYPE_MAP[type] || 'general';
  }

  // Check YAML metadata block
  const yamlMatch = content.match(/context_type:\s*["']?(\w+)["']?/i);
  if (yamlMatch) {
    return CONTEXT_TYPE_MAP[yamlMatch[1].toLowerCase()] || 'general';
  }

  return 'general';
}

/**
 * Extract importance tier from content or metadata
 *
 * @param {string} content - File content
 * @returns {string} Importance tier (default: 'normal')
 */
function extractImportanceTier(content) {
  const validTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];

  // Check YAML metadata block
  const yamlMatch = content.match(/importance_tier:\s*["']?(\w+)["']?/i);
  if (yamlMatch) {
    const tier = yamlMatch[1].toLowerCase();
    if (validTiers.includes(tier)) {
      return tier;
    }
  }

  // Check for tier markers in content
  if (content.includes('[CONSTITUTIONAL]') || content.includes('importance: constitutional')) {
    return 'constitutional';
  }
  if (content.includes('[CRITICAL]') || content.includes('importance: critical')) {
    return 'critical';
  }
  if (content.includes('[IMPORTANT]') || content.includes('importance: important')) {
    return 'important';
  }

  return 'normal';
}

/**
 * Compute SHA-256 hash of content for change detection
 *
 * @param {string} content - File content
 * @returns {string} SHA-256 hash (hex)
 */
function computeContentHash(content) {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

// ───────────────────────────────────────────────────────────────
// VALIDATION FUNCTIONS
// ───────────────────────────────────────────────────────────────

/**
 * Check if a file path is a valid memory file
 *
 * @param {string} filePath - Path to check
 * @returns {boolean} True if valid memory file path
 */
function isMemoryFile(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return (
    normalizedPath.endsWith('.md') &&
    normalizedPath.includes('/memory/') &&
    normalizedPath.includes('/specs/')
  );
}

/**
 * Validate anchor tags in memory content
 * 
 * Checks that all opening anchor tags have corresponding closing tags.
 * Anchors without closing tags will cause memory_load(anchorId) to fail.
 * 
 * @param {string} content - File content to validate
 * @returns {Object} { valid: boolean, warnings: string[], unclosedAnchors: string[] }
 */
function validateAnchors(content) {
  const warnings = [];
  const unclosedAnchors = [];
  
  // Find all opening anchor tags (case-insensitive)
  // Pattern: <!-- ANCHOR:id --> or <!-- anchor:id --> or <!-- ANCHOR: id -->
  const openingPattern = /<!--\s*(?:ANCHOR|anchor):\s*([^>\s]+)\s*-->/gi;
  
  // Valid anchor ID pattern: alphanumeric and hyphens, must start with alphanumeric
  const VALID_ANCHOR_PATTERN = /^[a-zA-Z0-9][-a-zA-Z0-9]*$/;
  
  let match;
  while ((match = openingPattern.exec(content)) !== null) {
    const anchorId = match[1].trim();
    
    // Validate anchor ID format
    if (!VALID_ANCHOR_PATTERN.test(anchorId)) {
      warnings.push(`Invalid anchor ID "${anchorId}" - should contain only alphanumeric and hyphens, start with alphanumeric`);
    }
    
    // Check if corresponding closing tag exists
    // Pattern: <!-- /ANCHOR:id --> or <!-- /anchor:id -->
    const closingPattern = new RegExp(
      `<!--\\s*/(?:ANCHOR|anchor):\\s*${escapeRegex(anchorId)}\\s*-->`,
      'i'
    );
    
    if (!closingPattern.test(content)) {
      unclosedAnchors.push(anchorId);
      warnings.push(`Anchor "${anchorId}" is missing closing tag <!-- /ANCHOR:${anchorId} --> - memory_load(anchorId) will fail`);
    }
  }
  
  return {
    valid: unclosedAnchors.length === 0,
    warnings,
    unclosedAnchors
  };
}

/**
 * Escape special regex characters in a string
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for use in RegExp
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate parsed memory data
 *
 * @param {Object} parsed - Parsed memory data
 * @returns {Object} { valid: boolean, errors: string[], warnings: string[] }
 */
function validateParsedMemory(parsed) {
  const errors = [];
  const warnings = [];
  const MIN_CONTENT_LENGTH = 5; // Allow minimal files

  if (!parsed.specFolder) {
    errors.push('Missing spec folder');
  }

  if (!parsed.content || parsed.content.length < MIN_CONTENT_LENGTH) {
    errors.push(`Content too short (min ${MIN_CONTENT_LENGTH} chars)`);
  }

  if (parsed.content && parsed.content.length > 100000) {
    errors.push('Content too long (max 100KB)');
  }

  // Validate anchors (warnings only - don't block indexing)
  if (parsed.content) {
    const anchorValidation = validateAnchors(parsed.content);
    if (!anchorValidation.valid) {
      warnings.push(...anchorValidation.warnings);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// ───────────────────────────────────────────────────────────────
// DIRECTORY SCANNING
// ───────────────────────────────────────────────────────────────

/**
 * Find all memory files in a workspace
 *
 * @param {string} workspacePath - Root workspace path
 * @param {Object} [options] - Options
 * @param {string} [options.specFolder] - Limit to specific spec folder
 * @returns {string[]} Array of absolute file paths
 */
function findMemoryFiles(workspacePath, options = {}) {
  const { specFolder = null } = options;
  const results = [];

  const specsDir = path.join(workspacePath, 'specs');
  if (!fs.existsSync(specsDir)) {
    return results;
  }

  // Recursive directory walker
  function walkDir(dir, depth = 0) {
    if (depth > 10) return; // Prevent infinite recursion

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      return; // Skip unreadable directories
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip hidden directories and node_modules
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
          continue;
        }
        walkDir(fullPath, depth + 1);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Check if it's in a memory folder
        if (fullPath.includes('/memory/') || fullPath.includes('\\memory\\')) {
          // Apply spec folder filter if specified
          if (specFolder) {
            const extractedFolder = extractSpecFolder(fullPath);
            if (!extractedFolder.startsWith(specFolder)) {
              continue;
            }
          }
          results.push(fullPath);
        }
      }
    }
  }

  walkDir(specsDir);
  return results;
}

// ───────────────────────────────────────────────────────────────
// MODULE EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  // Core parsing
  parseMemoryFile,
  readFileWithEncoding,
  extractSpecFolder,
  extractTitle,
  extractTriggerPhrases,
  extractContextType,
  extractImportanceTier,
  computeContentHash,

  // Validation
  isMemoryFile,
  validateParsedMemory,
  validateAnchors,

  // Directory scanning
  findMemoryFiles,

  // Constants
  MEMORY_FILE_PATTERN,
  CONTEXT_TYPE_MAP
};
