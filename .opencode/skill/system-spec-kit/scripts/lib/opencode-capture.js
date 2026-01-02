// ───────────────────────────────────────────────────────────────
// LIB: OPENCODE SESSION DATA CAPTURE
// ───────────────────────────────────────────────────────────────

'use strict';

const fs = require('fs').promises;
const fs_sync = require('fs');
const path = require('path');
const readline = require('readline');

/* ─────────────────────────────────────────────────────────────
   1. STORAGE PATHS
──────────────────────────────────────────────────────────────── */

const OPENCODE_STORAGE = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.local/share/opencode/storage',
);

const PROMPT_HISTORY = path.join(
  process.env.HOME || process.env.USERPROFILE || '',
  '.local/state/opencode/prompt-history.jsonl',
);

/* ─────────────────────────────────────────────────────────────
   2. UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────── */

async function path_exists(file_path) {
  try {
    await fs.access(file_path);
    return true;
  } catch {
    return false;
  }
}

async function read_json_safe(file_path) {
  try {
    const content = await fs.readFile(file_path, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// Streams large JSONL files efficiently using circular buffer
async function read_jsonl_tail(file_path, limit) {
  if (!await path_exists(file_path)) {
    return [];
  }

  const results = [];

  try {
    const file_handle = await fs.open(file_path, 'r');
    const stream = file_handle.createReadStream({ encoding: 'utf-8' });

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    const buffer = [];

    for await (const line of rl) {
      if (line.trim()) {
        try {
          const parsed = JSON.parse(line);
          buffer.push(parsed);
          if (buffer.length > limit * 2) {
            buffer.splice(0, buffer.length - limit);
          }
        } catch {
          // Skip malformed lines
        }
      }
    }

    await file_handle.close();
    return buffer.slice(-limit);
  } catch (error) {
    console.warn(`   ⚠️ Error reading JSONL: ${error.message}`);
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
   3. PROMPT HISTORY
──────────────────────────────────────────────────────────────── */

async function get_recent_prompts(limit = 20) {
  const entries = await read_jsonl_tail(PROMPT_HISTORY, limit);

  return entries.map(entry => ({
    input: entry.input || '',
    timestamp: entry.timestamp || null,
    parts: entry.parts || [],
    mode: entry.mode || 'normal',
  }));
}

/* ─────────────────────────────────────────────────────────────
   4. SESSION DISCOVERY
──────────────────────────────────────────────────────────────── */

// OpenCode uses directory path hash as project ID
function get_project_id(directory) {
  const session_dir = path.join(OPENCODE_STORAGE, 'session');

  if (!fs_sync.existsSync(session_dir)) {
    return null;
  }

  try {
    const project_dirs = fs_sync.readdirSync(session_dir)
      .filter(name => !name.startsWith('.') && name !== 'global');

    for (const project_id of project_dirs) {
      const project_path = path.join(session_dir, project_id);
      const sessions = fs_sync.readdirSync(project_path)
        .filter(name => name.startsWith('ses_') && name.endsWith('.json'));

      if (sessions.length > 0) {
        const session_file = path.join(project_path, sessions[0]);
        const content = fs_sync.readFileSync(session_file, 'utf-8');
        const session = JSON.parse(content);

        if (session.directory === directory) {
          return project_id;
        }
      }
    }
  } catch {
    return null;
  }

  return null;
}

async function get_recent_sessions(project_id, limit = 10) {
  const session_dir = path.join(OPENCODE_STORAGE, 'session', project_id);

  if (!await path_exists(session_dir)) {
    return [];
  }

  try {
    const files = await fs.readdir(session_dir);
    const session_files = files
      .filter(name => name.startsWith('ses_') && name.endsWith('.json'));

    const sessions = [];

    for (const file of session_files) {
      const session = await read_json_safe(path.join(session_dir, file));
      if (session) {
        sessions.push({
          id: session.id,
          title: session.title || 'Untitled',
          created: session.time?.created || 0,
          updated: session.time?.updated || 0,
          summary: session.summary || {},
          parent_id: session.parentID || null,
        });
      }
    }

    sessions.sort((a, b) => b.updated - a.updated);
    return sessions.slice(0, limit);
  } catch {
    return [];
  }
}

async function get_current_session(project_id) {
  const sessions = await get_recent_sessions(project_id, 1);
  return sessions[0] || null;
}

/* ─────────────────────────────────────────────────────────────
   5. MESSAGE RETRIEVAL
──────────────────────────────────────────────────────────────── */

async function get_session_messages(session_id) {
  const message_dir = path.join(OPENCODE_STORAGE, 'message', session_id);

  if (!await path_exists(message_dir)) {
    return [];
  }

  try {
    const files = await fs.readdir(message_dir);
    const message_files = files
      .filter(name => name.startsWith('msg_') && name.endsWith('.json'));

    const messages = [];

    for (const file of message_files) {
      const msg = await read_json_safe(path.join(message_dir, file));
      if (msg) {
        messages.push({
          id: msg.id,
          session_id: msg.sessionID,
          role: msg.role,
          created: msg.time?.created || 0,
          completed: msg.time?.completed || null,
          parent_id: msg.parentID || null,
          model: msg.modelID || null,
          agent: msg.agent || 'general',
          summary: msg.summary || {},
        });
      }
    }

    messages.sort((a, b) => a.created - b.created);
    return messages;
  } catch {
    return [];
  }
}

/* ─────────────────────────────────────────────────────────────
   6. PART RETRIEVAL (RESPONSES & TOOL CALLS)
──────────────────────────────────────────────────────────────── */

// Parts include: text responses, tool calls, reasoning, step markers
async function get_message_parts(message_id) {
  const part_dir = path.join(OPENCODE_STORAGE, 'part', message_id);

  if (!await path_exists(part_dir)) {
    return [];
  }

  try {
    const files = await fs.readdir(part_dir);
    const part_files = files
      .filter(name => name.startsWith('prt_') && name.endsWith('.json'));

    const parts = [];

    for (const file of part_files) {
      const part = await read_json_safe(path.join(part_dir, file));
      if (part) {
        parts.push(part);
      }
    }

    parts.sort((a, b) => (a.time?.start || 0) - (b.time?.start || 0));
    return parts;
  } catch {
    return [];
  }
}

async function get_session_responses(session_id) {
  const messages = await get_session_messages(session_id);
  const responses = [];

  for (const msg of messages) {
    if (msg.role === 'assistant') {
      const parts = await get_message_parts(msg.id);
      const text_parts = parts.filter(p => p.type === 'text');

      for (const part of text_parts) {
        if (part.text && part.text.trim()) {
          responses.push({
            content: part.text,
            timestamp: part.time?.start || msg.created,
            message_id: msg.id,
            agent: msg.agent,
          });
        }
      }
    }
  }

  return responses;
}

async function get_tool_executions(session_id) {
  const messages = await get_session_messages(session_id);
  const tool_calls = [];

  for (const msg of messages) {
    if (msg.role === 'assistant') {
      const parts = await get_message_parts(msg.id);
      const tool_parts = parts.filter(p => p.type === 'tool');

      for (const part of tool_parts) {
        tool_calls.push({
          tool: part.tool || 'unknown',
          call_id: part.callID || null,
          input: part.state?.input || {},
          output: truncate_output(part.state?.output),
          status: part.state?.status || 'unknown',
          timestamp: part.state?.time?.start || msg.created,
          duration: calculate_duration(part.state?.time),
          title: part.state?.title || null,
          message_id: msg.id,
        });
      }
    }
  }

  return tool_calls;
}

function truncate_output(output, max_length = 500) {
  if (!output || typeof output !== 'string') return '';
  if (output.length <= max_length) return output;

  const half = Math.floor(max_length / 2) - 10;
  return output.substring(0, half) + '\n... [truncated] ...\n' + output.substring(output.length - half);
}

function calculate_duration(time) {
  if (!time || !time.start || !time.end) return null;
  return time.end - time.start;
}

/* ─────────────────────────────────────────────────────────────
   7. FULL CONVERSATION CAPTURE
──────────────────────────────────────────────────────────────── */

// Correlates prompts with responses and tool calls
async function capture_conversation(max_messages = 10, directory = process.cwd()) {
  if (!await path_exists(OPENCODE_STORAGE)) {
    throw new Error('OpenCode storage not found');
  }

  const project_id = get_project_id(directory);
  if (!project_id) {
    throw new Error(`No OpenCode sessions found for: ${directory}`);
  }

  const session = await get_current_session(project_id);
  if (!session) {
    throw new Error('No active session found');
  }

  const prompts = await get_recent_prompts(max_messages);
  const messages = await get_session_messages(session.id);
  const responses = await get_session_responses(session.id);
  const tool_calls = await get_tool_executions(session.id);
  const exchanges = build_exchanges(prompts, messages, responses, max_messages);

  return {
    session_id: session.id,
    session_title: session.title,
    project_id: project_id,
    directory: directory,
    captured_at: new Date().toISOString(),
    exchanges: exchanges,
    tool_calls: tool_calls.slice(-max_messages * 3),
    metadata: {
      total_messages: messages.length,
      total_responses: responses.length,
      total_tool_calls: tool_calls.length,
      session_created: session.created,
      session_updated: session.updated,
      file_summary: session.summary,
    },
  };
}

// Correlates prompts with assistant responses using timing/parent relationships
function build_exchanges(prompts, messages, responses, limit) {
  const exchanges = [];
  const user_messages = messages.filter(m => m.role === 'user');

  for (let i = 0; i < Math.min(user_messages.length, limit); i++) {
    const user_msg = user_messages[user_messages.length - 1 - i];

    // Match by timing (within 5 seconds)
    const prompt = prompts.find(p => {
      if (!p.timestamp && !user_msg.created) return false;
      const prompt_time = new Date(p.timestamp).getTime();
      return Math.abs(prompt_time - user_msg.created) < 5000;
    });

    // Match by parent relationship
    const response = responses.find(r => {
      const response_msg = messages.find(m => m.id === r.message_id);
      return response_msg?.parent_id === user_msg.id;
    });

    const user_input = prompt?.input || user_msg.summary?.title || null;
    const assistant_response = response?.content?.substring(0, 500) || null;

    // Skip empty exchanges
    if (!user_input && !assistant_response) {
      continue;
    }

    exchanges.unshift({
      user_input: user_input || 'User initiated conversation',
      assistant_response: assistant_response || 'Assistant processed request',
      timestamp: user_msg.created,
      user_message_id: user_msg.id,
      assistant_message_id: response?.message_id || null,
      mode: prompt?.mode || 'normal',
    });
  }

  return exchanges;
}

/* ─────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Snake_case exports (original)
  get_recent_prompts,
  get_session_responses,
  get_tool_executions,
  capture_conversation,
  get_project_id,
  get_recent_sessions,
  get_current_session,
  get_session_messages,
  get_message_parts,
  path_exists,
  read_json_safe,
  read_jsonl_tail,
  OPENCODE_STORAGE,
  PROMPT_HISTORY,
  // CamelCase aliases (for generate-context.js compatibility)
  getRecentPrompts: get_recent_prompts,
  getSessionResponses: get_session_responses,
  getToolExecutions: get_tool_executions,
  captureConversation: capture_conversation,
  getProjectId: get_project_id,
  getRecentSessions: get_recent_sessions,
  getCurrentSession: get_current_session,
  getSessionMessages: get_session_messages,
  getMessageParts: get_message_parts,
  pathExists: path_exists,
  readJsonSafe: read_json_safe,
  readJsonlTail: read_jsonl_tail,
};
