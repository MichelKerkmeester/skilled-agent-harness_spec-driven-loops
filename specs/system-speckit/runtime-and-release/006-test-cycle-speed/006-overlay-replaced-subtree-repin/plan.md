---
title: "Implementation Plan: Phase 6: overlay-replaced-subtree-repin"
description: "A re-pin blocked on an upstream file its own copy wrote inside a folder an overlay replaces whole. The overlay engine now tells that file from a person's edit by comparing it with upstream's bytes."
trigger_phrases:
  - "overlay replaced subtree repin plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: overlay-replaced-subtree-repin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | `node:test` |
| **Storage** | Git objects and the staged tree |
| **Testing** | The five overlay test files |

### Overview
Classification takes an optional reader for upstream bytes. A delete output inside a replaced folder is `overlay-edited` only when its live bytes match that reader's.
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
- [x] Every check named in `tasks.md` run, with its output recorded
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Provenance by byte equality.

### Key Components
- **`commitBytesReader`**: `git cat-file blob <commit>:<path>` in the upstream checkout.
- **`treeBytesReader`**: reads the staged commit tree.
- **`pinnedUpstreamBytes`**: the manifest pin's reader, when the pin names a checkout.

### Data Flow
The planner marks the output, `analyze` passes the reader, and `classifyDestination` compares bytes.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`: a failing test, the fix, and the full overlay test run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three new tests in two files, each confirmed to fail on the unchanged engine, plus the five overlay test files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the engine and test edits. The engine then blocks as before, and Barter's `repin.exclude` keeps working.
<!-- /ANCHOR:rollback -->

---

