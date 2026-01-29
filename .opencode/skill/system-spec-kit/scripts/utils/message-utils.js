// ───────────────────────────────────────────────────────────────
// UTILS: MESSAGE UTILS
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */
'use strict';

const { CONFIG } = require('../core');

/* ─────────────────────────────────────────────────────────────
   2. TIMESTAMP FORMATTING
──────────────────────────────────────────────────────────────── */

function format_timestamp(date = new Date(), format = 'iso') {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    console.warn(`Warning: Invalid date: ${date}, using current time`);
    return format_timestamp(new Date(), format);
  }

  const offsetMs = CONFIG.TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;
  const adjustedDate = new Date(d.getTime() + offsetMs);

  const isoString = adjustedDate.toISOString();
  const [datePart, timePart] = isoString.split('T');
  const timeWithoutMs = timePart.split('.')[0];

  switch (format) {
    case 'iso':
      return isoString.split('.')[0] + 'Z';

    case 'readable':
      return `${datePart} @ ${timeWithoutMs}`;

    case 'date':
      return datePart;

    case 'date-dutch': {
      const [year, month, day] = datePart.split('-');
      const shortYear = year.slice(-2);
      return `${day}-${month}-${shortYear}`;
    }

    case 'time':
      return timeWithoutMs;

    case 'time-short': {
      const [hours, minutes] = timeWithoutMs.split(':');
      return `${hours}-${minutes}`;
    }

    case 'filename':
      return `${datePart}_${timeWithoutMs.replace(/:/g, '-')}`;

    default:
      console.warn(`Warning: Unknown format "${format}", using ISO`);
      return isoString;
  }
}

/* ─────────────────────────────────────────────────────────────
   3. OUTPUT TRUNCATION
──────────────────────────────────────────────────────────────── */

function truncate_tool_output(output, maxLines = CONFIG.MAX_TOOL_OUTPUT_LINES) {
  if (!output) return '';

  const lines = output.split('\n');

  if (lines.length <= maxLines) {
    return output;
  }

  const firstLines = lines.slice(0, CONFIG.TRUNCATE_FIRST_LINES);
  const lastLines = lines.slice(-CONFIG.TRUNCATE_LAST_LINES);
  const truncatedCount = lines.length - CONFIG.TRUNCATE_FIRST_LINES - CONFIG.TRUNCATE_LAST_LINES;

  return [
    ...firstLines,
    '',
    `... [Truncated: ${truncatedCount} lines] ...`,
    '',
    ...lastLines
  ].join('\n');
}

/* ─────────────────────────────────────────────────────────────
   4. EXCHANGE SUMMARIZATION
──────────────────────────────────────────────────────────────── */

function summarize_exchange(userMessage, assistantResponse, toolCalls = []) {
  let userIntent;
  if (userMessage.length <= 200) {
    userIntent = userMessage;
  } else {
    const sentenceEnd = userMessage.substring(0, 200).match(/^(.+?[.!?])\s/);
    userIntent = sentenceEnd ? sentenceEnd[1] : userMessage.substring(0, 200) + '...';
  }

  const mainTools = toolCalls.slice(0, 3).map(t => t.tool || t.TOOL_NAME).join(', ');
  const toolSummary = toolCalls.length > 0
    ? ` Used tools: ${mainTools}${toolCalls.length > 3 ? ` and ${toolCalls.length - 3} more` : ''}.`
    : '';

  const sentences = assistantResponse.match(/[^.!?]+[.!?]+/g) || [];
  const outcome = sentences.length > 0
    ? sentences.slice(0, 2).join(' ').trim()
    : assistantResponse.substring(0, 300);

  return {
    userIntent,
    outcome: outcome + (outcome.length < assistantResponse.length ? '...' : ''),
    toolSummary,
    fullSummary: `${userIntent} → ${outcome}${toolSummary}`
  };
}

/* ─────────────────────────────────────────────────────────────
   5. ARTIFACT EXTRACTION
──────────────────────────────────────────────────────────────── */

function extract_key_artifacts(messages) {
  const artifacts = {
    filesCreated: [],
    filesModified: [],
    commandsExecuted: [],
    errorsEncountered: []
  };

  for (const msg of messages) {
    if (!msg.tool_calls) continue;

    for (const tool of msg.tool_calls) {
      const toolName = tool.tool?.toLowerCase() || '';

      if (toolName === 'write') {
        artifacts.filesCreated.push({
          path: tool.file_path || 'unknown',
          timestamp: msg.timestamp
        });
      } else if (toolName === 'edit') {
        artifacts.filesModified.push({
          path: tool.file_path || 'unknown',
          timestamp: msg.timestamp
        });
      } else if (toolName === 'bash') {
        artifacts.commandsExecuted.push({
          command: tool.command || 'unknown',
          timestamp: msg.timestamp
        });
      }

      if (tool.result && typeof tool.result === 'string') {
        if (tool.result.includes('Error:') || tool.result.includes('error:')) {
          artifacts.errorsEncountered.push({
            error: tool.result.substring(0, 200),
            timestamp: msg.timestamp
          });
        }
      }
    }
  }

  return artifacts;
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (snake_case)
  format_timestamp,
  truncate_tool_output,
  summarize_exchange,
  extract_key_artifacts,
  // Backwards compatibility aliases (camelCase)
  formatTimestamp: format_timestamp,
  truncateToolOutput: truncate_tool_output,
  summarizeExchange: summarize_exchange,
  extractKeyArtifacts: extract_key_artifacts
};
