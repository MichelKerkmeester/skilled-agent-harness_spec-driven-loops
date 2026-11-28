// ───────────────────────────────────────────────────────────────────
// MODULE: Bot Runner
// ───────────────────────────────────────────────────────────────────
//
// Runs one bot once, in a fixed order: approval, disable and completed switches, needs-you
// hold, lease, pause switch, precheck, posture, secret check, dispatch, result.
// An unattended run (scheduled, queued or a resume) runs only a definition and
// config whose hashes an operator approved, so a run that edited either file
// cannot change what the next unattended run does; a manual run approves them.
// Every stop before dispatch is a refusal with a named cause, never a run
// failure, so a scheduler or queue can tell "did not start" from "broke".
// The lease is the deep-loop loop lock, keyed by bot, repository and spec
// target and never by a checkout path, and it is released on every exit
// path the process survives. A run killed outright leaves a lease that the
// pid, nonce and heartbeat rule reclaims, and only then, with the owner
// proved gone, is the killed run's record closed as unknown. A run whose
// child asks a question parks as a needs-you item and exits; no process
// waits for the answer. The run's one result event goes through the deep-loop
// append gateway, so a failed write is retried by re-sending the same event,
// never by dispatching the run again. A throw anywhere inside the run still
// ends in exactly one record, so no run can vanish without a trace. A bot
// that declares `isolation: worktree` gets its own tree just before dispatch,
// after every refusal but the executor's own; a refusal after the tree exists
// finishes it, or returns a resumed tree to waiting, before its record. The tree
// is removed or kept before the terminal record, so the record and the notice
// both say which. Delivery starts only once the terminal record is written,
// and a failed send never changes the run's outcome.
//
// Identity and the state root are resolved under `resolveEnv` when it is
// given, and the run itself (precheck, secret check, dispatch) uses `env`.
// A library caller that is not itself a launchd-started job passes the job's
// environment from the installer's `jobEnv` as `resolveEnv`, so the run
// lands where the scheduled job would, whatever the calling shell sets.

import { spawn, spawnSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { appendFileSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative } from 'node:path';

import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import {
  acquireLoopLock,
  processAlive,
  releaseLoopLock,
  startHeartbeat,
  stopHeartbeat,
} from '../../../system-deep-loop/runtime/lib/deep-loop/loop-lock.js';
import { classifyAction, clipAction } from './action-kind.js';
import { resolveActor } from './actor.js';
import { decideApproval } from './approval-ladder.js';
import { approveDefinition, checkApproval, digestOf } from './approval.js';
import { resolveApps, UTCP_CONFIG_NAME, writeRunUtcpConfig } from './apps.js';
import { parseDefinition } from './definition.js';
import { deliverRecord, resolveDeliveryEntries } from './delivery.js';
import {
  buildBotPrompt,
  checkoutLine,
  checkPromptBudget,
  collectAllKnownSecrets,
  commonEnv,
  dispatchHeadless,
  finalAnswerText,
  findSecretLiteral,
  MIN_SECRET_LENGTH,
  parseDecisionMarker,
  parseRememberMarker,
  READ_ONLY_UNCONFINED,
  runsOutsideCheckout,
  VIBE_RUN_UNFINISHED,
  WORKING_PLACE_BRANCH_CLAUSE,
  WORKING_PLACE_FOLDER_MARKER,
  WORKING_PLACE_PREFIX,
  workingPlaceLine,
} from './dispatch.js';
import { resolveIdentity } from './identity.js';
import { checkoutBranch, createBotWorktree, finishBotWorktree, inspectWorktree, reopenBotWorktree } from './isolation.js';
import { MEMORY_PROPOSALS_BOT_ID } from './label.js';
import { botMemoryFile, collapseText, MEMORY_LIMITS, MEMORY_TYPES, readMemoryFile, renderMemoryBlock, sharedMemoryFile } from './memory.js';
import { buildResumedPrompt, holdForBot, itemAwaitingResume, needsYouExpiry, needsYouState, readNeedsYouItem, writeNeedsYouItem } from './needs-you.js';
import { SCHEDULED_FIRE_ENV } from './plist-render.js';
import { validatePosture } from './posture.js';
import { readRepoConfig } from './repo-config.js';
import { openResultLedger, resultEventKey, sendResultEvent } from './result-ledger.js';
import { disabledCause, evaluateFatigue, readRoutineState, recordUntilOutcome } from './routine-state.js';
import { AWAITING_DECISION, readRunRecord, RESULT_EVENT_UNRECORDED, writeRunRecord } from './run-record.js';
import { createSecretMatcher } from './secret-matcher.js';
import { resolveSecret, secretEnvKey } from './secrets.js';
import { HELD_SLOT_REASON, recordScheduledFire } from './slot-accounting.js';
import {
  ensureIdentityState,
  generationStampFile,
  identityStatePaths,
  installFile,
  isSafeSegment,
  receiptFolder,
  recordFile,
  resolveRunFolder,
  sharedStatePaths,
  STATE_DIR_MODE,
  userStateRoot,
  writeGenerationStamp,
} from './state-root.js';
import { readSwitch, setSwitch } from './switches.js';

import type { ExecutorKind } from '../../../system-deep-loop/runtime/lib/deep-loop/executor-config.js';
import type { BotDefinition, Delivery } from './definition.js';
import type { DeliverySenders } from './delivery.js';
import type { CommandBuilder, DispatchOutcome, KnownSecrets, WorkingPlace } from './dispatch.js';
import type { BotWorktree } from './isolation.js';
import type { MemoryType } from './memory.js';
import type { NeedsYouItem } from './needs-you.js';
import type { RepoConfig, Result } from './repo-config.js';
import type { EvidenceLocations, FailureClass, HeldSlot, HonoredPosture, PostRunCause, RequestGrant, RunRecord, SkippedSlotSummary, UntilObservation, WorktreeEvidence } from './run-record.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

const requireCjs = createRequire(import.meta.url);

const lifecycleTaxonomy = requireCjs('../../../system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs') as {
  STOP_REASONS: Record<string, string>;
};
const observability = requireCjs('../../../system-deep-loop/runtime/lib/deep-loop/observability-events.cjs') as {
  appendObservabilityEvent: (path: string, payload: Record<string, unknown>, meta?: Record<string, unknown>) => unknown;
};

const STOP = lifecycleTaxonomy.STOP_REASONS;

/** CLI exit codes. A refusal, a run failure and a parked run each have their own. */
export const EXIT_CODES = Object.freeze({
  completed: 0,
  runFailure: 1,
  usage: 2,
  recursionGuard: 3,
  refused: 4,
  awaitingDecision: 5,
});

/** The causes a run can be refused for before dispatch, with the exit each records. */
export const REFUSAL_CAUSES = Object.freeze({
  'definition-missing': { reason: 'definition-missing', class: null },
  'definition-malformed': { reason: 'definition-malformed', class: 'author' },
  'definition-unapproved': { reason: 'definition-unapproved', class: 'operator' },
  'definition-drifted': { reason: 'definition-drifted', class: 'operator' },
  'identity-unknown': { reason: 'identity-unknown', class: 'operator' },
  'run-folder-refused': { reason: 'run-folder-refused', class: 'environment' },
  disabled: { reason: 'disabled', class: null },
  'routine-fatigued': { reason: 'routine-fatigued', class: null },
  'routine-completed': { reason: 'routine-completed', class: null },
  'awaiting-decision-hold': { reason: STOP.blockedStop as string, class: null },
  'awaiting-resume-hold': { reason: STOP.blockedStop as string, class: null },
  'needs-you-unreadable': { reason: STOP.blockedStop as string, class: 'operator' },
  'needs-you-unlistable': { reason: STOP.blockedStop as string, class: 'environment' },
  'resume-item-invalid': { reason: 'resume-item-invalid', class: 'operator' },
  'lease-held': { reason: 'lease-held', class: null },
  paused: { reason: STOP.userPaused as string, class: null },
  'precheck-failed': { reason: 'precheck-failed', class: null },
  'precheck-silent': { reason: 'precheck-silent', class: null },
  'posture-refused': { reason: 'posture-refused', class: 'author' },
  'apps-unenforceable': { reason: 'apps-unenforceable', class: 'author' },
  'apps-refused': { reason: 'apps-refused', class: 'author' },
  'body-secret': { reason: 'body-secret', class: 'author' },
  'secret-unknown': { reason: 'secret-unknown', class: 'operator' },
  'secret-store-unreadable': { reason: 'secret-store-unreadable', class: 'environment' },
  'prompt-over-budget': { reason: 'prompt-over-budget', class: 'author' },
  'read-only-unconfined': { reason: 'read-only-unconfined', class: 'environment' },
  'result-ledger-unbound': { reason: 'result-ledger-unbound', class: 'environment' },
  'worktree-refused': { reason: 'worktree-refused', class: 'operator' },
  'worktree-setup-failed': { reason: 'worktree-setup-failed', class: 'environment' },
  'parked-worktree-missing': { reason: 'parked-worktree-missing', class: 'operator' },
  'resume-posture-changed': { reason: 'resume-posture-changed', class: 'author' },
  'schedule-stale': { reason: 'schedule-stale', class: 'operator' },
} as const satisfies Record<string, { reason: string; class: FailureClass | null }>);

export type RefusalCause = keyof typeof REFUSAL_CAUSES;

export const PRECHECK_SILENT_MARKER = '[SILENT]';

const PRECHECK_TIMEOUT_MS = 60_000;
/** How long a timed-out precheck's group has to exit on SIGTERM before SIGKILL. */
const PRECHECK_KILL_GRACE_MS = 2_000;
const LEASE_MARGIN_MS = 60_000;
const MINUTE_MS = 60_000;
const WORKFLOW = 'system-skilled-bots';

/**
 * A manual run, a run drained from the request queue, the run that resumes
 * a parked one after its answer, or a fire of an installed schedule. A queued
 * run carries its request's join fields so the runner writes them in the
 * run's one record. A scheduled fire names its schedule, and its slot is
 * accounted before anything else can refuse it.
 */
export type RunRequest =
  | { kind: 'manual' }
  | { kind: 'queued'; requestId: string; source: string; firedSlot: string | null; prompt: string }
  | { kind: 'resume'; requestId: string; itemId: string }
  | { kind: 'scheduled'; scheduleIndex: number; firedAt?: Date };

/** The dispatch source a scheduled fire records. */
export const SCHEDULE_SOURCE = 'schedule';

/** The line that sets a queued request's own prompt apart from the bot body it follows. */
export { REQUEST_PROMPT_HEADER } from './dispatch.js';

export interface RunBotInput {
  /** The repository checkout that holds `bots/`. */
  checkoutRoot: string;
  /** The Skilled tree whose gitignored `.state` holds run folders. */
  skilledTree: string;
  botId: string;
  env?: NodeJS.ProcessEnv;
  /** The environment identity and the state root are resolved under; defaults to `env`. */
  resolveEnv?: NodeJS.ProcessEnv;
  /** The name a person passed with --as. Absent means the pinned operator on a scheduled run, else the OS user. */
  actor?: string | null;
  request?: RunRequest;
  /** Replaces the deep-loop lineage command builder. */
  buildCommand?: CommandBuilder;
  /** Replaces the recursion guard's process-ancestry and lockfile reads. */
  guard?: { ancestryCmdlines?: string[]; statePaths?: string[] };
  /** How long one budget minute lasts; only tests shorten it. */
  minuteMs?: number;
  /** How long the precheck may run; only tests shorten it. */
  precheckTimeoutMs?: number;
  /** Replaces sk-git's worktree numbering script; only tests point it at a stub. */
  namingScript?: string;
  /** Replaces the real delivery channel senders; tests always pass stubs. */
  senders?: DeliverySenders;
}

export type RunOutcome =
  | { kind: 'refused'; cause: RefusalCause; detail: string | null; runId: string | null; recordPath: string | null; itemId: string | null }
  | { kind: 'failed'; reason: string; class: FailureClass | null; runId: string; recordPath: string | null; recursionGuard: boolean }
  | { kind: 'completed'; runId: string; recordPath: string | null }
  | { kind: 'awaiting-decision'; runId: string; recordPath: string | null; itemId: string };

/** Everything a verb needs to find one repository's bots and state. */
export interface BotContext {
  checkoutRoot: string;
  skilledTree: string;
  config: RepoConfig;
  identity: string;
  stateRoot: string;
}

/** What the lease side file holds, so a reclaimer can close a killed run's record. */
export interface LeaseSideFile {
  ownerPid: number;
  acquireNonce: string | null;
  seed: RecordSeed;
}

export interface RecordSeed {
  identity: string;
  checkoutRoot: string;
  botId: string;
  runId: string;
  definitionDigest: string;
  requestId: string | null;
  resumedItemId: string | null;
  /** Who the run is recorded as. Absent in a lease side file written before runs named anyone. */
  actor?: string | null;
  /** Who answered the item a resumed run continues. */
  answeredBy?: string | null;
  /** The grant the resumed item carried, written as one line on the resumed run's record. */
  grant?: RequestGrant | null;
  /** Absent in a lease side file written before queued runs carried a slot. */
  firedSlot?: string | null;
  source: string;
  dispatchedAt: string;
  declared: BotDefinition['budget'];
  posture: HonoredPosture;
  evidence: EvidenceLocations;
  /** The definition's delivery fields; null when the definition did not parse. */
  delivery?: Delivery | null;
  /** What a scheduled fire stood for; absent for every other run. */
  slot?: SlotFields | null;
}

/** The slot fields a scheduled fire writes into its record. */
interface SlotFields {
  scheduledAt: string | null;
  latenessSeconds: number | null;
  latenessClass: string | null;
  skippedSlots: SkippedSlotSummary | null;
  heldSlot: HeldSlot | null;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONTEXT & PATHS
// ───────────────────────────────────────────────────────────────────

/**
 * Read the repository config and identity and resolve the state root.
 *
 * @returns The context, or a config refusal or `identity-unknown`.
 */
export function resolveBotContext(input: { checkoutRoot: string; skilledTree: string; env?: NodeJS.ProcessEnv }): Result<BotContext> {
  const env = input.env ?? process.env;
  const config = readRepoConfig(input.checkoutRoot);
  if (!config.ok) return config;
  const identity = resolveIdentity({ checkoutRoot: input.checkoutRoot, config: config.value, env });
  if (!identity.ok) return identity;
  return {
    ok: true,
    value: {
      checkoutRoot: input.checkoutRoot,
      skilledTree: input.skilledTree,
      config: config.value,
      identity: identity.value.identity,
      stateRoot: userStateRoot(config.value, env),
    },
  };
}

/** Where a bot's definition lives: one `BOT.md` per bot under `bots/<id>/`. */
export function definitionPath(checkoutRoot: string, botId: string): string {
  return join(checkoutRoot, 'bots', botId, 'BOT.md');
}

/**
 * The lease key: the workflow, the repository identity and the spec target.
 * It never holds a checkout or worktree path, so two checkouts of one
 * repository share one lease and a retry can never start a second tree.
 */
export function leaseKey(identity: string, botId: string, specFolder: string | null): string {
  return [WORKFLOW, identity.toLowerCase(), botId, specFolder ?? '-'].join('|');
}

/** The lease file of one key, under the user-level state root. */
export function leaseFile(stateRoot: string, identity: string, key: string): string {
  const digest = createHash('sha256').update(key).digest('hex').slice(0, 32);
  return join(identityStatePaths(stateRoot, identity).leases, `${digest}.lock`);
}

/**
 * The generation stamp lives with the state paths so delivery, which the
 * runner imports, can advance it too; it is re-exported here for the verbs
 * that already read it from the runner.
 */
export { generationStampFile, writeGenerationStamp };

/** A sortable, filename-safe run id. */
export function newRunId(now: Date = new Date()): string {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  return `${stamp}-${randomBytes(4).toString('hex')}`;
}

/** The exit code a CLI returns for an outcome. */
export function exitCodeFor(outcome: RunOutcome): number {
  switch (outcome.kind) {
    case 'completed':
      return EXIT_CODES.completed;
    case 'refused':
      return EXIT_CODES.refused;
    case 'awaiting-decision':
      return EXIT_CODES.awaitingDecision;
    case 'failed':
      return outcome.recursionGuard ? EXIT_CODES.recursionGuard : EXIT_CODES.runFailure;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. RECORDS
// ───────────────────────────────────────────────────────────────────

function evidenceFor(runFolder: string, receiptDir: string): EvidenceLocations {
  return {
    runFolder,
    ledgerDir: join(runFolder, 'ledger'),
    // Receipts record the command line, which holds the prompt for an argv
    // kind, so they live under the user-level state root, never in the run folder.
    receiptDir,
    observabilityStream: join(runFolder, 'observability.jsonl'),
    worktreePath: null,
    branch: null,
  };
}

function buildRecord(
  seed: RecordSeed,
  exit: RunRecord['exit'],
  extra: { leaseNonce: string | null; resultEventId: string | null; iterations: number | null; elapsedMs: number | null; until?: UntilObservation | null; postRunCauses?: PostRunCause[] },
): RunRecord {
  return {
    schemaVersion: 1,
    identity: {
      repository: seed.identity,
      repositoryPath: seed.checkoutRoot,
      botId: seed.botId,
      runId: seed.runId,
      definitionDigest: seed.definitionDigest,
    },
    request: {
      requestId: seed.requestId,
      leaseNonce: extra.leaseNonce,
      resultEventId: extra.resultEventId,
      firedSlot: seed.firedSlot ?? null,
      resumedItemId: seed.resumedItemId,
      ...(seed.grant ? { grant: seed.grant } : {}),
    },
    dispatch: {
      source: seed.source,
      scheduledAt: seed.slot?.scheduledAt ?? null,
      dispatchedAt: seed.dispatchedAt,
      latenessSeconds: seed.slot?.latenessSeconds ?? null,
      latenessClass: seed.slot?.latenessClass ?? null,
      skippedSlots: seed.slot?.skippedSlots ?? null,
      heldSlot: seed.slot?.heldSlot ?? null,
    },
    budget: {
      declared: seed.declared,
      measured: {
        iterations: extra.iterations,
        elapsedMinutes: extra.elapsedMs === null ? null : Math.round((extra.elapsedMs / MINUTE_MS) * 1000) / 1000,
        // No admitted kind reports its spend to this runner yet, so the cost is unknown, never zero.
        costUsd: null,
        costSource: null,
      },
    },
    posture: seed.posture,
    exit,
    evidence: seed.evidence,
    delivery: resolveDeliveryEntries(seed.delivery ?? null, exit),
    actor: seed.actor ?? null,
    answeredBy: seed.answeredBy ?? null,
    until: extra.until ?? null,
    postRunCauses: extra.postRunCauses ?? [],
  };
}

function observe(seed: RecordSeed, event: string, status: string, extra: Record<string, unknown> = {}): void {
  const stream = seed.evidence.observabilityStream;
  if (stream === null) return;
  try {
    observability.appendObservabilityEvent(
      stream,
      { event, status, label: seed.botId, ...extra },
      { producer: WORKFLOW, stream: 'bot-run', subject: seed.runId },
    );
  } catch {
    // Liveness rows are evidence; losing one never changes the run's outcome.
  }
}

function writeTerminal(stateRoot: string, record: RunRecord): string | null {
  const written = writeRunRecord(stateRoot, record);
  writeGenerationStamp(stateRoot, record.identity.repository);
  return written.ok ? written.value : null;
}

function refusalRecord(
  stateRoot: string,
  seed: RecordSeed,
  cause: RefusalCause,
  detail: string | null,
  itemId: string | null,
  leaseNonce: string | null,
): RunOutcome {
  const { reason, class: failureClass } = REFUSAL_CAUSES[cause];
  observe(seed, 'refused', 'stopped', { reason: cause });
  const recordPath = writeTerminal(
    stateRoot,
    buildRecord(
      seed,
      { reason, class: failureClass, needsYouItemId: null, refusal: { cause, itemId, detail } },
      { leaseNonce, resultEventId: null, iterations: 0, elapsedMs: null },
    ),
  );
  return { kind: 'refused', cause, detail, runId: seed.runId, recordPath, itemId };
}

/**
 * Close the record of a run whose lease was reclaimed, but only once its
 * owner process is proved gone and only if it left no record of its own.
 * A killed run's worktree is never removed here: it may hold half-made work,
 * so it is kept and its reason recorded.
 *
 * @returns The closed run's id, or null when nothing was closed.
 */
function closeKilledRun(stateRoot: string, lease: string, reclaimedPid: number, env: NodeJS.ProcessEnv): string | null {
  const sidePath = `${lease}.run.json`;
  let side: LeaseSideFile;
  try {
    side = JSON.parse(readFileSync(sidePath, 'utf8')) as LeaseSideFile;
  } catch {
    return null;
  }
  if (side.ownerPid !== reclaimedPid || processAlive(side.ownerPid)) return null;
  if (existsSync(recordFile(stateRoot, side.seed.identity, side.seed.runId))) return null;
  const tree = side.seed.evidence.worktree;
  if (tree !== undefined && tree !== null && tree.disposition === 'active' && side.seed.evidence.worktreePath !== null) {
    const verdict = inspectWorktree(
      side.seed.checkoutRoot,
      { ...tree, path: side.seed.evidence.worktreePath, branch: side.seed.evidence.branch ?? '', baseCommit: tree.baseCommit ?? '' },
      env,
    );
    const detail = [tree.detail, verdict.detail].filter((part): part is string => part !== null && part !== '').join('; ');
    side.seed.evidence.worktree = { ...tree, disposition: 'kept', keptReason: verdict.keptReason ?? 'killed', detail: detail === '' ? null : detail };
  }
  writeTerminal(
    stateRoot,
    buildRecord(
      side.seed,
      { reason: 'unknown', class: 'environment', needsYouItemId: null, refusal: null },
      { leaseNonce: side.acquireNonce, resultEventId: null, iterations: null, elapsedMs: null },
    ),
  );
  rmSync(sidePath, { force: true });
  return side.seed.runId;
}

/** The record's view of a tree in use by its run. */
function activeTreeEvidence(tree: BotWorktree, postureSource: WorktreeEvidence['postureSource']): WorktreeEvidence {
  return {
    postureSource,
    baseCommit: tree.baseCommit,
    links: tree.links,
    createdDirs: tree.createdDirs,
    setupMs: tree.setupMs,
    disposition: 'active',
    keptReason: null,
    detail: [
      `base from ${tree.baseSource ?? 'unknown'}`,
      ...(tree.skipped.length > 0 ? [`not linked: ${tree.skipped.map((entry) => `${entry.path} (${entry.why})`).join(', ')}`] : []),
    ].join('; '),
  };
}

/**
 * Send a terminal record's queued notices. A delivery failure is the
 * delivery's own outcome, recorded on its entry, and never the run's.
 */
function deliverTerminal(input: RunBotInput, stateRoot: string, identity: string, runId: string | null): void {
  if (runId === null || !existsSync(recordFile(stateRoot, identity, runId))) return;
  try {
    deliverRecord({
      stateRoot,
      identity,
      runId,
      env: input.env ?? process.env,
      checkoutRoot: input.checkoutRoot,
      ...(input.senders !== undefined ? { senders: input.senders } : {}),
    });
  } catch {
    // An entry left claimed by a throw reads as an uncertain send; it is never retried.
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. PRECHECK
// ───────────────────────────────────────────────────────────────────

type PrecheckSkip = { cause: 'precheck-failed' | 'precheck-silent'; detail: string };

/** Signal a whole process group; one already gone is not an error. */
function signalGroup(pid: number, signal: NodeJS.Signals): void {
  try {
    process.kill(-pid, signal);
  } catch {
    // ESRCH: every member has exited.
  }
}

/**
 * Run the precheck in a process group of its own. A timeout signals only the
 * direct child when the group is shared, so anything the shell left in the
 * background would outlive the check and keep working in the checkout while
 * the run goes on. On timeout the whole group gets SIGTERM, then SIGKILL after
 * a short grace, and the check ends only once its output closes.
 */
function runPrecheck(command: string, cwd: string, env: NodeJS.ProcessEnv, timeoutMs: number): Promise<PrecheckSkip | null> {
  return new Promise((settle) => {
    const child = spawn('/bin/sh', ['-c', command], { cwd, env: commonEnv(env), stdio: ['ignore', 'pipe', 'pipe'], detached: true });
    let stdout = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.resume();
    let timedOut = false;
    let killTimer: NodeJS.Timeout | undefined;
    const timer = setTimeout(() => {
      timedOut = true;
      if (child.pid === undefined) return;
      const pid = child.pid;
      signalGroup(pid, 'SIGTERM');
      killTimer = setTimeout(() => signalGroup(pid, 'SIGKILL'), PRECHECK_KILL_GRACE_MS);
    }, timeoutMs);
    let settled = false;
    const finish = (result: PrecheckSkip | null): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(killTimer);
      settle(result);
    };
    child.on('error', (error: Error) => finish({ cause: 'precheck-failed', detail: error.message }));
    child.on('close', (code: number | null, signal: NodeJS.Signals | null) => {
      if (timedOut) {
        finish({ cause: 'precheck-failed', detail: `timed out after ${timeoutMs} ms; its process group was ended` });
      } else if (code !== 0) {
        finish({ cause: 'precheck-failed', detail: code === null ? `killed by ${String(signal)}` : `exit ${code}` });
      } else if (stdout.includes(PRECHECK_SILENT_MARKER)) {
        finish({ cause: 'precheck-silent', detail: `printed ${PRECHECK_SILENT_MARKER}` });
      } else {
        finish(null);
      }
    });
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. POST-RUN SCAN
// ───────────────────────────────────────────────────────────────────

/** The prefix a vault row's key carries, so a scan names the secret rather than the row. */
const VAULT_KEY_PREFIX = 'vault:';

/** One text a scan looks for, with the name a redaction reports it under. */
interface ScanForm {
  name: string;
  value: string;
}

/**
 * Every text the scan looks for, built from the known-secret map.
 *
 * A vault row also contributes the three encodings a child is likely to print
 * instead of the value itself. The hex form is the one the keychain stores, so a
 * bot that reads its own keychain item back prints it.
 *
 * @param known - The values every text is checked against.
 * @returns The forms to scan for, each long enough to be a secret.
 */
function scanForms(known: KnownSecrets): ScanForm[] {
  const forms: ScanForm[] = [];
  const seen = new Set<string>();
  const push = (name: string, value: string): void => {
    if (value.length < MIN_SECRET_LENGTH || seen.has(value)) return;
    seen.add(value);
    forms.push({ name, value });
  };
  for (const [key, value] of known) {
    if (value.length < MIN_SECRET_LENGTH) continue;
    const vault = key.startsWith(VAULT_KEY_PREFIX);
    const name = vault ? key.slice(VAULT_KEY_PREFIX.length) : key;
    push(name, value);
    if (!vault) continue;
    const bytes = Buffer.from(value, 'utf8');
    push(name, bytes.toString('hex'));
    // The unpadded text is the start of the padded one, so one form matches both.
    push(name, bytes.toString('base64').replace(/=+$/, ''));
    push(name, encodeURIComponent(value));
  }
  return forms;
}

/**
 * Replace every stretch a known value covers with the name it is filed under.
 *
 * @param text - The text to redact.
 * @param forms - The values to look for.
 * @param matcher - The one-pass matcher over those values.
 * @returns The redacted text, the names used and how many stretches were replaced.
 */
function redactText(text: string, forms: ScanForm[], matcher: ReturnType<typeof createSecretMatcher>): { text: string; names: string[]; stretches: number } {
  const ranges = matcher.ranges(text);
  if (ranges.length === 0) return { text, names: [], stretches: 0 };
  const names: string[] = [];
  let out = '';
  let at = 0;
  for (const [start, end] of ranges) {
    // The longest value starting where the stretch starts names it, so a value that
    // begins the stretch wins over one buried inside it.
    let longest: ScanForm | null = null;
    for (const form of forms) {
      if (!text.startsWith(form.value, start)) continue;
      if (longest === null || form.value.length > longest.value.length) longest = form;
    }
    const inside = text.slice(start, end);
    const name = longest?.name ?? forms.filter((form) => inside.includes(form.value)).map((form) => form.name).sort()[0] ?? 'secret';
    names.push(name);
    out += `${text.slice(at, start)}[redacted: ${name}]`;
    at = end;
  }
  return { text: out + text.slice(at), names, stretches: ranges.length };
}

/**
 * Redact one file in place, through a temporary file renamed over it, so a reader
 * never sees a half-written copy.
 *
 * @param path - The file to redact.
 * @param forms - The values to look for.
 * @param matcher - The one-pass matcher over those values.
 * @returns The names used, how many stretches were replaced and whether the file was rewritten.
 */
function redactFile(path: string, forms: ScanForm[], matcher: ReturnType<typeof createSecretMatcher>): { names: string[]; stretches: number; rewritten: boolean } {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    return { names: [], stretches: 0, rewritten: false };
  }
  const names: string[] = [];
  let stretches = 0;
  // No value holds a newline, so a line at a time keeps every stretch inside one line.
  const lines = text.split('\n').map((line) => {
    const redacted = redactText(line, forms, matcher);
    names.push(...redacted.names);
    stretches += redacted.stretches;
    return redacted.text;
  });
  if (stretches === 0) return { names, stretches, rewritten: false };
  const temp = `${path}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
  try {
    writeFileSync(temp, lines.join('\n'), { flag: 'wx', mode: statSync(path).mode & 0o777 });
    renameSync(temp, path);
    return { names, stretches, rewritten: true };
  } catch {
    rmSync(temp, { force: true });
    return { names, stretches, rewritten: false };
  }
}

/**
 * Redact every text a run produced: the child's two streams and every file in the
 * run folder and the receipt folder.
 *
 * @param known - The values every text is checked against.
 * @param outcome - The dispatch outcome whose streams are redacted.
 * @param folders - The folders to walk, in the order their places are reported.
 * @param runFolder - The run folder the reported places are relative to.
 * @returns The redacted streams and the cause to record, or null when nothing matched.
 */
function scanRunOutput(known: KnownSecrets, outcome: DispatchOutcome, folders: string[], runFolder: string): { stdout: string; stderr: string; cause: PostRunCause | null } {
  const forms = scanForms(known);
  if (forms.length === 0) return { stdout: outcome.stdout, stderr: outcome.stderr, cause: null };
  const matcher = createSecretMatcher(forms.map((form) => form.value));
  const names: string[] = [];
  const places: string[] = [];
  let stretches = 0;
  const stdout = redactText(outcome.stdout, forms, matcher);
  names.push(...stdout.names);
  stretches += stdout.stretches;
  if (stdout.stretches > 0) places.push('stdout');
  const stderr = redactText(outcome.stderr, forms, matcher);
  names.push(...stderr.names);
  stretches += stderr.stretches;
  if (stderr.stretches > 0) places.push('stderr');
  for (const folder of folders) {
    // A folder that does not exist is skipped, so a run that wrote no receipt costs nothing.
    const pending = [folder];
    for (let head = 0; head < pending.length; head += 1) {
      const current = pending[head] as string;
      let entries: string[];
      try {
        entries = readdirSync(current);
      } catch {
        continue;
      }
      for (const entry of entries) {
        const path = join(current, entry);
        const stats = lstatSync(path, { throwIfNoEntry: false });
        if (stats === undefined) continue;
        // A link is skipped rather than followed, so a scan never rewrites a file outside the run.
        if (stats.isSymbolicLink()) continue;
        if (stats.isDirectory()) {
          pending.push(path);
          continue;
        }
        if (!stats.isFile()) continue;
        const redacted = redactFile(path, forms, matcher);
        if (redacted.stretches === 0) continue;
        names.push(...redacted.names);
        stretches += redacted.stretches;
        places.push(`${relative(runFolder, path)}${redacted.rewritten ? '' : ' (not rewritten)'}`);
      }
    }
  }
  if (stretches === 0) return { stdout: stdout.text, stderr: stderr.text, cause: null };
  return {
    stdout: stdout.text,
    stderr: stderr.text,
    cause: { cause: 'secret-in-output', names: [...new Set(names)].sort(), detail: `${stretches} stretches in ${places.join(', ')}` },
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. RUN
// ───────────────────────────────────────────────────────────────────

function declaredPosture(definition: BotDefinition | null, config: RepoConfig): HonoredPosture {
  return {
    isolation: (definition?.posture.isolation ?? config.defaultIsolation) as HonoredPosture['isolation'],
    sandbox: definition?.posture.sandbox ?? null,
    executorKind: definition?.runtime.kind ?? 'unknown',
    model: typeof definition?.runtime.model === 'string' ? definition.runtime.model : null,
    apps: [],
    secretsUsed: [],
  };
}

/** The kept reason of a tree its run left for the run that resumes it. */
const AWAITING_DECISION_KEPT_REASON = AWAITING_DECISION;

/** What a resume learns from the record of the run it continues. */
interface ParkedTree {
  tree: BotWorktree;
  postureSource: WorktreeEvidence['postureSource'];
}

/**
 * Decide which tree a resumed run works in, from the parked run's own
 * record and never from the definition alone: the parked work is wherever
 * that run left it. A worktree bot whose parked run kept no tree, or a
 * shared bot whose parked run kept one, is refused, because either way the
 * resume would work somewhere the parked work is not.
 *
 * @returns The parked tree, null for a resume that works in the checkout, or a refusal.
 */
function parkedTreeFor(
  context: BotContext,
  item: NeedsYouItem,
  wantsTree: boolean,
): { ok: true; value: ParkedTree | null } | { ok: false; cause: RefusalCause; detail: string } {
  const parked = readRunRecord(context.stateRoot, context.identity, item.runId);
  if (!parked.ok) {
    // Without the parked record nothing says where the parked work is, so only a shared resume may go on.
    if (!wantsTree) return { ok: true, value: null };
    return { ok: false, cause: 'parked-worktree-missing', detail: `the parked run's record does not read (${parked.reason})` };
  }
  const { evidence } = parked.value.record;
  const kept = evidence.worktree ?? null;
  if (kept === null) {
    if (!wantsTree) return { ok: true, value: null };
    return { ok: false, cause: 'resume-posture-changed', detail: 'the parked run used no worktree; the definition now declares one' };
  }
  if (!wantsTree) {
    return { ok: false, cause: 'resume-posture-changed', detail: `the parked run worked in ${evidence.worktreePath ?? 'a worktree'}; the definition no longer declares one` };
  }
  if (kept.disposition !== 'kept' || kept.keptReason !== AWAITING_DECISION_KEPT_REASON || evidence.worktreePath === null || evidence.branch === null) {
    return { ok: false, cause: 'parked-worktree-missing', detail: `the parked run's tree was ${kept.disposition}${kept.keptReason !== null ? ` (${kept.keptReason})` : ''}, not kept for its answer` };
  }
  return {
    ok: true,
    value: {
      postureSource: kept.postureSource,
      tree: {
        path: evidence.worktreePath,
        branch: evidence.branch,
        baseSource: null,
        baseCommit: kept.baseCommit ?? '',
        links: kept.links,
        createdDirs: kept.createdDirs,
        skipped: [],
        setupMs: 0,
      },
    },
  };
}

/**
 * Settle a tree a refusal leaves before any child ran. A resumed tree goes back to waiting with
 * its item, and a fresh one is finished by the normal rules, so no refusal records a tree as active.
 */
function settleUnusedTree(
  seed: RecordSeed,
  tree: BotWorktree | null,
  resumed: boolean,
  checkoutRoot: string,
  env: NodeJS.ProcessEnv,
): void {
  if (tree === null || !seed.evidence.worktree) return;
  if (resumed) {
    seed.evidence.worktree = { ...seed.evidence.worktree, disposition: 'kept', keptReason: AWAITING_DECISION_KEPT_REASON };
  } else {
    const finished = finishBotWorktree(checkoutRoot, tree, env);
    const detail = [seed.evidence.worktree.detail, finished.detail].filter((part): part is string => part !== null && part !== '').join('; ');
    seed.evidence.worktree = { ...seed.evidence.worktree, disposition: finished.disposition, keptReason: finished.keptReason, detail: detail === '' ? null : detail };
  }
  observe(seed, 'worktree', seed.evidence.worktree.disposition, { reason: seed.evidence.worktree.keptReason });
}

/**
 * Put a tree's own UTCP config back once its child is done: the text taken before the
 * filtered copy was written, or no file when the tree held none. Only the working tree is
 * restored, so a commit the child made stays as the child made it.
 */
function restoreTreeUtcpConfig(treePath: string, original: string | null): void {
  const path = join(treePath, UTCP_CONFIG_NAME);
  if (original === null) rmSync(path, { force: true });
  else writeFileSync(path, original);
}

/**
 * Restore a reopened tree's UTCP config when it differs from the checkout's, which is what a
 * run killed before its restore leaves behind. The tree's own git index says what the file
 * should hold, so no marker file is needed. A file the index does not track was left by a run,
 * so it is removed.
 */
function restoreOrphanedUtcpConfig(checkoutRoot: string, treePath: string, env: NodeJS.ProcessEnv): Result<null> {
  const read = (path: string): string | null => (existsSync(path) ? readFileSync(path, 'utf8') : null);
  const treeFile = join(treePath, UTCP_CONFIG_NAME);
  if (read(treeFile) === read(join(checkoutRoot, UTCP_CONFIG_NAME))) return { ok: true, value: null };
  const gitEnv: NodeJS.ProcessEnv = { ...env };
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR']) delete gitEnv[key];
  const git = (args: string[]) => spawnSync('git', ['-C', treePath, ...args], { encoding: 'utf8', env: gitEnv, timeout: 30_000 });
  const tracked = git(['ls-files', '--error-unmatch', '--', UTCP_CONFIG_NAME]);
  if (tracked.status === 1) {
    rmSync(treeFile, { force: true });
    return { ok: true, value: null };
  }
  const restored = tracked.status === 0 ? git(['checkout', '--', UTCP_CONFIG_NAME]) : tracked;
  if (restored.status !== 0) {
    return { ok: false, reason: 'utcp-config-unrestored', detail: (restored.stderr ?? '').trim() || 'git did not restore the file' };
  }
  return { ok: true, value: null };
}

/** The line every prompt this runtime composes names its spec folder on, which gives a parked prompt a fixed place for the working-place line. */
const SPEC_FOLDER_LINE_START = 'Bound spec folder: ';

/**
 * Give a parked prompt the current working-place line. A prompt parked before
 * the line existed gains it after its spec-folder line. A parked line naming
 * the same directory is replaced, because a resume always has a new run folder
 * and a shared checkout's branch may have moved. A line naming another
 * directory is refused, because the child would be told to work where it does
 * not start. The line is placed by position and never by replacing body text.
 */
function placeWorkingLine(prompt: string, place: WorkingPlace): Result<string> {
  const current = workingPlaceLine(place);
  const lines = prompt.split('\n');
  const at = lines.findIndex((line) => line.startsWith(WORKING_PLACE_PREFIX));
  if (at === -1) {
    const specAt = lines.findIndex((line) => line.startsWith(SPEC_FOLDER_LINE_START));
    lines.splice(specAt === -1 ? 1 : specAt + 1, 0, current);
    return { ok: true, value: lines.join('\n') };
  }
  const parked = lines[at] as string;
  const cut = parked.indexOf(WORKING_PLACE_FOLDER_MARKER);
  const parkedPlace = cut === -1 ? parked : parked.slice(0, cut);
  const placeHead = `${WORKING_PLACE_PREFIX}${place.path}`;
  if (parkedPlace !== placeHead && !parkedPlace.startsWith(`${placeHead}${WORKING_PLACE_BRANCH_CLAUSE}`)) {
    return { ok: false, reason: 'the parked prompt names another working place' };
  }
  lines[at] = current;
  return { ok: true, value: lines.join('\n') };
}

function loadResumeItem(context: BotContext, botId: string, itemId: string): Result<NeedsYouItem> {
  if (!isSafeSegment(itemId)) return { ok: false, reason: 'item-id-invalid' };
  const item = readNeedsYouItem(context.stateRoot, context.identity, itemId);
  if (!item.ok) return item;
  if (item.value.botId !== botId) return { ok: false, reason: 'item-bot-mismatch' };
  const state = needsYouState(item.value);
  if (state !== 'answered') return { ok: false, reason: `item-${state}` };
  return item;
}

/** Whether the operator installed this bot with full access. The record is read directly because the installer imports the drain, which imports this module. A bot with no install record, or one that does not read, has none. */
function installGrantsFullAccess(stateRoot: string, identity: string, botId: string): boolean {
  try {
    const parsed: unknown = JSON.parse(readFileSync(installFile(stateRoot, identity, botId), 'utf8'));
    return typeof parsed === 'object' && parsed !== null && (parsed as { fullAccess?: unknown }).fullAccess === true;
  } catch {
    return false;
  }
}

/** The class of an error thrown inside a run: a system call failure is the environment's, anything else the runner's own. */
function thrownClass(error: unknown): FailureClass {
  const code = (error as NodeJS.ErrnoException | null)?.code;
  return typeof code === 'string' && /^E[A-Z]+$/.test(code) ? 'environment' : 'hub';
}

/**
 * Close a run that threw. A record already written for the run stands, so a
 * run keeps exactly one record whatever point the throw came from.
 */
function closeThrownRun(stateRoot: string, seed: RecordSeed, leaseNonce: string | null, error: unknown): RunOutcome {
  const failureClass = thrownClass(error);
  const path = recordFile(stateRoot, seed.identity, seed.runId);
  if (existsSync(path)) {
    return { kind: 'failed', reason: 'runner-error', class: failureClass, runId: seed.runId, recordPath: path, recursionGuard: false };
  }
  observe(seed, 'terminal', 'stopped', { reason: 'runner-error' });
  const recordPath = writeTerminal(
    stateRoot,
    buildRecord(
      seed,
      { reason: 'runner-error', class: failureClass, needsYouItemId: null, refusal: null },
      { leaseNonce, resultEventId: null, iterations: null, elapsedMs: null },
    ),
  );
  return { kind: 'failed', reason: 'runner-error', class: failureClass, runId: seed.runId, recordPath, recursionGuard: false };
}

/**
 * Run one bot once.
 *
 * @returns The outcome: a refusal before dispatch, a run failure, a
 *   completed run or a run parked as `awaiting-decision`.
 */
export async function runBot(input: RunBotInput): Promise<RunOutcome> {
  const env = input.env ?? process.env;
  const request: RunRequest = input.request ?? { kind: 'manual' };
  const minuteMs = input.minuteMs ?? MINUTE_MS;

  const resolved = resolveBotContext({ checkoutRoot: input.checkoutRoot, skilledTree: input.skilledTree, env: input.resolveEnv ?? env });
  if (!resolved.ok) {
    return { kind: 'refused', cause: 'identity-unknown', detail: resolved.reason, runId: null, recordPath: null, itemId: null };
  }
  const context = resolved.value;
  if (!isSafeSegment(input.botId)) {
    return { kind: 'refused', cause: 'definition-missing', detail: 'bot-id-invalid', runId: null, recordPath: null, itemId: null };
  }

  // An unknown id has no definition digest to key a record by, so it writes none.
  const path = definitionPath(context.checkoutRoot, input.botId);
  let bytes: Buffer;
  try {
    bytes = readFileSync(path);
  } catch {
    return { kind: 'refused', cause: 'definition-missing', detail: path, runId: null, recordPath: null, itemId: null };
  }
  const definitionDigest = digestOf(bytes);
  // Parsed from the bytes just hashed, so the approval check and the run see one definition.
  const parsed = parseDefinition(bytes.toString('utf8'));
  const definition = parsed.ok ? parsed.value : null;

  const runId = newRunId();
  const runFolder = resolveRunFolder({ skilledTree: context.skilledTree, identity: context.identity, runId });
  if (!runFolder.ok) {
    return { kind: 'refused', cause: 'run-folder-refused', detail: runFolder.reason, runId: null, recordPath: null, itemId: null };
  }
  ensureIdentityState(context.stateRoot, context.identity);
  const evidence = evidenceFor(runFolder.value, receiptFolder(context.stateRoot, context.identity, runId));

  // A scheduled fire carries the job's marker, and a queued or resume run is only started by the drain, so both run under a job's environment where the pinned operator is the actor. A run a person types is the OS user or --as.
  const scheduled = env[SCHEDULED_FIRE_ENV] === '1' || request.kind === 'scheduled' || request.kind === 'queued' || request.kind === 'resume';
  const resolvedActor = resolveActor({ as: input.actor ?? null, env, scheduled });

  const seed: RecordSeed = {
    identity: context.identity,
    checkoutRoot: context.checkoutRoot,
    botId: input.botId,
    runId,
    definitionDigest,
    requestId: request.kind === 'queued' || request.kind === 'resume' ? request.requestId : null,
    resumedItemId: request.kind === 'resume' ? request.itemId : null,
    firedSlot: request.kind === 'queued' ? request.firedSlot : null,
    source: request.kind === 'queued' ? request.source : request.kind === 'scheduled' ? SCHEDULE_SOURCE : request.kind,
    dispatchedAt: new Date().toISOString(),
    declared: definition?.budget ?? { maxIterations: 0, maxDurationMinutes: 0, timeoutSeconds: 0 },
    posture: declaredPosture(definition, context.config),
    evidence,
    delivery: definition?.delivery ?? null,
    actor: resolvedActor.ok ? resolvedActor.value : null,
    answeredBy: null,
  };

  // From here on a run has a seed, so a throw anywhere still ends in one record.
  let outcome: RunOutcome;
  try {
    mkdirSync(evidence.ledgerDir as string, { recursive: true, mode: STATE_DIR_MODE });
    // The audited runner reads its state log before appending a failure row, so it must exist.
    appendFileSync(join(evidence.ledgerDir as string, 'state.jsonl'), '');
    observe(seed, 'started', 'running', { mode: request.kind });
    outcome = await runSeeded(input, context, request, minuteMs, seed, definition, parsed);
  } catch (error: unknown) {
    outcome = closeThrownRun(context.stateRoot, seed, null, error);
  }
  // The terminal record is on disk before the first send starts.
  deliverTerminal(input, context.stateRoot, context.identity, outcome.runId);
  return outcome;
}

/**
 * The part of a run that follows its seed: the checks before the lease, the
 * lease, and everything the lease guards. The caller closes a throw from here
 * with one record; a throw once the lease is held is closed here, with the
 * lease nonce, before the lease is released.
 */
async function runSeeded(
  input: RunBotInput,
  context: BotContext,
  request: RunRequest,
  minuteMs: number,
  seed: RecordSeed,
  definition: BotDefinition | null,
  parsed: ReturnType<typeof parseDefinition>,
): Promise<RunOutcome> {
  const env = input.env ?? process.env;
  const runId = seed.runId;
  const evidence = seed.evidence;
  const runFolderPath = evidence.runFolder;

  // An unattended run trusts nothing a drifted file says, its trigger included, so this comes first.
  const approval = { stateRoot: context.stateRoot, identity: context.identity, checkoutRoot: context.checkoutRoot, botId: input.botId, definitionDigest: seed.definitionDigest };
  if (request.kind !== 'manual') {
    const unapproved = checkApproval(approval);
    if (unapproved !== null) return refusalRecord(context.stateRoot, seed, unapproved.cause, unapproved.detail, null, null);
  }

  if (definition === null || definition.id !== input.botId) {
    const detail = parsed.ok ? 'id-mismatch' : parsed.reason;
    return refusalRecord(context.stateRoot, seed, 'definition-malformed', detail, null, null);
  }

  if (request.kind === 'manual') {
    try {
      approveDefinition({ ...approval, by: 'manual-run' });
    } catch (error: unknown) {
      // The manual run itself needs no approval; an unattended run left unapproved refuses visibly.
      observe(seed, 'approval-unwritten', 'running', { detail: error instanceof Error ? error.message : String(error) });
    }
  }

  // A fire is accounted before any later check can refuse it, so a held,
  // disabled or paused fire still counts its slot once and never again.
  if (request.kind === 'scheduled') {
    const fired = recordScheduledFire({
      stateRoot: context.stateRoot,
      identity: context.identity,
      botId: input.botId,
      scheduleIndex: request.scheduleIndex,
      trigger: definition.trigger,
      firedAt: request.firedAt ?? new Date(),
      runId,
      summaryCap: context.config.retention.skippedSlotsPerSummary,
    });
    if (!fired.ok) {
      return refusalRecord(context.stateRoot, seed, 'schedule-stale', `${fired.reason}${fired.detail !== undefined ? `: ${fired.detail}` : ''}`, null, null);
    }
    const { scheduledAt, latenessSeconds, latenessClass, skippedSlots } = fired.value;
    seed.slot = { scheduledAt, latenessSeconds, latenessClass, skippedSlots, heldSlot: null };
    seed.firedSlot = scheduledAt;
  }

  // A bot ten failed runs switched off reads as fatigued rather than disabled, decided here because
  // this check refuses before anything else could name it. Disabled is read first, so a bot that is
  // both fatigued and completed reports the state the operator has to act on.
  if (readSwitch(context.stateRoot, context.identity, input.botId, 'disabled') !== null) {
    const cause = disabledCause(readRoutineState(context.stateRoot, context.identity, input.botId).state);
    return refusalRecord(context.stateRoot, seed, cause, null, null, null);
  }
  if (readSwitch(context.stateRoot, context.identity, input.botId, 'completed') !== null) {
    return refusalRecord(context.stateRoot, seed, 'routine-completed', null, null, null);
  }

  let resumeItem: NeedsYouItem | null = null;
  if (request.kind === 'resume') {
    const item = loadResumeItem(context, input.botId, request.itemId);
    if (!item.ok) return refusalRecord(context.stateRoot, seed, 'resume-item-invalid', item.reason, request.itemId, null);
    resumeItem = item.value;
    seed.answeredBy = resumeItem.answer?.by ?? null;
    // A grant can be read back from the run after its item is gone.
    const granted = resumeItem.grants ?? null;
    seed.grant = granted !== null && granted.scope !== null && granted.grantedBy !== null
      ? { itemId: resumeItem.id, kind: granted.kind, scope: granted.scope, by: granted.grantedBy }
      : null;
  }
  const hold = holdForBot(context.stateRoot, context.identity, input.botId);
  if (hold?.kind === 'open') {
    if (seed.slot) {
      // The fired slot is counted as skipped, once, and never backfilled once the item closes.
      seed.slot.heldSlot = { at: seed.slot.scheduledAt ?? seed.dispatchedAt, reason: HELD_SLOT_REASON };
    }
    return refusalRecord(
      context.stateRoot,
      seed,
      'awaiting-decision-hold',
      `answer it first: bots inbox lists item ${hold.item.id}`,
      hold.item.id,
      null,
    );
  }
  if (hold?.kind === 'unlistable') {
    return refusalRecord(
      context.stateRoot,
      seed,
      'needs-you-unlistable',
      `the needs-you folder could not be listed (${hold.code}); an open item of this bot may be in it`,
      null,
      null,
    );
  }
  if (hold?.kind === 'unreadable') {
    return refusalRecord(
      context.stateRoot,
      seed,
      'needs-you-unreadable',
      `needs-you item ${hold.itemIds.join(', ')} does not read and may be this bot's; repair or remove it`,
      hold.itemIds[0] ?? null,
      null,
    );
  }
  // An answered question holds the bot's other unattended runs until its resume has run, so the
  // resume finds the lease free and no newer question in its way. A manual run is the operator's own.
  if (request.kind === 'scheduled' || request.kind === 'queued') {
    const waiting = itemAwaitingResume(context.stateRoot, context.identity, input.botId);
    if (waiting !== null) {
      if (seed.slot) seed.slot.heldSlot = { at: seed.slot.scheduledAt ?? seed.dispatchedAt, reason: HELD_SLOT_REASON };
      return refusalRecord(
        context.stateRoot,
        seed,
        'awaiting-resume-hold',
        `item ${waiting.id} is answered and its resume has not run yet; it runs from the queue`,
        waiting.id,
        null,
      );
    }
  }

  const specFolder = resumeItem?.specFolder ?? definition.specFolder;
  const budgetSeconds = (definition.budget.maxDurationMinutes * minuteMs) / 1000;
  const boundIsBudget = budgetSeconds < definition.budget.timeoutSeconds;
  const boundSeconds = boundIsBudget ? budgetSeconds : definition.budget.timeoutSeconds;

  const key = leaseKey(context.identity, input.botId, specFolder);
  const lease = leaseFile(context.stateRoot, context.identity, key);
  const nowIso = new Date().toISOString();
  // The audited spawn blocks the event loop, so no heartbeat lands during a
  // dispatch. The lease lives past the longest possible invocation for that reason.
  const ttlMs = Math.ceil(boundSeconds * 1000) + PRECHECK_TIMEOUT_MS + PRECHECK_KILL_GRACE_MS + LEASE_MARGIN_MS;
  const acquired = acquireLoopLock(lease, {
    ownerPid: process.pid,
    startedAtIso: nowIso,
    ttlMs,
    lastHeartbeatIso: nowIso,
    packetId: key,
    runtimeKind: 'main',
    ownerKind: 'process',
    phase: 'running',
  });
  if (!acquired.acquired) {
    return refusalRecord(
      context.stateRoot,
      seed,
      'lease-held',
      acquired.holder === undefined ? null : `held by pid ${acquired.holder.ownerPid}`,
      null,
      null,
    );
  }
  const nonce = acquired.lock.acquireNonce ?? null;
  const sidePath = `${lease}.run.json`;

  // The lease is held from here, so every exit path below releases it.
  try {
    if (acquired.reclaimed !== undefined) {
      const closed = closeKilledRun(context.stateRoot, lease, acquired.reclaimed.ownerPid, env);
      deliverTerminal(input, context.stateRoot, context.identity, closed);
    }
    writeStateAtomic(sidePath, { ownerPid: process.pid, acquireNonce: nonce, seed } satisfies LeaseSideFile);
    startHeartbeat({ lockPath: lease, ownerPid: process.pid, ...(nonce !== null ? { acquireNonce: nonce } : {}) });

    if (readSwitch(context.stateRoot, context.identity, input.botId, 'paused') !== null) {
      return refusalRecord(context.stateRoot, seed, 'paused', null, null, nonce);
    }

    if (definition.precheck !== null) {
      const skipped = await runPrecheck(definition.precheck, context.checkoutRoot, env, input.precheckTimeoutMs ?? PRECHECK_TIMEOUT_MS);
      if (skipped !== null) return refusalRecord(context.stateRoot, seed, skipped.cause, skipped.detail, null, nonce);
    }

    const posture = validatePosture(definition, context.config, { fullAccess: installGrantsFullAccess(context.stateRoot, context.identity, input.botId) });
    if (!posture.ok) {
      return refusalRecord(context.stateRoot, seed, 'posture-refused', `${posture.reason}: ${posture.detail ?? ''}`.trim(), null, nonce);
    }
    seed.posture = posture.value.posture;

    // A filtered config narrows only a child that starts in its own tree, because the project
    // pin resolves against the child's working folder. A declaration anywhere else is refused
    // before any config is read, so the refusal names the isolation the author can change.
    const declaredApps = definition.posture.apps;
    if (declaredApps !== null && posture.value.posture.isolation !== 'worktree') {
      return refusalRecord(
        context.stateRoot,
        seed,
        'apps-unenforceable',
        `apps is declared and isolation is ${posture.value.posture.isolation}, so a filtered config needs a worktree`,
        null,
        nonce,
      );
    }
    const apps = resolveApps(context.checkoutRoot, declaredApps);
    if (!apps.ok) return refusalRecord(context.stateRoot, seed, 'apps-refused', `${apps.reason}: ${apps.detail ?? ''}`.trim(), null, nonce);
    // Every run writes its copy before any tree exists: it is the evidence the child's UTCP_CONFIG_FILE names.
    const utcp = writeRunUtcpConfig({ runFolder: runFolderPath, source: apps.value.source, honored: apps.value.honored });
    if (!utcp.ok) return refusalRecord(context.stateRoot, seed, 'apps-refused', `${utcp.reason}: ${utcp.detail ?? ''}`.trim(), null, nonce);
    seed.posture = { ...seed.posture, apps: apps.value.honored, secretsUsed: [] };

    // The secret is resolved after the precheck, so no precheck ever sees its value, which lives
    // only in this function and the dispatch input.
    const secretEnv: Record<string, string> = {};
    const secretName = definition.posture.secrets;
    if (secretName !== null) {
      const resolved = resolveSecret(context.stateRoot, context.identity, secretName, { env });
      if (!resolved.ok) return refusalRecord(context.stateRoot, seed, resolved.reason as RefusalCause, resolved.detail ?? null, null, nonce);
      secretEnv[secretEnvKey(secretName)] = resolved.value;
      seed.posture = { ...seed.posture, secretsUsed: [secretName] };
    }

    // Memory reaches only a freshly composed prompt: a resumed run re-sends its parked prompt as it was.
    const memory: Array<{ path: string; block: string }> = [];
    if (resumeItem === null && definition.memory) {
      const own = botMemoryFile(context.stateRoot, context.identity, input.botId);
      if (!own.ok) throw new Error(own.reason);
      for (const path of [sharedMemoryFile(context.stateRoot), own.value]) {
        const block = renderMemoryBlock(path, readMemoryFile(path).entries);
        if (block !== null) memory.push({ path, block });
      }
    }
    // Every stored value guards every body, a bot that declares no secret included, because its body could still carry one.
    const allKnown = collectAllKnownSecrets(env, context.checkoutRoot, context.stateRoot, context.identity);
    if (!allKnown.ok) return refusalRecord(context.stateRoot, seed, 'secret-store-unreadable', allKnown.detail ?? null, null, nonce);
    const known = allKnown.value;
    const texts: Array<[string, string]> = [['body', definition.body]];
    for (const { path, block } of memory) texts.push([`memory ${path}`, block]);
    if (resumeItem !== null) {
      texts.push(['question', resumeItem.question], ['answer', resumeItem.answer?.text ?? '']);
    }
    const requestPrompt = request.kind === 'queued' && request.prompt.trim() !== '' ? request.prompt : null;
    if (requestPrompt !== null) texts.push(['request prompt', requestPrompt]);
    for (const [label, text] of texts) {
      const match = findSecretLiteral(text, known);
      if (match !== null) {
        return refusalRecord(context.stateRoot, seed, 'body-secret', `${label} holds a literal of ${match.kind} ${match.name}`, null, nonce);
      }
    }

    const kind = posture.value.executor.kind as ExecutorKind;
    let prompt: string | null = null;
    if (resumeItem !== null) {
      const resumed = buildResumedPrompt(resumeItem);
      if (!resumed.ok) return refusalRecord(context.stateRoot, seed, 'resume-item-invalid', resumed.reason, resumeItem.id, nonce);
      prompt = resumed.value;
    }

    const resultLedger = openResultLedger({
      ledgerDir: evidence.ledgerDir as string,
      authorityRoot: sharedStatePaths(context.stateRoot).authority,
      checkoutRoot: context.checkoutRoot,
    });
    if (!resultLedger.ok) {
      return refusalRecord(
        context.stateRoot,
        seed,
        'result-ledger-unbound',
        `${resultLedger.reason}${resultLedger.detail !== undefined ? `: ${resultLedger.detail}` : ''}`,
        null,
        nonce,
      );
    }

    // The tree is made after every refusal but the executor's own, which finishes it.
    let tree: BotWorktree | null = null;
    const wantsTree = posture.value.posture.isolation === 'worktree';
    const parkedTree = resumeItem !== null ? parkedTreeFor(context, resumeItem, wantsTree) : null;
    if (parkedTree !== null && !parkedTree.ok) {
      return refusalRecord(context.stateRoot, seed, parkedTree.cause, parkedTree.detail, resumeItem?.id ?? null, nonce);
    }
    if (parkedTree !== null && parkedTree.value !== null) {
      // A resume continues the parked work, so it works in the parked tree and never makes a fresh one.
      const parkedHandle = parkedTree.value.tree;
      const reopened = reopenBotWorktree(context.checkoutRoot, parkedHandle, env);
      if (!reopened.ok) {
        return refusalRecord(context.stateRoot, seed, 'parked-worktree-missing', reopened.detail ?? reopened.reason, resumeItem?.id ?? null, nonce);
      }
      // A run killed between writing the filtered copy and putting the tree's own file back
      // leaves the copy behind, so the tree's file is restored before this run writes anything.
      const restored = restoreOrphanedUtcpConfig(context.checkoutRoot, parkedHandle.path, env);
      if (!restored.ok) {
        return refusalRecord(context.stateRoot, seed, 'apps-refused', `${restored.reason}: ${restored.detail ?? ''}`.trim(), resumeItem?.id ?? null, nonce);
      }
      if (prompt !== null && runsOutsideCheckout(kind) && !prompt.includes(checkoutLine(parkedHandle.path))) {
        // A child that starts outside the checkout reads files only through the
        // path its prompt names. The parked prompt must name the tree this run
        // works in, built by the same line builder; one that names another folder,
        // or none, is refused rather than handed to a child with a stale path.
        // The check runs before the record takes the tree, so the tree stays kept.
        return refusalRecord(context.stateRoot, seed, 'resume-item-invalid', 'the parked prompt does not name the parked tree as its checkout', resumeItem?.id ?? null, nonce);
      }
      tree = parkedHandle;
      seed.evidence = {
        ...seed.evidence,
        worktreePath: tree.path,
        branch: tree.branch,
        worktree: { ...activeTreeEvidence(tree, parkedTree.value.postureSource), detail: `resumed the tree kept by run ${resumeItem?.runId ?? 'unknown'}` },
      };
      writeStateAtomic(sidePath, { ownerPid: process.pid, acquireNonce: nonce, seed } satisfies LeaseSideFile);
      observe(seed, 'worktree', 'running', { branch: tree.branch, resumed: true });
    } else if (wantsTree) {
      const postureSource = definition.posture.isolation !== null ? 'definition' : 'repository-default';
      const made = createBotWorktree({
        checkoutRoot: context.checkoutRoot,
        skilledTree: context.skilledTree,
        botId: input.botId,
        config: context.config,
        env,
        ...(input.namingScript !== undefined ? { namingScript: input.namingScript } : {}),
      });
      if (!made.ok) {
        const detail = `${made.reason}${made.detail !== undefined ? `: ${made.detail}` : ''}`;
        if (made.kept === null) return refusalRecord(context.stateRoot, seed, 'worktree-refused', detail, null, nonce);
        seed.evidence = {
          ...seed.evidence,
          worktreePath: made.kept.path,
          branch: made.kept.branch,
          worktree: { ...activeTreeEvidence(made.kept, postureSource), disposition: 'kept', keptReason: 'half-provisioned', detail },
        };
        return refusalRecord(context.stateRoot, seed, 'worktree-setup-failed', detail, null, nonce);
      }
      tree = made.value;
      seed.evidence = { ...seed.evidence, worktreePath: tree.path, branch: tree.branch, worktree: activeTreeEvidence(tree, postureSource) };
      // A run killed from here on is closed by whoever reclaims the lease, so the side file must name the tree.
      writeStateAtomic(sidePath, { ownerPid: process.pid, acquireNonce: nonce, seed } satisfies LeaseSideFile);
      observe(seed, 'worktree', 'running', { branch: tree.branch, setup_ms: tree.setupMs });
    }
    const workDir = tree?.path ?? context.checkoutRoot;

    // A tree keeps the branch it was made on, so only a shared run reads git. One value feeds the record and the prompt, so they cannot disagree.
    const branch = tree !== null ? tree.branch : checkoutBranch(context.checkoutRoot, env);
    seed.evidence = { ...seed.evidence, branch };
    const workingPlace: WorkingPlace = { path: workDir, branch, runFolder: runFolderPath };

    if (prompt !== null) {
      // Only a resumed run has a prompt here, and it is the parked one, so it is checked rather than recomposed.
      const placed = placeWorkingLine(prompt, workingPlace);
      if (!placed.ok) {
        // A resumed tree goes back to waiting with its item, so the refusal never records it as active.
        if (seed.evidence.worktree) seed.evidence.worktree = { ...seed.evidence.worktree, disposition: 'kept', keptReason: AWAITING_DECISION_KEPT_REASON };
        return refusalRecord(context.stateRoot, seed, 'resume-item-invalid', placed.reason, resumeItem?.id ?? null, nonce);
      }
      prompt = placed.value;
    }

    if (prompt === null) {
      const built = buildBotPrompt({
        body: definition.body,
        specFolder,
        workingPlace,
        checkoutRoot: runsOutsideCheckout(kind) ? workDir : null,
        scheduled: request.kind === 'scheduled',
        memoryBlocks: memory.map(({ block }) => block),
        requestPrompt,
      });
      if (!built.ok) {
        settleUnusedTree(seed, tree, false, context.checkoutRoot, env);
        return refusalRecord(context.stateRoot, seed, 'prompt-over-budget', built.detail ?? null, null, nonce);
      }
      prompt = built.value;
    } else {
      // A resumed run joins its prompt from the parked record and never through the builder, so the bound is checked here.
      const fitted = checkPromptBudget(prompt);
      if (!fitted.ok) {
        settleUnusedTree(seed, tree, parkedTree !== null && parkedTree.value !== null, context.checkoutRoot, env);
        return refusalRecord(context.stateRoot, seed, 'prompt-over-budget', fitted.detail ?? null, resumeItem?.id ?? null, nonce);
      }
      prompt = fitted.value;
    }

    // The tree's copy is written last before the child starts, so no earlier refusal leaves a
    // tree holding it, and the tree's own file is put back the moment the child is done.
    let treeOriginal: string | null | undefined;
    if (tree !== null) {
      const treeCopy = writeRunUtcpConfig({ runFolder: runFolderPath, worktree: tree.path });
      if (!treeCopy.ok) {
        settleUnusedTree(seed, tree, parkedTree !== null && parkedTree.value !== null, context.checkoutRoot, env);
        return refusalRecord(context.stateRoot, seed, 'apps-refused', `${treeCopy.reason}: ${treeCopy.detail ?? ''}`.trim(), null, nonce);
      }
      treeOriginal = treeCopy.value.treeOriginal;
    }

    mkdirSync(evidence.receiptDir as string, { recursive: true, mode: STATE_DIR_MODE });
    seed.dispatchedAt = new Date().toISOString();
    observe(seed, 'dispatching', 'running', { model: posture.value.posture.model, sandbox: posture.value.posture.sandbox });
    let outcome: DispatchOutcome;
    try {
      outcome = dispatchHeadless({
        executor: posture.value.executor,
        prompt,
        cwd: workDir,
        runId,
        parentEnv: env,
        boundSeconds,
        boundIsBudget,
        stateLogPath: join(evidence.ledgerDir as string, 'state.jsonl'),
        receiptDir: evidence.receiptDir as string,
        stdoutLogPath: join(runFolderPath, 'stdout.log'),
        extraEnv: { UTCP_CONFIG_FILE: utcp.value.path, ...secretEnv },
        ...(input.buildCommand !== undefined ? { buildCommand: input.buildCommand } : {}),
        ...(input.guard !== undefined ? { guard: input.guard } : {}),
      });
    } finally {
      if (tree !== null && treeOriginal !== undefined) restoreTreeUtcpConfig(tree.path, treeOriginal);
    }

    // The builder resolved the agent a read-only OpenCode child would run and found a
    // write action left open, so no child was started: a refusal, not a failed run.
    if (outcome.reason === READ_ONLY_UNCONFINED) {
      // The tree was made before the builder could refuse, and no child touched it.
      settleUnusedTree(seed, tree, parkedTree !== null && parkedTree.value !== null, context.checkoutRoot, env);
      return refusalRecord(context.stateRoot, seed, 'read-only-unconfined', outcome.detail, null, nonce);
    }

    const postRunCauses: PostRunCause[] = [];
    // The scan runs before anything reads the child's output, so the answer text, the decision
    // marker and the delivery message all come from the redacted copy.
    const scanned = scanRunOutput(known, outcome, [runFolderPath, evidence.receiptDir as string], runFolderPath);
    outcome = { ...outcome, stdout: scanned.stdout, stderr: scanned.stderr };
    if (scanned.stderr !== '') process.stderr.write(scanned.stderr);
    if (scanned.cause !== null) postRunCauses.push(scanned.cause);

    // A timeout or budget stop keeps its class even when the child asked a question first,
    // and so does a Vibe run whose own record says it did not finish.
    const stopped = outcome.reason === 'timeout'
      || outcome.reason === 'maxDurationReached'
      || outcome.reason === VIBE_RUN_UNFINISHED
      || outcome.runnerExit !== 0;
    const answer = outcome.dispatched && !stopped ? finalAnswerText(kind, outcome.stdout) : null;
    const signal = answer !== null ? parseDecisionMarker(answer) : { kind: 'none' as const };

    let exit: RunRecord['exit'];
    let result: RunOutcome;
    if (signal.kind === 'question') {
      const classified = classifyAction(signal.question);
      if (!classified.ok) {
        // A declaration outside the seven kinds is the bot's own mistake, so the run fails rather than parks.
        exit = { reason: 'action-kind-invalid', class: 'author', needsYouItemId: null, refusal: null };
        result = { kind: 'failed', reason: exit.reason, class: 'author', runId, recordPath: null, recursionGuard: false };
        observe(seed, 'action-kind', 'refused', { detail: classified.detail ?? null });
      } else {
        const created = new Date();
        const item: NeedsYouItem = {
          id: runId,
          runId,
          botId: input.botId,
          identity: context.identity,
          question: signal.question,
          options: signal.options,
          createdAt: created.toISOString(),
          expiresAt: needsYouExpiry(created, context.config.needsYou.expiryDays),
          evidence: [evidence.runFolder, evidence.ledgerDir, evidence.receiptDir, evidence.observabilityStream].filter(
            (entry): entry is string => entry !== null,
          ),
          prompt,
          specFolder,
          answer: null,
          resumeRequestId: null,
          grants: {
            kind: classified.value,
            action: clipAction(signal.question),
            rung: decideApproval({ kind: classified.value }).rung,
            scope: null,
            grantedBy: null,
            grantedAt: null,
          },
        };
        const written = writeNeedsYouItem(context.stateRoot, item);
        if (written.ok) {
          writeGenerationStamp(context.stateRoot, context.identity);
          exit = { reason: AWAITING_DECISION, class: 'operator', needsYouItemId: runId, refusal: null };
          result = { kind: 'awaiting-decision', runId, recordPath: null, itemId: runId };
        } else {
          // A parked run must point at an item that exists; without one it is the runner's failure.
          const reason = `needs-you-item-refused:${written.reason}`;
          exit = { reason, class: 'hub', needsYouItemId: null, refusal: null };
          result = { kind: 'failed', reason, class: 'hub', runId, recordPath: null, recursionGuard: false };
        }
      }
    } else if (signal.kind === 'empty') {
      exit = { reason: 'decision-marker-empty', class: 'author', needsYouItemId: null, refusal: null };
      result = { kind: 'failed', reason: exit.reason, class: 'author', runId, recordPath: null, recursionGuard: false };
    } else if (outcome.clean) {
      exit = { reason: STOP.converged as string, class: null, needsYouItemId: null, refusal: null };
      result = { kind: 'completed', runId, recordPath: null };
    } else {
      const reason = outcome.reason ?? 'error';
      exit = { reason, class: outcome.class, needsYouItemId: null, refusal: null };
      result = { kind: 'failed', reason, class: outcome.class, runId, recordPath: null, recursionGuard: outcome.runnerExit !== 0 };
    }

    // One result event per run, keyed by the run id. A failed write is
    // retried by re-sending this same event; the run is never dispatched twice.
    const event = resultLedger.value.prepare({
      runId,
      botId: input.botId,
      reason: exit.reason,
      class: exit.class,
      needsYouItemId: exit.needsYouItemId,
    });
    const sent = await sendResultEvent(resultLedger.value, event);
    let resultEventId: string | null = resultEventKey(runId);
    if (!sent.ok) {
      resultEventId = null;
      // A parked run's item still holds the bot, so the failed exit keeps naming it.
      exit = { reason: RESULT_EVENT_UNRECORDED, class: 'hub', needsYouItemId: exit.needsYouItemId, refusal: null };
      result = { kind: 'failed', reason: exit.reason, class: 'hub', runId, recordPath: null, recursionGuard: false };
      observe(seed, 'result-event-unrecorded', 'stopped', { detail: sent.reason, attempts: sent.attempts });
    }
    // Only a completed run may propose a fact. A run that parked a question or failed has not
    // finished its work, so a fact it names may be about work it did not do. A second line is ignored.
    const remember = result.kind === 'completed' && answer !== null ? parseRememberMarker(answer) : { kind: 'none' as const };
    if (remember.kind === 'remember') {
      const fact = collapseText(remember.fact);
      if (!(MEMORY_TYPES as readonly string[]).includes(remember.type) || fact === '') {
        // The type is never guessed, because a guessed type is a wrong fact about where the fact came from.
        postRunCauses.push({ cause: 'remember-type-invalid', names: [], detail: null });
      } else if (fact.length > MEMORY_LIMITS.text) {
        // A cut fact reads as a whole one, so an over-long fact is reported and never cut to fit.
        postRunCauses.push({ cause: 'remember-fact-too-long', names: [], detail: String(fact.length) });
      } else {
        const match = findSecretLiteral(fact, known);
        if (match !== null) {
          postRunCauses.push({ cause: 'memory-proposal-secret', names: [match.name], detail: null });
        } else {
          const created = new Date();
          const question = `Remember this fact for ${input.botId}: ${fact}`;
          const classified = classifyAction(question);
          if (!classified.ok) {
            observe(seed, 'memory-proposal', 'refused', { reason: classified.reason });
          } else {
            // The item carries the reserved memory-proposals sentinel as its bot, so it names a review queue and holds no bot.
            const proposal: NeedsYouItem = {
              id: runId,
              runId,
              botId: MEMORY_PROPOSALS_BOT_ID,
              identity: context.identity,
              question,
              options: ['confirm', 'reject'],
              createdAt: created.toISOString(),
              expiresAt: needsYouExpiry(created, context.config.needsYou.expiryDays),
              evidence: [evidence.runFolder].filter((entry): entry is string => entry !== null),
              prompt,
              specFolder,
              answer: null,
              resumeRequestId: null,
              grants: {
                kind: classified.value,
                action: clipAction(question),
                rung: decideApproval({ kind: classified.value }).rung,
                scope: null,
                grantedBy: null,
                grantedAt: null,
              },
              kind: 'memory-proposal',
              proposalType: remember.type as MemoryType,
              proposalFact: fact,
              proposalBotId: input.botId,
            };
            const written = writeNeedsYouItem(context.stateRoot, proposal);
            if (written.ok) writeGenerationStamp(context.stateRoot, context.identity);
            else observe(seed, 'memory-proposal', 'refused', { reason: written.reason });
          }
        }
      }
      observe(seed, 'remember', postRunCauses.length > 0 ? 'refused' : 'proposed', postRunCauses.length > 0 ? { cause: postRunCauses[0]?.cause } : {});
    }
    if (tree !== null && seed.evidence.worktree && exit.needsYouItemId !== null) {
      // The answer resumes this run in this same tree, so the tree waits with the item.
      seed.evidence.worktree = { ...seed.evidence.worktree, disposition: 'kept', keptReason: AWAITING_DECISION_KEPT_REASON };
      observe(seed, 'worktree', 'kept', { reason: AWAITING_DECISION_KEPT_REASON });
    } else if (tree !== null && seed.evidence.worktree) {
      const finished = finishBotWorktree(context.checkoutRoot, tree, env);
      const detail = [seed.evidence.worktree.detail, finished.detail].filter((part): part is string => part !== null && part !== '').join('; ');
      seed.evidence.worktree = { ...seed.evidence.worktree, disposition: finished.disposition, keptReason: finished.keptReason, detail: detail === '' ? null : detail };
      observe(seed, 'worktree', finished.disposition, { reason: finished.keptReason });
    }
    // The routine's until_check runs only after a completed run, in the bound checkout or the identity's
    // state folder when the checkout is gone, with the precheck's own environment and bound.
    let until: UntilObservation | null = null;
    const untilCheck = definition.routine?.untilCheck ?? null;
    if (result.kind === 'completed' && untilCheck !== null) {
      const cwd = existsSync(context.checkoutRoot) ? context.checkoutRoot : identityStatePaths(context.stateRoot, context.identity).base;
      const checked = await runPrecheck(untilCheck, cwd, env, input.precheckTimeoutMs ?? PRECHECK_TIMEOUT_MS);
      // The helper reports a printed [SILENT] marker as precheck-silent, but for this check only the exit code counts.
      const met = checked === null || checked.cause === 'precheck-silent';
      until = { met };
      if (met) {
        recordUntilOutcome(context.stateRoot, context.identity, input.botId, true);
        setSwitch(context.stateRoot, context.identity, input.botId, 'completed');
      }
      observe(seed, 'until-check', met ? 'met' : 'not-met', checked !== null && !met ? { detail: checked.detail } : {});
    }
    observe(seed, 'terminal', 'stopped', {
      reason: exit.reason,
      duration_ms: outcome.elapsedMs,
      ...(outcome.detail !== null ? { detail: outcome.detail } : {}),
    });
    const recordPath = writeTerminal(
      context.stateRoot,
      buildRecord(seed, exit, {
        leaseNonce: nonce,
        resultEventId,
        iterations: outcome.dispatched ? 1 : 0,
        elapsedMs: outcome.elapsedMs,
        until,
        postRunCauses,
      }),
    );
    // The streak counts this run, so the rule is read after its record is written. A refused
    // evaluation leaves the bot running, which is the side a later failed run repairs.
    if (result.kind === 'failed') {
      const fatigue = evaluateFatigue({
        stateRoot: context.stateRoot,
        identity: context.identity,
        botId: input.botId,
        runId,
        prompt,
        expiryDays: context.config.needsYou.expiryDays,
      });
      if (fatigue.ok && fatigue.value !== null) {
        writeGenerationStamp(context.stateRoot, context.identity);
        observe(seed, 'fatigue', 'disabled', { item: fatigue.value });
      }
    }
    return { ...result, recordPath };
  } catch (error: unknown) {
    const tree = seed.evidence.worktree;
    if (tree !== undefined && tree !== null && tree.disposition === 'active') {
      // A throw may land mid-edit, so the tree is kept for the operator, never removed.
      seed.evidence.worktree = { ...tree, disposition: 'kept', keptReason: 'runner-error', detail: null };
    }
    return closeThrownRun(context.stateRoot, seed, nonce, error);
  } finally {
    stopHeartbeat();
    try {
      rmSync(sidePath, { force: true });
    } catch {
      // A side file that cannot be removed must not keep the lease held.
    }
    releaseLoopLock(lease, process.pid, nonce ?? undefined);
  }
}
