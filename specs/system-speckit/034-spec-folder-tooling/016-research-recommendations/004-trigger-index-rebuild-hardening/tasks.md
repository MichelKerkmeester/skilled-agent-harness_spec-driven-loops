---
title: "Tasks: Phase 4: trigger-index-rebuild-hardening"
description: "The task list for Phase 4: trigger-index-rebuild-hardening, each task naming its file. Every task is open because the phase is planned, not built."
trigger_phrases:
  - "trigger index rebuild hardening tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: trigger-index-rebuild-hardening

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
## Phase 1: Implementation

- [ ] T001 [P0] Replace the subject-prefix loop guard (line 24) with an exact subject match or a marker trailer the commit step writes (`.github/workflows/trigger-index-rebuild.yml`)
- [ ] T003 [P0] Stage all four generator files and add a post-commit `--check` (lines 53-61) (`.github/workflows/trigger-index-rebuild.yml`)
- [ ] T004 [P0] On non-fast-forward: fetch, rebase to the tip, regenerate the index, run `--check`, then retry the push once (line 64) (`.github/workflows/trigger-index-rebuild.yml`)
- [ ] T005 [P0] Add distinct error messages for non-fast-forward vs auth vs other failures (line 65) (`.github/workflows/trigger-index-rebuild.yml`)
- [ ] T006 [P1] Document the four generator files, the loop guard and the retry in the workflow README (`.github/workflows/README.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Verification

- [ ] T007 [P0] Verify a commit whose subject only starts with the rebuild subject still runs the job, and the job's own rebuild commit does not
- [ ] T008 [P0] Verify that all four files (`trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`) are staged and present in the commit
- [ ] T009 [P1] Verify the rebase retry logic by simulating a non-fast-forward race condition
- [ ] T010 [P1] Verify a local index build produces the same output as a CI run on the same commit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1 tasks marked `[x]`
- [ ] All Phase 2 verification tasks marked `[x]`
- [ ] Acceptance criteria in `acceptance-criteria.md` show all rows passing
<!-- /ANCHOR:completion -->

---



