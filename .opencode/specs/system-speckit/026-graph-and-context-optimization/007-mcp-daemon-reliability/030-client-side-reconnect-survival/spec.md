---
title: "Feature Specification: Phase 30: Client-Side MCP Reconnect Survival [template:level_1/spec.md]"
description: "Claude Code's client-side MCP transport to a still-alive local stdio daemon drops mid-session and only a manual /mcp restores it; stdio servers get no client-side auto-reconnect. v3.5.0.4 hardened daemon lifecycle but explicitly deferred client survival."
trigger_phrases:
  - "mcp client reconnect"
  - "client side reconnect survival"
  - "stdio mcp disconnect"
  - "mcp keepalive heartbeat"
  - "manual /mcp reconnect"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/030-client-side-reconnect-survival"
    last_updated_at: "2026-06-08T15:19:04Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffold phase 030 and author spec from client-reconnect investigation"
    next_safe_action: "Plan P0 frontend-disconnect instrumentation before any mitigation"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-client-side-reconnect-survival"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does tengu_byte_stream_idle_timeout_ms govern MCP stdio streams or only model streams?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 30: Client-Side MCP Reconnect Survival

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-06-08 |
| **Branch** | `scaffold/030-client-side-reconnect-survival` |
| **Parent Spec** | ../spec.md |
| **Phase** | 30 of 30 |
| **Predecessor** | 029-cross-session-kill-scoping |
| **Successor** | None |
| **Handoff Criteria** | P0 instrumentation merged and the real disconnect trigger captured at least once, before any mitigation is built. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 30** of the MCP daemon reliability packet. Phases 017–029 closed the
**daemon-lifecycle** flap: the shared daemon now outlives its owning session (re-election +
true adoption), proven by a live two-session durability test. v3.5.0.4 explicitly left
**client survival** as the deferred frontier ("Only the client-survival reconnect changed").

**Scope Boundary**: the **client↔launcher stdio transport** only — not the daemon, not
re-election, not the launcher↔daemon proxy (all already hardened).

**Dependencies**:
- Builds on the reconnecting session proxy (020) and re-election (022/027) — assumes daemon survival is working.

**Deliverables**:
- Frontend-disconnect instrumentation (P0), a measured decision on keepalive (P1), a stdout-hygiene confirmation (P2), an HTTP/SSE transport ROI note (P3), and an honest residual writeup.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When Claude Code's client-side MCP transport to a still-alive local **stdio** daemon drops
mid-session (idle blip, transport error, or a long tool call), Claude marks the server
"disconnected" and only a manual `/mcp` restores it — **stdio servers get no client-side
auto-reconnect** (only HTTP/SSE do). The daemon and launcher processes stay alive and the
data is intact, so the failure is now harmless, but it still interrupts the operator.

### Purpose
Reduce how often the client bridge drops via server-side mitigations we control, and clearly
document/decide the part that is a hard Claude Code stdio limitation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- P0 — instrument the launcher to log every frontend transport teardown (stdin EOF, stdout EPIPE/write error) with timestamp + pid, so the real trigger is captured (currently the launcher is blind to frontend drops).
- P1 — IF P0 confirms an idle-stream reap, a flag-gated, default-off keepalive notification from the launcher to keep the byte-stream warm.
- P2 — confirm stdout hygiene: that `writeLeaseHeldDiagnostic` (a non-JSON-RPC `LEASE_HELD_BY:` line) is unreachable on the MCP-serving path; reroute to stderr if any corner case exists.
- P3 — spike only: evaluate an HTTP/SSE transport, which would unlock Claude Code's native auto-reconnect (backoff, 5 attempts) that stdio never gets.
- Document the residual honestly (stdio no-auto-reconnect is harness-owned).

### Out of Scope
- Daemon lifecycle, re-election, adoption, launcher↔daemon proxy — closed in 017–029.
- Modifying Claude Code itself — the client disconnect/auto-reconnect policy is harness-owned, not ours to change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Frontend stdin/stdout teardown logging; optional keepalive emitter |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Same frontend instrumentation (shared concern) |
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Modify | Keepalive/notification hook if P1 proceeds |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document any new keepalive flag |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Launcher logs every frontend transport teardown (stdin EOF, stdout EPIPE/write error) with timestamp + pid to the persistent launcher log. | Induce a client disconnect; the launcher log shows a frontend-teardown line correlating to the event (today it shows nothing). |
| REQ-002 | The captured signature distinguishes the trigger class (idle-reap vs transport error vs launcher exit). | A single captured incident is classifiable from the log alone, without guessing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | IF idle-reap is confirmed, a flag-gated (default-off) keepalive emits a valid JSON-RPC notification at a configurable interval. | Flag on: an idle stream survives past the observed idle threshold. Flag off: byte-identical to current behavior. |
| REQ-004 | stdout hygiene confirmed on the serving path. | Path trace shows `writeLeaseHeldDiagnostic` unreachable while serving, or it is rerouted to stderr; no non-JSON-RPC bytes can reach Claude's stream. |
| REQ-005 | HTTP/SSE transport ROI is documented as a go/no-go note (not implemented here). | A short writeup compares the keepalive mitigation vs transport switch, with a recommendation. |
| REQ-006 | The residual (stdio = no client auto-reconnect; `/mcp` is recovery; harmless given daemon survival) is documented operator-facing. | A reader understands why `/mcp` is still occasionally needed and that no data is lost. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The next client disconnect leaves an attributable line in the launcher log (P0 closed).
- **SC-002**: A measured decision exists on keepalive — shipped flag-gated, or deferred with evidence — rather than a guess.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude Code MCP client behavior (timeouts, no stdio auto-reconnect) | Caps what we can fix from our side | Treat as fixed constraint; document; only mitigate the trigger frequency |
| Risk | Unsolicited keepalive notifications confuse some MCP clients | Med | Flag-gated, default-off; validate against Claude Code before any default change |
| Risk | Building mitigation before the trigger is confirmed (guesswork) | Med | Evaluator-first: P0 instrumentation gates all of P1+ |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `tengu_byte_stream_idle_timeout_ms` (180000, in `~/.claude.json`) govern MCP stdio streams or only the model byte stream? (Determines whether the idle-reap hypothesis is real.)
- Is the keepalive worth it versus an HTTP/SSE transport switch that eliminates the manual `/mcp` entirely?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
