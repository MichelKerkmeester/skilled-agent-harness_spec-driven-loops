#!/usr/bin/env node

/**
 * OpenCode Session Data Capture
 * Extracts actual conversation data from OpenCode storage
 * 
 * @module opencode-capture
 * @version 1.0.0
 * 
 * Storage locations (discovered via Agent 8 research):
 * - User prompts: ~/.local/state/opencode/prompt-history.jsonl
 * - AI responses: ~/.local/share/opencode/storage/part/{msg}/prt_*.json (type: text)
 * - Tool calls: ~/.local/share/opencode/storage/part/{msg}/prt_*.json (type: tool)
 * - Session metadata: ~/.local/share/opencode/storage/session/{project}/ses_*.json
 * - Message index: ~/.local/share/opencode/storage/message/{session}/msg_*.json
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const readline = require('readline');

// ───────────────────────────────────────────────────────────────
// STORAGE PATHS
// ───────────────────────────────────────────────────────────────

const OPENCODE_STORAGE = path.join(
  process.env.HOME || '',
  '.local/share/opencode/storage'
);

const PROMPT_HISTORY = path.join(
  process.env.HOME || '',
  '.local/state/opencode/prompt-history.jsonl'
);

// ───────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ───────────────────────────────────────────────────────────────

/**
 * Check if a path exists
 * @param {string} filePath - Path to check
 * @returns {Promise<boolean>}
 */
async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read JSON file safely
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<Object|null>} Parsed JSON or null on error
 */
async function readJsonSafe(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Read JSONL file and return last N lines
 * Uses streaming to efficiently read large files from the end
 * @param {string} filePath - Path to JSONL file
 * @param {number} limit - Maximum lines to return
 * @returns {Promise<Array<Object>>}
 */
async function readJsonlTail(filePath, limit) {
  if (!await pathExists(filePath)) {
    return [];
  }

  const results = [];
  
  try {
    const fileHandle = await fs.open(filePath, 'r');
    const stream = fileHandle.createReadStream({ encoding: 'utf-8' });
    
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity
    });

    // Collect all lines (for small files) or use circular buffer (for large files)
    const buffer = [];
    
    for await (const line of rl) {
      if (line.trim()) {
        try {
          const parsed = JSON.parse(line);
          buffer.push(parsed);
          // Keep only last 'limit' entries in buffer
          if (buffer.length > limit * 2) {
            buffer.splice(0, buffer.length - limit);
          }
        } catch {
          // Skip malformed lines
        }
      }
    }

    await fileHandle.close();
    
    // Return last 'limit' entries
    return buffer.slice(-limit);
  } catch (error) {
    console.warn(`   ⚠️ Error reading JSONL: ${error.message}`);
    return [];
  }
}

// ───────────────────────────────────────────────────────────────
// PROMPT HISTORY
// ───────────────────────────────────────────────────────────────

/**
 * Get recent user prompts from prompt-history.jsonl
 * @param {number} limit - Maximum prompts to retrieve (default: 20)
 * @returns {Promise<Array<Object>>} Array of {input, timestamp, parts, mode}
 */
async function getRecentPrompts(limit = 20) {
  const entries = await readJsonlTail(PROMPT_HISTORY, limit);
  
  return entries.map(entry => ({
    input: entry.input || '',
    timestamp: entry.timestamp || null,
    parts: entry.parts || [],
    mode: entry.mode || 'normal'
  }));
}

// ───────────────────────────────────────────────────────────────
// SESSION DISCOVERY
// ───────────────────────────────────────────────────────────────

/**
 * Get project ID for the current working directory
 * OpenCode uses a hash of the directory path as project ID
 * @param {string} directory - Project directory path
 * @returns {string|null} Project ID (directory hash) or null
 */
function getProjectId(directory) {
  // List session directories and find one that matches our project
  const sessionDir = path.join(OPENCODE_STORAGE, 'session');
  
  if (!fsSync.existsSync(sessionDir)) {
    return null;
  }

  try {
    const projectDirs = fsSync.readdirSync(sessionDir)
      .filter(name => !name.startsWith('.') && name !== 'global');
    
    // Check each project directory for matching sessions
    for (const projectId of projectDirs) {
      const projectPath = path.join(sessionDir, projectId);
      const sessions = fsSync.readdirSync(projectPath)
        .filter(name => name.startsWith('ses_') && name.endsWith('.json'));
      
      if (sessions.length > 0) {
        // Read first session to check directory
        const sessionFile = path.join(projectPath, sessions[0]);
        const content = fsSync.readFileSync(sessionFile, 'utf-8');
        const session = JSON.parse(content);
        
        if (session.directory === directory) {
          return projectId;
        }
      }
    }
  } catch {
    return null;
  }
  
  return null;
}

/**
 * Get recent sessions for a project
 * @param {string} projectId - Project ID (directory hash)
 * @param {number} limit - Maximum sessions to return
 * @returns {Promise<Array<Object>>} Array of session metadata
 */
async function getRecentSessions(projectId, limit = 10) {
  const sessionDir = path.join(OPENCODE_STORAGE, 'session', projectId);
  
  if (!await pathExists(sessionDir)) {
    return [];
  }

  try {
    const files = await fs.readdir(sessionDir);
    const sessionFiles = files
      .filter(name => name.startsWith('ses_') && name.endsWith('.json'));

    const sessions = [];
    
    for (const file of sessionFiles) {
      const session = await readJsonSafe(path.join(sessionDir, file));
      if (session) {
        sessions.push({
          id: session.id,
          title: session.title || 'Untitled',
          created: session.time?.created || 0,
          updated: session.time?.updated || 0,
          summary: session.summary || {},
          parentId: session.parentID || null
        });
      }
    }

    // Sort by updated time (most recent first)
    sessions.sort((a, b) => b.updated - a.updated);
    
    return sessions.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Get current/most recent session
 * @param {string} projectId - Project ID
 * @returns {Promise<Object|null>} Session metadata or null
 */
async function getCurrentSession(projectId) {
  const sessions = await getRecentSessions(projectId, 1);
  return sessions[0] || null;
}

// ───────────────────────────────────────────────────────────────
// MESSAGE RETRIEVAL
// ───────────────────────────────────────────────────────────────

/**
 * Get messages for a session
 * @param {string} sessionId - Session ID (ses_*)
 * @returns {Promise<Array<Object>>} Array of message metadata
 */
async function getSessionMessages(sessionId) {
  const messageDir = path.join(OPENCODE_STORAGE, 'message', sessionId);
  
  if (!await pathExists(messageDir)) {
    return [];
  }

  try {
    const files = await fs.readdir(messageDir);
    const messageFiles = files
      .filter(name => name.startsWith('msg_') && name.endsWith('.json'));

    const messages = [];
    
    for (const file of messageFiles) {
      const msg = await readJsonSafe(path.join(messageDir, file));
      if (msg) {
        messages.push({
          id: msg.id,
          sessionId: msg.sessionID,
          role: msg.role,
          created: msg.time?.created || 0,
          completed: msg.time?.completed || null,
          parentId: msg.parentID || null,
          model: msg.modelID || null,
          agent: msg.agent || 'general',
          summary: msg.summary || {}
        });
      }
    }

    // Sort by creation time
    messages.sort((a, b) => a.created - b.created);
    
    return messages;
  } catch {
    return [];
  }
}

// ───────────────────────────────────────────────────────────────
// PART RETRIEVAL (Responses & Tool Calls)
// ───────────────────────────────────────────────────────────────

/**
 * Get all parts for a message
 * Parts include: text responses, tool calls, reasoning, step markers
 * @param {string} messageId - Message ID (msg_*)
 * @returns {Promise<Array<Object>>} Array of parts
 */
async function getMessageParts(messageId) {
  const partDir = path.join(OPENCODE_STORAGE, 'part', messageId);
  
  if (!await pathExists(partDir)) {
    return [];
  }

  try {
    const files = await fs.readdir(partDir);
    const partFiles = files
      .filter(name => name.startsWith('prt_') && name.endsWith('.json'));

    const parts = [];
    
    for (const file of partFiles) {
      const part = await readJsonSafe(path.join(partDir, file));
      if (part) {
        parts.push(part);
      }
    }

    // Sort by start time if available
    parts.sort((a, b) => {
      const timeA = a.time?.start || 0;
      const timeB = b.time?.start || 0;
      return timeA - timeB;
    });
    
    return parts;
  } catch {
    return [];
  }
}

/**
 * Get AI text responses for a session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Array<Object>>} Array of {content, timestamp, messageId}
 */
async function getSessionResponses(sessionId) {
  const messages = await getSessionMessages(sessionId);
  const responses = [];

  for (const msg of messages) {
    if (msg.role === 'assistant') {
      const parts = await getMessageParts(msg.id);
      
      // Filter for text parts only
      const textParts = parts.filter(p => p.type === 'text');
      
      for (const part of textParts) {
        if (part.text && part.text.trim()) {
          responses.push({
            content: part.text,
            timestamp: part.time?.start || msg.created,
            messageId: msg.id,
            agent: msg.agent
          });
        }
      }
    }
  }

  return responses;
}

/**
 * Get tool executions for a session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Array<Object>>} Array of {tool, input, output, status, timestamp}
 */
async function getToolExecutions(sessionId) {
  const messages = await getSessionMessages(sessionId);
  const toolCalls = [];

  for (const msg of messages) {
    if (msg.role === 'assistant') {
      const parts = await getMessageParts(msg.id);
      
      // Filter for tool parts only
      const toolParts = parts.filter(p => p.type === 'tool');
      
      for (const part of toolParts) {
        toolCalls.push({
          tool: part.tool || 'unknown',
          callId: part.callID || null,
          input: part.state?.input || {},
          output: truncateOutput(part.state?.output),
          status: part.state?.status || 'unknown',
          timestamp: part.state?.time?.start || msg.created,
          duration: calculateDuration(part.state?.time),
          title: part.state?.title || null,
          messageId: msg.id
        });
      }
    }
  }

  return toolCalls;
}

/**
 * Truncate tool output to prevent memory issues
 * @param {string} output - Raw output
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated output
 */
function truncateOutput(output, maxLength = 500) {
  if (!output || typeof output !== 'string') return '';
  if (output.length <= maxLength) return output;
  
  const half = Math.floor(maxLength / 2) - 10;
  return output.substring(0, half) + '\n... [truncated] ...\n' + output.substring(output.length - half);
}

/**
 * Calculate duration from time object
 * @param {Object} time - {start, end} timestamps
 * @returns {number|null} Duration in ms or null
 */
function calculateDuration(time) {
  if (!time || !time.start || !time.end) return null;
  return time.end - time.start;
}

// ───────────────────────────────────────────────────────────────
// FULL CONVERSATION CAPTURE
// ───────────────────────────────────────────────────────────────

/**
 * Capture full conversation context from current session
 * Correlates prompts with responses and tool calls
 * 
 * @param {number} maxMessages - Maximum messages to capture (default: 10)
 * @param {string} directory - Project directory (default: cwd)
 * @returns {Promise<Object>} Full conversation data
 */
async function captureConversation(maxMessages = 10, directory = process.cwd()) {
  // Check if OpenCode storage exists
  if (!await pathExists(OPENCODE_STORAGE)) {
    throw new Error('OpenCode storage not found');
  }

  // Get project ID for this directory
  const projectId = getProjectId(directory);
  if (!projectId) {
    throw new Error(`No OpenCode sessions found for: ${directory}`);
  }

  // Get current session
  const session = await getCurrentSession(projectId);
  if (!session) {
    throw new Error('No active session found');
  }

  // Get recent prompts (from global history)
  const prompts = await getRecentPrompts(maxMessages);

  // Get session messages, responses, and tool calls
  const messages = await getSessionMessages(session.id);
  const responses = await getSessionResponses(session.id);
  const toolCalls = await getToolExecutions(session.id);

  // Build conversation exchanges by correlating prompts with responses
  const exchanges = buildExchanges(prompts, messages, responses, maxMessages);

  return {
    sessionId: session.id,
    sessionTitle: session.title,
    projectId: projectId,
    directory: directory,
    capturedAt: new Date().toISOString(),
    exchanges: exchanges,
    toolCalls: toolCalls.slice(-maxMessages * 3), // Approx 3 tools per message
    metadata: {
      totalMessages: messages.length,
      totalResponses: responses.length,
      totalToolCalls: toolCalls.length,
      sessionCreated: session.created,
      sessionUpdated: session.updated,
      fileSummary: session.summary
    }
  };
}

/**
 * Build conversation exchanges by correlating prompts with assistant responses
 * @param {Array} prompts - User prompts from history
 * @param {Array} messages - Session messages
 * @param {Array} responses - AI responses
 * @param {number} limit - Max exchanges
 * @returns {Array} Correlated exchanges
 */
function buildExchanges(prompts, messages, responses, limit) {
  const exchanges = [];
  
  // Get user messages from session
  const userMessages = messages.filter(m => m.role === 'user');
  
  // Match prompts to responses using parent relationship or timing
  for (let i = 0; i < Math.min(userMessages.length, limit); i++) {
    const userMsg = userMessages[userMessages.length - 1 - i]; // Start from most recent
    
    // Find corresponding prompt by timing (within 5 seconds)
    const prompt = prompts.find(p => {
      if (!p.timestamp && !userMsg.created) return false;
      const promptTime = new Date(p.timestamp).getTime();
      const msgTime = userMsg.created;
      return Math.abs(promptTime - msgTime) < 5000;
    });

    // Find assistant response that follows this user message
    const response = responses.find(r => {
      // Find message that has this user message as parent
      const responseMsg = messages.find(m => m.id === r.messageId);
      return responseMsg?.parentId === userMsg.id;
    });

    // Build meaningful exchange with proper fallbacks
    // Avoid placeholder values like '[response]' that pollute memory files
    const userInput = prompt?.input || userMsg.summary?.title || null;
    const assistantResponse = response?.content?.substring(0, 500) || null;
    
    // Only include exchanges that have meaningful content
    // Skip exchanges where both user and assistant content are missing
    if (!userInput && !assistantResponse) {
      continue; // Skip empty exchanges
    }
    
    exchanges.unshift({
      userInput: userInput || 'User initiated conversation',
      assistantResponse: assistantResponse || 'Assistant processed request', 
      timestamp: userMsg.created,
      userMessageId: userMsg.id,
      assistantMessageId: response?.messageId || null,
      mode: prompt?.mode || 'normal'
    });
  }

  return exchanges;
}

// ───────────────────────────────────────────────────────────────
// EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  // Core capture functions
  getRecentPrompts,
  getSessionResponses,
  getToolExecutions,
  captureConversation,
  
  // Session discovery
  getProjectId,
  getRecentSessions,
  getCurrentSession,
  
  // Message/Part retrieval
  getSessionMessages,
  getMessageParts,
  
  // Utilities
  pathExists,
  readJsonSafe,
  readJsonlTail,
  
  // Constants
  OPENCODE_STORAGE,
  PROMPT_HISTORY
};
