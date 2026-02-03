// ───────────────────────────────────────────────────────────────
// VALIDATION: PREFLIGHT QUALITY GATES
// ───────────────────────────────────────────────────────────────
'use strict';

const crypto = require('crypto');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

const PreflightErrorCodes = {
  ANCHOR_FORMAT_INVALID: 'PF001',
  ANCHOR_UNCLOSED: 'PF002',
  ANCHOR_ID_INVALID: 'PF003',
  DUPLICATE_DETECTED: 'PF010',
  DUPLICATE_EXACT: 'PF011',
  DUPLICATE_SIMILAR: 'PF012',
  TOKEN_BUDGET_EXCEEDED: 'PF020',
  TOKEN_BUDGET_WARNING: 'PF021',
  CONTENT_TOO_LARGE: 'PF030',
  CONTENT_TOO_SMALL: 'PF031',
};

const PREFLIGHT_CONFIG = {
  // Token budget estimation (~3.5 chars/token for mixed content)
  chars_per_token: parseFloat(process.env.MCP_CHARS_PER_TOKEN || '3.5'),
  max_tokens_per_memory: parseInt(process.env.MCP_MAX_MEMORY_TOKENS || '8000', 10),
  warning_threshold: parseFloat(process.env.MCP_TOKEN_WARNING_THRESHOLD || '0.8'),

  // Content size limits
  min_content_length: parseInt(process.env.MCP_MIN_CONTENT_LENGTH || '10', 10),
  max_content_length: parseInt(process.env.MCP_MAX_CONTENT_LENGTH || '100000', 10),

  // Duplicate detection thresholds
  exact_duplicate_enabled: true,
  similar_duplicate_threshold: parseFloat(process.env.MCP_DUPLICATE_THRESHOLD || '0.95'),

  // Anchor validation
  anchor_validation_strict: process.env.MCP_ANCHOR_STRICT === 'true',
};

/* ─────────────────────────────────────────────────────────────
   2. PREFLIGHT ERROR CLASS
────────────────────────────────────────────────────────────────*/

class PreflightError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'PreflightError';
    this.code = code;
    this.details = details;
    this.recoverable = details.recoverable ?? false;
    this.suggestion = details.suggestion ?? null;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      recoverable: this.recoverable,
      suggestion: this.suggestion,
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   3. ANCHOR FORMAT VALIDATION
────────────────────────────────────────────────────────────────*/

const VALID_ANCHOR_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-/]*$/;
const ANCHOR_OPENING_PATTERN = /<!--\s*(?:ANCHOR|anchor):\s*([^>\s]+)\s*-->/gi;

function validate_anchor_format(content, options = {}) {
  const { strict = PREFLIGHT_CONFIG.anchor_validation_strict } = options;

  const result = {
    valid: true,
    errors: [],
    warnings: [],
    anchors: [],
  };

  if (!content || typeof content !== 'string') {
    result.warnings.push('No content provided for anchor validation');
    return result;
  }

  // Find all opening anchor tags
  const opening_tags = [];
  let match;
  const pattern = new RegExp(ANCHOR_OPENING_PATTERN.source, 'gi');

  while ((match = pattern.exec(content)) !== null) {
    const anchor_id = match[1].trim();
    const position = match.index;

    opening_tags.push({ id: anchor_id, position, full_match: match[0] });
  }

  // Track seen anchor IDs for duplicate detection
  const seen_ids = new Set();

  for (const tag of opening_tags) {
    const { id: anchor_id, position } = tag;

    // Check for duplicate anchor IDs
    if (seen_ids.has(anchor_id)) {
      const error_msg = `Duplicate anchor ID "${anchor_id}" - each anchor must be unique`;
      result.errors.push({
        code: PreflightErrorCodes.ANCHOR_FORMAT_INVALID,
        message: error_msg,
        anchor_id,
        suggestion: `Rename one of the duplicate anchors to a unique ID`,
      });
      result.valid = false;
      continue;
    }
    seen_ids.add(anchor_id);

    // Validate anchor ID format
    if (!VALID_ANCHOR_ID_PATTERN.test(anchor_id)) {
      const error_msg = `Invalid anchor ID "${anchor_id}" - must start with alphanumeric and contain only alphanumeric, hyphens, or slashes`;
      result.errors.push({
        code: PreflightErrorCodes.ANCHOR_ID_INVALID,
        message: error_msg,
        anchor_id,
        suggestion: `Use format like "summary", "decisions-001", or "spec-folder/section"`,
      });
      result.valid = false;
      continue;
    }

    // Check for corresponding closing tag
    // Pattern: <!-- /ANCHOR:id --> or <!-- /anchor:id -->
    const escape_regex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const closing_pattern = new RegExp(
      `<!--\\s*/(?:ANCHOR|anchor):\\s*${escape_regex(anchor_id)}\\s*-->`,
      'i'
    );

    // Search for closing tag AFTER the opening tag
    const content_after_open = content.slice(position + tag.full_match.length);
    const has_closing = closing_pattern.test(content_after_open);

    if (!has_closing) {
      const error_msg = `Anchor "${anchor_id}" is missing closing tag <!-- /ANCHOR:${anchor_id} -->`;
      result.errors.push({
        code: PreflightErrorCodes.ANCHOR_UNCLOSED,
        message: error_msg,
        anchor_id,
        suggestion: `Add closing tag: <!-- /ANCHOR:${anchor_id} --> after the anchor content`,
      });
      result.valid = false;
    } else {
      // Valid anchor
      result.anchors.push(anchor_id);
    }
  }

  // In strict mode, throw on any validation errors
  if (strict && !result.valid) {
    const error = new PreflightError(
      PreflightErrorCodes.ANCHOR_FORMAT_INVALID,
      `Anchor validation failed: ${result.errors.length} error(s)`,
      {
        errors: result.errors,
        recoverable: true,
        suggestion: 'Fix anchor format issues and retry',
      }
    );
    throw error;
  }

  return result;
}

/* ─────────────────────────────────────────────────────────────
   4. DUPLICATE DETECTION
────────────────────────────────────────────────────────────────*/

function compute_content_hash(content) {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

function check_duplicate(params, options = {}) {
  const {
    content,
    content_hash: provided_hash,
    spec_folder,
    database,
    find_similar,
    embedding,
  } = params;

  const {
    check_exact = PREFLIGHT_CONFIG.exact_duplicate_enabled,
    check_similar = false,
    similarity_threshold = PREFLIGHT_CONFIG.similar_duplicate_threshold,
  } = options;

  const result = {
    is_duplicate: false,
    duplicate_type: null,
    existing_id: null,
    existing_path: null,
    similarity: null,
    content_hash: null,
  };

  // Compute content hash if not provided
  const content_hash = provided_hash || compute_content_hash(content);
  result.content_hash = content_hash;

  // Check 1: Exact duplicate via content hash (fast)
  if (check_exact && database) {
    try {
      const sql = spec_folder
        ? 'SELECT id, file_path FROM memory_index WHERE content_hash = ? AND spec_folder = ? LIMIT 1'
        : 'SELECT id, file_path FROM memory_index WHERE content_hash = ? LIMIT 1';

      const params_array = spec_folder ? [content_hash, spec_folder] : [content_hash];
      const existing = database.prepare(sql).get(...params_array);

      if (existing) {
        result.is_duplicate = true;
        result.duplicate_type = 'exact';
        result.existing_id = existing.id;
        result.existing_path = existing.file_path;
        result.similarity = 1.0;
        return result;
      }
    } catch (err) {
      // Non-fatal: log and continue with other checks
      console.warn('[preflight] Exact duplicate check failed:', err.message);
    }
  }

  // Check 2: Similar duplicate via vector similarity (requires embedding)
  if (check_similar && find_similar && embedding) {
    try {
      const candidates = find_similar(embedding, {
        limit: 1,
        specFolder: spec_folder,
      });

      if (candidates && candidates.length > 0) {
        const best_match = candidates[0];
        const similarity = best_match.similarity;

        if (similarity >= similarity_threshold) {
          result.is_duplicate = true;
          result.duplicate_type = 'similar';
          result.existing_id = best_match.id;
          result.existing_path = best_match.file_path;
          result.similarity = similarity;
          return result;
        }
      }
    } catch (err) {
      // Non-fatal: log and continue
      console.warn('[preflight] Similar duplicate check failed:', err.message);
    }
  }

  return result;
}

/* ─────────────────────────────────────────────────────────────
   5. TOKEN BUDGET ESTIMATION
────────────────────────────────────────────────────────────────*/

function estimate_tokens(content) {
  if (!content) return 0;
  const text = typeof content === 'string' ? content : JSON.stringify(content);
  return Math.max(1, Math.ceil(text.length / PREFLIGHT_CONFIG.chars_per_token));
}

function check_token_budget(content, options = {}) {
  const {
    max_tokens = PREFLIGHT_CONFIG.max_tokens_per_memory,
    warning_threshold = PREFLIGHT_CONFIG.warning_threshold,
    include_embedding_overhead = true,
  } = options;

  const result = {
    within_budget: true,
    estimated_tokens: 0,
    max_tokens,
    percentage_used: 0,
    warnings: [],
    errors: [],
  };

  if (!content) {
    result.warnings.push('No content provided for token budget check');
    return result;
  }

  // Estimate tokens for content
  let estimated = estimate_tokens(content);

  // Add overhead for embedding API call (context + response)
  if (include_embedding_overhead) {
    // Embedding APIs typically have overhead of ~100-200 tokens for request/response wrapper
    const embedding_overhead = 150;
    estimated += embedding_overhead;
  }

  result.estimated_tokens = estimated;
  result.percentage_used = estimated / max_tokens;

  // Check if over budget
  if (estimated > max_tokens) {
    result.within_budget = false;
    result.errors.push({
      code: PreflightErrorCodes.TOKEN_BUDGET_EXCEEDED,
      message: `Content exceeds token budget: ${estimated} tokens (max: ${max_tokens})`,
      suggestion: `Reduce content by approximately ${estimated - max_tokens} tokens (${Math.ceil((estimated - max_tokens) * PREFLIGHT_CONFIG.chars_per_token)} characters)`,
    });
  }
  // Check if approaching budget
  else if (result.percentage_used >= warning_threshold) {
    result.warnings.push({
      code: PreflightErrorCodes.TOKEN_BUDGET_WARNING,
      message: `Content is ${Math.round(result.percentage_used * 100)}% of token budget (${estimated}/${max_tokens} tokens)`,
      suggestion: 'Consider splitting into smaller memories for better retrieval',
    });
  }

  return result;
}

/* ─────────────────────────────────────────────────────────────
   6. CONTENT SIZE VALIDATION
────────────────────────────────────────────────────────────────*/

function validate_content_size(content, options = {}) {
  const {
    min_length = PREFLIGHT_CONFIG.min_content_length,
    max_length = PREFLIGHT_CONFIG.max_content_length,
  } = options;

  const result = {
    valid: true,
    content_length: 0,
    errors: [],
  };

  if (!content || typeof content !== 'string') {
    result.valid = false;
    result.errors.push({
      code: PreflightErrorCodes.CONTENT_TOO_SMALL,
      message: 'Content is empty or invalid',
      suggestion: 'Provide valid content for the memory file',
    });
    return result;
  }

  result.content_length = content.length;

  if (content.length < min_length) {
    result.valid = false;
    result.errors.push({
      code: PreflightErrorCodes.CONTENT_TOO_SMALL,
      message: `Content too short: ${content.length} chars (min: ${min_length})`,
      suggestion: `Add at least ${min_length - content.length} more characters`,
    });
  }

  if (content.length > max_length) {
    result.valid = false;
    result.errors.push({
      code: PreflightErrorCodes.CONTENT_TOO_LARGE,
      message: `Content too large: ${content.length} chars (max: ${max_length})`,
      suggestion: `Reduce content by ${content.length - max_length} characters or split into multiple memories`,
    });
  }

  return result;
}

/* ─────────────────────────────────────────────────────────────
   7. UNIFIED PREFLIGHT CHECK
────────────────────────────────────────────────────────────────*/

function run_preflight(params, options = {}) {
  const {
    content,
    file_path,
    spec_folder,
    database,
    find_similar,
    embedding,
  } = params;

  const {
    dry_run = false,
    check_anchors = true,
    check_duplicates = true,
    check_similar = false,
    check_tokens = true,
    check_size = true,
    strict_anchors = false,
  } = options;

  const result = {
    pass: true,
    dry_run,
    errors: [],
    warnings: [],
    details: {
      file_path,
      spec_folder,
      checks_run: [],
    },
  };

  // Track which checks were run
  const add_check = (name, check_result) => {
    result.details.checks_run.push(name);
    result.details[name] = check_result;
  };

  // 1. Content size validation (fast, do first)
  if (check_size) {
    const size_result = validate_content_size(content);
    add_check('content_size', size_result);

    if (!size_result.valid) {
      result.pass = false;
      result.errors.push(...size_result.errors);
    }
  }

  // 2. Anchor format validation
  if (check_anchors && content) {
    const anchor_result = validate_anchor_format(content, { strict: strict_anchors });
    add_check('anchor_format', anchor_result);

    if (!anchor_result.valid) {
      // Anchor errors are warnings by default unless strict mode
      if (strict_anchors) {
        result.pass = false;
        result.errors.push(...anchor_result.errors);
      } else {
        result.warnings.push(...anchor_result.errors);
      }
    }
    if (anchor_result.warnings.length > 0) {
      result.warnings.push(...anchor_result.warnings);
    }
  }

  // 3. Token budget estimation
  if (check_tokens && content) {
    const token_result = check_token_budget(content);
    add_check('token_budget', token_result);

    if (!token_result.within_budget) {
      result.pass = false;
      result.errors.push(...token_result.errors);
    }
    if (token_result.warnings.length > 0) {
      result.warnings.push(...token_result.warnings);
    }
  }

  // 4. Duplicate detection
  if (check_duplicates && content) {
    const dup_result = check_duplicate(
      { content, spec_folder, database, find_similar, embedding },
      { check_exact: true, check_similar }
    );
    add_check('duplicate_check', dup_result);

    if (dup_result.is_duplicate) {
      // Exact duplicates block save
      if (dup_result.duplicate_type === 'exact') {
        result.pass = false;
        result.errors.push({
          code: PreflightErrorCodes.DUPLICATE_EXACT,
          message: `Exact duplicate found: memory #${dup_result.existing_id}`,
          existing_id: dup_result.existing_id,
          existing_path: dup_result.existing_path,
          suggestion: 'Use force=true to re-index, or delete the existing memory first',
        });
      }
      // Similar duplicates are warnings (PE-gating handles them)
      else if (dup_result.duplicate_type === 'similar') {
        result.warnings.push({
          code: PreflightErrorCodes.DUPLICATE_SIMILAR,
          message: `Similar memory found: #${dup_result.existing_id} (${Math.round(dup_result.similarity * 100)}% similar)`,
          existing_id: dup_result.existing_id,
          similarity: dup_result.similarity,
          suggestion: 'Memory may be reinforced or updated instead of created (PE-gating)',
        });
      }
    }
  }

  // In dry-run mode, never actually block - just report
  if (dry_run) {
    result.pass = true;
    result.dry_run_would_pass = result.errors.length === 0;
  }

  return result;
}

/* ─────────────────────────────────────────────────────────────
   8. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Configuration
  PREFLIGHT_CONFIG,
  PreflightErrorCodes,

  // Error class
  PreflightError,

  // Individual validators
  validate_anchor_format,
  check_duplicate,
  check_token_budget,
  validate_content_size,

  // Utility functions
  compute_content_hash,
  estimate_tokens,

  // Unified preflight
  run_preflight,

  // Backward compatibility aliases (camelCase)
  validateAnchorFormat: validate_anchor_format,
  checkDuplicate: check_duplicate,
  checkTokenBudget: check_token_budget,
  validateContentSize: validate_content_size,
  computeContentHash: compute_content_hash,
  estimateTokens: estimate_tokens,
  runPreflight: run_preflight,
};
