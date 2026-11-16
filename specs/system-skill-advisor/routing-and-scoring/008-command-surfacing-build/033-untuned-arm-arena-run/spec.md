---
title: "Feature Specification: Phase 33: untuned-arm-arena-run"
description: "Phase 026 built the untuned behaviour arm, but the operator stopped it before scoring, so no session yet shows whether the brief changes what a model does on rows nobody tuned. This phase runs that arm live in fresh arenas at the merged commit on five runtimes, scores it with the committed scorer and logs the verdict."
trigger_phrases:
  - "untuned arm arena run"
  - "phase 33 untuned arm arena run"
  - "behaviour arm live run five runtimes"
  - "untuned arm verdict"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 33: untuned-arm-arena-run

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 33 of 33 |
| **Predecessor** | 032-review-pass-five-remediation |
| **Successor** | None |
| **Handoff Criteria** | The parent goal log holds the arm verdict, the per-runtime rows, the step reader row and the B-5 row, each from a printed line |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 33** of the command surfacing build. It runs the arm phase 026 built and could not finish.

**Scope Boundary**: run, score and log. This phase changes no runner, scorer, row file, advisor code or doc outside its own folder and the parent goal log. A harness fault that needs a code change stops the phase and goes to a new phase.

**Dependencies**:
- The 026 harness and frozen rows (`behaviour-fresh-prompts.jsonl`), unchanged since phase 026
- The pass-five fixes in the runner and arena builder (phase 032)
- Operator decisions Q069 (run the arm in an arena), Q075 (Codex left out) and the option D run size (`026-untuned-behaviour-arm/scratch/decide-run-size/report.txt`)

**Deliverables**:
- Fresh arenas at one commit and their record
- Run logs for five runtimes in this phase's `scratch/runs/`
- `scratch/arm-evidence.txt` and the goal log rows the 026 target names
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The behaviour summary over the tuned 007 rows prints a before and an after start rate on six runtimes, but those rows were tuned while the advisor was built, so they cannot show that the brief helps on prompts nobody saw. Phase 026 built an untuned arm for that question, and the operator stopped it on 2026-11-15 before any scoring. Its kept lines came from arenas built before the pass-five fixes, so they cannot be scored beside new ones.

### Purpose
One scored untuned arm on five runtimes, with a verdict against the target phase 026 fixed before its first session.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ for f in 026-untuned-behaviour-arm/scratch/runs/*.jsonl; do jq -s -c 'group_by(.arm+"-"+(.run|tostring)) | map({k:(.[0].arm+"-"+(.[0].run|tostring)), n:length})' $f; done
claude.jsonl [{"k":"off-1","n":36},{"k":"on-1","n":36}]
devin.jsonl [{"k":"off-1","n":23}]
dsh.jsonl [{"k":"off-1","n":23}]
opencode.jsonl [{"k":"off-1","n":8}]
pi.jsonl [{"k":"off-1","n":12}]
smoke.jsonl [{"k":"off-1","n":5},{"k":"on-1","n":5}]

$ node score-command-transcripts.mjs --summary <007 start set> --json | jq -r -f arms.jq   (at 0c672c3114f)
claude pre start 4 of 12 ... claude post start 4 of 12
codex pre start 1 of 12 ... codex post start 1 of 12
pi pre start 3 of 11 ... pi post start 2 of 10
devin pre start 1 of 8 ... devin post start 3 of 9
opencode pre start 2 of 7 ... opencode post start 2 of 5
dsh pre start 6 of 12 ... dsh post start 9 of 12
(diff against the pass-five rescore: 0 lines for the start, pre and final sets)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the stopped arm's kept lines to `026-untuned-behaviour-arm/scratch/runs/discarded/` and log why
- Build five arenas at the committed HEAD and record the commit, the remote, the status and each runtime's model
- Run one smoke row per runtime and arm, then run 1 of both arms over the 36 fresh rows and run 2 of the 8 decline rows in the `on` arm
- Score with the committed scorer and write `arm-evidence.txt`, the floors and the verdict
- Run the step reader and decide the B-5 trigger as the 026 tasks state

### Out of Scope
- Codex - the operator left it out (Q075), so no Codex arena or session runs
- Any change to the runner, scorer, rows or advisor - a fault goes to a new phase, so the arm measures one commit
- Run 2 for fit and skill-only rows - the option D run size drops it, so each row has one run per arm
- Building `/deep:research` recommendations while the arm runs - they would move the commit under the arm

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `033-untuned-arm-arena-run/scratch/` | Create | Arena record, smoke, run logs, reruns, summary and evidence |
| `026-untuned-behaviour-arm/scratch/runs/` | Move | Kept stopped-arm lines into `discarded/` |
| `../goal.md` | Modify | Rows through the goal log command only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every session runs in an arena with no remote, an empty status and credentials off, and every run line reads `restored: true` |
| REQ-002 | No prompt text is read or printed. Every number in the evidence comes from a committed script |
| REQ-003 | Each runtime's log groups as off-1 36, on-1 36 and on-2 8 by `jq -s 'group_by(.arm + "-" + (.run|tostring)) | map(map(.rowId) | unique | length)'` |
| REQ-004 | The verdict applies the 026 Pre-registered Target, amended by option D, to printed lines only, and nothing is rerun for its result |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The smoke shows `briefDelivered` false off and true on for claude, pi, devin and dsh, and unknown both arms for opencode, before run 1 starts |
| REQ-006 | Each harness fault is rerun once and listed in `reruns.txt`. Total lines stay at or under 440 |
| REQ-007 | The goal log holds the arm verdict, the per-runtime rows, the step reader row and the B-5 row |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c '^\| Arm verdict \| (Met|Not shown) \|' ../goal.md` prints 1, and its numbers match `arm-evidence.txt`
- **SC-002**: `arm-evidence.txt` holds 10 `followed`, at most 5 `paired`, 1 `pooled`, 10 `starts`, 10 `delivery`, 1 `mismatch`, 2 `floor` and 6 `limit: ` lines
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The five CLIs and their model routes (Claude Sonnet 5.5, OpenCode Go DeepSeek flash for OpenCode and Pi, Devin swe-2-max, DSH flash on LLM Gateway) | A quota or auth failure stops a runtime mid-arm | The Monitor filter catches auth, quota, refusal and `spawn_failed`. A stopped pass resumes its remaining rows with `--row-id` |
| Risk | A model writes outside its arena by absolute path | Med | The runner's per-turn refusal and restore. After the run, `git status` in the worktree must be clean apart from this phase's scratch |
| Risk | The arm reads Not shown | Low | Expected as possible by the run-size review. The verdict is logged as is |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: About 2.6 minutes a session, so about 3.5 hours per runtime with the five runtimes run side by side
- **NFR-P02**: At most 440 run lines in all, smoke and reruns included

### Security
- **NFR-S01**: Each turn's environment drops the GitHub tokens, sets an empty credential helper and `GIT_ALLOW_PROTOCOL=file`
- **NFR-S02**: `.skilled/hooks/hook-flags.env` is never read or created. Its existence is checked with `test -e` only

### Reliability
- **NFR-R01**: Each arena reads clean with no remote after every turn, or the runner refuses the next turn
- **NFR-R02**: A delivery contradiction or reader failure is rerun once, never more

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a pass that stops before its first row writes no line, and its rows run again with `--row-id`
- Maximum input: 36 rows x 2 arms + 8 decline rows on five runtimes is 400 lines, plus 10 smoke lines and at most 30 reruns
- Failure path: the arena builder prints `{"ok":false,...}` with a code such as `stale_build` or `source_dirty`, and no session runs until it prints `ok: true`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | No code change. Five arenas, about 400 sessions and one evidence file |
| Risk | 12/25 | Live model sessions on the operator's own CLIs, contained by the arena |
| Research | 6/20 | The design, target and run size are fixed by phase 026 |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The run size follows the option D review, Codex follows Q075, and the target follows phase 026.
<!-- /ANCHOR:questions -->

---
