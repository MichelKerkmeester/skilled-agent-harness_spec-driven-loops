---
title: "Feature Specification: Phase 15: template-example-neutralization"
description: "The template fill notes and the authoring card use the speed benchmark's own task, a quiet flag for recommend-level.sh, as their worked example, so a benchmark run can copy hints about its own answer. This phase rewrites all 87 such lines to one neutral feature, a --keep option for a fictional rotate-logs.sh, and regenerates the golden snapshots."
trigger_phrases:
  - "template example neutralization"
  - "phase 15 template example neutralization"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 15: template-example-neutralization

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
| **Phase** | 15 of 18 |
| **Predecessor** | 014-removed-template-reality-sweep |
| **Successor** | 016-scaffold-filler-section-trim |
| **Handoff Criteria** | The final sweep finds no benchmark-task term in model-read guidance, and `goal.md` names the neutral example phase 018 must not use |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of packet 054. A fresh Opus xhigh review on 2026-10-26 (`scratch/insight-review.md`) found that the 054 templates use the speed benchmark's task as their worked example, which confounds every grade the speed loop produced. The operator turned each of its recommendations into a phase, 015 to 018. This phase is the first: take the task out of the guidance a model reads.

**Scope Boundary**: the fill notes in `templates/core/` and `templates/addons/`, the two worked examples in the authoring card, and the golden snapshot rendered from those templates. Tests, fixtures and docs that run the real `recommend-level.sh` or the real `validate.sh --quiet` stay.

**Dependencies**:
- Phase 014's final tree, so this phase starts from a clean add-on set
- The strict census tools and shard lists from phase 010, as phase 013 used them

**Deliverables**:
- `scratch/example-sweep.md`: the hit table, done during planning
- 87 rewritten lines in 12 files, a regenerated golden snapshot, and before and after guard and census results under `scratch/baseline/`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The recommend-level script prints a 17-line report, so a caller that needs only the level cannot parse the answer. WEAK: The script has issues with output. -->

### Problem Statement
The speed benchmark asks a model to plan a `--quiet` flag for `recommend-level.sh`, and the fill notes the model reads tell that same story: `templates/core/spec.md.tmpl:100` states the 17-line report, `templates/core/tasks.md.tmpl:83` gives the expected counts "prints 1 and 17", and `spec.md.tmpl:318`, `:423` and `:433` answer the benchmark's later upkeep question ("Does `--quiet` suppress warnings? No, stderr is unchanged"). Any grade gain from the 054 templates may come from these hints rather than from better guidance, so the benchmark cannot show that the templates generalize.

### Purpose
Every example a model reads while authoring uses one neutral feature that no benchmark task uses, so a later benchmark measures the guidance and not a leaked answer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--quiet` flag that prints only the recommended-level line. WEAK: Update the script and docs. -->

### In Scope
- Rewrite the 83 fill-note lines in 11 templates that name or retell the benchmark task, keeping each note's GOOD then WEAK shape.
- Rewrite the card's section 6 Step example and section 7 task-line example to the same neutral feature.
- Regenerate the golden snapshot from the edited templates.
- Prove nothing else moved: fill-guidance test, card sync, example drift, Hermes check and the strict census over existing packets.

### Out of Scope
- Tests, fixtures and docs that run the real `recommend-level.sh` or `validate.sh --quiet` - they exercise real tools, listed in `scratch/example-sweep.md`.
- The manual playbook scenario `level-1-packet-authored-from-card.md` and the speed-loop brief - they are test inputs; phase 018 picks the new task.
- Dropping filler sections or changing what a section asks for - phase 016 owns that.
- `templates/examples/level-*` - the sweep found no task term there.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/templates/core/{spec,plan,tasks,implementation-summary}.md.tmpl` | Modify | Rewrite 21, 13, 10 and 6 fill-note lines |
| `.skilled/skills/system-spec-kit/templates/addons/{research,handover,debug-delegation,goal,acceptance-criteria,timeline,decision-record}.md.tmpl` | Modify | Rewrite 17, 4, 4, 3, 2, 2 and 1 fill-note lines |
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Modify | Rewrite the four example lines at 97, 99, 100 and 111 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Regenerate | vitest `-u` after the template edits |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With `--quiet`, stdout holds exactly one line that starts with `Recommended Level:`. WEAK: The flag should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

`G` is the term regex `quiet|recommend-level|17-line|1 and 17|prints 17|Recommended Level|level line|line 510|parseable|report block|skip the report|the default report|Default line count|\bflags?\b|the report|output branch`.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No fill note in `templates/core/` or `templates/addons/` names the benchmark task: `rg -i -e "$G" templates/core templates/addons \| rg 'FILL:' \| wc -l` prints 0 (it prints 63 today) |
| REQ-002 | The card keeps only real tool lines: `rg -n -i -e 'quiet flag' -e 'flag parser' -e 'script\.sh --quiet' spec-authoring-card.md` prints nothing, and `rg -c -i 'quiet\|recommend-level' spec-authoring-card.md` prints 7, the level-helper line and the six `validate.sh --quiet` lines |
| REQ-003 | Every rewritten line uses the one neutral feature from `goal.md` D1 or names no feature, and every fill note keeps one GOOD then one WEAK example: `template-fill-guidance.vitest.ts` prints `24 passed` |
| REQ-004 | The golden snapshot is regenerated: `scaffold-golden-snapshots.vitest.ts` prints `12 passed` without `-u`, and no `FILL:` line in the `.snap` file matches `G` |
| REQ-005 | `check-card-sync.sh` prints `CARD SYNC OK` and `check-example-drift.sh` prints `EXAMPLE_DRIFT_OK` |
| REQ-006 | The strict census over the 4,719 existing folders is unchanged: the sorted before and after files from `strict-census.mjs` diff to nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The Hermes copies stay in sync: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS` |
| REQ-008 | The diff outside `specs/` touches only the 12 files above and the snapshot: `git diff --name-only -- . ':!specs' \| wc -l` prints 13 |
| REQ-009 | `goal.md` records the neutral example and the rule that phase 018's new benchmark task must differ from it |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: `recommend-level.sh --quiet --loc 500 --files 15` prints one line and exits 0. WEAK: The feature is successful. -->

- **SC-001**: The REQ-001 gate prints 0, down from 63, and the card check prints no example line.
- **SC-002**: Every guard and test named in REQ-003 to REQ-007 prints the same pass line it printed in the baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A caller parses the level line and breaks when the label changes. Mitigation: keep the label stable and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 016 edits the same templates | Line numbers in the sweep move if 016 runs first | Run 015 before 016; 016 takes its baselines from 015's final tree |
| Risk | A weak executor changes a marker, an anchor or a WEAK example it was not asked to touch | High | One file per brief with literal old and new text; `git diff --numstat` per file must show equal added and removed counts that match the sweep; the fill-guidance test and a fresh Opus review catch the rest |
| Risk | The neutral example later becomes a benchmark task and leaks again | Med | `goal.md` D2 bars phase 018 from using it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The flag adds no measurable time: the same 40 ms run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: this phase edits template comments and one card, and runs no service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: the script exits 2 with usage. Maximum: 10,000 files scores in under one second. WEAK: Handle edge cases. -->
<!-- /ANCHOR:edge-cases -->

- A WEAK example that names the task, such as "Users want a quiet mode" at `spec.md.tmpl:345`: rewrite it too, keeping it weak.
- A note in a section phase 016 may drop: rewrite it here anyway, so the tree is clean whatever 016 decides.
- The same note repeated at several levels (`spec.md.tmpl:318`, `:423`, `:433`): each copy gets the same new text.
- The card grows past its 260-line limit: the rewrite is line for line, so its 176 lines stay 176.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 4/25: one file and 12 lines. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 87 comment lines in 12 files, plus one regenerated snapshot |
| Risk | 5/25 | No code path changes; fill notes are comments the validator does not read |
| Research | 6/20 | The sweep is done; the census reruns as in phase 013 |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->

- None.
<!-- /ANCHOR:questions -->

---

