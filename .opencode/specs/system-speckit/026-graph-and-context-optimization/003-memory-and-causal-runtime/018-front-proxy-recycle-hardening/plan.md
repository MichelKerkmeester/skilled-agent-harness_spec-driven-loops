---
title: "Implementation Plan: Front-Proxy Recycle Hardening"
description: "Three surgical defensive edits across the launcher proxy, launcher main, and daemon lazy-init, plus a cold-start unit test, then a supervised launcher-restart + daemon-recycle deploy."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/018-front-proxy-recycle-hardening"
    last_updated_at: "2026-06-04T09:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Code + tests landed; build green"
    next_safe_action: "Commit, then supervised deploy + verify"
    blockers: []
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Front-Proxy Recycle Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three independent, surgical hardening edits + one unit test. No behavior change on the happy paths; only the failure/slow/edge paths degrade gracefully instead of hanging or crashing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `.cjs` files pass `node --check`.
- Daemon TypeScript builds clean (`npm run build`).
- Launcher/proxy/ipc-bridge vitest suites green; new cold-start unit tests green.
- Comment hygiene clean (durable WHY only; error codes E0xx / -3200x allowed).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **(b)** `launcher-session-proxy.cjs`: `DEFAULT_MAX_COLD_START_ATTEMPTS` 120 → 30; new `resolveColdStartAttempts()` reads `SPECKIT_PROXY_COLD_START_ATTEMPTS`; `createSessionProxy` default resolution calls it. Exposed via `__testing`.
- **(a)** `mk-spec-memory-launcher.cjs` main: capture `bridgeOrReportLeaseHeld` decision; on `action==='report'` write a retryable `-32001` JSON-RPC error frame to stdout.
- **(d)** `context-server.ts` init task: embedder-init catch `throw`s instead of `process.exit(1)`; API-key hard-fail `throw`s a tagged error; the enclosing transient-error catch re-throws tagged errors. Relies on `memory-runtime-guard.ts` rethrow+reset.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change | Activation |
|---------|--------|-----------|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | cold-start bound + env override | launcher restart |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | report fail-fast error | launcher restart |
| `mcp_server/context-server.ts` (daemon) | lazy-init throw not exit | dist rebuild + recycle |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Implement (a)/(b)/(d) — DONE.
2. Add cold-start unit tests + expose `resolveColdStartAttempts` — DONE.
3. Build + run launcher/proxy suites — DONE (build clean; 54 launcher tests + 18 proxy tests green).
4. Commit (code + packet).
5. Supervised deploy (launcher restart + daemon recycle) + connectivity verify.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- New: `tests/launcher-session-proxy.vitest.ts` cold-start describe — default 30, env override, invalid-env fallback.
- Regression: full launcher/proxy/ipc-bridge suite (9 files).
- `(d)` safety verified by reading `memory-runtime-guard.ts` (catch resets `initPromise` + rethrows → dispatcher tool error + retry).
- Post-deploy: socket `initialize` probe + `memory_health`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `memory-runtime-guard.ts` (`ensureMemoryRuntimeInitialized` rethrow+reset) — unchanged, relied upon.
- `launcher-ipc-bridge.cjs` `maybeBridgeLeaseHolder` decision shape (`action`, `reason`) — read-only dependency.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Code: `git revert` the commit; `.cjs` changes revert on the next launcher restart, daemon changes on the next dist rebuild + recycle.
- Cold-start window: set `SPECKIT_PROXY_COLD_START_ATTEMPTS=120` to restore the old budget without a code change.
<!-- /ANCHOR:rollback -->
