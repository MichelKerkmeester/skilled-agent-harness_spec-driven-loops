---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Adds an opt-in output mode to a single bash script, keeps the default report byte-identical, and proves both claims with a fixture matrix and two existing regression suites."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "recommend-level quiet implementation"
  - "quiet output dispatch"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2+, the shell macOS ships |
| **Framework** | None; one self-contained script |
| **Storage** | None |
| **Testing** | Node.js vitest for the new fixture matrix, plus the two existing node suites that already execute the script |

### Overview
Add a boolean `--quiet` option to `recommend-level.sh` and route output through a third strategy beside the existing text and JSON paths. A single formatter owns the level line so the quiet path and the default report cannot diverge, and the JSON path keeps precedence so machine consumers never receive text. Verification compares the default report byte for byte against a pre-change baseline.
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
Single-file CLI: a parse loop, a pure scoring pipeline, then an output strategy chosen at the end.

### Key Components
- **Option parser**: the `while [[ $# -gt 0 ]]; case "$1" in` loop that maps argv to globals. `--quiet` joins the boolean arms next to `--json`.
- **Scoring pipeline**: `calculate_loc_score`, `calculate_files_score`, `calculate_risk_score`, `calculate_complexity_score`, `determine_level`, `calculate_confidence`, `determine_phasing`. None of these change.
- **Level-line formatter**: one helper that emits `Recommended Level: <level> (<name>)`. `output_text` and the new `output_quiet` both call it.
- **Output strategies**: `output_text` for the report, `output_json` for the machine payload, `output_quiet` for the single line. Dispatch picks one.

### Data Flow
argv enters the parse loop and sets `LOC`, `FILES`, the risk flags, `RECOMMEND_PHASES`, `PHASE_THRESHOLD`, `JSON_OUTPUT` and the new `QUIET`. Validation rejects bad input on stderr before any scoring. The scoring pipeline fills `TOTAL_SCORE`, `RECOMMENDED_LEVEL`, `LEVEL_NAME`, `CONFIDENCE` and the phase fields. The dispatch at section 7 then selects JSON, quiet or text. stdout carries the selected output only, stderr carries every diagnostic, and the exit code is `0` on success or `1` on user error.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` option parser | Owns every accepted flag | Update: add a `--quiet` arm beside `--json` | `rg -n "json\\|-j\\|quiet" .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` shows one arm per flag |
| `output_text` | Owns the human report | Update: call the shared level-line formatter | Byte diff of stdout against the pre-change baseline |
| `output_json` | Owns the machine payload | Unchanged; keeps precedence over quiet | `test-phase-system.js` and `test-phase-validation.js` parse this payload |
| `show_help` and the header OPTIONS comment | Own the documented option list | Update: add `--quiet` in both places | `recommend-level.sh --help` lists the flag; header block matches |
| `cli/tests/test-phase-system.js`, `cli/tests/test-phase-validation.js` | Consumers that invoke the script with `--json` | Unchanged, must keep passing | Run both suites |
| `create.sh` and other shell callers | May invoke the script | Not a consumer of the text report | `rg -n "recommend-level.sh" --glob '*.sh' .skilled` finds no caller that parses stdout |

Required inventories:
- Same-class producers: `rg -n "Recommended Level:" .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` must return one formatter and no second literal.
- Consumers of changed symbols: `rg -n "JSON_OUTPUT|output_text|output_json|QUIET" .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`.
- Matrix axes: flag set (none, quiet, json, quiet plus json), phase output (default, `--no-recommend-phases`), input validity (valid, invalid), repetition (single, doubled). Every axis combination that can change output gets a row.
- Algorithm invariant: not applicable. This change adds no path, parser, resolver, redaction or security logic; it selects which of three existing renderers prints.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

| Phase | Goal | Exit Condition |
|-------|------|----------------|
| 1. Setup | Capture the pre-change baseline and the exact level-line format | Six baseline stdout captures and exit codes stored in `scratch/` |
| 2. Implementation | Add the flag, the formatter, the quiet strategy and the dispatch branch | `--quiet` prints one line; default output untouched |
| 3. Verification | Prove both behaviors and run the regression suites | New test file green, both existing suites green, byte diff empty |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The three output strategies and the shared level-line formatter, one fixture per level 0 through 3 | `cli/tests/recommend-level-quiet.vitest.ts` via vitest |
| Integration | JSON payload stability and the parse-arm ordering | `cli/tests/test-phase-system.js`, `cli/tests/test-phase-validation.js` |
| Manual | Read `--help`, run the three documented examples with and without `--quiet` | Shell, byte diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 or newer | External | Green | The script cannot run; no workaround |
| `node` and the repository's vitest install | Internal | Green | The new test file cannot run; fall back to a shell fixture script |
| `cli/tests/test-phase-system.js` and `cli/tests/test-phase-validation.js` | Internal | Green | Regression coverage for the JSON path drops to manual checks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report differs from the pre-change baseline, or a JSON consumer breaks.
- **Procedure**: Revert the commit that touches `recommend-level.sh` and the new test file. The change is additive, so the revert restores the original behavior with no data or config step.
<!-- /ANCHOR:rollback -->

---

## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Read `tasks.md` and take the next unchecked task in order.
- Confirm the task's file path exists and the section it edits still matches this plan.
- Re-read the part of `recommend-level.sh` the task touches before editing it.

### Execution Rules
- TASK-SEQ: follow T001 through T015 in order. T003 and T010 may run in parallel with their neighbours.
- TASK-SCOPE: edit only the two files named in `spec.md` section 3. Stop and report if a third file needs a change.
- Do not touch scoring, thresholds, phase math or the JSON payload.

### Status Reporting Format
Report each task as `T### <state> - <evidence>`, for example `T005 done - quiet arm added to the option loop`.

### Blocked Task Protocol
Mark a task `[B]` and record the blocker on one line when a dependency is missing or a file no longer matches this plan. Do not start a task that depends on it.

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Baseline) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Baseline |
| Baseline | Setup | Core |
| Core | Setup, Baseline | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Core Implementation | Low | 25 minutes |
| Verification | Medium | 30 minutes |
| **Total** | | **About 65 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- No data changes, so no backup step applies.
- No feature flag: the behavior is opt-in at the call site through `--quiet`.
- No monitoring surface: the script writes to stdout and stderr only.

### Rollback Procedure
1. Revert the single commit that touches `recommend-level.sh` and the new test file.
2. Re-run the baseline matrix from Phase 1 and confirm the default report matches byte for byte.
3. Re-run both existing suites to confirm the JSON path is intact.
4. Notify anyone who adopted `--quiet` in the same window; the flag disappears with the revert.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable; the script stores nothing.
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
                    │  Phase 2b │
                    │  Help text│
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Six stdout captures and exit codes | Formatter, dispatch |
| Shared level-line formatter | Baseline capture | One level-line format | Quiet output |
| `output_quiet` | Formatter | One-line stdout | Dispatch |
| Dispatch branch | `output_quiet`, `output_json` | The selected output | Test matrix |
| Test matrix | Dispatch branch | Pass or fail evidence | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 10 minutes - CRITICAL
2. **Flag, formatter and quiet strategy** - 25 minutes - CRITICAL
3. **Fixture matrix and regression suites** - 30 minutes - CRITICAL

**Total Critical Path**: about 65 minutes

**Parallel Opportunities**:
- The help text and header comment can be written while the formatter is being reviewed.
- The two existing regression suites can run while the byte diff runs, since they read the same file and write nothing.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Six invocations recorded with stdout and exit code | End of Phase 1 |
| M2 | Flag implemented | `--quiet` prints one line; default output unchanged | End of Phase 2 |
| M3 | Verification green | New test file, both suites and the byte diff all pass | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: JSON keeps precedence over quiet

**Status**: Accepted

**Context**: A caller can pass both `--json` and `--quiet`. The script has to pick one output, and the choice decides whether a machine consumer receives JSON or a plain-text line.

**Decision**: `--json` wins. When both flags are present, the script emits the JSON document and ignores `--quiet`.

**Consequences**:
- Positive: existing JSON consumers, including the two test suites, cannot receive text by accident.
- Negative: a caller that wanted the one-line text alongside JSON cannot get both from one invocation. Mitigation: the JSON payload already carries `recommended_level` and `level_name`, so the caller reads those fields instead.

**Alternatives Rejected**:
- Quiet wins over JSON: this turns a structured payload into a text line for any caller that adds `--quiet` later, which is a silent break.
- Reject the combination with an error: this adds a failure mode for a harmless pair of flags and forces callers to branch before invoking.

---

### ADR-002: One formatter owns the level line

**Status**: Accepted

**Context**: The quiet line must match the first line of the default report. Two literals would drift the first time someone edits the report.

**Decision**: Extract the line into a helper that both `output_text` and `output_quiet` call.

**Consequences**:
- Positive: a format change lands in one place, and the quiet path inherits it.
- Negative: `output_text` now depends on a helper for its first line. Mitigation: the byte diff proves the rendered output did not change.

**Alternatives Rejected**:
- Duplicate the `echo` in both functions: cheap now, and wrong the first time the report is reworded.
- Make quiet print the whole report minus sections: more branches, and the result is still multi-line.

---
