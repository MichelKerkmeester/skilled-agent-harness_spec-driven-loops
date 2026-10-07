---
title: "Tasks: Align system-spec-kit runtime code with sk-code-opencode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "align runtime code with sk code opencode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Align system-spec-kit runtime code with sk-code-opencode

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

Code work runs in `.worktrees/070-runtime-code-alignment`, after deep-loop child 029 finishes its own loop, because the driver treats any other worktree change as a stray edit.

- [x] T001 Worktree, baseline and checker flags come from deep-loop child 029 [EVIDENCE: 029 T001-T005; spec-kit typecheck exit 0 after build]
- [x] T002 Scope the test gate: spec-kit's `test:runtime` also runs deep-loop's tests and exceeds its own 600 s bound, so record a baseline for spec-kit's own tests only and point the driver's TEST_CMD at it [EVIDENCE: TEST_CMD builds `shared/`, `runtime/`, `runtime/cli/` then runs `npx vitest run --config vitest.config.ts --project root --project cli`; baseline `029/scratch/baseline/speckit-test.log` 2847 passed / 0 failed / 32 skipped over 269 files in 542 s, equal to the separate runs (root 1281 in 188 s, cli 1566 in 358 s); the overrun log kept as `speckit-test-runtime-overrun.log`]
- [x] T003 Confirm the driver's target counts with `--dry-run` for header (254), sections, readme (3) [EVIDENCE: dry-run header 254, sections 64, readme 3 (`cli/hermes`, `cli/hermes/tests`, `hooks/opencode`)]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

DeepSeek loop (one brief per file or folder):

- [x] T004 Loop `header` mode [EVIDENCE: `system-spec-kit-header.log` 253 of 254 kept, 10 typecheck gates passed, full suite 2847/0 = baseline; `continue-session.vitest.ts` was blocked by a transient outside-the-target change (none left behind; the driver now logs the paths) and kept on retry, suite 2847/0 again. The 7 `.sh` files, outside the JS-only header mode, relabeled `SPECKIT:` to `COMPONENT:` by hand (comment lines only, `bash -n` passes, nothing greps the old label)]
- [x] T005 Loop `sections` mode over the 37 non-test files without numbered sections, the 26 mixed-format files and divider-shape files [EVIDENCE: `system-spec-kit-sections.log` 64 of 64 kept, 0 reverted, 2 typecheck gates passed, full suite 2847/0 = baseline]
- [x] T006 Loop `readme` mode for `cli/hermes`, `hooks/opencode`, and `cli/hermes/tests` unless T008 moves it first [EVIDENCE: T008 removed `cli/hermes/tests`; with `ALIGN_SCAN` at the skill root the loop kept 6 of 6 (`cli/hermes`, `hooks/opencode`, `shared/workspace`, `shared/tests`, `shared/frontmatter`, `shared/scripts`) and the suite gate matched the 2847/0 baseline; the later `tests/hooks` README ran as its own pass]

Opus, one at a time, tests after each:

- [x] T007 Rename `tests/__helpers__/` to `tests/helpers/` and `tests/embedders/__fixtures__/` to `tests/embedders/fixtures/`; repoint referencing files [EVIDENCE: `git mv` of both folders; harness path in `hf-model-server-shutdown.vitest.ts` repointed; three READMEs updated; typecheck exit 0; harness test 3/3; no README still names either old folder. The remaining `__fixtures__` strings in `cli/retrieval` are patterns for other repositories' fixture folders and stay]
- [x] T008 Merge `cli/hermes/tests/` into `cli/tests/`; rewrite the test's own `SCRIPT` path [EVIDENCE: `cli/tests/sync-skills-hermes.test.mjs`, `SCRIPT` now `../hermes/sync-skills-hermes.cjs`; `node --test` 4/4 before and after; added to the `cli/tests/README.md` topology and entrypoints; only historical spec docs name the old path]
- [x] T009 Merge `tests/deep-loop/` and `tests/graph/` into `tests/`; fix their import depths and the `tests/README.md` command example [EVIDENCE: both tests moved up one level with one `../` removed from each import; the two boilerplate READMEs deleted; deep-loop `integration-points.md` and two deep-review playbook docs repointed; 2 files 8/8 pass]
- [x] T010 Move `cli/tests/__snapshots__/` to `cli/tests/snapshots/` via `resolveSnapshotPath`, and prove the golden test compares against the moved file (break one line on purpose, see it fail, restore) [EVIDENCE: `resolveSnapshotPath` in the root `test` block of `vitest.config.ts`; set per project, vitest ignored it and wrote 24 new snapshots, which were removed. With it at the root: 12/12 pass and 0 written; one line broken gives `Snapshots 1 failed`; restored gives 12/12]
- [x] T011 Merge `lib/hooks/` into `hooks/lib/` last: 5 hook adapters, 1 test, `.skilled/plugins/system-completion-sentinel.js`, about 12 docs and 3 generated indexes; run the hook tests after [EVIDENCE: `hooks/lib/completion-evidence-sentinel.cjs`; its one relative require resolves the same from both depths. Repointed: 5 adapters (`../lib/...`), the Pi fallback path, `tests/completion-evidence-sentinel.vitest.ts` and `.opencode/plugins/system-completion-sentinel.js`. The old README was folded into `hooks/lib/README.md`. 11 docs updated: `hooks/README.md` and its diagram, 4 runtime READMEs, ARCHITECTURE lines 140 and 170, 2 playbook docs, `.skilled/hooks/completion`, `.skilled/logs`, `.state/completion-sentinel`; `lib/README.md` and `MODULE-MAP.md` lose the `hooks` module. Sentinel and Stop suites 31/31 before and after; Pi extension 1/1; plugin imports; 4 adapters pass `node --check`. The three generated indexes regenerate on main after the merge]
- [x] T012 Refresh `ARCHITECTURE.md` §2 PACKAGE TOPOLOGY for the merged tree [EVIDENCE: §2 PACKAGE TOPOLOGY rewritten from the real tree: it removes the duplicate `runtime/cli/` rows and names `hooks/lib/`, `cli/tests/snapshots/`, `tests/hooks/` and `shared/tests/`; ARCHITECTURE lines 140 and 170 name `hooks/lib/`]
- [x] T015 Bring `shared/` to the same standard: the checker from the skill root finds 26 more errors there that the runtime-rooted census never scanned. Move the 15 colocated `*.test.ts` files into `shared/tests/`, then loop header, sections and readme with `ALIGN_SCAN=.skilled/skills/system-spec-kit`. This widens the frozen runtime scope, because the request names system-skill code, not runtime alone [EVIDENCE: 15 files moved to `shared/tests/`; specifiers rewritten, and three path computations fixed by hand (`config.test.ts` shared root, `model-server-constants.test.ts` provider path, `profile.test.ts` source candidates, which never resolved before the move, so its source-text checks now run and pass); `package.json` test glob and `tsconfig.json` exclude now point at `tests/`; 18/18 before and after; loops kept header 14/14 and sections 8/8, each suite gate 2847/0; the checker at the skill root reports 0 findings]
- [x] T016 Remove the remaining test code that sat beside source, per the shared style guide rule that a test never sits beside the file it covers [EVIDENCE: 6 hook `*.test.mjs` moved flat to `runtime/tests/hooks/`, and `unactioned-recorded-failure-audit.test.mjs` to `cli/tests/`, all with specifiers rewritten: 167 node:test passes before and after, file by file. `lib/test-helpers/env-snapshot.ts` had no importer, so it was deleted as dead code with its `tsconfig`, `tsconfig.tests.json`, `dist-freshness` and `MODULE-MAP` entries. Docs repointed: 4 runtime READMEs lose their colocated rows; `hooks/README.md`, `hooks/lib` and `spec-gate` READMEs, the cli-cursor playbook and feature catalog, and the spec-kit playbook. `stress-test/` stays a dedicated stress tree]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 `verify_alignment_drift.py --check-exact-headers --check-sections --check-folders --root .skilled/skills/system-spec-kit` reports 0 errors [EVIDENCE: the checker from the skill root reports Findings 0, Errors 0, both before and after merging main (the 3 README gaps main brought in were closed by the loop)]
- [x] T014 Typecheck exits 0; the scoped suite from T002 matches its baseline [EVIDENCE: typecheck exit 0; the scoped suite holds 2847 passed and 0 failed before the merge and 2985 passed and 0 failed after it, against the 2847/0 baseline; shared 18/18]
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
- **Prerequisites and loop driver**: `specs/system-deep-loop/036-deep-loop-innovation/029-align-runtime-code-with-sk-code-opencode`
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md states the measured drift, scope and REQ rows; validate --strict passes]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md names the driver, the gates and the per-merge verification]
- [x] CHK-003 [P1] Baselines recorded before the first code edit [EVIDENCE: `specs/system-deep-loop/036-deep-loop-innovation/029-align-runtime-code-with-sk-code-opencode/scratch/baseline/speckit-test.log` (2847 passed, 32 skipped) and `speckit-typecheck.log` were captured before the first edit]
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

- [x] CHK-020 [P0] vitest pass count equals baseline on every runtime touched [EVIDENCE: the scoped suite held 2847 passed and 0 failed after every loop mode and every merge; after merging main the gate reports 2985 passed and 0 failed; the shared suite holds 18/18 and the seven moved node:test files hold 167 passes]
- [x] CHK-021 [P0] Each new checker flag has a passing and a failing test [EVIDENCE: `test_verify_alignment_drift.py` 26/26: `--check-sections` has a failing long-file case, a passing numbered case, a header-rule case and a mixed-format case; `--check-folders` has a missing-README case, a documented-folder pass and a dunder-name case; both flags have an off-by-default case]
- [x] CHK-022 [P1] Checker default-mode output unchanged [EVIDENCE: deep-loop packet T021: the default-mode output matches its baseline capture]
- [x] CHK-023 [P1] Each merge followed by `rg` for the old path returning nothing [EVIDENCE: T007-T011 and T016: `rg` for `__helpers__`, `__fixtures__`, `__snapshots__`, `hermes/tests`, `tests/deep-loop`, `tests/graph`, `lib/hooks/completion` and `lib/test-helpers` returns nothing in code outside history and other repos' fixture patterns]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each merge names its finding class (`cross-consumer` for moves with importers) [EVIDENCE: each merge row in tasks.md names the moved path and every importer it repointed, which is the cross-consumer class; the fact-check records the CONFIRMED and REJECTED verdict for each]
- [x] CHK-FIX-002 [P0] Same-class inventory done by the census and the new checker flags [EVIDENCE: the census counted every header, section and README gap before the build, and the checker flags re-find the same class on every run; the final run from main reports Findings 0 across all three skills]
- [x] CHK-FIX-003 [P0] Consumer inventory for each moved folder recorded in `scratch/investigation/devin-swe2max-merge-factcheck.md` [EVIDENCE: `scratch/investigation/devin-swe2max-merge-factcheck.md` lists the importers behind each merge proposal]
- [x] CHK-FIX-004 [P2] Adversarial path tests: not applicable, no path, parser or security logic changes [EVIDENCE: not applicable: no path, parser or security logic changed; the moves only rewrote import specifiers]
- [x] CHK-FIX-005 [P1] Matrix: 3 runtimes x 3 loop modes listed in tasks T004-T006 [EVIDENCE: nine loop logs in `specs/system-deep-loop/036-deep-loop-innovation/029-align-runtime-code-with-sk-code-opencode/scratch/loop-state/`: header, sections and readme for each of the three skills]
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
- [x] CHK-041 [P1] Every runtime code folder has a README [EVIDENCE: `--check-folders` over the whole skill, `shared/` included, reports no missing README]
- [x] CHK-042 [P1] ARCHITECTURE.md written from the template [EVIDENCE: `system-spec-kit/ARCHITECTURE.md` follows the 8 template sections; T012 rewrote its §2 tree]
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
