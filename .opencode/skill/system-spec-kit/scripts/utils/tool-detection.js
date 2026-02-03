// ───────────────────────────────────────────────────────────────
// UTILS: TOOL DETECTION
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
────────────────────────────────────────────────────────────────*/
'use strict';

/* ─────────────────────────────────────────────────────────────
   2. TOOL CALL DETECTION
────────────────────────────────────────────────────────────────*/

function detect_tool_call(text) {
  if (!text || typeof text !== 'string') return null;

  const explicitMatch = text.match(/\bTool:\s*(\w+)/i);
  if (explicitMatch) {
    return { tool: explicitMatch[1], confidence: 'high' };
  }

  const callSyntaxMatch = text.match(/^\s*(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch|Skill)\s*\(/);
  if (callSyntaxMatch) {
    return { tool: callSyntaxMatch[1], confidence: 'high' };
  }

  const usingToolMatch = text.match(/\busing\s+(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch)\s+tool\b/i);
  if (usingToolMatch) {
    return { tool: usingToolMatch[1], confidence: 'medium' };
  }

  const calledMatch = text.match(/\bcalled?\s+(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch)\s*\(/i);
  if (calledMatch) {
    return { tool: calledMatch[1], confidence: 'medium' };
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────
   3. PROSE CONTEXT DETECTION
────────────────────────────────────────────────────────────────*/

function is_prose_context(text, matchStartIndex) {
  if (matchStartIndex < 0) return false;

  const before = text.substring(Math.max(0, matchStartIndex - 20), matchStartIndex);
  const after = text.substring(matchStartIndex, Math.min(text.length, matchStartIndex + 50));

  const sentenceBefore = /[.!?]\s*$/;
  const lowercaseAfter = /^[a-z]/;

  if (sentenceBefore.test(before) && lowercaseAfter.test(after)) {
    return true;
  }

  const contextWindow = before.substring(Math.max(0, before.length - 10)) + after.substring(0, 30);
  const prosePatterns = [
    /\bread\s+more\b/i,
    /\bread\s+about\b/i,
    /\bread\s+the\b/i,
    /\bto\s+read\b/i,
    /\byou\s+should\s+read\b/i
  ];

  for (const pattern of prosePatterns) {
    if (pattern.test(contextWindow)) {
      return true;
    }
  }

  return false;
}

/* ─────────────────────────────────────────────────────────────
   4. CONVERSATION PHASE CLASSIFICATION
────────────────────────────────────────────────────────────────*/

function classify_conversation_phase(toolCalls, messageContent) {
  const tools = toolCalls.map(t => t.tool?.toLowerCase() || '');
  const content = messageContent.toLowerCase();

  if (tools.some(t => ['read', 'grep', 'glob', 'webfetch', 'websearch'].includes(t))) {
    return 'Research';
  }

  if (content.includes('plan') || content.includes('approach') || content.includes('should we')) {
    return 'Planning';
  }

  if (tools.some(t => ['edit', 'write', 'bash'].includes(t))) {
    return 'Implementation';
  }

  if (content.includes('error') || content.includes('fix') || content.includes('debug')) {
    return 'Debugging';
  }

  if (content.includes('test') || content.includes('verify') || content.includes('check')) {
    return 'Verification';
  }

  return 'Discussion';
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Primary exports (snake_case)
  detect_tool_call,
  is_prose_context,
  classify_conversation_phase,
  // Backwards compatibility aliases (camelCase)
  detectToolCall: detect_tool_call,
  isProseContext: is_prose_context,
  classifyConversationPhase: classify_conversation_phase
};
