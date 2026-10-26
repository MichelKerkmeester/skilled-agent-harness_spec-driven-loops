---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Adds a quiet output mode to the level recommender: one boolean global, one parser case, one guarded branch in the text output path and regression tests that pin the default report."
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
| **Language/Stack** | Bash 3.2+ (macOS default) and Bash 5.x (Linux CI) |
| **Framework** | None, single script |
| **Storage** | None |
| **Testing** | `bash -n`, shellcheck when installed, `node tests/test-phase-system.js`, `node tests/test-phase-validation.js` |

### Overview
The change adds one boolean global, one `case` arm in the parser and one guarded branch in the output dispatch. The scoring path stays untouched, so the quiet line reports the same values the full report already shows.
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
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file CLI with an output-mode flag.

### Key Components
- **Argument parser**: the `while` and `case` block that turns flags into globals. It gains a `--quiet` arm that sets `QUIET_OUTPUT=true`.
- **Output dispatch**: the final `if` that chooses between JSON and text. It checks `JSON_OUTPUT` first, then `QUIET_OUTPUT`, then the full report.
- **`output_text`**: the existing report writer. It stays unchanged.
- **`output_json`**: the existing machine payload. It stays unchanged.

### Data Flow
Arguments land in globals, the scoring helpers read those globals, `determine_level` sets `RECOMMENDED_LEVEL` and `LEVEL_NAME`, and the dispatch writes one of three outputs to stdout. `--quiet` only changes the dispatch decision, never the values that reach it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` argument parser | Owns flag parsing and the unknown-option error | update | `rg -n 'quiet' recommend-level.sh` shows the case arm |
| `output_text` | Owns the human report and the level line | unchanged | default run diff against the baseline |
| `output_json` | Owns the machine payload | unchanged | `--json` output parsed by the phase tests |
| `show_help` | Owns the documented option list | update | help text lists `--quiet` |
| Header OPTIONS comment | Documents usage at the top of the file | update | read lines 13 to 35 |
| `tests/test-phase-system.js` | Consumes JSON output | unchanged, add quiet cases | `node tests/test-phase-system.js` |
| `tests/test-phase-validation.js` | Consumes JSON output | unchanged | `node tests/test-phase-validation.js` |
| `runtime/cli/spec/README.md` | Lists the script by purpose, not by flag | not a consumer | `rg -n 'quiet' runtime/cli/spec/README.md` returns nothing |

Required inventories:
- Same-class producers: `rg -n 'JSON_OUTPUT|RECOMMEND_PHASES' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` shows the boolean globals this flag joins.
- Consumers of changed symbols: `rg -n 'recommend-level' .skilled/skills/system-spec-kit/runtime/cli/tests` names the two phase tests.
- Matrix axes: quiet on and off, json on and off, phases on and off, plus the error paths.
- Algorithm invariant: none. This change does not touch scoring, path handling or parsing of user values.
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
| Unit | Argument parsing and the quiet branch | `bash -n`, shellcheck |
| Integration | JSON payload and phase fields | `node tests/test-phase-system.js`, `node tests/test-phase-validation.js` |
| Manual | Flag matrix, help text and error paths | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ | Internal | Green | The script cannot run on macOS defaults |
| Existing `output_text` line format | Internal | Green | Quiet output has no format to reuse |
| Phase test suites | Internal | Green | Regressions in JSON output go unnoticed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Quiet output breaks a caller, or the default report changes for any input.
- **Procedure**: `git revert` the single commit. As a manual fallback, remove the `--quiet` case arm, the dispatch branch and the help lines.
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
| Implementation | Low | 30 minutes |
| Verification | Low | 45 minutes |
| **Total** | | **About 1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline output captured for the flag matrix
- [ ] Consumer test suites run before the change
- [ ] No feature flag needed, the flag itself is the opt-in

### Rollback Procedure
1. Revert the commit that touched `recommend-level.sh`.
2. Run `bash -n` and the two phase test suites.
3. Confirm the default report matches the captured baseline.
4. Tell callers that `--quiet` is gone, if any shipped against it.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Parser    │────►│  Output dispatch │────►│    stdout    │
│  --quiet    │     │  json > quiet >  │     │  one line or │
│             │     │  full report     │     │  full report │
└─────────────┘     └──────────────────┘     └──────────────┘
        │                     ▲
        │                     │
        └──────► tests ───────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Parser | None | `QUIET_OUTPUT` | Dispatch |
| Dispatch | Parser | Selected output | stdout |
| Tests | Parser, Dispatch | Regression signal | Sign-off |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T002 baseline capture** - 15 minutes - CRITICAL
2. **T005 parser arm** - 10 minutes - CRITICAL
3. **T006 dispatch branch** - 10 minutes - CRITICAL
4. **T012 default diff** - 15 minutes - CRITICAL
5. **T017 phase system test** - 15 minutes - CRITICAL

**Total Critical Path**: about 65 minutes

**Parallel Opportunities**:
- T008 and T009 (header comment and help text) can run alongside T005.
- T011 shellcheck can run alongside T013 quiet output checks.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Parser accepts the flag | `--quiet` sets the mode and `bash -n` passes | Phase 2 |
| M2 | Quiet output verified | One line for the full flag matrix | Phase 3 |
| M3 | Regression signal green | Default diff empty and both phase suites pass | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet mode prints the level line only and yields to JSON

**Status**: Accepted

**Context**: Callers need the recommended level without parsing the human report. Two output modes already exist, the full text report and the JSON payload, and the JSON payload is consumed by tests.

**Decision**: `--quiet` prints exactly `Recommended Level: N (Name)` on stdout, with no title, score line, breakdown or phase block. When `--json` is also present, the JSON payload wins and `--quiet` has no effect. Errors always go to stderr.

**Consequences**:
- Callers get a stable one-line contract that survives report changes.
- The quiet branch must reuse the same format literal as `output_text` to avoid drift.
- `--quiet` cannot be used to trim the JSON payload, which is fine because the payload is already machine shaped.

**Alternatives Rejected**:
- Suppress only the breakdown and keep the score line: rejected because the result is still multi-line.
- Add `--format level`: rejected because one enum value does not justify a new option surface.
- Make `--quiet` suppress the phase block only: rejected because the caller still parses a report.

---
