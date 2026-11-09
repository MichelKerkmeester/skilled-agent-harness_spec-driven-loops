// ───────────────────────────────────────────────────────────────
// MODULE: Doctor Helper Hand-off
// ───────────────────────────────────────────────────────────────

// A doctor bridge passes only on its own declared wording, so a doctor problem
// described in other words reaches no doctor command at all. /doctor:helper
// already ranks free-text problems against every doctor route by word overlap.
// When no doctor bridge passes, this module asks that same ranker whether the
// prompt describes a doctor problem, and if it does the advisor offers
// /doctor:helper, which then names the command.
//
// Two durable design choices:
//   1. The ranker is the helper's own script, loaded from the workspace at run
//      time, so the advisor and /doctor:helper can never disagree about what
//      counts as a doctor problem. Any failure to load or rank is a no-match.
//   2. Word overlap alone also fires on ordinary requests that share doctor
//      vocabulary ("start a deep review loop"), so a weak match also needs the
//      prompt to name a problem. Beside a passing skill only a strong cue
//      counts, because bare words such as "missing" or "broken" are common in
//      ordinary work. With no skill passing, a strong ranker match stands in
//      for the cue.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const HELPER_SCRIPT = join('.skilled', 'commands', 'doctor', 'scripts', 'doctor-helper-match.cjs');
const ROUTE_MANIFEST = join('.skilled', 'commands', 'doctor', '_routes.yaml');

/** The bridge id the hand-off surfaces. */
export const DOCTOR_HELPER_BRIDGE_ID = 'command-doctor-helper';

/** Lowest helper rank score that counts as a doctor problem. */
export const DOCTOR_HELPER_MIN_SCORE = 6;

/** Helper rank score that stands in for a cue when no skill passes. */
export const DOCTOR_HELPER_UNCUED_MIN_SCORE = 10;

// A strong cue says a state is wrong or asks for a health or switch change, so
// it can surface the helper beside a passing skill. A weak cue is a bare word
// that ordinary work requests also use ("fix the broken example"), so it counts
// only when no skill passes. Every hand-off needs at least one cue.
const STRONG_PROBLEM_CUE = new RegExp([
  "\\b(?:not|isn'?t|aren'?t|doesn'?t|don'?t|won'?t|can'?t) (?:\\w+ )?(?:work|working|registered|found|load|loading|run|running|active|linked|fir(?:e|es|ing)|trigger(?:s|ing)?|converg\\w*)\\b",
  '\\bnever (?:converg\\w*|finish\\w*|stops?|works?|loads?|runs?)\\b',
  '\\breturns? nothing\\b',
  '\\b(?:healthy|health|diagnos\\w*)\\b',
  '\\bturn(?:ed)? (?:on|off)\\b',
  '\\bswitch(?:ed)? (?:on|off)\\b',
].join('|'), 'i');

const WEAK_PROBLEM_CUE = new RegExp([
  '\\b(?:broken|breaks?|failing|fails?|failed|wrong|stale|missing|stuck|errors?|drift(?:ed|s|ing)?)\\b',
  '\\bout of (?:date|sync)\\b',
].join('|'), 'i');

// ───────────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────────

interface HelperCandidate {
  readonly command: string;
  readonly score: number;
}

interface HelperModule {
  readonly loadEntries: (root: string) => { readonly entries: readonly unknown[] };
  readonly rankProblem: (
    entries: readonly unknown[],
    text: string,
    options: { readonly top: number },
  ) => { readonly candidates?: readonly HelperCandidate[] };
}

interface LoadedHelper {
  readonly manifestMtimeMs: number;
  readonly module: HelperModule;
  readonly entries: readonly unknown[];
}

/** The doctor command the helper ranked first, with its rank score. */
export interface DoctorProblemMatch {
  readonly command: string;
  readonly score: number;
}

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

const loadedByRoot = new Map<string, LoadedHelper | null>();

function loadHelper(workspaceRoot: string): LoadedHelper | null {
  const scriptPath = join(workspaceRoot, HELPER_SCRIPT);
  const manifestPath = join(workspaceRoot, ROUTE_MANIFEST);
  if (!existsSync(scriptPath) || !existsSync(manifestPath)) return null;
  let manifestMtimeMs: number;
  try {
    manifestMtimeMs = statSync(manifestPath).mtimeMs;
  } catch {
    return null;
  }
  const cached = loadedByRoot.get(workspaceRoot);
  if (cached && cached.manifestMtimeMs === manifestMtimeMs) return cached;
  try {
    const helper = createRequire(import.meta.url)(scriptPath) as HelperModule;
    const loaded: LoadedHelper = {
      manifestMtimeMs,
      module: helper,
      entries: helper.loadEntries(workspaceRoot).entries,
    };
    loadedByRoot.set(workspaceRoot, loaded);
    return loaded;
  } catch {
    loadedByRoot.set(workspaceRoot, null);
    return null;
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** The strongest problem cue the prompt carries. */
export function doctorProblemCue(prompt: string): 'strong' | 'weak' | null {
  if (STRONG_PROBLEM_CUE.test(prompt)) return 'strong';
  if (WEAK_PROBLEM_CUE.test(prompt)) return 'weak';
  return null;
}

/**
 * Ranks the prompt with /doctor:helper's own matcher and returns its first
 * candidate when that candidate reaches the hand-off score, or null.
 */
export function matchDoctorProblem(prompt: string, workspaceRoot: string): DoctorProblemMatch | null {
  const loaded = loadHelper(workspaceRoot);
  if (!loaded) return null;
  try {
    const first = loaded.module.rankProblem(loaded.entries, prompt, { top: 1 }).candidates?.[0];
    if (!first || typeof first.command !== 'string' || typeof first.score !== 'number') return null;
    return first.score >= DOCTOR_HELPER_MIN_SCORE ? { command: first.command, score: first.score } : null;
  } catch {
    return null;
  }
}
