---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a QUIET_OUTPUT global and one argument-parser arm, route the level line through a single format_level_line helper, and select a new output_quiet path ahead of output_text in the dispatch. JSON keeps its precedence so the structured payload never changes."
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
| **Language/Stack** | Bash 3.2+ under `set -euo pipefail` |
| **Framework** | None. A single executable script plus a node test harness |
| **Storage** | None |
| **Testing** | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js`, plus shell byte-diffs |

### Overview

The change has three parts. A `QUIET_OUTPUT` global plus one `case` arm in the argument parser records the request. A `format_level_line()` helper becomes the only producer of the `Recommended Level:` string, and `output_text()` prints through it instead of its own `echo`. A new `output_quiet()` prints that one line and nothing else, selected ahead of `output_text()` in the output dispatch. `output_json()` keeps precedence, so `--quiet --json` still emits the unchanged structured payload.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-script CLI with a staged pipeline: parse arguments, score, dispatch one output function. There is no framework and no layering beyond the script's own numbered sections.

### Key Components

- **Argument parser** (`recommend-level.sh:656-719`): a `while`/`case` loop where each arm consumes one token and sets one global. It is the only place a new flag is registered.
- **Scoring functions** (`:216-500`): `calculate_loc_score`, `calculate_files_score`, `calculate_risk_score`, `calculate_complexity_score`, `determine_level`, `determine_phasing`, `calculate_confidence`. They write globals; none of them prints.
- **Output layer** (`:508-649`): `output_text` and `output_json`. This packet adds `format_level_line` and `output_quiet` here.
- **Output dispatch** (`:770-774`): a two-way branch today. It becomes three-way with JSON first, and it stays the only caller of the output functions.

### Data Flow

`argv` sets `LOC`, `FILES`, the four risk booleans and the new `QUIET_OUTPUT`. The four score functions read those globals and write `SCORE_*`. `TOTAL_SCORE` feeds `determine_level`, which sets `RECOMMENDED_LEVEL` and `LEVEL_NAME`. `calculate_confidence` and, when enabled, `determine_phasing` run next. The dispatch then calls exactly one of `output_json`, `output_quiet` or `output_text`, and that function is the only thing that writes to stdout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet adds a flag to a shared CLI, and the default output is a surface other tooling reads. The inventory below records every producer and consumer the change touches.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Argument parser (`recommend-level.sh:656-719`) | Consumes long options plus `-j` and `-h` | update: add `--quiet` and `-q`, neither consuming a value | `--quiet --loc 50 --files 2` runs; `--quie` still exits 1 |
| `format_level_line` | Does not exist | create: the single producer of the level string | `grep -c "Recommended Level:"` over the skill returns 1 |
| `output_text` (`:508-558`) | Prints the 16-line report from its own `echo` | update: print the level line through `format_level_line` | Byte-diff against the captured baseline |
| `output_quiet` | Does not exist | create: prints the level line only | `--quiet \| wc -l` prints 1 |
| `output_json` (`:562-649`) | Prints the JSON payload | unchanged, and keeps precedence over `--quiet` | `--json` and `--quiet --json` byte-diff empty |
| Output dispatch (`:770-774`) | Two-way branch | update: three-way branch, JSON checked first | 16-row matrix run |
| `test-phase-validation.js` | Phase, creation and path-safety tests | update: add quiet-contract assertions | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` |
| `test-phase-system.js` | Phase fixtures driven through `--json` | unchanged | Run it and compare the pass count to the baseline |
| `README.md`, `AGENTS.md` | One-line descriptions of the script, no flag list | unchanged, nothing to synchronize | `grep -n -- "--quiet" README.md AGENTS.md` returns nothing today |

Required inventories:

- Same-class producers: `grep -rn "Recommended Level:" .skilled/skills/system-spec-kit` returns one hit, `runtime/cli/spec/recommend-level.sh:510`. No second formatter exists, so the helper is the whole class.
- Consumers of changed symbols: `grep -n "output_text\|output_json\|RECOMMENDED_LEVEL" runtime/cli/spec/recommend-level.sh` shows both output functions called only from the dispatch at `:770-774`, and `RECOMMENDED_LEVEL` assigned only inside `determine_level`.
- Matrix axes: quiet {on, off} x json {on, off} x phases {default, `--no-recommend-phases`} x input {valid, invalid} = 16 rows.
- Algorithm invariant: every option token is consumed by exactly one `case` arm, and an unknown token exits 1 before any scoring runs. `--quiet` is a boolean arm, so it consumes no following token and cannot swallow the value of a later option.
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
| Unit | None. The script has no unit harness, and adding one is out of scope | - |
| Integration | CLI contract over the 16-row matrix, asserted inside the existing suite | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` |
| Regression | Default text output and JSON payload byte stability | `bash recommend-level.sh ... > out.txt` and `diff` against the baseline |
| Manual | Help text, error paths, repeated flag | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ | Internal (system shell) | Green | The script already targets it, so no new syntax is available |
| `node` and `git` | Internal (test harness) | Green | The CLI tests cannot run; manual shell checks still can |
| Existing test helpers (`runBash`, `parseJson`, `assertEqual`) | Internal | Green | The quiet assertions would need their own plumbing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Default text output differs from the baseline, or any consumer of the report breaks.
- **Procedure**: Restore the two changed files to their previous revisions and rerun both CLI test scripts. There is no data to unwind, no migration to reverse, and no flag to switch off, because the quiet path is opt-in and the default path is untouched.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Core) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |

The baseline captured in Setup is what makes the Core change provable, so Setup cannot be skipped or reordered.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Low | 1 to 2 hours |
| Verification | Low | 1 hour |
| **Total** | | **2.5 to 3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Backup created (if data changes) - not applicable, no data
- [x] Feature flag configured - not applicable, the flag is opt-in and defaults off
- [x] Monitoring alerts set - not applicable, the script is a local CLI

### Rollback Procedure

1. Restore `recommend-level.sh` and `test-phase-validation.js` to their previous revisions.
2. Rerun both CLI test scripts and confirm the pass count returns to the baseline.
3. Confirm `recommend-level.sh --help` no longer lists the flag.
4. Notify anyone who already scripted against `--quiet`; nobody should have, since the rollback follows a failed merge rather than a release.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────────┐     ┌─────────────┐
│   Phase 1   │────►│      Phase 2         │────►│   Phase 3   │
│   Setup     │     │  formatter + quiet   │     │   Verify    │
│  baseline   │     │  + parser arm        │     │  matrix     │
└─────────────┘     └──────────────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Recorded stdout for the fixture matrix | Default-output diff |
| `format_level_line` | Baseline capture | The one level-line string | `output_text` edit, `output_quiet` |
| `output_quiet` | `format_level_line` | The single-line mode | Dispatch edit |
| Parser arm | None | `QUIET_OUTPUT` set from argv | Any quiet-mode check |
| Dispatch edit | `output_quiet`, parser arm | Three-way selection | Matrix run |
| Test assertions | Dispatch edit | Green suite | Closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture the baseline** - 0.5 hour - CRITICAL
2. **Add `format_level_line` and route `output_text` through it** - 0.5 hour - CRITICAL
3. **Add `output_quiet` and the parser arm, extend the dispatch** - 0.5 hour - CRITICAL
4. **Diff the default output and run the matrix** - 1 hour - CRITICAL

**Total Critical Path**: 2.5 hours

**Parallel Opportunities**:

- The `--help` OPTIONS entry and the header comment block can be edited alongside the parser arm.
- The test assertions can be written while the baseline diff runs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Text and JSON output recorded for the full fixture matrix | End of Phase 1 |
| M2 | Flag implemented | `--quiet` prints one line, default path untouched in code | End of Phase 2 |
| M3 | Verified | Both test scripts green, baseline diff empty, matrix recorded | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: `--json` outranks `--quiet`

**Status**: Accepted

**Context**: Two output selectors now exist. `--json` already produces one structured document with nothing chatty to suppress, so a caller passing both has stated two intents that cannot both be honored without inventing a third shape.

**Decision**: `--json` wins. `--quiet` has no effect on the JSON payload, and the dispatch checks JSON first so the precedence is visible at the call site rather than buried in a flag test.

**Consequences**:
- One precedence rule, provable with a single byte-diff assertion.
- No third payload shape and no second schema to keep in step.
- A caller who wants only `{"recommended_level": 2}` does not get it. They can pipe the payload through `jq`, or use the quiet text line, which is the smaller answer anyway.

**Alternatives Rejected**:
- Quiet-plus-JSON emits a minimal object: a third payload shape, a second schema, and a second thing to keep aligned, all for a case `jq` already covers.
- `--quiet` rejects `--json` as a usage error: turns a harmless combination into a failure and breaks any wrapper that always passes both.

### ADR-002: One shared formatter for the level line

**Status**: Accepted

**Context**: Both text modes print the same string. Two `echo` calls in two functions drift the first time the wording changes, and the drift is invisible because each mode is tested on its own.

**Decision**: `format_level_line()` becomes the only producer of `Recommended Level: <N> (<Name>)`. `output_text` and `output_quiet` both print through it.

**Consequences**:
- `grep -c "Recommended Level:"` over the skill stays at 1, which makes the invariant cheap to check.
- One more function in a 780-line script.
- `output_text` changes from `echo` to `printf` inside the helper, so the byte-stability test is what proves the swap is neutral.

**Alternatives Rejected**:
- Duplicate the `echo` in `output_quiet`: cheapest to write, and it drifts the first time the label or spacing changes.
- Pass a verbosity level into `output_text` and branch inside it: mixes formatting decisions with suppression decisions in one function, and the dispatch stops showing which mode won.

### ADR-003: `--quiet` is canonical, `-q` is an alias

**Status**: Accepted

**Context**: `-j` and `-h` already set a precedent for short forms, so a long-only flag would read as an oversight. `-q` is unclaimed in the current parser.

**Decision**: Support both spellings in one `case` arm, document `--quiet` as canonical, and treat `-q` as convenience.

**Consequences**:
- Consistent with the two existing short forms.
- One more token in the single-letter space, documented so a future option does not take it silently.

**Alternatives Rejected**:
- Long form only: defensible, but it makes the flag set look inconsistent for no gain.
- Add a general `-v`/`-q` verbosity pair: a second axis nobody asked for, and the JSON mode already covers structured output.

---

