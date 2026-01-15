// ───────────────────────────────────────────────────────────────
// memory-parser.js: Memory file parsing and metadata extraction
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { escape_regex: escapeRegex } = require('../../shared/utils');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

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
  'bug': 'discovery',
  'fix': 'implementation',
  'refactor': 'implementation',
  'feature': 'implementation',
  'architecture': 'decision',
  'review': 'research',
  'test': 'implementation',
};

/* ───────────────────────────────────────────────────────────────
   2. CORE PARSING FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

// Read file with BOM detection for UTF-16 support
function read_file_with_encoding(file_path) {
  const buffer = fs.readFileSync(file_path);
  
  // Check for BOM (Byte Order Mark)
  // UTF-8 BOM: EF BB BF (must check first - 3 bytes)
  if (buffer.length >= 3 &&
      buffer[0] === 0xEF &&
      buffer[1] === 0xBB &&
      buffer[2] === 0xBF) {
    return buffer.slice(3).toString('utf-8'); // Skip 3-byte BOM
  }
  
  // UTF-16 LE BOM: FF FE
  if (buffer.length >= 2 &&
      buffer[0] === 0xFF &&
      buffer[1] === 0xFE) {
    return buffer.toString('utf16le').slice(1); // UTF-16 LE
  }
  
  // UTF-16 BE BOM: FE FF
  if (buffer.length >= 2 &&
      buffer[0] === 0xFE &&
      buffer[1] === 0xFF) {
    return buffer.toString('utf16be').slice(1); // UTF-16 BE
  }
  
  // No BOM detected, assume UTF-8
  return buffer.toString('utf-8');
}

// Parse a memory file and extract all metadata
function parse_memory_file(file_path) {
  if (!fs.existsSync(file_path)) {
    throw new Error(`Memory file not found: ${file_path}`);
  }

  const content = read_file_with_encoding(file_path);
  const spec_folder = extract_spec_folder(file_path);
  const title = extract_title(content);
  const trigger_phrases = extract_trigger_phrases(content);
  const context_type = extract_context_type(content);
  const importance_tier = extract_importance_tier(content);
  const content_hash = compute_content_hash(content);

  return {
    filePath: file_path,
    specFolder: spec_folder,
    title,
    triggerPhrases: trigger_phrases,
    contextType: context_type,
    importanceTier: importance_tier,
    contentHash: content_hash,
    content,
    fileSize: content.length,
    lastModified: fs.statSync(file_path).mtime.toISOString(),
  };
}

// Extract spec folder name from file path
function extract_spec_folder(file_path) {
  // Handle UNC paths (\\server\share or //server/share)
  let normalized_path = file_path;
  if (normalized_path.startsWith('\\\\') || normalized_path.startsWith('//')) {
    // Remove UNC prefix for pattern matching
    normalized_path = normalized_path.replace(/^(\\\\|\/\/)[^/\\]+[/\\][^/\\]+/, '');
  }
  // Normalize path separators
  normalized_path = normalized_path.replace(/\\/g, '/');

  // Match specs/XXX-name/.../memory/ pattern
  const match = normalized_path.match(/specs\/([^/]+(?:\/[^/]+)*?)\/memory\//);

  if (match) {
    return match[1];
  }

  // Fallback: try to extract from path segments
  const segments = normalized_path.split('/');
  const specs_index = segments.findIndex(s => s === 'specs');

  if (specs_index >= 0 && specs_index < segments.length - 2) {
    const memory_index = segments.indexOf('memory', specs_index);
    if (memory_index > specs_index + 1) {
      return segments.slice(specs_index + 1, memory_index).join('/');
    }
  }

  // Last resort: use parent directory name
  const parent_dir = path.dirname(path.dirname(file_path));
  return path.basename(parent_dir);
}

// Extract title from first # heading
function extract_title(content) {
  // Check YAML frontmatter first
  const yaml_match = content.match(/^---[\s\S]*?title:\s*["']?([^"'\n]+)["']?[\s\S]*?---/m);
  if (yaml_match) {
    return yaml_match[1].trim();
  }
  
  // Fall back to first # heading (skip frontmatter)
  const without_frontmatter = content.replace(/^---[\s\S]*?---\n?/, '');
  const match = without_frontmatter.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

// Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter
function extract_trigger_phrases(content) {
  const triggers = [];

  // Method 1a: Check YAML frontmatter inline format
  // Pattern: trigger_phrases: ["phrase1", "phrase2", ...]
  const inline_match = content.match(/trigger_phrases:\s*\[([^\]]+)\]/i);
  if (inline_match) {
    // Parse the array content - handle both "phrase" and 'phrase' and unquoted
    const array_content = inline_match[1];
    const phrases = array_content.match(/["']([^"']+)["']/g);
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
  if (triggers.length === 0) {
    const multi_line_match = content.match(/trigger_phrases:\s*\n((?:\s+-\s+["']?[^"'\n]+["']?\n?)+)/i);
    if (multi_line_match) {
      const multi_line_phrases = multi_line_match[1]
        .split('\n')
        .map(line => line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
      multi_line_phrases.forEach(phrase => {
        if (phrase.length > 0 && phrase.length < 100 && !triggers.includes(phrase)) {
          triggers.push(phrase);
        }
      });
    }
  }

  // Method 2: Find ## Trigger Phrases section (fallback/additional)
  const section_match = content.match(/##\s*Trigger\s*Phrases?\s*\n([\s\S]*?)(?=\n##|\n---|\n\n\n|$)/i);

  if (section_match) {
    const section_content = section_match[1];

    // Extract bullet points (- or *)
    const bullets = section_content.match(/^[\s]*[-*]\s+(.+)$/gm);

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

// Extract context type from metadata block
function extract_context_type(content) {
  // Look for > Session type: or > Context type:
  const match = content.match(/>\s*(?:Session|Context)\s*type:\s*(\w+)/i);

  if (match) {
    const type = match[1].toLowerCase();
    return CONTEXT_TYPE_MAP[type] || 'general';
  }

  // Check YAML metadata block
  const yaml_match = content.match(/context_type:\s*["']?(\w+)["']?/i);
  if (yaml_match) {
    return CONTEXT_TYPE_MAP[yaml_match[1].toLowerCase()] || 'general';
  }

  return 'general';
}

// Extract importance tier from content or metadata
function extract_importance_tier(content) {
  const valid_tiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];

  // Check YAML metadata block
  const yaml_match = content.match(/importance_tier:\s*["']?(\w+)["']?/i);
  if (yaml_match) {
    const tier = yaml_match[1].toLowerCase();
    if (valid_tiers.includes(tier)) {
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

// Compute SHA-256 hash of content for change detection
function compute_content_hash(content) {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

/* ───────────────────────────────────────────────────────────────
   3. VALIDATION FUNCTIONS
   ─────────────────────────────────────────────────────────────── */

// Check if a file path is a valid memory file
function is_memory_file(file_path) {
  const normalized_path = file_path.replace(/\\/g, '/');
  
  // Standard memory files in specs
  const is_specs_memory = (
    normalized_path.endsWith('.md') &&
    normalized_path.includes('/memory/') &&
    normalized_path.includes('/specs/')
  );
  
  // Constitutional memories in skill folder
  // These are global rules that always surface in searches
  const is_constitutional = (
    normalized_path.endsWith('.md') &&
    normalized_path.includes('/.opencode/skill/') &&
    normalized_path.includes('/constitutional/')
  );
  
  return is_specs_memory || is_constitutional;
}

// Validate anchor tags in memory content
function validate_anchors(content) {
  const warnings = [];
  const unclosed_anchors = [];

  // Find all opening anchor tags (case-insensitive)
  // Pattern: <!-- ANCHOR:id --> or <!-- anchor:id --> or <!-- ANCHOR: id -->
  const opening_pattern = /<!--\s*(?:ANCHOR|anchor):\s*([^>\s]+)\s*-->/gi;

  // Valid anchor ID pattern: alphanumeric, hyphens, and forward slashes
  // Must start with alphanumeric. Slashes allowed for spec folder paths.
  // e.g., "summary-session-xxx-003-memory-and-spec-kit/065-name"
  const VALID_ANCHOR_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-/]*$/;
  
  let match;
  while ((match = opening_pattern.exec(content)) !== null) {
    const anchor_id = match[1].trim();
    
    // Validate anchor ID format
    if (!VALID_ANCHOR_PATTERN.test(anchor_id)) {
      warnings.push(`Invalid anchor ID "${anchor_id}" - should contain only alphanumeric and hyphens, start with alphanumeric`);
    }
    
    // Check if corresponding closing tag exists
    // Pattern: <!-- /ANCHOR:id --> or <!-- /anchor:id -->
    const closing_pattern = new RegExp(
      `<!--\\s*/(?:ANCHOR|anchor):\\s*${escapeRegex(anchor_id)}\\s*-->`,
      'i'
    );
    
    if (!closing_pattern.test(content)) {
      unclosed_anchors.push(anchor_id);
      warnings.push(`Anchor "${anchor_id}" is missing closing tag <!-- /ANCHOR:${anchor_id} --> - anchor-based content extraction will fail`);
    }
  }
  
  return {
    valid: unclosed_anchors.length === 0,
    warnings,
    unclosedAnchors: unclosed_anchors,
  };
}

// Extract content from anchors
function extract_anchors(content) {
  const anchors = {};

  // Find all opening anchor tags (case-insensitive)
  // Pattern: <!-- ANCHOR:id --> or <!-- anchor:id -->
  // NOTE: Anchor IDs can contain forward slashes from spec folder paths
  //       e.g., "summary-session-xxx-003-memory-and-spec-kit/065-name"
  const anchor_regex = /<!--\s*(?:ANCHOR|anchor):\s*([a-zA-Z0-9][a-zA-Z0-9-/]*)\s*-->/gi;
  let match;
  
  while ((match = anchor_regex.exec(content)) !== null) {
    const id = match[1];
    const start_index = match.index + match[0].length;
    
    // Find the corresponding closing tag *after* the start tag
    const closing_regex = new RegExp(`<!--\\s*/(?:ANCHOR|anchor):\\s*${escapeRegex(id)}\\s*-->`, 'i');
    
    // Search from start_index to avoid finding closing tags before opening ones (though regex exec handles order)
    // We slice content to search only forward
    const remaining_content = content.slice(start_index);
    const close_match = remaining_content.match(closing_regex);
    
    if (close_match) {
      // Extract content between tags
      const inner_content = remaining_content.slice(0, close_match.index);
      anchors[id] = inner_content.trim();
    }
  }
  
  return anchors;
}

// Validate parsed memory data
function validate_parsed_memory(parsed) {
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
    const anchor_validation = validate_anchors(parsed.content);
    if (!anchor_validation.valid) {
      warnings.push(...anchor_validation.warnings);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. DIRECTORY SCANNING
   ─────────────────────────────────────────────────────────────── */

// Find all memory files in a workspace
function find_memory_files(workspace_path, options = {}) {
  const { specFolder: spec_folder = null } = options;
  const results = [];

  // Check both possible specs locations
  const specs_locations = [
    path.join(workspace_path, 'specs'),
    path.join(workspace_path, '.opencode', 'specs')
  ];

  // Recursive directory walker
  function walk_dir(dir, depth = 0) {
    if (depth > 10) {
      return; // Prevent infinite recursion
    }

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      return; // Skip unreadable directories
    }

    for (const entry of entries) {
      const full_path = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip hidden directories and node_modules
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
          continue;
        }
        walk_dir(full_path, depth + 1);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Check if it's in a memory folder
        if (full_path.includes('/memory/') || full_path.includes('\\memory\\')) {
          // Apply spec folder filter if specified
          if (spec_folder) {
            const extracted_folder = extract_spec_folder(full_path);
            if (!extracted_folder.startsWith(spec_folder)) {
              continue;
            }
          }
          results.push(full_path);
        }
      }
    }
  }

  // Scan all existing specs locations
  for (const specs_dir of specs_locations) {
    if (fs.existsSync(specs_dir)) {
      walk_dir(specs_dir);
    }
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   5. MODULE EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Core parsing
  parseMemoryFile: parse_memory_file,
  readFileWithEncoding: read_file_with_encoding,
  extractSpecFolder: extract_spec_folder,
  extractTitle: extract_title,
  extractTriggerPhrases: extract_trigger_phrases,
  extractContextType: extract_context_type,
  extractImportanceTier: extract_importance_tier,
  computeContentHash: compute_content_hash,

  // Validation
  isMemoryFile: is_memory_file,
  validateParsedMemory: validate_parsed_memory,
  validateAnchors: validate_anchors,
  extractAnchors: extract_anchors,

  // Directory scanning
  findMemoryFiles: find_memory_files,

  // Constants
  MEMORY_FILE_PATTERN,
  CONTEXT_TYPE_MAP,
};
