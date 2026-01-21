// ───────────────────────────────────────────────────────────────
// PARSING: ENTITY SCOPE
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONSTANTS
──────────────────────────────────────────────────────────────── */

const CONTEXT_TYPES = ['research', 'implementation', 'decision', 'discovery', 'general'];

// Pattern matching for context type detection from text content
const CONTEXT_PATTERNS = {
  research: /\b(research|analysis|explored|investigated|options|comparing|evaluated|studied)\b/i,
  implementation: /\b(implemented|built|created|added|fixed|coded|wrote|developed|refactored)\b/i,
  decision: /\b(decided|chose|resolved|conclusion|outcome|selected|approved|rejected)\b/i,
  discovery: /\b(found|discovered|learned|realized|noticed|understood|identified)\b/i,
};

/* ─────────────────────────────────────────────────────────────
   2. CONTEXT DETECTION
──────────────────────────────────────────────────────────────── */

// Detect context type from content and title (priority: research > implementation > decision > discovery > general)
function detect_context_type(content, title = '') {
  const text = `${title} ${content}`.toLowerCase();

  for (const [type, pattern] of Object.entries(CONTEXT_PATTERNS)) {
    if (pattern.test(text)) {
      return type;
    }
  }

  return 'general';
}

// Detect context type from tool usage patterns
// decision: AskUserQuestion calls | research: >50% Read/Grep/Glob | implementation: >30% Write/Edit | discovery: >20% WebSearch/WebFetch
function detect_context_type_from_tools(tool_calls) {
  if (!tool_calls || tool_calls.length === 0) {
    return 'general';
  }

  const read_tools = ['Read', 'Grep', 'Glob'];
  const write_tools = ['Write', 'Edit'];
  const web_tools = ['WebSearch', 'WebFetch'];

  const counts = {
    read: 0,
    write: 0,
    web: 0,
    ask_user: 0,
    total: tool_calls.length,
  };

  for (const call of tool_calls) {
    if (read_tools.includes(call.tool)) counts.read++;
    if (write_tools.includes(call.tool)) counts.write++;
    if (web_tools.includes(call.tool)) counts.web++;
    if (call.tool === 'AskUserQuestion') counts.ask_user++;
  }

  // Decision: explicit user questions indicate a decision point
  if (counts.ask_user > 0) {
    return 'decision';
  }

  // Research: >50% Read/Grep/Glob, minimal writes
  if (counts.read / counts.total > 0.5 && counts.write / counts.total < 0.1) {
    return 'research';
  }

  // Implementation: >30% Write/Edit indicates active development
  if (counts.write / counts.total > 0.3) {
    return 'implementation';
  }

  // Discovery: significant web usage indicates external research
  if (counts.web / counts.total > 0.2) {
    return 'discovery';
  }

  return 'general';
}

/* ─────────────────────────────────────────────────────────────
   3. SESSION MANAGEMENT
──────────────────────────────────────────────────────────────── */

// Generate unique session ID (format: 'session-{timestamp}-{random}')
function generate_session_id() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `session-${timestamp}-${random}`;
}

// Validate context type
function is_valid_context_type(type) {
  return CONTEXT_TYPES.includes(type);
}

/* ─────────────────────────────────────────────────────────────
   4. SCOPE FILTERING
──────────────────────────────────────────────────────────────── */

// Build SQL WHERE clause for filtering by scope (specFolder, sessionId, contextTypes)
// When sessionId provided, includes both session-specific AND global (null) memories
function build_scope_filter(scope) {
  const { specFolder, sessionId, contextTypes = [] } = scope;

  const conditions = [];
  const params = [];

  if (specFolder) {
    conditions.push('spec_folder = ?');
    params.push(specFolder);
  }

  if (sessionId) {
    // Include both session-specific and global (null session) memories
    conditions.push('(session_id = ? OR session_id IS NULL)');
    params.push(sessionId);
  }

  if (contextTypes.length > 0) {
    const valid_types = contextTypes.filter(is_valid_context_type);
    if (valid_types.length > 0) {
      const placeholders = valid_types.map(() => '?').join(', ');
      conditions.push(`context_type IN (${placeholders})`);
      params.push(...valid_types);
    }
  }

  const clause = conditions.length > 0 ? conditions.join(' AND ') : '1=1';

  return { clause, params };
}

/* ─────────────────────────────────────────────────────────────
   5. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Constants
  CONTEXT_TYPES,

  // Core functions
  detect_context_type,
  detect_context_type_from_tools,
  generate_session_id,
  is_valid_context_type,
  build_scope_filter,
};
