---
title: "Feature Specification: Phase 53: Legacy template default detection"
description: "Hundreds of packets scaffolded before phase 052 still carry the core templates' default text, and no check reports them, so a finished packet can describe itself with template instructions and still pass validation."
trigger_phrases:
  - "legacy template default detection"
  - "template default text in finished packets"
  - "open with a hook default"
  - "placeholder warning rule"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 53: Legacy template default detection

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-23 |
| **Branch** | Not created. Branches come from `sk-git` when implementation starts |
| **Parent Spec** | ../spec.md |
| **Phase** | 53 of 53 |
| **Predecessor** | 052-core-template-canonical-markers |
| **Successor** | None |
| **Handoff Criteria** | Validation reports every exact legacy default as a warning without changing any exit code, a recursive run over `specs/` records the baseline counts, and a measured cheap-model sample shows whether a later backfill is viable. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 53** of the system-spec-kit v4 specification. Phase 052 stops new unfilled slots. This phase makes the old ones visible.

**Scope Boundary**: one warning-severity check inside the existing placeholder validation, fed by the retired-default list from phase 052, plus a read-only sample that measures a cheap-model backfill. Rewriting other packets' docs is out of scope.

**Dependencies**:
- Phase 052's retired-default list (its REQ-005).
- `validatePlaceholders` in `runtime/lib/validation/orchestrator.ts`, which this phase extends in place.

**Deliverables**:
- A warning for any line that exactly matches a retired default.
- Baseline counts from a recursive run, recorded in this phase's summary.
- A measured sample of replacement descriptions drafted by `gpt-6-luna` at medium effort, applied to nothing.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Hundreds of packets scaffolded before phase 052 still carry the core templates' default text, and no check reports them, so a finished packet can describe itself with template instructions and still pass validation. On 2026-09-23 the tree held 564 implementation summaries with the "Open with a hook" description, 339 of them in packets marked Complete, plus 151 plans with the default description and 124 summaries with the default opening line. About 1,600 `tasks.md` files carry the tasks template's description, which phase 052 turns into a slot. Phase 052 only protects packets created after it lands.

### Purpose
Every retired default left in a doc is reported by name and line, without failing the packets that carry it today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A warning-severity finding for any doc line that exactly matches a retired default, after whitespace normalization.
- The retired list kept in one place, taken from phase 052's record.
- A recursive baseline run with the counts recorded.
- A read-only feasibility sample: `gpt-6-luna` at medium effort on the normal service tier drafts replacement descriptions for 20 flagged docs, and each draft is graded against its doc.

### Out of Scope
- Rewriting the flagged docs, sampled ones included - they belong to many packets and lanes, and the operator decides on any bulk rewrite after the baseline.
- Failing validation on a legacy default - an error would fail about 900 existing docs at once.
- Fuzzy or partial matching - exact matching is what keeps the check free of false positives.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modify | Legacy-default warning inside the placeholder validation |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | Document the new warning and its severity |
| `.skilled/skills/system-spec-kit/runtime/tests/` | Create | Tests for a match, a near miss and an exit code that does not change |
| `specs/system-speckit/033-system-speckit-v4/053-legacy-template-default-detection/scratch/backfill-sample.md` | Create | The sample, the drafts, a verdict per draft and the totals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A doc line that exactly matches a retired default produces a warning naming the doc and the line number. | A fixture carrying the "Open with a hook" description yields one warning at that line. |
| REQ-002 | The warning never changes the exit code, in default or strict mode. | The same fixture exits 0 with `--strict` and prints `RESULT: PASSED`. |
| REQ-003 | Real prose that resembles a default is not flagged. | A fixture whose description paraphrases a default yields no warning. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Baseline counts are recorded. | This phase's summary lists the count per retired default from a recursive run over `specs/`, beside the 2026-09-23 figures in the problem statement. |
| REQ-005 | `validation-rules.md` documents the warning. | The rule table names it, its severity and what clears it. |
| REQ-006 | A cheap-model backfill is measured before anyone decides on it. `gpt-6-luna` at medium effort, on the normal service tier with no fast flag, drafts a replacement description for 20 flagged docs: 10 `tasks.md`, 5 `plan.md` and 5 `implementation-summary.md` from Complete packets across several tracks. | `scratch/backfill-sample.md` holds each doc path, its draft, a verdict on whether the draft is accurate to the doc, and the total time and tokens. No flagged doc is modified. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An author running strict validation on any packet sees each legacy default it carries, with no change to pass or fail.
- **SC-002**: The baseline and the sample give the operator the size of any later cleanup and whether a cheap model can do it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 052's retired list | High, the check has nothing to match without it | Start only after 052 closes with REQ-005 met |
| Risk | Warning volume drowns out other warnings in recursive runs | Med | One finding per doc and line, and the baseline sets expectations |
| Risk | Older template versions shipped defaults the list misses | Low | Pull earlier defaults from the core templates' git history during Setup |
| Risk | Cheap-model drafts restate the template or invent content | Med | Each draft is graded against its doc, and nothing is applied in this phase |
| Dependency | The cli-codex executor and `gpt-6-luna` access | Low, the sample only informs a later decision | Read `cli-codex/SKILL.md` before composing the dispatch. If the model is unavailable, record that and close without the sample |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None open. Answered by the operator on 2026-09-23:

- Any rewrite of the flagged docs is decided after the baseline, in its own packet with the operator's yes.
- The warning never forces a retroactive fix (REQ-002), and a cheap-model sample measures whether a backfill is viable (REQ-006).
<!-- /ANCHOR:questions -->

---
