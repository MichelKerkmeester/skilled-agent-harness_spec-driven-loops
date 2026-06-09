---
title: "Implementation Plan: Phase 1: CLI Core [system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core/plan]"
description: "Planned approach: code-index CLI binary: all-8 manifest codegen from CODE_GRAPH_TOOL_SCHEMAS, validateToolArgs parity at argv, IPC connect + auto-spawn, blocked-read rendering, exits 0/1/64/69/75, shim with dist-freshness (deltas D1–D7, D10)"
trigger_phrases:
  - "code-index cli core plan"
  - "002 001-cli-core plan"
  - "code-index phase 1 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core"
    last_updated_at: "2026-06-09T20:17:55Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Reconciled plan status with shipped CLI-core evidence"
    next_safe_action: "Continue dual-stack observation window"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 1: CLI Core

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
Implemented CLI core: all-8 manifest codegen from CODE_GRAPH_TOOL_SCHEMAS with validateToolArgs parity at argv, IPC connect + auto-spawn via the launcher, blocked-read rendering, exits 0/1/64/69/75, and the dist-freshness shim — verified including blocked-read, exit taxonomy, and auto-spawn. Binding scope and acceptance criteria live in spec.md and the research record.
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
- Stable shim (`.opencode/bin/code-index.cjs` working name) with dist-freshness guard (stale/missing dist → exit 69 unless dev override)
- Manifest codegen for all 8 subcommands from `CODE_GRAPH_TOOL_SCHEMAS`; validation parity via `validateToolArgs()` + dispatcher required-field checks (NOT Zod — confirmed system-specific)
- Blocked-read rendering: `query`/`context`/`detect-changes` stale-readiness `status: blocked` + `requiredAction` preserved in every output format, never false empty success
- Exit taxonomy 0/1/64/69/75 incl. retryable socket/backend/cold-start → 75

### Data Flow
argv → generated parser → validation → IPC request (spawn on demand via launcher) → response → renderer → exit code.
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
- [x] All 8 subcommands invocable against a live daemon; blocked-read renders blocked; exit matrix verified; auto-spawn works from a dead socket
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet docs + anchors | validate.sh --strict |
| Functional | CLI Core acceptance per spec.md | invocation matrix + targeted vitest + transport-down drill |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Research record (GO verdict) | Internal | Green | Phase cannot start |
| Research authority ../000-code-index-cli-research/research/research.md | Internal | Green | Binding scope source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase produces regressions or must be abandoned.
- **Procedure**: Revert the phase commits via git; the MCP surface is untouched throughout (dual-stack), so rollback has no behavior impact.
<!-- /ANCHOR:rollback -->
