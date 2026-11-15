#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Iteration
// ───────────────────────────────────────────────────────────────────

'use strict';

// ───────────────────────────────────────────────────────────────────
// 0. EARLY EXECUTOR DECISION
// ───────────────────────────────────────────────────────────────────
//
// The executor kind decides what this process may load. A refusal or an
// unknown kind is answerable from argv alone, while every real dispatch needs
// tsx and the TypeScript executor modules, so the decision runs first: a
// refusal wins over every other flag and never depends on a module that might
// be broken. The kind list is literal because executor-config.ts is not loaded
// yet; the later check still compares against its EXECUTOR_KINDS.

const EXECUTOR_KIND_NAMES = Object.freeze([
  'native',
  'cli-codex',
  'cli-claude-code',
  'cli-opencode',
  'cli-cursor',
  'cli-devin',
  'cli-pi',
  'cli-deepseek-harness',
]);

const NATIVE_REFUSAL =
  "native dispatch runs through the orchestrator's if_native branch; dispatch-iteration.cjs "
  + 'has no native path';

/**
 * @param {readonly string[]} kinds - Executor kinds to name.
 * @returns {string} Usage line.
 */
function usageLine(kinds) {
  return 'Usage: dispatch-iteration.cjs --executor ' + kinds.join('|')
    + ' --loop-type research|review --repo-root <dir> --prompt-file <path> --state-log <path>'
    + ' --packet-dir <dir> --artifact-dir <dir> --iteration <n> --generation <n> --session-id <id>'
    + ' --model <m|null> --reasoning-effort <e|null> --service-tier <t|null> --sandbox-mode <s|null>'
    + ' --timeout-seconds <n> [--claude-config-dir <dir>] [--spec-folder <dir>]';
}

/**
 * Reads `--executor` from raw argv without parsing, validating or loading
 * anything else, so a refusal cannot be pre-empted by an unrelated bad flag.
 *
 * @param {string[]} argv - Arguments after the script path.
 * @returns {number | null} Exit status for a refusal, null to continue.
 */
function earlyExecutorExit(argv) {
  const flagIndex = argv.indexOf('--executor');
  const executor = flagIndex === -1 ? '' : (argv[flagIndex + 1] ?? '');
  if (!EXECUTOR_KIND_NAMES.includes(executor)) {
    process.stderr.write(
      `${usageLine(EXECUTOR_KIND_NAMES)}\nunknown executor kind '${executor}'. `
        + `Supported kinds: ${EXECUTOR_KIND_NAMES.join(', ')}\n`,
    );
    return 64;
  }
  if (executor === 'native') {
    process.stderr.write(`${NATIVE_REFUSAL}\n`);
    return 64;
  }
  return null;
}

if (require.main === module) {
  const earlyExit = earlyExecutorExit(process.argv.slice(2));
  if (earlyExit !== null) process.exit(earlyExit);
}

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

require('tsx/cjs');

const {
  EXECUTOR_KINDS,
  resolveClaudePermissionMode,
  resolveSandboxMode,
} = require('../lib/deep-loop/executor-config.ts');
const {
  RECURSION_GUARD_EXIT_CODE,
  formatRecursionGuardRefusal,
  runAuditedExecutorCommand,
  validateExecutorDispatchAllowed,
} = require('../lib/deep-loop/executor-audit.ts');
const {
  enforceWriteContainment,
  snapshotOutOfScopeDirtyPaths,
} = require('../lib/deep-loop/write-containment.ts');
const {
  buildLineageCommand,
  sweepStaleDshHomes,
  validateClaudeConfigDir,
  validateDshCompletion,
  withAgentPersona,
} = require('./fanout-run.cjs');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const USAGE = usageLine(EXECUTOR_KINDS);

const FLAG_NAMES = [
  'executor',
  'loop-type',
  'repo-root',
  'prompt-file',
  'state-log',
  'packet-dir',
  'artifact-dir',
  'iteration',
  'generation',
  'session-id',
  'model',
  'reasoning-effort',
  'service-tier',
  'sandbox-mode',
  'timeout-seconds',
  'claude-config-dir',
  'spec-folder',
];

const REQUIRED_FLAGS = [
  ['loopType', '--loop-type'],
  ['repoRoot', '--repo-root'],
  ['promptFile', '--prompt-file'],
  ['stateLog', '--state-log'],
  ['packetDir', '--packet-dir'],
  ['artifactDir', '--artifact-dir'],
  ['iteration', '--iteration'],
  ['generation', '--generation'],
  ['sessionId', '--session-id'],
  ['model', '--model'],
  ['reasoningEffort', '--reasoning-effort'],
  ['serviceTier', '--service-tier'],
  ['sandboxMode', '--sandbox-mode'],
  ['timeoutSeconds', '--timeout-seconds'],
];

const RESEARCH_PREAMBLE =
  'Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; '
  + 'state_source=externalized_files; do_not_switch_mode=true';

const REVIEW_PREAMBLE =
  'Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; '
  + 'state_source=externalized_files; do_not_switch_mode=true';

const REVIEW_BASELINE_PREFIX = 'deep-review-baseline.';

const FLAG_KEY_BY_NAME = new Map(
  FLAG_NAMES.map((name) => [name, name.replace(/-([a-z])/g, (_, char) => char.toUpperCase())]),
);

// ───────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ───────────────────────────────────────────────────────────────────

class UsageError extends Error {}

function hasFlag(values, key) {
  return Object.prototype.hasOwnProperty.call(values, key);
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      throw new UsageError(`unexpected argument '${token}'`);
    }
    const name = token.slice(2);
    if (!FLAG_KEY_BY_NAME.has(name)) {
      throw new UsageError(`unknown flag '--${name}'`);
    }
    if (index + 1 >= argv.length) {
      throw new UsageError(`flag '--${name}' requires a value`);
    }
    const key = FLAG_KEY_BY_NAME.get(name);
    if (hasFlag(values, key)) {
      throw new UsageError(`flag '--${name}' was supplied more than once`);
    }
    values[key] = argv[index + 1];
    index += 1;
  }
  return values;
}

function requireFlags(values) {
  for (const [key, flag] of REQUIRED_FLAGS) {
    if (!hasFlag(values, key)) {
      throw new UsageError(`missing required flag '${flag}'`);
    }
  }
}

function validateFlags(values) {
  if (values.loopType !== 'research' && values.loopType !== 'review') {
    throw new UsageError(`unknown loop type '${values.loopType}'. Supported: research, review`);
  }
  const claudeReview = values.executor === 'cli-claude-code' && values.loopType === 'review';
  if (claudeReview && !hasFlag(values, 'claudeConfigDir')) {
    throw new UsageError("missing required flag '--claude-config-dir'");
  }
  if (!claudeReview && hasFlag(values, 'claudeConfigDir')) {
    throw new UsageError(
      "flag '--claude-config-dir' is only valid with --executor cli-claude-code --loop-type review",
    );
  }
  const harness = values.executor === 'cli-deepseek-harness';
  if (harness && !hasFlag(values, 'specFolder')) {
    throw new UsageError("missing required flag '--spec-folder'");
  }
  if (!harness && hasFlag(values, 'specFolder')) {
    throw new UsageError("flag '--spec-folder' is only valid with --executor cli-deepseek-harness");
  }
}

function usageExit(reason) {
  process.stderr.write(`${USAGE}\n${reason}\n`);
  return 64;
}

// ───────────────────────────────────────────────────────────────────
// 4. SHARED HELPERS
// ───────────────────────────────────────────────────────────────────

// The orchestrator renders an unset config value as the literal string "null".
function nullable(value) {
  return value === 'null' ? null : value;
}

function buildContext(values) {
  const loopType = values.loopType;
  return {
    executorKind: values.executor,
    loopType,
    agent: loopType === 'research' ? 'deep-research' : 'deep-review',
    repoRoot: values.repoRoot,
    promptFile: values.promptFile,
    stateLogPath: values.stateLog,
    packetDir: values.packetDir,
    artifactDir: values.artifactDir,
    iteration: Number(values.iteration),
    generation: values.generation,
    sessionId: values.sessionId,
    model: values.model,
    reasoningEffort: nullable(values.reasoningEffort),
    serviceTier: nullable(values.serviceTier),
    sandboxMode: nullable(values.sandboxMode),
    timeoutSeconds: Number(values.timeoutSeconds),
    claudeConfigDir: hasFlag(values, 'claudeConfigDir') ? values.claudeConfigDir : '',
    specFolder: hasFlag(values, 'specFolder') ? values.specFolder : '',
    dispatchId: `${loopType}-i${values.iteration}-g${values.generation}`,
    receiptDir: `${values.packetDir}/dispatch-receipts`,
  };
}

function readPrompt(context) {
  return withAgentPersona(
    context.agent,
    fs.readFileSync(context.promptFile, 'utf8'),
    context.repoRoot,
  );
}

// The artifact-dir boundary is prompt-only, so a workspace-write leaf can write anywhere
// in the repo. Snapshot the already-dirty set before the dispatch, diff it after, and
// report every NEW out-of-artifact-dir path. A violation is left on disk and never made
// fatal here: what the run does about it is the verdict's to decide.
//
// This appends its rows to the state log, so a caller that drains a staged-event
// gateway around the dispatch must call it after that drain: the gateway rewrites
// the log from its ledger and would drop rows appended before it runs.
function reportWriteContainment({
  preDispatchDirtyPaths,
  repoRoot,
  artifactDir,
  stateLogPath,
  iteration,
  label,
}) {
  const containment = enforceWriteContainment({
    repoRoot,
    artifactDir,
    preDispatchDirtyPaths,
    stateLogPath,
    iteration,
    label,
  });
  if (containment.violations.length > 0) {
    console.error(
      'write-containment advisory: detected ' + containment.violations.length
        + ' out-of-scope path(s), left on disk: '
        + containment.violations.map((v) => v.path).join(', '),
    );
  }
  // A path that was already dirty before the dispatch and changed during it is held out of
  // violations. enforceWriteContainment records it in the state log as containment_contested;
  // this prints it so the run's own output says so too.
  if (containment.contested.length > 0) {
    console.error(
      'write-containment contested: ' + containment.contested.length
        + ' path(s) already dirty before the dispatch changed during it, left on disk: '
        + containment.contested.map((v) => v.path).join(', ')
        + '\n' + containment.contestedNote,
    );
  }
}

function dispatchWithContainment({
  dispatch,
  repoRoot,
  artifactDir,
  stateLogPath,
  iteration,
  label,
}) {
  const preDispatchDirtyPaths = snapshotOutOfScopeDirtyPaths({ repoRoot, artifactDir });
  const dispatchExit = runAuditedExecutorCommand(dispatch);
  reportWriteContainment({
    preDispatchDirtyPaths,
    repoRoot,
    artifactDir,
    stateLogPath,
    iteration,
    label,
  });
  return dispatchExit;
}

// ───────────────────────────────────────────────────────────────────
// 5. EXECUTOR HANDLERS
// ───────────────────────────────────────────────────────────────────

function runClaude(context) {
  // The review inline body validated the config dir before it read the prompt, so an
  // unusable config directory fails before any prompt or persona file is touched.
  const configDir = context.loopType === 'review' && context.claudeConfigDir
    ? validateClaudeConfigDir(context.claudeConfigDir)
    : '';
  const promptBody = readPrompt(context);

  if (context.loopType === 'review') {
    const executor = {
      kind: 'cli-claude-code',
      model: context.model,
      configDir: configDir || null,
      reasoningEffort: context.reasoningEffort,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: context.timeoutSeconds,
      governor: null,
    };
    const args = [
      '-p',
      promptBody,
      '--model',
      executor.model,
      '--permission-mode',
      'acceptEdits',
      '--output-format',
      'text',
    ];
    if (executor.reasoningEffort) {
      args.push('--effort', executor.reasoningEffort);
    }

    // CLAUDE_CONFIG_DIR rides through guardContext.env; the CLAUDE_ prefix is on the
    // cli-claude-code env allowlist so buildExecutorDispatchEnv admits it.
    const parentEnv = { ...process.env };
    if (configDir) {
      parentEnv.CLAUDE_CONFIG_DIR = configDir;
    }

    return runAuditedExecutorCommand({
      command: 'claude',
      args,
      cwd: context.repoRoot,
      timeoutSeconds: executor.timeoutSeconds,
      stateLogPath: context.stateLogPath,
      executor,
      iteration: context.iteration,
      guardContext: { env: parentEnv },
      receiptDir: context.receiptDir,
      dispatchId: context.dispatchId,
      sessionId: context.sessionId,
    });
  }

  const executor = {
    kind: 'cli-claude-code',
    model: context.model,
    reasoningEffort: context.reasoningEffort,
    serviceTier: context.serviceTier,
    sandboxMode: context.sandboxMode,
    timeoutSeconds: context.timeoutSeconds,
  };
  const args = [
    '-p',
    promptBody,
    '--model',
    executor.model,
    '--permission-mode',
    resolveClaudePermissionMode(executor.sandboxMode),
    '--output-format',
    'text',
  ];
  if (executor.reasoningEffort) {
    args.push('--effort', executor.reasoningEffort);
  }

  return runAuditedExecutorCommand({
    command: 'claude',
    args,
    cwd: context.repoRoot,
    timeoutSeconds: executor.timeoutSeconds,
    stateLogPath: context.stateLogPath,
    executor,
    iteration: context.iteration,
    receiptDir: context.receiptDir,
    dispatchId: context.dispatchId,
    sessionId: context.sessionId,
  });
}

function runLineageBuiltin(context) {
  const kind = context.executorKind;
  const model = nullable(context.model);
  const timeoutSeconds = context.timeoutSeconds;
  // The iteration must write its own iteration file, delta and state record, so the leaf
  // runs workspace-write; the builder maps that to each CLI's real write-permitting
  // headless flags.
  const sandboxMode = 'workspace-write';
  const reasoningEffort = kind === 'cli-pi' ? context.reasoningEffort : null;
  const lineage = { kind, model, sandboxMode };
  if (kind === 'cli-pi') {
    lineage.reasoningEffort = reasoningEffort;
  }
  const resolvedSandbox = resolveSandboxMode(sandboxMode);
  const resolvedPermission = resolveClaudePermissionMode(sandboxMode);

  const repoRoot = context.repoRoot;
  const promptBody = readPrompt(context);
  // cursor-agent/devin/pi have no single-executor branch of their own, so without this
  // they silently degrade to native. The command builder is the same one the fan-out
  // lineage path uses, so the enforced model allowlist, headless write-mode flags and
  // binary preflight stay one source of truth. It throws (fail closed) when the binary is
  // absent or the model is off the allowlist, so a requested CLI executor never becomes
  // native.
  const { command, args, input } = buildLineageCommand(
    lineage,
    promptBody,
    resolvedSandbox,
    resolvedPermission,
    { env: process.env, cwd: repoRoot },
  );

  const executor = {
    kind,
    model,
    configDir: null,
    reasoningEffort,
    serviceTier: null,
    sandboxMode,
    timeoutSeconds,
    governor: null,
  };

  return dispatchWithContainment({
    dispatch: {
      command,
      args,
      cwd: repoRoot,
      timeoutSeconds,
      stateLogPath: context.stateLogPath,
      executor,
      iteration: context.iteration,
      input,
      receiptDir: context.receiptDir,
      dispatchId: context.dispatchId,
      sessionId: context.sessionId,
    },
    repoRoot,
    artifactDir: context.artifactDir,
    stateLogPath: context.stateLogPath,
    iteration: context.iteration,
    label: context.dispatchId,
  });
}

function runResearchOpencode(context) {
  const reasoningEffort = context.reasoningEffort;
  const model = nullable(context.model);
  const sandboxMode = context.sandboxMode === null ? 'danger-full-access' : context.sandboxMode;
  const executor = {
    kind: 'cli-opencode',
    model,
    configDir: null,
    reasoningEffort,
    serviceTier: null,
    sandboxMode,
    timeoutSeconds: context.timeoutSeconds,
    governor: null,
  };
  const promptBody = readPrompt(context);
  const message = RESEARCH_PREAMBLE + '\n\n' + promptBody;

  const lineage = { kind: 'cli-opencode', model, reasoningEffort, sandboxMode };
  const resolvedPermission = resolveClaudePermissionMode(sandboxMode);
  const repoRoot = context.repoRoot;
  const { command, args, input, cwd } = buildLineageCommand(
    lineage,
    message,
    sandboxMode,
    resolvedPermission,
    { env: process.env, cwd: repoRoot, directoryRoot: repoRoot },
  );

  return dispatchWithContainment({
    dispatch: {
      command,
      args,
      cwd: cwd || repoRoot,
      timeoutSeconds: executor.timeoutSeconds,
      stateLogPath: context.stateLogPath,
      executor,
      iteration: context.iteration,
      // buildLineageCommand returns empty input, so stdin is closed for OpenCode.
      input,
      receiptDir: context.receiptDir,
      dispatchId: context.dispatchId,
      sessionId: context.sessionId,
    },
    repoRoot,
    artifactDir: context.artifactDir,
    stateLogPath: context.stateLogPath,
    iteration: context.iteration,
    label: context.dispatchId,
  });
}

function runDeepseekHarness(context) {
  const kind = 'cli-deepseek-harness';
  const model = nullable(context.model);
  const timeoutSeconds = context.timeoutSeconds;
  // The iteration must write its own iteration file, delta and state record,
  // so the leaf runs workspace-write.
  const sandboxMode = 'workspace-write';
  const reasoningEffort = context.reasoningEffort;
  const lineage = { kind, model, sandboxMode, reasoningEffort };
  const resolvedSandbox = resolveSandboxMode(sandboxMode);
  const resolvedPermission = resolveClaudePermissionMode(sandboxMode);

  const repoRoot = context.repoRoot;
  const artifactDir = context.artifactDir;
  // The prompt pack says every path is relative to the repo root and calls the append
  // gateway by a repo-relative path, but the harness starts in the artifact folder, so
  // the prompt names the root and tells the leaf to run commands from it.
  const promptBody = 'REPOSITORY ROOT: ' + repoRoot + '. Resolve every relative path in this prompt '
    + 'against it and run every command as `cd ' + repoRoot + ' && <command>`.\n\n'
    + readPrompt(context);
  // The command builder is the one the fan-out lineage path uses, so the pinned harness
  // release, the model allowlist, the route, lineage and guards patches and the headless
  // write flags stay one source of truth. It throws (fail closed) when the harness binary
  // is absent or off its pinned release, or the model is off the allowlist, so a requested
  // harness executor never becomes native. The headless harness reads the dotenv file in
  // its working directory and the repository root holds one, so the builder starts it in
  // the artifact folder and the dispatch runs from the cwd it returns.
  const { command, args, input, cwd } = buildLineageCommand(
    lineage,
    promptBody,
    resolvedSandbox,
    resolvedPermission,
    { env: process.env, cwd: repoRoot, lineageDir: artifactDir, repoRoot },
  );

  const executor = {
    kind,
    model,
    configDir: null,
    reasoningEffort,
    serviceTier: null,
    sandboxMode,
    timeoutSeconds,
    governor: null,
  };
  // The step timeout equals the executor timeout, so the child gets a shorter one. An
  // outer kill while the child still runs would skip the finally block and strand the home.
  const dispatchTimeoutSeconds = Math.max(Math.ceil(timeoutSeconds / 2), timeoutSeconds - 30);
  const preDispatchDirtyPaths = snapshotOutOfScopeDirtyPaths({ repoRoot, artifactDir });
  // The harness writes profiles and an anonymous id into its home, so every run gets a
  // fresh one outside the checkout, removed once the run settles. The env allowlist drops
  // every DSH_ key, so the home and the absolute spec folder the repo-guards goal bridge
  // reads ride in dispatchEnv. DSH_HOME on this process would instead trip the
  // nested-dispatch guard.
  sweepStaleDshHomes();
  const dshHome = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-home-'));
  let dispatchExit;
  try {
    dispatchExit = runAuditedExecutorCommand({
      command,
      args,
      cwd,
      timeoutSeconds: dispatchTimeoutSeconds,
      stateLogPath: context.stateLogPath,
      executor,
      iteration: context.iteration,
      input,
      receiptDir: context.receiptDir,
      dispatchId: context.dispatchId,
      sessionId: context.sessionId,
      dispatchEnv: {
        DSH_HOME: dshHome,
        DSH_SPEC_FOLDER: path.resolve(repoRoot, context.specFolder),
        // The leaf has no user turn to answer the spec gate, and ENFORCE=0 alone only stops
        // the deny, so DISABLED makes classify and enforce no-ops, as in fan-out.
        SYSTEM_SPEC_GATE_DISABLED: '1',
        AI_SESSION_CHILD: '1',
      },
      // The harness can exit 0 after a guard plugin failed to load, so its event stream
      // and stderr are judged as well as its exit code.
      completionCheck: validateDshCompletion,
      echoStdout: false,
    });
  } finally {
    fs.rmSync(dshHome, { recursive: true, force: true });
  }
  reportWriteContainment({
    preDispatchDirtyPaths,
    repoRoot,
    artifactDir,
    stateLogPath: context.stateLogPath,
    iteration: context.iteration,
    label: context.dispatchId,
  });
  return dispatchExit;
}

// ───────────────────────────────────────────────────────────────────
// 6. REVIEW OPENCODE PREFLIGHT
// ───────────────────────────────────────────────────────────────────

function runGit(args, cwd, trim = true) {
  const output = execFileSync('git', args, { cwd, encoding: 'utf8' });
  return trim ? output.trim() : output;
}

function canonicalLocation(absolutePath) {
  try {
    return fs.realpathSync(absolutePath);
  } catch {
    let parentReal;
    try {
      parentReal = fs.realpathSync(path.dirname(absolutePath));
    } catch {
      return absolutePath;
    }
    const leaf = path.resolve(parentReal, path.basename(absolutePath));
    try {
      // A dangling link still names the location it points at, and becomes a live escape
      // the moment that target is created.
      const target = fs.readlinkSync(leaf);
      return path.isAbsolute(target) ? path.resolve(target) : path.resolve(parentReal, target);
    } catch {
      return leaf;
    }
  }
}

function stageAndDispatchReviewOpencode(context, eventDir) {
  const promptBody = readPrompt(context);
  if (!promptBody.includes('BANNED OPERATIONS') || !promptBody.includes('ALLOWED WRITE PATHS')) {
    throw new Error(
      'Unsafe cli-opencode dispatch: rendered prompt is missing required write-containment sections',
    );
  }

  const repoRoot = fs.realpathSync(context.repoRoot);
  const artifactDir = path.resolve(repoRoot, context.packetDir);
  const artifactRelative = path.relative(repoRoot, artifactDir);
  if (artifactRelative === '' || artifactRelative.startsWith('..') || path.isAbsolute(artifactRelative)) {
    throw new Error(
      'Unsafe cli-opencode dispatch: artifact directory must be a strict descendant of the worktree root',
    );
  }

  const resolveGitPath = (candidate) =>
    fs.realpathSync(path.isAbsolute(candidate) ? candidate : path.resolve(repoRoot, candidate));
  const gitDir = resolveGitPath(runGit(['rev-parse', '--git-dir'], repoRoot));
  const commonGitDir = resolveGitPath(runGit(['rev-parse', '--git-common-dir'], repoRoot));
  if (gitDir === commonGitDir) {
    throw new Error('Unsafe cli-opencode dispatch: --dir must point at an isolated linked worktree');
  }

  const primaryBlock = runGit(['worktree', 'list', '--porcelain'], repoRoot)
    .split(/\n\n+/)
    .find((block) => /^branch refs\/heads\/(?:main|master)$/m.test(block));
  const primaryLine = primaryBlock?.split('\n').find((line) => line.startsWith('worktree '));
  if (!primaryLine) {
    throw new Error('Unsafe cli-opencode dispatch: primary main/master worktree could not be resolved');
  }
  const primaryRoot = fs.realpathSync(primaryLine.slice('worktree '.length));
  const primaryStatus = runGit(
    ['status', '--porcelain=v1', '--untracked-files=all'],
    primaryRoot,
  );
  if (primaryStatus) {
    throw new Error(
      'Unsafe cli-opencode dispatch: primary worktree must be clean before unrestricted execution',
    );
  }

  const dirtyPaths = [
    ...runGit(['diff', '--name-only', '-z', 'HEAD', '--'], repoRoot, false).split('\0'),
    ...runGit(['ls-files', '--others', '--exclude-standard', '-z'], repoRoot, false).split('\0'),
  ].filter(Boolean);
  const artifactDirReal = canonicalLocation(artifactDir);
  // git reports the path it walked, not where the bytes land: a symlink component under
  // the artifact dir leaves a path that looks contained while its real location is
  // wherever the link points. Containment has to hold both by name and after every
  // component is resolved, so resolution can only ever narrow scope.
  const escapesArtifactDir = (absolutePath) => {
    const lexical = path.relative(artifactDir, absolutePath);
    if (lexical.startsWith('..') || path.isAbsolute(lexical)) return true;
    const canonical = path.relative(artifactDirReal, canonicalLocation(absolutePath));
    return canonical.startsWith('..') || path.isAbsolute(canonical);
  };
  const outsideArtifactDir = dirtyPaths.filter((candidate) =>
    escapesArtifactDir(path.resolve(repoRoot, candidate)));
  if (outsideArtifactDir.length > 0) {
    throw new Error(
      'Unsafe cli-opencode dispatch: worktree changes outside the artifact directory: '
        + outsideArtifactDir.join(', '),
    );
  }

  const recoveryBaselineCommit = runGit(['rev-parse', '--verify', 'HEAD'], repoRoot);
  // The state log is a projection the gateway rebuilds from the ledger, so the recovery
  // baseline is staged as a canonical ledger event for the wrapper below to append; a
  // write beside the projection is dropped by the next refresh.
  fs.writeFileSync(
    path.join(eventDir, '01-recovery_baseline.json'),
    JSON.stringify({
      stem: 'deep_review.recovery_baseline',
      scope: { runId: context.sessionId, sessionId: context.sessionId },
      data: {
        mode: 'review',
        iteration: context.iteration,
        recoveryBaselineCommit,
        worktree: repoRoot,
      },
    }),
    'utf8',
  );

  const message = REVIEW_PREAMBLE + '\n\n' + promptBody;
  const reasoningEffort = context.reasoningEffort;
  const model = nullable(context.model);
  const sandboxMode = context.sandboxMode === null ? 'danger-full-access' : context.sandboxMode;
  const lineage = { kind: 'cli-opencode', model, reasoningEffort, sandboxMode };
  const resolvedPermission = resolveClaudePermissionMode(sandboxMode);
  const { command, args, input, cwd } = buildLineageCommand(
    lineage,
    message,
    sandboxMode,
    resolvedPermission,
    { env: process.env, cwd: repoRoot, directoryRoot: repoRoot },
  );

  const executor = {
    kind: 'cli-opencode',
    model,
    configDir: null,
    reasoningEffort,
    serviceTier: null,
    sandboxMode,
    timeoutSeconds: context.timeoutSeconds,
    governor: null,
  };

  const dispatch = {
    command,
    args,
    cwd: cwd || repoRoot,
    timeoutSeconds: executor.timeoutSeconds,
    stateLogPath: context.stateLogPath,
    executor,
    iteration: context.iteration,
    // buildLineageCommand returns empty input, so stdin is closed for OpenCode.
    input,
    receiptDir: context.receiptDir,
    dispatchId: context.dispatchId,
    sessionId: context.sessionId,
  };
  // The caller reports containment after the staged-event drain: the gateway rewrites
  // the state log from its ledger, so a row appended before the drain is lost.
  const preDispatchDirtyPaths = snapshotOutOfScopeDirtyPaths({ repoRoot, artifactDir });
  const dispatchExit = runAuditedExecutorCommand(dispatch);
  return { dispatchExit, preDispatchDirtyPaths, repoRoot, artifactDir };
}

function runReviewOpencode(context) {
  const eventDir = fs.mkdtempSync(
    path.join(process.env.TMPDIR || '/tmp', REVIEW_BASELINE_PREFIX),
  );
  let dispatchStatus = 1;
  let drainStatus = 0;
  let dispatched = null;
  try {
    dispatched = stageAndDispatchReviewOpencode(context, eventDir);
    dispatchStatus = dispatched.dispatchExit;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    dispatchStatus = 1;
  } finally {
    drainStatus = drainStagedEvents({
      eventDir,
      mode: 'review',
      runDirectory: path.dirname(context.stateLogPath),
      gatewayPath: path.join(__dirname, 'append-mode-event.cjs'),
    });
  }
  // Runs after the drain so the rows it appends survive the gateway's rewrite of the
  // state log, and only when a dispatch actually happened: a preflight guard that threw
  // has no snapshot to diff and no dispatch to report on.
  if (dispatched !== null) {
    reportWriteContainment({
      preDispatchDirtyPaths: dispatched.preDispatchDirtyPaths,
      repoRoot: dispatched.repoRoot,
      artifactDir: dispatched.artifactDir,
      stateLogPath: context.stateLogPath,
      iteration: context.iteration,
      label: context.dispatchId,
    });
  }
  return drainStatus !== 0 ? drainStatus : dispatchStatus;
}

// ───────────────────────────────────────────────────────────────────
// 7. STAGED EVENT DRAIN
// ───────────────────────────────────────────────────────────────────

// The status a gateway child's death maps to. A child killed by a signal reports
// 128 plus the signal number, the status the shell loop's `$?` carried; a signal
// this runtime cannot name, or a death with neither status nor signal, reports 1.
function gatewayExitStatus(result) {
  if (result.status !== null) return result.status;
  const signalNumber = result.signal === null
    ? undefined
    : os.constants.signals[result.signal];
  return typeof signalNumber === 'number' ? 128 + signalNumber : 1;
}

function drainStagedEvents({ eventDir, mode, runDirectory, gatewayPath }) {
  let status = 0;
  const eventFiles = fs
    .readdirSync(eventDir)
    .filter((name) => name.endsWith('.json'))
    .sort();
  for (const name of eventFiles) {
    const result = spawnSync(
      process.execPath,
      [
        gatewayPath,
        '--mode',
        mode,
        '--run-directory',
        runDirectory,
        '--event-json',
        path.join(eventDir, name),
      ],
      { stdio: 'inherit' },
    );
    if (result.status !== 0) {
      status = gatewayExitStatus(result);
      break;
    }
  }
  fs.rmSync(eventDir, { recursive: true, force: true });
  return status;
}

// ───────────────────────────────────────────────────────────────────
// 8. CODEX
// ───────────────────────────────────────────────────────────────────

function runCodex(context) {
  // Fail closed: a requested codex executor must dispatch codex or abort, never silently
  // degrade to another executor. Undetected absence is what got Codex deprecated before,
  // so the branch exits non-zero when the binary is missing instead of falling through to
  // a native/other path.
  let codexAvailable = false;
  try {
    execFileSync('/bin/sh', ['-c', 'command -v codex >/dev/null 2>&1'], { stdio: 'ignore' });
    codexAvailable = true;
  } catch {}
  if (!codexAvailable) {
    console.error('cli-codex executor unavailable: command -v codex failed');
    return 1;
  }

  const executor = {
    kind: 'cli-codex',
    model: nullable(context.model),
    configDir: null,
    reasoningEffort: context.reasoningEffort,
    serviceTier: context.serviceTier,
    sandboxMode: 'workspace-write',
    timeoutSeconds: context.timeoutSeconds,
    governor: null,
  };

  // Refuse before any spawn and before any receipt is written, so a refusal can never be
  // mistaken for a real attempt. A process that is already a CLI lineage or a codex
  // session must run the iteration itself, not delegate it onward.
  const guardVerdict = validateExecutorDispatchAllowed(executor, { env: process.env });
  if (!guardVerdict.allowed) {
    console.error(formatRecursionGuardRefusal(guardVerdict, executor));
    return RECURSION_GUARD_EXIT_CODE;
  }

  const promptBody = readPrompt(context);
  // codex reads the iteration prompt from stdin via the trailing '-'. The iteration must
  // WRITE its own iteration file, delta and state record, so the sandbox is
  // workspace-write. Read-only would block those required writes. approval_policy=never
  // keeps the run non-interactive.
  const args = ['exec'];
  if (executor.model) {
    args.push('--model', executor.model);
  }
  args.push('-c', 'model_reasoning_effort=' + (executor.reasoningEffort || 'medium'));
  if (executor.serviceTier) {
    args.push('-c', 'service_tier=' + executor.serviceTier);
  }
  args.push('-c', 'approval_policy=never', '--sandbox', executor.sandboxMode, '-');

  return dispatchWithContainment({
    dispatch: {
      command: 'codex',
      args,
      cwd: context.repoRoot,
      timeoutSeconds: executor.timeoutSeconds,
      stateLogPath: context.stateLogPath,
      executor,
      iteration: context.iteration,
      input: promptBody,
      receiptDir: context.receiptDir,
      dispatchId: context.dispatchId,
      sessionId: context.sessionId,
    },
    repoRoot: context.repoRoot,
    artifactDir: context.artifactDir,
    stateLogPath: context.stateLogPath,
    iteration: context.iteration,
    label: context.dispatchId,
  });
}

// ───────────────────────────────────────────────────────────────────
// 9. MAIN
// ───────────────────────────────────────────────────────────────────

function runDispatch(values) {
  const context = buildContext(values);
  switch (context.executorKind) {
    case 'cli-claude-code':
      return runClaude(context);
    case 'cli-cursor':
    case 'cli-devin':
    case 'cli-pi':
      return runLineageBuiltin(context);
    case 'cli-opencode':
      return context.loopType === 'review'
        ? runReviewOpencode(context)
        : runResearchOpencode(context);
    case 'cli-codex':
      return runCodex(context);
    case 'cli-deepseek-harness':
      return runDeepseekHarness(context);
    default:
      throw new Error(`unhandled executor kind '${context.executorKind}'`);
  }
}

function main(argv) {
  let values;
  try {
    values = parseArgs(argv);
    if (!hasFlag(values, 'executor')) {
      throw new UsageError("missing required flag '--executor'");
    }
    if (!EXECUTOR_KINDS.includes(values.executor)) {
      throw new UsageError(
        `unknown executor kind '${values.executor}'. Supported kinds: ${EXECUTOR_KINDS.join(', ')}`,
      );
    }
  } catch (error) {
    if (error instanceof UsageError) return usageExit(error.message);
    throw error;
  }

  if (values.executor === 'native') {
    console.error(NATIVE_REFUSAL);
    return 64;
  }

  try {
    requireFlags(values);
    validateFlags(values);
  } catch (error) {
    if (error instanceof UsageError) return usageExit(error.message);
    throw error;
  }

  return runDispatch(values);
}

if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

// ───────────────────────────────────────────────────────────────────
// 10. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = {
  drainStagedEvents,
  main,
  parseArgs,
};
