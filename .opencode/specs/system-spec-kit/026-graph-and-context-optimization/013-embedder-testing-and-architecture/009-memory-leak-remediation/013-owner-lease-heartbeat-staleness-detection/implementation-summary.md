---
title: "Implementation Summary: Owner-Lease Heartbeat-Staleness Detection"
description: "Implementation summary for Owner-Lease Heartbeat-Staleness Detection."
trigger_phrases:
  - "owner-lease-heartbeat-staleness-detection"
  - "009 phase 013"
  - "phase 007 owner-lease gap"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection"
    last_updated_at: "2026-05-22T15:38:39Z"
    last_updated_by: "codex"
    recent_action: "completed-arc-009-phase-013-owner-lease-heartbeat-staleness"
    next_safe_action: "arc-009-complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a03030303030303030303030303030303030303030303030303030303030303"
      session_id: "009-memory-leak-remediation-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gap discovered during arc 009 closure when mk_code_index MCP reconnect failed with -32000 against a live orphan launcher whose heartbeat was 22 minutes stale against a 60-second TTL."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Owner-Lease Heartbeat-Staleness Detection

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection` |
| **Prepared** | 2026-05-22 |
| **Completed** | 2026-05-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 013 closes the owner-lease stale-heartbeat gap discovered after arc 009.

- Added `stale-heartbeat-reclaim` to `OwnerClassification` in `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`.
- Added heartbeat-staleness classification for live, inspectable owners whose `lastHeartbeatIso` is older than `ttlMs * 2`.
- Preserved the no-signal-old-owner invariant: stale-heartbeat reclaim uses the same atomic write-temp+rename path as `stale-pid`.
- Added periodic server heartbeat refresh in `.opencode/skills/system-code-graph/mcp_server/index.ts` at `ttlMs / 3` (20s for the default 60s TTL), with timer cleanup on shutdown/error exits.
- Mirrored the stale-heartbeat classification in `.opencode/bin/mk-code-index-launcher.cjs`, where the bootstrap launcher cannot import the TypeScript helper.
- Added Vitest coverage for stale-heartbeat classification, healthy short-heartbeat classification, healthy refresh across multiple TTL windows, end-to-end stale-heartbeat lease reclaim, and launcher stale-heartbeat reclaim.
- Updated arc 009 phase 007's Limitations anchor to point to this closure.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`classifyOwner` now applies this precedence:

1. dead PID -> `stale-pid`
2. process probe `EPERM` -> `unknown-eperm`
3. PPID mismatch with actual PPID `1` -> `ppid-1-orphan`
4. heartbeat age greater than `ttlMs * 2` -> `stale-heartbeat-reclaim`
5. same canonical DB reached through a different candidate path -> `symlink-alias`
6. otherwise -> `live-owner`

`acquireOwnerLease` passes a consistent `now` value into classification and the new lease write. It still blocks only `live-owner`, `symlink-alias`, and `unknown-eperm`, so `stale-heartbeat-reclaim` follows the existing reclaim path used by `stale-pid` and `ppid-1-orphan`.

The server child now refreshes the owner lease with `refreshOwnerLease(DATABASE_DIR, process.pid)` every 20 seconds. `system-code-graph/mcp_server/` does not have the phase 004 `timer-registry.ts`, so the implementation uses a module-level `setInterval` handle and clears it in SIGINT, SIGTERM, uncaught-exception, unhandled-rejection, and connection-failure paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `ttlMs * 2` as the stale-heartbeat threshold | Mirrors phase 004's loop-lock stale heartbeat rule and gives a healthy owner two full TTL windows before reclaim. |
| Refresh at `ttlMs / 3` | The default 60s TTL gets a 20s refresh cadence, leaving several missed ticks before the 120s reclaim threshold. |
| Do not add an IPC reachability probe | The phase scope chose heartbeat staleness as the simpler permanent fix; IPC probing remains orthogonal. |
| Do not signal the old owner during reclaim | Phase 005/007 established the no-kill boundary. This phase only overwrites stale metadata. |
| Mirror logic in the CommonJS launcher | The launcher runs before build/bootstrap can be assumed, so it cannot safely import the TypeScript helper. |
| Use plain `setInterval` in `index.ts` | No local `timer-registry.ts` exists in `system-code-graph/mcp_server/`; a module-level timer plus cleanup preserves the same lifecycle behavior. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection --strict` after plan/tasks authoring | PASSED: exit 0, errors 0, warnings 0. |
| `node node_modules/vitest/vitest.mjs run mcp_server/tests/lib/owner-lease.vitest.ts mcp_server/tests/launcher-lease.vitest.ts --config vitest.config.ts` from `.opencode/skills/system-code-graph` | PASSED: 2 test files, 21 tests. |
| `node node_modules/vitest/vitest.mjs run mcp_server/tests/lib/owner-lease.vitest.ts mcp_server/tests/lib/canonical-db-dir.vitest.ts mcp_server/tests/lib/close-db.vitest.ts mcp_server/tests/launcher-lease.vitest.ts --config vitest.config.ts` from `.opencode/skills/system-code-graph` | PASSED: 4 test files, 27 tests. |
| `npm run typecheck` from `.opencode/skills/system-code-graph` | PASSED: `tsc --noEmit -p tsconfig.json`, exit 0. |
| `npm run build` from `.opencode/skills/system-code-graph` | PASSED: `tsc --build tsconfig.json`, exit 0. |
| `node --check .opencode/bin/mk-code-index-launcher.cjs` | PASSED: exit 0. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-code-graph` | PASSED: exit 0. Remaining output: 10 non-blocking warnings in pre-existing untouched shared files. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection --strict` final pass | PASSED: exit 0, errors 0, warnings 0. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation --strict` | PASSED: exit 0, errors 0, warnings 0. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle --strict` | PASSED: exit 0, errors 0, warnings 0. |

### SC-003 Operator Script

The launcher Vitest `reclaims a stale-heartbeat owner lease with a live PID` models the reconnect condition by writing a stale-heartbeat owner lease for a live PID, starting a new launcher, asserting `ownerLeaseReclaimed: stale-heartbeat-reclaim`, and asserting the new launcher acquires the lease.

Manual operator verification can use this isolated temp-DB flow without touching the shared production DB:

```bash
tmp_db="$(mktemp -d)"
SPECKIT_CODE_GRAPH_DB_DIR="$tmp_db" node .opencode/bin/mk-code-index-launcher.cjs &
launcher_pid=$!
sleep 2
kill -TERM "$launcher_pid"
SPECKIT_CODE_GRAPH_DB_DIR="$tmp_db" node .opencode/bin/mk-code-index-launcher.cjs &
second_pid=$!
sleep 2
kill -TERM "$second_pid"
rm -rf "$tmp_db"
```

For stale-heartbeat-specific manual verification, write `.code-graph-owner.json` in `tmp_db` with a live `ownerPid` and `lastHeartbeatIso` older than `ttlMs * 2`, then start the launcher and confirm stderr includes `ownerLeaseReclaimed: stale-heartbeat-reclaim`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Heartbeat refresh uses the Node event loop. Under severe event-loop saturation, refresh ticks can be delayed; this phase did not add a macOS load-stress benchmark. The `ttlMs / 3` cadence leaves multiple missed ticks before reclaim.
2. SC-003 is reconciled by B5 as harness-equivalent evidence for the lease/reconnect surface: `launcher-lease.vitest.ts` creates stale-heartbeat and live-owner lease states against temp workspaces, starts the launcher repeatedly, and proves reclaim/reconnect behavior without touching the production MCP DB. The manual operator script above remains the non-disruptive live MCP follow-up if an operator wants production-parent disconnect evidence.
3. The launcher still carries a mirrored CommonJS owner-lease classifier because it must run before TypeScript build/bootstrap can be assumed.
<!-- /ANCHOR:limitations -->

## Commit Handoff

Suggested commit:
`feat(009/013): owner-lease stale-heartbeat-reclaim + periodic refresh`

Files for the parent Claude Code agent to stage explicitly:

- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-code-index-launcher.cjs
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/index.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/007-code-graph-launcher-and-db-lifecycle/implementation-summary.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/spec.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/spec.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/plan.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/tasks.md
- /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/013-owner-lease-heartbeat-staleness-detection/implementation-summary.md
