// ───────────────────────────────────────────────────────────────────
// MODULE: Session Reader Fixtures
// ───────────────────────────────────────────────────────────────────
// Each builder writes one runtime store in a temp root and returns the options
// its reader needs. The shapes follow the live store contracts the decision
// capture sweeps already parse, trimmed to the entries a history read needs.

import { mkdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { dshProjectKey } from '../../session-readers/dsh.mjs';
import { piProjectDirectory } from '../../session-readers/pi.mjs';
import { writeJson, writeJsonl } from './helpers.mjs';

export const SESSION = 'aaaaaaaa-1111-4111-8111-111111111111';
export const DECOY = 'bbbbbbbb-2222-4222-8222-222222222222';
export const NOW = '2026-11-07T12:00:00.000Z';
export const T0 = Date.parse(NOW);

function iso(offset) {
  return new Date(T0 + offset).toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CLAUDE
// ─────────────────────────────────────────────────────────────────────────────

export function claudeSession({ root, sessionId = SESSION, headerId = sessionId, fileName, subagents = false, resultText = null } = {}) {
  const claudeRoot = join(root, 'claude', 'projects');
  const filePath = subagents
    ? join(claudeRoot, sessionId, 'subagents', 'agent-1.jsonl')
    : join(claudeRoot, sessionId, fileName ?? `${sessionId}.jsonl`);

  writeJsonl(filePath, [
    { type: 'user', uuid: 'claude-u1', sessionId: headerId, timestamp: iso(0), message: { role: 'user', content: [{ type: 'text', text: 'Read the file.' }] } },
    {
      type: 'assistant',
      uuid: 'claude-a1',
      sessionId: headerId,
      timestamp: iso(1000),
      message: {
        role: 'assistant',
        content: [
          { type: 'text', text: 'Reading it now.' },
          { type: 'tool_use', id: 'claude-call-1', name: 'Read', input: { path: 'file.txt' } },
        ],
      },
    },
    {
      type: 'user',
      uuid: 'claude-u2',
      sessionId: headerId,
      timestamp: iso(2000),
      toolUseResult: { content: 'file contents' },
      message: {
        role: 'user',
        content: [
          ...(resultText ? [{ type: 'text', text: resultText }] : []),
          { type: 'tool_result', tool_use_id: 'claude-call-1', content: 'file contents' },
        ],
      },
    },
    {
      type: 'assistant',
      uuid: 'claude-a2',
      sessionId: headerId,
      timestamp: iso(3000),
      message: { role: 'assistant', content: [{ type: 'text', text: 'The file holds one line.' }] },
    },
  ]);

  return { root: claudeRoot, filePath, options: { claudeRoot, transcriptPath: filePath } };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CODEX
// ─────────────────────────────────────────────────────────────────────────────

export function codexSession({ root, sessionId = SESSION, headerId = sessionId, fileName, projectDir = '/fixture/project' } = {}) {
  const codexRoot = join(root, 'codex', 'sessions');
  const filePath = join(codexRoot, '2026', '11', '07', fileName ?? `rollout-2026-11-07T12-00-00-${sessionId}.jsonl`);

  writeJsonl(filePath, [
    { timestamp: iso(0), type: 'session_meta', payload: { id: headerId, session_id: headerId, cwd: projectDir } },
    {
      timestamp: iso(1000),
      type: 'response_item',
      payload: { type: 'message', id: 'codex-u1', role: 'user', content: [{ type: 'input_text', text: 'Read the file.' }] },
    },
    {
      timestamp: iso(2000),
      type: 'response_item',
      payload: { type: 'function_call', call_id: 'codex-call-1', name: 'shell', arguments: '{"command":"cat file.txt"}' },
    },
    {
      timestamp: iso(3000),
      type: 'response_item',
      payload: { type: 'function_call_output', call_id: 'codex-call-1', output: 'file contents' },
    },
    {
      timestamp: iso(4000),
      type: 'response_item',
      payload: { type: 'message', id: 'codex-a1', role: 'assistant', content: [{ type: 'output_text', text: 'The file holds one line.' }] },
    },
  ]);

  return { root: codexRoot, filePath, options: { codexRoot, transcriptPath: filePath } };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PI
// ─────────────────────────────────────────────────────────────────────────────

export function piSession({ root, projectDir, sessionId = SESSION, headerId = sessionId, headerCwd = projectDir, fileNameId = sessionId, createdAt = T0 } = {}) {
  const piRoot = join(root, 'pi', 'sessions');
  const filePath = join(piRoot, piProjectDirectory(projectDir), `${createdAt}_${fileNameId}.jsonl`);

  writeJsonl(filePath, [
    { type: 'session', version: 3, id: headerId, timestamp: iso(0), cwd: headerCwd },
    {
      type: 'message',
      id: 'pi-u1',
      timestamp: iso(1000),
      message: { role: 'user', content: [{ type: 'text', text: 'Read the file.' }] },
    },
    {
      type: 'message',
      id: 'pi-a1',
      timestamp: iso(2000),
      message: {
        role: 'assistant',
        content: [
          { type: 'text', text: 'Reading it now.' },
          { type: 'toolCall', id: 'pi-call-1', name: 'read', arguments: { path: 'file.txt' } },
        ],
      },
    },
    {
      type: 'message',
      id: 'pi-r1',
      timestamp: iso(3000),
      message: { role: 'toolResult', toolCallId: 'pi-call-1', isError: false, content: [{ type: 'text', text: 'file contents' }] },
    },
    {
      type: 'message',
      id: 'pi-a2',
      timestamp: iso(4000),
      message: { role: 'assistant', content: [{ type: 'text', text: 'The file holds one line.' }] },
    },
  ]);

  return { root: piRoot, filePath, options: { piRoot, projectDir } };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. OPENCODE
// ─────────────────────────────────────────────────────────────────────────────

export function opencodeSession({ root, projectDir = '/fixture/project', sessionId = SESSION, withSession = true, withPart = true, withUserTextPart = false } = {}) {
  const opencodeRoot = join(root, 'opencode');
  const dbPath = join(opencodeRoot, 'opencode.db');
  mkdirSync(opencodeRoot, { recursive: true });

  const database = new DatabaseSync(dbPath);
  try {
    database.exec('CREATE TABLE session_v2 (id TEXT, directory TEXT, time_updated INTEGER)');
    database.exec('CREATE TABLE part (id TEXT, message_id TEXT, session_id TEXT, time_created INTEGER, data TEXT)');
    database.exec('CREATE TABLE session_message (id TEXT, session_id TEXT, type TEXT, seq INTEGER, data TEXT)');

    if (withSession) {
      database
        .prepare('INSERT INTO session_v2 (id, directory, time_updated) VALUES (?, ?, ?)')
        .run(sessionId, projectDir, T0 + 5000);
    }

    database
      .prepare('INSERT INTO session_message (id, session_id, type, seq, data) VALUES (?, ?, ?, ?, ?)')
      .run('oc-u1', sessionId, 'user', 1, JSON.stringify({ text: 'Read the file.', time: { created: T0 + 1000 } }));

    database
      .prepare('INSERT INTO session_message (id, session_id, type, seq, data) VALUES (?, ?, ?, ?, ?)')
      .run('oc-a1', sessionId, 'assistant', 2, JSON.stringify({
        time: { created: T0 + 2000 },
        content: [{ type: 'text', text: 'The file holds one line.' }],
      }));

    if (withUserTextPart) {
      database
        .prepare('INSERT INTO part (id, message_id, session_id, time_created, data) VALUES (?, ?, ?, ?, ?)')
        .run('oc-p0', 'oc-u1', sessionId, T0 + 500, JSON.stringify({
          id: 'oc-p0',
          type: 'text',
          text: 'Read the file.',
        }));
    }

    if (withPart) {
      database
        .prepare('INSERT INTO part (id, message_id, session_id, time_created, data) VALUES (?, ?, ?, ?, ?)')
        .run('oc-p1', 'oc-a1', sessionId, T0 + 3000, JSON.stringify({
          id: 'oc-p1',
          type: 'tool',
          callID: 'oc-call-1',
          tool: 'read',
          state: { status: 'completed', input: { path: 'file.txt' }, output: 'file contents' },
        }));
    }
  } finally {
    database.close();
  }

  return { root: opencodeRoot, dbPath, options: { opencodeRoot, dbPath } };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DEVIN
// ─────────────────────────────────────────────────────────────────────────────

export function devinSession({
  root,
  projectDir,
  sessionId = SESSION,
  transcriptId = sessionId,
  rowId = sessionId,
  workingDirectory = projectDir,
  withSessionsRow = true,
  compacted = false,
} = {}) {
  const dataDir = join(root, 'devin', 'cli');
  const filePath = join(dataDir, 'transcripts', `${sessionId}.json`);

  writeJson(filePath, {
    schema_version: 'ATIF-v1.7',
    session_id: transcriptId,
    steps: [
      { step_id: 1, timestamp: iso(0), source: 'user', message: 'Read the file.' },
      {
        step_id: 2,
        timestamp: iso(1000),
        source: 'agent',
        message: '',
        tool_calls: [{ tool_call_id: 'devin-call-1', function_name: 'read_file', arguments: { path: 'file.txt' } }],
        observation: { results: [{ source_call_id: 'devin-call-1', content: 'file contents' }] },
      },
      { step_id: 3, timestamp: iso(2000), source: 'agent', message: 'The file holds one line.' },
    ],
  });

  mkdirSync(dataDir, { recursive: true });
  const dbPath = join(dataDir, 'sessions.db');
  const database = new DatabaseSync(dbPath);
  try {
    database.exec('CREATE TABLE sessions (id TEXT PRIMARY KEY, working_directory TEXT NOT NULL, main_chain_id INTEGER)');
    database.exec(`
      CREATE TABLE message_nodes (
        row_id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        node_id INTEGER NOT NULL,
        parent_node_id INTEGER,
        chat_message TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        metadata TEXT,
        UNIQUE(session_id, node_id)
      )
    `);

    const nodes = [
      {
        nodeId: 0,
        parentId: null,
        message: { message_id: 'devin-user-1', role: 'user', content: 'Read the file.', metadata: { is_user_input: true, created_at: iso(0) } },
        createdAt: Math.floor(T0 / 1000),
      },
      {
        nodeId: 1,
        parentId: 0,
        message: {
          message_id: 'devin-assistant-1',
          role: 'assistant',
          content: '',
          tool_calls: [{ id: 'devin-call-1', name: 'read_file', arguments: { path: 'file.txt' }, index: 0, kind: 'function' }],
          metadata: { created_at: iso(1000) },
        },
        createdAt: Math.floor((T0 + 1000) / 1000),
      },
      {
        nodeId: 2,
        parentId: 1,
        message: { message_id: 'devin-tool-1', role: 'tool', content: 'file contents', tool_call_id: 'devin-call-1', metadata: { created_at: iso(1500) } },
        createdAt: Math.floor((T0 + 1500) / 1000),
      },
      {
        nodeId: 3,
        parentId: 2,
        message: { message_id: 'devin-assistant-2', role: 'assistant', content: 'The file holds one line.', metadata: { created_at: iso(2000) } },
        createdAt: Math.floor((T0 + 2000) / 1000),
      },
    ];

    // A compaction starts a new thread with no parent; its continuation node
    // names the last node of the thread it summarized.
    if (compacted) {
      nodes.push(
        {
          nodeId: 4,
          parentId: null,
          message: { message_id: 'devin-continue-1', role: 'system', content: 'You are continuing work from a previous conversation thread.' },
          metadata: { summarized_from: 3 },
          createdAt: Math.floor((T0 + 3000) / 1000),
        },
        {
          nodeId: 5,
          parentId: 4,
          message: { message_id: 'devin-user-2', role: 'user', content: 'Where were we?', metadata: { is_user_input: true, created_at: iso(4000) } },
          createdAt: Math.floor((T0 + 4000) / 1000),
        },
      );
    }

    if (withSessionsRow) {
      database
        .prepare('INSERT INTO sessions (id, working_directory, main_chain_id) VALUES (?, ?, ?)')
        .run(rowId, workingDirectory, nodes[nodes.length - 1].nodeId);

      const insert = database.prepare(
        'INSERT INTO message_nodes (session_id, node_id, parent_node_id, chat_message, created_at, metadata) VALUES (?, ?, ?, ?, ?, ?)',
      );
      for (const node of nodes) {
        insert.run(
          rowId,
          node.nodeId,
          node.parentId,
          JSON.stringify(node.message),
          node.createdAt,
          node.metadata ? JSON.stringify(node.metadata) : null,
        );
      }
    }
  } finally {
    database.close();
  }

  return { root: dataDir, filePath, dbPath, options: { devinDataHome: dataDir, projectDir } };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DSH
// ─────────────────────────────────────────────────────────────────────────────

export function dshSession({ root, projectDir, sessionId = SESSION, headerId = sessionId, headerCwd = projectDir, directoryName = sessionId } = {}) {
  const dshRoot = join(root, 'dsh', 'sessions');
  const filePath = join(dshRoot, dshProjectKey(projectDir), directoryName, 'session.v1.jsonl');

  writeJsonl(filePath, [
    { type: 'session', version: 4, id: headerId, timestamp: iso(0), cwd: headerCwd },
    {
      type: 'user/message',
      seq: 1,
      data: { role: 'user', id: 'dsh-u1', source: { kind: 'user' }, content: [{ type: 'text', text: 'Read the file.' }] },
    },
    {
      type: 'assistant/message',
      seq: 2,
      data: {
        turn: 1,
        step: 1,
        message: {
          role: 'assistant',
          id: 'dsh-a1',
          content: [{ type: 'tool-call', id: 'dsh-call-1', name: 'read', arguments: '{"path":"file.txt"}' }],
        },
      },
    },
    {
      type: 'tool/result',
      seq: 3,
      data: { turn: 1, step: 1, message: { role: 'tool', toolCallId: 'dsh-call-1', isError: false, content: [{ type: 'text', text: 'file contents' }] } },
    },
    {
      type: 'assistant/message',
      seq: 4,
      data: { turn: 1, step: 2, message: { role: 'assistant', id: 'dsh-a2', content: [{ type: 'text', text: 'The file holds one line.' }] } },
    },
  ]);

  return { root: dshRoot, filePath, options: { dshRoot, projectDir } };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ALL SEVEN PRESENT STORES
// ─────────────────────────────────────────────────────────────────────────────

export function presentStores({ root, projectDir }) {
  const claude = claudeSession({ root });
  const codex = codexSession({ root });
  const pi = piSession({ root, projectDir });
  const opencode = opencodeSession({ root, projectDir });
  const devin = devinSession({ root, projectDir });
  const dsh = dshSession({ root, projectDir });

  return {
    claude,
    codex,
    pi,
    opencode,
    devin,
    dsh,
    storePaths: [claude.filePath, codex.filePath, pi.filePath, opencode.dbPath, devin.filePath, devin.dbPath, dsh.filePath],
  };
}
