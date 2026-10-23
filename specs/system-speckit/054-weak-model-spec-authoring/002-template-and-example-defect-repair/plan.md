---
title: "Implementation Plan: Phase 2: template-and-example-defect-repair"
description: "A tested script applies the 25 known text swaps and every other owner 002 ledger row. A DeepSeek worker handles only rows whose text drifted. A suite comparison and a read-only frontier review close the phase."
trigger_phrases:
  - "template and example defect repair plan"
  - "exact match row applier"
  - "known rows K-01 to K-25"
  - "dead hash file deletion guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: template-and-example-defect-repair

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown targets, Bash, Python 3 standard library only, ripgrep, jq |
| **Framework** | system-spec-kit validator and its vitest suite |
| **Storage** | JSONL and text files in this phase's `scratch/` |
| **Testing** | The applier self-test, a per-row evidence recheck and a before and after suite comparison |

### Overview
Twenty-five text swaps are known now, so they are written out in `tasks.md` and applied by `apply_row.py`, which refuses unless the old text occurs exactly once. The ledger from phase 1 may hold more owner `002` rows. The conductor applies those with the same script and sends only the rows whose text drifted to a DeepSeek worker, one file per worker. The phase closes on a clean suite comparison and a read-only frontier review of the diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The launch preconditions in `../spec.md` section 3 are recorded as met in `../goal.md` section 4
- [ ] Phase 1 closed: `ledger.jsonl` exists and was reviewed, and `suite-start.txt` exists
- [ ] `tasks.md` T001 to T005 are done: phase 1 check, tools check, start commit, known rows saved, applier tested

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED`
- [ ] `tasks.md` T014 printed `SUITE_MATCH`
- [ ] `tasks.md` T013 printed `0` changed paths that no row explains
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A deterministic apply loop with a worker fallback. A script does every exact swap. A model touches a file only when a row cannot be applied as a swap.

### Key Components
- **`known-rows.jsonl`**: the 25 rows written in `tasks.md` T004.
- **`apply_row.py`**: the exact-match applier, written in `tasks.md` T005.
- **`lib.sh`**: three helper functions, `repro`, `apply_checked` and `make_brief`, written in `tasks.md` T005.
- **Phase 1 `ledger.jsonl`**: the source of the census rows. This phase reads only the rows whose `owner_phase` is `002`.
- **Conductor**: runs every task, reads every output and edits only this phase folder.
- **Worker**: one DeepSeek dispatch for one drifted row. It edits the one file its brief names.
- **Reviewer**: one read-only `cli-codex` review at phase close.

### Known-row schema (frozen)

One JSON object per line. All four fields are strings.

| Field | Meaning |
|-------|---------|
| `id` | `K-01` to `K-25` |
| `file` | Repository-relative path of the file to change |
| `locator` | The full current line, which occurs exactly once in `file` |
| `expected_text` | The full replacement line |

The ledger from phase 1 uses ten fields and `apply_row.py` reads only `id`, `file`, `locator` and `expected_text` from either file.

### The 25 known rows

| Rows | File | Change |
|------|------|--------|
| K-01 to K-04 | `templates/examples/level-1/` implementation-summary, plan, spec, tasks | Replace the leaked `description:` line with a full sentence |
| K-05 to K-08 | `templates/examples/level-2/` implementation-summary, plan, spec, tasks | Same |
| K-09 to K-13 | `templates/examples/level-3/` decision-record, implementation-summary, plan, spec, tasks | Same |
| K-14 to K-18 | `templates/examples/level-3+/` decision-record, implementation-summary, plan, spec, tasks | Same |
| K-19 to K-21 | `templates/examples/` tasks.md of level-2, level-3 and level-3+ | `- [x] Checklist.md fully verified` becomes `- [x] Verification checklist in tasks.md fully verified` |
| K-22 and K-23 | `references/workflows/spec-folder-authoring-checklist.md` | Replace the bare `<spec-folder>` with the Level 1 packet `specs/system-speckit/041-write-recipe-fixes/001-fix-write-recipe-backfill-flag` |
| K-24 and K-25 | `references/templates/template-style-guide.md` | Heading `### Why Bulleted Lists` becomes `### Why a Table`, and the manual check row says `Table with Field and Value columns` |

The three example `acceptance-criteria.md` files already have a correct description, so they have no row. The path in K-22 and K-23 was read in the tree: that packet exists and its `spec.md` carries `SPECKIT_LEVEL: 1`.

### Census result codes

`census.txt` holds one line per owner `002` ledger row. The first word is the result.

| Code | Meaning | Next step |
|------|---------|-----------|
| `APPLIED` | The swap ran, the row's evidence no longer reproduces and no other path changed | None |
| `SKIP-GONE` | The defect did not reproduce, so a known row or an earlier row fixed it | None |
| `SKIP-OWNED` | The row's `expected_text` is `OWNED BY PHASE` | None, a later phase rewrites the area |
| `DELETE-PENDING` | The row's `expected_text` is `DELETE FILE` and the file exists | `tasks.md` T011 |
| `NEEDS-WORKER` | The locator did not occur exactly once, or the swap did not clear the evidence | `tasks.md` T010 |
| `OUT-OF-SCOPE` | The swap changed a path the row does not name | Restore the path and block the task |

### Data Flow
`known-rows.jsonl` and the owner `002` ledger rows go through `apply_row.py`. Each application is followed by a changed-path check and an evidence recheck. Rows that cannot be applied go to a worker. The diff then goes through the scope check, the suite comparison and the frontier review.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 18 example docs under `templates/examples/level-*` | Filled examples a model imitates | update the `description:` line | `tasks.md` T007 prints `18 1` |
| 3 example `tasks.md` files | Same | update one checklist line | `tasks.md` T012 prints `0` for `K-LEFT` |
| `references/workflows/spec-folder-authoring-checklist.md` | Pre-checks a model follows before authoring | update two lines | `rg -c '<spec-folder>' <file>` prints nothing |
| `references/templates/template-style-guide.md` | Formatting rules | update a heading and a table row | `rg -n -e 'Why Bulleted' -e 'Bulleted list format used' <file>` prints nothing |
| `templates/.hashes` | Hash list for four files, three of which are not there | delete | the T008 guards print `rc=1` twice, then `test ! -e` succeeds |
| `references/workflows/spec-folder-write-recipe.md` | Write recipe with a bare `<spec-folder>` | unchanged, owned by the 041 write-recipe child | not a consumer of this phase |
| `runtime/cli/tests/workflow-invariance.vitest.ts` | Bans four words under `templates/` | unchanged, a consumer of the new text | `tasks.md` T007 third command prints `0` |
| `runtime/data/trigger-index.json` | Trigger index | unchanged, it does not index the example docs | `rg -c 'authentication feature' <file>` prints nothing |

Required inventories:
- Same-class producers: the leaked-description search from the phase 1 detection table, run over all of `.skilled/skills/system-spec-kit/templates`, found 15 lines, all under `templates/examples`. The other 3 of the 18 are found by the exact-line check in `tasks.md` T007.
- Consumers of changed symbols: nothing parses the example descriptions or the style guide heading. `rg -n --glob '*.md' --glob '!**/scratch/**' 'Why Bulleted' .skilled specs` found the style guide and four packet docs in `specs/` that quote the heading as a defect, and no other doc outside `specs/`. Nothing reads `templates/.hashes`: `rg -l --hidden '\.hashes' .skilled` and the same search over the repository root found nothing outside `specs/`.
- Matrix axes: four level folders by the doc kinds each holds make 18 description cells, 4 for level 1, 4 for level 2, 5 for level 3 and 5 for level 3+.
- Algorithm invariant: `apply_row.py` replaces text only when the locator occurs exactly once, so a second apply fails instead of editing twice.
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
| Unit | `apply_row.py` applies once and refuses the second time | self-test in `tasks.md` T005 |
| Integration | All 25 known rows and every owner `002` ledger row no longer reproduce | `tasks.md` T006, T007 and T012 |
| Regression | The spec-kit suite result equals the phase 1 start | `tasks.md` T014 |
| Manual | Frontier review of the diff | read-only `cli-codex` dispatch in `tasks.md` T015 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 `ledger.jsonl`, reviewed | Internal | Checked in T001 | Known rows still run but census rows do not, so the phase cannot close |
| Phase 1 `suite-start.txt` | Internal | Checked in T001 | The suite comparison cannot run |
| `python3` 3.9 or newer, `jq`, `rg`, `node` | Internal | Checked in T002 | No row can be applied |
| `opencode2` with `llmgateway/deepseek-v4.1-flash-1017` | External | Checked in T010, only when a row needs a worker | Drifted rows stay open |
| `codex` with `gpt-6-luna` | External | Checked in T015 | Review is recorded as skipped with the error, and REQ-007 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a path changed that no row explains. Or the suite comparison printed `SUITE_DIFF` twice. Or the frontier review raised a P0 that cannot be fixed.
- **Procedure**: before the commit, `git diff --name-only` lists the changed paths. Restore each with `git restore --source=<phase start commit> -- <path>`. That also brings back `templates/.hashes`. After the commit, run `git revert --no-edit <phase commit>`, which adds a new commit and rewrites nothing.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T005) ──► Known rows (T006-T007) ──► Dead file (T008) ──► Census rows (T009-T011)
                                                                          │
                                  Recheck (T012) ──► Scope (T013) ──► Suite (T014) ──► Review (T015-T016) ──► Close (T017)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 1 closed | Everything |
| Known rows | Setup | Dead file, Census rows |
| Dead file | Known rows | Census rows |
| Census rows | Dead file, phase 1 ledger | Recheck |
| Recheck and scope | Census rows | Suite |
| Suite | Recheck and scope | Review |
| Review and close | Suite | Phase 3 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Known rows and dead file | Low | 15 minutes, a script does the work |
| Census rows | Low to Med | 15 minutes with no worker, plus about 10 minutes per drifted row |
| Suite and review | Med | 30 to 60 minutes, the suite run is the longest step |
| **Total** | | **1 to 2 hours, an assumption with no timed earlier run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase start commit hash recorded in `goal.md` section 4 before the first row is applied
- [ ] `git status --porcelain` saved to `scratch/status-start.txt`
- [ ] No feature flag applies, the changed files are documentation

### Rollback Procedure
1. List changed files with `git diff --name-only`.
2. Restore each one with `git restore --source=<phase start commit> -- <path>`.
3. Run `git status --porcelain` and compare it with `scratch/status-start.txt`.
4. Record the rollback in `goal.md` section 4.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the phase edits text files and deletes one file that git restores
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐     ┌─────────────┐     ┌────────────┐     ┌─────────────┐
│  Setup   │────►│ Known rows  │────►│ Dead file  │────►│ Census rows │
└──────────┘     └─────────────┘     └────────────┘     └──────┬──────┘
                                                               │
┌──────────┐     ┌─────────────┐     ┌────────────┐     ┌──────▼──────┐
│  Close   │◄────│   Review    │◄────│   Suite    │◄────│   Recheck   │
└──────────┘     └─────────────┘     └────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Phase 1 outputs | Start commit, saved rows, tested applier | Known rows |
| Known rows | Setup | 20 changed files, `applied.txt` | Dead file |
| Dead file | Known rows | Deleted `.hashes` | Census rows |
| Census rows | Dead file | `census.txt`, more changed files | Recheck |
| Recheck | Census rows | `recheck.txt`, scope lists | Suite |
| Suite | Recheck | `suite-end.txt` | Review |
| Review | Suite | `T015.txt` | Close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup and applier self-test** - 20 minutes - CRITICAL
2. **Known rows and census rows** - 30 minutes - CRITICAL
3. **Suite run** - 20 to 40 minutes - CRITICAL
4. **Review and close** - 20 minutes - CRITICAL

**Total Critical Path**: about 1.5 hours

**Parallel Opportunities**:
- None inside the phase. The rows share files and the checks read the whole tree, so every task runs in order.
- The frontier review reads the diff only, so it may start while the second suite rerun finishes, but only one dispatch runs at a time.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup done | T001 to T005 marked `[x]` with evidence | Start of phase |
| M2 | Known rows applied | T006 and T007 counts match, `.hashes` deleted | Mid phase |
| M3 | Census rows done | T009 to T012 show no owner `002` defect reproducing | Mid phase |
| M4 | Phase closeable | Suite matches, review answered, every acceptance criterion `Met` | End of phase |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

Written for the executing swarm. Follow each rule as written. Where a rule and your own judgment disagree, follow the rule and record the disagreement in `goal.md` section 4.

### Roles
- **Conductor**: one DeepSeek V4.1 Flash max session that is not itself running inside OpenCode, because `cli-opencode` refuses a dispatch from inside OpenCode. It runs every command in `tasks.md` and reads every output. It edits only this phase folder plus the files the rows name through the applier. It keeps `goal.md` section 4 current.
- **Worker**: one `opencode2 run` dispatch on `llmgateway/deepseek-v4.1-flash-1017#max`. It exists only for a `NEEDS-WORKER` row. One worker fixes one row in one file, then stops.
- **Reviewer**: one read-only frontier review through `cli-codex` with `gpt-6-luna` at phase close. It writes nothing.

### Pre-Task Checklist
- [ ] Read this phase's `spec.md`, this plan and `tasks.md` before the first command
- [ ] Confirm the working directory is the build worktree recorded in `../goal.md` section 4, never the main checkout
- [ ] Read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` sections 3 and 4 before composing the first worker command, only when T009 left a `NEEDS-WORKER` row
- [ ] Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` before the review command
- [ ] Save every brief to `scratch/briefs/` before dispatching it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in ID order. No task in this phase is parallel, and at most one dispatch runs at a time |
| TASK-SCOPE | A worker writes only the path under ALLOWED WRITE PATHS in its brief |
| TASK-VERIFY | The conductor runs the task's verify command and reads both its output and its exit status before marking the task `[x]` |
| TASK-LOCATE | Find text by its exact content, never by a line number |
| TASK-NOHAND | Never edit a file that a known row or a ledger row names by hand. Only `apply_row.py` or a worker brief changes it |
| TASK-BANNED | Workers never run `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js` or `/speckit:save` |

### Worker Brief Skeleton

Every worker brief starts with this block, word for word. `make_brief` in `scratch/tools/lib.sh` prints it with the row fields filled in.

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and
SYSTEM_SPEC_GATE_ENFORCE=0 are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when the file is edited on disk and the verification command has been run.

ROLE: You are a precise text editor. You change one file and nothing else. Your output is
checked by a script.

ALLOWED WRITE PATHS:
  <the one file the row names>

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
git stash, rm, mv, create.sh, generate-context.js, /speckit:save, and any edit to a file
not listed under ALLOWED WRITE PATHS.
```

The role line is a focused persona summary in place of a full agent file, the small-context exception that `cli-opencode` rule 18 allows. It is declared here as that exception. Layers L1 to L3 of `cli-opencode` rule 15 apply: banned operations and allowed write paths in the prompt, a fresh worktree and a baseline commit.

### Dispatch Command

```bash
cd "$WORKTREE" && SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode2 run --standalone \
  -m llmgateway/deepseek-v4.1-flash-1017#max --format json \
  "$(cat "$PHASE/scratch/briefs/T010-$id.txt")" </dev/null > "$PHASE/scratch/runs/T010-$id.jsonl" 2>&1 &
PID=$!; wait "$PID"; kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
```

`PHASE` is this folder's path, `WORKTREE` is the build worktree and `id` is the ledger row id. Never kill by a name pattern. Kill only the captured PID.

### Status Reporting Format

```text
[T###] DONE | BLOCKED - one line of evidence
```

Write it as a row in the progress table of `goal.md` section 4.

### Blocked Task Protocol
1. Restore any file the task changed with `git restore --source=<phase start commit> -- <file>`.
2. Mark the task `[B]` in `tasks.md` with the failing command and the first line of its output.
3. Re-dispatch a worker at most twice with the brief corrected for what failed. After the third failure on the same row, leave it `[B]` and continue with the next task.
4. Stop the phase when two tasks are blocked, and write `STOP` with both task IDs in `goal.md` section 4.
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Apply exact swaps by script, never by a model

**Status**: Accepted

**Context**: Twenty-five replacements are known to the letter. A weak model asked to make them may reword the new text, change a neighbouring line or skip one.

**Decision**: `apply_row.py` makes every swap whose old text and new text are known. It refuses unless the old text occurs exactly once. A model edits a file only for a `NEEDS-WORKER` row, with one allowed path and a verify command.

**Consequences**:
- The 25 known rows cost no model call, and each one is checked by its own counts.
- A second apply fails, so a retry can never edit twice.
- A row whose text drifted is not applied until a worker or the operator handles it.

**Alternatives Rejected**:
- A worker edits each file from a plain-language brief: it can paraphrase, and ledger rows would then differ from the text this packet froze.
- `sed -i` one-liners: the quoting of backticks and quotes in these lines is the exact place a weak model slips, and `sed` replaces every match without a count check.

### ADR-002: Delete `templates/.hashes` only when both reader searches exit with code 1

**Status**: Accepted

**Context**: The file lists four template files, three of which do not exist. A search found no reader, but a failed search also prints nothing, so an empty result alone is not proof.

**Decision**: T008 saves the output of two `rg` searches and prints each exit code. The delete runs only when both codes are `1`, which means the search worked and found nothing. Code `0` means a reader exists and code `2` means the search failed. Both block the delete.

**Consequences**:
- A broken search cannot cause a delete.
- A reader added by a later change to `main` stops the delete and is recorded for the operator.

**Alternatives Rejected**:
- Count the lines of search output and delete on `0`: a failed search also prints no lines, so the guard would pass on an error.

### ADR-003: Compare the suite by its summary lines and exit line

**Status**: Accepted

**Context**: The suite prints durations and start times that differ on every run, so a plain diff of two full outputs never matches.

**Decision**: T014 compares only the `Test Files` lines, the `Tests` lines and the final `exit=` line of the end file with the same lines of phase 1's `suite-start.txt`. A flaky difference is rerun once. A second difference blocks the phase.

**Consequences**:
- A new failing test changes the counts or the exit code, so it is caught.
- The comparison cannot name which test changed. The conductor reads the end file for lines that start with `FAIL`.

**Alternatives Rejected**:
- Compare only the exit code: a suite that adds a skipped or removed test group keeps exit 0 and the change goes unseen.

---

