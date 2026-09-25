---
title: "Tasks: Make 4000 characters the one limit for a parent goal durable slice"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "parent goal limit"
  - "goal warning tier"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Make 4000 characters the one limit for a parent goal durable slice

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

- [x] T001 Find every place the parent goal budget is defined, checked, reported or described: manifest, two resolvers, validator, goal-slice, `goal.cjs`, the OpenCode plugin, template, references, READMEs, tests and snapshot
- [x] T002 Check whether 3000 protects anything: the runtime caps are 4000 for objective and prompt and 4800 for the injection block, and the tier's own decision record calls it an early warning under an operator limit of 4000
- [x] T003 Reproduce the symptom on copies of a real phase parent padded to 3500 and 4000: `packet_budget=warn` and a `SPECDOC_SUFFICIENCY_005` warning
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Keep only `errorChars: 4000` in `goalDurableBudget` (`templates/spec-kit-docs.json`)
- [x] T005 One-limit budget type and resolver, and no warning branch (`runtime/lib/templates/level-contract-resolver.ts`, `runtime/lib/validation/spec-doc-structure.ts`)
- [x] T006 One-limit resolver and no `warn` state (`hooks/goal/lib/goal-slice.cjs`)
- [x] T007 The bind warning fires only past the limit and names it, on both surfaces (`hooks/goal/bin/goal.cjs`, `.opencode/plugins/opencode-goal.js`)
- [x] T008 [P] Restate the one limit (`templates/addons/goal.md.tmpl`, `references/validation/validation-rules.md`, `references/workflows/goal-set-string-playbook.md`, the skill `README.md`, the root `README.md`, `hooks/goal/goal-plugin.md`)
- [x] T009 Replace the warning-tier test with a pass at 3200 and 4000, add a goal-slice boundary test on a manifest that still carries the old tier, and update the scaffold snapshot
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rebuild the runtime dist and typecheck: both exit 0
- [x] T011 Goal hook suites, OpenCode plugin suites, validator suite, scaffold snapshot, template parity and level contract suites, all against the pre-change baseline
- [x] T012 The new boundary test fails against the previous `goal-slice.cjs`
- [x] T013 Synthetic packets at 2998, 3500 and 4000 report `ok` and pass `validate.sh`; 4001 reports `over` and fails
- [x] T014 A search finds no 3000 goal tier left outside released changelogs and packet docs
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Follow-ups

- [x] T015 Trace the validator's phase level to `detectLevel()`: the canonical phase-parent classifier with its generator-hardening switch, then the level `spec.md` declares
- [x] T016 Write the nested-parent, plain-child, hardening-switch and declared-level tests and run them red on the unfixed module: 3 of 4 fail, the plain-child guard passes as intended (`hooks/goal/lib/goal-slice.test.cjs`)
- [x] T017 Mirror that rule in the runtime so a nested phase parent is budgeted (`hooks/goal/lib/goal-slice.cjs`)
- [x] T018 Check the guard test against wrong fixes, and `goal.cjs` against `validate.sh` on five shapes with hardening on and off
- [x] T019 Replace the old slice note in the 49 scaffolded goal documents, re-derive their graph metadata, and re-validate each packet strict
<!-- /ANCHOR:phase-4 -->

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
