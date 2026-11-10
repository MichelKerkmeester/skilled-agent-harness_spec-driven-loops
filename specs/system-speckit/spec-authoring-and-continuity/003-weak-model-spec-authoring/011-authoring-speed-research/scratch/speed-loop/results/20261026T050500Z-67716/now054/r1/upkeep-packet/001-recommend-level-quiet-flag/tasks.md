---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

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

Two shell variables are used throughout. Set them once, before the first task:

```bash
export S=.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
export P=specs/zz-bench-authoring/001-recommend-level-quiet-flag
```

`S` is the script under change. `P` is this packet folder, which owns the baselines and the scratch output.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the default text baseline for the simple shape (`$P/scratch/simple.baseline`). Verify: `bash $S --loc 50 --files 2 > $P/scratch/simple.baseline; wc -l < $P/scratch/simple.baseline` prints 16
- [ ] T002 Capture the default text baseline for the full-risk shape (`$P/scratch/full.baseline`). Verify: `bash $S --loc 500 --files 15 --auth --api --db --architectural > $P/scratch/full.baseline; wc -l < $P/scratch/full.baseline` prints 17
- [ ] T003 Capture the JSON baseline (`$P/scratch/json.baseline`). Verify: `bash $S --json --loc 100 --files 3 > $P/scratch/json.baseline; wc -l < $P/scratch/json.baseline` prints 36
- [ ] T004 Confirm the flag does not exist yet (`$S`). Verify: `rg -n -- '--quiet' $S` prints no lines and exits 1
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the `QUIET_OUTPUT=false` global beside `JSON_OUTPUT` (`$S`). Verify: `rg -c 'QUIET_OUTPUT=false' $S` prints 1
- [ ] T006 Add the `--quiet` arm to the argument parser, modelled on the `--json` arm (`$S`). Verify: `bash $S --quiet --loc 50 --files 2 > /dev/null; echo $?` prints 0
- [ ] T007 Add the quiet branch to the output dispatch, tested before `JSON_OUTPUT` (`$S`). Verify: `bash $S --quiet --loc 50 --files 2 | wc -l` prints 1
- [ ] T008 Make the quiet branch print the same recommended-level line the text report writes, without reformatting it (`$S`). Verify: `bash $S --quiet --loc 500 --files 15 --auth --api --db --architectural` prints `Recommended Level: 3 (Full)`
- [ ] T009 [P] List `--quiet` in the `show_help()` OPTIONS block (`$S`). Verify: `bash $S --help | grep -c -- '--quiet'` prints 1
- [ ] T010 [P] List `--quiet` in the file-header OPTIONS block (`$S`). Verify: `sed -n '1,35p' $S | grep -c -- '--quiet'` prints 1
- [ ] T020 Keep stderr unwired from the quiet branch, so any warning the script writes still reaches stderr and `--quiet` trims stdout only (REQ-009) (`$S`). Verify: `rg -n -e '2>/dev/null' -e '2>&1' $S` prints no lines and exits 1
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Diff the simple default output against its baseline (`$S`). Verify: `diff <(bash $S --loc 50 --files 2) $P/scratch/simple.baseline` prints nothing and exits 0
- [ ] T012 Diff the full-risk default output against its baseline (`$S`). Verify: `diff <(bash $S --loc 500 --files 15 --auth --api --db --architectural) $P/scratch/full.baseline` prints nothing
- [ ] T013 Diff the JSON output against its baseline (`$S`). Verify: `diff <(bash $S --json --loc 100 --files 3) $P/scratch/json.baseline` prints nothing
- [ ] T014 Assert the quiet line equals the level line of the matching full report (`$S`). Verify: `diff <(bash $S --quiet --loc 500 --files 15 --auth --api --db --architectural) <(bash $S --loc 500 --files 15 --auth --api --db --architectural | sed -n '2p')` prints nothing
- [ ] T015 Assert that `--quiet` wins over `--json` (`$S`). Verify: `bash $S --quiet --json --loc 100 --files 3` prints `Recommended Level: 0 (Quick)`
- [ ] T016 Assert the missing-input error is unchanged under `--quiet` (`$S`). Verify: `bash $S --quiet > /dev/null 2>&1; echo $?` prints 1
- [ ] T017 Assert that `--quiet` is position-independent (`$S`). Verify: `diff <(bash $S --quiet --loc 50 --files 2) <(bash $S --loc 50 --files 2 --quiet)` prints nothing
- [ ] T018 Run the syntax and style gates (`$S`). Verify: `bash -n $S && shellcheck -S warning $S` exits 0 and prints nothing
- [ ] T019 Re-run the packet validator (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The three baseline diffs are silent and the quiet output is one line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: ADR-001 and ADR-002 are inline in `plan.md` under `L3: ARCHITECTURE DECISION RECORD`
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

A blocked task is marked `[B]` and stops its phase; the rule it follows is the Blocked Task Protocol in `plan.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Check: `rg -c '^\| REQ-0[0-9]{2} \|' $P/spec.md` prints 8
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Check: `rg -n 'QUIET_OUTPUT' $P/plan.md` prints at least one line
- [ ] CHK-003 [P1] Dependencies identified and available. Check: `command -v bash shellcheck` prints two paths
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The script parses. Check: `bash -n $S` exits 0
- [ ] CHK-011 [P0] The style gate is clean. Check: `shellcheck -S warning $S` prints nothing
- [ ] CHK-012 [P1] The quiet branch reuses the existing line format instead of duplicating the string
- [ ] CHK-013 [P1] The new `case` arm matches the shape of the `--json` arm
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria are met. Check: every AC row in `acceptance-criteria.md` reads `Met`
- [ ] CHK-021 [P0] All three baselines diff clean. Check: T011, T012 and T013 print nothing
- [ ] CHK-022 [P1] The error path under `--quiet` writes stderr only and exits 1. Check: `bash $S --quiet --loc abc --files 2 > /dev/null; echo $?` prints 1
- [ ] CHK-023 [P1] Both flag orders print the level line. Check: T015 and T017 print nothing unexpected
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Parser-adjacent cases are covered adversarially: joined input (`--quiet=1`) and flag-as-value (`--loc --quiet`) both fail with exit 1, and the no-op case (`--quiet` twice) still prints one line.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Check: `rg -n 'PASSWORD|TOKEN|SECRET' $S` prints nothing
- [ ] CHK-031 [P0] Input validation still runs before the output branch. Check: `bash $S --quiet --loc abc --files 2 > /dev/null; echo $?` prints 1
- [ ] CHK-032 [P1] N/A: the script has no auth or authz surface; it reads no identity, writes no file and opens no socket
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks name the same flag and the same precedence rule
- [ ] CHK-041 [P1] The new arm and branch carry a comment only where the reason is not obvious from the code
- [ ] CHK-042 [P2] `README.md` needs no update: it names the script, never its options
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baselines and any scratch output live under `$P/scratch/`
- [ ] CHK-051 [P1] The baselines are deleted before the packet closes, because `scratch/` is not git-ignored
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 17 | 0/17 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 is followed: T008 reuses the existing line rather than formatting a new one
- [ ] CHK-101 [P1] Both ADRs carry a status, and both read `Accepted`
- [ ] CHK-102 [P1] Both ADRs name the rejected alternatives with the reason each was rejected
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01 holds: a quiet run does no more I/O than a full run of the same arguments
- [ ] CHK-111 [P2] No throughput target applies; the script runs once per invocation and holds no loop over input
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] `show_help()` and the file-header OPTIONS block describe `--quiet` in the same words
- [ ] CHK-141 [P2] No document outside this packet enumerates the script's options, so none needs the flag
<!-- /ANCHOR:docs-verify -->

---
