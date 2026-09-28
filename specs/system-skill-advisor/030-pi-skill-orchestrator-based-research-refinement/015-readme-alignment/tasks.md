---
title: "Tasks: README Alignment for the Root and Skill Advisor READMEs"
description: "Task Format: T### [P?] Description (file path). Check, confirm, fix and recheck each README claim, then validate and push."
trigger_phrases:
  - "readme alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: README Alignment for the Root and Skill Advisor READMEs

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

- [x] T001 Scaffold this phase with `create.sh`, write its docs and goal, and bind it in the parent goal within 4,000 characters (`../goal.md`)
- [x] T002 Record the baselines: both README blobs, `validate_document.py` and `hvr_scan.py` on each (`evidence/baselines.txt`)
- [x] T003 [P] Check the root README claims with four read-only agents, one per line range
- [x] T004 [P] Check the advisor README and the root Skill Advisor section against the code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Confirm or reject every suspected drift at its cited source (`evidence/claim-ledger.md`)
- [x] T006 Fix the confirmed drift in the root README (`README.md`)
- [x] T007 Fix the confirmed drift in the advisor README, clear its hard HVR blockers and set its `version` (`.skilled/skills/system-skill-advisor/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Recheck every fixed claim against its source and mark the ledger row (`evidence/recheck.sh`, 48 of 48)
- [x] T009 `validate_document.py --type readme` and `hvr_scan.py` on both READMEs (`evidence/final-checks.txt`)
- [x] T010 `repair-derived` on this phase and the parent, `validate.sh --strict --recursive` on packet 030, `check-goal.cjs` and `goal.cjs packet` at `packet_budget=ok` (`evidence/strict-validate.txt`)
- [x] T011 Recheck `git status` and stage only this phase's paths by name. The commit, the trigger index rebuild and the push follow, and goal criterion 6 covers them
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both READMEs pass the validator and the HVR scan from the final state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence**: See `evidence/claim-ledger.md`
<!-- /ANCHOR:cross-refs -->

---
