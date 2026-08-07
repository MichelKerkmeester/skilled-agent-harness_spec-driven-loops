---
title: "Feature Specification: Phase 8: cutover-and-rollout"
description: "Final gates for the mcp-tooling fold-in: parent-skill-check.cjs STRICT with zero warnings, validate.sh --recursive --strict across the whole track, a final stale-reference grep sweep, and the parent rollup."
trigger_phrases:
  - "mcp-tooling cutover rollout"
  - "parent-skill-check strict gate"
  - "final stale-reference sweep"
  - "mcp-tooling parent rollup"
  - "phase 008 cutover-and-rollout"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-16T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Closed both deferred rollout items; phase complete"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/008-cutover-and-rollout/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/008-cutover-and-rollout/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/008-cutover-and-rollout/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "mcp-tooling becomes the sixth canon-clean parent hub after sk-code, sk-design, system-deep-loop, sk-doc, sk-prompt"
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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-routing-benchmark-and-review |
| **Successor** | 009-incumbent-inventory-parity |
| **Handoff Criteria** | `parent-skill-check.cjs .opencode/skills/mcp-tooling` passes STRICT (0 warnings); `validate.sh --recursive --strict` passes on this track; the final stale-reference grep sweep returns zero live hits; the parent packet is rolled up |
| **Execution Note** | Core gate satisfied: `parent-skill-check.cjs` STRICT passes 0 warnings and `validate.sh --recursive --strict` is 0/0. Predecessor phase 007 did not formally complete (Lane-C benchmark deferred) — this phase proceeded on the core gates regardless, per operator direction; that documented deviation stands. The two rollout items carried over from phase 006 were CLOSED on 2026-07-16: advisor skill-graph DB rebuilt (forced `advisor_rebuild`, 18 skills, generation 11997 to 11998, heavy validation ok at overallAccuracy 0.77) and CLAUDE.md/AGENTS.md figma-transport prose repointed to the `mcp-tooling` hub (lines 65 and 459 in each file). Status is Complete because every P0/P1 requirement (REQ-001..REQ-004) is verified and no unchecked P0 remains — see `implementation-summary.md` Rollout closure and `tasks.md` Phase 4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Merge mcp-chrome-devtools mcp-click-up and mcp-figma into one parent hub mcp-tooling with three modes: two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure specification.

**Scope Boundary**: Terminal gates and rollup. This phase runs the strict parent-hub check and recursive validation, does a final stale-reference sweep, and rolls up the parent packet; it makes no further structural change to the hub except fixes required to pass the gates.

**Dependencies**:
- Phase 007 complete: benchmark report generated and deep-review findings resolved or explicitly deferred.

**Deliverables**:
- `parent-skill-check.cjs .opencode/skills/mcp-tooling` passing STRICT with zero warnings (checks 1-9 or the current canon set).
- `validate.sh --recursive --strict` passing across the whole track.
- A final repo-wide stale-reference grep sweep confirming zero live hits for the old flat skill-folder paths.
- The parent packet rolled up (status, `last_active_child_id`, children back-references reconciled).
- A known-deferred acknowledgement: confirmation that the click-up OAuth-vs-`@clickup/mcp-server` config/doc drift (documented as a deferred follow-up in phase 005's spec.md scope) is still deferred, not silently dropped, before rollout.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fold-in is functionally complete and benchmarked, but it is not canon-clean until the strict parent-hub check passes with zero warnings, the whole track validates recursively, and a final sweep confirms no stale reference survived. Without these terminal gates, the hub could ship with a latent structural or reference defect.

### Purpose
Close the program by passing every terminal gate and rolling up the parent so `mcp-tooling` is a canon-clean parent hub alongside the existing five.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `parent-skill-check.cjs` against `.opencode/skills/mcp-tooling` at STRICT (0 warnings) and fix any structural gap it reports.
- Run `validate.sh --recursive --strict` across the track and fix to 0/0.
- Run a final repo-wide stale-reference grep sweep for the old flat skill-folder paths.
- Roll up the parent packet: reconcile status, `last_active_child_id`, and children back-references.
- Confirm the known-deferred ClickUp auth/config drift (SKILL.md's OAuth `mcp-remote` docs vs `.utcp_config.json`'s `@clickup/mcp-server` API-key registration, deferred in phase 005's spec.md scope) is still deferred and has not been silently dropped from tracking.

### Out of Scope
- Any new feature or mode - the program relocates and re-registers existing behavior, it does not add capability.
- A follow-on canon-hardening tail beyond the 8-phase core arc (expected later, separately numbered, per the sk-code/sk-doc/sk-prompt precedent).
- Any change to `mcp-code-mode`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/**` | Modify (conditional) | Only fixes required to pass `parent-skill-check.cjs` STRICT |
| `.opencode/specs/mcp-tooling/007-mcp-tooling-parent/graph-metadata.json` | Modify | Parent rollup: status and `last_active_child_id` reconciliation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Strict parent-hub check passes | `parent-skill-check.cjs .opencode/skills/mcp-tooling` exits STRICT with 0 warnings |
| REQ-002 | Recursive strict validation passes | `validate.sh --recursive --strict` on the track reports 0 errors / 0 warnings across parent and all phases |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Final stale-reference sweep clean; parent rolled up | A repo-wide grep for the old flat skill-folder paths returns zero live hits; the parent `graph-metadata.json` status and `last_active_child_id` are reconciled |
| REQ-004 | Known-deferred ClickUp drift stays visible, not dropped | The cutover checklist explicitly confirms the click-up OAuth-vs-`@clickup/mcp-server` config/doc drift (phase 005 scope) is still deferred; if it has been silently resolved or forgotten, this phase flags it rather than rolling up silently |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `mcp-tooling` passes `parent-skill-check.cjs` STRICT with zero warnings.
- **SC-002**: `validate.sh --recursive --strict` on the track is 0/0.
- **SC-003**: The final grep sweep confirms no stale live reference survived, and the parent packet is rolled up.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007 complete | High | Do not cut over until the benchmark and review pass |
| Risk | `parent-skill-check.cjs` STRICT surfaces a late structural gap | Medium | Fix the specific gap it names; re-run until 0 warnings |
| Risk | A stale reference survives into the final sweep | Medium | Run the sweep repo-wide, not just under the hub; require zero live hits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open at the program level; this phase runs terminal gates and rolls up the parent.
- A separately-numbered canon-hardening tail may follow, per the sk-code/sk-doc/sk-prompt precedent, but is not pre-scoped here.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
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
