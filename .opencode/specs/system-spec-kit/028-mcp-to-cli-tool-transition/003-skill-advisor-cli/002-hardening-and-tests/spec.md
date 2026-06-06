---
title: "Feature Specification: Phase 2: Hardening and Tests [system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/spec]"
description: "Parity + lifecycle regression-lock: 10-prompt Python local/native parity fixture (D2), rebuild/scan job semantics with mutation wall-time MEASURED (D5), orphan-reaping fixtures for the six-orphan incident class (D6), dual-client coverage"
trigger_phrases:
  - "skill-advisor hardening and tests"
  - "003 002-hardening-and-tests"
  - "skill-advisor phase 2"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-06T15:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase when its predecessor ships"
    blockers: []
    key_files:
      - "spec.md"
      - "../000-skill-advisor-cli-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-003-002-hardening-and-tests-scaffold"
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
| **Handoff Criteria** | All fixtures green incl. parity + zero orphans; job semantics documented with measurements |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the skill-advisor dual-stack CLI implementation (workstream 003-skill-advisor-cli), paired with runtime hooks and the OpenCode plugin per the program-wide pairing rule.

**Scope Boundary**: Parity + lifecycle regression-lock: 10-prompt Python local/native parity fixture (D2), rebuild/scan job semantics with mutation wall-time MEASURED (D5), orphan-reaping fixtures for the six-orphan incident class (D6), dual-client coverage

**Dependencies**:
- Research authority: `../000-skill-advisor-cli-research/research/research.md` (GO verdict, delta specs, measurements) — premise, do not relitigate
- Predecessor phase `001-cli-core/` shipped

**Deliverables**:
- D2 parity fixture
- D5 job semantics
- D6 orphan-reaping fixtures

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The reconcile verdict depends on scorer parity staying true, the orphan-launcher incident class has no regression fixture, and rebuild/scan mutation wall-time was never measured (read-only research residual).

### Purpose
Lock the parity, lifecycle, and job-semantics guarantees in tests before any runtime points at the CLI.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- D2 parity fixture: the 10-prompt local-vs-native set runs in CI; identical top recommendation required (the research measured 10/10 — this keeps it true)
- D5 job semantics: measure advisor_rebuild + skill_graph_scan wall-time under mutation (the research residual); decide per-call vs progress-reporting job UX from the measurement; generation before/after reported
- D6 orphan-reaping fixtures: stale lease/no socket, killed parent, removed worktree — each leaves zero extra launchers (owner token, process-group reap, stale-socket probe, idle timeout)
- Dual-client coverage: MCP + CLI against one daemon; FS-watcher rebuild behavior under concurrent clients
- Resident-service assertions: status trust-state split, telemetry/shadow-sink preservation, and embedder resolution under CLI scan/rebuild each get a fixture
- **Tri-daemon spawn drill (program gate, owned here)**: spec-memory + code-index + skill-advisor CLIs auto-spawn simultaneously in one runtime/worktree; all three launchers hold single-owner leases and reap cleanly

### Out of Scope
- MCP removal or reference migration — standing program non-goals
- Work owned by sibling phases (CLI features → phase 1; runtime wiring → phase 3)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mk_skill_advisor test suites (vitest) | Create | Regression fixtures per delta specs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parity fixture green in CI | 10/10 identical top recommendations local-vs-native; failure blocks merge |
| REQ-002 | Mutation wall-time measured + job UX decided | rebuild/scan timings recorded; chosen semantics documented with the numbers |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Orphan fixtures green | Every leak-path fixture ends with zero stray launcher processes |
| REQ-004 | Dual-client test green | Concurrent MCP + CLI calls both succeed; watcher behavior asserted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All fixtures green incl. parity + zero orphans; job semantics documented with measurements
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

- None blocking. Delta specifications are pinned in `../000-skill-advisor-cli-research/research/research.md`; remaining detail is planning-level.
<!-- /ANCHOR:questions -->
