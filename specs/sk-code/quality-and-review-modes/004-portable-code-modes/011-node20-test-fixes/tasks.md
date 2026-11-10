---
title: "Tasks: Node 20 test fixes for the advisor plugin suite and the parallel node check helper"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "node20 test fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Node 20 test fixes for the advisor plugin suite and the parallel node check helper

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

`N20`, `N22` and `N26` are `~/.nvm/versions/node/v20.19.5/bin/node`, `v22.23.1` and `v26.8.2`. `A` is `.opencode/plugins/tests/system-skill-advisor.test.cjs`. `P` is `.skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the advisor suite failure (`A`). Verify: `$N20 --test A` printed `TypeError: registerHooks is not a function`, `pass 0`, `fail 1`, exit 1 on three runs; `$N22` and `$N26` printed `pass 42`, exit 0.
- [x] T002 Reproduce the long-line failure (`P`). Verify: `$N20 --test P` printed `the direct check reported no message`, `pass 2`, `fail 1`, exit 1 on three runs; `$N22` and `$N26` printed `pass 3`, exit 0.
- [x] T003 Find the long-line cause. Verify: a `spawnSync` pipe read of a 100,000-character file's report returned 8192 characters under a Node 20 parent and 65536 under Node 22 and 26 parents, for both a Node 20 and a Node 26 child, with no `SyntaxError` line; a file redirect of the 20,000-character file's report returned 21372 bytes on Node 20 and 22.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Feature-detect `registerHooks` and fall back to `module.register` with the stubs passed as data (`A`). Verify: `$N20 --test A` prints `pass 42`, `fail 0`, exit 0.
- [x] T005 Read the direct reference report from a file and raise the long line to 100,000 characters (`P`). Verify: with the unchanged helper copied from `HEAD`, `--test` on the copy fails case 2 with `Cannot read properties of null (reading '1')`, `pass 2 fail 1`, exit 1, on `$N20`, `$N22` and `$N26`.
- [x] T006 Give each `node --check` child a stderr file and read it back inside the budget (`parallel-node-check.cjs`). Verify: `$N20 --test P` prints `pass 3`, `fail 0`, exit 0.
- [x] T011 Poll on macOS in the real-chokidar watcher case (`daemon-watcher-new-root-ingestion.vitest.ts`). Verify: `npx vitest run tests/daemon-watcher-new-root-ingestion.vitest.ts` from the advisor runtime prints `Tests 5 passed (5)`, exit 0, on five consecutive runs.
- [x] T007 Write the two changelog entries and step the carriers. Verify: `validate_document.py <entry> --json` prints `"total_issues": 0` for both.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run both files three times on each Node version. Verify: all 18 runs print `fail 0` and exit 0.
- [x] T009 Run the full sk-code-quality script suite and the full plugin suite. Verify: default Node prints `pass 123 fail 0` and `pass 553 fail 0`; Node 20 prints `pass 123 fail 0` for the sk-code-quality suite.
- [x] T010 Run the quality gate under Node 20 on a long one-line file. Verify: the finding reads `node --check: Unexpected token 'function'`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both test files pass three runs on Node 20.19.5, 22.23.1 and 26.8.2
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-005 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: all three Node binaries print their version.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `quality-gate.cjs --files` on the three code files prints `gate=NO_BLOCKER_FOUND exit=0`, `findings: 0`.
- [x] CHK-011 [P0] No new warnings in the test output on any Node version.
- [x] CHK-012 [P1] Error handling: a failed stderr read resolves with what was captured and still deletes the file.
- [x] CHK-013 [P1] Code follows the existing file headers and comment style.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Each fix fails before and passes after on Node 20. Evidence: T001, T002, T005, T004, T006.
- [x] CHK-022 [P1] Edge cases: the killed-child and SIGTERM cases in `P` still pass on every Node version.
- [x] CHK-023 [P1] No `parallel-node-check-*` folder is left in the temp directory after the runs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding classes: the `registerHooks` failure is `test-isolation` (harness only); the stderr loss is `class-of-bug` (any Node 20 child report over the pipe's first write).
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n registerHooks .opencode/plugins` hits only the advisor test; the helper is the one place the runner pipes a `node --check` child.
- [x] CHK-FIX-003 [P0] Consumers: `quality-gate.cjs` `runNodeCheck` reads `record.stderr`; the record shape is unchanged.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction logic changed.
- [x] CHK-FIX-005 [P1] Matrix: two files by three Node versions by three runs, 18 rows, all green.
- [x] CHK-FIX-006 [P1] N/A: no new process-wide state is read.
- [x] CHK-FIX-007 [P1] Evidence is against base `388103aceb` plus the uncommitted diff in worktree `240-node20-test-fixes`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the quality gate's secrets check ran clean.
- [x] CHK-031 [P0] Input validation unchanged; the helper still rejects a malformed file list.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same three code files.
- [x] CHK-041 [P1] Code comments state why a file replaces the pipe and why `register` is the fallback.
- [x] CHK-042 [P2] Changelog entries written for both owning skills.
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
