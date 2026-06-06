---
title: "Implementation Plan: Phase 2: Hardening and Tests [system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests/plan]"
description: "Planned approach: Regression-lock the dual-stack guarantees: dual-simultaneous-spawn vitest, dual-client MCP+CLI vitest, CLI-spawn idle-cleanup coverage, all-37 parity suite, exit-69 recovery docs."
trigger_phrases:
  - "cli hardening tests plan"
  - "dual spawn vitest plan"
  - "cli parity suite plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/001-spec-memory-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-06T12:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase to expand the plan before implementation"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
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
| **Framework** | Existing daemon/IPC stack (launcher, bridge, session proxy) — unchanged |
| **Storage** | None new — the daemon owns all DB access |
| **Testing** | vitest (existing harness) |

### Overview
Planned phase (~3-4 days); not implemented. Regression-lock the dual-stack guarantees: dual-simultaneous-spawn vitest, dual-client MCP+CLI vitest, CLI-spawn idle-cleanup coverage, all-37 parity suite, exit-69 recovery docs. Detailed planning happens via speckit:plan when this phase opens; the binding scope and acceptance criteria live in spec.md and the parent research record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scope pinned in spec.md from the completed research record
- [ ] Predecessor phase handoff criteria met
- [ ] speckit:plan pass completed for this phase

### Definition of Done
- [ ] All P0 requirements in spec.md verified
- [ ] Verification approach below executed with evidence
- [ ] Phase summary reconciled and parent map updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin client over the existing daemon/IPC architecture; no daemon changes in any phase.

### Key Components
- **D1 suite**: two simultaneous shim invocations vs one dead socket — single owner lease asserted
- **D2 suite**: MCP client + CLI client against one IPC server — both answered, identity stable
- **D7 suite**: CLI-spawn lifecycle — idle self-shutdown, no orphan processes
- **Parity suite**: all-37 subcommand round-trip, breaks on schema drift
- **D5 docs**: exit-69 recovery guidance per mismatch class

### Data Flow
Each suite spawns isolated daemon instances under temp socket dirs, drives the shim/MCP clients, then asserts lease files, process table state, and response validity at teardown.
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
- [ ] Confirm predecessor handoff criteria; load research deltas relevant to this phase

### Phase 2: Core Execution
- [ ] Execute the task list in tasks.md (planned rows; expanded at speckit:plan time)

### Phase 3: Verification
- [ ] Full vitest run green; process-table assertion shows zero orphaned daemons/launchers post-suite; parity count locked at 37.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs + anchors | validate.sh --strict |
| Functional | Hardening and Tests acceptance per spec.md | vitest suites (the phase deliverable itself) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-cli-core shipped | Internal | Pending | Phase cannot start |
| Research record ../000-spec-memory-cli-research/research/research.md | Internal | Green | Scope authority for this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase produces regressions or must be abandoned.
- **Procedure**: Revert the phase commits via git; the MCP surface is untouched throughout (dual-stack), so rollback has no continuity impact.
<!-- /ANCHOR:rollback -->
