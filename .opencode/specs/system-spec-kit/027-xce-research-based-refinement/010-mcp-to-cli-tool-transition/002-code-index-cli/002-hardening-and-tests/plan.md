---
title: "Implementation Plan: Phase 2: Hardening and Tests [system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests/plan]"
description: "Planned approach: Regression-lock the guarantees: dual-client MCP+CLI test (D8), dual-spawn/dead-socket-respawn test (D9), blocked-read regression suite, all-8 parity suite, zero-orphan teardown"
trigger_phrases:
  - "code-index hardening and tests plan"
  - "002 002-hardening-and-tests plan"
  - "code-index phase 2 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/002-hardening-and-tests"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Reconciled plan status with shipped hardening evidence"
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
| **Framework** | Existing mk_code_index daemon/launcher stack — unchanged |
| **Storage** | None new — the daemon owns all DB access |
| **Testing** | vitest (existing harness) |

### Overview
Shipped and verified: hardening suites for dual-client MCP+CLI (D8), real owner-lease takeover/respawn (D9), blocked-read regression, all-8 parity, and zero-orphan teardown — 16/16 green in sandbox with host daemons untouched. Binding scope and acceptance criteria live in spec.md and the research record.
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
Thin client/integration over the existing mk_code_index daemon architecture; no daemon changes in any phase.

### Key Components
- D8 dual-client test: MCP client + CLI client against one daemon/socket (CLI secondary via the now-wired reconnecting proxy; assert replay + protocol-drift fail-closed)
- D9 dual-spawn + dead-socket-respawn test: simultaneous CLI starts and takeover preserve a single owner, no stale locks (launcher EXITS on SIGTERM; takeover is a fresh launcher under the respawn lock; pin `SPECKIT_DAEMON_REELECTION`)
- Blocked-read regression suite: stale-readiness paths for query/context/detect-changes assert blocked rendering in all formats
- All-8 parity suite generated from CODE_GRAPH_TOOL_SCHEMAS

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
- [x] All suites green; zero orphaned processes post-suite; parity locked at 8
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
| 001-cli-core | Internal | Complete | Phase cannot start |
| Research authority ../000-code-index-cli-research/research/research.md | Internal | Green | Binding scope source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase produces regressions or must be abandoned.
- **Procedure**: Revert the phase commits via git; the MCP surface is untouched throughout (dual-stack), so rollback has no behavior impact.
<!-- /ANCHOR:rollback -->
