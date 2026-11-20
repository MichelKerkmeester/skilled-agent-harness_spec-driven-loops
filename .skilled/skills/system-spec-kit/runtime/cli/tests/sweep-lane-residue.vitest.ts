// ───────────────────────────────────────────────────────────────────
// MODULE: Sweep Lane Residue Tests
// ───────────────────────────────────────────────────────────────────
// Coverage matrix, mode x state x terminal. The terminal axis applies only to
// apply mode's two ask-first items, the HuggingFace cache folder and the pulled
// Ollama model; every other cell runs without a terminal.
//
// | Mode    | Remnant present                                  | Remnant absent             | Allowlisted          |
// |---------|--------------------------------------------------|----------------------------|----------------------|
// | repo    | planted content, path word, symlink -> exit 1    | removed, empty repo -> 0   | exact path -> exit 0 |
// | machine | vec_768 table, dotenv key, a model server file   | clean fixtures, or a socket| (no allowlist)       |
// |         |   in any folder it could use -> exit 1          |   folder of user files -> 0|                      |
// | apply   | no terminal: owned leftovers deleted, ask-first  | clean fixtures -> exit 0,  | (no allowlist)       |
// |         |   items kept, no DELETE sent, exit 1            |   nothing deleted          |                      |
// |         | terminal, yes: cache folder deleted, DELETE sent |                            |                      |
// |         | terminal, no: both kept                          |                            |                      |
// |         | terminal closed (Ctrl+D): counts as no           |                            |                      |
//
// Exit 2: unknown flag, missing value, missing mode, malformed allowlist (bad
// JSON, no reason, folder row, glob row), git missing, a root below the work
// tree top in every mode, an unreadable database.
//
// Path safety in apply: a symlink that would carry a delete outside its root is
// refused; a directory sitting under a model server file name is kept; the
// socket folder loses only the files the model server writes and is kept while
// it holds anything else; a shared folder (IPC, explicit socket address,
// launcher-pinned) loses only those files and is never removed; nothing is
// touched while a model server may still use it (foreign server, or no
// readable process list); only node running this checkout's script is
// signalled, never another process naming that script.
//
// Isolation: machine and apply cases run in-process with fixture locations for
// HOME, HF_HOME, OLLAMA_HOST, OLLAMA_MODELS, SYSTEM_SKILL_ADVISOR_DB_DIR, the
// socket folder and the IPC folder, strip HF_HUB_CACHE and XDG_CACHE_HOME, and
// pass a fixture process list, so no case reads or changes real machine state.
// Only repo mode and argument errors spawn the CLI.

import { type ChildProcess, spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { PassThrough } from 'node:stream';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  attributeTerms,
  confirmOnTerminal,
  formatMachineSummary,
  loadAllowlist,
  resolveContainedTarget,
  runApply,
  runMachineChecks,
} from '../retrieval/sweep-lane-residue.mjs';

const SCRIPT_PATH = fileURLToPath(new URL('../retrieval/sweep-lane-residue.mjs', import.meta.url));

/** Nothing listens on the discard port, so a fetch there is refused at once. */
const CLOSED_OLLAMA_HOST = 'http://127.0.0.1:9';
const MODEL = 'nomic-embed-text:v1.5';
const HF_FOLDER = 'models--nomic-ai--nomic-embed-text-v1.5';
const SERVER_FILES = ['hf-embed.sock', 'hf-embed.pid', 'hf-embed-respawn.lock', 'hf-embed-giveup.json'];
/** No model server and no ollama process: the state the clean cases need. */
const NO_PROCESSES = { processes: [] };

/** Variables that would point a run at real machine state or another git index. */
const SCRUBBED_ENV = [
  'GIT_DIR',
  'GIT_INDEX_FILE',
  'GIT_WORK_TREE',
  'HF_HOME',
  'HF_HUB_CACHE',
  'OLLAMA_BASE_URL',
  'OLLAMA_HOST',
  'OLLAMA_MODELS',
  'SPECKIT_IPC_SOCKET_DIR',
  'SYSTEM_SKILL_ADVISOR_DB_DIR',
  'XDG_CACHE_HOME',
];

type RunResult = { status: number | null; stderr: string; stdout: string };
type Call = { body: string; method: string; url: string };
type Action = { action: string; reason?: string; target: string };
type Report = Record<string, any>;
type MachineFixture = {
  dbDir: string;
  env: NodeJS.ProcessEnv;
  hfHome: string;
  home: string;
  options: Record<string, string>;
  root: string;
  socketDir: string;
};

const tempRoots = new Set<string>();
const servers = new Set<http.Server>();
const children = new Set<ChildProcess>();

afterEach(async () => {
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
  }
  children.clear();
  for (const server of servers) {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
  servers.clear();
  for (const dir of tempRoots) fs.rmSync(dir, { force: true, recursive: true });
  tempRoots.clear();
});

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.add(dir);
  return dir;
}

function writeFile(root: string, relativePath: string, content: string): string {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content, 'utf8');
  return absolute;
}

function baseEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  for (const key of SCRUBBED_ENV) delete env[key];
  return env;
}

function git(root: string, ...args: string[]): string {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8', env: baseEnv() });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr}`);
  return result.stdout;
}

/**
 * A committed fixture repository. Hooks point at an empty folder so a global
 * hooks path never runs against the fixture.
 */
function makeRepo(files: Record<string, string> = {}): string {
  const root = makeTempDir('lane-residue-repo-');
  git(root, 'init', '-q');
  git(root, 'config', 'user.email', 'fixture@example.invalid');
  git(root, 'config', 'user.name', 'Fixture');
  git(root, 'config', 'commit.gpgsign', 'false');
  git(root, 'config', 'core.hooksPath', makeTempDir('lane-residue-hooks-'));
  for (const [relativePath, content] of Object.entries(files)) writeFile(root, relativePath, content);
  if (Object.keys(files).length > 0) commitAll(root);
  return root;
}

function commitAll(root: string): void {
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'fixture');
}

function writeAllowlist(entries: unknown[] | string): string {
  const allowlistPath = path.join(makeTempDir('lane-residue-allowlist-'), 'allowlist.json');
  fs.writeFileSync(allowlistPath, typeof entries === 'string' ? entries : JSON.stringify({ entries }), 'utf8');
  return allowlistPath;
}

function runCli(args: string[], env: NodeJS.ProcessEnv = baseEnv()): RunResult {
  const result = spawnSync(process.execPath, [SCRIPT_PATH, ...args], {
    encoding: 'utf8',
    env,
    input: '',
    maxBuffer: 64 * 1024 * 1024,
  });
  return { status: result.status, stderr: result.stderr, stdout: result.stdout };
}

/** A fake Ollama server that lists the given models and records every call. */
async function startFakeOllama(models: string[]): Promise<{ calls: Call[]; host: string }> {
  const calls: Call[] = [];
  const server = http.createServer((request, response) => {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      calls.push({ body, method: request.method ?? '', url: request.url ?? '' });
      if (request.method === 'GET' && request.url === '/api/tags') {
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ models: models.map((name) => ({ model: name, name })) }));
        return;
      }
      response.writeHead(request.method === 'DELETE' && request.url === '/api/delete' ? 200 : 404);
      response.end();
    });
  });
  servers.add(server);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  return { calls, host: `http://127.0.0.1:${(server.address() as AddressInfo).port}` };
}

function writeAdvisorDb(file: string, options: { lane: boolean }): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('CREATE TABLE skill_nodes (id TEXT PRIMARY KEY, family TEXT)');
  if (options.lane) db.exec('CREATE TABLE vec_768 (skill_id TEXT, vector BLOB)');
  db.close();
}

function makeMachineFixture(): MachineFixture {
  const root = makeRepo({ 'README.md': 'fixture checkout\n' });
  const home = makeTempDir('lane-residue-home-');
  const dbDir = path.join(home, 'advisor-db');
  const hfHome = path.join(home, 'hf');
  const socketDir = path.join(home, 'system-hf-embed');
  fs.mkdirSync(dbDir, { recursive: true });
  const env = {
    ...baseEnv(),
    HF_HOME: hfHome,
    HOME: home,
    OLLAMA_HOST: CLOSED_OLLAMA_HOST,
    OLLAMA_MODELS: path.join(home, 'ollama-models'),
  };
  // The database folder travels as an option, not as SYSTEM_SKILL_ADVISOR_DB_DIR:
  // that variable also makes the launcher's pinned model server folder a
  // candidate, which only the case about that folder sets on purpose.
  const options = { dbDir, hfHome, ollamaHost: CLOSED_OLLAMA_HOST, root, socketDir };
  return { dbDir, env, hfHome, home, options, root, socketDir };
}

function findingById(report: Report, id: string): Report {
  const entry = report.findings.find((candidate: { id: string }) => candidate.id === id);
  if (!entry) throw new Error(`no finding ${id}`);
  return entry;
}

function actionsOf(report: Report, kind: string): Action[] {
  return report.actions.filter((action: Action) => action.action === kind);
}

/** Apply without a terminal and with no running process: the default test run. */
function applyQuietly(fixture: MachineFixture, extra: Record<string, unknown> = {}, env = fixture.env): Promise<Report> {
  return runApply({ ...fixture.options, ...extra }, env, { interactive: false, ...NO_PROCESSES });
}

// ───────────────────────────────────────────────────────────────────
// Vocabulary and allowlist
// ───────────────────────────────────────────────────────────────────

describe('attributeTerms', () => {
  it('reports every term a text names, regardless of case', () => {
    expect(attributeTerms('Start OLLAMA, then the Embedder', 'identifier')).toEqual(['ollama', 'embedder']);
    expect(attributeTerms('the five-lane fusion and its vector refresh', 'prose')).toEqual(['vector refresh', 'five-lane']);
  });
});

describe('loadAllowlist', () => {
  it.each([
    ['a folder row', [{ path: 'docs/', reason: 'folder' }], /names a folder/],
    ['a star glob row', [{ path: 'docs/*.md', reason: 'glob' }], /glob character/],
    ['a question-mark glob row', [{ path: 'docs/note?.md', reason: 'glob' }], /glob character/],
    ['a row with no reason', [{ path: 'docs/note.md' }], /no reason/],
    ['a row with no path', [{ reason: 'orphan reason' }], /no path/],
  ])('refuses %s', (_label, entries, message) => {
    expect(() => loadAllowlist(writeAllowlist(entries))).toThrow(message);
  });

  it('refuses a file that is not JSON', () => {
    expect(() => loadAllowlist(writeAllowlist('{ not json'))).toThrow(/not readable JSON/);
  });
});

// ───────────────────────────────────────────────────────────────────
// Repo mode
// ───────────────────────────────────────────────────────────────────

describe('repo mode', () => {
  it('exits 1 for a planted term and names the file and the term', () => {
    const root = makeRepo({ 'docs/notes.md': 'Start ollama before the scan.\n', 'docs/clean.md': 'nothing here\n' });
    const run = runCli(['repo', '--root', root, '--allowlist', writeAllowlist([]), '--json']);

    expect(run.status).toBe(1);
    const report = JSON.parse(run.stdout);
    expect(report.live).toEqual([{ matched: { identifier: ['ollama'] }, path: 'docs/notes.md' }]);
    expect(report.counts).toMatchObject({ allowlisted: 0, files: 1, live: 1 });
  });

  it('also catches a prose term, a lane word in a path and a symlink into an embeddings folder', () => {
    const root = makeRepo({
      'docs/prose.md': 'The scorer used a five-lane fusion.\n',
      'lib/embedders/index.txt': 'no vocabulary inside\n',
      'pkg/embeddings/README.txt': 'target of the link\n',
    });
    fs.symlinkSync('../pkg/embeddings', path.join(root, 'lib', 'embeddings'));
    commitAll(root);

    const run = runCli(['repo', '--root', root, '--allowlist', writeAllowlist([]), '--json']);

    expect(run.status).toBe(1);
    const byPath = Object.fromEntries(JSON.parse(run.stdout).live.map((entry: { matched: unknown; path: string }) => [entry.path, entry.matched]));
    expect(byPath['docs/prose.md']).toEqual({ prose: ['five-lane'] });
    expect(byPath['lib/embedders/index.txt']).toEqual({ path: ['embedders'] });
    expect(byPath['lib/embeddings']).toEqual({ symlink: '../pkg/embeddings' });
  });

  it('exits 0 once the file is deleted, both before and after the deletion is committed', () => {
    const root = makeRepo({ 'docs/notes.md': 'the embedder route\n', 'docs/clean.md': 'nothing here\n' });
    const allowlist = writeAllowlist([]);
    expect(runCli(['repo', '--root', root, '--allowlist', allowlist]).status).toBe(1);

    fs.rmSync(path.join(root, 'docs', 'notes.md'));
    expect(runCli(['repo', '--root', root, '--allowlist', allowlist]).status).toBe(0);

    commitAll(root);
    const run = runCli(['repo', '--root', root, '--allowlist', allowlist]);
    expect(run.status).toBe(0);
    expect(run.stdout).toContain('live        : 0');
  });

  it('exits 0 when the only hit is allowlisted by its exact path', () => {
    const root = makeRepo({ 'docs/notes.md': 'the vector refresh loop\n' });
    const run = runCli([
      'repo', '--root', root, '--json',
      '--allowlist', writeAllowlist([
        { path: 'docs/notes.md', reason: 'fixture survivor' },
        { path: 'docs/other.md', reason: 'matches nothing' },
      ]),
    ]);

    expect(run.status).toBe(0);
    const report = JSON.parse(run.stdout);
    expect(report.allowlisted).toEqual([{ matched: { prose: ['vector refresh'] }, path: 'docs/notes.md', reason: 'fixture survivor' }]);
    expect(report.counts).toMatchObject({ allowlistRows: 2, allowlistRowsMatched: 1, live: 0 });
    expect(report.unusedAllowlistRows).toEqual(['docs/other.md']);
  });

  it('exits 0 for a repository with no tracked files', () => {
    expect(runCli(['repo', '--root', makeRepo(), '--allowlist', writeAllowlist([])]).status).toBe(0);
  });

  it.each([
    ['a folder row', [{ path: 'docs/', reason: 'folder' }]],
    ['a glob row', [{ path: 'docs/*', reason: 'glob' }]],
    ['malformed JSON', '{ "entries": ['],
  ])('exits 2 for an allowlist with %s instead of scanning', (_label, entries) => {
    const root = makeRepo({ 'docs/notes.md': 'ollama\n' });
    const run = runCli(['repo', '--root', root, '--allowlist', writeAllowlist(entries as unknown[] | string)]);
    expect(run.status).toBe(2);
    expect(run.stderr).toMatch(/allowlist/);
  });

  it('exits 2 when git cannot be found', () => {
    const root = makeRepo({ 'docs/notes.md': 'ollama\n' });
    const run = runCli(['repo', '--root', root, '--allowlist', writeAllowlist([])], { ...baseEnv(), PATH: makeTempDir('lane-residue-empty-path-') });
    expect(run.status).toBe(2);
    expect(run.stderr).toContain('git could not run');
  });
});

// ───────────────────────────────────────────────────────────────────
// Arguments and roots
// ───────────────────────────────────────────────────────────────────

describe('arguments', () => {
  it.each([
    ['an unknown flag', ['repo', '--nope'], 'unknown argument: --nope'],
    ['a flag with no value', ['repo', '--root'], '--root requires a value'],
    ['a flag followed by another flag', ['apply', '--socket-dir', '--json'], '--socket-dir requires a value'],
    ['no mode', ['--json'], 'a mode is required'],
    ['an unknown mode', ['sweep'], 'unknown mode: sweep'],
    ['a flag the mode does not read', ['repo', '--db-dir', '/tmp/x'], '--db-dir does not apply to repo mode'],
  ])('exits 2 for %s', (_label, args, message) => {
    const run = runCli(args);
    expect(run.status).toBe(2);
    expect(run.stderr).toContain(message);
  });

  // The root check runs before any process list or file is read, so these
  // spawned runs touch no machine state.
  it.each(['repo', 'machine', 'apply'])('exits 2 in %s mode for a root below the top of the work tree', (mode) => {
    const root = makeRepo({ 'docs/notes.md': 'ollama\n' });
    const args = [mode, '--root', path.join(root, 'docs')];
    if (mode === 'repo') args.push('--allowlist', writeAllowlist([]));
    const run = runCli(args);
    expect(run.status).toBe(2);
    expect(run.stderr).toContain('top of the work tree');
  });
});

// ───────────────────────────────────────────────────────────────────
// Machine mode
// ───────────────────────────────────────────────────────────────────

describe('machine mode', () => {
  it('exits 0 when the fixtures hold nothing of the lane', async () => {
    const fixture = makeMachineFixture();
    writeAdvisorDb(path.join(fixture.dbDir, 'skill-graph.sqlite'), { lane: false });

    const report = await runMachineChecks(fixture.options, fixture.env, NO_PROCESSES);

    expect(report.exitCode).toBe(0);
    expect(report.findings.filter((entry: Report) => !entry.reportOnly).map((entry: Report) => entry.status))
      .toEqual(Array(8).fill('absent'));
  });

  it('exits 1 for a vector table and names it', async () => {
    const fixture = makeMachineFixture();
    const dbPath = path.join(fixture.dbDir, 'skill-graph.sqlite');
    writeAdvisorDb(dbPath, { lane: true });

    const report = await runMachineChecks(fixture.options, fixture.env, NO_PROCESSES);

    expect(report.exitCode).toBe(1);
    const m3 = findingById(report, 'M3');
    expect(m3.items).toEqual([expect.objectContaining({ kind: 'database', path: dbPath })]);
    expect(m3.items[0].detail).toContain('vec_768');
  });

  it('exits 1 for a lane key in a dotenv file and never prints its value', async () => {
    const fixture = makeMachineFixture();
    writeFile(fixture.root, '.env', 'OLLAMA_BASE_URL=http://value-that-must-not-print.invalid\nUNRELATED_KEY=1\n');

    const report = await runMachineChecks(fixture.options, fixture.env, NO_PROCESSES);

    expect(report.exitCode).toBe(1);
    expect(findingById(report, 'M7').items.map((item: Report) => item.key)).toEqual(['OLLAMA_BASE_URL']);
    const printed = `${JSON.stringify(report)}\n${formatMachineSummary(report)}`;
    expect(printed).not.toContain('value-that-must-not-print');
    expect(printed).not.toContain('UNRELATED_KEY');
  });

  // Each variable moves where the model server writes its files. The pinned
  // folder is the launcher's own derivation; a short temp path keeps it from
  // being relocated, so it is the database folder itself.
  it.each([
    ['SPECKIT_IPC_SOCKET_DIR', (dir: string) => dir],
    ['HF_EMBED_SERVER_URL', (dir: string) => `unix://${path.join(dir, 'custom.sock')}`],
    ['SYSTEM_SKILL_ADVISOR_DB_DIR', (dir: string) => dir],
  ])('exits 1 for a model server pid file left in the folder %s points at', async (variable, valueFor) => {
    const fixture = makeMachineFixture();
    const dir = fs.realpathSync(makeTempDir('lane-residue-srv-'));
    const pidFile = writeFile(dir, 'hf-embed.pid', '123');
    writeFile(dir, 'daemon-ipc.sock', '');

    const report = await runMachineChecks(fixture.options, { ...fixture.env, [variable]: valueFor(dir) }, NO_PROCESSES);

    expect(report.exitCode).toBe(1);
    expect(report.context.modelServerDirs).toContainEqual({ path: dir, source: variable });
    expect(findingById(report, 'M4').items).toEqual([expect.objectContaining({ dir, kind: 'server-file', path: pidFile })]);
  });

  it('does not count a socket folder that holds only files the model server never writes', async () => {
    const fixture = makeMachineFixture();
    writeFile(fixture.socketDir, 'notes.txt', 'mine');

    const report = await runMachineChecks(fixture.options, fixture.env, NO_PROCESSES);

    expect(findingById(report, 'M4').status).toBe('absent');
    expect(report.exitCode).toBe(0);
  });

  it('exits 2 when a database cannot be read and nothing else is found', async () => {
    const fixture = makeMachineFixture();
    fs.writeFileSync(path.join(fixture.dbDir, 'other.sqlite'), 'not a database', 'utf8');

    const report = await runMachineChecks(fixture.options, fixture.env, NO_PROCESSES);

    expect(report.exitCode).toBe(2);
    const m3 = findingById(report, 'M3');
    expect(m3.status).toBe('not_checked');
    expect(m3.notes.join(' ')).toContain('could not be read');
  });
});

// ───────────────────────────────────────────────────────────────────
// Apply mode
// ───────────────────────────────────────────────────────────────────

describe('apply mode', () => {
  /** Leftovers the cleanup owns, one unrelated sibling of each kind, and both ask-first items. */
  function plantLeftovers(fixture: MachineFixture): { hfFolder: string } {
    writeAdvisorDb(path.join(fixture.dbDir, 'skill-graph.sqlite'), { lane: true });
    writeFile(fixture.dbDir, 'skill-graph.sqlite-wal', '');
    writeFile(fixture.dbDir, 'skill-graph.sqlite-shm', '');
    writeFile(fixture.dbDir, 'skill-graph.sqlite.pre-doctor-skill-advisor-rebuild.1.bak', 'copy');
    writeFile(fixture.dbDir, 'skill-graph.sqlite.2.corrupt', 'copy');
    writeFile(fixture.dbDir, 'vectors/context-vectors__hf-local.sqlite', 'shard');
    writeFile(fixture.dbDir, 'notes.txt', 'unrelated');

    const runtime = '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib';
    writeFile(fixture.root, `${runtime}/scorer/lanes/semantic-shadow.js`, 'export {};\n');
    writeFile(fixture.root, `${runtime}/scorer/lanes/lexical.js`, 'export const lane = 1;\n');
    writeFile(fixture.root, `${runtime}/embedders/index.js`, 'export {};\n');

    for (const name of SERVER_FILES) writeFile(fixture.socketDir, name, '');
    const hfFolder = path.join(fixture.hfHome, 'hub', HF_FOLDER);
    writeFile(hfFolder, 'refs/main', 'abc');
    return { hfFolder };
  }

  it('without a terminal deletes the owned leftovers, keeps both shared stores and sends no DELETE', async () => {
    const fixture = makeMachineFixture();
    const { hfFolder } = plantLeftovers(fixture);
    const ollama = await startFakeOllama([MODEL]);

    const report = await applyQuietly(fixture, { ollamaHost: ollama.host });

    // The kept cache folder and model are still found, so the re-run exits 1.
    expect(report.exitCode).toBe(1);
    expect(findingById(report.before, 'M3').status).toBe('found');
    expect(findingById(report.before, 'M6').items).toEqual([expect.objectContaining({ source: 'api' })]);

    expect(fs.readdirSync(fixture.dbDir).sort()).toEqual(['notes.txt', 'vectors']);
    expect(fs.readdirSync(path.join(fixture.dbDir, 'vectors'))).toEqual([]);
    const lanes = path.join(fixture.root, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/lanes');
    expect(fs.readdirSync(lanes)).toEqual(['lexical.js']);
    expect(fs.existsSync(path.join(fixture.root, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/embedders'))).toBe(false);
    expect(fs.existsSync(fixture.socketDir)).toBe(false);

    expect(fs.existsSync(hfFolder)).toBe(true);
    expect(ollama.calls.some((call) => call.method === 'GET' && call.url === '/api/tags')).toBe(true);
    expect(ollama.calls.filter((call) => call.method === 'DELETE')).toEqual([]);
    expect(actionsOf(report, 'kept')).toHaveLength(2);
    expect(findingById(report.after, 'M3').status).toBe('absent');
    expect(findingById(report.after, 'M4').status).toBe('absent');
  });

  it.each([
    ['yes', true],
    ['no', false],
  ])('on a terminal answered %s, acts on the shared stores only after a yes', async (_answer, approve) => {
    const fixture = makeMachineFixture();
    const { hfFolder } = plantLeftovers(fixture);
    const ollama = await startFakeOllama([MODEL]);
    const questions: string[] = [];

    const report = await runApply(
      { ...fixture.options, ollamaHost: ollama.host },
      fixture.env,
      { confirm: async (question: string) => { questions.push(question); return approve; }, interactive: true, ...NO_PROCESSES },
    );

    expect(questions).toHaveLength(2);
    const deletes = ollama.calls.filter((call) => call.method === 'DELETE');
    expect(fs.existsSync(hfFolder)).toBe(!approve);
    expect(deletes).toEqual(approve ? [{ body: JSON.stringify({ model: MODEL }), method: 'DELETE', url: '/api/delete' }] : []);
    expect(fs.readdirSync(fixture.dbDir).sort()).toEqual(['notes.txt', 'vectors']);
    expect(report.interactive).toBe(true);
  });

  it('exits 0 and deletes nothing when nothing of the lane is there', async () => {
    const fixture = makeMachineFixture();
    writeFile(fixture.dbDir, 'notes.txt', 'unrelated');

    const report = await applyQuietly(fixture);

    expect(report.exitCode).toBe(0);
    expect(report.actions).toEqual([]);
    expect(fs.readdirSync(fixture.dbDir)).toEqual(['notes.txt']);
  });

  it('deletes only the model server files from a socket folder and keeps the folder while it holds anything else', async () => {
    const fixture = makeMachineFixture();
    const precious = path.join(fixture.home, 'precious');
    const important = writeFile(precious, 'sub/important.txt', 'keep me');
    for (const name of SERVER_FILES) writeFile(precious, name, '');

    const report = await applyQuietly(fixture, { socketDir: precious });

    expect(fs.readFileSync(important, 'utf8')).toBe('keep me');
    expect(fs.readdirSync(precious)).toEqual(['sub']);
    expect(actionsOf(report, 'deleted').map((action) => path.basename(action.target)).sort()).toEqual([...SERVER_FILES].sort());
    expect(actionsOf(report, 'kept')).toEqual([{ action: 'kept', reason: 'holds files the model server does not write', target: precious }]);
    // Once only the user's files remain, the folder is no longer residue.
    expect(findingById(report.before, 'M4').status).toBe('found');
    expect(findingById(report.after, 'M4').status).toBe('absent');
    expect(report.exitCode).toBe(0);
  });

  it('deletes every model server file from the shared IPC folder and leaves the folder and its other files', async () => {
    const fixture = makeMachineFixture();
    const ipcDir = makeTempDir('lane-residue-ipc-');
    for (const name of SERVER_FILES) writeFile(ipcDir, name, '');
    const daemonSocket = writeFile(ipcDir, 'daemon-ipc.sock', '');

    const report = await applyQuietly(fixture, {}, { ...fixture.env, SPECKIT_IPC_SOCKET_DIR: ipcDir });

    expect(fs.readdirSync(ipcDir)).toEqual(['daemon-ipc.sock']);
    expect(fs.existsSync(daemonSocket)).toBe(true);
    expect(report.exitCode).toBe(0);
  });

  it('keeps a directory that sits where a model server file name was expected', async () => {
    const fixture = makeMachineFixture();
    const inside = writeFile(fixture.socketDir, 'hf-embed.pid/keep.txt', 'not a pid file');
    writeFile(fixture.socketDir, 'hf-embed.sock', '');

    const report = await applyQuietly(fixture);

    expect(fs.readFileSync(inside, 'utf8')).toBe('not a pid file');
    expect(fs.existsSync(path.join(fixture.socketDir, 'hf-embed.sock'))).toBe(false);
    expect(actionsOf(report, 'kept')).toContainEqual({
      action: 'kept',
      reason: 'a directory where a file was expected',
      target: path.join(fixture.socketDir, 'hf-embed.pid'),
    });
  });

  describe('model server ownership', () => {
    /** A real idle process of ours, so a wrong signal is observable and harmless. */
    function startIdleChild(): ChildProcess {
      const child = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 60000)'], { stdio: 'ignore' });
      children.add(child);
      return child;
    }

    it('never signals a non-node process that merely names this checkout\'s script', async () => {
      const fixture = makeMachineFixture();
      const child = startIdleChild();
      const command = `less ${path.join(fixture.root, '.skilled', 'bin', 'hf-model-server.cjs')}`;

      const report = await runApply(fixture.options, fixture.env, { interactive: false, processes: [{ command, pid: child.pid as number }] });

      expect(actionsOf(report, 'stopped')).toEqual([]);
      expect(child.exitCode).toBeNull();
      expect(child.signalCode).toBeNull();
      expect(() => process.kill(child.pid as number, 0)).not.toThrow();
    });

    it('stops node running this checkout\'s script', async () => {
      const fixture = makeMachineFixture();
      const child = startIdleChild();
      const exited = new Promise((resolve) => child.once('exit', (_code, signal) => resolve(signal)));
      const command = `node ${path.join(fixture.root, '.skilled', 'bin', 'hf-model-server.cjs')}`;

      const report = await runApply(fixture.options, fixture.env, { interactive: false, processes: [{ command, pid: child.pid as number }] });

      expect(actionsOf(report, 'stopped')).toEqual([{ action: 'stopped', target: `pid ${child.pid}` }]);
      await expect(exited).resolves.toBe('SIGTERM');
    });
  });

  it.each([
    ['the process list cannot be read', null, 'the process list could not be read'],
    ['a model server from another checkout runs', [{ command: 'node /elsewhere/.skilled/bin/hf-model-server.cjs', pid: 999999 }], 'did not start'],
  ])('keeps the socket folder and its files when %s', async (_label, processes, reason) => {
    const fixture = makeMachineFixture();
    for (const name of SERVER_FILES) writeFile(fixture.socketDir, name, '');

    const report = await runApply(fixture.options, fixture.env, { interactive: false, processes });

    expect(fs.readdirSync(fixture.socketDir).sort()).toEqual([...SERVER_FILES].sort());
    const kept = actionsOf(report, 'kept');
    expect(kept.map((action) => action.target)).toContain(fixture.socketDir);
    for (const action of kept) expect(action.reason).toContain(reason);
    expect(actionsOf(report, 'stopped')).toEqual([]);
  });

  it('refuses a delete that a symlink would carry outside the database directory', async () => {
    const fixture = makeMachineFixture();
    const outside = makeTempDir('lane-residue-outside-');
    const outsideShard = writeFile(outside, 'context-vectors__hf-local.sqlite', 'not ours');
    fs.symlinkSync(outside, path.join(fixture.dbDir, 'vectors'));

    const report = await applyQuietly(fixture);

    expect(fs.existsSync(outsideShard)).toBe(true);
    const refused = actionsOf(report, 'refused');
    expect(refused).toEqual([expect.objectContaining({ target: path.join(fixture.dbDir, 'vectors', 'context-vectors__hf-local.sqlite') })]);
    expect(refused[0].reason).toContain('outside');
  });
});

describe('confirmOnTerminal', () => {
  it('treats a closed input (Ctrl+D) as no instead of hanging or throwing', async () => {
    const input = new PassThrough();
    const answer = confirmOnTerminal('Delete it?', input, new PassThrough());
    input.end();
    await expect(answer).resolves.toBe(false);
  });

  it.each([
    ['y', true],
    ['YES', true],
    ['', false],
    ['no', false],
  ])('answers %j as %s', async (typed, expected) => {
    const input = new PassThrough();
    const answer = confirmOnTerminal('Delete it?', input, new PassThrough());
    input.write(`${typed}\n`);
    await expect(answer).resolves.toBe(expected);
  });
});

describe('resolveContainedTarget', () => {
  it('refuses a target that is a symlink, and a name that climbs out of its root', () => {
    const root = makeTempDir('lane-residue-contained-');
    fs.symlinkSync(makeTempDir('lane-residue-elsewhere-'), path.join(root, 'linked'));

    expect(resolveContainedTarget(root, ['linked'])).toMatchObject({ status: 'refused' });
    expect(resolveContainedTarget(root, ['..', path.basename(root)])).toMatchObject({ status: 'refused' });
    expect(resolveContainedTarget(root, ['missing'])).toEqual({ status: 'absent' });
  });
});
