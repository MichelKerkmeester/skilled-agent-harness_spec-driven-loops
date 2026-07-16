---
title: "Feature Specification: mk-code-index reconnecting session proxy"
description: "mk-code-index bridged clients through a raw socket with no reconnect, so an owner death surfaced as a hard Connection closed. This packet ports the mk-spec-memory reconnecting session proxy to mk-code-index with a code-graph replayable tool set."
trigger_phrases:
  - "code-index reconnecting proxy"
  - "mk-code-index connection closed"
  - "code-graph daemon reconnect"
  - "code-index session proxy"
  - "createClassifyFrame code-index"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/020-code-index-reconnecting-proxy"
    last_updated_at: "2026-06-07T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Ported the reconnecting session proxy to mk-code-index"
    next_safe_action: "Phase 021 orphan-sweeper / CLAUDE_SESSION_PID activation"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-020-code-index-reconnecting-proxy"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is the session proxy reusable for code-index? -> Yes; createSessionProxy already takes an injectable classify, so only a code-graph replayable tool set + a wrapper are needed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: mk-code-index reconnecting session proxy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
mk-spec-memory fronts its daemon with a reconnecting session proxy so secondary clients survive a recycle or owner change transparently. mk-code-index did not: it called the shared `maybeBridgeLeaseHolder` without a `bridge` option, so it used the raw `bridgeStdioToSocket`. When the code-index owner died, the client saw a hard `Connection closed` with no reattach. Phase 017 flagged this as the worst of the deferred failure modes.

### Purpose
mk-code-index bridges secondary clients through the same reconnecting session proxy, so a code-index owner death reattaches to the respawned backend and replays in-flight read queries instead of dropping the connection.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A generic `createClassifyFrame({replayableToolNames, unsafeToolNames})` factory in the shared proxy (default unchanged = mk-spec-memory).
- A code-graph replayable/unsafe tool set + a `bridgeStdioThroughSessionProxy` wrapper in mk-code-index.
- Wire the wrapper as the `bridge` for the code-index lease-holder check; add a `require.main` guard so the launcher is testable.

### Out of Scope
- The session proxy's reattach/replay/keepalive machinery - reused unchanged.
- RC-2 ownership re-election + orphan-sweeper - separate phases.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Modify | `createClassifyFrame` factory; default `classifyFrame` now built from it (behavior identical); export the factory |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Code-graph tool sets + `classifyCodeIndexFrame` + `bridgeStdioThroughSessionProxy`; wire `bridge`; `require.main` guard + exports |
| `mcp_server/tests/launcher-code-index-proxy.vitest.ts` | Create | Factory + code-index classifier + isolation tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | code-index uses the reconnecting proxy | The lease-holder check passes `bridge: bridgeStdioThroughSessionProxy` |
| REQ-002 | Correct replay classification | code-graph read tools replay; `code_graph_scan`/`code_graph_apply` never replay |
| REQ-003 | mk-spec-memory behavior unchanged | The default classifier still classifies memory tools exactly as before |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Shared machinery reused, not forked | Only the classify (tool set) differs; reattach/replay/keepalive untouched |
| REQ-005 | Launcher testable | `require.main` guard added; tool sets + classifier + wrapper exported |
| REQ-006 | Comment hygiene | Durable WHY only; no ADR/REQ/CHK/spec-path ids in code |

### Acceptance Criteria (Given/When/Then)

- **Given** a code-index owner death, **When** a secondary is bridged, **Then** it uses the reconnecting proxy (not the raw socket).
- **Given** a `code_graph_query` in flight, **When** the backend reattaches, **Then** it is classified replayable.
- **Given** a `code_graph_scan` in flight, **When** the backend reattaches, **Then** it is NOT replayed.
- **Given** the default classifier, **When** a memory tool is checked, **Then** classification is unchanged.
- **Given** a custom unsafe tool also listed replayable, **When** classified, **Then** unsafe wins (not replayed).
- **Given** the launcher required in a test, **When** loaded, **Then** main() does not run (guarded).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A code-index owner death reattaches transparently instead of a hard Connection closed.
- **SC-002**: Read queries replay; graph mutations do not; mk-spec-memory unaffected.
- **SC-003**: `node --check` clean; code-index proxy + session-proxy + launcher tests pass; `validate.sh --strict` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Replaying a non-idempotent code tool | Med | Only read tools in the replayable set; scan/apply explicitly unsafe; unsafe wins |
| Risk | Refactor of shared `classifyFrame` regresses mk-spec-memory | Med | Default factory call reproduces the exact prior sets; session-proxy tests pass |
| Risk | `require.main` guard changes launch behavior | Low | Launcher is only ever spawned as a script (verified); guard is the standard pattern |
| Dependency | `createSessionProxy` injectable classify | Low | Already supported; no proxy-core change needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new steady-state cost; the proxy only engages on a reattach.
- **NFR-P02**: Replay is bounded to in-flight read requests.

### Security
- **NFR-S01**: No new external surface; same owner-lease + socket model.
- **NFR-S02**: Mutating tools are never auto-replayed (no unintended graph writes).

### Reliability
- **NFR-R01**: code-index clients survive an owner change instead of dropping.
- **NFR-R02**: Protocol-version drift still fails closed (-32002), inherited from the shared proxy.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Unknown tool: not replayed (conservative).
- Protocol method (initialize/ping/notifications): replayed (shared rule).
- Tool in both replayable and unsafe sets: unsafe wins.

### Error Scenarios
- Backend protocol drift across reattach: terminal CLOSED, -32002 (inherited).
- In-flight scan during recycle: client gets a retryable recycle error, re-drives itself.

### State Transitions
- Owner death -> reattach to respawned backend -> replay read queries.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Factory + two launcher wirings + guard + one test file |
| Risk | 13/25 | Touches shared proxy classifier + a second launcher; mitigated by additive factory + tests |
| Research | 8/20 | Reference wiring + injectable-classify confirmed in code |
| **Total** | **32/70** | **Level 2 (risk-weighted)** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The proxy machinery is reused as-is; only the replayable tool set is code-index-specific.
<!-- /ANCHOR:questions -->
