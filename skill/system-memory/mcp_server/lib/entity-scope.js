/**
 * Entity Scope Module - Session and context type partitioning
 *
 * This module implements entity-scoped partitioning for session and context type filtering.
 * It provides utilities for detecting context types from content or tool usage patterns,
 * generating session identifiers, and building SQL filter clauses for scoped queries.
 *
 * @module lib/entity-scope
 * @version 11.0.0
 */

'use strict';

/**
 * Valid context types for memory categorization
 * @constant {string[]}
 */
const CONTEXT_TYPES = ['research', 'implementation', 'decision', 'discovery', 'general'];

/**
 * Pattern matching for context type detection from text content
 * Each pattern targets keywords that typically indicate a specific type of work
 * @constant {Object.<string, RegExp>}
 */
const CONTEXT_PATTERNS = {
  research: /\b(research|analysis|explored|investigated|options|comparing|evaluated|studied)\b/i,
  implementation: /\b(implemented|built|created|added|fixed|coded|wrote|developed|refactored)\b/i,
  decision: /\b(decided|chose|resolved|conclusion|outcome|selected|approved|rejected)\b/i,
  discovery: /\b(found|discovered|learned|realized|noticed|understood|identified)\b/i
};

/**
 * Detect context type from content and title
 *
 * Analyzes the provided text content and title to determine the most likely
 * context type based on keyword patterns. The detection follows a priority order:
 * research > implementation > decision > discovery > general
 *
 * @param {string} content - Memory content to analyze
 * @param {string} [title=''] - Memory title (optional, used for additional context)
 * @returns {string} Detected context type from CONTEXT_TYPES
 *
 * @example
 * // Returns 'research'
 * detectContextType('We investigated several options and compared approaches');
 *
 * @example
 * // Returns 'implementation'
 * detectContextType('Added new feature', 'Feature Implementation');
 *
 * @example
 * // Returns 'general' when no patterns match
 * detectContextType('Hello world');
 */
function detectContextType(content, title = '') {
  const text = `${title} ${content}`.toLowerCase();

  for (const [type, pattern] of Object.entries(CONTEXT_PATTERNS)) {
    if (pattern.test(text)) {
      return type;
    }
  }

  return 'general';
}

/**
 * Detect context type from tool usage patterns
 *
 * Analyzes an array of tool calls to infer the type of work being performed.
 * This is useful for automatic categorization based on actual tool usage during a session.
 *
 * Detection logic:
 * - decision: Any AskUserQuestion calls present
 * - research: >50% Read/Grep/Glob tools with <10% Write/Edit
 * - implementation: >30% Write/Edit tools
 * - discovery: >20% WebSearch/WebFetch tools
 * - general: Default when no clear pattern emerges
 *
 * @param {Array<{tool: string}>} toolCalls - Array of tool call objects with tool name
 * @returns {string} Detected context type from CONTEXT_TYPES
 *
 * @example
 * // Returns 'research'
 * detectContextTypeFromTools([
 *   { tool: 'Read' },
 *   { tool: 'Grep' },
 *   { tool: 'Read' },
 *   { tool: 'Glob' }
 * ]);
 *
 * @example
 * // Returns 'implementation'
 * detectContextTypeFromTools([
 *   { tool: 'Read' },
 *   { tool: 'Edit' },
 *   { tool: 'Write' },
 *   { tool: 'Edit' }
 * ]);
 *
 * @example
 * // Returns 'decision'
 * detectContextTypeFromTools([
 *   { tool: 'Read' },
 *   { tool: 'AskUserQuestion' }
 * ]);
 */
function detectContextTypeFromTools(toolCalls) {
  if (!toolCalls || toolCalls.length === 0) {
    return 'general';
  }

  const readTools = ['Read', 'Grep', 'Glob'];
  const writeTools = ['Write', 'Edit'];
  const webTools = ['WebSearch', 'WebFetch'];

  const counts = {
    read: 0,
    write: 0,
    web: 0,
    askUser: 0,
    total: toolCalls.length
  };

  for (const call of toolCalls) {
    if (readTools.includes(call.tool)) counts.read++;
    if (writeTools.includes(call.tool)) counts.write++;
    if (webTools.includes(call.tool)) counts.web++;
    if (call.tool === 'AskUserQuestion') counts.askUser++;
  }

  // Decision: explicit user questions indicate a decision point
  if (counts.askUser > 0) {
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

/**
 * Generate a unique session ID
 *
 * Creates a unique identifier for tracking memories within a specific session.
 * The ID combines a base-36 timestamp with random characters for uniqueness.
 *
 * @returns {string} UUID-like session identifier in format 'session-{timestamp}-{random}'
 *
 * @example
 * // Returns something like 'session-lxyz123-abc45def'
 * const sessionId = generateSessionId();
 */
function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `session-${timestamp}-${random}`;
}

/**
 * Validate context type
 *
 * Checks if the provided type is a valid context type.
 *
 * @param {string} type - Context type to validate
 * @returns {boolean} True if type is valid, false otherwise
 *
 * @example
 * isValidContextType('research');    // true
 * isValidContextType('invalid');     // false
 */
function isValidContextType(type) {
  return CONTEXT_TYPES.includes(type);
}

/**
 * Build scope filter SQL clause
 *
 * Constructs a SQL WHERE clause and parameters array for filtering memories
 * based on scope criteria. Supports filtering by spec folder, session ID,
 * and context types.
 *
 * When sessionId is provided, the filter includes both session-specific memories
 * AND global memories (those with null session_id), enabling proper scoping while
 * still surfacing universally relevant information.
 *
 * @param {Object} scope - Scope filter criteria
 * @param {string} [scope.specFolder] - Filter by spec folder name
 * @param {string} [scope.sessionId] - Filter by session ID (includes null sessions)
 * @param {string[]} [scope.contextTypes=[]] - Filter by context types
 * @returns {Object} Filter object with clause and params
 * @returns {string} returns.clause - SQL WHERE clause string
 * @returns {Array} returns.params - Array of parameter values for prepared statement
 *
 * @example
 * // Filter by spec folder only
 * buildScopeFilter({ specFolder: '011-semantic-memory' });
 * // Returns: { clause: 'spec_folder = ?', params: ['011-semantic-memory'] }
 *
 * @example
 * // Filter by session (includes global memories)
 * buildScopeFilter({ sessionId: 'session-abc-123' });
 * // Returns: { clause: '(session_id = ? OR session_id IS NULL)', params: ['session-abc-123'] }
 *
 * @example
 * // Filter by multiple context types
 * buildScopeFilter({ contextTypes: ['research', 'decision'] });
 * // Returns: { clause: 'context_type IN (?, ?)', params: ['research', 'decision'] }
 *
 * @example
 * // Combined filters
 * buildScopeFilter({
 *   specFolder: '011-semantic-memory',
 *   sessionId: 'session-abc-123',
 *   contextTypes: ['implementation']
 * });
 * // Returns: {
 * //   clause: 'spec_folder = ? AND (session_id = ? OR session_id IS NULL) AND context_type IN (?)',
 * //   params: ['011-semantic-memory', 'session-abc-123', 'implementation']
 * // }
 *
 * @example
 * // Empty scope returns always-true clause
 * buildScopeFilter({});
 * // Returns: { clause: '1=1', params: [] }
 */
function buildScopeFilter(scope) {
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
    const validTypes = contextTypes.filter(isValidContextType);
    if (validTypes.length > 0) {
      const placeholders = validTypes.map(() => '?').join(', ');
      conditions.push(`context_type IN (${placeholders})`);
      params.push(...validTypes);
    }
  }

  const clause = conditions.length > 0 ? conditions.join(' AND ') : '1=1';

  return { clause, params };
}

module.exports = {
  CONTEXT_TYPES,
  detectContextType,
  detectContextTypeFromTools,
  generateSessionId,
  isValidContextType,
  buildScopeFilter
};
