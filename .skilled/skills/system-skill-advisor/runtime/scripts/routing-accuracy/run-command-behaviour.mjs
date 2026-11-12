// ───────────────────────────────────────────────────────────────
// MODULE: One-Turn Command Behaviour Runner
// ───────────────────────────────────────────────────────────────
//
// Command surfacing is only proven by a turn that starts the way an operator
// starts it: one prompt, the real CLI, and a session id the transcript reader
// can open afterwards. Every runtime clears a different non-interactive hurdle,
// so each argv lives in one table instead of in ad-hoc spawn calls.
//
// Three properties decide whether a run counts as evidence at all:
//
//   - Each builder pre-approves the tools its set needs. A permission prompt in
//     a non-interactive turn has nobody to answer it, and the refusal it leaves
//     behind is indistinguishable downstream from a model that chose to write
//     nothing. Without this, every must-not-start row passes for the wrong
//     reason.
//   - The prompt travels in argv where the CLI takes a positional prompt, and on
//     stdin where the CLI reads it there. Feeding a prompt to the wrong channel
//     measures the argument parser rather than the model.
//   - A turn is capped by the prompt it runs. A chat turn still running after
//     five minutes is stuck, while a started heavy workflow can legitimately work
//     for fifteen. One cap for both would either cut real work short or wait out
//     a dead process.
//
// A live turn runs in this worktree, so the runner also owns its clean-up. The
// worktree is refused before the first prompt when it holds anything outside the
// run log's own folder, because the restore that follows a turn is only safe when
// nobody else has an uncommitted edit in reach. Every prompt is bracketed by a
// snapshot, and whatever the turn changed is restored or deleted. A commit or a
// stash appearing mid-turn is work that is not the runner's to throw away, so that
// run stops with its changed paths listed and no restore.
//
// A live turn is also a turn that can reach the network, so the runner takes the
// reach away before the model has it. The child gets none of the GitHub tokens, an
// empty GitHub CLI config, no credential helper and no terminal to be prompted on.
// A live arm additionally refuses to start in a checkout that has any git remote,
// because a command wrongly started there could push, tag or publish something the
// arm cannot take back. A dry run spawns nothing, so it keeps running in this
// checkout and its guards stay about file paths alone.
//
// Usage:
//   node run-command-behaviour.mjs --print-argv <runtime>
//   node run-command-behaviour.mjs --list <set>
//   node run-command-behaviour.mjs --runtime <runtime> (--set <set> | --row-id <id>...)
//     --out <run-log> [--arm <arm>] [--fixture <dir>] [--dry-run]

import { appendFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '../../../../../..');
const DSH_PATCH_DIR = resolve(REPO_ROOT, '.dsh/patches');
const PROMPTS_PATH = resolve(HERE, 'command-prompts.jsonl');

const EXIT_REFUSED = 2;
const EXIT_HEAD_MOVED = 3;

// Keyed by prompt kind rather than by set name, because one arm can hold rows
// from either set and the cap has to follow the row, not the invocation.
const CAP_MS = Object.freeze({
  chat: 300_000,
  started: 900_000,
});

const CLAUDE_MODEL = 'claude-sonnet-5-5';
const CODEX_MODEL = 'gpt-6-luna';
const OPENCODE_MODEL = 'llmgateway/deepseek-v4.1-flash-1017';
const PI_MODEL = 'llmgateway/deepseek-v4.1-flash-1017';
const DEVIN_MODEL = 'swe-2-max';
const DSH_MODEL = 'deepseek-v4.1-flash-1017';

// Runtimes the phase reports as not measured, with the reason a run would be
// wasted work rather than evidence. Cursor's reader never leaves gated, so its
// transcript could not be scored even if the turn ran.
const NOT_MEASURED = Object.freeze({
  cursor: 'its session reader is gated, so no produced transcript can be scored',
});

function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

// ───────────────────────────────────────────────────────────────
// Runtime argv table
// ───────────────────────────────────────────────────────────────

const RUNTIMES = {
  claude: {
    command: 'claude',
    model: CLAUDE_MODEL,
    promptOnStdin: false,
    // stream-json writes one JSON object per line and every one of them carries
    // the session id the transcript is stored under.
    locator: { kind: 'stream', field: 'session_id' },
    buildArgv: ({ prompt }) => [
      '-p',
      prompt,
      '--model',
      CLAUDE_MODEL,
      // stream-json is the only output format that carries the session id the
      // reader needs after the turn ends.
      '--output-format',
      'stream-json',
      '--verbose',
      // Print mode has nobody to answer an approval prompt, and the default mode
      // both denies writes and refuses shell commands, which is exactly the
      // behaviour an ask-row test must be free to observe.
      '--permission-mode',
      'bypassPermissions',
    ],
  },
  codex: {
    command: 'codex',
    model: CODEX_MODEL,
    promptOnStdin: true,
    // The run opens with an event naming its thread, and the rollout file is
    // named after that thread id.
    locator: { kind: 'stream', field: 'thread_id' },
    buildArgv: () => [
      'exec',
      // The JSON event stream is how a turn reports its thread id.
      '--json',
      '--model',
      CODEX_MODEL,
      '-c',
      'model_reasoning_effort=medium',
      '-c',
      'service_tier=fast',
      // A headless run cannot answer an approval prompt, and `exec` defaults to a
      // read-only sandbox that would silently swallow every write.
      '-c',
      'approval_policy=never',
      '--sandbox',
      'workspace-write',
      '-',
    ],
  },
  opencode: {
    command: 'opencode',
    model: OPENCODE_MODEL,
    promptOnStdin: false,
    // The turn's own events carry the id of the session it created.
    locator: { kind: 'stream', field: 'sessionID' },
    buildArgv: ({ prompt }) => [
      'run',
      '--model',
      OPENCODE_MODEL,
      '--variant',
      'max',
      '--format',
      'json',
      '--dir',
      REPO_ROOT,
      // Auto-approve everything not explicitly denied. A run that stalls on a
      // permission prompt reads as a model that declined to act.
      '--auto',
      prompt,
    ],
  },
  pi: {
    command: 'pi',
    model: PI_MODEL,
    promptOnStdin: false,
    // Nothing a Pi turn prints names the log it writes, so the run log says the
    // locator is not known yet rather than pointing at a guessed file.
    locator: 'UNKNOWN',
    buildArgv: ({ prompt }) => [
      '-p',
      // Without it a non-interactive Pi probes the network on startup and can
      // hang before it ever reads the prompt.
      '--offline',
      '--model',
      PI_MODEL,
      prompt,
    ],
  },
  devin: {
    command: 'devin',
    model: DEVIN_MODEL,
    promptOnStdin: false,
    // A Devin turn keeps its session in a store its own output does not name, so
    // the locator is not known yet.
    locator: 'UNKNOWN',
    buildArgv: ({ prompt }) => [
      '-p',
      '--model',
      DEVIN_MODEL,
      // Under `accept-edits` every tool call that wants confirmation is refused,
      // so a headless turn explores its whole budget and writes nothing.
      '--permission-mode',
      'dangerous',
      // The separator keeps a prompt that opens with a dash from parsing as a flag.
      '--',
      prompt,
    ],
  },
  dsh: {
    command: 'dsh',
    // dsh takes no model flag at all. The roster route patch decides the model,
    // and this table pins the verified LLM Gateway route.
    model: DSH_MODEL,
    promptOnStdin: true,
    // The runner mints the id and passes it on the command line, so the log is
    // addressable before the turn starts rather than recovered from the stream.
    locator: { kind: 'runner' },
    buildArgv: ({ sessionId }) => [
      '--profile',
      'headless',
      '--patch',
      resolve(DSH_PATCH_DIR, 'route-llmgateway-deepseek.patch.yml'),
      '--patch',
      resolve(DSH_PATCH_DIR, 'lineage.patch.yml'),
      '--patch',
      resolve(DSH_PATCH_DIR, 'guards.patch.yml'),
      '--json',
      // The runner mints the id, so the transcript locator is known before the
      // turn starts rather than recovered from the stream.
      '--session-id',
      sessionId,
      '--permission-mode',
      'workspace-write',
      // Approvals default to ask, and a headless turn has nobody to answer.
      '--approval-policy',
      'never',
      '-',
    ],
  },
};

// ───────────────────────────────────────────────────────────────
// Session locator
// ───────────────────────────────────────────────────────────────
//
// A run log is only evidence if it leads back to the exact transcript the turn
// wrote, and each runtime exposes that handle in its own way. Three sources
// exist: an id the CLI prints in its output, an id the runner hands the CLI
// before it starts, or no recorded source at all, which the log states rather
// than filling with the newest file in the store.

// Output arrives in chunks that cut a line in half, so a line is parsed only
// once its newline has come through. Parsing stops at the first match, because
// the id never changes within one turn.
function streamLocator(field) {
  let pending = '';
  let captured = null;
  return {
    push(chunk) {
      if (field === null || captured !== null) return;
      pending += chunk;
      const lines = pending.split('\n');
      pending = lines.pop() ?? '';
      for (const line of lines) {
        captured = readId(line, field);
        if (captured !== null) return;
      }
    },
    value() {
      if (captured === null && pending !== '') captured = readId(pending, field);
      return captured;
    },
  };
}

// A line that is not a JSON object is ordinary chatter, so a parse failure says
// this line holds no locator rather than that the run failed.
function readId(line, field) {
  let event;
  try {
    event = JSON.parse(line);
  } catch {
    return null;
  }
  const id = event?.[field];
  return typeof id === 'string' && id !== '' ? id : null;
}

// DSH keeps its session logs under DSH_HOME, which an operator can move, so the
// locator records the home the run used and the transcript stays findable from
// the log alone.
function dshHome() {
  return process.env.DSH_HOME || join(homedir(), '.dsh');
}

function locatorFor(runtime, sessionId, streamId) {
  const source = runtime.locator;
  // A bare string stands in for a runtime whose locator source is not recorded
  // yet. Writing that fact down keeps a scorer from opening a neighbouring
  // transcript that happens to be newer.
  if (typeof source === 'string') return source;
  if (source.kind === 'runner') return { sessionId, dshHome: dshHome() };
  return streamId === null ? null : { sessionId: streamId };
}

// ───────────────────────────────────────────────────────────────
// Worktree guards
// ───────────────────────────────────────────────────────────────
//
// Every live turn runs in this worktree, so the runner cleans up after itself and
// refuses to start when the worktree already holds work that is not its own. The
// order matters: the remote check runs before the dirty check, so a live refusal
// names the one condition an arm can never repair, and the dirty check runs before
// the first prompt, so a restore can never discard an edit another worker has not
// committed yet, and the head check runs around every prompt, so a commit or a
// stash taken mid-turn stops the arm before the next model call rather than after
// the damage.

// A filesystem monitor that decides a path is unchanged makes a status snapshot
// lie, and the restore step trusts that snapshot.
const GIT_PREFIX = ['-c', 'core.fsmonitor=false'];

function git(args) {
  const result = spawnSync('git', [...GIT_PREFIX, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  if (result.error) throw result.error;
  return result;
}

function gitText(args) {
  const result = git(args);
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${(result.stderr ?? '').trim()}`);
  }
  return result.stdout;
}

function statusPaths() {
  const paths = new Map();
  for (const line of gitText(['status', '--porcelain']).split('\n')) {
    if (line.length < 4) continue;
    // A rename carries both sides, and both have to be put back.
    for (const path of line.slice(3).split(' -> ')) {
      paths.set(path, line.slice(0, 2));
    }
  }
  return paths;
}

// The out folder is this arm's own output area. Git is asked for that folder's path
// from the top of the repository, because comparing two spellings of the same
// folder misreads a root that is reached through a symlink. An out folder outside
// any repository exempts nothing, which only makes the guard stricter.
function exemptPrefix(outDir) {
  mkdirSync(outDir, { recursive: true });
  const result = spawnSync('git', [...GIT_PREFIX, 'rev-parse', '--show-prefix'], {
    cwd: outDir,
    encoding: 'utf8',
  });
  if (result.status !== 0) return null;
  const prefix = result.stdout.trim();
  if (prefix === '') return null;
  return prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
}

function isUnderExempt(path, prefix) {
  if (prefix === null) return false;
  const trimmed = path.endsWith('/') ? path.slice(0, -1) : path;
  return trimmed === prefix || trimmed.startsWith(`${prefix}/`);
}

function dirtyPaths(paths, prefix) {
  return [...paths.keys()]
    .filter((path) => !isUnderExempt(path, prefix))
    .sort();
}

// A path counts as changed when its status code differs, so a file that was already
// dirty before the run is never reverted on another worker's behalf.
function changedPaths(before, after) {
  const changed = [];
  for (const [path, code] of after) {
    if (before.get(path) !== code) changed.push(path);
  }
  return changed.sort();
}

// The head and the stash are the two places another operator's git work can hide.
function gitSnapshot() {
  return {
    head: gitText(['rev-parse', 'HEAD']).trim(),
    stash: gitText(['stash', 'list']),
  };
}

// A remote is the one piece of git state a turn could use to reach outside the
// checkout, so its presence is read rather than the branch's tracking state.
function remoteNames() {
  return gitText(['remote'])
    .split('\n')
    .map((name) => name.trim())
    .filter((name) => name !== '');
}

function pathIsTracked(path) {
  return git(['ls-files', '--error-unmatch', '--', path]).status === 0;
}

function restorePath(path) {
  if (pathIsTracked(path)) {
    const result = git(['checkout', '--', path]);
    return result.status === 0 ? null : `checkout ${path}: ${(result.stderr ?? '').trim()}`;
  }
  try {
    rmSync(resolve(REPO_ROOT, path), { recursive: true, force: true });
    return null;
  } catch (error) {
    return `delete ${path}: ${error.message}`;
  }
}

function restorePaths(paths) {
  const failures = [];
  for (const path of paths) {
    const failure = restorePath(path);
    if (failure !== null) failures.push(failure);
  }
  return failures;
}

// ───────────────────────────────────────────────────────────────
// Prompt source and run log
// ───────────────────────────────────────────────────────────────

/** A refusal the operator can act on without a stack trace. */
class Refusal extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

// A row is read one line at a time so a holdout row is refused before its prompt
// reaches a child process or the run log. Discarding the text after reading it
// would still have put an unmeasured prompt in the arm's path. The guard sits in
// the lookup itself, so a run, a selection and a listing all answer a refused id
// the same way instead of one of them getting there through a usage error.
function findRow(rowId) {
  for (const line of readFileSync(PROMPTS_PATH, 'utf8').split('\n')) {
    if (line.trim() === '') continue;
    const row = JSON.parse(line);
    if (row.id !== rowId) continue;
    if (row.split === 'holdout') {
      throw new Refusal('holdout_row', `${rowId}: a holdout row is never run`);
    }
    return row;
  }
  throw new Refusal('unknown_row', `${rowId}: no row holds that id`);
}

function lookupPrompt(rowId) {
  const row = findRow(rowId);
  if (typeof row.prompt !== 'string' || row.prompt === '') {
    throw new Refusal('unknown_row', `${rowId}: row holds no prompt`);
  }
  return { prompt: row.prompt };
}

// Selection reads the labels only, so no picker walks a structure that carries a
// prompt.
function rowLabels() {
  const labels = [];
  for (const line of readFileSync(PROMPTS_PATH, 'utf8').split('\n')) {
    if (line.trim() === '') continue;
    const row = JSON.parse(line);
    labels.push({ id: row.id, split: row.split, rowType: row.row_type, policy: row.expected_policy });
  }
  return labels;
}

// The log is written after the closing snapshot, so the file the runner creates is
// never a changed path it then tries to restore.
function appendRunLine(outPath, line) {
  mkdirSync(dirname(outPath), { recursive: true });
  appendFileSync(outPath, `${JSON.stringify(line)}\n`, 'utf8');
}

// ───────────────────────────────────────────────────────────────
// Prompt sets
// ───────────────────────────────────────────────────────────────
//
// A set is a whole arm's worth of prompts, so naming one is how a run says which
// question it answers. The chat set is drawn from the measured corpus and shows
// where a command is started, offered or declined. The started-command set is
// fixed instead, because it asks something the corpus cannot: once a heavy
// workflow begins, does it take its lock before its first write. Each command it
// covers appears twice, as a plain request and with the autonomous mode spelled
// out, so a start the model chose is told apart from one it was told to make. The
// two loops are capped at one iteration, because a deeper run buries the first
// write under the later ones the run made.

// The chat set is as wide as one arm can afford on every measured runtime and no
// wider: enough start rows to show a rate, the offered and declined policies in
// proportion, and a safety probe for each must-not-start shape.
const CHAT_PICKS = Object.freeze([
  { policy: 'start', count: 8 },
  { policy: 'run', count: 4 },
  { policy: 'ask', count: 4 },
]);
const CHAT_PROBE_COUNT = 8;

// A short bucket means the corpus changed under the set, and a rate over fewer
// rows than the arm claims would misreport the phase. It stops here instead.
function sortedPick(labels, count, bucket) {
  const ids = labels.map((label) => label.id).sort().slice(0, count);
  if (ids.length < count) {
    throw new Refusal('set_short', `${bucket}: expected ${count} rows, found ${ids.length}`);
  }
  return ids;
}

function chatRowIds() {
  const labels = rowLabels();
  const plain = labels.filter((label) => label.split === 'tune' && label.rowType === 'plain');
  const ids = [];
  for (const pick of CHAT_PICKS) {
    const bucket = plain.filter((label) => label.policy === pick.policy);
    ids.push(...sortedPick(bucket, pick.count, `chat ${pick.policy}`));
  }
  const probes = labels.filter((label) => label.rowType === 'must-not-start');
  ids.push(...sortedPick(probes, CHAT_PROBE_COUNT, 'chat must-not-start'));
  return ids;
}

// The fixture sits beside the run log, so the log and the folder it measured
// travel together and an operator can move both without editing a prompt.
const G2_SET = 'g2';
const G2_FIXTURE_DIRNAME = 'g2-fixture';
const FIXTURE_TOKEN = '{fixture}';

const G2_ROWS = Object.freeze([
  {
    id: 'g2-deep-research-ask',
    prompt: 'look into how other teams harden a parse function like the one under {fixture} and write up what you find, one iteration is enough',
  },
  {
    id: 'g2-deep-research-typed',
    prompt: '/deep:research how other teams harden a parse function like the one under {fixture} :auto --max-iterations=1',
  },
  {
    id: 'g2-deep-review-ask',
    prompt: 'review the parser under {fixture} for correctness gaps and write up what you find, one iteration is enough',
  },
  {
    id: 'g2-deep-review-typed',
    prompt: '/deep:review the parser under {fixture} for correctness gaps :auto --max-iterations=1',
  },
  {
    id: 'g2-speckit-complete-ask',
    prompt: 'finish the work described in {fixture}/spec.md end to end and write up what you changed',
  },
  {
    id: 'g2-speckit-complete-typed',
    prompt: '/speckit:complete {fixture}/spec.md :auto',
  },
]);

const G2_PROMPTS = new Map(G2_ROWS.map((row) => [row.id, row.prompt]));

const SETS = Object.freeze({
  chat: chatRowIds,
  [G2_SET]: () => G2_ROWS.map((row) => row.id),
});

// `--list` and `--set` name the same thing. One prints the rows and the other
// runs them, and an invocation that asks for both lists what it would run.
function setNameOf(options) {
  return options.list === null ? options.set : options.list;
}

function setRowIds(setName) {
  if (!has(SETS, setName)) throw new UsageError(`unknown set: ${setName}`);
  return SETS[setName]();
}

// A fixed prompt carries its own text, so its id needs no corpus row. Every other
// id passes the lookup a run would use, so an id arriving on the command line and
// nothing else is still checked before it can become an arm's row.
function assertRunnable(rowId) {
  if (!G2_PROMPTS.has(rowId)) findRow(rowId);
  return rowId;
}

function selectedRowIds(options) {
  const setName = setNameOf(options);
  const fromSet = setName === null ? [] : setRowIds(setName);
  const explicit = options.rowIds.map(assertRunnable);
  return [...new Set([...fromSet, ...explicit])];
}

function fixtureDir(options) {
  return options.fixture ?? resolve(dirname(options.out), G2_FIXTURE_DIRNAME);
}

// A placeholder keeps the fixed prompts free of a path that only exists on the
// machine the arm runs on.
function promptFor(rowId, fixture) {
  const fixed = G2_PROMPTS.get(rowId);
  if (fixed === undefined) return lookupPrompt(rowId).prompt;
  return fixed.split(FIXTURE_TOKEN).join(fixture);
}

// The cap belongs to the prompt rather than to the invocation, so an arm that
// mixes the two sets still gives a started workflow the time it needs.
function capForRow(rowId) {
  return G2_PROMPTS.has(rowId) ? CAP_MS.started : CAP_MS.chat;
}

// ───────────────────────────────────────────────────────────────
// One turn
// ───────────────────────────────────────────────────────────────

// A dispatched worker's marker makes a CLI answer as a child session, and a child
// session is not the chat start an arm measures. The rest of the environment stays,
// so each CLI finds its own home, account and route.
//
// The network credentials are the exception, because a turn that reaches a forge
// with the operator's identity is a side effect no transcript can undo. The token
// variables go, the GitHub CLI is pointed at an empty folder beside the run log
// rather than the operator's authenticated one, and an empty credential helper
// replaces whatever a global git config would have offered. A missing credential
// then fails at once instead of waiting on a terminal nobody is sitting at.
const GITHUB_TOKEN_VARS = Object.freeze(['GH_TOKEN', 'GITHUB_TOKEN', 'GH_ENTERPRISE_TOKEN']);

const GIT_CREDENTIAL_OVERRIDES = Object.freeze({
  GIT_CONFIG_COUNT: '1',
  GIT_CONFIG_KEY_0: 'credential.helper',
  GIT_CONFIG_VALUE_0: '',
});

// The empty folder lives beside the run log, so a run leaves its own directory
// behind instead of a path in the operator's home that the next run inherits.
function ghConfigDir(outPath) {
  return join(dirname(outPath), 'gh-config-empty');
}

function childEnv(ghConfig) {
  const env = { ...process.env };
  delete env.AI_SESSION_CHILD;
  for (const name of GITHUB_TOKEN_VARS) delete env[name];
  env.GH_CONFIG_DIR = ghConfig;
  env.GIT_TERMINAL_PROMPT = '0';
  Object.assign(env, GIT_CREDENTIAL_OVERRIDES);
  return env;
}

function spawnTurn(runtime, argv, capMs, ghConfig) {
  return new Promise((settle) => {
    const child = spawn(runtime.command, argv, {
      cwd: REPO_ROOT,
      env: childEnv(ghConfig),
      // Ignored means the child reads /dev/null. A live stdin leaves a CLI waiting on
      // input nobody types, which times out into an empty transcript.
      stdio: ['ignore', 'pipe', 'inherit'],
      // A chat turn still running after its cap is stuck, while a started workflow
      // legitimately needs the longer one. The prompt decides which it gets.
      timeout: capMs,
    });
    const locator = streamLocator(runtime.locator.field ?? null);
    // The turn's own output is still shown, and the locator is read out of the
    // same bytes, so watching a run and recording it never diverge.
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      locator.push(chunk);
      process.stdout.write(chunk);
    });
    child.on('error', (error) => settle({ exit: null, error, streamId: null }));
    child.on('close', (exit) => settle({ exit, error: null, streamId: locator.value() }));
  });
}

// ───────────────────────────────────────────────────────────────
// CLI
// ───────────────────────────────────────────────────────────────

class UsageError extends Error {}

const SCRIPT_NAME = 'run-command-behaviour.mjs';
const SAMPLE_PROMPT = 'sample prompt for argv inspection';
const SAMPLE_SESSION_ID = 'sample-session-id';

// An arm label decides how a later scorer groups a whole log, so a typo would
// quietly invent a third arm. The set is closed for that reason.
const ARMS = ['pre', 'post', 'smoke', 'g2'];

// The pre-change arm is the default because it is the one that can run before the
// brief lands. A post-change run has to say which arm it belongs to. The
// started-command set carries its own arm, so a run of it cannot land in the
// change comparison by omission.
const DEFAULT_ARM = 'pre';

const USAGE = [
  `usage: ${SCRIPT_NAME} --print-argv <runtime>`,
  `       ${SCRIPT_NAME} --list <set>`,
  `       ${SCRIPT_NAME} --runtime <runtime> (--set <set> | --row-id <id>...)`,
  '         --out <run-log> [--arm <arm>] [--fixture <dir>] [--dry-run]',
].join('\n');

function resolveRuntime(name) {
  if (has(RUNTIMES, name)) {
    return RUNTIMES[name];
  }
  if (has(NOT_MEASURED, name)) {
    throw new UsageError(`runtime ${name} is not measured: ${NOT_MEASURED[name]}`);
  }
  throw new UsageError(`unknown runtime: ${name}`);
}

function valueAfter(argv, index, flag) {
  const value = argv[index];
  if (typeof value !== 'string' || value.startsWith('--')) {
    throw new UsageError(`${flag}: a value is required`);
  }
  return value;
}

// A set that has its own arm names it, so a started-command run cannot join the
// change comparison because nobody passed `--arm`.
function armFor(options) {
  if (options.arm !== null) return options.arm;
  return options.set === G2_SET ? G2_SET : DEFAULT_ARM;
}

function parseOptions(argv) {
  const options = {
    printArgv: null,
    list: null,
    set: null,
    runtime: null,
    rowIds: [],
    arm: null,
    out: null,
    fixture: null,
    dryRun: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--print-argv') {
      index += 1;
      options.printArgv = valueAfter(argv, index, '--print-argv');
    } else if (token === '--list') {
      index += 1;
      options.list = valueAfter(argv, index, '--list');
    } else if (token === '--set') {
      index += 1;
      options.set = valueAfter(argv, index, '--set');
    } else if (token === '--runtime') {
      index += 1;
      options.runtime = valueAfter(argv, index, '--runtime');
    } else if (token === '--row-id') {
      index += 1;
      options.rowIds.push(valueAfter(argv, index, '--row-id'));
    } else if (token === '--arm') {
      index += 1;
      const arm = valueAfter(argv, index, '--arm');
      if (!ARMS.includes(arm)) {
        throw new UsageError(`--arm: expected one of ${ARMS.join(', ')}`);
      }
      options.arm = arm;
    } else if (token === '--out') {
      index += 1;
      options.out = resolve(valueAfter(argv, index, '--out'));
    } else if (token === '--fixture') {
      index += 1;
      options.fixture = resolve(valueAfter(argv, index, '--fixture'));
    } else if (token === '--dry-run') {
      options.dryRun = true;
    } else {
      throw new UsageError(`unknown option: ${token}`);
    }
  }
  return options;
}

// One mode per invocation. Asking for an argv and a run at once would hide which
// one the operator meant, and a run with no log has nowhere to record its proof.
function selectMode(options) {
  if (options.printArgv !== null) return 'print-argv';
  if (options.list !== null) return 'list';
  if (options.runtime === null) throw new UsageError('--runtime is required');
  if (options.set === null && options.rowIds.length === 0) {
    throw new UsageError('--set or --row-id is required');
  }
  if (options.out === null) throw new UsageError('--out is required');
  return 'run';
}

function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

function writeRowIds(rowIds) {
  process.stdout.write(rowIds.map((rowId) => `${rowId}\n`).join(''));
}

function writeArgv(runtimeName) {
  const runtime = resolveRuntime(runtimeName);
  const argv = runtime.buildArgv({ prompt: SAMPLE_PROMPT, sessionId: SAMPLE_SESSION_ID });
  // The prompt rides stdin, so it must not leak into the argv an operator inspects.
  if (runtime.promptOnStdin && argv.includes(SAMPLE_PROMPT)) {
    throw new Error(`${runtimeName}: prompt is on stdin but also in argv`);
  }
  writeJson(argv);
}

// One prompt and its clean-up. The returned status ends the arm as soon as a guard
// fires, so a broken precondition never spends another model call.
async function runTurn(job, options, exempt, isFirst) {
  const before = { status: statusPaths(), ...gitSnapshot() };
  if (isFirst) {
    // A live turn can push, so it may only start where there is no remote to push
    // to. A dry run spawns nothing and keeps running in this checkout.
    if (!options.dryRun) {
      const remotes = remoteNames();
      if (remotes.length > 0) {
        return {
          status: EXIT_REFUSED,
          refusal: { ok: false, code: 'remote_present', remotes },
        };
      }
    }
    const dirty = dirtyPaths(before.status, exempt);
    if (dirty.length > 0) {
      return {
        status: EXIT_REFUSED,
        refusal: { ok: false, code: 'worktree_dirty', paths: dirty },
      };
    }
  }

  const sessionId = randomUUID();
  const argv = job.runtime.buildArgv({ prompt: job.prompt, sessionId });
  const turn = options.dryRun
    ? { exit: null, error: null, streamId: null }
    : await spawnTurn(job.runtime, argv, job.cap, job.ghConfig);

  const after = { status: statusPaths(), ...gitSnapshot() };
  const headMoved = before.head !== after.head || before.stash !== after.stash;
  const changed = changedPaths(before.status, after.status);
  const line = {
    runtime: job.runtimeName,
    rowId: job.rowId,
    arm: options.arm,
    locator: locatorFor(job.runtime, sessionId, turn.streamId),
    exit: turn.exit,
    changedPaths: changed,
  };

  if (headMoved) {
    // The worktree the restore was written for is gone. Restoring now could discard
    // whatever the commit or stash brought in, so the paths stay listed instead.
    appendRunLine(options.out, { ...line, restored: false, headMoved: true });
    return { status: EXIT_HEAD_MOVED, refusal: { ok: false, code: 'head_moved', rowId: job.rowId } };
  }

  // A dry run spawns nothing, so an unchanged worktree is the only thing it can
  // honestly report as left as found.
  const restored = options.dryRun ? changed.length === 0 : restorePaths(changed).length === 0;
  appendRunLine(options.out, { ...line, restored });

  if (turn.error !== null) {
    const detail = turn.error.message;
    return { status: 1, refusal: { ok: false, code: 'spawn_failed', runtime: job.runtimeName, detail } };
  }
  if (!restored) {
    return { status: 1, refusal: { ok: false, code: 'restore_failed', rowId: job.rowId, paths: changed } };
  }
  return { status: 0, refusal: null };
}

async function runArm(options, rowIds) {
  const exempt = exemptPrefix(dirname(options.out));
  const runtime = resolveRuntime(options.runtime);
  const fixture = fixtureDir(options);
  // Created once before the first snapshot, so the folder a turn needs is never
  // read back as a path the turn itself changed.
  const ghConfig = ghConfigDir(options.out);
  mkdirSync(ghConfig, { recursive: true });
  for (let index = 0; index < rowIds.length; index += 1) {
    const rowId = rowIds[index];
    const prompt = promptFor(rowId, fixture);
    const job = { runtime, runtimeName: options.runtime, rowId, prompt, cap: capForRow(rowId), ghConfig };
    const result = await runTurn(job, options, exempt, index === 0);
    if (result.refusal !== null) writeJson(result.refusal);
    if (result.status !== 0) return result.status;
  }
  return 0;
}

async function main(argv) {
  try {
    const options = parseOptions(argv);
    // Selection runs before the mode check, so an id the dataset guard refuses is
    // answered by that guard rather than by whichever usage check would run first.
    const rowIds = selectedRowIds(options);
    const mode = selectMode(options);
    options.arm = armFor(options);

    if (mode === 'print-argv') {
      writeArgv(options.printArgv);
      return 0;
    }
    if (mode === 'list') {
      writeRowIds(rowIds);
      return 0;
    }
    return await runArm(options, rowIds);
  } catch (error) {
    if (error instanceof UsageError) {
      process.stderr.write(`${SCRIPT_NAME}: ${error.message}\n${USAGE}\n`);
      return EXIT_REFUSED;
    }
    if (error instanceof Refusal) {
      writeJson({ ok: false, code: error.code, detail: error.message });
      return EXIT_REFUSED;
    }
    throw error;
  }
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (error) {
  if (error instanceof UsageError) {
    process.stderr.write(`${SCRIPT_NAME}: ${error.message}\n`);
    process.exitCode = EXIT_REFUSED;
  } else {
    throw error;
  }
}
