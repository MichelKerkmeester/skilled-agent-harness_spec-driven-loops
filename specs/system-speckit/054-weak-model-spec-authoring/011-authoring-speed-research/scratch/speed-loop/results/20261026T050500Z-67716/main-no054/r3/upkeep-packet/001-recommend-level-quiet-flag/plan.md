---
title: "Implementation Plan: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet flag through a boolean parser entry and a branch in output_text. Default output stays byte-identical, and --quiet with --json is rejected."
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
| **Language/Stack** | Bash 3.2+ with `set -euo pipefail` |
| **Framework** | None, one script with function-per-concern |
| **Storage** | None |
| **Testing** | Bash regression script plus the existing Node phase tests |

### Overview

The change adds one boolean global, one parser case and one branch in `output_text()`. Scoring, JSON output and validation stay untouched, so the only new behavior is which text reaches stdout.
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

Single-entry CLI script with function-per-concern.

### Key Components
- **Argument parser**: maps flags to globals and rejects unknown options.
- **`output_text()`**: builds the human report and owns the quiet branch.
- **`output_json()`**: builds the machine object and stays unchanged.
- **`show_help()`**: prints usage and gains the new flag.
- **Validation block**: checks numeric inputs and required values before output.

### Data Flow

Arguments set globals. Scoring functions read them. `determine_level()` sets `RECOMMENDED_LEVEL` and `LEVEL_NAME`. Main then chooses `output_json()` or `output_text()`. Quiet mode changes only the last step.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a feature addition, not a bug fix. The table still applies because the change alters a CLI output surface that other files consume.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recommend-level.sh` `output_text()` | Owns the human report | Update: print the level line alone when quiet | New test asserts one line |
| `recommend-level.sh` `output_json()` | Owns machine output | Unchanged: stays exclusive with quiet | Test asserts `--quiet --json` exits 1 |
| `recommend-level.sh` argument parser | Maps flags to globals | Update: add the `--quiet` case | `--help` and the new test |
| `speckit-plan.yaml` | Calls the script with `--json` | Not a consumer of quiet, unchanged | `rg -n 'recommend-level.sh' .skilled/commands/speckit/assets` |
| `speckit-complete.yaml` | Calls the script with `--json` | Not a consumer of quiet, unchanged | Same grep |
| `execution-methods.md` | Documents the CLI | Update with the flag | Review during verification |
| `test-recommend-level-quiet.sh` | Does not exist | Create | Runs in verification |

Required inventories:
- Same-class producers: `rg -n 'output_text|output_json|QUIET' .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` shows one human producer and one machine producer. No other script prints a level line.
- Consumers of changed symbols: `rg -n 'recommend-level\.sh' . --glob '!node_modules'` finds the command assets, the skill docs and this packet. The two YAML assets invoke the script, both with `--json`.
- Matrix axes: flag state (absent, `--quiet`), output mode (text, `--json`), help (absent, `--help`), phase output (default, `--no-recommend-phases`). Required rows: absent+text, quiet+text, absent+json, quiet+json (error), quiet+help (help), quiet+no-recommend-phases (one line).
- Algorithm invariant: this is not a path, redaction, parser or security fix. The output invariant is that no `--quiet` means byte-identical stdout.
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
| Unit | Flag parsing and the quiet branch | `test-recommend-level-quiet.sh` |
| Regression | Default output against the captured baseline | `diff` inside the same script |
| Integration | Existing phase validation suite | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Bash 3.2+ | Internal | Green | The script cannot run |
| Existing `output_text()` | Internal | Green | The quiet branch has no home |
| `test-phase-system.sh` conventions | Internal | Green | The new test would follow a different shape |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The default output changes, or a caller that passes `--json` breaks.
- **Procedure**: Revert the commit that changes the script and its test. No data or config migration is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:ai-protocol -->
## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read the target script and its callers before editing.
- [ ] Confirm the working tree is clean for the target files.
- [ ] Capture the baseline default output to `scratch/baseline-default.txt`.
- [ ] Confirm the verification command and its expected exit code.

### Execution Rules

| Rule | Meaning |
|------|---------|
| TASK-SEQ | Run tasks in `tasks.md` order. Do not start verification before the implementation tasks complete. |
| TASK-SCOPE | Touch only the files listed in `spec.md` section 3. Stop and report any other file that needs a change. |
| TASK-EVIDENCE | Record the command and its output for every checked item. |
| TASK-DEFAULT | Keep the default output byte-identical. A diff is a failure. |

### Status Reporting Format

Report each task as `T### | done, blocked or skipped | evidence`. Evidence names the command run and the observed result. At the end, report the verification totals from `tasks.md` and the closure verdict from `acceptance-criteria.md`.

### Blocked Task Protocol

When a task cannot proceed, mark it `[B]`, record the blocker and the command that failed, and stop. Do not work around a blocked task by widening scope. Escalate with the blocker, the attempted fix and the next safe action.
<!-- /ANCHOR:ai-protocol -->

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
| Core Implementation | Low | 30 minutes |
| Verification | Low | 30 minutes |
| **Total** | | **About 1.25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Backup created: not applicable, the change stores no data.
- Feature flag: not applicable, `--quiet` is opt-in.
- Monitoring alerts: not applicable, the script runs locally.

### Rollback Procedure
1. Revert the commit that changes the script.
2. Run the regression test to confirm the default output returns.
3. Run `--help` to confirm the flag is gone.
4. Notify the packet owner if the flag was already announced.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: None. The change persists no data.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Parser `--quiet` | None | `QUIET` global | Output branch, conflict check |
| Quiet branch in `output_text()` | Parser | One-line output | Test |
| Conflict check | Parser | Usage error | Test |
| Help text | Parser | Documented flag | Command reference |
| Regression test | All | Evidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Parser `--quiet`** - 10 minutes - CRITICAL
2. **Quiet branch** - 10 minutes - CRITICAL
3. **Conflict check** - 5 minutes - CRITICAL
4. **Regression test** - 20 minutes - CRITICAL
5. **Verification run** - 10 minutes - CRITICAL

**Total Critical Path**: About 55 minutes

**Parallel Opportunities**:
- Help text and the test file can run after the parser lands.
- The command reference update can run beside verification.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Plan approved | Spec, plan and tasks reviewed | Phase 1 |
| M2 | Implementation done | Flag, branch, conflict check and help text in place | Phase 2 |
| M3 | Verification passed | New test, baseline diff and existing tests pass | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Reject `--quiet` with `--json`

**Status**: Accepted

**Context**: The script has two output modes. Quiet asks for one human line. JSON asks for a machine object. Letting either win hides the other request and makes the result depend on flag order.

**Decision**: Treat the pair as a usage error. Exit 1, write the reason to stderr and leave stdout empty.

**Consequences**:
- The result is predictable and testable.
- A caller cannot ask for both. That combination has no sensible output, so the loss is theoretical. Document it in `--help`.

**Alternatives Rejected**:
- Quiet wins: silently drops the JSON object and breaks a caller that parses it.
- JSON wins: ignores an explicit request and surprises the caller.
- Emit a JSON scalar: invents a third schema that nobody asked for.

---

