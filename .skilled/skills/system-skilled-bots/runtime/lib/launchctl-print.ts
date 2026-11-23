// ───────────────────────────────────────────────────────────────────
// MODULE: launchctl print Reader
// ───────────────────────────────────────────────────────────────────
//
// A bot that is installed and has never run, or whose last fire died at
// launchd before the runner wrote a record, leaves no run record, so only
// launchd can show it. `launchctl print` is the read-only way to ask, but
// its man page says the output is not API. So this reader takes only three
// top-level fields (state, run count, last exit code), skips every line it
// does not know, and answers `unknown` for a field it cannot read. It never
// guesses a healthy or a failed job from output it does not understand.
//
// It calls launchctl only through the installer's seam, so a test answers
// with a stub and never reaches the real scheduler.

import { defaultSeams } from './installer.js';

import type { InstallerSeams } from './installer.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/** launchctl's exit status for a label the domain does not hold: not loaded. */
export const PRINT_NOT_FOUND_STATUS = 113;

export const UNKNOWN = 'unknown';

/** What launchd reports for one label. */
export interface LaunchdPrint {
  label: string;
  /** `loaded` with fields, `not-loaded` for a label launchd does not hold, `unknown` when the call or the output did not read. */
  presence: 'loaded' | 'not-loaded' | typeof UNKNOWN;
  /** The `state` line, such as `running` or `not running`. */
  state: string;
  runs: number | typeof UNKNOWN;
  /** A number, null for a job that has never exited, or `unknown`. */
  lastExitCode: number | null | typeof UNKNOWN;
}

export interface ParsedPrint {
  state: string;
  runs: number | typeof UNKNOWN;
  lastExitCode: number | null | typeof UNKNOWN;
}

// ───────────────────────────────────────────────────────────────────
// 2. PARSE
// ───────────────────────────────────────────────────────────────────

/**
 * Read state, run count and last exit code from `launchctl print` output.
 * Only lines one level inside the service block count; nested blocks hold
 * their own `state` lines (an endpoint's, a socket's) that must not win.
 */
export function parseLaunchctlPrint(stdout: string): ParsedPrint {
  const parsed: ParsedPrint = { state: UNKNOWN, runs: UNKNOWN, lastExitCode: UNKNOWN };
  const lines = stdout.split('\n');
  if (!/^\S.*=\s*\{\s*$/.test(lines[0] ?? '')) return parsed;
  let depth = 0;
  const seen = new Set<string>();
  for (const line of lines.slice(1)) {
    const trimmed = line.trim();
    if (trimmed === '}') {
      depth -= 1;
      if (depth < 0) break;
      continue;
    }
    if (trimmed.endsWith('{')) {
      depth += 1;
      continue;
    }
    if (depth !== 0) continue;
    const match = /^([a-z][a-z ]*?)\s*=\s*(.*)$/.exec(trimmed);
    if (match === null) continue;
    const [, key = '', value = ''] = match;
    // A field printed twice is ambiguous, so it reads as unknown rather than as whichever came last.
    if (seen.has(key)) {
      if (key === 'state') parsed.state = UNKNOWN;
      if (key === 'runs') parsed.runs = UNKNOWN;
      if (key === 'last exit code') parsed.lastExitCode = UNKNOWN;
      continue;
    }
    seen.add(key);
    if (key === 'state') parsed.state = value === '' ? UNKNOWN : value;
    if (key === 'runs') parsed.runs = /^\d+$/.test(value) ? Number(value) : UNKNOWN;
    if (key === 'last exit code') {
      if (value === '(never exited)') parsed.lastExitCode = null;
      else if (/^-?\d+(?::.*)?$/.test(value)) parsed.lastExitCode = Number.parseInt(value, 10);
      else parsed.lastExitCode = UNKNOWN;
    }
  }
  return parsed;
}

// ───────────────────────────────────────────────────────────────────
// 3. READ ONE LABEL
// ───────────────────────────────────────────────────────────────────

/**
 * Ask launchd about one label in the user's domain. It runs `print` and
 * nothing else.
 *
 * @param seams - The installer's launchctl seam and domain; the real host when omitted.
 */
export function printLabel(label: string, seams?: Partial<Pick<InstallerSeams, 'launchctl' | 'domain'>>): LaunchdPrint {
  const resolved = pickSeams(seams);
  const result = resolved.launchctl(['print', `${resolved.domain}/${label}`]);
  if (result.status === PRINT_NOT_FOUND_STATUS) {
    return { label, presence: 'not-loaded', state: 'not loaded', runs: 0, lastExitCode: null };
  }
  if (result.status !== 0) return { label, presence: UNKNOWN, state: UNKNOWN, runs: UNKNOWN, lastExitCode: UNKNOWN };
  const parsed = parseLaunchctlPrint(result.stdout);
  const readable = parsed.state !== UNKNOWN || parsed.runs !== UNKNOWN || parsed.lastExitCode !== UNKNOWN;
  return { label, presence: readable ? 'loaded' : UNKNOWN, ...parsed };
}

function pickSeams(seams?: Partial<Pick<InstallerSeams, 'launchctl' | 'domain'>>): Pick<InstallerSeams, 'launchctl' | 'domain'> {
  if (seams?.launchctl !== undefined && seams.domain !== undefined) return { launchctl: seams.launchctl, domain: seams.domain };
  const real = defaultSeams();
  return { launchctl: seams?.launchctl ?? real.launchctl, domain: seams?.domain ?? real.domain };
}
