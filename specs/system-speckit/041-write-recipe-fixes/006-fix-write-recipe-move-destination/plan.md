---
title: "Implementation Plan: Phase 6: fix-write-recipe-move-destination"
description: "One frozen row replaces the bare move destination and adds a track sentence, applied by the 054 phase 002 exactly-once applier, then checked by evidence, diff, suite and a read-only review."
trigger_phrases:
  - "fix write recipe move destination plan"
  - "known row move destination"
  - "exactly once applier"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: fix-write-recipe-move-destination

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash, Python 3, ripgrep, jq |
| **Framework** | system-spec-kit validator and the 054 row applier |
| **Storage** | JSONL files in this phase's `scratch/` |
| **Testing** | The applier on a copy, each row's evidence command, the spec-kit suite |

### Overview
One scripted text replacement fixes Step 2. The conductor saves the known row, applies it with the 054 phase 002 applier, then sweeps the ledger rows owned by `041-006` and rechecks every evidence command. A read-only frontier review reads the diff before the phase closes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The applier exists at the path in section 6, checked by T001
- [ ] T001 to T003 are done: tool check, start state, known row saved

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED`
- [ ] `git status --porcelain` lists nothing outside this phase folder except the recipe file
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One frozen row, one exactly-once applier, then evidence rechecks.

### Key Components
- **The recipe file**: `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`, Step 2.
- **The applier**: `apply_row.py` reads a JSONL row, refuses unless the locator occurs exactly once, replaces one occurrence and prints `APPLIED <id> <file>`.
- **The conductor**: saves the row, runs the applier, sweeps the ledger, runs the suite and keeps `goal.md` section 4 current.
- **The reviewer**: one read-only `cli-codex` dispatch at close. It writes nothing.

### Known row (frozen)

| Field | Value |
|-------|-------|
| `id` | `K-041-006-01` |
| `file` | `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` |
| `locator` | The text shown below: the destination line, the closing fence, the blank line and the verification gate |
| `expected_text` | The text shown below: the new destination, the closing fence, the sentence and the gate |
| `evidence_cmd` | `grep -cF -- '  <spec-folder>' .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` |
| `evidence_expect` | `1` before the apply, `0` after it |

Old text, copied exactly from the start commit:

````text
  <spec-folder>
```

Verification gate: confirm the final path is under `specs/` or `.opencode/specs/` and matches the packet pointer.
````

New text, to put in its place:

````text
  specs/system-speckit/078-opencode-authoring-recipe
```

The `system-speckit` track in the destination above is an example, so substitute the track you chose in the pre-conditions.

Verification gate: confirm the final path is under `specs/` or `.opencode/specs/` and matches the packet pointer.
````

The locator is four lines because one apply must carry both the destination and the sentence, and the sentence belongs after the code block. `grep -cF -- '  <spec-folder>'` prints exactly `1` on the start commit. The locator occurs exactly once, checked with `python3 -I`.

Do not edit `version:`. The pre-commit `doc-version-bump` gate raises it when the body changes.

### Data Flow
`scratch/known-rows.jsonl`, then `apply_row.py`, then the recipe file, then the evidence recheck, then the diff check, then the suite, then the review, then close.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec-folder-write-recipe.md` Step 2 | The copy-paste move command an author runs | Update one destination line and add one sentence | T004 and T007 |
| Steps 3 to 6 of the same file | Same class of bare `<folder>` placeholder | Unchanged, listed as adjacent | `goal.md` section 4 |
| `references/debugging/troubleshooting.md` line 304 | Same class in a save command | Unchanged, outside this phase | `goal.md` section 4 |
| `specs/system-speckit/078-opencode-authoring-recipe` | The example destination | Not a real packet | The added sentence says the track is an example |

Required inventories:
- Same-class producers: `rg -n '<spec-folder>' .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` prints 1 hit at line 52 before the fix and 0 after it. `rg -n '<folder>|<repo-root>|<track>'` on the same file prints 7 hits at lines 64, 72, 78, 79, 84, 92 and 104 before and after the fix, because those Steps are out of scope.
- Consumers of the recipe: `rg -l 'spec-folder-write-recipe' .skilled --glob '*.md'` prints 7 files, and none of them quotes the Step 2 block.
- Matrix axes: 7 Steps by 1 class, 7 cells. Step 2 is fixed. Steps 1 and 3 to 7 are unchanged.
- Algorithm invariant: the applier replaces exactly one occurrence and refuses 0 or more than 1.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The applier on a copy of the recipe | `python3 -I`, tested at authoring time |
| Integration | Every row's evidence command and the whole-file greps | its own `evidence_cmd` and the T007 greps |
| Manual | The diff against the start commit | read-only `cli-codex` dispatch in T009 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 054 phase 002 `scratch/tools/apply_row.py` | Internal | Checked in T001 | STOP the phase, no mechanical apply |
| 054 phase 001 `ledger.jsonl` | Internal | Checked in T005 | The sweep writes `LEDGER-MISSING` and the phase continues |
| `python3`, `jq` and `rg` on PATH | Internal | Checked in T001 | No apply or check |
| `npm` and the spec-kit suite | Internal | Checked in T002 | No suite gate |
| `cli-codex` with `gpt-6-luna` | External | Checked in T009 | Review recorded as skipped and REQ-006 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any file outside this phase folder other than the recipe changed, or the recipe changed in a line the known row does not name.
- **Procedure**: `git diff --name-only <start commit>` lists the paths. Restore the recipe with `git restore --source=<start commit> -- .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`. Restore any other path the same way. Record the rollback in `goal.md` section 4.
<!-- /ANCHOR:rollback -->


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T003) ──► Apply (T004) ──► Sweep (T005) ──► Recheck (T007) ──► Suite (T008) ──► Review (T009) ──► Close (T010)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Launch preconditions | Apply |
| Apply | Setup | Sweep |
| Sweep | Apply | Diff check, Recheck |
| Recheck | Sweep | Suite |
| Suite | Recheck | Review |
| Review | Suite | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Apply | Low | 5 minutes |
| Sweep and recheck | Low | 15 minutes |
| Suite | Low | 10 to 20 minutes |
| Review and close | Low | 20 minutes |
| **Total** | | **About 1 hour, an assumption with no timed earlier run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Start commit hash recorded in `goal.md` section 4 before the apply
- [ ] `git status --porcelain` saved to `scratch/status-start.txt`
- [ ] No feature flag applies, this phase ships one doc edit

### Rollback Procedure
1. List changed files with `git diff --name-only <start commit>`.
2. Restore the recipe and any other path with `git restore --source=<start commit> -- <file>`.
3. Run `git status --porcelain` and compare with `scratch/status-start.txt`.
4. Record the rollback in `goal.md` section 4.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, nothing persistent is written outside this folder and the recipe
<!-- /ANCHOR:enhanced-rollback -->


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌───────────┐
│  Setup   │────►│  Apply   │────►│  Sweep   │────►│  Recheck  │
└──────────┘     └──────────┘     └──────────┘     └─────┬─────┘
                                                          │
                    ┌──────────┐     ┌──────────┐     ┌────▼─────┐
                    │  Close   │◄────│  Review  │◄────│  Suite   │
                    └──────────┘     └──────────┘     └──────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Launch preconditions | Start commit, known row | Apply |
| Apply | Setup | The fixed Step 2 block | Sweep |
| Sweep | Apply | `scratch/census.txt` | Recheck |
| Recheck | Sweep | `scratch/recheck.txt` | Suite |
| Suite | Recheck | `scratch/suite-end.txt` | Review |
| Review | Suite | `scratch/review/T009.txt` | Close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Apply** - 5 minutes - CRITICAL
2. **Recheck** - 10 minutes - CRITICAL
3. **Review** - 20 minutes - CRITICAL

**Total Critical Path**: about 35 minutes

**Parallel Opportunities**:
- None. Every task reads the previous task's output, and one conductor runs them in ID order.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup done | T001 to T003 marked `[x]` with evidence | Start of phase |
| M2 | Row applied | `scratch/applied.txt` holds `APPLIED K-041-006-01` and the bare line is gone | Mid phase |
| M3 | Evidence clean | T007 prints `bare=0` and 0 `YES` lines | Mid phase |
| M4 | Phase closeable | Every acceptance criterion `Met` | End of phase |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

Written for the executing swarm. Follow each rule as written. Where a rule and your own judgment disagree, follow the rule and record the disagreement in `goal.md` section 4.

### Roles
- **Conductor**: the operator's interactive OpenCode v2 session on DeepSeek V4.1 Flash max. It runs every command, edits only this phase folder and the recipe file, and keeps `goal.md` section 4 current.
- **Worker**: one Task subagent, dispatched with the Task tool only when a task names one. No task in this phase dispatches one, because the only edit is a scripted replacement applied by `apply_row.py`.
- **Reviewer**: one read-only `cli-codex` dispatch at phase close. It writes nothing.

### Pre-Task Checklist
- [ ] Read this phase's `spec.md`, this plan and `tasks.md` before the first command
- [ ] Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` section 3 before T009
- [ ] Confirm the working directory is the build worktree recorded in `../../054-weak-model-spec-authoring/goal.md` section 4, never the main checkout
- [ ] Confirm `python3 -I`, `jq` and `rg` are on PATH
- [ ] Save the reviewer brief to `scratch/briefs/T009.txt` before dispatching it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in ID order. No task in this phase is parallel |
| TASK-SCOPE | The conductor writes only this phase folder and the recipe file |
| TASK-VERIFY | The conductor runs the task's verify command and reads both its output and its exit status before marking the task `[x]` |
| TASK-LOCATE | Find text by its exact content, never by a line number |
| TASK-BANNED | Never run `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js` or `/speckit:save` |
| TASK-NOMODEL | No model edits the recipe. `apply_row.py` is the only writer of that file |

### Reviewer Brief

Every review brief starts with this block, word for word:

```text
GATE 3 IS PRE-RESOLVED. You are a non-interactive read-only reviewer. AI_SESSION_CHILD=1 is set.
You write nothing, so no documentation-scope question applies. Do not edit, create or delete any file.
ROLE: You are a read-only reviewer of a text diff. Your output is checked line by line by a script.
```

### Dispatch Command

```bash
cd "$WORKTREE"
AI_SESSION_CHILD=1 codex exec --model gpt-6-luna -c model_reasoning_effort="high" -c service_tier="fast" \
  -c approval_policy=never --sandbox read-only "$(cat "$PHASE/scratch/briefs/T009.txt")" </dev/null \
  > "$PHASE/scratch/review/T009.txt" 2> "$PHASE/scratch/review/T009.err" &
PID=$!; wait "$PID"; kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
```

`PHASE` is this folder's path and `WORKTREE` is the build worktree. Never kill by a name pattern. Kill only the captured PID.

### Status Reporting Format

```text
[T###] DONE | BLOCKED - one line of evidence
```

Write the line as a row in the progress table of `goal.md` section 4.

### Blocked Task Protocol
1. Restore any file the task changed with `git restore --source=<start commit> -- <file>`.
2. Mark the task `[B]` in `tasks.md` with the failing command and the first line of its output.
3. Re-dispatch the review at most twice with the brief corrected for what failed. After the third failure on the same task, leave it `[B]` and continue with the next task.
4. Stop the phase when two tasks are blocked, and write `STOP` with both task IDs in `goal.md` section 4.
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One row carries the destination and the sentence

**Status**: Accepted

**Context**: The applier does one exact replacement per row, and the sentence must sit after the code block, not inside it.

**Decision**: The locator spans the destination line, the closing fence, the blank line and the verification gate line. The `expected_text` holds the new destination, the fence, the sentence, a blank line and the gate.

**Consequences**:
- One apply is atomic. A partial apply cannot leave a real path with no explanation sentence.
- A second apply fails because the locator is gone.

**Alternatives Rejected**:
- Two rows: the phase freezes one known row, and a partial apply would leave the reader without the sentence.

### ADR-002: Name the example track and explain it

**Status**: Accepted

**Context**: The destination needs a real track name so the reader sees the shape. A bare `<track>` would repeat the defect.

**Decision**: Use `specs/system-speckit/078-opencode-authoring-recipe`. The track is real. The number is free at the start commit. One sentence says the track is an example.

**Consequences**:
- A reader who copies Step 1 and Step 2 gets a coherent path.
- The path is not a real packet at the start commit. It is an example, and the added sentence says so.

**Alternatives Rejected**:
- A second placeholder: that is the defect being fixed.
- An existing packet path: a real packet can move, and the example would rot.

---
