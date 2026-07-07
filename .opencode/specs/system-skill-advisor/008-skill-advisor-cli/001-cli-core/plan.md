---
title: "Implementation Plan: Phase 1: CLI Core [system-skill-advisor/008-skill-advisor-cli/001-cli-core/plan]"
description: "Planned approach: skill-advisor CLI binary: 9-subcommand registry codegen from TOOL_DEFINITIONS + Zod schemas, IPC connect + auto-spawn, fail-closed trusted-caller gate on mutating commands, exits 0/1/64/69/75 (deltas D1, D3, D8)"
trigger_phrases:
  - "skill-advisor cli core plan"
  - "003 001-cli-core plan"
  - "skill-advisor phase 1 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-cli/001-cli-core"
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
| **Framework** | Existing mk_skill_advisor daemon/launcher stack — unchanged |
| **Storage** | None new — the daemon owns all DB access |
| **Testing** | vitest (existing harness) |

### Overview
Implemented CLI core: skill-advisor CLI with 9-subcommand registry codegen from TOOL_DEFINITIONS + Zod schemas at argv, IPC connect + auto-spawn via the launcher, a fail-closed trusted-caller gate on mutating commands, exits 0/1/64/69/75, and the shim — verified. Binding scope and acceptance criteria live in spec.md and the research record.
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
- Registry codegen: 9 subcommands from `TOOL_DEFINITIONS` with the exported Zod schemas at argv (closest sibling to the spec-memory codegen path)
- IPC connect + auto-spawn via `mk-skill-advisor-launcher.cjs`; warm-first policy with `--timeout-ms`
- Trusted-caller gate: graph-mutating commands (`graph scan`, `rebuild`, `graph propagate-enhances --apply`) fail closed unless explicitly authorized
- Output contracts `--format json|text`; exit map 0/1/64/69/75
- **Resident-service semantics**: status trust-state split, telemetry/shadow-sink preservation, embedder resolution under CLI scan/rebuild

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
- [x] 9/9 subcommands invocable against a live daemon; mutating commands fail closed untrusted; exit matrix verified
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
| Research authority ../000-skill-advisor-cli-research/research/research.md | Internal | Green | Binding scope source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase produces regressions or must be abandoned.
- **Procedure**: Revert the phase commits via git; the MCP surface is untouched throughout (dual-stack), so rollback has no behavior impact.
<!-- /ANCHOR:rollback -->
