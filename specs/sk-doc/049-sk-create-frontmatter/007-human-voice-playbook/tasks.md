---
title: "Tasks: Phase 1: human-voice-playbook"
description: "The nine scenarios in three categories, the two scoring scenarios priced against the packet's own shipped fixtures, the frontmatter shape carried over from phase 005, and the scan of the playbook's own prose with the tool it documents."
trigger_phrases:
  - "human voice playbook tasks"
  - "tell detection scenarios"
  - "scope gate scenarios"
  - "playbook scanned with own tool"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: human-voice-playbook

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

- [x] T001 Settle the three categories against the two directions spec.md asks for: `tell-detection/` for the text the mode must flag, `scope-gate/` for the text it must leave alone, and `scoring-and-rescan/` for the arithmetic
- [x] T002 Carry the frontmatter shape over from phase 005 rather than rediscovering it: omit the `expected_workflow_mode` scalar so the package validator keeps every scenario inside the operator contract, and keep the typed `expected_leaf_resources` gold so the benchmark loader still sees each scenario's leaves
- [x] T003 [P] Identify the packet's shipped clean and dirty fixtures, so the two scoring scenarios are priced against what the packet already ships rather than against invented input
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the playbook root at `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md`, including the index table the loader parses
- [x] T005 Author the three `tell-detection/` scenarios HVT-001 to HVT-003: the hard-blocker terms, a word whose sense makes it a candidate rather than a certainty, and a judgment pass the scanner does not cover
- [x] T006 [P] Author the four `scope-gate/` scenarios HVS-001 to HVS-004: named exempt spans, code and quotations, a document about the standard itself, and the rule that accuracy outranks the standard
- [x] T007 [P] Author the two `scoring-and-rescan/` scenarios HVR-001 to HVR-002, covering the score arithmetic and the rescan after a rewrite
- [x] T008 Price HVT-001 and HVR-001 against the shipped fixtures: HVT-001 runs the dirty fixture and expects 6 hard blockers, -33 mechanical deductions, a 67/100 ceiling and exit 1; HVR-001 runs the clean fixture and expects no mechanical findings, a 100/100 ceiling and exit 0
- [x] T009 Keep the mode itself untouched. Nothing under `sk-create-with-human-voice/` outside `manual-testing-playbook/` is edited, because this phase tests the mode rather than changing what it enforces
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the package validator: `PASS package=sk-doc/sk-create-with-human-voice tier=FAIL_CLOSED scenarios=9 categories=3 operator=9 routing_gold_excluded=0 violations=0 warnings=0` (REQ-001, SC-001)
- [x] T011 Run the benchmark loader: `shape=sk-doc scenarios=9 warnings=[]`. Before this phase the mode had no playbook at all, so the loader found nothing for it and the benchmark scored it on nothing (REQ-002, SC-002)
- [x] T012 Confirm both directions are covered, which is what REQ-003 asks: `tell-detection` is the text the mode must flag, and `scope-gate` is the text it must leave alone, covering exempt spans, code and quotations, a document about the standard itself, and the rule that accuracy outranks the standard (REQ-003)
- [x] T013 Execute both fixture-backed scenarios and confirm they match as written: HVT-001 returns 6 hard blockers, -33 mechanical deductions, a 67/100 ceiling and exit 1; HVR-001 returns no mechanical findings, a 100/100 ceiling and exit 0 (SC-003)
- [x] T014 [P] Run link integrity on the package (`failures=0`) and `d5-connectivity` on the mode (score 100, `stageTwoRouted=5`, zero issues)
- [x] T015 Enrol the package in `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` alongside the frontmatter one
- [x] T016 Scan the playbook's own prose with the tool it documents. All nine scenario files report 0 hard blockers and a 100/100 ceiling. The root reports 1 hard blocker: the semicolon inside the result-persistence contract sentence that the package contract requires verbatim. It is kept and explained in the file itself under the scope gate's "text something else pins" class, which is the same rule the package tests
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T016 all closed
- [x] No `[B]` blocked tasks remaining — `grep '\[B\]' tasks.md` returns nothing
- [x] Manual verification passed — this phase has no `acceptance-criteria.md`; its spec.md carries the acceptance criteria inline, and REQ-001, REQ-002, REQ-003, SC-001, SC-002 and SC-003 are each satisfied by the evidence quoted in T010 through T014
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **The frontmatter shape decision this phase reuses**: `../005-command-and-playbook/plan.md` ADR-002
- **The package itself**: `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md`
<!-- /ANCHOR:cross-refs -->

---


