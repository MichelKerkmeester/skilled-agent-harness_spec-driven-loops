---
title: "Implementation Plan: Phase 18: benchmark-redesign-and-remeasure"
description: "A deterministic script rescores the 23 uncontaminated packets from the two earlier speed-loop runs. The loop then gains a task switch, a leak scan and a token verdict, runs a new Level 1 task for 5 rounds on four variants, and a fresh Opus medium grader scores each packet blind."
trigger_phrases:
  - "benchmark redesign and remeasure plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 18: benchmark-redesign-and-remeasure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one output branch. Prove it with a line count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and Python 3 scratch tooling |
| **Framework** | The speed loop in `../011-authoring-speed-research/scratch/speed-loop/` |
| **Storage** | TSV and JSON files under this folder's `scratch/` and the loop's `results/` |
| **Testing** | `loop.sh --dry-run`, `bash -n` on each edited script, the rescore row count and `validate.sh --strict` |

### Overview
First, `scratch/rescore/rescore.py` rescores the 23 uncontaminated author packets from runs `20261026T050500Z-67716` and `20261026T140632Z-79914` with four deterministic checks, with no new dispatch. Next, DeepSeek V4.1 Flash max through cli-pi edits the loop so it can run a second task, refuses a sandbox whose templates, examples or card name that task, and gives a paired verdict on output tokens; a fresh Opus medium agent reviews that diff. Once phases 015 to 017 are Complete, the loop runs the new task for 5 rounds on pre054, main-no054, now054 and refined, a fresh Opus medium grader scores each valid packet blind, and `scratch/report.md` applies the decision rule from spec REQ-006.

The benchmark subject stays cli-devin `deepseek-v4-1-flash-1017-max` (`lib.sh:22`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `rg -n 'quiet' recommend-level.sh` prints the new branch before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] `rg -c 'SPECKIT_DIST_AUTO_REBUILD=0' ../011-authoring-speed-research/scratch/speed-loop/step.sh` prints 1
- [x] Phases 015, 016 and 017 each have `spec.md` Status Complete before the 5-round run starts (017 was closing on its suite result only when the run started; recorded as a deviation in `tasks.md` CHK-002)

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is Met
- [x] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `recommend-level.sh`. WEAK: Standard architecture. -->

### Pattern
Rescore, harden, remeasure. Old evidence is rescored first, the loop is fixed second, new evidence is collected last.

### Key Components
- **`rescore.py`**: reads author packets from named result folders and prints one TSV row per packet: `Verify:` ratio, one count per residue string, stated line-count claims against the real command, and dangling `decision-record.md` pointers.
- **The task switch**: `loop.sh --task quiet|minpct` picks the brief, upkeep brief, packet name, document list and upkeep check; `quiet` keeps today's behavior.
- **The leak scan**: `prepare.sh` counts sandbox files under `templates/`, the card and `references/templates/` that name a term from `scratch/briefs/task-terms.txt`.
- **The token verdict**: `summarize.py` prints a paired verdict on `tok_out` beside the seconds verdict, using the REQ-006 rule.
- **The blind grader**: one fresh Opus medium agent per packet, given only a neutral label, the packet and the real script.

### Data Flow
The two old `results.tsv` files and their `author-packet/` folders feed `rescore.py`. The new run writes `results/<stamp>/` under the loop; the conductor copies `results.tsv` and `summary.md` to `scratch/remeasure/`, shuffles labels into `scratch/grading/label-map.tsv`, collects one JSON per packet, unblinds, runs `rescore.py` on the new packets and writes `scratch/report.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `recommend-level.sh`: owns the output. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib.sh` | Fixes `PK`, `AUTHOR_BRIEF` and `HINTS` to the quiet task (`lib.sh:17-24`) | update: select by task | `loop.sh --task minpct --dry-run` prints the new packet path |
| `step.sh` | Hardcodes `001-recommend-level-quiet-flag` and `acceptance-criteria.md` (`step.sh:92`, `:105-106`, `:128-129`); carries the rebuild switch (`step.sh:62`) | update: read packet and docs from the task | `bash -n step.sh` exits 0; `rg -c 'SPECKIT_DIST_AUTO_REBUILD=0'` prints 1 |
| `prepare.sh` | `quiet_flag_refs` counts only files naming the packet folder (`prepare.sh:64`) | update: add `task_term_refs` | `rg -n task_term_refs prepare.sh loop.sh` prints both |
| `summarize.py` | Paired verdict on seconds only (`summarize.py:145-151`) | update: add a `tok_out` verdict | The run 2 `results.tsv` renders a `tok_out` verdict column |
| `audit.py` | Contamination patterns name the old benchmark folders | unchanged | Patterns are task-neutral; `refs_054` still applies |
| The two old result folders | Evidence | not a consumer; read only | `rescore.py` opens them read-only |

Same-class inventory: `rg -n 'recommend-level-quiet-flag|hints-l3|acceptance-criteria' ../011-authoring-speed-research/scratch/speed-loop/` lists every task-specific line before the edit.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads the current output. Implementation adds the branch. Verification counts lines. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup fixes the inputs, Implementation rescores, hardens the loop and runs the benchmark, and Verification grades, reports and validates.

### Step 1: Rescore the existing packets

Acceptance: `rescore.tsv` holds one row per uncontaminated author packet, with no row for run 2 pre054 round 1.
Verify: `awk -F'\t' 'NR>1' scratch/rescore/rescore.tsv | wc -l` prints 23.

### Step 2: Harden the loop for the new task

Acceptance: the loop runs either task, refuses a sandbox that names the new task's terms, and prints a token verdict.
Verify: `bash ../011-authoring-speed-research/scratch/speed-loop/loop.sh --task minpct --variants pre054,main-no054,now054,refined --runs 5 --dry-run` exits 0 and prints `001-completeness-min-percent`.

### Step 3: Run 5 rounds on four variants

Acceptance: every sandbox reports `task_term_refs=0` and the run holds 20 author rows.
Verify: `awk -F'\t' 'NR>1 && $3=="author"' scratch/remeasure/results.tsv | wc -l` prints 20.

### Step 4: Grade blind and report

Acceptance: every valid packet has one grade file and the report gives one verdict per comparison under the REQ-006 rule.
Verify: `rg -c 'REAL|INCONCLUSIVE' scratch/report.md` prints at least 6.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `--quiet` prints 1 line. The default prints 17. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Each edited loop script | `bash -n` on `lib.sh`, `loop.sh`, `step.sh`, `prepare.sh`; `python3 -m py_compile` on `summarize.py` and `rescore.py`; each exits 0 |
| Dry run | The task switch | `loop.sh --task minpct ... --dry-run` exits 0; `loop.sh --task quiet ... --dry-run` still prints `001-recommend-level-quiet-flag` |
| Known answer | The rescore | The run 1 now054 r1 packet scores a `Verify:` ratio of 1.0 and the run 1 pre054 r1 packet scores 0, as the review reported (`insight-review.md:9`) |
| Leak | The new task's terms | `prepare.sh` writes `task_term_refs=0` for all four sandboxes |
| Review | Loop diff and report | A fresh Opus medium agent reads each and records a verdict line |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 015, 016 and 017 Complete | Internal | Yellow | The refined snapshot and the final leak scan wait; Steps 1 and 2 go ahead |
| cli-devin `deepseek-v4-1-flash-1017-max` | External | Green | The run cannot start |
| DeepSeek V4.1 Flash max through cli-pi | External | Green | Loop edits move to cli-codex `gpt-6-luna` |
| Fresh Opus medium agents | External | Green | Grading and review wait |
| Operator go-ahead for `--parallel-ok` and for the commit | Internal | Yellow | The run and the commit wait |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: the default output changes. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: `loop.sh --task quiet --dry-run` no longer prints the old packet path, or a loop edit breaks a dry run.
- **Procedure**: revert this phase's loop commit with `git revert`; result folders and `scratch/` files are new and need no reversal.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (inputs) ──► Rescore + loop hardening ──► [015-017 Complete] ──► 5-round run ──► Grading, report, validate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation: rescore, loop hardening | Setup | The run |
| Implementation: 5-round run | Loop hardening, phases 015 to 017 Complete, operator go-ahead | Verification |
| Verification | The run | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
<!-- FILL: Give each phase an estimate and a total. Mark the total as an assumption. Write `N/A` with one reason, or delete the whole section. GOOD: Setup 10 minutes, implementation 30, verification 10. Total 50 minutes. WEAK: A few hours. -->

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Med | 60 minutes for the rescore and loop edits, plus 45 to 75 minutes for 5 rounds at 9 to 15 minutes each |
| Verification | Med | 60 minutes, graders run in parallel |
| **Total** | | **About 3.5 to 4 hours (assumption)** |
<!-- /ANCHOR:effort -->

---
