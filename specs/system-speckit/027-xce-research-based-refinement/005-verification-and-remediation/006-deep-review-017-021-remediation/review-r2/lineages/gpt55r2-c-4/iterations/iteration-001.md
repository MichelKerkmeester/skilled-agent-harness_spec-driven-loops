# Iteration 001 - Correctness

## Scope
Reviewed the C-rest-of-server scope packet and sampled the daemon-backed CLI/session proxy, launcher bridge, owner/lease supervision, context-server lifecycle, handler dispatch, `memory_save`, vector-index mutation, and idempotency receipt paths.

## Findings

### F001 - P1 - Proxy replays `memory_save` while server-side idempotency is default-off
The launcher session proxy marks `memory_save` as replayable across backend recycle in `REPLAYABLE_TOOL_NAMES` [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:33-39]. The same file documents the exact commit-then-die hazard: primary-row dedup protects the main row, but a replay after primary insert can duplicate secondary-index rows because the save path lacks an idempotency token in that layer [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:146-153]. On backend reattach, pending requests with `entry.replayable` are sent again to the new socket rather than failed back to the caller [SOURCE: .opencode/bin/lib/launcher-session-proxy.cjs:649-663].

Counterevidence checked: `memory_save` now has server-side idempotency receipt lookup and replay handling, but it only enters that block when `isMemoryIdempotencyEnabled()` is true [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3547-3580]. The feature flag reference documents `SPECKIT_MEMORY_IDEMPOTENCY` as OFF by default [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:95].

Impact: a daemon recycle after a mutating save lands but before the response reaches the proxy can execute the mutating save a second time under default settings. Primary logical-key guards reduce the worst case, so this is not a P0, but the proxy's replay contract is still unsafe for a write path unless the corresponding idempotency receipt is active by default or the proxy refuses to replay `memory_save`.

Remediation seed: remove `memory_save` from `REPLAYABLE_TOOL_NAMES` unless `SPECKIT_MEMORY_IDEMPOTENCY` is enabled and verified, or make memory idempotency receipts default-on for daemon-backed CLI sessions and close the documented secondary-index idempotency gap.

#### Claim Adjudication Packet
```json
{
  "findingId": "F001",
  "claim": "launcher proxy marks memory_save replayable while server-side idempotency receipts are default-off, so backend recycle can replay a mutating save",
  "evidenceRefs": [
    ".opencode/bin/lib/launcher-session-proxy.cjs:33-39",
    ".opencode/bin/lib/launcher-session-proxy.cjs:146-153",
    ".opencode/bin/lib/launcher-session-proxy.cjs:649-663",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3547-3580",
    ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:95"
  ],
  "counterevidenceSought": "Checked memory_save idempotency receipt lookup/store and primary logical-key duplicate guards in memory-save.ts, idempotency-receipts.ts, create-record.ts, and vector-index-mutations.ts.",
  "alternativeExplanation": "Primary-row duplicate guards and receipt code reduce the impact when the feature flag is enabled or when duplicate content maps to an existing active row; however the proxy replay decision does not check the flag and the receipt guard is default-off.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade if SPECKIT_MEMORY_IDEMPOTENCY is enabled by default in committed runtime configs or the proxy stops classifying memory_save as replayable unless a receipt guard is active."
}
```

## Ruled Out
- The in-scope IPC re-export itself is only a thin wrapper; the shared socket implementation was sampled and includes allowed-root, uid/mode, symlink, stale-unlink, max-client, and chmod hardening. No finding recorded from that path in this iteration.
- `memory_save` lacking any receipt code was ruled out; the issue is that the guard is default-off while the proxy replay list is unconditional.

## Iteration Metrics
- New findings: P0=0, P1=1, P2=0
- `newFindingsRatio`: 1.00
- Dimensions covered: correctness
- Stop reason after this iteration: `maxIterationsReached`

Review verdict: CONDITIONAL
