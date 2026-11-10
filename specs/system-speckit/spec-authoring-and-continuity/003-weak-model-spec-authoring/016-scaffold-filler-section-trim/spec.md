---
title: "Feature Specification: Phase 16: scaffold-filler-section-trim"
description: "The core templates scaffold sections and sample rows that a weak model fills with generic text: a role table, deployment rows, a Phase 1.5 diagram, service edge cases and an effort table. This phase trims or empties those sections, makes Fix Completeness optional, settles the card's plan-shape contradiction and fixes two pointers to a decision record that is created only on request."
trigger_phrases:
  - "scaffold filler section trim"
  - "phase 16 scaffold filler section trim"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 16: scaffold-filler-section-trim

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/recommend-level-quiet`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 18 |
| **Predecessor** | 015-template-example-neutralization |
| **Successor** | 017-measured-behavior-and-draft-metadata |
| **Handoff Criteria** | Every acceptance criterion is Met and the strict and rule censuses match their baselines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of packet 054. The insight review of 2026-10-26 (`../015-template-example-neutralization/scratch/insight-review.md:14` and `:38-40`) found that "delete if N/A" notes do not stop a weak model from keeping sample content. Grader 2 counted the sections that held generic or wrong content across 12 benchmark packets (`../015-template-example-neutralization/scratch/evidence-summary.md:28`). The operator approved every recommendation on 2026-10-26 and kept the before-after, roadmap and resource-map add-ons removed.

**Scope Boundary**: the three core templates, the filled examples, the authoring card, the validator's required-anchor tests and the docs that list required sections. No add-on comes back, and no validator rule changes its code.

**Dependencies**:
- Phase 015 runs first. It edits the fill notes of the same three templates, so this phase matches lines by their text, not by the line numbers cited here.
- The census tools in `../010-deep-review-finding-fixes/scratch/tools/` and the shard lists in `../010-deep-review-finding-fixes/scratch/baseline/`.

**Deliverables**:
- A decision for each filler section, applied to the templates and the examples
- Fix Completeness optional at every level, with its tests updated
- Card section 6 matching the plan template's phases note
- Two decision-record pointers that hold whether or not the file exists
- Strict and rule censuses before and after, with an empty sorted diff

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The recommend-level script prints a 17-line report, so a caller that needs only the level cannot parse the answer. WEAK: The script has issues with output. -->

### Problem Statement
The core templates scaffold sample rows that read as finished content: in 12 graded packets the sign-off role table survived 9 times, the enhanced-rollback pre-deployment rows 8 times, the "Phase 1.5 (Config)" diagram 6 times, the "External service failure / Network timeout" rows 6 times and "Tests passing (if applicable)" 4 times. A weak model keeps that text instead of writing the packet's own, and two template lines point at a `decision-record.md` the packet usually does not have.

### Purpose
A scaffolded packet carries only sections a model must answer with packet facts, and every pointer it holds names a file that exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--quiet` flag that prints only the recommended-level line. WEAK: Update the script and docs. -->

### In Scope
- Remove, empty or keep each of the six filler sections, as section 4 decides, in the templates and the filled examples.
- Make the Fix Completeness section optional at every level and update the tests that pin the required set.
- Drop the `### Step` requirement from card section 6 so the card and `plan.md.tmpl` give one plan shape.
- Rewrite the two decision-record pointers so they hold when no `decision-record.md` exists.
- Prove with the strict and rule censuses that no existing packet changes verdict.

### Out of Scope
- The before-after, roadmap and resource-map add-ons - the operator keeps them removed.
- The task-specific worked examples in fill notes - phase 015 owns them.
- The Measured behavior block and draft metadata repair - phase 017 owns them.
- Any change to a validator rule's code - the required set follows the template's H2 prefixes, so a header change is enough.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl` | Modify | Replace the DoD test line, empty the phase-deps sample, drop the effort and enhanced-rollback sections |
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` | Modify | Replace the generic edge-case rows, rewrite the decision-record pointer |
| `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` | Modify | Empty the sign-off rows, make Fix Completeness optional, rewrite CHK-100 |
| `.skilled/skills/system-spec-kit/templates/examples/level-{2,3,3+}/*.md` | Modify | Match the template sections, so the example-drift guard passes |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modify | Drop the Step requirement in section 6 and the plan-step bullet in section 11 |
| `.skilled/skills/system-spec-kit/references/validation/template-compliance-contract.md` | Modify | Mark `fix-completeness` optional and drop the removed plan anchors |
| `.skilled/skills/system-spec-kit/runtime/tests/validation-optional-anchors.vitest.ts`, `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modify | Add the Fix Completeness case and regenerate the snapshots |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With `--quiet`, stdout holds exactly one line that starts with `Recommended Level:`. WEAK: The flag should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The census rule from phase 013 holds: `strict-census.mjs` and `rule-census.mjs` over the 010 shard lists, run before the first template edit and after the last, give sorted outputs whose `diff` prints nothing. A row that moves halts the phase for an operator decision. |
| REQ-002 | A Level 2 scaffold holds no "Phase 1.5", "Feature flag configured", "External service failure", "Network timeout" or "Tests passing (if applicable)" text: `rg -c` for each over a fresh `create.sh --level 2` packet prints nothing. |
| REQ-003 | Fix Completeness is optional at every level: a Level 2 packet with the `fix-completeness` block removed passes `ANCHORS_VALID`, and `required-template-anchors.vitest.ts` passes. |
| REQ-004 | The scaffold guards pass from the final tree: `template-fill-guidance.vitest.ts` and `scaffold-golden-snapshots.vitest.ts` pass after the snapshots are regenerated, `check-card-sync.sh` prints `CARD SYNC OK` and `check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Card section 6 no longer asks for `### Step` blocks, and it names the same plan shape as the `plan.md.tmpl` phases fill note: `rg -n '### Step' .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` prints nothing. |
| REQ-006 | No core template points at `decision-record.md` as a file that always exists: every line `rg -n 'decision-record' .skilled/skills/system-spec-kit/templates/core/` prints also says "when the packet has one". Today it prints `spec.md.tmpl:450` and `tasks.md.tmpl:232`, neither conditional. |
| REQ-007 | The Level 3 and 3+ sign-off section stays, with one empty approver row in place of the three named roles. |
| REQ-008 | The Hermes copies match their sources: `sync-skills-hermes.cjs --check` prints `PASS`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: `recommend-level.sh --quiet --loc 500 --files 15` prints one line and exits 0. WEAK: The feature is successful. -->

- **SC-001**: The sorted strict-census and rule-census diffs, before against after, print nothing.
- **SC-002**: A fresh Level 2 scaffold holds none of the five filler strings in REQ-002.
- **SC-003**: The two vitest files, `check-card-sync.sh`, `check-example-drift.sh` and the Hermes check all pass from the final tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A caller parses the level line and breaks when the label changes. Mitigation: keep the label stable and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 015 edits the fill notes of the same three templates | Line numbers in this spec shift, and two edits can collide | Start after 015's edits are final; each brief matches by text; take the census baseline after 015 lands |
| Risk | A packet that kept `## Fix Completeness` or an `effort` section changes verdict once the template changes | High | REQ-001 census. A trial on 2026-10-26 added an `L2:` anchor the template lacks to a copy of fixture `053-template-compliant-level2`; the only new error was the graph-metadata fingerprint, so no extra-anchor rule fired. If the census still moves a row, add the anchor to `CUSTOM_ALLOWED_ANCHORS` in `runtime/cli/utils/template-structure.js` |
| Risk | Renaming the Fix Completeness header breaks a header-match rule for every existing packet that carries the old header | Med | The census shows it. Fallback: keep `## Fix Completeness` and add the anchor to the optional set in both twins, `orchestrator.ts:648` and `template-structure.js:20`, which the parity test pins together |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The flag adds no measurable time: the same 40 ms run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: this phase edits templates, docs and tests, and runs no service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: the script exits 2 with usage. Maximum: 10,000 files scores in under one second. WEAK: Handle edge cases. -->
<!-- /ANCHOR:edge-cases -->

- Empty input: a packet that deleted an optional section entirely still passes, as `validation-optional-anchors.vitest.ts` already proves for `phase-deps`, `effort` and `enhanced-rollback`.
- Maximum input: the census covers all 4,757 folders in the four shard lists under `scratch/baseline/`.
- Failure path: a census row that changes verdict stops the phase; the conductor records it in `goal.md` and asks the operator.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 4/25: one file and 12 lines. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Three templates, the examples, the card, one reference doc and two tests |
| Risk | 12/25 | Every new packet's scaffold and the required-anchor set change; the censuses guard them |
| Research | 5/20 | The evidence and the grader counts already exist |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->

- None.
<!-- /ANCHOR:questions -->

---

