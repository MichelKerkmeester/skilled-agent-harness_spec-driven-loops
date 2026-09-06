#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: SessionStart Hook — Session Prime
// ───────────────────────────────────────────────────────────────────
// Runs on Claude Code SessionStart event. Injects context via stdout
// based on the session source (compact, startup, resume, clear).

import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseHookStdin, hookLog, formatHookOutput, truncateToTokenBudget,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET, SESSION_PRIME_TOKEN_BUDGET,
  calculatePressureAdjustedBudget, sanitizeRecoveredPayload, wrapRecoveredCompactPayload,
  getRequiredSessionId,
  type HookInput,
  type OutputSection,
} from './shared.js';
import {
  ensureStateDir,
  loadState,
  readCompactPrime,
  clearCompactPrime,
  validatePendingCompactPrimeSemantics,
} from './hook-state.js';
import { notifyDirectiveLifecycleBoundary } from './directive-lifecycle-boundary.js';

const require = createRequire(import.meta.url);

function sessionLifecycleHookEnabled(): boolean {
  try {
    const { isHookEnabled } = require(
      fileURLToPath(new URL('../../../../../../../.opencode/hooks/shared/hook-flags.cjs', import.meta.url)),
    );
    return typeof isHookEnabled !== 'function' || isHookEnabled('session-lifecycle') !== false;
  } catch {
    return true;
  }
}

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS & TYPES
// ───────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 30 * 60 * 1000;
const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;
// ───────────────────────────────────────────────────────────────────
// 2. SOURCE HANDLERS
// ───────────────────────────────────────────────────────────────────

/** Handle source=compact: inject cached PreCompact payload (from 3-source merger) */
function handleCompact(sessionId: string): OutputSection[] {
  const stateResult = loadState(sessionId);
  const state = stateResult.ok ? stateResult.state : null;
  const pendingCompactPrime = readCompactPrime(sessionId);
  if (!pendingCompactPrime) {
    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
    return [{
      title: 'Context Recovery',
      content: 'Context was compacted. Run `/speckit:resume` against the active packet to recover session state.',
    }];
  }

  const { payload, cachedAt } = pendingCompactPrime;
  const cachedAtMs = new Date(cachedAt).getTime();
  const cacheAgeMs = Date.now() - cachedAtMs;
  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
    return [{
      title: 'Context Recovery',
      content: 'Context was compacted. Run `/speckit:resume` against the active packet to recover session state.',
    }];
  }
  const semanticValidation = validatePendingCompactPrimeSemantics(pendingCompactPrime);
  if (!semanticValidation.ok) {
    hookLog('warn', 'session-prime', `Rejecting compact cache for session ${sessionId}: ${semanticValidation.reason}`);
    clearCompactPrime(sessionId, {
      cachedAt: pendingCompactPrime.cachedAt,
      opaqueId: pendingCompactPrime.opaqueId ?? null,
    });
    return [{
      title: 'Context Recovery',
      content: 'Context was compacted, but the cached compact brief was quarantined by semantic validation. Run `/speckit:resume` against the active packet to recover session state.',
    }];
  }

  const sanitizedPayload = sanitizeRecoveredPayload(payload);
  const wrappedPayload = wrapRecoveredCompactPayload(payload, cachedAt, {
    producer: pendingCompactPrime.payloadContract?.provenance.producer,
    trustState: pendingCompactPrime.payloadContract?.provenance.trustState,
    sourceSurface: pendingCompactPrime.payloadContract?.provenance.sourceSurface,
    sanitizerVersion: pendingCompactPrime.payloadContract?.provenance.sanitizerVersion,
    runtimeFingerprint: pendingCompactPrime.payloadContract?.provenance.runtimeFingerprint,
  });
  hookLog('info', 'session-prime', `Injecting cached compact brief (${sanitizedPayload.length} chars after sanitization, cached at ${cachedAt})`);

  const sections: OutputSection[] = [
    { title: 'Recovered Context (Post-Compaction)', content: wrappedPayload },
    {
      title: 'Recovery Instructions',
      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, run `/speckit:resume`.',
    },
  ];

  // Add last spec folder if known
  if (state?.lastSpecFolder) {
    sections.push({
      title: 'Active Spec Folder',
      content: `Last active: ${state.lastSpecFolder}`,
    });
  }

  return sections;
}

function readCompactPrimeIdentity(sessionId: string): { cachedAt: string; opaqueId?: string | null } | null {
  const pendingCompactPrime = readCompactPrime(sessionId);
  if (!pendingCompactPrime) {
    return null;
  }
  return {
    cachedAt: pendingCompactPrime.cachedAt,
    opaqueId: pendingCompactPrime.opaqueId ?? null,
  };
}

function buildFallbackStartupSurface(): string {
  return [
    'Session context received. Current state:',
    '',
    '- Continuity: recover on demand from the packet docs',
    '',
    'What would you like to work on?',
  ].join('\n');
}

/** Handle source=startup: prime new session with the spec-folder overview */
export function handleStartup(): OutputSection[] {
  // The startup brief and the cached session summary both came from a
  // structural index that no longer exists, so the fallback surface is the
  // only surface left.
  return [
    {
      title: 'Session Context',
      content: buildFallbackStartupSurface(),
    },
    {
      title: 'Recovery Tools',
      content: [
        '- `/speckit:resume` — recover the active packet from its canonical docs',
        '- `rg` over `specs/` — locate a packet by trigger phrase or title',
      ].join('\n'),
    },
  ];
}

/** Handle source=resume: load resume context for continued session */
function handleResume(sessionId: string): OutputSection[] {
  const stateResult = loadState(sessionId);
  const state = stateResult.ok ? stateResult.state : null;
  const sections: OutputSection[] = [];

  if (state?.lastSpecFolder) {
    sections.push({
      title: 'Session Resume',
      content: `Last active spec folder: ${state.lastSpecFolder}\nRun \`/speckit:resume\` against it for full context.`,
    });
  } else {
    sections.push({
      title: 'Session Resume',
      content: 'Run `/speckit:resume` against the active packet to restore session state.',
    });
  }

  return sections;
}

/** Handle source=clear: minimal output after /clear */
function handleClear(): OutputSection[] {
  return [
    {
      title: 'Fresh Context',
      content: 'Session cleared. Run `/speckit:resume` or search `specs/` to load relevant context.',
    },
  ];
}

// ───────────────────────────────────────────────────────────────────
// 3. OUTPUT HELPERS
// ───────────────────────────────────────────────────────────────────

function writeHookOutput(output: string): Promise<void> {
  return new Promise<void>((resolvePromise, rejectPromise) => {
    process.stdout.write(output, (error) => {
      if (error) {
        rejectPromise(error);
        return;
      }

      resolvePromise();
    });
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. MAIN
// ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!sessionLifecycleHookEnabled()) return;
  ensureStateDir();

  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'startup' });
    hookLog('warn', 'session-prime', 'No stdin input received');
    return;
  }

  const source = input.source ?? 'startup';
  const rawSessionId = typeof input.session_id === 'string' ? input.session_id.trim() : '';
  notifyDirectiveLifecycleBoundary({
    sessionId: rawSessionId || null,
    boundary: source,
  });
  const sessionId = getRequiredSessionId(rawSessionId, 'session-prime');
  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);

  let sections: OutputSection[];
  let budget: number;
  let compactIdentity: { cachedAt: string; opaqueId?: string | null } | null = null;

  switch (source) {
    case 'compact':
      compactIdentity = readCompactPrimeIdentity(sessionId);
      sections = handleCompact(sessionId);
      budget = COMPACTION_TOKEN_BUDGET;
      break;
    case 'startup':
      sections = handleStartup();
      budget = SESSION_PRIME_TOKEN_BUDGET;
      break;
    case 'resume':
      sections = handleResume(sessionId);
      budget = SESSION_PRIME_TOKEN_BUDGET;
      break;
    case 'clear':
      sections = handleClear();
      budget = SESSION_PRIME_TOKEN_BUDGET;
      break;
    default:
      sections = handleStartup();
      budget = SESSION_PRIME_TOKEN_BUDGET;
  }

  // Apply token pressure awareness — reduce budget when context window is filling up
  const adjustedBudget = calculatePressureAdjustedBudget(
    input.context_window_tokens as number | undefined,
    input.context_window_max as number | undefined,
    budget,
  );
  if (adjustedBudget !== budget) {
    hookLog('info', 'session-prime', `Token pressure: budget ${budget} → ${adjustedBudget} (window ${input.context_window_tokens}/${input.context_window_max})`);
  }

  const output = truncateToTokenBudget(formatHookOutput(sections), adjustedBudget);

  // Write to stdout for Claude Code to inject into conversation.
  // Clear compact payload only after the write callback confirms the
  // output was handed off, so compact recovery cannot be dropped early.
  await writeHookOutput(output);
  if (source === 'compact') {
    clearCompactPrime(sessionId, compactIdentity ?? undefined);
  }
  hookLog('info', 'session-prime', `Output ${output.length} chars for source=${source}`);
}

// ───────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ───────────────────────────────────────────────────────────────────

// Run — exit cleanly even on error
if (IS_CLI_ENTRY) {
  main().catch((err: unknown) => {
    hookLog('error', 'session-prime', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
  }).finally(() => {
    process.exit(0);
  });
}
