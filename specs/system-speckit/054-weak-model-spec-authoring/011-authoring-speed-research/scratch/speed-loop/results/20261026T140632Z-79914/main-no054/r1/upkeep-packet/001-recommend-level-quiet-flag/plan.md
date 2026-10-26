---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a QUIET global and a --quiet parser arm to recommend-level.sh, then have output_text() return after the recommended-level line. A small helper prints that line so the quiet and full paths share one format."
trigger_phrases:
  - "recommend level quiet flag plan"
importance_tier: "normal"
contextType: "general"
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
| **Language/Stack** | Bash, with the `[[ ]]` tests the script already uses |
| **Framework** | None. Single script in the SpecKit CLI |
| **Storage** | None |
| **Testing** | Direct CLI runs with `diff` and `wc -l`, plus the existing `test-phase-system.js` suite |

### Overview

The change touches one script. A `QUIET` global joins the other output flags, the parser learns `--quiet`, and `output_text()` returns after the level line when the flag is set. A small helper prints the level line so the quiet and full paths cannot drift.
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
- [ ] Baseline diff shows no change without the flag
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file CLI pipeline: parse arguments, validate inputs, score, format output. The new flag changes only the last stage.

### Key Components
- **Argument parser**: maps flags to globals. Gains one case arm for `--quiet`.
- **Scoring engine**: `calculate_loc_score`, `calculate_files_score`, `calculate_risk_score`, `calculate_complexity_score`, `determine_level` and `determine_phasing` stay unchanged.
- **`output_text()`**: gains an early quiet branch that prints one line and returns.
- **`output_json()`**: unchanged.
- **`show_help()` and the header comment**: gain the option text.

### Data Flow

`argv` reaches the parser, which fills `LOC`, `FILES`, the risk flags and `QUIET`. Input validation runs next, then the four score functions, then `determine_level`. Output goes to `output_text` or `output_json`. In quiet mode `output_text` stops after the level line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a feature, not a fix. The table still lists the surfaces that observe the output.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `output_text()` | Owns the human report | Add the quiet branch | AC-001, AC-002 |
| `output_json()` | Owns the machine report | Unchanged | AC-009 |
| Argument parser | Owns flag mapping | Add `--quiet` | AC-001, AC-010 |
| `show_help()` | Owns user-facing usage | Add the option and example | AC-006 |
| Header comment block | Owns file-level usage | Add the option | AC-007 |
| `test-phase-system.js` | Runs the script end to end | Re-run for regressions | AC-011 |

Required inventories:
- Same-class producers: `grep -n "QUIET\|JSON_OUTPUT\|RECOMMEND_PHASES" recommend-level.sh` lists every output-mode global.
- Consumers of the level line: `grep -rn "Recommended Level:" . --glob '*.sh' --glob '*.js' --glob '*.md'` shows who parses it.
- Matrix axes: flag present (yes or no), output mode (text or JSON) and phase option (default or off) give eight rows. AC-001 through AC-010 cover the reachable cells.
- Algorithm invariant: in quiet text mode, stdout holds exactly one newline-terminated line, and that line equals the one the full report prints.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### AI Execution Protocol

#### Pre-Task Checklist
- [ ] Read `spec.md`, this plan and `tasks.md` before the first edit
- [ ] Capture the three baseline outputs into `scratch/` before touching the script
- [ ] Confirm the verification command for each task before starting it

#### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run T001 through T003 before any edit, then T004 through T009 in order |
| TASK-SCOPE | Edit only `recommend-level.sh`. Report anything else as a finding |
| TASK-VERIFY | Run the task's command and read its output before marking it complete |

#### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

#### Blocked Task Protocol
1. Mark the task BLOCKED and state the blocking fact
2. Record the fact in the task line
3. Continue with the next unblocked task and escalate after two blocked tasks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Quiet branch, line format, flag parsing | `bash` invocation with `diff`, `wc -l` and `grep` |
| Integration | Flag combinations and error paths | Shell loop over the matrix in `tasks.md` |
| Regression | Existing phase and level behavior | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` |
| Manual | `--help` readability | Terminal run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2 or newer | Internal | Green | The script already requires it |
| `recommend-level.sh` in its current form | Internal | Green | The baseline capture depends on it |
| `test-phase-system.js` | Internal | Green | Regression evidence would be manual only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The baseline diff shows a change without `--quiet`, or quiet mode prints more than one line.
- **Procedure**: `git checkout -- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` restores the previous script. The change adds no data and no migration.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
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
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 30 minutes |
| **Total** | | **About 75 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline outputs stored in `scratch/`
- [ ] No feature flag needed, the new flag is opt-in
- [ ] No monitoring change, the script is a local CLI

### Rollback Procedure
1. Restore the file with `git checkout --`
2. Run the baseline diff again
3. Confirm `--help` no longer lists `--quiet`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Three reference files | Quiet branch work |
| Parser arm | Baseline capture | `QUIET` global | Output branch |
| Output branch | Parser arm | One-line quiet report | Verification |
| Verification | Output branch | Acceptance evidence | Closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T002 baseline capture** - 15 minutes - CRITICAL
2. **T005 parser arm and T007 output branch** - 30 minutes - CRITICAL
3. **T010 through T012 verification** - 30 minutes - CRITICAL

**Total Critical Path**: about 75 minutes

**Parallel Opportunities**:
- T008 and T009, the two documentation edits, can run together after T005
- T016 regression suite can run while T014 error cases run
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Three files in `scratch/` | Phase 1 |
| M2 | Flag works | Quiet output is one line | Phase 2 |
| M3 | Verified | All acceptance criteria met | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Keep JSON output unchanged under --quiet

**Status**: Proposed

**Context**: `--quiet` reduces the human report. The script also has a JSON mode that already emits one machine-readable payload. Two readings exist: leave JSON alone, or trim it to one key.

**Decision**: `--quiet` affects `output_text()` only. JSON output stays unchanged and the help text says so.

**Consequences**:
- Existing JSON consumers see no change.
- A caller that wants one key from JSON must keep parsing the object.

**Alternatives Rejected**:
- Trim JSON to `recommended_level`: it breaks the documented payload shape and creates two quiet contracts.
- Make `--quiet --json` an error: it rejects a harmless combination and adds a failure path.

---

### ADR-002: Print the level line through one helper

**Status**: Proposed

**Context**: The quiet path needs the same line the full report prints. A duplicated literal can drift.

**Decision**: Add `print_recommended_level_line()` and call it from both paths.

**Consequences**:
- The format has one definition.
- The full report gains one function call in place of an `echo`.

**Alternatives Rejected**:
- Duplicate the literal in the quiet branch: smallest diff, highest drift risk.
- Move the whole report into a formatter with a verbosity parameter: more churn than the feature needs.

---
