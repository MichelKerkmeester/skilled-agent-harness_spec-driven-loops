// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode SQLite Decision Sweep Tests
// ───────────────────────────────────────────────────────────────────
// The redacted fixture is a real set of question parts, so the sweep is exercised
// against what OpenCode actually stores rather than a shape invented for the test.
// Every test writes its queue into a throwaway project directory. Two tests spawn
// the CLI: one proves the XDG database lookup for the current working directory,
// the other proves a missing database fails with JSON on stdout.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { queueFile, toolSourceKey } from '../lib/capture-core.mjs';
import {
  latestOpenCodeSession,
  openCodeAnswerRecords,
  sweepOpenCodeSession,
} from './sweep-opencode.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, 'sweep-opencode.mjs');
const FIXTURE = join(HERE, 'fixtures', 'opencode-question-parts.json');
const MESSAGE_FIXTURE = join(HERE, 'fixtures', 'opencode-session-message.json');
const SESSION = 'ses_REDACTED0001';
const NOW = '2026-11-01T12:00:00.000Z';

const LINK_ANSWER = 'check the link i sent you';
const FOLDERS_ANSWER = 'All folders within opencode';
const TOML_ANSWER = 'Create wrapper TOML files';
const NEXT_STEP_ANSWER = 'A) Missing User Guides, B) Fix Critical Bugs';

function withTemp(run) {
  const root = mkdtempSync(join(tmpdir(), 'opencode-sweep-'));
  try {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    return run({ root, projectDir });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function readFixture() {
  return JSON.parse(readFileSync(FIXTURE, 'utf8'));
}

function writePartDatabase(dbPath, parts) {
  mkdirSync(dirname(dbPath), { recursive: true });
  const database = new DatabaseSync(dbPath);
  try {
    database.exec(
      'CREATE TABLE part (id TEXT, message_id TEXT, session_id TEXT, time_created INTEGER, time_updated INTEGER, data TEXT)',
    );
    const insert = database.prepare(
      'INSERT INTO part (id, message_id, session_id, time_created, time_updated, data) VALUES (?, ?, ?, ?, ?, ?)',
    );
    parts.forEach((part, index) => {
      insert.run(part.id, part.messageID, part.sessionID, index, index, JSON.stringify(part));
    });
  } finally {
    database.close();
  }
}

test('the fixture yields its four answered decisions and nothing else', () => {
  const records = openCodeAnswerRecords({
    parts: readFixture(),
    sessionId: SESSION,
    now: NOW,
  });

  assert.equal(records.length, 4);
  assert.deepEqual(
    records.map((record) => ({ key: record.key, answer: record.answer })),
    [
      {
        key: toolSourceKey('opencode', SESSION, 'call_REDACTED0001', 0),
        answer: LINK_ANSWER,
      },
      {
        key: toolSourceKey('opencode', SESSION, 'call_REDACTED0001', 1),
        answer: FOLDERS_ANSWER,
      },
      {
        key: toolSourceKey('opencode', SESSION, 'call_REDACTED0001', 2),
        answer: TOML_ANSWER,
      },
      {
        key: toolSourceKey('opencode', SESSION, 'call_REDACTED0002', 0),
        answer: NEXT_STEP_ANSWER,
      },
    ],
  );

  assert.ok(records.every((record) => record.runtime === 'opencode'));
  assert.ok(records.every((record) => record.source === 'transcript'));
  assert.ok(
    records.every(
      (record) => record.tool_use_id !== 'call_REDACTED0003'
        && record.tool_use_id !== 'call_REDACTED0004',
    ),
  );
});

test('a part database recovers its answered decisions once', () => {
  withTemp(({ root, projectDir }) => {
    const dbPath = join(root, 'opencode', 'opencode.db');
    const parts = readFixture();
    const otherSessionPart = {
      ...parts[0],
      id: 'prt_OTHER0001',
      sessionID: 'ses_OTHER0001',
      callID: 'call_OTHER0001',
    };
    writePartDatabase(dbPath, [...parts, otherSessionPart]);

    const first = sweepOpenCodeSession({ projectDir, dbPath, sessionId: SESSION, now: NOW });
    assert.equal(first.transcript, dbPath);
    assert.equal(first.session_id, SESSION);
    assert.equal(first.recovered, 4);
    assert.equal(first.pending.length, 4);
    assert.deepEqual(first.chat_candidates, []);

    const second = sweepOpenCodeSession({ projectDir, dbPath, sessionId: SESSION, now: NOW });
    assert.equal(second.recovered, 0);
    assert.equal(second.pending.length, 4);
    assert.equal(
      readFileSync(queueFile(projectDir, SESSION), 'utf8').trim().split('\n').length,
      4,
    );
  });
});

test('the message layout recovers a question stored as a content item', () => {
  withTemp(({ root, projectDir }) => {
    const dbPath = join(root, 'opencode', 'opencode.db');
    mkdirSync(dirname(dbPath), { recursive: true });

    const state = readFixture()[1].state;
    const database = new DatabaseSync(dbPath);
    try {
      database.exec(
        'CREATE TABLE session_message (id TEXT, session_id TEXT, type TEXT, seq INTEGER, time_created INTEGER, time_updated INTEGER, data TEXT)',
      );
      database
        .prepare(
          'INSERT INTO session_message (id, session_id, type, seq, time_created, time_updated, data) VALUES (?, ?, ?, ?, ?, ?, ?)',
        )
        .run(
          'msg_REDACTED0001',
          SESSION,
          'assistant',
          1,
          1,
          1,
          JSON.stringify({
            content: [
              { type: 'text', text: 'x' },
              {
                type: 'tool',
                id: 'call_REDACTED0002',
                name: 'question',
                state,
              },
            ],
          }),
        );
    } finally {
      database.close();
    }

    const result = sweepOpenCodeSession({ projectDir, dbPath, sessionId: SESSION, now: NOW });
    assert.equal(result.recovered, 1);
    assert.equal(result.pending.length, 1);
    assert.equal(result.pending[0].answer, NEXT_STEP_ANSWER);
    assert.equal(
      result.pending[0].key,
      toolSourceKey('opencode', SESSION, 'call_REDACTED0002', 0),
    );
  });
});

test('real session_message rows queue the answered call and ignore the dismissed call', () => {
  withTemp(({ root, projectDir }) => {
    const dbPath = join(root, 'opencode', 'opencode.db');
    mkdirSync(dirname(dbPath), { recursive: true });
    const { rows } = JSON.parse(readFileSync(MESSAGE_FIXTURE, 'utf8'));

    const database = new DatabaseSync(dbPath);
    try {
      database.exec(
        'CREATE TABLE session_message (id TEXT, session_id TEXT, type TEXT, seq INTEGER, time_created INTEGER, time_updated INTEGER, data TEXT)',
      );
      const insert = database.prepare(
        'INSERT INTO session_message (id, session_id, type, seq, time_created, time_updated, data) VALUES (?, ?, ?, ?, ?, ?, ?)',
      );
      rows.forEach((row, index) => {
        insert.run(
          `msg_fixture_${index + 1}`,
          row.session_id,
          row.type,
          row.seq,
          row.seq,
          row.seq,
          JSON.stringify(row.data),
        );
      });
    } finally {
      database.close();
    }

    const result = sweepOpenCodeSession({
      projectDir,
      dbPath,
      sessionId: 'ses_fixture',
      now: NOW,
    });
    assert.equal(result.recovered, 1);
    assert.deepEqual(
      result.pending.map(({ answer, question, key }) => ({ answer, question, key })),
      [{
        answer: 'pear',
        question: 'Which fruit should I name in my reply?',
        key: 'opencode:ses_fixture:call_fixture_1:0',
      }],
    );
  });
});

test('the newest session for the directory wins across both session tables', () => {
  withTemp(({ root, projectDir }) => {
    const dbPath = join(root, 'opencode', 'opencode.db');
    mkdirSync(dirname(dbPath), { recursive: true });

    const database = new DatabaseSync(dbPath);
    try {
      database.exec('CREATE TABLE session (id TEXT, directory TEXT, time_updated INTEGER)');
      database.exec('CREATE TABLE session_v2 (id TEXT, directory TEXT, time_updated INTEGER)');

      database
        .prepare('INSERT INTO session (id, directory, time_updated) VALUES (?, ?, ?)')
        .run('ses_LEGACY0001', projectDir, 4000);

      const insert = database.prepare(
        'INSERT INTO session_v2 (id, directory, time_updated) VALUES (?, ?, ?)',
      );
      insert.run(SESSION, projectDir, 3000);
      insert.run('ses_ELSEWHERE0001', join(projectDir, 'elsewhere'), 9000);
    } finally {
      database.close();
    }

    assert.equal(latestOpenCodeSession({ dbPath, projectDir }), 'ses_LEGACY0001');
  });
});

test('the CLI resolves the newest session under the XDG data home', () => {
  withTemp(({ root, projectDir }) => {
    const dbPath = join(root, 'opencode', 'opencode.db');
    mkdirSync(dirname(dbPath), { recursive: true });
    writePartDatabase(dbPath, readFixture());

    const database = new DatabaseSync(dbPath);
    try {
      database.exec('CREATE TABLE session_v2 (id TEXT, directory TEXT, time_updated INTEGER)');
      database
        .prepare('INSERT INTO session_v2 (id, directory, time_updated) VALUES (?, ?, ?)')
        .run(SESSION, realpathSync(projectDir), 1000);
    } finally {
      database.close();
    }

    const run = spawnSync(process.execPath, [SCRIPT], {
      cwd: projectDir,
      encoding: 'utf8',
      env: { ...process.env, XDG_DATA_HOME: root },
      timeout: 20000,
    });

    assert.equal(run.status, 0);
    const result = JSON.parse(run.stdout);
    assert.equal(result.session_id, SESSION);
    assert.equal(result.recovered, 4);
  });
});

test('the CLI reports a missing database as JSON and fails', () => {
  withTemp(({ root, projectDir }) => {
    const run = spawnSync(
      process.execPath,
      [SCRIPT, '--db', join(root, 'missing', 'opencode.db'), '--session', SESSION],
      {
        cwd: projectDir,
        encoding: 'utf8',
        timeout: 20000,
      },
    );

    assert.equal(run.status, 1);
    const result = JSON.parse(run.stdout);
    assert.equal(typeof result.error, 'string');
    assert.ok(result.error.length > 0);
  });
});

function chatFixtureRows() {
  const fixturePath = join(HERE, 'fixtures', 'opencode-chat-session.json');
  return JSON.parse(readFileSync(fixturePath, 'utf8')).rows;
}

function writeSessionMessageDatabase(dbPath, rows, sequenceOverrides = new Map()) {
  mkdirSync(dirname(dbPath), { recursive: true });
  const database = new DatabaseSync(dbPath);
  try {
    database.exec(
      'CREATE TABLE session_message (id TEXT, session_id TEXT, type TEXT, seq INTEGER, '
        + 'time_created INTEGER, time_updated INTEGER, data TEXT)',
    );
    const insert = database.prepare(
      'INSERT INTO session_message (id, session_id, type, seq, time_created, time_updated, '
        + 'data) VALUES (?, ?, ?, ?, ?, ?, ?)',
    );
    rows.forEach((row) => {
      const sequence = sequenceOverrides.get(row.id) ?? row.seq;
      insert.run(
        row.id,
        row.session_id,
        row.type,
        sequence,
        sequence,
        sequence,
        JSON.stringify(row.data),
      );
    });
  } finally {
    database.close();
  }
}

function fixtureRow(rows, predicate) {
  const row = rows.find(predicate);
  assert.ok(row, 'expected row is present in the chat fixture');
  return row;
}

test('real session_message rows offer the answered plain chat question', () => {
  withTemp(({ root, projectDir }) => {
    const rows = chatFixtureRows();
    const sessionId = rows[0].session_id;
    const dbPath = join(root, 'opencode', 'opencode.db');
    writeSessionMessageDatabase(dbPath, rows);

    const result = sweepOpenCodeSession({ projectDir, dbPath, sessionId, now: NOW });

    assert.equal(result.chat_candidates.length, 1);
    assert.ok(result.chat_candidates[0].key.startsWith('opencode:'));
    assert.equal(result.chat_candidates[0].answer, 'No, keep it static.');
  });
});

test('a tool row between a question and prompt clears the chat candidate', () => {
  withTemp(({ root, projectDir }) => {
    const rows = chatFixtureRows();
    const question = fixtureRow(
      rows,
      (row) => row.type === 'assistant'
        && row.data.content?.some((item) => item.type === 'text' && item.text.endsWith('Should the badge blink?')),
    );
    const tool = fixtureRow(
      rows,
      (row) => row.type === 'assistant'
        && row.data.content?.some((item) => item.type === 'tool'),
    );
    const prompt = fixtureRow(
      rows,
      (row) => row.type === 'user' && row.data.text === 'No, keep it static.',
    );
    const orderedRows = [question, tool, prompt];
    const sequenceOverrides = new Map([
      [question.id, 1],
      [tool.id, 2],
      [prompt.id, 3],
    ]);
    const dbPath = join(root, 'opencode', 'opencode.db');
    writeSessionMessageDatabase(dbPath, orderedRows, sequenceOverrides);

    const result = sweepOpenCodeSession({
      projectDir,
      dbPath,
      sessionId: rows[0].session_id,
      now: NOW,
    });

    assert.deepEqual(result.chat_candidates, []);
  });
});

test('a synthetic row does not answer a chat question', () => {
  withTemp(({ root, projectDir }) => {
    const rows = chatFixtureRows();
    const question = fixtureRow(
      rows,
      (row) => row.type === 'assistant'
        && row.data.content?.some((item) => item.type === 'text' && item.text.endsWith('Should the badge blink?')),
    );
    const synthetic = fixtureRow(rows, (row) => row.type === 'synthetic');
    const prompt = fixtureRow(
      rows,
      (row) => row.type === 'user' && row.data.text === 'No, keep it static.',
    );
    const orderedRows = [question, synthetic, prompt];
    const sequenceOverrides = new Map([
      [question.id, 1],
      [synthetic.id, 2],
      [prompt.id, 3],
    ]);
    const dbPath = join(root, 'opencode', 'opencode.db');
    writeSessionMessageDatabase(dbPath, orderedRows, sequenceOverrides);

    const result = sweepOpenCodeSession({
      projectDir,
      dbPath,
      sessionId: rows[0].session_id,
      now: NOW,
    });

    assert.equal(result.chat_candidates.length, 1);
    assert.equal(result.chat_candidates[0].answer, 'No, keep it static.');
  });
});
