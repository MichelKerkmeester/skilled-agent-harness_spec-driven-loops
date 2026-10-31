---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "A presentation-only change: one boolean, one shared level-line function and one new case arm in the argument parser, with a byte diff proving default output did not move."
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
| **Language/Stack** | Bash 3.2 compatible shell, `set -euo pipefail` |
| **Framework** | None. One standalone CLI script. |
| **Storage** | None |
| **Testing** | Existing Node harness (`test-phase-system.js`, `test-phase-validation.js`) plus shell assertions |

### Overview

`--quiet` is a presentation flag, so the change stays inside the argument parser and the text renderer. A new `QUIET_OUTPUT` boolean defaults to false. The parser sets it from `--quiet` or `-q`. `output_text()` hands its first line to a shared `print_recommended_level_line` helper and returns right after it when quiet mode is on. The scoring path does not move, so default output can change only if the shared line changes, and that line is the one thing both modes print.
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
- [ ] Both existing phase suites still pass (27/0 and 51/0)
- [ ] Default output diffs clean against the captured baseline
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-pass pipeline: parse arguments, calculate scores, render output. The script already separates those three stages into numbered sections, and the change touches the first and last only.

### Key Components
- **Argument parser** (`recommend-level.sh:656-719`): the `while`/`case` loop over `$@`. It gains one case arm for `--quiet|-q`.
- **Scorer** (`calculate_loc_score`, `calculate_files_score`, `calculate_risk_score`, `calculate_complexity_score`, `determine_level`, `calculate_confidence`, `determine_phasing`): unchanged.
- **Text renderer** (`output_text`, `recommend-level.sh:508-558`): prints the report. It gains an early return and delegates the level line to the new helper.
- **JSON renderer** (`output_json`, `recommend-level.sh:560-649`): unchanged.
- **`print_recommended_level_line`** (new): the single producer of the `Recommended Level:` literal, used by both the full report and quiet mode.

### Data Flow

```
argv -> case loop -> globals (LOC, FILES, flags, QUIET_OUTPUT)
     -> calculate_* -> TOTAL_SCORE -> determine_level -> RECOMMENDED_LEVEL, LEVEL_NAME
     -> JSON_OUTPUT ? output_json : output_text
     -> QUIET_OUTPUT ? print_recommended_level_line : full report
```

### AI Execution Framework

`tasks.md` owns the execution protocol: the pre-task checklist, the TASK-SEQ/TASK-SCOPE/TASK-VERIFY/TASK-DOC rules, the status format and the blocked-task path. This packet adds one constraint. T003 to T006 all edit one file, so they run in order and never in parallel, and T002 must finish before T003 so a baseline exists to diff against.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a feature, not a fix, and it touches no path handling, environment precedence, schema boundary, persistence layer or shared policy. The output contract is a shared surface, so the inventory below records who produces it and who reads it.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` case loop (`:656-719`) | Owns flag parsing | Update | `grep -n 'quiet' recommend-level.sh` shows one case arm. `--quiet` is accepted, unknown options still exit 1. |
| `output_text()` (`:508-558`) | Sole producer of the `Recommended Level:` literal | Update | `grep -rn 'Recommended Level:' runtime` returns one hit, inside the shared helper |
| `output_json()` (`:560-649`) | Machine-readable output | Unchanged | `diff <(--json) <(--json --quiet)` is empty |
| `show_help()` (`:162-211`) and the header comment block | Option documentation | Update | `--help` lists `--quiet, -q` |
| `runtime/cli/tests/test-phase-system.js` | Programmatic consumer, JSON only | Unchanged | Suite reports `passed=27 failed=0` |
| `runtime/cli/tests/test-phase-validation.js` | Programmatic consumer, JSON only | Unchanged | Suite reports `passed=51 failed=0` |
| Seven files under `references/` | Mention the script by purpose and example | Unchanged | No file lists `--loc`, `--files` or `--json` as recommend-level options, so there is no option list to sync |

Required inventories:
- Same-class producers: `grep -rn "Recommended Level:" .skilled/skills/system-spec-kit/runtime` returns one hit, `recommend-level.sh:510`. There is no second literal to update.
- Consumers of changed symbols: `grep -rln "recommend-level.sh" .skilled/skills/system-spec-kit/runtime --include=*.js --include=*.ts --include=*.cjs --include=*.mjs --include=*.sh` returns the two test files and the script itself. Neither test reads text output.
- Matrix axes: level (0, 1, 2, 3) crossed with output mode (default text, quiet text, JSON) gives 12 rows. Phase output on and off doubles the two text columns, so 20 rows cover the contract.
- Algorithm invariant: not applicable. No path, redaction, parser or security logic changes. The one invariant is "quiet stdout equals the level line of default stdout", enforced by AC-008.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

| Phase | Scope | Exit condition |
|-------|-------|----------------|
| 1 Setup | Read the script and capture the baseline output matrix | `scratch/baseline/` holds one file per matrix row |
| 2 Implementation | Add the boolean, the helper, the early return and the flag | `--quiet` prints one line and `--help` lists it |
| 3 Verification | Compare against the baseline, exercise the edges, run the suites | Every acceptance criterion carries evidence |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Flag parsing and line rendering | `bash` assertions over fixed inputs, `od -c` for the leading-byte check |
| Integration | Existing phase and validation behaviour | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` and `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` |
| Regression | Default output unchanged | `diff` against `scratch/baseline/`, one file per matrix row |
| Manual | One run per level, phase output on and off | Terminal, plus `wc -l` on quiet runs |

Fixtures, one per level. Every row below was run against the current script before this plan was written.

| Fixture | Arguments | Level line today |
|---------|-----------|------------------|
| L0 | `--loc 50 --files 2` | `Recommended Level: 0 (Quick)`, score 11/100 |
| L1 | `--loc 200 --files 5 --api` | `Recommended Level: 1 (Baseline)`, score 35/100 |
| L2 | `--loc 400 --files 10 --api --db` | `Recommended Level: 2 (Verification)`, score 54/100 |
| L3 | `--loc 500 --files 15 --auth --api --db --architectural` | `Recommended Level: 3 (Full)`, score 90/100 |

Four fixtures across three output modes gives 12 rows. Adding phase output on and off to the two text modes brings the matrix to 20.

Baseline recorded before any edit: `test-phase-system.js` reported `passed=27 failed=0` and `test-phase-validation.js` reported `passed=51 failed=0`. Both suites exercise `--json` only, so they guard the JSON contract while the diff guards the text contract.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bash 3.2 and coreutils | Internal | Green | The script cannot run at all, so nothing else matters |
| Node, for the test harness only | Internal | Green | Manual shell checks still cover the change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Default output differs from the baseline, or a quiet run prints anything other than the level line.
- **Procedure**: `git checkout -- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`, or revert the commit that carries the change. One file, no migrations, no stored state.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Implementation) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, Verify |
| Implementation | Setup | Verify |
| Verify | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 35 minutes |
| Verification | Medium | 55 minutes |
| **Total** | | **1 hour 45 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline output captured for every matrix row
- [ ] Change limited to one file
- [ ] Both phase suites pass before the edit

### Rollback Procedure
1. Restore the file from git.
2. Rerun `--loc 200 --files 5 --api` and confirm the report matches the baseline byte for byte.
3. Rerun both phase suites and confirm 27/0 and 51/0.
4. Nothing to notify. The script has no service or user-facing surface.

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
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    T003 ──┼── T004 ──► T005 ──► T006
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| T001 script read | None | Section map and line anchors | T002 |
| T002 baseline capture | T001 | `scratch/baseline/` matrix | T003 to T011 |
| T003 `QUIET_OUTPUT` global | T002 | Default-off boolean | T004 |
| T004 shared line helper | T003 | `print_recommended_level_line` | T005 |
| T005 quiet branch in `output_text` | T004 | One-line text output | T007 |
| T006 flag parsing and help | T003 | `--quiet`/`-q` accepted | T007 |
| T007 to T009 shell checks | T005, T006 | Evidence per edge case | T010 |
| T010 suite rerun | T007 to T009 | 27/0 and 51/0 confirmed | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001 and T002, baseline** - 25 minutes - CRITICAL
2. **T004 and T005, helper plus early return** - 20 minutes - CRITICAL
3. **T007, quiet-line assertions** - 15 minutes - CRITICAL
4. **T010, suite rerun** - 15 minutes - CRITICAL

**Total Critical Path**: about 75 minutes

**Parallel Opportunities**:
- T006 (flag parsing and help text) can run beside T004 and T005, since it touches the case loop and the help block rather than the renderer.
- T008 and T009 can run together once T005 lands, because they compare different outputs.
- T011 (syntax check) can run beside T010.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `scratch/baseline/` holds every matrix row | End of Phase 1 |
| M2 | Flag working | `--quiet` prints one line, default output unchanged by inspection | End of Phase 2 |
| M3 | Verification green | Diff clean, edges covered, both suites pass | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet prints the labeled level line, not a bare integer

**Status**: Accepted

**Context**: A caller needs one value, the level. The script already prints `Recommended Level: <N> (<Name>)` inside the report and already offers `--json` for machine consumption. Quiet mode could print a bare `2`, or suppress everything, or reuse the labeled line.

**Decision**: Quiet mode prints `Recommended Level: <N> (<Name>)`, the exact line the report already prints, and nothing else.

**Consequences**:
- A human can read it and a script can match it with one `grep`. The format is already in use, so no second contract appears.
- A caller that wants an integer still parses this line or uses `--json`. That is acceptable because `--json` already serves machine consumers and this flag does not try to replace it.
- The line must render from one place, or the two modes drift. REQ-007 makes that a requirement rather than a convention.

**Alternatives Rejected**:
- Bare integer: it invents a third output format, loses the level name and gives `--quiet` a different contract from the report.
- No output at all: a silent run tells the caller nothing, and exit codes carry no level.
- Reuse `--json` with a field selector: more machinery than one flag, and it still needs a JSON parser.

---

### ADR-002: `--quiet` leaves `--json` output unchanged

**Status**: Accepted

**Context**: Two output modes exist. The repo already treats `--json` and `--quiet` as a legal combination elsewhere: `validate.sh` accepts both, and `quality-audit.sh:126` calls it that way. Rejecting the pair here would make recommend-level.sh the odd one out.

**Decision**: Quiet mode affects text rendering only. `--quiet --json` prints the same JSON document as `--json`.

**Consequences**:
- Callers can pass `--quiet` in a shared wrapper without special-casing this script, and no new error path appears.
- `--quiet --json` does not mean "only the level". The `--help` text says quiet narrows text output, so the behaviour is stated where a caller looks.
- The JSON contract keeps one shape, which the two existing suites already assert.

**Alternatives Rejected**:
- Reject the combination: it breaks the repo's existing `--json --quiet` idiom for no gain.
- Emit a bare integer under `--json --quiet`: a third format, and it would make the JSON branch depend on the text flag.
- Let `--quiet` drop the JSON fields down to `recommended_level`: it silently changes a machine contract that callers may parse today.

---
