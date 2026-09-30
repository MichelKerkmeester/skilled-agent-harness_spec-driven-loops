---
title: "Tasks: Phase 29: align system-deep-loop runtime code with sk-code-opencode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 29: align system-deep-loop runtime code with sk-code-opencode

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

All code work runs in `.worktrees/070-runtime-code-alignment` (branch `worktrees/070-runtime-code-alignment`). Spec docs stay on `main`, where validation is trustworthy.

- [x] T001 Create and provision the worktree (`worktree-naming.sh create` + `provision`: 4 installed, 2 built, 0 failed)
- [x] T002 Record typecheck and vitest baselines for all three runtimes [EVIDENCE: `scratch/baseline/`; advisor 963 passed / 8 failed, deep-loop 2704 / 4, all typechecks exit 0 after building spec-kit; spec-kit's full suite exceeds its own 600 s bound, so packet 046 needs a scoped test gate]
- [x] T003 Capture the checker's default-mode output on all three runtimes before touching it [EVIDENCE: `scratch/baseline/checker-default-*.txt`, 0 findings each; checker suite 19/19 before edits]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Prerequisites (Opus-built; block both sibling packets):

- [x] T004 Add `--check-sections` to `verify_alignment_drift.py`, with passing, failing, mixed-format and test-exempt fixture tests [EVIDENCE: suite 25/25; flag reports SECTIONS-MISSING 40 / 37 / 68, matching the census]
- [x] T005 Add `--check-folders` (missing README, double-underscore folder names) with passing, failing and under-`tests/` fixture tests [EVIDENCE: suite 25/25; FOLDER-DUNDER-NAME 3 / 3 / 0; README gaps 2 / 3 / 9, the extra spec-kit one a symlink-only folder the census skipped; default-mode output byte-identical to T003 on all three runtimes]
- [x] T006 Write the "Folders and tests" rule into `sk-code/shared/references/universal/code-style-guide.md` §3 and add OBSIDIAN to its description [EVIDENCE: `validate_document.py` VALID, 0 issues]
- [x] T007 [P] Fix the `tests/__helpers__/` example in sk-code-opencode's `directory-and-test-conventions.md`, drop the adjacent-tests option, and link the shared rule [EVIDENCE: `validate_document.py` VALID, link resolves]
- [x] T008 [P] Rewrite the test-layout guidance in `sk-code-obsidian/SKILL.md` and `assets/verification-checklist.md` to the `tests/` tree, recording the plugin repo's current layout as known violations [EVIDENCE: both VALID, 0 issues; link resolves]
- [x] T009 Author the ARCHITECTURE template in `sk-doc/sk-create-readme/assets/` from the shared 8-section skeleton and route to it from `sk-create-readme/SKILL.md` [EVIDENCE: `architecture-template.md`, SKILL.md and ROUTER.md VALID 0 issues; `leaf-manifest.json` regenerated, diff = 1 added leaf; `parent-skill-check` PASS; compiled-routing readiness reports `stale-manifest`, handled by T023]
- [x] T010 Write `scratch/align-loop.sh` (modes `header`, `sections`, `readme`; comment-only diff filter; typecheck every 25; full vitest per mode; revert on fail; done list) [EVIDENCE: `bash -n` OK; comment-only gate accepts a header edit and rejects string change, `@ts-ignore` and unclosed comment]
- [x] T011 Dry-run the driver on 3 deep-loop files and inspect each diff by hand before any unattended run [EVIDENCE: 3/3 KEPT, each diff swaps the old box banner for the MODULE header and nothing else; gate 2704 passed / 4 failed = baseline]

system-deep-loop alignment:

- [x] T012 Loop `header` mode over the 131 files without a MODULE header [EVIDENCE: `scratch/loop-state/system-deep-loop-header.log` 131 KEPT, 0 REVERTED; 6 typecheck gates passed; full suite 2704 passed / 4 failed = baseline; 12-name random sample read by hand]
- [x] T013 Loop `sections` mode over the 68 non-test files over 150 lines without numbered sections [EVIDENCE: `scratch/loop-state/system-deep-loop-sections.done` 71 files; `--check-sections` on the runtime now reports 0 SECTIONS findings; 2 typecheck gates passed. Final suite 2703 passed / 5 failed: the extra failure is `authorized-ledger.vitest.ts > serializes concurrent processes`, which fails 3 of 11 reruns on unchanged code, touches no edited file, and is a timing flake, not a regression. Mid-run fixes: the checker's divider-shape regex crossed newlines and flagged correct header+divider pairs (98 targets fell to 69), the comment-only stripper misread a `'` inside a regex literal, and reverts restored from HEAD instead of the pre-dispatch snapshot; all three fixed before the restart]
- [x] T014 Loop `readme` mode over the code folders without a README [EVIDENCE: `scratch/loop-state/system-deep-loop-readme.log` 9 KEPT after one driver fix (the untracked-file filter matched the folder path exactly, so each new `<folder>/README.md` read as an outside edit); `--check-folders` on the runtime exits 0 with no findings; all 9 READMEs pass `validate_document.py`; the cli-adapter README's matrix-row count (14) and shared-factory claim checked against the code. The `cutover-binding` and `scripts/tests` READMEs are folded or moved by T015 and T016]
- [x] T015 Merge `lib/cutover-binding/` into `lib/mode-append-gateway/` and repoint its 5 importers [EVIDENCE: `git mv` of `resolve-cutover-binding.ts` (no relative imports of its own); exports added to the gateway barrel; `append-mode-event.ts` imports the sibling file directly, `scripts/append-mode-event.cjs` and 3 tests import the gateway barrel; old barrel and README removed, the resolver folded into the gateway README (validates, 0 issues); `rg "cutover-binding/"` over the runtime finds nothing; typecheck exit 0; the gateway, cutover-binding, append-mode-event CLI, legacy-seam and postflip-fanout suites 5 files / 63 tests pass]
- [x] T016 Merge `scripts/tests/` into `tests/`, fixing its two in-file paths [EVIDENCE: `git mv` to `tests/unit/runtime-bootstrap.test.cjs`; the `require` and `SCRIPTS_DIR` paths now go up two levels to `scripts/`; `node --test` 9/9 pass before and after; `.skilled/scripts/run-node-tests.mjs` discovers it at the new path; the folder README removed and the suite added to `tests/unit/README.md` (validates, 0 issues); `--check-folders` exit 0]
- [x] T017 Merge `tests/fixtures/council-value/data/` into its parent and repoint `seed-helpers.ts` [EVIDENCE: `git mv` of `scenarios.cjs` (no relative requires of its own), `data/README.md` removed and its content folded into the parent README (0 issues with `--no-exclude`; fixture trees are skipped by default); `seed-helpers.ts` requires `./scenarios.cjs`; `rg "council-value/data"` finds nothing; typecheck exit 0; `council-graph-value-scenarios.vitest.ts` 6/6 pass; `--check-folders --check-sections` exit 0]
- [x] T018 Write `.skilled/skills/system-deep-loop/ARCHITECTURE.md` from the T009 template [EVIDENCE: all eight template sections filled; `validate_document.py` 0 issues; diagram lines all 68 wide; facts checked against the tree: the three `lib/`→`scripts/` requires (`jsonl-repair.ts`, `council/convergence.cjs`, `durable-orchestrator.ts`) named as the only direction exceptions, the workflow YAML home `.skilled/commands/deep/assets/`, the guard core `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs` wired in `.claude/settings.json` and `.skilled/plugins/system-deep-loop-guard.js`, and every script it names present under `runtime/scripts/`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 `verify_alignment_drift.py --check-exact-headers --check-sections --check-folders --root .skilled/skills/system-deep-loop/runtime` reports 0 errors [EVIDENCE: exit 0, Findings 0, Errors 0, Warnings 0, run in the worktree after T015-T018]
- [x] T020 Typecheck passes and the vitest pass count equals the T002 baseline [EVIDENCE: final run after T012-T018: typecheck exit 0; vitest 2704 passed / 4 failed / 8 skipped of 2716, identical to `scratch/baseline/deeploop-test.log`, and the 4 failing test names diff clean against the baseline (`check-contract-drift` x2, `render-command-contract` x2); vitest exits 1 on those pre-existing failures in both runs]
- [x] T021 The checker's default-mode output equals the T003 capture on all three runtimes (already true after T004-T005; rerun at the end) [EVIDENCE: all three exit 0 with output identical to `scratch/baseline/checker-default-*.txt` apart from the `Scanned files` line. Scanned counts: deep-loop 572 -> 571 (the removed barrel), skill-advisor 348 -> 348, spec-kit 756 -> 868. The checker scans only git-tracked files and spec-kit sources are untouched here, so the spec-kit delta comes from the commit the baseline ran against (main now scans 879); that attribution is inferred, not reproduced]
- [x] T023 After merge, on `main`: re-promote sk-doc's compiled-routing activation manifest so `compiled-route-status.cjs --hub sk-doc` reports `compiled-serving` again (operator authorized 2026-09-30; the new leaf moved the policy hash from `f7a191…` to `a1536…`) [EVIDENCE: on main after 46fc86c8e8, `compiled-route-status.cjs --hub sk-doc` reports `causeCode: compiled-serving`, manifest fresh, policy hash `322eec…`; the merge commit re-minted it from the merged sources, and sk-code reports compiled-serving too]
- [x] T024 After merge, on `main`: run `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py --write` then the plain run, because the verdict baseline lists every tracked README and the folder merges delete some (the worktree run reports 1 diff for the removed `lib/context/README.md`); run `test_readme_manifest.py --write` if the manifest run stops reproducing; rebuild the spec-kit trigger index, which lists the removed and added READMEs (its tests pass in the worktree, 65/65) [EVIDENCE: on main, verdict parity `--write` then plain: 1116 READMEs, diff 0, PASS; `test_readme_manifest.py --write` then plain: 839 directories, reproducible, 21/21 exclusions; `generate-trigger-index.mjs` rebuilt the index and its three sidecars, `--check` exit 0 with 0 obsolete paths; `trigger-index.vitest.ts` 57/57]
- [x] T022 At commit time, run `frontmatter-version.mjs apply --skill sk-code --update` in the same commit as the doc edits (needs sk-doc's node deps, which the worktree lacks) [EVIDENCE: `--skill sk-code --update` rewrote 330 unrelated docs, so it was reverted and the tool applied to the 7 versioned docs this work edited (`--paths`): 5 updated, 2 already equal, `verify` 7/7 ok. `sk-doc/ROUTER.md` sits outside the versioned scope]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every `acceptance-criteria.md` row is Met, Waived or Superseded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Siblings waiting on T004-T010**: `specs/system-skill-advisor/031-align-runtime-code-with-sk-code-opencode`, `specs/system-speckit/046-align-runtime-code-with-sk-code-opencode`
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

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md §4 REQ-001..REQ-007]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §3 data flow]
- [x] CHK-003 [P1] Baselines recorded before the first code edit [EVIDENCE: `scratch/baseline/deeploop-test.log` (2704 passed, 4 failed) and `deeploop-typecheck.log` were captured before the first edit]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every loop batch diff touches comment and blank lines only [EVIDENCE: every loop edit was kept only after `align_loop_checks.py comment-only` passed on it, so an edit that touched code was restored from its snapshot and logged REVERTED; the hand-numbered files passed the same proof]
- [x] CHK-011 [P0] Typecheck passes on all three runtimes [EVIDENCE: final state on main 46fc86c8e8: `npm run typecheck` exits 0 in system-spec-kit, system-skill-advisor/runtime and system-deep-loop/runtime]
- [x] CHK-012 [P1] New checker code follows sk-code-opencode Python conventions [EVIDENCE: `verify_alignment_drift.py` carries the COMPONENT header and numbered sections, and the checker run over its own `assets/scripts/` folder with all three flags reports Findings 0]
- [x] CHK-013 [P1] No ephemeral ids (spec paths, task ids) in any code comment [EVIDENCE: the comment-hygiene pre-commit gate passed on every commit; it blocked three pointers on the first attempt (`gap #6 of 101/007` and two `specs/foo` examples), which were reworded to the durable why before commit]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] vitest pass count equals baseline on every runtime touched [EVIDENCE: baseline 2704 passed with 4 failures; after the loops 2704 passed with the same 4 failing tests; after merging main the gate reports 2852 passed and 0 failed, because main fixed those 4]
- [x] CHK-021 [P0] Each new checker flag has a passing and a failing test [EVIDENCE: `test_verify_alignment_drift.py` 26/26: `--check-sections` has a failing long-file case, a passing numbered case, a header-rule case and a mixed-format case; `--check-folders` has a missing-README case, a documented-folder pass and a dunder-name case; both flags have an off-by-default case]
- [x] CHK-022 [P1] Checker default-mode output unchanged [EVIDENCE: T021: each skill's default-mode output matches `scratch/baseline/checker-default-*.txt`]
- [x] CHK-023 [P1] Each merge followed by `rg` for the old path returning nothing [EVIDENCE: T015-T017: `rg` for `cutover-binding/`, `scripts/tests/runtime-bootstrap` and `council-value/data/` returns nothing outside history]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each merge names its finding class (`cross-consumer` for moves with importers) [EVIDENCE: each merge row in tasks.md names the moved path and every importer it repointed, which is the cross-consumer class; the fact-check records the CONFIRMED and REJECTED verdict for each]
- [x] CHK-FIX-002 [P0] Same-class inventory done by the census and the new checker flags [EVIDENCE: the census counted every header, section and README gap before the build, and the checker flags re-find the same class on every run; the final run from main reports Findings 0 across all three skills]
- [x] CHK-FIX-003 [P0] Consumer inventory for each moved folder recorded in `scratch/investigation/devin-swe2max-merge-factcheck.md` [EVIDENCE: `scratch/investigation/devin-swe2max-merge-factcheck.md` lists the importers behind each merge proposal]
- [x] CHK-FIX-004 [P2] Adversarial path tests: not applicable, no path, parser or security logic changes [EVIDENCE: not applicable: no path, parser or security logic changed; the moves only rewrote import specifiers]
- [x] CHK-FIX-005 [P1] Matrix: 3 runtimes x 3 loop modes listed in tasks T012-T014 and the sibling packets [EVIDENCE: nine loop logs in `specs/system-deep-loop/036-deep-loop-innovation/029-align-runtime-code-with-sk-code-opencode/scratch/loop-state/`: header, sections and readme for each of the three skills]
- [x] CHK-FIX-006 [P2] Hostile env variant: not applicable, no process-wide state read by changed code [EVIDENCE: not applicable: the changed code reads no new process-wide state]
- [x] CHK-FIX-007 [P1] Evidence pinned to the worktree commit SHA [EVIDENCE: merged to main as 46fc86c8e8 (branch `worktrees/070-runtime-code-alignment`, merge commit 170afa5519)]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credentials in any DeepSeek brief or log [EVIDENCE: a scan of every brief, log, `.out` and `.err` for `sk-`, `AKIA` and bearer-token shapes found nothing; the only hits were source snapshots of the secret-scrubber tests, and those snapshots were removed]
- [x] CHK-031 [P2] Input validation: not applicable, no new input surface [EVIDENCE: not applicable: no new input surface]
- [x] CHK-032 [P2] Auth: not applicable [EVIDENCE: not applicable: no auth surface touched]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec, plan, tasks and acceptance-criteria agree on the scope, including the recorded extensions]
- [x] CHK-041 [P1] Every runtime code folder has a README [EVIDENCE: `--check-folders` over `system-deep-loop/runtime` reports no missing README]
- [x] CHK-042 [P1] ARCHITECTURE.md written from the template [EVIDENCE: `system-deep-loop/ARCHITECTURE.md` follows the 8 sections of `sk-create-readme/assets/architecture-template.md`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: the driver, checks, repoint script, baselines and loop logs live under the deep-loop packet `scratch/`; no temp file landed in a skill]
- [x] CHK-051 [P1] scratch/ keeps only evidence and the driver before completion [EVIDENCE: the 18 MB of per-edit `runs/` snapshots were removed after the merge, because git history now holds the rollback; scratch keeps the driver, the checks, the baselines, the fact-check and the nine loop logs]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-10-01
<!-- /ANCHOR:summary -->

---
