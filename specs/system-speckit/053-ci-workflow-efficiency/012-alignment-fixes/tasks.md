---
title: "Tasks: Phase 12: alignment-fixes"
description: "One task per alignment finding, each with the command that proves it and the result it printed."
trigger_phrases:
  - "alignment fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: alignment-fixes

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

`RT` is `.skilled/skills/system-spec-kit/runtime`. `AR` is `.skilled/skills/system-skill-advisor/runtime`. `G` is `.skilled/skills/sk-doc/shared/scripts/check_no_new_snake_case.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the advisor default suite on a fresh checkout (`AR`). Verify: `npx vitest run` printed `Test Files  5 failed | 145 passed (150)`, all five failures tracing to the absent `database/skill-graph.sqlite`.
- [x] T002 Measure the runtime lint debt (`RT`). Verify: `npx eslint . -f json` counted 52 files, 239 errors, 5 warnings (cli 167, hooks 73, tests 4).
- [x] T003 [P] Reproduce the host-dependent hook failure (`.skilled/hooks/shared/hook-stdin-deadline.test.mjs`). Verify: with opencode v2.1.4 on PATH, `node --test` printed `pass 19`, `fail 2`, exit 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 B-01: correct the twin-filter citation to `:9-12` and `:21-24` (`.skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md`). Verify: `sed -n '12p;24p' .github/workflows/repo-rules-corpus.yml` printed `- '.opencode/repo-rules/**'` twice.
- [x] T005 B-02: correct the fail-fast citation to `:61` and `:92` (`.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md`). Verify: `sed -n 61p` and `sed -n 92p` on the two workflows each printed `fail-fast: false`.
- [x] T006 C-crit-03: add the skill-graph scan and the default suite after the stress suite, timeout 25 (`.github/workflows/skill-advisor-stress.yml`). Verify: after deleting the database and running `skill_graph_scan --trusted`, `npm test` in `AR` printed `Test Files  150 passed (150)`, `Tests  1253 passed | 8 skipped`, exit 0, wall 2:40.51.
- [x] T007 C-crit-03: record the runner-minute cost (`spec.md` NFR-P01). Verify: `gh run list --workflow skill-advisor-stress.yml --created '>=2026-09-27'` returned 73 runs (59 push, 14 pull request), stress-only p50 2.03 and p100 6.40 minutes over 63 successful runs.
- [x] T008 C-crit-04: add `RUNTIME_GENERATED_NAMES` with `synthesis_complete.json` (`G`) and its test (`.skilled/skills/sk-doc/scripts/tests/test_no_new_snake_case_guard.py`). Verify: the new test failed before the exemption with `1 != 0 ... lineage/review/synthesis_complete.json` and passed after, 9 of 9, exit 0.
- [x] T009 C-crit-04: add `main` to the push trigger, with no path filter (`.github/workflows/naming-standard-guard.yml`). Verify: `bash .github/scripts/check-gate-inputs.sh` printed `failures=0` and `RESULT: PASSED`.
- [x] T010 A-06: cache the stub versions through the async resolver's `deps.probe` seam (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`). Verify: with the stub made to sleep 4 s, the old case failed at 3013.5 ms and the new case passed in 5.9 ms.
- [x] T011 A-07: put a v1 stub first on PATH for the two preflight cases (`.skilled/hooks/shared/hook-stdin-deadline.test.mjs`). Verify: 5 runs each printed `pass 21`, `fail 0`, exit 0.
- [x] T012 A-05: extend the `^_` rule to `.js`, `.cjs` and `.mjs` (`RT/eslint.config.mjs`). Verify: the remeasure counted 137 errors, 133 of them in `cli/` (58 no-unused-vars, 67 no-explicit-any, 4 prefer-const, 2 no-empty-object-type, 2 no-require-imports).
- [x] T013 A-05: fix the 137 remaining errors at their cause: the four outside `cli/` (`RT/hooks/claude/session-prime.ts`, `RT/hooks/lib/spec-gate/spec-gate-core.mjs`, `RT/tests/hooks/spec-gate-devin.test.mjs`) and the 133 in 36 `cli/` files. Unused bindings deleted, `any` replaced by named interfaces or `unknown`, the two reducer suites given `createRequire`. Verify: `npm --prefix RT run check` printed no problems (0 errors, 0 warnings), exit 0, after the three unused directives that predated this phase were deleted (`RT/cli/tests/graph-aware-stop.vitest.ts`, `RT/cli/tests/test-extractors-loaders.js`, `RT/hooks/devin/post-compaction.cjs`). A scratch tsconfig over the 15 edited cli test files reported 22 type errors against 23 before, none new.
- [x] T019 A-05: rerun the cli package's own gates. Verify: `npm run typecheck` exit 0, `npm run check` exit 0, `npm test` vitest 191 of 194 files and 2239 of 2259 tests passed with 3 files and 20 tests skipped, and every legacy and validation suite passed, exit 0, the same as the baseline run before the change.
- [x] T014 Write the changelog entries and step the carriers (sk-code-ci v1.1.3.0, sk-doc v2.3.22.0, system-spec-kit v2.12.10.0). Verify: `validate_document.py --json` reported 0 issues on each, and `parent-skill-check.cjs` passed on sk-doc and sk-code.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Rerun the A-06 file 5 times (`dispatch-rule-checks.test.mjs`). Verify: each run printed `pass 42`, `fail 0`, the case at 3.5 to 8.0 ms against 49.7 to 266.4 ms before.
- [x] T016 Replay the naming guard over the audited range (`G`). Verify: `--changed-since 583316d0833e` dropped from 18 names to 8, none of them a synthesis marker. `--changed-since HEAD` and `--changed-since origin/main` printed `PASS`.
- [x] T017 Re-mint the sk-doc compiled-routing manifest after the version step. Verify: `node .skilled/bin/compiled-route-guard.cjs` printed `All hubs fresh or excused`.
- [x] T018 Run the spec-gate suites after the signature change (`RT/tests/hooks/spec-gate-*.test.mjs`). Verify: `tests 155`, `pass 152`, `fail 0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `npm --prefix RT run check` exits 0.
- [x] CHK-011 [P0] No new warnings: `npm --prefix RT run check` prints 0 errors, 0 warnings; the three unused-directive warnings that predated this phase were removed.
- [x] CHK-012 [P1] Error handling implemented: the CI scan step runs under `set -euo pipefail`.
- [x] CHK-013 [P1] Code follows project patterns: the exemption joins the existing frozensets, and the test seams are ones the code already exposes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: guard replay, gate-input check, YAML parse of both workflows.
- [x] CHK-022 [P1] Edge cases tested: a non-exempt sibling still fails the guard.
- [x] CHK-023 [P1] Error scenarios validated: the slow-probe variant reproduces the A-06 failure before the fix.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Classes: B-01 and B-02 `instance-only`, C-crit-03 `matrix/evidence`, C-crit-04 `class-of-bug`, A-05 `class-of-bug`, A-06 and A-07 `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producers: the three deep-loop scripts that write the marker are listed in `plan.md`.
- [x] CHK-FIX-003 [P0] Consumers: `rg -n 'specGateConcernDisabled|advanceGate3LifecycleEpoch'` inventoried in `plan.md`.
- [x] CHK-FIX-004 [P0] Adversarial cases: the exemption is exact-name and file-only, with a sibling-name rejection test.
- [x] CHK-FIX-005 [P1] Matrix: the advisor suite ran at 150 of 150 files after a fresh scan.
- [x] CHK-FIX-006 [P1] Hostile env: the A-07 cases ran on a host with opencode v2.1.4, the state that failed them.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the worktree diff on top of `ee64a63b2c`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in either workflow or test.
- [x] CHK-031 [P0] No new free-text event field reaches a `run:` block.
- [x] CHK-032 [P1] Permissions stay `contents: read` in both edited workflows.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files and numbers.
- [x] CHK-041 [P1] Each new comment states a durable reason and carries no finding or packet id.
- [x] CHK-042 [P2] The workflow README rows for both edited workflows are updated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files lived in the session scratchpad, outside the repository.
- [x] CHK-051 [P1] The two temporary test copies used for the slow-probe check were deleted.
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
