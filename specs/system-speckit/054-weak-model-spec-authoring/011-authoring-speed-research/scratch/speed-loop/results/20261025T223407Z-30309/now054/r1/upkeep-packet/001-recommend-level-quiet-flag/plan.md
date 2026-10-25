---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet option to the recommend-level script's parser and one branch in its text renderer, so a caller gets the recommendation on one line while every existing invocation keeps its report."
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
| **Language/Stack** | Bash 3.2+ (`set -euo pipefail`) |
| **Framework** | None - a standalone CLI script |
| **Storage** | None |
| **Testing** | Shell invocations, `bash -n`, `wc -l` and `diff` |

### Overview
The change touches one script and adds about twenty lines. A `QUIET` global mirrors the existing `JSON_OUTPUT` flag, the parser gains a `--quiet` case, and `output_text()` returns after printing the recommendation line when quiet is set. Proof is a line count on both forms plus a byte diff against a captured baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash -n` clean and both output forms verified
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: single-script branch. One script owns argument parsing, scoring and rendering; the change adds a branch to the existing renderer rather than a new output module.

### Key Components
- **Argument parser (`while [[ $# -gt 0 ]]` loop)**: Turns flags into globals; gains a `--quiet` case beside `--json`.
- **`output_text()`**: Owns the human report; gains an early single-line return when quiet mode is active.
- **`output_json()`**: Owns the machine document; unchanged, and still selected when `--json` is passed.

### Data Flow
Arguments are parsed into globals, the score functions read those globals, and section 7 of the script dispatches to `output_json()` when `JSON_OUTPUT` is true and to `output_text()` otherwise. Quiet mode is read inside `output_text()` only, so the JSON path never sees it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a feature, not a bug fix, but the script's stdout is a shared surface, so the producer/consumer inventory still applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` `output_text()` | Producer of the human report | update - add the quiet branch | `rg -n 'QUIET' recommend-level.sh` names the branch |
| `recommend-level.sh` `output_json()` | Producer of the machine document | unchanged - JSON wins over quiet | `bash recommend-level.sh --loc 50 --files 2 --json --quiet \| wc -l` prints 36 |
| `show_help()` and the header usage block | Document the option surface | update - list `--quiet` | `bash recommend-level.sh --help \| grep -c -- '--quiet'` prints 1 |
| Callers in the spec-kit runtime and docs | Invoke the script with existing flags | not a consumer of the new flag; their invocations are unchanged | `rg -n 'recommend-level.sh' .skilled/skills/system-spec-kit` still resolves, and no invocation passes `--quiet` |

Required inventories:
- Same-class producers: `rg -n 'RECOMMEND_PHASES|JSON_OUTPUT' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` shows the two existing output globals the new one must match in shape.
- Consumers of changed symbols: `rg -n 'output_text|output_json' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` lists the single dispatch site.
- Matrix axes: inputs `--quiet` x `--json` x `--no-recommend-phases` = eight rows; the plan tests the four that differ.
- Algorithm invariant: the recommendation line's text is `Recommended Level: <N> (<Name>)` in both modes; quiet changes the count of lines, never the line.
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
| Unit | The quiet branch and the unchanged default branch of `output_text()` | `bash`, `wc -l`, `diff` |
| Integration | `--quiet` combined with `--json` and `--no-recommend-phases`, plus the missing-input error path | `bash`, exit-status checks |
| Manual | Read both forms once in a terminal to confirm the report still reads as before | Terminal |

Baseline for the default form: `bash recommend-level.sh --loc 50 --files 2` prints 16 lines today, with `Recommended Level: 0 (Quick)` on line 2. That output is captured to `scratch/baseline-default.txt` before the edit and diffed after it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2+ | Internal | Green | The script cannot run; the requirement predates this change |
| `diff` and `wc` | Internal | Green | Baseline comparison falls back to reading both outputs by hand |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report changes for any input, or `--quiet` prints more than one line.
- **Procedure**: Revert the single commit that touches `recommend-level.sh`, then rerun the two baseline commands.
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
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Core Implementation | Low | 20 minutes |
| Verification | Low | 10 minutes |
| **Total** | | **~40 minutes (assumption, not a commitment)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - no data changes
- [ ] Feature flag configured - the `--quiet` flag is per-invocation, not a rollout switch
- [ ] Monitoring alerts set - no service to monitor

### Rollback Procedure
1. Revert the commit that touches `recommend-level.sh`.
2. Confirm the default form prints the baseline again: `bash recommend-level.sh --loc 50 --files 2 | diff - scratch/baseline-default.txt` prints nothing.
3. Confirm `--quiet` is gone: `bash recommend-level.sh --loc 50 --files 2 --quiet` exits 1 with `Unknown option`.
4. Notify the packet's consumers only if the flag had already been published to them.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the script writes no data.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Docs     │
                    │  (T007)   │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture (T002) | None | `scratch/baseline-default.txt` | T008 |
| Parser change (T003, T004) | Baseline capture | `QUIET` global set by `--quiet` | T005 |
| Renderer change (T005) | Parser change | The single-line output | T006, T008 |
| Help text (T007) | Parser change | Documented option | T011 |
| Verification (T008-T011) | Renderer, help text | Evidence for every AC row | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 5 minutes - CRITICAL
2. **Parser and renderer change** - 20 minutes - CRITICAL
3. **Verification** - 10 minutes - CRITICAL

**Total Critical Path**: ~35 minutes

**Parallel Opportunities**:
- The help text (T007) can be written while the renderer change is reviewed.
- The two documentation checks (T008, T009) can run independently once the code lands.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Parser accepts the flag | `bash recommend-level.sh --loc 50 --files 2 --quiet` exits 0 | Phase 2 start |
| M2 | Quiet renders one line | `bash recommend-level.sh --loc 50 --files 2 --quiet \| wc -l` prints 1 | Phase 2 end |
| M3 | Both forms verified | Default output diffs clean and every AC row is `Met` | Phase 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet as a text-renderer branch, not a global output mode

**Status**: Proposed

**Context**: The script has two output paths, `output_text()` and `output_json()`. A quiet flag could suppress both, or only the human report. Callers that pass `--json` already receive a machine-readable document, and replacing it with a single line would break their parsers.

**Decision**: `--quiet` is read inside `output_text()` only. When `JSON_OUTPUT` is true the JSON path runs unchanged and quiet has no effect.

**Consequences**:
- A caller gets one line from the default path and an unchanged document from the JSON path; no caller loses output.
- The flag's meaning depends on the other flag in play, which must be stated in the help text and pinned by a test.

**Alternatives Rejected**:
- Quiet suppressing JSON too: it would replace a parseable document with a non-JSON line, breaking the only consumers that asked for machine output.
- A separate `--format=level` option: more surface for the same result, and the packet's scope is one flag.

---


---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read the whole task line in `tasks.md`, including its `Verify:` clause.
- [ ] Confirm the target file is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`; this packet changes no other source file.
- [ ] Capture the baseline for the default form before editing.

### Execution Rules

| Rule | Meaning |
|------|---------|
| `TASK-SEQ` | Run tasks in numeric order; T008 depends on the T002 baseline. |
| `TASK-SCOPE` | Touch `recommend-level.sh` only. A need to edit another file is a scope change to raise, not to absorb. |
| `TASK-EVIDENCE` | Mark a task `[x]` only after its `Verify:` command printed the expected output. |

### Status Reporting Format
Report each task as `T### <done|blocked> - <the command run> -> <its output>`. A summary line reports the tasks completed, the tasks blocked and the next task.

### Blocked Task Protocol
Mark the task `[B]` in `tasks.md`, write the blocking command and its output beneath it, and stop. Do not reorder around a blocked task: the verification chain assumes the earlier evidence exists.

---
