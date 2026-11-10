---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet/-q flag that prints only the existing recommended-level line. The change is one global, one case branch, one output function and one dispatch branch, and every other invocation stays byte-identical."
trigger_phrases:
  - "recommend level quiet flag plan"
importance_tier: "normal"
contextType: "implementation"
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
| **Language/Stack** | Bash 3.2+ |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Direct invocations with `wc -l` and `diff`, plus the two node suites that already exercise the script |

### Overview

The change lands inside one script: the argument loop gains a `--quiet`/`-q` branch, a new `output_quiet()` function prints the level line, and the dispatch chooses JSON, quiet or the full report in that order. Everything else — scoring, thresholds, confidence, phase logic — is untouched. Proof is a line count on each path plus a byte comparison of the default and JSON outputs against the baselines recorded before the edit.
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
Single-script output branch

### Key Components
- **Argument parser**: the `while`/`case` loop in section 5 that already owns `--json`, `--help` and the numeric options; `--quiet|-q` joins it.
- **Output functions**: `output_text` (16-line report), `output_json` (36-line document) and the new `output_quiet` (one line).
- **Dispatch**: the `if [[ "$JSON_OUTPUT" = true ]]` block at the end of the script; quiet becomes the middle branch.

### Data Flow
Arguments enter the case loop and set `QUIET_OUTPUT`. Scoring then runs unchanged over `LOC`, `FILES` and the risk flags, `determine_level` sets `RECOMMENDED_LEVEL` and `LEVEL_NAME`, and the dispatch prints JSON, the quiet line or the full report in that order.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/spec/recommend-level.sh` | producer: parses arguments and owns every byte of output | update | `bash -n` exits 0; `--quiet` prints one line |
| `runtime/cli/tests/test-phase-system.js` | consumer: invokes the script with `--json` only | unchanged | `rg -n -- '--quiet' runtime/cli/tests/test-phase-system.js` prints nothing |
| `runtime/cli/tests/test-phase-validation.js` | consumer: invokes the script with `--json` only | unchanged | `rg -n -- '--quiet' runtime/cli/tests/test-phase-validation.js` prints nothing |
| `references/workflows/execution-methods.md` | documents the script's flag table | unchanged | `rg -n -- '--quiet' references/workflows/execution-methods.md` prints nothing; the flag is documented in `--help` |

Required inventories:
- Same-class producers: `rg -n 'Recommended Level:' .skilled/skills/system-spec-kit/runtime` returns the single producer in `output_text`.
- Consumers of changed symbols: `rg -n 'RECOMMENDED_LEVEL|LEVEL_NAME' .skilled/skills/system-spec-kit/runtime` returns `determine_level`, `output_text`, `output_json` and the new `output_quiet`.
- Matrix axes: output mode (text, quiet, JSON) x input validity (valid, invalid) x phase flag (default, `--no-recommend-phases`).
- Algorithm invariant: none beyond the existing scoring; the flag changes presentation only.
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
| Unit | `recommend-level.sh` invocations, one assertion per requirement | `bash`, `wc -l`, `diff` |
| Integration | The two node suites that already drive the script | `node` |
| Manual | The `--help` text and the header OPTIONS block | A read against REQ-003 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ | Internal | Green | The script cannot run; no fallback is needed on macOS or in CI |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default report changes for any documented invocation, or a node suite fails.
- **Procedure**: `git checkout -- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`, or `git revert` the single commit, then rerun the three line counts.
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
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Core Implementation | Low | 25 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **55 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: git holds the tracked file
- [x] Feature flag configured: not applicable, the new flag is opt-in
- [x] Monitoring alerts set: the two node suites and the line counts

### Rollback Procedure
1. Confirm the failing invocation and its output
2. Revert the file: `git checkout -- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`
3. Rerun the three line counts and both node suites
4. Tell the operator which invocation changed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Phase 1    │────►│   Phase 2    │────►│   Phase 3    │
│    Setup     │     │    Core      │     │   Verify     │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Baseline capture | None | 16/36/12 line counts | Parser change |
| Parser and globals | Baseline capture | `QUIET_OUTPUT` | Output function |
| `output_quiet` | Parser and globals | One-line output | Dispatch |
| Dispatch | `output_quiet` | Live quiet path | Verification |
| Verification | Dispatch | Evidence for AC-001 to AC-008 | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline capture** - 5 minutes - CRITICAL
2. **Parser, output function and dispatch** - 25 minutes - CRITICAL
3. **Verification runs** - 20 minutes - CRITICAL

**Total Critical Path**: 50 minutes

**Parallel Opportunities**:
- The header OPTIONS block and the `--help` text can be written alongside the parser change
- `test-phase-system.js` and `test-phase-validation.js` can run at the same time
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup Complete | Baseline line counts recorded: 16, 36 and 12 | Phase 1 |
| M2 | Core Done | `--quiet --loc 1000 --files 20 --architectural --api --db` prints one line | Phase 2 |
| M3 | Release Ready | AC-001 to AC-008 met and `bash -n` exits 0 | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: A flag, not an environment variable

**Status**: Accepted

**Context**: Callers need a one-line answer. A global switch would also produce one, but hidden state is hard to discover and harder to test.

**Decision**: Parse `--quiet`/`-q` in the existing case loop and hold it in `QUIET_OUTPUT`.

**Consequences**:
- The caller opts in per invocation, so two callers in one shell cannot interfere.
- One more parser branch and one more `--help` line; both are covered by AC-001, AC-002 and AC-005.

**Alternatives Rejected**:
- `SPECKIT_QUIET=1`: invisible in `--help`, leaks between calls in the same shell, and needs its own test matrix.
- `--format=level`: introduces output-format vocabulary for a single case when `--json` already covers structured needs.

### ADR-002: Reuse the level line and keep JSON precedence

**Status**: Accepted

**Context**: The report's first content line is `Recommended Level: N (Name)`. A bare integer would be easier to `cut`, but the label is the existing contract. Separately, `--quiet` and `--json` could conflict.

**Decision**: `output_quiet` prints the existing line verbatim, and the dispatch checks `JSON_OUTPUT` first so `--quiet --json` emits the JSON document.

**Consequences**:
- Existing parsers that match the label keep working, and a diff test keeps the quiet line aligned with the report.
- A caller who wants a bare integer still needs `--json` and a parser; that is a deliberate non-goal.

**Alternatives Rejected**:
- Print only the integer: breaks the label contract and drops the level name.
- Let quiet win over JSON: would silently change the output of a machine-readable invocation.

---

