---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet flag to recommend-level.sh by introducing a dedicated quiet output path that reuses one shared level-line helper, leaving the existing text and JSON paths untouched, and guarding the one ambiguous flag combination."
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
| **Language/Stack** | Bash 5, written to stay Bash 3.2 compatible like the rest of `runtime/cli/spec/` |
| **Framework** | None — a single self-contained shell script |
| **Storage** | None |
| **Testing** | Vitest under the `cli` project for the new suite, plus direct CLI invocation for the byte-level output checks |

### Overview

The change adds one boolean global, one `case` arm, one small output function and one shared line-formatting helper. The existing `output_text()` and `output_json()` bodies stay intact apart from `output_text()` calling the shared helper for its level line, and the output dispatch in the main section grows a third branch. A single guard rejects `--quiet --json` before any computation runs.
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
- [ ] New vitest suite passes under the `cli` project
- [ ] Default-mode output diffed byte-for-byte against the pre-change script
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file linear pipeline. The script runs one pass over its arguments, validates the parsed values, computes the scores, then dispatches to exactly one output function. There is no module boundary to cross and no state that outlives the process.

### Key Components

- **Argument parser** (`while [[ $# -gt 0 ]]` / `case "$1"`): maps flags onto globals. `--quiet` joins as a valueless boolean arm.
- **Scoring functions** (`calculate_loc_score`, `calculate_files_score`, `calculate_risk_score`, `calculate_complexity_score`, `determine_level`, `determine_phasing`, `calculate_confidence`): pure-ish functions that echo or set globals. Untouched.
- **`format_level_line()`**: new single-purpose helper that prints `Recommended Level: <N> (<Name>)`. It is the one place the line's shape is defined.
- **`output_text()`**: the existing full report. Its first `echo` becomes a call to `format_level_line()`; everything after it is unchanged.
- **`output_quiet()`**: new. Calls `format_level_line()` and returns.
- **`output_json()`**: untouched.
- **Output dispatch**: the two-way `JSON_OUTPUT` branch becomes three-way — JSON, quiet, then text.

### Data Flow

Arguments land in globals → validation rejects malformed values on stderr with exit 1 → scoring writes `TOTAL_SCORE`, `RECOMMENDED_LEVEL`, `LEVEL_NAME`, `CONFIDENCE` and the phase globals → the dispatch picks one output function → that function writes to stdout → `exit 0`. `--quiet` participates only in the dispatch step, which is why it cannot change any computed value.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The change is additive rather than a bug fix, but it alters a shared CLI's stdout contract, so the producer and consumer inventory is recorded here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `output_text()` in `recommend-level.sh` | Sole producer of the human-readable report, including the level line | Update — first `echo` delegates to `format_level_line()`; output bytes unchanged | Byte diff of captured output against the pre-change script over the fixture matrix |
| `output_json()` in `recommend-level.sh` | Producer of the machine-readable report | Unchanged | `--json` fixture run compared before and after |
| Output dispatch in the main section | Two-way `JSON_OUTPUT` branch | Update — add the quiet branch ahead of the text branch | Test asserts one line with `--quiet`, full report without |
| `show_help()` and the header option block | Document the flag surface | Update — add `--quiet` | Test asserts `--help` contains `--quiet` |
| `test-phase-validation.js`, `test-phase-system.js` | Existing consumers that parse `--json` output | Unchanged — they never pass `--quiet` | Both suites still pass |

Required inventories:
- Same-class producers: `rg -n 'Recommended Level|output_text|output_json' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` — the two output functions are the only producers, and only `output_text()` owns the level line.
- Consumers of changed symbols: `rg -n 'recommend-level\.sh' .skilled/skills/system-spec-kit --glob '*.md' --glob '*.js' --glob '*.ts' --glob '*.sh'` — confirms no caller passes an argument that a new flag name could collide with.
- Matrix axes: level band (0, 1, 2, 3) × phase output (default, `--no-recommend-phases`) × output mode (default, `--quiet`, `--json`) — 24 cells, of which the quiet cells assert one line and the default cells assert byte parity.
- Algorithm invariant: not applicable. No path, redaction, parser or resolver logic changes; the flag never reads a value.
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
| Unit | `--quiet` line count and exact line text across the four level bands | Vitest, spawning the script with `execFileSync` |
| Regression | Default-mode stdout byte parity against a captured pre-change baseline | `diff` over captured fixture output |
| Integration | `--quiet --json` conflict, `--quiet --help` precedence, error paths under quiet | Vitest plus direct CLI runs |
| Manual | Read `--help` and confirm the option list is coherent | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `output_text()`'s current line format | Internal | Green | The quiet line would have no canonical source; it would be hand-written and could drift |
| `cli` vitest project (`tests/**/*.vitest.ts`) | Internal | Green | The new suite would need a manual wiring change in `package.json` |
| Bash 3.2 compatibility | Internal | Green | Array or `mapfile` usage would break macOS's stock shell; the change uses none |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Default-mode output differs by any byte from the pre-change script, or the new suite fails on a supported shell.
- **Procedure**: Revert the single commit that touches `recommend-level.sh` and delete the new test file. The flag is additive, so no caller has to be unwound.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |

There is no separate Config phase in this packet: the flag needs no configuration, and the documentation edit belongs to Core because it ships in the same file.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes — read the script and capture the baseline matrix |
| Core Implementation | Low | 30 minutes — flag arm, helper, quiet function, dispatch, docs |
| Verification | Medium | 45 minutes — new suite, byte diff, conflict and help paths |
| **Total** | | **About 1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline output captured before the edit (fixture matrix, default mode)
- [x] No feature flag needed — the new behaviour is opt-in by flag
- [x] No monitoring change; the script is a local CLI

### Rollback Procedure
1. Revert the commit that touches `recommend-level.sh`.
2. Delete `runtime/cli/tests/recommend-level-quiet.vitest.ts`.
3. Re-run `node tests/test-phase-validation.js` and `node tests/test-phase-system.js` to confirm the JSON contract is intact.
4. No stakeholder notification is required: no caller can have adopted a flag that no longer exists.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — the script persists nothing.
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
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Captured default-mode output for the fixture matrix | Byte-diff regression |
| `format_level_line()` | Nothing (pure echo) | The canonical level line | `output_text()`, `output_quiet()` |
| `output_quiet()` | `format_level_line()` | One-line stdout | Dispatch branch |
| Dispatch branch | `output_quiet()`, `QUIET_OUTPUT` global | Quiet mode reachable | Quiet tests |
| Help and header docs | Flag name decided | Updated `--help` and header block | Help assertion |
| Byte-diff regression | Baseline capture, Core implementation | Parity evidence | Completion |

The "Phase 2b Parallel" box in the diagram stands for the help/header documentation edit, which touches a different region of the same file and can proceed alongside the output work.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** — 10 minutes — CRITICAL
2. **Flag arm plus `format_level_line()` extraction** — 15 minutes — CRITICAL
3. **`output_quiet()` and the dispatch branch** — 15 minutes — CRITICAL
4. **New suite and byte diff** — 40 minutes — CRITICAL

**Total Critical Path**: about 80 minutes.

**Parallel Opportunities**:
- The help/header documentation edit runs alongside step 3; it touches the comment block and `show_help()` heredoc, not the output path.
- The test file can be written against the agreed output contract while the implementation is still landing, then run once the script changes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Default-mode output stored for all 8 default and JSON fixtures | Phase 1 exit |
| M2 | Quiet path works | `--quiet` prints exactly one line for all four level bands | Phase 2 exit |
| M3 | Parity proven | Byte diff empty, new suite green, existing phase suites green | Phase 3 exit |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Dedicated `output_quiet()` with a shared `format_level_line()` helper

**Status**: Accepted

**Context**: Quiet mode must print the same line that default mode prints first. Two output paths that each spell out the format string will eventually disagree, but a shared helper means touching `output_text()`, which is the path that must not change.

**Decision**: Extract the level line into `format_level_line()`, have `output_text()` call it in place of its first `echo`, and add `output_quiet()` as a separate function that calls the same helper and returns. The dispatch gains a quiet branch rather than `output_text()` gaining an early return.

**Consequences**:
- The format string exists once, so a future edit to the line lands in both modes by construction.
- `output_text()` changes by exactly one line, and that line's printed bytes are identical, which keeps the regression diff meaningful and small.
- Negative: one extra function and one extra dispatch branch. Accepted, because the alternative puts quiet logic inside the function whose behaviour must not change.

**Alternatives Rejected**:
- Early return at the top of `output_text()`: rejected because it puts a conditional in the default path and makes "default output unchanged" a claim about a branch rather than about untouched code.
- Duplicating the format string inside `output_quiet()`: rejected because two copies drift, and the drift would only surface in whichever mode a given test forgot to cover.

---

### ADR-002: Reject `--quiet` with `--json` instead of resolving it

**Status**: Accepted

**Context**: `--quiet` promises "only the recommended-level line"; `--json` promises a JSON document. Both are output-mode selectors, and a caller that passes both has stated two contradictory intentions. The script has to do something.

**Decision**: Fail fast. After argument parsing, if both flags are set, write `ERROR: --quiet cannot be combined with --json` to stderr and exit 1 with empty stdout.

**Consequences**:
- No caller can be surprised by a silently dropped flag; a script that mis-composes its arguments fails at the first run rather than producing output the caller misreads.
- The rejection path is new, so it cannot break an existing caller: `--quiet` did not exist before this change.
- Negative: a caller that wants JSON has to omit `--quiet` rather than passing it harmlessly. That is the point.

**Alternatives Rejected**:
- Ignore `--quiet` when `--json` is set: rejected because a silently ignored flag is the failure mode that costs an afternoon of debugging.
- Let `--quiet` win and suppress the JSON: rejected because it destroys the machine-readable contract a caller explicitly asked for.
- Treat `--quiet` as a no-op under JSON with a stderr warning: rejected because a warning in a pipeline is noise that nobody reads, and the exit code would still say success.

---

### ADR-003: `--quiet` suppresses stdout only; help and errors keep their output

**Status**: Accepted

**Context**: "Prints only its final recommended-level line" needs a boundary. Help text and error diagnostics are not the recommended-level line, so a literal reading would suppress them too.

**Decision**: `--quiet` governs the result report on stdout. `--help` still prints the full help text and exits 0, because `show_help()` exits during argument parsing before the dispatch is reached. Error diagnostics keep going to stderr with their existing messages and exit codes.

**Consequences**:
- A failing quiet invocation still explains itself, which is the behaviour a caller needs when a pipeline breaks.
- `--quiet --help` shows help; the parse-order effect is documented so nobody "fixes" it into a silent no-op.
- Negative: quiet is not a blanket silence, so a caller that wants to swallow stderr must redirect it. That is correct — the script should not decide that errors are optional.

**Alternatives Rejected**:
- Suppress help under `--quiet`: rejected because asking for help and asking for less output are not in conflict; help is the answer to the request, not decoration.
- Redirect errors to `/dev/null` under quiet: rejected because it hides the reason a pipeline failed.

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read `spec.md`, this plan and `tasks.md` before the first edit
- [ ] Confirm the target file is `runtime/cli/spec/recommend-level.sh` and the new test path is `runtime/cli/tests/recommend-level-quiet.vitest.ts`
- [ ] Capture the default-mode baseline output before touching the script
- [ ] Know the verification command for the task before starting it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in dependency order; the baseline capture must finish before any edit to the script |
| TASK-SCOPE | Touch only the two files named in `spec.md`; report anything else as a finding |
| TASK-VERIFY | Run the task's verification before marking it complete |
| TASK-PARITY | Never claim default output is unchanged from reading a diff; prove it with captured-output comparison |
| TASK-SHELL | Keep Bash 3.2 compatibility: no associative arrays, no `mapfile`, no `;;&` |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact in the tasks.md blocked section
3. Continue with the next unblocked task; escalate after two blocked tasks
<!-- /ANCHOR:ai-execution -->

---
