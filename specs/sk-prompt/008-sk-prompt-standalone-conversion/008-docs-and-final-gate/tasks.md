---
title: "Tasks: Phase 8: docs-and-final-gate"
description: "Ordered tasks for docs-and-final-gate, each closed with recorded command evidence."
trigger_phrases:
  - "008 phase 008 tasks"
  - "docs-and-final-gate tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: docs-and-final-gate

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

- [x] T001 Sort the remaining references by kind — evidence: Prose and runtime data to edit; changelogs, benchmark reports and recorded terminal output to leave
- [x] T002 Confirm the framework document's runtime twin is a symlink — evidence: One edit covers both surfaces
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove the small-model dispatch mandate — evidence: The dispatch-rules table no longer carries a MUST pointing at a deleted packet
- [x] T004 Rewrite the skill's entry across the three catalogs — evidence: Each now describes a standalone prompt-engineering skill that owns the canonical CLI card
- [x] T005 Repoint the advisor owner-mode values and regenerate the bridges — evidence: Authored inputs edited, generator re-run, output confirmed clean
- [x] T006 Repoint both runtimes' prompt-improver agent at the flattened skill — evidence: Ten files updated across the two agent definitions and the command assets
- [x] T007 Repoint the model-benchmark output at the lane that produces it — evidence: Ten files updated; only changelog mentions remain
- [x] T008 Drop removed directories from the sk-doc directory fixtures — evidence: Frozen manifest 572 to 552 entries
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Re-run the phase-001 gate set from the final state — evidence: Seven gates pass; one hub had staled from a doc edit in this phase and was re-minted before the clean run
- [x] T010 Run the advisor suites — evidence: `Test Files 7 passed (7) | Tests 48 passed (48)`
- [x] T011 Run the routing-accuracy corpus in its exact CI form — evidence: Hash pins match; `overall_pass: true`; accuracy 0.5744 against a 0.5641 baseline and joint TT 109 against 107
- [x] T012 Sweep for task-created residue — evidence: One stray build artifact from a typecheck run was found and removed; no other untracked file outside the intended set
- [x] T013 Audit the skill against the create-skill contract — evidence: `validate_skill_package.py` reports `Detected kind: standalone`, PASS; SKILL.md carries the required section order and all five SMART ROUTING subsections
- [x] T014 Fix the canonical card left at three tiers — evidence: the card kept a model-override tier its five consumers no longer had; card renumbered to two tiers and all 6 `under "Tier N — Deep path"` cross-references realigned
- [x] T015 Restore the README separator lost with the FAQ removal — evidence: `validate_document.py --type readme` went from 1 blocking `general_h2_separator` error to `✅ VALID, Total issues: 0`
- [x] T016 Remove the retired skill from the create-skill contract's own hub declarations — evidence: lockstep-surfaces and the architecture table now list the same 5 hubs the registry glob finds
- [x] T017 Correct the pre-existing `sk-design` hub entries in the same two references — evidence: `sk-design` has no mode-registry.json; both files now agree with disk
- [x] T018 Repoint the synthetic routing fixture at a live hub/mode pair — evidence: fixture now names `sk-doc/sk-create-skill` with a leaf confirmed present in sk-doc's manifest; validator test exits 0
- [x] T019 Regenerate the stale advisor skill graph — evidence: 11 to 13 skills, adding `sk-design-md-generator` and `sk-vision`, removing nothing
- [x] T020 Verify every remaining reference is captured terminal output — evidence: an awk fence-parity check confirms all 5 sit inside fenced blocks
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
