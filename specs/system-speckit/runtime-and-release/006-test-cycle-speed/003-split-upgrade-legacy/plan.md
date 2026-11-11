---
title: "Implementation Plan: Phase 3: split-upgrade-legacy"
description: "One test file, upgrade-legacy, sets the cli lane's time of about 400 s. Splitting it along its describe blocks lets its pieces run at the same time."
trigger_phrases:
  - "split upgrade legacy plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: split-upgrade-legacy

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest 4.1 |
| **Framework** | Vitest `cli` project |
| **Storage** | A temp git sandbox per file |
| **Testing** | The cli project |

### Overview
The tests move unchanged into four files. The sandbox setup moves into one helper that each file calls in `beforeAll`. Parallel files then run the pieces side by side.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met (REQ-002 with one named exception: two non-assertion lines in one test call the harness setters)
- [x] Every check named in `tasks.md` run, with its output recorded
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shared harness, four test files.

### Key Components
- **The harness**: builds a sandbox, resets it and runs the upgrade and validation subprocesses.
- **Four test files**: each owns one sandbox for its lifetime.

### Data Flow
Each file creates its sandbox before its first test, resets it after each test where the block did before, and removes it at the end.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`. Setup records the test count and lane time. Implementation moves the harness, splits the file and updates both callers. Verification compares count and time.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`vitest list` counts before and after, three runs of `npm run test:cli`, and the lane time against 397 to 430 s.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 2's go.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the lane is not 10% faster, or a run fails. Revert the one commit, which restores the single file and both callers.
<!-- /ANCHOR:rollback -->

---

