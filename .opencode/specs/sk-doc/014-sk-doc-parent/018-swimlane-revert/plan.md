---
title: "Implementation Plan: Revert the swimlane example widening"
description: "Restore the original swimlane blob, re-add the 2 decision labels, normalize the single outlier box, and verify the flowchart validator passes."
trigger_phrases:
  - "swimlane revert plan"
  - "125 sk-doc phase 018 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/018-swimlane-revert"
    last_updated_at: "2026-07-07T11:15:05.809Z"
    last_updated_by: "claude-opus"
    recent_action: "Author phase-018 plan"
    next_safe_action: "Restore blob, edit labels + box, validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Revert the swimlane example widening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | ASCII flowchart markdown asset |
| **Framework** | `create-flowchart/scripts/validate_flowchart.sh` (refined box-width check) |
| **Storage** | In-place edit to one asset file |
| **Testing** | `validate_flowchart.sh` + a diff against the original blob |

### Overview
Restore-then-relabel. Check out the original pre-widening blob, re-add only the 2 decision-branch
labels the diagram needs (the sole non-geometry part of the widening commit), and normalize the single
14-char outlier box to 18 so the refined box-width check reports "consistent" — a 1-box change rather
than the reverted ~40-border widening. Verify exit 0.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The refined box-width check (box borders only) is in place
- [x] The original pre-widening blob is reachable in git history

### Definition of Done
- [ ] Asset == original geometry + 2 labels + 1 normalized box
- [ ] `validate_flowchart.sh` exit 0
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic restore + surgical line edits by line number.

### Key Components
- **Restore**: `git checkout <pre-widening>^ -- <asset>` brings back the original geometry.
- **Relabel**: two fixed-width label rows gain `[YES]`/`[NO]` with the `│` border re-padded to column 49.
- **Normalize**: the one 14-char box border widens to 18 to clear the box-width warning.

### Data Flow
1. Check out the original blob into the working tree.
2. Rewrite lines 118 and 218 to carry the decision labels at constant width.
3. Rewrite the 6 box lines (121-126) to 18-wide borders + repadded interior at constant width.
4. Run `validate_flowchart.sh`; confirm decision-labels pass + box-width consistent + exit 0.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the pre-widening blob is an ancestor of HEAD and resolves
- [ ] Measure the label rows + box widths char-accurately

### Phase 2: Implementation
- [ ] Restore original geometry from the blob
- [ ] Re-add the 2 `[YES]`/`[NO]` labels at constant width
- [ ] Normalize the single 14-char outlier box to 18

### Phase 3: Verification
- [ ] `validate_flowchart.sh` exit 0 (decision-labels pass, box-width consistent)
- [ ] `diff` vs the original blob shows only the label + box lines
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validator | The swimlane asset | `validate_flowchart.sh` |
| Diff-minimality | Change surface | `diff` vs the pre-widening blob |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Refined box-width check | Internal | Green (landed) | Box-width would over-count connectors again |
| Original blob in history | Internal | Green | Cannot restore geometry |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the reverted asset renders wrong or fails the validator.
- **Procedure**:
  1. `git checkout HEAD -- <asset>` restores the widened version.
  2. Re-measure and re-apply the labels/box edit.
  3. Re-run the validator before committing again.
<!-- /ANCHOR:rollback -->
