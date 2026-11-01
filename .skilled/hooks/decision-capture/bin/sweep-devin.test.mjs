// ───────────────────────────────────────────────────────────────────
// MODULE: Devin CLI Transcript Decision Sweep Tests
// ───────────────────────────────────────────────────────────────────
// The redacted fixture is a real transcript shape, so the sweep is exercised
// against what Devin actually writes rather than a shape invented for the test.
// Every test writes its queue into a throwaway project directory. Two tests spawn
// the CLI: one proves the explicit transcript argument, the other proves the
// SQLite lookup for the current working directory.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { queueFile, readQueue, toolSourceKey } from '../lib/capture-core.mjs';
import { sweepDevinTranscript } from './sweep-devin.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, 'sweep-devin.mjs');
const FIXTURE = join(HERE, 'fixtures', 'devin-transcript.json');
const SESSION = 'redacted-devin-session';
const NOW = '2026-11-01T12:00:00.000Z';

const CACHE_TAX_QUESTION =
  'How should cache-tax be installed at both levels (repo .claude/ and ~/.claude/)?';
const DRIFT_QUESTION =
  'Which category of drift/fixes from the audit would you like to work on first?';

function withProject(run) {
  const projectDir = mkdtempSync(join(tmpdir(), 'devin-sweep-'));
  try {
    return run(projectDir);
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
}

function readFixture() {
  return JSON.parse(readFileSync(FIXTURE, 'utf8'));
}

test('the fixture yields its two answered decisions and nothing else', () => {
  withProject((projectDir) => {
    const result = sweepDevinTranscript({ projectDir, transcriptPath: FIXTURE, now: NOW });

    assert.equal(result.transcript, FIXTURE);
    assert.equal(result.session_id, SESSION);
    assert.equal(result.recovered, 2);
    assert.equal(result.pending.length, 2);
    assert.deepEqual(result.chat_candidates, []);

    const records = readQueue(projectDir, SESSION);
    assert.equal(records.length, 2);
    assert.deepEqual(
      records.map((record) => record.key),
      [
        toolSourceKey('devin', SESSION, 'call_REDACTED0001', 1),
        toolSourceKey('devin', SESSION, 'call_REDACTED0002', 0),
      ],
    );

    const [cacheTax, drift] = records;
    assert.equal(cacheTax.question, CACHE_TAX_QUESTION);
    assert.equal(cacheTax.answer, 'Marketplace in settings');
    assert.equal(cacheTax.source, 'transcript');
    assert.equal(drift.question, DRIFT_QUESTION);
    assert.equal(drift.answer, 'all 4, use subagents');
    assert.deepEqual(drift.options, [
      'Fix broken configs & paths',
      'Commit orca & sync Hermes',
      'Fix SYNC & doc drift',
      'Cleanup packet & residue',
    ]);

    assert.ok(records.every((record) => !record.question.includes('Spec folder')));
    assert.ok(records.every((record) => record.tool_use_id !== 'call_REDACTED0003'));
  });
});

test('a second sweep appends nothing and leaves the queue intact', () => {
  withProject((projectDir) => {
    sweepDevinTranscript({ projectDir, transcriptPath: FIXTURE, now: NOW });

    const second = sweepDevinTranscript({ projectDir, transcriptPath: FIXTURE, now: NOW });
    assert.equal(second.recovered, 0);
    assert.equal(second.pending.length, 2);
    assert.equal(readQueue(projectDir, SESSION).length, 2);
    assert.equal(
      readFileSync(queueFile(projectDir, SESSION), 'utf8').trim().split('\n').length,
      2,
    );
  });
});

test('a skipped answer is dropped and the typed answer still lands', () => {
  withProject((projectDir) => {
    const transcript = readFixture();
    const step = transcript.steps.find((entry) =>
      entry.observation?.results?.some(
        (item) => item.source_call_id === 'call_REDACTED0001',
      ),
    );
    const result = step.observation.results.find(
      (item) => item.source_call_id === 'call_REDACTED0001',
    );

    const answers = JSON.parse(result.content.slice(result.content.indexOf('\n') + 1));
    answers[CACHE_TAX_QUESTION].skipped = true;
    result.content = `User answered your questions:\n${JSON.stringify(answers)}`;

    const transcriptPath = join(projectDir, 'skipped.json');
    writeFileSync(transcriptPath, JSON.stringify(transcript));

    const sweep = sweepDevinTranscript({ projectDir, transcriptPath, now: NOW });
    assert.equal(sweep.recovered, 1);
    assert.deepEqual(
      sweep.pending.map((record) => record.answer),
      ['all 4, use subagents'],
    );
    assert.equal(sweep.pending[0].key, toolSourceKey('devin', SESSION, 'call_REDACTED0002', 0));
  });
});

test('the CLI prints the sweep result for the given transcript', () => {
  withProject((projectDir) => {
    const run = spawnSync(process.execPath, [SCRIPT, '--transcript', FIXTURE], {
      cwd: projectDir,
      encoding: 'utf8',
      timeout: 20000,
    });

    assert.equal(run.status, 0);
    const result = JSON.parse(run.stdout);
    assert.equal(result.recovered, 2);
    assert.equal(result.session_id, SESSION);
    assert.equal(result.pending.length, 2);
  });
});

test('the CLI resolves the newest session for the working directory', () => {
  withProject((projectDir) => {
    const dataHome = mkdtempSync(join(tmpdir(), 'devin-data-'));
    try {
      const cliDir = join(dataHome, 'devin', 'cli');
      mkdirSync(join(cliDir, 'transcripts'), { recursive: true });

      const database = new DatabaseSync(join(cliDir, 'sessions.db'));
      try {
        database.exec(
          'CREATE TABLE sessions (id TEXT, working_directory TEXT, last_activity_at INTEGER)',
        );
        const insert = database.prepare(
          'INSERT INTO sessions (id, working_directory, last_activity_at) VALUES (?, ?, ?)',
        );
        insert.run('other-session', join(projectDir, 'elsewhere'), 2000);
        insert.run(SESSION, realpathSync(projectDir), 1000);
      } finally {
        database.close();
      }

      copyFileSync(FIXTURE, join(cliDir, 'transcripts', `${SESSION}.json`));

      const run = spawnSync(process.execPath, [SCRIPT], {
        cwd: projectDir,
        encoding: 'utf8',
        env: { ...process.env, XDG_DATA_HOME: dataHome },
        timeout: 20000,
      });

      assert.equal(run.status, 0);
      const result = JSON.parse(run.stdout);
      assert.equal(result.session_id, SESSION);
      assert.equal(result.recovered, 2);
    } finally {
      rmSync(dataHome, { recursive: true, force: true });
    }
  });
});
