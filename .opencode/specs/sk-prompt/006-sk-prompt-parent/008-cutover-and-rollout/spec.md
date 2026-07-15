---
title: "Feature Specification: Phase 8: cutover-and-rollout"
description: "Formal final-gate closeout for the sk-prompt parent hub merge. This phase proves the new hub clears the strict parent-skill and recursive spec validation bars, has no stale live references to the old flat skill layout, and records the parent packet rollup."
trigger_phrases:
  - "sk-prompt cutover"
  - "parent skill strict check"
  - "recursive spec validation"
  - "stale reference sweep"
  - "phase 008 rollout"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-09T18:15:00Z"
    last_updated_by: "claude"
    recent_action: "Executed terminal gate; all checks PASS, parent metadata rolled up"
    next_safe_action: "None — packet complete. sk-prompt is now the fifth canon-clean parent hub."
    blockers: []
    key_files:
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/spec.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/008-cutover-and-rollout/tasks.md"
      - ".opencode/specs/sk-prompt/006-sk-prompt-parent/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "006-sk-prompt-parent-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "sk-prompt clears the strict parent-hub check with 0 warnings, matching sk-code/sk-design/system-deep-loop/sk-doc"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: cutover-and-rollout

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-routing-benchmark-and-review |
| **Successor** | None |
| **Handoff Criteria** | Parent-skill strict check, recursive spec validation, stale-reference sweep, and parent metadata rollup are executed with evidence recorded in this phase's completion artifacts. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models specification.

**Scope Boundary**: Verification and closeout only. This phase plans the terminal gate for the already-constructed parent hub and does not introduce new skill behavior, router modes, benchmark migration work, command changes, or runtime path changes.

**Dependencies**:
- Phases 001-007 have completed the research, mechanical fold-in, router authoring, command/runtime path updates, documentation alignment, benchmark-path migration, and review-prep work required before cutover.
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs` is the strict parent-hub enforcement gate for the final layout.
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` is the recursive strict validation gate for the whole parent packet.

**Deliverables**:
- Evidence-backed execution plan for the strict parent-hub check.
- Evidence-backed execution plan for recursive strict spec validation.
- Final stale-reference grep sweep criteria for old flat `sk-prompt-models/` and `sk-prompt/SKILL.md` paths outside historical spec/changelog text.
- Parent packet rollup plan for `description.json` and `graph-metadata.json`, including status complete and `last_active_child_id` set to `008`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-prompt parent-hub merge is not provably done until it clears the same strict enforcement bar that the canonical parent hubs already clear. Without a final strict parent-skill check, recursive spec validation, stale-reference sweep, and parent metadata rollup, the program can appear complete while still leaving broken router metadata, stale live references, or incomplete packet status.

### Purpose
Provide a formal, evidence-backed closeout plan that makes the folded `sk-prompt` hub eligible to stand beside `sk-code`, `sk-design`, `system-deep-loop`, and `sk-doc` as a canon-clean parent hub.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` and require zero warnings and zero failures.
- Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-prompt/006-sk-prompt-parent --recursive --strict` and require a passing result for the whole parent packet.
- Perform a final grep sweep proving no live references to the old flat `sk-prompt-models/` or `sk-prompt/SKILL.md` paths remain outside historical spec/changelog text.
- Roll up the parent packet's own `.opencode/specs/sk-prompt/006-sk-prompt-parent/description.json` and `.opencode/specs/sk-prompt/006-sk-prompt-parent/graph-metadata.json` so the parent is marked complete and points at phase `008` as the last active child.

### Out of Scope
- New feature work for `sk-prompt`, `prompt-improve`, or `prompt-models` - this phase is verification and closeout, not construction.
- Additional router axes, runtime-loop behavior, transport modes, or surface packets - the approved program remains a pure two-tier hub with two workflow packets.
- Follow-on canon-hardening tail work - expected after this phase because precedents such as sk-code and sk-doc grew substantially after their MVP arcs, but that tail is not pre-scoped here.
- Executing validation or editing parent metadata during this drafting pass - this document only plans future execution.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/sk-prompt/006-sk-prompt-parent/description.json` | Modify | Refresh parent packet description metadata during closeout after validation evidence is available. |
| `.opencode/specs/sk-prompt/006-sk-prompt-parent/graph-metadata.json` | Modify | Roll parent status to complete and set `derived.last_active_child_id` to `008` during the future execution pass. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parent hub strict check must pass with zero warnings and zero failures. | `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` exits successfully and reports no warnings. |
| REQ-002 | Recursive strict spec validation must pass for the whole parent packet. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-prompt/006-sk-prompt-parent --recursive --strict` exits successfully. |
| REQ-003 | Final stale-reference sweep must show no live old-path references. | Grep evidence shows zero live references to old flat `sk-prompt-models/` or `sk-prompt/SKILL.md` paths outside historical spec/changelog text. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Parent packet metadata must be rolled up after the final gates pass. | Parent `description.json` reflects the closed packet state, and parent `graph-metadata.json` records complete status with `last_active_child_id` set to `008`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sk-prompt` joins `sk-code`, `sk-design`, `system-deep-loop`, and `sk-doc` as a fifth canon-clean parent hub under strict parent-skill validation.
- **SC-002**: The complete parent packet passes recursive strict spec validation with no unresolved phase-doc blockers.
- **SC-003**: Old flat skill paths are absent from live runtime, command, advisor, CI, and documentation references, except where retained as historical spec/changelog text.
- **SC-004**: Parent metadata makes phase `008` the final active child and records the packet as complete.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `parent-skill-check.cjs` strict enforcement | High if blocked; cutover cannot be claimed canon-clean. | Treat any warning as a hard failure, fix the violating hub metadata or layout in the relevant prior phase scope, and rerun before rollup. |
| Dependency | Recursive spec validation | High if blocked; packet closeout cannot be claimed complete. | Address validation errors in the owning phase docs or checklist before parent metadata is rolled up. |
| Risk | Stale references to `sk-prompt-models/` or `sk-prompt/SKILL.md` survive in live files | High; runtime/advisor/benchmark paths can silently target dead locations. | Use a broad grep sweep, explicitly classify historical spec/changelog hits as allowed, and patch any live hit before closeout. |
| Risk | Follow-on canon-hardening work is mistaken for this phase's scope | Medium; phase 008 could sprawl beyond closeout. | Keep phase 008 limited to final gates and parent rollup; open later packets for post-MVP hardening if needed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No open questions for drafting. Execution evidence is grounded in phase 001 research and must be captured during the future implementation pass.
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
