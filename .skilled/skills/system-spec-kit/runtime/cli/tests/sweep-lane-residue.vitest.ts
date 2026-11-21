// ───────────────────────────────────────────────────────────────────
// MODULE: Sweep Lane Residue Tests
// ───────────────────────────────────────────────────────────────────
// Coverage matrix, mode x checkout state x terminal x answer x model server.
// The terminal and answer axes apply only to apply mode's one ask-first item,
// the pulled Ollama model; every other cell runs without a terminal.
//
// | Mode    | Remnant present                                  | Remnant absent             | Allowlisted          |
// |---------|--------------------------------------------------|----------------------------|----------------------|
// | repo    | planted content, path word, symlink -> exit 1;   | removed, empty repo -> 0;  | exact path -> exit 0;|
// |         |   index phrase, spelling, path or record string  |   index entries only under |   index entry at an  |
// |         |   pointing outside specs/ -> exit 1              |   specs/ -> 0              |   allowlisted path -> 0, |
// |         |                                                  |                            |   a row naming an index |
// |         |                                                  |                            |   output hides nothing |
// | machine | vec_768 table, dotenv key, a model server file   | clean fixtures, a socket   | (no allowlist)       |
// |         |   in any folder it could use, the custom socket  |   folder of user files, or |                      |
// |         |   file an explicit address names -> exit 1;      |   a shell or pager naming  |                      |
// |         |   askFirst only while a running server lists the |   the server script -> 0;  |                      |
// |         |   model and no lane source exists                |   spawned binary -> 0      |                      |
// | apply   | no terminal, no answer: owned leftovers deleted  | clean fixtures -> exit 0,  | (no allowlist)       |
// |         |   (model cache included), model kept, exit 1     |   nothing deleted          |                      |
// |         | terminal, yes: DELETE sent; no: kept, each of    |                            |                      |
// |         |   two runs asks once and leaves the tree as found|                            |                      |
// |         | --shared-model delete: DELETE, no question;      |                            |                      |
// |         |   keep on a terminal: no question, no DELETE     |                            |                      |
// |         | a lane source in the checkout: nothing deleted,  |                            |                      |
// |         |   stopped or asked, every item kept, exit 1      |                            |                      |
// |         | terminal closed (Ctrl+D): counts as no;          |                            |                      |
// |         |   a real terminal through a pseudo-terminal      |                            |                      |
//
// Exit 2: unknown flag (the removed hub cache flag included), missing value,
// missing mode, --shared-model outside apply or with another answer, malformed
// allowlist (bad JSON, no reason, folder row, glob row), git missing, a root
// below the work tree top in every mode, an unreadable database, an index
// output that is not JSON.
//
// Path safety in apply: a symlink that would carry a delete outside its root is
// refused; a directory sitting under a model server file name is kept; the
// socket folder loses only the files the model server writes and is kept while
// it holds anything else; a shared folder (IPC, explicit socket address,
// launcher-pinned) loses only those files and is never removed; nothing is
// touched while a model server may still use it (foreign server, or no
// readable process list); only node running this checkout's script as its
// first script argument is signalled, never another process naming it.
//
// Isolation: machine and apply cases run in-process with fixture locations for
// HOME, OLLAMA_HOST, OLLAMA_MODELS, SYSTEM_SKILL_ADVISOR_DB_DIR, the socket
// folder and the IPC folder, strip every variable in SCRUBBED_ENV, and pass a
// fixture process list, so no case reads or changes real machine state. Repo
// mode, argument errors, one machine run and the terminal case spawn the CLI;
// the spawned machine and apply runs name a fixture for every location and
// read only the real process list, which can never match a fixture's server.

import { type ChildProcess, spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { PassThrough } from 'node:stream';
import { fileURLToPath } from 'node:url';

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  attributeTerms,
  confirmOnTerminal,
  formatMachineSummary,
  INDEX_OUTPUTS,
  isOwnedModelServer,
  loadAllowlist,
  resolveContainedTarget,
  runApply,
  runMachineChecks,
  sharedModelQuestion,
} from '../retrieval/sweep-lane-residue.mjs';

const SCRIPT_PATH = fileURLToPath(new URL('../retrieval/sweep-lane-residue.mjs', import.meta.url));

/** Nothing listens on the discard port, so a fetch there is refused at once. */
const CLOSED_OLLAMA_HOST = 'http://127.0.0.1:9';
const MODEL = 'nomic-embed-text:v1.5';
const SERVER_FILES = ['hf-embed.sock', 'hf-embed.pid', 'hf-embed-respawn.lock', 'hf-embed-giveup.json'];
/** No model server and no ollama process: the state the clean cases need. */
const NO_PROCESSES = { processes: [] };

/** The two packages that installed the model library, and the model's folder in the library's own cache. */
const PACKAGE_ROOTS = ['.skilled/skills/system-skill-advisor/runtime', '.skilled/skills/system-spec-kit'];
const MODEL_CACHE = 'node_modules/@huggingface/transformers/.cache/nomic-ai/nomic-embed-text-v1.5';
const SERVER_SCRIPT = '.skilled/bin/hf-model-server.cjs';
/** Paths whose presence means a checkout still runs the lane. */
const LANE_SOURCES = [
  '.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts',
  '.skilled/skills/system-skill-advisor/runtime/lib/embedders',
  '.skilled/skills/system-spec-kit/shared/embeddings',
  '.skilled/bin/hf-model-server.cjs',
];

/** Variables that would point a run at real machine state or another git index. */
const SCRUBBED_ENV = [
  'GIT_DIR',
  'GIT_INDEX_FILE',
  'GIT_WORK_TREE',
  'HF_EMBED_SERVER_URL',
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
// The tool's JSON reports are read field by field in the assertions, so the
// suite types them loosely rather than restating the tool's report schema.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Report = Record<string, any>;
type MachineFixture = {
  dbDir: string;
  env: NodeJS.ProcessEnv;
  home: string;
  options: Record<string, string>;
  root: string;
  socketDir: string;
};

const tempRoots = new Set<string>();
const servers = new Set<http.Server>();
const children = new Set<ChildProcess>();

// The in-process calls run git with this process's own environment, so a GIT_DIR
// a hook exported would point them at another repository. Clear the list for the
// whole file and put the shell's values back afterwards.
const shellEnv = new Map<string, string | undefined>();

beforeAll(() => {
  for (const key of SCRUBBED_ENV) {
    shellEnv.set(key, process.env[key]);
    delete process.env[key];
  }
});

afterAll(() => {
  for (const [key, value] of shellEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

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

/** A temp folder whose path length does not depend on TMPDIR, for a socket path that must fit sun_path. */
function makeShortTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join('/tmp', prefix));
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

/**
 * A fake Ollama server that lists the given models and records every call.
 * With `dropOnDelete` a DELETE removes the model from the list, as the real
 * server does; without it the list never changes.
 */
async function startFakeOllama(
  initialModels: string[],
  { dropOnDelete = false }: { dropOnDelete?: boolean } = {},
): Promise<{ calls: Call[]; host: string; models: string[] }> {
  const calls: Call[] = [];
  const models = [...initialModels];
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
      const isDelete = request.method === 'DELETE' && request.url === '/api/delete';
      if (isDelete && dropOnDelete) {
        const named = JSON.parse(body || '{}').model;
        if (models.includes(named)) models.splice(models.indexOf(named), 1);
      }
      response.writeHead(isDelete ? 200 : 404);
      response.end();
    });
  });
  servers.add(server);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  return { calls, host: `http://127.0.0.1:${(server.address() as AddressInfo).port}`, models };
}

function deletesOf(calls: Call[]): Call[] {
  return calls.filter((call) => call.method === 'DELETE');
}

/** Every file and folder under the given roots, sorted, so a before and after list can be compared. */
function listTree(...roots: string[]): string[] {
  const listed: string[] = [];
  roots.forEach((root, rootIndex) => {
    const walk = (dir: string): void => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const absolute = path.join(dir, entry.name);
        listed.push(`${rootIndex}:${path.relative(root, absolute)}${entry.isDirectory() ? '/' : ''}`);
        if (entry.isDirectory()) walk(absolute);
      }
    };
    if (fs.existsSync(root)) walk(root);
  });
  return listed.sort();
}

/** The lane model in each package's model cache, plus one sibling file the cleanup must leave. */
function plantModelCache(root: string): { cacheFolders: string[]; siblings: string[] } {
  const cacheFolders = PACKAGE_ROOTS.map((pkg) => path.join(root, pkg, MODEL_CACHE));
  for (const folder of cacheFolders) writeFile(folder, 'onnx/model.onnx', 'weights');
  const siblings = PACKAGE_ROOTS.map((pkg) => writeFile(root, `${pkg}/node_modules/@huggingface/transformers/package.json`, '{}'));
  return { cacheFolders, siblings };
}

/** A lane source in the checkout: a file for the two file sentinels, a folder holding one file otherwise. */
function plantLaneSource(root: string, source: string): void {
  if (/\.(?:ts|cjs)$/.test(source)) writeFile(root, source, 'export {};\n');
  else writeFile(root, `${source}/index.ts`, 'export {};\n');
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
  const socketDir = path.join(home, 'system-hf-embed');
  fs.mkdirSync(dbDir, { recursive: true });
  const env = {
    ...baseEnv(),
    HOME: home,
    OLLAMA_HOST: CLOSED_OLLAMA_HOST,
    OLLAMA_MODELS: path.join(home, 'ollama-models'),
  };
  // The database folder travels as an option, not as SYSTEM_SKILL_ADVISOR_DB_DIR:
  // that variable also makes the launcher's pinned model server folder a
  // candidate, which only the case about that folder sets on purpose.
  const options = { dbDir, ollamaHost: CLOSED_OLLAMA_HOST, root, socketDir };
  return { dbDir, env, home, options, root, socketDir };
}

/**
 * One folder holding the checkout, HOME, the database folder and the socket
 * path, for the cases that spawn the CLI: every location the child could read
 * or delete then sits under one fixture folder a guard can check.
 */
function makeSpawnFixture(): { base: string; dbDir: string; env: NodeJS.ProcessEnv; home: string; root: string; socketDir: string } {
  const base = fs.realpathSync(makeTempDir('lane-residue-spawn-'));
  const root = path.join(base, 'root');
  const home = path.join(base, 'home');
  const dbDir = path.join(base, 'db');
  fs.mkdirSync(root);
  fs.mkdirSync(home);
  fs.mkdirSync(dbDir);
  git(root, 'init', '-q');
  const env = { ...baseEnv(), HOME: home, OLLAMA_MODELS: path.join(home, 'ollama') };
  return { base, dbDir, env, home, root, socketDir: path.join(base, 'sock') };
}

function isInside(base: string, candidate: string): boolean {
  const relative = path.relative(base, candidate);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

/**
 * Before a spawn: every variable that could point the child at real machine
 * state is unset or names a place inside the fixture folder, so no real folder
 * can join the delete candidates beside the fixture's own.
 */
function expectFixtureOnlyEnv(fixture: { base: string; env: NodeJS.ProcessEnv }): void {
  expect(isInside(fixture.base, fixture.env.HOME as string)).toBe(true);
  for (const key of SCRUBBED_ENV) {
    const value = fixture.env[key];
    if (value !== undefined) expect(isInside(fixture.base, value), `${key}=${value}`).toBe(true);
  }
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

  it('catches the spaced names of the model server and its helpers that a description or trigger phrase uses', () => {
    const root = makeRepo({
      'bin/README.md': [
        'description: "Launchers and the local embedding server."',
        'trigger_phrases:',
        '  - "HF model server"',
        '  - "hf embed server url"',
        '',
      ].join('\n'),
      'bin/lib/README.md': 'Helpers for model server supervision and the sidecar env allowlist.\n',
      'docs/cleanup.md': 'Apply stops a local model server this checkout owns.\n',
    });

    const run = runCli(['repo', '--root', root, '--allowlist', writeAllowlist([]), '--json']);

    expect(run.status).toBe(1);
    const byPath = Object.fromEntries(JSON.parse(run.stdout).live.map((entry: { matched: unknown; path: string }) => [entry.path, entry.matched]));
    expect(byPath['bin/README.md']).toEqual({ prose: ['hf model server', 'hf embed server', 'local embedding server'] });
    expect(byPath['bin/lib/README.md']).toEqual({ prose: ['model server supervision', 'sidecar env allowlist'] });
    // A bare "model server" names what the cleanup removes, so it is no lane term.
    expect(byPath['docs/cleanup.md']).toBeUndefined();
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

describe('repo mode: the trigger index outputs', () => {
  type IndexShape = {
    diagnostics?: Array<Record<string, string>>;
    included?: string[];
    paths: string[];
    phrases: Record<string, number[]>;
    variants?: Record<string, string[]>;
  };

  /** The four generator outputs at their real paths, in the generator's shape. */
  function indexFiles({ diagnostics = [], included, paths, phrases, variants = {} }: IndexShape): Record<string, string> {
    return {
      [INDEX_OUTPUTS.diagnostics]: JSON.stringify({ counts: { ok: paths.length }, rows: diagnostics }),
      [INDEX_OUTPUTS.index]: JSON.stringify({ paths, phrases, schemaVersion: 2 }),
      [INDEX_OUTPUTS.manifest]: JSON.stringify({ includedPaths: included ?? paths, roots: ['specs', '.skilled/skills'] }),
      [INDEX_OUTPUTS.variants]: JSON.stringify({ variants }),
    };
  }

  function scan(files: Record<string, string>, rows: unknown[] = []): { report: Report; status: number | null } {
    const run = runCli(['repo', '--root', makeRepo(files), '--allowlist', writeAllowlist(rows), '--json']);
    return { report: JSON.parse(run.stdout || '{}'), status: run.status };
  }

  function liveEntry(report: Report, output: string): Report[] {
    return report.live.find((entry: Report) => entry.path === output)?.matched.index ?? [];
  }

  it('exits 0 when every lane entry points under specs/, with no allowlist row for any output', () => {
    const { report, status } = scan(indexFiles({
      diagnostics: [{ category: 'duplicate-phrase', path: 'specs/old/spec.md', reason: 'duplicate normalized phrase "ollama setup"' }],
      paths: ['specs/old/ollama-notes/spec.md', 'docs/clean.md'],
      phrases: { 'local setup': [1], 'ollama setup': [0] },
      variants: { 'vector refresh loop': ['vector refresh loop'] },
    }));

    expect(status).toBe(0);
    expect(report.counts).toMatchObject({ files: 0, live: 0 });
    expect(report.index).toMatchObject({ lanePaths: 1, lanePhrases: 1, outside: 0 });
    expect(report.index.outputsRead).toEqual(Object.values(INDEX_OUTPUTS).sort());
  });

  it('exits 1 for a lane phrase that maps to a doc outside specs/ and names the phrase and the path', () => {
    const { report, status } = scan(indexFiles({ paths: ['specs/a/spec.md', 'docs/setup.md'], phrases: { 'ollama setup': [0, 1] } }));

    expect(status).toBe(1);
    expect(liveEntry(report, INDEX_OUTPUTS.index)).toEqual([{ kind: 'phrase', path: 'docs/setup.md', phrase: 'ollama setup' }]);
  });

  it('exits 1 for a plain phrase whose recorded spelling names the lane', () => {
    const { report, status } = scan(indexFiles({
      paths: ['docs/setup.md'],
      phrases: { 'local model setup': [0] },
      variants: { 'local model setup': ['Ollama model setup'] },
    }));

    expect(status).toBe(1);
    expect(liveEntry(report, INDEX_OUTPUTS.variants)).toEqual([
      { kind: 'phrase', path: 'docs/setup.md', phrase: 'local model setup', spelling: 'Ollama model setup' },
    ]);
  });

  it.each([
    ['the index paths', { paths: ['docs/ollama-notes.md'], phrases: {} }, INDEX_OUTPUTS.index],
    ['the corpus manifest', { included: ['docs/ollama-notes.md'], paths: ['docs/clean.md'], phrases: {} }, INDEX_OUTPUTS.manifest],
    ['the generation diagnostics', {
      diagnostics: [{ category: 'missing-frontmatter', path: 'docs/ollama-notes.md', reason: 'no trigger_phrases key' }],
      paths: ['docs/clean.md'],
      phrases: {},
    }, INDEX_OUTPUTS.diagnostics],
  ])('exits 1 for a lane path outside specs/ in %s', (_label, shape, output) => {
    const { report, status } = scan(indexFiles(shape as IndexShape));

    expect(status).toBe(1);
    expect(liveEntry(report, output)).toEqual([expect.objectContaining({ path: 'docs/ollama-notes.md' })]);
  });

  it('exits 0 when the lane entries point at an allowlisted file, which keeps its own row', () => {
    const { report, status } = scan(
      { ...indexFiles({ paths: ['docs/kept.md'], phrases: { 'ollama setup': [0] } }), 'docs/kept.md': 'Kept on purpose: ollama.\n' },
      [{ path: 'docs/kept.md', reason: 'fixture survivor' }],
    );

    expect(status).toBe(0);
    expect(report.allowlisted.map((entry: Report) => entry.path)).toEqual(['docs/kept.md']);
    expect(report.unusedAllowlistRows).toEqual([]);
  });

  it('keeps a structural hit live even when an allowlist row names the output', () => {
    const { report, status } = scan(
      indexFiles({ paths: ['docs/setup.md'], phrases: { 'ollama setup': [0] } }),
      [{ path: INDEX_OUTPUTS.index, reason: 'a whole-file row' }],
    );

    expect(status).toBe(1);
    expect(liveEntry(report, INDEX_OUTPUTS.index)).toHaveLength(1);
    expect(report.unusedAllowlistRows).toEqual([INDEX_OUTPUTS.index]);
  });

  it('still finds a lane term in any other tracked file by the plain scan', () => {
    const { report, status } = scan({
      ...indexFiles({ paths: ['specs/a/spec.md'], phrases: { 'ollama setup': [0] } }),
      'docs/notes.md': 'Start ollama first.\n',
    });

    expect(status).toBe(1);
    expect(report.live).toEqual([{ matched: { identifier: ['ollama'] }, path: 'docs/notes.md' }]);
  });

  it('exits 2 instead of scanning when a tracked output is not JSON', () => {
    const files = { ...indexFiles({ paths: [], phrases: {} }), [INDEX_OUTPUTS.manifest]: '{ not json' };
    const run = runCli(['repo', '--root', makeRepo(files), '--allowlist', writeAllowlist([])]);

    expect(run.status).toBe(2);
    expect(run.stderr).toContain('not readable JSON');
  });

  // Each shape would hide the lane phrase below if it read as empty, because
  // the index and its variants are left out of the text scan.
  const LANE_SPELLING = { paths: ['docs/setup.md'], phrases: { 'plain setup': [0] } };
  it.each([
    ['a renamed variants map', { [INDEX_OUTPUTS.variants]: JSON.stringify({ spellings: { 'plain setup': ['ollama setup'] } }) }, 'has no variants map'],
    ['a variants map that is an array', { [INDEX_OUTPUTS.variants]: JSON.stringify({ variants: [['ollama setup']] }) }, 'has no variants map'],
    ['spellings that are not a list', { [INDEX_OUTPUTS.variants]: JSON.stringify({ variants: { 'plain setup': 'ollama setup' } }) }, 'not a list of strings'],
    ['path ids that are not a list', { [INDEX_OUTPUTS.index]: JSON.stringify({ paths: ['docs/setup.md'], phrases: { 'ollama setup': { 0: 0 } } }) }, 'other than a list of path ids'],
    ['a phrases map that is an array', { [INDEX_OUTPUTS.index]: JSON.stringify({ paths: ['docs/setup.md'], phrases: [[0]] }) }, 'has no paths array or phrases map'],
  ])('exits 2 instead of reading %s as empty', (_label, override, message) => {
    const files = { ...indexFiles({ ...LANE_SPELLING, variants: { 'plain setup': ['ollama setup'] } }), ...override };
    const run = runCli(['repo', '--root', makeRepo(files), '--allowlist', writeAllowlist([])]);

    expect(run.status).toBe(2);
    expect(run.stderr).toContain(message);
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
    ['the shared-model answer outside apply', ['machine', '--shared-model', 'keep'], '--shared-model does not apply to machine mode'],
    ['a shared-model answer that is neither delete nor keep', ['apply', '--shared-model', 'maybe'], '--shared-model takes delete or keep, not maybe'],
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
  // folder is the launcher's own derivation, which relocates a socket folder
  // whose socket path would pass the sun_path limit. The fixture lives under
  // /tmp rather than the ambient temp folder, whose length varies by machine,
  // so the folder is never relocated and stays the database folder itself.
  it.each([
    ['SPECKIT_IPC_SOCKET_DIR', (dir: string) => dir],
    ['HF_EMBED_SERVER_URL', (dir: string) => `unix://${path.join(dir, 'custom.sock')}`],
    ['SYSTEM_SKILL_ADVISOR_DB_DIR', (dir: string) => dir],
  ])('exits 1 for a model server pid file left in the folder %s points at', async (variable, valueFor) => {
    const fixture = makeMachineFixture();
    const dir = fs.realpathSync(makeShortTempDir('lane-residue-srv-'));
    const pidFile = writeFile(dir, 'hf-embed.pid', '123');
    writeFile(dir, 'daemon-ipc.sock', '');

    const report = await runMachineChecks(fixture.options, { ...fixture.env, [variable]: valueFor(dir) }, NO_PROCESSES);

    expect(report.exitCode).toBe(1);
    expect(report.context.modelServerDirs).toContainEqual(expect.objectContaining({ path: dir, source: variable }));
    expect(findingById(report, 'M4').items).toEqual([expect.objectContaining({ dir, kind: 'server-file', path: pidFile })]);
    // The launcher's IPC bridge still loads, so the pinned folder is derived rather than noted as unknown.
    expect(findingById(report, 'M4').notes.join(' ')).not.toContain('could not be derived');
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

  it('reports the lane model in the model cache of both packages', async () => {
    const fixture = makeMachineFixture();
    const { cacheFolders } = plantModelCache(fixture.root);

    const report = await runMachineChecks(fixture.options, fixture.env, NO_PROCESSES);

    expect(findingById(report, 'M5').items.map((item: Report) => item.path)).toEqual(cacheFolders);
    expect(report.exitCode).toBe(1);
  });

  it('lists the shared-model question in askFirst only while a running server lists the model', async () => {
    const fixture = makeMachineFixture();
    const ollama = await startFakeOllama([MODEL]);

    const listed = await runMachineChecks({ ...fixture.options, ollamaHost: ollama.host }, fixture.env, NO_PROCESSES);
    expect(listed.askFirst).toEqual([{ check: 'M6', question: sharedModelQuestion(ollama.host) }]);

    // With the server down the manifest still shows the model, but apply could not act on an answer.
    writeFile(path.join(fixture.home, 'ollama-models'), 'manifests/registry.ollama.ai/library/nomic-embed-text/v1.5', '{}');
    const closed = await runMachineChecks(fixture.options, fixture.env, NO_PROCESSES);
    expect(findingById(closed, 'M6').items).toEqual([expect.objectContaining({ source: 'manifest' })]);
    expect(closed.askFirst).toEqual([]);
  });
});

describe('model server ownership and socket names', () => {
  it('owns node running this checkout\'s script as its first script argument, and nothing else', () => {
    const fixture = makeMachineFixture();
    const binDir = path.join(fixture.root, '.skilled', 'bin');
    fs.mkdirSync(binDir, { recursive: true });
    // The update deletes the script while a server started earlier keeps running from its path.
    const script = path.join(binDir, 'hf-model-server.cjs');
    const linkedBin = path.join(makeTempDir('lane-residue-link-'), 'bin');
    fs.symlinkSync(binDir, linkedBin);
    const otherScript = path.join(makeTempDir('lane-residue-other-'), SERVER_SCRIPT);
    const owned = (command: string) => isOwnedModelServer(command, script);

    expect(fs.existsSync(script)).toBe(false);
    expect(owned(`node ${script}`)).toBe(true);
    expect(owned(`/usr/local/bin/node ${script} --flag`)).toBe(true);
    expect(owned(`node --inspect ${script}`)).toBe(true);
    expect(owned(`node ${path.join(linkedBin, 'hf-model-server.cjs')}`)).toBe(true);
    expect(owned(`node /other.js ${script}`)).toBe(false);
    expect(owned(`less ${script}`)).toBe(false);
    expect(owned(`node ${otherScript}`)).toBe(false);
  });

  it('lists node running any checkout\'s server script, never a shell or pager that only names it', async () => {
    const fixture = makeMachineFixture();
    const script = path.join(fixture.root, SERVER_SCRIPT);
    const processes = [
      { command: `node ${script}`, pid: 101 },
      { command: `node /elsewhere/${SERVER_SCRIPT}`, pid: 102 },
      { command: `/bin/zsh -c 'node ${script} > /dev/null'`, pid: 103 },
      { command: `less ${script}`, pid: 104 },
      { command: `node /other.js ${script}`, pid: 105 },
    ];

    const report = await runMachineChecks(fixture.options, fixture.env, { processes });

    expect(findingById(report, 'M4').items.map((item: Report) => [item.pid, item.owned])).toEqual([[101, true], [102, false]]);
  });

  it('exits 0 when the only processes merely name the server script', async () => {
    const fixture = makeMachineFixture();
    const script = path.join(fixture.root, SERVER_SCRIPT);
    const processes = [
      { command: `/bin/zsh -c 'ps -axo command= | grep hf-model-server.cjs'`, pid: 103 },
      { command: `less ${script}`, pid: 104 },
    ];

    const report = await runMachineChecks(fixture.options, fixture.env, { processes });

    expect(findingById(report, 'M4').status).toBe('absent');
    expect(report.exitCode).toBe(0);
  });

  it('probes and deletes the socket file a custom server address names, beside the fixed names', async () => {
    const fixture = makeMachineFixture();
    const dir = fs.realpathSync(makeTempDir('lane-residue-custom-'));
    for (const name of SERVER_FILES) writeFile(dir, name, '');
    const custom = writeFile(dir, 'custom.sock', '');
    writeFile(dir, 'notes.txt', 'not the model server\'s');
    const env = { ...fixture.env, HF_EMBED_SERVER_URL: `unix://${custom}` };

    const machine = await runMachineChecks(fixture.options, env, NO_PROCESSES);
    const report = await applyQuietly(fixture, {}, env);

    expect(findingById(machine, 'M4').items.map((item: Report) => path.basename(item.path)).sort()).toEqual([...SERVER_FILES, 'custom.sock'].sort());
    expect(actionsOf(report, 'deleted').map((action) => path.basename(action.target)).sort()).toEqual([...SERVER_FILES, 'custom.sock'].sort());
    expect(fs.readdirSync(dir)).toEqual(['notes.txt']);
    expect(report.exitCode).toBe(0);
  });

  it('probes no extra path for a TCP server address', async () => {
    const fixture = makeMachineFixture();

    const report = await runMachineChecks(fixture.options, { ...fixture.env, HF_EMBED_SERVER_URL: 'tcp://127.0.0.1:7777' }, NO_PROCESSES);

    expect(report.context.modelServerDirs).toEqual([{ files: [], path: fixture.socketDir, source: 'socket-dir' }]);
  });
});

// ───────────────────────────────────────────────────────────────────
// Apply mode
// ───────────────────────────────────────────────────────────────────

describe('advisor database copies', () => {
  const COPY = 'skill-graph.sqlite.pre-doctor-skill-advisor-rebuild.1.bak';

  it('finds a copy that holds a lane table and deletes it on apply', async () => {
    const fixture = makeMachineFixture();
    writeAdvisorDb(path.join(fixture.dbDir, 'skill-graph.sqlite'), { lane: false });
    writeAdvisorDb(path.join(fixture.dbDir, COPY), { lane: true });

    const machine = await runMachineChecks(fixture.options, fixture.env, NO_PROCESSES);
    expect(machine.exitCode).toBe(1);
    expect(findingById(machine, 'M3').items).toEqual([
      expect.objectContaining({ detail: expect.stringContaining('table vec_768'), kind: 'copy', path: path.join(fixture.dbDir, COPY) }),
    ]);

    const report = await applyQuietly(fixture);
    expect(actionsOf(report, 'deleted').map((action) => path.basename(action.target))).toEqual([COPY]);
    expect(fs.readdirSync(fixture.dbDir).sort()).toEqual(['skill-graph.sqlite']);
    expect(findingById(report.after, 'M3').status).toBe('absent');
    expect(report.exitCode).toBe(0);
  });

  // The rebuild copies a database in WAL mode. Opening that copy the usual way
  // would write its -wal and -shm files beside it, so the listing is compared too.
  it('leaves a copy of a database with no lane object alone, unreported and untouched', async () => {
    const fixture = makeMachineFixture();
    writeAdvisorDb(path.join(fixture.dbDir, 'skill-graph.sqlite'), { lane: false });
    const source = path.join(makeTempDir('lane-residue-wal-'), 'skill-graph.sqlite');
    const db = new DatabaseSync(source);
    db.exec('PRAGMA journal_mode=WAL; CREATE TABLE skill_nodes (id TEXT PRIMARY KEY, family TEXT);');
    db.close();
    fs.copyFileSync(source, path.join(fixture.dbDir, COPY));
    expect([...fs.readFileSync(path.join(fixture.dbDir, COPY)).subarray(18, 20)]).toEqual([2, 2]);
    const before = fs.readdirSync(fixture.dbDir).sort();

    const machine = await runMachineChecks(fixture.options, fixture.env, NO_PROCESSES);
    expect(findingById(machine, 'M3').status).toBe('absent');
    expect(machine.exitCode).toBe(0);

    const report = await applyQuietly(fixture);
    expect(report.actions.filter((action: Action) => action.target.includes(COPY))).toEqual([]);
    expect(report.exitCode).toBe(0);
    expect(fs.readdirSync(fixture.dbDir).sort()).toEqual(before);
  });
});

describe('apply mode', () => {
  /** Leftovers the cleanup owns (M1, M3, M4, M5), one unrelated sibling of each kind. */
  function plantLeftovers(fixture: MachineFixture): { cacheFolders: string[]; siblings: string[] } {
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
    return plantModelCache(fixture.root);
  }

  it('without a terminal deletes the owned leftovers, the model cache included, keeps the shared model and sends no DELETE', async () => {
    const fixture = makeMachineFixture();
    const { cacheFolders, siblings } = plantLeftovers(fixture);
    const ollama = await startFakeOllama([MODEL]);

    const report = await applyQuietly(fixture, { ollamaHost: ollama.host });

    // The kept model and the module folders a reinstall removes are still found, so the re-run exits 1.
    expect(report.exitCode).toBe(1);
    expect(findingById(report.before, 'M3').status).toBe('found');
    expect(findingById(report.before, 'M5').items.map((item: Report) => item.path)).toEqual(cacheFolders);
    expect(findingById(report.before, 'M6').items).toEqual([expect.objectContaining({ source: 'api' })]);

    expect(fs.readdirSync(fixture.dbDir).sort()).toEqual(['notes.txt', 'vectors']);
    expect(fs.readdirSync(path.join(fixture.dbDir, 'vectors'))).toEqual([]);
    const lanes = path.join(fixture.root, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/lanes');
    expect(fs.readdirSync(lanes)).toEqual(['lexical.js']);
    expect(fs.existsSync(path.join(fixture.root, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/embedders'))).toBe(false);
    expect(fs.existsSync(fixture.socketDir)).toBe(false);
    for (const folder of cacheFolders) expect(fs.existsSync(folder)).toBe(false);
    for (const sibling of siblings) expect(fs.existsSync(sibling)).toBe(true);

    expect(ollama.calls.some((call) => call.method === 'GET' && call.url === '/api/tags')).toBe(true);
    expect(deletesOf(ollama.calls)).toEqual([]);
    expect(actionsOf(report, 'kept')).toEqual([expect.objectContaining({ target: `${MODEL} on ${ollama.host}` })]);
    expect(findingById(report.after, 'M3').status).toBe('absent');
    expect(findingById(report.after, 'M4').status).toBe('absent');
    expect(findingById(report.after, 'M5').status).toBe('absent');
  });

  it.each([
    ['yes', true],
    ['no', false],
  ])('on a terminal answered %s, asks once and acts on the shared model only after a yes', async (_answer, approve) => {
    const fixture = makeMachineFixture();
    const { cacheFolders } = plantLeftovers(fixture);
    const ollama = await startFakeOllama([MODEL]);
    const questions: string[] = [];

    const report = await runApply(
      { ...fixture.options, ollamaHost: ollama.host },
      fixture.env,
      { confirm: async (question: string) => { questions.push(question); return approve; }, interactive: true, ...NO_PROCESSES },
    );

    expect(questions).toEqual([sharedModelQuestion(ollama.host)]);
    expect(deletesOf(ollama.calls)).toEqual(approve ? [{ body: JSON.stringify({ model: MODEL }), method: 'DELETE', url: '/api/delete' }] : []);
    // The model cache is this checkout's own copy, deleted whatever the answer.
    for (const folder of cacheFolders) expect(fs.existsSync(folder)).toBe(false);
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

describe('the shared-model answer for one apply run', () => {
  async function applyWithAnswer(sharedModel: string | undefined, interactive: boolean) {
    const fixture = makeMachineFixture();
    const ollama = await startFakeOllama([MODEL]);
    const questions: string[] = [];
    const report = await runApply(
      { ...fixture.options, ollamaHost: ollama.host, ...(sharedModel ? { sharedModel } : {}) },
      fixture.env,
      { confirm: async (question: string) => { questions.push(question); return true; }, interactive, ...NO_PROCESSES },
    );
    return { ollama, questions, report };
  }

  it('--shared-model delete sends exactly one DELETE and asks nothing', async () => {
    const { ollama, questions, report } = await applyWithAnswer('delete', true);

    expect(questions).toEqual([]);
    expect(deletesOf(ollama.calls)).toEqual([{ body: JSON.stringify({ model: MODEL }), method: 'DELETE', url: '/api/delete' }]);
    expect(actionsOf(report, 'deleted')).toEqual([{ action: 'deleted', target: `${MODEL} on ${ollama.host}` }]);
  });

  it('--shared-model keep on a terminal asks nothing and sends no DELETE', async () => {
    const { ollama, questions, report } = await applyWithAnswer('keep', true);

    expect(questions).toEqual([]);
    expect(deletesOf(ollama.calls)).toEqual([]);
    expect(actionsOf(report, 'kept')).toEqual([{ action: 'kept', reason: 'answered keep for this run', target: `${MODEL} on ${ollama.host}` }]);
  });

  it('with no answer and no terminal keeps the model with one kept action', async () => {
    const { ollama, questions, report } = await applyWithAnswer(undefined, false);

    expect(questions).toEqual([]);
    expect(deletesOf(ollama.calls)).toEqual([]);
    expect(actionsOf(report, 'kept')).toEqual([expect.objectContaining({ target: `${MODEL} on ${ollama.host}` })]);
    expect(report.exitCode).toBe(1);
  });

  it('reports the question it asks in askFirst, word for word', async () => {
    const fixture = makeMachineFixture();
    const ollama = await startFakeOllama([MODEL]);
    const questions: string[] = [];

    const report = await runApply(
      { ...fixture.options, ollamaHost: ollama.host },
      fixture.env,
      { confirm: async (question: string) => { questions.push(question); return false; }, interactive: true, ...NO_PROCESSES },
    );

    expect(report.askFirst).toEqual([{ check: 'M6', question: questions[0] }]);
  });

  it('refuses an answer that is neither delete nor keep before touching anything', async () => {
    const fixture = makeMachineFixture();
    await expect(runApply({ ...fixture.options, sharedModel: 'yes' }, fixture.env, { interactive: false, ...NO_PROCESSES }))
      .rejects.toThrow('--shared-model takes delete or keep, not yes');
  });
});

describe('a checkout that still holds a lane source', () => {
  it.each(LANE_SOURCES)('changes nothing while %s exists, then cleans once it is gone', async (source) => {
    const fixture = makeMachineFixture();
    writeAdvisorDb(path.join(fixture.dbDir, 'skill-graph.sqlite'), { lane: true });
    writeFile(fixture.dbDir, 'skill-graph.sqlite.1.bak', 'copy');
    writeFile(fixture.root, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/embedders/index.js', 'export {};\n');
    for (const name of SERVER_FILES) writeFile(fixture.socketDir, name, '');
    plantModelCache(fixture.root);
    plantLaneSource(fixture.root, source);
    const ollama = await startFakeOllama([MODEL]);
    const server = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 60000)'], { stdio: 'ignore' });
    children.add(server);
    const processes = [{ command: `node ${path.join(fixture.root, SERVER_SCRIPT)}`, pid: server.pid as number }];
    const before = listTree(fixture.home, fixture.root);
    const questions: string[] = [];

    const report = await runApply(
      { ...fixture.options, ollamaHost: ollama.host, sharedModel: 'delete' },
      fixture.env,
      { confirm: async (question: string) => { questions.push(question); return true; }, interactive: true, processes },
    );

    expect(listTree(fixture.home, fixture.root)).toEqual(before);
    expect(questions).toEqual([]);
    expect(deletesOf(ollama.calls)).toEqual([]);
    expect(report.askFirst).toEqual([]);
    expect(report.before.context.laneSources).toEqual([source]);
    expect(actionsOf(report, 'deleted')).toEqual([]);
    expect(actionsOf(report, 'stopped')).toEqual([]);
    expect(() => process.kill(server.pid as number, 0)).not.toThrow();
    const kept = actionsOf(report, 'kept');
    expect(kept.map((action) => action.target)).toEqual(expect.arrayContaining([`pid ${server.pid}`, `${MODEL} on ${ollama.host}`]));
    for (const action of kept) expect(action.reason).toContain(source);
    expect(report.exitCode).toBe(1);

    fs.rmSync(path.join(fixture.root, source), { force: true, recursive: true });
    const cleaned = await runApply({ ...fixture.options, ollamaHost: ollama.host, sharedModel: 'keep' }, fixture.env, { interactive: false, ...NO_PROCESSES });

    for (const id of ['M1', 'M3', 'M4', 'M5']) expect(findingById(cleaned.after, id).status).toBe('absent');
    expect(actionsOf(cleaned, 'deleted').length).toBeGreaterThan(0);
  });
});

describe('goal proofs on fixtures', () => {
  it('asks about the shared model on each of two runs and leaves the fixture as it found it', async () => {
    const fixture = makeMachineFixture();
    const ollama = await startFakeOllama([MODEL]);
    const before = listTree(fixture.home, fixture.root);
    const runs: string[][] = [];

    for (let run = 0; run < 2; run += 1) {
      const questions: string[] = [];
      await runApply(
        { ...fixture.options, ollamaHost: ollama.host },
        fixture.env,
        { confirm: async (question: string) => { questions.push(question); return false; }, interactive: true, ...NO_PROCESSES },
      );
      runs.push(questions);
    }

    expect(runs.map((questions) => questions.length)).toEqual([1, 1]);
    expect(runs[1][0]).toBe(runs[0][0]);
    expect(deletesOf(ollama.calls)).toEqual([]);
    const tags = await (await fetch(new URL('/api/tags', ollama.host))).json();
    expect(tags.models.map((model: { name: string }) => model.name)).toContain(MODEL);
    expect(listTree(fixture.home, fixture.root)).toEqual(before);
  });

  it('cleans a fixture with every owned leftover to exit 0 once a reinstall removes the module folders', async () => {
    const fixture = makeMachineFixture();
    writeAdvisorDb(path.join(fixture.dbDir, 'skill-graph.sqlite'), { lane: true });
    writeFile(fixture.dbDir, 'skill-graph.sqlite.pre-doctor-skill-advisor-rebuild.1.bak', 'copy');
    writeFile(fixture.root, '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/lanes/semantic-shadow.js', 'export {};\n');
    for (const name of SERVER_FILES) writeFile(fixture.socketDir, name, '');
    plantModelCache(fixture.root);
    for (const pkg of PACKAGE_ROOTS) writeFile(fixture.root, `${pkg}/node_modules/onnxruntime-node/package.json`, '{}');
    const ollama = await startFakeOllama([MODEL], { dropOnDelete: true });
    const options = { ...fixture.options, ollamaHost: ollama.host };

    const report = await runApply({ ...options, sharedModel: 'delete' }, fixture.env, { interactive: false, ...NO_PROCESSES });

    const foundIds = (machine: Report) => machine.findings.filter((entry: Report) => entry.status === 'found').map((entry: Report) => entry.id);
    expect(foundIds(report.before)).toEqual(['M1', 'M2', 'M3', 'M4', 'M5', 'M6']);
    expect(report.exitCode).toBe(1);
    expect(foundIds(report.after)).toEqual(['M2']);

    // What `npm ci` with the lockfiles that dropped the dependency removes.
    for (const pkg of PACKAGE_ROOTS) {
      fs.rmSync(path.join(fixture.root, pkg, 'node_modules', '@huggingface'), { recursive: true });
      fs.rmSync(path.join(fixture.root, pkg, 'node_modules', 'onnxruntime-node'), { recursive: true });
    }
    const final = await runMachineChecks(options, fixture.env, NO_PROCESSES);
    expect(final.exitCode).toBe(0);
  });

  it('exits 0 as a spawned process on a clean fixture whose socket path is never created', () => {
    const fixture = makeSpawnFixture();
    const args = [
      'machine',
      '--root', fixture.root,
      '--db-dir', fixture.dbDir,
      '--ollama-host', CLOSED_OLLAMA_HOST,
      '--socket-dir', fixture.socketDir,
    ];
    for (const value of [fixture.root, fixture.dbDir, fixture.socketDir, fixture.env.HOME as string]) expect(isInside(fixture.base, value)).toBe(true);
    expectFixtureOnlyEnv(fixture);

    const run = runCli(args, fixture.env);

    expect(run.stdout).toContain('result      : exit 0 (nothing left)');
    expect(run.status).toBe(0);
    expect(fs.existsSync(fixture.socketDir)).toBe(false);
  }, 30000);

  // A real terminal, not an injected confirm: python3 opens a pseudo-terminal
  // with os.openpty, gives the child its slave end as stdin and stderr, answers
  // n at each prompt, and kills the child at a deadline. pty.spawn is not used:
  // under Python 3.9 with a piped stdin it never returned after the child exited.
  const PTY_DRIVER = [
    'import os, select, subprocess, sys, time',
    'master, slave = os.openpty()',
    'child = subprocess.Popen(sys.argv[1:], stdin=slave, stdout=subprocess.PIPE, stderr=slave, close_fds=True)',
    'os.close(slave)',
    'deadline = time.monotonic() + 20',
    'screen, out, answers = b"", b"", 0',
    'fds = [master, child.stdout.fileno()]',
    'while fds:',
    '    if time.monotonic() > deadline:',
    '        child.kill()',
    '        child.wait()',
    '        sys.stderr.write("deadline\\n")',
    '        sys.exit(124)',
    '    ready, _, _ = select.select(fds, [], [], 0.1)',
    '    for fd in ready:',
    '        try:',
    '            data = os.read(fd, 65536)',
    '        except OSError:',
    '            data = b""',
    '        if not data:',
    '            fds.remove(fd)',
    '        elif fd == master:',
    '            screen += data',
    '            if b"[y/N]" in screen:',
    '                os.write(master, b"n\\r")',
    '                answers += 1',
    '                screen = b""',
    '        else:',
    '            out += data',
    '    if child.poll() is not None and child.stdout.fileno() not in fds:',
    '        break',
    'code = child.wait()',
    'sys.stdout.buffer.write(out)',
    'sys.stderr.write("answers=%d\\n" % answers)',
    'sys.exit(code)',
  ].join('\n');
  const HAS_PYTHON = spawnSync('python3', ['--version'], { encoding: 'utf8' }).status === 0;

  function runOnTerminal(args: string[], env: NodeJS.ProcessEnv): Promise<RunResult> {
    return new Promise((resolve) => {
      const driver = spawn('python3', ['-c', PTY_DRIVER, process.execPath, SCRIPT_PATH, ...args], { env, stdio: ['ignore', 'pipe', 'pipe'] });
      children.add(driver);
      let stdout = '';
      let stderr = '';
      driver.stdout.setEncoding('utf8').on('data', (chunk) => { stdout += chunk; });
      driver.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });
      driver.on('close', (status) => resolve({ status, stderr, stdout }));
    });
  }

  it.skipIf(!HAS_PYTHON)('asks on a real terminal on each of two runs and keeps the model after each no', async () => {
    const fixture = makeSpawnFixture();
    const ollama = await startFakeOllama([MODEL]);
    const args = [
      'apply', '--json',
      '--root', fixture.root,
      '--db-dir', fixture.dbDir,
      '--socket-dir', fixture.socketDir,
      '--ollama-host', ollama.host,
    ];
    // Every location the child could delete under sits in the fixture folder,
    // and no variable can add a real folder beside them.
    for (const flag of ['--root', '--db-dir', '--socket-dir', '--ollama-host']) expect(args).toContain(flag);
    for (const flag of ['--root', '--db-dir', '--socket-dir']) expect(isInside(fixture.base, args[args.indexOf(flag) + 1])).toBe(true);
    expect(isInside(fixture.base, fixture.env.HOME as string)).toBe(true);
    expect(args[args.indexOf('--ollama-host') + 1]).toBe(ollama.host);
    expectFixtureOnlyEnv(fixture);

    for (let run = 0; run < 2; run += 1) {
      const result = await runOnTerminal(args, fixture.env);
      expect(result.stderr).toContain('answers=1');
      expect(result.status).toBe(1);
      const report = JSON.parse(result.stdout);
      expect(report.interactive).toBe(true);
      expect(actionsOf(report, 'kept')).toEqual([{ action: 'kept', reason: 'answered no', target: `${MODEL} on ${ollama.host}` }]);
    }
    expect(deletesOf(ollama.calls)).toEqual([]);
  }, 60000);
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
