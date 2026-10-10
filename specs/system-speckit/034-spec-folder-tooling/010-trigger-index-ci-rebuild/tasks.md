---
title: "Tasks: Phase 10: trigger-index-ci-rebuild"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "trigger index ci rebuild tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: trigger-index-ci-rebuild

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the scope decision, repair in CI after merge and keep the pull request step report-only (`spec.md`)
- [x] T002 Review the generator and its `--check` mode that the job calls (`runtime/cli/retrieval/generate-trigger-index.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Create the rebuild workflow with the trigger surface, pushes to `main` and `skilled/**` plus manual dispatch, and `contents: write` (`.github/workflows/trigger-index-rebuild.yml`)
- [x] T004 Add the race and loop guards, a concurrency group per ref and a skip when the head commit's subject is the rebuild subject (`.github/workflows/trigger-index-rebuild.yml`)
- [x] T012 Check out with the `TRIGGER_INDEX_PUSH_TOKEN` secret, falling back to the default token, and give the rebuild commit a body so it passes the commit-message check (`.github/workflows/trigger-index-rebuild.yml`)
- [x] T013 Operator creates a fine-grained token for this repository with Contents read and write, and runs `gh secret set TRIGGER_INDEX_PUSH_TOKEN` (set on 2026-10-07 after its admin and push access were confirmed)
- [x] T005 Pin the checkout and setup-node actions and Node 20 the way the advisory workflow does, later raised to Node 22 by T014 (`.github/workflows/trigger-index-rebuild.yml`)
- [x] T006 Run the generator, commit only `runtime/data/trigger-index.json` when `git diff` shows a change, and print an error that names branch protection when the push fails (`.github/workflows/trigger-index-rebuild.yml`)
- [x] T007 Point the advisory drift message at the rebuild workflow (`.github/workflows/advisory-checks.yml`)
- [x] T014 Install the system-spec-kit workspace and build its shared package before the generator runs, and move to Node 22 like the other spec-kit jobs. The first live run on 2026-10-07 failed with `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared`, because a clean runner has no workspace link (`.github/workflows/trigger-index-rebuild.yml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Parse the new workflow as YAML (passed)
- [x] T009 Run `actionlint` over the workflow. Exit 0 with no output on the working tree and on HEAD (`scratch/evidence/actionlint-trigger-index-rebuild.txt`, sections 1 and 2) (`.github/workflows/trigger-index-rebuild.yml`)
- [x] T010 Check the commit step's shell block with `bash -n` (exit 0 on the 16-line block extracted from the parsed YAML at the time. The HEAD block is now 114 lines and also passes, `scratch/evidence/actionlint-trigger-index-rebuild.txt` section 3)
- [x] T011 Confirm the first live run commits the index and makes `--check` pass. Run 37704306595 pushed the first rebuild commit 2d2c8fcd55, but that workflow version had no in-job `--check`. The `--check` result is in run 37986342243, which pushed the current head 4669db6522 after printing "trigger index matches the corpus" with 0 stale documents (`scratch/evidence/ci-bot-commit-proof.txt` sections 4 and 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed, the first live push leaves the index current (`scratch/evidence/ci-bot-commit-proof.txt` sections 4 and 5)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
