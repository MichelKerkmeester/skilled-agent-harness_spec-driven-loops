---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add one boolean flag to recommend-level.sh so text output collapses to the recommended-level line, without touching scoring, JSON output or exit codes."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "recommend-level.sh quiet implementation"
  - "quiet flag shell script plan"
importance_tier: "normal"
contextType: "implementation"
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
| **Language/Stack** | Bash, macOS 3.2 compatible and Linux bash 5 |
| **Framework** | None. One standalone script under the system-spec-kit runtime |
| **Storage** | None |
| **Testing** | `test-phase-system.js` and `test-phase-validation.js`, both Node scripts that shell out to the target |

### Overview

Add a `QUIET` boolean beside `JSON_OUTPUT`, set it in the existing option parser, and return early from `output_text()` after printing the level line. The level line keeps its current text and its current place in the function, so there is one formatter rather than two.

The dispatch at the end of the script is untouched. `output_json()` is untouched. The only other edits are the two OPTIONS lists that document the flag.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Consumer inventory recorded in the affected-surfaces table below

### Definition of Done

- [ ] All acceptance criteria met
- [ ] `--quiet` prints one line and exits 0 for every fixture in the test matrix
- [ ] Default text output and JSON output diff clean against the captured baseline
- [ ] Both suites report their baseline counts with the new case added
- [ ] `validate.sh --strict` prints `RESULT: PASSED` for this packet
<!-- /ANCHOR:quality-gates -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before each task, read the target file section you are about to change, confirm the task is in scope, and name the command that will prove the task done. Do not edit `recommend-level.sh` and its test in the same step. Capture the baseline output first, because the diff is the only proof that default behavior survived.

### Execution Rules

| Rule | Requirement |
|---|---|
| `TASK-SEQ` | Capture baselines, then edit the script, then edit the test, then diff and run both suites. |
| `TASK-SCOPE` | Touch `recommend-level.sh` and `test-phase-system.js` only. No other script in `runtime/cli/spec/` changes. |
| `TASK-EVIDENCE` | Report command output, not a summary of it. A passing suite means the printed count and exit code were read. |
| `TASK-COMPAT` | Keep bash 3.2 compatibility. No associative arrays, no `mapfile`, no `${var,,}`. |

### Status Reporting Format

Report each task as `Status: <done|blocked> | Evidence: <command and result> | Next: <one action>`. Quote the exact quiet line once, with its byte count, rather than describing it.

### Blocked Task Protocol

If the default output diff is non-empty, if a suite drops below its baseline, or if the quiet line differs from `Recommended Level: <N> (<Name>)` by even a space, mark the task `BLOCKED`, record the observed output, and fix the cause before touching the test.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file CLI with an output selector. The script already chooses between two output functions at the end of `main`. The flag adds a third behavior inside the text branch rather than a third output function.

### Key Components

- **Option parser**: the `while [[ $# -gt 0 ]]` loop with its `case "$1"` block. `--quiet` joins `--json` here.
- **State**: `QUIET=false` next to `JSON_OUTPUT=false`, in the configuration block above the helper functions.
- **Text formatter**: `output_text()` prints the level line at its top. The quiet branch returns after that line.
- **JSON formatter**: `output_json()` is not modified. It stays the machine-readable path.
- **Help surfaces**: the file-header OPTIONS block and the `show_help` heredoc, which must agree.

### Data Flow

```text
argv
  │
  ▼
option parser ──► QUIET / JSON_OUTPUT / scoring inputs
  │
  ▼
scoring ──► RECOMMENDED_LEVEL, LEVEL_NAME, phase fields
  │
  ▼
dispatch
  ├─ JSON_OUTPUT=true  ──► output_json()   (unchanged)
  └─ JSON_OUTPUT=false ──► output_text()
                            ├─ QUIET=true  ──► level line, return
                            └─ QUIET=false ──► full report (unchanged)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a small behavior addition, not a defect fix. The table records every surface that reads the script so the blast radius is explicit.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/spec/recommend-level.sh` | Producer of the text and JSON reports | Update | Diff default output, assert quiet output |
| `tests/test-phase-system.js` | Invokes the script with `--json` and asserts phase fields | Update | Suite runs, count rises by one case |
| `tests/test-phase-validation.js` | Invokes the script with `--json` over five fixtures | Unchanged | Suite still reports 51 passed |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Calls the script with `--json --recommend-phases` | Unchanged | Command string still matches the help text |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Calls the script with `--json --recommend-phases` | Unchanged | Command string still matches the help text |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Mentions the script in a note only | Unchanged | No invocation to update |
| `runtime/cli/retrieval/fixtures/phrase-variants.json` | Holds the script name as a retrieval phrase | Unchanged | Not an invocation |

Required inventories:

- Same-class producers: `grep -rn 'recommend-level' --include='*.sh' .skilled/skills/system-spec-kit/runtime/cli/spec` returns `recommend-level.sh` only. No second script prints a level line.
- Consumers of changed symbols: the four invocations above are all `--json`. No caller parses the text output today, so `--quiet` cannot break an existing parser.
- Matrix axes: two independent axes, output mode (`default`, `--no-recommend-phases`, `--json`, `--quiet`, `--quiet --json`) and flag position (`--quiet` first, last, repeated). Every cell has an expected line count.
- Algorithm invariant: the recommended level, level name and confidence are computed before any formatter runs, so output mode cannot change them. The quiet line is the first line `output_text()` prints, which keeps it identical in both modes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

The sequence is fixed by evidence order. Baselines are captured before the first edit, the script changes before the test, and the diff and suite runs close the phase. A test written against an unedited script proves nothing.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The quiet line shape, the JSON precedence and the error path | New case in `test-phase-system.js` |
| Regression | Default text output and JSON output over a fixed fixture set | `diff` against captured baselines in `scratch/` |
| Suite | Phase field and fixture contracts for the script | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` |
| Suite | Phase recommendation and parent append behavior | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` |
| Manual | `--help` shows the flag, `--quiet --help` exits 0 | One shell invocation each |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2 or newer | External | Green | The flag syntax works on every bash the repo supports |
| Node, for the two test suites | External | Green | Without it, only manual shell checks are possible |
| `test-phase-system.js` baseline of 27 passed | Internal | Green | The count is the regression floor |
| `test-phase-validation.js` baseline of 51 passed | Internal | Green | The count is the regression floor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default output diff is non-empty, or a suite drops below its baseline and the cause is the flag.
- **Procedure**: Revert the two files to the previous revision. The change adds lines only, so reverting is a plain checkout of the two paths.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: baselines) ──┐
                             ├──► Phase 2 (Implementation) ──► Phase 3 (Verification)
Phase 1.5 (Consumer scan) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Consumer scan | Setup | Implementation |
| Implementation | Setup, Consumer scan | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Implementation | Low | 30 minutes |
| Verification | Low | 30 minutes |
| **Total** | | **About 1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Baseline text and JSON output captured in `scratch/`
- [ ] Both suite baselines recorded, 27 and 51 passed
- [ ] No feature flag needed. The new behavior is opt-in by flag.

### Rollback Procedure

1. Revert `recommend-level.sh` to the previous revision.
2. Revert `test-phase-system.js` to the previous revision.
3. Run both suites and confirm 27 and 51 passed.
4. Confirm `--quiet` is rejected again as an unknown option, which proves the revert landed.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Baseline capture│────►│  Script edit     │────►│  Diff and suites │
│  text and JSON   │     │  flag and branch │     │  evidence        │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
                                  │
                         ┌────────▼─────────┐
                         │  Test case edit  │
                         │  quiet assertion │
                         └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | `scratch/baseline-*.txt` | Script edit, diff |
| Script edit | Baseline capture | Flag, help text, quiet branch | Test case edit, diff |
| Test case edit | Script edit | Quiet assertion | Suite run |
| Diff and suite run | Script edit, Test case edit | Closure evidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture baseline output** - 10 minutes - CRITICAL
2. **Edit `recommend-level.sh`** - 25 minutes - CRITICAL
3. **Edit `test-phase-system.js`** - 15 minutes - CRITICAL
4. **Diff and run both suites** - 15 minutes - CRITICAL

**Total Critical Path**: About 65 minutes.

**Parallel Opportunities**:
- The consumer scan can run while baselines are captured.
- The help-text edit can run after the parser edit, since it touches no executable line.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines captured | Text and JSON output saved for the fixture set, both suite counts recorded | Phase 1 |
| M2 | Flag works | `--quiet` prints one line and `--quiet --json` prints the full document | Phase 2 |
| M3 | Proof recorded | Default output diff empty, both suites pass, packet validates | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: `--quiet` governs text output only

**Status**: Accepted

**Context**: The script has two output modes already. A caller can ask for human text or for a JSON document. A third flag has to say what it does when combined with `--json`, otherwise the two flags fight and the behavior depends on parse order.

**Decision**: `--quiet` applies to text output. When `--json` is present, JSON wins and the flag has no effect on the document. The flag is still accepted, so a caller can pass both without an error.

**Consequences**:
- Positive: JSON keeps one stable shape for its four consumers.
- Negative: `--quiet --json` does not shorten the output. Mitigated by documenting the precedence in the OPTIONS line rather than leaving it implicit.

**Alternatives Rejected**:
- Minimal JSON under `--quiet`: it would add a second JSON shape, and every consumer would need to know which one it receives.
- Rejecting the combination: it would turn a harmless pair of flags into a runtime error.

### ADR-002: Reuse the existing level line

**Status**: Accepted

**Context**: The quiet output must be exactly the level line. Two ways exist to produce it. One adds an `output_quiet()` function with its own `echo`. The other returns early from `output_text()` after the existing `echo`.

**Decision**: Return early from `output_text()`. The line text lives in one place.

**Consequences**:
- Positive: A future change to the level line, such as adding a suffix, reaches both modes automatically.
- Negative: `output_text()` carries one extra branch. It is a single comparison, and the function stays readable.

**Alternatives Rejected**:
- A separate `output_quiet()` function: two `echo` statements for one line invites drift, and the second one would not be covered by the existing text-mode reasoning.

---

