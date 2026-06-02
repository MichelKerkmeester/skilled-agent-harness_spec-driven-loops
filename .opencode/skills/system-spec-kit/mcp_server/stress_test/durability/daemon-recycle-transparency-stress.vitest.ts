// ───────────────────────────────────────────────────────────────
// STRESS: Daemon RSS-recycle transparency through the front-proxy
// ───────────────────────────────────────────────────────────────
//
// The launcher front-proxy (launcher-session-proxy.cjs) lets a long-lived MCP
// client survive a backend daemon RSS-recycle without the client noticing: the
// proxy holds a single stable client-facing session (stable launcher pid) while
// the backend daemon process is recycled underneath. In-flight *replayable*
// requests (idempotent reads + memory_save primary-row dedup) are re-sent to the
// fresh backend; in-flight *unsafe* mutations are NOT replayed (the client gets a
// retryable -32001 RETRYABLE_RECYCLE_ERROR and re-drives them itself). A protocol
// version drift across the recycle fails closed with terminal -32002.
//
// This stress drives a flood of in-flight requests through the pending-request
// tracker, simulates a recycle, and asserts the replay partition is correct under
// load and that -32001 stays LIVE as the retryable recycle signal.
//
// ISOLATION: pure logic against the proxy module's exported __testing helpers and
// frozen error constants. No socket, no spawned daemon, no production DB.

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..');
const proxyModulePath = join(repoRoot, '.opencode/bin/lib/launcher-session-proxy.cjs');

type PendingEntry = { frame: string; replayable: boolean };
type PendingTracker = {
  pendingRequests: Map<string | number | null, PendingEntry>;
  handleClientFrame(frame: string): void;
  handleBackendFrame(frame: string): void;
  getCachedInitialize(): string | null;
};
type ProxyTesting = {
  classifyFrame(frame: string | Record<string, unknown>): boolean;
  createPendingRequestsTracker(classify?: (frame: string) => boolean): PendingTracker;
};

const proxyModule = require(proxyModulePath) as { __testing: ProxyTesting };
const { __testing } = proxyModule;

// The recycle error constants are module-private (not exported), so verify the
// codes from the source text — proving -32001 stays LIVE as the retryable recycle
// signal and -32002 as the terminal protocol mismatch.
const proxySource = readFileSync(proxyModulePath, 'utf8');

function errorCodeOf(constName: string): number | null {
  const match = proxySource.match(
    new RegExp(`const ${constName} = Object\\.freeze\\(\\{[\\s\\S]*?code:\\s*(-?\\d+)`),
  );
  return match ? Number(match[1]) : null;
}

const IN_FLIGHT = 200;
const READ_TOOLS = ['memory_search', 'memory_context', 'memory_quick_search', 'session_health'];
const WRITE_TOOLS = ['memory_delete', 'checkpoint_restore', 'embedder_set'];

function toolCallFrame(id: number, toolName: string): string {
  return JSON.stringify({
    jsonrpc: '2.0',
    id,
    method: 'tools/call',
    params: { name: toolName, arguments: {} },
  });
}

function responseFrame(id: number): string {
  return JSON.stringify({ jsonrpc: '2.0', id, result: { ok: true } });
}

// Faithful model of the proxy's replaySnapshot(): replayable pending frames are
// re-sent to the fresh backend; unsafe pending frames are dropped and the client
// gets a retryable recycle error. Returns the partition for assertions.
function replayAcrossRecycle(tracker: PendingTracker): {
  resent: Array<string | number | null>;
  failedRetryable: Array<string | number | null>;
} {
  const snapshot = Array.from(tracker.pendingRequests.entries());
  const resent: Array<string | number | null> = [];
  const failedRetryable: Array<string | number | null> = [];
  for (const [id, entry] of snapshot) {
    if (!tracker.pendingRequests.has(id)) continue;
    if (entry.replayable) {
      resent.push(id);
      continue;
    }
    failedRetryable.push(id);
    tracker.pendingRequests.delete(id);
  }
  return { resent, failedRetryable };
}

describe('durability: daemon RSS-recycle transparency (front-proxy replay)', () => {
  it('keeps -32001 live as the retryable recycle signal and -32002 as terminal protocol mismatch', () => {
    // Guardrail: -32001 is NOT removed — it is the launcher RETRYABLE_RECYCLE_ERROR.
    expect(errorCodeOf('RETRYABLE_RECYCLE_ERROR')).toBe(-32001);
    expect(errorCodeOf('PROTOCOL_MISMATCH_ERROR')).toBe(-32002);
  });

  it('replays in-flight idempotent reads and refuses in-flight mutations across a recycle under load', () => {
    const tracker = __testing.createPendingRequestsTracker();

    const expectReplayed: number[] = [];
    const expectRetryable: number[] = [];

    // A flood of interleaved in-flight requests: idempotent reads (replayable)
    // and unsafe mutations (non-replayable). None have responded yet — they are
    // exactly the requests in flight at the instant the backend recycles.
    for (let id = 0; id < IN_FLIGHT; id += 1) {
      if (id % 2 === 0) {
        const tool = READ_TOOLS[id % READ_TOOLS.length];
        tracker.handleClientFrame(toolCallFrame(id, tool));
        expectReplayed.push(id);
      } else {
        const tool = WRITE_TOOLS[id % WRITE_TOOLS.length];
        tracker.handleClientFrame(toolCallFrame(id, tool));
        expectRetryable.push(id);
      }
    }

    expect(tracker.pendingRequests.size).toBe(IN_FLIGHT);

    // The backend daemon RSS-recycles. The proxy replays the pending snapshot
    // against the fresh backend.
    const { resent, failedRetryable } = replayAcrossRecycle(tracker);

    // Every idempotent read survives the recycle transparently (re-sent to the
    // fresh backend); every unsafe mutation is refused with a retryable signal so
    // the client re-drives it rather than risking a double mutation.
    expect(resent.sort((a, b) => Number(a) - Number(b))).toEqual(expectReplayed);
    expect(failedRetryable.sort((a, b) => Number(a) - Number(b))).toEqual(expectRetryable);

    // The replayable reads remain pending (awaiting the fresh backend's
    // response); the unsafe ones were dropped from the pending set.
    expect(tracker.pendingRequests.size).toBe(expectReplayed.length);
  });

  it('clears a pending entry once the fresh backend responds (no leak after recycle)', () => {
    const tracker = __testing.createPendingRequestsTracker();

    for (let id = 0; id < IN_FLIGHT; id += 1) {
      tracker.handleClientFrame(toolCallFrame(id, READ_TOOLS[id % READ_TOOLS.length]));
    }
    expect(tracker.pendingRequests.size).toBe(IN_FLIGHT);

    const { resent } = replayAcrossRecycle(tracker);
    expect(resent).toHaveLength(IN_FLIGHT);

    // The fresh backend answers each replayed request — the pending set drains to
    // zero, proving no in-flight bookkeeping leaks across the recycle.
    for (let id = 0; id < IN_FLIGHT; id += 1) {
      tracker.handleBackendFrame(responseFrame(id));
    }
    expect(tracker.pendingRequests.size).toBe(0);
  });

  it('classifies the replay partition the same way the proxy does (read vs unsafe)', () => {
    for (const tool of READ_TOOLS) {
      expect(__testing.classifyFrame(toolCallFrame(1, tool)), `${tool} should be replayable`).toBe(true);
    }
    for (const tool of WRITE_TOOLS) {
      expect(__testing.classifyFrame(toolCallFrame(1, tool)), `${tool} should NOT be replayable`).toBe(false);
    }
    // memory_save is replayable by design (primary-row dedup), proving the
    // recycle path keeps the canonical save flowing through a backend swap.
    expect(__testing.classifyFrame(toolCallFrame(1, 'memory_save'))).toBe(true);
  });
});
