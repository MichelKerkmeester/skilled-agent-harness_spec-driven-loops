---
title: "Feature Specification: label catalog, playbook, and advisor lanes"
description: "Label the feature catalog, manual testing playbook, and skill advisor outputs with agent-improvement and model-benchmark lanes."
trigger_phrases:
  - "lane legend"
  - "lane note"
  - "mode mix"
  - "reduce-state"
  - "F-P2-5"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/012-label-catalog-playbook-and-advisor-lanes"
    last_updated_at: "2026-05-29T09:41:00Z"
    last_updated_by: "build-agent"
    recent_action: "Add lane legend, playbook note, reduce-state mode mix + test"
    next_safe_action: "Run validate.sh --strict and confirm PASSED"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-agent-improvement/feature_catalog/feature_catalog.md"
      - ".opencode/skills/deep-agent-improvement/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-label-catalog-playbook-and-advisor-lanes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: label catalog, playbook, and advisor lanes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 19 |
| **Predecessor** | 011-add-agent-lane-awareness-note |
| **Successor** | 013-reorganize-script-lane-folders |
| **Handoff Criteria** | Catalog and playbook carry lane labels, reduce-state surfaces the mode mix, vitest green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the feature_catalog lane legend + playbook note + advisor recompile + F-P2-5 reduce-state mode display specification.

**Scope Boundary**: Documentation lane labels in feature_catalog and manual_testing_playbook, plus a display-only mode mix line in reduce-state.cjs and its vitest. No routing logic, no advisor recompile (orchestrator owns recompile), no parent spec edits.

**Dependencies**:
- Records already carry a top-level `mode` field, set by score-candidate.cjs (agent-improvement) and run-benchmark.cjs (model-benchmark).
- The two-lane model defined by 008/009/011 (commands, SKILL.md, agent note).

**Deliverables**:
- Lane legend and per-category lane tags in feature_catalog.md.
- Lane note in manual_testing_playbook.md mapping categories to Lane A, Lane B, or shared.
- reduce-state.cjs mode mix surfaced in the registry, per-profile section, and dashboard global summary, with a new vitest.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill now runs two lanes (agent-improvement and model-benchmark) through one agent, but the feature catalog and the manual testing playbook do not say which lane each entry serves, so operators cannot tell agent-improvement features apart from model-benchmark features. Separately, every state record already carries a `mode` field, yet the reduce-state dashboard never surfaces it, so a mixed run hides whether records came from Lane A or Lane B.

### Purpose
Make the two lanes visible: label catalog entries and playbook scenarios by lane, and surface the agent-improvement vs model-benchmark count in the reduce-state registry and dashboard without changing any routing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Lane legend section and per-category lane tags in feature_catalog.md.
- Lane note in manual_testing_playbook.md mapping each category to Lane A, Lane B, or shared.
- Display-only mode mix in reduce-state.cjs (registry, per-profile section, dashboard global summary) plus a vitest.

### Out of Scope
- Advisor recompile - the orchestrator and verify step own recompile.
- Any routing or mode-resolution logic - the mode field is read for display only.
- Parent spec.md and parent graph-metadata edits - the setup agent owns those.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-agent-improvement/feature_catalog/feature_catalog.md` | Modify | Add lane legend and per-category lane tags |
| `.opencode/skills/deep-agent-improvement/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add lane note mapping categories to lanes |
| `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs` | Modify | Surface mode mix in registry, profile section, dashboard |
| `.opencode/skills/deep-agent-improvement/scripts/tests/reduce-state-mode-mix.vitest.ts` | Create | Assert mode mix appears when records carry model-benchmark |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | reduce-state.cjs surfaces the mode mix without changing routing | Registry and dashboard show agent-improvement vs model-benchmark counts; vitest green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | feature_catalog and manual_testing_playbook carry lane labels | Catalog has a lane legend plus per-category tags; playbook has a lane note covering every category |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The reduce-state dashboard and registry show the agent-improvement vs model-benchmark count, and a vitest proves the mix appears when records carry mode=model-benchmark.
- **SC-002**: A reader of feature_catalog.md or manual_testing_playbook.md can tell the lane of any entry or scenario from the labels alone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | mode field on state records | Mix shows zero if records lack mode | Default missing mode to agent-improvement so legacy records still count |
| Risk | Display change confused with routing change | Low | Keep the change read-only, document display-only in scope and summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope, lane mapping, and the display-only constraint are fixed by the task.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
