---
title: "Feature Specification: Phase 8: cutover-and-rollout"
description: "Formal final-gate closeout for the cli-external parent hub merge. This phase plans the strict parent-skill and recursive spec validation, an ACTIVE trigger test of the fail-open PreToolUse dispatch hook, a final stale-reference sweep, and the parent packet rollup."
trigger_phrases:
  - "cli-external cutover"
  - "parent skill strict check"
  - "recursive spec validation"
  - "fail-open hook trigger test"
  - "phase 008 rollout"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the terminal-gate closeout spec, plan, and tasks"
    next_safe_action: "Run the terminal gate after phase 007"
    blockers: []
    key_files:
      - "spec.md"
      - "../graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The fail-open hook is verified by ACTIVELY tripping a known hard-rule violation, not by a passive no-error check"
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
| **Status** | Planned |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-routing-benchmark-and-review |
| **Successor** | None |
| **Handoff Criteria** | The strict parent-skill check, recursive spec validation, an active fail-open hook trigger test, the final stale-reference sweep, and the parent metadata rollup are executed with evidence recorded in this phase's completion artifacts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code specification.

**Scope Boundary**: Verification and closeout only. This phase plans the terminal gate for the constructed parent hub and does not introduce new skill behavior, router modes, or runtime path changes.

**Dependencies**:
- Phases 001-007 completed the research, decisions, scaffold, fold-in, atomic scorer rewrite, referrer sweep, benchmark, and review.
- `parent-skill-check.cjs` is the strict parent-hub enforcement gate for the final layout.
- `validate.sh` is the recursive strict validation gate for the whole parent packet.

**Deliverables**:
- Evidence-backed plan for the strict parent-hub check (0 warnings).
- Evidence-backed plan for recursive strict spec validation.
- An ACTIVE trigger test of the fail-open PreToolUse dispatch hook: deliberately trip a known hard-rule violation and confirm the advisory fires from the new hub path.
- Final stale-reference grep sweep criteria for the old flat `cli-opencode/`/`cli-claude-code/` paths outside historical text.
- Parent packet rollup plan for `description.json` and `graph-metadata.json` (status complete, `last_active_child_id` set to `008`) — executed only when the program actually runs, not during this planning pass.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-external parent-hub merge is not provably done until it clears the same strict enforcement bar the canonical parent hubs clear, AND until the fail-open PreToolUse dispatch hook is proven to still fire from its new path. Because that hook fails open, a passive "no error" check is insufficient: only actively tripping a known hard-rule violation confirms the advisory still fires. Without the strict checks, the active hook test, a clean stale-reference sweep, and the parent rollup, the program can appear complete while leaving broken routing, lost dispatch enforcement, or stale references.

### Purpose
Provide a formal, evidence-backed closeout plan that makes the folded `cli-external` hub eligible to stand beside `sk-code`, `sk-design`, `system-deep-loop`, `sk-doc`, and `sk-prompt` as a canon-clean parent hub, with the fail-open hook actively proven live.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external` and require zero warnings and zero failures.
- Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/026-cli-external-parent --recursive --strict` and require a passing result for the whole parent packet.
- Actively trigger a known dispatch hard-rule violation and confirm the fail-open PreToolUse hook advisory fires from the new hub path (not a passive no-error check).
- Perform a final grep sweep proving no live references to the old flat `cli-opencode/`/`cli-claude-code/` paths remain outside historical spec/changelog text.
- Roll up the parent packet's own `description.json` and `graph-metadata.json` so the parent is marked complete and points at phase `008` as the last active child — executed only when the program runs.

### Out of Scope
- New feature work for `cli-external`, `cli-opencode`, or `cli-claude-code` - this phase is verification and closeout, not construction.
- Additional router axes, runtime-loop behavior, transport modes, or surface packets - the approved program remains a pure two-tier hub with two workflow packets.
- Follow-on canon-hardening tail work - expected after this phase, but not pre-scoped here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/cli-external-orchestration/026-cli-external-parent/description.json` | Modify | Refresh parent packet description metadata during closeout after validation evidence is available (execution-time only). |
| `.opencode/specs/cli-external-orchestration/026-cli-external-parent/graph-metadata.json` | Modify | Roll parent status to complete and set `derived.last_active_child_id` to `008` during the future execution pass (execution-time only). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parent hub strict check passes with zero warnings and zero failures. | `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external` exits successfully and reports no warnings. |
| REQ-002 | Recursive strict spec validation passes for the whole parent packet. | `validate.sh .opencode/specs/cli-external-orchestration/026-cli-external-parent --recursive --strict` exits successfully. |
| REQ-003 | The fail-open PreToolUse hook is proven live by an ACTIVE trigger. | A deliberately-tripped known hard-rule violation produces the hook advisory from the new hub path; a passive no-error check is explicitly rejected as insufficient. |
| REQ-004 | Final stale-reference sweep shows no live old-flat-path references. | Grep evidence shows zero live references to the old flat `cli-opencode/`/`cli-claude-code/` paths outside historical spec/changelog text. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Parent packet metadata is rolled up after the final gates pass. | Parent `description.json` reflects the closed packet state, and parent `graph-metadata.json` records complete status with `last_active_child_id` set to `008`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cli-external` joins the canonical parent hubs under strict parent-skill validation with zero warnings.
- **SC-002**: The complete parent packet passes recursive strict spec validation, and the fail-open hook is actively proven to fire from the new path.
- **SC-003**: Old flat skill paths are absent from live runtime, advisor, CI, and documentation references, except as historical spec/changelog text.
- **SC-004**: Parent metadata makes phase `008` the final active child and records the packet as complete.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `parent-skill-check.cjs` strict enforcement | High if blocked; cutover cannot be claimed canon-clean | Treat any warning as a hard failure; fix the violating hub metadata in the relevant prior phase scope and rerun before rollup |
| Dependency | Recursive spec validation | High if blocked; packet closeout cannot be claimed complete | Address validation errors in the owning phase docs before parent metadata is rolled up |
| Risk | The fail-open hook silently stopped firing after the move | High | Actively trip a known hard-rule violation and confirm the advisory; never rely on a passive no-error observation |
| Risk | A stale old-flat-path reference survives in a live file | High | Broad grep sweep; classify historical hits as allowed; patch any live hit before closeout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No open questions for drafting. Execution evidence is grounded in phases 001-007 and must be captured during the future implementation pass; the parent rollup is performed only when the program actually executes, keeping the parent Status `Planned` until then.
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
