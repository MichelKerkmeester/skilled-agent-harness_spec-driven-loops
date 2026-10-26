---
title: "Feature Specification: Phase 18: benchmark-redesign-and-remeasure"
description: "The speed loop measured 054 on the same task its templates use as their worked example, with a brief that forced Level 3, three rounds and no saved per-packet grades. This phase rescores the 24 existing packets with deterministic checks, then reruns the loop on a new task no template names, at the level the helper picks, for 5 rounds with blind per-packet grades."
trigger_phrases:
  - "benchmark redesign and remeasure"
  - "phase 18 benchmark redesign and remeasure"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 18: benchmark-redesign-and-remeasure

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
| **Phase** | 18 of 18 |
| **Predecessor** | 017-measured-behavior-and-draft-metadata |
| **Successor** | None |
| **Handoff Criteria** | `scratch/report.md` gives a REAL or INCONCLUSIVE verdict per comparison, each traced to the decision rule in REQ-006 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of packet 054. A read-only insight review on 2026-10-26 (`../015-template-example-neutralization/scratch/insight-review.md`) found that the speed loop's grade gains are confounded and its speed numbers are noise. The operator turned each of its recommendations into a phase, 015 to 018. This phase owns the measurement: it rescores what was already authored, then redesigns and reruns the benchmark once 015 to 017 have changed the templates.

**Scope Boundary**: the speed loop in `../011-authoring-speed-research/scratch/speed-loop/`, its two result folders `20261026T050500Z-67716` and `20261026T140632Z-79914`, and this folder's `scratch/`. No template, card, validator or skill doc changes here; those belong to 015 to 017.

**Dependencies**:
- Phases 015, 016 and 017 Complete, with their changes in this worktree, before the `refined` snapshot is taken and before the final leak scan. The rescore and the loop hardening do not wait for them.
- Operator authorization for the 5-round run, which launches 4 parallel cli-devin dispatches per step in `--permission-mode dangerous` (`loop.sh:34-37`).

**Deliverables**:
- A deterministic rescore script and its table over the 23 uncontaminated packets from the two earlier runs
- A new task with frozen author and upkeep briefs, and a hardened loop that runs it
- A 5-round run on four variants, blind per-packet grades, and an operator summary in `scratch/report.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The recommend-level script prints a 17-line report, so a caller that needs only the level cannot parse the answer. WEAK: The script has issues with output. -->

### Problem Statement
The speed loop tested every variant on "add a quiet flag to recommend-level.sh", which the 054 templates use as their own worked example, so the now054 and refined sandboxes held the answer while pre054 and main-no054 did not; the leak guard `quiet_flag_refs` (`prepare.sh:64`) only counted files naming the packet folder and missed it. The brief also forced `--level 3` (`brief-1.txt:32`) against the card's "Do not raise the level yourself" (`spec-authoring-card.md:38`), called the level line "final" when it is line 2 of 16 (`brief-1.txt:28`), ran 3 rounds where paired spreads reach about 200 s, and saved no per-packet grades, so the operator cannot tell which 054 effects are real.

### Purpose
The operator gets a verdict per variant comparison, REAL or INCONCLUSIVE under one stated rule, from a deterministic rescore of the existing packets plus a 5-round run on a task no template names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--quiet` flag that prints only the recommended-level line. WEAK: Update the script and docs. -->

### In Scope
- Rescore the 24 authored packets from the two earlier runs with deterministic checks, leaving out the one run the loop marked contaminated (run 2, pre054, round 1), so 23 packets are scored.
- Write a new author brief and upkeep brief for a task no template, example or card names, at the level the helper picks.
- Harden the loop: a leak scan over the sandbox templates, examples, card and template guide for the new task's terms, a task switch, an output-token paired verdict, and the committed `SPECKIT_DIST_AUTO_REBUILD=0` switch in `step.sh`.
- Run 5 rounds on pre054, main-no054, now054 and refined, where refined is the tree after phases 015 to 017.
- Grade every valid packet blind, one fresh Opus medium grader per packet, and summarize the result for the operator.

### Out of Scope
- Changes to templates, the card, the validator or skill docs - phases 015 to 017 own them.
- Result folders other than the two named above - the review and the operator named only those two.
- A forced Level 3 run - the operator decided on 2026-10-26 to use the helper's level.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/rescore/rescore.py`, `residue-strings.txt`, `packets.tsv`, `rescore.tsv`, `rescore.md` | Create | Deterministic rescore and its table |
| `scratch/briefs/author-minpct.txt`, `scratch/briefs/upkeep-minpct.txt`, `scratch/briefs/task-terms.txt` | Create | The new task's frozen briefs and leak terms |
| `../011-authoring-speed-research/scratch/speed-loop/lib.sh`, `loop.sh`, `step.sh`, `prepare.sh`, `summarize.py`, `README.md` | Modify | Task switch, leak scan, token verdict, docs; `step.sh` keeps the rebuild switch |
| `scratch/remeasure/`, `scratch/grading/`, `scratch/report.md` | Create | Copied run results, per-packet grades, operator summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With `--quiet`, stdout holds exactly one line that starts with `Recommended Level:`. WEAK: The flag should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `scratch/rescore/rescore.py` scores each of the 23 uncontaminated author packets on four checks and writes one row per packet to `scratch/rescore/rescore.tsv`: the `Verify:` ratio on task lines (the card's two `rg -c` patterns, `spec-authoring-card.md:122`), a count per template residue string from `residue-strings.txt`, each stated output line count against `wc -l` of `recommend-level.sh` run on the input the packet names, and each pointer to a `decision-record.md` the packet folder does not hold |
| REQ-002 | The new task is "Add a `--min-percent <N>` option to `calculate-completeness.sh`": exit 3 when Overall Completion is below N, exit 0 otherwise, output unchanged. No file under `templates/`, the card or `references/templates/` names `calculate-completeness`, `min-percent` or `Overall Completion` in any variant tree, and it differs from the neutral example phase 015 picks |
| REQ-003 | The author brief states the helper call `recommend-level.sh --loc 40 --files 2`, tells the model to use the level it prints and to use `--level 1` when it prints Level 0, uses repository-relative paths only, and holds none of the words "final", "Level 3" or `--level 3` |
| REQ-004 | `prepare.sh` counts files under the sandbox `templates/`, card and `references/templates/` that name any term in `scratch/briefs/task-terms.txt`, writes the count as `task_term_refs` in `ready` and `prep/prep-times.tsv`, and `loop.sh` refuses to dispatch when any sandbox's count is not 0 |
| REQ-005 | One run of `loop.sh --task minpct --variants pre054,main-no054,now054,refined --runs 5 --parallel-ok` completes, and `summary.md` reports output tokens as the primary speed figure with seconds beside them |
| REQ-006 | A comparison is REAL only when at least 4 of the 5 rounds give a valid pair and every valid pair has the same sign on the comparison's metric (`tok_out` for speed, the blind total for quality), and, for a quality claim, the rescore's `Verify:` ratio or residue count moves the same way in the variant means. Every other comparison is INCONCLUSIVE. Seconds are reported and never decide a verdict alone |
| REQ-007 | Each valid packet from the new run gets one fresh Opus medium grader that sees a shuffled neutral label, never the variant, reads the real `calculate-completeness.sh`, and writes its scores to `scratch/grading/<label>.json`; contaminated runs get no grade |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `step.sh` carries `SPECKIT_DIST_AUTO_REBUILD=0` on the dispatch line and that line is committed with this phase |
| REQ-009 | The run's `results.tsv` and `summary.md` are copied to `scratch/remeasure/`, and `scratch/report.md` gives the operator one verdict line per comparison with the rescore and grade figures behind it |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: `recommend-level.sh --quiet --loc 500 --files 15` prints one line and exits 0. WEAK: The feature is successful. -->

- **SC-001**: `awk -F'\t' 'NR>1' scratch/rescore/rescore.tsv | wc -l` prints 23.
- **SC-002**: every sandbox line in `prep/prep-times.tsv` for the new run reads `task_term_refs=0`.
- **SC-003**: the new run's `results.tsv` holds 20 author rows, and `ls scratch/grading/*.json | wc -l` equals its count of valid author rows.
- **SC-004**: `scratch/report.md` holds one REAL or INCONCLUSIVE line per comparison.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A caller parses the level line and breaks when the label changes. Mitigation: keep the label stable and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 015 to 017 Complete in this worktree | The refined variant would measure a half-changed tree | Take the refined snapshot only after all three report Complete; the rescore and loop hardening run first |
| Dependency | LLM Gateway for cli-devin, cli-pi and Opus graders | Steps stall | Loop edits fall back to cli-codex gpt-6-luna; a failed dispatch is a recorded row, not a rerun by hand |
| Risk | Phase 015 picks a neutral example that names `calculate-completeness` | The new task leaks again | T003 scans the final tree; a nonzero count stops the run until the conductor picks another script no template names and records it in `goal.md` |
| Risk | A Level 1 packet hides the Level 2 and 3 sample sections the rescore counts | Residue counts from the new run are not comparable with the old ones | Compare residue within one run only; the rescore of the old packets stands on its own |
| Risk | Spread at n=5 still exceeds the effect | Med | REQ-006 reports INCONCLUSIVE rather than a guessed direction |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The flag adds no measurable time: the same 40 ms run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

- **NFR-P01**: `rescore.py` scores the 23 packets in under 60 seconds, since it runs `recommend-level.sh` once per stated claim.
- **NFR-P02**: each round stays within the loop's 900 second budget (`lib.sh:30`); `round.tsv` flags any round over it.
- **NFR-S01**: no brief or grader prompt carries a credential, and the grader never sees the label map.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: the script exits 2 with usage. Maximum: 10,000 files scores in under one second. WEAK: Handle edge cases. -->
<!-- /ANCHOR:edge-cases -->

- A packet names no input for a stated line count: the row records `UNPARSED` and the conductor reads it by hand.
- A packet with no `tasks.md` task lines: its `Verify:` ratio is `NA`, never 0 or 100.
- A round with an invalid run: that pair drops out; fewer than 4 valid pairs makes the comparison INCONCLUSIVE.
- A grader that does not write its JSON file: the packet is re-graded once by a new grader; a second miss is recorded as `NA`.

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 4/25: one file and 12 lines. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One new script, six loop files edited, briefs and result files |
| Risk | 6/25 | Scratch tooling only; no product code path changes |
| Research | 10/20 | Four variants, 5 rounds, blind grading and a stated decision rule |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does `--quiet` suppress warnings? No, stderr is unchanged. WEAK: Edge cases are unclear. -->

- None. The level question is answered: the operator chose the helper's level on 2026-10-26, which is Level 1 for this task.
<!-- /ANCHOR:questions -->

---
