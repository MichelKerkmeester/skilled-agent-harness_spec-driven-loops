---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a third output mode to recommend-level.sh: a --quiet flag that prints only the Recommended Level line. The change touches the argument parser, one new output function and the dispatch tail; scoring is untouched."
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
| **Language/Stack** | Bash 3.2-compatible shell |
| **Framework** | None; one script, no sourced project library |
| **Storage** | None |
| **Testing** | Bash harness in `runtime/cli/tests/`, byte-diff captures, and `shellcheck` at `/opt/homebrew/bin/shellcheck` |

### Overview
`recommend-level.sh` already separates scoring from presentation: the scoring functions fill globals, and a dispatch tail chooses `output_text` or `output_json`. This change adds a third writer, `output_quiet`, and a `QUIET_MODE` global set by a `--quiet` case branch. The dispatch checks quiet first, so the flag prints the same level line the text report carries and nothing else. No scoring function changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and scope documented in `spec.md` §2 and §3
- [x] Success criteria measurable in `spec.md` §5 and `acceptance-criteria.md`
- [x] Dependencies identified in §6 of this plan

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.sh` exits 0 with zero failures
- [ ] Default text and JSON captures diff clean against `scratch/baseline/`
- [ ] Spec, plan and tasks agree on the final behavior
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file CLI script with a dispatch tail. There is no framework, no service layer and no stored state; the script computes in memory and writes once.

### Key Components
- **Argument parser** (`recommend-level.sh:652-719`): a `while`/`case` loop that sets `LOC`, `FILES` and the risk flags and rejects unknown options. It gains the `--quiet` branch.
- **Scoring pipeline** (`recommend-level.sh:216-500`): `calculate_loc_score`, `calculate_files_score`, `calculate_risk_score`, `calculate_complexity_score`, `determine_level`, `calculate_confidence`, `determine_phasing`. Unchanged.
- **Output writers** (`recommend-level.sh:508-648`): `output_text` and `output_json` today; this packet adds `output_quiet` beside them.
- **Dispatch tail** (`recommend-level.sh:770-774`): selects one writer and exits 0. This is the only control-flow change.

### Data Flow
`argv` → parser sets inputs and mode globals → scoring fills `TOTAL_SCORE`, `RECOMMENDED_LEVEL`, `LEVEL_NAME`, `CONFIDENCE` and the phase fields → dispatch picks one writer → stdout → `exit 0`. Quiet mode changes only the writer choice, so every value the line carries is the value the report already carries.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` argument parser | Accepts 11 flags and rejects every other token with exit 1 | update: add `--quiet` after the `--json|-j` branch at `recommend-level.sh:706-709` | `grep -n -- '--quiet' recommend-level.sh` shows the case branch; `--quiet` run exits 0 |
| `output_text` | Prints the 16-17 line report | unchanged | byte diff against `scratch/baseline/text-*.txt` |
| `output_json` | Prints the JSON document | unchanged | byte diff against `scratch/baseline/json-*.json` |
| new `output_quiet` | Prints one line | create beside `output_text` at `recommend-level.sh:508` | harness asserts exact content, line count and no leading blank line |
| dispatch tail | Chooses text or JSON | update: quiet branch first at `recommend-level.sh:770-774` | `--quiet --json` harness case |
| `show_help` OPTIONS | Lists the flags | update at `recommend-level.sh:181` | `bash recommend-level.sh --help \| grep -c -- '--quiet'` returns `1` |
| header comment OPTIONS | Lists the flags for readers of the file | update at `recommend-level.sh:26` | `grep -c -- '^#   --quiet' recommend-level.sh` returns `1` |
| `execution-methods.md` flag table | Documents the scoring flags | update one row | `grep -c -- '--quiet' execution-methods.md` returns `1` |
| In-repo callers of the script | None read its stdout | not a consumer | `grep -rn "Recommended Level" .skilled/skills/system-spec-kit` returns 0 hits outside `recommend-level.sh` |
| `-q` short flag | Not present; `-q` exits 1 as unknown | unchanged | ADR-003; harness asserts `-q` still fails |

Required inventories:
- Same-class producers: `grep -rln "QUIET_MODE" .skilled/skills/system-spec-kit/runtime/cli/spec/*.sh` returns `check-completion.sh`, `progressive-validate.sh` and `validate.sh`. Each owns its own parser; there is no shared flag table, so this change adds one branch to one parser rather than updating a central list.
- Consumers of changed symbols: `grep -rn "Recommended Level" .skilled/skills/system-spec-kit` returns 0 hits outside `recommend-level.sh`, so no in-repo script parses the line.
- Matrix axes: output mode (text, json, quiet, quiet+json) crossed with phase scoring (on, off) gives 8 rows; Level 0 and Level 3 add 2 rows in quiet mode, and the Level 1 quiet row is already in the 8. The harness covers all 10, plus 5 guard assertions.
- Algorithm invariant: quiet mode selects a writer and must not alter any computed value. Adversarial cases: a leading blank line, an extra trailing line, JSON leaking through, a diagnostic leaking to stdout, and an unknown option being swallowed.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline capture
Run the current script for the three level-boundary argument sets and store stdout in `scratch/baseline/`. Nothing changes until those files exist, because every later regression claim compares against them.

### Phase 2: Parser and output function
Add `QUIET_MODE=false` beside `JSON_OUTPUT=false`, the `--quiet` case branch after `--json|-j`, and `output_quiet()` beside `output_text`. The function prints one line through a single `printf '%s\n'`, which rules out the leading blank line `output_text` starts with.

### Phase 3: Dispatch and help
Reorder the dispatch tail so quiet mode is checked before JSON, then document the flag in both help surfaces: the header comment and `show_help()`.

### Phase 4: Verification
Write and run `runtime/cli/tests/test-recommend-level.sh`, diff both default captures, and run `shellcheck` on the script.

### Phase 5: Documentation and closeout
Add the `--quiet` row to `execution-methods.md`, update `tasks.md` evidence, and record the outcome in `implementation-summary.md` at completion time.

Follow the ordered tasks in `tasks.md`. It owns the task state and the verification checklist.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `output_quiet` output shape and the parser branch | `runtime/cli/tests/test-recommend-level.sh` |
| Regression | Default text and JSON output, byte for byte | `diff` against `scratch/baseline/` |
| Integration | Combined flags and exit codes in one shell | Harness cases for `--quiet --json`, `--quiet --help`, `--quiet --bogus` |
| Manual | Read the help text and run one example by hand | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2 or newer | External | Green | The script stops running on macOS's default shell |
| `test-upgrade-level.sh` harness pattern | Internal | Green | The new harness invents its own summary format and is harder to compare |
| `shellcheck` | External tooling | Green | Lint step is skipped; the harness still gates behavior |
| `scratch/baseline/` captures | Internal | Green | AC-003 and AC-004 lose their before-picture |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Default text or JSON output changes, or quiet output is anything other than exactly one line.
- **Procedure**: Revert the single implementation commit. The change is confined to one script, one new test file and one documentation row; there is no data, schema or configuration to unwind.
<!-- /ANCHOR:rollback -->

---



---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ──► Phase 2 (Parser + writer) ──► Phase 3 (Dispatch + help)
                                                              │
                                                              ▼
                                              Phase 4 (Verify) ──► Phase 5 (Docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Parser + writer |
| Parser + writer | Baseline | Dispatch + help |
| Dispatch + help | Parser + writer | Verify |
| Verify | Dispatch + help | Docs |
| Docs | Verify | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline capture | Low | 15 minutes |
| Parser + writer | Low | 30 minutes |
| Dispatch + help | Low | 15 minutes |
| Verification | Medium | 25 minutes |
| Documentation | Low | 10 minutes |
| **Total** | | **About 1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes; nothing to back up
- [x] No feature flag to configure; the new flag is itself the opt-in
- [x] No monitoring change; this is CLI stdout only

### Rollback Procedure
1. `git revert <implementation-sha>` on the branch that carries the change.
2. Re-run `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.sh`.
3. Confirm the default captures still diff clean against `scratch/baseline/`.
4. No stakeholder notification is needed; the script is internal tooling.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---



---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│  Baseline   │     │ Parser+Writer│    │ Dispatch+Help│
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                        ┌──────▼──────┐     ┌─────────────┐
                                        │   Phase 4   │────►│   Phase 5   │
                                        │   Verify    │     │    Docs     │
                                        └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline captures | None | Text and JSON reference output | Harness regression cases |
| `QUIET_MODE` global and parser branch | Baseline | Accepted `--quiet` | `output_quiet` dispatch |
| `output_quiet` | Parser branch | One-line writer | Dispatch |
| Dispatch branch | `output_quiet` | Quiet selection | Harness, help verification |
| Help text | Parser branch | Documented flag | Help assertions |
| Harness | All implementation pieces | PASS/FAIL evidence | Packet closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001 Baseline capture** - 15 minutes - CRITICAL
2. **T003 `output_quiet`** - 20 minutes - CRITICAL
3. **T004 Dispatch branch** - 10 minutes - CRITICAL
4. **T007 Harness** - 25 minutes - CRITICAL
5. **T010 Strict validation of this packet** - 10 minutes - CRITICAL

**Total Critical Path**: About 80 minutes

**Parallel Opportunities**:
- T005 help text and T012 documentation row can run alongside the harness.
- T001 baseline capture can run before any edit and does not block the parser edit.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `scratch/baseline/` holds text and JSON captures for three argument sets | Phase 1 |
| M2 | Quiet mode implemented | `--quiet` prints one line; default paths untouched | Phase 3 |
| M3 | Verified | Harness exits 0, default diffs clean, `shellcheck` clean | Phase 4 |
| M4 | Documented and closeable | `execution-methods.md` updated; every acceptance row `Met` | Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet output reuses the existing level line verbatim

**Status**: Accepted

**Context**: A caller needs the recommended level, and the report already carries it as `Recommended Level: N (Name)`. Any second format would become a second contract to keep in sync.

**Decision**: `output_quiet()` prints the same `Recommended Level: N (Name)` line that `output_text` prints, followed by one newline, with no leading blank line.

**Consequences**:
- Positive: one grep pattern works against both the report and the quiet output; no new vocabulary.
- Negative: machine consumers still split on `:` and `(`. That cost already exists for the report, and the level number and name stay readable.

**Alternatives Rejected**:
- Print only the integer: hides the level name and breaks the line callers already match.
- Keep the report and let callers filter it: that is the status quo this packet removes.

---

### ADR-002: `--quiet` takes precedence over `--json`

**Status**: Accepted

**Context**: Both flags request a specific output shape, and the script accepts flags in any order. Combining them has no obvious meaning.

**Decision**: Quiet mode wins. `--quiet --json` prints the one-line level and no JSON document.

**Consequences**:
- Positive: the flag's promise is unconditional, so no combination silently produces a different shape.
- Negative: a caller that passed both by mistake loses JSON without an error. The help text states the precedence, and AC-005 pins it.

**Alternatives Rejected**:
- Error on the combination: adds a failure mode for a case with an obvious reading.
- JSON wins: contradicts the flag's stated contract.

---

### ADR-003: No `-q` short alias in this packet

**Status**: Accepted

**Context**: `validate.sh`, `check-completion.sh` and `progressive-validate.sh` accept `--quiet|-q`. Adding `-q` here would match them, but no caller has asked for it.

**Decision**: Add only `--quiet`, the requested surface.

**Consequences**:
- Positive: the surface stays exactly as large as the feature, and no short flag is claimed before its meaning is needed.
- Negative: a user who types `-q` gets an unknown-option error, which is inconsistent with the sibling scripts. A later packet can add the alias with a caller behind it.

**Alternatives Rejected**:
- Add `-q` now: unrequested surface, and the harness would then need to pin an alias nothing uses.

---
