---
title: "Feature Specification: Phase 006 Advisor Rebuild and Validation"
description: "Finalize Packet 070 by rebuilding the advisor graph, probing deep-review/deep-research routing, auditing active old-name references, restoring parent narrative, and validating the full phase parent."
trigger_phrases:
  - "070 phase 006"
  - "advisor rebuild validation"
  - "deep-review deep-research probes"
  - "final grep audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename/006-advisor-and-validate"
    last_updated_at: "2026-05-05T20:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Initialized Phase 006 planning artifacts"
    next_safe_action: "Restore parent narrative, rebuild advisor, run probes and strict validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "graph-metadata.json"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 006 Advisor Rebuild and Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `070-sk-deep-rename` |
| **Phase** | 006 of 006 |
| **Handoff Criteria** | Advisor probes return top-1 `deep-review` and `deep-research`; active old-name grep returns zero hits; child and parent strict validation exit 0; verdict recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001-005 completed the broad rename from `sk-deep-review`/`sk-deep-research` to `deep-review`/`deep-research`, but Packet 070 still needs final advisor freshness, active-scope audits, and strict validation evidence. The parent narrative also has historical rename-source prose that was over-replaced and now reads as if the source and target names were identical.

### Purpose
Phase 006 closes Packet 070 with final verification evidence and restores the parent documentation so the rename remains searchable by both old and new skill names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create Phase 006 Level 2 artifacts.
- Restore source-side rename narrative in the five user-listed parent/phase metadata files.
- Rebuild the skill advisor graph with the canonical build script.
- Run direct advisor probes for deep review and deep research prompts.
- Run the final active-scope grep audit, excluding historical artifacts.
- Run child and parent strict spec validation.
- Author `implementation-summary.md` with six-phase outcome, residual references, and final verdict.

### Out of Scope
- Renaming additional skills.
- Editing historical changelogs, run outputs, archived specs, or prior phase inventories except for the five explicitly listed narrative files.
- Performing a separate MCP `advisor_rebuild({force: true})`; the orchestrator owns that post-phase guarantee.
- Reworking source rename changes from Phases 002-005 unless verification exposes a blocker.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/006-advisor-and-validate/spec.md` | Create | Phase 006 scope and requirements |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/006-advisor-and-validate/plan.md` | Create | Verification plan |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/006-advisor-and-validate/tasks.md` | Create | Task tracking |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/006-advisor-and-validate/checklist.md` | Create | Verification checklist |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/006-advisor-and-validate/graph-metadata.json` | Create | Phase graph metadata |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/006-advisor-and-validate/implementation-summary.md` | Create | Final phase and packet summary |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/spec.md` | Modify | Restore source-side old names in rename narrative |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/description.json` | Modify | Restore parent description and keywords |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/graph-metadata.json` | Modify | Restore trigger phrases and causal summary |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/resource-map.md` | Modify | Restore source-side old paths and strings |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/002-skill-folder-rename/description.json` | Modify | Restore Phase 002 source-side description |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 006 Level 2 artifacts exist | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `graph-metadata.json` are present before verification |
| REQ-002 | Parent rename narrative preserves source names | Listed parent files describe `sk-deep-review` to `deep-review` and `sk-deep-research` to `deep-research` where the text explains the rename source |
| REQ-003 | Advisor graph is rebuilt | Canonical build script runs and reports completion or a clear blocker |
| REQ-004 | Advisor probes route correctly | Deep review query top-1 is `deep-review`; deep research query top-1 is `deep-research` |
| REQ-005 | Active-scope grep has zero old-name hits | Final grep returns zero active hits after exclusions |
| REQ-006 | Strict validation passes | Child and parent strict validation exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Residual historical references are classified | Implementation summary lists excluded old-name hits and why they are acceptable |
| REQ-008 | Final verdict is explicit | Implementation summary and final output state `READY_FOR_COMMIT` or `REMEDIATION_NEEDED` |
| REQ-009 | Cleanup remains surgical | Git diff for narrative cleanup touches only the five user-listed narrative files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase 006 has complete Level 2 planning artifacts.
- **SC-002**: Parent metadata remains searchable for `sk-deep-review`, `sk-deep-research`, `deep-review`, and `deep-research`.
- **SC-003**: Advisor probe output places the new skill IDs top-1 for both requested prompts.
- **SC-004**: Active-scope grep audit reports zero old-name hits.
- **SC-005**: Child and recursive parent strict validation exit 0.
- **SC-006**: Final verdict is `READY_FOR_COMMIT` unless a verification command exposes a blocker.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Advisor build script may update generated graph artifacts | Medium | Run the canonical script requested by the user and include output evidence |
| Risk | Historical old-name hits may be mixed with active hits | Medium | Count active hits separately from excluded historical/run/changelog contexts |
| Risk | Parent validation can fail due to generated metadata expectations | Medium | Run child validation first, then parent strict validation, and report exact failures if any |
| Dependency | Phases 001-005 completion | High | Use their summaries and parent validation state as input; do not re-run broad replacement |
| Dependency | Python advisor script | High | Use `/usr/bin/python3` and threshold `0.0` as specified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Traceability**: Verification commands and outcomes are captured in tasks, checklist, and implementation summary.
- **Scope Safety**: Narrative cleanup stays confined to the five requested files.
- **Searchability**: Old and new skill names remain present in parent metadata where they describe the rename.
- **Determinism**: All probes use explicit commands with reproducible paths and thresholds.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Historical changelog entries under `changelog/v*` can retain old names because they document the pre-rename world.
- Prior phase discovery artifacts can retain old names because their purpose is to inventory and explain the rename source.
- Run output folders can retain old names as execution history.
- Parent narrative must keep old names only where they describe the source side; target runtime references should stay on `deep-review` and `deep-research`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

| Axis | Rating | Reason |
|------|--------|--------|
| File Count | Medium | Phase docs plus five narrative files |
| Behavioral Risk | Low | Verification and documentation only unless advisor rebuild updates generated data |
| Coordination Risk | Medium | Final phase consumes all earlier phase outputs |
| Verification Risk | Medium | Advisor ranking and grep exclusions must be interpreted carefully |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The spec folder and file scope are pre-approved by the user brief.
<!-- /ANCHOR:questions -->
