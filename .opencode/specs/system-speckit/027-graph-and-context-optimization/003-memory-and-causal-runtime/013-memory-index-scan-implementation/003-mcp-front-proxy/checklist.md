---
title: "Verification Checklist: MCP Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle"
description: "Verification Date: 2026-06-01"
trigger_phrases:
  - "mcp front proxy checklist"
  - "rss recycle mid request live proof"
  - "transparent reconnect verification gates"
  - "in-place recycle verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored MCP front-proxy packet from judge-panel design"
    next_safe_action: "Land after checkpoint-v2 then dispatch Phase 1 in-place recycle"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - "mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mcp-front-proxy-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: MCP Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-010)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (5 gated phases)
- [ ] CHK-003 [P1] Dependencies identified (child-exit supervisor, fatalShutdown ipcBridge close, SDK leniencies)
- [ ] CHK-004 [P0] `002-checkpoint-v2-file-snapshot` merged to main before Phase 1 (shared `context-server.ts`)
- [ ] CHK-005 [P0] Worktree node_modules symlinks in place (mcp_server, system-spec-kit, shared/dist); main committed and RM-8 baseline recorded
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `npm run typecheck` shows 0 new errors (TS5101 baseUrl noise excluded)
- [ ] CHK-011 [P0] No `npm run build` run against the live daemon
- [ ] CHK-012 [P1] Backend->client direction is frame-parsed, never raw-piped; incomplete trailing frames discarded on close
- [ ] CHK-013 [P1] Code reuses existing primitives (probeDaemon parser, child-exit supervisor, EADDRINUSE rebind) rather than reinventing them
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `npm run test:core` green per phase (existing daemon/launcher tests plus new proxy unit + integration tests)
- [ ] CHK-021 [P0] Live RSS-recycle-mid-request proof: a read-class `tools/call` in flight at a forced recycle returns one complete result, the client socket never EOFs, launcher pid unchanged, daemon pid changed, `daemon-ipc.sock` re-bound
- [ ] CHK-022 [P0] Live unsafe-write proof: a `memory_delete` in flight at recycle returns exactly one `-32001` with `data.retryable: true` and is not replayed
- [ ] CHK-023 [P1] Idle-during-reconnect regression: with a low idle timeout, the respawned daemon is NOT idle-killed during the gap (without the fix this test fails)
- [ ] CHK-024 [P1] All four client configs (opencode.json, .mcp.json, .claude/mcp.json, .vscode/mcp.json) connect end to end with no config edits
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed (`process.exit`/`launcherShutdownInProgress` in the launcher), or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `recycleViaGracefulSelfExit`/`recycleDaemonInPlace`, `SPECKIT_BACKEND_ONLY`, `getActiveClientCount`, `StdioServerTransport`.
- [ ] CHK-FIX-004 [P0] `classify` covered by an adversarial table test over all current tools, including the default-deny set and a fail-on-new-unclassified-tool snapshot.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: request class (read, idempotent-write, non-idempotent-write) x recycle trigger (RSS-ceiling, SIGTERM) x backend state (booting, ready, wedged).
- [ ] CHK-FIX-006 [P1] Hostile variant executed: coalesced protocol frames in one chunk, mid-frame backend death, and crash-loop give-up.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced
- [ ] CHK-031 [P0] The proxy introduces no new network-listening surface; it remains a UDS client over the existing socket
- [ ] CHK-032 [P1] `classify` default-deny prevents replaying non-idempotent writes (`memory_delete`/`bulk_delete`/`update`/`checkpoint_restore`/`embedder_set`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized after each phase
- [ ] CHK-041 [P1] implementation-summary.md reconciled per phase as code lands
- [ ] CHK-042 [P2] decision-record.md ADR statuses updated if a decision changes during implementation
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P1] No edits outside this child packet for docs, and code edits confined to the dispatch ALLOWED WRITE PATHS
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | [ ]/17 |
| P1 Items | 16 | [ ]/16 |
| P2 Items | 4 | [ ]/4 |

**Verification Date**: 2026-06-01
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..ADR-003)
- [ ] CHK-101 [P1] All ADRs have status (Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (standalone-proxy orphaned-launcher refutation, bridge-reconnect wrong topology, byte-level piping)
- [ ] CHK-103 [P2] The launcher-stays-command invariant documented (why standalone-proxy was rejected)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] A transparent reconnect resolves well under typical MCP request timeouts (NFR-P01)
- [ ] CHK-111 [P1] Backend keepalive interval does not measurably load the daemon under steady state
- [ ] CHK-112 [P2] Reconnect-gap duration measured (backoff + relaunch + handshake) on the live daemon
- [ ] CHK-113 [P2] No regression in cold-start time from the probe-until-ready gate
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and validated (`SPECKIT_BACKEND_ONLY` off restores inherited stdio; restoring `process.exit(0)` reverts the recycle)
- [ ] CHK-121 [P0] Deliberate daemon rebuild/restart is the explicit final step, not done mid-implementation
- [ ] CHK-122 [P1] `pkill -9 -f "opencode run"` run between dispatches
- [ ] CHK-123 [P1] Per-phase commits to main with explicit paths
- [ ] CHK-124 [P2] `SPECKIT_BACKEND_ONLY` default decision recorded and applied in the final phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] Mandatory post-implementation deep-review run; surfaces no P0/P1 before any completion claim
- [ ] CHK-131 [P1] SDK-invariant CI guard in place: SDK major pinned, grep-fail on new server->client requests or init-state gating
- [ ] CHK-132 [P2] Frame-parsing change reviewed against truncated/coalesced frame classes
- [ ] CHK-133 [P2] Replay safety reviewed against the full current tool list (default-deny audit)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All packet documents synchronized at completion
- [ ] CHK-141 [P1] Second-launcher documented limitation recorded (bridge path NOT wrapped; single-tenant production)
- [ ] CHK-142 [P2] Load-bearing SDK invariants documented in the proxy header
- [ ] CHK-143 [P2] Knowledge transfer captured in handover if the session ends mid-phase
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Orchestrator | [ ] Approved | |
| Deep-review | Quality gate | [ ] Approved | |
| Operator | Live RSS-recycle proof witness | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
