---
title: "Feature Specification: Front-Proxy Recycle Hardening"
description: "Three defensive fixes to the mk-spec-memory launcher/front-proxy so an externally-killed or slow-booting daemon never presents as an indefinite 'connecting…' hang: bound the proxy cold-start probe window (was ~176s silent), fail-fast with a JSON-RPC error on an unbridgeable lease-held secondary session, and make the daemon's lazy-init FATALs throw (caller gets a tool error + retry) instead of process.exit downing the shared daemon."
trigger_phrases:
  - "front proxy hardening"
  - "mcp connecting forever"
  - "daemon recycle hang"
  - "cold start timeout proxy"
  - "lazy init process exit daemon"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/018-front-proxy-recycle-hardening"
    last_updated_at: "2026-06-04T09:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented (a) report fail-fast, (b) cold-start bound, (d) lazy-init no-crash; tests green"
    next_safe_action: "Build, deploy (launcher restart + daemon recycle), verify connect"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Deploy now (user directive): activate via the supervised launcher restart + daemon recycle."
      - "Defect (c) lease socket-path is deferred as a follow-up (niche worktree-env divergence, touches lease schema)."
---
# Feature Specification: Front-Proxy Recycle Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `main` |

> **Status reconciliation:** This packet remains In Progress until supervised deployment and connectivity verification occur; the implementation summary records code completion only.

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A 2026-06-04 incident left `mk-spec-memory` stuck at `connecting…` in new sessions after an operator externally SIGTERM-killed the daemon child during a from-source DB rebuild. A parallel-agent deep review root-caused three latent defects that turn a transient teardown race into an *apparently permanent* hang:
- **(b) Silent cold-start gate** — the session proxy probes a booting daemon up to `maxColdStartAttempts=120` with a `[100,250,500,1000,1500]ms` backoff ladder = **~176s of total silence** before it emits any frame; the client's `initialize` sits unanswered the whole time (`launcher-session-proxy.cjs`).
- **(a) Unbridgeable-secondary hang** — when a secondary launcher cannot bridge to the owner (`report` decision: bridge-disabled / no-socket / module-missing), it writes only a plaintext `LEASE_HELD_BY:` line (not a JSON-RPC frame) and returns; the MCP client never completes `initialize` (`mk-spec-memory-launcher.cjs` main discards the decision).
- **(d) Lazy-init FATAL downs the shared daemon** — the daemon's first-call init (`registerInitTasks`) calls `process.exit(1)` on embedder-init failure or invalid API key, killing the daemon for *every* client on one bad first call (`context-server.ts`).

### Purpose
Make these three paths fail *fast and recoverably* instead of hanging or crashing, so external recycles / slow boots / bad first-calls degrade gracefully.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `(b)` Bound the cold-start probe window: default 120 → 30 attempts (~41s) + `SPECKIT_PROXY_COLD_START_ATTEMPTS` env override (`launcher-session-proxy.cjs`).
- `(a)` Capture `bridgeOrReportLeaseHeld`'s decision; on `action==='report'` emit a retryable `-32001` JSON-RPC error so the client fails fast (`mk-spec-memory-launcher.cjs`).
- `(d)` Daemon lazy-init FATALs `throw` instead of `process.exit(1)`; the API-key hard-fail is tagged so the enclosing transient-error catch re-throws it. The init guard rethrows to the caller (tool error) and resets for retry (`context-server.ts`).
- Unit tests for `(b)` cold-start resolution.

### Out of Scope
- **(c)** Storing the owner's actual socket path in the lease + preferring it in the bridge (removes worktree-env `SPECKIT_IPC_SOCKET_DIR` divergence). Deferred — niche, touches the lease schema.
- Changing the bridge/respawn happy paths or the `-32002` protocol-drift handling.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: A dead/booting daemon yields a retryable `-32001` to the client within ~tens of seconds (default ~41s), not ~176s; tunable via `SPECKIT_PROXY_COLD_START_ATTEMPTS`.
- R2: A healthy daemon still connects within the first few probe attempts (no regression to the normal fast path).
- R3: An unbridgeable lease-held secondary session emits a retryable JSON-RPC error (client fails fast) instead of only the plaintext `LEASE_HELD_BY:` diagnostic.
- R4: A daemon lazy-init failure (embedder or invalid API key) fails the calling tool request with a structured error and leaves the shared daemon alive; the next memory-runtime call retries init.
- R5: Existing launcher/proxy/ipc-bridge suites stay green; new cold-start unit tests pass.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `resolveColdStartAttempts()` returns 30 by default, honors a positive env override, falls back on invalid env (unit-tested).
- **SC-002**: Launcher/proxy/ipc-bridge suites green; `.cjs` syntax-check clean; daemon TS build clean.
- **SC-003**: Post-deploy, a new session connects (socket `initialize` probe < 100ms) and `memory_health` returns normally.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shorter cold-start window gives up before a genuinely slow daemon boots | Spurious `-32001` | Daemon answers `initialize` within seconds (heavy startupScan is async); 30 attempts (~41s) is generous; env override for slow hosts. |
| Risk | `(d)` throw is swallowed by an enclosing catch → daemon starts with a bad key | Silent bad start | API-key hard-fail is **tagged**; the catch re-throws tagged errors, swallows only transient ones. |
| Risk | Activation needs a launcher restart + daemon recycle (drops MCP) | Brief outage for all sessions | Operator-approved; deploy via the **supervised** path (SIGTERM the launcher, not the child); `/mcp` reconnect after. |
| Dependency | `memory-runtime-guard.ts` rethrow+reset contract | — | Verified: catch resets `initPromise=null` and rethrows. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Resolved: deploy now via the supervised launcher restart + daemon recycle (operator directive). Defect (c) (store the owner socket path in the lease + prefer it in the bridge) is deferred as a follow-up — niche worktree-env `SPECKIT_IPC_SOCKET_DIR` divergence, touches the lease schema.
<!-- /ANCHOR:questions -->
