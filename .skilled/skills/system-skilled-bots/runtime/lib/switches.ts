// ───────────────────────────────────────────────────────────────────
// MODULE: Stop Switches (disable and pause)
// ───────────────────────────────────────────────────────────────────
//
// The run and invocation stop layers are plain files under the user-level
// state root, one per bot and kind. They live outside every checkout so a
// bot run, which may write its checkout, can never clear its own stop.
// Disable keeps a bot from running at all and is read before the lease;
// pause is read after the lease, so a paused run still shows who asked.

import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import { writeStateAtomic } from '../../../system-deep-loop/runtime/lib/deep-loop/atomic-state.js';
import { ensureIdentityState, identityStatePaths, isSafeSegment } from './state-root.js';

import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

export type SwitchKind = 'disabled' | 'paused';

export const SWITCH_KINDS: readonly SwitchKind[] = ['disabled', 'paused'];

/** What a switch file holds: when it was set, so a reader can report it. */
export interface SwitchState {
  setAt: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. PATHS
// ───────────────────────────────────────────────────────────────────

/**
 * The switch file of one bot. Throws `bot-id-invalid` on an unsafe id, the
 * same rule every other state path applies.
 */
export function switchFile(stateRoot: string, identity: string, botId: string, kind: SwitchKind): string {
  if (!isSafeSegment(botId)) throw new Error('bot-id-invalid');
  return join(identityStatePaths(stateRoot, identity).switches, `${botId}.${kind}.json`);
}

// ───────────────────────────────────────────────────────────────────
// 3. READ & WRITE
// ───────────────────────────────────────────────────────────────────

/**
 * Set a switch by temp file and rename. Setting a switch that is already set
 * keeps the first time it was set.
 *
 * @returns The switch file path, or `bot-id-invalid`.
 */
export function setSwitch(stateRoot: string, identity: string, botId: string, kind: SwitchKind, now: Date = new Date()): Result<string> {
  if (!isSafeSegment(botId)) return { ok: false, reason: 'bot-id-invalid' };
  ensureIdentityState(stateRoot, identity);
  const path = switchFile(stateRoot, identity, botId, kind);
  if (!existsSync(path)) writeStateAtomic(path, { setAt: now.toISOString() } satisfies SwitchState);
  return { ok: true, value: path };
}

/**
 * Clear a switch. Clearing a switch that is not set is not an error.
 *
 * @returns Whether a switch file was removed, or `bot-id-invalid`.
 */
export function clearSwitch(stateRoot: string, identity: string, botId: string, kind: SwitchKind): Result<boolean> {
  if (!isSafeSegment(botId)) return { ok: false, reason: 'bot-id-invalid' };
  const path = switchFile(stateRoot, identity, botId, kind);
  const existed = existsSync(path);
  rmSync(path, { force: true });
  return { ok: true, value: existed };
}

/**
 * Read a switch. A switch file that exists but does not parse still counts as
 * set: a damaged stop must stop, never read as off.
 *
 * @returns The switch state when set, else null.
 */
export function readSwitch(stateRoot: string, identity: string, botId: string, kind: SwitchKind): SwitchState | null {
  const path = switchFile(stateRoot, identity, botId, kind);
  if (!existsSync(path)) return null;
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as Partial<SwitchState>;
    return { setAt: typeof parsed.setAt === 'string' ? parsed.setAt : 'unknown' };
  } catch {
    return { setAt: 'unknown' };
  }
}
