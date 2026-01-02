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

async function extractConversations(collectedData) {
  if (!collectedData) {
    console.log('   ⚠️  Using simulation data for conversations');
    return simFactory.createConversationData();
  }

  const userPrompts = collectedData.user_prompts || [];
  const observations = collectedData.observations || [];

  if (userPrompts.length === 0 && observations.length === 0) {
    console.warn('   ⚠️  Warning: No conversation data found');
    console.warn('   ⚠️  Generated output may be minimal or empty');
  }

  if (userPrompts.length === 0) {
    console.warn(`   ⚠️  No user prompts found (empty conversation)`);
  }

  if (observations.length === 0) {
    console.warn(`   ⚠️  No observations found (no events documented)`);
  }

  const MESSAGES = [];
  const phaseTimestamps = new Map();

  // Already filtered by transform-transcript.js
  const validPrompts = userPrompts;

  for (let i = 0; i < validPrompts.length; i++) {
    const userPrompt = validPrompts[i];

    const rawTimestamp = userPrompt.timestamp || new Date().toISOString();
    const userMessage = {
      TIMESTAMP: formatTimestamp(rawTimestamp, 'readable'),
      ROLE: 'User',
      CONTENT: userPrompt.prompt.trim(),
      TOOL_CALLS: []
    };
    MESSAGES.push(userMessage);

    const userTime = new Date(rawTimestamp);
    const relatedObs = observations.filter(obs => {
      const obsTime = new Date(obs.timestamp);
      const timeDiff = Math.abs(obsTime - userTime);
      return timeDiff < CONFIG.MESSAGE_TIME_WINDOW;
    });

    if (relatedObs.length > 0) {
      const TOOL_CALLS = relatedObs.flatMap(obs => {
        if (!obs.facts) return [];

        return obs.facts.map(fact => {
          if (!fact || typeof fact !== 'string') return null;

          const detection = detectToolCall(fact);
          if (!detection) return null;

          const toolIndex = fact.search(new RegExp(`\\b${detection.tool}\\b`, 'i'));
          if (toolIndex >= 0 && isProseContext(fact, toolIndex)) {
            return null;
          }

          if (detection.confidence === 'low') return null;

          const fileMatch = fact.match(/File:\s*([^\n]+)/i) || fact.match(/(?:file_path|path):\s*([^\n]+)/i);
          const resultMatch = fact.match(/Result:\s*([^\n]+)/i);

          return {
            TOOL_NAME: detection.tool,
            DESCRIPTION: fileMatch?.[1] || fact.substring(0, 100),
            HAS_RESULT: !!resultMatch,
            RESULT_PREVIEW: resultMatch?.[1] ? truncateToolOutput(resultMatch[1], CONFIG.TOOL_PREVIEW_LINES) : '',
            HAS_MORE: resultMatch?.[1]?.split('\n').length > CONFIG.TOOL_PREVIEW_LINES
          };
        }).filter(Boolean);
      });

      const narratives = relatedObs.map(o => o.narrative).filter(Boolean);
      const summary = summarizeExchange(
        userMessage.CONTENT,
        narratives.join(' '),
        TOOL_CALLS
      );

      const assistantMessage = {
        TIMESTAMP: formatTimestamp(relatedObs[0].timestamp || rawTimestamp, 'readable'),
        ROLE: 'Assistant',
        CONTENT: summary.fullSummary,
        TOOL_CALLS: TOOL_CALLS.slice(0, 10)
      };

      MESSAGES.push(assistantMessage);

      const phase = classifyConversationPhase(TOOL_CALLS, userMessage.CONTENT);
      if (!phaseTimestamps.has(phase)) {
        phaseTimestamps.set(phase, []);
      }
      const phaseTimestamp = userMessage.TIMESTAMP.replace(' @ ', 'T');
      phaseTimestamps.get(phase).push(new Date(phaseTimestamp));
    }
  }

  // Ensure chronological order
  MESSAGES.sort((a, b) => {
    const timeA = new Date(a.TIMESTAMP.replace(' @ ', 'T')).getTime();
    const timeB = new Date(b.TIMESTAMP.replace(' @ ', 'T')).getTime();
    return timeA - timeB;
  });

  // User messages before assistant when timestamps equal
  for (let i = 0; i < MESSAGES.length - 1; i++) {
    const curr = MESSAGES[i];
    const next = MESSAGES[i + 1];
    const currTime = new Date(curr.TIMESTAMP.replace(' @ ', 'T')).getTime();
    const nextTime = new Date(next.TIMESTAMP.replace(' @ ', 'T')).getTime();

    if (currTime === nextTime && curr.ROLE === 'Assistant' && next.ROLE === 'User') {
      [MESSAGES[i], MESSAGES[i + 1]] = [MESSAGES[i + 1], MESSAGES[i]];
    }
  }

  const PHASES = Array.from(phaseTimestamps.entries()).map(([PHASE_NAME, timestamps]) => {
    if (timestamps.length === 0) {
      return { PHASE_NAME, DURATION: 'N/A' };
    }

    const firstTime = timestamps[0];
    const lastTime = timestamps[timestamps.length - 1];
    const durationMs = lastTime - firstTime;
    const minutes = Math.floor(durationMs / 60000);

    return {
      PHASE_NAME,
      DURATION: minutes > 0 ? `${minutes} min` : '< 1 min'
    };
  });

  let duration = 'N/A';
  if (MESSAGES.length > 0) {
    const firstTimestamp = MESSAGES[0].TIMESTAMP.replace(' @ ', 'T');
    const lastTimestamp = MESSAGES[MESSAGES.length - 1].TIMESTAMP.replace(' @ ', 'T');
    const firstTime = new Date(firstTimestamp);
    const lastTime = new Date(lastTimestamp);
    const durationMs = lastTime - firstTime;
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    duration = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  }

  const hasDecisions = MESSAGES.some(m => m.CONTENT.toLowerCase().includes('option') || m.CONTENT.toLowerCase().includes('decide'));
  const hasParallel = PHASES.length > 3;
  const FLOW_PATTERN = hasDecisions
    ? 'Sequential with Decision Points'
    : hasParallel
    ? 'Multi-Phase Workflow'
    : 'Linear Sequential';

  const TOOL_COUNT = MESSAGES.reduce((count, msg) => count + msg.TOOL_CALLS.length, 0);

  const AUTO_GENERATED_FLOW = flowchartGen.generateConversationFlowchart(PHASES, userPrompts[0]?.prompt);

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
  extractConversations
};
