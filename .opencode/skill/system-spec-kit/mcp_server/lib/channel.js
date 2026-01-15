// ───────────────────────────────────────────────────────────────
// CHANNEL: Git branch-based automatic context switching
// ───────────────────────────────────────────────────────────────
'use strict';

// Automatic context switching based on git branches. Memories are
// organized by "channels" derived from the current git branch.

const { execSync } = require('child_process');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const DEFAULT_CHANNEL = 'default';

/**
 * T121: INTENTIONAL GLOBAL STATE PATTERN
 * 
 * These module-level variables are intentionally global for performance:
 * - cached_branch: Caches the current git branch to avoid repeated execSync calls
 * - cache_expiry: TTL timestamp for cache invalidation
 * 
 * This is a deliberate design choice because:
 * 1. Git branch changes infrequently during a session
 * 2. execSync is expensive (~50-100ms per call)
 * 3. Cache provides 5-second TTL for freshness
 * 
 * To reset the cache externally, call clear_cache().
 */
let cached_branch = null;
let cache_expiry = 0;
const CACHE_TTL_MS = 5000;

/* ───────────────────────────────────────────────────────────────
   2. GIT UTILITIES
   ─────────────────────────────────────────────────────────────── */

// Normalizes branch name: lowercase, special chars to hyphens, max 50 chars
function derive_channel_from_git_branch(options = {}) {
  const { use_cache = true } = options;

  if (use_cache && cached_branch && Date.now() < cache_expiry) {
    return cached_branch;
  }

  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
      timeout: 1000,
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    const normalized = branch
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);

    cached_branch = normalized;
    cache_expiry = Date.now() + CACHE_TTL_MS;

    return normalized;
  } catch {
    return DEFAULT_CHANNEL;
  }
}

function get_raw_git_branch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
      timeout: 1000,
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function is_git_repo() {
  try {
    execSync('git rev-parse --git-dir', {
      encoding: 'utf-8',
      timeout: 1000,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return true;
  } catch {
    return false;
  }
}

/* ───────────────────────────────────────────────────────────────
   3. CHANNEL MEMORY OPERATIONS
   ─────────────────────────────────────────────────────────────── */

// Retrieves memories scoped to current branch, includes 'default' channel by default
function get_channel_memories(db, options = {}) {
  const { channel, include_default = true, limit = 50 } = options;

  const current_channel = channel || derive_channel_from_git_branch();
  const channels = include_default && current_channel !== DEFAULT_CHANNEL
    ? [current_channel, DEFAULT_CHANNEL]
    : [current_channel];

  const placeholders = channels.map(() => '?').join(', ');

  return db.prepare(`
    SELECT * FROM memory_index
    WHERE channel IN (${placeholders})
    AND importance_tier != 'deprecated'
    ORDER BY created_at DESC
    LIMIT ?
  `).all(...channels, limit);
}

function channel_scoped_search(db, query_embedding, vector_search_fn, options = {}) {
  const channel = options.channel || derive_channel_from_git_branch();
  const { include_default = true, ...search_options } = options;

  const channels = include_default && channel !== DEFAULT_CHANNEL
    ? [channel, DEFAULT_CHANNEL]
    : [channel];

  return vector_search_fn(query_embedding, { ...search_options, channels });
}

/* ───────────────────────────────────────────────────────────────
   4. CACHE MANAGEMENT
   ─────────────────────────────────────────────────────────────── */

function clear_cache() {
  cached_branch = null;
  cache_expiry = 0;
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  DEFAULT_CHANNEL,
  derive_channel_from_git_branch,
  get_raw_git_branch,
  is_git_repo,
  get_channel_memories,
  channel_scoped_search,
  clear_cache,
};
