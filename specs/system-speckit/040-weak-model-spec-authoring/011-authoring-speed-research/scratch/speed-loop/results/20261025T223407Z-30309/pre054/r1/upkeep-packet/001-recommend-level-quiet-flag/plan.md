---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet output mode to recommend-level.sh behind a shared level-line formatter, so the quiet line and the existing report line are the same bytes, and reject --quiet with --json."
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
| **Language/Stack** | Bash 3.2 and later (the macOS default) and bash 5.x on Linux |
| **Framework** | None. One shell script with no build step |
| **Storage** | None |
| **Testing** | Node smoke test, `node tests/test-recommend-level.js`, wired into `npm run test:legacy` |

### Overview

`recommend-level.sh` gains a `--quiet` flag and one output function behind it. The level line moves into `format_level_line`, which the existing text report also calls, so the quiet line and the report line are the same bytes. A mode guard rejects `--quiet` with `--json`. Scoring, phase scoring and both existing output paths stay untouched.
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
- [ ] `npm run test:legacy` passes with the new test included
- [ ] Default stdout matches the captured baseline byte for byte
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file shell CLI with output-mode dispatch. The parser fills globals, the scoring functions read them, and one dispatch at the end picks an output function.

### Key Components

- **Argument parser (§5)**: owns flag parsing and usage errors. It gains one `--quiet` arm that sets `QUIET=true`.
- **Mode guard**: one check after parsing that rejects `--quiet` with `--json` and exits 1.
- **Scoring functions (§3)**: `calculate_loc_score`, `calculate_files_score`, `calculate_risk_score`, `calculate_complexity_score`, `determine_level`, `determine_phasing`, `calculate_confidence`. Unchanged.
- **`format_level_line`**: the one place that renders `Recommended Level: <N> (<Name>)`.
- **`output_text`**: prints the report and delegates its level line to `format_level_line`.
- **`output_json`**: unchanged.
- **`output_quiet`**: prints `format_level_line` and nothing else.

### Data Flow

```
argv → parser → globals (QUIET, JSON_OUTPUT, inputs) → mode guard → scoring
     → dispatch ─┬─ QUIET=true        → output_quiet
                 ├─ JSON_OUTPUT=true  → output_json
                 └─ otherwise         → output_text
     → stdout
```

The dispatch order matters: quiet is checked first, so the guard is the only thing standing between a caller and a mixed request. ADR-001 records why.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is not a fix packet. The table records the producer and consumer inventory the new flag touches, because the output contract of a shared script has more than one reader.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` `output_text` | Prints the multi-line report, including the level line | update: delegate the level line to `format_level_line` | Golden-output assertion in the new test |
| `recommend-level.sh` `output_json` | Prints the JSON document | unchanged | New test compares the JSON output to a baseline |
| `recommend-level.sh` argument parser | Owns flag parsing and usage errors | update: add the `--quiet` arm and the mode guard | New test plus `--help` output |
| `recommend-level.sh` header comment and `show_help` | Document the flags | update: add `--quiet` to both | `rg -n -- '--quiet' recommend-level.sh` |
| `.skilled/commands/speckit/assets/speckit-plan.yaml:86` | Runs the script with `--json --recommend-phases` | not a consumer of text output; it passes `--json` | `rg -n 'recommend-level' .skilled/commands` |
| `.skilled/commands/speckit/assets/speckit-complete.yaml:147` | Runs the script with `--json --recommend-phases` | not a consumer of text output; it passes `--json` | same |
| `runtime/cli/tests/test-phase-validation.js`, `test-phase-system.js` | Existing recommend-level tests, all through `--json` | not a consumer of text output | `rg -n 'RECOMMEND_SCRIPT' runtime/cli/tests` |
| `runtime/cli/package.json` `test:legacy` | Lists the node tests CI runs | update: add `tests/test-recommend-level.js` | `npm run test:legacy` |
| `references/workflows/execution-methods.md` §6 | Documents a partial flag table | unchanged: already incomplete, out of scope | `rg -n 'Feature Flags' execution-methods.md` |

Required inventories:

- Same-class producers: `rg -n 'Recommended Level|output_text|output_json' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` returns `508:output_text()`, `510:echo "Recommended Level: ..."`, `562:output_json()`, `771:output_json`, `773:output_text`. One renderer of the line exists, so the formatter has a single insertion point.
- Consumers of changed symbols: `rg -n 'recommend-level' .skilled/commands .skilled/hooks` returns two invocations (`speckit-plan.yaml:86`, `speckit-complete.yaml:147`), both `--json`, plus three prose notes. No consumer passes `--quiet` and none parses the text report.
- Matrix axes: output mode (default, quiet, json, quiet plus json) x phase section (on, off) x input validity (valid, empty, non-numeric). The test covers the eight cells that differ; the rest are duplicates of an existing assertion.
- Algorithm invariant: the default stdout is frozen. Quiet mode must equal the report's level line for the same inputs, and the shared formatter makes that structural rather than a convention.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

- **Phase 1 (Setup)**: capture the default-output baseline and read the test harness. No file changes.
- **Phase 2 (Implementation)**: add the flag, the formatter, the quiet output path and the guard; update the help text; write the test and register it.
- **Phase 3 (Verification)**: run the new test, the full legacy suite and the byte-for-byte baseline diff, then validate this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `format_level_line` and `output_quiet`, through a spawned script | `node:child_process` `execFileSync` in a smoke test |
| Integration | argv parsing, the mode guard, exit codes and stream separation | same |
| Regression | Default text and JSON stdout against a captured baseline | Golden literals in the test |
| Manual | `LEVEL=$(... --quiet)` in an interactive shell | bash |

The test spawns the real script rather than sourcing it. Sourcing would skip `set -euo pipefail` and the `exit` paths, and the output contract is the thing under test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `recommend-level.sh` | Internal | Green | Nothing to build or install |
| Node and bash test harness | Internal | Green | The new test cannot run |
| `runtime/cli/package.json` `test:legacy` | Internal | Green | The test exists but CI never runs it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any byte change in default stdout, any change to an exit code, or a failing `npm run test:legacy`.
- **Procedure**: `git revert` the single commit. The flag is additive, so there is no data, migration or configuration to undo.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low-Medium | 1 hour |
| Verification | Low | 30 minutes |
| **Total** | | **About 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Baseline captured (T001) and committed to `scratch/`
- [ ] No feature flag needed: `--quiet` is itself opt-in
- [ ] No monitoring change: the script is a local CLI

### Rollback Procedure

1. Revert the commit that touched `recommend-level.sh`, the test and `package.json`.
2. Run `node tests/test-recommend-level.js` and `npm run test:legacy`.
3. Compare default stdout against the T001 baseline.
4. No stakeholder notice needed: the default output never changed for anyone who did not pass the flag.

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
                     ┌─────▼──────┐
                     │ format_    │
                     │ level_line │
                     └────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Frozen default stdout | The byte diff in Phase 3 |
| `format_level_line` | Baseline | The one level-line renderer | `output_text` and `output_quiet` |
| `--quiet` arm and guard | Parser globals | `QUIET` state and the mode error | `output_quiet` dispatch |
| `output_quiet` | `format_level_line` | The single line | The quiet test |
| New test | `output_quiet`, the guard | Pass or fail signal | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001 baseline capture** - 10 minutes - CRITICAL
2. **T006 formatter and quiet output path** - 30 minutes - CRITICAL
3. **T010 new test** - 30 minutes - CRITICAL
4. **T014 byte-for-byte baseline diff** - 10 minutes - CRITICAL

**Total Critical Path**: about 80 minutes of the roughly 2 hours.

**Parallel Opportunities**:
- T008 (header OPTIONS block) and T009 (`show_help`) can run together once T005 fixes the flag name.
- T011 (`package.json` entry) can run with T010 once the test path is fixed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `scratch/baseline-default.txt` holds the current default stdout | End of Phase 1 |
| M2 | Flag and formatter in place | `--quiet` prints one line; default output still matches the baseline | End of Phase 2 |
| M3 | Release ready | New test and `npm run test:legacy` pass; `validate.sh --strict` returns PASSED | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet mode is a text projection and is mutually exclusive with JSON

**Status**: Accepted

**Context**: The script has two output modes today, text and JSON. `--quiet` asks for one line of text. A caller can pass `--quiet` and `--json` in the same invocation, and the script has to do something: pick one mode, ignore one flag, or refuse.

**Decision**: `--quiet` selects a third output mode that prints only `Recommended Level: <N> (<Name>)`. Combining it with `--json` exits 1 with `ERROR: --quiet cannot be combined with --json` on stderr. The quiet line is rendered by `format_level_line`, the same function the text report calls.

**Consequences**:
- One invocation has one meaning, and a contradictory request is loud instead of silent.
- The quiet line cannot drift from the report line, because there is one renderer.
- A caller that wants structured output plus a bare level has to use `--json` and read `recommended_level`. That is one extra field read, not a second mode.
- One new usage error exists. It fires only for a combination that has no meaning today.

**Alternatives Rejected**:
- Silent precedence for `--quiet`: a caller that asked for JSON would receive text and a parser downstream would fail with a confusing message.
- `--quiet` ignored in JSON mode: the flag becomes a silent no-op, the worst of the three options.
- A `--format level` value: wider surface than the request, and it would reopen the flag set for every future output shape.
- A separate `--level-only` flag: a synonym for the same behavior, which doubles the documented surface for no gain.

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read `spec.md`, this plan and `tasks.md` before the first edit
- [ ] Confirm the target file is in the Files to Change table in `spec.md`
- [ ] Know the verification command for the task before starting it
- [ ] Confirm the default-output baseline from T001 exists before touching the output path

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in ID order. T006 comes after T001, and T014 comes after T012. |
| TASK-SCOPE | Touch only `recommend-level.sh`, `tests/test-recommend-level.js` and `runtime/cli/package.json`. Report anything else as a finding. |
| TASK-VERIFY | Run the task's verification command and read its output before marking the task complete. |
| TASK-EVIDENCE | Record the command and its result in the task's evidence line. An exit code alone is not evidence. |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol

1. Mark the task BLOCKED and name the blocking fact.
2. Record the fact in `tasks.md` beside the task.
3. Continue with the next unblocked task. Escalate to the operator after two blocked tasks in the same phase.
<!-- /ANCHOR:ai-execution -->

---
