// ───────────────────────────────────────────────────────────────────
// MODULE: Session Compact Context Adapter
// ───────────────────────────────────────────────────────────────────

import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';
import { loadDshLlm } from '../../../../../hooks/shared/dsh/dsh-llm.mjs';
import { runSessionPrime } from './session-start-context.mjs';

export const ERROR_POLICY = 'fail-open';

// The compiled helper is the one digest every adapter and the CLI share; the
// hook-state writer is the only place the CLI reads a locator from. A missing
// build disables the lookup offer rather than breaking compaction.
let locatorSupport = null;
try {
  const [digest, state, offer] = await Promise.all([
    import('../../dist/hooks/lib/history/locator-digest.js'),
    import('../../dist/hooks/claude/hook-state.js'),
    import('../../dist/hooks/lib/history/lookup-offer.js'),
  ]);
  if (typeof digest.historyHandle === 'function'
    && typeof digest.persistHistoryLocator === 'function'
    && typeof state.updateState === 'function'
    && typeof state.ensureStateDir === 'function'
    && typeof offer.buildHistoryLookupSection === 'function'
    && typeof offer.placeLookup === 'function') {
    locatorSupport = {
      historyHandle: digest.historyHandle,
      persistHistoryLocator: digest.persistHistoryLocator,
      updateState: state.updateState,
      ensureStateDir: state.ensureStateDir,
      buildHistoryLookupSection: offer.buildHistoryLookupSection,
      placeLookup: offer.placeLookup,
    };
  }
} catch {
  locatorSupport = null;
}

const HISTORY_LOCATOR_VERSION = 1;
const HISTORY_LOCATOR_KIND = 'session_log';
const HISTORY_LOCATOR_SOURCE = 'post_compaction';

function lifecycleEnabled(isEnabled) {
  try {
    return isEnabled('session-lifecycle') !== false;
  } catch {
    return true;
  }
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards session-compact-context: ${String(error)}`);
  } catch {
    // A logging failure must not interrupt the session feed.
  }
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

async function loadHistoryCapability(runtime) {
  try {
    const readers = await import('../../../../../hooks/shared/session-readers/index.mjs');
    return readers.capabilities?.[runtime]?.status === 'ready';
  } catch {
    return false;
  }
}

/**
 * The locator carries the exact session id and the folder the reader needs; no
 * event field is ever interpreted as a filesystem path. It is keyed by the
 * checkout root above that folder, where the printed command runs.
 */
export function mintHistoryLocator(sessionId, workspace, mintedAt) {
  const normalizedSession = typeof sessionId === 'string' ? sessionId.trim() : '';
  const normalizedWorkspace = typeof workspace === 'string' ? workspace.trim() : '';
  if (!normalizedSession || !normalizedWorkspace) return null;
  if (/[/\\\0]/.test(normalizedSession)) return null;
  if (!locatorSupport) return null;
  const placement = locatorSupport.placeLookup(normalizedWorkspace);
  if (!placement) return null;
  const identity = {
    runtime: 'dsh',
    sessionId: normalizedSession,
    ...placement,
    locatorKind: HISTORY_LOCATOR_KIND,
  };
  return {
    version: HISTORY_LOCATOR_VERSION,
    ...identity,
    handle: locatorSupport.historyHandle(identity),
    mintedAt,
    provenance: { source: HISTORY_LOCATOR_SOURCE, capturedAt: mintedAt },
  };
}

/**
 * Persist the locator beside the other hook state so the printed command can
 * redeem it. Best-effort: a missing dist build or unwritable state directory
 * must never block compaction.
 */
export function persistLocator(locator) {
  if (!locatorSupport) return false;
  return locatorSupport.persistHistoryLocator(
    locator,
    () => {
      locatorSupport.ensureStateDir();
      return locatorSupport.updateState(locator.sessionId, { historyLocator: locator });
    },
  );
}

export function buildRecoveryPointer() {
  return '## Recovery\nRun `/speckit:resume` against the active packet to recover session state.';
}

export function composeCompactionContext(baseContext, locator, historyCapability) {
  const sections = [];
  if (typeof baseContext === 'string' && baseContext.trim()) sections.push(baseContext.trim());

  // The caller passes a locator only after the state write succeeded, so a
  // failed persistence withholds the offer instead of printing an unredeemable
  // command.
  const lookup = locator && locatorSupport
    ? locatorSupport.buildHistoryLookupSection(locator, historyCapability)
    : null;
  if (lookup) sections.push(lookup);

  // The summary stays usable when no locator can be offered. The session-prime
  // output already names /speckit:resume on every path, so a second pointer
  // would only repeat the instruction the model has already been given.
  const primed = sections.length > 0 && sections[0].includes('/speckit:resume');
  if (!primed) sections.push(buildRecoveryPointer());
  return sections.join('\n\n');
}

/**
 * Re-prime the agent after a completed compaction, the post-compact recovery
 * Claude and Pi get from session-prime's `compact` source.
 *
 * dsh never emits `agent/created` with a compact source, so the completed
 * `compaction/end` entry on the session feed is the trigger. A failed
 * compaction kept the old history, so it gets nothing.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Core, agent lookup and switches for deterministic tests.
 */
export function registerSessionCompactContext(ctx, {
  core = { runSessionPrime },
  getAgent = () => undefined,
  isEnabled = isHookEnabled,
  createNotice = makeNotice,
} = {}) {
  if (!lifecycleEnabled(isEnabled)) return;

  ctx.on('session/event', async (session, event) => {
    if (event?.type !== 'compaction/end' || event.data?.error) return;

    try {
      const sessionId = session && typeof session.id === 'string' ? session.id : null;
      if (!sessionId) return;
      const agent = getAgent(sessionId);
      if (!agent) return;

      const projectDir = session.header?.cwd ?? process.cwd();
      const locator = mintHistoryLocator(sessionId, projectDir, new Date().toISOString());
      const persistedLocator = locator && persistLocator(locator) ? locator : null;

      const context = composeCompactionContext(
        core.runSessionPrime({ sessionId, projectDir, source: 'compact' }),
        persistedLocator,
        await loadHistoryCapability('dsh'),
      );
      if (typeof context !== 'string' || !context.trim()) return;

      agent.inject(await createNotice(context));
    } catch (error) {
      logFailure(ctx, error);
    }
  });
}
