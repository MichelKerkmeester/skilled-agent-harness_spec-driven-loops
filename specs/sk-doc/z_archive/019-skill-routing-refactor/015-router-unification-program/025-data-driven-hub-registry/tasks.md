---
title: "Tasks: Phase 25: data-driven hub registry"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "data driven hub registry tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 25: data-driven hub registry

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

`R` is `.skilled/bin/lib/compiled-routing/`. `A` is the authored program root, `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Work on the sk-git worktree (`worktrees/544-upstream-overlay-mechanisms`). Verify: `git branch --show-current` prints that branch.
- [x] T002 Capture the gates and the route, guard, admission, status and sync baselines (`/tmp/upstream-544/`). Verify: `route-before.tsv` holds 121 lines and `.skilled/bin/tests` passes 196 with 1 skipped.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the registry, consumer-append and refusal tests (`.skilled/bin/tests/compiled-route-hub-registry.test.cjs`). Verify: on the unchanged code 19 of 20 fail.
- [x] T004 Write the advisor registry tests (`compiled-routing-hub-registry.vitest.ts`). Verify: on the unchanged advisor 15 of 15 fail.
- [x] T005 Add the registry with the eight hubs in today's order, in both trees (`R/hub-registry.json`, `A/hub-registry.json`). Verify: `diff` of the two files exits 0.
- [x] T006 Add the validating reader in both trees (`014-runtime-engine/lib/hub-registry.cjs`). Verify: the refusal tests in T003's file pass.
- [x] T007 Read the hub set from the registry in the engine, resolver, guard and sync (`compiled-route.cjs`). Verify: the foundation vitest's hub-set test passes and `.skilled/bin/tests` exits 0.
- [x] T008 Add the dependency-free, fail-closed reader to the advisor (`compiled-routing-flag.ts`). Verify: T004's file passes 15 of 15.
- [x] T009 Regenerate the serving closure with sync (`R/serving-closure.manifest.json`). Verify: `sync --verify` prints `all 63 served copies match their authored files`.
- [x] T010 Update the architecture doc and the catalogs that named the old lists (`compiled-routing-architecture.md`). Verify: `rg -n 'hub-registry.json' .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` prints a line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Diff the route outputs against the baseline (`/tmp/upstream-544/route-after.tsv`). Verify: `cmp route-before.tsv route-after.tsv` exits 0, and the guard JSON, admission `--all` and status pairs match.
- [x] T012 Apply the consumer's `appendItems` entry for sk-git to a temp root twice (`R/hub-registry.json`). Verify: the first apply reports 1 changed and the second 0.
- [x] T013 Run `@review` over the branch and fix its findings (`compiled-route-sync.cjs`). Verify: the verdict is APPROVED with no P0 or P1, and the sync fix lands in `bf022a67b20`.
- [x] T014 Rerun the gates on the final branch (`.skilled/bin/tests/`). Verify: 218 pass with 1 skipped, bin vitest 95 of 95, and the advisor vitest 3545 with 4 skipped.
- [x] T015 Validate this folder (`025-data-driven-hub-registry/`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The review verdict is recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
