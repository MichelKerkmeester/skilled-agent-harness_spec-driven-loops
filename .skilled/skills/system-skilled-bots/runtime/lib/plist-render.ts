// ───────────────────────────────────────────────────────────────────
// MODULE: Agent Property-List Renderer
// ───────────────────────────────────────────────────────────────────
//
// launchd starts a job with a bare PATH, no shell and no home expansion, so
// a job file that leans on `node` being on PATH or on `~` fails at its first
// unattended fire. Every path in a rendered job is absolute and was resolved
// at install time, the interpreter included. The job carries the state home
// the installer resolved its state root from, whenever the repository config
// names no state root. Without it a fired job would fall back to the state
// root under the account's home, which need not be the folder holding its
// install record and its queue. Every job also pins the state root and the
// identity the install resolved, so a fire never takes either from the
// checkout's bots/config.json, which a run could edit. A bot schedule's job
// also carries a marker that tells the CLI a run came from the installed
// schedule, never from a hand-typed command, because only a real fire may
// account a schedule slot.
// The runner applies its own allowlist to everything else. The renderer only
// builds text. It reads and writes nothing, so the module that installs a job
// stays the one place that touches the scheduler.

import { isAbsolute } from 'node:path';

import { PINNED_OPERATOR_ENV } from './actor.js';
import { PINNED_IDENTITY_ENV } from './identity.js';
import { PINNED_STATE_ROOT_ENV } from './state-root.js';

import type { CalendarEntry, Translation } from './cron-translator.js';
import type { Result } from './repo-config.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Set in a bot schedule's job alone: the CLI accepts `--schedule-index` only under it. */
export const SCHEDULED_FIRE_ENV = 'SKILLED_BOTS_SCHEDULED_FIRE';

/** The marker a bot's job file carries when the operator installed it with full access. */
export const FULL_ACCESS_ENV = 'SKILLED_BOTS_FULL_ACCESS';

/** The calendar keys a job may carry, in the order they are written. */
const CALENDAR_KEYS = ['Month', 'Day', 'Weekday', 'Hour', 'Minute'] as const;

/** The state root and identity a job resolves on every fire, whatever the checkout's config says. */
export interface PinnedJobValues {
  /** Absolute. */
  stateRoot: string;
  identity: string;
  /** The installing operator, pinned so a scheduled run records that name rather than the launchd user. Absent or null when none resolved. */
  operator?: string | null;
  /** True only for a bot installed with full access. */
  fullAccess?: boolean;
}

export interface BotPlistInput {
  label: string;
  /** Absolute interpreter, resolved at install time. */
  interpreter: string;
  /** Absolute real path of the bots CLI. */
  runnerPath: string;
  botId: string;
  scheduleIndex: number;
  /** Absolute checkout that holds `bots/`. */
  checkoutRoot: string;
  /** Absolute Skilled tree whose run root takes the run folders. */
  skilledTree: string;
  translation: Translation;
  /** Absolute file the job's own stdout and stderr go to. */
  logPath: string;
  /** Absolute XDG state home to carry into the job; null or absent carries none. */
  stateHome?: string | null;
  /** The values the install resolved; null or absent pins nothing. */
  pinned?: PinnedJobValues | null;
}

export interface DrainPlistInput {
  label: string;
  interpreter: string;
  runnerPath: string;
  checkoutRoot: string;
  skilledTree: string;
  /** Absolute watched folder; only this folder wakes the job. */
  inboxPath: string;
  logPath: string;
  /** Least seconds between two starts of the job. */
  throttleSeconds: number;
  stateHome?: string | null;
  pinned?: PinnedJobValues | null;
}

/** A value a rendered job can hold. */
type PlistValue = string | number | boolean | PlistValue[] | { [key: string]: PlistValue };

// ───────────────────────────────────────────────────────────────────
// 2. PROGRAM ARGUMENTS
// ───────────────────────────────────────────────────────────────────

/**
 * The argument vector of a schedule fire. The checkout and the Skilled tree
 * are always passed, never left to the CLI's own defaults: a CLI started from
 * a linked worktree would otherwise pick that worktree as the run root, which
 * the run-folder rule refuses.
 */
export function botProgramArguments(input: Pick<BotPlistInput, 'interpreter' | 'runnerPath' | 'botId' | 'scheduleIndex' | 'checkoutRoot' | 'skilledTree'>): string[] {
  return [
    input.interpreter,
    input.runnerPath,
    'run',
    input.botId,
    '--schedule-index',
    String(input.scheduleIndex),
    '--repo',
    input.checkoutRoot,
    '--skilled-tree',
    input.skilledTree,
  ];
}

/** The argument vector of the queue-drain job; `--scheduled` turns on its back-off. */
export function drainProgramArguments(input: Pick<DrainPlistInput, 'interpreter' | 'runnerPath' | 'checkoutRoot' | 'skilledTree'>): string[] {
  return [
    input.interpreter,
    input.runnerPath,
    'drain',
    '--scheduled',
    '--repo',
    input.checkoutRoot,
    '--skilled-tree',
    input.skilledTree,
  ];
}

// ───────────────────────────────────────────────────────────────────
// 3. XML
// ───────────────────────────────────────────────────────────────────

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderValue(value: PlistValue, indent: string): string {
  if (typeof value === 'string') return `${indent}<string>${escapeXml(value)}</string>`;
  if (typeof value === 'number') return `${indent}<integer>${String(value)}</integer>`;
  if (typeof value === 'boolean') return `${indent}<${value ? 'true' : 'false'}/>`;
  if (Array.isArray(value)) {
    return [`${indent}<array>`, ...value.map((item) => renderValue(item, `${indent}\t`)), `${indent}</array>`].join('\n');
  }
  const lines = [`${indent}<dict>`];
  for (const [key, item] of Object.entries(value)) {
    lines.push(`${indent}\t<key>${escapeXml(key)}</key>`, renderValue(item, `${indent}\t`));
  }
  lines.push(`${indent}</dict>`);
  return lines.join('\n');
}

function renderDocument(top: Record<string, PlistValue>): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    renderValue(top, ''),
    '</plist>',
    '',
  ].join('\n');
}

/** A shell expansion launchd would pass through as literal text: `$NAME` or `${...}`. */
const SHELL_EXPANSION = /\$(?:\{|[A-Za-z_])/;

/**
 * Refuse any path launchd would not resolve: relative, a leading home
 * expansion, or a shell variable. A `~` inside a name is an ordinary
 * character, as in the iCloud Drive folder `com~apple~CloudDocs`.
 */
function checkPaths(paths: Record<string, string>): Result<null> {
  for (const [name, path] of Object.entries(paths)) {
    if (!isAbsolute(path) || path.startsWith('~') || SHELL_EXPANSION.test(path)) {
      return { ok: false, reason: 'path-not-absolute', detail: name };
    }
  }
  return { ok: true, value: null };
}

/**
 * The job's environment: the state home and the pinned state root, identity
 * and operator when the installer set them, the full-access marker on a bot
 * job that was granted it, and a schedule's fire marker.
 */
function environmentValue(stateHome: string | null | undefined, pinned: PinnedJobValues | null | undefined, scheduledFire: boolean): Record<string, PlistValue> | null {
  const environment: Record<string, PlistValue> = {};
  if (stateHome !== null && stateHome !== undefined) environment.XDG_STATE_HOME = stateHome;
  if (pinned !== null && pinned !== undefined) {
    environment[PINNED_STATE_ROOT_ENV] = pinned.stateRoot;
    environment[PINNED_IDENTITY_ENV] = pinned.identity;
    if (typeof pinned.operator === 'string') environment[PINNED_OPERATOR_ENV] = pinned.operator;
    if (scheduledFire && pinned.fullAccess === true) environment[FULL_ACCESS_ENV] = '1';
  }
  if (scheduledFire) environment[SCHEDULED_FIRE_ENV] = '1';
  return Object.keys(environment).length === 0 ? null : environment;
}

/** The paths every job checks, plus the state home and the pinned state root when it carries them. */
function withStateHome(paths: Record<string, string>, stateHome: string | null | undefined, pinned?: PinnedJobValues | null): Record<string, string> {
  return {
    ...paths,
    ...(stateHome === null || stateHome === undefined ? {} : { stateHome }),
    ...(pinned === null || pinned === undefined ? {} : { pinnedStateRoot: pinned.stateRoot }),
  };
}

function calendarValue(entries: CalendarEntry[]): PlistValue {
  return entries.map((entry) => {
    const dict: Record<string, PlistValue> = {};
    for (const key of CALENDAR_KEYS) {
      const value = entry[key];
      if (value !== undefined) dict[key] = value;
    }
    return dict;
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. RENDER
// ───────────────────────────────────────────────────────────────────

/**
 * Render the job of one bot schedule.
 *
 * @returns The property-list text, or `path-not-absolute` naming the field.
 */
export function renderBotPlist(input: BotPlistInput): Result<string> {
  const checked = checkPaths(
    withStateHome(
      {
        interpreter: input.interpreter,
        runnerPath: input.runnerPath,
        checkoutRoot: input.checkoutRoot,
        skilledTree: input.skilledTree,
        logPath: input.logPath,
      },
      input.stateHome,
      input.pinned,
    ),
  );
  if (!checked.ok) return checked;
  const top: Record<string, PlistValue> = {
    Label: input.label,
    ProgramArguments: botProgramArguments(input),
    WorkingDirectory: input.checkoutRoot,
    RunAtLoad: false,
  };
  const environment = environmentValue(input.stateHome, input.pinned, true);
  if (environment !== null) top.EnvironmentVariables = environment;
  if (input.translation.kind === 'interval') top.StartInterval = input.translation.startInterval;
  else top.StartCalendarInterval = calendarValue(input.translation.entries);
  top.StandardOutPath = input.logPath;
  top.StandardErrorPath = input.logPath;
  return { ok: true, value: renderDocument(top) };
}

/**
 * Render the queue-drain job of one repository identity. It watches only the
 * inbox folder; the queue's other folders are its siblings, so a claimed or
 * quarantined request never wakes it.
 *
 * @returns The property-list text, or `path-not-absolute` or `throttle-invalid`.
 */
export function renderDrainPlist(input: DrainPlistInput): Result<string> {
  const checked = checkPaths(
    withStateHome(
      {
        interpreter: input.interpreter,
        runnerPath: input.runnerPath,
        checkoutRoot: input.checkoutRoot,
        skilledTree: input.skilledTree,
        inboxPath: input.inboxPath,
        logPath: input.logPath,
      },
      input.stateHome,
      input.pinned,
    ),
  );
  if (!checked.ok) return checked;
  if (!Number.isSafeInteger(input.throttleSeconds) || input.throttleSeconds < 1) return { ok: false, reason: 'throttle-invalid' };
  const top: Record<string, PlistValue> = {
    Label: input.label,
    ProgramArguments: drainProgramArguments(input),
    WorkingDirectory: input.checkoutRoot,
    RunAtLoad: false,
  };
  const environment = environmentValue(input.stateHome, input.pinned, false);
  if (environment !== null) top.EnvironmentVariables = environment;
  top.QueueDirectories = [input.inboxPath];
  top.ThrottleInterval = input.throttleSeconds;
  top.StandardOutPath = input.logPath;
  top.StandardErrorPath = input.logPath;
  return { ok: true, value: renderDocument(top) };
}

/**
 * The state root, identity, operator and full-access grant a job file pins,
 * read from its JSON form. Null unless it carries both the state root and the
 * identity. The operator and the grant are added only when the job carries
 * them, so a job file written before either existed reads back unchanged.
 */
export function pinnedFromPlist(parsed: Record<string, unknown>): PinnedJobValues | null {
  const environment = parsed.EnvironmentVariables;
  if (environment === null || typeof environment !== 'object') return null;
  const values = environment as Record<string, unknown>;
  const stateRoot = values[PINNED_STATE_ROOT_ENV];
  const identity = values[PINNED_IDENTITY_ENV];
  if (typeof stateRoot !== 'string' || typeof identity !== 'string') return null;
  const pinned: PinnedJobValues = { stateRoot, identity };
  const operator = values[PINNED_OPERATOR_ENV];
  if (typeof operator === 'string') pinned.operator = operator;
  if (values[FULL_ACCESS_ENV] === '1') pinned.fullAccess = true;
  return pinned;
}

/** The XDG state home a job file carries, read from its JSON form; null when it carries none. */
export function stateHomeFromPlist(parsed: Record<string, unknown>): string | null {
  const environment = parsed.EnvironmentVariables;
  if (environment === null || typeof environment !== 'object') return null;
  const value = (environment as Record<string, unknown>).XDG_STATE_HOME;
  return typeof value === 'string' ? value : null;
}

// ───────────────────────────────────────────────────────────────────
// 5. READ-BACK
// ───────────────────────────────────────────────────────────────────

/**
 * The schedule a job file holds, read from its JSON form, in the
 * translator's shape so the two compare directly.
 *
 * @returns The translation, or null when the job holds neither schedule key.
 */
export function scheduleFromPlist(parsed: Record<string, unknown>): Translation | null {
  if (typeof parsed.StartInterval === 'number') return { kind: 'interval', startInterval: parsed.StartInterval };
  const raw = parsed.StartCalendarInterval;
  const list = Array.isArray(raw) ? raw : raw !== null && typeof raw === 'object' ? [raw] : null;
  if (list === null) return null;
  const entries: CalendarEntry[] = [];
  for (const item of list) {
    if (item === null || typeof item !== 'object') return null;
    const entry: CalendarEntry = {};
    for (const key of CALENDAR_KEYS) {
      const value = (item as Record<string, unknown>)[key];
      if (typeof value === 'number') entry[key] = value;
    }
    entries.push(entry);
  }
  return { kind: 'calendar', entries };
}

/** Whether two schedules fire on the same keys, entry for entry. */
export function sameSchedule(left: Translation, right: Translation): boolean {
  if (left.kind !== right.kind) return false;
  if (left.kind === 'interval' && right.kind === 'interval') return left.startInterval === right.startInterval;
  if (left.kind !== 'calendar' || right.kind !== 'calendar' || left.entries.length !== right.entries.length) return false;
  return left.entries.every((entry, index) => CALENDAR_KEYS.every((key) => entry[key] === right.entries[index]?.[key]));
}
