---
title: "Implementation Plan: Phase 2: decommission-decision-record"
description: "Ratified the code-graph decommission as five accepted ADRs covering the permanent capability loss, replacement routing, per-consumer dispositions, the archival boundary, and the rollback procedure that every later phase executed against."
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/002-decommission-decision-record"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-002-decommission-decision-record"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: decommission-decision-record

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
| **Language/Stack** | Markdown decision record |
| **Framework** | ADR format (ADR-001 through ADR-005) |
| **Storage** | None |
| **Testing** | Cross-check against phase 001 synthesis |

### Overview
Authored and ratified five architecture decision records accepting the permanent removal of structural code search, fixing the replacement routing (Grep/Glob for code, `memory_search` for spec docs), setting the archival boundary, recording per-consumer dispositions, and writing the rollback procedure. Every later phase cited this record instead of re-deciding.
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
Decision-only ADR record; no runtime change.

### Key Components
- **ADR-001**: Accept the permanent capability loss (eight `code_graph_*` tool ids)
- **ADR-002**: Replacement routing doctrine (Grep/Glob for code, `memory_search` for spec docs)
- **ADR-003**: Per-consumer disposition table (remove vs fallback)
- **ADR-004**: Archival boundary (`.opencode/specs/**`, changelogs, benchmark reports not edited)
- **ADR-005**: Rollback procedure from git history

### Data Flow
The decision record is the authority that phases 003 through 015 cite for their dispositions. No downstream phase re-decides; deviations are flagged, not silent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable: this phase is decision-only. It authors a decision record and changes no runtime file.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Decision record | Authority for all downstream phases | Created | All five ADRs marked Accepted; no later phase contradicts a disposition |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed phase 001 synthesis (`research/research.md`) exists before drafting

### Phase 2: Core Implementation
- [x] Drafted ADR-001: accepted permanent loss of the eight `code_graph_*` tool ids
- [x] Drafted ADR-002: replacement routing (Grep/Glob for code, `memory_search` for spec docs)
- [x] Drafted ADR-003: per-consumer disposition table (remove vs fallback)
- [x] Drafted ADR-004: archival boundary (`.opencode/specs/**`, changelogs, benchmark reports)
- [x] Drafted ADR-005: rollback procedure with exact steps from git history

### Phase 3: Verification
- [x] All five ADRs ratified as Accepted
- [x] Rollback procedure specific enough to execute without further research
- [x] No requirement in phases 003-014 contradicts a disposition recorded here
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | ADR consistency with phase 001 synthesis | Cross-reference review |
| Validation | No downstream phase contradicts a disposition | Phase-by-phase citation check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 synthesis | Internal | Green | Dispositions would be guesses without the touchpoint inventory |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Capability loss regretted later and structural search must be restored.
- **Procedure**: ADR-005 records the exact steps to restore a working subsystem from git history, including the launcher rebuild path.
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
