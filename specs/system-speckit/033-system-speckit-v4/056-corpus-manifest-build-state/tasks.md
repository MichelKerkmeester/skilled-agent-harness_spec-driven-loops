---
title: "Tasks: Phase 56: Corpus manifest build state"
description: "Ordered tasks to make the corpus walker's skip list independent of whether the checkout is installed and built."
trigger_phrases:
  - "corpus manifest build state tasks"
  - "walker skip list tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 56: Corpus manifest build state

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

- [x] T001 Compare a built checkout's skip list with the committed manifest (`runtime/cli/retrieval/fixtures/corpus-manifest.json`)
  - Evidence: 17 entries only in the committed file (15 hook `.js` links and 2 linked directories as "broken symlink") and 8 only in the built checkout (6 `node_modules`/`dist` directories, the same 2 links as "symlinked directory"), plus one real new `scratch` folder.
- [x] T002 Count the links under the walk roots
  - Evidence: 168 links, 34 named `.md` and 134 others, all 134 tracked.
- [x] T003 [P] Find readers of the skip reasons
  - Evidence: only `runtime/cli/tests/trigger-index.vitest.ts`:335 asserts one; `retrofit-convention.mjs` has its own walker whose output is a per-run artifact, left alone.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Prune `node_modules` and `dist` without a skip entry (`runtime/cli/retrieval/lib/corpus.mjs`)
  - Evidence: `BUILD_OUTPUT_DIR_NAMES`; the directories stay pruned and `EXCLUSIONS` is unchanged.
- [x] T005 Resolve only links named like documents, and record any other link as "symlink not followed" (`runtime/cli/retrieval/lib/corpus.mjs`)
  - Evidence: the link branch of `walkDirectory` no longer reads a non-document link's target.
- [x] T006 Add the build-state test and move the linked-directory case to the new reason (`runtime/cli/tests/trigger-index.vitest.ts`)
  - Evidence: "records the same skipped paths before and after an install and a build"; the case at line 335 now expects "symlink not followed".
- [x] T007 Regenerate the trigger index and fixtures under the new rule
  - Evidence: `generate-trigger-index.mjs` run before commit.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the walker and retrieval suites
  - Evidence: `trigger-index`, `retrieval-coverage-parity`, `retrieval-repo-root` and `dist-freshness-walker` pass, 75 of 75 before the index regeneration.
- [x] T009 Negative controls
  - Evidence: with the previous walker the new test fails. On the real repository, a `git archive` extract of HEAD (unbuilt) and this built checkout differ by 9 and at least 15 skip entries under the previous walker, and by only this phase's new untracked `scratch` folder under the new one.
- [x] T010 Update documentation
  - Evidence: `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` in this phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



