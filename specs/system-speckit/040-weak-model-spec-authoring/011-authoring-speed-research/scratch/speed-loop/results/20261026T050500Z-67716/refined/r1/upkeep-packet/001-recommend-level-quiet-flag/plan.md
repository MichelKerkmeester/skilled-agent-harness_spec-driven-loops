---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add one boolean flag and one output branch to the SpecKit level helper, route both text paths through a shared level-line helper, and prove the change with a byte-diff baseline plus a line count."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "recommend-level quiet implementation plan"
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
| **Language/Stack** | Bash 3.2+, the macOS system shell |
| **Framework** | None: one shell script, `set -euo pipefail` |
| **Storage** | None |
| **Testing** | `bash -n`, a byte-diff against a captured baseline, and the existing `node tests/test-phase-system.js` / `node tests/test-phase-validation.js` suites |

### Overview

The change touches one script: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. It adds a `QUIET` boolean to the globals block, one `case` arm to the argument parser, one mutual-exclusion guard against `--json`, and one branch in the output dispatch. Both text paths call a new `print_level_line()` helper so the label has exactly one definition.

The proof is a byte-diff, not an opinion. The pre-change output for `--loc 500 --files 15` is captured to a baseline file before the edit and compared after it, and the quiet form is checked for exactly one line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Baseline output captured for `--loc 500 --files 15` (16 lines)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Default output byte-identical to the captured baseline
- [ ] `--quiet` prints exactly one line and exits 0
- [ ] Both help surfaces name `--quiet`
- [ ] `bash -n recommend-level.sh` exits 0
- [ ] Docs updated (spec/plan/tasks/acceptance)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script dispatch: one parser, one scoring core, one output stage.

### Key Components
- **Argument parser** (`while [[ $# -gt 0 ]]`, line 656): reads flags into globals; gains one `--quiet` arm that sets `QUIET=true` and calls `shift`.
- **`print_level_line()`** (new, in the helper block near line 500): prints `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})`. The only place that format string exists.
- **`output_text()`** (line 508): the 16-line report; its level line becomes a call to the helper, so its bytes do not change.
- **Output dispatch** (line 770): gains a quiet branch ahead of the JSON and text branches.
- **`show_help()`** (line 162) and the header OPTIONS block (lines 16-27): both list the new flag.

### Data Flow

`argv` → parser sets `LOC`, `FILES`, risk flags, `JSON_OUTPUT`, and now `QUIET` → numeric validation → scoring (`SCORE_LOC`, `SCORE_FILES`, `SCORE_RISK`, `SCORE_COMPLEXITY` → `TOTAL_SCORE`) → `determine_level()` sets `RECOMMENDED_LEVEL` and `LEVEL_NAME` → `calculate_confidence()` → `determine_phasing()` → dispatch picks exactly one of the quiet line, the JSON document, or the text report. Quiet reads only state that the text path already computes, so it adds no scoring work.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` `output_text()` | Producer of the 16-line text report | update: call `print_level_line()` | `rg -n 'print_level_line' recommend-level.sh` prints both call sites |
| `recommend-level.sh` parser | Consumer of flags | update: accept `--quiet` | `bash recommend-level.sh --quiet --loc 500 --files 15` exits 0 |
| `recommend-level.sh` `show_help()` and header OPTIONS | Documentation of the flag set | update: list `--quiet` | `bash recommend-level.sh --help \| rg -c -- '--quiet'` prints 2 |
| `runtime/cli/tests/test-phase-system.js`, `test-phase-validation.js` | Consumers of the script's output | not a consumer of `--quiet`: both run without it | `rg -n -- '--quiet' tests/*.js` prints nothing |
| `check-completion.sh` | Sibling script whose `--quiet` means exit-code-only | unchanged: different script, different contract | `rg -n -- '--quiet\|-q' check-completion.sh` prints the existing line |

Required inventories:
- Same-class producers: `rg -n 'Recommended Level' .skilled/skills/system-spec-kit/runtime/cli/spec/*.sh` → one hit, `recommend-level.sh:510`. The format string has one producer today and keeps one after the change.
- Consumers of changed symbols: `rg -ln 'recommend-level' .skilled/skills/system-spec-kit --glob '*.sh' --glob '*.js' --glob '*.ts'` → the script itself and the two test suites. No shell caller parses the text report.
- Matrix axes: `--quiet` (on/off) × output mode (text/JSON) × input validity (valid/invalid), which is 8 rows, plus flag order and flag repetition as two more.
- Algorithm invariant: this is not a path, redaction or parser-security fix. The invariant it does carry is that the quiet path and the text path emit the same level string, which `print_level_line()` enforces structurally.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the ordered task list and its checkboxes. The plan has three steps, in this order.

### Step 1: Capture the baseline

Acceptance: the pre-change output for the reference input is on disk and its line count is known.
Verify: `bash recommend-level.sh --loc 500 --files 15 > scratch/baseline.txt; wc -l < scratch/baseline.txt` prints `16`.

### Step 2: Add the flag, the guard and the helper

Acceptance: `--quiet` prints one line, the default report is unchanged, and the `--json` pair exits 1.
Verify: `bash recommend-level.sh --quiet --loc 500 --files 15 | wc -l` prints `1`, and `diff scratch/baseline.txt <(bash recommend-level.sh --loc 500 --files 15)` prints nothing.

### Step 3: Verify and document

Acceptance: the help surfaces list the flag and every acceptance criterion has evidence.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-recommend-level-quiet-flag --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The quiet branch, the mutual-exclusion guard and `print_level_line()` | `bash -n`, direct invocation with `wc -l` |
| Integration | The text and JSON output paths against the captured baseline | `diff`, `node tests/test-phase-system.js`, `node tests/test-phase-validation.js` |
| Manual | Flag order, flag repetition, `--help`, and the two error paths | shell |

The baseline is a file, not a memory. Step 1 writes `scratch/baseline.txt` before any edit, and Step 2 diffs against it, so "unchanged" is a byte comparison rather than a reading of the code. The two Node suites already drive this script through its JSON and phase paths, so they are the regression net for everything the diff cannot see, such as the phase fields.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bash 3.2+ | Internal | Green | The script cannot run at all; every invocation fails |
| `diff` and `wc` | Internal | Green | The byte-diff proof is weaker; fall back to `cmp` and `rg -c` |
| `node` for the two existing suites | Internal | Green | Regression coverage drops to the manual matrix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the default report differs from `scratch/baseline.txt` in any byte, or any existing suite fails.
- **Procedure**: revert the single commit that carries the script change, then rerun the baseline diff and both suites. The packet documents are untouched by the revert and can stay.
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
| Core Implementation | Low | 30 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **About 1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline captured to `scratch/baseline.txt`
- [ ] No feature flag: the flag itself is the switch, and its absence is the old behaviour
- [ ] No monitoring: the script is invoked by hand or by a caller, not by a service

### Rollback Procedure
1. Revert the commit that changes `recommend-level.sh`.
2. Confirm `git diff HEAD~1 -- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` is empty after the revert.
3. Rerun `diff scratch/baseline.txt <(bash recommend-level.sh --loc 500 --files 15)`; it prints nothing.
4. Rerun both Node suites; they exit 0.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the script writes no file and holds no state between runs.
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
                     │  Parallel │
                     └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | `scratch/baseline.txt` | Verification |
| `print_level_line()` | None | One format string | `output_text()`, quiet branch |
| Quiet branch and `--json` guard | `print_level_line()`, parser | One-line output, exit-1 pair | Verification |
| Help surfaces | The flag name | Documented flag | Verification |
| Verification | All of the above | Evidence rows in `tasks.md` | Closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 10 minutes - CRITICAL
2. **Helper, parser arm and dispatch branch** - 30 minutes - CRITICAL
3. **Line-count and byte-diff verification** - 20 minutes - CRITICAL

**Total Critical Path**: about 1 hour

**Parallel Opportunities**:
- The header OPTIONS block and `show_help()` text can be edited while the dispatch branch is written.
- The packet's own documents can be updated while the verification matrix runs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `wc -l < scratch/baseline.txt` prints 16 | Phase 1 |
| M2 | Flag implemented | `--quiet` prints 1 line and `--quiet --json` exits 1 | Phase 2 |
| M3 | Verified | Baseline diff is empty and `validate.sh --strict` prints `RESULT: PASSED` | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Name the flag `--quiet`, long form only

**Status**: Accepted

**Context**: The brief names `--quiet`. The sibling script `check-completion.sh` already accepts `--quiet|-q`, but there it means "suppress output, exit code only", which is a different contract: a caller learns the answer from `$?`. `recommend-level.sh` exists to report a level, so a flag that prints nothing would leave the caller with nothing to read.

**Decision**: Accept `--quiet` and no short alias. Under the flag, print the level line and nothing else. Do not change `check-completion.sh`.

**Consequences**:
- A caller gets the answer on stdout, which is what this script is for.
- Two scripts in one directory now give `--quiet` different meanings. The help text states this script's meaning in the OPTIONS list, and the divergence is recorded here rather than hidden.

**Alternatives Rejected**:
- `--level-only`: unambiguous, but the brief fixes the name and a second name for the same idea is worse than a documented divergence.
- `--quiet|-q` matching `check-completion.sh` exactly: would mean printing nothing, which contradicts the requirement.
- Exit-code-only `--quiet`: a caller would still have to know the level-to-exit-code mapping, which does not exist.

---

### ADR-002: Make `--quiet` and `--json` mutually exclusive

**Status**: Accepted

**Context**: `--quiet` promises exactly one line of text. `--json` promises a full JSON document. Both cannot be true, and silently honouring one would break the other flag's stated contract.

**Decision**: The pair exits 1 with `ERROR: --quiet and --json cannot be combined` on stderr and an empty stdout. The guard runs after argument parsing and before scoring.

**Consequences**:
- A caller that passes both learns immediately instead of receiving output that does not match a flag it asked for.
- The guard is one more error path to test, which T006 covers.

**Alternatives Rejected**:
- Quiet wins: silently drops `--json`, so a script that asked for machine-readable output gets a bare line.
- JSON wins: silently drops `--quiet`, so a caller that wanted one line gets 36.
- Merge them: a one-line JSON object is a third output contract and out of scope.

---

### ADR-003: Print the level line through one helper

**Status**: Accepted

**Context**: The level line is a format string in `output_text()`. Adding a second copy in the quiet branch would create two definitions of a string that callers may match on, and the two would drift the first time either is edited.

**Decision**: Add `print_level_line()` and call it from `output_text()` and from the quiet branch. The helper reads the globals and prints one line.

**Consequences**:
- The label has one definition, so the quiet and text paths cannot disagree.
- `output_text()` gains an indirection, which is invisible in its output and covered by the byte-diff.

**Alternatives Rejected**:
- Duplicate the `echo` in both branches: smallest diff, but two sources of truth for a caller-facing string.
- Move the whole report into a function and parameterise it: larger refactor than the feature needs.
