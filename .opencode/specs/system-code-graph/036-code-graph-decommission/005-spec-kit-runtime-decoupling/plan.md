---
title: "Implementation Plan: Phase 5: spec-kit-runtime-decoupling"
description: "Removed system-spec-kit's process-level boundary to the code graph, deleted the shared contracts module after proving it unimported, rewrote 25 call sites across 9 importers, and set trust states to permanently 'absent' so the spec-kit server is self-contained."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/005-spec-kit-runtime-decoupling"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-005-spec-kit-runtime-decoupling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: spec-kit-runtime-decoupling

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (spec-kit MCP server) |
| **Framework** | system-spec-kit MCP server |
| **Storage** | None (boundary removed; no SQLite) |
| **Testing** | TypeScript typecheck + vitest suite (phase 006) |

### Overview
Removed the code-graph boundary module that spawned the launcher over stdio, deleted the shared contracts module after proving it unimported, rewrote 25 call sites across 9 importers so session bootstrap, health, resume, and memory-context handlers no longer report or depend on graph state, and set trust states to permanently 'absent'. The spec-kit server is now self-contained with no spawn, no shared contract, and no mirrored schema.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Process-boundary removal plus contract deletion across 9 importers and 25 call sites.

### Key Components
- **Boundary module**: `code-graph-boundary.ts` deleted (launcher spawn over stdio)
- **Shared contracts**: `code-graph-contracts.ts` deleted after import proof
- **Context server**: enrichment call removed; passive enrichment keeps session-warning step only
- **Session handlers**: bootstrap, health, resume, memory-context no longer report graph readiness
- **Trust states**: permanently 'absent' (honest value, not a placeholder)

### Data Flow
With the boundary and contracts gone, the spec-kit server no longer spawns a launcher, no longer calls `code_graph_context` during enrichment, and session payloads omit graph fields rather than reporting them unavailable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable as a fix_bug finding. This phase is a decoupling removal, not a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Boundary module | Spawned the launcher over stdio | Deleted | No reference to launcher path in production source |
| Shared contracts | Carried graph types across the boundary | Deleted after import proof | `code-graph-contracts.ts` removed; no unresolved import |
| Context server | Called `code_graph_context` during enrichment | Enrichment call removed | Passive enrichment keeps session-warning step only |
| Session handlers | Reported graph readiness in output | Graph fields omitted | Trust states permanently 'absent' |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed phase 002 disposition (remove the enrichment path, not fallback)
- [x] Enumerated 25 call sites across 9 importers

### Phase 2: Core Implementation
- [x] Deleted `code-graph-boundary.ts` (launcher spawn boundary)
- [x] Rewrote 25 call sites across 9 importers to remove graph dependency
- [x] Removed context-server enrichment call; passive enrichment keeps session-warning step only
- [x] Removed graph readiness reporting from session bootstrap, health, resume, and memory-context handlers
- [x] Set trust states to permanently 'absent' (honest value)
- [x] Removed mirrored code-graph schema entries from the spec-kit schema surface
- [x] Deleted `code-graph-contracts.ts` after proving it unimported (commit `1e548b0ed5`)
- [x] Removed dead structural routing nudge from context-server and memory-context (commit `b54aeea89e`)

### Phase 3: Verification
- [x] TypeScript typecheck passes with zero unresolved references
- [x] No spec-kit production source spawns the launcher
- [x] Session output makes no graph claim (fields omitted, not reported unavailable)
- [x] Quality-score reweighted to 0.44/0.31/0.25 (commit `1ea5f7c1b4`)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | Zero unresolved imports | `tsc` |
| Unit | Session payload shape | vitest (phase 006 rebaseline) |
| Manual | No launcher spawn in production source | `rg` sweep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 disposition | Internal | Green | Decides remove-vs-fallback for the enrichment path |
| Phase 006 | Internal | Green | Rebaselines the test suite against the new payload shape |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Spec-kit needs the graph enrichment path back (not expected; the decommission is the intended end state).
- **Procedure**: Restore the boundary module and contracts from git history (commit `1ea5f7c1b4` predecessor), then re-add the enrichment call and graph fields to session handlers.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
