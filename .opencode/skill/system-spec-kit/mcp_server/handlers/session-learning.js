// ───────────────────────────────────────────────────────────────
// HANDLERS: SESSION LEARNING
// ───────────────────────────────────────────────────────────────
'use strict';

const vectorIndex = require('../lib/search/vector-index.js');
const { MemoryError, ErrorCodes } = require('../lib/errors.js');

/* ───────────────────────────────────────────────────────────────
   1. SCHEMA MANAGEMENT
──────────────────────────────────────────────────────────────── */

// SQL schema for session_learning table
// Updated to support preflight/postflight with delta calculations
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS session_learning (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spec_folder TEXT NOT NULL,
    task_id TEXT NOT NULL,
    phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
    session_id TEXT,
    -- Preflight scores (baseline)
    pre_knowledge_score INTEGER,
    pre_uncertainty_score INTEGER,
    pre_context_score INTEGER,
    knowledge_gaps TEXT,
    -- Postflight scores (final)
    post_knowledge_score INTEGER,
    post_uncertainty_score INTEGER,
    post_context_score INTEGER,
    -- Calculated deltas
    delta_knowledge REAL,
    delta_uncertainty REAL,
    delta_context REAL,
    learning_index REAL,
    -- Gap tracking
    gaps_closed TEXT,
    new_gaps_discovered TEXT,
    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    UNIQUE(spec_folder, task_id)
  )
`;

// Index for efficient querying
const INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_session_learning_spec_folder
  ON session_learning(spec_folder)
`;

// Track if schema has been initialized
let schema_initialized = false;

/**
 * Ensure session_learning table exists
 * @param {Object} database - better-sqlite3 database instance
 */
function ensure_schema(database) {
  if (schema_initialized) return;

  try {
    database.exec(SCHEMA_SQL);
    database.exec(INDEX_SQL);
    schema_initialized = true;
    console.log('[session-learning] Schema initialized');
  } catch (err) {
    console.error('[session-learning] Schema initialization failed:', err.message);
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Failed to initialize session_learning schema',
      { originalError: err.message }
    );
  }
}

/* ───────────────────────────────────────────────────────────────
   2. HANDLER: task_preflight
──────────────────────────────────────────────────────────────── */

/**
 * Handle task_preflight - capture epistemic baseline before task execution
 *
 * @param {Object} args
 * @param {string} args.specFolder - Path to spec folder
 * @param {string} args.taskId - Task identifier (e.g., T1, T2)
 * @param {number} args.knowledgeScore - Current knowledge level (0-100)
 * @param {number} args.uncertaintyScore - Current uncertainty level (0-100)
 * @param {number} args.contextScore - Current context completeness (0-100)
 * @param {string[]} [args.knowledgeGaps] - List of identified knowledge gaps
 * @param {string} [args.sessionId] - Optional session identifier
 * @returns {Object} MCP response with stored record
 */
async function handle_task_preflight(args) {
  const {
    specFolder: spec_folder,
    taskId: task_id,
    knowledgeScore: knowledge_score,
    uncertaintyScore: uncertainty_score,
    contextScore: context_score,
    knowledgeGaps: knowledge_gaps = [],
    sessionId: session_id = null
  } = args;

  // Validate required parameters
  if (!spec_folder) {
    throw new MemoryError(
      ErrorCodes.MISSING_REQUIRED_PARAM,
      'specFolder is required',
      { param: 'specFolder' }
    );
  }
  if (!task_id) {
    throw new MemoryError(
      ErrorCodes.MISSING_REQUIRED_PARAM,
      'taskId is required',
      { param: 'taskId' }
    );
  }

  // Validate score ranges
  const scores = [
    { name: 'knowledgeScore', value: knowledge_score },
    { name: 'uncertaintyScore', value: uncertainty_score },
    { name: 'contextScore', value: context_score }
  ];

  for (const score of scores) {
    if (score.value === undefined || score.value === null) {
      throw new MemoryError(
        ErrorCodes.MISSING_REQUIRED_PARAM,
        `${score.name} is required`,
        { param: score.name }
      );
    }
    if (typeof score.value !== 'number' || score.value < 0 || score.value > 100) {
      throw new MemoryError(
        ErrorCodes.INVALID_PARAMETER,
        `${score.name} must be a number between 0 and 100`,
        { param: score.name, value: score.value }
      );
    }
  }

  // Get database and ensure schema
  const database = vectorIndex.getDb();
  if (!database) {
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Database not available',
      {}
    );
  }

  ensure_schema(database);

  const now = new Date().toISOString();
  const gaps_json = JSON.stringify(knowledge_gaps);

  // Insert or replace preflight record (allows re-running preflight for same task)
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO session_learning
    (spec_folder, task_id, phase, session_id, pre_knowledge_score, pre_uncertainty_score, pre_context_score, knowledge_gaps, created_at, updated_at)
    VALUES (?, ?, 'preflight', ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      spec_folder,
      task_id,
      session_id,
      knowledge_score,
      uncertainty_score,
      context_score,
      gaps_json,
      now,
      now
    );

    const record_id = result.lastInsertRowid;
    console.log(`[session-learning] Preflight recorded: spec=${spec_folder}, task=${task_id}, id=${record_id}`);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: 'Preflight baseline captured',
          record: {
            id: Number(record_id),
            specFolder: spec_folder,
            taskId: task_id,
            phase: 'preflight',
            baseline: {
              knowledge: knowledge_score,
              uncertainty: uncertainty_score,
              context: context_score
            },
            knowledgeGaps: knowledge_gaps,
            timestamp: now
          }
        }, null, 2)
      }]
    };
  } catch (err) {
    console.error('[session-learning] Failed to insert preflight record:', err.message);
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Failed to store preflight record',
      { originalError: err.message }
    );
  }
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER: task_postflight
──────────────────────────────────────────────────────────────── */

/**
 * Handle task_postflight - capture epistemic state after task execution
 * Calculates learning deltas and Learning Index from preflight baseline.
 *
 * Learning Index Formula:
 * LI = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
 *
 * @param {Object} args
 * @param {string} args.specFolder - Path to spec folder
 * @param {string} args.taskId - Task identifier (must match preflight)
 * @param {number} args.knowledgeScore - Post-task knowledge level (0-100)
 * @param {number} args.uncertaintyScore - Post-task uncertainty level (0-100)
 * @param {number} args.contextScore - Post-task context completeness (0-100)
 * @param {string[]} [args.gapsClosed] - List of knowledge gaps closed
 * @param {string[]} [args.newGapsDiscovered] - List of new gaps discovered
 * @returns {Object} MCP response with deltas and Learning Index
 */
async function handle_task_postflight(args) {
  const {
    specFolder: spec_folder,
    taskId: task_id,
    knowledgeScore: knowledge_score,
    uncertaintyScore: uncertainty_score,
    contextScore: context_score,
    gapsClosed: gaps_closed = [],
    newGapsDiscovered: new_gaps_discovered = []
  } = args;

  // Validate required parameters
  if (!spec_folder) {
    throw new MemoryError(
      ErrorCodes.MISSING_REQUIRED_PARAM,
      'specFolder is required',
      { param: 'specFolder' }
    );
  }
  if (!task_id) {
    throw new MemoryError(
      ErrorCodes.MISSING_REQUIRED_PARAM,
      'taskId is required',
      { param: 'taskId' }
    );
  }

  // Validate score ranges
  const scores = [
    { name: 'knowledgeScore', value: knowledge_score },
    { name: 'uncertaintyScore', value: uncertainty_score },
    { name: 'contextScore', value: context_score }
  ];

  for (const score of scores) {
    if (score.value === undefined || score.value === null) {
      throw new MemoryError(
        ErrorCodes.MISSING_REQUIRED_PARAM,
        `${score.name} is required`,
        { param: score.name }
      );
    }
    if (typeof score.value !== 'number' || score.value < 0 || score.value > 100) {
      throw new MemoryError(
        ErrorCodes.INVALID_PARAMETER,
        `${score.name} must be a number between 0 and 100`,
        { param: score.name, value: score.value }
      );
    }
  }

  // Get database and ensure schema
  const database = vectorIndex.getDb();
  if (!database) {
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Database not available',
      {}
    );
  }

  ensure_schema(database);

  const now = new Date().toISOString();

  // Find the preflight record
  const preflight = database.prepare(`
    SELECT * FROM session_learning
    WHERE spec_folder = ? AND task_id = ? AND phase = 'preflight'
  `).get(spec_folder, task_id);

  if (!preflight) {
    throw new MemoryError(
      ErrorCodes.FILE_NOT_FOUND,
      `No preflight record found for spec_folder="${spec_folder}" and task_id="${task_id}". Call task_preflight first.`,
      { specFolder: spec_folder, taskId: task_id }
    );
  }

  // Calculate deltas
  const delta_knowledge = knowledge_score - preflight.pre_knowledge_score;
  const delta_uncertainty = preflight.pre_uncertainty_score - uncertainty_score; // Reduction is positive
  const delta_context = context_score - preflight.pre_context_score;

  // Calculate Learning Index using the formula from FR-4
  // LI = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
  // Note: Values can be negative (regression) so we don't clamp to 0-100
  const learning_index = (delta_knowledge * 0.4) + (delta_uncertainty * 0.35) + (delta_context * 0.25);

  // Round to 2 decimal places (allow negative values to track regression)
  const learning_index_rounded = Math.round(learning_index * 100) / 100;

  // Interpret learning index for user feedback
  let interpretation;
  if (learning_index_rounded >= 40) {
    interpretation = 'Significant learning session - substantial knowledge gains';
  } else if (learning_index_rounded >= 15) {
    interpretation = 'Moderate learning session - meaningful progress';
  } else if (learning_index_rounded >= 5) {
    interpretation = 'Incremental learning - some progress made';
  } else if (learning_index_rounded >= 0) {
    interpretation = 'Execution-focused session - minimal new learning';
  } else {
    interpretation = 'Knowledge regression detected - may indicate scope expansion or new complexities discovered';
  }

  const gaps_closed_json = JSON.stringify(gaps_closed);
  const new_gaps_json = JSON.stringify(new_gaps_discovered);

  // Update the preflight record with postflight data
  try {
    database.prepare(`
      UPDATE session_learning SET
        phase = 'complete',
        post_knowledge_score = ?,
        post_uncertainty_score = ?,
        post_context_score = ?,
        delta_knowledge = ?,
        delta_uncertainty = ?,
        delta_context = ?,
        learning_index = ?,
        gaps_closed = ?,
        new_gaps_discovered = ?,
        completed_at = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      knowledge_score,
      uncertainty_score,
      context_score,
      delta_knowledge,
      delta_uncertainty,
      delta_context,
      learning_index_rounded,
      gaps_closed_json,
      new_gaps_json,
      now,
      now,
      preflight.id
    );

    console.log(`[session-learning] Postflight recorded: spec=${spec_folder}, task=${task_id}, LI=${learning_index_rounded}`);

    // Parse original knowledge gaps from preflight
    let original_gaps = [];
    try {
      original_gaps = preflight.knowledge_gaps ? JSON.parse(preflight.knowledge_gaps) : [];
    } catch (e) {
      original_gaps = [];
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: 'Postflight completed - learning measured',
          record: {
            id: preflight.id,
            specFolder: spec_folder,
            taskId: task_id,
            baseline: {
              knowledge: preflight.pre_knowledge_score,
              uncertainty: preflight.pre_uncertainty_score,
              context: preflight.pre_context_score
            },
            final: {
              knowledge: knowledge_score,
              uncertainty: uncertainty_score,
              context: context_score
            },
            deltas: {
              knowledge: delta_knowledge,
              uncertainty: delta_uncertainty,
              context: delta_context
            },
            learningIndex: learning_index_rounded,
            interpretation: interpretation,
            formula: 'LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)',
            gaps: {
              original: original_gaps,
              closed: gaps_closed,
              newDiscovered: new_gaps_discovered
            },
            timestamp: now
          }
        }, null, 2)
      }]
    };
  } catch (err) {
    console.error('[session-learning] Failed to update postflight record:', err.message);
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Failed to store postflight record',
      { originalError: err.message }
    );
  }
}

/* ───────────────────────────────────────────────────────────────
   4. HANDLER: get_learning_history (FR-4 AC-4.4)
──────────────────────────────────────────────────────────────── */

/**
 * Handle memory_get_learning_history - retrieve learning history for a spec folder
 * Fulfills AC-4.4: "Learning history accessible via memory search"
 *
 * @param {Object} args
 * @param {string} args.specFolder - Spec folder path (required)
 * @param {string} [args.sessionId] - Filter by session ID
 * @param {number} [args.limit=10] - Maximum records to return
 * @param {boolean} [args.onlyComplete=false] - Only return records with both PREFLIGHT and POSTFLIGHT
 * @param {boolean} [args.includeSummary=true] - Include summary statistics
 * @returns {Object} MCP response with learning history
 */
async function handle_get_learning_history(args) {
  const {
    specFolder: spec_folder,
    sessionId: session_id,
    limit = 10,
    onlyComplete: only_complete = false,
    includeSummary: include_summary = true
  } = args;

  // Validate required parameters
  if (!spec_folder) {
    throw new MemoryError(
      ErrorCodes.MISSING_REQUIRED_PARAM,
      'specFolder is required',
      { param: 'specFolder' }
    );
  }

  // Validate limit
  const safe_limit = Math.min(Math.max(1, limit), 100);

  // Get database and ensure schema
  const database = vectorIndex.getDb();
  if (!database) {
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Database not available',
      {}
    );
  }

  ensure_schema(database);

  try {
    // Build query
    let sql = `
      SELECT * FROM session_learning
      WHERE spec_folder = ?
    `;
    const params = [spec_folder];

    if (session_id) {
      sql += ' AND session_id = ?';
      params.push(session_id);
    }

    if (only_complete) {
      sql += " AND phase = 'complete'";
    }

    sql += ' ORDER BY updated_at DESC LIMIT ?';
    params.push(safe_limit);

    const rows = database.prepare(sql).all(...params);

    // Format the results
    const learning_history = rows.map(row => {
      // Parse JSON fields safely
      let knowledge_gaps = [];
      let gaps_closed = [];
      let new_gaps_discovered = [];

      try {
        knowledge_gaps = row.knowledge_gaps ? JSON.parse(row.knowledge_gaps) : [];
      } catch (e) { /* ignore parse error */ }

      try {
        gaps_closed = row.gaps_closed ? JSON.parse(row.gaps_closed) : [];
      } catch (e) { /* ignore parse error */ }

      try {
        new_gaps_discovered = row.new_gaps_discovered ? JSON.parse(row.new_gaps_discovered) : [];
      } catch (e) { /* ignore parse error */ }

      const result = {
        taskId: row.task_id,
        specFolder: row.spec_folder,
        sessionId: row.session_id,
        phase: row.phase,
        preflight: {
          knowledge: row.pre_knowledge_score,
          uncertainty: row.pre_uncertainty_score,
          context: row.pre_context_score,
          timestamp: row.created_at
        },
        knowledgeGaps: knowledge_gaps,
        createdAt: row.created_at
      };

      // Add postflight data if complete
      if (row.phase === 'complete') {
        result.postflight = {
          knowledge: row.post_knowledge_score,
          uncertainty: row.post_uncertainty_score,
          context: row.post_context_score,
          timestamp: row.completed_at
        };
        result.deltas = {
          knowledge: row.delta_knowledge,
          uncertainty: row.delta_uncertainty,
          context: row.delta_context
        };
        result.learningIndex = row.learning_index;
        result.gapsClosed = gaps_closed;
        result.newGapsDiscovered = new_gaps_discovered;
        result.completedAt = row.completed_at;
      }

      return result;
    });

    const response = {
      specFolder: spec_folder,
      count: learning_history.length,
      learningHistory: learning_history
    };

    // Include summary statistics if requested and there are completed records
    if (include_summary) {
      const summary_sql = `
        SELECT
          COUNT(*) as total_tasks,
          COUNT(CASE WHEN phase = 'complete' THEN 1 END) as completed_tasks,
          AVG(CASE WHEN phase = 'complete' THEN learning_index END) as avg_learning_index,
          MAX(CASE WHEN phase = 'complete' THEN learning_index END) as max_learning_index,
          MIN(CASE WHEN phase = 'complete' THEN learning_index END) as min_learning_index,
          AVG(CASE WHEN phase = 'complete' THEN delta_knowledge END) as avg_knowledge_gain,
          AVG(CASE WHEN phase = 'complete' THEN delta_uncertainty END) as avg_uncertainty_reduction,
          AVG(CASE WHEN phase = 'complete' THEN delta_context END) as avg_context_improvement
        FROM session_learning
        WHERE spec_folder = ?
      `;
      const stats = database.prepare(summary_sql).get(spec_folder);

      response.summary = {
        totalTasks: stats.total_tasks,
        completedTasks: stats.completed_tasks,
        averageLearningIndex: stats.avg_learning_index !== null
          ? Math.round(stats.avg_learning_index * 100) / 100
          : null,
        maxLearningIndex: stats.max_learning_index !== null
          ? Math.round(stats.max_learning_index * 100) / 100
          : null,
        minLearningIndex: stats.min_learning_index !== null
          ? Math.round(stats.min_learning_index * 100) / 100
          : null,
        averageKnowledgeGain: stats.avg_knowledge_gain !== null
          ? Math.round(stats.avg_knowledge_gain * 100) / 100
          : null,
        averageUncertaintyReduction: stats.avg_uncertainty_reduction !== null
          ? Math.round(stats.avg_uncertainty_reduction * 100) / 100
          : null,
        averageContextImprovement: stats.avg_context_improvement !== null
          ? Math.round(stats.avg_context_improvement * 100) / 100
          : null
      };

      // Add interpretation
      if (stats.avg_learning_index !== null) {
        if (stats.avg_learning_index > 15) {
          response.summary.interpretation = 'Strong learning trend - significant knowledge gains across tasks';
        } else if (stats.avg_learning_index > 7) {
          response.summary.interpretation = 'Positive learning trend - moderate knowledge improvement';
        } else if (stats.avg_learning_index > 0) {
          response.summary.interpretation = 'Slight learning trend - minor improvements detected';
        } else if (stats.avg_learning_index === 0) {
          response.summary.interpretation = 'Neutral - no measurable change in knowledge state';
        } else {
          response.summary.interpretation = 'Negative trend - knowledge regression detected across tasks';
        }
      }
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(response, null, 2)
      }]
    };
  } catch (err) {
    console.error('[session-learning] Failed to get learning history:', err.message);
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Failed to retrieve learning history',
      { originalError: err.message }
    );
  }
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // snake_case exports
  handle_task_preflight,
  handle_task_postflight,
  handle_get_learning_history,
  ensure_schema,

  // Backward compatibility aliases (camelCase)
  handleTaskPreflight: handle_task_preflight,
  handleTaskPostflight: handle_task_postflight,
  handleGetLearningHistory: handle_get_learning_history,
  ensureSchema: ensure_schema
};
