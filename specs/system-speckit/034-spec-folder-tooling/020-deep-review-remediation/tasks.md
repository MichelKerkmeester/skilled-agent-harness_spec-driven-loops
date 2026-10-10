---
title: "Tasks: Phase 20: deep-review-remediation"
description: "Task list for the deep review remediation, with the red and green evidence each code lane produced and the tasks that were not run."
trigger_phrases:
  - "deep review remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 20: deep-review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending, or not run in this phase. The note on the line says which |
| `[x]` | Completed, with the evidence named on the line |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [lane] Description (file path)`. Evidence paths are relative to this packet's `scratch/evidence/` folder unless a full path is given.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `review/review-report.md` sections 1 to 6 and 8 to 9, and the phase 019 layout the packet follows (`review/review-report.md`)
- [x] T002 Record the starting strict validates before any edit: phase 019 and the 034 parent both print RESULT: PASSED with rc=0 (`scratch/evidence/validate-019-baseline.txt`, `scratch/evidence/validate-034-baseline.txt`)
- [x] T003 Scaffold this folder with `create.sh --phase --parent` in append mode, Level 2, and record the output (`scratch/evidence/create-020.txt`)
- [x] T004 [P] Check phase 010 against its own record and against main CI. Its `tasks.md` now marks T009 and T011 closed, and main shows a live Trigger Index Rebuild success on `079e9c34d2` (`scratch/evidence/phase-010-status.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each code lane records a red run on the unfixed code and a green run after the fix. Where a lane could not capture a red run, its task says so.

### Lane A: archive.sh (REQ-001)
- [x] T005 [A] Red: a `z_archive` symlink to a directory outside `specs` makes archive copy into it. Cases added to `runtime/cli/tests/archive-track.vitest.ts`. 9 of 32 fail on the red run (`scratch/evidence/lane-a-red.txt`)
- [x] T006 [A] Green: `archive_root` is confined below `specs` before any copy, rename or source removal, and `.`/`..` segments are refused in `runtime/cli/spec/archive.sh` (`scratch/evidence/lane-a-green.txt`, `scratch/evidence/lane-a-dotseg-red.txt`, `scratch/evidence/lane-a-dotseg-green.txt`)

### Lane B: healer and shared target helper (REQ-002, REQ-003)
- [x] T007 [B] Red: default `--apply` through a symlinked `spec.md` and `tasks.md` changes the outside target. Cases in `runtime/cli/tests/heal-symlink-containment.vitest.ts`. 4 of 4 fail on the red run (`scratch/evidence/lane-b-red.txt`)
- [x] T008 [B] Green: symlinked documents are refused before any read or write in `runtime/cli/spec/heal-spec-docs.cjs`, and the fence, code-span, continuity and delimiter fixes pass their cases (`scratch/evidence/lane-b-green.txt`, `scratch/evidence/lane-b-final-vitest.txt`)
- [x] T009 [B] [P] Parity: the three entrypoints resolve one target set through `resolveTargets`. Before and after dry-run selections match (`scratch/evidence/lane-b-parity.txt`), and the parity test fails on a mutated selection (`scratch/evidence/lane-b-parity-red.txt`)
- [x] T010 [B] Same-class producer grep for writes reached from a user-derived path in the healer and `upgrade-legacy.mjs`. Evidence: `scratch/evidence/closure-same-class-write-inventory.txt`. Its section 1 is the saved grep, and its H1 to H6 and U1 to U7 entries classify each write. No site is marked UNGUARDED. Two sites, E1 and U3, have no check at the write and rely on a caller or discovery guard. The operator accepts these PARTIAL sites, because each sits behind a root the operator names explicitly and the bug class is following a link, not naming a real path: the healer `--folder` outside the default roots with no `--roots` (H5), the backfill `--root` (K1), the phrase-cleanup `--root` (E2) and the leaf `skillDir` parent (L1). The orchestrator's decision of 2026-10-10 also accepts site E1, the phrase-cleanup write with no check at the write, on the same basis. The two non-exclusive temp names (`graph-metadata-parser.ts:1852` and `:1855`, `archive.sh:333-339`) are low-risk temps inside contained directories and are not changed here

### Lane C: leaf walker (REQ-004)
- [x] T011 [C] Red: a default root and a declared scope symlinked outside the skill. Cases in `sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs`, failing with "Missing expected exception" (`scratch/evidence/lane-c-red.txt`)
- [x] T012 [C] Green: each start scope is resolved and confined before `readdirSync` in `generate-leaf-manifest.cjs` (`scratch/evidence/lane-c-green.txt`, `scratch/evidence/lane-c-final.txt`)

### Lane D: CI workflows (REQ-005, REQ-006, REQ-007)
- [x] T013 [D] Red: a parse test on `trigger-index-rebuild.yml` that fails while checkout keeps credentials. Evidence: `runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts` loads the workflow with js-yaml and asserts that checkout sets `persist-credentials: false` (test `checks out without persisting the credential`). The mutant with `persist-credentials: true` goes red, 1 failed of 38 (`scratch/evidence/closure-workflow-red-mutants.txt`, block `persist-true`). Green runs: 37 passed and 1 skipped under GNU bash 3.2.57 (`scratch/evidence/closure-workflow-bash32-recheck.txt`) and under GNU bash 5.2.0 (`scratch/evidence/closure-workflow-bash52-recheck.txt`). The `actionlint` gate still runs (`scratch/evidence/actionlint-final.txt`)
- [x] T014 [D] Red: a stub generator that exits nonzero after writing a partial sidecar. No red run on the unfixed workflow was captured. The harness ran the fixed workflow blocks against the same failure (cases R1, R2, S and F in `scratch/evidence/lane-d-harness.txt`). Superseded in part by the operator's restructure of 2026-10-10, which removed the retry, so R1 and R2 are historical. The exit-checked regenerate step and the verify step now cover that path (see the AC-006 note in `acceptance-criteria.md`). Closed in this pass: the three generator-fault cases in `runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts` (`fresh-partial`, `fresh-complete` and `regenerate-partial`) each assert no commit and no push. The red runs are two mutants of the restructured workflow that remove the exit check, `regen-exit-removed` (1 failed of 38) and `fresh-exit-removed` (5 failed of 38), in `scratch/evidence/closure-workflow-red-mutants.txt`. No red run exists on the removed retry, as the note above already states. The bash re-runs are `scratch/evidence/closure-workflow-bash32-recheck.txt` and `scratch/evidence/closure-workflow-bash52-recheck.txt`
- [x] T015 [D] Trace the report producer for SL-006-010. Route 1 (freshness sweep) reproduced red and green, route 2 (repair output) shares its wrapper, and route 3 (changed-packet annotations) cannot receive a raw newline (`scratch/evidence/workflow-command-trace.txt`, `scratch/evidence/lane-d-freshness-stop-commands-red.txt`, `scratch/evidence/lane-d-freshness-stop-commands-green.txt`)
- [x] T016 [D] Green: `persist-credentials: false`, the write token only in the push step (line 157), the four-output content check, and the stop-commands wrapper (`scratch/evidence/lane-d-harness.txt`, `scratch/evidence/actionlint-final.txt`, `scratch/evidence/post-review-trigger-green-bash32.txt`, `scratch/evidence/post-review-trigger-green-bash52.txt`). The retry failure named here was removed by the 2026-10-10 restructure, so its harness evidence is historical. Live proof waits for the post-push run

### Lane E: phrase cleanup provenance (REQ-008)
- [x] T017 [E] Red: an authored eight-token trigger that ends in a stop word is rewritten by `--apply`. The case in `runtime/cli/tests/template-phrase-provenance.vitest.ts` fails on the red run (`scratch/evidence/lane-e-red.txt`)
- [x] T018 [E] Green: only phrases that match a recorded description cut are trimmed in `runtime/cli/spec/template-phrase-cleanup.mjs`, and the generated-phrase trim case still passes (`scratch/evidence/lane-e-green.txt`)

### Lane F: upgrade-legacy symlink audit (REQ-009)
- [x] T019 [F] Audit every apply and move path in `upgrade-legacy.mjs`, with the guard for each (`scratch/evidence/upgrade-symlink-audit.txt`)
- [x] T020 [F] Red then green: a symlinked apply, move, census or archived target outside `specs` is neither written nor moved (`scratch/evidence/lane-f-red.txt`, `scratch/evidence/lane-f-green.txt`, `scratch/evidence/lane-f-census-red.txt`, `scratch/evidence/lane-f-census-green.txt`, `scratch/evidence/lane-f-archived-red.txt`, `scratch/evidence/lane-f-archived-green.txt`)

### Lane G: Gate 3 child docs and repo-era catalog (REQ-010, REQ-011, REQ-012)
- [x] T021 [G] Full byte diff of the canonical `system-spec-kit/SKILL.md` against the Hermes copy, with each hunk classed (`scratch/evidence/hermes-skill-diff.txt`), and the sync check (`scratch/evidence/lane-g-sync-check.txt`)
- [x] T022 [G] Red then green: the child-dispatch pre-resolution is absent at HEAD (count 0) and present in the three surfaces now. This is a grep check, not an automated contract test (`scratch/evidence/child-dispatch-check.txt`)
- [x] T023 [G] Green: the branch is in the canonical SKILL.md, the Hermes copy, and the plan, implement and complete YAMLs, with `checkpoint_options` and `child_dispatch_checkpoints` defined (`scratch/evidence/child-dispatch-check.txt`)
- [x] T024 [G] Repo-era no-roots case returns unknown, and the catalog sentence says so (`scratch/evidence/lane-g-repo-era-none.json`, `scratch/evidence/lane-g-catalog-validate.txt`). No red run was captured for this case

### Lane H: packet and parent doc lane (REQ-013, REQ-014, REQ-015)
- [x] T025 [H] Parent handoff rows 017 to 018 and 018 to 019 carry the criteria and verification their child files record, replacing the TBD cells (`scratch/evidence/handoff-rows-check.txt`)
- [x] T026 [H] Parent handoff row 019 to 020 and phase row 20 are written. The parent `completion_pct` is 95, the count the status classifier gives (19 of 20 children complete, with 020 the only In Progress child). Its basis is `.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh` lines 38 and 47, which count `complete` and `implemented` as complete, so 001 to 003 count. The 016 phase row reads Complete to match phase 016's own status (`specs/system-speckit/034-spec-folder-tooling/spec.md`). History: 90 was a count made while 016 was still In Progress, and 75 was a lane error that left out `Implemented`. It is reverted to 95
- [x] T027 [H] Phase 019 SC-002 is recorded as met, with `019-epic-follow-up-fixes/scratch/evidence/post-push-ci.txt` as the receipt
- [x] T028 [H] Phase 010: `actionlint` is installed (`/opt/homebrew/bin/actionlint`, 1.7.12), exits 0 on every workflow, and phase 010 T009 and T011 are closed. The negative control in `scratch/evidence/actionlint-final.txt` shows the tool reports failures. The operator's yes for the install is not recorded in this packet, so the install is noted as found, not as approved here
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T029 [H] Run the full CLI suite with `SPECKIT_TEST_RUN_TIMEOUT_MS=3600000` from the final state. Compare with the 019 baseline of 1776 passed, 19 skipped, 0 failed. Done on the G4 final-state gate (`scratch/evidence/closure-gate-final4.txt`, job j01, steps `cli-npm-test 0`): 176 test files passed and 3 skipped, and 1953 tests passed and 20 skipped, with 0 failed (1973 in all). The legacy suites report passed=51, passed=27, 12, 2 and 12, each with 0 failed.
- [x] T030 [H] Run `bash .skilled/commands/doctor/scripts/tests/run-all.sh` and `node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/*.test.mjs`, each with its exit code. Done in the closure pass: the doctor run-all exited 0 with 7 suites passed and 0 failed, and the hooks run exited 0 with 186 passed, 0 failed and 3 skipped (`scratch/evidence/closure-gate-rerun-final.txt`). The first run matched (`closure-gate-doctor-hooks.txt`)
- [x] T031 [H] Strict validates on 010, 020, the 034 parent and 016 (`scratch/evidence/validate-010-final.txt`, `scratch/evidence/validate-020-final.txt`, `scratch/evidence/validate-034-final.txt`, `scratch/evidence/validate-016-final.txt`). The final-state rerun belongs to the orchestrator
- [x] T032 [H] Every acceptance row in `acceptance-criteria.md` is marked with the evidence path that shows it. AC-005 and AC-006 are Met on the live run 38062364636 (`scratch/evidence/post-push-ci.txt`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. T029 closed on the G4 final-state gate (`scratch/evidence/closure-gate-final4.txt`). T010, T013, T014 and T030 closed in the closure pass
- [x] No `[B]` blocked tasks remaining. None are blocked now
- [x] Every acceptance row Met. AC-005 and AC-006 are Met on the live run 38062364636 (`scratch/evidence/post-push-ci.txt`)

### Verification Summary

- Tasks: 32 of 32 checked. Open: none.
- Checklist: 21 of 21 checked. Open: none.
- Acceptance rows: 16 of 16 Met. Open: none.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Evidence and outcome**: See `implementation-summary.md`
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

- [x] CHK-001 [P0] Requirements documented in `spec.md`, with a finding id and class for each requirement
- [x] CHK-002 [P0] Technical approach defined in `plan.md`, with the eight lanes and their red cases
- [x] CHK-003 [P1] Dependencies identified and available. `actionlint` is installed now, and REQ-015 is settled by the phase 010 closure
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint and format checks for every lane's files. The gate's lint step passes. The cli package's lint script is `tsc --noEmit`, which exits 0 in the speckit CI job, and actionlint exits 0 on the workflows (`scratch/evidence/closure-gate-speckit-ci-actionlint.txt`). The gate has no ESLint or format step. A manual ESLint run over the changed .ts files in G4 job j18 (`scratch/evidence/closure-gate-final4.txt`, sections 1 and 7) reports 0 problems over all 21 changed .ts files. Before the dead-code removal, the same run reported 6 errors in 2 files, all identical at HEAD (`scratch/evidence/closure-eslint-head-baseline.txt`). Decision of 2026-10-10: remove the dead code now. Lane L deleted seven unused symbols (frontmatterForContextTemplate, VALID_LEVELS, CHECKLIST_H1_PREFIX, OPTIONAL_TEMPLATE_HEADER_RE, OPTIONAL_TEMPLATE_ANCHORS, h2Headers and normalizeHeader) in `runtime/cli/lib/frontmatter-migration.ts` and `runtime/lib/validation/orchestrator.ts`. Removing h2Headers left normalizeHeader with no reference. Both packages typecheck with exit 0, and the targeted vitest runs pass (9 of 9 in the CLI, 84 of 84 at the root) (`scratch/evidence/closure-lane-l-dead-code.txt`). The repository has no format tool, so no format check exists to run. The format half is recorded as not checkable, not as passed. The 95 `typecheck:tests` errors sit in 36 files. `runtime/tests/graph-metadata-schema.vitest.ts` is in this phase's diff, and its two TS2339 errors are at HEAD too, moved down one line (`scratch/evidence/closure-tsc-trigger-test-finding.txt`).
- [x] CHK-011 [P0] No console errors or warnings introduced by a lane's tests. The method and counts are in `scratch/evidence/closure-gate-warnings-scan.txt`. The first CLI run printed 21 graph-metadata fixture warnings, 3 fallback-name warnings and 5 ERROR or Error lines from refusal paths that the tests assert. The graph warning is traced to `create.sh` line 1010, and the phase test diff does not change its fixture. The HEAD baseline exists now. HEAD 4669db6522 was exported with git archive and run with the same suites (`scratch/evidence/closure-warnings-baseline.txt`). The six counted classes match between HEAD and the G4 CLI run (`scratch/evidence/closure-gate-final4.txt`, section 6, method as in `scratch/evidence/closure-warnings-baseline.txt`, section 5). G3 compared the 41 matched lines after normalizing temporary names and timing (`scratch/evidence/closure-warnings-baseline.txt`, section 6). The G4 root run has one more Error line than HEAD. It is the AssertionError of the pre-existing T046-26 timing check in job j02 (`folder-discovery-integration.vitest.ts`), a failed assertion and not a console warning, and no warning or console class rises. The check moves to follow-up 034/021 (`scratch/evidence/closure-t046-26-benchmark.txt`, Known Limitations item 3). The HEAD CLI vitest run had one environment-inferred failure outside the phase diff, which passes in the worktree.
- [x] CHK-012 [P1] Error handling implemented: the refusal paths return a nonzero result and write nothing, as the archive, healer and upgrade cases show (`scratch/evidence/lane-a-green.txt`, `scratch/evidence/lane-b-green.txt`, `scratch/evidence/lane-f-green.txt`)
- [x] CHK-013 [P1] Code follows project patterns, and each lane's test file keeps the style of its neighbors. Ticked on the second Opus re-review's verdict that the new tests reuse each file's helpers and patterns, and that re-review covered the post-review fixes the first review did not re-read. `scratch/evidence/closure-opus-rereview.txt` records the verdict and the checks made against it, which confirm the helper names and the `runIn` fold but not every nit. The first review is in `scratch/evidence/closure-opus-reviews.txt`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see `acceptance-criteria.md`). All 16 rows are Met. AC-005 and AC-006 are Met on the live run 38062364636 (`scratch/evidence/post-push-ci.txt`), and the other 14 are Met on the gate and lane evidence named in their Verification cells.
- [x] CHK-021 [P0] Manual testing: not applicable to this phase. The findings are covered by automated tests, and the DOC-381 manual run stays with phase 019
- [x] CHK-022 [P1] Edge cases tested: outside-root, inside-root, dangling and plain-packet cases for each path lane. Evidence: `scratch/evidence/closure-chk022-lane-map.txt`, which names one case per category per lane and checks each name with rg. Lane A's inside-root case is A-11, a z_archive link inside specs that the archive refuses. Lane B's inside-root case is B-10, a linked folder component inside specs that the healer refuses. Both refusals are the code's behaviour under the 2026-10-10 decision recorded in the spec.md line 193 amendment. The document-level case for an in-specs link (matrix B-03) is still MISSING and is not counted here.
- [x] CHK-023 [P1] Error scenarios validated: the nonzero retry (harness R1 and R2, historical since the 2026-10-10 restructure removed the retry. The exit-checked regenerate step now fails the job before any commit), the stale sidecar (harness S and F, which the verify step now covers) and the refused archive destination (`scratch/evidence/lane-a-green.txt`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class in `spec.md` section 4
- [x] CHK-FIX-002 [P0] Same-class producer inventory for each class-of-bug lane (B, C, E, F) is saved to `scratch/evidence/`, or instance-only status is proven by grep. Evidence: `scratch/evidence/closure-same-class-write-inventory.txt`, which covers lane B (the healer and `repair-derived.cjs`), lane C (the leaf walker), lane E (phrase cleanup and the backfill prune report) and lane F (`upgrade-legacy.mjs`), with the saved grep and a status for each site. The accepted PARTIAL sites are named in T010. Site E1, the phrase-cleanup write with no link check at the write, is accepted by the orchestrator's decision of 2026-10-10 (see T010). H5 with no --roots is OBSERVED (`scratch/evidence/closure-guard-final-summary.txt` section 4). K1 is OBSERVED on output for the graph writer, and the K1 prune report writer stays INFERRED, as that section records. The D2 record is closed, with the one unkilled changed guard named in `scratch/evidence/closure-guard-final-summary.txt` section 8
- [x] CHK-FIX-003 [P0] Consumer inventory for the changed helper (lane B) and the three Gate 3 surfaces (lane G) is complete. Evidence: `scratch/evidence/closure-consumer-inventory.txt`. Sections A and D list the lane B helper callers, and sections B and C classify the canonical SKILL.md, the Hermes copy and the three YAML definitions. Two findings are recorded. Finding (a) is fixed by the operator's decision of 2026-10-10, which chose the code's reading: AGENTS.md line 86 and this packet now name `AI_SESSION_CHILD=1` alone (`scratch/evidence/closure-child-marker-part3.txt`). Finding (b) is moved to follow-up 034/021 by the same decision. (a) The child-dispatch wording copied from the framework says that `SYSTEM_SPEC_GATE_ENFORCE=0` or `AI_SESSION_CHILD=1` marks a child. The gate core counts only `AI_SESSION_CHILD` equal to `1` (`spec-gate-core.mjs` line 105), and it never reads `ENFORCE=0` as a child marker. The Hermes plugin's `_orchestrated_leaf()` needs `SYSTEM_SPEC_GATE_DISABLED=1` and `AI_SESSION_CHILD=1` together, so it counts neither variable alone. The earlier note that the Hermes plugin counts `AI_SESSION_CHILD=1` alone is corrected here. The worker's own Bash tool shell, checked in this pass (`scratch/evidence/closure-session-env.txt`), has `SYSTEM_SPEC_GATE_ENFORCE=0` and `AI_SESSION_CHILD` unset, so the earlier operator-stated wording is replaced by that observation. The repository does not set either value for an interactive session. The core's stricter reading is the safe one. (b) `.skilled/bin/worktree-session.sh` line 458 exports `AI_SESSION_CHILD=1`, and line 485 execs the runtime in the same process, so the top-level session that the launcher starts reads as a child. The file is identical at HEAD `4669db6522`, so this predates the phase. Receipts: `scratch/evidence/closure-child-dispatch-findings.txt` Moved to follow-up 034/021 by the operator's decision of 2026-10-10.
- [x] CHK-FIX-004 [P0] Path fixes (lanes A, B, C, F) carry adversarial table tests for outside-root, no-op, dangling and fallback cases. Outside-root, no-op and dangling cases exist for each of the four lanes (`closure-edge-green-k2a-final.txt` with 97 of 97, `closure-edge-green-k2b-vitest.txt` with 40 of 40, and `closure-edge-green-k2b-leaf.txt`). Fallback is defined in `scratch/evidence/closure-fallback-map.txt` as a path taken when a primary resolution is absent or fails. Lane A (the archive specs-root fallback) and lane C (the default root) have an adversarial fallback case. Lane B now meets it through the no-`--roots` containment cases that the healer identity fix added, as `scratch/evidence/closure-fallback-remap.txt` records. Lane F meets it through the default-root fallback case at `upgrade-legacy.vitest.ts` line 1864, "refuses a default specs root that is a link to a directory outside the repository, with no --roots". That case fails under mutants gE-A and gE-B (2 of 53 each, `scratch/evidence/closure-guard-final-gE.txt`) and passes at the control (53 of 53). A dangling default root has no separate case, because `existsSync` filters it out and the run skips it with nothing written. One k2b mutant, R3, passed all 23 cases and is not counted as a red run (`closure-edge-k2b-R3-not-red.txt`).
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: `scratch/evidence/closure-test-matrix.txt` lists the axes in its header (target kind, mode and tool) and 100 rows in section 5 (66 COVERED, 1 PARTIAL, 33 MISSING). This ticks the listing only. `scratch/evidence/closure-test-matrix-rationale.txt` sorts the 34 rows that are not COVERED. 14 fit the stated rationale (7 dry-run variants and 7 accepted root gaps), 5 are unchanged link handling in a changed file, 10 sit on changed guards with no case, and 4 are ambiguous. The PARTIAL row D-05 is mostly a dry-run gap. The last two groups are resolved in `scratch/evidence/closure-guard-final-summary.txt`. Every class 4 and class 5 row is RED-PROVEN, or unchanged link handling with a diff proof, except one changed guard: the healer `--roots` realpath check at `heal-spec-docs.cjs` 923 to 925, which no case kills (mutant gB-realp passes 35 of 35). The backfill prune report is not an unchanged tool, as the operator's example said, because its report write changed in this phase
- [x] CHK-FIX-006 [P1] Hostile env or global-state variant run when a lane's tests read process-wide state. Done on the G4 final-state gate (`scratch/evidence/closure-gate-final4.txt`, job j17). TMPDIR is `hostile tmp dïr`, which holds a space and a non-ASCII letter, with LANG=C, LC_ALL=C, TZ=Pacific/Kiritimati, umask 077 and AI_SESSION_CHILD=1. The run covers the 13 lane CLI files (345 passed, 2 skipped), the three root project files (159 passed), the doctor compat test (30 passed), the leaf scope test (1 passed) and the phase workflow test (passed=148, failed=0), and every step exits 0. The earlier hostile runs used the ASCII name `hostile tmp dir`, so the non-ASCII claim in `scratch/evidence/closure-gate-hostile-env.txt` was wrong for them, and this item relies only on the G4 run. That earlier run failed 2 of 294 in `heal-target-parity.vitest.ts`, because the helper split packet paths on whitespace, and the fix matches each output line instead. The fix is recorded under Files Changed and Post-review fixes in `implementation-summary.md`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range. The pinned range is `4669db6522..bb2006123f` (13 commits, pushed), and the bot commit that followed is `b5436f97a6`, whose parent is `bb2006123f`. The CI receipts are in `scratch/evidence/post-push-ci.txt`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in any changed file. Evidence: `scratch/evidence/closure-secret-scan.txt` scans 441 changed and new files with 15 shape patterns. The 13 patterns with controls in that scan match their synthetic positive controls, and no working credential is found. The two PUSH_TOKEN literal patterns had no control line in the scan, so `scratch/evidence/closure-secret-push-controls.txt` gives them synthetic controls, and both match. The limit is a shape scan with no entropy scan, because gitleaks is not installed. `scratch/evidence/closure-secret-rescan-020-docs.txt` re-runs the same patterns over the 020 documents edited after the scan
- [x] CHK-031 [P0] Input validation implemented for every path derived from packet content: the archive `.`/`..` refusal, and the resolved-path containment in the healer, the leaf walker and upgrade-legacy
- [x] CHK-032 [P1] The CI write token reaches only the push step (REQ-005). `PUSH_TOKEN` is set at workflow line 157, in the push step, which runs git only after the 2026-10-10 restructure, and checkout sets `persist-credentials: false`
<!-- /ANCHOR:security -->
