// ───────────────────────────────────────────────────────────────────
// MODULE: launchd Installer
// ───────────────────────────────────────────────────────────────────
//
// The one module that writes a job file into ~/Library/LaunchAgents or calls
// launchctl. A schedule is the moment an unattended agent gains a trigger, so
// every install reruns a preflight (runner, switches, identity, checker,
// posture) and refuses before it writes anything, and every write goes
// through one transaction: render to a private temp file, lint it, boot out
// the old job, move the file into place, bootstrap, print, read back.
//
// A first install is held disabled. The hold is the scheduler's own disable
// override, set before the job file lands, so a login that loads every file
// in the folder still skips it. Whether that hold came from a first install
// or from an operator's kill switch is kept in the install record, because
// the scheduler's disabled list shows both the same way. A kill switch is
// never lifted here without `bots enable`, and no path uses the load
// subcommand, whose write flag overrides a disable and whose force flag
// ignores it.
//
// Each install also writes an install record under the user-level state
// root: what the job runs, the real path it resolved to, the kind of
// `.skilled` and a vendored tree's pin. A moved checkout, a retargeted link
// or a re-pin leaves the job file stale without moving it, so a read-only
// check compares each record with the tree as it is now and names what
// needs a reinstall.
//
// launchd starts a job with its bare PATH, the account's home and the job
// file's own values, never the installing shell's environment. Any input the
// identity or state-root resolvers read from a shell (a CI repository name,
// an overridden HOME, a git variable) could make a fired job land elsewhere
// than the verbs that steer it. So the job's environment is built in one
// place, the install compares what the shell and that environment resolve
// and refuses when they differ, and every verb resolves under that built
// environment rather than the shell's.

import { spawnSync } from 'node:child_process';
import { accessSync, constants, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir, userInfo } from 'node:os';
import { delimiter, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

import { writeStateAtomic, writeTextAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { EXECUTOR_ADAPTER_CAPABILITIES } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import { PINNED_OPERATOR_ENV, resolveActor } from './actor.js';
import { approveDefinition, digestOf } from './approval.js';
import { translateCron } from './cron-translator.js';
import { parseDefinition } from './definition.js';
import { identityGuard, identityKey, PINNED_IDENTITY_ENV } from './identity.js';
import { buildBotLabel, buildDrainLabel, LABEL_PREFIX, parseLabel, RESERVED_BOT_IDS } from './label.js';
import { FULL_ACCESS_ENV, pinnedFromPlist, renderBotPlist, renderDrainPlist, sameSchedule, scheduleFromPlist, stateHomeFromPlist } from './plist-render.js';
import { validatePosture } from './posture.js';
import { readRepoConfig } from './repo-config.js';
import { drainQueue } from './request-drain.js';
import { definitionPath } from './runner.js';
import {
  agentLogFile,
  checkRunFolder,
  drainBackoffFile,
  ensureIdentityState,
  identityStatePaths,
  installFile,
  PINNED_STATE_ROOT_ENV,
  readRegisteredRoots,
  registerRoot,
  REQUEST_FOLDERS,
  sharedStatePaths,
  slotSnapshotFile,
  STATE_DIR_MODE,
  userStateRoot,
} from './state-root.js';
import { readSwitch } from './switches.js';

import type { Translation } from './cron-translator.js';
import type { BotDefinition } from './definition.js';
import type { PinnedJobValues } from './plist-render.js';
import type { ParsedLabel } from './label.js';
import type { RepoConfig, Result } from './repo-config.js';
import type { DrainInput, DrainReport } from './request-drain.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The id an install, enable or uninstall uses for the repository's queue-drain job. */
export const DRAIN_ID = RESERVED_BOT_IDS[0] as string;

/** Least seconds between two starts of the drain job. launchd's own default is 10. */
export const DRAIN_THROTTLE_SECONDS = 60;

/** A scheduled drain that stopped on a setup fault waits this long, doubling per fault, up to the cap. */
export const DRAIN_BACKOFF_BASE_SECONDS = 300;
export const DRAIN_BACKOFF_MAX_SECONDS = 3_600;

/** The next fire time is never computed: no launchd surface reports it. */
export const NEXT_FIRE_UNKNOWN = 'UNKNOWN';

/** An install from a shell whose state root differs from the one the installed jobs use. */
export const STATE_HOME_CHANGED = 'state-home-changed';

/** An install from a checkout whose installed job carries a label built from an identity other than the one resolved now. */
export const IDENTITY_CHANGED = 'identity-changed';

/** An install whose job, under its own environment, would resolve another identity or state root than the installing shell. */
export const JOB_ENV_DIVERGES = 'job-env-diverges';

/** The PATH launchd gives a per-user job. */
export const LAUNCHD_PATH = '/usr/bin:/bin:/usr/sbin:/sbin';

/** The reason a transaction step failed after the preflight passed. */
export const INSTALL_STEP_FAILED = 'install-step-failed';

/** Where the hub's CLI sits under a repository root. */
const RUNNER_RELATIVE = join('.skilled', 'bin', 'bots.cjs');

/** The runtime package the CLI loads, relative to the CLI's real folder. */
const RUNTIME_FROM_BIN = join('..', 'skills', 'system-skilled-bots', 'runtime');

/** The definition checker, beside this runtime. */
const CHECKER_PATH = resolve(import.meta.dirname, '..', '..', 'scripts', 'bot-check.cjs');

const OVERLAY_SETTING_FILE = '.skilled-overlays.json';
const DEFAULT_OVERLAY_FOLDER = 'skilled-overlays';
const OVERLAY_MANIFEST_FILE = 'overlay-manifest.json';

const COMMAND_TIMEOUT_MS = 30_000;
const CHECKER_TIMEOUT_MS = 120_000;
const PREFLIGHT_RUN_ID = 'install-preflight';

/** How `.skilled` reaches a repository: its own folder, a link to a Skilled checkout, or a vendored copy. */
export const SKILLED_KINDS = ['checkout', 'symlink', 'vendored'] as const;

export type SkilledKind = (typeof SKILLED_KINDS)[number];

/**
 * Why a job is held disabled. `first-install` and `definition` are holds the
 * installer set itself; `operator` is a kill switch set by `bots disable`.
 */
export type Hold = 'first-install' | 'definition' | 'operator';

/** The reasons the read-only check gives for a schedule that needs a reinstall. */
export const REINSTALL_REASONS = ['runner-missing', 'runner-retargeted', 'kind-changed', 'pin-changed', 'record-missing', 'identity-changed', 'state-root-changed', 'executor-missing'] as const;

export type ReinstallReason = (typeof REINSTALL_REASONS)[number];

/** One process call's outcome. */
export interface CommandResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

/**
 * Everything that reaches outside the process. Tests replace each with a
 * stub in a temp folder; the defaults are the real host.
 */
export interface InstallerSeams {
  /** The per-user agents folder. */
  agentsDir: string;
  /** The account's home from the user database: the HOME launchd gives a job. */
  accountHome: string;
  /** The launchd domain of the current user, such as `gui/501`. */
  domain: string;
  launchctl(args: string[]): CommandResult;
  plutil(args: string[]): CommandResult;
  /** Runs the definition checker over a checkout. */
  checker(checkoutRoot: string, env: NodeJS.ProcessEnv): { exitCode: number; lines: string[] };
}

/** What `.skilled` resolves to in one repository. */
export interface SkilledTreeInfo {
  kind: SkilledKind;
  /** `<repo root>/.skilled/bin/bots.cjs`. */
  repoRunnerPath: string;
  /** The real path that resolves to. */
  repoRunnerRealPath: string;
  /** The folder that really holds `.skilled`. */
  treeRoot: string;
  /** The overlay manifest's `pin.commit`, for a vendored tree only. */
  pinCommit: string | null;
}

/** One install record per bot, and one for the drain job. */
export interface InstallRecord {
  schemaVersion: 1;
  agent: 'bot' | 'drain';
  botId: string;
  identity: string;
  labels: string[];
  plistPaths: string[];
  checkoutRoot: string;
  interpreter: string;
  /** The runner path written into the job file: the real path at install time. */
  plistRunnerPath: string;
  repoRunnerPath: string;
  repoRunnerRealPath: string;
  treeRoot: string;
  /** The Skilled tree passed to the runner, whose run root takes the run folders. */
  skilledTree: string;
  skilledKind: SkilledKind;
  pinCommit: string | null;
  /**
   * The bot's executor as the installing shell resolved it. launchd starts a job
   * with a bare PATH, so a scheduled fire finds its executor through this path;
   * null for the drain job, and the path is null when the shell could not resolve it.
   * Absent in records written before the field existed.
   */
  executor?: ExecutorPin | null;
  /**
   * The drain job's executors: every kind whose binary the installing shell
   * resolved, since the queue may hold a request for any enabled bot. Absent
   * on a bot's record.
   */
  executors?: ExecutorPin[];
  schedule: { expression: string; scheduleIndex: number } | null;
  hold: Hold | null;
  installedAt: string;
  enabledAt: string | null;
  /** The installing operator, the actor a scheduled run of this bot records. Absent in a record written before installs named anyone, which reads as null. */
  operator?: string | null;
  /** True only when the operator installed the bot with full access. Absent reads as false, so a declared danger-full-access is capped. */
  fullAccess?: boolean;
}

/** An executor kind and the absolute path its binary resolved to at install. */
export interface ExecutorPin {
  kind: string;
  path: string | null;
}

/** One step of a transaction, as the report shows it. */
export interface StepRecord {
  step: string;
  status: number | null;
  detail: string | null;
}

export interface InstallInput {
  checkoutRoot: string;
  /** The Skilled tree the job's runs use; never a linked worktree. */
  skilledTree: string;
  /** A bot id, or `drain` for the repository's queue-drain job. */
  botId: string;
  env?: NodeJS.ProcessEnv;
  /** The interpreter written into the job; defaults to this process's own. */
  interpreter?: string;
  /** The operator's full-access grant, from bots schedule install --full-access. The command line refuses it without a tty. */
  fullAccess?: boolean;
  seams?: Partial<InstallerSeams>;
  now?: Date;
}

export interface InstallReport {
  botId: string;
  labels: string[];
  plistPaths: string[];
  hold: Hold | null;
  loaded: boolean;
  steps: StepRecord[];
  nextFire: typeof NEXT_FIRE_UNKNOWN;
  record: InstallRecord;
  check: InstallCheck;
  /** Set when only the full-access grant was recorded, for a bot whose trigger is not cron, so no job file was written. */
  recordedOnly?: { triggerKind: string };
}

/** The check's verdict for one bot. */
export interface InstallCheck {
  botId: string;
  labels: string[];
  status: 'ok' | 'needs-reinstall';
  reasons: ReinstallReason[];
}

interface Preflight {
  agent: 'bot' | 'drain';
  identity: string;
  stateRoot: string;
  /**
   * The XDG state home the job file carries: the state root's parent whenever
   * the config names no state root. A job started by launchd does not inherit
   * the shell's environment, so it carries this value to resolve the same root.
   */
  stateHome: string | null;
  config: RepoConfig;
  checkoutRoot: string;
  skilledTree: string;
  interpreter: string;
  tree: SkilledTreeInfo;
  definition: BotDefinition | null;
  /** The digest of the definition bytes the preflight vetted; null for the drain job. */
  definitionDigest: string | null;
  translation: Translation | null;
  label: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. SEAMS
// ───────────────────────────────────────────────────────────────────

function runCommand(file: string, args: string[]): CommandResult {
  const run = spawnSync(file, args, { encoding: 'utf8', timeout: COMMAND_TIMEOUT_MS });
  return {
    status: run.error !== undefined ? null : run.status,
    stdout: typeof run.stdout === 'string' ? run.stdout : '',
    stderr: run.error !== undefined ? run.error.message : typeof run.stderr === 'string' ? run.stderr : '',
  };
}

function runChecker(checkoutRoot: string, env: NodeJS.ProcessEnv): { exitCode: number; lines: string[] } {
  const run = spawnSync(process.execPath, [CHECKER_PATH, checkoutRoot], { env, encoding: 'utf8', timeout: CHECKER_TIMEOUT_MS });
  const lines = (typeof run.stdout === 'string' ? run.stdout : '').split('\n').filter((line) => line !== '');
  return { exitCode: run.status ?? 2, lines };
}

/**
 * The account's home as the user database records it. launchd gives a job
 * this home, never a shell's `HOME`, which an operator or a harness can
 * override. With no user database entry the process's own home is the only
 * answer left.
 */
export function accountHome(): string {
  try {
    return userInfo().homedir;
  } catch {
    return homedir();
  }
}

/** The real host: the account's agents folder, the GUI domain, `/bin/launchctl` and `/usr/bin/plutil`. */
export function defaultSeams(): InstallerSeams {
  const home = accountHome();
  const uid = typeof process.getuid === 'function' ? process.getuid() : 0;
  return {
    agentsDir: join(home, 'Library', 'LaunchAgents'),
    accountHome: home,
    domain: `gui/${uid}`,
    launchctl: (args) => runCommand('/bin/launchctl', args),
    plutil: (args) => runCommand('/usr/bin/plutil', args),
    checker: runChecker,
  };
}

function seamsFor(input: { seams?: Partial<InstallerSeams> }): InstallerSeams {
  return { ...defaultSeams(), ...input.seams };
}

/**
 * The values a job file carries in its environment: the state home, whenever
 * the config names no state root, so a fired job never falls back to a home
 * the installing shell did not use. A config state root needs none.
 */
export function jobEnvironmentVariables(config: Pick<RepoConfig, 'stateRoot'>, stateRoot: string): Record<string, string> {
  // The state root is the state home plus the tool folder, so its parent is the resolved, absolute state home.
  return config.stateRoot === null ? { XDG_STATE_HOME: dirname(stateRoot) } : {};
}

/**
 * Exactly the environment launchd starts a job with: the bare PATH, the
 * account's home and the job file's own values. Nothing comes from the
 * invoking shell, so whatever resolves under it is what a fired job resolves.
 */
export function launchdJobEnv(input: { accountHome: string; environmentVariables?: Record<string, string> | null }): NodeJS.ProcessEnv {
  return { PATH: LAUNCHD_PATH, HOME: input.accountHome, ...(input.environmentVariables ?? {}) };
}

// ───────────────────────────────────────────────────────────────────
// 3. SKILLED TREE KIND
// ───────────────────────────────────────────────────────────────────

function isWithin(root: string, path: string): boolean {
  const rel = relative(root, path);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel) && !rel.startsWith(`..${sep}`));
}

/** The overlay manifest of a vendored tree, found the way the overlay engine finds it. */
function overlayManifestPath(treeRoot: string): string {
  let folder = DEFAULT_OVERLAY_FOLDER;
  try {
    const setting = JSON.parse(readFileSync(join(treeRoot, OVERLAY_SETTING_FILE), 'utf8')) as { overlayDir?: unknown };
    if (typeof setting.overlayDir === 'string' && setting.overlayDir.trim() !== '') folder = setting.overlayDir;
  } catch {
    // No setting file, or one that does not read: the default folder applies, as it does for the engine.
  }
  return resolve(treeRoot, folder, OVERLAY_MANIFEST_FILE);
}

function readPinCommit(manifestPath: string): string | null {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { pin?: { commit?: unknown } };
    return typeof manifest.pin?.commit === 'string' ? manifest.pin.commit : null;
  } catch {
    return null;
  }
}

/**
 * Decide how `.skilled` reaches a repository.
 *
 * The kind comes from where the runner's real path lands, not from `.skilled`
 * itself, so a merged link (a real `.skilled` folder whose entries are links)
 * reads as `symlink` like a whole link does. A runner inside the repository
 * is `vendored` when an overlay manifest is found, and `checkout` otherwise.
 *
 * @returns The kind and the paths it was decided from, or `runner-unresolved`.
 */
export function detectSkilledTree(checkoutRoot: string): Result<SkilledTreeInfo> {
  const repoRunnerPath = join(resolve(checkoutRoot), RUNNER_RELATIVE);
  let repoRunnerRealPath: string;
  let repoReal: string;
  try {
    repoRunnerRealPath = realpathSync(repoRunnerPath);
    repoReal = realpathSync(checkoutRoot);
  } catch {
    return { ok: false, reason: 'runner-unresolved', detail: repoRunnerPath };
  }
  const treeRoot = dirname(dirname(dirname(repoRunnerRealPath)));
  if (!isWithin(repoReal, repoRunnerRealPath)) {
    return { ok: true, value: { kind: 'symlink', repoRunnerPath, repoRunnerRealPath, treeRoot, pinCommit: null } };
  }
  const manifest = overlayManifestPath(treeRoot);
  if (existsSync(manifest)) {
    return { ok: true, value: { kind: 'vendored', repoRunnerPath, repoRunnerRealPath, treeRoot, pinCommit: readPinCommit(manifest) } };
  }
  return { ok: true, value: { kind: 'checkout', repoRunnerPath, repoRunnerRealPath, treeRoot, pinCommit: null } };
}

// ───────────────────────────────────────────────────────────────────
// 4. PREFLIGHT
// ───────────────────────────────────────────────────────────────────

function isExecutableFile(path: string): boolean {
  try {
    accessSync(path, constants.X_OK);
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

/**
 * Check everything a scheduled fire will need, writing nothing outside the
 * user-level state root and nothing into the agents folder.
 *
 * Order: identity, runner and interpreter, the Skilled tree's run root, the
 * switches, the registered-roots file, then for a bot the checker, the
 * definition's schedule, its label and its posture.
 *
 * @returns What the transaction needs, or a refusal naming the failed check.
 */
function preflight(input: InstallInput, seams: InstallerSeams): Result<Preflight> {
  const env = input.env ?? process.env;
  const checkoutRoot = resolve(input.checkoutRoot);
  const agent = input.botId === DRAIN_ID ? 'drain' : 'bot';

  const config = readRepoConfig(checkoutRoot);
  if (!config.ok) return config;
  const identity = identityGuard(checkoutRoot, env);
  if (!identity.ok) return identity;

  const tree = detectSkilledTree(checkoutRoot);
  if (!tree.ok) return tree;
  const runtime = resolve(dirname(tree.value.repoRunnerRealPath), RUNTIME_FROM_BIN);
  if (!existsSync(join(runtime, 'node_modules', 'tsx', 'package.json'))) {
    return { ok: false, reason: 'runner-unresolved', detail: `${runtime} has no installed dependencies; run npm ci there` };
  }
  const interpreter = input.interpreter ?? process.execPath;
  if (!isAbsolute(interpreter) || !isExecutableFile(interpreter)) {
    return { ok: false, reason: 'interpreter-unresolved', detail: interpreter };
  }

  const stateRoot = userStateRoot(config.value, env);
  // A job installed under an identity the checkout no longer resolves keeps its own label, record and
  // switches; installing beside it would leave two jobs for one bot, one of them out of every verb's reach.
  const jobs = checkoutJobs(seams, checkoutRoot);
  const renamed = jobs.filter((job) => jobDrift(job, identity.value.identity, stateRoot) === 'identity-changed');
  if (renamed.length > 0) {
    const ids = [...new Set(renamed.map((job) => job.botId))].join(', ');
    return {
      ok: false,
      reason: IDENTITY_CHANGED,
      detail: `${renamed.map((job) => job.label).join(', ')} runs this checkout under an identity other than ${identity.value.identity}; run bots schedule uninstall for ${ids} first, then install again. Nothing changed`,
    };
  }
  // A reinstall from a shell with another state home would read no previous
  // record, skip the kill-switch guard and strand every switch, hold and lease
  // under the old root, so it is refused before anything is written. Adopting
  // the job's root silently is not done either: on a fresh install the shell
  // chooses it.
  // Like is compared with like: a shell resolving the checkout as it is now meets the job without its
  // pins, so a config edit since the install shows; a recheck under the job's pins keeps them.
  const pinned = pinsOf(env);
  const jobSide = jobEnv({ checkoutRoot, botId: input.botId, env, seams });
  const installedEnv = Object.keys(pinned).length > 0 ? jobSide : withoutPins(jobSide);
  const installedRoot = userStateRoot(config.value, installedEnv);
  if (installedRoot !== stateRoot) {
    const wanted = installedEnv.XDG_STATE_HOME?.trim() ? `XDG_STATE_HOME=${installedEnv.XDG_STATE_HOME}` : 'XDG_STATE_HOME unset';
    return {
      ok: false,
      reason: STATE_HOME_CHANGED,
      detail: `the installed jobs of this repository use the state root ${installedRoot}, and this shell resolves ${stateRoot}; run from a shell with ${wanted}, or run bots schedule uninstall for each installed job first. Nothing changed`,
    };
  }
  // A job written for another state root (a config stateRoot added after it, say) logs and watches
  // the old one, and its record, switches and queue stay there.
  const moved = jobs.find((job) => jobDrift(job, identity.value.identity, stateRoot) === 'state-root-changed');
  if (moved !== undefined) {
    return {
      ok: false,
      reason: STATE_HOME_CHANGED,
      detail: `${moved.label} was installed for another state root than ${stateRoot} (it logs to ${String(moved.job.StandardOutPath)}); run bots schedule uninstall ${moved.botId} first, then install again. Nothing changed`,
    };
  }
  // With no job installed yet, a switch set earlier under a default root this shell no longer
  // resolves would never reach the job: a pause stranded there is refused, not left behind.
  if (jobs.length === 0) {
    const stranded = strandedSwitches(seams, env, identity.value.identity, stateRoot);
    if (stranded !== null) {
      return {
        ok: false,
        reason: STATE_HOME_CHANGED,
        detail: `${stranded.root} holds switches for ${identity.value.identity} (${stranded.files.join(', ')}), and this shell resolves ${stateRoot}; clear them from a shell that resolves that root (bots resume or bots enable), or install from it. Nothing changed`,
      };
    }
  }
  // Outputs, not inputs, are compared: whatever the shell sets that the job will not see (a CI repository
  // name, another HOME, a git variable) shows up here as a different identity or state root.
  const environmentVariables = jobEnvironmentVariables(config.value, stateRoot);
  const builtEnv = launchdJobEnv({ accountHome: seams.accountHome, environmentVariables: { ...environmentVariables, ...pinned } });
  const jobIdentity = identityGuard(checkoutRoot, builtEnv);
  const jobRoot = userStateRoot(config.value, builtEnv);
  if (!jobIdentity.ok || identityKey(jobIdentity.value.identity) !== identityKey(identity.value.identity) || jobRoot !== stateRoot) {
    const jobSide = jobIdentity.ok ? jobIdentity.value.identity : jobIdentity.reason;
    return {
      ok: false,
      reason: JOB_ENV_DIVERGES,
      detail: `this shell resolves (${identity.value.identity}, ${stateRoot}) and the scheduled job, under launchd's environment, would resolve (${jobSide}, ${jobRoot}); declare "identity" and/or "stateRoot" in bots/config.json so both resolve the same. Nothing changed`,
    };
  }
  const stateHome = environmentVariables.XDG_STATE_HOME ?? null;
  const runFolder = checkRunFolder({ skilledTree: input.skilledTree, identity: identity.value.identity, runId: PREFLIGHT_RUN_ID });
  if (!runFolder.ok) {
    const hint = runFolder.reason === 'skilled-tree-is-worktree' ? ' (pass --skilled-tree naming the primary checkout)' : '';
    return { ok: false, reason: 'skilled-tree-refused', detail: `${runFolder.reason}${hint}` };
  }
  let skilledTree: string;
  try {
    skilledTree = realpathSync(input.skilledTree);
  } catch {
    return { ok: false, reason: 'skilled-tree-refused', detail: 'skilled-tree-missing' };
  }

  try {
    const paths = ensureIdentityState(stateRoot, identity.value.identity);
    accessSync(paths.switches, constants.R_OK | constants.W_OK);
    if (agent === 'bot') {
      readSwitch(stateRoot, identity.value.identity, input.botId, 'disabled');
      readSwitch(stateRoot, identity.value.identity, input.botId, 'paused');
    }
  } catch (error: unknown) {
    return { ok: false, reason: 'switches-unreadable', detail: (error as NodeJS.ErrnoException | null)?.code ?? String(error) };
  }
  // The transaction registers this checkout only after the job file is in place and the scheduler
  // was told, so a registered-roots file that does not read is refused here, with nothing installed.
  try {
    readRegisteredRoots(stateRoot);
  } catch (error: unknown) {
    const detail = (error as NodeJS.ErrnoException | null)?.code ?? (error instanceof Error ? error.message : String(error));
    return { ok: false, reason: 'registered-roots-unreadable', detail: `${sharedStatePaths(stateRoot).registeredRoots}: ${detail}; repair or remove it. Nothing changed` };
  }

  const base = { agent, identity: identity.value.identity, stateRoot, stateHome, config: config.value, checkoutRoot, skilledTree, interpreter, tree: tree.value } as const;
  if (agent === 'drain') {
    const label = buildDrainLabel(identity.value.identity);
    if (!label.ok) return label;
    return { ok: true, value: { ...base, definition: null, definitionDigest: null, translation: null, label: label.value } };
  }

  const checked = seams.checker(checkoutRoot, env);
  if (checked.exitCode !== 0) {
    const failures = checked.lines.filter((line) => line.startsWith('FAIL:'));
    return { ok: false, reason: 'checker-failed', detail: failures.join('; ') || `exit ${checked.exitCode}` };
  }
  let bytes: Buffer;
  try {
    bytes = readFileSync(definitionPath(checkoutRoot, input.botId));
  } catch {
    return { ok: false, reason: 'definition-malformed', detail: 'definition-unreadable' };
  }
  // The approval an install or enable writes names exactly the bytes vetted here.
  const definitionDigest = digestOf(bytes);
  const definition = parseDefinition(bytes.toString('utf8'));
  if (!definition.ok) return { ok: false, reason: 'definition-malformed', detail: definition.reason };
  if (definition.value.id !== input.botId) return { ok: false, reason: 'definition-malformed', detail: 'id-mismatch' };
  const trigger = definition.value.trigger;
  if (trigger.kind !== 'cron' && input.fullAccess !== true) {
    return { ok: false, reason: 'trigger-not-cron', detail: `${input.botId} has a ${trigger.kind} trigger; nothing to schedule` };
  }
  // A bot with no cron trigger has no job file to write, so the grant is the only thing an install
  // can record. Its label and posture are still vetted, because the grant is what a run reads.
  let translation: Translation | null = null;
  if (trigger.kind === 'cron') {
    const translated = translateCron(trigger.expression);
    if (!translated.ok) return { ok: false, reason: 'schedule-untranslatable', detail: translated.reason };
    translation = translated.value;
  }
  const label = buildBotLabel(identity.value.identity, input.botId, 0);
  if (!label.ok) return label;
  const posture = validatePosture(definition.value, config.value);
  if (!posture.ok) return { ok: false, reason: 'posture-refused', detail: `${posture.reason}${posture.detail !== undefined ? `: ${posture.detail}` : ''}` };

  return { ok: true, value: { ...base, definition: definition.value, definitionDigest, translation, label: label.value } };
}

// ───────────────────────────────────────────────────────────────────
// 5. SCHEDULER READS
// ───────────────────────────────────────────────────────────────────

/**
 * The labels the scheduler's disabled list holds, from `print-disabled`.
 * Its output is not an API, so both spellings seen across releases are read
 * and any other line is ignored.
 */
export function parseDisabledList(stdout: string): Map<string, boolean> {
  const states = new Map<string, boolean>();
  for (const match of stdout.matchAll(/^\s*"([^"]+)"\s*=>\s*(true|false|disabled|enabled)\s*$/gm)) {
    states.set(match[1] as string, match[2] === 'true' || match[2] === 'disabled');
  }
  return states;
}

function disabledLabels(seams: InstallerSeams): Result<Map<string, boolean>> {
  const listed = seams.launchctl(['print-disabled', seams.domain]);
  if (listed.status !== 0) return { ok: false, reason: INSTALL_STEP_FAILED, detail: `print-disabled exited ${String(listed.status)}: nothing changed` };
  return { ok: true, value: parseDisabledList(listed.stdout) };
}

function isLoaded(seams: InstallerSeams, label: string): boolean {
  return seams.launchctl(['print', `${seams.domain}/${label}`]).status === 0;
}

/** A job file's JSON form, through plutil; null when it does not read. */
function readJobFile(seams: InstallerSeams, path: string): Record<string, unknown> | null {
  const converted = seams.plutil(['-convert', 'json', '-o', '-', path]);
  if (converted.status !== 0) return null;
  try {
    return JSON.parse(converted.stdout) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function plistPathFor(seams: InstallerSeams, label: string): string {
  return join(seams.agentsDir, `${label}.plist`);
}

/** Read one install record; null when there is none or it does not read. */
export function readInstallRecord(stateRoot: string, identity: string, botId: string): InstallRecord | null {
  try {
    const parsed = JSON.parse(readFileSync(installFile(stateRoot, identity, botId), 'utf8')) as InstallRecord;
    if (parsed.schemaVersion !== 1) return null;
    // The record is plain JSON on disk, and its labels name the job files that enable bootstraps and
    // uninstall deletes, so a label that is not a hub label would reach outside the agents folder.
    return Array.isArray(parsed.labels) && parsed.labels.every((label) => typeof label === 'string' && parseLabel(label).ok) ? parsed : null;
  } catch {
    return null;
  }
}

/** The checkout a job file runs against: its `--repo` argument. */
function jobRepo(job: Record<string, unknown> | null): string | null {
  const args = Array.isArray(job?.ProgramArguments) ? (job.ProgramArguments as unknown[]) : [];
  const at = args.indexOf('--repo');
  return at >= 0 && typeof args[at + 1] === 'string' ? (args[at + 1] as string) : null;
}

/**
 * The checkout one installed hub job runs against, read from its job file's
 * `--repo`. A reader that shows installed jobs takes the path from here
 * rather than from the label, which is built from an identity that can drift.
 *
 * @returns The `--repo` path, or null when the job file is absent or does not read.
 */
export function jobCheckout(label: string, seams?: Partial<InstallerSeams>): string | null {
  const resolved = seamsFor({ seams });
  return jobRepo(readJobFile(resolved, plistPathFor(resolved, label)));
}

/** One hub job file in the agents folder that runs against a given checkout. */
interface CheckoutJob {
  label: string;
  plistPath: string;
  job: Record<string, unknown>;
  parsed: ParsedLabel;
  /** The bot id, or `drain` for the queue-drain job. */
  botId: string;
}

/**
 * Every hub job file whose `--repo` is this checkout, under any identity.
 *
 * A label is built from the identity, which can change under an installed job
 * (an origin renamed, an identity declared later), so looking a job up by the
 * label built now would miss the one already installed. The checkout a job
 * runs against is written into its file and does not drift, so jobs are found
 * by that, compared by real path.
 */
function checkoutJobs(seams: InstallerSeams, checkoutRoot: string): CheckoutJob[] {
  let checkoutReal: string;
  try {
    checkoutReal = realpathSync(checkoutRoot);
  } catch {
    return [];
  }
  const jobs: CheckoutJob[] = [];
  for (const label of hubJobLabels(seams.agentsDir)) {
    const parsed = parseLabel(label);
    if (!parsed.ok) continue;
    const plistPath = plistPathFor(seams, label);
    const job = readJobFile(seams, plistPath);
    const repo = jobRepo(job);
    if (job === null || repo === null) continue;
    try {
      if (realpathSync(repo) !== checkoutReal) continue;
    } catch {
      continue;
    }
    const botId = parsed.value.kind === 'drain' ? DRAIN_ID : parsed.value.botId;
    jobs.push({ label, plistPath, job, parsed: parsed.value, botId });
  }
  return jobs;
}

/**
 * The environment a job file gives its fires that bears on resolution: the
 * state home and the pinned state root, identity, operator and full-access
 * grant it carries, under launchd's own. A schedule's fire marker is left
 * out, so a verb resolving under this environment is never taken for a
 * scheduled fire.
 */
function jobFileEnv(seams: InstallerSeams, job: Record<string, unknown>): NodeJS.ProcessEnv {
  const stateHome = stateHomeFromPlist(job);
  const pinned = pinnedFromPlist(job);
  return launchdJobEnv({
    accountHome: seams.accountHome,
    environmentVariables: {
      ...(stateHome === null ? {} : { XDG_STATE_HOME: stateHome }),
      ...(pinned === null ? {} : { [PINNED_STATE_ROOT_ENV]: pinned.stateRoot, [PINNED_IDENTITY_ENV]: pinned.identity }),
      ...(pinned === null || typeof pinned.operator !== 'string' ? {} : { [PINNED_OPERATOR_ENV]: pinned.operator }),
      ...(pinned === null || pinned.fullAccess !== true ? {} : { [FULL_ACCESS_ENV]: '1' }),
    },
  });
}

/**
 * The pinned values an environment carries, as job environment entries: the
 * state root and identity, plus the operator and the full-access grant when
 * it carries them. Empty unless it carries both the state root and the
 * identity, since a job pins those two together.
 */
function pinsOf(env: NodeJS.ProcessEnv): Record<string, string> {
  const stateRoot = env[PINNED_STATE_ROOT_ENV];
  const identity = env[PINNED_IDENTITY_ENV];
  if (stateRoot === undefined || identity === undefined) return {};
  const operator = env[PINNED_OPERATOR_ENV];
  const fullAccess = env[FULL_ACCESS_ENV];
  return {
    [PINNED_STATE_ROOT_ENV]: stateRoot,
    [PINNED_IDENTITY_ENV]: identity,
    ...(operator === undefined ? {} : { [PINNED_OPERATOR_ENV]: operator }),
    ...(fullAccess === undefined ? {} : { [FULL_ACCESS_ENV]: fullAccess }),
  };
}

/**
 * An environment with its pinned values taken out: what the checkout itself
 * resolves now. A check that looks for a job grown stale against the
 * checkout compares under this, since under the pins the job always agrees.
 */
function withoutPins(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const { [PINNED_STATE_ROOT_ENV]: _root, [PINNED_IDENTITY_ENV]: _identity, [PINNED_OPERATOR_ENV]: _operator, [FULL_ACCESS_ENV]: _fullAccess, ...rest } = env;
  return rest;
}

/** The state root a job file resolves when it fires, under launchd's environment. */
function jobStateRoot(seams: InstallerSeams, config: RepoConfig, job: Record<string, unknown>): string {
  return userStateRoot(config, jobFileEnv(seams, job));
}

/**
 * The environment every verb resolves identity and the state root under: the
 * one launchd gives this repository's job, built by `launchdJobEnv` and never
 * the shell's with a key patched. A switch, a record lookup, a request or a
 * stop resolved under the shell could land where the job never looks.
 *
 * The installed jobs are the ones whose `--repo` is this checkout, found
 * under any identity. The named job's own file is read first, then any other
 * job of the checkout: the installer refuses a second state home for one
 * checkout, so they agree. A job file that pins the state root and identity
 * gives both, whatever the checkout's config now says, so a verb lands where
 * the fired job looks even after a run edited that config. With no readable
 * job file, the state home pinned
 * is the one an install from this shell would write, so a verb before any
 * install and the job installed after it agree. A config state root needs no
 * value at all.
 */
export function jobEnv(input: { checkoutRoot: string; botId?: string; env?: NodeJS.ProcessEnv; seams?: Partial<InstallerSeams> }): NodeJS.ProcessEnv {
  const env = input.env ?? process.env;
  const seams = seamsFor(input);
  const jobs = checkoutJobs(seams, input.checkoutRoot);
  const found = jobs.find((job) => job.botId === input.botId) ?? jobs[0];
  // A job that pins its state root and identity answers for both before the checkout's config can.
  if (found !== undefined && pinnedFromPlist(found.job) !== null) return jobFileEnv(seams, found.job);
  const bare = launchdJobEnv({ accountHome: seams.accountHome });
  const config = readRepoConfig(input.checkoutRoot);
  if (!config.ok || config.value.stateRoot !== null) return bare;
  if (found !== undefined) return jobFileEnv(seams, found.job);
  return launchdJobEnv({ accountHome: seams.accountHome, environmentVariables: jobEnvironmentVariables(config.value, userStateRoot(config.value, env)) });
}

/**
 * Why a job of this checkout no longer matches the identity and state root
 * resolved now: its label names another identity, or its log or watched
 * folder sits under another state root. Null when it matches.
 */
function jobDrift(job: CheckoutJob, identity: string, stateRoot: string): 'identity-changed' | 'state-root-changed' | null {
  if (identityKey(job.parsed.identity) !== identityKey(identity)) return 'identity-changed';
  if (job.job.StandardOutPath !== agentLogFile(stateRoot, identity, job.label)) return 'state-root-changed';
  if (job.parsed.kind === 'drain') {
    const watched = Array.isArray(job.job.QueueDirectories) ? (job.job.QueueDirectories as unknown[]) : [];
    if (watched.length !== 1 || watched[0] !== identityStatePaths(stateRoot, identity).requests.inbox) return 'state-root-changed';
  }
  return null;
}

/**
 * Switch files of an identity under a default state root other than the one
 * resolved now: the account home's and the shell home's, the roots a verb run
 * before any install with no state home set would have used. A root named only
 * by an earlier shell's state home cannot be found and is not searched.
 */
function strandedSwitches(seams: InstallerSeams, env: NodeJS.ProcessEnv, identity: string, stateRoot: string): { root: string; files: string[] } | null {
  const defaults = new Set([userStateRoot({ stateRoot: null }, { HOME: seams.accountHome }), userStateRoot({ stateRoot: null }, { HOME: env.HOME })]);
  for (const root of defaults) {
    if (root === stateRoot) continue;
    const folder = identityStatePaths(root, identity).switches;
    let files: string[];
    try {
      files = readdirSync(folder).filter((name) => name.endsWith('.json')).sort();
    } catch {
      continue;
    }
    if (files.length > 0) return { root, files };
  }
  return null;
}

// ───────────────────────────────────────────────────────────────────
// 6. INSTALL TRANSACTION
// ───────────────────────────────────────────────────────────────────

function stepFailed(steps: StepRecord[], step: string, result: CommandResult, state: string): Result<never> {
  steps.push({ step, status: result.status, detail: result.stderr.trim() || null });
  return { ok: false, reason: INSTALL_STEP_FAILED, detail: `${step} exited ${String(result.status)}: ${state}` };
}

/** The checkout another clone of this identity installed the job from, when that clone still exists and is registered. */
function holdingClone(seams: InstallerSeams, plistPath: string, checkoutRoot: string, stateRoot: string, identity: string): string | null {
  if (!existsSync(plistPath)) return null;
  const other = jobRepo(readJobFile(seams, plistPath));
  if (other === null || !existsSync(other)) return null;
  const otherReal = realpathSync(other);
  if (otherReal === realpathSync(checkoutRoot)) return null;
  const registered = readRegisteredRoots(stateRoot)[identityKey(identity)] ?? [];
  return registered.includes(otherReal) ? otherReal : null;
}

/**
 * Install or reinstall one bot's schedule, or the repository's drain job.
 *
 * A refusal before the move leaves the agents folder exactly as it was. A
 * first install is held disabled and nothing fires until `bots enable`. A
 * reinstall keeps the previous hold, and stops on a kill switch.
 *
 * @returns The report, a preflight refusal, `label-kill-switch`,
 *   `label-held-by-clone`, or `install-step-failed` naming the step and the
 *   state it left.
 */
export function installSchedule(input: InstallInput): Result<InstallReport> {
  const seams = seamsFor(input);
  const now = input.now ?? new Date();
  const checked = preflight(input, seams);
  if (!checked.ok) return checked;
  const pre = checked.value;
  // A bot whose trigger is not cron has no job file to write, so an install with the full-access
  // grant records the grant and stops: nothing is rendered, linted, moved or handed to the scheduler.
  if (pre.agent === 'bot' && pre.translation === null) {
    const installer = resolveActor({ env: input.env ?? process.env, scheduled: false });
    const operator = installer.ok ? installer.value : null;
    registerRoot(pre.stateRoot, pre.identity, pre.checkoutRoot);
    const record: InstallRecord = {
      schemaVersion: 1,
      agent: 'bot',
      botId: input.botId,
      identity: pre.identity,
      labels: [],
      plistPaths: [],
      checkoutRoot: realpathSync(pre.checkoutRoot),
      interpreter: pre.interpreter,
      plistRunnerPath: pre.tree.repoRunnerRealPath,
      repoRunnerPath: pre.tree.repoRunnerPath,
      repoRunnerRealPath: pre.tree.repoRunnerRealPath,
      treeRoot: pre.tree.treeRoot,
      skilledTree: pre.skilledTree,
      skilledKind: pre.tree.kind,
      pinCommit: pre.tree.kind === 'vendored' ? pre.tree.pinCommit : null,
      executor: pre.definition !== null ? pinExecutor(pre.definition.runtime.kind, input.env ?? process.env) : null,
      schedule: null,
      hold: null,
      installedAt: now.toISOString(),
      enabledAt: null,
      operator,
      fullAccess: true,
    };
    writeStateAtomic(installFile(pre.stateRoot, pre.identity, input.botId), record);
    if (pre.definitionDigest !== null) {
      approveDefinition({ stateRoot: pre.stateRoot, identity: pre.identity, checkoutRoot: pre.checkoutRoot, botId: input.botId, definitionDigest: pre.definitionDigest, by: 'install', now });
    }
    return {
      ok: true,
      value: {
        botId: input.botId,
        labels: [],
        plistPaths: [],
        hold: null,
        loaded: false,
        steps: [],
        nextFire: NEXT_FIRE_UNKNOWN,
        record,
        check: { botId: input.botId, labels: [], status: 'ok', reasons: [] },
        recordedOnly: { triggerKind: pre.definition?.trigger.kind ?? 'unknown' },
      },
    };
  }
  const steps: StepRecord[] = [];

  const logPath = agentLogFile(pre.stateRoot, pre.identity, pre.label);
  const runnerPath = pre.tree.repoRunnerRealPath;
  const installer = resolveActor({ env: input.env ?? process.env, scheduled: false });
  const operator = installer.ok ? installer.value : null;
  const fullAccess = pre.agent === 'bot' && input.fullAccess === true;
  const pinned: PinnedJobValues = { stateRoot: pre.stateRoot, identity: pre.identity, operator, fullAccess };
  let rendered: Result<string>;
  if (pre.agent === 'drain') {
    const queue = identityStatePaths(pre.stateRoot, pre.identity).requests;
    const nested = REQUEST_FOLDERS.filter((folder) => folder !== 'inbox').find((folder) => isWithin(queue.inbox, queue[folder]));
    if (nested !== undefined) return { ok: false, reason: 'queue-layout-invalid', detail: `${nested} sits inside the watched folder` };
    rendered = renderDrainPlist({
      label: pre.label,
      interpreter: pre.interpreter,
      runnerPath,
      checkoutRoot: pre.checkoutRoot,
      skilledTree: pre.skilledTree,
      inboxPath: queue.inbox,
      logPath,
      throttleSeconds: DRAIN_THROTTLE_SECONDS,
      stateHome: pre.stateHome,
      pinned,
    });
  } else {
    rendered = renderBotPlist({
      label: pre.label,
      interpreter: pre.interpreter,
      runnerPath,
      botId: input.botId,
      scheduleIndex: 0,
      checkoutRoot: pre.checkoutRoot,
      skilledTree: pre.skilledTree,
      translation: pre.translation as Translation,
      logPath,
      stateHome: pre.stateHome,
      pinned,
    });
  }
  if (!rendered.ok) return rendered;
  steps.push({ step: 'render', status: 0, detail: null });

  // Lint a private copy, so a file that fails never reaches the agents folder.
  const stage = mkdtempSync(join(tmpdir(), 'bots-install-'));
  try {
    const stagedPath = join(stage, `${pre.label}.plist`);
    writeFileSync(stagedPath, rendered.value, { mode: 0o600 });
    const lint = seams.plutil(['-lint', stagedPath]);
    if (lint.status !== 0) return stepFailed(steps, 'lint', lint, 'nothing changed');
    steps.push({ step: 'lint', status: 0, detail: null });
  } finally {
    rmSync(stage, { recursive: true, force: true });
  }

  const disabled = disabledLabels(seams);
  if (!disabled.ok) return disabled;
  const previous = readInstallRecord(pre.stateRoot, pre.identity, input.botId);
  const labelDisabled = disabled.value.get(pre.label) === true;
  // A hold the installer set itself is not a kill switch. With no record there
  // is no reinstall to stop: the label stays disabled under a first-install hold.
  if (labelDisabled && previous !== null && previous.hold !== 'first-install' && previous.hold !== 'definition') {
    return {
      ok: false,
      reason: 'label-kill-switch',
      detail: `${pre.label} is disabled as a kill switch; run bots enable ${input.botId} to lift it, then install again. Nothing changed`,
    };
  }

  const plistPath = plistPathFor(seams, pre.label);
  const clone = holdingClone(seams, plistPath, pre.checkoutRoot, pre.stateRoot, pre.identity);
  if (clone !== null) {
    return { ok: false, reason: 'label-held-by-clone', detail: `${pre.label} is installed from ${clone}; uninstall it there first. Nothing changed` };
  }

  let hold: Hold | null = previous === null ? 'first-install' : previous.hold;
  if (hold === null && pre.definition?.enabled === false) hold = 'definition';

  // The hold is set before the job file lands, so a login in between still skips it.
  if (hold !== null) {
    const disable = seams.launchctl(['disable', `${seams.domain}/${pre.label}`]);
    if (disable.status !== 0) return stepFailed(steps, 'disable', disable, 'nothing changed');
    steps.push({ step: 'disable', status: 0, detail: hold });
  }

  if (isLoaded(seams, pre.label)) {
    const bootout = seams.launchctl(['bootout', `${seams.domain}/${pre.label}`]);
    if (bootout.status !== 0) return stepFailed(steps, 'bootout', bootout, 'the old job is still loaded and its file is unchanged');
    steps.push({ step: 'bootout', status: 0, detail: null });
  } else {
    steps.push({ step: 'bootout', status: null, detail: 'not loaded; nothing to boot out' });
  }

  try {
    mkdirSync(seams.agentsDir, { recursive: true });
    writeTextAtomic(plistPath, rendered.value);
  } catch (error: unknown) {
    steps.push({ step: 'move', status: null, detail: String(error) });
    return { ok: false, reason: INSTALL_STEP_FAILED, detail: `move failed: the old job is booted out and its file is unchanged (${String(error)})` };
  }
  steps.push({ step: 'move', status: 0, detail: plistPath });

  const bootstrap = seams.launchctl(['bootstrap', seams.domain, plistPath]);
  let loaded: boolean;
  if (hold !== null) {
    // A held label is expected to stay unloaded; the exit is kept as evidence of what this host does.
    steps.push({ step: 'bootstrap', status: bootstrap.status, detail: `held (${hold}): ${bootstrap.stderr.trim() || 'no output'}` });
    loaded = isLoaded(seams, pre.label);
    if (loaded) {
      // The host loaded a disabled label after all, so the job is booted out to keep the hold real.
      const bootout = seams.launchctl(['bootout', `${seams.domain}/${pre.label}`]);
      if (bootout.status !== 0) return stepFailed(steps, 'bootout', bootout, 'a held job is loaded; run bots disable at once');
      steps.push({ step: 'print', status: 0, detail: 'a held label loaded; booted out again' });
      loaded = false;
    } else {
      steps.push({ step: 'print', status: 1, detail: 'not loaded: held disabled' });
    }
  } else {
    if (bootstrap.status !== 0) return stepFailed(steps, 'bootstrap', bootstrap, 'the job file is in place and the job is not loaded');
    steps.push({ step: 'bootstrap', status: 0, detail: null });
    const printed = seams.launchctl(['print', `${seams.domain}/${pre.label}`]);
    if (printed.status !== 0) return stepFailed(steps, 'print', printed, 'the job file is in place and the job did not report as loaded');
    steps.push({ step: 'print', status: 0, detail: null });
    loaded = true;
  }

  // A read-back failure leaves the job file in place and no install record written, so the check reports record-missing.
  const leftState = `the job file is in place, the job is ${loaded ? 'loaded' : `held disabled and not loaded (${String(hold)})`}, and no install record was written`;
  const readBackFailed = (why: string): Result<never> => {
    steps.push({ step: 'read-back', status: 1, detail: why });
    return { ok: false, reason: INSTALL_STEP_FAILED, detail: `read-back: ${why}: ${leftState}` };
  };
  const readBack = readJobFile(seams, plistPath);
  if (readBack === null) return readBackFailed('the installed job file does not convert');
  if (pre.translation !== null) {
    const installed = scheduleFromPlist(readBack);
    if (installed === null || !sameSchedule(installed, pre.translation)) return readBackFailed('the installed schedule differs from the translator output');
  }
  if (stateHomeFromPlist(readBack) !== pre.stateHome) return readBackFailed('the installed job does not carry the state home the install resolved');
  const readPins = pinnedFromPlist(readBack);
  if (readPins === null || readPins.stateRoot !== pinned.stateRoot || readPins.identity !== pinned.identity) {
    return readBackFailed('the installed job does not pin the state root and identity the install resolved');
  }
  steps.push({ step: 'read-back', status: 0, detail: null });

  if (previous === null && pre.agent === 'bot') {
    // A schedule installed afresh owes nothing to a last fire from before it.
    rmSync(slotSnapshotFile(pre.stateRoot, pre.identity, input.botId, 0), { force: true });
  }
  registerRoot(pre.stateRoot, pre.identity, pre.checkoutRoot);
  const record: InstallRecord = {
    schemaVersion: 1,
    agent: pre.agent,
    botId: input.botId,
    identity: pre.identity,
    labels: [pre.label],
    plistPaths: [plistPath],
    checkoutRoot: realpathSync(pre.checkoutRoot),
    interpreter: pre.interpreter,
    plistRunnerPath: runnerPath,
    repoRunnerPath: pre.tree.repoRunnerPath,
    repoRunnerRealPath: pre.tree.repoRunnerRealPath,
    treeRoot: pre.tree.treeRoot,
    skilledTree: pre.skilledTree,
    skilledKind: pre.tree.kind,
    pinCommit: pre.tree.kind === 'vendored' ? pre.tree.pinCommit : null,
    executor: pre.definition !== null ? pinExecutor(pre.definition.runtime.kind, input.env ?? process.env) : null,
    ...(pre.agent === 'drain' ? { executors: pinAllExecutors(input.env ?? process.env) } : {}),
    schedule: pre.definition !== null && pre.definition.trigger.kind === 'cron' ? { expression: pre.definition.trigger.expression, scheduleIndex: 0 } : null,
    hold,
    installedAt: now.toISOString(),
    enabledAt: previous?.enabledAt ?? null,
    operator,
    fullAccess,
  };
  writeStateAtomic(installFile(pre.stateRoot, pre.identity, input.botId), record);
  if (pre.definitionDigest !== null) {
    approveDefinition({ stateRoot: pre.stateRoot, identity: pre.identity, checkoutRoot: pre.checkoutRoot, botId: input.botId, definitionDigest: pre.definitionDigest, by: 'install', now });
  }
  mkdirSync(dirname(logPath), { recursive: true, mode: STATE_DIR_MODE });

  const check = checkInstalls({ stateRoot: pre.stateRoot, identity: pre.identity, agentsDir: seams.agentsDir }).find((row) => row.botId === input.botId) ?? {
    botId: input.botId,
    labels: record.labels,
    status: 'ok',
    reasons: [],
  };
  return {
    ok: true,
    value: { botId: input.botId, labels: record.labels, plistPaths: record.plistPaths, hold, loaded, steps, nextFire: NEXT_FIRE_UNKNOWN, record, check },
  };
}

// ───────────────────────────────────────────────────────────────────
// 7. ENABLE & DISABLE
// ───────────────────────────────────────────────────────────────────

export interface SwitchReport {
  /**
   * False when no scheduler job was found: no install record, and for a
   * disable no job file and no label the scheduler knows. Only the run-layer
   * switch applies then.
   */
  installed: boolean;
  labels: string[];
  steps: StepRecord[];
}

/**
 * Lift a hold or a kill switch: rerun the preflight, enable each label and
 * bootstrap a job file that is not loaded. A definition that says
 * `enabled: false` is refused, so the two stop layers never disagree.
 * Enabling is an operator's approval: the definition and config as they are
 * now become the ones the bot's unattended runs may use, schedule or not.
 *
 * @returns The report, a preflight refusal, `definition-disabled` or `install-step-failed`.
 */
export function enableSchedule(input: InstallInput): Result<SwitchReport> {
  const seams = seamsFor(input);
  const env = jobEnv(input);
  const context = installContext(input.checkoutRoot, env);
  if (!context.ok) return context;
  const record = readInstallRecord(context.value.stateRoot, context.value.identity, input.botId);
  const approvalTarget = { stateRoot: context.value.stateRoot, identity: context.value.identity, checkoutRoot: input.checkoutRoot, botId: input.botId };
  // A record with no labels is a grant recorded for a bot with no job file, so it answers like no record at all.
  if (record === null || record.labels.length === 0) {
    // Enabling a bot with no schedule still approves its definition, so its queued requests may run.
    if (input.botId !== DRAIN_ID) {
      let bytes: Buffer | null = null;
      try {
        bytes = readFileSync(definitionPath(input.checkoutRoot, input.botId));
      } catch {
        bytes = null;
      }
      if (bytes !== null) approveDefinition({ ...approvalTarget, definitionDigest: digestOf(bytes), by: 'enable', ...(input.now !== undefined ? { now: input.now } : {}) });
    }
    return { ok: true, value: { installed: false, labels: [], steps: [] } };
  }

  // The recheck is of the job as installed: its Skilled tree and interpreter, not the invoking shell's.
  const checked = preflight({ ...input, env, skilledTree: record.skilledTree, interpreter: record.interpreter }, seams);
  if (!checked.ok) return checked;
  if (checked.value.definition?.enabled === false) {
    return { ok: false, reason: 'definition-disabled', detail: `${input.botId}'s BOT.md says enabled: false` };
  }
  if (checked.value.definitionDigest !== null) {
    approveDefinition({ ...approvalTarget, definitionDigest: checked.value.definitionDigest, by: 'enable', ...(input.now !== undefined ? { now: input.now } : {}) });
  }

  const steps: StepRecord[] = [];
  for (const label of record.labels) {
    const enabled = seams.launchctl(['enable', `${seams.domain}/${label}`]);
    if (enabled.status !== 0) return stepFailed(steps, 'enable', enabled, `${label} is still disabled`);
    steps.push({ step: 'enable', status: 0, detail: label });
    const plistPath = plistPathFor(seams, label);
    if (existsSync(plistPath) && !isLoaded(seams, label)) {
      const bootstrap = seams.launchctl(['bootstrap', seams.domain, plistPath]);
      if (bootstrap.status !== 0) return stepFailed(steps, 'bootstrap', bootstrap, `${label} is enabled and not loaded`);
      steps.push({ step: 'bootstrap', status: 0, detail: label });
    }
    const printed = seams.launchctl(['print', `${seams.domain}/${label}`]);
    steps.push({ step: 'print', status: printed.status, detail: label });
  }
  writeStateAtomic(installFile(context.value.stateRoot, context.value.identity, input.botId), {
    ...record,
    hold: null,
    enabledAt: (input.now ?? new Date()).toISOString(),
  } satisfies InstallRecord);
  return { ok: true, value: { installed: true, labels: record.labels, steps } };
}

/**
 * The kill switch at the scheduler: disable each label and boot out a loaded
 * job. It runs no preflight, because stopping must work while anything is broken.
 *
 * @returns The report, `identity-unknown` or a config refusal, or `install-step-failed`.
 */
export function disableSchedule(input: Omit<InstallInput, 'skilledTree'>): Result<SwitchReport> {
  const seams = seamsFor(input);
  const context = installContext(input.checkoutRoot, jobEnv(input));
  if (!context.ok) return context;
  // A job of this checkout installed under an identity it no longer resolves is stopped too.
  const found = checkoutJobs(seams, input.checkoutRoot).filter((job) => job.botId === input.botId);
  const record = readInstallRecord(context.value.stateRoot, context.value.identity, input.botId);
  // A record with no labels is a grant recorded for a bot with no job file, so it answers like no record at all.
  if (record === null || record.labels.length === 0) return disableUnrecorded(seams, context.value.identity, input.botId, found.map((job) => job.label));

  const labels = [...new Set([...record.labels, ...found.map((job) => job.label)])];
  const steps: StepRecord[] = [];
  for (const label of labels) {
    const stopped = stopLabel(seams, label, steps, label);
    if (!stopped.ok) return stopped;
  }
  writeStateAtomic(installFile(context.value.stateRoot, context.value.identity, input.botId), { ...record, hold: 'operator' } satisfies InstallRecord);
  return { ok: true, value: { installed: true, labels, steps } };
}

/** Disable one label and boot it out when it is loaded. */
function stopLabel(seams: InstallerSeams, label: string, steps: StepRecord[], detail: string): Result<null> {
  const disabled = seams.launchctl(['disable', `${seams.domain}/${label}`]);
  if (disabled.status !== 0) return stepFailed(steps, 'disable', disabled, `${label} is not disabled`);
  steps.push({ step: 'disable', status: 0, detail });
  if (isLoaded(seams, label)) {
    const bootout = seams.launchctl(['bootout', `${seams.domain}/${label}`]);
    if (bootout.status !== 0) return stepFailed(steps, 'bootout', bootout, `${label} is disabled and still loaded`);
    steps.push({ step: 'bootout', status: 0, detail: label });
  }
  return { ok: true, value: null };
}

/**
 * The kill switch with no install record to read the labels from. The label
 * built from identity and bot id is stopped when its job file is in the agents
 * folder, or the scheduler has it loaded or listed, so a job whose record sits
 * under another state root is still stopped. So is every job file of this
 * checkout for the bot, found by its `--repo`, whatever identity its label names.
 */
function disableUnrecorded(seams: InstallerSeams, identity: string, botId: string, foundLabels: string[]): Result<SwitchReport> {
  const built = botId === DRAIN_ID ? buildDrainLabel(identity) : buildBotLabel(identity, botId, 0);
  const candidates = [...new Set([...(built.ok ? [built.value] : []), ...foundLabels])];
  let listed: Result<Map<string, boolean>> | null = null;
  let installed = false;
  const labels: string[] = [];
  for (const label of candidates) {
    const present = existsSync(plistPathFor(seams, label)) || isLoaded(seams, label);
    if (!present) {
      listed ??= disabledLabels(seams);
      if (!(listed.ok && listed.value.has(label))) continue;
    }
    installed ||= present;
    labels.push(label);
  }
  if (labels.length === 0) return { ok: true, value: { installed: false, labels: [], steps: [] } };
  const steps: StepRecord[] = [];
  for (const label of labels) {
    const stopped = stopLabel(seams, label, steps, `${label} (no install record found)`);
    if (!stopped.ok) return stopped;
  }
  return { ok: true, value: { installed, labels, steps } };
}

// ───────────────────────────────────────────────────────────────────
// 8. UNINSTALL
// ───────────────────────────────────────────────────────────────────

export interface UninstallReport {
  removed: string[];
  /** Hub bot labels of this identity whose bot has no definition any more. */
  swept: string[];
  /** Labels the scheduler's disabled list still names; harmless with no job file. */
  leftDisabled: string[];
  steps: StepRecord[];
}

function installContext(checkoutRoot: string, env: NodeJS.ProcessEnv | undefined): Result<{ identity: string; stateRoot: string }> {
  const resolvedEnv = env ?? process.env;
  const config = readRepoConfig(checkoutRoot);
  if (!config.ok) return config;
  const identity = identityGuard(checkoutRoot, resolvedEnv);
  if (!identity.ok) return identity;
  return { ok: true, value: { identity: identity.value.identity, stateRoot: userStateRoot(config.value, resolvedEnv) } };
}

function removeLabel(seams: InstallerSeams, label: string, steps: StepRecord[]): Result<null> {
  if (isLoaded(seams, label)) {
    const bootout = seams.launchctl(['bootout', `${seams.domain}/${label}`]);
    if (bootout.status !== 0) return stepFailed(steps, 'bootout', bootout, `${label} is still loaded and its file is in place`);
    steps.push({ step: 'bootout', status: 0, detail: label });
  }
  rmSync(plistPathFor(seams, label), { force: true });
  steps.push({ step: 'delete', status: 0, detail: label });
  return { ok: true, value: null };
}

/** Hub labels with a job file in the agents folder. */
function hubJobLabels(agentsDir: string): string[] {
  if (!existsSync(agentsDir)) return [];
  return readdirSync(agentsDir)
    .filter((name) => name.startsWith(LABEL_PREFIX) && name.endsWith('.plist'))
    .map((name) => name.slice(0, -'.plist'.length));
}

/**
 * Remove one bot's schedule, or the drain job, and sweep this identity's
 * bot labels whose definition is gone. The drain label is never swept: it
 * has no definition by design. Run folders and run records are never touched.
 *
 * @returns The report, `identity-unknown` or a config refusal, or `install-step-failed`.
 */
export function uninstallSchedule(input: Omit<InstallInput, 'skilledTree'>): Result<UninstallReport> {
  const seams = seamsFor(input);
  const context = installContext(input.checkoutRoot, jobEnv(input));
  if (!context.ok) return context;
  const { identity, stateRoot } = context.value;
  const config = readRepoConfig(input.checkoutRoot);
  if (!config.ok) return config;
  const steps: StepRecord[] = [];
  // Every job of this checkout, found by its `--repo` before any file is removed, whatever identity its label names.
  const jobs = checkoutJobs(seams, input.checkoutRoot);

  const record = readInstallRecord(stateRoot, identity, input.botId);
  const built = input.botId === DRAIN_ID ? buildDrainLabel(identity) : buildBotLabel(identity, input.botId, 0);
  if (!built.ok) return built;
  const own = jobs.filter((job) => job.botId === input.botId);
  const labels = [...new Set([...(record?.labels ?? [built.value]), ...own.map((job) => job.label)])];
  for (const label of labels) {
    const removed = removeLabel(seams, label, steps);
    if (!removed.ok) return removed;
  }
  rmSync(installFile(stateRoot, identity, input.botId), { force: true });
  if (input.botId !== DRAIN_ID) rmSync(slotSnapshotFile(stateRoot, identity, input.botId, 0), { force: true });
  // A job found under another identity or root keeps its record where it fired from.
  for (const job of own) {
    const root = jobStateRoot(seams, config.value, job.job);
    rmSync(installFile(root, job.parsed.identity, input.botId), { force: true });
    if (input.botId !== DRAIN_ID) rmSync(slotSnapshotFile(root, job.parsed.identity, input.botId, 0), { force: true });
  }

  // Sweep candidates: this identity's bot labels, and this checkout's bot jobs under any identity.
  const sweepable = new Map<string, { botId: string; identity: string; root: string | null }>();
  for (const label of hubJobLabels(seams.agentsDir)) {
    const parsed = parseLabel(label);
    if (!parsed.ok || parsed.value.kind !== 'bot') continue;
    // Another repository's bots have no definition here, so only this identity's labels are swept.
    if (identityKey(parsed.value.identity) !== identityKey(identity)) continue;
    sweepable.set(label, { botId: parsed.value.botId, identity, root: null });
  }
  for (const job of jobs) {
    if (job.parsed.kind !== 'bot') continue;
    sweepable.set(job.label, { botId: job.botId, identity: job.parsed.identity, root: jobStateRoot(seams, config.value, job.job) });
  }
  const swept: string[] = [];
  for (const [label, candidate] of sweepable) {
    if (labels.includes(label)) continue;
    if (existsSync(definitionPath(resolve(input.checkoutRoot), candidate.botId))) continue;
    // The swept bot's record sits under the root its own job reads, found before its job file is gone.
    let sweptRoot = candidate.root;
    if (sweptRoot === null) {
      const sweptContext = installContext(input.checkoutRoot, jobEnv({ ...input, botId: candidate.botId }));
      sweptRoot = sweptContext.ok ? sweptContext.value.stateRoot : stateRoot;
    }
    const removed = removeLabel(seams, label, steps);
    if (!removed.ok) return removed;
    rmSync(installFile(sweptRoot, candidate.identity, candidate.botId), { force: true });
    swept.push(label);
  }

  const disabled = disabledLabels(seams);
  const leftDisabled = disabled.ok ? [...labels, ...swept].filter((label) => disabled.value.get(label) === true) : [];
  return { ok: true, value: { removed: labels, swept, leftDisabled, steps } };
}

/**
 * Resolve an executor kind's binary the way the command builders look it up:
 * `command -v` under a plain `/bin/sh`, so a shell alias or function never
 * stands in for a file.
 *
 * @returns The kind and the absolute path, a null path when nothing resolves,
 *   or null for a kind that spawns no binary.
 */
export function pinExecutor(kind: string, env: NodeJS.ProcessEnv): ExecutorPin | null {
  const capability = (EXECUTOR_ADAPTER_CAPABILITIES as Record<string, { binary: string | null }>)[kind];
  if (capability === undefined || capability.binary === null) return null;
  const run = spawnSync('/bin/sh', ['-c', 'command -v "$1"', 'sh', capability.binary], { env, encoding: 'utf8', timeout: COMMAND_TIMEOUT_MS });
  const found = run.status === 0 ? run.stdout.trim() : '';
  return { kind, path: isAbsolute(found) && existsSync(found) ? found : null };
}

/**
 * The environment a scheduled fire runs under. launchd hands the job a bare
 * PATH, so the pinned executor's folder and the interpreter's folder go first;
 * the interpreter's folder is there for an executor that starts through
 * `#!/usr/bin/env node`. Nothing changes when the bot has no pin, or when its
 * definition now names another kind than the one pinned.
 *
 * @returns The environment for the run, never written back to the job file.
 */
export function scheduledRunEnv(input: { checkoutRoot: string; botId: string; env: NodeJS.ProcessEnv; seams?: Partial<InstallerSeams> }): NodeJS.ProcessEnv {
  const context = installContext(input.checkoutRoot, jobEnv(input));
  if (!context.ok) return input.env;
  const record = readInstallRecord(context.value.stateRoot, context.value.identity, input.botId);
  const pin = record?.executor;
  if (record === null || pin === undefined || pin === null || pin.path === null) return input.env;
  let kind: string | null = null;
  try {
    const parsed = parseDefinition(readFileSync(definitionPath(input.checkoutRoot, input.botId), 'utf8'));
    kind = parsed.ok ? parsed.value.runtime.kind : null;
  } catch {
    kind = null;
  }
  if (kind !== pin.kind) return input.env;
  return withPathFirst(input.env, [dirname(pin.path), dirname(record.interpreter)]);
}

/** Every executor kind whose binary resolves, for the drain job's record. */
function pinAllExecutors(env: NodeJS.ProcessEnv): ExecutorPin[] {
  const pins: ExecutorPin[] = [];
  for (const kind of Object.keys(EXECUTOR_ADAPTER_CAPABILITIES)) {
    const pin = pinExecutor(kind, env);
    if (pin !== null && pin.path !== null) pins.push(pin);
  }
  return pins;
}

/** The environment with the given folders first on PATH, each once. */
function withPathFirst(env: NodeJS.ProcessEnv, folders: string[]): NodeJS.ProcessEnv {
  const first = [...new Set(folders)];
  const rest = String(env.PATH ?? '').split(delimiter).filter((entry) => entry !== '' && !first.includes(entry));
  return { ...env, PATH: [...first, ...rest].join(delimiter) };
}

// ───────────────────────────────────────────────────────────────────
// 9. NEEDS-REINSTALL CHECK
// ───────────────────────────────────────────────────────────────────

function recordReasons(record: InstallRecord): ReinstallReason[] {
  const reasons: ReinstallReason[] = [];
  if (!existsSync(record.plistRunnerPath)) reasons.push('runner-missing');
  const pinned = [record.executor, ...(record.executors ?? [])];
  if (pinned.some((pin) => typeof pin?.path === 'string' && !existsSync(pin.path))) reasons.push('executor-missing');
  const now = detectSkilledTree(record.checkoutRoot);
  if (!now.ok || now.value.repoRunnerRealPath !== record.repoRunnerRealPath || now.value.treeRoot !== record.treeRoot) {
    reasons.push('runner-retargeted');
  }
  if (now.ok && now.value.kind !== record.skilledKind) reasons.push('kind-changed');
  if (record.skilledKind === 'vendored' && now.ok && now.value.kind === 'vendored' && now.value.pinCommit !== record.pinCommit) {
    reasons.push('pin-changed');
  }
  return reasons;
}

/**
 * Compare every install record of one identity with the tree as it is now,
 * and name each hub label in the agents folder that has no record. It writes
 * nothing and calls no scheduler verb.
 *
 * @returns One row per recorded bot and per unrecorded label.
 */
export function checkInstalls(input: { stateRoot: string; identity: string; agentsDir: string }): InstallCheck[] {
  const rows: InstallCheck[] = [];
  const folder = identityStatePaths(input.stateRoot, input.identity).installs;
  const recorded = new Set<string>();
  const names = existsSync(folder) ? readdirSync(folder).filter((name) => name.endsWith('.json')).sort() : [];
  for (const name of names) {
    const botId = name.slice(0, -'.json'.length);
    const record = readInstallRecord(input.stateRoot, input.identity, botId);
    if (record === null) continue;
    for (const label of record.labels) recorded.add(label);
    const reasons = recordReasons(record);
    rows.push({ botId, labels: record.labels, status: reasons.length === 0 ? 'ok' : 'needs-reinstall', reasons });
  }
  for (const label of hubJobLabels(input.agentsDir)) {
    if (recorded.has(label)) continue;
    const parsed = parseLabel(label);
    if (!parsed.ok || identityKey(parsed.value.identity) !== identityKey(input.identity)) continue;
    const botId = parsed.value.kind === 'drain' ? DRAIN_ID : parsed.value.botId;
    rows.push({ botId, labels: [label], status: 'needs-reinstall', reasons: ['record-missing'] });
  }
  return rows;
}

/**
 * The check for one checkout, resolving its identity and state root first.
 * It adds what only the checkout can show: a job of this checkout, found by
 * its `--repo`, whose label names another identity (`identity-changed`) or
 * whose log or watched folder sits under another state root (`state-root-changed`).
 */
export function checkInstallsFor(input: { checkoutRoot: string; env?: NodeJS.ProcessEnv; seams?: Partial<InstallerSeams> }): Result<InstallCheck[]> {
  const seams = seamsFor(input);
  // The check reports a job grown stale against the checkout as it is now, so it resolves without the job's pins.
  const context = installContext(input.checkoutRoot, withoutPins(jobEnv(input)));
  if (!context.ok) return context;
  const rows = checkInstalls({ ...context.value, agentsDir: seams.agentsDir });
  for (const job of checkoutJobs(seams, input.checkoutRoot)) {
    const drift = jobDrift(job, context.value.identity, context.value.stateRoot);
    if (drift === null) continue;
    const row = rows.find((candidate) => candidate.labels.includes(job.label));
    if (row === undefined) {
      rows.push({ botId: job.botId, labels: [job.label], status: 'needs-reinstall', reasons: [drift] });
    } else {
      row.status = 'needs-reinstall';
      if (!row.reasons.includes(drift)) row.reasons.push(drift);
    }
  }
  return { ok: true, value: rows };
}

// ───────────────────────────────────────────────────────────────────
// 10. DRAIN BACK-OFF
// ───────────────────────────────────────────────────────────────────
//
// The drain job wakes whenever its watched folder holds a file, and a pass
// that stops on a setup fault puts the request back, so the folder stays
// non-empty and the scheduler starts the job again after every throttle
// interval for as long as the fault lasts. The throttle bounds how often it
// starts; this back-off makes each start inside the window return at once,
// without claiming, running or touching the folder, and the window doubles
// with each fault.

/** What the back-off file holds. */
export interface DrainBackoff {
  failures: number;
  until: string;
  reason: string;
}

export function readDrainBackoff(stateRoot: string, identity: string): DrainBackoff | null {
  try {
    const parsed = JSON.parse(readFileSync(drainBackoffFile(stateRoot, identity), 'utf8')) as Partial<DrainBackoff>;
    if (typeof parsed.failures !== 'number' || typeof parsed.until !== 'string') return null;
    return { failures: parsed.failures, until: parsed.until, reason: typeof parsed.reason === 'string' ? parsed.reason : 'unknown' };
  } catch {
    return null;
  }
}

/** The window after the n-th fault in a row, in seconds. */
export function drainBackoffSeconds(failures: number): number {
  return Math.min(DRAIN_BACKOFF_MAX_SECONDS, DRAIN_BACKOFF_BASE_SECONDS * 2 ** Math.max(0, failures - 1));
}

export type ScheduledDrainResult =
  | { kind: 'backing-off'; until: string; reason: string }
  | { kind: 'drained'; report: DrainReport }
  | { kind: 'refused'; reason: string; detail: string | null; backoffUntil: string | null };

/**
 * One start of the scheduled drain job: wait out a back-off, else drain once
 * and record the outcome. A refused pass opens or widens the window; a clean
 * pass closes it.
 */
export async function scheduledDrain(input: DrainInput & { now?: Date; drain?: (input: DrainInput) => Promise<Result<DrainReport>> }): Promise<ScheduledDrainResult> {
  const now = input.now ?? new Date();
  // Started by hand from a shell, the pass must still drain the inbox the drain job watches, so it
  // resolves under the job's environment; the runs it dispatches keep the caller's.
  const resolveEnv = jobEnv({ checkoutRoot: input.checkoutRoot, botId: DRAIN_ID, env: input.env });
  const context = installContext(input.checkoutRoot, resolveEnv);
  if (context.ok) {
    const current = readDrainBackoff(context.value.stateRoot, context.value.identity);
    if (current !== null && Date.parse(current.until) > now.getTime()) {
      return { kind: 'backing-off', until: current.until, reason: current.reason };
    }
  }

  // launchd starts the drain job with a bare PATH, so the runs it dispatches get the executors pinned at install.
  const record = context.ok ? readInstallRecord(context.value.stateRoot, context.value.identity, DRAIN_ID) : null;
  const pinnedFolders = (record?.executors ?? []).flatMap((pin) => (pin.path !== null ? [dirname(pin.path)] : []));
  const env = record !== null && pinnedFolders.length > 0 ? withPathFirst(input.env ?? process.env, [...pinnedFolders, dirname(record.interpreter)]) : input.env;
  const result = await (input.drain ?? drainQueue)({ ...input, ...(env !== undefined ? { env } : {}), resolveEnv });
  if (!context.ok) {
    // No identity, no state folder to remember a fault in; the throttle alone bounds the starts.
    return result.ok ? { kind: 'drained', report: result.value } : { kind: 'refused', reason: result.reason, detail: result.detail ?? null, backoffUntil: null };
  }
  const path = drainBackoffFile(context.value.stateRoot, context.value.identity);
  if (result.ok) {
    rmSync(path, { force: true });
    return { kind: 'drained', report: result.value };
  }
  const failures = (readDrainBackoff(context.value.stateRoot, context.value.identity)?.failures ?? 0) + 1;
  const until = new Date(now.getTime() + drainBackoffSeconds(failures) * 1000).toISOString();
  const reason = `${result.reason}${result.detail !== undefined ? `: ${result.detail}` : ''}`;
  mkdirSync(dirname(path), { recursive: true, mode: STATE_DIR_MODE });
  writeStateAtomic(path, { failures, until, reason } satisfies DrainBackoff);
  return { kind: 'refused', reason: result.reason, detail: result.detail ?? null, backoffUntil: until };
}
