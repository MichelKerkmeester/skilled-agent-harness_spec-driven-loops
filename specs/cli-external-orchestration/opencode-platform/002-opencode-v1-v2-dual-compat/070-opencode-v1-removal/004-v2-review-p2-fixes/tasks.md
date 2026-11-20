---
title: "Tasks: Phase 4: v2-review-p2-fixes"
description: "Ordered tasks for the eight P2 advisories of the third OpenCode v1 removal review, each with the command that proves it."
trigger_phrases:
  - "v2 review p2 fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: v2-review-p2-fixes

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

`CLI` is `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests`. `PT` is `.opencode/plugins/tests`. `S` is this phase's `scratch/` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the gate before any edit and record it (`S/gate-baseline.txt`, `S/gate.sh`). Verify: `rg -c 'fail 0' S/gate-baseline.txt` prints 2, and the file holds the dispatch-audit, deep-loop and Vibe lines.
- [x] T002 Save `opencode serve --help` from the installed 2.3.2 (`S/serve-help.txt`). Verify: `rg -n -- '--hostname' S/serve-help.txt` prints one line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rename `dualPlugin` to `definePlugin` in every tracked caller and doc (`.opencode/plugins/lib/v2-bridge.js` and 32 other files). Verify: `git grep -c dualPlugin -- ':!specs' | wc -l` prints 0.
- [x] T004 Fail the inventory hook case when no plugin is classified as bridged (`PT/plugin-inventory.test.cjs`). Verify: with the classifier pointed at an unused name, the case fails, recorded in `S/unmapped-hook-mutation.txt`.
- [x] T005 Prove an unmapped hook key fails CI (`PT/plugin-inventory.test.cjs`). Verify: with `dispose` dropped from the mapped set, `node --test PT/plugin-inventory.test.cjs` fails with `session-cleanup.js unmapped hooks`, recorded in `S/unmapped-hook-mutation.txt`.
- [x] T006 Pin the battery's private server to loopback and assert it (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, `tests/opencode-version-battery.test.cjs`). Verify: the battery test prints `# fail 0`, and fails when the flag is removed.
- [x] T007 Run the real v2 battery leg on 2.3.2 (`S/battery-v2-live.txt`). Verify: the file ends `exit=0` with four PASS legs.
- [x] T008 Prove the classify test is hermetic, then add it to the battery workflow's unit step (`.github/workflows/opencode-v2-battery.yml`, `S/classify-hermetic.txt`). Verify: the stripped run prints `opencode: not-found`, `fail 0` and `exit=0`, and `rg -c opencode-setup-classify .github/workflows/opencode-v2-battery.yml` prints 1.
- [x] T009 Run the parser parity case over the corpus plus the hand-written outputs (`.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts`). Verify: `npx vitest run tests/unit/opencode-dual-dispatch.vitest.ts` in the runtime folder reports 24 passed.
- [x] T010 Retire `opencode2` from the models-form scan (`CLI/opencode-models-form.test.cjs`). Verify: `rg -c opencode2 CLI/opencode-models-form.test.cjs` prints nothing, and the suite prints `# fail 0`.
- [x] T011 Respell the numbered-launcher cases (`PT/system-dist-freshness-guard.test.cjs`, `.skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs`, `.skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.ts`, its test). Verify: the freshness-guard, dispatch-audit and Pi lint suites report 0 failures.
- [x] T012 Record the `opencode2` decision and the no-alias rename (`decision-record.md`). Verify: `rg -n 'Q005' decision-record.md` prints at least one line.
- [x] T013 Rewrite the phase 001 event-capture header (`../001-v1-runtime-code-and-tests/scratch/event-capture.txt`). Verify: `head -3` of the file names Part 1 static and Part 2 live.
- [x] T014 Narrow the phase 001 CHK-041 proof command (`../001-v1-runtime-code-and-tests/tasks.md`). Verify: the command now on that line prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Rerun the gate from the final tree (`S/gate-after.txt`). Verify: every leg shows the same or fewer failures than `S/gate-baseline.txt`.
- [x] T016 Run the runtime-mirror checks in check-only form (`S/runtime-mirrors.txt`). Verify: 0 drift rows.
- [x] T017 Validate the parent packet recursively (`../`). Verify: `validate.sh ../ --recursive --strict` prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the real v2 battery leg in `S/battery-v2-live.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Findings**: `../review/review-report.md` §3
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

A blocked task is marked `[B]` with its reason on the line and blocks closure.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-0' spec.md` prints 9.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 4' plan.md` prints one line.
- [x] CHK-003 [P1] Dependencies identified and available. Verify: `S/serve-help.txt` shows `opencode v2.3.2`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed JavaScript file parses. Verify: `node --check` on each changed `.js`, `.cjs` and `.mjs` file prints nothing.
- [x] CHK-011 [P0] No plugin logs to the console or throws at setup. Verify: `git diff -- .opencode/plugins/*.js | rg -c 'console\.|throw '` prints nothing.
- [x] CHK-012 [P1] The battery still reports a server that never starts. Verify: the battery suite's "no listening line" cases pass.
- [x] CHK-013 [P1] Code follows project patterns. Verify: the edits keep each file's section banners and JSDoc.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Verify: every `acceptance-criteria.md` row reads Met.
- [x] CHK-021 [P0] Manual testing complete. Verify: `S/battery-v2-live.txt` ends `exit=0`.
- [x] CHK-022 [P1] Edge cases tested. Verify: the two mutations in `S/unmapped-hook-mutation.txt` each fail a case.
- [x] CHK-023 [P1] Error scenarios validated. Verify: removing `--hostname` fails the battery test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: the opencode2 and dualPlugin findings are `cross-consumer`, the bind and unmapped-key findings `instance-only`, the CI and parity findings `test-isolation`, the two evidence findings `matrix/evidence`. Verify: `decision-record.md` and `implementation-summary.md` name each.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `git grep -n -e opencode2 -e 'opencode\\d' -- ':!specs'` hits are each changed or named in ADR-001.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the renamed builder. Verify: `git grep -c dualPlugin -- ':!specs' | wc -l` prints 0.
- [x] CHK-FIX-004 [P0] The parser fix carries adversarial inputs. Verify: the parity case runs the corpus's joined, prerelease and garbage outputs.
- [x] CHK-FIX-005 [P1] Matrix axes listed: launcher name by surface, in `plan.md`. Verify: `rg -n 'Matrix axes' plan.md` prints one line.
- [x] CHK-FIX-006 [P1] Hostile environment variant executed. Verify: `S/classify-hermetic.txt` shows a run with no `opencode` and no `npm` on PATH.
- [x] CHK-FIX-007 [P1] Evidence is pinned: the CHK-041 command reads commit `06d02096e90`, and the gate ran on base `0265f3ee538`. Verify: both shas appear in the evidence.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Verify: the diff adds no token or password literal beyond the existing `FAKE-SECRET-123` fixture.
- [x] CHK-031 [P0] The private battery server listens on loopback. Verify: the battery test asserts `--hostname 127.0.0.1`.
- [x] CHK-032 [P1] The dispatch guards still match a numbered launcher. Verify: the `opencode9 run` cases pass.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the file list. Verify: each file in the spec's Files to Change table has a task above.
- [x] CHK-041 [P1] Changed code carries no phase, packet, finding or REQ id in a comment. Verify: `git diff -U0 -- ':!specs' | rg '^\+' | rg -c -e 'DR[0-9]-P' -e 'REQ-0' -e 'CHK-0' -e '070-'` prints nothing.
- [x] CHK-042 [P2] Plugin README and ARCHITECTURE name `definePlugin`. Verify: `rg -c dualPlugin .opencode/plugins/ARCHITECTURE.md .opencode/plugins/README.md` prints nothing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence files live in `scratch/` only. Verify: `ls S` lists the evidence files.
- [x] CHK-051 [P1] Mutation backups and gate run output stay outside the repository. Verify: `git status --short` lists no backup file.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-20
<!-- /ANCHOR:summary -->
