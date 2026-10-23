---
title: "Implementation Plan: Phase 1: template-drift-census-and-baseline"
description: "Three read-only DeepSeek lanes write candidate defect rows, the conductor keeps only rows that reproduce, and three runs of one fixed authoring task record the before-numbers."
trigger_phrases:
  - "template drift census and baseline plan"
  - "defect ledger schema"
  - "census lane detection commands"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: template-drift-census-and-baseline

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash, ripgrep, awk, jq |
| **Framework** | system-spec-kit validator and scaffold scripts |
| **Storage** | JSONL files in this phase's `scratch/` |
| **Testing** | Each ledger row carries its own reproduce command |

### Overview
Three DeepSeek workers each read one directory set and write candidate defect rows. The conductor re-runs every row's evidence command and keeps only the rows that reproduce. Then three workers each author the same small Level 2 packet in a throwaway track, and the conductor measures the result with fixed commands.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The launch preconditions in `../spec.md` section 3 are recorded as met in `../goal.md` section 4
- [ ] `tasks.md` T001 to T003 are done: provider check, worktree check, start commit recorded

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED`
- [ ] `git status --porcelain` lists nothing outside this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out of read-only lanes, then a deterministic reduce by the conductor.

### Key Components
- **Lane A worker**: reads `.skilled/skills/system-spec-kit/templates/` except `examples/`.
- **Lane B worker**: reads `.skilled/skills/system-spec-kit/templates/examples/`.
- **Lane C worker**: reads `.skilled/skills/system-spec-kit/references/templates/`, `.skilled/skills/system-spec-kit/references/workflows/` and `.skilled/skills/system-spec-kit/SKILL.md`.
- **Conductor**: merges lane files, re-runs evidence, writes `ledger.jsonl`, runs the baseline.

### Ledger schema (frozen)

One JSON object per line. All ten fields are required strings.

| Field | Meaning |
|-------|---------|
| `id` | `L-<lane>-<NNN>`, for example `L-B-004` |
| `lane` | `A`, `B` or `C` |
| `file` | Repository-relative path of the file with the defect |
| `locator` | Exact text that occurs once in that file and marks the defect |
| `defect_class` | One of the eight classes below |
| `observed` | What is there now, in one sentence |
| `expected_text` | The exact replacement text, or `DELETE FILE`, or `OWNED BY PHASE` when a later phase rewrites the area |
| `owner_phase` | `002`, `003`, `004`, `005`, `006` or `041-006` |
| `evidence_cmd` | One shell command, run from the repository root |
| `evidence_expect` | The exact text or count that command prints while the defect exists |

### Defect classes and detection commands

Run each from the repository root. `S=.skilled/skills/system-spec-kit`.

| Class | Detection command | Owner |
|-------|-------------------|-------|
| `leaked-description` | `rg -n -e '^description: "Note ' -e '^description: "Level 3,' -e '^description: "[a-z]' -e '^description: ".*-->' $S/templates/examples` prints 18 lines, the 18 exact lines in the table below | 002 |
| `stale-reference` | `rg -o --no-filename '\.skilled/[A-Za-z0-9_./+-]+' <dir> \| sort -u \| while read p; do test -e "$p" \|\| echo "MISSING $p"; done` and `rg -n -i 'checklist\.md' <dir>` | 002 |
| `unresolved-placeholder` | `rg -n '<spec-folder>\|<path>\|<track>' <dir>` on prose lines outside code blocks | 002 or 041-006 |
| `self-contradiction` | Read the file. Report two lines that state opposite rules for the same thing | 002 |
| `dead-file` | For each non-markdown file at `$S/templates/` top level: `rg -l --hidden "<basename>" .skilled --glob '!<that file>' \| wc -l` prints `0` | 002 |
| `gate-anchor-crossing` | `awk 'BEGIN{d=0} /<!-- IF /{d++} /<!-- \/IF -->/{d--} /<!-- ANCHOR:/{match($0,/ANCHOR:[a-z0-9-]+/); a[substr($0,RSTART+7,RLENGTH-7)]=d} /<!-- \/ANCHOR:/{match($0,/ANCHOR:[a-z0-9-]+/); n=substr($0,RSTART+7,RLENGTH-7); if (a[n]!=d) print FILENAME":"NR": anchor "n" opens at "a[n]" closes at "d}' <file.tmpl>` | 004 |
| `unenforced-hint` | `rg -c '\[[A-Za-z][^]\[]{2,}\]' $S/templates/core/*.tmpl` | 003 |
| `doc-code-mismatch` | `rg -n '\[PLACEHOLDER\]' $S/references` and any reference sentence that names a rule `validate.sh` does not run | 003 |

### The five confirmed defects (must appear as rows)

| # | File | Locator | Class | Owner |
|---|------|---------|-------|-------|
| 1 | `$S/templates/examples/level-1`, `level-2`, `level-3` and `level-3+`, 18 files | the exact line in each K row below | `leaked-description` | 002 |
| 2 | `$S/templates/examples/level-2/tasks.md`, `level-3/tasks.md`, `level-3+/tasks.md` | `- [x] Checklist.md fully verified` | `stale-reference` | 002 |
| 3 | `$S/references/workflows/spec-folder-write-recipe.md` | `  <spec-folder>` | `unresolved-placeholder` | 041-006 |
| 4 | `$S/references/workflows/spec-folder-authoring-checklist.md` | ``such as `<spec-folder>`.`` | `unresolved-placeholder` | 002 |
| 5 | `$S/references/templates/template-style-guide.md` | `### Why Bulleted Lists` | `self-contradiction` | 002 |

Defect 1 is one row per example file, 18 rows in all. The table below gives the exact locator for each row, copied from `../002-template-and-example-defect-repair/tasks.md` T004 K-01 to K-18. The detection command above prints 18 lines on the unchanged tree, one for each row.

| Row | File | Locator |
|-----|------|---------|
| K-01 | `$S/templates/examples/level-1/implementation-summary.md` | `description: "the completed authentication feature. Created AFTER implementation completes. -->"` |
| K-02 | `$S/templates/examples/level-1/plan.md` | `description: "planning required for a simple authentication feature. Note the straightforward"` |
| K-03 | `$S/templates/examples/level-1/spec.md` | `description: "required for a simple authentication feature (~80 LOC). Use this as a reference when"` |
| K-04 | `$S/templates/examples/level-1/tasks.md` | `description: "needed for a simple authentication feature. Note the straightforward task numbering"` |
| K-05 | `$S/templates/examples/level-2/implementation-summary.md` | `description: "verification documentation and test coverage details. -->"` |
| K-06 | `$S/templates/examples/level-2/plan.md` | `description: "planning. Note the addition of Phase Dependencies, Effort Estimation, and Enhanced"` |
| K-07 | `$S/templates/examples/level-2/spec.md` | `description: "documentation. Note the addition of NFRs and Edge Cases sections compared to Level 1."` |
| K-08 | `$S/templates/examples/level-2/tasks.md` | `description: "including effort estimates and explicit verification tasks for each feature. -->"` |
| K-09 | `$S/templates/examples/level-3/decision-record.md` | `description: "architecture decisions with proper context, alternatives, and consequences."` |
| K-10 | `$S/templates/examples/level-3/implementation-summary.md` | `description: "decision summary, comprehensive metrics, and lessons learned sections. -->"` |
| K-11 | `$S/templates/examples/level-3/plan.md` | `description: "planning. Note the addition of Dependency Graph, Critical Path, Milestones, and"` |
| K-12 | `$S/templates/examples/level-3/spec.md` | `description: "documentation. Note the addition of Executive Summary, Risk Matrix, User Stories"` |
| K-13 | `$S/templates/examples/level-3/tasks.md` | `description: "including dependencies, milestone mapping, and detailed verification tasks. -->"` |
| K-14 | `$S/templates/examples/level-3+/decision-record.md` | `description: "Level 3, demonstrating that governance-level features are primarily in spec.md"` |
| K-15 | `$S/templates/examples/level-3+/implementation-summary.md` | `description: "metrics, workstream performance, AI execution analysis, and comprehensive lessons"` |
| K-16 | `$S/templates/examples/level-3+/plan.md` | `description: "Note the AI Execution Framework, Workstream Coordination, and Communication Plan"` |
| K-17 | `$S/templates/examples/level-3+/spec.md` | `description: "Note the Complexity Assessment, Approval Workflow, Compliance Checkpoints, Stakeholder"` |
| K-18 | `$S/templates/examples/level-3+/tasks.md` | `description: "features including 3-Tier Task Format, AI Execution Protocol, and Workstream"` |

The other confirmed items, `templates/.hashes` as a dead file and the anchor crossings in `spec.md.tmpl`, are expected from the lane commands and need no special handling.

### Data Flow
Lane brief, then lane JSONL, then conductor reproduce check, then `ledger.jsonl`, then frontier review, then the final `ledger.jsonl` that phase 2 reads.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes no producer or consumer. The table records what it reads so the census can be checked for coverage.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `templates/core`, `addons`, `packet-types` | Template sources the renderer reads | unchanged, read by lane A | lane A JSONL lists each file it read in a final `{"read": ...}` line |
| `templates/examples` | Filled examples models imitate | unchanged, read by lane B | lane B JSONL read line |
| `references/templates`, `references/workflows`, `SKILL.md` | Authoring guidance and router | unchanged, read by lane C | lane C JSONL read line |

Required inventories:
- Same-class producers: every class in section 3 has a command that runs over the whole lane directory, not one file.
- Consumers of changed symbols: none, nothing changes.
- Matrix axes: three lanes by eight classes, 24 cells, each reported as a row count, zero allowed.
- Algorithm invariant: a row survives only if its evidence command reproduces on the unchanged tree.
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
| Unit | Each ledger row reproduces | its own `evidence_cmd` |
| Integration | The five confirmed defects are in the ledger | `jq` queries in `tasks.md` T007 |
| Manual | Frontier review reads the ledger against the files | read-only `cli-codex` dispatch in `tasks.md` T011 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode2` with `llmgateway/deepseek-v4.1-flash-1017` | External | Checked in T001 | No lane can run |
| `jq` and `rg` on PATH | Internal | Checked in T001 | Merge and evidence checks cannot run |
| `create.sh` and `validate.sh` in the build worktree | Internal | Checked in T002 | Baseline cannot run |
| `cli-codex` for the review | External | Checked in T011 | Review is recorded as skipped with the error, and REQ-006 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any file outside this phase folder, `specs/zz-bench-authoring/` and `specs/zz-bench-hints/` changed.
- **Procedure**: `git diff --name-only <start commit>` lists the files. Restore each with `git restore --source=<start commit> -- <file>`. Delete the two throwaway tracks with `rm -rf specs/zz-bench-authoring specs/zz-bench-hints`, since every run creates them fresh.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T003) ──► Census lanes A, B, C in parallel (T004-T005) ──► Reduce (T006-T007)
                                                                          │
                      Baseline hints (T008) ──► Baseline runs 1, 2, 3 (T009) ──► Review (T011)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Launch preconditions | Census, Baseline |
| Census | Setup | Reduce |
| Reduce | Census | Review |
| Baseline | Setup | Review |
| Review | Reduce, Baseline | Phase close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Census and reduce | Med | 1 to 2 hours |
| Baseline | Med | 1 to 2 hours, three serial runs |
| Review and close | Low | 30 minutes |
| **Total** | | **3 to 5 hours, an assumption with no timed earlier run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Start commit hash recorded in `goal.md` section 4 before the first dispatch
- [ ] `git status --porcelain` saved to `scratch/baseline/status-start.txt`
- [ ] No feature flag applies, this phase ships nothing

### Rollback Procedure
1. List changed files with `git diff --name-only <start commit>`.
2. Restore each one outside this phase folder with `git restore --source=<start commit> -- <file>`.
3. Run `git status --porcelain` and compare with `scratch/baseline/status-start.txt`.
4. Record the rollback in `goal.md` section 4.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, nothing persistent is written outside this folder
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐     ┌───────────────┐     ┌──────────┐     ┌──────────┐
│  Setup   │────►│ Lanes A, B, C │────►│  Reduce  │────►│  Review  │
└────┬─────┘     └───────────────┘     └──────────┘     └────▲─────┘
     │                                                       │
     └──────────►┌───────────────┐────────────────────────────┘
                 │ Baseline x 3  │
                 └───────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Launch preconditions | Start commit, checks | Lanes, Baseline |
| Lanes | Setup | `lane-*.jsonl` | Reduce |
| Reduce | Lanes | `ledger.jsonl` | Review |
| Baseline | Setup | `baseline.json` | Review |
| Review | Reduce, Baseline | Final ledger | Phase 2 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup** - 15 minutes - CRITICAL
2. **Baseline runs** - 1 to 2 hours - CRITICAL
3. **Review** - 30 minutes - CRITICAL

**Total Critical Path**: about 2 to 3 hours

**Parallel Opportunities**:
- Lanes A, B and C run together, three dispatches at once, because they read disjoint directories and write separate files.
- The census lanes and the baseline runs do not share files, but the baseline waits for the lanes so that no more than three workers run at once.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup done | T001 to T003 marked `[x]` with evidence | Start of phase |
| M2 | Ledger reduced | `ledger.jsonl` exists, every row reproduces | Mid phase |
| M3 | Baseline recorded | `baseline.json` holds three runs | Mid phase |
| M4 | Phase closeable | Every acceptance criterion `Met`, `Waived` or `Superseded` | End of phase |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

Written for the executing swarm. Follow each rule as written. Where a rule and your own judgment disagree, follow the rule and record the disagreement in `goal.md` section 4.

### Roles
- **Conductor**: one DeepSeek V4.1 Flash max session that is not itself running inside OpenCode, because `cli-opencode` refuses a dispatch from inside OpenCode. It dispatches workers, runs every verify command, edits only this phase folder, and keeps `goal.md` section 4 current.
- **Worker**: one `opencode2 run` dispatch on `llmgateway/deepseek-v4.1-flash-1017#max`. One worker does one lane or one baseline run, then stops.
- **Reviewer**: one read-only frontier review through `cli-codex` at phase close. It writes nothing.

### Pre-Task Checklist
- [ ] Read this phase's `spec.md`, this plan and `tasks.md` before the first dispatch
- [ ] Read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` sections 3 and 4 before composing the first worker command
- [ ] Confirm the working directory is the build worktree recorded in `../goal.md` section 4, never the main checkout
- [ ] Confirm `opencode2 models --standalone` lists `llmgateway/deepseek-v4.1-flash-1017`
- [ ] Save every brief to `scratch/briefs/<task-id>.txt` before dispatching it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in ID order. Tasks marked `[P]` may run together, at most three at once, and only when no two write the same file |
| TASK-SCOPE | A worker writes only the paths under ALLOWED WRITE PATHS in its brief |
| TASK-VERIFY | The conductor runs the task's verify command and reads both its output and its exit status before marking the task `[x]` |
| TASK-LOCATE | Find text by its exact content, never by a line number |
| TASK-BANNED | Workers never run `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js` or `/speckit:save` |

### Worker Brief Skeleton

Every brief starts with this block, word for word, with the two paths filled in:

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and
SYSTEM_SPEC_GATE_ENFORCE=0 are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE: You are a read-only auditor. You read files, run read-only commands and write one
result file. Your output is checked line by line by a script.

ALLOWED WRITE PATHS:
  <the one file this task names>

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
git stash, rm, mv, create.sh outside the task's stated command, generate-context.js,
/speckit:save, and any edit to a file not listed under ALLOWED WRITE PATHS.
```

The role line is a focused persona summary in place of a full agent file, the small-context exception that `cli-opencode` rule 18 allows. It is declared here as that exception.

### Dispatch Command

```bash
cd "$WORKTREE" && SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode2 run --standalone \
  -m llmgateway/deepseek-v4.1-flash-1017#max --format json \
  "$(cat "$PHASE/scratch/briefs/$TASK.txt")" </dev/null > "$PHASE/scratch/runs/$TASK.jsonl" 2>&1 &
PID=$!; wait "$PID"; kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
```

`PHASE` is this folder's path and `WORKTREE` is the build worktree. Never kill by a name pattern. Kill only the captured PID.

### Status Reporting Format

`[T###] DONE | BLOCKED - one line of evidence`, written as a row in the progress table of `goal.md` section 4.

### Blocked Task Protocol
1. Restore any file the task changed with `git restore --source=<start commit> -- <file>`.
2. Mark the task `[B]` in `tasks.md` with the failing command and the first line of its output.
3. Re-dispatch at most twice with the brief corrected for what failed. After the third failure on the same task, leave it `[B]` and continue with the next task.
4. Stop the phase when two tasks are blocked, and write `STOP` with both task IDs in `goal.md` section 4.
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Keep only rows that reproduce

**Status**: Accepted

**Context**: A DeepSeek worker asked to find defects will also report things that are not defects.

**Decision**: A lane row enters `ledger.jsonl` only when the conductor runs its `evidence_cmd` on the unchanged tree and the output contains its `evidence_expect`. The `self-contradiction` class has no command, so those rows go to the frontier review instead.

**Consequences**:
- Phase 2 receives no row it cannot reproduce.
- A real defect the worker described badly is dropped. The frontier review reads the source files again to catch those.

**Alternatives Rejected**:
- Trusting lane output as written: it puts unconfirmed findings into a repair phase that edits shared templates.

### ADR-002: One fixed authoring task, three runs, run in a throwaway track

**Status**: Accepted

**Context**: The baseline must be rerun unchanged in phase 9, and one run of a sampling model is one sample.

**Decision**: The task text in `tasks.md` T009 is frozen. It runs three times per side. Each run creates `specs/zz-bench-authoring/`, and the conductor deletes that directory after measuring.

**Consequences**:
- Phase 9 compares like with like and reports a range.
- Three runs cannot detect a small effect. Phase 9 reports the range, not a significance claim.

**Alternatives Rejected**:
- Measuring by a frontier model's judgment of quality: one model is one opinion, and the five metrics are commands.

---

