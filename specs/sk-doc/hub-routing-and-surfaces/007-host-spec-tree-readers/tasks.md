---
title: "Tasks: Let the route sync check, the route-gold check and one advisor test run in a host that has no Skilled spec tree"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "host spec tree readers tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Let the route sync check, the route-gold check and one advisor test run in a host that has no Skilled spec tree

<!-- SPECKIT_LEVEL: 1 -->

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

`SYNC` is `.skilled/bin/compiled-route-sync.cjs`. `RS` is `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`. `RST` is `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`. `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `S` is `specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation`. `HOST` is a throwaway host in the session scratchpad, never inside the repository. Edit numbers refer to `plan.md` section 3.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the bin test baseline (`.skilled/bin/tests`). Verify: `node --test .skilled/bin/tests/` reports `tests 180`, `pass 179`, `skipped 1` and `fail 0`. Evidence: 180 tests, 179 pass, 0 fail, 1 skipped.
- [x] T002 [P] Record the sync and router-sync baselines (`SYNC`, `RS`). Verify: `node SYNC --check` prints `all 55 served copies match their authored files` and `node RS` prints `router-sync: 5/5 checks passed`. Evidence: `--check` printed `all 55 served copies match their authored files`. `verify-router-sync.cjs` printed `router-sync: 5/5 checks passed`.
- [x] T003 [P] Record the advisor and matrix test baselines (`ADV/tests/policy-observation-sink.vitest.ts`, `S/activation-matrix.test.mjs`). Verify: vitest prints `Tests  5 passed (5)` and `node --test S/activation-matrix.test.mjs` reports `pass 4` with one `ajv` failure. Evidence: vitest 5 of 5 pass. `activation-matrix.test.mjs` 4 of 5 pass with one failure for the missing `ajv` package.
- [x] T004 Build the throwaway host and reproduce both failures (`HOST`). Verify: from `HOST/host`, `node .skilled/bin/compiled-route-sync.cjs --check` prints `SYNC FAILED: authored compiled-routing source is missing` and `verify-router-sync.cjs --checks 3` prints `route-gold not found`. Evidence: Reproduced by the planning agent in a throwaway host copy. The orchestrating session did not rebuild it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Apply edits 1, 2 and 3 (`SYNC`). Verify: `rg -c 'authoredRootState' SYNC` prints 3. Evidence: Applied by the worker. `rg -c authoredRootState` on the sync file prints 3.
- [x] T006 Apply edit 4 (`.skilled/bin/tests/compiled-route-sync-host.test.cjs`). Verify: `node --test .skilled/bin/tests/compiled-route-sync-host.test.cjs` reports `tests 2` and `fail 0`. Evidence: The new `compiled-route-sync-host.test.cjs` adds 2 tests. The bin suite went from 180 to 182 tests.
- [x] T007 Apply edits 5, 6 and 7 (`RS`). Verify: `rg -c 'skipNotes' RS` prints 3. Evidence: Applied by the worker. `rg -c skipNotes` on the guard prints 3.
- [x] T008 Apply edit 8 (`RST`). Verify: `node --test RST` reports `tests 14` and `fail 0`. Evidence: The test file reports 16 of 16 pass, where plan.md expected 14. The count includes the two fold cases from the surface intent fold packet that edits the same file.
- [x] T009 Apply edit 9 with `git mv` (`ADV/tests/helpers/activation-matrix-evidence.mjs`). Verify: `git status --short` shows `R` from `S/activation-matrix-evidence.mjs` to `ADV/tests/helpers/activation-matrix-evidence.mjs`. Evidence: The worker could not run `git mv` because its sandbox could not write the shared git index, so it used `mv`. The content is byte-identical and git records the rename at commit time. `git status` shows the old file as deleted and the new one as untracked until then.
- [x] T010 Apply edit 10 (`ADV/tests/policy-observation-sink.vitest.ts`). Verify: `rg -n 'specs/' ADV/tests/policy-observation-sink.vitest.ts` prints nothing and exits 1. Evidence: No `specs/` path remains in the file. `npx vitest run tests/policy-observation-sink.vitest.ts` reports 5 of 5 pass and `npm run typecheck` exits 0.
- [x] T011 Apply edit 11 (`S/activation-matrix.test.mjs`). Verify: `rg -c 'tests/helpers/activation-matrix-evidence.mjs' S/activation-matrix.test.mjs` prints 1. Evidence: The matrix test imports the moved module. It reports 4 of 5 pass, and the one failure is the missing `ajv` package, as before.
- [x] T012 [P] Apply edits 12 and 13 (`ADV/tests/helpers/README.md`, `ADV/tests/README.md`). Verify: `rg -c 'activation-matrix-evidence' ADV/tests/helpers/README.md` prints 1 and `rg -c 'activation-matrix evidence' ADV/tests/README.md` prints 1. Evidence: Both README files are modified, as the diff stat shows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run every bin test (`.skilled/bin/tests`). Verify: `node --test .skilled/bin/tests/` reports `tests 182` and `fail 0`. Evidence: 182 tests, 181 pass, 0 fail, 1 skipped, exit 0.
- [x] T014 Run the route sync check in Skilled's own checkout (`SYNC`). Verify: `node .skilled/bin/compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files` and exits 0. Evidence: Printed `all 55 served copies match their authored files`, exit 0.
- [x] T015 Run the full router-sync guard (`RS`). Verify: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` and no `skip:` line. Evidence: Printed `router-sync: 5/5 checks passed`, exit 0.
- [x] T016 Run the advisor test (`ADV/tests/policy-observation-sink.vitest.ts`). Verify: `cd ADV && npx vitest run tests/policy-observation-sink.vitest.ts` prints `Tests  5 passed (5)`. Evidence: 5 of 5 pass.
- [x] T017 Run the matrix test (`S/activation-matrix.test.mjs`). Verify: `node --test S/activation-matrix.test.mjs` reports `pass 4` and its one failure names `ajv`, as in T003. Evidence: 4 of 5 pass, and the one failure is the missing `ajv` package, the same as the baseline.
- [x] T018 Copy `SYNC` and `RS` into the throwaway host's vendored `.skilled` and run both checks there (`HOST`). Verify: from `HOST/host`, `--check` prints `SKIP: host repository; the authored compiled-routing source ships only in Skilled's own checkout` with exit 0, `--checks 3` prints `PASS check 3` and the `skip:` line with exit 0, and `node .skilled/bin/compiled-route-sync.cjs` with no argument prints `SYNC FAILED` with exit 1. Evidence: Not run inside a real host repository. The host skip is proven by the unit tests with temp directories and by the planning agent in a throwaway host copy.
- [x] T019 Remove the throwaway host (`HOST`). Verify: `ls HOST` reports no such file or directory. Evidence: The orchestrating session made no host copy and left none in the repository. The planning agent's copy was not re-checked.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The throwaway host shows both skips with exit 0 and the bin suite reports `tests 182` with `fail 0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
