---
title: "Tasks: repo-rules router and rule-set routing audit and optimisation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "repo rules audit tasks"
  - "punctuation repair tasks"
  - "invariant verification tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: repo-rules router and rule-set routing audit and optimisation

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

- [x] T001 Capture baseline invariants before any edit (`scratch/invariant-check.cjs`)
- [x] T002 Confirm the measurement method is token-level, not byte estimate (`tiktoken` `cl100k_base` available)
- [x] T003 [P] Verify the symlink topology of the three sibling repositories by inspection
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Measure the real Gate 5 payload against a 10-turn action corpus, not the router alone
- [x] T005 Determine whether anything at runtime consumes `repo-rules/` frontmatter (`SKILLS_DIR` grep)
- [x] T006 Obtain a mechanism-level reading of `hub-router.json`, `ROUTER.md` and the advisor scorer
- [x] T007 Repair 4 punctuation defects in the router and generalise load rule 4 (`REPO RULES.md`)
- [x] T008 Generalise Gate 5 step 3 and its output line (`AGENTS.md`)
- [x] T009 Repair 31 punctuation defects across 7 rule files (`repo-rules/*.md`)
- [x] T010 Apply the same corrections to the emitted template so the defect is not re-created
      (`.opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rules-router-template.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Re-run the invariant check; confirm 9/9/9, 0 broken links, 164 phrases, 0 collisions
- [x] T012 Confirm every markdown table's row cell count matches its header
- [x] T013 Confirm the router template's one blocking validator error pre-dates this work (`git show HEAD:`)
- [x] T014 Run `validate.sh <folder> --strict` and require an explicit `RESULT: PASSED`
- [x] T015 Re-check `specs/sk-doc/039-*/` for a handed-over `communication.md` change
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
- **Evidence**: See `implementation-summary.md` and `scratch/`
<!-- /ANCHOR:cross-refs -->

---
