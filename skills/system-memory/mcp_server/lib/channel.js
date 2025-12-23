/**
 * Channel Module - Git branch-based context organization
 * @module lib/channel
 * @version 11.0.0
 *
 * This module implements automatic context switching based on git branches.
 * Memories are organized by "channels" derived from the current git branch,
 * enabling branch-specific context that follows the developer's workflow.
 */

'use strict';

const { execSync } = require('child_process');

// Default channel when git is unavailable
const DEFAULT_CHANNEL = 'default';

// Cache for branch detection (avoid repeated git calls)
let cachedBranch = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 5000; // 5 second cache

/**
 * Derive channel from current git branch
 *
 * Normalizes the branch name for use as a channel identifier:
 * - Converts to lowercase
 * - Replaces special characters with hyphens
 * - Collapses multiple hyphens
 * - Truncates to 50 characters
 *
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.useCache=true] - Use cached value if available
 * @returns {string} Channel name (normalized branch name)
 *
 * @example
 * // On branch 'feature/051-speckit-scratch-implementation'
 * deriveChannelFromGitBranch()
 * // Returns: 'feature-051-speckit-scratch-implementation'
 *
 * @example
 * // Force fresh lookup
 * deriveChannelFromGitBranch({ useCache: false })
 */
function deriveChannelFromGitBranch(options = {}) {
  const { useCache = true } = options;

  // Check cache
  if (useCache && cachedBranch && Date.now() < cacheExpiry) {
    return cachedBranch;
  }

  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
      timeout: 1000,
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();

    // Normalize: lowercase, replace special chars, truncate
    const normalized = branch
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);

    // Cache the result
    cachedBranch = normalized;
    cacheExpiry = Date.now() + CACHE_TTL_MS;

    return normalized;
  } catch {
    return DEFAULT_CHANNEL;
  }
}

/**
 * Get the raw git branch name (not normalized)
 *
 * Useful when you need the original branch name for display purposes
 * or for operations that require the exact branch name.
 *
 * @returns {string|null} Raw branch name or null if not in a git repo
 *
 * @example
 * getRawGitBranch()
 * // Returns: 'feature/051-speckit-scratch-implementation'
 */
function getRawGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
      timeout: 1000,
      stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Check if currently in a git repository
 *
 * @returns {boolean} True if current directory is within a git repository
 *
 * @example
 * if (isGitRepo()) {
 *   const channel = deriveChannelFromGitBranch();
 *   console.log(`Using channel: ${channel}`);
 * }
 */
function isGitRepo() {
  try {
    execSync('git rev-parse --git-dir', {
      encoding: 'utf-8',
      timeout: 1000,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get memories for current channel
 *
 * Retrieves memories scoped to the current git branch channel.
 * By default, also includes memories from the 'default' channel
 * to provide cross-branch context.
 *
 * @param {Object} db - better-sqlite3 database instance
 * @param {Object} [options] - Query options
 * @param {string} [options.channel] - Override auto-detected channel
 * @param {boolean} [options.includeDefault=true] - Include 'default' channel memories
 * @param {number} [options.limit=50] - Maximum number of memories to return
 * @returns {Array<Object>} Channel-scoped memories sorted by creation date (newest first)
 *
 * @example
 * // Get memories for current branch
 * const memories = getChannelMemories(db);
 *
 * @example
 * // Get only branch-specific memories, no defaults
 * const branchOnly = getChannelMemories(db, { includeDefault: false });
 *
 * @example
 * // Override channel manually
 * const mainMemories = getChannelMemories(db, { channel: 'main' });
 */
function getChannelMemories(db, options = {}) {
  const { channel, includeDefault = true, limit = 50 } = options;

  const currentChannel = channel || deriveChannelFromGitBranch();
  const channels = includeDefault && currentChannel !== DEFAULT_CHANNEL
    ? [currentChannel, DEFAULT_CHANNEL]
    : [currentChannel];

  const placeholders = channels.map(() => '?').join(', ');

  const rows = db.prepare(`
    SELECT * FROM memory_index
    WHERE channel IN (${placeholders})
    AND importance_tier != 'deprecated'
    ORDER BY created_at DESC
    LIMIT ?
  `).all(...channels, limit);

  return rows;
}

/**
 * Search within current channel context
 *
 * Performs a vector similarity search scoped to the current channel.
 * Automatically includes the 'default' channel unless disabled.
 *
 * @param {Object} db - Database instance
 * @param {Float32Array|Array<number>} queryEmbedding - Query embedding vector
 * @param {Function} vectorSearchFn - Vector search function to use
 * @param {Object} [options] - Search options
 * @param {string} [options.channel] - Override auto-detected channel
 * @param {boolean} [options.includeDefault=true] - Include 'default' channel in search
 * @param {number} [options.limit=10] - Maximum results
 * @param {number} [options.threshold=0.5] - Minimum similarity threshold
 * @returns {Array<Object>} Search results filtered by channel
 *
 * @example
 * const results = channelScopedSearch(
 *   db,
 *   queryEmbedding,
 *   vectorIndex.search,
 *   { limit: 5 }
 * );
 */
function channelScopedSearch(db, queryEmbedding, vectorSearchFn, options = {}) {
  const channel = options.channel || deriveChannelFromGitBranch();
  const { includeDefault = true, ...searchOptions } = options;

  // Build channel filter
  const channels = includeDefault && channel !== DEFAULT_CHANNEL
    ? [channel, DEFAULT_CHANNEL]
    : [channel];

  // Add channel filter to search
  return vectorSearchFn(queryEmbedding, {
    ...searchOptions,
    channels
  });
}

/**
 * Clear the branch cache (useful for testing)
 *
 * Forces the next call to deriveChannelFromGitBranch() to perform
 * a fresh git lookup instead of using cached values.
 *
 * @example
 * // In test setup
 * beforeEach(() => {
 *   clearCache();
 * });
 */
function clearCache() {
  cachedBranch = null;
  cacheExpiry = 0;
}

module.exports = {
  DEFAULT_CHANNEL,
  deriveChannelFromGitBranch,
  getRawGitBranch,
  isGitRepo,
  getChannelMemories,
  channelScopedSearch,
  clearCache
};
