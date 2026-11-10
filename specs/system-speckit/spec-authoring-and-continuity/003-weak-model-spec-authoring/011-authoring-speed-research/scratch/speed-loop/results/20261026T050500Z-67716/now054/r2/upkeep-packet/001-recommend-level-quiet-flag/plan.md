---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Change one bash script in two places: the option parser gains a --quiet case, and the output dispatch gains a branch that prints the existing level line. A captured baseline and a line count prove the default path did not move."
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
| **Language/Stack** | Bash 3.2+ with `set -euo pipefail` |
| **Framework** | Spec-kit runtime CLI (no framework) |
| **Storage** | None |
| **Testing** | `bash -n`, `wc -l`, `diff`, and `validate.sh --strict` |

### Overview
Change one script in two places. The option parser gains a `--quiet` case that sets `QUIET_OUTPUT=true`, and the output dispatch gains a branch that prints the level line before the JSON and text branches. A captured baseline plus a line count prove the default path did not move.
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
- [ ] `bash -n recommend-level.sh` exits 0
- [ ] Default output diffs clean against the captured baseline
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single script branch (a monolithic CLI script with one output dispatch)

### Key Components
- **Option parser**: maps argv to the `LOC`, `FILES`, risk, `JSON_OUTPUT` and `QUIET_OUTPUT` globals.
- **Output dispatch**: chooses between the quiet line, `output_json()` and `output_text()`; it is the only reader of `QUIET_OUTPUT`.

### Data Flow
`argv` enters the `case` loop, which sets the input globals and the two output switches. The score functions read only the input globals, `determine_level` writes `RECOMMENDED_LEVEL` and `LEVEL_NAME`, and the dispatch reads `QUIET_OUTPUT` first. Scoring never sees the new flag, so the recommendation cannot change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A - this packet adds an output flag and fixes no defect, so it touches no security, path-handling, environment-precedence, schema, persistence, response or shared-policy surface. The one producer and its one consumer are the same script, and both are named in section 3.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The three plan-level steps are:

### Step 1: Add the flag to the parser

Acceptance: `--quiet` is accepted in any position and sets quiet output instead of falling through to the unknown-option branch.
Verify: `rg -n -- '--quiet\)' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` prints the new case.

### Step 2: Add the quiet branch to the dispatch

Acceptance: With `--quiet`, stdout is one line; without it, the report is unchanged.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --loc 500 --files 15 | wc -l` prints `1`.

### Step 3: Document the flag and prove the default path

Acceptance: `--help` lists `--quiet`, and the default output diffs clean against the baseline.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --help | rg -c -- '--quiet'` prints `1`, and the baseline `diff` exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The flag parser and the quiet branch, by direct invocation | `bash -n`, `wc -l` |
| Integration | Default output against the captured baseline | `diff` against `scratch/baseline-loc500-files15.txt` |
| Manual | `--help` text and flag order | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| bash 3.2+ | Internal | Green | The script cannot run; the floor is already declared in the script header |
| ripgrep | Internal | Green | Verification commands cannot run; the change itself is unaffected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default output changes for any input, or `--quiet` prints more than one line.
- **Procedure**: Revert the one commit that touches `recommend-level.sh`. No data, migration or configuration is involved.
<!-- /ANCHOR:rollback -->

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
| Core Implementation | Low | 20 minutes |
| Verification | Low | 15 minutes |
| **Total** | | **~45 minutes (assumption)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- N/A - no deployable service, feature flag or monitoring surface; the change ships with the skill.

### Rollback Procedure
1. Revert the commit that touches `recommend-level.sh`.
2. Run `bash recommend-level.sh --loc 500 --files 15` and compare it to the captured baseline.
3. No stakeholder notification is needed, because the default path never changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - the script writes no data.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────┐     ┌────────────────┐     ┌───────────────┐
│ Option parser │────►│ Output dispatch│────►│ Baseline diff │
└───────────────┘     └────────────────┘     └───────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Option parser | None | `QUIET_OUTPUT` global | Output dispatch |
| Output dispatch | Option parser | One level line | Baseline diff |
| Baseline diff | Output dispatch | Pass or fail verdict | Close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Read the parser and dispatch** - 5 minutes - CRITICAL
2. **Add the flag and the quiet branch** - 20 minutes - CRITICAL
3. **Diff the default output against the baseline** - 10 minutes - CRITICAL

**Total Critical Path**: ~35 minutes

**Parallel Opportunities**:
- The header comment and `show_help()` edit can run alongside the branch edit.
- The baseline capture can run before the parser change and does not block it.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Parser accepts the flag | `rg -n -- '--quiet\)' recommend-level.sh` prints the case | Phase 1 |
| M2 | Quiet output is one line | `--quiet --loc 500 --files 15 \| wc -l` prints `1` | Phase 2 |
| M3 | Default path is unchanged | Baseline `diff` exits 0 and `validate.sh --strict` passes | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Read `spec.md` REQ-001 through REQ-006 before touching the script.
- Confirm the current default output is captured in `scratch/baseline-loc500-files15.txt`.
- Run `bash -n` on the script before and after the edit.

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Run T001 through T013 in order; T003 may run beside T001 and T002. |
| TASK-SCOPE | Touch only `recommend-level.sh`; the packet docs change only when a task names them. |
| TASK-VERIFY | Mark a task `[x]` only after its `Verify:` command printed the expected output. |

### Status Reporting Format
Report each task as `T### STATUS: done | blocked | skipped - <verify output>`. Report the packet state as `TASKS: <done>/<total>; BLOCKERS: <count>`.

### Blocked Task Protocol
Mark the task `[B]`, record the failing command and its output beside the task, and stop the phase. Do not work around a failed `Verify:` clause; return the packet to planning instead.

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Quiet output takes precedence over JSON output

**Status**: Accepted

**Context**: The script already has `--json` as a machine-readable mode. Adding a second output switch means a caller can pass both, and the script needs one answer rather than an ambiguous payload.

**Decision**: `--quiet` wins. When both flags are present, the script prints the single level line and no JSON.

**Consequences**:
- Positive: the flag's contract is unconditional - `--quiet` always means exactly one line, whatever else is passed.
- Negative: a caller that passes both loses its JSON payload; the help text states the precedence and REQ-004 pins it with a test.

**Alternatives Rejected**:
- Exit 1 on the combination: adds a failure mode the request did not ask for and turns a harmless duplicate into a broken invocation.
- Let `--json` win: breaks the flag's one-line promise and makes `--quiet` silently ineffective.

---
