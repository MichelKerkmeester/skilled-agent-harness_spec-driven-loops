/**
 * @fileoverview Memory trigger matching handler with cognitive features.
 * Implements fast phrase matching with attention decay, tiered content injection,
 * and co-activation for the memory_match_triggers tool.
 *
 * Cognitive Flow (when session_id provided):
 * 1. DECAY: Apply turn-based decay to all working memory scores
 * 2. MATCH: Find memories matching trigger phrases
 * 3. ACTIVATE: Set matched memories to score = 1.0
 * 4. CO-ACTIVATE: Boost related memories (+0.35)
 * 5. CLASSIFY: Assign HOT/WARM/COLD tiers
 * 6. RETURN: Tiered content (HOT=full, WARM=summary)
 *
 * @version 1.7.1 - Cognitive Memory Features
 * @module mcp_server/handlers/memory-triggers
 */
'use strict';

const path = require('path');

/* ───────────────────────────────────────────────────────────────
   DEPENDENCIES
   ─────────────────────────────────────────────────────────────── */

// Core utilities
const { check_database_updated } = require('../core');

// Formatters
const { calculate_token_metrics } = require('../formatters');

// Lib modules
const LIB_DIR = path.join(__dirname, '..', 'lib');
const triggerMatcher = require(path.join(LIB_DIR, 'trigger-matcher.js'));
const workingMemory = require(path.join(LIB_DIR, 'working-memory.js'));
const attentionDecay = require(path.join(LIB_DIR, 'attention-decay.js'));
const tierClassifier = require(path.join(LIB_DIR, 'tier-classifier.js'));
const coActivation = require(path.join(LIB_DIR, 'co-activation.js'));

/* ───────────────────────────────────────────────────────────────
   HANDLER: memory_match_triggers
   ─────────────────────────────────────────────────────────────── */

/**
 * Handle memory_match_triggers tool - fast phrase matching with cognitive features
 * v1.7.1: Adds attention decay, tiered content injection, and co-activation
 *
 * @param {Object} args - Tool arguments
 * @param {string} args.prompt - User prompt to match against trigger phrases
 * @param {number} [args.limit=3] - Maximum number of results to return
 * @param {string} [args.session_id] - Session ID for cognitive features
 * @param {number} [args.turn_number=1] - Current conversation turn number
 * @param {boolean} [args.include_cognitive=true] - Whether to include cognitive features
 * @returns {Promise<Object>} MCP response with matched memories
 */
async function handle_memory_match_triggers(args) {
  // BUG-001: Check for external database updates before processing
  await check_database_updated();

  const {
    prompt,
    limit: raw_limit = 3,
    session_id,
    turn_number: raw_turn_number = 1,
    include_cognitive = true
  } = args;

  // T120: Validate numeric parameters
  const limit = (typeof raw_limit === 'number' && Number.isFinite(raw_limit) && raw_limit > 0)
    ? Math.min(Math.floor(raw_limit), 50)
    : 3;
  const turn_number = (typeof raw_turn_number === 'number' && Number.isFinite(raw_turn_number) && raw_turn_number >= 0)
    ? Math.floor(raw_turn_number)
    : 1;

  if (!prompt || typeof prompt !== 'string') {
    throw new Error('prompt is required and must be a string');
  }

  const start_time = Date.now();

  // Check if cognitive features are enabled and requested
  const use_cognitive = include_cognitive &&
                       session_id &&
                       workingMemory.isEnabled() &&
                       workingMemory.getDb();

  // Step 1: DECAY - Apply decay to all working memory scores (if cognitive enabled)
  let decay_stats = null;
  if (use_cognitive) {
    try {
      decay_stats = attentionDecay.applyDecay(session_id, turn_number);
    } catch (err) {
      console.warn('[memory_match_triggers] Decay failed:', err.message);
    }
  }

  // Step 2: MATCH - Find memories matching trigger phrases
  const results = triggerMatcher.matchTriggerPhrases(prompt, limit * 2); // Get more for filtering

  if (!results || results.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            matchType: use_cognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
            count: 0,
            results: [],
            cognitive: use_cognitive ? {
              enabled: true,
              sessionId: session_id,
              turnNumber: turn_number,
              decayApplied: decay_stats ? decay_stats.decayedCount : 0
            } : null,
            message: 'No matching trigger phrases found'
          }, null, 2)
        }
      ]
    };
  }

  // Step 3-6: Apply cognitive features if enabled
  let formatted_results;
  let cognitive_stats = null;

  if (use_cognitive) {
    // Step 3: ACTIVATE - Set matched memories to score = 1.0
    const activated_memories = [];
    for (const match of results) {
      try {
        attentionDecay.activateMemory(session_id, match.memoryId, turn_number);
        activated_memories.push(match.memoryId);
      } catch (err) {
        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, err.message);
      }
    }

    // Step 4: CO-ACTIVATE - Boost related memories
    const co_activated_memories = [];
    if (coActivation.isEnabled()) {
      for (const memory_id of activated_memories) {
        try {
          const boosted = coActivation.spreadActivation(session_id, memory_id, turn_number);
          if (boosted && Array.isArray(boosted)) {
            co_activated_memories.push(...boosted);
          }
        } catch (err) {
          console.warn(`[memory_match_triggers] Co-activation failed for ${memory_id}:`, err.message);
        }
      }
    }

    // Step 5: CLASSIFY - Get all session memories and classify tiers
    const session_memories = workingMemory.getSessionMemories(session_id);

    // Build enriched results with tier info
    const enriched_results = results.map(match => {
      // Note: working-memory returns camelCase props (memoryId, attentionScore)
      const wm_entry = session_memories.find(wm => wm.memoryId === match.memoryId);
      const attention_score = wm_entry ? wm_entry.attentionScore : 1.0;
      const tier = tierClassifier.classifyTier(attention_score);

      return {
        ...match,
        attentionScore: attention_score,
        tier,
        coActivated: co_activated_memories.some(ca => ca.memoryId === match.memoryId)
      };
    });

    // Step 6: RETURN - Apply tier filtering and content depth
    const tiered_results = tierClassifier.filterAndLimitByTier(enriched_results);

    // Format with tiered content
    formatted_results = await Promise.all(tiered_results.map(async (r) => {
      const content = await tierClassifier.getTieredContent({
        filePath: r.filePath,
        title: r.title,
        triggerPhrases: r.matchedPhrases
      }, r.tier);

      return {
        memoryId: r.memoryId,
        specFolder: r.specFolder,
        filePath: r.filePath,
        title: r.title,
        matchedPhrases: r.matchedPhrases,
        importanceWeight: r.importanceWeight,
        tier: r.tier,
        attentionScore: r.attentionScore,
        content: content,
        coActivated: r.coActivated || false
      };
    }));

    // Collect cognitive stats including token metrics (CHK023)
    cognitive_stats = {
      enabled: true,
      sessionId: session_id,
      turnNumber: turn_number,
      decayApplied: decay_stats ? decay_stats.decayedCount : 0,
      memoriesActivated: activated_memories.length,
      coActivations: co_activated_memories.length,
      tierDistribution: tierClassifier.getTierStats(enriched_results),
      tokenMetrics: calculate_token_metrics(results, formatted_results)
    };

  } else {
    // Fallback: No cognitive features - return classic format
    formatted_results = results.slice(0, limit).map(r => ({
      memoryId: r.memoryId,
      specFolder: r.specFolder,
      filePath: r.filePath,
      title: r.title,
      matchedPhrases: r.matchedPhrases,
      importanceWeight: r.importanceWeight
    }));
  }

  const latency_ms = Date.now() - start_time;
  if (latency_ms > 100) {
    console.warn(`[memory_match_triggers] Latency ${latency_ms}ms exceeds 100ms target`);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          matchType: use_cognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
          count: formatted_results.length,
          results: formatted_results,
          cognitive: cognitive_stats,
          latencyMs: latency_ms
        }, null, 2)
      }
    ]
  };
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // snake_case export
  handle_memory_match_triggers,

  // Backward compatibility alias
  handleMemoryMatchTriggers: handle_memory_match_triggers
};
