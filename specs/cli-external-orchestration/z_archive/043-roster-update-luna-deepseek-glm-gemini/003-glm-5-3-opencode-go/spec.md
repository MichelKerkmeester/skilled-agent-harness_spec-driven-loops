---
title: "Feature Specification: GLM 5.3 Documentation for opencode-go (cli-opencode)"
description: "cli-opencode already serves opencode-go/glm-5.3 live, but its catalog documents only DeepSeek Flash and Qwen under that gateway. Documentation-only addition: catalog row + changelog."
trigger_phrases:
  - "glm 5.3 opencode-go"
  - "glm 5.3 phase 003"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/043-roster-update-luna-deepseek-glm-gemini/003-glm-5-3-opencode-go"
    last_updated_at: "2026-08-15T13:00:00Z"
    last_updated_by: "pi"
    recent_action: "Phase complete: glm-5.3 catalog row shipped in the combined 2026-08-14 roster change"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-043-roster-update-luna-deepseek-glm-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: GLM 5.3 Documentation for opencode-go (cli-opencode)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent** | cli-external-orchestration/043-roster-update-luna-deepseek-glm-gemini |
| **Predecessor** | 002-deepseek-v4-max (shipped with this phase in one change) |
| **Successor** | 004-gemini-3-7-flash-high |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-opencode already serves `opencode-go/glm-5.3` live, but its catalog documents only DeepSeek Flash and Qwen under that gateway — the model is dispatchable but invisible to anyone reading the roster.

### Purpose
Document `opencode-go/glm-5.3` in the opencode-go catalog. Documentation-only: cli-opencode has no code-enforced allowlist, so no code change exists for this phase. Id list-verified against the live `opencode models opencode-go` on 2026-08-14.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `providers-and-models.md` (cli-opencode): opencode-go +glm-5.3 row with dated, honest list-verification note.
- cli-opencode changelog v1.4.2.0 + SKILL.md version bump.
- Hub roll-up changelog v1.4.0.0 documenting the three-mode roster expansion (joint with phases 001/002).

### Out of Scope
- Any code change — cli-opencode has no enforced allowlist for opencode-go.
- opencode-go models beyond GLM 5.3 — `glm-5.1`/`glm-5.2` live but not requested.
- `sk-prompt-models` GLM prompt-craft profile — inherits closest persona.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | opencode-go +glm-5.3 row |
| `.opencode/skills/cli-external-orchestration/cli-opencode/changelog/v1.4.2.0.md` | Create | Per-mode changelog |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Version bump |
| `.opencode/skills/cli-external-orchestration/changelog/v1.4.0.0.md` | Create | Hub-level roll-up for the three-mode roster expansion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | GLM 5.3 documented for opencode-go | `providers-and-models.md` lists `opencode-go/glm-5.3` |
| REQ-002 | No fabricated ids | The row names an id present verbatim in a live listing captured 2026-08-14 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Honest verification level | The row states list-verified, not dispatch-tested |
| REQ-004 | Changelogs consistent | cli-opencode changelog + hub roll-up document the row |
| REQ-005 | No stale opencode-go catalog claim | No doc table presents the gateway scope without the glm-5.3 row |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep 'glm-5.3' cli-opencode/references/providers-and-models.md` finds the row.
- **SC-002**: `validate.sh <folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `opencode` CLI installed | Cannot list-verify the id | Confirmed installed 2026-08-14 |
| Risk | Row drifts from the live gateway roster | Doc contradicts reality | Dated list-verification note on the row |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No model is documented that is not present verbatim in a live CLI listing (no-fabrication invariant).

### Reliability
- **NFR-R01**: The catalog row carries the live-verification date and honest verification level (list-verified vs dispatch-tested).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- The opencode-go gateway also fronts `glm-5.1`/`glm-5.2`; the row must not imply they are in scope.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | 3-4 doc files; no code |
| Risk | 4/25 | Docs-only, no enforcement surface |
| Research | 2/20 | Live-listing verification on one CLI |
| **Total** | **10/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
