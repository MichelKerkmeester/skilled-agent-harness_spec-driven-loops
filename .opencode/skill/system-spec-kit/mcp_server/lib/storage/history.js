// ───────────────────────────────────────────────────────────────
// MCP: HISTORY
// ───────────────────────────────────────────────────────────────
'use strict';

const crypto = require('crypto');

/* ───────────────────────────────────────────────────────────────
   1. STATEMENT CACHE
   ─────────────────────────────────────────────────────────────── */

// P2-007: Track db instance to handle db changes and prevent cache leak
const stmt_cache = new Map();
let cached_db = null;

function get_stmt(db, key, sql) {
  if (cached_db !== db) {
    stmt_cache.clear();
    cached_db = db;
  }
  if (!stmt_cache.has(key)) {
    stmt_cache.set(key, db.prepare(sql));
  }
  return stmt_cache.get(key);
}

/* ───────────────────────────────────────────────────────────────
   2. UTILITIES
   ─────────────────────────────────────────────────────────────── */

function generate_uuid() {
  return crypto.randomUUID();
}

/* ───────────────────────────────────────────────────────────────
   3. RECORD HISTORY
   ─────────────────────────────────────────────────────────────── */

function record_history(db, params) {
  const { memory_id, prev_value, new_value, event, actor = 'system' } = params;

  if (!memory_id || typeof memory_id !== 'number') {
    throw new Error('memory_id is required and must be a number');
  }

  const valid_events = ['ADD', 'UPDATE', 'DELETE'];
  if (!event || !valid_events.includes(event)) {
    throw new Error(`event must be one of: ${valid_events.join(', ')}`);
  }

  const valid_actors = ['user', 'system', 'hook', 'decay'];
  if (!valid_actors.includes(actor)) {
    throw new Error(`actor must be one of: ${valid_actors.join(', ')}`);
  }

  if (event === 'ADD' && !new_value) {
    throw new Error('new_value is required for ADD events');
  }
  if (event === 'DELETE' && !prev_value) {
    throw new Error('prev_value is required for DELETE events');
  }
  if (event === 'UPDATE' && (!prev_value || !new_value)) {
    throw new Error('Both prev_value and new_value are required for UPDATE events');
  }

  const history_id = generate_uuid();
  const timestamp = new Date().toISOString();

  const stmt = get_stmt(db, 'insert_history', `
    INSERT INTO memory_history (id, memory_id, prev_value, new_value, event, actor, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    history_id,
    memory_id,
    prev_value ? JSON.stringify(prev_value) : null,
    new_value ? JSON.stringify(new_value) : null,
    event,
    actor,
    timestamp
  );

  return history_id;
}

/* ───────────────────────────────────────────────────────────────
   4. RETRIEVE HISTORY
   ─────────────────────────────────────────────────────────────── */

function get_history(db, memory_id, options = {}) {
  if (!memory_id || typeof memory_id !== 'number') {
    throw new Error('memory_id is required and must be a number');
  }

  const { limit = 50, since } = options;

  let query = `
    SELECT id, memory_id, prev_value, new_value, event, actor, timestamp
    FROM memory_history
    WHERE memory_id = ?
  `;
  const params = [memory_id];

  if (since) {
    query += ' AND timestamp >= ?';
    params.push(since);
  }

  query += ' ORDER BY timestamp ASC LIMIT ?';
  params.push(limit);

  const rows = db.prepare(query).all(...params);

  return rows.map(row => {
    let prev_value = null;
    let new_value = null;
    
    // T121: Wrap JSON.parse in try-catch to handle parse errors gracefully
    if (row.prev_value) {
      try {
        prev_value = JSON.parse(row.prev_value);
      } catch (e) {
        console.warn(`[history] Failed to parse prev_value for history entry ${row.id}: ${e.message}`);
        prev_value = null;
      }
    }
    if (row.new_value) {
      try {
        new_value = JSON.parse(row.new_value);
      } catch (e) {
        console.warn(`[history] Failed to parse new_value for history entry ${row.id}: ${e.message}`);
        new_value = null;
      }
    }
    
    return {
      id: row.id,
      memory_id: row.memory_id,
      prev_value,
      new_value,
      event: row.event,
      actor: row.actor,
      timestamp: row.timestamp,
    };
  });
}

function get_recent_history(db, options = {}) {
  const { limit = 100, event, actor } = options;

  let query = `
    SELECT id, memory_id, prev_value, new_value, event, actor, timestamp
    FROM memory_history
    WHERE 1=1
  `;
  const params = [];

  if (event) {
    const valid_events = ['ADD', 'UPDATE', 'DELETE'];
    if (!valid_events.includes(event)) {
      throw new Error(`event must be one of: ${valid_events.join(', ')}`);
    }
    query += ' AND event = ?';
    params.push(event);
  }

  if (actor) {
    const valid_actors = ['user', 'system', 'hook', 'decay'];
    if (!valid_actors.includes(actor)) {
      throw new Error(`actor must be one of: ${valid_actors.join(', ')}`);
    }
    query += ' AND actor = ?';
    params.push(actor);
  }

  query += ' ORDER BY timestamp DESC LIMIT ?';
  params.push(limit);

  const rows = db.prepare(query).all(...params);

  return rows.map(row => {
    let prev_value = null;
    let new_value = null;
    
    // T121: Wrap JSON.parse in try-catch to handle parse errors gracefully
    if (row.prev_value) {
      try {
        prev_value = JSON.parse(row.prev_value);
      } catch (e) {
        console.warn(`[history] Failed to parse prev_value for history entry ${row.id}: ${e.message}`);
        prev_value = null;
      }
    }
    if (row.new_value) {
      try {
        new_value = JSON.parse(row.new_value);
      } catch (e) {
        console.warn(`[history] Failed to parse new_value for history entry ${row.id}: ${e.message}`);
        new_value = null;
      }
    }
    
    return {
      id: row.id,
      memory_id: row.memory_id,
      prev_value,
      new_value,
      event: row.event,
      actor: row.actor,
      timestamp: row.timestamp,
    };
  });
}

/* ───────────────────────────────────────────────────────────────
   5. UNDO OPERATIONS
   ─────────────────────────────────────────────────────────────── */

// P1-009: Wrapped in transaction for atomicity
function undo_last_change(db, memory_id) {
  if (!memory_id || typeof memory_id !== 'number') {
    throw new Error('memory_id is required and must be a number');
  }

  return db.transaction(() => {
    const last_entry = db.prepare(`
      SELECT id, memory_id, prev_value, new_value, event, actor, timestamp
      FROM memory_history
      WHERE memory_id = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `).get(memory_id);

    if (!last_entry) {
      throw new Error(`No history found for memory ${memory_id}`);
    }

    const prev_value = last_entry.prev_value ? JSON.parse(last_entry.prev_value) : null;
    const new_value = last_entry.new_value ? JSON.parse(last_entry.new_value) : null;

    let restored_state;
    let undo_action;

    switch (last_entry.event) {
      case 'ADD':
        // Undo ADD = soft delete
        undo_action = 'DELETE';
        restored_state = null;
        db.prepare(`
          UPDATE memory_index
          SET importance_tier = 'deprecated', updated_at = datetime('now')
          WHERE id = ?
        `).run(memory_id);
        break;

      case 'UPDATE':
        if (!prev_value) {
          throw new Error('Cannot undo UPDATE: no previous value recorded');
        }
        undo_action = 'UPDATE';
        restored_state = prev_value;

        // P2-005: Handle both camelCase and snake_case property names
        const weight = prev_value.importance_weight ?? prev_value.importanceWeight ?? 0.5;

        db.prepare(`
          UPDATE memory_index
          SET title = ?, importance_weight = ?, updated_at = datetime('now')
          WHERE id = ?
        `).run(prev_value.title || null, weight, memory_id);
        break;

      case 'DELETE':
        if (!prev_value) {
          throw new Error('Cannot undo DELETE: no previous value recorded');
        }
        undo_action = 'RESTORE';
        restored_state = prev_value;

        // P2-005: Handle both camelCase and snake_case property names
        const restore_weight = prev_value.importance_weight ?? prev_value.importanceWeight ?? 0.5;
        const restore_tier = prev_value.importance_tier ?? prev_value.importanceTier ?? 'normal';

        db.prepare(`
          UPDATE memory_index
          SET importance_tier = COALESCE(?, 'normal'),
              title = ?,
              importance_weight = ?,
              updated_at = datetime('now')
          WHERE id = ?
        `).run(restore_tier, prev_value.title || null, restore_weight, memory_id);
        break;

      default:
        throw new Error(`Unknown event type: ${last_entry.event}`);
    }

    const undo_history_id = record_history(db, {
      memory_id,
      prev_value: new_value,
      new_value: restored_state,
      event: undo_action === 'DELETE' ? 'DELETE' : 'UPDATE',
      actor: 'system',
    });

    return {
      success: true,
      undo_history_id,
      original_event: last_entry.event,
      undo_action,
      restored_state,
      undone_entry_id: last_entry.id,
      timestamp: new Date().toISOString(),
    };
  })();
}

/* ───────────────────────────────────────────────────────────────
   6. MAINTENANCE
   ─────────────────────────────────────────────────────────────── */

function purge_old_history(db, days_to_keep = 90) {
  if (typeof days_to_keep !== 'number' || days_to_keep < 0) {
    throw new Error('days_to_keep must be a non-negative number');
  }

  const cutoff_date = new Date();
  cutoff_date.setDate(cutoff_date.getDate() - days_to_keep);

  const result = db.prepare(`
    DELETE FROM memory_history WHERE timestamp < ?
  `).run(cutoff_date.toISOString());

  return result.changes;
}

function get_history_stats(db) {
  const row = get_stmt(db, 'history_stats', `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN event = 'ADD' THEN 1 ELSE 0 END) as adds,
      SUM(CASE WHEN event = 'UPDATE' THEN 1 ELSE 0 END) as updates,
      SUM(CASE WHEN event = 'DELETE' THEN 1 ELSE 0 END) as deletes,
      MIN(timestamp) as oldest,
      MAX(timestamp) as newest
    FROM memory_history
  `).get();

  return {
    total: row.total || 0,
    by_event: { ADD: row.adds || 0, UPDATE: row.updates || 0, DELETE: row.deletes || 0 },
    date_range: { oldest: row.oldest || null, newest: row.newest || null },
  };
}

/* ───────────────────────────────────────────────────────────────
   7. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  record_history,
  get_history,
  get_recent_history,
  undo_last_change,
  purge_old_history,
  get_history_stats,
};
