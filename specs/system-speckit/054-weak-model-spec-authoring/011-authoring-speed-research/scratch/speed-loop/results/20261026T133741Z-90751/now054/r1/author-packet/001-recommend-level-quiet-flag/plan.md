---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Adds a --quiet branch to the output selector in recommend-level.sh so callers get one parseable level line, while the default report and the JSON document stay untouched."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "recommend-level.sh output selector"
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
| **Language/Stack** | Bash 3.2+ (macOS default) and Bash 5.x, using `set -euo pipefail` |
| **Framework** | None - a standalone shell script with a hand-written `while`/`case` argument parser |
| **Storage** | None - the script holds no state between runs |
| **Testing** | `bash -n` for syntax, plus the existing Node suite at `runtime/cli/tests/test-phase-system.js` |

### Overview
One file changes: `recommend-level.sh` gains a `QUIET_OUTPUT` global, one parser case, one branch in the output selector and two documentation edits. The quiet branch prints `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` and returns, so the default renderer is never entered and its output cannot drift. The proof is a line count on both invocations: 1 line with `--quiet`, and the same 16 or 17 lines without it.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script with an output selector. The script already separates scoring from rendering; this change adds one more choice to the selector rather than a new rendering path.

### Key Components
- **Argument parser**: the existing `while [[ $# -gt 0 ]]` / `case "$1"` loop gains a `--quiet)` arm that sets `QUIET_OUTPUT=true` and shifts.
- **Output selector**: the final `if [[ "$JSON_OUTPUT" = true ]]` block becomes three-way - JSON, then quiet, then the full report - so precedence is written down in one place.
- **`show_help()` and the usage header**: both list `--quiet` beside the other options, so `--help` and the file header agree.

### Data Flow
`argv` enters the parser, which fills `LOC`, `FILES`, the four risk flags, `RECOMMEND_PHASES`, `PHASE_THRESHOLD`, `JSON_OUTPUT` and the new `QUIET_OUTPUT`. Scoring runs unchanged through `calculate_loc_score`, `calculate_files_score`, `calculate_risk_score`, `calculate_complexity_score`, `determine_level`, `calculate_confidence` and `determine_phasing`. The selector then reads `JSON_OUTPUT` and `QUIET_OUTPUT` and calls exactly one of `output_json`, the quiet `echo`, or `output_text`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` output selector | Owns which renderer runs after scoring | update - add the quiet branch and make `--json` win | `bash -n` and the three-invocation matrix below |
| `recommend-level.sh` `output_text()` | Renders the 16 to 17 line report | unchanged - the quiet branch must not enter it | Diff the default output before and after |
| `recommend-level.sh` `show_help()` and header comment | Publish the accepted options | update - add `--quiet` | `--help` prints the flag; `rg -n 'quiet' recommend-level.sh` finds both edits |
| `runtime/cli/tests/test-phase-system.js` | Runs the script and asserts JSON fields | unchanged - it never passes `--quiet` | `node runtime/cli/tests/test-phase-system.js` stays 27/27 |
| `references/workflows/*.md` and `feature-catalog/*.md` | Describe the script's inputs and outputs | unchanged - they name the script, not its flag set | `rg -n 'recommend-level' .skilled/skills/system-spec-kit/references` finds no flag list to update |

Required inventories:
- Same-class producers: `rg -n 'Recommended Level' .skilled/skills/system-spec-kit/runtime/cli/spec/` returns one line, `recommend-level.sh:510`, so the label has a single producer and the quiet branch must reuse its exact text.
- Consumers of changed symbols: `rg -n 'recommend-level' .skilled/skills/system-spec-kit --glob '*.js' --glob '*.sh'` finds `runtime/cli/tests/test-phase-system.js` as the only executable consumer; every other hit is prose.
- Matrix axes: the two independent axes are output mode (`default`, `--quiet`, `--json`, `--quiet --json`) and phase scoring (`default`, `--no-recommend-phases`). The required rows are all eight combinations, run against one Level 3 input and one Level 0 input.
- Algorithm invariant: the parser must accept `--quiet` in any position and must not consume the following token, so `--quiet --loc 50` and `--loc 50 --quiet` produce the same line.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### AI EXECUTION PROTOCOL

#### Pre-Task Checklist
- Read `recommend-level.sh` end to end before editing it; the output selector and `show_help()` are 250 lines apart.
- Confirm `bash -n` exits 0 on the untouched script, so a later syntax failure is attributable to this change.
- Capture the current default output for the two matrix inputs into `scratch/`, so "byte-identical" is a diff rather than an impression.

#### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Run T001 to T004 before T005 to T010; the captured baseline is the comparison for every later check. |
| TASK-SCOPE | Modify only `recommend-level.sh`. A doc or test change is a scope break, not a cleanup. |
| TASK-EVIDENCE | A task is `[x]` only after its `Verify:` command printed the stated output. |

#### Status Reporting Format
After each task: `Task T### complete. Files modified: <path>. Verify: <command> -> <observed output>.`

#### Blocked Task Protocol
If a verify command fails twice on the same task, stop, mark the task `[B]`, write the command and its output into `scratch/`, and report the blocker instead of widening the change.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The output selector: default, `--quiet`, `--json`, `--quiet --json` | `bash` with `wc -l` and `diff` against the captured baseline |
| Integration | The whole script across the two matrix inputs (`--loc 500 --files 15 --auth --api --db --architectural` and `--loc 50 --files 2`) | `bash`, `diff`, `wc -l` |
| Manual | `--help` shows the flag, and a mistyped `--quie` still exits 1 | Terminal |
| Regression | The existing phase-system suite | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 or newer | Internal | Green | The script cannot run; no workaround, and no new syntax may require Bash 4 |
| `node` for the existing test suite | Internal | Green | The regression run is skipped and only the manual matrix remains |
| `diff` and `wc` | Internal | Green | The byte-identical and line-count checks fall back to manual reading |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the default invocation's stdout differs from the captured baseline, or the existing suite drops below 27 passing checks.
- **Procedure**: revert the single commit that touched `recommend-level.sh`, then rerun the two matrix invocations and the suite; the script has no state to unwind.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Implementation) ──► Phase 3 (Verification)
Phase 1.5 (Baseline) ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Baseline, Implementation |
| Baseline | Setup | Implementation |
| Implementation | Setup, Baseline | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Baseline capture | Low | 5 minutes |
| Core Implementation | Low | 20 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **50 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline output captured for both matrix inputs
- [ ] No feature flag is needed; the flag is opt-in at the call site
- [ ] No monitoring change is needed for a local CLI

### Rollback Procedure
1. Revert the commit that touched `recommend-level.sh`.
2. Rerun both matrix invocations and diff against the captured baseline.
3. Rerun `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js`.
4. No stakeholder notification is required; the script ships inside the repository.

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
                    │ Baseline  │
                    │  Capture  │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Two reference output files in `scratch/` | Quiet branch, verification |
| `QUIET_OUTPUT` parser arm | Baseline capture | A recorded flag state | Output selector branch |
| Output selector branch | Parser arm | One-line stdout | Verification |
| Help and header text | Parser arm | Documented flag | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 5 minutes - CRITICAL
2. **Parser arm and output selector branch** - 20 minutes - CRITICAL
3. **Verification across the flag matrix** - 15 minutes - CRITICAL

**Total Critical Path**: 40 minutes

**Parallel Opportunities**:
- The help text and the usage header comment can be written while the selector branch is edited, because they touch different regions of the same file.
- The regression suite can start as soon as the selector branch compiles, before the manual matrix finishes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Two files in `scratch/` match the current default output | Phase 1 |
| M2 | Quiet branch working | `--quiet` prints one line and the default prints the same 17 lines | Phase 2 |
| M3 | Verified | The flag matrix and the phase-system suite both pass | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Select the quiet output in the selector, not inside `output_text()`

**Status**: Proposed

**Context**: The script already chooses between `output_json` and `output_text` at the bottom of the file. A `--quiet` mode needs a third choice, and it could either be a new branch in that selector or an early return at the top of `output_text()`.

**Decision**: Add the branch to the output selector, so the renderer stays a pure report function and the precedence between `--json`, `--quiet` and the default is readable in one place.

**Consequences**:
- The default path never passes through new code, which is what makes "byte-identical output" a structural property rather than a hope.
- The selector grows by two lines and now encodes a precedence rule, so the help text must state that `--json` wins; the cost is one documented sentence.

**Alternatives Rejected**:
- Early return inside `output_text()`: it mixes output-mode selection into report rendering and makes the default report reachable only through a branch that did not exist before.
- Telling callers to parse the existing `--json` document: it forces a shell caller to depend on a JSON parser and changes the contract for callers who want text.

---
