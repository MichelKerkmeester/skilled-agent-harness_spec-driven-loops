// ───────────────────────────────────────────────────────────────
// EXTRACTORS: CONVERSATION EXTRACTOR
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

const { CONFIG } = require('../core');
const { formatTimestamp, truncateToolOutput, summarizeExchange } = require('../utils/message-utils');
const { detectToolCall, isProseContext, classifyConversationPhase } = require('../utils/tool-detection');
const simFactory = require('../lib/simulation-factory');
const flowchartGen = require('../lib/flowchart-generator');

/* ─────────────────────────────────────────────────────────────
   2. CONVERSATION EXTRACTION
──────────────────────────────────────────────────────────────── */

async function extract_conversations(collected_data) {
  if (!collected_data) {
    console.log('   ⚠️  Using simulation data for conversations');
    return simFactory.createConversationData();
  }

  const user_prompts = collected_data.user_prompts || [];
  const observations = collected_data.observations || [];

  if (user_prompts.length === 0 && observations.length === 0) {
    console.warn('   ⚠️  Warning: No conversation data found');
    console.warn('   ⚠️  Generated output may be minimal or empty');
  }

  if (user_prompts.length === 0) {
    console.warn(`   ⚠️  No user prompts found (empty conversation)`);
  }

  if (observations.length === 0) {
    console.warn(`   ⚠️  No observations found (no events documented)`);
  }

  const MESSAGES = [];
  const phase_timestamps = new Map();

  // Already filtered by transform-transcript.js
  const valid_prompts = user_prompts;

  for (let i = 0; i < valid_prompts.length; i++) {
    const user_prompt = valid_prompts[i];

    const raw_timestamp = user_prompt.timestamp || new Date().toISOString();
    const user_message = {
      TIMESTAMP: formatTimestamp(raw_timestamp, 'readable'),
      ROLE: 'User',
      CONTENT: user_prompt.prompt.trim(),
      TOOL_CALLS: []
    };
    MESSAGES.push(user_message);

    const user_time = new Date(raw_timestamp);
    const related_obs = observations.filter(obs => {
      const obs_time = new Date(obs.timestamp);
      const time_diff = Math.abs(obs_time - user_time);
      return time_diff < CONFIG.MESSAGE_TIME_WINDOW;
    });

    if (related_obs.length > 0) {
      const TOOL_CALLS = related_obs.flatMap(obs => {
        if (!obs.facts) return [];

        return obs.facts.map(fact => {
          if (!fact || typeof fact !== 'string') return null;

          const detection = detectToolCall(fact);
          if (!detection) return null;

          const tool_index = fact.search(new RegExp(`\\b${detection.tool}\\b`, 'i'));
          if (tool_index >= 0 && isProseContext(fact, tool_index)) {
            return null;
          }

          if (detection.confidence === 'low') return null;

          const file_match = fact.match(/File:\s*([^\n]+)/i) || fact.match(/(?:file_path|path):\s*([^\n]+)/i);
          const result_match = fact.match(/Result:\s*([^\n]+)/i);

          return {
            TOOL_NAME: detection.tool,
            DESCRIPTION: file_match?.[1] || fact.substring(0, 100),
            HAS_RESULT: !!result_match,
            RESULT_PREVIEW: result_match?.[1] ? truncateToolOutput(result_match[1], CONFIG.TOOL_PREVIEW_LINES) : '',
            HAS_MORE: result_match?.[1]?.split('\n').length > CONFIG.TOOL_PREVIEW_LINES
          };
        }).filter(Boolean);
      });

      const narratives = related_obs.map(o => o.narrative).filter(Boolean);
      const summary = summarizeExchange(
        user_message.CONTENT,
        narratives.join(' '),
        TOOL_CALLS
      );

      const assistant_message = {
        TIMESTAMP: formatTimestamp(related_obs[0].timestamp || raw_timestamp, 'readable'),
        ROLE: 'Assistant',
        CONTENT: summary.fullSummary,
        TOOL_CALLS: TOOL_CALLS.slice(0, 10)
      };

      MESSAGES.push(assistant_message);

      const phase = classifyConversationPhase(TOOL_CALLS, user_message.CONTENT);
      if (!phase_timestamps.has(phase)) {
        phase_timestamps.set(phase, []);
      }
      const phase_timestamp = user_message.TIMESTAMP.replace(' @ ', 'T');
      phase_timestamps.get(phase).push(new Date(phase_timestamp));
    }
  }

  // Ensure chronological order
  MESSAGES.sort((a, b) => {
    const time_a = new Date(a.TIMESTAMP.replace(' @ ', 'T')).getTime();
    const time_b = new Date(b.TIMESTAMP.replace(' @ ', 'T')).getTime();
    return time_a - time_b;
  });

  // User messages before assistant when timestamps equal
  for (let i = 0; i < MESSAGES.length - 1; i++) {
    const curr = MESSAGES[i];
    const next = MESSAGES[i + 1];
    const curr_time = new Date(curr.TIMESTAMP.replace(' @ ', 'T')).getTime();
    const next_time = new Date(next.TIMESTAMP.replace(' @ ', 'T')).getTime();

    if (curr_time === next_time && curr.ROLE === 'Assistant' && next.ROLE === 'User') {
      [MESSAGES[i], MESSAGES[i + 1]] = [MESSAGES[i + 1], MESSAGES[i]];
    }
  }

  const PHASES = Array.from(phase_timestamps.entries()).map(([PHASE_NAME, timestamps]) => {
    if (timestamps.length === 0) {
      return { PHASE_NAME, DURATION: 'N/A' };
    }

    const first_time = timestamps[0];
    const last_time = timestamps[timestamps.length - 1];
    const duration_ms = last_time - first_time;
    const minutes = Math.floor(duration_ms / 60000);

    return {
      PHASE_NAME,
      DURATION: minutes > 0 ? `${minutes} min` : '< 1 min'
    };
  });

  let duration = 'N/A';
  if (MESSAGES.length > 0) {
    const first_timestamp = MESSAGES[0].TIMESTAMP.replace(' @ ', 'T');
    const last_timestamp = MESSAGES[MESSAGES.length - 1].TIMESTAMP.replace(' @ ', 'T');
    const first_time = new Date(first_timestamp);
    const last_time = new Date(last_timestamp);
    const duration_ms = last_time - first_time;
    const minutes = Math.floor(duration_ms / 60000);
    const hours = Math.floor(minutes / 60);
    duration = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  }

  const has_decisions = MESSAGES.some(m => m.CONTENT.toLowerCase().includes('option') || m.CONTENT.toLowerCase().includes('decide'));
  const has_parallel = PHASES.length > 3;
  const FLOW_PATTERN = has_decisions
    ? 'Sequential with Decision Points'
    : has_parallel
    ? 'Multi-Phase Workflow'
    : 'Linear Sequential';

  const TOOL_COUNT = MESSAGES.reduce((count, msg) => count + msg.TOOL_CALLS.length, 0);

  const AUTO_GENERATED_FLOW = flowchartGen.generateConversationFlowchart(PHASES, user_prompts[0]?.prompt);

  return {
    MESSAGES,
    MESSAGE_COUNT: MESSAGES.length,
    DURATION: duration,
    FLOW_PATTERN,
    PHASE_COUNT: PHASES.length,
    PHASES,
    AUTO_GENERATED_FLOW,
    TOOL_COUNT,
    DATE: new Date().toISOString().split('T')[0]
  };
}

/* ─────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary export (snake_case)
  extract_conversations,
  // Backward-compatible alias (camelCase)
  extractConversations: extract_conversations
};
