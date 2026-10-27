---
title: "Tasks: Clear the five doctor:ci drift flags and decide Node 20 CI coverage"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ci drift flags tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Clear the five doctor:ci drift flags and decide Node 20 CI coverage

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

`R` is `node .skilled/commands/doctor/scripts/ci-report.cjs --json`. `W` is `.github/workflows/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the flags today. Verify: `R` exits 0 and lists `event-in-run` on agent-mirror-sync, changed-packet-validation and comment-hygiene and `concurrency-missing` on dependabot-auto-merge and strict-pass-freshness-report, 5 flags over 32 workflows.
- [x] T002 Baseline the consumer test. Verify: `vitest run --project cli tests/ci-rule-set-comparison.vitest.ts` prints `Tests 17 passed (17)`, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Move the event SHAs into step env (`W/agent-mirror-sync.yml`). Verify: `R` lists no flag for it.
- [x] T004 Move the event SHAs into step env (`W/comment-hygiene.yml`). Verify: `R` lists no flag for it.
- [x] T005 Move the event name, pull request SHAs, push before-SHA and head SHA into step env, keeping the first-push fallback (`W/changed-packet-validation.yml`). Verify: `R` lists no flag for it.
- [x] T006 Supply the step env to the gate script in the consumer test (`ci-rule-set-comparison.vitest.ts`). Verify: before the test change, 10 cases fail on `EVENT_NAME: unbound variable`; after it, `Tests 17 passed (17)`, exit 0.
- [x] T007 Add a queueing concurrency block (`W/dependabot-auto-merge.yml`). Verify: `R` lists no flag for it.
- [x] T008 Add the standard concurrency block (`W/strict-pass-freshness-report.yml`). Verify: `R` lists no flag for it.
- [x] T009 Recount and rewrite the concurrency claim (`job-shape-rules.md:80`). Verify: `grep -h -A2 '^concurrency:' W/*.yml | grep cancel-in-progress | sort | uniq -c` prints 30 and 2.
- [x] T010 Add Node 20 steps for the two suites (`W/opencode-plugin-tests.yml`, `W/sk-code-script-tests.yml`). Verify: Node 20.19.5 runs the advisor suite `pass 42 fail 0` and the parallel node check suite `pass 3 fail 0`, both exit 0.
- [x] T011 Write the changelog entries and step the carriers. Verify: `validate_document.py <entry> --json` reports 0 issues for both.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun the report. Verify: `R` sums to 0 flags over 32 workflows, 0 errors.
- [x] T013 Lint the workflows. Verify: `actionlint .github/workflows/*.yml` prints nothing, exit 0.
- [x] T014 Run the doctor ci tests. Verify: `pass 26 fail 0`, exit 0.
- [x] T015 Run the gate-inputs check. Verify: main's `check-gate-inputs.sh` on this tree prints `RESULT: PASSED`; the worktree's own copy fails only on the pre-existing `pre-push:263` parser miss.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The ci report shows 0 drift flags
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-007 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `which actionlint` prints `/opt/homebrew/bin/actionlint`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `actionlint` on all workflows prints nothing, exit 0.
- [x] CHK-011 [P0] `eslint cli/tests/ci-rule-set-comparison.vitest.ts` from the runtime prints nothing, exit 0.
- [x] CHK-012 [P1] No protected workflow and nothing under `.github/scripts/` is edited. Evidence: `git status --short .github`.
- [x] CHK-013 [P1] New comments state the durable reason and carry no packet or task id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] The report goes from 5 flags to 0. Evidence: T001, T012.
- [x] CHK-022 [P1] The consumer test fails on the env move alone and passes with its fix. Evidence: T006.
- [x] CHK-023 [P1] The push fallback for an all-zero before-SHA is kept verbatim.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding classes: `event-in-run` is `class-of-bug` (any event value in script text); `concurrency-missing` is `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producers: `grep -n 'github.event' W/*.yml` after the fix shows event values only in `env:`, `if:` and concurrency lines.
- [x] CHK-FIX-003 [P0] Consumers: `rg 'github\.event\.pull_request\.base\.sha'` outside specs hits one test, `ci-rule-set-comparison.vitest.ts`, now updated.
- [x] CHK-FIX-004 [P0] Invariant: each script reads the same SHA the runner would have expanded, for pull_request and for push.
- [x] CHK-FIX-005 [P1] Matrix: three env-moved workflows by two events, the push leg only in changed-packet-validation.
- [x] CHK-FIX-006 [P1] N/A: no process-wide state is read.
- [x] CHK-FIX-007 [P1] Evidence is against base `710888eb15` plus the uncommitted diff in worktree `242-ci-drift-flags`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets added.
- [x] CHK-031 [P0] Event values no longer reach script text, which is the injection shape the rule exists for.
- [x] CHK-032 [P1] Permissions blocks unchanged.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files.
- [x] CHK-041 [P1] Only the concurrency claim and the doc version changed in `job-shape-rules.md`.
- [x] CHK-042 [P2] Changelog entries written for sk-code-ci and system-spec-kit.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files lived in the session scratchpad only.
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
