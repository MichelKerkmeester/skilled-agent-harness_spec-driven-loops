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

type RelaunchRecord = {
  runtime?: string;
  sessionId?: string;
  status?: string;
};

type CoreModule = {
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
  readRelaunchFile(loopId: string, env: NodeJS.ProcessEnv): RelaunchRecord | null;
  liveKillerPid(loopId: string, env: NodeJS.ProcessEnv): number | null;
};

type ContextUsageModule = {
  fillFromPiUsage(usage: unknown): number;
  fillRatio(fillTokens: number, windowTokens: number): number;
};

type NudgeDecision = { level: number; nudge: boolean };

type NudgeModule = {
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
  specFolderFromSeed(text: unknown): string;
  notePathFromSeed(prompt: unknown): string | null;
  resolveRepoRoot(env?: NodeJS.ProcessEnv): string;
  plannedNotePath(options: {
    cwd: string;
    sessionId: string;
    env?: NodeJS.ProcessEnv;
    now?: Date;
  }): string;
  handoffPending(options: {
    sessionId: string;
    env?: NodeJS.ProcessEnv;
  }): boolean;
  hopLimitReached(env?: NodeJS.ProcessEnv): boolean;
  relaunchThreshold(
    config?: Record<string, string>,
    env?: NodeJS.ProcessEnv,
  ): number;
  nextLevel(options: {
    ratio: number;
    threshold: number;
    state: number;
  }): NudgeDecision;
  readState(sessionId: string, env: NodeJS.ProcessEnv): number;
  seedText(options: {
    notePath: string;
    specFolder: string;
    sessionId: string;
    cliPath: string;
  }): string;
  validSessionId(sessionId: unknown): boolean;
  writeState(sessionId: string, level: number, env: NodeJS.ProcessEnv): void;
};

type AdapterModules = {
  core: CoreModule;
  contextUsage: ContextUsageModule;
  nudge: NudgeModule;
};

const CONCERN = 'session-relaunch';
const CLI_COMMAND = 'node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs';
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
async function loadCore(): Promise<CoreModule> {
  try {
    return asModule<CoreModule>(await import('../lib/relaunch-core.cjs' as string));
  } catch {
    return asModule<CoreModule>(
      await import('../../.skilled/hooks/session-relaunch/lib/relaunch-core.cjs'),
    );
  }
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

function loadModules(): Promise<AdapterModules> {
  if (modulesPromise === null) {
    modulesPromise = Promise.all([loadCore(), loadContextUsage(), loadNudge()])
      .then(([core, contextUsage, nudge]) => ({ core, contextUsage, nudge }))
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
// when no live killer owns the lock.
async function armRelaunch(
  modules: AdapterModules,
  ctx: ExtensionContext,
  sessionId: string,
): Promise<void> {
  const loopId = process.env.SKILLED_LOOP_ID;
  if (!loopId) return;

  const record = modules.core.readRelaunchFile(loopId, process.env);
  if (
    record === null
    || record.sessionId !== sessionId
    || record.runtime !== 'pi'
  ) return;
  if (
    record.status !== 'pending'
    && (record.status !== 'armed'
      || modules.core.liveKillerPid(loopId, process.env) !== null)
  ) return;

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
      const threshold = modules.nudge.relaunchThreshold(config);
      if (ratio < threshold) return;

      // A prepared or armed record means this session already ran the handoff steps.
      if (modules.nudge.handoffPending({ sessionId })) return;
      // At the hop cap the wrapper declines the record, so the nudge would ask for a
      // handoff that cannot relaunch.
      if (modules.nudge.hopLimitReached()) return;

      const decision = modules.nudge.nextLevel({
        ratio,
        threshold,
        state: modules.nudge.readState(sessionId, process.env),
      });
      if (!decision.nudge) return;

      const text = modules.nudge.handoffText({
        notePath: modules.nudge.plannedNotePath({ cwd: ctx.cwd, sessionId }),
        sessionId,
        specFolder: process.env.SYSTEM_SPEC_FOLDER || undefined,
        runtime: 'pi',
        cliPath: CLI_COMMAND,
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

      const text = modules.nudge.seedText({
        notePath: modules.nudge.notePathFromSeed(event.prompt) ?? '<handoff-path>',
        specFolder: modules.nudge.specFolderFromSeed(event.prompt),
        sessionId,
        cliPath: CLI_COMMAND,
      });
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
}
