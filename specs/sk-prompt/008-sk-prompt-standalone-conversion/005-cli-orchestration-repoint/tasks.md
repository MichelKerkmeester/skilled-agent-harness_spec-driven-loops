---
title: "Tasks: Phase 5: cli-orchestration-repoint"
description: "Ordered tasks for cli-orchestration-repoint, each closed with recorded command evidence."
trigger_phrases:
  - "008 phase 005 tasks"
  - "cli-orchestration-repoint tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: cli-orchestration-repoint

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

- [x] T001 Split the references by whether their target survived — evidence: 63 pointed at the canonical card that moved; the remainder asserted the deleted per-model contract
- [x] T002 Enumerate the distinct relative forms of the card path — evidence: Six prefixes from bare to four levels up, all sharing one inner segment
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Substitute the shared inner path segment across all card references — evidence: 19 files rewritten; a search for the old path returns 0
- [x] T004 Remove the model-override tier and renumber across the executor SKILL.md files — evidence: Five files; the composition rule now reads as a two-tier rule
- [x] T005 Remove the retired packet's related-skills row from each README — evidence: Four rows removed
- [x] T006 Rewrite the two cards that carried a whole per-model section — evidence: The Devin card lost its model-override table and renumbered its remaining sections; the Pi and Cursor cards lost their override tier
- [x] T007 Delete the two scenarios whose subject was the deleted packet — evidence: Feature file removed and its scenario body, index row, wave entry and section header removed with it
- [x] T008 Rewrite the design-context scenario to keep its surviving half — evidence: The measured Style Reference contract remains; the per-model profile half and its command step were removed and the step numbering closed up
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Search the CLI hub for the retired name — evidence: 0 hits across live surfaces
- [x] T010 Resolve every canonical-card reference against disk — evidence: 68 resolved, 0 broken
- [x] T011 Run the repository-wide link-integrity guard — evidence: `13790 links checked, 0 broken`
- [x] T012 Re-run the drift guard — evidence: `GUARD PASS`, exit 0
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
