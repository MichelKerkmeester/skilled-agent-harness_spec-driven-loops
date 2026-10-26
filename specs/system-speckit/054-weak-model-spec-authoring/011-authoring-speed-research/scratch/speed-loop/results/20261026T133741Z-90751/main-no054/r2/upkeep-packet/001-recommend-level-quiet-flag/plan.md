---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add one boolean output mode to a single bash script: parse --quiet, print the level line from a dedicated formatter, and branch to it before the JSON check so the two existing formatters stay untouched."
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
| **Framework** | None; one script with formatter functions |
| **Storage** | None |
| **Testing** | `vitest` spawning `bash`, the pattern the `runtime/cli/tests/create-*.vitest.ts` files already use |

### Overview
`recommend-level.sh` already separates scoring from presentation: `output_text()` and `output_json()` each read the same globals. The change adds a third formatter, `output_quiet()`, that prints the level line and nothing else, plus a `QUIET_OUTPUT` global and one parser arm. The dispatch in section 7 checks quiet first, so the existing two formatters are not edited at all and the default path cannot drift.
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
- [ ] New test passes and the existing spec-script tests still pass
- [ ] Help text and header comment list the flag
- [ ] Strict validation of this packet passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file bash CLI with formatter functions: parse arguments into globals, score, then hand the same globals to one of three output functions.

### Key Components
- **Argument parser (section 5)**: the `case` loop that already maps `--loc`, `--files`, the risk flags, `--json` and `--help`; gains one `--quiet` arm.
- **Globals (section 2)**: `QUIET_OUTPUT=false` joins `JSON_OUTPUT` and `RECOMMEND_PHASES`.
- **`output_quiet()` (section 4)**: one `echo` of `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})`.
- **Dispatch (section 7)**: quiet, then JSON, then text.

### Data Flow
Arguments set globals, `calculate_*_score` and `determine_level` fill the score globals, and the dispatch picks the formatter. Quiet reads `RECOMMENDED_LEVEL` and `LEVEL_NAME` after `determine_level` has run, so it needs no new scoring state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

The change alters an output contract, so every surface that reads the script or quotes its output is listed with what happens to it.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` argument parser | Accepts `--loc`, `--files`, `--auth`, `--api`, `--db`, `--architectural`, `--recommend-phases`, `--no-recommend-phases`, `--phase-threshold`, `--json`, `--help` | Add `--quiet` | `--help` lists it; the test spawns the script with the flag |
| `output_text()` | Prints the sixteen-line report | Unchanged | Byte-compare test over three fixed inputs |
| `output_json()` | Prints the thirty-six-line JSON document | Unchanged | JSON test on one fixed input |
| Dispatch (section 7) | Chooses JSON or text | Quiet is checked first | Test for `--quiet --json` |
| Error paths (sections 5 and 6) | Write to stderr and exit 1 | Unchanged | Test asserts empty stdout and exit 1 |
| `references/workflows/execution-methods.md` §6 | Lists scoring flags; omits `--json` today | Unchanged | `rg -n "recommend-level" .skilled/skills/system-spec-kit/references` finds only that feature-flag table |
| `runtime/cli/spec/README.md` | Lists the script, not its flags | Unchanged | `rg -n "recommend-level" .skilled/skills/system-spec-kit/runtime/cli/spec/README.md` |

Required inventories:
- Same-class producers: `rg -n "JSON_OUTPUT|RECOMMEND_PHASES" .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` finds the two boolean output flags that `--quiet` copies.
- Consumers of changed symbols: `rg -n "recommend-level" .skilled/skills/system-spec-kit/runtime .skilled/skills/system-spec-kit/references --glob '*.md' --glob '*.sh'` finds no caller that passes `--quiet` today.
- Matrix axes: flag present or absent, JSON present or absent, input valid or invalid, eight rows, all listed in `acceptance-criteria.md`.
- Algorithm invariant: this is not a path, parser or security fix. The invariant it does add is "stdout has one line when quiet is set, and the same lines as before when it is not".
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
| Unit | `output_quiet()` text for each of the four level buckets | `vitest` spawning `bash` |
| Integration | Flag combinations, stdout line count, exit codes, stderr separation | `vitest` spawning `bash` |
| Manual | Default report diffed before and after for three inputs | `diff` over two captured files in `scratch/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ | Internal | Green | The script already targets it; a newer-only construct would break macOS |
| `vitest` runner already installed for `runtime/cli/tests` | Internal | Green | Without it the regression test has no home and verification falls back to manual runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A caller's default output changes, or the quiet line disagrees with the report it replaces.
- **Procedure**: Revert the single commit that touches `recommend-level.sh` and delete the new test. The flag is additive, so no configuration, data or call site needs unwinding.
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
| Baseline capture | Setup | Implementation |
| Implementation | Setup, Baseline | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Baseline capture | Low | 15 minutes |
| Core Implementation | Low | 45 minutes |
| Verification | Low | 45 minutes |
| **Total** | | **About 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (not needed; no data changes)
- [ ] Feature flag configured (not needed; the CLI flag is the switch)
- [ ] Monitoring alerts set (not applicable to a local CLI)

### Rollback Procedure
1. Revert the commit that changes `recommend-level.sh`.
2. Delete `runtime/cli/tests/recommend-level-quiet.vitest.ts`.
3. Re-run the default output capture and confirm it matches the pre-change baseline.

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
                    ┌─────▼─────┐
                    │  Baseline │
                    │  capture  │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Pre-change output for three inputs | Byte-compare test |
| `QUIET_OUTPUT` global | None | Parser state | `output_quiet()` |
| Parser arm | `QUIET_OUTPUT` | A set flag | Dispatch |
| `output_quiet()` | `RECOMMENDED_LEVEL`, `LEVEL_NAME` | One line of stdout | Dispatch |
| Dispatch | Parser arm, `output_quiet()` | The chosen output | Verification |
| Regression test | Baseline capture, dispatch | Pass or fail | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 15 minutes - CRITICAL
2. **Parser arm, global and `output_quiet()`** - 45 minutes - CRITICAL
3. **Dispatch branch** - 10 minutes - CRITICAL
4. **Regression test and strict validation** - 45 minutes - CRITICAL

**Total Critical Path**: about 2 hours

**Parallel Opportunities**:
- The help text and header comment edits can run alongside the test authoring.
- The default-output diff can run while the JSON test is written.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Three default-output captures stored in `scratch/` | Phase 1 |
| M2 | Flag works | `--quiet` prints one line for every level bucket | Phase 2 |
| M3 | Release ready | Test passes, default output byte-identical, strict validation clean | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet takes precedence over JSON

**Status**: Proposed

**Context**: Two output flags can be combined. The script has to state what `--quiet --json` prints, or a caller discovers the answer by experiment.

**Decision**: The dispatch checks `QUIET_OUTPUT` before `JSON_OUTPUT`, so `--quiet --json` prints the single `Recommended Level:` line, and `--help` says so.

**Consequences**:
- One rule covers every combination: quiet means exactly one line of stdout.
- A caller that passes both loses its JSON document. The help text names the precedence, and the regression test pins it.

**Alternatives Rejected**:
- JSON wins: `--quiet` would be silently inert in that combination, and the flag would stop meaning what its name says.
- Reject the combination with exit 1: adds a failure mode to a request that has an obvious answer.
- One-line JSON in quiet mode: a third output shape for a one-flag change, and it is not a "recommended-level line".

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm the write scope is `recommend-level.sh` and the new test file; do not edit `output_text()` or `output_json()`.
- Capture the three default-output baselines before touching the script.
- Re-read the parser and dispatch sections after editing, because the line numbers move.

### Execution Rules

| Rule | Handling |
|------|----------|
| Additive change | Add a global, a formatter and a parser arm; do not restructure existing sections. |
| Default output frozen | Any diff in the non-quiet report is a failure, not an improvement. |
| Validator loop | Run the new test and strict validation after the last edit, and fix what they report. |
| Comment hygiene | Describe the flag's behavior in the header comment; do not record packet or task ids in the script. |

### Status Reporting Format
- Files changed and the section of the script each edit touched.
- Test command and its pass or fail line.
- Byte-compare result for the three baselines.
- Strict validator result line.

### Blocked Task Protocol
- Stop and report if a baseline capture cannot be reproduced before the change.
- Stop and report if the default output diff is non-empty after the change, rather than adjusting the baseline.
- Do not widen scope to the other `spec/*.sh` scripts to make a test pass.

---
