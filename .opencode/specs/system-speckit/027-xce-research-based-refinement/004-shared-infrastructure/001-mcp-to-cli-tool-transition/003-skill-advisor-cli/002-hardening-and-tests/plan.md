---
title: "Implementation Plan: Phase 2: Hardening and Tests [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests/plan]"
description: "Planned approach: Parity + lifecycle regression-lock: 10-prompt Python local/native parity fixture (D2), rebuild/scan job semantics with mutation wall-time MEASURED (D5), orphan-reaping fixtures for the six-orphan incident class (D6), dual-client coverage"
trigger_phrases:
  - "skill-advisor hardening and tests plan"
  - "003 002-hardening-and-tests plan"
  - "skill-advisor phase 2 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Reconciled plan status with shipped suites + passed drill"
    next_safe_action: "Continue dual-stack observation window"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 2: Hardening and Tests

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server) + Node CJS shim |
| **Framework** | Existing mk_skill_advisor daemon/launcher stack — unchanged |
| **Storage** | None new — the daemon owns all DB access |
| **Testing** | vitest (existing harness) |

### Overview
Shipped and verified: the 10-prompt local-vs-native parity fixture (10/10), measured rebuild/scan job semantics (D5), orphan-reaping fixtures against the real launcher (D6), dual-client MCP+CLI coverage, and the tri-daemon spawn drill (program gate) — drill PASSED with per-launcher single-owner, respawn-lock serialization, divergent SIGTERM reap, and zero orphans. Binding scope and acceptance criteria live in spec.md and the research record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope pinned in spec.md from the research record + program pairing rule
- [x] Predecessor phase handoff criteria met
- [x] Phase plan executed directly from the existing Level 1 plan and research authority

### Definition of Done
- [x] All P0 requirements in spec.md verified
- [x] Verification approach below executed with evidence
- [x] Phase summary reconciled and parent map updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin client/integration over the existing mk_skill_advisor daemon architecture; no daemon changes in any phase.

### Key Components
- D2 parity fixture: the 10-prompt local-vs-native set runs in CI; identical top recommendation required (the research measured 10/10; the fixture keeps it true)
- D5 job semantics: measure advisor_rebuild + skill_graph_scan wall-time under mutation (the research residual); decide per-call vs progress-reporting job UX from the measurement; generation before/after reported
- D6 orphan-reaping fixtures: stale lease/no socket, killed parent, removed worktree
- Dual-client coverage: MCP + CLI against one daemon; FS-watcher rebuild behavior under concurrent clients
- **Resident-service fixtures**: trust split / telemetry sink / embedder resolution assertions
- **Tri-daemon spawn drill (program gate)**: simultaneous three-CLI auto-spawn, single-owner leases, clean reap — pin `SPECKIT_DAEMON_REELECTION`; per-launcher single-owner (skill-advisor via launcher-PID + daemon lease, no owner-lease file); respawn-lock serialization with no cross-daemon deadlock; reap diverges (spec-memory recycles on SIGTERM, code-index/skill-advisor exit)

### Data Flow
Each suite spawns isolated daemon instances under temp dirs, drives CLI/MCP clients, asserts lease/process/parity state at teardown.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planned-state placeholder: surfaces are enumerated in spec.md "Files to Change" and re-verified at speckit:plan time.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| See spec.md Files to Change | per spec | per spec | per Testing Strategy below |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm predecessor handoff criteria; load research deltas relevant to this phase

### Phase 2: Core Execution
- [x] Execute the task list in tasks.md (planned rows; expanded at speckit:plan time)

### Phase 3: Verification
- [x] All fixtures green incl. parity + zero orphans; job semantics documented with measurements
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs + anchors | validate.sh --strict |
| Functional | Hardening and Tests acceptance per spec.md | vitest suites (the phase deliverable itself) |
| Drill | Tri-daemon simultaneous auto-spawn (program gate) | drill in one runtime/worktree + process-table assertion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-cli-core | Internal | Complete | Phase cannot start |
| Research authority ../000-skill-advisor-cli-research/research/research.md | Internal | Green | Binding scope source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase produces regressions or must be abandoned.
- **Procedure**: Revert the phase commits via git; the MCP surface is untouched throughout (dual-stack), so rollback has no behavior impact.
<!-- /ANCHOR:rollback -->
