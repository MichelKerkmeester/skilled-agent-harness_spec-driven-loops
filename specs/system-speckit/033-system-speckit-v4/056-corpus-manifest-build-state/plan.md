---
title: "Implementation Plan: Phase 56: Corpus manifest build state"
description: "Make the corpus walker's skip list a function of the tracked tree alone: build-output directories are pruned without a skip entry, and only links named like documents are resolved."
trigger_phrases:
  - "corpus manifest build state plan"
  - "walker skip list"
  - "symlink not followed"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 56: Corpus manifest build state

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES modules), Node |
| **Framework** | None. A command-line generator |
| **Storage** | Committed JSON: the trigger index and its fixtures |
| **Testing** | Vitest, `cli` project |

### Overview
The walker decides what to record from the file system, so its record changed whenever a build created or removed a path. The fix keeps every pruning decision as it is and changes only what gets listed: a build-output directory is pruned silently, and a link that is not a document is recorded under one reason without reading its target.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend in place, inside `walkDirectory`.

### Key Components
- **`BUILD_OUTPUT_DIR_NAMES`**: the excluded directory names an install or a build creates, pruned without a skip entry.
- **Link branch of `walkDirectory`**: resolves a link only when its name ends in `.md`; any other link is recorded as "symlink not followed".

### Data Flow
`generate-trigger-index.mjs` calls `walkCorpus`, which returns the files to index and the skip list; the skip list goes into the manifest's `skippedPaths`, which `manifestHash` does not cover.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new test walks one tree twice, before and after adding `dist` output and a `node_modules` tree, and expects identical skip lists. Run against the previous walker it fails, which is the negative control. The existing walker tests guard document discovery.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the walker and its generator.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit and regenerate the trigger index.
<!-- /ANCHOR:rollback -->

---
