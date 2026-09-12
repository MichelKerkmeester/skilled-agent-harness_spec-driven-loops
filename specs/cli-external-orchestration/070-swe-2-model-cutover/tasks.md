---
title: "Tasks: The Devin swe alias already moved to SWE-2"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "swe-2 cutover tasks"
  - "devin roster task breakdown"
  - "alias drift verification checklist"
  - "swe-2 task dependencies"
importance_tier: "normal"
contextType: "general"
---
# Tasks: The Devin swe alias already moved to SWE-2

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read the live roster: `devin models list` on version 3000.10.21, recording every SWE family, id, context window and price
- [x] T002 Inventory the surfaces that name a SWE id, separating live instruction surfaces from changelogs and dated benchmark reports
- [x] T003 [P] Confirm which repo files carry uncommitted changes belonging to other work, so none is swept into this commit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct the alias claim and the SWE family list in the mode contract (`cli-devin/SKILL.md`)
- [x] T005 Add the three SWE-2 roster rows, move the alias claim off the lightning row, and fix the family count (`cli-devin/references/providers-and-models.md`)
- [x] T006 Correct the overview, the `--model` description, the default-dispatch paragraph, four rationale rows and the troubleshooting entry (`cli-devin/references/cli-reference.md`)
- [x] T007 Correct the roster line, default claim, troubleshooting row and model-choice answer (`cli-devin/README.md`)
- [x] T008 Correct the hub roster line and the DEVIN keyword weight (`ROUTER.md`)
- [x] T009 Widen the advisor vocabulary with `swe-2` across all three hub metadata files, validating each as JSON before writing
- [x] T010 Remove the duplicate vocabulary line a substring match inserted at the wrong indentation (`graph-metadata.json`)
- [x] T011 Probe `swe-2-max` live before wiring it anywhere, because a documented id that fails at resolution is the failure this repository has already hit once
- [x] T012 Add the three SWE-2 ids to the fan-out supported set and correct the alias claim in its doc comment (`lib/deep-loop/executor-config.ts`)
- [x] T013 Add the same three to the synchronous copy the lineage builder reads (`scripts/fanout-run.cjs`)
- [x] T013a Complete the positive allowlist fixture and pin the bare `swe-2` as a negative (`tests/unit/fanout-run.vitest.ts`)
- [x] T013b Write the roster-change changelog entry and bump the mode version (`cli-devin/changelog/v1.4.2.0.md`)
- [x] T013c Add the `version` field the repository frontmatter gate was failing on (`system-skill-advisor/references/runtime/cli-front-door-contract.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Scan for surviving alias claims and the 37-family figure outside `changelog/`
- [x] T015 Cross-check every written id against the `devin models list` output, including that no bare `swe-2` id exists
- [x] T016 Run the three deep-loop suites that read the allowlist and read their counts
- [x] T016a Run `check-frontmatter-versions.sh` across the repository and require zero failures
- [x] T017 Run `compiled-route-guard.cjs` and confirm the hub is re-minted fresh
- [x] T018 Run `validate.sh --strict` on this packet and require `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

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
