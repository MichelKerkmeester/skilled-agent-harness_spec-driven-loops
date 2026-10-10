---
title: "Feature Specification: Phase 1: review-canary-pins"
description: "The review mode's rule canary does not pin the AGENTS.md evidence floors the mode applies, and the PR-state dedup reference fails the document validator for want of an overview section."
trigger_phrases:
  - "review canary pins"
  - "phase 1 review canary pins"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: review-canary-pins

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/001-review-canary-pins` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-webflow-labels-and-playbook |
| **Handoff Criteria** | The canary exits 0 with 7 exact-string files, its harness prints 70 PASS lines, and `pr-state-dedup.md` validates |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the round four remediation of the sk-code Ponytail refinement.

**Scope Boundary**: Files under `.skilled/skills/sk-code/sk-code-review/` only. `AGENTS.md` is read, never edited.

**Dependencies**:
- Finding f-iter011-002 item (e) in `../../001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/findings-registry.json`
- The round three exclusion: `../../010-round-three-remediation/002-review-mode/plan.md` decision D8 and its `implementation-summary.md` Known Limitations 1
- The pre-existing `pr-state-dedup.md` validator error recorded in `../../010-round-three-remediation/002-review-mode/plan.md` section 5

**Deliverables**:
- Four AGENTS.md evidence-floor labels pinned in `check-rule-copies.js`, with one harness tamper case
- A numbered overview section in `references/pr-state-dedup.md`
- Version 1.7.1.0 and its changelog entry

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review mode applies four `AGENTS.md` evidence floors (state what is inferred, read a command's output and exit status, treat a finding as a claim, and say what a reading alone cannot show), yet its rule canary pins none of their labels, so a renamed floor goes unnoticed. Round three left this out because pins could fail on routine `AGENTS.md` edits. Separately, `references/pr-state-dedup.md` prints `INVALID` with `missing_required_section: overview` under the sk-doc validator.

### Purpose
A renamed or dropped evidence-floor label fails the canary, and every review-packet doc passes its validator.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pin `**Confirmed vs inferred**`, `**Observed command evidence**`, `**Finding = hypothesis**` and `**Your own read is also one lens**` in `AGENTS.md` through the canary's exact-string set
- Add one harness tamper case that renames a pinned label and expects the canary to fail
- Describe the new pin and case in `scripts/README.md` and update its expected OK line
- Add `## 1. OVERVIEW` above the intro paragraph of `references/pr-state-dedup.md`
- Bump the packet to 1.7.1.0 and add `changelog/v1.7.1.0.md`

### Out of Scope
- Editing `AGENTS.md` or any runtime copy - the canary only reads it
- Pinning `**Baseline before "no regressions"**` - the review mode makes no "no regressions" claim, so it does not apply that floor (plan.md D2)
- Renumbering the other `pr-state-dedup.md` headings - the validator does not require it (plan.md D4)
- Hermes regeneration and any compiled re-mint - orchestrator steps

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Modify | One header comment line and one `AGENTS.md` entry in `EXACT_INVARIANTS` |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Modify | One tamper case for a renamed evidence-floor label |
| `.skilled/skills/sk-code/sk-code-review/scripts/README.md` | Modify | Canary and harness rows name the new pin and case, and the expected OK line reads 7 exact-string files |
| `.skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md` | Modify | `## 1. OVERVIEW` heading above the intro paragraph |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | `version: 1.7.1.0` |
| `.skilled/skills/sk-code/sk-code-review/README.md` | Modify | `version: 1.7.1.0` |
| `.skilled/skills/sk-code/sk-code-review/changelog/v1.7.1.0.md` | Create | Compact changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The canary pins the four evidence-floor labels in `AGENTS.md` | `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0 and its first line reads `7 exact-string file(s)`, and `bash scratch/tamper-all.sh` prints `RESULT: 4 of 4 label renames caught` |
| REQ-002 | A harness tamper case proves a new pin can fail | `check-rule-copies.test.sh` exits 0 with 70 `PASS` lines, including `PASS review_floor_label_drift` and `PASS review_floor_label_drift_output` |
| REQ-003 | `pr-state-dedup.md` passes the document validator with no broken link into it | `validate_document.py` prints `VALID` and `Total issues: 0`, and `rg -n 'pr-state-dedup\.md#' .skilled` prints nothing and exits 1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Version 1.7.1.0 with a changelog entry | `SKILL.md`, `README.md` and `changelog/v1.7.1.0.md` each carry `version: 1.7.1.0`, and the changelog validates as `changelog` with 0 issues and 0 HVR hard blockers |
| REQ-005 | The scripts README describes the new pin and case | `scripts/README.md` validates with 0 issues and names `Finding = hypothesis`, `a renamed evidence-floor label` and `7 exact-string file(s)` |
| REQ-006 | Only the planned files change, and the ripple checks hold | The scope diff shows 6 ` M` rows and 1 `??` row, all in the Files to Change table. The leaf manifest stays fresh, and a stale Hermes or compiled check is recorded for the orchestrator |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Renaming any one of the four pinned labels in a copy of `AGENTS.md` makes the canary exit 1 and name that label
- **SC-002**: Every edited doc gives `VALID` with `Total issues: 0`, and `pr-state-dedup.md` moves from `INVALID` to `VALID`
- **SC-003**: No added prose line in `scripts/README.md`, `pr-state-dedup.md` or the new changelog carries an em dash or a semicolon
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A routine `AGENTS.md` edit renames a pinned label | Low | Only the bold labels are pinned, never the sentences, the same shape as the existing `**Delivery never softens rigor**` anchor (plan.md D1) |
| Dependency | Sibling builds edit `shared/` files the canary reads | Med | A canary failure that names only a `shared/` file is the sibling's and is recorded, not fixed |
| Dependency | Hermes copy and compiled freshness | Low | Changing `SKILL.md` stales the Hermes copy, and the orchestrator regenerates after all builds |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The research names "six" floors without listing them, so plan.md D2 derives the pinned set from what the review packet applies.
<!-- /ANCHOR:questions -->

---
