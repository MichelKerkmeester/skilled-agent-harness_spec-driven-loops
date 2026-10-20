---
title: "Tasks: Phase 36: cli-opencode-docs-and-vision-test-cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli opencode docs and vision test cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 36: cli-opencode-docs-and-vision-test-cleanup

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

- [x] T001 Record the baselines (`scratch/baseline/`) Done: cli-opencode script tests 13 of 13; sk-vision `bun test tests` 80 of 80, adding 7 `sk-vision-flags-*` and 10 other `sk-vision-*` directories per run; the speckit-completion step 6 snippet exits 1 with `mod.default is not a function`.
- [x] T002 Find every in-process plugin snippet that calls the default export (`manual-testing-playbook/`) Done: seven playbooks, ten calls.
- [x] T003 Find every note that sends a reader to the standalone listing without a prefix (`cli-opencode/`, `cli-devin/`) Done: 39 lines carry `opencode2 models --standalone` without the words prefix, filter or grep; the command lines and tables among them stay.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Quote-aware comment stripping and the listing-source check (`cli-opencode/scripts/tests/opencode2-models-form.test.cjs`)
- [ ] T005 Prose guard and prefix-note guard (`cli-opencode/scripts/tests/opencode2-models-form.test.cjs`)
- [ ] T006 Name the prefix in the listing notes (`cli-opencode/**/*.md`, `cli-devin/references/providers-and-models.md`)
- [ ] T007 Kill-switch tests create no directory (`sk-vision/vision-runtime/tests/plugin.test.ts`)
- [ ] T008 Playbook snippets call `default.server(...)` (seven playbooks)
- [ ] T009 Register this phase in the parent (`../spec.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the cli-opencode script tests and each guard's mutant
- [ ] T011 Run `bun test tests` and count the temp directories it adds
- [ ] T012 Run each changed playbook snippet
- [ ] T013 Run the doc checks: cli-opencode playbook validator, link integrity, sk-doc script tests
- [ ] T014 Luna review, read-only
- [ ] T015 Validate 082 strict and recursive
- [ ] T016 Push to main and confirm CI
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
