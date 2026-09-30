---
title: "Tasks: Align system-skill-advisor runtime code with sk-code-opencode"
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
# Tasks: Align system-skill-advisor runtime code with sk-code-opencode

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

- [x] T001 Worktree, baseline and checker flags come from deep-loop child 029 [EVIDENCE: 029 T001-T005; advisor baseline 963 passed / 8 failed]
- [x] T002 Confirm the driver's target counts: `align-loop.sh system-skill-advisor <mode> --dry-run` for header (33), sections, readme (2) [EVIDENCE: dry-run 2026-09-30 after the divider-shape regex fix: header 33, sections 42 (40 files without numbered sections plus divider-shape files), readme 2]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

DeepSeek loop (one brief per file or folder):

- [x] T004 Loop `header` mode [EVIDENCE: `system-skill-advisor-header.log` 33 KEPT, 0 REVERTED, typecheck gate passed; the three `.sh` files outside the JS-only header mode got `COMPONENT:` headers by hand (comment lines only, `bash -n` passes, no consumer greps the old banner text)]
- [x] T005 Loop `sections` mode over the 40 non-test files without numbered sections plus divider-shape files [EVIDENCE: 41 of 42 kept by the loop; `beta-reliability.ts` was first dropped by a false provider match on "429 lines" (pattern tightened) and kept on retry; `lib/shared/shared-payload.ts` numbered by hand after its spec-kit source (1 INLINED HELPERS, 2 VALUE SETS AND TYPES, 3 GUARDS AND ASSERTIONS, 4 VALIDATORS AND BUILDERS), `comment-only` exit 0. Suite 971 passed / 0 failed after the gate began rebuilding `dist/`: the CLI shim exits 69 on a stale dist, which had failed 8 CLI tests]
- [x] T006 Loop `readme` mode for `lib/routing` and `types` [EVIDENCE: `system-skill-advisor-readme.log` 2 KEPT; suite 971 passed / 0 failed]

Opus, one at a time, tests after each:

- [x] T007 Merge `lib/context/` into `lib/`; repoint its 10 importers and the README tree rows [EVIDENCE: `git mv` to `lib/caller-context.ts`; `repoint_imports.py` rewrote 12 specifiers in 10 files, the same 12 lines `rg` found across `.skilled`; the boilerplate folder README removed, the file added to `lib/README.md`, `context/` dropped from `runtime/README.md`; typecheck 0, build 0, suite 971 passed / 0 failed. The sk-doc verdict-parity baseline still lists the deleted README: regenerated on main after merge (029 T024)]
- [x] T008 Merge `lib/corpus/` into `lib/`; repoint 3 importers, its own `../lifecycle` import and 6 doc links [EVIDENCE: `git mv` to `lib/df-idf.ts`, its own import now `./lifecycle/archive-handling.js`; 3 importers rewritten; folder README removed and the file described in `lib/README.md` (it states that only tests import it); `corpus/` dropped from `runtime/README.md` and `lib/README.md`, the scorer README link removed, 10 path mentions updated across 2 feature-catalog and 2 playbook docs; `rg lib/corpus` finds only unrelated prompt text; typecheck 0, build 0, suite 971/0, df-idf stress 3/3]
- [x] T009 Merge `lib/routing/` into `lib/` and rewrite `CONFIG_DIR_CANDIDATES` for the new depth; prove the route denylist still loads [EVIDENCE: `git mv` to `lib/route-exclusions.ts`; candidates now `lib -> ../config` (source) and `dist/runtime/lib -> ../../../config` (dist); own import `./utils/json-guard.js`; 3 importers rewritten; source layout proven by the existing committed-default test, dist layout by importing `dist/runtime/lib/route-exclusions.js`, which returns `['sk-communication']` (a wrong path returns an empty set and exits 1); typecheck 0, build 0, suite 971/0]
- [x] T010 Merge `tests/utils/` into `tests/` [EVIDENCE: `git mv` to `tests/workspace-root.vitest.ts`, its import now `../lib/utils/workspace-root.js`; nothing imported the folder; folder README removed; the test passes 23/23 at the new path]
- [x] T011 Move `lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts` to `tests/scorer/`, fix its 6 imports, confirm vitest now runs it [EVIDENCE: `git mv`; all 6 imports rewritten, including the 2 that previously resolved to the skill root; vitest now collects it and it passes 4/4; the folder README removed and `__tests__/` gone; typecheck 0. The `**/__tests__` exclude globs left in both tsconfigs now match nothing and are out of this packet's scope]
- [x] T012 Delete `stress-test/search-quality/` and its link in `stress-test/skill-advisor/README.md` [EVIDENCE: confirmed dead and broken before deleting: 3 of its 4 imports resolve to missing files (`./corpus`, `./metrics`, `lib/search/search-decision-envelope`), no code imports it, and no vitest config includes it; spec-kit's `search-quality` references concern its own dist orphans; `git rm -r`, README link removed, `rg search-quality` in the skill finds nothing; typecheck 0; stress suite 62 passed / 2 failed, the same 2 failures (sa-016, sa-034) as on main]
- [x] T013 Merge `tests/__fixtures__/` and `tests/__shared__/` into `tests/fixtures/`; repoint 4 and 3 referencing files [EVIDENCE: `git mv` of `errors.ts` and `affordance-injection-fixtures.json`; code references rewritten in `handlers/advisor-recommend.vitest.ts`, `affordance-normalizer.test.ts` and `python/test_skill_advisor.py`; the `__fixtures__` README folded into `tests/fixtures/README.md` (tree now lists all four entries, boundary line corrected for builders); `runtime/README.md`, `tests/README.md` and `tests/skill-graph/README.md` updated; the one remaining hit is a recorded command transcript in `manual-testing-playbook/operator-h5/degraded-daemon.md`, left as evidence; typecheck 0, build 0, suite 975 passed / 0 failed (971 plus the 4 cosine cases), Python suite 59/0 including the 3 shared-fixture checks]
- [x] T014 Refresh `ARCHITECTURE.md` §2 PACKAGE TOPOLOGY for the merged tree [EVIDENCE: the tree now names the moved flat modules and adds the runtime folders it lacked (`schemas/`, `compat/`, `config/`, `data/`, `types/`, `stress-test/`), each role checked against the folder's README or contents; `validate_document.py` 0 issues]
- [x] T017 Move `lib/test-helpers/` to `tests/helpers/`, because test helpers belong under `tests/` and the production build was shipping this one in `dist` [EVIDENCE: `env-snapshot.ts` and its README moved; the one importer, `stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`, repointed; README retitled; `tests/README.md` tree lists `helpers/`; the stale `dist/runtime/lib/test-helpers` build output removed; advisor typecheck exit 0; the stress file loads and passes 3 of 4, and its one failure is sa-034, which also fails on main]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 `verify_alignment_drift.py --check-exact-headers --check-sections --check-folders --root .skilled/skills/system-skill-advisor/runtime` reports 0 errors [EVIDENCE: exit 0, Findings 0, Errors 0, Warnings 0 after T004-T014]
- [x] T016 Typecheck exits 0; vitest at least 963 passed and at most 8 failed, plus the cosine test's own cases now passing [EVIDENCE: typecheck 0; after `npm run build`, vitest exit 0 with 975 passed / 0 failed / 6 skipped over 130 files (the 971 of the header run plus the 4 cosine cases). The baseline's 8 failures do not recur once `dist/` is rebuilt: the CLI shim exits 69 on a stale dist, which most likely also explains the baseline, though that capture state was not reproduced. Stress suite 62/2 matches main]
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
- [x] CHK-003 [P1] Baselines recorded before the first code edit [EVIDENCE: `specs/system-deep-loop/036-deep-loop-innovation/029-align-runtime-code-with-sk-code-opencode/scratch/baseline/advisor-test.log` and `advisor-typecheck.log` were captured before the first edit]
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

- [x] CHK-020 [P0] vitest pass count equals baseline on every runtime touched [EVIDENCE: baseline 963 passed with 8 failed; before merging main 975 passed and 0 failed; after merging main the gate reports 1079 passed and 0 failed]
- [x] CHK-021 [P0] Each new checker flag has a passing and a failing test [EVIDENCE: `test_verify_alignment_drift.py` 26/26: `--check-sections` has a failing long-file case, a passing numbered case, a header-rule case and a mixed-format case; `--check-folders` has a missing-README case, a documented-folder pass and a dunder-name case; both flags have an off-by-default case]
- [x] CHK-022 [P1] Checker default-mode output unchanged [EVIDENCE: deep-loop packet T021: the default-mode output matches its baseline capture]
- [x] CHK-023 [P1] Each merge followed by `rg` for the old path returning nothing [EVIDENCE: T007-T013 and T017: `rg` for each old path (`lib/context/`, `lib/corpus/`, `lib/routing/`, `tests/utils/`, `lanes/__tests__/`, `__fixtures__`, `__shared__`, `lib/test-helpers/`) returns nothing in code]
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
- [x] CHK-041 [P1] Every runtime code folder has a README [EVIDENCE: `--check-folders` over `system-skill-advisor/runtime` reports no missing README]
- [x] CHK-042 [P1] ARCHITECTURE.md written from the template [EVIDENCE: `system-skill-advisor/ARCHITECTURE.md` follows the 8 template sections; its §2 tree was refreshed]
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
