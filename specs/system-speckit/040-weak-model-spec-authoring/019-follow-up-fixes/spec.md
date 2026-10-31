---
title: "Feature Specification: Phase 19: follow-up-fixes"
description: "The manifest check behind recursive-child-manifest.vitest.ts ran a bare git ls-files that hung on fsmonitor for 853 s in a full CLI suite run, and the speed loop dropped main-no054 for rounds 3 to 5 of one run once its sandbox turned dirty. This phase turns fsmonitor off for both git calls in the check and makes the loop rebuild a dirty sandbox before the next round."
trigger_phrases:
  - "follow up fixes"
  - "phase 19 follow up fixes"
  - "manifest check fsmonitor"
  - "speed loop re-prepare dirty sandbox"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: follow-up-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-benchmark-redesign-and-remeasure |
| **Successor** | None |
| **Handoff Criteria** | The manifest vitest file passes, the loop dry run exits 0, and the review's one P1 is fixed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of packet 054. It fixes the two follow-ups the 054 closeout named: a fixture git call that hangs on fsmonitor, and a speed loop that drops a variant for the rest of a run once its sandbox turns dirty.

**Scope Boundary**: `check-goal-file-manifest.sh` in the deep-loop whole-system gate folder, and `loop.sh` plus `README.md` in `../011-authoring-speed-research/scratch/speed-loop/`. No other script, test or template changes.

**Dependencies**:
- `prepare.sh` and `step.sh` in the speed-loop folder, unchanged: the re-prepare calls `prepare.sh` and relies on `step.sh` aborting on a `DIRTY` marker.

**Deliverables**:
- `check-goal-file-manifest.sh` with `-c core.fsmonitor=false` on both git calls and its mode still 100755
- `loop.sh` that re-prepares a dirty sandbox between rounds, and a README section that says so
- `scratch/review.md` with the review verdict and findings

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
`recursive-child-manifest.vitest.ts` runs `check-goal-file-manifest.sh`, whose bare `git ls-files` hung on fsmonitor for 853305 ms in a full CLI suite run (block below); it had timed out batch runs twice earlier the same day and failed in phase 013's suite baseline. Separately, the speed loop marks a sandbox `DIRTY` when a step writes into it and then aborts that variant for every later round, so run `20261026T164410Z-40710` lost main-no054's author step in rounds 3, 4 and 5 after its round 2 author ran vitest in the sandbox, and a 3-round top-up was needed.

### Purpose
The manifest check never waits on fsmonitor, and a dirty sandbox costs the speed loop one round of one variant instead of the rest of the run.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg -n 'recursive-child-manifest' ../017-measured-behavior-and-draft-metadata/scratch/baseline/suite-after-cli.txt
150: ❯ |cli| tests/recursive-child-manifest.vitest.ts (2 tests | 1 failed) 853305ms
226: FAIL  |cli| tests/recursive-child-manifest.vitest.ts > recursive child manifest boundary > checks manifest membership against git and fails closed without git
235: ❯ tests/recursive-child-manifest.vitest.ts:78:28

$ awk -F'\t' '$2=="main-no054"{print $1,$3,$5,$7}' ../011-authoring-speed-research/scratch/speed-loop/results/20261026T164410Z-40710/results.tsv
1 author 0 138
1 upkeep 0 59
2 author 0 121
2 upkeep 0 30
3 author ABORT NA
3 upkeep SKIP NA
4 author ABORT NA
4 upkeep SKIP NA
5 author ABORT NA
5 upkeep SKIP NA
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Pass `-c core.fsmonitor=false` to the `rev-parse` and `ls-files` calls in `check-goal-file-manifest.sh`, with a one-line comment that gives the reason, and keep the file executable.
- Make `loop.sh` run `prepare.sh` before every round after the first for any sandbox marked `DIRTY` or still holding the packet track, outside the timed steps, and keep the rebuild only when its `head=` matches the head recorded at the start of the run and, for a task with a terms file, `task_term_refs=0`.
- Make a dry run plan a round-start re-prepare only for a variant the start-of-run block did not already plan to prepare.
- Make a refused re-prepare final for the rest of the run, so a refused variant is not rebuilt every remaining round.
- Add a "Re-prepare between rounds" section to the speed-loop `README.md`.

### Out of Scope
- Changing `recursive-child-manifest.vitest.ts` or its timeout - the hang is in the script's git call, so a longer timeout would only hide it.
- Cleaning up the half-built directory a failed `prepare.sh` leaves - an optional P2 in `scratch/review.md`; the map never names it, so no step reads it.
- A real (non-dry) speed-loop run - it dispatches paid model runs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh` | Modify | `-c core.fsmonitor=false` on both git calls and one comment line; mode stays 100755 |
| `../011-authoring-speed-research/scratch/speed-loop/loop.sh` | Modify | `ready_field` and `reprepare` helpers, the start-of-run head record, `PREPPED`, `REFUSED`, and one call at the top of the round loop |
| `../011-authoring-speed-research/scratch/speed-loop/README.md` | Modify | "Re-prepare between rounds" section |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both git calls in `check-goal-file-manifest.sh` run with fsmonitor off, and the script still fails closed without git | `rg -c 'core.fsmonitor=false'` on the script prints 2; `SPECKIT_MANIFEST_GIT_BIN=missing-git-command bash <script>` prints `FAIL CLOSED: git is unavailable` and exits 2 |
| REQ-002 | `check-goal-file-manifest.sh` keeps mode 100755 | `git diff` on the script shows an `index ... 100755` line and no `old mode` line |
| REQ-003 | `recursive-child-manifest.vitest.ts` passes | From `.skilled/skills/system-spec-kit`, `npx vitest run --project cli tests/recursive-child-manifest.vitest.ts` prints `Tests  2 passed (2)` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `loop.sh` re-prepares a dirty sandbox before the next round and keeps it only when the head and leak checks pass | `bash -n loop.sh` exits 0, and `rg -n 'PREPPED' loop.sh` shows the dry-run skip; review reports no P0 or P1 in `loop.sh` |
| REQ-005 | A dry run with clean sandboxes plans no prepare and writes no results folder | `loop.sh --task minpct --variants pre054,main-no054 --runs 2 --dry-run --reuse-refined` exits 0, prints `+ reuse sandbox` for both variants and no `prepare.sh` line, and `ls results | wc -l` prints 8 before and after |
| REQ-006 | The README documents the re-prepare | `rg -n 'Re-prepare between rounds' README.md` prints one line |
| REQ-007 | A refused re-prepare is final for the rest of the run | `/bin/bash scratch/test/reprepare-harness.sh` exits 0 and prints nothing for the three refused variants between the round 3 and round 4 markers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `npx vitest run --project cli tests/recursive-child-manifest.vitest.ts` exits 0 with `Tests  2 passed (2)`, against the 853305 ms failure in the baseline.
- **SC-002**: The `loop.sh` dry run exits 0 with 158 lines, reuses both sandboxes and leaves the results folder at 8 entries.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `prepare.sh` rebuilds a sandbox with the same snapshot head for a fixed commit | If the head moved, every re-prepare would refuse | `prep/prep-times.tsv` shows the same head across 3 prepares per variant; a mismatch refuses and marks the sandbox `DIRTY`, so no run mixes two trees |
| Risk | A refused re-prepare could be retried every remaining round | Med: a 50 to 140 s rebuild per round, outside the timed steps | `REFUSED` makes a refusal final; `scratch/test/reprepare-harness.sh` shows round 3 skips every refused variant |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should `reprepare` require `task_term_refs=0` on every task? Decision: only when the task has a terms file, matching the start-of-run leak gate, because the quiet task always records `NA`.
- Should the refusal and orphan-directory P2s be fixed now? Decision: the refusal retry yes, since each retry is a full build; the orphan directory no, it is optional and recorded in `scratch/review.md`.
<!-- /ANCHOR:questions -->

---

