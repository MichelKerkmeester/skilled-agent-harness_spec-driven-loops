---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a QUIET global, a --quiet case arm and a third output branch to recommend-level.sh, refuse --quiet with --json, and prove the default output is unchanged with a byte comparison over a fixed invocation matrix."
trigger_phrases:
  - "recommend level quiet flag plan"
  - "recommend-level.sh quiet flag implementation"
importance_tier: "normal"
contextType: "implementation"
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
| **Language/Stack** | Bash 3.2-compatible shell script, 780 lines |
| **Framework** | None |
| **Storage** | None. The script reads no file and writes none |
| **Testing** | Vitest spawning `bash` against the script, plus a manual byte comparison |

### Overview
The script has one output dispatch at `:770-774` that chooses between `output_text` and `output_json`. A third choice belongs there, and nothing else in the scoring path moves. The flag is a presentation switch: the score, the level and the exit code stay exactly as they are, so the only new failure mode is a request that asks for two output modes at once.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met, each case having failed against the pre-change script first
- [ ] The pre-change and post-change stdout diff over the existing invocation matrix is empty
- [ ] `validate.sh --strict` passes on this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One flag, one global, one branch. The change lands in the argument parser and the output dispatch, and the scoring functions are not opened.

### Key Components
- **Globals** (`recommend-level.sh:116-142`): `JSON_OUTPUT=false` at `:122` is the shape `QUIET` copies. Both are set once during parsing and read once at dispatch.
- **Argument parser** (`:656-719`): a `case` arm per flag. `--quiet` takes no value, so its arm is one assignment and a `shift`, the same shape as `--auth` at `:674-677`.
- **Validation** (`:722-742`): numeric checks and the required-input check, each of which reports to stderr and exits 1 before any output. The `--quiet`/`--json` conflict check joins this block so a refused run produces no partial output.
- **Output dispatch** (`:770-774`): `JSON_OUTPUT` selects `output_json`, otherwise `output_text`. `QUIET` becomes the first branch so it wins over the default without touching either existing function.
- **`output_text`** (`:508-558`): the recommended-level line at `:510` is `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})`. `output_quiet` prints that same string, with no leading blank line.
- **Documentation surfaces**: the header OPTIONS comment at `:16-27` and the `show_help()` OPTIONS block at `:171-182`, plus one example line in each.

### Data Flow
Parse the flags, validate the inputs, score, dispatch. `QUIET` is read only at dispatch, so the path from input to level is identical in both modes and the two outputs cannot disagree about the level.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` argument parser (`:656-719`) | Turns argv into globals | update: add the `--quiet` arm | the new test's accepted-flag case |
| `recommend-level.sh` output dispatch (`:770-774`) | Chooses text or JSON | update: add the quiet branch | the new test's stdout assertions |
| `output_text` (`:508-558`) | Default human output | unchanged | byte comparison against the pre-change script |
| `output_json` (`:562-649`) | Machine output for `speckit-plan.yaml:86` and `speckit-complete.yaml:147` | unchanged | the same two callers run with their existing arguments |
| `show_help` (`:162-211`) and the header comment (`:16-27`) | Usage text | update: name `--quiet` | a test that greps the help output |
| `create.sh` and `validate.sh` | Sibling entry points, no call into this script | not a consumer | `rg -n "recommend-level" runtime/cli/spec/*.sh` returns no call site |

Required inventories:
- Same-class producers: `rg -n "OUTPUT=false|_OUTPUT=" .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` to confirm `JSON_OUTPUT` is the only existing output-mode global and that `QUIET` follows its shape rather than inventing one.
- Consumers of the output: `rg -n "recommend-level" .skilled --glob '*.yaml' --glob '*.md' --glob '*.sh'`. The two YAML callers pass `--json`; every other hit is prose, so no consumer parses the text output and no consumer passes `--quiet` today.
- Matrix axes: level band (0, 1, 2, 3) x mode (default, `--quiet`) x phases (`--recommend-phases` on, `--no-recommend-phases`), plus the error axis (no inputs, bad numeric input, conflicting modes) and the help axis.
- Algorithm invariant: for any argv without `--quiet`, stdout, stderr and the exit code are byte-identical before and after the change.
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
| Unit | The flag, one input per level band, exact stdout and exit code | Vitest with `spawnSync('bash', [SCRIPT, ...args])`, the pattern `quality-audit-script.vitest.ts:14-16` already uses |
| Regression | Default, `--json`, `--no-recommend-phases` and `--help` output against the pre-change script | `bash` capturing stdout to `scratch/`, then `diff` |
| Manual | The one-line claim, read by eye once | `bash recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural --quiet` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2 or newer | External | Green | The script already declares that floor and the change uses nothing above it |
| `vitest` in `runtime/cli` | Internal | Green | Already a dev dependency at `package.json:36` |
| None outside the repository | External | Green | Nothing to install |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any existing invocation produces different stdout, stderr or exit code, or a consumer breaks on the new branch
- **Procedure**: Revert the commit. The script has no state and no migrations, so the revert is the whole rollback.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: baseline and failing test) ──► Phase 2 (Flag, dispatch, help) ──► Phase 3 (Verify)
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
| Setup | Low | 30 minutes |
| Core Implementation | Low | 30 minutes |
| Verification | Low | 30 minutes |
| **Total** | | **1.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-change stdout captured for every invocation in the matrix
- [ ] No feature flag. The option is opt-in by nature, so the default path is the safety net.
- [ ] Both YAML callers re-run with their existing `--json` arguments

### Rollback Procedure
1. Revert the commit
2. Rerun the matrix and confirm the pre-change output returns
3. No rebuild is needed: the script is interpreted, and no `dist` copy exists

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
                     │  Help and │
                     │  header   │
                     └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | Pre-change stdout in `scratch/` | Byte comparison |
| `QUIET` global and parser arm | Baseline capture | A flag the script accepts | Dispatch branch |
| Dispatch branch | `QUIET` global | One-line output | Test assertions |
| Conflict check | Parser arm | Exit 1 on `--quiet --json` | Conflict cases |
| Help and header text | None | Documented flag | Documentation check |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 10 minutes - CRITICAL
2. **Flag, conflict check and dispatch branch** - 20 minutes - CRITICAL
3. **Byte comparison and matrix run** - 20 minutes - CRITICAL

**Total Critical Path**: about 50 minutes

**Parallel Opportunities**:
- The help text and the header comment can be written while the dispatch branch is under test
- The new test file can be written against the intended behavior before the script changes
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline captured | Every existing invocation's stdout is in `scratch/` | Phase 1 |
| M2 | Flag works | `--quiet` prints one line for all four level bands | Phase 2 |
| M3 | Release ready | Matrix diff empty, test suite green, `validate.sh --strict` passes | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet output reuses the existing recommended-level line

**Status**: Accepted

**Context**: The script already prints `Recommended Level: <N> (<Name>)` at `:510`. A quiet mode could print that line, a bare integer, or a shorter sentence. Each new format is a second thing to keep in step with the first, and the line's wording is the only place a reader learns the level's name.

**Decision**: `--quiet` prints exactly the line `output_text` already prints, with no leading blank line. Quiet output is therefore a strict subset of the default output, not a parallel format.

**Consequences**:
- A caller can switch between modes without changing how it reads the answer, and the two can never disagree
- The line carries the level name, which a caller comparing integers does not need. The cost is one parenthesised word.

**Alternatives Rejected**:
- A bare integer: a new format with no reader benefit, and one more string to keep in sync
- A JSON object with one field: `--json` already exists and this would be a third mode

---

### ADR-002: `--quiet` with `--json` is refused, not resolved

**Status**: Accepted

**Context**: Both flags name a single output mode. The two current callers in `speckit-plan.yaml:86` and `speckit-complete.yaml:147` pass `--json`. If both flags are accepted, one has to win, and either winner silently ignores an explicit request.

**Decision**: The pair exits 1 with an error on stderr and nothing on stdout. The check runs after parsing and before scoring, alongside the numeric validations at `:722-742`.

**Consequences**:
- A caller that passes both learns it made a mistake instead of receiving output it did not ask for
- The refusal adds one `if` and one exit path, and no precedence rule to document

**Alternatives Rejected**:
- Quiet wins: it would drop the JSON structure a caller is probably parsing
- JSON wins: it would silently ignore `--quiet`, the flag the caller just added for a reason

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION FRAMEWORK

### Pre-Task Checklist
- [ ] Read `spec.md`, this plan and `tasks.md` before the first edit
- [ ] Capture the pre-change stdout for every invocation in the matrix before touching the script
- [ ] Know the verification command for the task before starting it: `bash -n` on the script, then the Vitest case

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Capture the baseline before the edit. The byte comparison is worthless once the old output is gone. |
| TASK-SCOPE | Touch `recommend-level.sh` and the new test file only. The scoring functions, the JSON shape and the trailing exit-code comment stay as they are. |
| TASK-VERIFY | Run `bash -n` and the new case before marking a task complete; a task that changes output is not done until the matrix diff is empty. |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact in the `tasks.md` blocked section
3. Continue with the next unblocked task; escalate after two blocked tasks
<!-- /ANCHOR:ai-execution -->

---

