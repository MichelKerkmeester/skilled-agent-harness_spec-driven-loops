---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add an opt-in --quiet/-q flag to recommend-level.sh that prints only the final recommended-level line. The flag is a presentation branch beside the existing text and JSON formatters, so the scoring pipeline and both default outputs stay untouched."
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
| **Language/Stack** | Bash 3.2+ (macOS default shell) and 5.x |
| **Framework** | None; single-file CLI script with `set -euo pipefail` |
| **Storage** | None |
| **Testing** | Bash regression script plus `validate.sh --strict` for this packet |

### Overview
The change adds a third output strategy to `recommend-level.sh`. Argument parsing gains `--quiet` and `-q`, a `QUIET` global records the choice, and the output dispatch in section 7 selects a new `output_quiet()` path ahead of the existing text and JSON paths. Scoring, validation and exit codes are not touched, so the flag is presentation-only and the default behaviour is byte-for-byte unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The recommended-level line captured from the current script for a fixed input

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `test-recommend-level-quiet.sh` passes with zero failures
- [ ] Default text and JSON output diff clean against the pre-change captures
- [ ] `validate.sh --strict` on this packet prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file CLI with three separable stages: argument parsing, pure scoring functions, and output strategies. The change extends the first and third stages only.

### Key Components
- **Argument parser (section 5)**: the `while`/`case` loop that maps argv onto globals. Gains `--quiet|-q`.
- **Scoring pipeline (sections 3 and 6)**: `calculate_*`, `determine_level`, `calculate_confidence`, `determine_phasing`. Unchanged.
- **`output_text()`**: the full human report. Unchanged, but the recommended-level line it prints becomes a shared helper.
- **`output_json()`**: the full JSON object. Unchanged.
- **`output_quiet()`**: new. Prints the one-line answer in text form, or the reduced one-line JSON object when `--json` is also set.

### Data Flow
`argv` → parser sets `LOC`, `FILES`, risk flags, `JSON_OUTPUT`, `QUIET` → numeric validation (unchanged) → scores → `determine_level` sets `RECOMMENDED_LEVEL` and `LEVEL_NAME` → output dispatch: `QUIET` selects `output_quiet`, else `JSON_OUTPUT` selects `output_json`, else `output_text`.

### Quiet Output Contract

| Invocation | stdout |
|------------|--------|
| `--quiet` | `Recommended Level: <N> (<Name>)` — one line, no leading blank line |
| `--json --quiet` | `{"recommended_level": <N>, "level_name": "<Name>"}` — one line |
| no `--quiet` | Unchanged from today |

### Ordering Rule
The dispatch checks `QUIET` before `JSON_OUTPUT`, so `--quiet` wins the combination and the reduced JSON form is emitted from the quiet path rather than from `output_json()`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a feature packet rather than a bug fix, but the flag touches a shared CLI surface, so the inventory below is kept. It records what produces the output, what consumes it, and which of those are deliberately left alone.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` argument parser | Recognises every flag the script accepts | update: accept `--quiet` and `-q` | `rg -n -- '--quiet' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` |
| `output_text()` | Produces the full human report | unchanged; its level line is factored into a shared helper | byte-for-byte diff of default output before and after |
| `output_json()` | Produces the full JSON object | unchanged | byte-for-byte diff of `--json` output before and after |
| `output_quiet()` | Does not exist yet | create | test asserts one line and the exact text |
| `show_help()` | Lists options and examples | update: one OPTIONS row and one example | `bash recommend-level.sh --help \| rg -- '--quiet'` |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Calls the script with `--json --recommend-phases` | unchanged; never passes `--quiet` | `rg -n 'recommend-level.sh' .skilled/commands/speckit/assets` |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Calls the script with `--json --recommend-phases` | unchanged; never passes `--quiet` | same grep |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Lists the script in the folder map | unchanged; carries no flag inventory | `rg -n 'recommend-level' .skilled/skills/system-spec-kit/runtime/cli/spec/README.md` |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/*.md` | Quote `--help` output in scenarios | unchanged; their expectations do not enumerate every flag | `rg -n -- '--help' .skilled/skills/system-spec-kit/manual-testing-playbook` |

Required inventories:
- Same-class producers: `rg -n 'JSON_OUTPUT|RECOMMEND_PHASES' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` — the boolean-flag pattern `--quiet` must copy.
- Consumers of changed symbols: `rg -n 'recommend-level.sh' .skilled --glob '*.yaml' --glob '*.md' --glob '*.sh'` — every caller, to confirm none passes `--quiet` today.
- Matrix axes: `quiet` ∈ {off, on} × `json` ∈ {off, on} × `recommend-phases` ∈ {on, off} × input validity ∈ {valid, invalid} = 16 rows. The test script must cover all 16.
- Algorithm invariant: for any input, the quiet line equals the `Recommended Level:` line the full text report prints for that same input, and quiet mode never changes `RECOMMENDED_LEVEL`, `LEVEL_NAME` or the exit code.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

| Phase | Scope | Exit Condition |
|-------|-------|----------------|
| Phase 1: Setup | Read the parser and output sections, capture the current output, add the flag global | `--quiet` parses without error |
| Phase 2: Implementation | Add `output_quiet()`, wire the dispatch, document the flag, write the test script | The script emits the one-line answer and the help lists it |
| Phase 3: Verification | Run the regression script and the packet validator, record evidence | Test script green; `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Exact quiet line, line count, exit codes, reduced JSON keys, `-q` alias | `test-recommend-level-quiet.sh` with plain bash assertions |
| Regression | Default text output and default `--json` output byte-identical to pre-change captures | `diff` against captures stored in a temp dir |
| Integration | `$(...)` capture and `--json --quiet \| jq -r .recommended_level` | bash and `jq` when available, skipped otherwise |
| Manual | `--help` lists the flag; one human run in each mode | shell |

Test cases the script must assert:
1. Default text output matches the captured baseline byte for byte.
2. Default `--json` output matches the captured baseline byte for byte.
3. `--quiet` produces exactly one line.
4. The quiet line matches `^Recommended Level: [0-3] \((Quick|Baseline|Verification|Full)\)$`.
5. The quiet line equals the `Recommended Level:` line extracted from the full report for the same input.
6. `--json --quiet` is one line and parses as JSON.
7. The reduced object has exactly the keys `recommended_level` and `level_name`.
8. `-q` output is identical to `--quiet` output.
9. `--loc abc --quiet` writes to stderr, writes nothing to stdout, and exits 1.
10. `--quiet --help` prints the help text and exits 0.
11. `--quiet` before `--loc` behaves the same as `--quiet` after it.
12. Every successful mode exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ | Runtime | Green | The script cannot run; no new construct is introduced, so the floor stays where it is |
| `jq` (test only) | External, optional | Green | The JSON integration assertion is skipped; the key-set assertion still runs through `grep` |
| `validate.sh` | Internal | Green | Packet closure cannot be claimed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The change alters default output, or the quiet path cannot be made to match the text report line.
- **Procedure**: Revert the single commit that touches `recommend-level.sh` and delete the new test script. The flag is opt-in and no caller passes it, so no downstream edit is needed.
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
| Setup | Low | 15 minutes |
| Implementation | Low | 1-2 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **2.5-4.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Default-output captures taken before the edit
- [ ] No feature flag needed; `--quiet` is itself the opt-in
- [ ] No monitoring applies; the script is invoked in-process by workflows

### Rollback Procedure
1. Revert the commit that modifies `recommend-level.sh`.
2. Delete `runtime/cli/tests/test-recommend-level-quiet.sh`.
3. Re-run `bash -n` on the script and one default invocation to confirm the restored output.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 1       │────►│   Phase 2        │────►│   Phase 3        │
│   Setup         │     │   Implementation │     │   Verification   │
└─────────────────┘     └──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `QUIET` global and parser case | None | Parsed flag state | `output_quiet()` |
| `output_quiet()` | `QUIET`, `RECOMMENDED_LEVEL`, `LEVEL_NAME`, `JSON_OUTPUT` | One-line answer | Output dispatch |
| Output dispatch | `output_quiet()`, `output_text()`, `output_json()` | Chosen output | Test script |
| Test script | Script change | Pass/fail evidence | Packet closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture default output for a fixed input** - 5 minutes - CRITICAL
2. **Add the flag and the quiet path** - 1 hour - CRITICAL
3. **Wire the dispatch without touching the default paths** - 15 minutes - CRITICAL
4. **Write and run the regression script** - 1-2 hours - CRITICAL

**Total Critical Path**: 2.5-3.5 hours

**Parallel Opportunities**:
- The `--help` and header-comment edits can happen alongside the test script.
- The packet validator run can start once the test script is green.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Flag parses | `--quiet` and `-q` are accepted and set `QUIET` | Phase 1 |
| M2 | Quiet output works | One line in text mode; one-line reduced JSON with `--json` | Phase 2 |
| M3 | Behaviour pinned | Test script green, default output diff clean | Phase 3 |
| M4 | Packet closeable | `validate.sh --strict` prints `RESULT: PASSED` | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet mode prints one line and wins over the full report

**Status**: Proposed

**Context**: Callers need the recommended level without parsing a report. The script already has two full-report modes and no machine-friendly short form. Three shapes were possible: make the short form the default, add a separate `--format` selector, or add a boolean `--quiet` that suppresses everything but the answer.

**Decision**: Add `--quiet` (alias `-q`). In text mode it prints exactly `Recommended Level: <N> (<Name>)` with no leading blank line. When combined with `--json` it prints one line of JSON holding only `recommended_level` and `level_name`. The dispatch checks quiet before JSON, so quiet always wins. `--help` and error paths are unchanged.

**Consequences**:
- A caller can capture the answer with `$(...)` and no trimming.
- The one-line contract is a new public shape that must be pinned by a test, because two output paths now spell the same answer.
- The reduced JSON object is a second JSON shape, which callers must know about; it is documented in `--help` for that reason.

**Alternatives Rejected**:
- Make the short form the default: breaks every existing reader of the full report for no gain.
- Force JSON under `--quiet`: surprises interactive callers and makes the flag mean "machine mode" rather than "answer only".
- Add `--format=level`: a larger parser change with a second flag family to document, for the same single outcome.
- Print the level to stderr and keep stdout empty: backwards for `$(...)` capture and hides the answer from normal piping.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read `recommend-level.sh` sections 5-7 (argument parsing, output functions, main dispatch) before editing
- [ ] Capture the current default text output and `--json` output for one fixed input into `scratch/`
- [ ] Confirm no caller passes `--quiet` today with `rg -n 'recommend-level.sh' .skilled`
- [ ] Confirm the target line is produced by `output_text()` and not assembled anywhere else

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Work Phase 1, then Phase 2, then Phase 3; do not start a phase before its predecessor's exit condition holds |
| TASK-SCOPE | Only `recommend-level.sh` and `runtime/cli/tests/test-recommend-level-quiet.sh`; no scoring, threshold or help-layout edits |
| TASK-PRESERVE | Default text and JSON output must stay byte-identical; a diff is a failure, not a judgement call |
| TASK-EVIDENCE | Record the command and its output for every completed task in `tasks.md` |
| TASK-HALT | Stop and report if the quiet line cannot be made to equal the text report line without changing the text report |

### Status Reporting Format
After each task: `T## complete. Files: <paths>. Evidence: <command> -> <observed line or count>.` At the end of a phase, report the phase exit condition and whether it holds.

### Blocked Task Protocol
If a task is blocked, stop, mark it `[B]` in `tasks.md` with the blocker and the command that reproduced it, and report to the operator. Do not widen scope to work around a blocker; do not edit the default output to make a quiet test pass.
