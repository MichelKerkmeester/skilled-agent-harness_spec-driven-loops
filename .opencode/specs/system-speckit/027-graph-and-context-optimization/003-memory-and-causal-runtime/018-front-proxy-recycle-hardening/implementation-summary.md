---
title: "Implementation Summary: Front-Proxy Recycle Hardening"
description: "Landed three front-proxy hardening fixes (cold-start bound, report fail-fast, lazy-init no-crash) with cold-start unit tests; build + launcher/proxy suites green; deploy pending."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/018-front-proxy-recycle-hardening"
    last_updated_at: "2026-06-04T09:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Code + tests complete; build clean; 18 proxy + 54 launcher tests green"
    next_safe_action: "Commit, then supervised deploy + verify connectivity"
    blockers: []
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Defect (c) lease socket-path deferred as a follow-up."
---
# Implementation Summary: Front-Proxy Recycle Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Implementation complete; deploy pending |
| **Date** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three surgical hardening fixes so an externally-killed or slow-booting `mk-spec-memory` daemon degrades gracefully instead of hanging at `connecting…` or crashing the shared daemon.

| Fix | File | Change |
|-----|------|--------|
| (b) cold-start bound | `.opencode/bin/lib/launcher-session-proxy.cjs` | `DEFAULT_MAX_COLD_START_ATTEMPTS` 120 → 30; `resolveColdStartAttempts()` (env `SPECKIT_PROXY_COLD_START_ATTEMPTS`); default resolution + `__testing` export. |
| (a) report fail-fast | `.opencode/bin/mk-spec-memory-launcher.cjs` | main() captures `bridgeOrReportLeaseHeld` decision; on `report` emits a retryable `-32001` JSON-RPC error. |
| (d) lazy-init no-crash | `mcp_server/context-server.ts` | embedder-init + API-key FATALs `throw` (API-key tagged) instead of `process.exit(1)`; enclosing transient catch re-throws tagged. |
| tests | `mcp_server/tests/launcher-session-proxy.vitest.ts` | cold-start describe: default 30, env override, invalid fallback. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Root cause came from a parallel-agent deep-review workflow of the 2026-06-04 `connecting…` incident. Each defect site was verified against live code before editing; the (d) safety property was confirmed by reading `lib/runtime/memory-runtime-guard.ts`. Edits are additive on the failure paths only — happy paths unchanged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Cold-start default 30 (~41s) balances tolerating a slow boot against capping the silent window; env-tunable.
- (d) uses `throw` + the init-guard's existing rethrow+reset rather than `process.exit`, so the shared daemon survives and transient failures self-heal on the next call.
- API-key hard-fail is **tagged** so the enclosing transient-error catch re-throws it (does not silently start with a bad key).
- Defect (c) (lease socket path) deferred — niche worktree-env divergence, touches the lease schema.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `node --check` both `.cjs` → OK.
- `npm run build` → exit 0 (daemon TS compiles).
- Launcher/proxy/ipc-bridge suite → 7 files passed, 54 tests (16 skipped), 0 failed.
- `launcher-session-proxy.vitest.ts` → 18 passed (incl. 3 new cold-start cases).
- Post-deploy (pending): socket `initialize` probe + `memory_health`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **(c)** worktree-env `SPECKIT_IPC_SOCKET_DIR` divergence remains a possible (rare) failure class until the lease stores + the bridge prefers the owner's actual socket path.
- The `(a)` fail-fast emits an `id:null` error (the launcher has not read the client's `initialize` id yet); a strict client may close rather than match it — still fail-fast, not a hang.
<!-- /ANCHOR:limitations -->
