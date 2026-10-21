---
title: "Implementation Plan: Phase 41: goal-held-fixes"
description: "Fix the nine goal plugin and goal core findings that phase 039 held for the operator, one short writer brief per fix, each with a test that fails without it, verified by Luna."
trigger_phrases:
  - "goal held fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 41: goal-held-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM plugin, CommonJS core and CLI), Node 22 and 26 |
| **Framework** | OpenCode plugin API through the repository's v1/v2 bridge |
| **Storage** | JSON state and archive files under the goal state directory |
| **Testing** | `node --test` |

### Overview
Each finding gets one writer brief that changes one thing and adds its test. DeepSeek v4.1 flash at max effort through cli-pi writes; Luna at max effort on the fast tier verifies each change read-only; the orchestrator reruns the suites and a mutation that restores the old code for each test.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each finding's full text read in 039's Luna confirmations
- [x] Baseline suite counts recorded

### Definition of Done
- [ ] Every finding has a fix commit and a test that fails without it
- [ ] Suites at or above baseline; CI green at the pushed commit
- [ ] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Plugin and shared core keep separate stores, so the plugin is aligned to the core's behaviour rather than its code.

### Key Components
- **`mutateGoal`** (plugin): the serialized read-mutate-write step. A dedicated delete marker replaces the `null` convention.
- **Archive writer** (plugin): one helper that writes a record under a name derived from the session, the goal id and the record's content, used by session deletion, replace, clear and rebind.
- **`readGoalRecordForScope` and `listArchivedGoals`** (core): the current-record read and the history listing.
- **`goal.cjs`** (CLI): the scope check before any current-session action.

### Data Flow
A mutation reads the session record, the mutator returns a new record, `undefined` for no change, `null` for no change, or the delete marker. Replace and clear write the prior record to the archive before the active file changes. History lists the archive newest first.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---

