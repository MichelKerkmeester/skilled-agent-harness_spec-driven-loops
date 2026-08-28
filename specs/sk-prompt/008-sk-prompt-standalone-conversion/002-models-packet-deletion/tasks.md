---
title: "Tasks: Phase 2: models-packet-deletion"
description: "Ordered tasks for models-packet-deletion, each closed with recorded command evidence."
trigger_phrases:
  - "008 phase 002 tasks"
  - "models-packet-deletion tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: models-packet-deletion

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

- [x] T001 Map every consumer of the registry before deleting anything — evidence: `grep -rn 'model-profiles' .opencode` identified 2 runtime readers, 1 CI guard, 1 pre-commit regex and 1 fixture branch
- [x] T002 Confirm both readers fail soft rather than throw — evidence: `executor-delegation.ts` guards with `existsSync`; `skill_advisor.py` wraps the read in `try/except` - so deletion degrades routing rather than crashing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove the model-alias branch from the TypeScript resolver — evidence: 5 coordinated edits applied; `grep -n 'modelAlias|model-profiles|ModelProfileEntry' executor-delegation.ts` returns nothing
- [x] T004 Confirm the resolver still typechecks — evidence: `npx tsc --noEmit` produced 34 TS6059 and 1 TS5101, all pre-existing config errors; zero errors name executor-delegation.ts
- [x] T005 Remove the mirrored branch from the Python scorer — evidence: Block removed and the stale docstring cross-reference rewritten; `python3 -m py_compile` succeeds
- [x] T006 Drop the `direct-alias-model` cases from the shared fixture — evidence: `cases` went 11 to 9; the fixture description no longer claims model metadata as a source
- [x] T007 Delete the packet — evidence: `test ! -d .opencode/skills/sk-prompt/sk-prompt-models` succeeds
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Watch the suite fail for the recorded reason before adjusting it — evidence: `expected 9 to be greater than or equal to 10` at executor-delegation.vitest.ts:177 - the count floor, not a routing regression
- [x] T009 Lower the fixture floor to the new branch count — evidence: Floor set to 9 with the reason recorded inline; all three required branches still present
- [x] T010 Run both delegation suites — evidence: `Test Files 2 passed (2) | Tests 10 passed (10)`, including TS-native versus Python parity
- [x] T011 Run the three routing suites CI runs in its lean job — evidence: `Test Files 3 passed (3) | Tests 21 passed (21)`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — evidence: every task above carries a recorded command result
- [x] No `[B]` blocked tasks remaining — evidence: no task in this phase entered a blocked state
- [x] Manual verification passed — evidence: see the Verification table in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
