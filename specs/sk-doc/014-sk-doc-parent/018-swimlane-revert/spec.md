---
title: "Feature Specification: Revert the swimlane example widening to the original diagram"
description: "Restore the original system_architecture_swimlane geometry (undo the wholesale box-widening) now that the box-width validator counts only box borders; keep it validator-clean with 2 labels + one outlier-box normalization."
trigger_phrases:
  - "swimlane revert"
  - "125 sk-doc phase 018"
  - "flowchart example widening"
  - "system architecture swimlane original"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/018-swimlane-revert"
    last_updated_at: "2026-07-07T11:15:05.809Z"
    last_updated_by: "claude-opus"
    recent_action: "Restored original geometry + re-added 2 labels + normalized 1 outlier box"
    next_safe_action: "Validate and commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-flowchart/assets/flowcharts/system_architecture_swimlane.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: Revert the swimlane example widening to the original diagram

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P3 |
| **Status** | Draft |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | none |
| **Predecessor** | `017-cutover-and-closeout/` |
| **Successor** | `019-create-command-alignment/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system_architecture_swimlane.md` flowchart example was box-widened wholesale (~40 borders) to satisfy the old box-width validator, which counted every horizontal rule — including connectors. That validator was later refined to count only box borders, so the widening is now unnecessary and departs from the author's original diagram.

### Purpose
Restore the original swimlane geometry while keeping the asset validator-clean. The original errors on decision-labels (2 diamonds lack YES/NO labels) and warns on box-width (one 14-char outlier box), so the revert re-adds only the 2 labels and normalizes the single outlier box — deliberately NOT the wholesale widening.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restore the original geometry of the swimlane example from its pre-widening blob.
- Re-add the 2 `[YES]`/`[NO]` decision-branch labels (required by the decision-label check), keeping the fixed-width `│` border aligned.
- Normalize the single 14-char outlier box to 18 so box-width reports "consistent".

### Out of Scope
- Any other flowchart asset or the validator script (already refined).
- The unavoidable nesting/size warnings (would require restructuring the diagram).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/create-flowchart/assets/flowcharts/system_architecture_swimlane.md` | Update | Restore original geometry; +2 labels; normalize 1 outlier box |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The asset is the original geometry, not the widened version | `diff` vs the pre-widening blob shows only the label + outlier-box lines |
| REQ-002 | The asset passes the flowchart validator | `validate_flowchart.sh` exit 0; decision-labels pass; box-width consistent |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Label rows stay visually aligned | The trailing `│` swimlane border stays at its original column on both label lines |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The swimlane matches the original diagram plus exactly the 2 labels and 1 normalized box.
- **SC-002**: `validate_flowchart.sh` exits 0 (nesting/size warnings only, as on HEAD).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Label insertion misaligns the fixed-width swimlane | Ugly example | Keep every edited line at width 49 with `│` at column 49 |
| Dependency | The refined box-width check must be in place | Box-width would still over-count | Already landed in a prior commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The nesting (level 17) and size (384 lines) warnings are inherent to the diagram and out of scope; the asset exits 0 with them, matching HEAD.
<!-- /ANCHOR:questions -->
