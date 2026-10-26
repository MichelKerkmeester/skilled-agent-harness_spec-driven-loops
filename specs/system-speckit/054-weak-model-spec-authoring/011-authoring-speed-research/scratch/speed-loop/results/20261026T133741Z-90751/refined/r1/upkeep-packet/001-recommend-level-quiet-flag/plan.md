---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Adds one global, one parser case, one shared level-line helper and one quiet renderer to recommend-level.sh. The default report is proven unchanged by a byte comparison against three captured baselines."
trigger_phrases:
  - "recommend level quiet flag plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 or newer, `set -euo pipefail` |
| **Framework** | None; one CLI script with a hand-rolled argument parser |
| **Storage** | None |
| **Testing** | `bash -n`, direct invocations, `wc -l` and `diff` against captured baselines |

### Overview

The change touches one file and adds four small pieces to it: a `QUIET` global, a `--quiet` case in
the argument parser, a `format_level_line()` helper shared by both text renderers, and an
`output_quiet()` function dispatched from section 7. Scoring, phase logic and the JSON renderer are
untouched, so the default report can only change if the helper's format string differs from the
`echo` it replaces, which a byte comparison against three pre-change captures catches.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script CLI: parse arguments, score, then dispatch to one renderer.

### Key Components
- **Argument parser (section 5)**: recognizes `--quiet`, sets `QUIET=true`, and keeps its existing `shift` discipline so no later case sees the flag.
- **`format_level_line()` (section 4)**: the one place that spells `Recommended Level: N (Name)`, called by both text renderers.
- **`output_quiet()` (section 4)**: prints that one line and nothing else.
- **Output dispatch (section 7)**: `--json` first, then `QUIET`, then the default `output_text`.

### Data Flow

`argv` enters the parser, which sets `LOC`, `FILES`, the four risk flags, `JSON_OUTPUT` and `QUIET`.
Section 6 computes `SCORE_LOC`, `SCORE_FILES`, `SCORE_RISK`, `SCORE_COMPLEXITY` and `TOTAL_SCORE`,
then `determine_level` sets `RECOMMENDED_LEVEL` and `LEVEL_NAME`. Section 7 picks one renderer, which
writes to stdout. The flag is read only at dispatch, so it cannot influence a score.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a feature addition, not a bug fix, but the output surface is shared, so the inventory is
recorded here rather than skipped.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` `output_text` | owns the 12-18 line report | update: call `format_level_line` instead of its inline `echo` | `diff` against the three captured baselines exits 0 |
| `recommend-level.sh` `output_json` | owns the 36-line JSON document | unchanged | `--json` output still parses and matches `recommended_level` |
| `recommend-level.sh` argument parser | owns option recognition | update: one `--quiet` case | `rg -n -- '--quiet\)' recommend-level.sh` prints one line |
| `recommend-level.sh` header comment and `--help` | document the option set | update: list `--quiet` in both | `rg -n -- '--quiet' recommend-level.sh` names both sites |

Required inventories:
- Same-class producers: `rg -n 'Recommended Level:' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` must list every site that renders the label; the extraction is complete only when that list has no inline copy left outside the helper.
- Consumers of changed symbols: `rg -n 'recommend-level' .skilled/skills/system-spec-kit --glob '*.sh' --glob '*.md'` names each caller the flag could affect.
- Matrix axes: three input shapes (`--loc 50 --files 2`, `--loc 500 --files 15`, `--loc 500 --files 15 --auth --api --db --architectural`) crossed with three output modes (default, `--quiet`, `--json`), nine rows, of which the six text rows are asserted.
- Algorithm invariant: the flag is read only at dispatch, so `TOTAL_SCORE`, `RECOMMENDED_LEVEL`, `LEVEL_NAME`, `CONFIDENCE` and every phase field are computed identically with and without it.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the baselines, Implementation adds the helper and the renderer, Verification diffs both output shapes and runs the packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `format_level_line` and `output_quiet` through direct invocations | `bash`, `wc -l` |
| Integration | Parser, scoring and dispatch across three input shapes | `diff` against `scratch/baseline/`, `bash -n` |
| Manual | `--help` text, the unknown-option path and `--quiet --json` | Terminal run |

The three assertions that decide the packet:

1. `bash recommend-level.sh --loc 500 --files 15 --quiet | wc -l` prints `1`.
2. `bash recommend-level.sh --loc 500 --files 15 | wc -l` prints `16`, and the text matches the baseline byte for byte.
3. `bash recommend-level.sh --loc 500 --files 15 --json --quiet | wc -l` prints `36`, the same as `--json` alone.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 or newer | Internal | Green | The script already requires it; no change |
| `diff` and `wc` | Internal | Green | Baseline comparison unavailable; fall back to reading both outputs line by line |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report differs from a baseline capture, or `--quiet` changes a computed level or score.
- **Procedure**: Revert the single commit that touched `recommend-level.sh` and rerun the three baseline invocations. The change is confined to one file with no data, config or schema to unwind.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Implementation) ──────► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, Verification |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **About 1 hour (assumption, not a commitment)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - no data changes
- [ ] Feature flag configured - the flag itself is the feature; no rollout flag
- [ ] Monitoring alerts set - no service to monitor

### Rollback Procedure
1. Revert the commit that touched `recommend-level.sh`.
2. Rerun the three baseline invocations and confirm the report matches the captures.
3. Confirm `--quiet` is gone: the parser exits 1 with `ERROR: Unknown option: --quiet`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the script persists nothing
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────────────┐     ┌─────────────┐
│   Phase 1   │────►│      Phase 2        │────►│   Phase 3   │
│   Setup     │     │ format_level_line   │     │   Verify    │
│  baselines  │     │ output_quiet + case │     │  diff + wc  │
└─────────────┘     └─────────────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline captures | None | Three reference outputs | Default-report diff |
| `format_level_line` | Baseline captures | One shared label | `output_text` edit, `output_quiet` |
| `output_quiet` and parser case | `format_level_line` | The quiet path | Verification |
| Verification | All of the above | Line counts and a clean diff | Packet closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture three baselines** - 10 minutes - CRITICAL
2. **Extract the helper and add the renderer** - 30 minutes - CRITICAL
3. **Diff both output shapes and run the validator** - 15 minutes - CRITICAL

**Total Critical Path**: About 55 minutes.

**Parallel Opportunities**:
- The header comment and `--help` edit can proceed alongside the renderer work, because neither affects stdout.
- The consumer inventory (`rg -n 'recommend-level'`) can run during Setup, since it reads only.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines captured | Three files under `scratch/baseline/` whose `wc -l` reads 16, 17 and 12 | Phase 1 |
| M2 | Quiet path works | `--quiet --loc 500 --files 15 \| wc -l` prints `1` | Phase 2 |
| M3 | Default report proven unchanged | `diff` against each baseline exits 0 and `validate.sh --strict` prints `RESULT: PASSED` | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: A separate `output_quiet` renderer, not a branch inside `output_text`

**Status**: Accepted

**Context**: `output_text` builds the whole report, and a quiet branch inside it would sit in the middle of a function whose single job is the full report. The default report is the part of this change most likely to regress, so the safest structure keeps it untouched.

**Decision**: Add `output_quiet()` beside `output_text()` and `output_json()`, and let section 7 choose between them. Extract the label into `format_level_line()` so both text renderers print the same string from one format.

**Consequences**:
- The default report's body is unchanged; only its level line becomes a call to the shared helper, and the byte comparison proves the string is identical.
- Three renderers now exist, so a future label change must edit the helper rather than one `echo`, which is the point of the extraction.

**Alternatives Rejected**:
- A `if [[ "$QUIET" = true ]]` branch at the top of `output_text`: rejected because every future edit to the report would have to reason about two modes in one function.
- An environment variable instead of a flag: rejected because every existing caller already passes flags, and an env var would add a second configuration surface to test.

---

### ADR-002: `--json` wins over `--quiet`

**Status**: Accepted

**Context**: Both flags ask for a different output shape. A silent winner is unavoidable when both are passed, so the choice has to be deliberate and documented.

**Decision**: Section 7 dispatches `JSON_OUTPUT` first, then `QUIET`, then the default text renderer. `--quiet` therefore applies only to the text report.

**Consequences**:
- A pipeline that adds `--quiet` to an existing `--json` call keeps working and keeps parsing JSON.
- `--quiet --json` is a documented no-op for `--quiet`, which callers must read once.

**Alternatives Rejected**:
- Erroring when both are passed: rejected because it turns a harmless combination into a failure for scripts that set flags generically.
- Letting `--quiet` win: rejected because it would silently drop a machine-readable contract that already exists.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before starting a task, the conductor confirms four things and records each as a line in its
progress note:

- The task id and its `Verify:` command are read from `tasks.md`, not from memory.
- The baseline captures from T002 exist, because every later claim about the default report
  depends on them.
- Only `recommend-level.sh` is in scope; the packet documents are not edited during
  implementation.
- `bash -n` passes on the current file, so a later failure can be attributed to the change.

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Tasks run in id order. T006 must precede T007, because the renderer calls the helper. |
| TASK-SCOPE | One file changes: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. A task that needs a second file stops and reports. |
| TASK-EVIDENCE | A task is complete only when its `Verify:` command was run and its output read, not when the edit was applied. |

### Status Reporting Format

Each task reports one line, in this shape:

`T006 done | verify: diff baseline exits 0 | observed: no output | next: T007`

The status word is one of `done`, `blocked` or `skipped`, and the observed field quotes the
command's actual output rather than a summary of it.

### Blocked Task Protocol

A task is marked `[B]` and reported as `blocked` when its `Verify:` command fails after two
attempts, when the edit anchor no longer matches the file, or when completing it would require a
file outside TASK-SCOPE. A blocked task stops the sequence: later tasks that depend on it are not
started, and the report names the failing command and its output. The conductor does not widen
scope to clear a block on its own.

---
