---
title: "Implementation Summary"
description: "Packet-creation state for the MCP front-proxy: the doc set is complete and the code is not yet written. This summary is reconciled per phase as Phase 1 through 5 land."
trigger_phrases:
  - "mcp front proxy implementation summary"
  - "mcp front proxy phase status"
  - "in-place recycle progress"
  - "transparent reconnect implementation state"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-mcp-front-proxy |
| **Completed** | Not yet - packet-creation state |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is at creation state: the full Level 3 doc set is authored and the implementation has not started. Nothing has shipped yet. What follows describes what each phase will deliver so this summary can be reconciled in place as code lands.

### Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 0 | Packet setup (docs + metadata) | Done |
| Phase 1 | In-place daemon recycle (delete launcher self-exit) | Not started |
| Phase 2 | Launcher frame-proxy topology (own client stdio over the socket) | Not started |
| Phase 3 | Transparent reconnect engine (cached initialize, frame parse, replay) | Not started |
| Phase 4 | Idle-monitor fix + safety hardening (keepalive, classifier, crash-loop bound) | Not started |
| Phase 5 | Flip default + live RSS-recycle proof + gate | Not started |

### Planned: In-place daemon recycle

Phase 1 will rename `recycleViaGracefulSelfExit` to `recycleDaemonInPlace`, delete both `process.exit(0)` calls, and stop setting `launcherShutdownInProgress` for the recycle path, so the existing child-exit supervisor respawns the daemon and the launcher stays up. After this phase a forced recycle keeps the launcher pid, respawns the daemon child, and re-binds the socket, though the client still sees an error on the dropped connection because there is no reconnect engine yet.

### Planned: Launcher frame-proxy topology

Phase 2 will flip the daemon child stdio off the MCP channel, gate the primary `StdioServerTransport` behind `SPECKIT_BACKEND_ONLY`, and start a minimal proxy on the launcher's `stdin`/`stdout` that probes the daemon to readiness before flushing client frames. After this phase the MCP session flows through the launcher over the socket with no client config change, proving the topology before the transparency engine is added.

### Planned: Transparent reconnect engine

Phase 3 will build `launcher-session-proxy.cjs` in full: a bidirectional newline-frame splitter, a `pendingRequests` map, a `cachedInitialize` captured by method, a `CONNECTED -> REATTACHING -> CONNECTED` state machine, a `probeDaemon` readiness gate, and replay. After this phase a recycle mid-request resolves a read-class request transparently or returns a single `-32001 retryable` for an unsafe write.

### Planned: Idle-monitor fix + safety hardening

Phase 4 will add the backend keepalive, detach the idle monitor's stdin listener under backend-only, add a `REATTACHING` grace to `getActiveClientCount`, build the idempotency `classify`, tighten `memory_save` secondary-index atomicity, and bound the proxy's reattach attempts to the crash-loop window. After this phase the idle monitor cannot fire during a reconnect and save replay is verified single-apply.

### Planned: Flip default + live proof

Phase 5 will decide and set the `SPECKIT_BACKEND_ONLY` default, run the live RSS-recycle-mid-request proof on the real launcher and daemon, run `validate.sh --strict`, and reconcile completion metadata. After this phase the fix is live-proven and gated.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery has not started. The plan is five gated phases run by cli-opencode (`openai/gpt-5.5-fast --variant high`) inside a git worktree, each gated by `npm run typecheck` (0 new errors) plus `npm run test:core` (green) before the next. This packet lands AFTER `002-checkpoint-v2-file-snapshot` because both edit `context-server.ts`. The orchestrator verifies each gate and owns all git writes. The real proof comes after a deliberate daemon rebuild and restart: a live RSS-recycle-mid-request test on the real launcher and daemon, where a read-class request transparently succeeds and a `memory_delete` returns one `-32001 retryable`, with the launcher pid unchanged and the daemon pid changed. A mandatory post-implementation deep-review must surface no P0/P1 before any completion claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Launcher-as-proxy over standalone-proxy and bridge-reconnect | Moving the `command` to a standalone proxy orphans the launcher (nothing self-respawns an exited launcher); the launcher must stay the `command`, taking only the transparency engine from bridge-reconnect. |
| In-place daemon recycle over launcher self-exit | Deleting the two `process.exit(0)` calls lets the existing child-exit supervisor respawn the daemon while the launcher and client pipe stay up. |
| Frame-aware bidirectional parsing + idempotency classifier | Byte-level piping leaks truncated frames to the client, and replay-all double-applies non-idempotent writes; frame parsing plus default-deny replay is the load-bearing safety boundary. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet docs authored (spec, plan, tasks, checklist, decision-record, summary) | PASS - this commit |
| `validate.sh --strict` on this packet | Run at packet creation; see status line |
| Phase 1 typecheck + test:core | Not started |
| Phase 2 typecheck + test:core | Not started |
| Phase 3 typecheck + test:core | Not started |
| Phase 4 typecheck + test:core | Not started |
| Phase 5 live RSS-recycle-mid-request proof on the real launcher + daemon | Not started |
| Mandatory deep-review (no P0/P1) | Not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code shipped yet.** This is packet-creation state; all behavior described under "What Was Built" is planned, not delivered.
2. **Second-launcher path not transparent.** The second-launcher `bridgeStdioToSocket` path is NOT wrapped by the reconnecting proxy and is severed on recycle; single-tenant production runs one client. Multi-client transparency is an additive follow-up.
3. **memory_save partial-commit window.** Until the safety phase tightens secondary-index atomicity, a post-grace SIGKILL during a `memory_save` leaves a one-write-wide replay window, accepted with a logged warning in single-tenant.
4. **Sequencing dependency.** This packet must land after `002-checkpoint-v2-file-snapshot` because both edit `context-server.ts`; dispatching Phase 1 earlier risks a merge collision.
5. **Parent pointer not updated.** This packet did not modify the parent 013 `graph-metadata.json` (no `last_active_child_id` or `children_ids` write), to keep all writes inside this child folder. The orchestrator can add `003` to the parent `children_ids` separately.
<!-- /ANCHOR:limitations -->
