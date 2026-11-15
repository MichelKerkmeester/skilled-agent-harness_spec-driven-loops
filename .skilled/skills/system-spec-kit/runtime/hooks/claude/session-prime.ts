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
  getRequiredSessionId, forkCompactedRecently,
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
import { isMainModule } from '../../lib/esm-entry.js';
import { enclosingPacketFolder, formatPacketProblem, formatPacketPurpose, resolvePacketPurpose } from '../../lib/spec/packet-purpose.js';
import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';

const require = createRequire(import.meta.url);

function sessionLifecycleHookEnabled(): boolean {
  try {
    const { isHookEnabled } = require(
      fileURLToPath(new URL('../../../../../../hooks/shared/hook-flags.cjs', import.meta.url)),
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
// The title of the section that carries a cached brief the hook accepted.
const RECOVERED_CONTEXT_TITLE = 'Recovered Context (Post-Compaction)';
const IS_CLI_ENTRY = isMainModule(import.meta.url);

// ───────────────────────────────────────────────────────────────────
// 2. SOURCE HANDLERS
// ───────────────────────────────────────────────────────────────────

/** Handle source=compact: inject cached PreCompact payload (from 3-source merger) */
async function handleCompact(sessionId: string): Promise<OutputSection[]> {
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
    { title: RECOVERED_CONTEXT_TITLE, content: wrappedPayload },
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

/**
 * The last active packet's purpose, as the section that leads a compaction
 * recovery. It goes first because the budget cut drops trailing sections, and
 * why the work exists outlasts the transcript detail after it. A missing or
 * unreadable packet yields no section, never a failed recovery.
 */
export function buildPacketPurposeSection(
  lastSpecFolder: string | null | undefined,
  projectRoot: string = process.cwd(),
): OutputSection | null {
  if (!lastSpecFolder) return null;
  const root = resolve(projectRoot);
  // The folder is read from a temp state file or a transcript line, and can be
  // a track folder or a packet subfolder. The resolver keeps it in the project.
  const folder = enclosingPacketFolder(lastSpecFolder, root);
  if (!folder) return null;
  const purpose = resolvePacketPurpose(folder);
  if (!purpose) return null;
  const line = formatPacketPurpose(purpose, root);
  const problem = formatPacketProblem(purpose);
  return { title: 'Packet Purpose', content: problem ? `${line}\n${problem}` : line };
}

/**
 * The folder the brief cached before the compaction named as active. A session
 * whose Stop hook saw several packets has no last folder, and this is the one
 * packet the recovery can still name. Only the header above the recent context
 * is read, because that part quotes transcript lines that could carry a
 * look-alike folder line.
 */
export function folderNamedInBrief(payload: string | null | undefined): string | null {
  const header = payload?.split(/^Recent context:/m)[0];
  return header?.match(/^\s*Active spec folder: (\S+)\s*$/m)?.[1] ?? null;
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

/**
 * Run one SessionStart event after its stdin payload was parsed.
 *
 * Exported so the compact recovery path can be exercised without a child
 * process: the output write happens before the cache clear, and the caller
 * controls both.
 */
export async function runSessionStartHook(
  input: HookInput,
  writeOutput: (output: string) => Promise<void> = writeHookOutput,
  projectRoot: string = process.cwd(),
): Promise<void> {
  const source = input.source ?? 'startup';
  const rawSessionId = typeof input.session_id === 'string' ? input.session_id.trim() : '';
  notifyDirectiveLifecycleBoundary({
    sessionId: rawSessionId || null,
    boundary: source,
  });
  const sessionId = getRequiredSessionId(rawSessionId, 'session-prime');
  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);

  // A fork compacts under its parent's session id, so recovering and clearing here
  // would spend the parent's cached brief on the fork.
  const transcriptPath = input.transcript_path;
  if (source === 'compact'
    && typeof transcriptPath === 'string'
    && transcriptPath !== ''
    && forkCompactedRecently(transcriptPath, sessionId)) {
    hookLog('info', 'session-prime', `Skipping compact recovery for session ${sessionId}: a forked sub-agent compacted`);
    return;
  }

  let sections: OutputSection[];
  let budget: number;
  let compactIdentity: { cachedAt: string; opaqueId?: string | null } | null = null;

  switch (source) {
    case 'compact': {
      compactIdentity = readCompactPrimeIdentity(sessionId);
      const stateResult = loadState(sessionId);
      const priorState = stateResult.ok ? stateResult.state : null;
      sections = await handleCompact(sessionId);
      // A stale or quarantined brief must not choose which spec.md is read, so
      // the folder it names counts only when handleCompact injected that brief.
      const briefAccepted = sections[0]?.title === RECOVERED_CONTEXT_TITLE;
      const purposeSection = buildPacketPurposeSection(
        priorState?.lastSpecFolder
          || (briefAccepted ? folderNamedInBrief(priorState?.pendingCompactPrime?.payload) : null),
        projectRoot,
      );
      if (purposeSection) sections.unshift(purposeSection);
      budget = COMPACTION_TOKEN_BUDGET;
      break;
    }
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
  await writeOutput(output);
  if (source === 'compact') {
    clearCompactPrime(sessionId, compactIdentity ?? undefined);
  }
  hookLog('info', 'session-prime', `Output ${output.length} chars for source=${source}`);
}

async function main(): Promise<void> {
  if (!sessionLifecycleHookEnabled()) return;
  ensureStateDir();

  // Claude kills SessionStart hooks after 3 seconds, so the read ends early
  // enough to leave that budget to the work after it.
  const input = await withTimeout(parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), HOOK_TIMEOUT_MS, null);
  if (!input) {
    notifyDirectiveLifecycleBoundary({ sessionId: null, boundary: 'startup' });
    hookLog('warn', 'session-prime', 'No stdin input received');
    return;
  }

  await runSessionStartHook(input);
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
