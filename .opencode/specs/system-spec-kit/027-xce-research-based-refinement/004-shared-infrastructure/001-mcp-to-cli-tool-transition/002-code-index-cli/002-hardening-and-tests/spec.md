---
title: "Feature Specification: Phase 2: Hardening and Tests [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests/spec]"
description: "Regression-lock the guarantees: dual-client MCP+CLI test (D8), dual-spawn/dead-socket-respawn test (D9), blocked-read regression suite, all-8 parity suite, zero-orphan teardown"
trigger_phrases:
  - "code-index hardening and tests"
  - "002 002-hardening-and-tests"
  - "code-index phase 2"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-06T15:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase when its predecessor ships"
    blockers: []
    key_files:
      - "spec.md"
      - "../000-code-index-cli-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-002-002-hardening-and-tests-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: Hardening and Tests

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (not implemented) |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-cli-core |
| **Successor** | 003-runtime-integration |
| **Handoff Criteria** | All suites green; zero orphaned processes post-suite; parity locked at 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the code-index dual-stack CLI implementation (workstream 002-code-index-cli), paired with runtime hooks and the OpenCode plugin per the program-wide pairing rule.

**Scope Boundary**: Regression-lock the guarantees: dual-client MCP+CLI test (D8), dual-spawn/dead-socket-respawn test (D9), blocked-read regression suite, all-8 parity suite, zero-orphan teardown

**Dependencies**:
- Research authority: `../000-code-index-cli-research/research/research.md` (GO verdict, delta specs, measurements) — premise, do not relitigate
- Predecessor phase `001-cli-core/` shipped
- Current daemon-lifecycle baseline (packets 026/027/140/030 + #024): the reconnecting session proxy is now wired into mk-code-index (the CLI attaches as a replay-aware secondary), the launcher is import-pure (`require.main` guard for test import), re-election is gated by `SPECKIT_DAEMON_REELECTION`, reaping requires N consecutive deep-probe failures (default 2) under the respawn lock, and the mk-code-index launcher EXITS on child SIGTERM (no transparent recycle). Tests MUST pin `SPECKIT_DAEMON_REELECTION` and assert against these.

**Deliverables**:
- D8 dual-client test
- D9 dual-spawn + dead-socket-respawn test
- Blocked-read regression suite

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-trace guarantees from the research (lease races, dual-client safety, blocked-read discipline) are not regression-locked; any refactor can silently reopen them.

### Purpose
Convert every verified-by-code-trace guarantee into a verified-by-test guarantee for the code-index CLI.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- D8 dual-client test: MCP client + CLI client against one daemon/socket — both answered, no owner conflict; the CLI attaches as a secondary through the now-wired reconnecting session proxy, so assert replay + protocol-drift fail-closed behavior under concurrent MCP+CLI
- D9 dual-spawn + dead-socket-respawn test: simultaneous CLI starts and takeover preserve a single owner (owner-lease `wx` + respawn-lock serialization), no stale locks; note the mk-code-index launcher EXITS on child SIGTERM (no transparent recycle — dead-socket takeover is a fresh launcher under the respawn lock); pin `SPECKIT_DAEMON_REELECTION`
- Blocked-read regression suite: stale-readiness paths for query/context/detect-changes assert blocked rendering in all formats
- All-8 parity suite generated from CODE_GRAPH_TOOL_SCHEMAS — breaks loudly on schema drift
- Process-table teardown assertions: zero orphaned daemons/launchers post-suite

### Out of Scope
- MCP removal or reference migration — standing program non-goals
- Work owned by sibling phases (CLI features → phase 1; runtime wiring → phase 3)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mk_code_index test suites (vitest) | Create | Regression fixtures per delta specs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | D8 dual-client test green | Concurrent MCP + CLI calls both succeed against one daemon |
| REQ-002 | D9 dual-spawn/respawn test green | Race orderings + dead-socket takeover asserted; no stale lock artifacts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Blocked-read suite green | Every readiness-gated tool has a stale-path test asserting blocked output |
| REQ-004 | Parity suite locked at 8 | Tool add/remove/rename without codegen re-run fails the suite |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All suites green; zero orphaned processes post-suite; parity locked at 8
- **SC-002**: MCP surface untouched throughout (dual-stack) — existing clients work unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001-cli-core shipped | Phase cannot start | Phase ordering enforced by parent handoff criteria |
| Risk | Scope drift beyond the delta specs | Med | Research deltas are the binding scope authority; new work needs operator sign-off |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Delta specifications are pinned in `../000-code-index-cli-research/research/research.md`; remaining detail is planning-level.
<!-- /ANCHOR:questions -->
