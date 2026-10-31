---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a boolean --quiet flag to recommend-level.sh, keep the flag state in a bash 3.2-compatible global, branch inside output_text() so only the text formatter decides what is printed, and give --json precedence so machine output never becomes prose."
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
| **Language/Stack** | Bash 3.2+ (the script targets the macOS system bash and Linux) |
| **Framework** | None - a single self-contained shell script with `set -euo pipefail` |
| **Storage** | None |
| **Testing** | Manual shell runs, a captured-output diff, and the existing Node phase test scripts |

### Overview

`recommend-level.sh` is a linear script: parse arguments, score four factors, map the total to a level, then hand off to `output_text()` or `output_json()`. The change adds one global (`QUIET=false`), one case arm in the argument loop, and an early branch at the top of `output_text()` that prints the recommended-level line and returns. `output_json()` is not touched, which is what makes `--json` precedence fall out of the existing dispatch in `main` rather than needing a second rule.
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
- [ ] Existing phase test scripts pass unchanged
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-file CLI script with three sequential stages: argument parsing, pure scoring functions, and one of two output formatters. State lives in plain globals rather than in a config object, which is the convention the file already follows.

### Key Components

- **Argument loop** (`while [[ $# -gt 0 ]]` / `case`): the only place a flag becomes state. `--quiet` sets `QUIET=true` and shifts one token, exactly like `--auth` and `--architectural`.
- **Scoring functions** (`calculate_loc_score`, `calculate_files_score`, `calculate_risk_score`, `calculate_complexity_score`, `determine_level`, `calculate_confidence`, `determine_phasing`): untouched by this change, so a quiet run and a verbose run compute identical numbers.
- **`output_text()`**: the human formatter. It gains a guarded early return that emits the recommended-level line and nothing else.
- **`output_json()`**: the machine formatter. Untouched, and still selected first in `main` when `JSON_OUTPUT=true`.
- **`show_help()` and the file-header comment**: two documentation surfaces that both gain an `OPTIONS` entry.

### Data Flow

`$@` enters the argument loop, which writes `LOC`, `FILES`, the four risk booleans and now `QUIET`. The scoring functions read those globals and write `TOTAL_SCORE`, `RECOMMENDED_LEVEL`, `LEVEL_NAME`, `CONFIDENCE` and the phase results. `main` then calls `output_json` when `JSON_OUTPUT=true`, otherwise `output_text`, which prints either the one-line quiet form or the full report. The flag never reaches the scoring stage, so it cannot influence a number.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a feature packet rather than a bug fix, so the table records the producer and consumer inventory the change still needs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `output_text()` in `recommend-level.sh` | Owns the entire human-readable report, including the recommended-level line | update - add the guarded early return | `bash recommend-level.sh --loc 50 --files 2 --quiet` prints one line |
| Argument loop in `recommend-level.sh` | Turns flags into globals | update - add the `--quiet` case arm | `bash recommend-level.sh --quiet --loc 50 --files 2` does not error |
| `output_json()` in `recommend-level.sh` | Owns the machine-readable document | unchanged - never sees `QUIET` | `--json --quiet` still parses with `node -e JSON.parse` |
| `show_help()` in `recommend-level.sh` | Prints the discoverable option list | update - add the `--quiet` line | `bash recommend-level.sh --help` lists the flag |
| File-header `OPTIONS` comment | Documents the option surface for source readers | update - add the `--quiet` line | Read the header, confirm the entry exists |
| `cli/tests/test-phase-validation.js` | Runs `recommend-level.sh --json` and asserts phase fields | unchanged - asserts JSON only | Run the script; exit 0 |
| `cli/tests/test-phase-system.js` | Runs `recommend-level.sh --json` against phase fixtures | unchanged - asserts JSON only | Run the script; exit 0 |

Required inventories:
- Same-class producers: `rg -n 'JSON_OUTPUT|RECOMMEND_PHASES' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` shows the two existing boolean globals this flag joins, so the new one follows their shape.
- Consumers of changed symbols: `rg -n 'output_text|output_json' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` shows the only two call sites in `main`, so no other caller needs an update.
- Matrix axes: flag state (`--quiet` absent, present) crossed with output mode (text, JSON) crossed with help (`--help` absent, present) - six rows, of which AC-002, AC-003, AC-004 and AC-007 cover the four that differ in output.
- Algorithm invariant: the scoring path is untouched, so for any input the pair of runs (with and without `--quiet`) must report the same level, score and confidence. AC-005 checks the highest-scoring fixture on both sides.
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
| Unit | Not applicable - the script has no unit harness, and adding one is out of scope | - |
| Integration | The existing phase fixtures run the script through `--json` and assert `recommended_phases`, `phase_score` and `suggested_phase_count` | `node cli/tests/test-phase-validation.js`, `node cli/tests/test-phase-system.js` |
| Manual | Six combinations of flag state, output mode and help, plus the stderr error paths | Bash, `wc -l`, `diff` |
| Regression | Byte-for-byte comparison of the default report before and after the edit | `diff` against a baseline captured to `scratch/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2 or newer | External | Green | The script already targets it; a bash 4-only construct would break macOS |
| Node.js for the phase test scripts | External | Green | Without it the regression check falls back to the manual diff only |
| `recommend-level.sh` staying a single file | Internal | Green | Splitting the output formatter out would move this change into a different packet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any caller reports changed default output, or `--json` output stops parsing.
- **Procedure**: Revert the one file. The change is a single commit touching `recommend-level.sh` only, so `git checkout -- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` restores the previous behaviour. No data, schema or configuration is involved.
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
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Core Implementation | Low | 30 to 45 minutes |
| Verification | Low | 30 minutes |
| **Total** | | **About 1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable, no data changes; the file is under version control
- [ ] Feature flag configured - not applicable, `--quiet` is opt-in per invocation
- [ ] Monitoring alerts set - not applicable, the script has no runtime service

### Rollback Procedure
1. Revert `recommend-level.sh` to the previous revision.
2. Run the phase test scripts to confirm the JSON contract is intact.
3. Run one text invocation and confirm the full report returns.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable - the change touches no persisted state.
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
| `QUIET` global | None | Flag state read by `output_text()` | Argument loop arm, quiet branch |
| Argument loop arm | `QUIET` global | `QUIET=true` on `--quiet` | Quiet branch |
| Quiet branch in `output_text()` | `QUIET` global, `RECOMMENDED_LEVEL`, `LEVEL_NAME` | The single output line | Help text, verification |
| Help entries | The final flag spelling | Discoverable option list | Documentation check |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Add the global and the argument-loop arm** - 10 minutes - CRITICAL
2. **Add the quiet branch to `output_text()`** - 15 minutes - CRITICAL
3. **Update both help surfaces** - 10 minutes - CRITICAL
4. **Capture the baseline, diff, and run the phase scripts** - 30 minutes - CRITICAL

**Total Critical Path**: about 65 minutes

**Parallel Opportunities**:
- The header-comment entry and the `show_help()` entry can be written in one pass, since they are the same sentence in two places.
- The baseline capture for the default-output diff can happen before the edit and does not block writing code.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup Complete | Baseline output captured, script read end to end | Phase 1 |
| M2 | Core Done | `--quiet` prints one line and default output is unchanged | Phase 2 |
| M3 | Release Ready | Phase test scripts pass and every acceptance criterion is Met | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: `--json` takes precedence over `--quiet`

**Status**: Accepted

**Context**: A caller can pass both flags. Two behaviours are possible: quiet wins and the caller gets a prose line where they asked for JSON, or JSON wins and the caller gets the document they asked for. The script dispatches on `JSON_OUTPUT` in `main` before it reaches `output_text()`, so the choice is also a choice about where the branch lives.

**Decision**: `--quiet` affects only `output_text()`. When `JSON_OUTPUT=true`, `main` calls `output_json()` and `--quiet` has no effect. A caller who wants one line omits `--json`; a caller who wants JSON keeps parsing it.

**Consequences**:
- A JSON consumer that adds `--quiet` by mistake still gets parseable output rather than a silent break.
- The two flags stay orthogonal, so neither has to know about the other.
- `--quiet --json` is not an error and produces no warning, which is documented in the help text rather than enforced.

**Alternatives Rejected**:
- Quiet wins over JSON: rejected because it would hand a JSON consumer a prose line, the exact failure the flag is supposed to prevent elsewhere.
- Treat the combination as a usage error: rejected because both flags are legitimate and the precedence is unambiguous once stated.

---

### ADR-002: The quiet branch lives in `output_text()`

**Status**: Accepted

**Context**: Suppression could sit in `main` (skip the formatter and echo the line) or in `output_text()` (print the line and return). Both produce the same bytes today.

**Decision**: Put the branch at the top of `output_text()`. The function already owns every character of the human report, including the recommended-level line, so the rule "quiet means one line" stays in the one place that decides what a line is.

**Consequences**:
- A future formatter change does not have to remember a suppression rule that lives in `main`.
- `output_text()` keeps a single exit path per mode, which matches the file's existing style of small functions with early returns in the validators.
- The function gains a guard that reads a global, which is how every other output decision in the file already works.

**Alternatives Rejected**:
- Branch in `main`: rejected because it duplicates knowledge of what the first line contains, so a change to that line's wording would have to be made twice.
- A separate `output_quiet()` function: rejected as a second formatter to maintain for a single `echo`.

---
