#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin UserPromptSubmit Hook Adapter
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.
//
// Devin drops PostCompaction stdout but injects UserPromptSubmit context, so the
// history lookup offer minted at compaction is delivered here on the next turn.

import { readFileSync, unlinkSync } from 'node:fs';

import { getStatePath, loadState } from '../claude/hook-state.js';
import { buildHistoryLookupSection, placeLookup } from '../lib/history/lookup-offer.js';
import {
  emitDevinContext,
  readDevinHookInput,
  runClaudeHookAdapter,
  runDevinHook,
  type DevinHookInput,
} from './shared.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const ADVISOR_ADAPTER = 'user-prompt-submit.js';
const ADVISOR_TIMEOUT_MS = 2_800;
// The marker sits beside the session's state entry, keyed the same way, because
// the hook-state schema stores only its own fields and drops an unknown one.
const PENDING_OFFER_SUFFIX = '.history-offer';
// The CLI refuses a locator past this age, so an older offer could not be redeemed.
const LOCATOR_TTL_MS = 30 * 60 * 1000;

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface HistoryOfferMarker {
  readonly handle: string;
  readonly mintedAt: string;
}

/** Test seams; production callers take the defaults. */
interface UserPromptSubmitDeps {
  readonly runAdvisor?: (input: DevinHookInput) => string | null;
  readonly isHistoryReady?: () => Promise<boolean>;
}

// ───────────────────────────────────────────────────────────────────
// 3. ADVISOR CONTEXT
// ───────────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The one field this adapter forwards from the advisor's hook response. */
function readAdvisorContext(rawOutput: string | null): string | null {
  if (!rawOutput) return null;
  try {
    const parsed: unknown = JSON.parse(rawOutput);
    if (!isRecord(parsed) || !isRecord(parsed.hookSpecificOutput)) return null;
    const context = parsed.hookSpecificOutput.additionalContext;
    return typeof context === 'string' && context.trim() ? context : null;
  } catch {
    // Invalid child output is a silent fail-open path.
    return null;
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. ONE-SHOT HISTORY OFFER
// ───────────────────────────────────────────────────────────────────

function pendingOfferPath(sessionId: string): string {
  return `${getStatePath(sessionId)}${PENDING_OFFER_SUFFIX}`;
}

function readPendingOffer(sessionId: string): HistoryOfferMarker | null {
  try {
    const parsed: unknown = JSON.parse(readFileSync(pendingOfferPath(sessionId), 'utf8'));
    if (!isRecord(parsed)) return null;
    if (typeof parsed.handle !== 'string' || typeof parsed.mintedAt !== 'string') return null;
    return { handle: parsed.handle, mintedAt: parsed.mintedAt };
  } catch {
    return null;
  }
}

function clearPendingOffer(sessionId: string): void {
  try {
    unlinkSync(pendingOfferPath(sessionId));
  } catch {
    // Already consumed or never written.
  }
}

function locatorIsFresh(mintedAt: string): boolean {
  const mintedAtMs = Date.parse(mintedAt);
  if (!Number.isFinite(mintedAtMs)) return false;
  const ageMs = Date.now() - mintedAtMs;
  // A future timestamp is clock drift, not a fresh locator.
  return ageMs >= 0 && ageMs < LOCATOR_TTL_MS;
}

type HistoryCapabilityTable = Record<string, { status?: string } | undefined>;

/**
 * Read the reader capability declaration, never a hardcoded guess.
 *
 * The hook runs from source under Vitest and from `dist` in production, so the
 * module URL is tried at both depths and an unreadable table stays gated off.
 */
async function loadHistoryCapability(): Promise<boolean> {
  const candidates = [
    new URL('../../../../../hooks/shared/session-readers/index.mjs', import.meta.url),
    new URL('../../../../../../hooks/shared/session-readers/index.mjs', import.meta.url),
  ];
  for (const candidate of candidates) {
    try {
      const readers = await import(candidate.href) as { capabilities?: HistoryCapabilityTable };
      return readers.capabilities?.devin?.status === 'ready';
    } catch {
      continue;
    }
  }
  return false;
}

/**
 * Consume the compaction marker and return the offer it authorized, once.
 *
 * The marker is cleared as soon as it has been evaluated: the locator keeps its
 * own 30-minute lifetime for the CLI, and a retained marker would retry an offer
 * that cannot be redeemed on this turn. Any failure withholds the offer without
 * disturbing the prompt.
 */
async function takeHistoryLookupSection(
  sessionId: string,
  projectDir: string,
  isHistoryReady: () => Promise<boolean>,
): Promise<string | null> {
  try {
    // The compaction hook saved the locator and marker under the checkout root
    // above the session folder, so they are read back from that root.
    const placement = placeLookup(projectDir);
    if (!placement) return null;
    const locator = inDirectory(placement.workspace, () => {
      const marker = readPendingOffer(sessionId);
      if (!marker) return null;
      const state = loadState(sessionId);
      const stored = state.ok ? state.state.historyLocator : null;
      clearPendingOffer(sessionId);
      if (!stored || stored.handle !== marker.handle || !locatorIsFresh(stored.mintedAt)) return null;
      return stored;
    });
    if (!locator) return null;
    return buildHistoryLookupSection(locator, await isHistoryReady());
  } catch {
    return null;
  }
}

/** Run a synchronous state read with the process folder set to `directory`. */
function inDirectory<T>(directory: string, read: () => T): T | null {
  const previous = process.cwd();
  try {
    process.chdir(directory);
  } catch {
    return null;
  }
  try {
    return read();
  } finally {
    try {
      process.chdir(previous);
    } catch {
      // The former folder disappeared; the hook still completes fail-open.
    }
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. OUTPUT COMPOSITION
// ───────────────────────────────────────────────────────────────────

/** Advisor context first, then the offer, so the prompt keeps its usual preface. */
export async function composeUserPromptContext(
  input: DevinHookInput,
  deps: UserPromptSubmitDeps = {},
): Promise<string | null> {
  const runAdvisor = deps.runAdvisor
    ?? ((value: DevinHookInput) => runClaudeHookAdapter(ADVISOR_ADAPTER, value, ADVISOR_TIMEOUT_MS));
  const isHistoryReady = deps.isHistoryReady ?? loadHistoryCapability;

  const advisorContext = readAdvisorContext(runAdvisor(input));
  const sessionId = typeof input.session_id === 'string' ? input.session_id.trim() : '';
  const workspaceCwd = typeof input.cwd === 'string' && input.cwd.trim() ? input.cwd : null;
  const projectDir = workspaceCwd ?? (process.env.DEVIN_PROJECT_DIR || process.cwd());
  const section = sessionId ? await takeHistoryLookupSection(sessionId, projectDir, isHistoryReady) : null;

  if (!section) return advisorContext;
  return advisorContext ? `${advisorContext}\n\n${section}` : section;
}

// ───────────────────────────────────────────────────────────────────
// 6. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const input = await readDevinHookInput('UserPromptSubmit', ['prompt']);
  if (!input) return;

  emitDevinContext('UserPromptSubmit', await composeUserPromptContext(input));
}

runDevinHook(import.meta.url, main);
