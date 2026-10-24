// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Session Relaunch
// ───────────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import path from 'node:path';

import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
import {
  configPath,
  isHookEnabled,
  loadConfigFile,
} from '../../.skilled/hooks/shared/hook-flags.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 1. TYPES AND MODULES
// ─────────────────────────────────────────────────────────────────────────────

interface RelaunchRecord {
  armId?: string;
  armedAt?: string;
  handoff?: string;
  runtime?: string;
  sessionId?: string;
  status?: string;
}

interface CoreModule {
  appendLog(
    event: string,
    fields?: Record<string, unknown>,
    env?: NodeJS.ProcessEnv,
  ): string;
  arm(options: {
    loopId: string;
    cwd: string;
    env: NodeJS.ProcessEnv;
  }): RelaunchRecord | null;
  armableRecord(
    record: RelaunchRecord | null,
    options: { loopId: string; sessionId: string; runtime: string; env: NodeJS.ProcessEnv },
  ): { armable: boolean; reason: string };
  dropNestedLoop(env: NodeJS.ProcessEnv, options: { hostPid: number }): boolean;
  parseHandoff(text: string): { frontmatter: Record<string, unknown> };
  readRelaunchFile(loopId: string, env: NodeJS.ProcessEnv): RelaunchRecord | null;
}

// CoreModule is a hand-written view of a CommonJS module no compiler checks it against,
// so each function it names is checked once at load: a renamed or missing export then
// fails the load instead of the first arm, which would otherwise fail in silence.
const CORE_FUNCTIONS = [
  'appendLog',
  'arm',
  'armableRecord',
  'dropNestedLoop',
  'parseHandoff',
  'readRelaunchFile',
] as const;

interface ContextUsageModule {
  fillFromPiUsage(usage: unknown): number;
  fillRatio(fillTokens: number, windowTokens: number): number;
}

interface NudgeDecision {
  level: number;
  nudge: boolean;
  reason: string;
}

interface NudgeModule {
  CLI_COMMAND: string;
  handoffText(options: {
    notePath: string;
    sessionId: string;
    specFolder: string | undefined;
    runtime: string;
    cliPath: string;
    cwd: string;
    ratio: number;
  }): string;
  isSeedPrompt(text: unknown): boolean;
  seedInstructions(options: { prompt: unknown; sessionId: string }): string | null;
  seedText(options: {
    notePath: string;
    specFolder: string | undefined;
    sessionId: string;
    cliPath: string;
    afterCompaction?: boolean;
  }): string;
  specFolderInput(options: { env?: NodeJS.ProcessEnv }): string | undefined;
  resolveRepoRoot(env?: NodeJS.ProcessEnv): string;
  plannedNotePath(options: {
    cwd: string;
    sessionId: string;
    env?: NodeJS.ProcessEnv;
    now?: Date;
  }): string;
  openNotePathFor(options: { repoRoot: string; sessionId: string }): string | null;
  handoffPending(options: {
    sessionId: string;
    env?: NodeJS.ProcessEnv;
  }): boolean;
  hopLimitReached(env?: NodeJS.ProcessEnv): boolean;
  relaunchThreshold(
    config?: Record<string, string>,
    env?: NodeJS.ProcessEnv,
  ): number;
  nudgeDecision(options: {
    ratio: number;
    threshold: number;
    sessionId: string;
    env?: NodeJS.ProcessEnv;
  }): NudgeDecision;
  handoffWithdrawn(options: {
    sessionId: string;
    notePath: string;
    env?: NodeJS.ProcessEnv;
  }): boolean;
  staleNoteText(options: { notePath: string }): string;
  validSessionId(sessionId: unknown): boolean;
  writeState(sessionId: string, level: number, env: NodeJS.ProcessEnv): void;
}

interface WithdrawModule {
  withdrawHandOver(options: {
    loopId: string;
    reason: string;
    sessionId?: string;
    pending?: 'deferred' | 'any' | 'none';
    env?: NodeJS.ProcessEnv;
  }): RelaunchRecord | null;
}

type AdapterModules = {
  core: CoreModule;
  contextUsage: ContextUsageModule;
  nudge: NudgeModule;
  withdraw: WithdrawModule;
};

// The ambient extension shim declares the events its extensions registered, and the
// post-compaction one is not among them. The extra surface is declared here at the point of
// use, as the killer child's EventEmitter surface is; a running Pi supplies the real signature.
type CompactionRegistrar = {
  on(
    event: 'session_compact',
    handler: (event: unknown, ctx: ExtensionContext) => unknown,
  ): void;
};

// The shim declares no start event either, though a running Pi emits one before each turn.
type AgentStartRegistrar = {
  on(
    event: 'agent_start',
    handler: (event: unknown, ctx: ExtensionContext) => unknown,
  ): void;
};

const CONCERN = 'session-relaunch';
let modulesPromise: Promise<AdapterModules> | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function asModule<T>(value: unknown): T {
  const moduleValue = value as { default?: unknown };
  return (moduleValue.default ?? value) as T;
}

// `../lib/` resolves only from the real `.skilled/hooks/session-relaunch/pi/`
// path, not the `.pi/extensions/` base this file is typechecked through. The
// `as string` assertion keeps the typechecker from resolving a missing path
// while transpilers still emit the literal specifier for the module loader.
function checkedCore(core: CoreModule): CoreModule {
  const exports = core as unknown as Record<string, unknown>;
  for (const name of CORE_FUNCTIONS) {
    if (typeof exports[name] !== 'function') {
      throw new Error(`session-relaunch core does not export ${name} as a function`);
    }
  }
  return core;
}

async function loadCore(): Promise<CoreModule> {
  let core: CoreModule;
  try {
    core = asModule<CoreModule>(await import('../lib/relaunch-core.cjs' as string));
  } catch {
    core = asModule<CoreModule>(
      await import('../../.skilled/hooks/session-relaunch/lib/relaunch-core.cjs'),
    );
  }
  return checkedCore(core);
}

async function loadContextUsage(): Promise<ContextUsageModule> {
  try {
    return asModule<ContextUsageModule>(await import('../lib/context-usage.cjs' as string));
  } catch {
    return asModule<ContextUsageModule>(
      await import('../../.skilled/hooks/session-relaunch/lib/context-usage.cjs'),
    );
  }
}

async function loadNudge(): Promise<NudgeModule> {
  try {
    return asModule<NudgeModule>(await import('../lib/nudge.cjs' as string));
  } catch {
    return asModule<NudgeModule>(
      await import('../../.skilled/hooks/session-relaunch/lib/nudge.cjs'),
    );
  }
}

async function loadWithdraw(): Promise<WithdrawModule> {
  let withdraw: WithdrawModule;
  try {
    withdraw = asModule<WithdrawModule>(await import('../lib/withdraw.cjs' as string));
  } catch {
    withdraw = asModule<WithdrawModule>(
      await import('../../.skilled/hooks/session-relaunch/lib/withdraw.cjs'),
    );
  }
  if (typeof withdraw.withdrawHandOver !== 'function') {
    throw new Error('session-relaunch withdraw does not export withdrawHandOver as a function');
  }
  return withdraw;
}

function loadModules(): Promise<AdapterModules> {
  if (modulesPromise === null) {
    modulesPromise = Promise.all([loadCore(), loadContextUsage(), loadNudge(), loadWithdraw()])
      .then(([core, contextUsage, nudge, withdraw]) => {
        // A nested run inherits the loop variables of the session that started it, and the host
        // shares one process environment, so they are dropped before any handler reads
        // SKILLED_LOOP_ID and hands off under a loop this process does not own. Resolving the
        // modules is once per host, so the drop runs once per host too; reading the process
        // table on every event is what this placement avoids.
        try {
          core.dropNestedLoop(process.env, { hostPid: process.pid });
        } catch {}
        return { core, contextUsage, nudge, withdraw };
      })
      .catch((error: unknown) => {
        modulesPromise = null;
        throw error;
      });
  }
  return modulesPromise;
}

function isEnabled(config: Record<string, string>): boolean {
  try {
    return isHookEnabled(CONCERN, process.env, config);
  } catch {
    return false;
  }
}

function sessionIdOf(ctx: ExtensionContext, nudge: NudgeModule): string | null {
  try {
    const sessionId = ctx.sessionManager.getSessionId();
    return nudge.validSessionId(sessionId) ? sessionId : null;
  } catch {
    return null;
  }
}

function positiveNumber(value: unknown): number | null {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function contextWindow(ctx: ExtensionContext): number | null {
  return positiveNumber(process.env.SESSION_RELAUNCH_WINDOW_TOKENS)
    ?? positiveNumber(ctx.getContextUsage()?.contextWindow);
}

// Notes and the killer script both hang off the repository that holds these lib modules,
// so the adapter asks the nudge module for that root instead of trusting the session cwd.
async function resolveRepoRoot(): Promise<string> {
  const modules = await loadModules();
  return modules.nudge.resolveRepoRoot(process.env);
}

// The killer script sits beside the lib modules this adapter loads, but `import.meta`
// cannot anchor it: through the `.pi/extensions/` link this file typechecks as
// CommonJS, which rejects `import.meta`. The extension only runs inside the repository
// that owns `.pi/`, so walking up from the session cwd reaches the lib directory the
// dual-base imports resolved. The trailing join falls back to the root the nudge module
// resolves, which is the repository holding those modules even from an outside cwd.
async function resolveKillerPath(cwd: string): Promise<string> {
  const fs = asModule<{ existsSync(candidate: string): boolean }>(
    await import('node:fs' as string),
  );
  const segments = ['.skilled', 'hooks', 'session-relaunch', 'lib', 'killer.cjs'];
  let directory = path.resolve(cwd || process.cwd());
  for (;;) {
    const candidate = path.join(directory, ...segments);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.resolve(directory, '..');
    if (parent === directory) {
      return path.join(await resolveRepoRoot(), ...segments);
    }
    directory = parent;
  }
}

// The ambient ChildProcess shim stays minimal, so the killer child's
// EventEmitter surface is declared here at the point of use.
type KillerChild = {
  once?(event: 'error', listener: (error: Error) => void): unknown;
  unref?(): unknown;
};

// Logging is best-effort: a state-dir failure must never break the extension host.
function logSpawnError(core: CoreModule, loopId: string, error: unknown): void {
  try {
    core.appendLog('agent-end-arm-error', {
      stage: 'spawn',
      loopId,
      message: error instanceof Error ? error.message : String(error),
    }, process.env);
  } catch {}
}

// The pointer is recorded in the same log as every other handoff step, and a state-dir write
// that fails must not be the reason the session is left without its note.
function logPointer(
  core: CoreModule,
  sessionId: string,
  notePath: string,
  event = 'compact-pointer',
): void {
  try {
    core.appendLog(event, { sessionId, note: notePath }, process.env);
  } catch {}
}

// The withdrawal is a handoff step like the arm itself, so it lands in the same log, and a
// state-dir write that fails must not fail the turn that withdrew it.
function logArmCancelled(core: CoreModule, loopId: string, sessionId: string): void {
  try {
    core.appendLog('arm-cancelled', { loopId, sessionId, reason: 'user-message' }, process.env);
  } catch {}
}

// The ambient shim declares no `node:fs`, so the note is read through the dynamic import the
// killer path already resolves. A note whose frontmatter will not parse costs only its packet:
// the seed still names the work worth claiming.
async function noteSpecFolder(core: CoreModule, notePath: string): Promise<string> {
  try {
    const fs = asModule<{ readFileSync(filePath: string, encoding: 'utf8'): string }>(
      await import('node:fs' as string),
    );
    const folder = core.parseHandoff(fs.readFileSync(notePath, 'utf8')).frontmatter.spec_folder;
    return typeof folder === 'string' ? folder : '';
  } catch {
    return '';
  }
}

async function spawnKiller(
  core: CoreModule,
  loopId: string,
  cwd: string,
  sessionFile?: string,
): Promise<void> {
  const killerPath = await resolveKillerPath(cwd);
  const args = [
    killerPath,
    '--loop-id',
    loopId,
    '--target-pid',
    String(process.pid),
  ];
  if (typeof sessionFile === 'string' && sessionFile) {
    args.push('--transcript', sessionFile);
  }
  try {
    const child: KillerChild = spawn(
      process.execPath,
      args,
      { detached: true, stdio: 'ignore' },
    );
    if (typeof child.once === 'function') {
      child.once('error', (error: Error) => logSpawnError(core, loopId, error));
    }
    if (typeof child.unref === 'function') child.unref();
  } catch (error: unknown) {
    logSpawnError(core, loopId, error);
  }
}

// Pending arms here; an armed record belongs to a killer, so it respawns only
// when no live killer owns the lock. The core's verdict decides both.
async function armRelaunch(
  modules: AdapterModules,
  ctx: ExtensionContext,
  sessionId: string,
): Promise<void> {
  const loopId = process.env.SKILLED_LOOP_ID;
  if (!loopId) return;

  const record = modules.core.readRelaunchFile(loopId, process.env);
  const verdict = modules.core.armableRecord(record, {
    loopId,
    sessionId,
    runtime: 'pi',
    env: process.env,
  });
  if (!verdict.armable) return;

  const armed = modules.core.arm({ loopId, cwd: ctx.cwd, env: process.env });
  if (armed?.status !== 'armed') return;

  let sessionFile: string | undefined;
  try {
    sessionFile = ctx.sessionManager.getSessionFile();
  } catch {
    sessionFile = undefined;
  }
  await spawnKiller(modules.core, loopId, ctx.cwd, sessionFile);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXTENSION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Register the message_end, before_agent_start, agent_start, agent_end and session_compact
 * hooks on the Pi extension host.
 */
export default function sessionRelaunch(pi: ExtensionAPI): void {
  // Keyed by session id, so two sessions in one host process never swap a nudge.
  const heldNudges = new Map<string, string>();

  pi.on('message_end', async (event, ctx) => {
    try {
      const config = loadConfigFile(configPath());
      if (!isEnabled(config)) return;
      const modules = await loadModules();
      const sessionId = sessionIdOf(ctx, modules.nudge);
      if (!sessionId || event.message?.role !== 'assistant') return;

      const windowTokens = contextWindow(ctx);
      if (windowTokens === null) return;

      const fillTokens = modules.contextUsage.fillFromPiUsage(event.message.usage);
      const ratio = modules.contextUsage.fillRatio(fillTokens, windowTokens);
      const decision = modules.nudge.nudgeDecision({
        ratio,
        threshold: modules.nudge.relaunchThreshold(config),
        sessionId,
        env: process.env,
      });
      if (!decision.nudge) return;

      const text = modules.nudge.handoffText({
        notePath: modules.nudge.plannedNotePath({ cwd: ctx.cwd, sessionId }),
        sessionId,
        specFolder: modules.nudge.specFolderInput({ env: process.env }),
        runtime: 'pi',
        cliPath: modules.nudge.CLI_COMMAND,
        cwd: ctx.cwd,
        ratio,
      });
      // The message that crosses the threshold usually carries the prepare call
      // itself, so the record it creates does not exist yet. Deciding here would
      // nudge a session that is already handing off, so the text is held for the
      // stop event, which re-checks the record before delivering it.
      heldNudges.set(sessionId, text);
      modules.nudge.writeState(sessionId, decision.level, process.env);
    } catch {
      return undefined;
    }
  });

  pi.on('before_agent_start', async (event, ctx) => {
    try {
      const config = loadConfigFile(configPath());
      if (!isEnabled(config) || !('prompt' in event)) return;
      const modules = await loadModules();
      const sessionId = sessionIdOf(ctx, modules.nudge);
      if (!sessionId || !modules.nudge.isSeedPrompt(event.prompt)) return;

      const text = modules.nudge.seedInstructions({ prompt: event.prompt, sessionId });
      if (text === null) return;
      return { systemPrompt: `${event.systemPrompt}\n\n${text}` };
    } catch {
      return undefined;
    }
  });

  pi.on('agent_end', async (_event, ctx) => {
    try {
      const config = loadConfigFile(configPath());
      if (!isEnabled(config)) return;
      const modules = await loadModules();
      const sessionId = sessionIdOf(ctx, modules.nudge);
      if (!sessionId) return;

      await armRelaunch(modules, ctx, sessionId);

      const held = heldNudges.get(sessionId);
      if (held === undefined) return;
      heldNudges.delete(sessionId);
      // A record for this session already covers the handoff the nudge asks
      // for, so a pending or still-armed one retires the held text unread.
      if (modules.nudge.handoffPending({ sessionId })) return;
      // The hop count can reach the cap between holding the text and this stop,
      // and a prompt that cannot relaunch must not reach the model.
      if (modules.nudge.hopLimitReached()) return;

      pi.sendMessage(
        { customType: CONCERN, content: held, display: false },
        // The nudge must reach the model without an operator turn: queue it on a
        // streaming loop, start a turn on an idle one.
        { deliverAs: 'followUp', triggerTurn: true },
      );
    } catch {
      return undefined;
    }
  });

  // Pi writes an assistant message only once its turn completes, so a turn the operator starts
  // just after the arm leaves the transcript silent for longer than the killer waits, and the
  // killer reads that silence as a dead session and signals it mid-turn. A turn that has started
  // is proof enough that the session is alive, so its arm is withdrawn before it can fire.
  (pi as unknown as AgentStartRegistrar).on('agent_start', async (_event, ctx) => {
    try {
      const config = loadConfigFile(configPath());
      if (!isEnabled(config)) return;
      const modules = await loadModules();
      const sessionId = sessionIdOf(ctx, modules.nudge);
      if (!sessionId) return;

      const loopId = process.env.SKILLED_LOOP_ID;
      if (!loopId) return;

      // The withdrawal reads, judges and disarms under one lock, so a stop that re-armed the
      // record is never undone on the strength of an older read. It also grants the session one
      // more nudge and lists the note as still with its session, as a cancel does.
      const withdrawn = modules.withdraw.withdrawHandOver({
        loopId,
        sessionId,
        reason: 'user-message',
        pending: 'none',
        env: process.env,
      });
      if (withdrawn === null) return;
      logArmCancelled(modules.core, loopId, sessionId);
    } catch {
      return undefined;
    }
  });

  (pi as unknown as CompactionRegistrar).on('session_compact', async (_event, ctx) => {
    try {
      const config = loadConfigFile(configPath());
      if (!isEnabled(config)) return;
      const modules = await loadModules();
      const sessionId = sessionIdOf(ctx, modules.nudge);
      if (!sessionId) return;

      // Compaction keeps the session id but drops the detail its open note holds, and the
      // context it frees makes the spent nudge level stale, so the level starts over. A
      // held nudge goes with it, since it quotes the fill the compaction freed.
      try {
        modules.nudge.writeState(sessionId, 0, process.env);
      } catch {}

      heldNudges.delete(sessionId);

      // A prepared hop already owns the note, and claiming it here would leave the fresh
      // session nothing to claim.
      if (modules.nudge.handoffPending({ sessionId })) return;

      const notePath = modules.nudge.openNotePathFor({
        repoRoot: modules.nudge.resolveRepoRoot(process.env),
        sessionId,
      });
      if (notePath === null) return;

      // The operator carried on after the hand-over was withdrawn, so the work since is not in
      // the note, and pointing the session at a claim would resume work that is already done.
      if (modules.nudge.handoffWithdrawn({ sessionId, notePath, env: process.env })) {
        logPointer(modules.core, sessionId, notePath, 'compact-pointer-stale-note');
        pi.sendMessage({
          customType: CONCERN,
          content: modules.nudge.staleNoteText({ notePath }),
          display: false,
        });
        return;
      }

      logPointer(modules.core, sessionId, notePath);
      const specFolder = await noteSpecFolder(modules.core, notePath);
      // The pointer rides the turn the compaction already queued, so it asks for no extra one.
      pi.sendMessage({
        customType: CONCERN,
        content: modules.nudge.seedText({
          notePath,
          specFolder,
          sessionId,
          cliPath: modules.nudge.CLI_COMMAND,
          afterCompaction: true,
        }),
        display: false,
      });
    } catch {
      return undefined;
    }
  });
}
