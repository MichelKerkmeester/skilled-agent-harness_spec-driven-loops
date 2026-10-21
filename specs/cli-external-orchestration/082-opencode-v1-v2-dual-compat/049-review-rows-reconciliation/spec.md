---
title: "Feature Specification: Phase 49: review-rows-reconciliation"
description: "Phase 039's review still marked the 35 findings fixed by phases 040, 041 and 042 as held for the operator, in §3, in §2 Totals and in the §5 rows, and its implementation summary said the same. Four hook files added after the audit had no row at all: git tracks 323 paths and the review held 319."
trigger_phrases:
  - "review rows reconciliation"
  - "phase 49 review rows reconciliation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 49: review-rows-reconciliation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/193-review-rows-reconciliation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 49 of 49 |
| **Predecessor** | 048-skilled-loop-shared-nudge-formatter |
| **Successor** | None |
| **Handoff Criteria** | `scratch/check-review-rows.mjs` exits 0 against the 039 review, §2 matches the rows, and recursive strict validation of this packet passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 49** of the OpenCode v1 and v2 dual compatibility packet. It closes the audit record, not a finding: phases 040, 041 and 042 fixed 039's 35 held findings on main, and the review still described them as waiting on an operator decision.

**Scope Boundary**: `../039-sk-code-opencode-alignment-audit/review.md`, `../039-sk-code-opencode-alignment-audit/implementation-summary.md`, this phase's four docs and two rows in `../spec.md`. The code any finding describes is out of bounds, and so are the six P2 the four new files carry.

**Dependencies**:
- The phase and commit that fixed each finding, as `../040-dispatch-lint-held-fixes/implementation-summary.md`, `../041-goal-held-fixes/implementation-summary.md`, `../042-hooks-and-plugins-held-fixes/implementation-summary.md` and `../048-skilled-loop-shared-nudge-formatter/implementation-summary.md` record them.
- `git ls-files .opencode/plugins .skilled/hooks .opencode/hooks` as the tracked path set the checker compares the rows against.
- The §4 recorded table and the §5 row grammar 039 already uses, which the checker parses for an outcome per finding.

**Deliverables**:
- A §3 named "Held for the Operator, Since Fixed" whose 35 rows carry a "Fixed by" column naming the phase and first fixing commit.
- Four `b14-new-files` rows, with the six P2 they carry recorded in §4 and in `scratch/review-new-files.md`.
- §2 Totals recomputed from the rows, and `scratch/check-review-rows.mjs` proving the path coverage, the open P0/P1 rule and the three counts.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On main, `039-sk-code-opencode-alignment-audit/review.md` still marked the 35 findings fixed by phases 040, 041 and 042 as "held: behaviour change awaiting the operator", in §3, in §2 Totals and in the §5 rows, and 039's implementation summary still said 35 wait on the operator. Four hook files added after the audit had no review row at all: git tracks 323 paths under the two trees and the review held 319.

### Purpose
The audit record says what is true: every held finding names the phase and commit that fixed it, every tracked path has a row, and the totals are the rows' own arithmetic.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 35 held entries in the §5 rows and the §3 table, reworded to name the phase and first fixing commit.
- §2 Totals recomputed from the rows, including the P1 correction from 48 to 47.
- Four `b14-new-files` rows for the hook files added after the audit, with their six P2 recorded in §4.
- 039's implementation summary, whose description, What Was Built, Decisions and continuity block still described the 35 as waiting.
- `scratch/check-review-rows.mjs`, which compares the rows with `git ls-files`, checks the open P0/P1 rule and replays §2 from the rows.

### Out of Scope
- The six P2 on the four new files - this phase changes no code, so they are recorded with their reason and references instead of fixed.
- `b09-hooks-dispatch-R01` P1 - phase 040's round-10 lint residual stays recorded, because fixing it changes what the dispatch lint blocks.
- The code any finding describes - phases 040 to 042 and 048 own it, and their commits are unchanged here.
- The parent packet's other phase statuses - only this phase's map row and the 048 to 049 handoff row change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../039-sk-code-opencode-alignment-audit/review.md` | Modify | The 35 held rows and §3 name the fixing phase and commit, four `b14-new-files` rows join §5, and §2 and §4 are recomputed from the rows |
| `../039-sk-code-opencode-alignment-audit/implementation-summary.md` | Modify | The description, What Was Built, Decisions and continuity block say phases 040 to 042 fixed all 35 |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold with the evidence the checker produced |
| `../spec.md` | Modify | The phase map row for 049 and the 048 to 049 handoff row |
| `../039-sk-code-opencode-alignment-audit/graph-metadata.json` | Modify (re-derived) | Re-derived from the edited 039 summary, so its stored source fingerprint and `causal_summary` match |
| `../graph-metadata.json` | Modify (re-derived) | Re-derived from the edited parent `spec.md` |
| `graph-metadata.json` | Modify (re-derived) | Re-derived from this phase's edited docs |
| `description.json` | Create | This phase's canonical save description |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No §5 finding reads held. Each of the 35 reads "fixed by 040", "041" or "042" with its commits. | The checker reports P0 0 held and P1 0 held, §3 is titled "Held for the Operator, Since Fixed" and carries a "Fixed by" column (`scratch/check-review-rows.txt`). |
| REQ-002 | §2 Totals match the §5 rows. | P0 5 confirmed / 5 fixed, P1 47 / 46 with 1 recorded, P2 211 / 198 with 13 recorded, equal in §2 and in the checker's row counts for all three severities (`scratch/check-review-rows.txt`). |
| REQ-003 | Every tracked path has a row, and no row names a path git does not track. | The checker reports 323 tracked, 323 rows, 0 missing, 0 extra and 0 duplicates (`scratch/check-review-rows.txt`). |
| REQ-004 | No P0 or P1 is open, except one that §4 records with its reason. | The checker reports `open P0/P1 findings: 0` and `P0/P1 recorded with a reason in section 4: 1`, naming `b09-hooks-dispatch-R01` (`scratch/check-review-rows.txt`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | 039's implementation summary carries no stale held wording. | Its description, What Was Built, Decisions and continuity block name phases 040 to 042, and no "wait on the operator" or "need an operator decision" remains in the file. |
| REQ-006 | Recursive strict validation of this packet passes. | `validate.sh ../ --recursive --strict` prints `RESULT: PASSED` - PASSED, 50 of 50 folders. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The audit record and the fixes on main agree, so the 35 rows and 039's summary name the same phases and commits.
- **SC-002**: The record is checkable rather than re-read by hand: the checker exits 0 on path coverage, the open P0/P1 rule and all three total counts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The commit each fix landed in, recorded by the 040, 041, 042 and 048 summaries | High | Each §3 row names the phase and the commit its summary records, so a wrong hash is traceable to one summary rather than to the review |
| Risk | A row names a path git does not track, or a tracked path has no row | Med | The checker builds both sets, `git ls-files` and the §5 path column, and exits non-zero on a missing, extra or duplicated path |
| Risk | §2 drifts from the rows again, as it did with the 48 P1 count | Med | The checker replays all three severities from the finding entries and compares them with §2, so a hand-edited total fails rather than ships |
| Risk | A P1 is recorded without a reason | Med | The checker requires a §4 row whose reason is at least 20 characters for every recorded P0 or P1, and exits non-zero on an open one |
| Risk | The four new files were reviewed by one read-only session with no verifier | Low | That review found no P0 or P1; its six P2 name a rule, a line and a suggested fix, so a later phase can act on each without re-reviewing the file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this phase. The four new files' six P2 stay recorded because this phase changes no code, and `b09-hooks-dispatch-R01` stays recorded because fixing it changes what the dispatch lint blocks. Recursive validation, the push to main and CI trailing it are tracked as tasks, not questions.
<!-- /ANCHOR:questions -->

---
