/**
 * History Module - Audit trail for memory mutations
 * @module lib/history
 * @version 11.0.0
 */

'use strict';

const crypto = require('crypto');

// Prepared statement cache for performance (P1 optimization)
const stmtCache = new Map();

/**
 * Get or create a cached prepared statement
 * @param {Object} db - Database instance
 * @param {string} key - Cache key
 * @param {string} sql - SQL to prepare
 * @returns {Object} Prepared statement
 */
function getStmt(db, key, sql) {
  if (!stmtCache.has(key)) {
    stmtCache.set(key, db.prepare(sql));
  }
  return stmtCache.get(key);
}

/**
 * Generate a UUID v4
 * @returns {string} UUID string
 */
function generateUUID() {
  return crypto.randomUUID();
}

/**
 * Record a history event
 * @param {Object} db - Database instance (better-sqlite3)
 * @param {Object} params
 * @param {number} params.memoryId - Memory row ID
 * @param {Object} [params.prevValue] - Previous state (for UPDATE/DELETE)
 * @param {Object} [params.newValue] - New state (for ADD/UPDATE)
 * @param {string} params.event - 'ADD', 'UPDATE', or 'DELETE'
 * @param {string} [params.actor='system'] - 'user', 'system', 'hook', 'decay'
 * @returns {string} History entry ID
 * @throws {Error} If required parameters are missing or invalid
 */
function recordHistory(db, params) {
  const { memoryId, prevValue, newValue, event, actor = 'system' } = params;

  // Validate required parameters
  if (!memoryId || typeof memoryId !== 'number') {
    throw new Error('memoryId is required and must be a number');
  }

  const validEvents = ['ADD', 'UPDATE', 'DELETE'];
  if (!event || !validEvents.includes(event)) {
    throw new Error(`event must be one of: ${validEvents.join(', ')}`);
  }

  const validActors = ['user', 'system', 'hook', 'decay'];
  if (!validActors.includes(actor)) {
    throw new Error(`actor must be one of: ${validActors.join(', ')}`);
  }

  // Validate state based on event type
  if (event === 'ADD' && !newValue) {
    throw new Error('newValue is required for ADD events');
  }
  if (event === 'DELETE' && !prevValue) {
    throw new Error('prevValue is required for DELETE events');
  }
  if (event === 'UPDATE' && (!prevValue || !newValue)) {
    throw new Error('Both prevValue and newValue are required for UPDATE events');
  }

  const historyId = generateUUID();
  const timestamp = new Date().toISOString();

  const stmt = getStmt(db, 'insert_history', `
    INSERT INTO memory_history (id, memory_id, prev_value, new_value, event, actor, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    historyId,
    memoryId,
    prevValue ? JSON.stringify(prevValue) : null,
    newValue ? JSON.stringify(newValue) : null,
    event,
    actor,
    timestamp
  );

  return historyId;
}

/**
 * Get history for a specific memory
 * @param {Object} db - Database instance
 * @param {number} memoryId - Memory row ID
 * @param {Object} [options]
 * @param {number} [options.limit=50] - Max entries
 * @param {string} [options.since] - ISO date to filter from
 * @returns {Array} History entries chronologically (oldest first)
 * @throws {Error} If memoryId is invalid
 */
function getHistory(db, memoryId, options = {}) {
  if (!memoryId || typeof memoryId !== 'number') {
    throw new Error('memoryId is required and must be a number');
  }

  const { limit = 50, since } = options;

  let query = `
    SELECT id, memory_id, prev_value, new_value, event, actor, timestamp
    FROM memory_history
    WHERE memory_id = ?
  `;
  const params = [memoryId];

  if (since) {
    query += ' AND timestamp >= ?';
    params.push(since);
  }

  query += ' ORDER BY timestamp ASC LIMIT ?';
  params.push(limit);

  const stmt = db.prepare(query);
  const rows = stmt.all(...params);

  return rows.map(row => ({
    id: row.id,
    memoryId: row.memory_id,
    prevValue: row.prev_value ? JSON.parse(row.prev_value) : null,
    newValue: row.new_value ? JSON.parse(row.new_value) : null,
    event: row.event,
    actor: row.actor,
    timestamp: row.timestamp
  }));
}

/**
 * Get recent history across all memories
 * @param {Object} db - Database instance
 * @param {Object} [options]
 * @param {number} [options.limit=100] - Max entries
 * @param {string} [options.event] - Filter by event type ('ADD', 'UPDATE', 'DELETE')
 * @param {string} [options.actor] - Filter by actor ('user', 'system', 'hook', 'decay')
 * @returns {Array} Recent history entries (newest first)
 */
function getRecentHistory(db, options = {}) {
  const { limit = 100, event, actor } = options;

  let query = `
    SELECT id, memory_id, prev_value, new_value, event, actor, timestamp
    FROM memory_history
    WHERE 1=1
  `;
  const params = [];

  if (event) {
    const validEvents = ['ADD', 'UPDATE', 'DELETE'];
    if (!validEvents.includes(event)) {
      throw new Error(`event must be one of: ${validEvents.join(', ')}`);
    }
    query += ' AND event = ?';
    params.push(event);
  }

  if (actor) {
    const validActors = ['user', 'system', 'hook', 'decay'];
    if (!validActors.includes(actor)) {
      throw new Error(`actor must be one of: ${validActors.join(', ')}`);
    }
    query += ' AND actor = ?';
    params.push(actor);
  }

  query += ' ORDER BY timestamp DESC LIMIT ?';
  params.push(limit);

  const stmt = db.prepare(query);
  const rows = stmt.all(...params);

  return rows.map(row => ({
    id: row.id,
    memoryId: row.memory_id,
    prevValue: row.prev_value ? JSON.parse(row.prev_value) : null,
    newValue: row.new_value ? JSON.parse(row.new_value) : null,
    event: row.event,
    actor: row.actor,
    timestamp: row.timestamp
  }));
}

/**
 * Undo the last change to a memory
 * @param {Object} db - Database instance
 * @param {number} memoryId - Memory row ID
 * @returns {Object} Result with restored state and metadata
 * @throws {Error} If no history found or undo not possible
 */
function undoLastChange(db, memoryId) {
  if (!memoryId || typeof memoryId !== 'number') {
    throw new Error('memoryId is required and must be a number');
  }

  // Get the last history entry for this memory
  const lastEntryStmt = db.prepare(`
    SELECT id, memory_id, prev_value, new_value, event, actor, timestamp
    FROM memory_history
    WHERE memory_id = ?
    ORDER BY timestamp DESC
    LIMIT 1
  `);

  const lastEntry = lastEntryStmt.get(memoryId);

  if (!lastEntry) {
    throw new Error(`No history found for memory ${memoryId}`);
  }

  const prevValue = lastEntry.prev_value ? JSON.parse(lastEntry.prev_value) : null;
  const newValue = lastEntry.new_value ? JSON.parse(lastEntry.new_value) : null;

  // Handle based on event type
  let restoredState;
  let undoAction;

  switch (lastEntry.event) {
    case 'ADD':
      // Undo ADD = DELETE the memory
      undoAction = 'DELETE';
      restoredState = null;

      // Mark memory as deleted (soft delete) or remove
      const deleteStmt = db.prepare(`
        UPDATE memory_index
        SET importance_tier = 'deprecated', updated_at = datetime('now')
        WHERE id = ?
      `);
      deleteStmt.run(memoryId);
      break;

    case 'UPDATE':
      // Undo UPDATE = restore previous value
      if (!prevValue) {
        throw new Error('Cannot undo UPDATE: no previous value recorded');
      }
      undoAction = 'UPDATE';
      restoredState = prevValue;

      // Restore the previous state
      const updateStmt = db.prepare(`
        UPDATE memory_index
        SET title = ?,
            importance_weight = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `);
      updateStmt.run(
        prevValue.title || null,
        prevValue.importanceWeight || prevValue.importance_weight || 0.5,
        memoryId
      );
      break;

    case 'DELETE':
      // Undo DELETE = restore the memory
      if (!prevValue) {
        throw new Error('Cannot undo DELETE: no previous value recorded');
      }
      undoAction = 'RESTORE';
      restoredState = prevValue;

      // Restore the memory (change tier back from deprecated)
      const restoreStmt = db.prepare(`
        UPDATE memory_index
        SET importance_tier = COALESCE(?, 'normal'),
            title = ?,
            importance_weight = ?,
            updated_at = datetime('now')
        WHERE id = ?
      `);
      restoreStmt.run(
        prevValue.importanceTier || prevValue.importance_tier || 'normal',
        prevValue.title || null,
        prevValue.importanceWeight || prevValue.importance_weight || 0.5,
        memoryId
      );
      break;

    default:
      throw new Error(`Unknown event type: ${lastEntry.event}`);
  }

  // Record the undo operation in history
  const undoHistoryId = recordHistory(db, {
    memoryId,
    prevValue: newValue,
    newValue: restoredState,
    event: undoAction === 'DELETE' ? 'DELETE' : 'UPDATE',
    actor: 'system'
  });

  return {
    success: true,
    undoHistoryId,
    originalEvent: lastEntry.event,
    undoAction,
    restoredState,
    undoneEntryId: lastEntry.id,
    timestamp: new Date().toISOString()
  };
}

/**
 * Purge old history entries (retention policy)
 * @param {Object} db - Database instance
 * @param {number} [daysToKeep=90] - Keep entries newer than this many days
 * @returns {number} Number of entries removed
 */
function purgeOldHistory(db, daysToKeep = 90) {
  if (typeof daysToKeep !== 'number' || daysToKeep < 0) {
    throw new Error('daysToKeep must be a non-negative number');
  }

  // Calculate cutoff date
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const cutoffISO = cutoffDate.toISOString();

  // Delete old entries
  const stmt = db.prepare(`
    DELETE FROM memory_history
    WHERE timestamp < ?
  `);

  const result = stmt.run(cutoffISO);

  return result.changes;
}

/**
 * Get history statistics
 * @param {Object} db - Database instance
 * @returns {Object} Statistics about history entries
 */
function getHistoryStats(db) {
  const stmt = getStmt(db, 'history_stats', `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN event = 'ADD' THEN 1 ELSE 0 END) as adds,
      SUM(CASE WHEN event = 'UPDATE' THEN 1 ELSE 0 END) as updates,
      SUM(CASE WHEN event = 'DELETE' THEN 1 ELSE 0 END) as deletes,
      MIN(timestamp) as oldest,
      MAX(timestamp) as newest
    FROM memory_history
  `);

  const row = stmt.get();

  return {
    total: row.total || 0,
    byEvent: {
      ADD: row.adds || 0,
      UPDATE: row.updates || 0,
      DELETE: row.deletes || 0
    },
    dateRange: {
      oldest: row.oldest || null,
      newest: row.newest || null
    }
  };
}

module.exports = {
  recordHistory,
  getHistory,
  getRecentHistory,
  undoLastChange,
  purgeOldHistory,
  getHistoryStats
};
