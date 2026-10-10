// ───────────────────────────────────────────────────────────────────
// MODULE: Trigger Index Rebuild Workflow
// ───────────────────────────────────────────────────────────────────
// The workflow has two jobs. The rebuild job runs the repository's install, build
// and generator with no secret and no write scope, and hands its commit to the
// push job as a bundle. The push job runs gh and git only, and the write token
// reaches its push step alone. These tests run the workflow's run blocks under
// bash against local fixtures: the rebuild blocks in one clone, and the push job's
// blocks in a fresh depth-one clone of the same origin, with the bundle moved
// between them the way the artifact moves it. The generator is a stub that writes
// the four committed outputs from a corpus file, and gh is a shim that serves the
// uploaded bundle, so no install, build, network or GitHub access happens. In the
// race scenario another writer lands a commit on origin while the commit step runs
// its check, so the push is rejected.
//
// The token is a dummy. The stub generator and the planted hooks record whether
// their own process and their parent process hold it, and the assertions read
// those records instead of trusting the workflow's statements about its
// environment.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import yaml from 'js-yaml';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
// The override lets a copy of the workflow with a guard removed stand in for the
// real file, so each assertion can be shown failing against the broken variant.
const WORKFLOW_PATH = process.env.TRIGGER_INDEX_REBUILD_WORKFLOW_PATH
  ?? path.join(WORKSPACE_ROOT, '.github', 'workflows', 'trigger-index-rebuild.yml');
const REBUILD_JOB = 'rebuild';
const PUSH_JOB = 'push';
const REGENERATE_STEP_NAME = 'Regenerate the trigger index';
const COMMIT_STEP_NAME = 'Verify and commit the trigger index if it changed';
const COMMIT_STEP_ID = 'commit';
const UPLOAD_STEP_NAME = 'Upload the rebuild bundle';
const DOWNLOAD_STEP_NAME = 'Download the rebuild bundle';
const VERIFY_STEP_NAME = 'Verify the rebuild bundle';
const PUSH_STEP_NAME = 'Push the trigger index rebuild';
const PUSH_IF = "needs.rebuild.outputs.committed == 'true'";
const ARTIFACT_NAME = 'trigger-index-rebuild-bundle';
const BUNDLE_FILE = 'rebuild.bundle';
const CHECKOUT_USE = 'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1';
const UPLOAD_USE = 'actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a';
const REPOSITORY = 'trigger-index/fixture';
const RUN_ID = '424242';
const AUTH_GUIDANCE = 'set the TRIGGER_INDEX_PUSH_TOKEN secret';
const BASH = 'bash';
const SUITE_TIMEOUT_MS = 300_000;
const GENERATOR_PATH = '.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs';
const GENERATED_FILES = [
  '.skilled/skills/system-spec-kit/runtime/data/trigger-index.json',
  '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json',
  '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json',
  '.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json',
];
const DUMMY_TOKEN = 'dummy-token-for-workflow-test-only';
const DUMMY_HEADER_VALUE = Buffer.from(`x-access-token:${DUMMY_TOKEN}`).toString('base64');
const PLACEHOLDER_GITHUB_TOKEN = 'github-token-placeholder';
const SECRET_MARKERS = [DUMMY_TOKEN, DUMMY_HEADER_VALUE];
// Every fixture process inherits this variable, so it proves that a parent's
// environment listing is complete enough to judge. A listing without it is
// unreadable, never clean.
const PARENT_SENTINEL = 'GIT_CONFIG_NOSYSTEM=1';
// Linux exposes a same-user process's initial environment through /proc, so an
// unreadable parent there is a failure. On the macOS runs the environment of the
// system /bin/bash was not visible to other processes, so the parent check reads
// "unreadable" there; a readable parent (the bash 5.2 run) is what proves the
// property on macOS.
const READABLE_PARENTS_REQUIRED = process.platform === 'linux';
const CLEAN_PARENT_STATES = READABLE_PARENTS_REQUIRED ? ['no'] : ['no', 'unreadable'];
const CLEAN_ANCESTOR_VALUES = READABLE_PARENTS_REQUIRED ? ['0'] : ['0', 'unreadable'];
const CLEAN_HOOK_RECORD = new RegExp(` header=unset token=unset markers=0 ancestor=(?:${CLEAN_ANCESTOR_VALUES.join('|')})$`);
const HOOK_NAMES = ['pre-commit', 'commit-msg', 'reference-transaction', 'pre-push'];
const CLEAN_GENERATOR_ENV = ' secret-env=none ';
const BASE_SUBJECT = 'base';
const RACE_SUBJECT = 'race: corpus moved';
const REBUILD_SUBJECT = 'chore(system-spec-kit): rebuild the trigger index';
const LOOP_GUARD_TRAILER = 'Trigger-Index-Rebuild: ci';
const IDENTITY_ARGS = ['-c', 'user.name=Trigger Index Test', '-c', 'user.email=trigger-index-test@example.invalid', '-c', 'commit.gpgsign=false'];
// A repository secret reference in any form, or the push token variable by name.
const TOKEN_REFERENCE = /\bsecrets\s*[.[]|\(\s*secrets\s*\)|\bPUSH_TOKEN\b/;
// Commands that run a language runtime, the generator, or a repository script.
const FORBIDDEN_IN_PUSH_JOB = /\b(?:node|npm|npx|tsc|yarn|pnpm|bun)\b|generate-trigger-index|\.github\/scripts|\.skilled\/\S*\.(?:c|m)?[jt]s\b/;
// The commit block prints this before it stops on a nonzero fresh generation, so
// seeing it shows the exit check fired rather than the content comparison.
const FRESH_EXIT_MESSAGE = 'The fresh generation that verifies the outputs exited non-zero';
const FAULT_CASES: Array<[GeneratorFault, 'regenerate' | 'commit']> = [
  ['regenerate-partial', 'regenerate'],
  ['fresh-partial', 'commit'],
  ['fresh-complete', 'commit'],
];

interface WorkflowStep {
  id?: string;
  name?: string;
  if?: string;
  uses?: string;
  with?: Record<string, unknown>;
  env?: Record<string, string>;
  run?: string;
}

interface WorkflowJob {
  needs?: string;
  if?: string;
  permissions?: Record<string, string>;
  outputs?: Record<string, string>;
  steps?: WorkflowStep[];
}

interface WorkflowDocument {
  jobs?: Record<string, WorkflowJob>;
}

interface StepOutcome {
  exitCode: number | null;
  output: string;
}

interface Fixture {
  root: string;
  env: Record<string, string>;
  origin: string;
  work: string;
  racer: string;
  cloneB: string;
  shadow: string;
  hooksDir: string;
  hookLog: string;
  generatorLog: string;
  outputFile: string;
  pushOutputFile: string;
  raceFlag: string;
  runnerTemp: string;
  pushRunnerTemp: string;
  artifactStore: string;
  shimDir: string;
  ghLog: string;
  baseSha: string;
}

interface FixtureOptions {
  race?: boolean;
  // Body of the origin's pre-receive hook, for rejections the remote decides.
  originHook?: string;
}

interface PipelineOptions extends FixtureOptions {
  rebuildEnv?: Record<string, string>;
  // Runs after the rebuild commit exists and before its bundle reaches the push job.
  tamper?: (fixture: Fixture) => void;
  // Runs on the push job's clone before its steps, to plant repository configuration.
  configureClone?: (cloneB: string, fixture: Fixture) => void;
  // Overrides for the push step's env, the only seam the harness uses on it.
  pushEnv?: (fixture: Fixture) => Record<string, string>;
}

interface Pipeline {
  fixture: Fixture;
  regenerate: StepOutcome;
  // Null when the commit block never ran, which GitHub does after a failed step.
  commit: StepOutcome | null;
  rebuildSha: string;
  download: StepOutcome | null;
  verify: StepOutcome | null;
  push: StepOutcome | null;
  // The rebuild clone's HEAD once the workflow steps have finished, before the control commit.
  workHead: string;
  // Hook records written while the workflow steps ran.
  workflowHookLines: string[];
  // Hook records written by the control commit, which runs outside the workflow.
  controlHookLines: string[];
}

// The generator faults: partial and complete output with a failing exit, and a path
// staged outside the outputs so the commit carries it.
type GeneratorFault = 'regenerate-partial' | 'fresh-partial' | 'fresh-complete' | 'stage-extra';

const createdRoots: string[] = [];

function loadWorkflow(): WorkflowDocument {
  return yaml.load(fs.readFileSync(WORKFLOW_PATH, 'utf8')) as WorkflowDocument;
}

function jobSteps(job: string): WorkflowStep[] {
  return loadWorkflow().jobs?.[job]?.steps ?? [];
}

function findStep(job: string, stepName: string): WorkflowStep {
  const step = jobSteps(job).find((candidate) => candidate.name === stepName);
  if (!step) {
    throw new Error(`Workflow step "${stepName}" is missing from job "${job}"`);
  }
  return step;
}

function loadRunBlock(job: string, stepName: string): string {
  const { run } = findStep(job, stepName);
  if (!run) {
    throw new Error(`Workflow step "${stepName}" carries no run block`);
  }
  if (run.includes('${{')) {
    throw new Error(`Workflow step "${stepName}" run block holds an unrendered expression`);
  }
  return run;
}

// Every string in the document with the path that holds it, so a structural check
// sees a secret reference wherever the workflow puts one.
function collectStrings(node: unknown, trail: string[], out: Array<{ path: string; value: string }>): void {
  if (typeof node === 'string') {
    out.push({ path: trail.join('/'), value: node });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, index) => collectStrings(item, [...trail, String(index)], out));
    return;
  }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      collectStrings(value, [...trail, key], out);
    }
  }
}

// The harness stands in for the runner's expression evaluation for the few
// expressions the workflow's step env uses. An expression it does not know fails
// the run instead of resolving to nothing.
function renderExpressions(value: string, rebuildSha: string): string {
  return value.replace(/\$\{\{\s*([^}]+?)\s*\}\}/g, (_whole: string, expression: string) => {
    if (expression.includes('secrets.')) {
      return DUMMY_TOKEN;
    }
    if (expression === 'github.token') {
      return PLACEHOLDER_GITHUB_TOKEN;
    }
    if (expression === 'github.repository') {
      return REPOSITORY;
    }
    if (expression === 'needs.rebuild.outputs.rebuild_sha') {
      return rebuildSha;
    }
    throw new Error(`Workflow expression "${expression}" has no value in the harness`);
  });
}

function renderedStepEnv(job: string, stepName: string, rebuildSha: string): Record<string, string> {
  const env = findStep(job, stepName).env ?? {};
  return Object.fromEntries(Object.entries(env).map(([name, value]) => [name, renderExpressions(value, rebuildSha)]));
}

function writeFile(filePath: string, content: string, mode = 0o644): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, { mode });
}

function readIfPresent(filePath: string): string {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function git(cwd: string, args: string[], env: Record<string, string>): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', env });
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr}`);
  }
  return result.stdout ?? '';
}

function gitOrEmpty(cwd: string, args: string[], env: Record<string, string>): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', env });
  return result.status === 0 ? (result.stdout ?? '') : '';
}

function fileUrl(filePath: string): string {
  return `file://${filePath}`;
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

// Same shape as the stub generator's output; the expectations and the stub both
// describe a generated file as one JSON line naming the file and the corpus.
function renderGenerated(fileName: string, corpus: string): string {
  return `${JSON.stringify({ file: fileName, corpus })}\n`;
}

// The stub records, for each call, whether its own environment and its parent's
// initial environment hold a dummy secret. A parent's environment is what a child
// can still read after the parent unsets a variable, so the parent check is
// separate from the child's own environment check.
function stubGeneratorSource(): string {
  return [
    "import { spawnSync } from 'node:child_process';",
    "import fs from 'node:fs';",
    "import path from 'node:path';",
    `const MARKERS = ${JSON.stringify(SECRET_MARKERS)};`,
    `const SENTINEL = ${JSON.stringify(PARENT_SENTINEL)};`,
    `const FILES = ${JSON.stringify(GENERATED_FILES)};`,
    'const env = process.env;',
    'const args = process.argv.slice(2);',
    "const render = (file, corpus) => JSON.stringify({ file, corpus }) + '\\n';",
    'const leaked = Object.entries(env)',
    "  .filter(([, value]) => typeof value === 'string' && MARKERS.some((marker) => value.includes(marker)))",
    '  .map(([name]) => name);',
    'let parentEnv = null;',
    'if (fs.existsSync(`/proc/${process.ppid}/environ`)) {',
    "  parentEnv = fs.readFileSync(`/proc/${process.ppid}/environ`, 'latin1');",
    '} else {',
    "  const ps = spawnSync('ps', ['eww', '-p', String(process.ppid)], { encoding: 'utf8' });",
    '  if (ps.status === 0) parentEnv = ps.stdout;',
    '}',
    "const parentHolds = parentEnv === null || !parentEnv.includes(SENTINEL) ? 'unreadable' : (MARKERS.some((marker) => parentEnv.includes(marker)) ? 'yes' : 'no');",
    "fs.appendFileSync(env.GEN_LOG, `generator args=[${args.join(' ')}] secret-env=${leaked.join(',') || 'none'} parent-secret=${parentHolds}\\n`);",
    "const corpus = fs.readFileSync('corpus.txt', 'utf8').trim();",
    "if (args.includes('--check') && env.RACE_FLAG && fs.existsSync(env.RACE_FLAG)) {",
    '  fs.rmSync(env.RACE_FLAG);',
    "  const git = (...gitArgs) => spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...gitArgs], { cwd: env.RACER, env, encoding: 'utf8' });",
    "  fs.writeFileSync(path.join(env.RACER, 'corpus.txt'), 'corpus v2\\n');",
    "  git('add', 'corpus.txt');",
    "  git('-c', 'user.name=racer', '-c', 'user.email=racer@example.invalid', 'commit', '-q', '-m', 'race: corpus moved');",
    "  const pushed = git('push', '-q', 'origin', 'main');",
    '  fs.appendFileSync(env.GEN_LOG, `race-push exit=${pushed.status}\\n`);',
    '  if (pushed.status !== 0) process.exit(3);',
    '}',
    "if (args.includes('--check')) {",
    '  const current = fs.readFileSync(FILES[0], \'utf8\');',
    '  if (current !== render(path.basename(FILES[0]), corpus)) {',
    "    console.log('trigger index is STALE (test stub)');",
    '    process.exit(1);',
    '  }',
    '  process.exit(0);',
    '}',
    "const outFlag = args.indexOf('--out');",
    'const outDir = outFlag === -1 ? null : path.dirname(path.resolve(args[outFlag + 1]));',
    'const writeOutput = (file, content) => {',
    '  const target = outDir === null ? file : path.join(outDir, path.basename(file));',
    '  fs.mkdirSync(path.dirname(target), { recursive: true });',
    '  fs.writeFileSync(target, content);',
    '};',
    "const fault = env.GEN_FAULT ?? '';",
    "if (fault === 'stage-extra' && outDir === null) {",
    "  fs.writeFileSync('extra.txt', 'staged outside the outputs\\n');",
    "  spawnSync('git', ['add', 'extra.txt'], { encoding: 'utf8' });",
    '}',
    "if ((fault === 'regenerate-partial' && outDir === null) || (fault === 'fresh-partial' && outDir !== null)) {",
    '  writeOutput(FILES[0], render(path.basename(FILES[0]), corpus));',
    '  const partial = render(path.basename(FILES[1]), corpus);',
    '  writeOutput(FILES[1], partial.slice(0, Math.floor(partial.length / 2)));',
    '  process.exit(3);',
    '}',
    "if (fault === 'fresh-complete' && outDir !== null) {",
    '  for (const file of FILES) writeOutput(file, render(path.basename(file), corpus));',
    '  process.exit(3);',
    '}',
    'for (const file of FILES) writeOutput(file, render(path.basename(file), corpus));',
    'process.exit(0);',
    '',
  ].join('\n');
}

// Each hook records whether its environment holds the header or the token
// variable, how many of its environment lines hold a secret marker, and how many
// lines of its parent's initial environment hold one. A leak shows up in the log
// whatever its variable name.
function hookScript(name: string, logPath: string): string {
  return [
    '#!/bin/sh',
    'h=unset; [ -n "${GIT_CONFIG_VALUE_0-}" ] && h=set',
    'x=unset; [ -n "${PUSH_TOKEN-}" ] && x=set',
    `m=$(env | grep -c -F -e '${DUMMY_TOKEN}' -e '${DUMMY_HEADER_VALUE}')`,
    'p=""',
    'if [ -r "/proc/$PPID/environ" ]; then',
    "  p=$(tr '\\0' '\\n' < \"/proc/$PPID/environ\")",
    'else',
    '  p=$(ps eww -p "$PPID" 2>/dev/null)',
    'fi',
    `if printf '%s\\n' "$p" | grep -q -F '${PARENT_SENTINEL}'; then`,
    `  a=$(printf '%s\\n' "$p" | grep -c -F -e '${DUMMY_TOKEN}' -e '${DUMMY_HEADER_VALUE}')`,
    'else',
    '  a=unreadable',
    'fi',
    `echo "${name} header=$h token=$x markers=$m ancestor=$a" >> '${logPath}'`,
    '',
  ].join('\n');
}

// Stands in for the gh CLI. It serves the bundle the rebuild job uploaded and refuses
// any other argument shape, so the download step's command is what the run checks.
function ghShimSource(fixture: Fixture): string {
  return [
    '#!/bin/sh',
    `store=${shellQuote(fixture.artifactStore)}`,
    `log=${shellQuote(fixture.ghLog)}`,
    'printf "gh %s\\n" "$*" >> "$log"',
    `if [ "$1" != run ] || [ "$2" != download ] || [ "$3" != "$GITHUB_RUN_ID" ] || [ "$4" != -n ] || [ "$5" != ${ARTIFACT_NAME} ] || [ "$6" != -D ]; then`,
    '  echo "gh shim: unexpected arguments" >&2',
    '  exit 2',
    'fi',
    '[ -n "$GH_TOKEN" ] || { echo "gh shim: no token" >&2; exit 3; }',
    '[ -n "$GH_REPO" ] || { echo "gh shim: no repository" >&2; exit 4; }',
    'mkdir -p "$7"',
    `cp "$store/$5/${BUNDLE_FILE}" "$7/${BUNDLE_FILE}"`,
    '',
  ].join('\n');
}

// A pre-receive hook that declines the push and prints one remote message, so the
// rejection comes from the remote rather than from git's own status line.
function rejectingPreReceive(remoteMessage: string): string {
  return ['#!/bin/sh', `echo ${shellQuote(remoteMessage)} >&2`, 'exit 1', ''].join('\n');
}

function createFixture(options: FixtureOptions): Fixture {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'trigger-index-rebuild-'));
  createdRoots.push(root);
  const home = path.join(root, 'home');
  const tmp = path.join(root, 'tmp');
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(tmp, { recursive: true });
  // The host's global git configuration can carry hooks or signing settings, so
  // every git call in the fixture reads only what the fixture writes.
  const env: Record<string, string> = {
    PATH: process.env.PATH ?? '',
    HOME: home,
    TMPDIR: tmp,
    LANG: 'C.UTF-8',
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
  };
  const seed = path.join(root, 'seed');
  const fixture: Fixture = {
    root,
    env,
    origin: path.join(root, 'origin.git'),
    work: path.join(root, 'work'),
    racer: path.join(root, 'racer'),
    cloneB: path.join(root, 'clone-b'),
    shadow: path.join(root, 'shadow.git'),
    hooksDir: path.join(root, 'hooks'),
    hookLog: path.join(root, 'hook.log'),
    generatorLog: path.join(root, 'generator.log'),
    outputFile: path.join(root, 'github-output'),
    pushOutputFile: path.join(root, 'push-github-output'),
    raceFlag: path.join(root, 'race-flag'),
    runnerTemp: path.join(root, 'runner-temp'),
    pushRunnerTemp: path.join(root, 'push-runner-temp'),
    artifactStore: path.join(root, 'artifacts'),
    shimDir: path.join(root, 'shim'),
    ghLog: path.join(root, 'gh.log'),
    baseSha: '',
  };

  git(root, ['init', '--quiet', '--bare', '-b', 'main', fixture.origin], env);
  git(root, ['init', '--quiet', '-b', 'main', seed], env);
  // The committed outputs are stale against the corpus, so the regenerate step
  // produces a change and the commit step has something to commit.
  writeFile(path.join(seed, 'corpus.txt'), 'corpus v1\n');
  writeFile(path.join(seed, GENERATOR_PATH), stubGeneratorSource());
  for (const file of GENERATED_FILES) {
    writeFile(path.join(seed, file), renderGenerated(path.basename(file), 'corpus v0'));
  }
  git(seed, ['add', '-A'], env);
  git(seed, [...IDENTITY_ARGS, 'commit', '--quiet', '--no-verify', '-m', BASE_SUBJECT], env);
  fixture.baseSha = git(seed, ['rev-parse', 'HEAD'], env).trim();
  git(seed, ['push', '--quiet', fixture.origin, 'main'], env);

  git(root, ['clone', '--quiet', fixture.origin, fixture.work], env);
  git(root, ['clone', '--quiet', fixture.origin, fixture.racer], env);
  for (const name of HOOK_NAMES) {
    writeFile(path.join(fixture.hooksDir, name), hookScript(name, fixture.hookLog), 0o755);
  }
  git(fixture.work, ['config', 'core.hooksPath', fixture.hooksDir], env);
  if (options.race) {
    writeFile(fixture.raceFlag, '');
  }
  if (options.originHook !== undefined) {
    writeFile(path.join(fixture.origin, 'hooks', 'pre-receive'), options.originHook, 0o755);
  }
  for (const dir of [fixture.runnerTemp, fixture.pushRunnerTemp, fixture.artifactStore]) {
    fs.mkdirSync(dir, { recursive: true });
  }
  writeFile(path.join(fixture.shimDir, 'gh'), ghShimSource(fixture), 0o755);
  return fixture;
}

// The push job checks out the base commit at depth one. A fresh repository fetches
// that commit by id, since origin may already hold a later tip by the time the push
// job runs. The hooks are planted here so a run that enabled them would fire them.
function createPushClone(fixture: Fixture): void {
  git(fixture.root, ['init', '--quiet', fixture.cloneB], fixture.env);
  git(fixture.cloneB, ['remote', 'add', 'origin', fixture.origin], fixture.env);
  git(fixture.cloneB, ['fetch', '--quiet', '--depth', '1', 'origin', fixture.baseSha], fixture.env);
  git(fixture.cloneB, ['checkout', '--quiet', '--detach', 'FETCH_HEAD'], fixture.env);
  git(fixture.cloneB, ['config', 'core.hooksPath', fixture.hooksDir], fixture.env);
}

function commonEnv(fixture: Fixture): Record<string, string> {
  return {
    ...fixture.env,
    CI: 'true',
    GITHUB_ACTIONS: 'true',
    GITHUB_SERVER_URL: 'https://github.com',
    GITHUB_REF_NAME: 'main',
    GITHUB_REPOSITORY: REPOSITORY,
    GITHUB_RUN_ID: RUN_ID,
  };
}

function rebuildJobEnv(fixture: Fixture): Record<string, string> {
  return {
    ...commonEnv(fixture),
    GITHUB_OUTPUT: fixture.outputFile,
    RUNNER_TEMP: fixture.runnerTemp,
    GEN_LOG: fixture.generatorLog,
    RACE_FLAG: fixture.raceFlag,
    RACER: fixture.racer,
  };
}

// The push job runs on its own runner, so its environment holds none of the rebuild
// job's variables. The shim directory is first on PATH so the download step reaches it.
function pushJobEnv(fixture: Fixture): Record<string, string> {
  return {
    ...commonEnv(fixture),
    PATH: `${fixture.shimDir}${path.delimiter}${process.env.PATH ?? ''}`,
    GITHUB_OUTPUT: fixture.pushOutputFile,
    RUNNER_TEMP: fixture.pushRunnerTemp,
  };
}

// The runner executes each run block as a script file, so the step shell stays in
// the process tree above every command the block starts. A -c string would let
// bash replace itself with the block's last command, and that command would then
// have the test process as its parent.
let stepScriptCount = 0;

function runStep(script: string, env: Record<string, string>, cwd: string, root: string): StepOutcome {
  stepScriptCount += 1;
  const scriptPath = path.join(root, 'steps', `step-${stepScriptCount}.sh`);
  writeFile(scriptPath, script);
  const result = spawnSync(BASH, ['--noprofile', '--norc', '-eo', 'pipefail', scriptPath], {
    cwd,
    encoding: 'utf8',
    env,
  });
  return { exitCode: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

function runWorkflowStep(
  fixture: Fixture,
  job: string,
  stepName: string,
  baseEnv: Record<string, string>,
  rebuildSha: string,
  cwd: string,
  extraEnv: Record<string, string> = {},
): StepOutcome {
  const env = { ...baseEnv, ...renderedStepEnv(job, stepName, rebuildSha), ...extraEnv };
  return runStep(loadRunBlock(job, stepName), env, cwd, fixture.root);
}

function hookLines(fixture: Fixture): string[] {
  return readIfPresent(fixture.hookLog).split('\n').filter(Boolean);
}

function generatorCalls(fixture: Fixture): string[] {
  return readIfPresent(fixture.generatorLog)
    .split('\n')
    .filter((line) => line.startsWith('generator '));
}

function readStepOutput(fixture: Fixture, key: string): string {
  const prefix = `${key}=`;
  const values = readIfPresent(fixture.outputFile)
    .split('\n')
    .filter((line) => line.startsWith(prefix))
    .map((line) => line.slice(prefix.length));
  return values.length === 0 ? '' : values[values.length - 1];
}

// A commit outside the workflow, with hooks enabled, shows the planted recorder
// fires. Without it, the workflow's empty hook log could not be told apart from
// a recorder that never works.
function runControlCommit(fixture: Fixture): void {
  git(fixture.work, [...IDENTITY_ARGS, 'commit', '--quiet', '--allow-empty', '-m', 'control commit'], fixture.env);
}

// A node process that holds the dummy token stands in as the stub's parent. The
// reader has to report the token there; a reader that could not see a readable
// parent would otherwise pass every clean check. The record goes to a separate
// log, so no scenario sees it.
function runReaderControl(fixture: Fixture): string {
  const controlLog = path.join(fixture.root, 'reader-control.log');
  const stub = path.join(fixture.work, GENERATOR_PATH);
  const launcher = [
    "require('node:child_process').spawnSync(process.execPath, [",
    `  ${JSON.stringify(stub)}, '--check'`,
    `], { cwd: ${JSON.stringify(fixture.work)}, env: { ...process.env, GEN_LOG: ${JSON.stringify(controlLog)} }, stdio: 'ignore' });`,
  ].join('\n');
  spawnSync(process.execPath, ['-e', launcher], {
    cwd: fixture.work,
    encoding: 'utf8',
    env: { ...fixture.env, PUSH_TOKEN: DUMMY_TOKEN },
  });
  return readIfPresent(controlLog).trim();
}

// The planted helper writes its environment into the working directory, so a leak
// shows up as a file there. It runs only when a push names the remote.
function plantExtPushurl(cloneB: string, fixture: Fixture): void {
  git(cloneB, ['config', 'remote.origin.pushurl', 'ext::sh -c env% >leak.txt; exit% 1'], fixture.env);
  git(cloneB, ['config', 'protocol.ext.allow', 'always'], fixture.env);
}

// The shadow starts at the base commit, so a push that reaches it moves a ref the
// assertions can read. The rewrite sends the workflow's https URL to a file transport.
function plantShadowRewrite(cloneB: string, fixture: Fixture): void {
  git(fixture.root, ['clone', '--quiet', '--bare', fileUrl(fixture.origin), fixture.shadow], fixture.env);
  git(cloneB, ['config', `url.${fileUrl(fixture.shadow)}.insteadOf`, `https://github.com/${REPOSITORY}.git`], fixture.env);
}

// Stands in for rebuild-job code that builds history the bundle must not carry: a
// merge whose first parent is the base and whose second parent is the rebuild commit.
// The merge's tree equals the rebuild commit's tree, so only the commit-count check
// can refuse it.
function tamperWithMergedCommit(fixture: Fixture): void {
  const rebuildSha = readStepOutput(fixture, 'rebuild_sha');
  const quiet = ['-c', 'core.hooksPath=/dev/null', ...IDENTITY_ARGS];
  git(fixture.work, ['checkout', '--quiet', '--detach', fixture.baseSha], fixture.env);
  git(fixture.work, [...quiet, 'merge', '--quiet', '--no-ff', '--no-edit', rebuildSha], fixture.env);
  const merged = git(fixture.work, ['rev-parse', 'HEAD'], fixture.env).trim();
  git(fixture.work, ['bundle', 'create', path.join(fixture.runnerTemp, BUNDLE_FILE), `${fixture.baseSha}..HEAD`], fixture.env);
  fs.appendFileSync(fixture.outputFile, `rebuild_sha=${merged}\n`);
}

// Runs the rebuild job's steps, then the push job's steps on a fresh clone. The
// upload is an action the harness cannot run, so the file the commit step wrote
// stands in for the artifact, and the gh shim serves it. GitHub skips a step after
// a failed one, so each step runs only when the step before it exited zero.
function runPipeline(options: PipelineOptions = {}): Pipeline {
  const fixture = createFixture(options);
  const rebuildEnv = options.rebuildEnv ?? {};
  const regenerate = runWorkflowStep(fixture, REBUILD_JOB, REGENERATE_STEP_NAME, rebuildJobEnv(fixture), '', fixture.work, rebuildEnv);
  const commit = regenerate.exitCode === 0
    ? runWorkflowStep(fixture, REBUILD_JOB, COMMIT_STEP_NAME, rebuildJobEnv(fixture), '', fixture.work, rebuildEnv)
    : null;
  // Mirrors the push job's if: with the rebuild job's committed output as the runner reads it.
  const committed = commit !== null && commit.exitCode === 0 && readStepOutput(fixture, 'committed') === 'true';
  let rebuildSha = '';
  let download: StepOutcome | null = null;
  let verify: StepOutcome | null = null;
  let push: StepOutcome | null = null;
  if (committed) {
    options.tamper?.(fixture);
    const stored = path.join(fixture.artifactStore, ARTIFACT_NAME);
    fs.mkdirSync(stored, { recursive: true });
    fs.copyFileSync(path.join(fixture.runnerTemp, BUNDLE_FILE), path.join(stored, BUNDLE_FILE));
    rebuildSha = readStepOutput(fixture, 'rebuild_sha');
    createPushClone(fixture);
    options.configureClone?.(fixture.cloneB, fixture);
    const pushBase = pushJobEnv(fixture);
    download = runWorkflowStep(fixture, PUSH_JOB, DOWNLOAD_STEP_NAME, pushBase, rebuildSha, fixture.cloneB);
    if (download.exitCode === 0) {
      verify = runWorkflowStep(fixture, PUSH_JOB, VERIFY_STEP_NAME, pushBase, rebuildSha, fixture.cloneB);
    }
    if (verify?.exitCode === 0) {
      push = runWorkflowStep(fixture, PUSH_JOB, PUSH_STEP_NAME, pushBase, rebuildSha, fixture.cloneB, options.pushEnv?.(fixture) ?? {});
    }
  }
  const workHead = gitOrEmpty(fixture.work, ['rev-parse', 'HEAD'], fixture.env).trim();
  const workflowHookLines = hookLines(fixture);
  runControlCommit(fixture);
  const controlHookLines = hookLines(fixture).slice(workflowHookLines.length);
  return { fixture, regenerate, commit, rebuildSha, download, verify, push, workHead, workflowHookLines, controlHookLines };
}

function refOf(repo: string, ref: string, env: Record<string, string>): string {
  return gitOrEmpty(repo, ['rev-parse', '--verify', '--quiet', ref], env).trim();
}

function originSha(pipeline: Pipeline): string {
  return refOf(pipeline.fixture.origin, 'main', pipeline.fixture.env);
}

function originLog(pipeline: Pipeline, count: number): string[] {
  return git(pipeline.fixture.origin, ['log', '--format=%s', `-${count}`, 'main'], pipeline.fixture.env).trim().split('\n');
}

const fileOriginPush = (fixture: Fixture): Record<string, string> => ({
  PUSH_URL: fileUrl(fixture.origin),
  PUSH_PROTOCOL: 'file',
});

describe('trigger-index rebuild workflow', () => {
  let race: Pipeline;
  let clean: Pipeline;
  let pushurlPlanted: Pipeline;
  let pushurlControl: Pipeline;
  let insteadOfPlanted: Pipeline;
  let insteadOfControl: Pipeline;
  let remoteRejected: Pipeline;
  let nonFastForwardText: Pipeline;
  let authStyle: Pipeline;
  let stageExtra: Pipeline;
  let mergedCommit: Pipeline;
  const faults = new Map<GeneratorFault, Pipeline>();
  let readerControlLine = '';

  beforeAll(() => {
    race = runPipeline({ race: true, pushEnv: fileOriginPush });
    clean = runPipeline({ pushEnv: fileOriginPush });
    pushurlPlanted = runPipeline({ configureClone: plantExtPushurl, pushEnv: fileOriginPush });
    pushurlControl = runPipeline({ configureClone: plantExtPushurl, pushEnv: () => ({ PUSH_URL: 'origin' }) });
    insteadOfPlanted = runPipeline({ configureClone: plantShadowRewrite });
    insteadOfControl = runPipeline({ configureClone: plantShadowRewrite, pushEnv: () => ({ PUSH_PROTOCOL: 'file' }) });
    remoteRejected = runPipeline({
      originHook: rejectingPreReceive('remote: policy declined the rebuild'),
      pushEnv: fileOriginPush,
    });
    nonFastForwardText = runPipeline({
      originHook: rejectingPreReceive('remote: non-fast-forward refused by policy'),
      pushEnv: fileOriginPush,
    });
    authStyle = runPipeline({
      originHook: rejectingPreReceive(`remote: Permission to ${REPOSITORY}.git denied to x-access-token.`),
      pushEnv: fileOriginPush,
    });
    stageExtra = runPipeline({ rebuildEnv: { GEN_FAULT: 'stage-extra' }, pushEnv: fileOriginPush });
    mergedCommit = runPipeline({ tamper: tamperWithMergedCommit, pushEnv: fileOriginPush });
    for (const [fault] of FAULT_CASES) {
      faults.set(fault, runPipeline({ rebuildEnv: { GEN_FAULT: fault } }));
    }
    readerControlLine = runReaderControl(clean.fixture);
  }, SUITE_TIMEOUT_MS);

  afterAll(() => {
    for (const root of createdRoots) {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  describe('job and step structure', () => {
    it('keeps the rebuild job free of any secret and grants it read access only', () => {
      const rebuild = loadWorkflow().jobs?.[REBUILD_JOB];

      expect(rebuild?.permissions).toEqual({ contents: 'read' });
      expect(JSON.stringify(rebuild)).not.toMatch(TOKEN_REFERENCE);
    });

    it('hands the token to the push step alone', () => {
      const pushIndex = jobSteps(PUSH_JOB).findIndex((step) => step.name === PUSH_STEP_NAME);
      const strings: Array<{ path: string; value: string }> = [];
      collectStrings(loadWorkflow(), [], strings);
      const holders = strings
        .filter(({ value }) => TOKEN_REFERENCE.test(value))
        .map(({ path: holderPath }) => holderPath)
        .sort();

      expect(holders).toEqual([
        `jobs/${PUSH_JOB}/steps/${pushIndex}/env/PUSH_TOKEN`,
        `jobs/${PUSH_JOB}/steps/${pushIndex}/run`,
      ].sort());
    });

    it('runs no node, npm, npx, tsc, generator or repository script in the push job', () => {
      for (const step of jobSteps(PUSH_JOB)) {
        for (const line of (step.run ?? '').split('\n')) {
          if (line.trim().startsWith('#')) {
            continue;
          }
          expect(line).not.toMatch(FORBIDDEN_IN_PUSH_JOB);
        }
      }
    });

    it('uses only the pinned checkout action in the push job', () => {
      const uses = jobSteps(PUSH_JOB)
        .map((step) => step.uses)
        .filter((value): value is string => value !== undefined);

      expect(uses).toEqual([CHECKOUT_USE]);
    });

    it('checks out both jobs with the pinned action and without persisting the credential', () => {
      for (const job of [REBUILD_JOB, PUSH_JOB]) {
        const checkout = jobSteps(job).find((step) => step.uses?.startsWith('actions/checkout@'));

        expect(checkout?.uses).toBe(CHECKOUT_USE);
        expect(checkout?.with?.['persist-credentials']).toBe(false);
      }
    });

    it('scopes the push job to the push and to reading the run artifacts', () => {
      expect(loadWorkflow().jobs?.[PUSH_JOB]?.permissions).toEqual({ actions: 'read', contents: 'write' });
    });

    it('binds the push job to the committed output of the rebuild job', () => {
      const jobs = loadWorkflow().jobs ?? {};

      expect(jobs[PUSH_JOB]?.needs).toBe(REBUILD_JOB);
      expect(jobs[PUSH_JOB]?.if).toBe(PUSH_IF);
      expect(jobs[REBUILD_JOB]?.outputs).toEqual({
        committed: '${{ steps.commit.outputs.committed }}',
        rebuild_sha: '${{ steps.commit.outputs.rebuild_sha }}',
      });
      expect(findStep(REBUILD_JOB, COMMIT_STEP_NAME).id).toBe(COMMIT_STEP_ID);
    });

    it('uploads the bundle under the name and path the push job downloads, with a short retention', () => {
      const upload = findStep(REBUILD_JOB, UPLOAD_STEP_NAME);

      expect(upload.uses).toBe(UPLOAD_USE);
      expect(upload.with?.name).toBe(ARTIFACT_NAME);
      expect(upload.with?.path).toBe('${{ runner.temp }}/rebuild.bundle');
      expect(Number(upload.with?.['retention-days'])).toBeLessThanOrEqual(3);
      expect(upload.if).toBe(`\${{ steps.commit.outputs.committed == 'true' }}`);
      expect(findStep(PUSH_JOB, DOWNLOAD_STEP_NAME).run).toContain(`-n ${ARTIFACT_NAME}`);
      expect(findStep(REBUILD_JOB, COMMIT_STEP_NAME).run).toContain('"$RUNNER_TEMP/rebuild.bundle"');
    });

    it('checks the fetched commit against the rebuild job output in the verify step', () => {
      const verify = findStep(PUSH_JOB, VERIFY_STEP_NAME);

      expect(verify.env?.REBUILD_SHA).toBe('${{ needs.rebuild.outputs.rebuild_sha }}');
      expect(findStep(PUSH_JOB, PUSH_STEP_NAME).env?.REBUILD_SHA).toBe('${{ needs.rebuild.outputs.rebuild_sha }}');
      expect(verify.run).toMatch(/"\$fetched" != "\$REBUILD_SHA"/);
    });

    it('pins the push command to an explicit URL and a protocol allowance', () => {
      const push = findStep(PUSH_JOB, PUSH_STEP_NAME);
      const run = push.run ?? '';

      expect(run).toContain('git -c protocol.allow=never -c "protocol.${PUSH_PROTOCOL}.allow=always"');
      expect(run).toMatch(/push "\$PUSH_URL" "\$\{REBUILD_SHA\}:refs\/heads\/\$\{GITHUB_REF_NAME\}"/);
      expect(run).not.toMatch(/\bpush\s+"?origin"?\b/);
      expect(push.env?.PUSH_URL).toBe(`https://github.com/\${{ github.repository }}.git`);
      expect(push.env?.PUSH_PROTOCOL).toBe('https');
    });

    it('checks the authentication and ruleset branch before the anchored race classification', () => {
      const run = findStep(PUSH_JOB, PUSH_STEP_NAME).run ?? '';
      const authIndex = run.indexOf("grep -Eqi 'authentication failed");
      const raceIndex = run.indexOf(String.raw`grep -Eq '^ ! \[rejected\] .*\((fetch first|non-fast-forward)\)$'`);

      expect(authIndex).toBeGreaterThan(-1);
      expect(raceIndex).toBeGreaterThan(authIndex);
      expect(run).toContain(AUTH_GUIDANCE);
      expect(run).not.toMatch(/grep -Eq 'non-fast-forward\|fetch first/);
    });
  });

  describe('when origin moves before the push', () => {
    it('exits 0 with a notice and pushes nothing', () => {
      expect(race.commit?.exitCode).toBe(0);
      expect(race.verify?.exitCode).toBe(0);
      expect(race.push?.exitCode).toBe(0);
      expect(race.push?.output).toMatch(/^ ! \[rejected\] .*\(fetch first\)$/m);
      expect(race.push?.output).toContain('::notice::');
      expect(race.push?.output).not.toContain('::error::');
    });

    it('leaves origin on the race commit, with the rebuild unpushed', () => {
      const { racer, baseSha, env } = race.fixture;

      expect(originLog(race, 2)).toEqual([RACE_SUBJECT, BASE_SUBJECT]);
      expect(originSha(race)).toBe(refOf(racer, 'HEAD', env));
      expect(refOf(race.fixture.origin, 'main~1', env)).toBe(baseSha);
    });
  });

  describe('when origin does not move', () => {
    it('pushes the rebuild on top of the base and exits 0', () => {
      expect(clean.commit?.exitCode).toBe(0);
      expect(clean.verify?.output).toContain('one commit on the checked-out base');
      expect(clean.push?.exitCode).toBe(0);
      expect(clean.push?.output).not.toContain('::notice::');
      expect(originLog(clean, 2)).toEqual([REBUILD_SUBJECT, BASE_SUBJECT]);
    });

    it('ends the rebuild commit with the loop-guard trailer as its last line', () => {
      const { origin, env } = clean.fixture;
      const lines = git(origin, ['log', '-1', '--format=%B', 'main'], env).trimEnd().split('\n');

      expect(lines[lines.length - 1]).toBe(LOOP_GUARD_TRAILER);
    });

    it('publishes all four generated files rebuilt from the current corpus', () => {
      const { origin, env } = clean.fixture;
      for (const file of GENERATED_FILES) {
        expect(git(origin, ['show', `main:${file}`], env)).toBe(
          renderGenerated(path.basename(file), 'corpus v1'),
        );
      }
    });
  });

  describe('the push URL and the protocol pin', () => {
    it('ignores a planted pushurl, so the explicit URL is the only target and no helper runs', () => {
      expect(pushurlPlanted.push?.exitCode).toBe(0);
      expect(fs.existsSync(path.join(pushurlPlanted.fixture.cloneB, 'leak.txt'))).toBe(false);
      expect(originSha(pushurlPlanted)).toBe(pushurlPlanted.rebuildSha);
    });

    it('runs the same planted helper when the push names the remote, so the no-leak result is not vacuous', () => {
      const leak = readIfPresent(path.join(pushurlControl.fixture.cloneB, 'leak.txt'));

      expect(pushurlControl.push?.exitCode).toBe(1);
      expect(leak).toContain(`GIT_CONFIG_VALUE_0=AUTHORIZATION: basic ${DUMMY_HEADER_VALUE}`);
    });

    it('refuses the rewritten file transport under the pin and pushes nothing to the rewrite target', () => {
      const shadowSha = refOf(insteadOfPlanted.fixture.shadow, 'main', insteadOfPlanted.fixture.env);

      expect(insteadOfPlanted.push?.exitCode).toBe(1);
      expect(insteadOfPlanted.push?.output).toContain("transport 'file' not allowed");
      expect(shadowSha).toBe(insteadOfPlanted.fixture.baseSha);
    });

    it('delivers the same push to the rewrite target once file is allowed, so the refusal is the pin', () => {
      const shadowSha = refOf(insteadOfControl.fixture.shadow, 'main', insteadOfControl.fixture.env);

      expect(insteadOfControl.push?.exitCode).toBe(0);
      expect(shadowSha).toBe(insteadOfControl.rebuildSha);
    });
  });

  describe('push failures', () => {
    it('fails a non-race rejection that the remote reports as remote rejected', () => {
      expect(remoteRejected.push?.exitCode).toBe(1);
      expect(remoteRejected.push?.output).toContain('! [remote rejected]');
      expect(remoteRejected.push?.output).not.toContain('::notice::');
    });

    it('fails when only the remote message contains the words non-fast-forward', () => {
      expect(nonFastForwardText.push?.exitCode).toBe(1);
      expect(nonFastForwardText.push?.output).toContain('remote: non-fast-forward refused by policy');
      expect(nonFastForwardText.push?.output).not.toContain('::notice::');
    });

    it('fails an authentication-style rejection and keeps the token guidance', () => {
      expect(authStyle.push?.exitCode).toBe(1);
      expect(authStyle.push?.output).toContain(AUTH_GUIDANCE);
      expect(authStyle.push?.output).not.toContain('::notice::');
    });
  });

  describe('bundle verification before the push', () => {
    it('refuses a commit that changes a path outside the trigger index outputs', () => {
      expect(stageExtra.commit?.exitCode).toBe(0);
      expect(stageExtra.verify?.exitCode).toBe(1);
      expect(stageExtra.verify?.output).toContain('outside the trigger index outputs');
      expect(stageExtra.push).toBeNull();
      expect(originSha(stageExtra)).toBe(stageExtra.fixture.baseSha);
    });

    it('refuses a bundle that holds more than the one rebuild commit', () => {
      expect(mergedCommit.verify?.exitCode).toBe(1);
      expect(mergedCommit.verify?.output).toContain('more than the one rebuild commit');
      expect(mergedCommit.push).toBeNull();
      expect(originSha(mergedCommit)).toBe(mergedCommit.fixture.baseSha);
    });
  });

  describe.each(FAULT_CASES)('when the generator exits nonzero after writing (%s)', (fault, failingStep) => {
    let scenario: Pipeline;

    beforeAll(() => {
      const found = faults.get(fault);
      if (!found) {
        throw new Error(`No pipeline was run for fault ${fault}`);
      }
      scenario = found;
    });

    it(`fails the ${failingStep} step`, () => {
      const failed = failingStep === 'regenerate' ? scenario.regenerate : scenario.commit;

      expect(failed?.exitCode ?? 0).toBeGreaterThan(0);
    });

    it('makes no commit', () => {
      expect(readStepOutput(scenario.fixture, 'committed')).not.toBe('true');
      expect(scenario.workHead).toBe(scenario.fixture.baseSha);
    });

    it('pushes nothing to origin', () => {
      const { origin, env, baseSha } = scenario.fixture;

      expect(scenario.push).toBeNull();
      expect(git(origin, ['rev-parse', 'main'], env).trim()).toBe(baseSha);
    });

    it.runIf(failingStep === 'commit')('stops on the exit check before the content check runs', () => {
      expect(scenario.commit?.output).toContain(FRESH_EXIT_MESSAGE);
    });
  });

  const hygieneCases: Array<[string, () => Pipeline]> = [
    ['origin moves before the push', () => race],
    ['origin does not move', () => clean],
    ['the push is refused for authentication', () => authStyle],
  ];

  describe.each(hygieneCases)('hygiene when %s', (_label, scenarioFor) => {
    it('keeps the token and its header out of every step output, output file and repository config', () => {
      const { fixture, regenerate, commit, download, verify, push } = scenarioFor();
      const texts = [
        regenerate.output,
        commit?.output ?? '',
        download?.output ?? '',
        verify?.output ?? '',
        push?.output ?? '',
        readIfPresent(fixture.outputFile),
        readIfPresent(fixture.pushOutputFile),
        readIfPresent(fixture.ghLog),
        readIfPresent(path.join(fixture.work, '.git', 'config')),
        readIfPresent(path.join(fixture.cloneB, '.git', 'config')),
      ];

      for (const marker of SECRET_MARKERS) {
        for (const text of texts) {
          expect(text).not.toContain(marker);
        }
      }
    });

    it('keeps the token out of the generator environment', () => {
      const calls = generatorCalls(scenarioFor().fixture);

      expect(calls.some((line) => line.includes('--check'))).toBe(true);
      expect(calls.some((line) => line.includes('--out'))).toBe(true);
      expect(calls.filter((line) => !line.includes(CLEAN_GENERATOR_ENV))).toEqual([]);
    });

    it("keeps the token out of the generator's parent process", () => {
      const calls = generatorCalls(scenarioFor().fixture);

      expect(calls.length).toBeGreaterThan(0);
      expect(calls.filter((line) => !CLEAN_PARENT_STATES.some((state) => line.endsWith(` parent-secret=${state}`)))).toEqual([]);
    });

    it('never runs a hook during the workflow steps, which keep hooks off for every git command', () => {
      expect(scenarioFor().workflowHookLines).toEqual([]);
    });

    it('runs the planted pre-commit hook on a control commit, so the hook records are live', () => {
      expect(scenarioFor().controlHookLines.some((line) => line.startsWith('pre-commit '))).toBe(true);
    });

    it('keeps the token and its header out of every hook environment', () => {
      const { workflowHookLines, controlHookLines } = scenarioFor();
      const hookRecords = [...workflowHookLines, ...controlHookLines];

      expect(hookRecords.filter((line) => !CLEAN_HOOK_RECORD.test(line))).toEqual([]);
    });

    it('never runs the pre-push hook', () => {
      const { workflowHookLines, controlHookLines } = scenarioFor();
      const hookRecords = [...workflowHookLines, ...controlHookLines];

      expect(hookRecords.filter((line) => line.startsWith('pre-push '))).toEqual([]);
    });
  });

  it('reads the token from a readable parent as yes, so the clean parent results are not vacuous', () => {
    expect(readerControlLine.endsWith(' parent-secret=yes')).toBe(true);
  });

  it('keeps the generator and the upload out of the push job, which holds only the bundle', () => {
    expect(jobSteps(PUSH_JOB).map((step) => step.name)).not.toContain(REGENERATE_STEP_NAME);
    expect(jobSteps(PUSH_JOB).map((step) => step.name)).not.toContain(UPLOAD_STEP_NAME);
  });
});
