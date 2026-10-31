---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "One boolean global, one parse arm and one early branch in the text renderer. The plan records the exact output contract, the twelve-invocation matrix that proves the default report is untouched, and the decision that --json outranks --quiet."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "quiet flag implementation plan"
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
| **Language/Stack** | Bash 3.2+ (`set -euo pipefail`; must run under macOS `/bin/bash`) |
| **Framework** | None - a single self-contained script |
| **Storage** | None |
| **Testing** | Shell golden-output diff over a twelve-invocation matrix, plus `bash -n` syntax check |

### Overview

The script already separates scoring from rendering, so the feature is a fourth global beside `JSON_OUTPUT`, one `case` arm in the argument loop, and a guard at the top of `output_text()` that prints the level line and returns. `output_json()` is deliberately untouched: JSON already is the single-artifact mode, so `--json` outranks `--quiet` and a JSON consumer never sees a different document. The work is provable rather than inferable because the pre-change report can be captured as a file and diffed byte for byte.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented - `spec.md` §2 and §3 name the pain point and the single file in scope.
- [x] Success criteria measurable - `spec.md` §5 gives a one-line stdout assertion and a byte-identical diff.
- [x] Dependencies identified - none outside the script; Bash 3.2 is the only environmental constraint (`spec.md` §6).

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file CLI with three stages in one process: argument parsing, scoring, rendering. There is no module boundary to cross, so the change stays inside the stage that owns it.

### Key Components
- **Globals block** (`recommend-level.sh` lines 116-142): declares `JSON_OUTPUT`, the phase flags and the computed results. `QUIET_OUTPUT=false` joins it beside `JSON_OUTPUT`, so both output-mode switches live in the same place.
- **Argument parser** (lines 656-719): a `while [[ $# -gt 0 ]]` loop over a `case "$1" in` statement. One new arm, `--quiet) QUIET_OUTPUT=true; shift ;;`, sits beside `--json|-j`.
- **`output_text()`** (lines 508-558): the only place the human report is written. The quiet guard is its first statement.
- **`output_json()`** (lines 562-649): the machine-readable renderer. Unchanged, and unreachable from the quiet path because `main` chooses one renderer.
- **`show_help()`** (lines 162-211): the `--help` body, which lists every option and four examples.
- **Header comment block** (lines 13-34): the `USAGE`, `OPTIONS` and `EXAMPLES` summary a reader sees before the code.

### Data Flow

`argv` enters the parse loop, which writes the input globals (`LOC`, `FILES`, the four risk booleans) and the output-mode globals (`JSON_OUTPUT`, `RECOMMEND_PHASES`, `QUIET_OUTPUT`). Scoring runs unconditionally and produces `TOTAL_SCORE`, then `determine_level()` sets `RECOMMENDED_LEVEL` and `LEVEL_NAME`, then `calculate_confidence()` and, when phase output is on, `determine_phasing()`. The final `if` in `main` picks one renderer: `output_json` when `JSON_OUTPUT` is true, otherwise `output_text`, whose quiet guard prints the level line alone.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `output_text()` (`recommend-level.sh:508-558`) | Owns the human report and is the only producer of the `Recommended Level:` text line | update - add the quiet guard as its first statement, printing the same format string it already uses | `--quiet` stdout compared against line 2 of the same invocation's full report |
| `output_json()` (`recommend-level.sh:562-649`) | Owns the JSON document, in both the phase-on and phase-off variants | unchanged - never reached when only `--quiet` is passed, and JSON outranks quiet when both are | `--json --quiet` diffed against `--json` |
| Argument parser (`recommend-level.sh:656-719`) | Owns flag recognition and the exit-1 error paths | update - one `--quiet)` arm setting `QUIET_OUTPUT=true` | flag placed first, middle and last; repeated flag; `--quiet 5` still rejected |
| `show_help()` and header comment (`recommend-level.sh:13-34`, `162-211`) | Own the documented flag surface | update - one `OPTIONS` row and one example each | `--help` and the header block both contain `--quiet` |
| Documentation callers (`README.md:423`, `system-spec-kit/README.md:513`, `assets/level-decision-matrix.md:302`, `manual-testing-playbook/tooling-and-scripts/*.md`) | Describe or invoke the script; none parses its stdout | unchanged - no documented invocation passes `--quiet`, so none changes behaviour | `rg -n 'recommend-level\.sh' . --glob '!specs/**'` lists documentation only |

Required inventories:
- Same-class producers: `rg -n 'Recommended Level:' .skilled/skills/system-spec-kit/runtime/cli/spec/` returns one line, `recommend-level.sh:510`, so the quiet line has exactly one sibling to stay in step with.
- Consumers of changed symbols: `rg -n 'recommend-level\.sh' . --glob '!specs/**'` returns documentation references and manual-testing playbook commands; no script, test or tool parses the stdout, and no caller passes `--quiet` before this change.
- Matrix axes: output mode (text, JSON, help, error) x quiet (off, on) x phase flag (default, `--no-recommend-phases`) x flag position (first, middle, last). The matrix in `tasks.md` fixes twelve rows that cover every axis at least once.
- Algorithm invariant: not applicable - this is not a path, redaction, parser or resolver fix. The invariant the work must hold is an output contract: for every argument vector `A` that does not contain `--quiet`, stdout, stderr and the exit code are byte-identical before and after the change.
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
| Unit | The quiet guard in `output_text()` and the `--quiet` parse arm, exercised through the CLI because a shell script has no importable function boundary | `bash recommend-level.sh ...` with captured stdout, stderr and exit code |
| Integration | The full argument matrix, including combinations with `--json`, `--no-recommend-phases` and `--phase-threshold` | `bash` plus `diff` against the pre-change golden capture |
| Manual | `--help` readability and the one-line output as a reader sees it | Terminal |
| Static | Syntax and shell portability | `bash -n recommend-level.sh`, `bash --version` check, `shellcheck` when available |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ | Internal (host shell) | Green - macOS ships it and the file already runs under it | None; a newer-only construct would fail on the developer's machine, which the syntax check catches |
| The script's current stdout | Internal (baseline artifact) | Green - captured in `scratch/golden/` before the first edit | Without the capture the "unchanged" claim is unprovable, so the capture is task T002 and blocks every edit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The golden diff shows any change for an invocation without `--quiet`, or `--quiet` prints more or less than the single level line.
- **Procedure**: `git checkout -- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` restores the pre-change file. The change touches no other tracked file, so the revert is complete and needs no data step.
<!-- /ANCHOR:rollback -->

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
| Setup | None | Baseline, Core |
| Baseline | Setup | Core |
| Core | Setup, Baseline | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 5 minutes - read the script and confirm the anchor lines |
| Baseline | Low | 10 minutes - capture twelve outputs and the three error cases |
| Core Implementation | Low | 15 minutes - one global, one parse arm, one guard, two documentation edits |
| Verification | Low | 20 minutes - rerun the matrix, diff, syntax check, help review |
| **Total** | | **About 50 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable, there is no data. The baseline capture in `scratch/golden/` is the equivalent safety net.
- [x] Feature flag configured - not applicable. `--quiet` is opt-in by argument, so the default path is the unchanged one.
- [x] Monitoring alerts set - not applicable to a local CLI.

### Rollback Procedure
1. Stop: do not mark any further task `[x]` once a diff or matrix row fails.
2. Restore the file: `git checkout -- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`.
3. Verify the restore: rerun the golden matrix and confirm an empty diff against `scratch/golden/`.
4. Record the failure and its output in `tasks.md` or the packet's continuity note rather than retrying the same edit.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - the script writes no files and holds no state between runs.
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
                     │ Phase 1.5 │
                     │  Baseline │
                     └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | The unmodified script | `scratch/golden/*.out`, `scratch/golden/*.err`, `scratch/golden/*.code` | Core, Verify |
| `QUIET_OUTPUT` global | Globals block | The output-mode switch the parser sets | Parse arm, quiet guard |
| `--quiet` parse arm | `QUIET_OUTPUT` global | A true value for the quiet guard | Quiet guard |
| Quiet guard in `output_text()` | `RECOMMENDED_LEVEL`, `LEVEL_NAME`, `QUIET_OUTPUT` | The single line | Verify |
| Documentation rows | The final flag spelling | Header and help entries | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture the baseline matrix** - 10 minutes - CRITICAL
2. **Add the global and the parse arm** - 5 minutes - CRITICAL
3. **Add the quiet guard** - 5 minutes - CRITICAL
4. **Rerun the matrix and diff** - 15 minutes - CRITICAL

**Total Critical Path**: about 35 minutes of the 50-minute estimate.

**Parallel Opportunities**:
- The header comment and the `--help` row can be written while the matrix runs, since neither affects behaviour.
- The `--json --quiet` row and the `--no-recommend-phases` row can be checked together; both prove a mode that quiet must not touch.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `scratch/golden/` holds twelve stdout files, three stderr files and their exit codes | Phase 1.5 |
| M2 | Flag implemented | `--quiet` prints one line; `bash -n` passes | Phase 2 |
| M3 | Contract proven | Golden diff empty for every non-quiet row; quiet rows match their expected single line | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: `--quiet` governs text output only, and `--json` outranks it

**Status**: Accepted

**Context**: The script has two output modes. `output_json()` emits a single JSON object, which is already the machine-readable form a caller would want; `output_text()` emits the five-to-fifteen-line human report. A `--quiet` flag could plausibly mean "one line" in both modes, "fewer fields" in JSON, or "text only". Each reading implies a different contract for anyone already parsing the JSON.

**Decision**: `--quiet` is implemented in `output_text()` and nowhere else. When `--json` is also passed, the JSON document is emitted unchanged, because the final renderer choice in `main` tests `JSON_OUTPUT` first. The help text states that the flag applies to text output.

**Consequences**:
- No existing JSON consumer sees a different document, so the change cannot break a machine-readable caller.
- The quiet contract is one line with one wording, which is the whole point of the flag.
- A caller that passes both flags gets JSON rather than a level line. That is documented in `--help` and asserted by a matrix row, so it is a stated contract rather than a surprise.

**Alternatives Rejected**:
- Quiet also strips JSON fields: rejected because it changes a document consumers already parse, and because a JSON object is not the "one line" the request describes.
- Quiet suppresses only the breakdown and phase block, keeping the score line: rejected because the result is still three lines and still needs parsing, which leaves the problem unsolved.
- A separate `--level-only` flag name: rejected because the request names `--quiet`, and a second spelling would be a second contract to keep.
- A `-q` alias: rejected for now because the script's short flags are `-j` and `-h` only, and adding a letter is a separate decision about collisions.

---


