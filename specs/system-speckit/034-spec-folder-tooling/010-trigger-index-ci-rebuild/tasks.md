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
- [ ] T013 [B] Operator creates a fine-grained token for this repository with Contents read and write, and runs `gh secret set TRIGGER_INDEX_PUSH_TOKEN`
- [x] T005 Pin the checkout and setup-node actions and Node 20 the way the advisory workflow does (`.github/workflows/trigger-index-rebuild.yml`)
- [x] T006 Run the generator, commit only `runtime/data/trigger-index.json` when `git diff` shows a change, and print an error that names branch protection when the push fails (`.github/workflows/trigger-index-rebuild.yml`)
- [x] T007 Point the advisory drift message at the rebuild workflow (`.github/workflows/advisory-checks.yml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Parse the new workflow as YAML (passed)
- [ ] T009 [B] Run `actionlint` over the workflow (not installed in this environment)
- [x] T010 Check the commit step's shell block with `bash -n` (exit 0 on the 16-line block extracted from the parsed YAML)
- [ ] T011 [B] Confirm the first live run commits the index and makes `--check` pass (a live run needs a push, which has not happened)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed, the first live push leaves the index current
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
