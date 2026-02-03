// ───────────────────────────────────────────────────────────────
// EXTRACTORS: COLLECT SESSION DATA
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
────────────────────────────────────────────────────────────────*/

const path = require('path');
const { CONFIG, findActiveSpecsDir } = require('../core');
const { formatTimestamp } = require('../utils/message-utils');
const { detectSpecFolder } = require('../spec-folder');

const {
  generateSessionId,
  getChannel,
  detectSessionCharacteristics,
  buildProjectStateSnapshot,
  calculateSessionDuration,
  calculateExpiryEpoch,
  detectRelatedDocs,
  extractBlockers
} = require('./session-extractor');

const {
  detectObservationType,
  extractFilesFromData,
  buildObservationsWithAnchors
} = require('./file-extractor');

const {
  buildImplementationGuideData
} = require('./implementation-guide-extractor');

/* ─────────────────────────────────────────────────────────────
   1.5. PREFLIGHT/POSTFLIGHT UTILITIES
────────────────────────────────────────────────────────────────*/

/**
 * Generates assessment text for a given score.
 * @param {number} score - Score value (0-100)
 * @param {string} metric - Metric name for context
 * @returns {string} Human-readable assessment
 */
function get_score_assessment(score, metric) {
  if (score === null || score === undefined || isNaN(score)) {
    return '[Not assessed]';
  }
  if (metric === 'uncertainty') {
    // For uncertainty, lower is better
    if (score <= 20) return 'Very low uncertainty';
    if (score <= 40) return 'Low uncertainty';
    if (score <= 60) return 'Moderate uncertainty';
    if (score <= 80) return 'High uncertainty';
    return 'Very high uncertainty';
  }
  // For knowledge and context, higher is better
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Limited';
  return 'Minimal';
}

/**
 * Calculates trend indicator for delta value.
 * @param {number} delta - Delta value
 * @param {boolean} invertedBetter - If true, negative delta is good (for uncertainty)
 * @returns {string} Trend arrow indicator
 */
function get_trend_indicator(delta, inverted_better = false) {
  if (delta === null || delta === undefined || isNaN(delta)) {
    return '→';
  }
  if (inverted_better) {
    // For uncertainty reduction: positive delta (reduction) is good
    if (delta > 0) return '↓'; // Uncertainty went down (good)
    if (delta < 0) return '↑'; // Uncertainty went up (bad)
    return '→';
  }
  // For knowledge/context: positive delta is good
  if (delta > 0) return '↑';
  if (delta < 0) return '↓';
  return '→';
}

/**
 * Calculates Learning Index from deltas.
 * Formula: (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
 * @param {number} deltaKnow - Knowledge delta
 * @param {number} deltaUncert - Uncertainty reduction (positive = good)
 * @param {number} deltaContext - Context delta
 * @returns {number} Learning Index (0-100)
 */
function calculate_learning_index(delta_know, delta_uncert, delta_context) {
  const dk = delta_know ?? 0;
  const du = delta_uncert ?? 0;
  const dc = delta_context ?? 0;
  const index = (dk * 0.4) + (du * 0.35) + (dc * 0.25);
  return Math.round(Math.max(0, Math.min(100, index)));
}

/**
 * Extracts and calculates preflight/postflight data from collected data.
 * @param {Object} collectedData - Raw collected data from JSON input
 * @returns {Object} Processed preflight/postflight template data
 */
function extract_preflight_postflight_data(collected_data) {
  const preflight = collected_data?.preflight;
  const postflight = collected_data?.postflight;

  // Default values when data not provided
  const DEFAULT_VALUE = '[TBD]';

  // Build preflight data
  const preflightData = {
    PREFLIGHT_KNOW_SCORE: preflight?.knowledgeScore ?? DEFAULT_VALUE,
    PREFLIGHT_UNCERTAINTY_SCORE: preflight?.uncertaintyScore ?? DEFAULT_VALUE,
    PREFLIGHT_CONTEXT_SCORE: preflight?.contextScore ?? DEFAULT_VALUE,
    PREFLIGHT_KNOW_ASSESSMENT: get_score_assessment(preflight?.knowledgeScore, 'knowledge'),
    PREFLIGHT_UNCERTAINTY_ASSESSMENT: get_score_assessment(preflight?.uncertaintyScore, 'uncertainty'),
    PREFLIGHT_CONTEXT_ASSESSMENT: get_score_assessment(preflight?.contextScore, 'context'),
    PREFLIGHT_TIMESTAMP: preflight?.timestamp ?? DEFAULT_VALUE,
    PREFLIGHT_GAPS: preflight?.gaps?.map(g => ({ GAP_DESCRIPTION: g })) ?? [],
    PREFLIGHT_CONFIDENCE: preflight?.confidence ?? DEFAULT_VALUE,
    PREFLIGHT_UNCERTAINTY_RAW: preflight?.uncertaintyRaw ?? preflight?.uncertaintyScore ?? DEFAULT_VALUE,
    PREFLIGHT_READINESS: preflight?.readiness ?? DEFAULT_VALUE
  };

  // Build postflight data
  const postflightData = {
    POSTFLIGHT_KNOW_SCORE: postflight?.knowledgeScore ?? DEFAULT_VALUE,
    POSTFLIGHT_UNCERTAINTY_SCORE: postflight?.uncertaintyScore ?? DEFAULT_VALUE,
    POSTFLIGHT_CONTEXT_SCORE: postflight?.contextScore ?? DEFAULT_VALUE
  };

  // Calculate deltas if both preflight and postflight exist with valid scores
  let deltaData = {
    DELTA_KNOW_SCORE: DEFAULT_VALUE,
    DELTA_UNCERTAINTY_SCORE: DEFAULT_VALUE,
    DELTA_CONTEXT_SCORE: DEFAULT_VALUE,
    DELTA_KNOW_TREND: '→',
    DELTA_UNCERTAINTY_TREND: '→',
    DELTA_CONTEXT_TREND: '→',
    LEARNING_INDEX: DEFAULT_VALUE,
    LEARNING_SUMMARY: 'Learning metrics will be calculated when both preflight and postflight data are provided.'
  };

  if (preflight && postflight &&
      typeof preflight.knowledgeScore === 'number' &&
      typeof postflight.knowledgeScore === 'number') {

    // Knowledge delta: higher is better
    const deltaKnow = postflight.knowledgeScore - preflight.knowledgeScore;

    // Uncertainty delta: reduction is good (preflight - postflight, so positive = good)
    const deltaUncert = preflight.uncertaintyScore - postflight.uncertaintyScore;

    // Context delta: higher is better
    const deltaContext = postflight.contextScore - preflight.contextScore;

    // Calculate learning index
    const learningIndex = calculate_learning_index(deltaKnow, deltaUncert, deltaContext);

    // Format delta display with sign
    const formatDelta = (d) => d >= 0 ? `+${d}` : `${d}`;

    deltaData = {
      DELTA_KNOW_SCORE: formatDelta(deltaKnow),
      DELTA_UNCERTAINTY_SCORE: formatDelta(deltaUncert),
      DELTA_CONTEXT_SCORE: formatDelta(deltaContext),
      DELTA_KNOW_TREND: get_trend_indicator(deltaKnow, false),
      DELTA_UNCERTAINTY_TREND: get_trend_indicator(deltaUncert, true),
      DELTA_CONTEXT_TREND: get_trend_indicator(deltaContext, false),
      LEARNING_INDEX: learningIndex,
      LEARNING_SUMMARY: generate_learning_summary(deltaKnow, deltaUncert, deltaContext, learningIndex)
    };
  }

  // Build gaps data
  const gapsData = {
    GAPS_CLOSED: postflight?.gapsClosed?.map(g => ({ GAP_DESCRIPTION: g })) ?? [],
    NEW_GAPS: postflight?.newGaps?.map(g => ({ GAP_DESCRIPTION: g })) ?? []
  };

  return {
    ...preflightData,
    ...postflightData,
    ...deltaData,
    ...gapsData
  };
}

/**
 * Generates a human-readable learning summary based on deltas.
 * @param {number} deltaKnow - Knowledge delta
 * @param {number} deltaUncert - Uncertainty reduction
 * @param {number} deltaContext - Context delta
 * @param {number} learningIndex - Calculated learning index
 * @returns {string} Learning summary text
 */
function generate_learning_summary(delta_know, delta_uncert, delta_context, learning_index) {
  const parts = [];

  if (delta_know > 20) {
    parts.push(`Significant knowledge gain (+${delta_know} points)`);
  } else if (delta_know > 10) {
    parts.push(`Moderate knowledge improvement (+${delta_know} points)`);
  } else if (delta_know > 0) {
    parts.push(`Slight knowledge increase (+${delta_know} points)`);
  } else if (delta_know < -10) {
    parts.push(`Knowledge score decreased (${delta_know} points) - may indicate scope expansion`);
  }

  if (delta_uncert > 20) {
    parts.push(`Major uncertainty reduction (-${delta_uncert} points)`);
  } else if (delta_uncert > 10) {
    parts.push(`Good uncertainty reduction (-${delta_uncert} points)`);
  } else if (delta_uncert < -10) {
    parts.push(`Uncertainty increased (+${Math.abs(delta_uncert)} points) - new unknowns discovered`);
  }

  if (delta_context > 15) {
    parts.push(`Substantial context enrichment (+${delta_context} points)`);
  } else if (delta_context > 5) {
    parts.push(`Context improved (+${delta_context} points)`);
  }

  if (parts.length === 0) {
    if (learning_index >= 25) {
      return 'Productive session with balanced learning across metrics.';
    } else if (learning_index >= 10) {
      return 'Moderate learning session - incremental progress made.';
    } else {
      return 'Low learning delta - session may have focused on execution rather than exploration.';
    }
  }

  let summary = parts.join('. ') + '.';

  if (learning_index >= 40) {
    summary += ' Overall: Highly productive learning session.';
  } else if (learning_index >= 25) {
    summary += ' Overall: Good learning session with meaningful progress.';
  } else if (learning_index >= 10) {
    summary += ' Overall: Moderate learning session.';
  }

  return summary;
}

/* ─────────────────────────────────────────────────────────────
   2. CONTINUE SESSION DATA GENERATION (T124)
────────────────────────────────────────────────────────────────*/

/**
 * Determines session status based on blockers and completion indicators.
 * @param {string} blockers - Blockers text from extraction
 * @param {Object[]} observations - Session observations
 * @param {number} messageCount - Number of messages in session
 * @returns {string} Session status: 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'PAUSED'
 */
function determine_session_status(blockers, observations, message_count) {
  // Check for explicit completion indicators
  const completion_keywords = /\b(?:done|complete[d]?|finish(?:ed)?|success(?:ful(?:ly)?)?)\b/i;
  const last_obs = observations[observations.length - 1];

  if (blockers && blockers !== 'None') {
    return 'BLOCKED';
  }

  if (last_obs) {
    const narrative = last_obs.narrative || '';
    if (completion_keywords.test(narrative) || completion_keywords.test(last_obs.title || '')) {
      return 'COMPLETED';
    }
  }

  // Check if session has stalled (low message count with no recent activity)
  if (message_count < 3) {
    return 'IN_PROGRESS';
  }

  return 'IN_PROGRESS';
}

/**
 * Estimates completion percentage based on session characteristics.
 * @param {Object[]} observations - Session observations
 * @param {number} messageCount - Number of messages
 * @param {Object} toolCounts - Tool usage counts
 * @param {string} sessionStatus - Current session status
 * @returns {number} Estimated completion percentage (0-100)
 */
function estimate_completion_percent(observations, message_count, tool_counts, session_status) {
  if (session_status === 'COMPLETED') return 100;
  if (session_status === 'BLOCKED') return Math.min(90, message_count * 5);

  // Base estimation on activity metrics
  const total_tools = Object.values(tool_counts).reduce((a, b) => a + b, 0);
  const write_tools = (tool_counts.Write || 0) + (tool_counts.Edit || 0);
  const read_tools = (tool_counts.Read || 0) + (tool_counts.Grep || 0) + (tool_counts.Glob || 0);

  // Higher write activity suggests more progress
  let base_percent = 0;

  // Message-based progress (each message ~5% progress, max 50%)
  base_percent += Math.min(50, message_count * 5);

  // Write activity bonus (up to 30%)
  if (total_tools > 0) {
    base_percent += Math.min(30, (write_tools / total_tools) * 40);
  }

  // Observation-based progress (up to 20%)
  base_percent += Math.min(20, observations.length * 3);

  return Math.min(95, Math.round(base_percent)); // Cap at 95% unless explicitly completed
}

/**
 * Extracts pending tasks from observations and recent context.
 * @param {Object[]} observations - Session observations
 * @param {Object[]} recentContext - Recent context array
 * @param {string} nextAction - Next action text
 * @returns {Object[]} Array of pending tasks with TASK_ID, TASK_DESCRIPTION, TASK_PRIORITY
 */
function extract_pending_tasks(observations, recent_context, next_action) {
  const tasks = [];
  const task_patterns = [
    /\b(?:todo|task|need(?:s)? to|should|must|next):\s*(.+?)(?:[.!?\n]|$)/gi,
    /\[\s*\]\s*(.+?)(?:\n|$)/g,  // Unchecked checkboxes
    /\b(?:remaining|pending|left to do):\s*(.+?)(?:[.!?\n]|$)/gi
  ];

  let task_id = 1;
  const seen = new Set();

  // Extract from observations
  for (const obs of observations) {
    const text = `${obs.title || ''} ${obs.narrative || ''}`;
    for (const pattern of task_patterns) {
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(text)) !== null) {
        const task_desc = match[1].trim().substring(0, 100);
        if (task_desc.length > 10 && !seen.has(task_desc.toLowerCase())) {
          seen.add(task_desc.toLowerCase());
          tasks.push({
            TASK_ID: `T${String(task_id++).padStart(3, '0')}`,
            TASK_DESCRIPTION: task_desc,
            TASK_PRIORITY: 'P1'
          });
        }
      }
    }

    // Check facts for tasks
    if (obs.facts) {
      for (const fact of obs.facts) {
        const fact_text = typeof fact === 'string' ? fact : fact.text || '';
        for (const pattern of task_patterns) {
          let match;
          pattern.lastIndex = 0;
          while ((match = pattern.exec(fact_text)) !== null) {
            const task_desc = match[1].trim().substring(0, 100);
            if (task_desc.length > 10 && !seen.has(task_desc.toLowerCase())) {
              seen.add(task_desc.toLowerCase());
              tasks.push({
                TASK_ID: `T${String(task_id++).padStart(3, '0')}`,
                TASK_DESCRIPTION: task_desc,
                TASK_PRIORITY: 'P2'
              });
            }
          }
        }
      }
    }
  }

  // If next action is meaningful and not already captured, add as P0
  if (next_action &&
      next_action !== 'Continue implementation' &&
      !seen.has(next_action.toLowerCase())) {
    tasks.unshift({
      TASK_ID: 'T000',
      TASK_DESCRIPTION: next_action,
      TASK_PRIORITY: 'P0'
    });
  }

  return tasks.slice(0, 10); // Limit to 10 tasks
}

/**
 * Generates context summary for session continuation.
 * @param {string} summary - Session summary
 * @param {Object[]} observations - Session observations
 * @param {string} projectPhase - Current project phase
 * @param {number} decisionCount - Number of decisions made
 * @returns {string} Formatted context summary
 */
function generate_context_summary(summary, observations, project_phase, decision_count) {
  const parts = [];

  // Add phase context
  parts.push(`**Phase:** ${project_phase}`);

  // Add key activity summary
  if (observations.length > 0) {
    const recent_titles = observations
      .slice(-3)
      .map(o => o.title)
      .filter(t => t && t.length > 5)
      .join(', ');
    if (recent_titles) {
      parts.push(`**Recent:** ${recent_titles}`);
    }
  }

  // Add decision context
  if (decision_count > 0) {
    parts.push(`**Decisions:** ${decision_count} decision${decision_count > 1 ? 's' : ''} recorded`);
  }

  // Add summary if meaningful
  if (summary &&
      summary.length > 30 &&
      !summary.includes('SIMULATION') &&
      !summary.includes('[response]')) {
    const trimmed = summary.substring(0, 200);
    parts.push(`**Summary:** ${trimmed}${summary.length > 200 ? '...' : ''}`);
  }

  return parts.join('\n\n');
}

/**
 * Generates resume context items for quick review.
 * @param {Object[]} files - Modified files
 * @param {Object[]} specFiles - Spec folder files
 * @param {Object[]} observations - Session observations
 * @returns {Object[]} Array of context items with CONTEXT_ITEM
 */
function generate_resume_context(files, spec_files, observations) {
  const items = [];

  // Add key files modified
  if (files.length > 0) {
    const file_list = files.slice(0, 3).map(f => f.FILE_PATH).join(', ');
    items.push({ CONTEXT_ITEM: `Files modified: ${file_list}` });
  }

  // Add relevant spec files
  const priority_docs = ['tasks.md', 'checklist.md', 'plan.md'];
  const relevant_docs = spec_files.filter(sf => priority_docs.includes(sf.FILE_NAME));
  if (relevant_docs.length > 0) {
    items.push({ CONTEXT_ITEM: `Check: ${relevant_docs.map(d => d.FILE_NAME).join(', ')}` });
  }

  // Add last significant observation
  const last_meaningful = observations.find(o => o.narrative && o.narrative.length > 50);
  if (last_meaningful) {
    items.push({ CONTEXT_ITEM: `Last: ${(last_meaningful.title || last_meaningful.narrative).substring(0, 80)}` });
  }

  return items.slice(0, 5);
}

/**
 * Builds complete CONTINUE_SESSION data for template rendering.
 * @param {Object} params - Session parameters
 * @returns {Object} CONTINUE_SESSION template data
 */
function build_continue_session_data({
  observations,
  userPrompts,
  toolCounts,
  recentContext,
  FILES,
  SPEC_FILES,
  summary,
  projectPhase,
  lastAction,
  nextAction,
  blockers,
  duration,
  decisionCount
}) {
  // Determine session status
  const session_status = determine_session_status(blockers, observations, userPrompts.length);

  // Estimate completion
  const completion_percent = estimate_completion_percent(
    observations,
    userPrompts.length,
    toolCounts,
    session_status
  );

  // Extract pending tasks
  const pending_tasks = extract_pending_tasks(observations, recentContext, nextAction);

  // Generate context summary
  const context_summary = generate_context_summary(
    summary,
    observations,
    projectPhase,
    decisionCount
  );

  // Generate resume context
  const resume_context = generate_resume_context(FILES, SPEC_FILES, observations);

  // Get continuation count from recent context or default to 1
  const continuation_count = recentContext?.[0]?.continuationCount || 1;

  // Format last activity timestamp
  const last_prompt = userPrompts[userPrompts.length - 1];
  const last_activity = last_prompt?.timestamp
    ? new Date(last_prompt.timestamp).toISOString()
    : new Date().toISOString();

  return {
    SESSION_STATUS: session_status,
    COMPLETION_PERCENT: completion_percent,
    LAST_ACTIVITY_TIMESTAMP: last_activity,
    SESSION_DURATION: duration,
    CONTINUATION_COUNT: continuation_count,
    CONTEXT_SUMMARY: context_summary,
    PENDING_TASKS: pending_tasks,
    NEXT_CONTINUATION_COUNT: continuation_count + 1,
    // LAST_ACTION and NEXT_ACTION come from project state snapshot
    RESUME_CONTEXT: resume_context
  };
}

/* ─────────────────────────────────────────────────────────────
   2.5. LAZY-LOADED DEPENDENCIES
────────────────────────────────────────────────────────────────*/

let simFactory;
function get_sim_factory() {
  if (!simFactory) {
    simFactory = require('../lib/simulation-factory');
  }
  return simFactory;
}
const getSimFactory = get_sim_factory;

/* ─────────────────────────────────────────────────────────────
   3. AUTO-SAVE DETECTION
────────────────────────────────────────────────────────────────*/

function should_auto_save(message_count) {
  return message_count > 0 && message_count % CONFIG.MESSAGE_COUNT_TRIGGER === 0;
}

/* ─────────────────────────────────────────────────────────────
   4. SESSION DATA COLLECTION
────────────────────────────────────────────────────────────────*/

async function collect_session_data(collected_data, spec_folder_name = null) {
  const now = new Date();
  
  let folder_name = spec_folder_name;
  if (!folder_name) {
    const detected_folder = await detectSpecFolder();
    const specs_dir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
    folder_name = path.relative(specs_dir, detected_folder);
  }
  const date_only = formatTimestamp(now, 'date-dutch');
  const time_only = formatTimestamp(now, 'time-short');

  if (!collected_data) {
    console.log('   ⚠️  Using simulation data');
    return get_sim_factory().createSessionData({
      specFolder: folder_name,
      channel: getChannel(),
      skillVersion: CONFIG.SKILL_VERSION
    });
  }

  const session_info = collected_data.recent_context?.[0] || {};
  const observations = collected_data.observations || [];
  const user_prompts = collected_data.user_prompts || [];
  const message_count = user_prompts.length || 0;

  if (should_auto_save(message_count)) {
    console.log(`\n   📊 Context Budget: ${message_count} messages reached. Auto-saving context...\n`);
  }

  const duration = calculateSessionDuration(user_prompts, now);
  const FILES = extractFilesFromData(collected_data, observations);

  const OUTCOMES = observations
    .slice(0, 10)
    .map(obs => ({
      OUTCOME: obs.title || obs.narrative?.substring(0, 300),
      TYPE: detectObservationType(obs)
    }));

  const SUMMARY = session_info.learning
    || observations.slice(0, 3).map(o => o.narrative).join(' ')
    || 'Session focused on implementing and testing features.';

  const { contextType, importanceTier, decisionCount, toolCounts } =
    detectSessionCharacteristics(observations, user_prompts, FILES);
  
  const TOOL_COUNT = Object.values(toolCounts).reduce((sum, count) => sum + count, 0);

  const first_prompt = user_prompts[0]?.prompt || '';
  const task_from_prompt = first_prompt.match(/^(.{20,100}?)(?:[.!?\n]|$)/)?.[1];

  const OBSERVATIONS_DETAILED = buildObservationsWithAnchors(
    observations,
    collected_data.SPEC_FOLDER || folder_name
  );

  const session_id = generateSessionId();
  const channel = getChannel();
  const created_at_epoch = Math.floor(Date.now() / 1000);

  let SPEC_FILES = [];
  const active_specs_dir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
  const spec_folder_path = collected_data.SPEC_FOLDER
    ? path.join(active_specs_dir, collected_data.SPEC_FOLDER)
    : null;

  if (spec_folder_path) {
    try {
      SPEC_FILES = await detectRelatedDocs(spec_folder_path);
    } catch (doc_error) {
      console.warn(`   ⚠️  Could not detect related docs: ${doc_error.message}`);
      SPEC_FILES = [];
    }
  }

  const implementation_guide = buildImplementationGuideData(observations, FILES, folder_name);

  const { projectPhase, activeFile, lastAction, nextAction, blockers, fileProgress } =
    buildProjectStateSnapshot({
      toolCounts,
      observations,
      messageCount: message_count,
      FILES,
      SPEC_FILES,
      specFolderPath: spec_folder_path,
      recentContext: collected_data.recent_context
    });

  const expires_at_epoch = calculateExpiryEpoch(importanceTier, created_at_epoch);

  // Extract preflight/postflight data for learning delta tracking
  const preflight_postflight_data = extract_preflight_postflight_data(collected_data);

  // Build CONTINUE_SESSION data for session handover (T124)
  const continue_session_data = build_continue_session_data({
    observations,
    userPrompts: user_prompts,
    toolCounts,
    recentContext: collected_data.recent_context,
    FILES,
    SPEC_FILES,
    summary: SUMMARY,
    projectPhase,
    lastAction,
    nextAction,
    blockers,
    duration,
    decisionCount
  });

  return {
    TITLE: folder_name.replace(/^\d{3}-/, '').replace(/-/g, ' '),
    DATE: date_only,
    TIME: time_only,
    SPEC_FOLDER: folder_name,
    DURATION: duration,
    SUMMARY: SUMMARY,
    FILES: FILES.length > 0 ? FILES : [],
    HAS_FILES: FILES.length > 0,
    FILE_COUNT: FILES.length,
    OUTCOMES: OUTCOMES.length > 0 ? OUTCOMES : [{ OUTCOME: 'Session in progress' }],
    TOOL_COUNT,
    MESSAGE_COUNT: message_count,
    QUICK_SUMMARY: observations[0]?.title || session_info.request || task_from_prompt?.trim() || 'Development session',
    SKILL_VERSION: CONFIG.SKILL_VERSION,
    OBSERVATIONS: OBSERVATIONS_DETAILED,
    HAS_OBSERVATIONS: OBSERVATIONS_DETAILED.length > 0,
    SPEC_FILES: SPEC_FILES,
    HAS_SPEC_FILES: SPEC_FILES.length > 0,
    ...implementation_guide,
    SESSION_ID: session_id,
    CHANNEL: channel,
    IMPORTANCE_TIER: importanceTier,
    CONTEXT_TYPE: contextType,
    CREATED_AT_EPOCH: created_at_epoch,
    LAST_ACCESSED_EPOCH: created_at_epoch,
    EXPIRES_AT_EPOCH: expires_at_epoch,
    TOOL_COUNTS: toolCounts,
    DECISION_COUNT: decisionCount,
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1.0,
    PROJECT_PHASE: projectPhase,
    ACTIVE_FILE: activeFile,
    LAST_ACTION: lastAction,
    NEXT_ACTION: nextAction,
    BLOCKERS: blockers,
    FILE_PROGRESS: fileProgress,
    HAS_FILE_PROGRESS: fileProgress.length > 0,
    // Preflight/Postflight learning delta data
    ...preflight_postflight_data,
    // CONTINUE_SESSION data for session handover (T124)
    ...continue_session_data
  };
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Primary exports (snake_case)
  collect_session_data,
  should_auto_save,
  extract_preflight_postflight_data,
  calculate_learning_index,
  get_score_assessment,
  get_trend_indicator,
  generate_learning_summary,
  // CONTINUE_SESSION exports (T124)
  build_continue_session_data,
  determine_session_status,
  estimate_completion_percent,
  extract_pending_tasks,
  generate_context_summary,
  generate_resume_context,
  // Backward-compatible aliases (camelCase)
  collectSessionData: collect_session_data,
  shouldAutoSave: should_auto_save,
  extractPreflightPostflightData: extract_preflight_postflight_data,
  calculateLearningIndex: calculate_learning_index,
  getScoreAssessment: get_score_assessment,
  getTrendIndicator: get_trend_indicator,
  generateLearningSummary: generate_learning_summary,
  // CONTINUE_SESSION aliases (camelCase)
  buildContinueSessionData: build_continue_session_data,
  determineSessionStatus: determine_session_status,
  estimateCompletionPercent: estimate_completion_percent,
  extractPendingTasks: extract_pending_tasks,
  generateContextSummary: generate_context_summary,
  generateResumeContext: generate_resume_context
};
