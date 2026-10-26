---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add one output branch to recommend-level.sh so --quiet prints the single recommended-level line, with a mutual-exclusion guard against --json and no change to the default report."
trigger_phrases:
  - "recommend level quiet flag plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T15:33:00Z"
    last_updated_by: "devin-cli"
    recent_action: "Authored the implementation plan for this packet"
    next_safe_action: "Start T001, the baseline capture"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-26-recommend-level-quiet-flag-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
| **Language/Stack** | Bash 3.2+ (POSIX shell script with `[[ ]]` and `case`) |
| **Framework** | None; the script is the SpecKit level helper |
| **Storage** | None; the script holds no state between runs |
| **Testing** | Shell invocations compared by `wc -l`, `diff` and exit code; `bash -n` for syntax |

### Overview

The change adds one boolean global, one parser arm, one conflict guard and one output branch to `recommend-level.sh`. The branch is selected after the scoring pass and before the existing text and JSON dispatch, so the report and the payload keep the code paths they have today. Three command comparisons prove it: the quiet line count is 1, the default line count is 16, and the conflicting flags exit 1.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Output contract captured before the change (T002)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash -n recommend-level.sh` exits 0
- [ ] Default report and JSON payload diff clean against the pre-change captures
- [ ] Help text and header comment name the flag
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-script output selector: one scoring pass, three mutually exclusive output branches.

### Key Components
- **Option parser** (`while [[ $# -gt 0 ]]` loop): recognises `--quiet` and sets `QUIET_OUTPUT=true`.
- **Output selector** (section 7 of the script): chooses the quiet line, the JSON payload or the text report, in that precedence order.
- **`output_text` and `output_json`**: unchanged; the quiet branch returns before either is called.
- **`show_help` and the header comment**: document the flag next to the other options.

### Data Flow

```
argv → option parser → validation (loc/files/threshold)
     → score pass (loc, files, risk, complexity, level, confidence, phasing)
     → output selector
          --quiet            → one line: Recommended Level: N (Name)
          --json             → JSON payload
          default            → 16-line text report
```

The selector reads only the globals the scoring pass already sets, so no scoring code moves.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The change touches a stdout contract that other documents quote, so the inventory below is kept even though this packet is an addition rather than a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` `output_text` | Owns the 16-line report and the `Recommended Level:` label | unchanged; the quiet branch reuses the label | `rg -n 'Recommended Level' recommend-level.sh` prints the label once |
| `recommend-level.sh` `output_json` | Owns the JSON payload | unchanged | `--json` output diffs clean against the T002 capture |
| `recommend-level.sh` option parser and `show_help` | Owns the accepted flags and the help text | update: add `--quiet` and the conflict guard | `--help` lists the flag; `--quiet --json` exits 1 |
| `spec-authoring-card.md` section 2 | Quotes the default invocation as a level-selection step | not a consumer of the new flag; reads the default report | `rg -n 'recommend-level.sh' spec-authoring-card.md` shows the unflagged form |
| `system-spec-kit/SKILL.md` primary-scripts list | Names the script without quoting its output | not a consumer | `rg -n 'recommend-level' SKILL.md` shows the name only |

Required inventories:
- Same-class producers: `rg -n 'echo "Recommended Level' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` names the one producer.
- Consumers of changed symbols: `rg -n 'recommend-level' .skilled/skills/system-spec-kit --glob '*.md'` lists the documents that name the script.
- Matrix axes: the two independent input axes are the output mode (quiet, JSON, default) and the input set (both flags, loc only, files only, neither).
- Algorithm invariant: the scoring pass is untouched, so every mode must report the same level for the same inputs.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

| Step | Acceptance | Verify |
|------|------------|--------|
| 1. Capture the current output | The default report and the JSON payload are stored before any edit | `wc -l scratch/baseline-default.txt` prints 16 |
| 2. Add the flag and its branch | `--quiet` prints one line and the default report is byte-identical | `bash recommend-level.sh --loc 500 --files 15 --quiet \| wc -l` prints 1 |
| 3. Verify the conflict and the docs | `--quiet --json` exits 1 and `--help` lists the flag | `bash recommend-level.sh --quiet --json; echo $?` prints 1 |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The three output modes for a fixed input pair | `bash` invocations compared by `wc -l` and `diff` |
| Integration | The conflict guard and the input-validation errors | `bash` invocations checked for exit code and stderr text |
| Manual | `--help` and the header comment | Read the output of `recommend-level.sh --help` |

The proving commands, in the order they run:

1. `bash recommend-level.sh --loc 500 --files 15 --quiet | wc -l` prints `1`.
2. `bash recommend-level.sh --loc 500 --files 15 | diff - scratch/baseline-default.txt` prints nothing.
3. `bash recommend-level.sh --loc 500 --files 15 --json | diff - scratch/baseline-json.txt` prints nothing.
4. `bash recommend-level.sh --loc 500 --files 15 --quiet --json` prints the error on stderr and exits `1`.
5. `bash -n recommend-level.sh` exits `0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 or newer | Internal | Green | The script cannot run; it already requires this version |
| `coreutils` (`wc`, `diff`) for verification only | External | Green | The checks fall back to reading the output by eye |
| No new package | - | Green | Nothing to install |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report or the JSON payload changes for any input, or the quiet line does not match the pinned pattern.
- **Procedure**: Revert the one commit that touches `recommend-level.sh`, then rerun the five commands in section 5 against the restored file.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: capture the baseline) ──► Phase 2 (Implementation: flag and branch) ──► Phase 3 (Verification: three modes and the guard)
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
| **Total** | | **1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - no data changes; the baseline captures serve as the comparison record
- [x] Feature flag configured - the new flag itself is the switch; the default path is unchanged
- [ ] Monitoring alerts set - not applicable; the script ships with the repository and has no runtime monitor

### Rollback Procedure
1. Revert the commit that changes `recommend-level.sh`.
2. Confirm the reverted file prints 16 lines for `--loc 500 --files 15`.
3. Confirm `--json` matches the stored payload capture.
4. Notify the callers named in the affected-surfaces table if the flag had already been adopted.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; the script persists nothing.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    Phase 1       │────►│    Phase 2       │────►│    Phase 3       │
│  Baseline capture│     │  Flag and branch │     │   Verification   │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | `scratch/baseline-default.txt`, `scratch/baseline-json.txt` | Flag branch, verification |
| `QUIET_OUTPUT` global | None | The flag's state | Parser arm, output selector |
| Parser arm | `QUIET_OUTPUT` | `--quiet` accepted | Conflict guard |
| Conflict guard | Parser arm | Exit 1 for `--quiet --json` | Verification |
| Output selector | Parser arm, scoring pass | The one-line output | Verification |
| Help and header text | Parser arm | Documented flag | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 10 minutes - CRITICAL
2. **Flag, guard and branch** - 30 minutes - CRITICAL
3. **Verification of the three modes** - 20 minutes - CRITICAL

**Total Critical Path**: 1 hour

**Parallel Opportunities**:
- The help text and the header comment can be written while the branch is tested.
- The spec and plan documents are already written, so no documentation work sits on the path.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `scratch/baseline-default.txt` holds 16 lines and the JSON capture parses | Phase 1 |
| M2 | Flag works | `--quiet` prints one line; the default report diffs clean | Phase 2 |
| M3 | Release ready | The conflict guard exits 1, `--help` lists the flag, `bash -n` exits 0 | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reuse the existing level label instead of printing a bare number

**Status**: Proposed

**Context**: A quiet mode has to choose what "the final recommended-level line" means. The script already prints `Recommended Level: N (Name)`, and callers may already match that label with a filter.

**Decision**: `--quiet` prints the same `Recommended Level: N (Name)` line the report carries, without the surrounding blank line.

**Consequences**:
- Positive: an existing filter keeps working, and the flag changes the volume of output rather than the vocabulary.
- Negative: the line carries the level name as well as the number, so a caller that wants the number alone still parses it. Mitigation: the pattern in AC-001 pins both fields, and the name is stable per level.

**Alternatives Rejected**:
- A bare `2`: it invents a second output vocabulary that the report does not use.
- JSON only, with no text mode: `--json` already exists and needs no flag.

### ADR-002: Reject `--quiet` with `--json` rather than pick a winner

**Status**: Proposed

**Context**: Both flags select an output format. If both are accepted, one must silently lose, and the caller learns which only by reading the source.

**Decision**: The combination exits 1 with `ERROR: --quiet cannot be combined with --json` on stderr and nothing on stdout.

**Consequences**:
- Positive: neither contract changes, and a mistaken invocation fails loudly at the first run.
- Negative: a caller that wants one JSON line cannot have it. Mitigation: that is a separate feature; this packet's scope excludes it.

**Alternatives Rejected**:
- Quiet wins: it would print text to a caller that asked for JSON.
- JSON wins: it would ignore a flag the caller passed, which is the silent failure this ADR exists to prevent.

---
