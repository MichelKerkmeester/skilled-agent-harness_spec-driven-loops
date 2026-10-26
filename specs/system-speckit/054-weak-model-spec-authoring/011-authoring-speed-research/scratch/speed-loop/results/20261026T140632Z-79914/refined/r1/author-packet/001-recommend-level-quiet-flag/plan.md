---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add one boolean flag, one output function, one conflict guard and one help entry to a single bash script, keeping the default report byte-identical."
trigger_phrases:
  - "recommend level quiet flag plan"
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
| **Language/Stack** | Bash 3.2+ (macOS `/bin/bash`), no external packages |
| **Framework** | None; a single CLI script in the spec-kit runtime |
| **Storage** | None |
| **Testing** | Shell assertions on stdout, exit code and a captured baseline; `test-phase-system.sh` for the existing behaviour |

### Overview
The change adds one boolean to the argument parser, one output function, one conflict guard and one help entry in `recommend-level.sh`. The default path keeps calling `output_text`, so the report stays byte-identical; the quiet path prints the same `RECOMMENDED_LEVEL` and `LEVEL_NAME` values that `output_text` already emits. The proof is a one-line count on the quiet path and an empty `diff` against a baseline captured before the change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Baseline output captured for the four fixtures
- [ ] Quiet line format fixed by ADR-001 and the `--json` interaction by ADR-002

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash -n` on the script exits 0
- [ ] Default output byte-identical to the captured baseline on four fixtures
- [ ] `--quiet` prints one line on four fixtures, one per level band
- [ ] Help text and the header OPTIONS block both list `--quiet`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script branch: one file, one output selector.

### Key Components
- **Argument parser** (`recommend-level.sh` §5): gains a `--quiet` case that sets `QUIET=true`, next to the other boolean flags
- **`output_quiet()`** (`recommend-level.sh` §4): prints the level line once and nothing else
- **Output dispatch** (`recommend-level.sh` §7): selects quiet, then JSON, then text, in that fixed order
- **`show_help()` and the header OPTIONS block** (§3 and §1): document the flag in the existing style

### Data Flow
```
argv → parser (LOC, FILES, risk flags, QUIET, JSON_OUTPUT)
     → scoring (unchanged) → determine_level (RECOMMENDED_LEVEL, LEVEL_NAME)
     → output dispatch → output_quiet | output_json | output_text
```
Scoring is untouched, so the quiet path cannot change the level: it reads the same globals the report reads.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` `output_text()` | Produces the human report | unchanged; keeps its exact line sequence | Baseline `diff` for four fixtures prints nothing |
| `recommend-level.sh` parser and `show_help()` | Own the option surface | update: accept and document `--quiet` | `rg -n -- '--quiet' recommend-level.sh` prints the parser case, the header line and the help line |
| `recommend-level.sh` `output_json()` | Produces the machine payload | not a consumer; `--json` stays as it is | The JSON fixtures in `runtime/cli/tests/test-phase-system.js` define the payload contract and must stay green |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` and `speckit-complete.yaml` | Call the script with `--json` | not a consumer: they never pass `--quiet`, and the JSON path is untouched | `rg -n 'recommend-level.sh' .skilled/commands/speckit/assets/*.yaml` shows `--json` only |
| `runtime/cli/tests/test-phase-system.sh` | Regression suite for the spec scripts | not a consumer of the report; must stay green | Suite prints `12 passed, 0 failed` |
| `references/workflows/execution-methods.md` §6 | Documents the flag surface | unchanged in this packet: it lists feature flags, and the default invocation it shows is unchanged | `rg -n -- '--quiet' .skilled/skills/system-spec-kit/references/workflows/execution-methods.md` prints nothing |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Phase 1 captures the baseline, Phase 2 adds the flag, the quiet output path, the guard and the help text, and Phase 3 proves the one-line contract, the unchanged report and the error paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `output_quiet()` prints one line; the parser accepts `--quiet` | Shell assertions on stdout and exit code |
| Integration | Four fixtures across all four level bands, through both output paths | `wc -l`, `diff` against the captured baseline |
| Regression | The default report and the `--json` payload | Baseline diff plus `test-phase-system.sh` |
| Manual | `--quiet --help`, `--quiet --json`, missing and non-numeric inputs | Terminal run, exit codes, stderr capture |

The four fixtures, chosen because they land on each level band:

| Fixture | Arguments | Default lines | Level |
|---------|-----------|---------------|-------|
| F1 | `--loc 60 --files 3` | 16 | 0 (Quick) |
| F2 | `--loc 200 --files 5 --api` | 16 | 1 (Baseline) |
| F3 | `--loc 600 --files 12 --api --db` | 17 | 2 (Verification) |
| F4 | `--loc 500 --files 15 --auth --api --db --architectural` | 17 | 3 (Full) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2+ | Internal (OS) | Green | The script cannot run |
| `rg`, `diff`, `wc` | Internal (developer tools) | Green | The verification commands in `tasks.md` cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report changes on any fixture, or `--quiet` prints more than one line.
- **Procedure**: Revert the single commit that touches `recommend-level.sh`. There is no data, schema or configuration migration to undo.
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
| Setup | Low | 10 minutes |
| Core Implementation | Low | 25 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **~50 minutes (assumption)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline captured for the four fixtures
- [ ] No feature flag needed: the flag is the opt-in
- [ ] No monitoring: the script runs on demand and prints its own result

### Rollback Procedure
1. Revert the commit that touches `recommend-level.sh`
2. Re-run the four fixtures and confirm the default output matches the baseline
3. Run `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` and confirm `12 passed, 0 failed`
4. Notify callers only if the quiet flag had already been announced

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Phase 1   │────►│     Phase 2      │────►│   Phase 3   │
│   Setup     │     │ Implementation   │     │  Verify     │
└─────────────┘     └──────┬───────────┘     └─────────────┘
                           │
                    ┌──────▼───────┐
                    │   Help text  │
                    │  (parallel)  │
                    └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Four reference outputs | Verification |
| Parser case and globals | Baseline capture | `QUIET` state | Quiet output path, guard |
| `output_quiet()` | Parser case | One-line output | Verification |
| Conflict guard | Parser case | Exit 1 on `--quiet --json` | Verification |
| Help and header text | None | Documented flag | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Capture the baseline** - 10 minutes - CRITICAL
2. **Implement the flag, quiet path and guard** - 25 minutes - CRITICAL
3. **Verify the four fixtures and the error paths** - 15 minutes - CRITICAL

**Total Critical Path**: ~50 minutes

**Parallel Opportunities**:
- The help and header text can be written while the quiet path is tested
- The baseline capture can run alongside reading the script
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | `wc -l` prints 16, 16, 17, 17 for F1-F4 | Phase 1 |
| M2 | Flag implemented | `bash "$S" --quiet --loc 60 --files 3` prints one line | Phase 2 |
| M3 | Verification green | Four quiet runs print one line each and the baseline diff is empty | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reuse the existing level label in quiet mode

**Status**: Proposed

**Context**: The script already prints `Recommended Level: N (Name)` inside its report, and callers that parse the report match that label. A new quiet format could either repeat the label or invent a shorter one.

**Decision**: `output_quiet()` prints `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` — the same string `output_text()` emits, with no leading blank line.

**Consequences**:
- One parser works against both modes, so a caller can switch to `--quiet` without changing its regex
- The label becomes a contract; changing it later is a breaking change, which the acceptance criteria already guard

**Alternatives Rejected**:
- Bare number (`3`): ambiguous next to exit codes and unreadable in a log
- JSON only: forces every caller to parse JSON for one value

### ADR-002: `--quiet` and `--json` are mutually exclusive

**Status**: Proposed

**Context**: `--json` is a machine format that two command assets call directly, and the JSON fixtures assert that stdout holds the payload and nothing else. A caller could pass both flags, and either one could win.

**Decision**: Passing both exits 1 with `ERROR: --quiet and --json cannot be combined` on stderr and nothing on stdout.

**Consequences**:
- No invocation that asks for JSON silently receives text
- `--quiet` keeps its one-line contract for every invocation it accepts
- A caller that wants both must choose, which is a one-line change at the call site

**Alternatives Rejected**:
- Quiet wins silently: a wrapper that adds `--quiet` globally would break a JSON consumer without warning
- Quiet ignored under `--json`: `--quiet` would become a no-op that still reports success, which hides the mistake

---

