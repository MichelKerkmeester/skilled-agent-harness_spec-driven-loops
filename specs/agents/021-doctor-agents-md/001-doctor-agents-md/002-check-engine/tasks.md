---
title: "Tasks: check engine"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agents md check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: check engine

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables.** `C` is `.skilled/commands/doctor/scripts/agents-md-check.cjs`. `T` is `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs`. `F` is `.skilled/commands/doctor/scripts/tests/fixtures/agents-md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the six baseline commands into `scratch/baseline.txt` (`scratch/`). Verify: `rg -c 'route-validate' scratch/baseline.txt` prints at least `1`.
- [ ] T002 Confirm child 001's manifest is fresh (`agents-md-manifest.cjs`). Verify: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0.
- [ ] T003 Build the nine fixture trees from the manifest (`F`). Verify: `ls F | wc -l` prints `9` and each holds one `AGENTS.md` except `absent`.
- [ ] T004 Write the failing suite first (`T`). Verify: `node --test T` exits non-zero on `Cannot find module`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement A1 through A4, the install state, section presence, order and currency (`C`). Verify: `node --test T` reports the `pure`, `adopted`, `stale` and `foreign` state cases passing.
- [ ] T006 Implement A5 pins with first-occurrence placement (`C`). Verify: `node --test T` reports the `shadowed-pin` case failing A5 and passing.
- [ ] T007 Implement A6 and A7, the delivery budget and the block shape (`C`). Verify: `node --test T` reports the `over-budget` case failing both rows.
- [ ] T008 Implement A8 and A9, unmarked content and unmarked edits (`C`). Verify: `node --test T` reports the `forked` case listing one section with its byte range.
- [ ] T009 Implement A10 and A11, runtime copies and the router (`C`). Verify: `node --test T` reports the divergent `CLAUDE.md` case with its lines listed.
- [ ] T010 Implement A12 and the exit-code mapping (`C`). Verify: `node --test T` reports the 0, 1 and 2 cases passing.
- [ ] T011 Add the JSON renderer and `--root` (`C`). Verify: `node C --root F/forked --json` exits 1 and its `state` reads `forked`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the engine on this repository (`C`). Verify: `node C` exits 0 and prints `STATUS=OK` with `A1 install state: pure`.
- [ ] T013 Prove the read-only promise (`C`). Verify: `git status --porcelain | shasum` prints the same digest before and after a run over every fixture.
- [ ] T014 Confirm the canary gap (`C`). Verify: with the canary path moved aside in a temporary copy, A6 reads `UNKNOWN` and the exit code is 1.
- [ ] T015 Run the child gate (`specs/agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The measured runtime of a run over this repository is recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `/doctor:sk-skill` is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit.
- [ ] CHK-002 [P0] Child 001's manifest is fresh. Verify: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0.
- [ ] CHK-003 [P1] The baseline is recorded. Verify: `rg -c 'run-all' scratch/baseline.txt` prints at least `1`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The engine parses. Verify: `node --check .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0.
- [ ] CHK-011 [P0] Every row appears in the report. Verify: `node .skilled/commands/doctor/scripts/agents-md-check.cjs | grep -c '^A'` prints `12`.
- [ ] CHK-012 [P1] No code comment carries a packet, phase or task id. Verify: `rg -n 'AC-[0-9]{3}|REQ-[0-9]{3}|specs/' .skilled/commands/doctor/scripts/agents-md-check.cjs` prints nothing.
- [ ] CHK-013 [P1] New names are lowercase kebab. Verify: `git status --porcelain` lists no path with an uppercase letter.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`.
- [ ] CHK-021 [P0] The suite passes. Verify: `node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` reports `fail 0`.
- [ ] CHK-022 [P1] Every fixture's A1 state is asserted. Verify: `rg -c "state" .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` prints at least `9`.
- [ ] CHK-023 [P1] The error paths are asserted. Verify: the suite names the exit-2 case and it passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret. Verify: `rg -ni 'api[_-]?key|token|secret|password' .skilled/commands/doctor/scripts/agents-md-check.cjs` prints nothing.
- [ ] CHK-031 [P0] The engine writes nothing. Verify: the write-spy case passes and `git status --porcelain | shasum` is unchanged by a run.
- [ ] CHK-032 [P1] No consumer path reaches a tracked file. Verify: `rg -n 'Users/|/home/' .skilled/commands/doctor/scripts/tests/fixtures/agents-md` prints nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the twelve rows. Verify: `rg -c 'A12' spec.md plan.md tasks.md` reports a count in each.
- [ ] CHK-041 [P1] The row table in `spec.md` still matches the engine. Verify: `rg -c '^\| A' spec.md` prints `12`.
- [ ] CHK-042 [P2] The engine's runtime is recorded. Verify: `rg -n 'seconds' implementation-summary.md` prints the measured figure.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Fixtures live under the tests tree. Verify: `find .skilled/commands/doctor/scripts/tests/fixtures/agents-md -maxdepth 1 -type d | wc -l` prints `10`.
- [ ] CHK-051 [P1] No temporary copy survives. Verify: `git status --porcelain` lists no path under a temporary directory.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
