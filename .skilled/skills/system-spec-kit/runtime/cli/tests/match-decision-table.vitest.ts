// ───────────────────────────────────────────────────────────────────
// MODULE: Match Decision Table CLI Tests
// ───────────────────────────────────────────────────────────────────
// The command is exercised through its exported entry point against a temporary
// project, so each case can inspect the state files a run leaves behind without a
// subprocess or the real repository state.

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { main } from '../continuity/match-decision-table.js';

const FIXTURE_PATH = fileURLToPath(
  new URL('../test-fixtures/decision-table/hand-written-record.md', import.meta.url),
);
const RECORD_RELATIVE_DIR = 'specs/demo/001-fixture';
const RECORD_FILENAME = 'decision-record.md';

const createdRoots = new Set<string>();

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

interface QueueRow {
  key: string;
  header: string;
  question: string;
  options: string[];
  answer: string;
  captured_at: string;
}

interface Project {
  root: string;
  recordPath: string;
  consumedPath: string;
}

// Rows copied from the fixture table, so each answer has exactly one row it can
// hold and one answer deliberately absent from the table.
const DRAFT_ROW: QueueRow = {
  key: 'claude:alpha:toolu_1:0',
  header: 'Draft retention',
  question: 'How should the autosaved draft behave after a short pause?',
  options: ['Keep draft', 'Discard draft'],
  answer: 'Keep draft',
  captured_at: '2026-11-01T09:15:00.000Z',
};

const CACHE_ROW: QueueRow = {
  key: 'claude:alpha:toolu_2:0',
  header: 'Cache refresh',
  question: 'How often should the local cache refresh?',
  options: ['Use local cache', 'Refresh daily'],
  answer: 'Refresh daily',
  captured_at: '2026-11-01T11:00:00.000Z',
};

const UNMATCHED_ROW: QueueRow = {
  key: 'claude:alpha:toolu_3:0',
  header: 'Banner typeface',
  question: 'Which typeface should the banner use?',
  options: ['Serif', 'Sans serif'],
  answer: 'Sans serif',
  captured_at: '2026-11-01T12:00:00.000Z',
};

const DIGEST_ROW: QueueRow = {
  key: 'claude:beta:toolu_9:0',
  header: 'Notification digest',
  question: 'When should the weekly digest arrive?',
  options: ['Monday morning', 'Friday afternoon'],
  answer: 'Monday morning',
  captured_at: '2026-11-01T08:00:00.000Z',
};

function sessionToken(sessionId: string): string {
  return Buffer.from(sessionId, 'utf8').toString('hex');
}

function stateDir(root: string): string {
  return path.join(root, '.skilled', 'skills', '.state', 'decision-capture');
}

function makeProject(): Project {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'decision-match-'));
  createdRoots.add(root);

  fs.mkdirSync(stateDir(root), { recursive: true });
  const recordDir = path.join(root, RECORD_RELATIVE_DIR);
  fs.mkdirSync(recordDir, { recursive: true });
  const recordPath = path.join(recordDir, RECORD_FILENAME);
  fs.copyFileSync(FIXTURE_PATH, recordPath);

  return { root, recordPath, consumedPath: path.join(stateDir(root), 'consumed.jsonl') };
}

function writeQueue(project: Project, sessionId: string, rows: QueueRow[]): void {
  const filePath = path.join(stateDir(project.root), `${sessionToken(sessionId)}.jsonl`);
  const lines = rows.map((row) => `${JSON.stringify({ ...row, session_id: sessionId })}`);
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function writeConsumed(project: Project, rows: Array<Record<string, unknown>>): void {
  fs.writeFileSync(
    project.consumedPath,
    rows.map((row) => `${JSON.stringify(row)}\n`).join(''),
    'utf8',
  );
}

function readConsumed(project: Project): Array<Record<string, unknown>> {
  const text = fs.existsSync(project.consumedPath)
    ? fs.readFileSync(project.consumedPath, 'utf8')
    : '';
  return text
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

function hashFile(filePath: string): string {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function runCli(argv: string[]): { code: number; stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];

  const outSpy = vi.spyOn(process.stdout, 'write').mockImplementation(((
    chunk: string | Uint8Array,
  ) => {
    stdout.push(String(chunk));
    return true;
  }) as unknown as typeof process.stdout.write);
  const errSpy = vi.spyOn(process.stderr, 'write').mockImplementation(((
    chunk: string | Uint8Array,
  ) => {
    stderr.push(String(chunk));
    return true;
  }) as unknown as typeof process.stderr.write);

  try {
    const code = main(argv);
    return { code, stdout: stdout.join(''), stderr: stderr.join('') };
  } finally {
    outSpy.mockRestore();
    errSpy.mockRestore();
  }
}

function matchArgs(project: Project, sessionId: string, apply = false): string[] {
  const args = [
    '--project-root',
    project.root,
    '--session',
    sessionId,
    '--record',
    path.join(RECORD_RELATIVE_DIR, RECORD_FILENAME),
  ];
  return apply ? [...args, '--apply'] : args;
}

describe('match-decision-table CLI', () => {
  it('prints the row for each queued answer and writes nothing without --apply', () => {
    const project = makeProject();
    writeQueue(project, 'session-alpha', [DRAFT_ROW, CACHE_ROW, UNMATCHED_ROW]);
    writeQueue(project, 'session-beta', [DIGEST_ROW]);
    const recordHashBefore = hashFile(project.recordPath);

    const result = runCli(matchArgs(project, 'session-alpha'));

    expect(result.code).toBe(0);
    expect(result.stdout.split('\n').filter((line) => line !== '')).toEqual([
      '1 Q001 1.00',
      '2 Q003 1.00',
      '3 pending no row',
      'consumed 2, refused 0, pending 1',
    ]);
    expect(fs.existsSync(project.consumedPath)).toBe(false);
    expect(hashFile(project.recordPath)).toBe(recordHashBefore);
  });

  it('appends the packet and row id for each match, and a second --apply adds none', () => {
    const project = makeProject();
    writeQueue(project, 'session-alpha', [DRAFT_ROW, CACHE_ROW, UNMATCHED_ROW]);
    const recordHashBefore = hashFile(project.recordPath);

    const first = runCli(matchArgs(project, 'session-alpha', true));

    expect(first.code).toBe(0);
    const rows = readConsumed(project);
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => [row.packet, row.id])).toEqual([
      [RECORD_RELATIVE_DIR, 'Q001'],
      [RECORD_RELATIVE_DIR, 'Q003'],
    ]);
    expect(rows.every((row) => typeof row.key === 'string' && row.key !== '')).toBe(true);

    const consumedAfterFirst = fs.readFileSync(project.consumedPath, 'utf8');
    const second = runCli(matchArgs(project, 'session-alpha', true));

    expect(second.code).toBe(0);
    expect(second.stdout.split('\n').filter((line) => line !== '')).toEqual([
      '3 pending no row',
      'consumed 0, refused 0, pending 1',
    ]);
    expect(fs.readFileSync(project.consumedPath, 'utf8')).toBe(consumedAfterFirst);
    expect(hashFile(project.recordPath)).toBe(recordHashBefore);
  });

  it('lists only the session queues that still have pending records', () => {
    const project = makeProject();
    writeQueue(project, 'session-alpha', [DRAFT_ROW]);
    writeQueue(project, 'session-beta', [DIGEST_ROW]);
    writeConsumed(project, [{ key: DIGEST_ROW.key, packet: RECORD_RELATIVE_DIR, id: 'Q006' }]);

    const result = runCli(['--project-root', project.root, '--scan-orphans']);

    expect(result.code).toBe(0);
    expect(result.stdout.trim()).toBe('1 session-alpha');
    expect(result.stdout).not.toContain('session-beta');
  });

  it('removes and prints the released consumed rows', () => {
    const project = makeProject();
    const released = { key: DRAFT_ROW.key, packet: RECORD_RELATIVE_DIR, id: 'Q001', at: '2026-11-01T10:00:00.000Z' };
    const kept = { key: CACHE_ROW.key, packet: RECORD_RELATIVE_DIR, id: 'Q003', at: '2026-11-01T10:00:00.000Z' };
    writeConsumed(project, [released, kept]);

    const result = runCli(['--project-root', project.root, '--release', released.key]);

    expect(result.code).toBe(0);
    expect(JSON.parse(result.stdout.trim())).toEqual(released);
    expect(readConsumed(project)).toEqual([kept]);
  });

  it('exits 2 with the usage when a required flag is missing', () => {
    const project = makeProject();

    const result = runCli(['--project-root', project.root, '--session', 'session-alpha']);

    expect(result.code).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('Usage:');
  });

  it('exits 2 when the record path does not exist', () => {
    const project = makeProject();
    writeQueue(project, 'session-alpha', [DRAFT_ROW]);

    const result = runCli(['--project-root', project.root, '--session', 'session-alpha', '--record', 'missing.md', '--apply']);

    expect(result.code).toBe(2);
    expect(result.stderr).toContain('No decision record at');
    expect(fs.existsSync(project.consumedPath)).toBe(false);
  });

  it('leaves answers pending and exits 0 when no table in the record can be read', () => {
    // A record without a hand-written table is normal for a packet whose record
    // holds only ADRs, and the save step runs the matcher on every record, so
    // this must not fail: the answers simply stay pending for the save.
    const project = makeProject();
    writeQueue(project, 'session-alpha', [DRAFT_ROW]);
    const records = {
      'no-table.md': '# Decision Record\n\nOnly prose, no table.\n',
      'no-answer-column.md': '| ID | Topic | Question |\n|---|---|---|\n| Q001 | Draft retention | How should the autosaved draft behave after a short pause? |\n',
    };

    for (const [name, body] of Object.entries(records)) {
      fs.writeFileSync(path.join(project.root, name), body);
      const result = runCli(['--project-root', project.root, '--session', 'session-alpha', '--record', name, '--apply']);

      expect(result.code).toBe(0);
      expect(result.stdout).toContain('consumed 0, refused 0, pending 1');
      expect(fs.existsSync(project.consumedPath)).toBe(false);
    }
  });

  it('exits 2 in every mode when the project root is not a directory', () => {
    const project = makeProject();
    const fileRoot = path.join(project.root, 'not-a-folder');
    fs.writeFileSync(fileRoot, 'x');
    const missingRoot = path.join(project.root, 'missing');

    for (const root of [fileRoot, missingRoot]) {
      for (const argv of [
        ['--scan-orphans'],
        ['--release', DRAFT_ROW.key],
        ['--session', 'session-alpha', '--record', 'decision-record.md'],
      ]) {
        const result = runCli(['--project-root', root, ...argv]);
        expect(result.code).toBe(2);
        expect(result.stdout).toBe('');
        expect(result.stderr).toContain('is not a directory');
      }
    }
    expect(fs.existsSync(missingRoot)).toBe(false);
    expect(fs.readFileSync(fileRoot, 'utf8')).toBe('x');
  });
});
