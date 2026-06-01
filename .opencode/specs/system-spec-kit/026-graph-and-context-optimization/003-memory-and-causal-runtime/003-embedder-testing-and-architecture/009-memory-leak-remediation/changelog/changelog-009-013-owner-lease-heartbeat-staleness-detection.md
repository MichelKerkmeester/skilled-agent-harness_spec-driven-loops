---
title: "Owner-Lease Heartbeat-Staleness Detection: Phase 013"
description: "Closes the owner-lease stale-heartbeat gap that blocked MCP reconnect. Adds stale-heartbeat-reclaim classification, periodic server heartbeat refresh and Vitest coverage for the new reclaim and healthy-owner paths."
trigger_phrases:
  - "owner-lease stale-heartbeat-reclaim"
  - "heartbeat staleness detection owner lease"
  - "classifyOwner stale-heartbeat"
  - "periodic refreshOwnerLease"
  - "mk-code-index-launcher stale heartbeat"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-22

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation`

### Summary

Phase 007's `classifyOwner` returned `live-owner` for any owner whose PID was alive regardless of heartbeat freshness. When an arc 009 closure attempt hit a launcher + server pair that had outlived their parent MCP client disconnect, `lastHeartbeatIso` was 22 minutes stale against a 60-second TTL. The new MCP client was blocked from acquiring the lease with a `-32000` error because the gate refused every non-stale-pid live owner.

Phase 013 introduces `stale-heartbeat-reclaim` as a new `OwnerClassification` value in `owner-lease.ts`, inserted at precedence position 4 (live PID with heartbeat older than `ttlMs * 2`). The same atomic write-temp+rename reclaim path used by `stale-pid` is reused. Periodic `refreshOwnerLease` calls at `ttlMs / 3` (20s for the default 60s TTL) keep healthy owners from being misclassified. The CommonJS launcher mirrors the new classification. Five Vitest cases cover the stale-heartbeat reclaim path, the healthy short-heartbeat case, healthy refresh across multiple TTL windows, end-to-end lease reclaim and the launcher reclaim path. The arc 009 phase 007 Limitations anchor was updated to reflect the gap closure.

### Added

- `stale-heartbeat-reclaim` value to the `OwnerClassification` union in `owner-lease.ts`
- Heartbeat-staleness classification rule in `classifyOwner`: live PID with `lastHeartbeatIso` older than `ttlMs * 2` maps to `stale-heartbeat-reclaim`
- Periodic `refreshOwnerLease` in `mcp_server/index.ts` via `setInterval` at `ttlMs / 3` with timer cleanup on SIGINT, SIGTERM, uncaught-exception, unhandled-rejection and connection-failure exits
- Vitest fixture for the stale-heartbeat classification and reclaim scenario in `owner-lease.vitest.ts`
- Vitest fixture for the healthy short-heartbeat live-owner case in `owner-lease.vitest.ts`
- Vitest fixture for healthy refresh across multiple TTL windows in `owner-lease.vitest.ts`

### Changed

- `acquireOwnerLease` in `owner-lease.ts` now treats `stale-heartbeat-reclaim` identically to `stale-pid`: atomic write-temp+rename, no signal to old owner
- `mk-code-index-launcher.cjs` updated to treat `stale-heartbeat-reclaim` as reclaim-eligible in the launch gate

### Fixed

- MCP reconnect blocked with `-32000` when a live-PID orphan launcher held a lease with a heartbeat 22 minutes past its TTL. The new stale-heartbeat-reclaim classification path now allows a legitimate new client to acquire the lease.
- Arc 009 phase 007 `implementation-summary.md` Limitations anchor updated to reference this phase as the gap-closure follow-on.

### Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this phase after plan and tasks authoring | PASSED: exit 0, errors 0, warnings 0 |
| Vitest targeted run: `owner-lease.vitest.ts` + `launcher-lease.vitest.ts` (2 files) | PASSED: 21 tests |
| Vitest lifecycle regression suite: `owner-lease.vitest.ts` + `canonical-db-dir.vitest.ts` + `close-db.vitest.ts` + `launcher-lease.vitest.ts` (4 files) | PASSED: 27 tests |
| `npm run typecheck` from `.opencode/skills/system-code-graph` | PASSED: `tsc --noEmit -p tsconfig.json`, exit 0 |
| `npm run build` from `.opencode/skills/system-code-graph` | PASSED: `tsc --build tsconfig.json`, exit 0 |
| `node --check .opencode/bin/mk-code-index-launcher.cjs` | PASSED: exit 0 |
| `verify_alignment_drift.py --root .opencode/skills/system-code-graph` | PASSED: exit 0. 10 non-blocking warnings in pre-existing untouched shared files. |
| `validate.sh --strict` on this phase, final pass | PASSED: exit 0, errors 0, warnings 0 |
| `validate.sh --strict` on parent arc 009 | PASSED: exit 0, errors 0, warnings 0 |
| `validate.sh --strict` on arc 009 phase 007 | PASSED: exit 0, errors 0, warnings 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts` | Modified | Added `stale-heartbeat-reclaim` to `OwnerClassification`. Added heartbeat-staleness rule at precedence 4 in `classifyOwner`. `acquireOwnerLease` reclaims on `stale-heartbeat-reclaim` via the same atomic path as `stale-pid`. |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | Modified | Periodic `refreshOwnerLease` via `setInterval` at `ttlMs / 3`. Timer cleared on all shutdown paths. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | Treats `stale-heartbeat-reclaim` as reclaim-eligible in the launch gate. |
| `.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts` | Modified | Added stale-heartbeat classification, healthy short-heartbeat, healthy refresh across TTL windows and end-to-end reclaim Vitest cases. |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Added launcher stale-heartbeat reclaim regression coverage. |

### Follow-Ups

- Heartbeat refresh relies on the Node event loop. Under severe event-loop saturation, refresh ticks can be delayed. The `ttlMs / 3` cadence leaves several missed ticks before the `ttlMs * 2` reclaim threshold, but no macOS load-stress benchmark was added in this phase.
- SC-003 operator verification uses `launcher-lease.vitest.ts` as harness-equivalent evidence. A manual non-disruptive live MCP verification script is documented in the implementation summary for operators who want production-parent disconnect evidence.
- The launcher retains a mirrored CommonJS owner-lease classifier because it runs before TypeScript build and bootstrap can be assumed.
