---
title: "Tasks: Let a hub declare that a surface folds its child intents into one hub intent so the router sync check accepts it"
description: "Ordered tasks to add the surfaceIntentFolds declaration to the sk-code router sync guard, test it and name it in the hub README."
trigger_phrases:
  - "surface intent fold declaration tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Let a hub declare that a surface folds its child intents into one hub intent so the router sync check accepts it

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

`G` is `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`. `T` is `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`. Every command runs from the worktree root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the guard baseline (`G`). Verify: `node G` prints `router-sync: 5/5 checks passed` and exits 0. Evidence: `router-sync: 5/5 checks passed`, exit 0.
- [x] T002 Record the test file baseline (`T`). Verify: `node --test T` reports `tests 13` and `fail 0`. Evidence: 13 of 13 pass.
- [x] T003 Record the bin test baseline (`.skilled/bin/tests/`). Verify: `node --test .skilled/bin/tests/` reports `tests 180`, `pass 179`, `fail 0` and `skipped 1`. Evidence: 180 tests, 179 pass, 0 fail, 1 skipped.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Apply plan edit 3, the `extra` parameter of `writeSurfaceRouting` (`T`). Verify: `node --test T` still reports `tests 13` and `fail 0`. Evidence: Applied by the worker from plan.md.
- [x] T005 Apply plan edit 4, `buildFoldHub` and the two fold cases (`T`). Verify: `node --test T` reports `tests 15` and `fail 2`, and the two failures are the two new fold cases. Evidence: Applied by the worker. The red step was not rerun on its own by the orchestrating session.
- [x] T006 Apply plan edit 1, the `surfaceIntentFolds` function (`G`). Verify: `rg -n '^function surfaceIntentFolds' G` prints one line. Evidence: Applied by the worker. The `surfaceIntentFolds` function is in the guard.
- [x] T007 Apply plan edit 2, the fold branch in `legSurfaceMap` (`G`). Verify: `node --test T` reports `tests 15` and `fail 0`. Evidence: Applied by the worker. The test file reports 16 of 16 pass. The count includes one host route-gold case from the host spec tree packet and the two fold cases.
- [x] T008 Apply plan edit 5, the `hub-router.json` row (`.skilled/skills/sk-code/README.md`). Verify: `rg -c 'surfaceIntentFolds' .skilled/skills/sk-code/README.md` prints 1. Evidence: `rg -c surfaceIntentFolds` on the README prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the live guard for REQ-003 (`G`). Verify: `node G` prints `router-sync: 5/5 checks passed` and exits 0. Evidence: `router-sync: 5/5 checks passed`, exit 0.
- [x] T010 Rerun the bin tests for REQ-005 (`.skilled/bin/tests/`). Verify: `node --test .skilled/bin/tests/` reports `tests 180` and `fail 0`. Evidence: 182 tests, 181 pass, 0 fail, 1 skipped, exit 0. The count includes two tests from the host spec tree packet.
- [x] T011 Confirm the sk-code policy hash did not move for REQ-005 (`.skilled/skills/sk-code/hub-router.json`). Verify: `node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-code --skill-root .skilled/skills/sk-code` prints `"fresh":true`, and `git diff --stat -- .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/SKILL.md` prints nothing. Evidence: `git diff --stat` on `hub-router.json` and `SKILL.md` prints nothing. `compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files`.
- [x] T012 Confirm the comments name no packet or spec path (`G`). Verify: `git diff -U0 -- G T | rg -n '^\+.*(specs/|[0-9]{3}-)'` prints nothing. Evidence: One added comment line in the guard mentions a host's own `specs/` folder. It comes from the host spec tree packet and names no packet or spec path.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `node --test T` reports 15 tests and `fail 0`, and `node G` prints `router-sync: 5/5 checks passed`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`. Section 3 holds the reader audit and the literal edits
<!-- /ANCHOR:cross-refs -->

---
