---
title: "Implementation Plan: CLI Compact Output and Shell Completion [template:level_1/plan.md]"
description: "Add a compact/names-only list-tools JSON mode to all three CLIs and generate bash/zsh shell completion from the existing tool manifests, keeping the 37/8/9 counts intact."
trigger_phrases:
  - "005-cli-automation-compact-completion plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/005-cli-automation-compact-completion"
    last_updated_at: "2026-06-11T01:50:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Delivered compact output and generated completion"
    next_safe_action: "Adopt compact list-tools and completion in automation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-005-cli-automation-compact-completion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CLI Compact Output and Shell Completion

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
| **Language/Stack** | TypeScript CLI shims + shell completion (bash/zsh) |
| **Framework** | Daemon CLI front-doors over mk-* MCP daemons |
| **Storage** | n/a (reads existing tool manifests) |
| **Testing** | vitest + smoke (37/8/9 parity for compact mode) |

### Overview
Add a `--compact`/`--names-only` machine-friendly `list-tools --format json` mode to all three CLIs (omitting full `inputSchema`), and generate bash/zsh shell completion from the existing `TOOL_DEFINITIONS` / `CODE_GRAPH_TOOL_SCHEMAS` / advisor manifest sources.
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
Additive output mode plus manifest-driven completion generation; no change to tool enumeration or coverage.

### Key Components
- **Compact list-tools mode**: names/metadata without full `inputSchema`
- **Completion generator**: reads the tool manifests, emits bash/zsh completion

### Data Flow
`list-tools --compact` -> registry names + light metadata -> small JSON; completion generator -> manifest -> per-shell completion script.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surfaces and verification live in the spec Files-to-Change table and the tasks below. Compact mode must keep 37/8/9 counts intact.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `*-cli.ts` list-tools (`:463-481`, `:542-562`, `:705-725`) | full inputSchema JSON | Add compact/names-only mode | Compact JSON omits schema, counts 37/8/9 |
| completion generators | none today | Create per-shell from manifests | Completion lists current tool names |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the manifest sources (`TOOL_DEFINITIONS`, `CODE_GRAPH_TOOL_SCHEMAS`, advisor manifest)
- [x] Define the compact JSON field set (names + light metadata, no full schema)

### Phase 2: Core
- [x] Add `--compact`/`--names-only` list-tools mode to all three CLIs
- [x] Generate bash/zsh shell completion from the tool manifests

### Phase 3: Verification
- [x] Compact JSON omits full schema and keeps 37/8/9 counts
- [x] Completion lists current tool names per CLI; regeneration reflects manifest changes
- [x] Compact names stay consistent with the existing alias map
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Compact JSON shape + counts | vitest |
| Integration | Completion generation per shell | bash/zsh test harness |
| Smoke | 37/8/9 parity for compact mode | sub-phase 001 smoke check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Alias map (sub-phase 002) | Internal | Planned | Land aliases first for consistent compact names + completion |
| Smoke check (sub-phase 001) | Internal | Planned | Reuse it to assert compact-mode counts |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Compact mode drifts from full-mode counts, or completion misfires in a shell.
- **Procedure**: Revert the compact flag / completion generator; both are additive to existing list-tools output.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
