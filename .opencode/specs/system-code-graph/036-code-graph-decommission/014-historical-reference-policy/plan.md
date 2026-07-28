---
title: "Implementation Plan: Phase 14: historical-reference-policy"
description: "Added a single tombstone (context-index.md) at the code-graph spec track root explaining the removal and pointing at the decision record and removal commit, and confirmed that no archived spec packet, changelog, or benchmark report was modified."
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/014-historical-reference-policy"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-014-historical-reference-policy"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: historical-reference-policy

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
| **Language/Stack** | Markdown tombstone |
| **Framework** | Spec track root (`.opencode/specs/system-code-graph/`) |
| **Storage** | None |
| **Testing** | diff over archived paths (empty), no edits under `specs/**` except the 036 packet |

### Overview
Authored a single tombstone `context-index.md` at the code-graph spec track root that states what was removed, when, why, where the decision is recorded, and what to use instead. The thousands of references inside archived spec packets, changelogs, and benchmark reports were left untouched, and a diff over archived paths confirmed no archived surface was modified during the packet.
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
Cheapest honest resolution: change no history, add one durable signpost.

### Key Components
- **Tombstone**: `context-index.md` at the track root
- **Links**: decision record (phase 002) and the removal commit
- **Archival boundary**: archived packets/changelogs/benchmark reports are read, never edited

### Data Flow
A future reader following a stale pointer into the skill directory finds the tombstone within one hop and reaches the decision record and replacement routing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a `fix_bug` finding; this is an archival-reference policy. The only write is the tombstone; archived surfaces are explicitly out of bounds.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| track root | Held no signpost | Tombstone created | discoverable at track root |
| archived packets/changelogs/benchmarks | Historical record | Untouched | diff over archived paths empty |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed the archival boundary ratified in phase 002

### Phase 2: Core Implementation
- [x] Authored `context-index.md` tombstone at `.opencode/specs/system-code-graph/`
- [x] Linked the tombstone to the decision record and the removal commit
- [x] Restated the replacement routing (Grep/Glob for code, `memory_search` for spec docs)

### Phase 3: Verification
- [x] Diff over archived paths is empty (no archived packet modified)
- [x] No edits under `specs/**` except the 036 packet itself
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | archived-surface diff | git diff over archived paths |
| Manual | packet write boundary | no edits under `specs/**` except 036 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 013 (removal) | Internal | Green | The tombstone describes a completed removal |
| Phase 002 (archival boundary) | Internal | Green | Ratified the do-not-edit rule this phase applies |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The tombstone must be withdrawn (not expected).
- **Procedure**: Delete `context-index.md` from git history. Archived surfaces were never touched, so there is nothing else to revert.
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
